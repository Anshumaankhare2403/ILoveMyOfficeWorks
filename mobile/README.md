<p align="center">
  <img src="assets/logo.png" alt="ILoveMyOfficeWorks Mobile Logo" width="128" height="128" style="border-radius: 28px; box-shadow: 0 20px 25px -5px rgba(91,113,71,0.25);" />
</p>

<h1 align="center">ILoveMyOfficeWorks — Android Mobile Edition (v0.5.6)</h1>

<p align="center">
  <strong>100% Private, On-Device PDF & Document Productivity Suite for Android</strong><br>
  Built with Flutter, Material 3 Luxury Sage Design System, and an offline WebAssembly/Canvas document engine.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android_API_21+-3DDC84?style=for-the-badge&logo=android" alt="Android API 21+" />
  <img src="https://img.shields.io/badge/Version-v0.5.6-5B7147?style=for-the-badge" alt="Version 0.5.6" />
  <img src="https://img.shields.io/badge/Framework-Flutter_3.13+-02569B?style=for-the-badge&logo=flutter" alt="Flutter" />
  <img src="https://img.shields.io/badge/Language-Kotlin_2.4-7F52FF?style=for-the-badge&logo=kotlin" alt="Kotlin" />
  <img src="https://img.shields.io/badge/Privacy-Zero_Cloud_Transmission-5B7147?style=for-the-badge&logo=shield" alt="Zero Cloud Transmission" />
  <img src="https://img.shields.io/badge/Storage-Zero_Permission_Local-435433?style=for-the-badge" alt="Zero-Permission Storage" />
  <img src="https://img.shields.io/badge/License-MIT-262D20?style=for-the-badge" alt="License MIT" />
</p>

---

## 📑 Table of Contents

