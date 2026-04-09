'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerBackgroundProps {
  coverArt: string;
  trackId: string;
}

// Generate deterministic gradient positions from trackId
function getGradientVariant(trackId: string) {
  let hash = 0;
  for (let i = 0; i < trackId.length; i++) {
    hash = ((hash << 5) - hash + trackId.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(hash);

  return {
    // Primary burgundy glow position
    x1: 30 + (abs % 40),           // 30-70%
    y1: 60 + (abs % 30),           // 60-90%
    // Secondary warm accent
    x2: 50 + ((abs >> 4) % 30),    // 50-80%
    y2: 20 + ((abs >> 8) % 30),    // 20-50%
    // Tertiary cool accent
    x3: 10 + ((abs >> 12) % 40),   // 10-50%
    y3: 30 + ((abs >> 16) % 40),   // 30-70%
  };
}

export function PlayerBackground({ trackId }: PlayerBackgroundProps) {
  const v = useMemo(() => getGradientVariant(trackId), [trackId]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={trackId}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            background: [
              // Base: very subtle warm shift from pure black
              'radial-gradient(ellipse 120% 80% at 50% 100%, rgba(139,21,56,0.08) 0%, transparent 60%)',
              // Primary: burgundy stage glow from below
              `radial-gradient(ellipse 80% 50% at ${v.x1}% ${v.y1}%, rgba(139,21,56,0.12) 0%, transparent 70%)`,
              // Secondary: warm accent — like a distant amber spot
              `radial-gradient(ellipse 60% 40% at ${v.x2}% ${v.y2}%, rgba(100,20,40,0.06) 0%, transparent 60%)`,
              // Tertiary: cooler undertone for depth
              `radial-gradient(ellipse 50% 50% at ${v.x3}% ${v.y3}%, rgba(20,15,30,0.15) 0%, transparent 50%)`,
            ].join(', '),
          }}
        />
      </AnimatePresence>

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />
    </div>
  );
}
