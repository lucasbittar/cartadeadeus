'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { MarqueeRow } from './marquee-row';
import { LetterCard } from './letter-card';
import { copy } from '@/constants/copy';
import type { Letter } from '@/types';

async function fetchLetters(): Promise<Letter[]> {
  const response = await fetch('/api/letters');
  if (!response.ok) {
    throw new Error('Failed to fetch letters');
  }
  return response.json();
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function LettersMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const { data: letters = [] } = useQuery({
    queryKey: ['letters'],
    queryFn: fetchLetters,
    refetchInterval: 30000,
  });

  // Check for reduced motion preference on client
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Randomly select and split letters for two rows
  const { topRow, bottomRow } = useMemo(() => {
    if (letters.length === 0) {
      return { topRow: [], bottomRow: [] };
    }

    const shuffled = shuffleArray(letters);
    const selectedLetters = shuffled.slice(0, Math.min(16, shuffled.length));
    const midpoint = Math.ceil(selectedLetters.length / 2);

    return {
      topRow: selectedLetters.slice(0, midpoint),
      bottomRow: selectedLetters.slice(midpoint),
    };
  }, [letters]);

  if (letters.length === 0) {
    return (
      <section ref={sectionRef} className="py-16 md:py-24 px-4" style={{ backgroundColor: '#f0f5f3' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
            {copy.marquee.title}
          </h2>
          <p className="text-foreground/60">{copy.marquee.emptyState}</p>
        </div>
      </section>
    );
  }

  // Reduced motion: show static grid
  if (prefersReducedMotion) {
    return (
      <section
        ref={sectionRef}
        className="py-16 md:py-24 px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">
            {copy.marquee.title}
          </h2>
          <p className="text-foreground/60">{copy.marquee.subtitle}</p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {[...topRow, ...bottomRow].slice(0, 6).map((letter, index) => (
              <LetterCard key={letter.id} letter={letter} delay={index * 300} startTyping={isInView} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="pb-12 mb:py-12 overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-12 px-4"
      >
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-2">
          {copy.marquee.title}
        </h2>
        <p className="text-foreground/60">{copy.marquee.subtitle}</p>
      </motion.div>

      {/* Marquee rows */}
      <div className="space-y-6">
        {/* Top row - scrolls left */}
        {topRow.length > 0 && (
          <MarqueeRow letters={topRow} direction="left" speed={70} startTyping={isInView} />
        )}

        {/* Bottom row - scrolls right (hidden on mobile) */}
        {bottomRow.length > 0 && (
          <div className="hidden md:block">
            <MarqueeRow letters={bottomRow} direction="right" speed={80} startTyping={isInView} />
          </div>
        )}
      </div>
    </section>
  );
}
