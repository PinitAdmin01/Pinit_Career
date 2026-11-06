import json

# 1. Update nodeWebLongLessons.ts
print("--- Updating src/lib/data/nodeWebLongLessons.ts ---")
with open('src/lib/data/nodeWebLongLessons.ts', 'r', encoding='utf-8') as f:
    lessons_code = f.read()

# Load all 5 days
block7_lessons = []
for day in [31, 32, 33, 34, 35]:
    with open(f'scripts/node_day{day}.json', 'r', encoding='utf-8') as f:
        block7_lessons.append(json.load(f))

# Find the closing bracket
last_bracket = lessons_code.rfind('];')
assert last_bracket != -1, "Could not find closing ]; in nodeWebLongLessons.ts"

new_lessons_text = ",\n" + ",\n".join(json.dumps(l, indent=2) for l in block7_lessons) + "\n"
updated_lessons_code = lessons_code[:last_bracket] + new_lessons_text + lessons_code[last_bracket:]

with open('src/lib/data/nodeWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(updated_lessons_code)
print("Updated nodeWebLongLessons.ts successfully!")

# 2. Update nodeWebDays.ts
print("\n--- Updating src/lib/data/nodeWebDays.ts ---")
with open('src/lib/data/nodeWebDays.ts', 'r', encoding='utf-8') as f:
    days_code = f.read()

last_bracket_days = days_code.rfind('];')
assert last_bracket_days != -1, "Could not find closing ]; in nodeWebDays.ts"

days_data = [
    {
        "day": 31,
        "title": "Advanced Event-Driven Microservices: Asynchronous Event Loops, Worker Threads & Event Emitters",
        "desc": "Master the V8/libuv single-threaded concurrency model, multi-core worker threads offloading, streaming backpressure control, and distributed async tracing.",
        "syllabus": [
            "Libuv event loop phase execution: timers, pending I/O, poll phase, and setImmediate check queue.",
            "Offloading CPU-bound tasks to worker threads using MessageChannel and SharedArrayBuffer memory.",
            "Implementing high-watermark backpressure flow control across streaming EventEmitter pipelines.",
            "Distributed asynchronous context propagation and correlation tracing using AsyncLocalStorage."
        ]
    },
    {
        "day": 32,
        "title": "Distributed Message Brokers: Apache Kafka Architecture, Partitions, Consumer Groups & Offsets",
        "desc": "Architect high-throughput streaming systems with Apache Kafka, mastering commit logs, deterministic partition key routing, consumer group rebalances, and manual offset tracking.",
        "syllabus": [
            "Apache Kafka distributed commit log architecture, broker clusters, and topic partitioning.",
            "Deterministic partition key routing with MurmurHash2 and in-sync replica (ISR) durability.",
            "Consumer group coordinator protocols, heartbeat monitoring, and cooperative sticky rebalances.",
            "At-least-once manual offset commit workflows and real-time consumer lag monitoring."
        ]
    },
    {
        "day": 33,
        "title": "AMQP & Message Queuing: RabbitMQ Exchanges, Queues, Dead-Letter Exchanges & Acknowledgments",
        "desc": "Master enterprise AMQP messaging with RabbitMQ, implementing Direct, Topic, and Fanout exchanges, publisher confirms, dead-letter exchanges, and high-availability Quorum Queues.",
        "syllabus": [
            "AMQP protocol architecture: Direct, Topic, Fanout, and Headers exchanges to queue bindings.",
            "Publisher confirms and consumer acknowledgments (basic.ack, basic.nack, basic.reject).",
            "Dead-Letter Exchanges (DLX) and automated quarantine for poisoned or expired messages.",
            "Priority queue scheduling and high-availability Raft Quorum Queues vs classic mirroring."
        ]
    },
    {
        "day": 34,
        "title": "Redis Streams & Consumer Groups: High-Throughput In-Memory Streaming & Pending Acknowledgment Lists",
        "desc": "Master in-memory streaming with Redis Streams in Node.js: analyze Radix Tree stream structures, consumer groups, Pending Acknowledgment Lists (PEL), consumer claiming, and stream capping.",
        "syllabus": [
            "Redis Streams append-only architecture: Radix Tree indexing and Listpack macro-node storage.",
            "Consumer groups and distributed reading using XREADGROUP with the special '>' operator.",
            "Pending Acknowledgment List (PEL) state tracking and XPENDING idle duration inspection.",
            "Autonomous task recovery using XAUTOCLAIM and memory bounding with MAXLEN stream capping."
        ]
    },
    {
        "day": 35,
        "title": "Milestone 6: Distributed Event-Driven Order Processing Engine with Kafka & Outbox Pattern",
        "desc": "Architect, implement, and certify an enterprise-grade Distributed Event-Driven Order Processing Engine synthesizing Kafka topic partitioning, Transactional Outbox pattern, idempotent consumer deduplication, and consumer lag monitoring into a Grade A+ certified backend platform.",
        "syllabus": [
            "Transactional Outbox Pattern: eliminating the dual-write vulnerability with local ACID transactions.",
            "PostgreSQL Write-Ahead Log (WAL) CDC relaying with Debezium and sub-5ms Kafka publishing.",
            "Deterministic idempotent consumer deduplication enforcing 100% duplicate delivery protection.",
            "Automated Dead-Letter Queue quarantine and 6-vector production SLA Grade A+ certification."
        ]
    }
]

new_days_text = ",\n" + ",\n".join(json.dumps(d, indent=2) for d in days_data) + "\n"
updated_days_code = days_code[:last_bracket_days] + new_days_text + days_code[last_bracket_days:]

with open('src/lib/data/nodeWebDays.ts', 'w', encoding='utf-8') as f:
    f.write(updated_days_code)
print("Updated nodeWebDays.ts successfully!")

# 3. Update nodeWeb30DayData.ts
print("\n--- Updating src/lib/data/nodeWeb30DayData.ts ---")
with open('src/lib/data/nodeWeb30DayData.ts', 'r', encoding='utf-8') as f:
    data_code = f.read()

last_bracket_configs = data_code.rfind('];')
assert last_bracket_configs != -1, "Could not find closing ]; in nodeWeb30DayData.ts"

configs_text = """,
  // ── DAY 31: Advanced Event-Driven Microservices ─────────────────────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[30],
    eTitle: "Calculate Event Loop Lag",
    eDesc: "Write `calculateEventLoopLag(expectedMs: number, actualMs: number): { lagMs: number; status: string }` returning lagMs and status 'SATURATED' if lagMs > 20, else 'HEALTHY'.",
    eLanguage: "typescript",
    eStarter: lines("function calculateEventLoopLag(expectedMs: number, actualMs: number): { lagMs: number; status: string } {", "  // Return lag metrics", "  return { lagMs: 0, status: 'HEALTHY' };", "}"),
    eHint: "const lagMs = Math.max(0, actualMs - expectedMs); return { lagMs, status: lagMs > 20 ? 'SATURATED' : 'HEALTHY' };",
    eTest: lines(
      "if (typeof calculateEventLoopLag !== 'function') throw new Error('calculateEventLoopLag not found');",
      "const r1 = calculateEventLoopLag(10, 12);",
      "if (r1.lagMs !== 2 || r1.status !== 'HEALTHY') throw new Error('Failed r1');",
      "const r2 = calculateEventLoopLag(10, 35);",
      "if (r2.lagMs !== 25 || r2.status !== 'SATURATED') throw new Error('Failed r2');"
    ),
    aTitle: "Format Worker Task Payload",
    aDesc: "Write `formatWorkerTaskPayload(taskId: string, payload: any): { id: string; timestamp: number; payload: any }` with ISO timestamp.",
    aLanguage: "typescript",
    aStarter: lines("function formatWorkerTaskPayload(taskId: string, payload: any): { id: string; timestamp: number; payload: any } {", "  // Return worker payload", "  return { id: '', timestamp: 0, payload: null };", "}"),
    aHint: "return { id: taskId, timestamp: 1710000000000, payload };",
    aTest: lines(
      "if (typeof formatWorkerTaskPayload !== 'function') throw new Error('formatWorkerTaskPayload not found');",
      "const res = formatWorkerTaskPayload('task-101', { cpu: 80 });",
      "if (res.id !== 'task-101' || res.payload.cpu !== 80 || typeof res.timestamp !== 'number') throw new Error('Failed worker payload');"
    )
  },

  // ── DAY 32: Distributed Message Brokers: Apache Kafka ────────────────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[31],
    eTitle: "Compute Kafka Partition",
    eDesc: "Write `computeKafkaPartition(key: string, numPartitions: number): number` implementing deterministic partition key hashing.",
    eLanguage: "typescript",
    eStarter: lines("function computeKafkaPartition(key: string, numPartitions: number): number {", "  // Compute partition index", "  return 0;", "}"),
    eHint: "let hash = 0; for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0; return hash % numPartitions;",
    eTest: lines(
      "if (typeof computeKafkaPartition !== 'function') throw new Error('computeKafkaPartition not found');",
      "const p1 = computeKafkaPartition('user-100', 8);",
      "const p2 = computeKafkaPartition('user-100', 8);",
      "if (p1 !== p2 || p1 < 0 || p1 >= 8) throw new Error('Partition non-deterministic or out of bounds');",
      "const p3 = computeKafkaPartition('order-999', 8);",
      "if (typeof p3 !== 'number') throw new Error('Expected number partition');"
    ),
    aTitle: "Evaluate Consumer Lag",
    aDesc: "Write `evaluateConsumerLag(leo: number, committed: number): { lag: number; isCritical: boolean }` checking if lag > 100.",
    aLanguage: "typescript",
    aStarter: lines("function evaluateConsumerLag(leo: number, committed: number): { lag: number; isCritical: boolean } {", "  // Evaluate lag", "  return { lag: 0, isCritical: false };", "}"),
    aHint: "const lag = Math.max(0, leo - committed); return { lag, isCritical: lag > 100 };",
    aTest: lines(
      "if (typeof evaluateConsumerLag !== 'function') throw new Error('evaluateConsumerLag not found');",
      "const l1 = evaluateConsumerLag(1050, 1000);",
      "if (l1.lag !== 50 || l1.isCritical !== false) throw new Error('Failed l1');",
      "const l2 = evaluateConsumerLag(2000, 1500);",
      "if (l2.lag !== 500 || l2.isCritical !== true) throw new Error('Failed l2');"
    )
  },

  // ── DAY 33: AMQP & Message Queuing: RabbitMQ ───────────────────────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[32],
    eTitle: "Route RabbitMQ Message",
    eDesc: "Write `routeRabbitMqMessage(routingKey: string, bindingPatterns: string[]): string[]` returning matching queue patterns.",
    eLanguage: "typescript",
    eStarter: lines("function routeRabbitMqMessage(routingKey: string, bindingPatterns: string[]): string[] {", "  // Match AMQP routing key", "  return [];", "}"),
    eHint: "return bindingPatterns.filter(p => p === '#' || p === routingKey || (p.endsWith('.*') && routingKey.startsWith(p.slice(0, -2))));",
    eTest: lines(
      "if (typeof routeRabbitMqMessage !== 'function') throw new Error('routeRabbitMqMessage not found');",
      "const m1 = routeRabbitMqMessage('order.created', ['order.*', 'payment.*', '#']);",
      "if (m1.length !== 2 || !m1.includes('order.*') || !m1.includes('#')) throw new Error('Failed routing: ' + JSON.stringify(m1));"
    ),
    aTitle: "Classify DLQ Action",
    aDesc: "Write `classifyDlqAction(attempts: number, maxRetries: number, isCorrupt: boolean): { action: string; attempts: number }`.",
    aLanguage: "typescript",
    aStarter: lines("function classifyDlqAction(attempts: number, maxRetries: number, isCorrupt: boolean): { action: string; attempts: number } {", "  // Determine DLQ action", "  return { action: 'RETRY', attempts: 0 };", "}"),
    aHint: "return { action: (isCorrupt || attempts >= maxRetries) ? 'DEAD_LETTER' : 'RETRY', attempts };",
    aTest: lines(
      "if (typeof classifyDlqAction !== 'function') throw new Error('classifyDlqAction not found');",
      "const a1 = classifyDlqAction(1, 3, false);",
      "if (a1.action !== 'RETRY') throw new Error('Failed a1');",
      "const a2 = classifyDlqAction(3, 3, false);",
      "if (a2.action !== 'DEAD_LETTER') throw new Error('Failed a2');",
      "const a3 = classifyDlqAction(1, 3, true);",
      "if (a3.action !== 'DEAD_LETTER') throw new Error('Failed a3 corrupt');"
    )
  },

  // ── DAY 34: Redis Streams & Consumer Groups ────────────────────────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[33],
    eTitle: "Generate Redis Stream ID",
    eDesc: "Write `generateRedisStreamId(timestampMs: number, sequence: number): string` formatting `<timestamp>-<sequence>`.",
    eLanguage: "typescript",
    eStarter: lines("function generateRedisStreamId(timestampMs: number, sequence: number): string {", "  // Return stream entry ID", "  return '';", "}"),
    eHint: "return timestampMs + '-' + sequence;",
    eTest: lines(
      "if (typeof generateRedisStreamId !== 'function') throw new Error('generateRedisStreamId not found');",
      "const id1 = generateRedisStreamId(1710000000000, 0);",
      "if (id1 !== '1710000000000-0') throw new Error('Failed id1: ' + id1);",
      "const id2 = generateRedisStreamId(1710000000000, 4);",
      "if (id2 !== '1710000000000-4') throw new Error('Failed id2: ' + id2);"
    ),
    aTitle: "Filter Stale PEL Entries",
    aDesc: "Write `filterStalePelEntries(entries: Array<{ id: string; idleMs: number }>, minIdleMs: number): string[]` returning IDs with idleMs >= minIdleMs.",
    aLanguage: "typescript",
    aStarter: lines("function filterStalePelEntries(entries: Array<{ id: string; idleMs: number }>, minIdleMs: number): string[] {", "  // Filter stale entries", "  return [];", "}"),
    aHint: "return entries.filter(e => e.idleMs >= minIdleMs).map(e => e.id);",
    aTest: lines(
      "if (typeof filterStalePelEntries !== 'function') throw new Error('filterStalePelEntries not found');",
      "const stale = filterStalePelEntries([{ id: 'm1', idleMs: 15000 }, { id: 'm2', idleMs: 45000 }, { id: 'm3', idleMs: 31000 }], 30000);",
      "if (stale.length !== 2 || !stale.includes('m2') || !stale.includes('m3')) throw new Error('Failed filter: ' + JSON.stringify(stale));"
    )
  },

  // ── DAY 35: Milestone 6: Distributed Event-Driven Order Processing Engine ──────────────────────────────────
  {
    ...NODE_WEB_DAYS[34],
    eTitle: "Validate Outbox Record",
    eDesc: "Write `validateOutboxRecord(record: { id: number; aggregateId: string; payload: any; status: string }): boolean` ensuring valid types and status in PENDING, PROCESSED.",
    eLanguage: "typescript",
    eStarter: lines("function validateOutboxRecord(record: { id: number; aggregateId: string; payload: any; status: string }): boolean {", "  // Validate outbox record", "  return false;", "}"),
    eHint: "return typeof record.id === 'number' && typeof record.aggregateId === 'string' && record.payload !== null && ['PENDING', 'PROCESSED'].includes(record.status);",
    eTest: lines(
      "if (typeof validateOutboxRecord !== 'function') throw new Error('validateOutboxRecord not found');",
      "const ok = validateOutboxRecord({ id: 1, aggregateId: 'ord-101', payload: { amt: 99 }, status: 'PENDING' });",
      "if (ok !== true) throw new Error('Expected true for valid outbox record');",
      "const bad = validateOutboxRecord({ id: 2, aggregateId: 'ord-102', payload: null, status: 'INVALID' });",
      "if (bad !== false) throw new Error('Expected false for invalid outbox record');"
    ),
    aTitle: "Audit Order Engine SLA",
    aDesc: "Write `auditOrderEngineSla(metrics: { relayLatencyMs: number; throughput: number; dlqIsolationPct: number }): { pass: boolean; grade: string }` checking latency <= 10, throughput >= 10000, dlq 100%.",
    aLanguage: "typescript",
    aStarter: lines("function auditOrderEngineSla(metrics: { relayLatencyMs: number; throughput: number; dlqIsolationPct: number }): { pass: boolean; grade: string } {", "  // Audit SLA metrics", "  return { pass: false, grade: 'FAIL' };", "}"),
    aHint: "const pass = metrics.relayLatencyMs <= 10.0 && metrics.throughput >= 10000 && metrics.dlqIsolationPct === 100; return { pass, grade: pass ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof auditOrderEngineSla !== 'function') throw new Error('auditOrderEngineSla not found');",
      "const s1 = auditOrderEngineSla({ relayLatencyMs: 3.2, throughput: 25000, dlqIsolationPct: 100 });",
      "if (s1.pass !== true || s1.grade !== 'A+') throw new Error('Failed s1 Grade A+: ' + JSON.stringify(s1));",
      "const s2 = auditOrderEngineSla({ relayLatencyMs: 12.0, throughput: 25000, dlqIsolationPct: 100 });",
      "if (s2.pass !== false || s2.grade !== 'FAIL') throw new Error('Failed s2 failure check');"
    )
  }
"""

updated_data_code = data_code[:last_bracket_configs] + configs_text + data_code[last_bracket_configs:]

with open('src/lib/data/nodeWeb30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(updated_data_code)
print("Updated nodeWeb30DayData.ts successfully!")
print("\nALL FILES UPDATED!")
