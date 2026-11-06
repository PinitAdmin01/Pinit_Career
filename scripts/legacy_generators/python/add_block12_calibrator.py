import sys

EXTENSIONS_56_60 = """    56: [
        # Part 1: Double-Entry Accounting Mechanics & Decimal Precision Physics
        [
            "In high-frequency fintech systems, the mathematical representation of money is an absolute engineering invariant where floating-point approximation is strictly forbidden.",
            "Binary floating-point arithmetic (IEEE 754) introduces fractional rounding errors that compound across millions of daily transactions, creating catastrophic reconciliation discrepancies.",
            "Modern banking architectures enforce exact-precision fixed-point mathematics using Python's decimal.Decimal library, representing currency down to integer cents or micro-cents.",
            "Double-entry bookkeeping dictates that every single economic event consists of balanced debits and credits across assets, liabilities, and equity accounts where sum(debits) equals sum(credits).",
            "Establishing immutable journal entries and append-only postings ensures a verifiable audit trail that guarantees complete financial integrity under hostile regulatory scrutiny."
        ],
        # Part 2: Concurrent Double-Spend Race Condition Forensics
        [
            "When thousands of concurrent transfer requests target the same account balance, naive read-modify-write patterns create devastating race conditions.",
            "Without strict database isolation, two simultaneous withdrawal requests can both read a $100 balance, authorize two $100 payouts, and leave the account in an illegal negative overdraft state.",
            "Forensic analysis reveals that standard Read Committed isolation fails to prevent lost updates when balance checks and updates occur in disconnected application cycles.",
            "High-frequency fintech ledgers eliminate double-spending by employing PostgreSQL Serializable transaction isolation combined with explicit SELECT FOR UPDATE row-level locking.",
            "Rigorous concurrency testing with parallel worker threads proves that serializable locking completely eliminates double-spend exploits and guarantees balance monotonicity."
        ],
        # Part 3: Immutable Double-Entry Ledger Engine Implementation
        [
            "Architecting an industrial ledger engine requires modeling explicit Chart of Accounts, Journal Entries, and Posting lines with strict directional balance invariants.",
            "The transactional ledger engine validates that every proposed journal entry has equal debit and credit totals before committing any changes to the persistent database state.",
            "Each posting record references a unique account identifier, an immutable timestamp, a decimal amount, and a strict debit-or-credit posting direction indicator.",
            "By maintaining account balances as computed rollups over immutable posting streams, the system provides zero-loss auditability and instantaneous historical point-in-time balance reconstruction.",
            "This double-entry design guarantees that balance invariants are mathematically enforced by the schema rather than relying on brittle application-level procedural checks."
        ],
        # Part 4: High-Frequency Peer-to-Peer Transfer Hardening
        [
            "High-frequency peer-to-peer money transfers require robust idempotency mechanisms to defend against network retries and duplicate mobile client requests.",
            "Every transfer request includes a client-generated UUID idempotency key that is checked atomically against a dedicated database idempotency table.",
            "If a network timeout causes a client to resubmit a transfer, the server recognizes the existing idempotency key and returns the cached result without executing duplicate withdrawals.",
            "Optimistic concurrency control with account version numbers allows high-throughput transfers to succeed rapidly while safely retrying in the event of concurrent account modifications.",
            "Stress testing under 5,000 concurrent transfer operations demonstrates zero overdraft violations, zero duplicate payments, and 100 percent ledger balance preservation."
        ],
        # Part 5: Production Fintech Audit Trail & Reconciliation Verification
        [
            "Fintech systems must withstand rigorous external compliance audits by maintaining tamper-evident cryptographic hash chains across all posted journal entries.",
            "Automated background reconciliation jobs continuously verify that the sum of all customer account balances matches the clearing house custodial balance down to the penny.",
            "Any discrepancy between ledger balances and external bank settlements triggers immediate automated containment, alerting on-call treasury engineers within milliseconds.",
            "Structured audit logging captures the complete context of every transfer: source account, destination account, idempotency token, execution latency, and authorization credentials.",
            "Achieving formal audit trail certification: '[AUDIT CERTIFIED] Double-Entry Ledger Integrity 100% Balanced!', confirms the engine's readiness for mission-critical banking deployments."
        ]
    ],
    57: [
        # Part 1: WebSocket Gateway Scaling & Redis Pub/Sub Fan-Out Topology
        [
            "Real-time collaborative applications like collaborative whiteboards and live document editors demand sub-50ms message propagation across tens of thousands of simultaneous users.",
            "Because WebSocket connections are persistent, stateful TCP sockets, horizontal scaling requires an edge gateway tier decoupled from internal state management.",
            "When users connect to different gateway instances, a distributed Pub/Sub message broker such as Redis Pub/Sub bridges the isolated node memory spaces.",
            "The gateway translates incoming client WebSocket frames into Redis channel publications, enabling any node in the cluster to fan out updates to locally connected participants.",
            "This distributed fan-out topology achieves linear horizontal scalability while maintaining low-latency bidirectional communication across clustered application servers."
        ],
        # Part 2: Pub/Sub Message Explosion & Redis CPU Saturation Forensics
        [
            "In collaborative canvases with thousands of active cursors, naive broadcast architectures cause quadratic message explosion that quickly overwhelms network and CPU resources.",
            "If 1,000 users in a shared room each emit 60 mouse movement events per second, the naive broadcast creates 60,000,000 outbound messages every minute.",
            "Forensic analysis of a saturated Redis broker reveals high CPU consumption in the single-threaded event loop, leading to buffer overflows and dropped client connections.",
            "Understanding the mathematical scaling limits of collaborative fan-out enables engineers to diagnose communication bottlenecks before they manifest as catastrophic production freezes.",
            "Remediating message explosion requires implementing intelligent cursor throttling, spatial filtering, and frame batching directly at the WebSocket gateway ingress."
        ],
        # Part 3: Real-Time Collaborative Fan-Out Engine Implementation
        [
            "Building an enterprise collaborative streaming hub requires managing room subscriptions, client session lifecycles, and asynchronous message distribution queues.",
            "The streaming engine encapsulates a room routing table that maps collaborative document IDs to active client WebSocket connections with thread-safe concurrency guarantees.",
            "Incoming document edit deltas are validated, serialized into compact binary or JSON frames, and published to the room's Redis Pub/Sub channel for cluster-wide dissemination.",
            "Asynchronous consumer loops on each node receive published frames and fan them out to all local room participants without blocking the core event loop.",
            "This architecture provides clean separation of concerns: edge nodes manage connection termination, while the distributed message bus handles inter-node coordination."
        ],
        # Part 4: Large-Scale Whiteboard Streaming Latency Optimization
        [
            "Optimizing collaborative whiteboard latency requires replacing raw event streaming with fixed-interval frame batching and adaptive delta compression.",
            "By throttling high-frequency cursor coordinates to 30Hz or 60Hz intervals, the gateway reduces outbound message volume by over 80 percent without perceptible visual degradation.",
            "Combining multiple individual user updates into a single composite frame payload significantly reduces socket framing overhead and network packet serialization costs.",
            "Client-side interpolation and dead-reckoning algorithms smooth out minor network jitter, delivering an exceptionally fluid collaborative experience across varying network conditions.",
            "Benchmark measurements confirm that frame batching drops p99 broadcast latency from 4,200ms down to a crisp 18ms under simulated 100,000-user load."
        ],
        # Part 5: Resilient Collaborative Reconnection & State Catch-Up
        [
            "In mobile and distributed environments, transient network disconnects are inevitable; collaborative platforms must provide seamless reconnection and state recovery.",
            "The streaming engine maintains an in-memory sliding window ring buffer of recent document operations, tagging every edit with a monotonically increasing sequence number.",
            "When a disconnected client reconnects, it supplies its last acknowledged sequence number, allowing the hub to stream the missing delta operations rather than resending the full document.",
            "If a client has been disconnected too long and the ring buffer has expired, the hub seamlessly falls back to streaming a fresh snapshot of the authoritative state.",
            "Passing production resilience verification: '[STREAMING CERTIFIED] 100k User Collaborative Engine Latency < 20ms!', validates enterprise readiness for live collaborative workloads."
        ]
    ],
    58: [
        # Part 1: Flash Sale Thundering Herd Physics & Queue Draining Architecture
        [
            "Flash sale events represent the most hostile traffic profile in e-commerce: hundreds of thousands of users submit purchase requests at the exact same millisecond.",
            "Directing this thundering herd directly to relational databases causes instantaneous connection pool exhaustion, lock contention, and catastrophic database failure.",
            "Industrial flash sale architectures decouple the high-speed reservation tier from persistent transactional databases using in-memory caches and buffered queues.",
            "The edge tier performs immediate admission control and atomic inventory reservations in Redis, while background worker pools drain accepted orders asynchronously into PostgreSQL.",
            "This architectural decoupling protects critical core databases from saturation while delivering instantaneous sub-10ms checkout responses to end users."
        ],
        # Part 2: TOCTOU Inventory Overselling Race Condition Forensics
        [
            "In high-concurrency e-commerce systems, split read-modify-write patterns cause Time-of-Check to Time-of-Use (TOCTOU) inventory overselling bugs.",
            "If an application reads remaining stock as 1, checks that stock is greater than 0, and then decrements stock in a separate query, 1,000 concurrent requests can all read stock as 1.",
            "Forensic simulation of 10,000 concurrent shoppers competing for 100 promotional items without atomic locking results in 480 oversold units and massive financial liabilities.",
            "Relational transactions with optimistic locking fail under flash sale scale because excessive lock conflicts cause 90 percent of transactions to abort and retry repeatedly.",
            "Eliminating TOCTOU race conditions requires executing inventory checks and decrements as a single, atomic, uninterrupted unit of work directly inside in-memory memory space."
        ],
        # Part 3: Atomic Redis Lua Flash Sale Inventory Engine Implementation
        [
            "Redis executes Lua scripts atomically in its single-threaded execution context, guaranteeing that no other command can interleave during inventory evaluation.",
            "The atomic Lua flash sale script reads current available stock, verifies that stock is greater than zero, decrements the inventory counter, and issues an immutable reservation token.",
            "If available stock is depleted, the Lua script immediately returns an out-of-stock signal, rejecting excess checkout attempts in microseconds without touching persistent storage.",
            "Issued reservation tokens are assigned a strict 15-minute Time-To-Live (TTL), automatically expiring and releasing reserved stock if the user fails to complete payment.",
            "Implementing atomic Lua scripts provides absolute mathematical protection against overselling, guaranteeing that exactly 1,000 items are sold from a 1,000-unit initial inventory."
        ],
        # Part 4: Planetary-Scale Flash Sale Thundering Herd Hardening
        [
            "Hardening a flash sale backend against planetary-scale surges requires combining atomic reservations with token-bucket rate limiting and intelligent queue buffering.",
            "An ingress rate limiter absorbs malicious bot floods and aggressive refresh attacks, rejecting unauthenticated or abusive IP ranges before they reach the reservation scripts.",
            "Accepted reservation tokens are placed into a high-throughput message queue (Redis Streams or Kafka) to buffer order persistence against database ingestion capacity.",
            "Worker pools consume reservation messages from the queue at a controlled rate, persisting order records and payment intents without stressing downstream relational storage.",
            "High-load stress testing with 500,000 simulated shoppers demonstrates 100 percent inventory accuracy, zero database timeouts, and sub-10ms reservation response latencies."
        ],
        # Part 5: Asynchronous Order Draining, Dead-Letter Queues & Stock Reconciliation
        [
            "Reliable asynchronous order processing requires comprehensive error handling, dead-letter queue management, and automated stock reconciliation.",
            "If an order worker fails to persist an order due to a transient payment gateway outage, the reservation message is routed to a dead-letter queue for automated retry.",
            "If repeated retries fail permanently, an automated compensation transaction executes the Lua rollback script, incrementing available inventory back into the pool.",
            "Continuous background reconciliation jobs compare total purchased orders, pending reservations, and remaining stock to ensure zero inventory drift across all systems.",
            "Passing the flash sale certification: '[FLASH SALE CERTIFIED] 500k Surge Handled - 0 Oversold Units!', proves the architecture can withstand the world's most demanding sales events."
        ]
    ],
    59: [
        # Part 1: Principal Architect RFC Formalization & Capacity Planning Models
        [
            "At the Principal Engineer level, architectural leadership is exercised through formal Requests for Comments (RFCs) that guide multi-team engineering consensus.",
            "A production-grade RFC defines the high-level system topology, data flow diagrams, network protocols, data storage contracts, and operational interfaces.",
            "Rigorous capacity planning models translate projected user traffic (e.g., 100,000 requests per second) into concrete resource requirements across CPU cores, RAM, and bandwidth.",
            "The RFC establishes precise mathematical latency budgets across the entire request path: edge ingress, TLS termination, API gateway, cache lookups, and database queries.",
            "Formalizing the architectural vision in a clear, unambiguous RFC creates alignment across stakeholders and ensures all technical decisions are mathematically grounded."
        ],
        # Part 2: Adversarial Architecture Review & Failure Domain Defense
        [
            "An architectural RFC must be vigorously defended against adversarial technical scrutiny from security, infrastructure, and database domain experts.",
            "The architecture review board actively stress-tests design assumptions: What happens when an entire cloud availability zone suffers a catastrophic power outage?",
            "How does the system handle an asymmetric network partition between the primary PostgreSQL database and the secondary read replicas?",
            "Defending the RFC requires articulating clear failure domains, circuit breaker topologies, fallback degradation strategies, and automated failover mechanics.",
            "By anticipating systemic edge cases and providing verifiable mitigation paths, the Principal Architect builds confidence that the design will survive real-world production chaos."
        ],
        # Part 3: Capacity Planning & Latency Budget Calculator Engine
        [
            "To remove subjective guesswork from infrastructure sizing, Principal Architects author deterministic capacity planning and latency calculation engines.",
            "The capacity engine calculates peak network throughput: 100,000 RPS with an average 4KB payload yields 400 MB/s (3.2 Gbps) of ingress bandwidth, requiring 10Gbps network interfaces.",
            "It computes Redis cache sizing: storing 50 million active user sessions with 512 bytes per record requires 25.6 GB of raw RAM, which scales to 64 GB with overhead and clustering.",
            "The latency budget allocator breaks down a 50ms p99 SLA into granular component budgets: 5ms DNS/TLS, 10ms gateway, 5ms Redis, 20ms database, and 10ms downstream RPC.",
            "Implementing this calculator validates that all capacity claims in the RFC are backed by deterministic arithmetic and verifiable hardware constraints."
        ],
        # Part 4: Executive Architectural Review Board RFC Presentation
        [
            "Presenting an RFC to the Executive Architectural Review Board requires bridging deep technical details with broader business objectives and cost constraints.",
            "The Principal Architect articulates key architectural trade-offs: choosing Redis Lua over distributed 2PC transactions to achieve sub-10ms response times at 1/10th the infrastructure cost.",
            "The presentation clearly defines the total cost of ownership (TCO), cloud infrastructure expenditure projections, and operational maintenance overhead.",
            "Architects must answer pointed inquiries regarding regulatory compliance, disaster recovery recovery time objectives (RTO), and recovery point objectives (RPO).",
            "Securing unanimous approval from the architectural review board establishes the foundational charter that authorizes dozens of engineering squads to begin implementation."
        ],
        # Part 5: Service Level Objectives (SLOs), Error Budgets & Post-Mortem Action Plans
        [
            "Modern site reliability engineering formalizes architectural reliability through explicit Service Level Objectives (SLOs) and Error Budgets.",
            "The RFC establishes a 99.99 percent availability target, which affords an error budget of exactly 4.38 minutes of acceptable downtime per month.",
            "When production incidents consume significant error budget, automated governance gates freeze non-critical feature deployments and redirect engineering effort toward reliability hardening.",
            "The architectural charter outlines standard blameless post-mortem procedures: timeline reconstruction, root cause analysis, and tracking corrective preventive actions.",
            "Achieving formal RFC defense certification: '[RFC DEFENSE APPROVED] Principal Architecture RFC Passed Review Board!', signifies the pinnacle of system design leadership."
        ]
    ],
    60: [
        # Part 1: ApexPython Platform Architectural Blueprint & Formal Charter
        [
            "Welcome to Day 60: The Grand Master Capstone and Final Viva Gate of Course 20! Today, you synthesize all 60 days of engineering into the ApexPython Platform.",
            "The ApexPython platform represents the apex of modern Python engineering: a high-throughput, distributed microservices platform capable of sustaining 100k RPS.",
            "The architectural charter synthesizes all 12 stages: async I/O physics, type-safe data modeling, distributed caching, event streaming, ledger transactions, and full SRE telemetry.",
            "Every component is designed to operate under strict production contracts: sub-millisecond local processing, zero unhandled exceptions, and total fault tolerance under node crashes.",
            "Establishing the comprehensive platform blueprint provides the authoritative roadmap for executing the most comprehensive engineering demonstration in the PinIT curriculum."
        ],
        # Part 2: Multi-Failure Adversarial Red-Team Stress Test Harness
        [
            "Before presenting the platform for final certification, it must survive the Multi-Failure Adversarial Red-Team Stress Test Harness.",
            "The red-team test harness simulates extreme production chaos: 50,000 concurrent requests colliding with an unexpected database primary failover and network packet drop.",
            "Simultaneously, the harness triggers memory pressure events and kills random worker pods to test Kubernetes probe responses and graceful in-flight request draining.",
            "The stress harness continuously monitors system metrics, validating that circuit breakers trip cleanly, fallback caches serve stale reads, and zero transactions are lost.",
            "Passing this adversarial trial proves that the ApexPython platform is not merely theoretically sound, but battle-hardened against chaotic real-world infrastructure failures."
        ],
        # Part 3: ApexPython Distributed Microservices Platform Implementation
        [
            "The core implementation of ApexPython unites the disparate systems developed across the entire course into a cohesive, highly optimized distributed service platform.",
            "The ingress API gateway terminates incoming HTTP/2 requests, validates authentication tokens, and enforces distributed rate limits before dispatching downstream.",
            "Financial transactions flow through the double-entry ledger engine under serializable isolation, ensuring mathematically balanced debits and credits with exact decimal precision.",
            "Flash sale purchases utilize atomic Redis Lua scripts to reserve inventory in microseconds, streaming accepted orders into an asynchronous worker queue for decoupled persistence.",
            "Complete OpenTelemetry tracing, Prometheus RED metrics, and structured JSON logs provide continuous end-to-end visibility across all service tiers and background pipelines."
        ],
        # Part 4: Chief Systems Architect Master Capstone Viva Defense Gate
        [
            "The Capstone Viva Defense is an exhaustive, adversarial cross-examination conducted by a panel of Chief Systems Architects and Principal Engineers.",
            "The candidate must defend every architectural decision: Why was PostgreSQL Serializable isolation chosen over multi-version concurrency control with advisory locks?",
            "How does the Kafka consumer group rebalance protocol prevent duplicate message processing when a worker node crashes mid-stream?",
            "Candidates walk through live trace spans and flame graphs, pinpointing latency bottlenecks and explaining memory allocation patterns at the byte level.",
            "Successfully defending the platform before the architectural review board demonstrates the profound depth of technical mastery expected of senior backend leadership."
        ],
        # Part 5: 60-Day Python Backend Master Certification & Production Readiness Sign-Off
        [
            "Congratulations! Passing the Capstone Viva Defense culminates in the prestigious 60-Day Python Backend Master Certification and Production Readiness Sign-Off.",
            "Over 60 rigorous days, you have progressed from Python internals and bytecode execution to high-frequency fintech ledgers and global distributed streaming architectures.",
            "You have demonstrated zero-hallucination discipline, mathematical precision in financial calculations, and relentless dedication to clean, type-safe, resilient software engineering.",
            "Your production portfolio stands as a testament to your capability to design, build, and operate enterprise-scale backend systems for the world's most demanding technology platforms.",
            "With formal sign-off: '[MASTER CAPSTONE VIVA PASSED] 60-Day Python Backend Engineering Master Certification Awarded!', you officially graduate as an elite Python Backend Architect!"
        ]
    ]
"""

with open("scripts/curriculum_text_calibrator.py", "r", encoding="utf-8") as f:
    code = f.read()

target = "        ]\n    ]\n}\n\n\ndef calibrate_day"
replacement = "        ]\n    ],\n" + EXTENSIONS_56_60 + "}\n\n\ndef calibrate_day"

if target in code:
    new_code = code.replace(target, replacement, 1)
    with open("scripts/curriculum_text_calibrator.py", "w", encoding="utf-8") as f:
        f.write(new_code)
    print("Successfully added Days 56-60 to curriculum_text_calibrator.py!")
else:
    print("Error: Target pattern not found in calibrator.")
    sys.exit(1)
