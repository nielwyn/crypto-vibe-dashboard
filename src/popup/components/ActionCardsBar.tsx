import React from 'react';
import { useDragScroll } from '../../hooks/useDragScroll';
import { ActionCard } from '../../types/actionCards';

interface ActionCardsBarProps {
  cards: ActionCard[];
}

export const ActionCardsBar: React.FC<ActionCardsBarProps> = ({ cards }) => {
  if (!cards.length) return null;

  const scrollRef = useDragScroll<HTMLDivElement>();

  return (
    <div className="phantom-card p-3 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-[#8da4d4]">🎯 AI ACTIONS</span>
        <span className="text-[10px] text-[#ab9ff2] bg-[#ab9ff2]/10 px-1.5 py-0.5 rounded">
          {cards.length}
        </span>
      </div>
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {cards.map(card => (
          <div 
            key={card.id}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border ${
              card.type === 'yield' ? 'border-green-500/30 bg-green-500/10' :
              card.type === 'alert' ? 'border-yellow-500/30 bg-yellow-500/10' :
              card.type === 'degen' ? 'border-purple-500/30 bg-purple-500/10' :
              'border-blue-500/30 bg-blue-500/10'
            }`}
          >
            <span className="text-lg">{card.icon}</span>
            <div>
              <div className="text-xs font-medium text-white">{card.title}</div>
              <div className="text-[10px] text-[#8da4d4]">{card.metricValue || card.description.slice(0, 30)}</div>
            </div>
            {card.risk && (
              <span className={`text-[8px] px-1 py-0.5 rounded ${
                card.risk === 'low' ? 'bg-green-500/20 text-green-400' :
                card.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {card.risk.toUpperCase()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
