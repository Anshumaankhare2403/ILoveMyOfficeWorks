import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Scissors,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Stamp,
  Minimize2,
  FileText,
  Lock,
} from 'lucide-react';
import Uploader from './Uploader';

export default function HomeScreen({ onSelectTool, onQuickUpload, fileCounts = {} }) {
  const tools = [
    {
      id: 'merge',
      name: 'PDF Merger',
      status: 'Active',
      badge: 'Multi-PDF',
      icon: Layers,
      color: 'from-[#5B7147] to-[#435433]',
      description:
        'Combine unlimited PDF documents sequentially with custom page ordering and instant preview.',
      features: ['Unlimited file count', 'Drag & drop reordering', '100% private in-memory'],
      actionText: 'Open PDF Merger',
      count: fileCounts.merge || 0,
    },
    {
      id: 'split',
      name: 'PDF Splitter',
      status: 'Active',
      badge: 'Extractor',
      icon: Scissors,
      color: 'from-[#6E8558] to-[#50633E]',
      description:
        'Extract custom page ranges or break large documents into fixed chunks of N pages.',
      features: ['Range syntax (e.g. 1-3, 5)', 'Fixed chunks of N pages', 'ZIP archive download'],
      actionText: 'Open PDF Splitter',
      count: fileCounts.split || 0,
    },
    {
      id: 'compress',
      name: 'PDF Compressor',
      status: 'Active',
      badge: 'Optimizer',
      icon: Minimize2,
      color: 'from-[#50633E] to-[#3B4A2D]',
      description:
        'Shrink document size with smart image downsampling, bloat purging, and object stream packing.',
      features: ['Balanced, Extreme & Light modes', 'In-place image compression', 'Up to 85% size reduction'],
      actionText: 'Open PDF Compressor',
      disabled: false,
      count: fileCounts.compress || 0,
    },
    {
      id: 'docx',
      name: 'PDF to Word (DOCX)',
      status: 'Active',
      badge: 'OpenXML',
      icon: FileText,
      color: 'from-[#647C50] to-[#475936]',
      description:
        'Convert PDF documents into fully editable Microsoft Word (.docx) files with typography and layout.',
      features: ['Flowable editable paragraphs', 'Auto-heading detection', 'Scanned page visual fallback'],
      actionText: 'Open PDF to Word',
      disabled: false,
      count: fileCounts.docx || fileCounts['pdf-to-docx'] || 0,
    },
    {
      id: 'watermark',
      name: 'Watermark & Stamp',
      status: 'Roadmap',
      badge: 'Coming Soon',
      icon: Stamp,
      color: 'from-[#8A9B75] to-[#687955]',
      description:
        'Apply stamps, dynamic page numbering, custom headers, and text watermarks.',
      features: ['Custom opacity & rotation', 'Header & footer numbers', 'Blank page insert'],
      actionText: 'Coming Soon',
      disabled: true,
    },
  ];

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto w-full">
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
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto"
      >
        <Uploader onFilesAdded={onQuickUpload} />
      </motion.div>

      {/* Tool Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-[#1E2619] flex items-center gap-2">
            <span>Productivity Toolkit</span>
            <span className="text-xs font-normal text-[#758467]">
              (Modular In-Browser Adapters)
            </span>
          </h3>
          <span className="text-xs text-[#50633E] font-mono font-semibold">
            {tools.filter((t) => !t.disabled).length} Ready
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + idx * 0.08 }}
                className={`relative rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                  tool.disabled
                    ? 'bg-white/60 border-[#E8E1D5] opacity-60'
                    : 'bg-white hover:bg-[#FDFCFB] border-[#DDD3C2] hover:border-[#5B7147]/60 shadow-md hover:shadow-xl shadow-stone-900/5'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-md shadow-[#5B7147]/20 shrink-0 border border-white/20`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          tool.disabled
                            ? 'bg-[#EBE4D8] text-[#6E7B62] border border-[#DDD3C4]'
                            : 'bg-[#5B7147]/10 text-[#435433] border border-[#5B7147]/25'
                        }`}
                      >
                        {tool.badge}
                      </span>
                      {tool.count > 0 && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EDE7DC] text-[#3F4832] border border-[#CBD5BD]">
                          {tool.count} loaded
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-[#1E2619] mb-1.5">{tool.name}</h4>
                  <p className="text-xs sm:text-sm text-[#667258] mb-4 leading-relaxed">{tool.description}</p>

                  <ul className="space-y-1.5 mb-6 text-xs text-[#525E46]">
                    {tool.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5B7147]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={tool.disabled}
                  onClick={() => onSelectTool(tool.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    tool.disabled
                      ? 'bg-[#EBE4D8]/60 text-[#8C987E] cursor-not-allowed border border-[#DDD3C4]'
                      : 'bg-gradient-to-r from-[#5B7147] via-[#52663F] to-[#435433] hover:from-[#52663F] hover:to-[#38462B] text-white shadow-md shadow-[#5B7147]/20 active:scale-[0.99]'
                  }`}
                >
                  <span>{tool.actionText}</span>
                  {!tool.disabled && <ArrowRight className="w-4 h-4" />}
                </button>
              </motion.div>
            );
          })}
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
