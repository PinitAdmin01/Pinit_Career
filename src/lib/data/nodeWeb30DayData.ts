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
      "if (timed.result !== 100 || typeof timed.durationMs !== 'number' || timed.durationMs < 0) throw new Error('Failed timingMiddleware number');",
      "const timed2 = await timingMiddleware(async () => 'hello');",
      "if (timed2.result !== 'hello' || typeof timed2.durationMs !== 'number' || timed2.durationMs < 0) throw new Error('Failed timingMiddleware string');",
      "const timed3 = await timingMiddleware(async () => [1, 2, 3]);",
      "if (!Array.isArray(timed3.result) || timed3.result.length !== 3 || timed3.result[0] !== 1 || typeof timed3.durationMs !== 'number' || timed3.durationMs < 0) throw new Error('Failed timingMiddleware array');"
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
  },

  // ── DAY 16: Password Security & Cryptographic Hashing ─────────────────────
  {
    ...NODE_WEB_DAYS[15],
    eTitle: "Timing-Safe String Comparison",
    eDesc: "Write `compareConstantTime(a: string, b: string): boolean` that compares two secret strings with constant-time execution loop to resist timing attacks.",
    eLanguage: "typescript",
    eStarter: lines("function compareConstantTime(a: string, b: string): boolean {", "  // Timing-safe string comparison", "  return false;", "}"),
    eHint: "If lengths differ return false. Compute bitwise diff across character codes in a loop.",
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
    aHint: "Check password length >= 8, /[A-Z]/.test(password), /[a-z]/.test(password), /[0-9]/.test(password).",
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
    eHint: "If header is missing return null. Use regex /^Bearer\\s+(\\S+)$/i to extract token.",
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
    aHint: "Format parts: name=encodeURIComponent(value), Max-Age, HttpOnly, Secure, SameSite, and join with '; '.",
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
    eHint: "Split token on '.', check 3 parts. Normalize base64url chars (- to +, _ to /) and pad with '=', then atob and JSON.parse.",
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
    aHint: "If typeof payload.exp !== 'number' return { valid: false, expired: false }. expired is exp <= currentTimestampSeconds.",
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
    eHint: "Look up role in rolePermissions; return true if list includes '*' or requiredPermission.",
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
    aHint: "Return 401 if user is null; 403 if none of user.roles match allowedRoles; 200 if authorized.",
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
    eHint: "Filter timestamps > now - windowMs. If length >= maxRequests return allowed: false with retryAfterMs = timestamps[0] + windowMs - now. Else append now and return allowed: true.",
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
    aDesc: "Write `sanitizeHtmlInput(input: string): string` replacing &, <, >, \\\", ' with safe HTML entities.",
    aLanguage: "typescript",
    aStarter: lines("function sanitizeHtmlInput(input: string): string {", "  // Escape HTML entities", "  return '';", "}"),
    aHint: "Use string replacement on &, <, >, \\\", ' to produce entity equivalents.",
    aTest: lines(
      "if (typeof sanitizeHtmlInput !== 'function') throw new Error('sanitizeHtmlInput not found');",
      "if (sanitizeHtmlInput('<script>alert(\\\"xss\\\")</script>') !== '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;') throw new Error('Script tag sanitization failed');",
      "if (sanitizeHtmlInput('Tom & Jerry\\'s') !== 'Tom &amp; Jerry&#39;s') throw new Error('Ampersand and quote failed');",
      "if (sanitizeHtmlInput('Hello World!') !== 'Hello World!') throw new Error('Clean string altered');"
    )
  },

  // ── DAY 21: Data Access Layer & In-Memory Repository ───────────────────────
  {
    ...NODE_WEB_DAYS[20],
    eTitle: "In-Memory Entity Repository (CRUD)",
    eDesc: "Write `createEntityRepository<T extends { id: string }>()` providing create, findById, findAll, and delete methods.",
    eLanguage: "typescript",
    eStarter: lines("function createEntityRepository<T extends { id: string }>() {", "  // Return in-memory repository object", "  return {} as any;", "}"),
    eHint: "Use Map<string, T>. create throws on duplicate id; findById returns clone or null; findAll returns array of clones; delete returns boolean.",
    eTest: lines(
      "if (typeof createEntityRepository !== 'function') throw new Error('createEntityRepository not found');",
      "const repo = createEntityRepository();",
      "repo.create({ id: '1', name: 'Alice' });",
      "if (!repo.findById('1') || repo.findById('1').name !== 'Alice') throw new Error('findById failed');",
      "if (repo.findAll().length !== 1) throw new Error('findAll failed');",
      "let threw = false; try { repo.create({ id: '1', name: 'Duplicate' }); } catch { threw = true; }",
      "if (!threw) throw new Error('Duplicate id should throw');",
      "if (!repo.delete('1') || repo.findById('1') !== null) throw new Error('delete failed');"
    ),
    aTitle: "Immutable Entity Patch Update",
    aDesc: "Write `updateEntity<T extends { id: string }>(items: T[], id: string, patch: Partial<T>): { updated: T | null; nextItems: T[] }` without mutating input array.",
    aLanguage: "typescript",
    aStarter: lines("function updateEntity<T extends { id: string }>(items: T[], id: string, patch: Partial<T>): { updated: T | null; nextItems: T[] } {", "  // Return updated entity and immutable next array", "  return { updated: null, nextItems: [] };", "}"),
    aHint: "Find entity by id. If missing return updated: null, nextItems: [...items]. Else return cloned and patched entity with copied array.",
    aTest: lines(
      "if (typeof updateEntity !== 'function') throw new Error('updateEntity not found');",
      "const orig = [{ id: '1', name: 'Dev', salary: 50000 }, { id: '2', name: 'QA', salary: 40000 }];",
      "const res = updateEntity(orig, '1', { salary: 60000 });",
      "if (!res.updated || res.updated.salary !== 60000 || res.updated.name !== 'Dev') throw new Error('Updated item incorrect');",
      "if (orig[0].salary !== 50000) throw new Error('Original items mutated');",
      "if (res.nextItems[0].salary !== 60000 || res.nextItems.length !== 2) throw new Error('nextItems incorrect');",
      "const missing = updateEntity(orig, '99', { salary: 10000 });",
      "if (missing.updated !== null) throw new Error('Missing ID should return null updated');"
    )
  },

  // ── DAY 22: Advanced Repository Querying & State Mutation ─────────────────
  {
    ...NODE_WEB_DAYS[21],
    eTitle: "Filter Entities with Composable Predicates",
    eDesc: "Write `queryEntities<T>(items: T[], predicates: ((item: T) => boolean)[]): T[]` returning items satisfying all predicates.",
    eLanguage: "typescript",
    eStarter: lines("function queryEntities<T>(items: T[], predicates: ((item: T) => boolean)[]): T[] {", "  // Filter by all predicates", "  return [];", "}"),
    eHint: "Use items.filter(item => predicates.every(p => p(item))).",
    eTest: lines(
      "if (typeof queryEntities !== 'function') throw new Error('queryEntities not found');",
      "const jobs = [",
      "  { id: 1, title: 'Frontend Engineer', location: 'Remote', active: true },",
      "  { id: 2, title: 'Backend Engineer', location: 'Remote', active: false },",
      "  { id: 3, title: 'DevOps', location: 'Onsite', active: true }",
      "];",
      "const res = queryEntities(jobs, [j => j.location === 'Remote', j => j.active === true]);",
      "if (res.length !== 1 || res[0].id !== 1) throw new Error('Predicate conjunction failed');",
      "const empty = queryEntities(jobs, [() => false]);",
      "if (empty.length !== 0) throw new Error('False predicate failed');"
    ),
    aTitle: "Set Audit Timestamps on Entity Record",
    aDesc: "Write `touchTimestamp<T extends Record<string, unknown>>(record: T, nowIso?: string): T & { createdAt: string; updatedAt: string }`.",
    aLanguage: "typescript",
    aStarter: lines("function touchTimestamp<T extends Record<string, unknown>>(record: T, nowIso?: string): T & { createdAt: string; updatedAt: string } {", "  // Touch createdAt and updatedAt", "  return null as any;", "}"),
    aHint: "Use existing createdAt if present as string, otherwise nowIso. Always set updatedAt to nowIso.",
    aTest: lines(
      "if (typeof touchTimestamp !== 'function') throw new Error('touchTimestamp not found');",
      "const t1 = touchTimestamp({ name: 'Task 1' }, '2026-01-01T00:00:00.000Z');",
      "if (t1.createdAt !== '2026-01-01T00:00:00.000Z' || t1.updatedAt !== '2026-01-01T00:00:00.000Z') throw new Error('New record timestamps failed');",
      "const t2 = touchTimestamp({ name: 'Task 1', createdAt: '2025-01-01T00:00:00.000Z' }, '2026-02-02T00:00:00.000Z');",
      "if (t2.createdAt !== '2025-01-01T00:00:00.000Z' || t2.updatedAt !== '2026-02-02T00:00:00.000Z') throw new Error('Existing createdAt was overwritten');"
    )
  },

  // ── DAY 23: Transactions & Unit of Work Concepts ──────────────────────────
  {
    ...NODE_WEB_DAYS[22],
    eTitle: "Simulate Atomic Unit of Work",
    eDesc: "Write `executeUnitOfWork<T>(operations: (() => T)[], rollback: () => void): { success: boolean; results: T[]; error?: string }`.",
    eLanguage: "typescript",
    eStarter: lines("function executeUnitOfWork<T>(operations: (() => T)[], rollback: () => void): { success: boolean; results: T[]; error?: string } {", "  // Execute atomic unit of work", "  return { success: false, results: [] };", "}"),
    eHint: "Iterate operations pushing results. On error, invoke rollback() and return { success: false, results: [], error: err.message }.",
    eTest: lines(
      "if (typeof executeUnitOfWork !== 'function') throw new Error('executeUnitOfWork not found');",
      "let rolledBack = false;",
      "const ok = executeUnitOfWork([() => 10, () => 20], () => { rolledBack = true; });",
      "if (!ok.success || ok.results.length !== 2 || ok.results[1] !== 20 || rolledBack) throw new Error('Successful operations failed');",
      "const failed = executeUnitOfWork([() => 10, () => { throw new Error('DB error'); }], () => { rolledBack = true; });",
      "if (failed.success || failed.results.length !== 0 || !rolledBack || failed.error !== 'DB error') throw new Error('Failed rollback logic');"
    ),
    aTitle: "Apply Balanced Account Transfers",
    aDesc: "Write `applyAccountTransfer(accounts: Record<string, number>, fromId: string, toId: string, amount: number): Record<string, number>`.",
    aLanguage: "typescript",
    aStarter: lines("function applyAccountTransfer(accounts: Record<string, number>, fromId: string, toId: string, amount: number): Record<string, number> {", "  // Transfer balance between accounts", "  return {};", "}"),
    aHint: "Check amount > 0 and sufficient balance in fromId. Return copy with updated balances.",
    aTest: lines(
      "if (typeof applyAccountTransfer !== 'function') throw new Error('applyAccountTransfer not found');",
      "const initial = { acc1: 100, acc2: 50 };",
      "const res = applyAccountTransfer(initial, 'acc1', 'acc2', 30);",
      "if (res.acc1 !== 70 || res.acc2 !== 80) throw new Error('Transfer failed');",
      "if (initial.acc1 !== 100) throw new Error('Original accounts mutated');",
      "let threw = false; try { applyAccountTransfer(initial, 'acc1', 'acc2', 200); } catch { threw = true; }",
      "if (!threw) throw new Error('Insufficient funds should throw');"
    )
  },

  // ── DAY 24: In-Memory Caching & TTL Expiration ────────────────────────────
  {
    ...NODE_WEB_DAYS[23],
    eTitle: "Create In-Memory TTL Cache",
    eDesc: "Write `createTtlCache<V>(defaultTtlMs: number)` providing set, get, and has with timestamp expiration.",
    eLanguage: "typescript",
    eStarter: lines("function createTtlCache<V>(defaultTtlMs: number) {", "  // In-memory cache with TTL", "  return {} as any;", "}"),
    eHint: "Map key -> { value, expiresAt }. get and has check now > expiresAt.",
    eTest: lines(
      "if (typeof createTtlCache !== 'function') throw new Error('createTtlCache not found');",
      "const now = Date.now();",
      "const cache = createTtlCache(1000);",
      "cache.set('k1', 'val1');",
      "if (cache.get('k1', now + 500) !== 'val1' || !cache.has('k1', now + 500)) throw new Error('Cache hit failed');",
      "if (cache.get('k1', now + 1500) !== null || cache.has('k1', now + 1500)) throw new Error('Cache expiry failed');",
      "cache.set('k2', 'val2', 5000);",
      "if (cache.get('k2', now + 2000) !== 'val2') throw new Error('Custom TTL failed');"
    ),
    aTitle: "Cache-Aside Function Memoization",
    aDesc: "Write `memoizeWithTtl<T>(fn: (arg: string) => Promise<T>, ttlMs: number): (arg: string, now?: number) => Promise<T>`.",
    aLanguage: "typescript",
    aStarter: lines("function memoizeWithTtl<T>(fn: (arg: string) => Promise<T>, ttlMs: number): (arg: string, now?: number) => Promise<T> {", "  // Cache-aside async wrapper", "  return async () => null as any;", "}"),
    aHint: "Cache results by argument with expiry timestamp now + ttlMs.",
    aTest: lines(
      "if (typeof memoizeWithTtl !== 'function') throw new Error('memoizeWithTtl not found');",
      "let calls = 0;",
      "const getter = async (id) => { calls++; return 'user-' + id; };",
      "const cached = memoizeWithTtl(getter, 1000);",
      "const u1 = await cached('10', 0);",
      "const u2 = await cached('10', 500);",
      "if (u1 !== 'user-10' || u2 !== 'user-10' || calls !== 1) throw new Error('Memoization hit failed');",
      "const u3 = await cached('10', 1500);",
      "if (u3 !== 'user-10' || calls !== 2) throw new Error('TTL expiration re-fetch failed');"
    )
  },

  // ── DAY 25: Idempotency Keys & Safe Retries ───────────────────────────────
  {
    ...NODE_WEB_DAYS[24],
    eTitle: "Handle Request with Idempotency Key",
    eDesc: "Write `handleIdempotentRequest<T>(key: string | undefined, handler: () => T, store: Map<string, T>): { executed: boolean; data: T }`.",
    eLanguage: "typescript",
    eStarter: lines("function handleIdempotentRequest<T>(key: string | undefined, handler: () => T, store: Map<string, T>): { executed: boolean; data: T } {", "  // Handle idempotency key caching", "  return { executed: false, data: null as any };", "}"),
    eHint: "If key undefined execute handler. If store has key return cached data. Otherwise execute handler, store result, return executed: true.",
    eTest: lines(
      "if (typeof handleIdempotentRequest !== 'function') throw new Error('handleIdempotentRequest not found');",
      "const store = new Map();",
      "let count = 0;",
      "const op = () => ({ orderId: ++count });",
      "const r1 = handleIdempotentRequest('req-1', op, store);",
      "if (!r1.executed || r1.data.orderId !== 1) throw new Error('First execution failed');",
      "const r2 = handleIdempotentRequest('req-1', op, store);",
      "if (r2.executed || r2.data.orderId !== 1 || count !== 1) throw new Error('Idempotent replay failed');",
      "const r3 = handleIdempotentRequest(undefined, op, store);",
      "if (!r3.executed || r3.data.orderId !== 2) throw new Error('Unkeyed execution failed');"
    ),
    aTitle: "Calculate Exponential Backoff Delays",
    aDesc: "Write `calculateBackoff(attempt: number, baseDelayMs?: number, maxDelayMs?: number): number` returning exponential backoff capped at maxDelayMs.",
    aLanguage: "typescript",
    aStarter: lines("function calculateBackoff(attempt: number, baseDelayMs: number = 100, maxDelayMs: number = 5000): number {", "  // Calculate exponential backoff", "  return 0;", "}"),
    aHint: "Return Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt)).",
    aTest: lines(
      "if (typeof calculateBackoff !== 'function') throw new Error('calculateBackoff not found');",
      "if (calculateBackoff(0, 100, 5000) !== 100) throw new Error('Attempt 0 should be 100');",
      "if (calculateBackoff(1, 100, 5000) !== 200) throw new Error('Attempt 1 should be 200');",
      "if (calculateBackoff(3, 100, 5000) !== 800) throw new Error('Attempt 3 should be 800');",
      "if (calculateBackoff(10, 100, 5000) !== 5000) throw new Error('Cap at maxDelayMs failed');"
    )
  },

  // ── DAY 26: Automated Testing & Contracts ─────────────────────────────────
  {
    ...NODE_WEB_DAYS[25],
    eTitle: "Verify API Response Schema Contract",
    eDesc: "Write `assertResponseContract(res: { status: number; body: any }, expectedStatus: number, requiredKeys: string[]): { valid: boolean; errors: string[] }`.",
    eLanguage: "typescript",
    eStarter: lines("function assertResponseContract(res: { status: number; body: any }, expectedStatus: number, requiredKeys: string[]): { valid: boolean; errors: string[] } {", "  // Assert response contract", "  return { valid: false, errors: [] };", "}"),
    eHint: "Check status matches and body contains each key in requiredKeys.",
    eTest: lines(
      "if (typeof assertResponseContract !== 'function') throw new Error('assertResponseContract not found');",
      "const r1 = assertResponseContract({ status: 200, body: { id: 1, title: 'Engineer' } }, 200, ['id', 'title']);",
      "if (!r1.valid || r1.errors.length !== 0) throw new Error('Valid contract failed');",
      "const r2 = assertResponseContract({ status: 500, body: {} }, 200, ['id']);",
      "if (r2.valid || r2.errors.length !== 2) throw new Error('Should report status mismatch and missing key');"
    ),
    aTitle: "Simulate Route Dispatcher",
    aDesc: "Write `simulateRoute(req: { method: string; path: string }, routes: Record<string, (req: any) => { status: number; body: any }>): { status: number; body: any }`.",
    aLanguage: "typescript",
    aStarter: lines("function simulateRoute(req: { method: string; path: string }, routes: Record<string, (req: any) => { status: number; body: any }>): { status: number; body: any } {", "  // Dispatch mock route", "  return { status: 404, body: null };", "}"),
    aHint: "Look up `METHOD PATH` in routes. Return 404 with error body if not found.",
    aTest: lines(
      "if (typeof simulateRoute !== 'function') throw new Error('simulateRoute not found');",
      "const routes = { 'GET /health': () => ({ status: 200, body: { status: 'ok' } }), 'POST /jobs': () => ({ status: 201, body: { created: true } }) };",
      "const r1 = simulateRoute({ method: 'GET', path: '/health' }, routes);",
      "if (r1.status !== 200 || r1.body.status !== 'ok') throw new Error('GET /health failed');",
      "const r2 = simulateRoute({ method: 'POST', path: '/jobs' }, routes);",
      "if (r2.status !== 201 || !r2.body.created) throw new Error('POST /jobs failed');",
      "const r3 = simulateRoute({ method: 'GET', path: '/unknown' }, routes);",
      "if (r3.status !== 404 || r3.body.error !== 'Route not found') throw new Error('404 route failed');"
    )
  },

  // ── DAY 27: OpenAPI Specification & Documentation ─────────────────────────
  {
    ...NODE_WEB_DAYS[26],
    eTitle: "Construct OpenAPI 3.0 Path Item",
    eDesc: "Write `buildOpenApiPath(method: string, summary: string, operationId: string, responseStatus?: number, responseDescription?: string): Record<string, unknown>`.",
    eLanguage: "typescript",
    eStarter: lines("function buildOpenApiPath(method: string, summary: string, operationId: string, responseStatus: number = 200, responseDescription: string = 'Successful response'): Record<string, unknown> {", "  // Build OpenAPI 3.0 path object", "  return {};", "}"),
    eHint: "Return object keyed by lowercased method containing summary, operationId, and responses object.",
    eTest: lines(
      "if (typeof buildOpenApiPath !== 'function') throw new Error('buildOpenApiPath not found');",
      "const p1 = buildOpenApiPath('GET', 'List all jobs', 'listJobs');",
      "if (!p1.get || p1.get.summary !== 'List all jobs' || p1.get.operationId !== 'listJobs' || !p1.get.responses['200']) throw new Error('Failed GET listJobs');",
      "const p2 = buildOpenApiPath('POST', 'Create job', 'createJob', 201, 'Created');",
      "if (!p2.post || p2.post.responses['201'].description !== 'Created') throw new Error('Failed POST createJob');"
    ),
    aTitle: "Generate OpenAPI Schema Object",
    aDesc: "Write `buildSchemaObject(type: 'string' | 'number' | 'boolean' | 'object', description: string, optional?: boolean): Record<string, unknown>`.",
    aLanguage: "typescript",
    aStarter: lines("function buildSchemaObject(type: 'string' | 'number' | 'boolean' | 'object', description: string, optional: boolean = false): Record<string, unknown> {", "  // Build OpenAPI property schema", "  return {};", "}"),
    aHint: "Return { type, description, nullable: optional }.",
    aTest: lines(
      "if (typeof buildSchemaObject !== 'function') throw new Error('buildSchemaObject not found');",
      "const s1 = buildSchemaObject('string', 'User email address');",
      "if (s1.type !== 'string' || s1.description !== 'User email address' || s1.nullable !== false) throw new Error('Non-optional string failed');",
      "const s2 = buildSchemaObject('number', 'User age', true);",
      "if (s2.type !== 'number' || s2.nullable !== true) throw new Error('Optional number failed');"
    )
  },

  // ── DAY 28: Asynchronous Task Queues & Workers ────────────────────────────
  {
    ...NODE_WEB_DAYS[27],
    eTitle: "In-Memory FIFO Job Queue",
    eDesc: "Write `createSimpleQueue<T>()` providing enqueue, dequeue, and size methods in FIFO order.",
    eLanguage: "typescript",
    eStarter: lines("function createSimpleQueue<T>() {", "  // In-memory FIFO queue", "  return {} as any;", "}"),
    eHint: "Array queue: enqueue pushes item, dequeue shifts item or returns null, size returns array length.",
    eTest: lines(
      "if (typeof createSimpleQueue !== 'function') throw new Error('createSimpleQueue not found');",
      "const q = createSimpleQueue();",
      "if (q.size() !== 0 || q.dequeue() !== null) throw new Error('Empty queue failed');",
      "q.enqueue('job1');",
      "q.enqueue('job2');",
      "if (q.size() !== 2) throw new Error('Queue size failed');",
      "if (q.dequeue() !== 'job1' || q.dequeue() !== 'job2' || q.size() !== 0) throw new Error('FIFO order failed');"
    ),
    aTitle: "Process Job with Max Retry Limit",
    aDesc: "Write `processJobWithRetries<T>(job: () => Promise<T>, maxRetries?: number): Promise<{ ok: boolean; result?: T; attempts: number }>`.",
    aLanguage: "typescript",
    aStarter: lines("async function processJobWithRetries<T>(job: () => Promise<T>, maxRetries: number = 3): Promise<{ ok: boolean; result?: T; attempts: number }> {", "  // Retry job runner", "  return { ok: false, attempts: 0 };", "}"),
    aHint: "Loop up to maxRetries attempts. Return ok: true and result on success; ok: false on exhaustion.",
    aTest: lines(
      "if (typeof processJobWithRetries !== 'function') throw new Error('processJobWithRetries not found');",
      "let failCount = 2;",
      "const flaky = async () => { if (failCount-- > 0) throw new Error('blip'); return 'success'; };",
      "const r1 = await processJobWithRetries(flaky, 3);",
      "if (!r1.ok || r1.result !== 'success' || r1.attempts !== 3) throw new Error('Flaky job retry failed');",
      "const alwaysFail = async () => { throw new Error('fatal'); };",
      "const r2 = await processJobWithRetries(alwaysFail, 2);",
      "if (r2.ok || r2.attempts !== 3) throw new Error('Exceeded max retries should return ok: false');"
    )
  },

  // ── DAY 29: Health Checks & Readiness Probes ──────────────────────────────
  {
    ...NODE_WEB_DAYS[28],
    eTitle: "Aggregate Health Check Indicators",
    eDesc: "Write `evaluateHealthStatus(services: Record<string, boolean>): { status: 'healthy' | 'unhealthy'; checks: Record<string, 'UP' | 'DOWN'>; totalDown: number }`.",
    eLanguage: "typescript",
    eStarter: lines("function evaluateHealthStatus(services: Record<string, boolean>): { status: 'healthy' | 'unhealthy'; checks: Record<string, 'UP' | 'DOWN'>; totalDown: number } {", "  // Evaluate health checks", "  return { status: 'unhealthy', checks: {}, totalDown: 0 };", "}"),
    eHint: "Map each service to UP or DOWN. totalDown counts DOWN services. status is healthy when totalDown === 0.",
    eTest: lines(
      "if (typeof evaluateHealthStatus !== 'function') throw new Error('evaluateHealthStatus not found');",
      "const h1 = evaluateHealthStatus({ database: true, redis: true });",
      "if (h1.status !== 'healthy' || h1.checks.database !== 'UP' || h1.totalDown !== 0) throw new Error('Healthy state failed');",
      "const h2 = evaluateHealthStatus({ database: true, redis: false, paymentGateway: false });",
      "if (h2.status !== 'unhealthy' || h2.checks.redis !== 'DOWN' || h2.totalDown !== 2) throw new Error('Unhealthy state failed');"
    ),
    aTitle: "Graceful Shutdown Cleanup Hooks",
    aDesc: "Write `createShutdownManager()` providing register and shutdown methods executing cleanups in LIFO order.",
    aLanguage: "typescript",
    aStarter: lines("function createShutdownManager() {", "  // Graceful shutdown manager", "  return {} as any;", "}"),
    aHint: "Array of cleanups. shutdown pops from end (LIFO) and awaits each cleanup callback.",
    aTest: lines(
      "if (typeof createShutdownManager !== 'function') throw new Error('createShutdownManager not found');",
      "const sm = createShutdownManager();",
      "const calls = [];",
      "sm.register(async () => { calls.push('first-reg'); });",
      "sm.register(async () => { calls.push('second-reg'); });",
      "const count = await sm.shutdown();",
      "if (count !== 2 || calls.join(',') !== 'second-reg,first-reg') throw new Error('LIFO shutdown order failed: ' + calls.join(','));",
      "const emptyCount = await sm.shutdown();",
      "if (emptyCount !== 0) throw new Error('Second shutdown should be 0');"
    )
  },

  // ── DAY 30: Capstone: Production Node.js & TypeScript API Engine ───────────
  {
    ...NODE_WEB_DAYS[29],
    eTitle: "Unified REST API Engine Dispatcher",
    eDesc: "Write `createApiEngine()` providing use(middleware), register(method, path, handler), and handle(req) execution.",
    eLanguage: "typescript",
    eStarter: lines("function createApiEngine() {", "  // Unified API Engine", "  return {} as any;", "}"),
    eHint: "Array of middlewares executed via recursive dispatch, then dispatching to route handler or returning 404.",
    eTest: lines(
      "if (typeof createApiEngine !== 'function') throw new Error('createApiEngine not found');",
      "const app = createApiEngine();",
      "app.use(async (req, next) => { req.headers = req.headers || {}; req.headers['x-custom'] = 'added'; return await next(); });",
      "app.register('GET', '/api/ping', async (req) => ({ status: 200, body: { msg: 'pong', custom: req.headers['x-custom'] } }));",
      "const res = await app.handle({ method: 'GET', path: '/api/ping' });",
      "if (res.status !== 200 || res.body.msg !== 'pong' || res.body.custom !== 'added') throw new Error('Engine execution failed: ' + JSON.stringify(res));",
      "const notFound = await app.handle({ method: 'POST', path: '/unknown' });",
      "if (notFound.status !== 404) throw new Error('Unknown route should be 404');"
    ),
    aTitle: "Format Service Operational Metrics",
    aDesc: "Write `formatServiceMetrics(metrics: { requests: number; errors: number; totalDurationMs: number }): { requests: number; errorRate: string; avgDurationMs: number }`.",
    aLanguage: "typescript",
    aStarter: lines("function formatServiceMetrics(metrics: { requests: number; errors: number; totalDurationMs: number }): { requests: number; errorRate: string; avgDurationMs: number } {", "  // Compute operational metrics", "  return { requests: 0, errorRate: '0.00%', avgDurationMs: 0 };", "}"),
    aHint: "Calculate avgDurationMs = Math.round((totalDurationMs / requests) * 100) / 100, errorRate = ((errors / requests) * 100).toFixed(2) + '%'. If requests === 0 return zeroes.",
    aTest: lines(
      "if (typeof formatServiceMetrics !== 'function') throw new Error('formatServiceMetrics not found');",
      "const m1 = formatServiceMetrics({ requests: 200, errors: 5, totalDurationMs: 5000 });",
      "if (m1.requests !== 200 || m1.errorRate !== '2.50%' || m1.avgDurationMs !== 25) throw new Error('Failed m1: ' + JSON.stringify(m1));",
      "const m2 = formatServiceMetrics({ requests: 0, errors: 0, totalDurationMs: 0 });",
      "if (m2.requests !== 0 || m2.errorRate !== '0.00%' || m2.avgDurationMs !== 0) throw new Error('Failed 0 requests');",
      "const m3 = formatServiceMetrics({ requests: 1000, errors: 0, totalDurationMs: 12345 });",
      "if (m3.errorRate !== '0.00%' || m3.avgDurationMs !== 12.35) throw new Error('Failed m3 rounding');"
    )
  }

];

export const NODE_WEB_30_DAYS_QUESTS = NODE_WEB_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('node-web', i + 1, cfg)
);
