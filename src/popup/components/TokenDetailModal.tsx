import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CoinData, FearGreedData } from '../../types';
import { YieldsSection } from './YieldsSection';
import { Sparkline } from './Sparkline';
import { useYields } from '../../hooks/useYields';
import { useAI } from '../../hooks/useAI';

interface TokenDetailModalProps {
  coin: CoinData;
  fearGreed: FearGreedData;
  aiMode: 'professional' | 'degen';
  selectedPersona: string;
  onClose: () => void;
}

export const TokenDetailModal: React.FC<TokenDetailModalProps> = ({
  coin,
  fearGreed,
  aiMode,
  selectedPersona,
  onClose,
}) => {
  const { yields, loading: yieldsLoading } = useYields([coin.symbol]);
  const { analysis, loading: aiLoading, generateAnalysis } = useAI();
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const isPositive = coin.price_change_percentage_24h > 0;
  const sparklineData = coin.sparkline_in_7d?.price || [];

  // Generate analysis for this specific token
  useEffect(() => {
    generateAnalysis([coin], aiMode, yields, fearGreed, selectedPersona);
  }, [coin.id]);

  // Typing effect for analysis
  useEffect(() => {
    if (analysis && analysis.summary) {
      setIsTyping(true);
      setDisplayedText('');

      let index = 0;
      const text = analysis.summary;

      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 10);

      return () => clearInterval(interval);
    }
  }, [analysis]);

  const handleRefresh = () => {
    generateAnalysis([coin], aiMode, yields, fearGreed, selectedPersona);
  };

  return createPortal(
    <div className="fixed inset-0 bg-[#0f0f1a] z-[100] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[#3d4470]/50 bg-[#0f0f1a]">
        <button
          onClick={onClose}
          className="text-[#8da4d4] hover:text-white transition-colors flex items-center gap-1"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{coin.symbol.toUpperCase()}</span>
          <span className="text-sm text-[#8da4d4]">{coin.name}</span>
        </div>
        <div className="w-12" /> {/* Spacer for centering */}
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {/* Price Card */}
        <div className="phantom-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-2xl font-bold text-white">
                ${coin.current_price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: coin.current_price < 1 ? 6 : 2,
                })}
              </div>
              <div className={`text-lg font-semibold ${isPositive ? 'text-[#14f195]' : 'text-[#ff6b6b]'}`}>
                {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}% (24h)
              </div>
            </div>
          </div>
          
          {/* Sparkline Chart */}
          {sparklineData.length > 0 && (
            <div className="mt-4">
              <Sparkline
                data={sparklineData}
                width={340}
                height={80}
                color={isPositive ? '#14f195' : '#ff6b6b'}
              />
              <div className="text-xs text-[#8da4d4]/60 mt-1 text-center">7 Day Price Chart</div>
            </div>
          )}
        </div>

        {/* AI Analysis Section */}
        <div className="phantom-card overflow-hidden mb-4">
          <div className="flex items-center justify-between p-3 border-b border-[#3d4470]/50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">🤖 AI Analysis</span>
              <span className="text-xs text-[#ab9ff2] bg-[#ab9ff2]/10 px-1.5 py-0.5 rounded">
                {coin.symbol.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="p-3">
            {aiLoading && !analysis ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-[#3d4470] rounded w-full" />
                <div className="h-3 bg-[#3d4470] rounded w-4/5" />
                <div className="h-3 bg-[#3d4470] rounded w-3/4" />
              </div>
            ) : analysis ? (
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {displayedText}
                {isTyping && <span className="animate-pulse text-[#8da4d4]">|</span>}
              </p>
            ) : (
              <p className="text-sm text-[#8da4d4]/50 italic">Generating analysis...</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-[#3d4470]/50 bg-[#0f0f1a]/50">
            <button
              onClick={handleRefresh}
              disabled={aiLoading || isTyping}
              className="flex items-center gap-1 text-xs text-[#8da4d4] hover:text-[#5a7cc0] disabled:text-gray-600 transition-colors"
            >
              🔄 Refresh
            </button>
            {analysis && !aiLoading && !isTyping && (
              <span className="text-xs text-[#8da4d4]/50">
                ⏱️ {new Date(analysis.generatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Yields Section */}
        <YieldsSection yields={yields} loading={yieldsLoading} focusedToken={coin.symbol} />

        {/* Token News Section */}
        <div className="phantom-card p-3 mb-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-white">📰 {coin.symbol.toUpperCase()} News</span>
          </div>
          <div className="text-sm text-[#8da4d4]/60 text-center py-4">
            Token-specific news coming soon
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
