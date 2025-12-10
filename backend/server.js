import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { z } from 'zod';
import Redis from 'ioredis';
import * as db from './db.ts';
import { SessionManager } from './sessionManager.ts';
import simRouter from './routes/sim.ts';
import stripeRouter from './routes/stripe.ts';
import { singularityEngine } from './singularityEngine.ts';
import { streamInitialQuestion, streamChatResponse, analyzeResponse, generateSessionInsights } from './aiEngine.js';
import { questionBankManager, QUESTION_BANK_STATS } from './questionBank.ts';
import { freemiumCheck } from './middleware/freemium.ts';
import { errorFixes, EnhancedSessionManager } from './errorFixes.ts';
import { initDatabase, createTables, createSession, updateSession, saveQuestion, saveBiometric, getDashboardData } from './database.js';
import passport, { setupAuthRoutes, verifyToken } from './auth.js';
import { trackAttempt, checkAttemptLimit, getRemainingAttempts } from './middleware/attemptTracker.js';

// Mock crypto for QuantumRNG (WebCrypto)
const crypto = {
  webcrypto: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 4294967296);
      }
      return arr;
    }
  }
};

// Mock TensorFlow.js Node (would require actual install)
const tf = {
  ready: async () => console.log('TensorFlow.js Node Backend Ready'),
  tidy: (fn) => fn(),
  tensor: (data) => ({ dataSync: () => data }),
  dispose: () => {}
};

// Mock ElevenLabs (would require actual install)
const elevenLabs = {
  generate: async ({ text }) => Buffer.from('mock_audio_buffer')
};

dotenv.config();

// QuantumRNG: WebCrypto.subtle for entangled seeds (Node.js implementation)
function initQuantumRNG() {
  const array = new Uint32Array(1);
  crypto.webcrypto.getRandomValues(array);
  console.log(`[QUANTUM_RNG] Entangled Seed Initialized: ${array[0]}`);
  return array[0];
}

initQuantumRNG();

// Environment validation
const envSchema = z.object({
  PORT: z.string().default('5000'),
  REDIS_URL: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:3000')
});

const env = envSchema.parse(process.env);

// Initialize Express
const app = express();
const httpServer = createServer(app);

// Security & Performance Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors(errorFixes.corsConfig));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session middleware (simplified for development)
// app.use(session({ ... })); // Disabled for now

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Setup authentication routes
setupAuthRoutes(app);

// Rate limiting with enhanced configuration
const limiter = rateLimit(errorFixes.rateLimitConfig);
app.use('/api/', limiter);

// Redis setup
let redisClient = null;
let redisPub = null;
let redisSub = null;

if (env.REDIS_URL) {
  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000)
  });
  redisPub = new Redis(env.REDIS_URL);
  redisSub = new Redis(env.REDIS_URL);

  redisClient.on('error', (err) => console.error('Redis Client Error:', err));
  redisPub.on('error', (err) => console.error('Redis Pub Error:', err));
  redisSub.on('error', (err) => console.error('Redis Sub Error:', err));
}

// PostgreSQL setup with fallback
let pgPool = null;
if (env.DATABASE_URL) {
  try {
    pgPool = db.initPool(env.DATABASE_URL);
    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.warn('PostgreSQL connection failed, using mock database:', error.message);
    pgPool = null;
  }
} else {
  console.log('No DATABASE_URL provided, using mock database');
}

// Initialize Database
let database;
(async () => {
  try {
    database = initDatabase();
    await createTables();
    console.log('MySQL database connected and tables created');
  } catch (error) {
    console.warn('Database connection failed, using mock:', error.message);
    database = errorFixes.createMockDatabase();
  }
})();

// Enhanced Session Manager
const sessionManager = new EnhancedSessionManager();

// Session store disabled for development
let sessionStore = null;

