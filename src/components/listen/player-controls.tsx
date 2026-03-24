'use client';

import { motion } from 'framer-motion';
import type { PlayerStatus, RepeatMode } from '@/types/listen';
import { copy } from '@/constants/copy';

interface PlayerControlsProps {
  status: PlayerStatus;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  onTogglePlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
}

function ShuffleIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-burgundy' : 'text-foreground/50'}>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-foreground/80">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-foreground/80">
      <path d="M16 6h2v12h-2zm-10 0 8.5 6L6 18z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-1">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-white">
      <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
    </svg>
  );
}

function RepeatIcon({ mode }: { mode: RepeatMode }) {
  const active = mode !== 'off';
  return (
    <div className="relative">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-burgundy' : 'text-foreground/50'}>
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
      {mode === 'one' && (
        <span className="absolute -top-1 -right-1 text-[8px] font-jetbrains text-burgundy font-bold">1</span>
      )}
    </div>
  );
}

export function PlayerControls({
  status,
  isShuffled,
  repeatMode,
  onTogglePlayPause,
  onPrevious,
  onNext,
  onToggleShuffle,
  onCycleRepeat,
}: PlayerControlsProps) {
  const isPlaying = status === 'playing';

  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={onToggleShuffle}
        className="p-2 transition-colors"
        aria-label={copy.listen.player.shuffle}
      >
        <ShuffleIcon active={isShuffled} />
      </button>

      <button
        onClick={onPrevious}
        className="p-2 hover:scale-105 active:scale-95 transition-transform"
        aria-label={copy.listen.player.previous}
      >
        <PrevIcon />
      </button>

      <motion.button
        onClick={onTogglePlayPause}
        className="w-14 h-14 rounded-full bg-burgundy flex items-center justify-center hover:bg-burgundy-600 transition-colors"
        whileTap={{ scale: 0.93 }}
        animate={isPlaying ? { scale: [1, 1.03, 1] } : {}}
        transition={isPlaying ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
        aria-label={isPlaying ? copy.listen.player.pause : copy.listen.player.play}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </motion.button>

      <button
        onClick={onNext}
        className="p-2 hover:scale-105 active:scale-95 transition-transform"
        aria-label={copy.listen.player.next}
      >
        <NextIcon />
      </button>

      <button
        onClick={onCycleRepeat}
        className="p-2 transition-colors"
        aria-label={
          repeatMode === 'one'
            ? copy.listen.player.repeatOne
            : copy.listen.player.repeat
        }
      >
        <RepeatIcon mode={repeatMode} />
      </button>
    </div>
  );
}
