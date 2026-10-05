import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Layers,
  Scissors,
  Minimize2,
  Home,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar({ activeTab, onTabChange, fileCounts = {} }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    {
      id: 'merge',
      label: 'Merge PDFs',
      icon: Layers,
      count: fileCounts.merge || 0,
      badge: 'Multi-file',
    },
    {
      id: 'split',
      label: 'Split PDF',
      icon: Scissors,
      count: fileCounts.split || 0,
      badge: 'Ranges',
    },
    {
      id: 'compress',
      label: 'Compress PDF',
      icon: Minimize2,
      count: fileCounts.compress || 0,
      badge: 'Size',
    },
  ];

  return (
    <header className="relative z-20 bg-[#FAF8F4]/90 backdrop-blur-xl border-b border-[#E8E1D5] sticky top-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 text-left group transition-all"
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-[#8B9A6E] rounded-xl blur-md opacity-30 group-hover:opacity-60 transition-opacity" />
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#8B9A6E] to-[#6F7D53] text-white flex items-center justify-center shadow-md shadow-[#8B9A6E]/20">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#262D20] tracking-tight group-hover:text-[#55603F] transition-colors">
                ILoveMyOfficeWorks
              </h1>
              <span className="hidden md:inline-block text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#8B9A6E]/15 text-[#55603F] border border-[#8B9A6E]/25">
                v1.2 Local
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#6B785E]">
              Personal PDF Toolkit • Localhost
            </p>
          </div>
        </button>

        {/* Desktop / Tablet Navigation Switcher */}
        <nav className="hidden sm:flex items-center bg-[#EBE4D8]/60 p-1.5 rounded-2xl border border-[#DFD6C7] shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-white'
                    : 'text-[#58634B] hover:text-[#262D20] hover:bg-white/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#8B9A6E] to-[#718055] rounded-xl shadow-md shadow-[#8B9A6E]/25 border border-[#8B9A6E]/30"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.count > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#D5DEC7] text-[#3E4631]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#4E5941] bg-white/80 border border-[#E0D7C9] px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#8B9A6E] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold">100% Local</span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden flex items-center justify-around bg-[#FAF8F4]/95 border-t border-[#E8E1D5] py-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#6F7E53] font-bold'
                  : 'text-[#6B785E] hover:text-[#262D20] font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive ? 'bg-[#8B9A6E]/15 border border-[#8B9A6E]/25' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
