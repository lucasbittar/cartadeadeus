import React from 'react';

interface CountdownOverlayStoryProps {
  days: number;
  hours: number;
  minutes: number;
}

export function CountdownOverlayStory({ days, hours, minutes }: CountdownOverlayStoryProps) {
  const isLastDay = days === 0;

  // Format numbers with leading zeros for elegance
  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      style={{
        width: '1080px',
        height: '1920px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '290px 80px 340px 80px',
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
        {/* Pre-headline */}
        <p
          style={{
            fontSize: '31px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: '#8B1538',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 400,
            margin: 0,
            marginBottom: '62px',
          }}
        >
          {isLastDay ? 'Hoje' : 'Faltam'}
        </p>

        {isLastDay ? (
          /* Last day: Show hours and minutes prominently */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '31px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '42px',
              }}
            >
              {/* Hours */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '234px',
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    lineHeight: 0.85,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatNumber(hours)}
                </span>
                <span
                  style={{
                    fontSize: '23px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: '#999999',
                    fontFamily: 'JetBrains Mono, monospace',
                    marginTop: '21px',
                  }}
                >
                  horas
                </span>
              </div>

              {/* Separator */}
              <span
                style={{
                  fontSize: '156px',
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 300,
                  color: '#D8758D',
                  lineHeight: 0.85,
                  marginBottom: '52px',
                }}
              >
                :
              </span>

              {/* Minutes */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '234px',
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    lineHeight: 0.85,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatNumber(minutes)}
                </span>
                <span
                  style={{
                    fontSize: '23px',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: '#999999',
                    fontFamily: 'JetBrains Mono, monospace',
                    marginTop: '21px',
                  }}
                >
                  min
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Normal days: Hero the day count */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Giant day number */}
            <span
              style={{
                fontSize: '364px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: 600,
                marginTop: '-30px',
                color: '#1A1A1A',
                lineHeight: 0.8,
                letterSpacing: '-0.03em',
              }}
            >
              {days}
            </span>

            {/* Days label */}
            <span
              style={{
                fontSize: '36px',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: '#666666',
                fontFamily: 'JetBrains Mono, monospace',
                marginTop: '70px',
              }}
            >
              dias
            </span>

            {/* Hours and minutes detail */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '52px',
                marginTop: '73px',
                padding: '31px 62px',
                borderTop: '1px solid rgba(139, 21, 56, 0.15)',
                borderBottom: '1px solid rgba(139, 21, 56, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '62px',
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    lineHeight: 1,
                  }}
                >
                  {formatNumber(hours)}
                </span>
                <span
                  style={{
                    fontSize: '21px',
                    letterSpacing: '0.15em',
                    color: '#999999',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  h
                </span>
              </div>

              <span
                style={{
                  fontSize: '42px',
                  color: '#D8758D',
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 300,
                }}
              >
                :
              </span>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '62px',
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 600,
                    color: '#1A1A1A',
                    lineHeight: 1,
                  }}
                >
                  {formatNumber(minutes)}
                </span>
                <span
                  style={{
                    fontSize: '21px',
                    letterSpacing: '0.15em',
                    color: '#999999',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  min
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Event line */}
        <p
          style={{
            fontSize: '44px',
            lineHeight: 1.5,
            textAlign: 'center',
            color: '#8B1538',
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            margin: 0,
            marginTop: '83px',
            letterSpacing: '0.02em',
          }}
        >
          para Fresno ao vivo
        </p>
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '21px',
        }}
      >
        <p
          style={{
            fontSize: '26px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#AAAAAA',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 400,
          }}
        >
          A contagem começou
        </p>
      </div>
    </div>
  );
}
