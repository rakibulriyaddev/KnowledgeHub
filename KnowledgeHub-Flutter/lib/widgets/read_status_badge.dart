import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../data/topic_status_controller.dart';
import '../data/user_profile_storage.dart';
import '../theme/app_theme.dart';

/// Per-user "have you read this topic" indicator, backed by KnowledgeHub-Api.
/// Replaces the old frontmatter-driven `StatusBadge` — this is not the
/// content-authoring draft/complete status, it's per-(email, topicId) state
/// tracked server-side in MongoDB and mirrored in `TopicStatusController`.
class ReadStatusBadge extends StatefulWidget {
  const ReadStatusBadge({super.key, required this.topicId});

  final String topicId;

  @override
  State<ReadStatusBadge> createState() => _ReadStatusBadgeState();
}

class _ReadStatusBadgeState extends State<ReadStatusBadge> {
  final _storage = UserProfileStorage();
  bool _marking = false;

  Future<void> _toggle(bool currentlyRead) async {
    final controller = context.read<TopicStatusController>();
    setState(() => _marking = true);
    try {
      final email = await _storage.getEmail() ?? '';
      if (currentlyRead) {
        await controller.markUnread(widget.topicId, email);
      } else {
        await controller.markRead(widget.topicId, email);
      }
      if (!mounted) return;
      setState(() => _marking = false);
    } catch (_) {
      if (!mounted) return;
      setState(() => _marking = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Update status failed'), behavior: SnackBarBehavior.floating),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isRead = context.watch<TopicStatusController>().isRead(widget.topicId);
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        _Pill(isRead: isRead),
        const SizedBox(width: 8),
        _marking
            ? const SizedBox(
                width: 16,
                height: 16,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : TextButton(
                onPressed: () => _toggle(isRead),
                child: Text(isRead ? 'Mark as unread' : 'Mark as read'),
              ),
      ],
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({required this.isRead});

  final bool isRead;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final dotColor = isRead ? AppColors.green500 : AppColors.amber500;
    final label = isRead ? 'Done' : 'Draft';

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
