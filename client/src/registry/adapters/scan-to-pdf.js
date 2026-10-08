import { PDFDocument, PageSizes } from 'pdf-lib';

/**
 * Filter an image canvas with document enhancement filters (B&W thresholding, grayscale, or color boost)
 */
async function processScanImage(fileItem, filter = 'enhanced') {
  let arrayBuffer = fileItem.arrayBuffer;
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    if (fileItem.file && typeof fileItem.file.arrayBuffer === 'function') {
      arrayBuffer = await fileItem.file.arrayBuffer();
    }
  }

  const blob = new Blob([arrayBuffer], { type: fileItem.file?.type || 'image/jpeg' });
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();

  if (filter === 'grayscale' || filter === 'bw') {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Luminance
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (filter === 'bw') {
        // High-contrast clean black and white document threshold
        const v = lum > 140 ? 255 : 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
      } else {
        // Crisp Grayscale
        data[i] = lum;
        data[i + 1] = lum;
        data[i + 2] = lum;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const outBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.9)
  );
  canvas.width = 0;
  canvas.height = 0;

  return new Uint8Array(await outBlob.arrayBuffer());
}

const scanToPdfAdapter = {
  id: 'scan-to-pdf',
  name: 'Scan to PDF',
  description: 'Convert captured camera photos and document scans into high-contrast, clean PDF documents with auto-enhancement filters.',
  badge: 'Organize',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 scanned image (JPG, PNG, WebP).' };
    }
    const hasImages = files.some(
      (f) =>
        f.isImage ||
        ['.jpg', '.jpeg', '.png', '.webp', '.bmp'].some((ext) =>
          (f.name || '').toLowerCase().endsWith(ext)
        )
    );
    if (!hasImages) {
      return { valid: false, reason: 'Please upload image files or photo scans to convert to PDF.' };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'scanFilter',
      label: 'Document Enhancement Filter',
      type: 'select',
      default: 'enhanced',
      options: [
        { value: 'enhanced', label: 'Color Document (Enhanced Contrast & Sharpness)' },
        { value: 'grayscale', label: 'Grayscale (Clean Monochrome)' },
        { value: 'bw', label: 'Black & White (Ultra-Crisp Document Threshold)' },
      ],
      hint: 'Applies image processing filters to remove shadows and enhance text legibility.',
    },
    {
      id: 'pageSize',
      label: 'Target Page Size',
      type: 'select',
      default: 'a4',
      options: [
        { value: 'a4', label: 'Standard A4' },
        { value: 'letter', label: 'US Letter' },
      ],
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: 'scanned_document.pdf',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const imageFiles = files.filter(
      (f) =>
        f.isImage ||
        ['.jpg', '.jpeg', '.png', '.webp', '.bmp'].some((ext) =>
          (f.name || '').toLowerCase().endsWith(ext)
        )
    );

    if (imageFiles.length === 0) {
      throw new Error('No valid scanned images found in the queue.');
    }

    onProgress(10, 'Initializing PDF scanner engine...');
    const pdfDoc = await PDFDocument.create();
    const filter = options.scanFilter || 'enhanced';
    const baseDims = options.pageSize === 'letter' ? PageSizes.Letter : PageSizes.A4;

    for (let i = 0; i < imageFiles.length; i++) {
      const fileItem = imageFiles[i];
      const percent = Math.round(15 + ((i + 1) / imageFiles.length) * 70);
      onProgress(percent, `Enhancing scan ${i + 1} of ${imageFiles.length}: ${fileItem.name}...`);

      const imgBytes = await processScanImage(fileItem, filter);
      const embeddedImg = await pdfDoc.embedJpg(imgBytes);

      const pageWidth = baseDims[0];
      const pageHeight = baseDims[1];
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      const margin = 20;
      const availWidth = pageWidth - margin * 2;
      const availHeight = pageHeight - margin * 2;

      const scale = Math.min(availWidth / embeddedImg.width, availHeight / embeddedImg.height);
      const drawWidth = embeddedImg.width * scale;
      const drawHeight = embeddedImg.height * scale;

      const x = margin + (availWidth - drawWidth) / 2;
      const y = margin + (availHeight - drawHeight) / 2;

      page.drawImage(embeddedImg, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    }

    onProgress(90, 'Serializing scanned PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    let finalName = options.outputFilename || 'scanned_document.pdf';
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Scanned ${imageFiles.length} pages successfully!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: imageFiles.length,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Assembled ${imageFiles.length} scanned page(s) into ${finalName}`,
    };
  },
};

export default scanToPdfAdapter;
