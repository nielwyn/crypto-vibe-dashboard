import React, { useState, useEffect, useRef } from 'react';

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
  const [displayedContent, setDisplayedContent] = useState<'front' | 'back'>(isFlipped ? 'back' : 'front');
  const prevFlippedRef = useRef(isFlipped);

  useEffect(() => {
    // Only animate when the flip state actually changes
    if (isFlipped !== prevFlippedRef.current) {
      setIsAnimating(true);
      prevFlippedRef.current = isFlipped;
      
      // Switch content at the halfway point of the animation (when card is edge-on)
      const switchTimer = setTimeout(() => {
        setDisplayedContent(isFlipped ? 'back' : 'front');
      }, ANIMATION_DURATION_MS / 2);
      
      const animTimer = setTimeout(() => {
        setIsAnimating(false);
      }, ANIMATION_DURATION_MS);
      
      return () => {
        clearTimeout(switchTimer);
        clearTimeout(animTimer);
      };
    }
  }, [isFlipped]);

  return (
    <div className="card-container">
      <div className={`card ${isFlipped ? 'flipped' : ''} ${isAnimating ? 'animating' : ''}`}>
        {/* Single face that switches content at midpoint */}
        <div className="card-face card-single">
          {displayedContent === 'back' ? backContent : frontContent}
        </div>
      </div>
    </div>
  );
};
