import { NextRequest, NextResponse } from 'next/server';
import { DYNAMIC_SCENARIO_CATALOG } from '@/lib/missions/communicationScenarios';

// Heuristic pattern to identify evasive, low-effort, passing-the-buck, or dismissive responses
const EVASIVE_PATTERNS = [
  /\b(ask|tell|get|let)\s+(my\s+)?(friend|bro|buddy|dude|pal|guy|someone|anyone|claude|chatgpt|gpt|ai|google|bot)\b/i,
  /\b(friend|someone|anyone|bot)\s+(to\s+)?(fix|do|handle|solve|look|check)\b/i,
  /\b(idk|dunno|idc|whatever|whatev|idgaf|dont\s+care)\b/i,
  /\b(not\s+my\s+(job|problem)|deal\s+with\s+it)\b/i,
  /\b(figure\s+it\s+out|who\s+cares|google\s+it)\b/i,
  /\b(pass\s+(it\s+)?to|delegate\s+to\s+someone)\b/i,
  /\b(blah\s+blah|asdf|qwerty|testing|test\s+123)\b/i,
];

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON', message: 'Invalid JSON body' }, { status: 400 });
  }

  const rawSubmission = String(body.submission || body.text || '').trim();
  // Strip malicious HTML/script tags and clamp to safe max length (3,000 chars)
  const submission = rawSubmission.replace(/<[^>]*>?/gm, '').slice(0, 3000).trim();
  const scenarioTitle = String(body.scenario || 'Production System Outage').trim().slice(0, 200);
  const track = String(body.track || 'Engineering / Tech').trim().slice(0, 100);
  const situation = String(body.situation || '').trim().slice(0, 500);
  const prompt = String(body.prompt || '').trim().slice(0, 500);

  if (!submission) {
    return NextResponse.json({ error: 'EMPTY_SUBMISSION', message: 'Submission text is required.' }, { status: 400 });
  }

  // 1. Locate matched scenario in catalog for fallback context
  const matchedScenario = DYNAMIC_SCENARIO_CATALOG.find(
    (s) => s.title.toLowerCase().includes(scenarioTitle.toLowerCase()) || scenarioTitle.toLowerCase().includes(s.title.toLowerCase())
  ) || DYNAMIC_SCENARIO_CATALOG[0];

  const words = submission.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 2. Check for Low-Effort / Evasive / Passing-the-buck Responses (e.g. "ask my friend to fix it")
  const isEvasive = EVASIVE_PATTERNS.some((p) => p.test(submission)) || wordCount < 3;

  if (isEvasive) {
    return NextResponse.json({
      ok: true,
      scores: {
        clarity: 15,
        tone: 18,
        structure: 15,
        impact: 16,
        average: 16,
      },
      ratingLabel: 'Unprofessional / Deflective',
      rewrites: {
        executive: matchedScenario.defaultRewrites.executive,
        professional: matchedScenario.defaultRewrites.professional,
        native: matchedScenario.defaultRewrites.native,
      },
      feedback: {
        positive: 'You responded to the message, but delegating your work onto a friend or an AI tool during an issue is not acceptable.',
        recommendation: `Never dismiss a workplace issue with words like "${submission}". Take ownership yourself: tell your team what is broken, what you are doing right now to fix it, and when you will give the next update.`,
      },
    });
  }

  // 3. Attempt LLM Evaluation via Multi-Key Failover Pool
  const groqKeysStr = process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || '';
  const groqKeys = groqKeysStr.split(',').map((k) => k.trim()).filter(Boolean);
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  const systemInstructions = `You are a helpful, encouraging workplace communication coach for college students and junior professionals.
Scenario: "${scenarioTitle}"
Situation: "${situation || matchedScenario.situation}"
Goal: "${prompt || matchedScenario.prompt}"
Student Track: "${track}"

Student's Written Response:
"${submission}"

TASK:
1. Evaluate the student's response. Grade realistically (0-100). If the answer avoids responsibility or passes blame, give a low score (under 40). If it takes ownership, explains the issue, and gives a timeline, give a good score (75-95).
2. Write 3 model rewrites in SIMPLE, CLEAR, EVERYDAY ENGLISH that any student can understand:
   - "executive": Short, confident update for a manager or lead (1-2 sentences).
   - "professional": Clear, polite, and cooperative message for teammates (2-3 sentences).
   - "native": Natural, friendly workplace English that sounds like a native speaker (2-3 sentences).
3. In "feedback":
   - "positive": 1 simple sentence explaining what was good (or what went wrong if the score is low).
   - "recommendation": 1 simple, practical tip in plain English explaining how to say it better. Do NOT use complicated corporate buzzwords.

Return STRICTLY valid JSON with no markdown formatting:
{
  "scores": {
    "clarity": number,
    "tone": number,
    "structure": number,
    "impact": number,
    "average": number
  },
  "ratingLabel": string ("Executive Ready" | "Professional" | "Needs Work" | "Unprofessional / Deflective"),
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
          temperature: 0.3,
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
            ratingLabel: parsed.ratingLabel || (parsed.scores.average >= 85 ? 'Executive Ready' : 'Professional'),
            rewrites: parsed.rewrites,
            feedback: parsed.feedback || {
              positive: 'Good job communicating clearly and taking responsibility.',
              recommendation: 'Always let your team know what you are doing right now and what time you will update them.',
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
              temperature: 0.3,
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
            ratingLabel: parsed.ratingLabel || (parsed.scores.average >= 85 ? 'Executive Ready' : 'Professional'),
            rewrites: parsed.rewrites,
            feedback: parsed.feedback || {
              positive: 'Good job communicating clearly and taking responsibility.',
              recommendation: 'Always let your team know what you are doing right now and what time you will update them.',
            },
          });
        }
      }
    } catch {
      // Continue to intelligent fallback
    }
  }

  // 4. Intelligent Linguistic Synthesizer (Zero-Network Deterministic Fallback)
  const hasActionPlan = /\b(will|plan|propose|schedule|resolve|fix|prioritize|deliver|mitigate|align|update|investigate|deploy|rollback|patch|clear)\b/i.test(submission);
  const hasOwnership = /\b(i am|we are|i will|we will|i have|we have|my team|our team|i took|responsible)\b/i.test(submission);
  const hasTimeline = /\b(by|at|eod|today|minutes|hours|pm|am|friday|monday|checkpoint|eta|soon)\b/i.test(submission);
  const hasFiller = /\b(um|uh|maybe|sort of|kind of|guess|probably|i think)\b/i.test(submission);

  let clarity = Math.min(95, Math.max(50, 60 + Math.min(25, wordCount * 1.5) + (hasActionPlan ? 8 : -6)));
  let tone = Math.min(96, Math.max(52, 68 + (hasOwnership ? 12 : -4) - (hasFiller ? 12 : 0)));
  let structure = Math.min(95, Math.max(50, 65 + (hasTimeline ? 12 : -4) + (wordCount >= 15 ? 10 : -4)));
  let impact = Math.min(96, Math.round((clarity + tone + structure) / 3) + (hasActionPlan && hasTimeline ? 6 : -4));
  let average = Math.round((clarity + tone + structure + impact) / 4);

  // Return clean, authentic model rewrites without string concatenation leaks
  const executiveRewrite = matchedScenario.defaultRewrites.executive;
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
    ratingLabel: average >= 86 ? 'Executive Ready' : average >= 72 ? 'Professional' : 'Needs Work',
    rewrites: {
      executive: executiveRewrite,
      professional: professionalRewrite,
      native: nativeRewrite,
    },
    feedback: {
      positive: hasOwnership && hasActionPlan
        ? `Great job taking direct responsibility for the issue and explaining your next steps.`
        : `You explained the situation, but you need to give a specific time for when you will update the team.`,
      recommendation: `In a real job, always tell your team 3 simple things: (1) what is wrong, (2) what you are doing right now to fix it, and (3) what time you will update them.`,
    },
  });
}
