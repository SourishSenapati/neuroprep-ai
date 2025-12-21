-- ========================================
-- SUPABASE DATABASE SETUP
-- Run this in Supabase SQL Editor
-- ========================================
-- Create dojo_rooms table for multiplayer
CREATE TABLE IF NOT EXISTS dojo_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_code TEXT UNIQUE NOT NULL,
    host_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 hours'),
    participants JSONB DEFAULT '[]'::JSONB,
    room_state JSONB DEFAULT '{}'::JSONB
);
-- Enable Row Level Security (RLS)
ALTER TABLE dojo_rooms ENABLE ROW LEVEL SECURITY;
-- Create policy to allow all operations (for demo/hackathon)
-- WARNING: This is permissive - tighten for production
CREATE POLICY "Allow all operations on dojo_rooms" ON dojo_rooms FOR ALL USING (true) WITH CHECK (true);
-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dojo_rooms_code ON dojo_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_dojo_rooms_expiry ON dojo_rooms(expires_at);
CREATE INDEX IF NOT EXISTS idx_dojo_rooms_created ON dojo_rooms(created_at DESC);
-- Enable Realtime for the table
ALTER PUBLICATION supabase_realtime
ADD TABLE dojo_rooms;
-- Create function to cleanup expired rooms
CREATE OR REPLACE FUNCTION cleanup_expired_rooms() RETURNS void AS $$ BEGIN
DELETE FROM dojo_rooms
WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
-- Optional: Create a scheduled job to run cleanup
-- (Requires pg_cron extension - may not be available on free tier)
-- SELECT cron.schedule('cleanup-dojo-rooms', '0 * * * *', 'SELECT cleanup_expired_rooms()');
-- Verify setup
SELECT 'dojo_rooms table created' as status,
    COUNT(*) as room_count
FROM dojo_rooms;
-- Show realtime publication
SELECT *
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
    AND tablename = 'dojo_rooms';