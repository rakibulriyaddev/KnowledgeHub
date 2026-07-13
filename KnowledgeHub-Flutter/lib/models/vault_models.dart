enum TopicStatus { draft, complete }

TopicStatus topicStatusFrom(dynamic value) =>
    value == 'complete' ? TopicStatus.complete : TopicStatus.draft;

class Frontmatter {
  final String id;
  final String title;
  final String? created;
  final String? modified;
  final List<String> tags;
  final String? parent;
  final List<String> children;
  final TopicStatus status;

  const Frontmatter({
    required this.id,
    required this.title,
    required this.created,
    required this.modified,
    required this.tags,
    required this.parent,
    required this.children,
    required this.status,
  });

  factory Frontmatter.fromJson(Map<String, dynamic> json) => Frontmatter(
    id: json['id'] as String,
    title: json['title'] as String,
    created: json['created'] as String?,
    modified: json['modified'] as String?,
    tags: (json['tags'] as List).cast<String>(),
    parent: json['parent'] as String?,
    children: (json['children'] as List).cast<String>(),
    status: topicStatusFrom(json['status']),
  );
}

/// A single renderable file within a topic: `_index.md` (labelled "Overview")
/// or a sibling file (e.g. "qa.md" labelled "Q&A").
class Panel {
  final String name;
  final String label;
  final String body;
  final String raw;

  const Panel({
    required this.name,
    required this.label,
    required this.body,
    required this.raw,
  });

  factory Panel.fromJson(Map<String, dynamic> json) => Panel(
    name: json['name'] as String,
    label: json['label'] as String,
    body: json['body'] as String,
    raw: json['raw'] as String,
  );
}

/// A topic folder: its frontmatter plus every panel (`_index.md` first, then
/// each sibling file).
class VaultNode {
  final String id;
  final Frontmatter frontmatter;
  final List<Panel> panels;

  const VaultNode({
    required this.id,
    required this.frontmatter,
    required this.panels,
  });

  factory VaultNode.fromJson(Map<String, dynamic> json) => VaultNode(
    id: json['id'] as String,
    frontmatter: Frontmatter.fromJson(
      json['frontmatter'] as Map<String, dynamic>,
    ),
    panels: (json['panels'] as List)
        .map((p) => Panel.fromJson(p as Map<String, dynamic>))
        .toList(),
  );
}

/// Metadata-only projection of a node, used for search and listings.
class SearchIndexEntry {
  final String id;
  final String title;
  final List<String> tags;
  final String? parent;
  final List<String> children;
  final String? created;
  final String? modified;
  final TopicStatus status;

  const SearchIndexEntry({
    required this.id,
    required this.title,
    required this.tags,
    required this.parent,
    required this.children,
    required this.created,
    required this.modified,
    required this.status,
  });

  factory SearchIndexEntry.fromJson(Map<String, dynamic> json) =>
      SearchIndexEntry(
        id: json['id'] as String,
        title: json['title'] as String,
        tags: (json['tags'] as List).cast<String>(),
        parent: json['parent'] as String?,
        children: (json['children'] as List).cast<String>(),
        created: json['created'] as String?,
        modified: json['modified'] as String?,
        status: topicStatusFrom(json['status']),
      );
}

/// A resolved parent/child reference (id + display title), used to render
/// the topic tree nav without dangling links.
class TreeRef {
  final String id;
  final String title;
  const TreeRef({required this.id, required this.title});
}

class TopicTree {
  final TreeRef? parent;
  final TreeRef current;
  final List<TreeRef> children;
  const TopicTree({required this.parent, required this.current, required this.children});
}
