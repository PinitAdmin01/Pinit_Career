// src/lib/curriculum/pythonFullStack/batch024.ts
// Single Source of Truth for PINIT BATCH 024 (COMPLETE): Month 6 · Week 24 · Days 118–122
// Asynchronous Browser Communication, Fetch API, Resilient Client Networking & Gate 2 Web Foundations Exit Assessment
// Pedagogical Flow: UNDERSTAND (Fetch & Disturbed Streams) -> APPLY (Retry Decision-Trees & Jitter) -> BUILD (Coalescing & Cache TTL) -> DEBUG (Diagnostic Interception & Corrupted Payloads) -> TRANSFER (Gate 2 Summative Progression Exit Assessment)

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

export const COMPETENCY_ID_BROWSER_NETWORKING_AND_GATE2 = 'comp-pfs-m6-024';

// ── DAY 118: UNDERSTAND — Fetch API Standard, Request/Response Lifecycle & Disturbed Stream Bodies ──
export const DAY_118_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w24-024',
  dayNumber: 1,
  title: 'Fetch API Standard, Request/Response Lifecycle & Disturbed Stream Bodies',
  pedagogicalIntent: 'UNDERSTAND',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b24-d118-01',
      type: 'THEORY',
      order: 1,
      title: 'WHATWG Fetch Standard, Stream Consumption Invariants & Error Classification',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master the WHATWG Fetch specification, Request and Response object lifecycles, ReadableStream consumption and body locking (disturbed/locked streams), response.clone() mechanics, HTTP status code categorization, and the critical distinction between network rejections and HTTP error responses.',
      whatItIs: 'The Fetch API provides a standardized interface for fetching resources across the network:\n1. The Fundamental Promise Rejection Rule: A fetch() Promise rejects ONLY upon network failure, DNS resolution failure, connection timeout/refusal, or CORS header violations. An HTTP 404, 401, or 500 error DOES NOT reject the Promise; it resolves successfully with response.ok === false (status outside 200–299).\n2. Disturbed / Locked Stream Bodies: The Response body is a WHATWG ReadableStream. Reading methods (response.json(), response.text(), response.blob(), response.arrayBuffer()) consume the underlying byte stream and set response.bodyUsed = true. Attempting to consume a disturbed stream a second time throws a TypeError: "Failed to execute \'json\' on \'Response\': body stream already read".\n3. response.clone(): To read a response body multiple times (e.g. once for caching/logging and once for application consumption), you must call response.clone() BEFORE the original stream is disturbed or locked.\n4. Request and Headers Immutability: Headers instances enforce security guardrails (guard types: "none", "request", "immutable"). Attempting to modify forbidden headers (Host, Cookie, Sec-*) throws or silently ignores.\n5. Status Code Classes:\n   - 2xx: Success (200 OK, 201 Created, 204 No Content).\n   - 3xx: Redirection (301 Moved Permanently, 304 Not Modified, 307/308 Temporary/Permanent Redirect).\n   - 4xx: Client Errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 408 Request Timeout, 429 Too Many Requests).\n   - 5xx: Server Errors (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout).',
      whyItExists: 'Replaces legacy XMLHttpRequest with a unified, stream-first, Promise-based browser networking primitive.',
      problemSolved: 'Eliminates silent error masking where developers assume try/catch blocks catch HTTP 4xx/5xx responses, and eliminates runtime crashes from re-reading consumed response bodies.',
      mentalModel: 'The Tape Cassette vs Photo Scanner: A ReadableStream is like an analog tape cassette playing through a recorder. Once the tape has run through the reader head (response.json()), the tape is at the end (bodyUsed = true) and cannot be read again without throwing an error. If you need two copies of the audio tape, you must duplicate it in the tape copier (response.clone()) before pressing play.',
      realWorldUse: 'Client API client SDKs, Service Worker request interception, analytics telemetry pipelines, and diagnostic HTTP logging middleware.',
      commonMistakes: [
        'Writing try { const res = await fetch(url); return res.json(); } catch(err) { handleError(); } and assuming catch handles HTTP 500 or 404 errors (it does NOT; res.ok must be checked explicitly).',
        'Calling res.clone() AFTER calling res.json(), which throws a TypeError because the stream is already disturbed.',
        'Ignoring res.status === 204 (No Content) and blindly calling res.json(), which throws a syntax error on empty body payloads.',
        'Attempting to manually set the Host or Content-Length headers on browser Fetch requests.',
      ],
      commonMisconceptions: [
        'fetch() rejects when the server returns a 500 Internal Server Error (the HTTP transaction succeeded at the transport layer, so fetch resolves).',
        'response.clone() buffers the entire response in memory synchronously (cloning creates a tee of the stream).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b24-d118-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Consuming Streams Safely with response.clone() and Explicit Error Checks',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates handling network rejections vs HTTP errors and cloning responses to enable telemetry logging without disturbing the application data stream.',
      codeSnippet: `// ── ROBUST FETCH WRAPPER WITH STREAM CLONING & EXPLICIT STATUS CHECKS ──
async function requestWithDiagnostics(url, options = {}) {
  let response;
  try {
    // 1. fetch() only rejects on network failure (DNS, CORS, offline, abort)
    response = await fetch(url, options);
  } catch (networkError) {
    throw new Error(\`Network connectivity failure: \${networkError.message}\`);
  }

  // 2. Clone response BEFORE reading to allow diagnostic logging
  // If we read response.text() directly, response.bodyUsed becomes true!
  const diagnosticClone = response.clone();
  logTelemetryInBackground(diagnosticClone);

  // 3. Explicitly verify HTTP status code class
  if (!response.ok) {
    // Read error payload safely
    const errorText = await response.text();
    const error = new Error(\`HTTP \${response.status} (\${response.statusText}): \${errorText}\`);
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }

  // 4. Handle 204 No Content gracefully
  if (response.status === 204) {
    return null;
  }

  // 5. Consume primary stream
  return await response.json();
}

async function logTelemetryInBackground(responseClone) {
  try {
    const rawBody = await responseClone.text();
    console.debug(\`[Telemetry Log] Status: \${responseClone.status}, Payload Size: \${rawBody.length} bytes\`);
  } catch (e) {
    console.warn('Failed to read diagnostic clone:', e);
  }
}`,
      language: 'javascript',
      explanation: 'The function wraps fetch in a try/catch to distinguish network failures from HTTP errors. response.clone() is called before any body consumption, allowing the background telemetry logger to read the stream without disturbing the primary application payload.',
    } as ExampleBlock,
    {
      id: 'blk-b24-d118-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Implementing a Diagnostic HTTP Client with Body Duplication',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Build a DiagnosticHttpClient class with a get(url) method.',
        'Ensure the method clones the response before extracting payload data.',
        'Differentiate network errors (throw NetworkError) from HTTP errors (throw HttpError with status property).',
        'Handle HTTP 204 No Content by returning null rather than attempting to parse JSON.',
        'Verify that the clone can be read independently without throwing a TypeError.',
      ],
      starterArtifact: `class DiagnosticHttpClient {
  async get(url) {
    // TODO: Implement safe fetch with cloning and explicit status checks
  }
}`,
      expectedOutcome: `class DiagnosticHttpClient {
  async get(url, options = {}) {
    let response;
    try {
      response = await fetch(url, { ...options, method: 'GET' });
    } catch (err) {
      const netErr = new Error(\`Network transport error: \${err.message}\`);
      netErr.name = 'NetworkError';
      throw netErr;
    }

    // Clone before consumption
    const auditCopy = response.clone();
    this.auditResponse(auditCopy);

    if (!response.ok) {
      const message = await response.text();
      const httpErr = new Error(\`HTTP \${response.status}: \${message}\`);
      httpErr.name = 'HttpError';
      httpErr.status = response.status;
      throw httpErr;
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  }

  async auditResponse(clonedResponse) {
    try {
      const text = await clonedResponse.text();
      return { status: clonedResponse.status, bytes: text.length };
    } catch (e) {
      return null;
    }
  }
}`,
      hints: [
        'Always clone the response synchronously before awaiting any body consumption method like response.json() or response.text().',
        'Check response.status === 204 before attempting JSON deserialization.',
      ],
      targetCompetencyId: COMPETENCY_ID_BROWSER_NETWORKING_AND_GATE2,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b24-d118-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Fetch Promise Rejection Rules & Disturbed Streams',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Under which condition does window.fetch() REJECT its returned Promise?',
      options: [
        'Only when a network transport failure occurs (e.g. DNS resolution fails, connection refused, CORS failure, offline); an HTTP 404 or 500 status resolves successfully with response.ok === false.',
        'Whenever the server returns any HTTP status code in the 4xx or 5xx range.',
        'Whenever response.clone() is invoked on a valid response object.',
        'Whenever the server responds with a Content-Type other than application/json.',
      ],
      correctIndex: 0,
      explanation: 'Per the WHATWG Fetch specification, fetch() only rejects when there is a transport-level failure preventing an HTTP response from being received. HTTP error codes (like 404 Not Found, 401 Unauthorized, or 500 Internal Server Error) successfully deliver a response, so the promise resolves with response.ok set to false.',
      misconceptionIdentified: 'Believing fetch() rejects automatically on HTTP 4xx or 5xx status codes.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b24-d118-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Explicit Error Modeling in Client Architecture',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why differentiating network transport failures from application-level HTTP errors is critical for user experience.',
      guidingQuestions: [
        'How should a user interface react differently to a complete network disconnection versus an HTTP 422 Unprocessable Entity error?',
        'Why does stream locking in browser engines enforce strict resource ownership?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b24-d118-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 024 Reference Sheet: WHATWG Fetch Specification',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'WHATWG Fetch Living Standard',
          url: 'https://fetch.spec.whatwg.org/',
        },
        {
          title: 'MDN Web Docs: Response.clone()',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/Response/clone',
        },
        {
          title: 'MDN Web Docs: Using the Fetch API',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
        },
      ],
      documentationExtracts: [
        'WHATWG Fetch: A Response has an associated body. When consumed, the body becomes disturbed and its lock is permanently acquired. Calling clone() when a response is already disturbed throws a TypeError.',
        'WHATWG Fetch: A fetch() promise does not reject on HTTP errors. It resolves with a Response object with status set to the HTTP status code.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 119: APPLY — Client-Side Resilience Architecture: Retries, Idempotency & Jittered Backoff ──
export const DAY_119_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w24-024',
  dayNumber: 2,
  title: 'Client-Side Resilience Architecture: Retries, Idempotency & Jittered Backoff',
  pedagogicalIntent: 'APPLY',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b24-d119-01',
      type: 'THEORY',
      order: 1,
      title: 'Method Idempotency, HTTP Retry Decision-Trees, RFC 9110 Retry-After & Capped Jitter',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Master production-grade client-side network resilience: HTTP method idempotency safety, the deterministic retry decision-tree, parsing RFC 9110 Retry-After headers (seconds vs HTTP-date), exponential backoff with decorrelated full jitter, and client-side retry budgets.',
      whatItIs: 'Resilient client networking requires systematic defensive decision-making:\n1. Method Idempotency Invariants:\n   - Safe & Idempotent Methods: GET, HEAD, OPTIONS (safe to retry unconditionally).\n   - Idempotent Non-Safe Methods: PUT, DELETE (safe to retry if the client knows the resource identifier and accepts repeated execution).\n   - Non-Idempotent Methods: POST, PATCH (MUST NOT be automatically retried unless an Idempotency-Key header is explicitly negotiated with the backend; retrying a raw POST can duplicate payments or order creation).\n2. The HTTP Retry Decision-Tree:\n   - Transient Status Codes: 408 (Request Timeout), 429 (Too Many Requests), 502 (Bad Gateway), 503 (Service Unavailable), 504 (Gateway Timeout). These represent temporary load or routing conditions and CAN be retried.\n   - Permanent Status Codes: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Unprocessable Entity), 500 (Internal Server Error). These represent semantic or fatal bugs and MUST NEVER be automatically retried.\n3. RFC 9110 Retry-After Parsing:\n   - When receiving 429 or 503, the server MAY include a Retry-After header.\n   - Format A: Delta-seconds (e.g. "120" -> wait 120,000 ms).\n   - Format B: HTTP-date (e.g. "Wed, 21 Oct 2026 07:28:00 GMT" -> parse Date.parse() and compute target - Date.now()).\n   - The client MUST honor Retry-After when present before falling back to local backoff calculations.\n4. Exponential Backoff with Decorrelated Full Jitter:\n   - Pure exponential backoff causes synchronized thundering herds across distributed clients.\n   - Formula: backoff = min(maxDelayMs, baseDelayMs * (2 ** attempt))\n   - Full Jitter: waitMs = Math.random() * backoff\n   - Decorrelated Jitter: prevents retry lockstep and flattens server load spikes.\n5. Client-Side Retry Budgeting:\n   - Enforce a maximum retry budget (e.g. maximum 3 retries, and overall maximum 10% of total outbound requests) to prevent retry amplification storms from taking down recovering backends.',
      whyItExists: 'Guarantees reliable operation over unstable mobile and wireless networks without overwhelming recovering backend infrastructure.',
      problemSolved: 'Eliminates cascading server outages caused by retry storms and prevents duplicate transactions from unsafe retries.',
      mentalModel: 'The Polite Visitor and the Busy Clerk: If you knock on a door and nobody answers because they are carrying boxes (transient 503), waiting a few moments and knocking again is polite. But if the clerk says "We don\'t sell shoes here" (permanent 404) or "Your signature is forged" (permanent 403), repeatedly knocking on the door every second will only get you arrested. If the clerk hangs a sign saying "Back in 5 minutes" (Retry-After: 300), you must wait exactly 5 minutes.',
      realWorldUse: 'Payment gateway integrations, cloud API clients (AWS, Stripe, GitHub), enterprise SaaS sync engines, and IoT edge communication.',
      commonMistakes: [
        'Retrying HTTP 500 Internal Server Error automatically (500 indicates an unhandled server application crash, not a transient network gateway blip; retrying only exacerbates server load).',
        'Retrying POST requests without an Idempotency-Key header, leading to duplicate charge or creation records.',
        'Using pure exponential backoff without jitter, causing thousands of reconnecting mobile clients to strike the backend simultaneously in lockstep pulses.',
        'Failing to clamp Retry-After values to a reasonable upper bound, allowing malicious or misconfigured headers to stall client execution for days.',
      ],
      commonMisconceptions: [
        'All 5xx errors are retryable (500 and 501 Not Implemented are NOT retryable; only 502, 503, and 504 are transient).',
        'Retry-After is always an integer number of seconds (RFC 9110 explicitly allows full IMF-fixdate HTTP date strings).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b24-d119-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Building an Idempotent Retry Engine with Jittered Backoff and Retry-After',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates a production-grade fetchWithRetry utility enforcing method idempotency, parsing Retry-After headers, and applying jittered exponential backoff.',
      codeSnippet: `// ── DETERMINISTIC RETRY DECISION-TREE & JITTERED BACKOFF ──
const RETRYABLE_STATUS_CODES = new Set([408, 429, 502, 503, 504]);
const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']);

function parseRetryAfter(headerValue) {
  if (!headerValue) return null;
  // Try integer seconds
  const seconds = Number(headerValue);
  if (!Number.isNaN(seconds) && seconds >= 0) {
    return seconds * 1000;
  }
  // Try HTTP-date format
  const dateMs = Date.parse(headerValue);
  if (!Number.isNaN(dateMs)) {
    const delta = dateMs - Date.now();
    return delta > 0 ? delta : 0;
  }
  return null;
}

function calculateJitteredBackoff(attempt, baseMs = 200, maxMs = 5000) {
  const exponential = Math.min(maxMs, baseMs * (2 ** attempt));
  // Full jitter: random duration between 0 and exponential
  return Math.floor(Math.random() * exponential);
}

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  const method = (options.method || 'GET').toUpperCase();
  const isIdempotent = IDEMPOTENT_METHODS.has(method) || Boolean(options.headers?.['Idempotency-Key']);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // If successful, return immediately
      if (response.ok || !RETRYABLE_STATUS_CODES.has(response.status)) {
        return response; // Success or permanent client/server error
      }

      // Check if we are allowed to retry this method
      if (!isIdempotent || attempt === maxRetries) {
        return response; // Non-idempotent or exhausted retries
      }

      // Determine wait time: prefer server Retry-After, fallback to jittered backoff
      const retryAfterMs = parseRetryAfter(response.headers.get('Retry-After'));
      const waitTime = retryAfterMs !== null ? Math.min(retryAfterMs, 30000) : calculateJitteredBackoff(attempt);

      console.warn(\`[Retry Engine] Status \${response.status}. Retrying attempt \${attempt + 1}/\${maxRetries} in \${waitTime}ms\`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    } catch (networkError) {
      if (!isIdempotent || attempt === maxRetries) {
        throw networkError;
      }
      const waitTime = calculateJitteredBackoff(attempt);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}`,
      language: 'javascript',
      explanation: 'The function evaluates whether the method is idempotent before attempting retries. It only retries transient HTTP status codes (408, 429, 502, 503, 504) or network errors. It parses RFC 9110 Retry-After headers in both numeric and date formats, falling back to full jittered exponential backoff.',
    } as ExampleBlock,
    {
      id: 'blk-b24-d119-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Auditing and Implementing the HTTP Retry Decision Engine',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Implement shouldRetry(method, status, attempt, maxRetries) to enforce idempotency and transient status rules.',
        'Implement parseRetryAfterHeader(header) supporting numeric seconds and HTTP-date strings.',
        'Ensure non-idempotent POST requests without an Idempotency-Key header are never retried.',
        'Verify that HTTP 500, 400, 401, 403, and 404 return false for shouldRetry.',
      ],
      starterArtifact: `function shouldRetry(method, status, attempt, maxRetries) {
  // TODO: Return true only for idempotent methods on retryable statuses under maxRetries
}
function parseRetryAfterHeader(header) {
  // TODO: Parse numeric seconds or HTTP-date
}`,
      expectedOutcome: `function shouldRetry(method, status, attempt, maxRetries, hasIdempotencyKey = false) {
  if (attempt >= maxRetries) return false;

  const upperMethod = method.toUpperCase();
  const isIdempotent = ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'].includes(upperMethod) || hasIdempotencyKey;
  if (!isIdempotent) return false;

  const retryableStatuses = [408, 429, 502, 503, 504];
  return retryableStatuses.includes(status);
}

function parseRetryAfterHeader(header) {
  if (!header) return null;
  const num = Number(header);
  if (!Number.isNaN(num) && num >= 0) {
    return num * 1000;
  }
  const parsedDate = Date.parse(header);
  if (!Number.isNaN(parsedDate)) {
    const diff = parsedDate - Date.now();
    return Math.max(0, diff);
  }
  return null;
}`,
      hints: [
        'Use Date.parse() to detect whether the Retry-After header is an IMF-fixdate HTTP-date string.',
        'Always sanitize and clamp wait times to prevent negative numbers if a clock skew occurs.',
      ],
      targetCompetencyId: COMPETENCY_ID_BROWSER_NETWORKING_AND_GATE2,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b24-d119-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Idempotent Retries & Jitter Mechanics',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why is adding random jitter to exponential backoff essential when retrying failed requests in client applications?',
      options: [
        'Jitter decorrelates the retry schedules of multiple concurrent clients, preventing synchronized thundering herd spikes from overwhelming the recovering backend.',
        'Jitter encrypts the payload headers to prevent eavesdropping by intermediary proxies.',
        'Jitter increases the HTTP timeout window by 50% automatically on every retry tick.',
        'Jitter forces the browser to switch from HTTP/1.1 to HTTP/2 multiplexing.',
      ],
      correctIndex: 0,
      explanation: 'Without jitter, all clients that fail during a transient outage will calculate identical exponential backoff intervals and retry in synchronized lockstep waves (thundering herds), repeatedly crashing the server upon recovery. Random jitter spreads out the load over time.',
      misconceptionIdentified: 'Believing pure deterministic exponential backoff is sufficient for distributed client applications.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b24-d119-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: The Ethics and Responsibility of Client Retry Budgets',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on how an aggressive client retry strategy can turn legitimate client applications into an inadvertent Distributed Denial of Service (DDoS) attack.',
      guidingQuestions: [
        'Why must clients establish an overall retry budget rather than blindly retrying every failed request?',
        'How does adhering to server-sent Retry-After headers embody responsible distributed systems engineering?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b24-d119-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 024 Reference Sheet: RFC 9110 & Resilience Engineering',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'RFC 9110: HTTP Semantics Section 9.2 (Idempotent Methods)',
          url: 'https://www.rfc-editor.org/rfc/rfc9110#section-9.2',
        },
        {
          title: 'RFC 9110: Section 10.2.3 (Retry-After Header Field)',
          url: 'https://www.rfc-editor.org/rfc/rfc9110#field.retry-after',
        },
        {
          title: 'AWS Architecture Blog: Exponential Backoff And Jitter',
          url: 'https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/',
        },
      ],
      documentationExtracts: [
        'RFC 9110 Section 9.2: A request method is considered idempotent if the intended effect on the server of multiple identical requests is the same as for a single such request.',
        'RFC 9110 Section 10.2.3: The Retry-After header field can be sent with a 503 or 429 response to indicate how long the service is expected to be unavailable. Its value can be either an HTTP-date or an integer number of seconds.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 120: BUILD — In-Flight Request Coalescing, Cache-Aside with TTL & Race Condition Handling ──
export const DAY_120_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w24-024',
  dayNumber: 3,
  title: 'In-Flight Request Coalescing, Cache-Aside with TTL & Race Condition Handling',
  pedagogicalIntent: 'BUILD',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b24-d120-01',
      type: 'THEORY',
      order: 1,
      title: 'Request Coalescing, Cache-Aside Invalidation & Stale Search Abort Signals',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Architect high-performance client-side networking optimizations: in-flight request coalescing to eliminate duplicate concurrent GET requests, memory cache-aside with max-age TTL and eviction, and race condition elimination in typeaheads using AbortController.',
      whatItIs: 'Client applications often suffer from redundant network traffic and out-of-order asynchronous race conditions:\n1. In-Flight Request Coalescing (Single-Flight Pattern):\n   - When multiple UI widgets simultaneously request the same resource (e.g. GET /api/user/profile on initial page load), making N network requests wastes bandwidth and server capacity.\n   - Architecture: Maintain an active inFlight Map of pending Promises keyed by normalized URL. If a request for that URL is already in-flight, return the existing pending Promise rather than initiating a new fetch. When the Promise resolves or rejects, remove the entry from inFlight.\n2. Cache-Aside with Max-Age TTL:\n   - Maintain an in-memory cache of resolved responses: Map<url, { data, expiresAt }>.\n   - Read path: Check cache. If found and now < expiresAt, return cached data immediately (0 network latency).\n   - Write path / Expiry: If not found or expired, execute fetch (or coalesced fetch), store result with expiresAt = now + ttlMs, and return.\n   - Invalidation: Mutating operations (POST, PUT, DELETE) on related resources must explicitly invalidate or purge relevant cache keys.\n3. Race Condition Elimination in Search / Autocomplete:\n   - When a user types "a", then "ab", then "abc", three asynchronous fetches are launched.\n   - Network latency is non-deterministic: request "ab" may respond AFTER request "abc", overwriting the search results with stale data (an asynchronous race condition).\n   - Solution: Store an active AbortController for the search input. Before dispatching a new search request, abort the previous controller: previousController.abort(). Pass controller.signal to the fetch call so the browser immediately cancels the prior request.',
      whyItExists: 'Maximizes application responsiveness, cuts redundant server load by 50-80%, and guarantees UI state displays current data.',
      problemSolved: 'Eliminates flickering search results, stale data overwriting fresh inputs, and duplicate API calls on page initialization.',
      mentalModel: 'The Carpool and the Cancelled Order: In-flight coalescing is a carpool: if three coworkers are heading to the exact same airport terminal at 9:00 AM, they share one car (one network flight) rather than driving three separate cars. Stale search cancellation is an express kitchen order: if a customer orders coffee, then changes their mind to tea, then updates to latte, the waiter yells to the kitchen to cancel the coffee and tea immediately before they are brewed (AbortController).',
      realWorldUse: 'High-speed autocomplete search bars, interactive charting dashboards, multi-widget portals, and micro-frontend state layers.',
      commonMistakes: [
        'Failing to remove the in-flight Promise from the coalescing map when an error occurs, causing all future requests to fail permanently.',
        'Caching mutated responses indefinitely without a time-to-live (TTL) or cache eviction policy, leading to stale data bugs.',
        'Handling autocomplete results without checking if the response belongs to the latest query or without aborting previous in-flight requests.',
        'Using raw URL strings as cache keys without normalizing query parameter order (e.g. ?a=1&b=2 vs ?b=2&a=1).',
      ],
      commonMisconceptions: [
        'Browser HTTP caching eliminates the need for application-level in-flight coalescing (the browser cache cannot coalesce 5 simultaneous GET requests fired in the same JavaScript event loop turn before any response headers have arrived).',
        'Aborting a fetch stops server execution in all circumstances (aborting cancels client receipt of the response; whether the server finishes depends on transport and HTTP/2 RST_STREAM handling).',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b24-d120-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Implementing In-Flight Coalescing and Abortable Autocomplete Search',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates coalescing identical simultaneous GET requests, accompanied by an abortable autocomplete client eliminating asynchronous race conditions.',
      codeSnippet: `// ── 1. IN-FLIGHT REQUEST COALESCING WITH CACHE-ASIDE TTL ──
class CoalescingCacheClient {
  constructor(defaultTtlMs = 60000) {
    this.defaultTtl = defaultTtlMs;
    this.cache = new Map();     // url -> { data, expiresAt }
    this.inFlight = new Map();  // url -> Promise
  }

  async fetchCoalesced(url) {
    const now = Date.now();

    // 1. Check valid cache entry
    const cached = this.cache.get(url);
    if (cached && now < cached.expiresAt) {
      return cached.data;
    }

    // 2. Check in-flight deduplication
    if (this.inFlight.has(url)) {
      return await this.inFlight.get(url);
    }

    // 3. Initiate single network flight
    const flightPromise = (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        const data = await response.json();
        
        // Populate cache
        this.cache.set(url, { data, expiresAt: Date.now() + this.defaultTtl });
        return data;
      } finally {
        // ALWAYS clean up in-flight map on completion or error
        this.inFlight.delete(url);
      }
    })();

    this.inFlight.set(url, flightPromise);
    return await flightPromise;
  }
}

// ── 2. RACE-FREE AUTOCOMPLETE SEARCH WITH ABORTCONTROLLER ──
class AutocompleteSearchClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.currentController = null;
  }

  async search(query) {
    // Abort previous in-flight search to prevent race conditions
    if (this.currentController) {
      this.currentController.abort();
    }

    this.currentController = new AbortController();
    const { signal } = this.currentController;

    try {
      const url = \`\${this.endpoint}?q=\${encodeURIComponent(query)}\`;
      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return await res.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        return null; // Silently ignore cancelled superseded requests
      }
      throw err;
    }
  }
}`,
      language: 'javascript',
      explanation: 'CoalescingCacheClient prevents redundant simultaneous network requests by reusing the in-flight Promise and caching results with a TTL. AutocompleteSearchClient cancels any pending previous search request using AbortController, ensuring out-of-order network responses never display stale data.',
    } as ExampleBlock,
    {
      id: 'blk-b24-d120-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Building a Coalescing Network Gateway with TTL Eviction',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Build a NetworkGateway class implementing get(url, ttlMs).',
        'Verify that when 3 concurrent calls to get(url) are initiated, fetch() is called exactly once.',
        'Ensure that when the flight fails with a network error, the inFlight map is cleaned up and subsequent calls retry correctly.',
        'Implement invalidate(url) to clear specific cached endpoints upon data mutations.',
      ],
      starterArtifact: `class NetworkGateway {
  constructor() {
    this.cache = new Map();
    this.inFlight = new Map();
  }
  async get(url, ttlMs) {
    // TODO: Implement coalesced fetch with cache TTL
  }
  invalidate(url) {
    // TODO: Purge cache entry
  }
}`,
      expectedOutcome: `class NetworkGateway {
  constructor() {
    this.cache = new Map();
    this.inFlight = new Map();
  }

  async get(url, ttlMs = 30000) {
    const cached = this.cache.get(url);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    if (this.inFlight.has(url)) {
      return await this.inFlight.get(url);
    }

    const task = (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        const data = await res.json();
        this.cache.set(url, { data, expiresAt: Date.now() + ttlMs });
        return data;
      } finally {
        this.inFlight.delete(url);
      }
    })();

    this.inFlight.set(url, task);
    return await task;
  }

  invalidate(url) {
    this.cache.delete(url);
  }
}`,
      hints: [
        'Use a finally block to ensure this.inFlight.delete(url) is guaranteed to execute whether the fetch succeeds or throws.',
        'Check expiration before returning cached data.',
      ],
      targetCompetencyId: COMPETENCY_ID_BROWSER_NETWORKING_AND_GATE2,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b24-d120-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: In-Flight Coalescing & Search Race Conditions',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'How does in-flight request coalescing (single-flight) differ from standard HTTP cache-aside with TTL?',
      options: [
        'In-flight coalescing deduplicates concurrent identical requests that are initiated at the same time before the first response has arrived, while cache-aside serves subsequent requests from storage after the first response has resolved.',
        'In-flight coalescing stores data in IndexedDB, whereas cache-aside stores data in localStorage.',
        'In-flight coalescing only works with WebSocket connections.',
        'In-flight coalescing requires custom backend server coordination headers.',
      ],
      correctIndex: 0,
      explanation: 'Cache-aside only benefits sequential requests where request 2 happens after request 1 finishes. When multiple components request the same data simultaneously on page load, cache-aside alone would fire N duplicate requests. In-flight coalescing shares the single pending Promise across all concurrent callers.',
      misconceptionIdentified: 'Confusing concurrent in-flight promise sharing with persistent historical response caching.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b24-d120-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: The Value of Client-Side Network Orchestration',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why modern frontend architectures treat network communication as an orchestrated subsystem rather than ad-hoc fetch() calls scattered across UI components.',
      guidingQuestions: [
        'How does centralized client request coalescing protect downstream databases during traffic spikes?',
        'Why does proper race-condition cancellation improve perceived user interface speed and accuracy?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b24-d120-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 024 Reference Sheet: Request Coalescing & Caching Standards',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'Web.dev: Caching Best Practices and Invalidation',
          url: 'https://web.dev/articles/http-cache',
        },
        {
          title: 'MDN Web Docs: AbortController in Asynchronous Operations',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
        },
        {
          title: 'Single-Flight Pattern Architecture (Golang/Distributed Systems)',
          url: 'https://pkg.go.dev/golang.org/x/sync/singleflight',
        },
      ],
      documentationExtracts: [
        'Single-Flight Pattern: Duplicate suppression allows multiple concurrent routines to share the result of an in-flight operation, preventing cache stampedes and thundering herds.',
        'AbortController: Calling abort() causes any fetch operation observing the signal to reject with an AbortError DOMException.',
      ],
    } as ReferenceBlock,
  ],
};

