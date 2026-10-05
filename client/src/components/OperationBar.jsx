import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Layers,
  Download,
  AlertCircle,
  CheckCircle2,
  Settings2,
  FileCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { getRegisteredAdapters, executeAdapter } from '../registry/registry';
import { formatFileSize } from '../utils/pdf-magic';

export default function OperationBar({ files, onReset }) {
  const [selectedAdapterId, setSelectedAdapterId] = useState('merge-pdf');
  const [adapterOptions, setAdapterOptions] = useState({
    outputFilename: 'merged-document.pdf',
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, status: '' });
  const [executionResult, setExecutionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Read registered adapters dynamically from the registry
  const availableAdapters = getRegisteredAdapters(files);
  const activeAdapter = availableAdapters.find((a) => a.id === selectedAdapterId) || availableAdapters[0];

  const handleOptionChange = (key, value) => {
    setAdapterOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleExecute = async () => {
    if (!activeAdapter || !activeAdapter.isValid) return;

    setIsExecuting(true);
    setErrorMessage(null);
    setExecutionResult(null);
    setProgress({ percent: 5, status: 'Starting operation...' });

    try {
      const result = await executeAdapter(
        activeAdapter.id,
        files,
        adapterOptions,
        (percent, status) => {
          setProgress({ percent, status });
        }
      );

      setExecutionResult(result);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#38bdf8', '#34d399'],
      });
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during operation.');
    } finally {
      setIsExecuting(false);
    }
  };

  const triggerDownload = () => {
    if (!executionResult?.downloadUrl) return;
    const a = document.createElement('a');
    a.href = executionResult.downloadUrl;
    a.download = executionResult.filename || 'merged-document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full space-y-4">
      {/* Dynamic Adapter Selector & Action Panel */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Available Registry Operations */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                Adapter Registry
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                {availableAdapters.length} Tool Registered
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Available PDF Tools</h3>
          </div>

          {/* Adapter tabs/buttons dynamically rendered from registry */}
          <div className="flex flex-wrap gap-2">
            {availableAdapters.map((adapter) => {
              const isSelected = adapter.id === activeAdapter?.id;
              return (
                <button
                  key={adapter.id}
                  type="button"
                  onClick={() => setSelectedAdapterId(adapter.id)}
                  className={`relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{adapter.name}</span>
                  {adapter.badge && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-black/30 text-white/90">
                      {adapter.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tool Details & Configuration */}
        {activeAdapter && (
          <div className="mt-5 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-semibold text-white flex items-center gap-2">
                  <span>{activeAdapter.name}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    (Accepts unlimited documents)
                  </span>
                </h4>
                <p className="text-sm text-slate-400 mt-0.5">
                  {activeAdapter.description}
                </p>
              </div>

              {/* Validation Status Indicator */}
              {!activeAdapter.isValid && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs shrink-0">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{activeAdapter.validationReason}</span>
                </div>
              )}
            </div>

            {/* Configurable Adapter Options */}
            {activeAdapter.options && activeAdapter.options.length > 0 && (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tool Options</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {activeAdapter.options.map((opt) => (
                    <div key={opt.id} className="space-y-1">
                      <label className="text-xs text-slate-400 font-medium block">
                        {opt.label}
                      </label>
                      <input
                        type={opt.type || 'text'}
                        value={adapterOptions[opt.id] ?? opt.default}
                        placeholder={opt.placeholder || ''}
                        onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                        disabled={isExecuting}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <p className="font-semibold">Execution Failed</p>
                  <p className="text-xs text-rose-300 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Progress Bar (Visible while executing) */}
            {isExecuting && (
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{progress.status}</span>
                  <span className="font-mono text-indigo-400">{progress.percent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress.percent}%` }}
                    transition={{ ease: 'easeOut', duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            {!executionResult && (
              <button
                type="button"
                onClick={handleExecute}
                disabled={!activeAdapter.isValid || isExecuting}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.008] active:scale-[0.995]"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing {files.length} PDFs...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Merge {files.length} PDFs Sequentially</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Result Card & Download Button */}
      <AnimatePresence>
        {executionResult && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">
                      PDF Merged Successfully!
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/20 text-emerald-300">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-emerald-200/80 font-mono mt-0.5 truncate max-w-md">
                    {executionResult.filename}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-emerald-300/70 mt-1 font-sans">
                    <span>{executionResult.totalPages} total pages</span>
                    <span>•</span>
                    <span>{formatFileSize(executionResult.fileSize)}</span>
                    <span>•</span>
                    <span>{executionResult.fileCount} source files merged</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={triggerDownload}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Merged PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExecutionResult(null);
                    onReset?.();
                  }}
                  title="Merge more files"
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
