# scripts/append_block10_curriculum.py
import json, os

# 1. Append Days 46 to 50 to reactLongLessons.ts
LONG_LESSONS_PATH = 'src/lib/data/reactLongLessons.ts'

with open(LONG_LESSONS_PATH, 'r', encoding='utf-8') as f:
    long_content = f.read()

# Verify where REACT_LONG_LESSONS ends
last_bracket_idx = long_content.rfind('];')
if last_bracket_idx == -1:
    raise Exception("Could not find closing '];' in reactLongLessons.ts")

# Collect Days 46 to 50 objects
days_to_append = []
for d in range(46, 51):
    with open(f'scripts/react_day{d}.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    # Ensure projectStep does not have desc
    if 'desc' in data.get('projectStep', {}):
        del data['projectStep']['desc']
    days_to_append.append(data)

# Format JSON serialization for TypeScript
appended_lessons_ts = []
for d in days_to_append:
    lesson_json = json.dumps(d, indent=2)
    appended_lessons_ts.append(f"  // ── Day {d['day']} ────────────────────────────────────────────────────────────\n" + lesson_json)

joined_lessons = ",\n" + ",\n".join(appended_lessons_ts) + "\n"

new_long_content = long_content[:last_bracket_idx].rstrip() + joined_lessons + "];\n"

with open(LONG_LESSONS_PATH, 'w', encoding='utf-8') as f:
    f.write(new_long_content)

print("Successfully appended Days 46 to 50 to reactLongLessons.ts!")

# 2. Append Days 46 to 50 to react30DayData.ts
CONFIGS_PATH = 'src/lib/data/react30DayData.ts'

with open(CONFIGS_PATH, 'r', encoding='utf-8') as f:
    config_content = f.read()

# Find the closing '];' of REACT_30_DAYS_CONFIGS
last_configs_idx = config_content.rfind('];')
if last_configs_idx == -1:
    raise Exception("Could not find closing '];' in react30DayData.ts")

day46_50_configs_ts = """  {
    title: "Concurrent External Stores: useSyncExternalStore, Resilient Subscriptions & Zero State Tearing",
    desc: "Master concurrent state synchronization in React 18: eliminate state tearing with useSyncExternalStore, configure resilient subscribe and getSnapshot hooks, enforce referential stability with memoized selectors, and recover cleanly in SyncLane.",
    syllabus: [
      "State tearing mechanics under concurrent time-slicing.",
      "useSyncExternalStore subscribe and getSnapshot contracts.",
      "Memoized selectors and referential stability.",
      "Pre-commit validation and SyncLane recovery."
    ],
    eTitle: "Pre-Commit Snapshot Guard",
    eDesc: "Write `isSnapshotTorn(startSnapshot, commitSnapshot)` returning `startSnapshot !== commitSnapshot`.",
    eStarter: lines("function isSnapshotTorn(startSnapshot, commitSnapshot) {", "  // Return boolean tearing status", "  return false;", "}"),
    eHint: "return startSnapshot !== commitSnapshot;",
    eTest: lines(
      "if (typeof isSnapshotTorn !== 'function') throw new Error('isSnapshotTorn not found');",
      "if (isSnapshotTorn('150', '155') !== true) throw new Error('Torn snapshot check failed');",
      "if (isSnapshotTorn('150', '150') !== false) throw new Error('Clean snapshot check failed');"
    ),
    aTitle: "Selector Memoization Cache",
    aDesc: "Write `memoizeSliceSelector(prevSlice, nextSlice)` returning `prevSlice && prevSlice.val === nextSlice.val ? prevSlice : nextSlice`.",
    aStarter: lines("function memoizeSliceSelector(prevSlice, nextSlice) {", "  // Return stable slice reference", "  return {};", "}"),
    aHint: "return prevSlice && prevSlice.val === nextSlice.val ? prevSlice : nextSlice;",
    aTest: lines(
      "if (typeof memoizeSliceSelector !== 'function') throw new Error('memoizeSliceSelector not found');",
      "const s1 = { val: 42 };",
      "const s2 = { val: 42 };",
      "if (memoizeSliceSelector(s1, s2) !== s1) throw new Error('Stable reference check failed');",
      "const s3 = { val: 99 };",
      "if (memoizeSliceSelector(s1, s3) !== s3) throw new Error('Mutated reference check failed');"
    )
  },
  {
    title: "Hierarchical Statecharts & Actor Model: XState Architecture, Impossible States & Distributed UI Logic",
    desc: "Abolish impossible UI states with mathematical statecharts: model deterministic finite state automata with transition guards, construct hierarchical composite states, orchestrate concurrent subsystems with the Actor Model, and implement fault-tolerant supervision trees.",
    syllabus: [
      "Boolean flag combinatorial explosion vs statecharts.",
      "Finite State Automata transition tables and guards.",
      "Hierarchical nested statecharts and preemption.",
      "Actor Model mailboxes and fault-tolerant supervision."
    ],
    eTitle: "Transition Guard Validator",
    eDesc: "Write `canTransition(currentState, event, guardPassed)` returning `currentState === 'IDLE' && event === 'SUBMIT' && guardPassed === true`.",
    eStarter: lines("function canTransition(currentState, event, guardPassed) {", "  // Return boolean transition permission", "  return false;", "}"),
    eHint: "return currentState === 'IDLE' && event === 'SUBMIT' && guardPassed === true;",
    eTest: lines(
      "if (typeof canTransition !== 'function') throw new Error('canTransition not found');",
      "if (canTransition('IDLE', 'SUBMIT', true) !== true) throw new Error('Valid transition check failed');",
      "if (canTransition('IDLE', 'SUBMIT', false) !== false) throw new Error('Blocked guard check failed');",
      "if (canTransition('LOADING', 'SUBMIT', true) !== false) throw new Error('Invalid state check failed');"
    ),
    aTitle: "Actor Message Mailbox",
    aDesc: "Write `enqueueActorMessage(mailbox, msg)` returning `[...mailbox, { ...msg, timestamp: 1700000000000 }]`.",
    aStarter: lines("function enqueueActorMessage(mailbox, msg) {", "  // Return updated mailbox array", "  return [];", "}"),
    aHint: "return [...mailbox, { ...msg, timestamp: 1700000000000 }];",
    aTest: lines(
      "if (typeof enqueueActorMessage !== 'function') throw new Error('enqueueActorMessage not found');",
      "const res = enqueueActorMessage([{ type: 'PING' }], { type: 'TICK' });",
      "if (res.length !== 2 || res[1].type !== 'TICK' || res[1].timestamp !== 1700000000000) throw new Error('Mailbox enqueue check failed');"
    )
  },
  {
    title: "Micro-Frontends with Module Federation: Webpack 5, Dynamic Remotes, Shared Scope & Event Bus Bridges",
    desc: "Scale enterprise frontend architectures with Module Federation: decouple monolithic codebases into autonomous micro-frontends, configure host containers and dynamic remotes, negotiate shared React singletons, implement resilient error sandboxing, and coordinate cross-remote events.",
    syllabus: [
      "Monolith organizational bottlenecks vs Micro-Frontends.",
      "Webpack Module Federation runtime container architecture.",
      "Shared scope negotiation and React singleton safety.",
      "Cross-remote decoupled event bus bridges."
    ],
    eTitle: "SemVer Singleton Negotiator",
    eDesc: "Write `resolveSharedSingleton(v1, v2)` returning `v1 >= v2 ? v1 : v2`.",
    eStarter: lines("function resolveSharedSingleton(v1, v2) {", "  // Return highest compatible version", "  return '';", "}"),
    eHint: "return v1 >= v2 ? v1 : v2;",
    eTest: lines(
      "if (typeof resolveSharedSingleton !== 'function') throw new Error('resolveSharedSingleton not found');",
      "if (resolveSharedSingleton('18.3.1', '18.2.0') !== '18.3.1') throw new Error('Highest version check failed');",
      "if (resolveSharedSingleton('18.1.0', '18.2.0') !== '18.2.0') throw new Error('Ascending version check failed');"
    ),
    aTitle: "Remote Timeout Guard",
    aDesc: "Write `shouldAbortRemoteLoad(latencyMs, maxTimeoutMs)` returning `latencyMs > maxTimeoutMs`.",
    aStarter: lines("function shouldAbortRemoteLoad(latencyMs, maxTimeoutMs) {", "  // Return boolean abort decision", "  return false;", "}"),
    aHint: "return latencyMs > maxTimeoutMs;",
    aTest: lines(
      "if (typeof shouldAbortRemoteLoad !== 'function') throw new Error('shouldAbortRemoteLoad not found');",
      "if (shouldAbortRemoteLoad(3500, 3000) !== true) throw new Error('Timeout check failed');",
      "if (shouldAbortRemoteLoad(1200, 3000) !== false) throw new Error('Within-budget check failed');"
    )
  },
  {
    title: "Custom React Reconcilers: HostConfig Architecture, Fiber WorkLoop & Terminal/Canvas Rendering",
    desc: "Unshackle React from the browser DOM: implement the complete react-reconciler HostConfig mutative contract, traverse Fiber reconciliation work loops, construct headless in-memory Virtual Node Graphs, and render React component trees to ANSI terminal CLI screens with 60 FPS performance.",
    syllabus: [
      "React architecture decoupling: Core, Reconciler & Renderer.",
      "HostConfig mutative lifecycle methods.",
      "In-memory Virtual Node Graph and layout engine.",
      "Decoupled headless testing and cross-platform targets."
    ],
    eTitle: "Fiber Prop Diff Engine",
    eDesc: "Write `computePropDiff(oldProps, newProps)` returning `oldProps.text !== newProps.text ? { text: newProps.text } : null`.",
    eStarter: lines("function computePropDiff(oldProps, newProps) {", "  // Return prop diff payload", "  return null;", "}"),
    eHint: "return oldProps.text !== newProps.text ? { text: newProps.text } : null;",
    eTest: lines(
      "if (typeof computePropDiff !== 'function') throw new Error('computePropDiff not found');",
      "const diff = computePropDiff({ text: 'A' }, { text: 'B' });",
      "if (!diff || diff.text !== 'B') throw new Error('Prop diff check failed');",
      "if (computePropDiff({ text: 'A' }, { text: 'A' }) !== null) throw new Error('Unchanged diff check failed');"
    ),
    aTitle: "Virtual Node Allocator",
    aDesc: "Write `createVirtualNode(type, props)` returning `{ type, props: { ...props }, children: [] }`.",
    aStarter: lines("function createVirtualNode(type, props) {", "  // Return virtual node object", "  return {};", "}"),
    aHint: "return { type, props: { ...props }, children: [] };",
    aTest: lines(
      "if (typeof createVirtualNode !== 'function') throw new Error('createVirtualNode not found');",
      "const node = createVirtualNode('box', { color: 'cyan' });",
      "if (node.type !== 'box' || node.props.color !== 'cyan' || !Array.isArray(node.children)) throw new Error('Virtual node allocation check failed');"
    )
  },
  {
    title: "Milestone 9: Micro-Frontend Real-Time Trading Desk with useSyncExternalStore & Federated Modules",
    desc: "Architect an enterprise-grade Micro-Frontend Real-Time Financial Trading Desk. Synthesize concurrent external stores (useSyncExternalStore), deterministic statecharts, federated micro-app modules, and custom headless rendering into an ultra-low-latency, tear-free, multi-tenant financial analytics dashboard.",
    syllabus: [
      "Trading desk topology and micro-frontend boundaries.",
      "Low-latency market feed store with useSyncExternalStore.",
      "Order execution statecharts with pre-trade risk guards.",
      "Federated remote orchestration and production audit."
    ],
    eTitle: "Trading Desk Topology Auditor",
    eDesc: "Write `isTradingDeskTopologyValid(remotesCount, instrumentsCount, hasSharedSingleton)` returning `remotesCount >= 3 && instrumentsCount >= 5 && hasSharedSingleton === true`.",
    eStarter: lines("function isTradingDeskTopologyValid(remotesCount, instrumentsCount, hasSharedSingleton) {", "  // Return boolean validation result", "  return false;", "}"),
    eHint: "return remotesCount >= 3 && instrumentsCount >= 5 && hasSharedSingleton === true;",
    eTest: lines(
      "if (typeof isTradingDeskTopologyValid !== 'function') throw new Error('isTradingDeskTopologyValid not found');",
      "if (isTradingDeskTopologyValid(3, 5, true) !== true) throw new Error('Valid topology check failed');",
      "if (isTradingDeskTopologyValid(2, 5, true) !== false) throw new Error('Insufficient remotes check failed');"
    ),
    aTitle: "Milestone 9 Production Auditor",
    aDesc: "Write `auditMilestone9Compliance(tornFrames, renderLatencyMs, duplicateOrdersBlocked)` returning `{ isCompliant: tornFrames === 0 && renderLatencyMs <= 5 && duplicateOrdersBlocked, grade: (tornFrames === 0 && renderLatencyMs <= 5 && duplicateOrdersBlocked) ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' }`.",
    aStarter: lines("function auditMilestone9Compliance(tornFrames, renderLatencyMs, duplicateOrdersBlocked) {", "  // Return production audit report", "  return {};", "}"),
    aHint: "const ok = tornFrames === 0 && renderLatencyMs <= 5 && duplicateOrdersBlocked; return { isCompliant: ok, grade: ok ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' };",
    aTest: lines(
      "if (typeof auditMilestone9Compliance !== 'function') throw new Error('auditMilestone9Compliance not found');",
      "const rep = auditMilestone9Compliance(0, 3.2, true);",
      "if (rep.isCompliant !== true || rep.grade !== 'GRADE A+ PRODUCTION READY') throw new Error('Compliant desk check failed');",
      "const rep2 = auditMilestone9Compliance(2, 3.2, true);",
      "if (rep2.isCompliant !== false || rep2.grade !== 'NON-COMPLIANT') throw new Error('Torn desk check failed');"
    )
  }
"""

new_config_content = config_content[:last_configs_idx].rstrip() + ",\n" + day46_50_configs_ts + "\n];\n" + config_content[last_configs_idx+2:]

with open(CONFIGS_PATH, 'w', encoding='utf-8') as f:
    f.write(new_config_content)

print("Successfully appended Days 46 to 50 to react30DayData.ts!")
