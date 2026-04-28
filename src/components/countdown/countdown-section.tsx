'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { copy } from '@/constants/copy';

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function DeezerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.81 4.16v3.03H24V4.16h-5.19zM6.27 8.38v3.027h5.189V8.38H6.27zm12.54 0v3.027H24V8.38h-5.19zM6.27 12.594v3.027h5.189v-3.027H6.27zm6.271 0v3.027h5.19v-3.027h-5.19zm6.27 0v3.027H24v-3.027h-5.19zM0 16.81v3.029h5.19v-3.03H0zm6.27 0v3.029h5.189v-3.03H6.27zm6.271 0v3.029h5.19v-3.03h-5.19zm6.27 0v3.029H24v-3.03h-5.19z" />
    </svg>
  );
}

export function CountdownSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 lg:py-40 px-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Decorative top line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center mb-16 md:mb-20"
        >
          <div className="w-full max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-burgundy/40 to-transparent" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-playfair text-4xl md:text-5xl lg:text-6xl text-center text-foreground text-shadow-cast leading-[1.15]"
        >
          {copy.albumRelease.headline}
        </motion.h2>

        {/* Album artwork + title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center mt-12 md:mt-16"
        >
          <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-md overflow-hidden shadow-2xl shadow-black/50">
            <Image
              src="/album-artwork.webp"
              alt="Carta de Adeus"
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <p className="font-playfair text-xl md:text-2xl text-foreground/80 italic">
              Carta de Adeus
            </p>
            <p className="font-jetbrains text-[11px] tracking-[0.25em] uppercase text-foreground/30 mt-2">
              Fresno
            </p>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center text-foreground/40 text-sm md:text-base mt-8 md:mt-10"
        >
          {copy.albumRelease.subtitle}
        </motion.p>

        {/* Streaming links */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-4 mt-10 md:mt-12"
        >
          <a
            href={copy.albumRelease.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-6 py-3 rounded-full border border-foreground/10 text-foreground/60 hover:border-[#1DB954]/40 hover:text-[#1DB954] transition-all duration-300"
          >
            <SpotifyIcon />
            <span className="font-jetbrains text-xs tracking-[0.1em] uppercase">
              {copy.albumRelease.spotify}
            </span>
          </a>

          <a
            href={copy.albumRelease.deezerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-6 py-3 rounded-full border border-foreground/10 text-foreground/60 hover:border-burgundy/40 hover:text-burgundy transition-all duration-300"
          >
            <DeezerIcon />
            <span className="font-jetbrains text-xs tracking-[0.1em] uppercase">
              {copy.albumRelease.deezer}
            </span>
          </a>
        </motion.div>

        {/* Decorative bottom line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center mt-16 md:mt-20"
        >
          <div className="w-full max-w-[200px] h-[1px] bg-gradient-to-r from-transparent via-burgundy/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
