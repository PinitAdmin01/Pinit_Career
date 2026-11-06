import json, re

# 1. Append Days 46..50 to src/lib/data/nodeWebLongLessons.ts
print("--- 1. Updating src/lib/data/nodeWebLongLessons.ts ---")
with open('src/lib/data/nodeWebLongLessons.ts', 'r', encoding='utf-8') as f:
    long_content = f.read()

last_bracket = long_content.rfind('];')
if last_bracket == -1:
    raise RuntimeError("Could not find closing '];' in nodeWebLongLessons.ts")

before_close = long_content[:last_bracket].rstrip()

new_lessons = []
for day in [46, 47, 48, 49, 50]:
    with open(f"scripts/node_day{day}.json", 'r', encoding='utf-8') as f:
        lesson = json.load(f)
        new_lessons.append(json.dumps(lesson, indent=2))

lessons_joined = ",\n" + ",\n".join(new_lessons) + "\n];\n"
updated_long_content = before_close + lessons_joined

with open('src/lib/data/nodeWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(updated_long_content)
print("Updated nodeWebLongLessons.ts with Days 46-50 successfully!")

# 2. Append Days 46..50 to src/lib/data/nodeWebDays.ts
print("\n--- 2. Updating src/lib/data/nodeWebDays.ts ---")
with open('src/lib/data/nodeWebDays.ts', 'r', encoding='utf-8') as f:
    days_content = f.read()

last_bracket = days_content.rfind('];')
if last_bracket == -1:
    raise RuntimeError("Could not find closing '];' in nodeWebDays.ts")

before_close = days_content[:last_bracket].rstrip()

day_configs = [
    {
        "day": 46,
        "title": "Clustering, Process Model & IPC: Node.js Cluster Module, Master-Worker Topologies & Shared Sockets",
        "desc": "Master Node.js multi-process clustering and IPC architectures: analyze master-worker process models, OS-level shared TCP sockets, Round-Robin scheduling, stream framing, and zero-downtime rolling restarts.",
        "syllabus": [
            "Node.js cluster module internals: master vs worker process roles, OS socket sharing, and child_process.fork.",
            "Round-robin scheduling vs OS SO_REUSEPORT socket accept distribution across CPU cores.",
            "Inter-process communication (IPC): 4-byte length-prefixed framing, serialization, and stream backpressure.",
            "Zero-downtime rolling restart orchestration: worker lifecycle states and graceful TCP connection draining."
        ]
    },
    {
        "day": 47,
        "title": "Distributed Consensus Algorithms: Raft Leader Election, Heartbeats & Replicated State Machines",
        "desc": "Master distributed consensus engineering in Node.js: analyze the Raft consensus protocol, randomized election timeouts, candidate promotions, majority quorum voting, and linearizable log replication.",
        "syllabus": [
            "Distributed consensus foundations: CAP theorem tradeoffs, FLP impossibility, and majority quorum slicing.",
            "Raft node roles and state machine transitions: Follower, Candidate, and Leader lifecycle invariants.",
            "Leader election and term epochs: randomized election timeouts and split-vote deadlock prevention.",
            "Two-phase log replication: AppendEntries RPCs, quorum acknowledgements, and state machine commit safety."
        ]
    },
    {
        "day": 48,
        "title": "Fault Tolerance, Circuit Breaking & Chaos Engineering: Cockatiel Patterns, Bulkheads & Failure Isolation",
        "desc": "Master enterprise resilience and fault isolation in Node.js: analyze cascading failure modes, Cockatiel circuit breaker state machines (CLOSED/OPEN/HALF_OPEN), bulkhead concurrency throttling, and exponential backoff with full jitter.",
        "syllabus": [
            "Cascading failure dynamics: connection pool exhaustion, thread starvation, and blast radius isolation.",
            "Circuit breaker finite state machines: CLOSED, OPEN, and HALF_OPEN transitions with fast-fail fallback execution.",
            "Bulkhead isolation patterns: compartmentalized concurrency pools and semaphore-backed queue limits.",
            "Exponential backoff algorithms: full jitter randomization and client-side retry budget enforcement."
        ]
    },
    {
        "day": 49,
        "title": "Dynamic Service Discovery & Health Checking: Consul / etcd Registration, Heartbeats & Client Load Balancing",
        "desc": "Master dynamic service discovery and client-side load balancing in Node.js: analyze distributed key-value registries (etcd/Consul), ephemeral lease TTLs, active vs passive health probes, and latency-aware Peak-EWMA routing.",
        "syllabus": [
            "Service discovery topology models: server-side proxying vs zero-hop client-side discovery.",
            "Ephemeral service registration: lease TTLs, keepalive heartbeats, and background dead instance reaping.",
            "Active and passive health checking: liveness/readiness probes, outlier detection, and flapping dampeners.",
            "Client-side load balancing algorithms: Round-Robin, Power of Two Choices, and adaptive Peak-EWMA routing."
        ]
    },
    {
        "day": 50,
        "title": "\ud83c\udfc6 Milestone 9: Resilient Multi-Node Consensus Cluster with Raft Leader Election & Distributed Lease Manager",
        "desc": "Architect, implement, and certify an enterprise-grade, multi-node distributed consensus cluster and distributed lock lease manager combining Raft leader election, randomized election timeouts, two-phase log replication, monotonic fencing tokens, and automated failover recovery.",
        "syllabus": [
            "Cluster topology architecture: multi-node Raft state machines, quorum thresholds, and leader dispatching.",
            "Raft election engine: follower timeouts, term logical clocks, and majority quorum vote collection.",
            "Distributed lock manager with monotonic fencing tokens: solving Martin Kleppmann's GC pause dilemma.",
            "Production SLA chaos verification: sub-250ms failover, stale write interception, and Grade A+ certification."
        ]
    }
]

formatted_configs = []
for cfg in day_configs:
    formatted_configs.append(f"""  {{
    day: {cfg['day']},
    title: "{cfg['title']}",
    desc: "{cfg['desc']}",
    syllabus: [
""" + ",\n".join(f'      "{s}"' for s in cfg['syllabus']) + """
    ]
  }""")

days_joined = ",\n" + ",\n".join(formatted_configs) + "\n];\n"
updated_days_content = before_close + days_joined

with open('src/lib/data/nodeWebDays.ts', 'w', encoding='utf-8') as f:
    f.write(updated_days_content)
print("Updated nodeWebDays.ts with Days 46-50 successfully!")

# 3. Append Days 46..50 to src/lib/data/nodeWeb30DayData.ts
print("\n--- 3. Updating src/lib/data/nodeWeb30DayData.ts ---")
with open('src/lib/data/nodeWeb30DayData.ts', 'r', encoding='utf-8') as f:
    thirty_content = f.read()

# Locate the closing "];" for NODE_WEB_30_DAYS_CONFIGS
marker = "export const NODE_WEB_30_DAYS_QUESTS"
marker_idx = thirty_content.find(marker)
if marker_idx == -1:
    raise RuntimeError(f"Could not find marker '{marker}' in nodeWeb30DayData.ts")

# Search backward from marker_idx for "];"
last_bracket = thirty_content.rfind('];', 0, marker_idx)
if last_bracket == -1:
    raise RuntimeError("Could not find closing '];' before NODE_WEB_30_DAYS_QUESTS")

before_configs = thirty_content[:last_bracket].rstrip()
after_configs = thirty_content[last_bracket:]

block10_code_configs = """
  // ── DAY 46: Clustering, Process Model & IPC ────────────────────────────────────
  {
    ...NODE_WEB_DAYS[45],
    eTitle: "Calculate Quorum Threshold",
    eDesc: "Write `calculateQuorum(totalNodes: number): { quorum: number; maxFaulty: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function calculateQuorum(totalNodes) {", "  // Return quorum threshold and max tolerated faulty nodes", "  return { quorum: 0, maxFaulty: 0 };", "}"),
    eHint: "const q = Math.floor(totalNodes / 2) + 1; const f = Math.floor((totalNodes - 1) / 2); return { quorum: q, maxFaulty: f };",
    eTest: lines(
      "if (typeof calculateQuorum !== 'function') throw new Error('calculateQuorum not found');",
      "const q1 = calculateQuorum(5);",
      "if (q1.quorum !== 3 || q1.maxFaulty !== 2) throw new Error('Failed 5 nodes quorum: ' + JSON.stringify(q1));",
      "const q2 = calculateQuorum(3);",
      "if (q2.quorum !== 2 || q2.maxFaulty !== 1) throw new Error('Failed 3 nodes quorum: ' + JSON.stringify(q2));"
    ),
    aTitle: "Parse Length-Prefixed Frame",
    aDesc: "Write `parseLengthPrefixedFrame(buffer: number[]): { length: number; payload: number[]; isValid: boolean }`.",
    aLanguage: "typescript",
    aStarter: lines("function parseLengthPrefixedFrame(buffer) {", "  // Return length, payload, and isValid", "  return { length: 0, payload: [], isValid: false };", "}"),
    aHint: "if (!buffer || buffer.length < 4) return { length: 0, payload: [], isValid: false }; const len = (buffer[0] << 24) | (buffer[1] << 16) | (buffer[2] << 8) | buffer[3]; if (buffer.length < 4 + len) return { length: len, payload: [], isValid: false }; return { length: len, payload: buffer.slice(4, 4 + len), isValid: true };",
    aTest: lines(
      "if (typeof parseLengthPrefixedFrame !== 'function') throw new Error('parseLengthPrefixedFrame not found');",
      "const f1 = parseLengthPrefixedFrame([0, 0, 0, 3, 10, 20, 30]);",
      "if (!f1.isValid || f1.length !== 3 || f1.payload.length !== 3 || f1.payload[1] !== 20) throw new Error('Failed f1 frame parse: ' + JSON.stringify(f1));",
      "const f2 = parseLengthPrefixedFrame([0, 0, 0, 5, 10, 20]);",
      "if (f2.isValid !== false) throw new Error('Failed incomplete frame check');"
    )
  },

  // ── DAY 47: Distributed Consensus Algorithms: Raft Leader Election ─────────────
  {
    ...NODE_WEB_DAYS[46],
    eTitle: "Evaluate RequestVote Decision",
    eDesc: "Write `evaluateRequestVote(voterTerm: number, candidateTerm: number, hasVoted: boolean): { voteGranted: boolean; updatedTerm: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function evaluateRequestVote(voterTerm, candidateTerm, hasVoted) {", "  // Return vote decision and updatedTerm", "  return { voteGranted: false, updatedTerm: voterTerm };", "}"),
    eHint: "if (candidateTerm > voterTerm) return { voteGranted: true, updatedTerm: candidateTerm }; if (candidateTerm === voterTerm && !hasVoted) return { voteGranted: true, updatedTerm: voterTerm }; return { voteGranted: false, updatedTerm: voterTerm };",
    eTest: lines(
      "if (typeof evaluateRequestVote !== 'function') throw new Error('evaluateRequestVote not found');",
      "const v1 = evaluateRequestVote(1, 2, false);",
      "if (v1.voteGranted !== true || v1.updatedTerm !== 2) throw new Error('Failed higher term vote: ' + JSON.stringify(v1));",
      "const v2 = evaluateRequestVote(2, 2, true);",
      "if (v2.voteGranted !== false) throw new Error('Failed duplicate vote rejection: ' + JSON.stringify(v2));"
    ),
    aTitle: "Calculate Commit Index",
    aDesc: "Write `calculateCommitIndex(matchIndices: number[], clusterSize: number): number`.",
    aLanguage: "typescript",
    aStarter: lines("function calculateCommitIndex(matchIndices, clusterSize) {", "  // Return majority quorum commit index", "  return 0;", "}"),
    aHint: "const sorted = matchIndices.slice().sort((a, b) => b - a); const quorumIdx = Math.floor(clusterSize / 2); return sorted[quorumIdx] || 0;",
    aTest: lines(
      "if (typeof calculateCommitIndex !== 'function') throw new Error('calculateCommitIndex not found');",
      "const c1 = calculateCommitIndex([10, 10, 8, 5, 2], 5);",
      "if (c1 !== 8) throw new Error('Failed 5-node commit index: ' + c1);",
      "const c2 = calculateCommitIndex([12, 12, 10], 3);",
      "if (c2 !== 12) throw new Error('Failed 3-node commit index: ' + c2);"
    )
  },

  // ── DAY 48: Fault Tolerance, Circuit Breaking & Chaos Engineering ──────────────
  {
    ...NODE_WEB_DAYS[47],
    eTitle: "Evaluate Circuit Breaker Trip",
    eDesc: "Write `evaluateCircuitTrip(consecutiveFailures: number, threshold: number): { tripOpen: boolean; state: string }`.",
    eLanguage: "typescript",
    eStarter: lines("function evaluateCircuitTrip(consecutiveFailures, threshold) {", "  // Return trip decision and state", "  return { tripOpen: false, state: 'CLOSED' };", "}"),
    eHint: "const trip = consecutiveFailures >= threshold; return { tripOpen: trip, state: trip ? 'OPEN' : 'CLOSED' };",
    eTest: lines(
      "if (typeof evaluateCircuitTrip !== 'function') throw new Error('evaluateCircuitTrip not found');",
      "const cb1 = evaluateCircuitTrip(5, 5);",
      "if (cb1.tripOpen !== true || cb1.state !== 'OPEN') throw new Error('Failed threshold trip: ' + JSON.stringify(cb1));",
      "const cb2 = evaluateCircuitTrip(3, 5);",
      "if (cb2.tripOpen !== false || cb2.state !== 'CLOSED') throw new Error('Failed healthy closed state: ' + JSON.stringify(cb2));"
    ),
    aTitle: "Check Retry Budget Allowance",
    aDesc: "Write `canRetryWithBudget(totalCalls: number, totalRetries: number, budgetPct: number): boolean`.",
    aLanguage: "typescript",
    aStarter: lines("function canRetryWithBudget(totalCalls, totalRetries, budgetPct) {", "  // Return boolean allowing or denying retry", "  return false;", "}"),
    aHint: "if (totalCalls < 10) return true; return ((totalRetries + 1) / totalCalls) * 100 <= budgetPct;",
    aTest: lines(
      "if (typeof canRetryWithBudget !== 'function') throw new Error('canRetryWithBudget not found');",
      "const r1 = canRetryWithBudget(5, 2, 10);",
      "if (r1 !== true) throw new Error('Failed warmup allowance check');",
      "const r2 = canRetryWithBudget(100, 10, 10);",
      "if (r2 !== false) throw new Error('Failed budget exhausted check');"
    )
  },

  // ── DAY 49: Dynamic Service Discovery & Health Checking ─────────────────────────
  {
    ...NODE_WEB_DAYS[48],
    eTitle: "Sweep Expired Registry Leases",
    eDesc: "Write `sweepExpiredLeases(services: Array<{ id: string; expiresAt: number }>, currentMs: number): string[]`.",
    eLanguage: "typescript",
    eStarter: lines("function sweepExpiredLeases(services, currentMs) {", "  // Return array of expired service IDs", "  return [];", "}"),
    eHint: "return services.filter(s => currentMs >= s.expiresAt).map(s => s.id);",
    eTest: lines(
      "if (typeof sweepExpiredLeases !== 'function') throw new Error('sweepExpiredLeases not found');",
      "const s1 = sweepExpiredLeases([{ id: 'svc_1', expiresAt: 1000 }, { id: 'svc_2', expiresAt: 2000 }], 1500);",
      "if (s1.length !== 1 || s1[0] !== 'svc_1') throw new Error('Failed expired sweep: ' + JSON.stringify(s1));",
      "const s2 = sweepExpiredLeases([{ id: 'svc_3', expiresAt: 3000 }], 1500);",
      "if (s2.length !== 0) throw new Error('Failed zero expired check');"
    ),
    aTitle: "Calculate Peak-EWMA Routing Cost",
    aDesc: "Write `calculatePeakEwmaCost(ewmaLatencyMs: number, inFlight: number): number`.",
    aLanguage: "typescript",
    aStarter: lines("function calculatePeakEwmaCost(ewmaLatencyMs, inFlight) {", "  // Return routing cost", "  return 0;", "}"),
    aHint: "return Number((ewmaLatencyMs * (inFlight + 1)).toFixed(2));",
    aTest: lines(
      "if (typeof calculatePeakEwmaCost !== 'function') throw new Error('calculatePeakEwmaCost not found');",
      "const cost1 = calculatePeakEwmaCost(12.5, 3);",
      "if (cost1 !== 50.0) throw new Error('Failed cost1: ' + cost1);",
      "const cost2 = calculatePeakEwmaCost(5.0, 0);",
      "if (cost2 !== 5.0) throw new Error('Failed cost2: ' + cost2);"
    )
  },

  // ── DAY 50: Milestone 9: Resilient Multi-Node Consensus Cluster ────────────────
  {
    ...NODE_WEB_DAYS[49],
    eTitle: "Validate Storage Fencing Token",
    eDesc: "Write `validateFencingToken(token: number, highWaterMark: number): { isValid: boolean; updatedHighWaterMark: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function validateFencingToken(token, highWaterMark) {", "  // Return validity and updated highWaterMark", "  return { isValid: false, updatedHighWaterMark: highWaterMark };", "}"),
    eHint: "const valid = token > highWaterMark; return { isValid: valid, updatedHighWaterMark: valid ? token : highWaterMark };",
    eTest: lines(
      "if (typeof validateFencingToken !== 'function') throw new Error('validateFencingToken not found');",
      "const tok1 = validateFencingToken(1005, 1000);",
      "if (tok1.isValid !== true || tok1.updatedHighWaterMark !== 1005) throw new Error('Failed higher token validation: ' + JSON.stringify(tok1));",
      "const tok2 = validateFencingToken(990, 1000);",
      "if (tok2.isValid !== false || tok2.updatedHighWaterMark !== 1000) throw new Error('Failed stale token rejection: ' + JSON.stringify(tok2));"
    ),
    aTitle: "Certify Milestone 9 Consensus Cluster SLA",
    aDesc: "Write `certifyMilestone9Sla(metrics: { failoverMs: number; splitBrainCount: number; staleWritesBlocked: number; leasesProcessed: number }): { certified: boolean; grade: string }` checking failoverMs <= 250, splitBrainCount === 0, staleWritesBlocked >= 1, leasesProcessed >= 100.",
    aLanguage: "typescript",
    aStarter: lines("function certifyMilestone9Sla(metrics) {", "  // Return SLA certification", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const pass = metrics.failoverMs <= 250 && metrics.splitBrainCount === 0 && metrics.staleWritesBlocked >= 1 && metrics.leasesProcessed >= 100; return { certified: pass, grade: pass ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyMilestone9Sla !== 'function') throw new Error('certifyMilestone9Sla not found');",
      "const cert1 = certifyMilestone9Sla({ failoverMs: 180, splitBrainCount: 0, staleWritesBlocked: 2, leasesProcessed: 120 });",
      "if (cert1.certified !== true || cert1.grade !== 'A+') throw new Error('Failed cert1 Grade A+: ' + JSON.stringify(cert1));",
      "const cert2 = certifyMilestone9Sla({ failoverMs: 350, splitBrainCount: 0, staleWritesBlocked: 2, leasesProcessed: 120 });",
      "if (cert2.certified !== false || cert2.grade !== 'FAIL') throw new Error('Failed cert2 failover limit: ' + JSON.stringify(cert2));"
    )
  }
"""

updated_configs = before_configs + ",\n" + block10_code_configs + after_configs

with open('src/lib/data/nodeWeb30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(updated_configs)
print("Updated nodeWeb30DayData.ts with Days 46-50 successfully!")
