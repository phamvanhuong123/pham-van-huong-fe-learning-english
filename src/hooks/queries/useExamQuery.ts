import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExamsApi, createExamApi, updateExamApi, deleteExamApi } from '@/services/examService';
import type { AdminExamItem, ExamCreateBody } from '@/types/exam.type';
import { toast } from 'sonner';

// TOEIC Question Count Mapping
const PART_QUESTION_COUNT: Record<string, number> = {
  PART1: 6,
  PART2: 25,
  PART3: 39,
  PART4: 30,
  PART5: 30,
  PART6: 16,
  PART7: 54,
  FULL: 200
};

export const EXAM_QUERY_KEYS = {
  all: ['exams'] as const,
};

export const useExams = () => {
  return useQuery({
    queryKey: EXAM_QUERY_KEYS.all,
    queryFn: async () => {
      const response = await getExamsApi();
      return response.data.data; // Raw array from backend
    },
    select: (fetchedExams: any[]): AdminExamItem[] => {
      // Map data and compute questionCount and childExams
      return fetchedExams.map((e) => {
        let childExams: { id: string; part: any; title: string; questionCount: number }[] | undefined = undefined;

        if (e.part === 'FULL') {
          const children = fetchedExams.filter((child) => child.parentExamId === e.id);
          childExams = children.map((c) => ({
            id: c.id,
            part: c.part,
            title: c.title,
            questionCount: PART_QUESTION_COUNT[c.part] || 0
          }));
        }

        return {
          id: e.id,
          title: e.title,
          description: e.description,
          part: e.part,
          difficulty: e.difficulty,
          type: e.type,
          duration: e.duration,
          isPublished: e.isPublished,
          questionCount: PART_QUESTION_COUNT[e.part] || 0,
          parentExamId: e.parentExamId,
          childExams
        };
      });
    }
  });
};

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExamCreateBody) => createExamApi(data),
    onSuccess: (response) => {
      toast.success('Tạo đề thi mới thành công!');
      const newExam = response.data.data;
      // Cập nhật local cache thay vì gọi lại API
      queryClient.setQueryData(EXAM_QUERY_KEYS.all, (oldData: any[] | undefined) => {
        if (!oldData) return [newExam];
        return [newExam, ...oldData];
      });
    },
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExamCreateBody> & { isPublished?: boolean } }) => 
      updateExamApi(id, data),
    onSuccess: (response) => {
      const updatedExam = response.data.data;
      // Cập nhật local cache thay vì gọi lại API
      queryClient.setQueryData(EXAM_QUERY_KEYS.all, (oldData: any[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(exam => exam.id === updatedExam.id ? updatedExam : exam);
      });
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExamApi(id),
    onSuccess: (_, deletedId) => {
      // Xóa khỏi local cache thay vì gọi lại API
      queryClient.setQueryData(EXAM_QUERY_KEYS.all, (oldData: any[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(exam => exam.id !== deletedId);
      });
    },
  });
};
