export type RoleplayChoice = { text: string; delta: number; rationale?: string };

export type RoleplayNode = {
  ok: true;
  scenarioTitle?: string;
  scenarioId: string;
  activeAvatar: string;
  avatarName: string;
  avatarRole: string;
  message: string;
  choices: RoleplayChoice[];
  isEnded?: boolean;
  source: 'llm' | 'generated';
};

export type RoleplayEval = {
  ok: true;
  report: string;
  spokenConclusion: string;
  qt2_delta: number;
  leadership_delta: number;
  communication_delta: number;
  execution_delta: number;
  intelligence_delta: number;
  mindset_archetype: string;
  source: 'llm' | 'generated';
};

export type RoleplayHistoryItem = { role: 'user' | 'assistant' | 'system'; content: string; delta?: number };

export type RoleplayRequest = {
  action: 'initialize' | 'respond' | 'evaluate' | string;
  qt2?: number;
  role?: string;
  history?: RoleplayHistoryItem[];
  choice?: string;
  studentName?: string;
  userId?: string;
  sessionNonce?: string;
  recentTitles?: string[];
};

type LlmFn = (
  messages: { role: string; content: string }[],
  systemPrompt: string,
  maxTokens: number
) => Promise<string>;

const CAST: Record<string, { name: string; role: string }> = {
  rajesh: { name: 'Mr. Rajesh', role: 'Teammate looking for shortcuts' },
  abhijit: { name: 'Mr. Abhijit', role: 'Impatient manager demanding quick answers' },
  sneha: { name: 'Ms. Sneha', role: 'Teammate offering risky quick fixes' },
  rohan: { name: 'Mr. Rohan', role: 'Strict team lead asking for accountability' },
};

const AVATAR_IDS = Object.keys(CAST);

const MINDSET_BOOKS = [
  { title: 'Thinking, Fast and Slow (Daniel Kahneman)', focus: 'System 1 vs System 2, loss aversion, decision anxiety.' },
  { title: 'Extreme Ownership (Jocko Willink)', focus: 'Absolute accountability, decisive action under ambiguity.' },
  { title: '33 Strategies of War (Robert Greene)', focus: 'Counter-offensives, detecting sabotage and political maneuvering.' },
  { title: 'Influence (Robert Cialdini)', focus: 'Authority bias, scarcity, commitment traps, social proof.' },
  { title: 'The Black Swan (Nassim Taleb)', focus: 'Low-probability high-impact emergencies without panic.' },
  { title: 'Crucial Conversations (Kerry Patterson)', focus: 'High-stakes dialogue safety under deadline pressure.' },
  { title: 'The Millionaire Fastlane (MJ DeMarco)', focus: 'Producer vs consumer mindset, high-agency execution.' },
];

