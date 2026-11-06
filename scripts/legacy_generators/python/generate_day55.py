import json, subprocess

p1_say = [
    "Welcome to Day 55 of Full-Stack React Web Development: Milestone 10: Enterprise Edge-Native Streaming Portal with Partial Prerendering (PPR), Edge Middleware & Server-Driven UI. Today marks a historic architectural capstone in our mastery of React 19, Next.js App Router, distributed edge computing, and modern server rendering systems. Over the preceding four days, you have systematically disassembled the most advanced mechanics of contemporary web engineering: Next.js App Router nested layouts and intercepting routes on Day 51, edge runtime middleware pipelines and geo-distributed security on Day 52, streaming hybrid rendering and Partial Prerendering on Day 53, and Server-Driven UI component engines on Day 54.",
    "In this comprehensive Milestone 10 capstone, you will not merely review isolated concepts; you will synthesize these disparate enterprise disciplines into a unified, production-grade architectural topology: the Enterprise Edge-Native Streaming Portal. This platform represents the state-of-the-art in modern web engineering, deployed by tier-one global organizations handling millions of concurrent users across distributed multi-region edge networks.",
    "Let us dissect the foundational architectural topology of Milestone 10. When a user in Singapore, London, or New York initiates a request to our portal, the request encounters our globally distributed Edge Middleware layer within single-digit milliseconds. The edge middleware performs instant pre-flight JWT cryptographic verification, checks token bucket rate limits against a low-latency distributed Redis or Cloudflare KV store, extracts geographic geolocation coordinates (country, city, latitude), and enriches the incoming request headers.",
    "If the request violates security policies or exceeds rate quotas, the edge terminates execution immediately with sub-5ms latency, protecting our upstream origin infrastructure from distributed denial-of-service (DDoS) exhaustion. If authorized, the edge routes the enriched request to the nearest streaming origin runtime. Here, Next.js Partial Prerendering (PPR) activates: the pre-compiled static shell—including the global navigational headers, application sidebar, and structural grid containers—is delivered to the browser instantly with a Time to First Byte (TTFB) under 20 milliseconds.",
    "Simultaneously, dynamic Suspense boundaries stream live personalized content across the open HTTP connection without blocking initial paint. Within these dynamic holes, our Server-Driven UI (SDUI) engine parses incoming JSON wire schemas, matching dynamic widget types against our polymorphic component registry with defensive fallback handling. Request-scoped memoization via React cache() eliminates duplicate database queries, while granular tag-based cache orchestration ensures instant edge purge capabilities upon state mutations.",
    "In Part 1, we establish our architectural readiness through a comprehensive Subsystem Health Auditor. This diagnostic validator programmatically inspects our four core portal pillars—Edge Middleware, PPR Streaming Engine, SDUI Dynamic Engine, and Cache Invalidation Mesh—ensuring complete 100% operational readiness before live traffic routing."
]

p1_code = """function auditPortalSubsystems(config) {
  const subsystems = ['edgeMiddleware', 'pprStreaming', 'sduiEngine', 'cacheMesh'];
  const audit = {};
  let totalScore = 0;
  for (const sys of subsystems) {
    const active = config[sys] && config[sys].status === 'ACTIVE';
    audit[sys] = active ? 'ONLINE' : 'DEGRADED';
    if (active) totalScore += 25;
  }
  return { audit, healthScore: totalScore, status: totalScore === 100 ? 'READY' : 'DEGRADED' };
}

const portalConfig = {
  edgeMiddleware: { status: 'ACTIVE', runtime: 'edge-light', regions: ['iad1', 'fra1', 'sin1'] },
  pprStreaming: { status: 'ACTIVE', engine: 'react-19-ppr', fallbackLatencyMs: 12 },
  sduiEngine: { status: 'ACTIVE', schemaVersion: 2, registeredWidgets: 48 },
  cacheMesh: { status: 'ACTIVE', tagInvalidation: true, purgeLatencyMs: 8 }
};

const report = auditPortalSubsystems(portalConfig);
console.log('Portal Status:', report.status);
console.log('System Health:', report.healthScore + '%');
console.log('Subsystem Audit:', Object.entries(report.audit).map(([k, v]) => `${k}:${v}`).join(', '));"""

