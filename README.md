# PinIT Career OS 🎓⚡

**PinIT Career OS** is a hyper-personalized, enterprise-grade Autonomous Career Operating System and gamified learning environment designed for higher education students, university administrators, faculty, and recruiters.

---

## 🏛️ System Architecture

- **Frontend & App Framework**: Next.js 14 (App Router) + React 18 + Tailwind CSS
- **Interactive 3D**: Three.js + VRoid / VRM / GLTF real-time avatar mentors with facial morph targets, lip sync, and spatial tracking
- **In-Browser Execution**:
  - Python: Pyodide WebAssembly worker
  - JavaScript / TypeScript: in-browser sandboxed evaluator
  - SQL: `@electric-sql/pglite` embedded WebAssembly PostgreSQL
- **Backend Services**:
  - FastAPI Microservices (`backend/`)
  - Kokoro Local Neural TTS Voice Engine (`voice-service/`)
  - Supabase Database & Authentication (`supabase/`)
  - Cloud Run Execution Sandboxes (`cloud-run/`)

---

## 📁 Repository Directory Structure

```text
├── .agents/                 # AI agent rules, workflows, and task protocols
├── audit/                   # Contract extractors, API parity verification, security audits
├── backend/                 # FastAPI microservices for LLM routing and voice caching
├── cloud-run/               # Cloud Run execution judges (Java, JavaScript, Python)
├── content/
│   └── courses/             # Canonical 36-course Masterclass curriculum blueprints
├── data/                    # Evaluation datasets and synthetic benchmarks
├── docker/                  # Docker container definitions and seccomp profiles
├── docs/                    # Architecture records, specifications, governance, readmes
│   ├── course-readmes/      # Course instruction and syllabus manuals
│   ├── governance/          # Policy, charter, and competitive treatises
│   ├── portals/             # Sub-portal specifications (parent, consultant, etc.)
│   ├── presentations/       # Executive decks and presentation slide notes
│   ├── prototypes/          # Experimental prototypes (Voice Engine MVP)
│   ├── specifications/      # Curriculum blueprints and architectural specs
│   └── visuals/             # Visual plans and SRS documentation
├── prisma/                  # Prisma schema and database migrations
├── public/                  # Public assets (3D GLB avatars, Pyodide, Draco, Web Workers)
│   └── avatar/              # 15 student mentor GLB avatars and sample models
├── raw_avatars_source/      # Pristine backup archives of VRM and sample models
├── redis/                   # Redis cache configuration
├── scripts/                 # Core developer and CI tooling
│   ├── ci/                  # Continuous integration guards and task-scope validation
│   ├── legacy_generators/   # Archived curriculum generators and one-off audit scripts
│   ├── tests/               # Security and permission test runners
│   ├── utils/               # Build runners, Pyodide copiers, and SQL worker builders
│   ├── verify/              # Client-server API contract parity validators
│   └── visuals/             # Visual asset generators and status checkers
├── src/
│   ├── app/                 # Next.js App Router (pages and API endpoints)
│   ├── components/          # Domain-isolated UI components
│   ├── hooks/               # React custom hooks
│   ├── lib/                 # Core business logic, curriculum engines, audio routers
│   └── styles/              # Global styles, Tailwind definitions, design tokens
├── storage/                 # Multilingual audio caches and runtime assets
├── supabase/                # PostgreSQL schemas, migrations, and RLS policies
└── tests/                   # Automated unit, integration, and E2E test suites
```

---

## 🚀 Quick Start & Development

### 1. Prerequisites
- Node.js >= 20.x
- Python >= 3.11 (for backend microservices)
- npm >= 10.x

### 2. Setup & Installation
```bash
# Install dependencies
npm install

# Run predevelopment preparation (builds long lessons, copies pyodide & workers)
npm run predev

# Start local Next.js development server
npm run dev
```

### 3. Verification & Testing
```bash
# Run unit test battery
npm test

# Run API contract parity audit (0 defect tolerance)
npm run audit:contracts

# Run TypeScript typecheck
npx tsc --noEmit
```

---

## 🔒 Security & Code Standards

- **0 Broken Contracts**: Every client `/api/*` call must have a corresponding backend route.
- **Strict RLS**: All Supabase tables enforce Row Level Security by user role.
- **Pristine Assets**: Never delete or mutate production 3D avatar assets (`public/avatar/*.glb`).
