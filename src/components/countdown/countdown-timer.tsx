'use client';

import React, { useState, useEffect } from 'react';
import { CountdownUnit } from './countdown-unit';
import { ShareButton } from './share-button';
import { copy } from '@/constants/copy';

// April 18, 2026 at 21:00 (9 PM, São Paulo timezone)
const TARGET_DATE = new Date('2026-04-18T21:00:00-03:00');

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(): TimeRemaining {
  const now = new Date();
  const difference = TARGET_DATE.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(calculateTimeRemaining);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Prevent hydration mismatch by showing initial state only after mount
  const displayTime = isMounted ? timeRemaining : { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };

  if (timeRemaining.isExpired) {
    return (
      <div className="text-center">
        <p className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-burgundy italic">
          {copy.countdown.expired}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-12">
      {/* Countdown units - 2x2 grid on mobile, row on desktop */}
      <div className="grid grid-cols-2 md:flex md:justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
        <CountdownUnit
          value={displayTime.days}
          label={copy.countdown.units.days}
          delay={0.3}
        />
        <CountdownUnit
          value={displayTime.hours}
          label={copy.countdown.units.hours}
          delay={0.4}
        />
        <CountdownUnit
          value={displayTime.minutes}
          label={copy.countdown.units.minutes}
          delay={0.5}
        />
        <CountdownUnit
          value={displayTime.seconds}
          label={copy.countdown.units.seconds}
          delay={0.6}
        />
      </div>

      {/* Share button */}
      <ShareButton
        days={displayTime.days}
        hours={displayTime.hours}
        minutes={displayTime.minutes}
        delay={0.8}
      />
    </div>
  );
}
