-- ============================================================================
-- Arena 1v1 PvP Battles & Custom Room Invite System Migration
-- Migration File: 20260922_arena_pvp_rooms.sql
-- ============================================================================

-- 1. Create arena_rooms table for 1v1 battles and custom rooms
CREATE TABLE IF NOT EXISTS public.arena_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code VARCHAR(16) UNIQUE NOT NULL,
  problem_id TEXT NOT NULL,
  difficulty VARCHAR(32) NOT NULL DEFAULT 'intermediate',
  time_limit_seconds INTEGER NOT NULL DEFAULT 600,
  status VARCHAR(32) NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'ready', 'in_progress', 'completed', 'cancelled')),
  host_id TEXT NOT NULL,
  host_name TEXT NOT NULL,
  host_avatar TEXT,
  host_ready BOOLEAN DEFAULT false,
  host_progress JSONB DEFAULT '{"testsPassed": 0, "totalTests": 0, "score": 0, "submitted": false, "code": ""}'::jsonb,
  guest_id TEXT,
  guest_name TEXT,
  guest_avatar TEXT,
  guest_ready BOOLEAN DEFAULT false,
  guest_progress JSONB DEFAULT '{"testsPassed": 0, "totalTests": 0, "score": 0, "submitted": false, "code": ""}'::jsonb,
  winner_id TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_arena_rooms_code ON public.arena_rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_arena_rooms_status ON public.arena_rooms(status);
CREATE INDEX IF NOT EXISTS idx_arena_rooms_host_guest ON public.arena_rooms(host_id, guest_id);

-- 2. Create arena_matchmaking_queue table for quick 1v1 pairing
CREATE TABLE IF NOT EXISTS public.arena_matchmaking_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT NOT NULL UNIQUE,
  student_name TEXT NOT NULL,
  student_avatar TEXT,
  difficulty VARCHAR(32) DEFAULT 'any',
  elo_rating INTEGER DEFAULT 1200,
  status VARCHAR(32) DEFAULT 'searching' CHECK (status IN ('searching', 'matched', 'cancelled')),
  matched_room_code VARCHAR(16),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_arena_queue_status_diff ON public.arena_matchmaking_queue(status, difficulty, created_at);

-- 3. Add arena_elo column to users table if not exists
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS arena_elo INTEGER DEFAULT 1200,
  ADD COLUMN IF NOT EXISTS arena_wins INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS arena_losses INTEGER DEFAULT 0;

-- 4. Enable RLS on arena_rooms
ALTER TABLE public.arena_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read arena rooms"
  ON public.arena_rooms
  FOR SELECT
  USING (true);

CREATE POLICY "Allow create arena rooms"
  ON public.arena_rooms
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update arena rooms"
  ON public.arena_rooms
  FOR UPDATE
  USING (true);

-- 5. Enable RLS on arena_matchmaking_queue
ALTER TABLE public.arena_matchmaking_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read arena queue"
  ON public.arena_matchmaking_queue
  FOR SELECT
  USING (true);

CREATE POLICY "Allow insert arena queue"
  ON public.arena_matchmaking_queue
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update arena queue"
  ON public.arena_matchmaking_queue
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete arena queue"
  ON public.arena_matchmaking_queue
  FOR DELETE
  USING (true);

-- 6. Add arena_rooms to Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'arena_rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_rooms;
  END IF;
END $$;
