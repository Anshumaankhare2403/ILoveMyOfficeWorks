import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Files,
  Trash2,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import ThreeCanvas from './components/ThreeCanvas';
import Uploader from './components/Uploader';
import FileCard from './components/FileCard';
import OperationBar from './components/OperationBar';

export default function App() {
  const [files, setFiles] = useState([]);

  const handleFilesAdded = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAll = () => {
    setFiles([]);
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

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      {/* Interactive 3D Ambient Canvas Background */}
      <ThreeCanvas />

      {/* Top Navigation / Header */}
      <header className="relative z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 py-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-md opacity-40" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-indigo-100" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  My Office Works
                </h1>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Phase 1: PDF Merger
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personal Local PDF Toolkit • Zero Cloud
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 border border-slate-700/60 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Private (Localhost Only)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
        {files.length === 0 ? (
          <div className="max-w-2xl mx-auto my-auto py-10 w-full">
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3"
              >
                <Layers className="w-3.5 h-3.5" />
                Unlimited Multi-PDF Merger
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              >
                Merge Any Number of PDFs Instantly
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 text-sm sm:text-base mt-2 max-w-lg mx-auto"
              >
                Drag and drop your documents. Reorder them effortlessly. Merge them with zero file count limits directly in your browser.
              </motion.p>
            </div>

            <Uploader onFilesAdded={handleFilesAdded} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Files className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Loaded Documents ({files.length})
                  </h2>
                  <p className="text-xs text-slate-400">
                    Use arrows to arrange the merge sequence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear queue</span>
                </button>
              </div>
            </div>

            {/* Split layout: Files on left/top, Operations on right/bottom */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* File list column */}
              <div className="lg:col-span-7 space-y-3">
                <AnimatePresence>
                  {files.map((fileItem, idx) => (
                    <FileCard
                      key={fileItem.id}
                      fileItem={fileItem}
                      index={idx}
                      totalFiles={files.length}
                      onRemove={handleRemoveFile}
                      onMoveUp={handleMoveUp}
                      onMoveDown={handleMoveDown}
                    />
                  ))}
                </AnimatePresence>

                {/* Compact dropzone to append more files */}
                <Uploader onFilesAdded={handleFilesAdded} compact={true} />
              </div>

              {/* Dynamic Operations & Adapter column */}
              <div className="lg:col-span-5 sticky top-24">
                <OperationBar files={files} onReset={handleClearAll} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>My Office Works Engine Ready • No Cloud Uploads</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Phase 1 • Adapter Registry Pattern
          </div>
        </div>
      </footer>
    </div>
  );
}
