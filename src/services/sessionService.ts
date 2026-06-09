import authorizedAxiosInstance from '@/utils/authorizeAxios'

const API_ROOT = '/sessions'

export const getSessionsApi = async () => {
  return await authorizedAxiosInstance.get(`${API_ROOT}`)
}

export const revokeAllOtherSessionsApi = async () => {
  return await authorizedAxiosInstance.delete(`${API_ROOT}`)
}

export const revokeSessionApi = async (id: string) => {
  return await authorizedAxiosInstance.delete(`${API_ROOT}/${id}`)
}
