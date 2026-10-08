import { PDFDocument, degrees } from 'pdf-lib';

const rotatePdfAdapter = {
  id: 'rotate-pdf',
  name: 'Rotate PDF',
  description: 'Rotate all or specific pages of your PDF document clockwise by 90, 180, or 270 degrees.',
  badge: 'Edit',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 PDF file to rotate.' };
    }
    const target = files[0];
    if (target.isEncrypted) {
      return { valid: false, reason: `Target "${target.name}" is password-protected. Unlock it first.` };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'rotation',
      label: 'Rotation Angle',
      type: 'select',
      default: '90',
      options: [
        { value: '90', label: '90° Clockwise (Right)' },
        { value: '180', label: '180° Flip (Upside Down)' },
        { value: '270', label: '270° Clockwise / 90° Counter-Clockwise (Left)' },
      ],
    },
    {
      id: 'pageSelection',
      label: 'Pages to Rotate',
      type: 'select',
      default: 'all',
      options: [
        { value: 'all', label: 'All Pages' },
        { value: 'odd', label: 'Odd Pages Only (1, 3, 5...)' },
        { value: 'even', label: 'Even Pages Only (2, 4, 6...)' },
      ],
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_rotated.pdf',
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
    const rot = parseInt(options.rotation || '90', 10);
    const selection = options.pageSelection || 'all';

    onProgress(30, `Rotating pages by ${rot}°...`);

    for (let i = 0; i < pages.length; i++) {
      const pageNum = i + 1;
      const shouldRotate =
        selection === 'all' ||
        (selection === 'odd' && pageNum % 2 !== 0) ||
        (selection === 'even' && pageNum % 2 === 0);

      if (shouldRotate) {
        const currentRotation = pages[i].getRotation().angle;
        pages[i].setRotation(degrees((currentRotation + rot) % 360));
      }
    }

    onProgress(85, 'Packaging rotated PDF binary...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_rotated_${rot}deg.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Rotated ${pages.length} pages by ${rot}°!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: pages.length,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Successfully rotated pages in ${finalName}`,
    };
  },
};

export default rotatePdfAdapter;
