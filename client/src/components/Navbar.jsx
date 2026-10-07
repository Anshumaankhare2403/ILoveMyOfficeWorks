import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Scissors,
  Minimize2,
  FileText,
  Home,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function Navbar({ activeTab, onTabChange, fileCounts = {} }) {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'merge',
      label: 'Merge',
      icon: Layers,
      count: fileCounts.merge || 0,
      tooltip: 'Combine multiple PDFs',
    },
    {
      id: 'split',
      label: 'Split',
      icon: Scissors,
      count: fileCounts.split || 0,
      tooltip: 'Extract ranges or chunks',
    },
    {
      id: 'compress',
      label: 'Compress',
      icon: Minimize2,
      count: fileCounts.compress || 0,
      tooltip: 'Shrink PDF file size',
    },
    {
      id: 'docx',
      label: 'PDF to Word',
      icon: FileText,
      count: fileCounts.docx || fileCounts['pdf-to-docx'] || 0,
      tooltip: 'Convert to editable DOCX',
    },
  ];

  return (
    <header className="relative z-30 bg-[#FAF8F4]/90 backdrop-blur-xl border-b border-[#E5DDD0] sticky top-0 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand & Logo */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 text-left group transition-all shrink-0 select-none"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#5B7147] rounded-xl blur-md opacity-25 group-hover:opacity-45 transition-opacity" />
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#5B7147] via-[#6B8354] to-[#435433] text-white flex items-center justify-center shadow-md shadow-[#5B7147]/20 border border-white/25">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-[#1E2619] tracking-tight group-hover:text-[#4A5E38] transition-colors">
                ILoveMy<span className="text-[#5B7147]">OfficeWorks</span>
              </span>
              <span className="hidden md:inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433] border border-[#5B7147]/20">
                v1.2
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#6B795D] font-medium hidden sm:block">
              Personal PDF Toolkit • 100% Private
            </p>
          </div>
        </button>

        {/* Desktop / Tablet Navigation Switcher (Never wraps, sleek horizontal pill) */}
        <nav className="hidden sm:flex items-center bg-[#EDE7DC]/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#DDD3C2] shadow-sm overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const count = item.count || 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                title={item.tooltip}
                className={`relative px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-white'
                    : 'text-[#4E5C46] hover:text-[#1F291A] hover:bg-white/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#5B7147] via-[#52663F] to-[#435433] rounded-xl shadow-md shadow-[#5B7147]/25 border border-[#5B7147]/40"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#647458]'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full leading-none transition-colors ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-[#5B7147]/15 text-[#3D4C2B] border border-[#5B7147]/20'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#435433] bg-white/90 border border-[#DDD3C2] px-3 sm:px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B7147] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B7147]"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">Localhost</span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden flex items-center justify-around bg-[#FAF8F4]/95 border-t border-[#E5DDD0] py-1.5 px-2 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'text-[#435433] font-bold'
                  : 'text-[#6B795D] hover:text-[#1F271A] font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive ? 'bg-[#5B7147]/15 text-[#435433]' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
