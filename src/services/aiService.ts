import authorizedAxiosInstance from '../utils/authorizeAxios';
import type { IResponse } from '@/types/api.type';
import type { AxiosResponse } from 'axios';

const API_ROOT = `/ai`;

export interface ExplainQuestionPayload {
  questionId: string;
  questionText?: string;
  options: { label: string; text: string }[];
  correctLabel?: string;
  part?: string;
  passageContent?: string;
  forceRefresh?: boolean;
}

export interface AIExplanationResponse {
  content: string;
  model: string;
  cached: boolean;
}

export const getAIExplanationApi = async (payload: ExplainQuestionPayload): Promise<AxiosResponse<IResponse<AIExplanationResponse>>> => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/explain-question`, payload);
};
