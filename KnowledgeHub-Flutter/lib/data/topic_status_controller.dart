import 'package:flutter/foundation.dart';

import 'topic_status_api.dart';
import 'topic_status_cache.dart';

/// Single source of truth for "has this topic been read", shared across
/// the detail page badge, search results, and the topic tree. Every
/// mark-read/unread call hits the API first, then updates the in-memory
/// set and on-device cache together so all three surfaces stay in sync.
class TopicStatusController extends ChangeNotifier {
  final _api = TopicStatusApi();
  final _cache = TopicStatusCache();

  Set<String> _readIds = {};

  bool isRead(String topicId) => _readIds.contains(topicId);

  /// Checks the on-device cache first; only hits the API if the cache is
  /// empty (first run, or the user cleared app storage).
  Future<void> hydrate(String email) async {
    if (email.isEmpty) return;
    final cached = await _cache.read(email);
    if (cached != null) {
      _readIds = cached.toSet();
      notifyListeners();
      return;
    }
    final fetched = await _api.fetchAllStatuses(email: email);
    _readIds = fetched.toSet();
    await _cache.write(email, fetched);
    notifyListeners();
  }

  Future<void> markRead(String topicId, String email) async {
    await _api.markRead(topicId: topicId, email: email);
    _readIds = {..._readIds, topicId};
    await _cache.write(email, _readIds.toList());
    notifyListeners();
  }

  Future<void> markUnread(String topicId, String email) async {
    await _api.markUnread(topicId: topicId, email: email);
    _readIds = {..._readIds}..remove(topicId);
    await _cache.write(email, _readIds.toList());
    notifyListeners();
  }
}
