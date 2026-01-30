import React from 'react';
import { MarketSentiment } from '../../types';

interface MascotProps {
  sentiment: MarketSentiment;
}

export const Mascot: React.FC<MascotProps> = ({ sentiment }) => {
  const getMascot = () => {
    const score = sentiment.score;
    
    if (score > 5) {
      // Extreme Bullish
      return { emoji: '🤑', animation: 'animate-bounce', label: 'To the moon!' };
    } else if (score > 2) {
      // Bullish
      return { emoji: '😎', animation: 'animate-pulse', label: 'Feeling good!' };
    } else if (score > -2) {
      // Neutral
      return { emoji: '😐', animation: '', label: 'Vibing...' };
    } else if (score > -5) {
      // Bearish
      return { emoji: '😰', animation: 'animate-shake', label: 'Getting nervous' };
    } else {
      // Extreme Bearish
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
