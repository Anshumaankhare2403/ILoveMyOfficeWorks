# ILoveMyOfficeWorks — Android Mobile App (Flutter v0.5.6)

The official **ILoveMyOfficeWorks Android Mobile Application (v0.5.6)**, powered by **Flutter**, **Material 3**, and our signature **Luxury Sage** design language.

Like the web and desktop editions, the mobile app strictly honors the **100% Client-Side Privacy Guarantee** — all PDF and document processing runs **strictly on-device in local memory** with **zero cloud data transmission**.

---

## 📱 Features

- **Single-Header Luxury Sage Hub**:
  - Unified viewport with zero duplicate navigation bars or header clutter.
  - Material 3 navigation bar with tactical destinations (*Home*, *Saved*, *Studio*, *Privacy*).
- **Zero-Permission Offline Storage (`LocalStorageService`)**:
  - Converted PDFs, Word documents, spreadsheets, and ZIPs save directly to offline app storage without asking users for dangerous Android permissions (`MANAGE_EXTERNAL_STORAGE` or `WRITE_EXTERNAL_STORAGE`).
  - **Saved Files Manager (`SavedFilesScreen`)**: Real-time document search, file size inspection, instant sharing, and batch deletion.
  - **Responsive Download Modal (`DownloadSuccessSheet`)**: Adaptive button wrapping and direct export actions.
- **Responsive Layout & Zero Overflow Engine**:
  - Fully tested and resilient across small devices (320px–360px), tablets (800px–1280px), landscape orientation, and 1.5x accessibility text scaling.
  - All dialogs and modal sheets are constrained to `maxHeight: 88vh` with smooth vertical scrolling to prevent `RenderFlex` overflows in landscape mode.
- **Offline Loopback Engine**:
  - An embedded Dart `HttpServer` binds exclusively to `127.0.0.1` (loopback only) to serve bundled WebAssembly, Canvas, and Web Worker assets offline.
  - Full support for PDF merging, splitting, canvas downsampling compression, PDF/A conversion, and DOCX generation.
- **Two-Way JavaScript Bridge (`FlutterBridge`)**:
  - **Native Downloads**: Automatic offline file capture and notification modal.
  - **Native Android Share Sheet**: One-tap native sharing via `share_plus` directly to WhatsApp, Gmail, Google Drive, or nearby devices.
  - **Native File Picker**: Pick documents and photos straight from Android storage, Downloads, Google Drive, or SD card via `file_picker`.
  - **Haptic Feedback**: Subtle tactile response on tool navigation and document exports.
- **In-App Dev Server Switcher**:
  - Switch seamlessly between the offline bundled engine and a local Vite dev server (`http://10.0.2.2:5173` on Android emulator or host IP) via the in-app settings dialog.

---

## 🛠️ Architecture

```
mobile/
├── android/                   # Native Android configuration (Kotlin, Gradle, Manifest)
│   ├── app/
│   │   ├── build.gradle.kts   # Android build script (minSdk 21, compileSdk, branded release task)
│   │   └── src/main/
│   │       ├── AndroidManifest.xml # Permissions (INTERNET loopback only, App Label: ILoveMyOfficeWorks)
│   │       └── res/           # Official ILoveMyOfficeWorks launcher icons (7 mipmap densities)
├── assets/
│   ├── logo.png               # High-resolution app branding
│   └── web/                   # Offline client-side WebAssembly & Canvas engine bundle
│       ├── index.html
│       ├── assets/
│       ├── cmaps/
│       └── standard_fonts/
├── lib/
│   ├── main.dart              # App bootstrap & system UI configuration
│   ├── constants/
│   │   └── app_constants.dart # Centralized app branding & semantic version (v0.5.6)
│   ├── models/
│   │   ├── tool_item.dart     # Tool metadata, categories, and badge tokens
│   │   └── saved_file_info.dart # File metadata model for offline documents
│   ├── screens/
│   │   ├── home_hub_screen.dart       # Main single-header web engine & navigation
│   │   ├── saved_files_screen.dart    # Offline document manager & share screen
│   │   ├── tool_workspace_screen.dart # Interactive WebView workspace + native actions
│   │   └── privacy_audit_dialog.dart  # 100% on-device verification modal
│   ├── services/
│   │   ├── local_server_service.dart  # Embedded 127.0.0.1 loopback HTTP server
│   │   ├── local_storage_service.dart # Zero-permission offline file manager
│   │   └── document_bridge_service.dart # Bidirectional JS/Dart communication bridge
│   ├── theme/
│   │   └── app_theme.dart     # Unified Luxury Sage palette tokens
│   └── widgets/
│       ├── app_navigation_drawer.dart # Category drawer with brand header & footer
│       ├── download_success_sheet.dart# Responsive download completion modal
│       └── privacy_guarantee_section.dart # Client-side architecture strip
├── test/
│   ├── responsive_ui_test.dart# 8 responsive layout & overflow tests
│   └── widget_test.dart       # App smoke tests
└── pubspec.yaml               # Flutter dependencies & version 0.5.6+56
```

---

## 🚀 Commands

### 1. Run in Development Mode
To run on a connected Android device or emulator with live assets:
```bash
npm run mobile:dev
```
Or directly from the `mobile` directory:
```bash
cd mobile
flutter run
```

### 2. Build Branded Android Release APK (v0.5.6)
Compiles, optimizes, and automatically packages the branded release APK:
```bash
npm run mobile:build
```
This generates:
- **`dist/ILoveMyOfficeWorks-v0.5.6.apk`** (~53.5 MB) — Production distribution APK.
- **`mobile/build/app/outputs/flutter-apk/ILoveMyOfficeWorks-v0.5.6.apk`** — Direct Gradle output.

### 3. Re-package & Verify Checksums
```bash
npm run mobile:package
```

### 4. Build Split-per-ABI APKs
```bash
npm run mobile:apk
```

### 5. Build Android App Bundle (.aab for Google Play Store)
```bash
npm run mobile:bundle
```

### 6. Run Flutter Automated Test Suite
```bash
npm run mobile:test
```
*(Runs 10 automated responsive and widget tests covering small phones, landscape, tablets, and text scaling).*

### 7. Synchronize Web Assets to Mobile
```bash
npm run mobile:sync
```

---

## 🛡️ Privacy Verification

ILoveMyOfficeWorks Android adheres to the strict zero-cloud data policy:
1. All PDF engines execute within the client WebView in local device memory.
2. The internal server binds **only** to IPv4 loopback (`127.0.0.1`) and never connects to external cloud servers.
3. Zero runtime storage permissions required — documents are safely isolated in offline app storage.
4. No analytics, tracking tokens, or user accounts are required.
