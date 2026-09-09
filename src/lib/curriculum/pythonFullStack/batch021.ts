// src/lib/curriculum/pythonFullStack/batch021.ts
// Single Source of Truth for PINIT BATCH 021: Month 6 · Week 21 · Days 103–107
// Web Fundamentals: Wire-Level HTTP/1.1 Framing Subset, Sockets, Slowloris & Smuggling Defenses
// Pedagogical Flow: UNDERSTAND (Wire Protocol & Framing) -> APPLY (Headers & Content Negotiation) -> BUILD (Zero-Dependency Socket Server) -> DEBUG (Slowloris, Smuggling & Trailer Rejection) -> TRANSFER (RFC 9112 Framing Subset Server Engine Capstone)

import {
  BatchContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  DebuggingChallengeBlock,
  TransferChallengeBlock,
  ReflectionBlock,
  ReferenceBlock,
} from '../contentTypes';
import { Assessment } from '../assessmentTypes';

export const COMPETENCY_ID_HTTP_WIRE_PROTOCOL_AND_SOCKETS = 'comp-pfs-m6-021';

// ── CANONICAL DOMAIN EXCEPTIONS FOR HTTP PARSER & SERVER ENGINE ──
// Used across instruction, labs, challenges, and assessment contracts:
// 1. HttpParsingError: Base domain exception for HTTP protocol framing failures.
// 2. RequestSmugglingError: Raised when conflicting framing (CL/TE ambiguity, duplicate CL) is detected.
// 3. SecurityViolationError: Raised on path traversal attempts or unauthorized access.

// ── DAY 103: UNDERSTAND — The Wire Protocol: HTTP/1.1 Framing, Sockets & Method Semantics ──
export const DAY_103_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w21-021',
  dayNumber: 1,
  title: 'The Wire Protocol: HTTP/1.1 Framing, Sockets & Method Semantics',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b21-d103-01',
      type: 'THEORY',
      order: 1,
      title: 'Stream-Oriented TCP vs Application Framing & RFC 9110 Method Semantics',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Demystify how web communication travels over TCP streams as raw ASCII/byte text. Learn why TCP has no message boundaries, understand how HTTP/1.1 frames messages, clarify kernel TCP handshake layering, and master RFC 9110 method semantics.',
      whatItIs: 'At the physical network layer, TCP provides a reliable, ordered, bidirectional stream of raw bytes. TCP has no built-in concept of "messages" or "packets" at the application layer; bytes sent in separate write() calls can be concatenated or fragmented arbitrarily across recv() calls.\n\nThe TCP three-way handshake (SYN -> SYN-ACK -> ACK) is managed entirely by the operating system kernel network stack below the application layer. Python socket calls operate on established socket file descriptors; Python code does not manually construct or exchange SYN/ACK packets.\n\nHTTP/1.1 (RFC 9112) solves the framing problem at the application layer using text delimiters and header length metadata:\n- Request Line: METHOD SP Request-URI SP HTTP/1.1 CRLF\n- Headers: Field-Name: SP Field-Value CRLF\n- Header Terminator: CRLF (empty line)\n- Body: Delimited by Content-Length or Transfer-Encoding: chunked\n\nMethod Semantics (RFC 9110):\n- Safe: GET, HEAD, OPTIONS, TRACE (read-only; server state is not altered).\n- Idempotent: PUT, DELETE, and all safe methods (multiple identical requests have the same intended effect as a single request).\n- Non-Inherently Idempotent: POST (arbitrary action/creation); PATCH (operation-dependent idempotency).',
      whyItExists: 'Enables any client (browser, curl, mobile app) and any server (Python, Nginx, Go) on any hardware architecture to communicate over plain TCP sockets without shared binary runtimes or proprietary protocols.',
      problemSolved: 'Transforms raw, unsegmented TCP byte streams into structured, machine-parsable request and response objects with clear message boundary demarcation.',
      mentalModel: 'The Conveyor Belt with Telegram Envelopes: TCP is a continuous conveyor belt moving individual letters. HTTP/1.1 is the telegram format: the envelope address (request line and headers) ends with a double return (\\r\\n\\r\\n). Once you read the double return, you check the stamped page count (Content-Length) to know exactly how many letters belong to the letter body before the next envelope begins.',
      realWorldUse: 'Web browsers, REST APIs, reverse proxies (Nginx, Envoy), API gateways, and microservice inter-process communication.',
      commonMistakes: [
        'Assuming a single sock.recv(4096) returns exactly one full HTTP request: TCP packet fragmentation can deliver half a header or multiple requests in one read.',
        'Believing Python socket code implements the TCP handshake: the kernel executes SYN/ACK; socket.accept() returns only after the handshake is complete.',
        'Assuming PATCH is always idempotent: unlike PUT (which replaces entire representation), PATCH modifies existing state and its idempotency depends entirely on the patch mutation semantics.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b21-d103-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Inspecting Raw HTTP/1.1 Framing and Method Contracts over Python Sockets',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Connect to an echo HTTP endpoint using raw Python sockets, format an RFC 9112 compliant request line and headers, and parse the raw response status line.',
      code: `import socket

def format_http_request(method: str, path: str, host: str, body: str = "") -> bytes:
    """Constructs raw HTTP/1.1 byte payload with RFC 9112 framing."""
    lines = [
        f"{method} {path} HTTP/1.1",
        f"Host: {host}",
        "User-Agent: PinIT-RawClient/1.0",
        "Connection: close",
    ]
    if body:
        lines.append(f"Content-Length: {len(body.encode('utf-8'))}")
        lines.append("Content-Type: text/plain; charset=utf-8")
    
    # Empty line separates headers from body
    header_section = "\\r\\n".join(lines) + "\\r\\n\\r\\n"
    return header_section.encode("iso-8859-1") + body.encode("utf-8")

# Demonstration of raw wire byte representation:
raw_bytes = format_http_request("GET", "/health", "api.internal.local")
print("Raw Wire Request:")
print(repr(raw_bytes))

# Parsing status line from raw response bytes:
raw_response = b"HTTP/1.1 200 OK\\r\\nContent-Type: text/plain\\r\\nContent-Length: 2\\r\\n\\r\\nOK"
header_part, _, body_part = raw_response.partition(b"\\r\\n\\r\\n")
lines = header_part.decode("iso-8859-1").split("\\r\\n")
status_line = lines[0]
protocol, status_code, reason = status_line.split(" ", 2)
print("\\nParsed Status Line:")
print(f"Protocol: {protocol}, Status Code: {int(status_code)}, Reason: {reason}")
`,
      expectedOutput: "Raw Wire Request:\nb'GET /health HTTP/1.1\\r\\nHost: api.internal.local\\r\\nUser-Agent: PinIT-RawClient/1.0\\r\\nConnection: close\\r\\n\\r\\n'\n\nParsed Status Line:\nProtocol: HTTP/1.1, Status Code: 200, Reason: OK",
      annotatedWalkthrough: [
        { line: 6, annotation: 'Request line uses strict METHOD SP URI SP HTTP/1.1 CRLF format.' },
        { line: 7, annotation: 'Host header is mandatory in all HTTP/1.1 requests.' },
        { line: 15, annotation: 'Terminating double CRLF (\\r\\n\\r\\n) marks the end of headers.' },
        { line: 24, annotation: 'Uses partition(b"\\r\\n\\r\\n") to isolate header bytes from body bytes.' },
      ],
    } as ExampleBlock,
    {
      id: 'blk-b21-d103-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Parsing Request Line Components',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instruction: 'Implement parse_request_line(raw_line: str) that validates origin-form request lines and extracts (method, target, version). Reject malformed tokens with ValueError.',
      starterCode: `# Practice: Implement parse_request_line
# Requirements:
# 1. Takes raw_line (e.g. "GET /index.html HTTP/1.1")
# 2. Rejects if not exactly 3 tokens separated by space
# 3. Validates method is uppercase letters only
# 4. Validates target starts with '/' (origin-form)
# 5. Validates version is 'HTTP/1.1'
# Returns (method, target, version)

def parse_request_line(raw_line: str) -> tuple[str, str, str]:
    pass
`,
      solutionCode: `def parse_request_line(raw_line: str) -> tuple[str, str, str]:
    parts = raw_line.split(" ")
    if len(parts) != 3:
        raise ValueError("Malformed request line: must contain exactly 3 tokens")
    method, target, version = parts
    if not method.isalpha() or not method.isupper():
        raise ValueError(f"Invalid method: {method}")
    if not target.startswith("/"):
        raise ValueError(f"Invalid request target (origin-form required): {target}")
    if version != "HTTP/1.1":
        raise ValueError(f"Unsupported HTTP version: {version}")
    return method, target, version
`,
      validationCriteria: [
        'Splits on space and validates exactly 3 tokens.',
        'Enforces uppercase alphabetical method.',
        'Requires origin-form target starting with /.',
        'Enforces version string HTTP/1.1.',
      ],
      hints: [
        'Use raw_line.split(" ") to split tokens.',
        'Check target.startswith("/") to enforce origin-form.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b21-d103-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Method Idempotency vs Safety',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Under RFC 9110, why is DELETE classified as idempotent, but NOT safe?',
      options: [
        'Because DELETE modifies server resource state (making it non-safe), but repeating the same DELETE request multiple times produces the same final intended state (resource is deleted), making it idempotent.',
        'Because DELETE always returns 200 OK without altering files.',
        'Because DELETE can only be sent over encrypted TLS connections.',
        'Because DELETE is converted to a GET request by intermediate proxies.',
      ],
      correctIndex: 0,
      explanation: 'A method is safe if it does not alter server resource state (read-only like GET, HEAD, OPTIONS). A method is idempotent if multiple identical requests have the same intended effect on server state as a single request. DELETE modifies state (non-safe), but repeating it leaves the resource deleted (idempotent).',
      misconceptionIdentified: 'Confusing method safety (read-only) with idempotency (repeatable state).',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b21-d103-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Reflection: Why TCP Message Boundaries Matter',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on socket programming: what happens if a naive HTTP server assumes that a single call to client_socket.recv(1024) will always contain the entire HTTP request? What happens on high-latency networks?',
    } as ReflectionBlock,
  ],
};

