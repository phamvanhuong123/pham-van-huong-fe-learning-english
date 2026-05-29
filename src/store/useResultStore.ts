import { create } from 'zustand';
import type { ResultRecord, ReviewDetailsResponse } from '@/types/result.type';

interface ResultState {
  currentResult: ResultRecord | null;
  currentReview: ReviewDetailsResponse | null;
  history: ResultRecord[];
  
  isLoadingResult: boolean;
  isLoadingHistory: boolean;
  isLoadingReview: boolean;

  setCurrentResult: (result: ResultRecord) => void;
  setCurrentReview: (review: ReviewDetailsResponse) => void;
  setHistory: (history: ResultRecord[]) => void;
  
  setLoadingResult: (loading: boolean) => void;
  setLoadingHistory: (loading: boolean) => void;
  setLoadingReview: (loading: boolean) => void;

  clear: () => void;
}

export const useResultStore = create<ResultState>((set) => ({
  currentResult: null,
  currentReview: null,
  history: [],
  
  isLoadingResult: false,
  isLoadingHistory: false,
  isLoadingReview: false,

  setCurrentResult: (currentResult) => set({ currentResult }),
  setCurrentReview: (currentReview) => set({ currentReview }),
  setHistory: (history) => set({ history }),

  setLoadingResult: (isLoadingResult) => set({ isLoadingResult }),
  setLoadingHistory: (isLoadingHistory) => set({ isLoadingHistory }),
  setLoadingReview: (isLoadingReview) => set({ isLoadingReview }),

  clear: () => set({ currentResult: null, currentReview: null, history: [] })
}));
