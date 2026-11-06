import json, subprocess

p1_say = [
    "Welcome to Day 34 of Node.js & TypeScript Backend Engineering: Redis Streams & Consumer Groups: High-Throughput In-Memory Streaming & Pending Acknowledgment Lists. Over the past two days, we mastered Apache Kafka's disk-backed append-only logs and RabbitMQ's broker-centric AMQP routing. Today, we conquer Redis Streams—an ultra-high-performance in-memory streaming data structure introduced in Redis 5.0.",
    "While Redis Pub/Sub provides ephemeral broadcasting where messages vanish if no consumers are listening, Redis Streams provides a durable, persistent, append-only log modeled after Apache Kafka, but held entirely in high-speed RAM. A single Redis instance can ingest over 500,000 stream entries per second with sub-millisecond p99 latencies, making it the premier choice for low-latency financial feeds, live IoT telemetry, and user activity tracking.",
    "Internally, Redis Streams are implemented using Radix Trees (also known as Patricia Tries). Radix trees provide exceptional memory efficiency and logarithmic search times by indexing string prefixes. Every stream entry is assigned a globally unique, monotonically increasing 64-bit Entry ID composed of two numbers separated by a hyphen: `<millisecondsTime>-<sequenceNumber>` (for example, `1700000000000-0`).",
    "When an application publishes data via the `XADD` command, Redis records the current UNIX millisecond timestamp. If multiple entries are appended within the exact same millisecond, Redis increments the sequence number automatically, guaranteeing strict chronological ordering across the entire stream.",
    "In Part 1, we implement our `appendRedisStreamEntry` simulator. This engine models Redis stream appending, entry ID generation, and in-memory log structuring.",
    "Let us explore how our Redis stream engine generates millisecond sequence identifiers and structures stream entries.",
    "From an algorithmic efficiency standpoint, Radix trees allow Redis to store millions of telemetry entries in contiguous memory blocks called Listpacks. Listpacks compress integer timestamps and repetitive field names, dramatically reducing RAM usage compared to standard linked lists or hash maps.",
    "Furthermore, producers can specify explicit entry IDs or allow Redis to generate them automatically using the asterisk syntax (`XADD mystream * sensor temp_01 val 24.5`).",
    "Because Redis is single-threaded and executes commands atomically, concurrent XADD operations from hundreds of Node.js microservices are serialized with mathematical precision, preventing timestamp collisions or race conditions.",
    "This in-memory append-only architecture delivers the ordering guarantees of a distributed commit log with the microsecond response times of an in-memory cache."
]

p1_code = """function appendRedisStreamEntry(stream, fields) {
  const timestamp = Date.now();
  const sequence = stream.lastTimestamp === timestamp ? stream.lastSequence + 1 : 0;
  const entryId = `${timestamp}-${sequence}`;
  
  const entry = { id: entryId, fields };
  stream.entries.push(entry);
  stream.lastTimestamp = timestamp;
  stream.lastSequence = sequence;

  return {
    entryId,
    streamLength: stream.entries.length,
    lastEntry: entry
  };
}

const mystream = { entries: [], lastTimestamp: 0, lastSequence: 0 };
const e1 = appendRedisStreamEntry(mystream, { sensor: 'temp_01', val: 24.5 });
const e2 = appendRedisStreamEntry(mystream, { sensor: 'temp_02', val: 26.1 });

console.log('Stream Length:', mystream.entries.length);
console.log('Entry 1 Fields:', JSON.stringify(e1.lastEntry.fields));
console.log('Entry 2 Fields:', JSON.stringify(e2.lastEntry.fields));
console.log('Entries Appended Successfully:', e1.entryId !== e2.entryId);"""

p2_say = [
    "Having mastered stream creation, Part 2 explores Redis Consumer Groups and the `XREADGROUP` command. How do multiple distributed Node.js worker containers consume a Redis stream collaboratively without duplicating work?",
    "Just like Apache Kafka, Redis Streams implements Consumer Groups via the `XGROUP CREATE` command. A consumer group represents an independent logical view of the stream with its own reading cursor. Multiple distinct consumer groups can read the exact same stream independently: for example, a `fraud-detection` group and an `order-fulfillment` group can both ingest the `orders` stream at their own pace.",
    "Within a single consumer group, multiple consumer instances (e.g. `worker-1`, `worker-2`) cooperate to process messages in parallel. When a worker invokes `XREADGROUP GROUP mygroup worker-1 COUNT 10 STREAMS mystream >`, the special ID `>` instructs Redis to deliver messages that have *never been delivered to any other consumer in this group*.",
    "Redis ensures that each message is dispatched to exactly one worker instance in the group, dividing the stream's processing volume across the worker fleet.",
    "In Part 2, our `readRedisStreamGroup` simulator models this message distribution algorithm, verifying that distinct consumers receive unique message batches.",
    "In production Node.js applications, workers use the blocking variant of the command (`XREADGROUP ... BLOCK 2000 STREAMS mystream >`). If no new messages are present in the stream, Redis pauses the worker's connection, releasing CPU cycles until a new entry is appended via XADD or the timeout expires.",
    "This event-driven blocking model eliminates CPU-intensive polling loops, allowing backend microservices to react to new stream entries in sub-millisecond time.",
    "Furthermore, consumers are identified by unique string names passed in the command, allowing containerized microservices to register ephemeral hostnames without requiring static registration.",
    "By combining consumer group parallelism with non-blocking event-driven sleep, Redis Streams delivers exceptional throughput and horizontal scalability."
]

