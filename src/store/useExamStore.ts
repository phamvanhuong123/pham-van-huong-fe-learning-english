import { create } from 'zustand';
import type { AdminExamItem } from '../types/exam.type';

interface ExamState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  toggleSelectedId: (id: string) => void;
  toggleAllSelectedIds: (ids: string[]) => void;
  clearSelectedIds: () => void;

  isDialogOpen: boolean;
  selectedExam: AdminExamItem | null;
  openAddDialog: () => void;
  openEditDialog: (exam: AdminExamItem) => void;
  closeDialog: () => void;

  deletingExam: AdminExamItem | null;
  setDeletingExam: (exam: AdminExamItem | null) => void;

  isBulkDeleteOpen: boolean;
  setIsBulkDeleteOpen: (isOpen: boolean) => void;
}

export const useExamStore = create<ExamState>((set) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  toggleSelectedId: (id) => set((state) => ({
    selectedIds: state.selectedIds.includes(id)
      ? state.selectedIds.filter((i) => i !== id)
      : [...state.selectedIds, id]
  })),
  toggleAllSelectedIds: (ids) => set((state) => ({
    selectedIds: state.selectedIds.length === ids.length ? [] : ids
  })),
  clearSelectedIds: () => set({ selectedIds: [] }),

  isDialogOpen: false,
  selectedExam: null,
  openAddDialog: () => set({ isDialogOpen: true, selectedExam: null }),
  openEditDialog: (exam) => set({ isDialogOpen: true, selectedExam: exam }),
  closeDialog: () => set({ isDialogOpen: false, selectedExam: null }),

  deletingExam: null,
  setDeletingExam: (exam) => set({ deletingExam: exam }),

  isBulkDeleteOpen: false,
  setIsBulkDeleteOpen: (isOpen) => set({ isBulkDeleteOpen: isOpen }),
}));
