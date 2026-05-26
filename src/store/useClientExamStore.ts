import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ExamState {
  resultId: string | null;
  examId: string | null;
  answers: Record<string, string>;
  bookmarks: string[];
  timeTaken: number;
  tabSwitchCount: number;
  status: 'IDLE' | 'IN_PROGRESS' | 'COMPLETED';
  isSubmitting: boolean;
  lastSavedAt: number | null; // Dùng để tính thời gian khi user đóng tab và quay lại
  
  // Actions
  initExam: (resultId: string, examId: string, initialAnswers?: Record<string, string>, initialTimeTaken?: number, initialTabSwitchCount?: number) => void;
  selectAnswer: (questionId: string, label: string) => void;
  toggleBookmark: (questionId: string) => void;
  incrementTimeTaken: () => void;
  incrementTabSwitchCount: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setStatus: (status: 'IN_PROGRESS' | 'COMPLETED') => void;
  clearExam: () => void;
  syncOfflineTime: () => void; // Hàm bù đắp thời gian
}

export const useClientExamStore = create<ExamState>()(
  persist(
    (set) => ({
      resultId: null,
      examId: null,
      answers: {},
      bookmarks: [],
      timeTaken: 0,
      tabSwitchCount: 0,
      status: 'IDLE',
      isSubmitting: false,
      lastSavedAt: null,

      initExam: (resultId, examId, initialAnswers = {}, initialTimeTaken = 0, initialTabSwitchCount = 0) => set({
        resultId,
        examId,
        answers: initialAnswers,
        timeTaken: initialTimeTaken,
        tabSwitchCount: initialTabSwitchCount,
        status: 'IN_PROGRESS',
        isSubmitting: false,
        bookmarks: [],
        lastSavedAt: Date.now(),
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
        timeTaken: state.timeTaken + 1,
        lastSavedAt: Date.now(),
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
        lastSavedAt: null,
      }),

      syncOfflineTime: () => set((state) => {
        if (state.status !== 'IN_PROGRESS' || !state.lastSavedAt) return state;
        const now = Date.now();
        // Tính số giây trôi qua từ lần cuối lưu
        const diffSeconds = Math.floor((now - state.lastSavedAt) / 1000);
        
        if (diffSeconds > 0) {
          return {
            timeTaken: state.timeTaken + diffSeconds,
            lastSavedAt: now
          };
        }
        return state;
      })
    }),
    {
      name: 'client-exam-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        resultId: state.resultId,
        examId: state.examId,
        answers: state.answers,
        bookmarks: state.bookmarks,
        timeTaken: state.timeTaken,
        tabSwitchCount: state.tabSwitchCount,
        status: state.status,
        lastSavedAt: state.lastSavedAt,
      }), // Không lưu isSubmitting
    }
  )
);
