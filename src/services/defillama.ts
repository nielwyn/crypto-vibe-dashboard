import { YieldPool } from '../types';

const YIELDS_API = 'https://yields.llama.fi/pools';

export const defillama = {
  async getTopYields(limit: number = 5): Promise<YieldPool[]> {
    try {
      const response = await fetch(YIELDS_API);
      const data = await response.json();
      
      // Validate response structure
      if (!data || !Array.isArray(data.data)) {
        console.error('DefiLlama API returned unexpected format');
        return [];
      }
      
      // Filter and sort for best yields
      return data.data
        .filter((pool: YieldPool) => 
          pool.tvlUsd > 1000000 && // Min $1M TVL
          pool.apy > 0 &&
          pool.apy < 100 // Filter out suspicious high APYs
        )
        .sort((a: YieldPool, b: YieldPool) => b.apy - a.apy)
        .slice(0, limit);
    } catch (error) {
      console.error('DefiLlama API error:', error);
      return [];
    }
  },

  async getStablecoinYields(limit: number = 5): Promise<YieldPool[]> {
    try {
      const response = await fetch(YIELDS_API);
      const data = await response.json();
      
      // Validate response structure
      if (!data || !Array.isArray(data.data)) {
        console.error('DefiLlama API returned unexpected format');
        return [];
      }
      
      return data.data
        .filter((pool: YieldPool) => 
          pool.stablecoin === true &&
          pool.tvlUsd > 1000000 &&
          pool.apy > 0
        )
        .sort((a: YieldPool, b: YieldPool) => b.apy - a.apy)
        .slice(0, limit);
    } catch (error) {
      console.error('DefiLlama API error:', error);
      return [];
    }
  },
};
