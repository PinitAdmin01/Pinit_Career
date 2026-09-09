-- Attention-span training: leaderboard scores and per-user analytics.
--
-- Why this table exists: src/app/attention-span/page.tsx calls
--   GET/POST /api/attention-span/leaderboard
--   GET/POST /api/attention-span/analytics
-- Neither had any handler in the client router, so both threw
-- "Unhandled API path" and the page silently swallowed the error. The route
-- files under src/app/api/attention-span/ do not execute under the current
-- static Firebase deploy, and in any case they kept state in a module-level
-- object that would be lost on every restart.
--
-- One row per student. daily_logs and monthly_summaries are keyed by date
-- string / month string, matching the shape the page already sends.

CREATE TABLE IF NOT EXISTS public.attention_span_progress (
    user_id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name       TEXT NOT NULL DEFAULT '',
    total_accuracy     NUMERIC NOT NULL DEFAULT 0 CHECK (total_accuracy >= 0),
    daily_logs         JSONB NOT NULL DEFAULT '{}'::jsonb,
    monthly_summaries  JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attention_span_total
    ON public.attention_span_progress (total_accuracy DESC);

ALTER TABLE public.attention_span_progress ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.attention_span_progress FROM anon;

-- A leaderboard is meant to be seen, so any signed-in user may read every row.
DROP POLICY IF EXISTS "Authenticated users can read the attention leaderboard"
    ON public.attention_span_progress;
CREATE POLICY "Authenticated users can read the attention leaderboard"
    ON public.attention_span_progress FOR SELECT TO authenticated
    USING (true);

-- Writes are restricted to the owner. This is the part that actually enforces
-- the rule: the browser is the application here, so a client-side check would
-- be advisory only and a student could otherwise post any score for anyone.
DROP POLICY IF EXISTS "Students can insert their own attention progress"
    ON public.attention_span_progress;
CREATE POLICY "Students can insert their own attention progress"
    ON public.attention_span_progress FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can update their own attention progress"
    ON public.attention_span_progress;
CREATE POLICY "Students can update their own attention progress"
    ON public.attention_span_progress FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
