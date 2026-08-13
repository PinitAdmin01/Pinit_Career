/** Group-discussion turn engine: opposite host, dual Groq slots, 10s everyday speech. */

export const GD_SPEAK_MS = 10_000;
export const GD_MAX_SPEAK_MS = 14_000;
export const GD_TARGET_WORDS_MIN = 28;
export const GD_TARGET_WORDS_MAX = 42;

export type GdRoleType = 'avatar_a' | 'avatar_b';

export type GdHistoryItem = { role: string; content: string; sender?: string };

export type GdTurnRequest = {
  action?: 'speak' | string;
  roleType: GdRoleType;
  mentorId: string;
  topic: string;
  objective?: string;
  domain?: string;
  nextSpeakerName?: string;
  candidateName?: string;
  history?: GdHistoryItem[];
  candidateSilenced?: boolean;
};

export type GdTurnResult = {
  reply: string;
  mentorId: string;
  mentorName: string;
  roleType: GdRoleType;
  source: 'llm' | 'generated' | 'callout';
};

export type GdLlmFn = (
  slot: 'a' | 'b',
  messages: { role: string; content: string }[],
  systemPrompt: string,
  maxTokens: number
) => Promise<string>;

export const GD_CAST: Record<string, { name: string; voiceName: string }> = {
  priya: { name: 'Ms. Priya', voiceName: 'af_heart' },
  anish: { name: 'Mr. Akash', voiceName: 'am_liam' },
  akash: { name: 'Mr. Akash', voiceName: 'am_liam' },
  aisha: { name: 'Ms. Aisha', voiceName: 'af_sky' },
  rohan: { name: 'Mr. Rohan', voiceName: 'am_fenrir' },
  kashyap: { name: 'Mr. Kashyap', voiceName: 'am_fenrir' },
  karthic: { name: 'Mr. Karthic', voiceName: 'am_liam' },
  maya: { name: 'Ms. Maya', voiceName: 'bf_emma' },
  divya: { name: 'Ms. Divya', voiceName: 'af_nicole' },
  vikram: { name: 'Mr. Vikram', voiceName: 'bm_lewis' },
  shalini: { name: 'Ms. Shalini', voiceName: 'bf_isabella' },
  aditya: { name: 'Mr. Aditya', voiceName: 'am_adam' },
  neha: { name: 'Ms. Neha', voiceName: 'af_bella' },
  rajesh: { name: 'Mr. Rajesh', voiceName: 'am_liam' },
  sneha: { name: 'Ms. Sneha', voiceName: 'af_sarah' },
  abhijit: { name: 'Mr. Abhijit', voiceName: 'bm_george' },
};

const SPEAKER_POOL = Object.keys(GD_CAST).filter(id => id !== 'akash');

export function normalizeMentorId(raw?: string | null): string {
  const id = String(raw || 'priya').toLowerCase().trim();
  if (id === 'akash') return 'anish';
  return GD_CAST[id] ? id : 'priya';
}

/** Floating mentor is Priya or Akash (stored as anish). */
export function resolveFloatingMentorId(user?: {
  guidanceMentorId?: string;
  selectedTeacherId?: string;
} | null): 'priya' | 'anish' {
  const raw = normalizeMentorId(user?.guidanceMentorId || user?.selectedTeacherId || 'priya');
  return raw === 'anish' ? 'anish' : 'priya';
}

/** Host is always the opposite of the floating avatar mentor. */
export function resolveGdHostId(floatingMentorId?: string | null): 'priya' | 'anish' {
  return resolveFloatingMentorId({ guidanceMentorId: floatingMentorId || 'priya' }) === 'anish'
    ? 'priya'
    : 'anish';
}

export function gdDisplayName(id: string): string {
  const key = normalizeMentorId(id);
  return GD_CAST[key]?.name || 'Panelist';
}

