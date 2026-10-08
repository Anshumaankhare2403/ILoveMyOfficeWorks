# ILoveMyOfficeWorks — Personal PDF Toolkit 📄✨

A personal, private, client-first PDF and document conversion suite built with **React (Vite)**, **Tailwind CSS**, **Framer Motion**, and **Three.js**, with a lightweight local **Node.js backend**, designed with a luxury, modern sage green (`#5B7147`) and cream (`#FAF8F4`) palette.

> **100% Local & Private**: All document operations run directly in your browser using WebAssembly, HTML5 Canvas, and memory buffers. No files are uploaded to external servers or cloud services.

---

## 🚀 Complete Feature Suite (29 Tools Across 6 Categories)

### 1. 🗂️ ORGANIZE PDF
1. **Merge PDF (`merge-pdf.js`)**: Combine unlimited PDF documents sequentially with custom page ordering.
2. **Split PDF (`split-pdf.js`)**: Custom range extraction (`1-3, 5, 8-10`) or fixed chunk slicing (every *N* pages).
3. **Remove pages (`remove-pages.js`)**: Delete unwanted, duplicate, or blank pages from your PDF document.
4. **Extract pages (`extract-pages.js`)**: Select specific page ranges and extract them into a brand-new PDF.
5. **Organize PDF (`organize-pdf.js`)**: Reorder, reverse, rearrange, or duplicate pages into a custom sequence.
6. **Scan to PDF (`scan-to-pdf.js`)**: Convert camera photos and document scans into high-contrast clean PDF files.

### 2. ⚡ OPTIMIZE PDF
1. **Compress PDF (`compress-pdf.js`)**: 4 compression tiers (Balanced, Extreme, Light, Custom) with canvas downsampling.
2. **Repair PDF (`repair-pdf.js`)**: Analyze corrupted, unreadable PDF structures and rebuild intact object streams.
3. **OCR PDF (`ocr-pdf.js`)**: Recognize scanned text into a searchable PDF overlay and text transcript export.

### 3. 📥 CONVERT TO PDF
1. **JPG to PDF (`jpg-to-pdf.js`)**: Convert JPG, PNG, and WebP images into a clean PDF document.
2. **WORD to PDF (`word-to-pdf.js`)**: Convert Microsoft Word documents (`.docx`) into vector PDF documents.
3. **POWERPOINT to PDF (`powerpoint-to-pdf.js`)**: Convert PowerPoint presentation decks (`.pptx`) into landscape PDF slides.
4. **EXCEL to PDF (`excel-to-pdf.js`)**: Convert Excel spreadsheets and CSV tables into formatted vector PDF tables.
5. **HTML to PDF (`html-to-pdf.js`)**: Convert HTML documents, webpages, and code into clean vector PDF documents.

### 4. 📤 CONVERT FROM PDF
1. **PDF to JPG (`pdf-to-jpg.js`)**: Render PDF pages into high-resolution JPG or PNG images and ZIP archive.
2. **PDF to WORD (`pdf-to-docx.js`)**: Convert PDFs into fully editable Microsoft Word (`.docx`) files with typography.
3. **PDF to POWERPOINT (`pdf-to-powerpoint.js`)**: Convert PDF document pages into formatted PowerPoint presentation slides (`.pptx`).
4. **PDF to EXCEL (`pdf-to-excel.js`)**: Extract tables, rows, invoices, and numbers from PDF into Excel CSV format.
5. **PDF to PDF/A (`pdf-to-pdfa.js`)**: Convert PDF to ISO 19005 compliant archival PDF/A format with color profiles.

### 5. ✍️ EDIT PDF
1. **Rotate PDF (`rotate-pdf.js`)**: Rotate all or specific pages clockwise by 90°, 180°, or 270°.
2. **Add page numbers (`add-page-numbers.js`)**: Insert customizable page numbering, headers, and footers.
3. **Add watermark (`add-watermark.js`)**: Stamp custom text or security watermarks with angle and opacity control.
4. **Crop PDF (`crop-pdf.js`)**: Trim margins, crop page dimensions, and remove white borders.
5. **Edit PDF (`edit-pdf.js`)**: Add custom text annotations, headers, stamps, and notes directly onto pages.
6. **PDF Forms (`pdf-forms.js`)**: Flatten interactive form fields into static vector elements or lock inputs to read-only.

### 6. 🛡️ PDF SECURITY
1. **Unlock PDF (`unlock-pdf.js`)**: Remove password protection and unlock printing and copying permissions.
2. **Protect PDF (`protect-pdf.js`)**: Encrypt PDF with AES password protection to prevent unauthorized opening or editing.
3. **Sign PDF (`sign-pdf.js`)**: Apply an electronic signature badge, verified signing certificate block, and date.
4. **Redact PDF (`redact-pdf.js`)**: Permanently blackout sensitive information, confidential phrases, or page areas.
5. **Compare PDF (`compare-pdf.js`)**: Compare two PDF documents side-by-side with an audit diff report.

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
