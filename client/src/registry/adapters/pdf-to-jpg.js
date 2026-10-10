import { pdfjsLib } from '../../utils/pdfjs-init.js';
import JSZip from 'jszip';

const pdfToJpgAdapter = {
  id: 'pdf-to-jpg',
  name: 'PDF to JPG',
  description: 'Convert PDF pages into high-resolution JPG or PNG images and download as a ZIP archive or standalone images.',
  badge: 'Active',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 PDF document to extract images.',
      };
    }

    const targetFile = files[0];
    if (targetFile.isEncrypted) {
      return {
        valid: false,
        reason: `Cannot extract images from locked file "${targetFile.name}". Please unlock it first.`,
      };
    }

    return { valid: true };
  },

  options: [
    {
      id: 'format',
      label: 'Image Format',
      type: 'select',
      default: 'image/jpeg',
      options: [
        { value: 'image/jpeg', label: 'JPG (Smaller File Size, Standard Photo Quality)' },
        { value: 'image/png', label: 'PNG (Lossless Sharpness & Transparent Elements)' },
      ],
      hint: 'Choose JPG for documents and photos, or PNG for diagrams and sharp text.',
    },
    {
      id: 'resolution',
      label: 'Resolution & Quality',
      type: 'select',
      default: '150',
      options: [
        { value: '150', label: 'Standard Print & Sharing (150 DPI • Balanced)' },
        { value: '300', label: 'Ultra High Definition (300 DPI • Crisp Vector Details)' },
        { value: '72', label: 'Web & Mobile Thumbnails (72 DPI • Fast)' },
      ],
      hint: 'Higher DPI yields sharper text rendering at larger file sizes.',
    },
    {
      id: 'outputArchive',
      label: 'Packaging',
      type: 'select',
      default: 'zip',
      options: [
        { value: 'zip', label: 'ZIP Archive (All pages packaged into single zip)' },
        { value: 'individual', label: 'Separate Images (Download individual files)' },
      ],
      hint: 'Single page PDFs are always exported directly without zip compression.',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const targetItem = files[0];
    onProgress(5, `Loading PDF document: ${targetItem.name}...`);

    let arrayBuffer = targetItem.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetItem.file && typeof targetItem.file.arrayBuffer === 'function') {
        arrayBuffer = await targetItem.file.arrayBuffer();
      }
    }

    let pdf = null;
    const renderedImages = [];

    try {
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer.slice(0)),
        cMapUrl: '/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: '/standard_fonts/',
      });

      pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const percent = Math.round(10 + (pageNum / numPages) * 75);
        onProgress(percent, `Rendering page ${pageNum} of ${numPages} at ${dpi} DPI...`);

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d', { alpha: false });

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport,
          intent: 'print',
        }).promise;

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, format, 0.92)
        );

        canvas.width = 0;
        canvas.height = 0;

        renderedImages.push({
          name: `${baseName}_page_${String(pageNum).padStart(3, '0')}.${ext}`,
          blob,
        });
      }
    } finally {
      try { await pdf?.destroy(); } catch {}
    }

    onProgress(90, 'Packaging image output...');

    // If single page or user requested individual
    if (numPages === 1) {
      onProgress(100, 'Page rendered successfully!');
      const singleBlob = renderedImages[0].blob;
      const singleName = renderedImages[0].name;
      return {
        success: true,
        blob: singleBlob,
        downloadUrl: URL.createObjectURL(singleBlob),
        filename: singleName,
        fileSize: singleBlob.size,
        totalPages: 1,
        isImage: true,
        files: [
          {
            name: singleName,
            blob: singleBlob,
            type: format,
          },
        ],
        message: `Generated image from page 1 (${dpi} DPI)`,
      };
    }

    // Default: Package all into a zip archive with JSZip
    const zip = new JSZip();
    for (const img of renderedImages) {
      zip.file(img.name, img.blob);
    }

    const zipBlob = await zip.generateAsync(
      { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
      (metadata) => {
        onProgress(90 + Math.round(metadata.percent * 0.09), `Creating zip file: ${Math.round(metadata.percent)}%...`);
      }
    );

    const zipName = `${baseName}_images.zip`;
    onProgress(100, 'PDF pages converted to images successfully!');

    return {
      success: true,
      blob: zipBlob,
      downloadUrl: URL.createObjectURL(zipBlob),
      filename: zipName,
      fileSize: zipBlob.size,
      totalPages: numPages,
      isZip: true,
      files: [
        {
          name: zipName,
          blob: zipBlob,
          type: 'application/zip',
        },
      ],
      message: `Extracted ${numPages} pages into ${zipName}`,
    };
  },
};

export default pdfToJpgAdapter;
