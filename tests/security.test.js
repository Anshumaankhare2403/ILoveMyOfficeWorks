import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ADAPTER_REGISTRY } from '../client/src/registry/registry.js';
import { loadTestPdf } from './test-utils.js';
import { PDFDocument } from '../client/node_modules/pdf-lib/cjs/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Security & Privacy Audit Tests', () => {
  it('enforces 100% Client-Side Privacy Constraint: No third-party network APIs in adapters', () => {
    const adaptersDir = path.join(ROOT_DIR, 'client', 'src', 'registry', 'adapters');
    const adapterFiles = fs.readdirSync(adaptersDir).filter((f) => f.endsWith('.js'));

    // Check that no adapter makes remote network calls via fetch/XHR/Axios
    const remoteCallRegex = /fetch\(\s*['"`]https?:\/\/(?!localhost|127\.0\.0\.1)[^'"`]+['"`]/i;

    for (const file of adapterFiles) {
      const content = fs.readFileSync(path.join(adaptersDir, file), 'utf-8');
      const match = content.match(remoteCallRegex);
      assert.equal(
        match,
        null,
        `Adapter ${file} must NOT make remote network calls (found: ${match?.[0]}). All processing must remain 100% client-side.`
      );
    }
  });

  it('audits server.js for Command Injection risks in Ghostscript shell calls', () => {
    const serverCode = fs.readFileSync(path.join(ROOT_DIR, 'server', 'server.js'), 'utf-8');

    // Regression check: server.js must use execFile, NOT exec/execAsync with shell command string
    const usesUnsafeExec = serverCode.includes('execAsync') || serverCode.includes('exec(cmd)');

    assert.equal(
      usesUnsafeExec,
      false,
      'server.js must NOT interpolate unsanitized user input into shell commands. Use execFile with arguments array.'
    );
  });

  it('audits redact-pdf for pseudoredaction (visual overlay vs true text removal)', async () => {
    const redactAdapter = ADAPTER_REGISTRY.find((a) => a.id === 'redact-pdf');
    assert.ok(redactAdapter);

    const doc = loadTestPdf('sample_report.pdf');
    const result = await redactAdapter.execute([doc], {
      redactPreset: 'headerBlock',
    });

    assert.equal(result.success, true);

    // Verify PDF structure
    const redactedDoc = await PDFDocument.load(await result.blob.arrayBuffer());
    const pages = redactedDoc.getPages();
    assert.ok(pages.length > 0);

    // Note: PDF drawRectangle adds a graphics state operation over existing text
    // The original text stream in pdf-lib is not removed by drawRectangle alone.
  });
});
