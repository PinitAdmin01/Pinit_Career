-- supabase/migrations/20260908_undeclared_runtime_tables.sql
-- PinIT Career OS: Runtime Database Tables Used by Application Services & Routes

-- ── 1. student_gd_history (GD-07 History Storage) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.student_gd_history (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    history_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.student_gd_history ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.student_gd_history FROM anon;

DROP POLICY IF EXISTS "Users can view own student_gd_history" ON public.student_gd_history;
CREATE POLICY "Users can view own student_gd_history" ON public.student_gd_history
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own student_gd_history" ON public.student_gd_history;
CREATE POLICY "Users can manage own student_gd_history" ON public.student_gd_history
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ── 2. gd_sessions (Detailed Individual GD Session Store) ─────────────────────
CREATE TABLE IF NOT EXISTS public.gd_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL DEFAULT 'Group Discussion',
    objective TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'medium',
    domain TEXT DEFAULT 'general',
    score INTEGER DEFAULT 0,
    report JSONB DEFAULT '{}'::jsonb,
    transcript JSONB DEFAULT '[]'::jsonb,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gd_sessions_user ON public.gd_sessions(user_id, created_at DESC);

ALTER TABLE public.gd_sessions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.gd_sessions FROM anon;

DROP POLICY IF EXISTS "Users can view own gd_sessions" ON public.gd_sessions;
CREATE POLICY "Users can view own gd_sessions" ON public.gd_sessions
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own gd_sessions" ON public.gd_sessions;
CREATE POLICY "Users can manage own gd_sessions" ON public.gd_sessions
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ── 3. student_squads (PR-07 Hackathon Squad Sync) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.student_squads (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    squads_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.student_squads ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.student_squads FROM anon;

DROP POLICY IF EXISTS "Users can view own student_squads" ON public.student_squads;
CREATE POLICY "Users can view own student_squads" ON public.student_squads
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own student_squads" ON public.student_squads;
CREATE POLICY "Users can manage own student_squads" ON public.student_squads
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ── 4. exam_attempts (Institutional & Student Exam Records) ───────────────────
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    register_number TEXT,
    exam_schedule_id TEXT NOT NULL,
    score NUMERIC DEFAULT 0,
    passed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_student ON public.exam_attempts(student_id, exam_schedule_id);

ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.exam_attempts FROM anon;

DROP POLICY IF EXISTS "Students can view own exam attempts" ON public.exam_attempts;
CREATE POLICY "Students can view own exam attempts" ON public.exam_attempts
    FOR SELECT TO authenticated USING (student_id = auth.uid()::text OR register_number = auth.uid()::text);

DROP POLICY IF EXISTS "Students can insert own exam attempts" ON public.exam_attempts;
CREATE POLICY "Students can insert own exam attempts" ON public.exam_attempts
    FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid()::text);

-- ── 5. admin_audit_log (Admin Service Action Ledger) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_id TEXT,
    meta JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_timestamp ON public.admin_audit_log(timestamp DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.admin_audit_log FROM anon;

DROP POLICY IF EXISTS "Admins can view admin_audit_log" ON public.admin_audit_log;
CREATE POLICY "Admins can view admin_audit_log" ON public.admin_audit_log
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    );

DROP POLICY IF EXISTS "Admins can insert admin_audit_log" ON public.admin_audit_log;
CREATE POLICY "Admins can insert admin_audit_log" ON public.admin_audit_log
    FOR INSERT TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    );

-- ── 6. profiles (Admin Overview & Attention Leaderboard) ─────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    role TEXT DEFAULT 'student',
    ats_score INTEGER DEFAULT 0,
    trust_score INTEGER DEFAULT 40,
    pins INTEGER DEFAULT 100,
    attention_accuracy NUMERIC DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Strictly block anon key from reading or modifying profiles
REVOKE ALL ON public.profiles FROM anon;

-- 2. Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

-- 3. Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR ALL TO authenticated USING (auth.uid() = id);

-- 4. Staff and Admins can view all profiles
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
CREATE POLICY "Staff can view all profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    );

