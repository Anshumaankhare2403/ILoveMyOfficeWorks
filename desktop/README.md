# ILoveMyOfficeWorks — Windows Desktop Edition (Electron.js)

Welcome to the **Windows Desktop Edition** of **ILoveMyOfficeWorks**, a 100% private, client-side PDF productivity workbench built with Electron.js, React, Vite, and Tailwind CSS.

---

## 🛡️ Core Philosophy: 100% Private & Local

- **Zero Cloud Transmission**: All PDF processing (merging, splitting, compressing, Word conversion, OCR, redaction) executes locally on your Windows machine in memory.
- **Offline First**: Runs completely without internet connectivity.
- **Native Windows Integration**: Built-in Windows title bar matching the Luxury Sage aesthetic, Windows file associations for `.pdf`, native File Explorer dialogs, and drag-and-drop.

---

## 📁 Desktop Folder Structure

```
desktop/
├── assets/
│   ├── icon.ico                # High-res Windows application icon
│   └── icon.png                # PNG logo asset
├── main.cjs                    # Electron main process (window lifecycle, IPC, dialogs)
├── preload.cjs                 # Secure contextBridge API for the renderer
├── electron-builder.json       # Windows packaging configuration (NSIS & Portable)
├── package.json                # Dedicated desktop dependencies (Electron, electron-builder)
└── dist-electron/              # Packaged Windows executables & installers (after build)
    ├── win-unpacked/           # Unpacked Windows portable application
    │   └── ILoveMyOfficeWorks.exe
    └── ILoveMyOfficeWorks-Windows-1.0.0.exe (NSIS installer)
```

---

## 🚀 Quick Start Commands

You can run these commands from the project root or from inside the `desktop/` folder:

### 1. Run in Development Mode (Live HMR)
Spawns the Vite development server and launches Electron connected to `http://localhost:5173`:
```bash
npm run desktop:dev
```

### 2. Run Built Desktop Application Locally
Runs Electron pointing to the compiled production bundle in `client/dist`:
```bash
npm run desktop:start
```

### 3. Package Windows Executables (.exe & NSIS Installer)
Compiles the client and packages both an NSIS installer and a standalone portable `.exe`:
```bash
npm run desktop:build
```
Output files will be generated in `desktop/dist-electron/`:
- `ILoveMyOfficeWorks-Windows-1.0.0.exe` (Windows Installer)
- `ILoveMyOfficeWorks-Windows-Portable-1.0.0.exe` (Single-file Portable)

### 4. Create Unpacked Folder
Builds an unpacked directory with `ILoveMyOfficeWorks.exe`:
```bash
npm run desktop:pack
```

---

## 🪟 Windows Desktop Features

1. **Custom Luxury Sage Windows Title Bar**:
   - Integrated with the design system tokens (`#FAF8F4`, `#5B7147`, `#262D20`).
   - Drag region for moving the window across screens.
   - Smooth Windows Minimize, Maximize/Restore, and Close buttons.
   - Verified 100% Private Offline badge.

2. **Windows File Association (`.pdf`)**:
   - Double-clicking any `.pdf` in Windows File Explorer can open directly into ILoveMyOfficeWorks.
   - Command-line arguments (`ILoveMyOfficeWorks.exe document.pdf`) automatically load files into the workbench.

3. **Native Windows Dialogs**:
   - Native Windows Open Dialog with file filters (`*.pdf`, images, Office docs).
   - Native Windows Save Dialog for choosing where on your disk to save converted files.
   - "Show in Folder" button to immediately reveal generated files in Windows File Explorer.

4. **Ghostscript Hardware Acceleration (Optional)**:
   - Electron detects local Ghostscript (`gswin64c` / `gswin32c`) on your Windows system for extreme server-grade downsampling if desired, while remaining fully client-side and offline.
