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
  RotateCw,
  Hash,
  Stamp,
  Crop,
  PenTool,
  FileSpreadsheet,
  Unlock,
  Shield,
  CheckSquare,
  EyeOff,
  GitCompare,
  FileDown,
  ArrowUpDown,
  Camera,
  Wrench,
  FileSearch,
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
  // 1. Organize PDF
  merge: { id: 'merge-pdf', name: 'Merge PDF', icon: Layers, badge: 'Organize', desc: 'Combine multiple PDF documents sequentially with custom page ordering', hint: 'Upload 2 or more PDF documents to merge them into a single file.' },
  'merge-pdf': { id: 'merge-pdf', name: 'Merge PDF', icon: Layers, badge: 'Organize', desc: 'Combine multiple PDF documents sequentially with custom page ordering', hint: 'Upload 2 or more PDF documents to merge them into a single file.' },
  split: { id: 'split-pdf', name: 'Split PDF', icon: Scissors, badge: 'Organize', desc: 'Break PDFs into separate files by page range or every N pages', hint: 'Upload a PDF document to split it into multiple parts.' },
  'split-pdf': { id: 'split-pdf', name: 'Split PDF', icon: Scissors, badge: 'Organize', desc: 'Break PDFs into separate files by page range or every N pages', hint: 'Upload a PDF document to split it into multiple parts.' },
  'remove-pages': { id: 'remove-pages', name: 'Remove Pages', icon: Trash2, badge: 'Organize', desc: 'Delete unwanted or blank pages from your PDF document and download a clean file', hint: 'Upload a PDF document to remove specific pages or ranges.' },
  'extract-pages': { id: 'extract-pages', name: 'Extract Pages', icon: FileDown, badge: 'Organize', desc: 'Select specific pages or ranges from a PDF and extract them into a brand-new PDF', hint: 'Upload a PDF document to extract selected pages.' },
  'organize-pdf': { id: 'organize-pdf', name: 'Organize PDF', icon: ArrowUpDown, badge: 'Organize', desc: 'Reorder, reverse, rearrange, or duplicate pages in your PDF document into a custom sequence', hint: 'Upload a PDF document to rearrange or reverse page ordering.' },
  'scan-to-pdf': { id: 'scan-to-pdf', name: 'Scan to PDF', icon: Camera, badge: 'Organize', desc: 'Convert captured camera photos and document scans into high-contrast clean PDF files', hint: 'Upload photo scans or photos to convert into enhanced document PDFs.' },

  // 2. Optimize PDF
  compress: { id: 'compress-pdf', name: 'Compress PDF', icon: Minimize2, badge: 'Optimize', desc: 'Shrink PDF file size with stream compression, metadata stripping, and quality presets', hint: 'Upload a PDF document to compress and optimize its file size.' },
  'compress-pdf': { id: 'compress-pdf', name: 'Compress PDF', icon: Minimize2, badge: 'Optimize', desc: 'Shrink PDF file size with stream compression, metadata stripping, and quality presets', hint: 'Upload a PDF document to compress and optimize its file size.' },
  'repair-pdf': { id: 'repair-pdf', name: 'Repair PDF', icon: Wrench, badge: 'Optimize', desc: 'Analyze corrupted, unreadable, or malformed PDF structures and rebuild intact object streams', hint: 'Upload a damaged or unreadable PDF document to attempt structure recovery.' },
  'ocr-pdf': { id: 'ocr-pdf', name: 'OCR PDF', icon: FileSearch, badge: 'Optimize', desc: 'Convert scanned PDF documents into searchable files with selectable text and OCR transcript export', hint: 'Upload a scanned PDF document to recognize text and generate searchable overlay.' },

  // 3. Convert to PDF
  'jpg-to-pdf': { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: Image, badge: 'Convert to PDF', desc: 'Convert JPG, PNG, and WebP images into a single PDF document with custom margins', hint: 'Upload 1 or more images (JPG, PNG, WebP) to combine into a PDF.' },
  'word-to-pdf': { id: 'word-to-pdf', name: 'WORD to PDF', icon: FileText, badge: 'Convert to PDF', desc: 'Convert Microsoft Word documents (.docx) into clean vector PDF files', hint: 'Upload a Microsoft Word (.docx) file to convert to PDF.' },
  'powerpoint-to-pdf': { id: 'powerpoint-to-pdf', name: 'POWERPOINT to PDF', icon: Presentation, badge: 'Convert to PDF', desc: 'Convert PowerPoint (.pptx) presentations into landscape PDF slides', hint: 'Upload a PowerPoint (.pptx) presentation to convert to PDF.' },
  'excel-to-pdf': { id: 'excel-to-pdf', name: 'EXCEL to PDF', icon: Table, badge: 'Convert to PDF', desc: 'Convert Excel spreadsheets and CSV tables into vector PDF documents', hint: 'Upload a spreadsheet or CSV table to convert to PDF.' },
  'html-to-pdf': { id: 'html-to-pdf', name: 'HTML to PDF', icon: Globe, badge: 'Convert to PDF', desc: 'Convert HTML files, webpages, and code into clean PDF documents', hint: 'Upload an HTML or text file to convert to PDF.' },

  // 4. Convert from PDF
  'pdf-to-jpg': { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: Image, badge: 'Convert from PDF', desc: 'Convert PDF pages into high-resolution JPG or PNG images and ZIP archive', hint: 'Upload a PDF document to extract pages as images.' },
  docx: { id: 'pdf-to-docx', name: 'PDF to WORD', icon: FileText, badge: 'Convert from PDF', desc: 'Convert PDF documents into fully editable Microsoft Word (.docx) files with typography', hint: 'Upload a PDF document to convert into an editable Word (.docx) file.' },
  'pdf-to-docx': { id: 'pdf-to-docx', name: 'PDF to WORD', icon: FileText, badge: 'Convert from PDF', desc: 'Convert PDF documents into fully editable Microsoft Word (.docx) files with typography', hint: 'Upload a PDF document to convert into an editable Word (.docx) file.' },
  'pdf-to-powerpoint': { id: 'pdf-to-powerpoint', name: 'PDF to POWERPOINT', icon: Presentation, badge: 'Convert from PDF', desc: 'Convert PDF document pages into PowerPoint presentation slides (.pptx)', hint: 'Upload a PDF document to convert to PowerPoint (.pptx).' },
  'pdf-to-excel': { id: 'pdf-to-excel', name: 'PDF to EXCEL', icon: Table, badge: 'Convert from PDF', desc: 'Extract tables, rows, invoices, and structured data into Excel CSV format', hint: 'Upload a PDF document with tables to extract to Excel.' },
  'pdf-to-pdfa': { id: 'pdf-to-pdfa', name: 'PDF to PDF/A', icon: Archive, badge: 'Convert from PDF', desc: 'Convert PDF documents into ISO-compliant archival PDF/A standard', hint: 'Upload a PDF document to convert to PDF/A archival format.' },

  // 5. Edit PDF
  'rotate-pdf': { id: 'rotate-pdf', name: 'Rotate PDF', icon: RotateCw, badge: 'Edit', desc: 'Rotate all or specific pages of your PDF document clockwise by 90, 180, or 270 degrees', hint: 'Upload a PDF document to rotate pages.' },
  'add-page-numbers': { id: 'add-page-numbers', name: 'Add Page Numbers', icon: Hash, badge: 'Edit', desc: 'Insert customizable page numbering, headers, and footers into your PDF document', hint: 'Upload a PDF document to add page numbering.' },
  'add-watermark': { id: 'add-watermark', name: 'Add Watermark', icon: Stamp, badge: 'Edit', desc: 'Stamp custom text or security watermarks across PDF pages with rotation and opacity control', hint: 'Upload a PDF document to apply watermarks.' },
  'crop-pdf': { id: 'crop-pdf', name: 'Crop PDF', icon: Crop, badge: 'Edit', desc: 'Trim margins, crop page dimensions, and remove unwanted white borders from PDF pages', hint: 'Upload a PDF document to crop margins.' },
  'edit-pdf': { id: 'edit-pdf', name: 'Edit PDF', icon: PenTool, badge: 'Edit', desc: 'Add custom text annotations, headers, stamps, and notes directly onto pages of your PDF', hint: 'Upload a PDF document to add text notes and annotations.' },
  'pdf-forms': { id: 'pdf-forms', name: 'PDF Forms', icon: FileSpreadsheet, badge: 'Edit', desc: 'Flatten interactive form fields into static vector elements or lock inputs to read-only', hint: 'Upload a PDF document with form fields to flatten or lock.' },

  // 6. PDF Security
  'unlock-pdf': { id: 'unlock-pdf', name: 'Unlock PDF', icon: Unlock, badge: 'Security', desc: 'Remove password protection, unlock printing & copying permissions, and save an unrestricted PDF', hint: 'Upload a password-protected PDF document to unlock.' },
  'protect-pdf': { id: 'protect-pdf', name: 'Protect PDF', icon: Shield, badge: 'Security', desc: 'Encrypt your PDF with AES password protection to prevent unauthorized opening, editing, or copying', hint: 'Upload a PDF document to encrypt with a password.' },
  'sign-pdf': { id: 'sign-pdf', name: 'Sign PDF', icon: CheckSquare, badge: 'Security', desc: 'Apply an electronic signature badge, verified signing certificate block, and date onto your PDF', hint: 'Upload a PDF document to add a verified signature block.' },
  'redact-pdf': { id: 'redact-pdf', name: 'Redact PDF', icon: EyeOff, badge: 'Security', desc: 'Permanently blackout sensitive information, confidential phrases, or page areas to prevent inspection', hint: 'Upload a PDF document to redact confidential data.' },
  'compare-pdf': { id: 'compare-pdf', name: 'Compare PDF', icon: GitCompare, badge: 'Security', desc: 'Compare two PDF documents side-by-side, analyze text and page differences, and generate audit report', hint: 'Upload 2 PDF documents to compare differences.' },
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

  const fileCounts = {
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
        fileCounts={fileCounts}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
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
                fileCounts={fileCounts}
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
