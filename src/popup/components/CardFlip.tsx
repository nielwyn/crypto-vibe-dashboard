import React, { useState, useEffect } from 'react';

// Animation duration in milliseconds (matches CSS 0.8s)
const ANIMATION_DURATION_MS = 800;

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
  const [prevFlipped, setPrevFlipped] = useState(isFlipped);

  useEffect(() => {
    // Only animate when the flip state actually changes
    if (isFlipped !== prevFlipped) {
      setIsAnimating(true);
      setPrevFlipped(isFlipped);
      const timer = setTimeout(() => setIsAnimating(false), ANIMATION_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, prevFlipped]);

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
