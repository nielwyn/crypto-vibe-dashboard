import React from 'react';
import { FearGreedData } from '../../types';

interface FearGreedGaugeProps {
  fearGreed: FearGreedData;
}

export const FearGreedGauge: React.FC<FearGreedGaugeProps> = ({ fearGreed }) => {
  const getStateColor = () => {
    switch (fearGreed.state) {
      case 'extreme-greed':
        return {
          text: 'text-green-500',
          bg: 'bg-green-500',
          emoji: '🤑'
        };
      case 'greed':
        return {
          text: 'text-green-400',
          bg: 'bg-green-400',
          emoji: '😎'
        };
      case 'fear':
        return {
          text: 'text-orange-400',
          bg: 'bg-orange-400',
          emoji: '😰'
        };
      case 'extreme-fear':
        return {
          text: 'text-red-500',
          bg: 'bg-red-500',
          emoji: '😱'
        };
    }
  };

  const getStateLabel = () => {
    switch (fearGreed.state) {
      case 'extreme-greed':
        return 'Extreme Greed';
      case 'greed':
        return 'Greed';
      case 'fear':
        return 'Fear';
      case 'extreme-fear':
        return 'Extreme Fear';
    }
  };

  const colors = getStateColor();

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-4">
      <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
        Fear & Greed Index
      </h2>
      
      <div className="space-y-4">
        {/* Visual Gauge Bar */}
        <div className="relative">
          <div className="h-8 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-full overflow-hidden">
            {/* Needle/Indicator */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-1000 ease-out"
              style={{
                left: `${fearGreed.score}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
            </div>
          </div>
          
          {/* Scale markers */}
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        {/* Score and State */}
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-3xl font-bold ${colors.text} transition-colors duration-500`}>
              {fearGreed.score}
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wide">
              {getStateLabel()} {colors.emoji}
            </div>
          </div>
          
          {/* Component breakdown */}
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between gap-4">
              <span>Volatility:</span>
              <span className="font-mono">{fearGreed.components.volatility}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Momentum:</span>
              <span className="font-mono">{fearGreed.components.momentum}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>BTC.D:</span>
              <span className="font-mono">{fearGreed.components.btcDominance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
