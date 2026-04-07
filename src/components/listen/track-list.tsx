'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { copy } from '@/constants/copy';
import type { Track, PlayerStatus } from '@/types/listen';
import { TrackItem } from './track-item';

interface TrackListProps {
  tracks: Track[];
  currentTrackId: string | null;
  status: PlayerStatus;
  onSelectTrack: (track: Track) => void;
  // Mobile bottom sheet props
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export function TrackList({
  tracks,
  currentTrackId,
  status,
  onSelectTrack,
  isOpen = true,
  onClose,
  isMobile = false,
}: TrackListProps) {
  const content = (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/[0.06]">
        <h3 className="text-xs uppercase tracking-[0.2em] text-foreground/40 font-jetbrains">
          {copy.listen.player.tracklist}
        </h3>
        {isMobile && onClose && (
          <button onClick={onClose} className="text-foreground/40 p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      <div className="overflow-y-auto flex-1 py-1">
        {tracks.map((track) => (
          <TrackItem
            key={track.id}
            track={track}
            isActive={track.id === currentTrackId}
            isPlaying={track.id === currentTrackId && status === 'playing'}
            onClick={() => onSelectTrack(track)}
          />
        ))}
      </div>
    </div>
  );

  // Desktop: always-visible sidebar
  if (!isMobile) {
    return (
      <div className="h-full overflow-hidden flex flex-col bg-background/40 backdrop-blur-sm rounded-xl border border-foreground/[0.06]">
        {content}
      </div>
    );
  }

  // Mobile: bottom sheet
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 && onClose) onClose();
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl rounded-t-2xl max-h-[70vh] flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 rounded-full bg-foreground/20" />
            </div>
            {content}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
