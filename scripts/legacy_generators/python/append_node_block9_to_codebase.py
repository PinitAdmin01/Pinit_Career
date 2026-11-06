import json, re

# 1. Append Days 41..45 to src/lib/data/nodeWebLongLessons.ts
print("--- 1. Updating src/lib/data/nodeWebLongLessons.ts ---")
with open('src/lib/data/nodeWebLongLessons.ts', 'r', encoding='utf-8') as f:
    long_content = f.read()

last_bracket = long_content.rfind('];')
if last_bracket == -1:
    raise RuntimeError("Could not find closing '];' in nodeWebLongLessons.ts")

before_close = long_content[:last_bracket].rstrip()

new_lessons = []
for day in [41, 42, 43, 44, 45]:
    with open(f"scripts/node_day{day}.json", 'r', encoding='utf-8') as f:
        lesson = json.load(f)
        new_lessons.append(json.dumps(lesson, indent=2))

lessons_joined = ",\n" + ",\n".join(new_lessons) + "\n];\n"
updated_long_content = before_close + lessons_joined

with open('src/lib/data/nodeWebLongLessons.ts', 'w', encoding='utf-8') as f:
    f.write(updated_long_content)
print("Updated nodeWebLongLessons.ts with Days 41-45 successfully!")

# 2. Append Days 41..45 to src/lib/data/nodeWebDays.ts
print("\n--- 2. Updating src/lib/data/nodeWebDays.ts ---")
with open('src/lib/data/nodeWebDays.ts', 'r', encoding='utf-8') as f:
    days_content = f.read()

last_bracket = days_content.rfind('];')
if last_bracket == -1:
    raise RuntimeError("Could not find closing '];' in nodeWebDays.ts")

before_close = days_content[:last_bracket].rstrip()

day_configs = [
    {
        "day": 41,
        "title": "Advanced Asynchronous Concurrency Patterns: AsyncLocalStorage, Async Hooks & Request Context Tracing",
        "desc": "Master asynchronous execution tracking and context propagation in Node.js: analyze the async resource lifecycle, async_hooks C++ bindings, AsyncLocalStorage storage isolation, context leakage hazards, and OpenTelemetry trace propagation.",
        "syllabus": [
            "Single-threaded continuation tracking: AsyncLocalStorage execution isolation across concurrent interleaved requests.",
            "Node.js async_hooks internals: asyncId and triggerAsyncId parent-child ancestry chains.",
            "Context continuation preservation: resolving broken third-party callback chains via explicit store binding.",
            "Distributed tracing architecture: parsing and injecting W3C TraceContext traceparent headers across microservices."
        ]
    },
    {
        "day": 42,
        "title": "Production Memory Management & Profiling: V8 Heap Snapshots, Leak Detection & Allocation Timelines",
        "desc": "Master production memory profiling and garbage collection diagnostics in Node.js: analyze V8 generational heap architecture, Scavenge vs Mark-Sweep cycles, heap snapshot retainers, and memory leak mitigation.",
        "syllabus": [
            "V8 memory layout: Young Generation (Eden/Semi-spaces), Old Generation (Tenured), and off-heap Buffer limits.",
            "Generational garbage collection algorithms: Cheney copying scavenger vs Mark-Sweep-Compact cycles.",
            "Common Node.js memory leak patterns: unbounded global caches, detached DOM/timers, and closure retention.",
            "Heap snapshot diagnostics: comparative snapshot analysis, Retainer Trees, Shallow vs Retained sizes."
        ]
    },
    {
        "day": 43,
        "title": "Low-Latency Binary Protocols: Protocol Buffers, MessagePack & Binary WebSocket Serialization",
        "desc": "Master binary serialization and network wire protocol engineering in Node.js: analyze JSON serialization CPU/GC bottlenecks, Protocol Buffers Tag-Length-Value encoding, Varint/ZigZag bitwise math, and MessagePack framing.",
        "syllabus": [
            "Binary protocols vs JSON: wire bandwidth compression, zero string tokenization, and V8 GC overhead elimination.",
            "Protocol Buffers wire specification: Tag-Length-Value encoding, field numbers, and wire type mappings.",
            "Varint bit manipulation and ZigZag signed integer encoding for ultra-compact integer transport.",
            "MessagePack dynamic binary serialization and high-throughput binary WebSocket broadcast pipelines."
        ]
    },
    {
        "day": 44,
        "title": "High-Performance Networking: HTTP/2 Multiplexing, ALPN Negotiation & gRPC Services in Node.js",
        "desc": "Master modern network transport protocols in Node.js: analyze HTTP/1.1 Head-of-Line blocking, HTTP/2 binary framing and stream multiplexing, TLS ALPN negotiation, credit-based flow control, and enterprise gRPC microservice architectures.",
        "syllabus": [
            "HTTP/1.1 Head-of-Line blocking vs HTTP/2 single-TCP connection binary frame interleaving.",
            "TLS ALPN protocol negotiation, SETTINGS parameter exchange, and credit-based WINDOW_UPDATE flow control.",
            "gRPC architectural foundations: HTTP/2 POST routing, length-prefixed framing, and status trailers.",
            "Four gRPC streaming models and enterprise Interceptor pipelines for authentication and deadline budgeting."
        ]
    },
    {
        "day": 45,
        "title": "🏆 Milestone 8: High-Throughput Binary Telemetry Aggregator with gRPC & AsyncLocalStorage",
        "desc": "Architect, implement, and benchmark an enterprise-grade, high-throughput binary telemetry ingestion and aggregation engine combining gRPC unary and streaming endpoints, Varint Protocol Buffers serialization, zero-copy buffer pooling, AsyncLocalStorage distributed trace propagation, and real-time sliding window statistical metrics.",
        "syllabus": [
            "Ingress topology design: persistent HTTP/2 gRPC streaming, non-blocking ring buffers, and backpressure.",
            "Zero-copy Varint Protobuf decoding: bitwise decoding and pre-allocated buffer pool recycling.",
            "Real-time stream aggregation: sliding window time buckets and in-place O(1) statistical accumulators.",
            "Distributed context propagation: AsyncLocalStorage trace correlation across gRPC interceptors.",
            "Production SLA verification suite: throughput, sub-millisecond latency, and Grade A+ certification."
        ]
    }
]

