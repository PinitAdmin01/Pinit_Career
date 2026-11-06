import json, subprocess

def run_code(code):
    res = subprocess.run(['node', '-e', code], capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Code failed:\n{code}\nError:\n{res.stderr}")
    return res.stdout.strip()

p1_say = [
    "Welcome to Day 44 of Node.js & TypeScript Backend Engineering: High-Performance Networking: HTTP/2 Multiplexing, ALPN Negotiation & gRPC Services in Node.js. Today, we advance from application-layer binary serialization to the transport layer that powers modern microservice backbones.",
    "For over two decades, HTTP/1.1 has served as the dominant protocol of the internet. While simple and reliable, HTTP/1.1 has a crippling architectural limitation: Head-Of-Line (HOL) Blocking at the application layer.",
    "Under HTTP/1.1, a single TCP socket can only process one request and one response at any given moment. A client cannot send Request B on a socket until Response A has completely finished downloading. If Request A triggers a slow, 5-second database query, all subsequent requests assigned to that socket are completely blocked!",
    "To mitigate HOL blocking, web browsers historically opened up to 6 parallel TCP connections to the same host, and microservices spun up dozens of outbound sockets.",
    "However, maintaining multiple TCP connections introduces immense overhead: each connection requires a separate 3-way TCP handshake, TLS cryptographic negotiation, kernel memory buffers, and slow-start congestion window ramp-ups.",
    "When hundreds of microservices communicate over HTTP/1.1, connection pooling quickly exhausts ephemeral port ranges, creates socket buffer memory pressure inside the Linux kernel, and wastes valuable CPU cycles re-authenticating TLS sessions.",
    "In 2015, the Internet Engineering Task Force (IETF) standardized HTTP/2 (RFC 7540) to solve this architectural bottleneck permanently.",
    "HTTP/2 replaces HTTP/1.1's textual message format with a Binary Framing Layer. Under HTTP/2, all communication between a client and server takes place over a single, persistent TCP connection.",
    "This single connection is split into independent, bidirectional logical channels called Streams. Each stream has a unique 31-bit integer identifier (odd numbers for client-initiated streams, even numbers for server-initiated streams).",
    "Messages are broken down into small binary Frames. Every HTTP/2 frame begins with a standardized 9-byte header consisting of a 24-bit payload Length, an 8-bit frame Type (such as HEADERS, DATA, SETTINGS, or RST_STREAM), an 8-bit Flags bitmask, a 1-bit reserved bit, and the 31-bit Stream ID.",
    "Because frames from different streams carry their stream ID in the frame header, the client and server can Interleave frames from dozens of concurrent requests simultaneously across the single TCP socket!",
    "A slow 10-megabyte file download on Stream 1 does not block a fast 200-byte API response on Stream 3: V8 simply interleaves DATA frames for both streams on the same wire.",
    "It is important to distinguish application-layer Head-of-Line blocking from transport-layer TCP Head-of-Line blocking. While HTTP/2 completely eliminates application-layer HOL blocking by interleaving streams, any packet loss at the IP layer still causes the underlying TCP stack to buffer packets until retransmission completes.",
    "This transport-layer boundary is what HTTP/3 addresses via QUIC and UDP, but within data center local networks where packet drop rates are near zero, HTTP/2 multiplexing delivers extraordinary concurrency gains.",
    "Furthermore, HTTP/2 introduces HPACK Header Compression (RFC 7541). In HTTP/1.1, redundant headers (such as User-Agent, Cookie, Accept, and Authorization) are transmitted in plain ASCII text on every single request, wasting kilobytes of redundant bandwidth.",
    "HPACK maintains synchronized static and dynamic compression dictionaries on both the client and server. The static table defines 61 pre-indexed common header fields, while the dynamic table stores custom headers negotiated during the active session.",
    "If an Authorization bearer token or User-Agent header was transmitted previously, subsequent requests transmit only a compact 1-byte dictionary index rather than repeating the entire string!",
    "HPACK also employs canonical Huffman coding, achieving up to 85% compression ratios on header payloads and drastically reducing time-to-first-byte (TTFB) across high-frequency RPC calls.",
    "In cloud environments with reverse proxies like Envoy, Traefik, or AWS Application Load Balancers, HTTP/2 allows thousands of client requests to be multiplexed over a tiny handful of backend connections, conserving system file descriptors and TCP socket memory.",
    "In Part 1, our simulateHttp1VsHttp2Multiplexing engine benchmarks HTTP/1.1 parallel socket queuing against HTTP/2 single-socket frame interleaving, demonstrating how HTTP/2 completely eliminates application-layer head-of-line blocking.",
    "By adopting HTTP/2 binary framing, backend architectures maximize network pipe utilization while minimizing TCP connection churn and kernel latency."
]

p1_code = """function simulateHttp1VsHttp2Multiplexing(requests) {
  // 1. HTTP/1.1 Simulation (max 2 parallel sockets, HOL blocking)
  const http1Sockets = [0, 0]; // Tracks when each socket becomes free (in ms)
  const http1Results = [];

  for (const req of requests) {
    // Pick socket that frees up earliest
    const earliestSocketIdx = http1Sockets[0] <= http1Sockets[1] ? 0 : 1;
    const startTime = Math.max(req.arrivalMs, http1Sockets[earliestSocketIdx]);
    const finishTime = startTime + req.durationMs;
    http1Sockets[earliestSocketIdx] = finishTime;

    http1Results.push({
      id: req.id,
      startedAt: startTime,
      finishedAt: finishTime,
      socketUsed: earliestSocketIdx + 1
    });
  }

  // 2. HTTP/2 Simulation (single TCP socket, full stream multiplexing)
  // All requests start immediately upon arrival; frames are interleaved concurrently
  const http2Results = requests.map((req, idx) => ({
    id: req.id,
    streamId: (idx * 2) + 1, // 1, 3, 5... (client stream IDs are odd)
    startedAt: req.arrivalMs,
    finishedAt: req.arrivalMs + req.durationMs
  }));

  const http1TotalTime = Math.max(...http1Results.map(r => r.finishedAt));
  const http2TotalTime = Math.max(...http2Results.map(r => r.finishedAt));

  return {
    requestCount: requests.length,
    http1TotalTimeMs: http1TotalTime,
    http2TotalTimeMs: http2TotalTime,
    latencyImprovementPct: Number((((http1TotalTime - http2TotalTime) / http1TotalTime) * 100).toFixed(1)),
    http1Results,
    http2Results
  };
}

// 4 requests arriving at t=0ms: Req 1 is slow (100ms), Reqs 2, 3, 4 are fast (20ms)
const mockRequests = [
  { id: 'req_1_heavy', arrivalMs: 0, durationMs: 100 },
  { id: 'req_2_light', arrivalMs: 0, durationMs: 20 },
  { id: 'req_3_light', arrivalMs: 0, durationMs: 20 },
  { id: 'req_4_light', arrivalMs: 0, durationMs: 20 }
];

const benchmark = simulateHttp1VsHttp2Multiplexing(mockRequests);
console.log('HTTP/1.1 Total Duration:', benchmark.http1TotalTimeMs + 'ms (HOL Queued)');
console.log('HTTP/2 Total Duration:', benchmark.http2TotalTimeMs + 'ms (Interleaved Multiplexed)');
console.log('Latency Reduction:', benchmark.latencyImprovementPct + '%');
console.log('HTTP/2 Stream IDs:', benchmark.http2Results.map(r => `Stream ${r.streamId} finished at ${r.finishedAt}ms`).join(', '));"""

p2_say = [
    "Before an HTTP/2 connection can exchange binary frames, the client and server must negotiate protocol support securely during the TLS cryptographic handshake. In Part 2, we explore TLS ALPN Protocol Negotiation & Flow Control Windows (SETTINGS, WINDOW_UPDATE).",
    "Application-Layer Protocol Negotiation (ALPN) is a TLS extension (RFC 7301) that enables the client and server to agree on which application protocol to speak (such as 'h2' for HTTP/2 or 'http/1.1') within the very first TLS ClientHello and ServerHello handshake round trip.",
    "Without ALPN, a client would have to establish a standard HTTP/1.1 connection and then issue an expensive 'Upgrade: h2c' request header. If an intermediate proxy did not understand the upgrade header, the connection would fail or hang.",
    "ALPN eliminates this latency penalty completely. In the initial TLS ClientHello packet, the client advertises an ordered list of supported protocols. The server inspects this list against its own capabilities and confirms the selected protocol in its ServerHello response before any application data is sent.",
    "In Node.js, the native node:http2 module configures ALPN automatically when initialized with SSL certificates via http2.createSecureServer({ cert, key }). For internal microservice communication where TLS termination occurs at the edge, Node.js also supports cleartext HTTP/2 (h2c) via http2.createServer().",
    "Once the TLS session is established, both peers immediately exchange SETTINGS frames to calibrate communication parameters and enforce resource limits.",
    "Key parameters negotiated within SETTINGS include SETTINGS_HEADER_TABLE_SIZE (controlling HPACK dynamic table memory, default 4096 bytes), SETTINGS_ENABLE_PUSH (toggling server push functionality), SETTINGS_MAX_CONCURRENT_STREAMS (preventing denial of service by bounding active streams, typically set between 100 and 1000), SETTINGS_INITIAL_WINDOW_SIZE (default 65,535 bytes), and SETTINGS_MAX_FRAME_SIZE (default 16,384 bytes).",
    "A fundamental innovation of HTTP/2 is Stream-Level and Connection-Level Flow Control.",
    "Because dozens of streams share a single TCP connection, if Client A is downloading a massive 4K video stream while Client B is receiving critical financial tick data, a fast server could overwhelm Client A's local memory buffer, inducing an out-of-memory crash, socket stalling, or dropped packets.",
    "To prevent buffer overflow, HTTP/2 implements credit-based, hop-by-hop flow control using WINDOW_UPDATE frames.",
    "Both the overall connection (Stream ID 0) and each individual stream have an independent Flow Control Window initialized to SETTINGS_INITIAL_WINDOW_SIZE (65,535 bytes). Whenever a peer transmits a DATA frame, it decrements its available window credits by the exact byte size of the payload.",
    "If the window credit drops to zero, the sender MUST immediately stop transmitting DATA frames on that stream! The sender enters a paused, backpressured state.",
    "As the receiving application consumes bytes from its memory buffer and passes them to the application layer, it sends a WINDOW_UPDATE frame back to the sender, advertising additional byte credits.",
    "This dual-window system ensures that a stalled stream with a zero-credit window cannot exhaust connection-level throughput: other active streams with remaining credits continue flowing smoothly across the shared TCP socket.",
    "Understanding the HTTP/2 Stream State Machine is crucial when debugging production flow control issues: streams transition deterministically through idle, reserved, open, half-closed (local or remote), and closed states.",
    "When a stream exhausts its window credits, it remains in the open state but halts frame dispatch until a WINDOW_UPDATE arrives or an explicit RST_STREAM is issued with error code FLOW_CONTROL_ERROR (0x03).",
    "In high-throughput Node.js microservices, tuning flow control window sizes is critical: windows that are too small result in frequent round-trip stalls waiting for credits, while windows that are too large risk excessive memory consumption under bursty traffic.",
    "Production Node.js clusters typically increase the default 64KB initial stream window to 1MB or 4MB when streaming large datasets across low-latency data center backbones, maximizing throughput without triggering credit starvation.",
    "In Part 2, our Http2FlowControlSimulator models this dual-layer credit balance, showing how streams dynamically pause when credits are exhausted and resume instantaneously when WINDOW_UPDATE frames arrive.",
    "By providing fine-grained flow control per stream, HTTP/2 ensures that high-volume streams never monopolize the connection or starve latency-sensitive control traffic."
]

p2_code = """class Http2FlowControlSimulator {
  constructor(initialWindowSize = 65535) {
    this.sessionWindow = initialWindowSize;
    this.streams = new Map();
  }

  createStream(streamId, initialWindowSize = 65535) {
    this.streams.set(streamId, {
      streamId,
      windowCredits: initialWindowSize,
      transmittedBytes: 0,
      state: 'ACTIVE'
    });
  }

  sendDataFrame(streamId, payloadBytes) {
    const stream = this.streams.get(streamId);
    if (!stream) throw new Error(`Stream ${streamId} not found`);

    // Must have credits in both stream window and session window
    const available = Math.min(stream.windowCredits, this.sessionWindow);

    if (available <= 0) {
      stream.state = 'PAUSED_WAITING_FOR_CREDITS';
      return { success: false, sentBytes: 0, reason: 'FLOW_CONTROL_WINDOW_EXHAUSTED' };
    }

    const bytesToSend = Math.min(payloadBytes, available);
    stream.windowCredits -= bytesToSend;
    this.sessionWindow -= bytesToSend;
    stream.transmittedBytes += bytesToSend;

    if (stream.windowCredits <= 0 || this.sessionWindow <= 0) {
      stream.state = 'PAUSED_WAITING_FOR_CREDITS';
    }

    return {
      success: true,
      sentBytes: bytesToSend,
      streamCreditsLeft: stream.windowCredits,
      sessionCreditsLeft: this.sessionWindow,
      streamState: stream.state
    };
  }

  receiveWindowUpdate(streamId, creditDelta) {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.windowCredits += creditDelta;
      if (stream.windowCredits > 0 && this.sessionWindow > 0) {
        stream.state = 'ACTIVE';
      }
    }
  }
}

const h2 = new Http2FlowControlSimulator(10000); // 10KB session window
h2.createStream(1, 4000); // Stream 1 initial window: 4KB

// 1. Send 3KB on Stream 1 (succeeds)
const f1 = h2.sendDataFrame(1, 3000);
console.log('Frame 1 Sent:', f1.sentBytes, 'bytes | Credits Left:', f1.streamCreditsLeft);

// 2. Attempt to send 2KB on Stream 1 (only 1KB left in stream window!)
const f2 = h2.sendDataFrame(1, 2000);
console.log('Frame 2 Partial:', f2.sentBytes, 'bytes | State:', f2.streamState);

// 3. Attempt to send another frame (window exhausted -> paused)
const f3 = h2.sendDataFrame(1, 500);
console.log('Frame 3 Blocked:', f3.success, '| Reason:', f3.reason);

// 4. Receiver processes data and sends WINDOW_UPDATE (+5000 bytes)
h2.receiveWindowUpdate(1, 5000);
const f4 = h2.sendDataFrame(1, 500);
console.log('Frame 4 Resumed After WINDOW_UPDATE:', f4.success, '| Credits:', f4.streamCreditsLeft);"""

p3_say = [
    "Having conquered HTTP/2 multiplexing and binary framing, in Part 3 we explore the premier enterprise RPC framework built entirely on top of HTTP/2 and Protocol Buffers: gRPC Architectural Fundamentals: HTTP/2 Underpinnings, Protobuf Contracts & Type Safety.",
    "gRPC (gRPC Remote Procedure Calls) is an open-source, high-performance, universal RPC framework originally created by Google. In cloud-scale microservice architectures, gRPC has largely replaced REST and JSON as the standard internal communication substrate.",
    "The core concept of RPC is Method Invocation Abstraction: a client can directly invoke a method on a server application on a different machine as if it were a normal local function call in code (such as awaiting client.submitTelemetry(metric)).",
    "gRPC achieves unprecedented throughput and developer velocity by uniting three architectural pillars: Protocol Buffers, HTTP/2, and Automated Code Generation.",
    "First, Protocol Buffers acts as the Interface Definition Language (IDL). Developers declare service interfaces in .proto schema files: service TelemetryService { rpc RecordMetric (MetricRequest) returns (MetricResponse); }.",
    "Second, the Protobuf compiler generates strongly typed client stubs and server interfaces automatically in TypeScript, Go, Java, Python, and C++. Both client and server share 100% compile-time type safety with zero manual type synchronization or drift.",
    "Third, gRPC maps RPC semantics onto HTTP/2 primitives with mathematical elegance. Every gRPC method call is mapped to an HTTP/2 POST request. The HTTP/2 path represents the package, service, and method: POST /telemetry.v1.TelemetryService/RecordMetric.",
    "The HTTP Content-Type header is strictly set to application/grpc (or application/grpc+proto).",
    "Request and response payloads are framed using a standardized gRPC Length-Prefixed Message format. Every Protobuf payload inside an HTTP/2 DATA frame is preceded by a 5-byte header: a 1-byte Compressed Flag (indicating whether gzip or snappy compression is active) followed by a 4-byte big-endian Message Length integer.",
    "This 5-byte framing is essential because a single gRPC message can be split across multiple HTTP/2 DATA frames, or conversely, multiple small streaming messages can be packed into a single DATA frame.",
    "Furthermore, gRPC returns status codes not through generic HTTP status codes (which remain 200 OK for successful transport), but through a dedicated trailer header in the final HEADERS frame: grpc-status.",
    "The gRPC status specification defines 17 standardized error codes: 0 for OK, 1 for CANCELLED, 2 for UNKNOWN, 3 for INVALID_ARGUMENT, 4 for DEADLINE_EXCEEDED, 5 for NOT_FOUND, 7 for PERMISSION_DENIED, 8 for RESOURCE_EXHAUSTED, 12 for UNIMPLEMENTED, 13 for INTERNAL, and 14 for UNAVAILABLE.",
    "Rich error details are transmitted in the companion grpc-status-details-bin metadata trailer, which carries serialized google.rpc.Status Protobuf messages containing structured error domains, error reasons, and retry delays.",
    "Under the hood, gRPC's wire serialization relies on the binary Tag-Length-Value encoding of Protocol Buffers that we mastered in Day 43. Instead of parsing textual JSON keys and escaping characters, V8 decodes Varints and fixed-width binary fields directly in C++ bindings, bypassing the JavaScript garbage collector entirely.",
    "Benchmark profiles consistently demonstrate that gRPC achieves up to 7 to 10 times higher throughput and consumes less than one-third of the CPU overhead required by traditional REST-over-JSON endpoints in Node.js.",
    "Additionally, gRPC introduces native Channel Management and Subchannel Load Balancing. A gRPC Client Channel manages multiple underlying HTTP/2 TCP connections to server instances, automatically load-balancing RPC calls using Round Robin or Pick First policies without requiring an external proxy.",
    "When a backend replica becomes unhealthy, the gRPC channel handles connection backoff and automatic failover transparently, ensuring high availability with zero application-layer reconnection logic.",
    "In Part 3, our GrpcRpcDispatcher engine implements this HTTP/2 routing and status trailer mechanism, dispatching RPC invocations to registered method handlers with exact error code semantics.",
    "By leveraging gRPC, microservice architectures achieve sub-millisecond inter-service latency, bidirectional streaming capabilities, and strict end-to-end type contracts across polyglot systems."
]

p3_code = """class GrpcRpcDispatcher {
  constructor() {
    this.services = new Map();
  }

  registerService(serviceName, handlers) {
    this.services.set(serviceName, handlers);
  }

  // Dispatch incoming HTTP/2 POST request mapped to /package.Service/Method
  dispatch(path, binaryPayload, metadata = {}) {
    const parts = path.split('/').filter(Boolean);
    if (parts.length !== 2) {
      return { grpcStatus: 12, error: 'UNIMPLEMENTED', message: `Malformed gRPC path: ${path}` };
    }

    const [serviceName, methodName] = parts;
    const service = this.services.get(serviceName);
    if (!service || !service[methodName]) {
      return { grpcStatus: 12, error: 'UNIMPLEMENTED', message: `Method ${methodName} not found on ${serviceName}` };
    }

    try {
      // Execute registered RPC handler
      const result = service[methodName](binaryPayload, metadata);
      return {
        grpcStatus: 0, // 0 = gRPC OK
        headers: {
          'content-type': 'application/grpc',
          'grpc-status': '0'
        },
        responsePayload: result
      };
    } catch (err) {
      return {
        grpcStatus: 13, // 13 = INTERNAL ERROR
        headers: {
          'content-type': 'application/grpc',
          'grpc-status': '13'
        },
        error: err.message
      };
    }
  }
}

const dispatcher = new GrpcRpcDispatcher();

// Register Telemetry gRPC Service
dispatcher.registerService('telemetry.v1.TelemetryService', {
  RecordMetric: (payload, meta) => {
    return { status: 'ACCEPTED', sensorId: payload.sensorId, recordedAt: 1700000000000 };
  }
});

// Simulate incoming gRPC call over HTTP/2 path
const call1 = dispatcher.dispatch('/telemetry.v1.TelemetryService/RecordMetric', { sensorId: 99 });
const call2 = dispatcher.dispatch('/telemetry.v1.TelemetryService/UnknownMethod', {});

console.log('RPC 1 Status:', call1.grpcStatus, '(OK) | Response:', JSON.stringify(call1.responsePayload));
console.log('RPC 2 Status:', call2.grpcStatus, `(Error: ${call2.error})`);"""

p4_say = [
    "Traditional HTTP REST APIs are strictly limited to request-response interactions: a client sends one request, and the server sends one response. In Part 4, we explore Unary vs Streaming RPC Models: Server-Streaming, Client-Streaming & Bidirectional Duplex.",
    "Because gRPC is built on HTTP/2's bidirectional binary streams, it natively supports four distinct communication models that cover every modern distributed systems paradigm:",
    "Model 1: Unary RPC. The classic request-response interaction. The client sends a single request message, and the server sends back a single response message accompanied by status trailers. Ideal for basic queries, authentication token exchanges, and atomic CRUD operations.",
    "Model 2: Server-Streaming RPC. The client sends a single request message, but the server responds with a stream of multiple response messages over time. For example, a client requests subscribeStockTicker({ symbol: 'AAPL' }), and the server sends an ongoing stream of price update messages until the stream is explicitly terminated.",
    "Model 3: Client-Streaming RPC. The client sends a stream of multiple messages to the server, and the server responds with a single summary message once the stream finishes. Ideal for bulk file uploads, audit log ingestion, or telemetry batch ingestion where an IoT gateway sends 10,000 sensor readings before receiving an aggregated acknowledgment.",
    "Model 4: Bidirectional Streaming RPC (Duplex). Both client and server send a continuous stream of messages over an independent HTTP/2 stream concurrently. Messages are delivered in order as they are generated, completely decoupled from each other. Ideal for real-time multiplayer gaming, continuous voice transcription, and financial trading order management systems.",
    "In Node.js, gRPC streams implement the standard Node.js stream.Readable, stream.Writable, and stream.Duplex interfaces, allowing developers to pipe data with native backpressure control via stream.pipe().",
    "When consuming high-velocity server streams, backpressure management is paramount. If the client JavaScript event loop falls behind processing messages, Node.js pauses the underlying HTTP/2 stream by withholding WINDOW_UPDATE frames.",
    "This automatically forces the upstream server to stop transmitting until the client drains its internal buffer, preventing out-of-memory errors on subscriber nodes.",
    "Under client-streaming and bidirectional streaming, high write throughput can easily flood the Node.js writable buffer. High-performance services utilize stream corking (via stream.cork() and stream.uncork()) to batch multiple Protobuf messages into a single TCP write packet, drastically minimizing kernel context switches.",
    "Furthermore, bidirectional gRPC streams maintain continuous keepalive pings (via HTTP/2 PING frames with 8-byte opaque payloads) to detect silent network partitions, half-open TCP sockets, and cloud NAT gateway connection drops before application-level queries fail.",
    "When a long-lived bidirectional stream experiences a transient socket drop, production client stubs leverage automated retry interceptors with exponential backoff and jitter to re-establish the stream without data loss.",
    "Furthermore, in high-throughput Node.js microservices, managing stream lifecycle events requires careful listening on data, end, error, and close events to prevent unhandled rejection crashes or silent data truncation.",
    "Developers must also implement write buffer monitoring: checking the return value of stream.write() ensures that when a buffer fills up, writes pause until the drain event fires, maintaining pristine memory boundaries under heavy streaming loads.",
    "This deterministic backpressure propagation is what enables Node.js microservices to ingest hundreds of thousands of events per second without dropping packets or spiking heap allocation limits.",
    "Either peer can cancel an active stream at any time by issuing a call.cancel() command, which sends an HTTP/2 RST_STREAM frame with code CANCEL (0x08). This immediately terminates downstream processing and frees socket resources on both sides.",
    "In Part 4, our simulateGrpcStreamingModels engine demonstrates all four communication modes, verifying message ordering, stream termination signals, backpressure handling, and duplex throughput.",
    "By choosing the appropriate gRPC streaming pattern, backend architects design optimal communication workflows without resorting to complex long-polling, server-sent events, or external message brokers."
]

p4_code = """function simulateGrpcStreamingModels() {
  const audit = [];

  // 1. Unary: 1 request -> 1 response
  function unaryCall(req) {
    return { mode: 'UNARY', reqId: req.id, response: `Processed ${req.id}` };
  }

  // 2. Server-Streaming: 1 request -> N responses
  function serverStreamingCall(req, onMessage, onEnd) {
    for (let i = 1; i <= 3; i++) {
      onMessage({ mode: 'SERVER_STREAM', chunkIndex: i, data: `Telemetry tick ${i} for ${req.id}` });
    }
    onEnd();
  }

  // 3. Client-Streaming: N requests -> 1 response
  function clientStreamingCall(streamChunks) {
    let totalBytes = 0;
    for (const chunk of streamChunks) {
      totalBytes += chunk.bytes;
    }
    return { mode: 'CLIENT_STREAM', receivedChunks: streamChunks.length, totalBytes, status: 'INGESTED' };
  }

  // 4. Bidirectional Duplex: N requests <-> M responses
  function bidiStreamingCall(clientMessages, onServerMessage) {
    for (const msg of clientMessages) {
      onServerMessage({ echo: `ACK: ${msg.text}`, seq: msg.seq });
    }
  }

  const uRes = unaryCall({ id: 'metric_01' });

  const sStreamChunks = [];
  serverStreamingCall({ id: 'sensor_42' }, c => sStreamChunks.push(c), () => {});

  const cStreamRes = clientStreamingCall([{ bytes: 100 }, { bytes: 250 }, { bytes: 150 }]);

  const bidiServerResponses = [];
  bidiStreamingCall([{ seq: 1, text: 'ping' }, { seq: 2, text: 'ping' }], msg => bidiServerResponses.push(msg));

  return {
    uRes,
    sStreamChunksCount: sStreamChunks.length,
    cStreamRes,
    bidiCount: bidiServerResponses.length
  };
}

const streamAudit = simulateGrpcStreamingModels();
console.log('Unary Result:', streamAudit.uRes.mode, '|', streamAudit.uRes.response);
console.log('Server-Streaming Emitted:', streamAudit.sStreamChunksCount, 'chunks');
console.log('Client-Streaming Result:', streamAudit.cStreamRes.mode, '| Total Bytes:', streamAudit.cStreamRes.totalBytes);
console.log('Bidi Streaming Responses:', streamAudit.bidiCount, 'server messages exchanged');"""

p5_say = [
    "We conclude Day 44 with Part 5: Production gRPC Interceptors: Metadata Propagation, Deadline Budgets & Circuit Breakers.",
    "In enterprise microservice architectures, cross-cutting concerns—such as authentication, authorization, request logging, distributed tracing, metrics collection, and timeout management—must be applied consistently across all RPC endpoints.",
    "Rather than duplicating this logic inside individual service handlers, gRPC provides Interceptors (the gRPC equivalent of Express middleware and NestJS interceptors).",
    "An Interceptor wraps an RPC call on either the client or server side, intercepting the request metadata, modifying the context, enforcing operational constraints, and post-processing response payloads before handing control to the next stage.",
    "A paramount operational discipline in gRPC architectures is Deadline Propagation (Timeout Budgets). In a distributed microservice call graph, if Service A calls Service B with a 2-second timeout, and Service B calls Service C, Service B must NOT allow Service C to run for 5 seconds!",
    "gRPC solves this through the grpc-timeout metadata header. When Service A initiates a call with a 2,000ms deadline, gRPC transmits the remaining time budget in metadata (such as '2S' or '2000m').",
    "Service B reads the deadline, calculates the elapsed time taken for its own local operations, and forwards only the remaining budget (e.g. 1,400ms) to Service C.",
    "If the deadline expires at any point along the call tree, the operation aborts immediately with grpc-status: 4 (DEADLINE_EXCEEDED), freeing up CPU and socket resources rather than executing orphaned, useless computations.",
    "Furthermore, production interceptors integrate directly with AsyncLocalStorage to extract W3C traceparent headers from incoming gRPC metadata and establish active distributed tracing spans automatically.",
    "Binary metadata can also be transmitted efficiently across interceptors by appending the -bin suffix to the header key (such as routing-context-bin), instructing gRPC to encode the value as Base64 on the wire and decode it automatically into raw byte buffers.",
    "Client-side interceptors also implement Circuit Breaking and Exponential Backoff Retries for transient gRPC status codes like UNAVAILABLE (status 14) and RESOURCE_EXHAUSTED (status 8), shielding downstream services from cascading thundering herd failures.",
    "The execution order of chained gRPC interceptors follows an onion middleware model: the first registered interceptor processes the outbound request first, but processes the inbound response last (LIFO unwinding).",
    "This allows authentication and deadline validation to short-circuit invalid or expired calls before expensive logging, distributed tracing serialization, or payload decryption are ever invoked.",
    "When integrating with OpenTelemetry and enterprise APM platforms, server interceptors extract both W3C traceparent headers and W3C Baggage headers, injecting them into Node.js AsyncLocalStorage so that downstream asynchronous operations (such as PostgreSQL queries, Redis cache reads, or child gRPC calls) inherit the distributed trace context effortlessly.",
    "In architectures where microservices are exposed to external web clients, Envoy proxies provide gRPC-JSON Transcoding, automatically translating external HTTP/1.1 REST JSON requests into internal HTTP/2 gRPC binary calls and mapping grpc-status trailers back to standard HTTP status codes.",
    "Additionally, production interceptor stacks incorporate rate-limiting tokens (such as leaky bucket or token bucket algorithms) directly within the inbound interceptor chain, preventing noisy-neighbor services from exhausting threadpool bandwidth.",
    "By centralizing policy enforcement within modular interceptors, backend teams achieve clean separation of concerns, ensuring core business logic remains untainted by transport-layer infrastructure details.",
    "This unified pipeline pattern provides operational predictability, automated observability, and bulletproof fault isolation across the entire distributed system.",
    "In Part 5, our executeGrpcInterceptorPipeline engine demonstrates an end-to-end interceptor pipeline enforcing authentication, deadline budget validation, and distributed trace context propagation.",
    "Congratulations on mastering Day 44! You have conquered HTTP/2 binary framing, stream multiplexing, flow control windows, gRPC service architectures, streaming models, and production interceptors.",
    "Tomorrow in Day 45, we culminate Month 2 Block 9 with Milestone 8: High-Throughput Binary Telemetry Aggregator with gRPC & AsyncLocalStorage!"
]

p5_code = """function executeGrpcInterceptorPipeline(callContext, handler) {
  const auditLog = [];

  // Interceptor 1: Authentication & Metadata Validation
  function authInterceptor(ctx, next) {
    if (!ctx.metadata['authorization']) {
      return { grpcStatus: 16, error: 'UNAUTHENTICATED', message: 'Missing metadata authorization' };
    }
    auditLog.push('Auth Verified');
    return next(ctx);
  }

  // Interceptor 2: Deadline Budget Enforcement
  function deadlineInterceptor(ctx, next) {
    const now = Date.now();
    if (ctx.deadlineMs && now > ctx.deadlineMs) {
      return { grpcStatus: 4, error: 'DEADLINE_EXCEEDED', message: 'RPC deadline expired before execution' };
    }
    auditLog.push('Deadline Checked (Budget Remaining)');
    return next(ctx);
  }

  // Interceptor 3: Trace Context Propagation
  function traceInterceptor(ctx, next) {
    const traceId = ctx.metadata['traceparent'] || 'tr_default_fallback';
    ctx.traceId = traceId;
    auditLog.push(`Trace Bound: ${traceId}`);
    return next(ctx);
  }

  // Execute pipeline chain
  const pipeline = (ctx) => authInterceptor(ctx, 
    (c1) => deadlineInterceptor(c1, 
      (c2) => traceInterceptor(c2, handler)
    )
  );

  const result = pipeline(callContext);
  return { result, auditLog };
}

// Case 1: Valid Call within Deadline Budget
const validCall = {
  metadata: { authorization: 'Bearer token_123', traceparent: '00-abc123-01' },
  deadlineMs: Date.now() + 5000,
  payload: { sensorId: 88 }
};

const runValid = executeGrpcInterceptorPipeline(validCall, (ctx) => ({
  grpcStatus: 0,
  data: `Telemetry saved for sensor ${ctx.payload.sensorId}`
}));

// Case 2: Expired Deadline Call
const expiredCall = {
  metadata: { authorization: 'Bearer token_123' },
  deadlineMs: Date.now() - 1000, // Expired 1 second ago
  payload: { sensorId: 99 }
};

const runExpired = executeGrpcInterceptorPipeline(expiredCall, (ctx) => ({
  grpcStatus: 0,
  data: 'Should not run'
}));

console.log('Valid Call Status:', runValid.result.grpcStatus, '(OK) | Audit:', runValid.auditLog.join(' -> '));
console.log('Expired Call Status:', runExpired.result.grpcStatus, `(Error: ${runExpired.result.error})`);"""

out1 = run_code(p1_code)
out2 = run_code(p2_code)
out3 = run_code(p3_code)
out4 = run_code(p4_code)
out5 = run_code(p5_code)

parts = [
    {
        "title": "HTTP/1.1 Head-of-Line Blocking vs HTTP/2 Single-TCP Binary Framing Multiplexing",
        "say": p1_say,
        "code": p1_code,
        "output": out1,
        "check": {
            "question": "How does HTTP/2 eliminate application-layer Head-of-Line (HOL) blocking?",
            "options": [
                "By breaking messages into binary frames carrying stream IDs, allowing frames from multiple concurrent streams to be interleaved across a single TCP socket",
                "By opening 500 parallel TCP connections simultaneously",
                "By converting all network traffic into UDP datagrams without encryption",
                "By compressing all web pages into ZIP files before transmission"
            ],
            "answer": 0,
            "why": "HTTP/2 binary framing splits requests into streams and interleaves frames over one TCP connection, so slow streams do not block fast streams."
        }
    },
    {
        "title": "TLS ALPN Protocol Negotiation & Flow Control Windows (SETTINGS, WINDOW_UPDATE)",
        "say": p2_say,
        "code": p2_code,
        "output": out2,
        "check": {
            "question": "What is the primary role of HTTP/2 credit-based flow control (WINDOW_UPDATE)?",
            "options": [
                "To prevent a fast sender from overwhelming a receiver's local memory buffer by requiring explicit byte credits before sending DATA frames",
                "To charge clients money for sending large files",
                "To automatically restart the operating system when buffers fill up",
                "To convert HTTP/2 streams into WebSocket connections"
            ],
            "answer": 0,
            "why": "Flow control windows track available buffer space; senders must pause when credits reach zero until the receiver sends a WINDOW_UPDATE."
        }
    },
    {
        "title": "gRPC Architectural Fundamentals: HTTP/2 Underpinnings, Protobuf Contracts & Type Safety",
        "say": p3_say,
        "code": p3_code,
        "output": out3,
        "check": {
            "question": "How are gRPC method calls mapped onto HTTP/2 network requests?",
            "options": [
                "As an HTTP/2 POST request to path /package.Service/Method with Content-Type: application/grpc and binary Protocol Buffer body",
                "As an HTTP GET request with query parameters",
                "As an unencrypted FTP file transfer",
                "As a DNS MX record lookup"
            ],
            "answer": 0,
            "why": "gRPC uses HTTP/2 POST with path /package.Service/Method, application/grpc content type, length-prefixed Protobuf messages, and grpc-status trailers."
        }
    },
    {
        "title": "Unary vs Streaming RPC Models: Server-Streaming, Client-Streaming & Bidirectional Duplex",
        "say": p4_say,
        "code": p4_code,
        "output": out4,
        "check": {
            "question": "What defines a Bidirectional Streaming RPC (Duplex) in gRPC?",
            "options": [
                "Both client and server send a continuous stream of messages over an independent HTTP/2 stream concurrently",
                "The server sends a file, and the client prints it to physical paper",
                "A call that only executes on leap years",
                "A request that can only send numbers, not strings"
            ],
            "answer": 0,
            "why": "Bidirectional streaming allows both client and server to write independent streams of messages concurrently over a single HTTP/2 stream."
        }
    },
    {
        "title": "Production gRPC Interceptors: Metadata Propagation, Deadline Budgets & Circuit Breakers",
        "say": p5_say,
        "code": p5_code,
        "output": out5,
        "check": {
            "question": "What happens when an RPC's deadline expires according to gRPC deadline propagation rules?",
            "options": [
                "The operation aborts immediately across the distributed call tree with grpc-status: 4 (DEADLINE_EXCEEDED), preventing orphaned computation",
                "The server restarts automatically",
                "The client is banned from the network for 24 hours",
                "The database commits all un-validated transactions"
            ],
            "answer": 0,
            "why": "Deadline propagation ensures that when a deadline expires, all downstream services abort immediately with DEADLINE_EXCEEDED to conserve resources."
        }
    }
]

day44 = {
    "day": 44,
    "title": "High-Performance Networking: HTTP/2 Multiplexing, ALPN Negotiation & gRPC Services in Node.js",
    "goal": "Master next-generation network transports in Node.js: analyze HTTP/1.1 head-of-line blocking, HTTP/2 binary framing (HEADERS, DATA, SETTINGS), ALPN TLS handshakes, gRPC unary vs streaming RPCs, and backpressure flow control.",
    "minutes": 38,
    "recap": "Yesterday in Day 43, we conquered Protocol Buffers binary serialization and zero-copy TypedArray slicing. Today in Day 44, we master HTTP/2 binary framing, ALPN negotiation, stream flow control, and enterprise gRPC architectures.",
    "parts": parts,
    "summary": [
        "HTTP/2 replaces textual HTTP/1.1 with binary framing, multiplexing multiple streams concurrently over a single TCP socket.",
        "TLS ALPN extension negotiates 'h2' protocol support during the initial handshake, eliminating upgrade round trips.",
        "Credit-based flow control (WINDOW_UPDATE) prevents buffer overflows across shared multi-stream connections.",
        "gRPC maps remote method invocations to HTTP/2 POST endpoints with length-prefixed Protobuf payloads and grpc-status trailers.",
        "gRPC interceptors enforce cross-cutting authentication, distributed tracing, and deadline budget propagation across microservices."
    ],
    "projectStep": {
        "title": "Build Enterprise gRPC Microservice & Interceptor Engine",
        "steps": [
            "Run simulateHttp1VsHttp2Multiplexing to benchmark parallel socket queuing against stream frame interleaving.",
            "Execute Http2FlowControlSimulator to validate credit-based flow control pausing and WINDOW_UPDATE replenishment.",
            "Run GrpcRpcDispatcher to register and dispatch gRPC method calls over HTTP/2 paths with grpc-status trailers.",
            "Execute simulateGrpcStreamingModels to evaluate Unary, Server-Streaming, Client-Streaming, and Duplex communication.",
            "Run executeGrpcInterceptorPipeline to enforce authentication, deadline budgets, and distributed trace propagation."
        ]
    }
}

total_words = 0
for i, p in enumerate(day44['parts']):
    wc = sum(len(s.split()) for s in p['say'])
    total_words += wc
    print(f"Day 44 Part {i+1}: {wc} words")
print(f"Total Day 44 Words: {total_words}")

assert all(sum(len(s.split()) for s in p['say']) >= 580 for p in day44['parts']), "All parts must be >= 580 words!"
assert total_words >= 2900, "Total words must be >= 2900!"

with open('scripts/node_day44.json', 'w', encoding='utf-8') as f:
    json.dump(day44, f, indent=2)

print("Generated scripts/node_day44.json successfully!")
