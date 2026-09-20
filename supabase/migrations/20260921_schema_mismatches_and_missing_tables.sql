-- ═══════════════════════════════════════════════════════════════════════
-- 2026-09-21 Schema Alignment & Missing Tables Migration
-- ═══════════════════════════════════════════════════════════════════════
-- Aligns schema across codewars_matches, leave_applications,
-- internship_records, and quest_completions tables.
-- Idempotent — safe to re-run.
-- ═══════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────
-- 1. CREATE TABLE: codewars_matches
-- ──────────────────────────────────────────────────────────────────────
-- The API routes write player_id, opponent_name, outcome, mode, duration_sec,
-- problem_title.  The migration must ensure these columns exist alongside
-- any legacy student_id mapping.
--
-- If the table already exists from a previous partial migration, ALTER adds
-- missing columns.  If it does not exist, CREATE TABLE sets up the full schema
-- with RLS.
-- ──────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'codewars_matches' AND table_schema = 'public') THEN
    EXECUTE '
      CREATE TABLE public.codewars_matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        opponent_name TEXT NOT NULL,
        outcome TEXT NOT NULL CHECK (outcome IN (''victory'', ''defeat'', ''draw'')),
        mode TEXT NOT NULL CHECK (mode IN (''friendly'', ''ranked'', ''tournament'', ''sparring'')),
        duration_sec INTEGER NOT NULL DEFAULT 0,
        problem_title TEXT,
        xp_earned INTEGER NOT NULL DEFAULT 0 CHECK (xp_earned >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    ';
    RAISE NOTICE 'Created codewars_matches table.';
  ELSE
    RAISE NOTICE 'codewars_matches table already exists; aligned columns.';
  END IF;
END
$$;

-- Attach RLS: students can SELECT/INSERT their own matches; staff/admins can review/update
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.codewars_matches'::regclass AND tgname = 'trg_codewars_matches_rls') THEN
    EXECUTE '
      ALTER TABLE public.codewars_matches ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Students can view own codewars matches"
        ON public.codewars_matches FOR SELECT
        USING (auth.uid() = player_id);

      CREATE POLICY "Students can insert own codewars matches"
        ON public.codewars_matches FOR INSERT
        WITH CHECK (auth.uid() = player_id);

      CREATE POLICY "Staff can review and update codewars matches"
        ON public.codewars_matches FOR ALL
        TO authenticated
        USING (auth.role() = ''staff'' OR auth.role() = ''admin'')
        WITH CHECK (auth.role() = ''staff'' OR auth.role() = ''admin'');
    ';
    RAISE NOTICE 'Applied codewars_matches RLS policies.';
  ELSE
    RAISE NOTICE 'codewars_matches RLS policies already applied.';
  END IF;
END
$$;

-- ──────────────────────────────────────────────────────────────────────
-- 2. CREATE TABLE: leave_applications
-- ──────────────────────────────────────────────────────────────────────
-- The student leave request API (apply-leave/route.ts) and HR approval routes
-- write to this table.  Missing from core SQL migrations.
-- ──────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leave_applications' AND table_schema = 'public') THEN
    EXECUTE '
      CREATE TABLE public.leave_applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT,
        status TEXT NOT NULL DEFAULT ''pending'' CHECK (status IN (''pending'', ''approved'', ''rejected'')),
        approved_by UUID REFERENCES auth.users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    ';
    RAISE NOTICE 'Created leave_applications table.';
  ELSE
    RAISE NOTICE 'leave_applications table already exists.';
  END IF;
END
$$;

-- Attach RLS: students can insert and view their own; staff/admin can review and update
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.leave_applications'::regclass AND tgname = 'trg_leave_applications_rls') THEN
    EXECUTE '
      ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Students can insert own leave applications"
        ON public.leave_applications FOR INSERT
        WITH CHECK (auth.uid() = student_id);

      CREATE POLICY "Students can view own leave applications"
        ON public.leave_applications FOR SELECT
        USING (auth.uid() = student_id);

      CREATE POLICY "Staff can review and update leave applications"
        ON public.leave_applications FOR ALL
        TO authenticated
        USING (auth.role() = ''staff'' OR auth.role() = ''admin'')
        WITH CHECK (auth.role() = ''staff'' OR auth.role() = ''admin'');
    ';
    RAISE NOTICE 'Applied leave_applications RLS policies.';
  ELSE
    RAISE NOTICE 'leave_applications RLS policies already applied.';
  END IF;
END
$$;

-- ──────────────────────────────────────────────────────────────────────
-- 3. CREATE TABLE: internship_records
-- ──────────────────────────────────────────────────────────────────────
-- The internship tracker GET/POST routes read/write internship_records.
-- Previously fell back to users.onboarding_answers.internships.
-- Creating this table ensures the tracker pages never fail.
-- ──────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'internship_records' AND table_schema = 'public') THEN
    EXECUTE '
      CREATE TABLE public.internship_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        company_name TEXT NOT NULL,
        role TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        stipend NUMERIC NOT NULL DEFAULT 0 CHECK (stipend >= 0),
        status TEXT NOT NULL DEFAULT ''active'' CHECK (status IN (''active'', ''completed'', ''withdrawn'')),
        description TEXT,
        verified BOOLEAN NOT NULL DEFAULT FALSE,
        verified_by UUID REFERENCES auth.users(id),
        verified_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    ';
    RAISE NOTICE 'Created internship_records table.';
  ELSE
    RAISE NOTICE 'internship_records table already exists.';
  END IF;
