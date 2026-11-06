import os
import sys
import json

sys.path.insert(0, os.path.abspath('scripts'))

from react_day36_data import day36
from react_day37_data import day37
from react_day38_data import day38
from react_day39_data import day39
from react_day40_data import day40

days = [day36, day37, day38, day39, day40]

def format_long_lesson_ts(lesson):
    lines = []
    lines.append("  {")
    lines.append(f"    day: {lesson['day']},")
    lines.append(f"    title: {json.dumps(lesson['title'])},")
    lines.append(f"    goal: {json.dumps(lesson.get('desc', ''))},")
    lines.append(f"    minutes: {lesson.get('minutes', 38)},")
    recap = lesson.get('recap', 'In our previous sessions, we mastered concurrent mode fundamentals and the Fiber reconciler. Now we explore the 16ms frame budget and lane priority scheduling.')
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
            chk = part['check']
            lines.append("        check: {")
            lines.append(f"          question: {json.dumps(chk['question'])},")
            lines.append(f"          options: {json.dumps(chk['options'])},")
            lines.append(f"          answer: {chk['answer']},")
            lines.append(f"          why: {json.dumps(chk.get('why', ''))}")
            lines.append("        }")
        lines.append(f"      }}{comma_part}")
    lines.append("    ],")
    lines.append("    summary: [")
    for s_idx, s in enumerate(lesson['summary']):
        comma_s = "," if s_idx < len(lesson['summary']) - 1 else ""
        lines.append(f"      {json.dumps(s)}{comma_s}")
    lines.append("    ],")
    if 'projectStep' in lesson and lesson['projectStep']:
        ps = lesson['projectStep']
        lines.append("    projectStep: {")
        lines.append(f"      title: {json.dumps(ps['title'])},")
        lines.append("      steps: [")
        for st_idx, st in enumerate(ps['steps']):
            comma_st = "," if st_idx < len(ps['steps']) - 1 else ""
            lines.append(f"        {json.dumps(st)}{comma_st}")
        lines.append("      ]")
        lines.append("    }")
    lines.append("  }")
    return "\n".join(lines)

