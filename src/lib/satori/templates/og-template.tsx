import React from 'react';
import type { Letter } from '@/types';
import { colors } from '@/constants/colors';
import { truncateText } from '@/lib/utils';

interface OGTemplateProps {
  letter: Letter;
}

export function OGTemplate({ letter }: OGTemplateProps) {
  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cream,
        padding: '40px',
        fontFamily: 'Playfair Display, serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '48px 64px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '32px',
            left: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: colors.burgundy.DEFAULT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '16px',
            }}
          >
            ✉
          </div>
          <span
            style={{
              fontSize: '18px',
              color: colors.burgundy.DEFAULT,
              fontWeight: 600,
              letterSpacing: '0.1em',
            }}
          >
            CARTA DE ADEUS
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
            paddingTop: '40px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              color: colors.burgundy.DEFAULT,
              opacity: 0.2,
              marginBottom: '-20px',
            }}
          >
            &ldquo;
          </div>
          <p
            style={{
              fontSize: '36px',
              lineHeight: 1.4,
              textAlign: 'center',
              color: '#1A1A1A',
              fontFamily: 'JetBrains Mono, monospace',
              maxWidth: '900px',
            }}
          >
            {truncateText(letter.content, 180)}
          </p>
          <div
            style={{
              fontSize: '64px',
              color: colors.burgundy.DEFAULT,
              opacity: 0.2,
              marginTop: '-20px',
              alignSelf: 'flex-end',
            }}
          >
            &rdquo;
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#666666',
              fontSize: '18px',
            }}
          >
            <span>📍</span>
            <span>{letter.city}</span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              fontSize: '16px',
              color: colors.burgundy.DEFAULT,
            }}
          >
            <span>#CartaDeAdeus</span>
            <span>@fresnorock</span>
          </div>
        </div>
      </div>
    </div>
  );
}
