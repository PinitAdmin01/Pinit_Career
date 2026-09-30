-- ============================================================================
-- MIGRATION: Internship Program Tables
-- Filename: 20261001_internship_program.sql
-- Description:
--   Creates all tables for the internship program (C10 of the SRS):
--     internship_enrollments, internship_tasks, internship_submissions,
--     internship_teams, internship_team_members, internship_sprints,
--     internship_pr_links, internship_standups, internship_opportunities,
--     internship_applications, internship_weekly_logs,
--     internship_supervisor_evaluations.
--   Each table uses CREATE TABLE IF NOT EXISTS for idempotent re-runs.
--   Row Level Security is enabled on every table (no student policies).
-- ============================================================================

-- 1. internship_enrollments
CREATE TABLE IF NOT EXISTS public.internship_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crash_enrollment_id UUID NOT NULL REFERENCES public.user_crash_enrollments(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('t1_job_sim', 't2_virtual_team', 't3_project', 't4_industry', 't5_fellowship')),
  track TEXT NOT NULL DEFAULT 'python_ai',
  status TEXT NOT NULL DEFAULT 'generating' CHECK (status IN ('generating', 'active', 'completed', 'expired', 'withdrawn', 'generation_failed')),
  started_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  extended BOOLEAN NOT NULL DEFAULT false,
  restarts INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  certificate_id TEXT,
  company_profile JSONB,
  final_report TEXT,
  final_report_check JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unique partial index: one active internship per student per crash enrollment
CREATE UNIQUE INDEX IF NOT EXISTS uq_internship_enrollments_active
  ON public.internship_enrollments (student_id, crash_enrollment_id)
  WHERE status IN ('generating', 'active');

CREATE INDEX IF NOT EXISTS idx_internship_enrollments_student_id
  ON public.internship_enrollments (student_id);

CREATE INDEX IF NOT EXISTS idx_internship_enrollments_crash_enrollment_id
  ON public.internship_enrollments (crash_enrollment_id);

ALTER TABLE public.internship_enrollments ENABLE ROW LEVEL SECURITY;

-- 2. internship_tasks
CREATE TABLE IF NOT EXISTS public.internship_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_enrollment_id UUID NOT NULL REFERENCES public.internship_enrollments(id) ON DELETE CASCADE,
  seq INT NOT NULL,
  week INT,
  kind TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('python', 'sql')),
  title TEXT NOT NULL,
  brief TEXT NOT NULL,
  starter_code TEXT NOT NULL DEFAULT '',
  visible_tests TEXT NOT NULL DEFAULT '',
  hidden_tests TEXT NOT NULL DEFAULT '',
  reference_solution TEXT NOT NULL DEFAULT '',
  sql_setup TEXT,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'open', 'passed')),
  attempts INT NOT NULL DEFAULT 0,
  passed_at TIMESTAMPTZ,
  model TEXT,
  generation_meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internship_tasks_enrollment_id
  ON public.internship_tasks (internship_enrollment_id);

ALTER TABLE public.internship_tasks ENABLE ROW LEVEL SECURITY;

-- 3. internship_submissions
CREATE TABLE IF NOT EXISTS public.internship_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.internship_tasks(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  output TEXT,
  ai_review JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internship_submissions_task_id
  ON public.internship_submissions (task_id);

CREATE INDEX IF NOT EXISTS idx_internship_submissions_student_id
  ON public.internship_submissions (student_id);

ALTER TABLE public.internship_submissions ENABLE ROW LEVEL SECURITY;

-- 4. internship_teams
CREATE TABLE IF NOT EXISTS public.internship_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier TEXT NOT NULL CHECK (tier IN ('t2_virtual_team', 't3_project', 't4_industry', 't5_fellowship')),
  status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'completed')),
  project_brief JSONB,
  repo_url TEXT,
  window_start DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.internship_teams ENABLE ROW LEVEL SECURITY;

