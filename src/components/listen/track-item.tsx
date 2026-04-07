'use client';

import { cn } from '@/lib/utils';
import type { Track } from '@/types/listen';

interface TrackItemProps {
  track: Track;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function EqualizerBars() {
  return (
    <div className="flex items-end gap-[2px] h-3 w-3">
      <div className="w-[3px] bg-burgundy rounded-sm animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0s' }} />
      <div className="w-[3px] bg-burgundy rounded-sm animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }} />
      <div className="w-[3px] bg-burgundy rounded-sm animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
    </div>
  );
}

export function TrackItem({ track, isActive, isPlaying, onClick }: TrackItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-foreground/5 rounded-lg',
        isActive && 'border-l-2 border-burgundy bg-foreground/[0.03]'
      )}
    >
      {/* Track number or equalizer */}
      <div className="w-6 flex-shrink-0 flex justify-center">
        {isActive && isPlaying ? (
          <EqualizerBars />
        ) : (
          <span className={cn(
            'font-jetbrains text-xs',
            isActive ? 'text-burgundy' : 'text-foreground/30'
          )}>
            {String(track.number).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Title */}
      <span className={cn(
        'flex-1 text-sm truncate',
        isActive ? 'text-burgundy font-medium' : 'text-foreground/80'
      )}>
        {track.title}
      </span>

      {/* Duration */}
      <span className="font-jetbrains text-xs text-foreground/30 flex-shrink-0">
        {formatDuration(track.duration)}
      </span>
    </button>
  );
}
