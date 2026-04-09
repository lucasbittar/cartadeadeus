'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Track, PlayerStatus, RepeatMode } from '@/types/listen';

interface AudioPlayerState {
  status: PlayerStatus;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

interface AudioPlayerActions {
  play: (track?: Track) => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

interface UseAudioPlayerOptions {
  onTrackEnd: () => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (trackId: string, duration: number) => void;
  repeatMode: RepeatMode;
}

const VOLUME_KEY = 'listen_volume';

export function useAudioPlayer(options: UseAudioPlayerOptions): AudioPlayerState & AudioPlayerActions {
  const { onTrackEnd, onTimeUpdate, onDurationChange, repeatMode } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const currentTrackRef = useRef<Track | null>(null);
  const repeatModeRef = useRef(repeatMode);
  const statusRef = useRef<PlayerStatus>('idle');

  const [status, setStatus] = useState<PlayerStatus>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    if (typeof window === 'undefined') return 0.8;
    const saved = localStorage.getItem(VOLUME_KEY);
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);

  // Keep refs in sync
  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (currentTrackRef.current && audio.duration > 0) {
        onDurationChange?.(currentTrackRef.current.id, audio.duration);
      }
    };

    const handleEnded = () => {
      cancelAnimationFrame(rafRef.current);
      if (repeatModeRef.current === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setStatus('paused');
        onTrackEnd();
      }
    };

    const handleError = () => {
      console.error('Audio error:', audio.error);
      setStatus('idle');
    };

    const handleCanPlay = () => {
      if (statusRef.current === 'loading') {
        setStatus('playing');
        audio.play().catch(() => setStatus('paused'));
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      cancelAnimationFrame(rafRef.current);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // RAF loop for smooth time updates
  const startTimeUpdate = useCallback(() => {
    const update = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        const time = audio.currentTime;
        setCurrentTime(time);
        onTimeUpdate?.(time);
        rafRef.current = requestAnimationFrame(update);
      }
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(update);
  }, [onTimeUpdate]);

  // Update Media Session
  const updateMediaSession = useCallback((track: Track) => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artist,
      album: 'Carta de Adeus',
      artwork: [
        { src: '/album-artwork.webp', sizes: '512x512', type: 'image/webp' },
      ],
    });
  }, []);

  const play = useCallback((track?: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (track && track.id !== currentTrackRef.current?.id) {
      // New track
      currentTrackRef.current = track;
      setStatus('loading');
      setCurrentTime(0);
      setDuration(0);
      audio.src = track.src;
      audio.load();
      // Play will be triggered by canplay event
      updateMediaSession(track);
    } else {
      // Resume current
      audio.play().then(() => {
        setStatus('playing');
        startTimeUpdate();
      }).catch(() => setStatus('paused'));
    }
  }, [startTimeUpdate, updateMediaSession]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    cancelAnimationFrame(rafRef.current);
    setStatus('paused');
  }, []);

  const togglePlayPause = useCallback(() => {
    if (status === 'playing') {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1, v));
    audio.volume = clamped;
    setVolumeState(clamped);
    localStorage.setItem(VOLUME_KEY, String(clamped));
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      audio.muted = false;
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const newMuted = !isMuted;
    audio.muted = newMuted;
    setIsMuted(newMuted);
  }, [isMuted]);

  // Start RAF when status becomes playing
  useEffect(() => {
    if (status === 'playing') {
      startTimeUpdate();
    }
  }, [status, startTimeUpdate]);

  // Media Session action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.setActionHandler('play', () => play());
    navigator.mediaSession.setActionHandler('pause', () => pause());
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime != null) seek(details.seekTime);
    });

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('seekto', null);
    };
  }, [play, pause, seek]);

  return {
    status,
    currentTime,
    duration,
    volume,
    isMuted,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
  };
}
