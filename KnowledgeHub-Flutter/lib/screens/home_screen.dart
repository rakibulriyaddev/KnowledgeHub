import 'package:flutter/material.dart';

import '../data/search.dart';
import '../data/vault_repository.dart';
import '../widgets/app_scaffold.dart';
import '../widgets/search_field.dart';
import '../widgets/topic_card.dart';

/// Mirrors app/page.tsx.
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key, required this.repository});

  final VaultRepository repository;

  @override
  Widget build(BuildContext context) {
    final chapters = repository.chapters;
    final isEmpty = repository.searchIndex.isEmpty;
    final theme = Theme.of(context);

    return AppScaffold(
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const SizedBox(height: 8),
          Text(
            'Your knowledge, organized.',
            textAlign: TextAlign.center,
            style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Text(
            'Search and navigate the KnowledgeVault — interconnected notes, Q&A, and resources.',
            textAlign: TextAlign.center,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.brightness == Brightness.dark
                  ? const Color(0xFFA3A3A3)
                  : const Color(0xFF737373),
            ),
          ),
          const SizedBox(height: 24),
          SearchField(search: VaultSearch(repository.searchIndex)),
          const SizedBox(height: 32),
          Text(
            'CHAPTERS',
            style: theme.textTheme.labelSmall?.copyWith(
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 12),
          if (chapters.isEmpty)
            Text(
              'Nothing here yet.',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            )
          else
            for (final entry in chapters)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: TopicCard(entry: entry),
              ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border.all(color: theme.dividerColor, style: BorderStyle.solid),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Welcome to KnowledgeHub', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Text(
                  isEmpty
                      ? 'Your vault is empty. Add topic folders (each with an _index.md) to the KnowledgeVault and rebuild to see them here.'
                      : 'Use the search bar above to jump to any topic by title or tag, or pick up where you left off from the recent lists.',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
