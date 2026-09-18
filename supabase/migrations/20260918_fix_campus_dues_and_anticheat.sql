-- Migration: 20260918_fix_campus_dues_and_anticheat.sql
-- Friend 3: Database Architect, Campus ERP & Anti-Cheat (P3)
-- Task 3.1: Fix Campus Status Trigger & Isolate Finance Dues (Fix N1 & C3)
-- Task 3.2: Restore Complete Anti-Cheat Protection (Fix N4 & N5)

-- 1. Support service_role and administrative claims in campus_is_staff
CREATE OR REPLACE FUNCTION public.campus_is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    current_user = 'service_role'
    OR (auth.jwt() ->> 'role') = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
        AND u.role IN ('admin', 'superadmin', 'teacher', 'faculty')
    );
$$;
GRANT EXECUTE ON FUNCTION public.campus_is_staff() TO authenticated, service_role;

-- 2. Guard status on tables that actually have a status column
CREATE OR REPLACE FUNCTION public.check_student_campus_status_immutable()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.campus_is_staff() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.status := 'pending';
    END IF;
    IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
      RAISE EXCEPTION 'Students cannot alter status on campus records';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach only to status-bearing tables
DO $$
DECLARE
  t text;
  tables text[] := ARRAY['services_leaves', 'document_requests', 'admissions_applications', 'grievances_tickets', 'services_requests'];
BEGIN
  -- Explicitly drop the invalid trigger from finance_dues if it exists
  DROP TRIGGER IF EXISTS trg_guard_status_finance_dues ON public.finance_dues;

  FOREACH t IN ARRAY tables LOOP
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = t AND table_schema = 'public') THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_guard_status_%I ON public.%I', t, t);
      EXECUTE format('CREATE TRIGGER trg_guard_status_%I BEFORE INSERT OR UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.check_student_campus_status_immutable()', t, t);
    END IF;
  END LOOP;
END $$;

-- 3. Dedicated Finance Dues Guard: Protect term fees, waivers, fines, and installments
CREATE OR REPLACE FUNCTION public.check_finance_dues_immutable()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.campus_is_staff() THEN
    RAISE EXCEPTION 'Students cannot modify or delete finance dues records';
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_guard_finance_dues ON public.finance_dues;
CREATE TRIGGER trg_guard_finance_dues
  BEFORE UPDATE OR DELETE ON public.finance_dues
  FOR EACH ROW EXECUTE FUNCTION public.check_finance_dues_immutable();

-- 4. RLS: Students can SELECT own dues; DELETE and direct UPDATE are blocked
ALTER TABLE public.finance_dues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "campus_dues_own" ON public.finance_dues;
DROP POLICY IF EXISTS "campus_own_or_staff" ON public.finance_dues;
DROP POLICY IF EXISTS "campus_dues_select_own" ON public.finance_dues;
CREATE POLICY "campus_dues_select_own" ON public.finance_dues
  FOR SELECT USING (student_id = auth.uid()::text OR public.campus_is_staff());

DROP POLICY IF EXISTS "campus_dues_staff_all" ON public.finance_dues;
CREATE POLICY "campus_dues_staff_all" ON public.finance_dues
  FOR ALL USING (public.campus_is_staff()) WITH CHECK (public.campus_is_staff());

-- 5. Restore full column protection for anti-cheat
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() = old.id THEN
    -- Economy / Roles / Subscriptions
    IF new.role IS DISTINCT FROM old.role
       OR new.pins IS DISTINCT FROM old.pins
       OR coalesce(new.subscription_tier, 'free') IS DISTINCT FROM coalesce(old.subscription_tier, 'free')
       OR new.ats_score IS DISTINCT FROM old.ats_score
       OR new.trust_score IS DISTINCT FROM old.trust_score
       OR new.subscription_started_at IS DISTINCT FROM old.subscription_started_at
       OR new.subscription_expires_at IS DISTINCT FROM old.subscription_expires_at
       OR coalesce(new.subscription_status, 'none') IS DISTINCT FROM coalesce(old.subscription_status, 'none') THEN
      new.role := old.role;
      new.pins := old.pins;
      new.subscription_tier := old.subscription_tier;
      new.ats_score := old.ats_score;
      new.trust_score := old.trust_score;
      new.subscription_started_at := old.subscription_started_at;
      new.subscription_expires_at := old.subscription_expires_at;
      new.subscription_status := old.subscription_status;
    END IF;
    -- XP, Quests, Scores, Certifications, and Recruiter Ranking
    IF new.xp_total IS DISTINCT FROM old.xp_total
       OR new.xp_level IS DISTINCT FROM old.xp_level
       OR new.completed_quests IS DISTINCT FROM old.completed_quests
       OR new.java_test_passed IS DISTINCT FROM old.java_test_passed
       OR new.career_dna_score IS DISTINCT FROM old.career_dna_score
       OR new.career_readiness IS DISTINCT FROM old.career_readiness
       OR new.certifications IS DISTINCT FROM old.certifications
       OR new.recruiter_visibility IS DISTINCT FROM old.recruiter_visibility
       OR new.intelligence_score IS DISTINCT FROM old.intelligence_score
       OR new.communication_score IS DISTINCT FROM old.communication_score
       OR new.execution_score IS DISTINCT FROM old.execution_score
       OR new.leadership_score IS DISTINCT FROM old.leadership_score
       OR new.consistency_score IS DISTINCT FROM old.consistency_score
       OR new.adaptability_score IS DISTINCT FROM old.adaptability_score
       OR new.confidence_score IS DISTINCT FROM old.confidence_score
       OR new.innovation_score IS DISTINCT FROM old.innovation_score
       OR new.mission_streak IS DISTINCT FROM old.mission_streak
       OR new.missions_completed IS DISTINCT FROM old.missions_completed
       OR new.vault_count IS DISTINCT FROM old.vault_count
       OR new.interviews_done IS DISTINCT FROM old.interviews_done
       OR new.unlocked_items IS DISTINCT FROM old.unlocked_items
       OR new.badges IS DISTINCT FROM old.badges
       OR new.endorsed_skills IS DISTINCT FROM old.endorsed_skills
       OR new.recruiter_visible IS DISTINCT FROM old.recruiter_visible THEN
      new.xp_total := old.xp_total;
      new.xp_level := old.xp_level;
      new.completed_quests := old.completed_quests;
      new.java_test_passed := old.java_test_passed;
      new.career_dna_score := old.career_dna_score;
      new.career_readiness := old.career_readiness;
      new.certifications := old.certifications;
      new.recruiter_visibility := old.recruiter_visibility;
      new.intelligence_score := old.intelligence_score;
      new.communication_score := old.communication_score;
      new.execution_score := old.execution_score;
      new.leadership_score := old.leadership_score;
      new.consistency_score := old.consistency_score;
      new.adaptability_score := old.adaptability_score;
      new.confidence_score := old.confidence_score;
      new.innovation_score := old.innovation_score;
      new.mission_streak := old.mission_streak;
      new.missions_completed := old.missions_completed;
      new.vault_count := old.vault_count;
      new.interviews_done := old.interviews_done;
      new.unlocked_items := old.unlocked_items;
      new.badges := old.badges;
      new.endorsed_skills := old.endorsed_skills;
      new.recruiter_visible := old.recruiter_visible;
    END IF;
  END IF;
  RETURN new;
END;
$$;

-- 6. Lock down audit logs insert policy
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.audit_logs;
CREATE POLICY "Users can insert own audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND actor_id = auth.uid()
    AND (target_id IS NULL OR target_id = auth.uid()::text)
    AND admin_id IS NULL
  );
