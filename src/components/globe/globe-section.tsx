'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useLetterStore } from '@/store/letter-store';
import { copy } from '@/constants/copy';
import type { Letter } from '@/types';

const GlobeScene = dynamic(
  () => import('./globe-scene').then((mod) => mod.GlobeScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] md:h-[1000px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-burgundy/20 border-t-burgundy animate-spin" />
          <div className="text-foreground/40 text-xs">
            {copy.globe.loading}
          </div>
        </div>
      </div>
    ),
  }
);

async function fetchLetters(): Promise<Letter[]> {
  const response = await fetch('/api/letters');
  if (!response.ok) {
    throw new Error('Failed to fetch letters');
  }
  return response.json();
}

export function GlobeSection() {
  const setSelectedLetter = useLetterStore((state) => state.setSelectedLetter);

  const { data: letters = [], isLoading } = useQuery({
    queryKey: ['letters'],
    queryFn: fetchLetters,
    refetchInterval: 30000,
  });

  return (
    <section className="relative py-16 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
          {copy.globe.title}
        </h2>
        <p className="text-foreground/60">
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border border-foreground/20 border-t-foreground/60 animate-spin" />
              {copy.globe.loading}
            </span>
          ) : letters.length > 0 ? (
            `${letters.length} carta${letters.length !== 1 ? 's' : ''} enviada${letters.length !== 1 ? 's' : ''}`
          ) : (
            copy.globe.emptyState
          )}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <GlobeScene
          letters={letters}
          onLetterClick={setSelectedLetter}
        />
      </motion.div>
    </section>
  );
}
