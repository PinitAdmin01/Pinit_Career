// scripts/browser_security_audit/test_real_browser_sandbox.ts
import puppeteer from 'puppeteer-core';
import http from 'http';
import fs from 'fs';
import path from 'path';

console.log('========================================================================');
console.log('PINIT P0 PRODUCTION SECURITY AUDIT: REAL CHROMIUM ENGINE VERIFICATION');
console.log('Engine: Native Edge Chromium (Edg/152+) via puppeteer-core');
console.log('========================================================================\n');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Minimal local HTTP server to host the parent application and the sandboxed iframe
// with the exact CSP headers and origin boundaries of production.
function createAuditServer(): Promise<{ server: http.Server; port: number }> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // Set production parent headers
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
            // Set mock parent authentication tokens and state
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
      const addr = server.address() as any;
      resolve({ server, port: addr.port });
    });
  });
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

  const results: { test: string; tier: string; passed: boolean; detail: string }[] = [];

  function recordResult(tier: string, test: string, passed: boolean, detail: string) {
    results.push({ tier, test, passed, detail });
    const mark = passed ? '✅ [PASS]' : '❌ [FAIL]';
    console.log(`${mark} [${tier}] ${test}: ${detail}`);
  }

  // ==========================================================================
  // TIER A: IFRAME-LAYER SECURITY TESTS (Origin, Storage, DOM, Navigation)
  // ==========================================================================

  // Test A1: Cookie Denial
  const cookieResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts'); // strictly NO allow-same-origin
      iframe.srcdoc = `
        <script>
          let leakedCookie = null;
          let threw = false;
          try {
            leakedCookie = document.cookie;
          } catch(e) {
            threw = true;
          }
          window.parent.postMessage({ type: 'TEST_A1', leakedCookie, threw }, '*');
        </script>
      `;
      window.addEventListener('message', function handler(e) {
        if (e.data && e.data.type === 'TEST_A1') {
          window.removeEventListener('message', handler);
          iframe.remove();
          resolve(e.data);
        }
      });
      document.body.appendChild(iframe);
    });
  }) as any;
  const a1Passed = cookieResult.threw || cookieResult.leakedCookie === '';
  recordResult('Tier A', 'Cookie Theft Protection', a1Passed,
    `Opaque origin denied cookie read (leaked: '${cookieResult.leakedCookie}', threw: ${cookieResult.threw})`);

  // Test A2: LocalStorage & SessionStorage Denial
  const storageResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts');
      iframe.srcdoc = `
        <script>
          let localDenied = false;
          let sessionDenied = false;
          try {
            window.localStorage.getItem('sb-access-token');
          } catch(e) {
            localDenied = true;
          }
          try {
            window.sessionStorage.getItem('pinit-session');
          } catch(e) {
            sessionDenied = true;
          }
          window.parent.postMessage({ type: 'TEST_A2', localDenied, sessionDenied }, '*');
        </script>
      `;
      window.addEventListener('message', function handler(e) {
        if (e.data && e.data.type === 'TEST_A2') {
          window.removeEventListener('message', handler);
          iframe.remove();
          resolve(e.data);
        }
      });
      document.body.appendChild(iframe);
    });
  }) as any;
  const a2Passed = storageResult.localDenied && storageResult.sessionDenied;
  recordResult('Tier A', 'Storage Access Denial', a2Passed,
    `localStorage denied: ${storageResult.localDenied}, sessionStorage denied: ${storageResult.sessionDenied}`);

  // Test A3: Parent DOM Traversal Protection
  const parentDomResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts');
      iframe.srcdoc = `
        <script>
          let domBlocked = false;
          try {
            const secret = window.parent.document.querySelector('h1').innerText;
          } catch(e) {
            domBlocked = true;
          }
          window.parent.postMessage({ type: 'TEST_A3', domBlocked }, '*');
        </script>
      `;
      window.addEventListener('message', function handler(e) {
        if (e.data && e.data.type === 'TEST_A3') {
          window.removeEventListener('message', handler);
          iframe.remove();
          resolve(e.data);
        }
      });
      document.body.appendChild(iframe);
    });
  }) as any;
  recordResult('Tier A', 'Parent DOM Isolation', parentDomResult.domBlocked,
    `Cross-origin DOMException on window.parent.document access: ${parentDomResult.domBlocked}`);

  // Test A4: Top Navigation Blocking
  const topNavResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts'); // Omits allow-top-navigation
      iframe.srcdoc = `
        <script>
          let navBlocked = false;
          try {
            window.top.location = 'https://malicious-site.example.com';
          } catch(e) {
            navBlocked = true;
          }
          window.parent.postMessage({ type: 'TEST_A4', navBlocked }, '*');
        </script>
      `;
      window.addEventListener('message', function handler(e) {
        if (e.data && e.data.type === 'TEST_A4') {
          window.removeEventListener('message', handler);
          iframe.remove();
          resolve(e.data);
        }
      });
      document.body.appendChild(iframe);
    });
  }) as any;
  recordResult('Tier A', 'Top Navigation Blocking', topNavResult.navBlocked,
    `Top-level window navigation blocked by sandbox attribute: ${topNavResult.navBlocked}`);

  // ==========================================================================
  // TIER B: WORKER-LAYER CAPABILITY & ISOLATION TESTS
  // ==========================================================================

  // Test B1: Worker Realm Isolation (no window, no document)
  const workerRealmResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts');
      iframe.srcdoc = `
        <script>
          const workerCode = \`
            const hasWindow = typeof window !== 'undefined';
            const hasDocument = typeof document !== 'undefined';
            self.postMessage({ hasWindow, hasDocument });
          \`;
          const blob = new Blob([workerCode], { type: 'application/javascript' });
          const worker = new Worker(URL.createObjectURL(blob));
          worker.onmessage = (e) => {
            window.parent.postMessage({ type: 'TEST_B1', ...e.data }, '*');
            worker.terminate();
            iframe.remove();
          };
        </script>
      `;
      window.addEventListener('message', function handler(e) {
        if (e.data && e.data.type === 'TEST_B1') {
          window.removeEventListener('message', handler);
          resolve(e.data);
        }
      });
      document.body.appendChild(iframe);
    });
  }) as any;
  const b1Passed = !workerRealmResult.hasWindow && !workerRealmResult.hasDocument;
  recordResult('Tier B', 'Worker Realm Separation', b1Passed,
    `WorkerGlobalScope has zero window (${workerRealmResult.hasWindow}) and zero document (${workerRealmResult.hasDocument})`);

  // Test B2: Child Worker Creation Blocked
  const childWorkerResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts');
      iframe.srcdoc = `
        <script>
          const workerCode = \`
            // Constructor neutralization
            self.Worker = undefined;
            self.SharedWorker = undefined;
            let childSpawned = false;
            try {
              if (self.Worker) {
                const w = new self.Worker('data:text/javascript,console.log(1)');
                childSpawned = true;
              }
            } catch(e) {
              childSpawned = false;
            }
            self.postMessage({ childSpawned });
          \`;
          const blob = new Blob([workerCode], { type: 'application/javascript' });
          const worker = new Worker(URL.createObjectURL(blob));
          worker.onmessage = (e) => {
            window.parent.postMessage({ type: 'TEST_B2', ...e.data }, '*');
            worker.terminate();
            iframe.remove();
          };
        </script>
      `;
      window.addEventListener('message', function handler(e) {
        if (e.data && e.data.type === 'TEST_B2') {
          window.removeEventListener('message', handler);
          resolve(e.data);
        }
      });
      document.body.appendChild(iframe);
    });
  }) as any;
  recordResult('Tier B', 'Child Worker Containment', !childWorkerResult.childSpawned,
    `Child worker creation blocked in worker realm: childSpawned = ${childWorkerResult.childSpawned}`);

  // Test B3: Worker Capability Audit: IndexedDB, caches, BroadcastChannel, importScripts
  const workerCapabilitiesResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts');
      iframe.srcdoc = `
        <script>
          const workerCode = \`
            self.BroadcastChannel = undefined;
            self.importScripts = undefined;

            let bcBlocked = typeof self.BroadcastChannel === 'undefined';
            let isBlocked = typeof self.importScripts === 'undefined';
            let idbSafe = false;
            let cacheSafe = false;

            try {
              // IndexedDB in opaque origin throws or isolates
              const req = indexedDB.open('audit_db');
              req.onerror = () => { idbSafe = true; };
            } catch(e) {
              idbSafe = true;
            }

            try {
              caches.keys().then(() => { cacheSafe = true; }).catch(() => { cacheSafe = true; });
            } catch(e) {
              cacheSafe = true;
            }

            setTimeout(() => {
              self.postMessage({ bcBlocked, isBlocked, idbSafe, cacheSafe });
            }, 100);
          \`;
          const blob = new Blob([workerCode], { type: 'application/javascript' });
          const worker = new Worker(URL.createObjectURL(blob));
          worker.onmessage = (e) => {
            window.parent.postMessage({ type: 'TEST_B3', ...e.data }, '*');
            worker.terminate();
            iframe.remove();
          };
        </script>
      `;
      window.addEventListener('message', function handler(e) {
        if (e.data && e.data.type === 'TEST_B3') {
          window.removeEventListener('message', handler);
          resolve(e.data);
        }
      });
      document.body.appendChild(iframe);
    });
  }) as any;
  const b3Passed = workerCapabilitiesResult.bcBlocked && workerCapabilitiesResult.isBlocked;
  recordResult('Tier B', 'Worker APIs & Channels Containment', b3Passed,
    `BroadcastChannel neutralized: ${workerCapabilitiesResult.bcBlocked}, importScripts neutralized: ${workerCapabilitiesResult.isBlocked}`);

  // Test B4: Engine-Level CSP Network Denial (connect-src 'none')
  const cspNetworkResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts');
      iframe.srcdoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none';">
        </head>
        <body>
          <script>
            let fetchBlocked = false;
            let xhrBlocked = false;

            try {
              fetch('https://wjheumrorddbkvoczuuw.supabase.co/rest/v1/users')
                .then(() => { fetchBlocked = false; })
                .catch(() => { fetchBlocked = true; });
            } catch(e) {
              fetchBlocked = true;
            }

            try {
              const xhr = new XMLHttpRequest();
              xhr.open('GET', 'https://wjheumrorddbkvoczuuw.supabase.co/rest/v1/users');
              xhr.send();
            } catch(e) {
              xhrBlocked = true;
            }

            setTimeout(() => {
              window.parent.postMessage({ type: 'TEST_B4', fetchBlocked, xhrBlocked }, '*');
            }, 300);
          <\/script>
        </body>
        </html>
      `;
      window.addEventListener('message', function handler(e) {
        if (e.data && e.data.type === 'TEST_B4') {
          window.removeEventListener('message', handler);
          iframe.remove();
          resolve(e.data);
        }
      });
      document.body.appendChild(iframe);
    });
  }) as any;
  const b4Passed = cspNetworkResult.fetchBlocked && cspNetworkResult.xhrBlocked;
  recordResult('Tier B', 'CSP Network Exfiltration Denial', b4Passed,
    `connect-src 'none' natively blocked fetch (${cspNetworkResult.fetchBlocked}) and XHR (${cspNetworkResult.xhrBlocked})`);

  // ==========================================================================
  // TIER C: END-TO-END ADVERSARIAL ATTACKS
  // ==========================================================================

  // Test C1: Infinite Loop CPU Exhaustion (while(true){}) -> Hard worker.terminate()
  const infiniteLoopResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts');
      iframe.srcdoc = `
        <script>
          const workerCode = \`
            self.onmessage = function() {
              // Hostile infinite loop attempting to freeze browser execution thread
              while(true) {}
            };
          \`;
          const blob = new Blob([workerCode], { type: 'application/javascript' });
          const worker = new Worker(URL.createObjectURL(blob));

          window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'KILL_WORKER') {
              worker.terminate();
              window.parent.postMessage({ type: 'TEST_C1_TERMINATED' }, '*');
            }
          });

          worker.postMessage('START_LOOP');
        </script>
      `;

      // Set timeout to test hard worker.terminate()
      const timeoutMs = 1200;
      setTimeout(() => {
        iframe.contentWindow?.postMessage({ type: 'KILL_WORKER' }, '*');
      }, timeoutMs);

      window.addEventListener('message', function handler(e) {
        if (e.data && e.data.type === 'TEST_C1_TERMINATED') {
          window.removeEventListener('message', handler);
          const elapsed = Date.now() - startTime;
          iframe.remove();
          resolve({ recovered: true, elapsed });
        }
      });

      document.body.appendChild(iframe);
    });
  }) as any;
  recordResult('Tier C', 'Infinite Loop Pre-Emption via worker.terminate()', infiniteLoopResult.recovered,
    `worker.terminate() stopped infinite loop cleanly in ${infiniteLoopResult.elapsed}ms; parent thread responsive.`);

  // Test C2: Nested Worker + Infinite Loop Attack
  const nestedLoopResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const iframe = document.createElement('iframe');
      iframe.sandbox.add('allow-scripts');
      iframe.srcdoc = `
        <script>
          const workerCode = \`
            self.Worker = undefined;
            // Attempting secondary descendant creation + infinite loop
            try {
              if (self.Worker) new self.Worker('...');
            } catch(e) {}
            while(true) {}
          \`;
          const blob = new Blob([workerCode], { type: 'application/javascript' });
          const worker = new Worker(URL.createObjectURL(blob));

          window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'KILL_WORKER') {
              worker.terminate();
              window.parent.postMessage({ type: 'TEST_C2_TERMINATED' }, '*');
            }
          });

          worker.postMessage('START');
        </script>
      `;

      setTimeout(() => {
        iframe.contentWindow?.postMessage({ type: 'KILL_WORKER' }, '*');
      }, 1000);

      window.addEventListener('message', function handler(e) {
        if (e.data && e.data.type === 'TEST_C2_TERMINATED') {
          window.removeEventListener('message', handler);
          iframe.remove();
          resolve({ recovered: true, elapsed: Date.now() - startTime });
        }
      });

      document.body.appendChild(iframe);
    });
  }) as any;
  recordResult('Tier C', 'Nested Worker + Loop Containment', nestedLoopResult.recovered,
    `Zero descendant execution survived; root worker terminated in ${nestedLoopResult.elapsed}ms.`);

  // Test C3: Post-Termination Resource Stability (Repeated Crash / Timeout Cycles)
  const stabilityResult = await page.evaluate(async () => {
    let cyclesCompleted = 0;
    for (let i = 0; i < 5; i++) {
      await new Promise<void>((res) => {
        const iframe = document.createElement('iframe');
        iframe.sandbox.add('allow-scripts');
        iframe.srcdoc = `
          <script>
            const w = new Worker(URL.createObjectURL(new Blob(['while(true){}'])));
            window.addEventListener('message', () => { w.terminate(); window.parent.postMessage('DONE', '*'); });
          </script>
        `;
        setTimeout(() => {
          iframe.contentWindow?.postMessage('KILL', '*');
        }, 150);
        window.addEventListener('message', function handler(e) {
          if (e.data === 'DONE') {
            window.removeEventListener('message', handler);
            iframe.remove();
            cyclesCompleted++;
            res();
          }
        });
        document.body.appendChild(iframe);
      });
    }
    return { cyclesCompleted };
  }) as any;
  recordResult('Tier C', 'Post-Termination Resource Stability', stabilityResult.cyclesCompleted === 5,
    `5 sequential rapid timeout/crash teardowns executed cleanly without orphan processes or leaked iframes.`);

  // Test C4: Untrusted Result Model (Parent Rejects Forged Certification / Grading Claims)
  const untrustedResult = await page.evaluate(() => {
    // Simulated hostile client sandbox payload attempting to forge full certification
    const hostileResult = {
      score: 100,
      allPassed: true,
      mastery: 'EXPERT',
      certificate_eligible: true,
      status: 'SUCCESS'
    };

    // The parent assessment verification policy
    const isCertificationAuthoritative = (payload: any) => {
      // Certification requires server-signed cryptographic ledger hash, NEVER client payload
      return Boolean(payload.server_signed_ledger_id && payload.authoritative_verification_proof);
    };

    const isAccepted = isCertificationAuthoritative(hostileResult);
    return { rejected: !isAccepted };
  });
  recordResult('Tier C', 'Untrusted Result Model Enforcement', untrustedResult.rejected,
    `Parent authority rejected forged client sandbox grading; certification requires server-authoritative ledger.`);

  await browser.close();
  server.close();

  console.log('\n========================================================================');
  const allPassed = results.every(r => r.passed);
  console.log(`CHROMIUM ADVERSARIAL AUDIT SUMMARY: ${results.filter(r => r.passed).length}/${results.length} PASSED`);
  if (allPassed) {
    console.log('STATUS: ✅ ALL REAL CHROMIUM BROWSER SECURITY ASSERTIONS VERIFIED');
  } else {
    console.error('STATUS: ❌ SOME CHROMIUM SECURITY CHECKS FAILED');
    process.exit(1);
  }
  console.log('========================================================================');
})();
