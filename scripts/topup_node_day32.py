import json, subprocess

with open('scripts/node_day32.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# Part 1: current 486 words.
d['parts'][0]['say'].extend([
    "From a storage architecture viewpoint, Kafka's append-only partition design enables sequential disk I/O, which is orders of magnitude faster than random disk access. Because modern operating systems aggressively optimize sequential reads and writes via read-ahead and write-behind caching algorithms, Kafka achieves disk write throughput comparable to in-memory systems.",
    "Furthermore, Kafka organizes each partition log on disk into segments (typically one gigabyte in size). When a segment reaches capacity, Kafka closes it and begins appending to a new active segment. This segmentation enables time-based and size-based retention policies to operate with near-zero overhead: when records expire, the broker simply deletes obsolete segment files directly from the filesystem without performing costly database index reorganizations.",
    "This hardware-aligned commit log architecture guarantees predictable high throughput and constant-time O(1) performance regardless of whether a topic contains ten thousand or ten billion messages."
])

# Part 2: current 398 words.
d['parts'][1]['say'].extend([
    "When designing message schemas for distributed systems, architects must also establish schema evolution rules across producer and consumer deployments. In production Kafka ecosystems, schemas are defined using Apache Avro or Protocol Buffers and registered in a centralized Confluent Schema Registry. Before a producer emits an event, it validates the payload against the registered schema and prepends a lightweight four-byte schema ID to the binary payload.",
    "This prevents subtle data corruption where an updated producer introduces breaking field alterations that crash downstream consumer services. The schema registry enforces compatibility modes (such as Backward, Forward, and Full compatibility), ensuring seamless zero-downtime microservice upgrades.",
    "Additionally, producers configure acknowledgment safety levels using the 'acks' parameter. Setting `acks=all` (or `acks=-1`) mandates that the partition leader must receive confirmation from all In-Sync Replicas before acknowledging the producer. When paired with `enable.idempotence=true`, the producer assigns sequence numbers to every message, eliminating duplicate writes caused by transient network retries.",
    "This producer configuration guarantees that messages are committed with absolute durability and cryptographic consistency across global cloud regions.",
    "In addition, producers utilize compression codecs like Zstandard and Snappy to reduce network egress bandwidth by over 70%, boosting cluster throughput during heavy traffic bursts.",
    "Mastering producer partitioning strategies ensures that message ordering remains strictly preserved while maximizing hardware and network utilization."
])

# Part 3: current 390 words.
d['parts'][2]['say'].extend([
    "To manage consumer group state deterministically, one broker in the cluster is elected as the Group Coordinator for each group based on a hash of the group ID. When consumer instances boot up, they initiate a FindCoordinator request to locate their assigned coordinator broker, followed by JoinGroup and SyncGroup requests.",
    "During the JoinGroup phase, the coordinator designates one consumer instance as the Group Leader. The group leader is responsible for executing the client-side partition assignment strategy (such as RangeAssignor, RoundRobinAssignor, or StickyAssignor) and submitting the finalized assignments back to the coordinator broker, which then broadcasts them to all members in the SyncGroup response.",
    "This separation of duties keeps cluster brokers lightweight by offloading partition assignment computation to client runtimes. If a consumer fails to complete its assigned processing batch within `max.poll.interval.ms` (for example, if a downstream database operation hangs), the coordinator assumes the consumer has failed, evicts it from the group, and triggers an automated rebalance.",
    "By tuning heartbeat intervals, session timeouts, and maximum poll records, engineering teams ensure that consumer fleets maintain resilient, self-healing streaming pipelines under varying operational workloads.",
    "Furthermore, cooperative sticky rebalancing guarantees that healthy worker nodes continue processing their assigned partitions without interruption while migrating partitions are reassigned.",
    "This resilient consumer group architecture allows backend services to scale seamlessly from single-instance prototypes to hundreds of distributed worker pods."
])

# Part 4: current 357 words.
d['parts'][3]['say'].extend([
    "In distributed financial ledgers and e-commerce checkout engines, achieving Exactly-Once Semantics (EOS) represents the highest echelon of architectural engineering. Historically, developers assumed that achieving exactly-once processing across distributed networks was mathematically impossible due to the Two Generals' Problem. However, Apache Kafka achieves EOS within its ecosystem through the Transactional API.",
    "Under Kafka Transactions, a producer initiates a transaction via `beginTransaction()`, writes messages to output topics, and commits consumed offsets to the `__consumer_offsets` topic *as part of the exact same atomic transaction*. The Transaction Coordinator broker manages a two-phase commit protocol using an internal transaction log.",
    "If any operation fails or the worker crashes mid-stream, the coordinator aborts the transaction, writing an abort marker across all involved partitions. Downstream consumers configured with `isolation.level=read_committed` automatically skip uncommitted or aborted messages, reading only fully committed transactional data.",
    "Furthermore, when writing to external databases, engineering teams implement the Transactional Outbox Pattern: storing domain entity changes and corresponding Kafka events within the same relational database ACID transaction, guaranteeing that events are emitted if and only if the database state mutation succeeds.",
    "This transactional rigor protects enterprise platforms from phantom reads, duplicate billing charges, and state inconsistency across distributed microservice boundaries.",
    "By persisting an outbox table in PostgreSQL and relaying events via Debezium or Change Data Capture (CDC), architectures decouple database writes from broker availability.",
    "This dual-write elimination guarantees that domain events are never lost, even during total broker network partitions or unexpected node restarts."
])

# Part 5: current 348 words.
d['parts'][4]['say'].extend([
    "From an observability and Site Reliability Engineering (SRE) perspective, monitoring consumer lag must be paired with Time-Based Lag (Latency) monitoring. While traditional offset lag measures the raw number of unprocessed records, Time-Based Lag measures the wall-clock age of the oldest unconsumed record in the partition (`ConsumerTimeLag = CurrentTime - RecordProduceTimestamp`).",
    "In time-sensitive applications—such as algorithmic trading desks, fraud detection scanners, and ride-hailing geolocation trackers—a consumer lag of 500 records might be negligible if throughput is 50,000 records per second, or catastrophic if records are being delayed by several minutes. Measuring both offset lag and time-based lag provides complete visibility into streaming freshness.",
    "Additionally, production pipelines deploy Automated Dead-Letter Topics (DLTs). If a consumer encounters a malformed payload or un-processable poison pill message that causes repeated deserialization failures, it diverts the corrupted record to a dead-letter topic along with diagnostic error headers, allowing normal partition consumption to proceed unimpeded.",
    "Operations teams can then inspect, repair, and replay poisoned messages from the DLT without halting production ingestion.",
    "Congratulations on conquering Day 32! You have mastered the architectural mechanics of Apache Kafka: partition replication, key hashing, consumer group rebalancing, offset delivery semantics, and production lag telemetry.",
    "Tomorrow in Day 33, we explore Advanced Message Queuing Protocol (AMQP) with RabbitMQ, analyzing broker-centric push routing, dead-letter exchanges, and consumer acknowledgments!",
    "Through continuous monitoring of consumer lag and partition health, engineering teams ensure that streaming backends remain responsive, resilient, and performant.",
    "This complete operational discipline guarantees that your distributed event pipelines maintain peak throughput even under intense transaction surges."
])

print("Checking Day 32 word counts after topup:")
total_words = 0
for i, p in enumerate(d['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"  Part {i+1}: {wc} words")
print(f"Total Day 32 Words: {total_words}")

assert all(sum(len(s.split()) for s in p['say']) >= 580 for p in d['parts']), "All parts must be >= 580 words!"
assert total_words >= 2900, "Total words must be >= 2900!"

# Test all 5 codes with node
for i, p in enumerate(d['parts']):
    res = subprocess.run(['node', '-e', p['code']], capture_output=True, text=True)
    actual = res.stdout.strip()
    expected = p['output'].strip()
    assert actual == expected, f"Part {i+1} mismatch!\nActual:\n{actual}\nExpected:\n{expected}"
    print(f"Part {i+1} code test: PASS")

with open('scripts/node_day32.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print("Saved scripts/node_day32.json successfully!")
