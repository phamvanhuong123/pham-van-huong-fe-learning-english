import authorizedAxiosInstance from '@/utils/authorizeAxios';

const API_ROOT = '/profile';

export const getProfileApi = async () => {
  return await authorizedAxiosInstance.get(`${API_ROOT}`);
};

export const updateProfileApi = async (data: { name?: string; targetScore?: number; examDate?: string }) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}`, data);
};

export const uploadAvatarApi = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return await authorizedAxiosInstance.post(`${API_ROOT}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const changePasswordApi = async (data: any) => {
  return await authorizedAxiosInstance.put(`${API_ROOT}/change-password`, data);
};

export const getProfileStatsApi = async () => {
  return await authorizedAxiosInstance.get(`${API_ROOT}/stats`);
};

export const deleteAccountApi = async (data: any) => {
  return await authorizedAxiosInstance.delete(`${API_ROOT}`, { data });
};
