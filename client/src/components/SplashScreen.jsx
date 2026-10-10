import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  Cpu,
  FileText,
  CheckCircle2,
  ArrowRight,
  Lock,
  Layers,
  Zap,
  Check,
} from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const steps = [
    {
      title: 'Initializing Browser Sandboxes',
      detail: 'Booting WebAssembly memory buffers & local canvas engine',
      icon: Cpu,
    },
    {
      title: 'Loading Core Document Converters',
      detail: 'Mounting pdf-lib, pdfjs-dist, and docx OpenXML engines',
      icon: FileText,
    },
    {
      title: 'Registering 33 Office & Image Tools',
      detail: 'Loading client adapters for PDF, DOCX, and high-res image manipulation',
      icon: Layers,
    },
    {
      title: 'Verifying Zero-Cloud Privacy Shield',
      detail: 'All documents stay 100% private in browser memory',
      icon: ShieldCheck,
    },
  ];

  useEffect(() => {
    // Stage 1: 0% -> 30% (350ms)
    const t1 = setTimeout(() => {
      setProgress(28);
      setCurrentStepIndex(1);
    }, 400);

    // Stage 2: 30% -> 65% (850ms)
    const t2 = setTimeout(() => {
      setProgress(64);
      setCurrentStepIndex(2);
    }, 900);

    // Stage 3: 65% -> 90% (1400ms)
    const t3 = setTimeout(() => {
      setProgress(90);
      setCurrentStepIndex(3);
    }, 1450);

    // Stage 4: 100% Complete (1950ms)
    const t4 = setTimeout(() => {
      setProgress(100);
      setIsReady(true);
    }, 2000);

    // Stage 5: Auto-transition if not clicked (2600ms)
    const t5 = setTimeout(() => {
      onComplete?.();
    }, 2700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  const featureBadges = [
    'Merge & Split',
    'PDF to DOCX',
    'Smart Compress',
    'Image Suite',
    'Protect & Redact',
    'OCR & Forms',
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F4] text-[#262D20] overflow-y-auto select-none px-4 py-6"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5B7147]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#E8E1D5]/70 rounded-full blur-[110px] pointer-events-none" />

      {/* Decorative Radial Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#5B7147_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

      {/* Top Bar with Skip Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={() => onComplete?.()}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#DDD3C2] text-xs font-semibold text-[#435433] shadow-sm backdrop-blur-md transition-all hover:border-[#5B7147]/40 cursor-pointer"
        >
          <span>Skip to Workspace</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        {/* Animated Brand Logo Container with Concentric Glow Rings */}
        <div className="relative mb-4">
          {/* Pulsing Concentric Rings */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.1, 0.35] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-5 rounded-full border border-[#5B7147]/30 pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.45, 1], opacity: [0.2, 0.05, 0.2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute -inset-10 rounded-full border border-[#5B7147]/20 pointer-events-none"
          />

          {/* Core Logo Glow */}
          <div className="absolute inset-0 bg-[#5B7147] rounded-3xl blur-2xl opacity-40 animate-pulse" />

          {/* Logo Card */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white p-1.5 shadow-2xl shadow-[#5B7147]/25 border-2 border-[#DDD3C2] overflow-hidden"
          >
            <img
              src="./logo.png"
              alt="ILoveMyOfficeWorks Brand Logo"
              className="w-full h-full object-cover rounded-[18px]"
            />
            {/* Shimmer Light Reflection Effect */}
            <motion.div
              initial={{ x: '-150%' }}
              animate={{ x: '200%' }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', repeatDelay: 1 }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
            />
          </motion.div>
        </div>

        {/* Brand Title & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-1"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B7147]/10 border border-[#5B7147]/20 text-[#435433] text-[11px] font-bold tracking-wider uppercase">
            <Lock className="w-3 h-3 text-[#5B7147]" />
            <span>100% Client-Side Privacy Guarantee</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1E2619]">
            ILoveMy<span className="text-[#5B7147]">OfficeWorks</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#5B6B50] font-medium max-w-sm mx-auto">
            Your private personal PDF & office document workspace. No cloud uploads. Zero data transmission.
          </p>
        </motion.div>

        {/* Dynamic Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-1.5 my-3 sm:my-4 max-w-md"
        >
          {featureBadges.map((badge, idx) => (
            <span
              key={badge}
              className="px-2.5 py-1 rounded-lg bg-white/70 border border-[#E8E1D5] text-[11px] font-medium text-[#435433] shadow-xs backdrop-blur-xs whitespace-nowrap"
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* Progress & Diagnostic Checklist Container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="w-full bg-white/80 rounded-2xl border border-[#DDD3C2] p-4 shadow-lg shadow-stone-900/5 backdrop-blur-md space-y-3.5"
        >
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#5B6B50] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#5B7147] animate-ping" />
                Booting Local Engines
              </span>
              <span className="text-[#435433] font-bold text-sm">{progress}%</span>
            </div>

            <div className="w-full bg-[#FAF8F4] border border-[#DDD3C2] h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#5B7147] via-[#6B8554] to-[#435433] rounded-full relative"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.4 }}
              >
                {/* Glowing Leading Dot */}
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full shadow-md" />
              </motion.div>
            </div>
          </div>

          {/* Stepped Diagnostic Status */}
          <div className="space-y-1.5 text-left border-t border-[#F0EAE1] pt-3">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isPassed = idx < currentStepIndex || isReady;
              const isCurrent = idx === currentStepIndex && !isReady;

              return (
                <div
                  key={step.title}
                  className={`flex items-center justify-between p-1.5 rounded-lg transition-all text-xs ${
                    isCurrent
                      ? 'bg-[#5B7147]/10 text-[#262D20] font-semibold'
                      : isPassed
                      ? 'text-[#435433]'
                      : 'text-[#8E9B82] opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        isPassed
                          ? 'bg-[#5B7147] text-white'
                          : isCurrent
                          ? 'bg-[#5B7147]/20 text-[#5B7147]'
                          : 'bg-[#EDE7DC] text-[#8E9B82]'
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <StepIcon className="w-3 h-3" />
                      )}
                    </div>
                    <span className="truncate">{step.title}</span>
                  </div>

                  <span className="text-[10px] font-mono shrink-0 font-medium">
                    {isPassed ? 'OK' : isCurrent ? 'LOAD...' : 'WAIT'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Enter Button or Active Banner */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onComplete?.()}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isReady
                  ? 'bg-[#5B7147] hover:bg-[#435433] text-white shadow-[#5B7147]/25 scale-[1.01]'
                  : 'bg-[#EDE7DC] hover:bg-[#E5DDD0] text-[#435433]'
              }`}
            >
              <span>{isReady ? 'Launch Workspace' : 'Enter Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Bottom Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#6B795D]"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#5B7147]" />
          <span>Localhost Execution • Ghostscript Optimized • 33 Tools</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
