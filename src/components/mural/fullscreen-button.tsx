'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFullscreen } from '@/hooks/use-fullscreen';

const AUTO_HIDE_DELAY = 3000; // 3 seconds

export function FullscreenButton() {
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen();
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showButton = useCallback(() => {
    setIsVisible(true);

    // Clear existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // Auto-hide after delay when in fullscreen
    if (isFullscreen) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, AUTO_HIDE_DELAY);
    }
  }, [isFullscreen]);

  // Show button on mouse movement
  useEffect(() => {
    const handleMouseMove = () => {
      showButton();
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [showButton]);

  // Show button when exiting fullscreen
  useEffect(() => {
    if (!isFullscreen) {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
  }, [isFullscreen]);

  if (!isSupported) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-6 right-6 z-50 p-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white/60 hover:text-white transition-colors"
          onClick={toggleFullscreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'}
        >
          {isFullscreen ? (
            // Compress/exit fullscreen icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          ) : (
            // Expand/enter fullscreen icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
