/**
 * Alternative.me Fear & Greed Index API
 * https://alternative.me/crypto/fear-and-greed-index/
 */

interface AlternativeMeResponse {
  name: string;
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update: string;
  }>;
}

export interface FearGreedAPIData {
  score: number;
  classification: string;
  timestamp: number;
  timeUntilUpdate: number;
}

class AlternativeMeAPI {
  private baseUrl = 'https://api.alternative.me/fng/';
  private cache: FearGreedAPIData | null = null;
  private cacheTime = 0;
  private cacheDuration = 5 * 60 * 1000; // 5 minutes cache

  async getFearGreedIndex(): Promise<FearGreedAPIData> {
    // Return cached data if fresh
    if (this.cache && Date.now() - this.cacheTime < this.cacheDuration) {
      return this.cache;
    }

    try {
      const response = await fetch(this.baseUrl);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: AlternativeMeResponse = await response.json();
      
      if (!data.data || data.data.length === 0) {
        throw new Error('No data returned from API');
      }

      const latest = data.data[0];
      
      this.cache = {
        score: parseInt(latest.value, 10),
        classification: latest.value_classification,
        timestamp: parseInt(latest.timestamp, 10) * 1000,
        timeUntilUpdate: parseInt(latest.time_until_update, 10) * 1000,
      };
      this.cacheTime = Date.now();

      return this.cache;
    } catch (error) {
      console.error('Failed to fetch Fear & Greed Index:', error);
      
      // Return cached data if available, otherwise default
      if (this.cache) {
        return this.cache;
      }
      
      return {
        score: 50,
        classification: 'Neutral',
        timestamp: Date.now(),
        timeUntilUpdate: 0,
      };
    }
  }
}

export const alternativeme = new AlternativeMeAPI();
