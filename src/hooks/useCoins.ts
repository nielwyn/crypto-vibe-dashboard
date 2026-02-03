import { useState, useEffect, useCallback, useRef } from 'react';
import { CoinData } from '../types';
import { coingecko } from '../services/coingecko';
import { storage } from '../services/storage';

// Cache TTL: 30 seconds for coin data (prices change frequently)
const COIN_CACHE_TTL = 30 * 1000;

export type ChartTimeframe = '24h' | '7d';

export function useCoins() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // For background updates
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('7d');
  
  // Track if this is the initial load
  const isInitialLoad = useRef(true);

  // Load coins with cache-first strategy
  const fetchCoins = useCallback(async (forceRefresh = false, silent = false) => {
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
          isInitialLoad.current = false;
          
          // If cache is fresh, don't fetch new data yet
          if (cacheAge < COIN_CACHE_TTL) {
            console.log('Using fresh coin cache');
            return;
          }
          console.log('Cache stale, fetching fresh data in background');
        } else if (isInitialLoad.current) {
          setLoading(true);
        }
      } else if (!silent) {
        // Only show loading on initial load, not on updates
        if (isInitialLoad.current) {
          setLoading(true);
        } else {
          setIsUpdating(true);
        }
      } else {
        setIsUpdating(true);
      }
      
      // Fetch fresh data from CoinGecko
      const coinData = await coingecko.getCoins(prefs.selectedCoins);
      
      if (coinData && coinData.length > 0) {
        setCoins(coinData);
        setLastUpdated(new Date());
        setIsFromCache(false);
        isInitialLoad.current = false;
        
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
      setIsUpdating(false);
    }
  }, [coins.length]);

  // Optimized update that doesn't cause flickering
  const updateSelectedCoins = useCallback(async (newCoins: string[]) => {
    // Optimistically update selected coins immediately
    setSelectedCoins(newCoins);
    
    // Save preferences
    const prefs = await storage.getPreferences();
    await storage.setPreferences({ ...prefs, selectedCoins: newCoins });
    
    // Filter current coins to only show selected ones (instant UI update)
    setCoins(prevCoins => {
      const filtered = prevCoins.filter(c => newCoins.includes(c.id));
      // Keep existing coins that are still selected
      return filtered;
    });
    
    // Fetch new data silently in background
    coingecko.clearCache();
    await fetchCoins(true, true);
  }, [fetchCoins]);

  // Change chart timeframe
  const updateTimeframe = useCallback((newTimeframe: ChartTimeframe) => {
    setTimeframe(newTimeframe);
    // Could fetch different sparkline data based on timeframe if API supports it
  }, []);

  useEffect(() => {
    fetchCoins();
    
    // Auto-refresh every 30 seconds (silent refresh)
    const interval = setInterval(() => fetchCoins(true, true), 30000);
    
    return () => clearInterval(interval);
  }, [fetchCoins]);

  return {
    coins,
    loading,
    error,
    selectedCoins,
    lastUpdated,
    isFromCache,
    isUpdating,
    timeframe,
    refetch: () => fetchCoins(true),
    updateSelectedCoins,
    updateTimeframe,
  };
}
