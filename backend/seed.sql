-- 2025 Zenith Seed Data
-- Clear existing for fresh seed
TRUNCATE users,
singularity_sessions,
rift_bench RESTART IDENTITY CASCADE;
-- Insert Pro User (MIT Candidate)
INSERT INTO users (
    id,
    email,
    gaussian_hash,
    readiness,
    sessions_count
  )
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'candidate@mit.edu',
    'hash_quantum_entangled_2025',
    '{"tech": 9.2, "eq": 8.5, "auth": 9.0, "gaze": 9.5, "prosody": 8.8, "multiModal": 9.1}',
    12
  );
-- Insert Rift Benchmarks (2025 Peer Fields)
INSERT INTO rift_bench (
    mode,
    avg_entangle,
    avg_gaze_lock,
    avg_resilience,
    sample_size
  )
VALUES ('mit-phd-2025', 98.2, 9.4, 9.6, 150),
  ('caltech-quantum', 95.5, 8.8, 9.2, 120),
  ('stanford-nlp', 94.0, 9.0, 9.1, 200),
  ('standard', 72.0, 6.0, 6.5, 1000) ON CONFLICT (mode) DO
UPDATE
SET avg_entangle = EXCLUDED.avg_entangle;
-- Insert Sample Singularity Session (Splat-Q)
INSERT INTO singularity_sessions (
    user_id,
    mode,
    multi_biometrics,
    quantum_seed,
    splat_data,
    rift_score
  )
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'mit-phd-2025',
    ARRAY [
    '{"gazeVariance": 0.05, "voiceTremor": 0.02, "timestamp": 1732960000000}'::jsonb,
    '{"gazeVariance": 0.12, "voiceTremor": 0.04, "timestamp": 1732960005000}'::jsonb,
    '{"gazeVariance": 0.08, "voiceTremor": 0.01, "timestamp": 1732960010000}'::jsonb
  ],
    'b2f4c888-8d1a-4ef8-bb6d-6bb9bd380b22',
    '{"density": 0.95, "color_shift": "blue-hypergiant", "vortices": 0, "description": "Splat-Q: Multi-modal black hole entangle"}'::jsonb,
    98.5
  );