import authorizedAxiosInstance from '@/utils/authorizeAxios';
import type { Vocab } from '@/types/vocab.type';

const API_ROOT = '/vocab/srs';

export interface SrsDashboardStat {
  topic: string;
  newCount: number;
  learningCount: number;
  reviewCount: number;
}

export const vocabSrsApiService = {
  getDashboardStats(): Promise<SrsDashboardStat[]> {
    return authorizedAxiosInstance.get<{ data: SrsDashboardStat[] }>(`${API_ROOT}/dashboard-stats`).then(res => res.data.data);
  },

  getStudySession(topic: string, limit = 20): Promise<Vocab[]> {
    return authorizedAxiosInstance.get<{ data: Vocab[] }>(`${API_ROOT}/study-session`, { params: { topic, limit } }).then(res => res.data.data);
  },

  submitReview(vocabId: string, rating: number) {
    return authorizedAxiosInstance.post(`${API_ROOT}/${vocabId}/review`, { rating }).then(res => res.data.data);
  }
};
