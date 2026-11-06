import os
import sys
import json

sys.path.insert(0, os.path.abspath('scripts'))

with open('scripts/block9_all_days.json', 'r', encoding='utf-8') as f:
    days = json.load(f)

def format_long_lesson_ts(lesson):
    lines = []
    lines.append("  {")
    lines.append(f"    day: {lesson['day']},")
    lines.append(f"    title: {json.dumps(lesson['title'])},")
    lines.append(f"    goal: {json.dumps(lesson.get('desc', ''))},")
    lines.append(f"    minutes: {lesson.get('minutes', 38)},")
    recap = lesson.get('recap', 'In our previous sessions, we mastered concurrent mode fundamentals, time slicing, and the Fiber reconciler. Now we explore React Server Components, streaming SSR, and selective hydration.')
    lines.append(f"    recap: {json.dumps(recap)},")
    lines.append("    parts: [")
    for part_idx, part in enumerate(lesson['parts']):
        comma_part = "," if part_idx < len(lesson['parts']) - 1 else ""
        lines.append("      {")
        lines.append(f"        title: {json.dumps(part['title'])},")
        lines.append("        say: [")
        for s_idx, s in enumerate(part['say']):
            comma_s = "," if s_idx < len(part['say']) - 1 else ""
            lines.append(f"          {json.dumps(s)}{comma_s}")
        lines.append("        ],")
        if 'code' in part and part['code']:
            lines.append(f"        code: {json.dumps(part['code'])},")
        if 'output' in part and part['output']:
            lines.append(f"        output: {json.dumps(part['output'])},")
        if 'codeNotes' in part and part['codeNotes']:
            lines.append("        codeNotes: [")
            for cn_idx, cn in enumerate(part['codeNotes']):
                comma_cn = "," if cn_idx < len(part['codeNotes']) - 1 else ""
                lines.append(f"          {{ line: {cn['line']}, note: {json.dumps(cn['note'])} }}{comma_cn}")
            lines.append("        ],")
        if 'tryIt' in part and part['tryIt']:
            lines.append(f"        tryIt: {json.dumps(part['tryIt'])},")
        if 'check' in part and part['check']:
            lines.append(f"        check: {json.dumps(part['check'])}")
        lines.append(f"      }}{comma_part}")
    lines.append("    ],")
    lines.append("    summary: [")
    for sum_idx, sm in enumerate(lesson.get('summary', [])):
        comma_sm = "," if sum_idx < len(lesson.get('summary', [])) - 1 else ""
        lines.append(f"      {json.dumps(sm)}{comma_sm}")
    lines.append("    ],")
    lines.append("    projectStep: {")
    lines.append(f"      title: {json.dumps(lesson.get('title', ''))},")
    lines.append(f"      desc: {json.dumps(lesson.get('projectStep', ''))},")
    lines.append("      checklist: [")
    sample_checks = [
        "Audit server-client boundaries and confirm props are strictly JSON-serializable.",
        "Verify zero-bundle dependency offloading with 0 KB parser code in client bundle.",
        "Implement early shell flushing and out-of-order Suspense template replacements.",
        "Configure capture-phase event interception and priority promotion for unhydrated islands.",
        "Implement progressive enhancement form actions with optimistic UI projections."
    ]
    for ck_idx, ck in enumerate(sample_checks):
        comma_ck = "," if ck_idx < len(sample_checks) - 1 else ""
        lines.append(f"        {json.dumps(ck)}{comma_ck}")
    lines.append("      ]")
    lines.append("    }")
    lines.append("  }")
    return "\n".join(lines)

