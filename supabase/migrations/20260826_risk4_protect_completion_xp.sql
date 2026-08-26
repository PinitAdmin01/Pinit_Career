-- ─────────────────────────────────────────────────────────────────────────────
-- Stage 1, Risk 4 — protect quest completion / XP / mastery / placement columns
-- from client self-grant.
--
-- ROOT CAUSE (documented, verified empirically against the live project this
-- session — see the Stage 1/Risk 4 report for the exact reproduction):
--
--   supabase/schema.sql already defines a defense-in-depth trigger,
--   public.prevent_privilege_escalation(), attached to public.users, whose own
--   comment states its purpose plainly: "Block self-service privilege / economy
--   / score forgery". It reverts client-submitted changes to exactly 5 columns
--   if the caller is the row's own owner: role, pins, subscription_tier,
--   ats_score, trust_score.
--
--   Every OTHER column representing quest completion, XP, mastery evidence,
--   certifications, or placement readiness was left unprotected — an
--   inconsistency with the trigger's own stated intent, not a deliberate
--   design choice (there is no column anywhere in this schema that is
--   "student-editable XP" as a legitimate concept). Verified live: a freshly
--   self-signed-up (anon-key, public signup) account was able to set its own
--   xp_total to 999999999 and completed_quests to a quest ID that was never
--   submitted to, let alone passed by, any grader — via a single
--   `supabase.from('users').update(...)` call requiring nothing but the
--   PUBLIC anon key already shipped in the browser bundle. ats_score and
--   trust_score, in the same request, were correctly reverted by the existing
--   trigger — proving the trigger fires and works exactly as designed for the
--   5 columns it already covers, and that the gap is an omission, not a
--   dead/inactive mechanism.
--
-- FIX: extend the SAME already-deployed, already-proven mechanism (do not
-- introduce a second, parallel protection scheme) to also cover:
--   - xp_total, xp_level                              (XP)
--   - completed_quests                                (quest completion)
--   - java_test_passed                                (verified evidence)
--   - career_dna_score, career_readiness              (mastery / placement readiness)
--   - certifications                                  (certifications)
--   - recruiter_visible, recruiter_visibility          (placement readiness / visibility)
--   - intelligence_score, communication_score, execution_score,
--     leadership_score, consistency_score, adaptability_score,
--     confidence_score, innovation_score               (mastery — same category
--                                                        as the already-protected
--                                                        ats_score/trust_score;
--                                                        leaving these out while
--                                                        protecting those two was
--                                                        the same class of gap)
--   - mission_streak, missions_completed, vault_count, interviews_done
--                                                       (progression/evidence
--                                                        counters gamification
--                                                        and readiness scoring
--                                                        depend on)
--
-- DELIBERATELY NOT covered (left client-editable — legitimate self-service
-- profile/preference fields, per "preserve legitimate student progress
-- behavior"): display_name, username, target_role, career_goal,
-- selected_teacher_id, guidance_mentor_id, onboarding_step, onboarding_answers,
-- jd_missing_skills, weak_areas, skill_tags, structured_resume,
-- resume_generated, roadmap_generated, demo_tabs_unlocked,
-- force_show_career_builder, register_number, career_dna_archetype.
--
-- After this migration, the ONLY way to change a guarded column on a row a
-- user owns is via the SERVICE_ROLE key from a trusted server context (the
-- Stage 1 server-authoritative paths: supabase/functions/verify-quest and
-- src/app/api/code/run-java/route.ts), because the service role bypasses RLS
-- and this trigger's self-caller check (`auth.uid() = old.id`) — an admin/
-- service-role UPDATE is unaffected, exactly like the existing 5-column guard.
--
-- APPLY: supabase db push   (or apply via the Supabase SQL editor)
-- This migration has NOT been applied to the live project as part of this
-- change — see the Stage 1 report for why (no DB connection string or
-- SUPABASE_SERVICE_ROLE_KEY value is present in this environment's .env to
-- execute DDL from here). Applying it is a required manual step.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and auth.uid() = old.id then
    if new.role is distinct from old.role
       or new.pins is distinct from old.pins
       or coalesce(new.subscription_tier, 'free') is distinct from coalesce(old.subscription_tier, 'free')
       or new.ats_score is distinct from old.ats_score
       or new.trust_score is distinct from old.trust_score then
      -- Block self-service privilege / economy / score forgery (original 5 columns)
      new.role := old.role;
      new.pins := old.pins;
      new.subscription_tier := old.subscription_tier;
      new.ats_score := old.ats_score;
      new.trust_score := old.trust_score;
    end if;

    if new.xp_total is distinct from old.xp_total
       or new.xp_level is distinct from old.xp_level
       or new.completed_quests is distinct from old.completed_quests
       or new.java_test_passed is distinct from old.java_test_passed
       or new.career_dna_score is distinct from old.career_dna_score
       or new.career_readiness is distinct from old.career_readiness
       or new.certifications is distinct from old.certifications
       or new.recruiter_visible is distinct from old.recruiter_visible
       or new.recruiter_visibility is distinct from old.recruiter_visibility
       or new.intelligence_score is distinct from old.intelligence_score
       or new.communication_score is distinct from old.communication_score
       or new.execution_score is distinct from old.execution_score
       or new.leadership_score is distinct from old.leadership_score
       or new.consistency_score is distinct from old.consistency_score
       or new.adaptability_score is distinct from old.adaptability_score
       or new.confidence_score is distinct from old.confidence_score
       or new.innovation_score is distinct from old.innovation_score
       or new.mission_streak is distinct from old.mission_streak
       or new.missions_completed is distinct from old.missions_completed
       or new.vault_count is distinct from old.vault_count
       or new.interviews_done is distinct from old.interviews_done then
      -- STAGE 1 / RISK 4: block self-service quest completion / XP / mastery /
      -- certification / placement-readiness forgery. See migration header.
      new.xp_total := old.xp_total;
      new.xp_level := old.xp_level;
      new.completed_quests := old.completed_quests;
      new.java_test_passed := old.java_test_passed;
      new.career_dna_score := old.career_dna_score;
      new.career_readiness := old.career_readiness;
      new.certifications := old.certifications;
      new.recruiter_visible := old.recruiter_visible;
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
    end if;
  end if;
  return new;
end;
$$;

-- The existing trigger (trg_prevent_privilege_escalation, created in
-- schema.sql) already binds to this function by name and does not need to be
-- re-created — CREATE OR REPLACE FUNCTION swaps the body in place.
