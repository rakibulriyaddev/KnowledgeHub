import 'package:flutter/material.dart';

import '../data/vault_repository.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/markdown_view.dart';
import '../widgets/metadata_header.dart';
import '../widgets/panel_selector.dart';
import '../widgets/topic_tree_nav.dart';
import 'not_found_screen.dart';

/// Mirrors app/topic/[id]/page.tsx.
class TopicScreen extends StatefulWidget {
  const TopicScreen({super.key, required this.repository, required this.id});

  final VaultRepository repository;
  final String id;

  @override
  State<TopicScreen> createState() => _TopicScreenState();
}

class _TopicScreenState extends State<TopicScreen> {
  late String _active;

  @override
  void initState() {
    super.initState();
    final node = widget.repository.getNode(widget.id);
    _active = node?.panels.first.name ?? '_index.md';
  }

  @override
  void didUpdateWidget(covariant TopicScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.id != widget.id) {
      final node = widget.repository.getNode(widget.id);
      _active = node?.panels.first.name ?? '_index.md';
    }
  }

  @override
  Widget build(BuildContext context) {
    final node = widget.repository.getNode(widget.id);
    if (node == null) return const NotFoundScreen();

    final tree = widget.repository.treeFor(node);
    final activePanel = node.panels.firstWhere(
      (p) => p.name == _active,
      orElse: () => node.panels.first,
    );

    return AppScaffold(
      showDrawer: false,
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          if (tree.parent != null || tree.children.isNotEmpty) ...[
            Card(
              margin: EdgeInsets.zero,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: TopicTreeNav(tree: tree),
              ),
            ),
            const SizedBox(height: 16),
          ],
          MetadataHeader(frontmatter: node.frontmatter),
          PanelSelector(
            panels: node.panels,
            active: _active,
            onSelect: (name) => setState(() => _active = name),
          ),
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 220),
            transitionBuilder: (child, animation) => FadeTransition(opacity: animation, child: child),
            child: MarkdownView(key: ValueKey(activePanel.name), body: activePanel.body),
          ),
        ],
      ),
    );
  }
}
