---
name: ilovemyofficeworks-toolkit
description: >-
  Expert guide for the ILoveMyOfficeWorks codebase. Use when modifying or adding PDF operations,
  inspecting client-side document engines, working with the adapter registry, or designing UI features.
---

# ILoveMyOfficeWorks Developer Skill

Use this skill to navigate, develop, and extend features in the **ILoveMyOfficeWorks** codebase.

---

## 1. What Was Created in This Project

This project is a standalone, client-first PDF and document workbench providing a complete suite of 13 in-browser document tools:

### Core PDF Productivity Tools
- **PDF Merger (`merge-pdf.js`)**: Combines unlimited PDF documents sequentially with custom page ordering.
- **PDF Splitter (`split-pdf.js`)**: Extracts custom page ranges or slices large documents into fixed chunks of *N* pages with ZIP packaging.
- **PDF Compressor (`compress-pdf.js` & `pdf-compressor-engine.js`)**: Multi-tier in-browser compression (Balanced, Extreme, Light, Custom) with canvas downsampling, metadata purging, and stream rebuilding.

### CONVERT TO PDF Suite
- **JPG to PDF (`jpg-to-pdf.js`)**: Converts JPG, PNG, and WebP images into a single PDF document with custom margins, orientation, and page sizes.
- **WORD to PDF (`word-to-pdf.js`)**: Extracts XML paragraphs and headings from `.docx` via JSZip and generates clean vector PDF documents.
- **POWERPOINT to PDF (`powerpoint-to-pdf.js`)**: Extracts slides from `.pptx` and converts them into landscape PDF presentation slides.
- **EXCEL to PDF (`excel-to-pdf.js`)**: Converts CSV tables and spreadsheets into formatted vector PDF tables with gridlines.
- **HTML to PDF (`html-to-pdf.js`)**: Renders HTML documents and code into clean, printable vector PDF documents.

### CONVERT FROM PDF Suite
- **PDF to JPG (`pdf-to-jpg.js`)**: Renders PDF pages into high-resolution JPG or PNG images (72, 150, 300 DPI) and packages them into a `.zip` archive.
- **PDF to WORD (`pdf-to-docx.js` & `pdf-to-docx-engine.js`)**: Converts PDFs into fully editable Microsoft Word (`.docx`) files with font metrics, headings, and layout flow.
- **PDF to POWERPOINT (`pdf-to-powerpoint.js`)**: Converts PDF pages into formatted PowerPoint presentation slides (`.pptx`).
- **PDF to EXCEL (`pdf-to-excel.js`)**: Extracts tables, rows, invoices, and numbers from PDF into Excel CSV format.
- **PDF to PDF/A (`pdf-to-pdfa.js`)**: Converts PDF to ISO 19005 compliant archival PDF/A standard with DeviceRGB color profiles and standardized XMP metadata.

### Modular Architecture & Design System
- **Adapter Registry (`client/src/registry/`)**: Decouples UI from execution engines. All 13 tools adhere to the standard adapter contract.
- **Design System**: Luxury Sage Palette (`#5B7147`, `#435433`, `#FAF8F4`), Plus Jakarta Sans, JetBrains Mono, glassmorphism, and zero-wrap navigation rules.
- **Ambient 3D Canvas (`ThreeCanvas.jsx`)**: Interactive Three.js particle canvas in background.

---

## 2. How to Add a New Tool (Step-by-Step)

To add a new tool (e.g., `rotate-pdf`, `watermark-pdf`):

1. **Create the Engine Utility** (if complex):
   - Place in `client/src/utils/<tool>-engine.js`.
   - Accept `ArrayBuffer` and options, return modified `Uint8Array` or `Blob`.

2. **Create the Adapter**:
   - Place in `client/src/registry/adapters/<tool-id>.js`.
   - Implement `id`, `name`, `description`, `badge`, `accepts(files)`, `options`, and `execute(files, options, onProgress)`.

3. **Register the Adapter**:
   - Import and add to `ADAPTER_REGISTRY` in `client/src/registry/registry.js`.

4. **Verify Build**:
   ```bash
   npm run build --prefix client
   ```
