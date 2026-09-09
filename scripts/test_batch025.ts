// scripts/test_batch025.ts
// Programmatic Verification Suite for PinIT Career OS Batch 025 (Days 123–125 · PARTIAL)
// Semester 2 Launch: Django 6.0 Architecture, Gateway Interfaces & Template Foundations

import * as fs from 'fs';
import * as path from 'path';
import {
  BATCH_025_MANIFEST,
  COMPETENCY_ID_DJANGO_FOUNDATIONS,
  DAY_127_ASSESSMENT,
} from '../src/lib/curriculum/pythonFullStack/batch025';
import { ContentValidator } from '../src/lib/curriculum/contentValidator';

// ── REFERENCE BEHAVIORAL IMPLEMENTATIONS (FOR AUDIT RIGOR) ──

// 1. WSGI Callable Reference Simulator (PEP 3333)
function simulateWsgiExecution(
  environ: Record<string, any>,
  appCallable: (environ: Record<string, any>, start_response: (status: string, headers: [string, string][]) => void) => string[]
): { status: string; headers: [string, string][]; body: string } {
  let responseStatus = '';
  let responseHeaders: [string, string][] = [];

  const startResponse = (status: string, headers: [string, string][]) => {
    responseStatus = status;
    responseHeaders = headers;
  };

  const bodyChunks = appCallable(environ, startResponse);
  return {
    status: responseStatus,
    headers: responseHeaders,
    body: bodyChunks.join(''),
  };
}

// 2. ASGI Callable Reference Simulator
async function simulateAsgiExecution(
  scope: Record<string, any>,
  appCallable: (scope: Record<string, any>, receive: () => Promise<any>, send: (event: any) => Promise<void>) => Promise<void>
): Promise<{ status: number; headers: [string, string][]; body: string }> {
  let status = 0;
  const headers: [string, string][] = [];
  const bodyChunks: string[] = [];

  const receive = async () => ({ type: 'http.request', body: Buffer.from(''), more_body: false });
  const send = async (event: any) => {
    if (event.type === 'http.response.start') {
      status = event.status;
      if (event.headers) {
        event.headers.forEach(([k, v]: [Uint8Array, Uint8Array]) => {
          headers.push([k.toString(), v.toString()]);
        });
      }
    } else if (event.type === 'http.response.body') {
      bodyChunks.push(event.body ? event.body.toString() : '');
    }
  };

  await appCallable(scope, receive, send);
  return { status, headers, body: bodyChunks.join('') };
}

// 3. DTL Variable Dot-Lookup Algorithm Simulator
function resolveDtlDotLookup(target: any, pathExpr: string): any {
  const parts = pathExpr.split('.');
  let current = target;

  for (const part of parts) {
    if (current === null || current === undefined) return '';

    // Step 1: Dictionary key lookup
    if (typeof current === 'object' && part in current) {
      const val = current[part];
      current = typeof val === 'function' && val.length === 0 ? val.call(current) : val;
      continue;
    }

    // Step 2: Attribute lookup
    if (typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, part)) {
      current = current[part];
      continue;
    }

    // Step 3: Method call (0 arguments)
    if (typeof current[part] === 'function' && current[part].length === 0) {
      current = current[part]();
      continue;
    }

    // Step 4: List index lookup
    const index = Number(part);
    if (Array.isArray(current) && !Number.isNaN(index) && index >= 0 && index < current.length) {
      current = current[index];
      continue;
    }

    return ''; // Fallback string_if_invalid
  }

  return current;
}

