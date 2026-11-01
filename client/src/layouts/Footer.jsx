import React from 'react';

/**
 * Standard Application Footer displaying client-side engine privacy guarantee
 */
export default function Footer() {
  return (
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
  );
}