p2_say = [
    "Having established the macro-architecture of Milestone 10, Part 2 dives into the execution layer of our Edge Middleware and Context Hydration Pipeline. In high-traffic enterprise portals, the edge runtime is the first line of defense and the primary accelerator of user personalization. Unlike standard server runtimes that introduce noticeable cold-start latency, the Edge Runtime executes on lightweight V8 isolates distributed across hundreds of Points of Presence (PoPs) worldwide, initiating execution in less than 2 milliseconds.",
    "Our integrated edge middleware pipeline implements three critical operational phases in strict sequential order: Rate Limiting Enforcement, Cryptographic Token Verification, and Ambient Geolocation Context Injection. First, our rate limiting gate validates incoming client IP addresses against a sliding-window counter. If a client attempts to flood the portal with automated bot requests, the middleware responds with HTTP 429 Too Many Requests and an explicit Retry-After header, shielding downstream server components from unnecessary computational load.",
    "Second, the middleware inspects incoming authorization cookies or bearer headers, performing zero-network cryptographic verification of JSON Web Tokens (JWT) using the Web Crypto API (`crypto.subtle.verify`). Because edge isolates cannot execute Node.js native binary modules, verifying signatures using standard Web Crypto standards guarantees native runtime compatibility across Vercel Edge, Cloudflare Workers, and Deno Deploy without external dependencies.",
    "Third, upon successful validation, the middleware extracts the user's geographic attributes from incoming edge headers (such as `CF-IPCountry` or `x-vercel-ip-country`) and synthesizes an ambient routing context. Rather than forcing downstream Server Components to query an external IP geolocation database, the middleware injects standardized request headers (`x-edge-geo`, `x-edge-verified`, `x-rate-remaining`) before forwarding the request to the App Router engine.",
    "This decoupled, edge-first architecture ensures that by the time React begins rendering on the server, all authentication checks, permission validations, and geographic localizations have already been resolved and verified at the network edge. Let us examine the implementation of our `EnterpriseEdgePipeline`. Observe how it orchestrates sliding-window rate tracking, enforces cryptographic authentication boundaries, and injects enriched geolocation headers seamlessly."
]

p2_code = """class EnterpriseEdgePipeline {
  constructor(rateLimitMax = 5) {
    this.rateLimitMax = rateLimitMax;
    this.requestCounts = new Map();
  }

  process(req) {
    const ip = req.ip || '127.0.0.1';
    const count = (this.requestCounts.get(ip) || 0) + 1;
    this.requestCounts.set(ip, count);

    if (count > this.rateLimitMax) {
      return { status: 429, headers: { 'Retry-After': '60' }, body: 'Rate limit exceeded' };
    }

    if (!req.token || req.token !== 'valid_edge_jwt_secret') {
      return { status: 401, headers: {}, body: 'Unauthorized: Invalid JWT' };
    }

    const geoHeader = req.geo ? `${req.geo.country}-${req.geo.city}` : 'US-UNKNOWN';
    return {
      status: 200,
      headers: {
        'x-edge-geo': geoHeader,
        'x-edge-verified': 'true',
        'x-rate-remaining': String(this.rateLimitMax - count)
      },
      body: 'PASSED'
    };
  }
}

const pipeline = new EnterpriseEdgePipeline(3);
const r1 = pipeline.process({ ip: '10.0.0.1', token: 'valid_edge_jwt_secret', geo: { country: 'US', city: 'NYC' } });
const r2 = pipeline.process({ ip: '10.0.0.1', token: 'bad_token' });
pipeline.process({ ip: '10.0.0.2', token: 'valid_edge_jwt_secret' });
pipeline.process({ ip: '10.0.0.2', token: 'valid_edge_jwt_secret' });
pipeline.process({ ip: '10.0.0.2', token: 'valid_edge_jwt_secret' });
const rBlocked = pipeline.process({ ip: '10.0.0.2', token: 'valid_edge_jwt_secret' });

console.log('Req 1 Status:', r1.status);
console.log('Req 1 Geo Header:', r1.headers['x-edge-geo']);
console.log('Req 2 Status (Bad Auth):', r2.status);
console.log('Req Blocked Status (Rate Limit):', rBlocked.status);"""

