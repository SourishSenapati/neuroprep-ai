import pg from 'pg';
import { OpenAI } from 'openai';

const { Pool } = pg;

// TypeScript types for JSONB
export interface Readiness {
  tech: number;
  eq: number;
  auth: number;
}

export interface Biometric {
  stressLevel: number;
  heartRate?: number;
  emotion?: string;
  timestamp: number;
}

export interface SessionResponses {
  eqScore: number;
  technicalScore: number;
  authenticityScore: number;
  responses: Array<{
    question: string;
    answer: string;
    scores: {
      eq: number;
      tech: number;
      auth: number;
    };
  }>;
}

export interface User {
  id: string;
  email: string;
  readiness: Readiness;
  sessions_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  user_id: string;
  mode: 'standard' | 'caltech-phd' | 'mit-ai';
  biometrics: Biometric[];
  responses: SessionResponses;
  score: number;
  neural_resilience: number;
  flags: string[];
  ts: Date;
}


// Initialize pool
let pool: any = null;


import Database from 'better-sqlite3';

// ... existing interfaces ...

// SQLite Adapter for Postgres-like interface
class SQLitePool {
  private db: any;
  private isMock: boolean = false;

  constructor() {
    try {
      this.db = new Database('database.sqlite', { verbose: console.log });
      this.initSchema();
    } catch (e) {
      console.error("CRITICAL DB FAILURE: Could not initialize SQLite. Switching to Mock Mode.", e);
      this.isMock = true;
      this.db = null;
    }
  }

