import React from 'react';

interface ModeToggleProps {
  mode: 'professional' | 'degen';
  onToggle: (mode: 'professional' | 'degen') => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onToggle }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onToggle('professional')}
        className={`px-3 py-1 text-xs font-medium rounded-l transition-colors ${
          mode === 'professional'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        🤓 Pro
      </button>
      <button
        onClick={() => onToggle('degen')}
        className={`px-3 py-1 text-xs font-medium rounded-r transition-colors ${
          mode === 'degen'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        🚀 Degen
      </button>
    </div>
  );
};
