import React from 'react';
import { motion } from 'framer-motion';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Custom in-app 404 Page for unknown routes
 */
export default function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 select-none"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-[#5B7147]/10 text-[#435433] flex items-center justify-center border border-[#5B7147]/20 shadow-md">
          <FileQuestion className="w-10 h-10 text-[#5B7147]" />
        </div>
        <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#5B7147] text-white font-mono text-[11px] font-bold shadow-sm">
          404
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2619] tracking-tight mb-2">
        Page Not Found
      </h1>

      <p className="text-xs sm:text-sm text-[#6B795D] max-w-md mb-8 leading-relaxed">
        The requested address does not exist or may have been moved. All 35 local PDF and image tools are accessible from the main dashboard.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#5B7147] to-[#435433] text-white text-sm font-bold shadow-md shadow-[#5B7147]/20 hover:brightness-110 active:scale-[0.98] transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </motion.div>
  );
}
