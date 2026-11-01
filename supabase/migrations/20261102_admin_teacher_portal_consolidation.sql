-- ============================================================================
-- PIN-IT CAREER OS: ADMIN & TEACHER PORTAL CONSOLIDATED MIGRATION
-- Migration: 20261102_admin_teacher_portal_consolidation.sql
-- Covers: Course certification purchase rates, Pins economy, Pin grants ledger,
-- Tournaments manager, Student institutional details, and Teacher events audit.
-- ============================================================================

-- 1. Course Certification Rates Table
CREATE TABLE IF NOT EXISTS public.admin_course_rates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Tech',
  original_price_inr NUMERIC NOT NULL DEFAULT 2999,
  discounted_price_inr NUMERIC NOT NULL DEFAULT 1499,
  price_in_pins INTEGER NOT NULL DEFAULT 250,
  cert_fee_inr NUMERIC NOT NULL DEFAULT 499,
  active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial canonical course rates
INSERT INTO public.admin_course_rates (id, title, category, original_price_inr, discounted_price_inr, price_in_pins, cert_fee_inr, active)
VALUES
  ('tech_fullstack', 'Full-Stack Software Engineering Masterclass', 'Tech', 3999, 1999, 300, 599, true),
  ('tech_ai_ml', 'AI & Applied Machine Learning Studio', 'AI & Data', 4499, 2499, 350, 699, true),
  ('tech_cloud_devops', 'Cloud Architecture & DevOps Systems', 'Tech', 3499, 1799, 280, 499, true),
  ('tech_cyber_sec', 'Cybersecurity Defense & Ethical Hacking', 'Tech', 3999, 1999, 300, 599, true),
  ('iot_net', 'IoT Embedded Systems & Industrial Networks', 'IoT', 3499, 1699, 260, 499, true),
  ('bcom_acc', 'Accounting & Forensic Bookkeeping Enterprise', 'Commerce', 2999, 1499, 220, 399, true),
  ('bcom_fin', 'Corporate Finance & Capital Markets', 'Commerce', 3499, 1799, 260, 499, true),
  ('bcom_aud', 'Statutory Audit & Assurance Standards', 'Commerce', 2999, 1499, 220, 399, true),
  ('bcom_ban', 'Banking, Treasury & Credit Operations', 'Commerce', 3299, 1599, 240, 449, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  updated_at = timezone('utc'::text, now());

-- 2. Pins Economy Configuration Table
CREATE TABLE IF NOT EXISTS public.admin_pins_economy (
  id TEXT PRIMARY KEY DEFAULT 'canonical_config',
  inr_per_pin NUMERIC NOT NULL DEFAULT 10,
  daily_login_bonus INTEGER NOT NULL DEFAULT 5,
  quest_complete_bonus INTEGER NOT NULL DEFAULT 25,
  tournament_base_pins INTEGER NOT NULL DEFAULT 50,
  packs JSONB NOT NULL DEFAULT '[
    {"id": "pack_starter", "name": "Starter Stash", "pinsAmount": 50, "priceInr": 499, "bonusPins": 0},
    {"id": "pack_growth", "name": "Growth Bundle", "pinsAmount": 150, "priceInr": 1299, "bonusPins": 15, "popular": true},
    {"id": "pack_pro", "name": "Pro Vault", "pinsAmount": 500, "priceInr": 3999, "bonusPins": 75},
    {"id": "pack_institutional", "name": "Campus Cohort Pack", "pinsAmount": 1500, "priceInr": 9999, "bonusPins": 300}
  ]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.admin_pins_economy (id, inr_per_pin, daily_login_bonus, quest_complete_bonus, tournament_base_pins)
VALUES ('canonical_config', 10, 5, 25, 50)
ON CONFLICT (id) DO NOTHING;

-- 3. Admin Pin Grants Audit Ledger
CREATE TABLE IF NOT EXISTS public.admin_pin_grants (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Administrative',
  granted_by TEXT NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  status TEXT NOT NULL DEFAULT 'completed'
);

-- 4. Tournaments & Competitions Registry
CREATE TABLE IF NOT EXISTS public.admin_tournaments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL DEFAULT 'All Domains',
  entry_fee_pins INTEGER NOT NULL DEFAULT 0,
  prize_pool_pins INTEGER NOT NULL DEFAULT 500,
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'live', 'completed'
  start_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  participants_count INTEGER NOT NULL DEFAULT 0,
  max_participants INTEGER NOT NULL DEFAULT 200,
  rules TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial tournaments
INSERT INTO public.admin_tournaments (id, title, domain, entry_fee_pins, prize_pool_pins, status, start_date, duration_minutes, participants_count, rules, created_by)
VALUES
  ('tourn_001', 'PinIT National Code Wars: Algorithmic Duel', 'Tech', 20, 1000, 'live', timezone('utc'::text, now()), 120, 48, '1v1 speed debugging, time-complexity constraints, and automated sandbox validation.', 'admin@pinit.in'),
  ('tourn_002', 'Full-Stack Architecture Sprint 2026', 'Full-Stack', 50, 2500, 'upcoming', timezone('utc'::text, now() + interval '3 days'), 180, 19, 'Design and deploy production-ready serverless microservices with automated verification.', 'admin@pinit.in'),
  ('tourn_003', 'AI & Machine Learning Model Hackathon', 'AI & Data', 0, 1500, 'upcoming', timezone('utc'::text, now() + interval '7 days'), 240, 62, 'Fine-tune an open-source classifier on unseen benchmark data with strict latency limits.', 'admin@pinit.in')
ON CONFLICT (id) DO NOTHING;

-- 5. Student Institutional Profiles (Managed by Faculty/Teachers)
CREATE TABLE IF NOT EXISTS public.student_institutional_profiles (
  student_id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  email TEXT NOT NULL,
  college_name TEXT NOT NULL DEFAULT 'National Institute of Technology',
  university TEXT NOT NULL DEFAULT 'State Technical University',
  roll_number TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT 'Computer Science & Engineering',
  batch TEXT NOT NULL DEFAULT '2022-2026',
  semester INTEGER NOT NULL DEFAULT 6,
  gpa NUMERIC(3, 2) NOT NULL DEFAULT 8.50,
  phone TEXT DEFAULT '',
  guardian_phone TEXT DEFAULT '',
  verification_status TEXT NOT NULL DEFAULT 'verified', -- 'pending', 'verified', 'flagged'
  verified_by TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Teacher Events Audit & Registry
CREATE TABLE IF NOT EXISTS public.teacher_events_audit (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Hackathon', -- 'Workshop', 'Hackathon', 'Seminar', 'Symposium', 'Placement Drive'
  venue TEXT NOT NULL DEFAULT 'Campus Main Auditorium & Virtual Arena',
  event_date TIMESTAMPTZ NOT NULL,
  duration_hours NUMERIC(4, 1) NOT NULL DEFAULT 3.0,
  budget NUMERIC NOT NULL DEFAULT 25000,
  attendees_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed', 'cancelled'
  audit_status TEXT NOT NULL DEFAULT 'approved', -- 'pending_audit', 'approved', 'compliance_flagged'
  audited_by TEXT DEFAULT '',
  audit_notes TEXT DEFAULT '',
  started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial events
INSERT INTO public.teacher_events_audit (id, title, category, venue, event_date, duration_hours, budget, attendees_count, status, audit_status, audited_by, audit_notes)
VALUES
  ('evt_001', 'Annual Campus Hackathon & Open Innovation Expo', 'Hackathon', 'Innovation Hall 101 & Hybrid Discord', timezone('utc'::text, now() + interval '5 days'), 24.0, 75000, 140, 'scheduled', 'approved', 'Dr. Kashyap', 'All fire safety, cloud credits, and mentor allocations verified.'),
  ('evt_002', 'NextGen AI & Cloud Infrastructure Workshop', 'Workshop', 'CS Seminar Hall B', timezone('utc'::text, now() + interval '2 days'), 4.0, 15000, 85, 'scheduled', 'approved', 'Prof. Anish', 'Guest speakers confirmed from Google Cloud & Microsoft Azure.'),
  ('evt_003', 'Enterprise Placement & Mock Defense Symposium', 'Placement Drive', 'Auditorium 1', timezone('utc'::text, now()), 6.0, 30000, 210, 'live', 'approved', 'Dr. Priya', 'Live defense sessions ongoing with Tier-1 recruiters.')
ON CONFLICT (id) DO NOTHING;
