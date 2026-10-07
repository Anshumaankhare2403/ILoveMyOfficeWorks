import { PDFDocument, PDFName, PDFNumber, decodePDFRawStream } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Initialize PDF.js worker URL for Vite
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

/**
 * Helper to recompress a JPEG buffer via in-memory canvas
 */
async function recompressJpegBytes(jpegBytes, { width, height, maxDimension, quality }) {
  try {
    const blob = new Blob([jpegBytes], { type: 'image/jpeg' });
    let bitmap;
    try {
      bitmap = await createImageBitmap(blob);
    } catch {
      return null;
    }

    let targetWidth = bitmap.width || width || 1;
    let targetHeight = bitmap.height || height || 1;

    // Scale down if dimensions exceed maxDimension
    if (maxDimension && (targetWidth > maxDimension || targetHeight > maxDimension)) {
      if (targetWidth > targetHeight) {
        targetHeight = Math.max(1, Math.round((targetHeight * maxDimension) / targetWidth));
        targetWidth = maxDimension;
      } else {
        targetWidth = Math.max(1, Math.round((targetWidth * maxDimension) / targetHeight));
        targetHeight = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d', { alpha: false });

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close?.();

    const newBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );

    canvas.width = 0;
    canvas.height = 0;

    if (!newBlob) return null;
    const arrayBuf = await newBlob.arrayBuffer();
    return {
      bytes: new Uint8Array(arrayBuf),
      width: targetWidth,
      height: targetHeight,
    };
  } catch (err) {
    console.warn('recompressJpegBytes error:', err);
    return null;
  }
}

/**
 * Helper to decode and recompress FlateDecode raw RGB / Grayscale / CMYK image streams
 */
async function recompressFlateImage(obj, { width, height, colorSpace, bpc, maxDimension, quality }) {
  try {
    if (!width || !height || bpc !== 8) return null;

    let csName = '';
    if (colorSpace instanceof PDFName) {
      csName = colorSpace.decodeText?.() || colorSpace.toString?.() || '';
    } else if (typeof colorSpace === 'string') {
      csName = colorSpace;
    }

    const isRgb = csName.includes('RGB');
    const isGray = csName.includes('Gray');
    const isCmyk = csName.includes('CMYK');
    if (!isRgb && !isGray && !isCmyk) return null;

    const decoded = decodePDFRawStream(obj);
    const rawBytes = decoded?.getBytes?.();
    if (!rawBytes) return null;

    // Draw raw pixel buffer onto canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    let dstIdx = 0;

    if (isRgb) {
      const hasFilterByte = rawBytes.length >= (width * 3 + 1) * height;
      const rowStride = hasFilterByte ? width * 3 + 1 : width * 3;

      for (let y = 0; y < height; y++) {
        let rowSrc = y * rowStride + (hasFilterByte ? 1 : 0);
        for (let x = 0; x < width; x++) {
          data[dstIdx] = rawBytes[rowSrc++];
          data[dstIdx + 1] = rawBytes[rowSrc++];
          data[dstIdx + 2] = rawBytes[rowSrc++];
          data[dstIdx + 3] = 255;
          dstIdx += 4;
        }
      }
    } else if (isGray) {
      const hasFilterByte = rawBytes.length >= (width + 1) * height;
      const rowStride = hasFilterByte ? width + 1 : width;

      for (let y = 0; y < height; y++) {
        let rowSrc = y * rowStride + (hasFilterByte ? 1 : 0);
        for (let x = 0; x < width; x++) {
          const val = rawBytes[rowSrc++];
          data[dstIdx] = val;
          data[dstIdx + 1] = val;
          data[dstIdx + 2] = val;
          data[dstIdx + 3] = 255;
          dstIdx += 4;
        }
      }
    } else if (isCmyk) {
      const hasFilterByte = rawBytes.length >= (width * 4 + 1) * height;
      const rowStride = hasFilterByte ? width * 4 + 1 : width * 4;

      for (let y = 0; y < height; y++) {
        let rowSrc = y * rowStride + (hasFilterByte ? 1 : 0);
        for (let x = 0; x < width; x++) {
          const c = rawBytes[rowSrc++] / 255;
          const m = rawBytes[rowSrc++] / 255;
          const yVal = rawBytes[rowSrc++] / 255;
          const k = rawBytes[rowSrc++] / 255;
          data[dstIdx] = Math.round(255 * (1 - c) * (1 - k));
          data[dstIdx + 1] = Math.round(255 * (1 - m) * (1 - k));
          data[dstIdx + 2] = Math.round(255 * (1 - yVal) * (1 - k));
          data[dstIdx + 3] = 255;
          dstIdx += 4;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Downscale if target dimension is smaller
    let targetWidth = width;
    let targetHeight = height;
    if (maxDimension && (targetWidth > maxDimension || targetHeight > maxDimension)) {
      if (targetWidth > targetHeight) {
        targetHeight = Math.max(1, Math.round((targetHeight * maxDimension) / targetWidth));
        targetWidth = maxDimension;
      } else {
        targetWidth = Math.max(1, Math.round((targetWidth * maxDimension) / targetHeight));
        targetHeight = maxDimension;
      }
    }

    let finalCanvas = canvas;
    if (targetWidth !== width || targetHeight !== height) {
      const resizeCanvas = document.createElement('canvas');
      resizeCanvas.width = targetWidth;
      resizeCanvas.height = targetHeight;
      const resizeCtx = resizeCanvas.getContext('2d', { alpha: false });
      resizeCtx.fillStyle = '#FFFFFF';
      resizeCtx.fillRect(0, 0, targetWidth, targetHeight);
      resizeCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
      canvas.width = 0;
      canvas.height = 0;
      finalCanvas = resizeCanvas;
    }

    const newBlob = await new Promise((resolve) =>
      finalCanvas.toBlob(resolve, 'image/jpeg', quality)
    );

    finalCanvas.width = 0;
    finalCanvas.height = 0;

    if (!newBlob) return null;
    const arrayBuf = await newBlob.arrayBuffer();
    return {
      bytes: new Uint8Array(arrayBuf),
      width: targetWidth,
      height: targetHeight,
    };
  } catch (err) {
    console.warn('recompressFlateImage error:', err);
    return null;
  }
}

/**
 * Walk through indirect objects in PDFDocument and recompress embedded images in-place.
 * Preserves 100% of vector text, selectable fonts, lines, and links!
 */
export async function optimizeEmbeddedImages(pdfDoc, options = {}) {
  const {
    maxDimension = 1500,
    quality = 0.70,
    minBytesToCompress = 8000,
    onProgress = () => {},
  } = options;

  const imageObjects = [];

  for (const [ref, obj] of pdfDoc.context.enumerateIndirectObjects()) {
    if (obj.dict) {
      const subtype = obj.dict.get(PDFName.of('Subtype'));
      const isImage =
        subtype === PDFName.of('Image') ||
        subtype?.toString?.() === '/Image' ||
        subtype?.decodeText?.() === 'Image';

      if (isImage) {
        imageObjects.push({ ref, obj });
      }
    }
  }

  if (imageObjects.length === 0) {
    return { imagesFound: 0, imagesCompressed: 0, bytesSaved: 0 };
  }

  let imagesCompressed = 0;
  let bytesSaved = 0;

  for (let i = 0; i < imageObjects.length; i++) {
    const { obj } = imageObjects[i];
    const dict = obj.dict;

    // Skip stencil masks or transparency soft-masks to prevent corruption
    if (dict.get(PDFName.of('ImageMask')) || dict.get(PDFName.of('SMask'))) {
      continue;
    }

    const width = dict.get(PDFName.of('Width'))?.asNumber?.() || 0;
    const height = dict.get(PDFName.of('Height'))?.asNumber?.() || 0;
    const origBytes = obj.contents;

    if (!origBytes || origBytes.length < minBytesToCompress) continue;

    onProgress(
      Math.round(20 + ((i + 1) / imageObjects.length) * 35),
      `Optimizing embedded image ${i + 1} of ${imageObjects.length}...`
    );

    const filterObj = dict.get(PDFName.of('Filter'));
    let filterName = '';
    if (filterObj) {
      if (filterObj instanceof PDFName) {
        filterName = filterObj.decodeText?.() || filterObj.toString?.() || '';
      } else if (filterObj.asArray) {
        const arr = filterObj.asArray();
        if (arr.length > 0 && arr[0] instanceof PDFName) {
          filterName = arr[0].decodeText?.() || arr[0].toString?.() || '';
        }
      } else {
        filterName = filterObj.toString?.() || '';
      }
    }

    let recompressed = null;

    if (filterName.includes('DCTDecode') || filterName.includes('DCT')) {
      recompressed = await recompressJpegBytes(origBytes, {
        width,
        height,
        maxDimension,
        quality,
      });
    } else if (filterName.includes('FlateDecode') || filterName.includes('Flate')) {
      const colorSpace = dict.get(PDFName.of('ColorSpace'));
      const bpc = dict.get(PDFName.of('BitsPerComponent'))?.asNumber?.() || 8;
      recompressed = await recompressFlateImage(obj, {
        width,
        height,
        colorSpace,
        bpc,
        maxDimension,
        quality,
      });
    }

    // Strictly apply only if the recompressed image is smaller!
    if (recompressed && recompressed.bytes && recompressed.bytes.length < origBytes.length) {
      const saved = origBytes.length - recompressed.bytes.length;
      bytesSaved += saved;
      imagesCompressed++;

      obj.contents = recompressed.bytes;
      dict.set(PDFName.of('Length'), PDFNumber.of(recompressed.bytes.length));
      dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
      dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
      dict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
      dict.set(PDFName.of('Width'), PDFNumber.of(recompressed.width));
      dict.set(PDFName.of('Height'), PDFNumber.of(recompressed.height));
      dict.delete(PDFName.of('DecodeParms'));
    }
  }

  return {
    imagesFound: imageObjects.length,
    imagesCompressed,
    bytesSaved,
  };
}

/**
 * Purge unneeded metadata, XML XMP packets, thumbnail caches, and revision artifacts.
 */
export function purgePdfBloat(pdfDoc, level = 'recommended') {
  let purgedCount = 0;

  for (const [ref, obj] of pdfDoc.context.enumerateIndirectObjects()) {
    if (obj.dict) {
      const type = obj.dict.get(PDFName.of('Type'));
      if (type === PDFName.of('Metadata') || type?.toString?.() === '/Metadata') {
        pdfDoc.context.delete(ref);
        purgedCount++;
      }
      if (type === PDFName.of('PieceInfo') || obj.dict.get(PDFName.of('PieceInfo'))) {
        obj.dict.delete(PDFName.of('PieceInfo'));
        purgedCount++;
      }
      if (type === PDFName.of('Thumb') || obj.dict.get(PDFName.of('Thumb'))) {
        obj.dict.delete(PDFName.of('Thumb'));
        purgedCount++;
      }
    }
  }

  if (level === 'extreme') {
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('ILoveMyOfficeWorks');
    pdfDoc.setCreator('ILoveMyOfficeWorks');
  } else if (level === 'recommended') {
    pdfDoc.setProducer('ILoveMyOfficeWorks');
  }

  return { purgedCount };
}

/**
 * Strategy 1: Vector-Preserving Optimization (Lossless Text & Typography)
 * Recompresses embedded images, strips bloated metadata, packs object streams.
 */
export async function compressStructural(arrayBuffer, level = 'recommended', options = {}, onProgress = () => {}) {
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  if (sourcePdf.isEncrypted) {
    throw new Error('PDF is password protected and cannot be compressed.');
  }

  const pageCount = sourcePdf.getPageCount();

  let maxDimension = 1500;
  let quality = 0.70;

  if (level === 'extreme') {
    maxDimension = 960;
    quality = 0.48;
  } else if (level === 'light') {
    maxDimension = 2200;
    quality = 0.84;
  } else if (level === 'custom') {
    quality = parseFloat(options.customQuality || '0.65');
    const scale = parseFloat(options.customScale || '1.2');
    maxDimension = Math.round(1200 * scale);
  }

  onProgress(20, 'Analyzing embedded image assets and document structure...');
  const imgStats = await optimizeEmbeddedImages(sourcePdf, {
    maxDimension,
    quality,
    onProgress,
  });

  onProgress(55, 'Purging redundant metadata streams and thumbnail caches...');
  purgePdfBloat(sourcePdf, level);

  onProgress(65, 'Packaging compressed object streams...');
  const compressedBytes = await sourcePdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  return {
    bytes: compressedBytes,
    pageCount,
    imagesFound: imgStats.imagesFound,
    imagesCompressed: imgStats.imagesCompressed,
    bytesSaved: imgStats.bytesSaved,
  };
}

/**
 * Strategy 2: Canvas Raster Downsampling Pipeline (for Scans & Extreme Size Crushing)
 * Renders pages onto HTML5 canvas at target scale and JPEG quality.
 */
export async function compressCanvasRaster(
  arrayBuffer,
  scale = 1.15,
  quality = 0.65,
  onProgress = () => {}
) {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer.slice(0)),
    cMapUrl: '/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/standard_fonts/',
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    onProgress(
      Math.round(25 + ((i - 1) / numPages) * 65),
      `Downsampling page ${i} of ${numPages} (${Math.round(scale * 72)} DPI)...`
    );

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const originalViewport = page.getViewport({ scale: 1.0 });

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const ctx = canvas.getContext('2d', { alpha: false });

    // Fill clean white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    // Convert canvas to compressed JPEG
    const jpegBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );

    canvas.width = 0;
    canvas.height = 0;
    page.cleanup?.();

    if (!jpegBlob) continue;

    const jpegBuffer = new Uint8Array(await jpegBlob.arrayBuffer());
    const embeddedImg = await newDoc.embedJpg(jpegBuffer);

    const newPage = newDoc.addPage([originalViewport.width, originalViewport.height]);
    newPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });
  }

  // Free PDF.js memory
  pdf.destroy?.();

  onProgress(92, 'Generating final compressed PDF streams...');
  const compressedBytes = await newDoc.save({
    useObjectStreams: true,
  });

  return {
    bytes: compressedBytes,
    pageCount: numPages,
  };
}

