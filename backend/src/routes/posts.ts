import { Router } from 'express';
import { authenticate, requireCreator } from '../middleware/auth.js';
import { prisma } from '../config/database.js';
import { z } from 'zod';

const router = Router();

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  isPremium: z.boolean().default(false),
  price: z.number().positive().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  scheduledFor: z.string().datetime().optional(),
});

// Get all posts
router.get('/', async (_req, res) => {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      creator: {
        include: {
          user: {
            select: { username: true, avatarUrl: true },
          },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  });
  
  res.json(posts);
});

// Get post by ID
router.get('/:id', async (req, res) => {
  const post = await prisma.post.findUnique({
    where: { id: req.params.id },
    include: {
      creator: {
        include: {
          user: true,
        },
      },
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
  
  res.json(post);
});

// Create post
router.post('/', authenticate, requireCreator, async (req, res) => {
  const data = createPostSchema.parse(req.body);
  const creator = await prisma.creator.findUnique({
    where: { userId: req.user!.userId },
  });
  
  if (!creator) {
    res.status(404).json({ error: 'Creator profile not found' });
    return;
  }
  
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') +
    '-' + Date.now();
  
  const post = await prisma.post.create({
    data: {
      ...data,
      slug,
      creatorId: creator.id,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
    },
  });
  
  res.status(201).json(post);
});

// Update post
router.patch('/:id', authenticate, requireCreator, async (req, res) => {
  const creator = await prisma.creator.findUnique({
    where: { userId: req.user!.userId },
  });
  
  const post = await prisma.post.update({
    where: { id: req.params.id, creatorId: creator!.id },
    data: req.body,
  });
  
  res.json(post);
});

// Delete post
router.delete('/:id', authenticate, requireCreator, async (req, res) => {
  const creator = await prisma.creator.findUnique({
    where: { userId: req.user!.userId },
  });
  
  await prisma.post.delete({
    where: { id: req.params.id, creatorId: creator!.id },
  });
  
  res.status(204).send();
});

export default router;