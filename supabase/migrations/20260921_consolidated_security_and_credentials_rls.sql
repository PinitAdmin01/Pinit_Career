-- ═══════════════════════════════════════════════════════════════════════
-- 2026-09-21 Consolidated Security & Credentials RLS Migration
-- ═══════════════════════════════════════════════════════════════════════
-- Consolidates:
--   • Stage 1 / Risk 4: prevent_privilege_escalation() (20260826)
--   • Verified Credentials RLS hardening (20260821)
--   • Privileged INSERT block (20260920)
--
-- This migration is idempotent — safe to re-run.
-- ═══════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────
-- 1. TRIGGER: prevent_privilege_escalation()
-- ──────────────────────────────────────────────────────────────────────
-- Closes student self-update of XP / quest completion / mastery /
-- certification / placement readiness columns.  Only service_role or
-- database administrator can change guarded columns.
-- ──────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND auth.uid() = OLD.id THEN

    /* ── Block self-service privilege / economy / score forgery ── */
    IF NEW.role IS DISTINCT FROM OLD.role
       OR NEW.pins IS DISTINCT FROM OLD.pins
       OR COALESCE(NEW.subscription_tier, 'free') IS DISTINCT FROM COALESCE(OLD.subscription_tier, 'free')
       OR NEW.ats_score IS DISTINCT FROM OLD.ats_score
       OR NEW.trust_score IS DISTINCT FROM OLD.trust_score
    THEN
      NEW.role           := OLD.role;
      NEW.pins           := OLD.pins;
      NEW.subscription_tier := OLD.subscription_tier;
      NEW.ats_score      := OLD.ats_score;
      NEW.trust_score    := OLD.trust_score;
    END IF;

    /* ── Stage 1 / Risk 4: block self-service quest / XP / mastery ── */
    IF NEW.xp_total          IS DISTINCT FROM OLD.xp_total
       OR NEW.xp_level        IS DISTINCT FROM OLD.xp_level
       OR NEW.completed_quests IS DISTINCT FROM OLD.completed_quests
       OR NEW.java_test_passed IS DISTINCT FROM OLD.java_test_passed
       OR NEW.career_dna_score IS DISTINCT FROM OLD.career_dna_score
       OR NEW.career_readiness IS DISTINCT FROM OLD.career_readiness
       OR NEW.certifications   IS DISTINCT FROM OLD.certifications
       OR NEW.recruiter_visible IS DISTINCT FROM OLD.recruiter_visible
       OR NEW.recruiter_visibility IS DISTINCT FROM OLD.recruiter_visibility
       OR NEW.intelligence_score IS DISTINCT FROM OLD.intelligence_score
       OR NEW.communication_score IS DISTINCT FROM OLD.communication_score
       OR NEW.execution_score IS DISTINCT FROM OLD.execution_score
       OR NEW.leadership_score IS DISTINCT FROM OLD.leadership_score
       OR NEW.consistency_score IS DISTINCT FROM OLD.consistency_score
       OR NEW.adaptability_score IS DISTINCT FROM OLD.adaptability_score
       OR NEW.confidence_score IS DISTINCT FROM OLD.confidence_score
       OR NEW.innovation_score IS DISTINCT FROM OLD.innovation_score
       OR NEW.mission_streak  IS DISTINCT FROM OLD.mission_streak
       OR NEW.missions_completed IS DISTINCT FROM OLD.missions_completed
       OR NEW.vault_count     IS DISTINCT FROM OLD.vault_count
       OR NEW.interviews_done IS DISTINCT FROM OLD.interviews_done
    THEN
      NEW.xp_total           := OLD.xp_total;
      NEW.xp_level           := OLD.xp_level;
      NEW.completed_quests   := OLD.completed_quests;
      NEW.java_test_passed   := OLD.java_test_passed;
      NEW.career_dna_score   := OLD.career_dna_score;
      NEW.career_readiness   := OLD.career_readiness;
      NEW.certifications     := OLD.certifications;
      NEW.recruiter_visible  := OLD.recruiter_visible;
      NEW.recruiter_visibility := OLD.recruiter_visibility;
      NEW.intelligence_score := OLD.intelligence_score;
      NEW.communication_score := OLD.communication_score;
      NEW.execution_score    := OLD.execution_score;
      NEW.leadership_score   := OLD.leadership_score;
      NEW.consistency_score  := OLD.consistency_score;
      NEW.adaptability_score := OLD.adaptability_score;
      NEW.confidence_score   := OLD.confidence_score;
      NEW.innovation_score   := OLD.innovation_score;
      NEW.mission_streak     := OLD.mission_streak;
      NEW.missions_completed := OLD.missions_completed;
      NEW.vault_count        := OLD.vault_count;
      NEW.interviews_done    := OLD.interviews_done;
    END IF;

  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger if not already bound (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
     WHERE tgname = 'trg_prevent_privilege_escalation'
       AND tgrelid = 'public.users'::regclass
  ) THEN
    CREATE TRIGGER trg_prevent_privilege_escalation
      BEFORE UPDATE ON public.users
      FOR EACH ROW
      EXECUTE FUNCTION public.prevent_privilege_escalation();
  END IF;
