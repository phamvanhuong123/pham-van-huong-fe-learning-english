import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscriptionService';
import type { CreateSubscriptionDto, RejectSubscriptionDto, BanBankAccountDto, SubscriptionQueryFilters } from '@/types/subscription.type';
import { adminService } from '@/services/adminService';

// --- Query Keys ---
export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  mine: () => [...subscriptionKeys.all, 'mine'] as const,
  adminList: (filters: SubscriptionQueryFilters) => [...subscriptionKeys.all, 'admin', filters] as const,
};

// --- USER HOOKS ---
export const useMySubscriptions = () => {
  return useQuery({
    queryKey: subscriptionKeys.mine(),
    queryFn: () => subscriptionService.getMySubscriptions(),
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSubscriptionDto) => subscriptionService.createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.mine() });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.adminList({}) });
    },
  });
};

// --- ADMIN HOOKS ---
export const useAdminSubscriptions = (filters: SubscriptionQueryFilters) => {
  return useQuery({
    queryKey: subscriptionKeys.adminList(filters),
    queryFn: () => subscriptionService.getAdminSubscriptions(filters),
  });
};

export const useApproveSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => subscriptionService.approveSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.adminList({}) });
    },
  });
};

export const useRejectSubscription = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: RejectSubscriptionDto }) => subscriptionService.rejectSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.adminList({}) });
    },
  });
};

export const useBanBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BanBankAccountDto) => adminService.banBankAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannedBankAccounts'] });
    }
  });
};

export const useEditSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: { plan: string, amount: number } }) => adminService.editPendingSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.adminList({}) });
    },
  });
};

export const useRevokeSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => adminService.revokeSubscription(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.adminList({}) });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.adminList({}) });
    },
  });
};

export const useBannedBankAccounts = () => {
  return useQuery({
    queryKey: ['bannedBankAccounts'],
    queryFn: () => adminService.getBannedBankAccounts(),
  });
};

export const useUnbanBankAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.unbanBankAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannedBankAccounts'] });
    },
  });
};
