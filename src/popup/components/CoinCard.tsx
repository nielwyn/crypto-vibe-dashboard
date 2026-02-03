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
      className={`flex-shrink-0 w-24 bg-[#242424] rounded-lg p-2 border border-gray-700 transition-all duration-300 ${
        flash === 'up'
          ? 'ring-2 ring-crypto-accent-green'
          : flash === 'down'
          ? 'ring-2 ring-crypto-accent-red'
          : ''
      }`}
    >
      <div className="flex items-center gap-1 mb-1">
        <span className="text-xs font-bold text-white">{coin.symbol.toUpperCase()}</span>
      </div>
      <div className="text-xs text-gray-400 mb-1 truncate">
        ${coin.current_price.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
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
};
