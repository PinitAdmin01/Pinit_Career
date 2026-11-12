import { DayConfig, buildEnrichedDayQuests } from './curriculumEnricher';
import { NODE_WEB_DAYS } from './nodeWebDays';

const lines = (...l: string[]) => l.join('\n');

export const NODE_WEB_30_DAYS_CONFIGS: DayConfig[] = [
  // ── DAY 1: Node.js Runtime & Event Loop ───────────────────────────────────
  {
    ...NODE_WEB_DAYS[0],
    eTitle: "Format Server Uptime",
    eDesc: "Write `formatUptime(seconds: number): string` that formats an uptime duration into a readable string like `'1d 2h 30m 15s'`, `'45m 10s'`, or `'0s'` when 0.",
    eLanguage: "typescript",
    eStarter: lines("function formatUptime(seconds: number): string {", "  // Return formatted uptime string", "  return '';", "}"),
    eHint: `const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts: string[] = [];
  if (d > 0) parts.push(d + 'd');
  if (h > 0) parts.push(h + 'h');
  if (m > 0) parts.push(m + 'm');
  if (s > 0 || parts.length === 0) parts.push(s + 's');
  return parts.join(' ');`,
    eTest: lines(
      "if (typeof formatUptime !== 'function') throw new Error('formatUptime not found');",
      "if (formatUptime(0) !== '0s') throw new Error('0 should be 0s, got ' + formatUptime(0));",
      "if (formatUptime(90) !== '1m 30s') throw new Error('90 should be 1m 30s, got ' + formatUptime(90));",
      "if (formatUptime(3665) !== '1h 1m 5s') throw new Error('3665 should be 1h 1m 5s, got ' + formatUptime(3665));",
      "if (formatUptime(90061) !== '1d 1h 1m 1s') throw new Error('90061 should be 1d 1h 1m 1s, got ' + formatUptime(90061));"
    ),
    aTitle: "Parse Process Arguments",
    aDesc: "Write `parseProcessArgs(argv: string[]): Record<string, string | boolean>` that converts an array of CLI arguments (like `['--port', '8080', '--debug']`) into an object.",
    aLanguage: "typescript",
    aStarter: lines("function parseProcessArgs(argv: string[]): Record<string, string | boolean> {", "  // Parse flags into an object", "  return {};", "}"),
    aHint: `const res: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
        res[key] = argv[++i];
      } else {
        res[key] = true;
      }
    }
  }
  return res;`,
    aTest: lines(
      "if (typeof parseProcessArgs !== 'function') throw new Error('parseProcessArgs not found');",
      "const r1 = parseProcessArgs(['--port', '8080', '--host', 'localhost']);",
      "if (r1.port !== '8080' || r1.host !== 'localhost') throw new Error('Failed to parse key-value flags');",
      "const r2 = parseProcessArgs(['--verbose', '--dry-run']);",
      "if (r2.verbose !== true || r2['dry-run'] !== true) throw new Error('Failed to parse boolean flags');",
      "const r3 = parseProcessArgs(['--env', 'production', '--minify']);",
      "if (r3.env !== 'production' || r3.minify !== true) throw new Error('Failed to parse mixed flags');"
    )
  },

  // ── DAY 2: Modules & Path Resolution ──────────────────────────────────────
  {
    ...NODE_WEB_DAYS[1],
    eTitle: "Normalize API URL Path (The Six Libuv Event Loop Phases & Execution Order)",
    eDesc: "Write `normalizeApiPath(base: string, endpoint: string): string` that joins a base path and endpoint ensuring exactly one leading `/`, no trailing `/` (unless root), and no duplicate slashes.",
    eLanguage: "typescript",
    eStarter: lines("function normalizeApiPath(base: string, endpoint: string): string {", "  // Normalize and join paths", "  return '';", "}"),
    eHint: `const parts = (base + '/' + endpoint).split('/').filter(Boolean);
  return '/' + parts.join('/');`,
    eTest: lines(
      "if (typeof normalizeApiPath !== 'function') throw new Error('normalizeApiPath not found');",
      "if (normalizeApiPath('/api/v1/', '/users/') !== '/api/v1/users') throw new Error('Failed /api/v1/ and /users/');",
      "if (normalizeApiPath('api', 'jobs/search') !== '/api/jobs/search') throw new Error('Failed api and jobs/search');",
      "if (normalizeApiPath('', '/') !== '/') throw new Error('Root path should be /');",
      "if (normalizeApiPath('///admin///', '///dashboard///') !== '/admin/dashboard') throw new Error('Failed multiple slashes');"
    ),
    aTitle: "Resolve Module Import Specifier",
    aDesc: "Write `resolveModuleImport(specifier: string, defaultExt: string = '.js'): string` that appends `defaultExt` to relative imports that lack an extension.",
    aLanguage: "typescript",
    aStarter: lines("function resolveModuleImport(specifier: string, defaultExt: string = '.js'): string {", "  // Append defaultExt if extension is missing", "  return '';", "}"),
    aHint: `const lastSlash = specifier.lastIndexOf('/');
  const filename = lastSlash >= 0 ? specifier.slice(lastSlash + 1) : specifier;
  if (filename.includes('.')) return specifier;
  return specifier + defaultExt;`,
    aTest: lines(
      "if (typeof resolveModuleImport !== 'function') throw new Error('resolveModuleImport not found');",
      "if (resolveModuleImport('./utils/math') !== './utils/math.js') throw new Error('Missing .js extension');",
      "if (resolveModuleImport('../config.json') !== '../config.json') throw new Error('Should keep existing .json');",
      "if (resolveModuleImport('./service', '.ts') !== './service.ts') throw new Error('Custom extension failed');",
      "if (resolveModuleImport('./components/Button.tsx') !== './components/Button.tsx') throw new Error('Should keep .tsx');"
    )
  },

  // ── DAY 3: Backend TypeScript & Narrowing ─────────────────────────────────
  {
    ...NODE_WEB_DAYS[2],
    eTitle: "Format Discriminated API Result",
    eDesc: "Write `formatApiResult(result: { success: true; data: unknown } | { success: false; error: string }): string` that narrows the discriminated union and formats the message.",
    eLanguage: "typescript",
    eStarter: lines("function formatApiResult(result: { success: true; data: unknown } | { success: false; error: string }): string {", "  // Return formatted result string", "  return '';", "}"),
    eHint: `if (result.success) {
    return 'OK: ' + JSON.stringify(result.data);
  }
  return 'ERR: ' + result.error;`,
    eTest: lines(
      "if (typeof formatApiResult !== 'function') throw new Error('formatApiResult not found');",
      "if (formatApiResult({ success: true, data: { count: 5 } }) !== 'OK: {\"count\":5}') throw new Error('Success object format incorrect');",
      "if (formatApiResult({ success: false, error: 'Unauthorized' }) !== 'ERR: Unauthorized') throw new Error('Error format incorrect');",
      "if (formatApiResult({ success: true, data: [1, 2] }) !== 'OK: [1,2]') throw new Error('Success array format incorrect');"
    ),
    aTitle: "Type Guard for Non-Empty Strings",
    aDesc: "Write a user-defined type guard `isNonEmptyString(value: unknown): value is string` that returns `true` only if `value` is a string with trimmed length greater than 0.",
    aLanguage: "typescript",
    aStarter: lines("function isNonEmptyString(value: unknown): value is string {", "  // Return true if value is non-empty string", "  return false;", "}"),
    aHint: `return typeof value === 'string' && value.trim().length > 0;`,
    aTest: lines(
      "if (typeof isNonEmptyString !== 'function') throw new Error('isNonEmptyString not found');",
      "if (isNonEmptyString('hello') !== true) throw new Error('hello should be true');",
      "if (isNonEmptyString('   ') !== false) throw new Error('whitespace should be false');",
      "if (isNonEmptyString('') !== false) throw new Error('empty string should be false');",
      "if (isNonEmptyString(123) !== false) throw new Error('number should be false');",
      "if (isNonEmptyString(null) !== false) throw new Error('null should be false');"
    )
  },

  // ── DAY 4: Generics & Utility Types ───────────────────────────────────────
  {
    ...NODE_WEB_DAYS[3],
    eTitle: "Generic Pick Fields Utility (Node.js Process Architecture)",
    eDesc: "Write `pickFields<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>` that extracts only the selected keys into a new object.",
    eLanguage: "typescript",
    eStarter: lines("function pickFields<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {", "  // Return new object with selected keys", "  return {} as any;", "}"),
    eHint: `const res = {} as Pick<T, K>;
  for (const k of keys) {
    if (k in obj) {
      res[k] = obj[k];
    }
  }
  return res;`,
    eTest: lines(
      "if (typeof pickFields !== 'function') throw new Error('pickFields not found');",
      "const u = { id: 1, name: 'Alice', role: 'admin', hash: 'xyz' };",
      "const p = pickFields(u, ['id', 'name']);",
      "if (p.id !== 1 || p.name !== 'Alice' || 'role' in p || 'hash' in p) throw new Error('Failed to pick id and name');",
      "const n = pickFields({ a: 10, b: 20, c: 30 }, ['c']);",
      "if (n.c !== 30 || 'a' in n) throw new Error('Failed to pick c');"
    ),
    aTitle: "Apply Defaults with Generics",
    aDesc: "Write `applyDefaults<T extends Record<string, unknown>>(provided: Partial<T>, defaults: T): T` that combines defaults and provided values, ignoring `undefined` provided fields.",
    aLanguage: "typescript",
    aStarter: lines("function applyDefaults<T extends Record<string, unknown>>(provided: Partial<T>, defaults: T): T {", "  // Return combined object", "  return {} as any;", "}"),
    aHint: `const res = { ...defaults };
  for (const key of Object.keys(provided) as (keyof T)[]) {
    if (provided[key] !== undefined) {
      res[key] = provided[key]!;
    }
  }
  return res;`,
    aTest: lines(
      "if (typeof applyDefaults !== 'function') throw new Error('applyDefaults not found');",
      "const def = { host: '0.0.0.0', port: 3000, timeout: 5000 };",
      "const res = applyDefaults({ port: 8080 }, def);",
      "if (res.port !== 8080 || res.host !== '0.0.0.0' || res.timeout !== 5000) throw new Error('Failed port override');",
      "const res2 = applyDefaults({ host: '127.0.0.1' }, def);",
      "if (res2.host !== '127.0.0.1' || res2.port !== 3000) throw new Error('Host override failed');",
      "const res3 = applyDefaults({ host: undefined }, def);",
      "if (res3.host !== '0.0.0.0') throw new Error('Undefined should not overwrite default');"
    )
  },

  // ── DAY 5: Asynchronous Flow & Errors ─────────────────────────────────────
  {
    ...NODE_WEB_DAYS[4],
    eTitle: "Execute with Fallback",
    eDesc: "Write `executeWithFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T>` that attempts primary() and falls back to fallback() on rejection.",
    eLanguage: "typescript",
    eStarter: lines("async function executeWithFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {", "  // Try primary, then fallback", "  return {} as any;", "}"),
    eHint: `try {
    return await primary();
  } catch {
    return await fallback();
  }`,
    eTest: lines(
      "if (typeof executeWithFallback !== 'function') throw new Error('executeWithFallback not found');",
      "const v1 = await executeWithFallback(async () => 42, async () => 99);",
      "if (v1 !== 42) throw new Error('Primary should succeed with 42');",
      "const v2 = await executeWithFallback(async () => { throw new Error('fail'); }, async () => 99);",
      "if (v2 !== 99) throw new Error('Fallback should succeed with 99');"
    ),
    aTitle: "Settle All Task Batch",
    aDesc: "Write `settleAllBatch<T>(tasks: (() => Promise<T>)[]): Promise<{ succeeded: T[]; failed: string[] }>` that executes an array of async functions and groups results.",
    aLanguage: "typescript",
    aStarter: lines("async function settleAllBatch<T>(tasks: (() => Promise<T>)[]): Promise<{ succeeded: T[]; failed: string[] }> {", "  // Run tasks and partition results", "  return { succeeded: [], failed: [] };", "}"),
    aHint: `const succeeded: T[] = [];
  const failed: string[] = [];
  for (const task of tasks) {
    try {
      const val = await task();
      succeeded.push(val);
    } catch (err: any) {
      failed.push(err && err.message ? err.message : String(err));
    }
  }
  return { succeeded, failed };`,
    aTest: lines(
      "if (typeof settleAllBatch !== 'function') throw new Error('settleAllBatch not found');",
      "const tasks = [async () => 'a', async () => { throw new Error('b-err'); }, async () => 'c'];",
      "const res = await settleAllBatch(tasks);",
      "if (res.succeeded.length !== 2 || res.succeeded[0] !== 'a' || res.succeeded[1] !== 'c') throw new Error('Succeeded items incorrect');",
      "if (res.failed.length !== 1 || res.failed[0] !== 'b-err') throw new Error('Failed items incorrect');",
      "const res2 = await settleAllBatch([async () => 1, async () => 2]);",
      "if (res2.succeeded.length !== 2 || res2.succeeded[0] !== 1 || res2.succeeded[1] !== 2 || res2.failed.length !== 0) throw new Error('All succeeded failed');",
      "const res3 = await settleAllBatch([async () => { throw new Error('e1'); }, async () => { throw new Error('e2'); }]);",
      "if (res3.succeeded.length !== 0 || res3.failed.length !== 2 || res3.failed[0] !== 'e1' || res3.failed[1] !== 'e2') throw new Error('All failed failed');"
    )
  },

  // ── DAY 6: The HTTP Protocol ──────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[5],
    eTitle: "HTTP 2xx Status Checker",
    eDesc: "Write `isSuccessStatus(code: number): boolean` that returns `true` for valid 2xx HTTP status codes (200 through 299).",
    eLanguage: "typescript",
    eStarter: lines("function isSuccessStatus(code: number): boolean {", "  // Check if status is 2xx", "  return false;", "}"),
    eHint: "return code >= 200 && code <= 299;",
    eTest: lines(
      "if (typeof isSuccessStatus !== 'function') throw new Error('isSuccessStatus not found');",
      "if (isSuccessStatus(200) !== true || isSuccessStatus(201) !== true || isSuccessStatus(204) !== true) throw new Error('2xx should be true');",
      "if (isSuccessStatus(301) !== false || isSuccessStatus(400) !== false || isSuccessStatus(500) !== false) throw new Error('non-2xx should be false');",
      "if (isSuccessStatus(199) !== false || isSuccessStatus(300) !== false) throw new Error('boundary checks failed');"
    ),
    aTitle: "Parse Content-Type Header",
    aDesc: "Write `parseContentType(header: string): { mediaType: string; charset?: string }` that extracts the lowercase mediaType and optional charset parameter.",
    aLanguage: "typescript",
    aStarter: lines("function parseContentType(header: string): { mediaType: string; charset?: string } {", "  // Parse mediaType and charset", "  return { mediaType: '' };", "}"),
    aHint: `const parts = header.split(';').map(p => p.trim());
  const mediaType = parts[0].toLowerCase();
  let charset: string | undefined;
  for (let i = 1; i < parts.length; i++) {
    const match = parts[i].match(/^charset=(.+)$/i);
    if (match) charset = match[1].toLowerCase();
  }
  return charset ? { mediaType, charset } : { mediaType };`,
    aTest: lines(
      "if (typeof parseContentType !== 'function') throw new Error('parseContentType not found');",
      "const r1 = parseContentType('application/json; charset=utf-8');",
      "if (r1.mediaType !== 'application/json' || r1.charset !== 'utf-8') throw new Error('Failed r1');",
      "const r2 = parseContentType('text/html');",
      "if (r2.mediaType !== 'text/html' || r2.charset !== undefined) throw new Error('Failed r2');",
      "const r3 = parseContentType('TEXT/PLAIN; charset=ISO-8859-1');",
      "if (r3.mediaType !== 'text/plain' || r3.charset !== 'iso-8859-1') throw new Error('Failed r3');"
    )
  },

  // ── DAY 7: Request Handlers as Pure Functions ─────────────────────────────
  {
    ...NODE_WEB_DAYS[6],
    eTitle: "Create JSON Response Object",
    eDesc: "Write `createJsonResponse(data: unknown, status: number = 200): { status: number; headers: Record<string, string>; body: string }` that constructs a standardized pure response.",
    eLanguage: "typescript",
    eStarter: lines("function createJsonResponse(data: unknown, status: number = 200): { status: number; headers: Record<string, string>; body: string } {", "  // Return JSON response object", "  return null as any;", "}"),
    eHint: `return {
    status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };`,
    eTest: lines(
      "if (typeof createJsonResponse !== 'function') throw new Error('createJsonResponse not found');",
      "const r1 = createJsonResponse({ ok: true });",
      "if (r1.status !== 200 || r1.headers['Content-Type'] !== 'application/json' || r1.body !== '{\"ok\":true}') throw new Error('Failed 200 response');",
      "const r2 = createJsonResponse({ error: 'Not Found' }, 404);",
      "if (r2.status !== 404 || r2.body !== '{\"error\":\"Not Found\"}') throw new Error('Failed 404 response');"
    ),
    aTitle: "Handle Echo Request",
    aDesc: "Write `handleEchoRequest(req: { method: string; body?: unknown }): { status: number; body: string }` that returns 405 for non-POST, 400 for missing body, and 200 echoing stringified body.",
    aLanguage: "typescript",
    aStarter: lines("function handleEchoRequest(req: { method: string; body?: unknown }): { status: number; body: string } {", "  // Validate method and body, then echo", "  return null as any;", "}"),
    aHint: `if (req.method !== 'POST') return { status: 405, body: 'Method Not Allowed' };
  if (req.body === undefined) return { status: 400, body: 'Missing Body' };
  return { status: 200, body: JSON.stringify(req.body) };`,
    aTest: lines(
      "if (typeof handleEchoRequest !== 'function') throw new Error('handleEchoRequest not found');",
      "if (handleEchoRequest({ method: 'GET' }).status !== 405) throw new Error('GET should return 405');",
      "if (handleEchoRequest({ method: 'POST' }).status !== 400) throw new Error('POST without body should return 400');",
      "const ok = handleEchoRequest({ method: 'POST', body: { msg: 'hi' } });",
      "if (ok.status !== 200 || ok.body !== '{\"msg\":\"hi\"}') throw new Error('Echo payload incorrect');"
    )
  },

  // ── DAY 8: Routing Tables & Path Matching ─────────────────────────────────
  {
    ...NODE_WEB_DAYS[7],
    eTitle: "Match Dynamic Path Parameters",
    eDesc: "Write `matchPath(pattern: string, path: string): { matched: boolean; params: Record<string, string> }` that matches paths with named parameters like `'/jobs/:id'`.",
    eLanguage: "typescript",
    eStarter: lines("function matchPath(pattern: string, path: string): { matched: boolean; params: Record<string, string> } {", "  // Match pattern and extract params", "  return { matched: false, params: {} };", "}"),
    eHint: `const patSegs = pattern.split('/').filter(Boolean);
  const pathSegs = path.split('/').filter(Boolean);
  if (patSegs.length !== pathSegs.length) return { matched: false, params: {} };
  const params: Record<string, string> = {};
  for (let i = 0; i < patSegs.length; i++) {
    if (patSegs[i].startsWith(':')) {
      params[patSegs[i].slice(1)] = pathSegs[i];
    } else if (patSegs[i] !== pathSegs[i]) {
      return { matched: false, params: {} };
    }
  }
  return { matched: true, params };`,
    eTest: lines(
      "if (typeof matchPath !== 'function') throw new Error('matchPath not found');",
      "const m1 = matchPath('/jobs/:id', '/jobs/101');",
      "if (!m1.matched || m1.params.id !== '101') throw new Error('Failed to match /jobs/:id');",
      "const m2 = matchPath('/jobs/:id/apply', '/jobs/101/apply');",
      "if (!m2.matched || m2.params.id !== '101') throw new Error('Failed multi-segment match');",
      "const m3 = matchPath('/jobs/:id', '/users/101');",
      "if (m3.matched) throw new Error('Different base segment should not match');"
    ),
    aTitle: "Resolve Router Table Entry",
    aDesc: "Write `resolveRoute(routes: { method: string; path: string; handler: string }[], method: string, path: string): string | null` that finds the matching handler name.",
    aLanguage: "typescript",
    aStarter: lines("function resolveRoute(routes: { method: string; path: string; handler: string }[], method: string, path: string): string | null {", "  // Find matching route handler", "  return null;", "}"),
    aHint: `const r = routes.find(entry => entry.method === method && entry.path === path);
  return r ? r.handler : null;`,
    aTest: lines(
      "if (typeof resolveRoute !== 'function') throw new Error('resolveRoute not found');",
      "const routes = [",
      "  { method: 'GET', path: '/health', handler: 'getHealth' },",
      "  { method: 'POST', path: '/jobs', handler: 'createJob' }",
      "];",
      "if (resolveRoute(routes, 'GET', '/health') !== 'getHealth') throw new Error('Failed GET /health');",
      "if (resolveRoute(routes, 'POST', '/jobs') !== 'createJob') throw new Error('Failed POST /jobs');",
      "if (resolveRoute(routes, 'GET', '/jobs') !== null) throw new Error('GET /jobs should be null');"
    )
  },

  // ── DAY 9: Query Strings & Parameter Parsing ──────────────────────────────
  {
    ...NODE_WEB_DAYS[8],
    eTitle: "Parse Pagination Query String",
    eDesc: "Write `parsePaginationQuery(search: string): { page: number; limit: number }` that parses query parameters with defaults (page: 1, limit: 10), min page: 1, and max limit: 100.",
    eLanguage: "typescript",
    eStarter: lines("function parsePaginationQuery(search: string): { page: number; limit: number } {", "  // Parse page and limit with bounds", "  return { page: 1, limit: 10 };", "}"),
    eHint: `const sp = new URLSearchParams(search);
  const rawPage = sp.get('page');
  const rawLimit = sp.get('limit');
  const page = Math.max(1, rawPage ? Number(rawPage) || 1 : 1);
  const limit = Math.min(100, Math.max(1, rawLimit ? Number(rawLimit) || 10 : 10));
  return { page, limit };`,
    eTest: lines(
      "if (typeof parsePaginationQuery !== 'function') throw new Error('parsePaginationQuery not found');",
      "const p1 = parsePaginationQuery('?page=3&limit=50');",
      "if (p1.page !== 3 || p1.limit !== 50) throw new Error('Failed ?page=3&limit=50');",
      "const p2 = parsePaginationQuery('');",
      "if (p2.page !== 1 || p2.limit !== 10) throw new Error('Default values incorrect');",
      "const p3 = parsePaginationQuery('?page=0&limit=500');",
      "if (p3.page !== 1 || p3.limit !== 100) throw new Error('Bounds enforcement failed');"
    ),
    aTitle: "Filter Query Parameters by Allowlist",
    aDesc: "Write `parseFilterQuery(search: string, allowedKeys: string[]): Record<string, string>` that extracts only allowed query parameters.",
    aLanguage: "typescript",
    aStarter: lines("function parseFilterQuery(search: string, allowedKeys: string[]): Record<string, string> {", "  // Return allowed key-value query pairs", "  return {};", "}"),
    aHint: `const sp = new URLSearchParams(search);
  const allowed = new Set(allowedKeys);
  const result: Record<string, string> = {};
  for (const [key, value] of sp.entries()) {
    if (allowed.has(key)) result[key] = value;
  }
  return result;`,
    aTest: lines(
      "if (typeof parseFilterQuery !== 'function') throw new Error('parseFilterQuery not found');",
      "const f1 = parseFilterQuery('?status=active&sort=desc&secret=123', ['status', 'sort']);",
      "if (f1.status !== 'active' || f1.sort !== 'desc' || 'secret' in f1) throw new Error('Allowed keys filtering failed');",
      "const f2 = parseFilterQuery('?role=admin', ['status']);",
      "if (Object.keys(f2).length !== 0) throw new Error('Should return empty object');"
    )
  },

  // ── DAY 10: Request Body Validation ───────────────────────────────────────
  {
    ...NODE_WEB_DAYS[9],
    eTitle: "Validate User Registration Payload",
    eDesc: "Write `validateUserRegistration(body: any): { valid: boolean; errors: string[] }` checking: email contains '@', password length >= 8, age >= 18 if present.",
    eLanguage: "typescript",
    eStarter: lines("function validateUserRegistration(body: any): { valid: boolean; errors: string[] } {", "  // Validate registration fields", "  return { valid: false, errors: [] };", "}"),
    eHint: `const errors: string[] = [];
  if (!body || typeof body.email !== 'string' || !body.email.includes('@')) {
    errors.push('Invalid email');
  }
  if (!body || typeof body.password !== 'string' || body.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (body && typeof body.age === 'number' && body.age < 18) {
    errors.push('Must be at least 18 years old');
  }
  return { valid: errors.length === 0, errors };`,
    eTest: lines(
      "if (typeof validateUserRegistration !== 'function') throw new Error('validateUserRegistration not found');",
      "const v1 = validateUserRegistration({ email: 'alice@mail.com', password: 'password123' });",
      "if (!v1.valid || v1.errors.length !== 0) throw new Error('Valid registration failed');",
      "const v2 = validateUserRegistration({ email: 'bad-email', password: 'short' });",
      "if (v2.valid || v2.errors.length !== 2) throw new Error('Should return 2 errors for invalid email and short password');",
      "const v3 = validateUserRegistration({ email: 'bob@mail.com', password: 'password123', age: 16 });",
      "if (v3.valid || v3.errors.length !== 1) throw new Error('Should reject age under 18');"
    ),
    aTitle: "Require Non-Empty Object Fields",
    aDesc: "Write `requireFields(obj: Record<string, unknown>, required: string[]): { ok: boolean; missing: string[] }` checking which required fields are missing, null, or empty string.",
    aLanguage: "typescript",
    aStarter: lines("function requireFields(obj: Record<string, unknown>, required: string[]): { ok: boolean; missing: string[] } {", "  // Identify missing fields", "  return { ok: false, missing: [] };", "}"),
    aHint: `const missing = required.filter(k => obj[k] === undefined || obj[k] === null || obj[k] === '');
  return { ok: missing.length === 0, missing };`,
    aTest: lines(
      "if (typeof requireFields !== 'function') throw new Error('requireFields not found');",
      "const r1 = requireFields({ title: 'Dev', company: 'TCS' }, ['title', 'company']);",
      "if (!r1.ok || r1.missing.length !== 0) throw new Error('All present should be ok');",
      "const r2 = requireFields({ title: 'Dev', company: '' }, ['title', 'company', 'salary']);",
      "if (r2.ok || r2.missing.length !== 2 || !r2.missing.includes('company') || !r2.missing.includes('salary')) throw new Error('Should flag company and salary');"
    )
  },

  // ── DAY 11: Database Drivers & Connection Pooling ─────────────────────────
  {
    ...NODE_WEB_DAYS[10],
    eTitle: "Calculate Little's Law Pool Sizing",
    eDesc: "Write `calculateLittleLawPool(arrivalRate: number, avgLatencyMs: number, p99LatencyMs: number): { activeConnections: number; recommendedPool: number }` using Little's Law with P99 safety headroom.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateLittleLawPool(arrivalRate: number, avgLatencyMs: number, p99LatencyMs: number): { activeConnections: number; recommendedPool: number } {",
      "  // Calculate theoretical active and recommended pool size",
      "  return { activeConnections: 0, recommendedPool: 0 };",
      "}"
    ),
    eHint: `const activeConnections = Math.round(arrivalRate * (avgLatencyMs / 1000) * 100) / 100;
  const p99Connections = arrivalRate * (p99LatencyMs / 1000);
  const recommendedPool = Math.ceil(Math.max(activeConnections * 2, p99Connections * 1.2));
  return { activeConnections, recommendedPool };`,
    eTest: lines(
      "if (typeof calculateLittleLawPool !== 'function') throw new Error('calculateLittleLawPool not found');",
      "const r1 = calculateLittleLawPool(250, 8.0, 20.0);",
      "if (r1.activeConnections !== 2.0) throw new Error('Expected 2.0 active, got ' + r1.activeConnections);",
      "if (r1.recommendedPool !== 6) throw new Error('Expected 6 pool, got ' + r1.recommendedPool);",
      "const r2 = calculateLittleLawPool(500, 10.0, 30.0);",
      "if (r2.activeConnections !== 5.0) throw new Error('Expected 5.0 active, got ' + r2.activeConnections);",
      "if (r2.recommendedPool !== 18) throw new Error('Expected 18 pool, got ' + r2.recommendedPool);"
    ),
    aTitle: "Detect Leaked Database Connections",
    aDesc: "Write `detectLeakedConnections(leases: Array<{ id: string; leasedAt: number }>, now: number, thresholdMs: number): string[]` returning IDs of connections that exceeded lease thresholds.",
    aLanguage: "typescript",
    aStarter: lines(
      "function detectLeakedConnections(leases: Array<{ id: string; leasedAt: number }>, now: number, thresholdMs: number): string[] {",
      "  // Filter leaked connection IDs",
      "  return [];",
      "}"
    ),
    aHint: `return leases.filter((l) => (now - l.leasedAt) > thresholdMs).map((l) => l.id);`,
    aTest: lines(
      "if (typeof detectLeakedConnections !== 'function') throw new Error('detectLeakedConnections not found');",
      "const leases = [",
      "  { id: 'conn-1', leasedAt: 1000 },",
      "  { id: 'conn-2', leasedAt: 4500 },",
      "  { id: 'conn-3', leasedAt: 2000 }",
      "];",
      "const leaked = detectLeakedConnections(leases, 5000, 2500);",
      "if (leaked.length !== 2) throw new Error('Expected 2 leaked connections, got ' + leaked.length);",
      "if (!leaked.includes('conn-1') || !leaked.includes('conn-3')) throw new Error('Expected conn-1 and conn-3');",
      "if (detectLeakedConnections([], 5000, 2500).length !== 0) throw new Error('Expected 0 leaked for empty leases');"
    )
  },

  // ── DAY 12: SQL Query Composition & Injection Defense ─────────────────────
  {
    ...NODE_WEB_DAYS[11],
    eTitle: "Build Parameterized WHERE Clause",
    eDesc: "Write `buildParameterizedWhere(filters: Record<string, unknown>, startIndex?: number): { sql: string; values: unknown[] }` converting filter keys into positional placeholders.",
    eLanguage: "typescript",
    eStarter: lines(
      "function buildParameterizedWhere(filters: Record<string, unknown>, startIndex = 1): { sql: string; values: unknown[] } {",
      "  // Generate parameterized WHERE clause",
      "  return { sql: '', values: [] };",
      "}"
    ),
    eHint: `const keys = Object.keys(filters);
  if (keys.length === 0) return { sql: '', values: [] };
  const clauses: string[] = [];
  const values: unknown[] = [];
  let idx = startIndex;
  for (const key of keys) {
    clauses.push(key + ' = $' + idx++);
    values.push(filters[key]);
  }
  return { sql: 'WHERE ' + clauses.join(' AND '), values };`,
    eTest: lines(
      "if (typeof buildParameterizedWhere !== 'function') throw new Error('buildParameterizedWhere not found');",
      "const q1 = buildParameterizedWhere({ status: 'active', role: 'admin' });",
      "if (q1.sql !== 'WHERE status = $1 AND role = $2') throw new Error('Unexpected SQL: ' + q1.sql);",
      "if (q1.values.length !== 2 || q1.values[0] !== 'active' || q1.values[1] !== 'admin') throw new Error('Invalid values');",
      "const q2 = buildParameterizedWhere({});",
      "if (q2.sql !== '' || q2.values.length !== 0) throw new Error('Empty filters should produce empty SQL');"
    ),
    aTitle: "Sanitize SQL Order Clause",
    aDesc: "Write `sanitizeOrderClause(column: string, direction: string, allowedCols: string[]): string` validating identifiers against whitelists and quoting safely.",
    aLanguage: "typescript",
    aStarter: lines(
      "function sanitizeOrderClause(column: string, direction: string, allowedCols: string[]): string {",
      "  // Build validated ORDER BY clause",
      "  return '';",
      "}"
    ),
    aHint: `if (!allowedCols.includes(column)) throw new Error('Disallowed column: ' + column);
  const dir = direction.toUpperCase();
  if (dir !== 'ASC' && dir !== 'DESC') throw new Error('Invalid direction: ' + direction);
  return 'ORDER BY "' + column.replace(/"/g, '""') + '" ' + dir;`,
    aTest: lines(
      "if (typeof sanitizeOrderClause !== 'function') throw new Error('sanitizeOrderClause not found');",
      "const ord1 = sanitizeOrderClause('created_at', 'desc', ['id', 'created_at', 'name']);",
      'if (ord1 !== \'ORDER BY "created_at" DESC\') throw new Error("Expected ORDER BY created_at DESC, got " + ord1);',
      "let threw = false;",
      "try { sanitizeOrderClause('password; DROP', 'DESC', ['id', 'created_at']); } catch (e) { threw = true; }",
      "if (!threw) throw new Error('Should throw on disallowed column');"
    )
  },

  // ── DAY 13: Transaction Management & Distributed Locks ───────────────────
  {
    ...NODE_WEB_DAYS[12],
    eTitle: "Execute Transaction with Transient Retry",
    eDesc: "Write `executeWithRetry<T>(operation: () => Promise<T>, maxAttempts?: number): Promise<{ result: T; attempts: number }>` retrying on 40P01 and 40001 errors.",
    eLanguage: "typescript",
    eStarter: lines(
      "async function executeWithRetry<T>(operation: () => Promise<T>, maxAttempts = 3): Promise<{ result: T; attempts: number }> {",
      "  // Execute with deadlock retry logic",
      "  return { result: {} as T, attempts: 0 };",
      "}"
    ),
    eHint: `let attempts = 0;
  while (attempts < maxAttempts) {
    attempts++;
    try {
      const result = await operation();
      return { result, attempts };
    } catch (err: any) {
      if (err && (err.code === '40P01' || err.code === '40001') && attempts < maxAttempts) {
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');`,
    eTest: lines(
      "if (typeof executeWithRetry !== 'function') throw new Error('executeWithRetry not found');",
      "let failCount = 2;",
      "const res = await executeWithRetry(async () => {",
      "  if (failCount > 0) {",
      "    failCount--;",
      "    const e = new Error('deadlock');",
      "    e.code = '40P01';",
      "    throw e;",
      "  }",
      "  return 'committed';",
      "});",
      "if (res.result !== 'committed' || res.attempts !== 3) throw new Error('Expected committed in 3 attempts');",
      "const res2 = await executeWithRetry(async () => 'fast');",
      "if (res2.result !== 'fast' || res2.attempts !== 1) throw new Error('Expected fast in 1 attempt');"
    ),
    aTitle: "Validate Fencing Token Write",
    aDesc: "Write `validateFencingWrite(token: number, lastToken: number, data: string): { success: boolean; lastToken: number }` enforcing monotonic fencing token order.",
    aLanguage: "typescript",
    aStarter: lines(
      "function validateFencingWrite(token: number, lastToken: number, data: string): { success: boolean; lastToken: number } {",
      "  // Validate token monotonicity",
      "  return { success: false, lastToken: 0 };",
      "}"
    ),
    aHint: `if (token <= lastToken) {
    return { success: false, lastToken };
  }
  return { success: true, lastToken: token };`,
    aTest: lines(
      "if (typeof validateFencingWrite !== 'function') throw new Error('validateFencingWrite not found');",
      "const r1 = validateFencingWrite(101, 100, 'update-1');",
      "if (!r1.success || r1.lastToken !== 101) throw new Error('Token 101 should succeed');",
      "const r2 = validateFencingWrite(101, 102, 'update-stale');",
      "if (r2.success || r2.lastToken !== 102) throw new Error('Token 101 should fail against 102');"
    )
  },

  // ── DAY 14: Multi-Tier Caching & Stampede Mitigation ───────────────────────
  {
    ...NODE_WEB_DAYS[13],
    eTitle: "Evaluate XFetch Probabilistic Early Expiration",
    eDesc: "Write `evaluateXFetch(remainingTtlSec: number, deltaMs: number, beta: number, randomVal: number): boolean` computing optimal background refresh thresholds.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateXFetch(remainingTtlSec: number, deltaMs: number, beta: number, randomVal: number): boolean {",
      "  // Evaluate XFetch formula",
      "  return false;",
      "}"
    ),
    eHint: `if (remainingTtlSec <= 0) return true;
  const deltaSec = deltaMs / 1000;
  const threshold = -1 * (beta * deltaSec * Math.log(randomVal));
  return threshold > remainingTtlSec;`,
    eTest: lines(
      "if (typeof evaluateXFetch !== 'function') throw new Error('evaluateXFetch not found');",
      "const early = evaluateXFetch(2, 200, 1.0, 1e-13);",
      "if (!early) throw new Error('Expected early refresh to be true when remaining is 2s');",
      "const notEarly = evaluateXFetch(50, 200, 1.0, 1e-13);",
      "if (notEarly) throw new Error('Expected early refresh to be false when remaining is 50s');"
    ),
    aTitle: "Singleflight Promise Deduplicator",
    aDesc: "Write `createSingleflightManager(): { doCall: <T>(key: string, fn: () => Promise<T>) => Promise<T> }` coalescing concurrent queries into a single pending promise.",
    aLanguage: "typescript",
    aStarter: lines(
      "function createSingleflightManager(): { doCall: <T>(key: string, fn: () => Promise<T>) => Promise<T> } {",
      "  // Create promise deduplicator",
      "  return { doCall: async (k, fn) => fn() };",
      "}"
    ),
    aHint: `const inFlight = new Map<string, Promise<any>>();
  return {
    doCall: async <T>(key: string, fn: () => Promise<T>): Promise<T> => {
      if (inFlight.has(key)) return inFlight.get(key) as Promise<T>;
      const p = (async () => {
        try { return await fn(); }
        finally { inFlight.delete(key); }
      })();
      inFlight.set(key, p);
      return p;
    }
  };`,
    aTest: lines(
      "if (typeof createSingleflightManager !== 'function') throw new Error('createSingleflightManager not found');",
      "const sf = createSingleflightManager();",
      "let calls = 0;",
      "const slowFn = async () => { calls++; return 'done'; };",
      "const [res1, res2, res3] = await Promise.all([",
      "  sf.doCall('k1', slowFn),",
      "  sf.doCall('k1', slowFn),",
      "  sf.doCall('k1', slowFn)",
      "]);",
      "if (calls !== 1) throw new Error('Expected exactly 1 call, got ' + calls);",
      "if (res1 !== 'done' || res2 !== 'done' || res3 !== 'done') throw new Error('Values mismatch');"
    )
  },

  // ── DAY 15: Zero-Downtime Database Migrations ──────────────────────────────
  {
    ...NODE_WEB_DAYS[14],
    eTitle: "Audit DDL Non-Blocking Safety",
    eDesc: "Write `auditDDLScript(sql: string): { isSafe: boolean; issues: string[] }` checking for lock_timeout directives and CONCURRENTLY flags.",
    eLanguage: "typescript",
    eStarter: lines(
      "function auditDDLScript(sql: string): { isSafe: boolean; issues: string[] } {",
      "  // Audit DDL safety pragmas",
      "  return { isSafe: false, issues: [] };",
      "}"
    ),
    eHint: `const issues: string[] = [];
  const upper = sql.toUpperCase();
  if (!upper.includes('LOCK_TIMEOUT')) {
    issues.push('Missing lock_timeout');
  }
  if (upper.includes('CREATE INDEX') && !upper.includes('CONCURRENTLY')) {
    issues.push('CREATE INDEX without CONCURRENTLY');
  }
  return { isSafe: issues.length === 0, issues };`,
    eTest: lines(
      "if (typeof auditDDLScript !== 'function') throw new Error('auditDDLScript not found');",
      "const unsafe = auditDDLScript('CREATE INDEX idx_user ON users(email);');",
      "if (unsafe.isSafe) throw new Error('Expected unsafe script to fail');",
      "if (unsafe.issues.length !== 2) throw new Error('Expected 2 issues, got ' + unsafe.issues.length);",
      'const safe = auditDDLScript("SET lock_timeout = \'2s\'; CREATE INDEX CONCURRENTLY idx_user ON users(email);");',
      "if (!safe.isSafe || safe.issues.length !== 0) throw new Error('Expected safe script to pass');"
    ),
    aTitle: "Calculate Batch Migration Rollback",
    aDesc: "Write `calculateMigrationBatchRollback(records: Array<{ name: string; batch: number }>): string[]` returning migration names of the latest batch in reverse order.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateMigrationBatchRollback(records: Array<{ name: string; batch: number }>): string[] {",
      "  // Return latest batch migration names in reverse",
      "  return [];",
      "}"
    ),
    aHint: `if (records.length === 0) return [];
  const maxBatch = Math.max(...records.map((r) => r.batch));
  return records.filter((r) => r.batch === maxBatch).reverse().map((r) => r.name);`,
    aTest: lines(
      "if (typeof calculateMigrationBatchRollback !== 'function') throw new Error('calculateMigrationBatchRollback not found');",
      "const history = [",
      "  { name: '001_init', batch: 1 },",
      "  { name: '002_users', batch: 1 },",
      "  { name: '003_orders', batch: 2 },",
      "  { name: '004_items', batch: 2 }",
      "];",
      "const rollback = calculateMigrationBatchRollback(history);",
      "if (rollback.length !== 2) throw new Error('Expected 2 to rollback, got ' + rollback.length);",
      "if (rollback[0] !== '004_items' || rollback[1] !== '003_orders') throw new Error('Expected reverse order [004, 003]');",
      "const emptyRollback = calculateMigrationBatchRollback([]);",
      "if (emptyRollback.length !== 0) throw new Error('Expected 0 items for empty history');"
    )
  },

  // ── DAY 16: Password Security & Cryptographic Hashing ─────────────────────
  {
    ...NODE_WEB_DAYS[15],
    eTitle: "Timing-Safe String Comparison",
    eDesc: "Write `compareConstantTime(a: string, b: string): boolean` that compares two secret strings with constant-time execution loop to resist timing attacks.",
    eLanguage: "typescript",
    eStarter: lines("function compareConstantTime(a: string, b: string): boolean {", "  // Timing-safe string comparison", "  return false;", "}"),
    eHint: `if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;`,
    eTest: lines(
      "if (typeof compareConstantTime !== 'function') throw new Error('compareConstantTime not found');",
      "if (compareConstantTime('secret123', 'secret123') !== true) throw new Error('Matching strings should be true');",
      "if (compareConstantTime('secret123', 'secret124') !== false) throw new Error('Mismatch strings should be false');",
      "if (compareConstantTime('short', 'longerstring') !== false) throw new Error('Different length should be false');",
      "if (compareConstantTime('', '') !== true) throw new Error('Empty strings should match');"
    ),
    aTitle: "Validate Password Complexity Rules",
    aDesc: "Write `validatePasswordStrength(password: string): { valid: boolean; issues: string[] }` checking length >= 8, uppercase, lowercase, and digit.",
    aLanguage: "typescript",
    aStarter: lines("function validatePasswordStrength(password: string): { valid: boolean; issues: string[] } {", "  // Validate password complexity", "  return { valid: false, issues: [] };", "}"),
    aHint: `const issues: string[] = [];
  if (password.length < 8) issues.push('Must be at least 8 characters');
  if (!/[A-Z]/.test(password)) issues.push('Must contain uppercase letter');
  if (!/[a-z]/.test(password)) issues.push('Must contain lowercase letter');
  if (!/[0-9]/.test(password)) issues.push('Must contain digit');
  return { valid: issues.length === 0, issues };`,
    aTest: lines(
      "if (typeof validatePasswordStrength !== 'function') throw new Error('validatePasswordStrength not found');",
      "const p1 = validatePasswordStrength('P@ssword1');",
      "if (!p1.valid || p1.issues.length !== 0) throw new Error('Strong password failed');",
      "const p2 = validatePasswordStrength('weak');",
      "if (p2.valid || p2.issues.length < 2) throw new Error('Weak password should report multiple issues');",
      "const p3 = validatePasswordStrength('ALLCAPS123');",
      "if (p3.valid || !p3.issues.some(i => i.toLowerCase().includes('lower'))) throw new Error('Missing lowercase should be flagged');"
    )
  },

  // ── DAY 17: Stateful Sessions vs Stateless Bearer Tokens ──────────────────
  {
    ...NODE_WEB_DAYS[16],
    eTitle: "Extract Bearer Token from Authorization Header",
    eDesc: "Write `parseBearerToken(header: string | undefined): string | null` extracting the token from `'Bearer <token>'` (case-insensitive for 'Bearer').",
    eLanguage: "typescript",
    eStarter: lines("function parseBearerToken(header: string | undefined): string | null {", "  // Extract bearer token", "  return null;", "}"),
    eHint: `if (!header) return null;
  const match = header.match(/^Bearer\\s+(\\S+)$/i);
  return match ? match[1] : null;`,
    eTest: lines(
      "if (typeof parseBearerToken !== 'function') throw new Error('parseBearerToken not found');",
      "if (parseBearerToken('Bearer token123') !== 'token123') throw new Error('Failed token123');",
      "if (parseBearerToken('bearer my_secret_jwt') !== 'my_secret_jwt') throw new Error('Case insensitive failed');",
      "if (parseBearerToken('Basic dXNlcjpwYXNz') !== null) throw new Error('Basic auth should return null');",
      "if (parseBearerToken('Bearer ') !== null) throw new Error('Empty token should return null');",
      "if (parseBearerToken(undefined) !== null) throw new Error('Undefined header should return null');"
    ),
    aTitle: "Serialize Set-Cookie Header",
    aDesc: "Write `createSessionCookie(name: string, value: string, options?: { maxAge?: number; httpOnly?: boolean; secure?: boolean; sameSite?: 'Strict' | 'Lax' | 'None' }): string`.",
    aLanguage: "typescript",
    aStarter: lines("function createSessionCookie(name: string, value: string, options: { maxAge?: number; httpOnly?: boolean; secure?: boolean; sameSite?: 'Strict' | 'Lax' | 'None' } = {}): string {", "  // Serialize Set-Cookie header", "  return '';", "}"),
    aHint: `const parts = [name + '=' + encodeURIComponent(value)];
  if (options.maxAge !== undefined) parts.push('Max-Age=' + options.maxAge);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.secure) parts.push('Secure');
  if (options.sameSite) parts.push('SameSite=' + options.sameSite);
  return parts.join('; ');`,
    aTest: lines(
      "if (typeof createSessionCookie !== 'function') throw new Error('createSessionCookie not found');",
      "const c1 = createSessionCookie('sid', 'abc123xyz', { httpOnly: true, sameSite: 'Lax' });",
      "if (c1 !== 'sid=abc123xyz; HttpOnly; SameSite=Lax') throw new Error('Failed c1: ' + c1);",
      "const c2 = createSessionCookie('token', 'xyz', { secure: true, maxAge: 3600 });",
      "if (c2 !== 'token=xyz; Max-Age=3600; Secure') throw new Error('Failed c2: ' + c2);",
      "const c3 = createSessionCookie('simple', 'val');",
      "if (c3 !== 'simple=val') throw new Error('Failed simple: ' + c3);"
    )
  },

  // ── DAY 18: JSON Web Tokens (JWT) ─────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[17],
    eTitle: "Decode JWT Payload Claims",
    eDesc: "Write `parseJwtPayload(token: string): Record<string, unknown> | null` that decodes base64url payload segment to JSON.",
    eLanguage: "typescript",
    eStarter: lines("function parseJwtPayload(token: string): Record<string, unknown> | null {", "  // Decode JWT payload", "  return null;", "}"),
    eHint: `const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4 !== 0) b64 += '=';
    const json = Buffer.from(b64, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }`,
    eTest: lines(
      "if (typeof parseJwtPayload !== 'function') throw new Error('parseJwtPayload not found');",
      "const token = 'header.eyJzdWIiOiJ1c2VyMTIzIiwicm9sZSI6ImFkbWluIn0.signature';",
      "const payload = parseJwtPayload(token);",
      "if (!payload || payload.sub !== 'user123' || payload.role !== 'admin') throw new Error('Valid token payload decoding failed');",
      "if (parseJwtPayload('invalid.token') !== null) throw new Error('Token with < 3 parts should be null');",
      "if (parseJwtPayload('a.b.c') !== null) throw new Error('Malformed payload should be null');"
    ),
    aTitle: "Validate JWT Expiration Claim",
    aDesc: "Write `verifyJwtExpiration(payload: { exp?: number }, currentTimestampSeconds?: number): { valid: boolean; expired: boolean }`.",
    aLanguage: "typescript",
    aStarter: lines("function verifyJwtExpiration(payload: { exp?: number }, currentTimestampSeconds: number = Math.floor(Date.now() / 1000)): { valid: boolean; expired: boolean } {", "  // Verify exp claim", "  return { valid: false, expired: false };", "}"),
    aHint: `if (typeof payload.exp !== 'number') return { valid: false, expired: false };
  const expired = payload.exp <= currentTimestampSeconds;
  return { valid: !expired, expired };`,
    aTest: lines(
      "if (typeof verifyJwtExpiration !== 'function') throw new Error('verifyJwtExpiration not found');",
      "const r1 = verifyJwtExpiration({ exp: 2000 }, 1000);",
      "if (!r1.valid || r1.expired) throw new Error('Unexpired token should be valid');",
      "const r2 = verifyJwtExpiration({ exp: 1000 }, 1500);",
      "if (r2.valid || !r2.expired) throw new Error('Expired token should not be valid');",
      "const r3 = verifyJwtExpiration({}, 1000);",
      "if (r3.valid || r3.expired) throw new Error('Missing exp should have valid: false and expired: false');"
    )
  },

  // ── DAY 19: Role-Based Access Control (RBAC) & Route Guards ───────────────
  {
    ...NODE_WEB_DAYS[18],
    eTitle: "Evaluate Role Permission Matrix",
    eDesc: "Write `hasPermission(role: string, requiredPermission: string, rolePermissions: Record<string, string[]>): boolean` supporting wildcard `'*'`.",
    eLanguage: "typescript",
    eStarter: lines("function hasPermission(role: string, requiredPermission: string, rolePermissions: Record<string, string[]>): boolean {", "  // Check role permission matrix", "  return false;", "}"),
    eHint: `const perms = rolePermissions[role];
  if (!perms) return false;
  return perms.includes('*') || perms.includes(requiredPermission);`,
    eTest: lines(
      "if (typeof hasPermission !== 'function') throw new Error('hasPermission not found');",
      "const matrix = { admin: ['*'], editor: ['jobs:create', 'jobs:update'], viewer: ['jobs:read'] };",
      "if (hasPermission('admin', 'jobs:delete', matrix) !== true) throw new Error('Admin wildcard failed');",
      "if (hasPermission('editor', 'jobs:create', matrix) !== true) throw new Error('Editor specific perm failed');",
      "if (hasPermission('viewer', 'jobs:update', matrix) !== false) throw new Error('Viewer should not have jobs:update');",
      "if (hasPermission('guest', 'jobs:read', matrix) !== false) throw new Error('Unknown role should be false');"
    ),
    aTitle: "Authorize User Route Request",
    aDesc: "Write `authorizeRoute(user: { id: string; roles: string[] } | null, allowedRoles: string[]): { status: 200 | 401 | 403; message?: string }`.",
    aLanguage: "typescript",
    aStarter: lines("function authorizeRoute(user: { id: string; roles: string[] } | null, allowedRoles: string[]): { status: 200 | 401 | 403; message?: string } {", "  // Authorize user roles for route", "  return { status: 401 };", "}"),
    aHint: `if (!user) return { status: 401, message: 'Unauthorized' };
  const hasRole = user.roles.some(r => allowedRoles.includes(r));
  if (!hasRole) return { status: 403, message: 'Forbidden' };
  return { status: 200, message: 'Authorized' };`,
    aTest: lines(
      "if (typeof authorizeRoute !== 'function') throw new Error('authorizeRoute not found');",
      "if (authorizeRoute(null, ['admin']).status !== 401) throw new Error('Null user should be 401');",
      "const u1 = { id: 'u1', roles: ['viewer'] };",
      "if (authorizeRoute(u1, ['admin', 'editor']).status !== 403) throw new Error('Missing role should be 403');",
      "const u2 = { id: 'u2', roles: ['editor'] };",
      "if (authorizeRoute(u2, ['admin', 'editor']).status !== 200) throw new Error('Allowed role should be 200');"
    )
  },

  // ── DAY 20: API Security: Rate Limiting & Input Sanitization ──────────────
  {
    ...NODE_WEB_DAYS[19],
    eTitle: "Sliding Window Rate Limiter",
    eDesc: "Write `checkRateLimit(key: string, now: number, windowMs: number, maxRequests: number, store: Map<string, number[]>): { allowed: boolean; remaining: number; retryAfterMs: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function checkRateLimit(key: string, now: number, windowMs: number, maxRequests: number, store: Map<string, number[]>): { allowed: boolean; remaining: number; retryAfterMs: number } {", "  // Sliding window rate limiter", "  return { allowed: false, remaining: 0, retryAfterMs: 0 };", "}"),
    eHint: `const existing = store.get(key) || [];
  const valid = existing.filter(t => t > now - windowMs);
  if (valid.length >= maxRequests) {
    const oldest = valid[0];
    const retryAfterMs = oldest + windowMs - now;
    store.set(key, valid);
    return { allowed: false, remaining: 0, retryAfterMs };
  }
  valid.push(now);
  store.set(key, valid);
  return { allowed: true, remaining: maxRequests - valid.length, retryAfterMs: 0 };`,
    eTest: lines(
      "if (typeof checkRateLimit !== 'function') throw new Error('checkRateLimit not found');",
      "const store = new Map();",
      "const r1 = checkRateLimit('user1', 1000, 60000, 2, store);",
      "if (!r1.allowed || r1.remaining !== 1 || r1.retryAfterMs !== 0) throw new Error('First request failed');",
      "const r2 = checkRateLimit('user1', 2000, 60000, 2, store);",
      "if (!r2.allowed || r2.remaining !== 0) throw new Error('Second request failed');",
      "const r3 = checkRateLimit('user1', 3000, 60000, 2, store);",
      "if (r3.allowed || r3.retryAfterMs !== 58000) throw new Error('Third request should be blocked with retryAfterMs: 58000');",
      "const r4 = checkRateLimit('user2', 3000, 60000, 2, store);",
      "if (!r4.allowed || r4.remaining !== 1) throw new Error('Independent key should be allowed');"
    ),
    aTitle: "Sanitize Text Input against HTML Injection",
    aDesc: "Write `sanitizeHtmlInput(input: string): string` replacing &, <, >, \", ' with safe HTML entities.",
    aLanguage: "typescript",
    aStarter: lines("function sanitizeHtmlInput(input: string): string {", "  // Escape HTML entities", "  return '';", "}"),
    aHint: `return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');`,
    aTest: lines(
      "if (typeof sanitizeHtmlInput !== 'function') throw new Error('sanitizeHtmlInput not found');",
      "if (sanitizeHtmlInput('<script>alert(\"xss\")</script>') !== '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;') throw new Error('Script tag sanitization failed');",
      "if (sanitizeHtmlInput(\"Tom & Jerry's\") !== 'Tom &amp; Jerry&#39;s') throw new Error('Ampersand and quote failed');",
      "if (sanitizeHtmlInput('Hello World!') !== 'Hello World!') throw new Error('Clean string altered');"
    )
  },

  // ── DAY 21: Data Access Layer & In-Memory Repository ───────────────────────
  // ── DAY 21: Worker Threads, Thread Pools & CPU-Bound Parallelism ──────────
  {
    ...NODE_WEB_DAYS[20],
    eTitle: "ThreadPool Task Dispatcher & Sizing",
    eDesc: "Write `calculateThreadPoolMetrics(numCpuCores: number, activeTasks: number, maxQueueDepth: number): { optimalPoolSize: number; queueSaturationRatio: number; requiresBackpressure: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateThreadPoolMetrics(numCpuCores: number, activeTasks: number, maxQueueDepth: number): { optimalPoolSize: number; queueSaturationRatio: number; requiresBackpressure: boolean } {",
      "  // Calculate thread pool capacity and backpressure state",
      "  return { optimalPoolSize: 0, queueSaturationRatio: 0, requiresBackpressure: false };",
      "}"
    ),
    eHint: `const optimalPoolSize = Math.max(1, numCpuCores);
  const queueSaturationRatio = Math.round((activeTasks / maxQueueDepth) * 100) / 100;
  const requiresBackpressure = activeTasks >= maxQueueDepth;
  return { optimalPoolSize, queueSaturationRatio, requiresBackpressure };`,
    eTest: lines(
      "if (typeof calculateThreadPoolMetrics !== 'function') throw new Error('calculateThreadPoolMetrics not found');",
      "const m1 = calculateThreadPoolMetrics(8, 50, 100);",
      "if (m1.optimalPoolSize !== 8 || m1.queueSaturationRatio !== 0.5 || m1.requiresBackpressure !== false) throw new Error('m1 failed');",
      "const m2 = calculateThreadPoolMetrics(4, 100, 100);",
      "if (m2.requiresBackpressure !== true || m2.queueSaturationRatio !== 1) throw new Error('m2 failed');"
    ),
    aTitle: "Structured Clone Transfer Payload Builder",
    aDesc: "Write `sanitizeWorkerTransferPayload(payload: Record<string, any>): { transferableKeys: string[]; cloneablePayload: Record<string, any> }` that identifies ArrayBuffer keys.",
    aLanguage: "typescript",
    aStarter: lines(
      "function sanitizeWorkerTransferPayload(payload: Record<string, any>): { transferableKeys: string[]; cloneablePayload: Record<string, any> } {",
      "  // Separate ArrayBuffers for zero-copy transfer",
      "  return { transferableKeys: [], cloneablePayload: {} };",
      "}"
    ),
    aHint: `const transferableKeys: string[] = [];
  const cloneablePayload: Record<string, any> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v instanceof ArrayBuffer || (v && v.constructor && v.constructor.name === 'ArrayBuffer')) {
      transferableKeys.push(k);
      cloneablePayload[k] = v;
    } else {
      cloneablePayload[k] = v;
    }
  }
  return { transferableKeys, cloneablePayload };`,
    aTest: lines(
      "if (typeof sanitizeWorkerTransferPayload !== 'function') throw new Error('sanitizeWorkerTransferPayload not found');",
      "const buf = new ArrayBuffer(16);",
      "const res = sanitizeWorkerTransferPayload({ id: 'task_1', buffer: buf, retries: 3 });",
      "if (res.transferableKeys.length !== 1 || res.transferableKeys[0] !== 'buffer') throw new Error('Transferable identification failed');",
      "if (res.cloneablePayload.id !== 'task_1') throw new Error('Payload extraction failed');",
      "const b2 = new ArrayBuffer(8);",
      "const b3 = new ArrayBuffer(32);",
      "const res2 = sanitizeWorkerTransferPayload({ a: b2, b: b3, count: 5 });",
      "if (res2.transferableKeys.length !== 2) throw new Error('Multiple transferables failed');",
      "const res3 = sanitizeWorkerTransferPayload({ name: 'zero_buffers', active: true });",
      "if (res3.transferableKeys.length !== 0) throw new Error('Zero transferables failed');"
    )
  },

  // ── DAY 22: SharedArrayBuffer, Atomics & Zero-Copy Memory Concurrency ──────
  {
    ...NODE_WEB_DAYS[21],
    eTitle: "Atomic Compare-Exchange SpinLock",
    eDesc: "Write `simulateAtomicLock(stateArray: Int32Array, lockIndex: number, expectedVal: number, newVal: number): { acquired: boolean; priorState: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function simulateAtomicLock(stateArray: Int32Array, lockIndex: number, expectedVal: number, newVal: number): { acquired: boolean; priorState: number } {",
      "  // Execute atomic compare and exchange",
      "  return { acquired: false, priorState: 0 };",
      "}"
    ),
    eHint: `const priorState = Atomics.compareExchange(stateArray, lockIndex, expectedVal, newVal);
  const acquired = priorState === expectedVal;
  return { acquired, priorState };`,
    eTest: lines(
      "if (typeof simulateAtomicLock !== 'function') throw new Error('simulateAtomicLock not found');",
      "const sab = new SharedArrayBuffer(16);",
      "const arr = new Int32Array(sab);",
      "const r1 = simulateAtomicLock(arr, 0, 0, 1);",
      "if (!r1.acquired || r1.priorState !== 0) throw new Error('Lock 1 should acquire');",
      "const r2 = simulateAtomicLock(arr, 0, 0, 1);",
      "if (r2.acquired || r2.priorState !== 1) throw new Error('Lock 2 should fail to acquire');"
    ),
    aTitle: "Power-of-Two Circular Ring Buffer Pointers",
    aDesc: "Write `advanceRingBufferPointer(currentPointer: number, capacityPowerOfTwo: number): { nextPointer: number; physicalIndex: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function advanceRingBufferPointer(currentPointer: number, capacityPowerOfTwo: number): { nextPointer: number; physicalIndex: number } {",
      "  // Calculate next monotonic pointer and bitwise masked slot index",
      "  return { nextPointer: 0, physicalIndex: 0 };",
      "}"
    ),
    aHint: `const nextPointer = currentPointer + 1;
  const physicalIndex = currentPointer & (capacityPowerOfTwo - 1);
  return { nextPointer, physicalIndex };`,
    aTest: lines(
      "if (typeof advanceRingBufferPointer !== 'function') throw new Error('advanceRingBufferPointer not found');",
      "const p1 = advanceRingBufferPointer(0, 16);",
      "if (p1.nextPointer !== 1 || p1.physicalIndex !== 0) throw new Error('p1 failed');",
      "const p2 = advanceRingBufferPointer(15, 16);",
      "if (p2.nextPointer !== 16 || p2.physicalIndex !== 15) throw new Error('p2 failed');",
      "const p3 = advanceRingBufferPointer(16, 16);",
      "if (p3.nextPointer !== 17 || p3.physicalIndex !== 0) throw new Error('p3 failed to wrap');"
    )
  },

  // ── DAY 23: Process Clustering, OS Core Saturation & Zero-Downtime Reloads ──
  {
    ...NODE_WEB_DAYS[22],
    eTitle: "Round-Robin Cluster Worker Scheduler",
    eDesc: "Write `selectClusterWorker(workerPids: number[], currentCounter: number): { selectedPid: number; nextCounter: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function selectClusterWorker(workerPids: number[], currentCounter: number): { selectedPid: number; nextCounter: number } {",
      "  // Select next worker using round-robin scheduling",
      "  return { selectedPid: 0, nextCounter: 0 };",
      "}"
    ),
    eHint: `const index = currentCounter % workerPids.length;
  const selectedPid = workerPids[index];
  const nextCounter = currentCounter + 1;
  return { selectedPid, nextCounter };`,
    eTest: lines(
      "if (typeof selectClusterWorker !== 'function') throw new Error('selectClusterWorker not found');",
      "const pids = [1001, 1002, 1003, 1004];",
      "const w1 = selectClusterWorker(pids, 0);",
      "if (w1.selectedPid !== 1001 || w1.nextCounter !== 1) throw new Error('w1 failed');",
      "const w4 = selectClusterWorker(pids, 3);",
      "if (w4.selectedPid !== 1004 || w4.nextCounter !== 4) throw new Error('w4 failed');",
      "const w5 = selectClusterWorker(pids, 4);",
      "if (w5.selectedPid !== 1001 || w5.nextCounter !== 5) throw new Error('w5 failed wrap');"
    ),
    aTitle: "Rolling Reload Sequential Worker Swapper",
    aDesc: "Write `simulateRollingReload(activeWorkerPids: number[]): { retiredPids: number[]; spawnedPids: number[]; stepsTaken: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function simulateRollingReload(activeWorkerPids: number[]): { retiredPids: number[]; spawnedPids: number[]; stepsTaken: number } {",
      "  // Replace workers sequentially without downtime",
      "  return { retiredPids: [], spawnedPids: [], stepsTaken: 0 };",
      "}"
    ),
    aHint: `const retiredPids: number[] = [];
  const spawnedPids: number[] = [];
  let nextPid = 2000;
  for (const pid of activeWorkerPids) {
    spawnedPids.push(nextPid++);
    retiredPids.push(pid);
  }
  return { retiredPids, spawnedPids, stepsTaken: activeWorkerPids.length };`,
    aTest: lines(
      "if (typeof simulateRollingReload !== 'function') throw new Error('simulateRollingReload not found');",
      "const reload = simulateRollingReload([101, 102, 103]);",
      "if (reload.retiredPids.length !== 3 || reload.spawnedPids.length !== 3) throw new Error('Reload counts failed');",
      "if (reload.stepsTaken !== 3) throw new Error('Steps taken should match count');",
      "const r2 = simulateRollingReload([501]);",
      "if (r2.retiredPids.length !== 1 || r2.stepsTaken !== 1 || r2.retiredPids[0] !== 501) throw new Error('Single reload failed');",
      "const r3 = simulateRollingReload([10, 20, 30, 40, 50]);",
      "if (r3.retiredPids.length !== 5 || r3.stepsTaken !== 5 || r3.retiredPids[4] !== 50) throw new Error('Five reload failed');"
    )
  },

  // ── DAY 24: Process Orchestration: child_process (spawn/fork/exec) ─────────
  {
    ...NODE_WEB_DAYS[23],
    eTitle: "Secure Command Argument Array Builder",
    eDesc: "Write `buildSecureCommandArgs(binary: string, userArgs: string[]): { safeBinary: string; sanitizedArgs: string[] }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function buildSecureCommandArgs(binary: string, userArgs: string[]): { safeBinary: string; sanitizedArgs: string[] } {",
      "  // Validate binary and enforce double-dash parameter boundary",
      "  return { safeBinary: '', sanitizedArgs: [] };",
      "}"
    ),
    eHint: `if (/[;&|<>\\$]/.test(binary) || binary.indexOf(String.fromCharCode(96)) !== -1) {
    throw new Error('COMMAND_INJECTION_DETECTED: Disallowed shell characters in binary');
  }
  return {
    safeBinary: binary.trim(),
    sanitizedArgs: ['--', ...userArgs]
  };`,
    eTest: lines(
      "if (typeof buildSecureCommandArgs !== 'function') throw new Error('buildSecureCommandArgs not found');",
      "const safe = buildSecureCommandArgs('git', ['checkout', 'feature-branch']);",
      "if (safe.safeBinary !== 'git' || safe.sanitizedArgs[0] !== '--' || safe.sanitizedArgs[1] !== 'checkout') throw new Error('Safe build failed');",
      "let threw = false;",
      "try { buildSecureCommandArgs('git; rm -rf /', []); } catch (e) { threw = true; }",
      "if (!threw) throw new Error('Should reject shell injection metacharacters');"
    ),
    aTitle: "Process Group Signal Dispatcher",
    aDesc: "Write `buildProcessGroupSignal(pid: number, signal: string, targetEntireGroup: boolean): { targetPid: number; signal: string }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function buildProcessGroupSignal(pid: number, signal: string, targetEntireGroup: boolean): { targetPid: number; signal: string } {",
      "  // Construct signal payload with negative PID for process groups",
      "  return { targetPid: 0, signal: '' };",
      "}"
    ),
    aHint: `const targetPid = targetEntireGroup ? -Math.abs(pid) : Math.abs(pid);
  return { targetPid, signal };`,
    aTest: lines(
      "if (typeof buildProcessGroupSignal !== 'function') throw new Error('buildProcessGroupSignal not found');",
      "const s1 = buildProcessGroupSignal(5012, 'SIGTERM', false);",
      "if (s1.targetPid !== 5012 || s1.signal !== 'SIGTERM') throw new Error('s1 failed');",
      "const s2 = buildProcessGroupSignal(5012, 'SIGKILL', true);",
      "if (s2.targetPid !== -5012 || s2.signal !== 'SIGKILL') throw new Error('s2 failed');"
    )
  },

  // ── DAY 25: Distributed Task Pipelines: Redis Job Queues & BullMQ ─────────
  {
    ...NODE_WEB_DAYS[24],
    eTitle: "Exponential Backoff with Full Jitter Calculator",
    eDesc: "Write `calculateRetryDelay(baseDelayMs: number, attempt: number, maxDelayMs: number, jitterRatio: number): { ceilingDelayMs: number; finalDelayMs: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateRetryDelay(baseDelayMs: number, attempt: number, maxDelayMs: number, jitterRatio: number): { ceilingDelayMs: number; finalDelayMs: number } {",
      "  // Calculate exponential ceiling and apply full random jitter ratio",
      "  return { ceilingDelayMs: 0, finalDelayMs: 0 };",
      "}"
    ),
    eHint: `const raw = baseDelayMs * Math.pow(2, attempt - 1);
  const ceilingDelayMs = Math.min(raw, maxDelayMs);
  const finalDelayMs = Math.floor(ceilingDelayMs * jitterRatio);
  return { ceilingDelayMs, finalDelayMs };`,
    eTest: lines(
      "if (typeof calculateRetryDelay !== 'function') throw new Error('calculateRetryDelay not found');",
      "const d1 = calculateRetryDelay(1000, 1, 60000, 0.5);",
      "if (d1.ceilingDelayMs !== 1000 || d1.finalDelayMs !== 500) throw new Error('d1 failed');",
      "const d3 = calculateRetryDelay(1000, 3, 60000, 0.75);",
      "if (d3.ceilingDelayMs !== 4000 || d3.finalDelayMs !== 3000) throw new Error('d3 failed');",
      "const d10 = calculateRetryDelay(1000, 10, 30000, 1.0);",
      "if (d10.ceilingDelayMs !== 30000 || d10.finalDelayMs !== 30000) throw new Error('Max ceiling failed');"
    ),
    aTitle: "Redis Idempotency Key Lock Command Builder",
    aDesc: "Write `buildIdempotencyLockCommand(scope: string, identifier: string, ttlSeconds: number): { redisKey: string; command: string[] }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function buildIdempotencyLockCommand(scope: string, identifier: string, ttlSeconds: number): { redisKey: string; command: string[] } {",
      "  // Build SET NX EX command tuple for atomic distributed lock",
      "  return { redisKey: '', command: [] };",
      "}"
    ),
    aHint: `const redisKey = 'idempotency:' + scope + ':' + identifier;
  const command = ['SET', redisKey, 'LOCKED', 'NX', 'EX', String(ttlSeconds)];
  return { redisKey, command };`,
    aTest: lines(
      "if (typeof buildIdempotencyLockCommand !== 'function') throw new Error('buildIdempotencyLockCommand not found');",
      "const cmd = buildIdempotencyLockCommand('payments', 'order_9812', 3600);",
      "if (cmd.redisKey !== 'idempotency:payments:order_9812') throw new Error('Key format failed');",
      "if (cmd.command.length !== 6 || cmd.command[3] !== 'NX' || cmd.command[5] !== '3600') throw new Error('Redis command tuple failed');",
      "const cmd2 = buildIdempotencyLockCommand('auth', 'sess_1', 60);",
      "if (cmd2.redisKey !== 'idempotency:auth:sess_1') throw new Error('cmd2 redisKey failed');",
      "if (cmd2.command[5] !== '60') throw new Error('cmd2 ttl failed');",
      "const cmd3 = buildIdempotencyLockCommand('billing', 'inv_99', 120);",
      "if (cmd3.redisKey !== 'idempotency:billing:inv_99') throw new Error('cmd3 failed');"
    )
  },
  // ── DAY 26: Protocol Buffers, gRPC & HTTP/3 QUIC Transport Architecture ──
  {
    ...NODE_WEB_DAYS[25],
    eTitle: "Varint ZigZag Integer Codec",
    eDesc: "Write `processZigZag32(n: number): { encoded: number; decoded: number }` implementing Protocol Buffers 32-bit zigzag transformation and inverse decoding.",
    eLanguage: "typescript",
    eStarter: lines(
      "function processZigZag32(n: number): { encoded: number; decoded: number } {",
      "  // Encode signed int n to unsigned zigzag int, and decode back",
      "  return { encoded: 0, decoded: 0 };",
      "}"
    ),
    eHint: `const encoded = ((n << 1) ^ (n >> 31)) >>> 0;
  const decoded = (encoded >>> 1) ^ -(encoded & 1);
  return { encoded, decoded };`,
    eTest: lines(
      "if (typeof processZigZag32 !== 'function') throw new Error('processZigZag32 not found');",
      "const r0 = processZigZag32(0);",
      "if (r0.encoded !== 0 || r0.decoded !== 0) throw new Error('0 failed');",
      "const r1 = processZigZag32(-1);",
      "if (r1.encoded !== 1 || r1.decoded !== -1) throw new Error('-1 failed');",
      "const r2 = processZigZag32(1);",
      "if (r2.encoded !== 2 || r2.decoded !== 1) throw new Error('1 failed');",
      "const r3 = processZigZag32(-2);",
      "if (r3.encoded !== 3 || r3.decoded !== -2) throw new Error('-2 failed');",
      "const r4 = processZigZag32(2147483647);",
      "if (r4.decoded !== 2147483647) throw new Error('max int failed');"
    ),
    aTitle: "gRPC Framing 5-Byte Prefix Builder",
    aDesc: "Write `buildGrpcPrefix(compressed: boolean, payloadByteLength: number): { hexPrefix: string; totalFrameBytes: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function buildGrpcPrefix(compressed: boolean, payloadByteLength: number): { hexPrefix: string; totalFrameBytes: number } {",
      "  // Generate 5-byte gRPC framing prefix (1-byte flag + 4-byte length)",
      "  return { hexPrefix: '', totalFrameBytes: 0 };",
      "}"
    ),
    aHint: `const flagHex = compressed ? '01' : '00';
  const lenHex = payloadByteLength.toString(16).padStart(8, '0');
  const hexPrefix = flagHex + lenHex;
  const totalFrameBytes = 5 + payloadByteLength;
  return { hexPrefix, totalFrameBytes };`,
    aTest: lines(
      "if (typeof buildGrpcPrefix !== 'function') throw new Error('buildGrpcPrefix not found');",
      "const f1 = buildGrpcPrefix(false, 72);",
      "if (f1.hexPrefix !== '0000000048' || f1.totalFrameBytes !== 77) throw new Error('f1 failed');",
      "const f2 = buildGrpcPrefix(true, 1024);",
      "if (f2.hexPrefix !== '0100000400' || f2.totalFrameBytes !== 1029) throw new Error('f2 failed');"
    )
  },

  // ── DAY 27: OpenTelemetry, Distributed Tracing & Production APM Architecture
  {
    ...NODE_WEB_DAYS[26],
    eTitle: "W3C Traceparent Header Parser",
    eDesc: "Write `parseTraceparent(header: string): { valid: boolean; traceId?: string; spanId?: string; sampled?: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function parseTraceparent(header: string): { valid: boolean; traceId?: string; spanId?: string; sampled?: boolean } {",
      "  // Parse and validate W3C traceparent header",
      "  return { valid: false };",
      "}"
    ),
    eHint: `const parts = header.trim().split('-');
  if (parts.length !== 4) return { valid: false };
  const [version, traceId, spanId, flags] = parts;
  if (version !== '00') return { valid: false };
  if (!/^[0-9a-f]{32}$/.test(traceId) || /^0+$/.test(traceId)) return { valid: false };
  if (!/^[0-9a-f]{16}$/.test(spanId) || /^0+$/.test(spanId)) return { valid: false };
  if (!/^[0-9a-f]{2}$/.test(flags)) return { valid: false };
  const sampled = (parseInt(flags, 16) & 1) === 1;
  return { valid: true, traceId, spanId, sampled };`,
    eTest: lines(
      "if (typeof parseTraceparent !== 'function') throw new Error('parseTraceparent not found');",
      "const validH = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';",
      "const p1 = parseTraceparent(validH);",
      "if (!p1.valid || p1.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736' || p1.spanId !== '00f067aa0ba902b7' || p1.sampled !== true) throw new Error('p1 failed');",
      "const p2 = parseTraceparent('00-00000000000000000000000000000000-00f067aa0ba902b7-01');",
      "if (p2.valid !== false) throw new Error('p2 should reject all-zeros traceId');"
    ),
    aTitle: "Distributed Trace Bottleneck Span Finder",
    aDesc: "Write `findCriticalPathBottleneck(spans: Array<{ spanId: string; parentSpanId?: string; durationMs: number }>): { bottleneckSpanId: string; maxDurationMs: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function findCriticalPathBottleneck(spans: Array<{ spanId: string; parentSpanId?: string; durationMs: number }>): { bottleneckSpanId: string; maxDurationMs: number } {",
      "  // Identify longest leaf operation in distributed trace tree",
      "  return { bottleneckSpanId: '', maxDurationMs: 0 };",
      "}"
    ),
    aHint: `const parentSpanIds = new Set(spans.map(s => s.parentSpanId).filter(Boolean));
  const leafSpans = spans.filter(s => !parentSpanIds.has(s.spanId));
  if (leafSpans.length === 0) return { bottleneckSpanId: '', maxDurationMs: 0 };
  let bottleneck = leafSpans[0];
  for (let i = 1; i < leafSpans.length; i++) {
    if (leafSpans[i].durationMs > bottleneck.durationMs) {
      bottleneck = leafSpans[i];
    }
  }
  return { bottleneckSpanId: bottleneck.spanId, maxDurationMs: bottleneck.durationMs };`,
    aTest: lines(
      "if (typeof findCriticalPathBottleneck !== 'function') throw new Error('findCriticalPathBottleneck not found');",
      "const spans = [",
      "  { spanId: 'root', durationMs: 4000 },",
      "  { spanId: 'db_query', parentSpanId: 'root', durationMs: 3800 },",
      "  { spanId: 'cache_get', parentSpanId: 'root', durationMs: 50 }",
      "];",
      "const res = findCriticalPathBottleneck(spans);",
      "if (res.bottleneckSpanId !== 'db_query' || res.maxDurationMs !== 3800) throw new Error('Bottleneck leaf identification failed');",
      "const spans2 = [",
      "  { spanId: 'root', durationMs: 1200 },",
      "  { spanId: 'rpc_call', parentSpanId: 'root', durationMs: 950 },",
      "  { spanId: 'redis_hget', parentSpanId: 'root', durationMs: 120 }",
      "];",
      "const res2 = findCriticalPathBottleneck(spans2);",
      "if (res2.bottleneckSpanId !== 'rpc_call' || res2.maxDurationMs !== 950) throw new Error('res2 failed');"
    )
  },

  // ── DAY 28: Distributed Rate Limiting, Traffic Shaping & Leaky Bucket Algorithms
  {
    ...NODE_WEB_DAYS[27],
    eTitle: "Token Bucket Concurrency Refill Engine",
    eDesc: "Write `computeTokenRefill(capacity: number, refillRatePerSec: number, currentTokens: number, elapsedMs: number, requestedTokens: number): { allowed: boolean; remainingTokens: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function computeTokenRefill(capacity: number, refillRatePerSec: number, currentTokens: number, elapsedMs: number, requestedTokens: number): { allowed: boolean; remainingTokens: number } {",
      "  // Calculate refilled tokens and evaluate request allowance",
      "  return { allowed: false, remainingTokens: 0 };",
      "}"
    ),
    eHint: `const addedTokens = (elapsedMs / 1000) * refillRatePerSec;
  const availableTokens = Math.min(capacity, currentTokens + addedTokens);
  if (availableTokens >= requestedTokens) {
    return { allowed: true, remainingTokens: availableTokens - requestedTokens };
  }
  return { allowed: false, remainingTokens: availableTokens };`,
    eTest: lines(
      "if (typeof computeTokenRefill !== 'function') throw new Error('computeTokenRefill not found');",
      "const r1 = computeTokenRefill(10, 2, 5, 2000, 4);",
      "if (!r1.allowed || r1.remainingTokens !== 5) throw new Error('r1 failed');",
      "const r2 = computeTokenRefill(10, 2, 1, 500, 3);",
      "if (r2.allowed !== false || r2.remainingTokens !== 2) throw new Error('r2 should reject');"
    ),
    aTitle: "Redis Sliding Window Score Boundary Calculator",
    aDesc: "Write `calculateSlidingWindowBounds(windowSizeMs: number, currentTimestampMs: number): { minScore: string; maxScore: number; currentScore: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateSlidingWindowBounds(windowSizeMs: number, currentTimestampMs: number): { minScore: string; maxScore: number; currentScore: number } {",
      "  // Calculate zremrangebyscore purge boundary and current score",
      "  return { minScore: '', maxScore: 0, currentScore: 0 };",
      "}"
    ),
    aHint: `return {
    minScore: '-inf',
    maxScore: currentTimestampMs - windowSizeMs,
    currentScore: currentTimestampMs
  };`,
    aTest: lines(
      "if (typeof calculateSlidingWindowBounds !== 'function') throw new Error('calculateSlidingWindowBounds not found');",
      "const b1 = calculateSlidingWindowBounds(60000, 1700000000000);",
      "if (b1.minScore !== '-inf' || b1.maxScore !== 1699999940000 || b1.currentScore !== 1700000000000) throw new Error('b1 bounds calculation failed');",
      "const b2 = calculateSlidingWindowBounds(10000, 100000);",
      "if (b2.maxScore !== 90000 || b2.currentScore !== 100000) throw new Error('b2 failed');"
    )
  },

  // ── DAY 29: Resilience Patterns: Circuit Breakers, Bulkheads & Graceful Shutdown
  {
    ...NODE_WEB_DAYS[28],
    eTitle: "Circuit Breaker 3-State FSM Transition Evaluator",
    eDesc: "Write `evaluateBreakerTransition(currentState: 'CLOSED' | 'OPEN' | 'HALF_OPEN', consecutiveFailures: number, threshold: number, tripTimestampMs: number, resetTimeoutMs: number, nowMs: number): { nextState: 'CLOSED' | 'OPEN' | 'HALF_OPEN'; shouldTrip: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function evaluateBreakerTransition(currentState: 'CLOSED' | 'OPEN' | 'HALF_OPEN', consecutiveFailures: number, threshold: number, tripTimestampMs: number, resetTimeoutMs: number, nowMs: number): { nextState: 'CLOSED' | 'OPEN' | 'HALF_OPEN'; shouldTrip: boolean } {",
      "  // Evaluate 3-state transition triggers",
      "  return { nextState: currentState, shouldTrip: false };",
      "}"
    ),
    eHint: `if (currentState === 'CLOSED') {
    if (consecutiveFailures >= threshold) {
      return { nextState: 'OPEN', shouldTrip: true };
    }
    return { nextState: 'CLOSED', shouldTrip: false };
  }
  if (currentState === 'OPEN') {
    if (nowMs >= tripTimestampMs + resetTimeoutMs) {
      return { nextState: 'HALF_OPEN', shouldTrip: false };
    }
    return { nextState: 'OPEN', shouldTrip: false };
  }
  return { nextState: 'HALF_OPEN', shouldTrip: false };`,
    eTest: lines(
      "if (typeof evaluateBreakerTransition !== 'function') throw new Error('evaluateBreakerTransition not found');",
      "const t1 = evaluateBreakerTransition('CLOSED', 3, 3, 0, 1000, 500);",
      "if (t1.nextState !== 'OPEN' || !t1.shouldTrip) throw new Error('t1 trip failed');",
      "const t2 = evaluateBreakerTransition('OPEN', 3, 3, 1000, 1000, 2050);",
      "if (t2.nextState !== 'HALF_OPEN' || t2.shouldTrip) throw new Error('t2 half-open reset failed');"
    ),
    aTitle: "Bulkhead Resource Pool Limiter",
    aDesc: "Write `evaluateBulkheadAllocation(serviceName: string, activeCount: number, maxConcurrent: number): { permitted: boolean; activeCount: number; saturationPct: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function evaluateBulkheadAllocation(serviceName: string, activeCount: number, maxConcurrent: number): { permitted: boolean; activeCount: number; saturationPct: number } {",
      "  // Check bulkhead capacity limits",
      "  return { permitted: false, activeCount: 0, saturationPct: 0 };",
      "}"
    ),
    aHint: `const permitted = activeCount < maxConcurrent;
  const saturationPct = Math.round((activeCount / maxConcurrent) * 100);
  return { permitted, activeCount: permitted ? activeCount + 1 : activeCount, saturationPct };`,
    aTest: lines(
      "if (typeof evaluateBulkheadAllocation !== 'function') throw new Error('evaluateBulkheadAllocation not found');",
      "const b1 = evaluateBulkheadAllocation('Payment', 4, 10);",
      "if (!b1.permitted || b1.activeCount !== 5 || b1.saturationPct !== 40) throw new Error('b1 failed');",
      "const b2 = evaluateBulkheadAllocation('Recommendation', 5, 5);",
      "if (b2.permitted !== false || b2.activeCount !== 5 || b2.saturationPct !== 100) throw new Error('b2 should reject on full capacity');"
    )
  },

  // ── DAY 30: Staff Backend Capstone: Production Edge Gateway Architecture ────
  {
    ...NODE_WEB_DAYS[29],
    eTitle: "Hop-by-Hop Header Sanitizer & Tracing Injector",
    eDesc: "Write `sanitizeGatewayHeaders(inbound: Record<string, string>, clientIp: string, requestId: string): Record<string, string>`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function sanitizeGatewayHeaders(inbound: Record<string, string>, clientIp: string, requestId: string): Record<string, string> {",
      "  // Strip RFC 7230 hop-by-hop headers and inject distributed context",
      "  return {};",
      "}"
    ),
    eHint: `const hopByHop = new Set([
    'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
    'te', 'trailer', 'transfer-encoding', 'upgrade'
  ]);
  const outbound: Record<string, string> = {};
  for (const [k, v] of Object.entries(inbound)) {
    const lk = k.toLowerCase();
    if (!hopByHop.has(lk)) {
      outbound[lk] = v;
    }
  }
  const prevXff = inbound['x-forwarded-for'] || inbound['X-Forwarded-For'];
  outbound['x-forwarded-for'] = prevXff ? prevXff + ', ' + clientIp : clientIp;
  outbound['x-forwarded-proto'] = 'https';
  outbound['x-request-id'] = requestId;
  return outbound;`,
    eTest: lines(
      "if (typeof sanitizeGatewayHeaders !== 'function') throw new Error('sanitizeGatewayHeaders not found');",
      "const raw = { 'Host': 'api.domain.com', 'Connection': 'keep-alive', 'Upgrade': 'websocket', 'Authorization': 'Bearer tok' };",
      "const clean = sanitizeGatewayHeaders(raw, '1.2.3.4', 'req_101');",
      "if (clean['connection'] || clean['upgrade']) throw new Error('Hop-by-hop headers not stripped');",
      "if (clean['authorization'] !== 'Bearer tok') throw new Error('End-to-end header lost');",
      "if (clean['x-forwarded-for'] !== '1.2.3.4' || clean['x-request-id'] !== 'req_101') throw new Error('Injected context missing');",
      "const raw2 = { 'Host': 'svc.internal', 'Authorization': 'Basic xyz' };",
      "const clean2 = sanitizeGatewayHeaders(raw2, '10.0.0.1', 'req_202');",
      "if (clean2['x-forwarded-for'] !== '10.0.0.1' || clean2['x-request-id'] !== 'req_202') throw new Error('clean2 failed');"
    ),
    aTitle: "Power of Two Choices (P2C) Node Selector",
    aDesc: "Write `selectNodeP2C(nodes: Array<{ id: string; isHealthy: boolean; activeConnections: number }>, indexA: number, indexB: number): string | null`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function selectNodeP2C(nodes: Array<{ id: string; isHealthy: boolean; activeConnections: number }>, indexA: number, indexB: number): string | null {",
      "  // Select healthy node with fewer active connections via P2C",
      "  return null;",
      "}"
    ),
    aHint: `const healthy = nodes.filter(n => n.isHealthy);
  if (healthy.length === 0) return null;
  if (healthy.length === 1) return healthy[0].id;
  const nodeA = healthy[indexA % healthy.length];
  const nodeB = healthy[indexB % healthy.length];
  return nodeA.activeConnections <= nodeB.activeConnections ? nodeA.id : nodeB.id;`,
    aTest: lines(
      "if (typeof selectNodeP2C !== 'function') throw new Error('selectNodeP2C not found');",
      "const nodes = [",
      "  { id: 'node-1', isHealthy: true, activeConnections: 10 },",
      "  { id: 'node-2', isHealthy: false, activeConnections: 0 },",
      "  { id: 'node-3', isHealthy: true, activeConnections: 4 }",
      "];",
      "const s1 = selectNodeP2C(nodes, 0, 1);",
      "if (s1 !== 'node-3') throw new Error('P2C should select node-3 with 4 active connections');",
      "const s2 = selectNodeP2C([{ id: 'bad', isHealthy: false, activeConnections: 0 }], 0, 0);",
      "if (s2 !== null) throw new Error('Should return null if no healthy nodes');"
    )
  }
