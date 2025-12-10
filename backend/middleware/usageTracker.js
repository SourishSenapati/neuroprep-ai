const db = require('../database');

// Tier limits
const TIER_LIMITS = {
  free: {
    interviews_per_month: 10,
    api_calls_per_month: 100,
    price: 0
  },
  pro: {
    interviews_per_month: -1, // unlimited
    api_calls_per_month: 10000,
    price: 29
  },
  enterprise: {
    interviews_per_month: -1, // unlimited
    api_calls_per_month: -1, // unlimited
    price: null // custom
  }
};

// Initialize subscription for new user
async function initializeSubscription(userId) {
  const query = `
    INSERT INTO subscriptions (user_id, tier, status)
    VALUES (?, 'free', 'active')
    ON CONFLICT(user_id) DO NOTHING
  `;
  
  await db.run(query, [userId]);
}

// Get current usage for the month
async function getCurrentUsage(userId) {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  let usage = await db.get(
    'SELECT * FROM usage_tracking WHERE user_id = ? AND month = ?',
    [userId, currentMonth]
  );
  
  if (!usage) {
    await db.run(
      `INSERT INTO usage_tracking (user_id, month) VALUES (?, ?)`,
      [userId, currentMonth]
    );
    usage = { interviews_count: 0, questions_generated: 0, api_calls: 0 };
  }
  
  return usage;
}

// Check if user can start interview
async function canStartInterview(userId) {
  const subscription = await db.get(
    'SELECT tier FROM subscriptions WHERE user_id = ? AND status = ?',
    [userId, 'active']
  );
  
  if (!subscription) {
    await initializeSubscription(userId);
    subscription = { tier: 'free' };
  }
  
  const tier = subscription.tier;
  const limit = TIER_LIMITS[tier].interviews_per_month;
  
  // Unlimited for pro/enterprise
  if (limit === -1) return { allowed: true, remaining: -1, tier };
  
  const usage = await getCurrentUsage(userId);
  const remaining = limit - usage.interviews_count;
  
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
    used: usage.interviews_count,
    limit,
    tier
  };
}

// Increment interview count
async function incrementInterviewCount(userId) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  await db.run(
    `INSERT INTO usage_tracking (user_id, month, interviews_count)
     VALUES (?, ?, 1)
     ON CONFLICT(user_id, month) DO UPDATE SET
       interviews_count = interviews_count + 1,
       updated_at = strftime('%s', 'now')`,
    [userId, currentMonth]
  );
}

// Increment API call count
async function incrementApiCall(userId) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  await db.run(
    `INSERT INTO usage_tracking (user_id, month, api_calls)
     VALUES (?, ?, 1)
     ON CONFLICT(user_id, month) DO UPDATE SET
       api_calls = api_calls + 1,
       updated_at = strftime('%s', 'now')`,
    [userId, currentMonth]
  );
}

// Get user's subscription tier
async function getUserTier(userId) {
  const subscription = await db.get(
    'SELECT tier, status FROM subscriptions WHERE user_id = ?',
    [userId]
  );
  
  return subscription?.tier || 'free';
}

// Middleware to check usage limits
function checkUsageLimits(type = 'interview') {
  return async (req, res, next) => {
    try {
      const userId = req.session?.userId || req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      if (type === 'interview') {
        const check = await canStartInterview(userId);
        
        if (!check.allowed) {
          return res.status(403).json({
            error: 'Usage limit reached',
            message: `You've used all ${check.limit} free interviews this month. Upgrade to Pro for unlimited interviews.`,
            tier: check.tier,
            used: check.used,
            limit: check.limit,
            upgradeUrl: '/pricing'
          });
        }
        
        req.usageInfo = check;
      }
      
      next();
    } catch (error) {
      console.error('Usage check error:', error);
      next(error);
    }
  };
}

module.exports = {
  TIER_LIMITS,
  initializeSubscription,
  getCurrentUsage,
  canStartInterview,
  incrementInterviewCount,
  incrementApiCall,
  getUserTier,
  checkUsageLimits
};
