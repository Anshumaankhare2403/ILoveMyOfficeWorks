# AGENTS.md — Agent Developer Guide for ILoveMyOfficeWorks

Welcome, AI Agent! This file is your entry point to understanding, modifying, and extending the **ILoveMyOfficeWorks** codebase.

---

## 🎯 Project Mission & Core Philosophy

**ILoveMyOfficeWorks** is a **100% private, client-side PDF productivity toolkit** built with React, Vite, Tailwind CSS, `pdf-lib`, `pdfjs-dist`, and `docx`.

### 🛡️ Non-Negotiable Core Principle: Zero Cloud Data Transmission
1. **Never upload user PDFs to third-party or remote cloud APIs.**
2. All PDF manipulation (merging, splitting, compressing, DOCX conversion) runs **directly in the user's browser** using WebAssembly, HTML5 Canvas, and modern JavaScript engines.
3. The optional local Node backend (`server/server.js`) only provides optional localhost Ghostscript optimization if locally installed on the user's machine. The client runs fully standalone even without the server.

---

## 🧭 Repository Structure

```
ILoveMyOfficeWorks/
├── AGENTS.md                          # Primary agent guide (You are here)
├── README.md                          # Human user documentation
├── .agents/                           # Antigravity agent skills & rules
│   ├── rules/
│   │   └── project_guidelines.md      # Strict guidelines for AI agents
│   └── skills/
│       └── ilovemyofficeworks-toolkit/
│           └── SKILL.md               # Reusable Antigravity agent skill
├── docs/
│   └── project-knowledge/             # Comprehensive technical documentation
│       ├── README.md                  # Knowledge index
│       ├── 01-architecture-and-philosophy.md
│       ├── 02-tools-and-engines.md
│       ├── 03-adapter-specification.md
│       └── 04-ui-and-design-system.md
├── client/                            # React + Vite Frontend (Primary application)
│   ├── src/
│   │   ├── components/                # UI components (Navbar, HomeScreen, DesktopTitleBar, etc.)
│   │   ├── registry/                  # Pluggable Tool Adapter Registry
│   │   │   ├── registry.js            # Central adapter loader & dispatcher
│   │   │   └── adapters/              # Individual tool adapters (merge, split, compress, docx)
│   │   ├── utils/                     # Core PDF & document processing engines
│   │   │   ├── pdf-compressor-engine.js  # Canvas downsampling + Object stream compression
│   │   │   ├── pdf-to-docx-engine.js    # PDF.js + docx OpenXML text & layout converter
│   │   │   └── pdf-magic.js             # Encryption check & metadata inspection
│   │   ├── App.jsx                    # Root app state & tool routing
│   │   └── index.css                  # Tailored tokens, typography, glassmorphism
│   └── package.json
├── desktop/                           # Windows Desktop Application (Electron.js)
│   ├── assets/                        # Windows .ico and .png app icons
│   ├── main.cjs                       # Electron main process (frameless window, IPC, dialogs)
│   ├── preload.cjs                    # Secure contextBridge API for desktop features
│   ├── electron-builder.json          # Windows installer (NSIS) and portable config
│   ├── package.json                   # Desktop scripts & Electron dependencies
│   └── README.md                      # Desktop setup and build guide
├── mobile/                            # Android Mobile Application (Flutter v0.5.6)
│   ├── android/                       # Android configuration (Kotlin, Gradle, Manifest)
│   │   └── app/build.gradle.kts       # Gradle config with automated branded APK task
│   ├── assets/                        # App logo & offline WebAssembly bundle
│   ├── lib/                           # Flutter screens, loopback server & bridge
│   │   ├── constants/                 # Centralized app branding & version tokens (v0.5.6)
│   │   ├── models/                    # Tool items, categories, and file metadata
│   │   ├── screens/                   # HomeHubScreen, SavedFilesScreen, Workspace, Privacy Dialog
│   │   ├── services/                  # Loopback server, document bridge, zero-permission storage
│   │   ├── theme/                     # Material 3 Luxury Sage tokens
│   │   └── widgets/                   # DownloadSuccessSheet, Drawer, PrivacyGuaranteeSection
│   ├── test/                          # Responsive layout tests & smoke tests
│   ├── pubspec.yaml                   # Flutter dependencies & version 0.5.6+56
│   └── README.md                      # Mobile setup and build guide
├── scripts/                           # Build & release packaging automation
│   ├── sync-mobile-assets.js          # Syncs client dist to mobile assets
│   ├── package-mobile-release.js      # Packages ILoveMyOfficeWorks-v0.5.6.apk to dist/
│   └── generate-android-icons.ps1     # Android mipmap icon generator
└── server/                            # Optional Localhost Helper (Port 3001)
    └── server.js                      # Localhost Ghostscript bridge (optional)
```