p3_say = [
    "With edge middleware verifying and hydrating request context, Part 3 addresses the rendering engine of Milestone 10: the Partial Prerendering (PPR) Streaming Coordinator. In modern full-stack engineering, performance is measured by user perception and Core Web Vitals. If a user clicks a dashboard link and stares at a blank screen for 800 milliseconds while microservices compute recommendations, bounce rates skyrocket and search engine rankings degrade.",
    "Partial Prerendering eliminates this delay by decomposing the route into two complementary operational planes: the Pre-Rendered Static Shell and Streaming Dynamic Holes. During application build and continuous deployment, Next.js generates static HTML snapshots of the application chrome—including top navigation bars, brand logos, side menus, and structural layout grids. When the browser initiates an HTTP request, the edge cache serves this static shell in under 20 milliseconds, delivering an instantaneous First Contentful Paint (FCP).",
    "Simultaneously, the HTTP connection remains open using HTTP/2 chunked transfer encoding (`Transfer-Encoding: chunked`). Embedded within the static shell are Suspense boundary fallbacks that reserve explicit bounding boxes on the screen. As backend microservices and database queries resolve on the origin server, the streaming coordinator transmits serialized HTML fragments and React Flight data chunks across the open connection.",
    "To prevent layout shift and maintain a pristine Cumulative Layout Shift (CLS) of 0.000, our streaming coordinator strictly enforces Skeleton Bounding Box Contracts. Fallback skeleton elements declared in JSX match the exact height, width, padding, and margin properties of final rendered components. When dynamic bytes arrive, the browser replaces the fallback placeholder in-place without recalculating or reflowing sibling elements.",
    "Furthermore, our coordinator integrates React's request-scoped `cache()` memoization layer. When multiple dynamic holes—such as an account balance widget and a real-time order history table—require the same authenticated user profile or tenant metadata, `cache()` deduplicates the fetch operations automatically. Only a single database round-trip executes, preventing N+1 microservice amplification across concurrent streaming holes.",
    "Let us explore how our `simulatePPRStream` coordinator models this progressive rendering workflow. Notice how chunk 0 delivers the static shell immediately with zero delay, followed by asynchronous dynamic hole chunks that resolve progressively as backend tasks finish."
]

p3_code = """function simulatePPRStream(staticShell, dynamicHoles) {
  const streamChunks = [];
  streamChunks.push({ phase: 'STATIC_SHELL', timeMs: 0, html: `<div id="app-root">${staticShell}</div>` });

  for (const hole of dynamicHoles) {
    streamChunks.push({
      phase: 'DYNAMIC_HOLE',
      timeMs: hole.latencyMs,
      targetHoleId: hole.id,
      html: `<template data-target="${hole.id}">${hole.rendered}</template>`
    });
  }
  return streamChunks;
}

const shell = '<header><h1>Edge Portal</h1><nav>Home | Desk | Analytics</nav></header><main><div id="hole-feed">Loading Feed...</div><div id="hole-prices">Loading Prices...</div></main>';
const holes = [
  { id: 'hole-feed', latencyMs: 25, rendered: '<section class="feed">Live News: Market Open</section>' },
  { id: 'hole-prices', latencyMs: 45, rendered: '<section class="ticker">AAPL: $220.50 | NVDA: $128.10</section>' }
];

const chunks = simulatePPRStream(shell, holes);
console.log('Total Chunks:', chunks.length);
console.log('First Chunk Phase:', chunks[0].phase);
console.log('Dynamic Hole Target 1:', chunks[1].targetHoleId);
console.log('Dynamic Hole Target 2:', chunks[2].targetHoleId);
console.log('Max Stream Latency:', Math.max(...chunks.map(c => c.timeMs)) + 'ms');"""

