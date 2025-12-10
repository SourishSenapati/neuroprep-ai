// Attempt tracking middleware for freemium model
import crypto from 'crypto';

// In-memory storage for attempts (use Redis in production)
const attemptStore = new Map();
const FREE_ATTEMPTS_LIMIT = 5;

// Generate fingerprint from IP and User-Agent
function generateFingerprint(req) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  return crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest('hex');
}

// Track attempt for anonymous users
export function trackAttempt(req, res, next) {
  const fingerprint = generateFingerprint(req);
  
  // Skip tracking for authenticated users
  if (req.user || req.headers.authorization) {
    return next();
  }
  
  const attempts = attemptStore.get(fingerprint) || 0;
  attemptStore.set(fingerprint, attempts + 1);
  
  req.attemptCount = attempts + 1;
  req.fingerprint = fingerprint;
  
  next();
}

// Check if user has exceeded free attempts
export function checkAttemptLimit(req, res, next) {
  // Skip check for authenticated users
  if (req.user || req.headers.authorization) {
    return next();
  }
  
  const fingerprint = generateFingerprint(req);
  const attempts = attemptStore.get(fingerprint) || 0;
  
  if (attempts >= FREE_ATTEMPTS_LIMIT) {
    return res.status(403).json({
      error: 'Free attempts exceeded',
      message: `You've used all ${FREE_ATTEMPTS_LIMIT} free attempts. Please sign up to continue.`,
      attemptsUsed: attempts,
      limit: FREE_ATTEMPTS_LIMIT,
      requiresAuth: true
    });
  }
  
  next();
}

// Get remaining attempts for a user
export function getRemainingAttempts(req, res) {
  // Authenticated users have unlimited attempts
  if (req.user || req.headers.authorization) {
    return res.json({
      unlimited: true,
      remaining: 'unlimited',
      attemptsUsed: 0,
      limit: 'unlimited'
    });
  }
  
  const fingerprint = generateFingerprint(req);
  const attempts = attemptStore.get(fingerprint) || 0;
  const remaining = Math.max(0, FREE_ATTEMPTS_LIMIT - attempts);
  
  res.json({
    unlimited: false,
    remaining,
    attemptsUsed: attempts,
    limit: FREE_ATTEMPTS_LIMIT,
    requiresAuth: remaining === 0
  });
}

// Reset attempts (admin function)
export function resetAttempts(fingerprint) {
  attemptStore.delete(fingerprint);
}

// Clean up old attempts (run periodically)
export function cleanupAttempts() {
  // In production, implement TTL with Redis
  // For now, clear all attempts every 24 hours
  const now = Date.now();
  const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  
  if (!cleanupAttempts.lastCleanup || now - cleanupAttempts.lastCleanup > CLEANUP_INTERVAL) {
    attemptStore.clear();
    cleanupAttempts.lastCleanup = now;
    console.log('Attempt store cleaned up');
  }
}

// Initialize cleanup interval
setInterval(cleanupAttempts, 60 * 60 * 1000); // Run every hour