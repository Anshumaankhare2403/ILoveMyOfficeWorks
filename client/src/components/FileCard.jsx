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
      className="group relative bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 flex items-center justify-between gap-4"
    >
      {/* File index sequence badge */}
      <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
        #{index + 1}
      </div>

      {/* File Icon */}
      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500/15 to-violet-500/15 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
        <FileText className="w-5 h-5" />
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-100 truncate" title={name}>
            {name}
          </p>
          {isEncrypted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <Lock className="w-3 h-3" />
              Locked
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
          <span>{formattedSize}</span>
          <span className="text-slate-600">•</span>
          {isEncrypted ? (
            <span className="text-amber-400 font-medium">Password Protected</span>
          ) : (
            <span className="text-slate-300 font-medium bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
              {pageCount !== null ? `${pageCount} ${pageCount === 1 ? 'page' : 'pages'}` : 'Unknown pages'}
            </span>
          )}
        </div>

        {error && !isEncrypted && (
          <p className="text-xs text-rose-400 mt-1 truncate">{error}</p>
        )}
      </div>

      {/* Reorder and Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {totalFiles > 1 && (
          <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/80 mr-1">
            <button
              type="button"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              title="Move up"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-25 disabled:hover:bg-transparent transition-all"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(index)}
              disabled={index === totalFiles - 1}
              title="Move down"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-25 disabled:hover:bg-transparent transition-all"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => onRemove(fileItem.id)}
          title="Remove file"
          className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
