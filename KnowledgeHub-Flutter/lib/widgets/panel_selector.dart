import 'package:flutter/material.dart';

import '../models/vault_models.dart';

/// Mirrors components/RightSidebar.tsx's "Also in this topic" list, rendered
/// as a chip row so it fits above the content on a phone screen instead of
/// beside it.
class PanelSelector extends StatelessWidget {
  const PanelSelector({
    super.key,
    required this.panels,
    required this.active,
    required this.onSelect,
  });

  final List<Panel> panels;
  final String active;
  final ValueChanged<String> onSelect;

  @override
  Widget build(BuildContext context) {
    if (panels.length <= 1) return const SizedBox.shrink();
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          for (final panel in panels)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                label: Text(panel.label),
                selected: panel.name == active,
                onSelected: (_) => onSelect(panel.name),
              ),
            ),
        ],
      ),
    );
  }
}
