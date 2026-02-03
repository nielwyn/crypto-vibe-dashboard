import { useRef, useEffect } from 'react';

/**
 * Custom hook to enable drag-to-scroll on a scrollable element
 * while still allowing clicks to work normally
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const stateRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const state = stateRef.current;

    const handleMouseDown = (e: MouseEvent) => {
      // Only handle left mouse button
      if (e.button !== 0) return;
      
      state.isDragging = true;
      state.hasMoved = false;
      state.startX = e.pageX;
      state.scrollLeft = element.scrollLeft;
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';
    };

    // Handle move on document so dragging continues even when cursor leaves element
    const handleMouseMove = (e: MouseEvent) => {
      if (!state.isDragging) return;

      const x = e.pageX;
      const walk = (state.startX - x) * 1.2;
      
      if (Math.abs(walk) > 5) {
        state.hasMoved = true;
      }
      
      element.scrollLeft = state.scrollLeft + walk;
    };

    // Handle mouseup on document so drag ends even when cursor is outside
    const handleMouseUp = () => {
      if (!state.isDragging) return;
      
      state.isDragging = false;
      element.style.cursor = 'grab';
      element.style.userSelect = '';
    };

    const handleClick = (e: MouseEvent) => {
      // If we moved during drag, prevent the click from activating buttons
      if (state.hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        state.hasMoved = false;
      }
    };

    element.style.cursor = 'grab';
    
    // Mouse down on element only
    element.addEventListener('mousedown', handleMouseDown, true);
    // Move and up on document for smooth dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('click', handleClick, true);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('click', handleClick, true);
    };
  }, []);

  return ref;
}
