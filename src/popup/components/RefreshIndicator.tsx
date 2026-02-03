import React, { useState, useEffect } from 'react';

interface RefreshIndicatorProps {
  lastUpdated: Date | null;
  nextRefreshIn?: number;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({
  lastUpdated,
  nextRefreshIn = 30,
}) => {
  const [countdown, setCountdown] = useState(nextRefreshIn);

  useEffect(() => {
    setCountdown(nextRefreshIn);
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return nextRefreshIn;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated, nextRefreshIn]);

  return (
    <div className="flex items-center gap-2 text-xs text-[#ab9ff2]/60">
      <div className="relative">
        <div className="w-2 h-2 bg-[#14f195] rounded-full animate-pulse" />
        <div className="absolute inset-0 w-2 h-2 bg-[#14f195] rounded-full animate-ping opacity-75" />
      </div>
      <span>Refreshing in {countdown}s</span>
    </div>
  );
};
