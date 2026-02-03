import { YieldPool } from '../types';

// DefiLlama Yields API - FREE, no API key required!
// Docs: https://api-docs.defillama.com/ (see "yields" section)
const YIELDS_API = 'https://yields.llama.fi/pools';

// Popular chains to prioritize
const POPULAR_CHAINS = ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon', 'BSC', 'Avalanche', 'Base', 'Solana'];

export const defillama = {
  /**
   * Get top yield opportunities across all DeFi protocols
   * Filters: TVL > $1M, APY between 0-100% (removes suspicious yields)
   * Sorted by APY descending
   */
  async getTopYields(limit: number = 5): Promise<YieldPool[]> {
    try {
      const response = await fetch(YIELDS_API);
      
      if (!response.ok) {
        throw new Error(`DefiLlama API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || !Array.isArray(data.data)) {
        console.error('DefiLlama API returned unexpected format');
        return [];
      }
      
      // Filter and sort for best yields
      return data.data
        .filter((pool: YieldPool) => 
          pool.tvlUsd > 1000000 && // Min $1M TVL for safety
          pool.apy > 0 &&
          pool.apy < 100 && // Filter out suspicious high APYs
          POPULAR_CHAINS.includes(pool.chain) // Focus on major chains
        )
        .sort((a: YieldPool, b: YieldPool) => b.apy - a.apy)
        .slice(0, limit);
    } catch (error) {
      console.error('DefiLlama API error:', error);
      return [];
    }
  },

  /**
   * Get top stablecoin yield opportunities (USDT, USDC, DAI, etc.)
   * Great for lower-risk yield farming
   */
  async getStablecoinYields(limit: number = 5): Promise<YieldPool[]> {
    try {
      const response = await fetch(YIELDS_API);
      
      if (!response.ok) {
        throw new Error(`DefiLlama API error: ${response.status}`);
      }
      
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
          pool.apy > 0 &&
          pool.apy < 50 && // Stablecoins shouldn't have crazy APYs
          POPULAR_CHAINS.includes(pool.chain)
        )
        .sort((a: YieldPool, b: YieldPool) => b.apy - a.apy)
        .slice(0, limit);
    } catch (error) {
      console.error('DefiLlama API error:', error);
      return [];
    }
  },

  /**
   * Get yields for a specific chain
   */
  async getYieldsByChain(chain: string, limit: number = 5): Promise<YieldPool[]> {
    try {
      const response = await fetch(YIELDS_API);
      
      if (!response.ok) {
        throw new Error(`DefiLlama API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !Array.isArray(data.data)) {
        return [];
      }
      
      return data.data
        .filter((pool: YieldPool) => 
          pool.chain.toLowerCase() === chain.toLowerCase() &&
          pool.tvlUsd > 500000 &&
          pool.apy > 0 &&
          pool.apy < 100
        )
        .sort((a: YieldPool, b: YieldPool) => b.apy - a.apy)
        .slice(0, limit);
    } catch (error) {
      console.error('DefiLlama API error:', error);
      return [];
    }
  },

  /**
   * Get the best yield opportunity for AI recommendation
   */
  async getBestYield(): Promise<YieldPool | null> {
    const yields = await this.getTopYields(1);
    return yields[0] || null;
  },
};