,
  {
    ...NODE_WEB_DAYS[30],
    eTitle: "Calculate Event Loop Lag",
    eDesc: "Write `calculateEventLoopLag(expectedMs: number, actualMs: number): { lagMs: number; status: string }` returning lagMs and status 'SATURATED' if lagMs > 20, else 'HEALTHY'.",
    eLanguage: "typescript",
    eStarter: lines("function calculateEventLoopLag(expectedMs, actualMs) {", "  // Return lag metrics", "  return { lagMs: 0, status: 'HEALTHY' };", "}"),
    eHint: "const lagMs = Math.max(0, actualMs - expectedMs); return { lagMs, status: lagMs > 20 ? 'SATURATED' : 'HEALTHY' };",
    eTest: lines(
      "if (typeof calculateEventLoopLag !== 'function') throw new Error('calculateEventLoopLag not found');",
      "const r1 = calculateEventLoopLag(10, 12);",
      "if (r1.lagMs !== 2 || r1.status !== 'HEALTHY') throw new Error('Failed r1');",
      "const r2 = calculateEventLoopLag(10, 35);",
      "if (r2.lagMs !== 25 || r2.status !== 'SATURATED') throw new Error('Failed r2');"
    ),
    aTitle: "Format Worker Task Payload",
    aDesc: "Write `formatWorkerTaskPayload(taskId: string, payload: any): { id: string; timestamp: number; payload: any }` with ISO timestamp.",
    aLanguage: "typescript",
    aStarter: lines("function formatWorkerTaskPayload(taskId, payload) {", "  // Return worker payload", "  return { id: '', timestamp: 0, payload: null };", "}"),
    aHint: "return { id: taskId, timestamp: 1710000000000, payload };",
    aTest: lines(
      "if (typeof formatWorkerTaskPayload !== 'function') throw new Error('formatWorkerTaskPayload not found');",
      "const res = formatWorkerTaskPayload('task-101', { cpu: 80 });",
      "if (res.id !== 'task-101' || res.payload.cpu !== 80 || typeof res.timestamp !== 'number') throw new Error('Failed worker payload');"
    )
  },

  // ── DAY 32: Distributed Message Brokers: Apache Kafka ────────────────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[31],
    eTitle: "Compute Kafka Partition",
    eDesc: "Write `computeKafkaPartition(key: string, numPartitions: number): number` implementing deterministic partition key hashing.",
    eLanguage: "typescript",
    // [FIX-STAGE: wave1c-nodeweb-anti-constant] Starter fails closed + test rejects hardcoded constants
    eStarter: lines("function computeKafkaPartition(key, numPartitions) {", "  // Compute partition index", "  throw new Error('TODO: implement computeKafkaPartition');", "}"),
    eHint: "let hash = 0; for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0; return hash % numPartitions;",
    eTest: lines(
      "if (typeof computeKafkaPartition !== 'function') throw new Error('computeKafkaPartition not found');",
      "const p1 = computeKafkaPartition('user-100', 8);",
      "const p2 = computeKafkaPartition('user-100', 8);",
      "if (typeof p1 !== 'number' || Number.isNaN(p1) || p1 !== p2 || p1 < 0 || p1 >= 8) throw new Error('Partition non-deterministic or out of bounds');",
      "const p3 = computeKafkaPartition('order-999', 8);",
      "if (typeof p3 !== 'number' || Number.isNaN(p3) || p3 < 0 || p3 >= 8) throw new Error('Expected valid partition index for order-999');",
      "if (p1 === p3) throw new Error('Distinct keys must distribute across partitions (hardcoded constant rejected)');"
    ),
    aTitle: "Evaluate Consumer Lag",
    aDesc: "Write `evaluateConsumerLag(leo: number, committed: number): { lag: number; isCritical: boolean }` checking if lag > 100.",
    aLanguage: "typescript",
    aStarter: lines("function evaluateConsumerLag(leo, committed) {", "  // Evaluate lag", "  return { lag: 0, isCritical: false };", "}"),
    aHint: "const lag = Math.max(0, leo - committed); return { lag, isCritical: lag > 100 };",
    aTest: lines(
      "if (typeof evaluateConsumerLag !== 'function') throw new Error('evaluateConsumerLag not found');",
      "const l1 = evaluateConsumerLag(1050, 1000);",
      "if (l1.lag !== 50 || l1.isCritical !== false) throw new Error('Failed l1');",
      "const l2 = evaluateConsumerLag(2000, 1500);",
      "if (l2.lag !== 500 || l2.isCritical !== true) throw new Error('Failed l2');"
    )
  },

  // ── DAY 33: AMQP & Message Queuing: RabbitMQ ───────────────────────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[32],
    eTitle: "Route RabbitMQ Message",
    eDesc: "Write `routeRabbitMqMessage(routingKey: string, bindingPatterns: string[]): string[]` returning matching queue patterns.",
    eLanguage: "typescript",
    eStarter: lines("function routeRabbitMqMessage(routingKey, bindingPatterns) {", "  // Match AMQP routing key", "  return [];", "}"),
    eHint: "return bindingPatterns.filter(p => p === '#' || p === routingKey || (p.endsWith('.*') && routingKey.startsWith(p.slice(0, -2))));",
    eTest: lines(
      "if (typeof routeRabbitMqMessage !== 'function') throw new Error('routeRabbitMqMessage not found');",
      "const m1 = routeRabbitMqMessage('order.created', ['order.*', 'payment.*', '#']);",
      "if (m1.length !== 2 || !m1.includes('order.*') || !m1.includes('#')) throw new Error('Failed routing: ' + JSON.stringify(m1));"
    ),
    aTitle: "Classify DLQ Action",
    aDesc: "Write `classifyDlqAction(attempts: number, maxRetries: number, isCorrupt: boolean): { action: string; attempts: number }`.",
    aLanguage: "typescript",
    aStarter: lines("function classifyDlqAction(attempts, maxRetries, isCorrupt) {", "  // Determine DLQ action", "  return { action: 'RETRY', attempts: 0 };", "}"),
    aHint: "return { action: (isCorrupt || attempts >= maxRetries) ? 'DEAD_LETTER' : 'RETRY', attempts };",
    aTest: lines(
      "if (typeof classifyDlqAction !== 'function') throw new Error('classifyDlqAction not found');",
      "const a1 = classifyDlqAction(1, 3, false);",
      "if (a1.action !== 'RETRY') throw new Error('Failed a1');",
      "const a2 = classifyDlqAction(3, 3, false);",
      "if (a2.action !== 'DEAD_LETTER') throw new Error('Failed a2');",
      "const a3 = classifyDlqAction(1, 3, true);",
      "if (a3.action !== 'DEAD_LETTER') throw new Error('Failed a3 corrupt');"
    )
  },

  // ── DAY 34: Redis Streams & Consumer Groups ────────────────────────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[33],
    eTitle: "Generate Redis Stream ID",
    eDesc: "Write `generateRedisStreamId(timestampMs: number, sequence: number): string` formatting `<timestamp>-<sequence>`.",
    eLanguage: "typescript",
    eStarter: lines("function generateRedisStreamId(timestampMs, sequence) {", "  // Return stream entry ID", "  return '';", "}"),
    eHint: "return timestampMs + '-' + sequence;",
    eTest: lines(
      "if (typeof generateRedisStreamId !== 'function') throw new Error('generateRedisStreamId not found');",
      "const id1 = generateRedisStreamId(1710000000000, 0);",
      "if (id1 !== '1710000000000-0') throw new Error('Failed id1: ' + id1);",
      "const id2 = generateRedisStreamId(1710000000000, 4);",
      "if (id2 !== '1710000000000-4') throw new Error('Failed id2: ' + id2);"
    ),
    aTitle: "Filter Stale PEL Entries",
    aDesc: "Write `filterStalePelEntries(entries: Array<{ id: string; idleMs: number }>, minIdleMs: number): string[]` returning IDs with idleMs >= minIdleMs.",
    aLanguage: "typescript",
    aStarter: lines("function filterStalePelEntries(entries, minIdleMs) {", "  // Filter stale entries", "  return [];", "}"),
    aHint: "return entries.filter(e => e.idleMs >= minIdleMs).map(e => e.id);",
    aTest: lines(
      "if (typeof filterStalePelEntries !== 'function') throw new Error('filterStalePelEntries not found');",
      "const stale = filterStalePelEntries([{ id: 'm1', idleMs: 15000 }, { id: 'm2', idleMs: 45000 }, { id: 'm3', idleMs: 31000 }], 30000);",
      "if (stale.length !== 2 || !stale.includes('m2') || !stale.includes('m3')) throw new Error('Failed filter: ' + JSON.stringify(stale));"
    )
  },

  // ── DAY 35: Milestone 6: Distributed Event-Driven Order Processing Engine ──────────────────────────────────
  {
    ...NODE_WEB_DAYS[34],
    eTitle: "Validate Outbox Record",
    eDesc: "Write `validateOutboxRecord(record: { id: number; aggregateId: string; payload: any; status: string }): boolean` ensuring valid types and status in PENDING, PROCESSED.",
    eLanguage: "typescript",
    eStarter: lines("function validateOutboxRecord(record) {", "  // Validate outbox record", "  return false;", "}"),
    eHint: "return typeof record.id === 'number' && typeof record.aggregateId === 'string' && record.payload !== null && ['PENDING', 'PROCESSED'].includes(record.status);",
    eTest: lines(
      "if (typeof validateOutboxRecord !== 'function') throw new Error('validateOutboxRecord not found');",
      "const ok = validateOutboxRecord({ id: 1, aggregateId: 'ord-101', payload: { amt: 99 }, status: 'PENDING' });",
      "if (ok !== true) throw new Error('Expected true for valid outbox record');",
      "const bad = validateOutboxRecord({ id: 2, aggregateId: 'ord-102', payload: null, status: 'INVALID' });",
      "if (bad !== false) throw new Error('Expected false for invalid outbox record');"
    ),
    aTitle: "Audit Order Engine SLA",
    aDesc: "Write `auditOrderEngineSla(metrics: { relayLatencyMs: number; throughput: number; dlqIsolationPct: number }): { pass: boolean; grade: string }` checking latency <= 10, throughput >= 10000, dlq 100%.",
    aLanguage: "typescript",
    aStarter: lines("function auditOrderEngineSla(metrics) {", "  // Audit SLA metrics", "  return { pass: false, grade: 'FAIL' };", "}"),
    aHint: "const pass = metrics.relayLatencyMs <= 10.0 && metrics.throughput >= 10000 && metrics.dlqIsolationPct === 100; return { pass, grade: pass ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof auditOrderEngineSla !== 'function') throw new Error('auditOrderEngineSla not found');",
      "const s1 = auditOrderEngineSla({ relayLatencyMs: 3.2, throughput: 25000, dlqIsolationPct: 100 });",
      "if (s1.pass !== true || s1.grade !== 'A+') throw new Error('Failed s1 Grade A+: ' + JSON.stringify(s1));",
      "const s2 = auditOrderEngineSla({ relayLatencyMs: 12.0, throughput: 25000, dlqIsolationPct: 100 });",
      "if (s2.pass !== false || s2.grade !== 'FAIL') throw new Error('Failed s2 failure check');"
    )
  },

  // ── DAY 36: High-Performance In-Memory Caching: Redis Cluster Sharding ──────────────────────────────
  {
    ...NODE_WEB_DAYS[35],
    eTitle: "Calculate Redis Cluster Slot",
    eDesc: "Write `calculateRedisSlot(key: string): number` extracting `{tag}` if present, summing character codes, and returning `sum % 16384`.",
    eLanguage: "typescript",
    // [FIX-STAGE: wave1c-nodeweb-anti-constant] Starter fails closed + test rejects hardcoded constants and verifies {tag} semantics
    eStarter: lines("function calculateRedisSlot(key) {", "  // Return slot modulo 16384", "  throw new Error('TODO: implement calculateRedisSlot');", "}"),
    eHint: "const m = key.match(/\\{([^}]+)\\}/); const s = m ? m[1] : key; let h = 0; for (let i = 0; i < s.length; i++) h += s.charCodeAt(i); return h % 16384;",
    eTest: lines(
      "if (typeof calculateRedisSlot !== 'function') throw new Error('calculateRedisSlot not found');",
      "const s1 = calculateRedisSlot('user:101');",
      "if (typeof s1 !== 'number' || Number.isNaN(s1) || s1 < 0 || s1 >= 16384) throw new Error('Invalid slot for s1: ' + s1);",
      "const s2 = calculateRedisSlot('{inventory:sku_iphone}:stock');",
      "const s3 = calculateRedisSlot('{inventory:sku_iphone}:holds');",
      "const sTagOnly = calculateRedisSlot('inventory:sku_iphone');",
      "if (s2 !== s3 || s2 !== sTagOnly) throw new Error('Hash tagged keys must map to identical slot as tag: ' + s2 + ' vs ' + s3 + ' vs ' + sTagOnly);",
      "if (s1 === s2 || s2 === 0) throw new Error('Distinct untagged vs tagged keys must produce distinct non-zero slots');"
    ),
    aTitle: "Evaluate Cache Eviction Policy",
    aDesc: "Write `evaluateEvictionPolicy(policy: string, maxMemoryReached: boolean): { evict: boolean; policy: string }` checking if memory is reached and policy starts with allkeys- or volatile-.",
    aLanguage: "typescript",
    aStarter: lines("function evaluateEvictionPolicy(policy, maxMemoryReached) {", "  // Evaluate eviction policy", "  return { evict: false, policy: policy };", "}"),
    aHint: "const canEvict = maxMemoryReached && (policy.startsWith('allkeys-') || policy.startsWith('volatile-')); return { evict: canEvict, policy };",
    aTest: lines(
      "if (typeof evaluateEvictionPolicy !== 'function') throw new Error('evaluateEvictionPolicy not found');",
      "const r1 = evaluateEvictionPolicy('allkeys-lru', true);",
      "if (r1.evict !== true || r1.policy !== 'allkeys-lru') throw new Error('Failed r1 allkeys-lru: ' + JSON.stringify(r1));",
      "const r2 = evaluateEvictionPolicy('noeviction', true);",
      "if (r2.evict !== false) throw new Error('Failed r2 noeviction check');",
      "const r3 = evaluateEvictionPolicy('allkeys-lru', false);",
      "if (r3.evict !== false) throw new Error('Failed r3 under-limit check');"
    )
  },

  // ── DAY 37: Distributed Locking & Concurrency Control: Redlock & Fencing Tokens ─────────────────────
  {
    ...NODE_WEB_DAYS[36],
    eTitle: "Validate Redlock Quorum",
    eDesc: "Write `validateRedlockQuorum(nodeVotes: boolean[], totalNodes: number): boolean` returning true if granted votes >= floor(totalNodes / 2) + 1.",
    eLanguage: "typescript",
    eStarter: lines("function validateRedlockQuorum(nodeVotes, totalNodes) {", "  // Return quorum boolean", "  return false;", "}"),
    eHint: "const needed = Math.floor(totalNodes / 2) + 1; const granted = nodeVotes.filter(Boolean).length; return granted >= needed;",
    eTest: lines(
      "if (typeof validateRedlockQuorum !== 'function') throw new Error('validateRedlockQuorum not found');",
      "const q1 = validateRedlockQuorum([true, true, true, false, false], 5);",
      "if (q1 !== true) throw new Error('Expected true for 3 of 5 votes');",
      "const q2 = validateRedlockQuorum([true, true, false, false, false], 5);",
      "if (q2 !== false) throw new Error('Expected false for 2 of 5 votes');",
      "const q3 = validateRedlockQuorum([true, true], 3);",
      "if (q3 !== true) throw new Error('Expected true for 2 of 3 votes');"
    ),
    aTitle: "Verify Fencing Token Storage Gate",
    aDesc: "Write `verifyFencingGate(highestSeenToken: number, incomingToken: number): { allow: boolean; highestToken: number }` allowing write if incoming > highestSeen.",
    aLanguage: "typescript",
    aStarter: lines("function verifyFencingGate(highestSeenToken, incomingToken) {", "  // Verify incoming fencing token", "  return { allow: false, highestToken: highestSeenToken };", "}"),
    aHint: "const allow = incomingToken > highestSeenToken; return { allow, highestToken: allow ? incomingToken : highestSeenToken };",
    aTest: lines(
      "if (typeof verifyFencingGate !== 'function') throw new Error('verifyFencingGate not found');",
      "const g1 = verifyFencingGate(100, 105);",
      "if (g1.allow !== true || g1.highestToken !== 105) throw new Error('Failed g1 valid write: ' + JSON.stringify(g1));",
      "const g2 = verifyFencingGate(105, 102);",
      "if (g2.allow !== false || g2.highestToken !== 105) throw new Error('Failed g2 stale write rejection: ' + JSON.stringify(g2));"
    )
  },

  // ── DAY 38: Connection Pooling & Resource Sizing ────────────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[37],
    eTitle: "Calculate Little's Law Concurrency",
    eDesc: "Write `calculatePoolConcurrency(arrivalRatePerSec: number, avgServiceTimeSec: number): number` returning `Math.ceil(arrivalRatePerSec * avgServiceTimeSec)`.",
    eLanguage: "typescript",
    eStarter: lines("function calculatePoolConcurrency(arrivalRatePerSec, avgServiceTimeSec) {", "  // Return required active connections", "  return 0;", "}"),
    eHint: "return Math.ceil(arrivalRatePerSec * avgServiceTimeSec);",
    eTest: lines(
      "if (typeof calculatePoolConcurrency !== 'function') throw new Error('calculatePoolConcurrency not found');",
      "const c1 = calculatePoolConcurrency(500, 0.02);",
      "if (c1 !== 10) throw new Error('Expected 10 for 500 * 0.02, got ' + c1);",
      "const c2 = calculatePoolConcurrency(1000, 0.05);",
      "if (c2 !== 50) throw new Error('Expected 50 for 1000 * 0.05, got ' + c2);"
    ),
    aTitle: "Audit pgBouncer Mode Compatibility",
    aDesc: "Write `auditBouncerMode(mode: string, features: string[]): { compatible: boolean; reason?: string }` rejecting TRANSACTION mode if features contain 'LISTEN' or 'PREPARE'.",
    aLanguage: "typescript",
    aStarter: lines("function auditBouncerMode(mode, features) {", "  // Audit compatibility", "  return { compatible: false };", "}"),
    aHint: "if (mode === 'TRANSACTION' && (features.includes('LISTEN') || features.includes('PREPARE'))) return { compatible: false, reason: 'UNSUPPORTED_SESSION_FEATURE' }; return { compatible: true };",
    aTest: lines(
      "if (typeof auditBouncerMode !== 'function') throw new Error('auditBouncerMode not found');",
      "const b1 = auditBouncerMode('TRANSACTION', ['LISTEN']);",
      "if (b1.compatible !== false || b1.reason !== 'UNSUPPORTED_SESSION_FEATURE') throw new Error('Failed b1 LISTEN rejection: ' + JSON.stringify(b1));",
      "const b2 = auditBouncerMode('TRANSACTION', ['SELECT', 'INSERT']);",
      "if (b2.compatible !== true) throw new Error('Failed b2 stateless query check');",
      "const b3 = auditBouncerMode('SESSION', ['LISTEN']);",
      "if (b3.compatible !== true) throw new Error('Failed b3 session compatibility');"
    )
  },

  // ── DAY 39: Distributed Rate Limiting & Sliding Windows ─────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[38],
    eTitle: "Calculate Sliding Window Counter",
    eDesc: "Write `calculateSlidingCounter(prevCount: number, currCount: number, elapsedMs: number, windowMs: number): number` approximating rolling requests.",
    eLanguage: "typescript",
    eStarter: lines("function calculateSlidingCounter(prevCount, currCount, elapsedMs, windowMs) {", "  // Return estimated count", "  return 0;", "}"),
    eHint: "const weight = Math.max(0, (windowMs - elapsedMs) / windowMs); return Math.round((prevCount * weight) + currCount);",
    eTest: lines(
      "if (typeof calculateSlidingCounter !== 'function') throw new Error('calculateSlidingCounter not found');",
      "const sc1 = calculateSlidingCounter(80, 30, 15000, 60000);",
      "if (sc1 !== 90) throw new Error('Expected 90 for 80 * 0.75 + 30, got ' + sc1);",
      "const sc2 = calculateSlidingCounter(100, 20, 60000, 60000);",
      "if (sc2 !== 20) throw new Error('Expected 20 for 100 * 0 + 20, got ' + sc2);"
    ),
    aTitle: "Format RFC 6585 Rate Limit Headers",
    aDesc: "Write `formatRfcRateLimit(limit: number, currentUsage: number, resetSec: number): { status: number; headers: Record<string, string> }`.",
    aLanguage: "typescript",
    aStarter: lines("function formatRfcRateLimit(limit, currentUsage, resetSec) {", "  // Return status and headers", "  return { status: 200, headers: {} };", "}"),
    aHint: "const exceeded = currentUsage >= limit; const remaining = Math.max(0, limit - currentUsage); const headers = { 'RateLimit-Limit': String(limit), 'RateLimit-Remaining': String(remaining), 'RateLimit-Reset': String(resetSec) }; if (exceeded) headers['Retry-After'] = String(resetSec); return { status: exceeded ? 429 : 200, headers };",
    aTest: lines(
      "if (typeof formatRfcRateLimit !== 'function') throw new Error('formatRfcRateLimit not found');",
      "const h1 = formatRfcRateLimit(100, 45, 30);",
      "if (h1.status !== 200 || h1.headers['RateLimit-Remaining'] !== '55') throw new Error('Failed h1 200 check: ' + JSON.stringify(h1));",
      "const h2 = formatRfcRateLimit(100, 100, 15);",
      "if (h2.status !== 429 || h2.headers['Retry-After'] !== '15' || h2.headers['RateLimit-Remaining'] !== '0') throw new Error('Failed h2 429 check: ' + JSON.stringify(h2));"
    )
  },

  // ── DAY 40: Milestone 7: Low-Latency Distributed Inventory Reservation Gateway ──────────────────────
  {
    ...NODE_WEB_DAYS[39],
    eTitle: "Evaluate Stock Reservation",
    eDesc: "Write `evaluateStockReservation(currentStock: number, requestedQty: number, reservationId: string): { granted: boolean; remainingStock: number; reservationId: string }`.",
    eLanguage: "typescript",
    eStarter: lines("function evaluateStockReservation(currentStock, requestedQty, reservationId) {", "  // Return stock reservation result", "  return { granted: false, remainingStock: currentStock, reservationId: reservationId };", "}"),
    eHint: "if (requestedQty <= currentStock) return { granted: true, remainingStock: currentStock - requestedQty, reservationId }; return { granted: false, remainingStock: currentStock, reservationId };",
    eTest: lines(
      "if (typeof evaluateStockReservation !== 'function') throw new Error('evaluateStockReservation not found');",
      "const ev1 = evaluateStockReservation(10, 3, 'res_01');",
      "if (ev1.granted !== true || ev1.remainingStock !== 7) throw new Error('Failed ev1 reservation grant: ' + JSON.stringify(ev1));",
      "const ev2 = evaluateStockReservation(2, 5, 'res_02');",
      "if (ev2.granted !== false || ev2.remainingStock !== 2) throw new Error('Failed ev2 insufficient stock: ' + JSON.stringify(ev2));"
    ),
    aTitle: "Certify Milestone 7 Gateway SLA",
    aDesc: "Write `certifyGatewaySla(metrics: { p99Ms: number; oversellCount: number; fencingRejectionRate: number; reaperRate: number }): { certified: boolean; grade: string }` checking p99 <= 5.0, oversell === 0, fencing === 1.0, reaper === 1.0.",
    aLanguage: "typescript",
    aStarter: lines("function certifyGatewaySla(metrics) {", "  // Certify gateway SLA", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const ok = metrics.p99Ms <= 5.0 && metrics.oversellCount === 0 && metrics.fencingRejectionRate === 1.0 && metrics.reaperRate === 1.0; return { certified: ok, grade: ok ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyGatewaySla !== 'function') throw new Error('certifyGatewaySla not found');",
      "const s1 = certifyGatewaySla({ p99Ms: 3.4, oversellCount: 0, fencingRejectionRate: 1.0, reaperRate: 1.0 });",
      "if (s1.certified !== true || s1.grade !== 'A+') throw new Error('Failed s1 Grade A+: ' + JSON.stringify(s1));",
      "const s2 = certifyGatewaySla({ p99Ms: 7.2, oversellCount: 0, fencingRejectionRate: 1.0, reaperRate: 1.0 });",
      "if (s2.certified !== false || s2.grade !== 'FAIL') throw new Error('Failed s2 latency failure check');"
    )
  },

  // ── DAY 41: Advanced Asynchronous Concurrency Patterns ─────────────────────────
  {
    ...NODE_WEB_DAYS[40],
    eTitle: "Parse W3C TraceParent Header",
    eDesc: "Write `parseW3CTraceParent(header: string): { version: string; traceId: string; parentId: string; traceFlags: string; isValid: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines("function parseW3CTraceParent(header) {", "  // Return parsed W3C traceparent", "  return { version: '', traceId: '', parentId: '', traceFlags: '', isValid: false };", "}"),
    eHint: "const parts = String(header).split('-'); if (parts.length !== 4 || parts[0] !== '00' || parts[1].length !== 32 || parts[2].length !== 16 || parts[3].length !== 2) return { version: '', traceId: '', parentId: '', traceFlags: '', isValid: false }; return { version: parts[0], traceId: parts[1], parentId: parts[2], traceFlags: parts[3], isValid: true };",
    eTest: lines(
      "if (typeof parseW3CTraceParent !== 'function') throw new Error('parseW3CTraceParent not found');",
      "const tp1 = parseW3CTraceParent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');",
      "if (!tp1.isValid || tp1.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736') throw new Error('Failed valid traceparent parse: ' + JSON.stringify(tp1));",
      "const tp2 = parseW3CTraceParent('invalid-header');",
      "if (tp2.isValid !== false) throw new Error('Failed invalid traceparent test');"
    ),
    aTitle: "Create Child Span Context",
    aDesc: "Write `createChildSpanContext(parentHeader: string | null): { traceId: string; parentSpanId: string; spanId: string; traceFlags: string }`.",
    aLanguage: "typescript",
    aStarter: lines("function createChildSpanContext(parentHeader) {", "  // Return child span context", "  return { traceId: '', parentSpanId: '', spanId: '', traceFlags: '01' };", "}"),
    aHint: "const isParentValid = parentHeader && parentHeader.startsWith('00-') && parentHeader.split('-').length === 4; const parts = isParentValid ? parentHeader.split('-') : []; const traceId = isParentValid ? parts[1] : '11112222333344445555666677778888'; const parentSpanId = isParentValid ? parts[2] : '0000000000000000'; const spanId = 'sp99998888777766'; return { traceId, parentSpanId, spanId, traceFlags: '01' };",
    aTest: lines(
      "if (typeof createChildSpanContext !== 'function') throw new Error('createChildSpanContext not found');",
      "const ch1 = createChildSpanContext('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');",
      "if (ch1.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736' || ch1.parentSpanId !== '00f067aa0ba902b7') throw new Error('Failed valid parent inheritance');",
      "const ch2 = createChildSpanContext(null);",
      "if (!ch2.traceId || ch2.parentSpanId !== '0000000000000000') throw new Error('Failed root context creation');"
    )
  },

  // ── DAY 42: Production Memory Management & Profiling ───────────────────────────
  {
    ...NODE_WEB_DAYS[41],
    eTitle: "Calculate Memory Pressure",
    eDesc: "Write `calculateMemoryPressure(heapUsed: number, heapTotal: number, thresholdPct: number): { currentPct: number; isExceeded: boolean; bytesAvailable: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function calculateMemoryPressure(heapUsed, heapTotal, thresholdPct) {", "  // Return memory pressure status", "  return { currentPct: 0, isExceeded: false, bytesAvailable: 0 };", "}"),
    eHint: "const pct = Number(((heapUsed / heapTotal) * 100).toFixed(1)); const isExceeded = pct >= thresholdPct; return { currentPct: pct, isExceeded, bytesAvailable: Math.max(0, heapTotal - heapUsed) };",
    eTest: lines(
      "if (typeof calculateMemoryPressure !== 'function') throw new Error('calculateMemoryPressure not found');",
      "const m1 = calculateMemoryPressure(850, 1000, 80.0);",
      "if (m1.currentPct !== 85.0 || m1.isExceeded !== true || m1.bytesAvailable !== 150) throw new Error('Failed m1 pressure check: ' + JSON.stringify(m1));",
      "const m2 = calculateMemoryPressure(500, 1000, 80.0);",
      "if (m2.isExceeded !== false || m2.bytesAvailable !== 500) throw new Error('Failed m2 safe check: ' + JSON.stringify(m2));"
    ),
    aTitle: "Detect Leaking Retainers",
    aDesc: "Write `detectLeakingRetainers(snapshots: Array<{ name: string; deltaCount: number; retainedBytes: number }>): { topLeak: string; leakedBytes: number } | null`.",
    aLanguage: "typescript",
    aStarter: lines("function detectLeakingRetainers(snapshots) {", "  // Detect top leaking retainer", "  return null;", "}"),
    aHint: "const leaking = snapshots.filter(s => s.deltaCount > 0); if (leaking.length === 0) return null; leaking.sort((a, b) => b.retainedBytes - a.retainedBytes); return { topLeak: leaking[0].name, leakedBytes: leaking[0].retainedBytes };",
    aTest: lines(
      "if (typeof detectLeakingRetainers !== 'function') throw new Error('detectLeakingRetainers not found');",
      "const l1 = detectLeakingRetainers([{ name: 'ClosureCtx', deltaCount: 500, retainedBytes: 50000 }, { name: 'Buffer', deltaCount: 10, retainedBytes: 1000 }]);",
      "if (!l1 || l1.topLeak !== 'ClosureCtx' || l1.leakedBytes !== 50000) throw new Error('Failed l1 leak detection: ' + JSON.stringify(l1));",
      "const l2 = detectLeakingRetainers([{ name: 'Array', deltaCount: -5, retainedBytes: 0 }]);",
      "if (l2 !== null) throw new Error('Failed l2 no-leak test');"
    )
  },

  // ── DAY 43: Low-Latency Binary Protocols ───────────────────────────────────────
  {
    ...NODE_WEB_DAYS[42],
    eTitle: "Encode Protobuf Varint",
    eDesc: "Write `encodeProtobufVarint(value: number): number[]` returning the byte array representing the Varint.",
    eLanguage: "typescript",
    eStarter: lines("function encodeProtobufVarint(value) {", "  // Return Varint encoded bytes", "  return [];", "}"),
    eHint: "const bytes = []; let val = value; while (val >= 0x80) { bytes.push((val & 0x7F) | 0x80); val >>>= 7; } bytes.push(val & 0x7F); return bytes;",
    eTest: lines(
      "if (typeof encodeProtobufVarint !== 'function') throw new Error('encodeProtobufVarint not found');",
      "const v1 = encodeProtobufVarint(1);",
      "if (v1.length !== 1 || v1[0] !== 1) throw new Error('Failed 1 byte encoding: ' + JSON.stringify(v1));",
      "const v2 = encodeProtobufVarint(300);",
      "if (v2.length !== 2 || v2[0] !== 0xAC || v2[1] !== 0x02) throw new Error('Failed 300 varint encoding: ' + JSON.stringify(v2));"
    ),
    aTitle: "Decode Protobuf Varint",
    aDesc: "Write `decodeProtobufVarint(bytes: number[]): { value: number; bytesRead: number }`.",
    aLanguage: "typescript",
    aStarter: lines("function decodeProtobufVarint(bytes) {", "  // Return decoded integer and bytesRead", "  return { value: 0, bytesRead: 0 };", "}"),
    aHint: "let result = 0; let shift = 0; let bytesRead = 0; for (let i = 0; i < bytes.length; i++) { const b = bytes[i]; bytesRead++; result |= (b & 0x7F) << shift; if ((b & 0x80) === 0) break; shift += 7; } return { value: result, bytesRead };",
    aTest: lines(
      "if (typeof decodeProtobufVarint !== 'function') throw new Error('decodeProtobufVarint not found');",
      "const d1 = decodeProtobufVarint([0x01]);",
      "if (d1.value !== 1 || d1.bytesRead !== 1) throw new Error('Failed d1: ' + JSON.stringify(d1));",
      "const d2 = decodeProtobufVarint([0xAC, 0x02]);",
      "if (d2.value !== 300 || d2.bytesRead !== 2) throw new Error('Failed d2 300: ' + JSON.stringify(d2));"
    )
  },

  // ── DAY 44: High-Performance Networking & gRPC Services ───────────────────────
  {
    ...NODE_WEB_DAYS[43],
    eTitle: "Parse gRPC Service Path",
    eDesc: "Write `parseGrpcPath(path: string): { service: string; method: string; isValid: boolean }`.",
    eLanguage: "typescript",
    eStarter: lines("function parseGrpcPath(path) {", "  // Parse /package.Service/Method", "  return { service: '', method: '', isValid: false };", "}"),
    eHint: "const parts = String(path).split('/').filter(Boolean); if (parts.length !== 2) return { service: '', method: '', isValid: false }; return { service: parts[0], method: parts[1], isValid: true };",
    eTest: lines(
      "if (typeof parseGrpcPath !== 'function') throw new Error('parseGrpcPath not found');",
      "const p1 = parseGrpcPath('/telemetry.v1.TelemetryService/RecordMetric');",
      "if (!p1.isValid || p1.service !== 'telemetry.v1.TelemetryService' || p1.method !== 'RecordMetric') throw new Error('Failed p1 valid path: ' + JSON.stringify(p1));",
      "const p2 = parseGrpcPath('/invalid_path');",
      "if (p2.isValid !== false) throw new Error('Failed p2 invalid path');"
    ),
    aTitle: "Evaluate RPC Deadline Budget",
    aDesc: "Write `evaluateRpcDeadline(deadlineMs: number, currentMs: number): { expired: boolean; remainingMs: number; grpcStatus: number }`.",
    aLanguage: "typescript",
    aStarter: lines("function evaluateRpcDeadline(deadlineMs, currentMs) {", "  // Return deadline evaluation", "  return { expired: false, remainingMs: 0, grpcStatus: 0 };", "}"),
    aHint: "const remaining = deadlineMs - currentMs; const expired = remaining <= 0; return { expired, remainingMs: Math.max(0, remaining), grpcStatus: expired ? 4 : 0 };",
    aTest: lines(
      "if (typeof evaluateRpcDeadline !== 'function') throw new Error('evaluateRpcDeadline not found');",
      "const dl1 = evaluateRpcDeadline(1000, 500);",
      "if (dl1.expired !== false || dl1.remainingMs !== 500 || dl1.grpcStatus !== 0) throw new Error('Failed dl1 active check: ' + JSON.stringify(dl1));",
      "const dl2 = evaluateRpcDeadline(1000, 1500);",
      "if (dl2.expired !== true || dl2.remainingMs !== 0 || dl2.grpcStatus !== 4) throw new Error('Failed dl2 expired check: ' + JSON.stringify(dl2));"
    )
  },

  // ── DAY 45: Milestone 8: High-Throughput Binary Telemetry Aggregator ───────────
  {
    ...NODE_WEB_DAYS[44],
    eTitle: "Calculate Window Stats",
    eDesc: "Write `calculateWindowStats(samples: number[]): { count: number; sum: number; avg: number; min: number; max: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function calculateWindowStats(samples) {", "  // Return count, sum, avg, min, max", "  return { count: 0, sum: 0, avg: 0, min: 0, max: 0 };", "}"),
    eHint: "if (!samples || samples.length === 0) return { count: 0, sum: 0, avg: 0, min: 0, max: 0 }; const count = samples.length; const sum = Number(samples.reduce((a, b) => a + b, 0).toFixed(2)); const avg = Number((sum / count).toFixed(2)); const min = Math.min(...samples); const max = Math.max(...samples); return { count, sum, avg, min, max };",
    eTest: lines(
      "if (typeof calculateWindowStats !== 'function') throw new Error('calculateWindowStats not found');",
      "const ws1 = calculateWindowStats([10.5, 20.0, 15.5]);",
      "if (ws1.count !== 3 || ws1.sum !== 46.0 || ws1.avg !== 15.33 || ws1.min !== 10.5 || ws1.max !== 20.0) throw new Error('Failed ws1 stats: ' + JSON.stringify(ws1));",
      "const ws2 = calculateWindowStats([]);",
      "if (ws2.count !== 0 || ws2.sum !== 0) throw new Error('Failed empty samples check');"
    ),
    aTitle: "Certify Milestone 8 Aggregator SLA",
    aDesc: "Write `certifyMilestone8Sla(metrics: { throughput: number; p99Ms: number; bufferReclaimRate: number; traceLeakageCount: number }): { certified: boolean; grade: string }` checking throughput >= 500, p99Ms <= 2.5, bufferReclaimRate === 1.0, traceLeakageCount === 0.",
    aLanguage: "typescript",
    aStarter: lines("function certifyMilestone8Sla(metrics) {", "  // Return certification status", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const ok = metrics.throughput >= 500 && metrics.p99Ms <= 2.5 && metrics.bufferReclaimRate === 1.0 && metrics.traceLeakageCount === 0; return { certified: ok, grade: ok ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyMilestone8Sla !== 'function') throw new Error('certifyMilestone8Sla not found');",
      "const cert1 = certifyMilestone8Sla({ throughput: 600, p99Ms: 1.2, bufferReclaimRate: 1.0, traceLeakageCount: 0 });",
      "if (cert1.certified !== true || cert1.grade !== 'A+') throw new Error('Failed cert1 Grade A+: ' + JSON.stringify(cert1));",
      "const cert2 = certifyMilestone8Sla({ throughput: 400, p99Ms: 3.0, bufferReclaimRate: 0.9, traceLeakageCount: 1 });",
      "if (cert2.certified !== false || cert2.grade !== 'FAIL') throw new Error('Failed cert2 failure check: ' + JSON.stringify(cert2));"
    )
  },

  // ── DAY 46: Clustering, Process Model & IPC ────────────────────────────────────
  {
    ...NODE_WEB_DAYS[45],
    eTitle: "Calculate Quorum Threshold",
    eDesc: "Write `calculateQuorum(totalNodes: number): { quorum: number; maxFaulty: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function calculateQuorum(totalNodes) {", "  // Return quorum threshold and max tolerated faulty nodes", "  return { quorum: 0, maxFaulty: 0 };", "}"),
    eHint: "const q = Math.floor(totalNodes / 2) + 1; const f = Math.floor((totalNodes - 1) / 2); return { quorum: q, maxFaulty: f };",
    eTest: lines(
      "if (typeof calculateQuorum !== 'function') throw new Error('calculateQuorum not found');",
      "const q1 = calculateQuorum(5);",
      "if (q1.quorum !== 3 || q1.maxFaulty !== 2) throw new Error('Failed 5 nodes quorum: ' + JSON.stringify(q1));",
      "const q2 = calculateQuorum(3);",
      "if (q2.quorum !== 2 || q2.maxFaulty !== 1) throw new Error('Failed 3 nodes quorum: ' + JSON.stringify(q2));"
    ),
    aTitle: "Parse Length-Prefixed Frame",
    aDesc: "Write `parseLengthPrefixedFrame(buffer: number[]): { length: number; payload: number[]; isValid: boolean }`.",
    aLanguage: "typescript",
    aStarter: lines("function parseLengthPrefixedFrame(buffer) {", "  // Return length, payload, and isValid", "  return { length: 0, payload: [], isValid: false };", "}"),
    aHint: "if (!buffer || buffer.length < 4) return { length: 0, payload: [], isValid: false }; const len = (buffer[0] << 24) | (buffer[1] << 16) | (buffer[2] << 8) | buffer[3]; if (buffer.length < 4 + len) return { length: len, payload: [], isValid: false }; return { length: len, payload: buffer.slice(4, 4 + len), isValid: true };",
    aTest: lines(
      "if (typeof parseLengthPrefixedFrame !== 'function') throw new Error('parseLengthPrefixedFrame not found');",
      "const f1 = parseLengthPrefixedFrame([0, 0, 0, 3, 10, 20, 30]);",
      "if (!f1.isValid || f1.length !== 3 || f1.payload.length !== 3 || f1.payload[1] !== 20) throw new Error('Failed f1 frame parse: ' + JSON.stringify(f1));",
      "const f2 = parseLengthPrefixedFrame([0, 0, 0, 5, 10, 20]);",
      "if (f2.isValid !== false) throw new Error('Failed incomplete frame check');"
    )
  },

  // ── DAY 47: Distributed Consensus Algorithms: Raft Leader Election ─────────────
  {
    ...NODE_WEB_DAYS[46],
    eTitle: "Evaluate RequestVote Decision",
    eDesc: "Write `evaluateRequestVote(voterTerm: number, candidateTerm: number, hasVoted: boolean): { voteGranted: boolean; updatedTerm: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function evaluateRequestVote(voterTerm, candidateTerm, hasVoted) {", "  // Return vote decision and updatedTerm", "  return { voteGranted: false, updatedTerm: voterTerm };", "}"),
    eHint: "if (candidateTerm > voterTerm) return { voteGranted: true, updatedTerm: candidateTerm }; if (candidateTerm === voterTerm && !hasVoted) return { voteGranted: true, updatedTerm: voterTerm }; return { voteGranted: false, updatedTerm: voterTerm };",
    eTest: lines(
      "if (typeof evaluateRequestVote !== 'function') throw new Error('evaluateRequestVote not found');",
      "const v1 = evaluateRequestVote(1, 2, false);",
      "if (v1.voteGranted !== true || v1.updatedTerm !== 2) throw new Error('Failed higher term vote: ' + JSON.stringify(v1));",
      "const v2 = evaluateRequestVote(2, 2, true);",
      "if (v2.voteGranted !== false) throw new Error('Failed duplicate vote rejection: ' + JSON.stringify(v2));"
    ),
    aTitle: "Calculate Commit Index",
    aDesc: "Write `calculateCommitIndex(matchIndices: number[], clusterSize: number): number`.",
    aLanguage: "typescript",
    aStarter: lines("function calculateCommitIndex(matchIndices, clusterSize) {", "  // Return majority quorum commit index", "  return 0;", "}"),
    aHint: "const sorted = matchIndices.slice().sort((a, b) => b - a); const quorumIdx = Math.floor(clusterSize / 2); return sorted[quorumIdx] || 0;",
    aTest: lines(
      "if (typeof calculateCommitIndex !== 'function') throw new Error('calculateCommitIndex not found');",
      "const c1 = calculateCommitIndex([10, 10, 8, 5, 2], 5);",
      "if (c1 !== 8) throw new Error('Failed 5-node commit index: ' + c1);",
      "const c2 = calculateCommitIndex([12, 12, 10], 3);",
      "if (c2 !== 12) throw new Error('Failed 3-node commit index: ' + c2);"
    )
  },

  // ── DAY 48: Fault Tolerance, Circuit Breaking & Chaos Engineering ──────────────
  {
    ...NODE_WEB_DAYS[47],
    eTitle: "Evaluate Circuit Breaker Trip",
    eDesc: "Write `evaluateCircuitTrip(consecutiveFailures: number, threshold: number): { tripOpen: boolean; state: string }`.",
    eLanguage: "typescript",
    eStarter: lines("function evaluateCircuitTrip(consecutiveFailures, threshold) {", "  // Return trip decision and state", "  return { tripOpen: false, state: 'CLOSED' };", "}"),
    eHint: "const trip = consecutiveFailures >= threshold; return { tripOpen: trip, state: trip ? 'OPEN' : 'CLOSED' };",
    eTest: lines(
      "if (typeof evaluateCircuitTrip !== 'function') throw new Error('evaluateCircuitTrip not found');",
      "const cb1 = evaluateCircuitTrip(5, 5);",
      "if (cb1.tripOpen !== true || cb1.state !== 'OPEN') throw new Error('Failed threshold trip: ' + JSON.stringify(cb1));",
      "const cb2 = evaluateCircuitTrip(3, 5);",
      "if (cb2.tripOpen !== false || cb2.state !== 'CLOSED') throw new Error('Failed healthy closed state: ' + JSON.stringify(cb2));"
    ),
    aTitle: "Check Retry Budget Allowance",
    aDesc: "Write `canRetryWithBudget(totalCalls: number, totalRetries: number, budgetPct: number): boolean`.",
    aLanguage: "typescript",
    aStarter: lines("function canRetryWithBudget(totalCalls, totalRetries, budgetPct) {", "  // Return boolean allowing or denying retry", "  return false;", "}"),
    aHint: "if (totalCalls < 10) return true; return ((totalRetries + 1) / totalCalls) * 100 <= budgetPct;",
    aTest: lines(
      "if (typeof canRetryWithBudget !== 'function') throw new Error('canRetryWithBudget not found');",
      "const r1 = canRetryWithBudget(5, 2, 10);",
      "if (r1 !== true) throw new Error('Failed warmup allowance check');",
      "const r2 = canRetryWithBudget(100, 10, 10);",
      "if (r2 !== false) throw new Error('Failed budget exhausted check');"
    )
  },

  // ── DAY 49: Dynamic Service Discovery & Health Checking ─────────────────────────
  {
    ...NODE_WEB_DAYS[48],
    eTitle: "Sweep Expired Registry Leases",
    eDesc: "Write `sweepExpiredLeases(services: Array<{ id: string; expiresAt: number }>, currentMs: number): string[]`.",
    eLanguage: "typescript",
    eStarter: lines("function sweepExpiredLeases(services, currentMs) {", "  // Return array of expired service IDs", "  return [];", "}"),
    eHint: "return services.filter(s => currentMs >= s.expiresAt).map(s => s.id);",
    eTest: lines(
      "if (typeof sweepExpiredLeases !== 'function') throw new Error('sweepExpiredLeases not found');",
      "const s1 = sweepExpiredLeases([{ id: 'svc_1', expiresAt: 1000 }, { id: 'svc_2', expiresAt: 2000 }], 1500);",
      "if (s1.length !== 1 || s1[0] !== 'svc_1') throw new Error('Failed expired sweep: ' + JSON.stringify(s1));",
      "const s2 = sweepExpiredLeases([{ id: 'svc_3', expiresAt: 3000 }], 1500);",
      "if (s2.length !== 0) throw new Error('Failed zero expired check');"
    ),
    aTitle: "Calculate Peak-EWMA Routing Cost",
    aDesc: "Write `calculatePeakEwmaCost(ewmaLatencyMs: number, inFlight: number): number`.",
    aLanguage: "typescript",
    aStarter: lines("function calculatePeakEwmaCost(ewmaLatencyMs, inFlight) {", "  // Return routing cost", "  return 0;", "}"),
    aHint: "return Number((ewmaLatencyMs * (inFlight + 1)).toFixed(2));",
    aTest: lines(
      "if (typeof calculatePeakEwmaCost !== 'function') throw new Error('calculatePeakEwmaCost not found');",
      "const cost1 = calculatePeakEwmaCost(12.5, 3);",
      "if (cost1 !== 50.0) throw new Error('Failed cost1: ' + cost1);",
      "const cost2 = calculatePeakEwmaCost(5.0, 0);",
      "if (cost2 !== 5.0) throw new Error('Failed cost2: ' + cost2);"
    )
  },

  // ── DAY 50: Milestone 9: Resilient Multi-Node Consensus Cluster ────────────────
  {
    ...NODE_WEB_DAYS[49],
    eTitle: "Validate Storage Fencing Token",
    eDesc: "Write `validateFencingToken(token: number, highWaterMark: number): { isValid: boolean; updatedHighWaterMark: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function validateFencingToken(token, highWaterMark) {", "  // Return validity and updated highWaterMark", "  return { isValid: false, updatedHighWaterMark: highWaterMark };", "}"),
    eHint: "const valid = token > highWaterMark; return { isValid: valid, updatedHighWaterMark: valid ? token : highWaterMark };",
    eTest: lines(
      "if (typeof validateFencingToken !== 'function') throw new Error('validateFencingToken not found');",
      "const tok1 = validateFencingToken(1005, 1000);",
      "if (tok1.isValid !== true || tok1.updatedHighWaterMark !== 1005) throw new Error('Failed higher token validation: ' + JSON.stringify(tok1));",
      "const tok2 = validateFencingToken(990, 1000);",
      "if (tok2.isValid !== false || tok2.updatedHighWaterMark !== 1000) throw new Error('Failed stale token rejection: ' + JSON.stringify(tok2));"
    ),
    aTitle: "Certify Milestone 9 Consensus Cluster SLA",
    aDesc: "Write `certifyMilestone9Sla(metrics: { failoverMs: number; splitBrainCount: number; staleWritesBlocked: number; leasesProcessed: number }): { certified: boolean; grade: string }` checking failoverMs <= 250, splitBrainCount === 0, staleWritesBlocked >= 1, leasesProcessed >= 100.",
    aLanguage: "typescript",
    aStarter: lines("function certifyMilestone9Sla(metrics) {", "  // Return SLA certification", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const pass = metrics.failoverMs <= 250 && metrics.splitBrainCount === 0 && metrics.staleWritesBlocked >= 1 && metrics.leasesProcessed >= 100; return { certified: pass, grade: pass ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyMilestone9Sla !== 'function') throw new Error('certifyMilestone9Sla not found');",
      "const cert1 = certifyMilestone9Sla({ failoverMs: 180, splitBrainCount: 0, staleWritesBlocked: 2, leasesProcessed: 120 });",
      "if (cert1.certified !== true || cert1.grade !== 'A+') throw new Error('Failed cert1 Grade A+: ' + JSON.stringify(cert1));",
      "const cert2 = certifyMilestone9Sla({ failoverMs: 350, splitBrainCount: 0, staleWritesBlocked: 2, leasesProcessed: 120 });",
      "if (cert2.certified !== false || cert2.grade !== 'FAIL') throw new Error('Failed cert2 failover limit: ' + JSON.stringify(cert2));"
    )
  },

  // ── DAY 51: High-Throughput Stream Processing & Reactive Pipelines ─────────────
  {
    ...NODE_WEB_DAYS[50],
    eTitle: "Calculate Stream Backpressure State",
    eDesc: "Write `calculateStreamBackpressureState(bufferedBytes: number, highWaterMark: number): { shouldPause: boolean; ratio: number }` calculating ratio as Number((bufferedBytes / highWaterMark).toFixed(2)) and shouldPause as bufferedBytes >= highWaterMark.",
    eLanguage: "typescript",
    eStarter: lines("function calculateStreamBackpressureState(bufferedBytes, highWaterMark) {", "  // Return backpressure state", "  return { shouldPause: false, ratio: 0 };", "}"),
    eHint: "const ratio = Number((bufferedBytes / highWaterMark).toFixed(2)); return { shouldPause: bufferedBytes >= highWaterMark, ratio };",
    eTest: lines(
      "if (typeof calculateStreamBackpressureState !== 'function') throw new Error('calculateStreamBackpressureState not found');",
      "const s1 = calculateStreamBackpressureState(16384, 16384);",
      "if (s1.shouldPause !== true || s1.ratio !== 1.0) throw new Error('Failed at highWaterMark: ' + JSON.stringify(s1));",
      "const s2 = calculateStreamBackpressureState(8192, 16384);",
      "if (s2.shouldPause !== false || s2.ratio !== 0.5) throw new Error('Failed below highWaterMark: ' + JSON.stringify(s2));",
      "const s3 = calculateStreamBackpressureState(24576, 16384);",
      "if (s3.shouldPause !== true || s3.ratio !== 1.5) throw new Error('Failed above highWaterMark: ' + JSON.stringify(s3));"
    ),
    aTitle: "Certify Stream Processing Pipeline SLA",
    aDesc: "Write `certifyStreamPipelineSla(metrics: { peakMemoryBytes: number; maxAllowedMemoryBytes: number; droppedChunks: number; backpressurePauses: number }): { certified: boolean; grade: string }` verifying peakMemoryBytes <= maxAllowedMemoryBytes, droppedChunks === 0, and backpressurePauses >= 1.",
    aLanguage: "typescript",
    aStarter: lines("function certifyStreamPipelineSla(metrics) {", "  // Return SLA certification", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const pass = metrics.peakMemoryBytes <= metrics.maxAllowedMemoryBytes && metrics.droppedChunks === 0 && metrics.backpressurePauses >= 1; return { certified: pass, grade: pass ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyStreamPipelineSla !== 'function') throw new Error('certifyStreamPipelineSla not found');",
      "const cert1 = certifyStreamPipelineSla({ peakMemoryBytes: 32768, maxAllowedMemoryBytes: 65536, droppedChunks: 0, backpressurePauses: 2 });",
      "if (cert1.certified !== true || cert1.grade !== 'A+') throw new Error('Failed cert1 Grade A+: ' + JSON.stringify(cert1));",
      "const cert2 = certifyStreamPipelineSla({ peakMemoryBytes: 131072, maxAllowedMemoryBytes: 65536, droppedChunks: 0, backpressurePauses: 2 });",
      "if (cert2.certified !== false || cert2.grade !== 'FAIL') throw new Error('Failed cert2 memory limit: ' + JSON.stringify(cert2));"
    )
  },

  // ── DAY 52: Edge Security, TLS Offloading & Zero-Trust Identity ─────────────────
  {
    ...NODE_WEB_DAYS[51],
    eTitle: "Validate Client Certificate Expiration",
    eDesc: "Write `validateCertificateValidity(notBefore: number, notAfter: number, currentMs: number): boolean` returning true if currentMs is between notBefore and notAfter (inclusive).",
    eLanguage: "typescript",
    eStarter: lines("function validateCertificateValidity(notBefore, notAfter, currentMs) {", "  // Return whether certificate timestamp is valid", "  return false;", "}"),
    eHint: "return currentMs >= notBefore && currentMs <= notAfter;",
    eTest: lines(
      "if (typeof validateCertificateValidity !== 'function') throw new Error('validateCertificateValidity not found');",
      "if (validateCertificateValidity(1000, 2000, 1500) !== true) throw new Error('Failed valid timestamp check');",
      "if (validateCertificateValidity(1000, 2000, 500) !== false) throw new Error('Failed premature timestamp check');",
      "if (validateCertificateValidity(1000, 2000, 2500) !== false) throw new Error('Failed expired timestamp check');"
    ),
    aTitle: "Evaluate RBAC Scope Authorization",
    aDesc: "Write `evaluateRbacAuthorization(userScopes: string[], requiredAction: string): boolean` returning true if userScopes includes '*' or requiredAction, or a wildcard prefix matching requiredAction (e.g., 'orders:*' matches 'orders:read').",
    aLanguage: "typescript",
    aStarter: lines("function evaluateRbacAuthorization(userScopes, requiredAction) {", "  // Return whether user is authorized for action", "  return false;", "}"),
    aHint: "return userScopes.some(scope => scope === '*' || scope === requiredAction || (scope.endsWith(':*') && requiredAction.startsWith(scope.slice(0, -1))));",
    aTest: lines(
      "if (typeof evaluateRbacAuthorization !== 'function') throw new Error('evaluateRbacAuthorization not found');",
      "if (evaluateRbacAuthorization(['*'], 'payments:create') !== true) throw new Error('Failed global wildcard check');",
      "if (evaluateRbacAuthorization(['orders:*'], 'orders:read') !== true) throw new Error('Failed prefix wildcard check');",
      "if (evaluateRbacAuthorization(['orders:read'], 'orders:delete') !== false) throw new Error('Failed unauthorized action check');"
    )
  },

  // ── DAY 53: Full-Lifecycle Distributed Observability ───────────────────────────
  {
    ...NODE_WEB_DAYS[52],
    eTitle: "Parse W3C Traceparent Header",
    eDesc: "Write `parseW3cTraceparent(header: string): { isValid: boolean; traceId: string | null; parentSpanId: string | null; sampled: boolean }` parsing '00-{32hex}-{16hex}-{flags}'.",
    eLanguage: "typescript",
    eStarter: lines("function parseW3cTraceparent(header) {", "  // Parse W3C traceparent header", "  return { isValid: false, traceId: null, parentSpanId: null, sampled: false };", "}"),
    eHint: "const parts = header.split('-'); if (parts.length === 4 && parts[0] === '00' && parts[1].length === 32 && parts[2].length === 16) return { isValid: true, traceId: parts[1], parentSpanId: parts[2], sampled: parts[3] === '01' }; return { isValid: false, traceId: null, parentSpanId: null, sampled: false };",
    eTest: lines(
      "if (typeof parseW3cTraceparent !== 'function') throw new Error('parseW3cTraceparent not found');",
      "const t1 = parseW3cTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');",
      "if (t1.isValid !== true || t1.traceId !== '4bf92f3577b34da6a3ce929d0e0e4736' || t1.sampled !== true) throw new Error('Failed valid traceparent parse: ' + JSON.stringify(t1));",
      "const t2 = parseW3cTraceparent('invalid-header-format');",
      "if (t2.isValid !== false) throw new Error('Failed invalid traceparent rejection');"
    ),
    aTitle: "Place Histogram Observation in Discrete Buckets",
    aDesc: "Write `placeHistogramObservation(durationMs: number, buckets: number[]): number[]` returning array of upper bounds (le) that durationMs is less than or equal to.",
    aLanguage: "typescript",
    aStarter: lines("function placeHistogramObservation(durationMs, buckets) {", "  // Return matching bucket bounds", "  return [];", "}"),
    aHint: "return buckets.filter(b => durationMs <= b);",
    aTest: lines(
      "if (typeof placeHistogramObservation !== 'function') throw new Error('placeHistogramObservation not found');",
      "const b1 = placeHistogramObservation(42, [10, 25, 50, 100, 250, 500]);",
      "if (b1.length !== 4 || b1[0] !== 50 || b1[1] !== 100) throw new Error('Failed bucket placement 42ms: ' + JSON.stringify(b1));",
      "const b2 = placeHistogramObservation(5, [10, 25, 50]);",
      "if (b2.length !== 3) throw new Error('Failed bucket placement 5ms');"
    )
  },

  // ── DAY 54: Dynamic Reverse Proxying & WebSocket Multiplexing ──────────────────
  {
    ...NODE_WEB_DAYS[53],
    eTitle: "Translate gRPC Status to HTTP Status",
    eDesc: "Write `translateGrpcStatus(grpcCode: number): number` mapping 0 -> 200, 3 -> 400, 5 -> 404, 7 -> 403, 14 -> 503, default -> 500.",
    eLanguage: "typescript",
    eStarter: lines("function translateGrpcStatus(grpcCode) {", "  // Return mapped HTTP status code", "  return 500;", "}"),
    eHint: "const map = { 0: 200, 3: 400, 5: 404, 7: 403, 14: 503 }; return map[grpcCode] || 500;",
    eTest: lines(
      "if (typeof translateGrpcStatus !== 'function') throw new Error('translateGrpcStatus not found');",
      "if (translateGrpcStatus(0) !== 200) throw new Error('0 should map to 200');",
      "if (translateGrpcStatus(3) !== 400) throw new Error('3 should map to 400');",
      "if (translateGrpcStatus(5) !== 404) throw new Error('5 should map to 404');",
      "if (translateGrpcStatus(14) !== 503) throw new Error('14 should map to 503');",
      "if (translateGrpcStatus(99) !== 500) throw new Error('99 should default to 500');"
    ),
    aTitle: "Select Least-Connections Upstream Node",
    aDesc: "Write `selectLeastConnectionsNode(nodes: Array<{ id: string; activeConnections: number; state: string }>): string | null` selecting healthy node (state !== 'OPEN') with lowest activeConnections.",
    aLanguage: "typescript",
    aStarter: lines("function selectLeastConnectionsNode(nodes) {", "  // Return selected node ID", "  return null;", "}"),
    aHint: "const healthy = nodes.filter(n => n.state !== 'OPEN'); if (healthy.length === 0) return null; healthy.sort((a, b) => a.activeConnections - b.activeConnections); return healthy[0].id;",
    aTest: lines(
      "if (typeof selectLeastConnectionsNode !== 'function') throw new Error('selectLeastConnectionsNode not found');",
      "const n1 = selectLeastConnectionsNode([",
      "  { id: 'node_a', activeConnections: 5, state: 'CLOSED' },",
      "  { id: 'node_b', activeConnections: 2, state: 'CLOSED' },",
      "  { id: 'node_c', activeConnections: 1, state: 'OPEN' }",
      "]);",
      "if (n1 !== 'node_b') throw new Error('Failed least-connections selection (node_c is OPEN): ' + n1);",
      "const n2 = selectLeastConnectionsNode([{ id: 'node_x', activeConnections: 0, state: 'OPEN' }]);",
      "if (n2 !== null) throw new Error('Should return null if all nodes OPEN');"
    )
  },

  // ── DAY 55: Milestone 10 (Core): High-Throughput Edge Routing & Policy Engine ───
  {
    ...NODE_WEB_DAYS[54],
    eTitle: "Calculate Adaptive Token Bucket Refill",
    eDesc: "Write `calculateAdaptiveTokenRefill(currentTokens: number, capacity: number, elapsedSec: number, refillRatePerSec: number, upstreamLatencyMs: number): number` where refill rate is halved if upstreamLatencyMs > 200, capped at capacity.",
    eLanguage: "typescript",
    eStarter: lines("function calculateAdaptiveTokenRefill(currentTokens, capacity, elapsedSec, refillRatePerSec, upstreamLatencyMs) {", "  // Return updated token count", "  return 0;", "}"),
    eHint: "const effectiveRefill = upstreamLatencyMs > 200 ? refillRatePerSec * 0.5 : refillRatePerSec; return Number(Math.min(capacity, currentTokens + elapsedSec * effectiveRefill).toFixed(2));",
    eTest: lines(
      "if (typeof calculateAdaptiveTokenRefill !== 'function') throw new Error('calculateAdaptiveTokenRefill not found');",
      "const tok1 = calculateAdaptiveTokenRefill(10, 50, 2, 5, 50);",
      "if (tok1 !== 20.0) throw new Error('Failed normal refill: ' + tok1);",
      "const tok2 = calculateAdaptiveTokenRefill(10, 50, 2, 5, 250);",
      "if (tok2 !== 15.0) throw new Error('Failed throttled refill under latency backpressure: ' + tok2);",
      "const tok3 = calculateAdaptiveTokenRefill(48, 50, 2, 5, 50);",
      "if (tok3 !== 50.0) throw new Error('Failed capacity cap: ' + tok3);"
    ),
    aTitle: "Certify Milestone 10 Capstone Edge Gateway SLA",
    aDesc: "Write `certifyMilestone10Capstone(results: { routePassed: boolean; securityPassed: boolean; rateLimitPassed: boolean; grpcPassed: boolean; circuitBreakerPassed: boolean; otelPassed: boolean; gatewayLatencyMs: number }): { certified: boolean; grade: string }` requiring all flags true and gatewayLatencyMs < 1.0.",
    aLanguage: "typescript",
    aStarter: lines("function certifyMilestone10Capstone(results) {", "  // Return Milestone 10 certification", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const pass = results.routePassed && results.securityPassed && results.rateLimitPassed && results.grpcPassed && results.circuitBreakerPassed && results.otelPassed && results.gatewayLatencyMs < 1.0; return { certified: pass, grade: pass ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyMilestone10Capstone !== 'function') throw new Error('certifyMilestone10Capstone not found');",
      "const c1 = certifyMilestone10Capstone({",
      "  routePassed: true, securityPassed: true, rateLimitPassed: true, grpcPassed: true, circuitBreakerPassed: true, otelPassed: true, gatewayLatencyMs: 0.42",
      "});",
      "if (c1.certified !== true || c1.grade !== 'A+') throw new Error('Failed c1 Grade A+: ' + JSON.stringify(c1));",
      "const c2 = certifyMilestone10Capstone({",
      "  routePassed: true, securityPassed: true, rateLimitPassed: true, grpcPassed: true, circuitBreakerPassed: true, otelPassed: true, gatewayLatencyMs: 1.5",
      "});",
      "if (c2.certified !== false || c2.grade !== 'FAIL') throw new Error('Failed c2 gatewayLatencyMs limit: ' + JSON.stringify(c2));"
    )
  },

  // ── DAY 56: Event-Driven Microservices with Kafka ──────────────────────────────
  {
    ...NODE_WEB_DAYS[55],
    eTitle: "Calculate Kafka Partition Key Hash",
    eDesc: "Write `calculateKafkaPartition(key: string, partitionCount: number): number` computing deterministic hash = `(hash * 31 + charCode) & 0x7fffffff` and returning `hash % partitionCount`.",
    eLanguage: "typescript",
    // [FIX-STAGE: wave1c-nodeweb-anti-constant] Starter fails closed + test rejects hardcoded constants
    eStarter: lines("function calculateKafkaPartition(key, partitionCount) {", "  // Return partition index", "  throw new Error('TODO: implement calculateKafkaPartition');", "}"),
    eHint: "let hash = 0; for (let i = 0; i < key.length; i++) { hash = (hash * 31 + key.charCodeAt(i)) & 0x7fffffff; } return hash % partitionCount;",
    eTest: lines(
      "if (typeof calculateKafkaPartition !== 'function') throw new Error('calculateKafkaPartition not found');",
      "const p1 = calculateKafkaPartition('cust_101', 4);",
      "const p2 = calculateKafkaPartition('cust_101', 4);",
      "if (p1 !== p2) throw new Error('Hashing must be deterministic');",
      "if (typeof p1 !== 'number' || Number.isNaN(p1) || p1 < 0 || p1 >= 4) throw new Error('Partition out of range: ' + p1);",
      "const p3 = calculateKafkaPartition('cust_202', 4);",
      "if (typeof p3 !== 'number' || Number.isNaN(p3) || p3 < 0 || p3 >= 4) throw new Error('Partition out of range for cust_202: ' + p3);",
      "if (p1 === p3) throw new Error('Distinct keys must yield distinct partitions (hardcoded constant rejected)');"
    ),
    aTitle: "Evaluate Consumer Lag & Throttle State",
    aDesc: "Write `evaluateConsumerLag(logEndOffset: number, currentOffset: number, maxAllowedLag: number): { lag: number; shouldThrottle: boolean }` calculating `lag = logEndOffset - currentOffset` and `shouldThrottle = lag > maxAllowedLag`.",
    aLanguage: "typescript",
    aStarter: lines("function evaluateConsumerLag(logEndOffset, currentOffset, maxAllowedLag) {", "  // Return lag state", "  return { lag: 0, shouldThrottle: false };", "}"),
    aHint: "const lag = logEndOffset - currentOffset; return { lag, shouldThrottle: lag > maxAllowedLag };",
    aTest: lines(
      "if (typeof evaluateConsumerLag !== 'function') throw new Error('evaluateConsumerLag not found');",
      "const l1 = evaluateConsumerLag(1000, 950, 100);",
      "if (l1.lag !== 50 || l1.shouldThrottle !== false) throw new Error('Failed under lag threshold: ' + JSON.stringify(l1));",
      "const l2 = evaluateConsumerLag(1000, 800, 100);",
      "if (l2.lag !== 200 || l2.shouldThrottle !== true) throw new Error('Failed over lag threshold: ' + JSON.stringify(l2));",
      "const l3 = evaluateConsumerLag(500, 500, 50);",
      "if (l3.lag !== 0 || l3.shouldThrottle !== false) throw new Error('Failed zero lag: ' + JSON.stringify(l3));"
    )
  },

  // ── DAY 57: CQRS, Event Sourcing & Transactional Outbox ────────────────────────
  {
    ...NODE_WEB_DAYS[56],
    eTitle: "Create Outbox Event Record",
    eDesc: "Write `createOutboxRecord(aggregateType: string, aggregateId: string, eventType: string, payload: any, sequence: number): { outboxId: string; aggregateType: string; aggregateId: string; eventType: string; payload: any; status: string }` returning outbox object with `outboxId = 'out_' + sequence` and `status = 'PENDING'`.",
    eLanguage: "typescript",
    eStarter: lines("function createOutboxRecord(aggregateType, aggregateId, eventType, payload, sequence) {", "  // Return staged outbox record", "  return {};", "}"),
    eHint: "return { outboxId: 'out_' + sequence, aggregateType, aggregateId, eventType, payload, status: 'PENDING' };",
    eTest: lines(
      "if (typeof createOutboxRecord !== 'function') throw new Error('createOutboxRecord not found');",
      "const r1 = createOutboxRecord('Order', 'ord_501', 'OrderPlaced', { amount: 150 }, 1);",
      "if (r1.outboxId !== 'out_1' || r1.aggregateId !== 'ord_501' || r1.status !== 'PENDING') throw new Error('Failed r1: ' + JSON.stringify(r1));",
      "if (r1.eventType !== 'OrderPlaced' || r1.payload.amount !== 150) throw new Error('Failed payload matching: ' + JSON.stringify(r1));"
    ),
    aTitle: "Verify CQRS Optimistic Version Guard",
    aDesc: "Write `verifyOptimisticVersion(expectedVersion: number, currentVersion: number): { canAppend: boolean; conflictReason: string | null }` returning `{ canAppend: true, conflictReason: null }` if `currentVersion === expectedVersion`, else `{ canAppend: false, conflictReason: 'VERSION_MISMATCH' }`.",
    aLanguage: "typescript",
    aStarter: lines("function verifyOptimisticVersion(expectedVersion, currentVersion) {", "  // Return version check result", "  return { canAppend: false, conflictReason: null };", "}"),
    aHint: "if (currentVersion === expectedVersion) return { canAppend: true, conflictReason: null }; return { canAppend: false, conflictReason: 'VERSION_MISMATCH' };",
    aTest: lines(
      "if (typeof verifyOptimisticVersion !== 'function') throw new Error('verifyOptimisticVersion not found');",
      "const v1 = verifyOptimisticVersion(5, 5);",
      "if (v1.canAppend !== true || v1.conflictReason !== null) throw new Error('Failed matching version: ' + JSON.stringify(v1));",
      "const v2 = verifyOptimisticVersion(5, 4);",
      "if (v2.canAppend !== false || v2.conflictReason !== 'VERSION_MISMATCH') throw new Error('Failed mismatch version: ' + JSON.stringify(v2));"
    )
  },

  // ── DAY 58: Distributed Sagas & Compensation Workflows ─────────────────────────
  {
    ...NODE_WEB_DAYS[57],
    eTitle: "Evaluate Idempotency Key Duplicate State",
    eDesc: "Write `evaluateIdempotencyKey(key: string, processedMap: Record<string, any>): { isDuplicate: boolean; cachedResult: any }` checking if `key` exists in `processedMap`. If yes, returns `{ isDuplicate: true, cachedResult: processedMap[key] }`; else `{ isDuplicate: false, cachedResult: null }`.",
    eLanguage: "typescript",
    eStarter: lines("function evaluateIdempotencyKey(key, processedMap) {", "  // Return idempotency evaluation", "  return { isDuplicate: false, cachedResult: null };", "}"),
    eHint: "if (Object.prototype.hasOwnProperty.call(processedMap, key)) return { isDuplicate: true, cachedResult: processedMap[key] }; return { isDuplicate: false, cachedResult: null };",
    eTest: lines(
      "if (typeof evaluateIdempotencyKey !== 'function') throw new Error('evaluateIdempotencyKey not found');",
      "const map = { 'saga_1:pay': { charged: 100 } };",
      "const e1 = evaluateIdempotencyKey('saga_1:pay', map);",
      "if (e1.isDuplicate !== true || e1.cachedResult.charged !== 100) throw new Error('Failed cached duplicate: ' + JSON.stringify(e1));",
      "const e2 = evaluateIdempotencyKey('saga_2:pay', map);",
      "if (e2.isDuplicate !== false || e2.cachedResult !== null) throw new Error('Failed fresh key: ' + JSON.stringify(e2));"
    ),
    aTitle: "Execute Reverse LIFO Compensation Stack",
    aDesc: "Write `executeLifoCompensations(compensations: Array<{ step: string; executed: boolean }>): string[]` popping each compensation and returning array of step names in reverse order (LIFO).",
    aLanguage: "typescript",
    aStarter: lines("function executeLifoCompensations(compensations) {", "  // Return rolled back step names in LIFO order", "  return [];", "}"),
    aHint: "const stack = [...compensations]; const rolledBack = []; while (stack.length > 0) { const item = stack.pop(); rolledBack.push(item.step); } return rolledBack;",
    aTest: lines(
      "if (typeof executeLifoCompensations !== 'function') throw new Error('executeLifoCompensations not found');",
      "const comps = [{ step: 'CANCEL_ORDER', executed: false }, { step: 'REFUND_PAYMENT', executed: false }];",
      "const res = executeLifoCompensations(comps);",
      "if (res.length !== 2 || res[0] !== 'REFUND_PAYMENT' || res[1] !== 'CANCEL_ORDER') throw new Error('Failed LIFO reversal: ' + JSON.stringify(res));",
      "const empty = executeLifoCompensations([]);",
      "if (empty.length !== 0) throw new Error('Failed empty stack: ' + JSON.stringify(empty));"
    )
  },

  // ── DAY 59: High-Throughput Caching & Write-Behind Pipelines ────────────────────
  {
    ...NODE_WEB_DAYS[58],
    eTitle: "Compute Redis Cluster Hash Slot with Hash Tags",
    eDesc: "Write `computeRedisClusterSlot(key: string): number` extracting `{tag}` if present, computing hash with `hash = ((hash << 5) - hash + charCode) & 0xffff` and returning `Math.abs(hash) % 16384`.",
    eLanguage: "typescript",
    // [FIX-STAGE: wave1c-nodeweb-anti-constant] Starter fails closed + test rejects hardcoded constants and verifies {tag} semantics
    eStarter: lines("function computeRedisClusterSlot(key) {", "  // Return CRC16 hash slot 0..16383", "  throw new Error('TODO: implement computeRedisClusterSlot');", "}"),
    eHint: "let hKey = key; const m = key.match(/\\{([^\\}]+)\\}/); if (m) hKey = m[1]; let hash = 0; for (let i = 0; i < hKey.length; i++) { hash = ((hash << 5) - hash + hKey.charCodeAt(i)) & 0xffff; } return Math.abs(hash) % 16384;",
    eTest: lines(
      "if (typeof computeRedisClusterSlot !== 'function') throw new Error('computeRedisClusterSlot not found');",
      "const s1 = computeRedisClusterSlot('{user:991}.profile');",
      "const s2 = computeRedisClusterSlot('{user:991}.orders');",
      "const sTagOnly = computeRedisClusterSlot('user:991');",
      "if (s1 !== s2 || s1 !== sTagOnly) throw new Error('Hash tags must collocate on identical slot as tag: ' + s1 + ' vs ' + s2 + ' vs ' + sTagOnly);",
      "if (typeof s1 !== 'number' || Number.isNaN(s1) || s1 <= 0 || s1 >= 16384) throw new Error('Slot out of bounds: ' + s1);",
      "const s3 = computeRedisClusterSlot('standaloneKey');",
      "if (typeof s3 !== 'number' || Number.isNaN(s3) || s3 < 0 || s3 >= 16384) throw new Error('Slot must be valid number');",
      "if (s1 === s3) throw new Error('Distinct keys must produce distinct hash slots (hardcoded constant rejected)');"
    ),
    aTitle: "Coalesce Write-Behind Delta Increments",
    aDesc: "Write `coalesceWriteBehindDeltas(updates: Array<{ id: string; delta: number }>): Record<string, number>` aggregating all deltas for each distinct `id`.",
    aLanguage: "typescript",
    aStarter: lines("function coalesceWriteBehindDeltas(updates) {", "  // Return coalesced map of id -> totalDelta", "  return {};", "}"),
    aHint: "const res = {}; for (const u of updates) { res[u.id] = (res[u.id] || 0) + u.delta; } return res;",
    aTest: lines(
      "if (typeof coalesceWriteBehindDeltas !== 'function') throw new Error('coalesceWriteBehindDeltas not found');",
      "const batch = [",
      "  { id: 'item_1', delta: 2 },",
      "  { id: 'item_1', delta: 3 },",
      "  { id: 'item_2', delta: 5 }",
      "];",
      "const coalesced = coalesceWriteBehindDeltas(batch);",
      "if (coalesced['item_1'] !== 5 || coalesced['item_2'] !== 5) throw new Error('Failed delta coalescing: ' + JSON.stringify(coalesced));",
      "if (Object.keys(coalesced).length !== 2) throw new Error('Must contain exactly 2 distinct keys');"
    )
  },

  // ── DAY 60: Milestone 10 Capstone: High-Throughput Event-Driven Microservices Hub 
  {
    ...NODE_WEB_DAYS[59],
    eTitle: "Verify Outbox Partition Key Integrity",
    eDesc: "Write `verifyOutboxPartition(aggregateId: string, partitionCount: number, expectedPartition: number): boolean` computing `hash = (hash * 31 + charCode) & 0x7fffffff` and checking if `(hash % partitionCount) === expectedPartition`.",
    eLanguage: "typescript",
    eStarter: lines("function verifyOutboxPartition(aggregateId, partitionCount, expectedPartition) {", "  // Return boolean match", "  return false;", "}"),
    eHint: "let hash = 0; for (let i = 0; i < aggregateId.length; i++) { hash = (hash * 31 + aggregateId.charCodeAt(i)) & 0x7fffffff; } return (hash % partitionCount) === expectedPartition;",
    eTest: lines(
      "if (typeof verifyOutboxPartition !== 'function') throw new Error('verifyOutboxPartition not found');",
      "let computed = 0; for (let i = 0; i < 'ord_99'.length; i++) { computed = (computed * 31 + 'ord_99'.charCodeAt(i)) & 0x7fffffff; }",
      "const expectedP = computed % 4;",
      "const v1 = verifyOutboxPartition('ord_99', 4, expectedP);",
      "if (v1 !== true) throw new Error('Failed expected partition match: ' + v1);",
      "const v2 = verifyOutboxPartition('ord_99', 4, (expectedP + 1) % 4);",
      "if (v2 !== false) throw new Error('Failed non-matching partition');"
    ),
    aTitle: "Certify Milestone 10 Capstone Hub Architecture",
    aDesc: "Write `certifyMilestone10Capstone(results: { outboxPassed: boolean; sagaPassed: boolean; idempotencyPassed: boolean; redisSlotPassed: boolean; writeBehindPassed: boolean; hubLatencyMs: number }): { certified: boolean; grade: string }` requiring all 5 passed flags true and `hubLatencyMs < 1.0`.",
    aLanguage: "typescript",
    aStarter: lines("function certifyMilestone10Capstone(results) {", "  // Return Milestone 10 Capstone certification", "  return { certified: false, grade: 'FAIL' };", "}"),
    aHint: "const pass = results.outboxPassed && results.sagaPassed && results.idempotencyPassed && results.redisSlotPassed && results.writeBehindPassed && results.hubLatencyMs < 1.0; return { certified: pass, grade: pass ? 'A+' : 'FAIL' };",
    aTest: lines(
      "if (typeof certifyMilestone10Capstone !== 'function') throw new Error('certifyMilestone10Capstone not found');",
      "const c1 = certifyMilestone10Capstone({",
      "  outboxPassed: true, sagaPassed: true, idempotencyPassed: true, redisSlotPassed: true, writeBehindPassed: true, hubLatencyMs: 0.35",
      "});",
      "if (c1.certified !== true || c1.grade !== 'A+') throw new Error('Failed Grade A+ Capstone check: ' + JSON.stringify(c1));",
      "const c2 = certifyMilestone10Capstone({",
      "  outboxPassed: true, sagaPassed: true, idempotencyPassed: true, redisSlotPassed: true, writeBehindPassed: true, hubLatencyMs: 2.1",
      "});",
      "if (c2.certified !== false || c2.grade !== 'FAIL') throw new Error('Failed hubLatencyMs limit check: ' + JSON.stringify(c2));"
    )
  }
];

export const NODE_WEB_30_DAYS_QUESTS = NODE_WEB_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('node-web', i + 1, cfg)
);
