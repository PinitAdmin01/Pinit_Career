// cloud-run/js-judge/server.js
//
// Stage 1, Deno.env closure — real, isolated JavaScript grading judge.
//
// WHY THIS EXISTS: supabase/functions/verify-quest/grading.ts ran submitted
// student code via `eval` inside the SAME Deno isolate that holds
// SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, and QUEST_SIGNING_SECRET (all
// reachable via the `Deno.env` global, which indirect eval does NOT hide —
// only closure variables are hidden by that trick). Concretely: submitted
// code could do `throw new Error(Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"))`
// and read the error message back in the response body.
//
// This service has NO knowledge of Supabase at all — no URL, no keys, no
// secrets of any kind are ever passed to it. It receives {code, testSuite}
// (the test suite is resolved server-side by verify-quest, from its own
// registry — this service is never told a quest ID and never chooses what to
// grade against) and returns {success, message}. verify-quest keeps auth,
// quest lookup, signing, and persistence — this service ONLY executes.
//
// Isolation, in order of what actually stops what:
//   - separate OS process (child_process.execFile), not a same-process eval —
//     a crash, hang, or memory blowup in the child cannot touch this server.
//   - `env: {}` on the child — no environment variables at all, so even if
//     this container process ever had secrets (it doesn't), the child
//     wouldn't inherit them.
//   - Node's `--experimental-permission` with ONLY `--allow-fs-read` for the
//     one script file being run — no `--allow-net`, no `--allow-fs-write`, no
//     `--allow-child-process`. Network, filesystem writes, and further
//     process spawning are denied by the Node runtime itself, not by
//     convention — tested below, not assumed.
//   - `timeout` on execFile — the PARENT kills the child via SIGKILL after
//     the deadline; an infinite loop cannot intercept or prevent this because
//     the kill happens from outside the child's own event loop.
//   - `--max-old-space-size` caps the child's V8 heap.
//   - `maxBuffer` caps captured stdout/stderr size.

const http = require('http');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;
const TIMEOUT_MS = 4000;
const MAX_BUFFER = 64 * 1024;
const MAX_CODE_LENGTH = 50000;

function runJs(code, testSuite) {
  return new Promise((resolve) => {
    let tempDir;
    try {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pinit_js_'));
    } catch (e) {
      resolve({ success: false, status: 'RUNTIME_ERROR', message: 'Judge setup failed: ' + e.message });
      return;
    }
    const scriptPath = path.join(tempDir, 'run.js');

    // The submitted code and the server-owned test suite run in the SAME
    // wrapped scope (matching the existing grading contract: a test suite
    // throws to fail, returns normally to pass) — but now inside a fully
    // separate process with no env and a locked-down permission set, not
    // inside the orchestrator's own process.
    const wrapped = `"use strict";
let __result;
try {
${code}
  try {
${testSuite}
    __result = { success: true };
  } catch (e) {
    __result = { success: false, message: String((e && e.message) || e) };
  }
} catch (e) {
  __result = { success: false, message: "Execution error: " + String((e && e.message) || e) };
}
process.stdout.write(JSON.stringify(__result));
`;

    try {
      fs.writeFileSync(scriptPath, wrapped, 'utf8');
    } catch (e) {
      try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }
      resolve({ success: false, status: 'RUNTIME_ERROR', message: 'Judge setup failed: ' + e.message });
      return;
    }

    const child = execFile(
      process.execPath, // absolute path to this container's own node binary
      [
        '--max-old-space-size=64',
        '--experimental-permission',
        `--allow-fs-read=${scriptPath}`,
        // Deliberately NOT present: --allow-net, --allow-fs-write,
        // --allow-child-process, --allow-worker, --allow-wasi, --allow-addons.
        scriptPath,
      ],
      { timeout: TIMEOUT_MS, maxBuffer: MAX_BUFFER, env: {}, cwd: tempDir },
      (error, stdout, stderr) => {
        try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch { /* ignore */ }

        if (error && error.killed) {
          resolve({ success: false, status: 'TIMEOUT', message: `Execution exceeded ${TIMEOUT_MS}ms (check for infinite loops).` });
          return;
        }
        if (error) {
          resolve({ success: false, status: 'RUNTIME_ERROR', message: (stderr || error.message || '').slice(0, 2000) });
          return;
        }
        try {
          const parsed = JSON.parse(stdout);
          resolve({ success: !!parsed.success, status: parsed.success ? 'SUCCESS' : 'RUNTIME_ERROR', message: parsed.message });
        } catch (e) {
          resolve({ success: false, status: 'RUNTIME_ERROR', message: 'Judge output parse error: ' + String(stdout).slice(0, 500) });
        }
      }
    );

    // Belt-and-suspenders: execFile's own `timeout` option already sends
    // SIGTERM at the deadline; force SIGKILL shortly after in case the child
    // ignores SIGTERM (a permission-denied trap inside the sandboxed process
    // could theoretically swallow it before the runtime enforces the denial).
    const hardKill = setTimeout(() => {
      try { child.kill('SIGKILL'); } catch { /* ignore */ }
    }, TIMEOUT_MS + 500);
    child.on('exit', () => clearTimeout(hardKill));
  });
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
      const body = JSON.parse(bodyText || '{}');
      const { code, testSuite } = body;

      if (typeof code !== 'string' || !code) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, status: 'RUNTIME_ERROR', message: 'Missing code' }));
        return;
      }
      if (typeof testSuite !== 'string' || !testSuite) {
        // This service never chooses what to grade against — no test suite
        // means there is nothing to run it against. Fail closed.
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, status: 'RUNTIME_ERROR', message: 'Missing test suite' }));
        return;
      }
      if (code.length > MAX_CODE_LENGTH) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, status: 'RUNTIME_ERROR', message: 'Source code exceeds size limit' }));
        return;
      }

      const result = await runJs(code, testSuite);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, status: 'RUNTIME_ERROR', message: 'Judge pipeline error: ' + (err && err.message) }));
    }
  });
});

server.listen(PORT, () => console.log(`js-judge listening on :${PORT}`));
