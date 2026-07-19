import 'dart:convert';

import 'package:http/http.dart' as http;

/// Backend host, set at build time via `--dart-define=API_BASE_URL=...`.
/// Defaults to the Android emulator's alias for the host machine.
class ApiConfig {
  static const baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:5270',
  );
}

/// Client for the KnowledgeHub-Api per-user topic read status endpoints.
class TopicStatusApi {
  Future<List<String>> fetchAllStatuses({required String email}) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/api/topic-status').replace(
      queryParameters: {'email': email},
    );
    final response = await http.get(uri);
    if (response.statusCode != 200) {
      throw Exception('Failed to load status (${response.statusCode})');
    }
    final body = jsonDecode(response.body) as Map<String, dynamic>;
    return (body['topicIds'] as List<dynamic>).cast<String>();
  }

  Future<void> markRead({required String topicId, required String email}) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/api/topic-status/mark-read');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'topicId': topicId, 'email': email}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to mark as read (${response.statusCode})');
    }
  }

  Future<void> markUnread({required String topicId, required String email}) async {
    final uri = Uri.parse('${ApiConfig.baseUrl}/api/topic-status/mark-unread');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'topicId': topicId, 'email': email}),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to mark as unread (${response.statusCode})');
    }
  }
}
