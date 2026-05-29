import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';

export const useLogs = (filters: { page?: number; limit?: number; action?: string }) => {
  return useQuery({
    queryKey: ['adminLogs', filters],
    queryFn: () => adminService.getLogs(filters),
  });
};
