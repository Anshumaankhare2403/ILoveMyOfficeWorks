import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Layers,
  Scissors,
  Minimize2,
  Download,
  AlertCircle,
  CheckCircle2,
  Settings2,
  RefreshCw,
  Sparkles,
  Archive,
  FileText,
  Image,
  Table,
  Presentation,
  Globe,
  ChevronDown,
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
  Maximize2,
  Images,
} from 'lucide-react';
import { getRegisteredAdapters, executeAdapter } from '../registry/registry';
import { formatFileSize } from '../utils/pdf-magic';

export default function OperationBar({ files, onReset, activeToolId = 'merge-pdf' }) {
  const [selectedAdapterId, setSelectedAdapterId] = useState(activeToolId);
  const [adapterOptions, setAdapterOptions] = useState({
    outputFilename: '',
    splitMode: 'range',
    pageRanges: '1-2',
    everyN: 1,
    outputPrefix: 'split_document',
    compressionLevel: 'recommended',
    customQuality: '0.65',
    customScale: '1.2',
    engine: 'browser',
    conversionMode: 'flowable',
    includePageBreaks: 'true',
    detectHeadings: 'true',
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, status: '' });
  const [executionResult, setExecutionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync with prop when tab changes
  React.useEffect(() => {
    if (activeToolId) {
      setSelectedAdapterId(activeToolId);
      setExecutionResult(null);
      setErrorMessage(null);
    }
  }, [activeToolId]);

  // Read registered adapters dynamically from the registry
  const availableAdapters = getRegisteredAdapters(files);
  const activeAdapter =
    availableAdapters.find((a) => a.id === selectedAdapterId) ||
    availableAdapters.find((a) => a.isValid) ||
    availableAdapters[0];

  const handleOptionChange = (key, value) => {
    setAdapterOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleExecute = async () => {
    if (!activeAdapter || !activeAdapter.isValid) return;

    setIsExecuting(true);
    setErrorMessage(null);
    setExecutionResult(null);
    setProgress({ percent: 5, status: `Starting ${activeAdapter.name}...` });

    try {
      const result = await executeAdapter(
        activeAdapter.id,
        files,
        adapterOptions,
        (percent, status) => {
          setProgress({ percent, status });
        }
      );

      // Defensively normalize the result object so all download and preview fields are guaranteed
      const normalized = { ...result };
      if (!normalized.blob && normalized.files && normalized.files.length > 0) {
        normalized.blob = normalized.files[0].blob;
      }
      if (!normalized.filename && normalized.files && normalized.files.length > 0) {
        normalized.filename = normalized.files[0].name;
      }
      if (!normalized.downloadUrl && normalized.blob) {
        normalized.downloadUrl = URL.createObjectURL(normalized.blob);
      }
      if (!normalized.fileSize && normalized.blob) {
        normalized.fileSize = normalized.blob.size;
      }

      const fnameLower = (normalized.filename || '').toLowerCase();
      normalized.isZip = normalized.isZip || fnameLower.endsWith('.zip');
      normalized.isDocx = normalized.isDocx || fnameLower.endsWith('.docx');
      normalized.isCsv = normalized.isCsv || fnameLower.endsWith('.csv');
      normalized.isPptx = normalized.isPptx || fnameLower.endsWith('.pptx');
      normalized.isImage =
        normalized.isImage ||
        ['.jpg', '.jpeg', '.png', '.webp'].some((ext) => fnameLower.endsWith(ext));
      normalized.isPdf = normalized.isPdf || fnameLower.endsWith('.pdf');

      setExecutionResult(normalized);

      // Trigger celebratory confetti in matching sage and warm gold tones
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B9A6E', '#A3B588', '#EBE4D8', '#6F7D53'],
      });
    } catch (err) {
      console.error('Tool execution error:', err);
      setErrorMessage(err.message || 'An error occurred during operation.');
    } finally {
      setIsExecuting(false);
    }
  };

  const triggerDownload = (url, name) => {
    const downloadUrl = url || executionResult?.downloadUrl;
    const downloadName = name || executionResult?.filename || 'downloaded_document';
    if (!downloadUrl) {
      console.error('triggerDownload called without a valid URL', executionResult);
      return;
    }

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch {
        // Ignored
      }
    }, 150);
  };

  const getAdapterIcon = (id) => {
    switch (id) {
      case 'merge-pdf':
        return <Layers className="w-4 h-4" />;
      case 'split-pdf':
        return <Scissors className="w-4 h-4" />;
      case 'remove-pages':
        return <Trash2 className="w-4 h-4" />;
      case 'extract-pages':
        return <FileDown className="w-4 h-4" />;
      case 'organize-pdf':
        return <ArrowUpDown className="w-4 h-4" />;
      case 'scan-to-pdf':
        return <Camera className="w-4 h-4" />;
      case 'compress-pdf':
        return <Minimize2 className="w-4 h-4" />;
      case 'repair-pdf':
        return <Wrench className="w-4 h-4" />;
      case 'ocr-pdf':
        return <FileSearch className="w-4 h-4" />;
      case 'jpg-to-pdf':
      case 'pdf-to-jpg':
        return <Image className="w-4 h-4" />;
      case 'word-to-pdf':
      case 'pdf-to-docx':
        return <FileText className="w-4 h-4" />;
      case 'powerpoint-to-pdf':
      case 'pdf-to-powerpoint':
        return <Presentation className="w-4 h-4" />;
      case 'excel-to-pdf':
      case 'pdf-to-excel':
        return <Table className="w-4 h-4" />;
      case 'html-to-pdf':
        return <Globe className="w-4 h-4" />;
      case 'pdf-to-pdfa':
        return <Archive className="w-4 h-4" />;
      case 'rotate-pdf':
        return <RotateCw className="w-4 h-4" />;
      case 'add-page-numbers':
        return <Hash className="w-4 h-4" />;
      case 'add-watermark':
        return <Stamp className="w-4 h-4" />;
      case 'crop-pdf':
        return <Crop className="w-4 h-4" />;
      case 'edit-pdf':
        return <PenTool className="w-4 h-4" />;
      case 'pdf-forms':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'unlock-pdf':
        return <Unlock className="w-4 h-4" />;
      case 'protect-pdf':
        return <Shield className="w-4 h-4" />;
      case 'sign-pdf':
        return <CheckSquare className="w-4 h-4" />;
      case 'redact-pdf':
        return <EyeOff className="w-4 h-4" />;
      case 'compare-pdf':
        return <GitCompare className="w-4 h-4" />;
      case 'merge-images':
        return <Images className="w-4 h-4" />;
      case 'compress-image':
        return <Minimize2 className="w-4 h-4" />;
      case 'resize-image':
        return <Maximize2 className="w-4 h-4" />;
      case 'crop-image':
        return <Crop className="w-4 h-4" />;
      case 'convert-to-jpg':
        return <Image className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const getActionLabel = () => {
    if (isExecuting) return 'Processing document...';
    if (activeAdapter.id === 'merge-images') {
      return `Merge ${files.length} Images`;
    }
    if (activeAdapter.id === 'merge-pdf') {
      return `Merge ${files.length} PDFs Sequentially`;
    }
    if (activeAdapter.id === 'split-pdf') {
      return `Split PDF (${files[0]?.name || 'Document'})`;
    }
    if (activeAdapter.id === 'compress-pdf') {
      return `Compress PDF (${files[0]?.name || 'Document'})`;
    }
    if (activeAdapter.id === 'pdf-to-docx') {
      return `Convert to Word (.docx) (${files[0]?.name || 'Document'})`;
    }
    return `Convert with ${activeAdapter.name}`;
  };

  // Compatible tools for current file queue
  const compatibleAdapters = availableAdapters.filter((a) => a.isValid);

  return (
    <div className="w-full space-y-4">
      {/* Dynamic Adapter Selector & Action Panel */}
      <div className="bg-white/95 backdrop-blur-xl border border-[#DFD6C8] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow ambient background in sage */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#8B9A6E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#EBE4D8]/60 rounded-full blur-3xl pointer-events-none" />

        {/* Clean Focused Header with Quick Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EBE3D6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B7147] to-[#435433] text-white flex items-center justify-center shadow-md shadow-[#5B7147]/20 shrink-0">
              {getAdapterIcon(activeAdapter?.id)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#262D20]">{activeAdapter?.name}</h3>
                {activeAdapter?.badge && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#5B7147]/10 text-[#435433] border border-[#5B7147]/20 whitespace-nowrap">
                    {activeAdapter.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#667258] mt-0.5">{activeAdapter?.description}</p>
            </div>
          </div>

          {/* Quick Tool Switcher if other tools are compatible */}
          {compatibleAdapters.length > 1 && (
            <div className="relative shrink-0">
              <select
                value={activeAdapter?.id}
                onChange={(e) => {
                  setSelectedAdapterId(e.target.value);
                  setExecutionResult(null);
                  setErrorMessage(null);
                }}
                className="text-xs font-semibold bg-[#FAF8F4] text-[#435433] border border-[#DDD3C2] rounded-xl px-3 py-1.5 pr-7 focus:outline-none focus:border-[#5B7147] cursor-pointer appearance-none shadow-sm"
              >
                {compatibleAdapters.map((a) => (
                  <option key={a.id} value={a.id}>
                    Switch to {a.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B795D] absolute right-2 top-2.5 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Selected Tool Details & Configuration */}
        {activeAdapter && (
          <div className="mt-4 space-y-4">
            {/* Validation Status Indicator */}
            {!activeAdapter.isValid && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{activeAdapter.validationReason}</span>
              </div>
            )}

            {/* Configurable Adapter Options */}
            {activeAdapter.options && activeAdapter.options.length > 0 && (
              <div className="bg-[#FAF8F4] border border-[#DDD3C4] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4E593D]">
                  <Settings2 className="w-3.5 h-3.5 text-[#8B9A6E]" />
                  <span>Tool Settings</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {activeAdapter.options
                    .filter((opt) => !opt.showWhen || opt.showWhen(adapterOptions))
                    .map((opt) => (
                      <div key={opt.id} className="space-y-1">
                        <label className="text-xs text-[#55603F] font-semibold block">
                          {opt.label}
                        </label>
                        {opt.type === 'select' ? (
                          <select
                            value={adapterOptions[opt.id] ?? opt.default}
                            onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                            disabled={isExecuting}
                            className="w-full bg-white border border-[#CBD5BD] rounded-lg px-3 py-2 text-sm text-[#262D20] focus:outline-none focus:border-[#8B9A6E] focus:ring-1 focus:ring-[#8B9A6E]"
                          >
                            {opt.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={opt.type || 'text'}
                            min={opt.min}
                            max={opt.max}
                            value={adapterOptions[opt.id] ?? opt.default}
                            placeholder={
                              opt.placeholder ||
                              (opt.id === 'outputFilename'
                                ? activeAdapter?.id === 'compress-pdf'
                                  ? `${files[0]?.name?.replace(/\.[^/.]+$/, '') || 'document'}_compressed.pdf`
                                  : activeAdapter?.id === 'pdf-to-docx'
                                  ? `${files[0]?.name?.replace(/\.[^/.]+$/, '') || 'document'}.docx`
                                  : activeAdapter?.id === 'split-pdf'
                                  ? 'split_part'
                                  : `${files[0]?.name?.replace(/\.[^/.]+$/, '') || 'document'}_processed.pdf`
                                : '')
                            }
                            onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                            disabled={isExecuting}
                            className="w-full bg-white border border-[#CBD5BD] rounded-lg px-3 py-2 text-sm text-[#262D20] placeholder-[#9EAC8E] focus:outline-none focus:border-[#8B9A6E] focus:ring-1 focus:ring-[#8B9A6E] transition-all"
                          />
                        )}
                        {opt.hint && (
                          <p className="text-[11px] text-[#717E64] mt-1 leading-snug">
                            {typeof opt.hint === 'function' ? opt.hint(adapterOptions) : opt.hint}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <p className="font-semibold">Execution Failed</p>
                  <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Progress Bar (Visible while executing) */}
            {isExecuting && (
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between text-xs text-[#55603F] font-semibold">
                  <span className="truncate max-w-[80%]">{progress.status}</span>
                  <span className="font-mono text-[#6E7C52] shrink-0">{progress.percent}%</span>
                </div>
                <div className="w-full bg-[#EBE4D8] h-2.5 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#8B9A6E] via-[#A3B588] to-[#718055] rounded-full"
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
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B7147] via-[#52663F] to-[#435433] hover:from-[#52663F] hover:to-[#38462B] text-white shadow-lg shadow-[#5B7147]/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.008] active:scale-[0.995]"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#EBF2DF]" />
                    <span>{getActionLabel()}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Result Card & Download Buttons */}
      <AnimatePresence>
        {executionResult && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#F4F7F0] border-2 border-[#BAC7A6] backdrop-blur-xl rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 overflow-hidden relative"
          >
            {/* Ambient subtle glow */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#8B9A6E]/15 rounded-full blur-2xl pointer-events-none" />

            {/* Header info */}
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#8B9A6E]/20 text-[#55603F] flex items-center justify-center shrink-0 border border-[#8B9A6E]/30">
                <CheckCircle2 className="w-6 h-6 text-[#5A6841]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-[#262D20] tracking-tight">
                    Operation Completed!
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#8B9A6E]/20 text-[#434D31] border border-[#8B9A6E]/30">
                    Ready
                  </span>
                  {executionResult.engineUsed && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white border border-[#CBD5BD] text-[#55603F]">
                      {executionResult.engineUsed}
                    </span>
                  )}
                </div>
                <p
                  className="text-xs sm:text-sm text-[#3E4733] font-mono mt-1 truncate font-semibold"
                  title={executionResult.filename}
                >
                  {executionResult.filename}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B775F] mt-1.5 font-sans">
                  {executionResult.totalPages && (
                    <span>{executionResult.totalPages} total pages</span>
                  )}
                  {executionResult.fileSize && (
                    <>
                      <span>•</span>
                      <span>{formatFileSize(executionResult.fileSize)}</span>
                    </>
                  )}
                  {executionResult.totalParts && (
                    <>
                      <span>•</span>
                      <span>
                        {executionResult.totalParts}{' '}
                        {executionResult.totalParts === 1 ? 'part' : 'parts'} generated
                      </span>
                    </>
                  )}
                </div>

                {/* Compression metrics banner if present */}
                {executionResult.savingsPercent !== undefined && executionResult.originalSize && (
                  <div className="mt-3 p-3 bg-white/90 rounded-xl border border-[#CBD5BD] flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
                    <div className="flex items-center gap-2 flex-wrap text-[#4E593D]">
                      <span>
                        Original: <strong>{formatFileSize(executionResult.originalSize)}</strong>
                      </span>
                      <span className="text-[#8B9A6E]">→</span>
                      <span>
                        Compressed:{' '}
                        <strong className="text-[#262D20]">
                          {formatFileSize(executionResult.compressedSize)}
                        </strong>
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#8B9A6E]/20 text-[#3C472E] font-bold text-[11px]">
                      {executionResult.savingsPercent > 0
                        ? `-${executionResult.savingsPercent}% Size Reduction`
                        : 'Verified Optimal (Peak Compactness)'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Download Action Button */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => triggerDownload()}
                className="flex-1 py-3 px-4 rounded-xl bg-[#5B7147] hover:bg-[#4E623B] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#5B7147]/30 transition-all hover:scale-[1.01] active:scale-[0.99] min-w-0"
              >
                {executionResult.isZip ? (
                  <Archive className="w-4 h-4 shrink-0" />
                ) : executionResult.isDocx ? (
                  <FileText className="w-4 h-4 shrink-0" />
                ) : executionResult.isCsv ? (
                  <Table className="w-4 h-4 shrink-0" />
                ) : executionResult.isPptx ? (
                  <Presentation className="w-4 h-4 shrink-0" />
                ) : executionResult.isImage ? (
                  <Image className="w-4 h-4 shrink-0" />
                ) : (
                  <Download className="w-4 h-4 shrink-0" />
                )}
                <span className="truncate">
                  {executionResult.isZip
                    ? 'Download All as ZIP Archive'
                    : executionResult.isDocx
                    ? 'Download Word Document (.docx)'
                    : executionResult.isCsv
                    ? 'Download Excel CSV (.csv)'
                    : executionResult.isPptx
                    ? 'Download PowerPoint (.pptx)'
                    : executionResult.isImage
                    ? `Download Image (${(executionResult.filename || '').split('.').pop().toUpperCase()})`
                    : 'Download PDF Document'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setExecutionResult(null)}
                title="Run another operation"
                className="p-3 rounded-xl bg-white hover:bg-[#FAF8F4] text-[#55603F] hover:text-[#262D20] border border-[#CBD5BD] shadow-sm transition-all shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Individual Parts Download List (if multiple parts generated from split) */}
            {executionResult.parts && executionResult.parts.length > 1 && (
              <div className="pt-3 border-t border-[#D5DEC7] space-y-2">
                <p className="text-xs font-bold text-[#55603F] uppercase tracking-wider">
                  Individual Split Files ({executionResult.parts.length})
                </p>
                <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {executionResult.parts.map((part, index) => (
                    <div
                      key={index}
                      className="bg-white border border-[#D5DEC7] rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs shadow-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-[#8B9A6E] shrink-0" />
                        <div className="truncate">
                          <p className="text-[#262D20] font-semibold truncate">{part.filename}</p>
                          <p className="text-[10px] text-[#6B785E]">
                            {part.pageRangeText} • {part.pageCount}{' '}
                            {part.pageCount === 1 ? 'page' : 'pages'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerDownload(part.downloadUrl, part.filename)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#8B9A6E]/15 hover:bg-[#8B9A6E]/25 text-[#4E593D] font-bold text-[11px] shrink-0 flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
