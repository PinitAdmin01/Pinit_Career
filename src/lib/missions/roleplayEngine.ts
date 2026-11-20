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

export type RoleplayIncident = {
  id: string;
  title: string;
  system: string;
  pressure: string;
  hook: string;
  initialChoices?: RoleplayChoice[];
};

const INCIDENTS: RoleplayIncident[] = [
  // ── 5 First-Year / 10+2 Student Situations (Pushed to Front) ──
  {
    id: 'lab-presentation-corrupt',
    title: 'Corrupted Lab Presentation File',
    system: 'shared project presentation file',
    pressure: 'faculty evaluation starts in 15 minutes',
    hook: 'the presentation slides file shows a corrupted file error on the lab projector',
    initialChoices: [
      {
        text: 'Stay calm and check our cloud drive version history to download the last saved auto-backup, while letting the faculty know our exact 5-minute recovery timeline.',
        delta: 4,
        rationale: 'Calm composure, immediate backup recovery, and transparent communication',
      },
      {
        text: 'Use the PDF draft exported on my phone to present the key slides on the projector while a teammate recovers the original slides file.',
        delta: 2,
        rationale: 'Practical mitigation using an existing offline fallback copy',
      },
      {
        text: 'Frantically keep double-clicking the corrupted file and restart the lab projector repeatedly without checking for backups.',
        delta: -2,
        rationale: 'Repetitive panic actions that waste critical preparation minutes',
      },
      {
        text: "Quickly copy and rename a senior's old presentation slides from last semester and pretend it is our original work.",
        delta: -4,
        rationale: 'Severe academic dishonesty and plagiarism under deadline pressure',
      },
    ],
  },
  {
    id: 'proxy-attendance-pressure',
    title: 'Class Proxy Attendance Pressure',
    system: 'daily attendance roll call',
    pressure: 'the professor is calling roll numbers right now',
    hook: 'your close friend woke up late and is repeatedly texting you to sign their proxy attendance on the sheet',
    initialChoices: [
      {
        text: 'Refuse to fake the signature: advise your friend to come to class immediately, explain their genuine reason to the professor, and offer to share lecture notes.',
        delta: 4,
        rationale: 'Ethical courage, upholding academic integrity, and offering constructive support',
      },
      {
        text: 'Quietly tell the professor that your friend had a sudden transit delay and is on their way, without falsely marking the attendance sheet.',
        delta: 2,
        rationale: 'Truthful advocacy for a classmate without compromising rules',
      },
      {
        text: "Ignore your friend's texts completely and pretend you never saw their messages while acting panicked during roll call.",
        delta: -2,
        rationale: 'Avoidance behavior that fails to communicate boundaries or expectations',
      },
      {
        text: "Sign your friend's name with a forged signature on the official sheet while the professor looks the other way.",
        delta: -4,
        rationale: 'Fraudulent attendance forgery that risks disciplinary debarment',
      },
    ],
  },
  {
    id: 'wrong-file-submission',
    title: 'Wrong File Uploaded on College Portal',
    system: 'college assignment portal',
    pressure: 'the submission portal closes in 10 minutes',
    hook: 'you just noticed you submitted an empty notes file instead of your completed assignment code',
    initialChoices: [
      {
        text: 'Immediately upload the correct file with a clear timestamped commit, and email the professor with the attachment before the deadline closes.',
        delta: 4,
        rationale: 'Fast verification, proactive submission correction, and paper-trail hygiene',
      },
      {
        text: 'Use the portal re-submission button to replace the file with your local draft, and take a screenshot of the successful upload receipt.',
        delta: 2,
        rationale: 'Practical use of platform re-upload features with proof',
      },
      {
        text: "Panic and assume the professor won't notice the empty file, hoping they will just give everyone average passing marks.",
        delta: -2,
        rationale: 'Passive wishful thinking that guarantees a zero grade later',
      },
      {
        text: 'Blame the college website for "corrupting" your file and demand an extension while fabricating an error screenshot.',
        delta: -4,
        rationale: 'Deceptive fabrication and false blaming of campus infrastructure',
      },
    ],
  },
  {
    id: 'teammate-ghosting-crisis',
    title: 'Teammate Unresponsive Before Demo',
    system: 'group project assignment',
    pressure: 'your group has to present to the faculty in 30 minutes',
    hook: 'one teammate did not finish their assigned slides and has stopped answering phone calls',
    initialChoices: [
      {
        text: 'Stay calm, redistribute their 3 remaining slides among the present team members, and honestly inform the evaluator about who completed which sections.',
        delta: 4,
        rationale: 'Decisive team restructuring, accountability, and transparent boundary management',
      },
      {
        text: 'Focus on presenting the completed 80% of the project strongly, and ask the professor for permission to submit the missing section by evening.',
        delta: 2,
        rationale: 'Protecting the team deliverables while requesting a structured remediation window',
      },
      {
        text: 'Spend the entire 30 minutes furiously complaining in the group chat and arguing about whose fault it is.',
        delta: -2,
        rationale: 'Toxic emotional spiraling that wastes available presentation prep time',
      },
      {
        text: "Delete the absent teammate's name from the title slide out of anger right before walking into the evaluation room.",
        delta: -4,
        rationale: 'Passive-aggressive retaliation without professional process or faculty notification',
      },
    ],
  },
  {
    id: 'accidental-group-leak',
    title: 'Accidental Notes Leak in Class Group',
    system: 'official college batch group',
    pressure: 'classmates and professors are actively reading notifications',
    hook: 'a private voice note criticizing a teammate was mistakenly forwarded to the official batch announcement group',
    initialChoices: [
      {
        text: 'Immediately delete the message for everyone if possible, post a sincere public apology for the mistake, and speak directly with the affected teammate in private.',
        delta: 4,
        rationale: 'Fast damage limitation, genuine public accountability, and empathetic resolution',
      },
      {
        text: 'Politely clarify the miscommunication in the group, take responsibility for the wrong forward, and ask everyone to disregard the accidental message.',
        delta: 2,
        rationale: 'Prompt ownership and measured clarification in public channels',
      },
      {
        text: 'Pretend your phone was hacked or that someone else sent the message from your device, avoiding direct accountability.',
        delta: -2,
        rationale: 'Transparent, unconvincing excuses that destroy peer trust',
      },
      {
        text: 'Delete your own WhatsApp account in panic and leave all project groups without apologizing or explaining anything.',
        delta: -4,
        rationale: 'Disappearing and abandoning social and academic responsibilities under fear',
      },
    ],
  },
  // ── Existing Campus & Technical Incidents (Preserved) ──
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

function shuffleChoices(choices: RoleplayChoice[], rng: () => number): RoleplayChoice[] {
  const arr = [...choices];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
    choices: shuffleChoices(incident.initialChoices || [
      {
        text: `Stay calm and isolate the failing component: check live error logs, enable read-only cache fallback, and post an honest update in 15 minutes.`,
        delta: 4,
        rationale: 'Calm, methodical containment and transparent ownership',
      },
      {
        text: `Temporarily shed non-critical background jobs to free up server CPU while we inspect the login bottleneck.`,
        delta: 2,
        rationale: 'Tactical load shedding to preserve core user flow',
      },
      {
        text: `Immediately trigger a full emergency rollback of all recent deployments before checking if the new code was even the cause.`,
        delta: -2,
        rationale: 'Premature panic rollback that rolls back unrelated valid changes',
      },
      {
        text: `Apply a quick cosmetic patch to hide the error message from users and investigate the real problem later.`,
        delta: -4,
        rationale: 'Superficial cosmetic fix that masks root causes',
      },
    ], rng),
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
      rajesh: `${name}, the pressure is on! You chose: "${choice}". The evaluator is watching our next move and time is ticking. What is our immediate first move?`,
      abhijit: `${name}, you opted to: "${choice}". The deadline is right in front of us. Tell me right now: are we pausing to regroup or troubleshooting live?`,
      sneha: `${name}, I saw your choice: "${choice}". The team is getting anxious. Should we halt submissions or keep working through the problem?`,
      rohan: `${name}, you decided to: "${choice}". Good initial reaction, but let's stay methodical. Which part of the work is showing the biggest problem right now?`,
    },
    2: {
      sneha: `${name}, teammates are panicking in the chat after you chose: "${choice}". I have a quick copy-paste hack ready. We can push it in 30 seconds to hide the error. Do you want to take it?`,
      rajesh: `${name}, you chose to: "${choice}". If the professor asks, let's just say the college wifi failed so nobody gets blamed. Should we cover for each other?`,
      abhijit: `${name}, about your step: "${choice}". I don't care about excuses right now. I just need this fixed before the evaluator walks over in 5 minutes!`,
      rohan: `${name}, regarding: "${choice}". Shortcut fixes will blow up during the evaluation. Are you prepared to tell the team to hold the line and fix this properly?`,
    },
    3: {
      rohan: `${name}, you chose to: "${choice}". We found an older saved copy, but it is missing the last section. If we present this, we guarantee a safe submission, but lose bonus points. How do you decide?`,
      rajesh: `${name}, after you chose: "${choice}", I checked the remaining time. It is slipping fast. Do we do a clean roll-back to our draft or try to re-write from memory?`,
      abhijit: `${name}, you went with: "${choice}". Half the team wants to restart from scratch, the other half wants to submit what we have. Make the call — which path protects our marks?`,
      sneha: `${name}, regarding: "${choice}". We found the exact mistake that caused the crash. Should we fix it properly or just comment out the broken lines?`,
    },
    4: {
      abhijit: `${name}, the professor is asking what happened after you decided to: "${choice}". They want a guaranteed completion time. What exact message do we communicate right now?`,
      rohan: `${name}, you chose: "${choice}". The team is stressed and someone wants to argue whose fault this was. How do you steer the conversation back to finishing the project?`,
      rajesh: `${name}, you decided to: "${choice}". The class representative wants to announce an issue in the group chat. Do we tell everyone the full truth or keep our update calm and measured?`,
      sneha: `${name}, after your move: "${choice}", the main error is resolved, but one slide looks unformatted. Do we present now or take 2 minutes to verify?`,
    },
    5: {
      rohan: `${name}, the project is presented and verified after your choice: "${choice}". How do we ensure this exact mistake can never happen again in our next semester submission?`,
      abhijit: `${name}, you guided us through this with: "${choice}". The evaluation went smoothly. What is your plan for the team debrief meeting tomorrow?`,
      rajesh: `${name}, we survived the crunch after you chose: "${choice}". Thanks for keeping your cool. Who should document the recovery notes in our shared folder?`,
      sneha: `${name}, everything is back to normal now following your choice: "${choice}". Let's do a final check on all files before leaving the lab. What is our closing verification step?`,
    },
  };

  const phaseChoices: Record<number, RoleplayChoice[]> = {
    1: [
      {
        text: `Stay calm, inspect the saved files and error details methodically, and share an honest recovery plan with the team.`,
        delta: 4,
        rationale: 'Calm composure, methodical triage, and transparent communication',
      },
      {
        text: `Preserve the working portions of our project and keep backups safe while we troubleshoot the issue.`,
        delta: 2,
        rationale: 'Practical mitigation and preventing secondary loss',
      },
      {
        text: `Frantically restart the machine repeatedly without checking what caused the error, risking more lost work.`,
        delta: -2,
        rationale: 'Impulsive panic actions that waste critical preparation minutes',
      },
      {
        text: `Dismiss the problem as someone else's fault and tell teammates to ignore it until the deadline passes.`,
        delta: -4,
        rationale: 'Denial, evasion, and blaming others under pressure',
      },
    ],
    2: [
      {
        text: `Firmly reject the quick hack: explain that hiding the error will ruin our credibility, and stick to honest recovery.`,
        delta: 4,
        rationale: 'Courage to uphold academic integrity and ethical standards',
      },
      {
        text: `Apply a safe, temporary fallback using verified offline notes while we properly resolve the main issue.`,
        delta: 2,
        rationale: 'Pragmatic and legitimate fallback without compromising honesty',
      },
      {
        text: `Hide the error screen superficially so it looks fine from a distance, hoping nobody inspects it closely.`,
        delta: -2,
        rationale: 'Superficial cosmetic masking that hides active defects',
      },
      {
        text: `Secretly paste in unverified work copied from the internet without checking if it even runs or breaks rules.`,
        delta: -4,
        rationale: 'Academic dishonesty and plagiarism under panic',
      },
    ],
    3: [
      {
        text: `Safely recover from our last verified draft or cloud revision with peer confirmation, ensuring complete data honesty.`,
        delta: 4,
        rationale: 'Controlled recovery hygiene and data consistency verification',
      },
      {
        text: `Safeguard the working modules so the team can demonstrate 80% working output without risking total project failure.`,
        delta: 2,
        rationale: 'Pragmatic damage control to secure core deliverables',
      },
      {
        text: `Freeze up out of panic and stop all work for the day, waiting for someone else to step in and solve it.`,
        delta: -2,
        rationale: 'Organizational paralysis and giving up under stress',
      },
      {
        text: `Make reckless manual modifications directly to the only copy of our file without taking a backup first.`,
        delta: -4,
        rationale: 'High-risk cowboy intervention that risks destroying remaining work',
      },
    ],
    4: [
      {
        text: `Deliver an honest update to the professor: explain the exact issue, the recovery underway, and our verified completion checkpoint.`,
        delta: 4,
        rationale: 'Executive communication anchor: honesty, action, timeline',
      },
      {
        text: `Brief the team and class coordinator with clear facts and realistic expectations while staying focused on the fix.`,
        delta: 2,
        rationale: 'Proactive alignment and expectation management',
      },
      {
        text: `Refuse to give any update to the faculty, avoiding their calls until the evaluation is already over.`,
        delta: -2,
        rationale: 'Information blackout that destroys trust and earns zero marks',
      },
      {
        text: `Make an unrealistic promise that everything is 100% finished in 1 minute just to get the professor off your back.`,
        delta: -4,
        rationale: 'Over-promising falsehoods that destroy credibility',
      },
    ],
    5: [
      {
        text: `Verify 100% file stability, save automated backups to cloud storage to prevent repeats, and conduct a blameless team recap.`,
        delta: 4,
        rationale: 'Long-term excellence and blameless retrospective learning',
      },
      {
        text: `Document the step-by-step recovery process in our study notes so the team is prepared for future practical exams.`,
        delta: 2,
        rationale: 'Institutional memory and operational readiness',
      },
      {
        text: `Mark the task as done immediately without opening the file to verify that the submission is complete and intact.`,
        delta: -2,
        rationale: 'Premature closure without end-to-end verification',
      },
      {
        text: `Log off and walk away immediately without organizing files or thanking teammates, assuming someone else will clean up.`,
        delta: -4,
        rationale: 'Abandoning post-incident stewardship and accountability',
      },
    ],
  };

  const message = phaseBeats[phase]?.[avatar] || `${name}, you chose to: "${choice}". Let's take the next measured step to protect the system and our team.`;
  const choices = shuffleChoices(phaseChoices[phase] || phaseChoices[1], rng);

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
  const delta = stats.finalDelta;

  const userMoves = history.filter(h => h.role === 'user');
  const hasShortcut = userMoves.some(m => /cosmetic|untested|silently|panic|dismiss|blame|manual sql|hack/i.test(m.content));
  const hasOwnership = userMoves.some(m => /honest|isolate|calm|verify|rollback|post-mortem|ownership|rate-limiter|circuit breaker/i.test(m.content));

  const verdictRating =
    delta >= 12 ? 'Exceptional Incident Leadership' :
    delta >= 6 ? 'Solid Systemic Ownership' :
    delta >= 0 ? 'Pragmatic Incident Response' :
    delta >= -6 ? 'Vulnerable to Shortcut Traps' :
    'Critical Incident Breakdown';

  const grade =
    delta >= 12 ? 'Grade A+ (Calm Leadership)' :
    delta >= 6 ? 'Grade A (Disciplined Ownership)' :
    delta >= 0 ? 'Grade B (Pragmatic Execution)' :
    delta >= -6 ? 'Grade C (High Panic Risk)' :
    'Grade D (Avoided Accountability)';

  const strengths: string[] = [];
  if (hasOwnership || delta >= 0) {
    strengths.push('• **Systemic Integrity:** You took direct personal ownership of system stability and resisted dangerous quick-fix cover-ups.');
    strengths.push('• **Transparent Communication:** You prioritized honest, realistic timeframes with team leads instead of hiding operational failures.');
    strengths.push('• **Disciplined Verification:** You kept your cool under severe time crunch, ensuring diagnostics and safety checks were maintained.');
  } else {
    strengths.push('• **Rapid Engagement:** You engaged with the crisis immediately without abandoning the war room.');
    strengths.push('• **Triage Awareness:** You recognized the urgency and stakeholder pressure surrounding production outages.');
  }

  const blindspots: string[] = [];
  if (hasShortcut || delta < 6) {
    blindspots.push('• **Temptation by Expedient Workarounds:** You were inclined toward quick cosmetic patches or unverified restarts. In production, cosmetic fixes mask root causes while silent data corruption accumulates.');
    blindspots.push('• **Pressure Vulnerability:** When executives or teammates applied time pressure, you risked bypassing peer review and verification protocols.');
  } else {
    blindspots.push('• **Zero Critical Blind Spots:** You maintained disciplined System 2 engineering rigor throughout all 5 escalation phases.');
  }

  const takeaway = delta >= 6
    ? 'Rule of Thumb: In high-stakes production outages, transparent communication buys engineering team time; verified containment always beats hasty guesswork.'
    : 'Rule of Thumb: Never apply cosmetic bypasses to silence active alarms. Real corporate leadership is built on owning the truth, isolating the failure, and communicating reality.';

  const timeline = userMoves.map((m, idx) => {
    return `${idx + 1}. Turn ${idx + 1}: "${m.content.slice(0, 120)}${m.content.length > 120 ? '...' : ''}"`;
  }).join('\n') || '1. Turn 1: Initial Containment Action Logged';

  const report = [
    `### EXECUTIVE VERDICT & SCORE`,
    `**Candidate:** ${name}`,
    `**Rating:** ${verdictRating} (${delta >= 0 ? '+' : ''}${delta} pts)`,
    `**Grade:** ${grade} • Archetype: ${stats.mindset_archetype}`,
    `**Summary:** ${delta >= 0 ? 'You demonstrated reliable engineering maturity, prioritizing data safety and cross-team trust.' : 'You struggled under high-stress stakeholder pressure, falling into shortcut traps that increase systemic risk.'}`,
    ``,
    `### 🟢 WHAT YOU HANDLED WELL (STRENGTHS)`,
    strengths.join('\n'),
    ``,
    `### 🔴 WHAT WENT WRONG & BLIND SPOTS`,
    blindspots.join('\n'),
    ``,
    `### 🎯 SENIOR LEADERSHIP TAKEAWAY`,
    takeaway,
    ``,
    `### 📋 DECISION TIMELINE`,
    timeline
  ].join('\n');

  return {
    ok: true,
    report,
    spokenConclusion: delta >= 0
      ? `${name}, outstanding work holding the line. You stayed calm, told the truth, and took full ownership. That is how real senior engineers solve problems under pressure.`
      : `${name}, you fell for a quick shortcut when the pressure spiked. In a production crisis, always be honest, protect data safety, and never try to hide problems.`,
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
- Provide 4 distinct, realistic, professional choices testing real technical/operational trade-offs:
  Choice 1: Calm, honest, systemic ownership (+4 delta)
  Choice 2: Tactical load shedding / pragmatic mitigation (+2 delta)
  Choice 3: Conservative rollback / safe quarantine (-2 delta)
  Choice 4: Rushed expedient cosmetic bypass / unverified patch (-4 delta)

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
- Otherwise, provide 4 distinct, realistic, professional choices testing operational trade-offs:
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