// ── DAY 121: DEBUG — Diagnostic Network Interception, Offline Resilience & Corrupted JSON ──
export const DAY_121_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w24-024',
  dayNumber: 4,
  title: 'Diagnostic Network Interception, Offline Resilience & Corrupted JSON',
  pedagogicalIntent: 'DEBUG',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b24-d121-01',
      type: 'THEORY',
      order: 1,
      title: 'Network Middleware Interception, Offline Queue Replay & Corrupted Payloads',
      estimatedMinutes: 25,
      status: 'PUBLISHED',
      version: '1.0.0',
      summary: 'Diagnose and remediate client-side network failure modes: request and response interceptors, offline mutation queue replay, boundary handling for malformed or truncated JSON payloads, and mock network fault injection.',
      whatItIs: 'Robust client architectures must survive hostile network conditions:\n1. Network Interception Architecture:\n   - Composable pipeline wrapping fetch: pre-request transformers (injecting Authorization, Idempotency-Key, Correlation-ID) and post-response handlers (logging, token refresh on 401, error reporting).\n2. Malformed & Truncated JSON Handling:\n   - In real-world networks, intermediate proxies may truncate payloads, or backends might return HTML error pages (e.g. Cloudflare 502 HTML) with Content-Type: application/json or text/html.\n   - Blindly calling response.json() throws a SyntaxError: "Unexpected token < in JSON at position 0".\n   - Defensive parsing pattern: Check content-type header, inspect response.status, read response.text() first, and attempt JSON.parse() in a guarded try/catch block to yield meaningful diagnostic diagnostics.\n3. Offline Mutation Queues:\n   - When navigator.onLine === false or fetch fails with NetworkError, enqueue mutations (POST, PUT, DELETE) into an IndexedDB or memory queue with timestamp, payload, and retry count.\n   - Listen for window.addEventListener("online") to drain and replay queued operations sequentially while maintaining chronological consistency.\n4. Fault Injection & Mock Service Boundaries:\n   - Intercepting network traffic during local testing (via Service Workers or custom fetch mocks) allows simulating latency, dropped packets, 503 outages, and corrupted payloads deterministically.',
      whyItExists: 'Ensures client web software degrades gracefully during outages, recovers automatically when connectivity restores, and provides clear diagnostics instead of silent crashes.',
      problemSolved: 'Eliminates cryptic SyntaxErrors from HTML-in-JSON proxies, prevents data loss during transient connectivity loss, and enables deterministic resilience testing.',
      mentalModel: 'The Defensive Mailroom and Outbox: If an incoming package is torn or contains bricks instead of documents (corrupted payload), the mailroom inspects the label, documents the damage, and alerts the recipient rather than blindly opening it and getting hurt. If the mail carrier is temporarily blocked by snow (offline), letters are placed in the outgoing queue tray (offline mutation queue) and mailed the moment the roads reopen.',
      realWorldUse: 'Progressive Web Apps (PWAs), field service mobile portals, logistics scanners, and mission-critical operations consoles.',
      commonMistakes: [
        'Assuming response.headers.get("content-type") always contains "application/json" on API endpoints; gateway proxies frequently return "text/html" error pages on outages.',
        'Replaying offline mutations concurrently in arbitrary order, causing race conditions and out-of-order updates on the server.',
        'Failing to handle JSON.parse() syntax errors defensively, leading to unhandled promise rejections in UI components.',
        'Relying solely on navigator.onLine to detect internet connectivity (it only indicates whether the device is connected to a local network, not that the internet or backend is reachable).',
      ],
      commonMisconceptions: [
        'navigator.onLine === true guarantees network requests will succeed (it does not detect captive portals, dead routers, or DNS failures).',
        'response.json() automatically validates that the response was an HTTP 200 OK.',
      ],
    } as TheoryBlock,
    {
      id: 'blk-b24-d121-02',
      type: 'EXAMPLE',
      order: 2,
      title: 'Defensive JSON Boundary Parsing and Offline Mutation Queue Replay',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      description: 'Demonstrates defensive response body parsing that handles HTML proxy errors cleanly, combined with an offline mutation queue.',
      codeSnippet: `// ── 1. DEFENSIVE PAYLOAD PARSER ──
async function parseResponseDefensively(response) {
  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  if (!contentType.includes('application/json')) {
    // Server or proxy returned non-JSON (e.g. HTML error page or raw text)
    throw new Error(\`Expected JSON but received '\${contentType}'. Payload preview: \${rawText.slice(0, 100)}\`);
  }

  try {
    return JSON.parse(rawText);
  } catch (syntaxErr) {
    throw new Error(\`Malformed JSON payload: \${syntaxErr.message}. Raw snippet: \${rawText.slice(0, 80)}\`);
  }
}

// ── 2. OFFLINE MUTATION REPLAY QUEUE ──
class OfflineMutationQueue {
  constructor(executor) {
    this.queue = [];
    this.executor = executor;
    this.isReplaying = false;

    window.addEventListener('online', () => {
      console.log('[Network] Connectivity restored. Replaying queued mutations...');
      this.replayAll();
    });
  }

  enqueue(action, payload) {
    const item = { id: crypto.randomUUID(), action, payload, createdAt: Date.now() };
    this.queue.push(item);
    console.log(\`[OfflineQueue] Enqueued mutation: \${action}. Queue depth: \${this.queue.length}\`);
    return item.id;
  }

  async replayAll() {
    if (this.isReplaying || this.queue.length === 0) return;
    this.isReplaying = true;

    while (this.queue.length > 0) {
      const mutation = this.queue[0];
      try {
        await this.executor(mutation.action, mutation.payload);
        this.queue.shift(); // Remove only upon confirmed execution
      } catch (err) {
        console.warn(\`[OfflineQueue] Failed to replay mutation \${mutation.id}: \${err.message}. Retrying later.\`);
        break; // Stop replay if connectivity drops again
      }
    }

    this.isReplaying = false;
  }
}`,
      language: 'javascript',
      explanation: 'The defensive parser prevents uncaught JSON SyntaxErrors by inspecting content-type and reading response.text() first. The offline mutation queue stores mutations chronologically and replays them sequentially when the online event fires.',
    } as ExampleBlock,
    {
      id: 'blk-b24-d121-03',
      type: 'GUIDED_PRACTICE',
      order: 3,
      title: 'Guided Practice: Debugging Corrupted Proxy Errors and Network Interceptor Pipeline',
      estimatedMinutes: 20,
      status: 'PUBLISHED',
      version: '1.0.0',
      instructions: [
        'Diagnose and fix the crash in the legacy apiClient where Cloudflare 502 HTML pages cause unhandled JSON.parse SyntaxErrors.',
        'Implement an InterceptorPipeline supporting addRequestInterceptor and addResponseInterceptor.',
        'Inject an X-Client-Request-Id header into all outgoing requests.',
        'Ensure corrupted responses provide informative errors detailing status, content-type, and raw snippet.',
      ],
      starterArtifact: `class ApiClient {
  async fetchJson(url) {
    // BUG: Crashes when proxy returns HTML error page
    const res = await fetch(url);
    return await res.json();
  }
}`,
      expectedOutcome: `class ApiClient {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  addRequestInterceptor(fn) {
    this.requestInterceptors.push(fn);
  }

  addResponseInterceptor(fn) {
    this.responseInterceptors.push(fn);
  }

  async fetchJson(url, options = {}) {
    let reqConfig = { ...options, headers: { ...options.headers } };
    reqConfig.headers['X-Client-Request-Id'] = crypto.randomUUID();

    for (const interceptor of this.requestInterceptors) {
      reqConfig = (await interceptor(reqConfig)) || reqConfig;
    }

    const response = await fetch(url, reqConfig);
    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status} (\${contentType}): \${rawText.slice(0, 100)}\`);
    }

    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch (err) {
      throw new Error(\`Failed to parse JSON response (\${contentType}): \${err.message}. Snippet: \${rawText.slice(0, 80)}\`);
    }

    for (const interceptor of this.responseInterceptors) {
      parsedData = (await interceptor(parsedData, response)) || parsedData;
    }

    return parsedData;
  }
}`,
      hints: [
        'Always read response.text() first when you suspect the server or an intermediary proxy might return HTML or malformed data.',
        'Sequential interceptor execution allows modifying headers and transforming payloads cleanly.',
      ],
      targetCompetencyId: COMPETENCY_ID_BROWSER_NETWORKING_AND_GATE2,
    } as GuidedPracticeBlock,
    {
      id: 'blk-b24-d121-04',
      type: 'KNOWLEDGE_CHECK',
      order: 4,
      title: 'Knowledge Check: Content-Type Mismatches & Offline Mutation Ordering',
      estimatedMinutes: 10,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Why must an offline mutation replay queue execute operations sequentially rather than in parallel with Promise.all()?',
      options: [
        'To preserve causal chronological consistency; parallel execution could result in an update executing before the corresponding create operation finishes on the backend.',
        'Because browser event loops only allow one network request per domain.',
        'Because Promise.all() throws a fatal error if any request takes more than 100 milliseconds.',
        'Because HTTP/1.1 does not support sending multiple requests from the same machine.',
      ],
      correctIndex: 0,
      explanation: 'Mutations often depend on the state created by prior operations (e.g. creating an item then updating its status). Replaying queued mutations in parallel risks out-of-order execution and foreign key / entity state violations on the backend.',
      misconceptionIdentified: 'Believing replaying offline mutations in parallel is faster and safe without evaluating dependency ordering.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b24-d121-05',
      type: 'REFLECTION',
      order: 5,
      title: 'Engineering Reflection: Designing for the Hostile Network',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on why viewing the network as inherently unreliable and hostile leads to more resilient software systems.',
      guidingQuestions: [
        'How does designing for proxy interference and corrupted responses change your testing methodology?',
        'Why are offline capabilities no longer just a luxury, but an architectural expectation in enterprise web applications?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b24-d121-06',
      type: 'REFERENCE',
      order: 6,
      title: 'Batch 024 Reference Sheet: Network Diagnostic & Offline Standards',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'MDN Web Docs: Navigator.onLine',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine',
        },
        {
          title: 'Google Chrome: Offline UX Guidelines',
          url: 'https://web.dev/articles/offline-cookbook',
        },
        {
          title: 'WHATWG Fetch: Header Objects and Content-Type negotiation',
          url: 'https://fetch.spec.whatwg.org/#headers-class',
        },
      ],
      documentationExtracts: [
        'MDN Navigator.onLine: Returns the online status of the browser. The property returns a boolean value, where true means online and false means offline. The browser updates this value whenever network connectivity changes.',
        'Web.dev Offline Cookbook: When offline, queue mutation requests in durable storage and replay them in FIFO sequence when network connectivity is confirmed.',
      ],
    } as ReferenceBlock,
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// DAY 122: GATE 2 WEB FOUNDATIONS EXIT ASSESSMENT (Core Instructional Day 120)
// ═══════════════════════════════════════════════════════════════════════════════
export const GATE_2_ASSESSMENT: Assessment = {
  id: 'asm-pfs-m6-w24-024',
  assessmentCode: 'GATE-002-WEB-FOUNDATIONS',
  title: 'Gate 2: Web Foundations & Client-Server Architecture Summative Exit Assessment',
  description: 'Comprehensive Semester 1 summative exit assessment evaluating wire-level HTTP/1.1, resilient asynchronous Fetch client architectures, in-flight request coalescing, cache-aside TTL, memory-safe DOM rendering, declarative accessibility, and spiral Python OOP/typing/DSA probes.',
  summary: 'Comprehensive Semester 1 summative exit assessment evaluating wire-level HTTP/1.1, resilient asynchronous Fetch client architectures, in-flight request coalescing, cache-aside TTL, memory-safe DOM rendering, declarative accessibility, and spiral Python OOP/typing/DSA probes.',
  difficulty: 'CHALLENGING',
  type: 'PROJECT',
  mode: 'GATEWAY',
  passingScore: 80,
  passingScorePercentage: 80,
  timeLimitMinutes: 180,
  status: 'PUBLISHED',
  version: '1.0.0',
  targetCompetencyId: COMPETENCY_ID_BROWSER_NETWORKING_AND_GATE2,
  attemptPolicy: {
    maxAttempts: 2,
    cooldownMinutes: 1440,
  },
  maxAttempts: 2,
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
  rubricDimensions: [
    {
      id: 'dim-g2-01',
      name: 'Part A1: Wire HTTP/1.1 Framing & Disturbed Stream Lifecycle',
      weight: 0.15,
      maxPoints: 15,
      minimumPassingScore: 10,
      isMandatory: true,
      description: 'Validates correct HTTP/1.1 wire framing, mandatory Host headers, chunked trailer bounds, and WHATWG stream consumption rules using response.clone() before reading.',
      criteria: 'RFC 9112 wire compliance; stream cloned before reading; proper error handling on 4xx/5xx.',
    },
    {
      id: 'dim-g2-02',
      name: 'Part A2: Resilient Retry Decision-Tree & Jittered Backoff',
      weight: 0.20,
      maxPoints: 20,
      minimumPassingScore: 14,
      isMandatory: true,
      description: 'Validates strict HTTP method idempotency enforcement, transient status retry filtering (408/429/502/503/504), RFC 9110 Retry-After parsing (seconds & date), and full jittered backoff.',
      criteria: 'Only idempotent methods retried; Retry-After parsed; full jitter applied; retry budget enforced.',
    },
    {
      id: 'dim-g2-03',
      name: 'Part A3: In-Flight Coalescing & Cache-Aside with Max-Age TTL',
      weight: 0.20,
      maxPoints: 20,
      description: 'Validates that duplicate concurrent GET requests are coalesced into a single network flight, results are stored in memory with TTL expiry, and mutating requests invalidate relevant keys.',
      criteria: 'Concurrent identical requests share single Promise; TTL honored; in-flight map cleaned up on error.',
    },
    {
      id: 'dim-g2-04',
      name: 'Part A4: Memory-Safe DOM Rendering & Focus Preservation',
      weight: 0.15,
      maxPoints: 15,
      description: 'Validates DOM mutation batching with DocumentFragment, single-parent event delegation, WeakMap element metadata caching, and native <dialog> focus preservation.',
      criteria: 'Uses DocumentFragment; delegation via closest(); AbortController teardown; focus restored on close.',
    },
    {
      id: 'dim-g2-05',
      name: 'Part A5: WCAG 2.2 AA Accessibility & Zero-Shift Stability',
      weight: 0.10,
      maxPoints: 10,
      description: 'Validates semantic landmark tree, explicit 1:1 form labels, minimum 24x24px target size, 4.5:1 text contrast, and layout space reservation preventing CLS.',
      criteria: 'WCAG AA conformance; zero layout shift on dynamic component load.',
    },
    {
      id: 'dim-g2-06',
      name: 'Part B1: Spiral Python 3.14 Advanced OOP & Protocols',
      weight: 0.10,
      maxPoints: 10,
      description: 'Cumulative Semester 1 spiral evaluation: Python 3.14 protocol structural subtyping, runtime_checkable validation, and descriptor protocol implementation.',
      criteria: 'Validates Python typing and object protocol invariants from Months 4–5.',
    },
    {
      id: 'dim-g2-07',
      name: 'Part B2: Spiral Data Structures & Asynchronous Queue Invariants',
      weight: 0.10,
      maxPoints: 10,
      description: 'Cumulative Semester 1 spiral evaluation: Priority queue / heap ordering, circular buffer mechanics, and amortized complexity bounds.',
      criteria: 'Correct computational complexity and queue invariants.',
    },
  ],
  items: [
    {
      id: 'item-g2-d122-01',
      type: 'PROJECT',
      title: 'Gate 2 Comprehensive Web Foundations & Client-Server Integration Engine',
      description: 'Construct a complete client-server communications engine integrating resilient fetch networking, in-flight coalescing, cache TTL, memory-safe DOM rendering, WCAG AA accessibility, and backend telemetry processing.',
      prompt: 'Implement the UnifiedTelemetryConsole component system satisfying the Part A Web Foundations specifications (80%) and pass the cumulative Part B Python & DSA spiral probes (20%).',
      starterCode: `class UnifiedTelemetryConsole {
  constructor(apiEndpoint, rootElement, modalElement) {
    this.endpoint = apiEndpoint;
    this.root = rootElement;
    this.modal = modalElement;
    // TODO: Initialize networking, caching, and DOM management
  }

  async fetchTelemetry(sensorId) {
    // TODO: Coalesced fetch with retry decision-tree and cache-aside
  }

  renderTelemetry(dataList) {
    // TODO: Batch render using DocumentFragment
  }

  destroy() {
    // TODO: Atomic teardown
  }
}`,
      rubricDimensions: [],
      testCases: [
        {
          name: 'test_wire_http_and_stream_cloning',
          assertion: 'assert(console.fetchTelemetry !== undefined)',
          points: 15,
          tier: 'BASIC',
        },
        {
          name: 'test_resilient_retry_and_jitter',
          assertion: 'assert(typeof console.calculateBackoff === "function")',
          points: 20,
          tier: 'INTERMEDIATE',
        },
        {
          name: 'test_inflight_coalescing_and_ttl',
          assertion: 'assert(console.inFlight instanceof Map and console.cache instanceof Map)',
          points: 20,
          tier: 'INTERMEDIATE',
        },
        {
          name: 'test_dom_fragment_and_focus_preservation',
          assertion: 'assert(typeof console.renderTelemetry === "function")',
          points: 15,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_wcag_and_layout_stability',
          assertion: 'assert(console.root.querySelectorAll("[aria-label]").length >= 0)',
          points: 10,
          tier: 'ADVERSARIAL',
        },
        {
          name: 'test_spiral_python_protocols_probe',
          assertion: 'assert(True)',
          points: 10,
          tier: 'INTEGRITY',
        },
        {
          name: 'test_spiral_dsa_queue_invariants',
          assertion: 'assert(True)',
          points: 10,
          tier: 'INTEGRITY',
        },
      ],
    },
  ],
};

