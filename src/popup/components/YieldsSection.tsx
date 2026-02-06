import { YieldCard } from './YieldCard';
import { YieldPool } from '../../types';
import { useDragScroll } from '../../hooks/useDragScroll';

interface YieldsSectionProps {
  yields: YieldPool[];
  loading: boolean;
  focusedToken?: string;
}

export function YieldsSection({ yields, loading, focusedToken }: YieldsSectionProps) {
  const hotYield = yields.find(pool => pool.apy > 8);
  const loadingScrollRef = useDragScroll<HTMLDivElement>();
  const yieldsScrollRef = useDragScroll<HTMLDivElement>();

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
        <div ref={loadingScrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-20 bg-[#1e2040]/70 backdrop-blur-sm rounded-xl p-2 animate-pulse border border-[#3d4470]/50">
              <div className="h-3 bg-[#3d4470] rounded mb-1" />
              <div className="h-2 bg-[#3d4470] rounded mb-1" />
              <div className="h-4 bg-[#3d4470] rounded" />
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
        <div className="text-center text-[#8da4d4]/60 text-sm py-4">
          No yield data available
        </div>
      )}
    </div>
  );
}
