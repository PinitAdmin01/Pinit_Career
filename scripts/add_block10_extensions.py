import sys

EXTENSIONS_BLOCK10 = '''    46: [
        # Part 1: Protocol Buffers binary encoding & HTTP/2 framing
        [
            "In high-performance microservice architectures, Protocol Buffers serialize structured messages into compact, schema-enforced binary streams using variable-length integer encoding and explicit field tags.",
            "By replacing textual JSON keys and ASCII whitespace with binary tag-length-value representations, Protobuf reduces payload sizes by up to 80% while drastically slashing CPU parsing overhead.",
            "Furthermore, HTTP/2 transports binary frames across long-lived, persistent TCP connections, utilizing HPACK header compression to eliminate redundant header transmission across repeated RPC invocations.",
            "This binary efficiency ensures that inter-service communication consumes minimal network bandwidth while maintaining sub-millisecond serialization speeds across distributed cluster nodes.",
            "Mastering Protobuf wire framing and HTTP/2 transport physics enables backend engineers to design scalable microservices that handle massive transaction volumes without saturating network interfaces."
        ],
        # Part 2: Ephemeral port exhaustion & connection churn forensics
        [
            "When microservices communicate over traditional HTTP/1.1 connections, executing thousands of requests per second creates immense socket churn as clients continuously open and close short-lived TCP sockets.",
            "In Linux operating systems, closed TCP sockets linger in the TIME_WAIT state for up to 60 seconds to ensure stray packets are discarded, rapidly depleting the available ephemeral port range.",
            "This connection churn triggers catastrophic EADDRNOTAVAIL socket errors, causing upstream microservices to fail even when downstream servers possess ample idle CPU and memory capacity.",
            "In contrast, gRPC over HTTP/2 multiplexes hundreds of concurrent RPC streams across a single long-lived TCP connection, completely eliminating socket churn and ephemeral port exhaustion.",
            "Understanding network connection lifecycle states allows systems architects to eliminate transport-layer bottlenecks and sustain tens of thousands of concurrent RPC streams with rock-solid stability."
        ],
        # Part 3: Asynchronous gRPC service implementation (grpc.aio)
        [
            "In the modern Python backend ecosystem, the grpc.aio package provides native integration between gRPC's high-performance C-core runtime and Python's asyncio asynchronous event loop.",
            "By implementing asynchronous servicer methods with async and await keywords, developers ensure that I/O-bound RPC handling never blocks the underlying event loop thread.",
            "Furthermore, grpc.aio supports rich metadata interception, enabling transparent propagation of authentication tokens, correlation identifiers, and distributed tracing headers across service boundaries.",
            "This non-blocking architecture allows a single lightweight Python microservice process to sustain high concurrent RPC throughput with minimal memory overhead.",
            "Mastering grpc.aio servicer and client implementations equips engineers to build lightning-fast, production-grade microservice endpoints capable of handling enterprise API workloads."
        ],
        # Part 4: gRPC streaming communication patterns
        [
            "Beyond standard Unary request-response calls, gRPC natively supports three streaming paradigms: Server Streaming, Client Streaming, and Bidirectional Streaming over single HTTP/2 streams.",
            "Server Streaming allows a microservice to transmit a continuous stream of response messages—such as real-time financial market ticks or log tails—without incurring repeated request headers.",
            "Client Streaming enables high-volume data ingestion pipelines where clients stream large data batches before receiving a single aggregate confirmation from the server.",
            "Bidirectional Streaming establishes real-time, two-way conversational streams where client and server asynchronously exchange data with independent flow control.",
            "Leveraging gRPC streaming patterns empowers backend architects to implement highly responsive, real-time data pipelines that maximize bandwidth utilization across modern cloud platforms."
        ],
        # Part 5: Enterprise inter-service communication modernization
        [
            "Modernizing legacy REST/JSON microservice links to gRPC over HTTP/2 delivers transformative latency reductions, slashing p99 latency from 80 milliseconds down to sub-5 milliseconds under heavy load.",
            "By enforcing strict Protocol Buffer schema contracts (.proto files), development teams eliminate runtime type mismatches and establish unambiguous communication protocols across microservice boundaries.",
            "Furthermore, generating strongly-typed client stubs across multiple programming languages ensures seamless polyglot interoperability between Python, Go, Java, and TypeScript services.",
            "This architectural standardization accelerates engineering velocity while dramatically lowering cloud compute costs and network bandwidth consumption across enterprise infrastructure.",
            "Completing this gRPC modernization establishes the foundational high-speed transport layer required to build enterprise event-driven microservice meshes."
        ]
    ],
    47: [
        # Part 1: Kafka partition physics & consumer groups
        [
            "Unlike traditional message brokers that delete messages upon consumption, Apache Kafka acts as an immutable, distributed commit log partitioned across cluster broker nodes.",
            "Each Kafka topic is subdivided into ordered, immutable partitions, allowing messages with identical partition keys to be processed in strict sequential order.",
            "Consumer Groups enable horizontal scaling: Kafka dynamically assigns partitions among group members, ensuring that each partition is processed by exactly one active consumer at any instant.",
            "Furthermore, consumers track progress independently by writing committed offsets to Kafka's internal __consumer_offsets topic, decoupling message ingestion from message processing speed.",
            "Mastering Kafka partition distribution and consumer group mechanics is essential for designing event-driven architectures that scale throughput linearly with added worker nodes."
        ],
        # Part 2: Auto-commit hazards & rebalance storm forensics
        [
            "Configuring Kafka consumers with enable_auto_commit=True introduces severe data loss risks, as offsets are committed automatically on a periodic timer regardless of processing status.",
            "If a worker process crashes after auto-committing an offset but before finishing database writes, the uncommitted business operations are permanently lost upon consumer restart.",
            "Additionally, if a consumer takes longer to process a message batch than max_poll_interval_ms, the Kafka coordinator assumes the consumer died and triggers an expensive group rebalance.",
            "During a rebalance storm, all partition consumption halts across the consumer group, causing massive queue lag and severe throughput degradation.",
            "Enforcing manual offset commits and tuning poll batch sizes eliminates premature commit hazards and stabilizes consumer group membership under heavy production load."
        ],
        # Part 3: aiokafka event consumer with manual offset management
        [
            "In Python, the aiokafka library provides an asynchronous, non-blocking interface to Apache Kafka, enabling high-throughput event consumption within asyncio event loops.",
            "By implementing manual offset committing, consumers execute transactional side effects—such as database updates—and only commit the offset after the transaction is safely persisted.",
            "This at-least-once processing contract guarantees that no event is ever skipped or lost, ensuring complete data integrity across distributed streaming pipelines.",
            "Coupled with idempotent consumer handlers, manual offset committing guarantees that redelivered messages produce zero duplicate state or business side effects.",
            "Mastering aiokafka manual offset workflows equips backend engineers to build bulletproof event-driven streaming consumers that survive sudden node failures without data corruption."
        ],
        # Part 4: Backpressure regulation & batch processing
        [
            "High-velocity event streams require disciplined backpressure mechanisms to prevent consumer memory buffers from being overwhelmed during unexpected traffic surges.",
            "By tuning max_poll_records, consumers pull bounded message batches that can be executed within allocated CPU and database connection limits.",
            "When downstream databases experience latency spikes, consumers pause polling or throttle ingestion, preserving cluster stability and preventing out-of-memory crashes.",
            "Furthermore, adopting the CooperativeStickyAssignor protocol minimizes partition migration during rebalances, allowing surviving consumers to continue processing unassigned partitions.",
            "Implementing adaptive backpressure ensures that event-driven microservices maintain predictable processing throughput even during extreme traffic surges."
        ],
        # Part 5: High-throughput order event pipeline hardening
        [
            "Synthesizing Kafka topic partitioning, aiokafka manual commits, and backpressure controls delivers an enterprise-grade event pipeline capable of processing over 50,000 events per second.",
            "Real-time monitoring of consumer lag—the delta between the latest log end offset and the committed consumer offset—provides immediate visibility into processing bottlenecks.",
            "Establishing automated alerts on lag thresholds ensures that operations teams can autoscale consumer pods before queue backlogs impact downstream business operations.",
            "Throughout rolling deployments and simulated worker crashes, the hardened pipeline guarantees zero event loss, seamless partition reassignment, and sub-millisecond commit latencies.",
            "Mastering Kafka streaming patterns positions senior engineers to architect mission-critical event-driven architectures powering global real-time platforms."
        ]
    ],
    48: [
        # Part 1: Caching physics & architecture patterns
        [
            "In high-scale systems, memory caching bridges the performance chasm between high-latency disk storage (15ms relational queries) and sub-millisecond in-memory lookups (0.3ms Redis reads).",
            "Under the Cache-Aside pattern, application services query the cache first; upon a miss, they read from the primary database and populate the cache before returning the response.",
            "In Write-Through architectures, updates are written synchronously to the cache and the underlying database simultaneously, guaranteeing strong consistency at the expense of higher write latency.",
            "Conversely, Write-Behind architectures buffer writes in cache memory and flush them asynchronously to disk in batches, maximizing write throughput while introducing transient durability trade-offs.",
            "Choosing the appropriate caching pattern based on read-to-write ratios and consistency requirements is the first principle of scalable database performance engineering."
        ],
        # Part 2: Cache stampede (thundering herd) failure forensics
        [
            "When a heavily queried cache key expires in a high-traffic system (such as 10,000 requests per second), thousands of concurrent requests encounter a cache miss simultaneously.",
            "All 10,000 requests bypass the cache and hammer the primary relational database with the exact same expensive query, triggering a catastrophic Cache Stampede.",
            "Under this thundering herd, database CPU spikes to 100%, connection pools become exhausted, and query latency escalates from milliseconds to tens of seconds.",
            "The resulting bottleneck cascades into application-wide 504 Gateway Timeouts, bringing down the entire digital platform until the cache is manually warmed.",
            "Understanding cache stampede dynamics is essential for engineering high-traffic web applications that survive recurring cache TTL expirations without database collapse."
        ],
        # Part 3: XFetch probabilistic early expiration algorithm
        [
            "To prevent cache stampedes without complex centralized locking coordinators, backend systems implement the XFetch probabilistic early recomputation algorithm.",
            "XFetch computes an early refresh probability based on the remaining time-to-live, the execution duration of the query, and an asymmetry constant beta.",
            "As expiration approaches, incoming read requests probabilistically decide whether to trigger an asynchronous background refresh before the key actually expires.",
            "Because only a single request triggers the background recomputation while all other requests continue serving the existing cached value, database load remains completely flat.",
            "Implementing XFetch eliminates the thundering herd cliff entirely, providing continuous, seamless cache warming for high-velocity enterprise data assets."
        ],
        # Part 4: Atomic Redis Lua scripting & transaction integrity
        [
            "Redis executes Lua scripts atomically in a single execution thread, allowing backend developers to combine multiple read-modify-write operations into a single atomic transaction.",
            "By executing logic directly inside the Redis engine via EVAL, applications eliminate network round-trips and prevent concurrency race conditions across competing worker processes.",
            "Lua scripts enable advanced caching patterns, such as conditional key updates, atomic rate limiting, distributed mutex releases, and sliding window analytics.",
            "Furthermore, provisioning Redis with disciplined maxmemory-policy evictions (such as volatile-lru or allkeys-lru) guarantees that memory exhaustion never halts operational throughput.",
            "Mastering Redis Lua scripting equips developers with the tools to construct high-speed, thread-safe transactional cache layers that operate at microsecond latencies."
        ],
        # Part 5: News portal cache invalidation & stampede hardening
        [
            "Synthesizing Cache-Aside architecture, XFetch probabilistic refreshing, and atomic Lua script execution creates an impenetrable caching tier capable of sustaining extreme breaking news traffic surges.",
            "By refreshing hot homepage article feeds asynchronously before TTL expiration, the database experiences zero query spikes during peak viral readership events.",
            "Distributed mutex fallback ensures that even during unexpected cold starts, database query concurrency is strictly serialized to a single worker per key.",
            "This multi-layered caching defense reduces primary database load by over 98% while delivering blazing-fast sub-millisecond page loads to millions of concurrent global readers.",
            "Mastering enterprise caching architectures prepares senior engineers to design resilient in-memory performance tiers for the world's most demanding digital platforms."
        ]
    ],
    49: [
        # Part 1: Circuit breaker finite state machine & bulkhead theory
        [
            "In distributed microservice topologies, downstream service failures will inevitably occur due to hardware degradation, network partitions, or unexpected traffic overloads.",
            "The Circuit Breaker pattern protects upstream services by acting as an automatic electrical breaker, wrapping remote calls in a state machine with three distinct states: CLOSED, OPEN, and HALF_OPEN.",
            "In the CLOSED state, requests pass through normally; if the error rate exceeds a configured threshold, the breaker trips to the OPEN state, immediately fast-failing subsequent calls without calling the dependency.",
            "After a recovery sleep window, the breaker transitions to HALF_OPEN, allowing a limited stream of canary probe requests to verify whether the downstream service has healed.",
            "Bulkhead isolation complements circuit breakers by partitioning thread and connection pools across dependencies, ensuring that a slow service cannot exhaust resources shared by healthy services."
        ],
        # Part 2: Cascading failure simulation & thread starvation forensics
        [
            "Without circuit breakers and bulkheads, a single slow downstream dependency can trigger a catastrophic Cascading Failure across the entire enterprise microservice mesh.",
            "When a downstream service experiences 30-second response latency, upstream caller threads remain blocked waiting on network sockets, unable to process incoming requests.",
            "Within minutes, web server thread pools and database connection pools are completely exhausted, causing the upstream service to crash and reject incoming traffic.",
            "This failure cascades upward through every dependent tier, transforming an isolated microservice hiccup into a total platform-wide outage that impacts completely unrelated features.",
            "Forensic analysis of major cloud outages proves that fast-failing traffic via circuit breakers is the single most critical defense against cascading infrastructure collapses."
        ],
        # Part 3: Asynchronous circuit breaker implementation
        [
            "Implementing an asynchronous Circuit Breaker in Python requires managing sliding-window error counters, state transitions, and recovery timers within non-blocking asyncio workflows.",
            "When in the OPEN state, the breaker raises a CallNotPermittedException in sub-microsecond time, protecting worker thread capacity and allowing callers to execute fallback logic.",
            "Fallback strategies can return cached responses, default degraded values, or queue requests for asynchronous retry, preserving acceptable user experience during partial outages.",
            "When the recovery timer expires, the breaker admits canary requests in HALF_OPEN state: consecutive successes reset the breaker to CLOSED, while any failure trips it back to OPEN.",
            "Constructing a robust circuit breaker engine ensures that microservices fail gracefully and self-heal automatically without requiring manual operator intervention."
        ],
        # Part 4: Distributed Token Bucket rate limiting in Redis
        [
            "Rate limiting protects microservice APIs from being overwhelmed by abusive clients, denial-of-service attacks, or runaway automated scripts.",
            "The Token Bucket algorithm models a bucket of fixed capacity refilled with tokens at a constant rate; requests consume tokens and are rejected if the bucket is empty.",
            "In distributed architectures, rate limiters are centralized in Redis using atomic Lua scripts to evaluate and consume tokens in a single atomic microsecond operation.",
            "This centralized token tracking ensures that rate limits are enforced uniformly across all horizontally scaled API gateway instances without synchronization drift.",
            "Coupling distributed token bucket rate limiting with circuit breaking creates an ironclad perimeter defense that maintains predictable service throughput under all traffic conditions."
        ],
        # Part 5: E-commerce gateway resilience hardening
        [
            "In this production incident lab, we isolate a failing third-party shipping rate calculator in an enterprise e-commerce API gateway using circuit breakers, bulkheads, and fallback caching.",
            "When the shipping API begins timing out, the circuit breaker trips to OPEN within 500 milliseconds, fast-failing shipping requests and returning cached fallback estimates.",
            "Because bulkhead pools segregate shipping threads from authentication and checkout threads, customer logins and credit card checkouts continue processing with zero latency degradation.",
            "Once the external shipping service recovers, the breaker validates canary requests in HALF_OPEN state and automatically restores normal operations without downtime.",
            "Mastering fault isolation patterns empowers software engineers to design anti-fragile microservice architectures that thrive in turbulent distributed production environments."
        ]
    ],
    50: [
        # Part 1: Milestone 9 Architecture specification & distributed mesh contracts
        [
            "Welcome to Milestone 9! In this capstone engineering project, you synthesize the advanced distributed systems principles of Block 10 into an industrial Event-Driven Microservice & gRPC Gateway Engine.",
            "The platform architecture unifies four mission-critical subsystems: binary multiplexed gRPC over HTTP/2, durable Kafka event streaming with aiokafka, stampede-resistant Redis caching with XFetch, and circuit breaker resilience.",
            "Every component is bound by strict, formal data contracts and schema definitions, ensuring deterministic communication across high-concurrency microservice boundaries.",
            "By synthesizing these advanced patterns, the Milestone 9 engine delivers sub-millisecond RPC latency, zero event loss, and complete fault isolation under extreme load.",
            "Establishing these comprehensive architectural specifications ensures that the synthesized platform satisfies the highest benchmarks of enterprise performance and operational durability."
        ],
        # Part 2: Downstream failure & fault isolation stress testing
        [
            "To evaluate the platform's resilience under severe infrastructure distress, we construct an automated stress harness that injects sudden downstream database outages during peak traffic.",
            "The test suite verifies that circuit breakers detect rising failure rates and trip to the OPEN state within 500 milliseconds, fast-failing traffic without thread starvation.",
            "Simultaneously, bulkhead pools protect unaffected service routes, ensuring that authentication and catalog services remain 100% available while billing dependencies are isolated.",
            "Automated canary probes in the HALF_OPEN state confirm that once the downstream database recovers, the engine self-heals cleanly back to the CLOSED state without manual intervention.",
            "Rigorous fault-injection stress testing provides definitive proof that the synthesized microservice mesh is completely resilient against cascading infrastructure failures."
        ],
        # Part 3: Event-driven microservice & gRPC gateway implementation
        [
            "We implement the complete Milestone 9 engine in pure Python, featuring an asynchronous gRPC gateway that bridges incoming binary RPCs to downstream Kafka event streams.",
            "The gRPC gateway deserializes compact Protobuf payloads, evaluates distributed token bucket rate limits in Redis, and dispatches high-velocity order events to Kafka partitions.",
            "An asynchronous aiokafka worker consumer processes event batches, executes transactional side effects, and manually commits log offsets to guarantee at-least-once durability.",
            "High-traffic product queries are routed through an XFetch-protected Redis cache tier, refreshing hot items probabilistically before TTL expiration to eliminate cache stampedes.",
            "This unified implementation demonstrates how modern enterprise microservices combine binary RPCs, event streaming, and intelligent caching into a cohesive, high-performance platform."
        ],
        # Part 4: Black Friday traffic surge simulation
        [
            "In this production defense simulation, we subject the Milestone 9 engine to a simulated Black Friday traffic surge of 20,000 requests per second accompanied by transient downstream network blips.",
            "The engine multiplexes thousands of concurrent RPC streams across persistent HTTP/2 connections, maintaining median response latency below 3 milliseconds without socket exhaustion.",
            "Distributed token bucket limiters smoothly shed excess traffic beyond configured SLA bounds, protecting primary databases from resource saturation.",
            "Kafka event partitions ingest thousands of orders per second without event loss, while consumers scale horizontally to drain message backlogs with zero rebalance storms.",
            "Demonstrating flawless throughput and zero downtime under massive traffic spikes validates that our microservice architecture is ready for global commercial production."
        ],
        # Part 5: Milestone 9 Production defense & verification gate
        [
            "The final verification gate evaluates the synthesized Milestone 9 platform against four non-negotiable enterprise production contracts: Sub-Millisecond gRPC Latency, Zero Kafka Event Loss, Stampede-Free Caching, and 100% Fault Isolation.",
            "We execute an end-to-end multi-service order pipeline, auditing operational telemetry, error rates, and state transitions against rigorous engineering standards.",
            "Every test suite reports PASSED status, concluding with the official certification: 'MILESTONE 9 PASSED: Event-Driven Microservice & gRPC Gateway Engine Certified for Production!'.",
            "This capstone achievement demonstrates your mastery of modern microservices, high-scale concurrency, asynchronous event streaming, and distributed fault tolerance.",
            "With 50 days of rigorous curriculum complete, you possess the elite architectural capabilities required to design, lead, and defend world-class distributed backend systems at global scale."
        ]
    ]'''

with open("scripts/curriculum_text_calibrator.py", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the closing of DOMAIN_EXTENSIONS
marker = "        ]\n    ]\n}"
replacement = f"        ]\n    ],\n{EXTENSIONS_BLOCK10}\n}}"

if "46:" not in content:
    new_content = content.replace(marker, replacement)
    with open("scripts/curriculum_text_calibrator.py", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully added Days 46-50 domain extensions to curriculum_text_calibrator.py")
else:
    print("Days 46-50 already present in curriculum_text_calibrator.py")
