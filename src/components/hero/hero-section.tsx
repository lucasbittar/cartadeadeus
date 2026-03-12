'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { copy } from '@/constants/copy';
import { Button } from '@/components/ui/button';
import { useLetterStore } from '@/store/letter-store';

export function HeroSection() {
  const setFormModalOpen = useLetterStore((state) => state.setFormModalOpen);
  const { scrollY } = useScroll();

  // Logo: exits faster
  const logoY = useTransform(scrollY, [0, 600], [0, -180]);
  const logoOpacity = useTransform(scrollY, [0, 450], [1, 0]);

  // Bottom text: medium speed exit
  const textY = useTransform(scrollY, [0, 600], [0, -90]);
  const textOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Scroll indicator: fades out quickly
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 200], [1, 0]);

  const handleScrollDown = () => {
    document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* ——— Content ——— */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between">
        {/* Top: Logo */}
        <motion.div
          className="flex flex-col items-center pt-12 md:pt-16 lg:pt-20"
          style={{ y: logoY, opacity: logoOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.4,
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h1 className="sr-only">Carta de Adeus</h1>
            <Image
              src="/cda-logo.png"
              alt="Carta de Adeus"
              width={550}
              height={370}
              priority
              className="max-w-[240px] md:max-w-[380px] lg:max-w-[500px] w-auto h-auto"
            />
          </motion.div>
        </motion.div>

        {/* Spacer — the car image fills the middle naturally */}
        <div className="flex-1" />

        {/* Bottom cluster: Album badge + Description + CTA */}
        <motion.div
          className="flex flex-col items-center pb-20 md:pb-28 px-6"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            className="text-foreground/50 text-[10px] md:text-xs font-medium tracking-[0.35em] uppercase mb-5 md:mb-6"
            style={{ textShadow: '0 1px 8px rgba(240,245,243,0.9)' }}
          >
            {copy.hero.albumInfo}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-playfair text-base md:text-xl lg:text-2xl text-foreground/65 italic max-w-lg md:max-w-2xl mx-auto mb-8 text-center leading-relaxed"
            style={{
              textShadow:
                '0 1px 12px rgba(240,245,243,0.95), 0 2px 24px rgba(240,245,243,0.6)',
            }}
          >
            {copy.hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.7 }}
          >
            <Button
              size="lg"
              onClick={() => setFormModalOpen(true)}
              className="shadow-xl shadow-burgundy/20 hover:shadow-2xl hover:shadow-burgundy/30 transition-all duration-300 hover:scale-105"
            >
              {copy.hero.cta}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* ——— Scroll indicator ——— */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        onClick={handleScrollDown}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span
            className="text-foreground/40 text-xs uppercase tracking-[0.2em]"
            style={{ textShadow: '0 1px 8px rgba(240,245,243,0.9)' }}
          >
            Explorar
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground/30"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
