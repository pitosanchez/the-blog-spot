import type { Creator, CreatorStats } from '../types';
import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import { MockCreatorService } from './creator.service.mock';

const USE_MOCK = import.meta.env.DEV && !import.meta.env.VITE_API_URL;

export interface CreateCreatorProfileData {
  bio: string;
  niche: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface CreatorDashboard {
  stats: CreatorStats;
  recentPosts: Post[];
  recentSubscribers: Subscriber[];
  earnings: {
    available: number;
    pending: number;
    lastPayout: number;
    nextPayoutDate: string;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  publishedAt?: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'scheduled';
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  category?: string;
  isPremium: boolean;
}

export interface Subscriber {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  subscribedAt: string;
  tier: string;
}

export interface CreatorsListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'subscribers' | 'earnings' | 'recent' | 'featured';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

class CreatorService {
  async getCreators(params?: CreatorsListParams): Promise<PaginatedResponse<Creator>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiClient.get<PaginatedResponse<Creator>>(
      `${API_ENDPOINTS.CREATORS.LIST}?${queryParams}`
    );
  }

  async getCreatorById(id: string): Promise<Creator> {
    return apiClient.get<Creator>(API_ENDPOINTS.CREATORS.DETAIL(id));
  }

  async getCreatorPosts(
    creatorId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Post>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiClient.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.CREATORS.POSTS(creatorId)}?${queryParams}`
    );
  }

  async subscribeToCreator(creatorId: string, tierId?: string): Promise<void> {
    return apiClient.post(API_ENDPOINTS.CREATORS.SUBSCRIBE(creatorId), { tierId });
  }

  async unsubscribeFromCreator(creatorId: string): Promise<void> {
    return apiClient.post(API_ENDPOINTS.CREATORS.UNSUBSCRIBE(creatorId));
  }

  async getCreatorDashboard(): Promise<CreatorDashboard> {
    return apiClient.get<CreatorDashboard>(API_ENDPOINTS.CREATORS.DASHBOARD);
  }

  async getCreatorAnalytics(period: 'week' | 'month' | 'year' = 'month') {
    return apiClient.get(`${API_ENDPOINTS.CREATORS.ANALYTICS}?period=${period}`);
  }

  async getEarnings(params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiClient.get(`${API_ENDPOINTS.CREATORS.EARNINGS}?${queryParams}`);
  }

  async getPayouts(status?: 'pending' | 'completed' | 'failed') {
    const query = status ? `?status=${status}` : '';
    return apiClient.get(`${API_ENDPOINTS.CREATORS.PAYOUTS}${query}`);
  }

  async createCreatorProfile(data: CreateCreatorProfileData): Promise<Creator> {
    return apiClient.post<Creator>('/creators/profile', data);
  }

  async updateCreatorProfile(data: Partial<CreateCreatorProfileData>): Promise<Creator> {
    return apiClient.patch<Creator>('/creators/profile', data);
  }
}

export const creatorService = USE_MOCK ? (new MockCreatorService() as unknown as CreatorService) : new CreatorService();

// Export types for use in other services
export type { Creator, CreatorStats, Post, PaginatedResponse, Subscriber, CreatorDashboard };