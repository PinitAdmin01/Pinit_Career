import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput, sanitizeEvaluationResult } from '@/lib/sanitizeLLM';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';
import { createEvaluationSignature } from '@/lib/interview/evaluationSignature';
import { completeActiveLiveInterview } from '@/lib/interview/activeSessionRegistry';

const InterviewEvaluateSchema = z.object({
  type: z.string().optional(),
  topology: z.any().optional(),
  history: z.array(z.any()).optional().default([]),
  codingScore: z.number().optional(),
  telemetry: z.any().optional(),
  domainStream: z.string().optional(),
  domainSubTopic: z.string().optional(),
  roleKey: z.string().optional(),
  archetype: z.string().optional(),
  explanation: z.string().optional(),
  transcript: z.string().optional(),
  currentStage: z.string().optional(),
}).passthrough();
import {
  calculateRoleWeightedScore,
  generatePersonaCoaching,
  generateTelemetryDiagnostics,
  normalizeRoleKey,
  ROLE_SCORING_MATRICES,
  ROLE_RUBRIC_VERSION,
  clampScore,
  MindsetArchetype,
} from '@/lib/interview/scoringMatrix';
import { evaluateSystemTopology } from '@/lib/interview/systemDesignEvaluator';
import { getSupabaseAdmin } from '@/lib/server/supabaseAdmin';

/**
 * Expands evaluation context to 35,000 chars while preserving both
 * conversational introduction and deep technical closing defense turns.
 */
