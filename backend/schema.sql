-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    gaussian_hash TEXT,
    -- Crypto hash for bio-auth
    readiness JSONB DEFAULT '{"tech": 5, "eq": 5, "auth": 5, "gaze": 5, "prosody": 5, "multiModal": 5}',
    sessions_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Singularity Sessions Table
CREATE TABLE IF NOT EXISTS singularity_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    mode TEXT NOT NULL,
    -- 'standard', 'caltech-quantum', 'mit-phd-2025'
    multi_biometrics JSONB [],
    -- Array of logs: {gazeVariance, voiceTremor, timestamp}
    quantum_seed UUID,
    -- For Gaussian unpredictability
    splat_data JSONB,
    -- Stored Gaussian splat visualization data
    rift_score FLOAT,
    -- Final entanglement score
    ts TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Rift Benchmarks Table (Peer Fields)
CREATE TABLE IF NOT EXISTS rift_bench (
    mode TEXT PRIMARY KEY,
    avg_entangle FLOAT,
    avg_gaze_lock FLOAT,
    avg_resilience FLOAT,
    sample_size INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Initial Benchmarks Seed
INSERT INTO rift_bench (
        mode,
        avg_entangle,
        avg_gaze_lock,
        avg_resilience,
        sample_size
    )
VALUES ('mit-phd-2025', 96.5, 9.2, 9.5, 100),
    ('caltech-quantum', 94.8, 8.9, 9.3, 85),
    ('standard', 75.0, 6.5, 7.0, 500) ON CONFLICT (mode) DO NOTHING;