import { create } from 'zustand';
import type { Track, Album, RepeatMode, MobileView } from '@/types/listen';

interface PlayerStore {
  // Auth state
  isVerified: boolean;
  userEmail: string | null;
  setVerified: (email: string) => void;
  clearSession: () => void;

  // Album & tracks
  album: Album | null;
  setAlbum: (album: Album) => void;

  // Current playback
  currentTrackId: string | null;
  setCurrentTrackId: (id: string) => void;
  getCurrentTrack: () => Track | null;

  // Queue
  queue: string[]; // track ids
  setQueue: (queue: string[]) => void;
  isShuffled: boolean;
  toggleShuffle: () => void;

  // Repeat
  repeatMode: RepeatMode;
  cycleRepeatMode: () => void;

  // UI state
  mobileView: MobileView;
  setMobileView: (view: MobileView) => void;
  isTrackListOpen: boolean;
  setTrackListOpen: (open: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Auth
  isVerified: false,
  userEmail: null,
  setVerified: (email) => set({ isVerified: true, userEmail: email }),
  clearSession: () => set({ isVerified: false, userEmail: null }),

  // Album
  album: null,
  setAlbum: (album) => set({
    album,
    queue: album.tracks.map((t) => t.id),
  }),

  // Current track
  currentTrackId: null,
  setCurrentTrackId: (id) => set({ currentTrackId: id }),
  getCurrentTrack: () => {
    const { album, currentTrackId } = get();
    if (!album || !currentTrackId) return null;
    return album.tracks.find((t) => t.id === currentTrackId) ?? null;
  },

  // Queue
  queue: [],
  setQueue: (queue) => set({ queue }),
  isShuffled: false,
  toggleShuffle: () => {
    const { isShuffled, album, currentTrackId } = get();
    if (!album) return;

    if (isShuffled) {
      // Restore original order
      set({
        isShuffled: false,
        queue: album.tracks.map((t) => t.id),
      });
    } else {
      // Shuffle, keeping current track first
      const ids = album.tracks.map((t) => t.id);
      const remaining = ids.filter((id) => id !== currentTrackId);
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      const shuffled = currentTrackId
        ? [currentTrackId, ...remaining]
        : remaining;
      set({ isShuffled: true, queue: shuffled });
    }
  },

  // Repeat
  repeatMode: 'off',
  cycleRepeatMode: () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const current = modes.indexOf(get().repeatMode);
    set({ repeatMode: modes[(current + 1) % modes.length] });
  },

  // UI
  mobileView: 'artwork',
  setMobileView: (mobileView) => set({ mobileView }),
  isTrackListOpen: false,
  setTrackListOpen: (isTrackListOpen) => set({ isTrackListOpen }),
}));
