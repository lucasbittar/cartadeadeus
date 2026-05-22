'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { copy } from '@/constants/copy';
import { parseEventDate } from '@/lib/format-date';
import type { TourDate } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

async function fetchTourDates(): Promise<TourDate[]> {
  const res = await fetch('/api/tour-dates');
  if (!res.ok) throw new Error('Failed to fetch tour dates');
  return res.json();
}

function TicketAction({ date }: { date: TourDate }) {
  if (date.status === 'cancelled') {
    return (
      <span className="font-jetbrains text-[11px] tracking-[0.18em] uppercase text-foreground/25 line-through">
        {copy.tour.cancelled}
      </span>
    );
  }

  if (date.status === 'sold_out') {
    return (
      <span className="font-jetbrains text-[11px] tracking-[0.18em] uppercase text-burgundy-300/70">
        {copy.tour.soldOut}
      </span>
    );
  }

  if (date.status === 'free') {
    const content = (
      <>
        <span className="h-1.5 w-1.5 rounded-full bg-burgundy-300" aria-hidden />
        {copy.tour.freeEntry}
      </>
    );
    // With an info link the pill is clickable; otherwise it's a static badge.
    return date.ticket_url ? (
      <a
        href={date.ticket_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 font-jetbrains text-[11px] tracking-[0.12em] uppercase whitespace-nowrap text-foreground/60 transition-all duration-300 hover:border-burgundy/40 hover:text-burgundy-200"
      >
        {content}
      </a>
    ) : (
      <span className="inline-flex items-center gap-2 rounded-full border border-foreground/10 px-5 py-2.5 font-jetbrains text-[11px] tracking-[0.12em] uppercase whitespace-nowrap text-foreground/50">
        {content}
      </span>
    );
  }

  if (!date.ticket_url) return null;

  return (
    <a
      href={date.ticket_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-burgundy/40 text-burgundy-200 font-jetbrains text-[11px] tracking-[0.12em] uppercase whitespace-nowrap hover:bg-burgundy hover:text-white hover:border-burgundy transition-all duration-300"
    >
      {copy.tour.buyTickets}
    </a>
  );
}

function TourRow({ date, index, isInView }: { date: TourDate; index: number; isInView: boolean }) {
  const parts = parseEventDate(date.event_date);
  const isCancelled = date.status === 'cancelled';
  // Shows seeded without a known start time store midnight — don't show "00:00".
  const time = parts && parts.time !== '00:00' ? parts.time : null;

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay: 0.2 + index * 0.08, ease: EASE }}
      className="border-t border-burgundy/15 last:border-b"
    >
      <div
        className={`flex items-start gap-5 py-6 md:items-center md:gap-8 md:py-7 transition-opacity ${
          isCancelled ? 'opacity-45' : ''
        }`}
      >
        {/* Date */}
        <div className="flex flex-col items-center w-12 shrink-0 md:w-16">
          <span className="font-playfair text-3xl leading-none text-foreground md:text-4xl">
            {parts?.dayNum ?? '—'}
          </span>
          <span className="mt-1.5 font-jetbrains text-[10px] tracking-[0.22em] uppercase text-burgundy-300">
            {parts?.month}
          </span>
        </div>

        <div className="hidden w-px self-stretch bg-burgundy/15 md:block" />

        {/* Venue + meta + action */}
        <div className="flex min-w-0 flex-1 flex-col md:flex-row md:items-center md:gap-8">
          <div className="min-w-0 flex-1">
            <p className="font-playfair text-lg text-foreground md:text-2xl">
              {date.venue}
            </p>
            <p className="mt-1 font-jetbrains text-[11px] tracking-[0.14em] uppercase text-foreground/40">
              {[parts?.weekday, time, date.city].filter(Boolean).join('  ·  ')}
            </p>
          </div>
          <div className="mt-4 shrink-0 md:mt-0">
            <TicketAction date={date} />
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function TourSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const { data: dates = [], isLoading } = useQuery({
    queryKey: ['tour-dates'],
    queryFn: fetchTourDates,
    refetchInterval: 60000,
  });

  // Hide the section entirely while empty so the homepage stays tight.
  if (!isLoading && dates.length === 0) return null;

  return (
    <section ref={sectionRef} className="px-6 py-20 md:py-32">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-12 text-center md:mb-16"
        >
          <p className="font-jetbrains text-[11px] tracking-[0.35em] uppercase text-burgundy-300/70">
            {copy.tour.subtitle}
          </p>
          <h2 className="mt-3 font-playfair text-4xl text-foreground text-shadow-cast md:text-5xl lg:text-6xl">
            {copy.tour.title}
          </h2>
        </motion.div>

        {isLoading ? (
          <ul>
            {[...Array(3)].map((_, i) => (
              <li key={i} className="border-t border-burgundy/15 last:border-b">
                <div className="flex items-center gap-8 py-7">
                  <div className="h-10 w-12 animate-pulse rounded bg-white/5 md:w-16" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-white/5" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {dates.map((date, index) => (
              <TourRow key={date.id} date={date} index={index} isInView={isInView} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
