// cloud-run/java-judge/server.js
//
// Stage 1, Risk 3 — real Java judge, deployed as a Cloud Run service.
//
// WHY THIS EXISTS: production (pinit-careers.web.app) is Firebase static
// hosting with ZERO /api/* server routes — proven empirically this session by
// requesting https://pinit-careers.web.app/api/code/run-java directly and
// getting the SAME static "Page not found" shell for GET and POST. The
// Next.js route at src/app/api/code/run-java/route.ts only ever ran in local
// `next dev`/`next start`; it was never reachable in the deployed app.
//
// This service reimplements the EXACT SAME compile+run logic (same forbidden-
// API denylist, same temp-dir-per-run isolation, same javac/java invocation,
// same response shape) as that Next.js route, as a standalone container Cloud
// Run can actually serve. Firebase Hosting is configured (firebase.json) to
// rewrite /api/code/run-java to this service, so the browser-facing URL and
// contract are unchanged — only where the code actually executes changes.
//
// Auth: replicates src/lib/server/requireAuth.ts's requireUserFromRequest —
// same env vars, same Supabase Auth validation, same error shape — so
// javaJudgeRunner.ts's existing Authorization header handling needs no changes.

const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const PORT = process.env.PORT || 8080;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Stage 1, §3.5/§3.6 — ported from src/app/api/code/run-java/route.ts so this
// service (the one that actually runs in production) doesn't regress Java
// completion back to client-only once it replaces the unreachable Next.js
// route. Same graceful-degradation pattern as src/lib/faceStore.ts: no-ops if
// the service role key isn't configured, rather than failing the response.
function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function persistJavaCompletionServerSide(uid, questId, xpAmount) {
  const admin = getSupabaseAdmin();
  if (!admin) return;
  try {
    const { data: profile, error: fetchErr } = await admin.from('users').select('completed_quests, xp_total').eq('id', uid).single();
    if (fetchErr || !profile) { console.warn('[persistJavaCompletionServerSide] fetch failed:', fetchErr && fetchErr.message); return; }
    const current = profile.completed_quests || [];
    if (current.includes(questId)) return; // idempotent
    const newCompleted = [...current, questId];
    const newXp = (profile.xp_total || 0) + xpAmount;
    const { error: updateErr } = await admin.from('users').update({ completed_quests: newCompleted, xp_total: newXp }).eq('id', uid);
    if (updateErr) console.warn('[persistJavaCompletionServerSide] update failed:', updateErr.message);
  } catch (e) {
    console.warn('[persistJavaCompletionServerSide] threw:', e && e.message);
  }
}

