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
          className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm text-white transition-colors"
        >
          Predict 🎰
        </button>
      ) : (
        <>
          <button
            onClick={() => handlePredict('up')}
            className="px-2 py-1 text-xs font-medium text-white bg-crypto-accent-green hover:brightness-110 rounded transition-all"
          >
            📈
          </button>
          <button
            onClick={() => handlePredict('sideways')}
            className="px-2 py-1 text-xs font-medium text-white bg-gray-600 hover:bg-gray-500 rounded transition-all"
          >
            ➡️
          </button>
          <button
            onClick={() => handlePredict('down')}
            className="px-2 py-1 text-xs font-medium text-white bg-crypto-accent-red hover:brightness-110 rounded transition-all"
          >
            📉
          </button>
          <button
            onClick={() => setShowOptions(false)}
            className="px-1 py-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
};
