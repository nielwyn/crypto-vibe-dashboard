import React from 'react';
import { NewsItem } from '../../types';

interface NewsTickerProps {
  news: NewsItem[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ news }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-crypto-accent-green';
      case 'negative':
        return 'text-crypto-accent-red';
      default:
        return 'text-gray-400';
    }
  };

  if (news.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-3 overflow-hidden mb-3">
      <div className="flex items-center gap-2">
        <span className="text-sm flex-shrink-0">📰</span>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {news.map((item, i) => (
              <span key={i} className="inline-block mr-8 text-sm text-gray-300">
                <span className={getSentimentColor(item.sentiment)}>●</span>
                {' '}{item.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
