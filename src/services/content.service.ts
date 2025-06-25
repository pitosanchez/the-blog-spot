import { apiClient } from './api.client';
import { API_ENDPOINTS } from './api.config';
import type { Post, PaginatedResponse } from './creator.service';
import { MockContentService } from './content.service.mock';

const USE_MOCK = import.meta.env.DEV && !import.meta.env.VITE_API_URL;

export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  category?: string;
  isPremium?: boolean;
  scheduledFor?: string;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  status?: 'draft' | 'published' | 'scheduled';
}

export interface PostsListParams {
  page?: number;
  limit?: number;
  category?: string;
  tags?: string[];
  search?: string;
  status?: 'draft' | 'published' | 'scheduled';
  creatorId?: string;
  isPremium?: boolean;
  sortBy?: 'recent' | 'popular' | 'trending';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
  parentId?: string;
}

class ContentService {
  async getPosts(params?: PostsListParams): Promise<PaginatedResponse<Post>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(key, item));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }

    return apiClient.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.CONTENT.POSTS}?${queryParams}`
    );
  }

  async getPostById(id: string): Promise<Post> {
    return apiClient.get<Post>(API_ENDPOINTS.CONTENT.POST_DETAIL(id));
  }

  async getPostBySlug(slug: string): Promise<Post> {
    return apiClient.get<Post>(`${API_ENDPOINTS.CONTENT.POSTS}/slug/${slug}`);
  }

  async createPost(data: CreatePostData): Promise<Post> {
    return apiClient.post<Post>(API_ENDPOINTS.CONTENT.CREATE_POST, data);
  }

  async updatePost(id: string, data: UpdatePostData): Promise<Post> {
    return apiClient.patch<Post>(API_ENDPOINTS.CONTENT.UPDATE_POST(id), data);
  }

  async deletePost(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.CONTENT.DELETE_POST(id));
  }

  async publishPost(id: string): Promise<Post> {
    return apiClient.post<Post>(API_ENDPOINTS.CONTENT.PUBLISH_POST(id));
  }

  async unpublishPost(id: string): Promise<Post> {
    return apiClient.post<Post>(API_ENDPOINTS.CONTENT.UNPUBLISH_POST(id));
  }

  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>(API_ENDPOINTS.CONTENT.CATEGORIES);
  }

  async getTags(search?: string): Promise<Tag[]> {
    const query = search ? `?search=${search}` : '';
    return apiClient.get<Tag[]>(`${API_ENDPOINTS.CONTENT.TAGS}${query}`);
  }

  // Comments
  async getComments(postId: string, page = 1, limit = 20): Promise<PaginatedResponse<Comment>> {
    return apiClient.get<PaginatedResponse<Comment>>(
      `${API_ENDPOINTS.COMMENTS.LIST(postId)}?page=${page}&limit=${limit}`
    );
  }

  async createComment(
    postId: string,
    content: string,
    parentId?: string
  ): Promise<Comment> {
    return apiClient.post<Comment>(API_ENDPOINTS.COMMENTS.CREATE(postId), {
      content,
      parentId,
    });
  }

  async updateComment(id: string, content: string): Promise<Comment> {
    return apiClient.patch<Comment>(API_ENDPOINTS.COMMENTS.UPDATE(id), { content });
  }

  async deleteComment(id: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.COMMENTS.DELETE(id));
  }

  async likeComment(id: string): Promise<void> {
    return apiClient.post(API_ENDPOINTS.COMMENTS.LIKE(id));
  }

  async unlikeComment(id: string): Promise<void> {
    return apiClient.post(API_ENDPOINTS.COMMENTS.UNLIKE(id));
  }

  async reportComment(id: string, reason: string): Promise<void> {
    return apiClient.post(API_ENDPOINTS.COMMENTS.REPORT(id), { reason });
  }

  // Post interactions
  async likePost(postId: string): Promise<void> {
    return apiClient.post(`/posts/${postId}/like`);
  }

  async unlikePost(postId: string): Promise<void> {
    return apiClient.post(`/posts/${postId}/unlike`);
  }

  async bookmarkPost(postId: string): Promise<void> {
    return apiClient.post(`/posts/${postId}/bookmark`);
  }

  async unbookmarkPost(postId: string): Promise<void> {
    return apiClient.delete(`/posts/${postId}/bookmark`);
  }

  async getBookmarkedPosts(page = 1, limit = 20): Promise<PaginatedResponse<Post>> {
    return apiClient.get<PaginatedResponse<Post>>(
      `/posts/bookmarks?page=${page}&limit=${limit}`
    );
  }
}

export const contentService = USE_MOCK ? (new MockContentService() as unknown as ContentService) : new ContentService();