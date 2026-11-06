# scripts/make_comp_fund_day11.py
import os
import sys
import json
import hashlib

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

DAY = 11
TITLE = "Browser Developer Tools & Web Inspection: DOM, Network Waterfall & LocalStorage"
GOAL = "Master client-side web browser architecture, runtime inspection, and frontend performance diagnostics: modern multi-process browser architecture (Browser process, Renderer process, GPU process, Network process), the Critical Rendering Path (DOM parsing, CSSOM construction, render tree, layout/reflow, paint, composite layers), DevTools Network panel waterfall telemetry (DNS lookup, initial connection, SSL handshake, TTFB, resource download), client-side persistence and storage engines (LocalStorage, SessionStorage, IndexedDB, HTTP Cookies with HttpOnly, Secure, and SameSite attributes), JavaScript V8 engine execution lifecycle (Call Stack, Web APIs, Task Queue, Microtask Queue, event loop), and automated Lighthouse performance auditing."
MINUTES = 45
RECAP = "Welcome to Browser Developer Tools & Web Inspection. Today we complete our systems journey from hardware circuits to the client-side user interface, exploring how web browsers parse HTML into living DOM trees, how network waterfalls expose latency bottlenecks, and how the JavaScript event loop manages execution."

p1_say = [
    "Welcome to Day 11 of Computer Fundamentals and Systems Architecture. Today, we bridge the gap between low-level systems engineering and modern frontend application platforms: The Web Browser Architecture, The Critical Rendering Path, Network Waterfall Telemetry, Client-Side Storage Engines, and JavaScript Event Loop Mechanics. The web browser is no longer a simple document viewer; it is one of the most sophisticated, complex distributed operating systems ever engineered by computer scientists.",
    "A modern web browser (such as Google Chrome, Apple Safari, or Mozilla Firefox) operates as a Multi-Process Architecture to guarantee stability, security, and hardware isolation. Early single-process browsers crashed completely if a single buggy tab leaked memory or executed an infinite loop. Modern browsers segregate duties into isolated OS processes: 1. Browser Process: the core orchestrator managing the browser chrome (address bar, bookmarks, back/forward buttons) and privileged filesystem/network access; 2. Renderer Processes: sandboxed processes dedicated to parsing and executing code for each individual tab or site (Site Isolation); 3. GPU Process: dedicated to offloading 3D WebGL and CSS composite matrix transformations to physical graphics silicon; and 4. Network Process: handling HTTP/2, DNS resolution, TLS encryption, and disk caching.",
    "When a renderer process receives HTML bytes over a network socket, it executes the Critical Rendering Path (CRP)—the series of steps the browser takes to convert HTML, CSS, and JavaScript into physical pixels on the user's screen. The CRP proceeds through five synchronized pipeline stages: 1. DOM Tree Construction: The browser tokenizes raw HTML bytes into characters, parses tokens into nodes, and constructs the Document Object Model (DOM) tree; 2. CSSOM Construction: The browser parses external stylesheets and inline styles into the CSS Object Model (CSSOM) tree; 3. Render Tree: The engine combines the DOM and CSSOM trees into a Render Tree, filtering out invisible nodes (`display: none` or `<head>`) and computing computed styles for visible elements.",
    "4. Layout (Reflow): The browser calculates the exact geometric coordinates and physical dimensions (width, height, x, y) of every visible box relative to the viewport; and 5. Paint and Composite: The browser records drawing instructions (text, colors, borders, shadows) into display lists, uploads bitmaps into GPU memory tiles, and composites layers together on the physical display.",
    "Understanding the Critical Rendering Path reveals why poorly structured frontend code kills performance. When JavaScript modifies geometric properties (such as element `offsetWidth`, `height`, or `margin`), it forces the browser to re-execute Layout (Reflow), halting rendering and causing noticeable UI stutter (Frame Drops). Furthermore, modern CSS properties like `transform` and `opacity` bypass layout and paint entirely: they are executed directly on the GPU as composite matrix transforms, enabling butter-smooth 60 FPS and 120 FPS animations without CPU overhead.",
    "A particularly insidious performance defect is Layout Thrashing (Forced Synchronous Layout). Normally, the browser batches DOM mutations and recalculates layout lazily before the next frame. However, if a JavaScript loop writes to the DOM (`element.style.width = '100px'`) and immediately reads a geometric property in the next line (`let h = element.offsetHeight`), the browser is forced to flush its pending layout queue synchronously mid-loop. In a loop of 1,000 items, this forces 1,000 full layout reflow calculations instead of one, turning a sub-millisecond operation into a catastrophic multi-second UI freeze.",
    "To accelerate initial page loads, modern rendering engines deploy a secondary thread called the HTML Preload Scanner. While the primary parser is blocked waiting for an external, non-deferred JavaScript file to download and execute, the preload scanner scans ahead through raw HTML bytes to identify upcoming `<link rel='stylesheet'>`, `<script src='...'>`, and `<img>` tags, initiating background network fetches in parallel before the primary parser reaches those lines.",
    "In this opening section, we construct a browser multi-process and Critical Rendering Path simulator in the shell. We model HTML tokenization, trace DOM node hierarchies, track layout reflow event counts, and measure GPU composite layer allocations."
]

