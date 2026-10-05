import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Files,
  Trash2,
  Layers,
  Scissors,
  Minimize2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import ThreeCanvas from './components/ThreeCanvas';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import HomeScreen from './components/HomeScreen';
import Uploader from './components/Uploader';
import FileCard from './components/FileCard';
import OperationBar from './components/OperationBar';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Application Error caught by boundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-6 text-center text-[#262D20]">
          <div className="w-16 h-16 rounded-2xl bg-[#8B9A6E]/15 text-[#55603F] flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[#8B9A6E]" />
          </div>
          <h2 className="text-xl font-bold mb-2">Something unexpected happened</h2>
          <p className="text-xs text-[#6B785E] max-w-md mb-6">{this.state.error?.message || 'Unknown error'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-[#8B9A6E] text-white text-sm font-bold shadow-md"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'merge' | 'split' | 'compress'
  const [files, setFiles] = useState([]);

  // Handles adding files from any uploader
  const handleFilesAdded = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Handles quick drop from the home screen
  const handleHomeQuickUpload = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
    if (newFiles.length === 1) {
      setActiveTab('split');
    } else {
      setActiveTab('merge');
    }
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
    <div className="relative min-h-screen bg-[#FAF8F4] text-[#262D20] flex flex-col selection:bg-[#8B9A6E] selection:text-white font-sans overflow-x-hidden">
      {/* Splash Screen on Initial Load */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Interactive 3D Ambient Canvas Background */}
      <ThreeCanvas />

      {/* Top Header / Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        fileCounts={{
          merge: files.length,
          split: files.length,
          compress: files.length,
        }}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <HomeScreen
                onSelectTool={(toolId) => setActiveTab(toolId)}
                onQuickUpload={handleHomeQuickUpload}
                fileCounts={{
                  merge: files.length,
                  split: files.length,
                  compress: files.length,
                }}
              />
            </motion.div>
          )}

          {activeTab === 'merge' && (
            <motion.div
              key="merge"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Tool Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B9A6E] to-[#6F7D53] text-white flex items-center justify-center shadow-md shadow-[#8B9A6E]/20">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-[#262D20]">
                        PDF Merger
                      </h2>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#8B9A6E]/15 text-[#4E593D] border border-[#8B9A6E]/30">
                        Unlimited Files
                      </span>
                    </div>
                    <p className="text-xs text-[#6B785E]">
                      Combine multiple PDF documents sequentially with custom page ordering
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="text-xs text-[#55603F] hover:text-[#262D20] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DDD3C4] hover:border-[#8B9A6E] shadow-sm transition-all font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
              </div>

              {files.length === 0 ? (
                <div className="max-w-xl mx-auto py-10">
                  <div className="text-center mb-6">
                    <p className="text-sm text-[#6B785E]">
                      Upload 2 or more PDF documents to merge them into a single file.
                    </p>
                  </div>
                  <Uploader onFilesAdded={handleFilesAdded} />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* File Queue Toolbar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#262D20]">
                      <Files className="w-4 h-4 text-[#8B9A6E]" />
                      <span>Document Queue ({files.length})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-xs text-[#717E64] hover:text-rose-600 flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-50 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear all</span>
                    </button>
                  </div>

                  {/* Responsive grid: Left side list, Right side operations */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7 space-y-3 order-2 lg:order-1">
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

                      <Uploader onFilesAdded={handleFilesAdded} compact={true} />
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24">
                      <OperationBar
                        files={files}
                        onReset={handleClearAll}
                        activeToolId="merge-pdf"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'split' && (
            <motion.div
              key="split"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Tool Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#98A87D] to-[#718055] text-white flex items-center justify-center shadow-md shadow-[#8B9A6E]/20">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-[#262D20]">
                        PDF Splitter
                      </h2>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#8B9A6E]/15 text-[#4E593D] border border-[#8B9A6E]/30">
                        Ranges & Chunks
                      </span>
                    </div>
                    <p className="text-xs text-[#6B785E]">
                      Break PDFs into separate files by page range or every N pages
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="text-xs text-[#55603F] hover:text-[#262D20] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DDD3C4] hover:border-[#8B9A6E] shadow-sm transition-all font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
              </div>

              {files.length === 0 ? (
                <div className="max-w-xl mx-auto py-10">
                  <div className="text-center mb-6">
                    <p className="text-sm text-[#6B785E]">
                      Upload a PDF document to split it into multiple parts.
                    </p>
                  </div>
                  <Uploader onFilesAdded={handleFilesAdded} />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* File Queue Toolbar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#262D20]">
                      <Files className="w-4 h-4 text-[#8B9A6E]" />
                      <span>Target Document (Primary: #{1} {files[0].name})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-xs text-[#717E64] hover:text-rose-600 flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-50 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear all</span>
                    </button>
                  </div>

                  {/* Responsive grid: Left side list, Right side operations */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7 space-y-3 order-2 lg:order-1">
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

                      <Uploader onFilesAdded={handleFilesAdded} compact={true} />
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24">
                      <OperationBar
                        files={files}
                        onReset={handleClearAll}
                        activeToolId="split-pdf"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'compress' && (
            <motion.div
              key="compress"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Tool Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6E7C52] to-[#55603F] text-white flex items-center justify-center shadow-md shadow-[#8B9A6E]/20">
                    <Minimize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-[#262D20]">
                        PDF Compressor
                      </h2>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#8B9A6E]/15 text-[#4E593D] border border-[#8B9A6E]/30">
                        Object Streams & Ghostscript
                      </span>
                    </div>
                    <p className="text-xs text-[#6B785E]">
                      Shrink PDF file size with stream compression, metadata stripping, and quality presets
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('home')}
                  className="text-xs text-[#55603F] hover:text-[#262D20] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DDD3C4] hover:border-[#8B9A6E] shadow-sm transition-all font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Home</span>
                </button>
              </div>

              {files.length === 0 ? (
                <div className="max-w-xl mx-auto py-10">
                  <div className="text-center mb-6">
                    <p className="text-sm text-[#6B785E]">
                      Upload a PDF document to compress and optimize its file size.
                    </p>
                  </div>
                  <Uploader onFilesAdded={handleFilesAdded} />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* File Queue Toolbar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#262D20]">
                      <Files className="w-4 h-4 text-[#8B9A6E]" />
                      <span>Target Document (Primary: #{1} {files[0].name})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-xs text-[#717E64] hover:text-rose-600 flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-50 font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear all</span>
                    </button>
                  </div>

                  {/* Responsive grid: Left side list, Right side operations */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7 space-y-3 order-2 lg:order-1">
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

                      <Uploader onFilesAdded={handleFilesAdded} compact={true} />
                    </div>

                    <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24">
                      <OperationBar
                        files={files}
                        onReset={handleClearAll}
                        activeToolId="compress-pdf"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E8E1D5] bg-[#FAF8F4]/90 backdrop-blur-md py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#738067] text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B9A6E] animate-pulse" />
            <span>ILoveMyOfficeWorks Engine Ready • 100% Client-Side</span>
          </div>
          <div className="font-mono text-[11px] text-[#616E53]">
            Personal PDF Toolkit • Localhost
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
