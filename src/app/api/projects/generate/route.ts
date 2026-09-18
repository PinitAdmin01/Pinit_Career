import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';

const ProjectGenerateSchema = z.object({
  goal: z.string().max(200).optional().default('Full Stack Engineer'),
  skills: z.array(z.string().max(100)).optional().default([]),
  education: z.string().max(200).optional().default(''),
  experienceLevel: z.string().max(100).optional().default(''),
  stream: z.boolean().optional().default(false),
  preview: z.boolean().optional().default(false),
});

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
  isTemplate?: boolean;
  source?: 'llm' | 'curated_template' | 'custom';
}

const XP_MAP: Record<string, number> = {
  'Beginner': 250,
  'Intermediate': 500,
  'Advanced': 750,
  'Enterprise': 1000,
  'Future-Tech': 1500,
};

// LLM generation timeout raised to 25 seconds for reliable ~2,200 token synthesis
export const LLM_GENERATION_TIMEOUT_MS = 25_000;

export function getDomainFallback(goal: string, skills: string[] = [], experienceLevel: string = ''): GeneratedProject[] {
  const g = goal.toLowerCase();
  const primarySkills = skills.length > 0 ? skills.slice(0, 3).join(', ') : '';
  const isSenior = experienceLevel.toLowerCase().includes('senior') || experienceLevel.toLowerCase().includes('advanced');

  // 1. AI & Machine Learning / Data Science
  if (
    g.includes('ai') ||
    g.includes('machine learning') ||
    g.includes('ml') ||
    g.includes('deep learning') ||
    g.includes('nlp') ||
    g.includes('vision') ||
    g.includes('llm')
  ) {
    const stack1 = primarySkills ? `Python, ${primarySkills}, PyTorch, HuggingFace` : 'Python, PyTorch, HuggingFace Transformers, FastAPI';
    const stack2 = primarySkills ? `Python, ${primarySkills}, LangChain, Qdrant` : 'Python, LangChain, Qdrant, OpenAI / Ollama, FastAPI';
    const stack3 = primarySkills ? `Python, ${primarySkills}, CrewAI, vLLM, Docker` : 'Python, CrewAI, vLLM, Docker, Redis';
    const stack4 = primarySkills ? `PyTorch, ${primarySkills}, Ray, Triton, Kubernetes` : 'PyTorch, Ray Train, Triton Inference Server, Kubernetes, Prometheus';
    const stack5 = primarySkills ? `Rust, ${primarySkills}, WebAssembly, ONNX Runtime` : 'Rust, WebAssembly, ONNX Runtime, WebGPU, TypeScript';

    return [
      {
        id: 'proj-1',
        name: 'Semantic Resume ATS Matching Engine',
        level: 'Beginner',
        description: 'Extract semantic embeddings from student resumes and compare against job descriptions with cosine similarity scoring.',
        techStack: stack1,
        problem: 'Keyword-only matching fails when candidates express equivalent skills using differing technical vocabulary.',
        deliverable: 'FastAPI microservice extracting text from PDFs, computing embeddings, and outputting ranking metrics.',
        xpReward: 250,
        status: 'Not Started',
        guideSteps: [
          'Build PDF document ingestion pipeline extracting clean text and structured sections.',
          'Generate vector representations using sentence-transformers or miniLM embeddings.',
          'Compute cosine similarity metrics between resume embeddings and job requirement vectors.',
          'Expose a clean REST endpoint returning percentage match and missing skill recommendations.'
        ],
        tips: [
          'Pre-process text by stripping markdown artifacts and email signatures before embedding.',
          'Benchmark inference time to keep document analysis under 300ms per resume.'
        ],
        verificationReqs: ['Semantic cosine similarity calculator', 'PDF text extraction module', 'FastAPI REST interface', 'Integration test asserting match thresholds'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-2',
        name: 'RAG Knowledge-Base Assistant with Hybrid Search',
        level: 'Intermediate',
        description: 'Retrieval-Augmented Generation pipeline combining BM25 keyword search with dense vector similarity over technical documentation.',
        techStack: stack2,
        problem: 'Naive vector search frequently retrieves semantically similar but factually incorrect documentation chunks.',
        deliverable: 'Production RAG service implementing reciprocal rank fusion (RRF) reranking and citation attribution.',
        xpReward: 500,
        status: 'Not Started',
        guideSteps: [
          'Chunk technical documentation with recursive character splitters preserving heading hierarchy.',
          'Index chunks into vector database with metadata filtering on library versions.',
          'Implement hybrid retrieval combining BM25 sparse keyword search with dense vector embeddings.',
          'Pass reranked context into LLM prompt with strict groundedness and citation requirements.'
        ],
        tips: [
          'Use sliding-window overlaps (50-100 tokens) between chunks to avoid truncating sentence context.',
          'Log retrieved context to trace potential LLM hallucinations during evaluation.'
        ],
        verificationReqs: ['Hybrid BM25 + dense vector retrieval', 'Document chunking with metadata', 'Prompt citation validation suite', 'Sub-second search retrieval benchmark'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-3',
        name: 'Autonomous Multi-Agent Code Review & Refactoring Fleet',
        level: 'Advanced',
        description: 'Decentralized multi-agent workflow where specialized agents (Security, Performance, Style) review PRs and propose patches.',
        techStack: stack3,
        problem: 'Single-prompt AI reviewers miss architectural security regressions and introduce hallucinated imports.',
        deliverable: 'Autonomous agent coordinator with conflict resolution, tool calling, and automated Git diff generation.',
        xpReward: 750,
        status: 'Not Started',
        guideSteps: [
          'Design specialized agent personas with bounded responsibility schemas (Security, Style, Performance).',
          'Implement inter-agent consensus protocol with an Orchestrator adjudicating conflicting recommendations.',
          'Equip agents with AST-aware linting tools and static analysis sandbox runners.',
          'Format consensus review into automated GitHub PR comment with unified diff patches.'
        ],
        tips: [
          'Bound agent loop execution to a maximum of 4 turns to prevent runaway recursive token spend.',
          'Validate all generated patch diffs against the repository git apply command before output.'
        ],
        verificationReqs: ['Multi-agent consensus protocol', 'Sandboxed AST tool integration', 'Unified diff patch generation', 'Deterministic error recovery on agent failure'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-4',
        name: 'Distributed LLM Inference Gateway with Dynamic Batching',
        level: 'Enterprise',
        description: 'High-throughput LLM gateway coordinating continuous batching, KV cache management, and token rate limiting across GPUs.',
        techStack: stack4,
        problem: 'Sequential LLM inference achieves terrible GPU utilization under bursty concurrent user queries.',
        deliverable: 'Reverse proxy gateway implementing continuous iteration-level batching with p99 latency SLOs.',
        xpReward: 1000,
        status: 'Not Started',
        guideSteps: [
          'Implement iteration-level continuous batching scheduler maximizing GPU compute density.',
          'Design distributed KV cache manager with PagedAttention eviction policies.',
          'Build token-bucket rate limiter tracking user token usage and billing tier budgets.',
          'Collect Prometheus metrics for TTFT (time-to-first-token) and inter-token generation latency.'
        ],
        tips: [
          'Prioritize ongoing generation sequences over incoming queued requests to protect TTFT.',
          'Partition KV caches into fixed-size virtual blocks to prevent memory fragmentation.'
        ],
        verificationReqs: ['Continuous batching queue scheduler', 'Paged KV cache manager', 'Token rate limiting middleware', 'Prometheus TTFT and TPS observability metrics'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-5',
        name: 'On-Device Zero-Knowledge Neural Inference Engine',
        level: 'Future-Tech',
        description: 'Compile neural network models into WebAssembly / WebGPU runtimes to execute private inference entirely inside user browsers.',
        techStack: stack5,
        problem: 'Sending private biometric and medical data to cloud AI servers creates severe GDPR/HIPAA compliance risks.',
        deliverable: 'Zero-cloud client library executing quantized vision/text models in browser with cryptographic proof of compute.',
        xpReward: 1500,
        status: 'Not Started',
        guideSteps: [
          'Quantize transformer weights to 4-bit INT4 representation for sub-50MB browser download.',
          'Compile tensor operations to WebAssembly SIMD and WebGPU compute shaders.',
          'Implement zero-copy memory buffers between JavaScript canvas and WebGPU execution pipelines.',
          'Generate cryptographic hash commitment verifying model weights and computation integrity.'
        ],
        tips: [
          'Use memory-mapped files via Cache API to eliminate duplicate model weight decodes on reload.',
          'Provide fallback CPU SIMD execution path for devices lacking WebGPU support.'
        ],
        verificationReqs: ['WebAssembly / WebGPU compiled runtime', 'INT4 quantized weights model bundle', 'Zero-cloud network isolation verification', 'Client-side inference benchmark (>30 tok/sec)'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      }
    ];
  }

  // 2. Mobile Engineering (Flutter, React Native, iOS, Android)
  if (
    g.includes('mobile') ||
    g.includes('android') ||
    g.includes('ios') ||
    g.includes('flutter') ||
    g.includes('react native') ||
    g.includes('swift') ||
    g.includes('kotlin')
  ) {
    const stack1 = primarySkills ? `React Native / Flutter, ${primarySkills}, SQLite` : 'React Native, TypeScript, SQLite, MMKV, Tailwind';
    const stack2 = primarySkills ? `Flutter / React Native, ${primarySkills}, Mapbox, WebSockets` : 'Flutter, Dart, Mapbox SDK, WebSockets, Background Services';
    const stack3 = primarySkills ? `React Native, ${primarySkills}, Libsodium, Signal Protocol` : 'React Native, Libsodium, SQLite Cipher, WebSockets';
    const stack4 = primarySkills ? `Flutter, ${primarySkills}, BLE CoreBluetooth, SQLite` : 'Flutter, Dart, BLE Protocol, SQLite, WorkManager';
    const stack5 = primarySkills ? `React Native / Kotlin, ${primarySkills}, TFLite, WebAssembly` : 'React Native, TensorFlow Lite, CameraX, WebAssembly';

    return [
      {
        id: 'proj-1',
        name: 'Local-First Offline Expense Sync Engine',
        level: 'Beginner',
        description: 'Mobile financial tracking app operating 100% offline with background sync and two-phase conflict resolution.',
        techStack: stack1,
        problem: 'Mobile users in low-connectivity areas experience freezing spinners and lost data when updating budgets.',
        deliverable: 'Offline-first mobile application with instant local UI updates and durable transaction journals.',
        xpReward: 250,
        status: 'Not Started',
        guideSteps: [
          'Configure high-speed embedded database (MMKV / SQLite) for sub-5ms local reads and writes.',
          'Implement append-only change log recording every user transaction with monotonic timestamps.',
          'Build background sync worker executing idempotency-checked delta replication to cloud.',
          'Resolve concurrent updates using Last-Write-Wins and deterministic vector clocks.'
        ],
        tips: [
          'Never block user interaction on remote network confirmations.',
          'Store queued network payloads durably so device reboots never erase offline edits.'
        ],
        verificationReqs: ['Sub-5ms local persistence verification', 'Offline airplane mode CRUD test', 'Deterministic cloud sync reconciliation', 'Automated unit test suite'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-2',
        name: 'Battery-Optimized GPS Fleet & Courier Tracker',
        level: 'Intermediate',
        description: 'Real-time location stream mapping courier transit with Kalman filter smoothing and geofencing triggers.',
        techStack: stack2,
        problem: 'Continuous GPS telemetry drains device battery in under 3 hours if location polling is unthrottled.',
        deliverable: 'Mobile tracking app with adaptive distance-based sensor sampling and animated route interpolation.',
        xpReward: 500,
        status: 'Not Started',
        guideSteps: [
          'Design adaptive GPS listener varying sample rates based on accelerometer motion states.',
          'Apply Kalman filter algorithm to smooth out GPS jitter and inaccurate multipath reflections.',
          'Implement circular and polygonal geofence boundaries triggering automated arrival alerts.',
          'Batch and compress location updates before transmitting over low-bandwidth cellular links.'
        ],
        tips: [
          'Pause high-accuracy GPS listeners when the accelerometer confirms the device is stationary.',
          'Use vector tiles for offline map rendering along predefined courier routes.'
        ],
        verificationReqs: ['Battery consumption benchmark (<3% per hr)', 'Kalman filter trajectory smoothing', 'Geofencing boundary detection tests', 'Offline breadcrumb queue'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-3',
        name: 'End-to-End Encrypted Mobile Messenger with Forward Secrecy',
        level: 'Advanced',
        description: 'Zero-knowledge messaging client implementing the Double Ratchet algorithm and ephemeral self-destructing media.',
        techStack: stack3,
        problem: 'Standard chat apps store plaintext payloads on central servers susceptible to warrant and data breach leaks.',
        deliverable: 'Mobile messaging app guaranteeing cryptographic forward secrecy and encrypted local storage.',
        xpReward: 750,
        status: 'Not Started',
        guideSteps: [
          'Implement X3DH key agreement and Double Ratchet algorithm for session key derivation.',
          'Encrypt message text and media blobs using AES-256-GCM before transmitting over sockets.',
          'Store keys exclusively inside iOS Keychain and Android Keystore hardware enclaves.',
          'Build timer-based ephemeral message shredding with zero-fill memory overwriting.'
        ],
        tips: [
          'Never log unencrypted message text or private key material in device logcats.',
          'Implement biometric authentication before unlocking encryption key enclaves.'
        ],
        verificationReqs: ['Double Ratchet cryptographic handshake', 'Hardware enclave key storage verification', 'Zero-plaintext socket payload audit', 'Ephemeral message memory wipe test'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-4',
        name: 'Industrial Bluetooth Low Energy (BLE) Telemetry Client',
        level: 'Enterprise',
        description: 'Hardware communication app connecting to multiple BLE sensor beacons with automated reconnects and GATT caching.',
        techStack: stack4,
        problem: 'Peripheral disconnects and dropped GATT packets cause dangerous blind spots in factory telemetry.',
        deliverable: 'Resilient BLE client continuously aggregating sensor data and dispatching alerts upon threshold breaches.',
        xpReward: 1000,
        status: 'Not Started',
        guideSteps: [
          'Scan and filter BLE advertising packets by service UUIDs with exponential backoff.',
          'Negotiate MTU size and establish bonded encrypted connections with peripheral devices.',
          'Parse proprietary binary GATT characteristic streams into structured sensor metrics.',
          'Execute background health monitors surviving OS process termination via WorkManager.'
        ],
        tips: [
          'Cache GATT service discoveries locally to avoid redundant roundtrips on reconnection.',
          'Serialize all Bluetooth command queues to avoid peripheral buffer overflows.'
        ],
        verificationReqs: ['Automated BLE reconnect state machine', 'Binary GATT payload decoder', 'Continuous background execution test', 'Local SQLite telemetry audit store'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-5',
        name: 'On-Device Computer Vision Document & Barcode Scanner',
        level: 'Future-Tech',
        description: 'Real-time 60fps camera pipeline detecting document edges, rectifying perspective, and parsing text via on-device NPU.',
        techStack: stack5,
        problem: 'Streaming live camera video feeds to cloud APIs introduces intolerable latency and bandwidth bills.',
        deliverable: 'On-device camera scanner processing 60fps video frames locally with sub-10ms neural inference.',
        xpReward: 1500,
        status: 'Not Started',
        guideSteps: [
          'Stream video frames via CameraX / AVFoundation into GPU texture buffers.',
          'Run edge detection and perspective transform algorithms to flatten skewed paper documents.',
          'Execute INT8 quantized TFLite models on device neural processing units (NPU).',
          'Export high-resolution compressed PDF artifacts with embedded searchable OCR text.'
        ],
        tips: [
          'Drop intermediate video frames if neural inference takes longer than frame presentation interval.',
          'Apply histogram equalization to improve OCR accuracy under low-light conditions.'
        ],
        verificationReqs: ['60fps camera feed processing loop', 'Sub-15ms on-device inference latency', 'Perspective rectification algorithm', 'Zero network permission verification'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      }
    ];
  }

  // 3. Frontend & UI Engineering
  if (
    g.includes('frontend') ||
    g.includes('ui') ||
    g.includes('react') ||
    g.includes('web') ||
    g.includes('next.js') ||
    g.includes('vue') ||
    g.includes('angular')
  ) {
    const stack1 = primarySkills ? `React, TypeScript, ${primarySkills}, Storybook` : 'React, TypeScript, Tailwind CSS, Storybook, Radix UI';
    const stack2 = primarySkills ? `Next.js, TypeScript, ${primarySkills}, Zustand` : 'Next.js, TypeScript, Zustand, dnd-kit, Supabase Realtime';
    const stack3 = primarySkills ? `React, ${primarySkills}, TanStack Virtual, Web Workers` : 'React, TanStack Virtual, Web Workers, Chart.js, TypeScript';
    const stack4 = primarySkills ? `Webpack 5, Next.js, ${primarySkills}, TypeScript` : 'Webpack 5 Module Federation, Next.js, Shadow DOM, TypeScript';
    const stack5 = primarySkills ? `Rust, WebAssembly, ${primarySkills}, WebGL` : 'Rust, WebAssembly, HTML5 Canvas / WebGL, TypeScript';

    return [
      {
        id: 'proj-1',
        name: 'Component Design System & Documentation Site',
        level: 'Beginner',
        description: 'Accessible, token-driven component library with dark mode, keyboard navigation, and interactive Storybook.',
        techStack: stack1,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-2',
        name: 'Real-Time Collaborative Kanban Workspace',
        level: 'Intermediate',
        description: 'Drag-and-drop project board with live multiplayer presence, optimistic UI updates, and conflict resolution.',
        techStack: stack2,
        problem: 'Team task boards suffer from stale data and jarring layout jumps when multiple users edit concurrently.',
        deliverable: 'Multi-column Kanban board supporting subtasks, live user avatars, drag-drop column reordering, and undo/redo.',
        xpReward: 500,
        status: 'Not Started',
        guideSteps: [
          'Design fluid drag-and-drop interactions with @dnd-kit/core including pointer and touch sensors.',
          'Implement optimistic state updates with rollback on network failure via Zustand.',
          'Subscribe to WebSocket broadcast channels to broadcast card position changes live.',
          'Add keyboard shortcuts (Ctrl+Z for undo, Space to pick card) for power productivity.'
        ],
        tips: [
          'Debounce rapid drag movements before dispatching network sync payloads.',
          'Store offline drafts in localStorage so user work is never lost during internet disconnects.'
        ],
        verificationReqs: ['Smooth 60fps drag animations', 'Optimistic UI with error rollback', 'Multi-client WebSocket presence sync', 'Responsive mobile layout'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-3',
        name: 'High-Throughput Virtualized Data Grid',
        level: 'Advanced',
        description: 'Performant grid rendering 100,000+ data rows with inline editing, multi-column sorting, and canvas charts.',
        techStack: stack3,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-4',
        name: 'Micro-Frontend Host & Isolated Plugin Runtime',
        level: 'Enterprise',
        description: 'Module Federation architecture hosting independently deployed micro-apps with shared state and sandboxed CSS.',
        techStack: stack4,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-5',
        name: 'WASM-Powered Vector Graphics Editor',
        level: 'Future-Tech',
        description: 'In-browser vector drawing engine executing bezier curve tessellation and Boolean ops via Rust WebAssembly.',
        techStack: stack5,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      }
    ];
  }

  // 4. Cybersecurity & AppSec
  if (
    g.includes('cyber') ||
    g.includes('security') ||
    g.includes('infosec') ||
    g.includes('pen') ||
    g.includes('appsec') ||
    g.includes('soc')
  ) {
    const stack1 = primarySkills ? `Node.js, ${primarySkills}, Argon2, Redis` : 'Node.js, Express, Argon2, Redis, TypeScript';
    const stack2 = primarySkills ? `TypeScript, ${primarySkills}, Jose, PostgreSQL` : 'TypeScript, Jose, PostgreSQL, Docker';
    const stack3 = primarySkills ? `Go, ${primarySkills}, Redis, Lua, Nginx` : 'Go, Nginx, Redis, Lua, Scapy';
    const stack4 = primarySkills ? `Go, ${primarySkills}, eBPF, ClickHouse` : 'Go, eBPF / PCAP, ClickHouse, Docker, Grafana';
    const stack5 = primarySkills ? `Rust, ${primarySkills}, TenSEAL, WebAssembly` : 'Rust, TenSEAL / Concrete, WebAssembly, SQLite';

    return [
      {
        id: 'proj-1',
        name: 'Argon2 Authentication & Brute-Force Shield',
        level: 'Beginner',
        description: 'Hardened user auth service implementing Argon2id hashing, progressive delays, and CAPTCHA escalation.',
        techStack: stack1,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-2',
        name: 'Asymmetric JWT Identity Provider Server',
        level: 'Intermediate',
        description: 'OAuth2/OIDC compatible identity microservice signing RS256 tokens with automated key rotation and JWKS endpoint.',
        techStack: stack2,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-3',
        name: 'Zero-Trust WAF & API Reputation Gateway',
        level: 'Advanced',
        description: 'Reverse proxy inspecting HTTP request bodies for SQLi, XSS, and command injections with live IP reputation scoring.',
        techStack: stack3,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-4',
        name: 'Distributed Network Intrusion Detection System (IDS)',
        level: 'Enterprise',
        description: 'Packet sniffer analyzing network traffic for port scans, SYN floods, and DNS tunneling with automated alerting.',
        techStack: stack4,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-5',
        name: 'Homomorphic Cryptographic Audit Vault',
        level: 'Future-Tech',
        description: 'Zero-knowledge database proxy executing queries on encrypted records without ever decrypting plaintext in memory.',
        techStack: stack5,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      }
    ];
  }

  // 5. DevOps / Cloud & Infrastructure
  if (
    g.includes('devops') ||
    g.includes('cloud') ||
    g.includes('sre') ||
    g.includes('infrastructure') ||
    g.includes('platform') ||
    g.includes('kubernetes') ||
    g.includes('terraform')
  ) {
    const stack1 = primarySkills ? `Docker, ${primarySkills}, GitHub Actions, Trivy` : 'Docker, GitHub Actions, Trivy, Make, Bash';
    const stack2 = primarySkills ? `Terraform, ${primarySkills}, AWS/LocalStack, TFLint` : 'Terraform, AWS/LocalStack, TFLint, Terratest';
    const stack3 = primarySkills ? `Kubernetes, ${primarySkills}, Helm, ArgoCD` : 'Kubernetes, ArgoCD, Helm, Argo Rollouts, Prometheus';
    const stack4 = primarySkills ? `OpenTelemetry, ${primarySkills}, Jaeger, Grafana` : 'OpenTelemetry, Jaeger, Grafana, Loki, Prometheus';
    const stack5 = primarySkills ? `Go, ${primarySkills}, Operator SDK, Kubernetes API` : 'Go, Operator SDK, Kubernetes API, Prometheus, Docker';

    return [
      {
        id: 'proj-1',
        name: 'Multi-Stage Docker Microservice Pipeline',
        level: 'Beginner',
        description: 'Optimized, scratch-based containerization pipeline with vulnerability scanning and GitHub Actions CI.',
        techStack: stack1,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-2',
        name: 'Infrastructure-as-Code AWS/GCP Multi-Tier VPC',
        level: 'Intermediate',
        description: 'Modular Terraform repository deploying a highly-available VPC with public/private subnets and NAT gateways.',
        techStack: stack2,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-3',
        name: 'Kubernetes GitOps Continuous Delivery Operator',
        level: 'Advanced',
        description: 'GitOps deployment system using ArgoCD and custom Helm charts with progressive canary rollouts.',
        techStack: stack3,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-4',
        name: 'Distributed Observability & Tracing Mesh',
        level: 'Enterprise',
        description: 'Full-stack OpenTelemetry instrumentation pipeline collecting traces, metrics, and logs with Grafana Tempo.',
        techStack: stack4,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-5',
        name: 'Self-Healing Kubernetes AI Operator',
        level: 'Future-Tech',
        description: 'Custom Kubernetes controller in Go that detects crashloops, diagnoses root causes via log analysis, and auto-patches.',
        techStack: stack5,
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
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      }
    ];
  }

  // 6. Data Engineering & Big Data
  if (
    g.includes('data engineer') ||
    g.includes('big data') ||
    g.includes('etl') ||
    g.includes('lakehouse') ||
    g.includes('spark') ||
    g.includes('kafka') ||
    g.includes('analytics engineer')
  ) {
    const stack1 = primarySkills ? `Python, ${primarySkills}, DuckDB, dbt` : 'Python, DuckDB, dbt-core, PostgreSQL, ClickHouse';
    const stack2 = primarySkills ? `Apache Spark / PySpark, ${primarySkills}, Delta Lake` : 'PySpark, Delta Lake, MinIO, Docker, Parquet';
    const stack3 = primarySkills ? `Apache Kafka, ${primarySkills}, Flink, PostgreSQL` : 'Apache Kafka, Apache Flink, PostgreSQL, Redis, Docker';
    const stack4 = primarySkills ? `Trino, ClickHouse, ${primarySkills}, Iceberg` : 'Trino, ClickHouse, Apache Iceberg, S3, Superset';
    const stack5 = primarySkills ? `Rust, ${primarySkills}, Arrow DataFusion, WASM` : 'Rust, Apache Arrow DataFusion, WASM, Parquet, Python';

    return [
      {
        id: 'proj-1',
        name: 'Modern ELT Analytics Pipeline with dbt & DuckDB',
        level: 'Beginner',
        description: 'Automated data ingestion and transformation pipeline enforcing SQL schema testing and incremental updates.',
        techStack: stack1,
        problem: 'Ad-hoc pandas scripts in data pipelines silently produce null keys and duplicate financial numbers.',
        deliverable: 'Reproducible dbt analytics pipeline transforming raw event streams into clean dimensional star schemas.',
        xpReward: 250,
        status: 'Not Started',
        guideSteps: [
          'Ingest raw semi-structured JSON events into DuckDB staging tables.',
          'Model dimension and fact tables in dbt with strict primary key and not-null constraints.',
          'Configure incremental models processing only new timestamped partitions.',
          'Set up automated data quality testing with Great Expectations or dbt test.'
        ],
        tips: [
          'Use CTEs (Common Table Expressions) inside dbt models for readable SQL lineage.',
          'Store staging data in column-oriented Parquet format for fast vectorized processing.'
        ],
        verificationReqs: ['dbt lineage DAG documentation', 'Automated schema validation tests passing', 'Incremental partition update script', 'Star schema data warehouse report'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-2',
        name: 'Lakehouse ACID Delta Pipeline with PySpark',
        level: 'Intermediate',
        description: 'Distributed ETL pipeline writing high-throughput streaming events to an ACID Delta Lake with schema enforcement.',
        techStack: stack2,
        problem: 'Traditional object storage data lakes lack ACID transactions, causing dirty reads during concurrent batch jobs.',
        deliverable: 'PySpark pipeline writing to Delta Lake with time-travel queries and automated compaction.',
        xpReward: 500,
        status: 'Not Started',
        guideSteps: [
          'Deploy local MinIO object store and configure S3A filesystem connector in Spark.',
          'Stream simulated clickstream events into Delta Lake bronze tables with schema enforcement.',
          'Implement merge upsert logic to maintain silver-tier clean customer profiles.',
          'Schedule OPTIMIZE and VACUUM jobs to compact small files and manage storage costs.'
        ],
        tips: [
          'Partition data by date and regional keys to avoid full table scans.',
          'Test time-travel rollbacks to verify audit reproducibility after simulated bad batches.'
        ],
        verificationReqs: ['Delta Lake ACID transaction test', 'Schema evolution and enforcement check', 'PySpark streaming job execution', 'Time-travel query demonstration'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-3',
        name: 'Real-Time Change Data Capture (CDC) Streaming Engine',
        level: 'Advanced',
        description: 'Event-driven streaming pipeline capturing PostgreSQL WAL changes via Debezium and Kafka to compute live leaderboards.',
        techStack: stack3,
        problem: 'Polling databases every 5 minutes produces stale dashboard metrics and strains production database CPU.',
        deliverable: 'Real-time CDC streaming pipeline propagating database changes to materialized views in sub-second latency.',
        xpReward: 750,
        status: 'Not Started',
        guideSteps: [
          'Configure PostgreSQL logical replication slot and connect Debezium CDC connector.',
          'Publish row-level mutations (INSERT, UPDATE, DELETE) into Apache Kafka topics.',
          'Use Apache Flink to calculate sliding window aggregations on live event streams.',
          'Sink aggregated metrics into Redis and ClickHouse for instant dashboard rendering.'
        ],
        tips: [
          'Preserve topic partitioning by primary key to guarantee in-order delivery of row mutations.',
          'Implement dead-letter queues for unparseable CDC records.'
        ],
        verificationReqs: ['PostgreSQL CDC replication working', 'Kafka event bus stream processing', 'Flink sliding window aggregation test', 'Sub-second end-to-end latency benchmark'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-4',
        name: 'Federated Multi-Engine SQL Query Engine',
        level: 'Enterprise',
        description: 'Trino query federation layer querying across PostgreSQL, ClickHouse, and S3 Iceberg tables without moving data.',
        techStack: stack4,
        problem: 'Data silos force teams to copy terabytes of data between relational databases and data warehouses.',
        deliverable: 'Unified Trino query layer executing federated SQL joins across distinct transactional and columnar backends.',
        xpReward: 1000,
        status: 'Not Started',
        guideSteps: [
          'Deploy Trino coordinator and workers connected to PostgreSQL, ClickHouse, and S3 catalogs.',
          'Write federated SQL queries joining live transactional user tables with historical S3 logs.',
          'Optimize query pushdowns to push filters directly down into ClickHouse column engines.',
          'Enforce column-level data masking and role-based access control (RBAC).'
        ],
        tips: [
          'Inspect Trino EXPLAIN plans to ensure join ordering places the smaller dimension table on the build side.',
          'Set memory query limits to prevent rogue analytical queries from exhausting coordinator RAM.'
        ],
        verificationReqs: ['Multi-catalog Trino configuration', 'Cross-database federated SQL join execution', 'EXPLAIN pushdown optimization analysis', 'Superset BI visualization dashboard'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      },
      {
        id: 'proj-5',
        name: 'WASM-Compiled Vectorized Parquet Engine in Rust',
        level: 'Future-Tech',
        description: 'Build a serverless analytics engine in Rust compiled to WebAssembly that parses Parquet files and runs SQL queries locally.',
        techStack: stack5,
        problem: 'Downloading whole CSV/Parquet files to server instances wastes bandwidth when users only need 2 columns.',
        deliverable: 'In-browser columnar SQL engine executing SIMD-accelerated queries on remote Parquet byte ranges.',
        xpReward: 1500,
        status: 'Not Started',
        guideSteps: [
          'Write column-pruning Parquet decoder in Rust utilizing Apache Arrow DataFusion.',
          'Issue HTTP range requests to download only relevant byte chunks from remote cloud object storage.',
          'Compile query engine to WebAssembly with SIMD vectorized instruction support.',
          'Benchmark query execution time against local SQLite and DuckDB WASM.'
        ],
        tips: [
          'Read Parquet metadata footers first to inspect min/max column statistics for dictionary skipping.',
          'Use zero-copy memory buffers between Arrow RecordBatches and JavaScript TypedArrays.'
        ],
        verificationReqs: ['Rust WASM compiled query module', 'HTTP range request Parquet reader', 'Vectorized SIMD query benchmark', 'Interactive in-browser SQL playground'],
        minScore: 80,
        isTemplate: true,
        source: 'curated_template'
      }
    ];
  }

  // 7. Default: Distributed Systems & Backend Engineering
  const stack1 = primarySkills ? `Node.js / Go, ${primarySkills}, PostgreSQL, Redis` : 'Node.js / Go, PostgreSQL, Redis, Stripe CLI';
  const stack2 = primarySkills ? `Go / Node.js, ${primarySkills}, Redis Lua, PostgreSQL` : 'Go / Node.js, Redis Lua scripts, PostgreSQL, k6';
  const stack3 = primarySkills ? `Go / Java, ${primarySkills}, RabbitMQ, Docker` : 'Go / Java Spring Boot, RabbitMQ / Kafka, PostgreSQL, Docker';
  const stack4 = primarySkills ? `Go / Rust, ${primarySkills}, Raft, RocksDB, gRPC` : 'Go / Rust, Raft Consensus, RocksDB / Badger, gRPC, Docker';
  const stack5 = primarySkills ? `Rust WASM, ${primarySkills}, Cloudflare Workers, DynamoDB` : 'Cloudflare Workers / Rust WASM, DynamoDB Global Tables / CockroachDB';

  return [
    {
      id: 'proj-1',
      name: 'Idempotent Payment Webhook Broker',
      level: 'Beginner',
      description: 'Production-grade webhook receiver verifying cryptographic signatures, ensuring exactly-once processing.',
      techStack: stack1,
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
      minScore: 80,
      isTemplate: true,
      source: 'curated_template'
    },
    {
      id: 'proj-2',
      name: 'High-Concurrency Distributed Inventory Engine',
      level: 'Intermediate',
      description: 'Flash-sale inventory service with pessimistic and optimistic locking preventing overselling under heavy load.',
      techStack: stack2,
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
      minScore: 80,
      isTemplate: true,
      source: 'curated_template'
    },
    {
      id: 'proj-3',
      name: 'Distributed Saga Transaction Coordinator',
      level: 'Advanced',
      description: 'Orchestration-based Saga pattern coordinating multi-service orders with automated compensating transactions.',
      techStack: stack3,
      problem: 'Distributed 2-phase commit (2PC) blocks microservices and creates single-point-of-failure bottlenecks.',
      deliverable: 'Event-driven coordinator orchestrating Order, Payment, and Shipping services with rollback guarantees.',
      xpReward: 750,
      status: 'Not Started',
      guideSteps: [
        'Design state-machine orchestrator logging saga states (Pending, Committing, Compensating, Aborted).',
        'Publish domain events across message queues with exponential retry backoff.',
        'Implement automated compensating transactions executing reverse operations on failure.',
        'Build outbox pattern daemon guaranteeing at-least-once message dispatch from SQL tables.'
      ],
      tips: [
        'Ensure all compensating actions are strictly idempotent to handle network retries safely.',
        'Maintain a correlation ID across all microservice request headers and logs.'
      ],
      verificationReqs: ['Saga state machine implementation', 'Transactional Outbox pattern', 'Automated compensating rollback tests', 'Dockerized multi-service reproduction'],
      minScore: 80,
      isTemplate: true,
      source: 'curated_template'
    },
    {
      id: 'proj-4',
      name: 'Distributed Consensus Raft Key-Value Store',
      level: 'Enterprise',
      description: 'Fault-tolerant distributed key-value cluster implementing the Raft consensus algorithm in Go or Rust.',
      techStack: stack4,
      problem: 'Network partitions split database clusters, causing split-brain data loss without consensus protocols.',
      deliverable: '3-node cluster executing leader election, log replication, and surviving single-node crash failures.',
      xpReward: 1000,
      status: 'Not Started',
      guideSteps: [
        'Implement Raft leader election with randomized election timeouts and heartbeat pings.',
        'Build log replication protocol requiring quorum confirmation before committing state machine edits.',
        'Handle network partitions by isolating minority nodes and rejoining after partition heal.',
        'Persist committed log entries and snapshot states to local disk (RocksDB/Badger).'
      ],
      tips: [
        'Keep election timeouts sufficiently larger than network round-trip times to prevent false elections.',
        'Simulate chaos network drops using Toxiproxy or automated packet filters.'
      ],
      verificationReqs: ['Raft leader election test', 'Quorum log replication check', 'Network partition tolerance test (Jepsen-style)', 'Crash recovery from disk snapshot'],
      minScore: 80,
      isTemplate: true,
      source: 'curated_template'
    },
    {
      id: 'proj-5',
      name: 'WASM Edge Global Read-Replica Proxy',
      level: 'Future-Tech',
      description: 'Global proxy running on edge workers routing user queries to the lowest-latency regional database replica.',
      techStack: stack5,
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
      minScore: 80,
      isTemplate: true,
      source: 'curated_template'
    }
  ];
}

function streamProjectsResponse(
  projects: GeneratedProject[],
  goal: string,
  isTemplate: boolean,
  source: 'llm' | 'curated_template'
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'start', goal, isTemplate, source })}\n\n`)
        );
        for (let i = 0; i < projects.length; i++) {
          const p = projects[i];
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'project', projectIndex: i, project: p })}\n\n`)
          );
        }
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'complete', success: true, goal, isTemplate, source, projects })}\n\n`
          )
        );
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipRl = checkRateLimit(`projects_gen_ip_${ip}`, { limit: 30, windowMs: 3_600_000 });
    if (!ipRl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests from this IP. Please try again later.' },
        { status: 429 }
      );
    }

    const url = new URL(req.url, 'http://localhost');
    const isPreviewQuery = url.searchParams.get('preview') === 'true';
    const isStreamQuery = url.searchParams.get('stream') === 'true';

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const isPreviewHeader = req.headers.get('x-preview') === 'true';
    const isPreview = isPreviewQuery || isPreviewHeader || Boolean(body.preview);

    const wantsStream =
      isStreamQuery ||
      Boolean(body.stream) ||
      Boolean(body.streaming) ||
      Boolean(req.headers.get('accept')?.includes('text/event-stream'));

    const { data, error } = validateBody(ProjectGenerateSchema, body);
    if (error) return error;

    const goal = (data.goal || '').trim() || 'Full Stack Engineer';
    const skills = (data.skills || []).map((s: string) => s.trim()).filter(Boolean);
    const education = (data.education || '').trim();
    const experienceLevel = (data.experienceLevel || '').trim();

    // Authenticate user to protect against external LLM token drain
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      // If preview is explicitly permitted, return curated blueprint templates immediately with ZERO LLM spend
      if (isPreview) {
        const fallbackProjects = getDomainFallback(goal, skills, experienceLevel);
        if (wantsStream) {
          return streamProjectsResponse(fallbackProjects, goal, true, 'curated_template');
        }
        return NextResponse.json({
          success: true,
          goal,
          isTemplate: true,
          source: 'curated_template',
          authenticated: false,
          message: 'Curated blueprint preview. Sign in to generate bespoke AI capstone projects.',
          projects: fallbackProjects
        });
      }
      // Otherwise reject with 401 UNAUTHORIZED so unauthenticated visitors cannot trigger spend
      return gated.error;
    }

    const user = gated.user;
    // Per-user rate limiting (10 custom AI generations per hour)
    const userRl = checkRateLimit(`projects_gen_user_${user.id}`, { limit: 10, windowMs: 3_600_000 });
    if (!userRl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Project generation quota reached (10/hour). Please try again shortly.' },
        { status: 429 }
      );
    }

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
              signal: AbortSignal.timeout(LLM_GENERATION_TIMEOUT_MS),
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
                signal: AbortSignal.timeout(LLM_GENERATION_TIMEOUT_MS),
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
                minScore: typeof p.minScore === 'number' ? Math.max(60, Math.min(100, p.minScore)) : 80,
                isTemplate: false,
                source: 'llm' as const
              };
            });

            if (wantsStream) {
              return streamProjectsResponse(validated, goal, false, 'llm');
            }

            return NextResponse.json({
              success: true,
              goal,
              isTemplate: false,
              source: 'llm',
              projects: validated
            });
          }
        }
      } catch (err) {
        console.warn('[Project Generator] LLM synthesis failed, using domain synthesis fallback:', err);
      }
    }

    // Dynamic Domain Synthesis Fallback (honest template labeling)
    const fallbackProjects = getDomainFallback(goal, skills, experienceLevel);

    if (wantsStream) {
      return streamProjectsResponse(fallbackProjects, goal, true, 'curated_template');
    }

    return NextResponse.json({
      success: true,
      goal,
      isTemplate: true,
      source: 'curated_template',
      notice: 'Synthesized from verified industry capstone blueprints.',
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
