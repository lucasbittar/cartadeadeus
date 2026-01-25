import React from 'react';

interface CountdownOverlayStoryProps {
  days: number;
  hours: number;
  minutes: number;
}

export function CountdownOverlayStory({ days, hours, minutes }: CountdownOverlayStoryProps) {
  const isLastDay = days === 0;

  return (
    <div
      style={{
        width: '1080px',
        height: '1920px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '300px 100px 240px 100px',
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
          gap: '40px',
        }}
      >
        {/* Main countdown text */}
        <p
          style={{
            fontSize: isLastDay ? '72px' : '80px',
            lineHeight: 1.3,
            textAlign: 'center',
            color: '#1A1A1A',
            fontFamily: 'Playfair Display, serif',
            fontWeight: 600,
            margin: 0,
          }}
        >
          {isLastDay ? (
            `Faltam ${hours}h ${minutes}min`
          ) : (
            `Faltam ${days} dias`
          )}
        </p>

        {/* Hours/minutes when not last day */}
        {!isLastDay && (
          <p
            style={{
              fontSize: '48px',
              lineHeight: 1.4,
              textAlign: 'center',
              color: '#666666',
              fontFamily: 'JetBrains Mono, monospace',
              margin: 0,
            }}
          >
            {hours}h {minutes}min
          </p>
        )}

        {/* Subtitle */}
        <p
          style={{
            fontSize: '36px',
            lineHeight: 1.5,
            textAlign: 'center',
            color: '#8B1538',
            fontFamily: 'JetBrains Mono, monospace',
            margin: 0,
            marginTop: '20px',
          }}
        >
          para @fresnorock ao vivo
        </p>
      </div>

      {/* Hashtag */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          marginTop: '60px',
        }}
      >
        <p
          style={{
            fontSize: '32px',
            color: '#999999',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 500,
          }}
        >
          #CartaDeAdeus
        </p>
      </div>
    </div>
  );
}
