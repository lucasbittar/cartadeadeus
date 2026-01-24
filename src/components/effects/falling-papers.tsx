'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Paper {
  id: number;
  initialX: number;
  initialY: number;
  size: number;
  duration: number;
  delay: number;
  rotateStart: number;
  rotateEnd: number;
  swayAmount: number;
  opacity: number;
  color: string;
}

const PAPER_COLORS = [
  'rgba(208, 213, 211, 0.7)',  // Soft gray-green
  'rgba(200, 206, 202, 0.6)',  // Muted sage
  'rgba(215, 220, 218, 0.65)', // Light gray
  'rgba(195, 202, 200, 0.55)', // Deeper gray-green
  'rgba(220, 225, 223, 0.5)',  // Almost white
  'rgba(188, 196, 194, 0.6)',  // Medium gray
];

function createPaper(id: number, viewportWidth: number): Paper {
  return {
    id,
    initialX: Math.random() * viewportWidth,
    initialY: -100 - Math.random() * 300,
    size: 20 + Math.random() * 40,
    duration: 12 + Math.random() * 18,
    delay: Math.random() * 15,
    rotateStart: Math.random() * 360,
    rotateEnd: Math.random() * 360 + (Math.random() > 0.5 ? 180 : -180),
    swayAmount: 30 + Math.random() * 60,
    opacity: 0.4 + Math.random() * 0.4,
    color: PAPER_COLORS[Math.floor(Math.random() * PAPER_COLORS.length)],
  };
}

function PaperSheet({ paper, viewportHeight }: { paper: Paper; viewportHeight: number }) {
  const aspectRatio = 0.7 + Math.random() * 0.2; // Slightly varying paper proportions

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: paper.initialX,
        top: paper.initialY,
        width: paper.size,
        height: paper.size / aspectRatio,
      }}
      initial={{
        y: 0,
        x: 0,
        rotate: paper.rotateStart,
        opacity: 0,
      }}
      animate={{
        y: viewportHeight + 200,
        x: [0, paper.swayAmount, -paper.swayAmount * 0.7, paper.swayAmount * 0.5, 0],
        rotate: paper.rotateEnd,
        opacity: [0, paper.opacity, paper.opacity, paper.opacity, 0],
      }}
      transition={{
        duration: paper.duration,
        delay: paper.delay,
        repeat: Infinity,
        ease: 'linear',
        x: {
          duration: paper.duration,
          delay: paper.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        opacity: {
          duration: paper.duration,
          delay: paper.delay,
          repeat: Infinity,
          times: [0, 0.1, 0.5, 0.9, 1],
          ease: 'easeInOut',
        },
      }}
    >
      {/* Paper with subtle 3D effect */}
      <div
        className="w-full h-full relative"
        style={{
          backgroundColor: paper.color,
          boxShadow: `
            0 2px 4px rgba(0,0,0,0.04),
            0 4px 8px rgba(0,0,0,0.02),
            inset 0 1px 0 rgba(255,255,255,0.5)
          `,
          borderRadius: '1px',
          transform: 'perspective(100px) rotateX(2deg)',
        }}
      >
        {/* Subtle fold line */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, transparent 48%, rgba(0,0,0,0.02) 50%, transparent 52%)',
          }}
        />
      </div>
    </motion.div>
  );
}

export function FallingPapers({ count = 35 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const papers = useMemo(() => {
    if (!mounted) return [];
    const isMobile = dimensions.width < 768;
    const paperCount = isMobile ? Math.floor(count * 0.5) : count;
    return Array.from({ length: paperCount }, (_, i) => createPaper(i, dimensions.width));
  }, [mounted, dimensions.width, count]);

  if (!mounted || prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
              width: 24 + (i % 3) * 8,
              height: 32 + (i % 3) * 10,
              backgroundColor: PAPER_COLORS[i % PAPER_COLORS.length],
              transform: `rotate(${(i * 37) % 360}deg)`,
              borderRadius: '1px',
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {papers.map((paper) => (
        <PaperSheet
          key={paper.id}
          paper={paper}
          viewportHeight={dimensions.height}
        />
      ))}
    </div>
  );
}
