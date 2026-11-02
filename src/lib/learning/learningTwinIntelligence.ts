/**
 * src/lib/learning/learningTwinIntelligence.ts
 * 
 * PinIT Career OS — Comprehensive Intelligence Engine for Learning & Career Twin Hub.
 * 
 * Motives Addressed:
 * 1. Mistakes & Remediation: Humanizes raw diagnostic snake_case tokens into deep diagnostic categories,
 *    root-cause explanations, failure telemetry snippets, and interactive Socratic drills.
 * 2. Growth Roadmap: Dynamically pulls from target roles & canonical trajectories into a multi-phase
 *    curriculum roadmap linked directly to active quests and verified gate requirements.
 * 3. Digital Career Twin Simulator: Interactive predictive simulation engine with live sensitivity sliders
 *    (Daily Pace, Mock Interview Score, Gaps Resolved) calculating live market readiness, CTC brackets,
 *    placement timelines, and 3 parallel industry archetypes.
 * 4. Curriculum Gaps: Multi-tier matrix (Critical Blockers vs Differentiators vs Specializations) with
 *    one-click Quest deep linking and quick competency verification.
 * 5. Spaced Memory (FSRS): Track-aware concept decks with a closed-loop pipeline turning resolved mistakes
 *    into active FSRS review cards.
 */

import { CANONICAL_TRAJECTORIES } from '@/lib/data/careerTrajectories';
import { FSRSCard, createEmptyCard } from '@/lib/learning/fsrsScheduler';

export type GapCategory = 
  | 'Behavioral & Execution' 
  | 'System Architecture' 
  | 'Algorithms & Logic' 
  | 'Communication & Interview' 
  | 'Domain & Compliance';

export interface RemedialDrillOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface HumanizedMistake {
  id: string;
  rawKey: string;
  title: string;
  category: GapCategory;
  severity: 'High' | 'Medium' | 'Low';
  rootCause: string;
  telemetrySnippet?: string;
  actionablePlan: string;
  drill: {
    question: string;
    context: string;
    codeSnippet?: string;
    options: RemedialDrillOption[];
    correctOptionId: string;
    successRewardXp: number;
    fsrsDeckItem: {
      topic: string;
      question: string;
      answer: string;
      course: string;
    };
  };
}

// ============================================================================
// 1. MISTAKES & REMEDIATION HUMANIZER DICTIONARY
// ============================================================================

