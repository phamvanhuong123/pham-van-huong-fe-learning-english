import { create } from 'zustand';
import type { AdminExamItem } from '../types/exam.type';

interface ExamState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  page: number;
  setPage: (page: number) => void;

  limit: number;
  setLimit: (limit: number) => void;

  partFilter: string;
  setPartFilter: (part: string) => void;

  difficultyFilter: string;
  setDifficultyFilter: (difficulty: string) => void;

  typeFilter: string;
  setTypeFilter: (type: string) => void;

  statusFilter: string;
  setStatusFilter: (status: string) => void;

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
  setSearchTerm: (term) => set({ searchTerm: term, page: 1 }), // Reset page on search

  page: 1,
  setPage: (page) => set({ page }),

  limit: 10,
  setLimit: (limit) => set({ limit, page: 1 }),

  partFilter: 'ALL',
  setPartFilter: (part) => set({ partFilter: part, page: 1 }),

  difficultyFilter: 'ALL',
  setDifficultyFilter: (difficulty) => set({ difficultyFilter: difficulty, page: 1 }),

  typeFilter: 'ALL',
  setTypeFilter: (type) => set({ typeFilter: type, page: 1 }),

  statusFilter: 'ALL',
  setStatusFilter: (status) => set({ statusFilter: status, page: 1 }),

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
