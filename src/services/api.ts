// API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.theblogspot.com";

// Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
  status: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "reader" | "contributor" | "moderator" | "admin";
  membershipTier?: "free" | "supporter" | "patron" | "benefactor";
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  viewCount: number;
  rating: number;
  ratingCount: number;
  featured: boolean;
  status: "draft" | "pending" | "published" | "rejected";
}

export interface StoryFilters {
  category?: string;
  tags?: string[];
  author?: string;
  featured?: boolean;
  sortBy?: "latest" | "popular" | "rating";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  storyId: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  replies?: Comment[];
}

// API class for better organization
class ApiService {
  private headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Set auth token
  setAuthToken(token: string | null) {
    if (token) {
      this.headers = {
        ...this.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      const { Authorization, ...rest } = this.headers as Record<string, string>;
      this.headers = rest;
    }
  }

  // Generic fetch wrapper with error handling
  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          data: data as T,
          error: data.error || "An error occurred",
          status: response.status,
        };
      }

      return {
        data: data as T,
        status: response.status,
        message: data.message,
      };
    } catch (error) {
      return {
        data: {} as T,
        error: error instanceof Error ? error.message : "Network error",
        status: 500,
      };
    }
  }

  // Story endpoints
  async getStories(
    filters: StoryFilters = {}
  ): Promise<ApiResponse<PaginatedResponse<Story>>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    return this.fetchApi<PaginatedResponse<Story>>(`/stories?${params}`);
  }

  async getStory(id: string): Promise<ApiResponse<Story>> {
    return this.fetchApi<Story>(`/stories/${id}`);
  }

  async createStory(story: Partial<Story>): Promise<ApiResponse<Story>> {
    return this.fetchApi<Story>("/stories", {
      method: "POST",
      body: JSON.stringify(story),
    });
  }

  async updateStory(
    id: string,
    updates: Partial<Story>
  ): Promise<ApiResponse<Story>> {
    return this.fetchApi<Story>(`/stories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async deleteStory(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.fetchApi<{ success: boolean }>(`/stories/${id}`, {
      method: "DELETE",
    });
  }

  // User endpoints
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.fetchApi<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.fetchApi<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.fetchApi<User>("/auth/me");
  }

  // Newsletter
  async subscribeToNewsletter(
    email: string
  ): Promise<ApiResponse<{ success: boolean }>> {
    return this.fetchApi<{ success: boolean }>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  // Comments
  async getComments(storyId: string): Promise<ApiResponse<Comment[]>> {
    return this.fetchApi<Comment[]>(`/stories/${storyId}/comments`);
  }

  async addComment(
    storyId: string,
    content: string
  ): Promise<ApiResponse<Comment>> {
    return this.fetchApi<Comment>(`/stories/${storyId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  }

  // Ratings
  async rateStory(
    storyId: string,
    rating: number
  ): Promise<ApiResponse<{ averageRating: number }>> {
    return this.fetchApi<{ averageRating: number }>(
      `/stories/${storyId}/rate`,
      {
        method: "POST",
        body: JSON.stringify({ rating }),
      }
    );
  }
}

// Export singleton instance
export const api = new ApiService();
