import { pdfjsLib } from './pdfjs-init.js';
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  PageBreak,
  ImageRun,
  Packer,
} from 'docx';

/**
 * Clean and normalize text strings for OpenXML Word standards
 */
function cleanXmlString(str) {
  if (!str) return '';
  // Strip control characters that are invalid in XML 1.0 (except tab, LF, CR)
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Core PDF to DOCX Conversion Engine
 * Converts vector PDF documents into fully editable Microsoft Word (.docx) documents.
 */
export async function convertPdfToDocx(
  arrayBuffer,
  options = {},
  onProgress = () => {}
) {
  const includePageBreaks = options.includePageBreaks !== 'false' && options.includePageBreaks !== false;
  const detectHeadings = options.detectHeadings !== 'false' && options.detectHeadings !== false;
  const conversionMode = options.conversionMode || 'flowable'; // 'flowable' | 'scanned'

  onProgress(5, 'Initializing PDF parser engine...');

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer.slice(0)),
    cMapUrl: '/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/standard_fonts/',
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const docChildren = [];
  let totalParagraphs = 0;
  let totalTables = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress(
      Math.round(10 + ((pageNum - 1) / numPages) * 75),
      `Extracting text and structure from page ${pageNum} of ${numPages}...`
    );

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });
    const textContent = await page.getTextContent({ includeMarkedContent: true });

    const rawItems = textContent.items.filter((item) => item.str && item.str.length > 0);
    const totalChars = rawItems.reduce((acc, it) => acc + it.str.trim().length, 0);

    // If page is scanned or mode is 'scanned' or text is virtually absent
    if (conversionMode === 'scanned' || totalChars < 12) {
      onProgress(
        Math.round(10 + ((pageNum - 1) / numPages) * 75),
        `Rendering visual page snapshot for page ${pageNum}...`
      );

      try {
        const renderScale = 1.5;
        const renderViewport = page.getViewport({ scale: renderScale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(renderViewport.width);
        canvas.height = Math.round(renderViewport.height);
        const ctx = canvas.getContext('2d', { alpha: false });

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport: renderViewport,
        }).promise;

        const imgBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', 0.88)
        );

        canvas.width = 0;
        canvas.height = 0;

        if (imgBlob) {
          const imgBytes = new Uint8Array(await imgBlob.arrayBuffer());
          const targetWidth = Math.min(540, Math.round(viewport.width * 0.72));
          const targetHeight = Math.min(720, Math.round(viewport.height * 0.72));

          docChildren.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: imgBytes,
                  transformation: {
                    width: targetWidth,
                    height: targetHeight,
                  },
                }),
              ],
              spacing: { after: 140 },
              alignment: AlignmentType.CENTER,
            })
          );
          totalParagraphs++;
        }
      } catch (renderErr) {
        console.warn(`Page ${pageNum} visual snapshot error:`, renderErr);
      }
    } else {
      // Vector Text & Flowable Document Pipeline
      const items = rawItems.map((item) => {
        const a = item.transform[0];
        const b = item.transform[1];
        const fontSize = Math.max(7, Math.round(Math.hypot(a, b)));
        const tx = item.transform[4];
        const ty = item.transform[5];
        const top = viewport.height - ty;
        const fontName = item.fontName || '';
        const isBold = /bold|black|heavy|medium/i.test(fontName);
        const isItalic = /italic|oblique/i.test(fontName);

        return {
          text: cleanXmlString(item.str),
          x: tx,
          top,
          width: item.width || fontSize * 0.55 * item.str.length,
          height: item.height || fontSize,
          fontSize,
          isBold,
          isItalic,
        };
      });

      // Group into horizontal lines
      items.sort((i1, i2) => {
        const diffY = i1.top - i2.top;
        if (Math.abs(diffY) > 3) return diffY;
        return i1.x - i2.x;
      });

      const lines = [];
      let currentLine = null;

      for (const item of items) {
        if (!currentLine) {
          currentLine = {
            top: item.top,
            bottom: item.top + item.height,
            maxFontSize: item.fontSize,
            items: [item],
          };
          lines.push(currentLine);
        } else {
          const yDelta = Math.abs(item.top - currentLine.top);
          const threshold = Math.max(3.5, currentLine.maxFontSize * 0.35);

          if (yDelta <= threshold) {
            currentLine.items.push(item);
            currentLine.maxFontSize = Math.max(currentLine.maxFontSize, item.fontSize);
            currentLine.bottom = Math.max(currentLine.bottom, item.top + item.height);
          } else {
            currentLine = {
              top: item.top,
              bottom: item.top + item.height,
              maxFontSize: item.fontSize,
              items: [item],
            };
            lines.push(currentLine);
          }
        }
      }

      // Assemble runs within each line
      for (const line of lines) {
        line.items.sort((a, b) => a.x - b.x);

        const runs = [];
        let lineFullText = '';

        for (let k = 0; k < line.items.length; k++) {
          const it = line.items[k];
          let prefix = '';

          if (k > 0) {
            const prev = line.items[k - 1];
            const gap = it.x - (prev.x + prev.width);
            if (
              gap > Math.max(1.8, it.fontSize * 0.16) &&
              !prev.text.endsWith(' ') &&
              !it.text.startsWith(' ')
            ) {
              prefix = ' ';
            }
          }

          const runText = prefix + it.text;
          lineFullText += runText;

          const prevRun = runs[runs.length - 1];
          if (
            prevRun &&
            prevRun.bold === it.isBold &&
            prevRun.italics === it.isItalic &&
            prevRun.size === Math.round(it.fontSize * 2)
          ) {
            prevRun.text += runText;
          } else {
            runs.push({
              text: runText,
              bold: it.isBold,
              italics: it.isItalic,
              size: Math.round(it.fontSize * 2), // Word half-points (22 = 11pt)
            });
          }
        }

        line.runs = runs;
        line.text = lineFullText.trim();
        line.startX = line.items[0]?.x || 0;
      }

      // Find typical document body font size
      const fontSizes = lines.map((l) => l.maxFontSize).filter((s) => s > 0);
      fontSizes.sort((a, b) => a - b);
      const medianFontSize = fontSizes[Math.floor(fontSizes.length / 2)] || 11;

      // Group lines into paragraphs and headings
      let pendingParagraphRuns = [];
      let pendingHeading = null;
      let pendingBullet = false;
      let prevLineBottom = 0;
      let prevLineFontSize = medianFontSize;

      const flushPendingParagraph = () => {
        if (pendingParagraphRuns.length === 0) return;

        const textRuns = pendingParagraphRuns.map(
          (r) =>
            new TextRun({
              text: r.text,
              bold: r.bold,
              italics: r.italics,
              size: r.size,
            })
        );

        const pProps = {
          children: textRuns,
          spacing: { after: 120, line: 276 },
        };

        if (pendingHeading) {
          pProps.heading = pendingHeading;
          pProps.spacing = { before: 200, after: 100 };
        } else if (pendingBullet) {
          pProps.bullet = { level: 0 };
          pProps.spacing = { after: 70 };
        }

        docChildren.push(new Paragraph(pProps));
        totalParagraphs++;

        pendingParagraphRuns = [];
        pendingHeading = null;
        pendingBullet = false;
      };

      for (let idx = 0; idx < lines.length; idx++) {
        const line = lines[idx];
        if (!line.text) continue;

        // Detect bullet / numbered list items
        const isBullet = /^([•\u2022\u25E6\u25AA\-\*]|\d+[\.\)])\s+/.test(line.text);
        const bulletCleanText = isBullet
          ? line.text.replace(/^([•\u2022\u25E6\u25AA\-\*]|\d+[\.\)])\s+/, '')
          : line.text;

        // Detect headings
        let headingLevel = null;
        if (detectHeadings && !isBullet) {
          if (line.maxFontSize >= medianFontSize * 1.45) {
            headingLevel = HeadingLevel.HEADING_1;
          } else if (line.maxFontSize >= medianFontSize * 1.25) {
            headingLevel = HeadingLevel.HEADING_2;
          } else if (line.maxFontSize >= medianFontSize * 1.12 && line.runs.some((r) => r.bold)) {
            headingLevel = HeadingLevel.HEADING_3;
          }
        }

        const verticalGap = idx > 0 ? line.top - prevLineBottom : 0;
        const isParagraphBreak =
          idx === 0 ||
          verticalGap > prevLineFontSize * 0.75 ||
          headingLevel !== null ||
          pendingHeading !== null ||
          isBullet ||
          pendingBullet;

        if (isParagraphBreak) {
          flushPendingParagraph();
          pendingHeading = headingLevel;
          pendingBullet = isBullet;
        }

        // Add line runs to pending paragraph
        if (isBullet) {
          pendingParagraphRuns.push({
            text: bulletCleanText,
            bold: line.runs[0]?.bold,
            italics: line.runs[0]?.italics,
            size: line.runs[0]?.size || Math.round(medianFontSize * 2),
          });
        } else {
          // If continuing a paragraph, insert a connecting space
          if (pendingParagraphRuns.length > 0) {
            pendingParagraphRuns.push({
              text: ' ',
              bold: false,
              italics: false,
              size: Math.round(medianFontSize * 2),
            });
          }
          pendingParagraphRuns.push(...line.runs);
        }

        prevLineBottom = line.bottom;
        prevLineFontSize = line.maxFontSize;
      }

      flushPendingParagraph();
    }

    // Insert Page Break between pages if requested
    if (includePageBreaks && pageNum < numPages) {
      docChildren.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }

    page.cleanup?.();
  }

  pdf.destroy?.();

  onProgress(90, 'Packaging Microsoft Word OpenXML (.docx) structure...');

  const wordDocument = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22, // 11pt
            color: '262D20',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch margins
          },
        },
        children: docChildren.length > 0 ? docChildren : [
          new Paragraph({ text: 'Converted Document' }),
        ],
      },
    ],
  });

  const docxBlob = await Packer.toBlob(wordDocument);

  onProgress(100, 'DOCX conversion completed successfully!');

  return {
    blob: docxBlob,
    totalPages: numPages,
    totalParagraphs,
    totalTables,
    fileSize: docxBlob.size,
  };
}
