'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { copy } from '@/constants/copy';
import { youTubeThumbnail, youTubeEmbedUrl } from '@/lib/youtube';
import type { Video } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

async function fetchVideos(): Promise<Video[]> {
  const res = await fetch('/api/videos');
  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

function PlayIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function VideoLightbox({ video, onClose }: { video: Video; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label={copy.videos.closeLabel}
        className="absolute right-5 top-5 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`${youTubeEmbedUrl(video.youtube_id)}?autoplay=1&rel=0`}
          title={video.title ?? 'YouTube video'}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </motion.div>
  );
}

export function VideosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [active, setActive] = useState<Video | null>(null);

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    refetchInterval: 60000,
  });

  // Hide the section entirely while empty so the homepage stays tight.
  if (!isLoading && videos.length === 0) return null;

  return (
    <section ref={sectionRef} className="overflow-hidden py-20 md:py-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mx-auto mb-12 max-w-3xl px-6 text-center md:mb-16"
      >
        <p className="font-jetbrains text-[11px] tracking-[0.35em] uppercase text-burgundy-300/70">
          {copy.videos.subtitle}
        </p>
        <h2 className="mt-3 font-playfair text-4xl text-foreground text-shadow-cast md:text-5xl lg:text-6xl">
          {copy.videos.title}
        </h2>
      </motion.div>

      {/* Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 md:gap-6"
      >
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-video w-[280px] flex-shrink-0 animate-pulse rounded-lg border border-white/[0.06] bg-white/5 md:w-[360px]"
              />
            ))
          : videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setActive(video)}
                className="group block w-[280px] flex-shrink-0 snap-start text-left md:w-[360px]"
              >
                <div className="relative aspect-video overflow-hidden rounded-lg border border-white/[0.08]">
                  <Image
                    src={youTubeThumbnail(video.youtube_id)}
                    alt={video.title ?? ''}
                    fill
                    sizes="360px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-burgundy/90 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <PlayIcon className="ml-0.5 h-6 w-6" />
                    </span>
                  </div>
                </div>
                {video.title && (
                  <p className="mt-3 line-clamp-2 font-playfair text-base text-foreground/80 transition-colors group-hover:text-foreground">
                    {video.title}
                  </p>
                )}
              </button>
            ))}
      </motion.div>

      <AnimatePresence>
        {active && <VideoLightbox video={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
