# 🗄️ MYSQL IMPLEMENTATION #2 - Traditional MySQL + Sequelize


## **Complete MySQL Setup with Sequelize ORM**

---


## **1. Install MySQL**


### **Option A: Local MySQL**

```bash

# Windows (using Chocolatey)
choco install mysql


# Or download from: https://dev.mysql.com/downloads/mysql/


# Start MySQL
net start mysql

```text


### **Option B: Docker MySQL**

```bash
docker run --name neuroprep-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=neuroprep \
  -p 3306:3306 \
  -d mysql:8.0

```text


### **Option C: Railway (FREE Cloud MySQL)**
1. Go to https://railway.app
2. New Project → MySQL
3. Copy connection string

---


## **2. Install Dependencies**


```bash
npm install sequelize mysql2 bcryptjs
npm install -D @types/sequelize

```text

---


## **3. Environment Variables**

Create `frontend/.env.local`:

```env

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=neuroprep


# Or use connection URL
DATABASE_URL="mysql://root:root@localhost:3306/neuroprep"

```text

---


## **4. Database Configuration**

Create `frontend/lib/mysql-config.ts`:


```typescript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'neuroprep',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;

```text

---


## **5. Define Models**

Create `frontend/lib/models/index.ts`:


```typescript
import { DataTypes, Model } from 'sequelize';
import sequelize from '../mysql-config';

// User Model
export class User extends Model {
  declare id: string;
  declare email: string;
  declare name: string | null;
  declare passwordHash: string | null;
  declare githubId: string | null;
  declare linkedinId: string | null;
  declare isPremium: boolean;
  declare xp: number;
  declare level: number;
  declare streak: number;
  declare lastLogin: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    githubId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    linkedinId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastLogin: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    indexes: [
      { fields: ['email'] },
      { fields: ['githubId'] },
      { fields: ['isPremium'] },
    ],
  }
);

// Interview Session Model
export class InterviewSession extends Model {
  declare id: string;
  declare userId: string;
  declare role: string;
  declare difficulty: number;
  declare score: number;
  declare questionsAsked: number;
  declare correctAnswers: number;
  declare startTime: Date;
  declare endTime: Date | null;
  declare duration: number | null;
  declare xpEarned: number;
}

InterviewSession.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    difficulty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    questionsAsked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    correctAnswers: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    startTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    xpEarned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'InterviewSession',
    tableName: 'interview_sessions',
    timestamps: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['startTime'] },
      { fields: ['role'] },
    ],
  }
);

// Payment Model
export class Payment extends Model {
  declare id: string;
  declare userId: string;
  declare amount: number;
  declare currency: string;
  declare method: string;
  declare razorpayOrderId: string | null;
  declare razorpayPaymentId: string | null;
  declare razorpaySignature: string | null;
  declare status: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'INR',
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    razorpaySignature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    indexes: [
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['createdAt'] },
    ],
  }
);

// Question History Model
export class QuestionHistory extends Model {
  declare id: string;
  declare userId: string;
  declare sessionId: string;
  declare questionHash: string;
  declare question: string;
  declare userAnswer: string | null;
  declare isCorrect: boolean | null;
  declare timeTaken: number | null;
  declare askedAt: Date;
}

QuestionHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'interview_sessions',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    questionHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userAnswer: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    timeTaken: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    askedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'QuestionHistory',
    tableName: 'question_history',
    timestamps: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['sessionId'] },
      { fields: ['questionHash'] },
      { fields: ['askedAt'] },
    ],
  }
);

// Define associations
User.hasMany(InterviewSession, { foreignKey: 'userId' });
User.hasMany(Payment, { foreignKey: 'userId' });
User.hasMany(QuestionHistory, { foreignKey: 'userId' });

InterviewSession.belongsTo(User, { foreignKey: 'userId' });
InterviewSession.hasMany(QuestionHistory, { foreignKey: 'sessionId' });

Payment.belongsTo(User, { foreignKey: 'userId' });

QuestionHistory.belongsTo(User, { foreignKey: 'userId' });
QuestionHistory.belongsTo(InterviewSession, { foreignKey: 'sessionId' });

export { sequelize };

```text

