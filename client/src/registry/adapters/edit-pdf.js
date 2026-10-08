import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const editPdfAdapter = {
  id: 'edit-pdf',
  name: 'Edit PDF',
  description: 'Add custom text annotations, headers, stamps, and notes directly onto pages of your PDF document.',
  badge: 'Edit',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 PDF file to edit.' };
    }
    const target = files[0];
    if (target.isEncrypted) {
      return { valid: false, reason: `Target "${target.name}" is password-protected. Unlock it first.` };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'annotationText',
      label: 'Annotation / Stamp Text',
      type: 'text',
      default: 'APPROVED',
      placeholder: 'e.g. APPROVED, REVIEWED, NOTED',
    },
    {
      id: 'position',
      label: 'Placement Position',
      type: 'select',
      default: 'top-right',
      options: [
        { value: 'top-right', label: 'Top Right Header' },
        { value: 'top-left', label: 'Top Left Header' },
        { value: 'bottom-right', label: 'Bottom Right Stamp' },
        { value: 'bottom-left', label: 'Bottom Left Note' },
        { value: 'center', label: 'Center of Page' },
      ],
    },
    {
      id: 'fontSize',
      label: 'Text Size',
      type: 'select',
      default: '14',
      options: [
        { value: '11', label: 'Small (11 pt • Body note)' },
        { value: '14', label: 'Medium (14 pt • Header / Note)' },
        { value: '20', label: 'Large (20 pt • Prominent Stamp)' },
      ],
    },
    {
      id: 'showBox',
      label: 'Draw Stamp Border',
      type: 'select',
      default: 'true',
      options: [
        { value: 'true', label: 'Yes — Enclose in Badge Box' },
        { value: 'false', label: 'No — Text Only' },
      ],
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_edited.pdf',
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
    const text = (options.annotationText || 'APPROVED').trim();
    const fontSize = parseInt(options.fontSize || '14', 10);
    const position = options.position || 'top-right';
    const showBox = options.showBox !== 'false';

    onProgress(35, `Applying annotations across ${pages.length} pages...`);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const padding = 6;
      const margin = 30;

      let x = width - margin - textWidth;
      let y = height - margin - fontSize;

      if (position === 'top-left') {
        x = margin;
        y = height - margin - fontSize;
      } else if (position === 'bottom-right') {
        x = width - margin - textWidth;
        y = margin;
      } else if (position === 'bottom-left') {
        x = margin;
        y = margin;
      } else if (position === 'center') {
        x = (width - textWidth) / 2;
        y = height / 2;
      }

      if (showBox) {
        page.drawRectangle({
          x: x - padding,
          y: y - padding,
          width: textWidth + padding * 2,
          height: fontSize + padding * 2,
          borderWidth: 1.5,
          borderColor: rgb(0.36, 0.44, 0.28), // Sage border
          color: rgb(0.96, 0.98, 0.94), // Subtle light fill
        });
      }

      page.drawText(text, {
        x,
        y: y + 1,
        size: fontSize,
        font,
        color: rgb(0.2, 0.26, 0.15),
      });
    }

    onProgress(85, 'Packaging edited PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_edited.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Added annotation to ${pages.length} pages!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: pages.length,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Annotated ${pages.length} page(s) with "${text}"`,
    };
  },
};

export default editPdfAdapter;
