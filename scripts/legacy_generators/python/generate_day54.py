import json, subprocess

p1_say = [
    "Welcome to Day 54 of Full-Stack React Web Development. Today, we step into the architectural epicenter of modern enterprise mobile and web applications: Server-Driven UI (SDUI) and Dynamic Component Engines. In conventional React applications, every UI layout, component hierarchy, style variant, and navigation workflow is hardcoded into the client codebase at compile time. When a product manager requests an A/B test on the checkout screen, an e-commerce seasonal layout refresh, or a promotional banner update, frontend engineering teams must draft pull requests, run continuous integration pipelines, wait for multi-tier build steps, and deploy new JavaScript bundles to production CDNs or mobile app stores.",
    "This rigid release cadence creates organizational friction and slows down business velocity. In fast-paced global enterprises like Airbnb, Spotify, Uber, and Shopify, deployment cannot wait for client application release cycles. Server-Driven UI fundamentally inverts this paradigm: instead of the client dictating how screens are structured and rendered, the server transmits a declarative JSON wire schema describing the component tree, property bindings, visual hierarchies, and executable actions in real time.",
    "The client application ceases to be a monolithic collection of static pages; instead, it transforms into an intelligent rendering engine and runtime interpreter. The client defines a robust, immutable component library with strict design system primitives—such as Container, HeroBanner, ProductCard, MetricBadge, Carousel, and ActionButton. When a user requests a route, the server responds with a serialized JSON wire payload that specifies exactly which registered components to instantiate, what nested children to attach, and what styles or data attributes to apply.",
    "Building an enterprise-grade SDUI architecture requires deep discipline in schema design, API contract immutability, and runtime validation. The JSON wire protocol must be strictly typed, deterministic, and self-documenting. If a server emits an unrecognized component type, a malformed nested layout, or an invalid attribute, the client rendering engine must never crash or throw uncaught runtime exceptions. Instead, it must gracefully degrade through resilient fallback boundaries, logging synthetic telemetry events while rendering safe default placeholders to the user.",
    "Furthermore, Server-Driven UI integrates harmoniously with React Server Components (RSC) and Next.js App Router. Rather than transmitting thousands of lines of client JavaScript to parse and construct layouts in browser memory, Next.js can resolve SDUI schemas directly on the server, streaming pre-rendered HTML fragments and serialized React flight data directly across the wire. This reduces client-side CPU overhead and memory footprint while providing total runtime dynamism.",
    "In this comprehensive session, you will learn how to design declarative JSON wire protocols, build a polymorphic component registry and resolver, implement decoupled action dispatchers and event buses, build safe zero-eval expression evaluation engines, and orchestrate schema versioning with backwards-compatible migration pipelines across distributed edge architectures."
]

p1_code = """function validateSchema(node) {
  if (!node || typeof node !== 'object') throw new Error('Invalid node');
  if (!node.type || !node.id) throw new Error('Missing type or id');
  let count = 1;
  let maxChildDepth = 0;
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const res = validateSchema(child);
      count += res.count;
      if (res.depth > maxChildDepth) maxChildDepth = res.depth;
    }
  }
  return { count, depth: 1 + maxChildDepth };
}

const sduiTree = {
  type: 'PageContainer',
  id: 'page_home_01',
  props: { title: 'Enterprise Portal', padding: 16 },
  children: [
    {
      type: 'HeroBanner',
      id: 'banner_hero',
      props: { headline: 'Edge Streaming Active', variant: 'primary' }
    },
    {
      type: 'GridSection',
      id: 'section_grid',
      props: { columns: 2 },
      children: [
        { type: 'MetricCard', id: 'card_latency', props: { label: 'P99 Latency', value: '14ms' } },
        { type: 'MetricCard', id: 'card_uptime', props: { label: 'Availability', value: '99.99%' } }
      ]
    }
  ]
};

const stats = validateSchema(sduiTree);
console.log('SDUI Tree Nodes:', stats.count);
console.log('SDUI Max Depth:', stats.depth);
console.log('Root Node Type:', sduiTree.type);"""

