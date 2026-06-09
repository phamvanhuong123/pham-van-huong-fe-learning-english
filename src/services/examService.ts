import authorizedAxiosInstance from '../utils/authorizeAxios'
import type { ExamCreateBody } from '../types/exam.type'

const API_ROOT = `/exam`

export const getExamsApi = async () => {
  return await authorizedAxiosInstance.get(API_ROOT)
}

export const createExamApi = async (data: ExamCreateBody) => {
  return await authorizedAxiosInstance.post(API_ROOT, data)
}

export const updateExamApi = async (
  id: string,
  data: Partial<ExamCreateBody> & { isPublished?: boolean }
) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/${id}`, data)
}

export const deleteExamApi = async (id: string) => {
  return await authorizedAxiosInstance.delete(`${API_ROOT}/${id}`)
}
