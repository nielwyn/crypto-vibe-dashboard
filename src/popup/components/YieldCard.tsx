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

  return (
    <div className="flex-shrink-0 w-20 bg-[#242424] rounded-lg p-2 border border-gray-700 text-center">
      <div className="text-xs text-gray-400 truncate" title={pool.project}>
        {pool.project}
      </div>
      <div className="text-xs text-gray-500 truncate" title={pool.chain}>
        {pool.chain}
      </div>
      <div className={`text-sm font-bold mt-1 ${getApyColor(pool.apy)}`}>
        {pool.apy.toFixed(1)}%
      </div>
    </div>
  );
}
