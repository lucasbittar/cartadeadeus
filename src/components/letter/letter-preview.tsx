'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '@/components/ui/modal';
import { AuthorName } from '@/components/ui/author-name';
import { useLetterStore } from '@/store/letter-store';
import { formatDate } from '@/lib/utils';
import type { Letter } from '@/types';

async function fetchLetter(id: string): Promise<Letter> {
  const response = await fetch(`/api/letters/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch letter');
  }
  return response.json();
}

export function LetterPreviewModal() {
  const { selectedLetterId, setSelectedLetterId } = useLetterStore();

  const { data: letter, isLoading, isError } = useQuery({
    queryKey: ['letter', selectedLetterId],
    queryFn: () => fetchLetter(selectedLetterId!),
    enabled: !!selectedLetterId,
    staleTime: 5 * 60 * 1000,
  });

  if (!selectedLetterId) return null;

  return (
    <Modal
      isOpen={!!selectedLetterId}
      onClose={() => setSelectedLetterId(null)}
      className="max-w-md"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 rounded-full border-2 border-burgundy/20 border-t-burgundy animate-spin" />
        </div>
      ) : isError || !letter ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-foreground/50 text-sm">Não foi possível carregar a carta.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-sm text-foreground/50">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{letter.city}</span>
          </div>

          <blockquote className="font-jetbrains text-lg leading-relaxed text-foreground">
            &ldquo;{letter.content}&rdquo;
          </blockquote>

          <div className="flex items-center justify-between text-sm text-foreground/50">
            {letter.is_anonymous ? (
              <span>Anônimo</span>
            ) : (
              <AuthorName name={letter.author || 'Anônimo'} />
            )}
            <span>{formatDate(letter.created_at)}</span>
          </div>
        </motion.div>
      )}
    </Modal>
  );
}
