import { useState } from 'react';
import { createPortal } from 'react-dom';
import { YieldPool } from '../../types';

interface YieldCardProps {
  pool: YieldPool;
}

export function YieldCard({ pool }: YieldCardProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  const getApyColor = (apy: number) => {
    if (apy > 5) return 'text-[#14f195]';
    if (apy >= 2) return 'text-[#5a7cc0]';
    return 'text-gray-400';
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <>
      <div 
        className="flex-shrink-0 w-20 bg-[#1e2040]/70 backdrop-blur-sm rounded-xl p-2 border border-[#3d4470]/50 text-center hover:bg-[#2a2d50] hover:border-[#5a7cc0]/40 transition-all duration-200"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="text-xs text-white/90 truncate font-medium">
          {pool.project}
        </div>
        <div className="text-xs text-[#8da4d4]/60 truncate">
          {pool.chain}
        </div>
        <div className={`text-sm font-bold mt-1 ${getApyColor(pool.apy)}`}>
          {pool.apy.toFixed(1)}%
        </div>
      </div>
      {tooltip && createPortal(
        <div 
          className="fixed z-[100] px-2 py-1 bg-[#1e2040] border border-[#3d4470] rounded-lg text-xs text-white whitespace-nowrap pointer-events-none shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-medium">{pool.project}</div>
          <div className="text-[#8da4d4]/60">{pool.chain}</div>
        </div>,
        document.body
      )}
    </>
  );
}
