import { PDFDocument, PageSizes, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';

/**
 * Extract slide text items from .pptx archive
 */
async function extractSlidesFromPptx(arrayBuffer) {
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slideFiles = Object.keys(zip.files).filter(
    (name) => name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
  );

  // Sort slides numerically: slide1.xml, slide2.xml, etc.
  slideFiles.sort((a, b) => {
    const numA = parseInt(a.replace(/[^0-9]/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/[^0-9]/g, ''), 10) || 0;
    return numA - numB;
  });

  const slides = [];
  const parser = new DOMParser();

  for (const fileName of slideFiles) {
    const xmlText = await zip.files[fileName].async('text');
    const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    const textNodes = xmlDoc.getElementsByTagName('a:t');
    const slideTexts = [];

    for (let i = 0; i < textNodes.length; i++) {
      const text = textNodes[i].textContent || '';
      if (text.trim()) slideTexts.push(text.trim());
    }

    slides.push({
      fileName,
      texts: slideTexts,
    });
  }

  return slides;
}

const powerpointToPdfAdapter = {
  id: 'powerpoint-to-pdf',
  name: 'POWERPOINT to PDF',
  description: 'Convert PowerPoint presentations (.pptx) into landscape PDF slides with typography and slide numbers.',
  badge: 'Active',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 PowerPoint presentation (.pptx).',
      };
    }

    const hasPptx = files.some((f) => (f.name || '').toLowerCase().endsWith('.pptx'));
    if (!hasPptx) {
      return {
        valid: false,
        reason: 'Please upload a PowerPoint presentation (.pptx) to convert to PDF.',
      };
    }

    return { valid: true };
  },

  options: [
    {
      id: 'slideAspect',
      label: 'Slide Aspect Ratio',
      type: 'select',
      default: 'widescreen',
      options: [
        { value: 'widescreen', label: '16:9 Widescreen (Modern Presentations)' },
        { value: 'standard', label: '4:3 Standard (Classic Slides)' },
      ],
      hint: 'Dimensions for the generated PDF slide pages.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: 'presentation_slides.pdf',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const targetItem = files[0];
    onProgress(10, `Reading PowerPoint presentation: ${targetItem.name}...`);

    let arrayBuffer = targetItem.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetItem.file && typeof targetItem.file.arrayBuffer === 'function') {
        arrayBuffer = await targetItem.file.arrayBuffer();
      }
    }

    const slides = await extractSlidesFromPptx(arrayBuffer);

    if (slides.length === 0) {
      throw new Error('No slides found in the uploaded PowerPoint file.');
    }

    onProgress(35, `Extracted ${slides.length} slides. Formatting PDF slides...`);

    const pdfDoc = await PDFDocument.create();
    const fontTitle = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontBody = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 16:9 widescreen: 960 x 540 pt; 4:3 standard: 800 x 600 pt
    const isWidescreen = options.slideAspect !== 'standard';
    const pageWidth = isWidescreen ? 960 : 800;
    const pageHeight = isWidescreen ? 540 : 600;

    for (let sIdx = 0; sIdx < slides.length; sIdx++) {
      const slide = slides[sIdx];
      const percent = Math.round(40 + ((sIdx + 1) / slides.length) * 45);
      onProgress(percent, `Rendering slide ${sIdx + 1} of ${slides.length}...`);

      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Background card
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(0.98, 0.98, 0.97),
      });

      // Slide header banner
      page.drawRectangle({
        x: 0,
        y: pageHeight - 8,
        width: pageWidth,
        height: 8,
        color: rgb(0.36, 0.44, 0.28), // Sage green bar
      });

      // Slide number badge
      page.drawText(`Slide ${sIdx + 1} of ${slides.length}`, {
        x: pageWidth - 100,
        y: 20,
        size: 9,
        font: fontBody,
        color: rgb(0.5, 0.5, 0.5),
      });

      let currentY = pageHeight - 60;
      const margin = 60;

      for (let tIdx = 0; tIdx < slide.texts.length; tIdx++) {
        const text = slide.texts[tIdx];
        const isTitle = tIdx === 0;
        const font = isTitle ? fontTitle : fontBody;
        const fontSize = isTitle ? 22 : 13;

        if (currentY > 60) {
          page.drawText(text, {
            x: margin,
            y: currentY,
            size: fontSize,
            font,
            color: isTitle ? rgb(0.12, 0.16, 0.1) : rgb(0.25, 0.25, 0.25),
          });
          currentY -= isTitle ? 36 : 22;
        }
      }
    }

    onProgress(90, 'Serializing PDF presentation...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const outBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    let finalName = options.outputFilename || `${targetItem.name.replace(/\.[^/.]+$/, '')}.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, 'PowerPoint to PDF conversion complete!');

    return {
      success: true,
      blob: outBlob,
      downloadUrl: URL.createObjectURL(outBlob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: slides.length,
      isPdf: true,
      files: [
        {
          name: finalName,
          blob: outBlob,
          type: 'application/pdf',
        },
      ],
      message: `Converted ${slides.length} slides into ${finalName}`,
    };
  },
};

export default powerpointToPdfAdapter;
