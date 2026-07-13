import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../data/search.dart';
import '../models/vault_models.dart';
import 'tag_chip.dart';

/// Search topics/tags with live fuzzy results. Mirrors components/SearchBar.tsx
/// + SearchDropdown.tsx, adapted to touch: results render inline below the
/// field (no absolute overlay / keyboard arrow-nav — tap replaces that on
/// Android) and selecting one navigates straight to the topic.
class SearchField extends StatefulWidget {
  const SearchField({super.key, required this.search});

  final VaultSearch search;

  @override
  State<SearchField> createState() => _SearchFieldState();
}

class _SearchFieldState extends State<SearchField> {
  final _controller = TextEditingController();
  List<SearchIndexEntry> _results = const [];

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onChanged(String value) {
    setState(() {
      _results = widget.search.search(value);
    });
  }

  void _onSelect(String id) {
    _controller.clear();
    setState(() => _results = const []);
    FocusScope.of(context).unfocus();
    context.push('/topic/$id');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final showDropdown = _controller.text.trim().isNotEmpty;

    return Column(
      children: [
        TextField(
          controller: _controller,
          onChanged: _onChanged,
          textInputAction: TextInputAction.search,
          decoration: InputDecoration(
            hintText: 'Search topics or tags...',
            prefixIcon: const Icon(Icons.search),
            filled: true,
            fillColor: theme.colorScheme.surface,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(color: theme.dividerColor),
            ),
          ),
        ),
        if (showDropdown)
          Container(
            margin: const EdgeInsets.only(top: 8),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: theme.dividerColor),
            ),
            constraints: const BoxConstraints(maxHeight: 320),
            child: _results.isEmpty
                ? Padding(
                    padding: const EdgeInsets.all(16),
                    child: Text(
                      'No topics match "${_controller.text.trim()}".',
                      style: theme.textTheme.bodyMedium,
                    ),
                  )
                : ListView.separated(
                    shrinkWrap: true,
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    itemCount: _results.length,
                    separatorBuilder: (_, _) => Divider(height: 1, color: theme.dividerColor),
                    itemBuilder: (context, index) {
                      final entry = _results[index];
                      return ListTile(
                        title: Text(entry.title),
                        subtitle: entry.tags.isEmpty
                            ? null
                            : Wrap(
                                spacing: 4,
                                runSpacing: 4,
                                children: [
                                  for (final tag in entry.tags.take(4)) TagChip(tag: tag),
                                ],
                              ),
                        onTap: () => _onSelect(entry.id),
                      );
                    },
                  ),
          ),
      ],
    );
  }
}
