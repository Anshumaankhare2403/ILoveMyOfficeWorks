import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ChevronDown,
  Layers,
  Scissors,
  Minimize2,
  FileText,
  Image as ImageIcon,
  Table,
  Presentation,
  Globe,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  Menu,
  X,
  ShieldCheck,
  Trash2,
  FileDown,
  ArrowUpDown,
  Camera,
  Wrench,
  FileSearch,
  RotateCw,
  Hash,
  Stamp,
  Crop,
  PenTool,
  FileSpreadsheet,
  Unlock,
  Shield,
  CheckSquare,
  EyeOff,
  GitCompare,
  Grid,
  Maximize2,
} from 'lucide-react';

export default function Navbar({ activeTab, onTabChange, fileCounts = {} }) {
  const [openDropdown, setOpenDropdown] = useState(null); // 'organize' | 'optimize' | 'convert' | 'edit' | 'security' | 'image' | 'allTools' | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSectionOpen, setMobileSectionOpen] = useState('organize');
  const closeTimerRef = useRef(null);
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

  // Hover handlers with smooth debounce so moving mouse to dropdown doesn't flicker
  const handleMouseEnter = (menuId) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(menuId);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  // 1. Organize PDF
  const organizeTools = [
    {
      id: 'merge-pdf',
      name: 'Merge PDF',
      desc: 'Combine multiple PDFs into one document',
      badge: 'Combine',
      icon: Layers,
      iconColor: 'text-rose-600 bg-rose-50 border-rose-200/60',
      count: fileCounts['merge-pdf'] || fileCounts.merge || 0,
    },
    {
      id: 'split-pdf',
      name: 'Split PDF',
      desc: 'Extract page ranges or split every N pages',
      badge: 'Split',
      icon: Scissors,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200/60',
      count: fileCounts['split-pdf'] || fileCounts.split || 0,
    },
    {
      id: 'remove-pages',
      name: 'Remove pages',
      desc: 'Delete unwanted or blank pages from PDF',
      badge: 'Delete',
      icon: Trash2,
      iconColor: 'text-red-600 bg-red-50 border-red-200/60',
      count: fileCounts['remove-pages'] || 0,
    },
    {
      id: 'extract-pages',
      name: 'Extract pages',
      desc: 'Extract selected pages into a new PDF',
      badge: 'Extract',
      icon: FileDown,
      iconColor: 'text-orange-600 bg-orange-50 border-orange-200/60',
      count: fileCounts['extract-pages'] || 0,
    },
    {
      id: 'organize-pdf',
      name: 'Organize PDF',
      desc: 'Reorder, reverse, or rearrange pages',
      badge: 'Reorder',
      icon: ArrowUpDown,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200/60',
      count: fileCounts['organize-pdf'] || 0,
    },
    {
      id: 'scan-to-pdf',
      name: 'Scan to PDF',
      desc: 'Convert photo scans into clean PDF',
      badge: 'Scan',
      icon: Camera,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
      count: fileCounts['scan-to-pdf'] || 0,
    },
  ];

  // 2. Optimize PDF
  const optimizeTools = [
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      desc: 'Shrink document size with smart downsampling',
      badge: 'Compress',
      icon: Minimize2,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
      count: fileCounts['compress-pdf'] || fileCounts.compress || 0,
    },
    {
      id: 'repair-pdf',
      name: 'Repair PDF',
      desc: 'Rebuild damaged structure & corrupt streams',
      badge: 'Repair',
      icon: Wrench,
      iconColor: 'text-teal-600 bg-teal-50 border-teal-200/60',
      count: fileCounts['repair-pdf'] || 0,
    },
    {
      id: 'ocr-pdf',
      name: 'OCR PDF',
      desc: 'Recognize scanned text into searchable overlay',
      badge: 'OCR',
      icon: FileSearch,
      iconColor: 'text-cyan-600 bg-cyan-50 border-cyan-200/60',
      count: fileCounts['ocr-pdf'] || 0,
    },
  ];

  // 3. Convert to PDF
  const convertToPdfTools = [
    {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      desc: 'Convert JPG, PNG, WebP images into PDF',
      badge: 'Images',
      icon: ImageIcon,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200/60',
      count: fileCounts['jpg-to-pdf'] || 0,
    },
    {
      id: 'word-to-pdf',
      name: 'WORD to PDF',
      desc: 'Convert Word (.docx) documents to PDF',
      badge: 'Word',
      icon: FileText,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200/60',
      count: fileCounts['word-to-pdf'] || 0,
    },
    {
      id: 'powerpoint-to-pdf',
      name: 'POWERPOINT to PDF',
      desc: 'Convert PowerPoint (.pptx) into landscape slides',
      badge: 'Slides',
      icon: Presentation,
      iconColor: 'text-orange-600 bg-orange-50 border-orange-200/60',
      count: fileCounts['powerpoint-to-pdf'] || 0,
    },
    {
      id: 'excel-to-pdf',
      name: 'EXCEL to PDF',
      desc: 'Convert spreadsheets & CSV tables into PDF',
      badge: 'Excel',
      icon: Table,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
      count: fileCounts['excel-to-pdf'] || 0,
    },
    {
      id: 'html-to-pdf',
      name: 'HTML to PDF',
      desc: 'Convert HTML webpages and code to clean PDF',
      badge: 'Web',
      icon: Globe,
      iconColor: 'text-amber-700 bg-amber-50 border-amber-200/60',
      count: fileCounts['html-to-pdf'] || 0,
    },
  ];

  // 4. Convert from PDF
  const convertFromPdfTools = [
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      desc: 'Convert PDF pages into high-res JPG/PNG images',
      badge: 'Images',
      icon: ImageIcon,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200/60',
      count: fileCounts['pdf-to-jpg'] || 0,
    },
    {
      id: 'pdf-to-docx',
      name: 'PDF to WORD',
      desc: 'Convert PDF into editable Microsoft Word (.docx)',
      badge: 'Word',
      icon: FileText,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200/60',
      count: fileCounts['pdf-to-docx'] || fileCounts.docx || 0,
    },
    {
      id: 'pdf-to-powerpoint',
      name: 'PDF to POWERPOINT',
      desc: 'Convert PDF document pages to PowerPoint (.pptx)',
      badge: 'Slides',
      icon: Presentation,
      iconColor: 'text-orange-600 bg-orange-50 border-orange-200/60',
      count: fileCounts['pdf-to-powerpoint'] || 0,
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF to EXCEL',
      desc: 'Extract tables, rows & data into Excel CSV',
      badge: 'Excel',
      icon: Table,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
      count: fileCounts['pdf-to-excel'] || 0,
    },
    {
      id: 'pdf-to-pdfa',
      name: 'PDF to PDF/A',
      desc: 'Convert PDF into ISO archival PDF/A standard',
      badge: 'Archival',
      icon: Archive,
      iconColor: 'text-slate-700 bg-slate-50 border-slate-200/60',
      count: fileCounts['pdf-to-pdfa'] || 0,
    },
  ];

  // 5. Edit PDF
  const editTools = [
    {
      id: 'rotate-pdf',
      name: 'Rotate PDF',
      desc: 'Rotate pages clockwise by 90°, 180°, or 270°',
      badge: 'Rotate',
      icon: RotateCw,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-200/60',
      count: fileCounts['rotate-pdf'] || 0,
    },
    {
      id: 'add-page-numbers',
      name: 'Add page numbers',
      desc: 'Insert customizable page numbering & footers',
      badge: 'Numbers',
      icon: Hash,
      iconColor: 'text-violet-600 bg-violet-50 border-violet-200/60',
      count: fileCounts['add-page-numbers'] || 0,
    },
    {
      id: 'add-watermark',
      name: 'Add watermark',
      desc: 'Stamp custom text or security watermarks',
      badge: 'Stamp',
      icon: Stamp,
      iconColor: 'text-pink-600 bg-pink-50 border-pink-200/60',
      count: fileCounts['add-watermark'] || 0,
    },
    {
      id: 'crop-pdf',
      name: 'Crop PDF',
      desc: 'Trim margins and crop page dimensions',
      badge: 'Crop',
      icon: Crop,
      iconColor: 'text-rose-600 bg-rose-50 border-rose-200/60',
      count: fileCounts['crop-pdf'] || 0,
    },
    {
      id: 'edit-pdf',
      name: 'Edit PDF',
      desc: 'Add custom text notes, stamps & annotations',
      badge: 'Notes',
      icon: PenTool,
      iconColor: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200/60',
      count: fileCounts['edit-pdf'] || 0,
    },
    {
      id: 'pdf-forms',
      name: 'PDF Forms',
      desc: 'Flatten interactive form fields or lock inputs',
      badge: 'Forms',
      icon: FileSpreadsheet,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200/60',
      count: fileCounts['pdf-forms'] || 0,
    },
  ];

  // 6. PDF Security
  const securityTools = [
    {
      id: 'unlock-pdf',
      name: 'Unlock PDF',
      desc: 'Remove password protection & restrictions',
      badge: 'Decrypt',
      icon: Unlock,
      iconColor: 'text-sky-600 bg-sky-50 border-sky-200/60',
      count: fileCounts['unlock-pdf'] || 0,
    },
    {
      id: 'protect-pdf',
      name: 'Protect PDF',
      desc: 'Encrypt PDF with AES password protection',
      badge: 'Encrypt',
      icon: Shield,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200/60',
      count: fileCounts['protect-pdf'] || 0,
    },
    {
      id: 'sign-pdf',
      name: 'Sign PDF',
      desc: 'Apply electronic signature badge & verification',
      badge: 'Sign',
      icon: CheckSquare,
      iconColor: 'text-teal-600 bg-teal-50 border-teal-200/60',
      count: fileCounts['sign-pdf'] || 0,
    },
    {
      id: 'redact-pdf',
      name: 'Redact PDF',
      desc: 'Permanently blackout sensitive information',
      badge: 'Redact',
      icon: EyeOff,
      iconColor: 'text-slate-700 bg-slate-50 border-slate-200/60',
      count: fileCounts['redact-pdf'] || 0,
    },
    {
      id: 'compare-pdf',
      name: 'Compare PDF',
      desc: 'Compare 2 PDFs side-by-side with audit diff',
      badge: 'Audit',
      icon: GitCompare,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200/60',
      count: fileCounts['compare-pdf'] || 0,
    },
  ];

  // 7. Image Tools (from user request)
  const imageTools = [
    {
      id: 'compress-image',
      name: 'Compress Image',
      desc: 'Shrink JPG, PNG, and WebP with smart Canvas re-encoding',
      badge: 'Optimize',
      icon: Minimize2,
      iconColor: 'text-teal-600 bg-teal-50 border-teal-200/60',
      count: fileCounts['compress-image'] || 0,
    },
    {
      id: 'resize-image',
      name: 'Resize Image',
      desc: 'Change dimensions by percentage scale or exact pixels',
      badge: 'Resize',
      icon: Maximize2,
      iconColor: 'text-sky-600 bg-sky-50 border-sky-200/60',
      count: fileCounts['resize-image'] || 0,
    },
    {
      id: 'crop-image',
      name: 'Crop Image',
      desc: 'Crop photos with preset aspect ratios (1:1, 16:9, 4:3)',
      badge: 'Crop',
      icon: Crop,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
      count: fileCounts['crop-image'] || 0,
    },
    {
      id: 'convert-to-jpg',
      name: 'Convert to JPG',
      desc: 'Convert PNG, WebP, GIF, or SVG images into standard JPEG',
      badge: 'Convert',
      icon: ImageIcon,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200/60',
      count: fileCounts['convert-to-jpg'] || 0,
    },
  ];

  // Mega-menu columns (7 categories total)
  const megaColumns = [
    { title: 'ORGANIZE PDF', tools: organizeTools, color: 'text-rose-600' },
    { title: 'OPTIMIZE PDF', tools: optimizeTools, color: 'text-emerald-600' },
    { title: 'CONVERT TO PDF', tools: convertToPdfTools, color: 'text-amber-600' },
    { title: 'CONVERT FROM PDF', tools: convertFromPdfTools, color: 'text-blue-600' },
    { title: 'EDIT PDF', tools: editTools, color: 'text-purple-600' },
    { title: 'PDF SECURITY', tools: securityTools, color: 'text-sky-600' },
    { title: 'IMAGE TOOLS', tools: imageTools, color: 'text-teal-600' },
  ];

  // Mobile accordion sections
  const mobileSections = [
    { id: 'organize', label: 'Organize PDF', icon: Layers, tools: organizeTools },
    { id: 'optimize', label: 'Optimize PDF', icon: Minimize2, tools: optimizeTools },
    { id: 'toPdf', label: 'Convert to PDF', icon: ArrowDownToLine, tools: convertToPdfTools },
    { id: 'fromPdf', label: 'Convert from PDF', icon: ArrowUpFromLine, tools: convertFromPdfTools },
    { id: 'edit', label: 'Edit PDF', icon: PenTool, tools: editTools },
    { id: 'security', label: 'PDF Security', icon: Shield, tools: securityTools },
    { id: 'image', label: 'Image Tools', icon: ImageIcon, tools: imageTools },
  ];

  const handleSelectTool = (toolId) => {
    onTabChange(toolId);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const isToolActive = (toolId) => {
    return (
      activeTab === toolId ||
      (toolId === 'merge-pdf' && activeTab === 'merge') ||
      (toolId === 'split-pdf' && activeTab === 'split') ||
      (toolId === 'compress-pdf' && activeTab === 'compress') ||
      (toolId === 'pdf-to-docx' && activeTab === 'docx')
    );
  };

  const hasActiveTool = (toolList) => {
    return toolList.some((t) => isToolActive(t.id));
  };

  return (
    <header
      ref={navContainerRef}
      onMouseLeave={handleMouseLeave}
      className="relative z-50 bg-[#FAF8F4]/98 backdrop-blur-xl border-b border-[#E8E1D5] sticky top-0 transition-all select-none shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand & Logo (Clicking returns to Home) */}
        <button
          type="button"
          onClick={() => handleSelectTool('home')}
          className="flex items-center gap-3 text-left group transition-all shrink-0 cursor-pointer"
          title="Return to Home Dashboard"
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
              <span className="hidden xl:inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433] border border-[#5B7147]/20 whitespace-nowrap">
                33 Tools
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#6B795D] font-medium hidden sm:block whitespace-nowrap">
              Personal PDF & Image Toolkit • 100% Private
            </p>
          </div>
        </button>

        {/* Clean Desktop Navigation Bar (Home removed as requested) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {/* 1. Organize Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('organize')}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'organize' ? null : 'organize')}
              className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                hasActiveTool(organizeTools)
                  ? 'bg-[#5B7147] text-white shadow-sm'
                  : openDropdown === 'organize'
                  ? 'bg-white text-[#1E2619] shadow-sm'
                  : 'text-[#414E38] hover:text-[#1E2619] hover:bg-white/80'
              }`}
            >
              <span>Organize</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === 'organize' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'organize' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-[#DDD3C2] shadow-2xl shadow-stone-900/20 p-2.5 z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 border-b border-[#F0EAE1] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#6B795D] uppercase tracking-wider">
                      ORGANIZE PDF
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433]">
                      6 Tools
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    {organizeTools.map((tool) => {
                      const Icon = tool.icon;
                      const active = isToolActive(tool.id);
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => handleSelectTool(tool.id)}
                          className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-2.5 ${
                            active
                              ? 'bg-[#5B7147] text-white font-bold'
                              : 'hover:bg-[#FAF8F4] text-[#262D20]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                active ? 'bg-white/20 text-white border-white/30' : tool.iconColor
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold truncate block">{tool.name}</span>
                              <span
                                className={`text-[10px] truncate block ${
                                  active ? 'text-white/80' : 'text-[#78856B]'
                                }`}
                              >
                                {tool.desc}
                              </span>
                            </div>
                          </div>
                          {tool.count > 0 && (
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                                active ? 'bg-white/20 text-white' : 'bg-[#5B7147]/15 text-[#3D4C2B]'
                              }`}
                            >
                              {tool.count}
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

          {/* 2. Optimize Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('optimize')}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'optimize' ? null : 'optimize')}
              className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                hasActiveTool(optimizeTools)
                  ? 'bg-[#5B7147] text-white shadow-sm'
                  : openDropdown === 'optimize'
                  ? 'bg-white text-[#1E2619] shadow-sm'
                  : 'text-[#414E38] hover:text-[#1E2619] hover:bg-white/80'
              }`}
            >
              <span>Optimize</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === 'optimize' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'optimize' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-[#DDD3C2] shadow-2xl shadow-stone-900/20 p-2.5 z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 border-b border-[#F0EAE1] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#6B795D] uppercase tracking-wider">
                      OPTIMIZE PDF
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433]">
                      3 Tools
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    {optimizeTools.map((tool) => {
                      const Icon = tool.icon;
                      const active = isToolActive(tool.id);
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => handleSelectTool(tool.id)}
                          className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-2.5 ${
                            active
                              ? 'bg-[#5B7147] text-white font-bold'
                              : 'hover:bg-[#FAF8F4] text-[#262D20]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                active ? 'bg-white/20 text-white border-white/30' : tool.iconColor
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold truncate block">{tool.name}</span>
                              <span
                                className={`text-[10px] truncate block ${
                                  active ? 'text-white/80' : 'text-[#78856B]'
                                }`}
                              >
                                {tool.desc}
                              </span>
                            </div>
                          </div>
                          {tool.count > 0 && (
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                                active ? 'bg-white/20 text-white' : 'bg-[#5B7147]/15 text-[#3D4C2B]'
                              }`}
                            >
                              {tool.count}
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

          {/* 3. Convert Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('convert')}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'convert' ? null : 'convert')}
              className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                hasActiveTool([...convertToPdfTools, ...convertFromPdfTools])
                  ? 'bg-[#5B7147] text-white shadow-sm'
                  : openDropdown === 'convert'
                  ? 'bg-white text-[#1E2619] shadow-sm'
                  : 'text-[#414E38] hover:text-[#1E2619] hover:bg-white/80'
              }`}
            >
              <span>Convert</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === 'convert' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'convert' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[560px] bg-white rounded-2xl border border-[#DDD3C2] shadow-2xl shadow-stone-900/20 p-4 z-50 grid grid-cols-2 gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="pb-2 border-b border-[#F0EAE1] flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                        <span>CONVERT TO PDF</span>
                      </span>
                    </div>
                    <div className="space-y-1 pt-1">
                      {convertToPdfTools.map((tool) => {
                        const Icon = tool.icon;
                        const active = isToolActive(tool.id);
                        return (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => handleSelectTool(tool.id)}
                            className={`w-full text-left p-1.5 rounded-xl transition-all flex items-center justify-between gap-2 ${
                              active
                                ? 'bg-[#5B7147] text-white font-bold'
                                : 'hover:bg-[#FAF8F4] text-[#262D20]'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                                  active ? 'bg-white/20 text-white border-white/30' : tool.iconColor
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold truncate">{tool.name}</span>
                            </div>
                            <span
                              className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {tool.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5 pl-3 border-l border-[#F0EAE1]">
                    <div className="pb-2 border-b border-[#F0EAE1] flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                        <ArrowUpFromLine className="w-3.5 h-3.5" />
                        <span>CONVERT FROM PDF</span>
                      </span>
                    </div>
                    <div className="space-y-1 pt-1">
                      {convertFromPdfTools.map((tool) => {
                        const Icon = tool.icon;
                        const active = isToolActive(tool.id);
                        return (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => handleSelectTool(tool.id)}
                            className={`w-full text-left p-1.5 rounded-xl transition-all flex items-center justify-between gap-2 ${
                              active
                                ? 'bg-[#5B7147] text-white font-bold'
                                : 'hover:bg-[#FAF8F4] text-[#262D20]'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                                  active ? 'bg-white/20 text-white border-white/30' : tool.iconColor
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold truncate">{tool.name}</span>
                            </div>
                            <span
                              className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {tool.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. Edit Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('edit')}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'edit' ? null : 'edit')}
              className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                hasActiveTool(editTools)
                  ? 'bg-[#5B7147] text-white shadow-sm'
                  : openDropdown === 'edit'
                  ? 'bg-white text-[#1E2619] shadow-sm'
                  : 'text-[#414E38] hover:text-[#1E2619] hover:bg-white/80'
              }`}
            >
              <span>Edit</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === 'edit' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'edit' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-[#DDD3C2] shadow-2xl shadow-stone-900/20 p-2.5 z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 border-b border-[#F0EAE1] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#6B795D] uppercase tracking-wider">
                      EDIT PDF
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433]">
                      6 Tools
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    {editTools.map((tool) => {
                      const Icon = tool.icon;
                      const active = isToolActive(tool.id);
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => handleSelectTool(tool.id)}
                          className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-2.5 ${
                            active
                              ? 'bg-[#5B7147] text-white font-bold'
                              : 'hover:bg-[#FAF8F4] text-[#262D20]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                active ? 'bg-white/20 text-white border-white/30' : tool.iconColor
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold truncate block">{tool.name}</span>
                              <span
                                className={`text-[10px] truncate block ${
                                  active ? 'text-white/80' : 'text-[#78856B]'
                                }`}
                              >
                                {tool.desc}
                              </span>
                            </div>
                          </div>
                          {tool.count > 0 && (
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                                active ? 'bg-white/20 text-white' : 'bg-[#5B7147]/15 text-[#3D4C2B]'
                              }`}
                            >
                              {tool.count}
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

          {/* 5. Security Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('security')}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'security' ? null : 'security')}
              className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                hasActiveTool(securityTools)
                  ? 'bg-[#5B7147] text-white shadow-sm'
                  : openDropdown === 'security'
                  ? 'bg-white text-[#1E2619] shadow-sm'
                  : 'text-[#414E38] hover:text-[#1E2619] hover:bg-white/80'
              }`}
            >
              <span>Security</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === 'security' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'security' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-[#DDD3C2] shadow-2xl shadow-stone-900/20 p-2.5 z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 border-b border-[#F0EAE1] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#6B795D] uppercase tracking-wider">
                      PDF SECURITY
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#5B7147]/10 text-[#435433]">
                      5 Tools
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    {securityTools.map((tool) => {
                      const Icon = tool.icon;
                      const active = isToolActive(tool.id);
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => handleSelectTool(tool.id)}
                          className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-2.5 ${
                            active
                              ? 'bg-[#5B7147] text-white font-bold'
                              : 'hover:bg-[#FAF8F4] text-[#262D20]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                active ? 'bg-white/20 text-white border-white/30' : tool.iconColor
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold truncate block">{tool.name}</span>
                              <span
                                className={`text-[10px] truncate block ${
                                  active ? 'text-white/80' : 'text-[#78856B]'
                                }`}
                              >
                                {tool.desc}
                              </span>
                            </div>
                          </div>
                          {tool.count > 0 && (
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                                active ? 'bg-white/20 text-white' : 'bg-[#5B7147]/15 text-[#3D4C2B]'
                              }`}
                            >
                              {tool.count}
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

          {/* 6. Image Tools Dropdown (NEW!) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('image')}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'image' ? null : 'image')}
              className={`px-2.5 xl:px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                hasActiveTool(imageTools)
                  ? 'bg-[#5B7147] text-white shadow-sm'
                  : openDropdown === 'image'
                  ? 'bg-white text-[#1E2619] shadow-sm'
                  : 'text-[#414E38] hover:text-[#1E2619] hover:bg-white/80'
              }`}
            >
              <span>Image</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === 'image' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'image' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl border border-[#DDD3C2] shadow-2xl shadow-stone-900/20 p-2.5 z-50 space-y-1"
                >
                  <div className="px-3 py-1.5 border-b border-[#F0EAE1] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>IMAGE TOOLS</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 border border-teal-200">
                      4 Tools
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    {imageTools.map((tool) => {
                      const Icon = tool.icon;
                      const active = isToolActive(tool.id);
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => handleSelectTool(tool.id)}
                          className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-2.5 ${
                            active
                              ? 'bg-[#5B7147] text-white font-bold'
                              : 'hover:bg-[#FAF8F4] text-[#262D20]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                                active ? 'bg-white/20 text-white border-white/30' : tool.iconColor
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold truncate block">{tool.name}</span>
                              <span
                                className={`text-[10px] truncate block ${
                                  active ? 'text-white/80' : 'text-[#78856B]'
                                }`}
                              >
                                {tool.desc}
                              </span>
                            </div>
                          </div>
                          {tool.count > 0 && (
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                                active ? 'bg-white/20 text-white' : 'bg-[#5B7147]/15 text-[#3D4C2B]'
                              }`}
                            >
                              {tool.count}
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

          {/* 7. All PDF & Image Tools Mega-Menu */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('allTools')}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'allTools' ? null : 'allTools')}
              className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap border ${
                openDropdown === 'allTools'
                  ? 'bg-[#5B7147] text-white border-[#5B7147] shadow-sm'
                  : 'bg-[#EDE7DC]/80 hover:bg-[#E5DDD0] text-[#262D20] border-[#DDD3C2]'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#5B7147]" />
              <span>All Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  openDropdown === 'allTools' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Expansive Full-Width 7-Column Mega Menu */}
            <AnimatePresence>
              {openDropdown === 'allTools' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.99 }}
                  transition={{ duration: 0.15 }}
                  className="fixed left-4 right-4 top-[72px] max-w-7xl mx-auto bg-white rounded-3xl border border-[#DDD3C2] shadow-2xl shadow-stone-900/25 p-6 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F0EAE1]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#5B7147]" />
                      <span className="text-sm font-black text-[#1E2619] tracking-tight uppercase">
                        All Office & Image Tools Directory (33 Tools)
                      </span>
                    </div>
                    <span className="text-xs text-[#6B795D] font-medium">
                      100% In-Browser • Zero Cloud Transmission
                    </span>
                  </div>

                  {/* 7 Columns matching all categories */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {megaColumns.map((col, idx) => (
                      <div key={idx} className="space-y-2">
                        <h4 className={`text-xs font-black tracking-wider uppercase ${col.color}`}>
                          {col.title}
                        </h4>
                        <div className="space-y-1">
                          {col.tools.map((tool) => {
                            const Icon = tool.icon;
                            const active = isToolActive(tool.id);
                            return (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => handleSelectTool(tool.id)}
                                className={`w-full text-left py-1.5 px-2 rounded-lg transition-all flex items-center gap-2 group ${
                                  active
                                    ? 'bg-[#5B7147] text-white font-bold'
                                    : 'hover:bg-[#FAF8F4] text-[#2E3827]'
                                }`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
                                    active ? 'bg-white/20 text-white border-white/30' : tool.iconColor
                                  }`}
                                >
                                  <Icon className="w-3 h-3" />
                                </div>
                                <span className="text-[11px] font-semibold truncate group-hover:text-[#5B7147]">
                                  {tool.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Status Badge & Mobile Hamburger Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5B7147]/10 border border-[#5B7147]/20 text-[#3D4D2C]">
            <span className="w-2 h-2 rounded-full bg-[#5B7147] animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5 text-[#5B7147]" />
            <span className="text-[11px] font-bold whitespace-nowrap">100% Private</span>
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
            className="lg:hidden border-t border-[#E5DDD0] bg-white px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto"
          >
            {/* Accordion Sections for Mobile */}
            <div className="space-y-2">
              {mobileSections.map((section) => {
                const SectionIcon = section.icon;
                const isExpanded = mobileSectionOpen === section.id;
                const hasActive = hasActiveTool(section.tools);

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
                        {section.tools.map((item) => {
                          const Icon = item.icon;
                          const active = isToolActive(item.id);

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
