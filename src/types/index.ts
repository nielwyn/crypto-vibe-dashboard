export interface MarketSentiment {
  mood: 'bullish' | 'bearish' | 'neutral';
  score: number;
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
}