p2_say = [
    "Now that we have established the theoretical foundations of Server-Driven UI, let us examine the core mechanism that renders declarative JSON schemas into living React user interfaces: the Dynamic Component Registry and Polymorphic Component Resolver. The component registry serves as the authoritative dictionary that maps abstract JSON component type strings—such as `'HeroBanner'`, `'ProductCarousel'`, or `'MetricCard'`—to concrete React component implementations.",
    "In a production codebase, the component registry is implemented as an immutable map or dictionary. When the client application boots, every supported design system component registers itself with the central registry along with its associated prop types, default configurations, and layout constraints. When the SDUI rendering engine traverses incoming JSON wire schemas, it queries the registry for each node's `type` attribute, extracting the corresponding React functional component and passing the declared `props` and recursive `children`.",
    "The most critical architectural challenge in dynamic component resolution is handling unknown or deprecated component types. In high-velocity enterprise organizations, backend engineering teams frequently deploy new experimental UI components before all client versions have updated their local registries. If a legacy mobile client or an outdated browser tab encounters a JSON payload referencing a new component type like `'AiInsightWidget'`, invoking `registry[node.type]` without defensive safeguards will result in an `undefined` component reference and trigger an immediate React crash (`React.createElement: type is invalid`).",
    "To eliminate runtime fragility, the polymorphic resolver must enforce strict Fallback Registry Contracts. When an unknown component type is encountered, the resolver intercepts the node, records a diagnostic telemetry log for observability teams, and routes rendering to a registered fallback handler. Depending on the component's priority and declared failure policy, the fallback handler can render a neutral skeleton placeholder, seamlessly skip rendering the unsupported node while continuing to render its valid siblings, or render an unobtrusive generic container.",
    "Moreover, modern SDUI engines implement schema validation layers using libraries like Zod or TypeScript type guards. Before a raw JSON payload enters the rendering pipeline, the validator parses incoming props against strict structural contracts. If a `'PriceCard'` component requires a numeric `price` and string `currency` prop, the validator coerces types, strips malicious or unauthorized attributes, and ensures that the downstream React component receives 100% sanitized, predictable data structures.",
    "Let us examine how to construct a robust, polymorphic component registry in JavaScript. Notice how our resolver supports recursive child rendering, explicit prop injection, and deterministic fallback handling for unregistered widget types."
]

p2_code = """class SDUIRegistry {
  constructor() {
    this.registry = new Map();
    this.fallback = null;
  }

  register(type, renderFn) {
    this.registry.set(type, renderFn);
  }

  setFallback(renderFn) {
    this.fallback = renderFn;
  }

  render(node) {
    const Component = this.registry.get(node.type) || this.fallback;
    if (!Component) return `<!-- Unhandled: ${node.type} -->`;
    return Component(node.props || {}, (node.children || []).map(child => this.render(child)));
  }
}

const engine = new SDUIRegistry();
engine.register('Page', (props, children) => `<main class="${props.layout}">${children.join('')}</main>`);
engine.register('Hero', (props) => `<header><h1>${props.title}</h1></header>`);
engine.register('Card', (props) => `<div class="card">${props.title}: ${props.val}</div>`);
engine.setFallback((props) => `<div class="unknown-fallback">Unsupported Widget</div>`);

const payload = {
  type: 'Page',
  props: { layout: 'fluid' },
  children: [
    { type: 'Hero', props: { title: 'Real-Time Edge Desk' } },
    { type: 'Card', props: { title: 'Throughput', val: '120k req/s' } },
    { type: 'QuantumWidget', props: { id: 999 } }
  ]
};

const html = engine.render(payload);
console.log('Rendered HTML:', html);
console.log('Fallback Handled:', html.includes('Unsupported Widget'));"""