// ── DAY 104: APPLY — Headers, Content Negotiation, MIME Types & Status Code Taxonomy ──
export const DAY_104_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w21-021',
  dayNumber: 2,
  title: 'Headers, Content Negotiation, MIME Types & Status Code Taxonomy',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b21-d104-01',
      type: 'THEORY',
      order: 1,
      title: 'HTTP Metadata Engineering, Caching Semantics & Status Code Classification',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master HTTP header metadata, content negotiation, caching controls (Cache-Control, ETag), and authoritative status code categories (1xx through 5xx).',
      whatItIs: 'HTTP headers are key-value metadata pairs providing contextual instructions for request routing, representation negotiation, authentication, and caching. In HTTP/1.1, field names are case-insensitive ASCII strings followed by a colon and field value.\n\nStatus Code Classification:\n- 1xx Informational: Protocol handshakes (101 Switching Protocols).\n- 2xx Success: 200 OK, 201 Created, 204 No Content (must have no body!).\n- 3xx Redirection: 301 Moved Permanently, 302 Found, 304 Not Modified (conditional cache hit; must have no body!).\n- 4xx Client Errors: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 408 Request Timeout, 413 Payload Too Large, 414 URI Too Long, 431 Request Header Fields Too Large.\n- 5xx Server Errors: 500 Internal Server Error, 501 Not Implemented, 502 Bad Gateway, 503 Service Unavailable, 505 HTTP Version Not Supported.\n\nContent Negotiation & Caching:\n- Accept and Content-Type negotiate representations (text/html, application/json, text/plain).\n- Cache-Control (no-cache, no-store, max-age=N) governs proxy and browser cache lifetimes.\n- ETag + If-None-Match allows servers to return 304 Not Modified without retransmitting unchanged content bodies.',
      whyItExists: 'Allows heterogeneous distributed clients and servers to negotiate data representations, optimize bandwidth via conditional caching, and communicate execution states precisely.',
      problemSolved: 'Eliminates ambiguities about whether an operation succeeded, failed due to invalid client input, or crashed due to server-side exceptions.',
      mentalModel: 'The Airport Baggage Tag & Gate Board: The body is the luggage. The headers are the routing barcode, priority stickers, and passenger name on the tag. The status code is the departure gate display: 200 (Flight Boarded), 404 (Gate Not Found), 408 (Boarding Call Expired / Timeout), 500 (Mechanical Engine Failure).',
      realWorldUse: 'RESTful API contract negotiation, CDN caching configurations, browser asset preloading, and authentication bearer token transmission.',
      commonMistakes: [
        'Returning a response body with status 204 or 304: RFC 9112 strictly forbids message bodies on 204 No Content and 304 Not Modified.',
        'Treating header names as case-sensitive: "Content-Type" and "content-type" represent the exact same header.',
        'Claiming full RFC conformance when only implementing a subset: production systems must be honest about their supported feature boundary.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b21-d104-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building a Pure-Python Header Parser with Case-Insensitive Normalization',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Implement an RFC-aligned header dictionary maintaining case-insensitivity while preserving original field casing, and generating response headers conforming to the defined Batch 021 HTTP subset.',
      code: `class CaseInsensitiveHeaders:
    """Dictionary wrapper providing case-insensitive header lookups."""
    def __init__(self) -> None:
        self._data: dict[str, str] = {}
        self._raw_keys: dict[str, str] = {}

    def set(self, key: str, value: str) -> None:
        normalized = key.lower()
        self._data[normalized] = value.strip()
        self._raw_keys[normalized] = key

    def get(self, key: str, default: str | None = None) -> str | None:
        return self._data.get(key.lower(), default)

    def to_http_bytes(self) -> bytes:
        """Serializes headers conforming to the defined Batch 021 HTTP subset."""
        lines = [f"{self._raw_keys[k]}: {v}" for k, v in self._data.items()]
        return ("\\r\\n".join(lines) + "\\r\\n\\r\\n").encode("iso-8859-1")

# Demonstration:
headers = CaseInsensitiveHeaders()
headers.set("Content-Type", "application/json; charset=utf-8")
headers.set("Content-Length", "42")
headers.set("Cache-Control", "public, max-age=3600")

print("Lookup by lowercase 'content-type':", headers.get("content-type"))
print("Lookup by uppercase 'CONTENT-LENGTH':", headers.get("CONTENT-LENGTH"))
print("Wire Bytes:\\n" + repr(headers.to_http_bytes()))
`,
      expectedOutput: "Lookup by lowercase 'content-type': application/json; charset=utf-8\nLookup by uppercase 'CONTENT-LENGTH': 42\nWire Bytes:\n'Content-Type: application/json; charset=utf-8\\r\\nContent-Length: 42\\r\\nCache-Control: public, max-age=3600\\r\\n\\r\\n'",
      annotatedWalkthrough: [
        { line: 8, annotation: 'Normalizes lookup keys to lowercase while preserving raw formatting.' },
        { line: 15, annotation: 'Serializes headers with CRLF line separators ending with double CRLF.' },
        { line: 24, annotation: 'Confirms lookups succeed regardless of caller casing.' },
      ],
    } as ExampleBlock,
    {
      id: 'blk-b21-d104-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Generating Response Status Lines and Headers',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instruction: 'Implement build_response(status_code: int, body: bytes, content_type: str) returning formatted HTTP/1.1 response bytes conforming to the defined Batch 021 subset.',
      starterCode: `# Practice: Implement build_response
# Requirements:
# 1. Maps status codes to reasons: 200 -> "OK", 400 -> "Bad Request", 404 -> "Not Found", 500 -> "Internal Server Error"
# 2. Includes mandatory Content-Type and Content-Length headers for bodies
# 3. For 204 or 304, enforces ZERO body and no Content-Length

def build_response(status_code: int, body: bytes = b"", content_type: str = "text/plain") -> bytes:
    pass
`,
      solutionCode: `STATUS_REASONS = {
    200: "OK",
    204: "No Content",
    304: "Not Modified",
    400: "Bad Request",
    404: "Not Found",
    500: "Internal Server Error",
    501: "Not Implemented",
}

def build_response(status_code: int, body: bytes = b"", content_type: str = "text/plain") -> bytes:
    reason = STATUS_REASONS.get(status_code, "Unknown")
    lines = [f"HTTP/1.1 {status_code} {reason}"]
    
    if status_code in (204, 304):
        # RFC invariant: 204 and 304 MUST NOT have a message body
        lines.append("Connection: close")
        return ("\\r\\n".join(lines) + "\\r\\n\\r\\n").encode("iso-8859-1")

    lines.append(f"Content-Type: {content_type}")
    lines.append(f"Content-Length: {len(body)}")
    lines.append("Connection: close")
    header_bytes = ("\\r\\n".join(lines) + "\\r\\n\\r\\n").encode("iso-8859-1")
    return header_bytes + body
`,
      validationCriteria: [
        'Maps status codes to standard reason phrases.',
        'Enforces zero body and no Content-Length for 204/304.',
        'Calculates accurate Content-Length for bodies.',
      ],
      hints: [
        'Check status_code in (204, 304) and return headers without body.',
        'Use len(body) to determine the Content-Length value in bytes.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b21-d104-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: RFC Response Body Prohibitions',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which HTTP status codes strictly forbid the server from including a message body in the response?',
      options: [
        '204 No Content and 304 Not Modified (as well as all responses to HEAD requests).',
        '200 OK and 201 Created.',
        '404 Not Found and 500 Internal Server Error.',
        'Only 503 Service Unavailable.',
      ],
      correctIndex: 0,
      explanation: 'Under RFC 9112 Section 6.3, responses with status codes 1xx (Informational), 204 (No Content), and 304 (Not Modified), as well as any response to a HEAD request, MUST NOT include a message body. Any response body transmitted with these statuses causes framing desynchronization.',
      misconceptionIdentified: 'Assuming all HTTP responses can optionally carry payload bodies.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b21-d104-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Reflection: ETag Validation vs Full Re-download',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on bandwidth efficiency: how does conditional GET with If-None-Match and 304 Not Modified protect mobile users and cloud egress budgets compared to unconditional asset fetching?',
    } as ReflectionBlock,
  ],
};

