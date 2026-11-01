import React from 'react';

/**
 * Reusable Card container with luxury borders and backdrop blur
 */
export default function Card({
  children,
  className = '',
  interactive = false,
  ...props
}) {
  return (
    <div
      className={`bg-white/90 backdrop-blur-sm border border-[#E8E1D5] rounded-2xl shadow-xs ${
        interactive
          ? 'hover:border-[#5B7147]/50 hover:shadow-md transition-all duration-200'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
