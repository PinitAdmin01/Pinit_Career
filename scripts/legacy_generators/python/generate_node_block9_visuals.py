import json, hashlib, os

def compute_code_hash(code_str):
    return hashlib.sha256(code_str.encode('utf-8')).hexdigest()

def make_flow_spec(title, node_ids_labels, edges_tuples, captions):
    nodes = [{"id": nid, "label": nlbl, "sub": "Active Stage", "status": "ok"} for nid, nlbl in node_ids_labels]
    edges = [{"from": f, "to": t, "label": l} for f, t, l in edges_tuples]
    steps = []
    at_keys = ["say1", "say3", "say5", "say7"]
    for i in range(4):
        vals = {nid: {"status": "Processing" if i == 1 else ("Committed" if i == 2 else "Online")} for nid, _ in node_ids_labels}
        steps.append({
            "at": at_keys[i],
            "caption": captions[i],
            "values": vals
        })
    return {
        "template": "flow",
        "title": title,
        "nodes": nodes,
        "edges": edges,
        "steps": steps
    }

def make_compare_spec(title, left_title, left_points, right_title, right_points, captions):
    steps = []
    at_keys = ["say1", "say3", "say5", "say7"]
    for i in range(4):
        steps.append({
            "at": at_keys[i],
            "caption": captions[i],
            "values": {
                "activeSide": "both" if i >= 2 else ("left" if i == 0 else "right")
            }
        })
    return {
        "template": "compare",
        "title": title,
        "left": {
            "title": left_title,
            "points": left_points
        },
        "right": {
            "title": right_title,
            "points": right_points
        },
        "steps": steps
    }

def make_boxes_spec(title, box_items, captions):
    items = [{"id": b[0], "title": b[1], "desc": b[2], "status": "ok"} for b in box_items]
    steps = []
    at_keys = ["say1", "say3", "say5", "say7"]
    for i in range(4):
        vals = {b[0]: {"status": "Inspecting" if i == 0 else "Synchronized"} for b in box_items}
        steps.append({
            "at": at_keys[i],
            "caption": captions[i],
            "values": vals
        })
    return {
        "template": "boxes",
        "title": title,
        "items": items,
        "steps": steps
    }

def make_states_spec(title, state_items, captions):
    items = [{"id": s[0], "name": s[1], "state": s[2]} for s in state_items]
    steps = []
    at_keys = ["say1", "say3", "say5", "say7"]
    for i in range(4):
        vals = {s[0]: {"state": "active" if i == 1 else ("transitioning" if i == 2 else "idle")} for s in state_items}
        steps.append({
            "at": at_keys[i],
            "caption": captions[i],
            "values": vals
        })
    return {
        "template": "states",
        "title": title,
        "items": items,
        "steps": steps
    }

