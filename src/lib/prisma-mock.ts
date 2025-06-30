// Mock Prisma client for development when database is not available
// This allows the application to run and TypeScript errors to be resolved

interface MockVideo {
  id: string;
  title: string;
  description?: string;
  userId: string;
  type: string;
  status: string;
  originalFileName: string;
  originalFileSize: number;
  s3Key: string;
  specialty?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MockLiveStream {
  id: string;
  title: string;
  description?: string;
  userId: string;
  roomName: string;
  roomUrl: string;
  maxParticipants: number;
  dailyToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

class MockVideoModel {
  async create(data: any): Promise<MockVideo> {
    return {
      id: `video_${Date.now()}`,
      title: data.data.title,
      description: data.data.description,
      userId: data.data.userId,
      type: data.data.type,
      status: data.data.status,
      originalFileName: data.data.originalFileName,
      originalFileSize: data.data.originalFileSize,
      s3Key: data.data.s3Key,
      specialty: data.data.specialty,
      tags: data.data.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async findFirst(query: any): Promise<MockVideo | null> {
    // Mock response for development
    return null;
  }

  async findMany(query: any): Promise<MockVideo[]> {
    // Mock response for development
    return [];
  }

  async update(query: any): Promise<MockVideo> {
    return {
      id: query.where.id,
      title: 'Mock Video',
      userId: 'mock-user',
      type: 'LECTURE',
      status: 'PROCESSING',
      originalFileName: 'mock.mp4',
      originalFileSize: 1000000,
      s3Key: 'mock-key',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async count(query: any): Promise<number> {
    return 0;
  }
}

class MockLiveStreamModel {
  async create(data: any): Promise<MockLiveStream> {
    return {
      id: `stream_${Date.now()}`,
      title: data.data.title,
      description: data.data.description,
      userId: data.data.userId,
      roomName: data.data.roomName,
      roomUrl: data.data.roomUrl,
      maxParticipants: data.data.maxParticipants,
      dailyToken: data.data.dailyToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async findMany(query: any): Promise<MockLiveStream[]> {
    return [];
  }
}

export const mockPrisma = {
  video: new MockVideoModel(),
  liveStream: new MockLiveStreamModel(),
};

// Check if we're in development and database is not available
export const isDatabaseAvailable = () => {
  return (
    process.env.DATABASE_URL &&
    process.env.DATABASE_URL !==
      'postgresql://username:password@localhost:5432/medipublish'
  );
};

export const getPrismaClient = async () => {
  if (isDatabaseAvailable()) {
    // Use real Prisma client
    const { prisma } = await import('./prisma');
    return prisma;
  } else {
    // Use mock client for development
    console.warn(
      '⚠️  Using mock database client - some features may not work properly'
    );
    return mockPrisma as any;
  }
};
