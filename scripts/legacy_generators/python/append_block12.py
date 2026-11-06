import json, sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Append to reactLongLessons.ts
print("Reading reactLongLessons.ts...")
with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    rll_text = f.read()

# Load Days 56 to 60 JSON
new_lessons = []
for d in range(56, 61):
    with open(f'scripts/react_day{d}.json', 'r', encoding='utf-8') as f:
        lesson = json.load(f)
        # Ensure projectStep has NO 'desc'
        if 'desc' in lesson.get('projectStep', {}):
            del lesson['projectStep']['desc']
        new_lessons.append(lesson)

# The end of reactLongLessons.ts is `\n];\n`
target_end = "];"
last_bracket_idx = rll_text.rfind(target_end)
if last_bracket_idx == -1:
    raise Exception("Could not find closing bracket in reactLongLessons.ts")

# Convert new lessons to formatted JSON string
new_lessons_json = []
for l in new_lessons:
    new_lessons_json.append(json.dumps(l, indent=2))

# Join with comma
insertion_text = ",\n" + ",\n".join(new_lessons_json) + "\n"

updated_rll_text = rll_text[:last_bracket_idx] + insertion_text + rll_text[last_bracket_idx:]

with open('src/lib/data/reactLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(updated_rll_text)

print(f"Appended Days 56-60 to reactLongLessons.ts successfully!")

# 2. Append to react30DayData.ts
print("Reading react30DayData.ts...")
with open('src/lib/data/react30DayData.ts', 'r', encoding='utf-8') as f:
    r30_text = f.read()

day_configs_ts = """
  // ── WEEK 12 (Days 56–60): Industrial Architecture Case Studies, RFC & Capstone ───────
  {
    title: "Industrial Architecture Case Study 1: Large-Scale High-Frequency Trading Desk & Financial Telemetry",
    desc: "Architect high-frequency financial trading systems in React: stream 100k market events/sec over WebSockets into zero-GC circular buffers, synchronize 120 FPS order books with useSyncExternalStore, accelerate depth charts with off-screen canvas rendering, and isolate federated micro-frontend modules.",
    syllabus: [
      "High-throughput binary WebSocket stream ingestion into Web Workers.",
      "Zero-allocation circular ring buffers for high-frequency market depth.",
      "Atomic frame throttling with useSyncExternalStore at 120 FPS.",
      "Hardware-accelerated off-screen canvas depth chart rendering."
    ],
    eTitle: "Circular Ring Buffer Slot Indexer",
    eDesc: "Write `getRingBufferIndex(cursor, capacity)` returning `cursor % capacity` to map unbounded sequence IDs to fixed array slots.",
    eStarter: lines("function getRingBufferIndex(cursor, capacity) {", "  // Return mapped array index", "  return 0;", "}"),
    eHint: "return cursor % capacity;",
    eTest: lines(
      "if (typeof getRingBufferIndex !== 'function') throw new Error('getRingBufferIndex not found');",
      "if (getRingBufferIndex(0, 1024) !== 0) throw new Error('Zero cursor failed');",
      "if (getRingBufferIndex(1024, 1024) !== 0) throw new Error('Wrap around index failed');",
      "if (getRingBufferIndex(1025, 1024) !== 1) throw new Error('Next slot index failed');"
    ),
    aTitle: "Order Book Spread Calculator",
    aDesc: "Write `calculateOrderBookSpread(bestBid, bestAsk)` returning `{ spread: Number((bestAsk - bestBid).toFixed(4)), isCrossed: bestBid >= bestAsk }`.",
    aStarter: lines("function calculateOrderBookSpread(bestBid, bestAsk) {", "  // Return spread metrics", "  return {};", "}"),
    aHint: "return { spread: Number((bestAsk - bestBid).toFixed(4)), isCrossed: bestBid >= bestAsk };",
    aTest: lines(
      "if (typeof calculateOrderBookSpread !== 'function') throw new Error('calculateOrderBookSpread not found');",
      "const r1 = calculateOrderBookSpread(100.50, 100.55);",
      "if (r1.spread !== 0.05 || r1.isCrossed !== false) throw new Error('Normal spread calculation failed');",
      "const r2 = calculateOrderBookSpread(101.00, 100.80);",
      "if (r2.isCrossed !== true) throw new Error('Crossed order book detection failed');"
    )
  },
  {
    title: "Industrial Architecture Case Study 2: Global E-Commerce Streaming Architecture & PPR",
    desc: "Build enterprise edge-native e-commerce platforms: terminate requests at edge anycast nodes with token bucket rate limiting, stream static catalog shells with Partial Prerendering (PPR) in sub-25ms, eliminate layout shift with skeleton bounds, and manage tag-based edge cache invalidation.",
    syllabus: [
      "Edge Anycast ingress and sliding token bucket rate limiters.",
      "Partial Prerendering (PPR) static shell and dynamic hole streaming.",
      "Zero layout shift skeleton bounding box contracts (CLS = 0.000).",
      "Tag-based edge cache revalidation and synthetic SLA benchmarking."
    ],
    eTitle: "Token Bucket Capacity Evaluator",
    eDesc: "Write `evaluateTokenBucket(currentTokens, cost, maxCapacity)` returning `{ allowed: currentTokens >= cost, newBalance: currentTokens >= cost ? currentTokens - cost : currentTokens }`.",
    eStarter: lines("function evaluateTokenBucket(currentTokens, cost, maxCapacity) {", "  // Return bucket evaluation", "  return {};", "}"),
    eHint: "const allowed = currentTokens >= cost; return { allowed, newBalance: allowed ? currentTokens - cost : currentTokens };",
    eTest: lines(
      "if (typeof evaluateTokenBucket !== 'function') throw new Error('evaluateTokenBucket not found');",
      "const b1 = evaluateTokenBucket(10, 2, 20);",
      "if (b1.allowed !== true || b1.newBalance !== 8) throw new Error('Allowed token deduction failed');",
      "const b2 = evaluateTokenBucket(1, 2, 20);",
      "if (b2.allowed !== false || b2.newBalance !== 1) throw new Error('Throttled bucket check failed');"
    ),
    aTitle: "CLS Layout Stability Auditor",
    aDesc: "Write `auditCumulativeLayoutShift(shiftEntries)` returning `{ totalCls: Number(shiftEntries.reduce((acc, s) => acc + s, 0).toFixed(4)), passesSla: shiftEntries.reduce((acc, s) => acc + s, 0) === 0 }`.",
    aStarter: lines("function auditCumulativeLayoutShift(shiftEntries) {", "  // Return CLS audit report", "  return {};", "}"),
    aHint: "const total = Number(shiftEntries.reduce((acc, s) => acc + s, 0).toFixed(4)); return { totalCls: total, passesSla: total === 0 };",
    aTest: lines(
      "if (typeof auditCumulativeLayoutShift !== 'function') throw new Error('auditCumulativeLayoutShift not found');",
      "const a1 = auditCumulativeLayoutShift([0, 0, 0]);",
      "if (a1.totalCls !== 0 || a1.passesSla !== true) throw new Error('Zero CLS audit failed');",
      "const a2 = auditCumulativeLayoutShift([0.02, 0.01]);",
      "if (a2.passesSla !== false) throw new Error('Failing CLS audit failed');"
    )
  },
  {
    title: "Industrial Architecture Case Study 3: Enterprise Collaborative Workspace & Server-Driven UI",
    desc: "Design multi-tenant collaborative workspaces: structure nested block documents into normalized RecordMaps, virtualize deep trees for 60 FPS scrolling, synchronize offline mutations with CRDTs, and execute sandboxed DAG formulas without freezing the UI.",
    syllabus: [
      "Normalized in-memory RecordMap block tree architectures.",
      "Dynamic block code-splitting with React.lazy and telemetry fallbacks.",
      "CRDT mathematical convergence and IndexedDB offline mutation queues.",
      "Topological DAG dependency formula evaluation engines."
    ],
    eTitle: "Normalized Block Finder",
    eDesc: "Write `findChildBlocks(recordMap, parentId)` returning an array of block objects corresponding to the parent block's content ID array.",
    eStarter: lines("function findChildBlocks(recordMap, parentId) {", "  // Return ordered child block objects", "  return [];", "}"),
    eHint: "const parent = recordMap[parentId]; if (!parent || !Array.isArray(parent.content)) return []; return parent.content.map(id => recordMap[id]).filter(Boolean);",
    eTest: lines(
      "if (typeof findChildBlocks !== 'function') throw new Error('findChildBlocks not found');",
      "const map = { p1: { id: 'p1', content: ['c1', 'c2'] }, c1: { id: 'c1', type: 'text' }, c2: { id: 'c2', type: 'image' } };",
      "const kids = findChildBlocks(map, 'p1');",
      "if (kids.length !== 2 || kids[0].id !== 'c1' || kids[1].type !== 'image') throw new Error('Child block resolution failed');",
      "if (findChildBlocks(map, 'nonexistent').length !== 0) throw new Error('Missing parent handling failed');"
    ),
    aTitle: "DAG Dependency Sorter",
    aDesc: "Write `isAcyclicDependency(dependencies)` checking if a direct cycle exists between keys and values.",
    aStarter: lines("function isAcyclicDependency(dependencies) {", "  // Return true if acyclic", "  return true;", "}"),
    aHint: "for (const [k, v] of Object.entries(dependencies)) { if (v && dependencies[v] === k) return false; } return true;",
    aTest: lines(
      "if (typeof isAcyclicDependency !== 'function') throw new Error('isAcyclicDependency not found');",
      "if (isAcyclicDependency({ A: 'B', B: 'A' }) !== false) throw new Error('Cycle detection failed');",
      "if (isAcyclicDependency({ A: 'B', B: 'C', C: null }) !== true) throw new Error('Acyclic graph check failed');"
    )
  },
  {
    title: "Principal Full-Stack React Architect RFC & System Design Defense",
    desc: "Operate as a Principal Full-Stack React Architect: author RFC-0104 for edge-native streaming platforms, allocate end-to-end 50ms latency budgets across multi-tier pipelines, engineer automated edge circuit breakers for multi-region failover, govern decoupled team topologies with Zod schemas, and defend multi-million-dollar financial ROI before executive boards.",
    syllabus: [
      "Enterprise Request for Comments (RFC) authoring and Change Advisory Board (CAB) ratification.",
      "End-to-end 50.0ms latency budgeting across DNS, edge middleware, and RSC streams.",
      "Edge Circuit Breaker finite state machine (CLOSED, OPEN, HALF-OPEN) and multi-region failover.",
      "Conway's Law team topologies, Zod schema governance, and multi-million-dollar financial ROI modeling."
    ],
    eTitle: "Latency Budget Auditor",
    eDesc: "Write `auditLatencyBudget(stageDurations, maxBudgetMs)` returning `{ totalDuration: stageDurations.reduce((a, b) => a + b, 0), withinBudget: stageDurations.reduce((a, b) => a + b, 0) <= maxBudgetMs }`.",
    eStarter: lines("function auditLatencyBudget(stageDurations, maxBudgetMs) {", "  // Return latency audit", "  return {};", "}"),
    eHint: "const total = Number(stageDurations.reduce((a, b) => a + b, 0).toFixed(2)); return { totalDuration: total, withinBudget: total <= maxBudgetMs };",
    eTest: lines(
      "if (typeof auditLatencyBudget !== 'function') throw new Error('auditLatencyBudget not found');",
      "const l1 = auditLatencyBudget([4.2, 1.8, 12.5, 22.0], 50.0);",
      "if (l1.withinBudget !== true || Math.abs(l1.totalDuration - 40.5) > 0.01) throw new Error('Latency budget check failed');",
      "const l2 = auditLatencyBudget([25.0, 30.0], 50.0);",
      "if (l2.withinBudget !== false) throw new Error('Exceeded latency budget check failed');"
    ),
    aTitle: "Circuit Breaker State Machine",
    aDesc: "Write `evaluateCircuitState(currentFailures, threshold)` returning `{ state: currentFailures >= threshold ? 'OPEN' : 'CLOSED', canRoutePrimary: currentFailures < threshold }`.",
    aStarter: lines("function evaluateCircuitState(currentFailures, threshold) {", "  // Return circuit breaker state", "  return {};", "}"),
    aHint: "const open = currentFailures >= threshold; return { state: open ? 'OPEN' : 'CLOSED', canRoutePrimary: !open };",
    aTest: lines(
      "if (typeof evaluateCircuitState !== 'function') throw new Error('evaluateCircuitState not found');",
      "const c1 = evaluateCircuitState(1, 3);",
      "if (c1.state !== 'CLOSED' || c1.canRoutePrimary !== true) throw new Error('Closed state check failed');",
      "const c2 = evaluateCircuitState(3, 3);",
      "if (c2.state !== 'OPEN' || c2.canRoutePrimary !== false) throw new Error('Tripped open state check failed');"
    )
  },
  {
    title: "Grand Master Capstone & Production Deployment Gate: HyperGrid Enterprise Autonomous Trading & Edge Streaming Portal",
    desc: "The crowning milestone of Full-Stack React Web Development: synthesize the entire 60-day curriculum into the HyperGrid Enterprise Autonomous Trading Portal. Execute zero-downtime blue/green canary traffic migration, enforce the 10-vector production SLA audit, survive automated chaos engineering failover drills, and achieve official Distinguished Full-Stack React Architect accreditation.",
    syllabus: [
      "HyperGrid full-system topology synthesis and subsystem operational validation.",
      "Zero-downtime blue/green traffic migration with 99.999% canary error threshold gating.",
      "10-Vector Production SLA Audit: sub-25ms shell TTFB, 0.000 CLS, 120 FPS, zero memory leaks.",
      "Automated chaos engineering failover and Distinguished Full-Stack React Architect certification."
    ],
    eTitle: "10-Vector SLA Scorecard",
    eDesc: "Write `scoreSlaVectors(resultsArray)` returning `{ score: (resultsArray.filter(Boolean).length / resultsArray.length) * 100, isCertified: resultsArray.every(Boolean) }`.",
    eStarter: lines("function scoreSlaVectors(resultsArray) {", "  // Return scorecard", "  return {};", "}"),
    eHint: "const count = resultsArray.filter(Boolean).length; return { score: (count / resultsArray.length) * 100, isCertified: count === resultsArray.length };",
    eTest: lines(
      "if (typeof scoreSlaVectors !== 'function') throw new Error('scoreSlaVectors not found');",
      "const s1 = scoreSlaVectors([true, true, true, true, true, true, true, true, true, true]);",
      "if (s1.score !== 100 || s1.isCertified !== true) throw new Error('100% score certification failed');",
      "const s2 = scoreSlaVectors([true, false, true, true, true, true, true, true, true, true]);",
      "if (s2.score !== 90 || s2.isCertified !== false) throw new Error('Partial score check failed');"
    ),
    aTitle: "Grand Master Curriculum Certifier",
    aDesc: "Write `certifyCourseCompletion(daysCompleted, milestonesDone)` returning `{ complete: daysCompleted === 60 && milestonesDone === 10, title: (daysCompleted === 60 && milestonesDone === 10) ? 'DISTINGUISHED_FULL_STACK_REACT_ARCHITECT' : 'IN_PROGRESS' }`.",
    aStarter: lines("function certifyCourseCompletion(daysCompleted, milestonesDone) {", "  // Return master certification", "  return {};", "}"),
    aHint: "const ok = daysCompleted === 60 && milestonesDone === 10; return { complete: ok, title: ok ? 'DISTINGUISHED_FULL_STACK_REACT_ARCHITECT' : 'IN_PROGRESS' };",
    aTest: lines(
      "if (typeof certifyCourseCompletion !== 'function') throw new Error('certifyCourseCompletion not found');",
      "const cert = certifyCourseCompletion(60, 10);",
      "if (cert.complete !== true || cert.title !== 'DISTINGUISHED_FULL_STACK_REACT_ARCHITECT') throw new Error('Grand master certification check failed');",
      "const inc = certifyCourseCompletion(59, 9);",
      "if (inc.complete !== false || inc.title !== 'IN_PROGRESS') throw new Error('Incomplete course check failed');"
    )
  }
"""

cfg_target = "];\n\n\nexport const REACT_30_DAYS_QUESTS"
if cfg_target not in r30_text:
    cfg_target = "];\n\nexport const REACT_30_DAYS_QUESTS"
    if cfg_target not in r30_text:
        idx_cfg = r30_text.rfind("];")
    else:
        idx_cfg = r30_text.rfind(cfg_target)
else:
    idx_cfg = r30_text.rfind(cfg_target)

updated_r30_text = r30_text[:idx_cfg] + ",\n" + day_configs_ts.strip() + "\n" + r30_text[idx_cfg:]

with open('src/lib/data/react30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(updated_r30_text)

print("Appended Days 56-60 to react30DayData.ts successfully!")
