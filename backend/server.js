// Backend v2.0 - Fortress Architecture (Exponential Excellence)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import authRouter from './routes/auth.js';
import paymentRouter from './routes/payment.js';
import masteryPathsRouter from './routes/masteryPaths.js';
import User from './models/User.js';

dotenv.config();

const app = express();

// 1. 🛡️ SECURITY SHIELD: Advanced Headers
app.use(helmet({
  contentSecurityPolicy: false, // Usage with API mode
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 2. ⚡ VELOCITY ENGINE: Gzip Compression
app.use(compression());

// 3. 🧹 SANITIZATION: Prevent NoSQL Injection & Pollution
app.use(mongoSanitize());
app.use(hpp());

// 4. 🌐 CROSS-ORIGIN DEFENSE
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://frontend-chi-three-96.vercel.app',
  'https://neuroprep-ai.vercel.app'
];

app.use(cors({ 
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 5. 🚦 TRAFFIC CONTROL: DDoS Protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); // Body limit

// 6. 🛣️ OPTIMIZED ROUTES
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/mastery-paths', masteryPathsRouter);

// Dashboard Route (Optimized)
app.get('/api/dashboard', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ error: 'User ID required' });

        // Use lean() for performance - returns POJO instead of Mongoose Doc
        const user = await User.findById(userId).lean();
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            stats: user.stats,
            isPro: user.isPro,
            name: user.name,
            // Enhanced Mock Data
            totalSessions: 12,
            averageScore: 78.5, 
            recentSessions: [
                { id: 1, role: 'Software Engineer', difficulty: 7, avg_score: 85, started_at: '2024-01-15' },
                { id: 2, role: 'Frontend Engineer', difficulty: 6, avg_score: 78, started_at: '2024-01-14' }
            ],
            topicPerformance: [
                { topic: 'Algorithms', question_count: 15, avg_score: 88 },
                { topic: 'System Design', question_count: 12, avg_score: 75 }
            ]
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Health Check (Deep Inspection)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date(), 
        dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime()
    });
});

// 7. 🚀 CONNECTION MAXIMIZER
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sourishschemug_db_user:a4r1UIXNpZe16pRA@neuroprep-db.4lhua3l.mongodb.net/?appName=NeuroPrep-DB';

// Global connection state for serverless
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) return;

    try {
        const db = await mongoose.connect(MONGO_URI, {
            maxPoolSize: 10, // Optimize pool size for serverless
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log(`✅ MongoDB Active: ${isConnected}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
    }
};

// Start Server (Hybrid: Local & Serverless)
if (process.env.NODE_ENV !== 'production') {
    connectToDatabase().then(() => {
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    });
} else {
    // Vercel Serverless Optimization: Connect but don't listen (Vercel handles listening)
    connectToDatabase();
}

export default app;
