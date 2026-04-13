'use client';

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/hero/hero-section';
import { GlobeSection } from '@/components/globe/globe-section';
import { LetterModal } from '@/components/letter/letter-modal';
import { LetterPreviewModal } from '@/components/letter/letter-preview';
import { ShareModal } from '@/components/share/share-modal';
import { copy } from '@/constants/copy';

const LettersMarquee = dynamic(
  () =>
    import('@/components/letters').then(
      (mod) => mod.LettersMarquee
    ),
  { ssr: false }
);

const CountdownSection = dynamic(
  () =>
    import('@/components/countdown').then(
      (mod) => mod.CountdownSection
    ),
  { ssr: false }
);

const NOISE_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0D0D0F]">
      {/* ——— Fixed backdrop: car + vignette + bottom gradient + noise ——— */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
      >
        {/* Car image — desktop */}
        <Image
          src="/car-bg-v2.jpg"
          alt=""
          fill
          priority
          quality={90}
          className="hidden md:block object-cover object-center"
          sizes="100vw"
        />

        {/* Car image — mobile (portrait, car at bottom) */}
        <Image
          src="/car-bg-mobile-v5.jpg"
          alt=""
          fill
          priority
          quality={90}
          className="block md:hidden object-cover object-bottom"
          sizes="100vw"
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%)',
          }}
        />

      </div>

      {/* Fixed noise texture (separate so it doesn't dim) */}
      <div
        className="fixed inset-0 z-[1] opacity-[0.025] pointer-events-none mix-blend-soft-light"
        style={{ backgroundImage: NOISE_URL, backgroundRepeat: 'repeat' }}
      />

      {/* Main content */}
      <div className="relative z-20">
        <HeroSection />

        {/* Globe section with matching mint background */}
        <div id="content" className="relative">
          <GlobeSection />

          {/* Letters marquee section */}
          <LettersMarquee />

          {/* Countdown section */}
          <CountdownSection />

          <footer className="relative py-16 md:py-20 overflow-hidden bg-[#1A1A1A]">
            {/* Subtle texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Burgundy glow at top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-burgundy/40 to-transparent" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-w-2xl mx-auto px-6 text-center"
            >
              {/* Decorative flourish */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="block w-12 h-[1px] bg-gradient-to-r from-transparent to-burgundy/30" />
                <span className="text-burgundy/60 text-4xl">&#10087;</span>
                <span className="block w-12 h-[1px] bg-gradient-to-l from-transparent to-burgundy/30" />
              </div>

              {/* Personal dedication */}
              <p className="font-playfair text-white/70 leading-relaxed mb-8">
                Criado por{' '}
                <a
                  href="https://lucasbittar.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-burgundy transition-colors duration-300 underline decoration-burgundy/30 underline-offset-4 hover:decoration-burgundy"
                >
                  Lucas Bittar
                </a>
              </p>

              {/* Social handles */}
              <div className="flex items-center justify-center gap-2 text-white/30 text-sm mb-6">
                <span className="hover:text-burgundy/60 transition-colors cursor-default">{copy.social.hashtag}</span>
                <span className="text-burgundy/40">·</span>
                <span className="hover:text-burgundy/60 transition-colors cursor-default">{copy.social.fresnoHandle}</span>
              </div>

              {/* Legal links */}
              <div className="flex items-center justify-center gap-3 text-white/30 text-xs mb-4">
                <a
                  href="/terms"
                  className="hover:text-white/50 transition-colors"
                >
                  Termos de Uso
                </a>
                <span className="text-burgundy/40">·</span>
                <a
                  href="/privacy"
                  className="hover:text-white/50 transition-colors"
                >
                  Política de Privacidade
                </a>
              </div>

              {/* Copyright */}
              <p className="text-white/20 text-xs tracking-wide">
                © {new Date().getFullYear()} Fresno. Todos os direitos reservados.
              </p>
            </motion.div>
          </footer>
        </div>
      </div>

      <LetterModal />
      <LetterPreviewModal />
      <ShareModal />
    </main>
  );
}
