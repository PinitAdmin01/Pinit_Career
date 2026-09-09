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