# 1. Update reactLongLessons.ts
LONG_LESSONS_FILE = 'src/lib/data/reactLongLessons.ts'
with open(LONG_LESSONS_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

if "day: 36," in content:
    print("Day 36 already in reactLongLessons.ts, skipping append.")
else:
    idx = content.rfind("\n];")
    if idx == -1:
        raise Exception("Could not find \\n]; in reactLongLessons.ts")
    
    formatted_lessons = []
    for d in days:
        formatted_lessons.append(format_long_lesson_ts(d))
    
    insert_chunk = ",\n" + ",\n".join(formatted_lessons)
    new_content = content[:idx] + insert_chunk + content[idx:]
    with open(LONG_LESSONS_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Appended Days 36-40 to src/lib/data/reactLongLessons.ts successfully!")

# 2. Update react30DayData.ts
DAY_CONFIGS_FILE = 'src/lib/data/react30DayData.ts'
with open(DAY_CONFIGS_FILE, 'r', encoding='utf-8') as f:
    day_content = f.read()

day_configs_ts = """  // ── BLOCK 8 (MONTH 2): Frame Budget, Lane Scheduling & 10,000-Node Visual Graph Filter (Days 36–40) ──
  {
    title: "The 16ms Frame Budget: Cooperative Multitasking, MessageChannel Scheduler & Time Slicing",
    desc: "Master the 16.6ms frame budget: explore browser rendering pipelines, why setTimeout 4ms clamping causes starvation, how React's Scheduler leverages MessageChannel macro-tasks, and how cooperative time-slicing prevents UI thread jank.",
    syllabus: [
      "Browser 16.6ms frame budgets and V-Sync intervals.",
      "HTML5 4ms setTimeout clamping and MessageChannel alternatives.",
      "React Scheduler cooperative 5ms time-slicing with shouldYield()."
    ],
    eTitle: "Frame Deadline Auditor",
    eDesc: "Write `auditFrameBudget(durationMs)` returning `{ isJank: durationMs > 16.66, headroom: Math.max(0, +(16.66 - durationMs).toFixed(2)) }`.",
    eStarter: lines("function auditFrameBudget(durationMs) {", "  // Return frame budget status", "  return {};", "}"),
    eHint: "const isJank = durationMs > 16.66; const headroom = Math.max(0, +(16.66 - durationMs).toFixed(2)); return { isJank: isJank, headroom: headroom };",
    eTest: lines(
      "if (typeof auditFrameBudget !== 'function') throw new Error('auditFrameBudget not found');",
      "const a1 = auditFrameBudget(5.0);",
      "if (a1.isJank !== false || a1.headroom !== 11.66) throw new Error('5ms check failed');",
      "const a2 = auditFrameBudget(20.0);",
      "if (a2.isJank !== true || a2.headroom !== 0) throw new Error('20ms check failed');"
    ),
    aTitle: "Time Slice Yield Guard",
    aDesc: "Write `shouldYieldSlice(startTimeMs, currentTimeMs, sliceLimitMs)` returning `(currentTimeMs - startTimeMs) >= sliceLimitMs`.",
    aStarter: lines("function shouldYieldSlice(startTimeMs, currentTimeMs, sliceLimitMs) {", "  // Return boolean yield decision", "  return false;", "}"),
    aHint: "return (currentTimeMs - startTimeMs) >= sliceLimitMs;",
    aTest: lines(
      "if (typeof shouldYieldSlice !== 'function') throw new Error('shouldYieldSlice not found');",
      "if (shouldYieldSlice(100, 104, 5) !== false) throw new Error('4ms elapsed should not yield');",
      "if (shouldYieldSlice(100, 105, 5) !== true) throw new Error('5ms elapsed should yield');",
      "if (shouldYieldSlice(100, 108, 5) !== true) throw new Error('8ms elapsed should yield');"
    )
  },
  {
    title: "Lane Priority Architecture: Bitmask Priority Scheduling (Sync, Continuous, Default, Idle Lanes)",
    desc: "Master React's 31-bit Lane priority model: explore the mathematical transition from numeric priorities to bitwise bitmasks, understand least-significant bit extraction (lanes & -lanes), lane merging, and priority starvation escalation.",
    syllabus: [
      "31-bit integer bitmasks vs scalar priorities.",
      "Two's complement least-significant bit extraction (lanes & -lanes).",
      "Lane starvation detection and synchronous promotion."
    ],
    eTitle: "Highest Priority Lane Isolator",
    eDesc: "Write `isolateHighestPriorityLane(lanes)` returning `lanes & -lanes`.",
    eStarter: lines("function isolateHighestPriorityLane(lanes) {", "  // Return single highest priority bit", "  return 0;", "}"),
    eHint: "return lanes & -lanes;",
    eTest: lines(
      "if (typeof isolateHighestPriorityLane !== 'function') throw new Error('isolateHighestPriorityLane not found');",
      "if (isolateHighestPriorityLane(12) !== 4) throw new Error('12 should isolate 4');",
      "if (isolateHighestPriorityLane(5) !== 1) throw new Error('5 should isolate 1');",
      "if (isolateHighestPriorityLane(16) !== 16) throw new Error('16 should isolate 16');"
    ),
    aTitle: "Lane Membership Checker",
    aDesc: "Write `hasLane(pendingLanes, targetLane)` returning `(pendingLanes & targetLane) !== 0`.",
    aStarter: lines("function hasLane(pendingLanes, targetLane) {", "  // Test bitmask membership", "  return false;", "}"),
    aHint: "return (pendingLanes & targetLane) !== 0;",
    aTest: lines(
      "if (typeof hasLane !== 'function') throw new Error('hasLane not found');",
      "if (hasLane(0b0110, 0b0010) !== true) throw new Error('0b0010 should exist in 0b0110');",
      "if (hasLane(0b0110, 0b0001) !== false) throw new Error('0b0001 should not exist in 0b0110');",
      "if (hasLane(0b1111, 0b1000) !== true) throw new Error('0b1000 should exist in 0b1111');"
    )
  },
  {
    title: "Non-Urgent Updates with useTransition: Preventing UI Freezes on Heavy State Computations",
    desc: "Master React's useTransition hook: differentiate urgent vs transition updates, leverage isPending for seamless optimistic visual feedback, observe interruptible rendering under high-frequency typing, and implement a production-grade transition scheduler in JavaScript.",
    syllabus: [
      "Urgent SyncLane vs non-urgent TransitionLane execution.",
      "isPending synchronous toggle and visual continuity.",
      "Preempting and discarding stale in-flight transitions."
    ],
    eTitle: "Optimistic Visual Styler",
    eDesc: "Write `getOptimisticStyle(isPending)` returning `{ opacity: isPending ? 0.6 : 1.0, cursor: isPending ? 'progress' : 'default', isUpdating: isPending }`.",
    eStarter: lines("function getOptimisticStyle(isPending) {", "  // Return style object based on isPending", "  return {};", "}"),
    eHint: "return { opacity: isPending ? 0.6 : 1.0, cursor: isPending ? 'progress' : 'default', isUpdating: isPending };",
    eTest: lines(
      "if (typeof getOptimisticStyle !== 'function') throw new Error('getOptimisticStyle not found');",
      "const s1 = getOptimisticStyle(true);",
      "if (s1.opacity !== 0.6 || s1.cursor !== 'progress' || s1.isUpdating !== true) throw new Error('Pending style failed');",
      "const s2 = getOptimisticStyle(false);",
      "if (s2.opacity !== 1.0 || s2.cursor !== 'default' || s2.isUpdating !== false) throw new Error('Idle style failed');"
    ),
    aTitle: "In-Flight Preemption Guard",
    aDesc: "Write `auditPreemption(activeTask, incomingUrgentQuery)` returning `{ shouldAbort: activeTask !== null && activeTask.query !== incomingUrgentQuery, savedUnits: (activeTask !== null && activeTask.query !== incomingUrgentQuery) ? (activeTask.total - activeTask.done) : 0 }`.",
    aStarter: lines("function auditPreemption(activeTask, incomingUrgentQuery) {", "  // Determine if in-flight task must be aborted", "  return {};", "}"),
    aHint: "const shouldAbort = activeTask !== null && activeTask.query !== incomingUrgentQuery; const savedUnits = shouldAbort ? (activeTask.total - activeTask.done) : 0; return { shouldAbort: shouldAbort, savedUnits: savedUnits };",
    aTest: lines(
      "if (typeof auditPreemption !== 'function') throw new Error('auditPreemption not found');",
      "const res1 = auditPreemption({ query: 'A', total: 100, done: 30 }, 'AB');",
      "if (res1.shouldAbort !== true || res1.savedUnits !== 70) throw new Error('Preemption abort failed');",
      "const res2 = auditPreemption(null, 'A');",
      "if (res2.shouldAbort !== false || res2.savedUnits !== 0) throw new Error('No task check failed');"
    )
  },
  {
    title: "Responsive Search with useDeferredValue: Debouncing vs Deferred Rendering Benchmarks",
    desc: "Master React's useDeferredValue hook: explore the dual-render lifecycle, benchmark deferred rendering against fixed timer debouncing, implement visual staleness signaling (query !== deferredQuery), and combine deferred values with React.memo bailouts.",
    syllabus: [
      "Two-phase rendering: Phase 1 urgent vs Phase 2 deferred.",
      "Visual staleness signaling (query !== deferredQuery).",
      "React.memo bailout optimization for child trees."
    ],
    eTitle: "Deferred Staleness Evaluator",
    eDesc: "Write `evaluateStaleness(rawQuery, deferredQuery)` returning `{ isStale: rawQuery !== deferredQuery, badge: rawQuery !== deferredQuery ? 'Updating...' : 'Synced' }`.",
    eStarter: lines("function evaluateStaleness(rawQuery, deferredQuery) {", "  // Return staleness evaluation", "  return {};", "}"),
    eHint: "const isStale = rawQuery !== deferredQuery; return { isStale: isStale, badge: isStale ? 'Updating...' : 'Synced' };",
    eTest: lines(
      "if (typeof evaluateStaleness !== 'function') throw new Error('evaluateStaleness not found');",
      "const s1 = evaluateStaleness('React', 'Rea');",
      "if (s1.isStale !== true || s1.badge !== 'Updating...') throw new Error('Stale evaluation failed');",
      "const s2 = evaluateStaleness('React', 'React');",
      "if (s2.isStale !== false || s2.badge !== 'Synced') throw new Error('Synced evaluation failed');"
    ),
    aTitle: "React.memo Prop Bailout Guard",
    aDesc: "Write `shouldMemoBailout(prevProp, nextProp)` returning `prevProp === nextProp`.",
    aStarter: lines("function shouldMemoBailout(prevProp, nextProp) {", "  // Return boolean bailout decision", "  return false;", "}"),
    aHint: "return prevProp === nextProp;",
    aTest: lines(
      "if (typeof shouldMemoBailout !== 'function') throw new Error('shouldMemoBailout not found');",
      "if (shouldMemoBailout('Rea', 'Rea') !== true) throw new Error('Identical props should bailout');",
      "if (shouldMemoBailout('Rea', 'React') !== false) throw new Error('Changed props should re-render');"
    )
  },
  {
    title: "Milestone 7: Low-Latency 10,000-Node Visual Graph Filter with useTransition & Time Slicing",
    desc: "Architect an enterprise-grade 10,000-node interactive visual graph filtering engine. Synthesize the 16.6ms frame budget, 31-bit Lane priority bitmasks, useTransition interruptibility, useDeferredValue staleness cues, and spatial viewport partitioning to achieve an unyielding 60 FPS responsive UI under massive computational load.",
    syllabus: [
      "10,000-node visual graph contiguous memory topology.",
      "Dual-priority search input and cooperative 5ms slicing.",
      "Bounding-box spatial viewport partitioning and GPU culling.",
      "Automated 16.6ms frame budget and zero TBT verification."
    ],
    eTitle: "Spatial Bounding-Box Culler",
    eDesc: "Write `isNodeInViewport(node, minX, minY, maxX, maxY)` returning `node.x >= minX && node.x <= maxX && node.y >= minY && node.y <= maxY`.",
    eStarter: lines("function isNodeInViewport(node, minX, minY, maxX, maxY) {", "  // Return true if node is within viewport bounds", "  return false;", "}"),
    eHint: "return node.x >= minX && node.x <= maxX && node.y >= minY && node.y <= maxY;",
    eTest: lines(
      "if (typeof isNodeInViewport !== 'function') throw new Error('isNodeInViewport not found');",
      "if (isNodeInViewport({ x: 400, y: 300 }, 0, 0, 800, 600) !== true) throw new Error('Inside node check failed');",
      "if (isNodeInViewport({ x: 900, y: 300 }, 0, 0, 800, 600) !== false) throw new Error('Outside node check failed');",
      "if (isNodeInViewport({ x: 400, y: 700 }, 0, 0, 800, 600) !== false) throw new Error('Outside Y node check failed');"
    ),
    aTitle: "60 FPS Frame Budget Latency Verifier",
    aDesc: "Write `verifyFrameCompliance(maxSliceMs, tbtMs)` returning `{ isCompliant: maxSliceMs <= 16.66 && tbtMs === 0, status: (maxSliceMs <= 16.66 && tbtMs === 0) ? '60 FPS PASS' : 'JANK FAIL' }`.",
    aStarter: lines("function verifyFrameCompliance(maxSliceMs, tbtMs) {", "  // Verify 60 FPS compliance", "  return {};", "}"),
    aHint: "const isCompliant = maxSliceMs <= 16.66 && tbtMs === 0; return { isCompliant: isCompliant, status: isCompliant ? '60 FPS PASS' : 'JANK FAIL' };",
    aTest: lines(
      "if (typeof verifyFrameCompliance !== 'function') throw new Error('verifyFrameCompliance not found');",
      "const r1 = verifyFrameCompliance(5.0, 0);",
      "if (r1.isCompliant !== true || r1.status !== '60 FPS PASS') throw new Error('5ms check failed');",
      "const r2 = verifyFrameCompliance(20.0, 3.34);",
      "if (r2.isCompliant !== false || r2.status !== 'JANK FAIL') throw new Error('Jank check failed');"
    )
  }
"""

if "Milestone 7: Low-Latency 10,000-Node Visual Graph Filter" in day_content:
    print("Block 8 configs already in react30DayData.ts, skipping append.")
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
    print("Appended Days 36-40 configs to src/lib/data/react30DayData.ts successfully!")
