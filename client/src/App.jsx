import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Files,
  Trash2,
  Layers,
  Scissors,
  Minimize2,
  FileText,
  ArrowLeft,
  Sparkles,
  Image,
  Table,
  Presentation,
  Globe,
  Archive,
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

const TOOL_CONFIGS = {
  merge: { id: 'merge-pdf', name: 'PDF Merger', icon: Layers, badge: 'Unlimited Files', desc: 'Combine multiple PDF documents sequentially with custom page ordering', hint: 'Upload 2 or more PDF documents to merge them into a single file.' },
  'merge-pdf': { id: 'merge-pdf', name: 'PDF Merger', icon: Layers, badge: 'Unlimited Files', desc: 'Combine multiple PDF documents sequentially with custom page ordering', hint: 'Upload 2 or more PDF documents to merge them into a single file.' },
  split: { id: 'split-pdf', name: 'PDF Splitter', icon: Scissors, badge: 'Ranges & Chunks', desc: 'Break PDFs into separate files by page range or every N pages', hint: 'Upload a PDF document to split it into multiple parts.' },
  'split-pdf': { id: 'split-pdf', name: 'PDF Splitter', icon: Scissors, badge: 'Ranges & Chunks', desc: 'Break PDFs into separate files by page range or every N pages', hint: 'Upload a PDF document to split it into multiple parts.' },
  compress: { id: 'compress-pdf', name: 'PDF Compressor', icon: Minimize2, badge: 'Object Streams & Canvas', desc: 'Shrink PDF file size with stream compression, metadata stripping, and quality presets', hint: 'Upload a PDF document to compress and optimize its file size.' },
  'compress-pdf': { id: 'compress-pdf', name: 'PDF Compressor', icon: Minimize2, badge: 'Object Streams & Canvas', desc: 'Shrink PDF file size with stream compression, metadata stripping, and quality presets', hint: 'Upload a PDF document to compress and optimize its file size.' },
  docx: { id: 'pdf-to-docx', name: 'PDF to Word (DOCX)', icon: FileText, badge: 'OpenXML Engine', desc: 'Convert PDF documents into fully editable Microsoft Word (.docx) files with typography', hint: 'Upload a PDF document to convert into an editable Word (.docx) file.' },
  'pdf-to-docx': { id: 'pdf-to-docx', name: 'PDF to Word (DOCX)', icon: FileText, badge: 'OpenXML Engine', desc: 'Convert PDF documents into fully editable Microsoft Word (.docx) files with typography', hint: 'Upload a PDF document to convert into an editable Word (.docx) file.' },
  'jpg-to-pdf': { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: Image, badge: 'Image Converter', desc: 'Convert JPG, PNG, and WebP images into a single PDF document with custom margins', hint: 'Upload 1 or more images (JPG, PNG, WebP) to combine into a PDF.' },
  'pdf-to-jpg': { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: Image, badge: 'Image Extractor', desc: 'Convert PDF pages into high-resolution JPG or PNG images and ZIP archive', hint: 'Upload a PDF document to extract pages as images.' },
  'word-to-pdf': { id: 'word-to-pdf', name: 'WORD to PDF', icon: FileText, badge: 'Document Converter', desc: 'Convert Microsoft Word documents (.docx) into clean vector PDF files', hint: 'Upload a Microsoft Word (.docx) file to convert to PDF.' },
  'excel-to-pdf': { id: 'excel-to-pdf', name: 'EXCEL to PDF', icon: Table, badge: 'Spreadsheet Converter', desc: 'Convert Excel spreadsheets and CSV tables into vector PDF documents', hint: 'Upload a spreadsheet or CSV table to convert to PDF.' },
  'pdf-to-excel': { id: 'pdf-to-excel', name: 'PDF to EXCEL', icon: Table, badge: 'Table Extractor', desc: 'Extract tables, rows, invoices, and structured data into Excel CSV format', hint: 'Upload a PDF document with tables to extract to Excel.' },
  'powerpoint-to-pdf': { id: 'powerpoint-to-pdf', name: 'POWERPOINT to PDF', icon: Presentation, badge: 'Slides Converter', desc: 'Convert PowerPoint (.pptx) presentations into landscape PDF slides', hint: 'Upload a PowerPoint (.pptx) presentation to convert to PDF.' },
  'pdf-to-powerpoint': { id: 'pdf-to-powerpoint', name: 'PDF to POWERPOINT', icon: Presentation, badge: 'Slides Generator', desc: 'Convert PDF document pages into PowerPoint presentation slides (.pptx)', hint: 'Upload a PDF document to convert to PowerPoint (.pptx).' },
  'pdf-to-pdfa': { id: 'pdf-to-pdfa', name: 'PDF to PDF/A', icon: Archive, badge: 'ISO Archival', desc: 'Convert PDF documents into ISO-compliant archival PDF/A standard', hint: 'Upload a PDF document to convert to PDF/A archival format.' },
  'html-to-pdf': { id: 'html-to-pdf', name: 'HTML to PDF', icon: Globe, badge: 'Web to PDF', desc: 'Convert HTML files, webpages, and code into clean PDF documents', hint: 'Upload an HTML or text file to convert to PDF.' },
};

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
    <div className="relative min-h-screen bg-[#FAF8F4] text-[#262D20] flex flex-col selection:bg-[#5B7147] selection:text-white font-sans overflow-x-hidden">
      {/* Splash Screen on Initial Load */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Interactive 3D Ambient Canvas Background */}
      <ThreeCanvas />

      {/* Top Header / Navigation Bar with Section Dropdowns */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        fileCounts={{
          merge: files.length,
          'merge-pdf': files.length,
          split: files.length,
          'split-pdf': files.length,
          compress: files.length,
          'compress-pdf': files.length,
          docx: files.length,
          'pdf-to-docx': files.length,
          'jpg-to-pdf': files.filter((f) => f.isImage).length,
          'pdf-to-jpg': files.filter((f) => f.isPdf).length,
          'word-to-pdf': files.filter((f) => (f.name || '').toLowerCase().endsWith('.docx')).length,
          'excel-to-pdf': files.filter((f) =>
            ['.csv', '.xlsx', '.xls', '.txt'].some((ext) => (f.name || '').toLowerCase().endsWith(ext))
          ).length,
          'pdf-to-excel': files.filter((f) => f.isPdf).length,
          'powerpoint-to-pdf': files.filter((f) =>
            (f.name || '').toLowerCase().endsWith('.pptx')
          ).length,
          'pdf-to-powerpoint': files.filter((f) => f.isPdf).length,
          'pdf-to-pdfa': files.filter((f) => f.isPdf).length,
          'html-to-pdf': files.filter((f) =>
            ['.html', '.htm', '.txt'].some((ext) => (f.name || '').toLowerCase().endsWith(ext))
          ).length,
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
                  'merge-pdf': files.length,
                  split: files.length,
                  'split-pdf': files.length,
                  compress: files.length,
                  'compress-pdf': files.length,
                  docx: files.length,
                  'pdf-to-docx': files.length,
                  'jpg-to-pdf': files.filter((f) => f.isImage).length,
                  'pdf-to-jpg': files.filter((f) => f.isPdf).length,
                  'word-to-pdf': files.filter((f) =>
                    (f.name || '').toLowerCase().endsWith('.docx')
                  ).length,
                  'excel-to-pdf': files.filter((f) =>
                    ['.csv', '.xlsx', '.xls', '.txt'].some((ext) =>
                      (f.name || '').toLowerCase().endsWith(ext)
                    )
                  ).length,
                  'pdf-to-excel': files.filter((f) => f.isPdf).length,
                  'powerpoint-to-pdf': files.filter((f) =>
                    (f.name || '').toLowerCase().endsWith('.pptx')
                  ).length,
                  'pdf-to-powerpoint': files.filter((f) => f.isPdf).length,
                  'pdf-to-pdfa': files.filter((f) => f.isPdf).length,
                  'html-to-pdf': files.filter((f) =>
                    ['.html', '.htm', '.txt'].some((ext) =>
                      (f.name || '').toLowerCase().endsWith(ext)
                    )
                  ).length,
                }}
              />
            </motion.div>
          )}

          {activeTab !== 'home' && (() => {
            const currentConfig = TOOL_CONFIGS[activeTab] || TOOL_CONFIGS['merge-pdf'];
            const ToolIcon = currentConfig.icon;

            return (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Tool Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B7147] to-[#435433] text-white flex items-center justify-center shadow-md shadow-[#5B7147]/20">
                      <ToolIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-[#262D20]">
                          {currentConfig.name}
                        </h2>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B7147]/10 text-[#3A4A2C] border border-[#5B7147]/20">
                          {currentConfig.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B785E]">
                        {currentConfig.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('home')}
                    className="text-xs text-[#3A4A2C] hover:text-[#1E2619] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#DDD3C2] hover:border-[#5B7147] shadow-sm transition-all font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Home</span>
                  </button>
                </div>

                {files.length === 0 ? (
                  <div className="max-w-xl mx-auto py-10">
                    <div className="text-center mb-6">
                      <p className="text-sm text-[#6B785E]">
                        {currentConfig.hint}
                      </p>
                    </div>
                    <Uploader onFilesAdded={handleFilesAdded} />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* File Queue Toolbar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#262D20]">
                        <Files className="w-4 h-4 text-[#5B7147]" />
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
                          activeToolId={currentConfig.id}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E8E1D5] bg-[#FAF8F4]/90 backdrop-blur-md py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#738067] text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5B7147] animate-pulse" />
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
