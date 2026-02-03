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
    <div className="phantom-card p-3 mb-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white">💰 Top Yields</span>
        {hotYield && (
          <span className="text-xs bg-[#14f195]/15 text-[#14f195] px-2 py-0.5 rounded-full animate-pulse border border-[#14f195]/30">
            🔥 {hotYield.apy.toFixed(1)}% on {hotYield.project}
          </span>
        )}
      </div>
      
      {loading ? (
        <div ref={loadingScrollRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-shrink-0 w-20 bg-[#1a1a3e]/60 backdrop-blur-sm rounded-xl p-2 animate-pulse border border-[#2a2a4a]/50">
              <div className="h-3 bg-[#2a2a4a] rounded mb-1" />
              <div className="h-2 bg-[#2a2a4a] rounded mb-1" />
              <div className="h-4 bg-[#2a2a4a] rounded" />
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
        <div className="text-center text-[#ab9ff2]/60 text-sm py-4">
          No yield data available
        </div>
      )}
    </div>
  );
}