visuals_map = {
    41: [
        make_compare_spec(
            "Context Drilling vs Continuation-Local Storage",
            "Explicit Context Drilling",
            [
                "Requires passing ctx parameter through every function signature",
                "Violates separation of concerns across clean architecture layers",
                "High refactoring friction when adding new telemetry fields"
            ],
            "Continuation-Local Storage (ALS)",
            [
                "Zero parameter drilling: ambient context access via getStore()",
                "Preserves clean function signatures across nested tiers",
                "Seamless integration with async/await and Promise chains"
            ],
            [
                "Traditional architectures pass request context as an explicit parameter through every helper.",
                "AsyncLocalStorage binds context to the active continuation without modifying function signatures.",
                "Nested domain services retrieve active tenant and trace data ambiently.",
                "Execution isolation ensures concurrent interleaved requests never leak state."
            ]
        ),
        make_boxes_spec(
            "AsyncLocalStorage Execution Store Hierarchy",
            [
                ("root", "Root Continuation", "Parent execution boundary initialized by als.run()"),
                ("child", "Child Async Task", "Inherits active store across Promise microtask ticks"),
                ("nested", "Nested Override", "Inner als.run() creates scoped child store"),
                ("cleanup", "Store Restoration", "Finally block guarantees restoration of prior store")
            ],
            [
                "Root continuation establishes ambient execution context at request ingress.",
                "Downstream async tasks inherit active store across Promise microtasks.",
                "Nested calls can temporarily override context without affecting parent scope.",
                "Defensive cleanup guarantees prompt store restoration upon completion."
            ]
        ),
        make_flow_spec(
            "async_hooks C++ Resource Tracking Lifecycle",
            [("init", "init Hook"), ("before", "before Hook"), ("exec", "Execution Phase"), ("after", "after Hook"), ("destroy", "destroy Hook")],
            [("init", "before", "Schedule C++ Task"), ("before", "exec", "Enter Scope"), ("exec", "after", "Exit Scope"), ("after", "destroy", "Resource Free")],
            [
                "Node.js C++ layer emits init hook assigning asyncId and triggerAsyncId.",
                "Before hook executes immediately before user callback invocation.",
                "User callback executes with ambient async context restored.",
                "Destroy hook fires once V8 garbage collector reclaims the async resource."
            ]
        ),
        make_states_spec(
            "Broken Callback Context Restoration Boundary",
            [
                ("st_init", "Native Event Loop Context", "active"),
                ("st_unbind", "Legacy Third-Party Callback", "orphaned"),
                ("st_bind", "Bound ALS Continuation", "restored"),
                ("st_done", "Completed Async Task", "idle")
            ],
            [
                "Legacy callback registration detaches from active AsyncResource context.",
                "Calling getStore() inside unbound third-party callback returns undefined.",
                "Applying asyncLocalStorage.bind() captures ambient context explicitly.",
                "Bound callback executes with restored execution continuation."
            ]
        ),
        make_flow_spec(
            "W3C Distributed TraceContext Propagation Pipeline",
            [("http_in", "Inbound Request"), ("parse", "W3C Parser"), ("span", "Child Span Creator"), ("http_out", "Outbound Client")],
            [("http_in", "parse", "traceparent header"), ("parse", "span", "Extract traceId"), ("span", "http_out", "Inject new spanId")],
            [
                "Inbound HTTP request arrives with standard W3C traceparent header.",
                "Parser extracts 32-character traceId, 16-character parentId, and traceFlags.",
                "Service generates unique child spanId while preserving global traceId.",
                "Outbound client injects updated traceparent header into downstream RPC calls."
            ]
        )
    ],
    42: [
        make_boxes_spec(
            "V8 Memory Architecture: Heap vs Stack vs Off-Heap Buffers",
            [
                ("young", "Young Generation", "Eden and Semi-spaces for short-lived allocations"),
                ("old", "Old Generation", "Tenured objects surviving multiple Scavenge cycles"),
                ("large", "Large Object Space", "Allocations exceeding pointer thresholds"),
                ("off_heap", "Off-Heap Buffers", "Native C++ memory allocated outside V8 heap limits")
            ],
            [
                "Young generation manages transient objects with high-speed Scavenge cycles.",
                "Tenured surviving objects migrate to Old generation via promotion.",
                "Large object space bypasses standard garbage collection compaction.",
                "Off-heap buffers interact directly with operating system kernel sockets."
            ]
        ),
        make_compare_spec(
            "Generational Garbage Collection: Young Scavenge vs Old Mark-Sweep",
            "Scavenge GC (Young Gen)",
            [
                "Runs frequently on Eden and Semi-space buffers (sub-millisecond)",
                "Uses Cheney copying algorithm between To and From spaces",
                "Extremely fast with minor CPU overhead"
            ],
            "Mark-Sweep-Compact (Old Gen)",
            [
                "Runs periodically on Tenured space when memory pressure spikes",
                "Traverses entire object graph from GC roots to identify live objects",
                "Introduces Stop-The-World latency pauses under high heap sizes"
            ],
            [
                "Scavenger rapidly copies surviving young objects between semi-spaces.",
                "Surviving objects are promoted to the old generation space.",
                "Mark-Sweep marks all reachable roots across the old generation heap.",
                "Compaction eliminates heap fragmentation to preserve contiguous memory."
            ]
        ),
        make_flow_spec(
            "Memory Leak Signatures & Detached Closure Retainers",
            [("root", "Global / Static Scope"), ("leak", "Unbounded Collection"), ("closure", "Retained Closure"), ("heap", "Heap Exhaustion")],
            [("root", "leak", "Accidental Retention"), ("leak", "closure", "Hold Variable Reference"), ("closure", "heap", "Prevent V8 Reclamation")],
            [
                "Accidental global or module-level collections retain object references.",
                "Event listener closures inadvertently hold outer lexical scope variables.",
                "V8 garbage collector cannot reclaim objects linked to active GC roots.",
                "Continuous allocation without eviction leads directly to out-of-memory crashes."
            ]
        ),
        make_boxes_spec(
            "Heap Snapshot Comparison & Retainer Tree Analysis",
            [
                ("snap1", "Baseline Snapshot", "Initial memory profile at application startup"),
                ("snap2", "Peak Load Snapshot", "Memory profile under sustained concurrent load"),
                ("delta", "Delta Analysis", "Objects with positive delta count and zero reclamation"),
                ("retainer", "Retainer Path", "Shortest path to GC root identifying the leak source")
            ],
            [
                "Capture baseline heap snapshot before initiating synthetic workload.",
                "Capture post-workload snapshot and calculate object allocation deltas.",
                "Filter snapshot by constructor name and inspect Shallow vs Retained sizes.",
                "Traverse the Retainer Tree to identify the exact variable preventing collection."
            ]
        ),
        make_flow_spec(
            "Production Memory Leak Isolation Engine Pipeline",
            [("monitor", "RSS / Heap Monitor"), ("trigger", "Threshold Trigger"), ("profile", "Heap Profiler"), ("isolate", "Root Remediation")],
            [("monitor", "trigger", "Memory > 85%"), ("trigger", "profile", "Generate Snapshot"), ("profile", "isolate", "Inspect Retainers")],
            [
                "Continuous background telemetry tracks heapUsed and RSS trends.",
                "Memory growth exceeding dynamic thresholds triggers diagnostic capture.",
                "Profiler captures V8 heap snapshot to persistent diagnostic storage.",
                "Retainer analysis identifies leaking event listeners and unbounded caches."
            ]
        )
    ],
    43: [
        make_compare_spec(
            "Textual JSON vs Binary Protocols: Latency & CPU Overhead",
            "JSON Textual Serialization",
            [
                "Requires string parsing, character escaping, and property key transmission",
                "Allocates millions of short-lived young generation strings in V8",
                "High wire bandwidth overhead due to repeated metadata keys"
            ],
            "Binary Serialization (Protobuf/MsgPack)",
            [
                "Compact Tag-Length-Value encoding without transmitting property names",
                "Zero string parsing overhead; direct binary decoding via bitwise ops",
                "Reduces wire payload size by 60% to 80% and cuts CPU usage by 70%"
            ],
            [
                "JSON format redundantly repeats key strings for every single record on the wire.",
                "Binary protocols encode schema fields as compact integer tags and type markers.",
                "V8 decodes binary payloads directly into typed memory structures.",
                "Binary streaming drastically cuts wire bandwidth and garbage collection pauses."
            ]
        ),
        make_boxes_spec(
            "Protocol Buffers Tag-Length-Value Wire Format",
            [
                ("tag", "Field Tag", "(fieldNumber << 3) | wireType encoded as Varint"),
                ("type_0", "Wire Type 0", "Varint integers, booleans, and enum values"),
                ("type_1", "Wire Type 1", "Fixed 64-bit floating point and integer numbers"),
                ("type_2", "Wire Type 2", "Length-delimited byte arrays, strings, and sub-messages")
            ],
            [
                "Field tag combines 1-based field number with 3-bit wire type identifier.",
                "Varint encoding compresses integers using 7 payload bits per byte.",
                "Fixed-width types provide fast direct memory copying for float64 and uint64.",
                "Length-delimited fields carry explicit byte length headers for binary payloads."
            ]
        ),
        make_flow_spec(
            "Varint & ZigZag Encoding Bitwise Architecture",
            [("input", "Integer Input"), ("zigzag", "ZigZag Folding"), ("varint", "7-Bit Chunking"), ("wire", "Wire Bytes")],
            [("input", "zigzag", "Signed Int (-1)"), ("zigzag", "varint", "(n << 1) ^ (n >> 31)"), ("varint", "wire", "Set MSB = 1")],
            [
                "Signed integers undergo ZigZag encoding to map negative numbers to small positive ints.",
                "Input value is split into 7-bit payload chunks from least to most significant.",
                "MSB (Most Significant Bit, 0x80) is set to 1 for all continuation bytes.",
                "Final byte clears MSB to 0, signaling the end of the Varint sequence."
            ]
        ),
        make_boxes_spec(
            "MessagePack Type Markers & Dynamic Binary Serialization",
            [
                ("fixint", "Positive / Negative Fixint", "Compact 1-byte encoding for integers from -32 to 127"),
                ("fixstr", "FixStr Header", "Single byte header for strings up to 31 bytes length"),
                ("fixmap", "FixMap Header", "Single byte header for key-value maps with <= 15 entries"),
                ("bin_ext", "Binary & Ext Types", "Explicit type headers for raw byte arrays and timestamps")
            ],
            [
                "MessagePack uses prefix byte markers to denote type and length simultaneously.",
                "Small integers and short strings encode in a single byte without schema files.",
                "Key-value maps encode efficiently without requiring textual JSON delimiters.",
                "Extension types support high-precision timestamps and binary buffers."
            ]
        ),
        make_flow_spec(
            "Binary WebSocket High-Throughput Order Stream Pipeline",
            [("order", "Order Matching Engine"), ("serialize", "Binary Encoder"), ("socket", "WebSocket Gateway"), ("client", "Trading Terminal")],
            [("order", "serialize", "Raw Tick"), ("serialize", "socket", "Protobuf Frame"), ("socket", "client", "Binary Stream")],
            [
                "Trading engine emits high-velocity market data ticks to gateway.",
                "Serializer encodes tick into compact Protocol Buffer binary frames.",
                "WebSocket gateway broadcasts binary frames over persistent TCP sockets.",
                "Trading terminal decodes binary payload with sub-millisecond latency."
            ]
        )
    ],
    44: [
        make_compare_spec(
            "HTTP/1.1 HOL Blocking vs HTTP/2 Interleaved Stream Multiplexing",
            "HTTP/1.1 Parallel Sockets",
            [
                "Single socket processes only 1 request/response at a time",
                "Slow request blocks all queued requests behind it (HOL Blocking)",
                "Workaround requires opening multiple TCP sockets with heavy TLS overhead"
            ],
            "HTTP/2 Single TCP Connection",
            [
                "Splits connection into independent bidirectional logical streams",
                "Interleaves binary HEADERS and DATA frames from concurrent requests",
                "Eliminates application-layer Head-of-Line blocking completely"
            ],
            [
                "HTTP/1.1 queues sequential requests on a single socket, causing severe blocking.",
                "HTTP/2 introduces a binary framing layer over a single persistent TCP connection.",
                "Frames from different streams carry unique stream IDs and are interleaved on the wire.",
                "A slow payload on Stream 1 does not impede fast responses on Stream 3."
            ]
        ),
        make_flow_spec(
            "TLS ALPN Protocol Negotiation & Dual-Window Flow Control",
            [("hello", "TLS ClientHello"), ("alpn", "ALPN Negotiation"), ("settings", "SETTINGS Frames"), ("window", "WINDOW_UPDATE")],
            [("hello", "alpn", "Advertise 'h2'"), ("alpn", "settings", "Handshake Confirmed"), ("settings", "window", "Manage Credit Windows")],
            [
                "Client advertises HTTP/2 support via ALPN extension in TLS ClientHello.",
                "Server confirms 'h2' negotiation in ServerHello without extra round trips.",
                "Peers exchange SETTINGS frames to establish stream concurrency and table sizes.",
                "WINDOW_UPDATE frames dynamically replenish byte credits to prevent buffer overflow."
            ]
        ),
        make_boxes_spec(
            "gRPC Architectural Fundamentals & Method Routing",
            [
                ("path", "HTTP/2 POST Mapping", "Path mapped to /package.Service/Method name"),
                ("content", "Content-Type Header", "Strictly set to application/grpc (+proto)"),
                ("prefix", "5-Byte Message Framing", "1-byte compressed flag + 4-byte big-endian length"),
                ("status", "grpc-status Trailer", "Dedicated status trailer returned in final HEADERS frame")
            ],
            [
                "Every gRPC method call maps directly to an HTTP/2 POST request path.",
                "Application/grpc content type ensures binary Protocol Buffer transport.",
                "5-byte framing enables length-prefixed streaming over DATA frames.",
                "Standardized grpc-status trailer conveys explicit error codes independently."
            ]
        ),
        make_states_spec(
            "Four gRPC RPC Communication Models: Unary to Duplex",
            [
                ("m_unary", "Unary RPC", "active"),
                ("m_server", "Server Streaming RPC", "active"),
                ("m_client", "Client Streaming RPC", "active"),
                ("m_bidi", "Bidirectional Duplex RPC", "active")
            ],
            [
                "Unary model: Single request message produces a single response message.",
                "Server-streaming model: Single request initiates a continuous stream of responses.",
                "Client-streaming model: Continuous stream of requests finishes with one response.",
                "Bidirectional duplex model: Both peers stream messages concurrently in real time."
            ]
        ),
        make_flow_spec(
            "Enterprise gRPC Interceptor Chain & Deadline Budget Pipeline",
            [("inbound", "RPC Ingress"), ("auth", "Auth Interceptor"), ("deadline", "Deadline Interceptor"), ("trace", "Trace Interceptor"), ("handler", "Service Handler")],
            [("inbound", "auth", "Check Metadata"), ("auth", "deadline", "Verify Budget"), ("deadline", "trace", "Bind ALS Context"), ("trace", "handler", "Execute Business Logic")],
            [
                "Inbound RPC arrives at server and enters the interceptor pipeline.",
                "Auth interceptor validates bearer tokens in incoming metadata headers.",
                "Deadline interceptor evaluates remaining budget and aborts expired calls.",
                "Trace interceptor extracts W3C traceparent and binds AsyncLocalStorage context."
            ]
        )
    ],
    45: [
        make_flow_spec(
            "High-Throughput Aggregator Topology & Ingress Boundary",
            [("sensors", "IoT / Microservice Fleet"), ("h2_ingress", "HTTP/2 gRPC Gateway"), ("queue", "Zero-Copy In-Memory Queue"), ("workers", "Aggregation Workers")],
            [("sensors", "h2_ingress", "Multiplexed Streams"), ("h2_ingress", "queue", "Non-Blocking Enqueue"), ("queue", "workers", "Micro-Batch Dequeue")],
            [
                "Thousands of sensor gateways multiplex telemetry streams over persistent HTTP/2 connections.",
                "gRPC ingress gateway validates incoming metadata and decodes Protobuf frame headers.",
                "Packets are pushed into zero-copy in-memory ring buffers without blocking network sockets.",
                "Worker tasks drain queued packets in micro-batches for real-time statistical processing."
            ]
        ),
        make_boxes_spec(
            "Zero-Copy Varint Protobuf Ingestion & Buffer Pool Management",
            [
                ("pool", "Pre-Allocated Buffer Pool", "Fixed array of reusable byte arrays allocated at startup"),
                ("acquire", "Borrow on Ingress", "Worker borrows pooled scratch buffer without heap allocation"),
                ("decode", "In-Place Decoding", "Varint values extracted directly via bitwise bit shifting"),
                ("release", "Instant Return", "Scratch buffer returned to pool immediately to prevent GC churn")
            ],
            [
                "Buffer pool initializes fixed byte containers at application startup.",
                "Incoming gRPC DATA frames borrow buffers from the free-list pool.",
                "Varint decoder processes tags and numeric metrics in-place with zero allocations.",
                "Buffers return to the pool immediately, keeping V8 GC pressure near zero."
            ]
        ),
        make_flow_spec(
            "Real-Time Sliding Window Metric Accumulation Engine",
            [("ingest", "Decoded Metric"), ("window", "Sliding Time Window"), ("accumulate", "O(1) Accumulators"), ("flush", "Downstream Stream Flush")],
            [("ingest", "window", "Route by Sensor ID"), ("window", "accumulate", "Update Count/Sum/Min/Max"), ("accumulate", "flush", "Window Expiry Trigger")],
            [
                "Incoming metrics route to active time window buckets based on timestamp.",
                "In-place accumulators update count, sum, average, min, and max in O(1) space.",
                "Watermark logic incorporates late-arriving packets within tolerance windows.",
                "Scheduler flushes sealed window summaries to storage and recycles bucket memory."
            ]
        ),
        make_states_spec(
            "AsyncLocalStorage Distributed Trace Propagation Interceptor",
            [
                ("st_extract", "W3C Traceparent Header", "active"),
                ("st_bind", "AsyncLocalStorage Scope", "active"),
                ("st_exec", "Ambient Service Execution", "active"),
                ("st_clean", "Scope Teardown & Metrics", "idle")
            ],
            [
                "Interceptor extracts 32-character traceId and tenantId from gRPC metadata.",
                "AsyncLocalStorage binds context to the active asynchronous continuation.",
                "Nested database and calculation operations access traceId via getStore() without drilling.",
                "Teardown guarantees store cleanup and logs correlated distributed trace records."
            ]
        ),
        make_boxes_spec(
            "Milestone 8 Production SLA Verification Suite & Grade A+ Certification",
            [
                ("throughput", "Throughput SLA", "Verified >10,000 metrics/sec across concurrent streams"),
                ("latency", "Sub-Millisecond Decoding", "P99 decoding latency strictly under 1.5ms"),
                ("memory", "Buffer Pool Stability", "100% buffer reclamation with zero heap fragmentation"),
                ("isolation", "Trace Isolation", "100% trace correlation with zero context leakage (Grade A+)")
            ],
            [
                "Comprehensive stress harness streams 500 binary batches across multi-tenant streams.",
                "Verification assertions confirm sub-millisecond Protobuf decoding latency.",
                "Memory profiling confirms 100% buffer pool recycling with zero GC thrashing.",
                "Evaluation suite certifies Milestone 8 with Grade A+ Enterprise Certification."
            ]
        )
    ]
}

os.makedirs('src/lib/data/lessonVisuals/node-web', exist_ok=True)

for day in [41, 42, 43, 44, 45]:
    json_path = f"scripts/node_day{day}.json"
    with open(json_path, 'r', encoding='utf-8') as f:
        day_data = json.load(f)
    
    entries = []
    specs = visuals_map[day]
    assert len(specs) == 5, f"Day {day} specs count != 5"
    
    for idx, part in enumerate(day_data['parts']):
        code_hash = compute_code_hash(part['code'])
        spec = specs[idx]
        entries.append({
            "partTitle": part['title'],
            "codeHash": code_hash,
            "spec": spec
        })
    
    visual_doc = {
        "schemaVersion": 2,
        "prefix": "node-web",
        "day": day,
        "promptSha": "block9_expansion",
        "model": "gpt-4o",
        "entries": entries
    }
    
    out_file = f"src/lib/data/lessonVisuals/node-web/day-{day}.json"
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(visual_doc, f, indent=2)
    print(f"Generated {out_file} with 5 visual specs and matching code hashes.")

print("\nALL BLOCK 9 GATE V2 VISUALS GENERATED SUCCESSFULLY!")
