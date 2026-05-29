import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';

export const useRoles = () => {
  return useQuery({
    queryKey: ['adminRoles'],
    queryFn: () => adminService.getRoles(),
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: ['adminPermissions'],
    queryFn: () => adminService.getPermissions(),
  });
};

export const useRolePermissions = (roleId: string) => {
  return useQuery({
    queryKey: ['adminRolePermissions', roleId],
    queryFn: () => adminService.getRolePermissions(roleId),
    enabled: !!roleId,
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permissionIds }: { id: string; permissionIds: string[] }) => 
      adminService.updateRolePermissions(id, permissionIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminRolePermissions', variables.id] });
      toast.success('Đã cập nhật phân quyền thành công');
    }
  });
};
