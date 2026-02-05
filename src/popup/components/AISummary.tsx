import React, { useState, useEffect } from 'react';
import { AIAnalysis } from '../../types';
import { ModeToggle } from './ModeToggle';
import { PersonaSelector } from './PersonaSelector';
import { ActionCards } from './ActionCards';
import { storage } from '../../services/storage';

interface AISummaryProps {
  analysis: AIAnalysis | null;
  loading: boolean;
  onRefresh: () => void;
  mode: 'professional' | 'degen';
  onModeChange: (mode: 'professional' | 'degen') => void;
  onPersonaChange?: (personaId: string) => void;
}

export const AISummary: React.FC<AISummaryProps> = ({
  analysis,
  loading,
  onRefresh,
  mode,
  onModeChange,
  onPersonaChange,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('analyst');

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
        <span className="text-sm font-medium text-white">🤖 AI Analysis</span>
        <ModeToggle mode={mode} onToggle={onModeChange} />
      </div>
      
      {/* Persona Selector */}
      <div className="px-3 pt-3">
        <PersonaSelector selectedPersona={selectedPersona} onSelect={handlePersonaSelect} />
      </div>
      
      {/* Content - scrollable if too long */}
      <div className="p-3 max-h-32 overflow-y-auto scrollbar-thin text-sm text-gray-300">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-[#3d4470] rounded w-full" />
            <div className="h-3 bg-[#3d4470] rounded w-4/5" />
          </div>
        ) : analysis ? (
          <>
            <p className="leading-relaxed">{displayedText}
              {isTyping && <span className="animate-pulse text-[#8da4d4]">|</span>}
            </p>
            {!isTyping && analysis.actionCards && (
              <ActionCards cards={analysis.actionCards} />
            )}
          </>
        ) : (
          <p className="leading-relaxed text-[#8da4d4]/50 italic">Click "Refresh" to generate AI analysis</p>
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
    </div>
  );
};
