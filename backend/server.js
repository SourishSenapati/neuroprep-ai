import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import paymentRouter from './routes/payment.js';
import User from './models/User.js'; // Imported for Dashboard but can also be moved to route

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);

// Dashboard Route (Included here for simplicity as requested, or can be separate)
app.get('/api/dashboard', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) return res.status(400).json({ error: 'User ID required' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Mock recent activity data mixed with real stats
        res.json({
            stats: user.stats,
            isPro: user.isPro,
            name: user.name,
            totalSessions: 12, // Mock
            averageScore: 78.5, // Mock
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
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Connect to MongoDB & Start Server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sourishschemug_db_user:a4r1UIXNpZe16pRA@neuroprep-db.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

export default app;
