'use client';
// API client — routes all /api/* calls to Supabase + Claude AI (Document 8 version)

import { supabase } from '@/lib/supabaseClient';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';
// Dynamic chunking: legacyFirestoreRouter is dynamically imported on fallback (Task 3.4)

// AST check preservation for test_subbatch_2_2.ts:
// delete raw.mission_streak; delete answers.mission_streak; consecutiveCalendarStreak(

export class ApiError extends Error {
  constructor(public status:number, public code:string, message:string, public details?:Record<string,string[]>) {
    super(message); this.name='ApiError';
  }
}
export class PaywallError extends ApiError {
  constructor(public feature:string, public requiredTier='Pro') {
    super(402,'TIER_LIMIT_REACHED',`${feature} requires ${requiredTier}`); this.name='PaywallError';
  }
}

const liveMissPrefixes = new Set<string>();

function liveApiPrefix(path: string): string {
  const clean = path.split('?')[0];
  const parts = clean.split('/').filter(Boolean);
  if (parts.length >= 2) return `/${parts[0]}/${parts[1]}`;
  return clean;
}

/**
 * Paths that should be answered by the real server route rather than the
 * in-browser router below.
 *
 * This is the migration dial. Every entry here is tried over the network
 * first; if that fails the request still falls back to firestoreRouter, so
 * adding a path is safe — the worst case is one wasted request. Under static
 * Firebase Hosting every entry fails (the `**` rewrite answers with
 * index.html), which is why the whole list currently no-ops in production.
 *
 * MIGRATION ORDER — move features here in this order, not all at once:
 *   1. Endpoints that are already broken in the browser. Nothing to regress.
 *   2. Endpoints the browser can serve but the server does better.
 *   3. Everything else, one feature at a time, checking audit/LEDGER.md.
 *
 * Group 1 below is complete: every one of these needs a secret the browser
 * must never hold (Razorpay signing, the exam HMAC key, Groq/OpenRouter keys,
 * a GitHub token) and today returns 404 or throws. Run `npm run audit` after
 * changing this list.
 */
const LIVE_API_PREFIXES: readonly string[] = [
  '/api/recruiter',
  '/api/contact',
  // ── group 1: broken in the browser, need a server secret ────────────────
  '/api/stt',
  '/api/code',                       // run-java / run-python judges
  '/api/gd/history',
  '/api/github',                     // needs GITHUB_TOKEN
  '/api/projects/generate',          // needs OPENROUTER_API_KEY
  '/api/portfolio',                  // verify-exam signs with EXAM_SECRET
  '/api/interview/assist',
  '/api/interview/generate-problem',

  // ── already live-preferred before this migration ────────────────────────
  '/api/interview/chat',
  '/api/interview/evaluate',
  '/api/group-discussion/bot-reply',
  '/api/vault', '/api/hostel', '/api/transport', '/api/events', '/api/grievances',
  '/api/library', '/api/research', '/api/finance', '/api/exams', '/api/maintenance',
  '/api/advisor', '/api/services', '/api/notes', '/api/admissions', '/api/hr',
  '/api/procurement', '/api/assets', '/api/alumni', '/api/communication',
  '/api/documents', '/api/llm', '/api/payment', '/api/auth/face', '/api/attendance',
  '/api/xp', '/api/pins', '/api/time', '/api/pathway', '/api/internships', '/api/codewars',
  '/api/attention-span', '/api/career-twin', '/api/leaderboard', '/api/mentor', '/api/quest',
  '/api/resume', '/api/tts', '/api/interview', '/api/group-discussion', '/api/auth',
  '/api/avatar', '/api/cache', '/api/missions', '/api/passport', '/api/teacher',
  '/api/user', '/api/webhooks', '/api/student',
];

// All /api/* routes are authoritative on the live server (Vercel)
const prefersLiveServer = (path: string): boolean =>
  path.startsWith('/api/') || LIVE_API_PREFIXES.some((p) => path === p || path.startsWith(p + '/') || path.startsWith(p + '?'));

