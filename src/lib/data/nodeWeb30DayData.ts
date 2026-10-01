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
    eHint: "Calculate days, hours, minutes, and seconds using Math.floor and modulo arithmetic.",
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
    aHint: "Loop through argv; if an argument starts with '--', check if the next argument does not start with '--'.",
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
    eTitle: "Normalize API URL Path",
    eDesc: "Write `normalizeApiPath(base: string, endpoint: string): string` that joins a base path and endpoint ensuring exactly one leading `/`, no trailing `/` (unless root), and no duplicate slashes.",
    eLanguage: "typescript",
    eStarter: lines("function normalizeApiPath(base: string, endpoint: string): string {", "  // Normalize and join paths", "  return '';", "}"),
    eHint: "Combine strings, replace multiple slashes with a single slash, ensure leading slash and remove trailing slash.",
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
    aHint: "Check if the path has an extension after the last slash using regex or string methods.",
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
    eHint: "Check if result.success is true: return 'OK: ' + JSON.stringify(result.data), else 'ERR: ' + result.error.",
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
    aHint: "Check typeof value === 'string' && value.trim().length > 0.",
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
    eTitle: "Generic Pick Fields Utility",
    eDesc: "Write `pickFields<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>` that extracts only the selected keys into a new object.",
    eLanguage: "typescript",
    eStarter: lines("function pickFields<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {", "  // Return new object with selected keys", "  return {} as any;", "}"),
    eHint: "Iterate through keys; if key in obj, assign out[key] = obj[key].",
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
    aHint: "Create a copy of defaults, then override with non-undefined fields from provided.",
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
    eHint: "Use try/catch around await primary(), calling await fallback() inside catch.",
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
    aHint: "Map tasks to task(), use Promise.allSettled, then partition by status === 'fulfilled'.",
    aTest: lines(
      "if (typeof settleAllBatch !== 'function') throw new Error('settleAllBatch not found');",
      "const tasks = [async () => 'a', async () => { throw new Error('b-err'); }, async () => 'c'];",
      "const res = await settleAllBatch(tasks);",
      "if (res.succeeded.length !== 2 || res.succeeded[0] !== 'a' || res.succeeded[1] !== 'c') throw new Error('Succeeded items incorrect');",
      "if (res.failed.length !== 1 || res.failed[0] !== 'b-err') throw new Error('Failed items incorrect');"
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
    aHint: "Split header on ';' and trim parts. Check for 'charset=' in secondary parameters.",
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
    eHint: "Return { status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }.",
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
    aHint: "Check req.method !== 'POST', then req.body === undefined, then return JSON.stringify(req.body).",
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
    eHint: "Split pattern and path on '/' and compare segment by segment. Segments starting with ':' are parameter names.",
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
    aHint: "Find route where r.method === method && r.path === path.",
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
    eHint: "Use URLSearchParams, parse integers with Number(), enforce Math.max(1, page) and Math.min(100, Math.max(1, limit)).",
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
    aHint: "Use URLSearchParams, iterate entries, and keep only keys in allowedKeys.",
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
    eHint: "Push error messages into an array; return { valid: errors.length === 0, errors }.",
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
    aHint: "Filter required list where obj[k] is null, undefined, or ''.",
    aTest: lines(
      "if (typeof requireFields !== 'function') throw new Error('requireFields not found');",
      "const r1 = requireFields({ title: 'Dev', company: 'TCS' }, ['title', 'company']);",
      "if (!r1.ok || r1.missing.length !== 0) throw new Error('All present should be ok');",
      "const r2 = requireFields({ title: 'Dev', company: '' }, ['title', 'company', 'salary']);",
      "if (r2.ok || r2.missing.length !== 2 || !r2.missing.includes('company') || !r2.missing.includes('salary')) throw new Error('Should flag company and salary');"
    )
  },

  // ── DAY 11: Middleware Chains ─────────────────────────────────────────────
  {
    ...NODE_WEB_DAYS[10],
    eTitle: "Compose Onion Middleware",
    eDesc: "Write `composeMiddleware(middlewares: ((ctx: any, next: () => Promise<void>) => Promise<void>)[]): (ctx: any) => Promise<void>` executing middlewares in onion order.",
    eLanguage: "typescript",
    eStarter: lines("function composeMiddleware(middlewares: ((ctx: any, next: () => Promise<void>) => Promise<void>)[]): (ctx: any) => Promise<void> {", "  // Return composed runner", "  return async function(ctx: any) {};", "}"),
    eHint: "Recursive dispatch function: dispatch(i) calls middlewares[i](ctx, () => dispatch(i + 1)).",
    eTest: lines(
      "if (typeof composeMiddleware !== 'function') throw new Error('composeMiddleware not found');",
      "const calls = [];",
      "const m1 = async (ctx, next) => { calls.push('m1-in'); await next(); calls.push('m1-out'); };",
      "const m2 = async (ctx, next) => { calls.push('m2-in'); await next(); calls.push('m2-out'); };",
      "const run = composeMiddleware([m1, m2]);",
      "await run({});",
      "if (calls.join(',') !== 'm1-in,m2-in,m2-out,m1-out') throw new Error('Onion execution order failed: ' + calls.join(','));",
      "const singleCalls = [];",
      "const single = async (ctx, next) => { singleCalls.push('only'); await next(); };",
      "await composeMiddleware([single])({});",
      "if (singleCalls.join(',') !== 'only') throw new Error('Single middleware failed');"
    ),
    aTitle: "Execution Timing Middleware",
    aDesc: "Write `timingMiddleware(fn: () => Promise<any>): Promise<{ result: any; durationMs: number }>` that times execution of an async function.",
    aLanguage: "typescript",
    aStarter: lines("async function timingMiddleware(fn: () => Promise<any>): Promise<{ result: any; durationMs: number }> {", "  // Time the function and return result", "  return null as any;", "}"),
    aHint: "Record Date.now() before and after calling await fn().",
    aTest: lines(
      "if (typeof timingMiddleware !== 'function') throw new Error('timingMiddleware not found');",
      "const timed = await timingMiddleware(async () => 100);",
      "if (timed.result !== 100 || typeof timed.durationMs !== 'number' || timed.durationMs < 0) throw new Error('Failed timingMiddleware');"
    )
  },

  // ── DAY 12: RFC 7807 Problem Details ──────────────────────────────────────
  {
    ...NODE_WEB_DAYS[11],
    eTitle: "Format RFC 7807 Problem Details",
    eDesc: "Write `formatProblemDetails(status: number, title: string, detail: string, instance?: string)` returning an RFC 7807 compliant error object.",
    eLanguage: "typescript",
    eStarter: lines("function formatProblemDetails(status: number, title: string, detail: string, instance?: string): Record<string, unknown> {", "  // Return RFC 7807 object", "  return {};", "}"),
    eHint: "Return { type: 'about:blank', title, status, detail, ...(instance ? { instance } : {}) }.",
    eTest: lines(
      "if (typeof formatProblemDetails !== 'function') throw new Error('formatProblemDetails not found');",
      "const p1 = formatProblemDetails(404, 'Not Found', 'Job 42 not found', '/jobs/42');",
      "if (p1.status !== 404 || p1.title !== 'Not Found' || p1.instance !== '/jobs/42' || p1.type !== 'about:blank') throw new Error('p1 format failed');",
      "const p2 = formatProblemDetails(500, 'Server Error', 'Internal failure');",
      "if (p2.status !== 500 || 'instance' in p2) throw new Error('p2 should not have instance');"
    ),
    aTitle: "Format Validation Problem Details",
    aDesc: "Write `formatValidationProblem(invalidParams: { name: string; reason: string }[]): Record<string, unknown>` returning status 400 problem details with `invalidParams`.",
    aLanguage: "typescript",
    aStarter: lines("function formatValidationProblem(invalidParams: { name: string; reason: string }[]): Record<string, unknown> {", "  // Return validation problem details", "  return {};", "}"),
    aHint: "Return status 400 with title 'Validation Failed', detail 'One or more fields failed validation', and invalidParams array.",
    aTest: lines(
      "if (typeof formatValidationProblem !== 'function') throw new Error('formatValidationProblem not found');",
      "const v1 = formatValidationProblem([{ name: 'email', reason: 'Must contain @' }]);",
      "if (v1.status !== 400 || v1.title !== 'Validation Failed' || !Array.isArray(v1.invalidParams) || v1.invalidParams.length !== 1 || v1.invalidParams[0].name !== 'email') throw new Error('Validation problem shape failed');",
      "const v2 = formatValidationProblem([{ name: 'password', reason: 'Too short' }, { name: 'age', reason: 'Under 18' }]);",
      "if (v2.invalidParams.length !== 2 || v2.invalidParams[1].name !== 'age') throw new Error('Multiple invalidParams failed');"
    )
  },

  // ── DAY 13: Structured JSON Logging ───────────────────────────────────────
  {
    ...NODE_WEB_DAYS[12],
    eTitle: "Format Structured JSON Log Entry",
    eDesc: "Write `formatLogEntry(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>): string` returning a stringified JSON log record.",
    eLanguage: "typescript",
    eStarter: lines("function formatLogEntry(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>): string {", "  // Return JSON log string", "  return '';", "}"),
    eHint: "Return JSON.stringify({ level, message, ...(meta || {}) }).",
    eTest: lines(
      "if (typeof formatLogEntry !== 'function') throw new Error('formatLogEntry not found');",
      "const json = formatLogEntry('info', 'Server started', { port: 3000 });",
      "const parsed = JSON.parse(json);",
      "if (parsed.level !== 'info' || parsed.message !== 'Server started' || parsed.port !== 3000) throw new Error('Log JSON structure failed');",
      "const json2 = formatLogEntry('error', 'DB failed');",
      "const parsed2 = JSON.parse(json2);",
      "if (parsed2.level !== 'error' || parsed2.message !== 'DB failed' || 'port' in parsed2) throw new Error('Second log entry failed');"
    ),
    aTitle: "Mask Sensitive Log Fields",
    aDesc: "Write `maskSensitiveFields(data: Record<string, unknown>, sensitiveKeys: string[] = ['password', 'token', 'secret']): Record<string, unknown>` replacing sensitive values with `'***REDACTED***'`.",
    aLanguage: "typescript",
    aStarter: lines("function maskSensitiveFields(data: Record<string, unknown>, sensitiveKeys: string[] = ['password', 'token', 'secret']): Record<string, unknown> {", "  // Redact sensitive keys", "  return {};", "}"),
    aHint: "Iterate object keys; if lowercased key matches sensitiveKeys, set value to '***REDACTED***'.",
    aTest: lines(
      "if (typeof maskSensitiveFields !== 'function') throw new Error('maskSensitiveFields not found');",
      "const raw = { user: 'admin', password: 'my-secret', token: 'xyz123', email: 'a@a.com' };",
      "const masked = maskSensitiveFields(raw);",
      "if (masked.user !== 'admin' || masked.email !== 'a@a.com') throw new Error('Safe fields modified');",
      "if (masked.password !== '***REDACTED***' || masked.token !== '***REDACTED***') throw new Error('Sensitive fields not redacted');",
      "const raw2 = { secret: 'topsecret', name: 'PinIT' };",
      "const masked2 = maskSensitiveFields(raw2);",
      "if (masked2.name !== 'PinIT' || masked2.secret !== '***REDACTED***' || 'user' in masked2) throw new Error('Custom fields redaction failed');"
    )
  },

  // ── DAY 14: Configuration Management ──────────────────────────────────────
  {
    ...NODE_WEB_DAYS[13],
    eTitle: "Validate Server App Configuration",
    eDesc: "Write `validateAppConfig(env: Record<string, string | undefined>): { PORT: number; NODE_ENV: string; DATABASE_URL: string }` validating env with defaults and throwing if DATABASE_URL is missing.",
    eLanguage: "typescript",
    eStarter: lines("function validateAppConfig(env: Record<string, string | undefined>): { PORT: number; NODE_ENV: string; DATABASE_URL: string } {", "  // Validate and parse environment", "  return null as any;", "}"),
    eHint: "If (!env.DATABASE_URL) throw new Error('DATABASE_URL is required'); parse PORT with Number(env.PORT || 3000).",
    eTest: lines(
      "if (typeof validateAppConfig !== 'function') throw new Error('validateAppConfig not found');",
      "const c1 = validateAppConfig({ DATABASE_URL: 'postgres://db' });",
      "if (c1.PORT !== 3000 || c1.NODE_ENV !== 'development' || c1.DATABASE_URL !== 'postgres://db') throw new Error('Failed c1 defaults');",
      "const c2 = validateAppConfig({ PORT: '8080', NODE_ENV: 'production', DATABASE_URL: 'postgres://prod' });",
      "if (c2.PORT !== 8080 || c2.NODE_ENV !== 'production') throw new Error('Failed c2 custom values');",
      "let threw = false; try { validateAppConfig({}); } catch (e) { threw = true; }",
      "if (!threw) throw new Error('Should throw when DATABASE_URL is missing');"
    ),
    aTitle: "Freeze Configuration Object Recursively",
    aDesc: "Write `freezeConfig<T extends Record<string, unknown>>(config: T): Readonly<T>` that recursively deep freezes an object preventing modification.",
    aLanguage: "typescript",
    aStarter: lines("function freezeConfig<T extends Record<string, unknown>>(config: T): Readonly<T> {", "  // Deep freeze object", "  return config;", "}"),
    aHint: "Use Object.freeze, and recursively call freezeConfig on any nested objects.",
    aTest: lines(
      "if (typeof freezeConfig !== 'function') throw new Error('freezeConfig not found');",
      "const cfg = freezeConfig({ app: { name: 'PinIT' } });",
      "if (!Object.isFrozen(cfg) || !Object.isFrozen(cfg.app)) throw new Error('Deep freeze failed');",
      "const cfg2 = freezeConfig({ env: 'prod' });",
      "if (!Object.isFrozen(cfg2) || cfg2.env !== 'prod' || 'app' in cfg2) throw new Error('freezeConfig should preserve properties');"
    )
  },

  // ── DAY 15: Pagination & Sorting Standards ────────────────────────────────
  {
    ...NODE_WEB_DAYS[14],
    eTitle: "Paginate In-Memory List",
    eDesc: "Write `paginateList<T>(items: T[], page: number, limit: number): { data: T[]; total: number; totalPages: number; page: number }` slicing items for the given 1-based page and limit.",
    eLanguage: "typescript",
    eStarter: lines("function paginateList<T>(items: T[], page: number, limit: number): { data: T[]; total: number; totalPages: number; page: number } {", "  // Slice items and compute pagination metadata", "  return null as any;", "}"),
    eHint: "const start = (page - 1) * limit; const data = items.slice(start, start + limit); totalPages = Math.ceil(items.length / limit).",
    eTest: lines(
      "if (typeof paginateList !== 'function') throw new Error('paginateList not found');",
      "const r1 = paginateList([1, 2, 3, 4, 5], 1, 2);",
      "if (r1.data.length !== 2 || r1.data[0] !== 1 || r1.total !== 5 || r1.totalPages !== 3 || r1.page !== 1) throw new Error('Page 1 failed');",
      "const r2 = paginateList([1, 2, 3, 4, 5], 3, 2);",
      "if (r2.data.length !== 1 || r2.data[0] !== 5 || r2.page !== 3) throw new Error('Page 3 failed');"
    ),
    aTitle: "Sort Entity Collection",
    aDesc: "Write `sortEntities<T extends Record<string, any>>(items: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): T[]` returning a new array sorted by the specified field.",
    aLanguage: "typescript",
    aStarter: lines("function sortEntities<T extends Record<string, any>>(items: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {", "  // Return sorted copy of items", "  return [];", "}"),
    aHint: "Copy items with [...items] then call sort with comparison on a[field] and b[field].",
    aTest: lines(
      "if (typeof sortEntities !== 'function') throw new Error('sortEntities not found');",
      "const users = [{ id: 2, name: 'Bob' }, { id: 1, name: 'Alice' }];",
      "const sorted = sortEntities(users, 'id', 'asc');",
      "if (sorted[0].id !== 1 || sorted[1].id !== 2) throw new Error('Ascending sort failed');",
      "if (users[0].id !== 2) throw new Error('Original array was mutated');",
      "const desc = sortEntities(users, 'name', 'desc');",
      "if (desc[0].name !== 'Bob' || desc[1].name !== 'Alice') throw new Error('Descending sort failed');"
    )
  }
];

export const NODE_WEB_30_DAYS_QUESTS = NODE_WEB_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('node-web', i + 1, cfg)
);
