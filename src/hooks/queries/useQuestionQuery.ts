import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getQuestionsApi,
  createStandaloneQuestionApi,
  createQuestionGroupApi,
  updateQuestionApi,
  updatePassageGroupApi,
  deleteQuestionApi,
  deleteQuestionGroupApi,
} from '@/services/questionService';
import type {
  QuestionQueryParams,
  QuestionsResponse,
  StandaloneQuestionPayload,
  QuestionGroupPayload,
} from '@/types/question.type';

// ============================================================
// Query Keys
// ============================================================
export const QUESTION_QUERY_KEYS = {
  all:    ['admin', 'questions'] as const,
  list:   (params: QuestionQueryParams) => ['admin', 'questions', params] as const,
};

// ============================================================
// useQuestions — Danh sách có phân trang & filter
// ============================================================
export const useQuestions = (params: QuestionQueryParams) => {
  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.list(params),
    queryFn: async (): Promise<QuestionsResponse> => {
      const res = await getQuestionsApi(params);
      return res.data?.data;
    },
    staleTime: 30_000, // 30s — không refetch ngay khi re-focus
    placeholderData: (prev) => prev, // giữ dữ liệu cũ khi đổi trang (tránh layout shift)
  });
};

// ============================================================
// useSaveQuestion — Create hoặc Update (standalone & group)
// ============================================================
interface SavePayload {
  data: StandaloneQuestionPayload | QuestionGroupPayload;
  isGroup: boolean;
  editingId?: string; // undefined = create, có id = update
}

export const useSaveQuestion = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, isGroup, editingId }: SavePayload) => {
      if (editingId) {
        return isGroup
          ? updatePassageGroupApi(editingId, data)
          : updateQuestionApi(editingId, data);
      }
      return isGroup
        ? createQuestionGroupApi(data)
        : createStandaloneQuestionApi(data);
    },
    onSuccess: (_res, { editingId }) => {
      toast.success(editingId ? 'Cập nhật thành công' : 'Tạo mới thành công');
      queryClient.invalidateQueries({ queryKey: QUESTION_QUERY_KEYS.all });
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu');
    },
  });
};

// ============================================================
// useDeleteQuestion — Xoá standalone hoặc group
// ============================================================
export const useDeleteQuestion = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isGroup }: { id: string; isGroup: boolean }) =>
      isGroup ? deleteQuestionGroupApi(id) : deleteQuestionApi(id),
    onSuccess: () => {
      toast.success('Đã xoá thành công');
      queryClient.invalidateQueries({ queryKey: QUESTION_QUERY_KEYS.all });
      onSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Không thể xoá do ràng buộc dữ liệu');
    },
  });
};
