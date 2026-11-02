-- ==============================================================================
-- PinIT Career OS Migration: Campus ERP & Institutional Services Schema
-- Filename: 20261102_campus_erp_consolidation.sql
-- Description: Creates missing campus tables for Admissions, Library, Hostel,
--              Transit, Grievances, Procurement, HR, Assets, and Research.
-- ==============================================================================

-- ── 1. Admissions ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admissions_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_name TEXT NOT NULL,
    email TEXT NOT NULL,
    program TEXT NOT NULL,
    quota TEXT DEFAULT 'General',
    status TEXT DEFAULT 'under_review',
    merit_score NUMERIC(5,2) DEFAULT 0,
    documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admissions_seat_matrix (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program TEXT NOT NULL,
    total_seats INT NOT NULL DEFAULT 60,
    filled_seats INT NOT NULL DEFAULT 0,
    academic_year TEXT NOT NULL DEFAULT '2026-2027',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Library Services ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.library_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isbn TEXT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT DEFAULT 'Computer Science',
    total_copies INT DEFAULT 5,
    available_copies INT DEFAULT 5,
    location_shelf TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.library_borrowings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    borrowed_at TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    returned_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS public.library_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.library_books(id) ON DELETE CASCADE,
    reserved_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending'
);

-- ── 3. Hostel Management ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.hostel_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block TEXT NOT NULL,
    room_number TEXT NOT NULL,
    capacity INT DEFAULT 2,
    occupied INT DEFAULT 0,
    monthly_fee NUMERIC(10,2) DEFAULT 8000.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hostel_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.hostel_rooms(id) ON DELETE CASCADE,
    allocated_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS public.hostel_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hostel_visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    visitor_name TEXT NOT NULL,
    relationship TEXT,
    check_in TIMESTAMPTZ DEFAULT NOW(),
    check_out TIMESTAMPTZ,
    id_proof TEXT
);

CREATE TABLE IF NOT EXISTS public.hostel_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    curfew_status TEXT DEFAULT 'present',
    biometric_scan_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. Transport & Fleet ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transport_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_name TEXT NOT NULL,
    start_point TEXT NOT NULL,
    end_point TEXT NOT NULL,
    stops JSONB DEFAULT '[]'::jsonb,
    bus_number TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transport_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    route_id UUID REFERENCES public.transport_routes(id) ON DELETE CASCADE,
    pickup_stop TEXT NOT NULL,
    fee_paid BOOLEAN DEFAULT true,
    allocated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transport_drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    license_number TEXT NOT NULL,
    phone TEXT NOT NULL,
    bus_number TEXT,
    status TEXT DEFAULT 'active'
);

