import React, { useState, useEffect } from 'react';
import { Minus, Square, Copy, X, ShieldCheck } from 'lucide-react';

export default function DesktopTitleBar() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI?.isDesktop) {
      setIsDesktop(true);

      // Check initial maximized state
      if (window.electronAPI.isMaximized) {
        window.electronAPI.isMaximized().then(setIsMaximized).catch(() => {});
      }

      // Listen for window state changes
      if (window.electronAPI.onMaximizeChange) {
        const unsubscribe = window.electronAPI.onMaximizeChange((maxState) => {
          setIsMaximized(maxState);
        });
        return unsubscribe;
      }
    }
  }, []);

  if (!isDesktop) {
    return null;
  }

  const handleMinimize = () => {
    window.electronAPI?.minimize?.();
  };

  const handleMaximize = () => {
    window.electronAPI?.maximize?.();
  };

  const handleClose = () => {
    window.electronAPI?.close?.();
  };

  return (
    <header
      className="h-10 w-full bg-[#FAF8F4] border-b border-[#E8E1D5] flex items-center justify-between px-3 select-none text-xs text-[#262D20] z-50 sticky top-0"
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* Left: App Identity */}
      <div className="flex items-center gap-2.5">
        <img
          src="./logo.png"
          alt="App Icon"
          className="w-5 h-5 rounded-md object-cover shadow-xs border border-[#DDD3C2]"
        />
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[12px] tracking-tight text-[#1E2619]">
            ILoveMy<span className="text-[#5B7147]">OfficeWorks</span>
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#5B7147]/10 text-[#435433] border border-[#5B7147]/20 uppercase tracking-wider">
            Windows Desktop
          </span>
        </div>
      </div>

      {/* Center: Privacy Notice & Safe Drag Region */}
      <div className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-[#6B795D]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#5B7147]" />
        <span>100% Private Offline Processing</span>
      </div>

      {/* Right: Windows Controls (No-Drag) */}
      <div
        className="flex items-center h-full -mr-3"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <button
          type="button"
          onClick={handleMinimize}
          className="h-10 w-11 inline-flex items-center justify-center text-[#435433] hover:bg-[#E8E1D5]/70 active:bg-[#DDD3C2] transition-colors"
          title="Minimize"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={handleMaximize}
          className="h-10 w-11 inline-flex items-center justify-center text-[#435433] hover:bg-[#E8E1D5]/70 active:bg-[#DDD3C2] transition-colors"
          title={isMaximized ? 'Restore Down' : 'Maximize'}
        >
          {isMaximized ? (
            <Copy className="w-3 h-3 rotate-180" />
          ) : (
            <Square className="w-3 h-3" />
          )}
        </button>

        <button
          type="button"
          onClick={handleClose}
          className="h-10 w-12 inline-flex items-center justify-center text-[#435433] hover:bg-[#E81123] hover:text-white active:bg-[#C4101E] transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
