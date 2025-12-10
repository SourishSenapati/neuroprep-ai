# NeuroPrep AI - Production Database Guide

## Supabase Setup

### 1. Create Supabase Project

1. Go to <https://supabase.com>
2. Create new project
3. Copy connection string from Settings → Database
4. Add to `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

### 2. Run Migrations

In Supabase SQL Editor, run:

```sql
-- Copy contents from backend/schema.sql or backend/migrations/001_initial_schema.sql
```

## Database Schema

### Tables

#### users

```sql
id UUID PRIMARY KEY
email TEXT UNIQUE NOT NULL
readiness JSONB -- {"tech": 8, "eq": 9, "auth": 7}
sessions_count INTEGER
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

**Indexes:**

- `idx_users_email` - Fast email lookup
- `idx_users_readiness` (GIN) - JSONB queries

#### sessions

```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
mode TEXT -- 'standard' | 'caltech-phd' | 'mit-ai'
biometrics JSONB[] -- Array of stress logs
responses JSONB -- Aggregated responses
score FLOAT
neural_resilience FLOAT
flags TEXT[]
ts TIMESTAMPTZ
```

**Indexes:**

- `idx_sessions_user_id` - User's sessions
- `idx_sessions_ts` - Time-based queries
- `idx_sessions_mode` - Filter by mode
- `idx_sessions_responses` (GIN) - JSONB queries
- `idx_sessions_biometrics` (GIN) - JSONB array queries

#### session_responses

```sql
id UUID PRIMARY KEY
session_id UUID REFERENCES sessions(id)
question TEXT
response TEXT
eq_score FLOAT
technical_score FLOAT
authenticity_score FLOAT
stress_level FLOAT
response_time INTEGER
timestamp TIMESTAMPTZ
```

**Indexes:**

- `idx_session_responses_session_id` - Session's responses
- `idx_session_responses_timestamp` - Time-based queries

#### benchmarks

```sql
id SERIAL PRIMARY KEY
mode TEXT UNIQUE
avg_eq FLOAT
avg_tech FLOAT
avg_auth FLOAT
avg_resilience FLOAT
sample_size INTEGER
updated_at TIMESTAMPTZ
```

**Default Data:**

- `standard`: avg_eq=7.0, avg_tech=70.0, avg_resilience=72.0
- `caltech-phd`: avg_eq=8.2, avg_tech=85.0, avg_resilience=85.0
- `mit-ai`: avg_eq=7.8, avg_tech=82.0, avg_resilience=82.0

## Database Functions

### update_user_readiness()

Auto-trigger that updates user readiness after session insert/update.

```sql
-- Calculates averages from all sessions
UPDATE users SET readiness = {
  tech: AVG(technicalScore),
  eq: AVG(eqScore) * 10,
  auth: AVG(authenticityScore) / 10
}
```

### detect_stress_patterns(user_id)

Analyzes stress patterns across sessions.

```sql
SELECT * FROM detect_stress_patterns('user-uuid');
-- Returns: pattern, severity, details
```

**Example Output:**

```json
{
  "pattern": "Anxiety spikes on tech questions",
  "severity": "high",
  "details": {
    "avg_stress": 8.5,
    "max_stress": 9.8,
    "affected_questions": 12
  }
}
```

## Node.js API (db.ts)

### Initialize Pool

```typescript
import * as db from './db';

const pool = db.initPool(process.env.DATABASE_URL);
```

### Insert Session

```typescript
const sessionId = await db.insertSession(userId, 'caltech-phd');
```

### Update Session

```typescript
await db.updateSession(sessionId, {
  responses: { eqScore: 7.5, technicalScore: 82, ... },
  score: 84,
  neural_resilience: 84,
  flags: ['ADAPTATION_NEEDED']
});
```

### Add Biometric

```typescript
await db.addBiometric(sessionId, {
  stressLevel: 6.5,
  heartRate: 85,
  emotion: 'tense',
  timestamp: Date.now()
});
```

### Insert Response

```typescript
await db.insertSessionResponse(sessionId, {
  question: 'How to scale neural nets?',
  response: 'Use gradient compression...',
  eq_score: 7.5,
  technical_score: 82,
  authenticity_score: 88,
  stress_level: 6.5,
  response_time: 120
});
```

### Update Readiness

```typescript
const readiness = await db.updateReadiness(userId);
// Returns: { tech: 8.2, eq: 7.8, auth: 8.5 }
```

### Detect Patterns

```typescript
const patterns = await db.detectStressPatterns(userId);
// Returns: [{ pattern, severity, details }, ...]
```

### Get Dashboard Data

