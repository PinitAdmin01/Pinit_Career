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
  /\binspect\b/,             // Inspection module / stack walking
  /_getframe/,               // Frame inspection (sys._getframe)
  /\bf_back\b/,              // Frame back-pointer traversal
  /\bf_globals\b/,           // Frame globals access
  /\bf_code\b/,              // Frame code object access
  /\bco_consts\b/,           // Bytecode constants introspection
  /__main__/,                // Main module namespace access
  /__loader__/,              // Module loader access
  /\blinecache\b/,           // Source file cache inspection
  /\bbuiltins\b/,            // Builtins module access
  /\bgetattr\b/,             // Dynamic attribute access
  /\bSystemExit\b/,          // Early termination exploit
  /\bexit\b/,                // Process exit exploit
  /\bquit\b/,                // Process quit exploit
  /__eq__/,                  // Always-equal assertion cheat
  /__ne__/,                  // Comparison operator override
  /__class__/,               // Metaclass / class traversal
];

export function findForbiddenPython(source: string): RegExp | null {
  return FORBIDDEN_PYTHON_PATTERNS.find((pattern) => pattern.test(source)) ?? null;
}
