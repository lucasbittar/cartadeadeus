'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CitySearch } from './city-search';
import { useLetterStore } from '@/store/letter-store';
import { copy } from '@/constants/copy';
import type { Letter, LetterInput } from '@/types';

const MAX_CHARS = 280;

async function submitLetter(input: LetterInput): Promise<Letter> {
  const response = await fetch('/api/letters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to submit letter');
  }

  return response.json();
}

export function LetterForm() {
  const queryClient = useQueryClient();
  const {
    form,
    setContent,
    setIsAnonymous,
    setAuthor,
    setSelectedCity,
    resetForm,
    setSubmittedLetter,
    setShareModalOpen,
    setFormModalOpen,
  } = useLetterStore();

  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: submitLetter,
    onSuccess: (letter) => {
      queryClient.invalidateQueries({ queryKey: ['letters-markers'] });
      queryClient.invalidateQueries({ queryKey: ['letters-feed'] });
      setSubmittedLetter(letter);
      resetForm();
      setFormModalOpen(false);
      setShareModalOpen(true);
    },
    onError: () => {
      setError('Erro ao enviar carta. Tente novamente.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.content.trim()) {
      setError('Escreva algo na sua carta.');
      return;
    }

    if (!form.selectedCity) {
      setError('Selecione sua cidade.');
      return;
    }

    mutation.mutate({
      content: form.content.trim(),
      author: form.isAnonymous ? undefined : form.author,
      is_anonymous: form.isAnonymous,
      lat: form.selectedCity.lat,
      lng: form.selectedCity.lng,
      city: form.selectedCity.fullName,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Textarea
          id="letter-content"
          placeholder={copy.form.placeholder}
          value={form.content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
          rows={6}
          charCount={form.content.length}
          maxChars={MAX_CHARS}
          className="min-h-[160px]"
        />
      </div>

      <CitySearch
        value={form.selectedCity}
        onChange={setSelectedCity}
      />

      <div className="space-y-4">
        <Switch
          checked={form.isAnonymous}
          onChange={setIsAnonymous}
          label={copy.form.anonymousLabel}
        />

        <motion.div
          initial={false}
          animate={{
            height: form.isAnonymous ? 0 : 'auto',
            opacity: form.isAnonymous ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {!form.isAnonymous && (
            <Input
              id="author-name"
              placeholder="Seu nome"
              value={form.author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          )}
        </motion.div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={mutation.isPending}
      >
        {mutation.isPending ? copy.form.submitting : copy.form.submitButton}
      </Button>
    </form>
  );
}
