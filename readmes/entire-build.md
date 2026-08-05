# PinIT Career OS: Exhaustive Technical Reference & Architectural Specification
**Version 2.0.0**

This document serves as the complete, production-grade technical specification and architectural manual for **PinIT Career OS**. It details every component, directory, state provider, endpoint, database broker, layout configuration, style token, and transition timeline in the repository.

---

## 1. System Infrastructure & Core Technical Stack

PinIT Career OS is structured as a single-page web app built on **Next.js 14 (App Router)**. It leverages **Supabase Realtime** for biometric authorization brokers and runs an inline mock API suite designed for instant, zero-latency frontend execution.

### Tech Stack Details
* **Core Framework:** Next.js 14.2.x (configured for static exports and optimized client rendering).
* **Database & Auth Broker:** Supabase (Client SDK `@supabase/supabase-js` mapping to cloud schemas and PostgreSQL realtime notification hooks).
* **Mock Engine:** Intercepting request routing client-side to supply database records without remote dependencies.
* **Aesthetics & Styling:** Pure CSS3 styling leveraging HSL variables, fluid layouts, grid alignment tables, and hardware-accelerated animations.
* **Build System:** Custom `build.js` pipeline that cleans directory paths (`.next`, `out`), executes `next build`, and structures assets for static deployment.

---

## 2. Directory Roster & Complete Code Map

```
├── readmes/
│   └── entire-build.md               # [THIS FILE] Exhaustive technical reference manual
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── settings/
│   │   │   │   └── page.tsx          # Panel configuring accreditation warning thresholds
│   │   │   ├── students/
│   │   │   │   └── page.tsx          # Institutional roster database, filtering, CGPA trends
│   │   │   ├── teacher/
│   │   │   │   └── page.tsx          # Faculty portal lesson planners and weekly schedulers
│   │   │   └── page.tsx              # Operations dashboard: accreditation warning, fee dials
│   │   ├── analytics/
│   │   │   └── page.tsx              # Intelligence Center: 12-week SVG sparklines & charts
│   │   ├── applications/
│   │   │   └── page.tsx              # Renders candidate placement applications
│   │   ├── attendance/
│   │   │   └── page.tsx              # Live batch attendance registers & toggles
│   │   ├── career-builder/
│   │   │   └── page.tsx              # Career DNA resume parser and editor
│   │   ├── career-dna/
│   │   │   └── page.tsx              # Radial gauges tracking ATS, trust and skill maps
│   │   ├── career-twin/
│   │   │   └── page.tsx              # AI Career Twin chat terminal
│   │   ├── consultant/
│   │   │   └── page.tsx              # Advisor dashboards, onboarding CRM & mentor lists
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Student portal: scheduled exams & score cards
│   │   ├── group-discussion/
│   │   │   └── page.tsx              # Interactive Socratic discussion modules
│   │   ├── interview/
│   │   │   └── page.tsx              # Voice & text AI mock interview simulator
│   │   ├── missions/
│   │   │   └── page.tsx              # Socratic coding missions listing
│   │   ├── parent/
│   │   │   └── page.tsx              # Parent progress monitoring & student linkage
│   │   ├── quests/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx          # Interactive coding editor & compiler terminal
│   │   │   └── page.tsx              # active programming tasks grid
│   │   ├── recruiter/
│   │   │   └── page.tsx              # Corporate dashboards, postings and candidate searches
│   │   ├── page.tsx                  # Public landing page with morphing auth blocks
│   │   ├── layout.tsx                # HTML5 root layout
│   │   └── reset-password/
│   │       └── page.tsx              # Password reset workflow panel
│   └── lib/
│       ├── api/
│       │   └── client.ts             # API Client intercepting local requests
│       ├── context/
│       │   └── AuthContext.tsx       # Auth provider mapping demo accounts
│       └── supabaseClient.ts         # Supabase client configurations
```

---

## 3. Global Authentication Provider (`src/lib/context/AuthContext.tsx`)

The authentication context manages active user profiles, login hooks, session persistence, and role configurations.

