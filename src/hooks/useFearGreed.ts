import { useState, useEffect, useCallback } from 'react';
import { CoinData, FearGreedData } from '../types';
import { alternativeme } from '../services/alternativeme';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useFearGreed(_coins: CoinData[]) {
  const [fearGreed, setFearGreed] = useState<FearGreedData>({
    score: 50,
    state: 'fear',
    components: {
      volatility: 50,
      momentum: 50,
      btcDominance: 50,
    },
    lastUpdated: Date.now(),
  });
  const [btcDominance] = useState<number>(50);

  // Convert Alternative.me classification to our state type
  const classificationToState = (classification: string): 'extreme-fear' | 'fear' | 'greed' | 'extreme-greed' => {
    const lower = classification.toLowerCase();
    if (lower.includes('extreme') && lower.includes('fear')) return 'extreme-fear';
    if (lower.includes('extreme') && lower.includes('greed')) return 'extreme-greed';
    if (lower.includes('fear')) return 'fear';
    if (lower.includes('greed')) return 'greed';
    // Neutral maps to fear (score around 50)
    return 'fear';
  };

  // Fetch Fear & Greed from Alternative.me API
  const fetchFearGreed = useCallback(async () => {
    try {
      const data = await alternativeme.getFearGreedIndex();
      
      setFearGreed({
        score: data.score,
        state: classificationToState(data.classification),
        components: {
          volatility: 50,
          momentum: 50,
          btcDominance: 50,
        },
        lastUpdated: data.timestamp,
      });
    } catch (error) {
      console.error('Failed to fetch Fear & Greed:', error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchFearGreed();
  }, [fetchFearGreed]);

  // Auto-refresh every 5 minutes (API updates once per day, but we check periodically)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFearGreed();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchFearGreed]);

  return { fearGreed, btcDominance };
}
