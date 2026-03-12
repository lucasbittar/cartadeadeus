'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <h1 className="font-playfair text-4xl md:text-5xl text-foreground mb-4">
          Algo deu errado
        </h1>
        <p className="font-jetbrains text-sm text-foreground/50 mb-8">
          Ocorreu um erro inesperado. Tente novamente.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-burgundy text-white text-sm font-medium rounded-lg hover:bg-burgundy/90 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
