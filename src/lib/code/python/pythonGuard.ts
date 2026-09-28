/**
 * Python APIs the server sandbox (/api/code/run-python) refuses to run, checked across the
 * student's code AND the test suite. Shared with tests so every course task is known to pass it.
 */
export const FORBIDDEN_PYTHON_PATTERNS: RegExp[] = [
  /\bos\./,                  // Any os module usage (os.environ, os.system, os.popen, etc.)
  /\bimport\s+os\b/,         // import os
  /\bfrom\s+os\b/,           // from os import ...
  /sys\./,                   // sys module access (sys.modules, etc.)
  /\bimport\s+sys\b/,        // import sys
  /\bfrom\s+sys\b/,          // from sys import ...
  /subprocess/,              // Subprocess spawning
  /__import__/,              // Dynamic import (bypass restrictions)
  /importlib/,               // Import library (dynamic loading)
  /eval\s*\(/,               // Dynamic code evaluation
  /exec\s*\(/,               // Code execution
  /compile\s*\(/,            // Code compilation
  /\bopen\s*\(/,             // Any file access
  /\bpathlib\b/,             // Pathlib filesystem access
  /\bPath\s*\(/,             // Path(...) construction
  /\bio\./,                  // io module (io.open, etc.)
  /\bimport\s+io\b/,         // import io
  /\bfrom\s+io\b/,           // from io import ...
  /shutil/,                  // File manipulation
  /socket/,                  // Raw network socket
  /urllib/,                  // HTTP requests
  /requests/,                // HTTP requests library
  /http\.client/,            // Python http.client exfiltration
  /\bhttp\./,                // Any http module usage
  /httpx/,                   // Async HTTP
  /aiohttp/,                 // Async HTTP
  /ctypes/,                  // C library interop (bypass sandbox)
  /__subclasses__/,          // Class hierarchy traversal / sandbox escape
  /__builtins__/,            // Builtin dictionary override
  /ftplib|telnetlib/,        // Legacy network protocols
  /\bpty\b|\bposix\b|\bfcntl\b/, // Low-level OS/process interop
  /\bexit\s*\(/,             // Early exit exploit
  /\bquit\s*\(/,             // Early quit exploit
  /\braise\s+SystemExit\b/,  // Early SystemExit exploit
  /sys\.exit/,               // sys.exit exploit
  /os\._exit/,               // os._exit exploit
];

export function findForbiddenPython(source: string): RegExp | null {
  return FORBIDDEN_PYTHON_PATTERNS.find((pattern) => pattern.test(source)) ?? null;
}
