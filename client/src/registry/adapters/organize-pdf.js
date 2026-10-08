import { PDFDocument } from 'pdf-lib';

const organizePdfAdapter = {
  id: 'organize-pdf',
  name: 'Organize PDF',
  description: 'Reorder, reverse, rearrange, or duplicate pages in your PDF document into a custom sequence.',
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
      id: 'orderMode',
      label: 'Organization Mode',
      type: 'select',
      default: 'reverse',
      options: [
        { value: 'reverse', label: 'Reverse Page Order (Last page to First)' },
        { value: 'custom', label: 'Custom Sequence (e.g. 3, 1, 2, 4)' },
        { value: 'oddEven', label: 'Odd Pages then Even Pages' },
      ],
      hint: 'Select automated ordering or specify a custom sequence.',
    },
    {
      id: 'customOrder',
      label: 'Custom Page Sequence',
      type: 'text',
      default: '',
      placeholder: 'e.g. 2, 1, 3, 4',
      showWhen: (opts) => opts.orderMode === 'custom',
      hint: 'List target page numbers in the desired output order.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_organized.pdf',
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

    const mode = options.orderMode || 'reverse';
    let targetIndices = [];

    if (mode === 'reverse') {
      for (let i = totalPages - 1; i >= 0; i--) targetIndices.push(i);
    } else if (mode === 'oddEven') {
      // 1-indexed odd pages (0, 2, 4...)
      for (let i = 0; i < totalPages; i += 2) targetIndices.push(i);
      // 1-indexed even pages (1, 3, 5...)
      for (let i = 1; i < totalPages; i += 2) targetIndices.push(i);
    } else {
      // Custom
      const raw = (options.customOrder || '').split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n) && n >= 1 && n <= totalPages);
      if (raw.length === 0) {
        throw new Error(`Please specify valid page numbers between 1 and ${totalPages}.`);
      }
      targetIndices = raw.map((n) => n - 1);
    }

    onProgress(40, `Reorganizing into ${targetIndices.length} pages...`);

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(sourcePdf, targetIndices);
    for (const page of copiedPages) {
      newPdf.addPage(page);
    }

    onProgress(85, 'Packaging organized PDF...');
    const pdfBytes = await newPdf.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_organized.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, 'PDF organized successfully!');

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: targetIndices.length,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Reordered into ${targetIndices.length} pages.`,
    };
  },
};

export default organizePdfAdapter;
