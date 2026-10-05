import { compressStructural, compressCanvasRaster } from '../../utils/pdf-compressor-engine';

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
        { value: 'recommended', label: 'Balanced (Smart Hybrid — High Quality & Great Size)' },
        { value: 'extreme', label: 'Extreme (Maximum Size Reduction — Scans & Images)' },
        { value: 'light', label: 'Lossless Vector (Preserve Exact Text & Vector Paths)' },
      ],
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
        onProgress(20, 'Connecting to local Node.js backend (localhost:3001)...');
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
          onProgress(25, 'Ghostscript not available. Using In-Browser Canvas Engine...');
        }
      } catch (backendErr) {
        console.warn('Backend offline, using browser engine:', backendErr.message);
        onProgress(25, 'Backend offline. Using In-Browser Canvas Engine...');
      }
    }

    // In-Browser High-Performance Compression Pipeline
    onProgress(10, `Analyzing "${targetFile.name}"...`);

    let finalBytes = null;
    let finalPageCount = targetFile.pageCount || 1;
    let methodUsed = 'In-Browser Stream Packing';

    if (level === 'light') {
      // Pure lossless vector compression (object stream grouping & metadata strip)
      onProgress(35, 'Performing lossless object stream optimization...');
      const structRes = await compressStructural(targetFile.arrayBuffer, 'light');
      finalBytes = structRes.bytes;
      finalPageCount = structRes.pageCount;
      methodUsed = 'Lossless Vector Optimization';
    } else if (level === 'extreme') {
      // Extreme raster downsampling for massive savings
      onProgress(25, 'Applying aggressive canvas image downsampling (100 DPI, JPEG 0.55)...');
      try {
        const rasterRes = await compressCanvasRaster(
          targetFile.arrayBuffer,
          1.1, // Scale ~100 DPI
          0.55, // JPEG quality
          onProgress
        );
        finalBytes = rasterRes.bytes;
        finalPageCount = rasterRes.pageCount;
        methodUsed = 'Extreme Canvas Downsampling';
      } catch (rasterErr) {
        console.warn('Canvas rasterization fallback to structural:', rasterErr);
        const structRes = await compressStructural(targetFile.arrayBuffer, 'extreme');
        finalBytes = structRes.bytes;
        finalPageCount = structRes.pageCount;
      }
    } else {
      // 'recommended' - Smart Hybrid
      onProgress(20, 'Evaluating structural optimization...');
      const structRes = await compressStructural(targetFile.arrayBuffer, 'recommended');
      const structSavings = (originalSize - structRes.bytes.length) / originalSize;

      // If structural alone yields >= 15% savings, use it to keep vectors intact
      if (structSavings >= 0.15) {
        finalBytes = structRes.bytes;
        finalPageCount = structRes.pageCount;
        methodUsed = 'Object Stream Compaction';
      } else {
        // Large scan/image document: apply high-quality raster compression
        onProgress(30, 'Document contains uncompressed raster assets. Downsampling images...');
        try {
          const rasterRes = await compressCanvasRaster(
            targetFile.arrayBuffer,
            1.4, // Scale ~140 DPI
            0.72, // JPEG quality
            onProgress
          );

          // Use raster only if it actually reduced the file size
          if (rasterRes.bytes.length < originalSize) {
            finalBytes = rasterRes.bytes;
            finalPageCount = rasterRes.pageCount;
            methodUsed = 'Smart Image Downsampling';
          } else {
            finalBytes = structRes.bytes;
            finalPageCount = structRes.pageCount;
            methodUsed = 'Object Stream Compaction';
          }
        } catch (rasterErr) {
          console.warn('Canvas raster error, using structural result:', rasterErr);
          finalBytes = structRes.bytes;
          finalPageCount = structRes.pageCount;
        }
      }
    }

    // Safety guard: if result is somehow larger than original, protect user by keeping original or best
    let compressedSize = finalBytes.length;
    let savingsBytes = Math.max(0, originalSize - compressedSize);
    let savingsPercent =
      originalSize > 0 ? Math.max(0, Math.round((savingsBytes / originalSize) * 100)) : 0;

    let blob;
    if (compressedSize > originalSize) {
      // Document was already at maximum possible compression
      blob = new Blob([targetFile.arrayBuffer], { type: 'application/pdf' });
      compressedSize = originalSize;
      savingsBytes = 0;
      savingsPercent = 0;
      methodUsed = 'Already Optimized (Original Kept)';
    } else {
      blob = new Blob([finalBytes], { type: 'application/pdf' });
    }

    onProgress(100, 'Compression completed successfully!');

    return {
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename,
      originalSize,
      compressedSize,
      savingsBytes,
      savingsPercent,
      totalPages: finalPageCount,
      engineUsed: methodUsed,
    };
  },
};

export default compressPdfAdapter;
