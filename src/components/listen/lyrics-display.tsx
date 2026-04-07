'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { copy } from '@/constants/copy';
import type { LyricLine } from '@/types/listen';

interface LyricsDisplayProps {
  lyrics: LyricLine[] | null;
  currentTime: number;
  onSeekToLine?: (time: number) => void;
}

function getActiveLyricIndex(lyrics: LyricLine[], currentTime: number): number {
  let active = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      active = i;
    }
  }
  return active;
}

export function LyricsDisplay({ lyrics, currentTime, onSeekToLine }: LyricsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const activeIndex = lyrics ? getActiveLyricIndex(lyrics, currentTime) : -1;

  // Auto-scroll to active line
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = activeRef.current;
      const containerHeight = container.clientHeight;
      const elementTop = element.offsetTop;
      const elementHeight = element.clientHeight;
      const scrollTarget = elementTop - containerHeight / 2 + elementHeight / 2;

      container.scrollTo({
        top: scrollTarget,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-foreground/30 text-sm font-jetbrains">
          {copy.listen.player.noLyrics}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto px-6 py-12 scroll-smooth"
    >
      <div className="space-y-4 min-h-full flex flex-col items-center justify-center">
        {lyrics.map((line, index) => {
          const isActive = index === activeIndex;
          const isEmpty = !line.text.trim();

          if (isEmpty) {
            return <div key={index} className="h-6" />;
          }

          return (
            <motion.button
              key={index}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSeekToLine?.(line.time)}
              className={cn(
                'block w-full text-center transition-all duration-300 leading-relaxed',
                isActive
                  ? 'text-foreground text-lg md:text-xl font-medium'
                  : 'text-foreground/25 text-base md:text-lg hover:text-foreground/40'
              )}
              animate={isActive ? { scale: 1.02 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {line.text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