formatted_configs = []
for cfg in day_configs:
    formatted_configs.append(f"""  {{
    day: {cfg['day']},
    title: "{cfg['title']}",
    desc: "{cfg['desc']}",
    syllabus: [
""" + ",\n".join(f'      "{s}"' for s in cfg['syllabus']) + """
    ]
  }""")

days_joined = ",\n" + ",\n".join(formatted_configs) + "\n];\n"
updated_days_content = before_close + days_joined

with open('src/lib/data/nodeWebDays.ts', 'w', encoding='utf-8') as f:
    f.write(updated_days_content)
print("Updated nodeWebDays.ts with Days 41-45 successfully!")

# 3. Append Days 41..45 to src/lib/data/nodeWeb30DayData.ts
print("\n--- 3. Updating src/lib/data/nodeWeb30DayData.ts ---")
with open('src/lib/data/nodeWeb30DayData.ts', 'r', encoding='utf-8') as f:
    thirty_content = f.read()

# Locate the closing "];" for NODE_WEB_30_DAYS_CONFIGS
marker = "export const NODE_WEB_30_DAYS_QUESTS"
marker_idx = thirty_content.find(marker)
if marker_idx == -1:
    raise RuntimeError(f"Could not find marker '{marker}' in nodeWeb30DayData.ts")

# Search backward from marker_idx for "];"
last_bracket = thirty_content.rfind('];', 0, marker_idx)
if last_bracket == -1:
    raise RuntimeError("Could not find closing '];' before NODE_WEB_30_DAYS_QUESTS")

before_configs = thirty_content[:last_bracket].rstrip()
after_configs = thirty_content[last_bracket:]

