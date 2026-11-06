import os
import sys
import json
import hashlib

sys.path.insert(0, os.path.abspath('scripts'))
from build_day41_file import p1_say, p2_say, p3_say, p4_say, p5_say

def sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

day41 = {
    'day': 41,
    'title': 'React Server Components (RSC): The Server-Client Boundary, Zero-Bundle-Size Dependencies & RSC Wire Format',
    'desc': 'Master the architecture of React Server Components: understand the server-client boundary, how the "use client" directive marks module boundaries, offloading massive dependencies for zero-bundle client weight, line-by-line RSC wire stream format decoding, and complete runtime simulation.',
    'minutes': 38,
    'parts': [
        {
            'title': 'The Server-Client Dichotomy: Why Client-Side Bundles Exploded and the Architectural Evolution of React Server Components',
            'say': p1_say,
            'code': """// Traditional Client vs React Server Component (RSC) Bundle Evaluation
function evaluateBundlePayload(architecture, modules) {
  let clientBundleBytes = 0;
  let serverExecutionTimeMs = 0;
  let clientHydrationCostMs = 0;

  for (const mod of modules) {
    if (architecture === 'Traditional-SSR') {
      // Traditional SSR ships 100% of module code to client for hydration
      clientBundleBytes += mod.sizeBytes;
      serverExecutionTimeMs += mod.serverCostMs;
      clientHydrationCostMs += mod.hydrationCostMs;
    } else if (architecture === 'React-Server-Components') {
      if (mod.type === 'client') {
        clientBundleBytes += mod.sizeBytes;
        clientHydrationCostMs += mod.hydrationCostMs;
      } else {
        // Server component: 0 bytes to client bundle!
        clientBundleBytes += 0;
        serverExecutionTimeMs += mod.serverCostMs;
        clientHydrationCostMs += 0;
      }
    }
  }

  return {
    architecture,
    clientBundleKb: +(clientBundleBytes / 1024).toFixed(1),
    serverExecutionTimeMs,
    clientHydrationCostMs,
    totalClientTtiScoreMs: +(clientBundleBytes / 1024 * 1.5 + clientHydrationCostMs).toFixed(1)
  };
}

const pageModules = [
  { name: 'MarkdownParser', type: 'server', sizeBytes: 384000, serverCostMs: 4, hydrationCostMs: 45 },
  { name: 'SyntaxHighlighter', type: 'server', sizeBytes: 256000, serverCostMs: 6, hydrationCostMs: 38 },
  { name: 'DateFormatter', type: 'server', sizeBytes: 78000, serverCostMs: 1, hydrationCostMs: 12 },
  { name: 'InteractiveVoteButton', type: 'client', sizeBytes: 8200, serverCostMs: 1, hydrationCostMs: 3 },
  { name: 'ExpandableComments', type: 'client', sizeBytes: 14500, serverCostMs: 2, hydrationCostMs: 5 }
];

const ssrResult = evaluateBundlePayload('Traditional-SSR', pageModules);
const rscResult = evaluateBundlePayload('React-Server-Components', pageModules);

console.log('--- ARCHITECTURAL COMPARISON: TRADITIONAL SSR VS RSC ---');
console.log('Traditional SSR Client Bundle:', ssrResult.clientBundleKb, 'KB | Hydration Cost:', ssrResult.clientHydrationCostMs, 'ms | TTI Score:', ssrResult.totalClientTtiScoreMs, 'ms');
console.log('RSC Client Bundle:', rscResult.clientBundleKb, 'KB | Hydration Cost:', rscResult.clientHydrationCostMs, 'ms | TTI Score:', rscResult.totalClientTtiScoreMs, 'ms');
const reductionPercent = (((ssrResult.clientBundleKb - rscResult.clientBundleKb) / ssrResult.clientBundleKb) * 100).toFixed(1);
console.log('Client Bundle Reduction via Zero-Bundle RSC:', reductionPercent + '%');""",
            'output': """--- ARCHITECTURAL COMPARISON: TRADITIONAL SSR VS RSC ---
Traditional SSR Client Bundle: 723.3 KB | Hydration Cost: 103 ms | TTI Score: 1188 ms
RSC Client Bundle: 22.2 KB | Hydration Cost: 8 ms | TTI Score: 41.3 ms
Client Bundle Reduction via Zero-Bundle RSC: 96.9%""",
            'codeNotes': [
                {'line': 2, 'note': 'evaluateBundlePayload simulates client payload sizes and CPU execution times.'},
                {'line': 8, 'note': 'Traditional SSR forces the client browser to download and hydrate all server modules.'},
                {'line': 16, 'note': 'Server components contribute exactly 0 bytes to the client JavaScript bundle.'},
                {'line': 44, 'note': 'Zero-bundle server offloading achieves a 96.9% reduction in client JavaScript delivery.'}
            ],
            'tryIt': 'Add a simulated heavy charting library (500KB) to pageModules as a server component and observe that client bundle size remains 22.2 KB.',
            'check': 'What is the primary difference between traditional SSR and React Server Components regarding client bundle payloads?'
        },
        {
            'title': 'The "use client" Boundary: Directive Semantics, Island Leaves vs Server Roots & Serialization Invariants',
            'say': p2_say,
            'code': """// The "use client" Serialization Boundary Guard
function validateRSCBoundaryProps(componentName, props) {
  const violations = [];
  const validProps = {};

  for (const [key, value] of Object.entries(props)) {
    const valType = typeof value;
    if (valType === 'function') {
      violations.push({ prop: key, reason: 'Functions cannot be serialized across RSC wire boundary' });
    } else if (valType === 'symbol') {
      violations.push({ prop: key, reason: 'Symbols cannot be serialized across RSC wire boundary' });
    } else if (value !== null && typeof value === 'object') {
      if (value['$$typeof'] && String(value['$$typeof']).includes('react.element')) {
        // Valid React Element / Slot passed as child
        validProps[key] = '[React.Element Slot: ' + (value.type?.name || 'anonymous') + ']';
      } else if (value.constructor && value.constructor.name !== 'Object' && value.constructor.name !== 'Array') {
        violations.push({ prop: key, reason: 'Custom class instances (' + value.constructor.name + ') cannot be serialized' });
      } else {
        validProps[key] = value;
      }
    } else {
      validProps[key] = value;
    }
  }

  const isBoundarySafe = violations.length === 0;
  return {
    componentName,
    isBoundarySafe,
    violations,
    serializedProps: isBoundarySafe ? validProps : null
  };
}

class UserSessionModel {
  constructor(id) { this.id = id; }
}

const safeProps = {
  productId: 'prod_9821',
  priceUsd: 149.99,
  inStock: true,
  tags: ['enterprise', 'hardware'],
  children: { '$$typeof': 'Symbol(react.element)', type: { name: 'ServerDescriptionSlot' }, props: {} }
};

const illegalProps = {
  productId: 'prod_9821',
  onAddToCart: function handleAdd() {},
  session: new UserSessionModel('usr_440')
};

const check1 = validateRSCBoundaryProps('AddToCartButton', safeProps);
const check2 = validateRSCBoundaryProps('AddToCartButton', illegalProps);

console.log('--- VALIDATING RSC BOUNDARY SERIALIZATION ---');
console.log('Safe Props Pass Boundary:', check1.isBoundarySafe);
console.log('Serialized Slot Passed to Client:', check1.serializedProps.children);
console.log('Illegal Props Pass Boundary:', check2.isBoundarySafe);
console.log('Detected Violations Count:', check2.violations.length);
check2.violations.forEach(v => console.log('Violation [' + v.prop + ']: ' + v.reason));""",
            'output': """--- VALIDATING RSC BOUNDARY SERIALIZATION ---
Safe Props Pass Boundary: true
Serialized Slot Passed to Client: [React.Element Slot: ServerDescriptionSlot]
Illegal Props Pass Boundary: false
Detected Violations Count: 2
Violation [onAddToCart]: Functions cannot be serialized across RSC wire boundary
Violation [session]: Custom class instances (UserSessionModel) cannot be serialized""",
            'codeNotes': [
                {'line': 2, 'note': 'validateRSCBoundaryProps checks prop types against RSC wire serialization rules.'},
                {'line': 7, 'note': 'Detects illegal functions passed across boundary (which require Server Actions).'},
                {'line': 12, 'note': 'Allows React Element slots ($$typeof) passed via component composition.'},
                {'line': 14, 'note': 'Flags custom class instances that cannot be reconstructed over plain JSON wire.'}
            ],
            'tryIt': 'Add a Date object to safeProps and observe how JSON serialization treats timestamps versus custom object instances.',
            'check': 'Why can a Server Component be passed as a child prop to a Client Component without entering the client bundle?'
        },
        {
            'title': 'Zero-Bundle-Size Heavy Dependencies: Offloading Complex Libraries Completely to the Server Runtime',
            'say': p3_say,
            'code': """// Zero-Bundle-Size Server Dependency Execution Engine
function ServerSideMarkdownRenderer(rawMarkdown) {
  // Heavy dependency runs exclusively in Node.js / Server environment
  const tokens = [];
  const lines = rawMarkdown.split('\\n');

  for (const line of lines) {
    if (line.startsWith('# ')) {
      tokens.push({ type: 'h1', content: line.slice(2).trim() });
    } else if (line.startsWith('```')) {
      tokens.push({ type: 'code_block_start', lang: line.slice(3).trim() });
    } else if (line.startsWith('- ')) {
      tokens.push({ type: 'list_item', content: line.slice(2).trim() });
    } else if (line.trim().length > 0) {
      tokens.push({ type: 'paragraph', content: line.trim() });
    }
  }

  // Generate lightweight virtual DOM element tree (zero parser code sent to client)
  const vdomTree = tokens.map((tok, idx) => {
    switch (tok.type) {
      case 'h1': return { tag: 'h1', key: idx, props: { className: 'heading-lg' }, children: tok.content };
      case 'list_item': return { tag: 'li', key: idx, props: { className: 'bullet' }, children: tok.content };
      case 'paragraph': return { tag: 'p', key: idx, props: { className: 'body-text' }, children: tok.content };
      default: return { tag: 'div', key: idx, props: {}, children: tok.content || '' };
    }
  });

  return {
    rawLengthChars: rawMarkdown.length,
    serverDependencyWeightKb: 340, // Simulated Shiki + Markdown AST parser size
    clientTransmittedBundleKb: 0,  // Zero bytes of parser shipped to browser!
    vdomNodeCount: vdomTree.length,
    vdomTree
  };
}

const doc = '# React Server Components\\n- Zero bundle size for server dependencies\\n- Direct access to server backend data\\nAutomatic code splitting at component boundaries.';
const renderResult = ServerSideMarkdownRenderer(doc);

console.log('--- ZERO-BUNDLE DEPENDENCY OFFLOADING ---');
console.log('Server Dependency Weight on Node.js:', renderResult.serverDependencyWeightKb, 'KB');
console.log('Client Shipped Dependency Bundle Weight:', renderResult.clientTransmittedBundleKb, 'KB');
console.log('Server-Rendered VDOM Nodes Created:', renderResult.vdomNodeCount);
renderResult.vdomTree.forEach(node => console.log('Rendered Node: <' + node.tag + '> ' + node.children));""",
            'output': """--- ZERO-BUNDLE DEPENDENCY OFFLOADING ---
Server Dependency Weight on Node.js: 340 KB
Client Shipped Dependency Bundle Weight: 0 KB
Server-Rendered VDOM Nodes Created: 4
Rendered Node: <h1> React Server Components
Rendered Node: <li> Zero bundle size for server dependencies
Rendered Node: <li> Direct access to server backend data
Rendered Node: <p> Automatic code splitting at component boundaries.""",
            'codeNotes': [
                {'line': 2, 'note': 'ServerSideMarkdownRenderer executes solely on the Node.js/Edge backend.'},
                {'line': 19, 'note': 'Generates pure virtual DOM element nodes ready for RSC wire streaming.'},
                {'line': 30, 'note': 'clientTransmittedBundleKb is 0 KB: dependencies do not leak to the client.'},
                {'line': 44, 'note': 'All markdown nodes render as semantic HTML elements without client-side parsing.'}
            ],
            'tryIt': 'Modify the parser to support blockquotes (lines starting with >) and verify that rendered virtual DOM nodes update cleanly.',
            'check': 'Why does moving a markdown parser to a Server Component eliminate the hydration cost on the client device?'
        },
        {
            'title': 'Deep Dive into the RSC Wire Stream Format: Line-by-Line Tokenized Serialization & Reference Resolution',
            'say': p4_say,
            'code': """// RSC Wire Format Line-by-Line Tokenized Parser
function parseRscWireStream(rawStream) {
  const lines = rawStream.trim().split('\\n');
  const modules = new Map();
  let rootElement = null;

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const type = line.slice(0, 1);
    const id = line.slice(1, colonIdx);
    const payload = JSON.parse(line.slice(colonIdx + 1));

    if (type === 'M') {
      // Client Module Reference
      modules.set(id, { moduleId: payload.id, exportName: payload.name, chunks: payload.chunks });
    } else if (type === 'J') {
      // JSON Component Element Tree
      rootElement = payload;
    }
  }

  // Resolve lazy client references ($L<id>) inside root element tree
  function resolveReferences(node) {
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) return node.map(resolveReferences);

    if (node['$'] && typeof node['$'] === 'string' && node['$'].startsWith('$L')) {
      const refId = node['$'].slice(2);
      const mod = modules.get(refId);
      return { type: 'CLIENT_COMPONENT_REF', resolvedModule: mod, props: node.props || {} };
    }

    const resolved = {};
    for (const [k, v] of Object.entries(node)) {
      resolved[k] = resolveReferences(v);
    }
    return resolved;
  }

  return {
    registeredModules: Array.from(modules.entries()).map(([k, v]) => ({ id: k, file: v.moduleId })),
    resolvedTree: resolveReferences(rootElement)
  };
}

const mockRscStream = [
  'M1:{"id":"./src/AddToCart.client.js","chunks":["chunk_42"],"name":"AddToCart"}',
  'M2:{"id":"./src/ReviewModal.client.js","chunks":["chunk_88"],"name":"ReviewModal"}',
  'J0:{"type":"div","props":{"className":"catalog-item","children":[{"$":"$L1","props":{"productId":"prod_101"}},{"$":"$L2","props":{"count":5}}]}}'
].join('\\n');

const parsed = parseRscWireStream(mockRscStream);

console.log('--- RSC WIRE STREAM PROTOCOL PARSER ---');
console.log('Registered Client Modules Count:', parsed.registeredModules.length);
parsed.registeredModules.forEach(m => console.log('Module Ref [' + m.id + ']: ' + m.file));
console.log('Root Element Type:', parsed.resolvedTree.type);
console.log('Resolved First Child:', parsed.resolvedTree.props.children[0].type, '->', parsed.resolvedTree.props.children[0].resolvedModule.moduleId);""",
            'output': """--- RSC WIRE STREAM PROTOCOL PARSER ---
Registered Client Modules Count: 2
Module Ref [1]: ./src/AddToCart.client.js
Module Ref [2]: ./src/ReviewModal.client.js
Root Element Type: div
Resolved First Child: CLIENT_COMPONENT_REF -> ./src/AddToCart.client.js""",
            'codeNotes': [
                {'line': 2, 'note': 'parseRscWireStream tokenizes line-delimited stream chunks from the HTTP response.'},
                {'line': 13, 'note': 'Processes "M" lines representing client component module manifests.'},
                {'line': 16, 'note': 'Processes "J" lines representing virtual DOM JSON element trees.'},
                {'line': 25, 'note': 'Resolves "$L" lazy module references by attaching client module definitions.'}
            ],
            'tryIt': 'Add an M3 module for a StarRating client component and embed it in the J0 children array to test multi-island parsing.',
            'check': 'What do the control characters "M" and "J" signify in the RSC wire protocol?'
        },
        {
            'title': 'Complete RSC Runtime Simulator: Virtual Server Tree Serialization & Client-Side Fiber Reconstruction',
            'say': p5_say,
            'code': """// Complete End-to-End React Server Component (RSC) Runtime Engine
function createRscEngine() {
  const clientModuleRegistry = new Map();
  let moduleCounter = 0;

  function registerClientComponent(path, componentFn) {
    moduleCounter++;
    const id = String(moduleCounter);
    clientModuleRegistry.set(id, { id, path, fn: componentFn });
    return { '$$typeof': 'react.client.reference', '$$id': id, path };
  }

  // Server Renderer: Serializes server tree to RSC Wire Format
  function renderToRscStream(serverTree) {
    const streamLines = [];
    const emittedModules = new Set();

    function serializeNode(node) {
      if (node === null || typeof node !== 'object') return node;
      if (Array.isArray(node)) return node.map(serializeNode);

      if (node['$$typeof'] === 'react.client.reference') {
        if (!emittedModules.has(node['$$id'])) {
          emittedModules.add(node['$$id']);
          const mod = clientModuleRegistry.get(node['$$id']);
          streamLines.push('M' + node['$$id'] + ':' + JSON.stringify({ id: mod.path, name: 'default' }));
        }
        return { '$': '$L' + node['$$id'], props: serializeNode(node.props || {}) };
      }

      if (typeof node.type === 'function') {
        // Execute Server Component synchronously
        const rendered = node.type(node.props);
        return serializeNode(rendered);
      }

      const serializedProps = {};
      for (const [k, v] of Object.entries(node.props || {})) {
        serializedProps[k] = serializeNode(v);
      }
      return { type: node.type, props: serializedProps };
    }

    const rootPayload = serializeNode(serverTree);
    streamLines.push('J0:' + JSON.stringify(rootPayload));
    return streamLines.join('\\n');
  }

  // Client Deserializer: Reconstructs VDOM & binds client event handlers
  function hydrateClientRsc(rscStream) {
    const lines = rscStream.trim().split('\\n');
    const modules = new Map();
    let rootJson = null;

    for (const line of lines) {
      const colon = line.indexOf(':');
      const tag = line[0];
      const id = line.slice(1, colon);
      const payload = JSON.parse(line.slice(colon + 1));
      if (tag === 'M') modules.set(id, payload);
      if (tag === 'J') rootJson = payload;
    }

    function buildClientVdom(node) {
      if (!node || typeof node !== 'object') return node;
      if (Array.isArray(node)) return node.map(buildClientVdom);

      if (node['$'] && typeof node['$'] === 'string' && node['$'].startsWith('$L')) {
        const id = node['$'].slice(2);
        const modDef = clientModuleRegistry.get(id);
        const instantiated = modDef.fn(node.props);
        return { type: 'CLIENT_ISLAND', path: modDef.path, rendered: instantiated };
      }

      const nextProps = {};
      for (const [k, v] of Object.entries(node.props || {})) {
        nextProps[k] = buildClientVdom(v);
      }
      return { type: node.type, props: nextProps };
    }

    return buildClientVdom(rootJson);
  }

  return { registerClientComponent, renderToRscStream, hydrateClientRsc };
}

const engine = createRscEngine();

// Register client interactive island
const ClientAddToCart = engine.registerClientComponent('./src/AddToCart.client.js', (props) => {
  return { tag: 'button', text: 'Add ' + props.product + ' to Cart', onClick: 'client_handler_bound' };
});

// Define Server Component
function ServerProductPage(props) {
  return {
    type: 'div',
    props: {
      className: 'product-view',
      title: props.title,
      children: [
        { type: 'h1', props: { children: props.title } },
        { '$$typeof': 'react.client.reference', '$$id': ClientAddToCart['$$id'], props: { product: props.title } }
      ]
    }
  };
}

const serverTree = { type: ServerProductPage, props: { title: 'Enterprise Server Rack' } };
const wireStream = engine.renderToRscStream(serverTree);
const clientVdom = engine.hydrateClientRsc(wireStream);

console.log('--- END-TO-END RSC RUNTIME SIMULATION ---');
console.log('Generated RSC Wire Stream:\\n' + wireStream);
console.log('Client VDOM Root Type:', clientVdom.type);
console.log('Client Island Type:', clientVdom.props.children[1].type);
console.log('Client Island Button:', clientVdom.props.children[1].rendered.text);
console.log('Client Island Handler Attached:', clientVdom.props.children[1].rendered.onClick);""",
            'output': """--- END-TO-END RSC RUNTIME SIMULATION ---
Generated RSC Wire Stream:
M1:{"id":"./src/AddToCart.client.js","name":"default"}
J0:{"type":"div","props":{"className":"product-view","title":"Enterprise Server Rack","children":[{"type":"h1","props":{"children":"Enterprise Server Rack"}},{"$":"$L1","props":{"product":"Enterprise Server Rack"}}]}}
Client VDOM Root Type: div
Client Island Type: CLIENT_ISLAND
Client Island Button: Add Enterprise Server Rack to Cart
Client Island Handler Attached: client_handler_bound""",
            'codeNotes': [
                {'line': 2, 'note': 'createRscEngine encapsulates both the server serialization and client hydration runtimes.'},
                {'line': 14, 'note': 'renderToRscStream recursively renders server components and emits RSC wire chunks.'},
                {'line': 48, 'note': 'hydrateClientRsc parses wire stream lines and reconstructs the client virtual DOM.'},
                {'line': 62, 'note': 'Resolves client island references and attaches live interactive event listeners.'}
            ],
            'tryIt': 'Add a second client island (e.g. FavoriteBookmarkButton) and verify that both islands serialize with distinct module IDs (M1, M2).',
            'check': 'How does the client deserializer reconstruct interactive event handlers without executing server component code?'
        }
    ],
    'summary': [
        'React Server Components eliminate client bundle bloat by executing strictly on the server, contributing zero bytes to the client payload.',
        'The "use client" directive marks a boundary in the module dependency graph, requiring all passed props to be strictly JSON-serializable.',
        'Heavy computational libraries (markdown parsers, syntax tokenizers) execute on the server with zero client bundle weight.',
        'The RSC Wire Stream protocol serializes trees using line-delimited control tokens: M for module manifests, J for virtual element trees, and $L for lazy client references.',
        'Client-side deserialization reconstructs virtual DOM nodes progressively, attaching interactive event handlers to client island leaves while preserving server component purity.'
    ],
    'projectStep': 'Implement the foundation of our Hybrid RSC E-Commerce Catalog by partitioning product views into server roots and client interactive leaves.'
}
