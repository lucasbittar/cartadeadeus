'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthorName } from '@/components/ui/author-name';
import { copy } from '@/constants/copy';
import { useReducedMotion } from '@/hooks';
import type { Letter } from '@/types';

interface SpotlightOverlayProps {
  letter: Letter | null;
  isActive: boolean;
}

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SpotlightOverlay({ letter, isActive }: SpotlightOverlayProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const hasStartedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  // Reset and start typewriter effect when letter changes
  useEffect(() => {
    if (!letter || !isActive) {
      setDisplayedText('');
      setIsTyping(false);
      hasStartedRef.current = false;
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // For reduced motion, show full text immediately
    if (prefersReducedMotion) {
      setDisplayedText(letter.content);
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;
    let currentIndex = 0;
    const text = letter.content;

    // Small delay before starting to type
    const delayTimeout = setTimeout(() => {
      setIsTyping(true);

      intervalId = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          if (intervalId) clearInterval(intervalId);
        }
      }, 25); // Slightly faster than letter cards (25ms vs 30ms)
    }, 300);

    return () => {
      clearTimeout(delayTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [letter, isActive, prefersReducedMotion]);

  // Reset when spotlight becomes inactive
  useEffect(() => {
    if (!isActive) {
      hasStartedRef.current = false;
    }
  }, [isActive]);

  const authorName = letter?.is_anonymous
    ? copy.marquee.anonymous
    : letter?.author || copy.marquee.anonymous;

  return (
    <AnimatePresence>
      {isActive && letter && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: easing }}
        >
          {/* Backdrop with blur */}
          <motion.div
            className="absolute inset-0 bg-[#1C040B]/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Letter card */}
          <motion.div
            className="relative max-w-[800px] w-[90vw] p-12 md:p-16"
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            transition={{ duration: 0.8, ease: easing }}
          >
            {/* Opening quote - large decorative */}
            <span
              className="absolute -top-4 -left-2 md:-top-8 md:-left-4 font-playfair text-[120px] md:text-[180px] text-[#CB4767]/20 leading-none select-none pointer-events-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            {/* Letter content */}
            <p className="font-playfair text-2xl md:text-4xl text-white leading-relaxed text-center">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-[3px] h-8 md:h-10 bg-[#CB4767] ml-1 animate-pulse" />
              )}
            </p>

            {/* Closing quote */}
            <span
              className="absolute -bottom-12 -right-2 md:-bottom-16 md:-right-4 font-playfair text-[120px] md:text-[180px] text-[#CB4767]/20 leading-none select-none pointer-events-none"
              aria-hidden="true"
            >
              &rdquo;
            </span>

            {/* Author and city */}
            <motion.div
              className="mt-10 md:mt-12 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: easing }}
            >
              <p className="font-jetbrains text-lg md:text-xl">
                <AuthorName
                  name={authorName}
                  className="text-[#CB4767] font-medium"
                />
                <span className="text-white/40 mx-3">&middot;</span>
                <span className="text-white/60">{letter.city}</span>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
