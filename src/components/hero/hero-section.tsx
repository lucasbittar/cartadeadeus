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
    <section className="relative min-h-[100dvh] overflow-hidden">
      {/* ——— Content ——— */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center">
        {/* Top: Logo */}
        <motion.div
          className="flex flex-col items-center pt-10 md:pt-16 lg:pt-20"
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
              className="max-w-[120px] md:max-w-[380px] lg:max-w-[500px] w-auto h-auto"
            />
          </motion.div>
        </motion.div>

        {/* Desktop spacer — pushes text+CTA to bottom */}
        <div className="hidden md:block md:flex-1" />

        {/* Bottom cluster: Album badge + Text + CTA */}
        <motion.div
          className="flex flex-col items-center px-6 mt-4 md:mt-0 md:pb-28"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            className="text-white/80 text-[10px] md:text-xs font-medium tracking-[0.35em] uppercase mb-4 md:mb-6 text-shadow-cast"
          >
            {copy.hero.albumInfo}
          </motion.p>

          <div className="max-w-[280px] md:max-w-xl lg:max-w-2xl mx-auto text-center space-y-3 md:space-y-5">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-playfair text-lg md:text-2xl lg:text-4xl text-white italic leading-snug md:leading-snug text-shadow-cast"
            >
              {copy.hero.headline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.0,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-playfair text-sm md:text-base lg:text-xl text-white italic leading-relaxed text-shadow-cast"
            >
              {copy.hero.body}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.2,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-playfair text-sm md:text-base lg:text-lg text-white italic leading-relaxed text-shadow-cast"
            >
              {copy.hero.closing}
            </motion.p>
          </div>

          {/* CTA — on desktop sits right below text; on mobile hidden here */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7 }}
            className="hidden md:block mt-10"
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

        {/* Mobile spacer — lets the car image breathe */}
        <div className="flex-1 md:hidden" />

        {/* Mobile CTA — anchored near bottom */}
        <motion.div
          className="pb-16 md:hidden"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7 }}
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
        transition={{ delay: 2.2, duration: 1 }}
        style={{ opacity: scrollIndicatorOpacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
        onClick={handleScrollDown}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/60"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
