import { DayConfig } from './curriculumEnricher';

/**
 * High-Throughput Streaming in TypeScript (course-stream-web, prefix: stream-web):
 * 30 course days covering append-only event logs, offsets, producers and consumers,
 * partition key hashing, ordering guarantees, consumer groups and cooperative rebalancing,
 * offset commit strategies, delivery semantics (at-most-once, at-least-once, exactly-once),
 * idempotent producers, backpressure mechanics and bounded ring buffers, micro-batching
 * and linger time, compression algorithms (Snappy, LZ4, Zstandard), throughput vs latency
 * math, stateless stream transformations (map/filter/flatMap), windowing analytics
 * (tumbling, sliding, session windows), event time vs processing time, watermarks and
 * late event handling, local state stores and changelogs, stream-table duality (KStream/KTable),
 * stream-table and stream-stream joins, fault-tolerant state checkpointing and recovery,
 * schema registries and evolutionary serialization (Avro/Protobuf), dead-letter queues (DLQ)
 * and non-blocking retry topics, historical stream replay, consumer lag telemetry,
 * partition hotspotting, and the final capstone: a real-time financial fraud detection
 * and windowed analytics engine.
 *
 * Practice tasks are in streamWeb30DayData.ts; lessons in streamWebLongLessons.ts.
 */
