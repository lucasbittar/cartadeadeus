'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/modal';
import { LetterForm } from './letter-form';
import { useLetterStore } from '@/store/letter-store';
import { copy } from '@/constants/copy';

export function LetterModal() {
  const { isFormModalOpen, setFormModalOpen } = useLetterStore();

  return (
    <Modal
      isOpen={isFormModalOpen}
      onClose={() => setFormModalOpen(false)}
      className="max-w-md"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="font-playfair text-2xl font-bold text-foreground mb-2">
          {copy.hero.cta}
        </h2>
        <p className="text-foreground/60 text-sm mb-6">
          {copy.form.charLimit}
        </p>
        <LetterForm />
      </motion.div>
    </Modal>
  );
}
