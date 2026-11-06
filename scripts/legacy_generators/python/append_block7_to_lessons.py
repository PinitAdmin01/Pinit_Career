import os
import sys
import json

sys.path.insert(0, os.path.abspath('scripts'))

from react_day31_data import day31
from react_day32_data import day32
from react_day33_data import day33
from react_day34_data import day34
from react_day35_data import day35_data

days = [day31, day32, day33, day34, day35_data]

def format_long_lesson_ts(lesson):
    lines = []
    lines.append("  {")
    lines.append(f"    day: {lesson['day']},")
    lines.append(f"    title: {json.dumps(lesson['title'])},")
    lines.append(f"    goal: {json.dumps(lesson.get('desc', ''))},")
    lines.append(f"    minutes: {lesson.get('minutes', 38)},")
    recap = lesson.get('recap', 'In our previous sessions, we mastered foundational React hooks and component trees. Now we explore deep concurrent internals.')
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

# Check if Day 31 is already added
if "day: 31," in content:
    print("Day 31 already in reactLongLessons.ts, skipping append.")
else:
    # Find last occurrence of "  }\n];"
    idx = content.rfind("\n];")
    if idx == -1:
        raise Exception("Could not find \n]; in reactLongLessons.ts")
    
    formatted_lessons = []
    for d in days:
        formatted_lessons.append(format_long_lesson_ts(d))
    
    insert_chunk = ",\n" + ",\n".join(formatted_lessons)
    new_content = content[:idx] + insert_chunk + content[idx:]
    with open(LONG_LESSONS_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Appended Days 31-35 to src/lib/data/reactLongLessons.ts successfully!")

# 2. Update react30DayData.ts
DAY_CONFIGS_FILE = 'src/lib/data/react30DayData.ts'
with open(DAY_CONFIGS_FILE, 'r', encoding='utf-8') as f:
    day_content = f.read()

day_configs_ts = """
  // ── BLOCK 7 (MONTH 2): Advanced React State Machines & Concurrency (Days 31–35) ──
  {
    title: "Advanced React State Machines, Concurrent Mode, Fiber Architecture",
    desc: "Understand the Fiber reconciler, cooperative time-slicing, dual-buffering work loop, and priority lanes that empower non-blocking React 18/19 rendering.",
    syllabus: [
      "Fiber node tree structure (child, sibling, return).",
      "Dual-buffering: current vs workInProgress trees.",
      "Work loop and cooperative time-slicing."
    ],
    eTitle: "Fiber Node Linker",
    eDesc: "Write `linkFiberNodes(parent, child, sibling)` that returns an object representing the Fiber relationships: `{ child, sibling, return: parent }`.",
    eStarter: lines("function linkFiberNodes(parent, child, sibling) {", "  // Return fiber node links", "  return {};", "}"),
    eHint: "return { child: child, sibling: sibling, return: parent };",
    eTest: lines(
      "if (typeof linkFiberNodes !== 'function') throw new Error('linkFiberNodes not found');",
      "const f = linkFiberNodes('Root', 'App', null);",
      "if (f.return !== 'Root' || f.child !== 'App' || f.sibling !== null) throw new Error('Fiber links mismatch 1');",
      "const f2 = linkFiberNodes('App', 'Header', 'Sidebar');",
      "if (f2.return !== 'App' || f2.child !== 'Header' || f2.sibling !== 'Sidebar') throw new Error('Fiber links mismatch 2');"
    ),
    aTitle: "Priority Lane Classifier",
    aDesc: "Write `classifyLane(laneId)` returning `'urgent'` for 1-2, `'transition'` for 3-5, `'idle'` for 6+.",
    aStarter: lines("function classifyLane(laneId) {", "  // Return lane classification string", "  return '';", "}"),
    aHint: "if (laneId <= 2) return 'urgent'; if (laneId <= 5) return 'transition'; return 'idle';",
    aTest: lines(
      "if (typeof classifyLane !== 'function') throw new Error('classifyLane not found');",
      "if (classifyLane(1) !== 'urgent') throw new Error('Lane 1 should be urgent');",
      "if (classifyLane(4) !== 'transition') throw new Error('Lane 4 should be transition');",
      "if (classifyLane(8) !== 'idle') throw new Error('Lane 8 should be idle');"
    )
  },
  {
    title: "Concurrent Interruptible Rendering: useTransition, isPending & Non-Blocking Priority Slicing",
    desc: "Master startTransition and isPending to prevent UI freezing during heavy computational updates while keeping high-frequency keystrokes responsive at 60 FPS.",
    syllabus: [
      "Urgent vs transition updates in React 18/19.",
      "startTransition semantics and yield points.",
      "Designing non-blocking loading states with isPending."
    ],
    eTitle: "Transition Scheduler",
    eDesc: "Write `scheduleUpdate(isUrgent, payload)` returning `{ priority: isUrgent ? 'high' : 'low', payload: payload, isPending: !isUrgent }`.",
    eStarter: lines("function scheduleUpdate(isUrgent, payload) {", "  // Return update descriptor", "  return {};", "}"),
    eHint: "return { priority: isUrgent ? 'high' : 'low', payload: payload, isPending: !isUrgent };",
    eTest: lines(
      "if (typeof scheduleUpdate !== 'function') throw new Error('scheduleUpdate not found');",
      "const u1 = scheduleUpdate(true, 'text');",
      "if (u1.priority !== 'high' || u1.isPending !== false) throw new Error('Urgent update failed');",
      "const u2 = scheduleUpdate(false, [1, 2, 3]);",
      "if (u2.priority !== 'low' || u2.isPending !== true) throw new Error('Transition update failed');"
    ),
    aTitle: "Pending Badge Formatter",
    aDesc: "Write `formatPendingBadge(isPending, query)` that returns `'Updating (' + query + ')...'` when pending, otherwise `'Synced'`.",
    aStarter: lines("function formatPendingBadge(isPending, query) {", "  // Return badge string", "  return '';", "}"),
    aHint: "return isPending ? 'Updating (' + query + ')...' : 'Synced';",
    aTest: lines(
      "if (typeof formatPendingBadge !== 'function') throw new Error('formatPendingBadge not found');",
      "if (formatPendingBadge(true, 'React') !== 'Updating (React)...') throw new Error('Pending format failed');",
      "if (formatPendingBadge(false, 'React') !== 'Synced') throw new Error('Synced format failed');"
    )
  },
  {
    title: "Responsive Input Buffering with useDeferredValue, Stale Visuals & Suspense Fallbacks",
    desc: "Differentiate useDeferredValue from debounce/throttle, prevent premature child re-renders with React.memo, and build stale visual cues.",
    syllabus: [
      "useDeferredValue vs timer-based debounce.",
      "Visual staleness signaling (query !== deferredQuery).",
      "Fiber bailouts with React.memo."
    ],
    eTitle: "Staleness Checker",
    eDesc: "Write `checkStaleness(currentVal, deferredVal)` returning `{ isStale: currentVal !== deferredVal, opacity: currentVal !== deferredVal ? 0.6 : 1.0 }`.",
    eStarter: lines("function checkStaleness(currentVal, deferredVal) {", "  // Check if value is stale and return opacity", "  return {};", "}"),
    eHint: "const isStale = currentVal !== deferredVal; return { isStale: isStale, opacity: isStale ? 0.6 : 1.0 };",
    eTest: lines(
      "if (typeof checkStaleness !== 'function') throw new Error('checkStaleness not found');",
      "const s1 = checkStaleness('apple', 'app');",
      "if (s1.isStale !== true || s1.opacity !== 0.6) throw new Error('Stale check failed');",
      "const s2 = checkStaleness('apple', 'apple');",
      "if (s2.isStale !== false || s2.opacity !== 1.0) throw new Error('Synced check failed');"
    ),
    aTitle: "Memoized Filter Bailout",
    aDesc: "Write `filterWithBailout(items, prevQuery, nextQuery, prevResult)` that returns `prevResult` if `prevQuery === nextQuery`, otherwise filters items where `item.indexOf(nextQuery) !== -1`.",
    aStarter: lines("function filterWithBailout(items, prevQuery, nextQuery, prevResult) {", "  // Return cached result if queries match", "  return [];", "}"),
    aHint: "if (prevQuery === nextQuery) return prevResult; return items.filter(x => x.indexOf(nextQuery) !== -1);",
    aTest: lines(
      "if (typeof filterWithBailout !== 'function') throw new Error('filterWithBailout not found');",
      "const cache = ['a'];",
      "if (filterWithBailout(['a', 'b'], 'q', 'q', cache) !== cache) throw new Error('Bailout should return cached instance');",
      "const res = filterWithBailout(['alpha', 'beta'], 'a', 'bet', cache);",
      "if (res.length !== 1 || res[0] !== 'beta') throw new Error('Filter calculation failed');"
    )
  },
  {
    title: "Finite State Machines in React: Predictable State Transitions & useReducer with Discriminated Unions",
    desc: "Eliminate impossible UI states and boolean explosion by building finite state machines with useReducer, tagged union actions, and token invalidation.",
    syllabus: [
      "Boolean explosion vs finite state models.",
      "Pure transition matrices with useReducer.",
      "Monotonic tokens for race condition cancellation."
    ],
    eTitle: "FSM Transition Function",
    eDesc: "Write `transition(state, event)` where states are `'IDLE'`, `'LOADING'`, `'SUCCESS'`. From `'IDLE'`, `'FETCH'` transitions to `'LOADING'`. From `'LOADING'`, `'RESOLVE'` transitions to `'SUCCESS'`. Any other event returns current state.",
    eStarter: lines("function transition(state, event) {", "  // Return next state string", "  return state;", "}"),
    eHint: "if (state === 'IDLE' && event === 'FETCH') return 'LOADING'; if (state === 'LOADING' && event === 'RESOLVE') return 'SUCCESS'; return state;",
    eTest: lines(
      "if (typeof transition !== 'function') throw new Error('transition not found');",
      "if (transition('IDLE', 'FETCH') !== 'LOADING') throw new Error('IDLE -> FETCH failed');",
      "if (transition('LOADING', 'RESOLVE') !== 'SUCCESS') throw new Error('LOADING -> RESOLVE failed');",
      "if (transition('SUCCESS', 'FETCH') !== 'SUCCESS') throw new Error('Invalid transition should return same state');"
    ),
    aTitle: "Token Invalidation Guard",
    aDesc: "Write `shouldCommitResult(activeToken, incomingToken)` returning `true` only if `incomingToken === activeToken`.",
    aStarter: lines("function shouldCommitResult(activeToken, incomingToken) {", "  // Return boolean guard", "  return false;", "}"),
    aHint: "return activeToken === incomingToken;",
    aTest: lines(
      "if (typeof shouldCommitResult !== 'function') throw new Error('shouldCommitResult not found');",
      "if (shouldCommitResult(5, 5) !== true) throw new Error('Matching token should commit');",
      "if (shouldCommitResult(5, 4) !== false) throw new Error('Stale token should be rejected');"
    )
  },
  {
    title: "Milestone 6: Concurrent Data Grid: 10,000 Row Asynchronous Filter & Priority Slicing Engine",
    desc: "Architect an enterprise-grade concurrent data grid handling 10,000 records. Integrate finite state machine lifecycle management, urgent keystroke buffering, deferred value filtering, and cooperative time-slicing to guarantee a 60 FPS responsive UI under heavy synthetic computation.",
    syllabus: [
      "Enterprise data grid state machine architecture.",
      "Non-blocking cooperative filtering with priority cancellation.",
      "Viewport virtualization (scrollTop, rowHeight, overscan).",
      "Automated latency benchmarking for 60 FPS compliance."
    ],
    eTitle: "Virtual Viewport Calculator",
    eDesc: "Write `getVirtualSlice(scrollTop, rowHeight, viewportHeight, overscan)` returning `{ startIndex, endIndex }`. `startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)`, `endIndex = Math.floor((scrollTop + viewportHeight) / rowHeight) + overscan`.",
    eStarter: lines("function getVirtualSlice(scrollTop, rowHeight, viewportHeight, overscan) {", "  // Return startIndex and endIndex", "  return {};", "}"),
    eHint: "const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan); const end = Math.floor((scrollTop + viewportHeight) / rowHeight) + overscan; return { startIndex: start, endIndex: end };",
    eTest: lines(
      "if (typeof getVirtualSlice !== 'function') throw new Error('getVirtualSlice not found');",
      "const slice = getVirtualSlice(400, 40, 200, 2);",
      "if (slice.startIndex !== 8 || slice.endIndex !== 17) throw new Error('Wrong virtual slice calculation');",
      "const slice0 = getVirtualSlice(0, 40, 100, 2);",
      "if (slice0.startIndex !== 0 || slice0.endIndex !== 4) throw new Error('Wrong virtual slice at top');"
    ),
    aTitle: "Frame Budget Latency Auditor",
    aDesc: "Write `auditLatency(elapsedMs)` returning `'pass'` if `elapsedMs < 16.6`, otherwise `'jank'`.",
    aStarter: lines("function auditLatency(elapsedMs) {", "  // Audit 60 FPS budget", "  return '';", "}"),
    aHint: "return elapsedMs < 16.6 ? 'pass' : 'jank';",
    aTest: lines(
      "if (typeof auditLatency !== 'function') throw new Error('auditLatency not found');",
      "if (auditLatency(4.2) !== 'pass') throw new Error('4.2ms should pass');",
      "if (auditLatency(16.5) !== 'pass') throw new Error('16.5ms should pass');",
      "if (auditLatency(18.0) !== 'jank') throw new Error('18ms should be jank');"
    )
  }
"""

if "Advanced React State Machines, Concurrent Mode, Fiber Architecture" in day_content:
    print("Days 31-35 already in react30DayData.ts, skipping append.")
else:
    # Find the closing array bracket before export const REACT_30_DAYS_QUESTS
    needle = "export const REACT_30_DAYS_QUESTS"
    pos = day_content.find(needle)
    if pos == -1:
        raise Exception("Could not find REACT_30_DAYS_QUESTS in react30DayData.ts")
    
    # Backtrack to the preceding "];"
    bracket_pos = day_content.rfind("];", 0, pos)
    if bracket_pos == -1:
        raise Exception("Could not find ]; before REACT_30_DAYS_QUESTS")
    
    insert_chunk = "," + day_configs_ts + "\n"
    new_day_content = day_content[:bracket_pos] + insert_chunk + day_content[bracket_pos:]
    with open(DAY_CONFIGS_FILE, 'w', encoding='utf-8') as f:
        f.write(new_day_content)
    print("Appended Days 31-35 configs to src/lib/data/react30DayData.ts successfully!")
