import React from 'react';

export const MortarboardSvg: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full animate-float drop-shadow-md"
      >
        {/* Cap Top */}
        <polygon points="50,15 90,32 50,49 10,32" fill="#1E3A8A" />
        <polygon points="50,15 90,32 50,49 10,32" stroke="#3B82F6" strokeWidth="2.5" />

        {/* Cap Base Skullcap */}
        <path d="M28,42 V58 C28,68 72,68 72,58 V42" fill="#1D4ED8" opacity="0.9" />
        <path d="M28,42 V58 C28,68 72,68 72,58 V42" stroke="#1E3A8A" strokeWidth="2" />

        {/* Tassel String */}
        <path d="M50,32 Q68,34 74,48" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="74" cy="52" r="4" fill="#F59E0B" />
        <path d="M74,56 V68" stroke="#F59E0B" strokeWidth="2" strokeDasharray="1 1" />
      </svg>
    </div>
  );
};