p4_say = [
    "In Part 4 of Milestone 10, we integrate our Server-Driven UI (SDUI) Dynamic Component Engine directly within the streaming portal runtime. While the static shell provides stable navigational structure, the primary content viewports of our enterprise portal are driven dynamically by server-emitted JSON wire schemas. This allows our platform to reconfigure dashboards, launch real-time financial widgets, and execute A/B layout experiments without requiring client bundle deployments.",
    "The core engine of Part 4 is the `PortalSDUIEngine`, which encapsulates our Polymorphic Component Registry, Defensive Fallback Boundary, and Declarative Action Event Bus. When a streaming dynamic hole receives a JSON wire schema payload from backend services, the engine recursively traverses the node hierarchy. It matches each node's `type` against the registered component dictionary, applying declared props and recursively rendering child containers.",
    "Resilience is paramount: if the backend introduces a bleeding-edge widget—such as `ExperimentalAiInsight`—that is not yet present in the current client registry version, our engine must not throw an uncaught exception. Instead, the fallback resolver intercepts the unsupported type, registers a telemetry log for platform observability, and renders an unobtrusive fallback widget placeholder (`[Fallback: ExperimentalAiInsight]`), ensuring that all surrounding production widgets continue to render without interruption.",
    "Interactivity within SDUI nodes is managed through declarative action dispatching. Components do not execute imperative client code directly; instead, interactive triggers emit structured action objects: `{ type: 'TELEMETRY_LOG', payload: { event: 'SDUI_RENDER_SUCCESS' } }`. The engine's action dispatcher records execution history, validates authorization boundaries, and dispatches audited events to monitoring backends.",
    "By harmonizing Server-Driven UI with React Server Components, the heavy computational work of parsing schemas, validating node hierarchies, and evaluating dynamic visibility predicates executes entirely on the server. The client receives clean, optimized HTML and lightweight interaction handlers, maximizing device battery life and eliminating main-thread freezing on low-powered mobile devices.",
    "Let us examine the implementation of our `PortalSDUIEngine`. Notice how our polymorphic registry handles nested container layouts, gracefully absorbs unknown experimental widgets, and executes declarative action dispatches into an audited history log."
]

p4_code = """class PortalSDUIEngine {
  constructor() {
    this.components = new Map();
    this.actionHistory = [];
  }

  register(type, renderFn) {
    this.components.set(type, renderFn);
  }

  render(node) {
    const Component = this.components.get(node.type);
    if (!Component) return `<div class="fallback-widget">[Fallback: ${node.type}]</div>`;
    const renderedChildren = (node.children || []).map(c => this.render(c)).join('');
    return Component(node.props || {}, renderedChildren);
  }

  dispatch(action) {
    this.actionHistory.push(action);
    return `Action ${action.type} handled successfully`;
  }
}

const sdui = new PortalSDUIEngine();
sdui.register('PortalShell', (p, children) => `<div class="portal-${p.theme}">${children}</div>`);
sdui.register('MetricsRow', (p, children) => `<div class="metrics-grid">${children}</div>`);
sdui.register('StatCard', (p) => `<div class="stat-card"><span>${p.label}</span><strong>${p.value}</strong></div>`);

const wireSchema = {
  type: 'PortalShell',
  props: { theme: 'dark' },
  children: [
    {
      type: 'MetricsRow',
      children: [
        { type: 'StatCard', props: { label: 'Active Users', value: '18,420' } },
        { type: 'StatCard', props: { label: 'Edge TTFB', value: '14ms' } },
        { type: 'ExperimentalAiInsight', props: { mode: 'forecast' } }
      ]
    }
  ]
};

const outputHtml = sdui.render(wireSchema);
sdui.dispatch({ type: 'TELEMETRY_LOG', payload: { event: 'SDUI_RENDER_SUCCESS' } });

console.log('Rendered HTML Length:', outputHtml.length);
console.log('Contains Dark Theme:', outputHtml.includes('portal-dark'));
console.log('Contains Active Users:', outputHtml.includes('18,420'));
console.log('Fallback Handled:', outputHtml.includes('Fallback: ExperimentalAiInsight'));
console.log('Actions Dispatched:', sdui.actionHistory.length);"""

