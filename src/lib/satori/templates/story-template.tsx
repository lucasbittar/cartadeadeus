import React from 'react';
import type { Letter } from '@/types';
import { colors } from '@/constants/colors';

interface StoryTemplateProps {
  letter: Letter;
}

export function StoryTemplate({ letter }: StoryTemplateProps) {
  return (
    <div
      style={{
        width: '1080px',
        height: '1920px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cream,
        padding: '120px 80px',
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
          borderRadius: '40px',
          padding: '80px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: colors.burgundy.DEFAULT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '24px',
            }}
          >
            ✉
          </div>
          <span
            style={{
              fontSize: '28px',
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
            paddingTop: '100px',
          }}
        >
          <div
            style={{
              fontSize: '120px',
              color: colors.burgundy.DEFAULT,
              opacity: 0.2,
              marginBottom: '-40px',
            }}
          >
            &ldquo;
          </div>
          <p
            style={{
              fontSize: '52px',
              lineHeight: 1.5,
              textAlign: 'center',
              color: '#1A1A1A',
              fontFamily: 'JetBrains Mono, monospace',
              maxWidth: '800px',
            }}
          >
            {letter.content}
          </p>
          <div
            style={{
              fontSize: '120px',
              color: colors.burgundy.DEFAULT,
              opacity: 0.2,
              marginTop: '-40px',
              alignSelf: 'flex-end',
            }}
          >
            &rdquo;
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#666666',
              fontSize: '28px',
            }}
          >
            <span>📍</span>
            <span>{letter.city}</span>
          </div>
          <p
            style={{
              fontSize: '24px',
              color: '#999999',
            }}
          >
            {letter.is_anonymous
              ? 'Anônimo'
              : letter.author || 'Anônimo'}
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '24px',
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
