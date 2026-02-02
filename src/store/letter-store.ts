import { create } from 'zustand';
import type { Letter, City } from '@/types';

interface LetterFormState {
  content: string;
  isAnonymous: boolean;
  author: string;
  selectedCity: City | null;
}

interface LetterStore {
  // Form state
  form: LetterFormState;
  setContent: (content: string) => void;
  setIsAnonymous: (isAnonymous: boolean) => void;
  setAuthor: (author: string) => void;
  setSelectedCity: (city: City | null) => void;
  resetForm: () => void;

  // Submitted letter for sharing
  submittedLetter: Letter | null;
  setSubmittedLetter: (letter: Letter | null) => void;

  // Modal states
  isShareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  isFormModalOpen: boolean;
  setFormModalOpen: (open: boolean) => void;

  // Selected letter for viewing
  selectedLetterId: string | null;
  setSelectedLetterId: (id: string | null) => void;
}

const initialFormState: LetterFormState = {
  content: '',
  isAnonymous: true,
  author: '',
  selectedCity: null,
};

export const useLetterStore = create<LetterStore>((set) => ({
  form: initialFormState,
  setContent: (content) =>
    set((state) => ({ form: { ...state.form, content } })),
  setIsAnonymous: (isAnonymous) =>
    set((state) => ({ form: { ...state.form, isAnonymous } })),
  setAuthor: (author) =>
    set((state) => ({ form: { ...state.form, author } })),
  setSelectedCity: (selectedCity) =>
    set((state) => ({ form: { ...state.form, selectedCity } })),
  resetForm: () => set({ form: initialFormState }),

  submittedLetter: null,
  setSubmittedLetter: (submittedLetter) => set({ submittedLetter }),

  isShareModalOpen: false,
  setShareModalOpen: (isShareModalOpen) => set({ isShareModalOpen }),
  isFormModalOpen: false,
  setFormModalOpen: (isFormModalOpen) => set({ isFormModalOpen }),

  selectedLetterId: null,
  setSelectedLetterId: (selectedLetterId) => set({ selectedLetterId }),
}));
