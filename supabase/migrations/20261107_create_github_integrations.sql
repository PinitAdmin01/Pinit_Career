-- Migration: 20261107_create_github_integrations.sql
-- Description: Schema for student GitHub repository verification, claim tracking, and commit webhook telemetry

CREATE TABLE IF NOT EXISTS public.github_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    github_username TEXT NOT NULL,
    github_id BIGINT NOT NULL,
    claimed_repos TEXT[] DEFAULT ARRAY[]::text[],
    access_token TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_github_integrations_student 
    ON public.github_integrations(student_id);

CREATE INDEX IF NOT EXISTS idx_github_integrations_user_id 
    ON public.github_integrations(github_username, github_id);

ALTER TABLE public.github_integrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own their GitHub integrations" ON public.github_integrations;
CREATE POLICY "Users own their GitHub integrations"
    ON public.github_integrations FOR ALL
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Staff can review GitHub integrations" ON public.github_integrations;
CREATE POLICY "Staff can review GitHub integrations"
    ON public.github_integrations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('admin', 'teacher', 'recruiter')
        )
    );
