'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { copy } from '@/constants/copy';
import { Button } from '@/components/ui/button';
import { useLetterStore } from '@/store/letter-store';

export function HeroSection() {
  const setFormModalOpen = useLetterStore((state) => state.setFormModalOpen);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-end text-center px-4 pb-32 md:pb-40">
      {/* Floating text content - positioned in the lower third */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="relative max-w-3xl mx-auto z-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          className="text-burgundy font-medium tracking-[0.3em] uppercase text-xs md:text-sm mb-5"
          style={{
            textShadow: '0 2px 10px rgba(255,255,255,0.8)',
          }}
        >
          {copy.hero.albumInfo}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-5 tracking-tight"
          style={{
            textShadow: `
              0 2px 20px rgba(255,255,255,0.9),
              0 4px 40px rgba(255,255,255,0.6),
              0 0 80px rgba(255,255,255,0.4)
            `,
          }}
        >
          {copy.site.title}
        </motion.h1>

        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="font-playfair text-lg md:text-2xl text-foreground/70 italic mb-10"
          style={{
            textShadow: '0 2px 15px rgba(255,255,255,0.8)',
          }}
        >
          {copy.hero.quote}
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          <Button
            size="lg"
            onClick={() => setFormModalOpen(true)}
            className="shadow-xl shadow-burgundy/25 hover:shadow-2xl hover:shadow-burgundy/30 transition-all duration-300 hover:scale-105"
          >
            {copy.hero.cta}
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span
            className="text-foreground/50 text-xs uppercase tracking-[0.2em]"
            style={{ textShadow: '0 1px 8px rgba(255,255,255,0.8)' }}
          >
            Explorar
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground/40"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
