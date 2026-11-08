export interface Project {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Enterprise' | 'Future-Tech';
  description: string;
  techStack: string;
  problem: string;
  deliverable: string;
  xpReward: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  githubLink?: string;
  demoLink?: string;
  guideSteps?: string[];
  tips?: string[];
  verificationReqs?: string[];
  minScore?: number;
  verificationScore?: number;
  vivaPassed?: boolean;
  certificateType?: 'standard' | 'excellence' | 'reference';
  authorshipVerified?: boolean;
  certificateId?: string;
  issueDate?: string;
  isTemplate?: boolean;
  source?: 'llm' | 'curated_template' | 'custom';
  /** Set when the project was handed out for a finished custom roadmap. */
  origin?: 'roadmap';
  roadmapCourseId?: string;
  courseId?: string;
  /** Latest capstone interview result for a roadmap capstone (a pass is kept). */
  capstoneInterview?: {
    score: number;
    verdict: string;
    passed: boolean;
    completedAt: string;
    evaluationToken?: string;
    /** The interview topic, and the server's signature bound to it (proves which interview this was). */
    topic?: string;
    topicEvaluationToken?: string;
  };
}

export const GITHUB_REPO_REGEX = /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/;

export const SWAP_POOLS: Record<string, Record<string, Partial<Project>>> = {
  'AI Engineer': {
    'Beginner': {
      name: 'AI Text Summarizer CLI',
      description: 'Build a command-line tool that extracts key sentences from documents using HuggingFace pipelines.',
      techStack: 'Python, Transformers, Click, NLTK',
      problem: 'Reading multi-page documents is time-consuming; simple regex truncation loses key context.',
      deliverable: 'CLI utility accepting text path and length parameters, outputting semantic bulleted summaries.',
      verificationReqs: ['CLI Argument Parsing', 'NLP Sentence Extraction', 'Length Threshold Controls', 'README.md Documentation'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Semantic Code Search Engine',
      description: 'Upload repositories, vector-embed functions, and search logic using natural language queries.',
      techStack: 'FastAPI, Sentence-Transformers, Qdrant, React',
      problem: 'Traditional git grep search fails when programmers use different synonyms for the same logic.',
      deliverable: 'Interactive code query console returning matching functions with similarity scores.',
      verificationReqs: ['GitHub API Hooking', 'Qdrant Indexing', 'FastAPI Query Endpoint', 'React Code View UI'],
      minScore: 80
    },
    'Advanced': {
      name: 'AI Financial Advisor Agents',
      description: 'Deploy dual-agents tracking company stock earnings call PDFs and running sentiment calculations.',
      techStack: 'CrewAI, Python, Yahoo Finance API, Streamlit',
      problem: 'Manually cross-referencing market indicators with long financial reports causes delayed transactions.',
      deliverable: 'Streamlit dashboard generating advisory reports with buy/sell recommendations.',
      verificationReqs: ['CrewAI Multi-Agent loop', 'PDF parsing scripts', 'Yahoo Finance API bindings', 'Streamlit output view'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Distributed Vector Sync Broker',
      description: 'Build a microservice pipeline synchronizing DB updates to Qdrant vector databases in real-time.',
      techStack: 'Kafka, Go, PostgreSQL, Qdrant, Docker',
      problem: 'Distributed vector writing causes inconsistent states on failures.',
      deliverable: 'Fault-tolerant sync listener reprocessing failed events from Dead Letter Queues.',
      verificationReqs: ['Kafka Consumer', 'Postgres query logs listener', 'Vector database inserts', 'Dead Letter Queue redirects'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Decentralized Federated Learning Node',
      description: 'Train local models on edge devices and aggregate weights to a central server securely.',
      techStack: 'Flower (flwr), PyTorch, gRPC, Python',
      problem: 'Centralized model training compromises private user telemetry and triggers regulatory blocks.',
      deliverable: 'Client node pipeline receiving weights, running local training steps, and returning weight differentials.',
      verificationReqs: ['gRPC client socket broker', 'Local PyTorch training steps', 'Weight differential calculus', 'Flower node handshakes'],
      minScore: 80
    }
  },
  'Cybersecurity Engineer': {
    'Beginner': {
      name: 'Secure Password Manager CLI',
      description: 'A command-line vault encrypting credential records using AES-256-GCM keys.',
      techStack: 'Python, Cryptography.io, SQLite, MasterKey Hash',
      problem: 'Keeping passwords in plaintext files makes them easy targets for basic host compromise.',
      deliverable: 'CLI utility requiring master passwords to decrypt and copy site secrets to the clipboard.',
      verificationReqs: ['AES-256-GCM encryption key generation', 'SQLite storage credentials', 'Secure memory clipboard locks', 'Password hashing verification'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Asymmetric File Encrypter Portal',
      description: 'Web dashboard allowing users to upload public keys, encrypting files client-side before storage.',
      techStack: 'React, WebCrypto API, Node.js, Express',
      problem: 'Files uploaded directly to cloud servers can be intercepted by rogue cloud admins.',
      deliverable: 'Web app executing asymmetric file encryption inside the browser runtime sandbox.',
      verificationReqs: ['Asymmetric key generation API', 'Browser-based file encryption', 'Node storage destination pathing', 'Public key metadata uploads'],
      minScore: 80
    },
    'Advanced': {
      name: 'API Rate Limiting Sentinel',
      description: 'Deploy token bucket sliding window limits to block brute force credential attacks.',
      techStack: 'Go, Redis, Lua Scripts',
      problem: 'Static IP blocks are bypassable via proxy rotation; default API libraries consume high memory under load.',
      deliverable: 'WASM edge middleware throttling request flows under heavy concurrent load.',
      verificationReqs: ['Token Bucket sliding window checks', 'Redis Lua integration', 'WASM build compatibility', 'Rate limiting status header injection'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Zero-Trust File Integrity Monitor (FIM)',
      description: 'Continuous daemon hashing critical system files and logging alerts on file modifications.',
      techStack: 'Rust, ClickHouse, Systemd Services',
      problem: 'Intruders modify system binaries (like sshd) to persist backdoor access without generating logs.',
      deliverable: 'FIM agent triggering system alerts when cryptographic hashes differ from baseline configs.',
      verificationReqs: ['Rust System filesystem listener', 'Cryptographic hashing algorithm calculations', 'ClickHouse logger updates', 'FIM alerts dashboard panel'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Post-Quantum Encrypted Vault',
      description: 'Secure credentials vault signed with Kyber algorithm keys to withstand quantum computing decryption.',
      techStack: 'Rust, PQClean, WebAssembly',
      problem: 'Standard RSA/ECC vault encryptions can be cracked by future quantum algorithms.',
      deliverable: 'Kyber-signed vault library storing data in local files.',
      verificationReqs: ['PQClean Kyber-1024 encryption keys', 'Rust file system encryption modules', 'WASM build parameters', 'README file integration'],
      minScore: 80
    }
  },
  'Backend Engineer': {
    'Beginner': {
      name: 'Static Blog Markdown Parser',
      description: 'High-performance parser converting markdown directories to pre-rendered HTML static sites.',
      techStack: 'Go, Goldmark, HTML Templates',
      problem: 'Dynamic blog databases add database load and slow down client initial page rendering speeds.',
      deliverable: 'Static site builder creating optimized HTML layouts.',
      verificationReqs: ['Markdown metadata header parser', 'Go HTML template bindings', 'Static directory file writing modules', 'Site rendering benchmark checks'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Distributed Task Queue Broker',
      description: 'Task queuing system managing job retries, prioritization, and concurrent execution pools.',
      techStack: 'Go, Redis, JSON RPC',
      problem: 'Running long-running background tasks inside HTTP request threads locks web servers.',
      deliverable: 'Task worker processing jobs in order of priority.',
      verificationReqs: ['Go concurrent goroutine processing pools', 'Redis message queue ingestion', 'Job retry and fallback logs', 'Task priority evaluation algorithms'],
      minScore: 80
    },
    'Advanced': {
      name: 'P2P WebRTC Signaling Gateway',
      description: 'Signaling server coordinating real-time WebRTC connections and connection channels.',
      techStack: 'Node.js, WebSockets, Redis Adapter',
      problem: 'Direct Peer-to-Peer calls fail if servers cannot reliably route peer candidate information.',
      deliverable: 'WebSocket gateway managing room state and peer handshakes.',
      verificationReqs: ['WebSocket room connection router', 'STUN/TURN candidate JSON message forwarding', 'Redis pub/sub channel state tracking', 'Connection teardown cleanup listeners'],
      minScore: 80
    },
    'Enterprise': {
      name: 'High-Throughput Order Matching Engine',
      description: 'Low-latency financial order book matching buy/sell bids with price-time priority queues.',
      techStack: 'C++, Lock-free Lockers, Memory Mapped Files',
      problem: 'Traditional relational database locks create bottleneck bottlenecks on trade execution.',
      deliverable: 'Order matching engine processing trades in microsecond timeframes.',
      verificationReqs: ['Double-ended order book queue structure', 'Price-Time priority matching algorithm', 'Lock-free atomic memory state handlers', 'Execution confirmation event dispatcher'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Autonomous Micro-Transaction State Mesh',
      description: 'Layer-2 payment mesh executing instant state channel transitions across edge nodes.',
      techStack: 'Rust, WASM, Tokio, RocksDB',
      problem: 'Main-chain blockchain transaction costs prevent micro-payments for web API calls.',
      deliverable: 'Node mesh routing payment state channels offline with periodic zero-knowledge rollups.',
      verificationReqs: ['Tokio async network listeners', 'RocksDB state channel storage', 'Off-chain signature validation', 'ZK-rollup state proof verifiers'],
      minScore: 80
    }
  },
  'Full-Stack Web Engineer': {
    'Beginner': {
      name: 'Responsive Design System & Accessible Form Engine',
      description: 'Build a reusable React + TypeScript component library with WCAG 2.1 AA keyboard navigation, ARIA live announcements, and deterministic form schema validation.',
      techStack: 'React, TypeScript, CSS Variables, Vitest',
      problem: 'Ad-hoc UI forms lack consistent validation states, screen-reader announcements, and keyboard focus management.',
      deliverable: 'Component library with Button, Modal, Combobox, and SchemaForm components plus unit tests.',
      verificationReqs: ['WCAG 2.1 AA Focus Trap & ARIA Roles', 'Deterministic Schema Validator', 'Dark/Light Theme Token Engine', 'Vitest Component Test Suite'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Real-Time Collaborative Kanban Workspace',
      description: 'Full-stack task board with optimistic drag-and-drop updates, conflict-free ordering, and WebSocket room synchronization.',
      techStack: 'Next.js, TypeScript, Node.js, PostgreSQL, WebSockets',
      problem: 'Concurrent board edits overwrite user changes when multiple team members move cards simultaneously.',
      deliverable: 'Full-stack Kanban web app with fractional indexing, optimistic rollback, and live presence cursors.',
      verificationReqs: ['Fractional Indexing Card Ordering', 'Optimistic UI Rollback Handler', 'WebSocket Room Broadcast', 'PostgreSQL Transactional Persistence'],
      minScore: 80
    },
    'Advanced': {
      name: 'Multi-Tenant SaaS Billing & Usage Metering Portal',
      description: 'Architect an enterprise SaaS control plane with RBAC permissions, idempotent Stripe webhook processing, and tiered usage metering.',
      techStack: 'Next.js App Router, TypeScript, Prisma, PostgreSQL, Redis',
      problem: 'Duplicate webhook retries and race conditions cause double billing and quota leakage across tenant organizations.',
      deliverable: 'Multi-tenant dashboard with organization switching, API key issuance, and metered invoice generation.',
      verificationReqs: ['Row-Level Tenant Isolation', 'Idempotent Webhook Ledger', 'Sliding-Window API Quota Metering', 'RBAC Permission Middleware'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Edge-Rendered SSR Commerce Engine with Distributed Cache',
      description: 'High-throughput storefront utilizing React Server Components, stale-while-revalidate edge caching, and atomic inventory reservations.',
      techStack: 'Next.js, React 19, Redis, PostgreSQL, OpenTelemetry',
      problem: 'Flash-sale traffic spikes overwhelm origin databases and cause oversold inventory during checkout.',
      deliverable: 'Edge-cached commerce platform sustaining flash-sale concurrency with sub-50ms TTFB and zero overselling.',
      verificationReqs: ['SWR Edge Cache Invalidation', 'Atomic Inventory Reservation Lua Script', 'Streaming RSC Suspense Boundaries', 'OpenTelemetry Distributed Tracing'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Local-First CRDT Sync Engine & Offline Web App',
      description: 'Build an offline-capable productivity suite powered by IndexedDB storage and state-based Conflict-Free Replicated Data Types (CRDTs).',
      techStack: 'TypeScript, Yjs / LWW-Element-Set CRDT, IndexedDB, Service Workers',
      problem: 'Cloud-dependent web apps become unusable on unstable connections and lose unsaved work during network drops.',
      deliverable: 'Zero-latency web application that merges multi-device offline edits deterministically upon reconnection.',
      verificationReqs: ['Hybrid Logical Clock (HLC) Timestamps', 'CRDT State Merge Engine', 'IndexedDB Delta Compaction', 'Service Worker Background Sync'],
      minScore: 80
    }
  },
  'Data & Analytics Engineer': {
    'Beginner': {
      name: 'Automated Financial & Sales KPI Pipeline',
      description: 'Ingest dirty CSV/Excel transaction exports, normalize currencies and dates, and compute cohort retention and margin KPIs.',
      techStack: 'Python, Pandas, SQLite, Matplotlib / Plotly',
      problem: 'Manual spreadsheet consolidation introduces formula errors and unstandardized date/currency formats.',
      deliverable: 'Automated Python ETL script producing validated SQLite tables and executive KPI summary reports.',
      verificationReqs: ['Schema & Null Sanitization Pipeline', 'Multi-Currency Normalization', 'Cohort Retention Matrix Calculation', 'Automated Data Quality Assertions'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Warehouse Star-Schema & Analytical SQL Engine',
      description: 'Design a dimensional data warehouse with Slowly Changing Dimensions (SCD Type 2) and window-function analytics.',
      techStack: 'PostgreSQL, SQL, Python, dbt-style Transformations',
      problem: 'Querying raw OLTP tables for historical revenue trends causes table locks and inaccurate point-in-time attribution.',
      deliverable: 'Star-schema warehouse (`fact_orders`, `dim_customer`, `dim_product`) with SCD Type 2 history tracking.',
      verificationReqs: ['SCD Type 2 Effective-Date Versioning', 'SQL Window Function Revenue Rollups', 'Composite B-Tree & Partition Indexing', 'Idempotent Incremental Backfill'],
      minScore: 80
    },
    'Advanced': {
      name: 'Real-Time Clickstream & Anomaly Detection Pipeline',
      description: 'Process high-velocity user event streams with tumbling/sliding windows and Z-score anomaly alerting.',
      techStack: 'Python, Apache Kafka / Redis Streams, DuckDB, FastAPI',
      problem: 'Batch overnight analytics detect checkout funnel drops hours after revenue is already lost.',
      deliverable: 'Streaming aggregator with watermark handling, late-event deduplication, and real-time anomaly alerts.',
      verificationReqs: ['Event-Time Watermark Windowing', 'HyperLogLog Unique Visitor Estimation', 'Rolling Z-Score Anomaly Detector', 'Dead-Letter Poison Pill Isolation'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Lakehouse Data Governance & Lineage Catalog',
      description: 'Build a metadata catalog enforcing column-level PII masking, schema evolution rules, and DAG lineage graphs.',
      techStack: 'Python, Parquet / DuckDB, FastAPI, React',
      problem: 'Uncontrolled schema changes break downstream BI dashboards and expose unmasked PII columns to analysts.',
      deliverable: 'Data governance service with automated PII classification, backward-compatibility checks, and DAG lineage visualization.',
      verificationReqs: ['Column-Level SHA-256 PII Masking', 'Schema Evolution Compatibility Gate', 'Upstream/Downstream DAG Lineage Graph', 'Audit Log Compliance Exporter'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Natural-Language-to-SQL Semantic Warehouse Copilot',
      description: 'Construct a schema-aware analytical copilot that translates business questions into validated, read-only SQL with citation provenance.',
      techStack: 'Python, PostgreSQL, Vector Embeddings, AST SQL Validator',
      problem: 'Business stakeholders wait days for ad-hoc SQL reports while naive text-to-SQL models hallucinate table joins.',
      deliverable: 'Semantic SQL copilot with AST read-only guardrails, cost estimation, and automated chart generation.',
      verificationReqs: ['Semantic Schema & Metric Retriever', 'Read-Only SQL AST Security Gate', 'Query Cost & Row-Limit Guard', 'Self-Correcting Execution Loop'],
      minScore: 80
    }
  },
  'Cloud & DevOps Architect': {
    'Beginner': {
      name: 'Multi-Stage Containerized Microservice & CI Pipeline',
      description: 'Package a polyglot web service into distroless multi-stage Docker images with automated lint, test, and vulnerability gates.',
      techStack: 'Docker, GitHub Actions, Node.js / Python, Shell',
      problem: 'Bloated container images running as root expose production clusters to CVE exploits and slow cold-start scaling.',
      deliverable: 'Hardened multi-stage Dockerfile, compose stack, and CI workflow enforcing zero-downtime healthchecks.',
      verificationReqs: ['Non-Root Distroless Multi-Stage Build', 'Deterministic Lockfile Layer Caching', 'CI Test & Trivy Vulnerability Gate', 'Liveness & Readiness Probe Endpoints'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Infrastructure-as-Code VPC & Blue/Green Deployment Engine',
      description: 'Provision isolated multi-AZ network topologies and automate zero-downtime blue/green traffic shifting with automated rollback.',
      techStack: 'Terraform, Kubernetes / Docker Swarm, NGINX, Prometheus',
      problem: 'Manual server configuration causes environment drift and dropped connections during production releases.',
      deliverable: 'Declarative IaC modules with weighted canary/blue-green routing and automated error-rate rollback.',
      verificationReqs: ['Modular Terraform State & Plan Validator', 'Blue/Green Weighted Traffic Router', 'Automated 5xx Error-Budget Rollback', 'Prometheus Golden Signals Exporter'],
      minScore: 80
    },
    'Advanced': {
      name: 'Kubernetes Operator & Custom Autoscaler Controller',
      description: 'Build a reconciliation control loop that scales worker pods based on queue lag and SLO latency budgets rather than raw CPU.',
      techStack: 'TypeScript / Go, Kubernetes API, Redis, Prometheus',
      problem: 'CPU-based autoscalers react too slowly to message queue bursts, causing SLA violations before new pods warm up.',
      deliverable: 'Custom Kubernetes controller reconciling desired replica counts with cooldown hysteresis and PDB enforcement.',
      verificationReqs: ['Idempotent Level-Triggered Reconciler', 'Queue-Depth & P99 Latency Scaling Formula', 'Scale-Down Stabilization Window', 'PodDisruptionBudget Safety Guard'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Multi-Region Active-Active Chaos & Failover Mesh',
      description: 'Architect a multi-region traffic controller with health-checked DNS failover, circuit breaking, and automated chaos fault injection.',
      techStack: 'TypeScript / Go, Envoy / NGINX, Redis, OpenTelemetry',
      problem: 'Regional cloud outages take down single-region platforms when failover playbooks are manual and untested.',
      deliverable: 'Active-active control plane surviving simulated regional blackholes within a strict <15s RTO budget.',
      verificationReqs: ['Outlier Detection & Circuit Breaker Ejection', 'Automated Regional Evacuation State Machine', 'Chaos Latency & Fault Injection Harness', 'SLO Burn-Rate Multi-Window Alerting'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Autonomous AIOps Self-Healing Incident Responder',
      description: 'Correlate distributed traces, logs, and deployment diffs to automatically pinpoint root causes and execute safe remediation runbooks.',
      techStack: 'Python / TypeScript, OpenTelemetry, Prometheus, GitOps API',
      problem: 'On-call engineers face alert storms during cascading microservice failures, delaying root-cause isolation.',
      deliverable: 'Self-healing SRE agent that isolates anomalous deployment commits and triggers gated GitOps rollbacks.',
      verificationReqs: ['Trace-to-Commit Anomaly Correlation', 'Blast-Radius Graph Traversal', 'Human-in-the-Loop / Policy-Gated Rollback', 'Automated Post-Mortem Timeline Generator'],
      minScore: 80
    }
  },
  'IoT & Embedded Systems Engineer': {
    'Beginner': {
      name: 'Deterministic Sensor Telemetry & Ring-Buffer Firmware',
      description: 'Implement a fixed-memory circular buffer, ADC sensor calibration filter, and binary packet framing with CRC-16 checksums.',
      techStack: 'C / Python / TypeScript Embedded Simulator, Binary Framing',
      problem: 'Unbuffered sensor polling and unvalidated serial frames cause dropped readings and corrupted telemetry.',
      deliverable: 'Zero-allocation ring buffer and packet framer with moving-average noise filtering and CRC verification.',
      verificationReqs: ['Lock-Free Circular Ring Buffer', 'ADC Moving-Average & Outlier Filter', 'CRC-16 Packet Framing & Parser', 'Watchdog Heartbeat Timer'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Industrial MQTT Fleet Broker & Shadow State Synchronizer',
      description: 'Build an IoT device shadow service handling QoS 1/2 delivery, Last-Will-and-Testament offline alerts, and delta state sync.',
      techStack: 'TypeScript / Python, MQTT, SQLite / TimeSeries DB',
      problem: 'Intermittent cellular/LoRaWAN connectivity causes desired configuration changes to desynchronize from field devices.',
      deliverable: 'Device shadow broker reconciling `reported` vs `desired` state deltas with idempotent sequence numbers.',
      verificationReqs: ['MQTT Topic Wildcard Router (+ and #)', 'Reported vs Desired Shadow Delta Engine', 'QoS 1 PUBACK Retry & Deduplication', 'Last-Will-and-Testament Offline Monitor'],
      minScore: 80
    },
    'Advanced': {
      name: 'Edge TinyML Predictive Maintenance Anomaly Detector',
      description: 'Run quantized vibration/thermal inference on resource-constrained edge nodes to detect bearing wear before hardware failure.',
      techStack: 'Python / C, DSP FFT Windowing, Quantized Int8 Inference',
      problem: 'Streaming raw high-frequency vibration waveforms to the cloud saturates bandwidth and drains battery budgets.',
      deliverable: 'On-device DSP feature extractor and int8 quantized classifier transmitting only compact anomaly alerts.',
      verificationReqs: ['Sliding-Window FFT Spectral Feature Extractor', 'Int8 Quantized Inference Pipeline', 'Adaptive Duty-Cycle Power Governor', 'Store-and-Forward Offline Telemetry Queue'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Cryptographically Signed A/B OTA Firmware Updater',
      description: 'Design a fault-tolerant Over-The-Air update engine with Ed25519 signature verification, anti-rollback counters, and A/B partition fallback.',
      techStack: 'Python / C / Rust, Ed25519 / SHA-256, Dual-Bank Bootloader Sim',
      problem: 'Power loss or tampered payloads during firmware updates brick field fleets requiring expensive truck rolls.',
      deliverable: 'Dual-bank OTA bootloader simulator verifying cryptographic manifests and automatically reverting on boot-health failure.',
      verificationReqs: ['SHA-256 Chunk & Ed25519 Manifest Verification', 'Monotonic Anti-Rollback Version Fuse', 'Atomic A/B Partition Boot Switch', 'Self-Test Health Check & Automatic Revert'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Decentralized Swarm Mesh & Time-Sensitive Networking (TSN) Coordinator',
      description: 'Coordinate autonomous edge nodes using IEEE 802.1AS clock synchronization and consensus-based swarm task allocation.',
      techStack: 'Python / Rust / TypeScript, PTP Clock Sync, Mesh Routing',
      problem: 'Single-gateway star topologies fail in dead zones and cannot coordinate sub-millisecond robotic actuation.',
      deliverable: 'Self-healing mesh routing simulator with PTP clock offset compensation and distributed task auctioning.',
      verificationReqs: ['PTP Master-Slave Clock Offset Estimator', 'Multi-Hop Mesh Link-Quality Router', 'Distributed Auction Task Allocator', 'Byzantine Fault-Tolerant Sensor Fusion'],
      minScore: 80
    }
  },
  'Quantitative & FinTech Engineer': {
    'Beginner': {
      name: 'Deterministic Limit Order Book & VWAP Execution Analytics',
      description: 'Implement a price-time priority Limit Order Book (LOB) and compute real-time VWAP, TWAP, and bid-ask spread micro-price metrics.',
      techStack: 'Python / TypeScript, Decimal Fixed-Point Math',
      problem: 'Floating-point price representations and naive array sorting cause penny drift and slow order matching.',
      deliverable: 'Tick-accurate LOB engine supporting limit, market, and cancel orders with deterministic trade tape generation.',
      verificationReqs: ['Price-Time Priority Matching Queue', 'Fixed-Point Tick Price Arithmetic', 'VWAP & Micro-Price Imbalance Calculator', 'Partial Fill & Order Cancel Lifecycle'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Event-Driven Strategy Backtester with Zero Look-Ahead Bias',
      description: 'Build an institutional backtesting harness modeling Almgren-Chriss market impact, maker/taker fees, and walk-forward Sharpe/Sortino ratios.',
      techStack: 'Python, NumPy, Pandas, Event Queue Architecture',
      problem: 'Vectorized backtests accidentally leak future bar close prices and ignore slippage, producing unrealistic paper returns.',
      deliverable: 'Strict point-in-time event backtester outputting drawdown curves, turnover, and deflated Sharpe metrics.',
      verificationReqs: ['Strict Point-in-Time Event Loop', 'Square-Root Market Impact & Slippage Model', 'Sharpe, Sortino & Max Drawdown Engine', 'Walk-Forward Cross-Validation Splitter'],
      minScore: 80
    },
    'Advanced': {
      name: 'Options Greeks, Implied Volatility Surface & VaR Risk Engine',
      description: 'Price European/American derivatives via Black-Scholes and Newton-Raphson IV solvers, and compute portfolio Value-at-Risk (VaR) and Expected Shortfall.',
      techStack: 'Python / C++ / TypeScript, Numerical Optimization, Monte Carlo',
      problem: 'Unhedged gamma/vega exposures and fat-tailed market shocks wipe out portfolios during volatility spikes.',
      deliverable: 'Real-time derivatives risk engine computing analytical Greeks, arbitrage-free IV surfaces, and 99% CVaR.',
      verificationReqs: ['Black-Scholes Analytical Greeks (Delta, Gamma, Vega, Theta)', 'Newton-Raphson / Brent Implied Volatility Solver', 'Historical & Monte Carlo 99% Expected Shortfall', 'Delta-Gamma Hedge Rebalancing Simulator'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Pre-Trade Kill-Switch & Smart Order Router (SOR)',
      description: 'Architect an ultra-low-latency risk gateway enforcing fat-finger notional limits, position caps, and multi-venue liquidity routing.',
      techStack: 'C++ / Rust / Python, FIX / ITCH Protocol Parser, Lock-Free Ring',
      problem: 'Runaway algorithmic loops can submit millions of dollars in erroneous orders in milliseconds without hardware/gateway risk checks.',
      deliverable: 'Sub-microsecond pre-trade risk gate and Smart Order Router splitting child orders across lit and dark venues.',
      verificationReqs: ['FIX / Binary ITCH Frame Parser', 'Pre-Trade Fat-Finger & Net Position Gate', 'Fee-Adjusted Multi-Venue Smart Order Router', 'Automated Circuit-Breaker Kill Switch'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'Avellaneda-Stoikov High-Frequency Market Making Simulator',
      description: 'Deploy an inventory-aware market making engine that dynamically skews reservation prices and bid-ask spreads based on order-flow toxicity (VPIN).',
      techStack: 'Python / Rust, Stochastic Control, Hawkes Process / VPIN',
      problem: 'Static bid-ask quotes get adversely selected by informed toxic flow and accumulate catastrophic one-sided inventory.',
      deliverable: 'Adaptive market maker optimizing inventory half-life and spread skew under simulated toxic flow regimes.',
      verificationReqs: ['Avellaneda-Stoikov Reservation Price Skew', 'Order-Book Imbalance & VPIN Toxicity Detector', 'Inventory Penalty & Adverse Selection Tracker', 'PnL Attribution (Spread Capture vs Inventory Markout)'],
      minScore: 80
    }
  },
  'Blockchain & Web3 Developer': {
    'Beginner': {
      name: 'Cryptographic Merkle Tree & UTXO Block Validator',
      description: 'Build a deterministic SHA-256 Merkle proof generator, digital signature verifier, and double-spend transaction validator.',
      techStack: 'TypeScript / Python, SHA-256, ECDSA / Ed25519',
      problem: 'Light clients cannot download multi-terabyte block histories to verify whether a single transaction was included.',
      deliverable: 'Merkle inclusion proof engine and block header validator with deterministic nonce/difficulty verification.',
      verificationReqs: ['Odd-Leaf Safe SHA-256 Merkle Tree Builder', 'Logarithmic Merkle Inclusion Proof Verifier', 'Nonce & Replay Attack Transaction Guard', 'Deterministic Block Header State Transition'],
      minScore: 80
    },
    'Intermediate': {
      name: 'Hardened ERC-20 / Vault Smart Contract & Reentrancy Guard',
      description: 'Engineer a tokenized vault implementing Checks-Effects-Interactions, role-based pause circuit breakers, and share-inflation protection.',
      techStack: 'Solidity / TypeScript EVM Simulator, Hardhat / Foundry Patterns',
      problem: 'External calls before state updates and unguarded initial deposits allow attackers to drain DeFi vaults.',
      deliverable: 'Audited smart contract suite with reentrancy mutexes, virtual share offsets, and invariant fuzz tests.',
      verificationReqs: ['Checks-Effects-Interactions & Reentrancy Mutex', 'ERC-4626 Virtual Offset Share Calculation', 'Role-Based Emergency Pause Circuit Breaker', 'Adversarial Exploit & Invariant Test Suite'],
      minScore: 80
    },
    'Advanced': {
      name: 'Constant-Product AMM DEX & Flash-Loan Arbitrage Guard',
      description: 'Implement an x * y = k Automated Market Maker with LP fee accrual, TWAP oracle accumulators, and slippage protection.',
      techStack: 'Solidity / TypeScript, Fixed-Point Q64.96 Math',
      problem: 'Spot-price manipulation within a single block allows flash-loan attackers to drain lending protocols.',
      deliverable: 'AMM liquidity pool engine with geometric-mean TWAP price accumulators and deadline/slippage guards.',
      verificationReqs: ['Constant-Product Swap & Fee Invariant Check', 'Time-Weighted Average Price (TWAP) Accumulator', 'Minimum Output Slippage & Deadline Enforcement', 'Impermanent Loss & LP Share Accounting'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Multi-Sig Governance Treasury & Timelock Execution Engine',
      description: 'Build an institutional M-of-N threshold treasury with EIP-712 typed-data replay protection and mandatory timelock delay queues.',
      techStack: 'TypeScript / Solidity, EIP-712 Signatures, Merkle Airdrops',
      problem: 'Single-key admin privileges and instant governance execution allow compromised keys to rug-pull protocol treasuries.',
      deliverable: 'M-of-N multi-signature timelock controller with signature deduplication, expiry windows, and cancellation roles.',
      verificationReqs: ['EIP-712 Domain-Separated Signature Verifier', 'Strict Signer Deduplication & M-of-N Threshold', 'Timelock Queue, Eta Delay & Grace Period', 'Emergency Guardian Cancel & Audit Trail'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'ERC-4337 Account Abstraction Bundler & ZK-Rollup State Batcher',
      description: 'Construct a smart-account UserOperation bundler with gas-sponsoring Paymaster validation and state-root batch compression.',
      techStack: 'TypeScript / Rust, ERC-4337 EntryPoint, Poseidon / Merkle State Tree',
      problem: 'Seed phrases and native-token gas requirements block mainstream adoption and incur high L1 calldata costs.',
      deliverable: 'Account abstraction simulator validating session keys, paymaster gas sponsorship, and L2 batch state roots.',
      verificationReqs: ['UserOperation Nonce & Gas Validation Loop', 'Verifying Paymaster Sponsorship Policy', 'Session-Key Scoped Permission Enforcer', 'L2 Calldata Compression & State Root Verifier'],
      minScore: 80
    }
  },
  'Commerce, Finance & ERP Strategist': {
    'Beginner': {
      name: 'Automated Double-Entry Ledger & Three-Statement Financial Engine',
      description: 'Build a zero-imbalance double-entry bookkeeping engine that posts journal vouchers and generates linked P&L, Balance Sheet, and Cash Flow statements.',
      techStack: 'Python / Excel Analytics, Accounting Ledger Engine',
      problem: 'Manual journal spreadsheets suffer from unlinked trial balances and out-of-balance assets vs liabilities.',
      deliverable: 'Automated accounting engine enforcing total Debits == total Credits with working-capital cash flow reconciliation.',
      verificationReqs: ['Strict Double-Entry Trial Balance Validator', 'Accrual Revenue & Depreciation Adjuster', 'Linked P&L, Balance Sheet & Indirect Cash Flow', 'Working Capital Cash Conversion Cycle KPIs'],
      minScore: 80
    },
    'Intermediate': {
      name: 'GST / Indirect Tax Input Credit Reconciler & Corporate Tax Shield Model',
      description: 'Reconcile supplier GSTR-2B invoices against purchase registers, flag ITC mismatches, and model ASC 740 / IAS 12 deferred tax assets and liabilities.',
      techStack: 'Python, SQL, ERP Tax Compliance Engine',
      problem: 'Unreconciled vendor invoices and timing differences trigger statutory tax penalties and blocked working capital.',
      deliverable: 'Automated tax compliance engine matching invoice GSTINs, computing CGST/SGST/IGST set-off waterfalls, and tracking DTA/DTL schedules.',
      verificationReqs: ['GSTR-2B vs Purchase Register Fuzzy/Exact Matcher', 'IGST/CGST/SGST Cross-Utilization Waterfall', 'ASC 740 / IAS 12 Temporary Difference DTA/DTL Engine', 'Effective Tax Rate (ETR) Reconciliation Report'],
      minScore: 80
    },
    'Advanced': {
      name: 'DCF Valuation, M&A Accretion/Dilution & Monte Carlo Capital Model',
      description: 'Construct an institutional corporate finance suite computing WACC, multi-stage FCFF discounted cash flows, LBO debt schedules, and EPS accretion/dilution.',
      techStack: 'Python, Financial Modeling, Sensitivity Matrix Engine',
      problem: 'Single-point valuation models ignore WACC/terminal-growth sensitivity and debt covenant breach probabilities.',
      deliverable: 'Dynamic valuation and M&A modeling engine with 2D sensitivity matrices and synergy break-even calculators.',
      verificationReqs: ['CAPM Unlevered/Relevered Beta & WACC Engine', 'Two-Stage FCFF DCF & Terminal Value Sanity Check', 'M&A Cash/Stock EPS Accretion-Dilution Model', '2D WACC vs Terminal Growth Sensitivity Grid'],
      minScore: 80
    },
    'Enterprise': {
      name: 'Forensic Audit Benford Scanner, SOX 404 Matrix & Basel III Treasury Engine',
      description: 'Combine statutory audit forensics (Benford chi-square, Monetary Unit Sampling) with banking treasury LCR, duration gap, and IFRS 9 ECL provisioning.',
      techStack: 'Python, SQL, Forensic Assurance & Treasury Risk Suite',
      problem: 'Split-invoice procurement fraud and unhedged interest-rate duration gaps evade manual sampling audits.',
      deliverable: 'Enterprise assurance and treasury platform flagging split-PO fraud, SOX segregation-of-duties conflicts, and Basel III capital buffers.',
      verificationReqs: ['Benford First-Digit & Split-Invoice Fraud Detector', 'SOX 404 Segregation-of-Duties Conflict Matrix', 'Monetary Unit Sampling (MUS) Upper Error Limit', 'Basel III LCR & IFRS 9 Expected Credit Loss Engine'],
      minScore: 80
    },
    'Future-Tech': {
      name: 'AI-Driven Autonomous ERP Supply-Chain & Revenue Operations Control Tower',
      description: 'Integrate predictive demand forecasting, safety-stock EOQ/ROP optimization, SaaS LTV:CAC unit economics, and automated ERP exception workflows.',
      techStack: 'Python, Operations Research, Predictive ERP Analytics',
      problem: 'Siloed sales, inventory, and finance teams react too late to bullwhip supply shocks and customer churn.',
      deliverable: 'Unified business control tower optimizing multi-warehouse reorder points, RFM churn playbooks, and AI governance ROI.',
      verificationReqs: ['Service-Level Safety Stock & EOQ/ROP Optimizer', 'Multi-Touch Attribution & LTV:CAC Payback Engine', 'Three-Way PO-GRN-Invoice Automated ERP Matcher', 'AI Governance Risk & ROI NPV Scorecard'],
      minScore: 80
    }
  }
};

export function getGuideStepsForProject(name: string, goal: string = 'AI Engineer') {
  const defaultData = {
    steps: [
      'Initialize your repository and set up your local development environment.',
      'Implement the foundational data schemas and REST API endpoints.',
      'Integrate authentication, configuration files, and database queries.',
      'Construct the user interface or CLI handlers to interact with your backend.',
      'Write end-to-end integration tests and publish your code to GitHub.'
    ],
    tips: [
      'Keep your commits atomic and write clear, concise commit messages.',
      'Ensure all environment variables are loaded via `.env.example` templates.',
      'Include a detailed `README.md` with system architecture diagrams.'
    ],
    reqs: [
      'Git repository with clean commit history',
      'Environment variable configuration template (`.env.example`)',
      'Comprehensive `README.md` documentation',
      'Automated unit/integration test suite passing'
    ],
    minScore: 80
  };

  const projectGuides: Record<string, { steps: string[]; tips: string[]; reqs: string[]; minScore: number }> = {
    'AI Resume Analyzer': {
      steps: [
        'Set up a Python environment with `pdfplumber` and `spacy` or `transformers`.',
        'Build a text extraction module to parse PDF and DOCX resume files into structured text.',
        'Implement TF-IDF or cosine similarity matching between resume skills and Job Description keywords.',
        'Create a scoring algorithm that rates ATS match percentage and highlights missing hard skills.',
        'Build a minimal Streamlit or React frontend to upload resumes and render match reports.'
      ],
      tips: [
        'Handle multi-column PDF layouts cleanly by sorting text blocks by vertical coordinates.',
        'Normalize skill strings (e.g., "React.js" -> "React", "NodeJS" -> "Node.js") for accurate matching.'
      ],
      reqs: ['PDF Text Parser', 'Keyword Similarity Calculation', 'ATS Score Generator', 'Missing Skills Output', 'Interactive UI/CLI'],
      minScore: 80
    },
    'RAG Knowledge-Base Chatbot': {
      steps: [
        'Choose a vector store (Qdrant, ChromaDB, or Pinecone) and initialize an index.',
        'Build a document ingestion pipeline to chunk markdown/PDF files into 500-token chunks with overlap.',
        'Generate embeddings using OpenAI embeddings or SentenceTransformers (`all-MiniLM-L6-v2`).',
        'Construct a retrieval API query endpoint that performs similarity search on user questions.',
        'Pass retrieved context chunks into an LLM prompt and stream the grounded answer to the user.'
      ],
      tips: [
        'Use semantic chunking instead of naive character counts for better context retrieval.',
        'Implement fallback prompts when vector similarity scores drop below 0.7.'
      ],
      reqs: ['Document Ingestion Pipeline', 'Vector Store Indexing', 'Context Retrieval Engine', 'LLM Prompt Builder', 'Streaming Chat UI'],
      minScore: 80
    },
    'Argon2 Authentication Portal': {
      steps: [
        'Set up a Node.js/Go backend with support for Argon2id password hashing.',
        'Create database schemas for User profiles, session tokens, and refresh tokens.',
        'Build `/register` and `/login` endpoints with rate-limiting and input sanitization.',
        'Implement short-lived JWT access tokens alongside HTTP-only secure refresh cookies.',
        'Add a React login frontend with password strength meters and CSRF token protection.'
      ],
      tips: [
        'Tune Argon2id memory cost and time cost parameters to balance security and server latency.',
        'Never store raw password strings anywhere in memory or logs during authentication.'
      ],
      reqs: ['Argon2id Password Hashing', 'JWT Access & Refresh Strategy', 'Rate Limiting Middleware', 'CSRF Protection', 'React Auth UI'],
      minScore: 80
    },
    'Payment Webhook Broker': {
      steps: [
        'Create a lightweight web server (Go or Node.js) with endpoints for receiving webhooks.',
        'Implement cryptographic signature verification (HMAC-SHA256) for incoming payload headers.',
        'Set up a background worker queue (Redis / BullMQ) to process event webhooks asynchronously.',
        'Build idempotency key checks to prevent duplicate charge processing on webhook retries.',
        'Create a dashboard view displaying incoming webhook statuses, retry logs, and failure alerts.'
      ],
      tips: [
        'Always return a 200 OK fast response to the payment gateway before starting heavy processing.',
        'Use exponential backoff timing for webhook retry attempts.'
      ],
      reqs: ['HMAC Signature Validation', 'Asynchronous Task Queue', 'Idempotency Key Verification', 'Retry Logic Handler', 'Dashboard Logs UI'],
      minScore: 80
    }
  };

  for (const [, levels] of Object.entries(SWAP_POOLS)) {
    for (const [, p] of Object.entries(levels)) {
      if (p.name && !projectGuides[p.name]) {
        projectGuides[p.name] = {
          steps: [
            `Initialize the ${p.name} repository using ${p.techStack || 'your target stack'} and configure deterministic linting and test runners.`,
            `Model the core domain types and implement the primary data structures to solve: ${p.problem || 'core system constraints'}.`,
            `Implement the verification gates: ${(p.verificationReqs || []).slice(0, 2).join(' and ')}.`,
            `Complete the remaining production modules: ${(p.verificationReqs || []).slice(2).join(', ')} and build "${p.deliverable || 'the final deliverable'}".`,
            `Run unit and edge-case regression tests, document architecture trade-offs in README.md, and publish to GitHub.`
          ],
          tips: [
            `Ensure every requirement in [${(p.verificationReqs || []).join(', ')}] has a dedicated unit test.`,
            `Use deterministic inputs and avoid hardcoded secrets or environment-specific paths.`
          ],
          reqs: p.verificationReqs || defaultData.reqs,
          minScore: p.minScore || 80
        };
      }
    }
  }

  return projectGuides[name] || defaultData;
}
