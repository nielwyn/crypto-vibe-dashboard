import { CoinData, FearGreedData } from '../types';

interface MarketData {
  priceChange24h: number; // avg of tracked coins
  volatility: number; // calculated from price swings
  btcDominance: number; // from CoinGecko global
}

/**
 * Calculate Fear & Greed Index based on market data
 * Formula: Score = (volatility_score * 0.35) + (momentum_score * 0.35) + (btc_dominance_score * 0.30)
 */
export function calculateFearGreedIndex(data: MarketData): FearGreedData {
  // 1. Volatility Score (35%)
  // High volatility (>5%) = Fear, Low (<2%) = Greed
  const volatilityScore = normalizeVolatility(data.volatility);
  
  // 2. Momentum Score (35%)
  // Positive change = Greed, Negative = Fear
  const momentumScore = normalizeMomentum(data.priceChange24h);
  
  // 3. BTC Dominance Score (30%)
  // High BTC.D (>50%) = Fear (flight to safety), Low = Greed (altseason)
  const btcDominanceScore = normalizeBtcDominance(data.btcDominance);
  
  // Weighted average
  const score = Math.round(
    volatilityScore * 0.35 +
    momentumScore * 0.35 +
    btcDominanceScore * 0.30
  );
  
  const state = getState(score);
  
  return {
    score,
    state,
    components: {
      volatility: Math.round(volatilityScore),
      momentum: Math.round(momentumScore),
      btcDominance: Math.round(btcDominanceScore)
    },
    lastUpdated: Date.now()
  };
}

function normalizeVolatility(volatility: number): number {
  // Invert: high volatility = low score (fear)
  if (volatility > 10) return 10;
  if (volatility < 1) return 90;
  return 100 - (volatility * 9);
}

function normalizeMomentum(change: number): number {
  // +10% = 100, -10% = 0
  return Math.max(0, Math.min(100, 50 + (change * 5)));
}

function normalizeBtcDominance(btcD: number): number {
  // Low BTC.D (<40%) = Greed (altseason), High (>60%) = Fear
  if (btcD > 60) return 20;
  if (btcD < 40) return 80;
  return 100 - (btcD - 40) * 3;
}

function getState(score: number): 'extreme-fear' | 'fear' | 'greed' | 'extreme-greed' {
  if (score <= 24) return 'extreme-fear';
  if (score <= 49) return 'fear';
  if (score <= 74) return 'greed';
  return 'extreme-greed';
}

/**
 * Calculate market data from coin list
 */
export function calculateMarketData(coins: CoinData[], btcDominance: number): MarketData {
  if (!coins || coins.length === 0) {
    return {
      priceChange24h: 0,
      volatility: 0,
      btcDominance: btcDominance || 50
    };
  }

  // Calculate average price change
  const avgChange = coins.reduce(
    (sum, coin) => sum + coin.price_change_percentage_24h,
    0
  ) / coins.length;

  // Calculate volatility from standard deviation of price changes
  const mean = avgChange;
  const squaredDiffs = coins.map(coin => 
    Math.pow(coin.price_change_percentage_24h - mean, 2)
  );
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / coins.length;
  const volatility = Math.sqrt(variance);

  return {
    priceChange24h: avgChange,
    volatility,
    btcDominance: btcDominance || 50
  };
}
