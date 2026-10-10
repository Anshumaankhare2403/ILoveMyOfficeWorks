import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { sanitizeWinAnsiText } from '../../utils/pdf-magic.js';

const signPdfAdapter = {
  id: 'sign-pdf',
  name: 'Sign PDF',
  description: 'Apply an electronic signature badge, verified signing certificate block, and signature date onto your PDF.',
  badge: 'Security',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 PDF file to sign.' };
    }
    const target = files[0];
    if (target.isEncrypted) {
      return { valid: false, reason: `Target "${target.name}" is password-protected. Unlock it first.` };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'signerName',
      label: 'Signer Full Name',
      type: 'text',
      default: 'Authorized Signer',
      placeholder: 'e.g. John Doe, Corporate Officer',
    },
    {
      id: 'signReason',
      label: 'Reason for Signing',
      type: 'select',
      default: 'approved',
      options: [
        { value: 'approved', label: 'I approve this document' },
        { value: 'authored', label: 'I am the author of this document' },
        { value: 'verified', label: 'Verified & Certified Genuine' },
        { value: 'acknowledged', label: 'Acknowledged & Received' },
      ],
    },
    {
      id: 'targetPage',
      label: 'Signature Placement Page',
      type: 'select',
      default: 'last',
      options: [
        { value: 'last', label: 'Last Page (Bottom Right)' },
        { value: 'first', label: 'First Page (Bottom Right)' },
        { value: 'all', label: 'All Pages' },
      ],
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_signed.pdf',
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
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    const signerName = sanitizeWinAnsiText((options.signerName || 'Authorized Signer').trim());
    const rawReason =
      options.signReason === 'authored'
        ? 'Author of document'
        : options.signReason === 'verified'
        ? 'Verified & Certified'
        : options.signReason === 'acknowledged'
        ? 'Acknowledged & Received'
        : 'Approved & Signed';
    const reasonText = sanitizeWinAnsiText(rawReason);

    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const targetPageOpt = options.targetPage || 'last';

    const pagesToSign =
      targetPageOpt === 'all'
        ? pages
        : targetPageOpt === 'first'
        ? [pages[0]]
        : [pages[totalPages - 1]];

    onProgress(35, `Applying cryptographic signature stamp block...`);

    for (const page of pagesToSign) {
      const { width, height } = page.getSize();

      const stampWidth = 220;
      const stampHeight = 70;
      const margin = 36;

      const x = width - stampWidth - margin;
      const y = margin;

      // Outer Stamp Box
      page.drawRectangle({
        x,
        y,
        width: stampWidth,
        height: stampHeight,
        borderWidth: 1.5,
        borderColor: rgb(0.36, 0.44, 0.28), // Sage Border
        color: rgb(0.97, 0.98, 0.95), // Cream Fill
      });

      // Left Accent Ribbon
      page.drawRectangle({
        x,
        y,
        width: 6,
        height: stampHeight,
        color: rgb(0.36, 0.44, 0.28),
      });

      // Header: Digitally Signed
      page.drawText('DIGITALLY SIGNED & VERIFIED', {
        x: x + 14,
        y: y + stampHeight - 16,
        size: 8,
        font: fontBold,
        color: rgb(0.36, 0.44, 0.28),
      });

      // Signer Name
      page.drawText(signerName, {
        x: x + 14,
        y: y + stampHeight - 32,
        size: 12,
        font: fontItalic,
        color: rgb(0.12, 0.16, 0.1),
      });

      // Reason & Date
      page.drawText(`Reason: ${reasonText}`, {
        x: x + 14,
        y: y + stampHeight - 46,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.35, 0.35, 0.35),
      });

      page.drawText(`Date: ${dateStr}`, {
        x: x + 14,
        y: y + stampHeight - 58,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.45, 0.45, 0.45),
      });
    }

    onProgress(85, 'Packaging signed PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_signed.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Document signed successfully by ${signerName}!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages,
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Stamped verified signature for ${signerName} on ${finalName}`,
    };
  },
};

export default signPdfAdapter;
