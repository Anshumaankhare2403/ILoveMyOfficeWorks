import mergePdfAdapter from './adapters/merge-pdf';
import splitPdfAdapter from './adapters/split-pdf';
import compressPdfAdapter from './adapters/compress-pdf';
import pdfToDocxAdapter from './adapters/pdf-to-docx';

/**
 * Adapter Registry
 * All operations are registered here. Adding a new tool only requires
 * implementing the adapter module and appending it to this list.
 */
export const ADAPTER_REGISTRY = [
  mergePdfAdapter,
  splitPdfAdapter,
  compressPdfAdapter,
  pdfToDocxAdapter,
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
