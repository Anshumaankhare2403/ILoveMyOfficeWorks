import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
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
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-xs text-[#6B795D]">
              Open & Private Document Toolkit Guidelines
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
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1E2619]">1. Permitted Use</h2>
          <p className="text-[#556348]">
            ILoveMyOfficeWorks is provided as a private, client-side toolkit for personal and professional document workflows. You may use all 35 tools to process, convert, edit, and organize documents freely.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1E2619]">2. Client-Side Execution & Responsibility</h2>
          <p className="text-[#556348]">
            Because all file modifications occur locally on your machine, you maintain sole ownership and responsibility for the content, integrity, and backup of your documents. No files are retained by ILoveMyOfficeWorks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1E2619]">3. Disclaimer of Warranty</h2>
          <p className="text-[#556348]">
            The software is provided "as is", without warranty of any kind, express or implied. In no event shall the authors or copyright holders be liable for any claim or damages resulting from the use of the tools.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
