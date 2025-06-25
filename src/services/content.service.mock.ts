import type { PaginatedResponse, Post, Category, Tag } from './content.service';

const mockCategories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology', postCount: 45 },
  { id: '2', name: 'Business', slug: 'business', postCount: 32 },
  { id: '3', name: 'Lifestyle', slug: 'lifestyle', postCount: 28 },
  { id: '4', name: 'Education', slug: 'education', postCount: 23 },
  { id: '5', name: 'Marketing', slug: 'marketing', postCount: 19 },
];

const mockTags: Tag[] = [
  { id: '1', name: 'tutorial', slug: 'tutorial', postCount: 34 },
  { id: '2', name: 'beginners', slug: 'beginners', postCount: 28 },
  { id: '3', name: 'advanced', slug: 'advanced', postCount: 19 },
  { id: '4', name: 'monetization', slug: 'monetization', postCount: 15 },
  { id: '5', name: 'growth', slug: 'growth', postCount: 22 },
  { id: '6', name: 'tips', slug: 'tips', postCount: 31 },
];

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Content Creation',
    slug: 'getting-started-content-creation',
    excerpt: 'Learn the basics of creating engaging content for your audience.',
    content: '# Getting Started with Content Creation\n\nContent creation is an art...',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    status: 'published',
    views: 1234,
    likes: 89,
    comments: 23,
    tags: ['tutorial', 'beginners'],
    category: 'education',
    isPremium: false,
  },
  {
    id: '2',
    title: 'Advanced Monetization Strategies',
    slug: 'advanced-monetization-strategies',
    excerpt: 'Discover proven methods to maximize your earnings as a creator.',
    content: '# Advanced Monetization Strategies\n\nMonetization is key...',
    publishedAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    status: 'published',
    views: 2341,
    likes: 156,
    comments: 45,
    tags: ['monetization', 'advanced'],
    category: 'business',
    isPremium: true,
  },
];

export class MockContentService {
  private posts = [...mockPosts];
  private nextId = 10;

  async getPosts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<Post>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...this.posts];
    
    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter(p => p.status === params.status);
    }
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(search) ||
        p.excerpt?.toLowerCase().includes(search)
      );
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
      hasMore: end < filtered.length,
    };
  }

  async getPostById(id: string): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const post = this.posts.find(p => p.id === id);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async createPost(data: {
    title: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    tags?: string[];
    category?: string;
    isPremium?: boolean;
  }): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPost: Post = {
      id: String(this.nextId++),
      title: data.title,
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: data.excerpt || '',
      content: data.content || '',
      coverImage: data.coverImage,
      updatedAt: new Date().toISOString(),
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      tags: data.tags || [],
      category: data.category,
      isPremium: data.isPremium || false,
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  async updatePost(id: string, data: {
    title?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    tags?: string[];
    category?: string;
    isPremium?: boolean;
    status?: 'draft' | 'published' | 'scheduled';
  }): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');
    
    this.posts[index] = {
      ...this.posts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    if (data.status === 'published' && !this.posts[index].publishedAt) {
      this.posts[index].publishedAt = new Date().toISOString();
    }
    
    return this.posts[index];
  }

  async deletePost(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Post not found');
    this.posts.splice(index, 1);
  }

  async getCategories(): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories;
  }

  async getTags(): Promise<Tag[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockTags;
  }
}