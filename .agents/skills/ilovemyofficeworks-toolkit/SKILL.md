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

This project is a standalone, client-first PDF and document workbench providing four core capabilities:

### A. PDF Merger (`merge-pdf.js`)
- Combines 2 or more PDF documents sequentially.
- Uses `pdf-lib`'s `PDFDocument.load()` and `copyPages()` to preserve vector clarity, form fields, and annotations.
- Allows live user drag/reordering in the Document Queue before executing.

### B. PDF Splitter (`split-pdf.js`)
- Two splitting modes:
  1. **Page Ranges**: e.g., `1-3, 5, 8-10` into discrete PDF outputs.
  2. **Fixed Chunks**: e.g., every `N` pages into sequential files.
- Automatically creates individual download blobs or a multi-file collection.

### C. PDF Compressor (`pdf-compressor-engine.js` & `compress-pdf.js`)
- Multi-tier in-browser compression pipeline:
  1. **Balanced Mode**: Downsamples images to max 1200px at 70% JPEG quality, strips unused metadata, compacts object streams.
  2. **Extreme Mode**: Downsamples images to max 800px at 45% JPEG quality for massive reduction (70–85% file size drop).
  3. **Light Mode**: 100% lossless vector text preservation, mild image optimization (15–30% drop).
  4. **Custom Mode**: User-defined resolution scale (50%–100%) and JPEG quality slider (0.1–1.0).
- Pure client-side processing using `HTML5 Canvas`, `createImageBitmap`, `pdf-lib`, and optional localhost Ghostscript fallback if available.

### D. PDF to Word (DOCX) Converter (`pdf-to-docx-engine.js` & `pdf-to-docx.js`)
- Converts PDFs into editable `.docx` files:
  1. Extracts text runs, font dimensions, layout coordinates, and line breaks using `pdfjs-dist`.
  2. Emits OpenXML paragraphs, headings (`H1`, `H2`, `H3`), tables, and page breaks via `docx`.
  3. Supports two modes: **Flowable** (editable Word paragraphs) and **Visual Scanned** (layout preservation).

### E. Modular Adapter Architecture (`client/src/registry/`)
- Declarative pattern decoupling the UI from execution engines.
- `ADAPTER_REGISTRY` holds all tools with input validation, configurable UI options, and progress emission.

### F. Design & UX System
- Luxury Sage Palette (`#5B7147`, `#435433`, `#FAF8F4`).
- Glassmorphic floating nav with single-line zero-wrap tabs.
- Ambient Three.js particle canvas background.

---

## 2. How to Add a New Tool (Step-by-Step)

To add a new tool (e.g., `pdf-to-images`, `rotate-pdf`, `watermark-pdf`):

1. **Create the Engine Utility** (if complex):
   - Place in `client/src/utils/<tool>-engine.js`.
   - Accept `ArrayBuffer` and options, return modified `Uint8Array` or `Blob`.

2. **Create the Adapter**:
   - Place in `client/src/registry/adapters/<tool-id>.js`.
   - Implement `id`, `name`, `description`, `badge`, `accepts(files)`, `options`, and `execute(files, options, onProgress)`.

3. **Register the Adapter**:
   - Import and add to `ADAPTER_REGISTRY` in `client/src/registry/registry.js`.

4. **Add UI Tab (Optional)**:
   - If the tool requires a dedicated tab in `Navbar.jsx`, add its tab entry and corresponding screen in `App.jsx`.

5. **Verify Build**:
   ```bash
   npm run build --prefix client
   ```
