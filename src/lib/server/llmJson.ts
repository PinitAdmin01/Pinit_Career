import type { ZodSchema } from 'zod';

export const DEFAULT_LLM_MODEL = 'qwen/qwen-2.5-coder-32b-instruct';
export const FALLBACK_GROQ_MODEL = 'llama-3.3-70b-versatile';

export type LlmJsonTransportFn = (opts: {
  system: string;
  user: string;
  maxTokens: number;
  model: string;
}) => Promise<string>;

let testTransport: LlmJsonTransportFn | null = null;

/**
 * Injects a fake transport function for tests (or passes null to reset).
 */
export function setLlmJsonTransportForTests(fn: LlmJsonTransportFn | null): void {
  testTransport = fn;
}

/**
 * Extracts the first outermost JSON object substring from raw text.
 * Finds the first `{` and the last `}`.
 */
export function extractJsonObjectSubstring(raw: string): string | null {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    return null;
  }
  return raw.slice(start, end + 1);
}

interface GroqChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface OpenRouterChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

async function callOpenRouter(
  system: string,
  user: string,
  maxTokens: number,
  model: string,
  apiKey: string,
  signal: AbortSignal
): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://pinit-careers.web.app',
      'X-Title': 'Pi Career OS',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: maxTokens,
      temperature: 0.2,
    }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`OpenRouter HTTP ${res.status}: ${res.statusText}`);
  }

  const data = (await res.json()) as OpenRouterChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('OpenRouter returned empty choices/content');
  }
  return content;
}

async function callGroq(
  system: string,
  user: string,
  maxTokens: number,
  keys: string[],
  signal: AbortSignal
): Promise<string> {
  let lastError = new Error('No Groq API keys available');
  for (const key of keys) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: FALLBACK_GROQ_MODEL,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
          max_tokens: maxTokens,
          temperature: 0.2,
        }),
        signal,
      });

      if (!res.ok) {
        throw new Error(`Groq HTTP ${res.status}: ${res.statusText}`);
      }

      const data = (await res.json()) as GroqChatCompletionResponse;
      const content = data.choices?.[0]?.message?.content;
      if (typeof content !== 'string') {
        throw new Error('Groq returned empty choices/content');
      }
      return content;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastError;
}

/**
 * Server-only helper to ask an AI provider for structured JSON, validated with a Zod schema.
 * Never logs API keys and never calls /api/llm over HTTP.
 */
export async function askForJson<T>(opts: {
  system: string;
  user: string;
  schema: ZodSchema<T>;
  maxTokens: number;
  model?: string;
}): Promise<{ ok: true; data: T; model: string } | { ok: false; reason: string }> {
  const chosenModel = opts.model || DEFAULT_LLM_MODEL;

  let rawReply = '';
  let usedModel = chosenModel;

  if (testTransport) {
    try {
      rawReply = await testTransport({
        system: opts.system,
        user: opts.user,
        maxTokens: opts.maxTokens,
        model: chosenModel,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, reason: `TEST_TRANSPORT_ERROR: ${msg}` };
    }
  } else {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    const groqKeys = groqKeysStr
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }

    try {
      if (openRouterKey) {
        try {
          rawReply = await callOpenRouter(
            opts.system,
            opts.user,
            opts.maxTokens,
            chosenModel,
            openRouterKey,
            controller.signal
          );
          usedModel = chosenModel;
        } catch (orErr) {
          if (groqKeys.length > 0) {
            rawReply = await callGroq(
              opts.system,
              opts.user,
              opts.maxTokens,
              groqKeys,
              controller.signal
            );
            usedModel = FALLBACK_GROQ_MODEL;
          } else {
            throw orErr;
          }
        }
      } else if (groqKeys.length > 0) {
        rawReply = await callGroq(
          opts.system,
          opts.user,
          opts.maxTokens,
          groqKeys,
          controller.signal
        );
        usedModel = FALLBACK_GROQ_MODEL;
      } else {
        return { ok: false, reason: 'NO_LLM_KEYS_CONFIGURED' };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, reason: `LLM_CALL_FAILED: ${msg}` };
    } finally {
      clearTimeout(timeout);
    }
  }

  const jsonSubstring = extractJsonObjectSubstring(rawReply);
  if (!jsonSubstring) {
    return { ok: false, reason: 'NO_JSON_OBJECT_FOUND' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonSubstring);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: `JSON_PARSE_FAILED: ${msg}` };
  }

  const validation = opts.schema.safeParse(parsed);
  if (!validation.success) {
    return { ok: false, reason: `SCHEMA_VALIDATION_FAILED: ${validation.error.message}` };
  }

  return { ok: true, data: validation.data, model: usedModel };
}
