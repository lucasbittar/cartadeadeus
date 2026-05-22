'use client';

import { useEffect, useState, useCallback } from 'react';
import { copy } from '@/constants/copy';
import type { Tweet } from '@/types';

const t = copy.admin.tweets;

// The admin endpoint enriches each row with the rendered tweet content
// so the list is scannable without opening every link.
interface AdminTweetRow extends Tweet {
  text: string | null;
  author: { name: string; screen_name: string } | null;
  avatar: string | null;
}

export default function AdminTweetsPage() {
  const [tweets, setTweets] = useState<AdminTweetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [url, setUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tweets');
      if (!res.ok) throw new Error('load failed');
      setTweets(await res.json());
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
      const res = await fetch('/api/admin/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweet_url: url.trim() }),
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
    const res = await fetch(`/api/admin/tweets/${id}`, { method: 'DELETE' });
    if (res.ok) await load();
  };

  // Swap sort_order with the neighbour in the given direction.
  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= tweets.length) return;
    const a = tweets[index];
    const b = tweets[target];
    await Promise.all([
      fetch(`/api/admin/tweets/${a.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: b.sort_order }),
      }),
      fetch(`/api/admin/tweets/${b.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: a.sort_order }),
      }),
    ]);
    await load();
  };

  return (
    <div>
      <h2 className="font-playfair text-2xl font-semibold text-foreground mb-1">
        {t.title}
      </h2>
      <p className="text-sm text-muted-dark mb-6">{t.hint}</p>

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
              className="bg-background border border-muted-light rounded-lg h-16 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : tweets.length === 0 ? (
        <p className="text-muted-dark text-sm">{t.emptyState}</p>
      ) : (
        <div className="space-y-3">
          {tweets.map((tweet, index) => (
            <div
              key={tweet.id}
              className="bg-background border border-muted-light rounded-lg p-3 flex items-start gap-3"
            >
              <div className="font-jetbrains text-[10px] tracking-widest uppercase text-muted-dark w-8 text-center shrink-0 pt-1">
                {String(index + 1).padStart(2, '0')}
              </div>

              {tweet.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tweet.avatar}
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-full shrink-0 mt-0.5 border border-white/[0.06]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-surface shrink-0 mt-0.5" aria-hidden />
              )}

              <a
                href={tweet.tweet_url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 group"
              >
                {tweet.author && (
                  <p className="font-jetbrains text-[11px] text-muted-dark">
                    <span className="text-foreground/80 group-hover:text-burgundy-200 transition-colors">
                      {tweet.author.name}
                    </span>
                    <span className="ml-1.5">@{tweet.author.screen_name}</span>
                  </p>
                )}
                <p className="text-sm text-foreground/85 line-clamp-2 mt-0.5 group-hover:text-foreground transition-colors">
                  {tweet.text || tweet.tweet_url}
                </p>
              </a>

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
                  disabled={index === tweets.length - 1}
                  aria-label={t.moveDown}
                  className="p-1.5 rounded-md text-muted-dark hover:text-foreground hover:bg-surface transition-colors disabled:opacity-25 disabled:hover:bg-transparent"
                >
                  ▼
                </button>
                <button
                  onClick={() => handleDelete(tweet.id)}
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
