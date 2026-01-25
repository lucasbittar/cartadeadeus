'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CountdownTimer } from './countdown-timer';
import { copy } from '@/constants/copy';

export function CountdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 lg:py-32 px-4"
    >
      <div className="max-w-5xl mx-auto">
        {/* Date announcement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0 }}
          className="text-center mb-4 md:mb-6"
        >
          <span className="inline-flex items-center gap-3 text-burgundy text-sm md:text-base tracking-[0.2em] uppercase font-medium">
            <span className="text-burgundy/40">&#10022;</span>
            {copy.countdown.date}
            <span className="text-burgundy/40">&#10022;</span>
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="font-playfair text-2xl md:text-3xl lg:text-4xl italic text-foreground/80">
            &ldquo;{copy.countdown.tagline}&rdquo;
          </p>
        </motion.div>

        {/* Countdown timer */}
        {isInView && <CountdownTimer />}

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-10 md:mt-14"
        >
          <p className="text-foreground/50 text-sm md:text-base">
            {copy.countdown.subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