-- 5. internship_team_members
CREATE TABLE IF NOT EXISTS public.internship_team_members (
  team_id UUID NOT NULL REFERENCES public.internship_teams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_enrollment_id UUID NOT NULL REFERENCES public.internship_enrollments(id) ON DELETE CASCADE,
  stories JSONB,
  PRIMARY KEY (team_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_internship_team_members_student_id
  ON public.internship_team_members (student_id);

CREATE INDEX IF NOT EXISTS idx_internship_team_members_team_id
  ON public.internship_team_members (team_id);

CREATE INDEX IF NOT EXISTS idx_internship_team_members_enrollment_id
  ON public.internship_team_members (internship_enrollment_id);

ALTER TABLE public.internship_team_members ENABLE ROW LEVEL SECURITY;

-- 6. internship_sprints
CREATE TABLE IF NOT EXISTS public.internship_sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.internship_teams(id) ON DELETE CASCADE,
  internship_enrollment_id UUID REFERENCES public.internship_enrollments(id) ON DELETE CASCADE,
  number INT NOT NULL,
  goal TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'submitted', 'approved', 'changes_requested')),
  review JSONB,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_sprint_owner CHECK (
    (team_id IS NOT NULL AND internship_enrollment_id IS NULL) OR
    (team_id IS NULL AND internship_enrollment_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_internship_sprints_team_id
  ON public.internship_sprints (team_id);

CREATE INDEX IF NOT EXISTS idx_internship_sprints_enrollment_id
  ON public.internship_sprints (internship_enrollment_id);

ALTER TABLE public.internship_sprints ENABLE ROW LEVEL SECURITY;

-- 7. internship_pr_links
CREATE TABLE IF NOT EXISTS public.internship_pr_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID NOT NULL REFERENCES public.internship_sprints(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internship_pr_links_sprint_id
  ON public.internship_pr_links (sprint_id);

CREATE INDEX IF NOT EXISTS idx_internship_pr_links_student_id
  ON public.internship_pr_links (student_id);

ALTER TABLE public.internship_pr_links ENABLE ROW LEVEL SECURITY;

-- 8. internship_standups
CREATE TABLE IF NOT EXISTS public.internship_standups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_enrollment_id UUID NOT NULL REFERENCES public.internship_enrollments(id) ON DELETE CASCADE,
  week INT NOT NULL,
  done TEXT NOT NULL,
  next TEXT NOT NULL,
  blockers TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internship_standups_enrollment_id
  ON public.internship_standups (internship_enrollment_id);

ALTER TABLE public.internship_standups ENABLE ROW LEVEL SECURITY;

-- 9. internship_opportunities
CREATE TABLE IF NOT EXISTS public.internship_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name TEXT NOT NULL,
  org_website TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('client_project', 'open_source', 'industry', 'fellowship')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  min_tier TEXT NOT NULL CHECK (min_tier IN ('t1_job_sim', 't2_virtual_team', 't3_project', 't4_industry', 't5_fellowship')),
  seats INT NOT NULL DEFAULT 1,
  paid BOOLEAN NOT NULL DEFAULT false,
  stipend NUMERIC,
  authenticity_tier TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.internship_opportunities ENABLE ROW LEVEL SECURITY;

-- 10. internship_applications
CREATE TABLE IF NOT EXISTS public.internship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.internship_opportunities(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_enrollment_id UUID NOT NULL REFERENCES public.internship_enrollments(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internship_applications_student_id
  ON public.internship_applications (student_id);

CREATE INDEX IF NOT EXISTS idx_internship_applications_opportunity_id
  ON public.internship_applications (opportunity_id);

CREATE INDEX IF NOT EXISTS idx_internship_applications_enrollment_id
  ON public.internship_applications (internship_enrollment_id);

ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

-- 11. internship_weekly_logs
CREATE TABLE IF NOT EXISTS public.internship_weekly_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_enrollment_id UUID NOT NULL REFERENCES public.internship_enrollments(id) ON DELETE CASCADE,
  week INT NOT NULL,
  hours NUMERIC NOT NULL DEFAULT 0,
  summary TEXT NOT NULL DEFAULT '',
  links JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internship_weekly_logs_enrollment_id
  ON public.internship_weekly_logs (internship_enrollment_id);

ALTER TABLE public.internship_weekly_logs ENABLE ROW LEVEL SECURITY;

-- 12. internship_supervisor_evaluations
CREATE TABLE IF NOT EXISTS public.internship_supervisor_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_enrollment_id UUID NOT NULL REFERENCES public.internship_enrollments(id) ON DELETE CASCADE,
  supervisor_name TEXT NOT NULL,
  supervisor_email TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  ratings JSONB,
  comments TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internship_supervisor_evals_enrollment_id
  ON public.internship_supervisor_evaluations (internship_enrollment_id);

ALTER TABLE public.internship_supervisor_evaluations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- DONE
-- ============================================================================
SELECT 'Internship program migration applied.' AS status;
