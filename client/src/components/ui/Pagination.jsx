import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable Queue Pagination Component
 */
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  showSummary = true,
  className = '',
}) {
  if (totalItems <= pageSize) return null;

  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startItem = (validCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(validCurrentPage * pageSize, totalItems);

  return (
    <div
      className={`flex items-center justify-between gap-3 p-3 bg-white border border-[#DDD3C2] rounded-2xl text-xs shadow-xs ${className}`}
    >
      {showSummary ? (
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#262D20]">
            Showing {startItem}–{endItem} of {totalItems}
          </span>
          <span className="text-[#96A48B]">•</span>
          <span className="text-[#4F5E41] font-semibold bg-[#5B7147]/10 px-2 py-0.5 rounded-full border border-[#5B7147]/20">
            Page {validCurrentPage} of {totalPages}
          </span>
        </div>
      ) : (
        <span className="text-[#647257] font-medium">
          Page {validCurrentPage} of {totalPages}
        </span>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, validCurrentPage - 1))}
          disabled={validCurrentPage <= 1}
          className="p-1 px-2.5 rounded-lg border border-[#DDD3C2] hover:border-[#5B7147] bg-[#FAF8F4] hover:bg-white text-[#262D20] disabled:opacity-30 transition-all flex items-center gap-1 font-semibold cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, validCurrentPage + 1))}
          disabled={validCurrentPage >= totalPages}
          className="p-1 px-2.5 rounded-lg border border-[#DDD3C2] hover:border-[#5B7147] bg-[#FAF8F4] hover:bg-white text-[#262D20] disabled:opacity-30 transition-all flex items-center gap-1 font-semibold cursor-pointer"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
