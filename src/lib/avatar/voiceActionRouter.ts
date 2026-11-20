/**
 * voiceActionRouter — Accent-Tolerant, Intent-Gated Voice Action Router
 *
 * Maps explicit voice action commands (e.g. "hey priya start mission", "start quessst",
 * "interview start karo", "scan skill gap") to actionable deep-links across all 12
 * canonical Left Sidebar student tabs.
 *
 * Strict gating invariants:
 * - Requires an explicit action/start verb compatible with the target action.
 * - Never hijacks plain navigation ("go to mission tab", "open quests", "hey priya arena").
 * - Never hijacks informational questions ("what are my priorities", "what should i do").
 * - Reuses phonetic & elongation normalization from useVoiceNavigation.ts for Indian-English
 *   accents, elongated speech, and SOV word order.
 */

import {
  collapseElongatedChars,
  phoneticKey,
} from '@/components/avatar/hooks/useVoiceNavigation';

export interface VoiceActionMatch {
  matched: boolean;
  actionId: string;
  path: string;
  displayName: string;
  actionLabel: string;
  spokenReply: string;
  confidence: number;
  autoStartSupported: boolean;
}

export interface LeftSidebarVoiceActionMeta {
  actionId: string;
  basePath: string;
  actionPath: string;
  displayName: string;
  autoStartSupported: boolean;
  exampleCommand: string;
}

type VerbGroup = 'launch' | 'create' | 'scan' | 'discover' | 'inspect' | 'read' | 'setup';

interface VoiceActionDefinition extends LeftSidebarVoiceActionMeta {
  actionLabel: string;
  spokenReply: string;
  allowedVerbGroups: ReadonlyArray<VerbGroup>;
  /** Synonyms scored against the action target tokens (multi-word and single-word). */
  synonyms: ReadonlyArray<string>;
  /** Small specificity priority when two actions tie on score (higher wins). */
  specificity?: number;
}

