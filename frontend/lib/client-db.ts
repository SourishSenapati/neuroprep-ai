/**
 * Client-Side Database using IndexedDB
 * Replaces backend completely - works offline!
 */

import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  email: string;
  name: string;
  password?: string; // Hashed
  isPremium: boolean;
  xp: number;
  level: number;
  streak: number;
  lastLogin: number;
  createdAt: number;
  githubId?: string;
  linkedinId?: string;
}

export interface InterviewSession {
  id?: number;
  userId: number;
  role: string;
  difficulty: number;
  score: number;
  questionsAsked: number;
  correctAnswers: number;
  startTime: number;
  endTime?: number;
  duration?: number; // seconds
  xpEarned: number;
}

export interface Payment {
  id?: number;
  userId: number;
  amount: number;
  currency: string;
  method: string; // 'upi', 'card', 'demo'
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  createdAt: number;
}

export interface QuestionHistory {
  id?: number;
  userId: number;
  sessionId: number;
  questionHash: string;
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken: number; // seconds
  askedAt: number;
}

class NeuroprepDatabase extends Dexie {
  users!: Table<User, number>;
  sessions!: Table<InterviewSession, number>;
  payments!: Table<Payment, number>;
  questionHistory!: Table<QuestionHistory, number>;

  constructor() {
    super('NeuroprepDB');
    
    this.version(1).stores({
      users: '++id, email, isPremium, lastLogin',
      sessions: '++id, userId, startTime, role',
      payments: '++id, userId, status, createdAt',
      questionHistory: '++id, userId, sessionId, questionHash, askedAt'
    });
  }
}

// Create singleton instance
export const db = new NeuroprepDatabase();

// Auth helpers
export const auth = {
  async signup(email: string, name: string, password: string): Promise<User> {
    // Hash password (simple for demo - use bcrypt in production)
    const hashedPassword = btoa(password);
    
    // Check if user exists
    const existing = await db.users.where('email').equals(email).first();
    if (existing) {
      throw new Error('User already exists');
    }
    
    // Create user
    const user: User = {
      email,
      name,
      password: hashedPassword,
      isPremium: false,
      xp: 0,
      level: 1,
      streak: 0,
      lastLogin: Date.now(),
      createdAt: Date.now()
    };
    
    const id = await db.users.add(user);
    user.id = id;
    
    // Store in localStorage for session
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  },

  async login(email: string, password: string): Promise<User> {
    const hashedPassword = btoa(password);
    
    const user = await db.users.where('email').equals(email).first();
    
    if (!user || user.password !== hashedPassword) {
      throw new Error('Invalid credentials');
    }
    
    // Update last login
    await db.users.update(user.id!, { lastLogin: Date.now() });
    
    // Update session
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  },

  async loginWithGithub(githubProfile: any): Promise<User> {
    // Check if user exists with this GitHub ID
    let user = await db.users.where('githubId').equals(githubProfile.id.toString()).first();
    
    if (!user) {
      // Create new user
      user = {
        email: githubProfile.email || `github-${githubProfile.id}@neuroprep.ai`,
        name: githubProfile.name || githubProfile.login,
        githubId: githubProfile.id.toString(),
        isPremium: false,
        xp: 100, // Bonus for OAuth signup
        level: 1,
        streak: 0,
        lastLogin: Date.now(),
        createdAt: Date.now()
      };
      
      const id = await db.users.add(user);
      user.id = id;
    } else {
      // Update last login
      await db.users.update(user.id!, { lastLogin: Date.now() });
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout() {
    localStorage.removeItem('currentUser');
  },

  async upgradeToPremium(userId: number): Promise<void> {
    await db.users.update(userId, { isPremium: true });
    
    // Update session
    const user = await db.users.get(userId);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }
};

// Payment helpers
export const payments = {
  async createOrder(userId: number, amount: number, method: string): Promise<Payment> {
    const payment: Payment = {
      userId,
      amount,
      currency: 'INR',
      method,
      status: 'pending',
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    };
    
    const id = await db.payments.add(payment);
    payment.id = id;
    
    return payment;
  },

  async completePayment(paymentId: number): Promise<void> {
    const payment = await db.payments.get(paymentId);
    if (!payment) throw new Error('Payment not found');
    
    await db.payments.update(paymentId, { status: 'completed' });
    
    // Upgrade user to premium
    await auth.upgradeToPremium(payment.userId);
  },

  async simulateUPIPayment(userId: number, amount: number): Promise<Payment> {
    const payment = await this.createOrder(userId, amount, 'upi-demo');
    
    // Simulate 2 second delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Complete payment
    await this.completePayment(payment.id!);
    
    return payment;
  }
};

// Session helpers
export const sessions = {
  async startSession(userId: number, role: string, difficulty: number): Promise<InterviewSession> {
    const session: InterviewSession = {
      userId,
      role,
      difficulty,
      score: 0,
      questionsAsked: 0,
      correctAnswers: 0,
      startTime: Date.now(),
      xpEarned: 0
    };
    
    const id = await db.sessions.add(session);
    session.id = id;
    
    return session;
  },

  async endSession(sessionId: number, finalScore: number, xpEarned: number): Promise<void> {
    const session = await db.sessions.get(sessionId);
    if (!session) return;
    
    const duration = Math.floor((Date.now() - session.startTime) / 1000);
    
    await db.sessions.update(sessionId, {
      endTime: Date.now(),
      duration,
      score: finalScore,
      xpEarned
    });
    
    // Update user XP
    const user = await db.users.get(session.userId);
    if (user) {
      const newXP = user.xp + xpEarned;
      const newLevel = Math.floor(newXP / 1000) + 1;
      
      await db.users.update(session.userId, {
        xp: newXP,
        level: newLevel
      });
    }
  },

  async getRecentSessions(userId: number, limit: number = 10): Promise<InterviewSession[]> {
    return await db.sessions
      .where('userId')
      .equals(userId)
      .reverse()
      .limit(limit)
      .toArray();
  }
};

// Question tracking (for uniqueness)
export const questionTracking = {
  async recordQuestion(
    userId: number,
    sessionId: number,
    questionHash: string,
    question: string,
    userAnswer: string,
    isCorrect: boolean,
    timeTaken: number
  ): Promise<void> {
    await db.questionHistory.add({
      userId,
      sessionId,
      questionHash,
      question,
      userAnswer,
      isCorrect,
      timeTaken,
      askedAt: Date.now()
    });
  },

  async getAskedQuestions(userId: number): Promise<Set<string>> {
    const history = await db.questionHistory
      .where('userId')
      .equals(userId)
      .toArray();
    
    return new Set(history.map(q => q.questionHash));
  },

  async getStats(userId: number): Promise<{
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    averageTime: number;
  }> {
    const history = await db.questionHistory
      .where('userId')
      .equals(userId)
      .toArray();
    
    const totalQuestions = history.length;
    const correctAnswers = history.filter(q => q.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const averageTime = totalQuestions > 0
      ? history.reduce((sum, q) => sum + q.timeTaken, 0) / totalQuestions
      : 0;
    
    return {
      totalQuestions,
      correctAnswers,
      accuracy,
      averageTime
    };
  }
};

// Initialize database on load
if (typeof window !== 'undefined') {
  db.open().catch(err => {
    console.error('Failed to open database:', err);
  });
}
