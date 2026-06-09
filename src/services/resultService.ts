import authorizedAxiosInstance from '../utils/authorizeAxios'
import type { IResponse } from '@/types/api.type'
import type {
  ResultHistoryResponse,
  ResultRecord,
  ReviewDetailsResponse,
} from '@/types/result.type'
import type { AxiosResponse } from 'axios'

const API_ROOT = `/results`

export const getResultHistoryApi = async (
  params?: any
): Promise<AxiosResponse<IResponse<ResultHistoryResponse>>> => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/history`, { params })
}

export const getResultDetailApi = async (
  resultId: string
): Promise<AxiosResponse<IResponse<ResultRecord>>> => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/${resultId}`)
}

export const getReviewDetailsApi = async (
  resultId: string
): Promise<AxiosResponse<IResponse<ReviewDetailsResponse>>> => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/${resultId}/review`)
}

export const upsertQuestionNoteApi = async (
  questionId: string,
  content: string
): Promise<AxiosResponse<IResponse<any>>> => {
  return await authorizedAxiosInstance.post(`/question/${questionId}/note`, { content })
}

export const getQuestionNoteApi = async (
  questionId: string
): Promise<AxiosResponse<IResponse<any>>> => {
  return await authorizedAxiosInstance.get(`/question/${questionId}/note`)
}
