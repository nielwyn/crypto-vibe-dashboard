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
    <div className="relative flex items-center gap-1">
      <span className={`text-2xl ${mascot.animation}`}>
        {mascot.emoji}
      </span>
      {/* Optional: small mood indicator below */}
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-gray-500 whitespace-nowrap">
        {mascot.label.split(' ')[0]}
      </span>
    </div>
  );
};
