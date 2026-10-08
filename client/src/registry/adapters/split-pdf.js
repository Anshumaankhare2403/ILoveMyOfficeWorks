import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

/**
 * Helper to parse human-readable page ranges into 0-indexed page indices.
 * e.g., "1-3, 5, 7-8" => [[0, 1, 2], [4], [6, 7]]
 */
function parsePageRanges(rangesStr, maxPages) {
  if (!rangesStr || !rangesStr.trim()) {
    // Default: every page as its own document
    const all = [];
    for (let i = 0; i < maxPages; i++) all.push([i]);
    return all;
  }

  const parts = rangesStr.split(',').map((p) => p.trim()).filter(Boolean);
  const groups = [];

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(maxPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        const group = [];
        for (let p = start; p <= end; p++) {
          group.push(p - 1);
        }
        if (group.length > 0) groups.push(group);
      }
    } else {
      const single = parseInt(part, 10);
      if (!isNaN(single) && single >= 1 && single <= maxPages) {
        groups.push([single - 1]);
      }
    }
  }

  return groups;
}

const splitPdfAdapter = {
  id: 'split-pdf',
  name: 'Split PDF',
  description: 'Extract specific page ranges or split a PDF into separate files every N pages.',
  badge: 'Phase 2',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 PDF file to split.',
      };
    }

    const targetFile = files[0];
    if (targetFile.isEncrypted) {
      return {
        valid: false,
        reason: `Target PDF "${targetFile.name}" is password-protected. Unlock it first.`,
      };
    }

    if (targetFile.pageCount !== null && targetFile.pageCount < 2) {
      return {
        valid: false,
        reason: `PDF has only 1 page. Splitting requires at least 2 pages.`,
      };
    }

    return { valid: true };
  },

  options: [
    {
      id: 'splitMode',
      label: 'Split Mode',
      type: 'select',
      default: 'range',
      options: [
        { value: 'range', label: 'Custom Page Ranges (e.g. 1-2, 3-5)' },
        { value: 'everyN', label: 'Fixed Chunks (every N pages)' },
      ],
    },
    {
      id: 'pageRanges',
      label: 'Page Ranges',
      type: 'text',
      default: '1-2',
      placeholder: 'e.g. 1-2, 3-4, 5',
      showWhen: (opts) => opts.splitMode === 'range',
    },
    {
      id: 'everyN',
      label: 'Pages Per Split',
      type: 'number',
      default: 1,
      min: 1,
      showWhen: (opts) => opts.splitMode === 'everyN',
    },
    {
      id: 'outputPrefix',
      label: 'Output File Prefix',
      type: 'text',
      default: 'split_part',
      placeholder: 'e.g. document_part',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    if (!files || files.length === 0) {
      throw new Error('No PDF file provided for splitting.');
    }

    const targetFile = files[0];
    onProgress(5, `Loading "${targetFile.name}"...`);

    let arrayBuffer = targetFile.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetFile.file && typeof targetFile.file.arrayBuffer === 'function') {
        arrayBuffer = await targetFile.file.arrayBuffer();
      }
    }

    const sourcePdf = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
    });

    if (sourcePdf.isEncrypted) {
      throw new Error(`PDF "${targetFile.name}" is password-protected and cannot be split.`);
    }

    const totalPages = sourcePdf.getPageCount();
    if (totalPages < 2) {
      throw new Error('This PDF only contains 1 page; splitting is not necessary.');
    }

    const splitMode = options.splitMode || 'range';
    const prefix = (options.outputPrefix || 'split_part').trim();

    let pageGroups = [];

    if (splitMode === 'range') {
      pageGroups = parsePageRanges(options.pageRanges, totalPages);
      if (pageGroups.length === 0) {
        throw new Error(`Invalid page range. Please specify pages between 1 and ${totalPages}.`);
      }
    } else {
      const n = Math.max(1, parseInt(options.everyN, 10) || 1);
      for (let i = 0; i < totalPages; i += n) {
        const chunk = [];
        for (let j = i; j < Math.min(i + n, totalPages); j++) {
          chunk.push(j);
        }
        pageGroups.push(chunk);
      }
    }

    onProgress(20, `Preparing ${pageGroups.length} split documents...`);

    const zip = new JSZip();
    const parts = [];

    for (let i = 0; i < pageGroups.length; i++) {
      const group = pageGroups[i];
      const progressPercent = Math.round(20 + ((i + 1) / pageGroups.length) * 65);
      onProgress(progressPercent, `Generating part ${i + 1} of ${pageGroups.length}...`);

      const partPdf = await PDFDocument.create();
      const copiedPages = await partPdf.copyPages(sourcePdf, group);
      for (const page of copiedPages) {
        partPdf.addPage(page);
      }

      const partBytes = await partPdf.save({ useObjectStreams: true });
      const partBlob = new Blob([partBytes], { type: 'application/pdf' });
      const partFilename = `${prefix}_${i + 1}_pages_${group[0] + 1}-${group[group.length - 1] + 1}.pdf`;

      zip.file(partFilename, partBytes);

      parts.push({
        filename: partFilename,
        blob: partBlob,
        downloadUrl: URL.createObjectURL(partBlob),
        pageCount: group.length,
        size: partBytes.length,
        pageRangeText: `Pages ${group[0] + 1} - ${group[group.length - 1] + 1}`,
      });
    }

    onProgress(90, 'Packaging split files...');

    let downloadUrl;
    let mainFilename;
    let mainBlob;

    if (parts.length === 1) {
      mainBlob = parts[0].blob;
      downloadUrl = parts[0].downloadUrl;
      mainFilename = parts[0].filename;
    } else {
      mainBlob = await zip.generateAsync({ type: 'blob' });
      downloadUrl = URL.createObjectURL(mainBlob);
      mainFilename = `${prefix}_all_parts.zip`;
    }

    onProgress(100, `Successfully split into ${parts.length} parts!`);

    return {
      success: true,
      blob: mainBlob,
      downloadUrl,
      filename: mainFilename,
      fileSize: mainBlob.size,
      parts,
      totalPages,
      totalParts: parts.length,
      isZip: parts.length > 1,
      sourceFileName: targetFile.name,
      files: parts.map((p) => ({
        name: p.filename,
        blob: p.blob,
        type: 'application/pdf',
      })),
    };
  },
};

export default splitPdfAdapter;
