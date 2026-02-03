import React from 'react';
import { FearGreedData } from '../../types';

interface FearGreedGaugeProps {
  fearGreed: FearGreedData;
}

export const FearGreedGauge: React.FC<FearGreedGaugeProps> = ({ fearGreed }) => {
  const getStateColor = () => {
    switch (fearGreed.state) {
      case 'extreme-greed':
        return {
          text: 'text-green-500',
          bg: 'bg-green-500',
          emoji: '🤑'
        };
      case 'greed':
        return {
          text: 'text-green-400',
          bg: 'bg-green-400',
          emoji: '😎'
        };
      case 'fear':
        return {
          text: 'text-orange-400',
          bg: 'bg-orange-400',
          emoji: '😰'
        };
      case 'extreme-fear':
        return {
          text: 'text-red-500',
          bg: 'bg-red-500',
          emoji: '😱'
        };
    }
  };

  const getStateLabel = () => {
    switch (fearGreed.state) {
      case 'extreme-greed':
        return 'Extreme Greed';
      case 'greed':
        return 'Greed';
      case 'fear':
        return 'Fear';
      case 'extreme-fear':
        return 'Extreme Fear';
    }
  };

  const colors = getStateColor();

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 mb-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-400 uppercase tracking-wider">MARKET MOOD</span>
        <span className="text-2xl">{colors.emoji}</span>
      </div>
      
      {/* Gauge bar */}
      <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
        <div 
          className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
          style={{ width: '100%' }}
        />
        <div 
          className="absolute h-6 w-1 bg-white top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
          style={{ left: `${fearGreed.score}%` }}
        />
      </div>
      
      {/* Score and label */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-3xl font-bold text-white">{fearGreed.score}</span>
        <span className={`text-lg font-medium ${colors.text}`}>{getStateLabel().toUpperCase()}</span>
      </div>
    </div>
  );
};
