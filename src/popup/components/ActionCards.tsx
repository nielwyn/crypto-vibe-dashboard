import React from 'react';
import { ActionCard as CardType } from '../../types/actionCards';
import { ActionCard } from './ActionCard';

export const ActionCards: React.FC<{ cards: CardType[] }> = ({ cards }) => {
  if (!cards.length) return null;
  return (
    <div className="mt-3 space-y-2">
      <div className="text-xs text-gray-400 uppercase">🎯 AI Actions</div>
      {cards.map(card => <ActionCard key={card.id} card={card} />)}
    </div>
  );
};
