/**
 * Faithful replica of the student lesson runtime (useLessonEngine.runSlideCode -> executeSandboxScript):
 * a browser Web Worker. esbuild TS->JS (es2022), lesson helpers injected, code wrapped in an async IIFE,
 * only console.log / console.error captured, values formatted by the platform's own logFormat.
 * NO require / process / Buffer / global / setImmediate / crypto.subtle.
 */
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import esbuild from 'esbuild';
import { formatLogArgs } from '../../src/lib/code/sandbox/logFormat';
import { withLessonHelpers } from '../../src/lib/code/sandbox/lessonHelpers';

export interface StudentRun { stdout: string; stderr: string; lost: string; error?: string }

export async function runLikeStudent(tsCode: string, timeoutMs = 4000): Promise<StudentRun> {
  const logs: string[] = [];
  const errs: string[] = [];
  const lost: string[] = [];
  let compiled: string;
  try {
    compiled = esbuild.transformSync(tsCode, { loader: 'ts', target: 'es2022' }).code;
  } catch (e: any) {
    return { stdout: '', stderr: '', lost: '', error: 'TS COMPILE: ' + String(e.message || e).split('\n')[0] };
  }
  const pending = new Set<any>();
  const ctx: any = {
    console: {
      log: (...a: any[]) => logs.push(formatLogArgs(a)),
      error: (...a: any[]) => errs.push(formatLogArgs(a)),
      warn: (...a: any[]) => lost.push('[warn] ' + formatLogArgs(a)),
      info: (...a: any[]) => lost.push('[info] ' + formatLogArgs(a)),
      debug: (...a: any[]) => lost.push('[debug] ' + formatLogArgs(a)),
      table: (...a: any[]) => lost.push('[table] ' + formatLogArgs(a)),
    },
    setTimeout: (fn: any, ms: number, ...x: any[]) => { const id = setTimeout(() => { pending.delete(id); fn(...x); }, ms); pending.add(id); return id; },
    clearTimeout: (id: any) => { pending.delete(id); clearTimeout(id); },
    setInterval, clearInterval,
    queueMicrotask, structuredClone, atob, btoa,
    TextEncoder, TextDecoder, URL, URLSearchParams,
    AbortController, AbortSignal, EventTarget, Event,
    ReadableStream, WritableStream, TransformStream, CountQueuingStrategy, ByteLengthQueuingStrategy,
    Response, Request, Headers, Blob, FormData,
    performance: { now: () => performance.now() },
    crypto: { getRandomValues: (a: any) => webcrypto.getRandomValues(a), randomUUID: () => webcrypto.randomUUID() },
  };
  ctx.self = ctx;
  vm.createContext(ctx);
  const program = `(async () => {\n${withLessonHelpers(compiled)}\n})()`;
  let error: string | undefined;
  try {
    const p = vm.runInContext(program, ctx, { timeout: timeoutMs });
    await Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(`TIMEOUT ${timeoutMs}ms`)), timeoutMs))]);
    // Worker: res.then(() => whenTimersDone(...)) -> nativeSetTimeout(check, 0), re-check every 5ms
    const start = Date.now();
    await new Promise(r => setTimeout(r, 0));
    while (pending.size > 0 && Date.now() - start < timeoutMs) await new Promise(r => setTimeout(r, 5));
    if (pending.size > 0) error = 'TIMERS STILL PENDING';
  } catch (e: any) {
    error = (e && e.message) ? e.message : String(e);
  }
  return { stdout: logs.join('\n'), stderr: errs.join('\n'), lost: lost.join('\n'), error };
}

export const normOutput = (s: string) => (s || '').replace(/\r/g, '').split('\n').map(l => l.trimEnd()).join('\n').trim();
