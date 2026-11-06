import subprocess

js_code = """
function buildRunnable(starter, hint) {
  const lastBrace = starter.lastIndexOf('}');
  const head = starter.substring(0, lastBrace);
  const cleaned = head.replace(/return\\s*[^;]*;\\s*$/, '');
  return `${cleaned}\\n  ${hint}\\n}\\n`;
}

// Day 31 Exam
const d31e = buildRunnable('function calculateEventLoopLag(expectedMs, actualMs) { return {}; }', 'const lagMs = Math.max(0, actualMs - expectedMs); return { lagMs, status: lagMs > 20 ? "SATURATED" : "HEALTHY" };') + 'if (typeof calculateEventLoopLag !== "function") throw new Error(); const r1 = calculateEventLoopLag(10, 12); if (r1.lagMs !== 2 || r1.status !== "HEALTHY") throw new Error(); const r2 = calculateEventLoopLag(10, 35); if (r2.lagMs !== 25 || r2.status !== "SATURATED") throw new Error();';
eval(d31e);
console.log('Day 31 Exam: PASS');

// Day 31 Assignment
const d31a = buildRunnable('function formatWorkerTaskPayload(taskId, payload) { return {}; }', 'return { id: taskId, timestamp: 1710000000000, payload };') + 'const res = formatWorkerTaskPayload("task-101", { cpu: 80 }); if (res.id !== "task-101" || res.payload.cpu !== 80 || typeof res.timestamp !== "number") throw new Error();';
eval(d31a);
console.log('Day 31 Assignment: PASS');

// Day 32 Exam
const d32e = buildRunnable('function computeKafkaPartition(key, numPartitions) { return 0; }', 'let hash = 0; for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0; return hash % numPartitions;') + 'const p1 = computeKafkaPartition("user-100", 8); const p2 = computeKafkaPartition("user-100", 8); if (p1 !== p2 || p1 < 0 || p1 >= 8) throw new Error();';
eval(d32e);
console.log('Day 32 Exam: PASS');

// Day 32 Assignment
const d32a = buildRunnable('function evaluateConsumerLag(leo, committed) { return {}; }', 'const lag = Math.max(0, leo - committed); return { lag, isCritical: lag > 100 };') + 'const l1 = evaluateConsumerLag(1050, 1000); if (l1.lag !== 50 || l1.isCritical !== false) throw new Error();';
eval(d32a);
console.log('Day 32 Assignment: PASS');

// Day 33 Exam
const d33e = buildRunnable('function routeRabbitMqMessage(routingKey, bindingPatterns) { return []; }', 'return bindingPatterns.filter(p => p === "#" || p === routingKey || (p.endsWith(".*") && routingKey.startsWith(p.slice(0, -2))));') + 'const m1 = routeRabbitMqMessage("order.created", ["order.*", "payment.*", "#"]); if (m1.length !== 2 || !m1.includes("order.*") || !m1.includes("#")) throw new Error();';
eval(d33e);
console.log('Day 33 Exam: PASS');

// Day 33 Assignment
const d33a = buildRunnable('function classifyDlqAction(attempts, maxRetries, isCorrupt) { return {}; }', 'return { action: (isCorrupt || attempts >= maxRetries) ? "DEAD_LETTER" : "RETRY", attempts };') + 'const a1 = classifyDlqAction(1, 3, false); if (a1.action !== "RETRY") throw new Error(); const a2 = classifyDlqAction(3, 3, false); if (a2.action !== "DEAD_LETTER") throw new Error();';
eval(d33a);
console.log('Day 33 Assignment: PASS');

// Day 34 Exam
const d34e = buildRunnable('function generateRedisStreamId(timestampMs, sequence) { return ""; }', 'return timestampMs + "-" + sequence;') + 'const id1 = generateRedisStreamId(1710000000000, 0); if (id1 !== "1710000000000-0") throw new Error();';
eval(d34e);
console.log('Day 34 Exam: PASS');

// Day 34 Assignment
const d34a = buildRunnable('function filterStalePelEntries(entries, minIdleMs) { return []; }', 'return entries.filter(e => e.idleMs >= minIdleMs).map(e => e.id);') + 'const stale = filterStalePelEntries([{ id: "m1", idleMs: 15000 }, { id: "m2", idleMs: 45000 }, { id: "m3", idleMs: 31000 }], 30000); if (stale.length !== 2 || !stale.includes("m2") || !stale.includes("m3")) throw new Error();';
eval(d34a);
console.log('Day 34 Assignment: PASS');

// Day 35 Exam
const d35e = buildRunnable('function validateOutboxRecord(record) { return false; }', 'return typeof record.id === "number" && typeof record.aggregateId === "string" && record.payload !== null && ["PENDING", "PROCESSED"].includes(record.status);') + 'const ok = validateOutboxRecord({ id: 1, aggregateId: "ord-101", payload: { amt: 99 }, status: "PENDING" }); if (ok !== true) throw new Error();';
eval(d35e);
console.log('Day 35 Exam: PASS');

// Day 35 Assignment
const d35a = buildRunnable('function auditOrderEngineSla(metrics) { return {}; }', 'const pass = metrics.relayLatencyMs <= 10.0 && metrics.throughput >= 10000 && metrics.dlqIsolationPct === 100; return { pass, grade: pass ? "A+" : "FAIL" };') + 'const s1 = auditOrderEngineSla({ relayLatencyMs: 3.2, throughput: 25000, dlqIsolationPct: 100 }); if (s1.pass !== true || s1.grade !== "A+") throw new Error();';
eval(d35a);
console.log('Day 35 Assignment: PASS');
"""

res = subprocess.run(['node', '-e', js_code], capture_output=True, text=True)
print(res.stdout)
if res.stderr:
    print("ERR:", res.stderr)
