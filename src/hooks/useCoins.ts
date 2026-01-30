import { useState, useEffect, useCallback } from 'react';
import { CoinData } from '../types';
import { coingecko } from '../services/coingecko';
import { storage } from '../services/storage';

export function useCoins() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCoins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const prefs = await storage.getPreferences();
      setSelectedCoins(prefs.selectedCoins);
      
      const coinData = await coingecko.getCoins(prefs.selectedCoins);
      setCoins(coinData);
      setLastUpdated(new Date());
      
      await storage.setCoinCache(coinData);
    } catch (err) {
      setError('Failed to fetch coin data');
      console.error(err);
      
      // Try to load from cache
      const cached = await storage.getCoinCache();
      if (cached) {
        setCoins(cached);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSelectedCoins = useCallback(async (newCoins: string[]) => {
    const prefs = await storage.getPreferences();
    await storage.setPreferences({ ...prefs, selectedCoins: newCoins });
    setSelectedCoins(newCoins);
    await fetchCoins();
  }, [fetchCoins]);

  useEffect(() => {
    fetchCoins();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCoins, 30000);
    
    return () => clearInterval(interval);
  }, [fetchCoins]);

  return {
    coins,
    loading,
    error,
    selectedCoins,
    lastUpdated,
    refetch: fetchCoins,
    updateSelectedCoins,
  };
}
