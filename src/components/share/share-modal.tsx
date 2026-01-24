'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLetterStore } from '@/store/letter-store';
import { copy } from '@/constants/copy';

export function ShareModal() {
  const { submittedLetter, isShareModalOpen, setShareModalOpen, setSubmittedLetter } =
    useLetterStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageFormat, setImageFormat] = useState<'story' | 'og'>('story');

  if (!submittedLetter) return null;

  const handleClose = () => {
    setShareModalOpen(false);
    setSubmittedLetter(null);
  };

  const handleDownload = async () => {
    if (!submittedLetter) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/share-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letter: submittedLetter, format: imageFormat }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `carta-de-adeus-${submittedLetter.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareX = () => {
    const text = encodeURIComponent(
      `"${submittedLetter.content.slice(0, 200)}${submittedLetter.content.length > 200 ? '...' : ''}"\n\n${copy.social.hashtag} ${copy.social.fresnoHandle}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <Modal isOpen={isShareModalOpen} onClose={handleClose} className="max-w-md">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-burgundy/10 flex items-center justify-center"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-burgundy"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>

        <h2 className="font-playfair text-2xl font-bold text-foreground mb-2">
          {copy.success.title}
        </h2>
        <p className="text-foreground/60 text-sm mb-8">
          {copy.success.message}
        </p>

        <div className="bg-cream rounded-lg p-4 mb-6">
          <blockquote className="font-jetbrains text-sm text-foreground leading-relaxed">
            &ldquo;{submittedLetter.content}&rdquo;
          </blockquote>
          <p className="text-xs text-foreground/50 mt-2">
            📍 {submittedLetter.city}
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setImageFormat('story')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
              imageFormat === 'story'
                ? 'bg-burgundy text-white'
                : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'
            }`}
          >
            Story (1080×1920)
          </button>
          <button
            type="button"
            onClick={() => setImageFormat('og')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
              imageFormat === 'og'
                ? 'bg-burgundy text-white'
                : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'
            }`}
          >
            Feed (1200×630)
          </button>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleDownload}
            isLoading={isGenerating}
            className="w-full"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {copy.share.downloadButton}
          </Button>

          <Button variant="secondary" onClick={handleShareX} className="w-full">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mr-2"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {copy.share.shareX}
          </Button>
        </div>

        <button
          onClick={handleClose}
          className="mt-6 text-sm text-foreground/50 hover:text-foreground transition-colors"
        >
          {copy.share.close}
        </button>
      </motion.div>
    </Modal>
  );
}
