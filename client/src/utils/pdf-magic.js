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

  const nameLower = (file.name || '').toLowerCase();
  const mime = (file.type || '').toLowerCase();

  // Check if image file
  const isImage =
    mime.startsWith('image/') ||
    ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif', '.svg'].some((ext) =>
      nameLower.endsWith(ext)
    );

  if (isImage) {
    const arrayBuffer = await file.arrayBuffer();
    let dimensions = null;
    try {
      if (typeof createImageBitmap === 'function') {
        const bitmap = await createImageBitmap(new Blob([arrayBuffer]));
        dimensions = { width: bitmap.width, height: bitmap.height };
        bitmap.close?.();
      }
    } catch {
      // Ignored if unsupported image format
    }

    return {
      file,
      name: file.name,
      size: file.size,
      formattedSize: formatFileSize(file.size),
      pageCount: 1,
      isImage: true,
      imageDimensions: dimensions,
      isEncrypted: false,
      error: null,
      arrayBuffer,
    };
  }

  // Check if Office / Document file (.docx, .xlsx, .pptx, .html, .txt)
  const isOfficeOrHtml = [
    '.docx',
    '.doc',
    '.xlsx',
    '.xls',
    '.pptx',
    '.ppt',
    '.html',
    '.htm',
    '.txt',
    '.csv',
  ].some((ext) => nameLower.endsWith(ext));

  if (isOfficeOrHtml) {
    const arrayBuffer = await file.arrayBuffer();
    return {
      file,
      name: file.name,
      size: file.size,
      formattedSize: formatFileSize(file.size),
      pageCount: 1,
      isOfficeDoc: true,
      isEncrypted: false,
      error: null,
      arrayBuffer,
    };
  }

  // Standard PDF Verification
  const isMagicPdf = await verifyPdfMagicBytes(file);
  if (!isMagicPdf) {
    throw new Error('Unsupported format: Please upload a PDF, image, or document file');
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
      isPdf: true,
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
        isPdf: true,
        isEncrypted: true,
        error: 'PDF is encrypted',
        arrayBuffer,
      };
    }

    throw new Error(`Failed to read PDF structure: ${err.message || 'Corrupt file'}`);
  }
}