const FORBIDDEN_PATTERNS = [
  /Runtime\.getRuntime/, /ProcessBuilder/, /Process\s*\(/, /System\.exit/,
  /java\.lang\.reflect/, /Class\.forName/, /ClassLoader/, /java\.io\.File/,
  /Files\.delete/, /Files\.write/, /new\s+File\s*\(/, /Thread\.sleep/,
  /new\s+Thread\s*\(/, /Executors\./, /java\.net\./, /Socket\s*\(/,
  /System\.setSecurityManager/,
];

function sh(cmd, opts) {
  return new Promise((resolve) => {
    exec(cmd, opts, (error, stdout, stderr) => resolve({ error, stdout, stderr }));
  });
}

async function requireUser(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  if (!token) return { error: { status: 401, body: { error: 'UNAUTHORIZED', message: 'Bearer session token required.' } } };
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { error: { status: 503, body: { error: 'MISCONFIGURED', message: 'Auth backend is not configured.' } } };
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data || !data.user || !data.user.id) {
      console.error('[requireUser] getUser rejected:', error && error.message);
      return { error: { status: 401, body: { error: 'UNAUTHORIZED', message: 'Invalid or expired session.' } } };
    }
    return { user: { id: data.user.id, email: data.user.email } };
  } catch (e) {
    console.error('[requireUser] threw:', e && e.message, e && e.stack);
    return { error: { status: 401, body: { error: 'UNAUTHORIZED', message: 'Session verification failed.' } } };
  }
}

async function runJavaJudge(body, uid) {
  const startTime = Date.now();
  const { code, testSuite, stdin, timeoutMs = 3000, questId, xp } = body;

  if (!code || typeof code !== 'string') {
    return { status: 400, body: { error: 'Missing Java source code' } };
  }
  if (code.length > 50000) {
    return { status: 400, body: { error: 'Source code exceeds size limit (50KB max)' } };
  }
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(code)) {
      return {
        status: 200,
        body: {
          language: 'java', totalTests: 1, passedTests: 0, failedTests: 1, allPassed: false,
          status: 'RUNTIME_ERROR', totalDurationMs: Date.now() - startTime,
          terminalLogs: ['[SECURITY GUARD] Restricted Java API detected. Process spawning and reflection are disallowed in the sandbox.'],
          testOutcomes: [{ index: 1, testCaseName: 'Security Sandbox Check', input: 'Forbidden API', expectedOutput: 'Clean Execution', actualOutput: 'Security Violation', passed: false, durationMs: Date.now() - startTime }],
        },
      };
    }
  }

  const runId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(os.tmpdir(), 'pinit_java_' + runId);
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    fs.writeFileSync(path.join(tempDir, 'Solution.java'), code, 'utf8');
    const testCode = testSuite && testSuite.trim() ? testSuite : `public class Test { public static void main(String[] args) { Solution.main(new String[]{}); } }`;
    fs.writeFileSync(path.join(tempDir, 'Test.java'), testCode, 'utf8');

    const compile = await sh('javac -encoding UTF-8 Solution.java Test.java', { cwd: tempDir, timeout: 5000 });
    if (compile.error || compile.stderr) {
      return {
        status: 200,
        body: {
          language: 'java', totalTests: 1, passedTests: 0, failedTests: 1, allPassed: false,
          status: 'SYNTAX_ERROR', totalDurationMs: Date.now() - startTime,
          terminalLogs: ['⚙️ Javac Compiling Solution.java Test.java...', compile.stderr || compile.error.message],
          testOutcomes: [{ index: 1, testCaseName: 'Java Compilation', input: 'Source Code', expectedOutput: '0 Errors', actualOutput: 'Compile Error', passed: false, durationMs: Date.now() - startTime, error: compile.stderr }],
        },
      };
    }

    const maxExecTime = Math.min(Math.max(timeoutMs, 1000), 4000);
    const run = await new Promise((resolve) => {
      const child = exec('java -Xmx128m -Dfile.encoding=UTF-8 Test', { cwd: tempDir, timeout: maxExecTime, maxBuffer: 64 * 1024 }, (error, stdout, stderr) => {
        resolve({ timedOut: Boolean(error && error.killed), success: !error && !stderr.includes('AssertionError') && !stderr.includes('Exception'), stdout: stdout || '', stderr: stderr || (error ? error.message : '') });
      });
      if (stdin && child.stdin) { child.stdin.write(stdin); child.stdin.end(); }
    });

    if (run.timedOut) {
      return {
        status: 200,
        body: {
          language: 'java', totalTests: 1, passedTests: 0, failedTests: 1, allPassed: false,
          status: 'TIMEOUT', totalDurationMs: Date.now() - startTime,
          terminalLogs: [`[TIMEOUT] Execution exceeded hard time limit (${maxExecTime}ms). Check for infinite loops!`],
          testOutcomes: [{ index: 1, testCaseName: 'Time Limit Execution', input: 'Runtime', expectedOutput: `Under ${maxExecTime}ms`, actualOutput: 'Execution Timeout', passed: false, durationMs: Date.now() - startTime }],
        },
      };
    }

    const passed = run.success;

    // Server-authoritative completion record (§3.5/§3.6) — written here, by
    // this service, using the real compile+run result it just produced.
    // Non-blocking: never delays or fails the response to the student.
    if (passed && typeof questId === 'string' && questId && uid) {
      persistJavaCompletionServerSide(uid, questId, typeof xp === 'number' ? xp : 120)
        .catch((e) => console.warn('[runJavaJudge] completion persistence rejected:', e && e.message));
    }

    return {
      status: 200,
      body: {
        language: 'java', totalTests: 1, passedTests: passed ? 1 : 0, failedTests: passed ? 0 : 1, allPassed: passed,
        status: passed ? 'SUCCESS' : 'RUNTIME_ERROR', totalDurationMs: Date.now() - startTime,
        terminalLogs: ['⚙️ Javac compilation successful (0 errors).', run.stdout ? `[OUTPUT] ${run.stdout.trim()}` : '[OUTPUT] Program finished with 0 output.', passed ? '[SUCCESS] All automated test assertions passed!' : `[FAIL] ${run.stderr.trim()}`],
        testOutcomes: [{ index: 1, testCaseName: 'Automated Java Test Suite', input: 'Test inputs & assertions', expectedOutput: 'Pass all assertions with 0 errors', actualOutput: passed ? 'Assertion Passed' : run.stderr.slice(0, 150), passed, durationMs: Date.now() - startTime, stdout: run.stdout, error: passed ? undefined : run.stderr }],
      },
    };
  } finally {
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let bodyText = '';
  req.on('data', (chunk) => { bodyText += chunk; });
  req.on('end', async () => {
    try {
      const gated = await requireUser(req);
      if (gated.error) {
        res.writeHead(gated.error.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(gated.error.body));
        return;
      }
      const body = JSON.parse(bodyText || '{}');
      const result = await runJavaJudge(body, gated.user && gated.user.id);
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.body));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        language: 'java', totalTests: 1, passedTests: 0, failedTests: 1, allPassed: false,
        status: 'RUNTIME_ERROR', totalDurationMs: 0,
        terminalLogs: ['[SYSTEM ERROR] ' + (err && err.message || 'Unexpected judge failure')],
        error: err && err.message,
      }));
    }
  });
});

server.listen(PORT, () => console.log(`java-judge listening on :${PORT}`));
