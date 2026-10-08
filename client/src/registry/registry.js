import mergePdfAdapter from './adapters/merge-pdf';
import splitPdfAdapter from './adapters/split-pdf';
import compressPdfAdapter from './adapters/compress-pdf';
import pdfToDocxAdapter from './adapters/pdf-to-docx';
import jpgToPdfAdapter from './adapters/jpg-to-pdf';
import pdfToJpgAdapter from './adapters/pdf-to-jpg';
import pdfToExcelAdapter from './adapters/pdf-to-excel';
import pdfToPdfaAdapter from './adapters/pdf-to-pdfa';
import htmlToPdfAdapter from './adapters/html-to-pdf';
import wordToPdfAdapter from './adapters/word-to-pdf';
import excelToPdfAdapter from './adapters/excel-to-pdf';
import powerpointToPdfAdapter from './adapters/powerpoint-to-pdf';
import pdfToPowerpointAdapter from './adapters/pdf-to-powerpoint';

/**
 * Adapter Registry
 * All operations are registered here. Adding a new tool only requires
 * implementing the adapter module and appending it to this list.
 */
export const ADAPTER_REGISTRY = [
  // Core PDF Tools
  mergePdfAdapter,
  splitPdfAdapter,
  compressPdfAdapter,

  // Convert to PDF
  jpgToPdfAdapter,
  wordToPdfAdapter,
  powerpointToPdfAdapter,
  excelToPdfAdapter,
  htmlToPdfAdapter,

  // Convert from PDF
  pdfToJpgAdapter,
  pdfToDocxAdapter,
  pdfToPowerpointAdapter,
  pdfToExcelAdapter,
  pdfToPdfaAdapter,
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
