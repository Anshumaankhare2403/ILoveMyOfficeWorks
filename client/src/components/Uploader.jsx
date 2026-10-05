import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileWarning, Loader2, Plus, Sparkles } from 'lucide-react';
import { inspectPdfFile, MAX_FILE_SIZE } from '../utils/pdf-magic';

export default function Uploader({ onFilesAdded, compact = false }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);

  const onDrop = async (acceptedFiles, rejectedFiles) => {
    setErrorNotice(null);

    if (rejectedFiles && rejectedFiles.length > 0) {
      const firstRejection = rejectedFiles[0];
      if (firstRejection.file.size > MAX_FILE_SIZE) {
        setErrorNotice('One or more files exceed the 200MB size limit.');
      } else {
        setErrorNotice('Only PDF documents are allowed.');
      }
      return;
    }

    if (!acceptedFiles || acceptedFiles.length === 0) return;

    setIsProcessing(true);
    const validItems = [];
    const errors = [];

    for (const file of acceptedFiles) {
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

    setIsProcessing(false);

    if (errors.length > 0) {
      setErrorNotice(errors.join(' | '));
    }

    if (validItems.length > 0) {
      onFilesAdded(validItems);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  if (compact) {
    return (
      <div
        {...getRootProps()}
        className={`flex items-center justify-center gap-2 p-4 border border-dashed rounded-2xl cursor-pointer transition-all ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 scale-[0.99]'
            : 'border-slate-800 hover:border-indigo-500/60 bg-slate-900/60 hover:bg-slate-900/90 text-slate-300'
        }`}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
        ) : (
          <Plus className="w-5 h-5 text-indigo-400" />
        )}
        <span className="text-sm font-medium">
          {isProcessing ? 'Inspecting PDF files...' : 'Add more PDF files (no limit)'}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: 1.008 }}
        whileTap={{ scale: 0.995 }}
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-10 md:p-14 text-center cursor-pointer transition-all duration-300 backdrop-blur-xl ${
          isDragActive
            ? 'border-indigo-400 bg-indigo-600/15 shadow-2xl shadow-indigo-500/20'
            : 'border-slate-800 hover:border-indigo-500/60 bg-slate-900/70 hover:bg-slate-900/90 shadow-xl'
        }`}
      >
        <input {...getInputProps()} />

        {/* Ambient glow behind icon */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              {isProcessing ? (
                <Loader2 className="w-9 h-9 animate-spin" />
              ) : (
                <UploadCloud className="w-9 h-9" />
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {isDragActive ? 'Drop your PDF files here' : 'Drop your PDF documents here'}
            </h3>
            <p className="text-sm text-slate-400 mt-1.5">
              or click to browse from your computer • Unlimited files supported
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="bg-slate-800/80 border border-slate-700/80 text-indigo-300 px-3 py-1 rounded-full font-mono font-medium">
              .PDF
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Max 200MB per file</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3" /> 100% Client-Side Private
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
            className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm rounded-2xl flex items-center gap-3"
          >
            <FileWarning className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errorNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
