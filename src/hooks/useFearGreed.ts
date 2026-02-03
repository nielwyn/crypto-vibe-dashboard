import { useState, useEffect, useCallback } from 'react';
import { CoinData, FearGreedData } from '../types';
import { calculateFearGreedIndex, calculateMarketData } from '../utils/fearGreedCalculator';
import { coingecko } from '../services/coingecko';

export function useFearGreed(coins: CoinData[]) {
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
  const [btcDominance, setBtcDominance] = useState<number>(50);

  // Fetch BTC dominance
  const fetchBTCDominance = useCallback(async () => {
    const dominance = await coingecko.getBTCDominance();
    setBtcDominance(dominance);
  }, []);

  // Calculate Fear & Greed Index
  const calculateFearGreed = useCallback(() => {
    if (coins.length === 0) return;
    
    const marketData = calculateMarketData(coins, btcDominance);
    const fearGreedData = calculateFearGreedIndex(marketData);
    setFearGreed(fearGreedData);
  }, [coins, btcDominance]);

  // Initial fetch
  useEffect(() => {
    fetchBTCDominance();
  }, [fetchBTCDominance]);

  // Recalculate when coins or BTC dominance changes
  useEffect(() => {
    calculateFearGreed();
  }, [calculateFearGreed]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBTCDominance();
      calculateFearGreed();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchBTCDominance, calculateFearGreed]);

  return { fearGreed, btcDominance };
}
