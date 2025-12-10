/**
 * Comprehensive Error Fixes for NeuroPrep AI
 * Addresses all identified issues and ensures system stability
 */
// Fix database connection issues
export function createMockDatabase() {
    return {
        insertSessionResponse: async (sessionId, data) => {
            console.log(`[MOCK DB] Session response saved for ${sessionId}:`, data);
            return { success: true };
        },
        addBiometric: async (sessionId, data) => {
            console.log(`[MOCK DB] Biometric data saved for ${sessionId}:`, data);
            return { success: true };
        },
        getDashboardData: async (userId) => {
            return {
                totalSessions: 0,
                averageScore: 85,
                topicCoverage: {},
                recentSessions: [],
                insights: 'Mock insights for development'
            };
        },
        getOrCreateUser: async (userId) => {
            return {
                id: userId,
                sessions_count: 0,
                is_pro: false,
                created_at: new Date()
            };
        },
        generateLongitudinalInsights: async (userId, apiKey) => {
            return 'Mock longitudinal insights for user development';
        }
    };
}
// Fix environment variable handling
export function validateEnvironment() {
    const required = ['NODE_ENV'];
    const optional = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GEMINI_API_KEY', 'REDIS_URL', 'DATABASE_URL'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.warn(`Missing required environment variables: ${missing.join(', ')}`);
    }
    const available = optional.filter(key => process.env[key]);
    console.log(`Available optional services: ${available.join(', ') || 'none'}`);
    return {
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
        hasGemini: !!process.env.GEMINI_API_KEY,
        hasRedis: !!process.env.REDIS_URL,
        hasDatabase: !!process.env.DATABASE_URL
    };
}
// Fix CORS and security issues
export const corsConfig = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin)
            return callback(null, true);
        // Allow all vercel.app subdomains and local development
        if (origin.includes('localhost') ||
            origin.endsWith('.vercel.app') ||
            origin === 'https://neuroprep-ai.vercel.app') {
            callback(null, true);
        }
        else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
// Fix rate limiting configuration
export const rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased for development
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks and development
        return req.path === '/health' || process.env.NODE_ENV === 'development';
    }
};
// Fix WebSocket configuration
export const socketConfig = {
    cors: corsConfig,
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 30000,
    maxHttpBufferSize: 1e6, // 1MB
    allowEIO3: true
};
// Fix session management
export class EnhancedSessionManager {
    constructor() {
        this.sessions = new Map();
        this.sessionTimeouts = new Map();
    }
    createSession(sessionId, data) {
        this.sessions.set(sessionId, {
            ...data,
            createdAt: Date.now(),
            lastActivity: Date.now()
        });
        // Auto-cleanup after 1 hour of inactivity
        this.resetTimeout(sessionId);
    }
    getSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.lastActivity = Date.now();
            this.resetTimeout(sessionId);
        }
        return session;
    }
    updateSession(sessionId, updates) {
        const session = this.sessions.get(sessionId);
        if (session) {
            Object.assign(session, updates, { lastActivity: Date.now() });
            this.resetTimeout(sessionId);
        }
    }
    deleteSession(sessionId) {
        this.sessions.delete(sessionId);
        const timeout = this.sessionTimeouts.get(sessionId);
        if (timeout) {
            clearTimeout(timeout);
            this.sessionTimeouts.delete(sessionId);
        }
    }
    resetTimeout(sessionId) {
        const existingTimeout = this.sessionTimeouts.get(sessionId);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }
        const timeout = setTimeout(() => {
            this.deleteSession(sessionId);
            console.log(`Session ${sessionId} cleaned up due to inactivity`);
        }, 60 * 60 * 1000); // 1 hour
        this.sessionTimeouts.set(sessionId, timeout);
    }
    getActiveSessionCount() {
        return this.sessions.size;
    }
    cleanup() {
        this.sessions.clear();
        this.sessionTimeouts.forEach(timeout => clearTimeout(timeout));
        this.sessionTimeouts.clear();
    }
}
// Fix error handling middleware
export function createErrorHandler() {
    return (err, req, res, next) => {
        console.error('Unhandled error:', err);
        // Don't leak error details in production
        const isDevelopment = process.env.NODE_ENV === 'development';
        const errorResponse = {
            error: 'Internal server error',
            message: isDevelopment ? err.message : 'Something went wrong',
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method
        };
        // Log additional details for debugging
        if (isDevelopment) {
            errorResponse.stack = err.stack;
            errorResponse.details = err;
        }
        const statusCode = err.statusCode || err.status || 500;
        res.status(statusCode).json(errorResponse);
    };
}
// Fix graceful shutdown
export function setupGracefulShutdown(server, cleanup) {
    const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
    signals.forEach(signal => {
        process.on(signal, async () => {
            console.log(`Received ${signal}, shutting down gracefully...`);
            // Stop accepting new connections
            server.close(async () => {
                console.log('HTTP server closed');
                try {
                    await cleanup();
                    console.log('Cleanup completed');
                    process.exit(0);
                }
                catch (error) {
                    console.error('Error during cleanup:', error);
                    process.exit(1);
                }
            });
            // Force shutdown after 30 seconds
            setTimeout(() => {
                console.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 30000);
        });
    });
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
}
// Export all fixes
export const errorFixes = {
    createMockDatabase,
    validateEnvironment,
    corsConfig,
    rateLimitConfig,
    socketConfig,
    EnhancedSessionManager,
    createErrorHandler,
    setupGracefulShutdown
};
export default errorFixes;
