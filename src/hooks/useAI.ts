import { useState, useCallback } from 'react';
import { AIAnalysis, CoinData, YieldPool, FearGreedData } from '../types';
import { gemini } from '../services/gemini';
import { storage } from '../services/storage';

export function useAI() {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = useCallback(async (
    coins: CoinData[], 
    mode: 'professional' | 'degen' = 'professional', 
    yields: YieldPool[] = [],
    fearGreed?: FearGreedData
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await gemini.generateAnalysis(coins, mode, yields, fearGreed);
      setAnalysis(result);
      
      await storage.setAICache(result);
    } catch (err) {
      setError('Failed to generate AI analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCachedAnalysis = useCallback(async () => {
    const cached = await storage.getAICache();
    if (cached) {
      setAnalysis(cached);
    }
  }, []);

  return {
    analysis,
    loading,
    error,
    generateAnalysis,
    loadCachedAnalysis,
  };
}