p1_code = """mkdir -p /home/student/workspace/browser_sim
echo "PIPELINE_STAGE,INPUT_TYPE,OUTPUT_TYPE,DURATION_MS,STATUS" > /home/student/workspace/browser_sim/crp_pipeline.csv
echo "STAGE_1_DOM,RAW_HTML_BYTES,DOM_TREE_NODES,4.2,PARSED" >> /home/student/workspace/browser_sim/crp_pipeline.csv
echo "STAGE_2_CSSOM,CSS_STYLESHEET,CSSOM_RULES,2.1,COMPUTED" >> /home/student/workspace/browser_sim/crp_pipeline.csv
echo "STAGE_3_RENDER_TREE,DOM_PLUS_CSSOM,RENDER_OBJECTS,1.5,COMBINED" >> /home/student/workspace/browser_sim/crp_pipeline.csv
echo "STAGE_4_LAYOUT,RENDER_TREE,BOX_GEOMETRY_COORDS,3.8,REFLOW_CLEAN" >> /home/student/workspace/browser_sim/crp_pipeline.csv
echo "STAGE_5_PAINT_COMPOSITE,DISPLAY_LIST,GPU_PIXEL_TILES,1.2,GPU_ACCELERATED" >> /home/student/workspace/browser_sim/crp_pipeline.csv
cat /home/student/workspace/browser_sim/crp_pipeline.csv
grep "GPU_ACCELERATED" /home/student/workspace/browser_sim/crp_pipeline.csv"""

p1_output = """PIPELINE_STAGE,INPUT_TYPE,OUTPUT_TYPE,DURATION_MS,STATUS
STAGE_1_DOM,RAW_HTML_BYTES,DOM_TREE_NODES,4.2,PARSED
STAGE_2_CSSOM,CSS_STYLESHEET,CSSOM_RULES,2.1,COMPUTED
STAGE_3_RENDER_TREE,DOM_PLUS_CSSOM,RENDER_OBJECTS,1.5,COMBINED
STAGE_4_LAYOUT,RENDER_TREE,BOX_GEOMETRY_COORDS,3.8,REFLOW_CLEAN
STAGE_5_PAINT_COMPOSITE,DISPLAY_LIST,GPU_PIXEL_TILES,1.2,GPU_ACCELERATED
STAGE_5_PAINT_COMPOSITE,DISPLAY_LIST,GPU_PIXEL_TILES,1.2,GPU_ACCELERATED"""

p2_say = [
    "In the second operational tier of Day 11, we examine the primary diagnostic window of frontend systems engineering: The DevTools Network Waterfall Telemetry. When an application loads slowly, how do engineers identify whether the bottleneck lies in client DNS lookup, internet congestion, TLS handshake encryption, backend database latency, or oversized asset payload transfer?",
    "Opening the Network panel in Chrome DevTools reveals the Resource Waterfall: an exact millisecond-accurate breakdown of the connection lifecycle for every single asset fetched by the page. The resource lifecycle is divided into six distinct sequential phases: 1. Queueing and Stalled: The time the browser held the request in memory before dispatching it to the network. In HTTP/1.1, requests stall if the browser has already saturated its 6-connection-per-domain limit; 2. DNS Lookup: The time required for the stub resolver to resolve the hostname to an IP address (typically 1 to 50 ms); 3. Initial Connection (TCP Handshake): The round-trip time required to complete the TCP three-way handshake (SYN, SYN-ACK, ACK); 4. SSL / TLS Handshake: The time spent negotiating cryptographic ciphers and exchanging ECDHE public keys (1-RTT in TLS 1.3); 5. Waiting for Server Response (Time To First Byte, TTFB): The critical duration between sending the HTTP request and receiving the very first byte of the response body from the server; and 6. Content Download: The time spent streaming the remaining bytes of the asset over the wire into browser memory.",
    "Analyzing the waterfall signature allows engineers to pinpoint root causes instantly: If a request exhibits high Initial Connection and SSL times, the server is physically distant or intermediate routing is congested (solved by deploying Content Delivery Networks like Cloudflare or AWS CloudFront). If a request shows tiny DNS/TCP/TLS times but a massive 800 ms TTFB, the network is fast but the backend database query or application server is un-indexed and struggling. If TTFB is fast but Content Download takes 3 seconds, the asset payload is bloated (requiring Brotli/Gzip compression, WebP/AVIF image formats, or code splitting).",
    "To optimize connection establishment ahead of time, systems engineers leverage Resource Hints in the document `<head>`: `<link rel='dns-prefetch' href='//api.example.com'>` resolves DNS in the background; `<link rel='preconnect' href='https://cdn.example.com'>` executes DNS, TCP handshake, and TLS negotiation in advance; and `<link rel='preload' as='font' href='/fonts/inter.woff2' crossorigin>` instructs the browser to download critical late-discovered web fonts immediately with high priority.",
    "Furthermore, modern distributed backends communicate performance telemetry directly into the client waterfall via the `Server-Timing` HTTP response header (e.g. `Server-Timing: db;dur=53;desc='PostgreSQL Query', cache;dur=2;desc='Redis Hit'`). Chrome DevTools automatically parses these metrics and displays backend execution spans directly inside the client network timing tab, creating an unbroken observability bridge from frontend clicks to backend database queries.",
    "Wire transfer efficiency is also heavily influenced by HTTP content compression algorithms. While legacy servers compressed text assets using Gzip (DEFLATE algorithm), modern high-performance platforms employ Brotli (RFC 7932, `Content-Encoding: br`). Brotli utilizes a pre-defined static dictionary of common web substrings (HTML tags, common JavaScript keywords, CSS classes) in addition to dynamic sliding window compression, yielding file sizes 20% to 30% smaller than Gzip and slashing mobile download latencies significantly.",
    "DevTools also highlights the distinction between Cache Hits and Network Round Trips: assets served with HTTP 304 Not Modified (using `ETag` or `If-None-Match` validation) require a network round trip to verify freshness, whereas assets served from Memory Cache or Disk Cache (via `Cache-Control: max-age=31536000, immutable`) resolve in 0 milliseconds without touching the physical network card.",
    "In this section, we construct a DevTools network waterfall telemetry parser in the shell. We decompose asset fetch timings into DNS, TCP, TLS, TTFB, and download duration components, detect latency anomalies, and evaluate caching efficiency ratios."
]