export function formatTranscriptForEvaluation(formatted: string, maxLimit = 35000): string {
  if (formatted.length <= maxLimit) {
    return formatted;
  }
  // Retain first 5,000 chars (introductions & problem setup) and last 30,000 chars (system design defense & Q&A)
  const head = formatted.slice(0, 5000);
  const tail = formatted.slice(-30000);
  return `${head}\n\n[... intermediate turns summarized for context window ...]\n\n${tail}`;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`interview_eval_${ip}`, { limit: 20, windowMs: 3_600_000 });
    if (!rl.allowed) return NextResponse.json({ error: 'RATE_LIMIT' }, { status: 429 });

    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const rawBody = await req.json();
    const { data: body, error } = validateBody(InterviewEvaluateSchema, rawBody);
    if (error) return error;

    const {
      type,
      topology,
      history = [],
      codingScore,
      telemetry,
      domainStream,
      domainSubTopic,
      roleKey: rawRoleKey,
      archetype: rawArchetype,
    } = body;

    // Dedicated System Design Topology Evaluator for Round 3
    if (type === 'systems' && topology) {
      console.log(`[Interview Evaluate] Evaluating System Architecture Topology for: ${domainSubTopic || 'Distributed Architecture'}`);
      const sysEval = evaluateSystemTopology(topology, domainSubTopic || 'System Architecture', domainStream === 'non_tech' ? 'non_tech' : 'tech');
      
      // Substantive Architectural Defense Communication Evaluator
      let dynamicComms = sysEval.score;
      const oralDefense = body.explanation || body.transcript || (Array.isArray(history) ? history.map((h: any) => h.content).join(' ') : '');
      if (typeof oralDefense === 'string' && oralDefense.trim().length > 0) {
        const trimmed = oralDefense.trim();
        const lowerDefense = trimmed.toLowerCase();
        const words = trimmed.split(/\s+/).filter(Boolean);
        const sentences = trimmed.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 8);

        // 1. Contextual alignment with components actually placed on whiteboard
        const nodes = Array.isArray(topology?.nodes) ? topology.nodes : [];
        const nodeTerms = nodes.flatMap((n: any) => {
          const raw = `${n.type || ''} ${n.label || ''}`.toLowerCase();
          return raw.split(/[\s/()]+/).filter(w => w.length > 3);
        });
        const uniqueNodeTerms: string[] = Array.from(new Set(nodeTerms));
        const matchedComponents = uniqueNodeTerms.filter(term => lowerDefense.includes(term));
        const componentCoverage = uniqueNodeTerms.length > 0
          ? Math.min(1.0, matchedComponents.length / Math.min(4, uniqueNodeTerms.length))
          : 0.6;

        // 2. Architectural reasoning and causal justification clauses
        const justificationPhrases = [
          'because', 'in order to', 'trade-off', 'tradeoff', 'mitigate',
          'alleviate', 'bottleneck', 'redundancy', 'failover', 'throughput',
          'consistency', 'latency', 'decouple', 'prevent', 'handles'
        ];
        const matchedJustifications = justificationPhrases.filter(p => lowerDefense.includes(p));

        // 3. Structural articulation: multi-sentence coherence & word count
        const lengthFactor = Math.min(1.0, words.length / 30);
        const sentenceFactor = Math.min(1.0, sentences.length / 2);

        // Calculate score: Base 50 + Up to 18 (Reasoning) + Up to 16 (Component alignment) + Up to 14 (Coherence)
        const reasoningScore = Math.min(18, matchedJustifications.length * 4);
        const alignmentScore = Math.round(componentCoverage * 16);
        const articulationScore = Math.round((lengthFactor * 0.6 + sentenceFactor * 0.4) * 14);

        dynamicComms = Math.min(95, Math.max(45, 50 + reasoningScore + alignmentScore + articulationScore));
      }

      return NextResponse.json({
        evaluation: {
          score: sysEval.score,
          verdict: sysEval.grade,
          readiness: `${sysEval.grade} Architecture`,
          summary: sysEval.summary,
          strengths: sysEval.strengths,
          weaknesses: sysEval.bottlenecks,
          improvements: sysEval.recommendations.join(' • '),
          spokenFeedback: sysEval.spokenFeedback,
          radar: {
            logic: sysEval.score,
            systems: sysEval.score,
            comms: dynamicComms,
            solving: sysEval.scalabilityRating,
            star: sysEval.reliabilityRating
          }
        },
        success: true
      });
    }

    const stream = domainStream === 'non_tech' ? 'non_tech' : 'tech';
    const roleKey = normalizeRoleKey(rawRoleKey || domainSubTopic, stream);
    const roleConfig = ROLE_SCORING_MATRICES[roleKey] || ROLE_SCORING_MATRICES.sde;
    const topic = domainSubTopic || roleConfig.roleName;

    const validArchetypes = ['Pattern Hunter', 'Explorer', 'Social IQ', 'Stabilizer'] as const;
    const archetype: MindsetArchetype = (rawArchetype && (validArchetypes as readonly string[]).includes(rawArchetype))
      ? (rawArchetype as MindsetArchetype)
      : 'Pattern Hunter';

    const formatted = (history || [])
      .map((t: any) => `${t.role === 'assistant' ? 'INTERVIEWER' : 'CANDIDATE'}: ${t.content}`)
      .join('\n\n');

    const systemPrompt = `You are a recruitment director evaluating a candidate for "${roleConfig.roleName}" (${stream} stream).
Role Rubric Focus: ${roleConfig.rubricFocus}

Evaluate the candidate's transcript strictly across these 5 performance dimensions (0-100 scale):
1. logic (algorithmic rigor, analytical logic, quantitative thinking)
2. systems (architecture, scalability, workflow design, structural trade-offs)
3. comms (clarity, concise articulation, active listening, listener empathy)
4. solving (practical execution, code/solution correctness, edge-case mitigation)
5. star (behavioral competency, Situation-Task-Action-Result structure)

Return ONLY valid JSON matching this schema:
{
  "logic": <0-100>,
  "systems": <0-100>,
  "comms": <0-100>,
  "solving": <0-100>,
  "star": <0-100>,
  "strengths": ["string", "string"],
  "weaknesses": ["string"],
  "improvement_tips": ["string", "string"],
  "summary": "2-3 sentence executive evaluation summary."
}`;

    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let rawParsedEval: any = null;

    const candidateTranscriptPrompt = formatTranscriptForEvaluation(formatted);

    // 1. Attempt Groq Multi-Key Rotation Pool
    for (const key of groqKeys) {
      try {
        console.log(`[Interview Evaluate API] Attempting Groq evaluation with key ending in ...${key.slice(-4)}`);
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
              { role: 'user', content: `Candidate Transcript:\n\n${candidateTranscriptPrompt}` },
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
          rawParsedEval = JSON.parse(cleanJsonStr);
          console.log('[Interview Evaluate API] Groq evaluation successfully parsed');
          break;
        } else {
          console.warn(`[Interview Evaluate API] Groq key returned status: ${res.status}`);
        }
      } catch (e: any) {
        console.warn('[Interview Evaluate API] Groq evaluation request error/timeout:', e?.message);
      }
    }

    // 2. Fallback to OpenRouter if Groq pool is exhausted
    if (!rawParsedEval && openRouterKey) {
      try {
        console.log('[Interview Evaluate API] Falling back to OpenRouter evaluation...');
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': 'https://pinit-careers.web.app',
            'X-Title': 'PinIT Interview AI Evaluator'
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Candidate Transcript:\n\n${candidateTranscriptPrompt}` },
            ],
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          rawParsedEval = JSON.parse(cleanJsonStr);
          console.log('[Interview Evaluate API] OpenRouter evaluation successfully parsed');
        }
      } catch (e: any) {
        console.warn('[Interview Evaluate API] OpenRouter evaluation request error/timeout:', e?.message);
      }
    }

    // Fail-Safe: Defect 087 Fix — NEVER FABRICATE PASSING 65-70 SCORES ON OFFLINE SERVICE
    if (!rawParsedEval) {
      if (body.sessionId && gated.user?.id) {
        try {
          const supabase = getSupabaseAdmin();
          await supabase
            .from('interview_sessions')
            .update({
              status: 'PENDING_EVALUATION',
              transcript: history,
              telemetry_diagnostics: generateTelemetryDiagnostics(telemetry) || null,
            })
            .eq('id', body.sessionId)
            .eq('user_id', gated.user.id);
        } catch (dbErr: any) {
          console.warn('[Interview Evaluate] Failed to store PENDING_EVALUATION session:', dbErr?.message);
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: 'AI_EVALUATION_OFFLINE',
          retryable: true,
          message: 'AI evaluation services unreachable. Interview session preserved as PENDING_EVALUATION.',
        },
        { status: 503 }
      );
    }

    // Sanitize string fields safely preserving numeric dimension ratings
    const sanitizedEvaluation = sanitizeEvaluationResult(rawParsedEval);

    const extractedDimensions = {
      logic: clampScore(sanitizedEvaluation.logic, 65),
      systems: clampScore(sanitizedEvaluation.systems, 65),
      comms: clampScore(sanitizedEvaluation.comms, 70),
      solving: clampScore(sanitizedEvaluation.solving ?? codingScore, 65),
      star: clampScore(sanitizedEvaluation.star, 65),
    };

    // Deterministic Role-Weighted Score Calculation (Authority: Code, not LLM)
    const scoringResult = calculateRoleWeightedScore(extractedDimensions, roleKey);

    // Persona-Tailored Pedagogical Coaching (Purely advisory; does NOT alter score)
    const personaCoaching = generatePersonaCoaching(archetype, scoringResult.sanitizedDimensions, roleKey);

    // Telemetry Practice Diagnostics (Defect 090: Persisted to DB)
    const telemetryDiagnostics = generateTelemetryDiagnostics(telemetry);

    const finalEvaluation = {
      verdict: scoringResult.verdict,
      score: scoringResult.overallScore,
      readiness: scoringResult.readiness,
      roleKey,
      roleName: scoringResult.roleName,
      rubricVersion: ROLE_RUBRIC_VERSION,
      appliedWeights: scoringResult.appliedWeights,
      radar: scoringResult.sanitizedDimensions,
      // Backward compatibility dimension fields
      domain_knowledge: scoringResult.sanitizedDimensions.solving,
      strategic_thinking: scoringResult.sanitizedDimensions.systems,
      communication_score: scoringResult.sanitizedDimensions.comms,
      star_alignment: scoringResult.sanitizedDimensions.star,
      summary: sanitizedEvaluation.summary || `${scoringResult.verdict} performance in ${roleConfig.roleName} interview.`,
      strengths: Array.isArray(sanitizedEvaluation.strengths) && sanitizedEvaluation.strengths.length > 0
        ? sanitizedEvaluation.strengths
        : personaCoaching.tailoredStrengths,
      weaknesses: Array.isArray(sanitizedEvaluation.weaknesses) && sanitizedEvaluation.weaknesses.length > 0
        ? sanitizedEvaluation.weaknesses
        : ['Elaborate further on quantifiable technical impact.'],
      improvements: Array.isArray(sanitizedEvaluation.improvement_tips)
        ? sanitizedEvaluation.improvement_tips.join(' • ')
        : (sanitizedEvaluation.improvements || personaCoaching.coachingTips.join(' • ')),
      coaching: personaCoaching,
      telemetryDiagnostics,
    };

    // Persist completed evaluation and telemetry diagnostics to database (Defect 090)
    if (body.sessionId && gated.user?.id) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase
          .from('interview_sessions')
          .update({
            status: 'completed',
            overall_score: finalEvaluation.score,
            evaluation: finalEvaluation,
            telemetry_diagnostics: telemetryDiagnostics || null,
            completed_at: new Date().toISOString(),
          })
          .eq('id', body.sessionId)
          .eq('user_id', gated.user.id);
      } catch (dbErr: any) {
        console.warn('[Interview Evaluate] Failed to persist evaluation & telemetry to interview_sessions:', dbErr?.message);
      }
    }

    if (gated.user?.id) {
      completeActiveLiveInterview(gated.user.id);
    }

    const evaluationToken = gated.user?.id
      ? createEvaluationSignature(gated.user.id, finalEvaluation.score, finalEvaluation.verdict)
      : undefined;

    return NextResponse.json({
      evaluation: finalEvaluation,
      evaluationToken,
      success: true,
    });
  } catch (err: any) {
    console.error('[Interview Evaluation Route Error]:', err);
    return NextResponse.json({ error: err.message || 'Server evaluation error' }, { status: 500 });
  }
}
