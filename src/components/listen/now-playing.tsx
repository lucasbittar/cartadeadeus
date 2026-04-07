'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Track, Album } from '@/types/listen';

interface NowPlayingProps {
  track: Track;
  album: Album;
}

export function NowPlaying({ track, album }: NowPlayingProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Album art */}
      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="relative w-[60vw] max-w-[320px] aspect-square rounded-lg overflow-hidden shadow-2xl shadow-black/40"
        >
          <Image
            src={album.coverArt}
            alt={album.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Track info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center w-full px-4"
        >
          <h2 className="font-playfair text-xl md:text-2xl text-foreground truncate">
            {track.title}
          </h2>
          <p className="text-foreground/50 text-sm mt-1">{track.artist}</p>
          <p className="font-jetbrains text-foreground/30 text-xs mt-2">
            {String(track.number).padStart(2, '0')} / {String(12).padStart(2, '0')}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
