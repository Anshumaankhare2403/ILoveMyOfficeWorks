import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Scissors,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Minimize2,
  FileText,
  Lock,
  Image,
  Table,
  Presentation,
  Globe,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react';
import Uploader from './Uploader';

export default function HomeScreen({ onSelectTool, onQuickUpload, fileCounts = {} }) {
  // Core PDF operations
  const coreTools = [
    {
      id: 'merge-pdf',
      name: 'PDF Merger',
      badge: 'Multi-PDF',
      icon: Layers,
      color: 'from-[#5B7147] to-[#435433]',
      description: 'Combine unlimited PDF documents sequentially with custom page ordering.',
      count: fileCounts.merge || fileCounts['merge-pdf'] || 0,
    },
    {
      id: 'split-pdf',
      name: 'PDF Splitter',
      badge: 'Extractor',
      icon: Scissors,
      color: 'from-[#6E8558] to-[#50633E]',
      description: 'Extract custom page ranges or break large documents into fixed chunks of N pages.',
      count: fileCounts.split || fileCounts['split-pdf'] || 0,
    },
    {
      id: 'compress-pdf',
      name: 'PDF Compressor',
      badge: 'Optimizer',
      icon: Minimize2,
      color: 'from-[#50633E] to-[#3B4A2D]',
      description: 'Shrink document size with smart image downsampling, bloat purging, and stream packing.',
      count: fileCounts.compress || fileCounts['compress-pdf'] || 0,
    },
  ];

  // Column 1: CONVERT TO PDF (from user screenshot)
  const convertToPdfTools = [
    {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      badge: 'Images',
      icon: Image,
      iconBg: 'bg-amber-500/10 text-amber-600 border-amber-300/40',
      description: 'Convert JPG, PNG, and WebP images into a single PDF document.',
      count: fileCounts['jpg-to-pdf'] || 0,
    },
    {
      id: 'word-to-pdf',
      name: 'WORD to PDF',
      badge: 'Office',
      icon: FileText,
      iconBg: 'bg-blue-500/10 text-blue-600 border-blue-300/40',
      description: 'Convert Microsoft Word (.docx) documents into clean vector PDF files.',
      count: fileCounts['word-to-pdf'] || 0,
    },
    {
      id: 'powerpoint-to-pdf',
      name: 'POWERPOINT to PDF',
      badge: 'Slides',
      icon: Presentation,
      iconBg: 'bg-orange-500/10 text-orange-600 border-orange-300/40',
      description: 'Convert PowerPoint (.pptx) presentations into landscape PDF slides.',
      count: fileCounts['powerpoint-to-pdf'] || 0,
    },
    {
      id: 'excel-to-pdf',
      name: 'EXCEL to PDF',
      badge: 'Spreadsheet',
      icon: Table,
      iconBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-300/40',
      description: 'Convert Excel spreadsheets and CSV tables into formatted vector PDF tables.',
      count: fileCounts['excel-to-pdf'] || 0,
    },
    {
      id: 'html-to-pdf',
      name: 'HTML to PDF',
      badge: 'Web',
      icon: Globe,
      iconBg: 'bg-amber-500/10 text-amber-700 border-amber-300/40',
      description: 'Convert HTML files, webpages, and code into clean, printable PDF documents.',
      count: fileCounts['html-to-pdf'] || 0,
    },
  ];

  // Column 2: CONVERT FROM PDF (from user screenshot)
  const convertFromPdfTools = [
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      badge: 'Images',
      icon: Image,
      iconBg: 'bg-amber-500/10 text-amber-600 border-amber-300/40',
      description: 'Convert PDF pages into high-resolution JPG or PNG images and ZIP archive.',
      count: fileCounts['pdf-to-jpg'] || 0,
    },
    {
      id: 'pdf-to-docx',
      name: 'PDF to WORD',
      badge: 'OpenXML',
      icon: FileText,
      iconBg: 'bg-blue-500/10 text-blue-600 border-blue-300/40',
      description: 'Convert PDF documents into fully editable Microsoft Word (.docx) files.',
      count: fileCounts['pdf-to-docx'] || fileCounts.docx || 0,
    },
    {
      id: 'pdf-to-powerpoint',
      name: 'PDF to POWERPOINT',
      badge: 'Slides',
      icon: Presentation,
      iconBg: 'bg-orange-500/10 text-orange-600 border-orange-300/40',
      description: 'Convert PDF document pages into formatted PowerPoint presentation slides (.pptx).',
      count: fileCounts['pdf-to-powerpoint'] || 0,
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF to EXCEL',
      badge: 'Tables',
      icon: Table,
      iconBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-300/40',
      description: 'Extract tables, rows, invoices, and numbers from PDF into Excel CSV format.',
      count: fileCounts['pdf-to-excel'] || 0,
    },
    {
      id: 'pdf-to-pdfa',
      name: 'PDF to PDF/A',
      badge: 'Archival',
      icon: Archive,
      iconBg: 'bg-slate-500/10 text-slate-700 border-slate-300/40',
      description: 'Convert PDF to ISO 19005 compliant archival PDF/A format with color profiles.',
      count: fileCounts['pdf-to-pdfa'] || 0,
    },
  ];

  return (
    <div className="space-y-12 py-6 max-w-5xl mx-auto w-full">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B7147]/10 border border-[#5B7147]/25 text-[#435433] text-xs font-bold uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#5B7147]" />
          <span>Local PDF Productivity Engine</span>
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
          className="text-[#657357] text-sm sm:text-base max-w-xl mx-auto font-medium"
        >
          No logins. No subscriptions. No cloud servers. Fast, secure, and unlimited PDF operations executing directly in your local browser environment.
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

      {/* Core PDF Productivity Tools */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-[#1E2619] flex items-center gap-2">
            <span>Essential PDF Tools</span>
            <span className="text-xs font-normal text-[#758467]">
              (High Performance In-Browser)
            </span>
          </h3>
          <span className="text-xs text-[#50633E] font-mono font-semibold">
            {coreTools.length} Active
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {coreTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                onClick={() => onSelectTool(tool.id)}
                className="group relative rounded-2xl p-5 border bg-white hover:bg-[#FDFCFB] border-[#DDD3C2] hover:border-[#5B7147]/60 shadow-md hover:shadow-xl shadow-stone-900/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-md shadow-[#5B7147]/20 shrink-0 border border-white/20`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433] border border-[#5B7147]/25">
                      {tool.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#1E2619] group-hover:text-[#5B7147] transition-colors mb-1">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-[#667258] leading-relaxed mb-4">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between text-xs font-bold text-[#5B7147]">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Conversion Suite (2 Columns matching user screenshot) */}
      <div className="grid md:grid-cols-2 gap-6 pt-2">
        {/* Column 1: CONVERT TO PDF */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#DDD3C2] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8E1D5]">
            <div className="w-8 h-8 rounded-lg bg-[#5B7147]/15 text-[#5B7147] flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#1E2619]">
                CONVERT TO PDF
              </h3>
              <p className="text-[11px] text-[#718063]">
                Transform images, Office docs & web code into clean PDF files
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {convertToPdfTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#FAF8F4] border border-[#E8E1D5] hover:border-[#5B7147]/50 shadow-sm transition-all duration-150 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${tool.iconBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#1E2619] group-hover:text-[#5B7147] transition-colors truncate">
                          {tool.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FAF8F4] text-[#6B795D] border border-[#DDD3C2]">
                          {tool.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#78856B] truncate mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {tool.count > 0 && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433]">
                        {tool.count} loaded
                      </span>
                    )}
                    <div className="w-7 h-7 rounded-lg bg-[#FAF8F4] group-hover:bg-[#5B7147] text-[#5B7147] group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: CONVERT FROM PDF */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-[#DDD3C2] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8E1D5]">
            <div className="w-8 h-8 rounded-lg bg-[#435433]/15 text-[#435433] flex items-center justify-center">
              <ArrowUpFromLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wider uppercase text-[#1E2619]">
                CONVERT FROM PDF
              </h3>
              <p className="text-[11px] text-[#718063]">
                Extract images, editable Word documents, Excel tables & slides
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {convertFromPdfTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#FAF8F4] border border-[#E8E1D5] hover:border-[#5B7147]/50 shadow-sm transition-all duration-150 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${tool.iconBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#1E2619] group-hover:text-[#5B7147] transition-colors truncate">
                          {tool.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FAF8F4] text-[#6B795D] border border-[#DDD3C2]">
                          {tool.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#78856B] truncate mt-0.5">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {tool.count > 0 && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433]">
                        {tool.count} loaded
                      </span>
                    )}
                    <div className="w-7 h-7 rounded-lg bg-[#FAF8F4] group-hover:bg-[#5B7147] text-[#5B7147] group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature & Privacy Highlights */}
      <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5DDD0]">
        <div className="bg-white/80 border border-[#DDD3C2] rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#5B7147] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-[#1E2619]">100% Client-Side</h5>
            <p className="text-[11px] text-[#6B785E] mt-0.5">
              Documents never touch the network. All memory buffers stay in your local browser.
            </p>
          </div>
        </div>

        <div className="bg-white/80 border border-[#DDD3C2] rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <Zap className="w-5 h-5 text-[#6E8558] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-[#1E2619]">High-Speed In-Memory</h5>
            <p className="text-[11px] text-[#6B785E] mt-0.5">
              Powered by native WebAssembly, OffscreenCanvas, and OpenXML engines.
            </p>
          </div>
        </div>

        <div className="bg-white/80 border border-[#DDD3C2] rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <Lock className="w-5 h-5 text-[#50633E] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-[#1E2619]">Zero Tracking or Logs</h5>
            <p className="text-[11px] text-[#6B785E] mt-0.5">
              Zero cookies, zero external telemetry, zero document uploads. Completely private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
