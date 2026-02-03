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
    <div className="flex-shrink-0 w-28 bg-[#1a1a3e]/60 backdrop-blur-sm rounded-xl p-3 transition-all duration-300 hover:bg-[#1a1a3e] hover:shadow-[0_0_20px_rgba(153,69,255,0.15)] border border-[#2a2a4a]/50">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-sm font-bold text-white">{coin.symbol.toUpperCase()}</span>
      </div>
      <div className="text-sm text-[#ab9ff2] mb-1 truncate font-medium">
        ${coin.current_price.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: coin.current_price < 1 ? 4 : 2,
        })}
      </div>
      <div
        className={`text-sm font-semibold ${
          isPositive
            ? 'text-[#14f195]'
            : 'text-[#f43f5e]'
        }`}
      >
        {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
      </div>
      {sparklineData.length > 0 && (
        <div className="mt-2">
          <Sparkline
            data={sparklineData}
            width={88}
            height={24}
            color={isPositive ? '#14f195' : '#f43f5e'}
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
