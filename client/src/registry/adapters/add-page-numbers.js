import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const addPageNumbersAdapter = {
  id: 'add-page-numbers',
  name: 'Add Page Numbers',
  description: 'Insert customizable page numbering, headers, and footers into your PDF document.',
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
      id: 'position',
      label: 'Number Position',
      type: 'select',
      default: 'bottom-center',
      options: [
        { value: 'bottom-center', label: 'Bottom Center' },
        { value: 'bottom-right', label: 'Bottom Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'top-right', label: 'Top Right' },
        { value: 'top-center', label: 'Top Center' },
      ],
    },
    {
      id: 'format',
      label: 'Numbering Format',
      type: 'select',
      default: 'pageOfTotal',
      options: [
        { value: 'pageOfTotal', label: 'Page X of Y (e.g. Page 1 of 12)' },
        { value: 'slash', label: 'X / Y (e.g. 1 / 12)' },
        { value: 'single', label: 'X (e.g. 1)' },
      ],
    },
    {
      id: 'fontSize',
      label: 'Font Size (pt)',
      type: 'select',
      default: '10',
      options: [
        { value: '8', label: 'Small (8 pt)' },
        { value: '10', label: 'Medium (10 pt • Standard)' },
        { value: '12', label: 'Large (12 pt)' },
      ],
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_numbered.pdf',
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
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    const position = options.position || 'bottom-center';
    const format = options.format || 'pageOfTotal';
    const fontSize = parseInt(options.fontSize || '10', 10);
    const margin = 30;

    onProgress(35, `Applying pagination to ${totalPages} pages...`);

    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const currentNum = i + 1;

      let text = '';
      if (format === 'pageOfTotal') {
        text = `Page ${currentNum} of ${totalPages}`;
      } else if (format === 'slash') {
        text = `${currentNum} / ${totalPages}`;
      } else {
        text = `${currentNum}`;
      }

      const textWidth = font.widthOfTextAtSize(text, fontSize);
      let x = (width - textWidth) / 2;
      let y = margin;

      if (position === 'bottom-right') {
        x = width - margin - textWidth;
        y = margin;
      } else if (position === 'bottom-left') {
        x = margin;
        y = margin;
      } else if (position === 'top-right') {
        x = width - margin - textWidth;
        y = height - margin;
      } else if (position === 'top-center') {
        x = (width - textWidth) / 2;
        y = height - margin;
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }

    onProgress(85, 'Packaging numbered PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_numbered.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Added page numbers to ${totalPages} pages!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Numbered ${totalPages} pages (${position})`,
    };
  },
};

export default addPageNumbersAdapter;
