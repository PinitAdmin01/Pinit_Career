import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { sanitizeLLMOutput } from '@/lib/sanitizeLLM';

function parseKeys(raw: string): string[] {
  return raw.split(',').map(k => k.trim()).filter(k => k.length > 8 && !k.includes('placeholder'));
}

function getGroqPool(): string[] {
  const shared = parseKeys(process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '');
  const keysA = parseKeys(process.env.GROQ_API_KEYS_A || process.env.GROQ_API_KEY_A || '');
  const keysB = parseKeys(process.env.GROQ_API_KEYS_B || process.env.GROQ_API_KEY_B || '');
  return Array.from(new Set([...shared, ...keysA, ...keysB]));
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`gd_eval_${ip}`, { limit: 20, windowMs: 3_600_000 });
    if (!rl.allowed) {
      return NextResponse.json({ ok: false, error: 'RATE_LIMIT' }, { status: 429 });
    }

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json().catch(() => ({}));
    const { roomId, roomDesc, domain, history } = body;

    const candidateMessages = (Array.isArray(history) ? history : []).filter((h: any) =>
      (h.role === 'SDE Candidate' || h.role === 'Candidate' || h.role === 'user' || h.sender === 'Candidate' || h.sender === 'user') &&
      typeof h.content === 'string' &&
      h.content.trim().length > 0
    );

    // If candidate did not participate or only sent whitespace, score is 0 and evaluated is false
    if (candidateMessages.length === 0) {
      return NextResponse.json({
        score: 0,
        verdict: 'The candidate did not contribute any verbal responses to the boardroom debate. Active technical participation is required to assess communication and architecture competency.',
        gapsIdentified: ['No candidate contributions recorded during this session.'],
        keyMoments: ['Candidate observed without speaking.'],
        evaluated: false
      });
    }

    // Build formatted transcript for LLM
    const formattedTranscript = (Array.isArray(history) ? history : [])
      .map((m: any) => `${m.sender || m.role || 'Participant'}: ${m.content}`)
      .join('\n\n');

    const systemPrompt = `You are a Senior Principal Engineer and Boardroom Evaluation Director assessing an SDE Candidate in a technical boardroom discussion.
Discussion Topic: "${roomId || 'System Architecture'}"
Objective: "${roomDesc || 'Architectural Trade-off Analysis'}"
Domain: "${domain || 'technical'}"

Analyze the candidate's actual contributions in the transcript. Evaluate their technical depth, communication clarity, systems trade-offs, and critical reasoning.

Evaluate strictly and return ONLY a valid JSON object matching this exact schema:
{
  "score": <integer between 0 and 100 representing performance quality>,
  "verdict": "<2-3 sentence executive evaluation summarizing candidate contributions, trade-off depth, and communication impact>",
  "gapsIdentified": ["<specific gap 1>", "<specific gap 2>", "<specific gap 3>"],
  "keyMoments": ["<specific key moment 1>", "<specific key moment 2>", "<specific key moment 3>"]
}

Scoring Guidelines:
- Non-substantive, spam, or trivial replies ("ok", "yes", "cool", "hi") must receive a low score (< 40).
- Only give >= 70 if the candidate made substantive architectural arguments, considered trade-offs, or defended engineering decisions.
- Do NOT output markdown code blocks or any extraneous text. Return ONLY the raw JSON object.`;

    const userPrompt = `Boardroom Debate Transcript:\n\n${formattedTranscript}`;

    const groqKeys = getGroqPool();
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let rawParsed: any = null;

    // 1. Attempt Groq Multi-Key Pool
    for (const key of groqKeys) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            max_tokens: 800,
            temperature: 0.2,
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          const firstBrace = cleanJsonStr.indexOf('{');
          const lastBrace = cleanJsonStr.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) {
            rawParsed = JSON.parse(cleanJsonStr.substring(firstBrace, lastBrace + 1));
            break;
          }
        }
      } catch (groqErr: any) {
        console.warn('[API GD Evaluate] Groq attempt failed:', groqErr?.message);
      }
    }

    // 2. Fallback to OpenRouter if Groq pool failed
    if (!rawParsed && openRouterKey) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://pinit-careers.web.app',
            'X-Title': 'PinIT GD AI Evaluator',
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          const firstBrace = cleanJsonStr.indexOf('{');
          const lastBrace = cleanJsonStr.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) {
            rawParsed = JSON.parse(cleanJsonStr.substring(firstBrace, lastBrace + 1));
          }
        }
      } catch (openRouterErr: any) {
        console.warn('[API GD Evaluate] OpenRouter fallback failed:', openRouterErr?.message);
      }
    }

    // 3. Fail-Closed if LLM evaluation was unavailable
    if (!rawParsed || typeof rawParsed.score !== 'number') {
      return NextResponse.json(
        {
          ok: false,
          error: 'AI_EVALUATION_OFFLINE',
          retryable: true,
          message: 'AI evaluation service is currently unavailable. Please retry.',
        },
        { status: 503 }
      );
    }

    const score = Math.max(0, Math.min(100, Math.round(rawParsed.score)));
    const verdict = sanitizeLLMOutput(String(rawParsed.verdict || 'Discussion completed.'));
    const gapsIdentified = Array.isArray(rawParsed.gapsIdentified) && rawParsed.gapsIdentified.length > 0
      ? rawParsed.gapsIdentified.map((g: any) => sanitizeLLMOutput(String(g))).filter(Boolean)
      : ['No critical technical gaps identified.'];
    const keyMoments = Array.isArray(rawParsed.keyMoments) && rawParsed.keyMoments.length > 0
      ? rawParsed.keyMoments.map((m: any) => sanitizeLLMOutput(String(m))).filter(Boolean)
      : ['Discussion completed.'];

    return NextResponse.json({
      score,
      verdict,
      gapsIdentified,
      keyMoments,
      evaluated: true,
    });

  } catch (err) {
    console.error('[API GD Evaluate Error]:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'AI_EVALUATION_OFFLINE',
        retryable: true,
        message: 'AI evaluation service encountered an error.',
      },
      { status: 503 }
    );
  }
}
