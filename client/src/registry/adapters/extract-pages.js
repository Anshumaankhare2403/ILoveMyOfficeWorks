import { PDFDocument } from 'pdf-lib';

/**
 * Parses user input like "1, 3-5, 8" into ordered list of 0-indexed page numbers.
 */
function parsePageNumbers(input, totalPages) {
  if (!input || !input.trim()) return [];

  const indices = [];
  const parts = input.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let p = start; p <= end; p++) {
          if (!indices.includes(p - 1)) indices.push(p - 1);
        }
      }
    } else {
      const single = parseInt(part, 10);
      if (!isNaN(single) && single >= 1 && single <= totalPages) {
        if (!indices.includes(single - 1)) indices.push(single - 1);
      }
    }
  }

  return indices;
}

const extractPagesAdapter = {
  id: 'extract-pages',
  name: 'Extract Pages',
  description: 'Select specific pages or ranges from a PDF and extract them into a brand-new PDF.',
  badge: 'Organize',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 PDF file.' };
    }
    const target = files[0];
    if (target.isEncrypted) {
      return { valid: false, reason: `Target "${target.name}" is password-protected. Unlock it first.` };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'pagesToExtract',
      label: 'Pages to Extract',
      type: 'text',
      default: '1',
      placeholder: 'e.g. 1, 3-5, 8',
      hint: 'Specify page numbers or ranges separated by commas (e.g. 1, 3-5).',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. extracted_pages.pdf',
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

    const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const totalPages = sourcePdf.getPageCount();

    const pagesToExtract = parsePageNumbers(options.pagesToExtract || '1', totalPages);
    if (pagesToExtract.length === 0) {
      throw new Error(`Please specify valid pages between 1 and ${totalPages}.`);
    }

    onProgress(40, `Extracting ${pagesToExtract.length} pages...`);

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(sourcePdf, pagesToExtract);

    for (const page of copiedPages) {
      newPdf.addPage(page);
    }

    onProgress(85, 'Packaging extracted PDF...');
    const pdfBytes = await newPdf.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_extracted.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Extracted ${pagesToExtract.length} pages successfully!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: pagesToExtract.length,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Extracted ${pagesToExtract.length} pages into ${finalName}`,
    };
  },
};

export default extractPagesAdapter;