// ── DAY 105: BUILD — Zero-Dependency Raw HTTP Server with Sockets & Hard Limits ──
export const DAY_105_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w21-021',
  dayNumber: 3,
  title: 'Zero-Dependency Raw HTTP Server with Sockets & Hard Limits',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b21-d105-01',
      type: 'THEORY',
      order: 1,
      title: 'Single-Threaded Socket Server Architecture, Resource Limits & Path Containment',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Build a zero-dependency HTTP server using standard library socket. Enforce hard resource limits, implement anti-slowloris elapsed deadlines, document single-threaded concurrency limitations, and construct a multi-step path traversal defense.',
      whatItIs: 'A raw socket HTTP server creates a listening TCP socket, accepts incoming client connections, accumulates raw bytes until message headers are fully framed (\\r\\n\\r\\n), extracts origin-form request targets (/path?query, rejecting unsupported absolute/authority/asterisk forms with 501 Not Implemented + Connection: close), routes requests, and transmits framed responses.\n\nConcurrency & Architecture Scope:\nThis single-threaded server is an educational protocol implementation, not a production concurrency architecture. Concurrent connection handling, asynchronous non-blocking I/O, and worker pools are intentionally deferred to Phase 3. One active connection occupies the single thread during the read deadlines.\n\nDeterministic Resource & DoS Limits:\n- MAX_REQUEST_LINE_BYTES = 8192 (rejects with 414 URI Too Long).\n- MAX_HEADER_BYTES = 32768 (rejects with 431 Request Header Fields Too Large).\n- MAX_BODY_BYTES = 10485760 (rejects with 413 Payload Too Large).\n- SOCKET_READ_TIMEOUT = 5.0s (inactivity timer).\n- HEADER_READ_DEADLINE = 10.0s (max total elapsed time to receive \\r\\n\\r\\n).\n- BODY_READ_DEADLINE = 30.0s (max total elapsed time to receive body).\n\nPath Traversal Defense Pipeline:\n1. Split request-target at "?" into path and query.\n2. Percent-decode path (urllib.parse.unquote) and normalize separators.\n3. Reject if path contains NUL bytes (\\x00) -> 400 Bad Request.\n4. Resolve absolute filesystem path (os.path.realpath).\n5. Security Invariant: Verify canonical path starts with canonical document root (os.path.commonpath([doc_root, resolved_path]) == doc_root).\n6. If verified -> serve file; else -> 403 Forbidden or 404 Not Found.',
      whyItExists: 'Provides an unmediated understanding of what web frameworks (Django, FastAPI, Flask) do under the hood, and builds deep defensive engineering discipline against real-world network attacks.',
      problemSolved: 'Prevents server memory exhaustion from oversized headers/bodies, thwarts slowloris connection starvation, and completely neutralizes directory traversal vulnerabilities.',
      mentalModel: 'The Castle Drawbridge with Checkpoints: Every visitor (socket) must cross through measured gates. If their banner is too long (414), their bag too heavy (413), or they loiter on the bridge too long (408 deadline), the drawbridge is immediately raised and the connection severed. If they try to slip through secret tunnels outside the courtyard (path traversal), the guards reject them at the gate.',
      realWorldUse: 'Embedded devices, lightweight health check probes, diagnostic micro-agents, and high-security air-gapped utilities.',
      commonMistakes: [
        'Relying on os.path.realpath() alone for security: realpath() resolves symlinks and .. references, but you must explicitly verify that the result resides inside the allowed document root.',
        'Assuming socket timeout protects against slowloris: an attacker trickling 1 byte every 4 seconds evades a 5-second inactivity timeout; wall-clock deadlines are mandatory.',
        'Mixing query parameters into filesystem paths: request-target must be split at "?" before canonicalizing file paths.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b21-d105-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building the Multi-Step Path Traversal Defense and Accumulator Parser',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Implement the safe path resolution function with document root containment and demonstrate the accumulator buffer loop with header byte limits.',
      code: `import os
import urllib.parse

def resolve_safe_path(doc_root: str, request_target: str) -> str | None:
    """Safely resolves an origin-form request target within doc_root.
    
    Returns canonical path if within doc_root, or None if traversal/violation detected.
    """
    # 1. Separate path from query string
    path_part, _, _ = request_target.partition("?")
    
    # 2. Reject NUL bytes immediately
    if "\\x00" in path_part:
        return None
        
    # 3. Percent-decode and normalize path
    decoded = urllib.parse.unquote(path_part)
    
    # Strip leading slashes to prevent absolute root override
    relative_path = decoded.lstrip("/")
    
    # 4. Resolve canonical paths
    canonical_root = os.path.realpath(doc_root)
    candidate_path = os.path.realpath(os.path.join(canonical_root, relative_path))
    
    # 5. Verify containment: candidate must reside inside canonical_root
    try:
        common = os.path.commonpath([canonical_root, candidate_path])
        if common == canonical_root:
            return candidate_path
    except ValueError:
        # Different drives on Windows
        return None
    return None

# Verification against adversarial attacks:
DOC_ROOT = "/var/www/static"
print("Safe access:", resolve_safe_path(DOC_ROOT, "/images/logo.png"))
print("Traversal attack (../):", resolve_safe_path(DOC_ROOT, "/../../etc/passwd"))
print("Encoded traversal (%2e%2e):", resolve_safe_path(DOC_ROOT, "/%2e%2e/shadow"))
print("NUL injection:", resolve_safe_path(DOC_ROOT, "/file.png\\x00.exe"))
`,
      expectedOutput: "Safe access: /var/www/static/images/logo.png\nTraversal attack (../): None\nEncoded traversal (%2e%2e): None\nNUL injection: None",
      annotatedWalkthrough: [
        { line: 9, annotation: 'Separates query string before processing filesystem path.' },
        { line: 12, annotation: 'Rejects NUL byte attacks (which can truncate paths in C runtime).' },
        { line: 16, annotation: 'Percent-decodes %2e%2e into .. before resolution.' },
        { line: 24, annotation: 'commonpath verifies candidate_path starts with canonical_root.' },
      ],
    } as ExampleBlock,
    {
      id: 'blk-b21-d105-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Accumulator Loop with Deadlines and Byte Limits',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instruction: 'Implement read_headers_bounded(sock) that accumulates bytes until \\r\\n\\r\\n, enforcing MAX_HEADER_BYTES and HEADER_READ_DEADLINE.',
      starterCode: `import time

MAX_HEADER_BYTES = 32_768
HEADER_DEADLINE_SEC = 10.0

class HeaderTooLargeError(Exception): pass
class HeaderTimeoutError(Exception): pass

def read_headers_bounded(recv_fn) -> bytes:
    # recv_fn() returns bytes on call; simulates sock.recv
    pass
`,
      solutionCode: `import time

MAX_HEADER_BYTES = 32_768
HEADER_DEADLINE_SEC = 10.0

class HeaderTooLargeError(Exception): pass
class HeaderTimeoutError(Exception): pass

def read_headers_bounded(recv_fn) -> bytes:
    buffer = bytearray()
    start_time = time.monotonic()
    
    while True:
        if time.monotonic() - start_time > HEADER_DEADLINE_SEC:
            raise HeaderTimeoutError("Exceeded 10s header read deadline")
            
        chunk = recv_fn(4096)
        if not chunk:
            break
            
        buffer.extend(chunk)
        if len(buffer) > MAX_HEADER_BYTES:
            raise HeaderTooLargeError("Headers exceeded 32 KiB limit")
            
        if b"\\r\\n\\r\\n" in buffer:
            return bytes(buffer)
            
    raise ConnectionResetError("Connection closed before complete headers received")
`,
      validationCriteria: [
        'Enforces wall-clock deadline using time.monotonic().',
        'Enforces MAX_HEADER_BYTES limit on accumulated buffer.',
        'Stops and returns bytes upon finding double CRLF.',
      ],
      hints: [
        'Use time.monotonic() - start_time to track elapsed wall-clock seconds.',
        'Check b"\\r\\n\\r\\n" in buffer on every iteration.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b21-d105-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Commonpath Containment Invariant',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is "candidate_path.startswith(doc_root)" an insecure containment check compared to "os.path.commonpath([canonical_root, candidate_path]) == canonical_root"?',
      options: [
        'Because if doc_root is "/var/www", startswith would erroneously allow access to "/var/www-secret/passwords.txt", whereas commonpath verifies full directory path hierarchy.',
        'Because startswith() only works on ASCII strings and fails on UTF-8 paths.',
        'Because commonpath() automatically encrypts the filesystem.',
        'Because startswith() raises a RuntimeError if the candidate path contains numbers.',
      ],
      correctIndex: 0,
      explanation: 'A string startswith check checks character prefixes, not directory boundaries. If doc_root is "/app/data", a candidate path "/app/data_private/keys.pem" passes startswith("/app/data") but fails commonpath. os.path.commonpath correctly respects directory segment boundaries.',
      misconceptionIdentified: 'Believing string prefix matching is sufficient for filesystem directory containment.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b21-d105-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Reflection: Single-Threaded Event Loops vs Worker Pools',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on concurrency limitations: why is a blocking single-threaded socket server vulnerable to denial of service even with strict deadlines, and how do multi-worker (pre-fork) or async event loop architectures solve this in Phase 3?',
    } as ReflectionBlock,
  ],
};

