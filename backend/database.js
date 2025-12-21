import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure DB file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], sessions: [], questions: [], biometrics: [] }, null, 2));
}

let pool = null;
let useJsonDb = false;

function getJsonDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return { users: [], sessions: [], questions: [], biometrics: [] };
  }
}

function saveJsonDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function initDatabase() {
  if (pool) return pool;

  // Check if MySQL config is present
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD) {
    try {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'neuroprep_ai',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        acquireTimeout: 60000,
        timeout: 60000
      });
      console.log('MySQL Pool initialized');
      return pool;
    } catch (err) {
      console.warn('MySQL initialization failed, falling back to JSON DB', err);
    }
  }

  console.log('Using JSON File Persistence (data/db.json)');
  useJsonDb = true;
  return null;
}

export async function createTables() {
  const db = initDatabase();
  
  if (useJsonDb || !db) {
    console.log('JSON DB ready (schema implicit)');
    return;
  }

  // Users table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      email VARCHAR(255) UNIQUE,
      phone VARCHAR(20),
      password_hash VARCHAR(255),
      google_id VARCHAR(255),
      linkedin_id VARCHAR(255),
      twitter_id VARCHAR(255),
      name VARCHAR(255),
      avatar_url TEXT,
      role VARCHAR(100),
      level VARCHAR(50),
      is_pro BOOLEAN DEFAULT FALSE,
      sessions_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_google_id (google_id),
      INDEX idx_linkedin_id (linkedin_id),
      INDEX idx_twitter_id (twitter_id)
    )
  `);

  // Sessions table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      user_id VARCHAR(36),
      role VARCHAR(100),
      difficulty INT,
      mode VARCHAR(50),
      status ENUM('active', 'completed', 'abandoned') DEFAULT 'active',
      questions_asked INT DEFAULT 0,
      avg_score DECIMAL(5,2),
      technical_score DECIMAL(5,2),
      eq_score DECIMAL(5,2),
      authenticity_score DECIMAL(5,2),
      session_data JSON,
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_status (status),
      INDEX idx_started_at (started_at)
    )
  `);

  // Questions table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS session_questions (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      session_id VARCHAR(36),
      question_text TEXT,
      user_response TEXT,
      technical_score DECIMAL(5,2),
      response_time INT,
      difficulty INT,
      topic VARCHAR(100),
      question_type VARCHAR(50),
      asked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      INDEX idx_session_id (session_id),
      INDEX idx_topic (topic),
      INDEX idx_asked_at (asked_at)
    )
  `);

  // Biometrics table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS biometrics (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      session_id VARCHAR(36),
      stress_level DECIMAL(3,2),
      heart_rate INT,
      emotion VARCHAR(50),
      gaze_variance DECIMAL(5,4),
      voice_tremor DECIMAL(5,4),
      recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      INDEX idx_session_id (session_id),
      INDEX idx_recorded_at (recorded_at)
    )
  `);

  console.log('Database tables created successfully');
}

