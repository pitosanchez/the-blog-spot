import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface UserForToken {
  id: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: UserForToken): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as any);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
}

export function generateEmailVerificationToken(email: string): string {
  return jwt.sign({ email, type: 'email-verification' }, env.JWT_SECRET, {
    expiresIn: '24h',
  } as any);
}

export function generatePasswordResetToken(email: string): string {
  return jwt.sign({ email, type: 'password-reset' }, env.JWT_SECRET, {
    expiresIn: '1h',
  } as any);
}