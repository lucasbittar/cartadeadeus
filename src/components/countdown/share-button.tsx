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

  const handleShare = () => {
    const tweetText = generateTweetText();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
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
      className="flex justify-center"
    >
      <motion.button
        onClick={handleShare}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative px-8 py-4 bg-burgundy text-white font-medium rounded-full shadow-lg shadow-burgundy/25 hover:shadow-xl hover:shadow-burgundy/30 transition-shadow duration-300"
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