// ── DAY 106: DEBUG — Slowloris Deadlines, Smuggling Defenses & 501 Trailer Rejection ──
export const DAY_106_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w21-021',
  dayNumber: 4,
  title: 'Slowloris Deadlines, Smuggling Defenses & 501 Trailer Rejection',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b21-d106-01',
      type: 'THEORY',
      order: 1,
      title: 'HTTP Request Smuggling Vectors, Framing Ambiguities & Cumulative Chunk Limits',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Learn how inconsistent framing creates HTTP request smuggling vulnerabilities. Implement defenses against duplicate Host headers, duplicate Content-Length, Transfer-Encoding conflicts, whitespace-before-colon, cumulative chunk limits, and deterministic 501 trailer rejection.',
      whatItIs: 'HTTP Request Smuggling occurs when a frontend reverse proxy and a backend server interpret message boundaries differently. If an attacker sends ambiguous framing, the frontend may see one request while the backend sees two, allowing the attacker to prepend malicious requests to innocent user traffic.\n\nKey RFC 9112 Defense Invariants:\n1. Mandatory Single Host: Exactly one Host header is permitted. Missing or duplicate Host headers MUST be rejected with 400 Bad Request + Connection: close.\n2. Duplicate Content-Length: In this educational subset, ANY duplicate Content-Length header is rejected with 400 Bad Request + Connection: close to eliminate ambiguity.\n3. Transfer-Encoding + Content-Length Conflict: If both are present, per RFC 9112 Section 6.1, Transfer-Encoding overrides Content-Length; however, because this combination often signals smuggling attacks, the server rejects it with 400 Bad Request + Connection: close.\n4. Whitespace Before Colon: Header lines formatted as "Header-Name : Value" (space before colon) MUST be rejected with 400 Bad Request per RFC 9112 Section 5.1.\n5. Invalid Content-Length: Negative, non-numeric, or overflow numbers MUST reject with 400 Bad Request + Connection: close.\n6. Chunked Trailers: Trailer fields are outside the Batch 021 subset. After the zero-size chunk (0\\r\\n), only an empty trailer section (0\\r\\n\\r\\n) is accepted. Any non-empty trailer fields deterministically trigger 501 Not Implemented + Connection: close.\n7. Cumulative Decoded Body Limit: Tracking total decoded bytes across all chunks; if cumulative bytes exceed MAX_BODY_BYTES (10 MiB), abort immediately with 413 Payload Too Large + Connection: close.',
      whyItExists: 'Protects backend web servers from critical security vulnerabilities (credential hijacking, cache poisoning, bypass of security controls) caused by parsing discrepancies.',
      problemSolved: 'Eliminates request smuggling vulnerabilities, terminates slowloris drip feeds, and protects server memory from unbounded chunked payload exhaustion.',
      mentalModel: 'The Two Border Inspectors with Different Rules: Inspector A reads the weight sticker (Content-Length); Inspector B reads the cargo box seals (Chunked). An attacker sends both with conflicting numbers so Inspector A lets the truck through, while Inspector B thinks the leftover cargo is a new unregistered vehicle. Rejecting ambiguous stickers at the gate neutralizes the smuggling entirely.',
      realWorldUse: 'Hardening reverse proxies, web application firewalls (WAFs), and production API server engines.',
      commonMistakes: [
        'Allowing duplicate Content-Length headers: different parsers pick the first or last value, creating classic smuggling vulnerabilities.',
        'Accepting whitespace before colon: obsolete parsers permit it, but RFC 9112 bans it because proxies strip spaces while backends may treat it as invalid.',
        'Enforcing chunk limits per-chunk rather than cumulatively: an attacker sending 10,000 valid 1 MiB chunks exhausts 10 GiB of RAM if cumulative size is not tracked.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b21-d106-02',
      type: 'DEBUGGING_CHALLENGE',
      order: 2,
      title: 'Debugging Challenge: Neutralizing Smuggling Vectors & Ambiguous Framing',
      estimatedMinutes: 30,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_HTTP_WIRE_PROTOCOL_AND_SOCKETS,
      problemDescription: 'Audit and debug an insecure HTTP header validation function that permits duplicate headers, ignores whitespace-before-colon, and accepts non-empty trailers.',
      description: 'Audit and debug an insecure HTTP header validation function that permits duplicate headers, ignores whitespace-before-colon, and accepts non-empty trailers.',
      symptom: 'Vulnerability to HTTP request smuggling, cache poisoning, and RFC 9112 Section 5.1/6.1 non-conformance.',
      brokenArtifact: `def validate_headers_insecure(header_lines: list[str]) -> dict[str, str]:
    headers = {}
    for line in header_lines:
        # BUG 1: Splits on colon without validating whitespace before colon!
        if ":" in line:
            key, val = line.split(":", 1)
            # BUG 2: Overwrites duplicate headers silently (smuggling hazard!)
            headers[key.lower()] = val.strip()
    return headers
`,
      fixedCode: `def validate_headers_defensive(header_lines: list[str]) -> dict[str, str]:
    headers = {}
    host_count = 0
    content_length_count = 0
    
    for line in header_lines:
        if ":" not in line:
            raise ValueError("Malformed header line: missing colon")
            
        raw_key, val = line.split(":", 1)
        
        # FIXED 1: Reject whitespace before colon (RFC 9112 Section 5.1)
        if raw_key != raw_key.rstrip():
            raise ValueError("Invalid header: whitespace before colon")
            
        key = raw_key.strip().lower()
        if not key:
            raise ValueError("Empty header name")
            
        # FIXED 2: Track and reject duplicate Host and Content-Length headers
        if key == "host":
            host_count += 1
            if host_count > 1:
                raise ValueError("Duplicate Host header detected")
        elif key == "content-length":
            content_length_count += 1
            if content_length_count > 1:
                raise ValueError("Duplicate Content-Length header detected")
                
        headers[key] = val.strip()
        
    if host_count == 0:
        raise ValueError("Missing mandatory Host header")
        
    # FIXED 3: Reject conflicting Transfer-Encoding + Content-Length
    if "transfer-encoding" in headers and "content-length" in headers:
        raise ValueError("Conflicting Transfer-Encoding and Content-Length")
        
    return headers
`,
      expectedErrors: [
        'Permits whitespace before colon in header names.',
        'Silently overwrites duplicate Host and Content-Length headers.',
        'Allows conflicting Transfer-Encoding and Content-Length headers.',
      ],
      verificationSteps: [
        'Detect raw_key != raw_key.rstrip() to catch whitespace before colon.',
        'Enforce exactly one Host header; reject duplicates.',
        'Reject duplicate Content-Length headers.',
        'Reject presence of both Transfer-Encoding and Content-Length.',
      ],
    } as DebuggingChallengeBlock,
    {
      id: 'blk-b21-d106-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Cumulative Chunked Body Decoder',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      instruction: 'Implement decode_chunked_stream(read_line_fn, read_exact_fn) that parses chunked encoding, enforces MAX_BODY_BYTES cumulatively, and returns 501 on non-empty trailers.',
      starterCode: `MAX_BODY_BYTES = 10_485_760  # 10 MiB

class ChunkDecodeError(Exception): pass
class PayloadTooLargeError(Exception): pass
class NotImplementedTrailerError(Exception): pass

def decode_chunked_body(read_line_fn, read_exact_fn) -> bytearray:
    # Decodes hex sizes, reads chunk data + CRLF, enforces cumulative MAX_BODY_BYTES,
    # and raises NotImplementedTrailerError if trailer lines exist after 0\\r\\n.
    pass
`,
      solutionCode: `MAX_BODY_BYTES = 10_485_760  # 10 MiB

class ChunkDecodeError(Exception): pass
class PayloadTooLargeError(Exception): pass
class NotImplementedTrailerError(Exception): pass

def decode_chunked_body(read_line_fn, read_exact_fn) -> bytearray:
    decoded_body = bytearray()
    
    while True:
        size_line = read_line_fn().decode("iso-8859-1").strip()
        try:
            chunk_size = int(size_line, 16)
        except ValueError:
            raise ChunkDecodeError(f"Invalid chunk hex size: {size_line}")
            
        if chunk_size == 0:
            # Check trailer section: must be immediately followed by empty line (CRLF)
            trailer_line = read_line_fn().decode("iso-8859-1")
            if trailer_line not in ("\\r\\n", "\\n", ""):
                raise NotImplementedTrailerError("Non-empty chunk trailers not implemented (501)")
            break
            
        if len(decoded_body) + chunk_size > MAX_BODY_BYTES:
            raise PayloadTooLargeError("Cumulative chunked body exceeded 10 MiB limit")
            
        data = read_exact_fn(chunk_size)
        crlf = read_exact_fn(2)
        if crlf != b"\\r\\n":
            raise ChunkDecodeError("Missing CRLF after chunk data")
            
        decoded_body.extend(data)
        
    return decoded_body
`,
      validationCriteria: [
        'Parses chunk sizes as hexadecimal integers.',
        'Enforces MAX_BODY_BYTES cumulatively across all chunks.',
        'Raises NotImplementedTrailerError if trailer line is non-empty.',
      ],
      hints: [
        'Use int(size_line, 16) to convert hex chunk length.',
        'Track len(decoded_body) + chunk_size > MAX_BODY_BYTES before reading data.',
      ],
    } as GuidedPracticeBlock,
    {
      id: 'blk-b21-d106-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Slowloris Attack Mechanics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why does an HTTP server with a 5.0-second socket read timeout still remain vulnerable to a slowloris attack unless a wall-clock deadline is enforced?',
      options: [
        'Because an attacker can send a single byte every 4.0 seconds, continually resetting the 5.0-second inactivity timer and keeping the connection open indefinitely while consuming server resources.',
        'Because slowloris uses UDP instead of TCP.',
        'Because socket timeouts only apply to outgoing data, never incoming reads.',
        'Because slowloris encrypts packets with an uncrackable quantum key.',
      ],
      correctIndex: 0,
      explanation: 'A socket read timeout only measures the time elapsed between individual read operations. A slow client sending 1 byte every 4.9 seconds never hits a 5.0-second read timeout. Enforcing a total elapsed wall-clock deadline (e.g. 10.0s total to receive all headers) ensures the connection is terminated regardless of trickle activity.',
      misconceptionIdentified: 'Believing that inactivity socket timeouts prevent trickle-feed slowloris attacks.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b21-d106-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Architectural Reflection: Why Request Smuggling is Critical',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on protocol security: why does RFC 9112 strictly mandate rejecting requests with whitespace before a header colon or conflicting Content-Length/Transfer-Encoding headers, and how does this prevent security control bypasses in enterprise architectures?',
    } as ReflectionBlock,
  ],
};

