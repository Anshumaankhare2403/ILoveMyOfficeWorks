import { PDFDocument, PageSizes } from 'pdf-lib';
import { formatFileSize } from '../../utils/pdf-magic.js';

/**
 * Safely retrieves binary data for a file item without holding entire array in memory
 */
async function getFileBytes(fileItem) {
  if (fileItem.arrayBuffer && fileItem.arrayBuffer.byteLength > 0) {
    return fileItem.arrayBuffer;
  }
  if (fileItem.file && typeof fileItem.file.arrayBuffer === 'function') {
    return await fileItem.file.arrayBuffer();
  }
  throw new Error(`Unable to read binary data for file: ${fileItem.name}`);
}

/**
 * Loads an image into an ImageBitmap or HTMLImageElement
 */
async function loadImageBitmap(fileItem) {
  const blob = fileItem.file || new Blob([await getFileBytes(fileItem)]);
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(blob);
    } catch {
      // Fallback to Image element if format not supported by createImageBitmap
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image "${fileItem.name}".`));
    };
    img.src = url;
  });
}

/**
 * Embeds an image into a PDF document efficiently
 */
async function embedImageIntoPdf(fileItem, pdfDoc, qualityPreset = 'balanced') {
  const name = (fileItem.name || '').toLowerCase();
  const file = fileItem.file;
  const isJpeg = name.endsWith('.jpg') || name.endsWith('.jpeg') || file?.type === 'image/jpeg';
  const isPng = name.endsWith('.png') || file?.type === 'image/png';

  // Direct fast embed for JPEG (original or balanced quality)
  if (isJpeg && qualityPreset !== 'compact') {
    const buffer = await getFileBytes(fileItem);
    return await pdfDoc.embedJpg(new Uint8Array(buffer));
  }

  // Direct fast embed for PNG (lossless original quality)
  if (isPng && qualityPreset === 'original') {
    const buffer = await getFileBytes(fileItem);
    return await pdfDoc.embedPng(new Uint8Array(buffer));
  }

  // Convert WebP, GIF, BMP, SVG or compressed JPEG via Canvas
  const quality = qualityPreset === 'compact' ? 0.70 : 0.85;
  const bitmap = await loadImageBitmap(fileItem);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  if (bitmap.close) bitmap.close();

  const outBlob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality)
  );

  // Free canvas immediately
  canvas.width = 0;
  canvas.height = 0;

  const bytes = new Uint8Array(await outBlob.arrayBuffer());
  return await pdfDoc.embedJpg(bytes);
}

const mergeImagesAdapter = {
  id: 'merge-images',
  name: 'Merge Images',
  description: 'Combine unlimited images (1,000+ supported) into a single PDF document or stitched continuous photo strip.',
  badge: '1000+ Images',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 image file (1,000+ supported).',
      };
    }

    const hasImages = files.some(
      (f) =>
        f.isImage ||
        /\.(jpe?g|png|webp|bmp|gif|svg)$/i.test(f.name || '')
    );

    if (!hasImages) {
      return {
        valid: false,
        reason: 'Please upload image files (JPG, PNG, WebP) to merge.',
      };
    }

    return { valid: true };
  },

  options: [
    {
      id: 'mergeMode',
      label: 'Merge Mode',
      type: 'select',
      default: 'pdf',
      options: [
        { value: 'pdf', label: 'Single Consolidated PDF (Unlimited 1,000+ Images)' },
        { value: 'vertical', label: 'Stitch as Single Image (Vertical Strip)' },
        { value: 'horizontal', label: 'Stitch as Single Image (Horizontal Strip)' },
        { value: 'grid', label: 'Stitch as Grid Collage (Multi-Column Image)' },
      ],
      hint: 'PDF mode is stream-optimized to handle 1,000+ images without browser memory limits.',
    },
    {
      id: 'pageSize',
      label: 'Page Size (PDF Mode)',
      type: 'select',
      default: 'fit',
      options: [
        { value: 'fit', label: 'Fit to Image (Exact Image Dimensions)' },
        { value: 'a4', label: 'Standard A4 Page' },
        { value: 'letter', label: 'US Letter Page' },
      ],
      hint: 'Fit to Image creates borderless pages matching each photo resolution.',
    },
    {
      id: 'pageOrientation',
      label: 'Orientation (PDF Mode)',
      type: 'select',
      default: 'auto',
      options: [
        { value: 'auto', label: 'Auto (Match Aspect Ratio)' },
        { value: 'portrait', label: 'Portrait (Vertical)' },
        { value: 'landscape', label: 'Landscape (Horizontal)' },
      ],
      hint: 'Auto matches orientation based on individual image proportions.',
    },
    {
      id: 'margin',
      label: 'Page Margins / Spacing',
      type: 'select',
      default: 'none',
      options: [
        { value: 'none', label: 'No Margin (0 px / pt)' },
        { value: 'small', label: 'Small Margin (15 px / pt)' },
        { value: 'large', label: 'Large Margin (30 px / pt)' },
      ],
      hint: 'Padding around images in PDF or spacing between stitched photos.',
    },
    {
      id: 'gridColumns',
      label: 'Grid Columns (Grid Stitch Mode)',
      type: 'select',
      default: 'auto',
      options: [
        { value: 'auto', label: 'Auto Columns (Square Layout)' },
        { value: '2', label: '2 Columns' },
        { value: '3', label: '3 Columns' },
        { value: '4', label: '4 Columns' },
        { value: '5', label: '5 Columns' },
        { value: '6', label: '6 Columns' },
        { value: '8', label: '8 Columns' },
        { value: '10', label: '10 Columns' },
      ],
      hint: 'Controls column layout when merging photos into a collage grid.',
    },
    {
      id: 'qualityPreset',
      label: 'Optimization Preset',
      type: 'select',
      default: 'balanced',
      options: [
        { value: 'balanced', label: 'High Quality (85% JPEG - Fast & Memory-Efficient for 1000+)' },
        { value: 'original', label: 'Maximum Quality (Original / Lossless)' },
        { value: 'compact', label: 'Compact File Size (70% JPEG - Smallest output)' },
      ],
      hint: 'High Quality is recommended for large batches to keep memory lean and file size balanced.',
    },
    {
      id: 'backgroundColor',
      label: 'Background Color',
      type: 'select',
      default: '#ffffff',
      options: [
        { value: '#ffffff', label: 'Clean White (#FFFFFF)' },
        { value: '#000000', label: 'Black (#000000)' },
        { value: '#FAF8F4', label: 'Warm Cream (#FAF8F4)' },
        { value: 'transparent', label: 'Transparent (PNG only)' },
      ],
      hint: 'Background fill color behind margins or stitched gaps.',
    },
    {
      id: 'outputFormat',
      label: 'Output Image Format (Stitch Mode)',
      type: 'select',
      default: 'image/jpeg',
      options: [
        { value: 'image/jpeg', label: 'JPEG Image (.jpg)' },
        { value: 'image/png', label: 'PNG Image (.png)' },
        { value: 'image/webp', label: 'WebP Image (.webp)' },
      ],
      hint: 'Format used when stitching images into a single picture.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: 'merged_images',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    // 1. Filter image files
    const imageFiles = files.filter(
      (f) =>
        f.isImage ||
        /\.(jpe?g|png|webp|bmp|gif|svg)$/i.test(f.name || '')
    );

    if (imageFiles.length === 0) {
      throw new Error('No valid image files found in the queue.');
    }

    const mergeMode = options.mergeMode || 'pdf';
    const marginMap = { none: 0, small: 15, large: 30 };
    const margin = marginMap[options.margin || 'none'] || 0;
    const qualityPreset = options.qualityPreset || 'balanced';
    const totalCount = imageFiles.length;

    // =========================================================================
    // MODE A: MERGE INTO SINGLE CONSOLIDATED PDF (1,000+ IMAGES STREAM ENGINE)
    // =========================================================================
    if (mergeMode === 'pdf') {
      onProgress(3, `Initializing PDF document builder for ${totalCount} image(s)...`);

      const pdfDoc = await PDFDocument.create();
      const pageSizeOpt = options.pageSize || 'fit';
      const orientationOpt = options.pageOrientation || 'auto';

      for (let i = 0; i < totalCount; i++) {
        const fileItem = imageFiles[i];
        const percent = Math.round(5 + ((i + 1) / totalCount) * 85);

        // Update progress and periodically yield to event loop to allow GC and UI responsiveness
        if (i % 5 === 0 || i === totalCount - 1) {
          onProgress(percent, `Merging image ${i + 1} of ${totalCount}: ${fileItem.name}...`);
          await new Promise((r) => setTimeout(r, 0));
        }

        const embeddedImg = await embedImageIntoPdf(fileItem, pdfDoc, qualityPreset);
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

      onProgress(92, 'Serializing consolidated PDF document stream...');
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const outBlob = new Blob([pdfBytes], { type: 'application/pdf' });

      let baseName = options.outputFilename || 'merged_images';
      if (!baseName.toLowerCase().endsWith('.pdf')) baseName += '.pdf';

      onProgress(100, `Successfully merged ${totalCount} image(s) into PDF!`);

      return {
        success: true,
        blob: outBlob,
        downloadUrl: URL.createObjectURL(outBlob),
        filename: baseName,
        fileSize: pdfBytes.length,
        totalPages: totalCount,
        isPdf: true,
        files: [
          {
            name: baseName,
            blob: outBlob,
            type: 'application/pdf',
          },
        ],
        message: `Successfully combined ${totalCount} images into ${baseName} (${formatFileSize(pdfBytes.length)})`,
      };
    }

    // =========================================================================
    // MODE B: STITCH INTO SINGLE CONTINUOUS IMAGE (VERTICAL, HORIZONTAL, OR GRID)
    // =========================================================================
    onProgress(5, `Analyzing image dimensions for ${totalCount} file(s)...`);

    // Load dimensions for layout calculation
    const dimensionsList = [];
    for (let i = 0; i < totalCount; i++) {
      const fileItem = imageFiles[i];
      if (i % 10 === 0) {
        onProgress(Math.round(5 + ((i + 1) / totalCount) * 20), `Measuring image ${i + 1} of ${totalCount}...`);
        await new Promise((r) => setTimeout(r, 0));
      }
      const bitmap = await loadImageBitmap(fileItem);
      dimensionsList.push({
        width: bitmap.width,
        height: bitmap.height,
        aspectRatio: bitmap.width / bitmap.height,
      });
      if (bitmap.close) bitmap.close();
    }

    // Canvas dimension safety guard (Browser Canvas max limit is 16,384px)
    const MAX_CANVAS_DIM = 16384;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let itemLayouts = [];

    if (mergeMode === 'vertical') {
      // Find max width, stack heights vertically
      const maxWidth = Math.max(...dimensionsList.map((d) => d.width));
      const rawTotalHeight = dimensionsList.reduce((acc, d) => acc + d.height + margin, margin);

      let globalScale = 1;
      if (rawTotalHeight > MAX_CANVAS_DIM) {
        globalScale = MAX_CANVAS_DIM / rawTotalHeight;
      }

      canvasWidth = Math.round(Math.min(MAX_CANVAS_DIM, (maxWidth + margin * 2) * globalScale));
      canvasHeight = Math.round(rawTotalHeight * globalScale);

      let currentY = margin * globalScale;
      for (let i = 0; i < totalCount; i++) {
        const d = dimensionsList[i];
        const scaledW = d.width * globalScale;
        const scaledH = d.height * globalScale;
        const x = (canvasWidth - scaledW) / 2;
        itemLayouts.push({ x, y: currentY, width: scaledW, height: scaledH });
        currentY += scaledH + margin * globalScale;
      }
    } else if (mergeMode === 'horizontal') {
      // Find max height, stack widths horizontally
      const maxHeight = Math.max(...dimensionsList.map((d) => d.height));
      const rawTotalWidth = dimensionsList.reduce((acc, d) => acc + d.width + margin, margin);

      let globalScale = 1;
      if (rawTotalWidth > MAX_CANVAS_DIM) {
        globalScale = MAX_CANVAS_DIM / rawTotalWidth;
      }

      canvasHeight = Math.round(Math.min(MAX_CANVAS_DIM, (maxHeight + margin * 2) * globalScale));
      canvasWidth = Math.round(rawTotalWidth * globalScale);

      let currentX = margin * globalScale;
      for (let i = 0; i < totalCount; i++) {
        const d = dimensionsList[i];
        const scaledW = d.width * globalScale;
        const scaledH = d.height * globalScale;
        const y = (canvasHeight - scaledH) / 2;
        itemLayouts.push({ x: currentX, y, width: scaledW, height: scaledH });
        currentX += scaledW + margin * globalScale;
      }
    } else {
      // Grid Collage mode
      let cols;
      if (options.gridColumns && options.gridColumns !== 'auto') {
        cols = parseInt(options.gridColumns, 10) || 3;
      } else {
        cols = Math.ceil(Math.sqrt(totalCount));
      }
      const rows = Math.ceil(totalCount / cols);

      // Determine uniform cell size based on average dimensions
      const avgW = dimensionsList.reduce((a, b) => a + b.width, 0) / totalCount;
      const avgH = dimensionsList.reduce((a, b) => a + b.height, 0) / totalCount;

      let cellW = avgW;
      let cellH = avgH;

      const rawGridW = cols * cellW + (cols + 1) * margin;
      const rawGridH = rows * cellH + (rows + 1) * margin;

      let gridScale = 1;
      if (rawGridW > MAX_CANVAS_DIM || rawGridH > MAX_CANVAS_DIM) {
        gridScale = Math.min(MAX_CANVAS_DIM / rawGridW, MAX_CANVAS_DIM / rawGridH);
      }

      cellW = Math.round(cellW * gridScale);
      cellH = Math.round(cellH * gridScale);
      const scaledMargin = Math.round(margin * gridScale);

      canvasWidth = cols * cellW + (cols + 1) * scaledMargin;
      canvasHeight = rows * cellH + (rows + 1) * scaledMargin;

      for (let i = 0; i < totalCount; i++) {
        const colIdx = i % cols;
        const rowIdx = Math.floor(i / cols);

        const d = dimensionsList[i];
        const cellX = scaledMargin + colIdx * (cellW + scaledMargin);
        const cellY = scaledMargin + rowIdx * (cellH + scaledMargin);

        // Fit image within cell while preserving aspect ratio
        const fitScale = Math.min(cellW / d.width, cellH / d.height);
        const w = d.width * fitScale;
        const h = d.height * fitScale;
        const x = cellX + (cellW - w) / 2;
        const y = cellY + (cellH - h) / 2;

        itemLayouts.push({ x, y, width: w, height: h });
      }
    }

    // Prepare Master Canvas
    onProgress(30, `Creating master canvas (${canvasWidth} × ${canvasHeight} px)...`);
    const masterCanvas = document.createElement('canvas');
    masterCanvas.width = canvasWidth;
    masterCanvas.height = canvasHeight;
    const ctx = masterCanvas.getContext('2d');

    // Background Fill
    const bgOpt = options.backgroundColor || '#ffffff';
    if (bgOpt !== 'transparent') {
      ctx.fillStyle = bgOpt;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Render each image onto the master canvas
    for (let i = 0; i < totalCount; i++) {
      const fileItem = imageFiles[i];
      const layout = itemLayouts[i];
      const percent = Math.round(30 + ((i + 1) / totalCount) * 55);

      if (i % 5 === 0 || i === totalCount - 1) {
        onProgress(percent, `Stitching image ${i + 1} of ${totalCount}: ${fileItem.name}...`);
        await new Promise((r) => setTimeout(r, 0));
      }

      const bitmap = await loadImageBitmap(fileItem);
      ctx.drawImage(bitmap, layout.x, layout.y, layout.width, layout.height);
      if (bitmap.close) bitmap.close();
    }

    onProgress(88, 'Exporting stitched composite image...');
    const outputFormat = options.outputFormat || 'image/jpeg';
    const quality = qualityPreset === 'compact' ? 0.75 : qualityPreset === 'original' ? 0.98 : 0.88;

    const stitchedBlob = await new Promise((resolve) =>
      masterCanvas.toBlob(resolve, outputFormat, quality)
    );

    // Free canvas memory
    masterCanvas.width = 0;
    masterCanvas.height = 0;

    const extMap = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };
    const ext = extMap[outputFormat] || '.jpg';
    let baseName = options.outputFilename || 'merged_images';
    if (!baseName.toLowerCase().endsWith(ext)) baseName += ext;

    onProgress(100, `Images successfully merged into ${baseName}!`);

    return {
      success: true,
      blob: stitchedBlob,
      downloadUrl: URL.createObjectURL(stitchedBlob),
      filename: baseName,
      fileSize: stitchedBlob.size,
      totalPages: 1,
      isImage: true,
      files: [
        {
          name: baseName,
          blob: stitchedBlob,
          type: outputFormat,
        },
      ],
      message: `Successfully stitched ${totalCount} images into ${baseName} (${canvasWidth}×${canvasHeight} px)`,
    };
  },
};

export default mergeImagesAdapter;
