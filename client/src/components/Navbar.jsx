import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Sparkles,
  ChevronDown,
  Layers,
  Scissors,
  Minimize2,
  FileText,
  Image,
  Table,
  Presentation,
  Globe,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar({ activeTab, onTabChange, fileCounts = {} }) {
  const [openDropdown, setOpenDropdown] = useState(null); // 'toPdf' | 'fromPdf' | 'pdfTools' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSectionOpen, setMobileSectionOpen] = useState('toPdf');
  const navContainerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dropdown sections definition
  const sections = [
    {
      id: 'toPdf',
      label: 'Convert to PDF',
      icon: ArrowDownToLine,
      color: 'text-amber-700 bg-amber-500/10 border-amber-300/40',
      items: [
        {
          id: 'jpg-to-pdf',
          name: 'JPG to PDF',
          desc: 'Convert JPG, PNG, and WebP images into a PDF',
          badge: 'Images',
          icon: Image,
          iconColor: 'text-amber-600 bg-amber-500/10',
          count: fileCounts['jpg-to-pdf'] || 0,
        },
        {
          id: 'word-to-pdf',
          name: 'WORD to PDF',
          desc: 'Convert Word documents (.docx) into vector PDF',
          badge: 'Word',
          icon: FileText,
          iconColor: 'text-blue-600 bg-blue-500/10',
          count: fileCounts['word-to-pdf'] || 0,
        },
        {
          id: 'powerpoint-to-pdf',
          name: 'POWERPOINT to PDF',
          desc: 'Convert PowerPoint (.pptx) into landscape slides',
          badge: 'Slides',
          icon: Presentation,
          iconColor: 'text-orange-600 bg-orange-500/10',
          count: fileCounts['powerpoint-to-pdf'] || 0,
        },
        {
          id: 'excel-to-pdf',
          name: 'EXCEL to PDF',
          desc: 'Convert Excel & CSV tables into formatted PDF',
          badge: 'Excel',
          icon: Table,
          iconColor: 'text-emerald-600 bg-emerald-500/10',
          count: fileCounts['excel-to-pdf'] || 0,
        },
        {
          id: 'html-to-pdf',
          name: 'HTML to PDF',
          desc: 'Convert HTML webpages and code into clean PDF',
          badge: 'Web',
          icon: Globe,
          iconColor: 'text-amber-700 bg-amber-500/10',
          count: fileCounts['html-to-pdf'] || 0,
        },
      ],
    },
    {
      id: 'fromPdf',
      label: 'Convert from PDF',
      icon: ArrowUpFromLine,
      color: 'text-emerald-700 bg-emerald-500/10 border-emerald-300/40',
      items: [
        {
          id: 'pdf-to-jpg',
          name: 'PDF to JPG',
          desc: 'Convert PDF pages into high-res JPG/PNG images',
          badge: 'Images',
          icon: Image,
          iconColor: 'text-amber-600 bg-amber-500/10',
          count: fileCounts['pdf-to-jpg'] || 0,
        },
        {
          id: 'pdf-to-docx',
          name: 'PDF to WORD',
          desc: 'Convert PDF into fully editable Microsoft Word (.docx)',
          badge: 'Word',
          icon: FileText,
          iconColor: 'text-blue-600 bg-blue-500/10',
          count: fileCounts['pdf-to-docx'] || fileCounts.docx || 0,
        },
        {
          id: 'pdf-to-powerpoint',
          name: 'PDF to POWERPOINT',
          desc: 'Convert PDF document pages into PowerPoint (.pptx)',
          badge: 'Slides',
          icon: Presentation,
          iconColor: 'text-orange-600 bg-orange-500/10',
          count: fileCounts['pdf-to-powerpoint'] || 0,
        },
        {
          id: 'pdf-to-excel',
          name: 'PDF to EXCEL',
          desc: 'Extract tables, rows, invoices & data into CSV',
          badge: 'Excel',
          icon: Table,
          iconColor: 'text-emerald-600 bg-emerald-500/10',
          count: fileCounts['pdf-to-excel'] || 0,
        },
        {
          id: 'pdf-to-pdfa',
          name: 'PDF to PDF/A',
          desc: 'Convert PDF into ISO archival PDF/A compliant format',
          badge: 'Archival',
          icon: Archive,
          iconColor: 'text-slate-700 bg-slate-500/10',
          count: fileCounts['pdf-to-pdfa'] || 0,
        },
      ],
    },
    {
      id: 'pdfTools',
      label: 'PDF Tools',
      icon: Layers,
      color: 'text-[#435433] bg-[#5B7147]/15 border-[#5B7147]/30',
      items: [
        {
          id: 'merge-pdf',
          name: 'Merge PDF',
          desc: 'Combine multiple PDF documents sequentially',
          badge: 'Multi-PDF',
          icon: Layers,
          iconColor: 'text-[#5B7147] bg-[#5B7147]/10',
          count: fileCounts.merge || fileCounts['merge-pdf'] || 0,
        },
        {
          id: 'split-pdf',
          name: 'Split PDF',
          desc: 'Extract page ranges or split every N pages',
          badge: 'Ranges',
          icon: Scissors,
          iconColor: 'text-[#6E8558] bg-[#6E8558]/10',
          count: fileCounts.split || fileCounts['split-pdf'] || 0,
        },
        {
          id: 'compress-pdf',
          name: 'Compress PDF',
          desc: 'Shrink document size with smart image downsampling',
          badge: 'Optimize',
          icon: Minimize2,
          iconColor: 'text-[#50633E] bg-[#50633E]/10',
          count: fileCounts.compress || fileCounts['compress-pdf'] || 0,
        },
      ],
    },
  ];

  const handleSelectTool = (toolId) => {
    onTabChange(toolId);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const isSectionActive = (section) => {
    return section.items.some(
      (item) =>
        activeTab === item.id ||
        (item.id === 'merge-pdf' && activeTab === 'merge') ||
        (item.id === 'split-pdf' && activeTab === 'split') ||
        (item.id === 'compress-pdf' && activeTab === 'compress') ||
        (item.id === 'pdf-to-docx' && activeTab === 'docx')
    );
  };

  const isItemActive = (itemId) => {
    return (
      activeTab === itemId ||
      (itemId === 'merge-pdf' && activeTab === 'merge') ||
      (itemId === 'split-pdf' && activeTab === 'split') ||
      (itemId === 'compress-pdf' && activeTab === 'compress') ||
      (itemId === 'pdf-to-docx' && activeTab === 'docx')
    );
  };

  return (
    <header
      ref={navContainerRef}
      className="relative z-40 bg-[#FAF8F4]/95 backdrop-blur-xl border-b border-[#E5DDD0] sticky top-0 transition-all select-none"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand & Logo */}
        <button
          type="button"
          onClick={() => handleSelectTool('home')}
          className="flex items-center gap-3 text-left group transition-all shrink-0"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#5B7147] rounded-xl blur-md opacity-25 group-hover:opacity-45 transition-opacity" />
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#5B7147] via-[#6B8354] to-[#435433] text-white flex items-center justify-center shadow-md shadow-[#5B7147]/20 border border-white/25">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-[#1E2619] tracking-tight group-hover:text-[#4A5E38] transition-colors whitespace-nowrap">
                ILoveMy<span className="text-[#5B7147]">OfficeWorks</span>
              </span>
              <span className="hidden md:inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433] border border-[#5B7147]/20 whitespace-nowrap">
                v1.2
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#6B795D] font-medium hidden sm:block whitespace-nowrap">
              Personal PDF Toolkit • 100% Private
            </p>
          </div>
        </button>

        {/* Desktop Dropdown Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#EDE7DC]/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#DDD3C2] shadow-sm">
          {/* Home Button */}
          <button
            type="button"
            onClick={() => handleSelectTool('home')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-[#5B7147] via-[#52663F] to-[#435433] text-white shadow-md shadow-[#5B7147]/25'
                : 'text-[#4E5C46] hover:text-[#1F291A] hover:bg-white/60'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Home</span>
          </button>

          {/* Section Dropdown Menus */}
          {sections.map((section) => {
            const SectionIcon = section.icon;
            const isOpen = openDropdown === section.id;
            const hasActiveChild = isSectionActive(section);

            return (
              <div key={section.id} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : section.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                    hasActiveChild
                      ? 'bg-gradient-to-r from-[#5B7147] via-[#52663F] to-[#435433] text-white shadow-md shadow-[#5B7147]/25'
                      : isOpen
                      ? 'bg-white text-[#1E2619] shadow-sm'
                      : 'text-[#4E5C46] hover:text-[#1F291A] hover:bg-white/60'
                  }`}
                >
                  <SectionIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span className="whitespace-nowrap">{section.label}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  </motion.div>
                </button>

                {/* Dropdown Menu Overlay */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-2xl rounded-2xl border border-[#DDD3C2] shadow-2xl shadow-stone-900/15 p-2 z-50 space-y-1"
                    >
                      <div className="px-3 py-1.5 border-b border-[#F0EAE1] flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#6B795D] uppercase tracking-wider">
                          {section.label}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433]">
                          {section.items.length} Tools
                        </span>
                      </div>

                      <div className="space-y-1 pt-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const active = isItemActive(item.id);

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelectTool(item.id)}
                              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 group ${
                                active
                                  ? 'bg-[#5B7147]/10 border border-[#5B7147]/30 text-[#1E2619]'
                                  : 'hover:bg-[#FAF8F4] text-[#3A4532]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-black/5 ${
                                    active ? 'bg-[#5B7147] text-white' : item.iconColor
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`text-xs font-bold truncate ${
                                        active
                                          ? 'text-[#5B7147]'
                                          : 'text-[#1E2619] group-hover:text-[#5B7147]'
                                      }`}
                                    >
                                      {item.name}
                                    </span>
                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/5 text-[#6B795D] whitespace-nowrap">
                                      {item.badge}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-[#78856B] truncate">
                                    {item.desc}
                                  </p>
                                </div>
                              </div>

                              {item.count > 0 && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#5B7147]/20 text-[#3D4C2B] shrink-0 whitespace-nowrap">
                                  {item.count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Right Badge & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#435433] bg-white/90 border border-[#DDD3C2] px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-sm whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B7147] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5B7147]"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#5B7147]" />
            <span className="text-[11px] font-bold">100% Private</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white border border-[#DDD3C2] text-[#435433] hover:bg-[#FAF8F4] shadow-sm transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-[#E5DDD0] bg-[#FAF8F4]/98 backdrop-blur-xl px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto"
          >
            {/* Quick Home */}
            <button
              type="button"
              onClick={() => handleSelectTool('home')}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-between border ${
                activeTab === 'home'
                  ? 'bg-[#5B7147] text-white border-[#5B7147]'
                  : 'bg-white text-[#262D20] border-[#DDD3C2]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Home Dashboard</span>
              </div>
              <span className="text-xs opacity-75">Overview</span>
            </button>

            {/* Accordion Sections */}
            <div className="space-y-2">
              {sections.map((section) => {
                const SectionIcon = section.icon;
                const isExpanded = mobileSectionOpen === section.id;
                const hasActive = isSectionActive(section);

                return (
                  <div
                    key={section.id}
                    className="rounded-2xl border border-[#DDD3C2] bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMobileSectionOpen(isExpanded ? null : section.id)
                      }
                      className={`w-full px-3.5 py-3 flex items-center justify-between text-xs font-bold transition-colors ${
                        hasActive ? 'bg-[#5B7147]/10 text-[#435433]' : 'text-[#262D20]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <SectionIcon className="w-4 h-4 text-[#5B7147]" />
                        <span>{section.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="p-2 space-y-1 bg-[#FAF8F4]/60 border-t border-[#F0EAE1]">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const active = isItemActive(item.id);

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelectTool(item.id)}
                              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-2.5 ${
                                active
                                  ? 'bg-[#5B7147] text-white font-bold'
                                  : 'hover:bg-white text-[#262D20]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                    active ? 'bg-white/20 text-white' : item.iconColor
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs truncate">{item.name}</span>
                              </div>
                              {item.count > 0 && (
                                <span
                                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                                    active
                                      ? 'bg-white/20 text-white'
                                      : 'bg-[#5B7147]/15 text-[#3D4C2B]'
                                  }`}
                                >
                                  {item.count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