// ── DAY 107: TRANSFER — Defined RFC 9112 Framing Subset Static File & Echo Server Engine ──
export const DAY_107_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m6-w21-021',
  assessmentCode: 'ASM-PFS-M6-W21-021',
  title: 'Formative Assessment: Defined RFC 9112 Framing Subset HTTP/1.1 Server Engine',
  description: 'Implement a zero-dependency HTTP/1.1 server implementing a defined RFC 9112 framing subset with defensive socket limits, anti-slowloris deadlines, origin-form routing, request smuggling defenses, and path traversal containment.',
  type: 'CODE',
  mode: 'FORMATIVE',
  status: 'PUBLISHED',
  version: '1.0.0',
  difficulty: 'ADVANCED',
  timeLimitMinutes: 95,
  passingScore: 80,
  maxAttempts: 3,
  attemptPolicy: 'LIMITED_BEST',
  targetCompetencyId: COMPETENCY_ID_HTTP_WIRE_PROTOCOL_AND_SOCKETS,
  batchId: 'batch-pfs-m6-w21-021',
  createdAt: '2026-09-07T00:00:00.000Z',
  updatedAt: '2026-09-07T00:00:00.000Z',
  items: [
    {
      id: 'item-b21-01',
      assessmentId: 'asm-pfs-m6-w21-021',
      itemType: 'CODE',
      points: 100,
      order: 1,
      timeEstimateMinutes: 95,
      title: 'Building Defined RFC 9112 Framing Subset RawHttpEngine',
      prompt: 'Implement RawHttpEngine implementing a defined RFC 9112 framing subset:\n1) Origin-form request target parsing (/path?query), rejecting absolute/authority/asterisk forms with 501 Not Implemented + Connection: close.\n2) Mandatory single Host header validation; reject duplicate Host or duplicate Content-Length with 400 Bad Request + Connection: close.\n3) Reject conflicting Transfer-Encoding + Content-Length and whitespace-before-colon headers with 400 Bad Request + Connection: close.\n4) Hard defensive limits: MAX_REQUEST_LINE_BYTES (8 KiB -> 414), MAX_HEADER_BYTES (32 KiB -> 431), MAX_BODY_BYTES (10 MiB -> 413), and wall-clock deadlines (HEADER_DEADLINE 10s, BODY_DEADLINE 30s -> 408).\n5) Multi-step path traversal defense: decode -> NUL reject -> canonicalize -> document root containment.\n6) Deterministic 501 Not Implemented + Connection: close rejection for non-empty chunked trailers.\n7) Deterministic response framing: normal has Content-Length, HEAD has no body, 204/304 has no body, Connection: close terminates connection.',
      starterCode: `import os
import time
import urllib.parse
from typing import Any

# ── DEFENSIVE CONFIGURATION LIMITS ──
MAX_REQUEST_LINE_BYTES = 8_192      # 8 KiB -> 414 URI Too Long
MAX_HEADER_BYTES = 32_768          # 32 KiB -> 431 Request Header Fields Too Large
MAX_BODY_BYTES = 10_485_760        # 10 MiB -> 413 Payload Too Large
HEADER_READ_DEADLINE = 10.0        # Seconds -> 408 Request Timeout
BODY_READ_DEADLINE = 30.0          # Seconds -> 408 Request Timeout

class RawHttpEngine:
    """Educational HTTP/1.1 server engine implementing a defined RFC 9112 framing subset."""
    def __init__(self, doc_root: str) -> None:
        self.doc_root = os.path.realpath(doc_root)

    def handle_raw_request(self, raw_bytes: bytes) -> bytes:
        """Processes raw incoming request bytes and returns formatted HTTP response bytes."""
        # TODO: Implement RFC 9112 subset request parsing and response generation
        pass
`,
      solutionCode: `import json
import os
import time
import urllib.parse
from typing import Any

MAX_REQUEST_LINE_BYTES = 8_192
MAX_HEADER_BYTES = 32_768
MAX_BODY_BYTES = 10_485_760

class RawHttpEngine:
    """Educational HTTP/1.1 server engine implementing a defined RFC 9112 framing subset."""
    def __init__(self, doc_root: str) -> None:
        self.doc_root = os.path.realpath(doc_root)

    def _build_response(self, status_code: int, reason: str, body: bytes = b"", content_type: str = "text/plain", close_conn: bool = True) -> bytes:
        lines = [f"HTTP/1.1 {status_code} {reason}"]
        if close_conn:
            lines.append("Connection: close")
        else:
            lines.append("Connection: keep-alive")
            
        if status_code in (204, 304):
            return ("\\r\\n".join(lines) + "\\r\\n\\r\\n").encode("iso-8859-1")
            
        lines.append(f"Content-Type: {content_type}")
        lines.append(f"Content-Length: {len(body)}")
        header_bytes = ("\\r\\n".join(lines) + "\\r\\n\\r\\n").encode("iso-8859-1")
        return header_bytes + body

    def handle_raw_request(self, raw_bytes: bytes) -> bytes:
        if b"\\r\\n\\r\\n" not in raw_bytes:
            return self._build_response(400, "Bad Request", b"Missing header terminator")

        header_part, _, body_part = raw_bytes.partition(b"\\r\\n\\r\\n")
        
        if len(header_part) > MAX_HEADER_BYTES:
            return self._build_response(431, "Request Header Fields Too Large", b"Header section exceeded 32 KiB")

        lines = header_part.split(b"\\r\\n")
        request_line_bytes = lines[0]
        
        if len(request_line_bytes) > MAX_REQUEST_LINE_BYTES:
            return self._build_response(414, "URI Too Long", b"Request line exceeded 8 KiB")

        try:
            request_line = request_line_bytes.decode("iso-8859-1")
        except UnicodeDecodeError:
            return self._build_response(400, "Bad Request", b"Invalid request line encoding")

        tokens = request_line.split(" ")
        if len(tokens) != 3:
            return self._build_response(400, "Bad Request", b"Malformed request line")

        method, target, version = tokens
        
        if version != "HTTP/1.1":
            return self._build_response(505, "HTTP Version Not Supported", b"Only HTTP/1.1 supported")

        # Request target contract: only origin-form accepted
        if not target.startswith("/"):
            return self._build_response(501, "Not Implemented", b"Only origin-form request targets supported")

        # Parse headers defensively
        headers: dict[str, str] = {}
        host_count = 0
        cl_count = 0

        for h_line_bytes in lines[1:]:
            if not h_line_bytes:
                continue
            try:
                h_line = h_line_bytes.decode("iso-8859-1")
            except UnicodeDecodeError:
                return self._build_response(400, "Bad Request", b"Invalid header encoding")

            if ":" not in h_line:
                return self._build_response(400, "Bad Request", b"Missing colon in header line")

            raw_name, val = h_line.split(":", 1)
            
            # Whitespace before colon rejection
            if raw_name != raw_name.rstrip():
                return self._build_response(400, "Bad Request", b"Whitespace before header colon forbidden")

            name = raw_name.strip().lower()
            if not name:
                return self._build_response(400, "Bad Request", b"Empty header name")

            if name == "host":
                host_count += 1
                if host_count > 1:
                    return self._build_response(400, "Bad Request", b"Duplicate Host header")
            elif name == "content-length":
                cl_count += 1
                if cl_count > 1:
                    # Deterministic duplicate CL contract: any duplicate -> 400 + close
                    return self._build_response(400, "Bad Request", b"Duplicate Content-Length header")

            headers[name] = val.strip()

        if host_count != 1:
            return self._build_response(400, "Bad Request", b"Mandatory single Host header required")

        # Transfer-Encoding & Content-Length conflict
        if "transfer-encoding" in headers and "content-length" in headers:
            return self._build_response(400, "Bad Request", b"Conflicting Transfer-Encoding and Content-Length")

        # Check for chunked non-empty trailers
        if headers.get("transfer-encoding", "").lower() == "chunked":
            if b"0\\r\\n\\r\\n" not in body_part:
                # Non-empty trailer or missing zero-chunk terminator
                return self._build_response(501, "Not Implemented", b"Chunk trailers not supported")

        # Content-Length validation
        if "content-length" in headers:
            try:
                cl_val = int(headers["content-length"])
                if cl_val < 0 or cl_val > MAX_BODY_BYTES:
                    return self._build_response(413, "Payload Too Large", b"Body exceeded maximum limit")
            except ValueError:
                return self._build_response(400, "Bad Request", b"Invalid Content-Length value")

        # Method Handling
        path_part, _, _ = target.partition("?")
        if "\\x00" in path_part:
            return self._build_response(400, "Bad Request", b"NUL byte in target")

        decoded_path = urllib.parse.unquote(path_part).lstrip("/")
        candidate = os.path.realpath(os.path.join(self.doc_root, decoded_path))

        try:
            common = os.path.commonpath([self.doc_root, candidate])
            if common != self.doc_root:
                return self._build_response(403, "Forbidden", b"Path traversal forbidden")
        except ValueError:
            return self._build_response(403, "Forbidden", b"Path traversal forbidden")

        if method == "GET":
            if path_part == "/echo":
                echo_data = json.dumps({"headers": headers, "target": target}).encode("utf-8")
                return self._build_response(200, "OK", echo_data, "application/json")
            if os.path.isfile(candidate):
                with open(candidate, "rb") as f:
                    file_bytes = f.read()
                return self._build_response(200, "OK", file_bytes, "text/html")
            return self._build_response(404, "Not Found", b"File not found")

        elif method == "HEAD":
            # HEAD must return headers matching GET but strictly NO body
            if os.path.isfile(candidate):
                file_size = os.path.getsize(candidate)
                lines = [
                    "HTTP/1.1 200 OK",
                    "Content-Type: text/html",
                    f"Content-Length: {file_size}",
                    "Connection: close\\r\\n\\r\\n"
                ]
                return "\\r\\n".join(lines).encode("iso-8859-1")
            return self._build_response(404, "Not Found", b"", close_conn=True)

        return self._build_response(405, "Method Not Allowed", b"Method not allowed")
`,
      rubric: [
        {
          id: 'dim-b21-01',
          name: 'Protocol Framing & Parser Robustness',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
          description: 'Validates RFC 9112 framing subset: origin-form request targets, mandatory single Host header, header terminator parsing, and status code generation. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
          criteria: 'Origin-form enforced; unsupported forms return 501; missing/duplicate Host returns 400.',
        },
        {
          id: 'dim-b21-02',
          name: 'Request-Smuggling, Slowloris & Header Defense',
          weight: 0.20,
          maxPoints: 20,
          description: 'Validates duplicate Content-Length rejection, TE+CL ambiguity rejection, whitespace-before-colon rejection, and anti-slowloris limits.',
          criteria: 'All smuggling and malformed header vectors deterministically rejected with 400 Bad Request + Connection: close.',
        },
        {
          id: 'dim-b21-03',
          name: 'Path Traversal & Document Root Containment',
          weight: 0.15,
          maxPoints: 15,
          description: 'Validates multi-step path traversal defense pipeline: decode -> NUL reject -> canonicalize -> commonpath containment verification.',
          criteria: 'Path traversals (../, %2e%2e, NUL bytes, symlinks) blocked with 403 Forbidden.',
        },
        {
          id: 'dim-b21-04',
          name: 'Static File, MIME & Cumulative Body Limits',
          weight: 0.15,
          maxPoints: 15,
          description: 'Validates static file delivery, accurate MIME content types, and cumulative MAX_BODY_BYTES enforcement across chunked transfers.',
          criteria: 'Correct file serving; cumulative chunk limits enforced at 10 MiB.',
        },
        {
          id: 'dim-b21-05',
          name: 'Request Routing & Keep-Alive Connection Lifecycle',
          weight: 0.25,
          maxPoints: 25,
          minimumPassingScore: 12.5,
          isMandatory: true,
          description: 'Validates request routing, deterministic response framing (normal Content-Length, HEAD with zero body, 204/304 with zero body), and clean connection termination. MANDATORY COMPETENCY FLOOR: Minimum 50% score (12.5 / 25 pts) required to pass.',
          criteria: 'HEAD returns headers without body; 204/304 have zero body; Connection: close respected.',
        },
      ],
      visibleTests: [
        {
          name: 'test_clean_get_request_origin_form',
          assertion: 'engine = RawHttpEngine("/tmp")\nresp = engine.handle_raw_request(b"GET /echo HTTP/1.1\\r\\nHost: localhost\\r\\n\\r\\n")\nassert b"HTTP/1.1 200 OK" in resp and b"Content-Length:" in resp',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_duplicate_host_header_rejected',
          assertion: 'engine = RawHttpEngine("/tmp")\nresp = engine.handle_raw_request(b"GET / HTTP/1.1\\r\\nHost: a.com\\r\\nHost: b.com\\r\\n\\r\\n")\nassert b"400 Bad Request" in resp and b"Connection: close" in resp',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_duplicate_content_length_rejected',
          assertion: 'engine = RawHttpEngine("/tmp")\nresp = engine.handle_raw_request(b"GET / HTTP/1.1\\r\\nHost: a.com\\r\\nContent-Length: 5\\r\\nContent-Length: 5\\r\\n\\r\\n12345")\nassert b"400 Bad Request" in resp and b"Connection: close" in resp',
          points: 10,
          tier: 'VISIBLE',
        },
        {
          name: 'test_unsupported_request_target_form_returns_501',
          assertion: 'engine = RawHttpEngine("/tmp")\nresp = engine.handle_raw_request(b"GET http://example.com/index HTTP/1.1\\r\\nHost: example.com\\r\\n\\r\\n")\nassert b"501 Not Implemented" in resp and b"Connection: close" in resp',
          points: 10,
          tier: 'VISIBLE',
        },
      ],
      adversarialTests: [
        {
          name: 'test_path_traversal_blocked',
          assertion: 'engine = RawHttpEngine("/tmp")\nresp = engine.handle_raw_request(b"GET /../../etc/passwd HTTP/1.1\\r\\nHost: localhost\\r\\n\\r\\n")\nassert b"403 Forbidden" in resp',
          points: 10,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_whitespace_before_colon_rejected',
          assertion: 'engine = RawHttpEngine("/tmp")\nresp = engine.handle_raw_request(b"GET / HTTP/1.1\\r\\nHost : localhost\\r\\n\\r\\n")\nassert b"400 Bad Request" in resp',
          points: 10,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_head_request_has_no_body',
          assertion: 'engine = RawHttpEngine("/tmp")\nresp = engine.handle_raw_request(b"HEAD / HTTP/1.1\\r\\nHost: localhost\\r\\n\\r\\n")\nheader_part, _, body = resp.partition(b"\\r\\n\\r\\n")\nassert body == b""',
          points: 10,
          tier: 'ADVERSARIAL',
        },
      ],
      integrityTests: [
        {
          name: 'test_forbidden_framework_and_async_ast_scan',
          assertion: 'import ast, inspect\nsrc = inspect.getsource(RawHttpEngine)\ntree = ast.parse(src)\nassert not any(isinstance(n, (ast.AsyncFunctionDef, ast.Await)) for n in ast.walk(tree))',
          points: 10,
          tier: 'INTEGRITY',
        },
      ],
    },
  ],
};