export function pickRandomSpeakerPair(
  pool: string[],
  exclude: string[],
  previous?: { a?: string; b?: string } | null
): { a: string; b: string } {
  const blocked = new Set(exclude.map(normalizeMentorId));
  let eligible = [...new Set(pool.map(normalizeMentorId))].filter(id => !blocked.has(id));
  if (eligible.length < 2) {
    eligible = SPEAKER_POOL.filter(id => !blocked.has(id));
  }
  if (eligible.length < 2) {
    eligible = SPEAKER_POOL.filter(id => id !== 'priya' && id !== 'anish');
  }

  const shuffle = [...eligible];
  for (let i = shuffle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
  }

  let a = shuffle[0];
  let b = shuffle[1] || shuffle[0];
  if (previous?.a && shuffle.includes(previous.a) && shuffle[0] === previous.a && shuffle.length > 2) {
    a = shuffle[2] || shuffle[1];
    b = shuffle.find(id => id !== a) || b;
  }
  if (a === b) {
    b = SPEAKER_POOL.find(id => id !== a && !blocked.has(id)) || (a === 'kashyap' ? 'divya' : 'kashyap');
  }
  return { a, b };
}

function lastCandidatePoint(history: GdHistoryItem[] | undefined): string {
  if (!history?.length) return '';
  for (let i = history.length - 1; i >= 0; i--) {
    const row = history[i];
    const role = String(row.role || '').toLowerCase();
    if (role === 'user' || role.includes('candidate')) return String(row.content || '').trim();
  }
  return String(history[history.length - 1]?.content || '').trim();
}

function lastAssistantLine(history: GdHistoryItem[] | undefined): string {
  if (!history?.length) return '';
  for (let i = history.length - 1; i >= 0; i--) {
    const row = history[i];
    const role = String(row.role || '').toLowerCase();
    if (role !== 'user' && !role.includes('candidate')) return String(row.content || '').trim();
  }
  return '';
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function clampSpeech(text: string, closer: string): string {
  let clean = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[.*?\]:\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) clean = closer;

  if (wordCount(clean) < GD_TARGET_WORDS_MIN) {
    clean = `${clean} ${closer}`.replace(/\s+/g, ' ').trim();
  }

  if (wordCount(clean) > GD_TARGET_WORDS_MAX) {
    const words = clean.split(/\s+/);
    clean = words.slice(0, GD_TARGET_WORDS_MAX).join(' ');
    if (!/[.!?]$/.test(clean)) clean += '.';
  }
  return clean;
}