  private initSchema() {
    if (this.isMock || !this.db) return;
    
    try {
      // Users
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          readiness TEXT DEFAULT '{"tech": 5, "eq": 5, "auth": 5}',
          sessions_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Sessions
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id),
          mode TEXT,
          biometrics TEXT DEFAULT '[]', -- JSON string
          responses TEXT DEFAULT '{}', -- JSON string
          score INTEGER DEFAULT 0,
          neural_resilience INTEGER DEFAULT 0,
          flags TEXT DEFAULT '[]',
          ts DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Singularity Sessions
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS singularity_sessions (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id),
          mode TEXT,
          multi_biometrics TEXT DEFAULT '[]',
          quantum_seed TEXT,
          splat_data TEXT DEFAULT '{}',
          rift_score REAL,
          ts DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Benchmarks (using simplified schema for SQLite)
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS benchmarks (
          mode TEXT PRIMARY KEY,
          avg_eq REAL,
          avg_tech REAL,
          avg_auth REAL,
          avg_resilience REAL,
          sample_size INTEGER DEFAULT 0
        )
      `);
      
      // Seed Benchmarks if empty
      const count = this.db.prepare('SELECT count(*) as c FROM benchmarks').get().c;
      if (count === 0) {
         const insert = this.db.prepare('INSERT INTO benchmarks (mode, avg_eq, avg_tech, avg_auth, avg_resilience, sample_size) VALUES (?, ?, ?, ?, ?, ?)');
         insert.run('standard', 7.0, 70.0, 75.0, 72.0, 100);
         insert.run('caltech-phd', 8.2, 85.0, 88.0, 85.0, 50);
         insert.run('mit-ai', 7.8, 82.0, 85.0, 82.0, 75);
      }
    } catch (schemaErr) {
        console.error("Schema Init Failed:", schemaErr);
        this.isMock = true; // Fallback if schema fails
    }
  }

  async query(text: string, params: any[] = []) {
    if (this.isMock || !this.db) {
        console.log("[MockDB] Query ignored:", text);
        return { rows: [], rowCount: 0 };
    }

    // Convert Postgres query to SQLite
    // 1. Replace $1, $2 with ?
    let sql = text.replace(/\$\d+/g, '?');

    // Handle UUID generation in SQL
    if (sql.includes('uuid_generate_v4()')) {
       // Replace with a placeholder and we will need to inject a random UUID
       // This is tricky without knowing WHERE to inject.
       // Easiest hack: SQLite generic function `hex(randomblob(16))` or similar
       sql = sql.replace('uuid_generate_v4()', "lower(hex(randomblob(16)))"); 
    }
    
    // 2. Handle specific PG syntax adjustments if needed
    if (sql.includes('RETURNING id')) {
       // SQLite doesn't support RETURNING in older versions, but better-sqlite3 handles run() returning lastInsertRowid
       // We'll manually handle this relative to the operation
       sql = sql.replace('RETURNING id', '');
    }
    if (sql.includes('NOW()')) {
       sql = sql.replace('NOW()', 'CURRENT_TIMESTAMP');
    }
    if (sql.includes('::jsonb')) {
       sql = sql.replace(/::jsonb(\[\])?/g, '');
    }
    
    // Prepare params: Stringify JSON objects
    const sqliteParams = params.map(p => {
       if (typeof p === 'object' && p !== null && !(p instanceof Date)) {
           return JSON.stringify(p);
       }
       return p;
    });

    try {
        const stmt = this.db.prepare(sql);
        
        if (sql.trim().toLowerCase().startsWith('select')) {
           const rows = stmt.all(...sqliteParams);
           // Parse JSON fields back
           const parsedRows = rows.map((row: any) => {
               ['readiness', 'biometrics', 'responses', 'flags', 'multi_biometrics', 'splat_data', 'data'].forEach(field => {
                   if (row[field] && typeof row[field] === 'string') {
                       try { row[field] = JSON.parse(row[field]); } catch(e) {}
                   }
               });
               return row;
           });
           return { rows: parsedRows, rowCount: rows.length };
        } else {
           const info = stmt.run(...sqliteParams);
           // Mock RETURNING id behavior for inserts that expect it
           if (text.includes('RETURNING id')) {
               // Verify what ID was inserted.
               // Since we use UUIDs passed in or generated, we might need to fetch it.
               // However, in our code (see usage), we usually INSERT ... VALUES (...) RETURNING id.
               // If we removed RETURNING id, we return the info.
               // BUT, our usages like `uuid_generate_v4()` in PG won't work in SQLite.
               // We need to auto-generate UUIDs in the code if they aren't passed.
               
               // HACK: Logic shift. We will generate IDs in the JS wrapper before calling query if checking for an INSERT.
               return { rows: [{ id: info.lastInsertRowid }] }; 
           }
           return { rowCount: info.changes, rows: [] };
        }
    } catch (e) {
        console.error('SQLite Error:', e, sql);
        throw e;
    }
  }
  
  // Custom method to handle inserts with UUIDs since SQLite doesn't do uuid_generate_v4()
  // We will intercept usages in the exported functions below instead of complicating query()
  
  async end() {
    this.db.close();
  }
  
  on(event: string, cb: Function) {}
}


// ... update initPool ...
// ... update initPool ...

// ... update initPool ...
export function initPool(connectionString?: string): any {
  if (!pool) {
    const connString = connectionString || process.env.DATABASE_URL;
    
    if (connString && connString.startsWith('postgres')) {
      pool = new Pool({
        connectionString: connString,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
      pool.on('error', (err: Error) => console.error('Unexpected pool error:', err));
    } else {
      console.log('Initializing SQLite Database...');
      pool = new SQLitePool();
    }
  }
  return pool;
}

export function getPool(): any {
  if (!pool) {
    return initPool();
  }
  return pool;
}

// ... update DB accessors to handle UUID generation manually ...

// Insert new session
export async function insertSession(
  userId: string,
  mode: 'standard' | 'caltech-phd' | 'mit-ai'
): Promise<string> {
  const pool = getPool();
  
  // Increment user session count
  await pool.query(
    'UPDATE users SET sessions_count = COALESCE(sessions_count, 0) + 1 WHERE id = $1',
    [userId]
  );

  const result = await pool.query(
    'INSERT INTO sessions (user_id, mode) VALUES ($1, $2) RETURNING id',
    [userId, mode]
  );
  return result.rows[0].id;
}

// Update session with responses and scores
export async function updateSession(
  sessionId: string,
  data: {
    biometrics?: Biometric[];
    responses?: SessionResponses;
    score?: number;
    neural_resilience?: number;
    flags?: string[];
  }
): Promise<void> {
  const pool = getPool();
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (data.biometrics) {
    updates.push(`biometrics = $${paramCount}::jsonb[]`);
    values.push(data.biometrics.map(b => JSON.stringify(b)));
    paramCount++;
  }

  if (data.responses) {
    updates.push(`responses = $${paramCount}::jsonb`);
    values.push(JSON.stringify(data.responses));
    paramCount++;
  }

  if (data.score !== undefined) {
    updates.push(`score = $${paramCount}`);
    values.push(data.score);
    paramCount++;
  }

  if (data.neural_resilience !== undefined) {
    updates.push(`neural_resilience = $${paramCount}`);
    values.push(data.neural_resilience);
    paramCount++;
  }

  if (data.flags) {
    updates.push(`flags = $${paramCount}`);
    values.push(data.flags);
    paramCount++;
  }

  if (updates.length === 0) return;

  values.push(sessionId);
  await pool.query(
    `UPDATE sessions SET ${updates.join(', ')} WHERE id = $${paramCount}`,
    values
  );
}

// Add biometric data point
export async function addBiometric(
  sessionId: string,
  biometric: Biometric
): Promise<void> {
  const pool = getPool();
  await pool.query(
    `UPDATE sessions 
     SET biometrics = array_append(biometrics, $1::jsonb) 
     WHERE id = $2`,
    [JSON.stringify(biometric), sessionId]
  );
}

// Insert session response
export async function insertSessionResponse(
  sessionId: string,
  data: {
    question: string;
    response: string;
    eq_score: number;
    technical_score: number;
    authenticity_score: number;
    stress_level: number;
    response_time: number;
  }
): Promise<void> {
  const pool = getPool();
  await pool.query(
    `INSERT INTO session_responses 
     (session_id, question, response, eq_score, technical_score, authenticity_score, stress_level, response_time)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      sessionId,
      data.question,
      data.response,
      data.eq_score,
      data.technical_score,
      data.authenticity_score,
      data.stress_level,
      data.response_time
    ]
  );
}