---

## 🚀 Key Commands

- **Start Dev Environment (Client + Server):**
  ```bash
  npm run dev
  ```
- **Run Windows Desktop App (Dev Mode with Live HMR):**
  ```bash
  npm run desktop:dev
  ```
- **Run Windows Desktop App (Production Bundle):**
  ```bash
  npm run desktop:start
  ```
- **Run Android Mobile App (Dev Mode):**
  ```bash
  npm run mobile:dev
  ```
- **Build & Package Branded Android Release APK (v0.5.6):**
  ```bash
  npm run mobile:build
  # Outputs: dist/ILoveMyOfficeWorks-v0.5.6.apk & mobile/build/app/outputs/flutter-apk/ILoveMyOfficeWorks-v0.5.6.apk
  ```
- **Package Release APK & Verify SHA-256 Checksum:**
  ```bash
  npm run mobile:package
  ```
- **Run Mobile Automated Test Suite:**
  ```bash
  npm run mobile:test
  # Runs 10 automated responsive & widget tests across phone, tablet, and landscape viewports
  ```
- **Build Client for Production:**
  ```bash
  npm run build --prefix client
  ```
  *(Always run this command after making changes to verify 0 syntax or bundling errors).*
- **Build Windows Executables (.exe / NSIS Installer / Portable):**
  ```bash
  npm run desktop:build
  ```

---

## 📱 Mobile Architecture & Responsiveness Guidelines

When working in `mobile/`, AI agents must adhere to the following rules:

1. **Brand & Version Source of Truth**:
   - Official brand: `ILoveMyOfficeWorks` (matches Android label).
   - Official version: `0.5.6` (`version: 0.5.6+56` in `pubspec.yaml`).
   - Centralized constants: Always use `AppConstants.appName` and `AppConstants.appVersion` from `mobile/lib/constants/app_constants.dart`.

2. **Single-Header Constraint**:
   - `HomeHubScreen` must NOT render a Flutter `AppBar`. The embedded web view renders its own tailored Luxury Sage `<header>`. A second native header creates duplicate navigation bars and wastes screen space.

3. **Zero-Permission Offline Storage (`LocalStorageService`)**:
   - Do NOT prompt the user for dangerous Android storage permissions (`MANAGE_EXTERNAL_STORAGE` or `WRITE_EXTERNAL_STORAGE`).
   - Store processed files in app documents / cache directories and provide instant export via `share_plus` or scoped downloads.

4. **Responsive Layout & Overflow Prevention**:
   - **Landscape Viewport Hazard (height ~360px)**: Always wrap modal dialogs and bottom sheets in `ConstrainedBox(maxHeight: screenSize.height * 0.88)` and `SingleChildScrollView`.
   - **Narrow Viewport Hazard (width 320px–360px)**: Use `Wrap(spacing: 8, runSpacing: 8)` or `LayoutBuilder` instead of rigid multi-button `Row`s.
   - **Text Scaling (1.5x–2.0x)**: Add `TextOverflow.ellipsis` and `maxLines` to all headers, action badges, and filenames.

5. **Verification Pipeline**:
   - Run `flutter analyze` in `mobile/` (must maintain 0 issues).
   - Run `flutter test` in `mobile/` (must maintain 100% pass rate).

---

## 🧠 For In-Depth Agent Training

To learn the deep technical mechanics, consult the knowledge base:
- [01-architecture-and-philosophy.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/01-architecture-and-philosophy.md)
- [02-tools-and-engines.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/02-tools-and-engines.md)
- [03-adapter-specification.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/03-adapter-specification.md)
- [04-ui-and-design-system.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/04-ui-and-design-system.md)
