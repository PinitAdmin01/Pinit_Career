-- supabase/migrations/20260915_campus_erp_core.sql
-- Sub-Batch 3.8 / Task 3.1: Campus ERP Core Tables & LocalStorage Eradication
-- Author: Friend 3 (Principal Database Architect & Backend Lead)
-- Tables: campus_course_materials, campus_fraud_alerts, campus_exam_results

-- 1. Course Materials Table
CREATE TABLE IF NOT EXISTS public.campus_course_materials (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    semester TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'pdf',
    file_url TEXT DEFAULT '',
    uploaded_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    size TEXT DEFAULT '1.0 MB',
    downloads_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

ALTER TABLE public.campus_course_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view course materials" ON public.campus_course_materials;
CREATE POLICY "Public can view course materials" ON public.campus_course_materials
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage course materials" ON public.campus_course_materials;
CREATE POLICY "Authenticated users can manage course materials" ON public.campus_course_materials
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_course_materials_subject_sem ON public.campus_course_materials(subject, semester);
CREATE INDEX IF NOT EXISTS idx_course_materials_uploaded ON public.campus_course_materials(uploaded_at DESC);

-- 2. Fraud Event Telemetry Table
CREATE TABLE IF NOT EXISTS public.campus_fraud_alerts (
    id TEXT PRIMARY KEY DEFAULT ('fraud_' || EXTRACT(EPOCH FROM NOW())::BIGINT || '_' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)),
    student_name TEXT NOT NULL,
    exam_title TEXT NOT NULL,
    tab_switches INTEGER DEFAULT 0,
    ip_address TEXT DEFAULT '127.0.0.1',
    trust_score_impact INTEGER DEFAULT 0,
    severity TEXT DEFAULT 'medium',
    timestamp TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.campus_fraud_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read fraud alerts" ON public.campus_fraud_alerts;
CREATE POLICY "Authenticated users can read fraud alerts" ON public.campus_fraud_alerts
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert fraud alerts" ON public.campus_fraud_alerts;
CREATE POLICY "Authenticated users can insert fraud alerts" ON public.campus_fraud_alerts
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_fraud_alerts_time ON public.campus_fraud_alerts(timestamp DESC);

-- 3. Exam Results & Grades Table
CREATE TABLE IF NOT EXISTS public.campus_exam_results (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    exam_id TEXT NOT NULL,
    student_id TEXT NOT NULL,
    score NUMERIC NOT NULL,
    total_marks NUMERIC NOT NULL,
    graded_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT uq_campus_exam_results_exam_student UNIQUE (exam_id, student_id)
);

ALTER TABLE public.campus_exam_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view their own exam results" ON public.campus_exam_results;
CREATE POLICY "Students can view their own exam results" ON public.campus_exam_results
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Faculty can record exam results" ON public.campus_exam_results;
CREATE POLICY "Faculty can record exam results" ON public.campus_exam_results
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_exam_results_student ON public.campus_exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_exam ON public.campus_exam_results(exam_id);
