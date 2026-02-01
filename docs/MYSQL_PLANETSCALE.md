# 🗄️ MYSQL IMPLEMENTATION #1 - PlanetScale (Serverless)



## **Complete PlanetScale MySQL Setup**

---



## **1. Setup PlanetScale Account**



### **Sign Up:**
1. Go to https://planetscale.com
2. Sign up with GitHub
3. Create new database: "neuroprep-ai"
4. Region: Mumbai (ap-south-1) or Singapore (ap-southeast-1)



### **Get Connection String:**

```bash


# Click "Connect" in PlanetScale dashboard


# Copy connection string

```text

---



## **2. Install Dependencies**


```bash
npm install @planetscale/database dotenv
npm install -D prisma @prisma/client

```text

---



## **3. Environment Variables**

Create `frontend/.env.local`:

```env


# PlanetScale
DATABASE_URL="mysql://username:password@host/database?sslaccept=strict"
DATABASE_HOST="aws.connect.psdb.cloud"
DATABASE_USERNAME="your-username"
DATABASE_PASSWORD="your-password"

```text

---



## **4. Database Schema**

Create `frontend/prisma/schema.prisma`:


```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  name          String?
  passwordHash  String?
  githubId      String?  @unique
  linkedinId    String?  @unique
  isPremium     Boolean  @default(false)
  xp            Int      @default(0)
  level         Int      @default(1)
  streak        Int      @default(0)
  lastLogin     DateTime @default(now())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  sessions      InterviewSession[]
  payments      Payment[]
  questions     QuestionHistory[]
  analytics     AnalyticsEvent[]

  @@index([email])
  @@index([githubId])
  @@index([isPremium])
}

model InterviewSession {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  role            String
  difficulty      Int
  score           Int       @default(0)
  questionsAsked  Int       @default(0)
  correctAnswers  Int       @default(0)

  startTime       DateTime  @default(now())
  endTime         DateTime?
  duration        Int?      // seconds
  xpEarned        Int       @default(0)

  questions       QuestionHistory[]

  @@index([userId])
  @@index([startTime(sort: Desc)])
  @@index([role])
}

model Payment {
  id                String   @id @default(uuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  amount            Int      // in paise/cents
  currency          String   @default("INR")
  method            String   // 'upi', 'card', 'netbanking'

  razorpayOrderId   String?  @unique
  razorpayPaymentId String?  @unique
  razorpaySignature String?

  status            String   @default("pending") // 'pending', 'completed', 'failed'
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([userId])
  @@index([status])
  @@index([createdAt(sort: Desc)])
}

model QuestionHistory {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  sessionId    String
  session      InterviewSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  questionHash String
  question     String   @db.Text
  userAnswer   String?  @db.Text
  isCorrect    Boolean?
  timeTaken    Int?     // seconds

  askedAt      DateTime @default(now())

  @@index([userId])
  @@index([sessionId])
  @@index([questionHash])
  @@index([askedAt(sort: Desc)])
}

model AnalyticsEvent {
  id        String   @id @default(uuid())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  eventType String   // 'page_view', 'button_click', 'feature_used'
  eventData String?  @db.Text // JSON string

  createdAt DateTime @default(now())

  @@index([userId])
  @@index([eventType])
  @@index([createdAt(sort: Desc)])
}

```text

---



## **5. Initialize Prisma**


```bash


# Generate Prisma Client
npx prisma generate



# Push schema to PlanetScale
npx prisma db push

```text

---



## **6. Create Database Client**

Create `frontend/lib/planetscale.ts`:


