# ILoveMyOfficeWorks — Personal PDF Toolkit 📄✨

A personal, private, client-first PDF and document conversion suite built with **React (Vite)**, **Tailwind CSS**, **Framer Motion**, and **Three.js**, with a lightweight local **Node.js backend**, designed with a luxury, modern sage green (`#5B7147`) and cream (`#FAF8F4`) palette.

> **100% Local & Private**: All document operations run directly in your browser using WebAssembly, HTML5 Canvas, and memory buffers. No files are uploaded to external servers or cloud services.

---

## 🚀 Complete Feature Suite

### 📦 Essential PDF Productivity Tools
1. **Multi-PDF Merger (`merge-pdf.js`)**
   - Unlimited file count: merge 2, 10, or 100+ documents in memory.
   - Interactive reordering of documents before concatenation.
   - Live progress indicator with celebratory confetti upon completion.
2. **PDF Splitter (`split-pdf.js`)**
   - Custom range extraction (e.g. `1-3, 5, 8-10`).
   - Fixed chunk slicing (every *N* pages).
   - Instant multi-file downloads and `.zip` archive packaging via `JSZip`.
3. **PDF Compressor (`compress-pdf.js` & `pdf-compressor-engine.js`)**
   - 4 Compression Tiers: **Balanced**, **Extreme**, **Light**, and **Custom**.
   - Client-side Canvas image downsampling, JPEG re-encoding, and object stream packing.
   - Live before/after size reduction metrics and negative compression prevention.

---

### 📥 CONVERT TO PDF Suite
1. **JPG to PDF (`jpg-to-pdf.js`)**
   - Convert JPG, PNG, and WebP images into a clean PDF document.
   - Configurable orientation (Auto, Portrait, Landscape), page sizes (A4, Letter, Fit to Image), and margins.
2. **WORD to PDF (`word-to-pdf.js`)**
   - Convert Microsoft Word documents (`.docx`) into vector PDF documents.
   - Extracts XML text runs, paragraphs, and heading hierarchies directly in the browser.
3. **POWERPOINT to PDF (`powerpoint-to-pdf.js`)**
   - Convert PowerPoint presentation decks (`.pptx`) into landscape PDF slides.
4. **EXCEL to PDF (`excel-to-pdf.js`)**
   - Convert Excel spreadsheets and CSV tables into formatted vector PDF tables with gridlines.
5. **HTML to PDF (`html-to-pdf.js`)**
   - Convert HTML documents, webpages, and code into clean, printable vector PDF documents.

---

### 📤 CONVERT FROM PDF Suite
1. **PDF to JPG (`pdf-to-jpg.js`)**
   - Render PDF pages into high-resolution JPG or PNG images (72 DPI, 150 DPI, 300 DPI).
   - Package all pages into a `.zip` archive or download individually.
2. **PDF to WORD (`pdf-to-docx.js` & `pdf-to-docx-engine.js`)**
   - Convert PDFs into fully editable Microsoft Word (`.docx`) documents with typography and headings.
   - Supports Flowable editable paragraphs or Scanned page visual fallback.
3. **PDF to POWERPOINT (`pdf-to-powerpoint.js`)**
   - Convert PDF document pages into formatted PowerPoint presentation slides (`.pptx`).
4. **PDF to EXCEL (`pdf-to-excel.js`)**
   - Extract tables, rows, invoices, and numbers from PDF into Excel CSV format.
5. **PDF to PDF/A (`pdf-to-pdfa.js`)**
   - Convert PDF to ISO 19005 compliant archival PDF/A format with DeviceRGB color profiles and standardized XMP metadata.

---

## 🛠️ Architecture & Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Instant hot module replacement, optimized production bundle |
| **Styles & Design** | Tailwind CSS, Plus Jakarta Sans, JetBrains Mono | Luxury Sage design system, glassmorphism, zero-wrap navbar |
| **Motion** | Framer Motion, canvas-confetti | Smooth layout transitions, active tab sliding indicators |
| **3D Background** | Three.js | Ambient interactive particle web background |
| **Document Engines** | `pdf-lib`, `pdfjs-dist`, `docx`, `jszip` | 100% in-browser manipulation, zero external network requests |

---

## 💻 Developer Quick Start

```bash
# Install dependencies
npm install

# Start development server (Client on 5173, optional server on 3001)
npm run dev

# Build client for production
npm run build --prefix client
```

For AI agent guidelines and architecture deep-dives, see:
- [AGENTS.md](file:///d:/ILoveMyOfficeWorks/AGENTS.md)
- [docs/project-knowledge/README.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/README.md)
