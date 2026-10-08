import { PDFDocument, PageSizes } from 'pdf-lib';

/**
 * Convert any image buffer (JPG, PNG, WebP, GIF, BMP) into embeddable bytes
 */
async function getEmbeddableImageBytes(fileItem, quality = 0.9) {
  const name = (fileItem.name || '').toLowerCase();
  const file = fileItem.file;

  // Retrieve buffer safely
  let arrayBuffer = fileItem.arrayBuffer;
  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    if (file && typeof file.arrayBuffer === 'function') {
      arrayBuffer = await file.arrayBuffer();
    }
  }

  // If directly JPEG
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || file?.type === 'image/jpeg') {
    return {
      type: 'jpg',
      bytes: new Uint8Array(arrayBuffer),
    };
  }

  // If directly PNG
  if (name.endsWith('.png') || file?.type === 'image/png') {
    return {
      type: 'png',
      bytes: new Uint8Array(arrayBuffer),
    };
  }

  // For WebP, GIF, BMP or other formats, convert to high-res JPEG via Canvas
  const blob = new Blob([arrayBuffer], { type: file?.type || 'image/jpeg' });
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();

  const outBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality)
  );
  canvas.width = 0;
  canvas.height = 0;

  return {
    type: 'jpg',
    bytes: new Uint8Array(await outBlob.arrayBuffer()),
  };
}

const jpgToPdfAdapter = {
  id: 'jpg-to-pdf',
  name: 'JPG to PDF',
  description: 'Convert JPG, PNG, and WebP images into a single PDF document with custom page margins and orientation.',
  badge: 'Active',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 image file (JPG, PNG, WebP).',
      };
    }

    const hasImages = files.some(
      (f) =>
        f.isImage ||
        ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'].some((ext) =>
          (f.name || '').toLowerCase().endsWith(ext)
        )
    );

    if (!hasImages) {
      return {
        valid: false,
        reason: 'Please upload image files (JPG, PNG, WebP) to convert to PDF.',
      };
    }

    return { valid: true };
  },

  options: [
    {
      id: 'pageOrientation',
      label: 'Page Orientation',
      type: 'select',
      default: 'auto',
      options: [
        { value: 'auto', label: 'Auto (Match Image Aspect Ratio)' },
        { value: 'portrait', label: 'Portrait (Vertical)' },
        { value: 'landscape', label: 'Landscape (Horizontal)' },
      ],
      hint: 'Auto chooses portrait or landscape based on the dimensions of each image.',
    },
    {
      id: 'pageSize',
      label: 'Page Size',
      type: 'select',
      default: 'fit',
      options: [
        { value: 'fit', label: 'Fit to Image (Exact Image Dimensions)' },
        { value: 'a4', label: 'Standard A4 Page' },
        { value: 'letter', label: 'US Letter Page' },
      ],
      hint: 'Fit to Image creates borderless pages matching your image resolution.',
    },
    {
      id: 'margin',
      label: 'Page Margins',
      type: 'select',
      default: 'none',
      options: [
        { value: 'none', label: 'No Margin (Edge-to-Edge)' },
        { value: 'small', label: 'Small Margin (20 pt)' },
        { value: 'large', label: 'Large Margin (40 pt)' },
      ],
      hint: 'Adds white border padding around the converted images.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: 'converted_images.pdf',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    onProgress(5, 'Initializing PDF document builder...');

    // Filter image files
    const imageFiles = files.filter(
      (f) =>
        f.isImage ||
        ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'].some((ext) =>
          (f.name || '').toLowerCase().endsWith(ext)
        )
    );

    if (imageFiles.length === 0) {
      throw new Error('No valid image files found in the queue.');
    }

    const pdfDoc = await PDFDocument.create();
    const marginMap = { none: 0, small: 20, large: 40 };
    const margin = marginMap[options.margin || 'none'] || 0;
    const pageSizeOpt = options.pageSize || 'fit';
    const orientationOpt = options.pageOrientation || 'auto';

    for (let i = 0; i < imageFiles.length; i++) {
      const fileItem = imageFiles[i];
      const percent = Math.round(10 + ((i + 1) / imageFiles.length) * 75);
      onProgress(percent, `Processing image ${i + 1} of ${imageFiles.length}: ${fileItem.name}...`);

      const imgData = await getEmbeddableImageBytes(fileItem);
      let embeddedImg;

      if (imgData.type === 'jpg') {
        embeddedImg = await pdfDoc.embedJpg(imgData.bytes);
      } else {
        embeddedImg = await pdfDoc.embedPng(imgData.bytes);
      }

      const imgWidth = embeddedImg.width;
      const imgHeight = embeddedImg.height;

      let pageWidth, pageHeight;

      if (pageSizeOpt === 'fit') {
        pageWidth = imgWidth + margin * 2;
        pageHeight = imgHeight + margin * 2;
      } else {
        const baseDims = pageSizeOpt === 'letter' ? PageSizes.Letter : PageSizes.A4;
        const isLandscape =
          orientationOpt === 'landscape' ||
          (orientationOpt === 'auto' && imgWidth > imgHeight);

        pageWidth = isLandscape ? Math.max(baseDims[0], baseDims[1]) : Math.min(baseDims[0], baseDims[1]);
        pageHeight = isLandscape ? Math.min(baseDims[0], baseDims[1]) : Math.max(baseDims[0], baseDims[1]);
      }

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Calculate scaled dimensions to fit within available page area
      const availWidth = pageWidth - margin * 2;
      const availHeight = pageHeight - margin * 2;

      const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;

      // Center the image within the page
      const x = margin + (availWidth - drawWidth) / 2;
      const y = margin + (availHeight - drawHeight) / 2;

      page.drawImage(embeddedImg, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    }

    onProgress(90, 'Serializing PDF binary stream...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const outBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    let finalName = options.outputFilename || 'converted_images.pdf';
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, 'Images converted to PDF successfully!');

    return {
      success: true,
      blob: outBlob,
      downloadUrl: URL.createObjectURL(outBlob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: imageFiles.length,
      isPdf: true,
      files: [
        {
          name: finalName,
          blob: outBlob,
          type: 'application/pdf',
        },
      ],
      message: `Successfully combined ${imageFiles.length} image(s) into ${finalName}`,
    };
  },
};

export default jpgToPdfAdapter;