block9_code_configs = """
  // ── DAY 41: Advanced Asynchronous Concurrency Patterns ─────────────────────────
  {
    ...NODE_WEB_DAYS[40],
    eTitle: "Parse W3C TraceParent Header",
    eDesc: "Write `parseW3CTraceParent(header: string): { version: string; traceId: string; parentId: string; traceFlags: string; isValid: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines("function parseW3CTraceParent(header) {", "  // Return parsed W3C traceparent", "  return { version: '', traceId: '', parentId: '', traceFlags: '', isValid: false };", "}"),
    eHint: "const parts = String(header).split('-'); if (parts.length !== 4 || parts[0] !== '00' || parts[1].length !== 32 || parts[2].length !== 16 || parts[3].length !== 2) return { version: '', traceId: '', parentId: '', traceFlags: '', isValid: false }; return { version: parts[0], traceId: parts[1], parentId: parts[2], traceFlags: parts[3], isValid: true };",
    eTest: lines(
      "if (typeof parseW3CTraceParent !== 'function') throw new Error('parseW3CTraceParent not found');",
      "const tp1 = parseW3CTraceParent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');",
      "if (!tp1.isValid || tp1.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736') throw new Error('Failed valid traceparent parse: ' + JSON.stringify(tp1));",
      "const tp2 = parseW3CTraceParent('invalid-header');",
      "if (tp2.isValid !== false) throw new Error('Failed invalid traceparent test');"
    ),
    aTitle: "Create Child Span Context",
    aDesc: "Write `createChildSpanContext(parentHeader: string | null): { traceId: string; parentSpanId: string; spanId: string; traceFlags: string }`.",
    aLanguage: "typescript",
    aStarter: lines("function createChildSpanContext(parentHeader) {", "  // Return child span context", "  return { traceId: '', parentSpanId: '', spanId: '', traceFlags: '01' };", "}"),
    aHint: "const isParentValid = parentHeader && parentHeader.startsWith('00-') && parentHeader.split('-').length === 4; const parts = isParentValid ? parentHeader.split('-') : []; const traceId = isParentValid ? parts[1] : '11112222333344445555666677778888'; const parentSpanId = isParentValid ? parts[2] : '0000000000000000'; const spanId = 'sp99998888777766'; return { traceId, parentSpanId, spanId, traceFlags: '01' };",
    aTest: lines(
      "if (typeof createChildSpanContext !== 'function') throw new Error('createChildSpanContext not found');",
      "const ch1 = createChildSpanContext('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');",
      "if (ch1.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736' || ch1.parentSpanId !== '00f067aa0ba902b7') throw new Error('Failed valid parent inheritance');",
      "const ch2 = createChildSpanContext(null);",
      "if (!ch2.traceId || ch2.parentSpanId !== '0000000000000000') throw new Error('Failed root context creation');"
    )
  },

  // ── DAY 42: Production Memory Management & Profiling ───────────────────────────
  {
    ...NODE_WEB_DAYS[41],
    eTitle: "Calculate Memory Pressure",
    eDesc: "Write `calculateMemoryPressure(heapUsed: number, heapTotal: number, thresholdPct: number): { currentPct: number; isExceeded: boolean; bytesAvailable: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function calculateMemoryPressure(heapUsed, heapTotal, thresholdPct) {", "  // Return memory pressure status", "  return { currentPct: 0, isExceeded: false, bytesAvailable: 0 };", "}"),
    eHint: "const pct = Number(((heapUsed / heapTotal) * 100).toFixed(1)); const isExceeded = pct >= thresholdPct; return { currentPct: pct, isExceeded, bytesAvailable: Math.max(0, heapTotal - heapUsed) };",
    eTest: lines(
      "if (typeof calculateMemoryPressure !== 'function') throw new Error('calculateMemoryPressure not found');",
      "const m1 = calculateMemoryPressure(850, 1000, 80.0);",
      "if (m1.currentPct !== 85.0 || m1.isExceeded !== true || m1.bytesAvailable !== 150) throw new Error('Failed m1 pressure check: ' + JSON.stringify(m1));",
      "const m2 = calculateMemoryPressure(500, 1000, 80.0);",
      "if (m2.isExceeded !== false || m2.bytesAvailable !== 500) throw new Error('Failed m2 safe check: ' + JSON.stringify(m2));"
    ),
    aTitle: "Detect Leaking Retainers",
    aDesc: "Write `detectLeakingRetainers(snapshots: Array<{ name: string; deltaCount: number; retainedBytes: number }>): { topLeak: string; leakedBytes: number } | null`.",
    aLanguage: "typescript",
    aStarter: lines("function detectLeakingRetainers(snapshots) {", "  // Detect top leaking retainer", "  return null;", "}"),
    aHint: "const leaking = snapshots.filter(s => s.deltaCount > 0); if (leaking.length === 0) return null; leaking.sort((a, b) => b.retainedBytes - a.retainedBytes); return { topLeak: leaking[0].name, leakedBytes: leaking[0].retainedBytes };",
    aTest: lines(
      "if (typeof detectLeakingRetainers !== 'function') throw new Error('detectLeakingRetainers not found');",
      "const l1 = detectLeakingRetainers([{ name: 'ClosureCtx', deltaCount: 500, retainedBytes: 50000 }, { name: 'Buffer', deltaCount: 10, retainedBytes: 1000 }]);",
      "if (!l1 || l1.topLeak !== 'ClosureCtx' || l1.leakedBytes !== 50000) throw new Error('Failed l1 leak detection: ' + JSON.stringify(l1));",
      "const l2 = detectLeakingRetainers([{ name: 'Array', deltaCount: -5, retainedBytes: 0 }]);",
      "if (l2 !== null) throw new Error('Failed l2 no-leak test');"
    )
  },

  // ── DAY 43: Low-Latency Binary Protocols ───────────────────────────────────────
  {
    ...NODE_WEB_DAYS[42],
    eTitle: "Encode Protobuf Varint",
    eDesc: "Write `encodeProtobufVarint(value: number): number[]` returning the byte array representing the Varint.",
    eLanguage: "typescript",
    eStarter: lines("function encodeProtobufVarint(value) {", "  // Return Varint encoded bytes", "  return [];", "}"),
    eHint: "const bytes = []; let val = value; while (val >= 0x80) { bytes.push((val & 0x7F) | 0x80); val >>>= 7; } bytes.push(val & 0x7F); return bytes;",
    eTest: lines(
      "if (typeof encodeProtobufVarint !== 'function') throw new Error('encodeProtobufVarint not found');",
      "const v1 = encodeProtobufVarint(1);",
      "if (v1.length !== 1 || v1[0] !== 1) throw new Error('Failed 1 byte encoding: ' + JSON.stringify(v1));",
      "const v2 = encodeProtobufVarint(300);",
      "if (v2.length !== 2 || v2[0] !== 0xAC || v2[1] !== 0x02) throw new Error('Failed 300 varint encoding: ' + JSON.stringify(v2));"
    ),
    aTitle: "Decode Protobuf Varint",
    aDesc: "Write `decodeProtobufVarint(bytes: number[]): { value: number; bytesRead: number }`.",
    aLanguage: "typescript",
    aStarter: lines("function decodeProtobufVarint(bytes) {", "  // Return decoded integer and bytesRead", "  return { value: 0, bytesRead: 0 };", "}"),
    aHint: "let result = 0; let shift = 0; let bytesRead = 0; for (let i = 0; i < bytes.length; i++) { const b = bytes[i]; bytesRead++; result |= (b & 0x7F) << shift; if ((b & 0x80) === 0) break; shift += 7; } return { value: result, bytesRead };",
    aTest: lines(
      "if (typeof decodeProtobufVarint !== 'function') throw new Error('decodeProtobufVarint not found');",
      "const d1 = decodeProtobufVarint([0x01]);",
      "if (d1.value !== 1 || d1.bytesRead !== 1) throw new Error('Failed d1: ' + JSON.stringify(d1));",
      "const d2 = decodeProtobufVarint([0xAC, 0x02]);",
      "if (d2.value !== 300 || d2.bytesRead !== 2) throw new Error('Failed d2 300: ' + JSON.stringify(d2));"
    )
  },

  // ── DAY 44: High-Performance Networking & gRPC Services ───────────────────────
  {
    ...NODE_WEB_DAYS[43],
    eTitle: "Parse gRPC Service Path",
    eDesc: "Write `parseGrpcPath(path: string): { service: string; method: string; isValid: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines("function parseGrpcPath(path) {", "  // Parse /package.Service/Method", "  return { service: '', method: '', isValid: false };", "}"),
    eHint: "const parts = String(path).split('/').filter(Boolean); if (parts.length !== 2) return { service: '', method: '', isValid: false }; return { service: parts[0], method: parts[1], isValid: true };",
    eTest: lines(
      "if (typeof parseGrpcPath !== 'function') throw new Error('parseGrpcPath not found');",
      "const p1 = parseGrpcPath('/telemetry.v1.TelemetryService/RecordMetric');",
      "if (!p1.isValid || p1.service !== 'telemetry.v1.TelemetryService' || p1.method !== 'RecordMetric') throw new Error('Failed p1 valid path: ' + JSON.stringify(p1));",
      "const p2 = parseGrpcPath('/invalid_path');",
      "if (p2.isValid !== false) throw new Error('Failed p2 invalid path');"
    ),
    aTitle: "Evaluate RPC Deadline Budget",
    aDesc: "Write `evaluateRpcDeadline(deadlineMs: number, currentMs: number): { expired: boolean; remainingMs: number; grpcStatus: number }`.",
    aLanguage: "typescript",
    aStarter: lines("function evaluateRpcDeadline(deadlineMs, currentMs) {", "  // Return deadline evaluation", "  return { expired: false, remainingMs: 0, grpcStatus: 0 };", "}"),
    aHint: "const remaining = deadlineMs - currentMs; const expired = remaining <= 0; return { expired, remainingMs: Math.max(0, remaining), grpcStatus: expired ? 4 : 0 };",
    aTest: lines(
      "if (typeof evaluateRpcDeadline !== 'function') throw new Error('evaluateRpcDeadline not found');",
      "const dl1 = evaluateRpcDeadline(1000, 500);",
      "if (dl1.expired !== false || dl1.remainingMs !== 500 || dl1.grpcStatus !== 0) throw new Error('Failed dl1 active check: ' + JSON.stringify(dl1));",
      "const dl2 = evaluateRpcDeadline(1000, 1500);",
      "if (dl2.expired !== true || dl2.remainingMs !== 0 || dl2.grpcStatus !== 4) throw new Error('Failed dl2 expired check: ' + JSON.stringify(dl2));"
    )
  },

  // ── DAY 45: Milestone 8: High-Throughput Binary Telemetry Aggregator ───────────
  {
    ...NODE_WEB_DAYS[44],
    eTitle: "Calculate Window Stats",
    eDesc: "Write `calculateWindowStats(samples: number[]): { count: number; sum: number; avg: number; min: number; max: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function calculateWindowStats(samples) {", "  // Return count, sum, avg, min, max", "  return { count: 0, sum: 0, avg: 0, min: 0, max: 0 };", "}"),
    eHint: "if (!samples || samples.length === 0) return { count: 0, sum: 0, avg: 0, min: 0, max: 0 }; const count = samples.length; const sum = Number(samples.reduce((a, b) => a + b, 0).toFixed(2)); const avg = Number((sum / count).toFixed(2)); const min = Math.min(...samples); const max = Math.max(...samples); return { count, sum, avg, min, max };",
    eTest: lines(
      "if (typeof calculateWindowStats !== 'function') throw new Error('calculateWindowStats not found');",
      "const ws1 = calculateWindowStats([10.5, 20.0, 15.5]);",
      "if (ws1.count !== 3 || ws1.sum !== 46.0 || ws1.avg !== 15.33 || ws1.min !== 10.5 || ws1.max !== 20.0) throw new Error('Failed ws1 stats: ' + JSON.stringify(ws1));",
      "const ws2 = calculateWindowStats([]);",
      "if (ws2.count !== 0 || ws2.sum !== 0) throw new Error('Failed empty samples check');"
    ),
    aTitle: "Certify Milestone 8 Aggregator SLA",
    aDesc: "Write `certifyMilestone8Sla(metrics: { throughput: number; p99Ms: number; bufferReclaimRate: number; traceLeakageCount: number }): { certified: boolean; grade: string }` checking throughput >= 500, p99Ms <= 2.5, bufferReclaimRate === 1.0, traceLeakageCount === 0.",
    aLanguage: "typescript",
    aStarter: lines("function certifyMilestone8Sla(metrics) {", "  // Return certification status", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const ok = metrics.throughput >= 500 && metrics.p99Ms <= 2.5 && metrics.bufferReclaimRate === 1.0 && metrics.traceLeakageCount === 0; return { certified: ok, grade: ok ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyMilestone8Sla !== 'function') throw new Error('certifyMilestone8Sla not found');",
      "const cert1 = certifyMilestone8Sla({ throughput: 600, p99Ms: 1.2, bufferReclaimRate: 1.0, traceLeakageCount: 0 });",
      "if (cert1.certified !== true || cert1.grade !== 'A+') throw new Error('Failed cert1 Grade A+: ' + JSON.stringify(cert1));",
      "const cert2 = certifyMilestone8Sla({ throughput: 400, p99Ms: 3.0, bufferReclaimRate: 0.9, traceLeakageCount: 1 });",
      "if (cert2.certified !== false || cert2.grade !== 'FAIL') throw new Error('Failed cert2 failure check: ' + JSON.stringify(cert2));"
    )
  }
"""

updated_configs = before_configs + "\n" + block9_code_configs + after_configs

with open('src/lib/data/nodeWeb30DayData.ts', 'w', encoding='utf-8') as f:
    f.write(updated_configs)
print("Updated nodeWeb30DayData.ts with Days 41-45 successfully!")