# 1. Update src/lib/data/reactLongLessons.ts
LONG_LESSONS_FILE = 'src/lib/data/reactLongLessons.ts'
with open(LONG_LESSONS_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

if "day: 41," in content:
    print("Day 41 already in reactLongLessons.ts, skipping append.")
else:
    # Find last occurrence of "];"
    idx = content.rfind("\n];")
    if idx == -1:
        idx = content.rfind("];")
    if idx == -1:
        raise Exception("Could not find closing bracket in reactLongLessons.ts")
    
    formatted_days = []
    for d in days:
        formatted_days.append(format_long_lesson_ts(d))
    
    appended_ts = ",\n" + ",\n".join(formatted_days)
    new_content = content[:idx] + appended_ts + content[idx:]
    with open(LONG_LESSONS_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Appended Days 41-45 to src/lib/data/reactLongLessons.ts successfully!")

# 2. Update src/lib/data/react30DayData.ts
DAY_CONFIGS_FILE = 'src/lib/data/react30DayData.ts'
with open(DAY_CONFIGS_FILE, 'r', encoding='utf-8') as f:
    day_content = f.read()

day_configs_ts = """  {
    title: "React Server Components (RSC): The Server-Client Boundary, Zero-Bundle-Size Dependencies & RSC Wire Format",
    desc: "Master the architecture of React Server Components: understand the server-client boundary, how the \\"use client\\" directive marks module boundaries, offloading massive dependencies for zero-bundle client weight, line-by-line RSC wire stream format decoding, and complete runtime simulation.",
    syllabus: [
      "The Server-Client dichotomy and zero client bundle size.",
      "The 'use client' boundary and JSON serialization rules.",
      "Offloading heavy AST dependencies to server Node.js.",
      "Line-by-line RSC wire stream decoding and client VDOM."
    ],
    eTitle: "RSC Boundary Prop Validator",
    eDesc: "Write `isSerializableRSCProp(value)` returning true if value is a string, number, boolean, null, or undefined, or false if value is a function or symbol.",
    eStarter: lines("function isSerializableRSCProp(value) {", "  // Return boolean serialization safety", "  return false;", "}"),
    eHint: "const t = typeof value; return t === 'string' || t === 'number' || t === 'boolean' || value === null || value === undefined;",
    eTest: lines(
      "if (typeof isSerializableRSCProp !== 'function') throw new Error('isSerializableRSCProp not found');",
      "if (isSerializableRSCProp('hello') !== true) throw new Error('String check failed');",
      "if (isSerializableRSCProp(42) !== true) throw new Error('Number check failed');",
      "if (isSerializableRSCProp(() => {}) !== false) throw new Error('Function check failed');",
      "if (isSerializableRSCProp(Symbol('react')) !== false) throw new Error('Symbol check failed');"
    ),
    aTitle: "RSC Client Bundle Reducer",
    aDesc: "Write `calculateBundleSavings(traditionalKb, serverOnlyKb)` returning `{ savedKb: serverOnlyKb, percentage: +((serverOnlyKb / traditionalKb) * 100).toFixed(1) }`.",
    aStarter: lines("function calculateBundleSavings(traditionalKb, serverOnlyKb) {", "  // Return savings object", "  return {};", "}"),
    aHint: "const pct = +((serverOnlyKb / traditionalKb) * 100).toFixed(1); return { savedKb: serverOnlyKb, percentage: pct };",
    aTest: lines(
      "if (typeof calculateBundleSavings !== 'function') throw new Error('calculateBundleSavings not found');",
      "const res = calculateBundleSavings(1000, 700);",
      "if (res.savedKb !== 700 || res.percentage !== 70.0) throw new Error('Bundle savings calculation failed');"
    )
  },
  {
    title: "Streaming SSR with Suspense: HTML Streaming, Early Flushes & Out-of-Order Chunk Insertion",
    desc: "Master asynchronous streaming server-side rendering with Suspense: eliminate TTFB bottlenecks, flush document heads early, orchestrate out-of-order chunk streaming via template replacements ($RC), manage mid-stream error recovery, and implement a full streaming SSR pipeline.",
    syllabus: [
      "TTFB waterfall elimination and early head flushes.",
      "Chunked transfer encoding and HTTP/2 stream multiplexing.",
      "Out-of-order Suspense replacement scripts ($RC).",
      "Streaming error boundary fallbacks and header commitment."
    ],
    eTitle: "Suspense Template Placeholder Builder",
    eDesc: "Write `buildSuspenseSlot(id, fallbackText)` returning `<!--$?--><template id=\\\"B:' + id + '\\\"></template><div class=\\\"fallback\\\">' + fallbackText + '</div><!--/$-->`.",
    eStarter: lines("function buildSuspenseSlot(id, fallbackText) {", "  // Return Suspense placeholder HTML", "  return '';", "}"),
    eHint: "return '<!--$?--><template id=\\\"B:' + id + '\\\"></template><div class=\\\"fallback\\\">' + fallbackText + '</div><!--/$-->';",
    eTest: lines(
      "if (typeof buildSuspenseSlot !== 'function') throw new Error('buildSuspenseSlot not found');",
      "const slot = buildSuspenseSlot(0, 'Loading...');",
      "if (!slot.includes('id=\"B:0\"') || !slot.includes('Loading...')) throw new Error('Slot placeholder check failed');"
    ),
    aTitle: "Out-of-Order Replacement Script Generator",
    aDesc: "Write `generateRcScript(boundaryId, contentId)` returning `<script>$RC(\\\"B:' + boundaryId + '\\\",\\\"S:' + contentId + '\\\")</script>`.",
    aStarter: lines("function generateRcScript(boundaryId, contentId) {", "  // Return $RC replacement script tag", "  return '';", "}"),
    aHint: "return '<script>$RC(\\\"B:' + boundaryId + '\\\",\\\"S:' + contentId + '\\\")</script>';",
    aTest: lines(
      "if (typeof generateRcScript !== 'function') throw new Error('generateRcScript not found');",
      "const s = generateRcScript(0, 0);",
      "if (s !== '<script>$RC(\"B:0\",\"S:0\")</script>') throw new Error('$RC script check failed');"
    )
  },
  {
    title: "Selective Hydration & Progressive Interactivity: Prioritizing Interactive Islands on User Click",
    desc: "Master selective hydration and progressive interactivity: eliminate the hydration uncanny valley, segment trees via React 18 hydrateRoot and Suspense, intercept clicks on unhydrated islands for priority promotion and interaction replay, and schedule hydration via 31-bit lanes.",
    syllabus: [
      "Hydration uncanny valley and main-thread freezing.",
      "hydrateRoot and Suspense subtree segmentation.",
      "Capture-phase event interception and interaction replay.",
      "Viewport-driven lane scheduling with IntersectionObserver."
    ],
    eTitle: "Total Blocking Time Calculator",
    eDesc: "Write `calculateTbt(taskDurationMs)` returning `taskDurationMs > 50 ? taskDurationMs - 50 : 0`.",
    eStarter: lines("function calculateTbt(taskDurationMs) {", "  // Return TBT penalty", "  return 0;", "}"),
    eHint: "return taskDurationMs > 50 ? taskDurationMs - 50 : 0;",
    eTest: lines(
      "if (typeof calculateTbt !== 'function') throw new Error('calculateTbt not found');",
      "if (calculateTbt(120) !== 70) throw new Error('120ms TBT check failed');",
      "if (calculateTbt(30) !== 0) throw new Error('30ms TBT check failed');"
    ),
    aTitle: "Hydration Priority Promoter",
    aDesc: "Write `promoteIslandPriority(island, isClicked)` returning `{ ...island, priority: isClicked ? 'URGENT_SYNC_LANE' : island.priority }`.",
    aStarter: lines("function promoteIslandPriority(island, isClicked) {", "  // Return promoted island object", "  return {};", "}"),
    aHint: "return { ...island, priority: isClicked ? 'URGENT_SYNC_LANE' : island.priority };",
    aTest: lines(
      "if (typeof promoteIslandPriority !== 'function') throw new Error('promoteIslandPriority not found');",
      "const res = promoteIslandPriority({ id: 'btn', priority: 'IDLE' }, true);",
      "if (res.priority !== 'URGENT_SYNC_LANE') throw new Error('Promotion check failed');"
    )
  },
  {
    title: "Server Actions & Mutative Transitions: Form Actions, useActionState, Optimistic Updates & Revalidation",
    desc: "Master declarative mutations with React Server Actions: eliminate REST boilerplate, implement progressive enhancement for zero-JS form fallbacks, orchestrate state with useActionState and useFormStatus, project instant UI changes with useOptimistic, and handle cache revalidations.",
    syllabus: [
      "Declarative 'use server' actions vs imperative REST.",
      "Progressive enhancement and native HTML form POSTs.",
      "useActionState reactive lifecycle and useFormStatus.",
      "useOptimistic UI projection and automatic rollbacks."
    ],
    eTitle: "Optimistic State Projector",
    eDesc: "Write `applyOptimisticDelta(currentCount, delta)` returning `Math.max(0, currentCount + delta)`.",
    eStarter: lines("function applyOptimisticDelta(currentCount, delta) {", "  // Return optimistic count", "  return 0;", "}"),
    eHint: "return Math.max(0, currentCount + delta);",
    eTest: lines(
      "if (typeof applyOptimisticDelta !== 'function') throw new Error('applyOptimisticDelta not found');",
      "if (applyOptimisticDelta(5, 2) !== 7) throw new Error('Positive delta check failed');",
      "if (applyOptimisticDelta(2, -5) !== 0) throw new Error('Floor 0 check failed');"
    ),
    aTitle: "Server Action Rollback Guard",
    aDesc: "Write `auditActionRollback(serverSuccess, optimisticVal, serverAuthoritativeVal)` returning `serverSuccess ? optimisticVal : serverAuthoritativeVal`.",
    aStarter: lines("function auditActionRollback(serverSuccess, optimisticVal, serverAuthoritativeVal) {", "  // Return resolved authoritative state", "  return 0;", "}"),
    aHint: "return serverSuccess ? optimisticVal : serverAuthoritativeVal;",
    aTest: lines(
      "if (typeof auditActionRollback !== 'function') throw new Error('auditActionRollback not found');",
      "if (auditActionRollback(true, 10, 5) !== 10) throw new Error('Success branch check failed');",
      "if (auditActionRollback(false, 10, 5) !== 5) throw new Error('Rollback branch check failed');"
    )
  },
  {
    title: "Milestone 8: Production Hybrid RSC E-Commerce Catalog with Streaming SSR, Selective Hydration & Server Actions",
    desc: "Architect an enterprise-grade production hybrid e-commerce catalog: synthesize React Server Components for zero-bundle specs, stream HTML shells with Suspense placeholders, hydrate interactive cart islands selectively with event replay, and process checkout mutations via Server Actions with optimistic rollbacks.",
    syllabus: [
      "Hybrid RSC enterprise topology and client island boundaries.",
      "Server component catalog engine and zero-bundle specs.",
      "Streaming out-of-order reviews and selective cart hydration.",
      "Server Action checkout mutations with optimistic rollbacks."
    ],
    eTitle: "Enterprise Topology Auditor",
    eDesc: "Write `isHybridTopologyValid(serverRootsCount, clientIslandsCount, streamingBoundariesCount)` returning `serverRootsCount >= 2 && clientIslandsCount >= 2 && streamingBoundariesCount >= 1`.",
    eStarter: lines("function isHybridTopologyValid(serverRootsCount, clientIslandsCount, streamingBoundariesCount) {", "  // Return boolean compliance decision", "  return false;", "}"),
    eHint: "return serverRootsCount >= 2 && clientIslandsCount >= 2 && streamingBoundariesCount >= 1;",
    eTest: lines(
      "if (typeof isHybridTopologyValid !== 'function') throw new Error('isHybridTopologyValid not found');",
      "if (isHybridTopologyValid(2, 2, 1) !== true) throw new Error('Valid topology check failed');",
      "if (isHybridTopologyValid(1, 2, 1) !== false) throw new Error('Invalid topology check failed');"
    ),
    aTitle: "Milestone 8 Performance Auditor",
    aDesc: "Write `auditMilestone8Compliance(tbtMs, ttfbMs, clientBundleLeakedKb)` returning `{ isCompliant: tbtMs === 0 && ttfbMs <= 50 && clientBundleLeakedKb === 0, grade: (tbtMs === 0 && ttfbMs <= 50 && clientBundleLeakedKb === 0) ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' }`.",
    aStarter: lines("function auditMilestone8Compliance(tbtMs, ttfbMs, clientBundleLeakedKb) {", "  // Return audit report", "  return {};", "}"),
    aHint: "const ok = tbtMs === 0 && ttfbMs <= 50 && clientBundleLeakedKb === 0; return { isCompliant: ok, grade: ok ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' };",
    aTest: lines(
      "if (typeof auditMilestone8Compliance !== 'function') throw new Error('auditMilestone8Compliance not found');",
      "const r = auditMilestone8Compliance(0, 38, 0);",
      "if (r.isCompliant !== true || r.grade !== 'GRADE A+ PRODUCTION READY') throw new Error('Compliant audit check failed');",
      "const r2 = auditMilestone8Compliance(50, 38, 0);",
      "if (r2.isCompliant !== false || r2.grade !== 'NON-COMPLIANT') throw new Error('Non-compliant audit check failed');"
    )
  }
"""

if "Milestone 8: Production Hybrid RSC E-Commerce Catalog" in day_content:
    print("Block 9 configs already in react30DayData.ts, skipping append.")
else:
    # Find last occurrence of "];\n\nexport const REACT_30_DAYS_QUESTS"
    target = "\n];\n\nexport const REACT_30_DAYS_QUESTS"
    idx = day_content.rfind(target)
    if idx == -1:
        target = "];\n\nexport const REACT_30_DAYS_QUESTS"
        idx = day_content.rfind(target)
    if idx == -1:
        raise Exception("Could not find REACT_30_DAYS_CONFIGS closing in react30DayData.ts")
    
    new_day_content = day_content[:idx] + ",\n" + day_configs_ts + day_content[idx:]
    with open(DAY_CONFIGS_FILE, 'w', encoding='utf-8') as f:
        f.write(new_day_content)
    print("Appended Days 41-45 configs to src/lib/data/react30DayData.ts successfully!")
