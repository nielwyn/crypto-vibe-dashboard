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
    mouseDownTarget: null as EventTarget | null,
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
      state.mouseDownTarget = e.target;
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!state.isDragging) return;

      const x = e.pageX;
      const walk = (state.startX - x) * 1.2;
      
      if (Math.abs(walk) > 5) {
        state.hasMoved = true;
        e.preventDefault();
      }
      
      element.scrollLeft = state.scrollLeft + walk;
    };

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
    
    // Use capture phase for all events to intercept before children handle them
    element.addEventListener('mousedown', handleMouseDown, true);
    element.addEventListener('mousemove', handleMouseMove, true);
    element.addEventListener('mouseup', handleMouseUp, true);
    element.addEventListener('mouseleave', handleMouseUp, true);
    element.addEventListener('click', handleClick, true);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown, true);
      element.removeEventListener('mousemove', handleMouseMove, true);
      element.removeEventListener('mouseup', handleMouseUp, true);
      element.removeEventListener('mouseleave', handleMouseUp, true);
      element.removeEventListener('click', handleClick, true);
    };
  }, []);

  return ref;
}
