import React, { useState, useEffect } from 'react';

interface CardFlipProps {
  isFlipped: boolean;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
}

export const CardFlip: React.FC<CardFlipProps> = ({ 
  isFlipped, 
  frontContent, 
  backContent 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isFlipped !== undefined) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  return (
    <div className="card-container">
      <div className={`card ${isFlipped ? 'flipped' : ''} ${isAnimating ? 'animating' : ''}`}>
        {/* Front - Dashboard */}
        <div className="card-face card-front">
          {frontContent}
        </div>
        
        {/* Back - Game */}
        <div className="card-face card-back">
          {backContent}
        </div>
      </div>
    </div>
  );
};
