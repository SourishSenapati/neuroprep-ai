import { Request, Response, NextFunction } from 'express';
import { getOrCreateUser } from '../db.js';

// Mock Redis for rate limiting / usage tracking
const usageCache = new Map<string, number>();

export const freemiumCheck = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.userId || req.query.userId || 'anonymous';
  
  // Allow anonymous for initial checks, but track them
  if (userId === 'anonymous') {
    return next();
  }

  const FREE_LIMIT = 5;

  // Bypass DB for stability (Mock Mode)
  // const user = await getOrCreateUser(userId);
  // const isPro = (user as any).is_pro || false; 
  // const currentUsage = user.sessions_count || 0;

  const currentUsage = 0; // Mock usage
  const isPro = true; // Unlimited for demo
  
  if (!isPro && currentUsage >= FREE_LIMIT) {
    return res.status(403).json({
      error: 'Entanglement Limit Reached',
      message: 'Upgrade to Pinnacle Edition.',
      code: 'UPGRADE_REQUIRED'
    });
  }

  console.log(`[Freemium] User ${userId} checked (Mock Mode).`);
  next();
};
