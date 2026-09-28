import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-recorded AI interviews (T22). The server keeps the interview record itself
 * (interview_live_sessions, written only with the service role): every question the interviewer
 * asked and every answer it received. Scoring uses that record, once, instead of a conversation
 * the browser sends at the end, and only a recorded interview earns XP or a signed result.
 */

export const LIVE_SESSION_TABLE = 'interview_live_sessions';
/** Longest answer or question stored (characters). */
export const MAX_TURN_CHARS = 4000;
/** Longest code submission stored (characters). */
export const MAX_CODE_CHARS = 8000;
/** Most turns one interview can hold. */
export const MAX_TURNS = 160;
/** An interview record older than this can no longer be continued or scored. */
export const LIVE_SESSION_TTL_MS = 3 * 60 * 60 * 1000;

export type LiveRole = 'user' | 'assistant';

export interface LiveTurn {
  role: LiveRole;
  content: string;
  stage?: string;
  at: string;
}

export interface LiveSession {
  id: string;
  user_id: string;
  topic: string;
  domain_stream: 'tech' | 'non_tech';
  status: 'active' | 'evaluated' | 'abandoned';
  transcript: LiveTurn[];
  evaluation: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  evaluated_at: string | null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isLiveSessionId = (v: unknown): v is string => typeof v === 'string' && UUID_RE.test(v);

export function clampTurn(role: LiveRole, content: unknown, stage?: string, maxChars: number = MAX_TURN_CHARS): LiveTurn | null {
  const text = typeof content === 'string' ? content.trim().slice(0, maxChars) : '';
  if (!text) return null;
  return { role, content: text, ...(stage ? { stage: String(stage).slice(0, 40) } : {}), at: new Date().toISOString() };
}

/** Starts a recorded interview. Null when the table is not available (the interview then runs as unrecorded practice). */
export async function startLiveSession(
  admin: SupabaseClient,
  userId: string,
  topic: string,
  domainStream: 'tech' | 'non_tech',
  opening?: string
): Promise<LiveSession | null> {
  const first = clampTurn('assistant', opening, 'round1_behavioral');
  const { data, error } = await admin
    .from(LIVE_SESSION_TABLE)
    .insert({
      user_id: userId,
      topic: topic.trim().slice(0, 300) || 'Software Engineering',
      domain_stream: domainStream,
      transcript: first ? [first] : [],
    })
    .select('*')
    .maybeSingle();
  if (error || !data) return null;
  return data as LiveSession;
}

export type LoadResult =
  | { ok: true; session: LiveSession }
  | { ok: false; error: 'NOT_FOUND' | 'NOT_ACTIVE' | 'EXPIRED' | 'UNAVAILABLE' };

/** The student's own recorded interview, still open for questions and scoring. */
export async function loadActiveLiveSession(admin: SupabaseClient, userId: string, id: unknown): Promise<LoadResult> {
  if (!isLiveSessionId(id)) return { ok: false, error: 'NOT_FOUND' };
  const { data, error } = await admin.from(LIVE_SESSION_TABLE).select('*').eq('id', id).eq('user_id', userId).maybeSingle();
  if (error) return { ok: false, error: 'UNAVAILABLE' };
  if (!data) return { ok: false, error: 'NOT_FOUND' };
  const session = data as LiveSession;
  if (session.status !== 'active') return { ok: false, error: 'NOT_ACTIVE' };
  if (Date.now() - new Date(session.created_at).getTime() > LIVE_SESSION_TTL_MS) return { ok: false, error: 'EXPIRED' };
  return { ok: true, session };
}

/** Appends turns (compare-and-swap on updated_at, so two requests cannot overwrite each other). */
export async function appendLiveTurns(admin: SupabaseClient, session: LiveSession, turns: Array<LiveTurn | null>): Promise<LiveSession | null> {
  const add = turns.filter((t): t is LiveTurn => Boolean(t));
  if (add.length === 0) return session;
  const transcript = [...(Array.isArray(session.transcript) ? session.transcript : []), ...add].slice(-MAX_TURNS);
  const { data, error } = await admin
    .from(LIVE_SESSION_TABLE)
    .update({ transcript, updated_at: new Date().toISOString() })
    .eq('id', session.id)
    .eq('status', 'active')
    .eq('updated_at', session.updated_at)
    .select('*')
    .maybeSingle();
  if (error || !data) return null;
  return data as LiveSession;
}

/** Marks the interview scored. False if it was already scored (an interview is scored once). */
export async function markLiveSessionEvaluated(admin: SupabaseClient, session: LiveSession, evaluation: Record<string, unknown>): Promise<boolean> {
  const { data, error } = await admin
    .from(LIVE_SESSION_TABLE)
    .update({ status: 'evaluated', evaluated_at: new Date().toISOString(), evaluation })
    .eq('id', session.id)
    .eq('status', 'active')
    .select('id')
    .maybeSingle();
  return !error && Boolean(data);
}

/** The student left the interview: it can no longer be continued or scored. */
export async function abandonLiveSession(admin: SupabaseClient, userId: string, id: unknown): Promise<void> {
  if (!isLiveSessionId(id)) return;
  await admin.from(LIVE_SESSION_TABLE).update({ status: 'abandoned' }).eq('id', id).eq('user_id', userId).eq('status', 'active');
}

/** The recorded conversation, in the shape the interviewer / evaluator models take. */
export function transcriptForModel(session: LiveSession): Array<{ role: LiveRole; content: string }> {
  return (Array.isArray(session.transcript) ? session.transcript : [])
    .filter((t) => t && (t.role === 'user' || t.role === 'assistant') && typeof t.content === 'string')
    .map((t) => ({ role: t.role, content: t.content }));
}

/** The student's code as recorded for the evaluator (the code itself, not a pass count from the page). */
export function codeSubmissionTurn(code: unknown, language: unknown, title: unknown, stage?: string): LiveTurn | null {
  const src = typeof code === 'string' ? code.trim() : '';
  if (!src) return null;
  const lang = typeof language === 'string' && /^[a-z+#]{1,12}$/i.test(language) ? language.toLowerCase() : 'code';
  const heading = typeof title === 'string' && title.trim() ? ` for "${title.trim().slice(0, 120)}"` : '';
  const fence = '```';
  const text = `[Code submission in ${lang}${heading}]\n${fence}${lang}\n${src.slice(0, MAX_CODE_CHARS)}\n${fence}`;
  return clampTurn('user', text, stage, MAX_CODE_CHARS + 200);
}

/** Text recorded when the interview moves to a new round (the page shows its own wording). */
export function stageMarker(stage: string): string {
  const labels: Record<string, string> = {
    round1_behavioral: 'Round 1: Behavioral',
    round2_coding: 'Round 2: Technical Assessment',
    round3_systems: 'Round 3: System / Workflow Design',
    round4_star: 'Round 4: Executive STAR Review',
  };
  return `[${labels[stage] || 'Next round'} begins]`;
}
