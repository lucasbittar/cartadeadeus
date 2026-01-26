'use client';

import { useState } from 'react';
import { Letter } from '@/types';
import { copy } from '@/constants/copy';

interface AdminShareModalProps {
  letter: Letter;
  onClose: () => void;
}

export function AdminShareModal({ letter, onClose }: AdminShareModalProps) {
  const [downloading, setDownloading] = useState<'story' | 'og' | null>(null);

  const handleDownload = async (format: 'story' | 'og') => {
    setDownloading(format);

    try {
      const response = await fetch('/api/share-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letter, format }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carta-${letter.id}-${format}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-background rounded-lg max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-playfair text-xl font-semibold text-foreground">
            {copy.admin.share.title}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-dark hover:text-foreground transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Letter Preview */}
        <div className="bg-cream rounded-lg p-4 mb-6">
          <p className="text-sm text-foreground line-clamp-4">{letter.content}</p>
          <p className="mt-2 text-xs text-muted-dark">
            {letter.is_anonymous
              ? copy.marquee.anonymous
              : letter.author || '-'}{' '}
            {copy.marquee.from} {letter.city}
          </p>
        </div>

        {/* Download Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleDownload('story')}
            disabled={downloading !== null}
            className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading === 'story' ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                {copy.admin.share.downloading}
              </>
            ) : (
              copy.admin.share.downloadStory
            )}
          </button>
          <button
            onClick={() => handleDownload('og')}
            disabled={downloading !== null}
            className="w-full flex items-center justify-center gap-2 border border-muted-light py-3 rounded-lg font-medium hover:bg-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading === 'og' ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-foreground border-t-transparent rounded-full" />
                {copy.admin.share.downloading}
              </>
            ) : (
              copy.admin.share.downloadOG
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
