'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/player-store';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { album as albumData } from '@/data/album';
import { copy } from '@/constants/copy';
import { cn } from '@/lib/utils';
import type { Track, MobileView, LyricLine } from '@/types/listen';
import { PlayerBackground } from './player-background';
import { NowPlaying } from './now-playing';
import { SeekBar } from './seek-bar';
import { PlayerControls } from './player-controls';
import { VolumeControl } from './volume-control';
import { TrackList } from './track-list';
import { LyricsDisplay } from './lyrics-display';

export function Player() {
  const {
    album,
    setAlbum,
    currentTrackId,
    setCurrentTrackId,
    getCurrentTrack,
    queue,
    isShuffled,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
    mobileView,
    setMobileView,
  } = usePlayerStore();

  const { setTrackDuration } = usePlayerStore();
  const [currentLyricTime, setCurrentLyricTime] = useState(0);
  const [plainTextLyrics, setPlainTextLyrics] = useState<LyricLine[] | null>(null);

  const handleTrackEnd = useCallback(() => {
    const { queue, currentTrackId, repeatMode } = usePlayerStore.getState();
    const currentIndex = queue.indexOf(currentTrackId || '');

    if (currentIndex < queue.length - 1) {
      // Next track
      setCurrentTrackId(queue[currentIndex + 1]);
    } else if (repeatMode === 'all') {
      // Loop back to start
      setCurrentTrackId(queue[0]);
    }
  }, [setCurrentTrackId]);

  const player = useAudioPlayer({
    onTrackEnd: handleTrackEnd,
    onTimeUpdate: setCurrentLyricTime,
    onDurationChange: setTrackDuration,
    repeatMode,
  });

  // Initialize album
  useEffect(() => {
    setAlbum(albumData);
  }, [setAlbum]);

  // Play track when currentTrackId changes
  const currentTrack = getCurrentTrack();
  useEffect(() => {
    if (currentTrack) {
      player.play(currentTrack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackId]);

  // Load plain-text lyrics when track has no synced lyrics
  useEffect(() => {
    if (!currentTrack || currentTrack.lyrics) {
      setPlainTextLyrics(null);
      return;
    }
    const lyricsFile = `/audio/lyrics/${String(currentTrack.number).padStart(2, '0')} - ${currentTrack.title.toLowerCase()}.txt`;
    fetch(lyricsFile)
      .then((res) => (res.ok ? res.text() : ''))
      .then((text) => {
        if (!text) {
          setPlainTextLyrics(null);
          return;
        }
        // Convert plain text to LyricLine[] with time=0 (unsynced)
        const lines = text
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((text) => ({ time: -1, text }));
        setPlainTextLyrics(lines);
      })
      .catch(() => setPlainTextLyrics(null));
  }, [currentTrack]);

  // Auto-play first track on mount
  useEffect(() => {
    if (album && !currentTrackId) {
      setCurrentTrackId(album.tracks[0].id);
    }
  }, [album, currentTrackId, setCurrentTrackId]);

  const handleSelectTrack = useCallback(
    (track: Track) => {
      setCurrentTrackId(track.id);
      setMobileView('artwork');
    },
    [setCurrentTrackId, setMobileView]
  );

  const handlePrevious = useCallback(() => {
    // If more than 3s in, restart current track
    if (player.currentTime > 3) {
      player.seek(0);
      return;
    }
    const currentIndex = queue.indexOf(currentTrackId || '');
    if (currentIndex > 0) {
      setCurrentTrackId(queue[currentIndex - 1]);
    } else if (repeatMode === 'all') {
      setCurrentTrackId(queue[queue.length - 1]);
    }
  }, [player, queue, currentTrackId, setCurrentTrackId, repeatMode]);

  const handleNext = useCallback(() => {
    const currentIndex = queue.indexOf(currentTrackId || '');
    if (currentIndex < queue.length - 1) {
      setCurrentTrackId(queue[currentIndex + 1]);
    } else if (repeatMode === 'all') {
      setCurrentTrackId(queue[0]);
    }
  }, [queue, currentTrackId, setCurrentTrackId, repeatMode]);

  if (!album || !currentTrack) return null;

  const viewButtons: { key: MobileView; label: string }[] = [
    { key: 'artwork', label: copy.listen.player.artwork },
    { key: 'lyrics', label: copy.listen.player.lyrics },
    { key: 'tracklist', label: copy.listen.player.tracklist },
  ];

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      <PlayerBackground coverArt={album.coverArt} trackId={currentTrack.id} />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top safe area spacer */}
        <div style={{ height: 'max(8px, env(safe-area-inset-top))' }} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
          {/* Lyrics: full-width immersive with track title */}
          {mobileView === 'lyrics' && (
            <div className="w-full flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="text-center px-6 pt-1 pb-2 flex-shrink-0">
                <p className="font-playfair text-sm md:text-base text-foreground/50 truncate">
                  {currentTrack.title}
                </p>
              </div>
              <LyricsDisplay
                lyrics={currentTrack.lyrics || plainTextLyrics}
                currentTime={currentLyricTime}
                onSeekToLine={player.seek}
              />
            </div>
          )}
          {/* Artwork & Tracklist: constrained */}
          {mobileView !== 'lyrics' && (
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center flex-1 overflow-hidden">
              {mobileView === 'artwork' && (
                <NowPlaying track={currentTrack} album={album} />
              )}
              {mobileView === 'tracklist' && (
                <div className="w-full flex-1 overflow-y-auto px-2">
                  <TrackList
                    tracks={album.tracks}
                    currentTrackId={currentTrackId}
                    status={player.status}
                    onSelectTrack={handleSelectTrack}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* View toggle */}
        <div className="flex justify-center gap-1 px-6 py-2">
          {viewButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMobileView(key)}
              className={cn(
                'px-3 py-1 text-[10px] lg:text-[11px] uppercase tracking-[0.15em] font-jetbrains rounded-full transition-colors',
                mobileView === key
                  ? 'bg-foreground/10 text-foreground/80'
                  : 'text-foreground/30 hover:text-foreground/50'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="w-full px-6 lg:px-12 pb-2">
          <SeekBar
            currentTime={player.currentTime}
            duration={player.duration}
            onSeek={player.seek}
          />
          <div className="flex items-center justify-center py-2">
            <VolumeControl
              volume={player.volume}
              isMuted={player.isMuted}
              onVolumeChange={player.setVolume}
              onToggleMute={player.toggleMute}
            />
            <PlayerControls
              status={player.status}
              isShuffled={isShuffled}
              repeatMode={repeatMode}
              onTogglePlayPause={player.togglePlayPause}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onToggleShuffle={toggleShuffle}
              onCycleRepeat={cycleRepeatMode}
            />
            {/* Balance spacer for volume control on desktop */}
            <div className="hidden lg:block w-[132px]" />
          </div>
        </div>
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </div>
    </div>
  );
}