const ACTION_DEFINITIONS: ReadonlyArray<VoiceActionDefinition> = [
  // 1. Daily Missions
  {
    actionId: 'start_mission',
    basePath: '/missions',
    actionPath: '/missions?roleplay=true',
    displayName: 'Daily Missions',
    actionLabel: 'Start Daily Mission',
    spokenReply: 'Opening Daily Missions and preparing your Socratic roleplay simulator.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, start mission',
    allowedVerbGroups: ['launch', 'create'],
    synonyms: [
      'daily mission', 'daily missions', 'mission', 'missions', 'mishun', 'mishan',
      'mishons', 'mishon', 'roleplay', 'role play', 'role-play', 'socratic roleplay',
      'crisis simulation', 'mindset simulator', 'evolve yourself', 'daily challenge',
      'daily task', 'daily tasks', 'simulator',
    ],
  },

  // 2. Courses / Quests
  {
    actionId: 'start_lesson',
    basePath: '/quests',
    actionPath: '/quests?autostart=lesson',
    displayName: 'Courses',
    actionLabel: 'Start Next Lesson',
    spokenReply: 'Opening Courses and preparing your next active lesson.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, start lesson',
    allowedVerbGroups: ['launch'],
    synonyms: [
      'today quest', 'todays quest', 'today lesson', 'todays lesson', 'next lesson',
      'next quest', 'active lesson', 'course', 'courses', 'kors', 'korses', 'cors',
      'corses', 'lesson', 'lessons', 'leson', 'quest', 'quests', 'quessst', 'kwest',
      'class', 'classes', 'lecture', 'roadmap', 'curriculum', 'study', 'learning',
    ],
    specificity: 2,
  },

  // 3. Projects
  {
    actionId: 'start_project',
    basePath: '/projects',
    actionPath: '/projects?autostart=new',
    displayName: 'Projects',
    actionLabel: 'Create New Project',
    spokenReply: 'Opening Projects and launching the new capstone project builder.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, start project',
    allowedVerbGroups: ['launch', 'create'],
    synonyms: [
      'project', 'projects', 'projekts', 'projek', 'projeck', 'projecks', 'projct',
      'capstone', 'capstones', 'capstone project', 'own project', 'portfolio project',
      'independent project', 'custom project', 'github project',
    ],
  },

  // 4. Innovation Hub
  {
    actionId: 'start_squad',
    basePath: '/innovation-hub',
    actionPath: '/innovation-hub?autostart=squad',
    displayName: 'Innovation Hub',
    actionLabel: 'Create Hackathon Squad',
    spokenReply: 'Opening Innovation Hub and launching the squad creation workspace.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, start squad',
    allowedVerbGroups: ['launch', 'create'],
    synonyms: [
      'squad', 'squads', 'hackathon squad', 'hackathon', 'hackathons', 'hackaton',
      'prototype', 'prototypes', 'pitch prototype', 'live prototype',
      'innovation hub', 'innovation', 'inovation', 'inoveshan', 'inowation',
      'team project', 'team squad', 'ideas hub', 'innovate',
    ],
    specificity: 1,
  },

  // 5a. AI Interview (1v1 Mock Interview)
  {
    actionId: 'start_interview',
    basePath: '/interview',
    actionPath: '/interview?autostart=interview',
    displayName: 'AI Interview',
    actionLabel: 'Start Mock Interview',
    spokenReply: 'Opening AI Interview Studio and preparing your mock interview session.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, start interview',
    allowedVerbGroups: ['launch', 'create'],
    synonyms: [
      'ai interview', 'mock interview', 'interview', 'interviews', 'intervyu',
      'interwiew', 'intarvyu', 'intervew', 'mock', 'interview studio',
      'interview prep', 'technical interview', 'hr interview', 'behavioral interview',
    ],
  },

  // 5b. AI Interview — Group Discussion (GD)
  {
    actionId: 'start_gd',
    basePath: '/interview',
    actionPath: '/interview?tab=gd&autostart=gd',
    displayName: 'AI Interview (GD Practice)',
    actionLabel: 'Start Group Discussion',
    spokenReply: 'Opening GD Practice and setting up your boardroom group discussion.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, start group discussion',
    allowedVerbGroups: ['launch', 'create'],
    synonyms: [
      'gd', 'group discussion', 'group discusion', 'gd practice', 'gd session',
      'gd room', 'boardroom', 'panel discussion', 'group debate',
    ],
    specificity: 2,
  },

  // 6a. Digital Studio — Career Twin & Skill Gap Scan
  {
    actionId: 'scan_skill_gap',
    basePath: '/mirror',
    actionPath: '/mirror?tab=twin&autostart=scan',
    displayName: 'Digital Studio',
    actionLabel: 'Scan Skill Gaps',
    spokenReply: 'Opening Digital Studio and launching your Career Twin skill gap scan.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, scan skill gap',
    allowedVerbGroups: ['launch', 'scan', 'inspect'],
    synonyms: [
      'digital studio', 'dijital studio', 'skill gap', 'skill gaps', 'skills gap',
      'skill scan', 'gap scan', 'career twin', 'digital twin', 'twin', 'mirror', 'miror',
      'competency radar', 'skill radar',
    ],
  },

  // 6b. Digital Studio — ATS Resume Builder
  {
    actionId: 'build_resume',
    basePath: '/mirror',
    actionPath: '/mirror?tab=career-builder',
    displayName: 'Digital Studio (Resume Builder)',
    actionLabel: 'Build ATS Resume',
    spokenReply: 'Opening Digital Studio and launching the ATS Resume Builder.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, build resume',
    allowedVerbGroups: ['launch', 'create', 'scan'],
    synonyms: [
      'resume', 'resumes', 'rizume', 'rejume', 'ats resume', 'resume builder',
      'cv', 'career builder', 'curriculum vitae',
    ],
    specificity: 1,
  },

  // 6c. Digital Studio — Review AI Mistakes & Weak Areas
  {
    actionId: 'review_mistakes',
    basePath: '/mirror',
    actionPath: '/mirror?tab=mistakes',
    displayName: 'Digital Studio (Mistakes)',
    actionLabel: 'Review Mistakes & Gaps',
    spokenReply: 'Opening Digital Studio to audit your recorded mistakes and weak areas.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, review mistakes',
    allowedVerbGroups: ['launch', 'inspect', 'scan'],
    synonyms: [
      'mistakes', 'mistake', 'my mistakes', 'errors', 'wrong answers',
      'weak areas', 'weakness', 'weaknesses', 'missed questions',
    ],
    specificity: 1,
  },

  // 7. Attention Span
  {
    actionId: 'start_focus',
    basePath: '/attention-span',
    actionPath: '/attention-span?autostart=focus',
    displayName: 'Attention Span',
    actionLabel: 'Start Focus Sprint',
    spokenReply: 'Opening Attention Span and launching your Focus Fire cognitive sprint.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, start focus sprint',
    allowedVerbGroups: ['launch'],
    synonyms: [
      'attention span', 'attention', 'atenshan', 'atention', 'attenshan',
      'focus', 'focus sprint', 'focus mode', 'focus trainer', 'focus fire',
      'pomodoro', 'concentration', 'brain drill', 'brain drills', 'deep focus',
    ],
  },

  // 8. Arena
  {
    actionId: 'start_duel',
    basePath: '/arena',
    actionPath: '/arena?autostart=duel',
    displayName: 'Arena',
    actionLabel: 'Start Arena Duel',
    spokenReply: 'Opening the Arena and preparing your 1v1 coding battle launch.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, start duel',
    allowedVerbGroups: ['launch', 'create'],
    synonyms: [
      'arena', 'arenaa', 'arina', 'errina', 'duel', 'duels', 'battle', 'battles',
      '1v1', 'coding battle', 'code battle', 'code wars', 'codewars', 'speedrun',
      'sparring', 'battle arena', 'challenging arena', 'pvp',
    ],
  },

  // 9. My Network
  {
    actionId: 'find_peers',
    basePath: '/friends',
    actionPath: '/friends?autostart=find',
    displayName: 'My Network',
    actionLabel: 'Find Peers',
    spokenReply: 'Opening My Network so you can discover and connect with peers.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, find friends',
    allowedVerbGroups: ['launch', 'discover'],
    synonyms: [
      'friends', 'friend', 'frends', 'frnds', 'peers', 'peer', 'networking',
      'network', 'netwark', 'netwerk', 'my network', 'classmates', 'connections',
      'campus network', 'study buddies',
    ],
  },

  // 10. Notifications
  {
    actionId: 'check_notifications',
    basePath: '/notifications',
    actionPath: '/notifications?autostart=unread',
    displayName: 'Notifications',
    actionLabel: 'Check Notifications',
    spokenReply: 'Opening Notifications and jumping straight to your alerts.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, check notifications',
    allowedVerbGroups: ['launch', 'inspect', 'read'],
    synonyms: [
      'notifications', 'notification', 'notifikesan', 'notifikeshan', 'notifs',
      'unread notifications', 'alerts', 'alert', 'unread alerts', 'updates',
      'inbox', 'announcements',
    ],
  },

  // 11a. Profile — Voice Setup & Calibration
  {
    actionId: 'setup_voice',
    basePath: '/profile',
    actionPath: '/profile?autostart=voice',
    displayName: 'Profile',
    actionLabel: 'Setup Voice Calibration',
    spokenReply: 'Opening Profile Settings and jumping to Voice Registration and Microphone Calibration.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, setup voice',
    allowedVerbGroups: ['launch', 'setup', 'create', 'inspect'],
    synonyms: [
      'voice', 'my voice', 'voice setup', 'voice registration', 'voice biometric',
      'voice profile', 'microphone', 'mic', 'audio calibration', 'voys',
    ],
    specificity: 1,
  },

  // 11b. Profile — Career DNA Check
  {
    actionId: 'check_career_dna',
    basePath: '/profile',
    actionPath: '/profile?tab=career-dna',
    displayName: 'Profile',
    actionLabel: 'Check Career DNA',
    spokenReply: 'Opening your Profile Career DNA breakdown.',
    autoStartSupported: true,
    exampleCommand: 'Hey Priya, check career DNA',
    allowedVerbGroups: ['launch', 'inspect', 'scan'],
    synonyms: [
      'career dna', 'my career dna', 'dna', 'profile dna', 'skill passport',
      'credentials', 'profile', 'profail', 'profayl',
    ],
  },

  // 12. Dashboard
  {
    actionId: 'dashboard_summary',
    basePath: '/dashboard',
    actionPath: '/dashboard',
    displayName: 'Dashboard',
    actionLabel: 'Open Dashboard Summary',
    spokenReply: 'Opening your Dashboard command center overview.',
    autoStartSupported: false,
    exampleCommand: 'Hey Priya, check dashboard',
    allowedVerbGroups: ['launch', 'inspect'],
    synonyms: [
      'dashboard', 'dash board', 'dashbord', 'dajbord', 'deshbord',
      'dashboard summary', 'daily summary', 'command center', 'overview',
    ],
  },
];