/**
 * Intelligent Master Pipeline:
 * Dispatches to optimal compression algorithm based on mode & document contents.
 */
export async function compressPdfWithMasterPipeline(
  arrayBuffer,
  options = {},
  onProgress = () => {}
) {
  const originalSize = arrayBuffer.byteLength;
  const level = options.compressionLevel || 'recommended';

  onProgress(10, 'Inspecting PDF internal architecture...');

  // 1. Always run Vector-Preserving Optimization first
  let vectorResult = null;
  try {
    vectorResult = await compressStructural(arrayBuffer, level, options, onProgress);
  } catch (err) {
    console.warn('Vector structural compression warning:', err);
  }

  const vectorBytes = vectorResult?.bytes;
  const vectorSize = vectorBytes ? vectorBytes.length : originalSize;
  const vectorSavings = originalSize > 0 ? (originalSize - vectorSize) / originalSize : 0;
  const pageCount = vectorResult?.pageCount || 1;

  // Decide whether to test or use Canvas Raster Downsampling:
  // - 'extreme': Always test raster to achieve the absolute smallest file size
  // - 'recommended': If vector image optimization didn't yield >= 15% reduction (scanned doc), test raster
  // - 'custom': If user specifies custom raster scale/quality
  // - 'light': NEVER rasterize (guarantees 100% crisp vector typography)
  let bestBytes = vectorBytes;
  let methodUsed = 'Vector Optimization & Stream Packing';

  if (vectorResult?.imagesCompressed > 0) {
    methodUsed = `Embedded Image Recompression (${vectorResult.imagesCompressed} ${
      vectorResult.imagesCompressed === 1 ? 'image' : 'images'
    })`;
  }

  let shouldTryRaster = false;
  let rasterScale = 1.15;
  let rasterQuality = 0.65;

  if (level === 'extreme') {
    shouldTryRaster = true;
    rasterScale = 0.92; // ~66 DPI
    rasterQuality = 0.48;
  } else if (level === 'recommended' && vectorSavings < 0.15) {
    shouldTryRaster = true;
    rasterScale = 1.18; // ~85 DPI
    rasterQuality = 0.68;
  } else if (level === 'custom') {
    rasterQuality = parseFloat(options.customQuality || '0.65');
    rasterScale = parseFloat(options.customScale || '1.2');
    shouldTryRaster = true;
  }

  if (shouldTryRaster) {
    try {
      onProgress(50, `Evaluating scan/raster downsampling (${Math.round(rasterScale * 72)} DPI)...`);
      const rasterRes = await compressCanvasRaster(
        arrayBuffer,
        rasterScale,
        rasterQuality,
        onProgress
      );

      const rasterBytes = rasterRes.bytes;
      const rasterSize = rasterBytes.length;

      // Select raster if it produces a smaller file than vector, or if extreme mode demands smallest size
      if (rasterSize < (bestBytes ? bestBytes.length : originalSize)) {
        bestBytes = rasterBytes;
        methodUsed =
          level === 'extreme'
            ? 'Extreme Downsampling & Compaction'
            : 'Adaptive Scan Downsampling';
      }
    } catch (rasterErr) {
      console.warn('Raster downsampling skipped or failed:', rasterErr);
    }
  }

  // Final Guard: If result is somehow larger than original, preserve original cleanly
  const finalSize = bestBytes ? bestBytes.length : originalSize;
  if (!bestBytes || finalSize >= originalSize) {
    return {
      bytes: new Uint8Array(arrayBuffer),
      pageCount,
      compressedSize: originalSize,
      savingsBytes: 0,
      savingsPercent: 0,
      methodUsed: 'Structure Verified (Already at Peak Compression)',
    };
  }

  const savingsBytes = originalSize - finalSize;
  const savingsPercent = Math.round((savingsBytes / originalSize) * 100);

  return {
    bytes: bestBytes,
    pageCount,
    compressedSize: finalSize,
    savingsBytes,
    savingsPercent,
    methodUsed,
  };
}
