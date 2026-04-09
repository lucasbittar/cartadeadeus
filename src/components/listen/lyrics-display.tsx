'use client';

import { useEffect, useRef, useCallback } from 'react';
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
  let active = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      active = i;
    }
  }
  return active;
}

// Optimized: blur only ±1, scale ±2-3, opacity-only beyond
function getLineVisuals(distance: number) {
  const abs = Math.abs(distance);
  if (abs === 0) return { opacity: 1, scale: 1, blur: 0, useTransform: true };
  if (abs === 1) return { opacity: 0.35, scale: 0.96, blur: 0.8, useTransform: true };
  if (abs === 2) return { opacity: 0.18, scale: 0.93, blur: 0, useTransform: true };
  if (abs === 3) return { opacity: 0.1, scale: 0.9, blur: 0, useTransform: true };
  return { opacity: 0.04, scale: 1, blur: 0, useTransform: false };
}

export function LyricsDisplay({ lyrics, currentTime, onSeekToLine }: LyricsDisplayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const isSynced = lyrics ? lyrics.some((l) => l.time >= 0) : false;
  const activeIndex = lyrics && isSynced ? getActiveLyricIndex(lyrics, currentTime) : -1;

  const setLineRef = useCallback((index: number, el: HTMLButtonElement | null) => {
    if (el) {
      lineRefs.current.set(index, el);
    } else {
      lineRefs.current.delete(index);
    }
  }, []);

  // Track user scroll to temporarily pause auto-scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isSynced) return;

    const onScroll = () => {
      isUserScrolling.current = true;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 2000);
    };

    container.addEventListener('wheel', onScroll, { passive: true });
    container.addEventListener('touchmove', onScroll, { passive: true });

    return () => {
      container.removeEventListener('wheel', onScroll);
      container.removeEventListener('touchmove', onScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [isSynced]);

  // Auto-scroll active line to center
  useEffect(() => {
    if (!isSynced || activeIndex < 0 || isUserScrolling.current) return;

    const el = lineRefs.current.get(activeIndex);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex, isSynced]);

  // Empty state
  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-foreground/20 text-sm font-jetbrains italic">
          {copy.listen.player.noLyrics}
        </p>
      </div>
    );
  }

  // Unsynced — static scrollable poetry
  if (!isSynced) {
    return (
      <div
        className="h-full overflow-y-auto px-8 md:px-16 lg:px-24"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex flex-col items-center justify-center min-h-full gap-5 py-12">
          {lyrics.map((line, i) => (
            <p
              key={i}
              className="text-center text-foreground/30 text-base md:text-lg lg:text-xl font-playfair italic leading-[1.6] max-w-3xl"
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>
    );
  }

  // Synced — immersive karaoke
  return (
    <div
      ref={scrollRef}
      className="h-full w-full overflow-y-auto px-6 md:px-12 lg:px-20"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {/* Top breathing room */}
      <div className="h-[50vh]" aria-hidden />

      <div className="flex flex-col items-center gap-6 md:gap-8">
        {lyrics.map((line, index) => {
          const isEmpty = !line.text.trim();
          const distance = activeIndex >= 0 ? index - activeIndex : index;

          if (isEmpty) {
            return <div key={index} className="h-3 md:h-5" aria-hidden />;
          }

          const isActive = index === activeIndex;
          const abs = Math.abs(distance);
          const { opacity, scale, blur, useTransform } = getLineVisuals(distance);

          // Distant lines: no animation, no GPU layers — just static opacity
          if (!useTransform) {
            return (
              <button
                key={index}
                ref={(el) => setLineRef(index, el)}
                onClick={() => onSeekToLine?.(line.time)}
                className="block w-full text-center font-playfair italic leading-[1.45] text-foreground text-lg md:text-[22px] lg:text-[26px] focus:outline-none"
                style={{ opacity }}
              >
                {line.text}
              </button>
            );
          }

          return (
            <motion.button
              key={index}
              ref={(el) => setLineRef(index, el)}
              onClick={() => onSeekToLine?.(line.time)}
              className={cn(
                'relative block w-full text-center cursor-pointer',
                'font-playfair italic leading-[1.45]',
                'focus:outline-none',
                isActive
                  ? 'text-foreground text-[22px] md:text-[28px] lg:text-[34px]'
                  : 'text-foreground text-lg md:text-[22px] lg:text-[26px]'
              )}
              animate={{
                opacity,
                scale,
                ...(blur > 0 ? { filter: `blur(${blur}px)` } : { filter: 'blur(0px)' }),
              }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 18,
                mass: 0.7,
              }}
              style={{
                willChange: abs <= 1 ? 'transform, opacity, filter' : 'auto',
              }}
            >
              {/* Burgundy radiance behind active line */}
              {isActive && (
                <span
                  className="absolute inset-0 -z-10 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse 80% 160% at 50% 50%, rgba(139,21,56,0.15) 0%, transparent 70%)',
                  }}
                />
              )}
              {line.text}
            </motion.button>
          );
        })}
      </div>

      {/* Bottom breathing room */}
      <div className="h-[50vh]" aria-hidden />
    </div>
  );
}