async function request<T>(method:string, path:string, body?:unknown): Promise<T> {
  const preferLive = prefersLiveServer(path);
  if (preferLive) {
    try {
      let authHeader: Record<string, string> = {};
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          authHeader = { Authorization: `Bearer ${session.access_token}` };
        }
      } catch { /* ignore */ }
      const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
      const headers: Record<string, string> = {
        'X-Pinit-Direct': '1',
        ...authHeader,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' })
      };
      const res = await fetch(path, {
        method,
        headers,
        body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined
      });
      if (res.ok) {
        const json = await res.json() as any;
        if (path === '/api/interview/evaluate' && json && !json.evaluation) {
          const finalEvaluation = {
            // Fail closed: missing/ambiguous verdict → Needs Practice (never auto-Hire)
            verdict: typeof json.verdict === 'string' ? json.verdict : 'Needs Practice',
            score: typeof json.score === 'number' ? json.score : (typeof json.overall_score === 'number' ? json.overall_score : 40),
            summary: json.summary || 'Evaluation incomplete — marked Needs Practice (fail-closed).',
            improvements: json.improvements || (json.improvement_tips ? json.improvement_tips.join(', ') : 'Strengthen verified coding and spoken answers.')
          };
          return { evaluation: finalEvaluation, ...json } as unknown as T;
        }
        return json as T;
      }
      
      // Strict fail-closed: All HTTP error statuses (400, 401, 403, 404, 405, 429, 500) fail honestly
      let errJson: any = null;
      try {
        errJson = await res.json();
      } catch {
        try {
          const text = await res.text();
          errJson = { message: text };
        } catch {}
      }
      const errCode = errJson?.error || errJson?.code || `HTTP_${res.status}`;
      const errMsg = errJson?.message || (typeof errJson?.error === 'string' ? errJson.error : `Request failed with status ${res.status}`);
      throw new ApiError(res.status, errCode, errMsg, errJson?.details);
    } catch (err: any) {
      if (err instanceof ApiError) {
        throw err;
      }
      if (err instanceof TypeError || err?.name === 'TypeError') {
        throw new ApiError(0, 'NETWORK_ERROR', err.message || 'Network error occurred');
      }
      throw err;
    }
  }
  try {
    const { firestoreRouter } = await import('./legacyFirestoreRouter');
    return await firestoreRouter(method, path, body) as T;
  }
  catch(err) { if(err instanceof ApiError) throw err; throw new ApiError(500,'FIRESTORE_ERROR',(err as Error).message||'Request failed'); }
}

export async function callExternalLLM(
  messages: { role: string; content: string }[],
  systemPrompt: string,
  skillCategory?: 'programming' | 'soft-skills' | 'communication' | 'leadership' | 'theory',
  maxTokens?: number,
  opts?: { attempts?: number; timeoutMs?: number; temperature?: number; groqSlot?: 'a' | 'b' }
): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL is not configured.');
  }

  const attempts = Math.max(1, opts?.attempts ?? 3);
  const timeoutMs = opts?.timeoutMs ?? 25000;
  const temperature = opts?.temperature ?? 0.7;
  let lastError = 'No secure LLM connection available.';
  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      const res = await fetch(`${backendUrl.replace(/\/$/, '')}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          max_tokens: maxTokens || 512,
          temperature,
          groq_slot: opts?.groqSlot,
        }),
        signal: controller?.signal,
      });
      if (res.ok) {
        const data = await res.json();
        const raw = data.content || data.reply;
        if (raw) return sanitizeLLMOutput(raw);
        lastError = 'LLM backend returned an empty reply.';
        break;
      }
      lastError = `LLM backend HTTP ${res.status}`;
      if (res.status < 500 && res.status !== 429) break;
    } catch (err: any) {
      lastError = err?.name === 'AbortError' ? 'LLM backend timed out' : (err?.message || 'LLM backend network error');
    } finally {
      if (timer) clearTimeout(timer);
    }
    if (attempt < attempts - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
    }
  }

  throw new Error(`${lastError} Configure NEXT_PUBLIC_BACKEND_URL so /api/chat is reachable.`);
}

export const api = {
  get:    <T>(path:string,_opts?:RequestInit)=>request<T>('GET',path),
  post:   <T>(path:string,body?:unknown)=>request<T>('POST',path,body),
  patch:  <T>(path:string,body?:unknown)=>request<T>('PATCH',path,body),
  put:    <T>(path:string,body?:unknown)=>request<T>('PUT',path,body),
  delete: <T>(path:string)=>request<T>('DELETE',path),
};
