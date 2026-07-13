import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../models/vault_models.dart';
import '../utils/format.dart';
import 'tag_chip.dart';

/// Mirrors components/TopicCard.tsx.
class TopicCard extends StatelessWidget {
  const TopicCard({super.key, required this.entry, this.date});

  final SearchIndexEntry entry;
  final String? date;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final formatted = formatDate(date);

    return InkWell(
      borderRadius: BorderRadius.circular(8),
      onTap: () => context.push('/topic/${entry.id}'),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isDark ? const Color(0xFF262626) : const Color(0xFFE5E5E5),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    entry.title,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                if (formatted != null)
                  Text(
                    formatted,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: isDark
                          ? const Color(0xFF737373)
                          : const Color(0xFFA3A3A3),
                    ),
                  ),
              ],
            ),
            if (entry.tags.isNotEmpty) ...[
              const SizedBox(height: 8),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  for (final tag in entry.tags.take(3)) TagChip(tag: tag),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}
