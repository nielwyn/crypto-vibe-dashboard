import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { YieldPool } from '../../types';

// DEX protocols - show pair like SOL/USDC
const DEX_PROTOCOLS = ['uniswap', 'pancakeswap', 'raydium', 'sushiswap', 'curve', 'balancer', 'velodrome', 'aerodrome', 'camelot', 'trader-joe', 'orca'];

// Lending protocols - show single asset
const LENDING_PROTOCOLS = ['aave', 'compound', 'venus', 'kamino', 'morpho', 'spark', 'benqi', 'radiant'];

// Staking protocols - show single staking asset
const STAKING_PROTOCOLS = ['lido', 'lista', 'jito', 'rocketpool', 'frax-ether', 'stakewise', 'marinade'];

type ProtocolType = 'DEX' | 'Lending' | 'Staking' | 'Other';

function getProtocolType(project: string): ProtocolType {
  const projectLower = project.toLowerCase();
  if (DEX_PROTOCOLS.some(p => projectLower.includes(p))) return 'DEX';
  if (LENDING_PROTOCOLS.some(p => projectLower.includes(p))) return 'Lending';
  if (STAKING_PROTOCOLS.some(p => projectLower.includes(p))) return 'Staking';
  return 'Other';
}

function getProtocolLabel(type: ProtocolType): string {
  switch (type) {
    case 'DEX': return 'DEX';
    case 'Lending': return 'Lend';
    case 'Staking': return 'Stake';
    default: return 'Yield';
  }
}

function getApyColor(apy: number) {
  if (apy > 5) return 'text-[#14f195]';
  if (apy >= 2) return 'text-[#5a7cc0]';
  return 'text-gray-400';
}

interface TooltipData {
  x: number;
  y: number;
  pool: YieldPool;
  protocolType: ProtocolType;
}

interface YieldsSectionProps {
  yields: YieldPool[];
  loading: boolean;
  focusedToken?: string;
}

const ITEMS_PER_PAGE = 3;

export function YieldsSection({ yields, loading, focusedToken }: YieldsSectionProps) {
  const [page, setPage] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const hotYield = yields.find(pool => pool.apy > 8);
  
  const totalPages = Math.ceil(yields.length / ITEMS_PER_PAGE);
  const visibleYields = yields.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
  
  const goNext = () => setPage(p => Math.min(p + 1, totalPages - 1));
  const goPrev = () => setPage(p => Math.max(p - 1, 0));

  const handleMouseEnter = (e: React.MouseEvent, pool: YieldPool) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      pool,
      protocolType: getProtocolType(pool.project),
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  // Close tooltip on scroll
  useEffect(() => {
    if (!tooltip) return;
    
    const handleScroll = () => setTooltip(null);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [tooltip]);

  return (
    <div className="phantom-card p-3 mb-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">💰 Top Yields</span>
          {focusedToken && (
            <span className="text-xs text-[#ab9ff2] bg-[#ab9ff2]/10 px-1.5 py-0.5 rounded">
              {focusedToken.toUpperCase()}
            </span>
          )}
        </div>
        {hotYield && (
          <span className="text-xs bg-[#14f195]/15 text-[#14f195] px-2 py-0.5 rounded-full animate-pulse border border-[#14f195]/30">
            🔥 {hotYield.apy.toFixed(1)}%
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1e2040]/70 backdrop-blur-sm rounded-xl p-2 animate-pulse border border-[#3d4470]/50">
              <div className="h-3 bg-[#3d4470] rounded mb-1" />
              <div className="h-2 bg-[#3d4470] rounded mb-1" />
              <div className="h-4 bg-[#3d4470] rounded" />
            </div>
          ))}
        </div>
      ) : yields.length > 0 ? (
        <div>
          {/* Grid of yields */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            {visibleYields.map((pool) => {
              const protocolType = getProtocolType(pool.project);
              return (
                <div
                  key={pool.pool}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#1e2040]/70 border border-[#3d4470]/50 hover:bg-[#2a2d50] hover:border-[#5a7cc0]/40 transition-all cursor-default"
                  onMouseEnter={(e) => handleMouseEnter(e, pool)}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="text-xs text-white/90 truncate w-full text-center font-medium">{pool.project}</span>
                  <span className="text-[10px] text-[#ab9ff2] truncate w-full text-center">{pool.symbol}</span>
                  <span className="text-[9px] text-[#8da4d4]/60">{pool.chain} • {getProtocolLabel(protocolType)}</span>
                  <span className={`text-sm font-bold ${getApyColor(pool.apy)}`}>{pool.apy.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={goPrev}
                disabled={page === 0}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1e2040]/70 border border-[#3d4470]/50 text-[#8da4d4] hover:bg-[#2a2d50] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ←
              </button>
              <span className="text-xs text-[#8da4d4]">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={goNext}
                disabled={page >= totalPages - 1}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1e2040]/70 border border-[#3d4470]/50 text-[#8da4d4] hover:bg-[#2a2d50] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                →
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-[#8da4d4]/60 text-sm py-4">
          No yield data available
        </div>
      )}

      {/* Instant tooltip via portal */}
      {tooltip && createPortal(
        <div 
          className="fixed z-[100] px-3 py-2 bg-[#1e2040] border border-[#3d4470] rounded-lg text-xs text-white whitespace-nowrap pointer-events-none shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-medium text-white">{tooltip.pool.project}</div>
          <div className="text-[#ab9ff2]">{tooltip.pool.symbol}</div>
          <div className="text-[#8da4d4]/80">{tooltip.pool.chain} • {getProtocolLabel(tooltip.protocolType)}</div>
          <div className={`font-bold ${getApyColor(tooltip.pool.apy)}`}>
            APR: {tooltip.pool.apy.toFixed(2)}%
          </div>
          {tooltip.pool.tvlUsd && (
            <div className="text-[#8da4d4]/60">TVL: ${(tooltip.pool.tvlUsd / 1_000_000).toFixed(1)}M</div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
