'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { ShareBackground } from '@/components/share/share-background';

const DIMENSIONS = {
  story: { width: 1080, height: 1920 },
  og: { width: 1200, height: 630 },
};

export default function ShareImagePage() {
  const searchParams = useSearchParams();
  const format = (searchParams.get('format') as 'story' | 'og') || 'story';
  const { width, height } = DIMENSIONS[format];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: '#1a1a1a' }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Instructions */}
        <div className="text-white text-center max-w-lg">
          <h1 className="text-2xl font-bold mb-2">
            Background Template: {format === 'story' ? 'Story' : 'OG'}
          </h1>
          <p className="text-white/60 text-sm mb-4">
            {width} x {height}px
          </p>
          <p className="text-white/80 text-sm">
            Take a screenshot of the template below and save it to:
          </p>
          <code className="text-green-400 text-sm block mt-2">
            public/share-bg-{format}.png
          </code>
        </div>

        {/* Format switcher */}
        <div className="flex gap-4">
          <a
            href="/share-image?format=story"
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              format === 'story'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Story (1080x1920)
          </a>
          <a
            href="/share-image?format=og"
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              format === 'og'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            OG (1200x630)
          </a>
        </div>

        {/* Template container with border for visibility */}
        <div
          className="border-2 border-white/20 shadow-2xl"
          style={{
            transform: format === 'story' ? 'scale(0.4)' : 'scale(0.7)',
            transformOrigin: 'top center',
          }}
        >
          <ShareBackground format={format} />
        </div>

        {/* Additional instructions */}
        <div className="text-white/60 text-center text-sm max-w-lg mt-4">
          <p>
            <strong>Tip:</strong> Use browser dev tools to capture at 100% scale:
          </p>
          <ol className="text-left mt-2 space-y-1">
            <li>1. Right-click the template and select &quot;Inspect&quot;</li>
            <li>2. Right-click the element in dev tools</li>
            <li>3. Select &quot;Capture node screenshot&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
