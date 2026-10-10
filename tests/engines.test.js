import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatFileSize, verifyPdfMagicBytes, inspectPdfFile, MAX_FILE_SIZE } from '../client/src/utils/pdf-magic.js';
import { loadTestPdf } from './test-utils.js';
import { PDFDocument, StandardFonts } from '../client/node_modules/pdf-lib/cjs/index.js';

describe('PDF Magic Utilities & File Inspector', () => {
  it('formats byte sizes into human-readable strings correctly', () => {
    assert.equal(formatFileSize(0), '0 B');
    assert.equal(formatFileSize(512), '512.00 B');
    assert.equal(formatFileSize(1024), '1.00 KB');
    assert.equal(formatFileSize(1536), '1.50 KB');
    assert.equal(formatFileSize(1048576), '1.00 MB');
    assert.equal(formatFileSize(1073741824), '1.00 GB');
  });

  it('verifies PDF magic bytes (%PDF-) correctly', async () => {
    const validPdfBlob = new Blob([Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj')], { type: 'application/pdf' });
    const isMagic = await verifyPdfMagicBytes(validPdfBlob);
    assert.equal(isMagic, true);

    const pdfWithBOM = new Blob([Buffer.from('\xEF\xBB\xBF%PDF-1.4\n')], { type: 'application/pdf' });
    const isMagicBOM = await verifyPdfMagicBytes(pdfWithBOM);
    assert.equal(isMagicBOM, true);

    const textBlob = new Blob([Buffer.from('Hello world this is not a PDF')], { type: 'text/plain' });
    const isNotMagic = await verifyPdfMagicBytes(textBlob);
    assert.equal(isNotMagic, false);
  });

  it('enforces maximum file size limit (200MB)', async () => {
    const mockOversizedFile = {
      name: 'giant.pdf',
      size: MAX_FILE_SIZE + 1024,
      type: 'application/pdf',
    };
    await assert.rejects(
      async () => {
        await inspectPdfFile(mockOversizedFile);
      },
      /File too large/
    );
  });

  it('inspects valid PDF documents accurately', async () => {
    const testDoc = loadTestPdf('sample_report.pdf');
    const inspected = await inspectPdfFile(testDoc.file);

    assert.equal(inspected.isPdf, true);
    assert.equal(inspected.isEncrypted, false);
    assert.equal(inspected.pageCount, 3);
    assert.equal(inspected.error, null);
    assert.ok(inspected.arrayBuffer.byteLength > 0);
  });

  it('identifies image files and extracts image properties', async () => {
    const fakeImageBuffer = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46]);
    const imageFile = new File([fakeImageBuffer], 'photo.jpg', { type: 'image/jpeg' });
    const inspected = await inspectPdfFile(imageFile);

    assert.equal(inspected.isImage, true);
    assert.equal(inspected.pageCount, 1);
    assert.equal(inspected.isEncrypted, false);
  });

  it('identifies Office and document formats (.docx, .xlsx, .pptx)', async () => {
    const docxFile = new File([new Uint8Array([0x50, 0x4B, 0x03, 0x04])], 'report.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const inspected = await inspectPdfFile(docxFile);

    assert.equal(inspected.isOfficeDoc, true);
    assert.equal(inspected.pageCount, 1);
    assert.equal(inspected.name, 'report.docx');
  });

  it('rejects unsupported arbitrary binary formats without PDF magic bytes', async () => {
    const randomBinFile = new File([new Uint8Array([0x00, 0x01, 0x02, 0x03])], 'random.bin', {
      type: 'application/octet-stream',
    });
    await assert.rejects(
      async () => {
        await inspectPdfFile(randomBinFile);
      },
      /Unsupported format/
    );
  });
});

describe('PDF Standard Fonts WinAnsi Encoding Robustness', () => {
  it('identifies WinAnsi limitation on non-ASCII characters (emojis, unicode)', async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const page = doc.addPage();

    // Standard ASCII and basic WinAnsi characters pass
    assert.doesNotThrow(() => {
      page.drawText('Normal English text 123!', { font });
      page.drawText('Quotes: "hello" and \'test\'', { font });
    });

    // Unhandled emojis or CJK in drawText throw WinAnsi cannot encode
    assert.throws(() => {
      page.drawText('Emoji test 😀', { font });
    }, /WinAnsi cannot encode/);

    assert.throws(() => {
      page.drawText('Unicode: 中文', { font });
    }, /WinAnsi cannot encode/);
  });
});
