-- ==============================================================================
-- PinIT Career OS Migration: Student Core Hubs, Mirror & Group Discussion
-- Filename: 20261102_student_mirror_and_gd_consolidation.sql
-- Description: Creates gd_sessions, student_gd_history, resumes, vault_items,
--              and student_attendance tables with RLS and performance indexes.
-- ==============================================================================

-- 1. Group Discussion Sessions Table
CREATE TABLE IF NOT EXISTS public.gd_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    participants_count INT DEFAULT 4,
    duration_seconds INT DEFAULT 0,
    status TEXT DEFAULT 'completed',
    transcript JSONB DEFAULT '[]'::jsonb,
    metrics JSONB DEFAULT '{}'::jsonb,
    overall_score NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Student GD History & Individual Evaluation Scores
CREATE TABLE IF NOT EXISTS public.student_gd_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.gd_sessions(id) ON DELETE SET NULL,
    topic TEXT NOT NULL,
    role TEXT DEFAULT 'Participant',
    score NUMERIC(5,2) DEFAULT 0,
    articulation_score NUMERIC(5,2) DEFAULT 0,
    leadership_score NUMERIC(5,2) DEFAULT 0,
    listening_score NUMERIC(5,2) DEFAULT 0,
    feedback JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resumes Table (Structured ATS Resume Studio in Mirror)
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Primary ATS Resume',
    target_role TEXT DEFAULT 'Full Stack Engineer',
    template TEXT DEFAULT 'modern_ats',
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    ats_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vault Items Table (Tamper-Proof Credential Hashes & Digital Assets)
CREATE TABLE IF NOT EXISTS public.vault_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL DEFAULT 'credential',
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    token_value INT DEFAULT 0,
    hash TEXT,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Student Attendance Table (Academic & Session Presence)
CREATE TABLE IF NOT EXISTS public.student_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'present',
    check_in_time TIMESTAMPTZ DEFAULT NOW(),
    check_out_time TIMESTAMPTZ,
    subject TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Performance Indexes ─────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_gd_sessions_user_created ON public.gd_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_gd_history_user ON public.student_gd_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_user ON public.resumes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_vault_items_user ON public.vault_items(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_student_attendance_user_date ON public.student_attendance(user_id, date DESC);

-- ── Row Level Security (RLS) ───────────────────────────────────────────────────
ALTER TABLE public.gd_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_gd_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_attendance ENABLE ROW LEVEL SECURITY;

-- Students manage their own rows; Service role has bypass access
DROP POLICY IF EXISTS "Students can manage own gd_sessions" ON public.gd_sessions;
CREATE POLICY "Students can manage own gd_sessions" ON public.gd_sessions
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can manage own gd_history" ON public.student_gd_history;
CREATE POLICY "Students can manage own gd_history" ON public.student_gd_history
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can manage own resumes" ON public.resumes;
CREATE POLICY "Students can manage own resumes" ON public.resumes
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can view and create vault items" ON public.vault_items;
CREATE POLICY "Students can view and create vault items" ON public.vault_items
    FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can view own attendance" ON public.student_attendance;
CREATE POLICY "Students can view own attendance" ON public.student_attendance
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role bypass for student tables" ON public.gd_sessions;
CREATE POLICY "Service role bypass for student tables" ON public.gd_sessions
    FOR ALL TO service_role USING (true) WITH CHECK (true);
