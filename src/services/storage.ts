import { UserPreferences, CoinData, AIAnalysis, NewsItem, UserStats, YieldPool } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: 'userPreferences',
  COIN_CACHE: 'coinCache',
  COIN_CACHE_TIMESTAMP: 'coinCacheTimestamp',
  AI_CACHE: 'aiCache',
  NEWS_CACHE: 'newsCache',
  USER_STATS: 'userStats',
  CONFETTI_TRIGGERED: 'confettiTriggered',
  YIELDS_CACHE: 'yieldsCache',
  YIELDS_CACHE_TIMESTAMP: 'yieldsCacheTimestamp',
};

export const storage = {
  async getPreferences(): Promise<UserPreferences> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.PREFERENCES);
    const prefs = result[STORAGE_KEYS.PREFERENCES] as any;
    if (prefs && typeof prefs === 'object' && 'selectedCoins' in prefs) {
      return {
        selectedCoins: Array.isArray(prefs.selectedCoins) ? prefs.selectedCoins : ['bitcoin', 'ethereum', 'solana'],
        refreshInterval: prefs.refreshInterval || 30,
        aiMode: prefs.aiMode || 'professional',
        soundEnabled: prefs.soundEnabled !== undefined ? prefs.soundEnabled : true,
      };
    }
    return {
      selectedCoins: ['bitcoin', 'ethereum', 'solana'],
      refreshInterval: 30,
      aiMode: 'professional',
      soundEnabled: true,
    };
  },

  async setPreferences(prefs: UserPreferences): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.PREFERENCES]: prefs });
  },

  async getCoinCache(): Promise<CoinData[] | null> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.COIN_CACHE);
    const cache = result[STORAGE_KEYS.COIN_CACHE];
    return Array.isArray(cache) ? cache : null;
  },

  async setCoinCache(coins: CoinData[]): Promise<void> {
    await chrome.storage.local.set({ 
      [STORAGE_KEYS.COIN_CACHE]: coins,
      [STORAGE_KEYS.COIN_CACHE_TIMESTAMP]: Date.now(),
    });
  },

  async getCoinCacheTimestamp(): Promise<number> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.COIN_CACHE_TIMESTAMP);
    const timestamp = result[STORAGE_KEYS.COIN_CACHE_TIMESTAMP];
    return typeof timestamp === 'number' ? timestamp : 0;
  },

  async getAICache(): Promise<AIAnalysis | null> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.AI_CACHE);
    const cache = result[STORAGE_KEYS.AI_CACHE];
    if (cache && typeof cache === 'object' && 'summary' in cache) {
      return cache as AIAnalysis;
    }
    return null;
  },

  async setAICache(analysis: AIAnalysis): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.AI_CACHE]: analysis });
  },

  async getNewsCache(): Promise<NewsItem[] | null> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.NEWS_CACHE);
    const cache = result[STORAGE_KEYS.NEWS_CACHE];
    return Array.isArray(cache) ? cache : null;
  },

  async setNewsCache(news: NewsItem[]): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.NEWS_CACHE]: news });
  },

  async getUserStats(): Promise<UserStats> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.USER_STATS);
    const stats = result[STORAGE_KEYS.USER_STATS];
    if (stats && typeof stats === 'object') {
      return stats as UserStats;
    }
    return {
      streak: 0,
      lastVisit: 0,
      totalChecks: 0,
      predictions: [],
      badges: [],
    };
  },

  async setUserStats(stats: UserStats): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEYS.USER_STATS]: stats });
  },

  async updateStreak(): Promise<UserStats> {
    const stats = await this.getUserStats();
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (stats.lastVisit === 0) {
      // First visit
      stats.streak = 1;
    } else {
      const timeSinceLastVisit = now - stats.lastVisit;
      if (timeSinceLastVisit < oneDayMs) {
        // Same day, don't increment
      } else if (timeSinceLastVisit < 2 * oneDayMs) {
        // Next day, increment streak
        stats.streak += 1;
      } else {
        // Missed a day, reset streak
        stats.streak = 1;
      }
    }
    
    stats.lastVisit = now;
    stats.totalChecks += 1;
    await this.setUserStats(stats);
    return stats;
  },

  async getConfettiTriggered(): Promise<boolean> {
    const result = await chrome.storage.session.get(STORAGE_KEYS.CONFETTI_TRIGGERED);
    return !!result[STORAGE_KEYS.CONFETTI_TRIGGERED];
  },

  async setConfettiTriggered(triggered: boolean): Promise<void> {
    await chrome.storage.session.set({ [STORAGE_KEYS.CONFETTI_TRIGGERED]: triggered });
  },

  async getYieldsCache(): Promise<YieldPool[] | null> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.YIELDS_CACHE);
    const cache = result[STORAGE_KEYS.YIELDS_CACHE];
    return Array.isArray(cache) ? cache : null;
  },

  async setYieldsCache(yields: YieldPool[]): Promise<void> {
    await chrome.storage.local.set({ 
      [STORAGE_KEYS.YIELDS_CACHE]: yields,
      [STORAGE_KEYS.YIELDS_CACHE_TIMESTAMP]: Date.now(),
    });
  },

  async getYieldsCacheTimestamp(): Promise<number> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.YIELDS_CACHE_TIMESTAMP);
    const timestamp = result[STORAGE_KEYS.YIELDS_CACHE_TIMESTAMP];
    return typeof timestamp === 'number' ? timestamp : 0;
  },
};
