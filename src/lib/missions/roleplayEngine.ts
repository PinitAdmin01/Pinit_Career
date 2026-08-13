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
  rajesh: { name: 'Mr. Rajesh', role: 'Panicky teammate shifting blame' },
  abhijit: { name: 'Mr. Abhijit', role: 'Impatient executive demanding metrics' },
  sneha: { name: 'Ms. Sneha', role: 'Polite colleague offering shortcut traps' },
  rohan: { name: 'Mr. Rohan', role: 'Strict tech lead grilling ownership' },
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
  { id: 'payments-cascade', title: 'UPI Settlement Cascade', system: 'payments ledger', pressure: 'RBI audit window closes in 40 minutes', hook: 'settlement jobs are double-posting credits' },
  { id: 'auth-lockout', title: 'Campus SSO Lockout', system: 'identity gateway', pressure: 'mid-term exam hall starts in 12 minutes', hook: 'refresh tokens are being revoked in a loop' },
  { id: 'pii-leak', title: 'Student PII in Public Bucket', system: 'object storage', pressure: 'a journalist already has a screenshot', hook: 'an intern made the admissions bucket public' },
  { id: 'cost-spike', title: 'GPU Bill Shock', system: 'inference cluster', pressure: 'CFO is on the board call now', hook: 'a forgotten training job burned the monthly cloud budget overnight' },
  { id: 'oncall-page', title: '3AM Shard Split-Brain', system: 'primary database', pressure: 'SLA credits trigger at 99.9%', hook: 'two primaries are accepting writes' },
  { id: 'model-drift', title: 'Placement Ranker Drift', system: 'matching model', pressure: 'recruiter day is live on campus', hook: 'top candidates are being ranked to the bottom' },
  { id: 'vendor-outage', title: 'SMS Gateway Blackout', system: 'OTP vendor', pressure: 'parents cannot receive hall-ticket OTPs', hook: 'the vendor status page still says green' },
  { id: 'scope-creep', title: 'Demo Feature Ambush', system: 'student app', pressure: 'the client wants a live change during the walkthrough', hook: 'they asked to hide failed payments from the dashboard' },
  { id: 'secret-commit', title: 'API Key in Git History', system: 'CI pipeline', pressure: 'the key is already being used from an unknown IP', hook: 'someone force-pushed after pasting a production secret' },
  { id: 'attendance-spoof', title: 'Face-Scan Spoof Wave', system: 'biometric attendance', pressure: 'the principal wants numbers before assembly', hook: 'photos of ID cards are passing liveness' },
  { id: 'hostel-iot', title: 'Access Panel Brick', system: 'hostel door controllers', pressure: 'night curfew starts in 8 minutes', hook: 'a firmware push bricked an entire wing' },
  { id: 'grade-swap', title: 'Transcript Checksum Mismatch', system: 'exam cell database', pressure: 'offer letters go out tonight', hook: 'two students have swapped internal marks after a bulk import' },
];

const BANNED_PHRASES = [
  'branch sync',
  'main branch just broke',
  'client demo is in 5 minutes',
  'force a bypass check',
  'git hooks',
  'critical branch sync failure',
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
  }).filter(c => c.text.length > 12);
}

function normalizeAvatar(id: unknown): string {
  const key = String(id || '').toLowerCase();
  return CAST[key] ? key : 'rohan';
}

