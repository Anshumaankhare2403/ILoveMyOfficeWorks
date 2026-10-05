import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Booting local engine...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(35);
      setStatusText('Loading WebAssembly & pdf-lib buffers...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setStatusText('Mounting adapter registry & 3D canvas...');
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready! 100% private on localhost.');
    }, 1400);

    const timer4 = setTimeout(() => {
      onComplete?.();
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F4] text-[#262D20] overflow-hidden px-4"
    >
      {/* Soft warm ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#8B9A6E]/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-[#EBE4D8]/70 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Animated Brand Icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-[#8B9A6E] rounded-3xl blur-2xl opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#8B9A6E] via-[#A3B588] to-[#BDCBA8] p-0.5 shadow-2xl shadow-[#8B9A6E]/20">
            <div className="w-full h-full bg-[#FAF8F4] rounded-[22px] backdrop-blur-md flex items-center justify-center shadow-inner">
              <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-[#8B9A6E] fill-[#8B9A6E]/20 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#262D20]"
        >
          ILoveMyOfficeWorks
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs sm:text-sm text-[#667258] mt-1 font-medium"
        >
          Personal PDF Toolkit • Local & Secure
        </motion.p>

        {/* Loading Bar */}
        <div className="w-full mt-8 space-y-2">
          <div className="w-full bg-[#EBE4D8]/80 border border-[#D5DEC7] h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-[#8B9A6E] to-[#6F7D53] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut', duration: 0.4 }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#717E64] font-mono px-1">
            <span className="truncate max-w-[80%]">{statusText}</span>
            <span className="text-[#55603F] font-bold">{progress}%</span>
          </div>
        </div>

        {/* Security badge at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center gap-2 text-xs text-[#55603F] bg-white/80 border border-[#D5DEC7] px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#8B9A6E]" />
          <span>Zero telemetry • 100% in-browser</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
