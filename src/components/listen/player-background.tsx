'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerBackgroundProps {
  coverArt: string;
  trackId: string;
}

export function PlayerBackground({ coverArt, trackId }: PlayerBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={trackId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <Image
            src={coverArt}
            alt=""
            fill
            className="object-cover blur-3xl scale-110"
            priority
          />
        </motion.div>
      </AnimatePresence>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/70" />
      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />
    </div>
  );
}
