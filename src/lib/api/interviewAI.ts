// lib/api/interviewAI.ts
// Interview AI — server-proxied LLM only. No browser API keys or CORS proxies.

const MODE_PROMPTS: Record<string, string> = {
  google: `You are a senior interviewer at a top-tier tech company (Google/Meta/Amazon level).
Your style: structured, curious, probing. Ask ONE question at a time.
Cover behavioral (STAR), system design concepts, and problem-solving approach.
Keep responses concise — 2-3 sentences max per turn.`,
  startup: `You are a fast-moving startup founder interviewing for a key role.
Style: direct, energetic, impatient with fluff. Ask about ownership, bias-to-action, and resilience.
One question per turn. Keep it punchy.`,
  hr: `You are a seasoned HR manager using the STAR method.
Focus on communication, cultural fit, self-awareness, and teamwork.
One behavioral question per turn, warm but professional tone.`,
  visa: `You are a formal visa officer conducting a structured interview.
Be precise, formal, and slightly skeptical. One question per turn.`,
  gd: `You are a group discussion moderator for a corporate panel interview.
Introduce a topic, then engage the candidate in a debate-style back-and-forth.`,
};

const PRESSURE_OVERLAYS: Record<string, string> = {
  normal:       '',
  aggressive:   `\n\nPRESSURE MODE - AGGRESSIVE: Be challenging and push back on weak answers immediately.`,
  fast:         `\n\nPRESSURE MODE - FAST-PACED: Ask rapid-fire follow-up questions, keep turns short.`,
  surprise:     `\n\nPRESSURE MODE - SURPRISE: Introduce unexpected angles and tricky questions.`,
  panel:        `\n\nPRESSURE MODE - PANEL: Occasionally speak as a second panelist with a different perspective.`,
  interruption: `\n\nPRESSURE MODE - INTERRUPTION: Occasionally interrupt mid-answer with a redirect.`,
};

function buildSystem(mode: string, pressureMode: string, domain?: string): string {
  const base    = MODE_PROMPTS[mode] || MODE_PROMPTS.hr;
  const overlay = PRESSURE_OVERLAYS[pressureMode] || '';
  const domainStr = domain ? `\n\nFOCUS DOMAIN: ${domain}` : '';
  return `${base}${overlay}${domainStr}

RULES: Ask exactly ONE question per response. Never give the answer. Keep under 120 words.`;
}

async function callServerLLM(
  messages: { role: 'user' | 'assistant'; content: string }[],
  system: string,
  maxTokens = 350
): Promise<string> {
  let authHeader: Record<string, string> = {};
  try {
    const { supabase } = await import('@/lib/supabaseClient');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      authHeader = { Authorization: `Bearer ${session.access_token}` };
    }
  } catch { /* ignore */ }

  const res = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({
      messages,
      systemPrompt: system,
      skillCategory: 'soft-skills',
      maxTokens,
    }),
  });
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(`Interview LLM unavailable (${res.status}). Server path /api/llm required. ${err}`);
  }
  const data = await res.json();
  const reply = (data.reply || data.content || data.text || '').trim();
  if (!reply) {
    throw new Error('Interview LLM returned an empty response from /api/llm.');
  }
  return reply;
}

export interface InterviewStartParams { mode: string; pressureMode?: string; domain?: string; persona?: string; }
export interface InterviewRespondParams { sessionId: string; response: string; mode: string; pressureMode?: string; transcript: { role: 'user'|'assistant'; content: string }[]; }

export async function aiInterviewStart(params: InterviewStartParams): Promise<string> {
  const system = buildSystem(params.mode, params.pressureMode || 'normal', params.domain);
  return callServerLLM(
    [{ role:'user', content:'Begin the interview. Introduce yourself in one sentence, then ask your first question.' }],
    system, 250
  );
}

export async function aiInterviewRespond(params: InterviewRespondParams): Promise<string> {
  const system = buildSystem(params.mode, params.pressureMode || 'normal');
  const messages = [...params.transcript, { role: 'user' as const, content: params.response }];
  return callServerLLM(messages, system, 350);
}

export async function aiInterviewEvaluate(
  transcript: { role: string; content: string }[],
  mode: string
): Promise<Record<string, unknown>> {
  const formatted = transcript
    .map(t => `${t.role === 'assistant' ? 'INTERVIEWER' : 'CANDIDATE'}: ${t.content}`)
    .join('\n\n');
  const candidateText = transcript.filter(t => t.role === 'user').map(t => t.content).join(' ');
  const totalWords = candidateText.split(/\s+/).filter(Boolean).length;
  const fillerMatch = candidateText.match(/\b(um|uh|like|you know|basically|actually|literally|i mean)\b/gi) || [];

  const system = `You are an expert interview coach. Evaluate the transcript and return ONLY valid JSON:\n{"overall_score":<0-100>,"confidence_score":<0-100>,"communication_score":<0-100>,"technical_depth":<0-100>,"leadership_score":<0-100>,"energy_level":<0-100>,"strengths":["<s>","<s>"],"weaknesses":["<s>"],"improvement_tips":["<s>","<s>","<s>"],"readiness":"not_ready"|"developing"|"ready"|"strong","summary":"<2-3 sentences>"}`;

  try {
    const raw = await callServerLLM([{ role:'user', content:`Mode: ${mode.toUpperCase()}\n\nTRANSCRIPT:\n${formatted.slice(0,7000)}` }], system, 800);
    const evaluation = JSON.parse(raw.replace(/```json|```/g,'').trim());
    return { ...evaluation, filler_rate: fillerMatch.length / Math.max(totalWords,1) };
  } catch {
    // Fail closed — do not invent a Hire-friendly evaluation
    return {
      overall_score: 40,
      confidence_score: 40,
      communication_score: 40,
      technical_depth: 35,
      leadership_score: 35,
      energy_level: 40,
      strengths: ['Attempted the interview'],
      weaknesses: ['Could not complete live AI evaluation'],
      improvement_tips: ['Retry when the interview LLM service is available', 'Use STAR method', 'Provide longer specific answers'],
      readiness: 'not_ready',
      summary: 'Evaluation service unavailable. Marked as Needs Practice (fail-closed).',
      filler_rate: fillerMatch.length / Math.max(totalWords, 1),
      verdict: 'Needs Practice',
    };
  }
}
