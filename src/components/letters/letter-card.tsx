'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { copy } from '@/constants/copy';
import type { Letter } from '@/types';

interface LetterCardProps {
  letter: Letter;
  delay?: number; // delay in ms before typing starts
  startTyping?: boolean; // whether to start the typewriter effect
}

export function LetterCard({ letter, delay = 0, startTyping = false }: LetterCardProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const hasStartedRef = useRef(false);

  const authorName = letter.is_anonymous
    ? copy.marquee.anonymous
    : letter.author || copy.marquee.anonymous;

  useEffect(() => {
    // Only start typing once, when startTyping becomes true
    if (!startTyping || hasStartedRef.current) return;
    hasStartedRef.current = true;

    let intervalId: NodeJS.Timeout | null = null;

    // Start typing after the specified delay
    const delayTimeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      const text = letter.content;

      intervalId = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          setIsComplete(true);
          if (intervalId) clearInterval(intervalId);
        }
      }, 30);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [startTyping, letter.content, delay]);

  return (
    <motion.div
      className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px] p-6 bg-cream rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-default"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        {/* Opening quote */}
        <span
          className="absolute -top-2 -left-1 font-playfair text-5xl text-burgundy/30 leading-none select-none"
          aria-hidden="true"
        >
          &ldquo;
        </span>

        {/* Letter content with typewriter effect */}
        <p className="font-jetbrains text-sm text-foreground/90 leading-relaxed pl-6 pr-2">
          {isComplete ? letter.content : displayedText}
          {isTyping && (
            <span className="inline-block w-0.5 h-4 bg-burgundy ml-0.5 animate-pulse" />
          )}
        </p>

        {/* Closing quote */}
        <span
          className="absolute -bottom-4 right-2 font-playfair text-5xl text-burgundy/30 leading-none select-none"
          aria-hidden="true"
        >
          &rdquo;
        </span>
      </div>

      {/* Author and city */}
      <div className="mt-6 pt-4 border-t border-foreground/10">
        <p className="text-sm">
          <span className="text-burgundy font-medium">{authorName}</span>
          <span className="text-foreground/40 mx-1">&middot;</span>
          <span className="text-foreground/50">{letter.city}</span>
        </p>
      </div>
    </motion.div>
  );
}
