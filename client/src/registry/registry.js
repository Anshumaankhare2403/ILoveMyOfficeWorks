// 1. Organize PDF
import mergePdfAdapter from './adapters/merge-pdf';
import splitPdfAdapter from './adapters/split-pdf';
import removePagesAdapter from './adapters/remove-pages';
import extractPagesAdapter from './adapters/extract-pages';
import organizePdfAdapter from './adapters/organize-pdf';
import scanToPdfAdapter from './adapters/scan-to-pdf';

// 2. Optimize PDF
import compressPdfAdapter from './adapters/compress-pdf';
import repairPdfAdapter from './adapters/repair-pdf';
import ocrPdfAdapter from './adapters/ocr-pdf';

// 3. Convert to PDF
import jpgToPdfAdapter from './adapters/jpg-to-pdf';
import wordToPdfAdapter from './adapters/word-to-pdf';
import powerpointToPdfAdapter from './adapters/powerpoint-to-pdf';
import excelToPdfAdapter from './adapters/excel-to-pdf';
import htmlToPdfAdapter from './adapters/html-to-pdf';

// 4. Convert from PDF
import pdfToJpgAdapter from './adapters/pdf-to-jpg';
import pdfToDocxAdapter from './adapters/pdf-to-docx';
import pdfToPowerpointAdapter from './adapters/pdf-to-powerpoint';
import pdfToExcelAdapter from './adapters/pdf-to-excel';
import pdfToPdfaAdapter from './adapters/pdf-to-pdfa';

// 5. Edit PDF
import rotatePdfAdapter from './adapters/rotate-pdf';
import addPageNumbersAdapter from './adapters/add-page-numbers';
import addWatermarkAdapter from './adapters/add-watermark';
import cropPdfAdapter from './adapters/crop-pdf';
import editPdfAdapter from './adapters/edit-pdf';
import pdfFormsAdapter from './adapters/pdf-forms';

// 6. PDF Security
import unlockPdfAdapter from './adapters/unlock-pdf';
import protectPdfAdapter from './adapters/protect-pdf';
import signPdfAdapter from './adapters/sign-pdf';
import redactPdfAdapter from './adapters/redact-pdf';
import comparePdfAdapter from './adapters/compare-pdf';

// 7. Image Tools
import compressImageAdapter from './adapters/compress-image';
import resizeImageAdapter from './adapters/resize-image';
import cropImageAdapter from './adapters/crop-image';
import convertToJpgAdapter from './adapters/convert-to-jpg';

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
