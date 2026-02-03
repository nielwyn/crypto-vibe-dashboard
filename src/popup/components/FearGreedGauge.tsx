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
    <div className="phantom-card p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#ab9ff2]/60 uppercase tracking-wider font-medium">Market Mood</span>
        <span className="text-2xl">{colors.emoji}</span>
      </div>
      
      {/* Gauge bar */}
      <div className="relative h-3 bg-[#2a2a4a] rounded-full overflow-hidden mb-3">
        <div 
          className="absolute h-full bg-gradient-to-r from-[#f43f5e] via-[#fbbf24] to-[#14f195]"
          style={{ width: '100%' }}
        />
        <div 
          className="absolute h-5 w-1 bg-white rounded-full top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          style={{ left: `${fearGreed.score}%` }}
        />
      </div>
      
      {/* Score and label */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-4xl font-bold text-white">{fearGreed.score}</span>
        <span className={`text-base font-semibold ${colors.text}`}>{getStateLabel()}</span>
      </div>
    </div>
  );
};
