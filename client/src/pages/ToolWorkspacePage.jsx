import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Files,
  Trash2,
  ArrowLeft,
  ArrowUpDown,
  ArrowDownAZ,
  ArrowUpZA,
} from 'lucide-react';
import { getToolConfig } from '../constants/tools';
import Uploader from '../components/common/Uploader';
import FileCard from '../components/common/FileCard';
import OperationBar from '../components/common/OperationBar';
import Pagination from '../components/ui/Pagination';

/**
 * Dedicated Page View for active Tool Operations (Merge, Split, Compress, etc.)
 */
export default function ToolWorkspacePage({
  activeTab,
  onBackToHome,
  files,
  onFilesAdded,
  onRemoveFile,
  onClearAll,
  onMoveUp,
  onMoveDown,
  onSortAscending,
  onSortDescending,
  onReverseOrder,
  queuePage,
  setQueuePage,
  pageSize = 30,
}) {
  const currentConfig = getToolConfig(activeTab);
  const ToolIcon = currentConfig.icon;
  const totalPages = Math.ceil(files.length / pageSize) || 1;
  const curPage = Math.min(queuePage, totalPages);
  const start = (curPage - 1) * pageSize;
  const end = Math.min(start + pageSize, files.length);
  const displayedFiles = files.length > pageSize ? files.slice(start, end) : files;

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E1D5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B7147] to-[#435433] text-white flex items-center justify-center shadow-md shadow-[#5B7147]/20">
            <ToolIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#262D20]">
                {currentConfig.name}
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B7147]/10 text-[#3A4A2C] border border-[#5B7147]/20">
                {currentConfig.badge}
              </span>
            </div>
            <p className="text-xs text-[#6B785E]">{currentConfig.desc}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="text-xs text-[#3A4A2C] hover:text-[#1E2619] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-[#DDD3C2] hover:border-[#5B7147] shadow-sm transition-all font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {files.length === 0 ? (
        <div className="max-w-xl mx-auto py-10">
          <div className="text-center mb-6">
            <p className="text-sm text-[#6B785E]">{currentConfig.hint}</p>
          </div>
          <Uploader onFilesAdded={onFilesAdded} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Queue Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#262D20]">
              <Files className="w-4 h-4 text-[#5B7147]" />
              <span>Document Queue ({files.length})</span>
              {files.length >= 100 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#5B7147]/15 text-[#3C4A2E] font-bold border border-[#5B7147]/20 whitespace-nowrap">
                  ⚡ 1,000+ High-Capacity
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {files.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={onSortAscending}
                    title="Sort alphabetically (A to Z)"
                    className="text-[11px] text-[#556348] hover:text-[#262D20] bg-white hover:bg-[#FAF8F4] border border-[#DDD3C2] flex items-center gap-1 transition-all px-2.5 py-1 rounded-lg font-medium shadow-2xs whitespace-nowrap cursor-pointer"
                  >
                    <ArrowDownAZ className="w-3.5 h-3.5" />
                    <span>A-Z</span>
                  </button>
                  <button
                    type="button"
                    onClick={onSortDescending}
                    title="Sort alphabetically (Z to A)"
                    className="text-[11px] text-[#556348] hover:text-[#262D20] bg-white hover:bg-[#FAF8F4] border border-[#DDD3C2] flex items-center gap-1 transition-all px-2.5 py-1 rounded-lg font-medium shadow-2xs whitespace-nowrap cursor-pointer"
                  >
                    <ArrowUpZA className="w-3.5 h-3.5" />
                    <span>Z-A</span>
                  </button>
                  <button
                    type="button"
                    onClick={onReverseOrder}
                    title="Reverse current queue sequence"
                    className="text-[11px] text-[#556348] hover:text-[#262D20] bg-white hover:bg-[#FAF8F4] border border-[#DDD3C2] flex items-center gap-1 transition-all px-2.5 py-1 rounded-lg font-medium shadow-2xs whitespace-nowrap cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Reverse</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-[#717E64] hover:text-rose-600 flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-50 font-medium whitespace-nowrap cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            </div>
          </div>

          {/* Responsive grid: Left side list, Right side operations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3 order-2 lg:order-1">
              {/* Top Pagination */}
              <Pagination
                currentPage={queuePage}
                totalPages={totalPages}
                totalItems={files.length}
                pageSize={pageSize}
                onPageChange={setQueuePage}
                showSummary={true}
              />

              <AnimatePresence>
                {displayedFiles.map((fileItem, localIdx) => {
                  const globalIdx = files.length > pageSize ? start + localIdx : localIdx;
                  return (
                    <FileCard
                      key={fileItem.id}
                      fileItem={fileItem}
                      index={globalIdx}
                      totalFiles={files.length}
                      onRemove={onRemoveFile}
                      onMoveUp={onMoveUp}
                      onMoveDown={onMoveDown}
                    />
                  );
                })}
              </AnimatePresence>

              {/* Bottom Pagination */}
              <Pagination
                currentPage={queuePage}
                totalPages={totalPages}
                totalItems={files.length}
                pageSize={pageSize}
                onPageChange={setQueuePage}
                showSummary={false}
                className="mt-2"
              />

              <Uploader onFilesAdded={onFilesAdded} compact={true} />
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24">
              <OperationBar
                files={files}
                onReset={onClearAll}
                activeToolId={currentConfig.id}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
