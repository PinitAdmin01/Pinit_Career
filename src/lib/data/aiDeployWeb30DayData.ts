import { DayConfig, buildEnrichedDayQuests } from './curriculumEnricher';
import { AI_DEPLOY_DAYS } from './aiDeployWebDays';

const lines = (...l: string[]) => l.join('\n');

export const AI_DEPLOY_WEB_30_DAYS_CONFIGS: DayConfig[] = [
  // ── DAY 1 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[0],
    eTitle: "Calculate Exponential Backoff Delay with Jitter",
    eDesc: "Write `calculateBackoffDelay(attempt: number, baseDelayMs: number, maxDelayMs: number, jitterRatio: number = 0.5): number` returning the clamped delay `Math.min(maxDelayMs, Math.round(baseDelayMs * Math.pow(2, attempt) * (1 + jitterRatio)))`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateBackoffDelay(attempt: number, baseDelayMs: number, maxDelayMs: number, jitterRatio: number = 0.5): number {",
      "  // Compute jittered backoff delay",
      "  return 0;",
      "}"
    ),
    eHint: "Compute baseDelayMs * (2 ** attempt) * (1 + jitterRatio), round it, and clamp to maxDelayMs.",
    eTest: lines(
      "if (typeof calculateBackoffDelay !== 'function') throw new Error('calculateBackoffDelay not found');",
      "const d0 = calculateBackoffDelay(0, 100, 5000, 0);",
      "if (d0 !== 100) throw new Error('Attempt 0 failed: ' + d0);",
      "const d1 = calculateBackoffDelay(1, 100, 5000, 0.5);",
      "if (d1 !== 300) throw new Error('Attempt 1 with jitter 0.5 failed: ' + d1);",
      "const d2 = calculateBackoffDelay(2, 100, 5000, 0.2);",
      "if (d2 !== 480) throw new Error('Attempt 2 with jitter 0.2 failed: ' + d2);",
      "const dMax = calculateBackoffDelay(10, 100, 1000, 0.5);",
      "if (dMax !== 1000) throw new Error('Max clamp failed: ' + dMax);"
    ),
    aTitle: "Classify HTTP Status Code for Model Retry Logic",
    aDesc: "Write `classifyModelApiStatus(statusCode: number, retryAfterHeader?: number): { retryable: boolean; delayMs: number; errorType: 'RATE_LIMIT' | 'SERVER_OVERLOAD' | 'CLIENT_ERROR' | 'FATAL' | 'SUCCESS' }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function classifyModelApiStatus(statusCode: number, retryAfterHeader?: number): { retryable: boolean; delayMs: number; errorType: 'RATE_LIMIT' | 'SERVER_OVERLOAD' | 'CLIENT_ERROR' | 'FATAL' | 'SUCCESS' } {",
      "  // Classify API status",
      "  return { retryable: false, delayMs: 0, errorType: 'FATAL' };",
      "}"
    ),
    aHint: "200 is SUCCESS (delay 0, retryable false). 429 is RATE_LIMIT (retryable true, delay retryAfterHeader * 1000 or 1000). 503 is SERVER_OVERLOAD (retryable true, delay 2000). 400-499 is CLIENT_ERROR (not retryable). Others FATAL.",
    aTest: lines(
      "if (typeof classifyModelApiStatus !== 'function') throw new Error('classifyModelApiStatus not found');",
      "const r200 = classifyModelApiStatus(200);",
      "if (!r200 || r200.retryable || r200.errorType !== 'SUCCESS' || r200.delayMs !== 0) throw new Error('200 failed: ' + JSON.stringify(r200));",
      "const r429 = classifyModelApiStatus(429, 3);",
      "if (!r429 || !r429.retryable || r429.errorType !== 'RATE_LIMIT' || r429.delayMs !== 3000) throw new Error('429 failed: ' + JSON.stringify(r429));",
      "const r503 = classifyModelApiStatus(503);",
      "if (!r503 || !r503.retryable || r503.errorType !== 'SERVER_OVERLOAD' || r503.delayMs !== 2000) throw new Error('503 failed: ' + JSON.stringify(r503));",
      "const r401 = classifyModelApiStatus(401);",
      "if (!r401 || r401.retryable || r401.errorType !== 'CLIENT_ERROR') throw new Error('401 failed: ' + JSON.stringify(r401));"
    )
  },
  // ── DAY 2 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[1],
    eTitle: "Validate Model Completion Response with Type Guard",
    eDesc: "Write `validateCompletionResponse(payload: any): { valid: boolean; text?: string; totalTokens?: number; error?: string }` validating payload matches `{ id: string, choices: [{ message: { content: string }, finish_reason: string }], usage?: { total_tokens: number } }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function validateCompletionResponse(payload: any): { valid: boolean; text?: string; totalTokens?: number; error?: string } {",
      "  // Validate completion response",
      "  return { valid: false, error: 'Not implemented' };",
      "}"
    ),
    eHint: "Check payload object, id string, choices array with message.content string and finish_reason string.",
    eTest: lines(
      "if (typeof validateCompletionResponse !== 'function') throw new Error('validateCompletionResponse not found');",
      "const valid = { id: 'c-1', choices: [{ message: { content: 'Hello world' }, finish_reason: 'stop' }], usage: { total_tokens: 15 } };",
      "const r1 = validateCompletionResponse(valid);",
      "if (!r1.valid || r1.text !== 'Hello world' || r1.totalTokens !== 15) throw new Error('Valid failed: ' + JSON.stringify(r1));",
      "const invalid1 = { id: 'c-2', choices: [] };",
      "const r2 = validateCompletionResponse(invalid1);",
      "if (r2.valid || !r2.error) throw new Error('Empty choices should fail: ' + JSON.stringify(r2));",
      "const invalid2 = null;",
      "if (validateCompletionResponse(invalid2).valid) throw new Error('Null should fail');"
    ),
    aTitle: "Extract JSON from Delimited Markdown Code Fence",
    aDesc: "Write `extractJsonFromMarkdownFence(rawResponse: string): { parsed: Record<string, any> | null; success: boolean; error?: string }` extracting and parsing JSON from ```json ... ``` or raw JSON string.",
    aLanguage: "typescript",
    aStarter: lines(
      "function extractJsonFromMarkdownFence(rawResponse: string): { parsed: Record<string, any> | null; success: boolean; error?: string } {",
      "  // Extract JSON from markdown fence",
      "  return { parsed: null, success: false };",
      "}"
    ),
    aHint: "Look for ```json ... ``` or ``` ... ``` code fence, extract text between fences, fallback to trimmed raw text, and JSON.parse.",
    aTest: lines(
      "if (typeof extractJsonFromMarkdownFence !== 'function') throw new Error('extractJsonFromMarkdownFence not found');",
      "const fenced = 'Here is your output:\\n```json\\n{\"name\":\"Alice\",\"age\":30}\\n```\\nHope this helps!';",
      "const r1 = extractJsonFromMarkdownFence(fenced);",
      "if (!r1.success || !r1.parsed || r1.parsed.name !== 'Alice') throw new Error('Fenced failed: ' + JSON.stringify(r1));",
      "const raw = '{\"score\":95}';",
      "const r2 = extractJsonFromMarkdownFence(raw);",
      "if (!r2.success || !r2.parsed || r2.parsed.score !== 95) throw new Error('Raw json failed: ' + JSON.stringify(r2));",
      "const bad = 'Not json at all';",
      "const r3 = extractJsonFromMarkdownFence(bad);",
      "if (r3.success || r3.parsed !== null) throw new Error('Bad json should fail');"
    )
  },
  // ── DAY 3 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[2],
    eTitle: "Estimate Text Token Count Using Subword Heuristics",
    eDesc: "Write `estimateTokenCount(text: string, avgCharsPerToken: number = 4.0): { tokenEstimate: number; characterCount: number; wordCount: number }` where tokenEstimate = Math.ceil(text.length / avgCharsPerToken).",
    eLanguage: "typescript",
    eStarter: lines(
      "function estimateTokenCount(text: string, avgCharsPerToken: number = 4.0): { tokenEstimate: number; characterCount: number; wordCount: number } {",
      "  // Estimate token counts",
      "  return { tokenEstimate: 0, characterCount: 0, wordCount: 0 };",
      "}"
    ),
    eHint: "characterCount is text.length, words are split by whitespace, tokenEstimate is Math.ceil(text.length / avgCharsPerToken).",
    eTest: lines(
      "if (typeof estimateTokenCount !== 'function') throw new Error('estimateTokenCount not found');",
      "const r1 = estimateTokenCount('Hello world!', 4.0);",
      "if (r1.characterCount !== 12 || r1.wordCount !== 2 || r1.tokenEstimate !== 3) throw new Error('Test 1 failed: ' + JSON.stringify(r1));",
      "const r2 = estimateTokenCount('', 4.0);",
      "if (r2.characterCount !== 0 || r2.wordCount !== 0 || r2.tokenEstimate !== 0) throw new Error('Empty test failed: ' + JSON.stringify(r2));"
    ),
    aTitle: "Allocate Context Window Slices to Prevent Overflow",
    aDesc: "Write `allocateContextBudget(contextWindowSize: number, systemPromptTokens: number, historyTokens: number, maxOutputTokens: number): { availableForUser: number; willFit: boolean; totalReserved: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function allocateContextBudget(contextWindowSize: number, systemPromptTokens: number, historyTokens: number, maxOutputTokens: number): { availableForUser: number; willFit: boolean; totalReserved: number } {",
      "  // Allocate context budget",
      "  return { availableForUser: 0, willFit: false, totalReserved: 0 };",
      "}"
    ),
    aHint: "totalReserved = systemPromptTokens + historyTokens + maxOutputTokens; availableForUser = Math.max(0, contextWindowSize - totalReserved); willFit = contextWindowSize >= totalReserved.",
    aTest: lines(
      "if (typeof allocateContextBudget !== 'function') throw new Error('allocateContextBudget not found');",
      "const r1 = allocateContextBudget(8192, 500, 2000, 1000);",
      "if (r1.totalReserved !== 3500 || r1.availableForUser !== 4692 || !r1.willFit) throw new Error('Test 1 failed: ' + JSON.stringify(r1));",
      "const r2 = allocateContextBudget(4096, 2000, 2000, 1000);",
      "if (r2.totalReserved !== 5000 || r2.availableForUser !== 0 || r2.willFit) throw new Error('Overflow failed: ' + JSON.stringify(r2));"
    )
  },
  // ── DAY 4 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[3],
    eTitle: "Calculate Multi-Tier Inference Query Cost",
    eDesc: "Write `calculateInferenceCost(modelTier: 'small' | 'medium' | 'frontier', promptTokens: number, completionTokens: number): { promptCost: number; completionCost: number; totalCost: number }` using prices per million tokens: small ($0.15 prompt, $0.60 completion), medium ($0.50 prompt, $1.50 completion), frontier ($5.00 prompt, $15.00 completion), rounded to 6 decimal places.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateInferenceCost(modelTier: 'small' | 'medium' | 'frontier', promptTokens: number, completionTokens: number): { promptCost: number; completionCost: number; totalCost: number } {",
      "  // Calculate inference cost",
      "  return { promptCost: 0, completionCost: 0, totalCost: 0 };",
      "}"
    ),
    eHint: "Multiply promptTokens by (promptRate / 1e6) and completionTokens by (compRate / 1e6), round to 6 decimal places.",
    eTest: lines(
      "if (typeof calculateInferenceCost !== 'function') throw new Error('calculateInferenceCost not found');",
      "const r1 = calculateInferenceCost('small', 1000, 500);",
      "if (r1.promptCost !== 0.00015 || r1.completionCost !== 0.0003 || r1.totalCost !== 0.00045) throw new Error('Small tier failed: ' + JSON.stringify(r1));",
      "const r2 = calculateInferenceCost('frontier', 2000, 1000);",
      "if (r2.promptCost !== 0.01 || r2.completionCost !== 0.015 || r2.totalCost !== 0.025) throw new Error('Frontier failed: ' + JSON.stringify(r2));"
    ),
    aTitle: "Evaluate Monthly AI Spend Against Hard Budget Cap",
    aDesc: "Write `auditMonthlyAiSpend(currentSpend: number, projectedDailySpend: number, remainingDaysInMonth: number, hardCap: number): { projectedTotal: number; willExceed: boolean; budgetRemaining: number; burnRateRatio: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function auditMonthlyAiSpend(currentSpend: number, projectedDailySpend: number, remainingDaysInMonth: number, hardCap: number): { projectedTotal: number; willExceed: boolean; budgetRemaining: number; burnRateRatio: number } {",
      "  // Audit monthly spend",
      "  return { projectedTotal: 0, willExceed: false, budgetRemaining: 0, burnRateRatio: 0 };",
      "}"
    ),
    aHint: "projectedTotal = currentSpend + projectedDailySpend * remainingDaysInMonth; budgetRemaining = Math.max(0, hardCap - currentSpend); burnRateRatio = projectedTotal / hardCap.",
    aTest: lines(
      "if (typeof auditMonthlyAiSpend !== 'function') throw new Error('auditMonthlyAiSpend not found');",
      "const a1 = auditMonthlyAiSpend(250, 10, 20, 500);",
      "if (a1.projectedTotal !== 450 || a1.willExceed || a1.budgetRemaining !== 250 || a1.burnRateRatio !== 0.9) throw new Error('Under budget failed: ' + JSON.stringify(a1));",
      "const a2 = auditMonthlyAiSpend(400, 20, 10, 500);",
      "if (a2.projectedTotal !== 600 || !a2.willExceed || a2.budgetRemaining !== 100 || a2.burnRateRatio !== 1.2) throw new Error('Over budget failed: ' + JSON.stringify(a2));"
    )
  },
  // ── DAY 5 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[4],
    eTitle: "Interpolate Mustache Prompt Template with Validation",
    eDesc: "Write `interpolatePromptTemplate(template: string, variables: Record<string, string>): { prompt: string; missingVariables: string[]; replacedCount: number }` replacing `{{varName}}` and identifying missing variables.",
    eLanguage: "typescript",
    eStarter: lines(
      "function interpolatePromptTemplate(template: string, variables: Record<string, string>): { prompt: string; missingVariables: string[]; replacedCount: number } {",
      "  // Interpolate prompt template",
      "  return { prompt: '', missingVariables: [], replacedCount: 0 };",
      "}"
    ),
    eHint: "Use regex /\\{\\{\\s*([a-zA-Z0-9_]+)\\s*\\}\\}/g, check if key is in variables, replace or collect missing.",
    eTest: lines(
      "if (typeof interpolatePromptTemplate !== 'function') throw new Error('interpolatePromptTemplate not found');",
      "const t = 'Hello {{name}}, welcome to {{city}}! You are user {{id}}.';",
      "const r1 = interpolatePromptTemplate(t, { name: 'Bob', city: 'Seattle' });",
      "if (r1.missingVariables.length !== 1 || r1.missingVariables[0] !== 'id' || r1.replacedCount !== 2) throw new Error('Failed partial: ' + JSON.stringify(r1));",
      "const r2 = interpolatePromptTemplate(t, { name: 'Bob', city: 'Seattle', id: '42' });",
      "if (r2.missingVariables.length !== 0 || r2.prompt !== 'Hello Bob, welcome to Seattle! You are user 42.') throw new Error('Failed full: ' + JSON.stringify(r2));"
    ),
    aTitle: "Sanitize Prompt Variable Inputs Against Boundary Escapes",
    aDesc: "Write `sanitizePromptVariables(input: string, forbiddenDelimiters: string[] = ['```', '###', '---', '<|im_end|>']): { sanitized: string; escapedCount: number; hasViolations: boolean }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function sanitizePromptVariables(input: string, forbiddenDelimiters: string[] = ['```', '###', '---', '<|im_end|>']): { sanitized: string; escapedCount: number; hasViolations: boolean } {",
      "  // Sanitize prompt variables",
      "  return { sanitized: input, escapedCount: 0, hasViolations: false };",
      "}"
    ),
    aHint: "Search and replace each forbidden delimiter with a harmless replacement (e.g. escaping with backslashes or replacing with spaces) and track count.",
    aTest: lines(
      "if (typeof sanitizePromptVariables !== 'function') throw new Error('sanitizePromptVariables not found');",
      "const dirty = 'Here is code: ``` rm -rf / ``` and ### System override <|im_end|>';",
      "const r1 = sanitizePromptVariables(dirty);",
      "if (!r1.hasViolations || r1.escapedCount !== 4) throw new Error('Failed sanitization: ' + JSON.stringify(r1));",
      "const clean = 'Just standard user text.';",
      "const r2 = sanitizePromptVariables(clean);",
      "if (r2.hasViolations || r2.escapedCount !== 0) throw new Error('Clean text flagged incorrectly');"
    )
  },
  // ── DAY 6 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[5],
    eTitle: "Parse Server-Sent Events (SSE) Delta Chunks",
    eDesc: "Write `parseSseLine(line: string): { isDone: boolean; content: string | null; id?: string }` parsing SSE protocol `data: ...`, handling `data: [DONE]`, and extracting JSON choices[0].delta.content.",
    eLanguage: "typescript",
    eStarter: lines(
      "function parseSseLine(line: string): { isDone: boolean; content: string | null; id?: string } {",
      "  // Parse SSE line",
      "  return { isDone: false, content: null };",
      "}"
    ),
    eHint: "Check line prefix 'data: '. If 'data: [DONE]', return isDone true. Otherwise parse JSON and extract choices[0].delta.content.",
    eTest: lines(
      "if (typeof parseSseLine !== 'function') throw new Error('parseSseLine not found');",
      "const l1 = 'data: {\"id\":\"chat-1\",\"choices\":[{\"delta\":{\"content\":\"Hello \"}}]}';",
      "const r1 = parseSseLine(l1);",
      "if (r1.isDone || r1.content !== 'Hello ' || r1.id !== 'chat-1') throw new Error('Delta parse failed: ' + JSON.stringify(r1));",
      "const l2 = 'data: [DONE]';",
      "const r2 = parseSseLine(l2);",
      "if (!r2.isDone || r2.content !== null) throw new Error('Done parse failed: ' + JSON.stringify(r2));",
      "const l3 = ': keepalive comment';",
      "if (parseSseLine(l3).content !== null) throw new Error('Comment should have null content');"
    ),
    aTitle: "Measure Time-to-First-Token (TTFT) and Generation Speed",
    aDesc: "Write `computeStreamingMetrics(requestStartMs: number, firstTokenMs: number, finishMs: number, totalTokens: number): { ttftMs: number; totalDurationMs: number; tokensPerSecond: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function computeStreamingMetrics(requestStartMs: number, firstTokenMs: number, finishMs: number, totalTokens: number): { ttftMs: number; totalDurationMs: number; tokensPerSecond: number } {",
      "  // Compute streaming metrics",
      "  return { ttftMs: 0, totalDurationMs: 0, tokensPerSecond: 0 };",
      "}"
    ),
    aHint: "ttftMs = firstTokenMs - requestStartMs; totalDurationMs = finishMs - requestStartMs; tokensPerSecond = Math.round((totalTokens / (totalDurationMs / 1000)) * 100) / 100.",
    aTest: lines(
      "if (typeof computeStreamingMetrics !== 'function') throw new Error('computeStreamingMetrics not found');",
      "const m = computeStreamingMetrics(1000, 1250, 3000, 100);",
      "if (m.ttftMs !== 250 || m.totalDurationMs !== 2000 || m.tokensPerSecond !== 50) throw new Error('Metrics failed: ' + JSON.stringify(m));",
      "const m2 = computeStreamingMetrics(2000, 2100, 4000, 80);",
      "if (m2.ttftMs !== 100 || m2.totalDurationMs !== 2000 || m2.tokensPerSecond !== 40) throw new Error('Metrics 2 failed: ' + JSON.stringify(m2));"
    )
  },
  // ── DAY 7 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[6],
    eTitle: "Micro-Batch Invocations Queue Accumulator",
    eDesc: "Write class `MicroBatchQueue<T>` with constructor `(maxBatchSize: number, maxLingerMs: number)` and method `enqueue(item: T, timestampMs: number): { shouldFlush: boolean; batch: T[] | null }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "class MicroBatchQueue<T> {",
      "  constructor(public maxBatchSize: number, public maxLingerMs: number) {}",
      "  enqueue(item: T, timestampMs: number): { shouldFlush: boolean; batch: T[] | null } {",
      "    return { shouldFlush: false, batch: null };",
      "  }",
      "}"
    ),
    eHint: "Track queue and firstItemTimestamp. Flush when queue length reaches maxBatchSize or duration exceeds maxLingerMs.",
    eTest: lines(
      "if (typeof MicroBatchQueue !== 'function') throw new Error('MicroBatchQueue not found');",
      "const q = new MicroBatchQueue(3, 50);",
      "const r1 = q.enqueue('req-1', 1000);",
      "if (r1.shouldFlush || r1.batch !== null) throw new Error('First item flushed prematurely');",
      "const r2 = q.enqueue('req-2', 1020);",
      "if (r2.shouldFlush) throw new Error('Second item flushed prematurely');",
      "const r3 = q.enqueue('req-3', 1030);",
      "if (!r3.shouldFlush || !r3.batch || r3.batch.length !== 3) throw new Error('Size trigger failed: ' + JSON.stringify(r3));",
      "const r4 = q.enqueue('req-4', 1100);",
      "const r5 = q.enqueue('req-5', 1160); // 60ms linger elapsed!",
      "if (!r5.shouldFlush || !r5.batch || r5.batch.length !== 2) throw new Error('Time trigger failed: ' + JSON.stringify(r5));"
    ),
    aTitle: "Calculate Batch Efficiency and Request Reduction",
    aDesc: "Write `calculateBatchEfficiency(totalIndividualRequests: number, batchCount: number): { apiCallReductionPercent: number; avgBatchSize: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateBatchEfficiency(totalIndividualRequests: number, batchCount: number): { apiCallReductionPercent: number; avgBatchSize: number } {",
      "  // Compute batch efficiency",
      "  return { apiCallReductionPercent: 0, avgBatchSize: 0 };",
      "}"
    ),
    aHint: "apiCallReductionPercent = Math.round((1 - batchCount / totalIndividualRequests) * 100 * 100) / 100; avgBatchSize = totalIndividualRequests / batchCount.",
    aTest: lines(
      "if (typeof calculateBatchEfficiency !== 'function') throw new Error('calculateBatchEfficiency not found');",
      "const b1 = calculateBatchEfficiency(100, 10);",
      "if (b1.apiCallReductionPercent !== 90 || b1.avgBatchSize !== 10) throw new Error('Batch 100/10 failed: ' + JSON.stringify(b1));",
      "const b2 = calculateBatchEfficiency(50, 50);",
      "if (b2.apiCallReductionPercent !== 0 || b2.avgBatchSize !== 1) throw new Error('No batch reduction failed: ' + JSON.stringify(b2));"
    )
  },
  // ── DAY 8 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[7],
    eTitle: "Calculate Vector Dot Product and Euclidean Norm",
    eDesc: "Write `vectorNormAndDotProduct(vecA: number[], vecB: number[]): { dotProduct: number; normA: number; normB: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function vectorNormAndDotProduct(vecA: number[], vecB: number[]): { dotProduct: number; normA: number; normB: number } {",
      "  // Compute dot product and norms",
      "  return { dotProduct: 0, normA: 0, normB: 0 };",
      "}"
    ),
    eHint: "Compute dot product sum(a[i]*b[i]), normA = Math.sqrt(sum(a[i]^2)), normB = Math.sqrt(sum(b[i]^2)), round to 4 decimals.",
    eTest: lines(
      "if (typeof vectorNormAndDotProduct !== 'function') throw new Error('vectorNormAndDotProduct not found');",
      "const r = vectorNormAndDotProduct([1, 2, 3], [4, 5, 6]);",
      "if (r.dotProduct !== 32 || r.normA !== 3.7417 || r.normB !== 8.775) throw new Error('Vector math failed: ' + JSON.stringify(r));",
      "const r2 = vectorNormAndDotProduct([1, 0], [0, 1]);",
      "if (r2.dotProduct !== 0 || r2.normA !== 1 || r2.normB !== 1) throw new Error('Orthogonal vector math failed: ' + JSON.stringify(r2));"
    ),
    aTitle: "Compute Normalized Cosine Similarity Distance",
    aDesc: "Write `computeCosineSimilarity(vecA: number[], vecB: number[]): number` returning cosine similarity in [-1, 1] rounded to 4 decimal places (returns 0 if either vector has norm 0 or dimensions mismatch).",
    aLanguage: "typescript",
    aStarter: lines(
      "function computeCosineSimilarity(vecA: number[], vecB: number[]): number {",
      "  // Compute cosine similarity",
      "  return 0;",
      "}"
    ),
    aHint: "cosine = dotProduct / (normA * normB). Round to 4 decimal places.",
    aTest: lines(
      "if (typeof computeCosineSimilarity !== 'function') throw new Error('computeCosineSimilarity not found');",
      "const same = computeCosineSimilarity([1, 0, 0], [1, 0, 0]);",
      "if (same !== 1.0) throw new Error('Identity failed: ' + same);",
      "const ortho = computeCosineSimilarity([1, 0], [0, 1]);",
      "if (ortho !== 0.0) throw new Error('Orthogonal failed: ' + ortho);",
      "const sim = computeCosineSimilarity([1, 2, 3], [4, 5, 6]);",
      "if (sim !== 0.9746) throw new Error('Cosine calc failed: ' + sim);"
    )
  },
  // ── DAY 9 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[8],
    eTitle: "Semantic Vector Cache Lookup with Similarity Threshold",
    eDesc: "Write class `SemanticVectorCache` with methods `set(key: string, embedding: number[], response: string): void` and `findClosest(queryEmbedding: number[], minSimilarity: number): { hit: boolean; key?: string; response?: string; similarity?: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "class SemanticVectorCache {",
      "  set(key: string, embedding: number[], response: string): void {}",
      "  findClosest(queryEmbedding: number[], minSimilarity: number): { hit: boolean; key?: string; response?: string; similarity?: number } {",
      "    return { hit: false };",
      "  }",
      "}"
    ),
    eHint: "Iterate cached items, compute cosine similarity, find highest similarity, and return hit true if highest >= minSimilarity.",
    eTest: lines(
      "if (typeof SemanticVectorCache !== 'function') throw new Error('SemanticVectorCache not found');",
      "const cache = new SemanticVectorCache();",
      "cache.set('refund policy', [1, 0, 0], 'Refunds allowed within 30 days.');",
      "cache.set('shipping fees', [0, 1, 0], 'Standard shipping is $5.');",
      "const q1 = cache.findClosest([0.95, 0.05, 0], 0.9);",
      "if (!q1.hit || q1.key !== 'refund policy' || !q1.response || !q1.similarity || q1.similarity < 0.9) throw new Error('Close query failed: ' + JSON.stringify(q1));",
      "const q2 = cache.findClosest([0, 0, 1], 0.9);",
      "if (q2.hit) throw new Error('Distant query should not hit');"
    ),
    aTitle: "Evaluate Semantic Cache Hit Rate and Token Savings",
    aDesc: "Write `auditSemanticCachePerformance(totalQueries: number, cacheHits: number, avgTokensPerQuery: number, costPerThousandTokens: number): { hitRatePercent: number; tokensSaved: number; costSaved: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function auditSemanticCachePerformance(totalQueries: number, cacheHits: number, avgTokensPerQuery: number, costPerThousandTokens: number): { hitRatePercent: number; tokensSaved: number; costSaved: number } {",
      "  // Audit cache performance",
      "  return { hitRatePercent: 0, tokensSaved: 0, costSaved: 0 };",
      "}"
    ),
    aHint: "hitRatePercent = (cacheHits / totalQueries) * 100; tokensSaved = cacheHits * avgTokensPerQuery; costSaved = (tokensSaved / 1000) * costPerThousandTokens.",
    aTest: lines(
      "if (typeof auditSemanticCachePerformance !== 'function') throw new Error('auditSemanticCachePerformance not found');",
      "const a = auditSemanticCachePerformance(1000, 350, 400, 0.002);",
      "if (a.hitRatePercent !== 35 || a.tokensSaved !== 140000 || a.costSaved !== 0.28) throw new Error('Cache audit failed: ' + JSON.stringify(a));",
      "const a2 = auditSemanticCachePerformance(500, 0, 400, 0.002);",
      "if (a2.hitRatePercent !== 0 || a2.tokensSaved !== 0 || a2.costSaved !== 0) throw new Error('Zero hit cache audit failed: ' + JSON.stringify(a2));"
    )
  },
  // ── DAY 10 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[9],
    eTitle: "Token Bucket Rate Limiter with Continuous Refill",
    eDesc: "Write class `TokenBucketRateLimiter` with constructor `(maxCapacity: number, refillRatePerSec: number)` and method `tryConsume(tokens: number, nowMs: number): { allowed: boolean; remainingTokens: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "class TokenBucketRateLimiter {",
      "  constructor(public maxCapacity: number, public refillRatePerSec: number) {}",
      "  tryConsume(tokens: number, nowMs: number): { allowed: boolean; remainingTokens: number } {",
      "    return { allowed: false, remainingTokens: 0 };",
      "  }",
      "}"
    ),
    eHint: "Track tokens and lastRefillMs. Add (nowMs - lastRefillMs)/1000 * refillRatePerSec capped at maxCapacity. If tokens >= requested, deduct and allow.",
    eTest: lines(
      "if (typeof TokenBucketRateLimiter !== 'function') throw new Error('TokenBucketRateLimiter not found');",
      "const limiter = new TokenBucketRateLimiter(10, 2); // 10 max tokens, 2 tokens/sec",
      "const c1 = limiter.tryConsume(6, 1000);",
      "if (!c1.allowed || c1.remainingTokens !== 4) throw new Error('First consume failed: ' + JSON.stringify(c1));",
      "const c2 = limiter.tryConsume(5, 1000); // Only 4 remaining",
      "if (c2.allowed) throw new Error('Over-consume should be denied');",
      "const c3 = limiter.tryConsume(3, 2000); // 1 sec later -> refilled 2 tokens (4 + 2 = 6) -> consume 3 -> 3 remaining",
      "if (!c3.allowed || c3.remainingTokens !== 3) throw new Error('Refill consume failed: ' + JSON.stringify(c3));"
    ),
    aTitle: "Sliding Window Log Rate Limiter per User",
    aDesc: "Write class `SlidingWindowUserLimiter` with constructor `(windowMs: number, maxRequests: number)` and method `recordRequest(userId: string, timestampMs: number): { allowed: boolean; currentCount: number; resetInMs: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "class SlidingWindowUserLimiter {",
      "  constructor(public windowMs: number, public maxRequests: number) {}",
      "  recordRequest(userId: string, timestampMs: number): { allowed: boolean; currentCount: number; resetInMs: number } {",
      "    return { allowed: false, currentCount: 0, resetInMs: 0 };",
      "  }",
      "}"
    ),
    aHint: "Maintain map of timestamps per user. Filter out timestamps older than timestampMs - windowMs. If length < maxRequests, append and allow.",
    aTest: lines(
      "if (typeof SlidingWindowUserLimiter !== 'function') throw new Error('SlidingWindowUserLimiter not found');",
      "const limiter = new SlidingWindowUserLimiter(60000, 2); // max 2 requests per 60s",
      "const r1 = limiter.recordRequest('u1', 1000);",
      "if (!r1.allowed || r1.currentCount !== 1) throw new Error('Req 1 failed: ' + JSON.stringify(r1));",
      "const r2 = limiter.recordRequest('u1', 2000);",
      "if (!r2.allowed || r2.currentCount !== 2) throw new Error('Req 2 failed: ' + JSON.stringify(r2));",
      "const r3 = limiter.recordRequest('u1', 3000); // Limit exceeded!",
      "if (r3.allowed || r3.currentCount !== 2) throw new Error('Req 3 should be denied: ' + JSON.stringify(r3));",
      "const r4 = limiter.recordRequest('u1', 62000); // 61s after req 1, 60s after req 2 (both expired)",
      "if (!r4.allowed || r4.currentCount !== 1) throw new Error('Req 4 after expiry failed: ' + JSON.stringify(r4));"
    )
  },
  // ── DAY 11 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[10],
    eTitle: "Score Prompt Complexity for Tiered Model Routing",
    eDesc: "Write `scorePromptComplexity(prompt: string): { score: number; recommendedTier: 'small' | 'medium' | 'frontier'; reasons: string[] }` evaluating token length, code fences, reasoning keywords, and JSON requests.",
    eLanguage: "typescript",
    eStarter: lines(
      "function scorePromptComplexity(prompt: string): { score: number; recommendedTier: 'small' | 'medium' | 'frontier'; reasons: string[] } {",
      "  // Score prompt complexity",
      "  return { score: 0, recommendedTier: 'small', reasons: [] };",
      "}"
    ),
    eHint: "Add points: length > 500 (+20), length > 2000 (+30), contains '```' (+25), reasoning keywords like 'explain step by step' (+25). If score >= 60 frontier, >= 30 medium, else small.",
    eTest: lines(
      "if (typeof scorePromptComplexity !== 'function') throw new Error('scorePromptComplexity not found');",
      "const simple = scorePromptComplexity('What is the capital of France?');",
      "if (simple.recommendedTier !== 'small' || simple.score !== 0) throw new Error('Simple query failed: ' + JSON.stringify(simple));",
      "const code = scorePromptComplexity('Debug this function:\\n```typescript\\nconst x = 1;\\n```');",
      "if (code.recommendedTier !== 'small' && code.score < 25) throw new Error('Code score failed');",
      "const complex = scorePromptComplexity('Please explain step by step and prove the correctness of this algorithm:\\n```ts\\nfunction test() {}\\n```\\nEnsure output is strict json schema.');",
      "if (complex.recommendedTier !== 'frontier' || complex.score < 60) throw new Error('Complex query failed: ' + JSON.stringify(complex));"
    ),
    aTitle: "Calculate Cost Savings from Dynamic Model Routing",
    aDesc: "Write `calculateRoutingSavings(routingBreakdown: { small: number; medium: number; frontier: number }, avgTokens: number): { blendedCost: number; baselineFrontierCost: number; savingsPercent: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateRoutingSavings(routingBreakdown: { small: number; medium: number; frontier: number }, avgTokens: number): { blendedCost: number; baselineFrontierCost: number; savingsPercent: number } {",
      "  // Compute routing savings",
      "  return { blendedCost: 0, baselineFrontierCost: 0, savingsPercent: 0 };",
      "}"
    ),
    aHint: "Blended cost uses tier rates per 1k tokens: small 0.0005, medium 0.002, frontier 0.02. Baseline assumes all queries use frontier.",
    aTest: lines(
      "if (typeof calculateRoutingSavings !== 'function') throw new Error('calculateRoutingSavings not found');",
      "const r = calculateRoutingSavings({ small: 700, medium: 200, frontier: 100 }, 1000);",
      "if (r.blendedCost !== 2.75 || r.baselineFrontierCost !== 20 || r.savingsPercent !== 86.25) throw new Error('Routing savings failed: ' + JSON.stringify(r));",
      "const r2 = calculateRoutingSavings({ small: 0, medium: 0, frontier: 100 }, 1000);",
      "if (r2.blendedCost !== 2 || r2.baselineFrontierCost !== 2 || r2.savingsPercent !== 0) throw new Error('100% frontier savings failed: ' + JSON.stringify(r2));"
    )
  },
  // ── DAY 12 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[11],
    eTitle: "Execute Fallback Chain Across Redundant Providers",
    eDesc: "Write `resolveProviderFallback<T>(providers: { name: string; invoke: () => { ok: boolean; data?: T; error?: string } }[]): { resolvedProvider: string; result: T; fallbackAttempts: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function resolveProviderFallback<T>(providers: { name: string; invoke: () => { ok: boolean; data?: T; error?: string } }[]): { resolvedProvider: string; result: T; fallbackAttempts: number } {",
      "  // Resolve provider fallback",
      "  throw new Error('Not implemented');",
      "}"
    ),
    eHint: "Iterate providers, call invoke(), if ok return result with fallbackAttempts = failed attempts. If none succeed, throw error.",
    eTest: lines(
      "if (typeof resolveProviderFallback !== 'function') throw new Error('resolveProviderFallback not found');",
      "const providers = [",
      "  { name: 'PrimaryOpenAI', invoke: () => ({ ok: false, error: '503 Overloaded' }) },",
      "  { name: 'SecondaryAnthropic', invoke: () => ({ ok: true, data: 'Claude Response' }) },",
      "  { name: 'TertiaryLocal', invoke: () => ({ ok: true, data: 'Local Response' }) }",
      "];",
      "const r = resolveProviderFallback(providers);",
      "if (r.resolvedProvider !== 'SecondaryAnthropic' || r.result !== 'Claude Response' || r.fallbackAttempts !== 1) throw new Error('Fallback failed: ' + JSON.stringify(r));",
      "const p2 = [{ name: 'SingleProvider', invoke: () => ({ ok: true, data: 'Direct' }) }];",
      "const r2 = resolveProviderFallback(p2);",
      "if (r2.resolvedProvider !== 'SingleProvider' || r2.result !== 'Direct' || r2.fallbackAttempts !== 0) throw new Error('Single fallback failed: ' + JSON.stringify(r2));"
    ),
    aTitle: "Circuit Breaker State Machine for Upstream LLM Endpoint",
    aDesc: "Write class `ModelCircuitBreaker` with constructor `(failureThreshold: number, recoveryTimeoutMs: number)` and methods `recordFailure(nowMs: number): void`, `recordSuccess(): void`, and `getState(nowMs: number): 'CLOSED' | 'OPEN' | 'HALF_OPEN'`.",
    aLanguage: "typescript",
    aStarter: lines(
      "class ModelCircuitBreaker {",
      "  constructor(public failureThreshold: number, public recoveryTimeoutMs: number) {}",
      "  recordFailure(nowMs: number): void {}",
      "  recordSuccess(): void {}",
      "  getState(nowMs: number): 'CLOSED' | 'OPEN' | 'HALF_OPEN' { return 'CLOSED'; }",
      "}"
    ),
    aHint: "Track failureCount, state, and openedTimestamp. If failures >= threshold state becomes OPEN. If OPEN and nowMs - openedTimestamp >= recoveryTimeoutMs, return HALF_OPEN.",
    aTest: lines(
      "if (typeof ModelCircuitBreaker !== 'function') throw new Error('ModelCircuitBreaker not found');",
      "const cb = new ModelCircuitBreaker(2, 5000);",
      "if (cb.getState(1000) !== 'CLOSED') throw new Error('Should start CLOSED');",
      "cb.recordFailure(1000);",
      "if (cb.getState(1000) !== 'CLOSED') throw new Error('1 failure should remain CLOSED');",
      "cb.recordFailure(1050); // Threshold 2 reached!",
      "if (cb.getState(1100) !== 'OPEN') throw new Error('Should be OPEN after 2 failures');",
      "if (cb.getState(4000) !== 'OPEN') throw new Error('Should remain OPEN before recovery timeout');",
      "if (cb.getState(6100) !== 'HALF_OPEN') throw new Error('Should transition to HALF_OPEN after 5000ms');",
      "cb.recordSuccess();",
      "if (cb.getState(6200) !== 'CLOSED') throw new Error('Success in HALF_OPEN should reset to CLOSED');"
    )
  },
  // ── DAY 13 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[12],
    eTitle: "Calculate Inference Latency Percentiles (P50, P90, P99)",
    eDesc: "Write `calculateLatencyPercentiles(latenciesMs: number[]): { count: number; p50: number; p90: number; p99: number; max: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateLatencyPercentiles(latenciesMs: number[]): { count: number; p50: number; p90: number; p99: number; max: number } {",
      "  // Compute percentiles",
      "  return { count: 0, p50: 0, p90: 0, p99: 0, max: 0 };",
      "}"
    ),
    eHint: "Sort array ascending. For percentile p, index = Math.ceil((p / 100) * length) - 1, clamped to [0, length - 1].",
    eTest: lines(
      "if (typeof calculateLatencyPercentiles !== 'function') throw new Error('calculateLatencyPercentiles not found');",
      "const data = [100, 110, 120, 130, 140, 150, 160, 170, 180, 500];",
      "const p = calculateLatencyPercentiles(data);",
      "if (p.count !== 10 || p.p50 !== 140 || p.p90 !== 180 || p.p99 !== 500 || p.max !== 500) throw new Error('Percentiles failed: ' + JSON.stringify(p));",
      "const p2 = calculateLatencyPercentiles([50]);",
      "if (p2.count !== 1 || p2.p50 !== 50 || p2.p90 !== 50 || p2.p99 !== 50 || p2.max !== 50) throw new Error('Single element percentile failed: ' + JSON.stringify(p2));"
    ),
    aTitle: "Evaluate Latency SLA Budget Compliance",
    aDesc: "Write `evaluateLatencySla(latenciesMs: number[], p95ThresholdMs: number, p99ThresholdMs: number): { p95Actual: number; p99Actual: number; compliant: boolean; breachedPercentile: string | null }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function evaluateLatencySla(latenciesMs: number[], p95ThresholdMs: number, p99ThresholdMs: number): { p95Actual: number; p99Actual: number; compliant: boolean; breachedPercentile: string | null } {",
      "  // Evaluate SLA compliance",
      "  return { p95Actual: 0, p99Actual: 0, compliant: false, breachedPercentile: null };",
      "}"
    ),
    aHint: "Calculate actual P95 and P99. If p95Actual > p95ThresholdMs return breached 'P95', else if p99Actual > p99ThresholdMs return breached 'P99', else compliant true.",
    aTest: lines(
      "if (typeof evaluateLatencySla !== 'function') throw new Error('evaluateLatencySla not found');",
      "const good = [100, 150, 200, 250, 300, 350, 400, 450, 500, 600];",
      "const r1 = evaluateLatencySla(good, 700, 1000);",
      "if (!r1.compliant || r1.breachedPercentile !== null) throw new Error('Good SLA failed: ' + JSON.stringify(r1));",
      "const breachP95 = evaluateLatencySla(good, 400, 1000);",
      "if (breachP95.compliant || breachP95.breachedPercentile !== 'P95') throw new Error('Breach P95 failed: ' + JSON.stringify(breachP95));"
    )
  },
  // ── DAY 14 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[13],
    eTitle: "Calculate Model Parameter Memory Footprint Across Quantization",
    eDesc: "Write `calculateModelMemory(parameterCountBillions: number, quantBitWidth: 32 | 16 | 8 | 4): { weightMemoryGB: number; recommendedVramGB: number }` (recommended adds 20% activation overhead, rounded to 2 decimal places).",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculateModelMemory(parameterCountBillions: number, quantBitWidth: 32 | 16 | 8 | 4): { weightMemoryGB: number; recommendedVramGB: number } {",
      "  // Compute model memory",
      "  return { weightMemoryGB: 0, recommendedVramGB: 0 };",
      "}"
    ),
    eHint: "bytesPerParam = quantBitWidth / 8. Weight bytes = parameterCountBillions * 1e9 * bytesPerParam. Convert to GB (divide by 1024^3). recommended = weight * 1.2.",
    eTest: lines(
      "if (typeof calculateModelMemory !== 'function') throw new Error('calculateModelMemory not found');",
      "const m70b16 = calculateModelMemory(70, 16);",
      "if (m70b16.weightMemoryGB !== 130.39 || m70b16.recommendedVramGB !== 156.47) throw new Error('70B FP16 failed: ' + JSON.stringify(m70b16));",
      "const m8b4 = calculateModelMemory(8, 4);",
      "if (m8b4.weightMemoryGB !== 3.73 || m8b4.recommendedVramGB !== 4.48) throw new Error('8B INT4 failed: ' + JSON.stringify(m8b4));"
    ),
    aTitle: "Calculate KV-Cache Memory Growth Across Batch and Context",
    aDesc: "Write `calculateKvCacheMemory(batchSize: number, contextLength: number, numLayers: number, numHeads: number, headDim: number, precisionBytes: number = 2): { kvCacheBytes: number; kvCacheMB: number }` (formula: 2 * numLayers * 2 * numHeads * headDim * precisionBytes * batchSize * contextLength).",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateKvCacheMemory(batchSize: number, contextLength: number, numLayers: number, numHeads: number, headDim: number, precisionBytes: number = 2): { kvCacheBytes: number; kvCacheMB: number } {",
      "  // Compute KV cache memory",
      "  return { kvCacheBytes: 0, kvCacheMB: 0 };",
      "}"
    ),
    aHint: "kvCacheBytes = 2 (keys & values) * numLayers * 2 (K & V per layer) * numHeads * headDim * precisionBytes * batchSize * contextLength / 2 (or standard: 2 * numLayers * numHeads * headDim * precisionBytes * batchSize * contextLength * 2). MB = bytes / (1024 * 1024).",
    aTest: lines(
      "if (typeof calculateKvCacheMemory !== 'function') throw new Error('calculateKvCacheMemory not found');",
      "const kv = calculateKvCacheMemory(8, 2048, 32, 32, 128, 2);",
      "if (kv.kvCacheBytes !== 8589934592 || kv.kvCacheMB !== 8192) throw new Error('KV cache failed: ' + JSON.stringify(kv));",
      "const kv2 = calculateKvCacheMemory(1, 512, 16, 16, 64, 2);",
      "if (kv2.kvCacheBytes !== 33554432 || kv2.kvCacheMB !== 32) throw new Error('KV cache 2 failed: ' + JSON.stringify(kv2));"
    )
  },
  // ── DAY 15 ──────────────────────────────────────────────────────────
  {
    ...AI_DEPLOY_DAYS[14],
    eTitle: "Calculate Peak Aggregate Inference Throughput Demand",
    eDesc: "Write `calculatePeakThroughputDemand(concurrentUsers: number, queriesPerUserPerMinute: number, avgCompletionTokens: number): { queriesPerSec: number; tokensPerSec: number }`.",
    eLanguage: "typescript",
    eStarter: lines(
      "function calculatePeakThroughputDemand(concurrentUsers: number, queriesPerUserPerMinute: number, avgCompletionTokens: number): { queriesPerSec: number; tokensPerSec: number } {",
      "  // Compute peak demand",
      "  return { queriesPerSec: 0, tokensPerSec: 0 };",
      "}"
    ),
    eHint: "queriesPerSec = Math.round((concurrentUsers * queriesPerUserPerMinute / 60) * 100) / 100; tokensPerSec = Math.round(queriesPerSec * avgCompletionTokens * 100) / 100.",
    eTest: lines(
      "if (typeof calculatePeakThroughputDemand !== 'function') throw new Error('calculatePeakThroughputDemand not found');",
      "const d = calculatePeakThroughputDemand(600, 3, 200);",
      "if (d.queriesPerSec !== 30 || d.tokensPerSec !== 6000) throw new Error('Peak demand failed: ' + JSON.stringify(d));",
      "const d2 = calculatePeakThroughputDemand(120, 1, 50);",
      "if (d2.queriesPerSec !== 2 || d2.tokensPerSec !== 100) throw new Error('Peak demand 2 failed: ' + JSON.stringify(d2));"
    ),
    aTitle: "Size GPU Node Replica Count for Target Token Throughput",
    aDesc: "Write `calculateRequiredGpuReplicas(totalTokensPerSec: number, singleGpuTokensPerSec: number, targetUtilization: number = 0.75): { minimumReplicas: number; totalCapacityTokensPerSec: number; headroomPercent: number }`.",
    aLanguage: "typescript",
    aStarter: lines(
      "function calculateRequiredGpuReplicas(totalTokensPerSec: number, singleGpuTokensPerSec: number, targetUtilization: number = 0.75): { minimumReplicas: number; totalCapacityTokensPerSec: number; headroomPercent: number } {",
      "  // Size GPU replicas",
      "  return { minimumReplicas: 0, totalCapacityTokensPerSec: 0, headroomPercent: 0 };",
      "}"
    ),
    aHint: "effectiveGpuThroughput = singleGpuTokensPerSec * targetUtilization; minimumReplicas = Math.ceil(totalTokensPerSec / effectiveGpuThroughput). totalCapacity = minimumReplicas * singleGpuTokensPerSec. headroom = (totalCapacity - totalTokensPerSec)/totalCapacity * 100.",
    aTest: lines(
      "if (typeof calculateRequiredGpuReplicas !== 'function') throw new Error('calculateRequiredGpuReplicas not found');",
      "const rep = calculateRequiredGpuReplicas(5000, 1500, 0.75); // 1500 * 0.75 = 1125 -> ceil(5000 / 1125) = 5 replicas",
      "if (rep.minimumReplicas !== 5 || rep.totalCapacityTokensPerSec !== 7500 || rep.headroomPercent !== 33.33) throw new Error('GPU sizing failed: ' + JSON.stringify(rep));",
      "const rep2 = calculateRequiredGpuReplicas(1000, 1000, 1.0);",
      "if (rep2.minimumReplicas !== 1 || rep2.totalCapacityTokensPerSec !== 1000 || rep2.headroomPercent !== 0) throw new Error('GPU sizing 2 failed: ' + JSON.stringify(rep2));"
    )
  }
];

export const AI_DEPLOY_WEB_30_DAYS_QUESTS = AI_DEPLOY_WEB_30_DAYS_CONFIGS.flatMap((cfg, i) =>
  buildEnrichedDayQuests('aideploy-web', i + 1, cfg)
);