p2_code = """function readRedisStreamGroup(group, consumerName, count = 2) {
  const dispatched = [];
  const available = group.stream.filter(e => !group.deliveredIds.has(e.id));

  for (let i = 0; i < Math.min(count, available.length); i++) {
    const entry = available[i];
    group.deliveredIds.add(entry.id);
    group.pel.set(entry.id, {
      consumer: consumerName,
      deliveredAt: Date.now(),
      deliveryCount: 1
    });
    dispatched.push(entry);
  }

  return {
    consumer: consumerName,
    countDispatched: dispatched.length,
    pelSize: group.pel.size,
    items: dispatched
  };
}

const mockGroup = {
  name: 'analytics-group',
  stream: [
    { id: '1700000000000-0', fields: { metric: 'cpu', val: 78 } },
    { id: '1700000000000-1', fields: { metric: 'ram', val: 64 } },
    { id: '1700000000000-2', fields: { metric: 'disk', val: 42 } }
  ],
  deliveredIds: new Set(),
  pel: new Map()
};

const read1 = readRedisStreamGroup(mockGroup, 'worker-A', 2);
const read2 = readRedisStreamGroup(mockGroup, 'worker-B', 2);

console.log('Worker A Dispatched:', read1.countDispatched);
console.log('Worker B Dispatched:', read2.countDispatched);
console.log('Total In-Flight PEL Entries:', mockGroup.pel.size);
console.log('Total Delivered Unique:', mockGroup.deliveredIds.size);"""

p3_say = [
    "In distributed systems, delivering a message to a worker does not guarantee that the message will be processed successfully. What happens if a worker container crashes or experiences an unhandled exception midway through processing? In Part 3, we analyze the Pending Acknowledgment List (PEL) and the `XPENDING` command.",
    "When Redis delivers a message to a consumer via `XREADGROUP`, it does not immediately consider the message completed. Instead, Redis adds the message ID to the consumer group's Pending Acknowledgment List (PEL). The PEL tracks three critical pieces of metadata for every in-flight message: the ID of the consumer holding the message, the timestamp of when it was delivered, and the number of times it has been delivered.",
    "Only when the consumer finishes its business processing and explicitly issues the `XACK mystream mygroup <id>` command does Redis remove the entry from the PEL, confirming successful completion.",
    "If a consumer crashes without acknowledging, the unacknowledged message remains safely recorded in the PEL indefinitely. By querying `XPENDING mystream mygroup`, monitoring daemons can inspect all unacknowledged messages, group them by consumer, and identify workers that are stalling or dead.",
    "In Part 3, we implement our `inspectPendingAcknowledgmentList` auditor. This program audits PEL entries, measures idle durations, and flags stale messages that have exceeded processing timeouts.",
    "In enterprise Site Reliability Engineering, monitoring PEL depth is equivalent to monitoring Kafka consumer lag or RabbitMQ unacknowledged messages. An increasing PEL size indicates that workers are either failing to emit XACK commands or are crashing before completion.",
    "Furthermore, XPENDING supports range queries and idle time filtering (`XPENDING mystream mygroup IDLE 10000 - + 10`), allowing diagnostic agents to pinpoint the exact messages that have been stuck for more than 10 seconds without scanning the entire stream.",
    "This transparent in-flight tracking guarantees that no stream entry is ever silently dropped or abandoned."
]

