'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { copy } from '@/constants/copy';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    // Basic email validation
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage(copy.admin.login.invalidEmail);
      return;
    }

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirect }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(data.error || copy.admin.login.error);
        return;
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Erro ao enviar. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-semibold text-foreground mb-2">
            {copy.admin.login.title}
          </h1>
          <p className="text-muted-dark">
            {copy.admin.login.subtitle}
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-cream rounded-lg p-6 text-center">
            <p className="text-foreground font-medium">
              {copy.admin.login.success}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.admin.login.emailPlaceholder}
                className="w-full px-4 py-3 border border-muted-light rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy transition-colors"
                disabled={status === 'loading'}
                autoComplete="email"
                autoFocus
              />
            </div>

            {status === 'error' && (
              <p className="text-burgundy text-sm">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-foreground text-background py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? copy.admin.login.sending : copy.admin.login.submitButton}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm text-muted-dark hover:text-foreground transition-colors"
          >
            Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
}
