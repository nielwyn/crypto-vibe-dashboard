import { YieldCard } from './YieldCard';
import { YieldPool } from '../../types';

interface YieldsSectionProps {
  yields: YieldPool[];
  loading: boolean;
}

export function YieldsSection({ yields, loading }: YieldsSectionProps) {
  const hotYield = yields.find(pool => pool.apy > 8);

  return (
    <div className="mb-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-purple-400">💰 TOP DEFI YIELDS</h3>
        <span className="text-xs text-gray-500">← Scroll →</span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-[140px] bg-gray-900 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-gray-800 rounded mb-2" />
              <div className="h-3 bg-gray-800 rounded mb-2" />
              <div className="h-3 bg-gray-800 rounded mb-2" />
              <div className="h-6 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : yields.length > 0 ? (
        <>
          {/* Yields Cards */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {yields.map((pool) => (
              <YieldCard key={pool.pool} pool={pool} />
            ))}
          </div>

          {/* Hot Yield Alert */}
          {hotYield && (
            <div className="mt-3 bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/50 rounded-lg p-2 text-center">
              <span className="text-sm font-bold text-orange-400">
                🔥 Hot Yield Alert: {hotYield.apy.toFixed(2)}% on {hotYield.project}!
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 text-sm py-4">
          No yield data available
        </div>
      )}
    </div>
  );
}
