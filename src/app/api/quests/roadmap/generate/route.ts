import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { generateDynamicStudentRoadmap } from '@/lib/data/roadmapFuser';
import { COURSES_REGISTRY } from '@/lib/data/coursesData';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`roadmap_gen_${ip}`, { limit: 20, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many roadmap generation requests. Please wait a minute.' },
        { status: 429, headers: { 'Retry-After': String(rl.resetSec) } }
      );
    }

    const authCheck = await requireUserFromRequest(req);
    if (authCheck.error) return authCheck.error;

    const body = await req.json().catch(() => ({}));
    const {
      goal = 'Full-Stack Software Engineer',
      courseId = 'cs-core',
      durationDays = 30,
      dailyPace = 3,
      archetype = 'Pattern Hunter',
      qt1 = 40,
      qt2 = 40,
    } = body;

    const matchedCourse = COURSES_REGISTRY.find(c => c.id === courseId) || COURSES_REGISTRY[0];
    const baseModules = generateDynamicStudentRoadmap({
      qt1,
      qt2,
      archetype,
      goal,
      courseId: matchedCourse.id,
      durationDays,
      dailyPace,
    });

    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    if (process.env.GROQ_API_KEY && !groqKeys.includes(process.env.GROQ_API_KEY)) {
      groqKeys.push(process.env.GROQ_API_KEY);
    }

    let source: 'llm' | 'curated_template' = 'curated_template';
    let personalizedModules = baseModules;

    if (groqKeys.length > 0 && goal) {
      for (const key of groqKeys) {
        try {
          const prompt = `You are a Principal Curriculum Architect.
The student has set a customized career goal: "${goal}".
Target Duration: ${durationDays} days. Daily Pace: ${dailyPace} quests/day.
Academic Track: ${matchedCourse.title}. Archetype: ${archetype}.

Here are the base module titles:
${baseModules.map((m, i) => `${i + 1}. ${m.title}`).join('\n')}

For each module, provide a concise, tailored title and 1-sentence description that directly bridges ${matchedCourse.title} concepts to the student's specific goal of "${goal}".
Return ONLY a valid JSON array of objects with keys: "index" (1-based integer), "tailoredTitle" (string), "tailoredDesc" (string).`;

          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: 'llama-3.1-8b-instant',
              messages: [
                { role: 'system', content: 'You are an expert curriculum designer. Output only JSON.' },
                { role: 'user', content: prompt }
              ],
              temperature: 0.4,
              max_tokens: 800,
            }),
            signal: AbortSignal.timeout(6000),
          });

          if (res.ok) {
            const data = await res.json();
            let rawContent = data.choices?.[0]?.message?.content || '';
            if (rawContent.includes('```')) {
              rawContent = rawContent.replace(/^[\s\S]*?```(?:json)?/i, '').replace(/```[\s\S]*$/, '').trim();
            }
            const parsed = JSON.parse(rawContent);
            if (Array.isArray(parsed) && parsed.length > 0) {
              personalizedModules = baseModules.map((m, idx) => {
                const match = parsed.find((p: any) => p.index === idx + 1);
                if (match?.tailoredTitle) {
                  return {
                    ...m,
                    title: match.tailoredTitle,
                    desc: match.tailoredDesc || m.desc,
                    knowledgeAdaptationTag: `AI Customized for: ${goal}`,
                  };
                }
                return m;
              });
              source = 'llm';
              break;
            }
          }
        } catch {
          // Fall back gracefully to base curriculum fuser
        }
      }
    }

    return NextResponse.json({
      success: true,
      source,
      goal,
      durationDays,
      dailyPace,
      courseId: matchedCourse.id,
      modules: personalizedModules,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'ROADMAP_GEN_ERROR', message: err?.message || 'Failed to synthesize roadmap' },
      { status: 500 }
    );
  }
}
