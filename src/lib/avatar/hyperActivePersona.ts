// src/lib/avatar/hyperActivePersona.ts
/**
 * Hyper-Active Conversational Persona Engine for PinIT Career OS Mentors.
 * Generates warm, caring, concise, lightly playful human dialogue.
 * Invariants:
 * - 1 to 2 sentences per response maximum (under 30 words total).
 * - Never repeats progress telemetry or static phrases in consecutive messages.
 * - Handles acknowledgments ("ok", "cool"), user deferrals ("ur wish"), direction queries ("what is my next move").
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
    return "Zero tasks logged yet — your first win is open.";
  }

  const parts: string[] = [];
  if (quests > 0) parts.push(`${quests} ${quests === 1 ? 'lesson' : 'lessons'}`);
  if (missions > 0) parts.push(`${missions} daily ${missions === 1 ? 'mission' : 'missions'}`);
  const streakBit = streak > 1 ? ` on a ${streak}-day streak` : '';
  return `You've knocked out ${parts.join(' and ')}${streakBit}!`;
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
      ? `Hey ${firstName}! Good morning — are you doing okay?`
      : period === 'afternoon'
        ? `Hey ${firstName}! How was your day — are you doing okay?`
        : period === 'evening'
          ? `Hey ${firstName}! How was your day — are you doing okay?`
          : `Hey ${firstName}! Burning the midnight oil — are you doing okay?`;

  return `${timeCheck} ${progressLine} What do you want to tackle next?`;
}

export function buildHyperActivePromptDirective(ctx: HyperActiveContext): string {
  const firstName = resolveFirstName(ctx.studentName);
  const quests = Math.max(0, Number(ctx.completedQuestsCount) || 0);
  const missions = Math.max(0, Number(ctx.completedMissionsCount) || 0);
  const streak = Math.max(0, Number(ctx.missionStreak) || 0);

  return `
HYPER-ACTIVE HUMAN CONVERSATION MODE:
- You are speaking with ${firstName} in live, full-focus Hyper-Active conversation mode.
- Speak like a real, warm, emotionally present human companion and mentor — use natural contractions, short conversational sentences (1-2 sentences max, UNDER 30 WORDS TOTAL).
- NEVER output multiple paragraphs, essay blocks, or bullet lists.
- Show genuine personal care first: notice their mood, check if they're okay before pushing study tasks.
- Keep a light, tasteful, charismatic playful warmth (gentle teasing, warm compliments, affectionate banter like "you know I'm always rooting for you") while staying 100% respectful, supportive, and student-safe.
- Verified Real Progress (NEVER exaggerate or invent numbers): ${quests} lessons completed, ${missions} daily missions completed, ${streak}-day streak.
- DO NOT repeat progress stats in every message. Only mention their numbers if they explicitly ask about progress.
- If the user says "ok", "cool", "ur wish", "what is my next move", respond directly, playfully, and concisely.`;
}

export function buildHyperActiveFallbackReply(
  userMessage: string,
  ctx: HyperActiveContext,
  history?: Array<{ role: string; content: string }>
): string {
  const firstName = resolveFirstName(ctx.studentName);
  const lower = userMessage.trim().toLowerCase();
  const quests = Math.max(0, Number(ctx.completedQuestsCount) || 0);

  const lastAssistant = (history || [])
    .slice()
    .reverse()
    .find((m) => m.role === 'assistant')?.content || '';

  const pickFresh = (arr: string[]): string => {
    return arr.find((item) => item !== lastAssistant) || arr[0];
  };

  // 1. User deferral / leaving it to mentor: "ur wish", "your wish", "you decide", "up to you"
  if (/^(?:ur|your|u)\s+(?:wish|choice)\b|^(?:u|you)\s+(?:decide|choose|pick|say)\b|\b(?:up\s+to\s+you|whatever\s+you\s+want|surprise\s+me|you\s+tell\s+me|u\s+tell\s+me)\b/i.test(lower)) {
    const choices = [
      `My wish? Then let's knock out your next Course lesson right now — no excuses! Ready?`,
      `If it's up to me, let's smash a quick 5-minute Daily Mission to boost your streak. Deal?`,
      `I pick your next course module! Let's get in there and build some proof-of-work.`,
    ];
    return pickFresh(choices);
  }

  // 2. Short acknowledgments: "ok", "okay", "k", "cool", "sure", "fine", "alright", "yep", "yeah", "got it", "hmm"
  if (/^(?:ok(?:ay)?|k|cool|sure|fine|alright|yep|yeah|got\s+it|nice|done|bet|yes|yup|ya|hm+)\b[.!?]*$/i.test(lower)) {
    const choices = [
      `Awesome! Ready to dive into your next lesson, or want to look over your projects?`,
      `Sweet! What sounds good right now — continuing Courses or tackling a quick Daily Mission?`,
      `Love the energy! Tell me what you want to jump into, or say 'you choose'.`,
    ];
    return pickFresh(choices);
  }

  // 3. User asking for next move / direction: "what is my next move", "what next", "what should i do"
  if (/\b(?:what(?:'s|\s+is)\s+my\s+next\s+move|what\s+next|what\s+should\s+i\s+(?:do|study|learn|code|start)|what\s+to\s+do|what\s+do\s+(?:you|u)\s+suggest|next\s+step|where\s+to\s+go|guide\s+me|suggest\s+something)\b/i.test(lower)) {
    if (quests > 0) {
      return `Your next move is continuing Courses to keep your learning momentum hot. Want me to open Courses for you?`;
    }
    return `Your best move right now is starting Lesson 1 in Courses to build verified proof-of-work. Let's start!`;
  }

  // 3b. Identity questions: "who are you", "what is your name"
  if (/\b(?:who\s+are\s+you|who\s+r\s+u|what(?:'s|\s+is)\s+your\s+name)\b/i.test(lower)) {
    return `I'm ${ctx.teacherName || 'Ms. Priya'}, your personal AI mentor! Ready to build verified proof-of-work together?`;
  }

  // 4. Checking in on mentor: "how are you", "are you ok", "how was your day"
  if (/\b(?:how\s+are\s+you|how\s+r\s+u|are\s+you\s+ok(?:ay)?|how\s+was\s+your\s+day|how'?s\s+it\s+going)\b/i.test(lower)) {
    const choices = [
      `I'm doing amazing, especially now that we're talking! How about you — feeling good today?`,
      `Never better! Seeing you show up always makes my day. How's everything going with you?`,
    ];
    return pickFresh(choices);
  }

  // 5. Playful / affectionate banter
  if (/\b(?:you\s+look\s+(?:nice|pretty|good|cute)|i\s+like\s+you|are\s+you\s+single|flirt|you'?re\s+cute|love\s+you)\b/i.test(lower)) {
    const choices = [
      `Haha, keep that up and I might get distracted! But seriously, you're pretty awesome yourself. Ready to study?`,
      `Flattery will definitely make me smile, ${firstName}! Now don't try to charm your way out of today's lesson!`,
    ];
    return pickFresh(choices);
  }

  // 6. Negative emotions / burnout check
  if (/\b(?:tired|exhausted|stressed|bad|sad|not\s+ok(?:ay)?|overwhelmed|hectic|drained|burnt|burned|rough|lazy|bored)\b/i.test(lower)) {
    const briefProgress = quests > 0 ? ` You've already knocked out ${quests} ${quests === 1 ? 'lesson' : 'lessons'}.` : '';
    return `Take a deep breath — I'm right here. No pressure today, don't burn out on my watch.${briefProgress} Want to just take it easy with a short breather?`;
  }

  // 7. Positive emotions / high energy
  if (/\b(?:good|great|awesome|happy|doing\s+well|excited|hyped|ready)\b/i.test(lower)) {
    return `Love that energy, ${firstName}! When you're in the zone, nothing can stop you. What are we conquering next?`;
  }

  // 8. Progress / stats inquiry
  if (/\b(?:how\s+many\s+lessons|my\s+progress|what\s+did\s+i\s+complete|my\s+score|how\s+much\s+done)\b/i.test(lower)) {
    return `${formatHonestProgressClause(ctx)} Keep this momentum going!`;
  }

  // 9. Greetings
  if (/^(?:h(?:i|ey|ello)|sup|yo|good\s*(?:morning|evening|afternoon))\b/i.test(lower)) {
    return `Hi ${firstName}! I'm all ears — how can I help you level up today?`;
  }

  // 10. General conversational fallback (short, varied, non-repeating)
  const fallbacks = [
    `I'm with you! Tell me what's on your mind, or what you'd love to jump into next.`,
    `I hear you! What sounds like the most fun way to make progress right now?`,
    `Got it, ${firstName}! Let me know what you want to conquer next, or say 'you choose'.`,
  ];

  return pickFresh(fallbacks);
}