- [🛡️ Privacy Guarantee: 100% Client-Side \& Zero Cloud](#️-privacy-guarantee-100-client-side--zero-cloud)
- [✨ Key Mobile Features](#-key-mobile-features)
- [📱 Single-Header Architecture \& Luxury Sage UI](#-single-header-architecture--luxury-sage-ui)
- [💾 Zero-Permission Offline Storage (`LocalStorageService`)](#-zero-permission-offline-storage-localstorageservice)
- [📂 Saved Files Manager Screen](#-saved-files-manager-screen)
- [📐 Responsive Design \& Overflow Protection](#-responsive-design--overflow-protection)
- [⚡ Offline Loopback WebAssembly Engine](#-offline-loopback-webassembly-engine)
- [🌉 Bidirectional JavaScript Bridge (`FlutterBridge`)](#-bidirectional-javascript-bridge-flutterbridge)
- [📁 Mobile Directory Structure](#-mobile-directory-structure)
- [🚀 Development, Testing \& Build Commands](#-development-testing--build-commands)
- [📦 Branded Release APK Packaging (`v0.5.6`)](#-branded-release-apk-packaging-v056)
- [🧪 Automated Test Suite (10 Responsive Tests)](#-automated-test-suite-10-responsive-tests)
- [📄 License](#-license)

---

## 🛡️ Privacy Guarantee: 100% Client-Side & Zero Cloud

Most mobile PDF scanner and converter apps upload your private documents—passports, contracts, bank statements, personal notes—to remote cloud servers.

**ILoveMyOfficeWorks Android Mobile strictly guarantees:**
1. **Zero Outbound Data Transmission**: Documents, canvases, and extracted text never leave your Android device.
2. **Local Loopback Only (`127.0.0.1`)**: The internal asset server binds exclusively to the local IPv4 loopback adapter. No external network ports are ever exposed.
3. **No Dangerous Permissions**: Runs with **zero dangerous storage permissions** (`MANAGE_EXTERNAL_STORAGE` or `WRITE_EXTERNAL_STORAGE` are never requested).
4. **No Telemetry, No Accounts, No Trackers**: No login forms, zero third-party analytics SDKs, and zero tracking cookies.

---

## ✨ Key Mobile Features

- **Single-Header Unified UI**: The native Android application intentionally omits a duplicate `AppBar` over the web engine's header, preserving precious vertical screen space.
- **35 Client-Side Document Tools**: PDF Merging, Splitting, Canvas Downsample Compression, DOCX Conversion, PDF/A Archival, Watermarking, Rotation, Password Protection, and 1,000+ Image Merging.
- **Dedicated Saved Files Hub (`SavedFilesScreen`)**: Browse previously generated files, search by name, inspect exact byte sizes, share instantly, or batch delete.
- **Download Success Modal (`DownloadSuccessSheet`)**: High-contrast, responsive bottom sheet with instant Open File and Share buttons.
- **Native Document Bridge**: Fluid file ingestion via Android system file picker (`file_picker`), one-tap sharing via system sheet (`share_plus`), and tactile haptic feedback.
- **Live Dev Mode Switcher**: In-app configuration dialog to switch between offline bundled assets and the live Vite dev server (`http://10.0.2.2:5173` on emulator or host IP) with hot reload.

---

## 📱 Single-Header Architecture & Luxury Sage UI

To create an editorial, tactile experience, the mobile application enforces strict UI consistency:

- **Single-Header Constraint**: `HomeHubScreen` renders directly into a top-padded `SafeArea` without a native Flutter `AppBar`. The embedded web view renders its own tailored Luxury Sage `<header>`.
- **Material 3 Navigation Bar**: Four clear, unclipped destinations:
  - **Home**: Main tool hub and dropzone.
  - **Saved**: Zero-permission saved document manager.
  - **Studio**: Quick access to all 35 document transformation utilities.
  - **Privacy**: Interactive client-side architecture audit and verification dialog.
- **Luxury Sage Palette**:
  - Primary Sage: `#5B7147`
  - Forest Dark: `#435433`
  - Cream Background: `#FAF8F4`
  - Sage Tint / Indicators: `#E8EFE3`
  - Border Accents: `#E8E1D5` / `#DDD3C2`

---

## 💾 Zero-Permission Offline Storage (`LocalStorageService`)

Android 11+ (API 30+) strictly restricts external storage access. ILoveMyOfficeWorks implements a modern, compliant **Zero-Permission Offline Storage Service**:

1. **App Sandboxed Storage**: Documents are safely written to the app's dedicated internal storage directory (`/data/user/0/.../app_flutter/ILoveMyOfficeWorks/`).
2. **Zero Runtime Permission Prompts**: Users are never interrupted with scary Android permission dialogs asking for full storage access.
3. **System Share Sheet Integration**: Files can be instantly exported to external apps (Google Drive, WhatsApp, Gmail, Telegram) or saved to public folders via Android's native `share_plus` sheet.
4. **Metadata Persistence**: File names, sizes, MIME types, and timestamps are tracked locally and refreshed dynamically.

---

## 📂 Saved Files Manager Screen

Accessible via the **Saved** tab in the bottom navigation bar:

- **Live Search**: Instant keyword filtering across all saved document names.
- **Storage Metrics**: Dynamic total file count and disk usage calculation.
- **File Card Details**:
  - MIME badge with icon color-coding (PDF, DOCX, XLSX, Images, ZIP).
  - Human-readable file size (KB / MB).
  - Relative creation timestamp.
- **Actions**:
  - **Share**: Launches the native Android system share dialog.
  - **Delete**: Removes file from disk with confirmation snackbar.
  - **Clear All**: Clean up temporary files with one click.
- **Tablet Responsive Layout**: Constrained to `maxWidth: 720` on tablets and foldable devices to prevent stretched cards.

---

## 📐 Responsive Design & Overflow Protection

The mobile app has been rigorously tested and optimized across diverse Android screen sizes and orientations:

| Viewport Scenario | Resolution / DPI | Optimization Implemented |
| :--- | :--- | :--- |
| **Small Android Phones** | 320 × 568 px | `Wrap` layouts for action buttons, `TextOverflow.ellipsis`, compact visual density. |
| **Standard Android Phones** | 390 × 844 px / 412 × 915 px | Material 3 navigation bar, fluid spacing, high-DPI icons. |
| **Android Tablets** | 800 × 1280 px / 1200 × 1920 px | Centered `ConstrainedBox(maxWidth: 720)`, adaptive columns. |
| **Landscape Orientation** | Height ~360 px – 390 px | Dialogs constrained with `maxHeight: 88vh` + `SingleChildScrollView`. Zero vertical `RenderFlex` overflows. |
| **Accessibility Text Scaling** | 1.5× – 2.0× Scale Factor | Flexible labels, wrapped buttons, single-line ellipsis safeguards. |

---

## ⚡ Offline Loopback WebAssembly Engine

The mobile engine runs completely offline without any internet connection:

1. **Embedded Loopback Server (`LocalServerService`)**:
   - Launches an in-process Dart `HttpServer` bound to `127.0.0.1`.
   - Allocates a dynamic available port (e.g. `127.0.0.1:8080`).
   - Serves bundled static assets (`index.html`, JavaScript modules, WebAssembly binaries, font cmap tables) from `assets/web/`.
2. **In-Memory Document Sandbox**:
   - PDF manipulation (`pdf-lib`), page rasterization (`pdfjs-dist`), and Word generation (`docx`) execute entirely within WebAssembly and HTML5 Canvas in local memory.
   - Processing speeds match or exceed desktop browser performance.

---

## 🌉 Bidirectional JavaScript Bridge (`FlutterBridge`)

The web engine and native Flutter communicate seamlessly via `document_bridge_service.dart`:

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│     Client Web Engine (Vite)    │           │    Native Flutter / Android     │
├─────────────────────────────────┤           ├─────────────────────────────────┤
│  window.FlutterBridge           │           │  JavaScriptChannel              │
│  - downloadFile(name, base64)   │ ────────> │  - LocalStorageService.save()   │
│  - shareFile(name, base64)      │ ────────> │  - SharePlus.shareXFiles()      │
│  - pickFile()                   │ <───────> │  - FilePicker.platform.pick()   │
│  - triggerHaptic(type)          │ ────────> │  - HapticFeedback.lightImpact() │
└─────────────────────────────────┘           └─────────────────────────────────┘
```

---

## 📁 Mobile Directory Structure

```
mobile/
├── android/                           # Native Android configuration (Kotlin, Gradle, Manifest)
│   ├── app/
│   │   ├── build.gradle.kts           # Gradle config with automated branded APK packaging task
│   │   └── src/main/
│   │       ├── AndroidManifest.xml     # Permissions (INTERNET loopback only, Label: ILoveMyOfficeWorks)
│   │       └── res/                   # Official launcher icons (7 mipmap densities)
├── assets/
│   ├── logo.png                       # High-resolution brand logo
│   └── web/                           # Bundled offline WebAssembly & Canvas engine
│       ├── index.html                 # Shell with pre-React loader
│       ├── assets/                    # Compiled client-side modules
│       ├── cmaps/                     # PDF font character maps
│       └── standard_fonts/            # Standard PDF font metrics
├── lib/
│   ├── main.dart                      # Bootstrap & system UI configuration
│   ├── constants/
│   │   └── app_constants.dart         # Official brand name & semantic version (0.5.6)
│   ├── models/
│   │   ├── tool_item.dart             # 35 tool definitions, categories & icons
│   │   └── saved_file_info.dart       # Model for offline saved documents
│   ├── screens/
│   │   ├── home_hub_screen.dart       # Single-header web engine & navigation
│   │   ├── saved_files_screen.dart    # Offline document manager & share screen
│   │   ├── tool_workspace_screen.dart # Interactive WebView workspace + native actions
│   │   └── privacy_audit_dialog.dart  # 100% on-device verification modal
│   ├── services/
│   │   ├── local_server_service.dart  # Embedded 127.0.0.1 loopback HTTP server
│   │   ├── local_storage_service.dart # Zero-permission offline file manager
│   │   └── document_bridge_service.dart # Bidirectional JS/Dart communication bridge
│   ├── theme/
│   │   └── app_theme.dart             # Material 3 Luxury Sage tokens
│   └── widgets/
│       ├── app_navigation_drawer.dart # Category drawer with brand header & footer
│       ├── download_success_sheet.dart# Responsive download completion modal
│       └── privacy_guarantee_section.dart # Client-side architecture strip
├── test/
│   ├── responsive_ui_test.dart        # 8 responsive layout & overflow tests
│   └── widget_test.dart               # App smoke tests
└── pubspec.yaml                       # Flutter dependencies & version: 0.5.6+56
```

---

## 🚀 Development, Testing & Build Commands

### 1. Prerequisites
- **Flutter SDK**: `^3.13.5` or higher
- **Android SDK**: API 21 (Android 5.0) minimum, API 34+ target
- **Java Development Kit**: JDK 17
- **Node.js**: v18+ (for asset synchronization)

### 2. Synchronize Web Assets
Compiles the React frontend and copies static WebAssembly bundles into `mobile/assets/web/`:
```bash
# From repository root:
npm run mobile:sync
```

### 3. Run in Development Mode
Starts the embedded server and connects to an Android device or emulator:
```bash
# From repository root:
npm run mobile:dev

# Or directly in mobile directory:
cd mobile
flutter run
```

### 4. Run Mobile Automated Test Suite
Executes 10 automated responsive and widget tests across diverse viewports:
```bash
# From repository root:
npm run mobile:test

# Or directly in mobile directory:
cd mobile
flutter test
```

### 5. Build Split-per-ABI APKs
Creates optimized, lightweight APKs per architecture (`arm64-v8a`, `armeabi-v7a`, `x86_64`):
```bash
npm run mobile:apk
```

### 6. Build Android App Bundle (.aab)
Packages the production bundle for Google Play Store publishing:
```bash
npm run mobile:bundle
```

---

## 📦 Branded Release APK Packaging (`v0.5.6`)

Compiling and packaging the official branded release APK is fully automated:

```bash
# Full build: syncs web assets + builds release APK + packages branded artifact
npm run mobile:build
```

### Generated Artifacts:
1. **`dist/ILoveMyOfficeWorks-v0.5.6.apk`** (~53.5 MB) — Verified production distribution APK in project root.
2. **`mobile/build/app/outputs/flutter-apk/ILoveMyOfficeWorks-v0.5.6.apk`** — Direct Gradle output.

### Verify Packaging & Checksum:
To re-package or verify SHA-256 integrity without rebuilding:
```bash
npm run mobile:package
```

```
========================================================
🏷️  PACKAGING RELEASE APK: ILoveMyOfficeWorks v0.5.6
========================================================
✅ Status:       SUCCESSFULLY BRANDED & PACKAGED
📱 Brand Name:   ILoveMyOfficeWorks
📦 Version:      v0.5.6 (Code: 56)
⚖️  Size:         53.51 MB (56113306 bytes)
🔒 SHA-256:      d4ec7e50a59c14aac9111ce65c9c0078a8dce77f6349c8462b7ffc6012e60410
📍 Output Path 1: mobile/build/app/outputs/flutter-apk/ILoveMyOfficeWorks-v0.5.6.apk
📍 Output Path 2: dist/ILoveMyOfficeWorks-v0.5.6.apk
========================================================
```

---

## 🧪 Automated Test Suite (10 Responsive Tests)

The mobile test suite (`mobile/test/responsive_ui_test.dart` and `mobile/test/widget_test.dart`) covers all critical responsive scenarios:

1. **`HomeHubScreen` on 320 × 568 px**: Verifies small phones render with zero horizontal or vertical overflow.
2. **`HomeHubScreen` on 800 × 1280 px Tablet**: Verifies portrait and landscape tablet rendering without stretched elements.
3. **`SavedFilesScreen` on 320 px Narrow**: Verifies document list cards, badges, and action buttons fit cleanly.
4. **`SavedFilesScreen` in Landscape Mode (844 × 390 px)**: Verifies fluid vertical scrolling and metric counters.
5. **`PrivacyAuditDialog` in Landscape Mode (844 × 390 px)**: Verifies modal dialog vertical constraint (`maxHeight: 88vh`) prevents `RenderFlex` bottom overflow.
6. **`PrivacyAuditDialog` with 1.5× Accessibility Font Scaling**: Verifies wrapped action buttons and title text resilience.
7. **`DownloadSuccessSheet` on 320 px Narrow**: Verifies adaptive button layout switches cleanly without squishing.
8. **`DownloadSuccessSheet` in Landscape Mode (844 × 360 px)**: Verifies completion modal content fits within viewport.
9. **`ToolWorkspaceScreen` Test Mode**: Verifies headless test guard handles platform channels gracefully.
10. **App Smoke Test**: Verifies app bootstrap, Material 3 navigation destinations, and theme initialization.

---

## 📄 License

Distributed under the **MIT License**. Free for personal and commercial usage.

<p align="center">
  Crafted with care for 100% private, on-device mobile document productivity 🌿📱
</p>
