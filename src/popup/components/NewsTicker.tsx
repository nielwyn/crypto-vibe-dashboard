import React, { useState, useEffect, useCallback } from 'react';
import { NewsItem } from '../../types';

interface NewsTickerProps {
  news: NewsItem[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ news }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto-rotate every 5 seconds (pause on hover)
  useEffect(() => {
    if (news.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length, isHovered]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  }, [news.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  }, [news.length]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    setTouchStart(null);
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return { emoji: '🟢', label: 'Bullish', bgClass: 'bg-green-900/40 text-green-400 border-green-500/30' };
      case 'negative':
        return { emoji: '🔴', label: 'Bearish', bgClass: 'bg-red-900/40 text-red-400 border-red-500/30' };
      default:
        return { emoji: '⚪', label: 'Neutral', bgClass: 'bg-gray-800/40 text-gray-400 border-gray-600/30' };
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (news.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 mb-3">
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-lg">📰</span>
          <span className="text-sm">No news available</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <span className="text-sm">📰</span>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Latest News</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{news.length}</span>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Arrows - positioned at edges, only visible on hover */}
        {news.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-0 top-0 bottom-0 z-10 w-8 flex items-center justify-center text-white/60 hover:text-white bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Previous news"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-0 top-0 bottom-0 z-10 w-8 flex items-center justify-center text-white/60 hover:text-white bg-gradient-to-l from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label="Next news"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Cards Container */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {news.map((item, index) => {
              const sentiment = getSentimentBadge(item.sentiment);
              
              return (
                <div
                  key={index}
                  className="w-full flex-shrink-0 p-4"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    {/* Sentiment Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${sentiment.bgClass}`}>
                        <span>{sentiment.emoji}</span>
                        <span>{sentiment.label}</span>
                      </span>
                      <span className="text-xs text-gray-500">{formatTimeAgo(item.scrapedAt)}</span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-medium text-white leading-snug mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {item.title}
                    </h4>

                    {/* Source & Read More */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{item.source}</span>
                      <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Read more
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      {news.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pb-3">
          {news.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-purple-500 w-4'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