### Mapped Profile Credentials & Role Database
Any login request using password `111111` triggers automatic verification:
1. **System Administrator:**
   * Email: `admin@pinit.in`
   * Role: `admin`
   * Display Name: `System Admin`
2. **Faculty Instructor:**
   * Email: `teacher@pinit.in`
   * Role: `teacher`
   * Display Name: `Faculty Member`
3. **Corporate Recruiter:**
   * Email: `rec@pinit.in`
   * Role: `recruiter`
   * Display Name: `Lead Recruiter`
4. **Career Consultant:**
   * Email: `con@pinit.in`
   * Role: `consultant`
   * Display Name: `Career Consultant`
5. **Parent Account:**
   * Email: `parent@pinit.in`
   * Role: `parent`
   * Display Name: `Family Representative`
6. **Student Account:**
   * Email: `student@pinit.in`
   * Role: `student`
   * Display Name: `Ashwanth Kumar`

### Realtime Database Hookup (`qr_login_sessions`)
The provider sets up database listener brokers mapping the `qr_login_sessions` table.
* **Fields monitored:**
  * `id`: unique session identifier uuid
  * `status`: current validation state (`ready` | `scanned` | `confirmed` | `expired`)
  * `email`: verified login user account
  * `access_token` / `refresh_token`: Supabase authorization credentials
* When status moves to `confirmed`, the application pulls session tokens, executes `supabase.auth.setSession`, and updates context state variables.

---

## 4. API Mock Engine (`src/lib/api/client.ts`)

The API engine intercepts requests client-side, supporting offline database operations:

### Mapped Dynamic API Path Interceptors

* **Parent Operations:**
  * `/api/parent/student/[studentId]/overview`: Returns child's overview profile mapping scores (`career_readiness: 74`, `ats_score: 72`, `trust_score: 75`, `career_dna_score: 68`, `mission_streak: 7`).
  * `/api/parent/students`: Returns list of students linked to parent.
  * `/api/parent/link-student`: Adds linkage mapping between parent email and student registration code.
* **Assessments & Quests:**
  * `/api/quests`: Returns coding challenges (e.g. `FizzBuzz`, `ArraySum`, `StringReverser`) along with test starter codes and compiler test cases.
  * `/api/missions/roleplay`: Submits student code execution outputs and evaluates syntax correctness.
* **AI Evaluation Engine:**
  * `/api/interview/evaluate`: Accepts voice transcription scripts or text answers, parses semantic structures, and returns matching metrics.

---

## 5. Detailed Architecture of the Six Workspaces

### Workspace 1: Campus Core
* **Student Directory (`src/app/admin/students/page.tsx`):**
  * Displays active directories, search filters, and status flags.
  * Lists registration keys, active branches, CGPA ratings, and fee clearance status.
* **Attendance Engine (`src/app/attendance/page.tsx`):**
  * Grids displaying student registers.
  * Interactive batch check triggers mapping states to Postgres rosters.
  * Attendance status toggles (*Present* (green), *Absent* (red), *Late* (orange)).

### Workspace 2: Campus Experience
* **Parent Dashboard (`src/app/parent/page.tsx`):**
  * Displays the student registration link box.
  * Visual progress tracking: displays child socratic score progress gauges, daily streaking charts, and recent score sheets.
  * Features a weakness warning list advising parents on concepts requiring reinforcement (e.g., *Double Pointers, Merkle Trees*).
* **Experience Registers:** Lists hostel capacity metrics and transport logs.

### Workspace 3: Faculty Studio
* **Lesson Block Planner (`src/app/admin/teacher/page.tsx`):**
  * Interactive weeks-mapping database grid.
  * Tracks progress through syllabus block targets, highlighting late items.
* **Submissions Grader:** Integrates an editor panel allowing teachers to execute submitted student code, review test outcomes, and assign grade values.

