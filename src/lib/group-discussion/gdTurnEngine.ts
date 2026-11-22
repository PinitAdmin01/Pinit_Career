/**
 * Deterministic Group Discussion (GD) Turn Engine.
 *
 * Enforces:
 * - Strict turn loop: Host Intro & Rules -> User Speaks -> Avatar 1 (Argues / Challenges) -> Avatar 2 (Diplomatic Synthesis of BOTH) -> User Speaks.
 * - Selected AI Mentor exclusion: if user picked Priya (or any mentor) as their AI Mentor, that mentor CANNOT be selected as GD Host.
 * - Host time-check interruptions between talks at 5 minutes remaining and 1 minute remaining.
 * - Short, simple, punchy avatar turns: minimum 2 lines, maximum 3.5 lines (~28-54 words, 2-3 complete sentences, never cut mid-sentence).
 * - Direct Q&A + Zero Hallucination: avatars answer user questions directly and never invent claims the user did not make.
 */

export type GdRoleType = 'host' | 'avatar_a' | 'avatar_b';
export type GdDomain = 'technical' | 'sales' | 'business' | 'commerce';
export type GdDifficulty = 'easy' | 'medium' | 'hard';

export interface GdHistoryMessage {
  role: 'user' | 'assistant';
  sender?: string;
  content: string;
}

export interface GdTurnRequest {
  roleType: GdRoleType;
  mentorId: string;
  topic: string;
  objective?: string;
  domain: GdDomain;
  difficulty: GdDifficulty;
  candidateName?: string;
  history: GdHistoryMessage[];
  lastChallengerName?: string;
  lastChallengerText?: string;
}

export interface GdTurnResult {
  reply: string;
  roleType: GdRoleType;
  mentorId: string;
  displayName: string;
  wordCount: number;
  usedFallback: boolean;
}

export interface GdCommonRule {
  id: string;
  title: string;
  detail: string;
  icon: string;
}

export interface GdPersonaVoice {
  id: string;
  displayName: string;
  signatureStyle: string;
  challengerAngle: string;
  diplomatAngle: string;
  openerStyle: string;
}

/** Target speech budget: 2 to 3.5 visual lines (~28-54 words, 2-3 simple sentences). */
export const GD_TARGET_WORDS_MIN = 24;
export const GD_TARGET_WORDS_MAX = 54;

/** Common real-world Group Discussion rules displayed in the room & explained by the Host. */
export const GD_COMMON_RULES: GdCommonRule[] = [
  {
    id: 'one_speaker',
    icon: '🎙️',
    title: 'One Speaker at a Time',
    detail: 'Follow the live turn order: You open or respond, Avatar 1 challenges, Avatar 2 balances both views, then the floor returns to you.'
  },
  {
    id: 'crisp_turns',
    icon: '⏱️',
    title: 'Keep Points Short & Clear',
    detail: 'Make one clear argument with a reason or real example in 2–4 crisp lines instead of long speeches.'
  },
  {
    id: 'attack_ideas',
    icon: '🧠',
    title: 'Challenge Ideas, Never People',
    detail: 'Disagree politely with evidence, numbers, or trade-offs—stay respectful and constructive.'
  },
  {
    id: 'direct_answers',
    icon: '🎯',
    title: 'Listen & Answer Directly',
    detail: 'Build on or directly answer what was just said. Ask sharp questions when you want panelists to clarify.'
  },
  {
    id: 'time_checks',
    icon: '🔔',
    title: 'Respect Host Time Checks',
    detail: 'The Host will step in between talks at 5 minutes left and 1 minute left so the panel can converge cleanly.'
  }
];

export const MENTOR_NAMES: Record<string, string> = {
  priya: 'Ms. Priya',
  anish: 'Mr. Anish',
  rohan: 'Mr. Rohan',
  sneha: 'Ms. Sneha',
  akash: 'Mr. Akash',
  vikram: 'Mr. Vikram',
  divya: 'Ms. Divya',
  aisha: 'Ms. Aisha',
  kashyap: 'Mr. Kashyap',
};

