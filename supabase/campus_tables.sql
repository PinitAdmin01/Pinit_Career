-- Campus tables used by browser fallback when Next /api routes are not hosted.
-- Run in the Supabase SQL editor. RLS allows authenticated users to read;
-- writes are scoped to the caller where a student_id column exists.

create table if not exists public.hostel_rooms (
  code text primary key,
  block text,
  room text,
  capacity int default 1,
  occupied int default 0,
  residents jsonb default '[]'::jsonb,
  status text default 'available'
);

create table if not exists public.hostel_allocations (
  student_id text primary key,
  student_name text,
  requested_room text,
  status text default 'pending'
);

create table if not exists public.hostel_attendance (
  id uuid default gen_random_uuid() primary key,
  student_id text,
  student_name text,
  type text,
  room_code text,
  timestamp timestamptz default timezone('utc'::text, now())
);

create table if not exists public.hostel_complaints (
  id uuid default gen_random_uuid() primary key,
  student_id text,
  student_name text,
  category text,
  title text,
  description text,
  status text default 'Pending'
);

create table if not exists public.hostel_visitors (
  id uuid default gen_random_uuid() primary key,
  student_id text,
  name text,
  relation text,
  purpose text,
  status text default 'checked-in',
  timestamp timestamptz default timezone('utc'::text, now())
);

create table if not exists public.finance_dues (
  student_id text primary key,
  total_term_fees numeric default 0,
  scholarship_waiver numeric default 0,
  fine_levied numeric default 0,
  installments jsonb default '[]'::jsonb
);

create table if not exists public.finance_transactions (
  id text primary key,
  student_name text,
  student_email text,
  amount numeric,
  fine_paid numeric,
  type text,
  timestamp timestamptz default timezone('utc'::text, now())
);

create table if not exists public.library_books (
  isbn text primary key,
  title text,
  author text,
  genre text,
  copies int default 1,
  available int default 1,
  is_ebook boolean default false
);

create table if not exists public.library_borrowings (
  id uuid default gen_random_uuid() primary key,
  student_id text,
  student_name text,
  isbn text,
  title text,
  borrowed_on timestamptz default timezone('utc'::text, now()),
  due_on timestamptz,
  returned boolean default false,
  returned_on timestamptz,
  fine numeric default 0
);

create table if not exists public.library_reservations (
  id uuid default gen_random_uuid() primary key,
  student_id text,
  student_name text,
  isbn text,
  title text,
  position int
);

create table if not exists public.transport_routes (
  code text primary key,
  name text,
  driver_name text,
  vehicle text,
  stops jsonb default '[]'::jsonb,
  timing text
);

create table if not exists public.transport_drivers (
  name text,
  phone text,
  license text,
  rating numeric
);

create table if not exists public.transport_allocations (
  student_id text primary key,
  route_code text,
  stop text,
  status text default 'pending'
);

create table if not exists public.document_requests (
  id text primary key,
  student_id text,
  category text,
  description text,
  status text default 'pending',
  created_at timestamptz default timezone('utc'::text, now())
);

create table if not exists public.face_templates (
  user_key text primary key,
  descriptor jsonb not null,
  updated_at timestamptz default timezone('utc'::text, now())
);

create table if not exists public.student_attendance (
  student_id text primary key,
  subjects jsonb default '[]'::jsonb,
  focus_streak int default 0,
  last_check_in text,
  updated_at timestamptz default timezone('utc'::text, now())
);

create table if not exists public.campus_attendance (
  id text primary key,
  date text,
  batch text,
  student_id text,
  student_name text,
  roll_no text,
  status text
);

create table if not exists public.communications_log (
  id uuid default gen_random_uuid() primary key,
  type text,
  subject text,
  body text,
  category text,
  created_at timestamptz default timezone('utc'::text, now())
);

create table if not exists public.crm_companies (
  name text primary key,
  industry text,
  status text
);

create table if not exists public.crm_hr_contacts (
  name text,
  role text,
  company text,
  email text
);

create table if not exists public.crm_drives (
  date text,
  company text,
  profile text,
  status text
);

create table if not exists public.crm_visits (
  date text,
  topic text,
  guest text
);

create table if not exists public.crm_history (
  year text,
  recruited int,
  avg_salary text,
  top_recruiter text
);

create table if not exists public.crm_feedback (
  company text,
  rating text,
  comment text
);

create table if not exists public.exam_schedule (
  id text primary key,
  course text,
  code text,
  date text,
  time text,
  slot text,
  room text
);

create table if not exists public.exam_results (
  student_id text primary key,
  is_published boolean default false,
  gpa numeric,
  results jsonb default '[]'::jsonb
);

create table if not exists public.events_catalog (
  id text primary key,
  category text,
  title text,
  description text,
  date text,
  time text,
  venue text,
  capacity int default 0,
  rsvp_count int default 0,
  host text,
  completed boolean default false
);

create table if not exists public.events_rsvps (
  id uuid default gen_random_uuid() primary key,
  student_id text,
  student_name text,
  event_id text,
  has_certificate boolean default false,
  certificate_code text
);

create table if not exists public.grievances_tickets (
  id uuid default gen_random_uuid() primary key,
  student_id text,
  student_name text,
  reporter_type text,
  category text,
  title text,
  description text,
  anonymous boolean default false,
  status text default 'Open',
  resolution text
);

