/**
 * Runs Python in the browser for lessons, using Pyodide (real CPython compiled to WebAssembly)
 * served from /pyodide/ on PinIT's own site. The first run downloads about 13 MB and takes a few
 * seconds; later runs are fast. Code that runs too long (an endless loop) is stopped and the
 * worker is restarted.
 */
export interface PythonRunResult {
  success: boolean;
  stdout: string;
  error?: string;
  durationMs: number;
}

let worker: Worker | null = null;
let nextId = 1;

function getWorker(): Worker {
  if (!worker) worker = new Worker('/python-worker.js');
  return worker;
}

function resetWorker() {
  worker?.terminate();
  worker = null;
}

export function runPythonInBrowser(code: string, timeoutMs = 20000): Promise<PythonRunResult> {
  const started = Date.now();
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    return Promise.resolve({ success: false, stdout: '', error: 'Python can only run in the browser.', durationMs: 0 });
  }
  const id = nextId++;
  const w = getWorker();
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      w.removeEventListener('message', onMessage);
      resetWorker();
      resolve({ success: false, stdout: '', error: `Stopped after ${Math.round(timeoutMs / 1000)} seconds. Is there an endless loop?`, durationMs: Date.now() - started });
    }, timeoutMs);
    function onMessage(event: MessageEvent) {
      const data = event.data || {};
      if (data.id !== id) return;
      clearTimeout(timer);
      w.removeEventListener('message', onMessage);
      resolve({ success: Boolean(data.ok), stdout: data.stdout || '', error: data.error, durationMs: Date.now() - started });
    }
    w.addEventListener('message', onMessage);
    w.addEventListener('error', () => {
      clearTimeout(timer);
      resetWorker();
      resolve({ success: false, stdout: '', error: 'Python could not start. Check your internet connection and try again.', durationMs: Date.now() - started });
    }, { once: true });
    w.postMessage({ id, code });
  });
}
