import 'package:intl/intl.dart';

/// Format a YYYY-MM-DD (or ISO) date string for display, e.g. "Jun 17, 2026".
/// Mirrors lib/format.ts.
String? formatDate(String? value) {
  if (value == null || value.isEmpty) return null;
  final date = DateTime.tryParse(value);
  if (date == null) return value;
  return DateFormat('MMM d, yyyy').format(date.toUtc());
}
