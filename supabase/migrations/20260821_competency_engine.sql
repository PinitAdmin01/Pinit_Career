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
CREATE POLICY "Students can view own evidence records"
    ON public.competency_evidence_records FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can view own mastery status"
    ON public.student_competency_mastery FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can view own program enrollment"
    ON public.student_program_enrollments FOR SELECT
    USING (auth.uid() = student_id);

-- Public / Recruiter verification read access for verified credentials
CREATE POLICY "Public read for verified credentials"
    ON public.student_competency_mastery FOR SELECT
    USING (state IN ('verified', 'verified_needs_review'));

CREATE POLICY "Public read for graduated program enrollments"
    ON public.student_program_enrollments FOR SELECT
    USING (is_graduated = TRUE);
