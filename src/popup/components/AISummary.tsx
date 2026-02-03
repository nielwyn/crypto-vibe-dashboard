import React, { useState, useEffect } from 'react';
import { AIAnalysis } from '../../types';
import { ModeToggle } from './ModeToggle';

interface AISummaryProps {
  analysis: AIAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
  mode: 'professional' | 'degen';
  onModeChange: (mode: 'professional' | 'degen') => void;
}

export const AISummary: React.FC<AISummaryProps> = ({
  analysis,
  loading,
  onRefresh,
  mode,
  onModeChange,
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
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden mb-3">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <span className="text-sm font-medium text-white">🤖 AI Analysis</span>
        <ModeToggle mode={mode} onToggle={onModeChange} />
      </div>
      
      {/* Content - scrollable if too long */}
      <div className="p-3 max-h-20 overflow-y-auto scrollbar-thin text-sm text-gray-300">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-700 rounded w-4/5" />
          </div>
        ) : analysis ? (
          <p className="leading-relaxed">{displayedText}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
        ) : (
          <p className="leading-relaxed text-gray-500 italic">Click "Refresh" to generate AI analysis</p>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between p-3 border-t border-gray-800 bg-[#141414]">
        <button 
          onClick={onRefresh}
          disabled={loading || isTyping}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-600"
        >
          🔄 Refresh
        </button>
        {analysis && !loading && !isTyping && (
          <span className="text-xs text-gray-500">
            ⏱️ {new Date(analysis.generatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};
