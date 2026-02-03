import React from 'react';
import { FearGreedData } from '../../types';

interface MascotProps {
  fearGreed: FearGreedData;
}

export const Mascot: React.FC<MascotProps> = ({ fearGreed }) => {
  const getMascot = () => {
    const score = fearGreed.score;
    
    if (score >= 75) {
      // Extreme Greed (75-100)
      return { emoji: '🤑', animation: 'animate-bounce', label: 'To the moon!' };
    } else if (score >= 50) {
      // Greed (50-74)
      return { emoji: '😎', animation: 'animate-pulse', label: 'Feeling good!' };
    } else if (score >= 25) {
      // Fear (25-49)
      return { emoji: '😰', animation: 'animate-shake', label: 'Getting nervous' };
    } else {
      // Extreme Fear (0-24)
      return { emoji: '😱', animation: 'animate-panic', label: 'PANIC!' };
    }
  };

  const mascot = getMascot();

  return (
    <div className="absolute top-4 right-4 flex flex-col items-center gap-1 z-10">
      <div className={`text-4xl ${mascot.animation}`}>
        {mascot.emoji}
      </div>
      <div className="text-xs text-gray-400 whitespace-nowrap">
        {mascot.label}
      </div>
    </div>
  );
};
