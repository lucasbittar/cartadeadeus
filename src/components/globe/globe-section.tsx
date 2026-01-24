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
      <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center">
        <div className="text-foreground/50 text-sm animate-pulse">
          {copy.globe.loading}
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
    <section className="relative py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-8"
      >
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-4">
          {copy.globe.title}
        </h2>
        <p className="text-foreground/60">
          {letters.length > 0
            ? `${letters.length} carta${letters.length !== 1 ? 's' : ''} enviada${letters.length !== 1 ? 's' : ''}`
            : copy.globe.emptyState}
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