export const LEFT_SIDEBAR_VOICE_ACTIONS: ReadonlyArray<LeftSidebarVoiceActionMeta> =
  ACTION_DEFINITIONS.map(({ actionId, basePath, actionPath, displayName, autoStartSupported, exampleCommand }) => ({
    actionId,
    basePath,
    actionPath,
    displayName,
    autoStartSupported,
    exampleCommand,
  }));

// ── Action Verb Lexicon (Strict Gating) ─────────────────────────────────────
// Plain navigation verbs (open, go, goto, navigate, switch, show, take, visit, enter)
// are intentionally EXCLUDED so plain navigation stays in useVoiceNavigation.ts.

const MULTI_WORD_ACTION_VERBS: ReadonlyArray<{ phrase: string; group: VerbGroup }> = [
  { phrase: 'kick off', group: 'launch' },
  { phrase: 'set up', group: 'setup' },
];

const SINGLE_WORD_ACTION_VERBS: ReadonlyArray<{ verb: string; collapsed: string; group: VerbGroup }> = [
  // Launch / start verbs
  { verb: 'start', collapsed: collapseElongatedChars('start'), group: 'launch' },
  { verb: 'begin', collapsed: collapseElongatedChars('begin'), group: 'launch' },
  { verb: 'launch', collapsed: collapseElongatedChars('launch'), group: 'launch' },
  { verb: 'play', collapsed: collapseElongatedChars('play'), group: 'launch' },
  { verb: 'run', collapsed: collapseElongatedChars('run'), group: 'launch' },
  { verb: 'initiate', collapsed: collapseElongatedChars('initiate'), group: 'launch' },
  { verb: 'resume', collapsed: collapseElongatedChars('resume'), group: 'launch' },
  { verb: 'continue', collapsed: collapseElongatedChars('continue'), group: 'launch' },
  { verb: 'pitch', collapsed: collapseElongatedChars('pitch'), group: 'launch' },
  { verb: 'shuru', collapsed: collapseElongatedChars('shuru'), group: 'launch' },
  { verb: 'chalu', collapsed: collapseElongatedChars('chalu'), group: 'launch' },
  // Creation verbs
  { verb: 'create', collapsed: collapseElongatedChars('create'), group: 'create' },
  { verb: 'build', collapsed: collapseElongatedChars('build'), group: 'create' },
  { verb: 'new', collapsed: collapseElongatedChars('new'), group: 'create' },
  // Scan verbs
  { verb: 'scan', collapsed: collapseElongatedChars('scan'), group: 'scan' },
  // Discovery / networking verbs
  { verb: 'find', collapsed: collapseElongatedChars('find'), group: 'discover' },
  { verb: 'connect', collapsed: collapseElongatedChars('connect'), group: 'discover' },
  // Inspection / reading verbs
  { verb: 'check', collapsed: collapseElongatedChars('check'), group: 'inspect' },
  { verb: 'read', collapsed: collapseElongatedChars('read'), group: 'read' },
  { verb: 'review', collapsed: collapseElongatedChars('review'), group: 'inspect' },
  { verb: 'audit', collapsed: collapseElongatedChars('audit'), group: 'inspect' },
  // Setup / registration verbs
  { verb: 'setup', collapsed: collapseElongatedChars('setup'), group: 'setup' },
  { verb: 'register', collapsed: collapseElongatedChars('register'), group: 'setup' },
  { verb: 'calibrate', collapsed: collapseElongatedChars('calibrate'), group: 'setup' },
];

