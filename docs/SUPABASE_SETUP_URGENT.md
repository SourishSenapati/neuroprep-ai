# ⚠️ URGENT ACTION REQUIRED



## User Must Add Supabase Credentials

Since `.env.local` is gitignored (for security), **you must manually create this file:**



### Step 1: Create File

**Location:** `d:\PROJECT\ai-interview\frontend\.env.local`



### Step 2: Add These Lines


```env
NEXT_PUBLIC_SUPABASE_URL=https://skfnofbcompycyxrvmeo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI

UzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrZm5vZmJjb21weWN5eHJ2bWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4ODkwODYsImV4cCI6MjA4MTQ2NTA4Nn0.EyWYDZqWWF2TWX7b0vDj7qA-Vg7luepNPwXkufRn_3I



# Optional - for full features
OPENAI_API_KEY=your_openai_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here

```text



### Step 3: Restart Dev Server


```powershell
cd frontend
npm run dev

```text



### Step 4: Create Supabase Tables

Go to your Supabase dashboard and run this SQL:


```sql
-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  difficulty INTEGER,
  score INTEGER,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (for location tracking)
CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY,
  name TEXT,
  city TEXT,
  country TEXT DEFAULT 'India',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_events_created ON analytics_events(created_at DESC);
CREATE INDEX idx_sessions_created ON user_sessions(created_at DESC);
CREATE INDEX idx_profiles_city ON user_profiles(city);

```text

---



## Then You'll Have

✅ Real multiplayer with Supabase Realtime
✅ Real analytics (not simulated)
✅ User activity tracking
✅ Location-based stats

---

**After adding credentials, redeploy to Vercel for full functionality!**
