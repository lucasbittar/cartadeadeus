'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { copy } from '@/constants/copy';
import { youTubeThumbnail } from '@/lib/youtube';
import type { Video } from '@/types';

const t = copy.admin.videos;

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [url, setUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/videos');
      if (!res.ok) throw new Error('load failed');
      setVideos(await res.json());
      setError(null);
    } catch {
      setError(t.loadError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setAdding(true);
    setAddError(null);
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube_url: url.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t.invalidUrl);
      }
      setUrl('');
      await load();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : t.invalidUrl);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.deleteConfirm)) return;
    const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  // Swap sort_order with the neighbour in the given direction.
  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= videos.length) return;
    const a = videos[index];
    const b = videos[target];
    await Promise.all([
      fetch(`/api/admin/videos/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: b.sort_order }),
      }),
      fetch(`/api/admin/videos/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: a.sort_order }),
      }),
    ]);
    await load();
  };

  const handleTitleSave = async (video: Video, nextTitle: string) => {
    const trimmed = nextTitle.trim();
    if (trimmed === (video.title ?? '')) return;
    await fetch(`/api/admin/videos/${video.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: trimmed || null }),
    });
    await load();
  };

  return (
    <div>
      <h2 className="font-playfair text-2xl font-semibold text-foreground mb-6">
        {t.title}
      </h2>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t.addPlaceholder}
          className="flex-1 px-4 py-2.5 rounded-lg border border-muted-light bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy transition-all text-sm"
        />
        <button
          type="submit"
          disabled={adding}
          className="px-4 py-2.5 rounded-lg bg-burgundy text-white text-sm font-medium hover:bg-burgundy-600 transition-colors disabled:opacity-50"
        >
          {adding ? t.adding : t.addButton}
        </button>
      </form>

      {addError && <p className="text-sm text-red-400 mb-4 -mt-2">{addError}</p>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-background border border-muted-light rounded-lg h-24 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : videos.length === 0 ? (
        <p className="text-muted-dark text-sm">{t.emptyState}</p>
      ) : (
        <div className="space-y-3">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="bg-background border border-muted-light rounded-lg p-3 flex items-center gap-4"
            >
              <div className="relative w-28 h-16 shrink-0 rounded-md overflow-hidden bg-surface">
                <Image
                  src={youTubeThumbnail(video.youtube_id)}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  defaultValue={video.title ?? ''}
                  placeholder={t.noTitle}
                  onBlur={(e) => handleTitleSave(video, e.target.value)}
                  className="w-full bg-transparent text-foreground text-sm font-medium border-b border-transparent hover:border-muted-light focus:border-burgundy focus:outline-none transition-colors pb-0.5"
                />
                <a
                  href={video.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-jetbrains text-xs text-muted-dark hover:text-burgundy-300 transition-colors"
                >
                  {video.youtube_id}
                </a>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  aria-label={t.moveUp}
                  className="p-1.5 rounded-md text-muted-dark hover:text-foreground hover:bg-surface transition-colors disabled:opacity-25 disabled:hover:bg-transparent"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleMove(index, 1)}
                  disabled={index === videos.length - 1}
                  aria-label={t.moveDown}
                  className="p-1.5 rounded-md text-muted-dark hover:text-foreground hover:bg-surface transition-colors disabled:opacity-25 disabled:hover:bg-transparent"
                >
                  ▼
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="px-3 py-1.5 rounded-md text-xs text-burgundy-300 hover:bg-burgundy/10 transition-colors"
                >
                  {t.delete}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
