'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Letter } from '@/types';

interface LetterCardProps {
  letter: Letter;
  delay?: number;
  isVisible?: boolean;
}

export const LetterCard = React.memo(function LetterCard({
  letter,
  delay = 0,
  isVisible = false,
}: LetterCardProps) {
  return (
    <motion.div
      className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px] p-6 bg-cream rounded-lg border border-white/[0.06] ring-1 ring-white/5 hover:ring-white/10 transition-all duration-300 hover:scale-[1.02] cursor-default"
      initial={{ opacity: 0, y: -20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <div className="relative">
        {/* Opening quote */}
        <span
          className="absolute -top-2 -left-1 font-playfair text-5xl text-burgundy/40 leading-none select-none"
          aria-hidden="true"
        >
          &ldquo;
        </span>

        {/* Letter content */}
        <p className="font-jetbrains text-sm text-foreground/90 leading-relaxed pl-6 pr-2">
          {letter.content}
        </p>

        {/* Closing quote */}
        <span
          className="absolute -bottom-4 right-2 font-playfair text-5xl text-burgundy/40 leading-none select-none"
          aria-hidden="true"
        >
          &rdquo;
        </span>
      </div>

      {/* City */}
      <div className="mt-6 pt-4 border-t border-foreground/10">
        <p className="text-sm text-foreground/50">{letter.city}</p>
      </div>
    </motion.div>
  );
});
