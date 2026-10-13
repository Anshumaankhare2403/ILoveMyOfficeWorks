import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// ILoveMyOfficeWorks Luxury Sage Design System tokens
class AppTheme {
  // Brand Colors
  static const Color primarySage = Color(0xFF5B7147);
  static const Color forestDark = Color(0xFF435433);
  static const Color sageAccent = Color(0xFF8B9A6E);
  static const Color sageTint = Color(0xFFEBF0E6);
  static const Color sageLight = Color(0xFFF3F6F0);
  
  // Backgrounds & Neutrals
  static const Color creamBg = Color(0xFFFAF8F4);
  static const Color creamSurface = Color(0xFFF6F3ED);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color borderLight = Color(0xFFE8E1D5);
  static const Color borderMedium = Color(0xFFDDD3C2);
  
  // Text Colors
  static const Color textPrimary = Color(0xFF262D20);
  static const Color textSecondary = Color(0xFF6B785E);
  static const Color textMuted = Color(0xFF8E9B82);

  // Status & Badges
  static const Color badgeOrganize = Color(0xFF4A7C59);
  static const Color badgeOptimize = Color(0xFF3B6E8C);
  static const Color badgeConvert = Color(0xFF9E6437);
  static const Color badgeSecurity = Color(0xFF6E4A8C);
  static const Color badgeEdit = Color(0xFF5B7147);

  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      fontFamily: GoogleFonts.plusJakartaSans().fontFamily,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primarySage,
        primary: primarySage,
        onPrimary: Colors.white,
        secondary: forestDark,
        onSecondary: Colors.white,
        surface: creamBg,
        onSurface: textPrimary,
      ),
      scaffoldBackgroundColor: creamBg,
      appBarTheme: const AppBarTheme(
        backgroundColor: creamBg,
        foregroundColor: textPrimary,
        elevation: 0,
        centerTitle: false,
        scrolledUnderElevation: 1,
        surfaceTintColor: Colors.transparent,
      ),
      cardTheme: CardThemeData(
        color: cardBg,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: borderLight, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: sageLight,
        selectedColor: primarySage,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          side: const BorderSide(color: borderLight, width: 0.8),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primarySage,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: creamBg,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: borderLight, width: 1),
        ),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: creamBg,
        surfaceTintColor: Colors.transparent,
        modalBackgroundColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: Colors.white,
        indicatorColor: sageTint,
        elevation: 0,
        height: 64,
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w700,
              color: primarySage,
              overflow: TextOverflow.ellipsis,
            );
          }
          return const TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.w500,
            color: textSecondary,
            overflow: TextOverflow.ellipsis,
          );
        }),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primarySage, width: 1.5),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: forestDark,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
