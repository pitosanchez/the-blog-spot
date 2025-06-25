import { User } from '../contexts/AppContext';
import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';

export interface UserProfile extends User {
  bio?: string;
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  isCreator: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserPreferences {
  emailNotifications: {
    newContent: boolean;
    creatorUpdates: boolean;
    comments: boolean;
    mentions: boolean;
    marketing: boolean;
  };
  pushNotifications: {
    enabled: boolean;
    newContent: boolean;
    directMessages: boolean;
  };
  privacy: {
    showProfile: boolean;
    showSubscriptions: boolean;
    showActivity: boolean;
  };
  content: {
    showMatureContent: boolean;
    autoplayVideos: boolean;
    fontSize: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark' | 'system';
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
  reason?: string;
  feedback?: string;
}

class UserService {
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(API_ENDPOINTS.USERS.PROFILE);
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    return apiClient.patch<UserProfile>(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiClient.upload<{ avatarUrl: string }>(
      API_ENDPOINTS.USERS.AVATAR,
      formData
    );
  }

  async uploadCoverImage(file: File): Promise<{ coverImageUrl: string }> {
    const formData = new FormData();
    formData.append('coverImage', file);
    
    return apiClient.upload<{ coverImageUrl: string }>(
      '/users/cover-image',
      formData
    );
  }

  async getPreferences(): Promise<UserPreferences> {
    return apiClient.get<UserPreferences>(API_ENDPOINTS.USERS.PREFERENCES);
  }

  async updatePreferences(
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    return apiClient.patch<UserPreferences>(
      API_ENDPOINTS.USERS.PREFERENCES,
      preferences
    );
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    return apiClient.post('/users/change-password', data);
  }

  async deleteAccount(data: DeleteAccountData): Promise<void> {
    return apiClient.post(API_ENDPOINTS.USERS.DELETE_ACCOUNT, data);
  }

  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<{
    notifications: Notification[];
    unreadCount: number;
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

    return apiClient.get(`/users/notifications?${queryParams}`);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    return apiClient.post(`/users/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    return apiClient.post('/users/notifications/read-all');
  }

  async getFollowing(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    creators: Array<{
      id: string;
      name: string;
      avatar?: string;
      niche: string;
      followedAt: string;
    }>;
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

    return apiClient.get(`/users/following?${queryParams}`);
  }

  async followCreator(creatorId: string): Promise<void> {
    return apiClient.post(`/users/follow/${creatorId}`);
  }

  async unfollowCreator(creatorId: string): Promise<void> {
    return apiClient.delete(`/users/follow/${creatorId}`);
  }

  async getSavedPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    posts: Array<{
      id: string;
      title: string;
      excerpt: string;
      coverImage?: string;
      savedAt: string;
      creator: {
        id: string;
        name: string;
        avatar?: string;
      };
    }>;
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

    return apiClient.get(`/users/saved-posts?${queryParams}`);
  }

  async exportUserData(): Promise<{ downloadUrl: string }> {
    return apiClient.post('/users/export-data');
  }
}

export const userService = new UserService();