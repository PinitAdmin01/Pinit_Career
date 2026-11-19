// src/lib/avatar/hyperActivePersona.ts
/**
 * Hyper-Active Conversational Persona Engine for PinIT Career OS Mentors.
 * Generates warm, caring, lightly playful, human-sounding check-ins grounded
 * strictly in the student's real progress telemetry (zero hallucinated stats).
 */

export interface HyperActiveContext {
  studentName?: string;
  teacherName?: string;
  targetRole?: string;
  completedQuestsCount?: number;
  completedMissionsCount?: number;
  missionStreak?: number;
  careerScore?: number;
}

function resolveFirstName(rawName?: string): string {
  const cleaned = (rawName || '').trim();
  if (!cleaned || /^candidate$/i.test(cleaned)) return 'there';
  const first = cleaned.split(/\s+/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function getTimeOfDayGreeting(now: Date): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = now.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

export function formatHonestProgressClause(ctx: HyperActiveContext): string {
  const quests = Math.max(0, Number(ctx.completedQuestsCount) || 0);
  const missions = Math.max(0, Number(ctx.completedMissionsCount) || 0);
  const streak = Math.max(0, Number(ctx.missionStreak) || 0);
  const totalTasks = quests + missions;

  if (totalTasks === 0) {
    return "You've got a clean slate so far — zero tasks logged yet, which means your very first win is wide open.";
  }

  const parts: string[] = [];
  if (quests > 0) parts.push(`${quests} ${quests === 1 ? 'lesson' : 'lessons'}`);
  if (missions > 0) parts.push(`${missions} daily ${missions === 1 ? 'mission' : 'missions'}`);
  const streakBit = streak > 1 ? ` on a ${streak}-day streak` : '';
  return `You've already knocked out ${parts.join(' and ')}${streakBit} — seriously proud of that momentum.`;
}

export function buildHyperActiveGreeting(
  ctx: HyperActiveContext,
  now: Date = new Date(),
  variantIndex?: number
): string {
  const firstName = resolveFirstName(ctx.studentName);
  const period = getTimeOfDayGreeting(now);
  const progressLine = formatHonestProgressClause(ctx);

  const timeCheck =
    period === 'morning'
      ? `Hey ${firstName}! Good morning — how are you feeling today, did you get enough rest?`
      : period === 'afternoon'
        ? `Hey ${firstName}! How's your day treating you so far — are you doing okay?`
        : period === 'evening'
          ? `Hey ${firstName}! How was your day — are you doing okay, or did today try to drain you?`
          : `Hey ${firstName}, burning the midnight oil? First tell me — how are you doing, are you okay?`;

  const playfulLines = [
    "Not gonna lie, you know I drop everything the second you say we need to talk, right?",
    "Honestly, I was kind of hoping you'd call me over — everything gets way more fun when it's just us chatting.",
    "You've got my full, undivided attention now — fair warning, I might tease you if you've been skipping breaks.",
  ];

  const idx =
    typeof variantIndex === 'number'
      ? Math.abs(variantIndex) % playfulLines.length
      : (now.getMinutes() + firstName.length) % playfulLines.length;

  return `${timeCheck} ${playfulLines[idx]} ${progressLine} Tell me how you're really doing first, and whenever you're ready, what do you want to tackle next?`;
}

export function buildHyperActivePromptDirective(ctx: HyperActiveContext): string {
  const firstName = resolveFirstName(ctx.studentName);
  const quests = Math.max(0, Number(ctx.completedQuestsCount) || 0);
  const missions = Math.max(0, Number(ctx.completedMissionsCount) || 0);
  const streak = Math.max(0, Number(ctx.missionStreak) || 0);

  return `
HYPER-ACTIVE HUMAN CONVERSATION MODE:
- You are speaking with ${firstName} in live, full-focus Hyper-Active conversation mode.
- Speak like a real, warm, emotionally present human companion and mentor — use natural contractions, short conversational paragraphs (2-4 sentences max), and zero robotic bullet-point dumps unless they specifically ask for a list.
- Show genuine personal care first: notice their mood, ask how their day is going, check if they're okay, hydrated, or stressed before pushing study tasks.
- Keep a light, tasteful, charismatic playful warmth (gentle teasing, warm compliments, affectionate banter like "you know I'm always rooting for you" or "look at you showing up looking unstoppable") while staying 100% respectful, supportive, and student-safe.
- Verified Real Progress (NEVER exaggerate or invent numbers): ${quests} lessons completed, ${missions} daily missions completed, ${streak}-day streak.
- Naturally weave in their real progress when relevant and ask what they'd love to do next (e.g., an easy quick win, next lesson, mock interview, or just talking for a minute).`;
}

export function buildHyperActiveFallbackReply(
  userMessage: string,
  ctx: HyperActiveContext
): string {
  const firstName = resolveFirstName(ctx.studentName);
  const lower = userMessage.toLowerCase();
  const progressLine = formatHonestProgressClause(ctx);

  if (/\b(tired|exhausted|stressed|bad|sad|not\s+ok|not\s+okay|overwhelmed|hectic|drained|burnt|burned|rough)\b/i.test(lower)) {
    return `Hey ${firstName}, I'm really glad you told me honestly — breathe for a second, okay? Even the sharpest engineers need a reset, and I'm not letting you burn out on my watch. ${progressLine} Want to just take it easy with one tiny 5-minute win, or tell me what made today rough?`;
  }

  if (/\b(good|great|awesome|fine|amazing|happy|doing\s+well|i'?m\s+ok|i'?m\s+okay)\b/i.test(lower)) {
    return `Okay, love hearing that energy from you, ${firstName} — honestly makes my whole screen brighter. ${progressLine} Since you're in a good headspace, what sounds fun next: crushing a quick Daily Mission, jumping into your next Course lesson, or letting me quiz you?`;
  }

  if (/^(?:h(?:i|ey|ello)|how\s+are\s+you|how'?s\s+it\s+going|sup|yo)\b/i.test(lower)) {
    return `Hi ${firstName}! I'm way better now that you're actually talking to me. How was your day — are you doing okay? ${progressLine} What do you feel like doing next?`;
  }

  if (/\b(next|what\s+should|plan|study|task|lesson|mission|project|quiz)\b/i.test(lower)) {
    const quests = Math.max(0, Number(ctx.completedQuestsCount) || 0);
    const suggestion =
      quests === 0
        ? "starting Lesson 1 in Courses or knocking out one quick Daily Mission to spark your streak"
        : `building on your ${quests} completed ${quests === 1 ? 'lesson' : 'lessons'} with the next module or a quick Daily Mission`;
    return `${progressLine} Honestly, ${firstName}, I'd vote for ${suggestion} — and I'll stay right here cheering you on (and maybe teasing you if you overthink it). Sound like a plan, or want to pick something else?`;
  }

  return `I hear you, ${firstName} — and honestly I love that you came straight to me with that. How are you feeling overall today? ${progressLine} Whenever you're ready, tell me what you'd like to tackle next and we'll knock it out together.`;
}
