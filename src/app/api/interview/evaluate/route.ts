import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { sanitizeLLMOutput, sanitizeEvaluationResult } from '@/lib/sanitizeLLM';
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
import { supabase } from '@/lib/supabaseClient';

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
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const body = await req.json();
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
      
      // Defect 091 Fix: Extract comms rating dynamically rather than hardcoding to 80
      let dynamicComms = sysEval.score;
      const oralDefense = body.explanation || body.transcript || (Array.isArray(history) ? history.map((h: any) => h.content).join(' ') : '');
      if (typeof oralDefense === 'string' && oralDefense.trim().length > 0) {
        const lowerDefense = oralDefense.toLowerCase();
        const tradeOffKeywords = ['tradeoff', 'trade-off', 'bottleneck', 'latency', 'scale', 'redundancy', 'failover', 'throughput', 'consistency', 'cache'];
        const matched = tradeOffKeywords.filter(k => lowerDefense.includes(k)).length;
        const lengthBonus = Math.min(20, Math.floor(oralDefense.length / 50));
        dynamicComms = Math.min(95, Math.max(40, 50 + matched * 6 + lengthBonus));
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

    const validArchetypes: MindsetArchetype[] = ['Pattern Hunter', 'Explorer', 'Social IQ', 'Stabilizer'];
    const archetype: MindsetArchetype = validArchetypes.includes(rawArchetype) ? rawArchetype : 'Pattern Hunter';

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

    return NextResponse.json({
      evaluation: finalEvaluation,
      success: true,
    });
  } catch (err: any) {
    console.error('[Interview Evaluation Route Error]:', err);
    return NextResponse.json({ error: err.message || 'Server evaluation error' }, { status: 500 });
  }
}
