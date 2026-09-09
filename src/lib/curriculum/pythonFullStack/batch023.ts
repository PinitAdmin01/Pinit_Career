// src/lib/curriculum/pythonFullStack/batch023.ts
// Single Source of Truth for PINIT BATCH 023 (COMPLETE): Month 6 · Week 23 · Days 113–117
// Modern Vanilla JavaScript, DOM Mutation Mechanics, Event Propagation & Accessible Interactive Components
// Pedagogical Flow: UNDERSTAND (Runtime & Memory) -> APPLY (DOM Mutations & Fragments) -> BUILD (W3C Event Propagation & AbortController) -> DEBUG (Dynamic Focus & Native Dialogs) -> TRANSFER (Memory-Safe Interactive Component Engine)

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_VANILLA_JS_AND_DOM = 'comp-pfs-m6-023';

// ── DAY 113: UNDERSTAND — JavaScript Runtime Semantics, Event Loop, Memory Model & Garbage Collection ──
export const DAY_113_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w23-023',
  dayNumber: 1,
  title: 'Browser JavaScript Runtime Semantics, Event Loop, Memory Model & Garbage Collection',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b23-d113-01',
      type: 'THEORY',
      order: 1,
      title: 'JavaScript Engine Execution Architecture, Microtasks vs Macrotasks & Garbage Collection',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the single-threaded JavaScript execution model in web browsers, including the Call Stack, Event Loop, Microtask Queue vs Task Queue priority, Heap Memory allocation, Mark-and-Sweep garbage collection, and WeakMap memory safety.',
      whatItIs: 'The browser JavaScript runtime is single-threaded and runs on an event loop model. Execution consists of:\n1. Call Stack: LIFO frame stack executing synchronous JavaScript bytecode.\n2. Microtask Queue: Highest-priority FIFO queue drained completely at the end of every stack frame and before browser rendering. Sources include Promise.then/catch/finally handlers, queueMicrotask(), and MutationObserver callbacks.\n3. Task (Macrotask) Queue: Queued browser tasks executed one per event loop iteration after the microtask queue is exhausted. Sources include setTimeout, setInterval, postMessage, and I/O callbacks.\n4. Heap Memory & Garbage Collection: Dynamic object allocation managed by a generational Mark-and-Sweep collector that traces references starting from root pointers (window, active stack variables). If a detached DOM element is retained by a closure or strong Map, it cannot be collected (a detached DOM memory leak).\n5. WeakMap and WeakSet: Key-value collections where keys must be objects and are held weakly. They do not prevent garbage collection of their keys, making them ideal for associating private metadata with DOM nodes without memory leaks.',
      whyItExists: 'Enables deterministic asynchronous operations and prevents memory accumulation and UI freezes in long-running client-side web applications.',
      problemSolved: 'Eliminates elusive memory leaks, UI jank caused by task starvation, and race conditions caused by misunderstanding asynchronous queue execution order.',
      mentalModel: 'The Chef and the Kitchen Order Queue: Synchronous execution is the chef cooking orders currently on the prep board (Call Stack). When an order is completed, the chef immediately handles urgent side-notes pinned to the board (Microtasks: Promises) until none remain. Only when all urgent microtasks are empty does the chef check the external order ticket printer for the next table order (Macrotasks: setTimeout/I/O), after which the dining room lights can refresh (Rendering Opportunity).',
      realWorldUse: 'High-throughput real-time dashboards, financial terminals, document editors, and single-page applications running continuously without memory degradation.',
      commonMistakes: [
        'Assuming setTimeout(fn, 0) executes immediately; it actually yields to the macrotask queue, executing after all currently pending microtasks and subsequent event loop ticks.',
        'Storing references to DOM nodes in a standard Map or global Array, causing detached DOM elements to permanently leak in memory after being removed from the document tree.',
        'Creating unintentional closures in persistent event listeners that capture large scope contexts or parent component references.',
        'Believing microtasks and macrotasks have identical scheduling priority.',
      ],
      commonMisconceptions: [
        'JavaScript is multithreaded in the browser because async/await exists (async/await is syntactic sugar over Promises executing on the single-threaded microtask queue).',
        'Garbage collection immediately frees memory the moment an element is removed via element.remove() (GC only reclaims memory when all references from the root set are broken).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b23-d113-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Comparing Queue Priorities and Memory Leak Prevention with WeakMap',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates the exact execution order of synchronous code, microtasks, and macrotasks, followed by contrasting strong Map vs WeakMap for storing element metadata.',
      codeSnippet: `// 1. EVENT LOOP EXECUTION ORDER VERIFICATION
console.log('1. Synchronous script start');

setTimeout(() => {
  console.log('4. Macrotask (setTimeout callback)');
}, 0);

Promise.resolve().then(() => {
  console.log('2. Microtask (Promise resolution)');
});

queueMicrotask(() => {
  console.log('3. Microtask (Explicit queueMicrotask)');
});

// 2. MEMORY SAFETY: STRONG MAP VS WEAKMAP
const leakyCache = new Map();
const safeCache = new WeakMap();

function registerElementData(element, metadata) {
  // ANTI-PATTERN: leakyCache holds a strong reference to element.
  // Even if element is removed from DOM via parent.removeChild(element),
  // it CANNOT be garbage-collected as long as leakyCache exists!
  // leakyCache.set(element, metadata);

  // PRODUCTION BEST PRACTICE: WeakMap holds a weak reference to element key.
  // When element is removed from DOM and has no other root references,
  // the GC automatically reclaims the element and its metadata entry.
  safeCache.set(element, metadata);
}

const button = document.createElement('button');
registerElementData(button, { clickCount: 0, initializedAt: Date.now() });
console.log('Cached metadata:', safeCache.get(button));`,
      language: 'javascript',
      explanation: 'The synchronous console.log runs first. Next, before any macrotask can execute, the microtask queue is drained in order: the Promise handler followed by queueMicrotask. Finally, in the next event loop iteration, the setTimeout callback executes from the task queue. WeakMap ensures that DOM node keys can be collected once detached from the DOM.',
    } as ExampleBlock,
    {
      id: 'blk-b23-d113-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Auditing Async Execution Order and Eliminating Leaky DOM Caches',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Predict the exact sequential numerical console output for the mixed synchronous, microtask, and macrotask execution sequence.',
        'Refactor the LeakyComponentRegistry class from using a strong Map to a WeakMap so that destroyed DOM nodes can be reclaimed by the garbage collector.',
        'Add a verifyState(element) method that returns true if the element metadata exists in the safe registry.',
      ],
      starterArtifact: `class LeakyComponentRegistry {
  constructor() {
    // BUG: Retains permanent strong reference to DOM elements
    this.storage = new Map();
  }
  register(element, state) {
    this.storage.set(element, state);
  }
  getState(element) {
    return this.storage.get(element);
  }
}`,
      expectedOutcome: `class SafeComponentRegistry {
  constructor() {
    // FIXED: WeakMap allows GC to reclaim detached nodes automatically
    this.storage = new WeakMap();
  }
  register(element, state) {
    if (!element || typeof element !== 'object') {
      throw new TypeError('WeakMap key must be an object/element');
    }
    this.storage.set(element, Object.freeze({ ...state }));
  }
  getState(element) {
    return this.storage.get(element);
  }
  verifyState(element) {
    return this.storage.has(element);
  }
}`,
      hints: [
        'WeakMap keys must be non-null objects; attempting to pass primitive strings or numbers will throw a TypeError.',
        'WeakMap does not have a .size property or iteration methods (.forEach, .keys) because GC timing is non-deterministic.',
      ],
      targetCompetencyId: COMPETENCY_ID_VANILLA_JS_AND_DOM,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b23-d113-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Event Loop Microtasks & WeakMap Memory Safety',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which statement accurately describes the execution order and memory semantics of the browser JavaScript runtime?',
      options: [
        'Microtasks (Promise callbacks, queueMicrotask) execute after the current stack frame finishes and before any macrotasks or UI render passes; WeakMap keys are held weakly and do not prevent garbage collection of detached DOM nodes.',
        'Macrotasks (setTimeout) always take precedence over microtasks to guarantee timer accuracy, and Map automatically removes entries when DOM elements are removed from document.body.',
        'Microtasks run concurrently on a separate worker thread while synchronous code executes on the main thread.',
        'WeakMap allows string keys and exposes a .size property to count active DOM nodes without memory overhead.',
      ],
      correctIndex: 0,
      explanation: 'Per the HTML Living Standard event loop specification, microtasks queued during the current task are completely drained before the next macrotask is dequeued and before the browser runs the rendering steps. WeakMap keys must be objects and are weakly referenced, allowing the engine to reclaim detached DOM nodes even if their entry is still in the WeakMap.',
      misconceptionIdentified: 'Believing setTimeout(0) runs before Promise microtasks or that standard Map cleans up detached DOM nodes automatically.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b23-d113-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Runtime Predictability in Long-Lived Client Applications',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why understanding event loop queue priorities and garbage collection boundaries is vital when building enterprise web client software.',
      guidingQuestions: [
        'How can misunderstanding the difference between microtasks and macrotasks lead to subtle race conditions or UI frame drops?',
        'Why are detached DOM memory leaks particularly dangerous in single-page applications compared to traditional multi-page navigation architectures?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b23-d113-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 023 Reference Sheet: Event Loop & Memory Semantics',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'HTML Living Standard: Section 8.1.6 Event loops',
          url: 'https://html.spec.whatwg.org/multipage/webappapis.html#event-loops',
        },
        {
          title: 'MDN Web Docs: In-depth guide to the JavaScript Event Loop',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
        },
        {
          title: 'MDN Web Docs: WeakMap Reference',
          url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap',
        },
      ],
      documentationExtracts: [
        'WHATWG Event Loops: Each event loop has a microtask queue. When the JavaScript execution context stack becomes empty, the microtask checkpoint performs a drain of all available microtasks.',
        'ECMA-262 WeakMap: An implementation must not prevent an object that is used as a key in a WeakMap from being collected by the garbage collector once no other references exist.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 114: APPLY — DOM Tree Traversal, Mutation Mechanics, DocumentFragment & Layout Thrashing ──
export const DAY_114_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w23-023',
  dayNumber: 2,
  title: 'DOM Tree Traversal, Mutation Mechanics, DocumentFragment & Layout Thrashing',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b23-d114-01',
      type: 'THEORY',
      order: 1,
      title: 'DOM Tree Architecture, Mutation Cost, and Eliminating Layout Thrashing',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Understand the underlying structure of the Document Object Model (Node vs Element hierarchy), the mechanical cost of crossing the JS-to-C++ DOM boundary, the browser rendering pipeline, layout thrashing, and high-performance batching with DocumentFragment.',
      whatItIs: 'The DOM is a tree representation of parsed markup maintained by browser layout engines (Blink, Gecko, WebKit). Key concepts include:\n1. Node vs Element: Node is the base interface (TextNode, Comment, Element). Element represents semantic tags with attributes and layout geometry. Prefer Element traversal (children, firstElementChild, nextElementSibling) over Node traversal (childNodes, firstChild) to avoid unwanted whitespace text nodes.\n2. Live vs Static Collections: getElementsByTagName/ClassName return live HTMLCollections (mutating as the DOM changes, causing unexpected loop skips or extra traversals). querySelectorAll returns a static NodeList (a frozen snapshot unaffected by subsequent mutations).\n3. Layout Thrashing (Forced Synchronous Reflow): Occurs when JavaScript interleaves DOM mutations (writes: appendChild, style changes) with geometric property queries (reads: offsetWidth, offsetHeight, clientHeight, scrollTop, getBoundingClientRect). The browser is forced to flush pending layout calculations synchronously on the CPU before returning the read value, destroying 60fps frame budgets.\n4. DocumentFragment: A lightweight, memory-only virtual container that does not exist in the active render tree. Appending N elements into a DocumentFragment and inserting the fragment once into the live DOM incurs exactly 1 reflow instead of N reflows. When appended, only the fragment children are inserted; the fragment itself is emptied.',
      whyItExists: 'DOM mutations trigger expensive recalculate style and layout operations. Batching changes preserves rendering performance and battery life.',
      problemSolved: 'Eliminates stuttering animations, input latency, and sluggish list renders caused by repeated forced synchronous reflows.',
      mentalModel: 'The Construction Site Delivery Truck: If you need 1,000 bricks on the 10th floor, delivering them one brick at a time via the crane (direct live DOM appends) halts all other construction work 1,000 times (1,000 reflows). Loading all 1,000 bricks into a shipping pallet on the ground (DocumentFragment) and hoisting the pallet once (single DOM append) performs the entire operation in one efficient movement.',
      realWorldUse: 'High-frequency telemetry loggers, virtualized datagrids, infinite scroll lists, and data table rendering in mission-critical operations centers.',
      commonMistakes: [
        'Interleaving geometry reads (e.g. element.offsetHeight) inside loops that modify DOM styles or children, causing N layout calculations.',
        'Iterating over a live HTMLCollection while mutating the DOM, causing elements to be skipped as indexes shift dynamically.',
        'Using childNodes and assuming childNodes[0] is an element when it is actually an empty whitespace text node.',
        'Re-appending a DocumentFragment repeatedly without realizing that appending a fragment to the DOM moves its children, leaving the fragment completely empty.',
      ],
      commonMisconceptions: [
        'Modifying innerHTML is always faster than DOM methods (innerHTML destroys and recreates all descendant elements, discarding event listeners and state, and introducing XSS vectors if unsanitized).',
        'Browsers always batch DOM writes automatically (the batching is broken the instant code reads a layout-sensitive property).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b23-d114-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Batching DOM Insertions with DocumentFragment and Eliminating Layout Thrashing',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates refactoring layout-thrashing code into a clean, batched DOM mutation pipeline using DocumentFragment and separating reads from writes.',
      codeSnippet: `// ── ANTI-PATTERN: LAYOUT THRASHING (FORCED SYNCHRONOUS REFLOW) ──
function renderItemsThrashing(container, items) {
  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.textContent = item.name;
    container.appendChild(card); // WRITE: Invalidates layout

    // READ: Forces synchronous layout recalculation on EVERY iteration!
    const height = card.offsetHeight;
    if (height > 50) {
      card.classList.add('tall'); // WRITE: Invalidates layout again!
    }
  });
}

// ── PRODUCTION STANDARD: BATCHED FRAGMENT & SEPARATED READ/WRITE PASS ──
function renderItemsBatched(container, items) {
  // 1. Create offline fragment - zero live DOM reflows
  const fragment = document.createDocumentFragment();
  const cardElements = [];

  for (let i = 0; i < items.length; i++) {
    const card = document.createElement('article');
    card.className = 'item-card';
    card.textContent = items[i].name;
    fragment.appendChild(card);
    cardElements.push(card);
  }

  // 2. Single insertion to live DOM (triggers 1 layout pass)
  container.appendChild(fragment);

  // 3. Batch geometry reads together (Phase 1: Read)
  const isTallArray = cardElements.map((card) => card.offsetHeight > 50);

  // 4. Batch style writes together (Phase 2: Write)
  for (let i = 0; i < cardElements.length; i++) {
    if (isTallArray[i]) {
      cardElements[i].classList.add('tall');
    }
  }
}`,
      language: 'javascript',
      explanation: 'The batched function builds the complete DOM subtree in a DocumentFragment without touching the active rendering tree. After inserting the fragment in a single DOM append, reads (offsetHeight) are separated from subsequent writes (classList.add), preventing interleaved layout thrashing.',
    } as ExampleBlock,
    {
      id: 'blk-b23-d114-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: High-Speed Table Row Batch Renderer with DocumentFragment',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Implement a TableBatchRenderer class that takes a target <tbody> element.',
        'Implement a renderRows(records) method that constructs all <tr> and <td> elements using DocumentFragment.',
        'Ensure each row contains sanitized textContent (never raw innerHTML) and proper data attributes.',
        'Verify that container.appendChild() is called exactly once per renderRows invocation.',
      ],
      starterArtifact: `class TableBatchRenderer {
  constructor(tbodyElement) {
    this.tbody = tbodyElement;
  }
  renderRows(records) {
    // TODO: Implement batching with DocumentFragment to prevent layout thrashing
  }
}`,
      expectedOutcome: `class TableBatchRenderer {
  constructor(tbodyElement) {
    if (!tbodyElement || tbodyElement.tagName !== 'TBODY') {
      throw new Error('TableBatchRenderer requires a valid <tbody> element');
    }
    this.tbody = tbodyElement;
  }
  renderRows(records) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', String(record.id));

      const tdId = document.createElement('td');
      tdId.textContent = String(record.id);

      const tdName = document.createElement('td');
      tdName.textContent = record.name;

      const tdValue = document.createElement('td');
      tdValue.textContent = String(record.value);

      tr.appendChild(tdId);
      tr.appendChild(tdName);
      tr.appendChild(tdValue);
      fragment.appendChild(tr);
    }

    // Clear existing contents safely and perform single atomic insertion
    this.tbody.replaceChildren(fragment);
    return records.length;
  }
}`,
      hints: [
        'Use replaceChildren(fragment) to clear and append atomically in modern browsers, or empty with textContent = "" before appendChild.',
        'Always populate td.textContent rather than td.innerHTML to prevent script injection vulnerabilities.',
      ],
      targetCompetencyId: COMPETENCY_ID_VANILLA_JS_AND_DOM,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b23-d114-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Layout Thrashing & DocumentFragment Mechanics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does reading element.offsetWidth immediately after setting element.style.width inside a loop cause severe browser performance degradation?',
      options: [
        'It causes layout thrashing (forced synchronous reflow) because the browser cannot defer layout calculation; it must synchronously recompute geometry for the entire page before returning offsetWidth.',
        'It corrupts the JavaScript Call Stack and throws an uncatchable SynchronousReflowError.',
        'It causes the DOM tree to be completely serialized to HTML and re-parsed from scratch.',
        'It executes a macrotask that freezes the main thread until the next browser repaint tick.',
      ],
      correctIndex: 0,
      explanation: 'Browsers normally queue layout changes and execute them in batches before the next repaint. However, querying a layout-sensitive property like offsetWidth forces the browser to flush the layout queue immediately and synchronously recompute geometry on the CPU, severely slowing down execution when repeated in a loop.',
      misconceptionIdentified: 'Assuming the browser automatically optimizes away interleaved read/write layout queries.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b23-d114-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: The Invisible Cost of Crossing the DOM Boundary',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how minimizing DOM boundary crossings and batching mutations influences web software architecture.',
      guidingQuestions: [
        'Why do modern component libraries emphasize virtual trees or fine-grained signals to minimize DOM touches?',
        'How does using DocumentFragment allow vanilla JavaScript to achieve rendering performance competitive with major frameworks?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b23-d114-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 023 Reference Sheet: DOM Mutation & Layout Performance',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'WHATWG DOM Living Standard: DocumentFragment Interface',
          url: 'https://dom.spec.whatwg.org/#interface-documentfragment',
        },
        {
          title: 'Web.dev: Avoid Large, Complex Layouts and Layout Thrashing',
          url: 'https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing',
        },
        {
          title: 'Paul Irish: What forces layout / reflow (Comprehensive List)',
          url: 'https://gist.github.com/paulirish/5d52fb081b3570c81e3a',
        },
      ],
      documentationExtracts: [
        'WHATWG DOM: A DocumentFragment is a lightweight container that can hold a tree of nodes. Inserting a fragment into a node replaces the fragment with its child nodes in the target tree.',
        'Rendering Pipeline: Forced synchronous layout occurs when you change style on an element and then query a property that requires the browser to calculate layout geometry.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 115: BUILD — W3C Event Propagation Architecture, Delegation & Memory-Safe Teardown ──
export const DAY_115_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w23-023',
  dayNumber: 3,
  title: 'W3C Event Propagation Architecture, Delegation & Memory-Safe Teardown',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b23-d115-01',
      type: 'THEORY',
      order: 1,
      title: 'The W3C 3-Phase Event Dispatch Model, Event Delegation & AbortController Lifecycle',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the W3C DOM Level 3 Event dispatch architecture (Capture, Target, Bubble), interface-specific propagation rules, memory-efficient Event Delegation via Element.closest(), and modern leak-free lifecycle management using AbortController and AbortSignal.',
      whatItIs: 'When a DOM event occurs, the browser dispatches it in three distinct sequential phases:\n1. Capturing Phase (Event.CAPTURING_PHASE = 1): The event propagates downwards from the Window through document, html, body, and ancestors to the target parent.\n2. Target Phase (Event.AT_TARGET = 2): The event arrives at the event target (event.target).\n3. Bubbling Phase (Event.BUBBLING_PHASE = 3): The event propagates upwards from the target ancestors back to Window.\n\nKey nuances and rules:\n- event.target: The innermost element that triggered the event.\n- event.currentTarget: The element whose event listener is currently executing.\n- event.stopPropagation(): Halts propagation along the ancestor path, but allows other listeners on the SAME element to run.\n- event.stopImmediatePropagation(): Halts propagation along the ancestor path AND prevents any subsequent listeners on the current element from executing.\n\nInterface-Specific Propagation Nuances:\n- Bubbling Events: click, dblclick, mousedown/mouseup, keydown/keyup, input, change, submit, focusin, focusout.\n- Non-Bubbling Events: focus and blur DO NOT bubble (use focusin/focusout for delegation); mouseenter and mouseleave DO NOT bubble (use mouseover/mouseout for delegation, or bind directly).\n\nEvent Delegation Architecture:\nInstead of binding N separate listeners to N list items (high memory overhead, broken by dynamic DOM insertions), attach a single listener to a common static ancestor and identify the triggered action via event.target.closest(selector).\n\nMemory-Safe Lifecycle Teardown with AbortController:\nTraditional removeEventListener requires storing exact function references and options. Modern JavaScript provides addEventListener(type, handler, { signal: abortController.signal }). Calling abortController.abort() instantly and atomically detaches all listeners associated with that signal, preventing memory leaks on component unmount.',
      whyItExists: 'Provides an extensible, high-performance event notification pipeline and eliminates listener bookkeeping errors in dynamic web apps.',
      problemSolved: 'Eliminates memory leaks from orphaned event listeners, eliminates performance costs of thousands of individual listeners, and handles dynamically added children automatically.',
      mentalModel: 'The Corporate Memo Dispatch: An incoming memo travels from the CEO down through departments to the specific employee (Capturing Phase). The employee receives it (Target Phase). The confirmation receipt then travels back up through each department head to the executive office (Bubbling Phase). If a department head halts propagation, higher managers never see the confirmation. The office receptionist (Event Delegation) receives all incoming requests at the front desk and routes them by checking the badge (.closest()).',
      realWorldUse: 'Design system data tables, dynamic tabsets, dropdown menus, context menus, and interactive kanban boards.',
      commonMistakes: [
        'Attempting to delegate focus or blur events on a parent container without realizing they do not bubble (must use focusin / focusout).',
        'Attempting to delegate mouseenter or mouseleave on a parent without realizing they do not bubble (must use mouseover / mouseout or pointerenter directly).',
        'Binding anonymous arrow functions directly to addEventListener inside render methods without retaining a reference or AbortSignal, making unbinding impossible.',
        'Using event.target directly instead of event.target.closest(selector), causing failures when the user clicks an icon or bold text nested inside a button.',
      ],
      commonMisconceptions: [
        'All DOM events bubble up to window (many critical events like focus, blur, load, mouseenter do not bubble).',
        'Calling event.preventDefault() stops event propagation (preventDefault only cancels default browser actions, e.g. following a link; propagation continues uninterrupted unless stopPropagation is called).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b23-d115-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Event Delegation with Element.closest() and AbortController Teardown',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates a production-grade delegated event listener with nested element handling and clean lifecycle unbinding via AbortController.',
      codeSnippet: `class ActionToolbar {
  constructor(toolbarElement) {
    this.container = toolbarElement;
    this.abortController = new AbortController();
    this.setupListeners();
  }

  setupListeners() {
    const { signal } = this.abortController;

    // 1. Delegated click handler on parent container
    this.container.addEventListener('click', (event) => {
      // Robust delegation: match button even if user clicks nested <span> or <svg>
      const button = event.target.closest('button[data-action]');
      if (!button || !this.container.contains(button)) {
        return; // Click occurred outside an action button
      }

      const action = button.dataset.action;
      this.handleAction(action, button);
    }, { signal });

    // 2. Delegated focus tracking using focusin (since focus does NOT bubble)
    this.container.addEventListener('focusin', (event) => {
      const button = event.target.closest('button[data-action]');
      if (button && this.container.contains(button)) {
        this.container.setAttribute('data-active-action', button.dataset.action);
      }
    }, { signal });
  }

  handleAction(action, button) {
    console.log('Executed action:', action, 'on element:', button.id);
  }

  destroy() {
    // ATOMIC TEARDOWN: Detaches ALL event listeners bound with this signal
    // Zero bookkeeping of individual handler function references!
    this.abortController.abort();
    this.container.removeAttribute('data-active-action');
    console.log('ActionToolbar successfully destroyed without memory leaks');
  }
}`,
      language: 'javascript',
      explanation: 'Using event.target.closest() ensures that clicking any nested icon or markup inside the button correctly identifies the intended action. Using focusin enables delegation for keyboard focus. When destroy() is called, abortController.abort() removes all listeners atomically.',
    } as ExampleBlock,
    {
      id: 'blk-b23-d115-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Building an Accessible Delegated Tablist with AbortController',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Build a DelegatedTabList component that manages tab switching on a container element.',
        'Attach a single delegated click listener and a single keydown listener to the tablist container.',
        'Use an AbortController instance to manage the component lifecycle.',
        'Implement ArrowRight and ArrowLeft keyboard navigation for ARIA tablist compliance.',
        'Implement a destroy() method that aborts the controller signal.',
      ],
      starterArtifact: `class DelegatedTabList {
  constructor(tablistElement) {
    this.element = tablistElement;
    this.controller = new AbortController();
  }
  init() {
    // TODO: Attach delegated click and keydown listeners using this.controller.signal
  }
  destroy() {
    // TODO: Teardown listeners atomically
  }
}`,
      expectedOutcome: `class DelegatedTabList {
  constructor(tablistElement) {
    if (!tablistElement) throw new Error('Valid container required');
    this.element = tablistElement;
    this.controller = new AbortController();
    this.init();
  }

  init() {
    const { signal } = this.controller;

    // Delegated click on tabs
    this.element.addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (tab && this.element.contains(tab)) {
        this.selectTab(tab);
      }
    }, { signal });

    // Keyboard navigation (Arrow keys)
    this.element.addEventListener('keydown', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (!tab || !this.element.contains(tab)) return;

      const tabs = Array.from(this.element.querySelectorAll('[role="tab"]'));
      const currentIndex = tabs.indexOf(tab);

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % tabs.length;
        tabs[nextIndex].focus();
        this.selectTab(tabs[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        tabs[prevIndex].focus();
        this.selectTab(tabs[prevIndex]);
      }
    }, { signal });
  }

  selectTab(selectedTab) {
    const tabs = this.element.querySelectorAll('[role="tab"]');
    tabs.forEach((tab) => {
      const isCurrent = tab === selectedTab;
      tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      tab.setAttribute('tabindex', isCurrent ? '0' : '-1');
    });
  }

  destroy() {
    this.controller.abort();
  }
}`,
      hints: [
        'In ARIA tablists, the active tab has tabindex="0", while inactive tabs have tabindex="-1" (the roving tabindex pattern).',
        'Always pass { signal } to addEventListener so the browser handles unbinding automatically when signal aborts.',
      ],
      targetCompetencyId: COMPETENCY_ID_VANILLA_JS_AND_DOM,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b23-d115-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Event Bubbling vs Non-Bubbling & AbortController',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which of the following events CANNOT be delegated to a parent container via the standard bubbling phase, and what is its bubbling counterpart?',
      options: [
        'The focus event does not bubble; its bubbling counterpart is focusin.',
        'The click event does not bubble; its bubbling counterpart is pointerdown.',
        'The input event does not bubble; its bubbling counterpart is textchange.',
        'The keydown event does not bubble; its bubbling counterpart is keypress.',
      ],
      correctIndex: 0,
      explanation: 'Per the W3C DOM Events specification, the focus and blur events do not bubble up the DOM tree. To perform event delegation for focus changes, developers must use the focusin and focusout events, which do bubble.',
      misconceptionIdentified: 'Assuming focus and blur bubble like mouse clicks and form input events.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b23-d115-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Declarative Signal Teardowns vs Imperative Unbinding',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how AbortController modernizes event listener management and resource teardowns.',
      guidingQuestions: [
        'How does AbortSignal eliminate the classic bug of failed removeEventListener calls caused by mismatched anonymous function instances?',
        'How can a single AbortController coordinate teardowns across DOM listeners, fetch requests, and timers simultaneously?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b23-d115-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 023 Reference Sheet: W3C Events & AbortController',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'W3C UI Events Specification: Event dispatch and DOM event flow',
          url: 'https://www.w3.org/TR/uievents/#event-flow',
        },
        {
          title: 'MDN Web Docs: AbortController and AbortSignal',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
        },
        {
          title: 'WHATWG DOM Standard: Event dispatching',
          url: 'https://dom.spec.whatwg.org/#dispatching-events',
        },
      ],
      documentationExtracts: [
        'W3C UI Events: The event object must propagate through the capturing phase, the target phase, and the bubbling phase. Some events (e.g. focus, blur) must not participate in the bubbling phase.',
        'WHATWG DOM: An AbortController object allows communicating with an asynchronous operation and aborting it if needed, removing event listeners registered with the signal.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 116: DEBUG — Dynamic Focus Management, Native Dialogs & Accessibility Tree Synchronization ──
export const DAY_116_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w23-023',
  dayNumber: 4,
  title: 'Dynamic Focus Management, Native Dialogs & Accessibility Tree Synchronization',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b23-d116-01',
      type: 'THEORY',
      order: 1,
      title: 'Dynamic Focus Mechanics, Native <dialog> Modal Architecture vs Custom Overlays',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master sequential keyboard focus navigation, the role of tabindex values, the native browser-managed <dialog> element top layer vs custom non-dialog overlay focus traps, focus restoration, and accessibility tree state synchronization.',
      whatItIs: 'Dynamic focus management is critical for assistive technology users navigating interactive web components:\n1. Focus Sequential Navigation & tabindex:\n   - tabindex="0": Enters the natural DOM tab sequential order. Used for interactive custom widgets.\n   - tabindex="-1": Removes element from sequential tab order, but allows programmatic focus via element.focus(). Essential for focus targets and roving tabindex.\n   - Positive tabindex (e.g. tabindex="1"): ANTI-PATTERN. Breaks document tab order and disrupts user expectations.\n2. Native <dialog> Element Mechanics:\n   - dialog.showModal(): Promotes the dialog to the browser Top Layer (above all z-index stacks). The browser automatically manages modal focus trapping, restricts background interaction, renders ::backdrop, and dispatches cancel on Escape key press.\n   - dialog.show(): Opens a non-modal dialog without top layer promotion or background blocking.\n   - Focus Restoration: Best practice requires saving document.activeElement before opening and returning focus when the dialog closes.\n3. Custom Non-Dialog Overlay Surfaces (When Native <dialog> Cannot Be Used):\n   - Require manual focus trapping: trapping Tab and Shift+Tab keydown events to wrap around between first and last interactive elements.\n   - Require inert attribute on background siblings or aria-hidden="true" to prevent screen reader navigation into inactive background DOM.\n   - Must handle Escape key listener explicitly.\n4. Accessibility Tree Synchronization:\n   - Dynamic UI states must update ARIA attributes synchronously: aria-expanded for disclosure toggles, aria-selected for tabs, aria-checked for toggle switches, and aria-live="polite" / "assertive" for asynchronous notifications.',
      whyItExists: 'Prevents keyboard traps, preserves user context, and ensures screen reader users are never stranded when dynamic components open or close.',
      problemSolved: 'Eliminates lost focus bugs (focus dropping back to document.body), screen reader reading background content behind modals, and inaccessible keyboard navigation.',
      mentalModel: 'The Spotlight and the Saved Seat: Opening a modal is like shining a spotlight on a conference room while dimming the rest of the building. The participant walks in and must stay within the room until finished. When they leave, they must be guided right back to the exact chair they were sitting in before the meeting started (Focus Restoration), rather than being dumped outside in the parking lot (focus reset to document.body).',
      realWorldUse: 'Enterprise confirmation dialogs, multi-step checkout modals, accessible notification drawers, and complex workspace toolbars.',
      commonMistakes: [
        'Using positive tabindex values (tabindex="2") which fragments sequential navigation across the entire page.',
        'Forgetting to restore focus to the trigger element when a modal closes, causing screen readers to reset focus to the top of the page.',
        'Building custom <div> modals without trapping Tab key focus, allowing users to tab into invisible elements behind the modal backdrop.',
        'Failing to update aria-expanded="true/false" synchronously on disclosure buttons when DOM visibility changes.',
      ],
      commonMisconceptions: [
        'Setting CSS display: none automatically manages focus (if focused element is hidden, focus resets abruptly to body).',
        'Native <dialog> requires manual JavaScript focus loops (showModal() provides browser-managed focus trapping automatically).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b23-d116-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Native <dialog> with Automatic Focus Management vs Custom Overlay Trap',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates implementing a robust native modal with document.activeElement focus restoration, alongside a custom non-dialog overlay focus wrap-around handler.',
      codeSnippet: `// ── 1. NATIVE <dialog> MODAL (BROWSER-MANAGED TOP LAYER) ──
class NativeModalController {
  constructor(dialogElement, triggerButton) {
    this.dialog = dialogElement;
    this.trigger = triggerButton;
    this.previousActiveElement = null;

    this.trigger.addEventListener('click', () => this.open());
    this.dialog.querySelector('.close-btn').addEventListener('click', () => this.close());
    
    // Listen to native close event (triggered by form method="dialog" or Escape)
    this.dialog.addEventListener('close', () => {
      this.restoreFocus();
    });
  }

  open() {
    // 1. Remember what had focus before opening
    this.previousActiveElement = document.activeElement;
    // 2. Open natively in top layer (browser traps focus automatically!)
    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
  }

  restoreFocus() {
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
    }
  }
}

// ── 2. CUSTOM OVERLAY FOCUS TRAP (FOR NON-DIALOG SURFACES) ──
function trapFocusCustomOverlay(event, containerElement) {
  if (event.key !== 'Tab') return;

  const focusable = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;

  const firstElement = focusable[0];
  const lastElement = focusable[focusable.length - 1];

  if (event.shiftKey) {
    // Shift + Tab: wrapping from first to last
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab: wrapping from last to first
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}`,
      language: 'javascript',
      explanation: 'Native <dialog>.showModal() automatically places the element into the browser Top Layer and provides built-in keyboard focus containment. Storing previousActiveElement ensures focus returns reliably on dismissal. For custom non-dialog overlays, trapFocusCustomOverlay demonstrates the manual Tab wrap-around logic.',
    } as ExampleBlock,
    {
      id: 'blk-b23-d116-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Debugging Modal Focus Trapping and Accessibility State Desync',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Identify and fix the focus loss bug in the provided ModalDialog implementation where closing the modal resets focus to the document root.',
        'Ensure the trigger button aria-haspopup="dialog" and aria-expanded attributes remain synchronized with the modal open/close states.',
        'Implement proper Escape key listener support if closed via custom controls.',
      ],
      starterArtifact: `class BuggyModal {
  constructor(dialog, trigger) {
    this.dialog = dialog;
    this.trigger = trigger;
    this.trigger.addEventListener('click', () => {
      this.dialog.showModal(); // Bug: forgets active element & aria-expanded
    });
    this.dialog.querySelector('.close').addEventListener('click', () => {
      this.dialog.close(); // Bug: focus is lost to body
    });
  }
}`,
      expectedOutcome: `class FixedModal {
  constructor(dialog, trigger) {
    if (!dialog || !trigger) throw new Error('Dialog and trigger required');
    this.dialog = dialog;
    this.trigger = trigger;
    this.lastFocused = null;
    this.init();
  }

  init() {
    this.trigger.setAttribute('aria-haspopup', 'dialog');
    this.trigger.setAttribute('aria-expanded', 'false');

    this.trigger.addEventListener('click', () => this.open());
    
    const closeBtn = this.dialog.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    this.dialog.addEventListener('close', () => {
      this.trigger.setAttribute('aria-expanded', 'false');
      if (this.lastFocused && typeof this.lastFocused.focus === 'function') {
        this.lastFocused.focus();
      }
    });
  }

  open() {
    this.lastFocused = document.activeElement;
    this.trigger.setAttribute('aria-expanded', 'true');
    this.dialog.showModal();
  }

  close() {
    this.dialog.close();
  }
}`,
      hints: [
        'The native <dialog> fires a close event regardless of whether it was closed via dialog.close(), a form submit with method="dialog", or the Escape key.',
        'Listening to the dialog "close" event ensures focus restoration runs reliably under all dismissal vectors.',
      ],
      targetCompetencyId: COMPETENCY_ID_VANILLA_JS_AND_DOM,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b23-d116-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Dynamic Focus Trapping & Native <dialog> Top Layer',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'What is the key architectural advantage of using the native <dialog>.showModal() API over a custom <div> overlay with high CSS z-index?',
      options: [
        'showModal() automatically places the element into the browser Top Layer, provides built-in browser-managed focus containment, blocks background element interactions, and supports native Escape cancellation without custom tabindex calculations.',
        'showModal() converts all child elements into Web Workers to accelerate rendering.',
        'showModal() prevents the dialog from consuming any memory in the JavaScript heap.',
        'showModal() allows users to tab freely through background elements while keeping the dialog visually on top.',
      ],
      correctIndex: 0,
      explanation: 'The native dialog.showModal() API utilizes the browser Top Layer, which renders above all other stacking contexts and provides built-in focus trapping, keyboard dismissal (Escape), and background inertness without requiring complex JavaScript focus loops or high z-index hacks.',
      misconceptionIdentified: 'Thinking custom div overlays with z-index: 99999 are equivalent to native browser top layer modals.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b23-d116-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Platform Primitives vs Homegrown Widgets',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on the trade-offs between leveraging native browser platform primitives like <dialog> versus re-implementing custom UI components in JavaScript.',
      guidingQuestions: [
        'How does adopting native browser platform primitives reduce accessibility defect rates and bundle size?',
        'When is it still necessary to engineer custom focus management on non-dialog overlay surfaces (e.g. mega-menus, flyout drawers)?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b23-d116-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 023 Reference Sheet: Focus Management & Dialog Architecture',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'W3C ARIA Authoring Practices Guide (APG): Dialog (Modal) Pattern',
          url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
        },
        {
          title: 'HTML Living Standard: Section 4.11.1 The dialog element',
          url: 'https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element',
        },
        {
          title: 'MDN Web Docs: HTMLDialogElement.showModal()',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal',
        },
      ],
      documentationExtracts: [
        'W3C ARIA APG: When a modal dialog opens, focus moves to an element inside the dialog, and focus must be trapped inside until the dialog closes. When the dialog closes, focus must return to the element that invoked it.',
        'HTML Living Standard: The showModal() method causes the dialog element to be displayed as a modal dialog and placed in the top layer.',
      ],
    } as ReferenceBlock,
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// DAY 117: FORMATIVE ASSESSMENT — Memory-Safe Accessible Interactive Component Engine
// ═══════════════════════════════════════════════════════════════════════════════
export const DAY_117_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m6-w23-023',
  assessmentCode: 'ASM-PFS-M6-W23-023',
  title: 'Formative Assessment: Memory-Safe Accessible Interactive Component Engine',
  description: 'Architect and implement a robust vanilla JavaScript component system featuring DocumentFragment DOM mutation batching, event delegation with AbortController lifecycle teardowns, WeakMap element metadata caching, native <dialog> modal focus management, and WCAG AA accessibility tree state synchronization.',
  summary: 'Architect and implement a robust vanilla JavaScript component system featuring DocumentFragment DOM mutation batching, event delegation with AbortController lifecycle teardowns, WeakMap element metadata caching, native <dialog> modal focus management, and WCAG AA accessibility tree state synchronization.',
  difficulty: 'ADVANCED',
  type: 'PROJECT',
  mode: 'FORMATIVE',
  passingScore: 70,
  passingScorePercentage: 70,
  timeLimitMinutes: 95,
  status: 'PUBLISHED',
  version: '1.0.0',
  targetCompetencyId: COMPETENCY_ID_VANILLA_JS_AND_DOM,
  attemptPolicy: {
    maxAttempts: 3,
    cooldownMinutes: 30,
  },
  maxAttempts: 3,
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
  rubricDimensions: [
    {
      id: 'dim-b23-01',
      name: 'DOM Mutation Batching & DocumentFragment',
      weight: 0.20,
      maxPoints: 20,
      minimumPassingScore: 10,
      isMandatory: true,
      description: 'Validates that dynamic rows and components are constructed offline using DocumentFragment and appended in a single atomic insertion without interleaved layout thrashing.',
      criteria: 'Uses DocumentFragment; zero interleaved read/writes; single appendChild/replaceChildren.',
    },
    {
      id: 'dim-b23-02',
      name: 'Event Delegation & Lifecycle Teardown via AbortController',
      weight: 0.25,
      maxPoints: 25,
      minimumPassingScore: 13,
      isMandatory: true,
      description: 'Validates single-parent event delegation using Element.closest() and complete lifecycle listener cleanup via AbortController signals.',
      criteria: 'Delegation on container; handles nested targets via closest(); teardown uses abortController.abort().',
    },
    {
      id: 'dim-b23-03',
      name: 'Memory Leak Prevention & WeakMap Association',
      weight: 0.20,
      maxPoints: 20,
      description: 'Validates that component instances or element metadata are stored using WeakMap so that detached DOM nodes are freely collected by the garbage collector.',
      criteria: 'WeakMap used for element metadata; zero memory retention of detached nodes in global arrays/maps.',
    },
    {
      id: 'dim-b23-04',
      name: 'Focus Management & Native Dialog Integration',
      weight: 0.20,
      maxPoints: 20,
      description: 'Validates native <dialog>.showModal() integration, document.activeElement tracking, reliable focus restoration on dismissal, and Escape cancellation support.',
      criteria: 'Focus restored to invoking trigger; showModal() used; close event handled cleanly.',
    },
    {
      id: 'dim-b23-05',
      name: 'Defensive Input Handling & Accessibility Sync',
      weight: 0.15,
      maxPoints: 15,
      description: 'Validates textContent sanitization against XSS, synchronous aria-expanded/aria-selected updates, and proper keyboard navigation.',
      criteria: 'Zero innerHTML injection vulnerabilities; ARIA states accurately mirror DOM state.',
    },
  ],
  items: [
    {
      id: 'item-b23-d117-01',
      type: 'PROJECT',
      title: 'Memory-Safe Accessible Interactive Component Engine',
      description: 'Construct a production-grade vanilla JavaScript component engine managing interactive datatables and modals with zero memory leaks and complete accessibility conformance.',
      prompt: 'Implement the InteractiveDataEngine class according to the technical specifications. The engine must support batched rendering with DocumentFragment, delegated event handling with AbortController, WeakMap metadata caching, and focus-restoring native dialogs.',
      starterCode: `class InteractiveDataEngine {
  constructor(container, dialogElement) {
    this.container = container;
    this.dialog = dialogElement;
    // TODO: Initialize AbortController, WeakMap metadata storage, and state
  }

  renderRecords(records) {
    // TODO: Build and insert records using DocumentFragment
  }

  setupDelegatedEvents() {
    // TODO: Set up delegated click and focusin handlers with AbortSignal
  }

  openRecordModal(recordId, triggerElement) {
    // TODO: Show native dialog and manage focus restoration
  }

  destroy() {
    // TODO: Teardown all listeners and clean up state atomically
  }
}`,
      rubricDimensions: [],
      testCases: [
        {
          name: 'test_document_fragment_batching',
          assertion: 'assert(engine.renderRecords(sampleRecords) === sampleRecords.length)',
          points: 20,
          tier: 'BASIC',
        },
        {
          name: 'test_event_delegation_and_abort_controller',
          assertion: 'assert(engine.controller instanceof AbortController and engine.controller.signal.aborted === false)',
          points: 25,
          tier: 'INTERMEDIATE',
        },
        {
          name: 'test_weakmap_metadata_storage',
          assertion: 'assert(engine.metadataStore instanceof WeakMap)',
          points: 20,
          tier: 'INTERMEDIATE',
        },
        {
          name: 'test_focus_restoration_on_dialog_close',
          assertion: 'assert(typeof engine.restoreFocus === "function")',
          points: 20,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_atomic_lifecycle_teardown',
          assertion: 'assert(engine.destroy() !== undefined and engine.controller.signal.aborted === true)',
          points: 15,
          tier: 'INTEGRITY',
        },
      ],
    },
  ],
};