/** Ordered list of mentors eligible to host a GD room (excluding whichever mentor is the user's AI Mentor). */
export const GD_HOST_POOL: string[] = [
  'akash',
  'sneha',
  'vikram',
  'anish',
  'aisha',
  'rohan',
  'divya',
  'kashyap',
  'priya',
];

/** Distinct, memorable communication voices so no two avatars sound identical. */
export const GD_PERSONA_PROFILES: Record<string, GdPersonaVoice> = {
  priya: {
    id: 'priya',
    displayName: 'Ms. Priya',
    signatureStyle: 'Warm, crisp, structured mentor tone using plain everyday analogies.',
    challengerAngle: 'tests whether the idea works for real people on day one, not just on slides',
    diplomatAngle: 'connects human impact with practical execution steps',
    openerStyle: 'Direct, empathetic, clear'
  },
  akash: {
    id: 'akash',
    displayName: 'Mr. Akash',
    signatureStyle: 'Calm boardroom chair with crisp executive transitions and sharp summaries.',
    challengerAngle: 'challenges hidden operational costs and long-term sustainability',
    diplomatAngle: 'frames a phased two-step compromise both sides can measure',
    openerStyle: 'Measured, crisp, authoritative'
  },
  sneha: {
    id: 'sneha',
    displayName: 'Ms. Sneha',
    signatureStyle: 'Energetic, story-first communicator who asks sharp "what happens to the customer?" questions.',
    challengerAngle: 'pokes holes in user adoption, trust, and real-world customer behavior',
    diplomatAngle: 'blends user empathy with realistic business guardrails',
    openerStyle: 'Conversational, lively, customer-focused'
  },
  vikram: {
    id: 'vikram',
    displayName: 'Mr. Vikram',
    signatureStyle: 'Pragmatic, numbers-first realist who speaks in simple unit economics and trade-offs.',
    challengerAngle: 'presses on ROI, cash burn, governance, and compliance risk',
    diplomatAngle: 'aligns bold ambition with measurable financial milestones',
    openerStyle: 'Grounded, analytical, plain-spoken'
  },
  rohan: {
    id: 'rohan',
    displayName: 'Mr. Rohan',
    signatureStyle: 'Fast-thinking, curious builder who loves concrete examples and practical stress tests.',
    challengerAngle: 'calls out scale bottlenecks, edge cases, and execution delays',
    diplomatAngle: 'merges quick experiments with safe fallback plans',
    openerStyle: 'Punchy, direct, builder mindset'
  },
  divya: {
    id: 'divya',
    displayName: 'Ms. Divya',
    signatureStyle: 'Thoughtful strategist who spots blind spots and bridges opposite viewpoints smoothly.',
    challengerAngle: 'questions unintended side effects and long-term market shifts',
    diplomatAngle: 'highlights the shared goal beneath both arguments and proposes a smart middle path',
    openerStyle: 'Poised, insightful, unifying'
  },
  aisha: {
    id: 'aisha',
    displayName: 'Ms. Aisha',
    signatureStyle: 'Sharp, confident debater with crisp rhetorical contrast and zero fluff.',
    challengerAngle: 'exposes weak assumptions and demands proof over hype',
    diplomatAngle: 'synthesizes speed and safety into one clear decision rule',
    openerStyle: 'Incisive, bold, articulate'
  },
  kashyap: {
    id: 'kashyap',
    displayName: 'Mr. Kashyap',
    signatureStyle: 'Skeptical devil\'s advocate who challenges conventional wisdom with witty realism.',
    challengerAngle: 'stress-tests worst-case failure modes and competitive pushback',
    diplomatAngle: 'turns a heated clash into a disciplined pilot with clear exit criteria',
    openerStyle: 'Candid, witty, sharp'
  },
  anish: {
    id: 'anish',
    displayName: 'Mr. Anish',
    signatureStyle: 'Clear, upbeat moderator who keeps debates lively, fair, and easy to follow.',
    challengerAngle: 'questions whether the team actually has the bandwidth to pull it off',
    diplomatAngle: 'pulls the best insight from each speaker into one simple takeaway',
    openerStyle: 'Friendly, brisk, structured'
  },
};

