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
        <span className="text-orange-500 text-lg">🔥</span>
        <span className="text-gray-300">
          <span className="font-bold text-white">{streak}</span> day{streak !== 1 ? 's' : ''} streak
        </span>
      </div>
      {getDiamondHandsMessage() && (
        <div className="text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
          {getDiamondHandsMessage()}
        </div>
      )}
    </div>
  );
};
