import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';

export const dynamic = 'force-dynamic';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

type RawTranscriptItem = {
  sender?: unknown;
  role?: unknown;
  content?: unknown;
};

function parseKeys(raw: string): string[] {
  return raw
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 8 && !k.includes('placeholder'));
}

function getGroqEvalPool(): string[] {
  const shared = parseKeys(process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '');
  const keysA = parseKeys(process.env.GROQ_GD_KEY_1 || process.env.GROQ_API_KEYS_A || process.env.GROQ_API_KEY_A || '');
  const keysB = parseKeys(process.env.GROQ_GD_KEY_2 || process.env.GROQ_API_KEYS_B || process.env.GROQ_API_KEY_B || '');
  return Array.from(new Set([...shared, ...keysA, ...keysB]));
}

async function callGroqEvalJson(systemPrompt: string, userPrompt: string): Promise<string> {
  const keys = getGroqEvalPool();
  if (keys.length === 0) throw new Error('NO_GROQ_KEY');

  for (const key of keys) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    try {
      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.35,
          max_tokens: 550,
          response_format: { type: 'json_object' },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const data = await res.json();
      const text = (data?.choices?.[0]?.message?.content || '').trim();
      if (text) return text;
    } catch {
      clearTimeout(timeout);
    }
  }
  throw new Error('GROQ_EVAL_UNAVAILABLE');
}

function isCandidateMessage(m: RawTranscriptItem): boolean {
  const role = typeof m.role === 'string' ? m.role.toLowerCase() : '';
  const sender = typeof m.sender === 'string' ? m.sender.toLowerCase() : '';
  return (
    sender === 'you' ||
    role === 'user' ||
    role === 'candidate' ||
    role === 'participant' ||
    role === 'sde candidate'
  );
}