p3_code = """function inspectPendingAcknowledgmentList(pelMap, idleThresholdMs = 5000) {
  const now = Date.now();
  let totalPending = 0;
  const consumers = {};
  const staleEntries = [];

  for (const [id, meta] of pelMap.entries()) {
    totalPending++;
    consumers[meta.consumer] = (consumers[meta.consumer] || 0) + 1;
    const idleTime = now - meta.deliveredAt;
    if (idleTime >= idleThresholdMs) {
      staleEntries.push({ id, consumer: meta.consumer, idleTimeMs: idleTime });
    }
  }

  return {
    totalPending,
    consumers,
    staleCount: staleEntries.length,
    staleEntries
  };
}

const pel = new Map();
const t = Date.now();
pel.set('entry-1', { consumer: 'worker-1', deliveredAt: t - 6000 });
pel.set('entry-2', { consumer: 'worker-1', deliveredAt: t - 2000 });
pel.set('entry-3', { consumer: 'worker-2', deliveredAt: t - 1000 });

const report = inspectPendingAcknowledgmentList(pel, 5000);
console.log('Total Pending Messages:', report.totalPending);
console.log('Worker 1 Pending:', report.consumers['worker-1']);
console.log('Worker 2 Pending:', report.consumers['worker-2']);
console.log('Stale Entries Needing Claim:', report.staleCount);"""

p4_say = [
    "What happens when a worker node dies permanently while holding unacknowledged messages in the PEL? In Part 4, we master Consumer Fault Recovery via Message Claiming (`XCLAIM` and `XAUTOCLAIM`).",
    "Because the deceased worker will never recover to issue an `XACK`, its in-flight messages would remain trapped in the PEL forever if not for Redis's claiming mechanism. Surviving workers can periodically inspect the PEL for messages whose idle time exceeds a defined threshold (e.g. 30 seconds).",
    "When a stale message is detected, a healthy consumer executes `XCLAIM mystream mygroup <newConsumer> 30000 <id>`. This command atomically reassigns ownership of the message to the new consumer, resets its delivery timestamp to the current time, and increments its delivery counter.",
    "In Redis 6.2 and later, this process is further streamlined by `XAUTOCLAIM`, which scans the PEL, identifies messages that have been idle for longer than the minimum idle time, and transfers ownership to the calling consumer in a single atomic command.",
    "In Part 4, our `claimStaleStreamMessage` engine models atomic message claiming, transferring ownership from dead workers to healthy workers while incrementing delivery attempt counts.",
    "In production architectures, message claiming must be paired with Poison Pill Defense. If a particular message has a delivery attempt count exceeding 3 or 5, it indicates that the payload itself is corrupted and causes any worker that attempts to process it to crash.",
    "When a consumer detects a message with `deliveryCount > 5`, it aborts processing, acknowledges the message from the primary stream via `XACK`, and routes the payload to a separate dead-letter stream (`mystream.dlq`), preventing infinite claim-and-crash loops.",
    "This automated self-healing protocol guarantees that distributed worker fleets survive node terminations and recover abandoned tasks transparently."
]

p4_code = """function claimStaleStreamMessage(pelMap, messageId, newConsumer) {
  if (!pelMap.has(messageId)) {
    return { success: false, reason: 'MESSAGE_NOT_IN_PEL' };
  }

  const oldMeta = pelMap.get(messageId);
  const updatedMeta = {
    consumer: newConsumer,
    deliveredAt: Date.now(),
    deliveryCount: (oldMeta.deliveryCount || 1) + 1,
    reclaimedFrom: oldMeta.consumer
  };

  pelMap.set(messageId, updatedMeta);

  return {
    success: true,
    messageId,
    newOwner: newConsumer,
    previousOwner: oldMeta.consumer,
    deliveryAttempts: updatedMeta.deliveryCount
  };
}

const pelState = new Map();
pelState.set('entry-99', { consumer: 'dead-worker-1', deliveredAt: Date.now() - 10000, deliveryCount: 1 });

const claim = claimStaleStreamMessage(pelState, 'entry-99', 'healthy-worker-2');
console.log('Claim Success:', claim.success);
console.log('New Owner:', claim.newOwner);
console.log('Previous Owner:', claim.previousOwner);
console.log('Delivery Attempts:', claim.deliveryAttempts);"""

