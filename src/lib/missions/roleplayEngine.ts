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
  const isFinal = nodeCount >= 10;
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
      message: `${name}, excellent work holding the line. The 15-minute crisis simulation has concluded. Your steady decisions guided the team through the emergency, protected customer trust, and brought our systems back to safety. Let's review your mindset and leadership results.`,
      choices: [],
      isEnded: true,
      source: 'generated',
    };
  }

  // 5 Progressive Incident Phases across 10 Turns
  const phase = Math.min(5, Math.floor(nodeCount / 2) + 1);

  const phaseBeats: Record<number, Record<string, string>> = {
    1: {
      rajesh: `${name}, the alerts just spiked! You chose: "${choice}". The dashboard is flashing yellow and customers are posting complaints. What is our immediate first move?`,
      abhijit: `${name}, you opted to: "${choice}". Leadership noticed the latency graph climbing. Tell me right now: are we pausing writes or investigating live?`,
      sneha: `${name}, I saw your choice: "${choice}". Chat room is filling up with error tickets. Should we pull the plug on incoming requests or keep troubleshooting?`,
      rohan: `${name}, you decided to: "${choice}". Good initial reaction, but let's stay methodical. Which component is showing the highest error rate right now?`,
    },
    2: {
      sneha: `${name}, people are panicking in the group chat after you chose: "${choice}". I have a quick hacky bypass ready in my branch. We can push it in 30 seconds to quiet the alarms. Do you want to take it?`,
      rajesh: `${name}, you chose to: "${choice}". If management asks, let's just say it's scheduled maintenance so nobody gets blamed. Should we cover for each other?`,
      abhijit: `${name}, about your step: "${choice}". I don't care about root causes right now. I just need this red indicator turned green before the VP calls me in 5 minutes!`,
      rohan: `${name}, regarding: "${choice}". Shortcut fixes will blow up the database later. Are you prepared to tell the team to hold the line and fix this properly?`,
    },
    3: {
      rohan: `${name}, you chose: "${choice}". The secondary database is now showing queue backup. If we isolate the bad worker, we save the core checkout, but some background jobs will pause. How do you isolate it safely?`,
      rajesh: `${name}, after you chose: "${choice}", I checked the memory heap. It's climbing fast. Do we do a clean roll-back of the last release or restart the containers one by one?`,
      abhijit: `${name}, you went with: "${choice}". Half the team wants to purge the cache, the other half wants a rollback. Make the call — which path protects user data?`,
      sneha: `${name}, regarding: "${choice}". We found the exact script that leaked memory. Should we revert the git commit or hot-patch the variable directly in production?`,
    },
    4: {
      abhijit: `${name}, the Client Relations VP is on line 2 asking what happened after you decided to: "${choice}". They want a guaranteed fix time. What exact message do we communicate to them right now?`,
      rohan: `${name}, you chose: "${choice}". The team is tired and tempers are rising. Someone wants to argue whose fault this was. How do you steer the conversation back to fixing the problem?`,
      rajesh: `${name}, you decided to: "${choice}". Marketing wants to post an apology tweet right away. Do we tell them the full truth or keep our update short and measured?`,
      sneha: `${name}, after your move: "${choice}", the server error rate dropped by 80%, but 20% of users are still seeing slow load times. Do we announce recovery now or wait for full verification?`,
    },
    5: {
      rohan: `${name}, the patch is deployed and verified after your choice: "${choice}". Traffic is normalizing. How do we ensure this exact bug can never happen again in next month's release?`,
      abhijit: `${name}, you guided us through this with: "${choice}". The dashboard is green. What is your plan for the blameless post-mortem meeting with the engineering team tomorrow?`,
      rajesh: `${name}, we survived the crunch after you chose: "${choice}". Thanks for keeping your cool. Who should document the recovery steps in our internal incident wiki?`,
      sneha: `${name}, traffic is 100% normal now following your choice: "${choice}". Let's do a final check on data consistency before closing the war room. What is our closing verification step?`,
    },
  };

  const phaseChoices: Record<number, RoleplayChoice[]> = {
    1: [
      {
        text: `Stay calm and verify the logs: isolate the affected service, check error rates, and communicate calmly to the team.`,
        delta: 4,
        rationale: 'Calm, methodical triage and transparent communication',
      },
      {
        text: `Hit panic restart on all production servers immediately without checking what caused the error.`,
        delta: -2,
        rationale: 'Rushed impulsive action that risks data corruption',
      },
      {
        text: `Dismiss the alarms as a false positive and tell complaining users to simply refresh their browsers.`,
        delta: -4,
        rationale: 'Denial and brushing off customer impact',
      },
    ],
    2: [
      {
        text: `Reject the quick hack: explain that hiding the error will cause worse data loss, and stick to the verified fix.`,
        delta: 4,
        rationale: 'Courage to uphold safety standards under acute pressure',
      },
      {
        text: `Silently push the untested hack to hide the red dashboard indicators before management notices.`,
        delta: -2,
        rationale: 'Superficial cosmetic fix that hides systemic failure',
      },
      {
        text: `Blame the junior engineer who merged the PR and refuse to take responsibility until they apologize.`,
        delta: -4,
        rationale: 'Toxic blame culture and dodging accountability',
      },
    ],
    3: [
      {
        text: `Safely roll back to the last known stable release with peer review, and verify database integrity before re-enabling traffic.`,
        delta: 4,
        rationale: 'Safe containment, rollback hygiene, and verified data safety',
      },
      {
        text: `Directly edit live production database values using manual SQL queries without taking a backup.`,
        delta: -2,
        rationale: 'High-risk cowboy troubleshooting in a live environment',
      },
      {
        text: `Argue with the team over who wrote the code instead of taking action to stop the memory leak.`,
        delta: -4,
        rationale: 'Wasting critical incident time on unproductive infighting',
      },
    ],
    4: [
      {
        text: `Deliver an honest, professional status update: state the current customer impact, immediate mitigation in progress, and the next checkpoint in 15 minutes.`,
        delta: 4,
        rationale: 'Executive communication anchor: impact, action, timeline',
      },
      {
        text: `Make an unrealistic promise that everything will be 100% resolved in 2 minutes just to get leadership off the call.`,
        delta: -2,
        rationale: 'Over-promising trap that destroys trust when missed',
      },
      {
        text: `Confront the leadership angrily and tell them to stop bothering engineers while they are trying to work.`,
        delta: -4,
        rationale: 'Hostile communication and loss of professional composure',
      },
    ],
    5: [
      {
        text: `Verify 100% traffic stability, write automated regression tests to prevent repeats, and schedule a blameless post-mortem with actionable takeaways.`,
        delta: 4,
        rationale: 'Long-term engineering excellence and blameless learning culture',
      },
      {
        text: `Close the war room immediately and go home without verifying data integrity or writing any documentation.`,
        delta: -2,
        rationale: 'Cutting corners at the finish line without safety verification',
      },
      {
        text: `Write an incident email publicly criticizing other teams for causing the outage.`,
        delta: -4,
        rationale: 'Sabotaging cross-team trust and toxic retrospective culture',
      },
    ],
  };

  const message = phaseBeats[phase]?.[avatar] || `${name}, you chose to: "${choice}". Let's take the next measured step to protect the system and our team.`;
  const choices = phaseChoices[phase] || phaseChoices[1];

  return {
    ok: true,
    scenarioId,
    activeAvatar: avatar,
    avatarName: cast.name,
    avatarRole: cast.role,
    message,
    choices,
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
  const history = req.history || [];
  const nodeCount = history.filter(h => h.role === 'assistant').length;
  const phase = Math.min(5, Math.floor(nodeCount / 2) + 1);

  return `Continue the PinIT workplace scenario for ${name}.
User just chose: "${req.choice || ''}".
Simulation Step: Turn ${nodeCount} of 10 (Incident Phase ${phase} of 5).
isFinalNode: ${isFinal}.

CRITICAL INSTRUCTION - SIMPLE ENGLISH:
- Write in SIMPLE, NATURAL, EVERYDAY ENGLISH (Grade 6-8 level).
- Keep the dialogue direct, clear, and easy to understand.
- Absolutely NO jargon, technical acronyms, or complex buzzwords.
- If isFinalNode (Turn >= 10), choices MUST be [] and isEnded true. Conclude the simulation warmly and acknowledge how the team resolved the incident.
- Otherwise, provide 3 simple, realistic, easy-to-understand choices:
  1. A calm, mature, responsible decision (+4 delta)
  2. A panicked quick shortcut or over-promising trap (-2 delta)
  3. An emotional, defensive, or blaming response (-4 delta)

Return ONLY valid JSON with no markdown:
{
  "activeAvatar": "rajesh|abhijit|sneha|rohan",
  "avatarName": "Full name",
  "avatarRole": "Role",
  "message": "Spoken reply to ${name} in simple English",
  "choices": [
    {"text": "Calm, responsible next step in simple words", "delta": 4},
    {"text": "Rushed shortcut or temporary fix in simple words", "delta": -2},
    {"text": "Defensive or blaming response in simple words", "delta": -4}
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
    const isFinal = nodeCount >= 10;
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
