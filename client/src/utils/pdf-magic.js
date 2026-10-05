import { PDFDocument } from 'pdf-lib';

export const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB limit

/**
 * Format bytes into human-readable string (KB, MB, GB)
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Check if a file is a valid PDF using MIME type and magic bytes (%PDF-)
 * Checks up to the first 1024 bytes to accommodate potential BOM or header shifts.
 */
export async function verifyPdfMagicBytes(file) {
  const sliceSize = Math.min(file.size, 1024);
  const buffer = await file.slice(0, sliceSize).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const text = new TextDecoder('latin1').decode(bytes);

  return text.includes('%PDF-');
}

/**
 * Validate and inspect a PDF file:
 * - Checks file size limit (200MB)
 * - Verifies PDF magic bytes
 * - Loads document with pdf-lib to get page count & detect encryption
 */
export async function inspectPdfFile(file) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large (max 200MB limit)');
  }

  const isMagicPdf = await verifyPdfMagicBytes(file);
  if (!isMagicPdf) {
    throw new Error('Invalid file type: Missing PDF signature (%PDF-)');
  }

  const arrayBuffer = await file.arrayBuffer();

  try {
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const isEncrypted = pdfDoc.isEncrypted;
    const pageCount = isEncrypted ? null : pdfDoc.getPageCount();

    return {
      file,
      name: file.name,
      size: file.size,
      formattedSize: formatFileSize(file.size),
      pageCount,
      isEncrypted,
      error: isEncrypted ? 'PDF is encrypted (password required)' : null,
      arrayBuffer,
    };
  } catch (err) {
    const msg = (err.message || '').toLowerCase();
    if (msg.includes('encrypt') || msg.includes('password')) {
      return {
        file,
        name: file.name,
        size: file.size,
        formattedSize: formatFileSize(file.size),
        pageCount: null,
        isEncrypted: true,
        error: 'PDF is encrypted',
        arrayBuffer,
      };
    }

    throw new Error(`Failed to read PDF structure: ${err.message || 'Corrupt file'}`);
  }
}
