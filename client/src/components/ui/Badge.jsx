import React from 'react';

/**
 * Reusable Luxury Sage Badge
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  ...props
}) {
  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.2',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size] || 'text-[10px] px-2 py-0.5';

  const variantClasses = {
    default: 'bg-[#5B7147]/10 text-[#3A4A2C] border border-[#5B7147]/20',
    primary: 'bg-[#5B7147] text-white border border-[#435433]',
    accent: 'bg-[#8B9A6E]/15 text-[#3C4A2E] border border-[#8B9A6E]/30',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    neutral: 'bg-stone-100 text-[#556348] border border-[#DDD3C2]',
  }[variant] || 'bg-[#5B7147]/10 text-[#3A4A2C] border border-[#5B7147]/20';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-bold rounded-full whitespace-nowrap transition-colors ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
