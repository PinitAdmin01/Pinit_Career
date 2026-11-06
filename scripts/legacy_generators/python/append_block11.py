import json, sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Append to reactLongLessons.ts
print("Reading reactLongLessons.ts...")
with open('src/lib/data/reactLongLessons.ts', 'r', encoding='utf-8') as f:
    rll_text = f.read()

# Load Days 51 to 55 JSON
new_lessons = []
for d in range(51, 56):
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

print(f"Appended Days 51-55 to reactLongLessons.ts successfully!")

# 2. Append to react30DayData.ts
print("Reading react30DayData.ts...")
with open('src/lib/data/react30DayData.ts', 'r', encoding='utf-8') as f:
    r30_text = f.read()

day_configs_ts = """
  // ── WEEK 11 (Days 51–55): Next.js App Router, Edge Runtime, PPR & SDUI ───────
  {
    title: "Next.js App Router Internals: Nested Layouts, Route Groups, Parallel Routes & Intercepting Routes",
    desc: "Master the foundational routing architecture of the Next.js App Router: preserve client state during navigation with nested layouts, isolate domains with Route Groups, build multi-pane dashboards with Parallel Routes, and implement contextual modal overlays with Intercepting Routes.",
    syllabus: [
      "Nested layout trees and state preservation across route changes.",
      "Route Groups for clean URL organization and multi-root layouts.",
      "Parallel Routes (@slots) for independent concurrent sub-view streaming.",
      "Intercepting Routes ((..)) for dual-mode modal overlay navigation."
    ],
    eTitle: "App Router Segment Resolver",
    eDesc: "Write `resolveAppRouterPath(segments)` returning a clean normalized path string starting with '/', stripping Route Group segments in parentheses (e.g. ['(marketing)', 'about'] -> '/about').",
    eStarter: lines("function resolveAppRouterPath(segments) {", "  // Return normalized route path", "  return '';", "}"),
    eHint: "const clean = segments.filter(s => !(s.startsWith('(') && s.endsWith(')'))); return '/' + clean.join('/');",
    eTest: lines(
      "if (typeof resolveAppRouterPath !== 'function') throw new Error('resolveAppRouterPath not found');",
      "if (resolveAppRouterPath(['(marketing)', 'about']) !== '/about') throw new Error('Marketing route resolution failed');",
      "if (resolveAppRouterPath(['(dashboard)', 'analytics', 'realtime']) !== '/analytics/realtime') throw new Error('Dashboard route resolution failed');",
      "if (resolveAppRouterPath([]) !== '/') throw new Error('Empty root path resolution failed');"
    ),
    aTitle: "Route Group Classifier",
    aDesc: "Write `classifyRouteSegments(segments)` returning `{ isRouteGroup: boolean, publicSegments: string[] }` where isRouteGroup is true if any segment is parenthesized.",
    aStarter: lines("function classifyRouteSegments(segments) {", "  // Return route classification object", "  return {};", "}"),
    aHint: "const hasGroup = segments.some(s => s.startsWith('(') && s.endsWith(')')); const pub = segments.filter(s => !(s.startsWith('(') && s.endsWith(')'))); return { isRouteGroup: hasGroup, publicSegments: pub };",
    aTest: lines(
      "if (typeof classifyRouteSegments !== 'function') throw new Error('classifyRouteSegments not found');",
      "const r1 = classifyRouteSegments(['(marketing)', 'pricing']);",
      "if (r1.isRouteGroup !== true || r1.publicSegments.join('/') !== 'pricing') throw new Error('Route group classification failed');",
      "const r2 = classifyRouteSegments(['api', 'health']);",
      "if (r2.isRouteGroup !== false || r2.publicSegments.join('/') !== 'api/health') throw new Error('Standard route classification failed');"
    )
  },
  {
    title: "Edge Runtime & Middleware Pipelines: Geo-Distributed Routing, Edge Caching, JWT Verification & Rate Limiting",
    desc: "Explore low-latency edge computing using V8 isolates: intercept requests at globally distributed edge nodes, enforce sub-millisecond cryptographic JWT verification, implement token bucket rate limiting, and route users by geographic coordinates.",
    syllabus: [
      "Edge Runtime V8 isolates vs Node.js serverless containers.",
      "Middleware pipeline execution order: rate limiting, auth, geo-tagging.",
      "Cryptographic JWT verification via Web Crypto API in < 1ms.",
      "Distributed sliding token bucket rate limiting and IP throttling."
    ],
    eTitle: "Edge Rate Limit Gate",
    eDesc: "Write `evaluateEdgeRateLimit(requestCount, maxAllowed)` returning `{ allowed: requestCount <= maxAllowed, remaining: Math.max(0, maxAllowed - requestCount) }`.",
    eStarter: lines("function evaluateEdgeRateLimit(requestCount, maxAllowed) {", "  // Return rate limit evaluation", "  return {};", "}"),
    eHint: "return { allowed: requestCount <= maxAllowed, remaining: Math.max(0, maxAllowed - requestCount) };",
    eTest: lines(
      "if (typeof evaluateEdgeRateLimit !== 'function') throw new Error('evaluateEdgeRateLimit not found');",
      "const r1 = evaluateEdgeRateLimit(3, 5);",
      "if (r1.allowed !== true || r1.remaining !== 2) throw new Error('Allowed rate limit check failed');",
      "const r2 = evaluateEdgeRateLimit(6, 5);",
      "if (r2.allowed !== false || r2.remaining !== 0) throw new Error('Exceeded rate limit check failed');"
    ),
    aTitle: "Edge JWT Header Formatter",
    aDesc: "Write `formatEdgeAuthHeader(userId, role, geoRegion)` returning `{ 'x-edge-user': userId, 'x-edge-role': role, 'x-edge-geo': geoRegion, 'x-edge-verified': 'true' }`.",
    aStarter: lines("function formatEdgeAuthHeader(userId, role, geoRegion) {", "  // Return injected edge headers", "  return {};", "}"),
    aHint: "return { 'x-edge-user': userId, 'x-edge-role': role, 'x-edge-geo': geoRegion, 'x-edge-verified': 'true' };",
    aTest: lines(
      "if (typeof formatEdgeAuthHeader !== 'function') throw new Error('formatEdgeAuthHeader not found');",
      "const h = formatEdgeAuthHeader('u_101', 'TRADER', 'US-NYC');",
      "if (h['x-edge-user'] !== 'u_101' || h['x-edge-verified'] !== 'true') throw new Error('Edge auth header formatting failed');",
      "if (h['x-edge-geo'] !== 'US-NYC' || h['x-edge-role'] !== 'TRADER') throw new Error('Geo/Role header formatting failed');"
    )
  },
  {
    title: "Streaming Hybrid Rendering & Partial Prerendering (PPR): Static Shells, Dynamic Holes & React Experimental Cache",
    desc: "Combine the lightning speed of static websites with the power of dynamic server rendering: compile static shells at build time, stream dynamic holes over HTTP chunked transfer encoding, and eliminate N+1 database queries with request-scoped memoization.",
    syllabus: [
      "Partial Prerendering (PPR) architecture: static shells + dynamic holes.",
      "Skeleton Bounding Box Contracts for zero Cumulative Layout Shift (CLS = 0.000).",
      "Request-scoped memoization via React cache() function.",
      "Granular tag-based edge cache invalidation via revalidateTag()."
    ],
    eTitle: "PPR TTFB Optimizer",
    eDesc: "Write `evaluatePprPerformance(staticShellTtfbMs, totalStreamMs)` returning `{ isOptimal: staticShellTtfbMs <= 35 && totalStreamMs <= 100, ttfbGrade: staticShellTtfbMs <= 35 ? 'A+' : 'NEEDS_WORK' }`.",
    eStarter: lines("function evaluatePprPerformance(staticShellTtfbMs, totalStreamMs) {", "  // Return PPR performance report", "  return {};", "}"),
    eHint: "const opt = staticShellTtfbMs <= 35 && totalStreamMs <= 100; return { isOptimal: opt, ttfbGrade: staticShellTtfbMs <= 35 ? 'A+' : 'NEEDS_WORK' };",
    eTest: lines(
      "if (typeof evaluatePprPerformance !== 'function') throw new Error('evaluatePprPerformance not found');",
      "const rep1 = evaluatePprPerformance(18, 45);",
      "if (rep1.isOptimal !== true || rep1.ttfbGrade !== 'A+') throw new Error('Optimal PPR performance check failed');",
      "const rep2 = evaluatePprPerformance(50, 120);",
      "if (rep2.isOptimal !== false || rep2.ttfbGrade !== 'NEEDS_WORK') throw new Error('Sub-optimal PPR performance check failed');"
    ),
    aTitle: "Cache Tag Purge Inspector",
    aDesc: "Write `filterCacheEntriesByTag(cacheEntries, targetTag)` returning an array of entry IDs whose tags array includes targetTag.",
    aStarter: lines("function filterCacheEntriesByTag(cacheEntries, targetTag) {", "  // Return matching entry IDs", "  return [];", "}"),
    aHint: "return cacheEntries.filter(e => e.tags && e.tags.includes(targetTag)).map(e => e.id);",
    aTest: lines(
      "if (typeof filterCacheEntriesByTag !== 'function') throw new Error('filterCacheEntriesByTag not found');",
      "const entries = [{ id: 'p1', tags: ['catalog', 'electronics'] }, { id: 'p2', tags: ['catalog', 'clothing'] }, { id: 'p3', tags: ['pricing'] }];",
      "const matches = filterCacheEntriesByTag(entries, 'electronics');",
      "if (matches.length !== 1 || matches[0] !== 'p1') throw new Error('Tag filtering failed');",
      "const catalogMatches = filterCacheEntriesByTag(entries, 'catalog');",
      "if (catalogMatches.length !== 2) throw new Error('Multi-tag filtering failed');"
    )
  },
  {
    title: "Server-Driven UI (SDUI) & Dynamic Component Engines: JSON Wire Schemas, Component Registries & Polymorphic Rendering",
    desc: "Decouple visual presentation and feature releases from native client deployments: transmit declarative JSON wire schemas, resolve components through polymorphic registries with resilient fallbacks, and execute safe client expressions without eval().",
    syllabus: [
      "Declarative JSON Wire Protocols for dynamic component hierarchies.",
      "Polymorphic Component Registries with defensive fallback boundaries.",
      "Declarative action dispatchers and centralized client event buses.",
      "Zero-eval safe expression evaluation engines for dynamic visibility."
    ],
    eTitle: "SDUI Node Counter",
    eDesc: "Write `countSduiNodes(node)` recursively calculating the total number of nodes in an SDUI tree (root + all descendants in node.children).",
    eStarter: lines("function countSduiNodes(node) {", "  // Return total node count", "  return 0;", "}"),
    eHint: "if (!node) return 0; let count = 1; if (Array.isArray(node.children)) { for (const c of node.children) count += countSduiNodes(c); } return count;",
    eTest: lines(
      "if (typeof countSduiNodes !== 'function') throw new Error('countSduiNodes not found');",
      "const tree = { type: 'Page', children: [{ type: 'Hero' }, { type: 'Grid', children: [{ type: 'Card' }, { type: 'Card' }] }] };",
      "if (countSduiNodes(tree) !== 5) throw new Error('SDUI node count mismatch: expected 5');",
      "if (countSduiNodes({ type: 'Leaf' }) !== 1) throw new Error('Single node count failed');"
    ),
    aTitle: "Safe Expression Evaluator",
    aDesc: "Write `evaluateSimplePredicate(valA, op, valB)` supporting '===', '!==', '>', '<' without using eval().",
    aStarter: lines("function evaluateSimplePredicate(valA, op, valB) {", "  // Return evaluated boolean", "  return false;", "}"),
    aHint: "switch(op) { case '===': return valA === valB; case '!==': return valA !== valB; case '>': return Number(valA) > Number(valB); case '<': return Number(valA) < Number(valB); default: return false; }",
    aTest: lines(
      "if (typeof evaluateSimplePredicate !== 'function') throw new Error('evaluateSimplePredicate not found');",
      "if (evaluateSimplePredicate('VIP', '===', 'VIP') !== true) throw new Error('Equality test failed');",
      "if (evaluateSimplePredicate(500, '>', 1000) !== false) throw new Error('Greater-than test failed');",
      "if (evaluateSimplePredicate(1500, '>', 1000) !== true) throw new Error('Greater-than true test failed');"
    )
  },
  {
    title: "Milestone 10: Enterprise Edge-Native Streaming Portal with Partial Prerendering (PPR), Edge Middleware & Server-Driven UI",
    desc: "The architectural capstone of Month 2 Block 11: assemble, optimize, and certify a complete enterprise streaming portal synthesizing Next.js App Router nested layouts, geo-distributed edge middleware, Partial Prerendering, and Server-Driven UI into a Grade A+ certified platform.",
    syllabus: [
      "Enterprise portal subsystem topology and operational readiness auditing.",
      "Integrated edge middleware pipeline: sliding rate limits, Web Crypto JWT, geo context.",
      "Partial Prerendering streaming coordinator with zero layout shift (CLS = 0.000).",
      "Production 6-vector SLA verification suite and Grade A+ certification."
    ],
    eTitle: "Streaming Portal Health Auditor",
    eDesc: "Write `auditPortalReadiness(edgeActive, pprActive, sduiActive, cacheActive)` returning `{ ready: edgeActive && pprActive && sduiActive && cacheActive, activeSubsystems: [edgeActive, pprActive, sduiActive, cacheActive].filter(Boolean).length }`.",
    eStarter: lines("function auditPortalReadiness(edgeActive, pprActive, sduiActive, cacheActive) {", "  // Return health audit report", "  return {};", "}"),
    eHint: "const ready = edgeActive && pprActive && sduiActive && cacheActive; const count = [edgeActive, pprActive, sduiActive, cacheActive].filter(Boolean).length; return { ready, activeSubsystems: count };",
    eTest: lines(
      "if (typeof auditPortalReadiness !== 'function') throw new Error('auditPortalReadiness not found');",
      "const r1 = auditPortalReadiness(true, true, true, true);",
      "if (r1.ready !== true || r1.activeSubsystems !== 4) throw new Error('Healthy portal audit failed');",
      "const r2 = auditPortalReadiness(true, false, true, true);",
      "if (r2.ready !== false || r2.activeSubsystems !== 3) throw new Error('Degraded portal audit failed');"
    ),
    aTitle: "Milestone 10 SLA Certifier",
    aDesc: "Write `certifyMilestone10SLA(ttfbMs, authLatencyMs, cls)` returning `{ certified: ttfbMs <= 35 && authLatencyMs <= 5 && cls <= 0.01, grade: (ttfbMs <= 35 && authLatencyMs <= 5 && cls <= 0.01) ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' }`.",
    aStarter: lines("function certifyMilestone10SLA(ttfbMs, authLatencyMs, cls) {", "  // Return SLA certification report", "  return {};", "}"),
    aHint: "const pass = ttfbMs <= 35 && authLatencyMs <= 5 && cls <= 0.01; return { certified: pass, grade: pass ? 'GRADE A+ PRODUCTION READY' : 'NON-COMPLIANT' };",
    aTest: lines(
      "if (typeof certifyMilestone10SLA !== 'function') throw new Error('certifyMilestone10SLA not found');",
      "const cert1 = certifyMilestone10SLA(18.2, 2.4, 0.000);",
      "if (cert1.certified !== true || cert1.grade !== 'GRADE A+ PRODUCTION READY') throw new Error('Certified SLA test failed');",
      "const cert2 = certifyMilestone10SLA(42.0, 2.4, 0.000);",
      "if (cert2.certified !== false || cert2.grade !== 'NON-COMPLIANT') throw new Error('Uncertified SLA test failed');"
    )
  }
"""

# Insert before `];\n\n\nexport const REACT_30_DAYS_QUESTS`
cfg_target = "];\n\n\nexport const REACT_30_DAYS_QUESTS"
if cfg_target not in r30_text:
    # Try alternative spacing
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

print("Appended Days 51-55 to react30DayData.ts successfully!")
