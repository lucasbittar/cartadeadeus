'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copy } from '@/constants/copy';

interface ShareButtonProps {
  days: number;
  hours: number;
  minutes: number;
  delay?: number;
}

export function ShareButton({ days, hours, minutes, delay = 0 }: ShareButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTweetText = () => {
    if (days === 0) {
      return copy.countdown.tweet.templateShort
        .replace('{hours}', hours.toString())
        .replace('{minutes}', minutes.toString());
    }
    return copy.countdown.tweet.template
      .replace('{days}', days.toString())
      .replace('{hours}', hours.toString())
      .replace('{minutes}', minutes.toString());
  };

  const handleTwitterShare = () => {
    const tweetText = generateTweetText();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleMobileShare = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      // Generate the countdown image
      const response = await fetch('/api/share-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: 'countdown',
          countdown: { days, hours, minutes },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      const file = new File([blob], 'carta-de-adeus-countdown.png', { type: 'image/png' });

      // Check if native sharing with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'carta-de-adeus-countdown.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      // User cancelled share or error occurred
      console.error('Share error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="flex justify-center gap-3"
    >
      {/* Mobile: Native Share Button */}
      <motion.button
        onClick={handleMobileShare}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isGenerating}
        className="md:hidden relative px-8 py-4 bg-burgundy text-white font-medium rounded-full shadow-lg shadow-burgundy/25 hover:shadow-xl hover:shadow-burgundy/30 transition-shadow duration-300 disabled:opacity-70"
      >
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.span
              key="generating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Gerando...
            </motion.span>
          ) : showSuccess ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Compartilhado!
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              {copy.countdown.shareButton}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Desktop: X/Twitter Button */}
      <motion.button
        onClick={handleTwitterShare}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="hidden md:flex relative px-8 py-4 bg-burgundy text-white font-medium rounded-full shadow-lg shadow-burgundy/25 hover:shadow-xl hover:shadow-burgundy/30 transition-shadow duration-300"
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Compartilhado!
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              {copy.countdown.shareButton}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
