import React, { useState } from 'react';

interface PredictionGameProps {
  onPredict: (direction: 'up' | 'down' | 'sideways') => void;
  accuracy?: number;
}

export const PredictionGame: React.FC<PredictionGameProps> = ({ onPredict }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handlePredict = (direction: 'up' | 'down' | 'sideways') => {
    onPredict(direction);
    setShowOptions(false);
  };

  return (
    <div className="flex items-center gap-2">
      {!showOptions ? (
        <button
          onClick={() => setShowOptions(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#4a6caa] to-[#5a7cc0] hover:shadow-[0_0_15px_rgba(74,108,170,0.4)] rounded-xl text-sm text-white transition-all duration-200"
        >
          Predict 🎰
        </button>
      ) : (
        <>
          <button
            onClick={() => handlePredict('up')}
            className="px-2 py-1 text-xs font-medium text-white bg-[#14f195] hover:shadow-[0_0_10px_rgba(20,241,149,0.4)] rounded-lg transition-all duration-200"
          >
            📈
          </button>
          <button
            onClick={() => handlePredict('sideways')}
            className="px-2 py-1 text-xs font-medium text-white bg-[#8da4d4] hover:shadow-[0_0_10px_rgba(141,164,212,0.4)] rounded-lg transition-all duration-200"
          >
            ➡️
          </button>
          <button
            onClick={() => handlePredict('down')}
            className="px-2 py-1 text-xs font-medium text-white bg-[#e85a7b] hover:shadow-[0_0_10px_rgba(232,90,123,0.4)] rounded-lg transition-all duration-200"
          >
            📉
          </button>
          <button
            onClick={() => setShowOptions(false)}
            className="px-1 py-1 text-xs text-[#8da4d4]/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
};
