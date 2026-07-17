import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Local, unauthenticated user identity (full name + email), persisted in
/// Android Keystore-backed secure storage. Entered once on `EntryScreen` and
/// reused as the payload identity for topic-status API calls.
class UserProfileStorage {
  static const _storage = FlutterSecureStorage();
  static const _nameKey = 'full_name';
  static const _emailKey = 'email';

  /// True only if *both* full name and email are present — either missing
  /// sends the user back through the entry page.
  Future<bool> hasProfile() async {
    final name = await _storage.read(key: _nameKey);
    final email = await _storage.read(key: _emailKey);
    final nameMissing = name == null || name.isEmpty;
    final emailMissing = email == null || email.isEmpty;
    return !nameMissing && !emailMissing;
  }

  Future<void> saveProfile({required String fullName, required String email}) async {
    await _storage.write(key: _nameKey, value: fullName);
    await _storage.write(key: _emailKey, value: email);
  }

  Future<String?> getFullName() => _storage.read(key: _nameKey);

  Future<String?> getEmail() => _storage.read(key: _emailKey);
}