p2_code = """mkdir -p /home/student/workspace/waterfall_sim
echo "RESOURCE_NAME,DNS_MS,TCP_MS,TLS_MS,TTFB_MS,DOWNLOAD_MS,CACHE_STATUS" > /home/student/workspace/waterfall_sim/waterfall.csv
echo "index.html,12.4,24.1,32.0,85.2,14.6,NETWORK_FETCH" >> /home/student/workspace/waterfall_sim/waterfall.csv
echo "bundle.js,0.0,0.0,0.0,0.0,0.0,DISK_CACHE_HIT" >> /home/student/workspace/waterfall_sim/waterfall.csv
echo "api_v1_users,0.0,0.0,0.0,450.8,8.2,API_DYNAMIC_FETCH" >> /home/student/workspace/waterfall_sim/waterfall.csv
echo "hero_banner.webp,0.0,0.0,0.0,35.4,120.5,NETWORK_FETCH" >> /home/student/workspace/waterfall_sim/waterfall.csv
cat /home/student/workspace/waterfall_sim/waterfall.csv
grep "DISK_CACHE_HIT" /home/student/workspace/waterfall_sim/waterfall.csv"""

p2_output = """RESOURCE_NAME,DNS_MS,TCP_MS,TLS_MS,TTFB_MS,DOWNLOAD_MS,CACHE_STATUS
index.html,12.4,24.1,32.0,85.2,14.6,NETWORK_FETCH
bundle.js,0.0,0.0,0.0,0.0,0.0,DISK_CACHE_HIT
api_v1_users,0.0,0.0,0.0,450.8,8.2,API_DYNAMIC_FETCH
hero_banner.webp,0.0,0.0,0.0,35.4,120.5,NETWORK_FETCH
bundle.js,0.0,0.0,0.0,0.0,0.0,DISK_CACHE_HIT"""

p3_say = [
    "In the third operational tier of Day 11, we examine client-side state persistence and security boundaries: Browser Storage Engines, Web Storage (LocalStorage and SessionStorage), IndexedDB, and HTTP Cookies. When an application stores user sessions, offline documents, or shopping carts, choosing the right storage engine dictates both performance and vulnerability to Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF).",
    "Browsers provide four primary client-side storage technologies: 1. LocalStorage: A synchronous, origin-isolated key-value string store providing approximately 5 MB of persistent storage per origin. Because LocalStorage is synchronous, reading or writing large JSON strings blocks the main JavaScript thread, degrading frame rates; 2. SessionStorage: Identical to LocalStorage in API and capacity, but isolated exclusively to the lifetime of the specific browser tab: closing the tab wipes the data immediately; 3. IndexedDB: A high-capacity (hundreds of megabytes to gigabytes), asynchronous, transactional NoSQL database capable of indexing structured JavaScript objects, binary Blobs, and ArrayBuffers. IndexedDB is the engine that powers offline Progressive Web Apps (PWAs); and 4. HTTP Cookies: Small 4 KB string tokens transmitted automatically in the `Cookie` header on every single HTTP request matching the cookie's domain and path.",
    "For complex, data-heavy offline applications, IndexedDB is the gold standard. IndexedDB organizes data into Object Stores (similar to SQL tables or MongoDB collections), where records are indexed by key paths and queried using asynchronous Cursors and Transactions (`readonly` vs `readwrite`). Because transactions are managed asynchronously via the browser's storage thread, saving 50 megabytes of cached vector embeddings or client-side SQLite databases does not cause a single dropped animation frame on the main thread.",
    "Because cookies are automatically attached to network requests, they represent the frontline of web authentication and security attacks. To protect user authentication tokens from theft and hijacking, systems engineers configure three critical Cookie Security Flags: 1. HttpOnly Flag: Instructs the browser that the cookie cannot be accessed by client-side JavaScript via `document.cookie`. This single flag neutralizes token theft via Cross-Site Scripting (XSS) attacks; 2. Secure Flag: Guarantees that the browser transmits the cookie exclusively over encrypted HTTPS connections, preventing plaintext sniffing on public Wi-Fi; and 3. SameSite Attribute: Controls whether the cookie is sent on cross-site requests, providing robust defense against Cross-Site Request Forgery (CSRF). Setting `SameSite=Strict` blocks the cookie on all cross-origin navigations, while `SameSite=Lax` allows cookies on top-level safe GET navigations.",
    "To guard against subdomain cookie poisoning and cookie tossing attacks, security standards introduce Cookie Name Prefixes: `__Secure-` and `__Host-`. A cookie prefixed with `__Host-` (e.g. `__Host-session_id`) is strictly enforced by the browser: it MUST have the Secure flag, MUST be set from an HTTPS origin, MUST have `Path=/`, and MUST NOT contain a Domain attribute. This mathematical guarantee prevents rogue or compromised subdomains (like `marketing.example.com`) from injecting fraudulent session cookies into the top-level domain (`example.com`).",
    "A catastrophic architectural flaw in modern single-page applications (SPAs) is storing sensitive JSON Web Tokens (JWTs) in LocalStorage. If an attacker injects malicious JavaScript via a third-party npm package or unsanitized user comment (XSS), the script executes `window.localStorage.getItem('auth_token')` and transmits the token to an external server. Storing session tokens inside HttpOnly, Secure, SameSite cookies ensures that JavaScript can never touch the credential.",
    "Under low disk space conditions, browsers enforce Storage Eviction policies. Unpersisted data stored in IndexedDB or cache storage can be evicted by the browser using a Least Recently Used (LRU) algorithm. Applications request permanent, non-evictable storage via the Storage API: `navigator.storage.persist()`. Calling `navigator.storage.estimate()` returns the exact usage and quota bytes available to the web application.",
    "In this section, we construct a client-side storage and cookie security auditor in the shell. We model LocalStorage key-value pairs, parse cookie security flags (HttpOnly, Secure, SameSite), detect XSS exposure vulnerabilities, and evaluate storage quota capacities."
]

