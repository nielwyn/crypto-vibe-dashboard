import { YieldPool } from '../../types';

interface YieldCardProps {
  pool: YieldPool;
}

export function YieldCard({ pool }: YieldCardProps) {
  const getApyColor = (apy: number) => {
    if (apy > 5) return 'text-green-400';
    if (apy >= 2) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const formatTvl = (tvl: number) => {
    if (tvl >= 1_000_000_000) {
      return `$${(tvl / 1_000_000_000).toFixed(1)}B`;
    }
    return `$${(tvl / 1_000_000).toFixed(0)}M`;
  };

  const isHotYield = pool.apy > 8;

  return (
    <div className="flex-shrink-0 w-[140px] bg-gray-900 rounded-lg p-3 border border-gray-800 hover:border-purple-500 transition-all relative">
      {isHotYield && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
          🔥 HOT
        </div>
      )}
      
      <div className="space-y-2">
        {/* Protocol */}
        <div className="text-sm font-bold text-white truncate" title={pool.project}>
          🏦 {pool.project.toUpperCase()}
        </div>
        
        {/* Chain */}
        <div className="text-xs text-gray-400 truncate" title={pool.chain}>
          {pool.chain}
        </div>
        
        {/* Symbol */}
        <div className="text-xs text-purple-400 font-medium truncate" title={pool.symbol}>
          {pool.symbol}
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-800"></div>
        
        {/* APY */}
        <div className={`text-lg font-bold ${getApyColor(pool.apy)}`}>
          {pool.apy.toFixed(2)}% {pool.apy > 5 ? '🟢' : pool.apy >= 2 ? '🟡' : ''}
        </div>
        
        {/* TVL */}
        <div className="text-xs text-gray-500">
          TVL: {formatTvl(pool.tvlUsd)}
        </div>
      </div>
    </div>
  );
}
