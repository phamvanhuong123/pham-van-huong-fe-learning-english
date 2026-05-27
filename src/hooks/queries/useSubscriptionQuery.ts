import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscriptionService';
import type { CreateSubscriptionDto, RejectSubscriptionDto, BanBankAccountDto, SubscriptionQueryFilters } from '@/types/subscription.type';

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
  return useMutation({
    mutationFn: (data: BanBankAccountDto) => subscriptionService.banBankAccount(data),
  });
};