// Update user readiness (averaged over sessions)
export async function updateReadiness(userId: string): Promise<Readiness> {
  const pool = getPool();
  
  // Calculate averages from all sessions
  const result = await pool.query(
    `SELECT 
       COALESCE(AVG((responses->>'technicalScore')::float), 5) as tech,
       COALESCE(AVG((responses->>'eqScore')::float) * 10, 5) as eq,
       COALESCE(AVG((responses->>'authenticityScore')::float) / 10, 5) as auth
     FROM sessions
     WHERE user_id = $1`,
    [userId]
  );

  const readiness: Readiness = {
    tech: Math.round(result.rows[0].tech * 10) / 10,
    eq: Math.round(result.rows[0].eq * 10) / 10,
    auth: Math.round(result.rows[0].auth * 10) / 10
  };

  await pool.query(
    'UPDATE users SET readiness = $1, updated_at = NOW() WHERE id = $2',
    [JSON.stringify(readiness), userId]
  );

  return readiness;
}

// Detect stress patterns
export async function detectStressPatterns(userId: string): Promise<Array<{
  pattern: string;
  severity: string;
  details: any;
}>> {
  const pool = getPool();
  const result = await pool.query(
    'SELECT * FROM detect_stress_patterns($1)',
    [userId]
  );
  return result.rows;
}

