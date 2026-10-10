<p align="center">
  <img src="client/public/logo.png" alt="ILoveMyOfficeWorks Logo" width="128" height="128" style="border-radius: 28px; box-shadow: 0 20px 25px -5px rgba(91,113,71,0.25);" />
</p>

<h1 align="center">ILoveMyOfficeWorks</h1>

<p align="center">
  <strong>The 100% Private, Client-Side PDF & Office Productivity Suite</strong><br>
  A modern, high-performance web application engineered with React 18, Vite, Tailwind CSS, Three.js, and in-browser WebAssembly document engines.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Privacy-100%25_Client--Side-5B7147?style=for-the-badge&logo=shield" alt="100% Client-Side" />
  <img src="https://img.shields.io/badge/Tools-33_Active_Tools-435433?style=for-the-badge&logo=wpexplorer" alt="33 Tools" />
  <img src="https://img.shields.io/badge/Frontend-React_18_+_Vite_6-61DAFB?style=for-the-badge&logo=react" alt="React 18 + Vite" />
  <img src="https://img.shields.io/badge/Styling-Tailwind_CSS_3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Theme-Luxury_Sage-5B7147?style=for-the-badge" alt="Luxury Sage" />
  <img src="https://img.shields.io/badge/License-MIT-262D20?style=for-the-badge" alt="License MIT" />
</p>

---

## 📑 Table of Contents

