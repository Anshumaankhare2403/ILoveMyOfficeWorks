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

function canvasToBlob(canvas, mimeType, quality = 0.92) {
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
  id: 'resize-image',
  name: 'Resize Image',
  description: 'Change image dimensions by percentage scale or exact pixel width and height.',
  badge: 'Resize',

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
        reason: 'Please upload JPG, PNG, or WebP images to resize.',
      };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'resizeMode',
      label: 'Resize Mode',
      type: 'select',
      default: 'percentage',
      options: [
        { value: 'percentage', label: 'By Percentage (%)' },
        { value: 'dimensions', label: 'By Exact Dimensions (Pixels)' },
      ],
    },
    {
      id: 'percentage',
      label: 'Scale Percentage',
      type: 'select',
      default: '50',
      showWhen: (opts) => opts.resizeMode === 'percentage',
      options: [
        { value: '75', label: '75% (25% Smaller)' },
        { value: '50', label: '50% (Half Dimensions)' },
        { value: '25', label: '25% (Quarter Dimensions)' },
        { value: '150', label: '150% (Larger)' },
        { value: '200', label: '200% (2x Upscale)' },
      ],
    },
    {
      id: 'targetWidth',
      label: 'Target Width (px)',
      type: 'number',
      default: '1280',
      showWhen: (opts) => opts.resizeMode === 'dimensions',
    },
    {
      id: 'targetHeight',
      label: 'Target Height (px)',
      type: 'number',
      default: '720',
      showWhen: (opts) => opts.resizeMode === 'dimensions',
    },
    {
      id: 'maintainAspect',
      label: 'Maintain Aspect Ratio',
      type: 'select',
      default: 'true',
      showWhen: (opts) => opts.resizeMode === 'dimensions',
      options: [
        { value: 'true', label: 'Yes (Fit within bounds without distortion)' },
        { value: 'false', label: 'No (Stretch to exact width and height)' },
      ],
    },
    {
      id: 'format',
      label: 'Output Format',
      type: 'select',
      default: 'original',
      options: [
        { value: 'original', label: 'Keep Original Format' },
        { value: 'jpeg', label: 'Convert to JPEG (.jpg)' },
        { value: 'png', label: 'Convert to PNG (.png)' },
        { value: 'webp', label: 'Convert to WebP (.webp)' },
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
    const resizedItems = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const fileItem = imageFiles[i];
      const rawFile = fileItem.file || fileItem;
      const progressPercent = Math.round(15 + ((i + 1) / imageFiles.length) * 75);
      onProgress(progressPercent, `Resizing image ${i + 1} of ${imageFiles.length}...`);

      const img = await loadImage(rawFile);
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      let newWidth = originalWidth;
      let newHeight = originalHeight;

      if (options.resizeMode === 'percentage') {
        const factor = (parseFloat(options.percentage) || 50) / 100;
        newWidth = Math.max(1, Math.round(originalWidth * factor));
        newHeight = Math.max(1, Math.round(originalHeight * factor));
      } else {
        const tWidth = parseInt(options.targetWidth, 10) || 1280;
        const tHeight = parseInt(options.targetHeight, 10) || 720;
        const keepAspect = options.maintainAspect !== 'false';

        if (keepAspect) {
          const ratio = Math.min(tWidth / originalWidth, tHeight / originalHeight);
          newWidth = Math.max(1, Math.round(originalWidth * ratio));
          newHeight = Math.max(1, Math.round(originalHeight * ratio));
        } else {
          newWidth = tWidth;
          newHeight = tHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      let outMime = rawFile.type || 'image/png';
      let ext = (rawFile.name || '').split('.').pop().toLowerCase();

      if (options.format === 'jpeg') {
        outMime = 'image/jpeg';
        ext = 'jpg';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, newWidth, newHeight);
      } else if (options.format === 'png') {
        outMime = 'image/png';
        ext = 'png';
      } else if (options.format === 'webp') {
        outMime = 'image/webp';
        ext = 'webp';
      }

      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const blob = await canvasToBlob(canvas, outMime, 0.92);

      const baseName = (rawFile.name || 'image').replace(/\.[^/.]+$/, '');
      const outFilename = `${baseName}_${newWidth}x${newHeight}.${ext}`;

      resizedItems.push({
        name: outFilename,
        blob,
        dimensions: `${newWidth}x${newHeight}`,
      });
    }

    onProgress(95, 'Finalizing resized files...');

    if (resizedItems.length === 1) {
      const item = resizedItems[0];
      return {
        success: true,
        blob: item.blob,
        filename: item.name,
        fileSize: item.blob.size,
        formattedSize: formatFileSize(item.blob.size),
        downloadUrl: URL.createObjectURL(item.blob),
        message: `Image successfully resized to ${item.dimensions} (${formatFileSize(item.blob.size)}).`,
      };
    }

    const zip = new JSZip();
    resizedItems.forEach((item) => {
      zip.file(item.name, item.blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return {
      success: true,
      blob: zipBlob,
      filename: 'resized_images.zip',
      fileSize: zipBlob.size,
      formattedSize: formatFileSize(zipBlob.size),
      downloadUrl: URL.createObjectURL(zipBlob),
      isZip: true,
      message: `${resizedItems.length} images resized and packaged into zip archive.`,
    };
  },
};
