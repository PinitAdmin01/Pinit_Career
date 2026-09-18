-- Migration: Add endorsed_skills and completed_missions to users table
-- Sub-batch: N7 Profile Field Schema Alignment & N3 Onboarding Step Backfill

ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS endorsed_skills text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS completed_missions text[] DEFAULT '{}';

-- Backfill onboarding_step = 3 for existing students who already generated a roadmap or completed onboarding
UPDATE public.users 
SET onboarding_step = 3 
WHERE (roadmap_generated = true OR onboarding_answers->>'hasCompleted' = 'true') 
  AND (onboarding_step IS NULL OR onboarding_step < 3);
