import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const TEST_FILES_DIR = path.resolve(ROOT_DIR, 'test_files');

// We test against http://localhost:3001 if running, or launch a server instance on test port
const TEST_PORT = 3002;
let serverProcess = null;
let baseUrl = `http://localhost:${TEST_PORT}`;

describe('Backend Server API & Ghostscript Bridge Tests', () => {
  let app;
  let server;

  before(async () => {
    const serverModule = await import('../server/server.js');
    app = serverModule.app || serverModule.default;

    // Start on test port
    await new Promise((resolve) => {
      server = app.listen(TEST_PORT, () => {
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('GET /api/health returns ok status and Ghostscript availability state', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
    assert.equal(typeof body.ghostscriptAvailable, 'boolean');
  });

  it('POST /api/compress rejects requests missing file with 400 Bad Request', async () => {
    const formData = new FormData();
    formData.append('level', 'extreme');

    const res = await fetch(`${baseUrl}/api/compress`, {
      method: 'POST',
      body: formData,
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /No PDF file uploaded/);
  });

  it('POST /api/protect rejects requests missing file with 400 Bad Request', async () => {
    const formData = new FormData();
    formData.append('password', 'secret123');

    const res = await fetch(`${baseUrl}/api/protect`, {
      method: 'POST',
      body: formData,
    });

    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /No PDF file uploaded/);
  });

  it('POST /api/compress handles Ghostscript unavailability with 503 fallback indicator', async () => {
    const samplePdf = fs.readFileSync(path.join(TEST_FILES_DIR, 'sample_report.pdf'));
    const formData = new FormData();
    formData.append('file', new Blob([samplePdf], { type: 'application/pdf' }), 'report.pdf');
    formData.append('level', 'ebook');

    const res = await fetch(`${baseUrl}/api/compress`, {
      method: 'POST',
      body: formData,
    });

    // If Ghostscript is not installed, it should return 503 with fallbackAvailable: true
    // If Ghostscript is installed, it returns 200 with application/pdf
    if (res.status === 503) {
      const body = await res.json();
      assert.equal(body.fallbackAvailable, true);
      assert.match(body.error, /Ghostscript/);
    } else {
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('content-type'), 'application/pdf');
    }
  });

  it('POST /api/protect handles Ghostscript unavailability with 503 fallback indicator', async () => {
    const samplePdf = fs.readFileSync(path.join(TEST_FILES_DIR, 'sample_report.pdf'));
    const formData = new FormData();
    formData.append('file', new Blob([samplePdf], { type: 'application/pdf' }), 'report.pdf');
    formData.append('password', 'testpass123');

    const res = await fetch(`${baseUrl}/api/protect`, {
      method: 'POST',
      body: formData,
    });

    if (res.status === 503) {
      const body = await res.json();
      assert.equal(body.fallbackAvailable, true);
    } else {
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('content-type'), 'application/pdf');
    }
  });

  it('verifies temporary uploaded files are cleaned up after request finishes', async () => {
    const samplePdf = fs.readFileSync(path.join(TEST_FILES_DIR, 'sample_report.pdf'));
    const formData = new FormData();
    formData.append('file', new Blob([samplePdf], { type: 'application/pdf' }), 'cleanup_test.pdf');

    await fetch(`${baseUrl}/api/compress`, {
      method: 'POST',
      body: formData,
    });

    // Check server/temp directory
    const tempDir = path.join(ROOT_DIR, 'server', 'temp');
    if (fs.existsSync(tempDir)) {
      const remainingFiles = fs.readdirSync(tempDir).filter((f) => f.includes('cleanup_test'));
      assert.equal(remainingFiles.length, 0, 'No temporary upload files should remain after response');
    }
  });

  it('rejects unsupported HTTP methods gracefully', async () => {
    const res = await fetch(`${baseUrl}/api/health`, { method: 'DELETE' });
    assert.equal(res.status, 404);
  });
});
