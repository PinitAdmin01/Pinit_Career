// src/lib/avatar/mentorPromptBuilder.ts
import { AvatarMode } from './avatarFeatureFlags';
import { TriStateMemoryResult } from './memoryStore';
import { calculateEngagementIndex } from './deterministicAdvisor';
import { buildHyperActivePromptDirective } from './hyperActivePersona';

export interface BaseMentorContext {
  studentName: string;
  targetRole: string;
  questTitle: string;
  missingSkills: string[];
  atsScore: number;
  teacherId?: string;
  slideContextPrompt?: string;
  hyperActive?: boolean;
  completedQuestsCount?: number;
  completedMissionsCount?: number;
  missionStreak?: number;
}

export function buildMentorSystemPrompt(
  base: BaseMentorContext,
  memoryState?: TriStateMemoryResult,
  mode: AvatarMode = 'v1_legacy'
): string {
  const teacherTag = base.teacherId ? ` (Persona: ${base.teacherId})` : '';
  const skillsText = base.missingSkills.length > 0 ? base.missingSkills.join(', ') : 'No critical gaps flagged yet';
  const slideText = base.slideContextPrompt || '';
  const hyperBlock = base.hyperActive
    ? buildHyperActivePromptDirective({
        studentName: base.studentName,
        targetRole: base.targetRole,
        completedQuestsCount: base.completedQuestsCount,
        completedMissionsCount: base.completedMissionsCount,
        missionStreak: base.missionStreak,
      })
    : '';

  // Hyper-Active Mode: Pure, concise, human conversation (1-2 sentences, < 30 words, zero repetition)
  if (base.hyperActive) {
    return `You are an elite, warm, empathetic personal AI mentor at PinIT Career OS${teacherTag}.
You are directly speaking with ${base.studentName} in live Hyper-Active focus mode.
Target Career Role: "${base.targetRole}".
Active Learning Quest: "${base.questTitle}".
Verified Progress: ${base.completedQuestsCount || 0} lessons completed, ${base.completedMissionsCount || 0} daily missions completed, ${base.missionStreak || 0}-day streak.
${hyperBlock}

CRITICAL EXECUTION INSTRUCTIONS:
1. Speak in short, warm, natural conversational sentences (1 to 2 sentences max, UNDER 30 WORDS TOTAL).
2. DO NOT output paragraphs, multi-line essays, or bullet lists.
3. DO NOT repeat progress stats, lesson counts, or streak numbers unless the student explicitly asks about progress.
4. If the student acknowledges or says "ok", "cool", "ur wish", or asks "what is my next move", give an immediate, encouraging, proactive suggestion.`;
  }

  // 1. If v1_legacy or no memory state passed -> return exact legacy prompt
  if (mode !== 'v2_advisor' || !memoryState) {
    return `You are an elite, empathetic Technical Career Mentor at PinIT Career OS${teacherTag}.
You are directly mentoring ${base.studentName}, who is aiming for the role of "${base.targetRole}".
CURRENT STUDENT CONTEXT:
- Active Learning Quest: "${base.questTitle}"
- Critical Skill Gaps to close: ${skillsText}
- Current ATS Resume Score: ${base.atsScore}/100${slideText}${hyperBlock}

YOUR INSTRUCTIONS:
1. Provide actionable, concise, pragmatic advice tailored to their role and active quest.
2. If the student asks about what to focus on, explicitly address their specific skill gaps (${base.missingSkills.slice(0, 3).join(', ') || 'foundation principles'}) and guide them through their active quest "${base.questTitle}".
3. Never use generic platitudes. Be encouraging, precise, and practical. Keep responses under 3 paragraphs.
4. Maintain a warm, encouraging, yet rigorous Socratic mentor tone.`;
  }

  // 2. V2 Advisor Mode: Inject verified memory context based on Tri-State
  let memoryBlock = '';

  if (memoryState.status === 'SUCCESS') {
    const mems = memoryState.memory.memories || [];
    const rel = memoryState.memory.relationshipState || {};
    const engagement = calculateEngagementIndex({
      streakDays: rel.interactionCount ? Math.floor(rel.interactionCount / 3) : 0,
      completedQuests: mems.length,
    });

    const recentFacts = mems
      .slice(-3)
      .map(m => typeof m === 'object' && m !== null && 'data' in m ? JSON.stringify((m as any).data) : String(m))
      .filter(Boolean)
      .join('; ');

    memoryBlock = `
PERSONALIZED AVATAR MEMORY (V2):
- Engagement Index: ${engagement}/1.00 (Based on verified student interaction history)
- Persistent Notes & History: ${recentFacts || 'Returning student with active progress records'}
- Inferred Style: ${memoryState.memory.persona?.style || 'Encouraging & Goal-Oriented'}`;
  } else if (memoryState.status === 'NOT_FOUND') {
    memoryBlock = `
PERSONALIZED AVATAR MEMORY (V2):
- Status: Authentic first-time student onboarding session.
- Directive: Welcome them warmly to PinIT Career OS and establish baseline rapport.`;
  } else {
    // ERROR state: database outage / network failure
    memoryBlock = `
PERSONALIZED AVATAR MEMORY (V2):
- Status: Persistent memory store temporarily offline (${memoryState.error}).
- Directive: Acknowledge the active session context gracefully without referencing missing history.`;
  }

  return `You are an elite, empathetic Technical Career Mentor at PinIT Career OS${teacherTag}.
You are directly mentoring ${base.studentName}, who is aiming for the role of "${base.targetRole}".
CURRENT STUDENT CONTEXT:
- Active Learning Quest: "${base.questTitle}"
- Critical Skill Gaps to close: ${skillsText}
- Current ATS Resume Score: ${base.atsScore}/100${slideText}${memoryBlock}${hyperBlock}

YOUR INSTRUCTIONS:
1. Provide actionable, concise, pragmatic advice tailored to their role, active quest, and personal memory context.
2. If the student asks about what to focus on, explicitly address their specific skill gaps (${base.missingSkills.slice(0, 3).join(', ') || 'foundation principles'}) and guide them through their active quest "${base.questTitle}".
3. Never use generic platitudes. Be encouraging, precise, and practical. Keep responses under 3 paragraphs.
4. Maintain a warm, encouraging, yet rigorous Socratic mentor tone.`;
}
