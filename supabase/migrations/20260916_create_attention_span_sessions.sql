-- Migration: 20260916_create_attention_span_sessions.sql
-- Creates attention_span_sessions table to persist student game sessions to Supabase instead of browser localStorage.

CREATE TABLE IF NOT EXISTS public.attention_span_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL,
    game_name TEXT NOT NULL,
    game_icon TEXT NOT NULL,
    score_display TEXT NOT NULL,
    accuracy_earned NUMERIC NOT NULL DEFAULT 0,
    difficulty TEXT NOT NULL DEFAULT 'easy',
    xp_earned INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attention_span_sessions_user_created 
    ON public.attention_span_sessions (user_id, created_at DESC);

ALTER TABLE public.attention_span_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.attention_span_sessions FROM anon;

DROP POLICY IF EXISTS "Students can view their own attention span sessions"
    ON public.attention_span_sessions;
CREATE POLICY "Students can view their own attention span sessions"
    ON public.attention_span_sessions FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can insert their own attention span sessions"
    ON public.attention_span_sessions;
CREATE POLICY "Students can insert their own attention span sessions"
    ON public.attention_span_sessions FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can delete their own attention span sessions"
    ON public.attention_span_sessions;
CREATE POLICY "Students can delete their own attention span sessions"
    ON public.attention_span_sessions FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role has full access to attention_span_sessions"
    ON public.attention_span_sessions;
CREATE POLICY "Service role has full access to attention_span_sessions"
    ON public.attention_span_sessions FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);
