/**
 * React runtime bundle loader (CHK-3 / W-04).
 * Loads public/sandbox/react-runtime.js for browser and Node environments.
 * Independent of esbuild / compileTs so client webpack bundles stay clean.
 */

let cachedRuntimeCode: string | null = null;

/**
 * Returns the bundled React runtime code as a string.
 * Loads /sandbox/react-runtime.js in the browser or reads public/sandbox/react-runtime.js in Node.
 */
export async function getReactRuntime(): Promise<string> {
  if (cachedRuntimeCode) return cachedRuntimeCode;

  if (typeof window !== 'undefined') {
    const res = await fetch('/sandbox/react-runtime.js');
    if (!res.ok) {
      throw new Error(`Failed to load React runtime from /sandbox/react-runtime.js (${res.status})`);
    }
    cachedRuntimeCode = await res.text();
    return cachedRuntimeCode!;
  }

  // Node environment
  const fs = await import('fs');
  const path = await import('path');
  const runtimePath = path.resolve(process.cwd(), 'public/sandbox/react-runtime.js');
  cachedRuntimeCode = fs.readFileSync(runtimePath, 'utf8');
  return cachedRuntimeCode!;
}

/**
 * Synchronous loader for the React runtime bundle in Node.js environments.
 */
export function getReactRuntimeSync(): string {
  if (cachedRuntimeCode) return cachedRuntimeCode;
  const fs = require('fs');
  const path = require('path');
  const runtimePath = path.resolve(process.cwd(), 'public/sandbox/react-runtime.js');
  cachedRuntimeCode = fs.readFileSync(runtimePath, 'utf8');
  return cachedRuntimeCode!;
}
