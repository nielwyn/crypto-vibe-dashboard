import React, { useState } from 'react';

interface PredictionGameProps {
  onPredict: (direction: 'up' | 'down' | 'sideways') => void;
  accuracy?: number;
}

export const PredictionGame: React.FC<PredictionGameProps> = ({ onPredict, accuracy }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handlePredict = (direction: 'up' | 'down' | 'sideways') => {
    onPredict(direction);
    setShowOptions(false);
  };

  return (
    <div className="flex items-center gap-3">
      {!showOptions ? (
        <>
          <button
            onClick={() => setShowOptions(true)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded transition-all"
          >
            🎰 Predict Next Hour
          </button>
          {accuracy !== undefined && accuracy >= 0 && (
            <span className="text-xs text-gray-400">
              🎯 <span className="text-white font-semibold">{accuracy}%</span> accuracy
            </span>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePredict('up')}
            className="px-3 py-1.5 text-xs font-medium text-white bg-crypto-accent-green hover:brightness-110 rounded transition-all"
          >
            📈 Up
          </button>
          <button
            onClick={() => handlePredict('sideways')}
            className="px-3 py-1.5 text-xs font-medium text-white bg-gray-600 hover:bg-gray-500 rounded transition-all"
          >
            ➡️ Sideways
          </button>
          <button
            onClick={() => handlePredict('down')}
            className="px-3 py-1.5 text-xs font-medium text-white bg-crypto-accent-red hover:brightness-110 rounded transition-all"
          >
            📉 Down
          </button>
          <button
            onClick={() => setShowOptions(false)}
            className="px-2 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
