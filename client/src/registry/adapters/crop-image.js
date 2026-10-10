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
  id: 'crop-image',
  name: 'Crop Image',
  description: 'Crop photos and images with preset aspect ratios or custom pixel bounding boxes.',
  badge: 'Crop',

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
        reason: 'Please upload JPG, PNG, or WebP images to crop.',
      };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'aspectRatio',
      label: 'Crop Aspect Ratio',
      type: 'select',
      default: '1:1',
      options: [
        { value: '1:1', label: '1:1 Square (Instagram / Profile)' },
        { value: '16:9', label: '16:9 Landscape (HD Video / Display)' },
        { value: '4:3', label: '4:3 Classic Photo' },
        { value: '9:16', label: '9:16 Portrait (Reels / TikTok / Stories)' },
        { value: '3:2', label: '3:2 Standard Photography' },
        { value: 'trim10', label: 'Trim 10% Margin Inset' },
      ],
    },
    {
      id: 'cropPosition',
      label: 'Crop Focus Position',
      type: 'select',
      default: 'center',
      options: [
        { value: 'center', label: 'Center Centered' },
        { value: 'top', label: 'Top / Head Focus' },
        { value: 'bottom', label: 'Bottom / Feet Focus' },
        { value: 'left', label: 'Left Side' },
        { value: 'right', label: 'Right Side' },
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
    const croppedItems = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const fileItem = imageFiles[i];
      const rawFile = fileItem.file || fileItem;
      const progressPercent = Math.round(15 + ((i + 1) / imageFiles.length) * 75);
      onProgress(progressPercent, `Cropping image ${i + 1} of ${imageFiles.length}...`);

      const img = await loadImage(rawFile);
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      let cropWidth = imgWidth;
      let cropHeight = imgHeight;
      let cropX = 0;
      let cropY = 0;

      if (options.aspectRatio === 'trim10') {
        cropWidth = Math.round(imgWidth * 0.9);
        cropHeight = Math.round(imgHeight * 0.9);
        cropX = Math.round((imgWidth - cropWidth) / 2);
        cropY = Math.round((imgHeight - cropHeight) / 2);
      } else {
        const [rw, rh] = (options.aspectRatio || '1:1').split(':').map(Number);
        const targetRatio = (rw || 1) / (rh || 1);
        const currentRatio = imgWidth / imgHeight;

        if (currentRatio > targetRatio) {
          // Current is wider than target: trim width
          cropHeight = imgHeight;
          cropWidth = Math.round(imgHeight * targetRatio);
          if (options.cropPosition === 'left') cropX = 0;
          else if (options.cropPosition === 'right') cropX = imgWidth - cropWidth;
          else cropX = Math.round((imgWidth - cropWidth) / 2);
          cropY = 0;
        } else {
          // Current is taller than target: trim height
          cropWidth = imgWidth;
          cropHeight = Math.round(imgWidth / targetRatio);
          cropX = 0;
          if (options.cropPosition === 'top') cropY = 0;
          else if (options.cropPosition === 'bottom') cropY = imgHeight - cropHeight;
          else cropY = Math.round((imgHeight - cropHeight) / 2);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, cropWidth);
      canvas.height = Math.max(1, cropHeight);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      let outMime = rawFile.type || 'image/png';
      let ext = (rawFile.name || '').split('.').pop().toLowerCase();

      if (options.format === 'jpeg') {
        outMime = 'image/jpeg';
        ext = 'jpg';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (options.format === 'png') {
        outMime = 'image/png';
        ext = 'png';
      } else if (options.format === 'webp') {
        outMime = 'image/webp';
        ext = 'webp';
      }

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const blob = await canvasToBlob(canvas, outMime, 0.92);
      const baseName = (rawFile.name || 'image').replace(/\.[^/.]+$/, '');
      const outFilename = `${baseName}_cropped.${ext}`;

      croppedItems.push({
        name: outFilename,
        blob,
        dimensions: `${canvas.width}x${canvas.height}`,
      });
    }

    onProgress(95, 'Finalizing cropped files...');

    if (croppedItems.length === 1) {
      const item = croppedItems[0];
      return {
        success: true,
        blob: item.blob,
        filename: item.name,
        fileSize: item.blob.size,
        formattedSize: formatFileSize(item.blob.size),
        downloadUrl: URL.createObjectURL(item.blob),
        message: `Image cropped to ${item.dimensions} (${formatFileSize(item.blob.size)}).`,
      };
    }

    const zip = new JSZip();
    croppedItems.forEach((item) => {
      zip.file(item.name, item.blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return {
      success: true,
      blob: zipBlob,
      filename: 'cropped_images.zip',
      fileSize: zipBlob.size,
      formattedSize: formatFileSize(zipBlob.size),
      downloadUrl: URL.createObjectURL(zipBlob),
      isZip: true,
      message: `${croppedItems.length} images cropped and packaged into zip archive.`,
    };
  },
};
