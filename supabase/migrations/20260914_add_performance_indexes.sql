-- supabase/migrations/20260914_add_performance_indexes.sql
-- Sub-Batch 3.7 / Task 3.2: Database Performance Indexes & Sequential Scan Elimination
-- Author: Friend 3 (Principal Database Architect & Backend Lead)
-- Purpose: Optimize queries for 10,000+ active students across user queries, vault documents, and competency ledgers.

-- 1. Performance Indexes on Canonical users Table
-- Eliminates sequential table scans during admin dashboard aggregations, role filtering, and user pagination.
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_role_created_at ON public.users(role, created_at DESC);
-- public.users has no last_sign_in_at column (only auth.users does), so an unguarded index
-- here made this whole file fail. Build it only if the column is ever added.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'last_sign_in_at') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_users_last_sign_in ON public.users(last_sign_in_at DESC) WHERE last_sign_in_at IS NOT NULL';
  END IF;
END;
$$;

-- 2. Performance Indexes on vault_items Table
-- Optimizes student portfolio, credential verification, and document management queries.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vault_items') THEN
    CREATE INDEX IF NOT EXISTS idx_vault_items_user_id ON public.vault_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_vault_items_user_created ON public.vault_items(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_vault_items_verified ON public.vault_items(user_id, verified);
  END IF;
END;
$$;

-- 3. Performance Indexes on Competency Mastery Tables
-- Accelerates transcript verification, leaderboard recalculations, and prerequisite validation.
DO $$
BEGIN
  -- Underlying relational table: student_competency_mastery
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'student_competency_mastery') THEN
    CREATE INDEX IF NOT EXISTS idx_scm_student_state ON public.student_competency_mastery(student_id, state);
    CREATE INDEX IF NOT EXISTS idx_scm_student_competency ON public.student_competency_mastery(student_id, competency_id);
  END IF;

  -- Canonical alias table / view: competency_mastery(user_id, status)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'competency_mastery') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'competency_mastery' AND column_name = 'user_id') THEN
      EXECUTE 'CREATE INDEX IF NOT EXISTS idx_competency_mastery_user_status ON public.competency_mastery(user_id, status);';
    END IF;
  END IF;
END;
$$;

-- 4. High-Scale Operational Telemetry Indexes
-- Speeds up recruiter applicant fetching (OOM elimination) and admin dashboard alert counts.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'applications') THEN
    CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
    CREATE INDEX IF NOT EXISTS idx_applications_opportunity_id ON public.applications(opportunity_id);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
    CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON public.notifications(user_id, created_at DESC);
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'grievances') THEN
    CREATE INDEX IF NOT EXISTS idx_grievances_status ON public.grievances(status);
  END IF;
END;
$$;
