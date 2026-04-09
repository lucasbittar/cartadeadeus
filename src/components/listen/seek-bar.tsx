'use client';

import { useCallback, useRef } from 'react';

interface SeekBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function SeekBar({ currentTime, duration, onSeek }: SeekBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      const bar = barRef.current;
      if (!bar || !duration) return;

      const rect = bar.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  return (
    <div className="w-full px-1">
      {/* Bar */}
      <div
        ref={barRef}
        className="group relative w-full h-6 flex items-center cursor-pointer"
        onClick={handleSeek}
        onTouchStart={handleSeek}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
      >
        <div className="w-full h-1 group-hover:h-1.5 group-active:h-1.5 bg-foreground/10 rounded-full transition-all overflow-hidden">
          <div
            className="h-full bg-burgundy rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Times */}
      <div className="flex justify-between px-0.5 -mt-1">
        <span className="font-jetbrains text-[10px] text-foreground/40">
          {formatTime(currentTime)}
        </span>
        <span className="font-jetbrains text-[10px] text-foreground/40">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
