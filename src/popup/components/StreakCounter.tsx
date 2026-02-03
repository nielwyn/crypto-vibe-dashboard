import React from 'react';

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  if (streak === 0) return null;

  const getDiamondHandsMessage = () => {
    if (streak >= 30) return '💎🙌 LEGENDARY DIAMOND HANDS!';
    if (streak >= 14) return '💎 Diamond Hands!';
    if (streak >= 7) return '💎 Diamond Hands!';
    return null;
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#f97316] text-lg">🔥</span>
        <span className="text-[#ab9ff2]/80">
          <span className="font-bold text-white">{streak}</span> day{streak !== 1 ? 's' : ''} streak
        </span>
      </div>
      {getDiamondHandsMessage() && (
        <div className="text-xs font-bold bg-gradient-to-r from-[#9945ff] to-[#14f195] bg-clip-text text-transparent animate-pulse">
          {getDiamondHandsMessage()}
        </div>
      )}
    </div>
  );
};
