import 'package:flutter/material.dart';

import '../models/vault_models.dart';
import '../utils/format.dart';
import 'read_status_badge.dart';
import 'tag_chip.dart';

/// Mirrors components/MetadataHeader.tsx.
class MetadataHeader extends StatelessWidget {
  const MetadataHeader({super.key, required this.frontmatter});

  final Frontmatter frontmatter;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final created = formatDate(frontmatter.created);
    final modified = formatDate(frontmatter.modified);

    return Container(
      padding: const EdgeInsets.only(bottom: 20),
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: isDark ? const Color(0xFF262626) : const Color(0xFFE5E5E5),
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 12,
            runSpacing: 8,
            children: [
              Text(
                frontmatter.title,
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              ReadStatusBadge(topicId: frontmatter.id),
            ],
          ),
          if (frontmatter.tags.isNotEmpty) ...[
            const SizedBox(height: 12),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: [
                for (final tag in frontmatter.tags) TagChip(tag: tag),
              ],
            ),
          ],
          if (created != null || modified != null) ...[
            const SizedBox(height: 12),
            Wrap(
              spacing: 16,
              runSpacing: 4,
              children: [
                if (created != null)
                  Text(
                    'Created $created',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: isDark
                          ? const Color(0xFFA3A3A3)
                          : const Color(0xFF737373),
                    ),
                  ),
                if (modified != null)
                  Text(
                    'Updated $modified',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: isDark
                          ? const Color(0xFFA3A3A3)
                          : const Color(0xFF737373),
                    ),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