// 4. DTL HTML Auto-Escaping Simulator
function escapeHtmlDtl(rawText: string): string {
  return rawText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
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

export async function runBatch025Audit(): Promise<number> {
  console.log('\n========================================================================');
  console.log('🧪 RUNNING PINIT BATCH 025 (COMPLETE · DAYS 123–127) TECHNICAL AUDIT TEST SUITE');
  console.log('Semester 2 Launch: Django 6.0 Architecture, Gateway Interfaces, Templates & Middleware');
  console.log('========================================================================\n');

  assertionCount = 0;

  // ── GROUP 1: Complete Batch Manifest & 5-Day Structure ──
  console.log('── GROUP 1: Complete Batch Manifest & 5-Day Structure ──');
  assert(BATCH_025_MANIFEST.batchCode === 'P2-M7-W25-BATCH025', 'Batch code is "P2-M7-W25-BATCH025"');
  assert(BATCH_025_MANIFEST.batchId === 'batch-pfs-m7-w25-025', 'Batch ID is "batch-pfs-m7-w25-025"');
  assert(BATCH_025_MANIFEST.days.length === 5, 'Batch contains exactly 5 published learning days (Days 123–127)');
  assert(BATCH_025_MANIFEST.isPartial === false, 'Batch manifest is explicitly flagged isPartial: false');
  assert(BATCH_025_MANIFEST.difficulty === 'ADVANCED', 'Batch difficulty is ADVANCED');
  assert(BATCH_025_MANIFEST.status === 'PUBLISHED', 'Batch status is PUBLISHED');
  assert(BATCH_025_MANIFEST.version === '1.0.0', 'Batch version is 1.0.0');

  ContentValidator.validateBatchManifest(BATCH_025_MANIFEST);
  assert(true, 'ContentValidator.validateBatchManifest() passes for complete 5-day batch');

  assert(BATCH_025_MANIFEST.days[0].dayNumber === 1, 'Day 123 internal dayNumber is 1');
  assert(BATCH_025_MANIFEST.days[2].dayNumber === 3, 'Day 125 internal dayNumber is 3');
  assert(BATCH_025_MANIFEST.days[3].dayNumber === 4, 'Day 126 internal dayNumber is 4');
  assert(BATCH_025_MANIFEST.days[4].dayNumber === 5, 'Day 127 internal dayNumber is 5');
  assert(BATCH_025_MANIFEST.days[0].packetId === 'batch-pfs-m7-w25-025', 'Day 123 packetId matches batchId');
  assert(BATCH_025_MANIFEST.days[4].packetId === 'batch-pfs-m7-w25-025', 'Day 127 packetId matches batchId');

  const expectedIntents = ['UNDERSTAND', 'APPLY', 'BUILD', 'DEBUG', 'TRANSFER'];
  BATCH_025_MANIFEST.days.forEach((day, idx) => {
    assert(day.pedagogicalIntent === expectedIntents[idx], `Day ${day.dayNumber} pedagogicalIntent is '${expectedIntents[idx]}'`);
  });

  // ── GROUP 2: Instructional Timing & Workload Balance ──
  console.log('\n── GROUP 2: Instructional Timing & Workload Balance ──');
  const dayMinutes = BATCH_025_MANIFEST.days.map((day) =>
    day.blocks.reduce((sum, block) => sum + block.estimatedMinutes, 0)
  );

  assert(dayMinutes[0] === 85, `Day 123 workload is 85 min (Found: ${dayMinutes[0]} min)`);
  assert(dayMinutes[1] === 85, `Day 124 workload is 85 min (Found: ${dayMinutes[1]} min)`);
  assert(dayMinutes[2] === 85, `Day 125 workload is 85 min (Found: ${dayMinutes[2]} min)`);
  assert(dayMinutes[3] === 85, `Day 126 workload is 85 min (Found: ${dayMinutes[3]} min)`);
  assert(dayMinutes[4] === 85, `Day 127 workload is 85 min (Found: ${dayMinutes[4]} min)`);

  const totalMinutes = dayMinutes.reduce((a, b) => a + b, 0);
  assert(totalMinutes === 425, `Total Batch 025 learning time is 425 min / ~7.1h (Found: ${totalMinutes} min)`);

  // ── GROUP 3: Strict ORM Firewall Enforcement ──
  console.log('\n── GROUP 3: Strict ORM Firewall Enforcement ──');
  const batch025FilePath = path.join(__dirname, '../src/lib/curriculum/pythonFullStack/batch025.ts');
  const fileContent = fs.readFileSync(batch025FilePath, 'utf8');

  // Forbidden ORM patterns across all Days 123–127
  const forbiddenOrmPatterns = [
    { name: 'models.Model subclass', regex: /\bmodels\.Model\b/ },
    { name: 'django.db.models import', regex: /\bfrom\s+django\.db\s+import\s+models\b/ },
    { name: 'migrations.Migration subclass', regex: /\bmigrations\.Migration\b/ },
    { name: 'makemigrations command', regex: /\bmakemigrations\b/ },
    { name: 'migrate command', regex: /\bmanage\.py\s+migrate\b/ },
  ];

  forbiddenOrmPatterns.forEach((pat) => {
    assert(!pat.regex.test(fileContent), `ORM Firewall: Zero instances of ${pat.name}`);
  });

  // ── GROUP 4: Technical Invariants & Architectural Coverage ──
  console.log('\n── GROUP 4: Technical Invariants & Architectural Coverage ──');

  // Day 123: WSGI vs ASGI & Settings Security
  const day123Theory = BATCH_025_MANIFEST.days[0].blocks[0] as any;
  assert(
    day123Theory.whatItIs.includes('Django==6.0.8'),
    'Day 123 pins patched production release Django==6.0.8 (mitigating 6.0.0 vulnerabilities)'
  );
  assert(
    day123Theory.whatItIs.includes('WSGI') &&
    day123Theory.whatItIs.includes('application(environ, start_response)') &&
    day123Theory.whatItIs.includes('ASGI') &&
    day123Theory.whatItIs.includes('application(scope, receive, send)'),
    'Day 123 covers WSGI and ASGI gateway interface callables'
  );
  assert(
    day123Theory.whatItIs.includes('deployment server\'s configured process and thread worker pool model') ||
    day123Theory.whatItIs.includes('worker pool model'),
    'Day 123 accurately defines WSGI concurrency via deployment server worker models'
  );
  assert(
    day123Theory.whatItIs.includes('SECRET_KEY') &&
    day123Theory.whatItIs.includes('DEBUG = False') &&
    day123Theory.whatItIs.includes('ALLOWED_HOSTS'),
    'Day 123 covers critical production settings security invariants'
  );

  // Day 124: URLconf & View Contract
  const day124Theory = BATCH_025_MANIFEST.days[1].blocks[0] as any;
  assert(
    day124Theory.whatItIs.includes('path converters') &&
    day124Theory.whatItIs.includes('<int:name>') &&
    day124Theory.whatItIs.includes('<uuid:name>') &&
    day124Theory.whatItIs.includes('include('),
    'Day 124 covers path converters and hierarchical include() routing'
  );
  assert(
    day124Theory.whatItIs.includes('HttpRequest') &&
    day124Theory.whatItIs.includes('HttpResponse') &&
    day124Theory.whatItIs.includes('JsonResponse'),
    'Day 124 enforces the strict HttpRequest -> HttpResponse view contract'
  );

  // Day 125: DTL Templates & Auto-Escaping
  const day125Theory = BATCH_025_MANIFEST.days[2].blocks[0] as any;
  assert(
    day125Theory.whatItIs.includes('{% extends') &&
    day125Theory.whatItIs.includes('{% block') &&
    day125Theory.whatItIs.includes('Dot-Lookup Algorithm'),
    'Day 125 covers template inheritance and the sequential dot-lookup algorithm'
  );
  assert(
    day125Theory.whatItIs.includes('&lt;') &&
    day125Theory.whatItIs.includes('&gt;') &&
    day125Theory.whatItIs.includes('&amp;'),
    'Day 125 documents built-in contextual HTML auto-escaping for XSS prevention'
  );

  // Day 126: Middleware & WhiteNoise Static Serving
  const day126Theory = BATCH_025_MANIFEST.days[3].blocks[0] as any;
  assert(
    day126Theory.whatItIs.includes('X-Correlation-ID') &&
    day126Theory.whatItIs.includes('X-Response-Time-MS') &&
    day126Theory.whatItIs.includes('process_exception') &&
    day126Theory.whatItIs.includes('WhiteNoiseMiddleware'),
    'Day 126 covers correlation ID telemetry, process_exception error masking, and WhiteNoise'
  );

  // Day 127: Formative Assessment Rubric & Weights
  const day127Transfer = BATCH_025_MANIFEST.days[4].blocks[0] as any;
  assert(day127Transfer.type === 'TRANSFER_CHALLENGE', 'Day 127 primary block is TRANSFER_CHALLENGE');
  assert(day127Transfer.estimatedMinutes === 75, 'Day 127 transfer challenge is 75 min');
  assert(day127Transfer.unfamiliarDomainContext.length > 0, 'Day 127 transfer challenge has unfamiliarDomainContext');
  assert(day127Transfer.task.length > 0, 'Day 127 transfer challenge has task description');
  assert(day127Transfer.constraints.length >= 4, 'Day 127 transfer challenge has at least 4 constraints');
  assert(DAY_127_ASSESSMENT.rubric.length === 5, 'Day 127 assessment has 5 rubric dimensions');
  const rubricSum = DAY_127_ASSESSMENT.rubric.reduce((sum, r) => sum + r.weight, 0);
  assert(Math.abs(rubricSum - 1.0) < 0.001, `Day 127 rubric weights sum to exactly 1.0 (Found: ${rubricSum})`);

  // ── GROUP 5: Behavioral Reference Simulation Tests ──
  console.log('\n── GROUP 5: Behavioral Reference Simulation Tests ──');

  // Test 1: WSGI callable execution simulation
  const wsgiApp = (environ: any, start_response: any) => {
    start_response('200 OK', [['Content-Type', 'text/plain']]);
    return ['Hello WSGI Gateway'];
  };
  const wsgiResult = simulateWsgiExecution({ PATH_INFO: '/' }, wsgiApp);
  assert(wsgiResult.status === '200 OK', 'WSGI returns 200 OK status');
  assert(wsgiResult.body === 'Hello WSGI Gateway', 'WSGI body executed correctly');

  // Test 2: ASGI callable execution simulation
  const asgiApp = async (scope: any, receive: any, send: any) => {
    await send({ type: 'http.response.start', status: 200, headers: [[Buffer.from('content-type'), Buffer.from('application/json')]] });
    await send({ type: 'http.response.body', body: Buffer.from('{"status":"ASGI_OK"}') });
  };
  const asgiResult = await simulateAsgiExecution({ type: 'http' }, asgiApp);
  assert(asgiResult.status === 200, 'ASGI returns 200 status');
  assert(asgiResult.body === '{"status":"ASGI_OK"}', 'ASGI body executed correctly');

  // Test 3: DTL variable dot-lookup algorithm simulation
  const sampleContext = {
    user: {
      profile: {
        getAge: () => 28,
        tags: ['fullstack', 'python'],
      },
    },
  };
  const resolvedAge = resolveDtlDotLookup(sampleContext, 'user.profile.getAge');
  assert(resolvedAge === 28, 'DTL dot lookup resolves 0-argument method call');

  const resolvedTag = resolveDtlDotLookup(sampleContext, 'user.profile.tags.1');
  assert(resolvedTag === 'python', 'DTL dot lookup resolves list index');

  const invalidLookup = resolveDtlDotLookup(sampleContext, 'user.nonexistent.prop');
  assert(invalidLookup === '', 'Invalid DTL dot lookup falls back to empty string');

  // Test 4: HTML auto-escaping simulation
  const maliciousInput = '<script>alert("XSS")</script> & \'test\'';
  const escaped = escapeHtmlDtl(maliciousInput);
  assert(
    escaped === '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt; &amp; &#x27;test&#x27;',
    'HTML auto-escaping neutralizes <, >, &, ", and \''
  );

  // Test 5: Middleware Onion Pipeline & process_exception Simulation
  interface SimRequest {
    headers: Record<string, string>;
    correlationId?: string;
  }
  interface SimResponse {
    status: number;
    headers: Record<string, string>;
    body: string;
  }

  const simulateMiddlewarePipeline = (
    req: SimRequest,
    viewHandler: (r: SimRequest) => SimResponse
  ): SimResponse => {
    // Middleware 1: Telemetry & Error Sanitizer
    const correlationId = req.headers['x-correlation-id'] || 'sim-uuid-42';
    req.correlationId = correlationId;

    let res: SimResponse;
    try {
      res = viewHandler(req);
    } catch (err: any) {
      // process_exception hook
      return {
        status: 500,
        headers: { 'X-Correlation-ID': correlationId },
        body: JSON.stringify({ error: 'Internal Server Error', correlation_id: correlationId }),
      };
    }

    res.headers['X-Correlation-ID'] = correlationId;
    res.headers['X-Response-Time-MS'] = '1.25';
    return res;
  };

  const okResp = simulateMiddlewarePipeline({ headers: { 'x-correlation-id': 'req-999' } }, (r) => ({
    status: 200,
    headers: {},
    body: 'Success',
  }));
  assert(okResp.headers['X-Correlation-ID'] === 'req-999', 'Middleware attaches correlation ID to response');
  assert(okResp.headers['X-Response-Time-MS'] !== undefined, 'Middleware attaches response latency');

  const errResp = simulateMiddlewarePipeline({ headers: {} }, () => {
    throw new Error('Database connection failed! host=internal.db pass=secret');
  });
  assert(errResp.status === 500, 'process_exception returns 500 status on unhandled error');
  assert(!errResp.body.includes('pass=secret'), 'process_exception prevents traceback and secret leakage');
  assert(errResp.headers['X-Correlation-ID'] === 'sim-uuid-42', 'process_exception attaches correlation ID');

  // ── GROUP 6: Diagnostic & QA Checks on All Blocks ──
  console.log('\n── GROUP 6: Diagnostic & QA Checks on All Blocks ──');

  BATCH_025_MANIFEST.days.forEach((d) => {
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
  console.log(`🎉 BATCH 025 AUDIT COMPLETE: ALL ${assertionCount} CHECKS PASSED WITH 0 DEFECTS`);
  console.log(`========================================================================\n`);

  return assertionCount;
}

if (require.main === module) {
  runBatch025Audit().catch((err) => {
    console.error('Batch 025 Audit Failed:', err);
    process.exit(1);
  });
}
