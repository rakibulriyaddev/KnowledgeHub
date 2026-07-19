import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

/// On-device cache of a user's read-topic-id set, keyed by email so a
/// device switching between accounts doesn't leak one user's status into
/// another's.
class TopicStatusCache {
  static const _prefsKeyPrefix = 'topic_status_ids_';

  Future<List<String>?> read(String email) async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString(_keyFor(email));
    if (stored == null) return null;
    return (jsonDecode(stored) as List<dynamic>).cast<String>();
  }

  Future<void> write(String email, List<String> topicIds) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyFor(email), jsonEncode(topicIds));
  }

  String _keyFor(String email) => '$_prefsKeyPrefix${email.toLowerCase()}';
}
