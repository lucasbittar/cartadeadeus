'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { album } from '@/data/album';
import type { LyricLine } from '@/types/listen';

interface TimedLine {
  text: string;
  time: number | null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

export default function SyncPage() {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [lines, setLines] = useState<TimedLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewLineIndex, setPreviewLineIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const track = album.tracks[selectedTrackIndex];

  // Load lyrics for selected track
  useEffect(() => {
    const lyricsFile = `/audio/lyrics/${String(selectedTrackIndex + 1).padStart(2, '0')} - ${track.title.toLowerCase()}.txt`;

    fetch(lyricsFile)
      .then((res) => (res.ok ? res.text() : ''))
      .then((text) => {
        const parsed = text
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((text) => ({ text, time: null as number | null }));
        setLines(parsed);
        setCurrentLineIndex(0);
        setIsPreviewing(false);
        setPreviewLineIndex(-1);
      })
      .catch(() => setLines([]));
  }, [selectedTrackIndex, track.title]);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Load track audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = track.src;
    audio.load();
    setCurrentTime(0);
    setIsPlaying(false);
    setIsPreviewing(false);
    cancelAnimationFrame(rafRef.current);
  }, [track.src]);

  // RAF loop
  const startTimeUpdate = useCallback(() => {
    const update = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        setCurrentTime(audio.currentTime);

        // Preview mode: highlight active line
        if (isPreviewing) {
          let active = -1;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].time !== null && audio.currentTime >= lines[i].time!) {
              active = i;
            }
          }
          setPreviewLineIndex(active);
        }

        rafRef.current = requestAnimationFrame(update);
      }
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(update);
  }, [isPreviewing, lines]);

  useEffect(() => {
    if (isPlaying) startTimeUpdate();
  }, [isPlaying, startTimeUpdate]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true));
    } else {
      audio.pause();
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Mark current line with timestamp
  const markLine = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || currentLineIndex >= lines.length) return;

    setLines((prev) => {
      const updated = [...prev];
      updated[currentLineIndex] = { ...updated[currentLineIndex], time: audio.currentTime };
      return updated;
    });
    setCurrentLineIndex((prev) => Math.min(prev + 1, lines.length));
  }, [currentLineIndex, lines.length]);

  // Undo last mark
  const undoMark = useCallback(() => {
    if (currentLineIndex === 0) return;
    const prevIndex = currentLineIndex - 1;
    setLines((prev) => {
      const updated = [...prev];
      updated[prevIndex] = { ...updated[prevIndex], time: null };
      return updated;
    });
    setCurrentLineIndex(prevIndex);
  }, [currentLineIndex]);

  // Clear all timestamps
  const clearAll = useCallback(() => {
    setLines((prev) => prev.map((l) => ({ ...l, time: null })));
    setCurrentLineIndex(0);
    setIsPreviewing(false);
    setPreviewLineIndex(-1);
  }, []);

  // Preview mode
  const togglePreview = useCallback(() => {
    if (!isPreviewing) {
      seek(0);
      const audio = audioRef.current;
      if (audio) {
        audio.play().then(() => setIsPlaying(true));
      }
      setIsPreviewing(true);
    } else {
      setIsPreviewing(false);
      setPreviewLineIndex(-1);
    }
  }, [isPreviewing, seek]);

  // Export as JSON
  const exportJson = useCallback(() => {
    const synced: LyricLine[] = lines
      .filter((l) => l.time !== null)
      .map((l) => ({ time: Math.round(l.time! * 100) / 100, text: l.text }));

    const json = JSON.stringify(synced, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${String(selectedTrackIndex + 1).padStart(2, '0')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [lines, selectedTrackIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLSelectElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPreviewing) {
          togglePlayPause();
        } else if (isPlaying) {
          markLine();
        } else {
          togglePlayPause();
        }
      } else if (e.code === 'Backspace') {
        e.preventDefault();
        undoMark();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [markLine, undoMark, togglePlayPause, isPlaying, isPreviewing]);

  // Auto-scroll to active line
  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentLineIndex, previewLineIndex]);

  const allSynced = lines.length > 0 && lines.every((l) => l.time !== null);
  const syncedCount = lines.filter((l) => l.time !== null).length;

  return (
    <div className="fixed inset-0 bg-[#0D0D0F] text-[#F0ECE8] flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3 flex items-center gap-4 flex-wrap">
        <h1 className="text-sm font-bold tracking-wider uppercase">Sync Tool</h1>

        <select
          value={selectedTrackIndex}
          onChange={(e) => setSelectedTrackIndex(Number(e.target.value))}
          className="bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm flex-1 min-w-[200px]"
        >
          {album.tracks.map((t, i) => (
            <option key={t.id} value={i} className="bg-[#1a1a1a]">
              {String(i + 1).padStart(2, '0')} — {t.title}
            </option>
          ))}
        </select>

        <span className="text-xs text-white/40 font-mono">
          {syncedCount}/{lines.length} linhas
        </span>
      </div>

      {/* Transport */}
      <div className="border-b border-white/10 px-4 py-2 flex items-center gap-3 flex-wrap">
        <button
          onClick={togglePlayPause}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
        >
          {isPlaying ? '⏸ Pausar' : '▶ Tocar'}
        </button>

        <span className="font-mono text-xs text-white/60">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Seek bar */}
        <div
          className="flex-1 h-8 flex items-center cursor-pointer min-w-[100px]"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seek(ratio * duration);
          }}
        >
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8B1538] rounded-full"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {!isPreviewing && (
            <button
              onClick={markLine}
              disabled={currentLineIndex >= lines.length || !isPlaying}
              className="px-4 py-2 bg-[#8B1538] hover:bg-[#a01d45] disabled:opacity-30 disabled:cursor-not-allowed rounded text-sm font-bold transition-colors"
            >
              ⏎ Marcar
            </button>
          )}
          <button
            onClick={undoMark}
            disabled={currentLineIndex === 0}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded text-sm transition-colors"
          >
            ↩ Desfazer
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="border-b border-white/10 px-4 py-2 flex items-center gap-3">
        {allSynced && (
          <>
            <button
              onClick={togglePreview}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                isPreviewing ? 'bg-[#8B1538] text-white' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {isPreviewing ? '✕ Sair do Preview' : '👁 Preview'}
            </button>
            <button
              onClick={exportJson}
              className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded text-sm font-bold transition-colors"
            >
              ⬇ Exportar JSON
            </button>
          </>
        )}
        <p className="text-xs text-white/30 ml-auto">
          Espaço = {isPreviewing ? 'play/pause' : 'marcar'} · Backspace = desfazer
        </p>
      </div>

      {/* Lyrics lines */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-1">
          {lines.map((line, i) => {
            const isActive = isPreviewing ? i === previewLineIndex : i === currentLineIndex;
            const isSynced = line.time !== null;
            const isPast = isPreviewing
              ? i < previewLineIndex
              : i < currentLineIndex;

            return (
              <div
                key={i}
                ref={isActive ? activeLineRef : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-all ${
                  isActive
                    ? 'bg-[#8B1538]/20 border border-[#8B1538]/40'
                    : isPast
                    ? 'opacity-40'
                    : ''
                }`}
              >
                <span className="font-mono text-xs w-16 flex-shrink-0 text-white/40">
                  {isSynced ? formatTime(line.time!) : '--:--.--'}
                </span>
                <span
                  className={`text-sm flex-1 ${
                    isActive ? 'text-white font-medium' : 'text-white/70'
                  }`}
                >
                  {line.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
