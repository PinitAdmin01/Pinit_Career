// src/lib/curriculum/pythonFullStack/curriculumSpine.ts
// The Frozen 24-Month / 8-Phase Dual-Exit Curriculum Spine for PinIT Python Full-Stack Software Engineering
// (12-Month Professional Certificate + 24-Month Professional Advanced Program)

import { Course, Phase, Month } from '../types';

export const PYTHON_FULLSTACK_COURSE: Course = {
  id: 'course-python-fullstack',
  slug: 'python-full-stack',
  title: 'PinIT Python Full-Stack Software Engineering',
  description: 'A 24-month professional engineering program with a 12-month Professional Certificate exit and 24-month Advanced Program exit covering Python 3.14, Django 6.x, PostgreSQL 18, DRF, React (JS), FastAPI, Celery, Redis, Docker, AWS, Applied AI, and Live Capstone Defense.',
  durationMonths: 24,
  status: 'PUBLISHED',
  version: '2.0.0',
  createdAt: '2026-09-02T00:00:00.000Z',
  updatedAt: '2026-09-02T00:00:00.000Z',
};

export const PYTHON_FULLSTACK_PHASES: Phase[] = [
  // ── YEAR 1: PROFESSIONAL FOUNDATION (MONTHS 01–12) ──
  {
    id: 'phase-pfs-01',
    courseId: 'course-python-fullstack',
    phaseNumber: 1,
    title: 'Computing & Python Foundations',
    description: 'Hardware, terminal, OS, virtual environments, Python syntax, data types, operators, loops, functions, collections, OOP, and packaging.',
    startMonth: 1,
    endMonth: 3,
    order: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'phase-pfs-02',
    courseId: 'course-python-fullstack',
    phaseNumber: 2,
    title: 'DSA, Advanced Python & Web Fundamentals',
    description: 'Algorithmic thinking, Big-O, data structures, closures, decorators, generators, typing, HTTP/1.1 wire protocol, DOM, and Vanilla JS.',
    startMonth: 4,
    endMonth: 6,
    order: 2,
    status: 'PUBLISHED',
  },
  {
    id: 'phase-pfs-03',
    courseId: 'course-python-fullstack',
    phaseNumber: 3,
    title: 'Django Full-Stack & PostgreSQL Engineering',
    description: 'Django MVT architecture, models, migrations, PostgreSQL relational design, normalization, joins, authentication, forms, and HTMX.',
    startMonth: 7,
    endMonth: 9,
    order: 3,
    status: 'PUBLISHED',
  },
  {
    id: 'phase-pfs-04',
    courseId: 'course-python-fullstack',
    phaseNumber: 4,
    title: 'API Engineering, React UI & Professional Capstone',
    description: 'Django REST Framework, JWT auth, React (JavaScript-only) client, pytest, CI/CD basics, and 12-Month Professional Certificate Capstone.',
    startMonth: 10,
    endMonth: 12,
    order: 4,
    status: 'PUBLISHED',
  },

  // ── YEAR 2: PROFESSIONAL ADVANCED (MONTHS 13–24) ──
  {
    id: 'phase-pfs-05',
    courseId: 'course-python-fullstack',
    phaseNumber: 5,
    title: 'Advanced Django Architecture & High-Concurrency Systems',
    description: 'Modular SaaS service layers, PostgreSQL EXPLAIN query planning, Redis caching, and Celery distributed background worker queues.',
    startMonth: 13,
    endMonth: 15,
    order: 5,
    status: 'PUBLISHED',
  },
  {
    id: 'phase-pfs-06',
    courseId: 'course-python-fullstack',
    phaseNumber: 6,
    title: 'FastAPI, Real-Time Sync & Chaos Security Engineering',
    description: 'FastAPI async endpoints, Pydantic v2, WebSockets/SSE real-time streaming, and OWASP Top 10 Chaos Security Lab defense.',
    startMonth: 16,
    endMonth: 18,
    order: 6,
    status: 'PUBLISHED',
  },
  {
    id: 'phase-pfs-07',
    courseId: 'course-python-fullstack',
    phaseNumber: 7,
    title: 'Reliability Engineering, Docker & AWS Cloud Infrastructure',
    description: 'Chaos engineering, Prometheus observability, multi-stage Docker builds, GitHub Actions CI/CD, and AWS production provisioning (EC2, S3, RDS).',
    startMonth: 19,
    endMonth: 21,
    order: 7,
    status: 'PUBLISHED',
  },
  {
    id: 'phase-pfs-08',
    courseId: 'course-python-fullstack',
    phaseNumber: 8,
    title: 'System Design, Applied AI, Specialization & Major Capstone',
    description: 'System design trade-offs, Python LLM APIs, RAG, pgvector, specialized track (Backend/AI/Product), and 13-phase unassisted capstone defense.',
    startMonth: 22,
    endMonth: 24,
    order: 8,
    status: 'PUBLISHED',
  },
];

