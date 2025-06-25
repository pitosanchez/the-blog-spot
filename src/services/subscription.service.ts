import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import { PricingTier } from '../types';

export interface Subscription {
  id: string;
  userId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'expired' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
}

export interface CreateSubscriptionData {
  creatorId: string;
  tierId: string;
  paymentMethodId: string;
}

export interface UpdateSubscriptionData {
  tierId?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  paidAt?: string;
  createdAt: string;
  invoiceUrl?: string;
}

class SubscriptionService {
  async getSubscriptions(status?: 'active' | 'canceled' | 'all'): Promise<Subscription[]> {
    const query = status ? `?status=${status}` : '';
    return apiClient.get<Subscription[]>(`${API_ENDPOINTS.SUBSCRIPTIONS.LIST}${query}`);
  }

  async getActiveSubscriptions(): Promise<Subscription[]> {
    return apiClient.get<Subscription[]>(API_ENDPOINTS.SUBSCRIPTIONS.ACTIVE);
  }

  async createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
    return apiClient.post<Subscription>(API_ENDPOINTS.SUBSCRIPTIONS.CREATE, data);
  }

  async updateSubscription(
    id: string,
    data: UpdateSubscriptionData
  ): Promise<Subscription> {
    return apiClient.patch<Subscription>(API_ENDPOINTS.SUBSCRIPTIONS.UPDATE(id), data);
  }

  async cancelSubscription(
    id: string,
    cancelImmediately = false
  ): Promise<Subscription> {
    return apiClient.post<Subscription>(API_ENDPOINTS.SUBSCRIPTIONS.CANCEL(id), {
      cancelImmediately,
    });
  }

  async reactivateSubscription(id: string): Promise<Subscription> {
    return apiClient.post<Subscription>(`/subscriptions/${id}/reactivate`);
  }

  async getSubscriptionHistory(
    page = 1,
    limit = 20
  ): Promise<{
    subscriptions: Subscription[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return apiClient.get(
      `${API_ENDPOINTS.SUBSCRIPTIONS.HISTORY}?page=${page}&limit=${limit}`
    );
  }

  async getSubscriptionInvoices(subscriptionId: string): Promise<SubscriptionInvoice[]> {
    return apiClient.get<SubscriptionInvoice[]>(
      `/subscriptions/${subscriptionId}/invoices`
    );
  }

  async checkSubscriptionAccess(creatorId: string): Promise<{
    hasAccess: boolean;
    subscription?: Subscription;
  }> {
    return apiClient.get(`/subscriptions/access/${creatorId}`);
  }

  async getCreatorTiers(creatorId: string): Promise<PricingTier[]> {
    return apiClient.get<PricingTier[]>(`/creators/${creatorId}/tiers`);
  }

  async previewSubscriptionChange(
    subscriptionId: string,
    newTierId: string
  ): Promise<{
    proratedAmount: number;
    immediatePayment: boolean;
    nextBillingDate: string;
    newAmount: number;
  }> {
    return apiClient.post(`/subscriptions/${subscriptionId}/preview-change`, {
      newTierId,
    });
  }
}

export const subscriptionService = new SubscriptionService();