function buildDeterministicGdEvaluation(
  concept: string,
  domain: string,
  userMessages: Array<{ content: string }>
) {
  const turns = userMessages.length;
  const totalWords = userMessages.reduce(
    (sum, m) => sum + m.content.trim().split(/\s+/).filter(Boolean).length,
    0
  );

  if (turns === 0 || totalWords < 3) {
    return {
      score: 0,
      evaluated: true,
      verdict: `No spoken or typed candidate arguments were recorded during the "${concept}" Group Discussion. Share at least 2-3 structured points in the next session to earn an evidence-based score.`,
      gapsIdentified: [
        'No candidate contributions were recorded before the session ended.',
        'Open the floor right after the Host finishes the rules intro with one clear stance and reason.'
      ],
      keyMoments: [
        'Session completed without candidate participation—score accurately anchored at 0%.'
      ]
    };
  }

  const combined = userMessages.map(m => m.content).join(' ');
  const askedQuestions = userMessages.filter(m => m.content.includes('?')).length;
  const hasReasoning = /\b(because|therefore|however|trade-?off|cost|risk|margin|scale|user|customer|impact|data|revenue|profit|audit|gst|roi|latency)\b/i.test(combined);
  const avgWords = Math.round(totalWords / turns);

  const participationPts = Math.min(35, turns * 12);
  const depthPts = Math.min(30, Math.round((avgWords / 30) * 26));
  const reasoningPts = hasReasoning ? 18 : 6;
  const engagementPts = askedQuestions > 0 ? 10 : 4;
  const score = Math.max(12, Math.min(92, participationPts + depthPts + reasoningPts + engagementPts));

  const keyMoments: string[] = [
    `Delivered ${turns} direct contribution${turns === 1 ? '' : 's'} totaling ${totalWords} words (avg ${avgWords} words/turn).`,
  ];
  if (askedQuestions > 0) {
    keyMoments.push(`Actively engaged the panel with ${askedQuestions} direct question${askedQuestions === 1 ? '' : 's'}.`);
  }
  if (hasReasoning) {
    keyMoments.push(`Grounded arguments in concrete ${domain} trade-offs and reasoning rather than vague opinions.`);
  }

  const gapsIdentified: string[] = [];
  if (turns < 3) {
    gapsIdentified.push('Stay in the discussion for at least 3-4 turns so you can respond to the Challenger and build on the Diplomat\'s bridge.');
  }
  if (avgWords < 16) {
    gapsIdentified.push('Expand ultra-short replies to 2-3 crisp sentences: State your view, give 1 reason/example, and note 1 trade-off.');
  }
  if (!hasReasoning) {
    gapsIdentified.push(`Anchor your points with concrete ${domain} metrics, examples, or cause-and-effect trade-offs.`);
  }
  if (gapsIdentified.length === 0) {
    gapsIdentified.push('Push for a crisp final consensus summary during the Host\'s 1-minute closing window.');
  }

  const band =
    score >= 80 ? 'Strong Boardroom Presence'
      : score >= 60 ? 'Solid Developing Contributor'
        : score >= 40 ? 'Early-Stage Participation'
          : 'Brief Participation Recorded';

  return {
    score,
    evaluated: true,
    verdict: `${band} (${score}%): Recorded ${turns} candidate turn${turns === 1 ? '' : 's'} on "${concept}". ${
      hasReasoning
        ? 'You brought clear reasoning to the table and engaged with the panel loop.'
        : 'Add sharper real-world examples and measurable trade-offs to elevate your persuasive impact.'
    }`,
    gapsIdentified,
    keyMoments
  };
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUserFromRequest(req);
    if (auth.error) {
      return auth.error;
    }

    const body = await req.json();
    const concept = typeof body.concept === 'string' && body.concept.trim()
      ? body.concept.trim().slice(0, 160)
      : 'Group Discussion';
    const domain =
      body.domain === 'sales' || body.domain === 'business' || body.domain === 'commerce'
        ? body.domain
        : 'technical';
    const transcript: RawTranscriptItem[] = Array.isArray(body.transcript) ? body.transcript : [];

    const userMessages = transcript
      .filter(isCandidateMessage)
      .map(m => ({ content: typeof m.content === 'string' ? m.content.trim() : '' }))
      .filter(m => m.content.length > 0);

    // Zero-floor honesty: if the user never spoke/typed, return honest 0% immediately
    if (userMessages.length === 0) {
      return NextResponse.json(buildDeterministicGdEvaluation(concept, domain, []));
    }

    const formattedTranscript = transcript
      .slice(-30)
      .map(m => {
        const sender = typeof m.sender === 'string' ? m.sender : 'Speaker';
        const role = typeof m.role === 'string' ? m.role : 'Panelist';
        const content = typeof m.content === 'string' ? m.content.slice(0, 400) : '';
        return `${sender} (${role}): ${content}`;
      })
      .join('\n');

    const domainRubric =
      domain === 'sales'
        ? 'customer trust, objection handling, acquisition economics, and persuasive framing'
        : domain === 'business'
          ? 'unit economics, strategic trade-offs, operational realism, and executive clarity'
          : domain === 'commerce'
            ? 'financial discipline, accounting/tax/regulatory soundness, cash-flow awareness, and commercial clarity'
            : 'technical soundness, trade-off articulation, scalability thinking, and structured problem solving';

    const systemPrompt = `You are an expert corporate Group Discussion evaluator assessing a candidate's live performance on "${concept}" (${domain} domain).
Rubric criteria:
1. Evidence & Domain Clarity: ${domainRubric}
2. Listening & Directness: Did they address Avatar 1 (Challenger) and Avatar 2 (Diplomat) directly?
3. Structure & Conciseness: Clear, crisp points without rambling.
4. Zero Hallucination: Score STRICTLY based on the candidate's actual lines in the transcript. If the candidate only gave 1 brief line, keep the score realistic (20-45). Never invent quotes or achievements not in the transcript.

Respond ONLY in valid JSON with this exact schema:
{
  "score": number (0 to 100),
  "verdict": "2 crisp sentences summarizing actual candidate performance",
  "gapsIdentified": ["Specific gap 1 based on transcript", "Specific gap 2 based on transcript"],
  "keyMoments": ["Specific strength or moment 1 from transcript", "Specific moment 2 from transcript"]
}`;

    try {
      const text = await callGroqEvalJson(systemPrompt, `Transcript:\n${formattedTranscript}`);
      const parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
      const fallback = buildDeterministicGdEvaluation(concept, domain, userMessages);
      const score = Number.isFinite(Number(parsed.score))
        ? Math.max(0, Math.min(100, Math.round(Number(parsed.score))))
        : fallback.score;

      return NextResponse.json({
        score,
        evaluated: true,
        verdict: typeof parsed.verdict === 'string' && parsed.verdict.trim()
          ? parsed.verdict.trim()
          : fallback.verdict,
        gapsIdentified: Array.isArray(parsed.gapsIdentified) && parsed.gapsIdentified.length > 0
          ? parsed.gapsIdentified.map(String).slice(0, 4)
          : fallback.gapsIdentified,
        keyMoments: Array.isArray(parsed.keyMoments) && parsed.keyMoments.length > 0
          ? parsed.keyMoments.map(String).slice(0, 4)
          : fallback.keyMoments,
      });
    } catch {
      return NextResponse.json(buildDeterministicGdEvaluation(concept, domain, userMessages));
    }
  } catch (err) {
    console.error('[GD Evaluate API] Fatal error:', err);
    return NextResponse.json(
      {
        score: 0,
        evaluated: false,
        verdict: 'Evaluation request could not be processed.',
        gapsIdentified: ['Retry ending the session to generate the evaluation report.'],
        keyMoments: []
      },
      { status: 500 }
    );
  }
}