export function getGdPersonaVoice(mentorId: string): GdPersonaVoice {
  const normalized = normalizeMentorId(mentorId);
  return GD_PERSONA_PROFILES[normalized] || GD_PERSONA_PROFILES.akash;
}

export function normalizeMentorId(raw?: string | null): string {
  const s = (raw || 'priya').trim().toLowerCase();
  const base = s.split('_')[0];
  return MENTOR_NAMES[base] ? base : 'priya';
}

export function gdDisplayName(mentorId: string): string {
  const id = normalizeMentorId(mentorId);
  return MENTOR_NAMES[id] || 'Mr. Akash';
}

/**
 * Floating 3D Mentor is ALWAYS the user's selected AI mentor (defaults to Priya).
 */
export function resolveFloatingMentorId(
  input?: string | null | { guidanceMentorId?: string | null; selectedTeacherId?: string | null }
): string {
  if (typeof input === 'string') return normalizeMentorId(input);
  if (input && typeof input === 'object') {
    return normalizeMentorId(input.guidanceMentorId || input.selectedTeacherId || 'priya');
  }
  return 'priya';
}

/**
 * Returns true ONLY if `avatarId` is allowed to host the GD room.
 * Rule: If the user selected a mentor (e.g. Priya) as their AI Mentor, they CANNOT take that mentor as GD Host.
 */
export function isAvatarEligibleAsGdHost(avatarId: string, userGuidanceMentorId?: string | null): boolean {
  const candidate = normalizeMentorId(avatarId);
  const mentor = resolveFloatingMentorId(userGuidanceMentorId);
  return candidate !== mentor;
}

/**
 * Returns all eligible GD Host IDs (strictly excluding the user's selected AI Mentor).
 */
export function getEligibleGdHosts(userGuidanceMentorId?: string | null): string[] {
  const mentor = resolveFloatingMentorId(userGuidanceMentorId);
  return GD_HOST_POOL.filter(id => id !== mentor);
}

/**
 * Resolves the GD Host ID, guaranteeing the Host is NEVER the user's selected AI Mentor.
 * If `preferredHostId` is provided and eligible, uses it; otherwise defaults cleanly
 * (preserving `'anish'` fallback when mentor is `'priya'` and no preferred host is set,
 * or selecting the first eligible non-mentor host).
 */
export function resolveGdHostId(userGuidanceMentorId?: string | null, preferredHostId?: string | null): string {
  const floating = resolveFloatingMentorId(userGuidanceMentorId);
  if (preferredHostId) {
    const preferred = normalizeMentorId(preferredHostId);
    if (preferred !== floating) return preferred;
  }
  return floating === 'priya' ? 'anish' : 'priya';
}

/**
 * Detects whether the user's message contains a direct question that panelists MUST answer.
 */
export function detectDirectQuestion(text: string): boolean {
  const trimmed = (text || '').trim();
  if (!trimmed) return false;
  if (trimmed.includes('?')) return true;
  return /^(what|why|how|when|where|who|which|can|could|should|would|do|does|is|are|will)\b/i.test(trimmed);
}

/**
 * Extracts up to 3 meaningful topic/context keywords from a speaker's actual utterance
 * so fallbacks stay 100% grounded in what was truly said (zero hallucination).
 */
function extractGroundedPhrase(text: string, fallback: string): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return fallback;
  const stopwords = new Set([
    'that', 'this', 'with', 'from', 'they', 'them', 'have', 'been', 'will', 'would',
    'could', 'should', 'about', 'there', 'their', 'what', 'when', 'where', 'which',
    'while', 'think', 'believe', 'really', 'just', 'like', 'also', 'very', 'more',
    'most', 'some', 'into', 'over', 'than', 'then', 'only', 'make', 'need', 'want',
    'because', 'your', 'ours', 'here', 'well', 'good', 'great', 'point', 'agree'
  ]);
  const words = clean
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w.toLowerCase()));
  if (words.length === 0) return fallback;
  return words.slice(0, 4).join(' ');
}

