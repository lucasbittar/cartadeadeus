'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: SwitchProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:ring-offset-2',
          checked ? 'bg-burgundy' : 'bg-foreground/20'
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg',
            'ring-0 transition-transform duration-200 ease-in-out'
          )}
          style={{ x: checked ? 20 : 0 }}
        />
      </button>
      {label && (
        <span className="text-sm text-foreground/70">{label}</span>
      )}
    </label>
  );
}
