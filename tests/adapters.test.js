import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ADAPTER_REGISTRY, getRegisteredAdapters, executeAdapter } from '../client/src/registry/registry.js';
import { loadTestPdf, createMockFileItem } from './test-utils.js';
import { PDFDocument, PDFName, decodePDFRawStream } from '../client/node_modules/pdf-lib/cjs/index.js';

describe('Adapter Registry Architecture & Contract Compliance', () => {
  it('registers all 34 tool adapters without ID collisions', () => {
    assert.equal(ADAPTER_REGISTRY.length, 34);
    const ids = ADAPTER_REGISTRY.map((a) => a.id);
    const uniqueIds = new Set(ids);
    assert.equal(uniqueIds.size, 34, 'All tool adapter IDs must be completely unique');
  });

  it('verifies that every adapter adheres to the base adapter specification contract', () => {
    for (const adapter of ADAPTER_REGISTRY) {
      assert.ok(adapter.id && typeof adapter.id === 'string', `${adapter.name} must have a valid string ID`);
      assert.ok(adapter.name && typeof adapter.name === 'string', `${adapter.id} must have a human-readable name`);
      assert.ok(adapter.description && typeof adapter.description === 'string', `${adapter.id} must have a description`);
      assert.equal(typeof adapter.accepts, 'function', `${adapter.id} accepts() must be a function`);
      assert.ok(Array.isArray(adapter.options), `${adapter.id} options must be an array`);
      assert.equal(typeof adapter.execute, 'function', `${adapter.id} execute() must be a function`);
    }
  });

  it('rejects execution when files queue is empty across all adapters', () => {
    for (const adapter of ADAPTER_REGISTRY) {
      const result = adapter.accepts([]);
      assert.equal(result.valid, false, `${adapter.id} accepts([]) should return valid: false`);
      assert.ok(result.reason && typeof result.reason === 'string', `${adapter.id} must provide a validation failure reason`);
    }
  });

  it('rejects password-protected PDFs across tools that require unlocked files', () => {
    const lockedFile = createMockFileItem({
      name: 'confidential.pdf',
      isPdf: true,
      isEncrypted: true,
      pageCount: null,
    });

    const toolsRejectingLocked = [
      'merge-pdf',
      'split-pdf',
      'compress-pdf',
      'rotate-pdf',
      'add-watermark',
      'crop-pdf',
      'edit-pdf',
      'sign-pdf',
      'remove-pages',
      'extract-pages',
      'organize-pdf',
      'pdf-forms',
      'pdf-to-pdfa',
    ];

    for (const toolId of toolsRejectingLocked) {
      const adapter = ADAPTER_REGISTRY.find((a) => a.id === toolId);
      assert.ok(adapter, `Adapter ${toolId} should exist`);
      const testQueue = toolId === 'merge-pdf' ? [lockedFile, lockedFile] : [lockedFile];
      const result = adapter.accepts(testQueue);
      assert.equal(result.valid, false, `${toolId} must reject encrypted PDF files`);
      assert.match(result.reason.toLowerCase(), /password|encrypt|unlock/, `${toolId} reason must explain that file is locked`);
    }
  });

  it('verifies unlock-pdf accepts encrypted files', () => {
    const lockedFile = createMockFileItem({
      name: 'locked.pdf',
      isPdf: true,
      isEncrypted: true,
    });
    const unlockAdapter = ADAPTER_REGISTRY.find((a) => a.id === 'unlock-pdf');
    const result = unlockAdapter.accepts([lockedFile]);
    assert.equal(result.valid, true, 'unlock-pdf must accept password protected files');
  });

  it('evaluates dynamic validation status correctly with getRegisteredAdapters()', () => {
    const pdfFile = loadTestPdf('sample_report.pdf');
    const adaptersStatus = getRegisteredAdapters([pdfFile]);

    assert.equal(adaptersStatus.length, 34);

    // merge requires at least 2 files
    const mergeStatus = adaptersStatus.find((a) => a.id === 'merge-pdf');
    assert.equal(mergeStatus.isValid, false);
    assert.match(mergeStatus.validationReason, /at least 2 PDF/i);

    // split requires at least 2 pages (sample_report has 3 pages) -> valid
    const splitStatus = adaptersStatus.find((a) => a.id === 'split-pdf');
    assert.equal(splitStatus.isValid, true);
  });
});

