import authorizedAxiosInstance from '@/utils/authorizeAxios';

const API_ROOT = `/client-exam`;

export const getPublishedExamsApi = async (params?: any) => {
  return await authorizedAxiosInstance.get(API_ROOT, { params });
};

export const getExamDetailsForClientApi = async (id: string) => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/${id}`);
};

export const startExamApi = async (id: string) => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/${id}/start`);
};

export const autoSaveExamApi = async (id: string, data: { resultId: string; answers: Record<string, string>; timeTaken: number; tabSwitchCount: number }) => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/${id}/autosave`, data);
};

export const submitExamApi = async (id: string, data: { resultId: string; answers: Record<string, string>; timeTaken: number; tabSwitchCount: number }) => {
  return await authorizedAxiosInstance.post(`${API_ROOT}/${id}/submit`, data);
};
