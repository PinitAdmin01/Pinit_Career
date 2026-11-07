import { NextRequest, NextResponse } from 'next/server';
import { DYNAMIC_SCENARIO_CATALOG } from '@/lib/missions/communicationScenarios';

// Heuristic pattern to identify evasive, low-effort, or dismissive responses
const EVASIVE_PATTERNS = [
  /\bask\s+(claude|chatgpt|gpt|ai|google|someone\s+else)\b/i,
  /\b(idk|dunno|idc|whatever|whatev|idgaf|dont\s+care)\b/i,
  /\b(not\s+my\s+job|not\s+my\s+problem|deal\s+with\s+it)\b/i,
  /\b(figure\s+it\s+out|who\s+cares|google\s+it)\b/i,
  /\b(blah\s+blah|asdf|qwerty|testing|test\s+123)\b/i,
];

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON', message: 'Invalid JSON body' }, { status: 400 });
  }

  const submission = String(body.submission || body.text || '').trim();
  const scenarioTitle = String(body.scenario || 'Production System Outage').trim();
  const track = String(body.track || 'Engineering / Tech').trim();
  const situation = String(body.situation || '').trim();
  const prompt = String(body.prompt || '').trim();

  if (!submission) {
    return NextResponse.json({ error: 'EMPTY_SUBMISSION', message: 'Submission text is required.' }, { status: 400 });
  }

  // 1. Locate matched scenario in catalog for fallback context
  const matchedScenario = DYNAMIC_SCENARIO_CATALOG.find(
    (s) => s.title.toLowerCase().includes(scenarioTitle.toLowerCase()) || scenarioTitle.toLowerCase().includes(s.title.toLowerCase())
  ) || DYNAMIC_SCENARIO_CATALOG[0];

  const words = submission.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 2. Check for Low-Effort / Evasive / Slang Responses (e.g. "Hi team ask claude for it")
  const isEvasive = EVASIVE_PATTERNS.some((p) => p.test(submission)) || wordCount < 3;

  if (isEvasive) {
    return NextResponse.json({
      ok: true,
      scores: {
        clarity: 28,
        tone: 25,
        structure: 20,
        impact: 22,
        average: 24,
      },
      ratingLabel: 'Unprofessional / Deflective',
      rewrites: {
        executive: matchedScenario.defaultRewrites.executive,
        professional: matchedScenario.defaultRewrites.professional,
        native: matchedScenario.defaultRewrites.native,
      },
      feedback: {
        positive: 'You responded to the communication thread, but casual deflection violates corporate communication standards.',
        recommendation: `Never dismiss a critical workplace scenario with evasive phrasing like "${submission}". In a high-stakes corporate environment, stakeholders expect immediate accountability, current status triage, and an explicit time for the next checkpoint.`,
      },
    });
  }

  // 3. Attempt LLM Evaluation via Multi-Key Failover Pool
  const groqKeysStr = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
  const groqKeys = groqKeysStr.split(',').map((k) => k.trim()).filter(Boolean);
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  const systemInstructions = `You are an Executive Corporate Communications Coach evaluating a candidate's workplace communication in PinIT Career OS.
Scenario: "${scenarioTitle}"
Context: "${situation || matchedScenario.situation}"
Objective: "${prompt || matchedScenario.prompt}"
Student Track: "${track}"

Student's Submitted Response:
"${submission}"

Provide an objective corporate rating and 3 DISTINCT, HIGH-QUALITY model rewrites that show how a seasoned leader addresses this exact situation:
- "executive": Concise, C-suite briefing focused on business impact, risk mitigation, and ownership (1-2 sentences).
- "professional": Clear, courteous, accountable communication tailored for peers, tech leads, or managers (2-3 sentences).
- "native": Natural, idiomatic corporate American/British English tone with natural workplace phrasing (2-3 sentences).

Format your response STRICTLY as valid JSON with no markdown fences, matching this schema:
{
  "scores": {
    "clarity": number (0-100),
    "tone": number (0-100),
    "structure": number (0-100),
    "impact": number (0-100),
    "average": number (0-100)
  },
  "ratingLabel": string ("Executive C-Suite Ready" | "Corporate Ready" | "Needs Professional Polish"),
  "rewrites": {
    "executive": string,
    "professional": string,
    "native": string
  },
  "feedback": {
    "positive": string,
    "recommendation": string
  }
}`;

  // Try Groq First
  for (const key of groqKeys) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'system', content: systemInstructions }],
          temperature: 0.4,
          max_tokens: 500,
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(3500),
      });

      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.choices?.[0]?.message?.content || '{}');
        if (parsed.scores && parsed.rewrites?.executive) {
          return NextResponse.json({
            ok: true,
            scores: parsed.scores,
            ratingLabel: parsed.ratingLabel || (parsed.scores.average >= 85 ? 'Executive C-Suite Ready' : 'Corporate Ready'),
            rewrites: parsed.rewrites,
            feedback: parsed.feedback || {
              positive: 'Clear problem framing and professional tone.',
              recommendation: matchedScenario.etiquetteTip,
            },
          });
        }
      }
    } catch {
      // Continue to next failover key
    }
  }

  // Try Gemini Failover
  if (geminiKey) {
    try {
      const gemRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: systemInstructions }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.4,
              maxOutputTokens: 600,
            },
          }),
          signal: AbortSignal.timeout(3500),
        }
      );

      if (gemRes.ok) {
        const gemData = await gemRes.json();
        const rawText = gemData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const parsed = JSON.parse(rawText);
        if (parsed.scores && parsed.rewrites?.executive) {
          return NextResponse.json({
            ok: true,
            scores: parsed.scores,
            ratingLabel: parsed.ratingLabel || (parsed.scores.average >= 85 ? 'Executive C-Suite Ready' : 'Corporate Ready'),
            rewrites: parsed.rewrites,
            feedback: parsed.feedback || {
              positive: 'Well-structured response with constructive accountability.',
              recommendation: matchedScenario.etiquetteTip,
            },
          });
        }
      }
    } catch {
      // Continue to intelligent fallback
    }
  }

  // 4. Intelligent Linguistic Synthesizer (Zero-Network Deterministic Fallback)
  const hasActionPlan = /\b(will|plan|propose|schedule|resolve|prioritize|deliver|mitigate|align|update|investigate|deploy|rollback|patch|clear)\b/i.test(submission);
  const hasOwnership = /\b(i|we|our|my|team|ownership|accountable|ensure|commit|responsible)\b/i.test(submission);
  const hasTimeline = /\b(by|at|eod|today|minutes|hours|pm|am|friday|monday|checkpoint|eta)\b/i.test(submission);
  const hasFiller = /\b(um|uh|maybe|sort of|kind of|guess|probably|i think)\b/i.test(submission);

  let clarity = Math.min(95, Math.max(50, 60 + Math.min(25, wordCount * 1.5) + (hasActionPlan ? 8 : -6)));
  let tone = Math.min(96, Math.max(52, 70 + (hasOwnership ? 12 : -4) - (hasFiller ? 12 : 0)));
  let structure = Math.min(95, Math.max(50, 65 + (hasTimeline ? 12 : -4) + (wordCount >= 15 ? 10 : -4)));
  let impact = Math.min(96, Math.round((clarity + tone + structure) / 3) + (hasActionPlan && hasTimeline ? 6 : -4));
  let average = Math.round((clarity + tone + structure + impact) / 4);

  // Generate scenario-aligned rewrites that incorporate student core content smoothly
  const cleanSubmission = submission.replace(/[.!?]+$/, '').trim();
  const executiveRewrite = `${matchedScenario.defaultRewrites.executive} (Aligned with candidate update: "${cleanSubmission.slice(0, 80)}...")`;
  const professionalRewrite = matchedScenario.defaultRewrites.professional;
  const nativeRewrite = matchedScenario.defaultRewrites.native;

  return NextResponse.json({
    ok: true,
    scores: {
      clarity,
      tone,
      structure,
      impact,
      average,
    },
    ratingLabel: average >= 86 ? 'Executive C-Suite Ready' : average >= 72 ? 'Corporate Ready' : 'Needs Professional Polish',
    rewrites: {
      executive: executiveRewrite,
      professional: professionalRewrite,
      native: nativeRewrite,
    },
    feedback: {
      positive: hasOwnership && hasActionPlan
        ? `Strong accountability demonstrated for ${scenarioTitle}; explicit mitigation steps establish stakeholder trust.`
        : `Clear initial communication intent; incorporating concrete completion timelines will elevate executive authority.`,
      recommendation: matchedScenario.etiquetteTip,
    },
  });
}
