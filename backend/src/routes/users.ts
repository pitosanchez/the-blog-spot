import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { prisma } from '../config/database.js';

const router = Router();

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    include: { creator: true },
  });
  
  res.json(user);
});

// Update user profile
router.patch('/me', authenticate, async (req, res) => {
  const { bio, avatarUrl } = req.body;
  
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { bio, avatarUrl },
  });
  
  res.json(user);
});

export default router;