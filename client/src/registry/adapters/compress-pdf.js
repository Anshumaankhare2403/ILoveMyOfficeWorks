import { compressPdfWithMasterPipeline } from '../../utils/pdf-compressor-engine';

const compressPdfAdapter = {
  id: 'compress-pdf',
  name: 'Compress PDF',
  description: 'Shrink file size with smart image downsampling, object stream compaction, and metadata purging.',
  badge: 'Active',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 PDF document to compress.',
      };
    }

    const targetFile = files[0];
    if (targetFile.isEncrypted) {
      return {
        valid: false,
        reason: `Cannot compress locked file "${targetFile.name}". Please unlock it first.`,
      };
    }

    return { valid: true };
  },

  options: [
    {
      id: 'compressionLevel',
      label: 'Compression Mode',
      type: 'select',
      default: 'recommended',
      options: [
        {
          value: 'recommended',
          label: 'Balanced (Smart Hybrid — 40-60% Smaller, Crisp Text)',
        },
        {
          value: 'extreme',
          label: 'Extreme (Maximum Reduction — 70-85% Smaller, Scans & Web)',
        },
        {
          value: 'light',
          label: 'Light / High Quality (Crisp Vector Typography & 15-30% Reduction)',
        },
        {
          value: 'custom',
          label: 'Custom Mode (Fine-Tune Quality & Resolution)',
        },
      ],
      hint: (opts) => {
        const lvl = opts.compressionLevel || 'recommended';
        if (lvl === 'extreme') {
          return 'Maximum size reduction for scans, images, and email sharing (crushes file size by 70-85%).';
        }
        if (lvl === 'light') {
          return '100% lossless vector preservation for text and lines. Light image optimization for print and official records.';
        }
        if (lvl === 'custom') {
          return 'Granular control over JPEG image quality and resolution scaling.';
        }
        return 'Recommended for most documents: sharp, readable typography with optimized images and stripped bloat.';
      },
    },
    {
      id: 'customQuality',
      label: 'Image Quality (Custom Mode)',
      type: 'select',
      default: '0.65',
      showWhen: (opts) => opts.compressionLevel === 'custom',
      options: [
        { value: '0.40', label: 'Low Quality (40% — Smallest Size)' },
        { value: '0.65', label: 'Medium Quality (65% — Balanced)' },
        { value: '0.80', label: 'High Quality (80% — Crisp)' },
        { value: '0.90', label: 'Maximum Quality (90% — Near Lossless)' },
      ],
      hint: 'Lower quality produces smaller file sizes; higher quality preserves more image detail.',
    },
    {
      id: 'customScale',
      label: 'Resolution Scale (Custom Mode)',
      type: 'select',
      default: '1.2',
      showWhen: (opts) => opts.compressionLevel === 'custom',
      options: [
        { value: '0.9', label: 'Screen / Web (~65-72 DPI)' },
        { value: '1.2', label: 'Standard Document (~85-100 DPI)' },
        { value: '1.5', label: 'High Definition (~120-150 DPI)' },
      ],
      hint: 'Target rendering scale for downsampling scanned and full-page images.',
    },
    {
      id: 'engine',
      label: 'Compression Engine',
      type: 'select',
      default: 'browser',
      options: [
        { value: 'browser', label: 'In-Browser Engine (Instant & 100% Private)' },
        { value: 'backend', label: 'Local Ghostscript (localhost:3001)' },
      ],
      hint: 'The In-Browser engine runs 100% client-side with zero data leaving your device.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_compressed.pdf',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    if (!files || files.length === 0) {
      throw new Error('No PDF file provided for compression.');
    }

    const targetFile = files[0];
    const originalSize = targetFile.size;
    const level = options.compressionLevel || 'recommended';
    const engine = options.engine || 'browser';

    // Generate intelligent default output name
    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let filename = (options.outputFilename || '').trim();
    if (!filename || filename === 'merged-document.pdf') {
      filename = `${baseName}_compressed.pdf`;
    }
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf';
    }

    // Try Local Node.js Backend (Ghostscript) if requested
    if (engine === 'backend') {
      try {
        onProgress(20, 'Connecting to local Ghostscript backend (localhost:3001)...');
        const formData = new FormData();
        const fileObj =
          targetFile.file ||
          new File([targetFile.arrayBuffer], targetFile.name, {
            type: 'application/pdf',
          });
        formData.append('file', fileObj);
        formData.append('level', level);

        const response = await fetch('http://localhost:3001/api/compress', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          onProgress(85, 'Receiving compressed file from Ghostscript...');
          const compressedBlob = await response.blob();
          const compressedSize = compressedBlob.size;
          const savingsBytes = Math.max(0, originalSize - compressedSize);
          const savingsPercent =
            originalSize > 0 ? Math.round((savingsBytes / originalSize) * 100) : 0;

          onProgress(100, 'Ghostscript compression completed!');

          return {
            blob: compressedBlob,
            downloadUrl: URL.createObjectURL(compressedBlob),
            filename,
            originalSize,
            compressedSize,
            savingsBytes,
            savingsPercent,
            totalPages: targetFile.pageCount,
            engineUsed: 'Local Ghostscript Engine',
          };
        } else {
          console.warn('Backend unavailable, falling back to In-Browser engine.');
          onProgress(25, 'Ghostscript not detected on host. Using In-Browser Engine...');
        }
      } catch (backendErr) {
        console.warn('Backend offline, using browser engine:', backendErr.message);
        onProgress(25, 'Backend offline. Using In-Browser Engine...');
      }
    }

    // In-Browser High-Performance Compression Pipeline
    onProgress(10, `Analyzing "${targetFile.name}"...`);

    let arrayBuffer = targetFile.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetFile.file && targetFile.file.arrayBuffer) {
        arrayBuffer = await targetFile.file.arrayBuffer();
      }
    }

    const result = await compressPdfWithMasterPipeline(
      arrayBuffer,
      options,
      onProgress
    );

    const compressedBlob = new Blob([result.bytes], { type: 'application/pdf' });
    onProgress(100, 'Compression completed successfully!');

    return {
      success: true,
      blob: compressedBlob,
      downloadUrl: URL.createObjectURL(compressedBlob),
      filename,
      fileSize: compressedBlob.size,
      originalSize,
      compressedSize: result.compressedSize,
      savingsBytes: result.savingsBytes,
      savingsPercent: result.savingsPercent,
      totalPages: result.pageCount,
      isPdf: true,
      engineUsed: result.methodUsed,
      files: [
        {
          name: filename,
          blob: compressedBlob,
          type: 'application/pdf',
        },
      ],
    };
  },
};

export default compressPdfAdapter;
