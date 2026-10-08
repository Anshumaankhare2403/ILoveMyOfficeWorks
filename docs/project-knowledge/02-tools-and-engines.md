# 02 — Tools & Processing Engines

This document covers the algorithmic implementation, capabilities, and edge cases of the four core document engines.

---

## 1. PDF Merger Engine

- **Adapter**: [`client/src/registry/adapters/merge-pdf.js`](file:///d:/ILoveMyOfficeWorks/client/src/registry/adapters/merge-pdf.js)
- **Primary Library**: `pdf-lib`

### How It Works:
1. Validates that at least 2 unencrypted PDF files are selected.
2. Initializes an empty `mergedPdf = await PDFDocument.create()`.
3. Sequentially loads each file buffer with `PDFDocument.load(buffer, { ignoreEncryption: false })`.
4. Copies all pages into the merged target via `mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices())`.
5. Retains document outlines, interactive bookmarks, and page dimensions.
6. Serializes the final document with `mergedPdf.save({ useObjectStreams: true })`.
7. Wraps bytes into a `Blob([mergedBytes], { type: 'application/pdf' })` and triggers browser download.

---

## 2. PDF Splitter Engine

- **Adapter**: [`client/src/registry/adapters/split-pdf.js`](file:///d:/ILoveMyOfficeWorks/client/src/registry/adapters/split-pdf.js)
- **Primary Library**: `pdf-lib`

### Modes:
1. **Range Mode (`splitMode: 'ranges'`)**:
   - Parses custom page ranges (e.g., `1-3, 5, 8-12`).
   - Validates that requested pages are within 1 and `totalPages`.
   - Generates a separate PDF file for each comma-separated range chunk.
2. **Fixed Chunk Mode (`splitMode: 'chunks'`)**:
   - Divides the document into equal packets of `everyNPages` (e.g. every 2 pages from a 10-page document produces 5 files).
3. **Single Page Extraction (`splitMode: 'single'`)**:
   - Emits an array of single-page PDFs for every page in the source document.

---

## 3. PDF Compressor Engine

- **Adapter**: [`client/src/registry/adapters/compress-pdf.js`](file:///d:/ILoveMyOfficeWorks/client/src/registry/adapters/compress-pdf.js)
- **Engine Core**: [`client/src/utils/pdf-compressor-engine.js`](file:///d:/ILoveMyOfficeWorks/client/src/utils/pdf-compressor-engine.js)

### Algorithmic Pipeline:
PDF files typically bloat due to three factors: uncompressed embedded raster images, duplicate object streams, and unused metadata (thumbnails, XML metadata, embedded private fonts).

The **Master Pipeline** implements:
1. **Image Object Stream Extraction & Canvas Downsampling**:
   - Scans PDF dictionaries for `XObject` instances with `Subtype === 'Image'`.
   - Decodes DCT (JPEG) or raw Flate streams.
   - Re-encodes bitmaps through an offscreen HTML5 `Canvas` with scaled dimensions and target quality (`canvas.toBlob(resolve, 'image/jpeg', quality)`).
   - Replaces the raw image stream in `pdf-lib` with the recompressed JPEG bytes.
2. **Metadata & Thumbnail Stripping**:
   - Prunes document information dictionaries, metadata XML packets, and page preview thumbnails.
3. **Object Stream Compaction**:
   - Saves via `pdfDoc.save({ useObjectStreams: true })`, packing indirect objects into compressed object streams.
4. **Fallback System**:
   - Detects if optional Ghostscript server is running on `http://localhost:3001`.
   - Compares output file sizes: **if compressed size is larger than original, the original buffer is preserved** to avoid negative compression!

### Available Modes:
| Mode | Image Max Dimension | JPEG Quality | Target Use Case | Expected Reduction |
| :--- | :--- | :--- | :--- | :--- |
| **Balanced (Recommended)** | 1200 px | 0.70 | General office documents, balance of sharpness & size | 40% – 60% |
| **Extreme** | 800 px | 0.45 | Scanned documents, email attachments, web sharing | 70% – 85% |
| **Light / High Quality** | 1800 px | 0.85 | Official filings, print-ready documents, sharp vectors | 15% – 30% |
| **Custom** | User Configured | User Configured | Precise DPI and fidelity control | Flexible |

---

## 4. PDF to Word (DOCX) Converter Engine

- **Adapter**: [`client/src/registry/adapters/pdf-to-docx.js`](file:///d:/ILoveMyOfficeWorks/client/src/registry/adapters/pdf-to-docx.js)
- **Engine Core**: [`client/src/utils/pdf-to-docx-engine.js`](file:///d:/ILoveMyOfficeWorks/client/src/utils/pdf-to-docx-engine.js)
- **Libraries**: `pdfjs-dist` + `docx`

### Algorithmic Pipeline:
1. **Vector & Text Extraction with PDF.js**:
   - Loads document via `pdfjsLib.getDocument({ data, cMapUrl, cMapPacked })`.
   - Extracts page-by-page text items with geometric bounding boxes (`x`, `y`, `width`, `height`, `fontName`).
2. **Line Reconstruction & Layout Clustering**:
   - Sorts text items top-to-bottom and left-to-right.
   - Groups text items within a vertical epsilon into unified lines and paragraphs.
3. **Heading Auto-Detection**:
   - Calculates page median font size.
   - Text items exceeding `median * 1.35` are classified as `HeadingLevel.HEADING_2`.
   - Text items exceeding `median * 1.6` are classified as `HeadingLevel.HEADING_1` or Document Title.
4. **OpenXML Document Generation with `docx`**:
   - Builds `docx.Document` structure with standard margins (1 inch / 1440 twips).
   - Sanitizes text to remove invalid XML 1.0 control characters (`cleanXmlString`).
   - Inserts `PageBreak()` elements when original page boundaries are crossed (configurable).
5. **Serialization**:
   - Packs into Word OpenXML standard via `Packer.toBlob(doc)`.
   - Returns valid `.docx` file ready for Microsoft Word, Google Docs, or LibreOffice.

---

## 5. Convert to PDF Suite

### A. JPG to PDF (`jpg-to-pdf.js`)
- **Supported Formats**: JPG, JPEG, PNG, WebP, BMP, GIF.
- **Engine**: `pdf-lib` + Canvas bitmap re-encoding.
- **Features**: Auto/Portrait/Landscape orientation, A4/Letter/Fit to Image dimensions, configurable margins (None, Small, Large).

### B. WORD to PDF (`word-to-pdf.js`)
- **Engine**: In-browser XML extraction via `JSZip` (`word/document.xml`) + `pdf-lib` vector typesetting.
- **Features**: Auto-detects heading styles (`Heading 1`, `Heading 2`, Title) and body paragraphs.

### C. POWERPOINT to PDF (`powerpoint-to-pdf.js`)
- **Engine**: `JSZip` XML extraction (`ppt/slides/slide*.xml`) + `pdf-lib` landscape slide renderer.
- **Features**: Widescreen 16:9 and Standard 4:3 slide geometry, typography hierarchy, slide numbers.

### D. EXCEL to PDF (`excel-to-pdf.js`)
- **Engine**: CSV/Spreadsheet parser + `pdf-lib` table renderer.
- **Features**: Automatic cell width calculation, table gridlines, landscape multi-column presentation.

### E. HTML to PDF (`html-to-pdf.js`)
- **Engine**: DOMParser + `pdf-lib` vector typesetting.
- **Features**: Renders headings (`H1`-`H6`), paragraphs, and formatted text blocks with automatic page overflow handling.

---

## 6. Convert from PDF Suite

### A. PDF to JPG (`pdf-to-jpg.js`)
- **Engine**: `pdfjs-dist` Canvas rendering + `JSZip`.
- **Features**: 72 DPI, 150 DPI, 300 DPI resolution presets; JPG or PNG output; single ZIP packaging for multi-page documents.

### B. PDF to WORD (`pdf-to-docx.js` & `pdf-to-docx-engine.js`)
- **Engine**: `pdfjs-dist` text item coordinate extraction + `docx` OpenXML serialization.
- **Features**: Flowable editable paragraphs, heading auto-detection, layout preservation.

### C. PDF to POWERPOINT (`pdf-to-powerpoint.js`)
- **Engine**: `pdfjs-dist` high-res page rendering + `JSZip` OpenXML `.pptx` assembly.
- **Features**: Generates valid Microsoft PowerPoint `.pptx` presentation decks with slide relationships.

### D. PDF to EXCEL (`pdf-to-excel.js`)
- **Engine**: `pdfjs-dist` bounding box coordinate extraction + geometric row/column grouping.
- **Features**: Groups items by Y-tolerance into rows and X-distance into columns; outputs UTF-8 BOM CSV.

### E. PDF to PDF/A (`pdf-to-pdfa.js`)
- **Engine**: `pdf-lib` metadata flate streams.
- **Features**: ISO 19005-1 (PDF/A-1b) conformance; DeviceRGB color profile definitions; XMP metadata schema embedding.

---

## 7. Security & Password Detection (`pdf-magic.js`)

- **File**: [`client/src/utils/pdf-magic.js`](file:///d:/ILoveMyOfficeWorks/client/src/utils/pdf-magic.js)
- Inspects uploaded files using header bytes (`%PDF-`) and attempts a fast partial load.
- Detects whether a PDF has owner or user passwords (`isEncrypted`).
- Handles images (JPG, PNG, WebP) and Office documents (.docx, .pptx, .xlsx, .html).
- Rejects corrupt or invalid binaries before they enter the processing pipeline.

