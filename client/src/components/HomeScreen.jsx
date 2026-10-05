import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Scissors,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  FileCheck2,
  Stamp,
  Minimize2,
  Heart,
} from 'lucide-react';
import Uploader from './Uploader';

export default function HomeScreen({ onSelectTool, onQuickUpload, fileCounts = {} }) {
  const tools = [
    {
      id: 'merge',
      name: 'PDF Merger',
      status: 'Active',
      phase: 'Phase 1',
      icon: Layers,
      color: 'from-[#8B9A6E] to-[#6E7C52]',
      description:
        'Combine unlimited PDF documents sequentially with custom page ordering and instant preview.',
      features: ['Unlimited file count', 'Order rearrangement', 'Zero data leaves browser'],
      actionText: 'Open PDF Merger',
      count: fileCounts.merge || 0,
    },
    {
      id: 'split',
      name: 'PDF Splitter',
      status: 'Active',
      phase: 'Phase 2',
      icon: Scissors,
      color: 'from-[#A1B185] to-[#78885D]',
      description:
        'Extract custom page ranges or break large documents into fixed chunks of N pages.',
      features: ['Page range syntax (1-3, 5)', 'Fixed chunk size', 'ZIP archive download'],
      actionText: 'Open PDF Splitter',
      count: fileCounts.split || 0,
    },
    {
      id: 'watermark',
      name: 'Watermark & Numbers',
      status: 'Roadmap',
      phase: 'Phase 3',
      icon: Stamp,
      color: 'from-[#9FB186] to-[#76855B]',
      description:
        'Apply stamps, dynamic page numbering, custom headers, and text watermarks.',
      features: ['Custom opacity & rotation', 'Header & Footer', 'Blank page insert'],
      actionText: 'Phase 3 Preview',
      disabled: true,
    },
    {
      id: 'compress',
      name: 'PDF Compressor',
      status: 'Active',
      phase: 'Phase 5',
      icon: Minimize2,
      color: 'from-[#6E7C52] to-[#55603F]',
      description:
        'Reduce document size using object stream packing, metadata stripping, and optional Ghostscript.',
      features: ['In-browser optimization', 'Object stream packing', 'Local Ghostscript fallback'],
      actionText: 'Open PDF Compressor',
      disabled: false,
      count: fileCounts.compress || 0,
    },
  ];

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto w-full">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B9A6E]/15 border border-[#8B9A6E]/30 text-[#4E593D] text-xs font-bold uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8B9A6E]" />
          <span>Local PDF Productivity Engine</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-[#262D20] tracking-tight"
        >
          ILoveMyOfficeWorks
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#657357] text-sm sm:text-base max-w-xl mx-auto font-normal"
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
          <h3 className="text-base sm:text-lg font-bold text-[#262D20] flex items-center gap-2">
            <span>Toolkit Modules</span>
            <span className="text-xs font-normal text-[#758467]">
              (Modular Adapter Architecture)
            </span>
          </h3>
          <span className="text-xs text-[#55603F] font-mono font-semibold">
            {tools.filter((t) => !t.disabled).length} Ready • {tools.filter((t) => t.disabled).length} Upcoming
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
                transition={{ delay: 0.15 + idx * 0.1 }}
                className={`relative rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between ${
                  tool.disabled
                    ? 'bg-white/60 border-[#E8E1D5] opacity-65'
                    : 'bg-white hover:bg-[#FDFCFB] border-[#E2DAD0] hover:border-[#8B9A6E]/70 shadow-md hover:shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.color} text-white flex items-center justify-center shadow-md shadow-[#8B9A6E]/20 shrink-0`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          tool.disabled
                            ? 'bg-[#EBE4D8] text-[#6E7B62] border border-[#DDD3C4]'
                            : 'bg-[#8B9A6E]/15 text-[#4E593D] border border-[#8B9A6E]/30'
                        }`}
                      >
                        {tool.phase}
                      </span>
                      {tool.count > 0 && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EBE4D8] text-[#3F4832] border border-[#CBD5BD]">
                          {tool.count} loaded
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-[#262D20] mb-1.5">{tool.name}</h4>
                  <p className="text-xs sm:text-sm text-[#667258] mb-4">{tool.description}</p>

                  <ul className="space-y-1.5 mb-6 text-xs text-[#525E46]">
                    {tool.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B9A6E]" />
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
                      : 'bg-gradient-to-r from-[#8B9A6E] to-[#6E7C52] hover:from-[#7C8B5F] hover:to-[#647249] text-white shadow-md shadow-[#8B9A6E]/20'
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
      <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8E1D5]">
        <div className="bg-white/80 border border-[#E2DAD0] rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#8B9A6E] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-[#262D20]">100% Client-Side</h5>
            <p className="text-[11px] text-[#6B785E] mt-0.5">
              Documents never touch the network. All memory buffers stay in your browser.
            </p>
          </div>
        </div>

        <div className="bg-white/80 border border-[#E2DAD0] rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <Zap className="w-5 h-5 text-[#92A275] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-[#262D20]">Unlimited Multi-PDF</h5>
            <p className="text-[11px] text-[#6B785E] mt-0.5">
              No artificial file count limits. Merge or split as many documents as needed.
            </p>
          </div>
        </div>

        <div className="bg-white/80 border border-[#E2DAD0] rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <FileCheck2 className="w-5 h-5 text-[#8B9A6E] shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-bold text-[#262D20]">Magic Byte Verification</h5>
            <p className="text-[11px] text-[#6B785E] mt-0.5">
              Guards against spoofed formats, corrupt files, and flags password encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
