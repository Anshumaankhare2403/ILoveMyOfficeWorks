import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Scissors,
  Minimize2,
  FileText,
  Image,
  Table,
  Presentation,
  Globe,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  Trash2,
  FileDown,
  ArrowUpDown,
  Camera,
  Wrench,
  FileSearch,
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
  Search,
  Maximize2,
} from 'lucide-react';
import Uploader from './Uploader';

export default function HomeScreen({ onSelectTool, onQuickUpload, fileCounts = {} }) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 6 Categories matching the user's screenshot exactly
  const categories = [
    {
      id: 'organize',
      title: 'ORGANIZE PDF',
      desc: 'Rearrange, combine, remove and scan pages',
      icon: Layers,
      color: 'text-rose-700 bg-rose-500/10 border-rose-300/40',
      headerBg: 'from-rose-50 to-orange-50/50 border-rose-200/60',
      accentColor: '#E11D48',
      tools: [
        {
          id: 'merge-pdf',
          name: 'Merge PDF',
          desc: 'Combine multiple PDF documents sequentially with custom page ordering.',
          badge: 'Combine',
          icon: Layers,
          iconColor: 'bg-rose-500/10 text-rose-600 border-rose-200/50',
          count: fileCounts['merge-pdf'] || fileCounts.merge || 0,
        },
        {
          id: 'split-pdf',
          name: 'Split PDF',
          desc: 'Extract custom page ranges or break large documents into fixed chunks of N pages.',
          badge: 'Split',
          icon: Scissors,
          iconColor: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
          count: fileCounts['split-pdf'] || fileCounts.split || 0,
        },
        {
          id: 'remove-pages',
          name: 'Remove pages',
          desc: 'Delete unwanted or blank pages from your PDF document and download a clean file.',
          badge: 'Delete',
          icon: Trash2,
          iconColor: 'bg-red-500/10 text-red-600 border-red-200/50',
          count: fileCounts['remove-pages'] || 0,
        },
        {
          id: 'extract-pages',
          name: 'Extract pages',
          desc: 'Select specific pages or ranges from a PDF and extract them into a brand-new PDF.',
          badge: 'Extract',
          icon: FileDown,
          iconColor: 'bg-orange-500/10 text-orange-600 border-orange-200/50',
          count: fileCounts['extract-pages'] || 0,
        },
        {
          id: 'organize-pdf',
          name: 'Organize PDF',
          desc: 'Reorder, reverse, rearrange, or duplicate pages in your PDF document into a custom sequence.',
          badge: 'Reorder',
          icon: ArrowUpDown,
          iconColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200/50',
          count: fileCounts['organize-pdf'] || 0,
        },
        {
          id: 'scan-to-pdf',
          name: 'Scan to PDF',
          desc: 'Convert captured camera photos and document scans into high-contrast clean PDF files.',
          badge: 'Scan',
          icon: Camera,
          iconColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
          count: fileCounts['scan-to-pdf'] || 0,
        },
      ],
    },
    {
      id: 'optimize',
      title: 'OPTIMIZE PDF',
      desc: 'Compress, rebuild and recognize text in PDFs',
      icon: Minimize2,
      color: 'text-emerald-700 bg-emerald-500/10 border-emerald-300/40',
      headerBg: 'from-emerald-50 to-teal-50/50 border-emerald-200/60',
      accentColor: '#059669',
      tools: [
        {
          id: 'compress-pdf',
          name: 'Compress PDF',
          desc: 'Shrink document size with smart image downsampling, bloat purging, and stream packing.',
          badge: 'Optimize',
          icon: Minimize2,
          iconColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
          count: fileCounts['compress-pdf'] || fileCounts.compress || 0,
        },
        {
          id: 'repair-pdf',
          name: 'Repair PDF',
          desc: 'Analyze corrupted, unreadable, or malformed PDF structures and rebuild intact object streams.',
          badge: 'Repair',
          icon: Wrench,
          iconColor: 'bg-teal-500/10 text-teal-600 border-teal-200/50',
          count: fileCounts['repair-pdf'] || 0,
        },
        {
          id: 'ocr-pdf',
          name: 'OCR PDF',
          desc: 'Convert scanned PDF documents into searchable files with selectable text and OCR transcript export.',
          badge: 'OCR Text',
          icon: FileSearch,
          iconColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-200/50',
          count: fileCounts['ocr-pdf'] || 0,
        },
      ],
    },
    {
      id: 'toPdf',
      title: 'CONVERT TO PDF',
      desc: 'Convert images, Office files & code into PDF',
      icon: ArrowDownToLine,
      color: 'text-amber-700 bg-amber-500/10 border-amber-300/40',
      headerBg: 'from-amber-50 to-yellow-50/50 border-amber-200/60',
      accentColor: '#D97706',
      tools: [
        {
          id: 'jpg-to-pdf',
          name: 'JPG to PDF',
          desc: 'Convert JPG, PNG, and WebP images into a single PDF document with custom margins.',
          badge: 'Images',
          icon: Image,
          iconColor: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
          count: fileCounts['jpg-to-pdf'] || 0,
        },
        {
          id: 'word-to-pdf',
          name: 'WORD to PDF',
          desc: 'Convert Microsoft Word documents (.docx) into clean vector PDF files.',
          badge: 'Word',
          icon: FileText,
          iconColor: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
          count: fileCounts['word-to-pdf'] || 0,
        },
        {
          id: 'powerpoint-to-pdf',
          name: 'POWERPOINT to PDF',
          desc: 'Convert PowerPoint (.pptx) presentations into landscape PDF slides.',
          badge: 'Slides',
          icon: Presentation,
          iconColor: 'bg-orange-500/10 text-orange-600 border-orange-200/50',
          count: fileCounts['powerpoint-to-pdf'] || 0,
        },
        {
          id: 'excel-to-pdf',
          name: 'EXCEL to PDF',
          desc: 'Convert Excel spreadsheets and CSV tables into formatted vector PDF tables.',
          badge: 'Spreadsheet',
          icon: Table,
          iconColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
          count: fileCounts['excel-to-pdf'] || 0,
        },
        {
          id: 'html-to-pdf',
          name: 'HTML to PDF',
          desc: 'Convert HTML files, webpages, and code into clean, printable PDF documents.',
          badge: 'Web',
          icon: Globe,
          iconColor: 'bg-amber-500/10 text-amber-700 border-amber-200/50',
          count: fileCounts['html-to-pdf'] || 0,
        },
      ],
    },
    {
      id: 'fromPdf',
      title: 'CONVERT FROM PDF',
      desc: 'Extract images, editable Word, Excel & slides',
      icon: ArrowUpFromLine,
      color: 'text-blue-700 bg-blue-500/10 border-blue-300/40',
      headerBg: 'from-blue-50 to-sky-50/50 border-blue-200/60',
      accentColor: '#2563EB',
      tools: [
        {
          id: 'pdf-to-jpg',
          name: 'PDF to JPG',
          desc: 'Convert PDF pages into high-resolution JPG or PNG images and ZIP archive.',
          badge: 'Images',
          icon: Image,
          iconColor: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
          count: fileCounts['pdf-to-jpg'] || 0,
        },
        {
          id: 'pdf-to-docx',
          name: 'PDF to WORD',
          desc: 'Convert PDF documents into fully editable Microsoft Word (.docx) files with typography.',
          badge: 'Word',
          icon: FileText,
          iconColor: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
          count: fileCounts['pdf-to-docx'] || fileCounts.docx || 0,
        },
        {
          id: 'pdf-to-powerpoint',
          name: 'PDF to POWERPOINT',
          desc: 'Convert PDF document pages into formatted PowerPoint presentation slides (.pptx).',
          badge: 'Slides',
          icon: Presentation,
          iconColor: 'bg-orange-500/10 text-orange-600 border-orange-200/50',
          count: fileCounts['pdf-to-powerpoint'] || 0,
        },
        {
          id: 'pdf-to-excel',
          name: 'PDF to EXCEL',
          desc: 'Extract tables, rows, invoices, and numbers from PDF into Excel CSV format.',
          badge: 'Tables',
          icon: Table,
          iconColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
          count: fileCounts['pdf-to-excel'] || 0,
        },
        {
          id: 'pdf-to-pdfa',
          name: 'PDF to PDF/A',
          desc: 'Convert PDF to ISO 19005 compliant archival PDF/A format with color profiles.',
          badge: 'Archival',
          icon: Archive,
          iconColor: 'bg-slate-500/10 text-slate-700 border-slate-200/50',
          count: fileCounts['pdf-to-pdfa'] || 0,
        },
      ],
    },
    {
      id: 'edit',
      title: 'EDIT PDF',
      desc: 'Rotate, annotate, watermark, crop & forms',
      icon: PenTool,
      color: 'text-purple-700 bg-purple-500/10 border-purple-300/40',
      headerBg: 'from-purple-50 to-fuchsia-50/50 border-purple-200/60',
      accentColor: '#9333EA',
      tools: [
        {
          id: 'rotate-pdf',
          name: 'Rotate PDF',
          desc: 'Rotate all or specific pages of your PDF document clockwise by 90, 180, or 270 degrees.',
          badge: 'Rotate',
          icon: RotateCw,
          iconColor: 'bg-purple-500/10 text-purple-600 border-purple-200/50',
          count: fileCounts['rotate-pdf'] || 0,
        },
        {
          id: 'add-page-numbers',
          name: 'Add page numbers',
          desc: 'Insert customizable page numbering, headers, and footers into your PDF document.',
          badge: 'Page #',
          icon: Hash,
          iconColor: 'bg-violet-500/10 text-violet-600 border-violet-200/50',
          count: fileCounts['add-page-numbers'] || 0,
        },
        {
          id: 'add-watermark',
          name: 'Add watermark',
          desc: 'Stamp custom text or security watermarks across PDF pages with rotation and opacity control.',
          badge: 'Watermark',
          icon: Stamp,
          iconColor: 'bg-pink-500/10 text-pink-600 border-pink-200/50',
          count: fileCounts['add-watermark'] || 0,
        },
        {
          id: 'crop-pdf',
          name: 'Crop PDF',
          desc: 'Trim margins, crop page dimensions, and remove unwanted white borders from PDF pages.',
          badge: 'Crop',
          icon: Crop,
          iconColor: 'bg-rose-500/10 text-rose-600 border-rose-200/50',
          count: fileCounts['crop-pdf'] || 0,
        },
        {
          id: 'edit-pdf',
          name: 'Edit PDF',
          desc: 'Add custom text annotations, headers, stamps, and notes directly onto pages of your PDF.',
          badge: 'Annotate',
          icon: PenTool,
          iconColor: 'bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200/50',
          count: fileCounts['edit-pdf'] || 0,
        },
        {
          id: 'pdf-forms',
          name: 'PDF Forms',
          desc: 'Flatten interactive form fields into static vector elements or lock inputs to read-only.',
          badge: 'Forms',
          icon: FileSpreadsheet,
          iconColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200/50',
          count: fileCounts['pdf-forms'] || 0,
        },
      ],
    },
    {
      id: 'security',
      title: 'PDF SECURITY',
      desc: 'Encrypt, unlock, sign, redact & compare',
      icon: Shield,
      color: 'text-sky-700 bg-sky-500/10 border-sky-300/40',
      headerBg: 'from-sky-50 to-blue-50/50 border-sky-200/60',
      accentColor: '#0284C7',
      tools: [
        {
          id: 'unlock-pdf',
          name: 'Unlock PDF',
          desc: 'Remove password protection, unlock printing & copying permissions, and save an unrestricted PDF.',
          badge: 'Decrypt',
          icon: Unlock,
          iconColor: 'bg-sky-500/10 text-sky-600 border-sky-200/50',
          count: fileCounts['unlock-pdf'] || 0,
        },
        {
          id: 'protect-pdf',
          name: 'Protect PDF',
          desc: 'Encrypt your PDF with AES password protection to prevent unauthorized opening or editing.',
          badge: 'Encrypt',
          icon: Shield,
          iconColor: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
          count: fileCounts['protect-pdf'] || 0,
        },
        {
          id: 'sign-pdf',
          name: 'Sign PDF',
          desc: 'Apply an electronic signature badge, verified signing certificate block, and date onto your PDF.',
          badge: 'Sign',
          icon: CheckSquare,
          iconColor: 'bg-teal-500/10 text-teal-600 border-teal-200/50',
          count: fileCounts['sign-pdf'] || 0,
        },
        {
          id: 'redact-pdf',
          name: 'Redact PDF',
          desc: 'Permanently blackout sensitive information, confidential phrases, or page areas to prevent inspection.',
          badge: 'Redact',
          icon: EyeOff,
          iconColor: 'bg-slate-500/10 text-slate-700 border-slate-200/50',
          count: fileCounts['redact-pdf'] || 0,
        },
        {
          id: 'compare-pdf',
          name: 'Compare PDF',
          desc: 'Compare two PDF documents side-by-side, analyze text and page differences, and generate audit report.',
          badge: 'Compare',
          icon: GitCompare,
          iconColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200/50',
          count: fileCounts['compare-pdf'] || 0,
        },
      ],
    },
    {
      id: 'image',
      title: 'IMAGE TOOLS',
      desc: 'Compress, resize, crop and convert photos',
      icon: Image,
      color: 'text-teal-700 bg-teal-500/10 border-teal-300/40',
      headerBg: 'from-teal-50 to-emerald-50/50 border-teal-200/60',
      accentColor: '#0D9488',
      tools: [
        {
          id: 'compress-image',
          name: 'Compress Image',
          desc: 'Shrink JPG, PNG, and WebP images with smart Canvas re-encoding and quality downsampling.',
          badge: 'Optimize',
          icon: Minimize2,
          iconColor: 'bg-teal-500/10 text-teal-600 border-teal-200/50',
          count: fileCounts['compress-image'] || 0,
        },
        {
          id: 'resize-image',
          name: 'Resize Image',
          desc: 'Change image dimensions by percentage scale or exact pixel width and height.',
          badge: 'Resize',
          icon: Maximize2,
          iconColor: 'bg-sky-500/10 text-sky-600 border-sky-200/50',
          count: fileCounts['resize-image'] || 0,
        },
        {
          id: 'crop-image',
          name: 'Crop Image',
          desc: 'Crop photos and images with preset aspect ratios or custom pixel bounding boxes.',
          badge: 'Crop',
          icon: Crop,
          iconColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
          count: fileCounts['crop-image'] || 0,
        },
        {
          id: 'convert-to-jpg',
          name: 'Convert to JPG',
          desc: 'Convert PNG, WebP, GIF, SVG, or BMP images into clean standard JPEG files.',
          badge: 'Convert',
          icon: Image,
          iconColor: 'bg-amber-500/10 text-amber-600 border-amber-200/50',
          count: fileCounts['convert-to-jpg'] || 0,
        },
      ],
    },
  ];

  // Featured 4 core tools
  const featuredTools = [
    {
      id: 'merge-pdf',
      name: 'Merge PDF',
      badge: 'Multi-PDF',
      icon: Layers,
      color: 'from-[#5B7147] to-[#435433]',
      description: 'Combine unlimited PDF documents sequentially with custom page ordering.',
    },
    {
      id: 'split-pdf',
      name: 'Split PDF',
      badge: 'Extractor',
      icon: Scissors,
      color: 'from-[#6E8558] to-[#50633E]',
      description: 'Extract custom page ranges or break large documents into fixed chunks.',
    },
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      badge: 'Optimizer',
      icon: Minimize2,
      color: 'from-[#50633E] to-[#3B4A2D]',
      description: 'Shrink document size with smart image downsampling and bloat purging.',
    },
    {
      id: 'pdf-to-docx',
      name: 'PDF to WORD',
      badge: 'OpenXML',
      icon: FileText,
      color: 'from-[#2563EB] to-[#1D4ED8]',
      description: 'Convert PDF documents into fully editable Microsoft Word (.docx) files.',
    },
  ];

  // Filter categories based on category tab & search query
  const filteredCategories = categories
    .map((cat) => {
      // If category filter is active and doesn't match
      if (activeCategoryFilter !== 'all' && cat.id !== activeCategoryFilter) {
        return null;
      }
      // If search query is present, filter tools inside category
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchingTools = cat.tools.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.desc.toLowerCase().includes(query) ||
            t.badge.toLowerCase().includes(query)
        );
        if (matchingTools.length === 0) return null;
        return { ...cat, tools: matchingTools };
      }
      return cat;
    })
    .filter(Boolean);

  const totalToolsCount = categories.reduce((sum, c) => sum + c.tools.length, 0);

  return (
    <div className="space-y-12 py-4 max-w-7xl mx-auto w-full select-none">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-[#5B7147] rounded-3xl blur-xl opacity-20 group-hover:opacity-35 transition-opacity" />
            <img
              src="/logo.png"
              alt="ILoveMyOfficeWorks Logo"
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover shadow-xl shadow-[#5B7147]/15 border border-[#DDD3C2] group-hover:scale-105 transition-transform"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B7147]/10 border border-[#5B7147]/25 text-[#435433] text-xs font-bold uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#5B7147]" />
          <span>Local PDF & Image Engine • 33 Complete Tools</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-[#1E2619] tracking-tight"
        >
          ILoveMy<span className="text-[#5B7147]">OfficeWorks</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#657357] text-sm sm:text-base max-w-2xl mx-auto font-medium"
        >
          Every tool you need to work with PDFs in one place. 100% private, free, and executing directly in your local browser with zero cloud server transmission.
        </motion.p>
      </div>

      {/* Quick Launch Dropzone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className="max-w-2xl mx-auto"
      >
        <Uploader onFilesAdded={onQuickUpload} />
      </motion.div>

      {/* Featured Quick Access Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1E2619] uppercase tracking-wider flex items-center gap-2">
            <span>Most Popular Tools</span>
            <span className="text-xs font-normal text-[#758467] font-mono">
              (Quick Access)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                onClick={() => onSelectTool(tool.id)}
                className="group relative rounded-2xl p-4 border bg-white hover:bg-[#FDFCFB] border-[#DDD3C2] hover:border-[#5B7147]/60 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-md shadow-stone-900/10 shrink-0 border border-white/20`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433] border border-[#5B7147]/25">
                      {tool.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1E2619] group-hover:text-[#5B7147] transition-colors mb-1">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-[#667258] leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-2.5 mt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs font-bold text-[#5B7147]">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs & Quick Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8E1D5]">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategoryFilter === 'all'
                ? 'bg-[#5B7147] text-white shadow-sm'
                : 'bg-white hover:bg-[#FAF8F4] text-[#4E5C46] border border-[#DDD3C2]'
            }`}
          >
            All Tools ({totalToolsCount})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategoryFilter === cat.id
                  ? 'bg-[#5B7147] text-white shadow-sm'
                  : 'bg-white hover:bg-[#FAF8F4] text-[#4E5C46] border border-[#DDD3C2]'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#78856B] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 33 tools..."
            className="w-full bg-white border border-[#DDD3C2] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#1E2619] placeholder-[#8B987E] focus:outline-none focus:border-[#5B7147] focus:ring-1 focus:ring-[#5B7147] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-[10px] font-bold text-stone-400 hover:text-stone-700 bg-stone-100 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category Grid Layout Matching User Suites */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
        {filteredCategories.map((category) => {
          const CategoryIcon = category.icon;

          return (
            <div
              key={category.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#DDD3C2] shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Category Header */}
              <div
                className={`p-3.5 border-b bg-gradient-to-b ${category.headerBg} flex items-center justify-between gap-2`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${category.color}`}
                  >
                    <CategoryIcon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-black tracking-wider text-[#1E2619] whitespace-nowrap truncate uppercase">
                    {category.title}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-white/80 text-[#5B7147] border border-[#DDD3C2] shrink-0">
                  {category.tools.length}
                </span>
              </div>

              {/* Tools List within Category */}
              <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-start">
                {category.tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => onSelectTool(tool.id)}
                      className="group p-2 rounded-xl bg-white hover:bg-[#FAF8F4] border border-transparent hover:border-[#5B7147]/40 hover:shadow-sm transition-all duration-150 cursor-pointer flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${tool.iconColor}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#1E2619] group-hover:text-[#5B7147] transition-colors truncate block">
                            {tool.name}
                          </span>
                          <span className="text-[10px] text-[#7A886D] truncate block group-hover:text-[#5B7147]/80">
                            {tool.badge}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {tool.count > 0 && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#5B7147]/10 text-[#435433]">
                            {tool.count}
                          </span>
                        )}
                        <ArrowRight className="w-3 h-3 text-[#A8B699] group-hover:text-[#5B7147] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature & Privacy Highlights */}
      <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5DDD0]">
        <div className="bg-white/80 border border-[#DDD3C2] rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#5B7147] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-[#1E2619]">100% Client-Side</h5>
            <p className="text-[11px] text-[#6B785E] mt-0.5">
              Documents never leave your computer. All memory buffers stay in your local browser sandbox.
            </p>
          </div>
        </div>

        <div className="bg-white/80 border border-[#DDD3C2] rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <Zap className="w-5 h-5 text-[#6E8558] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-[#1E2619]">Native High Speed</h5>
            <p className="text-[11px] text-[#6B785E] mt-0.5">
              Powered by native WebAssembly, OffscreenCanvas, pdf-lib, and OpenXML docx engines.
            </p>
          </div>
        </div>

        <div className="bg-white/80 border border-[#DDD3C2] rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <Lock className="w-5 h-5 text-[#50633E] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-[#1E2619]">Zero Tracking or Cloud</h5>
            <p className="text-[11px] text-[#6B785E] mt-0.5">
              Zero cookies, zero telemetry, zero document uploads. Completely private and open.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
