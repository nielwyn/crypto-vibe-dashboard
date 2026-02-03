import { NewsItem } from '../types';

// Firecrawl API base URL for REST calls (browser-compatible)
const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1';

// Crypto news sites to scrape (in order of preference)
const NEWS_SOURCES = [
  {
    url: 'https://www.coindesk.com/markets/',
    name: 'CoinDesk',
  },
  {
    url: 'https://decrypt.co/news',
    name: 'Decrypt',
  },
  {
    url: 'https://cointelegraph.com/tags/bitcoin',
    name: 'CoinTelegraph',
  },
];

// Keywords for sentiment analysis
const POSITIVE_KEYWORDS = [
  'surge', 'soar', 'rally', 'gain', 'rise', 'bullish', 'high', 'record',
  'growth', 'pump', 'moon', 'breakout', 'approval', 'adoption', 'partnership',
  'launch', 'upgrade', 'success', 'milestone', 'etf approved', 'ath', 'profit',
  'accumulation', 'institutional', 'whale', 'buy', 'uptrend', 'recover'
];

const NEGATIVE_KEYWORDS = [
  'crash', 'drop', 'fall', 'plunge', 'dump', 'bearish', 'low', 'decline',
  'loss', 'fear', 'sell', 'selloff', 'hack', 'scam', 'fraud', 'lawsuit',
  'sec', 'regulation', 'ban', 'warning', 'risk', 'down', 'slump', 'correction',
  'liquidation', 'bankruptcy', 'collapse', 'investigation', 'fine', 'penalty'
];

function analyzeSentiment(title: string): 'positive' | 'negative' | 'neutral' {
  const lowerTitle = title.toLowerCase();
  
  const positiveScore = POSITIVE_KEYWORDS.filter(kw => lowerTitle.includes(kw)).length;
  const negativeScore = NEGATIVE_KEYWORDS.filter(kw => lowerTitle.includes(kw)).length;
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}

interface FirecrawlResponse {
  success: boolean;
  data?: {
    markdown?: string;
    links?: string[]; // Firecrawl returns links as string array, not objects
    metadata?: {
      title?: string;
      description?: string;
    };
  };
  error?: string;
}

// Helper to check if URL is a valid article URL (not media file)
function isValidArticleUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  
  // Reject media/asset URLs
  const mediaExtensions = ['.avif', '.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.mp4', '.mp3', '.pdf', '.ico', '.woff', '.woff2', '.ttf', '.css', '.js'];
  if (mediaExtensions.some(ext => lowerUrl.endsWith(ext))) {
    return false;
  }
  
  // Reject asset paths
  const assetPaths = ['/images/', '/img/', '/media/', '/cdn-cgi/', '/assets/', '/static/', '/_next/image', '/wp-content/uploads/'];
  if (assetPaths.some(path => lowerUrl.includes(path))) {
    return false;
  }
  
  // Must be HTTP(S)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }
  
  // Should look like an article URL (contains year or article path)
  const articleIndicators = ['/news/', '/markets/', '/article/', '/post/', '/202', '/blog/', '/learn/'];
  return articleIndicators.some(indicator => lowerUrl.includes(indicator));
}

export const firecrawl = {
  async getNews(): Promise<NewsItem[]> {
    const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY;

    if (!apiKey) {
      console.warn('Firecrawl API key not found, using mock data');
      return getMockNews();
    }

    try {
      // Try to scrape from the first available source
      for (const source of NEWS_SOURCES) {
        try {
          const news = await scrapeNewsFromSource(apiKey, source.url, source.name);
          console.log('news from', source.name, news);
          if (news.length > 0) {
            console.log(`Successfully scraped ${news.length} articles from ${source.name}`);
            return news;
          }
        } catch (err) {
          console.warn(`Failed to scrape ${source.name}, trying next source...`, err);
        }
      }
      
      // If all sources fail, return mock data
      console.warn('All news sources failed, using mock data');
      return getMockNews();
    } catch (error) {
      console.error('Firecrawl API error:', error);
      return getMockNews();
    }
  },
};

async function scrapeNewsFromSource(
  apiKey: string,
  url: string,
  sourceName: string
): Promise<NewsItem[]> {
  const response = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url: url,
      formats: ['markdown'], // Only use markdown - links format returns strings without titles
      onlyMainContent: true,
      timeout: 30000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firecrawl API error: ${response.status} - ${errorText}`);
  }

  const result: FirecrawlResponse = await response.json();
  
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to scrape content');
  }

  // Extract news from markdown (the primary and reliable method)
  const newsItems: NewsItem[] = [];
  
  if (result.data.markdown) {
    const headlines = extractHeadlinesFromMarkdown(result.data.markdown, sourceName, url);
    newsItems.push(...headlines);
  }

  // Remove duplicates and limit to 5
  const uniqueNews = removeDuplicates(newsItems).slice(0, 5);
  
  return uniqueNews;
}

function extractHeadlinesFromMarkdown(
  markdown: string,
  sourceName: string,
  _baseUrl: string
): NewsItem[] {
  const newsItems: NewsItem[] = [];
  
  // Pattern to match markdown links: [Title](URL)
  const linkPattern = /\[([^\]]{20,150})\]\((https?:\/\/[^\)\s]+)\)/g;
  let match;

  while ((match = linkPattern.exec(markdown)) !== null) {
    const title = match[1].trim();
    const url = match[2].trim();
    
    // Skip non-article URLs (images, assets, etc.)
    if (!isValidArticleUrl(url)) {
      continue;
    }
    
    // Skip non-article titles
    const lowerTitle = title.toLowerCase();
    if (
      lowerTitle.includes('subscribe') ||
      lowerTitle.includes('sign up') ||
      lowerTitle.includes('read more') ||
      lowerTitle.includes('view all') ||
      lowerTitle.includes('newsletter') ||
      lowerTitle.includes('cookie') ||
      lowerTitle.includes('privacy policy') ||
      lowerTitle.includes('terms of') ||
      lowerTitle.includes('contact us') ||
      lowerTitle.includes('about us') ||
      lowerTitle.startsWith('http') || // URL as title
      title.length < 20
    ) {
      continue;
    }

    newsItems.push({
      title,
      source: sourceName,
      url,
      sentiment: analyzeSentiment(title),
      scrapedAt: Date.now(),
    });
  }

  return newsItems;
}

function removeDuplicates(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getMockNews(): NewsItem[] {
  return [
    {
      title: 'Bitcoin Surges Past $100K as Institutional Interest Grows',
      source: 'CryptoNews',
      url: 'https://example.com/news1',
      sentiment: 'positive',
      scrapedAt: Date.now(),
    },
    {
      title: 'Ethereum ETF Sees Record Inflows This Week',
      source: 'Bloomberg Crypto',
      url: 'https://example.com/news2',
      sentiment: 'positive',
      scrapedAt: Date.now(),
    },
    {
      title: 'Regulatory Clarity Brings New Wave of Crypto Adoption',
      source: 'CoinDesk',
      url: 'https://example.com/news3',
      sentiment: 'positive',
      scrapedAt: Date.now(),
    },
    {
      title: 'Solana DeFi TVL Reaches All-Time High',
      source: 'The Block',
      url: 'https://example.com/news4',
      sentiment: 'positive',
      scrapedAt: Date.now(),
    },
    {
      title: 'Market Analysis: Consolidation Phase Expected Before Next Move',
      source: 'CryptoSlate',
      url: 'https://example.com/news5',
      sentiment: 'neutral',
      scrapedAt: Date.now(),
    },
  ];
}
