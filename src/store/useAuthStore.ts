import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { connectSocket, disconnectSocket } from '../lib/socket';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: string;
}

interface AuthState {
  userInfo: UserInfo | null;
  accessToken: string | null;
  setAuth: (user: UserInfo, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userInfo: null,
      accessToken: null,

      setAuth: (user, token) => {
        set({ userInfo: user, accessToken: token });
        connectSocket(token);
      },

      clearAuth: () => {
        set({ userInfo: null, accessToken: null });
        disconnectSocket();
      },
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
    }
  )
);
