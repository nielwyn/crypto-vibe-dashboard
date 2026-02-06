import { useRef, useEffect } from 'react';

/**
 * Custom hook to enable drag-to-scroll on a scrollable element
 * while still allowing clicks to work normally
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasMoved = false;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging = true;
      hasMoved = false;
      startX = e.pageX;
      scrollLeft = element.scrollLeft;
      element.style.cursor = 'grabbing';
      element.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = (startX - x) * 1.2;
      if (Math.abs(walk) > 5) {
        hasMoved = true;
      }
      element.scrollLeft = scrollLeft + walk;
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      element.style.cursor = 'grab';
      element.style.userSelect = '';
    };

    const handleClick = (e: MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    };

    element.style.cursor = 'grab';
    
    element.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('click', handleClick, true);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('click', handleClick, true);
    };
  }, []);

  return ref;
}