p5_say = [
    "We conclude Day 34 with Part 5: Stream Compaction, Memory Optimization, and High-Throughput Ingestion using `XTRIM` and `MAXLEN`.",
    "Because Redis is an in-memory data store, an unbounded stream appending millions of entries every day will eventually consume all available server RAM, triggering Redis out-of-memory errors and crashing the database. Unlike Apache Kafka, which stores terabytes of data on inexpensive block storage, Redis Streams must be carefully capped to prevent unbounded memory growth.",
    "Redis provides two primary mechanisms for capping stream length: First, producers can append the `MAXLEN` parameter directly to the `XADD` command (`XADD mystream MAXLEN 100000 * ...`). When the stream exceeds 100,000 entries, Redis automatically evicts the oldest entries from the beginning of the stream.",
    "Second, operators can run the standalone `XTRIM` command out-of-band (`XTRIM mystream MAXLEN 50000`) to trim obsolete historical entries without interfering with producer application logic.",
    "To maximize CPU efficiency, Redis supports Approximate Trimming using the tilde operator (`MAXLEN ~ 100000`). Exact trimming requires Redis to modify Radix tree listpacks on every single insert, which introduces performance overhead. Approximate trimming evicts entire macro-nodes when convenient, keeping the stream length within a few dozen entries of the target while delivering maximum ingestion speed.",
    "In Part 5, we implement our `trimRedisStream` engine. This program validates stream capping, calculates evicted entries, and asserts that memory consumption remains strictly bounded.",
    "Let us observe how our stream trimming simulator maintains bounded length and protects memory stability.",
    "In enterprise architectures, Redis Streams is frequently used as a high-speed ingestion buffer in front of cold storage. Telemetry events land in Redis Streams at 100,000 events per second; asynchronous workers batch the entries and flush them to Amazon S3 or Snowflake in Parquet format; and Redis trims the stream to retain only the most recent 24 hours of data in RAM.",
    "This hybrid architecture combines the microsecond ingestion speed of Redis with the cost-effective long-term storage of distributed data lakes.",
    "Congratulations on mastering Day 34! You have conquered Redis Streams, Radix tree indexing, consumer groups, pending acknowledgment lists, fault-recovery claiming, and stream memory trimming.",
    "Tomorrow in Day 35, we conclude Block 7 with Milestone 6: architecting a production-grade Distributed Event-Driven Order Processing Engine combining Kafka, the Outbox Pattern, and consumer lag monitoring!"
]

p5_code = """function trimRedisStream(stream, maxLen) {
  const initialLength = stream.entries.length;
  let evictedCount = 0;

  if (initialLength > maxLen) {
    evictedCount = initialLength - maxLen;
    stream.entries = stream.entries.slice(evictedCount);
  }

  return {
    initialLength,
    finalLength: stream.entries.length,
    evictedCount,
    isWithinLimit: stream.entries.length <= maxLen
  };
}

const telemetryStream = {
  entries: [
    { id: '1-0', val: 10 },
    { id: '2-0', val: 20 },
    { id: '3-0', val: 30 },
    { id: '4-0', val: 40 },
    { id: '5-0', val: 50 }
  ]
};

const trimResult = trimRedisStream(telemetryStream, 3);
console.log('Initial Stream Length:', trimResult.initialLength);
console.log('Final Stream Length:', trimResult.finalLength);
console.log('Evicted Entries Count:', trimResult.evictedCount);
console.log('Within MaxLen Limit:', trimResult.isWithinLimit);"""

def run_code(code):
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    return res.stdout.strip()

out1 = run_code(p1_code)
out2 = run_code(p2_code)
out3 = run_code(p3_code)
out4 = run_code(p4_code)
out5 = run_code(p5_code)

