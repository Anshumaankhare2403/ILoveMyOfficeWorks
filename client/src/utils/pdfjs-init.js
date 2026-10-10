import * as pdfjsLib from 'pdfjs-dist';

// Polyfill Uint8Array.prototype.toHex for pdfjs-dist v6 across all browser and Node versions
if (typeof Uint8Array.prototype.toHex !== 'function') {
  Uint8Array.prototype.toHex = function () {
    return Array.from(this, (byte) => byte.toString(16).padStart(2, '0')).join('');
  };
}

// Configure worker safely for both Vite browser bundles and Node.js testing environments
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch {
    // Graceful fallback for non-browser or test runner
  }
}

export { pdfjsLib };
export default pdfjsLib;
