import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { YieldPool } from '../types';
import { defillama } from '../services/defillama';
import { storage } from '../services/storage';

// Cache TTL: 5 minutes for yields data
const YIELDS_CACHE_TTL = 5 * 60 * 1000;

export function useYields(symbols?: string[]) {
  const [yields, setYields] = useState<YieldPool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const hasLoadedOnce = useRef(false);

  const normalizedSymbols = useMemo(() => {
    return (symbols || []).map(s => s.toLowerCase()).filter(Boolean).sort();
  }, [symbols]);

  const symbolKey = normalizedSymbols.join(',');

  // Load cached data first, then fetch fresh if needed
  const loadYields = useCallback(async (forceRefresh = false, _isSymbolChange = false) => {
    try {
      setError(null);

      if (symbolKey) {
        // Only show loading on first load, not on symbol changes (to prevent flicker)
        if (!hasLoadedOnce.current) {
          setLoading(true);
        }

        const yieldData = await defillama.getYieldsForTokens(normalizedSymbols, 5);
        setYields(yieldData);
        setLastFetched(Date.now());
        setLoading(false);
        hasLoadedOnce.current = true;
        return;
      }
      
      // Try to load from cache first
      const cached = await storage.getYieldsCache();
      const cacheTimestamp = await storage.getYieldsCacheTimestamp?.() || 0;
      const cacheAge = Date.now() - cacheTimestamp;
      
      if (cached && cached.length > 0 && !forceRefresh) {
        // Show cached data immediately
        setYields(cached);
        setLoading(false);
        setLastFetched(cacheTimestamp);
        
        // If cache is still fresh, don't fetch new data
        if (cacheAge < YIELDS_CACHE_TTL) {
          console.log('Using cached yields data (still fresh)');
          return;
        }
        console.log('Cache expired, fetching fresh yields data in background');
      } else {
        setLoading(true);
      }
      
      // Fetch fresh data
      const yieldData = await defillama.getTopYields(5);
      
      if (yieldData.length > 0) {
        setYields(yieldData);
        setLastFetched(Date.now());
        await storage.setYieldsCache(yieldData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to fetch yields: ${errorMessage}`);
      console.error('Yields fetch error:', err);
      
      // Keep showing cached data on error
      if (!symbolKey) {
        const cached = await storage.getYieldsCache();
        if (cached && cached.length > 0) {
          setYields(cached);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [normalizedSymbols]);

  // Track previous symbol key to detect changes and trigger refetch
  const prevSymbolKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Always fetch when symbol changes (including first load)
    if (prevSymbolKeyRef.current !== symbolKey) {
      prevSymbolKeyRef.current = symbolKey;
      loadYields(false, true);
    }

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => loadYields(true, false), YIELDS_CACHE_TTL);

    return () => clearInterval(interval);
  }, [symbolKey, loadYields]);

  return {
    yields,
    loading,
    error,
    lastFetched,
    refetch: () => loadYields(true),
  };
}