p3_say = [
    "A dynamic user interface cannot merely display static pixels; it must facilitate user interactions, trigger client-side workflows, and execute state mutations. In traditional React applications, event handling is tightly coupled: developers pass JavaScript callback functions like `onClick={() => navigate('/checkout')}` directly into JSX props. In Server-Driven UI, however, interactive behavior must be declared entirely within serialized JSON wire payloads, where raw JavaScript functions cannot exist.",
    "To solve this problem, enterprise SDUI architectures decouple event declaration from event execution through Declarative Action Payloads and Centralized Action Dispatchers. Instead of sending an executable function over HTTP, the server specifies an abstract action object containing a semantic action `type`, an input `payload`, and optional execution metadata. For example, a button node might declare an action contract: `{ type: 'NAVIGATE', payload: { route: '/checkout', trackingId: 'promo_hero_btn' } }`.",
    "On the client side, a centralized SDUI Action Dispatcher acts as an event bus and security gateway. When the user taps or clicks an interactive widget, the component does not execute business logic directly; instead, it passes the declared action object to the dispatcher. The dispatcher checks its internal registry of action handlers, validates that the user possesses appropriate session permissions, enriches the action payload with client context (such as device telemetry, geolocation, and authenticated user ID), and safely executes the registered handler.",
    "This decoupled action architecture yields immense operational advantages. First, security is airtight: because the server only emits declarative action identifiers rather than arbitrary code strings, malicious actors cannot inject unauthorized scripts via Cross-Site Scripting (XSS). The client only executes pre-approved, audited JavaScript handlers that are permanently compiled into the application binary.",
    "Second, observability and audit logging become instantaneous. Every single user interaction flows through a single centralized choke point. The dispatcher can automatically record structured analytics breadcrumbs, measure interaction-to-paint latencies, and emit audit logs to monitoring backends (such as Datadog or OpenTelemetry) without requiring manual tracking code inside individual UI components.",
    "Let us explore the implementation of a production-ready `SDUIActionDispatcher`. Notice how our dispatcher registers strongly typed action handlers, handles unrecognized actions defensively, enriches incoming payloads with ambient user session context, and logs all execution outcomes into an immutable audit trail."
]

p3_code = """class SDUIActionDispatcher {
  constructor() {
    this.handlers = new Map();
    this.auditLog = [];
  }

  register(actionType, handler) {
    this.handlers.set(actionType, handler);
  }

  dispatch(action, context = {}) {
    const handler = this.handlers.get(action.type);
    if (!handler) {
      this.auditLog.push({ type: action.type, status: 'REJECTED', reason: 'NO_HANDLER' });
      return false;
    }
    const result = handler(action.payload, context);
    this.auditLog.push({ type: action.type, status: 'EXECUTED', result });
    return true;
  }
}

const dispatcher = new SDUIActionDispatcher();
dispatcher.register('NAVIGATE', (p) => `Navigating to ${p.route}`);
dispatcher.register('MUTATE_CART', (p, ctx) => `User ${ctx.userId} added SKU ${p.sku} x${p.qty}`);

dispatcher.dispatch({ type: 'NAVIGATE', payload: { route: '/checkout' } }, { userId: 'u_101' });
dispatcher.dispatch({ type: 'MUTATE_CART', payload: { sku: 'PROD_99', qty: 2 } }, { userId: 'u_101' });
dispatcher.dispatch({ type: 'UNKNOWN_OP', payload: {} }, { userId: 'u_101' });

console.log('Dispatched Total:', dispatcher.auditLog.length);
console.log('Actions Log:', dispatcher.auditLog.map(e => `${e.type}:${e.status}`).join(', '));"""

