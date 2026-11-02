-- ==============================================================================
-- PinIT Career OS Migration: User Diagnostic Columns & Career Twin Baseline
-- Filename: 20261102_user_career_twin_columns_and_seed.sql
-- Description: Ensures the users table has all required competency, diagnostic,
--              and telemetry columns so the Digital Career Twin simulator in
--              Mirror operates without "needsOnboarding" lockouts.
-- ==============================================================================

-- 1. Ensure required columns exist on public.users
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS target_role TEXT DEFAULT 'Full Stack Engineer',
    ADD COLUMN IF NOT EXISTS onboarding_answers JSONB DEFAULT '{"role":"Full Stack Engineer","skills":"React, TypeScript, Node.js"}'::jsonb,
    ADD COLUMN IF NOT EXISTS ats_score INT DEFAULT 65,
    ADD COLUMN IF NOT EXISTS verified_skills_count INT DEFAULT 2,
    ADD COLUMN IF NOT EXISTS weak_areas TEXT[] DEFAULT ARRAY['System Architecture', 'Distributed Caching'],
    ADD COLUMN IF NOT EXISTS trust_score INT DEFAULT 75,
    ADD COLUMN IF NOT EXISTS execution_score INT DEFAULT 70,
    ADD COLUMN IF NOT EXISTS leadership_score INT DEFAULT 65,
    ADD COLUMN IF NOT EXISTS communication_score INT DEFAULT 72,
    ADD COLUMN IF NOT EXISTS innovation_score INT DEFAULT 68,
    ADD COLUMN IF NOT EXISTS skill_tags TEXT[] DEFAULT ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'];

-- 2. Backfill existing user accounts with NULL values
UPDATE public.users
SET 
    target_role = COALESCE(target_role, 'Full Stack Engineer'),
    onboarding_answers = COALESCE(onboarding_answers, '{"role":"Full Stack Engineer","skills":"React, TypeScript, Node.js"}'::jsonb),
    ats_score = COALESCE(ats_score, 65),
    verified_skills_count = COALESCE(verified_skills_count, 2),
    weak_areas = COALESCE(weak_areas, ARRAY['System Architecture', 'Distributed Caching']),
    trust_score = COALESCE(trust_score, 75),
    execution_score = COALESCE(execution_score, 70),
    leadership_score = COALESCE(leadership_score, 65),
    communication_score = COALESCE(communication_score, 72),
    innovation_score = COALESCE(innovation_score, 68),
    skill_tags = COALESCE(skill_tags, ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'])
WHERE target_role IS NULL OR onboarding_answers IS NULL;
