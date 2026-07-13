import 'package:flutter/material.dart';

/// Mirrors components/TagChip.tsx.
class TagChip extends StatelessWidget {
  const TagChip({super.key, required this.tag});

  final String tag;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      decoration: BoxDecoration(
        color: isDark
            ? const Color(0xFF172554).withValues(alpha: 0.5)
            : const Color(0xFFEFF6FF),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: isDark ? const Color(0xFF1E3A8A) : const Color(0xFFBFDBFE),
        ),
      ),
      child: Text(
        tag,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF1D4ED8),
        ),
      ),
    );
  }
}
