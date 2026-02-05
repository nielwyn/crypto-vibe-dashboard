import React from 'react';

interface ModeToggleProps {
  mode: 'professional' | 'degen';
  onToggle: (mode: 'professional' | 'degen') => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onToggle }) => {
  return (
    <div className="flex items-center gap-0">
      <button
        onClick={() => onToggle('professional')}
        className={`px-3 py-1 text-xs font-medium rounded-l-lg transition-all duration-200 ${
          mode === 'professional'
            ? 'bg-gradient-to-r from-[#4a6caa] to-[#5a7cc0] text-white shadow-[0_0_10px_rgba(74,108,170,0.3)]'
            : 'bg-[#1e2040]/60 text-[#8da4d4]/60 hover:bg-[#1e2040] hover:text-[#8da4d4]'
        }`}
      >
        🤓 Pro
      </button>
      <button
        onClick={() => onToggle('degen')}
        className={`px-3 py-1 text-xs font-medium rounded-r-lg transition-all duration-200 ${
          mode === 'degen'
            ? 'bg-gradient-to-r from-[#4a6caa] to-[#5a7cc0] text-white shadow-[0_0_10px_rgba(74,108,170,0.3)]'
            : 'bg-[#1e2040]/60 text-[#8da4d4]/60 hover:bg-[#1e2040] hover:text-[#8da4d4]'
        }`}
      >
        🚀 Degen
      </button>
    </div>
  );
};
