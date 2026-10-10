import { PDFDocument, PageSizes, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { sanitizeWinAnsiText } from '../../utils/pdf-magic.js';

/**
 * Extract paragraphs and text from .docx XML using JSZip
 */
async function extractTextFromDocx(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const documentXmlFile = zip.file('word/document.xml');

  if (!documentXmlFile) {
    throw new Error('Invalid Word document: word/document.xml not found.');
  }

  const xmlText = await documentXmlFile.async('text');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  const paragraphs = [];
  const pNodes = xmlDoc.getElementsByTagName('w:p');

  for (let i = 0; i < pNodes.length; i++) {
    const pNode = pNodes[i];
    const textNodes = pNode.getElementsByTagName('w:t');
    let pText = '';

    for (let j = 0; j < textNodes.length; j++) {
      pText += textNodes[j].textContent || '';
    }

    if (pText.trim()) {
      // Check if heading style is applied
      const pStyle = pNode.getElementsByTagName('w:pStyle')[0];
      const styleVal = pStyle?.getAttribute('w:val') || '';
      const isHeading = styleVal.toLowerCase().includes('heading') || styleVal.toLowerCase().includes('title');

      paragraphs.push({
        text: pText.trim(),
        isHeading,
      });
    }
  }

  return paragraphs;
}

const wordToPdfAdapter = {
  id: 'word-to-pdf',
  name: 'WORD to PDF',
  description: 'Convert Microsoft Word (.docx) documents into clean, searchable vector PDF files directly in your browser.',
  badge: 'Active',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 Word document (.docx).',
      };
    }

    const hasDocx = files.some((f) => (f.name || '').toLowerCase().endsWith('.docx'));
    if (!hasDocx) {
      return {
        valid: false,
        reason: 'Please upload a Microsoft Word document (.docx) to convert to PDF.',
      };
    }

    return { valid: true };
  },

  options: [
    {
      id: 'pageSize',
      label: 'Page Size',
      type: 'select',
      default: 'a4',
      options: [
        { value: 'a4', label: 'Standard A4' },
        { value: 'letter', label: 'US Letter' },
      ],
      hint: 'Target page layout dimensions for the PDF output.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: 'word_converted.pdf',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const targetItem = files[0];
    onProgress(10, `Reading Word document: ${targetItem.name}...`);

    let arrayBuffer = targetItem.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetItem.file && typeof targetItem.file.arrayBuffer === 'function') {
        arrayBuffer = await targetItem.file.arrayBuffer();
      }
    }

    const paragraphs = await extractTextFromDocx(arrayBuffer);

    onProgress(40, `Extracted ${paragraphs.length} paragraphs. Initializing PDF engine...`);

    const pdfDoc = await PDFDocument.create();
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const baseDims = options.pageSize === 'letter' ? PageSizes.Letter : PageSizes.A4;
    const pageWidth = baseDims[0];
    const pageHeight = baseDims[1];

    const margin = 48; // Standard 0.66 in margin
    const contentWidth = pageWidth - margin * 2;
    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    const checkPageBreak = (neededHeight) => {
      if (currentY - neededHeight < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }
    };

    onProgress(60, 'Typesetting Word text into vector PDF...');

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const p = paragraphs[pIdx];
      const font = p.isHeading ? fontBold : fontRegular;
      const fontSize = p.isHeading ? 14 : 11;
      const lineHeight = fontSize * 1.35;

      const words = sanitizeWinAnsiText(p.text).split(/\s+/);
      let line = '';

      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > contentWidth && line) {
          checkPageBreak(lineHeight);
          currentPage.drawText(line, {
            x: margin,
            y: currentY - fontSize,
            size: fontSize,
            font,
            color: p.isHeading ? rgb(0.12, 0.16, 0.1) : rgb(0.18, 0.18, 0.18),
          });
          currentY -= lineHeight;
          line = word;
        } else {
          line = testLine;
        }
      }

      if (line) {
        checkPageBreak(lineHeight);
        currentPage.drawText(line, {
          x: margin,
          y: currentY - fontSize,
          size: fontSize,
          font,
          color: p.isHeading ? rgb(0.12, 0.16, 0.1) : rgb(0.18, 0.18, 0.18),
        });
        currentY -= lineHeight;
      }

      currentY -= p.isHeading ? 8 : 6;
    }

    onProgress(90, 'Serializing PDF binary stream...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const outBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    let finalName = options.outputFilename || `${targetItem.name.replace(/\.[^/.]+$/, '')}.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, 'Word to PDF conversion complete!');

    return {
      success: true,
      blob: outBlob,
      downloadUrl: URL.createObjectURL(outBlob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: pdfDoc.getPageCount(),
      isPdf: true,
      files: [
        {
          name: finalName,
          blob: outBlob,
          type: 'application/pdf',
        },
      ],
      message: `Converted ${targetItem.name} into ${finalName}`,
    };
  },
};

export default wordToPdfAdapter;