p4_say = [
    "As Server-Driven UI applications scale, screens often require conditional visibility and dynamic state binding based on real-time client state. For example, a financial dashboard might declare that a `'HighRollerVIPBanner'` widget should only render if the user's account balance exceeds \$10,000, or a checkout button might disable itself if the user has unverified KYC credentials. If every minor state evaluation required a fresh network round-trip to the server, user interactions would feel sluggish and unacceptably delayed.",
    "To support real-time responsiveness without network latency, enterprise SDUI frameworks implement Client-Side Expression Evaluation Engines. Nodes in the JSON wire schema can declare dynamic visibility predicates, such as `visibleWhen: 'user.tier === VIP'` or `disabledWhen: 'cart.total <= 0'`. When the client runtime renders or re-renders the screen, it evaluates these expressions against ambient client state (such as React Context, Zustand stores, or Redux state) before determining whether to paint the component.",
    "A paramount architectural rule in designing expression evaluators is Zero-Vulnerability Sandbox Safety: never, under any circumstances, use `eval()` or `new Function()` to execute dynamic expressions in production. Using `eval()` exposes your web application to catastrophic Remote Code Execution (RCE) and XSS vulnerabilities, where an attacker manipulating network responses or compromised backend APIs could execute arbitrary malicious JavaScript in users' browser sessions.",
    "Instead, enterprise expression engines implement deterministic Abstract Syntax Tree (AST) tokenizers or safe regex parser interpreters. The engine parses the expression into discrete tokens—an object path (e.g. `'user.balance'`), a binary operator (e.g. `'>'`, `'==='`, `'<='`), and a literal value (e.g. `'1000'`). The engine then securely resolves the property path against ambient context and evaluates the operator using pure, sandboxed JavaScript logic.",
    "Furthermore, safe variable interpolation allows dynamic string templates inside SDUI props. A greeting banner can declare `text: 'Welcome back, ${user.name}!'`, which the template resolver interpolates without exposing string concatenation to code injection risks. By combining safe expression evaluation with recursive visibility filtering, your SDUI platform achieves rich, reactive dynamism while maintaining unyielding security guarantees.",
    "Let us examine how to implement a safe, zero-eval expression evaluator in JavaScript. Observe how our engine parses operator tokens, traverses deeply nested context paths, and filters an array of SDUI widgets based on real-time user attributes."
]

p4_code = """function evaluateExpression(expr, context) {
  const match = expr.match(/^([a-zA-Z0-9_.]+)\\s*(===|!==|>|<|>=|<=)\\s*['"]?([a-zA-Z0-9_.-]+)['"]?$/);
  if (!match) return false;
  const [_, path, op, rawVal] = match;
  
  const val = path.split('.').reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : undefined), context);
  const targetVal = isNaN(Number(rawVal)) ? rawVal : Number(rawVal);
  
  switch (op) {
    case '===': return val === targetVal;
    case '!==': return val !== targetVal;
    case '>': return Number(val) > Number(targetVal);
    case '<': return Number(val) < Number(targetVal);
    case '>=': return Number(val) >= Number(targetVal);
    case '<=': return Number(val) <= Number(targetVal);
    default: return false;
  }
}

function resolveVisibility(nodes, context) {
  return nodes.filter(node => {
    if (!node.visibleWhen) return true;
    return evaluateExpression(node.visibleWhen, context);
  });
}

const userContext = { user: { tier: 'VIP', balance: 500 } };
const widgets = [
  { id: 'w1', title: 'Public Welcome Banner' },
  { id: 'w2', title: 'VIP Exclusive Deal', visibleWhen: 'user.tier === VIP' },
  { id: 'w3', title: 'High Roller Lounge', visibleWhen: 'user.balance > 1000' }
];

const visible = resolveVisibility(widgets, userContext);
console.log('Total Widgets:', widgets.length);
console.log('Visible Widgets:', visible.map(w => w.id).join(', '));
console.log('VIP Deal Visible:', visible.some(w => w.id === 'w2'));
console.log('High Roller Visible:', visible.some(w => w.id === 'w3'));"""

