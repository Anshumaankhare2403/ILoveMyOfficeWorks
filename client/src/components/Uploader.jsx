import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileWarning, Loader2, Plus, Sparkles } from 'lucide-react';
import { inspectPdfFile, MAX_FILE_SIZE } from '../utils/pdf-magic';

export default function Uploader({ onFilesAdded, compact = false }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [errorNotice, setErrorNotice] = useState(null);

  const onDrop = async (acceptedFiles, rejectedFiles) => {
    setErrorNotice(null);

    if (rejectedFiles && rejectedFiles.length > 0) {
      const firstRejection = rejectedFiles[0];
      if (firstRejection.file.size > MAX_FILE_SIZE) {
        setErrorNotice('One or more files exceed the 200MB size limit.');
      } else {
        setErrorNotice('Unsupported file format. Please upload PDF, images, or Office documents.');
      }
      return;
    }

    if (!acceptedFiles || acceptedFiles.length === 0) return;

    setIsProcessing(true);
    const validItems = [];
    const errors = [];
    const total = acceptedFiles.length;

    // Process in non-blocking batches of 50 for smooth 60fps UI with 1,000+ files
    const batchSize = 50;
    for (let i = 0; i < total; i += batchSize) {
      const chunk = acceptedFiles.slice(i, i + batchSize);
      for (const file of chunk) {
        try {
          const inspected = await inspectPdfFile(file);
          validItems.push({
            id: `${file.name}-${file.lastModified}-${Math.random().toString(36).substring(2, 9)}`,
            ...inspected,
          });
        } catch (err) {
          errors.push(`${file.name}: ${err.message}`);
        }
      }

      if (total > batchSize) {
        setStatusText(`Loading ${Math.min(i + batchSize, total)} of ${total} files...`);
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    setIsProcessing(false);
    setStatusText('');

    if (errors.length > 0) {
      setErrorNotice(
        errors.slice(0, 3).join(' | ') +
          (errors.length > 3 ? ` (+${errors.length - 3} more errors)` : '')
      );
    }

    if (validItems.length > 0) {
      onFilesAdded(validItems);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/html': ['.html', '.htm'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  if (compact) {
    return (
      <div
        {...getRootProps()}
        className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
          isDragActive
            ? 'border-[#5B7147] bg-[#5B7147]/10 text-[#3A4A2C] scale-[0.99]'
            : 'border-[#DDD3C2] hover:border-[#5B7147] bg-white/80 hover:bg-white text-[#4A573E] shadow-sm'
        }`}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin text-[#5B7147]" />
        ) : (
          <Plus className="w-5 h-5 text-[#5B7147]" />
        )}
        <span className="text-sm font-semibold">
          {isProcessing ? (statusText || 'Inspecting files...') : 'Add more files (PDF, images, documents)'}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: 1.006 }}
        whileTap={{ scale: 0.995 }}
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 backdrop-blur-xl ${
          isDragActive
            ? 'border-[#5B7147] bg-[#5B7147]/10 shadow-xl shadow-[#5B7147]/15'
            : 'border-[#DDD3C2] hover:border-[#5B7147] bg-white/85 hover:bg-white shadow-md shadow-[#E2D9C8]/40'
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[#5B7147] rounded-2xl blur-xl opacity-20 animate-pulse" />
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#5B7147] via-[#657E4E] to-[#435433] text-white flex items-center justify-center shadow-lg shadow-[#5B7147]/25">
              {isProcessing ? (
                <Loader2 className="w-8 h-8 sm:w-9 sm:h-9 animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8 sm:w-9 sm:h-9" />
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#262D20] tracking-tight">
              {isProcessing
                ? (statusText || 'Inspecting files...')
                : isDragActive
                ? 'Drop your files here'
                : 'Drop your documents or images here'}
            </h3>
            <p className="text-xs sm:text-sm text-[#616D54] mt-1.5">
              or click to browse from your computer • Unlimited 1,000+ files supported
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="bg-[#FAF8F4] border border-[#DDD3C2] text-[#4E5941] px-3 py-1 rounded-full font-mono font-medium">
              PDF • JPG • PNG • DOCX
            </span>
            <span className="text-[#BDC8B3]">•</span>
            <span className="text-[#6B785E]">Max 200MB per file</span>
            <span className="text-[#BDC8B3]">•</span>
            <span className="text-[#4A583A] flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#5B7147]" /> 100% Private & Local
            </span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {errorNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-2xl flex items-center gap-3 shadow-sm"
          >
            <FileWarning className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
