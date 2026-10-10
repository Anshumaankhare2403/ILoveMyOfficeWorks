import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Temp upload directory
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Multer storage with 200MB limit
const upload = multer({
  dest: tempDir,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
});

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

/**
 * Detect Ghostscript executable on system (Windows/Linux/Mac)
 */
async function getGhostscriptCmd() {
  const candidates = ['gswin64c', 'gswin32c', 'gs'];
  for (const cmd of candidates) {
    try {
      await execFileAsync(cmd, ['--version'], { timeout: 5000 });
      return cmd;
    } catch {
      // not found, try next
    }
  }
  return null;
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const gsCmd = await getGhostscriptCmd();
  res.json({
    status: 'ok',
    port: PORT,
    ghostscriptAvailable: Boolean(gsCmd),
    ghostscriptCommand: gsCmd,
  });
});

/**
 * Compress PDF endpoint via Ghostscript
 * Setting presets:
 * - 'screen': lowest resolution (72 dpi), maximum compression
 * - 'ebook': medium resolution (150 dpi), balanced
 * - 'printer': high resolution (300 dpi), light compression
 */
app.post('/api/compress', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded.' });
  }

  const inputPath = req.file.path;
  const safeId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const outputPath = path.join(tempDir, `compressed_${safeId}.pdf`);
  const level = req.body.level || 'ebook'; // /screen, /ebook, /printer

  const gsSetting =
    level === 'extreme' ? '/screen' : level === 'light' ? '/printer' : '/ebook';

  const gsCmd = await getGhostscriptCmd();

  if (!gsCmd) {
    // Clean up input file
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    return res.status(503).json({
      error: 'Ghostscript is not installed on the host machine. Use client-side engine instead.',
      fallbackAvailable: true,
    });
  }

  try {
    const args = [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      `-dPDFSETTINGS=${gsSetting}`,
      '-dNOPAUSE',
      '-dQUIET',
      '-dBATCH',
      `-sOutputFile=${outputPath}`,
      inputPath,
    ];

    await execFileAsync(gsCmd, args, { timeout: 30000 });

    if (!fs.existsSync(outputPath)) {
      throw new Error('Ghostscript did not produce output file.');
    }

    const compressedBuffer = fs.readFileSync(outputPath);

    // Sanitize output file name for Content-Disposition header
    const safeOriginalName = path
      .basename(req.file.originalname || 'document.pdf')
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    // Set download headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="compressed_${safeOriginalName}"`
    );
    res.setHeader('X-Original-Size', req.file.size);
    res.setHeader('X-Compressed-Size', compressedBuffer.length);

    res.send(compressedBuffer);
  } catch (err) {
    res.status(500).json({ error: `Compression failed: ${err.message}` });
  } finally {
    // Always delete temp files after response
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch {
      // ignore cleanup errors
    }
  }
});

/**
 * Encrypt PDF endpoint via Ghostscript
 */
app.post('/api/protect', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded.' });
  }

  const inputPath = req.file.path;
  const safeId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const outputPath = path.join(tempDir, `protected_${safeId}.pdf`);
  const password = String(req.body.password || '123456').slice(0, 128);
  const gsCmd = await getGhostscriptCmd();

  if (!gsCmd) {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    return res.status(503).json({
      error: 'Ghostscript is not installed on the host machine.',
      fallbackAvailable: true,
    });
  }

  try {
    const args = [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      `-sOwnerPassword=${password}`,
      `-sUserPassword=${password}`,
      '-dPermissions=-4',
      '-dNOPAUSE',
      '-dQUIET',
      '-dBATCH',
      `-sOutputFile=${outputPath}`,
      inputPath,
    ];

    await execFileAsync(gsCmd, args, { timeout: 30000 });

    if (!fs.existsSync(outputPath)) {
      throw new Error('Ghostscript did not produce protected file.');
    }

    const protectedBuffer = fs.readFileSync(outputPath);
    const safeOriginalName = path
      .basename(req.file.originalname || 'document.pdf')
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="protected_${safeOriginalName}"`
    );
    res.send(protectedBuffer);
  } catch (err) {
    res.status(500).json({ error: `Encryption failed: ${err.message}` });
  } finally {
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch {}
  }
});

// Error handling middleware for Multer file size / format errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
  next();
});

export { app };
export default app;

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  app.listen(PORT, () => {
    console.log(`[ILoveMyOfficeWorks Server] Running on http://localhost:${PORT}`);
  });
}