create table if not exists public.research_papers (
  id text primary key,
  student_id text,
  student_name text,
  title text,
  authors text,
  journal text,
  status text,
  date text
);

create table if not exists public.research_projects (id text primary key, data jsonb default '{}'::jsonb);
create table if not exists public.research_patents (id text primary key, data jsonb default '{}'::jsonb);

create table if not exists public.research_funding (
  id text primary key,
  title text,
  pi text,
  agency text,
  amount numeric,
  status text
);

create table if not exists public.infrastructure_tickets (
  id uuid default gen_random_uuid() primary key,
  category text,
  location text,
  description text,
  status text default 'Open',
  technician text,
  date text
);

create table if not exists public.advisor_performance (
  student_id text primary key,
  attendance numeric,
  cgpa numeric,
  assignments_completed int,
  assignments_pending int,
  warning_level text
);

create table if not exists public.admissions_applications (
  id text primary key,
  student_id text,
  student_name text,
  course text,
  rank int,
  status text,
  doc_verified boolean default false
);

create table if not exists public.admissions_seat_matrix (
  course text primary key,
  allocated int default 0,
  capacity int default 0
);

create table if not exists public.hr_faculty (id text primary key, name text, dept text, designation text, salary numeric, doj text);
create table if not exists public.hr_leaves (id text primary key, faculty_name text, start_date text, end_date text, reason text, status text);
create table if not exists public.hr_recruitment (id text primary key, title text, dept text, status text);
create table if not exists public.hr_attendance (id text primary key, faculty_name text, status text, date text);

create table if not exists public.procurement_requests (id text primary key, item text, qty int, dept text, cost numeric, status text);
create table if not exists public.procurement_orders (id text primary key, request_id text, vendor_name text, item text, qty int, status text);
create table if not exists public.procurement_vendors (id text primary key, name text, email text, category text);
create table if not exists public.procurement_inventory (item text primary key, qty int, dept text);

create table if not exists public.assets_list (asset_code text primary key, name text, category text, location text, status text);
create table if not exists public.assets_maintenance (id text primary key, asset_code text, issue text, staff text, scheduled_date text, status text);
create table if not exists public.assets_amc (id text primary key, expiry_date text);

create table if not exists public.alumni_registry (id text primary key, name text, batch text, company text, designation text, email text);
create table if not exists public.alumni_jobs (id text primary key, title text, company text, location text, salary text, posted_by text, created_at timestamptz default timezone('utc'::text, now()));
create table if not exists public.alumni_connects (id text primary key, mentor_name text, student_name text, slot text, status text);
create table if not exists public.alumni_referrals (id text primary key, job_id text, student_name text, status text);

create table if not exists public.services_leaves (id uuid default gen_random_uuid() primary key, student_id text, start_date text, end_date text, reason text, type text, status text);
create table if not exists public.services_requests (id uuid default gen_random_uuid() primary key, student_id text, category text, description text, status text);
create table if not exists public.services_appointments (id uuid default gen_random_uuid() primary key, student_id text, staff_name text, date text, time text, purpose text);
create table if not exists public.services_counselling (id uuid default gen_random_uuid() primary key, student_id text, counselor_name text, date text, time text);

create table if not exists public.study_notes (
  id uuid default gen_random_uuid() primary key,
  title text,
  subject text,
  semester text,
  batch text,
  description text,
  file_name text,
  file_size int,
  file_url text
);

alter table public.hostel_rooms enable row level security;
alter table public.hostel_allocations enable row level security;
alter table public.hostel_attendance enable row level security;
alter table public.hostel_complaints enable row level security;
alter table public.hostel_visitors enable row level security;
alter table public.finance_dues enable row level security;
alter table public.finance_transactions enable row level security;
alter table public.library_books enable row level security;
alter table public.library_borrowings enable row level security;
alter table public.library_reservations enable row level security;
alter table public.transport_routes enable row level security;
alter table public.transport_drivers enable row level security;
alter table public.transport_allocations enable row level security;
alter table public.document_requests enable row level security;
alter table public.face_templates enable row level security;
alter table public.student_attendance enable row level security;
alter table public.campus_attendance enable row level security;
alter table public.communications_log enable row level security;
alter table public.crm_companies enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'hostel_rooms','hostel_allocations','hostel_attendance','hostel_complaints','hostel_visitors',
    'finance_dues','finance_transactions','library_books','library_borrowings','library_reservations',
    'transport_routes','transport_drivers','transport_allocations','document_requests',
    'face_templates','student_attendance','campus_attendance','communications_log','crm_companies',
    'crm_hr_contacts','crm_drives','crm_visits','crm_history','crm_feedback',
    'exam_schedule','exam_results','events_catalog','events_rsvps','grievances_tickets',
    'research_papers','research_projects','research_patents','research_funding',
    'infrastructure_tickets','advisor_performance','admissions_applications','admissions_seat_matrix',
    'hr_faculty','hr_leaves','hr_recruitment','hr_attendance',
    'procurement_requests','procurement_orders','procurement_vendors','procurement_inventory',
    'assets_list','assets_maintenance','assets_amc',
    'alumni_registry','alumni_jobs','alumni_connects','alumni_referrals',
    'services_leaves','services_requests','services_appointments','services_counselling','study_notes'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists campus_auth_all on public.%I', t);
    execute format('create policy campus_auth_all on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;
