import { useState, useMemo } from 'react';
import { inspectPdfFile } from '../utils/pdf-magic';

export const PAGE_SIZE = 30;

/**
 * Custom hook to manage the document queue, sorting, pagination, and type counts
 */
export function useDocumentQueue(setActiveTab) {
  const [files, setFiles] = useState([]);
  const [queuePage, setQueuePage] = useState(1);

  const handleFilesAdded = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Convert raw base64 desktop/mobile files
  const importRawFiles = async (rawFiles) => {
    if (!rawFiles || rawFiles.length === 0) return;
    const validItems = [];
    for (const rf of rawFiles) {
      try {
        const binaryStr = atob(rf.data);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: rf.type });
        const file = new File([blob], rf.name, { type: rf.type, lastModified: Date.now() });
        const inspected = await inspectPdfFile(file);
        validItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          ...inspected,
        });
      } catch (err) {
        console.error('Failed to import raw file:', rf.name, err);
      }
    }
    if (validItems.length > 0) {
      setFiles((prev) => [...prev, ...validItems]);
      if (setActiveTab) {
        if (validItems.length === 1) {
          setActiveTab('split');
        } else {
          setActiveTab('merge');
        }
      }
    }
  };

  const handleHomeQuickUpload = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
    if (!setActiveTab) return;
    if (newFiles.length === 1) {
      if (newFiles[0].isImage) {
        setActiveTab('compress-image');
      } else {
        setActiveTab('split');
      }
    } else {
      const allImages = newFiles.every((f) => f.isImage);
      if (allImages) {
        setActiveTab('merge-images');
      } else {
        setActiveTab('merge');
      }
    }
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAll = () => {
    setFiles([]);
    setQueuePage(1);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setFiles((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index) => {
    if (index === files.length - 1) return;
    setFiles((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleSortAscending = () => {
    setFiles((prev) => [...prev].sort((a, b) => (a.name || '').localeCompare(b.name || '')));
  };

  const handleSortDescending = () => {
    setFiles((prev) => [...prev].sort((a, b) => (b.name || '').localeCompare(a.name || '')));
  };

  const handleReverseOrder = () => {
    setFiles((prev) => [...prev].reverse());
  };

  // Compute file counts by format/tool compatibility
  const fileCounts = useMemo(() => {
    const pdfCount = files.filter((f) => f.isPdf).length;
    const imageCount = files.filter((f) => f.isImage).length;
    const docxCount = files.filter((f) => (f.name || '').toLowerCase().endsWith('.docx')).length;
    const pptxCount = files.filter((f) => (f.name || '').toLowerCase().endsWith('.pptx')).length;
    const spreadsheetCount = files.filter((f) =>
      ['.csv', '.xlsx', '.xls', '.txt'].some((ext) => (f.name || '').toLowerCase().endsWith(ext))
    ).length;
    const htmlCount = files.filter((f) =>
      ['.html', '.htm', '.txt'].some((ext) => (f.name || '').toLowerCase().endsWith(ext))
    ).length;

    return {
      merge: files.length,
      'merge-pdf': files.length,
      split: pdfCount,
      'split-pdf': pdfCount,
      'remove-pages': pdfCount,
      'extract-pages': pdfCount,
      'organize-pdf': pdfCount,
      'scan-to-pdf': imageCount,
      compress: pdfCount,
      'compress-pdf': pdfCount,
      'repair-pdf': pdfCount,
      'ocr-pdf': pdfCount,
      'jpg-to-pdf': imageCount,
      'word-to-pdf': docxCount,
      'powerpoint-to-pdf': pptxCount,
      'excel-to-pdf': spreadsheetCount,
      'html-to-pdf': htmlCount,
      'pdf-to-jpg': pdfCount,
      docx: pdfCount,
      'pdf-to-docx': pdfCount,
      'pdf-to-powerpoint': pdfCount,
      'pdf-to-excel': pdfCount,
      'pdf-to-pdfa': pdfCount,
      'rotate-pdf': pdfCount,
      'add-page-numbers': pdfCount,
      'add-watermark': pdfCount,
      'crop-pdf': pdfCount,
      'edit-pdf': pdfCount,
      'pdf-forms': pdfCount,
      'unlock-pdf': pdfCount,
      'protect-pdf': pdfCount,
      'sign-pdf': pdfCount,
      'redact-pdf': pdfCount,
      'compare-pdf': pdfCount,
      'merge-images': imageCount,
      'compress-image': imageCount,
      'resize-image': imageCount,
      'crop-image': imageCount,
      'convert-to-jpg': imageCount,
    };
  }, [files]);

  return {
    files,
    setFiles,
    queuePage,
    setQueuePage,
    PAGE_SIZE,
    fileCounts,
    handleFilesAdded,
    importRawFiles,
    handleHomeQuickUpload,
    handleRemoveFile,
    handleClearAll,
    handleMoveUp,
    handleMoveDown,
    handleSortAscending,
    handleSortDescending,
    handleReverseOrder,
  };
}
