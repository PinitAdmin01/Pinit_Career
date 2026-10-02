import { DayConfig } from './curriculumEnricher';

/**
 * High-Scale Distributed System Design (course-distributed-sys, prefix: dist):
 * 30 course days covering distributed computing fallacies, CAP & PACELC theorems,
 * gRPC/Protobuf RPC communication, consistent hashing with virtual nodes,
 * distributed caching with cache-aside and thundering herd mitigation,
 * Redis Redlock & fencing tokens, leader election with Raft and Bully algorithms,
 * distributed ID generation (Snowflake & ULID), Raft consensus & log replication,
 * 2PC/3PC atomic commit protocols, Saga orchestration and choreography,
 * Kafka event streaming, message delivery guarantees and idempotency keys,
 * Dead Letter Queues, physical vs logical clocks (Lamport & Vector clocks),
 * CRDTs, database sharding, replication lag & read-your-own-writes consistency,
 * circuit breakers and bulkhead isolation, SWIM failure detection gossip protocols,
 * weighted load balancing algorithms, service discovery, API gateways & BFF patterns,
 * OpenTelemetry distributed tracing, consistency models, and global financial trading capstone.
 *
 * Practice tasks are in distributed30DayData.ts; lessons in distributedWebLongLessons.ts.
 */
export const DISTRIBUTED_DAYS: DayConfig[] = [
  {
    "day": 1,
    "title": "Distributed Systems Foundations & Fallacies",
    "desc": "Understand the 8 fallacies of distributed computing: network reliability, zero latency, infinite bandwidth, and single administrator topology.",
    "syllabus": [
      "The 8 Fallacies of Distributed Computing (L. Peter Deutsch).",
      "Network Partitions & Timeout handling with exponential backoff.",
      "Idempotency and retry semantics over unreliable networks."
    ]
  },
  {
    "day": 2,
    "title": "The CAP Theorem & PACELC Theorem",
    "desc": "Analyze Consistency, Availability, Partition tolerance trade-offs and PACELC (If Partition: Availability or Consistency; Else: Latency or Consistency).",
    "syllabus": [
      "CAP Theorem: In the presence of a network partition (P), choose Consistency (CP) or Availability (AP).",
      "PACELC Theorem: In normal operation (E), trade off Latency (L) vs Consistency (C).",
      "Real-world mappings: DynamoDB (PA/EL), Spanner (PC/EC), Cassandra (PA/EL), MongoDB (PC/EC)."
    ]
  },
  {
    "day": 3,
    "title": "RPC Communication & Protocol Buffers Binary Serialization",
    "desc": "Design compact binary serialization interfaces, gRPC streaming, and HTTP/2 multiplexed Remote Procedure Calls.",
    "syllabus": [
      "JSON (Verbose text) vs Protocol Buffers (Compact binary wire format).",
      "gRPC 4 Communication Modes: Unary, Server Streaming, Client Streaming, Bidirectional.",
      "HTTP/2 Multiplexing: Eliminating Head-of-Line blocking across a single TCP connection."
    ]
  },
  {
    "day": 4,
    "title": "Consistent Hashing & Virtual Nodes Distribution",
    "desc": "Distribute billions of keys across dynamic server clusters with Consistent Hashing rings and virtual nodes to eliminate hash remap storms ($K/N$ migration).",
    "syllabus": [
      "Modulo Hashing ($K \\pmod N$) disaster: Adding 1 node forces 99% key reshuffle.",
      "Consistent Hash Ring: Mapping keys and nodes onto $[0, 2^{32}-1]$ integer circle.",
      "Virtual Nodes (V-Nodes): Ensuring uniform load distribution across heterogeneous nodes."
    ]
  },
  {
    "day": 5,
    "title": "⭐ MILESTONE 1: High-Performance Distributed Cache with Cache-Aside & Thundering Herd Defense",
    "desc": "Milestone 1: Build a production distributed cache layer: Cache-Aside pattern, Write-Through / Write-Back replication, TTL jitter, and Mutex Singleflight to completely eliminate Thundering Herd stampedes.",
    "syllabus": [
      "Cache-Aside (Lazy loading) vs Write-Through vs Write-Back (Write-Behind).",
      "Cache Stampede (Thundering Herd): 10,000 requests hit database simultaneously on cache key expiration.",
      "Singleflight Mutex: Merging concurrent identical key misses into a single database fetch."
    ]
  },
  {
    "day": 6,
    "title": "Distributed Locks: Redis Redlock & Fencing Tokens",
    "desc": "Acquire cluster-wide mutual exclusion locks safely using Redis Redlock algorithm, TTL leases, auto-renew heartbeats, and monotonic Fencing Tokens.",
    "syllabus": [
      "The distributed lock dilemma: GC pauses and network delays causing split-brain race conditions (Martin Kleppmann critique).",
      "Redis Redlock Algorithm: Acquiring lock across $N/2 + 1$ independent Redis masters.",
      "Fencing Tokens: Monotonically increasing integers validating storage write ordering."
    ]
  },
  {
    "day": 7,
    "title": "Leader Election: Bully Algorithm & Raft Heartbeats",
    "desc": "Coordinate distributed cluster leadership: Bully Algorithm (Highest node ID wins), Ring Election, and Raft randomized heartbeat elections.",
    "syllabus": [
      "Leader-Follower (Master-Replica) coordination topology.",
      "The Bully Algorithm: Highest process ID broadcasts `COORDINATOR` message.",
      "Split-Brain Prevention: Requiring strict majority quorum ($N/2 + 1$) to elect leader."
    ]
  },
  {
    "day": 8,
    "title": "Distributed Unique ID Generation: Twitter Snowflake & ULID",
    "desc": "Generate 64-bit globally unique, roughly time-sorted integers without central coordination using Twitter Snowflake (Timestamp + Worker ID + Sequence).",
    "syllabus": [
      "UUIDv4 (128-bit random, bad database B-Tree index fragmentation) vs Snowflake (64-bit time-ordered).",
      "Snowflake Bit Layout: 1 bit sign | 41 bits timestamp (69 years) | 10 bits machine/datacenter ID (1024 workers) | 12 bits sequence (4096 IDs/ms).",
      "Clock Backward Drift (NTP rewind) handling."
    ]
  },
  {
    "day": 9,
    "title": "Consensus Protocols: Raft Log Replication & Quorum Mathematics",
    "desc": "Replicate distributed state machine logs safely with Raft: Leader Term, Log Entry Index, Heartbeats, and Quorum Commit confirmation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Consensus Protocols: Raft Log Replication & Quorum Mathematics.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 10,
    "title": "Two-Phase Commit (2PC) vs Three-Phase Commit (3PC)",
    "desc": "Coordinate atomic multi-database transactions with Two-Phase Commit (Prepare $\\to$ Commit) and understand coordinator blocking failure modes.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Two-Phase Commit (2PC) vs Three-Phase Commit (3PC).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 11,
    "title": "The Saga Pattern: Orchestration vs Choreography & Compensating Actions",
    "desc": "Execute long-running distributed microservice transactions without 2PC blocking locks using Sagas and backward Compensating Transactions.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of The Saga Pattern: Orchestration vs Choreography & Compensating Actions.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 12,
    "title": "Event-Driven Messaging: Kafka Partitions & Consumer Group Rebalancing",
    "desc": "Scale streaming event throughput with Apache Kafka topic partitioning, consumer group rebalances, and partition key hashing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Event-Driven Messaging: Kafka Partitions & Consumer Group Rebalancing.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 13,
    "title": "Message Delivery Guarantees: At-Least-Once, At-Most-Once & Exactly-Once Idempotency",
    "desc": "Eliminate duplicate side-effects over at-least-once messaging queues using Idempotency Keys (SHA-256 hash in Redis) and transactional outbox.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Message Delivery Guarantees: At-Least-Once, At-Most-Once & Exactly-Once Idempotency.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 14,
    "title": "Dead Letter Queues (DLQ), Exponential Backoff & Poison Pill Handling",
    "desc": "Isolate malformed poison-pill messages into Dead Letter Queues (DLQs) after max retries with exponential backoff.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Dead Letter Queues (DLQ), Exponential Backoff & Poison Pill Handling.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 15,
    "title": "⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys",
    "desc": "Milestone 2: Build a production distributed event-driven engine: Kafka message consumer, Idempotent deduplication, Saga orchestrator with backward compensation rollbacks, and DLQ poison-pill isolation.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 2: Resilient Event-Driven Transaction Engine with Sagas & Idempotency Keys.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 16,
    "title": "Physical Clocks, NTP Drift, Lamport Timestamps & Vector Clocks",
    "desc": "Capture causal event ordering across nodes without physical clock synchronization using Lamport Timestamps and Vector Clocks.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Physical Clocks, NTP Drift, Lamport Timestamps & Vector Clocks.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 17,
    "title": "Conflict-Free Replicated Data Types (CRDTs): G-Counter, PN-Counter & LWW-Set",
    "desc": "Replicate collaborative data across disconnected nodes with guaranteed convergence using CRDTs (State-based PN-Counters and LWW-Registers).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Conflict-Free Replicated Data Types (CRDTs): G-Counter, PN-Counter & LWW-Set.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 18,
    "title": "Database Sharding Strategies: Range, Hash & Directory Sharding",
    "desc": "Partition massive database tables across multi-terabyte clusters with Hash Sharding, Range Sharding, and Directory Sharding lookup tables.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Database Sharding Strategies: Range, Hash & Directory Sharding.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 19,
    "title": "Read Replicas, Replication Lag & Read-Your-Own-Writes Consistency",
    "desc": "Scale database read throughput with Read Replicas while preventing stale data glitches using Read-Your-Own-Writes session routing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Read Replicas, Replication Lag & Read-Your-Own-Writes Consistency.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 20,
    "title": "Circuit Breakers (Resilience4j / Envoy) & Bulkhead Isolation",
    "desc": "Prevent cascading cluster outages with Circuit Breakers: Closed $\\to$ Open (Fail fast on threshold) $\\to$ Half-Open (Canary test requests) $\\to$ Closed.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Circuit Breakers (Resilience4j / Envoy) & Bulkhead Isolation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 21,
    "title": "⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway",
    "desc": "Milestone 3: Build a production distributed API Gateway edge: Token Bucket rate limiting in Redis, Circuit Breaker fail-fast trips, Bulkhead concurrent pool isolation, and CORS proxy routing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of ⭐ MILESTONE 3: Distributed Rate Limiter & Circuit Breaker API Gateway.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 22,
    "title": "Gossip Protocols: SWIM Failure Detection & Cluster Membership",
    "desc": "Discover dynamic cluster nodes and detect crash failures in $O(1)$ time with Gossip protocols (SWIM: Structured Weakly-consistent Infection-style Membership).",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Gossip Protocols: SWIM Failure Detection & Cluster Membership.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 23,
    "title": "Load Balancing Algorithms: Weighted Round-Robin, Least Connections & Consistent Hash Ring",
    "desc": "Balance cluster traffic across heterogeneous backend pools with Weighted Round-Robin, Least Connections, and IP Hash algorithms.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Load Balancing Algorithms: Weighted Round-Robin, Least Connections & Consistent Hash Ring.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 24,
    "title": "Service Discovery & Heartbeat Health Checking (Consul / Zookeeper)",
    "desc": "Register dynamic microservice instances with Service Discovery registries (Consul, Eureka, Zookeeper) and perform active health checking.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Service Discovery & Heartbeat Health Checking (Consul / Zookeeper).",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 25,
    "title": "API Gateways & Backend-For-Frontend (BFF) Pattern",
    "desc": "Aggregate backend microservices with Backend-For-Frontend (BFF) gateways: response stitching, protocol translation (gRPC to JSON), and CORS handling.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of API Gateways & Backend-For-Frontend (BFF) Pattern.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 26,
    "title": "Distributed Tracing: OpenTelemetry, W3C TraceContext & Span Propagation",
    "desc": "Trace distributed requests across microservice boundaries with OpenTelemetry, W3C `traceparent` headers, spans, and child contextual linking.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Distributed Tracing: OpenTelemetry, W3C TraceContext & Span Propagation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 27,
    "title": "Data Consistency Models: Linearizable vs Sequential vs Eventual Consistency",
    "desc": "Master consistency levels: Linearizability (Strict real-time global ordering), Sequential Consistency, and Eventual Consistency.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Data Consistency Models: Linearizable vs Sequential vs Eventual Consistency.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 28,
    "title": "Reverse Proxies & CDN Edge Caching with Cache-Control Invalidation",
    "desc": "Cache high-throughput assets globally with CDNs (Cloudflare, CloudFront, NGINX), `stale-while-revalidate`, and surrogate key invalidations.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Reverse Proxies & CDN Edge Caching with Cache-Control Invalidation.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 29,
    "title": "Disaster Recovery: Multi-Region Active-Passive vs Active-Active Deployments",
    "desc": "Architect multi-region failover (RPO: Recovery Point Objective & RTO: Recovery Time Objective) with DNS Anycast, DynamoDB Global Tables, and Aurora Multi-Region.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of Disaster Recovery: Multi-Region Active-Passive vs Active-Active Deployments.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  },
  {
    "day": 30,
    "title": "🏆 FINAL CAPSTONE: Enterprise Global Real-Time Financial Trading & Ledger Exchange Engine",
    "desc": "Final Capstone Synthesis: The complete distributed trading and financial ledger engine: Consistent Hashing partition routing, Raft consensus order replication, Saga rollback orchestrator, Monotonic Fencing Tokens, Singleflight Caching, and OpenTelemetry distributed tracing.",
    "syllabus": [
      "Core Foundations: Principles and mechanisms of 🏆 FINAL CAPSTONE: Enterprise Global Real-Time Financial Trading & Ledger Exchange Engine.",
      "Operational Architecture: Implementation details and execution flow.",
      "Production Best Practices: Safety checks, error handling, and performance optimization."
    ]
  }
];

export const DISTRIBUTED_WEB_DAYS: DayConfig[] = DISTRIBUTED_DAYS;
export const DIST_WEB_DAYS: DayConfig[] = DISTRIBUTED_DAYS;
