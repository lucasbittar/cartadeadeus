'use client';

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { FloatingCards } from './floating-cards';
import { SpotlightOverlay } from './spotlight-overlay';
import { useLetterCycle } from '@/hooks/use-letter-cycle';
import { useReducedMotion } from '@/hooks';
import type { Letter } from '@/types';

interface MuralSceneProps {
  letters: Letter[];
}

// Reduced motion fallback: static grid of cards
function StaticCardsGrid() {
  const cards = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      style: {
        left: `${(i % 6) * 16 + 2 + Math.random() * 4}%`,
        top: `${Math.floor(i / 6) * 22 + 5 + Math.random() * 6}%`,
        transform: `rotate(${(Math.random() - 0.5) * 8}deg)`,
        opacity: 0.3 + Math.random() * 0.3,
      },
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {cards.map((card) => (
        <div
          key={card.id}
          className="absolute w-24 h-16 md:w-32 md:h-20 bg-white/10 rounded-lg border border-white/5"
          style={card.style}
        />
      ))}
    </div>
  );
}

export function MuralScene({ letters }: MuralSceneProps) {
  const prefersReducedMotion = useReducedMotion();
  const { currentLetter, isSpotlightActive } = useLetterCycle(letters, {
    cycleDuration: 17000,
    spotlightDuration: 15000,
  });

  // Card count based on device capability
  const cardCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 50;

  return (
    <>
      {/* 3D Canvas with floating cards */}
      {prefersReducedMotion ? (
        <StaticCardsGrid />
      ) : (
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 10], fov: 50 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent' }}
          >
            <FloatingCards count={cardCount} isSpotlightActive={isSpotlightActive} />
          </Canvas>
        </div>
      )}

      {/* Spotlight overlay for highlighted letter */}
      <SpotlightOverlay letter={currentLetter} isActive={isSpotlightActive} />
    </>
  );
}
