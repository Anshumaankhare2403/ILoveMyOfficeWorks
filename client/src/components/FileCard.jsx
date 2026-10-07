import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Lock, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function FileCard({
  fileItem,
  index,
  totalFiles,
  onRemove,
  onMoveUp,
  onMoveDown,
}) {
  const { name, formattedSize, pageCount, isEncrypted, error } = fileItem;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white border border-[#E2DAD0] hover:border-[#5B7147]/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4"
    >
      {/* File index sequence badge */}
      <div className="w-8 h-8 rounded-xl bg-[#FAF8F4] text-[#4A573D] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#DDD3C2]">
        #{index + 1}
      </div>

      {/* File Icon */}
      <div className="w-11 h-11 rounded-xl bg-[#5B7147]/10 text-[#3F502F] flex items-center justify-center shrink-0 border border-[#5B7147]/20">
        <FileText className="w-5 h-5" />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-[#262D20] truncate" title={name}>
            {name}
          </p>
          {isEncrypted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 border border-amber-300 text-amber-800">
              <Lock className="w-3 h-3" />
              Locked
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 mt-1 text-xs text-[#6B775F]">
          <span>{formattedSize}</span>
          <span className="text-[#BDC7B0]">•</span>
          {isEncrypted ? (
            <span className="text-amber-700 font-medium">Password Protected</span>
          ) : (
            <span className="text-[#3E4733] font-medium bg-[#FAF8F4] px-2 py-0.5 rounded border border-[#E2DAD0]">
              {pageCount !== null ? `${pageCount} ${pageCount === 1 ? 'page' : 'pages'}` : 'Unknown pages'}
            </span>
          )}
        </div>

        {error && !isEncrypted && (
          <p className="text-xs text-rose-600 mt-1 truncate">{error}</p>
        )}
      </div>

      {/* Reorder and Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {totalFiles > 1 && (
          <div className="flex items-center bg-[#FAF8F4] rounded-xl p-1 border border-[#DDD4C6] mr-1 shadow-inner">
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              title="Move up"
              className="p-1.5 rounded-lg text-[#667258] hover:text-[#262D20] hover:bg-white disabled:opacity-25 disabled:hover:bg-transparent transition-all"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === totalFiles - 1}
              title="Move down"
              className="p-1.5 rounded-lg text-[#667258] hover:text-[#262D20] hover:bg-white disabled:opacity-25 disabled:hover:bg-transparent transition-all"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => onRemove(fileItem.id)}
          title="Remove file"
          className="p-2.5 rounded-xl text-[#8E9B81] hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
