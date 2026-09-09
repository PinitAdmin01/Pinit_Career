// src/lib/code/sandbox/sandboxedIframeRunner.ts
/**
 * ============================================================================
 * PINIT TWO-LAYER DEFENSE ISOLATION HARNESS
 * ============================================================================
 * 
 * Layer 1: Opaque Sandboxed Iframe (Origin / DOM / Storage / CSP Boundary)
 *   - sandbox="allow-scripts" (strictly NO allow-same-origin)
 *   - Opaque null-origin denies localStorage, sessionStorage, document.cookie
 *   - Engine-level CSP: connect-src 'none' natively blocks fetch/XHR/WebSocket/Beacon
 * 
 * Layer 2: Dedicated Root Execution Worker (CPU Execution / Hard Termination Boundary)
 *   - Hostile student code executes ONLY inside a dedicated Web Worker
 *   - Worker constructor neutralized (self.Worker = undefined, worker-src 'none')
 *   - Hard pre-emptive CPU termination via worker.terminate() on timeout (while(true){})
 * 
 * Communication:
 *   - Dedicated MessageChannel private port
 *   - Execution session correlation (requestId + unguessable sessionNonce)
 *   - Output classified as UNTRUSTED CLIENT OBSERVATION (non-authoritative)
 */

import { TestCase, SingleTestOutcome, SuiteExecutionResult } from '../types';

export interface SandboxExecutionOptions {
  functionName?: string;
  testCases?: TestCase[];
  timeoutMs?: number;
}

export interface UntrustedExecutionPayload {
  type?: string;
  requestId: string;
  sessionNonce: string;
  status: 'SUCCESS' | 'RUNTIME_ERROR' | 'TIMEOUT';
  stdout: string;
  stderr: string;
  testOutcomes: SingleTestOutcome[];
  durationMs: number;
  error?: string;
}

/**
 * Executes student JavaScript within the two-layer sandbox (Opaque Iframe + Dedicated Worker).
 * Guaranteed to fail closed with zero fallback to host main-thread evaluators.
 */
