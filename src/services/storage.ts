import { UserPreferences, CoinData, AIAnalysis, NewsItem } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: 'userPreferences',
  COIN_CACHE: 'coinCache',
  AI_CACHE: 'aiCache',
  NEWS_CACHE: 'newsCache',
};

export const storage = {
  async getPreferences(): Promise<UserPreferences> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.PREFERENCES);
    const prefs = result[STORAGE_KEYS.PREFERENCES];
    if (prefs && typeof prefs === 'object' && 'selectedCoins' in prefs) {
      return prefs as UserPreferences;
    }
    return {
      selectedCoins: ['bitcoin', 'ethereum', 'solana'],
      refreshInterval: 30,
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
    await chrome.storage.local.set({ [STORAGE_KEYS.COIN_CACHE]: coins });
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
};
