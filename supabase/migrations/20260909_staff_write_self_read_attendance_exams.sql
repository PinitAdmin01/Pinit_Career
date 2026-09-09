-- ============================================================================
-- PINIT CAREER OS: MIGRATION 20260909 - ATTENDANCE & EXAM RLS HARDENING
-- ============================================================================
-- Fixes critical authorization bypass where campus_own_or_staff allowed students
-- to directly INSERT / UPDATE their own rows in campus_attendance, student_attendance,
-- and exam_results via browser supabase-js client.
--
-- Restructures RLS policies to enforce:
--   1. SELECT: Allowed for authenticated student (own row) OR staff/faculty (all rows)
--   2. INSERT / UPDATE / DELETE: Strictly restricted to staff/faculty (campus_is_staff())
-- ============================================================================

BEGIN;

-- Helper function: verify campus_is_staff function exists with schema isolation
CREATE OR REPLACE FUNCTION public.campus_is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id::text = auth.uid()::text
      AND u.role IN ('admin', 'superadmin', 'teacher', 'faculty')
  );
$$;

-- Helper function: verify campus_is_self
CREATE OR REPLACE FUNCTION public.campus_is_self(student_id text)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT
    student_id IS NOT NULL
    AND (
      student_id = auth.uid()::text
      OR lower(student_id) = lower(coalesce(auth.jwt()->>'email', ''))
    );
$$;

GRANT EXECUTE ON FUNCTION public.campus_is_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION public.campus_is_self(text) TO authenticated;

-- Hardened Tables Loop: campus_attendance, student_attendance, exam_results
DO $$
DECLARE
  t text;
  staff_write_self_read text[] := array['student_attendance', 'campus_attendance', 'exam_results'];
BEGIN
  FOREACH t IN ARRAY staff_write_self_read
  LOOP
    -- Ensure RLS is active
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    -- Remove old permissive/own_or_staff policies
    EXECUTE format('DROP POLICY IF EXISTS campus_auth_all ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS campus_own_or_staff ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS campus_read_own_or_staff ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS campus_write_staff_only ON public.%I', t);

    -- 1. READ: Student can read their own attendance/results; Staff can read all
    EXECUTE format(
      'CREATE POLICY campus_read_own_or_staff ON public.%I FOR SELECT TO authenticated USING (public.campus_is_staff() OR public.campus_is_self(student_id))',
      t
    );

    -- 2. WRITE (INSERT / UPDATE / DELETE): Only verified staff/teachers can write
    EXECUTE format(
      'CREATE POLICY campus_write_staff_only ON public.%I FOR ALL TO authenticated USING (public.campus_is_staff()) WITH CHECK (public.campus_is_staff())',
      t
    );
  END LOOP;
END $$;

COMMIT;