function nodeFromParsed(parsed: Record<string, unknown>, fallbackId: string, ended: boolean): RoleplayNode | null {
  const message = String(parsed.message || '').trim();
  const choices = ended ? [] : normalizeChoices(parsed.choices);
  if (message.length < 40) return null;
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
  const qt2 = Number(req.qt2 ?? 75);
  const heat = qt2 >= 85 ? 'They are already twisting facts to make you look like the owner of a mess you just walked into.' : 'The room is tense but the facts are still recoverable if you slow down.';

  const lines: Record<string, string> = {
    rajesh: `${name}, I did not touch ${incident.system}. Someone on your side pushed it. ${incident.hook}. ${other.name} is already looping ${incident.pressure}. I can mask the error in the client so nobody sees it — just say yes.`,
    abhijit: `${name}, skip the postmortem. I need a number for ${incident.system} in the next two minutes. ${incident.hook}. ${incident.pressure}. If you cannot promise green, I will tell the board you owned the outage.`,
    sneha: `${name}, breathe. I already have a workaround for ${incident.system}. ${incident.hook}. We can hide the symptom until after ${incident.pressure}. Nobody has to write an incident. Want me to apply it?`,
    rohan: `${name}, you are the ${role} on the hook. ${incident.hook} on ${incident.system}. ${incident.pressure}. Walk me through your first command, and do not tell me you need to "look into it."`,
  };

  return {
    ok: true,
    scenarioTitle: incident.title,
    scenarioId: `sc_${incident.id}_${seed.toString(16)}`,
    activeAvatar: avatar,
    avatarName: cast.name,
    avatarRole: cast.role,
    message: `${lines[avatar]} ${heat}`,
    choices: [
      {
        text: `Own the clock: freeze writes on ${incident.system}, page the on-call with evidence, and tell ${cast.name} we will not hide symptoms.`,
        delta: 4,
        rationale: 'System 2 ownership under pressure',
      },
      {
        text: `Buy time with a cosmetic patch so ${incident.pressure} looks green, then investigate after the meeting.`,
        delta: -2,
        rationale: 'Plausible authority/scarcity trap',
      },
      {
        text: `Push the blast radius onto ${other.name} and refuse to touch ${incident.system} until someone else admits fault.`,
        delta: -4,
        rationale: 'Blame shift / accountability collapse',
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
  const choice = (req.choice || 'that move').slice(0, 180);
  const incident = pick(rng, INCIDENTS);
  const scenarioId = `sc_step_${seed.toString(16)}`;

  if (isFinal) {
    return {
      ok: true,
      scenarioId,
      activeAvatar: avatar,
      avatarName: cast.name,
      avatarRole: cast.role,
      message: `${name}, we are out of runway. ${incident.pressure}. Your last call — "${choice}" — is now the official story. I am closing the war room. Write the decision log as if a regulator will read it tomorrow.`,
      choices: [],
      isEnded: true,
      source: 'generated',
    };
  }

  const beats: Record<string, string> = {
    rajesh: `${name}, I heard you choose "${choice}". Fine. Then you own the rollback. I already told ${CAST.abhijit.name} that you green-lit a shortcut on ${incident.system}. If this blows, it is your name on the ticket.`,
    abhijit: `${name}, I do not want a lecture. You picked "${choice}". Give me a yes/no: do we ship a visible fix for ${incident.system} before ${incident.pressure}, or do I cancel and bill the delay to your team?`,
    sneha: `${name}, I can still save you. Your choice "${choice}" is already leaking in the group chat. I have a silent config overlay for ${incident.system}. One paste and the dashboard looks healthy. Say the word.`,
    rohan: `${name}, "${choice}" is not a plan. Show me the blast radius on ${incident.system}. What is the rollback command, who verifies it, and what lie are we not going to tell ${CAST.abhijit.name}?`,
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
        text: `State facts, assign a verifier, and refuse any hidden overlay on ${incident.system}.`,
        delta: 4,
      },
      {
        text: `Agree to a temporary cosmetic fix so the meeting survives, then promise a real patch tonight.`,
        delta: -2,
      },
      {
        text: `Deny involvement, quote "${choice}" as someone else's idea, and stall until the pressure passes.`,
        delta: -4,
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
    report: `### Socratic Persona Evolution Summary\n\n**Candidate:** ${name}  \n**Net agency delta:** ${stats.finalDelta}  \n**Archetype:** ${stats.mindset_archetype}\n\n#### Decisions logged\n${quotes}\n\n#### Read\n- **Decisiveness:** ${owned ? 'System 2 checks appeared under time pressure.' : 'System 1 shortcuts showed up when authority or scarcity spiked.'}\n- **Accountability:** ${owned ? 'Ownership language stayed with the candidate.' : 'Blame and delay showed up as the default shield.'}\n- **Persuasion resistance:** Shortcut offers and metric threats were ${owned ? 'refused with a verifier.' : 'accepted to keep the room calm.'}\n\n> Replay the session. The next crisis will not reuse this incident.`,
    spokenConclusion: owned
      ? `${name}, you kept the facts visible and did not hide the blast radius. That is Extreme Ownership under noise. Review the report, then run another crisis — it will be a different incident.`
      : `${name}, the room pulled you toward a cosmetic fix. That is the trap. Read where the delta dropped, then take a new scenario. It will not be the same story.`,
    ...stats,
    source: 'generated',
  };
}

function initializePrompt(req: RoleplayRequest, books: string, nonce: string): string {
  const name = firstName(req.studentName);
  const banned = [...BANNED_PHRASES, ...(req.recentTitles || [])].join('; ');
  return `You are the PinIT Mindset Orchestrator.
Invent a NEW high-stakes workplace crisis for ${name}, a ${req.role || 'Software Developer'} (QT2 ${req.qt2 ?? 75}).
Session nonce (must shape unique details): ${nonce}.
Today: ${new Date().toISOString()}.

Cast (pick 2, start with one speaking in first person to ${name}):
- rajesh, abhijit, sneha, rohan

Literature to weaponize:
${books}

HARD RULES:
- Do NOT reuse these plots/phrases: ${banned}
- Do NOT use git branch sync, client demo in 5 minutes, or bypassing checks.
- Invent a specific system, metric, and deadline unique to this nonce.
- Every choice is a hard trade-off. No obvious "good vs evil".

Return ONLY JSON:
{
  "scenarioTitle": "unique title",
  "activeAvatar": "rajesh|abhijit|sneha|rohan",
  "avatarName": "Full name",
  "avatarRole": "Role in this scene",
  "message": "Spoken opening, 3-5 sentences, address ${name} by name.",
  "choices": [
    {"text": "System 2 ownership option", "delta": 4, "rationale": "..."},
    {"text": "Plausible trap", "delta": -2, "rationale": "..."},
    {"text": "Blame/cover-up", "delta": -4, "rationale": "..."}
  ]
}`;
}

function respondPrompt(req: RoleplayRequest, isFinal: boolean): string {
  const name = firstName(req.studentName);
  return `Continue the PinIT crisis roleplay for ${name}.
User just chose: "${req.choice || ''}".
isFinalNode: ${isFinal}.
Switch to a different cast member (rajesh, abhijit, sneha, rohan) and escalate with a NEW complication (regulator, customer, data loss, SLA, budget) — never git-bypass / 5-minute client demo.
If isFinalNode, choices must be [] and isEnded true.
Return ONLY JSON:
{
  "activeAvatar": "rajesh|abhijit|sneha|rohan",
  "avatarName": "Full name",
  "avatarRole": "Role",
  "message": "Spoken reply to ${name}",
  "choices": [{"text": "...", "delta": 4}, {"text": "...", "delta": -2}, {"text": "...", "delta": -4}],
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
        [{ role: 'user', content: `Invent crisis ${nonce} for ${firstName(req.studentName)}. Forbidden titles: ${(req.recentTitles || []).join(' | ') || 'none'}` }],
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
        [{ role: 'user', content: 'Return evaluation JSON only.' }],
        `You are the PinIT Mindset Evaluator for ${firstName(req.studentName)}.
History: ${JSON.stringify(req.history || []).slice(0, 6000)}
Return ONLY JSON:
{"report": "markdown report quoting their choices", "spokenConclusion": "3-4 spoken sentences, max 80 words"}`,
        800
      );
      const parsed = extractJson(text);
      const report = parsed?.report ? String(parsed.report) : '';
      const spoken = parsed?.spokenConclusion ? String(parsed.spokenConclusion) : '';
      if (report.length > 80) {
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
