import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { sanitizeWinAnsiText } from '../../utils/pdf-magic.js';

const addWatermarkAdapter = {
  id: 'add-watermark',
  name: 'Add Watermark',
  description: 'Stamp custom text or security watermarks (e.g. CONFIDENTIAL, DRAFT) across PDF pages with rotation and opacity control.',
  badge: 'Edit',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 PDF file.' };
    }
    const target = files[0];
    if (target.isEncrypted) {
      return { valid: false, reason: `Target "${target.name}" is password-protected. Unlock it first.` };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'watermarkText',
      label: 'Watermark Text',
      type: 'text',
      default: 'CONFIDENTIAL',
      placeholder: 'e.g. CONFIDENTIAL, DRAFT, COPY',
    },
    {
      id: 'angle',
      label: 'Watermark Angle',
      type: 'select',
      default: '45',
      options: [
        { value: '45', label: 'Diagonal (45° • Standard Security)' },
        { value: '0', label: 'Horizontal (0°)' },
        { value: '90', label: 'Vertical (90°)' },
      ],
    },
    {
      id: 'opacity',
      label: 'Transparency / Opacity',
      type: 'select',
      default: '0.25',
      options: [
        { value: '0.15', label: 'Subtle (15% Opacity)' },
        { value: '0.25', label: 'Standard (25% Opacity • Balanced)' },
        { value: '0.45', label: 'Prominent (45% Opacity)' },
        { value: '0.70', label: 'Bold (70% Opacity)' },
      ],
    },
    {
      id: 'fontSize',
      label: 'Font Size',
      type: 'select',
      default: '54',
      options: [
        { value: '36', label: 'Medium (36 pt)' },
        { value: '54', label: 'Large (54 pt • Recommended)' },
        { value: '72', label: 'Extra Large (72 pt)' },
      ],
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_watermarked.pdf',
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

    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();
    const text = sanitizeWinAnsiText((options.watermarkText || 'CONFIDENTIAL').trim());
    const angle = parseInt(options.angle || '45', 10);
    const opacity = parseFloat(options.opacity || '0.25');
    const fontSize = parseInt(options.fontSize || '54', 10);

    onProgress(35, `Applying watermark "${text}" to ${pages.length} pages...`);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      // Center of page
      const centerX = width / 2;
      const centerY = height / 2;

      // Adjust anchor for rotation
      const rad = (angle * Math.PI) / 180;
      const x = centerX - (textWidth / 2) * Math.cos(rad) + (textHeight / 2) * Math.sin(rad);
      const y = centerY - (textWidth / 2) * Math.sin(rad) - (textHeight / 2) * Math.cos(rad);

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.4, 0.45, 0.35), // Sage tinted watermark
        opacity,
        rotate: degrees(angle),
      });
    }

    onProgress(85, 'Packaging watermarked PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_watermarked.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Watermarked ${pages.length} pages successfully!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: pages.length,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Stamped "${text}" across ${pages.length} pages.`,
    };
  },
};

export default addWatermarkAdapter;