const KNOWN_DIAGNOSTIC_TAXONOMY: Record<string, Partial<HumanizedMistake>> = {
  rigid_execution_vs_adaptation: {
    title: 'Cognitive Rigidity & Dynamic Constraint Adaptation',
    category: 'Behavioral & Execution',
    severity: 'High',
    rootCause: 'When presented with unexpected requirements or changed test cases mid-sprint, you execute the initial plan with strict discipline but resist pivoting to a simpler, adapted design.',
    telemetrySnippet: `[Diagnostic Failure: System Design Session #4]
Scenario: API Gateway timeout threshold reduced from 1000ms to 250ms.
Detected Behavior: Attempted brute-force multi-threading rather than switching to an event-driven cache or asynchronous queue.
Impact: High latency regression on edge clients.`,
    actionablePlan: 'Before writing implementation code, identify 2 possible constraint changes (e.g., latency spikes, network partitions) and design a fallback degradation branch.',
    drill: {
      question: 'Your payment webhook service suddenly experiences 3x incoming traffic during flash sales, causing database connection pool exhaustion. Which adaptive pattern should you implement first?',
      context: 'The original architecture directly processed transactions synchronously inside the HTTP handler.',
      codeSnippet: `// Original Handler
app.post('/api/webhook/payment', async (req, res) => {
  const client = await pool.connect();
  await processPaymentSynchronously(client, req.body);
  res.status(200).send('OK');
});`,
      options: [
        {
          id: 'opt_1',
          label: 'Double the max database connection pool size from 20 to 40 in environment variables.',
          isCorrect: false,
          explanation: 'Incorrect. Simply increasing connection pool size exhausts database memory and causes cascading connection timeouts under sustained traffic.'
        },
        {
          id: 'opt_2',
          label: 'Acknowledge HTTP 202 Accepted immediately and push payload to an asynchronous Redis / Kafka queue with decoupled worker consumers.',
          isCorrect: true,
          explanation: 'Correct! Decoupling ingestion from processing shields the relational database from sudden connection spikes and guarantees at-least-once delivery.'
        },
        {
          id: 'opt_3',
          label: 'Throw HTTP 503 errors for all requests exceeding 20 concurrent connections.',
          isCorrect: false,
          explanation: 'Incorrect. Dropping transactions loses revenue and causes webhook providers to disable the webhook endpoint.'
        }
      ],
      correctOptionId: 'opt_2',
      successRewardXp: 30,
      fsrsDeckItem: {
        topic: 'Adaptive Webhook Scaling',
        question: 'How do you prevent database connection pool exhaustion during sudden webhook traffic spikes?',
        answer: 'Decouple ingestion from processing: Return HTTP 202 Accepted immediately and push event payloads to an asynchronous distributed message queue (Redis/Kafka) processed by bounded background workers.',
        course: 'System Architecture & Concurrency'
      }
    }
  },

  communication_vs_investigation: {
    title: 'Inquiry Imbalance & Clarification Protocol',
    category: 'Communication & Interview',
    severity: 'Medium',
    rootCause: 'When given ambiguous problem statements or incomplete user stories, you tend to make assumptions or ask teammates immediately before conducting a structured 10-minute diagnostic investigation.',
    telemetrySnippet: `[Behavioral Evaluation: Mock STAR Interview]
Interviewer Prompt: "Design a URL shortening service."
Detected Gap: Started proposing database schemas without asking about read/write ratio, character length, analytics requirements, or custom aliases.
Score: Inquiry Protocol 54/100.`,
    actionablePlan: 'Execute the 3-Step Inquiry Protocol: (1) Frame 3 explicit clarifying questions on bounds/scale, (2) State your working assumptions, (3) Confirm alignment before architecting.',
    drill: {
      question: 'In a System Design or Technical Round, what is the optimal sequence to begin when the interviewer asks: "Design Twitter / X newsfeed"?',
      context: 'Ambiguous prompt with no initial constraints provided.',
      options: [
        {
          id: 'opt_1',
          label: 'Immediately start drawing the SQL tables for Users, Follows, and Tweets on the canvas.',
          isCorrect: false,
          explanation: 'Incorrect. Jumping into table schema before establishing functional scope and read/write scaling ratios leads to fundamental architectural flaws.'
        },
        {
          id: 'opt_2',
          label: 'Clarify functional requirements (e.g. read/write ratio, feed ranking vs chronological, media support) and establish DAU/QPS scale constraints.',
          isCorrect: true,
          explanation: 'Correct! Top 5% candidates always clarify scope, calculate traffic (e.g. 500M DAU, Fan-out-on-write vs Fan-out-on-read), and establish constraints first.'
        },
        {
          id: 'opt_3',
          label: 'Ask the interviewer to provide the complete system architecture diagram first.',
          isCorrect: false,
          explanation: 'Incorrect. The interview tests your ability to drive architectural discovery independently.'
        }
      ],
      correctOptionId: 'opt_2',
      successRewardXp: 25,
      fsrsDeckItem: {
        topic: 'System Design Inquiry Protocol',
        question: 'What is the required initial phase in any System Design interview before drawing components?',
        answer: 'Requirements & Scope Clarification: Define functional requirements (features in/out of scope) and non-functional requirements (read/write ratio, latency targets, throughput, and consistency model).',
        course: 'System Design & Interview Mastery'
      }
    }
  },

  independent_isolation_vs_alignment: {
    title: 'Siloed Tenacity & Stakeholder Alignment',
    category: 'Communication & Interview',
    severity: 'Medium',
    rootCause: 'You exhibit fierce individual problem-solving grit, but risk spending extensive cycles debugging in isolation without surfacing roadblocks to your team or mentor.',
    telemetrySnippet: `[Diagnostic Metric: Daily Mission Velocity]
Observation: 4.5 hours spent debugging CORS configuration on local mock server without checking team wiki documentation.
Remedial Trigger: Timed out before completing dependent task.`,
    actionablePlan: 'Apply the 15-Minute Rule: Spend 15 minutes of rigorous debugging, then summarize the error, actions taken, and hypotheses before asking for peer guidance.',
    drill: {
      question: 'When blocked by an obscure integration error for 20 minutes, what is the most professional engineering practice?',
      context: 'Team is operating on an agile sprint deadline.',
      options: [
        {
          id: 'opt_1',
          label: 'Document your reproduction steps, what you attempted, error logs, and post a concise query in the engineering channel.',
          isCorrect: true,
          explanation: 'Correct! Structured queries save senior engineer time and demonstrate systematic problem-solving.'
        },
        {
          id: 'opt_2',
          label: 'Silently continue trying random config combinations for another 3 hours.',
          isCorrect: false,
          explanation: 'Incorrect. Silent blocking leads to sprint delays and prevents knowledge sharing.'
        },
        {
          id: 'opt_3',
          label: 'Skip the task entirely and claim the module was completed.',
          isCorrect: false,
          explanation: 'Incorrect. Violates engineering integrity and breaks downstream build tests.'
        }
      ],
      correctOptionId: 'opt_1',
      successRewardXp: 25,
      fsrsDeckItem: {
        topic: 'Engineering Communication Rule',
        question: 'What is the "15-Minute Rule" in engineering team workflows?',
        answer: 'Spend 15 minutes of structured independent debugging (reading docs/logs/stack trace). If still blocked, write down: 1) What you want to do, 2) What failed with exact logs, 3) What you already tried, and request peer review.',
        course: 'Engineering Culture & Collaboration'
      }
    }
  },

  analysis_vs_shipping: {
    title: 'Analysis Paralysis & Prototype Shipping',
    category: 'Behavioral & Execution',
    severity: 'High',
    rootCause: 'Deep desire for theoretical architectural perfection causes hesitation in shipping an initial functioning prototype to users.',
    telemetrySnippet: `[Telemetry Log: Capstone Project Phase 1]
Status: 12 comprehensive diagrams generated, 0 deployed endpoints or verified commits in repository.
Target Metric: Requires working MVP with SHA-256 evidence.`,
    actionablePlan: 'Adopt the "Walking Skeleton" principle: Ship a minimal end-to-end slice (DB -> API -> UI) within Day 1, then iteratively optimize performance.',
    drill: {
      question: 'When starting a greenfield project with a tight deadline, what strategy minimizes delivery risk?',
      context: 'Building an e-commerce order verification service.',
      options: [
        {
          id: 'opt_1',
          label: 'Spend 2 weeks writing exhaustive UML diagrams and theoretical database schemas.',
          isCorrect: false,
          explanation: 'Incorrect. Premature theoretical optimization often collapses when integrated with real third-party APIs.'
        },
        {
          id: 'opt_2',
          label: 'Build and deploy a simple "Walking Skeleton" that executes a single real order end-to-end, then iterate on validation and edge cases.',
          isCorrect: true,
          explanation: 'Correct! A Walking Skeleton verifies CI/CD, network connectivity, and schema fundamentals from day one.'
        },
        {
          id: 'opt_3',
          label: 'Copy an existing repository blindly without understanding how the components fit together.',
          isCorrect: false,
          explanation: 'Incorrect. Unvetted boilerplate creates technical debt and prevents deep learning.'
        }
      ],
      correctOptionId: 'opt_2',
      successRewardXp: 30,
      fsrsDeckItem: {
        topic: 'Walking Skeleton Pattern',
        question: 'What is a "Walking Skeleton" in software engineering architecture?',
        answer: 'A tiny implementation of the fundamental system that executes an end-to-end flow through all architectural layers (database, business logic, API, UI) with minimal business logic, proving pipeline viability.',
        course: 'Software Engineering Best Practices'
      }
    }
  },

  async_race_condition: {
    title: 'Async Race Conditions & Concurrent State Mutations',
    category: 'System Architecture',
    severity: 'High',
    rootCause: 'Multiple asynchronous promises modifying shared state variables out-of-order, leading to inconsistent application state.',
    telemetrySnippet: `[AssertionError: tests/checkout_concurrency.test.ts]
Expected userCart.total to equal 120, received 40.
Culprit: Concurrent fetchCart() overwrote optimistic local state.`,
    actionablePlan: 'Use AbortController or functional state updater patterns with monotonic request IDs to ignore stale async responses.',
    drill: {
      question: 'In a search-as-you-type autocomplete input, how do you prevent an earlier slow HTTP request from overwriting a later fast HTTP response?',
      context: 'User types "cat", then quickly "cattle". Network latency causes "cat" to arrive second.',
      codeSnippet: `// Flawed snippet
async function onSearch(query) {
  const data = await fetch('/api/search?q=' + query).then(r => r.json());
  setResults(data); // Can cause race condition!
}`,
      options: [
        {
          id: 'opt_1',
          label: 'Wrap the search call in a 5-second sleep timer.',
          isCorrect: false,
          explanation: 'Incorrect. Artificial sleep degrades user responsiveness and does not guarantee packet arrival order.'
        },
        {
          id: 'opt_2',
          label: 'Use an AbortController to cancel prior pending requests, or track an incrementing request counter to reject stale responses.',
          isCorrect: true,
          explanation: 'Correct! Cancelling or ignoring out-of-date responses ensures only the latest user query updates the UI.'
        },
        {
          id: 'opt_3',
          label: 'Store results directly in localStorage instead of component state.',
          isCorrect: false,
          explanation: 'Incorrect. Storage mechanism does not address the concurrency race condition.'
        }
      ],
      correctOptionId: 'opt_2',
      successRewardXp: 30,
      fsrsDeckItem: {
        topic: 'Async Race Condition Prevention',
        question: 'How do you reliably prevent stale API responses from corrupting UI state in React/Next.js?',
        answer: 'Use the AbortController API in useEffect cleanup to abort in-flight fetch requests, or maintain an active request timestamp/counter so that responses older than the latest query are discarded.',
        course: 'Advanced JavaScript & React Patterns'
      }
    }
  },

  db_n_plus_one_query: {
    title: 'N+1 Query Inefficiency & Eager Batch Loading',
    category: 'System Architecture',
    severity: 'High',
    rootCause: 'Database query executed inside an iteration loop instead of batching queries using SQL JOIN or DataLoader.',
    telemetrySnippet: `[Database Performance Alert: /api/courses]
Executed 51 database queries in 840ms for 50 records.
Query: SELECT * FROM lessons WHERE course_id = $1 (executed 50 times)`,
    actionablePlan: 'Replace loop-level queries with single IN clause or LEFT JOIN, or use DataLoader for GraphQL/REST resolvers.',
    drill: {
      question: 'Which SQL approach completely eliminates the N+1 query problem when fetching 100 users with their profile data?',
      context: 'Users table and Profiles table with 1-to-1 relationship.',
      options: [
        {
          id: 'opt_1',
          label: 'SELECT * FROM users; followed by a for-loop issuing SELECT * FROM profiles WHERE user_id = ? for each user.',
          isCorrect: false,
          explanation: 'Incorrect. This is the exact definition of an N+1 query vulnerability!'
        },
        {
          id: 'opt_2',
          label: 'SELECT u.id, u.name, p.bio, p.avatar_url FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.status = "active";',
          isCorrect: true,
          explanation: 'Correct! A single relational JOIN retrieves both records in 1 database roundtrip with zero N+1 overhead.'
        },
        {
          id: 'opt_3',
          label: 'Cache each query result in a local variable inside the loop.',
          isCorrect: false,
          explanation: 'Incorrect. The database roundtrips still occur on first load.'
        }
      ],
      correctOptionId: 'opt_2',
      successRewardXp: 30,
      fsrsDeckItem: {
        topic: 'N+1 Query Elimination',
        question: 'What is the N+1 database problem and what is its standard remedy?',
        answer: 'The N+1 problem occurs when an application executes 1 initial query to fetch N parent records, and then executes N subsequent queries to fetch child data for each parent. Remedy: Use SQL JOINs, eager fetching with WHERE id IN (...), or a DataLoader batching mechanism.',
        course: 'Database Engineering & Performance'
      }
    }
  }
};

