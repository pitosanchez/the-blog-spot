import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { prisma } from '../config/database.js';

const router = Router();

// Get user's subscriptions
router.get('/my-subscriptions', authenticate, async (req, res) => {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId: req.user!.userId },
    include: {
      creator: true,
      tier: true,
    },
  });
  
  res.json(subscriptions);
});

// Get creator's subscribers
router.get('/creator/:creatorId/subscribers', authenticate, async (req, res) => {
  const creator = await prisma.creator.findUnique({
    where: { id: req.params.creatorId, userId: req.user!.userId },
  });
  
  if (!creator) {
    res.status(403).json({ error: 'Not authorized' });
    return;
  }
  
  const subscribers = await prisma.subscription.findMany({
    where: { creatorId: req.params.creatorId },
    include: {
      user: true,
      tier: true,
    },
  });
  
  res.json(subscribers);
});

export default router;