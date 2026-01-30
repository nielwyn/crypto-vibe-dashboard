import React, { useState, useEffect } from 'react';
import { AIAnalysis } from '../../types';

interface AISummaryProps {
  analysis: AIAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
}

export const AISummary: React.FC<AISummaryProps> = ({
  analysis,
  loading,
  onRefresh,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
      }, 10); // Typing speed

      return () => clearInterval(interval);
    }
  }, [analysis]);

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          🤖 AI Market Analysis
        </h2>
        <button
          onClick={onRefresh}
          disabled={loading || isTyping}
          className="px-3 py-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded transition-colors"
        >
          {loading ? '⏳ Analyzing...' : '🔄 Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 bg-gray-800 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-gray-800 rounded animate-pulse w-4/6" />
        </div>
      ) : analysis ? (
        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
          {displayedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </div>
      ) : (
        <div className="text-sm text-gray-500 italic">
          Click "Refresh" to generate AI analysis
        </div>
      )}

      {analysis && !loading && !isTyping && (
        <div className="mt-3 text-xs text-gray-500">
          Generated {new Date(analysis.generatedAt).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
