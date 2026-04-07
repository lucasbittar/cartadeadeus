'use client';

import { copy } from '@/constants/copy';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

function SpeakerIcon({ volume, isMuted }: { volume: number; isMuted: boolean }) {
  if (isMuted || volume === 0) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/50">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/50">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

export function VolumeControl({ volume, isMuted, onVolumeChange, onToggleMute }: VolumeControlProps) {
  const displayVolume = isMuted ? 0 : volume;

  return (
    <div className="hidden lg:flex items-center gap-2">
      <button
        onClick={onToggleMute}
        className="p-1"
        aria-label={isMuted ? copy.listen.player.volume : copy.listen.player.mute}
      >
        <SpeakerIcon volume={volume} isMuted={isMuted} />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={displayVolume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-24 h-1 accent-burgundy bg-foreground/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-burgundy"
        aria-label={copy.listen.player.volume}
      />
    </div>
  );
}
