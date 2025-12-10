-- Migration 001: Initial Schema
-- Run this in Supabase SQL Editor

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    readiness JSONB DEFAULT '{"tech": 5, "eq": 5, "auth": 5}'::jsonb,
    sessions_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL CHECK (mode IN ('standard', 'caltech-phd', 'mit-ai')),
    biometrics JSONB[] DEFAULT ARRAY[]::JSONB[],
    responses JSONB DEFAULT '{}'::jsonb,
    score FLOAT DEFAULT 0,
    neural_resilience FLOAT DEFAULT 0,
    flags TEXT[] DEFAULT ARRAY[]::TEXT[],
    ts TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    eq_score FLOAT,
    technical_score FLOAT,
    authenticity_score FLOAT,
    stress_level FLOAT,
    response_time INTEGER,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS benchmarks (
    id SERIAL PRIMARY KEY,
    mode TEXT NOT NULL UNIQUE,
    avg_eq FLOAT DEFAULT 7.5,
    avg_tech FLOAT DEFAULT 75.0,
    avg_auth FLOAT DEFAULT 80.0,
    avg_resilience FLOAT DEFAULT 78.0,
    sample_size INTEGER DEFAULT 1000,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_ts ON sessions(ts DESC);
CREATE INDEX idx_sessions_mode ON sessions(mode);
CREATE INDEX idx_session_responses_session_id ON session_responses(session_id);
CREATE INDEX idx_session_responses_timestamp ON session_responses(timestamp DESC);
CREATE INDEX idx_users_readiness ON users USING GIN (readiness);
CREATE INDEX idx_sessions_responses ON sessions USING GIN (responses);
CREATE INDEX idx_sessions_biometrics ON sessions USING GIN (biometrics);

INSERT INTO benchmarks (mode, avg_eq, avg_tech, avg_auth, avg_resilience, sample_size)
VALUES 
    ('standard', 7.0, 70.0, 75.0, 72.0, 5000),
    ('caltech-phd', 8.2, 85.0, 88.0, 85.0, 1200),
    ('mit-ai', 7.8, 82.0, 85.0, 82.0, 1500)
ON CONFLICT (mode) DO NOTHING;

COMMIT;
