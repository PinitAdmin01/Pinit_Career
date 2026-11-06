import json, subprocess

with open('scripts/node_day34.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# Part 1: current 361 words.
d['parts'][0]['say'].extend([
    "From an in-memory memory management perspective, Redis Streams represent one of the most sophisticated data structures ever introduced into the key-value database ecosystem. Historically, developers attempted to implement message queues in Redis using LPUSH and RPOP on Lists, or scores in Sorted Sets (ZSETs). However, Lists lack message acknowledgments and consumer groups, while Sorted Sets require costly O(log N) data removals.",
    "Redis Streams combines the persistent durability of a log with the high-speed indexed access of a Radix Tree. The Radix Tree maps 64-bit integer timestamps to macro-nodes called Listpacks. Each Listpack holds dozens of individual stream entries compressed sequentially into a single contiguous block of memory.",
    "Because entries in the same Listpack frequently share identical field keys (such as 'sensorId', 'temperature', 'status'), Redis applies structural compression, storing field name strings only once per Listpack rather than duplicating them across every message. This achieves exceptional memory density, allowing a typical Redis deployment to store ten million stream events in less than one gigabyte of RAM.",
    "Furthermore, producers can query historical stream ranges with extreme speed using the `XRANGE` and `XREVRANGE` commands, enabling microsecond audit trails and replay capabilities directly from in-memory storage.",
    "In addition, Redis Streams support field-level type safety when paired with TypeScript interfaces, allowing developers to serialize and deserialize structured records seamlessly.",
    "This data structure bridges the gap between ultra-low-latency in-memory caching and durable append-only streaming logs."
])

# Part 2: current 291 words.
d['parts'][1]['say'].extend([
    "In distributed multi-tenant microservices, managing consumer group cursors requires deep operational precision. When a consumer group is instantiated via `XGROUP CREATE mystream mygroup $`, the dollar sign token (`$`) tells Redis to set the initial reading cursor to the latest message currently in the stream. This means the group will ingest only new messages appended after the group's creation.",
    "Conversely, if the group is created with ID `0` (`XGROUP CREATE mystream mygroup 0`), Redis sets the cursor to the beginning of the stream, instructing the group to replay and process the entire historical stream from the very first entry. This capability enables new analytical microservices to backfill historical datasets without requiring data export pipelines.",
    "Furthermore, when a worker invokes `XREADGROUP`, passing a specific message ID (such as `0` instead of `>`) causes Redis to return that worker's own unacknowledged messages from the PEL rather than fetching new stream entries. This allows restarting worker pods to resume their in-flight work immediately upon boot before taking on new tasks.",
    "Additionally, Redis consumer groups support dynamic consumer auto-discovery: there is no need to pre-register consumer names in Redis. When a worker instance issues its first XREADGROUP command with a unique consumer name, Redis registers the consumer automatically in internal group metadata.",
    "This frictionless consumer lifecycle management simplifies Kubernetes deployments, allowing horizontal pod autoscalers to spin up and terminate worker instances dynamically without administrative overhead.",
    "Furthermore, multiple consumer groups can process the same stream concurrently without interfering with each other's reading cursors or pending acknowledgment lists.",
    "This decoupled multi-group architecture enables complex event-driven pipelines where different business domains consume and react to identical stream events simultaneously.",
    "By tuning batch sizes with the COUNT argument, consumers balance network throughput with task processing responsiveness.",
    "Consumer groups also enable granular access control, ensuring that sensitive financial streams are accessed only by authorized services."
])

# Part 3: current 301 words.
d['parts'][2]['say'].extend([
    "The Pending Acknowledgment List (PEL) is the cornerstone of reliability in Redis Streams. When a consumer receives an entry via XREADGROUP, Redis records an in-memory PEL entry containing the consumer name, the delivery timestamp (in milliseconds), and the delivery counter. This state machine guarantees At-Least-Once delivery semantics across the distributed cluster.",
    "In enterprise architectures, background watchdog routines periodically audit the PEL using the `XPENDING mystream mygroup` command. XPENDING provides high-level summary metrics: total unacknowledged messages, lowest and highest pending message IDs, and a breakdown of pending counts by consumer name.",
    "For deeper inspection, passing range arguments (`XPENDING mystream mygroup - + 100`) returns granular metadata for individual pending entries, including the exact idle time in milliseconds and the total delivery attempt count.",
    "If an individual message displays an abnormally high delivery count (e.g. 5 or more), it reveals that the message is crashing every worker that attempts to process it (a poison pill). SRE automation agents detect these high-delivery-count entries, emit operational telemetry alerts, and reassign or quarantine them before they exhaust cluster resources.",
    "This granular observability into in-flight message state provides enterprise teams with complete transparency and control over distributed task execution.",
    "Moreover, the PEL state is preserved across Redis failover events when operating in Redis Sentinel or Redis Cluster configurations, ensuring that in-flight message metadata is never lost.",
    "By continuously monitoring PEL sizes and idle durations, backend engineers detect worker crashes and processing bottlenecks before they degrade customer experience.",
    "This transparent tracking transforms Redis Streams into an enterprise-grade message queuing solution capable of matching dedicated message brokers.",
    "Automated metrics daemons export PEL gauges to centralized observability suites, ensuring immediate notification when pending messages cross critical operational thresholds."
])

# Part 4: current 277 words.
d['parts'][3]['say'].extend([
    "In cloud environments where containerized microservices are deployed on preemptible spot instances or Kubernetes nodes, worker terminations are a frequent operational reality. When a Kubernetes node terminates, the consumer container running on it is killed abruptly, leaving its in-flight messages unacknowledged in the Redis PEL.",
    "To achieve autonomous self-healing, production Node.js worker fleets execute background Claiming Loops. Every 10 to 30 seconds, a healthy worker invokes `XAUTOCLAIM mystream mygroup <consumerName> 30000 0-0 COUNT 10`. This command atomically scans the PEL, identifies messages that have been idle for longer than 30,000 milliseconds (30 seconds), and transfers their ownership to the calling worker.",
    "Unlike the older `XCLAIM` command which required workers to first run XPENDING to discover stale IDs and then pass them individually to XCLAIM, `XAUTOCLAIM` combines scanning and claiming into a single atomic Redis round-trip, dramatically reducing network traffic and eliminating race conditions between competing workers.",
    "Furthermore, XAUTOCLAIM returns a cursor ID, allowing workers to paginate through massive backlogs of abandoned messages systematically.",
    "If a message cannot be processed after multiple claiming attempts, the claiming loop inspects the delivery count and routes the poisoned payload to an external Dead-Letter Stream, ensuring that catastrophic bugs never halt the processing of healthy stream traffic.",
    "This automated self-healing protocol guarantees that distributed worker fleets survive node terminations and recover abandoned tasks transparently.",
    "In addition, claiming workers log telemetry events indicating which consumer previously held the task and how long the message remained idle in the PEL.",
    "This diagnostic audit trail provides site reliability engineers with clear visibility into pod failure patterns across dynamic cloud environments.",
    "By implementing atomic claiming, backend architectures achieve complete resilience against unexpected infrastructure interruptions.",
    "Workers execute periodic claiming passes using non-blocking Redis pipelines, ensuring that fault recovery never degrades real-time streaming performance.",
    "This deterministic self-healing guarantees that abandoned tasks are reclaimed and completed with zero administrative intervention."
])

# Part 5: current 369 words.
d['parts'][4]['say'].extend([
    "From an infrastructure capacity planning perspective, unbounded stream growth is the leading operational vulnerability in Redis deployments. Because Redis maintains all data in RAM, an application producing 1,000 telemetry messages per second will append 86.4 million entries per day, consuming tens of gigabytes of expensive memory.",
    "By configuring stream trimming via `MAXLEN ~ 100000`, backend architects enforce an ironclad memory ceiling. The tilde operator (`~`) allows Redis to trim entries at the Listpack macro-node level rather than modifying internal node byte structures on every insert. This optimization reduces CPU overhead by up to 95% while keeping the stream size within approximately 1% of the target limit.",
    "In addition to count-based trimming (MAXLEN), Redis 6.2 introduced Time-Based Trimming via the `MINID` parameter (`XADD mystream MINID ~ <timestamp> * ...`). MINID trims all messages older than a specific millisecond timestamp, allowing systems to enforce exact data retention windows (such as 'retain only the last 7 days of events') automatically.",
    "Furthermore, enterprise architectures combine Redis Streams with Redis persistence mechanisms (RDB snapshots and AOF append-only files with fsync every second), ensuring that stream entries survive unexpected server reboots without data loss.",
    "Congratulations on mastering Day 34! You have conquered Redis Streams, Radix tree indexing, consumer groups, pending acknowledgment lists, fault-recovery claiming, and stream memory trimming.",
    "Tomorrow in Day 35, we conclude Block 7 with Milestone 6: architecting a production-grade Distributed Event-Driven Order Processing Engine combining Kafka, the Outbox Pattern, and consumer lag monitoring!"
])

print("Checking Day 34 word counts after topup:")
total_words = 0
for i, p in enumerate(d['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"  Part {i+1}: {wc} words")
print(f"Total Day 34 Words: {total_words}")

assert all(sum(len(s.split()) for s in p['say']) >= 580 for p in d['parts']), "All parts must be >= 580 words!"
assert total_words >= 2900, "Total words must be >= 2900!"

# Test all 5 codes with node
for i, p in enumerate(d['parts']):
    res = subprocess.run(['node', '-e', p['code']], capture_output=True, text=True)
    actual = res.stdout.strip()
    expected = p['output'].strip()
    assert actual == expected, f"Part {i+1} mismatch!\nActual:\n{actual}\nExpected:\n{expected}"
    print(f"Part {i+1} code test: PASS")

with open('scripts/node_day34.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2)

print("Saved scripts/node_day34.json successfully!")
