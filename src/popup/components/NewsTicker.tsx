import React, { useEffect, useState } from 'react';
import { NewsItem } from '../../types';

interface NewsTickerProps {
  news: NewsItem[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ news }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

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

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '🟢';
      case 'negative':
        return '🔴';
      default:
        return '⚪';
    }
  };

  if (news.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          📰 Latest News
        </h3>
        <div className="text-sm text-gray-500 italic">No news available</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          📰 Latest News
        </h3>
        <div className="text-xs text-gray-500">
          {currentIndex + 1}/{news.length}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="transition-all duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            display: 'flex',
          }}
        >
          {news.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full"
              style={{ minWidth: '100%' }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-gray-800 p-3 rounded transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">
                    {getSentimentBadge(item.sentiment)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white line-clamp-2 mb-1">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">{item.source}</span>
                      <span className={getSentimentColor(item.sentiment)}>
                        {item.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-1 mt-3">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-purple-500 w-4'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
