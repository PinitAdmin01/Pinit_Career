/**
 * Avatar Dialogue Engine
 * Connects client-side avatar mentor widgets to the contextual AI mentor API.
 * Replaces the rigid 5-keyword switch with dynamic Socratic guidance seeded with
 * student-specific context (targetRole, activeQuest, missingSkills, atsScore).
 */

export interface StudentMentorContext {
  studentName?: string;
  targetRole?: string;
  activeQuest?: string | { title?: string; id?: string; progress?: number };
  missingSkills?: string[];
  weakAreas?: string[];
  atsScore?: number;
  trustScore?: number;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface DialogueResponse {
  ok: boolean;
  reply: string;
  context?: Partial<StudentMentorContext>;
  suggestedPrompts?: string[];
  error?: string;
  simulated?: boolean;
}

export function generateContextualGreeting(context: StudentMentorContext): string {
  const name = context.studentName || 'there';
  const role = context.targetRole || 'Software Engineer';
  const questTitle = typeof context.activeQuest === 'object' && context.activeQuest !== null
    ? context.activeQuest.title
    : context.activeQuest;

  const gaps = (context.missingSkills || context.weakAreas || []).filter(Boolean);

  if (questTitle && gaps.length > 0) {
    return `Hi ${name}! As you prepare for ${role}, we're tackling "${questTitle}". Focusing on ${gaps[0]} will give you the biggest competitive edge today.`;
  }

  if (questTitle) {
    return `Hi ${name}! Ready to make progress on "${questTitle}" towards your ${role} career path?`;
  }

  if (gaps.length > 0) {
    return `Hi ${name}! Working on closing your gaps in ${gaps.slice(0, 2).join(' and ')} will boost your ${role} readiness.`;
  }

  return `Hello ${name}! I am your AI career mentor for ${role}. What technical challenge or interview topic are we working on?`;
}

export function generateMentorQuickPrompts(context: StudentMentorContext): string[] {
  const role = context.targetRole || 'Software Engineer';
  const questTitle = typeof context.activeQuest === 'object' && context.activeQuest !== null
    ? context.activeQuest.title
    : context.activeQuest;
  const gaps = (context.missingSkills || context.weakAreas || []).filter(Boolean);
  const score = context.atsScore ?? 65;

  const prompts: string[] = [];

  if (gaps.length > 0) {
    prompts.push(`How do I practice and close my gap in ${gaps[0]}?`);
  }
  if (questTitle) {
    prompts.push(`What key trade-offs should I understand in "${questTitle}"?`);
  }
  prompts.push(`How can I raise my profile score from ${score}/100?`);
  prompts.push(`What system design questions are most common for ${role}?`);

  return prompts.slice(0, 4);
}

export async function askMentorAvatar(
  query: string,
  context: StudentMentorContext = {}
): Promise<DialogueResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      ok: false,
      reply: 'Please provide a question or topic for discussion.',
      error: 'EMPTY_QUERY',
    };
  }

  try {
    const res = await fetch('/api/mentor/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: trimmed,
        message: trimmed,
        studentName: context.studentName,
        targetRole: context.targetRole,
        activeQuest: context.activeQuest,
        missingSkills: context.missingSkills,
        careerContext: {
          ats_score: context.atsScore,
          trust_score: context.trustScore,
        },
        history: context.history || [],
      }),
    });

    if (!res.ok) {
      throw new Error(`Mentor chat returned status ${res.status}`);
    }

    const data = await res.json();
    return {
      ok: true,
      reply: data.reply || 'Let us explore that together.',
      context: data.context || context,
      suggestedPrompts: generateMentorQuickPrompts({ ...context, ...(data.context || {}) }),
      simulated: data.simulated === true,
    };
  } catch (err: any) {
    // Graceful offline fallback maintaining student context
    const studentName = context.studentName || 'there';
    const role = context.targetRole || 'Software Engineer';
    const gaps = (context.missingSkills || []).slice(0, 2);
    const gapsText = gaps.length > 0 ? ` especially around ${gaps.join(' and ')}` : '';

    return {
      ok: true,
      reply: `I heard you, ${studentName}. For your ${role} path, let's keep sharpening your core competencies${gapsText}. Can you walk me through your technical approach to this?`,
      context,
      suggestedPrompts: generateMentorQuickPrompts(context),
      error: err?.message,
      simulated: true,
    };
  }
}
