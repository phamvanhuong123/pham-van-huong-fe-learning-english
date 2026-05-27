import type { Vocab, CreateVocabDto, UpdateVocabDto, VocabQuery, VocabStats } from '@/types/vocab.type';
import authorizedAxiosInstance from '@/utils/authorizeAxios';

const API_ROOT = '/vocab';

export const vocabService = {
  async getVocabs(query: VocabQuery) {
    const res = await authorizedAxiosInstance.get<{ data: Vocab[]; meta: any }>(API_ROOT, { params: query });
    return res.data;
  },

  async getVocabStats() {
    const res = await authorizedAxiosInstance.get<VocabStats>(`${API_ROOT}/stats`);
    return res.data;
  },

  async createVocab(data: CreateVocabDto) {
    if (data.audioFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'audioFile') {
          formData.append(key, value as string);
        }
      });
      formData.append('audio', data.audioFile);
      
      const res = await authorizedAxiosInstance.post<Vocab>(API_ROOT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    }

    const res = await authorizedAxiosInstance.post<Vocab>(API_ROOT, data);
    return res.data;
  },

  async updateVocab(id: string, data: UpdateVocabDto) {
    if (data.audioFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'audioFile') {
          formData.append(key, value as string);
        }
      });
      formData.append('audio', data.audioFile);

      const res = await authorizedAxiosInstance.put<Vocab>(`${API_ROOT}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    }

    const res = await authorizedAxiosInstance.put<Vocab>(`${API_ROOT}/${id}`, data);
    return res.data;
  },

  async deleteVocab(id: string) {
    const res = await authorizedAxiosInstance.delete<{ message: string }>(`${API_ROOT}/${id}`);
    return res.data;
  },

  async importCsv(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await authorizedAxiosInstance.post<{ data: any }>(`${API_ROOT}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  exportCsvUrl() {
    return `${import.meta.env.VITE_API_ROOT || 'http://localhost:5000/api/v1'}${API_ROOT}/export`;
  }
};

