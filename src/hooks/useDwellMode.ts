import { useEffect, useRef, useState, useCallback } from 'react';

interface DwellModeOptions {
  enabled: boolean;
  dwellTime: number; // milliseconds to hover before click
  highlightColor?: string;
}

export const useDwellMode = (options: DwellModeOptions) => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    if (!options.enabled) return;
    
    const target = e.target as HTMLElement;
    
    // Check if it's an interactive element
    const isInteractive = 
      target.matches('button:not([disabled]), [role="button"], a, [data-scannable="true"]') ||
      target.closest('button:not([disabled]), [role="button"], a, [data-scannable="true"]');
    
    if (!isInteractive) return;

    const element = target.matches('button:not([disabled]), [role="button"], a, [data-scannable="true"]') 
      ? target 
      : target.closest('button:not([disabled]), [role="button"], a, [data-scannable="true"]') as HTMLElement;

    if (!element) return;

    setHoveredElement(element);
    setProgress(0);
    startTimeRef.current = Date.now();

    // Update progress
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / options.dwellTime) * 100, 100);
      setProgress(newProgress);
    }, 50);

    // Trigger click after dwell time
    timeoutRef.current = setTimeout(() => {
      element.click();
      clearTimers();
      setProgress(0);
      setHoveredElement(null);
    }, options.dwellTime);
  }, [options.enabled, options.dwellTime, clearTimers]);

  const handleMouseLeave = useCallback(() => {
    clearTimers();
    setProgress(0);
    setHoveredElement(null);
  }, [clearTimers]);

  useEffect(() => {
    if (!options.enabled) {
      clearTimers();
      setProgress(0);
      setHoveredElement(null);
      return;
    }

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      clearTimers();
    };
  }, [options.enabled, handleMouseEnter, handleMouseLeave, clearTimers]);

  // Visual feedback
  useEffect(() => {
    if (hoveredElement && progress > 0) {
      const color = options.highlightColor || '#FFD700';
      hoveredElement.style.outline = `4px solid ${color}`;
      hoveredElement.style.boxShadow = `0 0 0 ${progress / 10}px ${color}40, 0 0 30px ${color}60`;
      
      // Create or update progress indicator
      let progressEl = hoveredElement.querySelector('.dwell-progress') as HTMLElement;
      if (!progressEl) {
        progressEl = document.createElement('div');
        progressEl.className = 'dwell-progress';
        progressEl.style.cssText = `
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background: ${color};
          transition: width 50ms linear;
          z-index: 1000;
          border-radius: 2px;
        `;
        hoveredElement.style.position = 'relative';
        hoveredElement.appendChild(progressEl);
      }
      progressEl.style.width = `${progress}%`;
    } else if (hoveredElement) {
      hoveredElement.style.outline = '';
      hoveredElement.style.boxShadow = '';
      const progressEl = hoveredElement.querySelector('.dwell-progress');
      if (progressEl) progressEl.remove();
    }
  }, [hoveredElement, progress, options.highlightColor]);

  return {
    hoveredElement,
    progress,
  };
};
