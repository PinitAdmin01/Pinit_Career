/**
 * TypeScript and TSX compilation service (CHK-2 / W-03).
 * Compiles TS/TSX to JavaScript using esbuild in Node and esbuild-wasm in the browser.
 */

export interface CompileSuccess {
  ok: true;
  js: string;
}

export interface CompileFailure {
  ok: false;
  message: string;
  line?: number;
}

export type CompileResult = CompileSuccess | CompileFailure;

export interface CompileOptions {
  jsx?: boolean;
}

let wasmInitPromise: Promise<void> | null = null;

function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Initializes esbuild-wasm for the browser runtime if not already initialized.
 */
export async function initBrowserWasm(): Promise<void> {
  if (!isBrowserEnvironment()) return;
  if (!wasmInitPromise) {
    const esbuildWasm = await import('esbuild-wasm');
    wasmInitPromise = esbuildWasm.initialize({
      wasmURL: '/esbuild/esbuild.wasm',
      worker: false,
    });
  }
  return wasmInitPromise;
}

declare const __non_webpack_require__: ((id: string) => any) | undefined;

function getNodeEsbuild(): any {
  if (typeof __non_webpack_require__ !== 'undefined') {
    return __non_webpack_require__('esbuild');
  }
  if (typeof require !== 'undefined') {
    return require('esbuild');
  }
  throw new Error('esbuild is only available in Node.js');
}

/**
 * Compiles TypeScript or TSX source code into JavaScript.
 * In Node environments, uses the native `esbuild` package.
 * In browser environments, uses `esbuild-wasm` initialized with `/esbuild/esbuild.wasm`.
 * Returns `{ ok: true, js }` or `{ ok: false, message, line }`.
 */
export async function compileTs(
  source: string,
  options?: CompileOptions
): Promise<CompileResult> {
  const loader = options?.jsx ? 'tsx' : 'ts';

  try {
    if (isBrowserEnvironment()) {
      const esbuildWasm = await import('esbuild-wasm');
      await initBrowserWasm();
      const result = await esbuildWasm.transform(source, {
        loader,
        target: 'es2022',
      });
      return { ok: true, js: result.code };
    } else {
      // Node.js environment: load native esbuild
      const esbuild = getNodeEsbuild();
      const result = await esbuild.transform(source, {
        loader,
        target: 'es2022',
      });
      return { ok: true, js: result.code };
    }
  } catch (err: any) {
    const firstError = err?.errors?.[0];
    const message = firstError?.text || err?.message || 'TypeScript compilation failed';
    const line = firstError?.location?.line;
    return {
      ok: false,
      message,
      ...(typeof line === 'number' ? { line } : {}),
    };
  }
}

/**
 * Synchronous compiler for Node.js environments (test harnesses, server-side grading).
 */
export function compileTsSync(
  source: string,
  options?: CompileOptions
): CompileResult {
  if (isBrowserEnvironment()) {
    throw new Error('compileTsSync is only available in Node.js environments. Use compileTs in the browser.');
  }

  const loader = options?.jsx ? 'tsx' : 'ts';

  try {
    const esbuild = getNodeEsbuild();
    const result = esbuild.transformSync(source, {
      loader,
      target: 'es2022',
    });
    return { ok: true, js: result.code };
  } catch (err: any) {
    const firstError = err?.errors?.[0];
    const message = firstError?.text || err?.message || 'TypeScript compilation failed';
    const line = firstError?.location?.line;
    return {
      ok: false,
      message,
      ...(typeof line === 'number' ? { line } : {}),
    };
  }
}
