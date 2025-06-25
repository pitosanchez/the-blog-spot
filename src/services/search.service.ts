import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import type { Creator, Workshop } from '../types';
import type { Post } from './creator.service';

export interface SearchFilters {
  type?: 'all' | 'posts' | 'creators' | 'workshops';
  category?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start?: string;
    end?: string;
  };
  isPremium?: boolean;
  sortBy?: 'relevance' | 'recent' | 'popular';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  query: string;
  filters: SearchFilters;
  suggestions?: string[];
}

export interface GlobalSearchResult {
  posts: Post[];
  creators: Creator[];
  workshops: Workshop[];
  totalResults: number;
}

class SearchService {
  async searchPosts(
    query: string,
    filters?: SearchFilters,
    page = 1,
    limit = 20
  ): Promise<SearchResult<Post>> {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      limit: String(limit),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object') {
            params.append(key, JSON.stringify(value));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    return apiClient.get<SearchResult<Post>>(
      `${API_ENDPOINTS.SEARCH.POSTS}?${params}`
    );
  }

  async searchCreators(
    query: string,
    filters?: Omit<SearchFilters, 'isPremium'>,
    page = 1,
    limit = 20
  ): Promise<SearchResult<Creator>> {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      limit: String(limit),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object') {
            params.append(key, JSON.stringify(value));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    return apiClient.get<SearchResult<Creator>>(
      `${API_ENDPOINTS.SEARCH.CREATORS}?${params}`
    );
  }

  async searchWorkshops(
    query: string,
    filters?: SearchFilters,
    page = 1,
    limit = 20
  ): Promise<SearchResult<Workshop>> {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      limit: String(limit),
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object') {
            params.append(key, JSON.stringify(value));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    return apiClient.get<SearchResult<Workshop>>(
      `${API_ENDPOINTS.SEARCH.WORKSHOPS}?${params}`
    );
  }

  async globalSearch(
    query: string,
    limit = 5
  ): Promise<GlobalSearchResult> {
    const params = new URLSearchParams({
      q: query,
      limit: String(limit),
    });

    return apiClient.get<GlobalSearchResult>(
      `${API_ENDPOINTS.SEARCH.GLOBAL}?${params}`
    );
  }

  async getSearchSuggestions(
    query: string,
    type?: 'posts' | 'creators' | 'workshops'
  ): Promise<string[]> {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);

    return apiClient.get<string[]>(`/search/suggestions?${params}`);
  }

  async getTrendingSearches(
    type?: 'posts' | 'creators' | 'workshops'
  ): Promise<Array<{ term: string; count: number }>> {
    const params = type ? `?type=${type}` : '';
    return apiClient.get<Array<{ term: string; count: number }>>(
      `/search/trending${params}`
    );
  }

  async saveSearchQuery(query: string, filters?: SearchFilters): Promise<void> {
    return apiClient.post('/search/save', { query, filters });
  }

  async getSavedSearches(): Promise<
    Array<{
      id: string;
      query: string;
      filters?: SearchFilters;
      createdAt: string;
    }>
  > {
    return apiClient.get('/search/saved');
  }

  async deleteSavedSearch(id: string): Promise<void> {
    return apiClient.delete(`/search/saved/${id}`);
  }

  async getRecentSearches(): Promise<
    Array<{
      query: string;
      timestamp: string;
      resultCount: number;
    }>
  > {
    return apiClient.get('/search/recent');
  }

  async clearRecentSearches(): Promise<void> {
    return apiClient.delete('/search/recent');
  }
}

export const searchService = new SearchService();