p5_say = [
    "In the concluding phase of Day 54, we address production performance optimization, streaming SDUI over HTTP chunked transfer encoding, and Schema Versioning with Forward-Compatible Migration Pipelines. In large-scale enterprise deployments, multiple versions of client applications exist simultaneously in the wild: users on older native mobile apps or cached web tabs might be running Schema Version 1, while newly deployed web instances expect Schema Version 3.",
    "If your backend API blindly updates JSON schema structures without versioning policies, legacy clients will encounter unparseable prop definitions and catastrophic UI breakages. To ensure uninterrupted backwards compatibility, modern SDUI architectures mandate explicit `schemaVersion` headers and declarative Schema Migration Pipelines. When a client requests a screen, it transmits its supported schema version in the request header (`X-SDUI-Schema-Version: 2`).",
    "On the server (or in edge middleware), a schema migrator runs an automated transformation pipeline, converting modern internal schema models into legacy-compatible wire representations. Conversely, if a legacy payload is delivered to a newer client, the client-side migrator applies forward-migration transformers, renaming deprecated prop keys, reshaping nested structures, and providing default values before passing nodes to the component registry.",
    "Performance optimization is equally paramount. Because SDUI trees can grow to contain hundreds of nested nodes, serializing and deserializing massive JSON payloads in a single blocking synchronous operation can induce significant JavaScript main-thread contention. To maximize rendering speed, enterprise teams leverage Streaming SDUI. Using React Server Components and chunked HTTP streams, the server emits the root layout and above-the-fold hero widgets in the very first network chunk, allowing the browser to render critical visual elements within milliseconds. Below-the-fold sections, personalized product carousels, and complex analytical widgets stream in subsequent chunks, rendering progressively as network data arrives.",
    "Finally, continuous observability must be baked into the SDUI lifecycle. Enterprise systems track four critical Golden Signals for SDUI: Schema Deserialization Latency (p99 < 5ms), Unknown Component Rate (< 0.01%), Action Dispatch Failure Rate (< 0.001%), and Cumulative Layout Shift during progressive rendering (CLS = 0.000). Automated anomaly alerts immediately notify platform engineering if an invalid schema update causes fallback rates to spike in production.",
    "Congratulations on mastering Day 54! You have acquired the deep architectural knowledge needed to design, implement, and operate production-grade Server-Driven UI platforms. You understand how to decouple visual presentation from client release cycles, construct polymorphic component registries with resilient fallbacks, build secure declarative action dispatchers, implement zero-eval safe expression evaluators, and execute multi-version schema migration pipelines across high-scale distributed systems."
]

p5_code = """class SDUISchemaMigrator {
  constructor() {
    this.migrations = new Map();
  }

  addMigration(fromVersion, toVersion, transformFn) {
    this.migrations.set(`${fromVersion}->${toVersion}`, transformFn);
  }

  migrate(node, targetVersion) {
    let currentVersion = node.schemaVersion || 1;
    let currentNode = JSON.parse(JSON.stringify(node));
    while (currentVersion < targetVersion) {
      const nextVersion = currentVersion + 1;
      const key = `${currentVersion}->${nextVersion}`;
      const transform = this.migrations.get(key);
      if (!transform) throw new Error(`Missing migration pipeline: ${key}`);
      currentNode = transform(currentNode);
      currentNode.schemaVersion = nextVersion;
      currentVersion = nextVersion;
    }
    return currentNode;
  }
}

const migrator = new SDUISchemaMigrator();
migrator.addMigration(1, 2, (node) => ({
  ...node,
  props: { title: node.props.label, stats: { current: node.props.value } }
}));

const legacyNode = {
  type: 'StatWidget',
  schemaVersion: 1,
  props: { label: 'Active Sessions', value: 1420 }
};

const modernNode = migrator.migrate(legacyNode, 2);
console.log('Migrated Version:', modernNode.schemaVersion);
console.log('Migrated Title:', modernNode.props.title);
console.log('Migrated Stat:', modernNode.props.stats.current);"""

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
        "title": "Architecture of Server-Driven UI (SDUI) & Declarative JSON Schemas",
        "say": p1_say,
        "code": p1_code,
        "output": out1,
        "check": {
            "question": "What is the primary architectural advantage of Server-Driven UI (SDUI) in enterprise applications?",
            "options": [
                "It decouples screen layout, visual styling, and component hierarchy from native client release cycles via declarative JSON schemas",
                "It forces all UI logic to run client-side using eval() strings sent over WebSockets",
                "It eliminates the need for frontend component libraries by generating raw binary WebAssembly files on the server",
                "It requires all React components to be converted into static HTML files without client interactivity"
            ],
            "answer": 0,
            "why": "SDUI empowers backend services to dictate component layout, ordering, and attributes dynamically over JSON, eliminating client deployment bottlenecks."
        }
    },
    {
        "id": "part2",
        "title": "Dynamic Component Registry & Polymorphic Resolver with Fallbacks",
        "say": p2_say,
        "code": p2_code,
        "output": out2,
        "check": {
            "question": "How should a robust SDUI polymorphic component resolver handle an unrecognized component type emitted by the server?",
            "options": [
                "Log diagnostic telemetry and route rendering to a resilient fallback handler or safe placeholder to prevent client crashes",
                "Throw an unhandled JavaScript runtime error and abort the entire application render tree",
                "Execute an eval() statement to dynamically download arbitrary unvetted JavaScript from an external URL",
                "Silently corrupt the DOM by mounting an empty canvas element without notifying error monitors"
            ],
            "answer": 0,
            "why": "Resilient fallback boundaries ensure that experimental or unknown component types do not crash the client application."
        }
    },
    {
        "id": "part3",
        "title": "Declarative Action Dispatchers & Centralized Event Bus",
        "say": p3_say,
        "code": p3_code,
        "output": out3,
        "check": {
            "question": "Why are event handlers declared as semantic action objects (e.g. { type: 'NAVIGATE' }) rather than raw JavaScript functions in SDUI payloads?",
            "options": [
                "JSON cannot serialize executable functions, and declarative action objects prevent Cross-Site Scripting (XSS) while enabling centralized audit logging",
                "Raw functions would increase the JSON payload size by exactly 500% regardless of code length",
                "Web browsers disallow calling functions inside React components when server components are active",
                "Declarative action objects bypass the JavaScript call stack and execute directly on the GPU"
            ],
            "answer": 0,
            "why": "Declarative action objects provide airtight security by guaranteeing that only pre-audited, client-compiled handlers execute in response to user events."
        }
    },
    {
        "id": "part4",
        "title": "Safe Zero-Eval Expression Evaluation & Dynamic State Binding",
        "say": p4_say,
        "code": p4_code,
        "output": out4,
        "check": {
            "question": "Why must SDUI expression engines strictly avoid using eval() or new Function() for evaluating dynamic visibility conditions?",
            "options": [
                "Using eval() exposes the application to catastrophic Remote Code Execution (RCE) and Cross-Site Scripting (XSS) vulnerabilities",
                "eval() is completely deprecated and removed in ECMAScript 2024",
                "eval() runs 10,000 times slower than AST parsing in all modern JavaScript engines",
                "eval() forces the React component to unmount and re-mount on every single frame"
            ],
            "answer": 0,
            "why": "Sandboxed, tokenized expression evaluation ensures zero execution vulnerability while evaluating client state predicates."
        }
    },
    {
        "id": "part5",
        "title": "Streaming SDUI, Schema Versioning & Production Migration Pipelines",
        "say": p5_say,
        "code": p5_code,
        "output": out5,
        "check": {
            "question": "What is the purpose of a Schema Migration Pipeline in a high-scale SDUI infrastructure?",
            "options": [
                "To ensure backwards and forwards compatibility between legacy client applications and evolving backend JSON schema versions",
                "To automatically compress all JSON payloads into gzip archives before writing to disk",
                "To convert React JSX components into Vue.js single-file templates in production",
                "To restart edge worker instances whenever a new database migration is applied"
            ],
            "answer": 0,
            "why": "Schema migration pipelines transform payloads across schema versions, ensuring older client apps never break when backend contracts evolve."
        }
    }
]