parts = [
    {
        "title": "Redis Streams Data Structure: Radix Trees, Entry IDs & Append Semantics (XADD)",
        "say": p1_say,
        "code": p1_code,
        "output": out1,
        "check": {
            "question": "What is the format of a Redis Stream Entry ID generated by XADD?",
            "options": [
                "<millisecondsTime>-<sequenceNumber>, guaranteeing strict chronological ordering across the stream",
                "A random 32-character hexadecimal string",
                "A simple integer counter from 1 to 100",
                "The IP address of the connected client"
            ],
            "answer": 0,
            "why": "Redis Stream IDs combine a 64-bit millisecond timestamp with a sequence counter, ensuring unique and monotonically increasing chronological ordering."
        }
    },
    {
        "title": "Consumer Groups & Stream Ingestion: XREADGROUP & Message Distribution",
        "say": p2_say,
        "code": p2_code,
        "output": out2,
        "check": {
            "question": "In the XREADGROUP command, what does passing the special ID '>' signify?",
            "options": [
                "It requests messages that have never been delivered to any other consumer in this consumer group",
                "It deletes all messages from the stream permanently",
                "It redirects all stream traffic to an external relational database",
                "It resets the consumer group offset back to the beginning of the stream"
            ],
            "answer": 0,
            "why": "The special ID '>' instructs Redis to fetch and deliver only new messages that have not yet been assigned to any member of the consumer group."
        }
    },
    {
        "title": "Pending Acknowledgment List (PEL): Tracking In-Flight Messages & XPENDING",
        "say": p3_say,
        "code": p3_code,
        "output": out3,
        "check": {
            "question": "What happens to a message in the Pending Acknowledgment List (PEL) when a consumer issues an XACK command?",
            "options": [
                "Redis removes the message from the PEL, confirming successful processing completion",
                "Redis increments the message's delivery counter and sends it to another worker",
                "The message is copied to all other consumer groups",
                "Redis shuts down the stream to conserve memory"
            ],
            "answer": 0,
            "why": "The XACK command acknowledges successful message processing, causing Redis to remove the entry from the consumer group's PEL."
        }
    },
    {
        "title": "Consumer Fault Recovery: Message Claiming with XCLAIM & Dead Consumer Eviction",
        "say": p4_say,
        "code": p4_code,
        "output": out4,
        "check": {
            "question": "How do surviving workers recover unacknowledged messages abandoned by a crashed consumer?",
            "options": [
                "They inspect the PEL for messages exceeding an idle threshold and execute XCLAIM or XAUTOCLAIM to take ownership",
                "They restart the Redis server to flush unacknowledged messages",
                "They manually re-publish the messages from client web browsers",
                "Redis automatically deletes unacknowledged messages after 10 seconds"
            ],
            "answer": 0,
            "why": "XCLAIM and XAUTOCLAIM allow healthy workers to reassign ownership of stale unacknowledged messages from dead workers, ensuring fault-tolerant task recovery."
        }
    },
    {
        "title": "Stream Compaction & Memory Optimization: XTRIM, MAXLEN & High-Throughput Telemetry",
        "say": p5_say,
        "code": p5_code,
        "output": out5,
        "check": {
            "question": "Why is the MAXLEN parameter essential when appending high-frequency entries to a Redis Stream?",
            "options": [
                "To cap the stream length and evict obsolete entries, preventing unbounded RAM consumption and out-of-memory crashes",
                "To speed up the network connection between client and server",
                "To encrypt message payloads using AES-256",
                "To prevent consumers from reading messages out of order"
            ],
            "answer": 0,
            "why": "Because Redis is an in-memory database, capping stream length with MAXLEN or XTRIM is essential to prevent streams from consuming all available server RAM."
        }
    }
]

day34 = {
    "day": 34,
    "title": "Redis Streams & Consumer Groups: High-Throughput In-Memory Streaming & Pending Acknowledgment Lists",
    "goal": "Master in-memory streaming with Redis Streams in Node.js: analyze Radix Tree stream structures (XADD), consumer groups (XREADGROUP), Pending Acknowledgment Lists (PEL via XPENDING), consumer claiming (XCLAIM / XAUTOCLAIM), and stream capping (MAXLEN / XTRIM).",
    "minutes": 38,
    "recap": "Yesterday in Day 33, we mastered broker-centric queuing with RabbitMQ AMQP exchanges, routing keys, prefetch backpressure, and dead-letter exchanges. Today, we explore in-memory streaming logs with Redis Streams.",
    "parts": parts,
    "summary": [
        "Redis Streams persist ordered, append-only entries in memory using compact, high-efficiency Radix Tree data structures.",
        "Consumer groups distribute stream entries across multiple worker instances, ensuring each entry is processed by exactly one worker.",
        "The Pending Acknowledgment List (PEL) tracks in-flight messages until explicit XACK confirmation is received.",
        "XCLAIM and XAUTOCLAIM enable surviving workers to recover and re-process stale messages abandoned by crashed consumer pods.",
        "Stream capping via MAXLEN and XTRIM bounds memory consumption, enabling Redis Streams to function as high-speed ingestion buffers."
    ],
    "projectStep": {
        "title": "Implement Redis Stream Ingestion & PEL Claiming Simulator",
        "steps": [
            "Execute appendRedisStreamEntry to simulate XADD operations and generate millisecond-sequence entry IDs.",
            "Run readRedisStreamGroup to test consumer group dispatching with the special '>' operator and populate the PEL.",
            "Inspect in-flight stream state with inspectPendingAcknowledgmentList, identifying stale messages exceeding idle thresholds.",
            "Execute claimStaleStreamMessage to simulate XCLAIM recovery from dead workers to healthy consumer pods.",
            "Run trimRedisStream to validate stream length capping via MAXLEN, evicting obsolete entries and preserving memory bounds."
        ]
    }
}

total_words = 0
for i, p in enumerate(day34['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"Day 34 Part {i+1}: {wc} words")
print(f"Total Day 34 Words: {total_words}")

with open('scripts/node_day34.json', 'w', encoding='utf-8') as f:
    json.dump(day34, f, indent=2)

print("Generated scripts/node_day34.json successfully!")
