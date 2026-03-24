'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { copy } from '@/constants/copy';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EmailGateProps {
  onVerified: (email: string) => void;
}

const easing = [0.22, 1, 0.36, 1] as const;

export function EmailGate({ onVerified }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError(copy.listen.gate.invalidEmail);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/listen/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'rate_limited') {
          setError(copy.listen.gate.rateLimited);
        } else if (data.error === 'not_allowed') {
          setError(copy.listen.gate.error);
        } else {
          setError(copy.listen.gate.error);
        }
        return;
      }

      onVerified(data.email);
    } catch {
      setError(copy.listen.gate.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/car-bg-v2.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        {/* Noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easing }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: easing }}
        >
          <Image
            src="/cda-logo.png"
            alt="Carta de Adeus"
            width={48}
            height={48}
            className="opacity-80"
          />
        </motion.div>

        {/* Headline */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: easing }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-burgundy mb-4 font-jetbrains">
            Fresno • 2026
          </p>
          <h1 className="font-playfair text-3xl md:text-4xl text-foreground mb-3">
            {copy.listen.gate.headline}
          </h1>
          <p className="text-foreground/50 text-sm leading-relaxed max-w-xs mx-auto">
            {copy.listen.gate.description}
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: easing }}
        >
          <Input
            type="email"
            placeholder={copy.listen.gate.emailPlaceholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
            autoComplete="email"
            autoFocus
          />

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? copy.listen.gate.submitting : copy.listen.gate.submitButton}
          </Button>
        </motion.form>

        {/* Subtle footer */}
        <motion.p
          className="text-center text-foreground/30 text-xs mt-8 font-jetbrains"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {copy.listen.gate.subtitle}
        </motion.p>
      </motion.div>
    </div>
  );
}
