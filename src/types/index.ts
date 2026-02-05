export interface MarketSentiment {
  mood: 'bullish' | 'bearish' | 'neutral';
  score: number;
  lastUpdated: number;
}

export interface FearGreedData {
  score: number; // 0-100
  state: 'extreme-fear' | 'fear' | 'greed' | 'extreme-greed';
  components: {
    volatility: number;
    momentum: number;
    btcDominance: number;
  };
  lastUpdated: number;
}

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
}

export interface AIAnalysis {
  summary: string;
  generatedAt: number;
  basedOn: object;
  actionCards?: import('./actionCards').ActionCard[];
  persona?: string;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  scrapedAt: number;
}

export interface UserPreferences {
  selectedCoins: string[];
  refreshInterval: number;
  aiMode: 'professional' | 'degen';
  soundEnabled: boolean;
  aiPersona?: string;
}

export interface UserStats {
  streak: number;
  lastVisit: number;
  totalChecks: number;
  predictions: Prediction[];
  badges: string[];
}

export interface Prediction {
  coin: string;
  direction: 'up' | 'down' | 'sideways';
  priceAtPrediction: number;
  timestamp: number;
  result: 'correct' | 'wrong' | 'pending';
}

export interface YieldPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number | null;
  stablecoin: boolean;
  rewardTokens?: string[];
}

export interface YieldsData {
  pools: YieldPool[];
  lastUpdated: number;
  topYield: YieldPool | null;
}
