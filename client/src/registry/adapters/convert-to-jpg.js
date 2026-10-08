import JSZip from 'jszip';
import { formatFileSize } from '../../utils/pdf-magic';

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

function canvasToBlob(canvas, mimeType = 'image/jpeg', quality = 0.92) {
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
  id: 'convert-to-jpg',
  name: 'Convert to JPG',
  description: 'Convert PNG, WebP, GIF, SVG, or BMP images into clean standard JPEG files.',
  badge: 'Convert',

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
        reason: 'Please upload images (PNG, WebP, GIF, SVG) to convert to JPG.',
      };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'quality',
      label: 'JPG Quality',
      type: 'select',
      default: '0.92',
      options: [
        { value: '0.95', label: 'Maximum (95% Quality)' },
        { value: '0.85', label: 'High (85% Quality - Balanced)' },
        { value: '0.75', label: 'Medium (75% Quality - Compact)' },
      ],
    },
    {
      id: 'background',
      label: 'Background Color (for transparency)',
      type: 'select',
      default: '#ffffff',
      options: [
        { value: '#ffffff', label: 'White (#ffffff)' },
        { value: '#000000', label: 'Black (#000000)' },
        { value: '#faf8f4', label: 'Warm Cream (#faf8f4)' },
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
    const jpgItems = [];
    const quality = parseFloat(options.quality) || 0.92;
    const bg = options.background || '#ffffff';

    for (let i = 0; i < imageFiles.length; i++) {
      const fileItem = imageFiles[i];
      const rawFile = fileItem.file || fileItem;
      const progressPercent = Math.round(15 + ((i + 1) / imageFiles.length) * 75);
      onProgress(progressPercent, `Converting image ${i + 1} of ${imageFiles.length} to JPG...`);

      const img = await loadImage(rawFile);
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // JPEG has no alpha channel, fill background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
      const baseName = (rawFile.name || 'image').replace(/\.[^/.]+$/, '');
      const outFilename = `${baseName}.jpg`;

      jpgItems.push({
        name: outFilename,
        blob,
      });
    }

    onProgress(95, 'Finalizing converted JPG files...');

    if (jpgItems.length === 1) {
      const item = jpgItems[0];
      return {
        success: true,
        blob: item.blob,
        filename: item.name,
        fileSize: item.blob.size,
        formattedSize: formatFileSize(item.blob.size),
        downloadUrl: URL.createObjectURL(item.blob),
        message: `Image converted to standard JPEG (${formatFileSize(item.blob.size)}).`,
      };
    }

    const zip = new JSZip();
    jpgItems.forEach((item) => {
      zip.file(item.name, item.blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return {
      success: true,
      blob: zipBlob,
      filename: 'converted_jpg_images.zip',
      fileSize: zipBlob.size,
      formattedSize: formatFileSize(zipBlob.size),
      downloadUrl: URL.createObjectURL(zipBlob),
      isZip: true,
      message: `${jpgItems.length} images converted to JPG and packaged into zip archive.`,
    };
  },
};
