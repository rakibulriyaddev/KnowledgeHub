import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'data/topic_status_controller.dart';
import 'data/user_profile_storage.dart';
import 'data/vault_repository.dart';
import 'screens/about_screen.dart';
import 'screens/entry_screen.dart';
import 'screens/explore_screen.dart';
import 'screens/home_screen.dart';
import 'screens/not_found_screen.dart';
import 'screens/topic_screen.dart';
import 'theme/app_theme.dart';
import 'theme/theme_controller.dart';

void main() {
  runApp(const KnowledgeHubApp());
}

class _StartupData {
  const _StartupData(this.repository, this.hasProfile, this.topicStatusController);

  final VaultRepository repository;
  final bool hasProfile;
  final TopicStatusController topicStatusController;
}

Future<_StartupData> _loadStartupData() async {
  final repository = await VaultRepository.load();
  final storage = UserProfileStorage();
  final hasProfile = await storage.hasProfile();
  final topicStatusController = TopicStatusController();
  await topicStatusController.hydrate(await storage.getEmail() ?? '');
  return _StartupData(repository, hasProfile, topicStatusController);
}

/// Root widget. Mirrors app/layout.tsx: loads the vault once, then hosts
/// theming + routing for every screen.
class KnowledgeHubApp extends StatelessWidget {
  const KnowledgeHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ThemeController()..load(),
      child: FutureBuilder<_StartupData>(
        future: _loadStartupData(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return MaterialApp(
              home: Scaffold(body: Center(child: Text('Failed to load vault: ${snapshot.error}'))),
            );
          }
          if (!snapshot.hasData) {
            return const MaterialApp(
              home: Scaffold(body: Center(child: CircularProgressIndicator())),
            );
          }
          final data = snapshot.data!;
          return ChangeNotifierProvider.value(
            value: data.topicStatusController,
            child: _RoutedApp(repository: data.repository, hasProfile: data.hasProfile),
          );
        },
      ),
    );
  }
}

class _RoutedApp extends StatefulWidget {
  const _RoutedApp({required this.repository, required this.hasProfile});

  final VaultRepository repository;
  final bool hasProfile;

  @override
  State<_RoutedApp> createState() => _RoutedAppState();
}

class _RoutedAppState extends State<_RoutedApp> {
  late final GoRouter _router = GoRouter(
    initialLocation: widget.hasProfile ? '/' : '/entry',
    routes: [
      GoRoute(path: '/entry', builder: (context, state) => const EntryScreen()),
      GoRoute(path: '/', builder: (context, state) => HomeScreen(repository: widget.repository)),
      GoRoute(path: '/explore', builder: (context, state) => const ExploreScreen()),
      GoRoute(path: '/about', builder: (context, state) => const AboutScreen()),
      GoRoute(
        path: '/topic/:id',
        builder: (context, state) => TopicScreen(
          repository: widget.repository,
          id: state.pathParameters['id']!,
        ),
      ),
    ],
    errorBuilder: (context, state) => const NotFoundScreen(),
  );

  @override
  Widget build(BuildContext context) {
    final themeController = context.watch<ThemeController>();
    return MaterialApp.router(
      title: 'KnowledgeHub',
      debugShowCheckedModeBanner: false,
      themeMode: themeController.mode,
      theme: buildLightTheme(),
      darkTheme: buildDarkTheme(),
      routerConfig: _router,
    );
  }
}
