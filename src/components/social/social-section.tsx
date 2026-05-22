'use client';

import React, { Component, useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { EmbeddedTweet } from 'react-tweet';
import type { Tweet as TweetData } from 'react-tweet/api';
import { copy } from '@/constants/copy';
import { config } from '@/constants/config';

const EASE = [0.22, 1, 0.36, 1] as const;

interface NewsItem {
  id: string;
  tweet_id: string;
  tweet_url: string;
  data: TweetData | null;
}

async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch('/api/tweets');
  if (!res.ok) throw new Error('Failed to fetch tweets');
  return res.json();
}

/**
 * Catches render failures from a single EmbeddedTweet so the rest of the
 * section keeps working. react-tweet's `enrichTweet` has crashed in the past
 * on tweets where syndication returns missing/null entity arrays — we also
 * sanitize server-side, but this is the safety net.
 */
class TweetErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Tweet failed to render:', error.message);
    }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function TweetFallback({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl border border-white/[0.06] bg-white/[0.015] px-5 py-6 transition-colors hover:border-burgundy/30"
    >
      <p className="font-jetbrains text-[10px] tracking-[0.18em] uppercase text-burgundy-300/70">
        {copy.news.unavailable}
      </p>
      <p className="mt-2 font-jetbrains text-xs text-foreground/60">
        {copy.news.viewOnX} →
      </p>
    </a>
  );
}

export function SocialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['tweets'],
    queryFn: fetchNews,
    refetchInterval: 5 * 60 * 1000, // news doesn't change fast — 5 min is plenty
  });

  // Drop anything we couldn't resolve (deleted / private tweets).
  const visible = items.filter((item): item is NewsItem & { data: TweetData } => item.data !== null);

  // Hide the section entirely while empty so the homepage stays tight.
  if (!isLoading && visible.length === 0) return null;

  return (
    <section ref={sectionRef} className="px-6 py-20 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="font-jetbrains text-[11px] tracking-[0.35em] uppercase text-burgundy-300/70">
            {copy.news.subtitle}
          </p>
          <h2 className="mt-3 font-playfair text-4xl text-foreground text-shadow-cast md:text-5xl lg:text-6xl">
            {copy.news.title}
          </h2>
        </motion.div>

        {/* Masonry-style grid via CSS multi-column — tweets vary in height. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="columns-1 gap-5 md:columns-2 lg:columns-3"
        >
          {isLoading
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="mb-5 h-56 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] break-inside-avoid"
                />
              ))
            : visible.map((item) => (
                <div key={item.id} className="mb-5 break-inside-avoid">
                  <TweetErrorBoundary fallback={<TweetFallback url={item.tweet_url} />}>
                    <EmbeddedTweet tweet={item.data} />
                  </TweetErrorBoundary>
                </div>
              ))}
        </motion.div>

        <div className="mt-12 text-center">
          <a
            href={`https://x.com/${config.xHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-jetbrains text-[11px] tracking-[0.18em] uppercase text-foreground/40 transition-colors hover:text-burgundy-200"
          >
            {copy.news.viewOnX} @{config.xHandle}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
