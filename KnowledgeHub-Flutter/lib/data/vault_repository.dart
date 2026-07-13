import 'dart:convert';

import 'package:flutter/services.dart' show rootBundle;

import '../models/vault_models.dart';

/// In-memory data layer for the KnowledgeVault.
///
/// The vault is baked at build time into assets/vault_data.json (see
/// tool/build_vault_data.dart), since the Android app can't read the host
/// filesystem the way the Next.js client does. This repository loads that
/// JSON once and serves every screen from memory — mirroring
/// KnowledgeHub-Client/lib/vault.ts and lib/search-index.ts.
class VaultRepository {
  VaultRepository._(this._nodes, this._searchIndex);

  final List<VaultNode> _nodes;
  final List<SearchIndexEntry> _searchIndex;

  static Future<VaultRepository>? _loading;

  static Future<VaultRepository> load() {
    return _loading ??= _load();
  }

  static Future<VaultRepository> _load() async {
    final raw = await rootBundle.loadString('assets/vault_data.json');
    final json = jsonDecode(raw) as Map<String, dynamic>;

    final nodes = (json['nodes'] as List)
        .map((n) => VaultNode.fromJson(n as Map<String, dynamic>))
        .toList();
    final searchIndex = (json['searchIndex'] as List)
        .map((e) => SearchIndexEntry.fromJson(e as Map<String, dynamic>))
        .toList();

    return VaultRepository._(nodes, searchIndex);
  }

  List<SearchIndexEntry> get searchIndex => _searchIndex;

  VaultNode? getNode(String id) {
    for (final node in _nodes) {
      if (node.id == id) return node;
    }
    return null;
  }

  String? titleOf(String id) {
    for (final entry in _searchIndex) {
      if (entry.id == id) return entry.title;
    }
    return null;
  }

  /// Top-level topics — entries with no parent — sorted alphabetically by title.
  List<SearchIndexEntry> get chapters {
    final result = _searchIndex.where((entry) => entry.parent == null).toList()
      ..sort((a, b) => a.title.compareTo(b.title));
    return result;
  }

  /// Resolve the parent/current/children tree for a topic, dropping any
  /// dangling references (ids not present in the index).
  TopicTree treeFor(VaultNode node) {
    TreeRef? parent;
    final parentId = node.frontmatter.parent;
    if (parentId != null) {
      final title = titleOf(parentId);
      if (title != null) parent = TreeRef(id: parentId, title: title);
    }

    final children = <TreeRef>[];
    for (final childId in node.frontmatter.children) {
      final title = titleOf(childId);
      if (title != null) children.add(TreeRef(id: childId, title: title));
    }

    return TopicTree(
      parent: parent,
      current: TreeRef(id: node.id, title: node.frontmatter.title),
      children: children,
    );
  }
}
