import React, { memo } from 'react';
import { CoinData } from '../../types';
import { Sparkline } from './Sparkline';

interface CoinCardProps {
  coin: CoinData;
  timeframe?: '24h' | '7d';
  chartData?: number[]; // Allow passing custom chart data for different timeframes
}

export const CoinCard: React.FC<CoinCardProps> = memo(({ coin, timeframe = '7d', chartData }) => {
  const isPositive = coin.price_change_percentage_24h > 0;
  
  // Get sparkline data based on timeframe
  const getSparklineData = () => {
    // If custom chart data is provided, use it
    if (chartData && chartData.length > 0) {
      return chartData;
    }
    
    const fullData = coin.sparkline_in_7d?.price || [];
    if (fullData.length === 0) return [];
    
    switch (timeframe) {
      case '24h':
        // Last 24 points (hourly data for 1 day)
        return fullData.slice(-24);
      case '7d':
        // All 168 points (7 days * 24 hours)
        return fullData;
      default:
        return fullData;
    }
  };
  
  const sparklineData = getSparklineData();

  return (
    <div className="flex-shrink-0 w-24 bg-[#242424] rounded-lg p-2 transition-all duration-300 hover:bg-[#2a2a2a]">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xs font-bold text-white">{coin.symbol.toUpperCase()}</span>
      </div>
      <div className="text-xs text-gray-400 mb-1 truncate">
        ${coin.current_price.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: coin.current_price < 1 ? 4 : 0,
        })}
      </div>
      <div
        className={`text-sm font-medium ${
          isPositive
            ? 'text-green-400'
            : 'text-red-400'
        }`}
      >
        {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(1)}%
      </div>
      {sparklineData.length > 0 && (
        <div className="mt-1">
          <Sparkline
            data={sparklineData}
            width={80}
            height={20}
            color={isPositive ? '#22c55e' : '#ef4444'}
          />
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.coin.id === nextProps.coin.id &&
    prevProps.coin.current_price === nextProps.coin.current_price &&
    prevProps.coin.price_change_percentage_24h === nextProps.coin.price_change_percentage_24h &&
    prevProps.timeframe === nextProps.timeframe &&
    prevProps.chartData === nextProps.chartData
  );
});
