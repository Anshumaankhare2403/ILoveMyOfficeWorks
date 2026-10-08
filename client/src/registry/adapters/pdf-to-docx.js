import { convertPdfToDocx } from '../../utils/pdf-to-docx-engine';

const pdfToDocxAdapter = {
  id: 'pdf-to-docx',
  name: 'PDF to Word (DOCX)',
  description: 'Convert PDF documents into fully editable Microsoft Word (.docx) files with typography, headings, and formatting.',
  badge: 'Active',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 PDF document to convert.',
      };
    }

    const targetFile = files[0];
    if (targetFile.isEncrypted) {
      return {
        valid: false,
        reason: `Cannot convert locked file "${targetFile.name}". Please unlock it first.`,
      };
    }

    return { valid: true };
  },

  options: [
    {
      id: 'conversionMode',
      label: 'Conversion Mode',
      type: 'select',
      default: 'flowable',
      options: [
        {
          value: 'flowable',
          label: 'Editable Flow (Standard Word Text, Headings & Lists)',
        },
        {
          value: 'scanned',
          label: 'Visual Pages (Embedded Page Layout Snapshots)',
        },
      ],
      hint: 'Flowable creates standard editable Word paragraphs and headings. Visual Pages embeds full-page layout snapshots (ideal for scans).',
    },
    {
      id: 'includePageBreaks',
      label: 'Preserve Page Breaks',
      type: 'select',
      default: 'true',
      options: [
        { value: 'true', label: 'Yes — Match Original PDF Page Breaks' },
        { value: 'false', label: 'No — Continuous Document Flow' },
      ],
      hint: 'Places page breaks to match the exact page boundaries of the original PDF.',
    },
    {
      id: 'detectHeadings',
      label: 'Heading Auto-Detection',
      type: 'select',
      default: 'true',
      options: [
        { value: 'true', label: 'Yes — Auto-Format Headings (H1, H2, H3)' },
        { value: 'false', label: 'No — Standard Paragraphs Only' },
      ],
      hint: 'Identifies title and section headings based on font size and weight.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_converted.docx',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    if (!files || files.length === 0) {
      throw new Error('No PDF file provided for conversion.');
    }

    const targetFile = files[0];

    // Intelligent default output filename
    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let filename = (options.outputFilename || '').trim();
    if (!filename || filename === 'merged-document.pdf' || filename.endsWith('.pdf')) {
      filename = `${baseName}.docx`;
    }
    if (!filename.toLowerCase().endsWith('.docx')) {
      filename += '.docx';
    }

    // Defensive buffer retrieval
    let arrayBuffer = targetFile.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetFile.file && targetFile.file.arrayBuffer) {
        arrayBuffer = await targetFile.file.arrayBuffer();
      }
    }

    onProgress(5, `Preparing "${targetFile.name}" for Word conversion...`);

    const result = await convertPdfToDocx(
      arrayBuffer,
      options,
      onProgress
    );

    return {
      success: true,
      blob: result.blob,
      downloadUrl: URL.createObjectURL(result.blob),
      filename,
      fileSize: result.fileSize,
      totalPages: result.totalPages,
      totalParagraphs: result.totalParagraphs,
      isDocx: true,
      engineUsed: 'In-Browser OpenXML Engine',
      files: [
        {
          name: filename,
          blob: result.blob,
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      ],
    };
  },
};

export default pdfToDocxAdapter;