```typescript
const data = await db.getDashboardData(userId);
// Returns: {
//   user: { id, email, readiness, ... },
//   recentSessions: [...],
//   stressHistory: [...],
//   benchmarks: { mode, avg_eq, ... },
//   patterns: [...]
// }
```

### AI-Enhanced Insights

```typescript
const insights = await db.generateLongitudinalInsights(userId, openaiKey);
// Returns: "**Longitudinal Analysis**\n• Performance improving 15%..."
```

## API Endpoints

### GET /api/dashboard/:userId

Returns complete dashboard data with charts.

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "readiness": { "tech": 8, "eq": 9, "auth": 7 },
    "sessions_count": 12
  },
  "recentSessions": [
    {
      "id": "uuid",
      "mode": "caltech-phd",
      "score": 84,
      "neural_resilience": 84,
      "ts": "2024-01-15T10:30:00Z"
    }
  ],
  "stressHistory": [
    { "time": "10:30", "stress": 6.5 },
    { "time": "10:33", "stress": 7.2 }
  ],
  "benchmarks": {
    "mode": "caltech-phd",
    "avg_eq": 8.2,
    "avg_tech": 85.0,
    "avg_resilience": 85.0
  },
  "patterns": [
    {
      "pattern": "Anxiety spikes on tech questions",
      "severity": "medium",
      "details": { "avg_stress": 7.5 }
    }
  ]
}
```

### POST /api/end-session

Stores session and generates insights.

**Request:**

```json
{
  "sessionId": "uuid",
  "userId": "uuid"
}
```

**Response:**

```json
{
  "sessionId": "uuid",
  "duration": 1800000,
  "questionsAnswered": 5,
  "scores": {
    "eqScore": 7.8,
    "technicalScore": 82,
    "authenticityScore": 88
  },
  "neuralResilience": 84,
  "insights": "**Your Neural Resilience: 84%...",
  "longitudinalInsights": "**Longitudinal Analysis**\n• Score improving 15%...",
  "flags": [],
  "readiness": "Strong"
}
```

## JSONB Queries

### Query Readiness

```sql
-- Users with tech score > 8
SELECT * FROM users WHERE (readiness->>'tech')::float > 8;

-- Users with low EQ
SELECT * FROM users WHERE (readiness->>'eq')::float < 5;
```

### Query Biometrics

```sql
-- Sessions with high stress
SELECT * FROM sessions 
WHERE EXISTS (
  SELECT 1 FROM unnest(biometrics) AS b
  WHERE (b->>'stressLevel')::float > 8
);

-- Average stress per session
SELECT 
  id,
  AVG((unnest(biometrics)->>'stressLevel')::float) as avg_stress
FROM sessions
GROUP BY id;
```

### Query Responses

```sql
-- Sessions with low authenticity
SELECT * FROM sessions
WHERE (responses->>'authenticityScore')::float < 70;

-- Technical performance trend
SELECT 
  user_id,
  AVG((responses->>'technicalScore')::float) as avg_tech
FROM sessions
GROUP BY user_id
ORDER BY avg_tech DESC;
```

## Performance Optimization

### Index Usage

```sql
-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Query Performance

```sql
-- Analyze query plan
EXPLAIN ANALYZE
SELECT * FROM sessions WHERE user_id = 'uuid';
```

### Vacuum

```sql
-- Reclaim space and update statistics
VACUUM ANALYZE sessions;
VACUUM ANALYZE users;
```

## Backup & Restore

### Backup

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
psql $DATABASE_URL < backup_20240115.sql
```

### Supabase Backups

- Automatic daily backups (Pro plan)
- Point-in-time recovery
- Manual backups via dashboard

## Security

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY user_isolation ON users
  FOR ALL
  USING (auth.uid() = id);

CREATE POLICY session_isolation ON sessions
  FOR ALL
  USING (user_id = auth.uid());
```

### API Security

- All queries use parameterized statements
- No SQL injection vulnerabilities
- Connection pooling with limits
- Timeout protection

## Monitoring

### Connection Pool

```typescript
pool.on('connect', () => {
  console.log('New client connected');
});

pool.on('error', (err) => {
  console.error('Pool error:', err);
});
```

### Query Logging

```typescript
// Log slow queries
pool.on('query', (query) => {
  const start = Date.now();
  query.on('end', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn('Slow query:', query.text, duration);
    }
  });
});
```

## Troubleshooting

### Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check pool status
SELECT * FROM pg_stat_activity WHERE datname = 'postgres';
```

### Performance Issues

```sql
-- Find slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Disk Space

```sql
-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::text)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;
```

---

**Production-ready database with AI-enhanced analytics!** 🚀
