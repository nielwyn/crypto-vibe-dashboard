import { CoinData } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const coingecko = {
  async getCoins(coinIds: string[]): Promise<CoinData[]> {
    try {
      const ids = coinIds.join(',');
      const response = await fetch(
        `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch coin data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('CoinGecko API error:', error);
      // Return mock data as fallback
      return getMockCoinData(coinIds);
    }
  },

  async getBTCDominance(): Promise<number> {
    try {
      const response = await fetch(`${BASE_URL}/global`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch global data');
      }
      
      const data = await response.json();
      return data.data?.market_cap_percentage?.btc || 50;
    } catch (error) {
      console.error('CoinGecko global API error:', error);
      // Return default value
      return 50;
    }
  },
};

function getMockCoinData(coinIds: string[]): CoinData[] {
  const mockData: Record<string, Partial<CoinData>> = {
    bitcoin: {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      current_price: 43250.5,
      price_change_24h: 1250.3,
      price_change_percentage_24h: 2.98,
    },
    ethereum: {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      current_price: 2345.67,
      price_change_24h: -45.23,
      price_change_percentage_24h: -1.89,
    },
    solana: {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      current_price: 98.45,
      price_change_24h: 5.67,
      price_change_percentage_24h: 6.11,
    },
  };

  return coinIds.map(id => ({
    ...(mockData[id] || {}),
    id,
    symbol: mockData[id]?.symbol || id.substring(0, 3),
    name: mockData[id]?.name || id,
    current_price: mockData[id]?.current_price || 100,
    price_change_24h: mockData[id]?.price_change_24h || 0,
    price_change_percentage_24h: mockData[id]?.price_change_percentage_24h || 0,
    sparkline_in_7d: {
      price: Array.from({ length: 168 }, (_, i) => 
        (mockData[id]?.current_price || 100) * (1 + Math.sin(i / 10) * 0.1)
      ),
    },
  } as CoinData));
}
