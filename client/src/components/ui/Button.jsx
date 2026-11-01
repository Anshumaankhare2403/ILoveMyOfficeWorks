import React from 'react';

/**
 * Standardized Button UI Primitive with Luxury Sage Aesthetics
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  ...props
}) {
  const sizeClasses = {
    xs: 'text-[11px] px-2 py-0.5 rounded-lg gap-1',
    sm: 'text-xs px-2.5 py-1.5 rounded-xl gap-1.5',
    md: 'text-sm px-4 py-2 rounded-xl gap-2 font-bold',
    lg: 'text-base px-5 py-2.5 rounded-2xl gap-2.5 font-bold',
  }[size] || 'text-sm px-4 py-2 rounded-xl gap-2 font-bold';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#5B7147] to-[#435433] text-white hover:brightness-110 shadow-md shadow-[#5B7147]/20 border border-[#5B7147]',
    secondary:
      'bg-white/90 text-[#3A4A2C] hover:text-[#1E2619] border border-[#DDD3C2] hover:border-[#5B7147] shadow-xs hover:bg-[#FAF8F4]',
    outline:
      'bg-transparent text-[#5B7147] border border-[#5B7147]/30 hover:bg-[#5B7147]/10',
    ghost:
      'bg-transparent text-[#556348] hover:text-[#262D20] hover:bg-[#5B7147]/10',
    danger:
      'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/80',
  }[variant] || 'bg-[#5B7147] text-white';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
