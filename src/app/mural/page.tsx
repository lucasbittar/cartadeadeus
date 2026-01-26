'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MuralScene } from '@/components/mural/mural-scene';
import { FullscreenButton } from '@/components/mural/fullscreen-button';
import { copy } from '@/constants/copy';
import type { Letter } from '@/types';

async function fetchLetters(): Promise<Letter[]> {
  const response = await fetch('/api/letters');
  if (!response.ok) {
    throw new Error('Failed to fetch letters');
  }
  return response.json();
}

export default function MuralPage() {
  const { data: letters = [], isLoading } = useQuery({
    queryKey: ['letters'],
    queryFn: fetchLetters,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#1C040B] flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
        </div>
      </div>
    );
  }

  // Empty state
  if (letters.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#1C040B] flex items-center justify-center">
        <div className="text-center px-6">
          <p className="font-playfair text-2xl md:text-3xl text-white/80 mb-2">
            {copy.mural.emptyState}
          </p>
          <p className="font-jetbrains text-sm text-white/40">
            {copy.mural.emptySubtext}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 bg-[#1C040B] overflow-hidden">
      {/* Mural scene with floating cards and spotlight */}
      <MuralScene letters={letters} />

      {/* Fullscreen toggle button */}
      <FullscreenButton />
    </main>
  );
}
