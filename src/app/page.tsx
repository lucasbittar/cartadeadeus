'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/hero/hero-section';
import { GlobeSection } from '@/components/globe/globe-section';
import { LetterModal } from '@/components/letter/letter-modal';
import { LetterPreviewModal } from '@/components/letter/letter-preview';
import { ShareModal } from '@/components/share/share-modal';
import { copy } from '@/constants/copy';

const HeroBackground = dynamic(
  () =>
    import('@/components/effects/hero-background').then(
      (mod) => mod.HeroBackground
    ),
  { ssr: false }
);

const FallingPapers = dynamic(
  () =>
    import('@/components/effects/falling-papers').then(
      (mod) => mod.FallingPapers
    ),
  { ssr: false }
);

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

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Cinematic background with parallax */}
      <div className="fixed inset-0 z-0">
        <HeroBackground />
      </div>

      {/* Falling papers effect */}
      <FallingPapers count={40} />

      {/* Main content */}
      <div className="relative z-20">
        <HeroSection />

        {/* Globe section with matching mint background */}
        <div
          className="relative"
          style={{ backgroundColor: 'transparent' }}
        >
          <GlobeSection />

          {/* Letters marquee section */}
          <LettersMarquee />

          {/* Countdown section */}
          <CountdownSection />

          <footer
            className="py-12 text-center"
            style={{ backgroundColor: '#f0f5f3' }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <p className="text-foreground/40 text-sm">
                {copy.social.hashtag} · {copy.social.fresnoHandle} · {copy.social.lucasHandle}
              </p>
              <p className="text-foreground/30 text-xs">
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