// Helper to generate UUID-like string
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// User management functions
export async function createUser(userData) {
  const db = initDatabase();
  const { email, phone, password, google_id, linkedin_id, twitter_id, name, avatar_url, role, level } = userData;
  
  let password_hash = null;
  if (password) {
    password_hash = await bcrypt.hash(password, 12);
  }

  if (useJsonDb || !db) {
    const data = getJsonDb();
    const newUser = {
      id: uuidv4(),
      email, phone, password_hash, google_id, linkedin_id, twitter_id, name, avatar_url, role, level,
      is_pro: false,
      sessions_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    data.users.push(newUser);
    saveJsonDb(data);
    return newUser.id;
  }
  
  const [result] = await db.execute(`
    INSERT INTO users (email, phone, password_hash, google_id, linkedin_id, twitter_id, name, avatar_url, role, level)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [email, phone, password_hash, google_id, linkedin_id, twitter_id, name, avatar_url, role, level]);
  
  return result.insertId;
}

export async function findUserByEmail(email) {
  const db = initDatabase();
  if (useJsonDb || !db) {
    const data = getJsonDb();
    return data.users.find(u => u.email === email) || null;
  }
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

export async function findUserByGoogleId(google_id) {
  const db = initDatabase();
  if (useJsonDb || !db) {
    const data = getJsonDb();
    return data.users.find(u => u.google_id === google_id) || null;
  }
  const [rows] = await db.execute('SELECT * FROM users WHERE google_id = ?', [google_id]);
  return rows[0] || null;
}

export async function findUserByLinkedInId(linkedin_id) {
  const db = initDatabase();
  if (useJsonDb || !db) {
    const data = getJsonDb();
    return data.users.find(u => u.linkedin_id === linkedin_id) || null;
  }
  const [rows] = await db.execute('SELECT * FROM users WHERE linkedin_id = ?', [linkedin_id]);
  return rows[0] || null;
}

export async function findUserByTwitterId(twitter_id) {
  const db = initDatabase();
  if (useJsonDb || !db) {
    const data = getJsonDb();
    return data.users.find(u => u.twitter_id === twitter_id) || null;
  }
  const [rows] = await db.execute('SELECT * FROM users WHERE twitter_id = ?', [twitter_id]);
  return rows[0] || null;
}

export async function findUserById(id) {
  const db = initDatabase();
  if (useJsonDb || !db) {
    const data = getJsonDb();
    return data.users.find(u => u.id === id) || null;
  }
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function updateUser(id, updates) {
  const db = initDatabase();
  if (useJsonDb || !db) {
    const data = getJsonDb();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      data.users[idx] = { ...data.users[idx], ...updates, updated_at: new Date().toISOString() };
      saveJsonDb(data);
    }
    return;
  }

  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  
  await db.execute(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
}

export async function verifyPassword(password, hash) {
  if (!hash) return false;
  return await bcrypt.compare(password, hash);
}

export async function updateUserSessions(userId) {
  const db = initDatabase();
  if (useJsonDb || !db) {
    const data = getJsonDb();
    const user = data.users.find(u => u.id === userId);
    if (user) {
      user.sessions_count = (user.sessions_count || 0) + 1;
      saveJsonDb(data);
    }
    return;
  }
  await db.execute('UPDATE users SET sessions_count = sessions_count + 1 WHERE id = ?', [userId]);
}

// Session management
export async function createSession(sessionData) {
  const db = initDatabase();
  const { user_id, role, difficulty, mode } = sessionData;
  
  if (useJsonDb || !db) {
    const data = getJsonDb();
    const newSession = {
      id: uuidv4(),
      user_id, role, difficulty, mode,
      status: 'active',
      questions_asked: 0,
      avg_score: 0,
      technical_score: 0,
      eq_score: 0,
      authenticity_score: 0,
      session_data: null,
      started_at: new Date().toISOString(),
      completed_at: null
    };
    data.sessions.push(newSession);
    saveJsonDb(data);
    return newSession.id;
  }
  
  const [result] = await db.execute(`
    INSERT INTO sessions (user_id, role, difficulty, mode)
    VALUES (?, ?, ?, ?)
  `, [user_id, role, difficulty, mode]);
  
  return result.insertId;
}

export async function updateSession(sessionId, updates) {
  const db = initDatabase();
  if (useJsonDb || !db) {
    const data = getJsonDb();
    const idx = data.sessions.findIndex(s => s.id === sessionId);
    if (idx !== -1) {
      data.sessions[idx] = { ...data.sessions[idx], ...updates };
      saveJsonDb(data);
    }
    return;
  }

  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  
  await db.execute(`UPDATE sessions SET ${fields} WHERE id = ?`, [...values, sessionId]);
}

export async function saveQuestion(questionData) {
  const db = initDatabase();
  const { session_id, question_text, user_response, technical_score, response_time, difficulty, topic, question_type } = questionData;
  
  if (useJsonDb || !db) {
    const data = getJsonDb();
    const newQuestion = {
      id: uuidv4(),
      session_id, question_text, user_response, technical_score, response_time, difficulty, topic, question_type,
      asked_at: new Date().toISOString()
    };
    data.questions.push(newQuestion);
    saveJsonDb(data);
    return;
  }
  
  await db.execute(`
    INSERT INTO session_questions (session_id, question_text, user_response, technical_score, response_time, difficulty, topic, question_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [session_id, question_text, user_response, technical_score, response_time, difficulty, topic, question_type]);
}

export async function saveBiometric(biometricData) {
  const db = initDatabase();
  const { session_id, stress_level, heart_rate, emotion, gaze_variance, voice_tremor } = biometricData;
  
  if (useJsonDb || !db) {
    const data = getJsonDb();
    const newBiometric = {
      id: uuidv4(),
      session_id, stress_level, heart_rate, emotion, gaze_variance, voice_tremor,
      recorded_at: new Date().toISOString()
    };
    data.biometrics.push(newBiometric);
    saveJsonDb(data);
    return;
  }

  await db.execute(`
    INSERT INTO biometrics (session_id, stress_level, heart_rate, emotion, gaze_variance, voice_tremor)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [session_id, stress_level, heart_rate, emotion, gaze_variance, voice_tremor]);
}

// Dashboard data
export async function getDashboardData(userId) {
  const db = initDatabase();
  
  if (useJsonDb || !db) {
    const data = getJsonDb();
    
    // Simple aggregations
    const userSessions = data.sessions.filter(s => s.user_id === userId && s.status === 'completed');
    const totalSessions = userSessions.length;
    
    const sumScore = userSessions.reduce((a, b) => a + (parseFloat(b.avg_score) || 0), 0);
    const sumTech = userSessions.reduce((a, b) => a + (parseFloat(b.technical_score) || 0), 0);
    const sumEq = userSessions.reduce((a, b) => a + (parseFloat(b.eq_score) || 0), 0);
    
    const averageScore = totalSessions ? sumScore / totalSessions : 0;
    const avgTechnical = totalSessions ? sumTech / totalSessions : 0;
    const avgEQ = totalSessions ? sumEq / totalSessions : 0;
    
    const lastSession = userSessions.length > 0 
      ? userSessions.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))[0].completed_at 
      : null;
      
    // Recent sessions
    const recentSessions = data.sessions
      .filter(s => s.user_id === userId)
      .sort((a, b) => new Date(b.started_at) - new Date(a.started_at))
      .slice(0, 10);
      
    // Topic performance
    // Join questions with sessions
    const userSessionIds = new Set(data.sessions.filter(s => s.user_id === userId).map(s => s.id));
    const userQuestions = data.questions.filter(q => userSessionIds.has(q.session_id));
    
    const topicMap = {};
    userQuestions.forEach(q => {
       if (!topicMap[q.topic]) topicMap[q.topic] = { count: 0, sumScore: 0 };
       topicMap[q.topic].count++;
       topicMap[q.topic].sumScore += (parseFloat(q.technical_score) || 0);
    });
    
    const topicPerformance = Object.keys(topicMap).map(topic => ({
      topic,
      question_count: topicMap[topic].count,
      avg_score: topicMap[topic].sumScore / topicMap[topic].count
    })).sort((a, b) => b.avg_score - a.avg_score);

    return {
      totalSessions,
      averageScore: averageScore.toFixed(2),
      avgTechnical: avgTechnical.toFixed(2),
      avgEQ: avgEQ.toFixed(2),
      lastSession,
      recentSessions,
      topicPerformance
    };
  }
  
  // Get user stats
  const [userStats] = await db.execute(`
    SELECT 
      COUNT(s.id) as total_sessions,
      AVG(s.avg_score) as average_score,
      AVG(s.technical_score) as avg_technical,
      AVG(s.eq_score) as avg_eq,
      MAX(s.completed_at) as last_session
    FROM sessions s 
    WHERE s.user_id = ? AND s.status = 'completed'
  `, [userId]);
  
  // Get recent sessions
  const [recentSessions] = await db.execute(`
    SELECT id, role, difficulty, avg_score, technical_score, started_at, completed_at
    FROM sessions 
    WHERE user_id = ? 
    ORDER BY started_at DESC 
    LIMIT 10
  `, [userId]);
  
  // Get topic performance
  const [topicStats] = await db.execute(`
    SELECT 
      sq.topic,
      COUNT(*) as question_count,
      AVG(sq.technical_score) as avg_score
    FROM session_questions sq
    JOIN sessions s ON sq.session_id = s.id
    WHERE s.user_id = ?
    GROUP BY sq.topic
    ORDER BY avg_score DESC
  `, [userId]);
  
  return {
    totalSessions: userStats[0].total_sessions || 0,
    averageScore: userStats[0].average_score || 0,
    avgTechnical: userStats[0].avg_technical || 0,
    avgEQ: userStats[0].avg_eq || 0,
    lastSession: userStats[0].last_session,
    recentSessions,
    topicPerformance: topicStats
  };
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}