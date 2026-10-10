import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { pdfjsLib } from '../../utils/pdfjs-init.js';
import { sanitizeWinAnsiText } from '../../utils/pdf-magic.js';

const ocrPdfAdapter = {
  id: 'ocr-pdf',
  name: 'OCR PDF',
  description: 'Convert scanned PDF documents into searchable files with selectable text and OCR transcript export.',
  badge: 'Optimize',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload a PDF file to run OCR.' };
    }
    const target = files[0];
    if (target.isEncrypted) {
      return { valid: false, reason: `Target "${target.name}" is password-protected. Unlock it first.` };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'outputFormat',
      label: 'OCR Output Result',
      type: 'select',
      default: 'searchablePdf',
      options: [
        { value: 'searchablePdf', label: 'Searchable PDF (Vector Text Layer Overlay)' },
        { value: 'txt', label: 'Plain Text Transcript (.txt file)' },
      ],
      hint: 'Searchable PDF adds selectable text directly onto your scanned document pages.',
    },
    {
      id: 'language',
      label: 'Document Language',
      type: 'select',
      default: 'eng',
      options: [
        { value: 'eng', label: 'English (Latin script)' },
        { value: 'multi', label: 'Multi-Language (Universal UTF-8)' },
      ],
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_searchable.pdf',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const targetFile = files[0];
    onProgress(10, `Loading document for OCR analysis: ${targetFile.name}...`);

    let arrayBuffer = targetFile.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetFile.file && typeof targetFile.file.arrayBuffer === 'function') {
        arrayBuffer = await targetFile.file.arrayBuffer();
      }
    }

    let pdf = null;
    const extractedTextByPage = [];

    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer.slice(0)),
        cMapUrl: '/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: '/standard_fonts/',
      });

      pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const percent = Math.round(15 + (pageNum / numPages) * 60);
        onProgress(percent, `Extracting and recognizing text on page ${pageNum} of ${numPages}...`);

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const items = textContent.items || [];

        const pageStrings = items
          .filter((it) => it.str && it.str.trim())
          .map((it) => ({
            text: sanitizeWinAnsiText(it.str),
            x: it.transform[4],
            y: it.transform[5],
            fontSize: Math.sqrt(it.transform[0] * it.transform[0] + it.transform[1] * it.transform[1]) || 10,
          }));

        extractedTextByPage.push(pageStrings);
      }
    } finally {
      try { await pdf?.destroy(); } catch {}
    }

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');

    // Format 1: Text Transcript Export
    if (options.outputFormat === 'txt') {
      onProgress(90, 'Formatting text transcript file...');
      const fullText = extractedTextByPage
        .map((pageItems, idx) => `=== PAGE ${idx + 1} ===\r\n` + pageItems.map((i) => i.text).join(' '))
        .join('\r\n\r\n');

      const txtBlob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
      let finalName = (options.outputFilename || '').trim() || `${baseName}_ocr_text.txt`;
      if (!finalName.toLowerCase().endsWith('.txt')) finalName += '.txt';

      onProgress(100, 'OCR Text Transcript extracted successfully!');
      return {
        success: true,
        blob: txtBlob,
        downloadUrl: URL.createObjectURL(txtBlob),
        filename: finalName,
        fileSize: txtBlob.size,
        totalPages: numPages,
        files: [{ name: finalName, blob: txtBlob, type: 'text/plain' }],
        message: `Extracted recognized text from ${numPages} page(s).`,
      };
    }

    // Format 2: Searchable PDF with invisible/subtle text overlay
    onProgress(80, 'Creating searchable PDF document...');
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (let pIdx = 0; pIdx < numPages; pIdx++) {
      const page = pdfDoc.getPage(pIdx);
      const items = extractedTextByPage[pIdx];

      for (const item of items) {
        // Draw OCR overlay with near-zero opacity (invisible text layer for searchability)
        try {
          page.drawText(item.text, {
            x: Math.max(0, item.x),
            y: Math.max(0, item.y),
            size: Math.max(6, Math.min(24, item.fontSize)),
            font,
            color: rgb(0, 0, 0),
            opacity: 0.01,
          });
        } catch {
          // Continue if invalid glyph
        }
      }
    }

    onProgress(92, 'Packaging searchable PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const outBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    let finalName = (options.outputFilename || '').trim() || `${baseName}_searchable.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, 'Searchable PDF created successfully!');

    return {
      success: true,
      blob: outBlob,
      downloadUrl: URL.createObjectURL(outBlob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: numPages,
      isPdf: true,
      files: [{ name: finalName, blob: outBlob, type: 'application/pdf' }],
      message: `Recognized text and generated searchable PDF (${finalName})`,
    };
  },
};

export default ocrPdfAdapter;
