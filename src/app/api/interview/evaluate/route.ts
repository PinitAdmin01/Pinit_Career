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

export async function POST(req: Request) {
  try {
    const gated = await requireUserFromRequest(req);
    if (gated.error) return gated.error;

    const {
      history = [],
      codingScore,
      telemetry,
      domainStream,
      domainSubTopic,
      roleKey: rawRoleKey,
      archetype: rawArchetype,
    } = await req.json();

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

    const groqKey = process.env.GROQ_API_KEY || (process.env.GROQ_API_KEYS || '').split(',')[0]?.trim();
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    let rawParsedEval: any = null;

    if (groqKey) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Candidate Transcript:\n\n${formatted.slice(0, 7000)}` },
            ],
            max_tokens: 800,
            temperature: 0.2,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          rawParsedEval = JSON.parse(cleanJsonStr);
        }
      } catch (e) {
        console.warn('[Interview Evaluator] Groq evaluation request error:', e);
      }
    }

    if (!rawParsedEval && openRouterKey) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openRouterKey}`,
          },
          body: JSON.stringify({
            model: 'meta-llama/llama-3.1-8b-instruct:free',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Candidate Transcript:\n\n${formatted.slice(0, 7000)}` },
            ],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const raw = (data.choices?.[0]?.message?.content || '').trim();
          const cleanJsonStr = raw.replace(/```json|```/g, '').trim();
          rawParsedEval = JSON.parse(cleanJsonStr);
        }
      } catch (e) {
        console.warn('[Interview Evaluator] OpenRouter evaluation request error:', e);
      }
    }

    // Fail-Safe Fallback Dimensions if LLM service is offline or unparseable
    if (!rawParsedEval) {
      const fallbackSolving = typeof codingScore === 'number' ? clampScore(codingScore, 70) : 65;
      rawParsedEval = {
        logic: clampScore(fallbackSolving * 0.95, 68),
        systems: 65,
        comms: 70,
        solving: fallbackSolving,
        star: 65,
        strengths: [`Demonstrated core engagement for ${topic}`, 'Structured response attempt'],
        weaknesses: ['Live AI evaluation service was unreachable; baseline heuristic applied'],
        improvement_tips: [`Deepen concrete problem-solving metrics for ${roleConfig.roleName}`, 'Use structured STAR format'],
        summary: `Candidate completed the interview session for ${topic}. Evaluated under baseline ${roleConfig.roleName} rubric.`,
      };
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

    // Telemetry Practice Diagnostics (Purely advisory; does NOT alter score)
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

    return NextResponse.json({
      evaluation: finalEvaluation,
      success: true,
    });
  } catch (err: any) {
    console.error('[Interview Evaluation Route Error]:', err);
    return NextResponse.json({ error: err.message || 'Server evaluation error' }, { status: 500 });
  }
}