const WAKE_AND_MENTOR_REGEX =
  /\b(?:hey|hwy|hay|hi|hello|ok|okay|yo|please|pls|plz|ms|mr|priya|preya|pria|freeya|freya|riya|anish|aneesh|kashyap|karthic|karthik|maya|divya|aisha|vikram|rohan|shalini|pinit|mentor)\b/gi;

// Block informational questions and advisory queries even if they contain an action word
// (e.g., "what are my priorities", "what should i do", "how do i start a project", "should i start duel").
const QUESTION_EXCLUSION_REGEX =
  /^\s*(?:what|whats|why|how|when|where|who|which|is|are|am|was|were|do\s+i|did\s+i|have\s+i|can\s+i|could\s+i|should\s+i|would\s+i|tell\s+me|explain|can\s+you\s+(?:tell|explain)|could\s+you\s+(?:tell|explain))\b/i;

// Block casual browse phrasing ("check out missions") from masquerading as an action trigger
const BROWSE_EXCLUSION_REGEX = /\bcheck\s+out\b/i;

const FILLER_WORDS = new Set([
  'the', 'a', 'an', 'my', 'me', 'to', 'for', 'of', 'in', 'on', 'at', 'up', 'into', 'with',
  'please', 'pls', 'plz', 'can', 'could', 'would', 'you', 'u', 'i', 'we', 'want', 'wanna',
  'need', 'let', 'lets', 'just', 'now', 'right', 'karo', 'kardo', 'kar', 'do', 'bro', 'yaar',
  'tab', 'tabs', 'page', 'section', 'screen', 'menu', 'option', 'mode', 'session',
]);

