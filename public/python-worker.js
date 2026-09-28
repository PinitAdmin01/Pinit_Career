/* Runs student Python in the browser with Pyodide (self-hosted in /pyodide/, see
 * scripts/utils/copy-pyodide.cjs). One run at a time. The page terminates this worker on a
 * timeout (for example an endless loop) and starts a new one. */
/* global importScripts, loadPyodide */
importScripts('/pyodide/pyodide.js');

let pyodideReady = null;

function getPyodide() {
  if (!pyodideReady) {
    pyodideReady = loadPyodide({ indexURL: '/pyodide/' });
  }
  return pyodideReady;
}

self.onmessage = async (event) => {
  const { id, code } = event.data || {};
  const out = [];
  try {
    const pyodide = await getPyodide();
    pyodide.setStdout({ batched: (line) => out.push(line) });
    pyodide.setStderr({ batched: (line) => out.push(line) });
    // A fresh namespace for every run, so one run's variables never leak into the next.
    const globals = pyodide.globals.get('dict')();
    globals.set('__name__', '__main__');
    try {
      await pyodide.runPythonAsync(code, { globals });
    } finally {
      globals.destroy();
    }
    self.postMessage({ id, ok: true, stdout: out.join('\n') });
  } catch (err) {
    const message = String((err && err.message) || err);
    // Keep only the useful last line of a Python traceback, e.g. "NameError: name 'x' is not defined".
    const lines = message.trim().split('\n');
    self.postMessage({ id, ok: false, stdout: out.join('\n'), error: lines[lines.length - 1] || message });
  }
};
