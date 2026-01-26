'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Letter } from '@/types';

interface UseLetterCycleOptions {
  cycleDuration?: number; // Total cycle duration in ms (default: 12000)
  spotlightDuration?: number; // How long spotlight shows in ms (default: 6000)
}

interface UseLetterCycleReturn {
  currentLetter: Letter | null;
  isSpotlightActive: boolean;
}

export function useLetterCycle(
  letters: Letter[],
  options: UseLetterCycleOptions = {}
): UseLetterCycleReturn {
  const { cycleDuration = 12000, spotlightDuration = 6000 } = options;

  const [currentLetter, setCurrentLetter] = useState<Letter | null>(null);
  const [isSpotlightActive, setIsSpotlightActive] = useState(false);
  const lastLetterIdRef = useRef<string | null>(null);
  const cycleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spotlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectRandomLetter = useCallback(() => {
    if (letters.length === 0) return null;
    if (letters.length === 1) return letters[0];

    // Avoid selecting the same letter twice in a row
    let attempts = 0;
    let selectedLetter: Letter;

    do {
      const randomIndex = Math.floor(Math.random() * letters.length);
      selectedLetter = letters[randomIndex];
      attempts++;
    } while (
      selectedLetter.id === lastLetterIdRef.current &&
      attempts < 10
    );

    lastLetterIdRef.current = selectedLetter.id;
    return selectedLetter;
  }, [letters]);

  const startCycle = useCallback(() => {
    // Clear any existing timeouts
    if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
    if (spotlightTimeoutRef.current) clearTimeout(spotlightTimeoutRef.current);

    // Select and show letter
    const letter = selectRandomLetter();
    if (!letter) return;

    setCurrentLetter(letter);
    setIsSpotlightActive(true);

    // Hide spotlight after duration
    spotlightTimeoutRef.current = setTimeout(() => {
      setIsSpotlightActive(false);
    }, spotlightDuration);

    // Schedule next cycle
    cycleTimeoutRef.current = setTimeout(() => {
      startCycle();
    }, cycleDuration);
  }, [selectRandomLetter, cycleDuration, spotlightDuration]);

  // Handle visibility change to pause/resume cycle
  useEffect(() => {
    if (letters.length === 0) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause: clear timeouts
        if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
        if (spotlightTimeoutRef.current) clearTimeout(spotlightTimeoutRef.current);
        setIsSpotlightActive(false);
      } else {
        // Resume: start new cycle
        startCycle();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start initial cycle
    startCycle();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
      if (spotlightTimeoutRef.current) clearTimeout(spotlightTimeoutRef.current);
    };
  }, [letters, startCycle]);

  return { currentLetter, isSpotlightActive };
}
