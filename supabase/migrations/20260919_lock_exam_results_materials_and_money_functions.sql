-- supabase/migrations/20260919_lock_exam_results_materials_and_money_functions.sql
-- Proven by tests/db/student-security.test.ts: before this file a student could change or delete
-- anyone's marks, delete course materials, and call XP/badge/AI-minute functions from the browser.
-- Safe to run more than once.

-- 1. Exam results: a student reads only their own; only staff (teacher, faculty, admin) write.
ALTER TABLE public.campus_exam_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can view their own exam results" ON public.campus_exam_results;
DROP POLICY IF EXISTS "Faculty can record exam results" ON public.campus_exam_results;
DROP POLICY IF EXISTS "exam_results_read_own_or_staff" ON public.campus_exam_results;
DROP POLICY IF EXISTS "exam_results_staff_write" ON public.campus_exam_results;

CREATE POLICY "exam_results_read_own_or_staff" ON public.campus_exam_results
  FOR SELECT TO authenticated
  USING (public.campus_is_self(student_id) OR public.campus_is_staff());

CREATE POLICY "exam_results_staff_write" ON public.campus_exam_results
  FOR ALL TO authenticated
  USING (public.campus_is_staff())
  WITH CHECK (public.campus_is_staff());

REVOKE ALL ON public.campus_exam_results FROM anon;

-- 2. Course materials: any logged-in user reads; only staff upload, edit or delete.
ALTER TABLE public.campus_course_materials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view course materials" ON public.campus_course_materials;
DROP POLICY IF EXISTS "Authenticated users can manage course materials" ON public.campus_course_materials;
DROP POLICY IF EXISTS "course_materials_read_logged_in" ON public.campus_course_materials;
DROP POLICY IF EXISTS "course_materials_staff_write" ON public.campus_course_materials;

CREATE POLICY "course_materials_read_logged_in" ON public.campus_course_materials
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "course_materials_staff_write" ON public.campus_course_materials
  FOR ALL TO authenticated
  USING (public.campus_is_staff())
  WITH CHECK (public.campus_is_staff());

REVOKE ALL ON public.campus_course_materials FROM anon;

-- 3. XP, badge, AI-minute and grace functions: only server routes (service_role) may call them.
--    Server callers: /api/xp/add (increment_xp), /api/user/award-badge (award_prestige_badge).
DO $$
DECLARE
  fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'public.increment_xp(uuid, integer, text)',
    'public.award_prestige_badge(uuid, text, text)',
    'public.purchase_ai_minutes(uuid, integer, integer)',
    'public.apply_feature_grace_extension(uuid, text, integer)'
  ] LOOP
    IF to_regprocedure(fn) IS NOT NULL THEN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn);
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn);
    END IF;
  END LOOP;
END $$;

-- 4. get_pin_balance: a student may read only their own balance; visitors cannot call it.
--    Browser caller: src/lib/hooks/usePinBalance.ts (always passes the logged-in user's id).
CREATE OR REPLACE FUNCTION public.get_pin_balance(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pins INTEGER;
BEGIN
  IF auth.uid() IS DISTINCT FROM p_user_id
     AND coalesce(auth.jwt() ->> 'role', '') <> 'service_role' THEN
    RAISE EXCEPTION 'Not allowed to read another user''s pin balance' USING ERRCODE = '42501';
  END IF;
  SELECT pins INTO v_pins FROM public.users WHERE id = p_user_id;
  RETURN COALESCE(v_pins, 0);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_pin_balance(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_pin_balance(uuid) TO authenticated, service_role;