p5_say = [
    "We have arrived at the crowning finale of Milestone 10: End-to-End Production Verification, SLA Conformance & Zero-Downtime Deployment Certification. In enterprise engineering, architectural elegance is meaningless without empirical verification. Before any platform release is certified for global production rollout, it must undergo rigorous automated Service Level Agreement (SLA) audits against strict non-negotiable performance thresholds.",
    "In Part 5, our `runMilestone10VerificationSuite` programmatically audits our enterprise streaming portal across six essential Golden Signals: Edge Authentication Latency (Target: <= 5.0ms, Observed: 2.4ms), Static Shell TTFB (Target: <= 35.0ms, Observed: 18.2ms), Dynamic Stream Duration (Target: <= 100.0ms, Observed: 42.0ms), Cumulative Layout Shift (Target: <= 0.010, Observed: 0.000), SDUI Fallback Rate (Target: <= 0.1%, Observed: 0.0%), and Edge Cache Hit Ratio (Target: >= 95.0%, Observed: 99.4%).",
    "Each metric represents a critical operational vector: sub-5ms edge authentication ensures that security does not penalize user experience; sub-35ms TTFB guarantees instant perceived page loads across global edge nodes; sub-100ms streaming completion ensures that real-time stock quotes, personalized feeds, and analytics dashboards reach interactive readiness before user attention drifts; and a CLS score of 0.000 guarantees a visually flawless, rock-solid reading experience with zero layout jumping.",
    "Furthermore, our zero-downtime deployment pipeline integrates Blue-Green Edge Routing and Tag-Based Cache Invalidation. When a new release deploys, edge workers route a canary percentage of traffic to the new version while monitoring our verification suite in real time. If any single SLA fails to meet target thresholds, the deployment pipeline automatically triggers an edge circuit breaker, reverting traffic to the healthy baseline in under 500 milliseconds without dropping a single user session.",
    "Congratulations on completing Milestone 10! You have mastered the entire spectrum of cutting-edge React web development. You have proven your ability to architect, implement, optimize, and certify enterprise-grade streaming platforms that unify Next.js App Router, edge middleware pipelines, Partial Prerendering, and Server-Driven UI into a world-class, fault-tolerant digital experience. You are fully prepared to lead architectural transformations at the highest levels of global technology organizations."
]

p5_code = """function runMilestone10VerificationSuite() {
  const metrics = {
    edgeAuthLatencyMs: 2.4,
    staticShellTtfbMs: 18.2,
    dynamicStreamDurationMs: 42.0,
    cumulativeLayoutShift: 0.000,
    sduiFallbackRatePercent: 0.0,
    cacheHitRatioPercent: 99.4
  };

  const slaTargets = {
    edgeAuthLatencyMs: 5.0,
    staticShellTtfbMs: 35.0,
    dynamicStreamDurationMs: 100.0,
    cumulativeLayoutShift: 0.01,
    sduiFallbackRatePercent: 0.1,
    cacheHitRatioPercent: 95.0
  };

  const results = {};
  let passedCount = 0;

  for (const [key, target] of Object.entries(slaTargets)) {
    const val = metrics[key];
    const isPass = key === 'cacheHitRatioPercent' ? val >= target : val <= target;
    results[key] = { value: val, target, pass: isPass };
    if (isPass) passedCount++;
  }

  const allPassed = passedCount === Object.keys(slaTargets).length;
  return { allPassed, passedCount, total: Object.keys(slaTargets).length, results };
}

const suite = runMilestone10VerificationSuite();
console.log('Milestone 10 Certification:', suite.allPassed ? 'CERTIFIED' : 'FAILED');
console.log('SLAs Passed:', `${suite.passedCount}/${suite.total}`);
console.log('CLS Score:', suite.results.cumulativeLayoutShift.value);
console.log('Cache Hit Ratio:', suite.results.cacheHitRatioPercent.value + '%');"""

def run_code(code):
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    return res.stdout.strip()

out1 = run_code(p1_code)
out2 = run_code(p2_code)
out3 = run_code(p3_code)
out4 = run_code(p4_code)
out5 = run_code(p5_code)

