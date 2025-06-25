import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/auth.js';
import { prisma } from '../config/database.js';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      currentUser?: any;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    const payload = verifyToken(token);
    req.user = payload;
    
    // Optionally load full user data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { creator: true },
    });
    
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    
    req.currentUser = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    
    next();
  };
}

export const requireCreator = requireRole('CREATOR', 'ADMIN');
export const requireAdmin = requireRole('ADMIN');