import React from 'react';

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-orange-500 text-lg">🔥</span>
      <span className="text-gray-300">
        <span className="font-bold text-white">{streak}</span> day{streak !== 1 ? 's' : ''} streak
      </span>
    </div>
  );
};
