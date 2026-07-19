import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

/// Display-only read/unread indicator for topic references outside the
/// detail page (search results, topic tree) — toggling still happens via
/// [ReadStatusBadge] on the topic page itself.
class ReadStatusDot extends StatelessWidget {
  const ReadStatusDot({super.key, required this.isRead});

  final bool isRead;

  @override
  Widget build(BuildContext context) {
    return Icon(
      isRead ? Icons.check_circle : Icons.radio_button_unchecked,
      size: 18,
      color: isRead ? AppColors.green500 : Theme.of(context).colorScheme.outline,
    );
  }
}
