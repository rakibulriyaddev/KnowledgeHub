import 'package:flutter/material.dart';

import '../data/topic_status_api.dart';
import '../data/user_profile_storage.dart';
import '../theme/app_theme.dart';

/// Per-user "have you read this topic" indicator, backed by KnowledgeHub-Api.
/// Replaces the old frontmatter-driven `StatusBadge` — this is not the
/// content-authoring draft/complete status, it's per-(email, topicId) state
/// tracked server-side in MongoDB.
class ReadStatusBadge extends StatefulWidget {
  const ReadStatusBadge({super.key, required this.topicId});

  final String topicId;

  @override
  State<ReadStatusBadge> createState() => _ReadStatusBadgeState();
}

class _ReadStatusBadgeState extends State<ReadStatusBadge> {
  final _api = TopicStatusApi();
  final _storage = UserProfileStorage();
  late Future<bool> _statusFuture;
  bool _marking = false;

  @override
  void initState() {
    super.initState();
    _statusFuture = _load();
  }

  @override
  void didUpdateWidget(covariant ReadStatusBadge oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.topicId != widget.topicId) {
      setState(() => _statusFuture = _load());
    }
  }

  // Unreachable API, any exception, or topic missing from the DB all read as
  // unread — there's no partial/error state shown to the user, just false.
  Future<bool> _load() async {
    try {
      final email = await _storage.getEmail();
      return await _api.fetchStatus(topicId: widget.topicId, email: email ?? '');
    } catch (_) {
      return false;
    }
  }

  Future<void> _markRead() async {
    setState(() => _marking = true);
    try {
      final email = await _storage.getEmail();
      await _api.markRead(topicId: widget.topicId, email: email ?? '');
      if (!mounted) return;
      setState(() {
        _marking = false;
        _statusFuture = Future.value(true);
      });
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
    return FutureBuilder<bool>(
      future: _statusFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(strokeWidth: 2),
          );
        }

        final isRead = snapshot.data ?? false;
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _Pill(isRead: isRead),
            if (!isRead) ...[
              const SizedBox(width: 8),
              _marking
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : TextButton(onPressed: _markRead, child: const Text('Mark as read')),
            ],
          ],
        );
      },
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
