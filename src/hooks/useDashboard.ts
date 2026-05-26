import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: adminService.getDashboardStats,
  });
};