// ── String Distance & Phonetic Scoring ──────────────────────────────────────
function levenshtein(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;
  if (a === b) return 0;

  const prev = new Array<number>(lb + 1);
  const curr = new Array<number>(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;

  for (let i = 1; i <= la; i++) {
    curr[0] = i;
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= lb; j++) prev[j] = curr[j];
  }
  return prev[lb];
}

function wordSimilarity(rawSpoken: string, rawTarget: string): number {
  const spoken = collapseElongatedChars(rawSpoken);
  const target = collapseElongatedChars(rawTarget);
  if (!spoken || !target) return 0;
  if (spoken === target) return 1.0;

  // Guard short tokens ("gd", "cv", "mic") against fuzzy false matches
  if (spoken.length < 3 || target.length < 3) {
    return 0;
  }

  // Exact phonetic key match (e.g., mishun/mission, korses/courses, atenshan/attention)
  const pSpoken = phoneticKey(rawSpoken);
  const pTarget = phoneticKey(rawTarget);
  if (pSpoken.length >= 3 && pSpoken === pTarget) return 0.93;

  // Near-phonetic match for longer tokens (e.g., intervyu/interview, notifikesan/notification)
  if (pSpoken.length >= 4 && pTarget.length >= 4 && levenshtein(pSpoken, pTarget) <= 1) {
    return 0.88;
  }

  // Prefix match for truncated words
  if (target.startsWith(spoken) && spoken.length >= 4) return 0.86;
  if (spoken.startsWith(target) && target.length >= 4) return 0.85;

  // Bounded Levenshtein edit distance on elongation-collapsed tokens
  const maxLen = Math.max(spoken.length, target.length);
  const dist = levenshtein(spoken, target);
  const tolerance = maxLen <= 4 ? 1 : maxLen <= 7 ? 2 : 3;
  if (dist <= tolerance) {
    return Math.max(0.55, 1.0 - (dist / maxLen) * 0.45);
  }

  return 0;
}

function phraseSimilarity(spokenWords: string[], synonymWords: string[]): number {
  if (synonymWords.length === 0 || spokenWords.length === 0) return 0;

  let totalScore = 0;
  const usedIndices = new Set<number>();

  for (const synWord of synonymWords) {
    let bestScore = 0;
    let bestIdx = -1;
    for (let i = 0; i < spokenWords.length; i++) {
      if (usedIndices.has(i)) continue;
      const sim = wordSimilarity(spokenWords[i], synWord);
      if (sim > bestScore) {
        bestScore = sim;
        bestIdx = i;
      }
    }
    if (bestIdx >= 0) usedIndices.add(bestIdx);
    totalScore += bestScore;
  }

  return totalScore / synonymWords.length;
}

// ── Extract Action Verbs (order-agnostic for SVO and SOV phrasing) ──────────
interface ExtractedVerbs {
  verbGroups: Set<VerbGroup>;
  remainingText: string;
}

const RESUME_BEFORE_NOUN_CUES = new Set([
  'start', 'begin', 'launch', 'create', 'build', 'new', 'scan', 'check',
  'open', 'show', 'view', 'visit', 'my', 'a', 'the', 'ats', 'portfolio',
]);

const RESUME_AFTER_NOUN_CUES = new Set([
  'builder', 'build', 'create', 'start', 'begin', 'launch', 'scan', 'check',
]);