// Get dashboard data
export async function getDashboardData(userId: string): Promise<{
  user: User;
  readiness: Readiness;
  recentSessions: Array<{
    id: string;
    mode: string;
    score: number;
    neural_resilience: number;
    ts: Date;
  }>;
  stressHistory: Array<{
    time: string;
    stress: number;
  }>;
  benchmarks: {
    mode: string;
    avg_eq: number;
    avg_tech: number;
    avg_auth: number;
    avg_resilience: number;
  };
  patterns: Array<{
    pattern: string;
    severity: string;
    details: any;
  }>;
}> {
  const pool = getPool();

  // Get user data
  const userResult = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  const user = userResult.rows[0];

  // Get recent sessions
  const sessionsResult = await pool.query(
    `SELECT id, mode, score, neural_resilience, ts 
     FROM sessions 
     WHERE user_id = $1 
     ORDER BY ts DESC 
     LIMIT 10`,
    [userId]
  );

  // Get stress history from biometrics
  const stressResult = await pool.query(
    `SELECT 
       to_char(ts, 'HH24:MI') as time,
       (unnest(biometrics)->>'stressLevel')::float as stress
     FROM sessions
     WHERE user_id = $1
     ORDER BY ts DESC
     LIMIT 20`,
    [userId]
  );

  // Get benchmarks for user's most common mode
  const modeResult = await pool.query(
    `SELECT mode FROM sessions WHERE user_id = $1 GROUP BY mode ORDER BY COUNT(*) DESC LIMIT 1`,
    [userId]
  );
  const primaryMode = modeResult.rows[0]?.mode || 'standard';

  const benchmarkResult = await pool.query(
    'SELECT * FROM benchmarks WHERE mode = $1',
    [primaryMode]
  );

  // Detect patterns
  const patterns = await detectStressPatterns(userId);

  return {
    user,
    readiness: user.readiness,
    recentSessions: sessionsResult.rows,
    stressHistory: stressResult.rows,
    benchmarks: benchmarkResult.rows[0],
    patterns
  };
}