function looksSound(point: string): boolean {
  const t = point.toLowerCase();
  if (!t || t.length < 12) return false;
  const weak = /\b(i don't know|no idea|whatever|skip|idk|maybe later)\b/;
  if (weak.test(t)) return false;
  const strong = /\b(because|so that|first|then|trade.?off|test|user|cost|safe|simple|step|plan|example)\b/;
  return strong.test(t) || t.length > 40;
}

function generateUtterance(req: GdTurnRequest): string {
  const name = gdDisplayName(req.mentorId);
  const next = req.nextSpeakerName || 'the next speaker';
  const candidate = req.candidateName || 'Candidate';
  const topic = req.topic || 'this topic';
  const point = lastCandidatePoint(req.history) || 'the last point';
  const prior = lastAssistantLine(req.history);
  const sound = looksSound(point);

  if (req.roleType === 'avatar_a') {
    if (sound) {
      return `${candidate}, that point on ${topic} is right. You named a real step people use every day, not just a big word. Keep that same simple plan. ${next}, please take this forward and look a bit deeper.`;
    }
    return `${candidate}, that take on ${topic} is not strong yet. It skips the real-world check: who does the work, what can break, and how we know it worked. Say it in plain steps. ${next}, please add the missing piece.`;
  }

  const hook = prior ? `I heard the last note, and I stay in the middle.` : `I will stay in the middle on this.`;
  return `${hook} On ${topic}, the honest view is both sides have a cost. One path is faster today. The other is safer tomorrow. We should weigh daily effort, money, and what happens if it fails, then pick the calm option.`;
}

function systemPrompt(req: GdTurnRequest): string {
  const name = gdDisplayName(req.mentorId);
  const next = req.nextSpeakerName || 'the next speaker';
  const candidate = req.candidateName || 'Candidate';
  const topic = req.topic || 'this topic';
  const objective = req.objective || 'a clear everyday decision';

  const shared = `You are ${name} in a live group discussion.
Topic: "${topic}". Goal: ${objective}.
Speak in simple daily-life English. Short sentences. No jargon dump. No markdown. No name prefix.
You MUST speak ${GD_TARGET_WORDS_MIN} to ${GD_TARGET_WORDS_MAX} words so the spoken turn lasts about 10 seconds.
Do not greet. Do not say you are an AI.`;

  if (req.roleType === 'avatar_a') {
    return `${shared}
You are Avatar 1. Be honest about ${candidate}'s idea: if it is right, say it is right and why in plain words; if it is wrong or empty, say it is wrong and what is missing.
End by calling ${next} by name to continue. Do not stay neutral.`;
  }

  return `${shared}
You are Avatar 2. Stay fully neutral. Do not pick a winner. Give a deeper everyday analysis of the ongoing topic and the last points: costs, risks, and what a normal team would actually do.
Do not call ${candidate} to answer yet.`;
}

export async function executeGdTurn(req: GdTurnRequest, llm: GdLlmFn): Promise<GdTurnResult> {
  const mentorId = normalizeMentorId(req.mentorId);
  const mentorName = gdDisplayName(mentorId);
  const slot: 'a' | 'b' = req.roleType === 'avatar_b' ? 'b' : 'a';
  const generated = clampSpeech(generateUtterance({ ...req, mentorId }), generateUtterance({ ...req, mentorId }));

  if (req.candidateSilenced) {
    const callout = `${req.candidateName || 'Candidate'}, we still need your view on ${req.topic || 'this topic'}. Please say it in simple words so the room can continue.`;
    return { reply: callout, mentorId, mentorName, roleType: req.roleType, source: 'callout' };
  }

  try {
    const history = (req.history || []).slice(-8).map(h => ({
      role: String(h.role).toLowerCase().includes('candidate') || h.role === 'user' ? 'user' : 'assistant',
      content: String(h.content || ''),
    }));
    const text = await llm(
      slot,
      history.length ? history : [{ role: 'user', content: `Topic: ${req.topic}. Please speak now.` }],
      systemPrompt({ ...req, mentorId }),
      120
    );
    const cleaned = clampSpeech(text, generated);
    if (wordCount(cleaned) >= 18) {
      return { reply: cleaned, mentorId, mentorName, roleType: req.roleType, source: 'llm' };
    }
  } catch {
    // generated path below
  }

  return { reply: generated, mentorId, mentorName, roleType: req.roleType, source: 'generated' };
}

export function hostIntroScript(hostName: string, topic: string, objective?: string): string {
  const goal = objective?.trim() || 'share a clear, practical view';
  return `Hello everyone. I am ${hostName}, and I am the host of this group discussion. Today's topic is ${topic}. In simple words, we will ${goal}. I will alert you when five minutes are over, and again thirty seconds before we close. Candidate, please start us off.`;
}

export function hostFiveMinuteScript(hostName: string, topic: string): string {
  return `This is ${hostName}. Five minutes are over. We are halfway through this group discussion on ${topic}. Keep using simple, everyday words. Candidate, please continue.`;
}

export function hostThirtySecondScript(hostName: string, topic: string): string {
  return `This is ${hostName}. Thirty seconds left. This group discussion on ${topic} will complete within thirty seconds. Please wrap up your last point.`;
}

export function hostEndScript(hostName: string, topic: string): string {
  return `This is ${hostName}. Time is up. Thank you everyone. Our group discussion on ${topic} is complete. I will now prepare your short performance report.`;
}
