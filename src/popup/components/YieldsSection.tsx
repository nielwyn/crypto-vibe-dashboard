import { YieldCard } from './YieldCard';
import { YieldPool } from '../../types';
import { useDragScroll } from '../../hooks/useDragScroll';

interface YieldsSectionProps {
  yields: YieldPool[];
  loading: boolean;
}

export function YieldsSection({ yields, loading }: YieldsSectionProps) {
  const hotYield = yields.find(pool => pool.apy > 8);
  const loadingScrollRef = useDragScroll<HTMLDivElement>();
  const yieldsScrollRef = useDragScroll<HTMLDivElement>();

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-3 mb-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white">💰 Top Yields</span>
        {hotYield && (
          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full animate-pulse">
            🔥 {hotYield.apy.toFixed(1)}% on {hotYield.project}
          </span>
        )}
      </div>
      
      {loading ? (
        <div ref={loadingScrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-20 bg-[#242424] rounded-lg p-2 animate-pulse">
              <div className="h-3 bg-gray-700 rounded mb-1" />
              <div className="h-2 bg-gray-700 rounded mb-1" />
              <div className="h-4 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : yields.length > 0 ? (
        <div ref={yieldsScrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {yields.map((pool) => (
            <YieldCard key={pool.pool} pool={pool} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm py-4">
          No yield data available
        </div>
      )}
    </div>
  );
}