-- 5. Authenticated leaderboard read policy
DROP POLICY IF EXISTS "Authenticated leaderboard read" ON public.profiles;
CREATE POLICY "Authenticated leaderboard read" ON public.profiles
    FOR SELECT TO authenticated
    USING (true);

-- 6. Column-level privilege restriction:
-- Revoke all table-level SELECT from authenticated, grant ONLY non-sensitive leaderboard columns.
-- role, pins, ats_score, and trust_score are NOT readable by other users.
REVOKE SELECT ON public.profiles FROM authenticated, anon;
GRANT SELECT (id, display_name, attention_accuracy, games_played, created_at, updated_at) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- 7. Dedicated clean view for leaderboard consumption
CREATE OR REPLACE VIEW public.leaderboard_profiles AS
    SELECT id, display_name, attention_accuracy, games_played
    FROM public.profiles;

GRANT SELECT ON public.leaderboard_profiles TO authenticated;
REVOKE ALL ON public.leaderboard_profiles FROM anon;

-- Trigger to synchronize users table inserts/updates into profiles
CREATE OR REPLACE FUNCTION public.sync_user_to_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, role, ats_score, trust_score, pins, created_at)
    VALUES (NEW.id, NEW.display_name, NEW.role, NEW.ats_score, NEW.trust_score, NEW.pins, NEW.created_at)
    ON CONFLICT (id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        role = EXCLUDED.role,
        ats_score = EXCLUDED.ats_score,
        trust_score = EXCLUDED.trust_score,
        pins = EXCLUDED.pins,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_user_profile ON public.users;
CREATE TRIGGER trg_sync_user_profile
    AFTER INSERT OR UPDATE OF display_name, role, ats_score, trust_score, pins ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.sync_user_to_profile();

-- ── 7. chat_messages (Group Discussion Room Chat) ────────────────────────────
-- DESIGN DECISION (Explicit Architectural Constraint):
-- In PinIT Career OS, Group Discussion (GD) rooms are open practice arenas and cohort
-- lobbies (e.g. general, topic-based debates) where learners practice communication collaboratively.
-- All rooms are INTENTIONALLY PUBLIC to all authenticated students by design.
-- Private student-to-teacher or 1-on-1 messaging is handled exclusively by `direct_messages`
-- (which is strictly scoped to sender_id / recipient_id).
-- Anonymous / unauthenticated access to `chat_messages` is strictly REVOKED.
-- If private/isolated breakout rooms are introduced in Phase 4, a `room_memberships` table
-- will be added to enforce room-membership RLS.
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL DEFAULT 'student',
    content TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_time ON public.chat_messages(room_id, timestamp ASC);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.chat_messages FROM anon;
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;

DROP POLICY IF EXISTS "Public cohort GD rooms readable by authenticated students" ON public.chat_messages;
DROP POLICY IF EXISTS "Authenticated users can view room chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view room chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view own chat messages" ON public.chat_messages;
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR SELECT TO authenticated
    USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Staff can view all chat messages" ON public.chat_messages;
CREATE POLICY "Staff can view all chat messages" ON public.chat_messages
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    );

DROP POLICY IF EXISTS "Users can post room chat messages" ON public.chat_messages;
CREATE POLICY "Users can post room chat messages" ON public.chat_messages
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);

-- ── 8. direct_messages (Student-Teacher Direct Messaging) ────────────────────
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    content TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_participants ON public.direct_messages(sender_id, recipient_id, created_at ASC);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.direct_messages FROM anon;

DROP POLICY IF EXISTS "Users can view own direct messages" ON public.direct_messages;
CREATE POLICY "Users can view own direct messages" ON public.direct_messages
    FOR SELECT TO authenticated USING (sender_id = auth.uid()::text OR recipient_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can send direct messages" ON public.direct_messages;
CREATE POLICY "Users can send direct messages" ON public.direct_messages
    FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid()::text);

-- ── 9. resumes storage bucket (Vault Uploads) ─────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'storage') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('resumes', 'resumes', false)
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;