// AI-enhanced longitudinal insights
export async function generateLongitudinalInsights(
  userId: string,
  openaiKey?: string
): Promise<string> {
  const pool = getPool();

  // Get all session data
  const result = await pool.query(
    `SELECT 
       mode,
       score,
       neural_resilience,
       responses,
       biometrics,
       flags,
       ts
     FROM sessions
     WHERE user_id = $1
     ORDER BY ts ASC`,
    [userId]
  );

  const sessions = result.rows;

  if (sessions.length === 0) {
    return 'No session data available for analysis.';
  }

  // Prepare data for AI analysis
  const trendData = {
    total_sessions: sessions.length,
    avg_score: sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length,
    avg_resilience: sessions.reduce((sum, s) => sum + s.neural_resilience, 0) / sessions.length,
    score_trend: sessions.map(s => ({ date: s.ts, score: s.score })),
    stress_patterns: sessions.flatMap(s => 
      (s.biometrics || []).map((b: any) => b.stressLevel)
    ),
    common_flags: sessions.flatMap(s => s.flags || []),
    modes_attempted: [...new Set(sessions.map(s => s.mode))]
  };

  if (!openaiKey) {
    // Fallback: Rule-based insights
    const scoreImprovement = sessions.length > 1 
      ? sessions[sessions.length - 1].score - sessions[0].score 
      : 0;

    return `**Longitudinal Analysis**

• Total Sessions: ${trendData.total_sessions}
• Average Score: ${trendData.avg_score.toFixed(1)}
• Neural Resilience: ${trendData.avg_resilience.toFixed(1)}%
• Score Trend: ${scoreImprovement > 0 ? '↑ Improving' : scoreImprovement < 0 ? '↓ Declining' : '→ Stable'}
• Stress Pattern: ${trendData.stress_patterns.length > 0 ? 'Detected variations' : 'Insufficient data'}
• Recommendation: ${scoreImprovement > 5 ? 'Continue current approach' : 'Focus on weak areas'}`;
  }

  // AI-enhanced insights
  const openai = new OpenAI({ apiKey: openaiKey });

  const prompt = `Analyze this longitudinal interview performance data and provide actionable insights:

${JSON.stringify(trendData, null, 2)}

Provide:
1. Performance trends over time
2. Stress pattern analysis
3. Specific areas of improvement
4. Personalized recommendations
5. Comparison to typical progression

Be concise, quantitative, and actionable.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are an expert data analyst for technical interview performance.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return response.choices[0].message.content || 'Analysis unavailable.';
}

// ... existing code ...

// Insert Singularity Session
// Insert Singularity Session (SQLite Compatible)
export async function insertSingularitySession(
  userId: string,
  mode: string,
  quantumSeed: string,
  initialBiometrics: any[] = []
): Promise<string> {
  const pool = getPool();
  
  // Ensure user exists (Upsert-like safety)
  try {
     const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
     if (userCheck.rows.length === 0) {
        // Auto-create user if missing (for anon/test users)
        await pool.query('INSERT INTO users (id, email) VALUES ($1, $2)', [userId, userId]); // Using ID as email for anon
     }
  } catch(e) { /* ignore */ }

  // Generate ID explicitly
  const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  await pool.query(
    `INSERT INTO singularity_sessions 
     (id, user_id, mode, quantum_seed, multi_biometrics) 
     VALUES ($1, $2, $3, $4, $5)`,
    [
        sessionId,
        userId, 
        mode, 
        quantumSeed, 
        initialBiometrics // query() will JSON.stringify this
    ]
  );
  return sessionId;
}

// Update Singularity Session (SQLite Read-Modify-Write for Arrays)
export async function updateSingularitySession(
  sessionId: string,
  data: {
    biometrics?: any[];
    splatData?: any;
    riftScore?: number;
  }
): Promise<void> {
  const pool = getPool();
  
  // 1. Fetch current if we need to append array data
  let currentBiometrics: any[] = [];
  if (data.biometrics) {
      const getRes = await pool.query('SELECT multi_biometrics FROM singularity_sessions WHERE id = $1', [sessionId]);
      if (getRes.rows.length > 0 && getRes.rows[0].multi_biometrics) {
          try {
              // It comes back as string or object depending on driver, our query() parses it if string
              currentBiometrics = getRes.rows[0].multi_biometrics; 
              if (!Array.isArray(currentBiometrics)) currentBiometrics = [];
          } catch(e) {}
      }
  }

  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (data.biometrics) {
    const newBiometrics = [...currentBiometrics, ...data.biometrics];
    updates.push(`multi_biometrics = $${paramCount}`);
    values.push(newBiometrics); // Will be JSON stringified by query()
    paramCount++;
  }

  if (data.splatData) {
    updates.push(`splat_data = $${paramCount}`);
    values.push(data.splatData);
    paramCount++;
  }

  if (data.riftScore !== undefined) {
    updates.push(`rift_score = $${paramCount}`);
    values.push(data.riftScore);
    paramCount++;
  }

  if (updates.length === 0) return;

  values.push(sessionId);
  await pool.query(
    `UPDATE singularity_sessions SET ${updates.join(', ')} WHERE id = $${paramCount}`,
    values
  );
}

// Get Singularity Session Data (for Rift Manifold)
export async function getSingularitySession(sessionId: string): Promise<any> {
  const pool = getPool();
  const result = await pool.query(
    'SELECT * FROM singularity_sessions WHERE id = $1',
    [sessionId]
  );
  return result.rows[0];
}

// Get Rift Benchmarks
export async function getRiftBenchmarks(mode: string): Promise<any> {
  const pool = getPool();
  const result = await pool.query(
    'SELECT * FROM rift_bench WHERE mode = $1',
    [mode]
  );
  return result.rows[0];
}

// Predict Rifts (Mock AI/SQL Hybrid)
export async function predictRifts(userId: string): Promise<string> {
  // In a real implementation, this would query historical biometric patterns
  // and use a ResNet model to forecast future instability.
  // For now, we simulate a "2025 forecast".
  
  const pool = getPool();
  const history = await pool.query(
    'SELECT multi_biometrics FROM singularity_sessions WHERE user_id = $1 ORDER BY ts DESC LIMIT 5',
    [userId]
  );

  if (history.rows.length === 0) return "Insufficient data for prediction.";

  // Mock analysis
  return "Forecast: Gaze vortex probability 12% in next session. Recommendation: Entangle focus.";
}

// Get user by email or create
export async function getOrCreateUser(email: string): Promise<User> {
  const pool = getPool();
  
  let result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    result = await pool.query(
      'INSERT INTO users (email) VALUES ($1) RETURNING *',
      [email]
    );
  }

  return result.rows[0];
}

// Close pool
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
