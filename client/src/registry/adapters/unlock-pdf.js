import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

const unlockPdfAdapter = {
  id: 'unlock-pdf',
  name: 'Unlock PDF',
  description: 'Remove password protection, unlock printing & copying permissions, and save an unrestricted PDF.',
  badge: 'Security',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload a PDF file to unlock.' };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'password',
      label: 'Document Password',
      type: 'text',
      default: '',
      placeholder: 'Enter current document password',
      hint: 'Provide the password used to open or restrict permissions on the PDF.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_unlocked.pdf',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const targetFile = files[0];
    onProgress(10, `Reading "${targetFile.name}"...`);

    let arrayBuffer = targetFile.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetFile.file && typeof targetFile.file.arrayBuffer === 'function') {
        arrayBuffer = await targetFile.file.arrayBuffer();
      }
    }

    const password = (options.password || '').trim();

    onProgress(30, 'Attempting decryption and permission stripping...');

    let unlockedPdfDoc;

    try {
      // First try pdfjs-dist with password
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer.slice(0)),
        password,
        cMapUrl: '/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: '/standard_fonts/',
      });

      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      unlockedPdfDoc = await PDFDocument.create();

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const percent = Math.round(30 + (pageNum / numPages) * 55);
        onProgress(percent, `Decrypting page ${pageNum} of ${numPages}...`);

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport }).promise;

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', 0.95)
        );
        canvas.width = 0;
        canvas.height = 0;

        const imgBytes = new Uint8Array(await blob.arrayBuffer());
        const embeddedImg = await unlockedPdfDoc.embedJpg(imgBytes);

        const nativeViewport = page.getViewport({ scale: 1.0 });
        const pdfPage = unlockedPdfDoc.addPage([nativeViewport.width, nativeViewport.height]);
        pdfPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: nativeViewport.width,
          height: nativeViewport.height,
        });
      }
    } catch (err) {
      throw new Error(`Failed to unlock document: ${err.message}. Please check if the password is correct.`);
    }

    onProgress(90, 'Packaging decrypted, unrestricted PDF...');
    const pdfBytes = await unlockedPdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_unlocked.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, 'PDF unlocked and decrypted successfully!');

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: unlockedPdfDoc.getPageCount(),
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Unlocked and saved ${unlockedPdfDoc.getPageCount()} pages without password restrictions.`,
    };
  },
};

export default unlockPdfAdapter;