export const STREAM_DAYS: DayConfig[] = [
  {
    day: 1,
    title: "Append-Only Event Logs & Sequential Offset Architecture",
    desc: "Understand the core architecture of distributed event logs: immutable append-only storage, sequential 64-bit offsets, and disk sequential I/O performance advantages.",
    syllabus: [
      "Append-Only Invariant: Why immutability guarantees extreme write throughput and deterministic replayability.",
      "Offset Mechanics: Monotonically increasing zero-indexed offsets serving as universal coordinate pointers.",
      "Sequential vs Random I/O: Leveraging OS page caches and sequential disk throughput over B-tree random writes."
    ]
  },
  {
    day: 2,
    title: "Event Producers, Partitions & Key-Based Hashing (MurmurHash)",
    desc: "Design scalable event producers that partition message streams using deterministic key hashing algorithms (MurmurHash3) and round-robin fallbacks.",
    syllabus: [
      "Partitioning Strategy: Distributing message load horizontally across independent append logs.",
      "Deterministic Hashing: Mapping message keys to partition IDs using MurmurHash3 modulo partition count.",
      "Round-Robin & Sticky Partitioner: Load-balancing null-keyed messages across batches without fragmenting network packets."
    ]
  },
  {
    day: 3,
    title: "Consumer Polling Loops & High-Water Mark Offset Tracking",
    desc: "Implement efficient pull-based consumer polling loops, understand High-Water Mark (HWM) replication boundaries, and fetch batch sizing.",
    syllabus: [
      "Pull vs Push Model: Why pull-based polling prevents consumer saturation and allows independent processing cadences.",
      "High-Water Mark (HWM): The replication boundary offset beyond which messages are safely committed across in-sync replicas.",
      "Poll Configuration: Tuning fetch.min.bytes, fetch.max.wait.ms, and max.poll.records to optimize batch efficiency."
    ]
  },
  {
    day: 4,
    title: "Partition Ordering Guarantees & Total vs Partial Ordering",
    desc: "Analyze stream ordering semantics: guaranteed total order within an individual partition versus partial non-deterministic ordering across partitions.",
    syllabus: [
      "Per-Partition Total Ordering: Strict FIFO guarantees preserved by monotonic offset assignment within a single partition.",
      "Global Partial Ordering: Why multi-partition topics cannot guarantee global chronology across distinct keys.",
      "Key Colocation: Enforcing entity-level strict serialization by hashing entity IDs (e.g. orderId) to consistent partitions."
    ]
  },
  {
    day: 5,
    title: "⭐ MILESTONE 1: High-Throughput In-Memory Partitioned Event Broker",
    desc: "Milestone 1: Build an end-to-end multi-partition event streaming broker with append-only logs, key hash routing, consumer offset subscriptions, and high-water mark validation.",
    syllabus: [
      "Broker Architecture: Designing multi-topic, multi-partition in-memory ring buffers with atomic offset sequencing.",
      "Producer Pipeline: Validating message headers, computing key hashes, and writing batches to matching partitions.",
      "Consumer Registry: Maintaining per-consumer offset cursors and serving bounded message slices up to high-water mark."
    ]
  },
  {
    day: 6,
    title: "Consumer Groups: Distributed Partition Assignment & Scalability",
    desc: "Scale stream consumption horizontally using Consumer Groups, where partitions are dynamically allocated across cooperating consumer instances.",
    syllabus: [
      "Consumer Group Concept: Multiple worker processes sharing a common groupId to divide topic partition processing.",
      "Partition Allocation Cardinality: Why a single partition can only be read by at most one consumer in a group.",
      "Scaling Limits: Why adding more consumer workers than topic partitions results in idle standby instances."
    ]
  },
  {
    day: 7,
    title: "Consumer Rebalancing Protocols: Eager vs Cooperative Sticky Rebalance",
    desc: "Examine group coordinator heartbeats, membership changes, eager stop-the-world rebalancing storms, and modern incremental cooperative sticky rebalancing.",
    syllabus: [
      "Group Coordinator & Heartbeats: Detecting node failures via session timeouts and periodic heartbeat pings.",
      "Eager Rebalance Storms: The performance cost of stopping all consumers and revoking all partition assignments.",
      "Cooperative Sticky Rebalancer: Incrementally migrating only affected partitions while unaffected consumers continue streaming."
    ]
  },
  {
    day: 8,
    title: "Offset Commit Strategies: Auto-Commit vs Synchronous vs Async Manual Commits",
    desc: "Evaluate offset commit mechanisms to prevent data loss or duplicate processing: auto-commit hazards, CommitSync blocking, and CommitAsync callbacks.",
    syllabus: [
      "Auto-Commit Hazards: Why enable.auto.commit can cause silent data loss if an application crashes mid-processing.",
      "Synchronous Commit (commitSync): Blocking thread execution until the offset is acknowledged by the broker.",
      "Asynchronous Commit (commitAsync): Non-blocking high-throughput offset commits with error callback handling."
    ]
  },
  {
    day: 9,
    title: "Delivery Semantics: At-Most-Once, At-Least-Once & Duplicate Handling",
    desc: "Compare streaming delivery guarantees (at-most-once vs at-least-once), identify failure vectors leading to duplicate messages, and establish retry policies.",
    syllabus: [
      "At-Most-Once Semantics: Committing offsets prior to message processing; guarantees no duplicates at the risk of message loss.",
      "At-Least-Once Semantics: Committing offsets only after successful message processing; guarantees no loss but introduces duplicates on crashes.",
      "Failure Modes: Network timeouts, consumer crash-restart loops, and rebalance-induced duplicate deliveries."
    ]
  },
  {
    day: 10,
    title: "⭐ MILESTONE 2: Idempotent Producer & Exactly-Once Consumer with Deduplication",
    desc: "Milestone 2: Construct an end-to-end exactly-once processing pipeline combining producer sequence IDs, atomic transactions, and consumer deduplication state stores.",
    syllabus: [
      "Idempotent Producer: Assigning producerId and monotonically increasing sequence numbers to eliminate network retry duplicates.",
      "Transactional Outbox: Atomically committing processed state updates and consumer offsets in a single atomic transaction.",
      "Deduplication Filter: Maintaining a bounded sliding-window Bloom filter or LRU cache of processed message IDs."
    ]
  },
  {
    day: 11,
    title: "Backpressure Mechanics: Bounded Ring Buffers & Producer Throttling",
    desc: "Implement flow control and backpressure mechanisms using bounded ring buffers, high/low watermarks, and non-blocking back-off to prevent Out-Of-Memory (OOM) crashes.",
    syllabus: [
      "Unbounded Queue Failure: How memory leaks and catastrophic OOM crashes occur when consumption lags ingestion.",
      "High/Low Watermark Flow Control: Pausing producer ingestion when buffer reaches 80% and resuming when drained to 40%.",
      "Reactive Pull-Based Streaming: Using async iterators and backpressure-aware streams in Node.js and TypeScript."
    ]
  },
  {
    day: 12,
    title: "Producer Micro-Batching, Linger Time & Dynamic Batch Sizing",
    desc: "Balance streaming throughput against end-to-end latency by tuning producer batch sizes (batch.size) and artificial linger delays (linger.ms).",
    syllabus: [
      "Batching Trade-Off: Amortizing network socket syscalls and packet overhead across hundreds of bundled messages.",
      "Linger Mechanics: Forcing the producer to pause for configurable milliseconds to allow small messages to accumulate into full batches.",
      "Dynamic Adaptive Batching: Automatically scaling batch limits up during traffic bursts and down during idle lulls."
    ]
  },
  {
    day: 13,
    title: "Stream Compression Trade-offs: Snappy, Gzip, LZ4 & Zstandard",
    desc: "Evaluate message compression algorithms across throughput, CPU consumption, and compression ratio, and understand batch-level compression mechanics.",
    syllabus: [
      "Compression Algorithms: Comparing LZ4 and Snappy (ultra-fast, low CPU) against Zstandard and Gzip (high compression ratio).",
      "Batch-Level Compression: Why compressing multi-message batches achieves vastly superior ratios over single-message compression.",
      "Network Bandwidth Economics: Reducing cross-datacenter and cloud egress costs while increasing effective cluster throughput."
    ]
  },
  {
    day: 14,
    title: "Throughput vs Latency Mathematics & Bandwidth-Delay Product",
    desc: "Model distributed stream performance mathematically using Little's Law, calculate Bandwidth-Delay Products (BDP), and analyze p99 latency trade-offs.",
    syllabus: [
      "Little's Law for Streaming: In-flight messages = Throughput (msg/sec) × Average End-to-End Latency (sec).",
      "Bandwidth-Delay Product (BDP): Sizing socket receive/send buffers to fully saturate high-bandwidth cloud networks.",
      "Tail Latency Budgeting: Calculating how micro-batch queuing delay impacts SLA compliance for p99 and p99.9 latency."
    ]
  },
  {
    day: 15,
    title: "⭐ MILESTONE 3: High-Throughput Streaming Pipeline with Dynamic Backpressure & Batching",
    desc: "Milestone 3: Build an enterprise-scale streaming ingest engine featuring bounded ring buffers, adaptive linger timers, batch-level compression, and dynamic backpressure throttling.",
    syllabus: [
      "Pipeline Architecture: Coupling a bounded ring buffer ingest pool to an adaptive batching worker thread dispatcher.",
      "Flow Control Engine: Dynamically throttling producer threads when downstream consumer processing lags.",
      "Performance Telemetry: Measuring throughput (msg/sec), queue depth saturation, and end-to-end p95 latency."
    ]
  },
  {
    day: 16,
    title: "Stateless Stream Processing: Map, Filter, FlatMap & Branching",
    desc: "Build pure, stateless streaming transformation pipelines in TypeScript using functional primitives: map (projection), filter (predicates), flatMap (fan-out), and branch.",
    syllabus: [
      "Stateless Stream Semantics: Transformations where each event is processed independently without historical memory.",
      "Functional Primitives: Implementing chainable map, filter, and flatMap operators over continuous event iterators.",
      "Stream Branching & Forking: Splitting a single incoming topic into multiple specialized downstream topic streams based on content."
    ]
  },
  {
    day: 17,
    title: "Tumbling Windows & Fixed-Interval Time Bucketing",
    desc: "Implement stateful stream analytics using Tumbling Windows: non-overlapping, fixed-duration time intervals that bucket and aggregate continuous events.",
    syllabus: [
      "Tumbling Window Definition: Contiguous, non-overlapping time intervals (e.g., 5-minute fixed windows).",
      "Epoch Timestamp Bucketing: Calculating window boundaries using integer division: windowStart = timestamp - (timestamp % windowSize).",
      "Window Aggregation & Emission: Accumulating intermediate counts/sums and emitting completed aggregates when window closes."
    ]
  },
  {
    day: 18,
    title: "Sliding (Hopping) Windows & Overlapping Interval Analytics",
    desc: "Construct Sliding (Hopping) Windows with overlapping time frames to compute rolling metrics (e.g., 10-minute average updated every 1 minute).",
    syllabus: [
      "Sliding Window Architecture: Windows defined by duration and advance slide interval where duration > slide.",
      "Multi-Bucket Membership: Efficiently tracking events that belong to multiple overlapping concurrent windows.",
      "Incremental State Maintenance: Adding new events while pruning expired time slices to minimize computational complexity."
    ]
  },
  {
    day: 19,
    title: "Session Windows & Inactivity Gap Detection",
    desc: "Group user events into dynamic Session Windows demarcated by periods of inactivity (inactivity gap thresholds), and merge out-of-order session slices.",
    syllabus: [
      "Session Window Concept: Dynamic, user-specific windows with variable lengths defined by idle timeouts.",
      "Inactivity Gap Threshold: Closing an active session when no new events arrive within the configured gap duration.",
      "Session Merging: Merging two previously distinct sessions when a late-arriving bridging event connects them."
    ]
  },
  {
    day: 20,
    title: "Event Time, Processing Time, Watermarks & Late-Arriving Events",
    desc: "Differentiate between Event Time (when action occurred) and Processing Time (when machine observed it), implement watermarks, and handle late events.",
    syllabus: [
      "Time Domain Distinction: Why processing time causes non-deterministic results and skewed analytics during network lags.",
      "Watermark Mechanics: Monotonically increasing time assertions: Watermark(T) declares that all events with timestamp <= T have arrived.",
      "Late Event Policies: Discarding late events, sending to dead-letter side outputs, or updating previously closed windows."
    ]
  },
  {
    day: 21,
    title: "Local State Stores: Key-Value RocksDB & In-Memory Changelog Streams",
    desc: "Architect stateful stream processing using embedded local key-value state stores (RocksDB / Map) backed by durable replicated changelog topics.",
    syllabus: [
      "Local State Store Design: Maintaining low-latency state local to the processing node to avoid remote database round-trips.",
      "Changelog Topic Backing: Replicating every state mutation to an append-only Kafka changelog for fault tolerance.",
      "Read-Through & Write-Through Caching: Balancing memory consumption against disk I/O performance."
    ]
  },
  {
    day: 22,
    title: "Stream-Table Duality (KStream vs KTable) & Changelog Compaction",
    desc: "Master the fundamental duality between streams and tables: a stream is a changelog of facts; a table is the latest state snapshot. Explore log compaction.",
    syllabus: [
      "Stream-Table Duality: Stream to Table (aggregating changes into state) and Table to Stream (observing state change mutations).",
      "Log Compaction: Retaining only the latest value for each primary key in the log while purging obsolete tombstoned records.",
      "Materialized Views: Querying the current state table via interactive REST queries while the stream continuously updates it."
    ]
  },
  {
    day: 23,
    title: "Stream-Table Joins: Real-Time Event Enrichment",
    desc: "Enrich high-velocity transaction streams in real time by joining incoming events against dimension tables (e.g. joining orders against customer profiles).",
    syllabus: [
      "Stream-Table Join Mechanics: Looking up dimension records in local KTable state stores for each incoming stream event.",
      "Non-Windowed Joins: Why stream-table joins are non-windowed since the table represents the latest current reality.",
      "Asynchronous Enrichment vs Local State: Why remote HTTP/SQL lookups bottleneck streaming throughput by 1000×."
    ]
  },
  {
    day: 24,
    title: "Stream-Stream Windowed Joins & Co-Partitioning Requirements",
    desc: "Join two continuous event streams within a correlation time window (e.g. matching ad impressions to purchase conversions within 30 minutes).",
    syllabus: [
      "Windowed Join Semantics: Joining two streams where timestamp difference between matching keys is within [t - W, t + W].",
      "Co-Partitioning Invariant: The mandatory rule requiring joined topics to have identical partition counts and identical key hashers.",
      "Join State Buffering: Buffering events from both sides in state stores and evicting items outside the join time horizon."
    ]
  },
  {
    day: 25,
    title: "Stream Cluster Capacity Planning & Fault-Tolerant Checkpoint Recovery",
    desc: "Perform quantitative stream cluster capacity planning and build stateful processors with embedded state stores, changelog backups, and crash-recovery snapshot restoration.",
    syllabus: [
      "Capacity Planning & Sizing: Calculating partition counts from peak throughput, disk retention volume, and network egress bandwidth.",
      "Checkpointing Protocol: Periodically writing consistent state snapshots and committing stream offsets atomically.",
      "Crash Recovery Simulation: Killing the processing node, recreating state from the changelog, and resuming without data loss."
    ]
  },
  {
    day: 26,
    title: "Schema Registry, Avro/Protobuf Binary Serialization & Compatibility Evolution",
    desc: "Protect streaming architectures against corrupt poison pills using a Schema Registry, enforcing backward/forward compatibility across message schema evolutions.",
    syllabus: [
      "Binary Serialization: Why Avro and Protobuf outperform JSON by stripping field names and compressing payloads with schemas.",
      "Schema Registry Protocol: Embedding a 4-byte schema ID in message headers and looking up schemas on demand.",
      "Compatibility Modes: Enforcing BACKWARD (consumers can read old data) and FORWARD (old consumers can read new data) evolution rules."
    ]
  },
  {
    day: 27,
    title: "Dead-Letter Queues (DLQ), Non-Blocking Retry Topics & Exponential Delay",
    desc: "Isolate malformed poison pills and transient processing failures without stalling production partition streams using Dead-Letter Queues (DLQ) and tiered retry topics.",
    syllabus: [
      "Poison Pill Dilemma: Why a single unparseable message can halt an entire partition consumer indefinitely.",
      "Dead-Letter Queue Routing: Quarantining permanently unparseable messages into a specialized DLQ topic with error metadata.",
      "Tiered Non-Blocking Retries: Forwarding transient failures to delayed retry topics (retry-1m, retry-5m) to preserve main topic velocity."
    ]
  },
  {
    day: 28,
    title: "Historical Stream Replay, Offset Rewinding & Zero-Downtime Reprocessing",
    desc: "Execute historical stream replays to backfill analytics, correct downstream bugs, and deploy new microservices by rewinding consumer offsets to specific timestamps.",
    syllabus: [
      "Time-Travel Offset Lookup: Querying broker indexes to locate the earliest offset corresponding to an arbitrary historical timestamp.",
      "Zero-Downtime Reprocessing: Spinning up a new consumer group with a fresh groupId to reprocess historical data in parallel.",
      "State Invalidation & Rebuilding: Safely clearing downstream caches and recalculating aggregations from the replay origin."
    ]
  },
  {
    day: 29,
    title: "Consumer Lag Monitoring, End-to-End Latency & Partition Hotspotting",
    desc: "Monitor streaming health in production: track consumer lag (Log End Offset minus Current Offset), alert on processing slippage, and detect partition key hotspots.",
    syllabus: [
      "Consumer Lag KPI: Measuring unprocessed messages per partition to detect struggling or stalled consumer workers.",
      "Lag Velocity & Time-to-Recover: Predicting backlog drain time based on current consumption rates and producer ingestion velocity.",
      "Partition Skew Detection: Identifying uneven key distributions where a single partition processes 10× the volume of its peers."
    ]
  },
  {
    day: 30,
    title: "🏆 FINAL CAPSTONE: Real-Time Financial Fraud Detection & Windowed Analytics Engine",
    desc: "Final Capstone Synthesis: Build an enterprise real-time financial fraud detection streaming engine combining partitioned ingestion, tumbling and sliding transaction velocity windows, user profile enrichment, risk scoring, and automated DLQ quarantine.",
    syllabus: [
      "Multi-Topic Ingest & Routing: Processing high-velocity transaction events and user profile dimension updates simultaneously.",
      "Windowed Velocity Analytics: Computing sliding 10-minute transaction counts and total spend amounts per cardholder in real time.",
      "Rule-Based Fraud Scoring: Evaluating velocity spikes, geographic distance anomalies, and risk thresholds to flag or quarantine fraudulent transactions."
    ]
  }
];

export const STREAM_WEB_DAYS = STREAM_DAYS;
