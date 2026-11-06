import json

# 1. Append Days 36..40 to src/lib/data/nodeWebLongLessons.ts
print("--- 1. Updating src/lib/data/nodeWebLongLessons.ts ---")
with open('src/lib/data/nodeWebLongLessons.ts', 'r', encoding='utf-8') as f:
    long_content = f.read()

# Find the last "];"
last_bracket = long_content.rfind('];')
if last_bracket == -1:
    raise RuntimeError("Could not find closing '];' in nodeWebLongLessons.ts")

before_close = long_content[:last_bracket].rstrip()

new_lessons = []
for day in [36, 37, 38, 39, 40]:
    with open(f"scripts/node_day{day}.json", 'r', encoding='utf-8') as f:
        lesson = json.load(f)
        new_lessons.append(json.dumps(lesson, indent=2))

lessons_joined = ",\n" + ",\n".join(new_lessons) + "\n];\n"
updated_long_content = before_close + lessons_joined

with open('src/lib/data/nodeWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(updated_long_content)
print("Updated nodeWebLongLessons.ts with Days 36-40 successfully!")

# 2. Append Days 36..40 to src/lib/data/nodeWebDays.ts
print("\n--- 2. Updating src/lib/data/nodeWebDays.ts ---")
with open('src/lib/data/nodeWebDays.ts', 'r', encoding='utf-8') as f:
    days_content = f.read()

last_bracket = days_content.rfind('];')
if last_bracket == -1:
    raise RuntimeError("Could not find closing '];' in nodeWebDays.ts")

before_close = days_content[:last_bracket].rstrip()

day_configs = [
    {
        "day": 36,
        "title": "High-Performance In-Memory Caching: Redis Cluster Sharding, Key Eviction Policies & Pipeline Batching",
        "desc": "Master Redis Cluster sharding in Node.js: analyze CRC16 slot distribution (16384 slots), hash tags for co-location, master-replica failover gossip, LRU/LFU eviction policies, and pipeline batching.",
        "syllabus": [
            "Redis Cluster topology: 16384 virtual hash slots, CRC16 hashing, and hash tags for co-location.",
            "Gossip protocol node communication, PFAIL/FAIL state transitions, and replica failover election.",
            "Memory eviction algorithms: allkeys-lru, volatile-lru, allkeys-lfu, volatile-lfu, and volatile-ttl.",
            "Pipeline batching vs MGET/MSET: RTT latency reduction, socket buffering, and slot multiplexing."
        ]
    },
    {
        "day": 37,
        "title": "Distributed Locking & Concurrency Control: Redlock Algorithm, Lease Renewals & Fencing Tokens",
        "desc": "Master distributed locking in Node.js: analyze single-instance vs multi-master Redlock quorum consensus, clock drift compensation, the Kleppmann GC pause dilemma, monotonically increasing fencing tokens, and renewal heartbeats.",
        "syllabus": [
            "Single-instance locks vs Redlock algorithm: quorum consensus across N independent Redis masters.",
            "Clock drift calculation, validity time limits, and non-blocking try-lock with randomized backoff.",
            "The Martin Kleppmann GC pause hazard: out-of-order write interception via Fencing Tokens.",
            "Distributed lease renewal heartbeats via background interval loops and atomic Lua renewal."
        ]
    },
    {
        "day": 38,
        "title": "Connection Pooling & Resource Sizing: Generic-Pool, Socket Reuse & PostgreSQL pgBouncer Gateways",
        "desc": "Master database connection pooling in Node.js: analyze TCP/TLS handshake overhead, generic-pool resource lifecycles, PostgreSQL backend process memory limits, pgBouncer multiplexing modes, and Little's Law sizing.",
        "syllabus": [
            "Database connection lifecycle overhead: TCP 3-way handshakes, TLS negotiation, and PostgreSQL RAM limits.",
            "Node.js connection pool management: max, min, acquireTimeoutMillis, idleTimeoutMillis, and evictors.",
            "PostgreSQL pgBouncer architecture: Session, Transaction, and Statement pooling multiplexing trade-offs.",
            "Connection sizing mathematics: Little's Law, CPU core bounds, and graceful pool draining on SIGTERM."
        ]
    },
    {
        "day": 39,
        "title": "Distributed Rate Limiting & Sliding Windows: Token Bucket, Leaky Bucket & Redis Lua Scripting",
        "desc": "Master API traffic shaping and abuse mitigation in Node.js: analyze Fixed Window boundary burst vulnerabilities, Sliding Window Logs, Sliding Window Weighted Counters, Token Bucket algorithms, atomic Redis Lua scripts, and RFC 6585 headers.",
        "syllabus": [
            "Rate limiting algorithms: Fixed Window counter vulnerabilities and edge boundary burst hazards.",
            "Sliding Window Logs in Redis Sorted Sets vs Sliding Window Counter weighted approximation math.",
            "Token Bucket burst tolerance vs Leaky Bucket constant-rate smoothing with lazy mathematical refill.",
            "Atomic single-round-trip enforcement via Redis EVALSHA Lua scripting and RFC 6585 (HTTP 429) headers."
        ]
    },
    {
        "day": 40,
        "title": "Milestone 7: Low-Latency Distributed Inventory Reservation Gateway with Redlock & Lua Caching",
        "desc": "Architect, implement, and certify an enterprise-grade Low-Latency Distributed Inventory Reservation Gateway in Node.js: synthesize Redis Cluster sharding, Redlock distributed locking with monotonically increasing fencing tokens, atomic inventory debiting via Redis Lua scripts, automated expiration reapers, and complete production SLA verification into a Grade A+ certified platform.",
        "syllabus": [
            "In-Memory Inventory Gateway topology and finite state machine: PENDING, HELD, COMMITTED, and EXPIRED.",
            "Atomic Lua script reservation engine: sub-millisecond stock checks, hold registration, and zero overselling.",
            "Distributed Mutex & Fencing Token Concurrency Gate: intercepting out-of-order writes from paused workers.",
            "Automated Expiration Reaper: sweeping abandoned holds and certifying Grade A+ sub-5ms P99 production SLAs."
        ]
    }
]

days_json = ",\n" + ",\n".join(json.dumps(d, indent=2) for d in day_configs) + "\n];\n"
updated_days_content = before_close + days_json

with open('src/lib/data/nodeWebDays.ts', 'w', encoding='utf-8') as f:
    f.write(updated_days_content)
print("Updated nodeWebDays.ts with Days 36-40 successfully!")

# 3. Append Days 36..40 to src/lib/data/nodeWeb30DayData.ts
print("\n--- 3. Updating src/lib/data/nodeWeb30DayData.ts ---")
with open('src/lib/data/nodeWeb30DayData.ts', 'r', encoding='utf-8') as f:
    configs_content = f.read()

target_marker = "export const NODE_WEB_30_DAYS_QUESTS ="
idx = configs_content.find(target_marker)
if idx == -1:
    raise RuntimeError("Could not find NODE_WEB_30_DAYS_QUESTS in nodeWeb30DayData.ts")

# Look backwards from idx for "];"
last_bracket = configs_content.rfind('];', 0, idx)
if last_bracket == -1:
    raise RuntimeError("Could not find closing bracket before quests export in nodeWeb30DayData.ts")

before_configs = configs_content[:last_bracket].rstrip()
after_configs = configs_content[last_bracket:]

block8_code_configs = """  },

  // ── DAY 36: High-Performance In-Memory Caching: Redis Cluster Sharding ──────────────────────────────
  {
    ...NODE_WEB_DAYS[35],
    eTitle: "Calculate Redis Cluster Slot",
    eDesc: "Write `calculateRedisSlot(key: string): number` extracting `{tag}` if present, summing character codes, and returning `sum % 16384`.",
    eLanguage: "typescript",
    eStarter: lines("function calculateRedisSlot(key) {", "  // Return slot modulo 16384", "  return 0;", "}"),
    eHint: "const m = key.match(/\\\\{([^}]+)\\\\}/); const s = m ? m[1] : key; let h = 0; for (let i = 0; i < s.length; i++) h += s.charCodeAt(i); return h % 16384;",
    eTest: lines(
      "if (typeof calculateRedisSlot !== 'function') throw new Error('calculateRedisSlot not found');",
      "const s1 = calculateRedisSlot('user:101');",
      "if (typeof s1 !== 'number' || s1 < 0 || s1 >= 16384) throw new Error('Invalid slot for s1: ' + s1);",
      "const s2 = calculateRedisSlot('{inventory:sku_iphone}:stock');",
      "const s3 = calculateRedisSlot('{inventory:sku_iphone}:holds');",
      "if (s2 !== s3) throw new Error('Hash tagged keys must map to identical slot: ' + s2 + ' vs ' + s3);"
    ),
    aTitle: "Evaluate Cache Eviction Policy",
    aDesc: "Write `evaluateEvictionPolicy(policy: string, maxMemoryReached: boolean): { evict: boolean; policy: string }` checking if memory is reached and policy starts with allkeys- or volatile-.",
    aLanguage: "typescript",
    aStarter: lines("function evaluateEvictionPolicy(policy, maxMemoryReached) {", "  // Evaluate eviction policy", "  return { evict: false, policy: policy };", "}"),
    aHint: "const canEvict = maxMemoryReached && (policy.startsWith('allkeys-') || policy.startsWith('volatile-')); return { evict: canEvict, policy };",
    aTest: lines(
      "if (typeof evaluateEvictionPolicy !== 'function') throw new Error('evaluateEvictionPolicy not found');",
      "const r1 = evaluateEvictionPolicy('allkeys-lru', true);",
      "if (r1.evict !== true || r1.policy !== 'allkeys-lru') throw new Error('Failed r1 allkeys-lru: ' + JSON.stringify(r1));",
      "const r2 = evaluateEvictionPolicy('noeviction', true);",
      "if (r2.evict !== false) throw new Error('Failed r2 noeviction check');",
      "const r3 = evaluateEvictionPolicy('allkeys-lru', false);",
      "if (r3.evict !== false) throw new Error('Failed r3 under-limit check');"
    )
  },

  // ── DAY 37: Distributed Locking & Concurrency Control: Redlock & Fencing Tokens ─────────────────────
  {
    ...NODE_WEB_DAYS[36],
    eTitle: "Validate Redlock Quorum",
    eDesc: "Write `validateRedlockQuorum(nodeVotes: boolean[], totalNodes: number): boolean` returning true if granted votes >= floor(totalNodes / 2) + 1.",
    eLanguage: "typescript",
    eStarter: lines("function validateRedlockQuorum(nodeVotes, totalNodes) {", "  // Return quorum boolean", "  return false;", "}"),
    eHint: "const needed = Math.floor(totalNodes / 2) + 1; const granted = nodeVotes.filter(Boolean).length; return granted >= needed;",
    eTest: lines(
      "if (typeof validateRedlockQuorum !== 'function') throw new Error('validateRedlockQuorum not found');",
      "const q1 = validateRedlockQuorum([true, true, true, false, false], 5);",
      "if (q1 !== true) throw new Error('Expected true for 3 of 5 votes');",
      "const q2 = validateRedlockQuorum([true, true, false, false, false], 5);",
      "if (q2 !== false) throw new Error('Expected false for 2 of 5 votes');",
      "const q3 = validateRedlockQuorum([true, true], 3);",
      "if (q3 !== true) throw new Error('Expected true for 2 of 3 votes');"
    ),
    aTitle: "Verify Fencing Token Storage Gate",
    aDesc: "Write `verifyFencingGate(highestSeenToken: number, incomingToken: number): { allow: boolean; highestToken: number }` allowing write if incoming > highestSeen.",
    aLanguage: "typescript",
    aStarter: lines("function verifyFencingGate(highestSeenToken, incomingToken) {", "  // Verify incoming fencing token", "  return { allow: false, highestToken: highestSeenToken };", "}"),
    aHint: "const allow = incomingToken > highestSeenToken; return { allow, highestToken: allow ? incomingToken : highestSeenToken };",
    aTest: lines(
      "if (typeof verifyFencingGate !== 'function') throw new Error('verifyFencingGate not found');",
      "const g1 = verifyFencingGate(100, 105);",
      "if (g1.allow !== true || g1.highestToken !== 105) throw new Error('Failed g1 valid write: ' + JSON.stringify(g1));",
      "const g2 = verifyFencingGate(105, 102);",
      "if (g2.allow !== false || g2.highestToken !== 105) throw new Error('Failed g2 stale write rejection: ' + JSON.stringify(g2));"
    )
  },

  // ── DAY 38: Connection Pooling & Resource Sizing ────────────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[37],
    eTitle: "Calculate Little's Law Concurrency",
    eDesc: "Write `calculatePoolConcurrency(arrivalRatePerSec: number, avgServiceTimeSec: number): number` returning `Math.ceil(arrivalRatePerSec * avgServiceTimeSec)`.",
    eLanguage: "typescript",
    eStarter: lines("function calculatePoolConcurrency(arrivalRatePerSec, avgServiceTimeSec) {", "  // Return required active connections", "  return 0;", "}"),
    eHint: "return Math.ceil(arrivalRatePerSec * avgServiceTimeSec);",
    eTest: lines(
      "if (typeof calculatePoolConcurrency !== 'function') throw new Error('calculatePoolConcurrency not found');",
      "const c1 = calculatePoolConcurrency(500, 0.02);",
      "if (c1 !== 10) throw new Error('Expected 10 for 500 * 0.02, got ' + c1);",
      "const c2 = calculatePoolConcurrency(1000, 0.05);",
      "if (c2 !== 50) throw new Error('Expected 50 for 1000 * 0.05, got ' + c2);"
    ),
    aTitle: "Audit pgBouncer Mode Compatibility",
    aDesc: "Write `auditBouncerMode(mode: string, features: string[]): { compatible: boolean; reason?: string }` rejecting TRANSACTION mode if features contain 'LISTEN' or 'PREPARE'.",
    aLanguage: "typescript",
    aStarter: lines("function auditBouncerMode(mode, features) {", "  // Audit compatibility", "  return { compatible: false };", "}"),
    aHint: "if (mode === 'TRANSACTION' && (features.includes('LISTEN') || features.includes('PREPARE'))) return { compatible: false, reason: 'UNSUPPORTED_SESSION_FEATURE' }; return { compatible: true };",
    aTest: lines(
      "if (typeof auditBouncerMode !== 'function') throw new Error('auditBouncerMode not found');",
      "const b1 = auditBouncerMode('TRANSACTION', ['LISTEN']);",
      "if (b1.compatible !== false || b1.reason !== 'UNSUPPORTED_SESSION_FEATURE') throw new Error('Failed b1 LISTEN rejection: ' + JSON.stringify(b1));",
      "const b2 = auditBouncerMode('TRANSACTION', ['SELECT', 'INSERT']);",
      "if (b2.compatible !== true) throw new Error('Failed b2 stateless query check');",
      "const b3 = auditBouncerMode('SESSION', ['LISTEN']);",
      "if (b3.compatible !== true) throw new Error('Failed b3 session compatibility');"
    )
  },

  // ── DAY 39: Distributed Rate Limiting & Sliding Windows ─────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[38],
    eTitle: "Calculate Sliding Window Counter",
    eDesc: "Write `calculateSlidingCounter(prevCount: number, currCount: number, elapsedMs: number, windowMs: number): number` approximating rolling requests.",
    eLanguage: "typescript",
    eStarter: lines("function calculateSlidingCounter(prevCount, currCount, elapsedMs, windowMs) {", "  // Return estimated count", "  return 0;", "}"),
    eHint: "const weight = Math.max(0, (windowMs - elapsedMs) / windowMs); return Math.round((prevCount * weight) + currCount);",
    eTest: lines(
      "if (typeof calculateSlidingCounter !== 'function') throw new Error('calculateSlidingCounter not found');",
      "const sc1 = calculateSlidingCounter(80, 30, 15000, 60000);",
      "if (sc1 !== 90) throw new Error('Expected 90 for 80 * 0.75 + 30, got ' + sc1);",
      "const sc2 = calculateSlidingCounter(100, 20, 60000, 60000);",
      "if (sc2 !== 20) throw new Error('Expected 20 for 100 * 0 + 20, got ' + sc2);"
    ),
    aTitle: "Format RFC 6585 Rate Limit Headers",
    aDesc: "Write `formatRfcRateLimit(limit: number, currentUsage: number, resetSec: number): { status: number; headers: Record<string, string> }`.",
    aLanguage: "typescript",
    aStarter: lines("function formatRfcRateLimit(limit, currentUsage, resetSec) {", "  // Return status and headers", "  return { status: 200, headers: {} };", "}"),
    aHint: "const exceeded = currentUsage >= limit; const remaining = Math.max(0, limit - currentUsage); const headers = { 'RateLimit-Limit': String(limit), 'RateLimit-Remaining': String(remaining), 'RateLimit-Reset': String(resetSec) }; if (exceeded) headers['Retry-After'] = String(resetSec); return { status: exceeded ? 429 : 200, headers };",
    aTest: lines(
      "if (typeof formatRfcRateLimit !== 'function') throw new Error('formatRfcRateLimit not found');",
      "const h1 = formatRfcRateLimit(100, 45, 30);",
      "if (h1.status !== 200 || h1.headers['RateLimit-Remaining'] !== '55') throw new Error('Failed h1 200 check: ' + JSON.stringify(h1));",
      "const h2 = formatRfcRateLimit(100, 100, 15);",
      "if (h2.status !== 429 || h2.headers['Retry-After'] !== '15' || h2.headers['RateLimit-Remaining'] !== '0') throw new Error('Failed h2 429 check: ' + JSON.stringify(h2));"
    )
  },

  // ── DAY 40: Milestone 7: Low-Latency Distributed Inventory Reservation Gateway ──────────────────────
  {
    ...NODE_WEB_DAYS[39],
    eTitle: "Evaluate Stock Reservation",
    eDesc: "Write `evaluateStockReservation(currentStock: number, requestedQty: number, reservationId: string): { granted: boolean; remainingStock: number; reservationId: string }`.",
    eLanguage: "typescript",
    eStarter: lines("function evaluateStockReservation(currentStock, requestedQty, reservationId) {", "  // Return stock reservation result", "  return { granted: false, remainingStock: currentStock, reservationId: reservationId };", "}"),
    eHint: "if (requestedQty <= currentStock) return { granted: true, remainingStock: currentStock - requestedQty, reservationId }; return { granted: false, remainingStock: currentStock, reservationId };",
    eTest: lines(
      "if (typeof evaluateStockReservation !== 'function') throw new Error('evaluateStockReservation not found');",
      "const ev1 = evaluateStockReservation(10, 3, 'res_01');",
      "if (ev1.granted !== true || ev1.remainingStock !== 7) throw new Error('Failed ev1 reservation grant: ' + JSON.stringify(ev1));",
      "const ev2 = evaluateStockReservation(2, 5, 'res_02');",
      "if (ev2.granted !== false || ev2.remainingStock !== 2) throw new Error('Failed ev2 insufficient stock: ' + JSON.stringify(ev2));"
    ),
    aTitle: "Certify Milestone 7 Gateway SLA",
    aDesc: "Write `certifyGatewaySla(metrics: { p99Ms: number; oversellCount: number; fencingRejectionRate: number; reaperRate: number }): { certified: boolean; grade: string }` checking p99 <= 5.0, oversell === 0, fencing === 1.0, reaper === 1.0.",
    aLanguage: "typescript",
    aStarter: lines("function certifyGatewaySla(metrics) {", "  // Certify gateway SLA", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const ok = metrics.p99Ms <= 5.0 && metrics.oversellCount === 0 && metrics.fencingRejectionRate === 1.0 && metrics.reaperRate === 1.0; return { certified: ok, grade: ok ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyGatewaySla !== 'function') throw new Error('certifyGatewaySla not found');",
      "const s1 = certifyGatewaySla({ p99Ms: 3.4, oversellCount: 0, fencingRejectionRate: 1.0, reaperRate: 1.0 });",
      "if (s1.certified !== true || s1.grade !== 'A+') throw new Error('Failed s1 Grade A+: ' + JSON.stringify(s1));",
      "const s2 = certifyGatewaySla({ p99Ms: 7.2, oversellCount: 0, fencingRejectionRate: 1.0, reaperRate: 1.0 });",
      "if (s2.certified !== false || s2.grade !== 'FAIL') throw new Error('Failed s2 latency failure check');"
    )
  }
"""

updated_configs = before_configs + "\n" + block8_code_configs + after_configs

with open('src/lib/data/nodeWeb30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(updated_configs)
print("Updated nodeWeb30DayData.ts with Days 36-40 successfully!")
