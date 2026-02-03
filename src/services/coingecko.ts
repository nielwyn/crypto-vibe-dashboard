import { CoinData } from '../types';

// CoinGecko API - FREE tier (no API key required)
// Rate limit: ~10-30 calls/minute on free tier
// Docs: https://www.coingecko.com/api/documentation
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Track last API call to avoid rate limiting
let lastApiCall = 0;
const MIN_API_INTERVAL = 3000; // 3 seconds between calls (safe for free tier)

// Simple in-memory cache for the current session
let coinCache: { data: CoinData[]; timestamp: number } | null = null;
const CACHE_TTL = 30000; // 30 seconds cache

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCall;
  
  if (timeSinceLastCall < MIN_API_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_API_INTERVAL - timeSinceLastCall));
  }
  
  lastApiCall = Date.now();
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
  });
  
  // Check for rate limiting
  if (response.status === 429) {
    console.warn('CoinGecko rate limit hit, using cached data');
    throw new Error('RATE_LIMITED');
  }
  
  return response;
}

export const coingecko = {
  /**
   * Get market data for multiple coins including sparklines
   * Uses CoinGecko's /coins/markets endpoint
   */
  async getCoins(coinIds: string[]): Promise<CoinData[]> {
    // Check in-memory cache first
    if (coinCache && Date.now() - coinCache.timestamp < CACHE_TTL) {
      const cachedIds = coinCache.data.map(c => c.id);
      if (coinIds.every(id => cachedIds.includes(id))) {
        console.log('Using in-memory coin cache');
        return coinCache.data.filter(c => coinIds.includes(c.id));
      }
    }

    try {
      const ids = coinIds.join(',');
      
      // Request sparkline data (168 hourly points = 7 days)
      const response = await rateLimitedFetch(
        `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      
      const data: CoinData[] = await response.json();
      
      // Validate the response has sparkline data
      if (data && data.length > 0) {
        console.log(`CoinGecko: Fetched ${data.length} coins with sparklines`);
        
        // Log sparkline data availability
        data.forEach(coin => {
          const sparklineLength = coin.sparkline_in_7d?.price?.length || 0;
          console.log(`  ${coin.symbol.toUpperCase()}: ${sparklineLength} sparkline points`);
        });
        
        // Update in-memory cache
        coinCache = { data, timestamp: Date.now() };
        
        return data;
      }
      
      throw new Error('Invalid API response');
    } catch (error) {
      console.error('CoinGecko API error:', error);
      
      // If we have cache, use it
      if (coinCache) {
        console.log('Using stale coin cache due to API error');
        return coinCache.data.filter(c => coinIds.includes(c.id));
      }
      
      // Last resort: mock data
      console.warn('No cache available, using mock data');
      return getMockCoinData(coinIds);
    }
  },

  /**
   * Get BTC market dominance for Fear & Greed calculation
   */
  async getBTCDominance(): Promise<number> {
    try {
      const response = await rateLimitedFetch(`${BASE_URL}/global`);
      
      if (!response.ok) {
        throw new Error(`CoinGecko global API error: ${response.status}`);
      }
      
      const data = await response.json();
      const dominance = data.data?.market_cap_percentage?.btc;
      
      if (typeof dominance === 'number') {
        console.log(`CoinGecko: BTC Dominance = ${dominance.toFixed(2)}%`);
        return dominance;
      }
      
      return 50; // Default fallback
    } catch (error) {
      console.error('CoinGecko global API error:', error);
      return 50; // Default value
    }
  },

  /**
   * Get detailed coin info (for future use)
   */
  async getCoinDetails(coinId: string): Promise<unknown> {
    try {
      const response = await rateLimitedFetch(
        `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko coin details error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('CoinGecko coin details error:', error);
      return null;
    }
  },

  /**
   * Get market chart data for a specific coin (OHLC or line)
   * Useful for more detailed charts
   */
  async getMarketChart(coinId: string, days: number = 7): Promise<{ prices: [number, number][] } | null> {
    try {
      const response = await rateLimitedFetch(
        `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`CoinGecko market chart error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('CoinGecko market chart error:', error);
      return null;
    }
  },

  /**
   * Get trending coins (top 7 trending)
   */
  async getTrending(): Promise<unknown[]> {
    try {
      const response = await rateLimitedFetch(`${BASE_URL}/search/trending`);
      
      if (!response.ok) {
        throw new Error(`CoinGecko trending error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.coins || [];
    } catch (error) {
      console.error('CoinGecko trending error:', error);
      return [];
    }
  },

  /**
   * Clear the in-memory cache (useful for force refresh)
   */
  clearCache() {
    coinCache = null;
    console.log('CoinGecko cache cleared');
  },
};

/**
 * Generate realistic mock data when API is unavailable
 * Uses actual recent price patterns
 */
function getMockCoinData(coinIds: string[]): CoinData[] {
  const mockData: Record<string, Partial<CoinData>> = {
    bitcoin: {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 97500,
      price_change_24h: 2150,
      price_change_percentage_24h: 2.25,
    },
    ethereum: {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 3450,
      price_change_24h: 85,
      price_change_percentage_24h: 2.52,
    },
    solana: {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      current_price: 195,
      price_change_24h: 12,
      price_change_percentage_24h: 6.55,
    },
    cardano: {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      current_price: 0.95,
      price_change_24h: 0.03,
      price_change_percentage_24h: 3.26,
    },
    polkadot: {
      id: 'polkadot',
      symbol: 'dot',
      name: 'Polkadot',
      current_price: 7.85,
      price_change_24h: -0.15,
      price_change_percentage_24h: -1.87,
    },
    ripple: {
      id: 'ripple',
      symbol: 'xrp',
      name: 'XRP',
      current_price: 2.45,
      price_change_24h: 0.08,
      price_change_percentage_24h: 3.38,
    },
    avalanche: {
      id: 'avalanche-2',
      symbol: 'avax',
      name: 'Avalanche',
      current_price: 38.50,
      price_change_24h: 1.20,
      price_change_percentage_24h: 3.22,
    },
    'matic-network': {
      id: 'matic-network',
      symbol: 'matic',
      name: 'Polygon',
      current_price: 0.52,
      price_change_24h: -0.01,
      price_change_percentage_24h: -1.89,
    },
    chainlink: {
      id: 'chainlink',
      symbol: 'link',
      name: 'Chainlink',
      current_price: 18.75,
      price_change_24h: 0.45,
      price_change_percentage_24h: 2.46,
    },
    uniswap: {
      id: 'uniswap',
      symbol: 'uni',
      name: 'Uniswap',
      current_price: 12.30,
      price_change_24h: 0.28,
      price_change_percentage_24h: 2.33,
    },
  };

  // Generate realistic sparkline with slight trend based on 24h change
  function generateSparkline(basePrice: number, changePercent: number): number[] {
    const points = 168; // 7 days * 24 hours
    const trend = changePercent / 100;
    const volatility = Math.abs(changePercent) / 100 + 0.02;
    
    const prices: number[] = [];
    let currentPrice = basePrice * (1 - trend * 0.5); // Start lower/higher based on trend
    
    for (let i = 0; i < points; i++) {
      // Add some realistic noise and trend
      const noise = (Math.random() - 0.5) * volatility * basePrice;
      const trendComponent = (trend * basePrice * i) / points;
      currentPrice = currentPrice + noise * 0.1 + trendComponent * 0.01;
      
      // Keep within reasonable bounds
      currentPrice = Math.max(currentPrice, basePrice * 0.85);
      currentPrice = Math.min(currentPrice, basePrice * 1.15);
      
      prices.push(currentPrice);
    }
    
    // Ensure the last point is close to current price
    prices[prices.length - 1] = basePrice;
    
    return prices;
  }

  return coinIds.map(id => {
    const mock = mockData[id];
    const price = mock?.current_price || 100;
    const change = mock?.price_change_percentage_24h || 0;
    
    return {
      id,
      symbol: mock?.symbol || id.substring(0, 3),
      name: mock?.name || id.charAt(0).toUpperCase() + id.slice(1),
      current_price: price,
      price_change_24h: mock?.price_change_24h || 0,
      price_change_percentage_24h: change,
      sparkline_in_7d: {
        price: generateSparkline(price, change),
      },
    } as CoinData;
  });
}
