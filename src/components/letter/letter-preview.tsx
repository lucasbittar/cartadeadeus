'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/modal';
import { AuthorName } from '@/components/ui/author-name';
import { useLetterStore } from '@/store/letter-store';
import { formatDate } from '@/lib/utils';

export function LetterPreviewModal() {
  const { selectedLetter, setSelectedLetter } = useLetterStore();

  if (!selectedLetter) return null;

  return (
    <Modal
      isOpen={!!selectedLetter}
      onClose={() => setSelectedLetter(null)}
      className="max-w-md"
    >
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
          <span>{selectedLetter.city}</span>
        </div>

        <blockquote className="font-jetbrains text-lg leading-relaxed text-foreground">
          &ldquo;{selectedLetter.content}&rdquo;
        </blockquote>

        <div className="flex items-center justify-between text-sm text-foreground/50">
          {selectedLetter.is_anonymous ? (
            <span>Anônimo</span>
          ) : (
            <AuthorName name={selectedLetter.author || 'Anônimo'} />
          )}
          <span>{formatDate(selectedLetter.created_at)}</span>
        </div>
      </motion.div>
    </Modal>
  );
}
