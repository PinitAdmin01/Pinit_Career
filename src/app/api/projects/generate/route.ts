import { NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/requireAuth';
import { checkRateLimit, getClientIp } from '@/lib/server/rateLimit';
import { validateBody } from '@/lib/server/validate';
import { z } from 'zod';

const ProjectGenerateSchema = z.object({
  goal: z.string().max(200).optional().default('Full Stack Engineer'),
  skills: z.array(z.string().max(100)).optional().default([]),
  education: z.string().max(200).optional().default(''),
  experienceLevel: z.string().max(100).optional().default(''),
  stream: z.boolean().optional().default(false),
  preview: z.boolean().optional().default(false),
});

import { GeneratedProject, getDomainFallback } from '@/lib/projects/projectCatalog';
export { type GeneratedProject, getDomainFallback };

const XP_MAP: Record<string, number> = {
  'Beginner': 250,
  'Intermediate': 500,
  'Advanced': 750,
  'Enterprise': 1000,
  'Future-Tech': 1500,
};

// LLM generation timeout raised to 25 seconds for reliable ~2,200 token synthesis
export const LLM_GENERATION_TIMEOUT_MS = 25_000;


function streamProjectsResponse(
  projects: GeneratedProject[],
  goal: string,
  isTemplate: boolean,
  source: 'llm' | 'curated_template'
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'start', goal, isTemplate, source })}\n\n`)
        );
        for (let i = 0; i < projects.length; i++) {
          const p = projects[i];
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'project', projectIndex: i, project: p })}\n\n`)
          );
        }
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: 'complete', success: true, goal, isTemplate, source, projects })}\n\n`
          )
        );
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipRl = checkRateLimit(`projects_gen_ip_${ip}`, { limit: 30, windowMs: 3_600_000 });
    if (!ipRl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Too many requests from this IP. Please try again later.' },
        { status: 429 }
      );
    }

    const url = new URL(req.url, 'http://localhost');
    const isPreviewQuery = url.searchParams.get('preview') === 'true';
    const isStreamQuery = url.searchParams.get('stream') === 'true';

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const isPreviewHeader = req.headers.get('x-preview') === 'true';
    const isPreview = isPreviewQuery || isPreviewHeader || Boolean(body.preview);

    const wantsStream =
      isStreamQuery ||
      Boolean(body.stream) ||
      Boolean(body.streaming) ||
      Boolean(req.headers.get('accept')?.includes('text/event-stream'));

    const { data, error } = validateBody(ProjectGenerateSchema, body);
    if (error) return error;

    const goal = (data.goal || '').trim() || 'Full Stack Engineer';
    const skills = (data.skills || []).map((s: string) => s.trim()).filter(Boolean);
    const education = (data.education || '').trim();
    const experienceLevel = (data.experienceLevel || '').trim();

    // Authenticate user to protect against external LLM token drain
    const gated = await requireUserFromRequest(req);
    if (gated.error) {
      // If preview is explicitly permitted, return curated blueprint templates immediately with ZERO LLM spend
      if (isPreview) {
        const fallbackProjects = getDomainFallback(goal, skills, experienceLevel);
        if (wantsStream) {
          return streamProjectsResponse(fallbackProjects, goal, true, 'curated_template');
        }
        return NextResponse.json({
          success: true,
          goal,
          isTemplate: true,
          source: 'curated_template',
          authenticated: false,
          message: 'Curated blueprint preview. Sign in to generate bespoke AI capstone projects.',
          projects: fallbackProjects
        });
      }
      // Otherwise reject with 401 UNAUTHORIZED so unauthenticated visitors cannot trigger spend
      return gated.error;
    }

    const user = gated.user;
    // Per-user rate limiting (10 custom AI generations per hour)
    const userRl = checkRateLimit(`projects_gen_user_${user.id}`, { limit: 10, windowMs: 3_600_000 });
    if (!userRl.allowed) {
      return NextResponse.json(
        { error: 'RATE_LIMIT', message: 'Project generation quota reached (10/hour). Please try again shortly.' },
        { status: 429 }
      );
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const groqKeysStr = process.env.GROQ_API_KEYS || '';
    let groqKeys = groqKeysStr.split(',').map(k => k.trim()).filter(Boolean);
    const singleGroqKey = process.env.GROQ_API_KEY;
    if (singleGroqKey && !groqKeys.includes(singleGroqKey)) {
      groqKeys.push(singleGroqKey);
    }

    const hasKeys = !!openRouterKey || groqKeys.length > 0;

    if (hasKeys) {
      try {
        const systemPrompt = "You are an expert Principal Software Architect and Career Mentor at a top tech company.\n" +
"The candidate has the career goal: " + JSON.stringify(goal) + ".\n" +
"Current skills: " + (skills.length > 0 ? skills.join(', ') : 'Not specified') + ".\n" +
"Education: " + (education || 'Engineering / Computer Science') + ".\n" +
"Experience: " + (experienceLevel || 'Student / Early Career') + ".\n\n" +
"Generate a sequence of EXACTLY 5 progressive capstone projects that will get this candidate hired for this role:\n" +
"1. Beginner (Level: 'Beginner', xpReward: 250)\n" +
"2. Intermediate (Level: 'Intermediate', xpReward: 500)\n" +
"3. Advanced (Level: 'Advanced', xpReward: 750)\n" +
"4. Enterprise (Level: 'Enterprise', xpReward: 1000)\n" +
"5. Future-Tech (Level: 'Future-Tech', xpReward: 1500)\n\n" +
"OUTPUT FORMAT: Return ONLY a valid JSON array of 5 objects matching this schema with NO markdown wrapping, NO commentary:\n" +
"[\n" +
"  {\n" +
"    \"id\": \"proj-1\",\n" +
"    \"name\": \"Project Name\",\n" +
"    \"level\": \"Beginner\",\n" +
"    \"description\": \"2 sentence clear summary\",\n" +
"    \"techStack\": \"Tech1, Tech2, Tech3\",\n" +
"    \"problem\": \"Real-world engineering problem this project solves\",\n" +
"    \"deliverable\": \"Tangible software artifact and output\",\n" +
"    \"xpReward\": 250,\n" +
"    \"status\": \"Not Started\",\n" +
"    \"guideSteps\": [\"Step 1\", \"Step 2\", \"Step 3\", \"Step 4\"],\n" +
"    \"tips\": [\"Tip 1\", \"Tip 2\"],\n" +
"    \"verificationReqs\": [\"Req 1\", \"Req 2\", \"Req 3\", \"Req 4\"],\n" +
"    \"minScore\": 80\n" +
"  }\n" +
"]";

        let rawResponse = '';
        if (openRouterKey) {
          try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              signal: AbortSignal.timeout(LLM_GENERATION_TIMEOUT_MS),
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openRouterKey}`,
                'HTTP-Referer': 'https://pinit-careers.web.app',
                'X-Title': 'Pi Career OS Project Generator'
              },
              body: JSON.stringify({
                model: 'qwen/qwen-2.5-coder-32b-instruct',
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: `Synthesize 5 tailored projects for ${goal}. Focus on real engineering problems.` }
                ],
                temperature: 0.3,
                max_tokens: 2200
              })
            });
            if (res.ok) {
              const data = await res.json();
              rawResponse = (data.choices?.[0]?.message?.content || '').trim();
            }
          } catch (e) {
            console.warn('[Project Generator] OpenRouter failed, trying Groq fallback:', e);
          }
        }

        if (!rawResponse && groqKeys.length > 0) {
          for (const key of groqKeys) {
            try {
              const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                signal: AbortSignal.timeout(LLM_GENERATION_TIMEOUT_MS),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                  model: 'llama-3.3-70b-versatile',
                  messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Synthesize 5 tailored projects for ${goal}. Focus on real engineering problems.` }
                  ],
                  temperature: 0.3,
                  max_tokens: 2200
                })
              });
              if (res.ok) {
                const data = await res.json();
                rawResponse = (data.choices?.[0]?.message?.content || '').trim();
                if (rawResponse) break;
              }
            } catch (e) {
              console.warn('[Project Generator] Groq key attempt failed:', e);
            }
          }
        }

        if (rawResponse) {
          let cleanJson = rawResponse;
          if (cleanJson.includes('```')) {
            cleanJson = cleanJson.replace(/^[\s\S]*?```(?:json)?/i, '');
            cleanJson = cleanJson.replace(/```[\s\S]*$/, '');
          }
          cleanJson = cleanJson.trim();
          const parsed = JSON.parse(cleanJson);
          if (Array.isArray(parsed) && parsed.length === 5) {
            const levels: GeneratedProject['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Enterprise', 'Future-Tech'];
            const validated: GeneratedProject[] = parsed.map((p, idx) => {
              const level = levels[idx];
              return {
                id: `proj-${idx + 1}`,
                name: String(p.name || `Capstone Project ${idx + 1}`),
                level,
                description: String(p.description || 'Project description'),
                techStack: String(p.techStack || 'TypeScript, React, Node.js'),
                problem: String(p.problem || 'Standard engineering challenge'),
                deliverable: String(p.deliverable || 'Production-grade software system'),
                xpReward: XP_MAP[level] || 250,
                status: 'Not Started',
                guideSteps: Array.isArray(p.guideSteps) && p.guideSteps.length > 0
                  ? p.guideSteps.map(String)
                  : ['Initialize repository', 'Build core logic', 'Add tests and documentation', 'Deploy and verify'],
                tips: Array.isArray(p.tips) && p.tips.length > 0
                  ? p.tips.map(String)
                  : ['Keep git commits atomic', 'Add environment configuration template'],
                verificationReqs: Array.isArray(p.verificationReqs) && p.verificationReqs.length > 0
                  ? p.verificationReqs.map(String)
                  : ['Functional test suite passing', 'README architecture documentation'],
                minScore: typeof p.minScore === 'number' ? Math.max(60, Math.min(100, p.minScore)) : 80,
                isTemplate: false,
                source: 'llm' as const
              };
            });

            if (wantsStream) {
              return streamProjectsResponse(validated, goal, false, 'llm');
            }

            return NextResponse.json({
              success: true,
              goal,
              isTemplate: false,
              source: 'llm',
              projects: validated
            });
          }
        }
      } catch (err) {
        console.warn('[Project Generator] LLM synthesis failed, using domain synthesis fallback:', err);
      }
    }

    // Dynamic Domain Synthesis Fallback (honest template labeling)
    const fallbackProjects = getDomainFallback(goal, skills, experienceLevel);

    if (wantsStream) {
      return streamProjectsResponse(fallbackProjects, goal, true, 'curated_template');
    }

    return NextResponse.json({
      success: true,
      goal,
      isTemplate: true,
      source: 'curated_template',
      notice: 'Synthesized from verified industry capstone blueprints.',
      projects: fallbackProjects
    });
  } catch (error: any) {
    console.error('[Project Generator] Error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: error?.message || 'Failed to generate projects' },
      { status: 500 }
    );
  }
}