// RAG Knowledge Base - MIT/Caltech PhD-level questions
const RAG_KNOWLEDGE_BASE = {
  quantum: [
    {
      topic: 'Quantum Entanglement',
      abstract: 'Quantum entanglement describes correlations between quantum systems that cannot be explained by classical physics. When particles become entangled, measuring one instantly affects the other regardless of distance. Bell inequalities prove these correlations violate local realism.',
      difficulty: 9,
      questions: [
        'Derive the CHSH inequality and explain how quantum mechanics violates it.',
        'Explain the EPR paradox and how it relates to quantum non-locality.',
        'How does quantum entanglement enable quantum teleportation?'
      ]
    },
    {
      topic: 'Quantum Computing',
      abstract: 'Quantum computers leverage superposition and entanglement to solve certain problems exponentially faster than classical computers. Shor\'s algorithm factors large numbers in polynomial time, threatening RSA encryption.',
      difficulty: 8,
      questions: [
        'Implement Grover\'s algorithm and analyze its quadratic speedup.',
        'Explain quantum error correction using the surface code.',
        'Derive the quantum Fourier transform circuit.'
      ]
    }
  ],
  ml: [
    {
      topic: 'Transformer Architecture',
      abstract: 'Transformers use self-attention mechanisms to process sequential data in parallel. Multi-head attention allows the model to attend to different representation subspaces. Positional encodings inject sequence order information.',
      difficulty: 7,
      questions: [
        'Derive the scaled dot-product attention formula and explain the scaling factor.',
        'Implement multi-head attention from scratch in NumPy.',
        'Explain the vanishing gradient problem and how residual connections solve it.'
      ]
    },
    {
      topic: 'Reinforcement Learning',
      abstract: 'RL agents learn optimal policies through trial and error. The Bellman equation provides recursive decomposition of value functions. Policy gradient methods directly optimize the policy using gradient ascent.',
      difficulty: 8,
      questions: [
        'Derive the policy gradient theorem (REINFORCE algorithm).',
        'Explain the exploration-exploitation tradeoff in multi-armed bandits.',
        'Implement Q-learning with experience replay.'
      ]
    }
  ],
  algorithms: [
    {
      topic: 'Dynamic Programming',
      abstract: 'Dynamic programming solves optimization problems by breaking them into overlapping subproblems. Memoization caches results to avoid redundant computation. The principle of optimality ensures subproblem solutions combine optimally.',
      difficulty: 6,
      questions: [
        'Solve the longest increasing subsequence problem in O(n log n) time.',
        'Implement the Knapsack problem with space optimization.',
        'Explain the difference between top-down and bottom-up DP.'
      ]
    }
  ],
  physics: [
    {
      topic: 'General Relativity',
      abstract: 'Einstein\'s field equations describe how mass-energy curves spacetime. The metric tensor encodes spacetime geometry. Geodesics represent paths of freely falling particles.',
      difficulty: 10,
      questions: [
        'Derive the Schwarzschild metric for a non-rotating black hole.',
        'Explain gravitational time dilation near a massive object.',
        'Calculate the precession of Mercury\'s orbit using GR.'
      ]
    }
  ]
};

// Adaptive prompt generation based on stress level
function generateAdaptivePrompt(topic, stressLevel, difficulty) {
  const basePrompt = `You are an elite PhD-level interviewer from MIT/Caltech. `;
  
  if (stressLevel > 7) {
    return basePrompt + `The candidate is showing high stress (${stressLevel}/10). Start with fundamentals and build up gradually. Use analogies and break down complex concepts. Topic: ${topic}. Difficulty: ${Math.max(1, difficulty - 2)}/10.`;
  } else if (stressLevel > 4) {
    return basePrompt + `The candidate is moderately stressed (${stressLevel}/10). Balance rigor with clarity. Topic: ${topic}. Difficulty: ${difficulty}/10.`;
  } else {
    return basePrompt + `The candidate is confident (${stressLevel}/10). Challenge them with advanced concepts and edge cases. Topic: ${topic}. Difficulty: ${Math.min(10, difficulty + 1)}/10.`;
  }
}

// Get relevant RAG context
function getRAGContext(topic, category = 'quantum') {
  const categoryData = RAG_KNOWLEDGE_BASE[category] || RAG_KNOWLEDGE_BASE.quantum;
  const relevantDocs = categoryData.filter(doc => 
    doc.topic.toLowerCase().includes(topic.toLowerCase()) ||
    topic.toLowerCase().includes(doc.topic.toLowerCase())
  );
  
  if (relevantDocs.length === 0) {
    return categoryData[0]; // Return first doc as fallback
  }
  
  return relevantDocs[0];
}

