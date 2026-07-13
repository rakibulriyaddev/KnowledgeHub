import 'package:flutter/material.dart';

import '../models/vault_models.dart';
import '../theme/app_theme.dart';

/// Mirrors the StatusBadge in components/MetadataHeader.tsx.
class StatusBadge extends StatelessWidget {
  const StatusBadge({super.key, required this.status});

  final TopicStatus status;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isComplete = status == TopicStatus.complete;
    final dotColor = isComplete ? AppColors.green500 : AppColors.amber500;
    final label = isComplete ? 'Complete' : 'Draft';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF262626) : const Color(0xFFF5F5F5),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: isDark ? const Color(0xFF404040) : const Color(0xFFE5E5E5),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: isDark ? const Color(0xFFD4D4D4) : const Color(0xFF404040),
            ),
          ),
        ],
      ),
    );
  }
}
