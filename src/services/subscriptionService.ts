import authorizedAxiosInstance from '@/utils/authorizeAxios';
import type { 
  Subscription, 
  CreateSubscriptionDto, 
  RejectSubscriptionDto,
  BanBankAccountDto,
  SubscriptionQueryFilters 
} from '@/types/subscription.type';

export const subscriptionService = {
  // --- USER API ---
  createSubscription: async (data: CreateSubscriptionDto): Promise<{ data: Subscription }> => {
    const formData = new FormData();
    formData.append('plan', data.plan);
    formData.append('bankAccountNo', data.bankAccountNo);
    formData.append('transactionRef', data.transactionRef);
    formData.append('amount', data.amount.toString());
    formData.append('image', data.image);

    const response = await authorizedAxiosInstance.post('/v1/subscription', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMySubscriptions: async (): Promise<{ data: Subscription[] }> => {
    const response = await authorizedAxiosInstance.get('/v1/subscription/mine');
    return response.data;
  },

  // --- ADMIN API ---
  getAdminSubscriptions: async (filters: SubscriptionQueryFilters) => {
    const response = await authorizedAxiosInstance.get('/v1/admin/subscriptions', { params: filters });
    return response.data;
  },

  approveSubscription: async (id: string): Promise<{ data: Subscription, message: string }> => {
    const response = await authorizedAxiosInstance.post(`/v1/admin/subscriptions/${id}/approve`);
    return response.data;
  },

  rejectSubscription: async (id: string, data: RejectSubscriptionDto): Promise<{ data: Subscription, message: string }> => {
    const response = await authorizedAxiosInstance.post(`/v1/admin/subscriptions/${id}/reject`, data);
    return response.data;
  },

  banBankAccount: async (data: BanBankAccountDto): Promise<{ message: string }> => {
    const response = await authorizedAxiosInstance.post('/v1/admin/subscriptions/ban-account', data);
    return response.data;
  }
};
