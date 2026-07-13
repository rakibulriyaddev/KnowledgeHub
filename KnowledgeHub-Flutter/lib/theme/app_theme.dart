import 'package:flutter/material.dart';

/// Matches the Tailwind palette used by the Next.js client (blue-600 accent,
/// neutral grays), so the Flutter port looks like the same product.
class AppColors {
  static const blue600 = Color(0xFF2563EB);
  static const blue700 = Color(0xFF1D4ED8);
  static const amber500 = Color(0xFFF59E0B);
  static const green500 = Color(0xFF22C55E);
}

ThemeData buildLightTheme() {
  final colorScheme = ColorScheme.fromSeed(
    seedColor: AppColors.blue600,
    brightness: Brightness.light,
  );
  return ThemeData(
    useMaterial3: true,
    colorScheme: colorScheme,
    scaffoldBackgroundColor: Colors.white,
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: Color(0xFF171717),
      elevation: 0,
      scrolledUnderElevation: 1,
    ),
    dividerColor: const Color(0xFFE5E5E5),
  );
}

ThemeData buildDarkTheme() {
  final colorScheme = ColorScheme.fromSeed(
    seedColor: AppColors.blue600,
    brightness: Brightness.dark,
  );
  return ThemeData(
    useMaterial3: true,
    colorScheme: colorScheme,
    scaffoldBackgroundColor: const Color(0xFF0A0A0A),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF0A0A0A),
      foregroundColor: Colors.white,
      elevation: 0,
      scrolledUnderElevation: 1,
    ),
    dividerColor: const Color(0xFF262626),
  );
}
