import { PDFDocument } from 'pdf-lib';

/**
 * Parses page numbers/ranges like "1, 3-5, 8" into 0-indexed page numbers to remove.
 */
function parsePageNumbers(input, totalPages) {
  if (!input || !input.trim()) return new Set();

  const toRemove = new Set();
  const parts = input.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let p = start; p <= end; p++) {
          toRemove.add(p - 1);
        }
      }
    } else {
      const single = parseInt(part, 10);
      if (!isNaN(single) && single >= 1 && single <= totalPages) {
        toRemove.add(single - 1);
      }
    }
  }

  return toRemove;
}

const removePagesAdapter = {
  id: 'remove-pages',
  name: 'Remove Pages',
  description: 'Delete unwanted or blank pages from your PDF document and download a clean file.',
  badge: 'Organize',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 PDF file.' };
    }
    const target = files[0];
    if (target.isEncrypted) {
      return { valid: false, reason: `Target "${target.name}" is password-protected. Unlock it first.` };
    }
    if (target.pageCount !== null && target.pageCount < 2) {
      return { valid: false, reason: 'This PDF has only 1 page. Removing pages requires at least 2 pages.' };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'pagesToRemove',
      label: 'Pages to Delete',
      type: 'text',
      default: '1',
      placeholder: 'e.g. 1, 3-4, 7',
      hint: 'Specify page numbers or ranges separated by commas (e.g. 1, 3-5).',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_cleaned.pdf',
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

    const pagesToRemove = parsePageNumbers(options.pagesToRemove || '1', totalPages);
    if (pagesToRemove.size === 0) {
      throw new Error('Please specify at least one valid page number to remove.');
    }
    if (pagesToRemove.size >= totalPages) {
      throw new Error(`Cannot delete all ${totalPages} pages. At least 1 page must remain.`);
    }

    onProgress(40, `Removing ${pagesToRemove.size} pages from document...`);

    const newPdf = await PDFDocument.create();
    const keptIndices = [];
    for (let i = 0; i < totalPages; i++) {
      if (!pagesToRemove.has(i)) {
        keptIndices.push(i);
      }
    }

    const copiedPages = await newPdf.copyPages(sourcePdf, keptIndices);
    for (const page of copiedPages) {
      newPdf.addPage(page);
    }

    onProgress(85, 'Packaging updated PDF...');
    const pdfBytes = await newPdf.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_cleaned.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Removed ${pagesToRemove.size} pages successfully!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: keptIndices.length,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Kept ${keptIndices.length} of ${totalPages} pages.`,
    };
  },
};

export default removePagesAdapter;
