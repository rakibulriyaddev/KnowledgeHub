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
class KnowledgeHubApp extends StatefulWidget {
  const KnowledgeHubApp({super.key});

  @override
  State<KnowledgeHubApp> createState() => _KnowledgeHubAppState();
}

class _KnowledgeHubAppState extends State<KnowledgeHubApp> {
  late Future<_StartupData> _future = _loadStartupData();

  void _retry() {
    setState(() => _future = _loadStartupData());
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ThemeController()..load(),
      child: FutureBuilder<_StartupData>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return MaterialApp(
              debugShowCheckedModeBanner: false,
              home: _StartupErrorScreen(error: snapshot.error, onRetry: _retry),
            );
          }
          if (!snapshot.hasData) {
            return const MaterialApp(
              debugShowCheckedModeBanner: false,
              home: _StartupLoadingScreen(),
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

/// Matches the native splash's brand color/mark (see
/// android/.../drawable/launch_background.xml) so the native->Flutter
/// handoff reads as one continuous screen instead of a flash to blank white.
class _StartupLoadingScreen extends StatelessWidget {
  const _StartupLoadingScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppColors.blue600,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Icon(Icons.menu_book_rounded, size: 30, color: Colors.white),
            ),
            const SizedBox(height: 20),
            const Text(
              'KnowledgeHub',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF171717)),
            ),
            const SizedBox(height: 24),
            const SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(strokeWidth: 2.5, color: AppColors.blue600),
            ),
          ],
        ),
      ),
    );
  }
}

class _StartupErrorScreen extends StatelessWidget {
  const _StartupErrorScreen({required this.error, required this.onRetry});

  final Object? error;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Color(0xFF737373)),
              const SizedBox(height: 16),
              const Text(
                "Couldn't load KnowledgeHub",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF171717)),
              ),
              const SizedBox(height: 8),
              Text(
                '$error',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF737373)),
              ),
              const SizedBox(height: 20),
              FilledButton(onPressed: onRetry, child: const Text('Retry')),
            ],
          ),
        ),
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
      GoRoute(
        path: '/',
        pageBuilder: (context, state) => _fadeThroughPage(state, HomeScreen(repository: widget.repository)),
      ),
      GoRoute(
        path: '/explore',
        pageBuilder: (context, state) => _fadeThroughPage(state, const ExploreScreen()),
      ),
      GoRoute(
        path: '/about',
        pageBuilder: (context, state) => _fadeThroughPage(state, const AboutScreen()),
      ),
      GoRoute(
        path: '/topic/:id',
        pageBuilder: (context, state) => _fadeThroughPage(
          state,
          TopicScreen(repository: widget.repository, id: state.pathParameters['id']!),
        ),
      ),
    ],
    errorBuilder: (context, state) => const NotFoundScreen(),
  );

  // Shared fade+slide transition so every push (home->topic, topic->topic,
  // tab switches) feels like one continuous surface instead of the default
  // per-platform slide-in.
  static CustomTransitionPage<void> _fadeThroughPage(GoRouterState state, Widget child) {
    return CustomTransitionPage<void>(
      key: state.pageKey,
      child: child,
      transitionDuration: const Duration(milliseconds: 280),
      reverseTransitionDuration: const Duration(milliseconds: 220),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        final curved = CurvedAnimation(parent: animation, curve: Curves.easeOutCubic, reverseCurve: Curves.easeInCubic);
        return FadeTransition(
          opacity: curved,
          child: SlideTransition(
            position: Tween<Offset>(begin: const Offset(0.04, 0), end: Offset.zero).animate(curved),
            child: child,
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeController = context.watch<ThemeController>();
    // Resolve to a single ThemeData ourselves (instead of leaving light/dark
    // switching to MaterialApp's theme/darkTheme/themeMode) so the `builder`
    // below can wrap it in AnimatedTheme and crossfade colors smoothly
    // instead of the instant jump MaterialApp does by default.
    final resolvedTheme = themeController.isDark(context) ? buildDarkTheme() : buildLightTheme();
    return MaterialApp.router(
      title: 'KnowledgeHub',
      debugShowCheckedModeBanner: false,
      theme: resolvedTheme,
      builder: (context, child) => AnimatedTheme(
        data: resolvedTheme,
        duration: const Duration(milliseconds: 320),
        curve: Curves.easeInOutCubic,
        child: child!,
      ),
      routerConfig: _router,
    );
  }
}