const INCIDENTS = [
  { id: 'payments-cascade', title: 'Student Fees Payment Glitch', system: 'college payment portal', pressure: 'late-fee deadline closes in 30 minutes', hook: 'students are seeing double-deduction errors on their screen' },
  { id: 'auth-lockout', title: 'Campus Portal Login Outage', system: 'student login portal', pressure: 'online mid-term exam starts in 15 minutes', hook: 'students are getting locked out of their accounts' },
  { id: 'pii-leak', title: 'Student Records Privacy Leak', system: 'college file storage', pressure: 'department head was just alerted', hook: 'a folder containing private student phone numbers was set to public' },
  { id: 'cost-spike', title: 'Cloud Server Bill Shock', system: 'cloud server account', pressure: 'project advisor is demanding an answer', hook: 'a test server left running overnight caused unexpected charges' },
  { id: 'oncall-page', title: 'Project Database Crash', system: 'team database', pressure: 'project submission deadline is tonight', hook: 'the database stopped saving student project submissions' },
  { id: 'model-drift', title: 'Placement Portal Ranking Issue', system: 'campus placement portal', pressure: 'recruiter interviews start in 15 minutes', hook: 'student test scores and rankings are displaying in reverse order' },
  { id: 'vendor-outage', title: 'SMS Verification Service Down', system: 'SMS OTP service', pressure: 'exam hall ticket downloads start right now', hook: 'students cannot receive their verification codes' },
  { id: 'scope-creep', title: 'Sudden Demo Feature Request', system: 'team project app', pressure: 'faculty evaluation starts in 10 minutes', hook: 'the evaluator suddenly asks to remove a key project requirement' },
  { id: 'secret-commit', title: 'Password Leaked in Code Repository', system: 'shared project repository', pressure: 'the repository is visible to other teams', hook: 'someone accidentally committed a private password in the code' },
  { id: 'attendance-spoof', title: 'Attendance Scanner Glitch', system: 'classroom attendance scanner', pressure: 'professor is taking attendance right now', hook: 'the scanner is marking absent students as present' },
  { id: 'hostel-iot', title: 'Hostel Door Scanner Error', system: 'hostel door scanner', pressure: 'night curfew starts in 15 minutes', hook: 'student ID cards are being rejected at the door' },
  { id: 'grade-swap', title: 'Exam Marks Upload Error', system: 'grade report sheet', pressure: 'semester grades are being emailed tonight', hook: 'two student grades were accidentally swapped during upload' },
];

const BANNED_PHRASES = [
  'branch sync',
  'main branch just broke',
  'client demo is in 5 minutes',
  'force a bypass check',
  'git hooks',
  'critical branch sync failure',
  'blast radius onto',
  'skip the postmortem',
  'freeze writes on matching model',
  'algo drift',
  'fifo fallback',
];

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, list: T[], avoid?: T): T {
  if (list.length === 1) return list[0];
  let item = list[Math.floor(rng() * list.length)];
  if (avoid !== undefined && item === avoid && list.length > 1) {
    item = list[Math.floor(rng() * list.length)];
  }
  return item;
}

function sessionSeed(req: RoleplayRequest): number {
  return hashString([
    req.userId || 'anon',
    req.sessionNonce || `${Date.now()}-${Math.random()}`,
    req.role || 'role',
    String(req.qt2 ?? 75),
    new Date().toISOString(),
  ].join('|'));
}

function firstName(raw?: string): string {
  const n = (raw || '').trim().split(/\s+/)[0];
  return n || 'there';
}

function extractJson(text: string): Record<string, unknown> | null {
  if (!text) return null;
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isBanned(text: string, extra: string[] = []): boolean {
  const hay = text.toLowerCase();
  return [...BANNED_PHRASES, ...extra.map(t => t.toLowerCase())].some(p => p && hay.includes(p));
}

function normalizeChoices(raw: unknown): RoleplayChoice[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 3).map((c, i) => {
    const row = (c && typeof c === 'object' ? c : { text: String(c) }) as Record<string, unknown>;
    const deltas = [4, -2, -4];
    return {
      text: String(row.text || '').trim(),
      delta: Number.isFinite(Number(row.delta)) ? Number(row.delta) : deltas[i] ?? -2,
      rationale: row.rationale ? String(row.rationale) : undefined,
    };
  }).filter(c => c.text.length > 10);
}

function normalizeAvatar(id: unknown): string {
  const key = String(id || '').toLowerCase();
  return CAST[key] ? key : 'rohan';
}

function nodeFromParsed(parsed: Record<string, unknown>, fallbackId: string, ended: boolean): RoleplayNode | null {
  const message = String(parsed.message || '').trim();
  const choices = ended ? [] : normalizeChoices(parsed.choices);
  if (message.length < 30) return null;
  if (!ended && choices.length < 2) return null;
  const avatar = normalizeAvatar(parsed.activeAvatar);
  const cast = CAST[avatar];
  const title = parsed.scenarioTitle ? String(parsed.scenarioTitle) : undefined;
  if (isBanned(message) || (title && isBanned(title))) return null;
  return {
    ok: true,
    scenarioTitle: title,
    scenarioId: String(parsed.scenarioId || fallbackId),
    activeAvatar: avatar,
    avatarName: String(parsed.avatarName || cast.name),
    avatarRole: String(parsed.avatarRole || cast.role),
    message,
    choices,
    isEnded: ended || Boolean(parsed.isEnded),
    source: 'llm',
  };
}

