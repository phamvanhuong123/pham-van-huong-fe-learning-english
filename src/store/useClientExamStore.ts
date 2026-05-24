import { create } from 'zustand';

interface ExamState {
  resultId: string | null;
  examId: string | null;
  answers: Record<string, string>;
  bookmarks: string[];
  timeTaken: number;
  tabSwitchCount: number;
  status: 'IDLE' | 'IN_PROGRESS' | 'COMPLETED';
  isSubmitting: boolean;
  
  // Actions
  initExam: (resultId: string, examId: string, initialAnswers?: Record<string, string>, initialTimeTaken?: number, initialTabSwitchCount?: number) => void;
  selectAnswer: (questionId: string, label: string) => void;
  toggleBookmark: (questionId: string) => void;
  incrementTimeTaken: () => void;
  incrementTabSwitchCount: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setStatus: (status: 'IN_PROGRESS' | 'COMPLETED') => void;
  clearExam: () => void;
}

export const useClientExamStore = create<ExamState>((set) => ({
  resultId: null,
  examId: null,
  answers: {},
  bookmarks: [],
  timeTaken: 0,
  tabSwitchCount: 0,
  status: 'IDLE',
  isSubmitting: false,

  initExam: (resultId, examId, initialAnswers = {}, initialTimeTaken = 0, initialTabSwitchCount = 0) => set({
    resultId,
    examId,
    answers: initialAnswers,
    timeTaken: initialTimeTaken,
    tabSwitchCount: initialTabSwitchCount,
    status: 'IN_PROGRESS',
    isSubmitting: false,
    bookmarks: [],
  }),

  selectAnswer: (questionId, label) => set((state) => ({
    answers: { ...state.answers, [questionId]: label }
  })),

  toggleBookmark: (questionId) => set((state) => ({
    bookmarks: state.bookmarks.includes(questionId)
      ? state.bookmarks.filter(id => id !== questionId)
      : [...state.bookmarks, questionId]
  })),

  incrementTimeTaken: () => set((state) => ({
    timeTaken: state.timeTaken + 1
  })),

  incrementTabSwitchCount: () => set((state) => ({
    tabSwitchCount: state.tabSwitchCount + 1
  })),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  
  setStatus: (status) => set({ status }),

  clearExam: () => set({
    resultId: null,
    examId: null,
    answers: {},
    bookmarks: [],
    timeTaken: 0,
    tabSwitchCount: 0,
    status: 'IDLE',
    isSubmitting: false,
  })
}));
