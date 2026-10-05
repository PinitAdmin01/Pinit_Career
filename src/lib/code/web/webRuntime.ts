/**
 * Web runtime bundle loader (W-05 / CHK-4).
 * Loads public/sandbox/web-runtime.js for browser and Node environments.
 * Independent of esbuild / compileTs so client webpack bundles stay clean.
 */

let cachedRuntimeCode: string | null = null;

/**
 * Returns the bundled Web runtime code as a string.
 * Loads /sandbox/web-runtime.js in the browser or reads public/sandbox/web-runtime.js in Node.
 */
export async function getWebRuntime(): Promise<string> {
  if (cachedRuntimeCode) return cachedRuntimeCode;

  if (typeof window !== 'undefined') {
    const res = await fetch('/sandbox/web-runtime.js');
    if (!res.ok) {
      throw new Error(`Failed to load Web runtime from /sandbox/web-runtime.js (${res.status})`);
    }
    cachedRuntimeCode = await res.text();
    return cachedRuntimeCode!;
  }

  // Node environment
  const fs = await import('fs');
  const path = await import('path');
  const runtimePath = path.resolve(process.cwd(), 'public/sandbox/web-runtime.js');
  cachedRuntimeCode = fs.readFileSync(runtimePath, 'utf8');
  return cachedRuntimeCode!;
}

/**
 * Synchronous loader for the Web runtime bundle in Node.js environments.
 */
export function getWebRuntimeSync(): string {
  if (cachedRuntimeCode) return cachedRuntimeCode;
  const fs = require('fs');
  const path = require('path');
  const runtimePath = path.resolve(process.cwd(), 'public/sandbox/web-runtime.js');
  cachedRuntimeCode = fs.readFileSync(runtimePath, 'utf8');
  return cachedRuntimeCode!;
}
