import authorizedAxiosInstance from '@/utils/authorizeAxios'

const API_ROOT = `/question`

export const getQuestionsApi = async (params: any) => {
  return await authorizedAxiosInstance.get(API_ROOT, { params })
}

export const getQuestionsByExamApi = async (examId: string) => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/exam/${examId}`)
}

export const getQuestionDetailApi = async (id: string) => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/${id}`)
}

export const getGroupDetailApi = async (groupId: string) => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/group/${groupId}`)
}

export const uploadMediaApi = async (formData: FormData) => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteMediaApi = async (url: string) => {
  return await authorizedAxiosInstance.delete(`${API_ROOT}/media`, { data: { url } })
}

export const createStandaloneQuestionApi = async (data: any) => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/standalone`, data)
}

export const createQuestionGroupApi = async (data: any) => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/group`, data)
}

export const updateQuestionApi = async (id: string, data: any) => {
  return await authorizedAxiosInstance.patch(`${API_ROOT}/${id}`, data)
}

export const updatePassageGroupApi = async (groupId: string, data: any) => {
  return await authorizedAxiosInstance.patch(`${API_ROOT}/group/${groupId}`, data)
}

export const deleteQuestionApi = async (id: string) => {
  return await authorizedAxiosInstance.delete(`${API_ROOT}/${id}`)
}

export const deleteQuestionGroupApi = async (groupId: string) => {
  return await authorizedAxiosInstance.delete(`${API_ROOT}/group/${groupId}`)
}

export const getNoteApi = async (id: string) => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/${id}/note`)
}

export const upsertNoteApi = async (id: string, data: { content: string }) => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/${id}/note`, data)
}

export const deleteNoteApi = async (id: string) => {
  return await authorizedAxiosInstance.delete(`${API_ROOT}/${id}/note`)
}