function booksForSeed(seed: number) {
  const rng = mulberry32(seed);
  const pool = [...MINDSET_BOOKS];
  const selected: typeof MINDSET_BOOKS = [];
  while (selected.length < 3 && pool.length) {
    selected.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }
  return selected;
}

function generateInitializeNode(req: RoleplayRequest): RoleplayNode {
  const seed = sessionSeed(req);
  const rng = mulberry32(seed);
  const recent = (req.recentTitles || []).map(t => t.toLowerCase());
  const unused = INCIDENTS.filter(i => !recent.some(t => t.includes(i.title.toLowerCase()) || i.title.toLowerCase().includes(t)));
  const incident = pick(rng, unused.length ? unused : INCIDENTS);
  const avatar = pick(rng, AVATAR_IDS);
  const second = pick(rng, AVATAR_IDS.filter(id => id !== avatar));
  const name = firstName(req.studentName);
  const role = req.role || 'Software Developer';
  const cast = CAST[avatar];
  const other = CAST[second];

  const lines: Record<string, string> = {
    rajesh: `Hey ${name}, I did not touch the ${incident.system}! Someone on your side did. ${incident.hook}, and ${incident.pressure}. I can quickly hide the error on the screen so nobody notices — should I do it?`,
    abhijit: `${name}, we have a serious issue with the ${incident.system}! ${incident.hook}, and ${incident.pressure}. I need an answer right now: can you guarantee this is fixed in 2 minutes, or should I tell everyone you caused this outage?`,
    sneha: `${name}, don't panic. I found a quick shortcut for the ${incident.system}. ${incident.hook}. We can cover up the error so it looks fine during ${incident.pressure}. Want me to apply it?`,
    rohan: `${name}, you are responsible for the ${incident.system}. Here is the issue: ${incident.hook}, and ${incident.pressure}. Tell me your exact plan right now. How are you going to solve this without making excuses?`,
  };

  return {
    ok: true,
    scenarioTitle: incident.title,
    scenarioId: `sc_${incident.id}_${seed.toString(16)}`,
    activeAvatar: avatar,
    avatarName: cast.name,
    avatarRole: cast.role,
    message: lines[avatar],
    choices: [
      {
        text: `Be honest and take ownership: calmly explain what broke, do not hide errors with quick fake patches, and give an honest time estimate to fix it safely.`,
        delta: 4,
        rationale: 'Honest ownership under pressure',
      },
      {
        text: `Apply a quick cosmetic patch to hide the error message so the screen looks normal for now, and investigate the real problem later.`,
        delta: -2,
        rationale: 'Risky shortcut trap',
      },
      {
        text: `Blame ${other.name} for the mistake and refuse to help until someone else admits fault.`,
        delta: -4,
        rationale: 'Blaming others and avoiding responsibility',
      },
    ],
    isEnded: false,
    source: 'generated',
  };
}

