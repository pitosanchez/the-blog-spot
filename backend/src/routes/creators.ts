import { Router } from 'express';
import { authenticate, requireCreator } from '../middleware/auth.js';
import { prisma } from '../config/database.js';

const router = Router();

// Get all creators
router.get('/', async (_req, res) => {
  const creators = await prisma.creator.findMany({
    include: {
      user: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          posts: true,
          subscribers: true,
        },
      },
    },
  });
  
  res.json(creators);
});

// Get creator by ID
router.get('/:id', async (req, res) => {
  const creator = await prisma.creator.findUnique({
    where: { id: req.params.id },
    include: {
      user: true,
      tiers: true,
      _count: {
        select: {
          posts: true,
          subscribers: true,
        },
      },
    },
  });
  
  res.json(creator);
});

// Become a creator
router.post('/become-creator', authenticate, async (req, res) => {
  const { displayName, about } = req.body;
  
  const creator = await prisma.creator.create({
    data: {
      userId: req.user!.userId,
      displayName,
      about,
    },
  });
  
  // Update user role
  await prisma.user.update({
    where: { id: req.user!.userId },
    data: { role: 'CREATOR' },
  });
  
  res.status(201).json(creator);
});

// Update creator profile
router.patch('/:id', authenticate, requireCreator, async (req, res) => {
  const { displayName, about, profileImageUrl, coverImageUrl } = req.body;
  
  const creator = await prisma.creator.update({
    where: { id: req.params.id, userId: req.user!.userId },
    data: { displayName, about, profileImageUrl, coverImageUrl },
  });
  
  res.json(creator);
});

export default router;