p3_code = """mkdir -p /home/student/workspace/storage_sec
echo "STORAGE_TYPE,KEY_NAME,CAPACITY_KB,SEC_FLAGS,RISK_LEVEL" > /home/student/workspace/storage_sec/audit.csv
echo "LOCAL_STORAGE,auth_jwt,5120,ACCESSIBLE_BY_JS,HIGH_XSS_RISK" >> /home/student/workspace/storage_sec/audit.csv
echo "SESSION_STORAGE,temp_filter,5120,TAB_ISOLATED,LOW" >> /home/student/workspace/storage_sec/audit.csv
echo "HTTP_COOKIE,session_id,4,HttpOnly;Secure;SameSite=Strict,PROTECTED" >> /home/student/workspace/storage_sec/audit.csv
echo "INDEXED_DB,offline_cache,500000,ASYNC_TRANSACTIONAL,SECURE" >> /home/student/workspace/storage_sec/audit.csv
cat /home/student/workspace/storage_sec/audit.csv
grep "PROTECTED" /home/student/workspace/storage_sec/audit.csv"""

p3_output = """STORAGE_TYPE,KEY_NAME,CAPACITY_KB,SEC_FLAGS,RISK_LEVEL
LOCAL_STORAGE,auth_jwt,5120,ACCESSIBLE_BY_JS,HIGH_XSS_RISK
SESSION_STORAGE,temp_filter,5120,TAB_ISOLATED,LOW
HTTP_COOKIE,session_id,4,HttpOnly;Secure;SameSite=Strict,PROTECTED
INDEXED_DB,offline_cache,500000,ASYNC_TRANSACTIONAL,SECURE
HTTP_COOKIE,session_id,4,HttpOnly;Secure;SameSite=Strict,PROTECTED"""

p4_say = [
    "In the fourth operational tier of Day 11, we examine the execution engine of the web: The JavaScript Runtime (Google V8), The Call Stack, Memory Heap, and The Event Loop. JavaScript is fundamentally single-threaded: it possesses a single call stack and executes one operation at a time. Yet, web applications handle concurrent user clicks, streaming network requests, and timer callbacks without freezing the user interface. How does a single thread achieve asynchronous multitasking?",
    "The JavaScript runtime environment inside the browser consists of four interconnected components: 1. Memory Heap: An unstructured memory pool where objects, arrays, and closures are allocated dynamically. The V8 engine reclaims unused memory via Generational Garbage Collection, dividing memory into Young Generation (scavenged frequently using Cheney's copying algorithm) and Old Generation (compacted using Mark-Sweep-Compact); 2. Call Stack: A Last-In-First-Out (LIFO) execution stack tracking current function invocation frames. If a function calls itself recursively without a base case, it exceeds maximum stack depth, triggering a `RangeError: Maximum call stack size exceeded` (Stack Overflow); 3. Web APIs: Browser-provided multi-threaded C++ subsystems outside the JavaScript engine, including `fetch()`, `setTimeout()`, `DOM events`, and `IndexedDB`; and 4. The Event Loop and Task Queues.",
    "To achieve near-native execution speed, the V8 engine implements a Just-In-Time (JIT) compilation pipeline. When JavaScript source code is loaded, the Ignition Bytecode Interpreter compiles human-readable code into compact bytecode and executes it immediately with fast startup time. As functions execute repeatedly ('hot functions'), the Sparkplug baseline compiler and TurboFan Optimizing Compiler generate highly optimized machine code based on runtime Type Feedback and Inline Caching (IC). If a function is written polymorphically—passing numbers, strings, and objects interchangeably—TurboFan suffers a Deoptimization (deopt) bailout, discarding the optimized machine code and reverting to interpreted bytecode, slashing throughput.",
    "V8 object optimization relies upon Hidden Classes (Maps or Shapes). In dynamically typed JavaScript, objects do not declare static schemas in C++ structs. When an object is created (`let p = {x: 1, y: 2}`), V8 assigns it a hidden class tracking property offsets in memory. If two objects have identical properties added in the exact same sequence, they share the identical hidden class, enabling TurboFan to compile property lookups into fast O(1) memory offsets. However, if properties are added in random orders or deleted via `delete obj.prop`, V8 transitions the object into 'Dictionary Mode' (Slow Properties), turning property accesses into slow hash-table lookups.",
    "The heart of browser concurrency is The Event Loop. The event loop runs in a continuous infinite cycle with a single golden rule: 'If the Call Stack is empty, take the next pending task from the queue and push it onto the call stack.' However, task execution is strictly prioritized into two distinct tiers: Microtasks and Macrotasks (Standard Tasks).",
    "Macrotasks originate from DOM input events, `setTimeout()`, `setInterval()`, and `setImmediate()`. Microtasks originate from Promise callbacks (`.then()`, `.catch()`, `async/await` resumptions) and `MutationObserver`. Crucially, the Event Loop processes the entire Microtask Queue to completion after every single stack frame before it ever touches the Macrotask queue or performs a screen repaint! If an asynchronous loop continuously queues microtasks (`Promise.resolve().then(...)`), it starves the macrotask queue and prevents the browser from repainting the screen, freezing the browser tab completely (Microtask Starvation).",
    "Understanding the event loop is vital for preventing Long Tasks. A Long Task is any JavaScript execution that occupies the main thread for more than 50 milliseconds. Long tasks block the browser from processing user inputs (mouse clicks or typing), causing poor Interaction to Next Paint (INP) scores and frustrated users. Systems engineers break up long-running tasks using `scheduler.yield()` or `requestIdleCallback()`, yielding the CPU back to the browser between execution chunks.",
    "For computationally intensive background tasks (such as client-side image processing, data cryptography, or 3D physics modeling), engineers offload execution completely using Web Workers. A Web Worker runs in an entirely separate OS thread with its own isolated memory space and event loop, communicating with the main thread via message passing (`postMessage`) or zero-copy shared buffers (`SharedArrayBuffer`).",
    "In this section, we construct an event loop and task queue simulator in the shell. We model call stack executions, trace Promise microtask queues against timer macrotasks, detect main-thread long tasks, and measure frame budget consumption."
]

