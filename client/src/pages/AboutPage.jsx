import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, ShieldCheck, Layers, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TOTAL_TOOL_COUNT } from '../constants/tools';

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl mx-auto py-6 space-y-8 select-none text-[#262D20]"
    >
      <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B7147] to-[#435433] text-white flex items-center justify-center shadow-md shadow-[#5B7147]/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">About ILoveMyOfficeWorks</h1>
            <p className="text-xs text-[#6B795D]">
              The 100% Private, Zero-Cloud Document & Image Suite
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="text-xs text-[#3A4A2C] hover:text-[#1E2619] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#DDD3C2] hover:border-[#5B7147] shadow-sm transition-all font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="bg-white/85 border border-[#DDD3C2] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#1E2619]">Our Mission</h2>
          <p className="text-[#556348]">
            Popular online document utilities routinely require users to upload confidential contracts, financial spreadsheets, medical records, and personal photos to remote cloud servers.
          </p>
          <p className="text-[#556348]">
            <strong>ILoveMyOfficeWorks</strong> was built on a single uncompromising thesis: <strong>productivity does not require surrendering your privacy</strong>. Every tool in our suite runs directly inside your browser sandbox via WebAssembly and Canvas.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E2DAD0] space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-[#1E2619]">
              <Layers className="w-4 h-4 text-[#5B7147]" />
              <span>{TOTAL_TOOL_COUNT} Tools • 7 Suites</span>
            </div>
            <p className="text-[11px] text-[#6B795D]">
              Organize, Optimize, Convert, Edit, Sign, Protect, and Image processing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E2DAD0] space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-[#1E2619]">
              <Cpu className="w-4 h-4 text-[#5B7147]" />
              <span>Native Performance</span>
            </div>
            <p className="text-[11px] text-[#6B795D]">
              Streamlined with Web Workers and high-capacity batch queue processing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E2DAD0] space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-[#1E2619]">
              <ShieldCheck className="w-4 h-4 text-[#5B7147]" />
              <span>Triple Cross-Platform</span>
            </div>
            <p className="text-[11px] text-[#6B795D]">
              Available on Web, Windows Desktop (Electron), and Android (Flutter).
            </p>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