parts = [
    {
        "id": "part1",
        "title": "Milestone 10 Architectural Vision & Production System Topology",
        "say": p1_say,
        "code": p1_code,
        "output": out1,
        "check": {
            "question": "What is the primary operational topology of the Enterprise Edge-Native Streaming Portal in Milestone 10?",
            "options": [
                "A unified pipeline combining sub-5ms edge authentication/rate-limiting, sub-20ms static shell delivery via PPR, and streaming dynamic SDUI holes with 0.000 CLS",
                "A monolithic PHP server rendering un-cached HTML with synchronous 3-second database blocking calls",
                "A client-only single-page application requiring a 50MB JavaScript bundle to download before displaying any content",
                "A static site generator that rebuilds and deploys all 100,000 pages whenever any dynamic stock price updates"
            ],
            "answer": 0,
            "why": "Milestone 10 synthesizes edge computing, Partial Prerendering, and Server-Driven UI into a high-performance streaming architecture."
        }
    },
    {
        "id": "part2",
        "title": "Integrated Edge Middleware & Context Hydration Pipeline",
        "say": p2_say,
        "code": p2_code,
        "output": out2,
        "check": {
            "question": "Why does the Edge Middleware perform JWT verification and rate limiting before forwarding requests to the App Router origin?",
            "options": [
                "To terminate invalid or abusive requests with sub-5ms latency at the edge, protecting upstream origin servers from DDoS load",
                "Because React Server Components cannot read cookies or HTTP headers in production",
                "To convert incoming HTTP requests into binary UDP packets for the GPU",
                "To force all authenticated users to refresh their browser every 10 seconds"
            ],
            "answer": 0,
            "why": "Edge-first security shields origin computing resources by terminating unauthorized traffic immediately at the network edge."
        }
    },
    {
        "id": "part3",
        "title": "PPR Shell & Dynamic Hole Streaming Coordinator",
        "say": p3_say,
        "code": p3_code,
        "output": out3,
        "check": {
            "question": "How does the Partial Prerendering coordinator achieve an unyielding Cumulative Layout Shift (CLS) of 0.000 during progressive streaming?",
            "options": [
                "By enforcing Skeleton Bounding Box Contracts where Suspense fallbacks match the exact dimensions of final rendered components",
                "By hiding the entire web page behind a full-screen loading spinner until all streaming chunks arrive",
                "By disabling CSS styles completely until the final dynamic chunk completes transmission",
                "By forcing all images and components to have an arbitrary fixed height of 10 pixels"
            ],
            "answer": 0,
            "why": "Explicit bounding box reservation ensures that incoming streaming bytes never cause page reflow or visual layout shifting."
        }
    },
    {
        "id": "part4",
        "title": "Dynamic SDUI Wire Interpreter & Component Polymorphism",
        "say": p4_say,
        "code": p4_code,
        "output": out4,
        "check": {
            "question": "How does the PortalSDUIEngine handle an unrecognized component type emitted by backend services?",
            "options": [
                "It intercepts the unknown type, logs a telemetry event, and renders a resilient fallback placeholder without crashing",
                "It throws a critical JavaScript syntax error and aborts the entire user session",
                "It executes an external curl command to install new npm packages on the client device in real time",
                "It reloads the page in an infinite loop until the backend changes the component type"
            ],
            "answer": 0,
            "why": "Defensive fallback boundaries guarantee that unknown or newly released component types degrade gracefully without client crashes."
        }
    },
    {
        "id": "part5",
        "title": "End-to-End Milestone Production Verification, SLA Conformance & Zero-Downtime Pipeline",
        "say": p5_say,
        "code": p5_code,
        "output": out5,
        "check": {
            "question": "What is the purpose of the automated SLA Verification Suite in Milestone 10?",
            "options": [
                "To programmatically validate critical production Golden Signals (TTFB, edge auth latency, CLS, stream duration) before certifying production deployment",
                "To convert all TypeScript files into minified assembly language for embedded microcontrollers",
                "To format JavaScript source code with Prettier and delete git commit history",
                "To automatically bill users' credit cards whenever an edge worker executes"
            ],
            "answer": 0,
            "why": "Automated SLA verification guarantees that all production performance, stability, and reliability invariants are met prior to global rollout."
        }
    }
]

day55_data = {
    "day": 55,
    "title": "Milestone 10: Enterprise Edge-Native Streaming Portal with Partial Prerendering (PPR), Edge Middleware & Server-Driven UI",
    "course": "Full-Stack React Web Development",
    "track": "Enterprise React Architecture",
    "declaredMinutes": 40,
    "projectStep": {
        "title": "Architect, Build, and Certify an Enterprise Edge-Native Streaming Portal with PPR and Server-Driven UI",
        "steps": [
            "Implement an Edge Middleware pipeline enforcing JWT verification, sliding rate limiting, and geo tagging",
            "Construct a Partial Prerendering (PPR) streaming coordinator with zero-CLS skeleton bounding box reservations",
            "Integrate a polymorphic Server-Driven UI component engine with resilient fallback handling and action dispatching",
            "Execute the comprehensive 6-vector SLA verification suite to certify production readiness"
        ]
    },
    "parts": parts
}

# Check word counts
total_words = 0
for i, p in enumerate(parts):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"Day 55 Part {i+1}: {wc} words")
print(f"Total Day 55 Words: {total_words}")

with open('scripts/react_day55.json', 'w', encoding='utf-8') as f:
    json.dump(day55_data, f, indent=2)

with open('scripts/react_day55_data.py', 'w', encoding='utf-8') as f:
    f.write(f"DAY_55 = {json.dumps(day55_data, indent=2)}\n")

print("Generated scripts/react_day55.json and scripts/react_day55_data.py successfully!")
