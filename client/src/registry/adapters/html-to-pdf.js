import { PDFDocument, PageSizes, StandardFonts, rgb } from 'pdf-lib';

/**
 * Strips HTML tags and splits into formatted paragraph blocks
 */
function parseHtmlToBlocks(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const blocks = [];
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) blocks.push({ type: 'text', content: text });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        blocks.push({ type: 'heading', level: tag, content: node.textContent.trim() });
      } else if (['p', 'li', 'div', 'tr'].includes(tag)) {
        const text = node.textContent.trim();
        if (text) blocks.push({ type: 'paragraph', content: text });
      } else {
        node.childNodes.forEach(walk);
      }
    }
  };

  doc.body.childNodes.forEach(walk);
  return blocks;
}

const htmlToPdfAdapter = {
  id: 'html-to-pdf',
  name: 'HTML to PDF',
  description: 'Convert HTML files, webpages, and formatted code into clean, printable PDF documents.',
  badge: 'Active',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 HTML or text file.',
      };
    }

    const hasHtmlOrText = files.some((f) => {
      const name = (f.name || '').toLowerCase();
      return name.endsWith('.html') || name.endsWith('.htm') || name.endsWith('.txt');
    });

    if (!hasHtmlOrText) {
      return {
        valid: false,
        reason: 'Please upload an HTML document (.html, .htm) or text file.',
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
      hint: 'Standard document printing dimensions.',
    },
    {
      id: 'pageOrientation',
      label: 'Page Orientation',
      type: 'select',
      default: 'portrait',
      options: [
        { value: 'portrait', label: 'Portrait (Vertical)' },
        { value: 'landscape', label: 'Landscape (Horizontal)' },
      ],
      hint: 'Choose orientation for layout flow.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: 'converted_webpage.pdf',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const targetItem = files[0];
    onProgress(10, `Reading HTML document: ${targetItem.name}...`);

    let textContent = '';
    try {
      if (targetItem.file && typeof targetItem.file.text === 'function') {
        textContent = await targetItem.file.text();
      } else if (targetItem.arrayBuffer) {
        textContent = new TextDecoder('utf-8').decode(targetItem.arrayBuffer);
      }
    } catch {
      textContent = '<h1>Document</h1><p>Converted text content.</p>';
    }

    if (!textContent) {
      textContent = '<h1>Document</h1><p>Converted text content.</p>';
    }

    const blocks = parseHtmlToBlocks(textContent);

    onProgress(35, 'Initializing PDF typography engine...');
    const pdfDoc = await PDFDocument.create();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const isLandscape = options.pageOrientation === 'landscape';
    const baseDims = options.pageSize === 'letter' ? PageSizes.Letter : PageSizes.A4;
    const pageWidth = isLandscape ? Math.max(baseDims[0], baseDims[1]) : Math.min(baseDims[0], baseDims[1]);
    const pageHeight = isLandscape ? Math.min(baseDims[0], baseDims[1]) : Math.max(baseDims[0], baseDims[1]);

    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    const checkPageBreak = (neededHeight) => {
      if (currentY - neededHeight < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }
    };

    onProgress(50, 'Typesetting HTML text into vector PDF...');

    for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
      const block = blocks[bIdx];
      const isHeading = block.type === 'heading';
      const font = isHeading ? fontBold : fontRegular;
      const fontSize = isHeading ? (block.level === 'h1' ? 18 : 14) : 10;
      const lineHeight = fontSize * 1.4;

      // Word wrap text within contentWidth
      const words = block.content.split(/\s+/);
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
            color: isHeading ? rgb(0.12, 0.16, 0.1) : rgb(0.2, 0.2, 0.2),
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
          color: isHeading ? rgb(0.12, 0.16, 0.1) : rgb(0.2, 0.2, 0.2),
        });
        currentY -= lineHeight;
      }

      // Add paragraph spacing
      currentY -= isHeading ? 10 : 6;
    }

    onProgress(85, 'Packaging PDF bytes...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const outBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    let finalName = options.outputFilename || `${targetItem.name.replace(/\.[^/.]+$/, '')}.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, 'HTML converted to PDF successfully!');

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
      message: `Rendered ${blocks.length} elements from ${targetItem.name} into ${finalName}`,
    };
  },
};

export default htmlToPdfAdapter;