export const DAY_117_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w23-023',
  dayNumber: 5,
  title: 'Formative Assessment: Memory-Safe Accessible Interactive Component Engine',
  pedagogicalIntent: 'TRANSFER',
  assessmentId: 'asm-pfs-m6-w23-023',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b23-d117-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Memory-Safe Accessible Interactive Component Engine',
      estimatedMinutes: 75,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_VANILLA_JS_AND_DOM,
      unfamiliarDomainContext: 'High-Frequency Financial Trading & Risk Execution Workspace',
      task: 'Architect and implement a production-grade vanilla JavaScript component engine that dynamically renders telemetry records with DocumentFragment, handles actions via event delegation, prevents memory leaks with WeakMap, and manages native <dialog> modals with focus preservation.',
      constraints: [
        'Must use DocumentFragment for all multi-node DOM insertions.',
        'Must use single-parent event delegation with Element.closest() instead of attaching listeners to individual rows.',
        'Must use AbortController and signal for all event listeners to ensure leak-free teardown.',
        'Must store row-specific metadata in a WeakMap keyed by HTMLTableRowElement.',
        'Must restore focus to the invoking element when the detail modal is closed.',
        'Zero third-party libraries or frameworks; strict ES2024 vanilla JavaScript.',
      ],
      timeExpectationMinutes: 75,
      difficulty: 'ADVANCED',
    } as TransferChallengeBlock,
    {
      id: 'blk-b23-d117-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Knowledge Check: Vanilla JavaScript Component Architecture & Runtime Hygiene',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which combination of engineering practices guarantees that a high-frequency dynamic UI component does not introduce memory leaks or layout thrashing?',
      options: [
        'Batching DOM writes with DocumentFragment, storing element metadata in a WeakMap, delegating events on a common ancestor, and unbinding all listeners atomically via AbortController.',
        'Using innerHTML loops for instant updates, caching DOM elements in a global Array, and using setTimeout(fn, 100) to clear references.',
        'Using document.write() with synchronous XMLHttpRequest and window.gc() calls.',
        'Binding direct inline onclick handlers to every button and keeping window.activeModals as a global Map.',
      ],
      correctIndex: 0,
      explanation: 'DocumentFragment isolates mutations to offline memory, WeakMap ensures detached DOM nodes are reclaimed by the garbage collector, event delegation minimizes listener overhead, and AbortController ensures clean, leak-free teardown on component unmount.',
      misconceptionIdentified: 'Believing manual listener tracking or innerHTML concatenation is sufficient for high-frequency dynamic web components.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b23-d117-03',
      type: 'REFLECTION',
      order: 3,
      title: 'Batch 023 Engineering Retrospective: Mastering the Foundations Before Frameworks',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how deep mastery of the browser event loop, DOM mutation mechanics, and W3C event propagation elevates your engineering capability when later working with high-level web frameworks like React, Vue, or Django.',
      guidingQuestions: [
        'How does understanding browser rendering mechanics help you diagnose and eliminate performance bottlenecks that frameworks conceal?',
        'Why does mastery of native event delegation and platform primitives (like <dialog>) make you a more versatile software engineer across any technology stack?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b23-d117-04',
      type: 'REFERENCE',
      order: 4,
      title: 'Batch 023 Reference Sheet: Vanilla JavaScript DOM & Event Architecture Standards',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'WHATWG DOM Specification: Complete Standard',
          url: 'https://dom.spec.whatwg.org/',
        },
        {
          title: 'MDN Web Docs: Introduction to the DOM',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
        },
        {
          title: 'W3C Web Content Accessibility Guidelines (WCAG) 2.2 AA',
          url: 'https://www.w3.org/TR/WCAG22/',
        },
      ],
      documentationExtracts: [
        'WHATWG DOM: An event listener can be registered with an AbortSignal. When the signal aborts, the event listener is automatically removed from the event target.',
        'MDN WeakMap: WeakMap allows you to associate data with objects in a way that doesn’t prevent the key objects from being collected if they are otherwise unreferenced.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 023 MANIFEST (COMPLETE 5-DAY BATCH) ──
export const BATCH_023_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m6-w23-023',
  batchCode: 'P2-M6-W23-BATCH023',
  title: 'Modern Vanilla JavaScript, DOM Mutation Mechanics, Event Propagation & Accessible Interactive Components',
  difficulty: 'ADVANCED',
  days: [
    DAY_113_MANIFEST,
    DAY_114_MANIFEST,
    DAY_115_MANIFEST,
    DAY_116_MANIFEST,
    DAY_117_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
};
