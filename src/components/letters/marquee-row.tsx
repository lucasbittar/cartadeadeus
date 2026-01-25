'use client';

import React, { useState, useMemo } from 'react';
import { LetterCard } from './letter-card';
import type { Letter } from '@/types';

interface MarqueeRowProps {
  letters: Letter[];
  direction?: 'left' | 'right';
  speed?: number; // seconds for full cycle
  startTyping?: boolean;
}

export function MarqueeRow({
  letters,
  direction = 'left',
  speed = 70,
  startTyping = false,
}: MarqueeRowProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Triple the letters for seamless looping
  const tripleLetters = useMemo(() => {
    return [...letters, ...letters, ...letters];
  }, [letters]);

  const animationClass =
    direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex gap-6 ${animationClass}`}
        style={{
          '--marquee-duration': `${speed}s`,
          animationPlayState: isPaused ? 'paused' : 'running',
        } as React.CSSProperties}
      >
        {tripleLetters.map((letter, index) => (
          <LetterCard
            key={`${letter.id}-${index}`}
            letter={letter}
            delay={index * 150}
            startTyping={startTyping}
          />
        ))}
      </div>
    </div>
  );
}