function generateRespondNode(req: RoleplayRequest): RoleplayNode {
  const history = req.history || [];
  const nodeCount = history.filter(h => h.role === 'assistant').length;
  const isFinal = nodeCount >= 8;
  const seed = hashString(`${sessionSeed(req)}|${nodeCount}|${req.choice || ''}`);
  const rng = mulberry32(seed);
  const used = history
    .map(h => h.content)
    .join(' ')
    .toLowerCase();
  const unusedAvatars = AVATAR_IDS.filter(id => !used.includes(CAST[id].name.toLowerCase()));
  const avatar = pick(rng, unusedAvatars.length ? unusedAvatars : AVATAR_IDS);
  const cast = CAST[avatar];
  const name = firstName(req.studentName);
  const choice = (req.choice || 'that move').slice(0, 160);
  const incident = pick(rng, INCIDENTS);
  const scenarioId = `sc_step_${seed.toString(16)}`;

  if (isFinal) {
    return {
      ok: true,
      scenarioId,
      activeAvatar: avatar,
      avatarName: cast.name,
      avatarRole: cast.role,
      message: `${name}, the session has concluded. ${incident.pressure}. Your final choice — "${choice}" — determined how the team handled this challenge. Let's review your mindset and leadership results.`,
      choices: [],
      isEnded: true,
      source: 'generated',
    };
  }

  const beats: Record<string, string> = {
    rajesh: `${name}, you chose to: "${choice}". Fine! But if anything breaks, you take full responsibility. I already told ${CAST.abhijit.name} what you said, so be ready to defend your choice.`,
    abhijit: `${name}, we don't have time for long explanations. You chose: "${choice}". Can you guarantee this works before ${incident.pressure}, or will you delay the whole project?`,
    sneha: `${name}, people are asking questions in the team chat about your choice: "${choice}". I still have that quick patch ready. Are you sure you want to do it the hard way?`,
    rohan: `${name}, you decided to: "${choice}". That sounds like a start, but explain the exact details. What is step one, who is double-checking your work, and how do we prevent this from breaking again?`,
  };

  return {
    ok: true,
    scenarioId,
    activeAvatar: avatar,
    avatarName: cast.name,
    avatarRole: cast.role,
    message: beats[avatar],
    choices: [
      {
        text: `Stay focused and transparent: outline the concrete steps to fix the issue, and provide an honest progress update in 15 minutes.`,
        delta: 4,
        rationale: 'Calm, transparent problem solving',
      },
      {
        text: `Rush a temporary bypass to silence complaints and promise it will never happen again.`,
        delta: -2,
        rationale: 'Panicked over-promising trap',
      },
      {
        text: `Argue with ${cast.name} in front of the team and insist the expectations are unfair.`,
        delta: -4,
        rationale: 'Emotional confrontation and defensiveness',
      },
    ],
    isEnded: false,
    source: 'generated',
  };
}

function deltasFromHistory(history: RoleplayHistoryItem[]) {
  let finalDelta = 0;
  history.forEach(h => {
    if (typeof h.delta === 'number') finalDelta += h.delta;
  });
  const qt2_delta = Math.min(5, Math.max(-5, finalDelta));
  return {
    finalDelta,
    qt2_delta,
    leadership_delta: Math.min(8, Math.max(-8, Math.round(finalDelta * 1.5))),
    communication_delta: Math.min(6, Math.max(-6, Math.round(finalDelta * 1.2))),
    execution_delta: Math.min(8, Math.max(-8, Math.round(finalDelta * 1.4))),
    intelligence_delta: Math.min(6, Math.max(-6, Math.round(finalDelta * 1.1))),
    mindset_archetype:
      finalDelta >= 12 ? 'Extreme Owner' :
      finalDelta >= 6 ? 'Socratic Explorer' :
      finalDelta >= 0 ? 'Pattern Hunter' :
      finalDelta >= -6 ? 'Risk Mitigator' : 'Executive Diplomat',
  };
}