describe('Tool Adapter Operations Execution', () => {
  it('executes merge-pdf successfully and merges documents sequentially', async () => {
    const doc1 = loadTestPdf('sample_report.pdf');
    const doc2 = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('merge-pdf', [doc1, doc2], {
      outputFilename: 'combined_report.pdf',
    });

    assert.equal(result.success, true);
    assert.equal(result.filename, 'combined_report.pdf');
    assert.equal(result.totalPages, 6, 'Merged doc should contain 3 + 3 = 6 pages');
    assert.ok(result.blob.size > 0);
    assert.ok(Array.isArray(result.files));

    // Verify output is valid loadable PDF with pdf-lib
    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.equal(loaded.getPageCount(), 6);
  });

  it('executes split-pdf by page range and fixed chunk modes', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    // Test custom range: Page 1-2
    const rangeResult = await executeAdapter('split-pdf', [doc], {
      splitMode: 'range',
      pageRanges: '1-2',
      outputPrefix: 'audit_split',
    });

    assert.equal(rangeResult.success, true);
    assert.equal(rangeResult.parts.length, 1);
    assert.equal(rangeResult.parts[0].pageCount, 2);

    // Test every N pages (every 1 page -> 3 parts -> ZIP)
    const everyResult = await executeAdapter('split-pdf', [doc], {
      splitMode: 'everyN',
      everyN: 1,
      outputPrefix: 'chunks',
    });

    assert.equal(everyResult.success, true);
    assert.equal(everyResult.parts.length, 3);
    assert.equal(everyResult.isZip, true);
  });

  it('executes remove-pages to delete unwanted pages', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('remove-pages', [doc], {
      pagesToRemove: '2',
      outputFilename: 'without_page_2.pdf',
    });

    assert.equal(result.success, true);
    assert.equal(result.totalPages, 2, 'Doc should have 2 pages after removing 1 of 3');

    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.equal(loaded.getPageCount(), 2);
  });

  it('executes extract-pages to extract specific pages into a new document', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('extract-pages', [doc], {
      pagesToExtract: '1, 3',
      outputFilename: 'extracted.pdf',
    });

    assert.equal(result.success, true);
    assert.equal(result.totalPages, 2);

    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.equal(loaded.getPageCount(), 2);
  });

  it('executes organize-pdf to reverse and customize page order', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('organize-pdf', [doc], {
      orderMode: 'reverse',
    });

    assert.equal(result.success, true);
    assert.equal(result.totalPages, 3);

    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.equal(loaded.getPageCount(), 3);
  });

  it('executes rotate-pdf clockwise by degrees', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('rotate-pdf', [doc], {
      rotation: '90',
      pageSelection: 'all',
    });

    assert.equal(result.success, true);
    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    const pages = loaded.getPages();
    for (const page of pages) {
      assert.equal(page.getRotation().angle, 90);
    }
  });

  it('executes add-page-numbers pagination across all pages', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('add-page-numbers', [doc], {
      position: 'bottom-center',
      format: 'pageOfTotal',
    });

    assert.equal(result.success, true);
    assert.equal(result.totalPages, 3);
    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.equal(loaded.getPageCount(), 3);
  });

  it('executes add-watermark across pages with custom angle and opacity', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('add-watermark', [doc], {
      watermarkText: 'CONFIDENTIAL AUDIT',
      angle: '45',
      opacity: '0.3',
    });

    assert.equal(result.success, true);
    assert.equal(result.totalPages, 3);
    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.equal(loaded.getPageCount(), 3);
  });

  it('executes crop-pdf and updates cropBox coordinates', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('crop-pdf', [doc], {
      cropPreset: 'moderate',
    });

    assert.equal(result.success, true);
    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    const pages = loaded.getPages();
    const cropBox = pages[0].getCropBox();
    assert.equal(cropBox.x, 36);
    assert.equal(cropBox.y, 36);
  });

  it('executes edit-pdf and applies annotation stamps', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('edit-pdf', [doc], {
      annotationText: 'APPROVED BY QA',
      position: 'top-right',
      showBox: 'true',
    });

    assert.equal(result.success, true);
    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.equal(loaded.getPageCount(), 3);
  });

  it('executes pdf-forms flatten operation', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('pdf-forms', [doc], {
      formAction: 'flatten',
    });

    assert.equal(result.success, true);
    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.equal(loaded.getPageCount(), 3);
  });

  it('executes pdf-to-pdfa and embeds ISO archival XMP metadata packet', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('pdf-to-pdfa', [doc], {
      conformanceLevel: '1B',
    });

    assert.equal(result.success, true);
    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    const metadataRef = loaded.catalog.get(PDFName.of('Metadata'));
    assert.ok(metadataRef, 'Catalog must contain Metadata reference');
    const metadataStream = loaded.context.lookup(metadataRef);
    assert.ok(metadataStream, 'Metadata stream must exist in PDF context');
    const decodedStream = decodePDFRawStream(metadataStream);
    const xmpText = new TextDecoder('utf-8').decode(decodedStream.getBytes());
    assert.match(xmpText, /pdfaid:part/, 'Must contain PDF/A ISO part identifier');
    assert.match(xmpText, /pdfaid:conformance/, 'Must contain PDF/A ISO conformance identifier');
  });

  it('executes sign-pdf and applies verified signature badge', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    const result = await executeAdapter('sign-pdf', [doc], {
      signerName: 'Jane Doe, QA Lead',
      signReason: 'approved',
      targetPage: 'last',
    });

    assert.equal(result.success, true);
    const loaded = await PDFDocument.load(await result.blob.arrayBuffer());
    assert.equal(loaded.getPageCount(), 3);
  });

  it('resiliently handles unicode, emoji, and smart typography in watermark and sign-pdf', async () => {
    const doc = loadTestPdf('sample_report.pdf');

    // Test emoji and unicode watermark
    const watermarkResult = await executeAdapter('add-watermark', [doc], {
      watermarkText: 'CONFIDENTIAL 🚀 • “DRAFT” — 2026',
    });
    assert.equal(watermarkResult.success, true);

    // Test emoji in signer name
    const signResult = await executeAdapter('sign-pdf', [doc], {
      signerName: 'Dr. Müller ✍️ (QA lead)',
      signReason: 'verified',
    });
    assert.equal(signResult.success, true);
  });
});

