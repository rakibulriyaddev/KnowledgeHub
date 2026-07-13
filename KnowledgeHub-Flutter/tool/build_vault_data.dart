import 'dart:convert';
import 'dart:io';

import 'package:yaml/yaml.dart';

/// Build-time generator for assets/vault_data.json.
///
/// Mirrors the logic in KnowledgeHub-Client/lib/vault.ts and
/// scripts/build-search-index.ts: reads the local KnowledgeVault (a sibling
/// folder in this monorepo) and bakes every topic's frontmatter + panel
/// bodies + a compact search index into one JSON asset, since the Android
/// app can't read the host filesystem at runtime. Run via `dart run
/// tool/build_vault_data.dart` before `flutter run`/`flutter build`.
void main() {
  final vaultDir = Directory(
    Platform.environment['VAULT_DIR']?.trim().isNotEmpty == true
        ? Platform.environment['VAULT_DIR']!.trim()
        : '../KnowledgeVault',
  );

  final nodes = <Map<String, dynamic>>[];

  if (vaultDir.existsSync()) {
    final topicDirs = vaultDir
        .listSync()
        .whereType<Directory>()
        .where((d) => File('${d.path}/_index.md').existsSync())
        .toList()
      ..sort((a, b) => _baseName(a.path).compareTo(_baseName(b.path)));

    for (final dir in topicDirs) {
      final id = _baseName(dir.path);
      final indexRaw = File('${dir.path}/_index.md').readAsStringSync();
      final parsedIndex = _parseFrontmatter(indexRaw);
      final frontmatter = _normalizeFrontmatter(parsedIndex.data, id);

      final panels = <Map<String, dynamic>>[
        {
          'name': '_index.md',
          'label': 'Overview',
          'body': parsedIndex.body,
          'raw': indexRaw,
        },
      ];

      final siblingFiles = dir
          .listSync()
          .whereType<File>()
          .where(
            (f) =>
                f.path.toLowerCase().endsWith('.md') &&
                _baseName(f.path) != '_index.md',
          )
          .toList()
        ..sort((a, b) => _baseName(a.path).compareTo(_baseName(b.path)));

      for (final file in siblingFiles) {
        final raw = file.readAsStringSync();
        final parsed = _parseFrontmatter(raw);
        final title = parsed.data['title'];
        final label = (title is String && title.trim().isNotEmpty)
            ? title.trim()
            : _humanizeFilename(_baseName(file.path));
        panels.add({
          'name': _baseName(file.path),
          'label': label,
          'body': parsed.body,
          'raw': raw,
        });
      }

      nodes.add({'id': id, 'frontmatter': frontmatter, 'panels': panels});
    }
  }

  final searchIndex = nodes.map((node) {
    final fm = node['frontmatter'] as Map<String, dynamic>;
    return {
      'id': node['id'],
      'title': fm['title'],
      'tags': fm['tags'],
      'parent': fm['parent'],
      'children': fm['children'],
      'created': fm['created'],
      'modified': fm['modified'],
      'status': fm['status'],
    };
  }).toList()
    ..sort((a, b) => (a['id'] as String).compareTo(b['id'] as String));

  final output = {'nodes': nodes, 'searchIndex': searchIndex};

  final outFile = File('assets/vault_data.json');
  outFile.parent.createSync(recursive: true);
  outFile.writeAsStringSync(
    '${const JsonEncoder.withIndent('  ').convert(output)}\n',
  );

  stdout.writeln(
    '[build_vault_data] wrote ${nodes.length} topic(s) -> assets/vault_data.json',
  );
}

String _baseName(String path) {
  final normalized = path.replaceAll('\\', '/');
  return normalized.substring(normalized.lastIndexOf('/') + 1);
}

class _ParsedMarkdown {
  final Map<String, dynamic> data;
  final String body;
  _ParsedMarkdown(this.data, this.body);
}