### Workspace 4: Career Hub
* **Career DNA Metrics (`src/app/career-dna/page.tsx`):**
  * Visualizes the student profile as radial SVG gauges tracking:
    * ATS Score: matching strength with posted corporate vacancies.
    * Trust Score: based on exam screen-switching events and tab-locks.
    * Skill map vectors.
* **Mentor Pipelines (`src/app/consultant/page.tsx`):**
  * Maps matching domains between students and alumni mentors.
  * Triggers 1:1 scheduling workflows mapping meeting calendar blocks.

### Workspace 5: Institution Operations
* **Accreditation Tracker (`src/app/admin/page.tsx`):**
  * Displays compliance status monitors tracking auditing parameters.
  * Flags warning status indicators for NAAC validation gaps.
* **Fee Collection SVG Gauge:**
  * Tracks collection values using SVG circular rings.
  * Dynamically computes circumference percentages (`strokeDashoffset`) comparing collections against the target budget.

### Workspace 6: Intelligence Center
* **Executive Dashboard (`src/app/analytics/page.tsx`):**
  * **12-Week Attendance Sparklines:** Dynamically computed SVG path strings plotting trends.
  * **Department CGPA Bar Charts:** Vector bar charts comparing averages.
  * **AI Warnings Banner:** Evaluates metrics and outputs warning recommendations.

---

## 6. Landing Page Visual Design & Styling Matrix

The entry landing page (`src/app/page.tsx`) uses a modern light-themed UI structure:

### CSS Custom Variables Definition
```css
:root {
  --font-display: 'Outfit', -apple-system, sans-serif;
  --font-body: 'Plus Jakarta Sans', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-glow: rgba(37, 99, 235, 0.12);
  --accent-cyan: #06b6d4;
  --accent-pink: #ec4899;
  --accent-green: #10b981;
  --accent-amber: #f59e0b;
  --accent-purple: #8b5cf6;
}
```

### Ambient Glow Motion Effects
Three blurred background shapes float behind the layout:
* `.blob-1`: Blue glow shape scaling on the left.
* `.blob-2`: Pink glow shape scaling on the right.
* `.blob-3`: Cyan glow shape scaling at the bottom.

These blobs utilize `@keyframes float` to scale and slide continuously:
```css
@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(60px, -80px) scale(1.12); }
  100% { transform: translate(-30px, 40px) scale(0.92); }
}
```

---

## 7. Morphing Biometrics Authorization System

This component (`MorphingPortalLoginWidget`) handles authentication dynamically for each of the six roles directly inside the landing page grid.

