import 'package:flutter/material.dart';

import '../widgets/app_scaffold.dart';

/// Mirrors app/about/page.tsx.
class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return AppScaffold(
      title: 'About',
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.info_outline,
                size: 64,
                color: theme.colorScheme.primary.withValues(alpha: 0.35),
              ),
              const SizedBox(height: 16),
              Text('About', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Text(
                'KnowledgeHub is an Android client that renders and navigates the KnowledgeVault — a folder of Markdown notes linked by frontmatter.',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
