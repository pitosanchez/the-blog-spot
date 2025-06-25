import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { hashPassword, verifyPassword, generateToken, verifyToken } from '../utils/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { AppError } from '../middleware/error.js';

const router = Router();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Sign up
router.post('/signup', authLimiter, async (req, res) => {
  const data = signupSchema.parse(req.body);
  
  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username },
      ],
    },
  });
  
  if (existingUser) {
    throw new AppError(409, 'User with this email or username already exists');
  }
  
  // Create user
  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      passwordHash,
    },
  });
  
  const token = generateToken(user);
  
  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    token,
  });
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  const data = loginSchema.parse(req.body);
  
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: { creator: true },
  });
  
  if (!user) {
    throw new AppError(401, 'Invalid credentials');
  }
  
  const validPassword = await verifyPassword(data.password, user.passwordHash);
  if (!validPassword) {
    throw new AppError(401, 'Invalid credentials');
  }
  
  const token = generateToken(user);
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      creator: user.creator ? {
        id: user.creator.id,
        displayName: user.creator.displayName,
        stripeOnboarded: user.creator.stripeOnboarded,
      } : null,
    },
    token,
  });
});

// Refresh token
router.post('/refresh', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    throw new AppError(401, 'Token required');
  }
  
  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    
    if (!user) {
      throw new AppError(401, 'User not found');
    }
    
    const newToken = generateToken(user);
    res.json({ token: newToken });
  } catch (error) {
    throw new AppError(401, 'Invalid token');
  }
});

export default router;