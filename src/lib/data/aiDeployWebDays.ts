import { DayConfig } from './curriculumEnricher';

/**
 * Production AI Deployment in TypeScript (course-aideploy-web, prefix: aideploy-web):
 * 30 course days covering model API clients, timeouts and retries, token counting and
 * context budgeting, cost estimation, prompt templates, streaming responses (SSE),
 * micro-batching, vector embeddings, semantic caching, rate limiting per user,
 * dynamic model routing, automated provider fallbacks, latency budgets and percentiles,
 * model quantization and VRAM calculations, GPU/CPU capacity planning, text chunking,
 * top-K retrieval and Reciprocal Rank Fusion (RRF), citation tracking, structured output
 * schema validation and repair, safety guardrails (prompt injection and PII masking),
 * offline evaluation harnesses, LLM-as-a-judge scoring, CI/CD regression gates,
 * A/B experimentation, user feedback logging and drift detection, OpenTelemetry tracing,
 * FinOps cost dashboards, incident handling runbooks, go-live readiness checklists,
 * and the final capstone: an enterprise production AI gateway and guarded endpoint.
 *
 * Practice tasks are in aiDeployWeb30DayData.ts; lessons in aiDeployWebLongLessons.ts.
 */
export const AI_DEPLOY_DAYS: DayConfig[] = [
  {
    day: 1,
    title: "Resilient Model API Clients: Deadlines, AbortControllers & Exponential Backoff",
    desc: "Build enterprise-grade HTTP clients for LLM APIs using fetch with AbortController timeout budgets, status-aware retries, and jittered exponential backoff.",
    syllabus: [
      "Deadline Control: Wrapping LLM HTTP requests in AbortController timeout budgets to prevent runaway hung sockets.",
      "Status-Aware Retries: Dissecting 429 (Rate Limit) and 503 (Overloaded) headers (Retry-After) vs fatal 400/401 errors.",
      "Full Jitter Backoff: Mitigating thundering herds against LLM gateway endpoints using randomized exponential backoff."
    ]
  },
  {
    day: 2,
    title: "Typed Responses & Strict Schema Parsing with Type Guards",
    desc: "Enforce strict runtime typing on LLM completion responses using TypeScript type guards and structural validation.",
    syllabus: [
      "Untyped LLM Hazard: Why trusting raw JSON from model completions leads to silent runtime crashes and data corruption.",
      "Defensive Type Guards: Validating model response payloads, choices arrays, and message objects at the boundary layer.",
      "Graceful Degradation: Handling truncated completions (finish_reason: length) and unparseable JSON output safely."
    ]
  },
  {
    day: 3,
    title: "BPE Token Counting Mechanics & Context Window Budgeting",
    desc: "Calculate token counts with Byte-Pair Encoding (BPE) algorithms, manage context window ceilings, and prevent context overflow errors.",
    syllabus: [
      "BPE Tokenization: Understanding subword token boundaries, token-to-character heuristics, and token overhead.",
      "Context Budget Allocation: Slicing context windows into strict budgets for system instructions, few-shot history, and user input.",
      "Headroom Preservation: Reserving output token headroom to guarantee completion generation without abrupt truncation."
    ]
  },
  {
    day: 4,
    title: "Multi-Model Pricing Models, Cost Estimation & Token Accounting",
    desc: "Implement dynamic inference cost estimators across diverse model tiers (small, medium, frontier) tracking input vs output token economics.",
    syllabus: [
      "Input vs Output Pricing Asymmetry: Why output tokens cost 3x to 5x more than input tokens across frontier providers.",
      "Blended Cost Estimation: Modeling per-query and cumulative inference expense using tier-based token cost lookup tables.",
      "Financial Safety Budgets: Setting hard daily/monthly spend caps and circuit breakers before bills spiral out of control."
    ]
  },
  {
    day: 5,
    title: "⭐ MILESTONE 1: Type-Safe Dynamic Prompt Template Engine",
    desc: "Milestone 1: Architect a zero-dependency, variable-interpolating prompt template engine featuring variable validation, escaping, and partial application.",
    syllabus: [
      "Template Variable Injection: Parsing mustache-style placeholders ({{variable}}) with strict type validation.",
      "Injection Sanitization: Escaping user delimiters to prevent structural prompt injection and instruction boundary escapes.",
      "Partial Application & Composition: Composing reusable system personas, few-shot examples, and task instructions dynamically."
    ]
  },
  {
    day: 6,
    title: "Server-Sent Events (SSE) Streaming & Chunk Assembly",
    desc: "Parse Server-Sent Events (SSE) streaming chunks in real time, extract incremental deltas, and compute Time-to-First-Token (TTFT).",
    syllabus: [
      "SSE Protocol Framing: Parsing data: { ... } stream lines, handling [DONE] termination markers, and boundary buffering.",
      "Stream Delta Concatenation: Assembling partial text deltas into complete coherent responses while emitting progressive updates.",
      "TTFT Telemetry: Measuring Time-to-First-Token as a key latency metric reflecting human-perceived responsiveness."
    ]
  },
  {
    day: 7,
    title: "Micro-Batching Invocations for High-Throughput Background Workloads",
    desc: "Design adaptive request queues that batch independent inference requests to maximize throughput and minimize API network overhead.",
    syllabus: [
      "Micro-Batch Queueing: Collecting concurrent asynchronous queries within a bounded linger window (e.g. 50ms).",
      "Batch Window Sizing: Balancing batch size ceilings against latency penalties for interactive vs offline workloads.",
      "Promise Demultiplexing: Resolving individual caller Promises independently as the shared batch response returns."
    ]
  },
  {
    day: 8,
    title: "Vector Embeddings & Cosine Similarity Distance Functions",
    desc: "Generate normalized vector embeddings, implement exact cosine similarity math, and understand geometric distance metrics in latent space.",
    syllabus: [
      "Embedding Vectors: High-dimensional dense representations capturing semantic meaning across text documents.",
      "Cosine Similarity Math: Calculating dot products of normalized vectors to measure angular proximity in [-1.0, 1.0].",
      "Euclidean vs Cosine: Comparing distance metrics for normalized embedding models and performance implications."
    ]
  },
  {
    day: 9,
    title: "Semantic In-Memory Caching with Similarity Thresholds",
    desc: "Build a semantic inference cache that queries cached vectors, evaluates cosine similarity thresholds, and avoids duplicate LLM calls.",
    syllabus: [
      "Exact vs Semantic Matching: Why hash-based caches fail for natural language prompts with identical intent but altered phrasing.",
      "Similarity Threshold Tuning: Calibrating cosine cutoffs (e.g. >= 0.92) to balance cache hit rate against answer accuracy.",
      "Cache Eviction Policies: Implementing LRU and TTL eviction strategies to bound memory usage and prevent stale responses."
    ]
  },
  {
    day: 10,
    title: "Token Bucket & Sliding Window Rate Limiting per User",
    desc: "Implement distributed rate limiters tracking Requests Per Minute (RPM) and Tokens Per Minute (TPM) per user and tenant.",
    syllabus: [
      "RPM vs TPM Dual-Metering: Why token consumption must be capped independently of raw request frequency.",
      "Token Bucket Algorithm: Continuous refill rates and burst capacities for graceful rate limiting.",
      "Sliding Window Log: Precise time-window tracking preventing quota boundary spikes and abuse."
    ]
  },
  {
    day: 11,
    title: "Dynamic Model Routing: Complexity Scoring & Tier Selection",
    desc: "Route user queries dynamically to cheap lightweight models or expensive frontier models based on prompt complexity heuristics.",
    syllabus: [
      "Tiered Architecture: Routing 80% of trivial queries to sub-cent fast models while reserving frontier models for reasoning.",
      "Complexity Heuristics: Evaluating code blocks, reasoning keywords, token lengths, and linguistic complexity.",
      "Cost vs Quality Optimization: Slashing operational spend by up to 70% while maintaining equivalent user satisfaction."
    ]
  },
  {
    day: 12,
    title: "Automated Fallbacks & Circuit Breaking for Provider Outages",
    desc: "Implement multi-provider fallback chains that automatically switch upstream LLM providers when outages, 5xx errors, or timeouts occur.",
    syllabus: [
      "Provider Redundancy: Seamlessly shifting traffic between OpenAI, Anthropic, Google, and local self-hosted endpoints.",
      "Circuit Breaker State Machine: CLOSED, OPEN, and HALF-OPEN transitions to protect failing downstream APIs.",
      "Format Normalization: Adapting vendor-specific payload shapes into unified internal representations."
    ]
  },
  {
    day: 13,
    title: "Latency Budgets, P50/P95/P99 Percentiles & SLA Enforcement",
    desc: "Establish strict latency budgets, compute percentiles (P50, P95, P99) across inference stages, and detect tail-latency spikes.",
    syllabus: [
      "Percentile Mathematics: Sorting and ranking latency distributions to measure tail latency accurately.",
      "Stage Breakdown: Dissecting latency into DNS/TCP, TTFT, inter-token generation time, and network transfer.",
      "SLA Enforcement & Hedging: Firing speculative parallel hedge requests when P95 latency thresholds are exceeded."
    ]
  },
  {
    day: 14,
    title: "Model Quantization & Memory Footprint Calculations",
    desc: "Calculate weight memory requirements across FP32, FP16, INT8, and INT4 quantization formats, plus KV-cache overhead.",
    syllabus: [
      "Quantization Bit-Widths: Weight precision tradeoffs between 32-bit float, 16-bit half, and 4-bit integer quantization.",
      "Model Memory Formula: Calculating base VRAM requirements based on parameter count and bytes-per-parameter.",
      "KV-Cache Memory Sizing: Estimating attention key-value cache memory scaling across batch size and context sequence length."
    ]
  },
  {
    day: 15,
    title: "⭐ MILESTONE 2: GPU/CPU Inference Capacity & Throughput Planner",
    desc: "Milestone 2: Construct an interactive inference capacity sizing calculator modeling concurrent users, tokens/sec, VRAM budgets, and replica counts.",
    syllabus: [
      "Throughput Sizing (Tokens/Sec): Modeling aggregate token generation demands from peak concurrent active users.",
      "Hardware Capacity Bounds: Determining maximum batch sizes per GPU instance before out-of-memory (OOM) crashes.",
      "Cluster Replica Scaling: Calculating minimum required hardware nodes and autoscaling thresholds to satisfy strict SLAs."
    ]
  },
  {
    day: 16,
    title: "Text Chunking Strategies: Fixed-Size, Overlap & Semantic Markdown",
    desc: "Implement robust text chunkers with sliding character/token overlaps and structure-aware markdown header boundaries.",
    syllabus: [
      "Chunk Size vs Coherence: Tradeoffs between small specific chunks and large context-rich narrative passages.",
      "Sliding Overlap Windows: Retaining cross-chunk sentence continuity using configurable overlap buffers (e.g. 15%).",
      "Document Boundary Preservation: Splitting on structural Markdown headers, paragraphs, and code blocks."
    ]
  },
  {
    day: 17,
    title: "Top-K Vector Retrieval, Reciprocal Rank Fusion (RRF) & Merging",
    desc: "Execute top-K similarity search, combine dense and sparse rankings using Reciprocal Rank Fusion (RRF), and deduplicate passages.",
    syllabus: [
      "Top-K Retrieval: Extracting the K highest-scoring vector candidates from in-memory index stores.",
      "Reciprocal Rank Fusion (RRF): Blending multi-index search ranks without requiring normalized score calibration.",
      "Context Deduplication & Compaction: Removing redundant text passages to conserve LLM context window space."
    ]
  },
  {
    day: 18,
    title: "Citation Tracking & Grounded Attribution Envelopes",
    desc: "Link retrieved document chunks to grounded citation markers and verify factual claims against source references.",
    syllabus: [
      "Provenance Tracking: Attaching document IDs, page numbers, and chunk hashes to retrieved context snippets.",
      "Inline Citation Generation: Instructing models to annotate generated statements with explicit source index brackets.",
      "Hallucination Auditing: Cross-verifying generated citations against the retrieved context to flag ungrounded claims."
    ]
  },
  {
    day: 19,
    title: "Structured JSON Output Validation & Repair Pipelines",
    desc: "Enforce strict schema validation on model outputs, parse JSON repair fallbacks, and re-prompt models on syntax failures.",
    syllabus: [
      "JSON Mode & Constrained Decoding: Enforcing structural JSON formatting across model completions.",
      "Automatic JSON Repair: Trimming markdown code fences, fixing trailing commas, and closing unclosed brackets.",
      "Re-Prompt Correction: Feeding validation error diagnostics back to the LLM for self-correction retries."
    ]
  },
  {
    day: 20,
    title: "Safety Guardrails: Prompt Injection Detection & PII Masking",
    desc: "Build bidirectional safety guardrails detecting jailbreak/injection patterns in inputs and masking PII (emails, SSNs, credit cards) in outputs.",
    syllabus: [
      "Prompt Injection Patterns: Identifying instruction overriding, roleplay bypasses, and delimiter hijacking attempts.",
      "Regex & Heuristic Guardrails: Quarantining suspicious inputs before dispatching to model endpoints.",
      "PII Redaction Engine: Automatically masking sensitive entity patterns (SSN, credit card, phone, email) with typed placeholders."
    ]
  },
  {
    day: 21,
    title: "Offline Evaluation Harnesses: Golden Dataset Benchmark Runner",
    desc: "Construct automated evaluation harnesses running candidate models and prompts against curated golden datasets with assertions.",
    syllabus: [
      "Golden Datasets: Curating representative input-output test pairs covering edge cases, domain knowledge, and adversarial tests.",
      "Evaluation Metrics: Exact match, string containment, regex assertions, and numerical range verifications.",
      "Automated Pass/Fail Thresholds: Computing aggregate accuracy scores to gate CI/CD deployment pipelines."
    ]
  },
  {
    day: 22,
    title: "LLM-as-a-Judge: Automated Scoring with Rubrics",
    desc: "Use secondary evaluative LLMs to score generation quality, faithfulness, and relevance using structured rubrics.",
    syllabus: [
      "Evaluator Prompting: Crafting impartial, multi-dimensional scoring rubrics (1-5 scales) for qualitative outputs.",
      "Faithfulness vs Relevance: Separating factual grounding in reference documents from answering user questions.",
      "Judge Bias Mitigation: Mitigating position bias, verbosity bias, and self-enhancement bias in automated scoring."
    ]
  },
  {
    day: 23,
    title: "CI/CD Regression Gates for Prompts & Model Upgrades",
    desc: "Integrate AI test suites into GitHub Actions / CI pipelines, preventing performance regressions when updating system prompts.",
    syllabus: [
      "Prompt Regressions: Why small prompt tweaks can silently break previously functioning edge cases.",
      "Regression Delta Scoring: Comparing benchmark accuracy delta between candidate branch and production main.",
      "Merge Gate Policies: Blocking pull requests when accuracy drops below configured tolerance thresholds."
    ]
  },
  {
    day: 24,
    title: "Traffic Splitting & A/B Prompt Experimentation",
    desc: "Implement deterministic user-hash traffic splitters running concurrent prompt variants in production with metrics tracking.",
    syllabus: [
      "Deterministic Cohort Assignment: Hashing user IDs to route users consistently to control (A) or experiment (B) variants.",
      "Side-by-Side Inferences: Shadowing production traffic to benchmark new models without affecting user experience.",
      "Statistical Significance: Tracking sample sizes, conversion rates, and latency differences across cohorts."
    ]
  },
  {
    day: 25,
    title: "User Feedback Logging & Embedding Drift Detection",
    desc: "Capture implicit and explicit user feedback (thumbs up/down, dwell time) and detect semantic drift in production user queries.",
    syllabus: [
      "Feedback Telemetry: Recording explicit ratings and implicit interaction signals linked to specific completion IDs.",
      "Semantic Query Drift: Tracking centroid shifts in query embeddings over time to identify evolving user topics.",
      "Data Flywheel: Routing low-rated interactions and drifted queries directly into fine-tuning and evaluation pipelines."
    ]
  },
  {
    day: 26,
    title: "AI Observability: OpenTelemetry Tracing for Multi-Step LLM Chains",
    desc: "Trace multi-step AI pipelines (guardrail -> retrieval -> prompt -> LLM -> repair) with structured spans and execution timing.",
    syllabus: [
      "Distributed Trace Spans: Instrumenting each sub-operation in an AI pipeline with dedicated trace spans.",
      "Metadata Enrichment: Tagging spans with model IDs, token counts, temperature, and semantic cache status.",
      "Bottleneck Identification: Pinpointing latency hotspots across network APIs, vector retrieval, and token streaming."
    ]
  },
  {
    day: 27,
    title: "FinOps Cost Dashboards: Per-User, Per-Model & Per-Feature Attribution",
    desc: "Build real-time financial tracking systems attributing AI costs per user, per organization, and per feature with budget alerts.",
    syllabus: [
      "Cost Attribution Hierarchy: Aggregating token expense across tenant, user, feature, and model dimensions.",
      "Anomaly Alerting: Detecting rogue scripts or sudden cost spikes exceeding 3x standard deviation velocity.",
      "Margin Analysis: Measuring unit economics per customer to ensure revenue exceeds AI API consumption costs."
    ]
  },
  {
    day: 28,
    title: "Incident Handling: Fallback Toggles & Prompt Injection Runbooks",
    desc: "Execute production incident playbooks for upstream outages, rate limit saturation, prompt injections, and rogue completions.",
    syllabus: [
      "Emergency Kill Switches: Disabling expensive features or falling back to static canned responses via feature flags.",
      "Mitigation Playbooks: Step-by-step procedures for handling active jailbreak campaigns and prompt leaks.",
      "Postmortem Forensics: Correlating logs, spans, and raw completion IDs during blameless root-cause analysis."
    ]
  },
  {
    day: 29,
    title: "Production Deployment Checklist & Go-Live Readiness Audit",
    desc: "Execute a comprehensive 20-point production readiness audit evaluating security, latency, cost controls, fallbacks, and monitoring.",
    syllabus: [
      "Security Audit: Verifying API key rotation, secret masking, input guardrails, and PII redaction.",
      "Reliability Audit: Testing timeout ceilings, circuit breaker trips, automated retry policies, and provider fallbacks.",
      "Operational Audit: Verifying Prometheus metrics, alert paging rules, cost anomaly thresholds, and runbooks."
    ]
  },
  {
    day: 30,
    title: "🏆 FINAL CAPSTONE: Enterprise Production AI Gateway & Guarded Endpoint",
    desc: "Capstone Project: Architect and build an enterprise production AI Gateway synthesizing token bucket rate limiting, semantic caching, prompt sanitization, model routing, fallback circuit breakers, output schema repair, and real-time cost observability.",
    syllabus: [
      "Gateway Orchestration: End-to-end processing pipeline routing user requests through security, caching, and model execution.",
      "Multi-Layer Defense: Unifying semantic cache hit lookups, token bucket enforcement, and injection guardrails.",
      "Master Certification Audit: Verifying complete system resilience under stress, failure, and cost accounting."
    ]
  }
];
