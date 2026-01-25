'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownUnitProps {
  value: number;
  label: string;
  delay?: number;
}

export function CountdownUnit({ value, label, delay = 0 }: CountdownUnitProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
      prevValueRef.current = value;
      return () => clearTimeout(timeout);
    }
  }, [value]);

  // Pad single digits with leading zero
  const formattedValue = displayValue.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="flex flex-col items-center"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={displayValue}
          initial={{ scale: 1 }}
          animate={{
            scale: isAnimating ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
          className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-burgundy tabular-nums leading-none"
        >
          {formattedValue}
        </motion.span>
      </AnimatePresence>
      <span className="font-jetbrains text-[10px] sm:text-xs uppercase tracking-widest text-foreground/40 mt-2">
        {label}
      </span>
    </motion.div>
  );
}
