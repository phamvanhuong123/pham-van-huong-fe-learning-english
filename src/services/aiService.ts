import authorizedAxiosInstance from '../utils/authorizeAxios'
import type { IResponse } from '@/types/api.type'
import type { AxiosResponse } from 'axios'

const API_ROOT = `/ai`

export interface ExplainQuestionPayload {
  questionId: string
  questionText?: string
  options: { label: string; text: string }[]
  correctLabel?: string
  part?: string
  passageContent?: string
  forceRefresh?: boolean
}

export interface AIExplanationResponse {
  content: string
  model: string
  cached: boolean
}

export const getAIExplanationApi = async (
  payload: ExplainQuestionPayload
): Promise<AxiosResponse<IResponse<AIExplanationResponse>>> => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/explain-question`, payload)
}

export interface AskFollowUpPayload {
  questionContext?: string
  originalExplanation: string
  chatHistory?: { user: string; ai: string }[]
  userQuestion: string
}

export const askAIFollowUpApi = async (
  payload: AskFollowUpPayload
): Promise<AxiosResponse<IResponse<AIExplanationResponse>>> => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/follow-up`, payload)
}

export const generateTakeawayApi = async (payload: {
  questionText?: string
  explanation: string
}): Promise<AxiosResponse<IResponse<{ content: string }>>> => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/takeaway`, payload)
}