```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Auth functions
export const auth = {
  async signup(email: string, name: string, password: string) {
    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    return user;
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user?.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return user;
  },

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  async upgradeToPremium(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isPremium: true },
    });
  },
};

// Session functions
export const sessions = {
  async startSession(userId: string, role: string, difficulty: number) {
    return await prisma.interviewSession.create({
      data: {
        userId,
        role,
        difficulty,
      },
    });
  },

  async endSession(sessionId: string, score: number, xpEarned: number) {
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) throw new Error('Session not found');

    const duration = Math.floor(
      (Date.now() - session.startTime.getTime()) / 1000
    );

    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        endTime: new Date(),
        duration,
        score,
        xpEarned,
      },
    });

    // Update user XP
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (user) {
      const newXP = user.xp + xpEarned;
      const newLevel = Math.floor(newXP / 1000) + 1;

      await prisma.user.update({
        where: { id: session.userId },
        data: {
          xp: newXP,
          level: newLevel,
        },
      });
    }
  },

  async getRecentSessions(userId: string, limit: number = 10) {
    return await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: limit,
    });
  },
};

// Payment functions
export const payments = {
  async createOrder(
    userId: string,
    amount: number,
    method: string,
    razorpayOrderId?: string
  ) {
    return await prisma.payment.create({
      data: {
        userId,
        amount,
        method,
        razorpayOrderId,
      },
    });
  },

  async completePayment(
    paymentId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'completed',
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    // Upgrade user to premium
    await auth.upgradeToPremium(payment.userId);

    return payment;
  },

  async getPaymentHistory(userId: string) {
    return await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },
};

// Question tracking
export const questions = {
  async recordQuestion(
    userId: string,
    sessionId: string,
    questionHash: string,
    question: string,
    userAnswer: string,
    isCorrect: boolean,
    timeTaken: number
  ) {
    await prisma.questionHistory.create({
      data: {
        userId,
        sessionId,
        questionHash,
        question,
        userAnswer,
        isCorrect,
        timeTaken,
      },
    });
  },

  async getAskedQuestions(userId: string): Promise<Set<string>> {
    const questions = await prisma.questionHistory.findMany({
      where: { userId },
      select: { questionHash: true },
    });

    return new Set(questions.map(q => q.questionHash));
  },

  async getStats(userId: string) {
    const allQuestions = await prisma.questionHistory.findMany({
      where: { userId },
    });

    const totalQuestions = allQuestions.length;
    const correctAnswers = allQuestions.filter(q => q.isCorrect).length;
    const accuracy = totalQuestions > 0
      ? (correctAnswers / totalQuestions) * 100
      : 0;
    const averageTime = totalQuestions > 0
      ? allQuestions.reduce((sum, q) => sum + (q.timeTaken || 0), 0) / totalQuestions
      : 0;

    return {
      totalQuestions,
      correctAnswers,
      accuracy,
      averageTime,
    };
  },
};

// Analytics
export const analytics = {
  async track(
    eventType: string,
    eventData?: any,
    userId?: string
  ) {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType,
        eventData: eventData ? JSON.stringify(eventData) : null,
      },
    });
  },

  async getEvents(userId: string, limit: number = 100) {
    return await prisma.analyticsEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
};

```text

---



## **7. API Routes**



### **Create `app/api/auth/signup/route.ts`:**


```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/planetscale';

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json();

    const user = await auth.signup(email, name, password);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

```text



### **Create `app/api/auth/login/route.ts`:**


```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/planetscale';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await auth.login(email, password);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.isPremium,
        xp: user.xp,
        level: user.level,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }
}

```text

---



## **8. Deploy to PlanetScale**


```bash


# Create production branch
pscale branch create neuroprep-ai production



# Deploy schema
npx prisma db push



# Promote to production
pscale deploy-request create neuroprep-ai production



# Get production connection string
pscale connect neuroprep-ai production

```text

---



## **9. Advantages**

✅ **FREE Tier:** 5 GB storage, 1B row reads/month
✅ **Serverless:** No servers to manage
✅ **Branching:** Git-like database branches
✅ **Auto-scaling:** Handles traffic spikes
✅ **Global:** Low latency worldwide
✅ **Prisma:** Type-safe database access

---



## **COMPLETE PLANETSCALE SETUP! 🚀**
