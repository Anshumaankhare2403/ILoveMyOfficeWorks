import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ServerOff, EyeOff, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-[#6B795D]">
              100% Client-Side Privacy Guarantee • Last updated: 2026
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
          <h2 className="text-base font-bold text-[#1E2619] flex items-center gap-2">
            <ServerOff className="w-4 h-4 text-[#5B7147]" />
            1. Non-Negotiable Core Principle: Zero Cloud Data Transmission
          </h2>
          <p className="text-[#556348]">
            <strong>ILoveMyOfficeWorks</strong> is engineered strictly as a client-side document productivity toolkit. When you merge, split, compress, or convert documents and images, your files <strong>never leave your device</strong>. Processing occurs entirely inside your local browser memory using WebAssembly, HTML5 Canvas, and modern JavaScript engines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1E2619] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#5B7147]" />
            2. No Document Uploads or Storage
          </h2>
          <p className="text-[#556348]">
            We do not operate remote file-storage servers, intermediate cloud caches, or third-party transformation APIs. Your document bytes and canvas pixels are loaded into temporary browser memory buffers and discarded immediately once you clear your queue or close the window.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1E2619] flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-[#5B7147]" />
            3. Zero Document Telemetry & Tracking
          </h2>
          <p className="text-[#556348]">
            No document tracking pixels, advertising cookies, or behavioral surveillance trackers inspect your documents. The application requires no account registration, login credentials, or personal identification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#1E2619]">
            4. Local Execution & Ghostscript Helper
          </h2>
          <p className="text-[#556348]">
            The optional local backend server only connects over your machine's private IPv4 loopback (<code className="bg-[#FAF8F4] px-1.5 py-0.5 rounded border border-[#E8E1D5] text-xs">127.0.0.1:3001</code>) if you explicitly install Ghostscript on your computer. Even without it, all 35 tools function 100% standalone directly in the browser.
          </p>
        </section>
      </div>
    </motion.div>
  );
}
