import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export interface GeneratedProject {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Enterprise' | 'Future-Tech';
  description: string;
  techStack: string;
  problem: string;
  deliverable: string;
  xpReward: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  guideSteps: string[];
  tips: string[];
  verificationReqs: string[];
  minScore: number;
}

const XP_MAP: Record<string, number> = {
  'Beginner': 250,
  'Intermediate': 500,
  'Advanced': 750,
  'Enterprise': 1000,
  'Future-Tech': 1500,
};

function getDomainFallback(goal: string, skills: string[]): GeneratedProject[] {
  const g = goal.toLowerCase();
  const skillsStr = skills.join(', ') || 'Modern Engineering Tools';

  if (g.includes('frontend') || g.includes('ui') || g.includes('react') || g.includes('web')) {
    return [
      {
        id: 'proj-1',
        name: 'Component Design System & Documentation Site',
        level: 'Beginner',
        description: 'Accessible, token-driven component library with dark mode, keyboard navigation, and interactive Storybook.',
        techStack: 'React, TypeScript, Tailwind CSS, Storybook, Radix UI',
        problem: 'Inconsistent UI styling across multi-page enterprise dashboards confuses users and increases tech debt.',
        deliverable: 'Reusable NPM-ready UI library with 10+ core components, accessibility audits, and interactive doc viewer.',
        xpReward: 250,
        status: 'Not Started',
        guideSteps: [
          'Configure Vite + React + TypeScript with strict ESLint and Tailwind styling tokens.',
          'Build accessible atomic primitives (Button, Modal, Input, Toast) following WAI-ARIA patterns.',
          'Add Storybook with controls, interaction tests, and color contrast accessibility add-ons.',
          'Package as an installable ESM module with comprehensive README and typed exports.'
        ],
        tips: [
          'Ensure full keyboard navigability with Esc key dismissal and focus trapping on modals.',
          'Use CSS variables for theme tokens to enable instantaneous runtime dark mode toggling.'
        ],
        verificationReqs: ['Zero WCAG AA contrast violations', 'Interactive Storybook documentation', '100% TypeScript typed props', 'Clean README documentation'],
        minScore: 80
      },
      {
        id: 'proj-2',
        name: 'Real-Time Collaborative Kanban Workspace',
        level: 'Intermediate',
        description: 'Drag-and-drop project board with live multiplayer presence, optimistic UI updates, and conflict resolution.',
        techStack: 'Next.js, TypeScript, Zustand, dnd-kit, Supabase Realtime',
        problem: 'Team task boards suffer from stale data and jarring layout jumps when multiple users edit concurrently.',
        deliverable: 'Multi-column Kanban board supporting subtasks, live user avatars, drag-drop column reordering, and undo/redo.',
        xpReward: 500,
        status: 'Not Started',
        guideSteps: [
          'Design fluid drag-and-drop interactions with @dnd-kit/core including pointer and touch sensors.',
          'Implement optimistic state updates with rollback on network failure via Zustand.',
          'Subscribe to Supabase Realtime broadcast channels to broadcast card position changes live.',
          'Add keyboard shortcuts (Ctrl+Z for undo, Space to pick card) for power productivity.'
        ],
        tips: [
          'Debounce rapid drag movements before dispatching network sync payloads.',
          'Store offline drafts in localStorage so user work is never lost during internet disconnects.'
        ],
        verificationReqs: ['Smooth 60fps drag animations', 'Optimistic UI with error rollback', 'Multi-client WebSocket presence sync', 'Responsive mobile layout'],
        minScore: 80
      },
      {
        id: 'proj-3',
        name: 'High-Throughput Virtualized Data Grid',
        level: 'Advanced',
        description: 'Performant grid rendering 100,000+ data rows with inline editing, multi-column sorting, and canvas charts.',
        techStack: 'React, TanStack Virtual, Web Workers, Chart.js, TypeScript',
        problem: 'Rendering dense financial tables in DOM causes severe page freezes and memory leaks.',
        deliverable: 'Virtualized table component supporting custom cell renderers, CSV export, and Web Worker sorting.',
        xpReward: 750,
        status: 'Not Started',
        guideSteps: [
          'Implement windowed DOM virtualization rendering only elements in the current viewport.',
          'Offload heavy dataset sorting, filtering, and aggregation to background Web Workers.',
          'Add sticky column headers, resizable columns, and keyboard cell navigation.',
          'Integrate Canvas micro-charts inside cells to visualize trends without DOM bloat.'
        ],
        tips: [
          'Never mutate original dataset objects inside sorting worker threads.',
          'Use requestAnimationFrame to throttle viewport scroll recalculations.'
        ],
        verificationReqs: ['Zero dropped frames on 100k rows', 'Web Worker offloading verification', 'Dynamic column resizing and sorting', 'Unit test coverage for state manager'],
        minScore: 80
      },
      {
        id: 'proj-4',
        name: 'Micro-Frontend Host & Isolated Plugin Runtime',
        level: 'Enterprise',
        description: 'Module Federation architecture hosting independently deployed micro-apps with shared state and sandboxed CSS.',
        techStack: 'Webpack 5 Module Federation, Next.js, Shadow DOM, TypeScript',
        problem: 'Monolithic frontend builds take 30+ minutes and block independent feature teams from deploying.',
        deliverable: 'Host shell orchestrating 3 independent micro-frontend remotes with shared auth context and circuit breaker.',
        xpReward: 1000,
        status: 'Not Started',
        guideSteps: [
          'Configure Webpack 5 Module Federation with shared singleton dependencies (React, React-DOM).',
          'Create a resilient dynamic remote loader with retry mechanism and graceful error boundaries.',
          'Enforce style isolation across micro-apps using Shadow DOM and scoped CSS custom properties.',
          'Build an event-bus bridge for cross-microfrontend message dispatching.'
        ],
        tips: [
          'Verify shared dependency version mismatches before booting remote federated containers.',
          'Wrap every remote container in a React Error Boundary with fallback UI.'
        ],
        verificationReqs: ['Decoupled remote container loading', 'Isolated style scoping verified', 'Cross-app event pub/sub bridge', 'Graceful failure fallback UI'],
        minScore: 80
      },
      {
        id: 'proj-5',
        name: 'WASM-Powered Vector Graphics Editor',
        level: 'Future-Tech',
        description: 'In-browser vector drawing engine executing bezier curve tessellation and Boolean ops via Rust WebAssembly.',
        techStack: 'Rust, WebAssembly, HTML5 Canvas / WebGL, TypeScript',
        problem: 'JavaScript canvas calculations struggle with complex path clipping and high-precision SVG booleans.',
        deliverable: 'Web app with layer tree, pen tool, path union/intersection, and 120fps zoom/pan viewport.',
        xpReward: 1500,
        status: 'Not Started',
        guideSteps: [
          'Write core geometric algorithms (bezier subdividing, path offsetting) in Rust with wasm-bindgen.',
          'Compile Rust core to WebAssembly and expose zero-copy memory buffers to TypeScript.',
          'Build WebGL/Canvas viewport rendering loop capable of smooth infinite zoom and pan.',
          'Export production-clean SVG and binary vector formats.'
        ],
        tips: [
          'Pass flat typed arrays between Rust and JS to eliminate JSON serialization overhead.',
          'Use transform matrices for camera pan/zoom rather than recalculating all vertex coordinates.'
        ],
        verificationReqs: ['Rust WASM compiled binary included', 'Smooth 60-120fps canvas rendering', 'Path Boolean intersection logic', 'Clean SVG export capability'],
        minScore: 80
      }
    ];
  }

  if (g.includes('cyber') || g.includes('security') || g.includes('infosec') || g.includes('pen')) {
    return [
      {
        id: 'proj-1',
        name: 'Argon2 Authentication & Brute-Force Shield',
        level: 'Beginner',
        description: 'Hardened user auth service implementing Argon2id hashing, progressive delays, and CAPTCHA escalation.',
        techStack: 'Node.js, Express, Argon2, Redis, TypeScript',
        problem: 'Legacy MD5/bcrypt implementations with missing rate-limits are easily broken by credential stuffing botnets.',
        deliverable: 'Auth API rejecting dictionary attacks, enforcing password entropy, and rotating session identifiers.',
        xpReward: 250,
        status: 'Not Started',
        guideSteps: [
          'Configure Argon2id with recommended memory and time cost parameters.',
          'Implement Redis sliding window rate-limiting for IP and account identifiers.',
          'Build secure HTTP-only cookies with SameSite=Strict and CSRF double-submit tokens.',
          'Add automated test suite asserting lockout after 5 consecutive failed attempts.'
        ],
        tips: [
          'Use constant-time string comparisons to prevent side-channel timing attacks.',
          'Log security events with masked PII to simplify SIEM ingestion.'
        ],
        verificationReqs: ['Argon2id hashing verified', 'Sliding-window rate limiter active', 'CSRF protection enforced', 'Automated brute-force test suite'],
        minScore: 80
      },
      {
        id: 'proj-2',
        name: 'Asymmetric JWT Identity Provider Server',
        level: 'Intermediate',
        description: 'OAuth2/OIDC compatible identity microservice signing RS256 tokens with automated key rotation and JWKS endpoint.',
        techStack: 'TypeScript, Jose, PostgreSQL, Docker',
        problem: 'Hardcoded symmetric JWT secrets leaked in client bundles allow attackers to forge admin tokens.',
        deliverable: 'Identity provider issuing short-lived signed tokens and exposing a public JWKS endpoint for microservices.',
        xpReward: 500,
        status: 'Not Started',
        guideSteps: [
          'Generate 2048-bit RSA key pairs with automated 30-day rotation schedule.',
          'Expose /.well-known/jwks.json public key discovery endpoint with Cache-Control headers.',
          'Issue signed claims with strictly validated iss, aud, exp, and sub standard claims.',
          'Implement instant token revocation blacklist via distributed Redis key-value store.'
        ],
        tips: [
          'Never accept the algorithm: none header during token validation.',
          'Keep access token lifetime under 15 minutes and require refresh tokens for renewal.'
        ],
        verificationReqs: ['RS256 asymmetric signing', 'JWKS discovery endpoint active', 'Token revocation blacklist', 'Dockerized deployment setup'],
        minScore: 80
      },
      {
        id: 'proj-3',
        name: 'Zero-Trust WAF & API Reputation Gateway',
        level: 'Advanced',
        description: 'Reverse proxy inspecting HTTP request bodies for SQLi, XSS, and command injections with live IP reputation scoring.',
        techStack: 'Go, Nginx, Redis, Lua, Scapy',
        problem: 'Cloud microservices expose internal endpoints without validating deep payload contents or client reputation.',
        deliverable: 'Reverse proxy middleware blocking OWASP Top 10 exploits and maintaining dynamically generated threat blocklists.',
        xpReward: 750,
        status: 'Not Started',
        guideSteps: [
          'Build streaming request body inspector detecting regex patterns for SQL injection and XSS.',
          'Compute client reputation scores using request frequency, ASN headers, and known proxy lists.',
          'Implement dynamic ban trigger returning 429/403 with cryptographic challenge verification.',
          'Stream structured security audit logs to ElasticSearch or ClickHouse.'
        ],
        tips: [
          'Normalize encoded unicode strings before running regex inspection to catch evasion tactics.',
          'Keep WAF processing latency under 5ms per request.'
        ],
        verificationReqs: ['OWASP Top 10 payload rejection tests', 'Dynamic IP reputation scoring', 'Sub-5ms inspection benchmark', 'Structured JSON audit logging'],
        minScore: 80
      },
      {
        id: 'proj-4',
        name: 'Distributed Network Intrusion Detection System (IDS)',
        level: 'Enterprise',
        description: 'Packet sniffer analyzing network traffic for port scans, SYN floods, and DNS tunneling with automated alerting.',
        techStack: 'Go, eBPF / PCAP, ClickHouse, Docker, Grafana',
        problem: 'Perimeter firewalls remain blind to lateral movement once an attacker gains access to an internal subnet.',
        deliverable: 'Distributed agent capturing packet metadata, calculating flow entropy, and alerting on anomalies via webhook.',
        xpReward: 1000,
        status: 'Not Started',
        guideSteps: [
          'Write packet capture listener reading TCP/UDP headers using eBPF or libpcap.',
          'Calculate Shannon entropy on DNS query labels to identify DNS tunneling data exfiltration.',
          'Aggregate connection metrics in ClickHouse column-store for lightning-fast forensic queries.',
          'Create Grafana monitoring dashboard with real-time threat map and alert triggers.'
        ],
        tips: [
          'Drop packet payloads immediately after parsing headers to preserve compliance and storage.',
          'Tune detection thresholds using baseline statistics to prevent alert fatigue.'
        ],
        verificationReqs: ['Live packet header capture engine', 'DNS tunneling detection algorithm', 'ClickHouse analytics integration', 'Alert notification webhook'],
        minScore: 80
      },
      {
        id: 'proj-5',
        name: 'Homomorphic Cryptographic Audit Vault',
        level: 'Future-Tech',
        description: 'Zero-knowledge database proxy executing queries on encrypted records without ever decrypting plaintext in memory.',
        techStack: 'Rust, TenSEAL / Concrete, WebAssembly, SQLite',
        problem: 'Database administrators and compromised cloud providers have unrestricted read access to sensitive customer PII.',
        deliverable: 'Rust service allowing statistical queries (sum, average, count) on fully homomorphic encrypted columns.',
        xpReward: 1500,
        status: 'Not Started',
        guideSteps: [
          'Implement BFV or CKKS homomorphic encryption scheme using Rust cryptographic libraries.',
          'Construct query evaluator computing encrypted arithmetic operations without private key.',
          'Design client-side decryption tool verifying query integrity using zero-knowledge proofs.',
          'Benchmark query execution overhead against standard plaintext database engines.'
        ],
        tips: [
          'Scale encrypted vector coefficients appropriately to prevent ciphertext noise overflow.',
          'Package client cryptography modules into WebAssembly for browser-side verification.'
        ],
        verificationReqs: ['Homomorphic encrypted query execution', 'Zero plaintext leakage on server', 'Rust test suite with 100% pass', 'Client-side verification utility'],
        minScore: 80
      }
    ];
  }

  if (g.includes('devops') || g.includes('cloud') || g.includes('sre') || g.includes('infrastructure')) {
    return [
      {
        id: 'proj-1',
        name: 'Multi-Stage Docker Microservice Pipeline',
        level: 'Beginner',
        description: 'Optimized, scratch-based containerization pipeline with vulnerability scanning and GitHub Actions CI.',
        techStack: 'Docker, GitHub Actions, Trivy, Make, Bash',
        problem: 'Bloated 1GB+ container images slow down cluster autoscaling and expose thousands of CVE vulnerabilities.',
        deliverable: 'Automated CI workflow building sub-50MB production containers with zero critical security CVEs.',
        xpReward: 250,
        status: 'Not Started',
        guideSteps: [
          'Write multi-stage Dockerfiles separating build dependencies from minimal distroless runtime images.',
          'Integrate Trivy container scanning in GitHub Actions to block builds with critical CVEs.',
          'Implement Docker layer caching to speed up CI turnaround from 10 minutes to 45 seconds.',
          'Add non-root user execution and read-only root filesystems for container hardening.'
        ],
        tips: [
          'Always pin exact base image digest hashes instead of using mutable tags like :latest.',
          'Keep .dockerignore thorough to exclude local node_modules, .git, and secrets.'
        ],
        verificationReqs: ['Sub-50MB production container image', 'Zero high/critical CVEs on Trivy scan', 'Automated GitHub Actions CI passing', 'Non-root user container configuration'],
        minScore: 80
      },
      {
        id: 'proj-2',
        name: 'Infrastructure-as-Code AWS/GCP Multi-Tier VPC',
        level: 'Intermediate',
        description: 'Modular Terraform repository deploying a highly-available VPC with public/private subnets and NAT gateways.',
        techStack: 'Terraform, AWS/LocalStack, TFLint, Terratest',
        problem: 'Manual cloud console clicks create configuration drift and disaster recovery failure points.',
        deliverable: 'Idempotent Terraform modules creating an isolated multi-AZ network with automated state locking.',
        xpReward: 500,
        status: 'Not Started',
        guideSteps: [
          'Design reusable Terraform modules for VPC, public/private subnets, and route tables.',
          'Configure remote S3/GCS state storage with DynamoDB state locking to prevent concurrent writes.',
          'Validate configurations using TFLint and enforce security checks with tfsec.',
          'Write Terratest integration tests verifying network reachability across subnets.'
        ],
        tips: [
          'Never commit terraform.tfstate or secret credential variables to Git.',
          'Use LocalStack for zero-cost local integration testing.'
        ],
        verificationReqs: ['Modular Terraform structure', 'Remote backend with state locking', 'TFLint and tfsec clean passes', 'Comprehensive architecture diagram in README'],
        minScore: 80
      },
      {
        id: 'proj-3',
        name: 'Kubernetes GitOps Continuous Delivery Operator',
        level: 'Advanced',
        description: 'GitOps deployment system using ArgoCD and custom Helm charts with progressive canary rollouts.',
        techStack: 'Kubernetes, ArgoCD, Helm, Argo Rollouts, Prometheus',
        problem: 'Big-bang deployments cause cluster-wide outages and lack automated rollback capabilities.',
        deliverable: 'Production Kubernetes manifests deploying microservices with automated metric-based canary promotion.',
        xpReward: 750,
        status: 'Not Started',
        guideSteps: [
          'Package microservice manifests into parameterized Helm charts with values schemas.',
          'Configure ArgoCD Application CRDs watching Git repository changes for auto-sync.',
          'Deploy Argo Rollouts with Prometheus metric analysis step (success rate > 99.5%).',
          'Simulate error injection to verify automatic canary abort and traffic rollback.'
        ],
        tips: [
          'Set explicit resource requests and limits on all container pods to prevent OOMKills.',
          'Configure pod disruption budgets to maintain availability during node drain events.'
        ],
        verificationReqs: ['Parameterized Helm chart', 'ArgoCD GitOps synchronization', 'Automated canary rollback on high error rate', 'Prometheus monitoring dashboard'],
        minScore: 80
      },
      {
        id: 'proj-4',
        name: 'Distributed Observability & Tracing Mesh',
        level: 'Enterprise',
        description: 'Full-stack OpenTelemetry instrumentation pipeline collecting traces, metrics, and logs with Grafana Tempo.',
        techStack: 'OpenTelemetry, Jaeger, Grafana, Loki, Prometheus',
        problem: 'Microservice failures create cascade outages with zero visibility into which service caused the original latency spike.',
        deliverable: 'Centralized observability cluster tracing distributed requests end-to-end across multiple microservice hops.',
        xpReward: 1000,
        status: 'Not Started',
        guideSteps: [
          'Instrument microservices using OpenTelemetry SDKs with W3C Trace Context propagation.',
          'Deploy OpenTelemetry Collector gateway with batching, sampling, and scrubbing processors.',
          'Store traces in Grafana Tempo and correlated logs in Grafana Loki.',
          'Build SLI/SLO alerts notifying on p99 latency degradation and error budget burn rate.'
        ],
        tips: [
          'Scrub Authorization headers and sensitive API keys before pushing spans to collectors.',
          'Use tail-based sampling to retain 100% of error traces while sampling success traces.'
        ],
        verificationReqs: ['End-to-end distributed trace propagation', 'OTel Collector configuration with redaction', 'Grafana unified trace/log dashboard', 'Automated SLO burn rate alerts'],
        minScore: 80
      },
      {
        id: 'proj-5',
        name: 'Self-Healing Kubernetes AI Operator',
        level: 'Future-Tech',
        description: 'Custom Kubernetes controller in Go that detects crashloops, diagnoses root causes via log analysis, and auto-patches.',
        techStack: 'Go, Operator SDK, Kubernetes API, Prometheus, Docker',
        problem: 'Engineers get woken up at 3 AM for repetitive pod issues that could be automatically remediated.',
        deliverable: 'CRD-backed controller detecting unhandled panics, capturing core dumps, and auto-scaling or rolling back deployments.',
        xpReward: 1500,
        status: 'Not Started',
        guideSteps: [
          'Bootstrap a Kubernetes Operator using Operator SDK and controller-runtime in Go.',
          'Watch Pod and Event APIs to detect CrashLoopBackOff and OOMKilled events.',
          'Implement remediation engine that adjusts JVM memory flags or rolls back to the last known stable ReplicaSet.',
          'Deploy in a test cluster and execute chaos-engineering tests to prove self-healing.'
        ],
        tips: [
          'Implement rate-limiting on remediation actions to prevent infinite flapping loops.',
          'Emit structured Kubernetes Events on all controller actions for full auditability.'
        ],
        verificationReqs: ['Custom Resource Definition (CRD) and Go controller', 'Automatic detection of CrashLoopBackOff', 'Self-healing rollback test passing', 'Unit tests using envtest framework'],
        minScore: 80
      }
    ];
  }

  // Default: Full Stack / Backend / Distributed Systems
  return [
    {
      id: 'proj-1',
      name: 'Idempotent Payment Webhook Broker',
      level: 'Beginner',
      description: 'Production-grade webhook receiver verifying cryptographic signatures, ensuring exactly-once processing.',
      techStack: 'Node.js / Go, PostgreSQL, Redis, Stripe CLI',
      problem: 'Unverified or duplicate payment webhooks trigger double charges and corrupt database billing states.',
      deliverable: 'Webhook microservice with HMAC verification, Redis idempotency locks, and transaction audit logs.',
      xpReward: 250,
      status: 'Not Started',
      guideSteps: [
        'Build HTTP endpoint verifying HMAC-SHA256 signature headers with raw request bodies.',
        'Use Redis distributed setNX locks with idempotency keys to reject duplicate deliveries.',
        'Wrap database updates inside ACID transactions with retry backoff logic.',
        'Create integration test suite simulating out-of-order and duplicate webhook events.'
      ],
      tips: [
        'Always respond with HTTP 200 within 2 seconds and process heavy fulfillment in background queues.',
        'Store the raw payload for audit compliance and debugging.'
      ],
      verificationReqs: ['HMAC cryptographic signature validation', 'Redis idempotency lock implementation', 'ACID transaction handling', 'Comprehensive test suite for duplicate requests'],
      minScore: 80
    },
    {
      id: 'proj-2',
      name: 'High-Concurrency Distributed Inventory Engine',
      level: 'Intermediate',
      description: 'Flash-sale inventory service with pessimistic and optimistic locking preventing overselling under heavy load.',
      techStack: 'Go / Node.js, Redis Lua scripts, PostgreSQL, k6',
      problem: 'Concurrent checkout spikes during product drops cause overselling and negative inventory balances.',
      deliverable: 'REST API service handling 5,000+ checkout requests/sec with zero inventory race conditions.',
      xpReward: 500,
      status: 'Not Started',
      guideSteps: [
        'Implement atomic inventory decrement using Redis Lua scripts for sub-millisecond checks.',
        'Design PostgreSQL fallback with SELECT FOR UPDATE row-level locking.',
        'Build reconciliation cron job syncing Redis in-memory counts with durable SQL storage.',
        'Run k6 distributed load tests proving zero stock discrepancies under 5,000 req/sec.'
      ],
      tips: [
        'Use Redis Lua scripts to evaluate stock and deduct in a single atomic non-blocking operation.',
        'Set up automated dead-letter queues for failed checkout reconciliation events.'
      ],
      verificationReqs: ['Atomic Lua inventory decrement', 'Pessimistic DB lock fallback', 'k6 load test report showing zero race conditions', 'Docker-compose local reproduction'],
      minScore: 80
    },
    {
      id: 'proj-3',
      name: 'Event-Driven Microservices Order Pipeline',
      level: 'Advanced',
      description: 'Distributed saga pattern coordinating Order, Payment, and Shipping services over RabbitMQ/Kafka.',
      techStack: 'Go / Spring Boot, RabbitMQ / Kafka, Docker Compose, PostgreSQL',
      problem: 'Monolithic synchronous HTTP requests fail completely when any downstream microservice experiences downtime.',
      deliverable: 'Fleet of 3 decoupled microservices executing distributed transactions with automated compensating rollbacks.',
      xpReward: 750,
      status: 'Not Started',
      guideSteps: [
        'Design choreography-based Saga workflow with Order, Payment, and Fulfillment topics.',
        'Implement transactional outbox pattern to ensure reliable message publishing.',
        'Build compensating transaction handlers that refund payments and restore inventory on failure.',
        'Package the entire ecosystem in docker-compose with healthchecks.'
      ],
      tips: [
        'Ensure all consumer event handlers are idempotent to handle message redeliveries safely.',
        'Use correlation IDs across all service headers for end-to-end debugging.'
      ],
      verificationReqs: ['Choreographed Saga pattern implementation', 'Transactional Outbox pattern', 'Compensating transaction rollback verification', 'Docker-compose orchestration script'],
      minScore: 80
    },
    {
      id: 'proj-4',
      name: 'CQRS & Real-Time Event Ledger Architecture',
      level: 'Enterprise',
      description: 'High-throughput financial ledger separating write commands from read models using Kafka and Elasticsearch.',
      techStack: 'Go / Java, Apache Kafka, Elasticsearch, PostgreSQL, Redis',
      problem: 'Running heavy analytic queries directly against the transactional OLTP ledger degrades checkout response times.',
      deliverable: 'Scalable CQRS architecture synchronizing ledger events to optimized read projections in under 100ms.',
      xpReward: 1000,
      status: 'Not Started',
      guideSteps: [
        'Implement immutable event-sourced ledger model storing all balance adjustments.',
        'Publish financial transaction events to partitioned Kafka topics.',
        'Build streaming consumer populating Elasticsearch and Redis read-side views.',
        'Benchmark command ingestion throughput and projection sync latency under heavy load.'
      ],
      tips: [
        'Never permit direct SQL UPDATE statements on the event ledger; all modifications must be appended events.',
        'Implement snapshotting to avoid replaying millions of historical events on consumer restart.'
      ],
      verificationReqs: ['Strict CQRS separation of read/write paths', 'Kafka event streaming pipeline', 'Sub-100ms read projection synchronization', 'Audit trail verification tests'],
      minScore: 80
    },
    {
      id: 'proj-5',
      name: 'Edge-Routing Multi-Region Cache Proxy',
      level: 'Future-Tech',
      description: 'Global proxy running on edge workers routing user queries to the lowest-latency regional database replica.',
      techStack: 'Cloudflare Workers / Rust WASM, DynamoDB Global Tables / CockroachDB',
      problem: 'Global users experience high roundtrip latency when querying single centralized US/EU databases.',
      deliverable: 'WASM edge middleware with geo-DNS routing, JWT session caching, and stale-while-revalidate caches.',
      xpReward: 1500,
      status: 'Not Started',
      guideSteps: [
        'Write edge request handler in Rust compiled to WebAssembly for sub-5ms execution.',
        'Parse incoming request geolocation headers to route to the nearest database read-replica.',
        'Implement cache-control strategies with stale-while-revalidate and edge KV caching.',
        'Benchmark latency reductions across 5 global regions using synthetic monitoring.'
      ],
      tips: [
        'Keep the WASM bundle size under 1MB to ensure near-zero cold start overhead.',
        'Use cryptographic verification of session cookies directly at the edge layer.'
      ],
      verificationReqs: ['Compiled Rust WebAssembly binary', 'Geo-based routing logic', 'Stale-while-revalidate edge cache implementation', 'Global latency benchmark report'],
      minScore: 80
    }
  ];
}

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    // Allow guest mode preview if auth header is not provided, but record if authenticated
    const userId = gated.user ? gated.user.id : 'guest';

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const goal = String(body.goal || 'Full Stack Engineer').trim();
    const skills = Array.isArray(body.skills) ? body.skills.map((s: any) => String(s).trim()).filter(Boolean) : [];
    const education = String(body.education || '').trim();
    const experienceLevel = String(body.experienceLevel || '').trim();

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }

    const hasKeys = !!openRouterKey || groqKeys.length > 0;

    if (hasKeys) {
      try {
        const systemPrompt = "You are an expert Principal Software Architect and Career Mentor at a top tech company.\n" +
"The candidate has the career goal: " + JSON.stringify(goal) + ".\n" +
"Current skills: " + (skills.length > 0 ? skills.join(', ') : 'Not specified') + ".\n" +
"Education: " + (education || 'Engineering / Computer Science') + ".\n" +
"Experience: " + (experienceLevel || 'Student / Early Career') + ".\n\n" +
"Generate a sequence of EXACTLY 5 progressive capstone projects that will get this candidate hired for this role:\n" +
"1. Beginner (Level: 'Beginner', xpReward: 250)\n" +
"2. Intermediate (Level: 'Intermediate', xpReward: 500)\n" +
"3. Advanced (Level: 'Advanced', xpReward: 750)\n" +
"4. Enterprise (Level: 'Enterprise', xpReward: 1000)\n" +
"5. Future-Tech (Level: 'Future-Tech', xpReward: 1500)\n\n" +
"OUTPUT FORMAT: Return ONLY a valid JSON array of 5 objects matching this schema with NO markdown wrapping, NO commentary:\n" +
"[\n" +
"  {\n" +
"    \"id\": \"proj-1\",\n" +
"    \"name\": \"Project Name\",\n" +
"    \"level\": \"Beginner\",\n" +
"    \"description\": \"2 sentence clear summary\",\n" +
"    \"techStack\": \"Tech1, Tech2, Tech3\",\n" +
"    \"problem\": \"Real-world engineering problem this project solves\",\n" +
"    \"deliverable\": \"Tangible software artifact and output\",\n" +
"    \"xpReward\": 250,\n" +
"    \"status\": \"Not Started\",\n" +
"    \"guideSteps\": [\"Step 1\", \"Step 2\", \"Step 3\", \"Step 4\"],\n" +
"    \"tips\": [\"Tip 1\", \"Tip 2\"],\n" +
"    \"verificationReqs\": [\"Req 1\", \"Req 2\", \"Req 3\", \"Req 4\"],\n" +
"    \"minScore\": 80\n" +
"  }\n" +
"]";

        let rawResponse = '';
        if (openRouterKey) {
          try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openRouterKey}`,
                'HTTP-Referer': 'https://pinit-careers.web.app',
                'X-Title': 'Pi Career OS Project Generator'
              },
              body: JSON.stringify({
                model: 'qwen/qwen-2.5-coder-32b-instruct',
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: `Synthesize 5 tailored projects for ${goal}. Focus on real engineering problems.` }
                ],
                temperature: 0.3,
                max_tokens: 2200
              })
            });
            if (res.ok) {
              const data = await res.json();
              rawResponse = (data.choices?.[0]?.message?.content || '').trim();
            }
          } catch (e) {
            console.warn('[Project Generator] OpenRouter failed, trying Groq fallback:', e);
          }
        }

        if (!rawResponse && groqKeys.length > 0) {
          for (const key of groqKeys) {
            try {
              const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                  model: 'llama-3.3-70b-versatile',
                  messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Synthesize 5 tailored projects for ${goal}. Focus on real engineering problems.` }
                  ],
                  temperature: 0.3,
                  max_tokens: 2200
                })
              });
              if (res.ok) {
                const data = await res.json();
                rawResponse = (data.choices?.[0]?.message?.content || '').trim();
                if (rawResponse) break;
              }
            } catch (e) {
              console.warn('[Project Generator] Groq key attempt failed:', e);
            }
          }
        }

        if (rawResponse) {
          let cleanJson = rawResponse;
          if (cleanJson.includes('```')) {
            cleanJson = cleanJson.replace(/^[\s\S]*?```(?:json)?/i, '');
            cleanJson = cleanJson.replace(/```[\s\S]*$/, '');
          }
          cleanJson = cleanJson.trim();
          const parsed = JSON.parse(cleanJson);
          if (Array.isArray(parsed) && parsed.length === 5) {
            const levels: GeneratedProject['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Enterprise', 'Future-Tech'];
            const validated: GeneratedProject[] = parsed.map((p, idx) => {
              const level = levels[idx];
              return {
                id: `proj-${idx + 1}`,
                name: String(p.name || `Capstone Project ${idx + 1}`),
                level,
                description: String(p.description || 'Project description'),
                techStack: String(p.techStack || 'TypeScript, React, Node.js'),
                problem: String(p.problem || 'Standard engineering challenge'),
                deliverable: String(p.deliverable || 'Production-grade software system'),
                xpReward: XP_MAP[level] || 250,
                status: 'Not Started',
                guideSteps: Array.isArray(p.guideSteps) && p.guideSteps.length > 0
                  ? p.guideSteps.map(String)
                  : ['Initialize repository', 'Build core logic', 'Add tests and documentation', 'Deploy and verify'],
                tips: Array.isArray(p.tips) && p.tips.length > 0
                  ? p.tips.map(String)
                  : ['Keep git commits atomic', 'Add environment configuration template'],
                verificationReqs: Array.isArray(p.verificationReqs) && p.verificationReqs.length > 0
                  ? p.verificationReqs.map(String)
                  : ['Functional test suite passing', 'README architecture documentation'],
                minScore: typeof p.minScore === 'number' ? Math.max(60, Math.min(100, p.minScore)) : 80
              };
            });

            return NextResponse.json({
              success: true,
              goal,
              source: 'llm',
              projects: validated
            });
          }
        }
      } catch (err) {
        console.warn('[Project Generator] LLM synthesis failed, using domain synthesis fallback:', err);
      }
    }

    // Dynamic Domain Synthesis Fallback
    const fallbackProjects = getDomainFallback(goal, skills);
    return NextResponse.json({
      success: true,
      goal,
      source: 'domain-synthesizer',
      projects: fallbackProjects
    });
  } catch (error: any) {
    console.error('[Project Generator] Error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: error?.message || 'Failed to generate projects' },
      { status: 500 }
    );
  }
}
