import { NewsItem } from '../types';

export const firecrawl = {
  async getNews(): Promise<NewsItem[]> {
    const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY;
    
    if (!apiKey) {
      console.warn('Firecrawl API key not found, using mock data');
      return getMockNews();
    }

    try {
      // Note: Firecrawl API implementation would go here
      // For now, returning mock data as Firecrawl requires specific setup
      return getMockNews();
    } catch (error) {
      console.error('Firecrawl API error:', error);
      return getMockNews();
    }
  },
};

function getMockNews(): NewsItem[] {
  return [
    {
      title: 'Bitcoin Surges Past $43K as Institutional Interest Grows',
      source: 'CryptoNews',
      url: 'https://example.com/news1',
      sentiment: 'positive',
      scrapedAt: Date.now(),
    },
    {
      title: 'Ethereum ETF Approval Could Drive Next Rally',
      source: 'Bloomberg Crypto',
      url: 'https://example.com/news2',
      sentiment: 'positive',
      scrapedAt: Date.now(),
    },
    {
      title: 'Regulatory Concerns Weigh on Altcoin Market',
      source: 'CoinDesk',
      url: 'https://example.com/news3',
      sentiment: 'negative',
      scrapedAt: Date.now(),
    },
    {
      title: 'Solana Network Upgrades Show Promise for Scalability',
      source: 'The Block',
      url: 'https://example.com/news4',
      sentiment: 'positive',
      scrapedAt: Date.now(),
    },
    {
      title: 'Market Analysis: Consolidation Phase Expected',
      source: 'CryptoSlate',
      url: 'https://example.com/news5',
      sentiment: 'neutral',
      scrapedAt: Date.now(),
    },
  ];
}
