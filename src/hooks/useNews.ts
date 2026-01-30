import { useState, useEffect, useCallback } from 'react';
import { NewsItem } from '../types';
import { firecrawl } from '../services/firecrawl';
import { storage } from '../services/storage';

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newsData = await firecrawl.getNews();
      setNews(newsData);
      
      await storage.setNewsCache(newsData);
    } catch (err) {
      setError('Failed to fetch news');
      console.error(err);
      
      // Try to load from cache
      const cached = await storage.getNewsCache();
      if (cached) {
        setNews(cached);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchNews]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews,
  };
}
