import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { executeGdTurn, GdRoleType, normalizeMentorId } from '@/lib/group-discussion/gdTurnEngine';

let keyIndexA = 0;
let keyIndexB = 0;

function parseKeys(raw: string): string[] {
  return raw.split(',').map(k => k.trim()).filter(k => k.length > 8 && !k.includes('placeholder'));
}

function getActiveKeyForSlot(slot: 'a' | 'b'): string | null {
  const shared = parseKeys(process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '');
  const keysA = parseKeys(process.env.GROQ_API_KEYS_A || process.env.GROQ_API_KEY_A || '');
  const keysB = parseKeys(process.env.GROQ_API_KEYS_B || process.env.GROQ_API_KEY_B || '');
  const poolA = keysA.length ? keysA : shared.length ? [shared[0]] : [];
  const poolB = keysB.length ? keysB : shared.length > 1 ? [shared[1]] : poolA;

  if (slot === 'a') {
    if (!poolA.length) return null;
    const key = poolA[keyIndexA % poolA.length];
    keyIndexA = (keyIndexA + 1) % 1_000_000;
    return key;
  }
  if (!poolB.length) return null;
  const key = poolB[keyIndexB % poolB.length];
  keyIndexB = (keyIndexB + 1) % 1_000_000;
  return key;
}

async function groqComplete(
  slot: 'a' | 'b',
  messages: { role: string; content: string }[],
  systemPrompt: string,
  maxTokens: number
): Promise<string> {
  const key = getActiveKeyForSlot(slot);
  if (!key) throw new Error('No Groq key for GD slot ' + slot);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });
    if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
    const data = await res.json();
    const text = String(data?.choices?.[0]?.message?.content || '').trim();
    if (!text) throw new Error('Empty Groq reply');
    return text;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json();
    const roleType: GdRoleType = body.roleType === 'avatar_b' ? 'avatar_b' : 'avatar_a';
    const mentorId = normalizeMentorId((body.activeMentors && body.activeMentors[0]) || body.mentorId);

    const result = await executeGdTurn(
      {
        roleType,
        mentorId,
        topic: String(body.roomId || body.topic || 'this topic'),
        objective: String(body.objective || body.roomDesc || ''),
        domain: String(body.domain || 'technical'),
        nextSpeakerName: body.nextSpeakerName ? String(body.nextSpeakerName) : undefined,
        candidateName: body.candidateName ? String(body.candidateName) : 'Candidate',
        history: Array.isArray(body.history) ? body.history : [],
        candidateSilenced: Boolean(body.candidateSilenced),
      },
      groqComplete
    );

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API GD Bot Reply Error]:', err);
    return NextResponse.json({ error: 'Failed to generate boardroom reply', details: err.message }, { status: 500 });
  }
}
