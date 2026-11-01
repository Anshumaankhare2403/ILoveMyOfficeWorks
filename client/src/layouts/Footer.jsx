import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';

/**
 * Standard Application Footer displaying client-side engine status & navigation/legal links
 */
export default function Footer({ onShowSplash }) {
  return (
    <footer className="relative z-10 border-t border-[#E8E1D5] bg-[#FAF8F4]/90 backdrop-blur-md py-6 mt-auto select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#738067]">
          {/* Left: Engine Status */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5B7147] animate-pulse" />
            <span className="font-semibold text-[#262D20]">
              ILoveMyOfficeWorks Engine Ready
            </span>
            <span className="text-[#96A48B]">•</span>
            <span>100% Private Client-Side Processing</span>
          </div>

          {/* Center: Legal & Information Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#556348]">
            <Link
              to="/about"
              className="hover:text-[#1E2619] transition-colors"
            >
              About
            </Link>
            <span className="text-[#DDD3C2]">•</span>
            <Link
              to="/privacy"
              className="hover:text-[#1E2619] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-[#DDD3C2]">•</span>
            <Link
              to="/terms"
              className="hover:text-[#1E2619] transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-[#DDD3C2]">•</span>
            <Link
              to="/contact"
              className="hover:text-[#1E2619] transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right: Replay Splash Button */}
          {onShowSplash && (
            <button
              type="button"
              onClick={onShowSplash}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F4] border border-[#DDD3C2] text-[#435433] text-[11px] font-bold shadow-2xs transition-all cursor-pointer hover:border-[#5B7147]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5B7147]" />
              <span>Replay Splash Screen</span>
            </button>
          )}
        </div>

        <div className="border-t border-[#F0EAE1] pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#8B987E]">
          <div>
            © {new Date().getFullYear()} ILoveMyOfficeWorks • Zero Cloud Uploads • Open & Private
          </div>
          <div className="font-mono text-[10px]">
            Personal PDF & Image Toolkit • Localhost Verified
          </div>
        </div>
      </div>
    </footer>
  );
}
