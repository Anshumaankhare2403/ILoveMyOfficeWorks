# ILoveMyOfficeWorks — Android Mobile App (Flutter)

The official **ILoveMyOfficeWorks Android Mobile Application**, powered by **Flutter**, **Material 3**, and our signature **Luxury Sage** design language.

Like the web and desktop editions, the mobile app strictly honors the **100% Client-Side Privacy Guarantee** — all PDF and document processing runs **strictly on-device in local memory** with **zero cloud data transmission**.

---

## 📱 Features

- **Native Tool Hub & Navigator**:
  - Filter by category: *Organize PDF*, *Optimize PDF*, *Convert to PDF*, *Convert from PDF*, *Edit PDF*, *Security*, and *Image Tools*.
  - Fast search across 20+ tools.
  - Native Material 3 cards with custom Luxury Sage tokens (`#5B7147`, `#435433`, `#FAF8F4`).
- **Offline Loopback Engine**:
  - An embedded Dart `HttpServer` binds exclusively to `127.0.0.1` (loopback only) to serve bundled WebAssembly, Canvas, and Web Worker assets offline.
  - Full support for PDF merging, splitting, canvas downsampling compression, PDF/A conversion, and DOCX generation.
- **Two-Way JavaScript Bridge (`FlutterBridge`)**:
  - **Native Downloads**: Processed PDFs, Word docs, spreadsheets, and ZIP archives are saved directly to Android's `Downloads/ILoveMyOfficeWorks/` directory.
  - **Native Android Share Sheet**: One-tap native sharing via `share_plus` directly to WhatsApp, Gmail, Google Drive, or nearby devices.
  - **Native File Picker**: Pick documents and photos straight from Android storage, Downloads, Google Drive, or SD card via `file_picker`.
  - **Haptic Feedback**: Subtle tactile response on tool navigation and document exports.
- **Dev Mode & Hot Reload Support**:
  - Switch seamlessly between the offline bundled bundle and a local Vite dev server (`http://10.0.2.2:5173` on Android emulator or host IP) via the in-app settings dialog.

---

## 🛠️ Architecture

```
mobile/
├── android/                   # Native Android configuration (Kotlin, Gradle, Manifest)
│   ├── app/
│   │   ├── build.gradle.kts   # Android build script (minSdk 21, compileSdk)
│   │   └── src/main/
│   │       ├── AndroidManifest.xml # Permissions (INTERNET loopback, Storage, App Title)
│   │       └── res/           # Official ILoveMyOfficeWorks launcher icons
├── assets/
│   ├── logo.png               # High-resolution app branding
│   └── web/                   # Offline client-side WebAssembly & Canvas engine bundle
│       ├── index.html
│       ├── assets/
│       ├── cmaps/
│       └── standard_fonts/
├── lib/
│   ├── main.dart              # App bootstrap & system UI configuration
│   ├── models/
│   │   └── tool_item.dart     # Tool metadata, categories, and badge tokens
│   ├── screens/
│   │   ├── home_hub_screen.dart       # Material 3 Luxury Sage tool navigator
│   │   ├── tool_workspace_screen.dart # Interactive WebView workspace + native actions
│   │   └── privacy_audit_dialog.dart  # 100% on-device verification modal
│   ├── services/
│   │   ├── local_server_service.dart  # Embedded 127.0.0.1 loopback HTTP server
│   │   └── document_bridge_service.dart # Bidirectional JS/Dart communication bridge
│   └── theme/
│       └── app_theme.dart     # Unified Luxury Sage palette tokens
├── test/
│   └── widget_test.dart       # Flutter test suite
└── pubspec.yaml               # Flutter dependencies (webview_flutter, file_picker, etc.)
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

### 2. Build Android APK
To compile the release APK:
```bash
npm run mobile:build
```
The output APK will be generated at:
`mobile/build/app/outputs/flutter-apk/app-release.apk`

### 3. Build Split-per-ABI APKs (Smaller file size for Play Store / Sideloading)
```bash
npm run mobile:apk
```

### 4. Build Android App Bundle (.aab for Google Play Store)
```bash
npm run mobile:bundle
```

### 5. Run Flutter Test Suite
```bash
npm run mobile:test
```

### 6. Synchronize Web Assets to Mobile
```bash
npm run mobile:sync
```

---

## 🛡️ Privacy Verification

ILoveMyOfficeWorks Android adheres to the strict zero-cloud data policy:
1. All PDF engines execute within the client WebView in local device memory.
2. The internal server binds **only** to IPv4 loopback (`127.0.0.1`) and never connects to external cloud servers.
3. No analytics, tracking tokens, or user accounts are required.