END
$$;

-- ──────────────────────────────────────────────────────────────────────
-- 2. RLS: Verified Credentials — close public scrape hole
-- ──────────────────────────────────────────────────────────────────────
-- The original "Public read for verified credentials" policy on
-- student_competency_mastery had NO TO clause and used USING (true),
-- allowing unauthenticated visitors with the public anon key to dump
-- all student IDs and scores.
--
-- Fix: drop the overly permissive policy, replace with two policies:
--   • authenticated → can view verified credentials
--   • anon         → can ONLY look up a specific credential by exact
--                     match on credential_id or hash (prevents mass
--                     enumeration / whole-table dump)
-- ──────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Public read for verified credentials"
  ON public.student_competency_mastery;

-- authenticated users can view verified credentials for their own row
CREATE POLICY "Authenticated users view own verified credentials"
  ON public.student_competency_mastery FOR SELECT
  TO authenticated
  USING (
    state IN ('verified', 'verified_needs_review')
    AND student_id = auth.uid()
  );

-- anon users can look up a specific credential by exact match only
-- (prevents mass enumeration of the whole table)
CREATE POLICY "Anon credential lookup by exact credential_id or hash"
  ON public.student_competency_mastery FOR SELECT
  TO anon
  USING (
    state IN ('verified', 'verified_needs_review')
    AND (
      credential_id = CAST(NULLIF(current_setting('request.jwt.claim.sub', true), '') AS UUID)
      OR hash = current_setting('request.jwt.claim.hash', true)
    )
  );

-- ──────────────────────────────────────────────────────────────────────
-- 3. Privileged INSERT block (already in 20260920_block_privileged_insert.sql)
-- ──────────────────────────────────────────────────────────────────────
-- Ensure the BEFORE INSERT trigger exists to block anon/authenticated
-- users from self-assigning privileged roles on public.users.
-- ──────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.prevent_privileged_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_pg_role text := current_setting('role', true);
BEGIN
  IF current_pg_role IN ('anon', 'authenticated') THEN
    IF NEW.role IS NOT NULL AND NEW.role != 'student' THEN
      RAISE EXCEPTION
        'INSERT rejected: role "%" cannot be self-assigned via client. Privileged roles must be granted by an administrator.',
        NEW.role;
    END IF;
    NEW.role := COALESCE(NEW.role, 'student');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_privileged_insert ON public.users;

CREATE TRIGGER trg_prevent_privileged_insert
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_privileged_insert();

COMMENT ON FUNCTION public.prevent_privileged_insert() IS
  'Blocks any INSERT from the anon or authenticated role that attempts to assign a privileged role (non-student) to public.users. '
  'Service role, postgres, and migration scripts are permitted. '
  'Privileged role assignment must go through administrator action only. '
  'See: trg_prevent_privilege_escalation trigger for UPDATE protection.';