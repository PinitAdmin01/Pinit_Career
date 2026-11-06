import os
import sys
import json
import hashlib

sys.path.insert(0, os.path.abspath('scripts'))

false = False
true = True

def sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

with open('scripts/block9_all_days.json', 'r', encoding='utf-8') as f:
    all_days = json.load(f)

VISUALS_DIR = os.path.abspath('src/lib/data/lessonVisuals/react-basics')
os.makedirs(VISUALS_DIR, exist_ok=True)

visual_templates_by_day = {
    41: [
        {
            "template": "compare",
            "title": "Architectural Comparison: Traditional SSR vs React Server Components",
            "left": {"label": "Traditional SSR", "items": ["Ships 100% component code to browser", "Client hydrates entire DOM tree", "Heavy dependencies bloat bundle", "Double execution penalty"]},
            "right": {"label": "React Server Components", "items": ["0 KB server component client bundle", "Only interactive islands hydrate", "Heavy libraries stay on Node.js", "Direct database & backend access"]},
            "steps": [
                {"at": "say1", "caption": "Traditional SSR ships all component code to the client, causing severe bundle bloat and hydration delays.", "values": {"left": {"items": ["100% Code Shipped", "Mandatory Hydration", "Heavy Bundles", "Double Execution"]}, "right": {"items": ["0 KB Server Bundle", "Selective Hydration", "Zero-Bundle Deps", "Direct DB Access"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say2", "caption": "Server Components execute strictly on the server and are never bundled into client JavaScript.", "values": {"left": {"items": ["Client-Side Overhead", "DOM Traversal Tax", "3MB Vendor Bundle", "Slow TTI"]}, "right": {"items": ["Zero Client Bytes", "Fast Streaming", "Offloaded AST", "Instant TTI"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say3", "caption": "Server components access backend databases and microservices directly over high-speed internal networks.", "values": {"left": {"items": ["REST API Boilerplate", "Network Waterfalls", "Manual Endpoints", "Double Fetch"]}, "right": {"items": ["Direct SQL / ORM", "Sub-1ms Data Bus", "Zero Endpoints", "Single Response"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say4", "caption": "RSC achieves up to 96.9% reduction in client JavaScript payloads while preserving rich interactivity.", "values": {"left": {"items": ["723 KB Client Bundle", "103ms Hydration Cost", "1188ms TTI Score", "Red Web Vitals"]}, "right": {"items": ["22 KB Client Bundle", "8ms Hydration Cost", "41ms TTI Score", "Green Web Vitals"]}}, "tones": {"left": "error", "right": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "The 'use client' Directive & Serialization Boundary",
            "nodes": [
                {"id": "server_root", "label": "Server Component Root", "tappable": false},
                {"id": "props_guard", "label": "Props Serialization Guard", "tappable": false},
                {"id": "rsc_wire", "label": "RSC Wire Stream ($L1)", "tappable": false},
                {"id": "client_leaf", "label": "Client Island Leaf", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The 'use client' directive defines a strict boundary across the module dependency graph.", "values": {"server_root": {"text": "\"Server Root\""}, "props_guard": {"text": "\"Validating\""}, "rsc_wire": {"text": "\"Encoding\""}, "client_leaf": {"text": "\"Hydrating\""}}, "tones": {"server_root": "ok", "props_guard": "data", "rsc_wire": "data", "client_leaf": "idle"}, "arrows": [["server_root", "props_guard"]]},
                {"at": "say2", "caption": "All props crossing the boundary must be strictly JSON-serializable primitives or React elements.", "values": {"server_root": {"text": "\"Evaluated\""}, "props_guard": {"text": "\"JSON Checked\""}, "rsc_wire": {"text": "\"Stream Ready\""}, "client_leaf": {"text": "\"Standby\""}}, "tones": {"server_root": "ok", "props_guard": "ok", "rsc_wire": "data", "client_leaf": "idle"}, "arrows": [["props_guard", "rsc_wire"]]},
                {"at": "say3", "caption": "Passing functions or class instances across the boundary triggers a fatal serialization error.", "values": {"server_root": {"text": "\"Evaluated\""}, "props_guard": {"text": "\"Functions Blocked\""}, "rsc_wire": {"text": "\"Halted\""}, "client_leaf": {"text": "\"Error\""}}, "tones": {"server_root": "ok", "props_guard": "error", "rsc_wire": "idle", "client_leaf": "error"}, "arrows": [["props_guard", "client_leaf"]]},
                {"at": "say4", "caption": "Server components passed as children slots are evaluated on the server with zero client bundle leakage.", "values": {"server_root": {"text": "\"Children Slot\""}, "props_guard": {"text": "\"Slot Passed\""}, "rsc_wire": {"text": "\"$L Ref Emitted\""}, "client_leaf": {"text": "\"Rendered Slot\""}}, "tones": {"server_root": "ok", "props_guard": "ok", "rsc_wire": "ok", "client_leaf": "ok"}, "arrows": [["rsc_wire", "client_leaf"]]}
            ]
        },
        {
            "template": "boxes",
            "title": "Zero-Bundle-Size Heavy Dependency Offloading",
            "boxes": [
                {"id": "node_runtime", "label": "Node.js Server Runtime (340 KB Shiki / Markdown Parser)", "tappable": false},
                {"id": "ast_compiler", "label": "Server AST Compiler & Code Tokenizer", "tappable": false},
                {"id": "static_dom", "label": "Semantic HTML Virtual DOM Nodes", "tappable": false},
                {"id": "client_bundle", "label": "Client Bundle Shipped (0.00 KB Dependencies)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Heavy dependencies like Shiki, Remark, and Moment.js execute exclusively on the server.", "values": {"node_runtime": {"text": "\"Executing Shiki\""}, "ast_compiler": {"text": "\"Tokenizing\""}, "static_dom": {"text": "\"Pending\""}, "client_bundle": {"text": "\"0 KB\""}}, "tones": {"node_runtime": "ok", "ast_compiler": "data", "static_dom": "idle", "client_bundle": "ok"}},
                {"at": "say2", "caption": "The server compiler transforms markdown and code blocks into plain virtual DOM element nodes.", "values": {"node_runtime": {"text": "\"Done\""}, "ast_compiler": {"text": "\"AST Generated\""}, "static_dom": {"text": "\"h1, pre, code\""}, "client_bundle": {"text": "\"0 KB\""}}, "tones": {"node_runtime": "ok", "ast_compiler": "ok", "static_dom": "data", "client_bundle": "ok"}},
                {"at": "say3", "caption": "The client receives only the rendered HTML markup; zero parser bytes are transmitted.", "values": {"node_runtime": {"text": "\"Cached in Redis\""}, "ast_compiler": {"text": "\"Purged\""}, "static_dom": {"text": "\"Streamed\""}, "client_bundle": {"text": "\"0 KB Shipped\""}}, "tones": {"node_runtime": "ok", "ast_compiler": "idle", "static_dom": "ok", "client_bundle": "ok"}},
                {"at": "say4", "caption": "Mobile CPU cores stay cool with zero client-side AST traversals or regex execution.", "values": {"node_runtime": {"text": "\"Server Handled\""}, "ast_compiler": {"text": "\"Zero Client CPU\""}, "static_dom": {"text": "\"Instant Paint\""}, "client_bundle": {"text": "\"100% Lean\""}}, "tones": {"node_runtime": "ok", "ast_compiler": "ok", "static_dom": "ok", "client_bundle": "ok"}}
            ]
        },
        {
            "template": "states",
            "title": "RSC Wire Stream Protocol: Line-by-Line Tokenization",
            "states": [
                {"id": "stream_start", "label": "TCP Stream Opened", "desc": "Initial chunked HTTP connection established."},
                {"id": "module_ref", "label": "M1 Module Manifest", "desc": "Declares client module path and bundle chunk ID."},
                {"id": "element_payload", "label": "J0 Virtual DOM Payload", "desc": "Streams JSON element tree with $L1 lazy references."},
                {"id": "client_reconcile", "label": "Progressive Deserialization", "desc": "Client constructs VDOM and attaches live island listeners."}
            ],
            "current": "stream_start",
            "steps": [
                {"at": "say1", "caption": "The RSC wire format is a line-delimited stream prefixed with single-character control tags.", "values": {"stream_start": {"text": "\"Connected\""}, "module_ref": {"text": "\"Pending\""}, "element_payload": {"text": "\"Pending\""}, "client_reconcile": {"text": "\"Waiting\""}}, "tones": {"stream_start": "ok", "module_ref": "idle", "element_payload": "idle", "client_reconcile": "idle"}},
                {"at": "say2", "caption": "'M' lines define client component module manifests for parallel bundle prefetching.", "values": {"stream_start": {"text": "\"Streaming\""}, "module_ref": {"text": "\"M1: AddToCart.js\""}, "element_payload": {"text": "\"Pending\""}, "client_reconcile": {"text": "\"Preloading M1\""}}, "tones": {"stream_start": "ok", "module_ref": "data", "element_payload": "idle", "client_reconcile": "data"}},
                {"at": "say3", "caption": "'J' lines stream the virtual DOM tree, using '$L' tokens to reference client module slots.", "values": {"stream_start": {"text": "\"Streaming\""}, "module_ref": {"text": "\"M1 Ready\""}, "element_payload": {"text": "\"J0: div, $L1\""}, "client_reconcile": {"text": "\"Diffing VDOM\""}}, "tones": {"stream_start": "ok", "module_ref": "ok", "element_payload": "data", "client_reconcile": "data"}},
                {"at": "say4", "caption": "The client reconstructs the Fiber tree, attaching interactive event handlers to client leaves.", "values": {"stream_start": {"text": "\"Stream Complete\""}, "module_ref": {"text": "\"Bound\""}, "element_payload": {"text": "\"Committed\""}, "client_reconcile": {"text": "\"Interactive VDOM\""}}, "tones": {"stream_start": "ok", "module_ref": "ok", "element_payload": "ok", "client_reconcile": "ok"}}
            ]
        },
        {
            "template": "component-tree",
            "title": "End-to-End Hybrid RSC Tree Topology",
            "items": [
                {"id": "root", "label": "ServerProductPage (Server Component)", "depth": 0, "status": "active"},
                {"id": "header", "label": "ProductHeader (Server Component)", "depth": 1, "status": "active"},
                {"id": "specs", "label": "ServerMarkdownSpecs (Server Component)", "depth": 1, "status": "active"},
                {"id": "cart_island", "label": "InteractiveAddToCart (Client Island)", "depth": 1, "status": "active"}
            ],
            "steps": [
                {"at": "say1", "caption": "The server component root renders top-level layouts and queries backend databases.", "values": {"root": {"text": "\"Server Executing\""}, "header": {"text": "\"Queued\""}, "specs": {"text": "\"Queued\""}, "cart_island": {"text": "\"Boundary\""}}, "tones": {"root": "ok", "header": "idle", "specs": "idle", "cart_island": "idle"}},
                {"at": "say2", "caption": "Server children render to static VDOM with zero client dependency bundle leakage.", "values": {"root": {"text": "\"Server Done\""}, "header": {"text": "\"Rendered\""}, "specs": {"text": "\"Rendered 0KB\""}, "cart_island": {"text": "\"Boundary\""}}, "tones": {"root": "ok", "header": "ok", "specs": "ok", "cart_island": "data"}},
                {"at": "say3", "caption": "Client components are serialized as module references (M1) and lazy references ($L1).", "values": {"root": {"text": "\"Emitting Wire\""}, "header": {"text": "\"J0 Chunk\""}, "specs": {"text": "\"J0 Chunk\""}, "cart_island": {"text": "\"M1 + $L1 Ref\""}}, "tones": {"root": "ok", "header": "ok", "specs": "ok", "cart_island": "data"}},
                {"at": "say4", "caption": "The client reconciles the hybrid tree, binding live event listeners to interactive islands.", "values": {"root": {"text": "\"Server Root Clean\""}, "header": {"text": "\"Static DOM\""}, "specs": {"text": "\"Static DOM\""}, "cart_island": {"text": "\"Hydrated & Bound\""}}, "tones": {"root": "ok", "header": "ok", "specs": "ok", "cart_island": "ok"}}
            ]
        }
    ],
    42: [
        {
            "template": "compare",
            "title": "Traditional SSR Waterfall vs Streaming SSR with Suspense",
            "left": {"label": "Traditional Blocking SSR", "items": ["All-or-nothing HTML generation", "TTFB blocked by slowest database query", "Server buffers full HTML string in RAM", "Delayed asset discovery & blank screen"]},
            "right": {"label": "Streaming SSR with Suspense", "items": ["Immediate shell & head flush (<50ms)", "Decouples TTFB from slow queries", "Constant bounded server memory", "Early CSS/Font preloading & instant FCP"]},
            "steps": [
                {"at": "say1", "caption": "Traditional SSR blocks the entire response until the slowest backend dependency resolves.", "values": {"left": {"items": ["All-or-Nothing", "Blocked TTFB", "Memory Spikes", "Blank Screen"]}, "right": {"items": ["Immediate Shell", "Fast TTFB", "Constant RAM", "Instant FCP"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say2", "caption": "Streaming SSR flushes the outer layout shell and stylesheet links in the first TCP packet.", "values": {"left": {"items": ["317ms Wait", "Delayed Head", "High TBT", "Unresponsive"]}, "right": {"items": ["29ms TTFB", "Early CSS Preload", "Zero Blocking", "Smooth Paint"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say3", "caption": "Suspense boundaries allow slow components to stream out-of-order as data resolves.", "values": {"left": {"items": ["Sequential Wait", "Thread Starved", "Long Tasks", "Jank"]}, "right": {"items": ["Out-of-Order", "Chunked Delivery", "Cooperative", "Responsive"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say4", "caption": "Streaming SSR delivers a 288ms improvement in initial perceived latency on mobile devices.", "values": {"left": {"items": ["322ms FCP", "Poor Web Vitals", "Higher Bounce", "High Memory"]}, "right": {"items": ["34ms FCP", "Green Web Vitals", "High Retention", "Low Memory"]}}, "tones": {"left": "error", "right": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "Early Shell Flush & Preload Scanning Pipeline",
            "nodes": [
                {"id": "http_req", "label": "Client HTTP GET Request", "tappable": false},
                {"id": "shell_flush", "label": "Immediate Shell Flush (<50ms)", "tappable": false},
                {"id": "preload_scanner", "label": "Browser Preload Scanner Active", "tappable": false},
                {"id": "bg_queries", "label": "Parallel Server DB Queries", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The client request arrives; the server commits 200 OK headers and begins streaming.", "values": {"http_req": {"text": "\"GET /catalog\""}, "shell_flush": {"text": "\"Headers Sent\""}, "preload_scanner": {"text": "\"Standby\""}, "bg_queries": {"text": "\"Dispatched\""}}, "tones": {"http_req": "data", "shell_flush": "ok", "preload_scanner": "idle", "bg_queries": "data"}, "arrows": [["http_req", "shell_flush"]]},
                {"at": "say2", "caption": "The server flushes the DOCTYPE, document head, and stylesheet links in the initial chunk.", "values": {"http_req": {"text": "\"Active\""}, "shell_flush": {"text": "\"Head Flushed\""}, "preload_scanner": {"text": "\"Parsing Chunks\""}, "bg_queries": {"text": "\"In-Flight\""}}, "tones": {"http_req": "ok", "shell_flush": "ok", "preload_scanner": "data", "bg_queries": "data"}, "arrows": [["shell_flush", "preload_scanner"]]},
                {"at": "say3", "caption": "The browser preload scanner downloads CSS and web fonts concurrently while database queries run.", "values": {"http_req": {"text": "\"Connected\""}, "shell_flush": {"text": "\"Done\""}, "preload_scanner": {"text": "\"Downloading CSS\""}, "bg_queries": {"text": "\"Database Working\""}}, "tones": {"http_req": "ok", "shell_flush": "ok", "preload_scanner": "ok", "bg_queries": "data"}, "arrows": [["preload_scanner", "bg_queries"]]},
                {"at": "say4", "caption": "Zero dead time: styles are ready in the browser before the body content finishes rendering.", "values": {"http_req": {"text": "\"Warm TCP\""}, "shell_flush": {"text": "\"Stream Open\""}, "preload_scanner": {"text": "\"Styles Applied\""}, "bg_queries": {"text": "\"Ready to Stream\""}}, "tones": {"http_req": "ok", "shell_flush": "ok", "preload_scanner": "ok", "bg_queries": "ok"}, "arrows": [["bg_queries", "shell_flush"]]}
            ]
        },
        {
            "template": "states",
            "title": "Out-of-Order Suspense Streaming & $RC Swapping",
            "states": [
                {"id": "s_fallback", "label": "Template Placeholder (B:0)", "desc": "Initial shell renders template tag and fallback skeleton."},
                {"id": "s_pending", "label": "Background Promise Resolution", "desc": "Server queries reviews database in parallel."},
                {"id": "s_chunk", "label": "Hidden Chunk Arrival (S:0)", "desc": "Resolved HTML emitted at bottom of stream with $RC script."},
                {"id": "s_swapped", "label": "DOM Replacement Executed", "desc": "$RC swaps B:0 skeleton with S:0 live reviews seamlessly."}
            ],
            "current": "s_fallback",
            "steps": [
                {"at": "say1", "caption": "React embeds a template placeholder tag (B:0) alongside an animated loading skeleton.", "values": {"s_fallback": {"text": "\"B:0 Placeholder\""}, "s_pending": {"text": "\"Fetching DB\""}, "s_chunk": {"text": "\"Waiting\""}, "s_swapped": {"text": "\"Waiting\""}}, "tones": {"s_fallback": "data", "s_pending": "data", "s_chunk": "idle", "s_swapped": "idle"}},
                {"at": "say2", "caption": "The server continues rendering the rest of the document without waiting for reviews.", "values": {"s_fallback": {"text": "\"Visible Skeleton\""}, "s_pending": {"text": "\"Query Resolving\""}, "s_chunk": {"text": "\"Waiting\""}, "s_swapped": {"text": "\"Waiting\""}}, "tones": {"s_fallback": "ok", "s_pending": "data", "s_chunk": "idle", "s_swapped": "idle"}},
                {"at": "say3", "caption": "When reviews resolve, the server streams `<div hidden id='S:0'>` followed by `<script>$RC('B:0','S:0')</script>`.", "values": {"s_fallback": {"text": "\"Target B:0\""}, "s_pending": {"text": "\"Resolved\""}, "s_chunk": {"text": "\"S:0 HTML + $RC\""}, "s_swapped": {"text": "\"Swapping\""}}, "tones": {"s_fallback": "ok", "s_pending": "ok", "s_chunk": "data", "s_swapped": "data"}},
                {"at": "say4", "caption": "$RC executes in the browser, replacing the fallback skeleton with live reviews instantaneously.", "values": {"s_fallback": {"text": "\"Removed\""}, "s_pending": {"text": "\"Done\""}, "s_chunk": {"text": "\"Unpacked\""}, "s_swapped": {"text": "\"Live Reviews Mounted\""}}, "tones": {"s_fallback": "idle", "s_pending": "ok", "s_chunk": "ok", "s_swapped": "ok"}}
            ]
        },
        {
            "template": "boxes",
            "title": "Streaming Error Boundary Isolation & Status Strategy",
            "boxes": [
                {"id": "headers_status", "label": "HTTP Response Headers (Committed 200 OK)", "tappable": false},
                {"id": "outer_shell", "label": "Application Outer Shell (Intact & Interactive)", "tappable": false},
                {"id": "faulty_boundary", "label": "Faulty Suspense Boundary (DB Query Rejected)", "tappable": false},
                {"id": "inline_fallback", "label": "Streamed Error Boundary Fallback ($RC S:error)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Once the initial shell is flushed, HTTP headers are committed and cannot be rewritten to 500.", "values": {"headers_status": {"text": "\"200 OK Locked\""}, "outer_shell": {"text": "\"Mounted\""}, "faulty_boundary": {"text": "\"Active\""}, "inline_fallback": {"text": "\"Standby\""}}, "tones": {"headers_status": "ok", "outer_shell": "ok", "faulty_boundary": "data", "inline_fallback": "idle"}},
                {"at": "say2", "caption": "If a nested component throws mid-stream, React isolates the failure to that specific boundary.", "values": {"headers_status": {"text": "\"200 OK\""}, "outer_shell": {"text": "\"Operational\""}, "faulty_boundary": {"text": "\"Exception Thrown\""}, "inline_fallback": {"text": "\"Catch Triggered\""}}, "tones": {"headers_status": "ok", "outer_shell": "ok", "faulty_boundary": "error", "inline_fallback": "data"}},
                {"at": "say3", "caption": "The server streams an inline error fallback chunk targeting the boundary placeholder.", "values": {"headers_status": {"text": "\"200 OK\""}, "outer_shell": {"text": "\"Operational\""}, "faulty_boundary": {"text": "\"Isolated\""}, "inline_fallback": {"text": "\"$RC('B:0','S:error')\""}}, "tones": {"headers_status": "ok", "outer_shell": "ok", "faulty_boundary": "error", "inline_fallback": "data"}},
                {"at": "say4", "caption": "The application shell remains fully functional while the broken card displays a retry prompt.", "values": {"headers_status": {"text": "\"Committed\""}, "outer_shell": {"text": "\"100% Usable\""}, "faulty_boundary": {"text": "\"Safely Handled\""}, "inline_fallback": {"text": "\"Retry Banner Mounted\""}}, "tones": {"headers_status": "ok", "outer_shell": "ok", "faulty_boundary": "ok", "inline_fallback": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "Full Asynchronous Streaming SSR Pipeline Engine",
            "nodes": [
                {"id": "start_pipe", "label": "Start Stream: Flush Head & Shell", "tappable": false},
                {"id": "emit_slots", "label": "Emit Suspense Slots (B:0)", "tappable": false},
                {"id": "resolve_chunks", "label": "Resolve Async Chunks & $RC Scripts", "tappable": false},
                {"id": "close_pipe", "label": "Close Stream (</html>)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The pipeline initializes, streaming the HTML5 head metadata and application shell.", "values": {"start_pipe": {"text": "\"FLUSH_HEAD\""}, "emit_slots": {"text": "\"Pending\""}, "resolve_chunks": {"text": "\"Pending\""}, "close_pipe": {"text": "\"Open\""}}, "tones": {"start_pipe": "ok", "emit_slots": "idle", "resolve_chunks": "idle", "close_pipe": "data"}, "arrows": [["start_pipe", "emit_slots"]]},
                {"at": "say2", "caption": "Suspense boundary slots are emitted with placeholder templates and loading fallbacks.", "values": {"start_pipe": {"text": "\"Flushed\""}, "emit_slots": {"text": "\"FLUSH_SLOT_0\""}, "resolve_chunks": {"text": "\"Pending\""}, "close_pipe": {"text": "\"Open\""}}, "tones": {"start_pipe": "ok", "emit_slots": "ok", "resolve_chunks": "idle", "close_pipe": "data"}, "arrows": [["emit_slots", "resolve_chunks"]]},
                {"at": "say3", "caption": "Background promises resolve; out-of-order chunks and replacement scripts are written to the socket.", "values": {"start_pipe": {"text": "\"Flushed\""}, "emit_slots": {"text": "\"Emitted\""}, "resolve_chunks": {"text": "\"RESOLVE_CHUNK_0\""}, "close_pipe": {"text": "\"Open\""}}, "tones": {"start_pipe": "ok", "emit_slots": "ok", "resolve_chunks": "ok", "close_pipe": "data"}, "arrows": [["resolve_chunks", "close_pipe"]]},
                {"at": "say4", "caption": "The closing tags are streamed and the HTTP response terminates with complete content integrity.", "values": {"start_pipe": {"text": "\"Done\""}, "emit_slots": {"text": "\"Done\""}, "resolve_chunks": {"text": "\"Done\""}, "close_pipe": {"text": "\"CLOSE_STREAM\""}}, "tones": {"start_pipe": "ok", "emit_slots": "ok", "resolve_chunks": "ok", "close_pipe": "ok"}}
            ]
        }
    ],
    43: [
        {
            "template": "states",
            "title": "The Hydration Uncanny Valley: Monolithic vs Concurrent Hydration",
            "states": [
                {"id": "html_paint", "label": "HTML Rendered on Screen", "desc": "Visual elements visible but event listeners not yet attached."},
                {"id": "mono_freeze", "label": "Monolithic Hydration Lock", "desc": "Main thread locked in single 160ms synchronous task."},
                {"id": "dropped_event", "label": "Uncanny Valley / Dropped Clicks", "desc": "User taps button; clicks swallowed or delayed."},
                {"id": "selective_fix", "label": "Selective Hydration Resolution", "desc": "React 18 segments tree into independent cooperative islands."}
            ],
            "current": "html_paint",
            "steps": [
                {"at": "say1", "caption": "In traditional SSR, HTML paints quickly, but the main thread freezes during monolithic hydration.", "values": {"html_paint": {"text": "\"Painted\""}, "mono_freeze": {"text": "\"160ms Long Task\""}, "dropped_event": {"text": "\"Pending\""}, "selective_fix": {"text": "\"Disabled\""}}, "tones": {"html_paint": "ok", "mono_freeze": "error", "dropped_event": "idle", "selective_fix": "idle"}},
                {"at": "say2", "caption": "The page looks completely ready, but clicks and gestures are completely unresponsive.", "values": {"html_paint": {"text": "\"Deceptive UI\""}, "mono_freeze": {"text": "\"Main Thread 100%\""}, "dropped_event": {"text": "\"Clicks Swallowed\""}, "selective_fix": {"text": "\"Disabled\""}}, "tones": {"html_paint": "ok", "mono_freeze": "error", "dropped_event": "error", "selective_fix": "idle"}},
                {"at": "say3", "caption": "Total Blocking Time (TBT) spikes past 100ms, severely degrading Core Web Vitals.", "values": {"html_paint": {"text": "\"TBT: 113.2ms\""}, "mono_freeze": {"text": "\"Uncanny Valley\""}, "dropped_event": {"text": "\"High Bounce Rate\""}, "selective_fix": {"text": "\"Disabled\""}}, "tones": {"html_paint": "error", "mono_freeze": "error", "dropped_event": "error", "selective_fix": "idle"}},
                {"at": "say4", "caption": "Selective Hydration eliminates the lockup by breaking the page into independent Suspense islands.", "values": {"html_paint": {"text": "\"Painted\""}, "mono_freeze": {"text": "\"Zero Long Tasks\""}, "dropped_event": {"text": "\"TBT: 0ms\""}, "selective_fix": {"text": "\"Active & Responsive\""}}, "tones": {"html_paint": "ok", "mono_freeze": "ok", "dropped_event": "ok", "selective_fix": "ok"}}
            ]
        },
        {
            "template": "component-tree",
            "title": "React 18 hydrateRoot & Suspense Subtree Segmentation",
            "items": [
                {"id": "shell_root", "label": "App Shell (Immediate Hydration)", "depth": 0, "status": "active"},
                {"id": "hero_node", "label": "ProductHero (Immediate Hydration)", "depth": 1, "status": "active"},
                {"id": "cart_island", "label": "InteractiveAddToCart (Suspense Island - High Priority)", "depth": 1, "status": "active"},
                {"id": "reviews_island", "label": "CustomerReviews (Suspense Island - Deferred Priority)", "depth": 1, "status": "active"}
            ],
            "steps": [
                {"at": "say1", "caption": "hydrateRoot uses Suspense boundaries as natural architectural fault lines.", "values": {"shell_root": {"text": "\"Hydrating\""}, "hero_node": {"text": "\"Queued\""}, "cart_island": {"text": "\"Independent\""}, "reviews_island": {"text": "\"Independent\""}}, "tones": {"shell_root": "data", "hero_node": "idle", "cart_island": "ok", "reviews_island": "ok"}},
                {"at": "say2", "caption": "The application shell and critical product hero hydrate immediately.", "values": {"shell_root": {"text": "\"Hydrated\""}, "hero_node": {"text": "\"Hydrated\""}, "cart_island": {"text": "\"High Priority\""}, "reviews_island": {"text": "\"Deferred\""}}, "tones": {"shell_root": "ok", "hero_node": "ok", "cart_island": "data", "reviews_island": "idle"}},
                {"at": "say3", "caption": "Heavy subtrees like customer reviews are deferred to lower priority lanes.", "values": {"shell_root": {"text": "\"Hydrated\""}, "hero_node": {"text": "\"Hydrated\""}, "cart_island": {"text": "\"Hydrated\""}, "reviews_island": {"text": "\"Idle Lane\""}}, "tones": {"shell_root": "ok", "hero_node": "ok", "cart_island": "ok", "reviews_island": "data"}},
                {"at": "say4", "caption": "Hydration failures in one island are strictly isolated, preventing site-wide re-renders.", "values": {"shell_root": {"text": "\"Protected\""}, "hero_node": {"text": "\"Protected\""}, "cart_island": {"text": "\"Protected\""}, "reviews_island": {"text": "\"Isolated Error\""}}, "tones": {"shell_root": "ok", "hero_node": "ok", "cart_island": "ok", "reviews_island": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "User-Driven Hydration Priority Promotion & Event Replay",
            "nodes": [
                {"id": "user_tap", "label": "User Clicks Unhydrated Button", "tappable": false},
                {"id": "event_capture", "label": "Capture Phase Interception", "tappable": false},
                {"id": "priority_promote", "label": "Promote Island to SyncLane", "tappable": false},
                {"id": "replay_event", "label": "Synchronous Hydration & Event Replay", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The user clicks the AddToCart button before its JavaScript has finished hydrating.", "values": {"user_tap": {"text": "\"Click Dispatched\""}, "event_capture": {"text": "\"Listening\""}, "priority_promote": {"text": "\"Normal Queue\""}, "replay_event": {"text": "\"Standby\""}}, "tones": {"user_tap": "data", "event_capture": "ok", "priority_promote": "idle", "replay_event": "idle"}, "arrows": [["user_tap", "event_capture"]]},
                {"at": "say2", "caption": "React's top-level continuous listener intercepts the event during the capture phase.", "values": {"user_tap": {"text": "\"Intercepted\""}, "event_capture": {"text": "\"Event Buffered\""}, "priority_promote": {"text": "\"Promoting\""}, "replay_event": {"text": "\"Standby\""}}, "tones": {"user_tap": "ok", "event_capture": "ok", "priority_promote": "data", "replay_event": "idle"}, "arrows": [["event_capture", "priority_promote"]]},
                {"at": "say3", "caption": "React interrupts background hydration and elevates the target island to URGENT_SYNC_LANE.", "values": {"user_tap": {"text": "\"Intercepted\""}, "event_capture": {"text": "\"Buffered\""}, "priority_promote": {"text": "\"SYNC_LANE Elevated\""}, "replay_event": {"text": "\"Hydrating Target\""}}, "tones": {"user_tap": "ok", "event_capture": "ok", "priority_promote": "ok", "replay_event": "data"}, "arrows": [["priority_promote", "replay_event"]]},
                {"at": "say4", "caption": "The island hydrates instantly, and the original click event is replayed against the live handler.", "values": {"user_tap": {"text": "\"Completed\""}, "event_capture": {"text": "\"Cleared\""}, "priority_promote": {"text": "\"Committed\""}, "replay_event": {"text": "\"Event Replayed: Success\""}}, "tones": {"user_tap": "ok", "event_capture": "ok", "priority_promote": "ok", "replay_event": "ok"}}
            ]
        },
        {
            "template": "compare",
            "title": "Viewport-Driven Hydration: Above-the-Fold vs Below-the-Fold",
            "left": {"label": "Above-the-Fold Islands (<800px)", "items": ["Continuous Immediate Lane", "Hydrates in first 50ms", "Directly accessible to user", "Instant interactive controls"]},
            "right": {"label": "Below-the-Fold Islands (>800px)", "items": ["Idle Offscreen Lane", "Deferred until main thread idle", "IntersectionObserver triggered", "Saves mobile CPU & battery"]},
            "steps": [
                {"at": "say1", "caption": "Components visible in the initial viewport are allocated to CONTINUOUS_IMMEDIATE_LANE.", "values": {"left": {"items": ["ProductHero: 150px", "StickyCart: 450px", "Immediate Priority", "Active"]}, "right": {"items": ["Specs: 950px", "Reviews: 1800px", "Footer: 3200px", "Deferred"]}}, "tones": {"left": "ok", "right": "data"}},
                {"at": "say2", "caption": "Near-viewport islands are prefetched on Transition lanes as the user prepares to scroll.", "values": {"left": {"items": ["Hydrated 100%", "Zero Latency", "Interactive", "Bound"]}, "right": {"items": ["Specs: Prefetching", "Reviews: Idle", "Footer: Idle", "Deferred"]}}, "tones": {"left": "ok", "right": "data"}},
                {"at": "say3", "caption": "Deep off-screen elements remain unhydrated until scrolled within the intersection margin.", "values": {"left": {"items": ["Committed", "Committed", "Interactive", "Zero Lag"]}, "right": {"items": ["Specs: Hydrated", "Reviews: Approaching", "Footer: Idle", "Battery Saved"]}}, "tones": {"left": "ok", "right": "ok"}},
                {"at": "say4", "caption": "Mobile devices save massive memory and CPU cycles by never hydrating unviewed sections.", "values": {"left": {"items": ["Primary Priority", "60 FPS Verified", "Immediate", "Green Vitals"]}, "right": {"items": ["Zero CPU Waste", "Flat Memory", "On-Demand Hydration", "Green Vitals"]}}, "tones": {"left": "ok", "right": "ok"}}
            ]
        },
        {
            "template": "boxes",
            "title": "Deterministic Selective Hydration & Event Replay Engine",
            "boxes": [
                {"id": "island_reg", "label": "Autonomous Island Registry", "tappable": false},
                {"id": "event_buffer", "label": "Capture-Phase Event Buffer", "tappable": false},
                {"id": "lane_scheduler", "label": "Priority Lane Scheduler", "tappable": false},
                {"id": "replayed_action", "label": "Replayed Live Event Dispatcher", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The runtime registers islands with base priorities (Nav: 10, Search: 25, Cart: 15).", "values": {"island_reg": {"text": "\"3 Islands Registered\""}, "event_buffer": {"text": "\"Empty\""}, "lane_scheduler": {"text": "\"Default Order\""}, "replayed_action": {"text": "\"Standby\""}}, "tones": {"island_reg": "ok", "event_buffer": "idle", "lane_scheduler": "data", "replayed_action": "idle"}},
                {"at": "say2", "caption": "A user clicks LiveSearchBar; the event is intercepted and buffered during capture phase.", "values": {"island_reg": {"text": "\"Search Clicked\""}, "event_buffer": {"text": "\"focus Buffered\""}, "lane_scheduler": {"text": "\"Priority Spike\""}, "replayed_action": {"text": "\"Standby\""}}, "tones": {"island_reg": "ok", "event_buffer": "ok", "lane_scheduler": "data", "replayed_action": "idle"}},
                {"at": "say3", "caption": "Search bar priority is promoted to 100, preempting NavigationMenu in the scheduler queue.", "values": {"island_reg": {"text": "\"Search: Priority 100\""}, "event_buffer": {"text": "\"Armed\""}, "lane_scheduler": {"text": "\"Hydrating Search\""}, "replayed_action": {"text": "\"Ready\""}}, "tones": {"island_reg": "ok", "event_buffer": "ok", "lane_scheduler": "ok", "replayed_action": "data"}},
                {"at": "say4", "caption": "LiveSearchBar is hydrated first, and the buffered focus event is replayed seamlessly.", "values": {"island_reg": {"text": "\"Search Hydrated\""}, "event_buffer": {"text": "\"Flushed\""}, "lane_scheduler": {"text": "\"Nav Hydrated Next\""}, "replayed_action": {"text": "\"focus Dispatched\""}}, "tones": {"island_reg": "ok", "event_buffer": "ok", "lane_scheduler": "ok", "replayed_action": "ok"}}
            ]
        }
    ],
    44: [
        {
            "template": "compare",
            "title": "Mutation Paradigms: Classical REST APIs vs React Server Actions",
            "left": {"label": "Classical REST Mutations", "items": ["Manual onSubmit preventDefault", "Custom fetch POST & JSON serialization", "Dedicated API route & middleware", "Double round trip (Mutate + Re-fetch)"]},
            "right": {"label": "React Server Actions ('use server')", "items": ["Direct <form action={fn}> binding", "Native FormData & zero serialization", "Zero API endpoints or routing tables", "Single round trip (Mutate + RSC Revalidate)"]},
            "steps": [
                {"at": "say1", "caption": "Classical REST requires extensive boilerplate: event handlers, fetch wrappers, and API controllers.", "values": {"left": {"items": ["24 Lines Boilerplate", "Manual JSON", "Custom Endpoints", "Double Fetch"]}, "right": {"items": ["3 Lines Code", "Native FormData", "Zero Endpoints", "Single Response"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say2", "caption": "Server Actions eliminate manual endpoints: asynchronous server functions are called directly from JSX.", "values": {"left": {"items": ["API Drift", "Manual Types", "Broken Scripts", "No Fallback"]}, "right": {"items": ["Inferred Types", "100% Type-Safe", "Automatic RPC", "Zero-JS Ready"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say3", "caption": "Server Actions integrate with RSC cache revalidation, updating the UI in a single network round trip.", "values": {"left": {"items": ["Two Round Trips", "Stale UI Caches", "Manual Query Keys", "Race Conditions"]}, "right": {"items": ["One Round Trip", "revalidatePath()", "Server Authority", "Atomic Update"]}}, "tones": {"left": "error", "right": "ok"}},
                {"at": "say4", "caption": "Server Actions reduce mutation boilerplate by 88% while providing automated CSRF protection.", "values": {"left": {"items": ["18ms Overhead", "Complex Auth", "Redux Sagas", "High Friction"]}, "right": {"items": ["2ms Overhead", "Built-in CSRF", "Declarative Action", "Peak Velocity"]}}, "tones": {"left": "error", "right": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "Progressive Enhancement: Zero-JS Form POST vs Enhanced Client RPC",
            "nodes": [
                {"id": "form_submit", "label": "User Submits Purchase Form", "tappable": false},
                {"id": "zero_js_mode", "label": "Zero-JS Native HTTP POST Mode", "tappable": false},
                {"id": "enhanced_rpc", "label": "Enhanced Fetch RPC Stream Mode", "tappable": false},
                {"id": "db_mutation", "label": "Authoritative Database Mutation", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The user submits a purchase form; React supports both Zero-JS and enhanced modes natively.", "values": {"form_submit": {"text": "\"Submit Event\""}, "zero_js_mode": {"text": "\"Ready\""}, "enhanced_rpc": {"text": "\"Ready\""}, "db_mutation": {"text": "\"Standby\""}}, "tones": {"form_submit": "data", "zero_js_mode": "ok", "enhanced_rpc": "ok", "db_mutation": "idle"}, "arrows": [["form_submit", "zero_js_mode"], ["form_submit", "enhanced_rpc"]]},
                {"at": "say2", "caption": "If JavaScript is disabled or downloading, the browser falls back to native HTTP POST.", "values": {"form_submit": {"text": "\"Zero-JS Detected\""}, "zero_js_mode": {"text": "\"URL-Encoded Body\""}, "enhanced_rpc": {"text": "\"Bypassed\""}, "db_mutation": {"text": "\"Executing\""}}, "tones": {"form_submit": "ok", "zero_js_mode": "ok", "enhanced_rpc": "idle", "db_mutation": "data"}, "arrows": [["zero_js_mode", "db_mutation"]]},
                {"at": "say3", "caption": "When hydrated, React intercepts the form and dispatches an asynchronous fetch RPC with Next-Action headers.", "values": {"form_submit": {"text": "\"Hydrated\""}, "zero_js_mode": {"text": "\"Enhanced\""}, "enhanced_rpc": {"text": "\"Next-Action RPC\""}, "db_mutation": {"text": "\"Executing\""}}, "tones": {"form_submit": "ok", "zero_js_mode": "idle", "enhanced_rpc": "ok", "db_mutation": "data"}, "arrows": [["enhanced_rpc", "db_mutation"]]},
                {"at": "say4", "caption": "Both pathways mutate the database securely, ensuring bulletproof application resilience.", "values": {"form_submit": {"text": "\"Complete\""}, "zero_js_mode": {"text": "\"303 Redirect\""}, "enhanced_rpc": {"text": "\"Smooth Transition\""}, "db_mutation": {"text": "\"ACID Committed\""}}, "tones": {"form_submit": "ok", "zero_js_mode": "ok", "enhanced_rpc": "ok", "db_mutation": "ok"}}
            ]
        },
        {
            "template": "states",
            "title": "React 19 useActionState & useFormStatus Lifecycle",
            "states": [
                {"id": "act_idle", "label": "Idle State", "desc": "Initial state: { count: 0, error: null }."},
                {"id": "act_pending", "label": "isPending: True", "desc": "Transition starts; submit button displays loading spinner."},
                {"id": "act_exec", "label": "Server Action Execution", "desc": "Server processes FormData and executes validation logic."},
                {"id": "act_commit", "label": "State Committed", "desc": "Action returns updated state; UI re-renders cleanly."}
            ],
            "current": "act_idle",
            "steps": [
                {"at": "say1", "caption": "useActionState initializes with baseline state and binds the server action function.", "values": {"act_idle": {"text": "\"count: 0, pending: false\""}, "act_pending": {"text": "\"Idle\""}, "act_exec": {"text": "\"Idle\""}, "act_commit": {"text": "\"Idle\""}}, "tones": {"act_idle": "ok", "act_pending": "idle", "act_exec": "idle", "act_commit": "idle"}},
                {"at": "say2", "caption": "Upon form submission, isPending toggles to true; useFormStatus updates child buttons automatically.", "values": {"act_idle": {"text": "\"Submitting\""}, "act_pending": {"text": "\"isPending: true\""}, "act_exec": {"text": "\"Network RPC In-Flight\""}, "act_commit": {"text": "\"Standby\""}}, "tones": {"act_idle": "data", "act_pending": "ok", "act_exec": "data", "act_commit": "idle"}},
                {"at": "say3", "caption": "The Server Action executes on Node.js, validating inputs and updating database state.", "values": {"act_idle": {"text": "\"Waiting\""}, "act_pending": {"text": "\"Pending\""}, "act_exec": {"text": "\"Database Committed\""}, "act_commit": {"text": "\"Payload Returned\""}}, "tones": {"act_idle": "data", "act_pending": "data", "act_exec": "ok", "act_commit": "data"}},
                {"at": "say4", "caption": "State is updated atomically, loading flags reset to false, and validation feedback displays.", "values": {"act_idle": {"text": "\"Ready\""}, "act_pending": {"text": "\"isPending: false\""}, "act_exec": {"text": "\"Done\""}, "act_commit": {"text": "\"count: 3, success: true\""}}, "tones": {"act_idle": "ok", "act_pending": "ok", "act_exec": "ok", "act_commit": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "Optimistic UI Updates with useOptimistic & Rollback Safeguards",
            "nodes": [
                {"id": "user_action", "label": "User Requests Item Reservation", "tappable": false},
                {"id": "optimistic_proj", "label": "Immediate Client Projection (0ms)", "tappable": false},
                {"id": "server_action", "label": "Server Action Database Check", "tappable": false},
                {"id": "reconcile_step", "label": "Commit or Automatic Rollback", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The user initiates a cart purchase; useOptimistic projects the updated count in 0 milliseconds.", "values": {"user_action": {"text": "\"Buy 2 Units\""}, "optimistic_proj": {"text": "\"Cart: 2, Stock: 8\""}, "server_action": {"text": "\"Dispatched\""}, "reconcile_step": {"text": "\"Pending\""}}, "tones": {"user_action": "data", "optimistic_proj": "ok", "server_action": "data", "reconcile_step": "idle"}, "arrows": [["user_action", "optimistic_proj"], ["user_action", "server_action"]]},
                {"at": "say2", "caption": "The UI updates immediately with zero perceptible lag while the server action executes.", "values": {"user_action": {"text": "\"Active\""}, "optimistic_proj": {"text": "\"Instant Feedback\""}, "server_action": {"text": "\"Checking Inventory\""}, "reconcile_step": {"text": "\"Waiting\""}}, "tones": {"user_action": "ok", "optimistic_proj": "ok", "server_action": "data", "reconcile_step": "idle"}, "arrows": [["server_action", "reconcile_step"]]},
                {"at": "say3", "caption": "If the database has stock, the mutation commits and authoritative server state synchronizes.", "values": {"user_action": {"text": "\"Success\""}, "optimistic_proj": {"text": "\"Committed\""}, "server_action": {"text": "\"Stock Verified (8)\""}, "reconcile_step": {"text": "\"Success Confirmed\""}}, "tones": {"user_action": "ok", "optimistic_proj": "ok", "server_action": "ok", "reconcile_step": "ok"}},
                {"at": "say4", "caption": "If out of stock, React automatically discards the projection and rolls back to server stock atomically.", "values": {"user_action": {"text": "\"Failed\""}, "optimistic_proj": {"text": "\"Rolled Back\""}, "server_action": {"text": "\"Rejected: 0 Units\""}, "reconcile_step": {"text": "\"Atomic Rollback Safe\""}}, "tones": {"user_action": "error", "optimistic_proj": "error", "server_action": "error", "reconcile_step": "ok"}}
            ]
        },
        {
            "template": "boxes",
            "title": "End-to-End Server Action RPC & Reconciliation Engine",
            "boxes": [
                {"id": "client_dispatcher", "label": "Client Form Dispatcher (useOptimistic)", "tappable": false},
                {"id": "rpc_gateway", "label": "Secure RPC Gateway (Next-Action)", "tappable": false},
                {"id": "authoritative_db", "label": "Authoritative Database (ACID Inventory Lock)", "tappable": false},
                {"id": "cache_revalidate", "label": "RSC Cache Revalidation (revalidatePath)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The client dispatcher packages user inputs and projects optimistic UI updates.", "values": {"client_dispatcher": {"text": "\"Optimistic Cart +1\""}, "rpc_gateway": {"text": "\"POST Form\""}, "authoritative_db": {"text": "\"Stock: 50\""}, "cache_revalidate": {"text": "\"Standby\""}}, "tones": {"client_dispatcher": "ok", "rpc_gateway": "data", "authoritative_db": "ok", "cache_revalidate": "idle"}},
                {"at": "say2", "caption": "The RPC gateway validates authentication cookies and invokes the server function securely.", "values": {"client_dispatcher": {"text": "\"In-Flight\""}, "rpc_gateway": {"text": "\"Action Verified\""}, "authoritative_db": {"text": "\"Row Locked\""}, "cache_revalidate": {"text": "\"Standby\""}}, "tones": {"client_dispatcher": "data", "rpc_gateway": "ok", "authoritative_db": "data", "cache_revalidate": "idle"}},
                {"at": "say3", "caption": "The database executes an atomic inventory decrement: remaining inventory becomes 45.", "values": {"client_dispatcher": {"text": "\"Optimistic OK\""}, "rpc_gateway": {"text": "\"200 OK\""}, "authoritative_db": {"text": "\"Stock: 45\""}, "cache_revalidate": {"text": "\"Purging Cache\""}}, "tones": {"client_dispatcher": "ok", "rpc_gateway": "ok", "authoritative_db": "ok", "cache_revalidate": "data"}},
                {"at": "say4", "caption": "revalidatePath purges stale server caches, streaming updated catalog data in the same response.", "values": {"client_dispatcher": {"text": "\"Synced\""}, "rpc_gateway": {"text": "\"Response Streamed\""}, "authoritative_db": {"text": "\"Consistent (45)\""}, "cache_revalidate": {"text": "\"Caches Revalidated\""}}, "tones": {"client_dispatcher": "ok", "rpc_gateway": "ok", "authoritative_db": "ok", "cache_revalidate": "ok"}}
            ]
        }
    ],
    45: [
        {
            "template": "component-tree",
            "title": "Milestone 8 Hybrid RSC Architecture: Complete Enterprise Topology",
            "items": [
                {"id": "cat_root", "label": "ProductCatalogServerLayout (Server Component)", "depth": 0, "status": "active"},
                {"id": "spec_node", "label": "ServerProductDescription (Zero-Bundle Specs)", "depth": 1, "status": "active"},
                {"id": "qty_island", "label": "InteractiveQuantityPicker (Client Island)", "depth": 1, "status": "active"},
                {"id": "cart_island", "label": "InteractiveAddToCartButton (Client Island)", "depth": 1, "status": "active"},
                {"id": "reviews_stream", "label": "CustomerReviewsStreamingBoundary (Suspense Boundary)", "depth": 1, "status": "active"}
            ],
            "steps": [
                {"at": "say1", "caption": "The catalog layout executes on the server, querying database inventory and markdown specs.", "values": {"cat_root": {"text": "\"Server Root\""}, "spec_node": {"text": "\"Queued\""}, "qty_island": {"text": "\"Boundary\""}, "cart_island": {"text": "\"Boundary\""}, "reviews_stream": {"text": "\"Suspense Slot\""}}, "tones": {"cat_root": "ok", "spec_node": "idle", "qty_island": "data", "cart_island": "data", "reviews_stream": "data"}},
                {"at": "say2", "caption": "Heavy markdown and syntax tokenizers execute with 0 KB client bundle overhead.", "values": {"cat_root": {"text": "\"Layout Shell\""}, "spec_node": {"text": "\"Rendered 0KB\""}, "qty_island": {"text": "\"M1 Module\""}, "cart_island": {"text": "\"M2 Module\""}, "reviews_stream": {"text": "\"B:reviews Slot\""}}, "tones": {"cat_root": "ok", "spec_node": "ok", "qty_island": "data", "cart_island": "data", "reviews_stream": "data"}},
                {"at": "say3", "caption": "Interactive cart islands hydrate selectively with user-click priority promotion.", "values": {"cat_root": {"text": "\"Static Shell\""}, "spec_node": {"text": "\"Static DOM\""}, "qty_island": {"text": "\"Hydrated\""}, "cart_island": {"text": "\"Hydrated & Bound\""}, "reviews_stream": {"text": "\"Streaming...\""}}, "tones": {"cat_root": "ok", "spec_node": "ok", "qty_island": "ok", "cart_island": "ok", "reviews_stream": "data"}},
                {"at": "say4", "caption": "Customer reviews stream out-of-order, completing the full hybrid application lifecycle.", "values": {"cat_root": {"text": "\"Certified\""}, "spec_node": {"text": "\"Zero Leaks\""}, "qty_island": {"text": "\"Active\""}, "cart_island": {"text": "\"Active\""}, "reviews_stream": {"text": "\"Swapped & Hydrated\""}}, "tones": {"cat_root": "ok", "spec_node": "ok", "qty_island": "ok", "cart_island": "ok", "reviews_stream": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "Server Component Catalog Engine Pipeline",
            "nodes": [
                {"id": "inv_db", "label": "Direct Database Query (PostgreSQL / Memory)", "tappable": false},
                {"id": "spec_compiler", "label": "Server Markdown & Spec Compiler", "tappable": false},
                {"id": "shell_gen", "label": "HTML Shell Generation (<4ms)", "tappable": false},
                {"id": "stream_output", "label": "Zero-Bundle Streamed Delivery", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The catalog engine retrieves real-time product records directly from backend storage.", "values": {"inv_db": {"text": "\"2 Products Loaded\""}, "spec_compiler": {"text": "\"Pending\""}, "shell_gen": {"text": "\"Pending\""}, "stream_output": {"text": "\"Standby\""}}, "tones": {"inv_db": "ok", "spec_compiler": "idle", "shell_gen": "idle", "stream_output": "idle"}, "arrows": [["inv_db", "spec_compiler"]]},
                {"at": "say2", "caption": "Server-side parsers compile technical hardware specifications into semantic HTML tags.", "values": {"inv_db": {"text": "\"Done\""}, "spec_compiler": {"text": "\"Watts & VRAM Parsed\""}, "shell_gen": {"text": "\"Compiling\""}, "stream_output": {"text": "\"Standby\""}}, "tones": {"inv_db": "ok", "spec_compiler": "ok", "shell_gen": "data", "stream_output": "idle"}, "arrows": [["spec_compiler", "shell_gen"]]},
                {"at": "say3", "caption": "The engine constructs the initial HTML shell, embedding the Suspense B:reviews template.", "values": {"inv_db": {"text": "\"Done\""}, "spec_compiler": {"text": "\"Done\""}, "shell_gen": {"text": "\"Shell Ready (4ms)\""}, "stream_output": {"text": "\"Streaming\""}}, "tones": {"inv_db": "ok", "spec_compiler": "ok", "shell_gen": "ok", "stream_output": "data"}, "arrows": [["shell_gen", "stream_output"]]},
                {"at": "say4", "caption": "The shell flushes immediately, delivering sub-50ms TTFB with exactly 0 KB client dependencies.", "values": {"inv_db": {"text": "\"Pooled DB\""}, "spec_compiler": {"text": "\"0 KB Shipped\""}, "shell_gen": {"text": "\"TTFB: 38ms\""}, "stream_output": {"text": "\"Flushed & Preloading\""}}, "tones": {"inv_db": "ok", "spec_compiler": "ok", "shell_gen": "ok", "stream_output": "ok"}}
            ]
        },
        {
            "template": "states",
            "title": "Streaming Reviews & Selective Hydration Lifecycle",
            "states": [
                {"id": "st_skeleton", "label": "Shell Fallback (B:rev)", "desc": "Initial shell renders template placeholder and review spinner."},
                {"id": "st_chunk", "label": "Out-of-Order Chunk (S:rev)", "desc": "Reviews HTML emitted with $RC inline DOM replacement script."},
                {"id": "st_swap", "label": "Seamless DOM Swap", "desc": "Fallback replaced with verified 5-star customer reviews."},
                {"id": "st_selective", "label": "Selective Island Hydration", "desc": "AddToCart hydrates with priority promotion upon user click."}
            ],
            "current": "st_skeleton",
            "steps": [
                {"at": "say1", "caption": "The initial shell displays an animated review skeleton while the customer reads product pricing.", "values": {"st_skeleton": {"text": "\"B:rev Active\""}, "st_chunk": {"text": "\"Querying DB\""}, "st_swap": {"text": "\"Pending\""}, "st_selective": {"text": "\"Cart Ready\""}}, "tones": {"st_skeleton": "data", "st_chunk": "data", "st_swap": "idle", "st_selective": "ok"}},
                {"at": "say2", "caption": "When reviews resolve on the server, an out-of-order chunk is written with inline $RC script.", "values": {"st_skeleton": {"text": "\"Targeting B:rev\""}, "st_chunk": {"text": "\"S:rev Emitted\""}, "st_swap": {"text": "\"Replacing\""}, "st_selective": {"text": "\"Cart Bound\""}}, "tones": {"st_skeleton": "ok", "st_chunk": "ok", "st_swap": "data", "st_selective": "ok"}},
                {"at": "say3", "caption": "$RC swaps the live verified reviews into the DOM with zero cumulative layout shift (CLS).", "values": {"st_skeleton": {"text": "\"Removed\""}, "st_chunk": {"text": "\"Unpacked\""}, "st_swap": {"text": "\"Reviews Mounted\""}, "st_selective": {"text": "\"Cart Bound\""}}, "tones": {"st_skeleton": "idle", "st_chunk": "ok", "st_swap": "ok", "st_selective": "ok"}},
                {"at": "say4", "caption": "User clicks on AddToCart trigger immediate priority promotion and event replay.", "values": {"st_skeleton": {"text": "\"Done\""}, "st_chunk": {"text": "\"Done\""}, "st_swap": {"text": "\"Stable DOM\""}, "st_selective": {"text": "\"Replay Executed\""}}, "tones": {"st_skeleton": "ok", "st_chunk": "ok", "st_swap": "ok", "st_selective": "ok"}}
            ]
        },
        {
            "template": "flow",
            "title": "Server Action Checkout & Optimistic Reservation",
            "nodes": [
                {"id": "click_buy", "label": "Customer Taps 'Add to Cart'", "tappable": false},
                {"id": "opt_cart", "label": "useOptimistic Projection (Cart +2)", "tappable": false},
                {"id": "action_rpc", "label": "Server Action (reserveAndCheckoutAction)", "tappable": false},
                {"id": "commit_reval", "label": "ACID Commit & revalidatePath", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "The customer taps Add to Cart; useOptimistic increments the cart count immediately in 0ms.", "values": {"click_buy": {"text": "\"Tapped (2 Units)\""}, "opt_cart": {"text": "\"CartCount: 2\""}, "action_rpc": {"text": "\"In-Flight\""}, "commit_reval": {"text": "\"Standby\""}}, "tones": {"click_buy": "data", "opt_cart": "ok", "action_rpc": "data", "commit_reval": "idle"}, "arrows": [["click_buy", "opt_cart"], ["click_buy", "action_rpc"]]},
                {"at": "say2", "caption": "The form action executes as an enhanced RPC (or native POST if JavaScript is disabled).", "values": {"click_buy": {"text": "\"Active\""}, "opt_cart": {"text": "\"Optimistic Active\""}, "action_rpc": {"text": "\"Server Validating\""}, "commit_reval": {"text": "\"Checking Stock\""}}, "tones": {"click_buy": "ok", "opt_cart": "ok", "action_rpc": "data", "commit_reval": "data"}, "arrows": [["action_rpc", "commit_reval"]]},
                {"at": "say3", "caption": "If inventory is available, stock decrements from 10 to 8, and the order commits securely.", "values": {"click_buy": {"text": "\"Success\""}, "opt_cart": {"text": "\"Committed (2)\""}, "action_rpc": {"text": "\"Transaction OK\""}, "commit_reval": {"text": "\"Stock: 8 (Committed)\""}}, "tones": {"click_buy": "ok", "opt_cart": "ok", "action_rpc": "ok", "commit_reval": "ok"}},
                {"at": "say4", "caption": "If out of stock, React automatically rolls back the optimistic cart count atomically.", "values": {"click_buy": {"text": "\"Failed\""}, "opt_cart": {"text": "\"Rolled Back to 2\""}, "action_rpc": {"text": "\"Error: Insufficient\""}, "commit_reval": {"text": "\"Consistent (8)\""}}, "tones": {"click_buy": "error", "opt_cart": "error", "action_rpc": "error", "commit_reval": "ok"}}
            ]
        },
        {
            "template": "boxes",
            "title": "Milestone 8 Production Performance & Reliability Audit",
            "boxes": [
                {"id": "tbt_box", "label": "Total Blocking Time (TBT): 0ms (60 FPS PASS)", "tappable": false},
                {"id": "ttfb_box", "label": "Time to First Byte (TTFB): 38ms (Sub-50ms PASS)", "tappable": false},
                {"id": "deps_box", "label": "Client Shipped Dependencies: 0 KB (Zero-Bundle PASS)", "tappable": false},
                {"id": "fall_box", "label": "Zero-JS Form & Rollback Safeguards: VERIFIED (PASS)", "tappable": false}
            ],
            "steps": [
                {"at": "say1", "caption": "Audit Criterion 1: Total Blocking Time is certified at exactly 0ms with zero long tasks.", "values": {"tbt_box": {"text": "\"0ms (60 FPS)\""}, "ttfb_box": {"text": "\"Auditing\""}, "deps_box": {"text": "\"Auditing\""}, "fall_box": {"text": "\"Auditing\""}}, "tones": {"tbt_box": "ok", "ttfb_box": "data", "deps_box": "data", "fall_box": "data"}},
                {"at": "say2", "caption": "Audit Criterion 2: Time to First Byte flushes in 38ms, easily beating the 100ms benchmark.", "values": {"tbt_box": {"text": "\"PASS\""}, "ttfb_box": {"text": "\"38ms (PASS)\""}, "deps_box": {"text": "\"Auditing\""}, "fall_box": {"text": "\"Auditing\""}}, "tones": {"tbt_box": "ok", "ttfb_box": "ok", "deps_box": "data", "fall_box": "data"}},
                {"at": "say3", "caption": "Audit Criterion 3: Zero client dependency leakage: 0 KB parser code in browser bundle.", "values": {"tbt_box": {"text": "\"PASS\""}, "ttfb_box": {"text": "\"PASS\""}, "deps_box": {"text": "\"0 KB (PASS)\""}, "fall_box": {"text": "\"Auditing\""}}, "tones": {"tbt_box": "ok", "ttfb_box": "ok", "deps_box": "ok", "fall_box": "data"}},
                {"at": "say4", "caption": "Overall Production Certification: GRADE A+ ENTERPRISE PRODUCTION READY.", "values": {"tbt_box": {"text": "\"PASS (0ms)\""}, "ttfb_box": {"text": "\"PASS (38ms)\""}, "deps_box": {"text": "\"PASS (0KB)\""}, "fall_box": {"text": "\"PASS (Certified)\""}}, "tones": {"tbt_box": "ok", "ttfb_box": "ok", "deps_box": "ok", "fall_box": "ok"}}
            ]
        }
    ]
}

for day_num in range(41, 46):
    day_data = next(d for d in all_days if d['day'] == day_num)
    visual_specs = visual_templates_by_day[day_num]
    entries = []

    for i in range(5):
        part = day_data['parts'][i]
        spec = visual_specs[i]
        code_hash = sha256(part.get('code', ''))
        entries.append({
            "partTitle": part["title"],
            "codeHash": code_hash,
            "spec": spec,
            "filled": True
        })

    day_json_path = os.path.join(VISUALS_DIR, f"day-{day_num}.json")
    out_obj = {
        "schemaVersion": 2,
        "prefix": "react-basics",
        "day": day_num,
        "promptSha": "block9_generated",
        "model": "gpt-4o",
        "entries": entries
    }

    with open(day_json_path, 'w', encoding='utf-8') as f:
        json.dump(out_obj, f, indent=2)

    print(f"Generated {day_json_path} successfully!")

print("All Gate v2 visuals for Days 41-45 generated successfully!")
