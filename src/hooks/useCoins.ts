import { useState, useEffect, useCallback } from 'react';
import { CoinData } from '../types';
import { coingecko } from '../services/coingecko';
import { storage } from '../services/storage';

// Cache TTL: 30 seconds for coin data (prices change frequently)
const COIN_CACHE_TTL = 30 * 1000;

export function useCoins() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  // Load coins with cache-first strategy
  const fetchCoins = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      
      const prefs = await storage.getPreferences();
      setSelectedCoins(prefs.selectedCoins);
      
      // Try to load from cache first for instant display
      if (!forceRefresh) {
        const cached = await storage.getCoinCache();
        const cacheTimestamp = await storage.getCoinCacheTimestamp?.() || 0;
        const cacheAge = Date.now() - cacheTimestamp;
        
        if (cached && cached.length > 0) {
          // Show cached data immediately
          setCoins(cached);
          setLoading(false);
          setIsFromCache(true);
          setLastUpdated(new Date(cacheTimestamp));
          
          // If cache is fresh, don't fetch new data yet
          if (cacheAge < COIN_CACHE_TTL) {
            console.log('Using fresh coin cache');
            return;
          }
          console.log('Cache stale, fetching fresh data in background');
        } else {
          setLoading(true);
        }
      } else {
        setLoading(true);
      }
      
      // Fetch fresh data from CoinGecko
      const coinData = await coingecko.getCoins(prefs.selectedCoins);
      
      if (coinData && coinData.length > 0) {
        setCoins(coinData);
        setLastUpdated(new Date());
        setIsFromCache(false);
        
        // Save to cache with timestamp
        await storage.setCoinCache(coinData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to fetch coins: ${errorMessage}`);
      console.error('Coins fetch error:', err);
      
      // Keep showing cached data on error
      const cached = await storage.getCoinCache();
      if (cached && cached.length > 0 && coins.length === 0) {
        setCoins(cached);
        setIsFromCache(true);
      }
    } finally {
      setLoading(false);
    }
  }, [coins.length]);

  const updateSelectedCoins = useCallback(async (newCoins: string[]) => {
    const prefs = await storage.getPreferences();
    await storage.setPreferences({ ...prefs, selectedCoins: newCoins });
    setSelectedCoins(newCoins);
    // Clear cache when coins change
    coingecko.clearCache();
    await fetchCoins(true);
  }, [fetchCoins]);

  useEffect(() => {
    fetchCoins();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchCoins(true), 30000);
    
    return () => clearInterval(interval);
  }, [fetchCoins]);

  return {
    coins,
    loading,
    error,
    selectedCoins,
    lastUpdated,
    isFromCache,
    refetch: () => fetchCoins(true),
    updateSelectedCoins,
  };
}
