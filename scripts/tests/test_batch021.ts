// scripts/test_batch021.ts
// Programmatic Verification Suite for PinIT Career OS Batch 021 (Days 103–107)
// Web Fundamentals: Wire-Level HTTP/1.1 Framing Subset, Sockets, Slowloris & Request-Smuggling Defenses

import * as path from 'path';
import {
  BATCH_021_MANIFEST,
  DAY_107_ASSESSMENT,
  COMPETENCY_ID_HTTP_WIRE_PROTOCOL_AND_SOCKETS,
} from '../src/lib/curriculum/pythonFullStack/batch021';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';
import { AssessmentValidator } from '../src/lib/curriculum/assessmentValidator';

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (FOR AUDIT RIGOR) ──

class HttpParsingError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'HttpParsingError';
    this.statusCode = statusCode;
  }
}

class RequestSmugglingError extends HttpParsingError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'RequestSmugglingError';
  }
}

class SecurityViolationError extends HttpParsingError {
  constructor(message: string) {
    super(message, 403);
    this.name = 'SecurityViolationError';
  }
}

// 1. Reference Request Line Parser
function parseRequestLine(rawLine: string): { method: string; target: string; version: string } {
  const parts = rawLine.split(' ');
  if (parts.length !== 3) {
    throw new HttpParsingError('Malformed request line: must contain exactly 3 tokens', 400);
  }
  const [method, target, version] = parts;
  if (!/^[A-Z]+$/.test(method)) {
    throw new HttpParsingError(`Invalid HTTP method: ${method}`, 400);
  }
  // Enforce origin-form subset
  if (!target.startsWith('/')) {
    throw new HttpParsingError(`Unsupported request target form: origin-form required`, 501);
  }
  if (version !== 'HTTP/1.1') {
    throw new HttpParsingError(`Unsupported HTTP version: ${version}`, 505);
  }
  return { method, target, version };
}

// 2. Reference Defensive Header Validator
function validateHeadersDefensive(lines: string[]): Record<string, string> {
  const headers: Record<string, string> = {};
  let hostCount = 0;
  let clCount = 0;

  for (const line of lines) {
    if (!line.includes(':')) {
      throw new HttpParsingError('Malformed header line: missing colon', 400);
    }
    const colonIdx = line.indexOf(':');
    const rawKey = line.substring(0, colonIdx);
    const val = line.substring(colonIdx + 1);

    // RFC 9112 Section 5.1: No whitespace before colon
    if (rawKey !== rawKey.trimEnd()) {
      throw new RequestSmugglingError('Whitespace before header colon forbidden (RFC 9112 Section 5.1)');
    }

    const key = rawKey.trim().toLowerCase();
    if (!key) {
      throw new HttpParsingError('Empty header field name', 400);
    }

    if (key === 'host') {
      hostCount++;
      if (hostCount > 1) {
        throw new RequestSmugglingError('Duplicate Host header detected');
      }
    } else if (key === 'content-length') {
      clCount++;
      if (clCount > 1) {
        throw new RequestSmugglingError('Duplicate Content-Length header detected');
      }
      const parsedCl = parseInt(val.trim(), 10);
      if (isNaN(parsedCl) || parsedCl < 0 || String(parsedCl) !== val.trim()) {
        throw new HttpParsingError('Invalid Content-Length value', 400);
      }
    }

    headers[key] = val.trim();
  }

  if (hostCount === 0) {
    throw new HttpParsingError('Missing mandatory Host header', 400);
  }

  // RFC 9112 Section 6.1: Reject conflicting TE and CL
  if ('transfer-encoding' in headers && 'content-length' in headers) {
    throw new RequestSmugglingError('Conflicting Transfer-Encoding and Content-Length headers');
  }

  return headers;
}

// 3. Reference Path Traversal Containment Pipeline
function resolveSafePath(docRoot: string, requestUri: string): string {
  const cleanUri = requestUri.split('?')[0];
  const decodedPath = decodeURIComponent(cleanUri);

  if (decodedPath.includes('\0')) {
    throw new SecurityViolationError('NUL byte in request path');
  }

  // Strip leading slashes exactly matching Python's decoded.lstrip("/")
  const cleanRel = decodedPath.replace(/^[/\\]+/, '');
  const canonicalRoot = path.resolve(docRoot);
  const candidatePath = path.resolve(canonicalRoot, cleanRel);

  const relative = path.relative(canonicalRoot, candidatePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new SecurityViolationError('Path traversal attempt outside document root');
  }

  return candidatePath;
}