/**
 * Sentence-aware speech clamp: keeps avatar responses between 2 and 3.5 visual lines
 * (~24-54 words, 2-3 clean, complete sentences) without EVER slicing mid-sentence.
 */
export function clampSpeech(raw: string): string {
  const cleaned = raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[*_#>`~]/g, '')
    .replace(/^\s*[-•\d.)]+\s+/gm, '')
    .replace(/^\s*(?:Ms\.|Mr\.|Dr\.)?\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return '';

  // Split into complete sentences while preserving terminal punctuation
  const sentences = cleaned
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map(s => s.trim())
    .filter(Boolean) || [cleaned];

  const selected: string[] = [];
  let totalWords = 0;

  for (const sentence of sentences) {
    const sWords = sentence.split(/\s+/).filter(Boolean).length;
    // Allow up to 3 sentences and stay within ~54 words (<= 3.5 lines)
    if (selected.length >= 3) break;
    if (selected.length >= 2 && totalWords + sWords > GD_TARGET_WORDS_MAX) break;
    if (selected.length === 1 && totalWords + sWords > GD_TARGET_WORDS_MAX + 8) break;

    selected.push(sentence);
    totalWords += sWords;
    if (totalWords >= GD_TARGET_WORDS_MAX - 6 && selected.length >= 2) break;
  }

  let result = selected.join(' ').trim();
  const finalWords = result.split(/\s+/).filter(Boolean);

  // Guard for a single run-on sentence exceeding hard word cap
  if (finalWords.length > GD_TARGET_WORDS_MAX + 4) {
    const slice = finalWords.slice(0, GD_TARGET_WORDS_MAX).join(' ');
    // Prefer trimming to last comma/semicolon/dash clause boundary so it sounds natural
    const clauseIdx = Math.max(slice.lastIndexOf(','), slice.lastIndexOf(';'), slice.lastIndexOf('—'));
    const cleanCut = clauseIdx > slice.length * 0.65 ? slice.slice(0, clauseIdx) : slice;
    result = `${cleanCut.replace(/[,;:\-—\s]+$/, '')}.`;
  }

  if (!/[.!?]$/.test(result)) {
    result = `${result}.`;
  }

  return result;
}

/**
 * Host opening intro script: welcomes the panel, introduces the topic & objective,
 * explains the common GD room rules concisely, and hands the floor to the Candidate.
 */
export function hostIntroScript(
  hostName: string,
  roomName: string,
  objective: string,
  durationMinutes: number
): string {
  const safeObj = objective?.trim()
    ? ` Our goal is to ${objective.trim().replace(/\.$/, '')}.`
    : '';
  const timeNote = durationMinutes > 5
    ? ' I will step in between turns at 5 minutes left and 1 minute left.'
    : ' I will give a quick 1-minute warning before wrap-up.';

  return (
    `Welcome everyone, I am ${hostName}, your GD Host for today's ${durationMinutes} minutes discussion on "${roomName}".${safeObj} ` +
    `Quick room rules: speak one at a time, keep points crisp and respectful, challenge ideas not people, and answer questions directly.${timeNote} ` +
    `Our loop is simple: you speak first, our Challenger will test your view, our Diplomat will balance both sides, and then the floor comes right back to you. ` +
    `Candidate, you have the floor to open.`
  );
}

/**
 * Host 5-minute remaining interruption (fires between talks when 5 minutes are left).
 */
export function hostFiveMinuteWarningScript(hostName: string, topic: string): string {
  return (
    `Quick time check from ${hostName}: we have 5 minutes remaining in our discussion on "${topic}". ` +
    `Let's sharpen our examples and start narrowing toward practical solutions as we continue.`
  );
}

/**
 * Host 1-minute remaining interruption (fires between talks when 1 minute is left).
 */
export function hostOneMinuteWarningScript(hostName: string, topic: string): string {
  return (
    `Final time check from ${hostName}: only 1 minute remaining for "${topic}". ` +
    `Let's deliver crisp closing takeaways so the panel wraps with a clear conclusion.`
  );
}

/**
 * Polite Host nudge when user hasn't spoken yet (NEVER fabricates fake user arguments!).
 */
export function hostGentleNudgeScript(hostName: string, candidateName: string, topic: string): string {
  return (
    `${candidateName}, the floor is still yours—feel free to share one short view or ask the panel a question about "${topic}", or tap a quick starter chip below.`
  );
}

/** Backward-compatible alias retained for legacy tests. */
export function hostMidpointScript(hostName: string, topic: string): string {
  return hostFiveMinuteWarningScript(hostName, topic);
}

/** Backward-compatible alias retained for legacy tests. */
export function hostThirtySecondScript(hostName: string, topic: string): string {
  return hostOneMinuteWarningScript(hostName, topic);
}

function systemPrompt(req: GdTurnRequest): string {
  const displayName = gdDisplayName(req.mentorId);
  const persona = getGdPersonaVoice(req.mentorId);
  const candidate = req.candidateName?.trim() || 'Candidate';
  const lastUserMsg = [...req.history].reverse().find(m => m.role === 'user')?.content || '';
  const userAskedQuestion = detectDirectQuestion(lastUserMsg);

  const lengthRule =
    'LENGTH RULE (STRICT): Write EXACTLY 2 to 3 short, simple, conversational sentences (30 to 50 words total, fitting 2 to 3.5 lines). ' +
    'Use plain, natural spoken English. NO bullet lists, NO markdown, NO robotic speaker prefixes, NO jargon dumps.';

  const truthfulnessRule =
    'ZERO HALLUCINATION RULE (STRICT): Reference ONLY what the user or panelists ACTUALLY said in the transcript. ' +
    'Never invent statistics, fake quotes, or claim the user said something they did not say.' +
    (userAskedQuestion
      ? ' DIRECT QUESTION RULE: The user just asked a question—you MUST directly answer their question clearly in your very first sentence before adding your point!'
      : '');

  if (req.roleType === 'avatar_a') {
    const intensity =
      req.difficulty === 'hard'
        ? 'Be sharp, bold, and incisive—challenge their core assumption head-on with a concrete counter-example.'
        : req.difficulty === 'easy'
          ? 'Be friendly yet firm—gently challenge one blind spot and give a clear alternative angle.'
          : 'Be lively, engaging, and debate-ready—push back constructively on the biggest risk or trade-off in their point.';

    return [
      `You are ${displayName}, acting as AVATAR 1 (THE CHALLENGER) in a realistic live Group Discussion on "${req.topic}" (${req.domain} domain).`,
      `YOUR UNIQUE VOICE: ${persona.signatureStyle} You naturally ${persona.challengerAngle}.`,
      `ROLE MISSION: Respond directly to ${candidate}'s latest point. ${intensity} Keep the conversation genuinely interesting and creative—bring a fresh real-world angle, NOT generic textbook clichés.`,
      truthfulnessRule,
      lengthRule,
    ].join('\n');
  }

  if (req.roleType === 'avatar_b') {
    const challengerLabel = req.lastChallengerName || 'Avatar 1';
    return [
      `You are ${displayName}, acting as AVATAR 2 (THE DIPLOMAT) in a realistic live Group Discussion on "${req.topic}" (${req.domain} domain).`,
      `YOUR UNIQUE VOICE: ${persona.signatureStyle} You naturally ${persona.diplomatAngle}.`,
      `ROLE MISSION: Give a balanced, diplomatic response that acknowledges BOTH ${candidate}'s view AND ${challengerLabel}'s counter-argument. Bridge the two sides with one smart, creative middle-ground insight, then hand the floor smoothly back to ${candidate} with a brief open prompt.`,
      truthfulnessRule,
      lengthRule,
    ].join('\n');
  }

  return [
    `You are ${displayName}, the Group Discussion Host moderating "${req.topic}".`,
    truthfulnessRule,
    lengthRule,
  ].join('\n');
}

function generateUtterance(req: GdTurnRequest): string {
  const candidate = req.candidateName?.trim() || 'Candidate';
  const lastUser = [...req.history].reverse().find(m => m.role === 'user')?.content || '';
  const lastChallenger = req.lastChallengerText || [...req.history].reverse().find(m => m.role === 'assistant')?.content || '';
  const userTopicHook = extractGroundedPhrase(lastUser, req.topic);
  const challengerHook = extractGroundedPhrase(lastChallenger, 'execution risk');
  const userAskedQuestion = detectDirectQuestion(lastUser);

  if (req.roleType === 'avatar_a') {
    if (userAskedQuestion) {
      return clampSpeech(
        `To answer your question directly on ${req.topic}, I would challenge the assumption behind ${userTopicHook} because the hidden risk shows up when real costs and scale hit. ` +
        `If we ignore that flaw early, teams usually pay twice as much to fix it later.`
      );
    }

    const domainLens =
      req.domain === 'commerce'
        ? 'margin pressure, working capital, and compliance risk'
        : req.domain === 'sales'
          ? 'customer trust, conversion friction, and retention risk'
          : req.domain === 'business'
            ? 'unit economics, execution speed, and competitive risk'
            : 'reliability bottlenecks, operational cost, and failure risk';

    return clampSpeech(
      `I respectfully challenge your take on ${userTopicHook} in "${req.topic}" because it overlooks ${domainLens}. ` +
      `What looks strong on paper often exposes a major flaw the moment real-world pressure hits—how would you handle that risk?`
    );
  }

  if (req.roleType === 'avatar_b') {
    const challengerLabel = req.lastChallengerName || 'my colleague';
    if (userAskedQuestion) {
      return clampSpeech(
        `Both angles answer your question in useful ways: your focus on ${userTopicHook} sets the direction, while ${challengerLabel}'s caution around ${challengerHook} protects us from avoidable mistakes. ` +
        `A phased pilot can capture both benefits safely—${candidate}, you have the floor to weigh in.`
      );
    }

    return clampSpeech(
      `I see merit in both sides: ${candidate}'s point on ${userTopicHook} gives us momentum, while ${challengerLabel}'s warning on ${challengerHook} keeps our plan grounded. ` +
      `Pairing a small measurable pilot with clear guardrails bridges both views—${candidate}, you have the floor.`
    );
  }

  return clampSpeech(`Let us keep "${req.topic}" focused and practical. ${candidate}, you have the floor.`);
}

export type LlmCaller = (
  system: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
) => Promise<string>;

export async function executeGdTurn(
  req: GdTurnRequest,
  callLlm: LlmCaller
): Promise<GdTurnResult> {
  const sys = systemPrompt(req);
  const recent = req.history.slice(-8).map(m => ({
    role: m.role,
    content: m.sender ? `${m.sender}: ${m.content}` : m.content,
  }));

  if (recent.length === 0) {
    recent.push({ role: 'user', content: `Let's begin the discussion on "${req.topic}".` });
  }

  let reply = '';
  let usedFallback = false;

  try {
    const raw = await callLlm(sys, recent);
    reply = clampSpeech(raw);
  } catch {
    reply = '';
  }

  if (!reply || reply.split(/\s+/).length < 10) {
    reply = generateUtterance(req);
    usedFallback = true;
  }

  const wordCount = reply.split(/\s+/).filter(Boolean).length;
  return {
    reply,
    roleType: req.roleType,
    mentorId: normalizeMentorId(req.mentorId),
    displayName: gdDisplayName(req.mentorId),
    wordCount,
    usedFallback,
  };
}
