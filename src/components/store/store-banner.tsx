'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { copy } from '@/constants/copy';
import { config } from '@/constants/config';

const EASE = [0.22, 1, 0.36, 1] as const;

export function StoreBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} className="px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-burgundy/20 bg-gradient-to-br from-burgundy-900/50 via-burgundy-900/10 to-transparent px-8 py-12 md:px-14 md:py-14"
      >
        {/* Burgundy glow accent */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-burgundy/20 blur-3xl" />

        <div className="relative flex flex-col items-center gap-7 text-center md:flex-row md:justify-between md:gap-10 md:text-left">
          <div>
            <p className="font-jetbrains text-[11px] tracking-[0.35em] uppercase text-burgundy-300">
              {copy.store.eyebrow}
            </p>
            <h3 className="mt-3 font-playfair text-3xl text-foreground text-shadow-cast md:text-4xl">
              {copy.store.headline}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/50">
              {copy.store.body}
            </p>
          </div>

          <a
            href={config.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-burgundy px-7 py-3.5 font-jetbrains text-[11px] tracking-[0.14em] uppercase text-white transition-all duration-300 hover:scale-[1.03] hover:bg-burgundy-400"
          >
            {copy.store.cta}
            <span aria-hidden>→</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