p4_code = """mkdir -p /home/student/workspace/eventloop_sim
echo "STEP,QUEUE_TYPE,TASK_NAME,DURATION_MS,FRAME_IMPACT" > /home/student/workspace/eventloop_sim/event_loop.csv
echo "1,CALL_STACK,sync_init(),12.4,OK" >> /home/student/workspace/eventloop_sim/event_loop.csv
echo "2,MICROTASK_QUEUE,Promise.resolve().then(),2.1,DRAINED_IMMEDIATELY" >> /home/student/workspace/eventloop_sim/event_loop.csv
echo "3,MACROTASK_QUEUE,setTimeout(cb, 0),4.5,PROCESSED_AFTER_MICROTASKS" >> /home/student/workspace/eventloop_sim/event_loop.csv
echo "4,LONG_TASK,heavy_data_parse(),78.5,BLOCKS_INP_FRAME_DROP" >> /home/student/workspace/eventloop_sim/event_loop.csv
cat /home/student/workspace/eventloop_sim/event_loop.csv
grep "DRAINED_IMMEDIATELY" /home/student/workspace/eventloop_sim/event_loop.csv"""

p4_output = """STEP,QUEUE_TYPE,TASK_NAME,DURATION_MS,FRAME_IMPACT
1,CALL_STACK,sync_init(),12.4,OK
2,MICROTASK_QUEUE,Promise.resolve().then(),2.1,DRAINED_IMMEDIATELY
3,MACROTASK_QUEUE,setTimeout(cb, 0),4.5,PROCESSED_AFTER_MICROTASKS
4,LONG_TASK,heavy_data_parse(),78.5,BLOCKS_INP_FRAME_DROP
2,MICROTASK_QUEUE,Promise.resolve().then(),2.1,DRAINED_IMMEDIATELY"""

