import { useState, useEffect, useCallback } from 'react';
import { YieldPool } from '../types';
import { defillama } from '../services/defillama';
import { storage } from '../services/storage';

export function useYields() {
  const [yields, setYields] = useState<YieldPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchYields = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const yieldData = await defillama.getTopYields(5);
      setYields(yieldData);
      
      await storage.setYieldsCache(yieldData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to fetch yields data: ${errorMessage}`);
      console.error('Yields fetch error:', err);
      
      // Try to load from cache
      const cached = await storage.getYieldsCache();
      if (cached) {
        setYields(cached);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchYields();
    
    // Auto-refresh every 5 minutes (yields change slower than prices)
    const interval = setInterval(fetchYields, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchYields]);

  return {
    yields,
    loading,
    error,
    refetch: fetchYields,
  };
}
