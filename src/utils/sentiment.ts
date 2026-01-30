import { CoinData, MarketSentiment } from '../types';

export function calculateMarketSentiment(coins: CoinData[]): MarketSentiment {
  if (!coins || coins.length === 0) {
    return {
      mood: 'neutral',
      score: 0,
      lastUpdated: Date.now(),
    };
  }

  const avgChange = coins.reduce(
    (sum, coin) => sum + coin.price_change_percentage_24h,
    0
  ) / coins.length;

  let mood: 'bullish' | 'bearish' | 'neutral';
  if (avgChange > 2) {
    mood = 'bullish';
  } else if (avgChange < -2) {
    mood = 'bearish';
  } else {
    mood = 'neutral';
  }

  return {
    mood,
    score: avgChange,
    lastUpdated: Date.now(),
  };
}