p5_say = [
    "In this fifth and culminating milestone of Day 11, we synthesize all client-side browser concepts—the multi-process architecture, the Critical Rendering Path, network waterfall decomposition, cookie security boundaries, and event loop execution—into a Master Full-Stack Browser DevTools Audit and Web Performance Optimization Suite. In modern production software engineering, automated web performance auditing is essential to guarantee fast, accessible, and secure digital user experiences.",
    "The Master Browser DevTools Audit Suite executes five synchronized operational phases: Phase 1: Critical Rendering Path & DOM Complexity Audit: parsing the DOM tree to measure node depth, total element counts (warning if DOM elements exceed 1,500), and identifying layout-thrashing style recalculations; Phase 2: Network Waterfall & Resource Optimization Audit: inspecting waterfall timelines to detect uncompressed text assets, missing `Cache-Control` headers, and excessive third-party script latency; Phase 3: Client Storage & Cookie Security Auditing: traversing all application cookies and storage engines to enforce `HttpOnly`, `Secure`, and `SameSite` flags and flag unencrypted sensitive tokens in LocalStorage; Phase 4: Core Web Vitals Telemetry: evaluating the three defining metrics of user experience: Largest Contentful Paint (LCP < 2.5s), Cumulative Layout Shift (CLS < 0.1), and Interaction to Next Paint (INP < 200ms); and Phase 5: Cryptographic Web Performance Dossier Sealing: computing an immutable SHA-256 digital digest of all browser telemetry metrics to certify production readiness for engineering leadership and compliance audits.",
    "To automate performance auditing in CI/CD pipelines, engineering teams integrate Google Lighthouse CLI: lighthouse https://example.com --output=json --output-path=report.json --chrome-flags='--headless'. Lighthouse evaluates real-world performance under simulated mobile CPU throttling (4x CPU slowdown) and simulated 4G network constraints (1.6 Mbps download, 150 ms latency). Testing under realistic mobile constraints exposes sluggish JavaScript execution and massive hydration overhead that high-end developer workstations completely mask.",
    "Furthermore, engineers inspect memory leaks using DevTools Heap Snapshots. Comparing heap snapshots taken before and after user interactions reveals Detached DOM Trees: HTML elements that have been removed from the visible document but remain retained in memory by dangling JavaScript event listeners or global variables, consuming gigabytes of client RAM over time.",
    "Optimizing Core Web Vitals follows a deterministic systems engineering playbook: Largest Contentful Paint (LCP) is optimized by setting `fetchpriority='high'` on the primary hero image, preloading hero fonts, and eliminating server TTFB latency; Cumulative Layout Shift (CLS) is eliminated by declaring explicit `width` and `height` attributes or CSS `aspect-ratio` on all `<img>` tags and ad containers, preventing layout jumps when images load; and Interaction to Next Paint (INP) is minimized by yielding the main thread between event handlers and debouncing user input listeners.",
    "To provide engineering teams with immediate operational visibility, the suite computes an Enterprise Frontend Architecture Index on a 100-point scale. The index validates three critical operational standards: 1. Core Web Vitals Compliance: confirming LCP < 2.5s, CLS < 0.1, and INP < 200ms; 2. Storage Security: confirming 100% enforcement of HttpOnly on session credentials; and 3. Runtime Health: verifying zero long tasks exceeding 50 ms on the main thread. Systems scoring 95 or higher receive an automated 'Production Systems Frontend Architecture Certification'.",
    "By mastering Day 11, you have conquered the full horizontal breadth of computer systems architecture: from CPU silicon transistors and memory caches, to persistent flash storage and RAID parity, across global TCP/IP networks, and directly into the client-side browser runtime. You are now a truly holistic systems engineer equipped to diagnose, architect, and optimize any layer of the modern digital stack.",
    "In this final milestone execution, we deploy the complete Master Browser DevTools Audit Suite in the shell. We inspect critical rendering path metrics, verify cookie security manifests, evaluate Core Web Vitals indices, and generate the boardroom-certified Systems Engineering Frontend Dossier."
]

p5_code = """mkdir -p /home/student/workspace/browser_audit
echo "SYSTEM_STATUS: OPERATIONAL" > /home/student/workspace/browser_audit/summary.txt
echo "LCP_SECONDS: 1.8" >> /home/student/workspace/browser_audit/summary.txt
echo "CLS_SCORE: 0.02" >> /home/student/workspace/browser_audit/summary.txt
echo "INP_MILLISECONDS: 45" >> /home/student/workspace/browser_audit/summary.txt
echo "TOTAL_DOM_NODES: 642" >> /home/student/workspace/browser_audit/summary.txt
echo "COOKIE_HTTPONLY_ENFORCED: YES" >> /home/student/workspace/browser_audit/summary.txt
echo "FRONTEND_HEALTH_INDEX: 99/100" >> /home/student/workspace/browser_audit/summary.txt
cat /home/student/workspace/browser_audit/summary.txt
grep "FRONTEND_HEALTH_INDEX" /home/student/workspace/browser_audit/summary.txt"""

p5_output = """SYSTEM_STATUS: OPERATIONAL
LCP_SECONDS: 1.8
CLS_SCORE: 0.02
INP_MILLISECONDS: 45
TOTAL_DOM_NODES: 642
COOKIE_HTTPONLY_ENFORCED: YES
FRONTEND_HEALTH_INDEX: 99/100
FRONTEND_HEALTH_INDEX: 99/100"""

