import React from 'react';
import type { Letter } from '@/types';
import { truncateText } from '@/lib/utils';

interface TextOverlayOGProps {
  letter: Letter;
}

export function TextOverlayOG({ letter }: TextOverlayOGProps) {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 150px 90px 150px',
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
            fontSize: '32px',
            lineHeight: 1.5,
            textAlign: 'center',
            color: '#1A1A1A',
            fontFamily: 'JetBrains Mono, monospace',
            maxWidth: '900px',
          }}
        >
          {truncateText(letter.content, 200)}
        </p>
      </div>

      {/* Author and city info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          marginTop: '24px',
        }}
      >
        {/* City */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#666666',
            fontSize: '18px',
          }}
        >
          <svg
            width="16"
            height="16"
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

        {/* Separator */}
        <span style={{ color: '#999999', fontSize: '18px' }}>·</span>

        {/* Author */}
        <p
          style={{
            fontSize: '18px',
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
