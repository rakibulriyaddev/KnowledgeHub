import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../data/topic_status_controller.dart';
import '../models/vault_models.dart';
import 'read_status_dot.dart';

/// Mirrors the TreeNav in components/TopicSidebar.tsx: parent link, current
/// topic, and child links. Rendered inline (no desktop/mobile split — this
/// app is Android-only, so there's just one layout).
class TopicTreeNav extends StatelessWidget {
  const TopicTreeNav({super.key, required this.tree});

  final TopicTree tree;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final statusController = context.watch<TopicStatusController>();
    final labelStyle = theme.textTheme.labelSmall?.copyWith(
      fontWeight: FontWeight.w600,
      letterSpacing: 0.5,
      color: theme.colorScheme.onSurfaceVariant,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (tree.parent != null) ...[
          Text('PARENT', style: labelStyle),
          const SizedBox(height: 4),
          _NavTile(
            label: '↑ ${tree.parent!.title}',
            isRead: statusController.isRead(tree.parent!.id),
            onTap: () => context.push('/topic/${tree.parent!.id}'),
          ),
          const SizedBox(height: 16),
        ],
        Text('CURRENT', style: labelStyle),
        const SizedBox(height: 4),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: theme.colorScheme.primaryContainer.withValues(alpha: 0.4),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  tree.current.title,
                  style: TextStyle(fontWeight: FontWeight.w600, color: theme.colorScheme.primary),
                ),
              ),
              const SizedBox(width: 8),
              ReadStatusDot(isRead: statusController.isRead(tree.current.id)),
            ],
          ),
        ),
        if (tree.children.isNotEmpty) ...[
          const SizedBox(height: 16),
          Text('CHILDREN', style: labelStyle),
          const SizedBox(height: 4),
          for (final child in tree.children)
            _NavTile(
              label: '↳ ${child.title}',
              isRead: statusController.isRead(child.id),
              onTap: () => context.push('/topic/${child.id}'),
            ),
        ],
      ],
    );
  }
}

class _NavTile extends StatelessWidget {
  const _NavTile({required this.label, required this.isRead, required this.onTap});

  final String label;
  final bool isRead;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(8),
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        child: Row(
          children: [
            Expanded(child: Text(label)),
            const SizedBox(width: 8),
            ReadStatusDot(isRead: isRead),
          ],
        ),
      ),
    );
  }
}