// 4. Reference Cumulative Chunk Decoder
function decodeChunkedBody(
  chunks: { sizeHex: string; data: string; trailer?: string }[],
  maxBodyBytes: number = 10485760
): string {
  let decoded = '';
  for (const chunk of chunks) {
    const size = parseInt(chunk.sizeHex, 16);
    if (isNaN(size) || size < 0) {
      throw new HttpParsingError('Invalid hex chunk size', 400);
    }
    if (size === 0) {
      // Check trailer section
      if (chunk.trailer && chunk.trailer.trim().length > 0) {
        throw new HttpParsingError('Non-empty chunk trailers not implemented (501)', 501);
      }
      break;
    }
    if (decoded.length + size > maxBodyBytes) {
      throw new HttpParsingError('Cumulative chunked body exceeded 10 MiB limit', 413);
    }
    if (chunk.data.length !== size) {
      throw new HttpParsingError('Chunk size mismatch', 400);
    }
    decoded += chunk.data;
  }
  return decoded;
}

// ── TEST RUNNER & ASSERTION SUITE ──

let assertionCount = 0;

function assert(condition: boolean, message: string) {
  assertionCount++;
  if (!condition) {
    console.error(`  ❌ [FAIL] Check #${assertionCount}: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] Check #${assertionCount}: ${message}`);
}

export async function runBatch021Audit(): Promise<number> {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 021 (DAYS 103–107) TECHNICAL AUDIT TEST SUITE');
  console.log('Web Fundamentals: Wire-Level HTTP/1.1 Framing Subset, Sockets & Smuggling Defenses');
  console.log('========================================================================\n');

  assertionCount = 0;

  // ── GROUP 1: Batch Manifest & Strict 5-Day Structure ──
  console.log('── GROUP 1: Batch Manifest & Strict 5-Day Structure ──');
  assert(BATCH_021_MANIFEST.batchCode === 'P2-M6-W21-BATCH021', 'Batch code is "P2-M6-W21-BATCH021"');
  assert(BATCH_021_MANIFEST.batchId === 'batch-pfs-m6-w21-021', 'Batch ID is "batch-pfs-m6-w21-021"');
  assert(BATCH_021_MANIFEST.days.length === 5, 'Batch contains exactly 5 instructional days (Days 103–107)');
  assert(BATCH_021_MANIFEST.difficulty === 'ADVANCED', 'Batch difficulty is ADVANCED');
  assert(BATCH_021_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');
  assert(BATCH_021_MANIFEST.version === '1.0.0', 'Batch version is 1.0.0');
  assert(DAY_107_ASSESSMENT.targetCompetencyId === COMPETENCY_ID_HTTP_WIRE_PROTOCOL_AND_SOCKETS, 'Assessment competency matches comp-pfs-m6-021');

  ContentValidator.validateBatchManifest(BATCH_021_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes with 0 validation errors');

  assert(BATCH_021_MANIFEST.days[0].dayNumber === 1, 'Day 103 internal dayNumber is 1');
  assert(BATCH_021_MANIFEST.days[4].dayNumber === 5, 'Day 107 internal dayNumber is 5');
  assert(BATCH_021_MANIFEST.days[0].packetId === 'batch-pfs-m6-w21-021', 'Day 103 packetId matches batchId');

  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_021_MANIFEST.days.forEach((day, idx) => {
    assert(day.pedagogicalIntent === expectedIntents[idx], `Day ${day.dayNumber} pedagogicalIntent is '${expectedIntents[idx]}'`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_021_MANIFEST.days.map((day) =>
    day.blocks.reduce((sum, block) => sum + block.estimatedMinutes, 0)
  );

  assert(dayMinutes[0] === 85, `Day 103 workload is 85 min (Found: ${dayMinutes[0]} min)`);
  assert(dayMinutes[1] === 85, `Day 104 workload is 85 min (Found: ${dayMinutes[1]} min)`);
  assert(dayMinutes[2] === 85, `Day 105 workload is 85 min (Found: ${dayMinutes[2]} min)`);
  assert(dayMinutes[3] === 85, `Day 106 workload is 85 min (Found: ${dayMinutes[3]} min)`);
  assert(dayMinutes[4] === 95, `Day 107 assessment workload is 95 min (Found: ${dayMinutes[4]} min)`);

  const totalMinutes = dayMinutes.reduce((a, b) => a + b, 0);
  assert(totalMinutes === 435, `Total Batch 021 learning time is 435 min / 7.25h (Found: ${totalMinutes} min)`);

  // ── GROUP 3: Assessment Engine & Rubric Conformance ──
  console.log('\n── GROUP 3: Assessment Engine & Rubric Conformance ──');
  AssessmentValidator.validateAssessment(DAY_107_ASSESSMENT);
  assert(true, 'AssessmentValidator.validateAssessment() passes with 0 errors');
  assert(DAY_107_ASSESSMENT.passingScore === 80, 'Passing score threshold is 80%');
  assert(DAY_107_ASSESSMENT.timeLimitMinutes === 95, 'Time limit is 95 minutes');
  assert(DAY_107_ASSESSMENT.items.length === 1, 'Contains 1 formative capstone assessment item');

  const capstoneItem = DAY_107_ASSESSMENT.items[0];
  const rubricDims = capstoneItem.rubric || capstoneItem.rubricDimensions;
  assert(rubricDims !== undefined, 'Assessment item has explicit rubric dimensions');
  assert(rubricDims!.length === 5, `Rubric defines 5 competency dimensions (Found: ${rubricDims!.length})`);

  const totalRubricPts = rubricDims!.reduce((sum, d) => sum + d.maxPoints, 0);
  assert(totalRubricPts === 100, `Rubric points sum to 100 (Found: ${totalRubricPts})`);

  const totalWeights = rubricDims!.reduce((sum, d) => sum + d.weight, 0);
  assert(Math.abs(totalWeights - 1.0) < 0.001, `Rubric weights sum to 1.0 (Found: ${totalWeights})`);

  // Verify competency floors on Dim 1 (Framing & Parser) and Dim 5 (Keep-Alive Lifecycle)
  const dim1 = rubricDims!.find((d: any) => d.id === 'dim-b21-01');
  const dim5 = rubricDims!.find((d: any) => d.id === 'dim-b21-05');
  assert(dim1 !== undefined && dim1.maxPoints === 25 && dim1.isMandatory === true, 'Dimension 1 has 25 pts and mandatory floor');
  assert(dim5 !== undefined && dim5.maxPoints === 25 && dim5.isMandatory === true, 'Dimension 5 has 25 pts and mandatory floor');

  // ── GROUP 4: Technical Invariants & RFC 9112 Framing Subset ──
  console.log('\n── GROUP 4: Technical Invariants & RFC 9112 Framing Subset ──');

  // Verify TCP handshake kernel layering
  const day103Theory = BATCH_021_MANIFEST.days[0].blocks[0] as any;
  assert(
    day103Theory.whatItIs.includes('three-way handshake') &&
    day103Theory.whatItIs.includes('kernel network stack below the application layer'),
    'Day 103 explicitly documents kernel handling of TCP handshake below Python socket API'
  );

  // Verify origin-form subset & 501 on other forms
  const day105Theory = BATCH_021_MANIFEST.days[2].blocks[0] as any;
  assert(
    day105Theory.whatItIs.includes('origin-form') &&
    day105Theory.whatItIs.includes('rejecting unsupported absolute/authority/asterisk forms'),
    'Day 105 documents origin-form request targets and 501 rejection of other forms'
  );

  // Verify single-threaded concurrency limitation
  assert(
    day105Theory.whatItIs.includes('single-threaded') &&
    day105Theory.whatItIs.includes('educational protocol implementation, not a production concurrency architecture'),
    'Day 105 documents single-threaded limitation, deferring async/pools to Phase 3'
  );

  // Verify anti-slowloris deadlines
  const day106Theory = BATCH_021_MANIFEST.days[3].blocks[0] as any;
  assert(
    day106Theory.whatItIs.includes('HEADER_READ_DEADLINE') ||
    day106Theory.summary.includes('slowloris') ||
    (day106Theory.problemSolved && day106Theory.problemSolved.includes('slowloris')),
    'Day 106 documents anti-slowloris wall-clock deadlines'
  );

  // Verify cumulative chunk limit & 501 trailer rejection
  assert(
    day106Theory.whatItIs.includes('MAX_BODY_BYTES (10 MiB)') &&
    day106Theory.whatItIs.includes('501 Not Implemented + Connection: close'),
    'Day 106 mandates cumulative 10 MiB chunk limit and deterministic 501 on non-empty trailers'
  );

  // ── GROUP 5: Behavioral Reference Simulation (HTTP Protocol Contracts) ──
  console.log('\n── GROUP 5: Behavioral Reference Simulation (HTTP Protocol Contracts) ──');

  // Test 1: Origin-form request line parsing
  const req1 = parseRequestLine('GET /api/v1/telemetry?format=json HTTP/1.1');
  assert(req1.method === 'GET' && req1.target === '/api/v1/telemetry?format=json', 'Parsed valid origin-form GET request');

  // Test 2: Absolute-form rejection with 501
  let threw501 = false;
  try {
    parseRequestLine('GET http://example.com/index.html HTTP/1.1');
  } catch (err: any) {
    threw501 = err.statusCode === 501;
  }
  assert(threw501, 'Absolute-form request target rejected with 501 Not Implemented');

  // Test 3: Defensive Header Validation
  const validHeaders = validateHeadersDefensive([
    'Host: example.internal.com',
    'User-Agent: test-suite/1.0',
    'Content-Length: 42',
    'Connection: close',
  ]);
  assert(validHeaders['host'] === 'example.internal.com', 'Validated valid single Host header');
  assert(validHeaders['content-length'] === '42', 'Validated Content-Length header');

  // Test 4: Whitespace before colon rejection (RFC 9112 Section 5.1)
  let rejectedWsBeforeColon = false;
  try {
    validateHeadersDefensive(['Host : evil.com']);
  } catch (err: any) {
    rejectedWsBeforeColon = err instanceof RequestSmugglingError;
  }
  assert(rejectedWsBeforeColon, 'Whitespace before colon rejected with RequestSmugglingError');

  // Test 5: Duplicate Host header rejection
  let rejectedDupHost = false;
  try {
    validateHeadersDefensive(['Host: host1.com', 'Host: host2.com']);
  } catch (err: any) {
    rejectedDupHost = err instanceof RequestSmugglingError;
  }
  assert(rejectedDupHost, 'Duplicate Host header rejected with RequestSmugglingError');

  // Test 6: Conflicting TE and CL rejection (Request Smuggling defense)
  let rejectedTeClConflict = false;
  try {
    validateHeadersDefensive([
      'Host: test.com',
      'Transfer-Encoding: chunked',
      'Content-Length: 100',
    ]);
  } catch (err: any) {
    rejectedTeClConflict = err instanceof RequestSmugglingError;
  }
  assert(rejectedTeClConflict, 'Conflicting Transfer-Encoding + Content-Length rejected with RequestSmugglingError');

  // Test 7: Cumulative Chunk Decoder under 10 MiB limit
  const normalChunks = [
    { sizeHex: '5', data: 'hello' },
    { sizeHex: '6', data: ' world' },
    { sizeHex: '0', data: '', trailer: '' },
  ];
  const decoded = decodeChunkedBody(normalChunks);
  assert(decoded === 'hello world', 'Decoded valid chunked stream');

  // Test 8: Non-empty chunk trailer rejection with 501
  let trailer501 = false;
  try {
    decodeChunkedBody([
      { sizeHex: '4', data: 'test' },
      { sizeHex: '0', data: '', trailer: 'Expires: Wed, 21 Oct 2026 07:28:00 GMT\r\n' },
    ]);
  } catch (err: any) {
    trailer501 = err.statusCode === 501;
  }
  assert(trailer501, 'Non-empty chunk trailer rejected with 501 Not Implemented');

  // Test 9: Path Traversal Containment
  const docRoot = path.resolve('public_html');
  const safeFile = resolveSafePath(docRoot, '/images/logo.png');
  assert(safeFile.startsWith(docRoot), 'Safe file resolves within docRoot');

  let traversalBlocked = false;
  try {
    resolveSafePath(docRoot, '/../../etc/passwd');
  } catch (err: any) {
    traversalBlocked = err instanceof SecurityViolationError;
  }
  assert(traversalBlocked, 'Path traversal /../../etc/passwd blocked with SecurityViolationError');

  // ── GROUP 6: Diagnostic & Quality Assurance Checks ──
  console.log('\n── GROUP 6: Diagnostic & Quality Assurance Checks ──');

  BATCH_021_MANIFEST.days.forEach((d) => {
    d.blocks.forEach((blk) => {
      assert(blk.title.trim().length > 0, `Block ${blk.id} has non-empty title`);
      assert(blk.estimatedMinutes > 0, `Block ${blk.id} has positive estimatedMinutes`);
      if (blk.type === 'KNOWLEDGE_CHECK') {
        const kc = blk as any;
        assert(kc.options.length >= 4, `Knowledge check ${blk.id} has at least 4 options`);
        assert(kc.correctIndex >= 0 && kc.correctIndex < kc.options.length, `Knowledge check ${blk.id} has valid correctIndex`);
        assert(kc.explanation.length > 20, `Knowledge check ${blk.id} has detailed explanation`);
      }
    });
  });

  console.log(`\n========================================================================`);
  console.log(`🎉 BATCH 021 AUDIT COMPLETE: ALL ${assertionCount} CHECKS PASSED WITH 0 DEFECTS`);
  console.log(`========================================================================\n`);

  return assertionCount;
}

if (require.main === module) {
  runBatch021Audit().catch((err) => {
    console.error('Batch 021 Audit Failed:', err);
    process.exit(1);
  });
}
