import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'data/vault_repository.dart';
import 'screens/about_screen.dart';
import 'screens/explore_screen.dart';
import 'screens/home_screen.dart';
import 'screens/not_found_screen.dart';
import 'screens/topic_screen.dart';
import 'theme/app_theme.dart';
import 'theme/theme_controller.dart';

void main() {
  runApp(const KnowledgeHubApp());
}

/// Root widget. Mirrors app/layout.tsx: loads the vault once, then hosts
/// theming + routing for every screen.
class KnowledgeHubApp extends StatelessWidget {
  const KnowledgeHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => ThemeController()..load(),
      child: FutureBuilder<VaultRepository>(
        future: VaultRepository.load(),
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
          return _RoutedApp(repository: snapshot.data!);
        },
      ),
    );
  }
}

class _RoutedApp extends StatefulWidget {
  const _RoutedApp({required this.repository});

  final VaultRepository repository;

  @override
  State<_RoutedApp> createState() => _RoutedAppState();
}

class _RoutedAppState extends State<_RoutedApp> {
  late final GoRouter _router = GoRouter(
    initialLocation: '/',
    routes: [
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
