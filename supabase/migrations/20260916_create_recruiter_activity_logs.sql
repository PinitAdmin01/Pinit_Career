-- Migration: 20260916_create_recruiter_activity_logs.sql
-- Create enterprise recruiter_activity_logs table replacing browser localStorage

CREATE TABLE IF NOT EXISTS public.recruiter_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID NOT NULL,
    action TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast query by recruiter and chronological ordering
CREATE INDEX IF NOT EXISTS idx_recruiter_activity_logs_recruiter_created 
    ON public.recruiter_activity_logs (recruiter_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.recruiter_activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own recruiter logs
CREATE POLICY "Recruiters can view their own activity logs"
    ON public.recruiter_activity_logs
    FOR SELECT
    TO authenticated
    USING (auth.uid() = recruiter_id);

-- Allow authenticated users to insert their own recruiter logs
CREATE POLICY "Recruiters can insert their own activity logs"
    ON public.recruiter_activity_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = recruiter_id);

-- Allow service role full access
CREATE POLICY "Service role has full access to recruiter_activity_logs"
    ON public.recruiter_activity_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
