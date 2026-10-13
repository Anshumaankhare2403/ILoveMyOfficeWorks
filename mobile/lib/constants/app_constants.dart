/// Centralized application branding and version constants for ILoveMyOfficeWorks.
class AppConstants {
  const AppConstants._();

  /// Official brand name
  static const String appName = 'ILoveMyOfficeWorks';

  /// Official semantic version for release
  static const String appVersion = '0.5.6';

  /// Android versionCode
  static const int buildNumber = 56;

  /// Prefixed version string (e.g. "v0.5.6")
  static const String fullVersion = 'v$appVersion';

  /// App tagline
  static const String appTagline = '100% Private Offline PDF & Document Suite';

  /// Privacy guarantee statement
  static const String privacyPromise = '100% Private • Zero Cloud Transmission';

  /// Formatted brand + version string
  static const String brandedTitle = '$appName $fullVersion';
}