/**
 * Humanizes any assessment gap or mistake token into a rich, actionable diagnostic object.
 */
export function humanizeAssessmentGap(key: string, customDetails?: string): HumanizedMistake {
  const normalizedKey = key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
  
  if (KNOWN_DIAGNOSTIC_TAXONOMY[normalizedKey]) {
    const entry = KNOWN_DIAGNOSTIC_TAXONOMY[normalizedKey];
    return {
      id: `gap_${normalizedKey}`,
      rawKey: key,
      title: entry.title || key,
      category: entry.category || 'System Architecture',
      severity: entry.severity || 'High',
      rootCause: entry.rootCause || 'Identified competency variance in current assessment history.',
      telemetrySnippet: entry.telemetrySnippet,
      actionablePlan: entry.actionablePlan || 'Complete targeted remedial drills and review core architectural invariants.',
      drill: entry.drill!
    };
  }

  // Smart fallback generator for unknown keys / snake_case tokens
  const cleanTitle = key
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  let category: GapCategory = 'Algorithms & Logic';
  if (/system|design|arch|cloud|concurren|distribut/i.test(key)) category = 'System Architecture';
  else if (/commun|interview|star|present|align/i.test(key)) category = 'Communication & Interview';
  else if (/account|audit|finan|tax|ledger/i.test(key)) category = 'Domain & Compliance';
  else if (/execut|adapt|ship|explor|behav/i.test(key)) category = 'Behavioral & Execution';

  return {
    id: `gap_${normalizedKey}_${Date.now()}`,
    rawKey: key,
    title: `${cleanTitle} Mastery`,
    category,
    severity: 'High',
    rootCause: customDetails || `Diagnostic signals indicate a need to strengthen foundational concepts in ${cleanTitle}.`,
    telemetrySnippet: `[Diagnostic Evaluation: Competency Benchmark]
Target Area: ${cleanTitle}
Status: Unverified or emerging capability band.
Remedial Action: Complete guided code challenge and verify proof in Vault.`,
    actionablePlan: `Review canonical patterns for ${cleanTitle}, implement an isolated unit test, and defend your approach in the mock arena.`,
    drill: {
      question: `What is the core engineering invariant when implementing ${cleanTitle}?`,
      context: `Verifying foundational competency in ${cleanTitle}.`,
      options: [
        {
          id: 'opt_1',
          label: `Enforce deterministic boundaries, validate edge constraints, and write defensive unit tests for ${cleanTitle}.`,
          isCorrect: true,
          explanation: 'Correct! Engineering excellence requires defensive verification and clear boundary contracts.'
        },
        {
          id: 'opt_2',
          label: 'Rely purely on implicit defaults without validating inputs or handling exceptions.',
          isCorrect: false,
          explanation: 'Incorrect. Unchecked assumptions lead to production runtime exceptions.'
        },
        {
          id: 'opt_3',
          label: 'Bypass test cases to speed up initial deployment.',
          isCorrect: false,
          explanation: 'Incorrect. Bypassing tests degrades portfolio trust score.'
        }
      ],
      correctOptionId: 'opt_1',
      successRewardXp: 25,
      fsrsDeckItem: {
        topic: `${cleanTitle} Invariant`,
        question: `Why is defensive boundary validation critical in ${cleanTitle}?`,
        answer: 'Defensive validation guarantees that corrupt or malformed inputs are rejected at the edge before polluting downstream state machines or databases.',
        course: 'Core Engineering Invariants'
      }
    }
  };
}

