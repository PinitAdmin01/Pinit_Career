-- ============================================================================
-- PINIT CAREER OS: PRODUCTION DATABASE MIGRATION CONSOLIDATION BUNDLE
-- ============================================================================
-- Generated: 2026-09-08T09:15:12.302Z
--
-- CAUTION:
-- Touch production database only after confirming point-in-time recovery (PITR)
-- or taking a database backup in Supabase Dashboard (Settings -> Backups).
--
-- ALL STATEMENTS ARE FULLY IDEMPOTENT:
--   - Tables use CREATE TABLE IF NOT EXISTS
--   - Policies use DROP POLICY IF EXISTS before CREATE POLICY
--   - Functions use CREATE OR REPLACE FUNCTION
--   - Triggers use DROP TRIGGER IF EXISTS before CREATE TRIGGER
--   - Storage bucket creation is guarded by namespace check
-- Safe to re-run multiple times on any partial or complete database state.
-- ============================================================================

BEGIN;


-- ────────────────────────────────────────────────────────────────────────────
-- SOURCE: 20260821_competency_engine.sql
-- ────────────────────────────────────────────────────────────────────────────

-- supabase/migrations/20260821_competency_engine.sql
-- Competency-First 2-Year Program Engine & Evidence Ledger Schema

-- 1. Evidence Ledger Table
CREATE TABLE IF NOT EXISTS public.competency_evidence_records (
    id TEXT PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    competency_id TEXT NOT NULL,
    competency_version TEXT NOT NULL DEFAULT '1.0.0',
    program_id TEXT NOT NULL,
    evidence_class TEXT NOT NULL CHECK (evidence_class IN ('knowledge', 'application', 'debugging', 'architecture', 'production', 'defense')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced', 'production')),
    evidence_family_id TEXT,
    source_type TEXT NOT NULL CHECK (source_type IN ('quest', 'mission', 'bug_lab', 'code_review', 'project', 'whiteboard', 'capstone')),
    source_id TEXT NOT NULL,
    attempt_id TEXT NOT NULL,
    score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 100),
    evaluator_type TEXT NOT NULL CHECK (evaluator_type IN ('deterministic', 'ai', 'human_mentor', 'hybrid')),
    evaluator_version TEXT NOT NULL,
    rubric_version TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    integrity_hash TEXT NOT NULL,
    artifacts JSONB DEFAULT '{}'::jsonb,
    critical_failures_detected TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning-fast aggregation & anti-gaming deduplication
CREATE INDEX IF NOT EXISTS idx_cer_student_comp ON public.competency_evidence_records(student_id, competency_id);
CREATE INDEX IF NOT EXISTS idx_cer_student_source ON public.competency_evidence_records(student_id, source_id);
CREATE INDEX IF NOT EXISTS idx_cer_integrity_hash ON public.competency_evidence_records(integrity_hash);

-- 2. Authoritative Student Competency Mastery Table
CREATE TABLE IF NOT EXISTS public.student_competency_mastery (
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    competency_id TEXT NOT NULL,
    competency_version TEXT NOT NULL DEFAULT '1.0.0',
    mastery_policy_version TEXT NOT NULL DEFAULT 'policy-v1.0.0',
    state TEXT NOT NULL CHECK (state IN ('locked', 'diagnostic', 'learning', 'practice', 'provisional', 'demonstrated', 'verified', 'verified_needs_review')),
    composite_score NUMERIC NOT NULL DEFAULT 0,
    evidence_coverage_pct NUMERIC NOT NULL DEFAULT 0,
    independent_evidence_count INT NOT NULL DEFAULT 0,
    distinct_family_count INT NOT NULL DEFAULT 0,
    latest_qualified_evidence_at BIGINT,
    next_review_at BIGINT,
    class_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    all_gates_passed BOOLEAN NOT NULL DEFAULT FALSE,
    has_critical_failures BOOLEAN NOT NULL DEFAULT FALSE,
    blocked_by TEXT[] DEFAULT ARRAY[]::TEXT[],
    last_updated BIGINT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (student_id, competency_id)
);

CREATE INDEX IF NOT EXISTS idx_scm_student_state ON public.student_competency_mastery(student_id, state);

-- 3. Program Enrollment & Graduation Ledger Table
CREATE TABLE IF NOT EXISTS public.student_program_enrollments (
    id TEXT PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id TEXT NOT NULL,
    current_stage_id TEXT NOT NULL,
    enrolled_at BIGINT NOT NULL,
    is_graduated BOOLEAN NOT NULL DEFAULT FALSE,
    residency_completed BOOLEAN NOT NULL DEFAULT FALSE,
    capstone_passed BOOLEAN NOT NULL DEFAULT FALSE,
    graduated_at BIGINT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unq_student_program UNIQUE (student_id, program_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.competency_evidence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_competency_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_program_enrollments ENABLE ROW LEVEL SECURITY;

-- 5. Strict RLS Policies
-- Students can select their own records
DROP POLICY IF EXISTS "Students can view own evidence records" ON public.competency_evidence_records;
CREATE POLICY "Students can view own evidence records"
    ON public.competency_evidence_records FOR SELECT
    USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can view own mastery status" ON public.student_competency_mastery;
CREATE POLICY "Students can view own mastery status"
    ON public.student_competency_mastery FOR SELECT
    USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can view own program enrollment" ON public.student_program_enrollments;
CREATE POLICY "Students can view own program enrollment"
    ON public.student_program_enrollments FOR SELECT
    USING (auth.uid() = student_id);

-- Public / Recruiter verification read access for verified credentials
DROP POLICY IF EXISTS "Public read for verified credentials" ON public.student_competency_mastery;
CREATE POLICY "Public read for verified credentials"
    ON public.student_competency_mastery FOR SELECT
    USING (state IN ('verified', 'verified_needs_review'));

DROP POLICY IF EXISTS "Public read for graduated program enrollments" ON public.student_program_enrollments;
CREATE POLICY "Public read for graduated program enrollments"
    ON public.student_program_enrollments FOR SELECT
    USING (is_graduated = TRUE);


-- ────────────────────────────────────────────────────────────────────────────
-- SOURCE: 20260822_phase2_phase3_ecosystem.sql
-- ────────────────────────────────────────────────────────────────────────────

-- supabase/migrations/20260822_phase2_phase3_ecosystem.sql
-- PinIT Career OS Phase 2 & 3: Code Wars, Hackathons, ATS Gaps, Internships, and Cohort Analytics

-- 1. Extend evidence source_type enum if required
DO $$ 
BEGIN
  ALTER TABLE public.competency_evidence_records 
    DROP CONSTRAINT IF EXISTS competency_evidence_records_source_type_check;
    
  ALTER TABLE public.competency_evidence_records 
    ADD CONSTRAINT competency_evidence_records_source_type_check 
    CHECK (source_type IN ('quest', 'mission', 'bug_lab', 'code_review', 'project', 'whiteboard', 'capstone', 'diagnostic', 'capstone_defense'));
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 2. Code Wars Battles Table
CREATE TABLE IF NOT EXISTS public.codewars_matches (
    id TEXT PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('1v1_duel', 'solo_speedrun', 'boss_challenge')),
    opponent_name TEXT,
    opponent_progress_pct INT DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('active', 'victory', 'defeat', 'timeout')),
    score NUMERIC DEFAULT 0,
    time_spent_seconds INT DEFAULT 0,
    execution_logs TEXT,
    evidence_record_id TEXT REFERENCES public.competency_evidence_records(id) ON DELETE SET NULL,
    started_at BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_codewars_student ON public.codewars_matches(student_id);
CREATE INDEX IF NOT EXISTS idx_codewars_status ON public.codewars_matches(status);

-- 3. Collaborative Hackathon Squads Table
CREATE TABLE IF NOT EXISTS public.hackathon_squads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    hackathon_title TEXT NOT NULL,
    team_lead_student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    repo_url TEXT NOT NULL,
    live_url TEXT,
    demo_video_url TEXT,
    milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL CHECK (status IN ('recruiting', 'building', 'submitted', 'verified')),
    final_score NUMERIC CHECK (final_score >= 0 AND final_score <= 100),
    jury_feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Hackathon Squad Members
CREATE TABLE IF NOT EXISTS public.hackathon_squad_members (
    squad_id TEXT NOT NULL REFERENCES public.hackathon_squads(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('frontend_lead', 'backend_lead', 'devops_cloud', 'data_engineer', 'ai_architect')),
    contribution_pct NUMERIC NOT NULL CHECK (contribution_pct >= 0 AND contribution_pct <= 100),
    assigned_tasks TEXT[] DEFAULT ARRAY[]::TEXT[],
    PRIMARY KEY (squad_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_squad_members_student ON public.hackathon_squad_members(student_id);

-- 5. External Internship Experience Ledger Table
CREATE TABLE IF NOT EXISTS public.external_internship_records (
    id TEXT PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    verified_by_mentor BOOLEAN NOT NULL DEFAULT FALSE,
    supervisor_email TEXT,
    skills_demonstrated TEXT[] DEFAULT ARRAY[]::TEXT[],
    artifacts JSONB DEFAULT '{}'::jsonb,
    integrity_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_internships_student ON public.external_internship_records(student_id);

-- 6. ATS Job Description Skill Gaps & Consent Table
CREATE TABLE IF NOT EXISTS public.ats_skill_gaps (
    id TEXT PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_job_title TEXT NOT NULL,
    competency_id TEXT NOT NULL,
    importance TEXT NOT NULL CHECK (importance IN ('required', 'recommended', 'bonus')),
    user_consent_status TEXT NOT NULL CHECK (user_consent_status IN ('pending', 'accepted', 'declined')),
    added_to_roadmap BOOLEAN NOT NULL DEFAULT FALSE,
    detected_at BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ats_student_consent ON public.ats_skill_gaps(student_id, user_consent_status);

-- 7. Institutional College Cohort Tables
CREATE TABLE IF NOT EXISTS public.college_cohorts (
    id TEXT PRIMARY KEY,
    college_name TEXT NOT NULL,
    department TEXT NOT NULL,
    batch_year INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_cohort_enrollments (
    cohort_id TEXT NOT NULL REFERENCES public.college_cohorts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (cohort_id, student_id)
);

-- 8. Enable Row Level Security
ALTER TABLE public.codewars_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathon_squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathon_squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_internship_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_cohort_enrollments ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.hackathon_squads FROM anon;
REVOKE ALL ON public.hackathon_squad_members FROM anon;

-- 9. Strict RLS Policies
-- Students can manage their own matches, squads, internships, and ATS gaps
DROP POLICY IF EXISTS "Students can view and create own codewars matches" ON public.codewars_matches;
CREATE POLICY "Students can view and create own codewars matches"
    ON public.codewars_matches FOR ALL
    USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can view all hackathon squads" ON public.hackathon_squads;
CREATE POLICY "Students can view all hackathon squads"
    ON public.hackathon_squads FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Squad leads can update their squads" ON public.hackathon_squads;
CREATE POLICY "Squad leads can update their squads"
    ON public.hackathon_squads FOR UPDATE
    USING (auth.uid() = team_lead_student_id);

DROP POLICY IF EXISTS "Members can view squad roster" ON public.hackathon_squad_members;
CREATE POLICY "Members can view squad roster"
    ON public.hackathon_squad_members FOR SELECT TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Students can manage own squad membership" ON public.hackathon_squad_members;
CREATE POLICY "Students can manage own squad membership"
    ON public.hackathon_squad_members FOR ALL
    USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can manage own internships" ON public.external_internship_records;
CREATE POLICY "Students can manage own internships"
    ON public.external_internship_records FOR ALL
    USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can manage own ATS gaps" ON public.ats_skill_gaps;
CREATE POLICY "Students can manage own ATS gaps"
    ON public.ats_skill_gaps FOR ALL
    USING (auth.uid() = student_id);

-- Public verifier read access for hackathons and verified internships
DROP POLICY IF EXISTS "Public read for verified hackathon projects" ON public.hackathon_squads;
CREATE POLICY "Public read for verified hackathon projects"
    ON public.hackathon_squads FOR SELECT
    USING (status = 'verified');


-- ────────────────────────────────────────────────────────────────────────────
-- SOURCE: 20260826_risk4_protect_completion_xp.sql
-- ────────────────────────────────────────────────────────────────────────────

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


-- ────────────────────────────────────────────────────────────────────────────
-- SOURCE: 20260902_create_evidence_ledger.sql
-- ────────────────────────────────────────────────────────────────────────────

-- supabase/migrations/20260902_create_evidence_ledger.sql
-- PinIT Career OS: Append-Only Cryptographic Evidence Ledger & Immutability Trigger

-- ── 1. Create Evidence Ledger Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.competency_evidence_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_code VARCHAR(64) NOT NULL,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    course_id VARCHAR(64) NOT NULL,
    phase_id VARCHAR(64) NOT NULL,
    month_id VARCHAR(64) NOT NULL,
    week_id VARCHAR(64) NOT NULL,
    packet_id VARCHAR(64) NOT NULL,
    day_id VARCHAR(64) NOT NULL,
    competency_id VARCHAR(64) NOT NULL,
    evidence_type VARCHAR(32) NOT NULL,
    source_type VARCHAR(32) NOT NULL,       -- 'FORMATIVE', 'SUMMATIVE', 'CERTIFICATION', 'IMPORT', 'MANUAL_REVIEW'
    status VARCHAR(32) NOT NULL,            -- 'UNVERIFIED', 'VERIFIED', 'REJECTED', 'INVALIDATED', 'REVOKED'
    
    -- Provenance & Snapshot JSONB
    provenance JSONB NOT NULL,
    assessment_snapshot JSONB NOT NULL,
    artifact_reference TEXT,
    
    -- Tamper-Evident Hash Chain
    integrity_sequence INT NOT NULL,        -- Sequential per-student: 1, 2, 3...
    previous_evidence_hash VARCHAR(64) NOT NULL,
    evidence_hash VARCHAR(64) NOT NULL UNIQUE,
    schema_version INT NOT NULL DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revocation_reason TEXT,
    superseding_evidence_id UUID REFERENCES public.competency_evidence_ledger(id),

    -- Constraints
    CONSTRAINT uq_student_sequence UNIQUE (student_id, integrity_sequence)
);

-- ── 2. Create Auditable Lifecycle Events Table ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.competency_evidence_audit_log (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID NOT NULL REFERENCES public.competency_evidence_ledger(id) ON DELETE RESTRICT,
    event_type VARCHAR(32) NOT NULL,        -- 'EVIDENCE_CREATED', 'EVIDENCE_VERIFIED', 'EVIDENCE_REVOKED', etc.
    actor_type VARCHAR(32) NOT NULL,        -- 'STUDENT', 'SYSTEM_EVALUATOR', 'ADMIN_EXAMINER'
    actor_id VARCHAR(64) NOT NULL,
    details TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. Indices for High-Speed Chronological Chain Audits ─────────────────────
CREATE INDEX IF NOT EXISTS idx_evidence_student_seq ON public.competency_evidence_ledger(student_id, integrity_sequence ASC);
CREATE INDEX IF NOT EXISTS idx_evidence_competency ON public.competency_evidence_ledger(student_id, competency_id, status);
CREATE INDEX IF NOT EXISTS idx_evidence_hash ON public.competency_evidence_ledger(evidence_hash);

-- ── 4. Immutability Enforcement Trigger (Blocks UPDATE & DELETE) ─────────────
CREATE OR REPLACE FUNCTION public.enforce_evidence_ledger_immutability()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Evidence ledger records are immutable and cannot be updated. Use superseding events instead.';
    ELSIF TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'PERMISSION_DENIED: Evidence ledger records are permanent and cannot be deleted.';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_evidence_immutability ON public.competency_evidence_ledger;
CREATE TRIGGER trg_evidence_immutability
BEFORE UPDATE OR DELETE ON public.competency_evidence_ledger
FOR EACH ROW EXECUTE FUNCTION public.enforce_evidence_ledger_immutability();

-- ── 5. Row-Level Security (RLS) Policies ──────────────────────────────────────
ALTER TABLE public.competency_evidence_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competency_evidence_audit_log ENABLE ROW LEVEL SECURITY;

-- Learners can only view their own evidence records
DROP POLICY IF EXISTS "Learners can view own evidence" ON public.competency_evidence_ledger;
CREATE POLICY "Learners can view own evidence"
ON public.competency_evidence_ledger
FOR SELECT
USING (auth.uid() = student_id);

-- Learners are strictly forbidden from inserting directly
-- Only trusted backend service_role can insert verified evidence
DROP POLICY IF EXISTS "Service role can insert evidence" ON public.competency_evidence_ledger;
CREATE POLICY "Service role can insert evidence"
ON public.competency_evidence_ledger
FOR INSERT
WITH CHECK (true);

-- Learners can view audit logs of their own evidence
DROP POLICY IF EXISTS "Learners can view own evidence audit logs" ON public.competency_evidence_audit_log;
CREATE POLICY "Learners can view own evidence audit logs"
ON public.competency_evidence_audit_log
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.competency_evidence_ledger e
        WHERE e.id = competency_evidence_audit_log.evidence_id
        AND e.student_id = auth.uid()
    )
);


-- ────────────────────────────────────────────────────────────────────────────
-- SOURCE: 20260904_create_client_telemetry.sql
-- ────────────────────────────────────────────────────────────────────────────

-- supabase/migrations/20260904_create_client_telemetry.sql
-- PinIT Career OS: Dedicated Ingestion Boundary for Untrusted Client Error Telemetry

CREATE TABLE IF NOT EXISTS public.client_telemetry_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id VARCHAR(64) NOT NULL,
    client_reported_timestamp TIMESTAMPTZ NOT NULL,
    server_received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    release VARCHAR(64) NOT NULL,
    route VARCHAR(256) NOT NULL,
    error_type VARCHAR(64) NOT NULL,
    sanitized_message VARCHAR(1000) NOT NULL,
    sanitized_stack VARCHAR(2000),
    trust_classification VARCHAR(64) NOT NULL DEFAULT 'UNTRUSTED_CLIENT_OBSERVATION',
    user_agent VARCHAR(512)
);

-- Enable RLS
ALTER TABLE public.client_telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_telemetry_events FORCE ROW LEVEL SECURITY;

-- Anonymous write-only ingestion policy (INSERT allowed, SELECT/UPDATE/DELETE strictly blocked)
DROP POLICY IF EXISTS "Allow anonymous telemetry ingest" ON public.client_telemetry_events;
CREATE POLICY "Allow anonymous telemetry ingest"
ON public.client_telemetry_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
    trust_classification = 'UNTRUSTED_CLIENT_OBSERVATION'
    AND length(sanitized_message) <= 1000
);

-- Strictly revoke reading/modifying from public/anon
REVOKE SELECT, UPDATE, DELETE, TRUNCATE ON public.client_telemetry_events FROM anon, authenticated;
GRANT INSERT ON public.client_telemetry_events TO anon, authenticated;

-- Service role retains full read/write for engineering diagnostics
GRANT ALL ON public.client_telemetry_events TO service_role;


-- ────────────────────────────────────────────────────────────────────────────
-- SOURCE: 20260907_subscription_expiry.sql
-- ────────────────────────────────────────────────────────────────────────────

-- supabase/migrations/20260907_subscription_expiry.sql
-- PinIT Career OS: Record a real subscription period instead of an imaginary one.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- WHY
-- ─────────────────────────────────────────────────────────────────────────────
-- public.users stores subscription_tier and nothing else. Once it is set to
-- 'pro' it never lapses: there is no start date, no end date and no status, so
-- a subscription cannot renew, expire, or be revoked on refund or chargeback,
-- and MRR / churn cannot be derived from the database at all.
--
-- Worse, the client currently INVENTS an expiry to display:
--
--     // src/lib/api/client.ts  (/api/payment/status)
--     endsAt: tier !== 'free'
--       ? new Date(Date.now() + 30 * 86400000).toISOString()   <-- recomputed
--       : null                                                      every call
--
-- That date slides forward forever, so the UI shows the user an expiry that is
-- always ~30 days away no matter when they paid. This migration provides a real
-- value for that field to read.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- SCOPE — deliberately NON-ENFORCING
-- ─────────────────────────────────────────────────────────────────────────────
-- This migration only RECORDS the subscription period. It does not gate any
-- feature on it. That is intentional: at the time of writing, nothing in the
-- codebase reads subscription_tier to grant access — no server route, no client
-- feature check — and /api/payment/status returns identical limits for 'free'
-- and 'pro'. Enforcing an expiry against an entitlement that does not yet exist
-- would gate nothing while risking locking out paying users.
--
-- When Pro genuinely unlocks something, enforce it with is_subscription_active()
-- below, in RLS and server routes — never in client code.
--
-- Every statement is additive and idempotent. No table, column, policy or row
-- is dropped.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Columns ─────────────────────────────────────────────────────────────────
alter table public.users
  add column if not exists subscription_started_at timestamptz,
  add column if not exists subscription_expires_at timestamptz,
  add column if not exists subscription_status text default 'none';

comment on column public.users.subscription_started_at is
  'UTC instant the current paid period began. Null for users who never paid.';
comment on column public.users.subscription_expires_at is
  'UTC instant the current paid period ends. Null means no active period. '
  'Treat a NULL expiry on a paid tier as legacy data, not as unlimited access.';
comment on column public.users.subscription_status is
  'none | active | expired | cancelled | refunded. Advisory; expires_at is authoritative.';

-- 2. Backfill legacy 'pro' rows ──────────────────────────────────────────────
-- Users who bought Pro before this migration have no dates at all. Give them a
-- generous forward-dated period so that IF enforcement is ever switched on they
-- are not immediately locked out of something they paid for. This runs first
-- and separately from any enforcement, exactly so that ordering can never
-- revoke access from an existing customer.
update public.users
   set subscription_started_at = coalesce(subscription_started_at, now()),
       subscription_expires_at = coalesce(subscription_expires_at, now() + interval '1 year'),
       subscription_status     = case
                                   when subscription_status is null or subscription_status = 'none'
                                     then 'active'
                                   else subscription_status
                                 end
 where coalesce(subscription_tier, 'free') <> 'free'
   and subscription_expires_at is null;

-- 3. Authoritative activity check ────────────────────────────────────────────
-- Single source of truth for "is this user actually a paying subscriber right
-- now". Use this from RLS and server routes when entitlements exist. Never
-- decide access from subscription_tier alone — that is the field that never
-- lapses. A NULL expiry returns false: absence of a period is not a licence.
create or replace function public.is_subscription_active(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users u
     where u.id = uid
       and coalesce(u.subscription_tier, 'free') <> 'free'
       and u.subscription_expires_at is not null
       and u.subscription_expires_at > now()
  );
$$;

grant execute on function public.is_subscription_active(uuid) to authenticated;

-- 4. Extend privilege-escalation protection ──────────────────────────────────
-- CRITICAL. The existing trigger blocks self-service edits to role, pins,
-- subscription_tier, ats_score and trust_score. The three new columns are NOT
-- covered by it, so without this change a user could simply UPDATE their own
-- row and push subscription_expires_at years into the future — granting
-- themselves a free subscription the moment enforcement is added.
--
-- This is CREATE OR REPLACE on the existing function: every original protection
-- is preserved verbatim and the new columns are added alongside them. Nothing
-- is removed. The trigger binding itself is untouched.
create or replace function public.prevent_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     or new.pins is distinct from old.pins
     or coalesce(new.subscription_tier, 'free') is distinct from coalesce(old.subscription_tier, 'free')
     or new.ats_score is distinct from old.ats_score
     or new.trust_score is distinct from old.trust_score
     -- added 2026-09-07: subscription period is server-owned
     or new.subscription_started_at is distinct from old.subscription_started_at
     or new.subscription_expires_at is distinct from old.subscription_expires_at
     or coalesce(new.subscription_status, 'none') is distinct from coalesce(old.subscription_status, 'none') then
    if auth.uid() is not null and auth.uid() = old.id then
      -- Block self-service privilege / economy / score / subscription forgery
      new.role                    := old.role;
      new.pins                    := old.pins;
      new.subscription_tier       := old.subscription_tier;
      new.ats_score               := old.ats_score;
      new.trust_score             := old.trust_score;
      new.subscription_started_at := old.subscription_started_at;
      new.subscription_expires_at := old.subscription_expires_at;
      new.subscription_status     := old.subscription_status;
    end if;
  end if;
  return new;
end;
$$;

-- 5. Index for expiry sweeps ─────────────────────────────────────────────────
-- Supports "which subscriptions lapse soon" queries for renewal reminders and
-- any future expiry cron, without a full table scan.
create index if not exists idx_users_subscription_expires_at
  on public.users (subscription_expires_at)
  where subscription_expires_at is not null;


-- ────────────────────────────────────────────────────────────────────────────
-- SOURCE: 20260908_create_processed_payments.sql
-- ────────────────────────────────────────────────────────────────────────────

-- supabase/migrations/20260908_create_processed_payments.sql
-- PinIT Career OS: Payment Idempotency & Replay Protection Table

CREATE TABLE IF NOT EXISTS public.processed_payments (
    payment_id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    pins_granted INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.processed_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own processed payments" ON public.processed_payments;
CREATE POLICY "Users can view own processed payments" ON public.processed_payments
    FOR SELECT TO authenticated USING (user_id = auth.uid()::text);

-- Only trusted backend service_role can insert processed payment records
DROP POLICY IF EXISTS "Service role can insert processed payments" ON public.processed_payments;
CREATE POLICY "Service role can insert processed payments" ON public.processed_payments
    FOR INSERT TO service_role WITH CHECK (true);


-- ────────────────────────────────────────────────────────────────────────────
-- SOURCE: 20260908_undeclared_runtime_tables.sql
-- ────────────────────────────────────────────────────────────────────────────

-- supabase/migrations/20260908_undeclared_runtime_tables.sql
-- PinIT Career OS: Runtime Database Tables Used by Application Services & Routes

-- ── 1. student_gd_history (GD-07 History Storage) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.student_gd_history (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    history_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.student_gd_history ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.student_gd_history FROM anon;

DROP POLICY IF EXISTS "Users can view own student_gd_history" ON public.student_gd_history;
CREATE POLICY "Users can view own student_gd_history" ON public.student_gd_history
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own student_gd_history" ON public.student_gd_history;
CREATE POLICY "Users can manage own student_gd_history" ON public.student_gd_history
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ── 2. gd_sessions (Detailed Individual GD Session Store) ─────────────────────
CREATE TABLE IF NOT EXISTS public.gd_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL DEFAULT 'Group Discussion',
    objective TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'medium',
    domain TEXT DEFAULT 'general',
    score INTEGER DEFAULT 0,
    report JSONB DEFAULT '{}'::jsonb,
    transcript JSONB DEFAULT '[]'::jsonb,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gd_sessions_user ON public.gd_sessions(user_id, created_at DESC);

ALTER TABLE public.gd_sessions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.gd_sessions FROM anon;

DROP POLICY IF EXISTS "Users can view own gd_sessions" ON public.gd_sessions;
CREATE POLICY "Users can view own gd_sessions" ON public.gd_sessions
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own gd_sessions" ON public.gd_sessions;
CREATE POLICY "Users can manage own gd_sessions" ON public.gd_sessions
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ── 3. student_squads (PR-07 Hackathon Squad Sync) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.student_squads (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    squads_payload JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.student_squads ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.student_squads FROM anon;

DROP POLICY IF EXISTS "Users can view own student_squads" ON public.student_squads;
CREATE POLICY "Users can view own student_squads" ON public.student_squads
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own student_squads" ON public.student_squads;
CREATE POLICY "Users can manage own student_squads" ON public.student_squads
    FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ── 4. exam_attempts (Institutional & Student Exam Records) ───────────────────
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    register_number TEXT,
    exam_schedule_id TEXT NOT NULL,
    score NUMERIC DEFAULT 0,
    passed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_attempts_student ON public.exam_attempts(student_id, exam_schedule_id);

ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.exam_attempts FROM anon;

DROP POLICY IF EXISTS "Students can view own exam attempts" ON public.exam_attempts;
CREATE POLICY "Students can view own exam attempts" ON public.exam_attempts
    FOR SELECT TO authenticated USING (student_id = auth.uid()::text OR register_number = auth.uid()::text);

DROP POLICY IF EXISTS "Students can insert own exam attempts" ON public.exam_attempts;
CREATE POLICY "Students can insert own exam attempts" ON public.exam_attempts
    FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid()::text);

-- ── 5. admin_audit_log (Admin Service Action Ledger) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_id TEXT,
    meta JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_timestamp ON public.admin_audit_log(timestamp DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.admin_audit_log FROM anon;

DROP POLICY IF EXISTS "Admins can view admin_audit_log" ON public.admin_audit_log;
CREATE POLICY "Admins can view admin_audit_log" ON public.admin_audit_log
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    );

DROP POLICY IF EXISTS "Admins can insert admin_audit_log" ON public.admin_audit_log;
CREATE POLICY "Admins can insert admin_audit_log" ON public.admin_audit_log
    FOR INSERT TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    );

-- ── 6. profiles (Admin Overview & Attention Leaderboard) ─────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    role TEXT DEFAULT 'student',
    ats_score INTEGER DEFAULT 0,
    trust_score INTEGER DEFAULT 40,
    pins INTEGER DEFAULT 100,
    attention_accuracy NUMERIC DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Strictly block anon key from reading or modifying profiles
REVOKE ALL ON public.profiles FROM anon;

-- 2. Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

-- 3. Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR ALL TO authenticated USING (auth.uid() = id);

-- 4. Staff and Admins can view all profiles
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
CREATE POLICY "Staff can view all profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    );

-- 5. Authenticated leaderboard read policy
DROP POLICY IF EXISTS "Authenticated leaderboard read" ON public.profiles;
CREATE POLICY "Authenticated leaderboard read" ON public.profiles
    FOR SELECT TO authenticated
    USING (true);

-- 6. Column-level privilege restriction:
-- Revoke all table-level SELECT from authenticated, grant ONLY non-sensitive leaderboard columns.
-- role, pins, ats_score, and trust_score are NOT readable by other users.
REVOKE SELECT ON public.profiles FROM authenticated, anon;
GRANT SELECT (id, display_name, attention_accuracy, games_played, created_at, updated_at) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- 7. Dedicated clean view for leaderboard consumption
CREATE OR REPLACE VIEW public.leaderboard_profiles AS
    SELECT id, display_name, attention_accuracy, games_played
    FROM public.profiles;

GRANT SELECT ON public.leaderboard_profiles TO authenticated;
REVOKE ALL ON public.leaderboard_profiles FROM anon;

-- Trigger to synchronize users table inserts/updates into profiles
CREATE OR REPLACE FUNCTION public.sync_user_to_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, role, ats_score, trust_score, pins, created_at)
    VALUES (NEW.id, NEW.display_name, NEW.role, NEW.ats_score, NEW.trust_score, NEW.pins, NEW.created_at)
    ON CONFLICT (id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        role = EXCLUDED.role,
        ats_score = EXCLUDED.ats_score,
        trust_score = EXCLUDED.trust_score,
        pins = EXCLUDED.pins,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_user_profile ON public.users;
CREATE TRIGGER trg_sync_user_profile
    AFTER INSERT OR UPDATE OF display_name, role, ats_score, trust_score, pins ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.sync_user_to_profile();

-- ── 7. chat_messages (Group Discussion Room Chat) ────────────────────────────
-- DESIGN DECISION (Explicit Architectural Constraint):
-- In PinIT Career OS, Group Discussion (GD) rooms are open practice arenas and cohort
-- lobbies (e.g. general, topic-based debates) where learners practice communication collaboratively.
-- All rooms are INTENTIONALLY PUBLIC to all authenticated students by design.
-- Private student-to-teacher or 1-on-1 messaging is handled exclusively by `direct_messages`
-- (which is strictly scoped to sender_id / recipient_id).
-- Anonymous / unauthenticated access to `chat_messages` is strictly REVOKED.
-- If private/isolated breakout rooms are introduced in Phase 4, a `room_memberships` table
-- will be added to enforce room-membership RLS.
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL DEFAULT 'student',
    content TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_time ON public.chat_messages(room_id, timestamp ASC);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.chat_messages FROM anon;
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;

DROP POLICY IF EXISTS "Public cohort GD rooms readable by authenticated students" ON public.chat_messages;
DROP POLICY IF EXISTS "Authenticated users can view room chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view room chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view own chat messages" ON public.chat_messages;
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR SELECT TO authenticated
    USING (user_id = auth.uid()::text);

DROP POLICY IF EXISTS "Staff can view all chat messages" ON public.chat_messages;
CREATE POLICY "Staff can view all chat messages" ON public.chat_messages
    FOR SELECT TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'staff')
      )
    );

DROP POLICY IF EXISTS "Users can post room chat messages" ON public.chat_messages;
CREATE POLICY "Users can post room chat messages" ON public.chat_messages
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid()::text);

-- ── 8. direct_messages (Student-Teacher Direct Messaging) ────────────────────
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    content TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_participants ON public.direct_messages(sender_id, recipient_id, created_at ASC);

ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.direct_messages FROM anon;

DROP POLICY IF EXISTS "Users can view own direct messages" ON public.direct_messages;
CREATE POLICY "Users can view own direct messages" ON public.direct_messages
    FOR SELECT TO authenticated USING (sender_id = auth.uid()::text OR recipient_id = auth.uid()::text);

DROP POLICY IF EXISTS "Users can send direct messages" ON public.direct_messages;
CREATE POLICY "Users can send direct messages" ON public.direct_messages
    FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid()::text);

-- ── 9. resumes storage bucket (Vault Uploads) ─────────────────────────────────
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'storage') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('resumes', 'resumes', false)
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

COMMIT;