export const DAY_107_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w21-021',
  dayNumber: 5,
  title: 'Formative Assessment: Defined RFC 9112 Framing Subset HTTP/1.1 Server Engine',
  pedagogicalIntent: 'TRANSFER',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b21-d107-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Transfer Challenge: Defined RFC 9112 Framing Subset RawHttpEngine',
      estimatedMinutes: 80,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_HTTP_WIRE_PROTOCOL_AND_SOCKETS,
      unfamiliarDomainContext: 'High-Security Embedded IoT Gateway & Micro-Proxy Dispatchers',
      task: 'Build RawHttpEngine implementing a defined RFC 9112 framing subset: origin-form parsing, single Host enforcement, duplicate CL rejection, smuggling defense, path traversal containment, and deterministic response framing.',
    } as TransferChallengeBlock,
    {
      id: 'blk-b21-d107-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Knowledge Check: RFC 9112 Request Smuggling Defenses',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why must a defensive HTTP/1.1 server reject requests that include both Transfer-Encoding and Content-Length headers?',
      options: [
        'Because conflicting framing metadata allows attackers to exploit parsing discrepancies between reverse proxies and backend servers to smuggle unauthorized requests.',
        'Because Transfer-Encoding can only be used with HTTP/2.',
        'Because Content-Length is deprecated in modern web standards.',
        'Because the operating system TCP stack cannot calculate dual lengths.',
      ],
      correctIndex: 0,
      explanation: 'When both headers are present, different proxy and backend components can disagree on whether message framing is determined by Content-Length or chunked Transfer-Encoding. Rejecting such requests with 400 Bad Request and closing the connection neutralizes the request smuggling threat entirely.',
      misconceptionIdentified: 'Believing servers can safely pick one framing header when both are present.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b21-d107-03',
      type: 'REFERENCE',
      order: 3,
      title: 'Batch 021 Reference Sheet: HTTP/1.1 Framing & Security Invariants',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'RFC 9112: HTTP/1.1 Message Syntax and Routing',
          url: 'https://www.rfc-editor.org/rfc/rfc9112',
        },
        {
          title: 'RFC 9110: HTTP Semantics',
          url: 'https://www.rfc-editor.org/rfc/rfc9110',
        },
      ],
      documentationExtracts: [
        'RFC 9112 Section 3.2: A client MUST send a Host header field in all HTTP/1.1 request messages. A server MUST respond with 400 Bad Request to any HTTP/1.1 request lacking a Host header or containing duplicate Host fields.',
        'RFC 9112 Section 5.1: No whitespace is allowed between the header field name and colon.',
        'RFC 9112 Section 6.1: A sender MUST NOT send both Content-Length and Transfer-Encoding in the same message.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 021 MANIFEST ──
export const BATCH_021_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m6-w21-021',
  batchCode: 'P2-M6-W21-BATCH021',
  title: 'Wire-Level HTTP/1.1 Framing Subset, Sockets, Slowloris & Request-Smuggling Defenses',
  difficulty: 'ADVANCED',
  days: [
    DAY_103_MANIFEST,
    DAY_104_MANIFEST,
    DAY_105_MANIFEST,
    DAY_106_MANIFEST,
    DAY_107_MANIFEST,
  ],
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-07T00:00:00.000Z',
  updatedAt: '2026-09-07T00:00:00.000Z',
};
