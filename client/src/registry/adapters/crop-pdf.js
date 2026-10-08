import { PDFDocument } from 'pdf-lib';

const cropPdfAdapter = {
  id: 'crop-pdf',
  name: 'Crop PDF',
  description: 'Trim margins, crop page dimensions, and remove unwanted white borders from PDF pages.',
  badge: 'Edit',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 PDF file to crop.' };
    }
    const target = files[0];
    if (target.isEncrypted) {
      return { valid: false, reason: `Target "${target.name}" is password-protected. Unlock it first.` };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'cropPreset',
      label: 'Margin Trim Preset',
      type: 'select',
      default: 'moderate',
      options: [
        { value: 'light', label: 'Light Margin Trim (18 pt • ~0.25 in / 6 mm)' },
        { value: 'moderate', label: 'Moderate Trim (36 pt • ~0.5 in / 12 mm)' },
        { value: 'heavy', label: 'Aggressive Trim (54 pt • ~0.75 in / 19 mm)' },
        { value: 'sidesOnly', label: 'Left & Right Sides Only (36 pt)' },
      ],
      hint: 'Adjusts the PDF cropBox bounding rectangle symmetrically across all pages.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_cropped.pdf',
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
    const pages = pdfDoc.getPages();
    const preset = options.cropPreset || 'moderate';

    let trimX = 36;
    let trimY = 36;

    if (preset === 'light') {
      trimX = 18;
      trimY = 18;
    } else if (preset === 'heavy') {
      trimX = 54;
      trimY = 54;
    } else if (preset === 'sidesOnly') {
      trimX = 36;
      trimY = 0;
    }

    onProgress(35, `Applying crop margin box to ${pages.length} pages...`);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      const newWidth = Math.max(100, width - trimX * 2);
      const newHeight = Math.max(100, height - trimY * 2);

      page.setCropBox(trimX, trimY, newWidth, newHeight);
    }

    onProgress(85, 'Packaging cropped PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_cropped.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Cropped ${pages.length} pages successfully!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: pages.length,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Adjusted crop box on ${pages.length} pages.`,
    };
  },
};

export default cropPdfAdapter;