function generateEvaluate(req: RoleplayRequest): RoleplayEval {
  const history = req.history || [];
  const stats = deltasFromHistory(history);
  const name = firstName(req.studentName);
  const owned = stats.finalDelta >= 0;
  const quotes = history.filter(h => h.role === 'user').slice(0, 3).map(h => `- "${h.content.slice(0, 140)}"`).join('\n') || '- (no recorded choice)';
  return {
    ok: true,
    report: `### Socratic Persona Evolution Summary\n\n**Candidate:** ${name}  \n**Mindset Score Delta:** ${stats.finalDelta >= 0 ? '+' : ''}${stats.finalDelta} pts  \n**Mindset Archetype:** ${stats.mindset_archetype}\n\n#### Decisions You Made\n${quotes}\n\n#### How You Handled It\n- **Honesty & Ownership:** ${owned ? 'You stayed calm and took personal ownership instead of blaming others.' : 'You looked for quick shortcuts or tried to avoid blame under pressure.'}\n- **Dealing with Stress:** ${owned ? 'You communicated realistic timelines and refused unsafe cover-ups.' : 'You were tempted by quick patches that could cause bigger problems later.'}\n- **Clear Communication:** ${owned ? 'You kept the team informed with truthful, clear updates.' : 'You hesitated or argued when asked for status.'}\n\n> Ready for another challenge? Each session tests a new real-world scenario.`,
    spokenConclusion: owned
      ? `${name}, great job! You stayed calm, told the truth, and took full ownership. That is how real professionals solve problems under pressure.`
      : `${name}, you fell for a quick shortcut when the pressure rose. In a real job, always be honest, stay calm, and don't try to hide problems.`,
    ...stats,
    source: 'generated',
  };
}

function initializePrompt(req: RoleplayRequest, books: string, nonce: string): string {
  const name = firstName(req.studentName);
  const banned = [...BANNED_PHRASES, ...(req.recentTitles || [])].join('; ');
  return `You are the PinIT Mindset Orchestrator creating a real-world scenario for ${name}, a college student / junior ${req.role || 'Software Developer'} (QT2 score ${req.qt2 ?? 75}).
Session nonce: ${nonce}.

Cast (pick 2 avatars, one speaks first):
- rajesh (Teammate looking for shortcuts)
- abhijit (Impatient manager demanding quick answers)
- sneha (Teammate offering risky quick fixes)
- rohan (Strict team lead asking for accountability)

CRITICAL INSTRUCTION - SIMPLE ENGLISH:
- Write in SIMPLE, CLEAR, EVERYDAY ENGLISH that any college student can easily understand (Grade 6-8 reading level).
- NEVER use obscure corporate techno-jargon like "blast radius", "freeze writes", "postmortem", "algo drift", "FIFO fallback".
- Create a relatable student or junior workplace situation (e.g., website login broken before exam, project database stopped saving, student grades showing in reverse order, cloud bill spike).
- Provide 3 distinct, crystal-clear choices:
  Choice 1: Calm, honest, responsible ownership (+4 delta)
  Choice 2: Quick, rushed visual patch to hide the error (-2 delta)
  Choice 3: Blaming someone else or refusing to help (-4 delta)

Do NOT reuse these plots or phrases: ${banned}

Return ONLY valid JSON with no markdown:
{
  "scenarioTitle": "Simple Title (e.g. Campus Login Outage)",
  "activeAvatar": "rajesh|abhijit|sneha|rohan",
  "avatarName": "Full name",
  "avatarRole": "Role in this scene",
  "message": "Clear spoken opening in simple English, 2-4 sentences, addressing ${name} by name.",
  "choices": [
    {"text": "Honest, calm ownership choice in simple words", "delta": 4, "rationale": "..."},
    {"text": "Quick cosmetic shortcut trap in simple words", "delta": -2, "rationale": "..."},
    {"text": "Blame someone else choice in simple words", "delta": -4, "rationale": "..."}
  ]
}`;
}

function respondPrompt(req: RoleplayRequest, isFinal: boolean): string {
  const name = firstName(req.studentName);
  return `Continue the PinIT workplace scenario for ${name}.
User just chose: "${req.choice || ''}".
isFinalNode: ${isFinal}.

CRITICAL INSTRUCTION - SIMPLE ENGLISH:
- Write in SIMPLE, NATURAL, EVERYDAY ENGLISH.
- Keep the dialogue direct, clear, and easy to understand.
- If isFinalNode, choices must be [] and isEnded true.

Return ONLY valid JSON with no markdown:
{
  "activeAvatar": "rajesh|abhijit|sneha|rohan",
  "avatarName": "Full name",
  "avatarRole": "Role",
  "message": "Spoken reply to ${name} in simple English",
  "choices": [
    {"text": "Calm, responsible next step", "delta": 4},
    {"text": "Rushed temporary patch", "delta": -2},
    {"text": "Defensive or blaming response", "delta": -4}
  ],
  "isEnded": ${isFinal}
}`;
}

