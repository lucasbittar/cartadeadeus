'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  charCount?: number;
  maxChars?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, charCount, maxChars, id, ...props }, ref) => {
    const isNearLimit = maxChars && charCount && charCount >= maxChars * 0.9;
    const isAtLimit = maxChars && charCount && charCount >= maxChars;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-foreground/70 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={id}
            className={cn(
              'w-full px-4 py-3 rounded-lg border border-foreground/10',
              'bg-white text-foreground placeholder:text-foreground/40',
              'focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy',
              'transition-all duration-200 resize-none',
              'font-jetbrains text-sm leading-relaxed',
              error && 'border-red-500 focus:ring-red-500/30',
              className
            )}
            {...props}
          />
          {maxChars && (
            <div
              className={cn(
                'absolute bottom-3 right-3 text-xs',
                isAtLimit
                  ? 'text-red-500'
                  : isNearLimit
                  ? 'text-amber-500'
                  : 'text-foreground/40'
              )}
            >
              {charCount || 0}/{maxChars}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
