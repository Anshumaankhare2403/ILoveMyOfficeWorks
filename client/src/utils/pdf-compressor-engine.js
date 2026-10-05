import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Initialize PDF.js worker URL for Vite
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

/**
 * Strategy 1: Structural Stream Compression (Lossless)
 * Purges unreferenced objects, strips revision history, optimizes object streams.
 */
export async function compressStructural(arrayBuffer, level = 'recommended') {
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  if (sourcePdf.isEncrypted) {
    throw new Error('PDF is password protected and cannot be compressed.');
  }

  const optimizedDoc = await PDFDocument.create();
  const pageIndices = sourcePdf.getPageIndices();
  const copiedPages = await optimizedDoc.copyPages(sourcePdf, pageIndices);

  for (const page of copiedPages) {
    optimizedDoc.addPage(page);
  }

  if (level === 'extreme') {
    optimizedDoc.setTitle('');
    optimizedDoc.setAuthor('');
    optimizedDoc.setSubject('');
    optimizedDoc.setKeywords([]);
    optimizedDoc.setProducer('ILoveMyOfficeWorks');
    optimizedDoc.setCreator('ILoveMyOfficeWorks');
  }

  const compressedBytes = await optimizedDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  return {
    bytes: compressedBytes,
    pageCount: copiedPages.length,
  };
}

/**
 * Strategy 2: Canvas Raster Downsampling & Re-encoding
 * Renders pages onto HTML5 canvas at target scale and JPEG quality.
 * Shrinks scanned documents, photos, and high-DPI image assets by 50% - 85%.
 */
export async function compressCanvasRaster(
  arrayBuffer,
  scale = 1.3,
  quality = 0.72,
  onProgress = () => {}
) {
  // Load PDF with PDF.js
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/cmaps/',
    cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    onProgress(
      Math.round(20 + ((i - 1) / numPages) * 70),
      `Compressing & downsampling page ${i} of ${numPages}...`
    );

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    // Render page onto an in-memory canvas
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext('2d', { alpha: false });

    // Fill white background before rendering
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport,
    };

    await page.render(renderContext).promise;

    // Convert canvas to compressed JPEG blob
    const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
    const base64Data = jpegDataUrl.split(',')[1];
    const binaryStr = atob(base64Data);
    const len = binaryStr.length;
    const jpegBytes = new Uint8Array(len);
    for (let k = 0; k < len; k++) {
      jpegBytes[k] = binaryStr.charCodeAt(k);
    }

    // Embed in new PDF document with original point dimensions
    const embeddedImg = await newDoc.embedJpg(jpegBytes);
    const originalViewport = page.getViewport({ scale: 1.0 });

    const newPage = newDoc.addPage([originalViewport.width, originalViewport.height]);
    newPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });

    // Free canvas memory
    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress(92, 'Generating final compressed PDF streams...');

  const compressedBytes = await newDoc.save({
    useObjectStreams: true,
  });

  return {
    bytes: compressedBytes,
    pageCount: numPages,
  };
}
