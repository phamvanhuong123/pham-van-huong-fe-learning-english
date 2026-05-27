import authorizedAxiosInstance from '../utils/authorizeAxios';

const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:5000/api/v1';

// ─── TYPES ────────────────────────────────────────────────────────
export interface DashboardStats {
  totalUsers: number;
  totalExams: number;
  totalResults: number;
}

export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId?: string;
  detail?: any;
  createdAt: string;
  admin: { name: string; email: string };
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: AdminLog[];
}

export interface UserRoleDTO {
  role: { name: string };
  grantedAt: string;
  expiresAt: string | null;
}

export interface UserListDTO {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  isBanned: boolean;
  createdAt: string;
  vipExpiresAt: string | null;
  userRoles: UserRoleDTO[];
  _count: { sessions: number };
}

export interface UserDetailDTO extends UserListDTO {
  sessions: any[];
  results: any[];
  adminLogs: AdminLog[];
}

export interface RoleDTO {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  _count: { userRoles: number };
}

export interface PermissionDTO {
  id: string;
  code: string;
  description: string;
  group: string;
}

export interface BroadcastPayload {
  title: string;
  body: string;
  type: string;
  targetRole: string;
}

// ─── SERVICES ─────────────────────────────────────────────────────

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const res = await authorizedAxiosInstance.get<{ data: DashboardData }>('/admin/dashboard/stats');
    return res.data.data;
  },

  // Users
  getUsers: async (params: { page?: number; limit?: number; search?: string; role?: string; status?: string }) => {
    const res = await authorizedAxiosInstance.get<{ data: { users: UserListDTO[]; pagination: any } }>('/admin/users', { params });
    return res.data.data;
  },
  getUserById: async (id: string) => {
    const res = await authorizedAxiosInstance.get<{ data: UserDetailDTO }>(`/admin/users/${id}`);
    return res.data.data;
  },
  banUser: async (id: string, isBanned: boolean, reason?: string) => {
    const res = await authorizedAxiosInstance.patch(`/admin/users/${id}/ban`, { isBanned, reason });
    return res.data;
  },
  updateUserRole: async (id: string, role: string) => {
    const res = await authorizedAxiosInstance.patch(`/admin/users/${id}/role`, { role });
    return res.data;
  },
  resetUserPassword: async (id: string) => {
    const res = await authorizedAxiosInstance.post(`/admin/users/${id}/reset-password`);
    return res.data;
  },
  kickUserSessions: async (id: string) => {
    const res = await authorizedAxiosInstance.delete(`/admin/users/${id}/sessions`);
    return res.data;
  },

  // Roles
  getRoles: async () => {
    const res = await authorizedAxiosInstance.get<{ data: RoleDTO[] }>('/admin/roles');
    return res.data.data;
  },
  getPermissions: async () => {
    const res = await authorizedAxiosInstance.get<{ data: PermissionDTO[] }>('/admin/roles/permissions');
    return res.data.data;
  },
  getRolePermissions: async (id: string) => {
    const res = await authorizedAxiosInstance.get<{ data: string[] }>(`/admin/roles/${id}/permissions`);
    return res.data.data;
  },
  updateRolePermissions: async (id: string, permissionIds: string[]) => {
    const res = await authorizedAxiosInstance.put(`/admin/roles/${id}/permissions`, { permissionIds });
    return res.data;
  },

  // Notifications
  getBroadcasts: async (params: { page?: number; limit?: number }) => {
    const res = await authorizedAxiosInstance.get<{ data: { broadcasts: any[]; pagination: any } }>('/admin/notifications', { params });
    return res.data.data;
  },
  sendBroadcast: async (payload: BroadcastPayload) => {
    const res = await authorizedAxiosInstance.post('/admin/notifications/broadcast', payload);
    return res.data;
  },

  // Logs
  getLogs: async (params: { page?: number; limit?: number; action?: string }) => {
    const res = await authorizedAxiosInstance.get<{ data: { logs: AdminLog[]; pagination: any } }>('/admin/logs', { params });
    return res.data.data;
  },

  // Trash
  getTrash: async (params: { type: string; page?: number; limit?: number }) => {
    const res = await authorizedAxiosInstance.get<{ data: { items: any[]; pagination: any } }>('/admin/trash', { params });
    return res.data.data;
  },
  restoreTrash: async (type: string, id: string) => {
    const res = await authorizedAxiosInstance.patch(`/admin/trash/${type}/${id}/restore`);
    return res.data;
  },
  hardDeleteTrash: async (type: string, id: string) => {
    const res = await authorizedAxiosInstance.delete(`/admin/trash/${type}/${id}`);
    return res.data;
  },

  // Vocab (System)
  getSystemVocabs: async (params: any) => {
    const res = await authorizedAxiosInstance.get<{ data: any; meta: any }>('/admin/vocab', { params });
    return res.data;
  },
  createSystemVocab: async (data: any) => {
    const res = await authorizedAxiosInstance.post('/admin/vocab', data);
    return res.data;
  },
  updateSystemVocab: async (id: string, data: any) => {
    const res = await authorizedAxiosInstance.put(`/admin/vocab/${id}`, data);
    return res.data;
  },
  deleteSystemVocab: async (id: string) => {
    const res = await authorizedAxiosInstance.delete(`/admin/vocab/${id}`);
    return res.data;
  },
  importSystemCsv: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await authorizedAxiosInstance.post<{ data: any }>('/admin/vocab/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Subscriptions Extended
  editPendingSubscription: async (id: string, data: { plan: string; amount: number }) => {
    const res = await authorizedAxiosInstance.put(`/admin/subscriptions/${id}`, data);
    return res.data;
  },
  revokeSubscription: async (id: string, reason: string) => {
    const res = await authorizedAxiosInstance.post(`/admin/subscriptions/${id}/revoke`, { reason });
    return res.data;
  },
  deleteSubscription: async (id: string) => {
    const res = await authorizedAxiosInstance.delete(`/admin/subscriptions/${id}`);
    return res.data;
  },

  // Banned Bank Accounts
  getBannedBankAccounts: async () => {
    const res = await authorizedAxiosInstance.get('/admin/subscriptions/banned-accounts');
    return res.data.data;
  },
  banBankAccount: async (data: { bankAccountNo: string; reason?: string }) => {
    const res = await authorizedAxiosInstance.post('/admin/subscriptions/banned-accounts', data);
    return res.data;
  },
  unbanBankAccount: async (id: string) => {
    const res = await authorizedAxiosInstance.delete(`/admin/subscriptions/banned-accounts/${id}`);
    return res.data;
  }
};
