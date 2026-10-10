import JSZip from 'jszip';
import { formatFileSize } from '../../utils/pdf-magic.js';

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image "${file.name}": ${err?.message || 'Unsupported format'}`));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas export failed'));
        } else {
          resolve(blob);
        }
      },
      mimeType,
      quality
    );
  });
}

export default {
  id: 'compress-image',
  name: 'Compress Image',
  description: 'Shrink image file size with smart Canvas re-encoding and quality downsampling.',
  badge: 'Optimize',

  accepts(files) {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least one image file.' };
    }
    const hasImage = files.some(
      (f) => f.isImage || /\.(jpe?g|png|webp|bmp|gif|svg)$/i.test(f.name || '')
    );
    if (!hasImage) {
      return {
        valid: false,
        reason: 'Please upload JPG, PNG, or WebP images to compress.',
      };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'compressionLevel',
      label: 'Compression Tier',
      type: 'select',
      default: 'recommended',
      options: [
        { value: 'recommended', label: 'Balanced (Best quality-to-size, 70% quality)' },
        { value: 'extreme', label: 'Extreme (Smallest file size, 45% quality)' },
        { value: 'light', label: 'Light (Minimal compression, 85% quality)' },
        { value: 'custom', label: 'Custom quality & resolution' },
      ],
    },
    {
      id: 'customQuality',
      label: 'Custom Quality (0.1 to 0.95)',
      type: 'text',
      default: '0.65',
      showWhen: (opts) => opts.compressionLevel === 'custom',
    },
    {
      id: 'outputFormat',
      label: 'Output Format',
      type: 'select',
      default: 'original',
      options: [
        { value: 'original', label: 'Keep Original Format' },
        { value: 'jpeg', label: 'Convert to JPEG (.jpg)' },
        { value: 'webp', label: 'Convert to WebP (.webp - High Efficiency)' },
      ],
    },
    {
      id: 'maxDimension',
      label: 'Max Dimension (Scale Down)',
      type: 'select',
      default: 'original',
      options: [
        { value: 'original', label: 'Original Dimensions' },
        { value: '1920', label: 'Full HD (Max 1920px)' },
        { value: '1280', label: 'HD (Max 1280px)' },
        { value: '800', label: 'Web Thumbnail (Max 800px)' },
      ],
    },
  ],

  async execute(files, options = {}, onProgress = () => {}) {
    const imageFiles = files.filter(
      (f) => f.isImage || /\.(jpe?g|png|webp|bmp|gif|svg)$/i.test(f.name || '')
    );

    if (imageFiles.length === 0) {
      throw new Error('No valid image files found in queue.');
    }

    onProgress(10, `Preparing ${imageFiles.length} image(s)...`);

    let quality = 0.7;
    if (options.compressionLevel === 'extreme') quality = 0.45;
    else if (options.compressionLevel === 'light') quality = 0.85;
    else if (options.compressionLevel === 'custom') {
      const q = parseFloat(options.customQuality);
      if (!isNaN(q) && q > 0 && q <= 1) quality = q;
    }

    const compressedItems = [];
    const maxDim = options.maxDimension === 'original' ? 0 : parseInt(options.maxDimension, 10);

    for (let i = 0; i < imageFiles.length; i++) {
      const fileItem = imageFiles[i];
      const rawFile = fileItem.file || fileItem;
      const progressPercent = Math.round(15 + ((i + 1) / imageFiles.length) * 75);
      onProgress(progressPercent, `Compressing image ${i + 1} of ${imageFiles.length}...`);

      const img = await loadImage(rawFile);
      let { naturalWidth: width, naturalHeight: height } = img;

      if (maxDim > 0 && (width > maxDim || height > maxDim)) {
        if (width >= height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      let outMime = rawFile.type || 'image/jpeg';
      let ext = (rawFile.name || '').split('.').pop().toLowerCase();

      if (options.outputFormat === 'jpeg') {
        outMime = 'image/jpeg';
        ext = 'jpg';
      } else if (options.outputFormat === 'webp') {
        outMime = 'image/webp';
        ext = 'webp';
      }

      // If exporting to JPEG, fill white background for transparent pixels
      if (outMime === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);
      const blob = await canvasToBlob(canvas, outMime, quality);

      const baseName = (rawFile.name || 'image').replace(/\.[^/.]+$/, '');
      const outFilename = `${baseName}_compressed.${ext}`;

      compressedItems.push({
        name: outFilename,
        blob,
        originalSize: rawFile.size,
        compressedSize: blob.size,
      });
    }

    onProgress(95, 'Finalizing compressed files...');

    if (compressedItems.length === 1) {
      const item = compressedItems[0];
      const reduction = Math.max(
        0,
        Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100)
      );

      return {
        success: true,
        blob: item.blob,
        filename: item.name,
        fileSize: item.blob.size,
        formattedSize: formatFileSize(item.blob.size),
        downloadUrl: URL.createObjectURL(item.blob),
        reductionPercent: reduction,
        message: `Image compressed from ${formatFileSize(item.originalSize)} to ${formatFileSize(item.blob.size)} (${reduction}% reduction).`,
      };
    }

    // Multiple images: zip packaging
    const zip = new JSZip();
    let totalOriginal = 0;
    let totalCompressed = 0;

    compressedItems.forEach((item) => {
      zip.file(item.name, item.blob);
      totalOriginal += item.originalSize;
      totalCompressed += item.compressedSize;
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const totalReduction = Math.max(
      0,
      Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)
    );

    return {
      success: true,
      blob: zipBlob,
      filename: 'compressed_images.zip',
      fileSize: zipBlob.size,
      formattedSize: formatFileSize(zipBlob.size),
      downloadUrl: URL.createObjectURL(zipBlob),
      isZip: true,
      reductionPercent: totalReduction,
      message: `${compressedItems.length} images compressed from ${formatFileSize(totalOriginal)} to ${formatFileSize(totalCompressed)} (${totalReduction}% reduction).`,
    };
  },
};
