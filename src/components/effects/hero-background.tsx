'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export function HeroBackground() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();

  // Parallax effect - image moves UP when scrolling down (negative value)
  const y = useTransform(scrollY, [0, 1000], [0, -150]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.05]);

  // Image fades out as user scrolls for better text readability
  const imageOpacity = useTransform(scrollY, [0, 400, 700], [1, 0.6, 0.2]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient fallback - matching the mint tone */}
      <div className="absolute inset-0 bg-[#f0f5f3]" />

      {/* Main background image with parallax and fade */}
      <motion.div
        className="absolute inset-0 w-full h-[130vh] -top-[10vh]"
        style={{ y, scale, opacity: imageOpacity }}
      >
        <Image
          src="/fresno-bg.jpg"
          alt=""
          fill
          priority
          quality={90}
          className={`
            object-cover object-top
            transition-opacity duration-1000 ease-out
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={() => setIsLoaded(true)}
          sizes="100vw"
        />
      </motion.div>

      {/* Cinematic overlays for depth and text readability */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.05) 100%)'
          }}
        />
      </div>

      {/* Bottom fade to mint for seamless content transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50vh] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(240,245,243,0.5) 40%, rgba(240,245,243,0.85) 70%, #f0f5f3 100%)'
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
}
