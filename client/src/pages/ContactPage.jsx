import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Globe, HelpCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContactPage() {
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
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Contact & Support</h1>
            <p className="text-xs text-[#6B795D]">
              Open-Source Inquiries, Feedback & Bug Reports
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
          <h2 className="text-base font-bold text-[#1E2619]">Get in Touch</h2>
          <p className="text-[#556348]">
            Have an enhancement request, found a malformed PDF edge-case, or need assistance configuring the local Ghostscript environment? Reach out via our project repository or support channels below:
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#E2DAD0] space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-[#1E2619]">
              <Globe className="w-4 h-4 text-[#5B7147]" />
              <span>Project Repository</span>
            </div>
            <p className="text-xs text-[#6B795D]">
              Report bugs, submit tool adapter PRs, and explore the open source architecture.
            </p>
            <span className="font-mono text-xs text-[#5B7147] font-semibold">
              github.com/Anshumaankhare2403/ILoveMyOfficeWorks
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#E2DAD0] space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-[#1E2619]">
              <ShieldCheck className="w-4 h-4 text-[#5B7147]" />
              <span>Security & Privacy Inquiries</span>
            </div>
            <p className="text-xs text-[#6B795D]">
              Security audits and vulnerability disclosures are handled with highest priority.
            </p>
            <span className="font-mono text-xs text-[#5B7147] font-semibold">
              privacy@ilovemyofficeworks.local
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
