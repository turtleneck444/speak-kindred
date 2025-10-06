import { useEffect, useState, useCallback, useRef } from 'react';

interface ScanningModeOptions {
  enabled: boolean;
  speed: number; // milliseconds
  highlightColor?: string;
  onSelect?: (element: HTMLElement) => void;
}

export const useScanningMode = (options: ScanningModeOptions) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningElements, setScanningElements] = useState<HTMLElement[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play scan sound
  const playSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }, []);

  // Find all scannable elements
  const findScannableElements = useCallback(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scannable="true"], button:not([disabled]), [role="button"]')
    ).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0; // Visible elements only
    });
    setScanningElements(elements);
    return elements;
  }, []);

  // Start scanning
  const startScanning = useCallback(() => {
    const elements = findScannableElements();
    if (elements.length === 0) return;

    setIsScanning(true);
    setCurrentIndex(0);

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % elements.length;
        playSound();
        return next;
      });
    }, options.speed);
  }, [findScannableElements, options.speed, playSound]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsScanning(false);
  }, []);

  // Select current element
  const selectCurrent = useCallback(() => {
    if (scanningElements[currentIndex]) {
      const element = scanningElements[currentIndex];
      
      // Remove highlight from all
      scanningElements.forEach(el => {
        el.style.outline = '';
        el.style.boxShadow = '';
      });

      // Trigger click
      element.click();
      
      if (options.onSelect) {
        options.onSelect(element);
      }

      // Restart scanning after selection
      stopScanning();
      setTimeout(() => {
        if (options.enabled) {
          startScanning();
        }
      }, 500);
    }
  }, [currentIndex, scanningElements, options, startScanning, stopScanning]);

  // Highlight current element
  useEffect(() => {
    if (!isScanning || scanningElements.length === 0) return;

    // Remove previous highlights
    scanningElements.forEach(el => {
      el.style.outline = '';
      el.style.boxShadow = '';
      el.style.transform = '';
    });

    // Highlight current
    const current = scanningElements[currentIndex];
    if (current) {
      const color = options.highlightColor || '#FFD700';
      current.style.outline = `4px solid ${color}`;
      current.style.boxShadow = `0 0 20px ${color}`;
      current.style.transform = 'scale(1.05)';
      current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex, isScanning, scanningElements, options.highlightColor]);

  // Handle keyboard events
  useEffect(() => {
    if (!options.enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        if (!isScanning) {
          startScanning();
        } else {
          selectCurrent();
        }
      } else if (e.key === 'Escape') {
        stopScanning();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [options.enabled, isScanning, startScanning, selectCurrent, stopScanning]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopScanning();
      // Remove all highlights
      scanningElements.forEach(el => {
        el.style.outline = '';
        el.style.boxShadow = '';
        el.style.transform = '';
      });
    };
  }, [scanningElements, stopScanning]);

  // Start/stop based on enabled state
  useEffect(() => {
    if (options.enabled && !isScanning) {
      // Auto-start after a delay
      const timeout = setTimeout(startScanning, 1000);
      return () => clearTimeout(timeout);
    } else if (!options.enabled && isScanning) {
      stopScanning();
    }
  }, [options.enabled, isScanning, startScanning, stopScanning]);

  return {
    isScanning,
    currentIndex,
    startScanning,
    stopScanning,
    selectCurrent,
    scanningElements
  };
};
