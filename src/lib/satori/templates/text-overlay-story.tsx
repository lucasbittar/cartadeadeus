import React from 'react';
import type { Letter } from '@/types';

interface TextOverlayStoryProps {
  letter: Letter;
}

export function TextOverlayStory({ letter }: TextOverlayStoryProps) {
  return (
    <div
      style={{
        width: '1080px',
        height: '1920px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '300px 140px 240px 140px',
        backgroundColor: 'transparent',
      }}
    >
      {/* Main content area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width: '100%',
        }}
      >
        {/* Letter content */}
        <p
          style={{
            fontSize: '48px',
            lineHeight: 1.6,
            textAlign: 'center',
            color: '#1A1A1A',
            fontFamily: 'JetBrains Mono, monospace',
            maxWidth: '800px',
          }}
        >
          {letter.content}
        </p>
      </div>

      {/* Author and city info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginTop: '60px',
        }}
      >
        {/* City */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#666666',
            fontSize: '28px',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              fill="#8B1538"
            />
          </svg>
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {letter.city}
          </span>
        </div>

        {/* Author */}
        <p
          style={{
            fontSize: '26px',
            color: '#999999',
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
          }}
        >
          {letter.is_anonymous ? 'Anônimo' : letter.author || 'Anônimo'}
        </p>
      </div>
    </div>
  );
}