---


## **6. Database Service**

Create `frontend/lib/mysql-service.ts`:


```typescript
import bcrypt from 'bcryptjs';
import { User, InterviewSession, Payment, QuestionHistory, sequelize } from './models';

// Initialize database
export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected');
    
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}

// Auth functions
export const auth = {
  async signup(email: string, name: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      email,
      name,
      passwordHash,
    });
    
    return user.toJSON();
  },

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    
    if (!user?.passwordHash) {
      throw new Error('Invalid credentials');
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    
    await user.update({ lastLogin: new Date() });
    
    return user.toJSON();
  },

  async getUserById(id: string) {
    const user = await User.findByPk(id);
    return user?.toJSON();
  },

  async upgradeToPremium(userId: string) {
    const user = await User.findByPk(userId);
    if (user) {
      await user.update({ isPremium: true });
    }
  },
};

// Session functions
export const sessions = {
  async startSession(userId: string, role: string, difficulty: number) {
    const session = await InterviewSession.create({
      userId,
      role,
      difficulty,
    });
    
    return session.toJSON();
  },

  async endSession(sessionId: string, score: number, xpEarned: number) {
    const session = await InterviewSession.findByPk(sessionId);
    
    if (!session) throw new Error('Session not found');
    
    const duration = Math.floor(
      (Date.now() - session.startTime.getTime()) / 1000
    );
    
    await session.update({
      endTime: new Date(),
      duration,
      score,
      xpEarned,
    });
    
    // Update user XP
    const user = await User.findByPk(session.userId);
    if (user) {
      const newXP = user.xp + xpEarned;
      const newLevel = Math.floor(newXP / 1000) + 1;
      
      await user.update({
        xp: newXP,
        level: newLevel,
      });
    }
  },

  async getRecentSessions(userId: string, limit: number = 10) {
    const sessions = await InterviewSession.findAll({
      where: { userId },
      order: [['startTime', 'DESC']],
      limit,
    });
    
    return sessions.map(s => s.toJSON());
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
    const payment = await Payment.create({
      userId,
      amount,
      method,
      razorpayOrderId,
    });
    
    return payment.toJSON();
  },

  async completePayment(
    paymentId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    const payment = await Payment.findByPk(paymentId);
    
    if (!payment) throw new Error('Payment not found');
    
    await payment.update({
      status: 'completed',
      razorpayPaymentId,
      razorpaySignature,
    });
    
    await auth.upgradeToPremium(payment.userId);
    
    return payment.toJSON();
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
    await QuestionHistory.create({
      userId,
      sessionId,
      questionHash,
      question,
      userAnswer,
      isCorrect,
      timeTaken,
    });
  },

  async getAskedQuestions(userId: string): Promise<Set<string>> {
    const questions = await QuestionHistory.findAll({
      where: { userId },
      attributes: ['questionHash'],
    });
    
    return new Set(questions.map(q => q.questionHash));
  },

  async getStats(userId: string) {
    const allQuestions = await QuestionHistory.findAll({
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

```text

---


## **7. Initialize on Server Start**

Create `frontend/lib/init-db.ts`:


```typescript
import { initDatabase } from './mysql-service';

let initialized = false;

export async function ensureDatabase() {
  if (!initialized) {
    await initDatabase();
    initialized = true;
  }
}

```text

---


## **8. API Route Example**

`app/api/sessions/start/route.ts`:


```typescript
import { NextResponse } from 'next/server';
import { ensureDatabase } from '@/lib/init-db';
import { sessions } from '@/lib/mysql-service';

export async function POST(request: Request) {
  try {
    await ensureDatabase();
    
    const { userId, role, difficulty } = await request.json();
    
    const session = await sessions.startSession(userId, role, difficulty);
    
    return NextResponse.json({ success: true, session });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

```text

---


## **COMPLETE MYSQL + SEQUELIZE SETUP! 🗄️**
