'use client';

import React from 'react';

interface ShareBackgroundProps {
  format: 'story' | 'og';
}

const DIMENSIONS = {
  story: { width: 1080, height: 1920 },
  og: { width: 1200, height: 630 },
};

export function ShareBackground({ format }: ShareBackgroundProps) {
  const { width, height } = DIMENSIONS[format];
  const isStory = format === 'story';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#FDF8F5',
      }}
    >
      {/* Subtle paper texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Soft vignette at edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(139, 21, 56, 0.08) 100%)`,
        }}
      />

      {/* Main content container */}
      <div
        className="absolute flex flex-col items-center justify-between"
        style={{
          top: isStory ? '80px' : '40px',
          left: isStory ? '60px' : '50px',
          right: isStory ? '60px' : '50px',
          bottom: isStory ? '80px' : '40px',
        }}
      >
        {/* Top decorative line */}
        <div className="w-full flex items-center justify-center gap-4">
          <div
            className="flex-1 h-px"
            style={{
              background: 'linear-gradient(to right, transparent, #8B1538, transparent)',
            }}
          />
          <div
            className="w-2 h-2 rotate-45"
            style={{ backgroundColor: '#8B1538' }}
          />
          <div
            className="flex-1 h-px"
            style={{
              background: 'linear-gradient(to left, transparent, #8B1538, transparent)',
            }}
          />
        </div>

        {/* Header */}
        <div
          className="flex flex-col items-center"
          style={{
            marginTop: isStory ? '40px' : '16px',
          }}
        >
          <h1
            className="tracking-[0.2em] uppercase"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: isStory ? '42px' : '28px',
              fontWeight: 600,
              color: '#8B1538',
            }}
          >
            Carta de Adeus
          </h1>
          {/* Flourish under title */}
          <div
            className="flex items-center gap-3"
            style={{
              marginTop: isStory ? '16px' : '8px',
            }}
          >
            <div
              className="h-px"
              style={{
                width: isStory ? '60px' : '40px',
                backgroundColor: '#8B1538',
                opacity: 0.4,
              }}
            />
            <div
              className="text-center"
              style={{
                color: '#8B1538',
                fontSize: isStory ? '20px' : '14px',
                opacity: 0.6,
              }}
            >
              &#10022;
            </div>
            <div
              className="h-px"
              style={{
                width: isStory ? '60px' : '40px',
                backgroundColor: '#8B1538',
                opacity: 0.4,
              }}
            />
          </div>
        </div>

        {/* Content area - where text will be overlaid */}
        <div
          className="flex-1 w-full flex flex-col items-center justify-center relative"
          style={{
            marginTop: isStory ? '60px' : '24px',
            marginBottom: isStory ? '60px' : '24px',
          }}
        >
          {/* Opening quote mark */}
          <div
            className="absolute"
            style={{
              top: isStory ? '0' : '-8px',
              left: isStory ? '40px' : '20px',
              fontFamily: 'Playfair Display, serif',
              fontSize: isStory ? '180px' : '100px',
              color: '#8B1538',
              opacity: 0.12,
              lineHeight: 1,
            }}
          >
            &ldquo;
          </div>

          {/* Text content area - marked for overlay */}
          <div
            className="w-full flex flex-col items-center justify-center"
            style={{
              padding: isStory ? '100px 80px' : '40px 100px',
              minHeight: isStory ? '800px' : '280px',
            }}
          >
            {/* This space intentionally left empty - text will be composited here */}
          </div>

          {/* Closing quote mark */}
          <div
            className="absolute"
            style={{
              bottom: isStory ? '0' : '-20px',
              right: isStory ? '40px' : '20px',
              fontFamily: 'Playfair Display, serif',
              fontSize: isStory ? '180px' : '100px',
              color: '#8B1538',
              opacity: 0.12,
              lineHeight: 1,
            }}
          >
            &rdquo;
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="w-full flex items-center justify-center gap-4">
          <div
            className="flex-1 h-px"
            style={{
              background: 'linear-gradient(to right, transparent, #8B1538, transparent)',
            }}
          />
          <div
            className="w-2 h-2 rotate-45"
            style={{ backgroundColor: '#8B1538' }}
          />
          <div
            className="flex-1 h-px"
            style={{
              background: 'linear-gradient(to left, transparent, #8B1538, transparent)',
            }}
          />
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-6"
          style={{
            marginTop: isStory ? '40px' : '16px',
            fontSize: isStory ? '24px' : '16px',
            color: '#8B1538',
            fontWeight: 500,
          }}
        >
          <span>#CartaDeAdeus</span>
          <span style={{ opacity: 0.4 }}>|</span>
          <span>@fresnorock</span>
        </div>
      </div>

      {/* Corner decorations for story format */}
      {isStory && (
        <>
          {/* Top-left corner */}
          <svg
            className="absolute"
            style={{ top: '40px', left: '40px' }}
            width="60"
            height="60"
            viewBox="0 0 60 60"
          >
            <path
              d="M0 60 L0 20 Q0 0 20 0 L60 0"
              fill="none"
              stroke="#8B1538"
              strokeWidth="1.5"
              opacity="0.3"
            />
          </svg>
          {/* Top-right corner */}
          <svg
            className="absolute"
            style={{ top: '40px', right: '40px' }}
            width="60"
            height="60"
            viewBox="0 0 60 60"
          >
            <path
              d="M60 60 L60 20 Q60 0 40 0 L0 0"
              fill="none"
              stroke="#8B1538"
              strokeWidth="1.5"
              opacity="0.3"
            />
          </svg>
          {/* Bottom-left corner */}
          <svg
            className="absolute"
            style={{ bottom: '40px', left: '40px' }}
            width="60"
            height="60"
            viewBox="0 0 60 60"
          >
            <path
              d="M0 0 L0 40 Q0 60 20 60 L60 60"
              fill="none"
              stroke="#8B1538"
              strokeWidth="1.5"
              opacity="0.3"
            />
          </svg>
          {/* Bottom-right corner */}
          <svg
            className="absolute"
            style={{ bottom: '40px', right: '40px' }}
            width="60"
            height="60"
            viewBox="0 0 60 60"
          >
            <path
              d="M60 0 L60 40 Q60 60 40 60 L0 60"
              fill="none"
              stroke="#8B1538"
              strokeWidth="1.5"
              opacity="0.3"
            />
          </svg>
        </>
      )}

      {/* Subtle gradient overlays for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isStory
            ? 'linear-gradient(180deg, rgba(139, 21, 56, 0.03) 0%, transparent 20%, transparent 80%, rgba(139, 21, 56, 0.03) 100%)'
            : 'linear-gradient(90deg, rgba(139, 21, 56, 0.02) 0%, transparent 20%, transparent 80%, rgba(139, 21, 56, 0.02) 100%)',
        }}
      />
    </div>
  );
}
