import { pdfjsLib } from '../../utils/pdfjs-init.js';

/**
 * Clean cell text and escape CSV characters
 */
function escapeCsvCell(text) {
  if (!text) return '""';
  const clean = text.replace(/"/g, '""').trim();
  return `"${clean}"`;
}

/**
 * Convert PDF text layout to structured rows and CSV data
 */
async function extractPdfTablesToCsv(pdf, options = {}, onProgress = () => {}) {
  const numPages = pdf.numPages;
  const allRows = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const percent = Math.round(15 + (pageNum / numPages) * 70);
    onProgress(percent, `Analyzing tables on page ${pageNum} of ${numPages}...`);

    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items;

    if (!items || items.length === 0) continue;

    // Filter out whitespace-only items
    const textItems = items
      .filter((item) => item.str && item.str.trim().length > 0)
      .map((item) => ({
        text: item.str,
        x: item.transform[4],
        y: item.transform[5],
        width: item.width,
        height: item.height,
      }));

    // Group items into rows based on Y coordinate (Y-tolerance of 4pt)
    const yTolerance = 5;
    const rowBuckets = [];

    // Sort items by Y descending (PDF coordinates origin is bottom-left)
    textItems.sort((a, b) => b.y - a.y || a.x - b.x);

    for (const item of textItems) {
      let matchedBucket = rowBuckets.find(
        (b) => Math.abs(b.y - item.y) <= yTolerance
      );

      if (!matchedBucket) {
        matchedBucket = { y: item.y, items: [] };
        rowBuckets.push(matchedBucket);
      }
      matchedBucket.items.push(item);
    }

    // Sort row buckets from top to bottom
    rowBuckets.sort((a, b) => b.y - a.y);

    if (options.includePageHeaders !== 'false' && numPages > 1) {
      allRows.push([`--- PAGE ${pageNum} ---`]);
    }

    for (const bucket of rowBuckets) {
      // Sort items within row by X coordinate ascending (left-to-right)
      bucket.items.sort((a, b) => a.x - b.x);

      // Check distance between items to determine if they belong in separate cells
      const rowCells = [];
      let currentCell = '';
      let prevRight = null;

      for (const it of bucket.items) {
        if (prevRight !== null && it.x - prevRight > 15) {
          // Significant horizontal gap -> new column
          if (currentCell) rowCells.push(currentCell);
          currentCell = it.text;
        } else {
          currentCell = currentCell ? `${currentCell} ${it.text}` : it.text;
        }
        prevRight = it.x + (it.width || 0);
      }

      if (currentCell) rowCells.push(currentCell);
      if (rowCells.length > 0) {
        allRows.push(rowCells);
      }
    }
  }

  // Format into CSV string
  const csvLines = allRows.map((row) =>
    row.map((cell) => escapeCsvCell(cell)).join(',')
  );

  // Prepend UTF-8 BOM so Excel opens UTF-8 characters cleanly
  return '\uFEFF' + csvLines.join('\r\n');
}

const pdfToExcelAdapter = {
  id: 'pdf-to-excel',
  name: 'PDF to Excel',
  description: 'Extract tables, rows, invoices, and structured data from PDF into Microsoft Excel CSV spreadsheet format.',
  badge: 'Active',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 PDF document to extract tables.',
      };
    }

    const targetFile = files[0];
    if (targetFile.isEncrypted) {
      return {
        valid: false,
        reason: `Cannot extract data from locked file "${targetFile.name}". Please unlock it first.`,
      };
    }

    return { valid: true };
  },

  options: [
    {
      id: 'format',
      label: 'Spreadsheet Format',
      type: 'select',
      default: 'csv',
      options: [
        { value: 'csv', label: 'CSV (.csv • Universal Excel & Google Sheets)' },
      ],
      hint: 'Exports universal comma-separated spreadsheet with UTF-8 BOM encoding for direct Excel opening.',
    },
    {
      id: 'includePageHeaders',
      label: 'Page Separator Rows',
      type: 'select',
      default: 'true',
      options: [
        { value: 'true', label: 'Yes — Include Page Separator Banners' },
        { value: 'false', label: 'No — Continuous Data Flow' },
      ],
      hint: 'Insert divider row between pages to distinguish multi-page sections.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: 'extracted_data.csv',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const targetItem = files[0];
    onProgress(5, `Loading PDF document: ${targetItem.name}...`);

    let arrayBuffer = targetItem.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetItem.file && typeof targetItem.file.arrayBuffer === 'function') {
        arrayBuffer = await targetItem.file.arrayBuffer();
      }
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer.slice(0)),
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '/standard_fonts/',
    });

    const pdf = await loadingTask.promise;
    const csvContent = await extractPdfTablesToCsv(pdf, options, onProgress);

    onProgress(90, 'Generating spreadsheet file...');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    let finalName = options.outputFilename || `${targetItem.name.replace(/\.[^/.]+$/, '')}_data.csv`;
    if (!finalName.toLowerCase().endsWith('.csv')) finalName += '.csv';

    onProgress(100, 'Tables extracted to Excel successfully!');

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: blob.size,
      totalPages: pdf.numPages,
      isCsv: true,
      files: [
        {
          name: finalName,
          blob,
          type: 'text/csv',
        },
      ],
      message: `Extracted structured tabular data into ${finalName}`,
    };
  },
};

export default pdfToExcelAdapter;
