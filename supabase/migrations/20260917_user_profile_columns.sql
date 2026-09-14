-- Migration: Add endorsed_skills and completed_missions to users table
-- Sub-batch: N7 Profile Field Schema Alignment

ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS endorsed_skills text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS completed_missions text[] DEFAULT '{}';
