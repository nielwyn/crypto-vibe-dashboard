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
            ? 'bg-gradient-to-r from-[#9945ff] to-[#7a37d6] text-white shadow-[0_0_10px_rgba(153,69,255,0.3)]'
            : 'bg-[#1a1a3e]/60 text-[#ab9ff2]/60 hover:bg-[#1a1a3e] hover:text-[#ab9ff2]'
        }`}
      >
        🤓 Pro
      </button>
      <button
        onClick={() => onToggle('degen')}
        className={`px-3 py-1 text-xs font-medium rounded-r-lg transition-all duration-200 ${
          mode === 'degen'
            ? 'bg-gradient-to-r from-[#9945ff] to-[#7a37d6] text-white shadow-[0_0_10px_rgba(153,69,255,0.3)]'
            : 'bg-[#1a1a3e]/60 text-[#ab9ff2]/60 hover:bg-[#1a1a3e] hover:text-[#ab9ff2]'
        }`}
      >
        🚀 Degen
      </button>
    </div>
  );
};
