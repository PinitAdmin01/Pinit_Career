-- Migration: Student Activity Schema Alignment, RLS Policies & Recruiter Visibility Guard Removal
-- Sub-batch: B2 Student Activity DB Integrity & B3 Recruiter Visibility Support

-- 1. Schema adjustments on public.audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  target_id text,
  meta jsonb DEFAULT '{}'::jsonb,
  timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs 
  ALTER COLUMN admin_id DROP NOT NULL;

ALTER TABLE public.audit_logs 
  ADD COLUMN IF NOT EXISTS actor_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT timezone('utc'::text, now());

-- Backfill created_at from timestamp if null
UPDATE public.audit_logs 
SET created_at = timestamp 
WHERE created_at IS NULL AND timestamp IS NOT NULL;

-- Backfill actor_id from admin_id if null
UPDATE public.audit_logs 
SET actor_id = admin_id 
WHERE actor_id IS NULL AND admin_id IS NOT NULL;

-- 2. Performance indexes on public.audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON public.audit_logs(target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- 3. Row Level Security policies on public.audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can view own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      actor_id = auth.uid()
      OR target_id = auth.uid()::text
    )
  );

-- NOTE: "Users can insert own audit logs" policy is defined (with strict admin_id IS NULL check)
-- in 20260918_fix_campus_dues_and_anticheat.sql which sorts before this file.
-- Do NOT redefine it here — that would overwrite the strict version with a weaker one
-- that allows actor_id IS NULL (forgeable) inserts.

-- NOTE: prevent_privilege_escalation() is defined in 20260918_fix_campus_dues_and_anticheat.sql
-- which sorts before this file. Do NOT redefine it here — that would overwrite the full
-- XP/quest/score/unlocked_items guards with an incomplete version.
