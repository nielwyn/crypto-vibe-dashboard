import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  isGoldenDay?: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ trigger, isGoldenDay = false }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timeout = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  if (!show) return null;

  const confettiColors = isGoldenDay
    ? ['#FFD700', '#FFA500', '#FFFF00', '#FF8C00']
    : ['#00ff88', '#ff3366', '#8b5cf6', '#3b82f6', '#f59e0b'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => {
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const left = Math.random() * 100;
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        
        return (
          <div
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${left}%`,
              top: '-10px',
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            <div
              className="w-2 h-2 animate-confetti-spin"
              style={{
                backgroundColor: color,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
