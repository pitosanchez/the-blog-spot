import type { Creator, CreatorDashboard, PaginatedResponse, Post } from './creator.service';

// Mock data for development
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
  {
    id: '3',
    title: 'Building Your Audience',
    slug: 'building-your-audience',
    excerpt: 'Tips and tricks for growing your subscriber base organically.',
    updatedAt: '2024-01-20T09:00:00Z',
    status: 'draft',
    views: 0,
    likes: 0,
    comments: 0,
    tags: ['growth', 'audience'],
    category: 'marketing',
    isPremium: false,
  },
];

const mockDashboard: CreatorDashboard = {
  stats: {
    totalEarnings: 12543.67,
    monthlyEarnings: 2856.34,
    subscribers: 1523,
    posts: 47,
    engagement: 8.7,
  },
  recentPosts: mockPosts.slice(0, 3),
  recentSubscribers: [
    {
      id: 's1',
      userId: 'u1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      subscribedAt: '2024-01-20T15:30:00Z',
      tier: 'Premium',
    },
    {
      id: 's2',
      userId: 'u2',
      name: 'Jane Smith',
      subscribedAt: '2024-01-19T10:15:00Z',
      tier: 'Basic',
    },
    {
      id: 's3',
      userId: 'u3',
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      subscribedAt: '2024-01-18T18:45:00Z',
      tier: 'Premium',
    },
  ],
  earnings: {
    available: 8234.56,
    pending: 1234.89,
    lastPayout: 2500.00,
    nextPayoutDate: '2024-02-01T00:00:00Z',
  },
};

export class MockCreatorService {
  async getCreatorDashboard(): Promise<CreatorDashboard> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDashboard;
  }

  async getCreators(): Promise<PaginatedResponse<Creator>> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: [],
      total: 0,
      page: 1,
      totalPages: 1,
      hasMore: false,
    };
  }

  async createCreatorProfile(): Promise<Creator> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: 'creator1',
      name: 'Test Creator',
      avatar: '',
      niche: 'technology',
      monthlyEarnings: '$0',
      subscribers: 0,
    };
  }
}