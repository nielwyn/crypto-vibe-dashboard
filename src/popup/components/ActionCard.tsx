import React from 'react';
import { ActionCard as CardType } from '../../types/actionCards';

export const ActionCard: React.FC<{ card: CardType }> = ({ card }) => {
  const riskColors = {
    low: 'text-green-400 bg-green-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    high: 'text-red-400 bg-red-400/10'
  };
  
  const typeColors = {
    yield: 'border-green-500/30',
    alert: 'border-yellow-500/30',
    degen: 'border-purple-500/30',
    safe: 'border-blue-500/30'
  };

  return (
    <div className={`rounded-lg border p-3 bg-gray-800/50 ${typeColors[card.type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{card.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white">{card.title}</span>
            {card.risk && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${riskColors[card.risk]}`}>
                {card.risk.toUpperCase()}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-2">{card.description}</p>
          <div className="flex items-center justify-between">
            {card.metric && (
              <span className="text-xs">
                <span className="text-gray-500">{card.metric}: </span>
                <span className="text-white font-medium">{card.metricValue}</span>
              </span>
            )}
            {card.confidence && (
              <div className="flex items-center gap-1">
                <div className="w-12 h-1.5 bg-gray-700 rounded-full">
                  <div className="h-full bg-purple-500 rounded-full" style={{width: `${card.confidence}%`}} />
                </div>
                <span className="text-[10px] text-gray-400">{card.confidence}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
