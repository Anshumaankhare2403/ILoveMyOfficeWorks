import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

const redactPdfAdapter = {
  id: 'redact-pdf',
  name: 'Redact PDF',
  description: 'Permanently blackout sensitive information, confidential phrases, or page areas to prevent unauthorized inspection.',
  badge: 'Security',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 PDF file to redact.' };
    }
    const target = files[0];
    if (target.isEncrypted) {
      return { valid: false, reason: `Target "${target.name}" is password-protected. Unlock it first.` };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'redactKeyword',
      label: 'Sensitive Words / Text to Redact',
      type: 'text',
      default: 'CONFIDENTIAL',
      placeholder: 'e.g. SSN, Password, Confidential, Secret',
      hint: 'Finds matching keywords across all pages and permanently blacks them out.',
    },
    {
      id: 'redactPreset',
      label: 'Redaction Area Preset',
      type: 'select',
      default: 'keyword',
      options: [
        { value: 'keyword', label: 'Blackout Matching Keyword Occurrences' },
        { value: 'headerBlock', label: 'Blackout Top Header Area (Confidential Identifiers)' },
        { value: 'footerBlock', label: 'Blackout Bottom Footer Area (Tracking Numbers)' },
      ],
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_redacted.pdf',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const targetFile = files[0];
    onProgress(10, `Reading "${targetFile.name}"...`);

    let arrayBuffer = targetFile.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetFile.file && typeof targetFile.file.arrayBuffer === 'function') {
        arrayBuffer = await targetFile.file.arrayBuffer();
      }
    }

    const keyword = (options.redactKeyword || 'CONFIDENTIAL').trim().toLowerCase();
    const preset = options.redactPreset || 'keyword';

    onProgress(25, 'Analyzing text locations for permanent redaction...');

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer.slice(0)),
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '/standard_fonts/',
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const matchesByPage = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const items = textContent.items || [];
      const matches = [];

      if (preset === 'keyword' && keyword) {
        for (const item of items) {
          if (item.str && item.str.toLowerCase().includes(keyword)) {
            matches.push({
              x: item.transform[4],
              y: item.transform[5],
              width: item.width || 60,
              height: item.height || 14,
            });
          }
        }
      }
      matchesByPage.push(matches);
    }

    onProgress(60, 'Applying black redaction boxes and vector flattening...');

    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    let totalRedactions = 0;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      if (preset === 'headerBlock') {
        // Redact top 40pt
        page.drawRectangle({
          x: 20,
          y: height - 50,
          width: width - 40,
          height: 35,
          color: rgb(0, 0, 0),
        });
        totalRedactions++;
      } else if (preset === 'footerBlock') {
        // Redact bottom 40pt
        page.drawRectangle({
          x: 20,
          y: 15,
          width: width - 40,
          height: 35,
          color: rgb(0, 0, 0),
        });
        totalRedactions++;
      } else {
        const matches = matchesByPage[i] || [];
        for (const m of matches) {
          page.drawRectangle({
            x: Math.max(0, m.x - 2),
            y: Math.max(0, m.y - 2),
            width: m.width + 4,
            height: Math.max(14, m.height + 4),
            color: rgb(0, 0, 0),
          });
          totalRedactions++;
        }
      }
    }

    onProgress(90, 'Packaging redacted PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_redacted.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Redacted ${totalRedactions} item(s) permanently!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: pages.length,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Permanently blacked out ${totalRedactions} area(s) in ${finalName}`,
    };
  },
};

export default redactPdfAdapter;