export async function executeInTwoLayerSandbox(
  code: string,
  options?: SandboxExecutionOptions
): Promise<SuiteExecutionResult> {
  const startTime = Date.now();
  const fnName = options?.functionName || 'solution';
  const testCases = options?.testCases || [{ input: '[]', output: 'true', name: 'Default Verification' }];
  const timeoutMs = options?.timeoutMs || 4000;

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      language: 'javascript',
      totalTests: testCases.length,
      passedTests: 0,
      failedTests: testCases.length,
      allPassed: false,
      status: 'RUNTIME_ERROR',
      totalDurationMs: 0,
      terminalLogs: ['[SANDBOX ERROR] In-browser sandbox requires browser DOM environment.'],
      testOutcomes: [],
      error: 'BROWSER_ENVIRONMENT_REQUIRED'
    };
  }

  const requestId = crypto.randomUUID();
  const sessionNonce = crypto.randomUUID();

  return new Promise<SuiteExecutionResult>((resolve) => {
    let isSettled = false;
    let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    let iframe: HTMLIFrameElement | null = null;
    let channel: MessageChannel | null = null;

    const cleanup = () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      }
      if (channel) {
        try {
          channel.port1.close();
          channel.port2.close();
        } catch {}
        channel = null;
      }
      if (iframe && iframe.parentNode) {
        try {
          // Posting hard terminate command before physical removal
          iframe.contentWindow?.postMessage({ type: 'PINIT_HARD_TERMINATE', sessionNonce }, '*');
        } catch {}
        try {
          iframe.parentNode.removeChild(iframe);
        } catch {}
        iframe = null;
      }
    };

    const failClosed = (errorMsg: string, terminalLog?: string) => {
      if (isSettled) return;
      isSettled = true;
      const duration = Date.now() - startTime;
      cleanup();

      resolve({
        language: 'javascript',
        totalTests: testCases.length,
        passedTests: 0,
        failedTests: testCases.length,
        allPassed: false,
        status: 'RUNTIME_ERROR',
        totalDurationMs: duration,
        terminalLogs: [
          `[SANDBOX SECURITY] Execution halted: ${errorMsg}`,
          terminalLog || `[POLICY] Failed closed. Zero fallback to host main thread.`
        ],
        testOutcomes: testCases.map((tc, idx) => ({
          index: idx + 1,
          testCaseName: tc.name || `Test Case ${idx + 1}`,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: 'EXECUTION_TERMINATED',
          passed: false,
          error: errorMsg,
          durationMs: duration
        })),
        error: errorMsg
      });
    };

    // Hard CPU Timeout Handler: physically terminates worker and tears down iframe
    timeoutHandle = setTimeout(() => {
      failClosed(
        `Execution exceeded hard CPU time budget limit of ${timeoutMs}ms. Dedicated worker terminated.`,
        `[HARD TIMEOUT] worker.terminate() invoked at browser engine level.`
      );
    }, timeoutMs);

    try {
      channel = new MessageChannel();
      iframe = document.createElement('iframe');

      // Layer 1: Opaque null-origin sandbox attributes (strictly NO allow-same-origin)
      iframe.sandbox.add('allow-scripts');
      iframe.style.display = 'none';
      iframe.setAttribute('aria-hidden', 'true');

      // Restrictive CSP inside iframe document (connect-src 'none' blocks all network APIs)
      const iframeSrcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'; img-src 'none'; style-src 'none'; font-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';">
        </head>
        <body>
          <script>
            (function() {
              'use strict';
              let activeWorker = null;

              // Worker source code: runs hostile student code in a pure Web Worker realm
              const workerScript = \`
                'use strict';
                // Complete execution tree control: neutralize secondary execution contexts
                self.Worker = undefined;
                self.SharedWorker = undefined;
                self.BroadcastChannel = undefined;
                self.importScripts = undefined;

                // Capability containment: block IndexedDB & CacheStorage in worker realm
                try {
                  if (typeof self.indexedDB !== 'undefined') {
                    self.indexedDB.open = function() {
                      throw new Error('SecurityError: IndexedDB access is disabled in the student sandbox realm.');
                    };
                  }
                } catch {}

                try {
                  if (typeof self.caches !== 'undefined') {
                    self.caches.open = function() {
                      return Promise.reject(new Error('SecurityError: CacheStorage access is disabled in the student sandbox realm.'));
                    };
                  }
                } catch {}

                let logs = [];
                let errLogs = [];
                const MAX_LOG_LINES = 100;
                const MAX_LOG_CHAR = 2000;
                const origLog = console.log;
                const origErr = console.error;
                console.log = function(...args) {
                  if (logs.length < MAX_LOG_LINES) {
                    logs.push(args.map(String).join(' ').slice(0, MAX_LOG_CHAR));
                  }
                };
                console.error = function(...args) {
                  if (errLogs.length < MAX_LOG_LINES) {
                    errLogs.push(args.map(String).join(' ').slice(0, MAX_LOG_CHAR));
                  }
                };

                self.onmessage = function(e) {
                  const data = e.data;
                  if (!data || data.type !== 'RUN_CODE') return;

                  const code = data.code;
                  const fnName = data.fnName;
                  const testCases = data.testCases || [];
                  const outcomes = [];
                  let allPassed = true;
                  let runtimeError = null;

                  try {
                    // Evaluate student solution in isolated worker scope
                    const compiledFn = new Function(code + '\\nreturn ' + fnName + ';')();
                    if (typeof compiledFn !== 'function') {
                      throw new Error("Function '" + fnName + "' is not defined in solution.");
                    }

                    for (let i = 0; i < testCases.length; i++) {
                      const tc = testCases[i];
                      const tStart = Date.now();
                      let args = [];
                      try {
                        args = JSON.parse('[' + (tc.input || '').replace(/^\\(|\\)$/g, '') + ']');
                      } catch {
                        args = [tc.input];
                      }

                      try {
                        const actual = compiledFn(...args);
                        const actualStr = String(actual);
                        const passed = actualStr.trim() === String(tc.output).trim();
                        if (!passed) allPassed = false;
                        outcomes.push({
                          index: i + 1,
                          testCaseName: tc.name || ('Test ' + (i + 1)),
                          input: tc.input,
                          expectedOutput: tc.output,
                          actualOutput: actualStr,
                          passed: passed,
                          durationMs: Date.now() - tStart
                        });
                      } catch (execErr) {
                        allPassed = false;
                        outcomes.push({
                          index: i + 1,
                          testCaseName: tc.name || ('Test ' + (i + 1)),
                          input: tc.input,
                          expectedOutput: tc.output,
                          actualOutput: 'RUNTIME_ERROR',
                          passed: false,
                          error: execErr && execErr.message ? execErr.message : String(execErr),
                          durationMs: Date.now() - tStart
                        });
                      }
                    }
                  } catch (compileErr) {
                    runtimeError = compileErr && compileErr.message ? compileErr.message : String(compileErr);
                  }

                  self.postMessage({
                    type: 'WORKER_RESULT',
                    outcomes: outcomes,
                    allPassed: allPassed && !runtimeError,
                    stdout: logs.join('\\n'),
                    stderr: errLogs.join('\\n'),
                    error: runtimeError
                  });
                };
              \`;

              // MessageChannel receiver from parent
              window.addEventListener('message', function(evt) {
                if (evt.data && evt.data.type === 'PINIT_HARD_TERMINATE') {
                  if (activeWorker) {
                    activeWorker.terminate();
                    activeWorker = null;
                  }
                  return;
                }

                if (evt.data && evt.data.type === 'PINIT_INIT_CHANNEL' && evt.ports && evt.ports[0]) {
                  const port = evt.ports[0];
                  const sessionNonce = evt.data.sessionNonce;

                  port.onmessage = function(msgEvt) {
                    const req = msgEvt.data;
                    if (!req || req.sessionNonce !== sessionNonce || req.type !== 'PINIT_EXECUTE_REQUEST') {
                      return;
                    }

                    try {
                      const blob = new Blob([workerScript], { type: 'application/javascript' });
                      const workerUrl = URL.createObjectURL(blob);
                      activeWorker = new Worker(workerUrl);

                      // CRITICAL BROWSER-ENGINE CSP LOCKDOWN:
                      // Enforce worker-src 'none' via subsequent meta tag.
                      // Per W3C CSP Level 3, subsequent policies restrict further.
                      // Any subsequent attempt by any context to create a worker is blocked by browser engine.
                      try {
                        const metaLock = document.createElement('meta');
                        metaLock.httpEquiv = 'Content-Security-Policy';
                        metaLock.content = "worker-src 'none';";
                        document.head.appendChild(metaLock);
                      } catch {}

                      activeWorker.onmessage = function(wEvt) {
                        URL.revokeObjectURL(workerUrl);
                        const res = wEvt.data;
                        port.postMessage({
                          type: 'PINIT_EXECUTE_RESPONSE',
                          requestId: req.requestId,
                          sessionNonce: sessionNonce,
                          status: res.error ? 'RUNTIME_ERROR' : (res.allPassed ? 'SUCCESS' : 'PARTIAL_PASS'),
                          stdout: res.stdout || '',
                          stderr: res.stderr || '',
                          testOutcomes: res.outcomes || [],
                          error: res.error
                        });
                        activeWorker.terminate();
                        activeWorker = null;
                      };

                      activeWorker.onerror = function(wErr) {
                        URL.revokeObjectURL(workerUrl);
                        port.postMessage({
                          type: 'PINIT_EXECUTE_RESPONSE',
                          requestId: req.requestId,
                          sessionNonce: sessionNonce,
                          status: 'RUNTIME_ERROR',
                          stdout: '',
                          stderr: wErr.message || 'Worker runtime error',
                          testOutcomes: [],
                          error: wErr.message || 'Worker initialization failed'
                        });
                        if (activeWorker) {
                          activeWorker.terminate();
                          activeWorker = null;
                        }
                      };

                      activeWorker.postMessage({
                        type: 'RUN_CODE',
                        code: req.code,
                        fnName: req.fnName,
                        testCases: req.testCases
                      });
                    } catch (workerInitErr) {
                      port.postMessage({
                        type: 'PINIT_EXECUTE_RESPONSE',
                        requestId: req.requestId,
                        sessionNonce: sessionNonce,
                        status: 'RUNTIME_ERROR',
                        stdout: '',
                        stderr: workerInitErr.message || 'Failed to spawn worker',
                        testOutcomes: [],
                        error: workerInitErr.message
                      });
                    }
                  };
                }
              });
            })();
          <\/script>
        </body>
        </html>
      `;

      iframe.srcdoc = iframeSrcDoc;

      channel.port1.onmessage = (event) => {
        const payload: UntrustedExecutionPayload = event.data;
        if (!payload || typeof payload !== 'object') {
          failClosed('Malformed sandbox response payload received.');
          return;
        }

        // Execution session correlation check
        if (payload.requestId !== requestId || payload.sessionNonce !== sessionNonce) {
          failClosed('Security session correlation mismatch: rejected unauthorized postMessage.');
          return;
        }

        if (payload.type !== 'PINIT_EXECUTE_RESPONSE') {
          failClosed(`Unexpected message type received: ${(payload as any).type}`);
          return;
        }

        // Oversized payload protection (Max 100 KB)
        try {
          if (JSON.stringify(payload).length > 102400) {
            failClosed('Oversized sandbox payload rejected (exceeded 100KB limit).');
            return;
          }
        } catch {
          failClosed('Malformed non-serializable response payload received.');
          return;
        }

        if (isSettled) return;
        isSettled = true;
        const totalDuration = Date.now() - startTime;
        cleanup();

        const logs = [
          `[SANDBOX COORDINATOR] Execution completed cleanly in dedicated worker (${totalDuration}ms).`,
          `[SECURITY NOTICE] Sandbox output is UNTRUSTED CLIENT OBSERVATION (Formative only).`
        ];
        if (payload.stdout) logs.push(`stdout: ${payload.stdout}`);
        if (payload.stderr) logs.push(`stderr: ${payload.stderr}`);

        const allPassed = payload.status === 'SUCCESS';

        resolve({
          language: 'javascript',
          totalTests: testCases.length,
          passedTests: payload.testOutcomes.filter(t => t.passed).length,
          failedTests: payload.testOutcomes.filter(t => !t.passed).length,
          allPassed,
          status: payload.status as any,
          totalDurationMs: totalDuration,
          terminalLogs: logs,
          testOutcomes: payload.testOutcomes,
          error: payload.error
        });
      };

      iframe.onload = () => {
        if (!iframe?.contentWindow || !channel) {
          failClosed('Iframe initialization failed: contentWindow unavailable.');
          return;
        }

        // Initialize MessageChannel with the coordinator iframe
        iframe.contentWindow.postMessage(
          { type: 'PINIT_INIT_CHANNEL', sessionNonce },
          '*',
          [channel.port2]
        );

        // Dispatch execution request over the private MessageChannel port
        channel.port1.postMessage({
          type: 'PINIT_EXECUTE_REQUEST',
          requestId,
          sessionNonce,
          code,
          fnName,
          testCases,
          timeoutMs
        });
      };

      document.body.appendChild(iframe);
    } catch (err: any) {
      failClosed(`Sandbox bootstrap exception: ${err?.message || String(err)}`);
    }
  });
}