function extractActionVerbs(text: string): ExtractedVerbs {
  const verbGroups = new Set<VerbGroup>();
  // Protect "role play" / "role-play" so the word "play" inside the noun isn't stripped as a verb
  let working = text.replace(/\brole[\s-]+play\b/gi, 'roleplay');

  // 1. Multi-word action verbs ("kick off", "set up") anywhere in sentence
  for (const mv of MULTI_WORD_ACTION_VERBS) {
    const escaped = mv.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|\\s)${escaped}(?=\\s|$)`, 'gi');
    if (re.test(working)) {
      verbGroups.add(mv.group);
      working = working.replace(re, ' ');
    }
  }

  // 2. Single-word action verbs (elongation-tolerant: "staaart", "plaaay", "begiiin")
  const tokens = working.split(/\s+/).filter(Boolean);
  const keptTokens: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const collapsed = collapseElongatedChars(token);

    // Disambiguate noun "resume" (CV) vs verb "resume" ("resume lesson"):
    // e.g. "build resume", "start resume", "create my resume", "resume build karo", "start resume builder"
    if (collapsed === 'resume') {
      const prevCollapsed = i > 0 ? collapseElongatedChars(tokens[i - 1]) : '';
      const nextCollapsed = i + 1 < tokens.length ? collapseElongatedChars(tokens[i + 1]) : '';
      if (RESUME_BEFORE_NOUN_CUES.has(prevCollapsed) || RESUME_AFTER_NOUN_CUES.has(nextCollapsed)) {
        keptTokens.push(token);
        continue;
      }
    }

    // Preserve "scan" as part of compound targets like "run skill scan" / "start gap scan"
    if (collapsed === 'scan') {
      const prevCollapsed = i > 0 ? collapseElongatedChars(tokens[i - 1]) : '';
      if (prevCollapsed === 'skil' || prevCollapsed === 'gap') {
        verbGroups.add('scan');
        keptTokens.push(token);
        continue;
      }
    }

    let matchedGroup: VerbGroup | null = null;

    for (const sv of SINGLE_WORD_ACTION_VERBS) {
      if (collapsed === sv.collapsed) {
        matchedGroup = sv.group;
        break;
      }
      // Minor ASR typo tolerance for longer launch verbs (e.g., "launc", "begn")
      if (
        sv.collapsed.length >= 5 &&
        collapsed.length >= 4 &&
        levenshtein(collapsed, sv.collapsed) === 1
      ) {
        matchedGroup = sv.group;
        break;
      }
    }

    if (matchedGroup) {
      verbGroups.add(matchedGroup);
    } else {
      keptTokens.push(token);
    }
  }

  return {
    verbGroups,
    remainingText: keptTokens.join(' ').trim(),
  };
}

function hasMentorAddress(text: string): boolean {
  return /\b(?:hey|hwy|hay|hi|hello)\s+(?:ms\.?\s+|mr\.?\s+)?(?:priya|preya|pria|anish|aneesh)\b|\b(?:priya|preya|pria|anish|aneesh)\b/i.test(text);
}

function emptyMatch(): VoiceActionMatch {
  return {
    matched: false,
    actionId: '',
    path: '',
    displayName: '',
    actionLabel: '',
    spokenReply: '',
    confidence: 0,
    autoStartSupported: false,
  };
}

// ── Main Voice Action Intent Matcher ────────────────────────────────────────
export function matchVoiceActionIntent(
  rawTranscript: string,
  options?: { addressedMentor?: boolean }
): VoiceActionMatch {
  if (!rawTranscript || rawTranscript.trim().length < 3) {
    return emptyMatch();
  }

  const normalized = rawTranscript
    .toLowerCase()
    .replace(/['’]/g, '') // "today's" -> "todays"
    .replace(/[.,!?;:"()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized || BROWSE_EXCLUSION_REGEX.test(normalized)) {
    return emptyMatch();
  }

  const strippedOfWake = normalized
    .replace(WAKE_AND_MENTOR_REGEX, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!strippedOfWake) {
    return emptyMatch();
  }

  // Strict question exclusion: never hijack questions ("what are my priorities", "what should i do",
  // "how do i start interview", "should i start a duel")
  if (QUESTION_EXCLUSION_REGEX.test(strippedOfWake)) {
    return emptyMatch();
  }

  // Strict action-verb gating: MUST contain at least one explicit action/start verb
  const { verbGroups, remainingText } = extractActionVerbs(strippedOfWake);
  if (verbGroups.size === 0) {
    return emptyMatch();
  }

  const rawTokens = remainingText.split(/\s+/).filter(Boolean);
  const meaningfulTokens = rawTokens.filter((t) => !FILLER_WORDS.has(t));
  const wordsToScore = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

  if (wordsToScore.length === 0) {
    return emptyMatch();
  }

  const collapsedTargetPhrase = wordsToScore.map(collapseElongatedChars).join(' ');
  const addressedMentor = Boolean(options?.addressedMentor) || hasMentorAddress(normalized);

  const scored: Array<{ def: VoiceActionDefinition; score: number; multiWordHit: boolean }> = [];

  for (const def of ACTION_DEFINITIONS) {
    // Action must accept at least one of the detected verb groups
    const verbCompatible = def.allowedVerbGroups.some((g) => verbGroups.has(g));
    if (!verbCompatible) continue;

    let bestScore = 0;
    let bestMultiWord = false;

    for (const synonym of def.synonyms) {
      const synWords = synonym.split(/\s+/);
      const collapsedSyn = synWords.map(collapseElongatedChars).join(' ');

      // 1. Order-agnostic multi-word phonetic/fuzzy similarity
      const phraseScore = phraseSimilarity(wordsToScore, synWords);

      // 2. Direct containment on elongation-collapsed target phrase
      let containScore = 0;
      if (collapsedTargetPhrase.length >= 2 && collapsedTargetPhrase === collapsedSyn) {
        containScore = 1.0;
      } else if (
        collapsedTargetPhrase.length >= 4 &&
        collapsedSyn.length >= 4 &&
        collapsedTargetPhrase.includes(collapsedSyn)
      ) {
        containScore = 0.95;
      }

      // 3. Single-word best fuzzy/phonetic match
      let singleWordScore = 0;
      if (synWords.length === 1) {
        for (const w of wordsToScore) {
          const sim = wordSimilarity(w, synWords[0]);
          if (sim > singleWordScore) singleWordScore = sim;
        }
      }

      const candidateScore = Math.max(phraseScore, containScore, singleWordScore);
      const isMulti = synWords.length > 1 && Math.max(phraseScore, containScore) >= 0.85;

      if (candidateScore > bestScore || (candidateScore === bestScore && isMulti && !bestMultiWord)) {
        bestScore = candidateScore;
        bestMultiWord = isMulti;
      }
    }

    if (bestScore >= 0.62) {
      scored.push({ def, score: bestScore, multiWordHit: bestMultiWord });
    }
  }

  if (scored.length === 0) {
    return emptyMatch();
  }

  // Sort by: score desc, multi-word exact phrase hit desc, specificity desc
  scored.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (Math.abs(scoreDiff) > 0.03) return scoreDiff;
    if (a.multiWordHit !== b.multiWordHit) return a.multiWordHit ? -1 : 1;
    return (b.def.specificity || 0) - (a.def.specificity || 0);
  });

  const top = scored[0];
  const mentorBoost = addressedMentor ? 0.04 : 0;
  const finalConfidence = Math.min(1.0, Number((top.score + mentorBoost).toFixed(3)));

  if (finalConfidence < 0.64) {
    return emptyMatch();
  }

  return {
    matched: true,
    actionId: top.def.actionId,
    path: top.def.actionPath,
    displayName: top.def.displayName,
    actionLabel: top.def.actionLabel,
    spokenReply: top.def.spokenReply,
    confidence: finalConfidence,
    autoStartSupported: top.def.autoStartSupported,
  };
}

// ── Score multiple Web Speech API alternatives ──────────────────────────────
export function matchBestActionAlternative(
  alternatives: string[],
  options?: { addressedMentor?: boolean }
): VoiceActionMatch {
  let best = emptyMatch();

  if (!Array.isArray(alternatives) || alternatives.length === 0) {
    return best;
  }

  for (const alt of alternatives) {
    const candidate = matchVoiceActionIntent(alt, options);
    if (candidate.matched && candidate.confidence > best.confidence) {
      best = candidate;
    }
  }

  return best;
}