export async function executeRoleplayTurn(req: RoleplayRequest, llm: LlmFn): Promise<RoleplayNode | RoleplayEval> {
  const action = req.action;
  const seed = sessionSeed(req);
  const nonce = req.sessionNonce || seed.toString(16);
  const books = booksForSeed(seed);
  const booksText = books.map(b => `- ${b.title}: ${b.focus}`).join('\n');
  const generatedInit = generateInitializeNode(req);

  if (action === 'initialize') {
    try {
      const text = await llm(
        [{ role: 'user', content: `Create simple English scenario ${nonce} for ${firstName(req.studentName)}. Avoid: ${(req.recentTitles || []).join(' | ') || 'none'}` }],
        initializePrompt(req, booksText, nonce),
        700
      );
      const parsed = extractJson(text);
      const node = parsed ? nodeFromParsed(parsed, generatedInit.scenarioId, false) : null;
      if (node) {
        node.scenarioTitle = node.scenarioTitle || generatedInit.scenarioTitle;
        node.scenarioId = generatedInit.scenarioId;
        if (isBanned(node.scenarioTitle || '', req.recentTitles)) return generatedInit;
        return node;
      }
    } catch {
      // generated path below
    }
    return generatedInit;
  }

  if (action === 'respond') {
    const history = req.history || [];
    const nodeCount = history.filter(h => h.role === 'assistant').length;
    const isFinal = nodeCount >= 8;
    const generated = generateRespondNode(req);
    try {
      const text = await llm(
        history.map(h => ({ role: h.role, content: h.content })),
        respondPrompt(req, isFinal),
        600
      );
      const parsed = extractJson(text);
      const node = parsed ? nodeFromParsed(parsed, generated.scenarioId, isFinal) : null;
      if (node) {
        if (isFinal) {
          node.isEnded = true;
          node.choices = [];
        }
        return node;
      }
    } catch {
      // generated path below
    }
    return generated;
  }

  if (action === 'evaluate') {
    const stats = deltasFromHistory(req.history || []);
    const fallback = generateEvaluate(req);
    try {
      const text = await llm(
        [{ role: 'user', content: 'Return evaluation JSON only in simple English.' }],
        `You are the PinIT Mindset Evaluator for ${firstName(req.studentName)}.
History: ${JSON.stringify(req.history || []).slice(0, 6000)}
Evaluate in simple, encouraging English that any student can understand.
Return ONLY JSON:
{"report": "markdown report quoting choices", "spokenConclusion": "2-3 simple spoken sentences, max 60 words"}`,
        800
      );
      const parsed = extractJson(text);
      const report = parsed?.report ? String(parsed.report) : '';
      const spoken = parsed?.spokenConclusion ? String(parsed.spokenConclusion) : '';
      if (report.length > 50) {
        return {
          ok: true,
          report,
          spokenConclusion: spoken || fallback.spokenConclusion,
          ...stats,
          source: 'llm',
        };
      }
    } catch {
      // generated path below
    }
    return fallback;
  }

  throw new Error('Invalid action');
}

export const ROLEPLAY_TITLE_KEY = (userId: string) => `pinit_${userId}_roleplay_titles`;

export function readRecentRoleplayTitles(userId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ROLEPLAY_TITLE_KEY(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 12).map(String) : [];
  } catch {
    return [];
  }
}

export function rememberRoleplayTitle(userId: string, title?: string) {
  if (typeof window === 'undefined' || !title) return;
  try {
    const prev = readRecentRoleplayTitles(userId);
    const next = [title, ...prev.filter(t => t !== title)].slice(0, 12);
    localStorage.setItem(ROLEPLAY_TITLE_KEY(userId), JSON.stringify(next));
  } catch {
    // ignore quota
  }
}
