'use client';

import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { LetterCard } from './letter-card';
import type { Letter } from '@/types';

interface MarqueeRowProps {
  letters: Letter[];
  direction?: 'left' | 'right';
  speed?: number; // pixels per second
  startTyping?: boolean;
}

export function MarqueeRow({
  letters,
  direction = 'left',
  speed = 30,
  startTyping = false,
}: MarqueeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Double the letters for seamless looping
  const doubleLetters = useMemo(() => {
    return [...letters, ...letters];
  }, [letters]);

  // Auto-scroll animation
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isPaused || letters.length === 0) return;

    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const scrollAmount = speed * delta;

      if (direction === 'left') {
        container.scrollLeft += scrollAmount;
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft = 0;
        }
      } else {
        container.scrollLeft -= scrollAmount;
        if (container.scrollLeft <= 0) {
          container.scrollLeft = container.scrollWidth / 2;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused, direction, speed, letters.length]);

  const pauseWithDelay = useCallback(() => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 3000);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    startXRef.current = e.pageX;
    scrollStartRef.current = scrollRef.current.scrollLeft;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const walk = (e.pageX - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollStartRef.current - walk;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    pauseWithDelay();
  }, [pauseWithDelay]);

  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
  }, []);

  const handleContainerMouseLeave = useCallback(() => {
    setIsDragging(false);
    setIsPaused(false);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    startXRef.current = e.touches[0].pageX;
    scrollStartRef.current = scrollRef.current.scrollLeft;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const walk = (e.touches[0].pageX - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollStartRef.current - walk;
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    pauseWithDelay();
  }, [pauseWithDelay]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`
        flex items-start gap-6 overflow-x-auto pb-4 select-none
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {doubleLetters.map((letter, index) => (
        <LetterCard
          key={`${letter.id}-${index}`}
          letter={letter}
          startTyping={startTyping}
        />
      ))}
    </div>
  );
}