// Socket.IO setup with enhanced configuration
const io = new Server(httpServer, errorFixes.socketConfig);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('join-session', async (data) => {
    const { sessionId, userId } = data;
    socket.join(sessionId);
    socket.emit('session-joined', { sessionId, timestamp: Date.now() });
  });
  
  socket.on('interview-response', async (data) => {
    try {
      const { sessionId, response, questionContext, biometrics } = data;
      
      const analysis = await analyzeResponse(
        response,
        questionContext,
        {
          stressLevel: biometrics.stressLevel || 5,
          responseTime: biometrics.responseTime || 60,
          keystrokes: biometrics.keystrokes || response.length
        }
      );
      
      await sessionManager.addResponse(
        sessionId,
        questionContext,
        response,
        {
          eqScore: analysis.eqScore,
          technicalScore: analysis.technicalScore,
          authenticityScore: analysis.authenticityScore
        },
        {
          stressLevel: biometrics.stressLevel || 5,
          responseTime: biometrics.responseTime || 60
        }
      );
      
      // Store in database
      try {
        await saveQuestion({
          session_id: sessionId,
          question_text: questionContext,
          user_response: response,
          technical_score: analysis.technicalScore,
          response_time: biometrics.responseTime || 60,
          difficulty: 5, // Default difficulty
          topic: 'General',
          question_type: 'technical'
        });
      } catch (error) {
        console.warn('Failed to save question to database:', error.message);
      }
      
      if (analysis.cheatDetected) {
        await sessionManager.flagSession(sessionId, 'CHEAT_DETECTED');
      }
      
      if (analysis.adaptationNeeded) {
        await sessionManager.flagSession(sessionId, 'ADAPTATION_NEEDED');
      }
      
      io.to(sessionId).emit('analysis-complete', {
        analysis,
        timestamp: Date.now()
      });
      
      await sessionManager.publishEvent('interview-events', {
        type: 'response-analyzed',
        sessionId,
        analysis
      });
      
    } catch (error) {
      console.error('Error analyzing response:', error);
      socket.emit('error', { message: error.message });
    }
  });
  
  socket.on('biometrics-update', async (data) => {
    const { sessionId, stressLevel, heartRate, emotion } = data;
    
    // Store biometric in database
    try {
      await saveBiometric({
        session_id: sessionId,
        stress_level: stressLevel,
        heart_rate: heartRate,
        emotion: emotion
      });
    } catch (error) {
      console.warn('Failed to save biometric to database:', error.message);
    }
    
    io.to(sessionId).emit('biometrics-updated', { stressLevel, heartRate, emotion, timestamp: Date.now() });
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Redis pub/sub for distributed sessions
if (redisSub) {
  redisSub.subscribe('interview-events', (err, count) => {
    if (err) {
      console.error('Failed to subscribe:', err);
    } else {
      console.log(`Subscribed to ${count} channel(s)`);
    }
  });
  
  redisSub.on('message', (channel, message) => {
    try {
      const event = JSON.parse(message);
      if (event.type === 'response-analyzed') {
        io.to(event.sessionId).emit('analysis-broadcast', event.analysis);
      }
    } catch (err) {
      console.error('Error processing Redis message:', err);
    }
  });
}

// Get dashboard data
app.get('/api/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!pgPool) {
      // Return mock data when database is not configured
      return res.json({
        totalSessions: 0,
        averageScore: 0,
        topicCoverage: {},
        recentSessions: [],
        questionBankStats: QUESTION_BANK_STATS
      });
    }
    
    const dashboardData = await db.getDashboardData(userId);
    
    res.json({
      ...dashboardData,
      questionBankStats: QUESTION_BANK_STATS
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    services: {
      redis: redisClient ? 'connected' : 'disabled',
      postgres: pgPool ? 'connected' : 'disabled'
    },
    questionBank: {
      totalPatterns: QUESTION_BANK_STATS.totalPatterns,
      estimatedCombinations: QUESTION_BANK_STATS.estimatedCombinations()
    }
  });
});

