import React from 'react';
import { MarketSentiment } from '../../types';

interface MoodGaugeProps {
  sentiment: MarketSentiment;
}

export const MoodGauge: React.FC<MoodGaugeProps> = ({ sentiment }) => {
  const getMoodColor = () => {
    switch (sentiment.mood) {
      case 'bullish':
        return 'text-crypto-accent-green';
      case 'bearish':
        return 'text-crypto-accent-red';
      default:
        return 'text-gray-400';
    }
  };

  const getMoodIcon = () => {
    switch (sentiment.mood) {
      case 'bullish':
        return '📈';
      case 'bearish':
        return '📉';
      default:
        return '➖';
    }
  };

  const getRotation = () => {
    // Map score from -10 to 10 to rotation from -90 to 90 degrees
    const clampedScore = Math.max(-10, Math.min(10, sentiment.score));
    return (clampedScore / 10) * 90;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-4">
      <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
        Market Mood
      </h2>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className={`text-4xl font-bold ${getMoodColor()} mb-2 transition-colors duration-500`}>
            {sentiment.mood.toUpperCase()}
          </div>
          <div className="text-gray-400 text-sm">
            Score: {sentiment.score.toFixed(2)}%
          </div>
        </div>
        
        <div className="relative w-32 h-32">
          {/* Gauge background */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-800" />
          
          {/* Gauge fill */}
          <div
            className={`absolute inset-0 rounded-full border-8 ${
              sentiment.mood === 'bullish'
                ? 'border-crypto-accent-green'
                : sentiment.mood === 'bearish'
                ? 'border-crypto-accent-red'
                : 'border-gray-500'
            } transition-all duration-1000 ease-out`}
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${
                getRotation() >= 0 ? '100% 0%, 100% 100%' : '0% 0%, 0% 100%'
              })`,
              transform: `rotate(${getRotation()}deg)`,
            }}
          />
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">{getMoodIcon()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