export const PYTHON_FULLSTACK_MONTHS: Month[] = [
  // Year 1 (Months 1–12)
  { id: 'month-pfs-01', phaseId: 'phase-pfs-01', monthNumber: 1, title: 'Computing + Developer Foundations', description: 'OS, Terminal, Git, Python Environment', order: 1, status: 'PUBLISHED' },
  { id: 'month-pfs-02', phaseId: 'phase-pfs-01', monthNumber: 2, title: 'Python Programming Foundations', description: 'Syntax, Control Flow, Functions, Data Structures', order: 2, status: 'PUBLISHED' },
  { id: 'month-pfs-03', phaseId: 'phase-pfs-01', monthNumber: 3, title: 'Python Application Engineering', description: 'OOP, Composition, Modules, Packaging, Logging', order: 3, status: 'PUBLISHED' },
  { id: 'month-pfs-04', phaseId: 'phase-pfs-02', monthNumber: 4, title: 'Problem Solving + DSA', description: 'Algorithmic Thinking, Big-O, Core Data Structures', order: 4, status: 'PUBLISHED' },
  { id: 'month-pfs-05', phaseId: 'phase-pfs-02', monthNumber: 5, title: 'Advanced Python', description: 'Closures, Decorators, Generators, Context Managers, Typing', order: 5, status: 'PUBLISHED' },
  { id: 'month-pfs-06', phaseId: 'phase-pfs-02', monthNumber: 6, title: 'Web Foundations', description: 'HTTP/1.1, HTML5, CSS3, DOM, Vanilla JavaScript', order: 6, status: 'PUBLISHED' },
  { id: 'month-pfs-07', phaseId: 'phase-pfs-03', monthNumber: 7, title: 'Django Foundations', description: 'MVT, URLs, Views, Templates, Models, Admin', order: 7, status: 'PUBLISHED' },
  { id: 'month-pfs-08', phaseId: 'phase-pfs-03', monthNumber: 8, title: 'PostgreSQL + Data Modeling', description: 'Relational Schemas, Constraints, Joins, Transactions, Indexes', order: 8, status: 'PUBLISHED' },
  { id: 'month-pfs-09', phaseId: 'phase-pfs-03', monthNumber: 9, title: 'Django Full-Stack Applications', description: 'Auth, RBAC, Forms, Validation, HTMX Integration', order: 9, status: 'PUBLISHED' },
  { id: 'month-pfs-10', phaseId: 'phase-pfs-04', monthNumber: 10, title: 'API Engineering + React JavaScript', description: 'Django REST Framework, JWT, React API Client', order: 10, status: 'PUBLISHED' },
  { id: 'month-pfs-11', phaseId: 'phase-pfs-04', monthNumber: 11, title: 'Testing + Professional Engineering', description: 'pytest, pytest-django, Mocking, PRs, CI Automation', order: 11, status: 'PUBLISHED' },
  { id: 'month-pfs-12', phaseId: 'phase-pfs-04', monthNumber: 12, title: 'Professional Certificate Capstone', description: '12-Month Professional Capstone Build & Defense', order: 12, status: 'PUBLISHED' },

  // Year 2 (Months 13–24)
  { id: 'month-pfs-13', phaseId: 'phase-pfs-05', monthNumber: 13, title: 'Advanced Django Architecture', description: 'Service Layer, Modular Design, Multi-Tenancy', order: 13, status: 'PUBLISHED' },
  { id: 'month-pfs-14', phaseId: 'phase-pfs-05', monthNumber: 14, title: 'PostgreSQL Performance + Redis', description: 'EXPLAIN Query Plans, Index Optimization, Redis Caching', order: 14, status: 'PUBLISHED' },
  { id: 'month-pfs-15', phaseId: 'phase-pfs-05', monthNumber: 15, title: 'Background Processing', description: 'Celery Workers, Task Queues, Retries, Idempotency', order: 15, status: 'PUBLISHED' },
  { id: 'month-pfs-16', phaseId: 'phase-pfs-06', monthNumber: 16, title: 'FastAPI + Async API Engineering', description: 'Async Endpoints, Pydantic Schemas, Dependency Injection', order: 16, status: 'PUBLISHED' },
  { id: 'month-pfs-17', phaseId: 'phase-pfs-06', monthNumber: 17, title: 'Real-Time + Async Systems', description: 'WebSockets, SSE, Real-Time Notifications, Pub/Sub', order: 17, status: 'PUBLISHED' },
  { id: 'month-pfs-18', phaseId: 'phase-pfs-06', monthNumber: 18, title: 'Security Engineering', description: 'OWASP Top 10 Defense, Chaos Security Exploit Lab', order: 18, status: 'PUBLISHED' },
  { id: 'month-pfs-19', phaseId: 'phase-pfs-07', monthNumber: 19, title: 'Testing + Reliability', description: 'Chaos Testing, Observability, Telemetry, Sentry, Metrics', order: 19, status: 'PUBLISHED' },
  { id: 'month-pfs-20', phaseId: 'phase-pfs-07', monthNumber: 20, title: 'Linux + Docker + CI/CD', description: 'Multi-Stage Docker, Docker Compose, Deployment Pipelines', order: 20, status: 'PUBLISHED' },
  { id: 'month-pfs-21', phaseId: 'phase-pfs-07', monthNumber: 21, title: 'AWS + Production Engineering', description: 'EC2, S3, RDS, IAM, VPC, SSL, Cloud Production Ops', order: 21, status: 'PUBLISHED' },
  { id: 'month-pfs-22', phaseId: 'phase-pfs-08', monthNumber: 22, title: 'System Design + Production AI', description: 'Scalability, Python LLM APIs, Vector Search, RAG, Tool-Use', order: 22, status: 'PUBLISHED' },
  { id: 'month-pfs-23', phaseId: 'phase-pfs-08', monthNumber: 23, title: 'Specialization + Industry/Internship', description: 'Specialized Track (Backend/AI/Product) + Client Brief', order: 23, status: 'PUBLISHED' },
  { id: 'month-pfs-24', phaseId: 'phase-pfs-08', monthNumber: 24, title: 'Major Capstone + Live Defense', description: '13-Phase Autonomous Capstone & Architecture Defense', order: 24, status: 'PUBLISHED' },
];
