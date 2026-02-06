import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AIAnalysis, CoinData } from '../../types';
import { PersonaSelector } from './PersonaSelector';
import { storage } from '../../services/storage';

interface AISummaryProps {
  analysis: AIAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
  mode: 'professional' | 'degen';
  onModeChange: (mode: 'professional' | 'degen') => void;
  onPersonaChange?: (personaId: string) => void;
  selectedCoins?: CoinData[];
  isMarketOverview?: boolean;
}

export const AISummary: React.FC<AISummaryProps> = ({
  analysis,
  loading,
  onRefresh,
  mode: _mode,
  onModeChange: _onModeChange,
  onPersonaChange,
  selectedCoins,
  isMarketOverview = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('analyst');
  const [expanded, setExpanded] = useState(false);

  // Load persona preference on mount
  useEffect(() => {
    storage.getPreferences().then(prefs => {
      if (prefs.aiPersona) {
        setSelectedPersona(prefs.aiPersona);
      }
    });
  }, []);

  // Handle persona selection
  const handlePersonaSelect = async (personaId: string) => {
    setSelectedPersona(personaId);
    const prefs = await storage.getPreferences();
    await storage.setPreferences({ ...prefs, aiPersona: personaId });
    if (onPersonaChange) {
      onPersonaChange(personaId);
    }
  };

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
    <div className="phantom-card overflow-hidden mb-3">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#3d4470]/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">🤖 AI Analysis</span>
          {isMarketOverview ? (
            <span className="text-[10px] text-[#8da4d4]">
              (Market Overview)
            </span>
          ) : selectedCoins && selectedCoins.length > 0 && (
            <span className="text-[10px] text-[#8da4d4]">
              ({selectedCoins.map(c => c.symbol.toUpperCase()).join(', ')})
            </span>
          )}
        </div>
      </div>

      {/* Persona Selector */}
      <div className="px-3 pt-3">
        <PersonaSelector selectedPersona={selectedPersona} onSelect={handlePersonaSelect} />
      </div>

      {/* Content */}
      <div className="p-3">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-[#3d4470] rounded w-full" />
            <div className="h-3 bg-[#3d4470] rounded w-4/5" />
          </div>
        ) : analysis ? (
          <div className="relative">
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-4">
              {displayedText}
              {isTyping && <span className="animate-pulse text-[#8da4d4]">|</span>}
            </p>
            {/* Read more link - show always when there's content */}
            {displayedText.length > 50 && (
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-[#ab9ff2] hover:text-white mt-2 transition-colors"
              >
                {isTyping ? 'View full ↓' : 'Read more ↓'}
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-[#8da4d4]/50 italic leading-relaxed">Click "Refresh" to generate AI analysis</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-3 border-t border-[#3d4470]/50 bg-[#0f0f1a]/50">
        <button
          onClick={onRefresh}
          disabled={loading || isTyping}
          className="flex items-center gap-1 text-xs text-[#8da4d4] hover:text-[#5a7cc0] disabled:text-gray-600 transition-colors"
        >
          🔄 Refresh
        </button>
        {analysis && !loading && !isTyping && (
          <span className="text-xs text-[#8da4d4]/50">
            ⏱️ {new Date(analysis.generatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Expanded modal - rendered via portal to escape parent overflow */}
      {expanded && createPortal(
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#0f0f1a] border border-[#3d4470]/50 rounded-lg max-w-[380px] max-h-[500px] flex flex-col">
            {/* Sticky header with close button */}
            <div className="sticky top-0 flex justify-between items-center p-4 border-b border-[#3d4470]/50 bg-[#0f0f1a] rounded-t-lg z-10">
              <span className="font-medium text-white">AI Analysis</span>
              <button
                onClick={() => setExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#3d4470]/30"
              >
                ✕
              </button>
            </div>
            {/* Scrollable content */}
            <div className="p-4 overflow-y-auto scrollbar-thin flex-1">
              <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">{displayedText}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
