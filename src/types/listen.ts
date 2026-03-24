export type RepeatMode = 'off' | 'all' | 'one';
export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused';
export type MobileView = 'artwork' | 'lyrics' | 'tracklist';

export interface LyricLine {
  time: number; // seconds from start
  text: string;
}

export interface Track {
  id: string;
  number: number;
  title: string;
  artist: string;
  duration: number; // seconds
  src: string; // path to audio file
  lyrics: LyricLine[] | null;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt: string; // path to cover image
  year: number;
  tracks: Track[];
}

export interface ListenSession {
  email: string;
  expiresAt: number; // unix timestamp
  signature: string;
}
