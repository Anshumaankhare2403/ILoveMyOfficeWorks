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
    return {
      file,
      name: file.name,
      size: file.size,
      formattedSize: formatFileSize(file.size),
      pageCount: 1,
      isImage: true,
      imageDimensions: null,
      isEncrypted: false,
      error: null,
      arrayBuffer: null, // Lazy-loaded on demand during execution to support 1,000+ files safely
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

/**
 * Sanitize text strings before passing to pdf-lib standard fonts (Helvetica, TimesRoman, Courier)
 * Standard fonts strictly encode in Windows-1252 (WinAnsi). Characters outside this charset
 * (such as emojis, Asian scripts, non-WinAnsi symbols) will cause pdf-lib to throw an uncaught exception.
 * This sanitizer maps common symbols to safe equivalents and replaces unencodable characters with '?'.
 */
export function sanitizeWinAnsiText(text) {
  if (!text) return '';
  const str = String(text);

  // WinAnsi (Windows-1252) extension code points:
  const winAnsiExtended = new Set([
    0x20AC, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021, 0x02C6,
    0x2030, 0x0160, 0x2039, 0x0152, 0x017D, 0x2018, 0x2019, 0x201C,
    0x201D, 0x2022, 0x2013, 0x2014, 0x02DC, 0x2122, 0x0161, 0x203A,
    0x0153, 0x017E, 0x0178,
  ]);

  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Standard ASCII printable & whitespaces + Latin-1 Supplement (0xA0-0xFF)
    if (
      (code >= 32 && code <= 126) ||
      code === 10 ||
      code === 13 ||
      code === 9 ||
      (code >= 0xA0 && code <= 0xFF)
    ) {
      result += str[i];
    } else if (winAnsiExtended.has(code)) {
      result += str[i];
    } else {
      // If surrogate pair (e.g. 4-byte emoji), skip trailing surrogate
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < str.length) {
        i++;
      }
      result += '?';
    }
  }
  return result;
}
