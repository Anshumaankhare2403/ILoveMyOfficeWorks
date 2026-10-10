// 1. Organize PDF
import mergePdfAdapter from './adapters/merge-pdf.js';
import splitPdfAdapter from './adapters/split-pdf.js';
import removePagesAdapter from './adapters/remove-pages.js';
import extractPagesAdapter from './adapters/extract-pages.js';
import organizePdfAdapter from './adapters/organize-pdf.js';
import scanToPdfAdapter from './adapters/scan-to-pdf.js';

// 2. Optimize PDF
import compressPdfAdapter from './adapters/compress-pdf.js';
import repairPdfAdapter from './adapters/repair-pdf.js';
import ocrPdfAdapter from './adapters/ocr-pdf.js';

// 3. Convert to PDF
import jpgToPdfAdapter from './adapters/jpg-to-pdf.js';
import wordToPdfAdapter from './adapters/word-to-pdf.js';
import powerpointToPdfAdapter from './adapters/powerpoint-to-pdf.js';
import excelToPdfAdapter from './adapters/excel-to-pdf.js';
import htmlToPdfAdapter from './adapters/html-to-pdf.js';

// 4. Convert from PDF
import pdfToJpgAdapter from './adapters/pdf-to-jpg.js';
import pdfToDocxAdapter from './adapters/pdf-to-docx.js';
import pdfToPowerpointAdapter from './adapters/pdf-to-powerpoint.js';
import pdfToExcelAdapter from './adapters/pdf-to-excel.js';
import pdfToPdfaAdapter from './adapters/pdf-to-pdfa.js';

// 5. Edit PDF
import rotatePdfAdapter from './adapters/rotate-pdf.js';
import addPageNumbersAdapter from './adapters/add-page-numbers.js';
import addWatermarkAdapter from './adapters/add-watermark.js';
import cropPdfAdapter from './adapters/crop-pdf.js';
import editPdfAdapter from './adapters/edit-pdf.js';
import pdfFormsAdapter from './adapters/pdf-forms.js';

// 6. PDF Security
import unlockPdfAdapter from './adapters/unlock-pdf.js';
import protectPdfAdapter from './adapters/protect-pdf.js';
import signPdfAdapter from './adapters/sign-pdf.js';
import redactPdfAdapter from './adapters/redact-pdf.js';
import comparePdfAdapter from './adapters/compare-pdf.js';

// 7. Image Tools
import mergeImagesAdapter from './adapters/merge-images.js';
import compressImageAdapter from './adapters/compress-image.js';
import resizeImageAdapter from './adapters/resize-image.js';
import cropImageAdapter from './adapters/crop-image.js';
import convertToJpgAdapter from './adapters/convert-to-jpg.js';

/**
 * Adapter Registry
 * All operations are registered here. Adding a new tool only requires
 * implementing the adapter module and appending it to this list.
 */
export const ADAPTER_REGISTRY = [
  // 1. Organize PDF
  mergePdfAdapter,
  splitPdfAdapter,
  removePagesAdapter,
  extractPagesAdapter,
  organizePdfAdapter,
  scanToPdfAdapter,

  // 2. Optimize PDF
  compressPdfAdapter,
  repairPdfAdapter,
  ocrPdfAdapter,

  // 3. Convert to PDF
  jpgToPdfAdapter,
  wordToPdfAdapter,
  powerpointToPdfAdapter,
  excelToPdfAdapter,
  htmlToPdfAdapter,

  // 4. Convert from PDF
  pdfToJpgAdapter,
  pdfToDocxAdapter,
  pdfToPowerpointAdapter,
  pdfToExcelAdapter,
  pdfToPdfaAdapter,

  // 5. Edit PDF
  rotatePdfAdapter,
  addPageNumbersAdapter,
  addWatermarkAdapter,
  cropPdfAdapter,
  editPdfAdapter,
  pdfFormsAdapter,

  // 6. PDF Security
  unlockPdfAdapter,
  protectPdfAdapter,
  signPdfAdapter,
  redactPdfAdapter,
  comparePdfAdapter,

  // 7. Image Tools
  mergeImagesAdapter,
  compressImageAdapter,
  resizeImageAdapter,
  cropImageAdapter,
  convertToJpgAdapter,
];

/**
 * Returns all registered adapters with their validation status evaluated
 * against the currently loaded files.
 */
export function getRegisteredAdapters(files) {
  return ADAPTER_REGISTRY.map((adapter) => {
    const acceptance = adapter.accepts(files);
    return {
      ...adapter,
      isValid: acceptance.valid,
      validationReason: acceptance.reason || null,
    };
  });
}

/**
 * Find and execute an adapter by ID
 */
export async function executeAdapter(adapterId, files, options = {}, onProgress = () => {}) {
  const adapter = ADAPTER_REGISTRY.find((a) => a.id === adapterId);
  if (!adapter) {
    throw new Error(`Tool adapter with id "${adapterId}" not found in registry.`);
  }

  const acceptance = adapter.accepts(files);
  if (!acceptance.valid) {
    throw new Error(acceptance.reason || 'This tool cannot be executed with the selected files.');
  }

  return await adapter.execute(files, options, onProgress);
}