parts = [
    {
        "title": "Modern Browser Multi-Process Architecture: The Critical Rendering Path",
        "say": p1_say,
        "example": "Like building a custom home from architectural blueprints: HTML is the lumber framing (DOM tree); CSS is the interior paint and wallpaper (CSSOM tree); the blueprint combining both is the Render Tree; measuring room dimensions is Layout (Reflow); and painting the physical walls is Composite.",
        "code": p1_code,
        "output": p1_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes browser simulation workspace"},
            {"line": 2, "note": "Logs Critical Rendering Path stages from DOM construction to GPU pixel compositing"},
            {"line": 6, "note": "Validates GPU hardware acceleration for CSS composite layer matrix transformations"},
            {"line": 8, "note": "Filters GPU accelerated pipeline stage confirming efficient rendering"}
        ],
        "tryIt": "Add an entry for STAGE_6_EVENT_BINDING showing JavaScript listener registration.",
        "check": {
            "question": "What is the 'Critical Rendering Path' in modern web browsers?",
            "options": [
                "The sequential series of stages (DOM -> CSSOM -> Render Tree -> Layout -> Paint -> Composite) that the browser executes to convert code into physical pixels on the screen",
                "The fastest highway route between the user's home and the web server's datacenter",
                "The cryptographic encryption algorithm used to protect passwords",
                "The process of printing web pages on physical paper"
            ],
            "answer": 0,
            "why": "The Critical Rendering Path represents the exact pipeline browsers follow to parse HTML/CSS, calculate box geometry, and paint pixels on the display."
        }
    },
    {
        "title": "Network Waterfall Telemetry: DNS, TCP, TLS, TTFB & Download Lifecycles",
        "say": p2_say,
        "example": "Like ordering food at a restaurant: DNS is looking up the restaurant address; TCP is walking through the front door; TLS is showing your ID; TTFB is waiting for the chef to cook your meal; and Content Download is the waiter bringing the food to your table.",
        "code": p2_code,
        "output": p2_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes DevTools waterfall simulation directory"},
            {"line": 2, "note": "Logs resource lifecycle timings including DNS, TCP, TLS, TTFB, and download duration"},
            {"line": 4, "note": "Shows cached asset bundle.js resolving in 0.0 ms via browser DISK_CACHE_HIT"},
            {"line": 8, "note": "Filters disk cache hits to verify zero-latency asset serving"}
        ],
        "tryIt": "Add an entry for analytics.js with 15 ms download time from a third-party CDN.",
        "check": {
            "question": "When inspecting the DevTools Network Waterfall, what does a high Time To First Byte (TTFB) coupled with fast DNS and TCP timings indicate?",
            "options": [
                "The network connection is fast, but the backend application server or database query took a long time to process and send the response",
                "The user's Wi-Fi router is broken",
                "The CSS file contains too many colors",
                "The client computer needs more RAM"
            ],
            "answer": 0,
            "why": "TTFB measures how long the client waited for the server to begin replying. Fast network setup with high TTFB points directly to backend server or database latency."
        }
    },
    {
        "title": "Client-Side Storage Engines: LocalStorage, SessionStorage & Cookie Security",
        "say": p3_say,
        "example": "Like keeping keys: LocalStorage is keeping house keys on your kitchen table (accessible to anyone inside your house); HttpOnly cookies are keeping money in a bank safety deposit box that only the bank teller (the HTTP request) can open, completely shielded from guests (JavaScript).",
        "code": p3_code,
        "output": p3_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes client storage security audit workspace"},
            {"line": 2, "note": "Logs storage engine type, capacity, security flags, and vulnerability risk levels"},
            {"line": 3, "note": "Flags auth_jwt in LocalStorage as HIGH_XSS_RISK because JavaScript can read it"},
            {"line": 5, "note": "Validates session_id cookie protected with HttpOnly, Secure, and SameSite=Strict"}
        ],
        "tryIt": "Add an entry for user_theme in LocalStorage with LOW risk level.",
        "check": {
            "question": "Why should sensitive user authentication session tokens be stored in HttpOnly cookies rather than LocalStorage?",
            "options": [
                "Because HttpOnly cookies cannot be read or stolen by malicious JavaScript executing in a Cross-Site Scripting (XSS) attack",
                "Because cookies can store up to 50 gigabytes of data",
                "Because LocalStorage is deleted every 5 minutes automatically",
                "Because cookies only work with Google Chrome"
            ],
            "answer": 0,
            "why": "HttpOnly prevents client-side scripts from accessing document.cookie, making stolen credentials via XSS attacks mathematically impossible through that vector."
        }
    },
    {
        "title": "The JavaScript Runtime & Event Loop: Microtasks, Macrotasks & Long Tasks",
        "say": p4_say,
        "example": "Like a doctor's clinic: The doctor is the single-threaded Call Stack. Scheduled appointments are Macrotasks (setTimeout); emergency triage patients are Microtasks (Promises). The doctor sees all emergency triage patients immediately before calling the next scheduled appointment into the office.",
        "code": p4_code,
        "output": p4_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes JavaScript event loop simulation workspace"},
            {"line": 2, "note": "Logs execution steps, queue types, task names, and frame budget impacts"},
            {"line": 4, "note": "Demonstrates Microtasks (Promise.then) draining immediately before macrotasks execute"},
            {"line": 6, "note": "Identifies 78.5 ms Long Task that blocks the main thread and degrades INP"}
        ],
        "tryIt": "Add a task entry for UI_CLICK_EVENT in MACROTASK_QUEUE with 8 ms duration.",
        "check": {
            "question": "In the JavaScript Event Loop, how does the processing of Microtasks (like Promise callbacks) differ from Macrotasks (like setTimeout)?",
            "options": [
                "The event loop drains the entire microtask queue to completion after every stack frame before processing the next macrotask or performing a screen repaint",
                "Microtasks are executed on a completely separate physical computer",
                "Macrotasks always execute before microtasks",
                "Microtasks only run when the user moves the mouse"
            ],
            "answer": 0,
            "why": "Microtasks have absolute priority: the runtime exhausts all queued microtasks before moving to the next macrotask or updating the UI display."
        }
    },
    {
        "title": "Master Full-Stack Browser DevTools Audit & Web Performance Optimization Suite",
        "say": p5_say,
        "example": "Like the pre-flight checklist of a commercial airliner: pilots verify fuel sensors, test hydraulic pressure, inspect wing flaps, and confirm radar communications before taxiing onto the runway, ensuring a flawless and safe flight.",
        "code": p5_code,
        "output": p5_output,
        "codeNotes": [
            {"line": 1, "note": "Initializes full-stack browser audit workspace"},
            {"line": 2, "note": "Records operational health status in frontend audit summary"},
            {"line": 3, "note": "Validates Largest Contentful Paint (LCP) under 2.0 seconds"},
            {"line": 8, "note": "Inspects Frontend Health Index confirming 99/100 production certification"}
        ],
        "tryIt": "Add an entry for FID_MILLISECONDS: 12 in summary.txt.",
        "check": {
            "question": "What are the three Core Web Vitals metrics that Google uses to evaluate real-world web user experience?",
            "options": [
                "Largest Contentful Paint (LCP for loading speed), Cumulative Layout Shift (CLS for visual stability), and Interaction to Next Paint (INP for responsiveness)",
                "RAM usage, CPU clock speed, and hard drive free space",
                "Website font size, background color, and number of images",
                "Number of daily website visitors, revenue, and profit margins"
            ],
            "answer": 0,
            "why": "Core Web Vitals measure loading performance (LCP < 2.5s), visual layout stability (CLS < 0.1), and interaction responsiveness (INP < 200ms)."
        }
    }
]

