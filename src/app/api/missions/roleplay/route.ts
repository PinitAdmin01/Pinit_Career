import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { executeRoleplayTurn } from '@/lib/missions/roleplayEngine';

async function callLLM(systemPrompt: string, messages: { role: string; content: string }[], maxTokens = 700): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY || (process.env.GROQ_API_KEYS || '').split(',')[0]?.trim();
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (!groqKey && !openRouterKey) {
    throw new Error('No LLM credentials');
  }

  const payloadMessages = [{ role: 'system', content: systemPrompt }, ...messages];

  if (groqKey) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: payloadMessages,
        max_tokens: maxTokens,
        temperature: 0.95,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const text = (data.choices?.[0]?.message?.content || '').trim();
      if (text) return text;
    }
  }

  if (openRouterKey) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: payloadMessages,
        max_tokens: maxTokens,
        temperature: 0.95,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const text = (data.choices?.[0]?.message?.content || '').trim();
      if (text) return text;
    }
  }

  throw new Error('LLM call failed');
}

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error || !gated.user) return gated.error;

    const body = await req.json();
    const result = await executeRoleplayTurn(
      {
        action: String(body.action || ''),
        qt2: Number(body.qt2 ?? 75),
        role: String(body.role || 'Software Developer'),
        history: Array.isArray(body.history) ? body.history : [],
        choice: body.choice ? String(body.choice) : undefined,
        studentName: String(body.studentName || gated.user.email?.split('@')[0] || 'there'),
        userId: gated.user.id,
        sessionNonce: String(body.sessionNonce || `${Date.now()}`),
        recentTitles: Array.isArray(body.recentTitles) ? body.recentTitles.map(String) : [],
      },
      (messages, systemPrompt, maxTokens) => callLLM(systemPrompt, messages, maxTokens)
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
