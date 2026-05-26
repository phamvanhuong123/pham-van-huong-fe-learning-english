import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

export const useTrash = (type: string, filters: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['adminTrash', type, filters],
    queryFn: () => adminService.getTrash({ type, ...filters }),
  });
};

export const useRestoreTrash = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id }: { type: string; id: string }) => adminService.restoreTrash(type, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminTrash', variables.type] });
      toast.success('Khôi phục bản ghi thành công!');
    }
  });
};

export const useHardDeleteTrash = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, id }: { type: string; id: string }) => adminService.hardDeleteTrash(type, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminTrash', variables.type] });
      toast.success('Xóa vĩnh viễn bản ghi thành công!');
    }
  });
};
