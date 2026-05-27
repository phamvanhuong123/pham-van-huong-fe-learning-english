import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { grammarService } from '@/services/grammarService';
import type { CreateGrammarTopicInput, UpdateGrammarTopicInput } from '@/types/grammar.type';

export const grammarKeys = {
  all: ['grammar'] as const,
  adminTopics: (params?: any) => [...grammarKeys.all, 'admin', params] as const,
  adminTopic: (id: string) => [...grammarKeys.all, 'admin', id] as const,
  clientTopics: () => [...grammarKeys.all, 'client'] as const,
};

// ─── ADMIN HOOKS ──────────────────────────────────────────────
export const useGetAdminGrammarTopics = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: grammarKeys.adminTopics(params),
    queryFn: () => grammarService.getAdminTopics(params),
  });
};

export const useGetAdminGrammarTopicById = (id: string) => {
  return useQuery({
    queryKey: grammarKeys.adminTopic(id),
    queryFn: () => grammarService.getAdminTopicById(id),
    enabled: !!id,
  });
};

export const useCreateGrammarTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGrammarTopicInput) => grammarService.createTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grammarKeys.adminTopics() });
    },
  });
};

export const useUpdateGrammarTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGrammarTopicInput }) => grammarService.updateTopic(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: grammarKeys.adminTopics() });
      queryClient.invalidateQueries({ queryKey: grammarKeys.adminTopic(variables.id) });
    },
  });
};

export const useDeleteGrammarTopic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => grammarService.deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: grammarKeys.adminTopics() });
    },
  });
};

// ─── CLIENT HOOKS ─────────────────────────────────────────────
export const useGetClientGrammarTopics = () => {
  return useQuery({
    queryKey: grammarKeys.clientTopics(),
    queryFn: () => grammarService.getClientTopics(),
  });
};

export const useStartPracticeSession = () => {
  return useMutation({
    mutationFn: (slug: string) => grammarService.startPracticeSession(slug),
  });
};

export const useSubmitGrammarAnswer = () => {
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: { questionId: string; selectedLabel: string; timeTakenSeconds: number } }) =>
      grammarService.submitAnswer(sessionId, data),
  });
};

export const useEndPracticeSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => grammarService.endPracticeSession(sessionId),
    onSuccess: () => {
      // Invalidate client topics to refresh progress
      queryClient.invalidateQueries({ queryKey: grammarKeys.clientTopics() });
    },
  });
};