- [🌟 Overview \& Core Philosophy](#-overview--core-philosophy)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [🎨 UI \& Design System (Luxury Sage)](#-ui--design-system-luxury-sage)
- [🗂️ Complete Tool Catalog (33 Tools / 7 Suites)](#️-complete-tool-catalog-33-tools--7-suites)
- [🏗️ System Architecture](#️-system-architecture)
- [📂 Repository \& File Structure](#-repository--file-structure)
- [🧩 Pluggable Tool Adapter Pattern](#-pluggable-tool-adapter-pattern)
- [🚀 Quick Start \& Installation](#-quick-start--installation)
- [🪟 Windows Desktop Application (Electron.js)](#-windows-desktop-application-electronjs)
- [⚙️ Optional Localhost Server (Ghostscript)](#️-optional-localhost-server-ghostscript)
- [📚 Documentation Index](#-documentation-index)
- [📄 License](#-license)

---

## 🌟 Overview & Core Philosophy

Most online PDF tools (e.g., iLovePDF, Smallpdf) require users to upload sensitive files—financial records, legal contracts, identification scans—to remote cloud servers. This introduces data privacy risks, bandwidth bottlenecks, and potential regulatory non-compliance.

**ILoveMyOfficeWorks** was built to solve this problem permanently:

1. **🛡️ 100% Private & Zero Cloud Transmission**: Every document manipulation runs **entirely in your browser memory**. Bytes, pixels, and OCR text never leave your machine.
2. **⚡ Blazing Fast Local Processing**: Native WebAssembly, OffscreenCanvas downsampling, and modern JavaScript engines deliver instant results without network upload or download latency.
3. **🎨 Luxury Modern Aesthetics**: Crafted using a curated **Luxury Sage** and **Warm Cream** design system, interactive 3D particle physics via Three.js, fluid Framer Motion animations, and zero-line-break responsive navigation.
4. **🔌 Modular Adapter Architecture**: All 33 tools follow a unified, pluggable adapter contract, making the codebase extensible and clean.

---

## ✨ Key Features

- **33 Production-Grade Tools**: Full coverage across PDF organization, optimization, conversion, editing, security, and high-resolution image processing.
- **True In-Browser PDF to DOCX**: Extracts text coordinates, font styles, and paragraphs using `pdfjs-dist` and generates native Microsoft Word `.docx` documents via OpenXML.
- **4-Tier Intelligent Compression**: Features Extreme, Recommended, Light, and Custom downsampling modes with HTML5 Canvas downscaling and PDF object stream deduplication.
- **Ambient 3D Visuals**: Interactive background powered by `Three.js` that reacts gently to mouse velocity and window scrolling.
- **Diagnostic Splash Screen**: Real-time diagnostic boot sequence that verifies WebAssembly buffers, engine adapters, and privacy shields, with an immediate fallback pre-React loader in `index.html`.
- **Drag-and-Drop Staging Workspace**: Intuitive file card management, reordering (move up/down), real-time file size calculations, multi-file batch downloads, and celebratory confetti.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose & Implementation |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18** | Declarative component hierarchy, hooks, state management |
| **Build Tooling** | **Vite 6** | ESM-based lightning-fast HMR and Rollup-optimized production builds |
| **Styling & Tokens** | **Tailwind CSS 3.4** | Utility-first CSS, custom CSS tokens, modern glassmorphism |
| **3D Graphics** | **Three.js** | Interactive background particle field with mouse tracking |
| **Motion & Physics** | **Framer Motion 14** | Layout animations, accordion transitions, diagnostic boot loaders |
| **Celebrations** | **canvas-confetti** | High-performance confetti burst upon successful document generation |
| **PDF Manipulation** | **pdf-lib (v1.17)** | Page manipulation, merging, splitting, rotation, watermarking, forms |
| **PDF Rendering & OCR** | **pdfjs-dist (v6.4)** | Web Worker page rasterization, text layout analysis, canvas previews |
| **Word Generation** | **docx (v9.9)** | Client-side OpenXML `.docx` generator with styling, paragraphs, tables |
| **Archive Packaging** | **jszip (v3.10)** | Multi-file ZIP bundling for batch extractions and conversions |
| **File Staging** | **react-dropzone** | Accessible drag-and-drop file ingestion with MIME validation |
| **Icons** | **Lucide React** | Consistent, modern vector iconography across all 33 tools |
| **Backend (Optional)** | **Node.js + Express** | Optional localhost helper on port 3001 for native Ghostscript CLI |

---

## 🎨 UI & Design System (Luxury Sage)

The user interface adheres to a strict luxury design system inspired by organic botanical tones and editorial stationery:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LUXURY SAGE PALETTE                             │
├───────────────────┬───────────┬────────────────────────────────────────┤
│ Deep Sage Primary │ #5B7147   │ Brand accent, active states, buttons   │
│ Forest Dark       │ #435433   │ High-contrast headers, button hovers   │
│ Warm Cream        │ #FAF8F4   │ Primary page background canvas         │
│ Deep Charcoal Text│ #1E2619   │ High-legibility typography             │
│ Champagne Border  │ #E8E1D5   │ Card borders, subtle divider lines     │
│ Sand Accent       │ #DDD3C2   │ Dropdown containers, active borders    │
└───────────────────┴───────────┴────────────────────────────────────────┘
```

- **Zero-Line-Wrap Rule**: All navigation items, tool badges, and dropdown triggers utilize `whitespace-nowrap` to prevent unsightly multi-line wrapping across screen widths.
- **Glassmorphism**: Translucent floating surfaces with `backdrop-blur-xl` and subtle box shadows (`shadow-stone-900/5`).
- **Typography**: 
  - **Plus Jakarta Sans**: Primary headings, navigation labels, and hero titles.
  - **Inter**: Body descriptions and configuration labels.
  - **JetBrains Mono**: Technical metrics, byte savings, and file extension tags.

---

## 🗂️ Complete Tool Catalog (33 Tools / 7 Suites)

### 1. 🗂️ ORGANIZE PDF
| Tool ID | Name | Accepted Inputs | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `merge-pdf` | **Merge PDF** | Multiple PDFs | Combine unlimited PDFs in arbitrary order with drag-and-drop sequence |
| `split-pdf` | **Split PDF** | Single PDF | Slice into individual pages, fixed page intervals, or custom ranges (`1-3, 5, 8-10`) |
| `remove-pages` | **Remove Pages** | Single PDF | Strip unwanted, blank, or duplicate pages by comma-separated index |
| `extract-pages` | **Extract Pages** | Single PDF | Pick and bundle specific page ranges into an isolated new PDF |
| `organize-pdf` | **Organize PDF** | Single PDF | Reorder, reverse, or duplicate pages with customizable page sequences |
| `scan-to-pdf` | **Scan to PDF** | Photos / Images | Clean up photos with auto-contrast, grayscale, and document cropping |

### 2. ⚡ OPTIMIZE PDF
| Tool ID | Name | Accepted Inputs | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `compress-pdf` | **Compress PDF** | Single PDF | 4 compression profiles, canvas downsampling, metadata purging, Ghostscript bridge |
| `repair-pdf` | **Repair PDF** | Damaged PDF | Recover corrupted xref tables, rebuild broken trailer dictionaries, and salvage streams |
| `ocr-pdf` | **OCR PDF** | Scanned PDF | Extract text layers from scanned pages and generate searchable PDFs and TXT files |

### 3. 📥 CONVERT TO PDF
| Tool ID | Name | Accepted Inputs | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `jpg-to-pdf` | **JPG to PDF** | JPG, PNG, WebP | Multi-image compilation with orientation control (Portrait/Landscape) and margins |
| `word-to-pdf` | **WORD to PDF** | Word (`.docx`) | Convert Word OpenXML documents into formatted PDF vector sheets |
| `powerpoint-to-pdf` | **PowerPoint to PDF** | Presentation (`.pptx`) | Convert PowerPoint slides into landscape presentation PDFs |
| `excel-to-pdf` | **Excel to PDF** | Spreadsheets (`.xlsx`, `.csv`) | Render structured data tables into styled vector PDF pages |
| `html-to-pdf` | **HTML to PDF** | HTML, Webpages | Render HTML markup, CSS styling, and web articles into printable PDFs |

### 4. 📤 CONVERT FROM PDF
| Tool ID | Name | Accepted Inputs | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `pdf-to-jpg` | **PDF to JPG** | Single PDF | Render PDF pages to high-res JPG or PNG images; downloads individual or ZIP |
| `pdf-to-docx` | **PDF to WORD** | Single PDF | Client-side text parsing into editable Microsoft Word (`.docx`) with typography |
| `pdf-to-powerpoint` | **PDF to PowerPoint** | Single PDF | Convert presentation PDFs into 16:9 editable PowerPoint slides (`.pptx`) |
| `pdf-to-excel` | **PDF to Excel** | Single PDF | Detect numeric matrices and tabular data; export clean CSV / Excel sheets |
| `pdf-to-pdfa` | **PDF to PDF/A** | Single PDF | Convert into ISO 19005-1 compliant PDF/A archival format with embedded fonts |

### 5. ✍️ EDIT PDF
| Tool ID | Name | Accepted Inputs | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `rotate-pdf` | **Rotate PDF** | Single PDF | Rotate all or selected pages by 90°, 180°, or 270° with thumbnail preview |
| `add-page-numbers` | **Add Page Numbers** | Single PDF | Insert page numbers with custom position (Header/Footer), format, and fonts |
| `add-watermark` | **Add Watermark** | Single PDF | Stamp custom text watermarks with opacity, angle, and size control |
| `crop-pdf` | **Crop PDF** | Single PDF | Trim margins, crop page dimensions, and remove white borders |
| `edit-pdf` | **Edit PDF** | Single PDF | Add custom text annotations, headers, stamps, and notes directly onto pages |
| `pdf-forms` | **PDF Forms** | Single PDF | Flatten interactive form fields into static vector elements or lock inputs to read-only |

### 6. 🛡️ PDF SECURITY
| Tool ID | Name | Accepted Inputs | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `unlock-pdf` | **Unlock PDF** | Encrypted PDF | Decrypt password-protected documents and strip printing/copying restrictions |
| `protect-pdf` | **Protect PDF** | Single PDF | Encrypt documents with standard AES password protection |
| `sign-pdf` | **Sign PDF** | Single PDF | Place electronic signature badges, verification seals, and signing dates |
| `redact-pdf` | **Redact PDF** | Single PDF | Permanently blackout sensitive keywords, numbers, or rectangular areas |
| `compare-pdf` | **Compare PDF** | Two PDFs | Compare two PDF versions side-by-side with visual text diff metrics |

### 7. 🖼️ IMAGE TOOLS
| Tool ID | Name | Accepted Inputs | Key Capabilities |
| :--- | :--- | :--- | :--- |
| `compress-image` | **Compress Image** | JPG, PNG, WebP | Shrink image file size with smart quality sliders and dimension preservation |
| `resize-image` | **Resize Image** | Any Image | Scale images by percentage or custom width/height with aspect-ratio locking |
| `crop-image` | **Crop Image** | Any Image | Crop images with preset aspect ratios (1:1, 16:9, 4:3) or custom pixel margins |
| `convert-to-jpg` | **Convert to JPG** | PNG, WebP, SVG, BMP | Transcode arbitrary image formats into standard, universal JPEG files |

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([User Ingests Document]) --> Dropzone[React Dropzone Ingestion]
    Dropzone --> Staging[Client State Staging & Validation]
    Staging --> Dispatcher[Adapter Registry Dispatcher]
    
    subgraph Browser Engine Sandbox [100% Client-Side In-Memory Execution]
        Dispatcher --> PDFLib[pdf-lib Engine]
        Dispatcher --> PDFJS[pdfjs-dist Canvas Engine]
        Dispatcher --> DOCX[docx OpenXML Engine]
        Dispatcher --> Canvas[HTML5 Canvas / OffscreenCanvas]
        Dispatcher --> JSZip[JSZip Multi-File Packager]
    end
    
    PDFLib --> Result[Processed Blob & Data URI]
    PDFJS --> Result
    DOCX --> Result
    Canvas --> Result
    JSZip --> Result
    
    subgraph Optional Localhost Helper [Port 3001]
        Dispatcher -.->|Optional Ghostscript Available| NodeServer[Local Node Express Bridge]
        NodeServer -.->|Spawn Local gs CLI| Ghostscript[System Ghostscript]
        Ghostscript -.-> NodeServer
        NodeServer -.-> Result
    end

    Result --> UI[FileCard Preview & Instant Download]
    Result --> Confetti[Celebratory Confetti Burst]
```

---

## 📂 Repository & File Structure

```
ILoveMyOfficeWorks/
├── AGENTS.md                          # Comprehensive guide for AI Agents
├── README.md                          # Human developer & user documentation (You are here)
├── package.json                       # Monorepo root scripts & dev runners
├── .gitignore                         # Git exclusion rules
├── .agents/                           # Agent skills and project rules
│   ├── rules/
│   │   └── project_guidelines.md      # Strict guidelines for AI contributors
│   └── skills/
│       └── ilovemyofficeworks-toolkit/
│           └── SKILL.md               # Antigravity skill cheatsheet
├── docs/
│   └── project-knowledge/             # Architectural knowledge base
│       ├── README.md                  # Knowledge index
│       ├── 01-architecture-and-philosophy.md
│       ├── 02-tools-and-engines.md
│       ├── 03-adapter-specification.md
│       └── 04-ui-and-design-system.md
├── client/                            # React 18 + Vite Frontend Application
│   ├── index.html                     # HTML shell + inline zero-flash pre-React splash
│   ├── package.json                   # Client dependencies (pdf-lib, docx, framer-motion)
│   ├── vite.config.js                 # Vite bundler configuration
│   ├── tailwind.config.js             # Tailwind CSS tokens & theme configuration
│   ├── postcss.config.js              # PostCSS plugins
│   ├── public/
│   │   ├── logo.png                   # Official high-resolution brand logo
│   │   └── favicon.png                # Browser tab icon
│   └── src/
│       ├── main.jsx                   # React root entry point
│       ├── App.jsx                    # Root application state & tool routing
│       ├── index.css                  # Tailored design tokens, typography, scrollbars
│       ├── components/                # Modular UI components
│       │   ├── Navbar.jsx             # Zero-wrap navigation bar & category dropdowns
│       │   ├── HomeScreen.jsx         # Home hero banner, category grid & search filter
│       │   ├── SplashScreen.jsx       # Diagnostic startup splash screen & progress bar
│       │   ├── ThreeCanvas.jsx        # Interactive 3D particle background (Three.js)
│       │   ├── Uploader.jsx           # Drag-and-drop file ingestion zone
│       │   ├── FileCard.jsx           # File queue cards with reordering controls
│       │   └── OperationBar.jsx       # Action execution trigger & progress indicator
│       ├── registry/                  # Pluggable Tool Adapter Registry
│       │   ├── registry.js            # Central adapter loader & dispatcher
│       │   └── adapters/              # 34 Pluggable Tool Adapters
│       │       ├── merge-pdf.js
│       │       ├── split-pdf.js
│       │       ├── compress-pdf.js
│       │       ├── pdf-to-docx.js
│       │       ├── pdf-to-jpg.js
│       │       ├── protect-pdf.js
│       │       └── ... (34 adapters)
│       └── utils/                     # Core computational engines
│           ├── pdf-compressor-engine.js  # Canvas downsampler + object stream cleaner
│           ├── pdf-to-docx-engine.js    # PDF.js to Word OpenXML converter
│           └── pdf-magic.js             # Encryption detector & metadata inspector
├── desktop/                           # Windows Desktop Application (Electron.js)
│   ├── assets/                        # Windows .ico and .png app icons
│   ├── main.cjs                       # Electron main process (frameless window, IPC, dialogs)
│   ├── preload.cjs                    # Secure contextBridge API for desktop features
│   ├── electron-builder.json          # Windows installer (NSIS) and portable config
│   ├── package.json                   # Desktop scripts & Electron dependencies
│   └── README.md                      # Desktop setup and build guide
└── server/                            # Optional Localhost Helper (Port 3001)
    └── server.js                      # Localhost Ghostscript bridge (optional)
```

---

## 🧩 Pluggable Tool Adapter Pattern

Every operation in **ILoveMyOfficeWorks** implements the **Standard Tool Adapter Contract**:

```javascript
// client/src/registry/adapters/example-tool.js

export default {
  // 1. Unique string identifier
  id: 'example-tool',

  // 2. User-facing display name and metadata
  name: 'Example Tool',
  description: 'Concise explanation of what this tool accomplishes.',
  badge: 'Category',

  // 3. Validation rule for uploaded files
  accepts(files) {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least one file.' };
    }
    const allPdf = files.every((f) => f.name.toLowerCase().endsWith('.pdf'));
    return { valid: allPdf, reason: allPdf ? '' : 'All files must be PDFs.' };
  },

  // 4. Configurable tool options (rendered automatically in OperationBar)
  options: [
    {
      id: 'mode',
      label: 'Operation Mode',
      type: 'select',
      defaultValue: 'standard',
      choices: [
        { label: 'Standard Mode', value: 'standard' },
        { label: 'High Fidelity', value: 'high' },
      ],
    },
  ],

  // 5. Execution engine (100% client-side)
  async execute(files, options, onProgress) {
    onProgress?.(25, 'Reading file buffers...');
    // ... document processing logic ...
    onProgress?.(100, 'Complete!');

    return {
      success: true,
      files: [
        {
          name: 'output-document.pdf',
          blob: new Blob([...], { type: 'application/pdf' }),
          type: 'application/pdf',
        },
      ],
    };
  },
};
```

All adapters are loaded and registered in [client/src/registry/registry.js](file:///d:/ILoveMyOfficeWorks/client/src/registry/registry.js).

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/Anshumaankhare2403/ILoveMyOfficeWorks.git
cd ILoveMyOfficeWorks

# Install root, client, and server dependencies
npm install
npm install --prefix client
npm install --prefix server
```

### 2. Start Development Environment
```bash
# Starts both the React client (Port 5173) and local server (Port 3001) concurrently
npm run dev
```
Open your browser and navigate to: **`http://localhost:5173/`**

### 3. Build for Production
```bash
# Compile and bundle the client into static assets
npm run build --prefix client
```
The optimized production bundle will be output to `client/dist/`.

---

## 🪟 Windows Desktop Application (Electron.js)

The project includes a dedicated `desktop/` folder containing the full **Electron.js Windows Desktop Edition**:

### 1. Run Desktop in Development Mode
Runs Vite dev server with live hot-reloading and launches Electron:
```bash
npm run desktop:dev
```

### 2. Run Desktop Production Build Locally
Tests the desktop application against the compiled static client bundle:
```bash
npm run desktop:start
```

### 3. Package Windows Executables (.exe & NSIS Installer)
Generates both an NSIS installer and a single-file portable Windows executable:
```bash
npm run desktop:build
```
Output files will be saved in `desktop/dist-electron/`:
- `ILoveMyOfficeWorks-Windows-1.0.0.exe` (Windows Installer)
- `ILoveMyOfficeWorks-Windows-Portable-1.0.0.exe` (Single-file Portable)

### 🌟 Desktop-Exclusive Windows Features:
- **Luxury Sage Frameless Title Bar**: Native minimize, maximize/restore, and close buttons integrated directly with the UI.
- **Windows File Associations**: Native `.pdf` registration and support for opening files via double-click from File Explorer.
- **Native File Dialogs**: Native Windows Save / Open file dialogs.
- **Direct Save & Explorer Reveal**: Save directly to local folders and reveal in Windows File Explorer with one click.

---

## ⚙️ Optional Localhost Server (Ghostscript)

While **all 33 tools run 100% in the browser** without any server required, the optional local Node backend (`server/server.js`) can leverage system-installed **Ghostscript** for industrial-grade compression if available:

- Runs on **`http://localhost:3001`**.
- Automatically checks for `gs`, `gswin64c`, or `gswin32c`.
- If Ghostscript is not detected or the server is stopped, the client **automatically falls back to pure in-browser canvas and object-stream compression**.

---

## 📚 Documentation Index

For technical deep-dives and AI Agent instructions, refer to:

- [AGENTS.md](file:///d:/ILoveMyOfficeWorks/AGENTS.md) — Quick orientation for AI pair programmers.
- [docs/project-knowledge/01-architecture-and-philosophy.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/01-architecture-and-philosophy.md) — Zero-cloud privacy model.
- [docs/project-knowledge/02-tools-and-engines.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/02-tools-and-engines.md) — Comprehensive engine mechanics.
- [docs/project-knowledge/03-adapter-specification.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/03-adapter-specification.md) — Adapter interface contract.
- [docs/project-knowledge/04-ui-and-design-system.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/04-ui-and-design-system.md) — UI tokens & design rules.

---

## 📄 License

Distributed under the **MIT License**. Free for personal and commercial usage.

---

<p align="center">
  Crafted with care for complete document privacy & productivity 🌿📄
</p>
