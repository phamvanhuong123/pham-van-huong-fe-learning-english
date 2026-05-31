import authorizedAxiosInstance from '@/utils/authorizeAxios';
import type {
  GrammarTopic,
  AdminGrammarQuestion,
  CreateGrammarTopicInput,
  UpdateGrammarTopicInput,
  CreateGrammarQuestionInput,
  UpdateGrammarQuestionInput,
  GrammarPracticeStartResponse,
  GrammarAnswerResponse
} from '@/types/grammar.type';

export const grammarService = {
  getAdminTopics: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await authorizedAxiosInstance.get('/admin/grammar', { params });
    return response.data;
  },

  getAdminTopicById: async (id: string) => {
    const response = await authorizedAxiosInstance.get<{ data: GrammarTopic }>(`/admin/grammar/${id}`);
    return response.data.data;
  },

  createTopic: async (data: CreateGrammarTopicInput) => {
    const response = await authorizedAxiosInstance.post<{ data: GrammarTopic }>('/admin/grammar', data);
    return response.data.data;
  },

  updateTopic: async (id: string, data: UpdateGrammarTopicInput) => {
    const response = await authorizedAxiosInstance.put<{ data: GrammarTopic }>(`/admin/grammar/${id}`, data);
    return response.data.data;
  },

  deleteTopic: async (id: string) => {
    const response = await authorizedAxiosInstance.delete(`/admin/grammar/${id}`);
    return response.data;
  },

  getTopicQuestions: async (topicId: string) => {
    const response = await authorizedAxiosInstance.get<{ data: { topic: GrammarTopic; questions: AdminGrammarQuestion[] } }>(
      `/admin/grammar/${topicId}/questions`
    );
    return response.data.data;
  },

  createTopicQuestion: async (topicId: string, data: CreateGrammarQuestionInput) => {
    const response = await authorizedAxiosInstance.post<{ data: AdminGrammarQuestion }>(
      `/admin/grammar/${topicId}/questions`,
      data
    );
    return response.data.data;
  },

  updateTopicQuestion: async (questionId: string, data: UpdateGrammarQuestionInput) => {
    const response = await authorizedAxiosInstance.put<{ data: AdminGrammarQuestion }>(
      `/admin/grammar/questions/${questionId}`,
      data
    );
    return response.data.data;
  },

  deleteTopicQuestion: async (questionId: string) => {
    const response = await authorizedAxiosInstance.delete(`/admin/grammar/questions/${questionId}`);
    return response.data;
  },


  getClientTopics: async () => {
    const response = await authorizedAxiosInstance.get<{ data: GrammarTopic[] }>('/grammar');
    return response.data.data;
  },

  startPracticeSession: async (slug: string) => {
    const response = await authorizedAxiosInstance.post<{ data: GrammarPracticeStartResponse }>(`/grammar/${slug}/start`);
    return response.data.data;
  },

  submitAnswer: async (sessionId: string, data: { questionId: string; selectedLabel: string; timeTakenSeconds: number }) => {
    const response = await authorizedAxiosInstance.post<{ data: GrammarAnswerResponse }>(`/grammar/session/${sessionId}/answer`, data);
    return response.data.data;
  },

  endPracticeSession: async (sessionId: string) => {
    const response = await authorizedAxiosInstance.post(`/grammar/session/${sessionId}/end`);
    return response.data.data;
  }
};