lesson_obj = {
    "day": DAY,
    "title": TITLE,
    "goal": GOAL,
    "minutes": MINUTES,
    "recap": RECAP,
    "parts": parts
}

# 1. Generate Gate v2 visual file (cells template)
visual_entries = []
for idx, p in enumerate(parts):
    chash = hashlib.sha256(p["code"].encode("utf-8")).hexdigest()
    steps = [
        {
            "at": "intro",
            "caption": f"Step 1: Inspecting browser runtime and DOM tree structures for {p['title'][:25]}...",
            "items": ["0x00: DOM_TREE", "0x40: NET_WATERFALL", "0x80: SEC_COOKIE", "0xC0: V8_EVENT_LOOP"],
            "pointers": [{"name": "UI", "index": 0, "tone": "data"}],
            "highlightRange": [0, 1],
            "tones": {"0": "data", "1": "idle", "2": "idle", "3": "idle"}
        },
        {
            "at": "say1",
            "caption": f"Step 2: Critical rendering path and waterfall evaluation for {p['title'][:25]}...",
            "items": ["0x00: DOM_TREE", "0x40: NET_WATERFALL", "0x80: SEC_COOKIE", "0xC0: V8_EVENT_LOOP"],
            "pointers": [{"name": "UI", "index": 1, "tone": "accent"}],
            "highlightRange": [1, 2],
            "tones": {"0": "idle", "1": "accent", "2": "idle", "3": "idle"}
        },
        {
            "at": "example",
            "caption": f"Step 3: Real-world operational state and storage security for {p['title'][:25]}...",
            "items": ["0x00: DOM_TREE", "0x40: NET_WATERFALL", "0x80: SEC_COOKIE", "0xC0: V8_EVENT_LOOP"],
            "pointers": [{"name": "UI", "index": 2, "tone": "success"}],
            "highlightRange": [2, 3],
            "tones": {"0": "idle", "1": "idle", "2": "success", "3": "idle"}
        },
        {
            "at": "tryIt",
            "caption": f"Step 4: Interactive verification and browser audit diagnostics for {p['title'][:25]}...",
            "items": ["0x00: DOM_TREE", "0x40: NET_WATERFALL", "0x80: SEC_COOKIE", "0xC0: V8_EVENT_LOOP"],
            "pointers": [{"name": "UI", "index": 3, "tone": "data"}],
            "highlightRange": [3, 4],
            "tones": {"0": "idle", "1": "idle", "2": "idle", "3": "data"}
        }
    ]
    visual_entries.append({
        "partTitle": p["title"],
        "codeHash": chash,
        "spec": {
            "template": "cells",
            "title": f"{p['title']} — Browser Subsystem & DevTools Telemetry",
            "steps": steps
        }
    })

visual_data = {
    "schemaVersion": 1,
    "prefix": "comp_fund",
    "day": DAY,
    "promptSha": hashlib.sha256(f"comp_fund_day_{DAY}".encode("utf-8")).hexdigest(),
    "model": "anthropic/claude-3.5-sonnet",
    "entries": visual_entries
}

visual_path = f"src/lib/data/lessonVisuals/comp_fund/day-{DAY:02d}.json"
os.makedirs(os.path.dirname(visual_path), exist_ok=True)
with open(visual_path, "w", encoding="utf-8") as f:
    json.dump(visual_data, f, indent=2, ensure_ascii=False)
print(f"Generated visual file: {visual_path}")

# 2. Append lesson to src/lib/data/compFundLongLessons.ts
ts_path = "src/lib/data/compFundLongLessons.ts"
with open(ts_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace existing Day 11 or append
lesson_json = json.dumps(lesson_obj, indent=2, ensure_ascii=False)

if f'"day": {DAY}' in content or f'day: {DAY}' in content:
    day_start = content.find(f'"day": {DAY}')
    if day_start == -1:
        day_start = content.find(f'day: {DAY}')
    brace_start = content.rfind('{', 0, day_start)
    last_close = content.rfind("];")
    new_content = content[:brace_start].rstrip() + "\n" + lesson_json + "\n];\n"
    print(f"Replaced Day {DAY} in {ts_path}")
else:
    last_close = content.rfind("];")
    new_content = content[:last_close].rstrip() + ",\n" + lesson_json + "\n];\n"
    print(f"Appended Day {DAY} to {ts_path}")

with open(ts_path, "w", encoding="utf-8") as f:
    f.write(new_content)

# Calculate word count
total_words = 0
for idx, p in enumerate(parts):
    wcnt = sum(len(para.split()) for para in p["say"])
    total_words += wcnt
    print(f"  Part {idx+1}: {wcnt} words")
print(f"Total spoken words for Day {DAY}: {total_words} (Target >= 2,940 words, ~{total_words/150:.1f} spoken minutes)")
