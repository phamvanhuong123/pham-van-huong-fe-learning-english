import axios from 'axios';
import type { LoginPayload, RegisterRequest } from '../types/auth.type';
import { useAuthStore } from '../store/useAuthStore';

const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:5000';


export const loginApi = async (data: LoginPayload) => {
    return await axios.post(`${API_ROOT}/v1/auth/login`, data, {
        withCredentials: true
    });
};

export const registerApi = async (data: RegisterRequest) => {
    return await axios.post(`${API_ROOT}/v1/auth/register`, data);
};

export const verifyEmailApi = async (token: string) => {
    return await axios.get(`${API_ROOT}/v1/auth/verify-email?token=${token}`);
};
export const handleLogoutApi = async () => {
    // Xoá sạch thông tin đăng nhập trong Zustand Store & localStorage
    useAuthStore.getState().clearAuth();

    return await axios.delete(`${API_ROOT}/v1/auth/logout`, {
        withCredentials: true
    });
};

export const refreshTokenApi = async () => {
    // Không cần truyền refreshToken lên body nữa vì trình duyệt tự động gửi kèm cookie
    return await axios.put(`${API_ROOT}/v1/auth/refresh-token`, null, {
        withCredentials: true
    });
};
