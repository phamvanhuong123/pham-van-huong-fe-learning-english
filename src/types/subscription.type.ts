export interface SubscriptionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export type SubscriptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type SubscriptionPlan = 'VIP_1_MONTH' | 'VIP_3_MONTH' | 'VIP_6_MONTH';

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  proofUrl: string | null;
  bankAccountNo: string | null;
  transactionRef: string | null;
  amount: number | null;
  riskScore: number;
  riskFlags: any; // Mảng string JSON
  approvedBy: string | null;
  approvedAt: string | null;
  rejectedBy: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  user?: Partial<SubscriptionUser>;
}

export interface CreateSubscriptionDto {
  plan: SubscriptionPlan;
  bankAccountNo: string;
  transactionRef: string;
  amount: number;
  image: File; // File upload
}

export interface RejectSubscriptionDto {
  reason: string;
}

export interface BanBankAccountDto {
  bankAccountNo: string;
  reason: string;
}

export interface SubscriptionQueryFilters {
  page?: number;
  limit?: number;
  status?: SubscriptionStatus;
  search?: string;
}
