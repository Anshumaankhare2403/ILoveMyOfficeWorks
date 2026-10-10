# ILoveMyOfficeWorks — Windows Desktop Edition (v2.5.0)

<p align="center">
  <img src="assets/icon.png" alt="ILoveMyOfficeWorks Desktop Logo" width="128" height="128" style="border-radius: 28px; box-shadow: 0 20px 25px -5px rgba(91,113,71,0.25);" />
</p>

<p align="center">
  <strong>100% Private, Client-Side PDF & Office Productivity Workbench for Windows</strong><br>
  Built with Electron 34, React 18, Vite 6, Tailwind CSS, and in-browser WebAssembly document engines.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows_10_%2F_11-0078D6?style=for-the-badge&logo=windows" alt="Windows 10 / 11" />
  <img src="https://img.shields.io/badge/Version-v2.5.0-5B7147?style=for-the-badge" alt="Version 2.5.0" />
  <img src="https://img.shields.io/badge/Architecture-x64-435433?style=for-the-badge" alt="x64" />
  <img src="https://img.shields.io/badge/Executable-Single--File_Portable_.exe-262D20?style=for-the-badge" alt="Single-File Portable" />
  <img src="https://img.shields.io/badge/Privacy-Zero_Network_Transmission-5B7147?style=for-the-badge&logo=shield" alt="Zero Cloud" />
</p>

---

## 📑 Table of Contents