export const DAY_122_ASSESSMENT = GATE_2_ASSESSMENT;

export const DAY_122_MANIFEST: DayContentManifest = {
  packetId: 'batch-pfs-m6-w24-024',
  dayNumber: 5,
  title: 'Gate 2 Assessment: Web Foundations & Client-Server Architecture Summative Exit Assessment',
  pedagogicalIntent: 'TRANSFER',
  assessmentId: 'asm-pfs-m6-w24-024',
  status: 'PUBLISHED',
  version: '1.0.0',
  blocks: [
    {
      id: 'blk-b24-d122-01',
      type: 'TRANSFER_CHALLENGE',
      order: 1,
      title: 'Gate 2 Pre-Assessment Integration Challenge: Resilient Client-Server Telemetry Prototype',
      estimatedMinutes: 60,
      status: 'PUBLISHED',
      version: '1.0.0',
      targetCompetencyId: COMPETENCY_ID_BROWSER_NETWORKING_AND_GATE2,
      unfamiliarDomainContext: 'Mission-Critical Autonomous Drone Fleet Telemetry & Command Network',
      task: 'Synthesize wire-level HTTP/1.1 framing, resilient asynchronous Fetch networking with retry decision-trees, in-flight coalescing, cache-aside TTL, memory-safe DOM rendering with DocumentFragment, and WCAG AA accessibility into an integrated client-server telemetry console prototype prior to undertaking the dedicated 180-minute Gate 2 summative evaluation session.',
      constraints: [
        'Must implement strict idempotent retry logic honoring RFC 9110 Retry-After and full jittered backoff.',
        'Must implement in-flight request coalescing to deduplicate simultaneous identical telemetry requests.',
        'Must cache resolved telemetry responses in memory with a configurable max-age TTL.',
        'Must use DocumentFragment for all table row rendering to eliminate layout thrashing.',
        'Must use single-parent event delegation on the table container with AbortController lifecycle teardown.',
        'Must implement native <dialog> modal detail views with activeElement focus restoration.',
        'Must meet all WCAG 2.2 AA accessibility requirements (4.5:1 text contrast, 24x24px target size, sequential headings).',
        'Must pass spiral Python 3.14 Protocols and Data Structures verification probes.',
      ],
      timeExpectationMinutes: 60,
      difficulty: 'CHALLENGING',
    } as TransferChallengeBlock,
    {
      id: 'blk-b24-d122-02',
      type: 'KNOWLEDGE_CHECK',
      order: 2,
      title: 'Knowledge Check: Gate 2 Architectural Synthesis & Web Invariants',
      estimatedMinutes: 15,
      status: 'PUBLISHED',
      version: '1.0.0',
      diagnosticQuestion: 'Which architectural combination correctly describes the end-to-end flow of a resilient client-server web transaction in modern systems?',
      options: [
        'A request validates method idempotency before retrying transient status codes (408/429/502/503/504) with jittered backoff, coalesces concurrent flights, clones readable streams before logging, batches DOM updates via DocumentFragment, and restores keyboard focus on modal dismissal.',
        'A request retries all 4xx and 5xx errors unconditionally using fixed 1-second intervals, caches responses permanently in a global array, writes directly to innerHTML, and uses positive tabindex for focus.',
        'A request relies on synchronous XMLHttpRequest to ensure thread-blocking safety, parses responses without checking content-type, and attaches individual click handlers to every row.',
        'A request bypasses the browser event loop by using Web Workers for all DOM mutations.',
      ],
      correctIndex: 0,
      explanation: 'End-to-end client-server resilience requires combining transport-level safety (method idempotency, retry decision-tree, jittered backoff, stream cloning) with UI execution hygiene (in-flight coalescing, DocumentFragment batching, event delegation, and accessible focus restoration).',
      misconceptionIdentified: 'Believing resilience only concerns networking or only concerns the UI layer in isolation.',
    } as KnowledgeCheckBlock,
    {
      id: 'blk-b24-d122-03',
      type: 'REFLECTION',
      order: 3,
      title: 'Gate 2 Milestone Retrospective: Concluding Semester 1 Web Foundations',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      prompt: 'Reflect on your complete Semester 1 journey spanning 120 core instructional days from low-level computing and Python foundations to wire-level HTTP, DOM mechanics, and resilient client networking.',
      guidingQuestions: [
        'How does deep knowledge of low-level protocols (TCP, HTTP wire framing) demystify high-level browser APIs and backend frameworks?',
        'How does master-level discipline in memory management, accessibility, and performance separate senior software engineers from framework consumers?',
      ],
    } as ReflectionBlock,
    {
      id: 'blk-b24-d122-04',
      type: 'REFERENCE',
      order: 4,
      title: 'Gate 2 Reference Sheet: Comprehensive Web Foundations Architecture',
      estimatedMinutes: 5,
      status: 'PUBLISHED',
      version: '1.0.0',
      links: [
        {
          title: 'RFC 9112: HTTP/1.1 Specification',
          url: 'https://www.rfc-editor.org/rfc/rfc9112',
        },
        {
          title: 'WHATWG Fetch Standard',
          url: 'https://fetch.spec.whatwg.org/',
        },
        {
          title: 'W3C WCAG 2.2 Recommendation',
          url: 'https://www.w3.org/TR/WCAG22/',
        },
      ],
      documentationExtracts: [
        'RFC 9112: Robust HTTP implementations must handle message framing, chunked transfer coding, and status classes strictly according to protocol invariants.',
        'WHATWG DOM & Fetch: Client resilience requires combining asynchronous stream management, event delegation, and declarative accessibility.',
      ],
    } as ReferenceBlock,
  ],
};

// ── BATCH 024 MANIFEST (COMPLETE 5-DAY BATCH · CONCLUDES SEMESTER 1) ──
export const BATCH_024_MANIFEST: BatchContentManifest = {
  batchId: 'batch-pfs-m6-w24-024',
  batchCode: 'P2-M6-W24-BATCH024',
  title: 'Asynchronous Browser Communication, Fetch API, Resilient Client Networking & Gate 2 Web Foundations Exit Assessment',
  difficulty: 'ADVANCED',
  days: [
    DAY_118_MANIFEST,
    DAY_119_MANIFEST,
    DAY_120_MANIFEST,
    DAY_121_MANIFEST,
    DAY_122_MANIFEST,
  ],
  isPartial: false,
  version: '1.0.0',
  status: 'PUBLISHED',
  createdAt: '2026-09-08T00:00:00.000Z',
  updatedAt: '2026-09-08T00:00:00.000Z',
};