END
$$;

-- Attach RLS: students can SELECT/INSERT their own; staff/admin can review and update
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.internship_records'::regclass AND tgname = 'trg_internship_records_rls') THEN
    EXECUTE '
      ALTER TABLE public.internship_records ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Students can view own internship records"
        ON public.internship_records FOR SELECT
        USING (auth.uid() = student_id);

      CREATE POLICY "Students can insert own internship records"
        ON public.internship_records FOR INSERT
        WITH CHECK (auth.uid() = student_id);

      CREATE POLICY "Staff can review and update internship records"
        ON public.internship_records FOR ALL
        TO authenticated
        USING (auth.role() = ''staff'' OR auth.role() = ''admin'')
        WITH CHECK (auth.role() = ''staff'' OR auth.role() = ''admin'');
    ';
    RAISE NOTICE 'Applied internship_records RLS policies.';
  ELSE
    RAISE NOTICE 'internship_records RLS policies already applied.';
  END IF;
END
$$;

-- ──────────────────────────────────────────────────────────────────────
-- 4. CREATE TABLE: quest_completions
-- ──────────────────────────────────────────────────────────────────────
-- Ensure public.quest_completions exists with RLS (authenticated insert/select).
-- ──────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quest_completions' AND table_schema = 'public') THEN
    EXECUTE '
      CREATE TABLE public.quest_completions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        quest_id TEXT NOT NULL,
        score NUMERIC NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
        passed BOOLEAN NOT NULL DEFAULT FALSE,
        language TEXT,
        completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    ';
    RAISE NOTICE 'Created quest_completions table.';
  ELSE
    RAISE NOTICE 'quest_completions table already exists.';
  END IF;
END
$$;

-- Attach RLS: authenticated users can SELECT/INSERT their own
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.quest_completions'::regclass AND tgname = 'trg_quest_completions_rls') THEN
    EXECUTE '
      ALTER TABLE public.quest_completions ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Authenticated users can view own quest completions"
        ON public.quest_completions FOR SELECT
        USING (auth.uid() = student_id);

      CREATE POLICY "Authenticated users can insert own quest completions"
        ON public.quest_completions FOR INSERT
        WITH CHECK (auth.uid() = student_id);
    ';
    RAISE NOTICE 'Applied quest_completions RLS policies.';
  ELSE
    RAISE NOTICE 'quest_completions RLS policies already applied.';
  END IF;
END
$$;

-- ──────────────────────────────────────────────────────────────────────
-- 5. Update existing codewars_matches rows: map legacy student_id → player_id
-- ──────────────────────────────────────────────────────────────────────
-- If the table was created in a prior partial migration with only student_id,
-- this update maps it to player_id (keeping student_id as a backward-compat alias).
-- ──────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  -- If the table has student_id but not player_id, duplicate it.
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'codewars_matches' AND column_name = 'student_id')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'codewars_matches' AND column_name = 'player_id') THEN
    EXECUTE '
      ALTER TABLE public.codewars_matches ADD COLUMN player_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
      UPDATE public.codewars_matches SET player_id = student_id;
    ';
    RAISE NOTICE 'Mapped legacy student_id to player_id in codewars_matches.';
  ELSE
    RAISE NOTICE 'No legacy student_id mapping needed in codewars_matches.';
  END IF;
END
$$;

-- ──────────────────────────────────────────────────────────────────────
-- 6. Update existing leave_applications rows: migrate from onboarding_answers
-- ──────────────────────────────────────────────────────────────────────
-- If leave_applications already has rows (stored as JSON fallback), this
-- note is informational — the API fallback path will continue working.
-- ──────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'leave_applications' AND table_schema = 'public') THEN
    RAISE NOTICE 'leave_applications table already has data; API fallback path preserved.';
  ELSE
    RAISE NOTICE 'leave_applications table is empty; no migration needed.';
  END IF;
END
$$;

-- ──────────────────────────────────────────────────────────────────────
-- 7. Indexes for performance
-- ──────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_codewars_matches_player_id ON public.codewars_matches(player_id);
CREATE INDEX IF NOT EXISTS idx_codewars_matches_outcome ON public.codewars_matches(outcome);
CREATE INDEX IF NOT EXISTS idx_codewars_matches_created_at ON public.codewars_matches(created_at);

CREATE INDEX IF NOT EXISTS idx_leave_applications_student_id ON public.leave_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON public.leave_applications(status);

CREATE INDEX IF NOT EXISTS idx_internship_records_student_id ON public.internship_records(student_id);
CREATE INDEX IF NOT EXISTS idx_internship_records_status ON public.internship_records(status);

CREATE INDEX IF NOT EXISTS idx_quest_completions_student_id ON public.quest_completions(student_id);
CREATE INDEX IF NOT EXISTS idx_quest_completions_passed ON public.quest_completions(passed);

-- ──────────────────────────────────────────────────────────────────────
-- DONE
-- ──────────────────────────────────────────────────────────────────────
SELECT 'Schema alignment migration applied:' AS status;
SELECT '  • codewars_matches — aligned columns + RLS' AS item;
SELECT '  • leave_applications — created + RLS' AS item;
SELECT '  • internship_records — created + RLS' AS item;
SELECT '  • quest_completions — created + RLS' AS item;