// ============================================================================
// 2. GROWTH ROADMAP RESOLVER
// ============================================================================

export interface RoadmapStageInfo {
  stageNumber: number;
  phaseName: string;
  title: string;
  description: string;
  courseId: string;
  skills: string[];
  durationWeeks: number;
  milestoneQuestsCount: number;
  completedQuestsCount: number;
  progressPct: number;
  gateRequirements: {
    minCompletionPct: number;
    dsaScore?: number;
    systemDesignScore?: number;
    atsScore?: number;
    vaultProjectRequired?: boolean;
  };
  questDeepLink: string;
}

export function getDynamicRoadmapForTrack(
  targetRole: string = 'Software Engineer',
  activeCourseId?: string,
  completedMissionsCount: number = 0,
  completedQuestsCount: number = 0,
  vaultItemsCount: number = 0
): RoadmapStageInfo[] {
  const roleLower = targetRole.toLowerCase();

  // 1. React / Frontend
  if (roleLower.includes('frontend') || roleLower.includes('react') || activeCourseId === 'course-react-web') {
    return [
      {
        stageNumber: 1,
        phaseName: 'Phase 1: Core Fundamentals & DOM Invariants',
        title: 'HTML5, CSS Systems & ES6+ State Foundations',
        description: 'Master functional programming, asynchronous fetch, browser event loop, and responsive layout architectures.',
        courseId: 'course-react-web',
        skills: ['DOM Manipulation', 'ES6+ Syntax', 'Async/Await', 'Responsive CSS', 'Event Loop'],
        durationWeeks: 4,
        milestoneQuestsCount: 8,
        completedQuestsCount: Math.min(8, Math.max(1, Math.floor(completedQuestsCount * 0.4))),
        progressPct: Math.min(100, Math.max(25, Math.round((completedMissionsCount * 12) + (completedQuestsCount * 10)))),
        gateRequirements: { minCompletionPct: 80, dsaScore: 60, atsScore: 65, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-react-web'
      },
      {
        stageNumber: 2,
        phaseName: 'Phase 2: React State Machines & Hooks',
        title: 'Component Architecture, Custom Hooks & Context',
        description: 'Build robust single-page applications with deterministic state flow, memoization, and custom hooks.',
        courseId: 'course-react-web',
        skills: ['useState / useEffect', 'Custom Hooks', 'Context API', 'Performance Profiling', 'Zustand'],
        durationWeeks: 4,
        milestoneQuestsCount: 10,
        completedQuestsCount: Math.min(10, Math.floor(completedQuestsCount * 0.3)),
        progressPct: Math.min(100, Math.round(completedQuestsCount * 14)),
        gateRequirements: { minCompletionPct: 75, dsaScore: 65, atsScore: 70, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-react-web'
      },
      {
        stageNumber: 3,
        phaseName: 'Phase 3: Production Next.js & Server Components',
        title: 'Next.js App Router, RSC Boundaries & Hydration',
        description: 'Architect high-throughput web applications with Server Components, streaming SSR, and edge middleware.',
        courseId: 'course-nextjs-pro',
        skills: ['React Server Components', 'Next.js 14 App Router', 'Edge Middleware', 'TanStack Query', 'SSR Hydration'],
        durationWeeks: 4,
        milestoneQuestsCount: 12,
        completedQuestsCount: Math.min(12, Math.floor(completedQuestsCount * 0.2)),
        progressPct: Math.min(100, Math.round(vaultItemsCount * 20)),
        gateRequirements: { minCompletionPct: 85, systemDesignScore: 70, atsScore: 75, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-nextjs-pro'
      },
      {
        stageNumber: 4,
        phaseName: 'Phase 4: Enterprise Web Scale & Placement Gate',
        title: 'Micro-Frontends, Web Vitals & Production Hardening',
        description: 'Optimize Core Web Vitals (LCP < 2.0s, CLS < 0.1), security headers, and complete Tier-1 mock interviews.',
        courseId: 'course-react-capstone',
        skills: ['Core Web Vitals', 'CSP & Security', 'Jest / Playwright E2E', 'STAR Defense', 'ATS Resume Sync'],
        durationWeeks: 4,
        milestoneQuestsCount: 6,
        completedQuestsCount: Math.min(6, Math.floor(completedQuestsCount * 0.1)),
        progressPct: Math.min(100, Math.round(vaultItemsCount * 15)),
        gateRequirements: { minCompletionPct: 90, dsaScore: 75, systemDesignScore: 75, atsScore: 80, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-react-capstone'
      }
    ];
  }

  // 2. Java / Backend
  if (roleLower.includes('java') || roleLower.includes('backend') || activeCourseId?.includes('java')) {
    return [
      {
        stageNumber: 1,
        phaseName: 'Phase 1: Java Core & JVM Memory Invariants',
        title: 'OOP Design Patterns, Collections & Thread Safety',
        description: 'Master Java 17+, memory allocation (Heap vs Stack), garbage collection tuning, and multithreading primitives.',
        courseId: 'course-java-core',
        skills: ['Java 17+', 'JVM Memory Model', 'Collections Framework', 'Concurrency & Locks', 'Generics'],
        durationWeeks: 4,
        milestoneQuestsCount: 8,
        completedQuestsCount: Math.min(8, Math.max(1, Math.floor(completedQuestsCount * 0.4))),
        progressPct: Math.min(100, Math.max(30, Math.round((completedMissionsCount * 10) + (completedQuestsCount * 10)))),
        gateRequirements: { minCompletionPct: 80, dsaScore: 70, atsScore: 65, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-java-core'
      },
      {
        stageNumber: 2,
        phaseName: 'Phase 2: Spring Boot 3 & REST Microservices',
        title: 'Enterprise Spring Ecosystem & Hibernate ORM',
        description: 'Build robust REST APIs, dependency injection containers, transactional DB operations, and caching.',
        courseId: 'course-spring-boot',
        skills: ['Spring Boot 3', 'Spring Data JPA', 'Hibernate Caching', 'Spring Security', 'Flyway Migrations'],
        durationWeeks: 4,
        milestoneQuestsCount: 10,
        completedQuestsCount: Math.min(10, Math.floor(completedQuestsCount * 0.3)),
        progressPct: Math.min(100, Math.round(completedQuestsCount * 12)),
        gateRequirements: { minCompletionPct: 80, dsaScore: 70, atsScore: 72, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-spring-boot'
      },
      {
        stageNumber: 3,
        phaseName: 'Phase 3: Distributed Systems & Event Streaming',
        title: 'Kafka Messaging, Redis Caching & Microservice Resiliency',
        description: 'Architect distributed transactions (Saga Pattern), rate limiters, circuit breakers (Resilience4j), and Kafka pipelines.',
        courseId: 'course-distributed-systems',
        skills: ['Apache Kafka', 'Redis Cluster', 'Resilience4j', 'gRPC & Protobuf', 'Saga Pattern'],
        durationWeeks: 4,
        milestoneQuestsCount: 10,
        completedQuestsCount: Math.min(10, Math.floor(completedQuestsCount * 0.2)),
        progressPct: Math.min(100, Math.round(vaultItemsCount * 18)),
        gateRequirements: { minCompletionPct: 85, systemDesignScore: 75, atsScore: 78, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-distributed-systems'
      },
      {
        stageNumber: 4,
        phaseName: 'Phase 4: Cloud Native Deployment & Tier-1 Placement',
        title: 'Docker, Kubernetes & High-Scale Technical Vivas',
        description: 'Deploy containerized Java microservices to K8s, configure Prometheus metrics, and complete live mock vivas.',
        courseId: 'course-java-capstone',
        skills: ['Docker & K8s', 'Prometheus & Grafana', 'CI/CD Pipelines', 'System Design Defense', 'ATS Alignment'],
        durationWeeks: 4,
        milestoneQuestsCount: 6,
        completedQuestsCount: Math.min(6, Math.floor(completedQuestsCount * 0.1)),
        progressPct: Math.min(100, Math.round(vaultItemsCount * 15)),
        gateRequirements: { minCompletionPct: 90, dsaScore: 80, systemDesignScore: 80, atsScore: 82, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-java-capstone'
      }
    ];
  }

  // 3. AI / Machine Learning & Python
  if (roleLower.includes('ai') || roleLower.includes('ml') || roleLower.includes('python') || roleLower.includes('data')) {
    return [
      {
        stageNumber: 1,
        phaseName: 'Phase 1: Python Invariants & Scientific Computing',
        title: 'Python Core, NumPy Vectorization & Pandas Data Pipelines',
        description: 'Master vectorized matrix computation, data cleaning, exploratory statistics, and SQL transformations.',
        courseId: 'course-python-ai',
        skills: ['Python 3.11', 'NumPy Vectorization', 'Pandas ETL', 'PostgreSQL', 'Statistics'],
        durationWeeks: 4,
        milestoneQuestsCount: 8,
        completedQuestsCount: Math.min(8, Math.max(1, Math.floor(completedQuestsCount * 0.4))),
        progressPct: Math.min(100, Math.max(30, Math.round((completedMissionsCount * 12) + (completedQuestsCount * 8)))),
        gateRequirements: { minCompletionPct: 80, dsaScore: 65, atsScore: 68, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-python-ai'
      },
      {
        stageNumber: 2,
        phaseName: 'Phase 2: Supervised Learning & Model Evaluation',
        title: 'Scikit-Learn, Feature Engineering & Cross-Validation',
        description: 'Train classification/regression ensembles, gradient boosting (XGBoost), and prevent data leakage.',
        courseId: 'course-ml-core',
        skills: ['Scikit-Learn', 'XGBoost / LightGBM', 'ROC-AUC & Precision', 'Feature Pipeline', 'Hyperparameter Tuning'],
        durationWeeks: 4,
        milestoneQuestsCount: 10,
        completedQuestsCount: Math.min(10, Math.floor(completedQuestsCount * 0.3)),
        progressPct: Math.min(100, Math.round(completedQuestsCount * 12)),
        gateRequirements: { minCompletionPct: 80, dsaScore: 70, atsScore: 72, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-ml-core'
      },
      {
        stageNumber: 3,
        phaseName: 'Phase 3: Deep Learning, PyTorch & LLM Systems',
        title: 'Neural Networks, Embeddings, RAG & Vector Databases',
        description: 'Build custom PyTorch networks, transformer attention mechanisms, Qdrant/Pinecone RAG, and fine-tuning.',
        courseId: 'course-ai-llm',
        skills: ['PyTorch', 'Transformer Attention', 'Vector DBs (Qdrant)', 'RAG Pipelines', 'LangChain / LlamaIndex'],
        durationWeeks: 4,
        milestoneQuestsCount: 12,
        completedQuestsCount: Math.min(12, Math.floor(completedQuestsCount * 0.2)),
        progressPct: Math.min(100, Math.round(vaultItemsCount * 20)),
        gateRequirements: { minCompletionPct: 85, systemDesignScore: 75, atsScore: 78, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-ai-llm'
      },
      {
        stageNumber: 4,
        phaseName: 'Phase 4: Production MLOps & AI Placement Gate',
        title: 'Model Serving (FastAPI/vLLM), Latency Benchmarking & Vivas',
        description: 'Deploy quantized models to production with GPU concurrency, telemetry monitoring, and interview defenses.',
        courseId: 'course-ai-capstone',
        skills: ['FastAPI / vLLM', 'Docker GPU Runtime', 'Model Drift Telemetry', 'Technical Viva Defense', 'ATS Verification'],
        durationWeeks: 4,
        milestoneQuestsCount: 6,
        completedQuestsCount: Math.min(6, Math.floor(completedQuestsCount * 0.1)),
        progressPct: Math.min(100, Math.round(vaultItemsCount * 15)),
        gateRequirements: { minCompletionPct: 90, dsaScore: 75, systemDesignScore: 80, atsScore: 82, vaultProjectRequired: true },
        questDeepLink: '/quests?course=course-ai-capstone'
      }
    ];
  }

  // 4. Default / General Full Stack SDE
  return [
    {
      stageNumber: 1,
      phaseName: 'Phase 1: Full-Stack Foundations & Clean Logic',
      title: 'Algorithmic Problem Solving & System Boundaries',
      description: 'Master core language syntax, control flows, defensive exception handling, and clean code principles.',
      courseId: 'course-fullstack-foundations',
      skills: ['Data Structures', 'Algorithmic Complexity', 'Clean Architecture', 'Git Workflows'],
      durationWeeks: 4,
      milestoneQuestsCount: 8,
      completedQuestsCount: Math.min(8, Math.max(1, Math.floor(completedQuestsCount * 0.4))),
      progressPct: Math.min(100, Math.max(30, Math.round((completedMissionsCount * 10) + (completedQuestsCount * 10)))),
      gateRequirements: { minCompletionPct: 80, dsaScore: 65, atsScore: 65, vaultProjectRequired: true },
      questDeepLink: '/quests?course=course-fullstack-foundations'
    },
    {
      stageNumber: 2,
      phaseName: 'Phase 2: Relational Databases & Production APIs',
      title: 'REST Architecture, Relational Schema & Authentication',
      description: 'Build authenticated REST microservices with PostgreSQL, JWT session handling, and schema migrations.',
      courseId: 'course-api-architecture',
      skills: ['REST API Design', 'PostgreSQL / SQL', 'JWT & OAuth2', 'Schema Migration', 'Integration Tests'],
      durationWeeks: 4,
      milestoneQuestsCount: 10,
      completedQuestsCount: Math.min(10, Math.floor(completedQuestsCount * 0.3)),
      progressPct: Math.min(100, Math.round(completedQuestsCount * 12)),
      gateRequirements: { minCompletionPct: 80, dsaScore: 70, atsScore: 72, vaultProjectRequired: true },
      questDeepLink: '/quests?course=course-api-architecture'
    },
    {
      stageNumber: 3,
      phaseName: 'Phase 3: High-Scale Systems & Cloud Deployment',
      title: 'Caching, Asynchronous Queues & Containerization',
      description: 'Implement Redis caching, background job queues, Docker containers, and CI/CD automated deployment.',
      courseId: 'course-cloud-scale',
      skills: ['Redis Caching', 'Message Queues', 'Docker Containers', 'CI/CD Pipelines', 'AWS / Cloud Basics'],
      durationWeeks: 4,
      milestoneQuestsCount: 10,
      completedQuestsCount: Math.min(10, Math.floor(completedQuestsCount * 0.2)),
      progressPct: Math.min(100, Math.round(vaultItemsCount * 18)),
      gateRequirements: { minCompletionPct: 85, systemDesignScore: 75, atsScore: 78, vaultProjectRequired: true },
      questDeepLink: '/quests?course=course-cloud-scale'
    },
    {
      stageNumber: 4,
      phaseName: 'Phase 4: Capstone Verification & Placement Gate',
      title: 'Portfolio Defense, ATS Resume Sync & Mock Interviews',
      description: 'Defend your deployed capstone with senior engineering panels and benchmark your Career DNA.',
      courseId: 'course-capstone-defense',
      skills: ['Capstone Project', 'STAR Interview Defense', 'ATS Optimization (>=80)', 'Verified Credentials'],
      durationWeeks: 4,
      milestoneQuestsCount: 6,
      completedQuestsCount: Math.min(6, Math.floor(completedQuestsCount * 0.1)),
      progressPct: Math.min(100, Math.round(vaultItemsCount * 15)),
      gateRequirements: { minCompletionPct: 90, dsaScore: 75, systemDesignScore: 75, atsScore: 80, vaultProjectRequired: true },
      questDeepLink: '/quests?course=course-capstone-defense'
    }
  ];
}

// ============================================================================
// 3. DIGITAL CAREER TWIN PREDICTIVE ENGINE
// ============================================================================

export interface TwinSimulationParams {
  targetRole: string;
  dailyQuestPace: number; // 1 to 4
  interviewScoreTarget: number; // 50 to 98
  gapsResolvedCount: number; // 0 to 10
  baseAtsScore?: number;
  verifiedProofsCount?: number;
}

export interface TwinArchetypePath {
  id: string;
  title: string;
  companyType: string;
  icon: string;
  probabilityPct: number;
  projectedSalaryRange: string;
  projectedCtcMin: number;
  projectedCtcMax: number;
  placementTimelineMonths: number;
  fitScore: number;
  hiringCriteria: string[];
  keyRisk: string;
  strategicAdvantage: string;
}

export interface TwinSimulationOutput {
  overallMarketReadiness: number;
  recruiterAppealTier: 'Standard Pool' | 'Competitive Contender' | 'Top 10% High-Potential' | 'Top 2% Direct Unicorn Select';
  projectedCtcBracket: string;
  estimatedMonthsToOffer: number;
  weeklyEffortHours: number;
  paths: TwinArchetypePath[];
  recommendedSprints: Array<{ sprint: string; focus: string; impact: string }>;
}

export function calculateDynamicCareerTwin(params: TwinSimulationParams): TwinSimulationOutput {
  const {
    targetRole = 'Software Engineer',
    dailyQuestPace = 2,
    interviewScoreTarget = 75,
    gapsResolvedCount = 1,
    baseAtsScore = 68,
    verifiedProofsCount = 1
  } = params;

  // 1. Overall Market Readiness calculation (0 - 100)
  // Weighted: Base ATS (25%), Interview Readiness (35%), Gap Resolution (25%), Velocity Pacing (15%)
  const pacingWeight = Math.min(100, dailyQuestPace * 25);
  const gapWeight = Math.min(100, gapsResolvedCount * 12);
  const overallMarketReadiness = Math.min(
    98,
    Math.max(
      42,
      Math.round(
        baseAtsScore * 0.25 +
        interviewScoreTarget * 0.35 +
        gapWeight * 0.25 +
        pacingWeight * 0.15
      )
    )
  );

  // 2. Timeline to First Offer (Months)
  // Higher pace, interview score, and gap closure drastically accelerate timeline
  const rawMonths = 11.5 - (dailyQuestPace * 1.6) - (gapsResolvedCount * 0.35) - ((interviewScoreTarget - 50) * 0.05);
  const estimatedMonthsToOffer = Math.max(2.5, Math.round(rawMonths * 10) / 10);

  // 3. Weekly Effort Hours
  const weeklyEffortHours = Math.round(dailyQuestPace * 7 * 1.4);

  // 4. Recruiter Appeal Tier
  let recruiterAppealTier: TwinSimulationOutput['recruiterAppealTier'] = 'Standard Pool';
  if (overallMarketReadiness >= 88) recruiterAppealTier = 'Top 2% Direct Unicorn Select';
  else if (overallMarketReadiness >= 76) recruiterAppealTier = 'Top 10% High-Potential';
  else if (overallMarketReadiness >= 62) recruiterAppealTier = 'Competitive Contender';

  // 5. Projected CTC Brackets (LPA)
  // Base scale starts at 6-9 LPA. Scaling factors: interview quality, proofs count, gaps resolved
  const bonusFromInterview = Math.round((interviewScoreTarget - 50) * 0.18);
  const bonusFromGaps = Math.round(gapsResolvedCount * 0.8);
  const bonusFromPace = Math.round(dailyQuestPace * 1.2);
  const bonusFromProofs = Math.min(6, verifiedProofsCount * 1.5);

  const ctcMin = Math.max(5, Math.round(6 + bonusFromInterview * 0.7 + bonusFromGaps * 0.5 + bonusFromProofs * 0.5));
  const ctcMax = Math.max(ctcMin + 4, Math.round(9 + bonusFromInterview * 1.2 + bonusFromGaps * 0.9 + bonusFromPace + bonusFromProofs));
  const projectedCtcBracket = `₹${ctcMin} - ${ctcMax} LPA`;

  // 6. 3 Parallel Industry Archetype Paths
  const paths: TwinArchetypePath[] = [
    {
      id: 'path_unicorn_tech',
      title: `High-Growth Product Firm / Unicorn (${targetRole})`,
      companyType: 'Tier-1 Product Companies & High-Scale Startups',
      icon: '🦄',
      probabilityPct: Math.min(95, Math.max(35, Math.round(overallMarketReadiness * 0.95 - (4 - dailyQuestPace) * 4))),
      projectedSalaryRange: `₹${ctcMin + 3} - ${ctcMax + 6} LPA`,
      projectedCtcMin: ctcMin + 3,
      projectedCtcMax: ctcMax + 6,
      placementTimelineMonths: estimatedMonthsToOffer,
      fitScore: Math.min(96, Math.round(overallMarketReadiness * 0.92 + (interviewScoreTarget > 80 ? 5 : 0))),
      hiringCriteria: [
        'Demonstrated High-Concurrency System Design',
        'Clean Microservice Architecture & Clean Code',
        `Top 10% Mock Interview STAR Score (Current: ${interviewScoreTarget}%)`,
        'At least 2 Verified Vault Capstones'
      ],
      keyRisk: 'Intense DSA & Algorithmic Rigor in Screening Rounds.',
      strategicAdvantage: 'High equity upside, accelerated leadership trajectory, top-tier compensation.'
    },
    {
      id: 'path_enterprise_mnc',
      title: `Global Enterprise MNC & Cloud Core`,
      companyType: 'Tier-1 Tech Consortia & Global Technology Centers',
      icon: '🏢',
      probabilityPct: Math.min(96, Math.max(45, Math.round(overallMarketReadiness * 0.88 + 8))),
      projectedSalaryRange: `₹${ctcMin} - ${ctcMax} LPA`,
      projectedCtcMin: ctcMin,
      projectedCtcMax: ctcMax,
      placementTimelineMonths: Math.max(3.0, Math.round((estimatedMonthsToOffer + 0.8) * 10) / 10),
      fitScore: Math.min(95, Math.round(overallMarketReadiness * 0.86 + 10)),
      hiringCriteria: [
        'Robust Relational Data Modeling & ACID Transactions',
        'Enterprise Security & OAuth2 Standards',
        'Reliable Sprint Delivery & Documentation Quality',
        'ATS Score >= 75 in System Architecture'
      ],
      keyRisk: 'Extended multi-stage hiring pipeline and institutional background screening.',
      strategicAdvantage: 'Unsurpassed career stability, comprehensive corporate benefits, global mobility.'
    },
    {
      id: 'path_early_venture',
      title: `Venture / Founding Engineer Track`,
      companyType: 'Seed / Series A Funded Disruptors',
      icon: '⚡',
      probabilityPct: Math.min(94, Math.max(30, Math.round(overallMarketReadiness * 0.82 + (dailyQuestPace >= 3 ? 12 : 2)))),
      projectedSalaryRange: `₹${Math.max(8, ctcMin - 1)} - ${ctcMax + 2} LPA + 1-3% Equity`,
      projectedCtcMin: Math.max(8, ctcMin - 1),
      projectedCtcMax: ctcMax + 2,
      placementTimelineMonths: Math.max(2.0, Math.round((estimatedMonthsToOffer - 0.7) * 10) / 10),
      fitScore: Math.min(95, Math.round(overallMarketReadiness * 0.80 + (dailyQuestPace >= 3 ? 14 : 0))),
      hiringCriteria: [
        'Rapid 0-to-1 MVP Prototyping & Shipping Velocity',
        'Cross-Functional Autonomy (Frontend + Backend + DB)',
        'Product Intuition & Direct Customer Empathy',
        'Tenacity Under Shifting Requirements'
      ],
      keyRisk: 'Fast-paced pivots and high market exposure.',
      strategicAdvantage: 'High equity ownership, massive scope of responsibility, rapid technical mastery.'
    }
  ];

  // 7. Recommended Targeted Sprints
  const recommendedSprints = [
    {
      sprint: 'Sprint 1: Remedial Gap Closure',
      focus: `Resolve remaining ${Math.max(1, 4 - gapsResolvedCount)} high-priority diagnostic blind spots`,
      impact: '+12% Placement Probability'
    },
    {
      sprint: 'Sprint 2: Mock Interview Defense',
      focus: `Elevate technical STAR communication from ${interviewScoreTarget}% to 90%+`,
      impact: '+₹3–5 LPA Starting Bracket'
    },
    {
      sprint: 'Sprint 3: Proof-of-Work Verification',
      focus: 'Publish 1 production-grade capstone with SHA-256 evidence to Vault',
      impact: 'Unlocks Tier-1 Recruiter Radar'
    }
  ];

  return {
    overallMarketReadiness,
    recruiterAppealTier,
    projectedCtcBracket,
    estimatedMonthsToOffer,
    weeklyEffortHours,
    paths,
    recommendedSprints
  };
}

// ============================================================================
// 4. CURRICULUM GAPS MATRIX & INTERACTIVE BRIDGE
// ============================================================================

export interface CategorizedGap {
  id: string;
  name: string;
  tier: 'Critical Blocker' | 'Competitive Differentiator' | 'Enterprise Specialization';
  description: string;
  impactOnPlacement: string;
  targetCourseId: string;
  questQuery: string;
  quickCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export function getCategorizedGaps(
  targetRole: string = 'Software Engineer',
  weakAreas: string[] = [],
  jdMissingSkills: string[] = []
): CategorizedGap[] {
  const combined = Array.from(new Set([...weakAreas, ...jdMissingSkills]));

  // If no gaps detected, supply standard high-value curriculum benchmarks
  const effectiveGaps = combined.length > 0 
    ? combined 
    : ['System Design Fundamentals', 'PostgreSQL Datastore', 'Behavioral STAR Method', 'Asynchronous State Concurrency'];

  return effectiveGaps.map((gapKey, idx) => {
    const humanized = humanizeAssessmentGap(gapKey);
    let tier: CategorizedGap['tier'] = 'Critical Blocker';
    if (idx === 1) tier = 'Competitive Differentiator';
    else if (idx > 1) tier = 'Enterprise Specialization';

    return {
      id: `gap_cat_${idx}_${gapKey}`,
      name: humanized.title,
      tier,
      description: humanized.rootCause,
      impactOnPlacement: tier === 'Critical Blocker' 
        ? '⚠️ High Risk: Candidate disqualified in technical phone screen if unresolved.'
        : tier === 'Competitive Differentiator'
          ? '⚡ High Impact: Elevates candidate into top 15% interview shortlist.'
          : '💎 Bonus: Boosts base compensation bracket by ₹2-4 LPA.',
      targetCourseId: 'course-react-web',
      questQuery: humanized.title,
      quickCheck: {
        question: humanized.drill.question,
        options: humanized.drill.options.map(o => o.label),
        correctIndex: humanized.drill.options.findIndex(o => o.isCorrect),
        explanation: humanized.drill.options.find(o => o.isCorrect)?.explanation || 'Verified core invariant.'
      }
    };
  });
}

// ============================================================================
// 5. TRACK-AWARE CONCEPT DECKS FOR SPACED MEMORY (FSRS)
// ============================================================================

export interface ConceptDeckSeed {
  id: string;
  course: string;
  topic: string;
  question: string;
  answer: string;
}

export const MULTI_TRACK_CONCEPT_DECKS: Record<string, ConceptDeckSeed[]> = {
  frontend: [
    {
      id: 'c_react_hooks_rule',
      course: 'Full-Stack React Web Development',
      topic: 'React Hooks Invariant',
      question: 'Why must React Hooks only be called at the top level of a component?',
      answer: 'React relies on the call order of hooks across renders to preserve state indices in fiber nodes. Calling hooks inside loops or conditions alters the call sequence, causing state desynchronization.'
    },
    {
      id: 'c_rsc_boundary',
      course: 'Full-Stack React Web Development',
      topic: 'Server Components Boundary',
      question: 'What is the primary architectural purpose of the "use client" directive in Next.js 14?',
      answer: 'It defines the boundary between Server Components and Client Components in the component tree, allowing the child tree to use client-side interactive APIs, React hooks, and browser event listeners.'
    },
    {
      id: 'c_virtual_dom_diffing',
      course: 'Full-Stack React Web Development',
      topic: 'Virtual DOM Reconciliation',
      question: 'Why is using array index as a "key" prop an anti-pattern when rendering dynamic lists in React?',
      answer: 'When items are reordered, inserted, or deleted, index keys cause React to mistakenly associate existing component state with the wrong elements, leading to subtle rendering bugs and unnecessary DOM mutations.'
    }
  ],

  backend: [
    {
      id: 'c_cap_theorem',
      course: 'Distributed Systems',
      topic: 'CAP Theorem Invariant',
      question: 'During a network partition in a distributed system, what trade-off must be chosen according to CAP?',
      answer: 'The system must choose between Consistency (returning an error/refusing writes when nodes are partitioned) or Availability (accepting writes on reachable nodes that may return stale data).'
    },
    {
      id: 'c_db_b_tree',
      course: 'Database Engineering',
      topic: 'B-Tree Indexing',
      question: 'Why are B-Trees preferred over Binary Search Trees for on-disk database indexes?',
      answer: 'B-Trees have high branching factors (wide nodes matching disk block sizes), which drastically reduces tree height and disk I/O seek operations compared to deep binary search trees.'
    },
    {
      id: 'c_acid_isolation',
      course: 'Database Engineering',
      topic: 'ACID Isolation Levels',
      question: 'What phenomenon does "Repeatable Read" isolation prevent that "Read Committed" does not?',
      answer: 'Non-repeatable reads (where reading the same row twice within the same transaction returns different data because another committed transaction modified it).'
    }
  ],

  commerce: [
    {
      id: 'c_dual_aspect_accounting',
      course: 'Accounting & Forensic Bookkeeping',
      topic: 'Dual Aspect Principle',
      question: 'What is the foundational invariant of the Dual Aspect Accounting equation?',
      answer: 'Assets = Liabilities + Equity. Every business transaction must have an equal and offsetting debit and credit entry so that the balance sheet remains in perpetual equilibrium.'
    },
    {
      id: 'c_audit_materiality',
      course: 'Statutory Audit & Assurance',
      topic: 'Audit Materiality Invariant',
      question: 'How does an auditor distinguish between an immaterial error and a material misstatement?',
      answer: 'A misstatement is material if, individually or in aggregate, it could reasonably be expected to influence the economic decisions of users taken on the basis of the financial statements.'
    }
  ]
};

export function createFSRSCardFromMistake(mistake: HumanizedMistake): {
  id: string;
  topic: string;
  question: string;
  answer: string;
  course: string;
  fsrs: FSRSCard;
} {
  return {
    id: `fsrs_${mistake.rawKey}_${Date.now()}`,
    topic: mistake.drill.fsrsDeckItem.topic,
    question: mistake.drill.fsrsDeckItem.question,
    answer: mistake.drill.fsrsDeckItem.answer,
    course: mistake.drill.fsrsDeckItem.course,
    fsrs: createEmptyCard(`fsrs_${mistake.rawKey}_${Date.now()}`)
  };
}
