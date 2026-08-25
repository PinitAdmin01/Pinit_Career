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

-- 9. Strict RLS Policies
-- Students can manage their own matches, squads, internships, and ATS gaps
CREATE POLICY "Students can view and create own codewars matches"
    ON public.codewars_matches FOR ALL
    USING (auth.uid() = student_id);

CREATE POLICY "Students can view all hackathon squads"
    ON public.hackathon_squads FOR SELECT
    USING (true);

CREATE POLICY "Squad leads can update their squads"
    ON public.hackathon_squads FOR UPDATE
    USING (auth.uid() = team_lead_student_id);

CREATE POLICY "Members can view squad roster"
    ON public.hackathon_squad_members FOR SELECT
    USING (true);

CREATE POLICY "Students can manage own squad membership"
    ON public.hackathon_squad_members FOR ALL
    USING (auth.uid() = student_id);

CREATE POLICY "Students can manage own internships"
    ON public.external_internship_records FOR ALL
    USING (auth.uid() = student_id);

CREATE POLICY "Students can manage own ATS gaps"
    ON public.ats_skill_gaps FOR ALL
    USING (auth.uid() = student_id);

-- Public verifier read access for hackathons and verified internships
CREATE POLICY "Public read for verified hackathon projects"
    ON public.hackathon_squads FOR SELECT
    USING (status = 'verified');
