import { create } from 'zustand';
import type { Vocab } from '@/types/vocab.type';

interface FlashcardStore {
  sessionId: string | null;
  cards: Vocab[];
  currentIndex: number;
  isFlipped: boolean;
  completedCount: number;
  isSessionActive: boolean;

  setSession: (sessionId: string, cards: Vocab[]) => void;
  flipCard: () => void;
  nextCard: () => void;
  requeueCard: (card: Vocab) => void;
  endSession: () => void;
  resetFlipped: () => void;
}

export const useFlashcardStore = create<FlashcardStore>((set) => ({
  sessionId: null,
  cards: [],
  currentIndex: 0,
  isFlipped: false,
  completedCount: 0,
  isSessionActive: false,

  setSession: (sessionId, cards) => set({
    sessionId,
    cards,
    currentIndex: 0,
    isFlipped: false,
    completedCount: 0,
    isSessionActive: true
  }),

  flipCard: () => set({ isFlipped: true }),

  resetFlipped: () => set({ isFlipped: false }),

  nextCard: () => set((state) => {
    const nextIndex = state.currentIndex + 1;
    const isFinished = nextIndex >= state.cards.length;
    return {
      currentIndex: nextIndex,
      completedCount: state.completedCount + 1,
      isFlipped: false,
      isSessionActive: !isFinished
    };
  }),

  requeueCard: (card) => set((state) => ({
    cards: [...state.cards, card],
    isSessionActive: true
  })),

  endSession: () => set({
    sessionId: null,
    cards: [],
    currentIndex: 0,
    isFlipped: false,
    completedCount: 0,
    isSessionActive: false
  })
}));