-- ── 5. Grievances & Infrastructure Maintenance ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.grievances_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'submitted',
    assigned_to UUID,
    resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.infrastructure_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    facility TEXT NOT NULL,
    location TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    urgency TEXT DEFAULT 'normal',
    status TEXT DEFAULT 'pending',
    technician_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. Procurement & Vendor Sourcing ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.procurement_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_name TEXT NOT NULL,
    category TEXT NOT NULL,
    contact_email TEXT,
    gstin TEXT,
    rating NUMERIC(3,2) DEFAULT 4.5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.procurement_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    sku TEXT UNIQUE,
    quantity_in_stock INT DEFAULT 0,
    unit_cost NUMERIC(10,2) DEFAULT 0.00,
    reorder_level INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.procurement_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requested_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity INT NOT NULL,
    estimated_cost NUMERIC(10,2) NOT NULL,
    justification TEXT,
    status TEXT DEFAULT 'pending_approval',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.procurement_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES public.procurement_requests(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES public.procurement_vendors(id) ON DELETE SET NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    status TEXT DEFAULT 'ordered',
    delivery_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. Exams & Academic Records ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.exam_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    hall_number TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL,
    marks_obtained NUMERIC(5,2) NOT NULL,
    max_marks NUMERIC(5,2) DEFAULT 100.00,
    grade TEXT NOT NULL,
    semester TEXT NOT NULL,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 8. Events & Campus Life ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Technical',
    event_date TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL,
    max_attendees INT DEFAULT 200,
    poster_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.events_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events_catalog(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'confirmed',
    registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 9. Notes & Student Services ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.study_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::text[],
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    requested_date TIMESTAMPTZ NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services_counselling (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    counsellor_name TEXT DEFAULT 'Campus Well-Being Advisor',
    session_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services_leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'submitted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 10. Research, Assets & Finance ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.research_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    abstract TEXT,
    journal TEXT,
    doi TEXT,
    publication_date DATE,
    citations_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.research_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    principal_investigator TEXT NOT NULL,
    title TEXT NOT NULL,
    funding_agency TEXT,
    grant_amount NUMERIC(12,2) DEFAULT 0.00,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS public.research_funding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_name TEXT NOT NULL,
    agency TEXT NOT NULL,
    budget_allocated NUMERIC(12,2) NOT NULL,
    sanction_year TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.research_patents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventor TEXT NOT NULL,
    title TEXT NOT NULL,
    application_number TEXT UNIQUE,
    status TEXT DEFAULT 'published'
);

CREATE TABLE IF NOT EXISTS public.assets_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_name TEXT NOT NULL,
    department TEXT NOT NULL,
    purchase_date DATE,
    cost NUMERIC(10,2) DEFAULT 0.00,
    condition TEXT DEFAULT 'good'
);

CREATE TABLE IF NOT EXISTS public.assets_maintenance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.assets_list(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    vendor TEXT,
    cost NUMERIC(10,2) DEFAULT 0.00,
    status TEXT DEFAULT 'scheduled'
);

CREATE TABLE IF NOT EXISTS public.assets_amc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES public.assets_list(id) ON DELETE CASCADE,
    vendor TEXT NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    annual_fee NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.alumni_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    batch_year INT NOT NULL,
    company TEXT,
    designation TEXT,
    linkedin_url TEXT,
    willing_to_refer BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.alumni_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posted_by UUID REFERENCES public.alumni_registry(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role_title TEXT NOT NULL,
    ctc_range TEXT,
    location TEXT,
    apply_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.alumni_connects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    alumnus_id UUID REFERENCES public.alumni_registry(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.alumni_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.alumni_jobs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'submitted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hr_faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    joining_date DATE,
    status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS public.hr_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES public.hr_faculty(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'present'
);

CREATE TABLE IF NOT EXISTS public.hr_leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID REFERENCES public.hr_faculty(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    status TEXT DEFAULT 'approved'
);

CREATE TABLE IF NOT EXISTS public.hr_recruitment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    vacancies INT DEFAULT 1,
    status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS public.finance_dues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fee_type TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT DEFAULT 'unpaid',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.finance_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    payment_method TEXT DEFAULT 'UPI',
    reference_id TEXT,
    status TEXT DEFAULT 'success',
    paid_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campus_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    department TEXT,
    status TEXT DEFAULT 'present',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS for Institutional Tables ──────────────────────────────────────────────
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_borrowings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_dues ENABLE ROW LEVEL SECURITY;

-- Permissive authenticated read for public reference tables
DROP POLICY IF EXISTS "Public read for library_books" ON public.library_books;
CREATE POLICY "Public read for library_books" ON public.library_books FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Public read for events_catalog" ON public.events_catalog;
CREATE POLICY "Public read for events_catalog" ON public.events_catalog FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Public read for transport_routes" ON public.transport_routes;
CREATE POLICY "Public read for transport_routes" ON public.transport_routes FOR SELECT TO authenticated USING (true);

-- Student self-service access
DROP POLICY IF EXISTS "Students view own grievances" ON public.grievances_tickets;
CREATE POLICY "Students view own grievances" ON public.grievances_tickets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students view own study notes" ON public.study_notes;
CREATE POLICY "Students view own study notes" ON public.study_notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ── 11. Notifications, Communications & Document Requests ────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_id UUID,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    type TEXT DEFAULT 'system',
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    purpose TEXT,
    status TEXT DEFAULT 'pending',
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.communications_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    channel TEXT NOT NULL DEFAULT 'email',
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'sent',
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.advisor_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advisor_name TEXT NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    score NUMERIC(3,2) DEFAULT 5.0,
    review TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 12. Placement Jobs, Applications & Counseling ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    ctc TEXT,
    location TEXT,
    description TEXT,
    skills_required TEXT[] DEFAULT ARRAY[]::text[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'applied',
    resume_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.counseling_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 13. Missions, Language Mastery & Campus KV ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    xp_reward INT DEFAULT 50,
    category TEXT DEFAULT 'coding',
    difficulty TEXT DEFAULT 'intermediate',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_language_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL DEFAULT 'en',
    current_unit INT DEFAULT 1,
    fluency_score NUMERIC(5,2) DEFAULT 0.0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_language_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL,
    badge_level TEXT DEFAULT 'A1',
    verified BOOLEAN DEFAULT false,
    earned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campus_kv (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.qr_login_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '5 minutes')
);

-- ── 14. Campus Recruiter CRM ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    industry TEXT,
    tier TEXT DEFAULT 'Tier-1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_hr_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    designation TEXT
);

CREATE TABLE IF NOT EXISTS public.crm_drives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
    drive_date DATE NOT NULL,
    roles TEXT[] DEFAULT ARRAY[]::text[],
    status TEXT DEFAULT 'scheduled'
);

CREATE TABLE IF NOT EXISTS public.crm_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    purpose TEXT
);

CREATE TABLE IF NOT EXISTS public.crm_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.crm_companies(id) ON DELETE CASCADE,
    batch_year INT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.5,
    comments TEXT
);
