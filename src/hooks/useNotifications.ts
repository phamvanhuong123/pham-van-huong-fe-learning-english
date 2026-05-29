import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type BroadcastPayload } from '@/services/adminService';
import { toast } from 'sonner';

export const useBroadcasts = (filters: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['adminBroadcasts', filters],
    queryFn: () => adminService.getBroadcasts(filters),
  });
};

export const useSendBroadcast = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BroadcastPayload) => adminService.sendBroadcast(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBroadcasts'] });
      toast.success('Đã phát thông báo thành công tới người dùng!');
    }
  });
};
