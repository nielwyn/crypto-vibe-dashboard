import React, { useState, useEffect } from 'react';
import { CoinData } from '../../types';
import { Sparkline } from './Sparkline';

interface CoinCardProps {
  coin: CoinData;
  previousPrice?: number;
}

export const CoinCard: React.FC<CoinCardProps> = ({ coin, previousPrice }) => {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (previousPrice && previousPrice !== coin.current_price) {
      setFlash(coin.current_price > previousPrice ? 'up' : 'down');
      const timer = setTimeout(() => setFlash(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [coin.current_price, previousPrice]);

  const isPositive = coin.price_change_percentage_24h > 0;
  const sparklineData = coin.sparkline_in_7d?.price || [];

  return (
    <div
      className={`bg-gray-900 rounded-lg p-4 transition-all duration-300 ${
        flash === 'up'
          ? 'ring-2 ring-crypto-accent-green'
          : flash === 'down'
          ? 'ring-2 ring-crypto-accent-red'
          : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{coin.symbol.toUpperCase()}</h3>
            <span className="text-xs text-gray-500">{coin.name}</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            ${coin.current_price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        
        <div
          className={`text-sm font-semibold px-2 py-1 rounded ${
            isPositive
              ? 'bg-green-900/30 text-crypto-accent-green'
              : 'bg-red-900/30 text-crypto-accent-red'
          }`}
        >
          {isPositive ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>

      {sparklineData.length > 0 && (
        <div className="mt-2">
          <Sparkline
            data={sparklineData}
            width={280}
            height={40}
            color={isPositive ? '#00ff88' : '#ff3366'}
          />
          <div className="text-xs text-gray-500 mt-1">7-day trend</div>
        </div>
      )}
    </div>
  );
};
