import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'failed';
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  paymentMethod: {
    type: string;
    last4: string;
    brand?: string;
  };
  createdAt: string;
  receiptUrl?: string;
}

export interface CreatePaymentMethodData {
  type: 'card' | 'bank_account';
  token: string; // Stripe token
  setAsDefault?: boolean;
}

export interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PayoutSettings {
  enabled: boolean;
  schedule: 'daily' | 'weekly' | 'monthly';
  minimumAmount: number;
  accountType?: 'stripe' | 'paypal' | 'bank';
  accountDetails?: {
    last4?: string;
    email?: string;
    bankName?: string;
  };
}

class PaymentService {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return apiClient.get<PaymentMethod[]>(API_ENDPOINTS.PAYMENTS.METHODS);
  }

  async addPaymentMethod(data: CreatePaymentMethodData): Promise<PaymentMethod> {
    return apiClient.post<PaymentMethod>(API_ENDPOINTS.PAYMENTS.ADD_METHOD, data);
  }

  async removePaymentMethod(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.PAYMENTS.REMOVE_METHOD(id));
  }

  async setDefaultPaymentMethod(id: string): Promise<PaymentMethod> {
    return apiClient.post<PaymentMethod>(API_ENDPOINTS.PAYMENTS.SET_DEFAULT(id));
  }

  async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    payments: PaymentHistory[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiClient.get(`${API_ENDPOINTS.PAYMENTS.HISTORY}?${queryParams}`);
  }

  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntent> {
    return apiClient.post<PaymentIntent>(API_ENDPOINTS.PAYMENTS.CREATE_INTENT, data);
  }

  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<{
    status: 'succeeded' | 'requires_action' | 'failed';
    clientSecret?: string;
    error?: string;
  }> {
    return apiClient.post(API_ENDPOINTS.PAYMENTS.CONFIRM_PAYMENT, {
      paymentIntentId,
      paymentMethodId,
    });
  }

  // Creator payout methods
  async getPayoutSettings(): Promise<PayoutSettings> {
    return apiClient.get<PayoutSettings>('/payments/payout-settings');
  }

  async updatePayoutSettings(settings: Partial<PayoutSettings>): Promise<PayoutSettings> {
    return apiClient.patch<PayoutSettings>('/payments/payout-settings', settings);
  }

  async connectStripeAccount(code: string): Promise<{
    success: boolean;
    accountId: string;
  }> {
    return apiClient.post('/payments/connect-stripe', { code });
  }

  async getStripeConnectUrl(): Promise<{ url: string }> {
    return apiClient.get('/payments/stripe-connect-url');
  }

  async requestPayout(amount?: number): Promise<{
    id: string;
    amount: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    estimatedArrival: string;
  }> {
    return apiClient.post('/payments/request-payout', { amount });
  }

  // Workshop payments
  async createWorkshopPayment(
    workshopId: string,
    paymentMethodId: string
  ): Promise<{
    success: boolean;
    enrollmentId?: string;
    error?: string;
  }> {
    return apiClient.post('/payments/workshop', {
      workshopId,
      paymentMethodId,
    });
  }

  // Refunds
  async requestRefund(
    paymentId: string,
    reason: string,
    amount?: number
  ): Promise<{
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    amount: number;
  }> {
    return apiClient.post('/payments/refund', {
      paymentId,
      reason,
      amount,
    });
  }
}

export const paymentService = new PaymentService();