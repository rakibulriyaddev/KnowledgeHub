import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../theme/theme_controller.dart';

class _NavLink {
  final String path;
  final String label;
  const _NavLink(this.path, this.label);
}

const _navLinks = [
  _NavLink('/', 'Home'),
  _NavLink('/explore', 'Explore'),
  _NavLink('/about', 'About'),
];

/// Common chrome for every screen: app bar with title, theme toggle, and a
/// nav drawer. Mirrors components/Navbar.tsx + MobileNav.tsx — this app is
/// Android-only, so there's a single (mobile) nav rather than a
/// desktop/mobile split.
class AppScaffold extends StatelessWidget {
  const AppScaffold({
    super.key,
    required this.body,
    this.title = 'KnowledgeHub',
    this.floatingActionButton,
    this.showDrawer = true,
  });

  final Widget body;
  final String title;
  final Widget? floatingActionButton;

  /// Also disables the AppBar's automatic leading widget — no drawer menu,
  /// no back arrow. The tappable title is the only way back to home.
  final bool showDrawer;

  @override
  Widget build(BuildContext context) {
    final themeController = context.watch<ThemeController>();
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: showDrawer,
        title: GestureDetector(
          onTap: () => context.go('/'),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 28,
                height: 28,
                margin: const EdgeInsets.only(right: 8),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primary,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.menu_book_rounded, size: 16, color: Colors.white),
              ),
              Text(title),
            ],
          ),
        ),
        actions: [
          IconButton(
            tooltip: themeController.isDark(context)
                ? 'Switch to light mode'
                : 'Switch to dark mode',
            icon: Icon(
              themeController.isDark(context)
                  ? Icons.light_mode_outlined
                  : Icons.dark_mode_outlined,
            ),
            onPressed: () => themeController.toggle(context),
          ),
        ],
      ),
      drawer: showDrawer
          ? Drawer(
              child: SafeArea(
                child: ListView(
                  padding: EdgeInsets.zero,
                  children: [
                    const DrawerHeader(
                      child: Align(
                        alignment: Alignment.bottomLeft,
                        child: Text(
                          'KnowledgeHub',
                          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    for (final link in _navLinks)
                      ListTile(
                        title: Text(link.label),
                        onTap: () {
                          Navigator.of(context).pop();
                          context.go(link.path);
                        },
                      ),
                  ],
                ),
              ),
            )
          : null,
      body: body,
      floatingActionButton: floatingActionButton,
    );
  }
}