- [🛡️ Core Philosophy: 100% Private & Local](#️-core-philosophy-100-private--local)
- [✨ What's New in v2.5.0](#-whats-new-in-v250)
- [🎨 Windows Desktop Integration & Features](#-windows-desktop-integration--features)
- [🖼️ True Multi-Resolution Windows Application Icon](#️-true-multi-resolution-windows-application-icon)
- [📦 How to Build the Windows Executable (.exe)](#-how-to-build-the-windows-executable-exe)
- [🚀 Development & Testing Commands](#-development--testing-commands)
- [📁 Desktop Folder Structure](#-desktop-folder-structure)
- [⚙️ Technical Architecture (Electron + Preload)](#️-technical-architecture-electron--preload)
- [🛡️ Windows Security & SmartScreen Guidance](#️-windows-security--smartscreen-guidance)
- [📄 License](#-license)

---

## 🛡️ Core Philosophy: 100% Private & Local

Most PDF utilities require uploading sensitive documents (financial statements, tax forms, passports, confidential contracts) to cloud servers. 

**ILoveMyOfficeWorks Windows Desktop Edition** provides an uncompromising local-first alternative:

- **Zero Cloud Transmission**: All 35 tools execute entirely inside the local Electron process using WebAssembly, HTML5 Canvas, and client-side JavaScript (`pdf-lib`, `pdfjs-dist`, `docx`).
- **Offline First**: Operates seamlessly without an active internet connection. Documents are processed entirely in system memory.
- **No Third-Party Telemetry**: Zero tracking scripts, zero advertising payloads, zero outbound analytics.
- **Enterprise-Grade Privacy Compliance**: Safe for HIPAA, GDPR, and confidential legal/enterprise environments.

---

## ✨ What's New in v2.5.0

- 🖼️ **High-Capacity 1,000+ Image Merger**:
  - Merge hundreds or thousands of high-resolution images into a single consolidated PDF or a continuous stitched photo strip.
  - Non-blocking batch ingestion (50-file chunking) and 30-item windowed pagination.
  - Zero out-of-memory crashes thanks to lazy buffer management.
- 🪟 **True Multi-Resolution Windows Icon (`icon.ico`)**:
  - Embedded icon contains 7 dedicated resolution layers (`16x16`, `24x24`, `32x32`, `48x48`, `64x64`, `128x128`, `256x256`).
  - Renders crisply across Windows Taskbar, Alt+Tab switcher, File Explorer icons, and High-DPI 4K displays.
- ⚡ **Streamlined `npm run make` Command**:
  - One-step build that compiles the optimized React client and packages the standalone single-file portable `.exe`.
- 🗂️ **Expanded 35-Tool Registry**:
  - Complete coverage across PDF organization, optimization, conversion, editing, security, and image processing.

---

## 🎨 Windows Desktop Integration & Features

The Desktop Edition is tailored specifically for Windows 10 and Windows 11:

1. **Custom Luxury Sage Frameless Title Bar**:
   - Matches the brand design system tokens (`#FAF8F4`, `#5B7147`, `#262D20`).
   - Native window controls: Minimize, Maximize / Restore, and Close.
   - Smooth drag region for moving the window across multiple monitors.
   - Verified **"100% Private Offline"** live status badge.

2. **Native Windows File Associations (`.pdf`)**:
   - Double-clicking any `.pdf` in Windows File Explorer automatically launches or focuses ILoveMyOfficeWorks and stages the document.
   - Command-line arguments (`ILoveMyOfficeWorks.exe document.pdf`) load files directly into the workbench.

3. **Native File Explorer Dialogs**:
   - Native Windows Open Dialog with format filters (`*.pdf`, images, Office documents).
   - Native Windows Save Dialog for choosing the exact disk destination.
   - One-click **"Show in Folder"** button to instantly highlight output files in Windows File Explorer (`shell.showItemInFolder`).

4. **Hardware-Accelerated In-Browser Engine**:
   - Utilizes Chromium WebGL and OffscreenCanvas for ultra-fast document rasterization.
   - Optional local Ghostscript bridge (`gswin64c` / `gswin32c`) detection for server-grade compression.

---

## 🖼️ True Multi-Resolution Windows Application Icon

Standard `.ico` files generated by simple web converters often contain only a single 256x256 image. Windows Explorer and `rcedit` often fail to parse single-resolution ICO headers properly, falling back to the generic Electron icon.

To guarantee crisp rendering across every Windows display scale (100%, 125%, 150%, 200%, 250%), [`desktop/assets/icon.ico`](file:///d:/ILoveMyOfficeWorks/desktop/assets/icon.ico) was built with **7 dedicated mipmap resolutions**:

| Resolution | Format | Where Windows Displays It |
| :--- | :--- | :--- |
| **16 × 16** | BMP / DIB | Window title bar icon, File Explorer Details view, small taskbar |
| **24 × 24** | BMP / DIB | 150% scaled taskbars and notification area |
| **32 × 32** | BMP / DIB | Standard Windows Taskbar, File Explorer List / Small Icons |
| **48 × 48** | BMP / DIB | File Explorer Medium Icons view, Desktop shortcut (Standard DPI) |
| **64 × 64** | BMP / DIB | High-DPI Desktop shortcuts, Windows Search result flyout |
| **128 × 128** | PNG-compressed | Windows File Explorer Large Icons view |
| **256 × 256** | PNG-compressed | Windows File Explorer Extra Large Icons view, Alt+Tab preview |

Windows Explorer automatically selects the optimal frame without interpolation blur.

---

## 📦 How to Build the Windows Executable (.exe)

### Option A: Build From Project Root (Recommended)

From the root repository directory (`ILoveMyOfficeWorks/`), run:

```bash
# Builds client and packages the Windows Portable Executable
npm run desktop:build
```

### Option B: Build Directly in the `desktop/` Directory

```bash
cd desktop

# Run the shorthand make command:
npm run make

# Or run the dist script directly:
npm run dist
```

### 📂 Generated Output Files

After the build completes, the executable artifacts are saved in [`desktop/dist-electron/`](file:///d:/ILoveMyOfficeWorks/desktop/dist-electron/):

| File Name | Size | Type | Description |
| :--- | :--- | :--- | :--- |
| **`ILoveMyOfficeWorks-Windows-Portable-2.5.0.exe`** | ~73.6 MB | Portable `.exe` | **Single-file executable.** Runs instantly on any Windows 10/11 machine without installation or administrative privileges. |
| **`win-unpacked/ILoveMyOfficeWorks.exe`** | ~180 MB folder | Unpacked Application | Raw binary folder containing the executable, Electron binaries, and application assets. |

---

## 🚀 Development & Testing Commands

| Command | Working Directory | Action |
| :--- | :--- | :--- |
| `npm run desktop:dev` | Root or `desktop/` | Launches Vite client with live HMR + Electron window |
| `npm run desktop:start` | Root or `desktop/` | Launches Electron against the compiled production bundle (`client/dist`) |
| `npm run desktop:pack` | Root or `desktop/` | Compiles client and builds unpacked binary folder in `dist-electron/win-unpacked/` |
| `npm run desktop:build` | Root | Compiles client and builds `ILoveMyOfficeWorks-Windows-Portable-2.5.0.exe` |
| `npm run make` | `desktop/` | Alias for `npm run dist` inside the desktop directory |
| `npm test` | Root | Runs the complete 39-test verification suite |

---

## 📁 Desktop Folder Structure

```
desktop/
├── assets/
│   ├── icon.ico                # Multi-resolution Windows application icon (16 to 256px)
│   └── icon.png                # High-res 512x512 Luxury Sage brand logo
├── main.cjs                    # Electron main process (frameless window, IPC, file association)
├── preload.cjs                 # Secure contextBridge API exposing window controls & dialogs
├── electron-builder.json       # Electron-builder configuration (portable target, icon paths)
├── package.json                # Desktop scripts, Electron 34, electron-builder 25
├── README.md                   # Desktop documentation (You are here)
└── dist-electron/              # Packaged Windows executables (generated upon build)
    ├── win-unpacked/           # Unpacked Windows portable application
    │   └── ILoveMyOfficeWorks.exe
    └── ILoveMyOfficeWorks-Windows-Portable-2.5.0.exe  # Standalone single-file executable
```

---

## ⚙️ Technical Architecture (Electron + Preload)

The desktop application follows Electron security best practices:

- **Context Isolation**: `contextIsolation: true` is strictly enforced.
- **Node Integration Disabled**: `nodeIntegration: false` ensures renderer code cannot directly access native Node APIs.
- **Secure `contextBridge`**: Native capabilities are exposed strictly through the `window.desktopAPI` bridge in [`preload.cjs`](file:///d:/ILoveMyOfficeWorks/desktop/preload.cjs):

```javascript
// Exposed renderer API (window.desktopAPI)
window.desktopAPI = {
  isDesktop: true,
  platform: 'win32',
  version: '2.5.0',
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  openFileDialog: (options) => ipcRenderer.invoke('dialog-open-file', options),
  saveFileDialog: (options) => ipcRenderer.invoke('dialog-save-file', options),
  showItemInFolder: (path) => ipcRenderer.send('shell-show-item', path),
  onFileOpened: (callback) => { ... },
};
```

---

## 🛡️ Windows Security & SmartScreen Guidance

Because the portable executable is self-built and not signed with an expensive commercial EV Code Signing Certificate, Windows SmartScreen may present a blue prompt on first launch:

```
Windows protected your PC
Microsoft Defender SmartScreen prevented an unrecognized app from starting.
```

### How to Run:
1. Click **"More info"**.
2. Click **"Run anyway"**.

The application will launch immediately. All execution remains 100% offline with zero outbound network calls.

---

## 📄 License

Distributed under the **MIT License**. Free for personal and commercial usage.