### Morphing Layout Transitions
When the user clicks "Enter Portal", the action link morphs into a dedicated authorization container:
```css
.morph-widget-card {
  width: 330px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 24px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
  padding: 24px;
  animation: card-expand 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

### QR Scanner Module
1. Generates a Supabase Realtime-backed token.
2. Displays an SVG QR code mapping back to `/qr-confirm?token=[token]`.
3. Sets up a Postgres database listener channel listening for confirmation signals.
4. Includes fallback buttons to simulate scanner scans in local development modes.

### Facial Scanner Module
1. Displays a circular face-HUD frame:
```css
.face-hud-circle {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 2px dashed var(--accent-cyan);
  background: rgba(6, 182, 212, 0.04);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
}
```
2. A green-cyan laser line sweeps up and down:
```css
.hud-scan-laser {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--accent-cyan);
  box-shadow: 0 0 10px var(--accent-cyan), 0 0 4px var(--accent-cyan);
  animation: hud-laser-sweep 2.2s infinite linear;
}
@keyframes hud-laser-sweep {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}
```
3. Clicking **"Run Face Verification"** triggers a multi-stage audit sequence:
   * Stage 1: `"Initializing optical feed..."` (800ms)
   * Stage 2: `"Mapping facial node markers..."` (800ms)
   * Stage 3: `"Verifying digital signature..."` (800ms)
   * Stage 4: Signs the user in using their default role account.

---

## 8. Routing Rules & Navigation Filters

Dynamic routing paths are managed inside the layout shell component (`src/app/layout.tsx`).

### Public Route Bypass list
The following paths are explicitly declared as bypass routes inside `PUBLIC_PATHS` to allow unauthenticated access:
* `/`: Main landing portal page.
* `/admissions`: Public student admissions workflow engine.
* `/signup`, `/reset-password`: Standard credential workflows.
* `/privacy`, `/terms`, `/contact`: Operational pages.

### Redirect Matrices
* If an unauthenticated user attempts to visit a protected route, they are automatically redirected to `/?login=true` (launching the authentication overlay).
* Authenticated profiles are routed based on role criteria:
  * **Admin/Superadmin:** Redirects to `/admin`
  * **Teacher/Faculty:** Redirects to `/admin/teacher`
  * **Recruiter:** Redirects to `/recruiter`
  * **Consultant:** Redirects to `/consultant`
  * **Parent:** Redirects to `/parent`
  * **Student:** Redirects to `/dashboard` (which exposes `/finance` and `/exams` sidebar options)

---

## 9. Institutional Admissions, Finance, Exams, Library, & Hostel Subpages
* **Admissions Engine (`src/app/admissions/page.tsx`):**
  * Online application registers, GPA score capture, document picker widgets.
  * Real-time timelines tracker mapping application states.
* **Finance Terminal (`src/app/finance/page.tsx`):**
  * Dues metrics tracking paid/outstanding balances.
  * Late fee fine calculators and due banners.
  * Scholarships waivers claims desk checking GPA eligibility.
  * Interactive payment gateway checkouts frame.
  * Watermarked receipt modals with printable invoices.
* **Exam Cell Portal (`src/app/exams/page.tsx`):**
  * Upcoming semester timetable listings.
  * Printable hall tickets displaying seat slots and invigilator seals.
  * Auditing locks and grade scorecard results roster.
  * Printable consolidated transcripts with digital QR stamps.
* **Library Center (`src/app/library/page.tsx`):**
  * Books catalog browser matching authors, genres, and availability codes.
  * Dynamic borrowing registries setting 14-day deadlines.
  * Reservations waitlist queue managers.
  * Digital textbook chapter reader lightboxes.
* **Hostel Hub (`src/app/hostel/page.tsx`):**
  * Rooms allocation selector block grids.
  * Biometric scan thumb logger simulators.
  * Category complaints desks raising maintenance requests.
  * Guest entry sign-in registries generating visitor passes.
* **Document Vault (`src/app/documents/page.tsx`):**
  * Certificate request registers.
  * Credentials locker status panels.
  * Official printable letterhead modals.
  * Simulated pdf downloads checkouts.
* **Faculty HR Management (`src/app/admin/page.tsx` `'hr'` tab):**
  * Faculty directory with designation lists and performance scores.
  * Real-time leave ledger request approvals.
  * Daily clock punch attendance sheets.
  * Gross/Net salary calculations payroll release buttons.
  * recruitment openings vacancy boards.
* **Procurement & Inventory (`src/app/admin/page.tsx` `'procurement'` tab):**
  * 6-stage approvals workflow tracking lifecycle stages:
    1. **Request:** Staff purchase requisitions database.
    2. **Manager Approval:** Manager reviews, approves or rejects requisitions.
    3. **Purchase:** Admin assigns vendor, issues Purchase Order (PO Ref).
    4. **Vendor:** Vendor acknowledges and ships materials (Dispatched status).
    5. **Delivery:** Log deliveries checking assets into inventory registers.
    6. **Invoice:** Match vendor invoice details and clear/settle payments.
  * Real-time Asset Stock Inventory directory.
  * Verified Vendors registry directories.
* **Asset Management (`src/app/admin/page.tsx` `'assets'` tab):**
  * Asset Registry directory (Computers, Projectors, Lab Equipment).
  * Maintenance scheduling tickets and resolution checks.
  * Annual Maintenance Contracts (AMC) warnings and renewals.
* **Grievance Portal (`src/app/grievances/page.tsx` & `/admin` `'grievances'` tab):**
  * Student category filing with anonymous reporter switches.
  * Active ticket trackers monitoring investigative lifecycles.
  * Admin resolution feedback form lockers.
  * On-behalf of faculty grievance submissions.
* **Campus Events Hub (`src/app/events/page.tsx` & `/admin` `'events'` tab):**
  * Student upcoming bulletins category lists (Hackathons, Seminars, Clubs).
  * Interactive capacity RSVPs tracking limits.
  * Participation certificate print viewer downloads.
  * Admin publishers board and certificates release triggers.
* **Research Management (`src/app/research/page.tsx` & `/admin` `'research'` tab):**
  * Student/Faculty Publication tracker pipeline (Draft -> Review -> Accepted -> Published).
  * Sponsored active projects and milestones progress bars.
  * Intellectual Property patent filings.
  * Admin grant approvals center (Approved / Rejected logs).
* **Alumni Network Portal (`src/app/alumni/page.tsx` & `/admin` `'alumni'` tab):**
  * Searchable alumni directory directory with company & batch filters.
  * Mentorship connection slots scheduler request pipeline.
  * Career opportunity jobs board with mock portfolio referral triggers.
  * Seed campaigns dynamic donations checkout.
  * Reunion RSVPs registries and attendee trackers.
* **Infrastructure Maintenance (`src/app/maintenance/page.tsx` & `/admin` `'maintenance'` tab):**
  * Campus fault reporting form (Electricity, Internet, Classrooms, Lab Maintenance).
  * Student diagnostics progression track ledger.
  * Admin assignment control workflows (Assign technician, Start work, Settle ticket).
* **Campus Communication Hub (`src/app/notifications/page.tsx` & `/admin` `'broadcast'` tab):**
  * Student announcement board categorized notices feed.
  * System alerts log read/unread drawer indicators.
  * Mock HTML email inbox reader preview panels.
  * Mock phone cellular screen SMS text feeds.
  * Push alerts simulator toaster overlays.
  * Admin multi-channel composer form dispatchers (email, SMS, announcement, system banner).
* **Student Services Desk (`src/app/services/page.tsx` & `/admin` `'services'` tab):**
  * Interactive leave applications logger forms (Personal/Medical/On-Duty).
  * Document certificate request logs.
  * General service requests logs (ID key/locker reissue).
  * Mentor appointment booking schedulers.
  * Wellness and career counselling booking slots.
  * Admin approvals panel workflows (Approve/Reject leaves, request status toggles, appointments checklist calendars).
* **Multi-campus Support (`src/app/university/page.tsx`):**
  * Hierarchical selector widgets mapping University -> College -> Campus -> Department -> Branch -> Section.
  * Dynamic stats recalculations based on active scope query parameters.
  * Visual active node path visualization.
* **Implementation Tools (`src/app/admin/settings/page.tsx`):**
  * Migration Wizard: 4-step Excel/CSV import validation pipeline. Renders row column checks and mapping rules.
  * Pilot Rollout Cohorts registry and feedback logger diaries.
  * ERP Integrations Connectors (SAP Student Lifecycle, Oracle PeopleSoft, Ellucian Banner, Canvas LMS API settings) with sync simulation hooks.
  * Training webinars scheduler calendar.
* **AI Academic Advisor (`src/app/advisor/page.tsx` & `/admin` `'advisor'` tab):**
  * Circular Backlog Risk radial gauge meter.
  * Dynamic risk sandbox simulator sliders to calculate "what-if" forecasts.
  * Intervention recommended quest checklists.
  * Subject-wise internals and lecture attendance grid database.
  * Admin at-risk student registry directory and warning composers.

---

## 10. Performance & Build Optimizations

* **Static Export Compatibility:** Next.js static exports (`output: 'export'`) automatically compile components offline.
* **Suspense Boundaries:** Search parameter checks on the landing page and admissions routes are wrapped inside `<Suspense>` boxes to resolve pre-rendering static generation bails.
* **Resource Optimization:** Consolidates standard font libraries, layout assets, and reduces render blockings.