// Question bank statistics
app.get('/api/question-stats', (req, res) => {
  res.json({
    ...QUESTION_BANK_STATS,
    estimatedCombinations: QUESTION_BANK_STATS.estimatedCombinations(),
    message: 'NeuroPrep AI can generate over 1 million unique questions per engineering discipline'
  });
});

// Get session question statistics
app.get('/api/session-stats/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const stats = questionBankManager.getSessionStats(sessionId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching session stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// API Routes

// Stripe routes
app.use('/api/stripe', stripeRouter);

// Simulation routes
app.use('/api/sim', simRouter);

// Benchmark query
app.get('/api/benchmarks/:mode', async (req, res) => {
  try {
    const { mode } = req.params;
    
    if (!pgPool) {
      return res.status(503).json({ error: 'Database not configured' });
    }
    
    const result = await pgPool.query(
      'SELECT AVG((responses->>\"eqScore\")::float) as avg_eq, AVG((responses->>\"technicalScore\")::float) as avg_tech, AVG(neural_resilience) as avg_resilience, COUNT(*) as sample_size FROM sessions WHERE mode = $1',
      [mode]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Benchmark query error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start interview session with freemium check
// [Duplicate forge-link removed]

// Get remaining attempts
app.get('/api/attempts', getRemainingAttempts);

// Start interview session with freemium check
app.post('/api/start-session', trackAttempt, checkAttemptLimit, async (req, res) => {
  try {
    // Accept sessionId if provided, otherwise fallback to creating one (though frontend should provide it)
    const { userId, mode, role, difficulty, persona, sessionId } = req.body;
    
    let session;
    if (sessionId) {
      session = singularityEngine.getSession(sessionId);
    }
    
    if (!session) {
       // Fallback: create a new session
       const result = await singularityEngine.forgeLink({ userId, mode, role, difficulty, persona });
       session = singularityEngine.getSession(result.sessionId);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    let fullQuestion = '';
    
    await streamInitialQuestion(session, (chunk) => {
      fullQuestion += chunk;
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
    });
    
    // Update transcript
    singularityEngine.addTranscriptEntry(session.sessionId, { role: 'ai', content: fullQuestion });
    
    res.write(`data: ${JSON.stringify({ type: 'complete', sessionId: session.sessionId, question: fullQuestion })}\n\n`);
    res.end();
    
  } catch (error) {
    console.error('Error starting session:', error);
    console.error('Request body:', req.body);
    if (!res.headersSent) {
      res.status(400).json({ error: error.message, details: JSON.stringify(error) });
    }
  }
});

// Stream Chat Response
app.post('/api/stream', checkAttemptLimit, async (req, res) => {
  try {
    const { messages, topic, stressLevel, role, difficulty, persona, sessionId } = req.body;
    
    let session = sessionId ? singularityEngine.getSession(sessionId) : null;
    
    // If no session found (e.g. server restart), recreate ephemeral state
    if (!session) {
       const result = await singularityEngine.forgeLink({ userId: 'anon', mode: 'standard', role, difficulty, persona });
       session = singularityEngine.getSession(result.sessionId);
    }

    const lastUserMessage = messages[messages.length - 1].content;
    singularityEngine.addTranscriptEntry(session.sessionId, { role: 'user', content: lastUserMessage });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = '';

    await streamChatResponse(session, lastUserMessage, (chunk) => {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    });
    
    singularityEngine.addTranscriptEntry(session.sessionId, { role: 'ai', content: fullResponse });
    
    // Extract Next Question from response (Heuristic: look for "Next Question:")
    const questionMatch = fullResponse.match(/Next Question:\s*(.*)/i);
    if (questionMatch && questionMatch[1]) {
      singularityEngine.trackQuestion(session.sessionId, questionMatch[1].trim());
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error streaming response:', error);
    if (!res.headersSent) res.status(500).json({ error: error.message });
  }
});

// Get session data
app.get('/api/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Try Redis first
    if (redisClient) {
      const cached = await redisClient.get(`session:${sessionId}`);
      if (cached) {
        return res.json({ sessionId, data: JSON.parse(cached) });
      }
    }
    
    // Fallback to PostgreSQL
    if (pgPool) {
      const result = await pgPool.query(
        'SELECT data FROM sessions WHERE id = $1',
        [sessionId]
      );
      
      if (result.rows.length > 0) {
        return res.json({ sessionId, data: result.rows[0].data });
      }
    }
    
    res.status(404).json({ error: 'Session not found' });
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Execute code (stub for Python/JS execution)
app.post('/api/execute', async (req, res) => {
  try {
    const schema = z.object({
      code: z.string(),
      language: z.enum(['python', 'javascript', 'typescript']),
      sessionId: z.string()
    });
    
    const { code, language, sessionId } = schema.parse(req.body);
    
    // In production, this would use a sandboxed execution environment
    // For now, return mock execution result
    const result = {
      success: true,
      output: `Executed ${language} code (${code.length} chars)`,
      executionTime: Math.random() * 1000,
      timestamp: Date.now()
    };
    
    // Publish to Redis for real-time updates
    if (redisPub) {
      await redisPub.publish('interview-events', JSON.stringify({
        type: 'code-executed',
        sessionId,
        data: result
      }));
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(400).json({ error: error.message });
  }
});

// Enhanced error handling middleware
app.use(errorFixes.createErrorHandler());

// Enhanced graceful shutdown
errorFixes.setupGracefulShutdown(httpServer, async () => {
  // Cleanup resources
  sessionManager.cleanup();
  
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('Redis client disconnected');
    } catch (error) {
      console.error('Error disconnecting Redis client:', error);
    }
  }
  
  if (redisPub) {
    try {
      await redisPub.quit();
      console.log('Redis pub client disconnected');
    } catch (error) {
      console.error('Error disconnecting Redis pub client:', error);
    }
  }
  
  if (redisSub) {
    try {
      await redisSub.quit();
      console.log('Redis sub client disconnected');
    } catch (error) {
      console.error('Error disconnecting Redis sub client:', error);
    }
  }
  
  if (pgPool && db.closePool) {
    try {
      await db.closePool();
      console.log('PostgreSQL pool closed');
    } catch (error) {
      console.error('Error closing PostgreSQL pool:', error);
    }
  }
});

// Register User
app.post('/api/register', async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      mobile: z.string().optional(),
      provider: z.string().optional()
    });
    
    const { email, mobile, provider } = schema.parse(req.body);
    
    if (pgPool) {
      // Check if user exists
      const existing = await pgPool.query('SELECT id FROM users WHERE email = $1', [email]);
      
      if (existing.rows.length > 0) {
        return res.json({ 
          success: true, 
          userId: existing.rows[0].id,
          message: 'User already exists, logged in.' 
        });
      }
      
      // Create new user
      const result = await pgPool.query(
        'INSERT INTO users (email, readiness) VALUES ($1, $2) RETURNING id',
        [email, JSON.stringify({ tech: 5, eq: 5, auth: 5 })]
      );
      
      res.json({ 
        success: true, 
        userId: result.rows[0].id,
        message: 'Account created successfully.' 
      });
    } else {
      // Mock registration for development without DB
      console.log(`[MOCK DB] Registered user: ${email}`);
      res.json({ 
        success: true, 
        userId: `user_${Date.now()}`, 
        message: 'Mock account created.' 
      });
    }
// ... existing register endpoint ...
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: error.message });
  }
});

// Check Limits
app.get('/api/check-limit', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.json({ remaining: 5 });
    
    const user = await db.getOrCreateUser(userId);
    const count = user.sessions_count || 0;
    const limit = 5;
    
    res.json({
      count,
      limit,
      remaining: Math.max(0, limit - count),
      isPro: (user).is_pro || false
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard Data
app.get('/api/dashboard', async (req, res) => {
  console.log('Dashboard API hit with query:', req.query);
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    
    const data = await db.getDashboardData(userId);
    const insights = await db.generateLongitudinalInsights(userId, process.env.OPENAI_API_KEY);
    
    res.json({ ...data, insights });
  } catch (error) {
    console.error('Dashboard Error:', error);
    // Write error to file for debugging
    const fs = require('fs');
    const path = require('path');
    fs.writeFileSync(path.join(process.cwd(), 'dashboard_debug.log'), `Error: ${error.message}\nStack: ${error.stack}`);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// --- Singularity Routes ---

// Apply Freemium Check to Singularity Actions
app.use('/api/forge-link', freemiumCheck);
app.use('/api/rift-exit', freemiumCheck);
app.use('/api/sim', simRouter);

app.post('/api/forge-link', async (req, res) => {
  try {
    const { userId, mode, role, difficulty, persona } = req.body;
    const result = await singularityEngine.forgeLink({ userId, mode, role, difficulty, persona });
    
    // DB Persistence Disabled for stability in local environment
    // The SingularityEngine (In-Memory) handles the session state perfectly.
    // This prevents any 'better-sqlite3' native crashes from blocking the interview.
    /*
    try {
      if (db.insertSingularitySession) {
        await db.insertSingularitySession(
          userId, 
          mode, 
          'quantum_seed_' + Date.now(), 
          []
        );
      }
    } catch (dbErr) {
       console.warn("DB Skipped");
    }
    */
    
    res.json(result);
  } catch (error) {
    console.error('Forge Link Error:', error);
    res.status(500).json({ error: 'Failed to forge neural link' });
  }
});

app.post('/api/rift-exit', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const insights = await singularityEngine.generateRiftInsights(sessionId);
    const sessionData = singularityEngine.getSessionData(sessionId);
    
    // Finalize session in DB
    if (db.updateSingularitySession) {
      const updatePayload = {
        riftScore: insights.reduce((acc, i) => acc + i.score, 0) / (insights.length || 1),
        biometrics: sessionData ? sessionData.biometrics : [],
        // Mock generating Gaussian Splat data for replay
        splatData: {
          density: 0.85,
          color_shift: 'purple-nebula',
          vortices: sessionData ? sessionData.biometrics.filter(b => b.gazeVariance > 0.5).length : 0
        }
      };
      
      await db.updateSingularitySession(sessionId, updatePayload);
    }

    res.json({ insights });
  } catch (error) {
    console.error('Rift Exit Error:', error);
    res.status(500).json({ error: 'Failed to generate rift insights' });
  }
});

app.get('/api/rift-manifold/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await db.getSingularitySession(id);
    if (!session) return res.status(404).json({ error: 'Rift manifold not found' });
    res.json(session);
  } catch (error) {
    console.error('Rift Manifold Error:', error);
    res.status(500).json({ error: 'Failed to retrieve manifold data' });
  }
});

// --- Nexus Sync Socket Namespace ---

const nexus = io.of('/nexus-sync');

nexus.on('connection', (socket) => {
  console.log(`[NEXUS] Neural Link Established: ${socket.id}`);

  socket.on('join-chamber', (sessionId) => {
    socket.join(sessionId);
    console.log(`[NEXUS] Socket ${socket.id} joined chamber ${sessionId}`);
  });

  socket.on('biometric-stream', async (data) => {
    // data: { sessionId, gazeVariance, voiceTremor }
    try {
      const { sessionId, ...biometrics } = data;
      const analysis = await singularityEngine.processBiometrics(sessionId, biometrics);
      
      if (analysis.riftWarning) {
        socket.emit('rift-warning', { 
          message: analysis.adjustment,
          intensity: biometrics.gazeVariance 
        });
      }
    } catch (e) {
      // Silent fail for stream processing to maintain speed
    }
  });

  socket.on('audio-stream', async (data) => {
    // Proxy for Whisper V3 STT + Prosody Analysis
    // In a real implementation, this would stream to an STT service
    // For now, we mock the "Silence > 4s" check
    
    // Mock VAD (Voice Activity Detection)
    const isSilence = Math.random() > 0.95; // 5% chance of silence detection per chunk
    
    if (isSilence) {
      socket.emit('vad-silence', { duration: 4500 });
      // Trigger auto-next logic if needed
    }
  });

  socket.on('disconnect', () => {
    console.log(`[NEXUS] Neural Link Severed: ${socket.id}`);
  });
});

// Start server
const PORT = parseInt(env.PORT);
httpServer.listen(PORT, () => {
  console.log(`🚀 NeuroPrep AI Backend running on port ${PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`CORS Origin: ${env.CORS_ORIGIN}`);
});

export default app;