/// Split `---\nYAML\n---\nbody` frontmatter, never throwing on malformed YAML.
_ParsedMarkdown _parseFrontmatter(String raw) {
  if (!raw.startsWith('---')) return _ParsedMarkdown({}, raw);

  final lines = raw.split('\n');
  if (lines.first.trim() != '---') return _ParsedMarkdown({}, raw);

  final closingIndex = lines.indexWhere(
    (line) => line.trim() == '---',
    1,
  );
  if (closingIndex == -1) return _ParsedMarkdown({}, raw);

  final yamlBlock = lines.sublist(1, closingIndex).join('\n');
  final body = lines.sublist(closingIndex + 1).join('\n');

  try {
    final parsed = loadYaml(yamlBlock);
    if (parsed is YamlMap) {
      return _ParsedMarkdown(_yamlMapToDartMap(parsed), body);
    }
    return _ParsedMarkdown({}, body);
  } catch (_) {
    return _ParsedMarkdown({}, raw);
  }
}

Map<String, dynamic> _yamlMapToDartMap(YamlMap map) {
  final result = <String, dynamic>{};
  map.forEach((key, value) {
    result[key.toString()] = _yamlValueToDart(value);
  });
  return result;
}

dynamic _yamlValueToDart(dynamic value) {
  if (value is YamlMap) return _yamlMapToDartMap(value);
  if (value is YamlList) return value.map(_yamlValueToDart).toList();
  return value;
}

List<String> _toStringArray(dynamic value) {
  if (value is List) {
    return value
        .map((v) => v.toString().trim())
        .where((s) => s.isNotEmpty)
        .toList();
  }
  if (value is String) {
    return value
        .split(',')
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();
  }
  return [];
}

/// Normalize a date to a YYYY-MM-DD string, or null.
String? _toDateString(dynamic value) {
  if (value is DateTime) {
    return value.toIso8601String().substring(0, 10);
  }
  if (value is String && value.trim().isNotEmpty) {
    final trimmed = value.trim();
    final parsed = DateTime.tryParse(trimmed);
    // Keep already-clean YYYY-MM-DD strings as-is; only reformat if parseable
    // and not already in that exact shape (mirrors gray-matter's Date coercion).
    if (parsed != null && !RegExp(r'^\d{4}-\d{2}-\d{2}$').hasMatch(trimmed)) {
      return parsed.toIso8601String().substring(0, 10);
    }
    return trimmed;
  }
  return null;
}

String? _toParent(dynamic value) {
  if (value is String) {
    final trimmed = value.trim();
    if (trimmed.isNotEmpty && trimmed.toLowerCase() != 'null') return trimmed;
  }
  return null;
}

String _toStatus(dynamic value) => value == 'complete' ? 'complete' : 'draft';

Map<String, dynamic> _normalizeFrontmatter(
  Map<String, dynamic> data,
  String fallbackId,
) {
  final idValue = data['id'];
  final id = (idValue is String && idValue.trim().isNotEmpty)
      ? idValue.trim()
      : fallbackId;
  final titleValue = data['title'];
  final title = (titleValue is String && titleValue.trim().isNotEmpty)
      ? titleValue.trim()
      : fallbackId;

  return {
    'id': id,
    'title': title,
    'created': _toDateString(data['created']),
    'modified': _toDateString(data['modified']),
    'tags': _toStringArray(data['tags']),
    'parent': _toParent(data['parent']),
    'children': _toStringArray(data['children']),
    'status': _toStatus(data['status']),
  };
}

String _humanizeFilename(String name) {
  final base = name.replaceAll(RegExp(r'\.md$', caseSensitive: false), '');
  if (base.toLowerCase() == 'qa') return 'Q&A';
  final spaced = base.replaceAll(RegExp(r'[-_]+'), ' ');
  return spaced.replaceAllMapped(
    RegExp(r'\b\w'),
    (m) => m.group(0)!.toUpperCase(),
  );
}
