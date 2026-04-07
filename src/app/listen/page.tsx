'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/store/player-store';
import { EmailGate } from '@/components/listen/email-gate';
import { Player } from '@/components/listen/player';

export default function ListenPage() {
  const { isVerified, setVerified } = usePlayerStore();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/listen/session');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setVerified(data.email);
          }
        }
      } catch {
        // No session
      } finally {
        setIsCheckingSession(false);
      }
    }
    checkSession();
  }, [setVerified]);

  if (isCheckingSession) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-burgundy/30 border-t-burgundy rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isVerified ? (
        <motion.div
          key="gate"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <EmailGate onVerified={(email) => setVerified(email)} />
        </motion.div>
      ) : (
        <motion.div
          key="player"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Player />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
