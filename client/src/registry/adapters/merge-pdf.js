import { PDFDocument } from 'pdf-lib';

/**
 * Merge PDFs Adapter
 * Self-contained module conforming to the adapter registry pattern.
 */
const mergePdfAdapter = {
  id: 'merge-pdf',
  name: 'Merge PDFs',
  description: 'Combine multiple PDF documents into a single sequential file with unlimited files support.',
  badge: 'Phase 1',

  /**
   * Validation rule: Can accept 2 or more unencrypted PDF files (no upper limit).
   */
  accepts: (files) => {
    if (!files || files.length < 2) {
      return {
        valid: false,
        reason: 'Please upload at least 2 PDF files to merge.',
      };
    }

    const encryptedFiles = files.filter((f) => f.isEncrypted);
    if (encryptedFiles.length > 0) {
      return {
        valid: false,
        reason: `Cannot merge encrypted files (${encryptedFiles.map((f) => f.name).join(', ')}). Unlock them first.`,
      };
    }

    return { valid: true };
  },

  /**
   * Configurable options for the merge operation
   */
  options: [
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: 'merged-document.pdf',
      placeholder: 'e.g. quarterly_report_merged.pdf',
    },
  ],

  /**
   * Execution logic using pdf-lib
   * @param {Array} files Array of inspected file objects with arrayBuffer
   * @param {Object} options Options passed from the UI
   * @param {Function} onProgress Progress callback (percent 0 - 100)
   */
  execute: async (files, options = {}, onProgress = () => {}) => {
    if (!files || files.length < 2) {
      throw new Error('At least 2 PDF documents are required for merging.');
    }

    onProgress(5, 'Initializing merge container...');

    // Create a new target PDF document
    const mergedPdf = await PDFDocument.create();
    let totalMergedPages = 0;

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      const progressPercent = Math.round(10 + (i / files.length) * 80);
      onProgress(progressPercent, `Merging "${fileItem.name}" (${i + 1} of ${files.length})...`);

      // Load source PDF
      let sourcePdf;
      try {
        sourcePdf = await PDFDocument.load(fileItem.arrayBuffer, {
          ignoreEncryption: true,
        });
      } catch (err) {
        throw new Error(`Failed to read "${fileItem.name}": ${err.message}`);
      }

      if (sourcePdf.isEncrypted) {
        throw new Error(`Document "${fileItem.name}" is password-protected and cannot be merged.`);
      }

      // Copy all pages from current document into the merged document
      const pageIndices = sourcePdf.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices);

      for (const page of copiedPages) {
        mergedPdf.addPage(page);
        totalMergedPages++;
      }
    }

    onProgress(92, 'Generating final merged PDF file...');
    const mergedBytes = await mergedPdf.save();

    onProgress(100, 'Merge completed successfully!');

    let filename = options.outputFilename?.trim() || 'merged-document.pdf';
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf';
    }

    const blob = new Blob([mergedBytes], { type: 'application/pdf' });

    return {
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename,
      totalPages: totalMergedPages,
      fileSize: mergedBytes.length,
      fileCount: files.length,
    };
  },
};

export default mergePdfAdapter;
