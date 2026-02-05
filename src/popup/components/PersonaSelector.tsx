import React from 'react';
import { PERSONAS } from '../../services/personas';

interface PersonaSelectorProps {
  selectedPersona: string;
  onSelect: (id: string) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersona, onSelect }) => {
  const handleSurprise = () => {
    const random = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    onSelect(random.id);
  };

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 uppercase">AI Persona</span>
        <button onClick={handleSurprise} className="text-xs text-purple-400 hover:text-purple-300">
          🎲 Surprise Me!
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {PERSONAS.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex-shrink-0 flex flex-col items-center p-2 rounded-lg transition-all ${
              selectedPersona === p.id
                ? 'bg-purple-600/30 border border-purple-500'
                : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
            }`}
          >
            <span className="text-2xl">{p.emoji}</span>
            <span className="text-[10px] text-gray-400">{p.shortName}</span>
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {PERSONAS.find(p => p.id === selectedPersona)?.tagline}
      </div>
    </div>
  );
};