day54_data = {
    "day": 54,
    "title": "Server-Driven UI (SDUI) & Dynamic Component Engines: JSON Wire Schemas, Component Registries & Polymorphic Rendering",
    "course": "Full-Stack React Web Development",
    "track": "Enterprise React Architecture",
    "declaredMinutes": 38,
    "projectStep": {
        "title": "Build a Resilient Polymorphic SDUI Component Engine with Safe Expression Evaluation and Schema Migration",
        "steps": [
            "Define an immutable component registry with Hero, Card, Grid, and fallback rendering handlers",
            "Implement a centralized action dispatcher with ambient context enrichment and audit logging",
            "Construct a zero-eval expression evaluator for client-side conditional visibility predicates",
            "Implement a versioned schema migration pipeline with forward and backwards transformation rules"
        ]
    },
    "parts": parts
}

# Check word counts
total_words = 0
for i, p in enumerate(parts):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"Day 54 Part {i+1}: {wc} words")
print(f"Total Day 54 Words: {total_words}")

with open('scripts/react_day54.json', 'w', encoding='utf-8') as f:
    json.dump(day54_data, f, indent=2)

with open('scripts/react_day54_data.py', 'w', encoding='utf-8') as f:
    f.write(f"DAY_54 = {json.dumps(day54_data, indent=2)}\n")

print("Generated scripts/react_day54.json and scripts/react_day54_data.py successfully!")
