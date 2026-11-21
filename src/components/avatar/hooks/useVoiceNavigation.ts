/**
 * useVoiceNavigation — Intent-Gated, Accent-Tolerant Voice Navigation Engine
 * Scoped strictly to the 12 canonical Left Sidebar student tabs (STUDENT_NAV + BOTTOM_NAV).
 *
 * Features:
 * - Strictly aligned to current Left Sidebar tabs (zero stale/removed routes).
 * - Indian-English & ESL phonetic normalization (e.g., "quessst", "korses", "mishun",
 *   "dajbord", "intervyu", "dijital studio", "inoveshan", "atenshan", "notifikesan").
 * - Broken sentence & SOV word-order tolerance (e.g., "hey priya navigate me to mission tab",
 *   "hey priya i want to go to quest", "priya mission tab open", "hey priya quessst").
 * - Question & conversation exclusion guards to prevent accidental navigation mid-chat.
 */

export interface RouteEntry {
  path: string;
  displayName: string;
  sidebarGroup: 'primary' | 'bottom';
  synonyms: string[];
}

export interface NavMatchOptions {
  /** True when the user explicitly addressed the mentor (e.g., "hey priya ..."). */
  addressedMentor?: boolean;
}

// ── Canonical 12 Left Sidebar Student Routes (STUDENT_NAV 8 + BOTTOM_NAV 4) ─
export const LEFT_SIDEBAR_ROUTES: RouteEntry[] = [
  // Primary Left Sidebar (8 tabs)
  {
    path: '/dashboard',
    displayName: 'Dashboard',
    sidebarGroup: 'primary',
    synonyms: [
      'dashboard', 'dash board', 'dashbord', 'dajbord', 'deshbord', 'dash',
      'home', 'home screen', 'home page', 'main page', 'main screen',
      'command center', 'overview',
    ],
  },
  {
    path: '/quests',
    displayName: 'Courses',
    sidebarGroup: 'primary',
    synonyms: [
      'courses', 'course', 'korses', 'kors', 'corses', 'cors', 'classes', 'class',
      'quests', 'quest', 'quessst', 'kwest', 'guest', 'lessons', 'lesson',
      'curriculum', 'syllabus', 'roadmap', 'study', 'learning', 'learn',
    ],
  },
  {
    path: '/missions',
    displayName: 'Daily Missions',
    sidebarGroup: 'primary',
    synonyms: [
      'daily missions', 'daily mission', 'missions', 'mission', 'mishun', 'mishan',
      'mishons', 'machine', 'daily tasks', 'daily task', 'daily challenges',
      'daily challenge', 'roleplay', 'role play', 'evolve yourself',
    ],
  },
  {
    path: '/projects',
    displayName: 'Projects',
    sidebarGroup: 'primary',
    synonyms: [
      'projects', 'project', 'projekts', 'projek', 'projeck', 'projecks',
      'capstone', 'capstones', 'capstone projects', 'portfolio projects',
      'build workspace', 'project workspace',
    ],
  },
  {
    path: '/innovation-hub',
    displayName: 'Innovation Hub',
    sidebarGroup: 'primary',
    synonyms: [
      'innovation hub', 'innovation', 'inovation', 'inoveshan', 'innovate',
      'inowation', 'hackathon', 'hackathons', 'hackathon squads', 'squads', 'squad',
      'team projects', 'ideas hub',
    ],
  },
  {
    path: '/interview',
    displayName: 'AI Interview',
    sidebarGroup: 'primary',
    synonyms: [
      'ai interview', 'interview', 'interviews', 'intervyu', 'interwiew', 'intarvyu',
      'mock interview', 'mock', 'interview studio', 'interview prep',
      'group discussion', 'gd', 'gd practice', 'boardroom',
    ],
  },
  {
    path: '/mirror',
    displayName: 'Digital Studio',
    sidebarGroup: 'primary',
    synonyms: [
      'digital studio', 'dijital studio', 'studio', 'mirror', 'miror',
      'career twin', 'digital twin', 'twin', 'skill gap', 'skill gaps',
      'resume', 'resume builder', 'ats', 'ats resume', 'cv', 'career builder',
    ],
  },
  {
    path: '/attention-span',
    displayName: 'Attention Span',
    sidebarGroup: 'primary',
    synonyms: [
      'attention span', 'attention', 'atenshan', 'atention', 'attenshan',
      'focus', 'focus mode', 'focus trainer', 'pomodoro', 'concentration',
      'brain drills', 'deep focus',
    ],
  },

  // Bottom Left Sidebar Utilities (4 tabs)
  {
    path: '/friends',
    displayName: 'My Network',
    sidebarGroup: 'bottom',
    synonyms: [
      'my network', 'network', 'netwark', 'netwerk', 'friends', 'friend',
      'frends', 'frnds', 'peers', 'connections', 'classmates', 'campus network',
    ],
  },
  {
    path: '/arena',
    displayName: 'Arena',
    sidebarGroup: 'bottom',
    synonyms: [
      'arena', 'arina', 'errina', 'arenaa', 'challenging arena', 'battle arena',
      'duel', 'duels', '1v1', 'code wars', 'speedrun', 'coding battle',
      'leaderboard', 'leader board', 'leagues', 'league', 'rankings', 'ranking',
    ],
  },
  {
    path: '/notifications',
    displayName: 'Notifications',
    sidebarGroup: 'bottom',
    synonyms: [
      'notifications', 'notification', 'notifikesan', 'notifikeshan', 'notifs',
      'alerts', 'alert', 'updates', 'bell', 'inbox',
    ],
  },
  {
    path: '/profile',
    displayName: 'Profile',
    sidebarGroup: 'bottom',
    synonyms: [
      'profile', 'profail', 'profayl', 'porfile', 'my profile', 'account',
      'my account', 'settings', 'career dna', 'dna', 'credentials', 'vault',
    ],
  },
];

// ── Navigation Intent Phrases (supports SVO, SOV, and broken English) ───────
const NAV_INTENT_PHRASES = [
  'i want to go to', 'i want to go', 'want to go to', 'want to go',
  'i need to go to', 'i need to go', 'need to go to', 'need to go',
  'navigate me to', 'navigate to', 'navigate me', 'navigate',
  'take me to', 'take me', 'bring me to', 'bring up', 'pull up',
  'show me', 'let me see', 'i want to see', 'can you open', 'please open',
  'can you show', 'please show', 'get me to', 'redirect me to', 'redirect to',
  'switch me to', 'switch to', 'shift me to', 'shift to', 'change to', 'swap to',
  'jump to', 'head to', 'move to', 'go to', 'goto', 'open up', 'open', 'visit',
  'show', 'enter', 'go',
];

const QUESTION_EXCLUSION_REGEX =
  /^\s*(?:what|why|how|when|where|who|is|are|am|can\s+i|should\s+i|tell\s+me\s+about|explain)\b/i;

const EXPLICIT_NAV_VERB_REGEX =
  /\b(?:go\s+to|goto|open|navigate(?:\s+me)?(?:\s+to)?|switch(?:\s+me)?\s+to|shift(?:\s+me)?\s+to|take\s+me(?:\s+to)?|bring\s+(?:me\s+to|up)|jump\s+to|move\s+to|head\s+to|visit|show\s+me|redirect(?:\s+me)?\s+to|want\s+to\s+go|need\s+to\s+go)\b/i;

// ── Elongation & Accent Normalization ───────────────────────────────────────
export function collapseElongatedChars(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(.)\1{2,}/g, '$1$1').replace(/(.)\1+/g, '$1');
}

export function phoneticKey(word: string): string {
  const cleaned = word
    .toLowerCase()
    .replace(/^[^a-z]+|[^a-z]+$/g, '')
    .replace(/(.)\1+/g, '$1'); // collapse elongated letters first: quessst -> quest

  if (!cleaned) return '';

  return cleaned
    .replace(/(?:tion|sion|shun|shan|san)$/g, 'sn')
    .replace(/ph/g, 'f')
    .replace(/ck/g, 'k')
    .replace(/qu/g, 'kw')
    .replace(/c(?=[eiy])/g, 's')
    .replace(/c/g, 'k')
    .replace(/sh|ch/g, 's')
    .replace(/th|dh/g, 't')
    .replace(/bh/g, 'b')
    .replace(/kh/g, 'k')
    .replace(/gh/g, 'g')
    .replace(/wh/g, 'w')
    .replace(/kn/g, 'n')
    .replace(/wr/g, 'r')
    .replace(/x/g, 'ks')
    .replace(/v/g, 'w')
    .replace(/[zj]/g, 's')
    .replace(/y/g, 'i')
    .replace(/[aeiou]/g, (m, i) => (i === 0 ? m : ''))
    .replace(/(.)\1+/g, '$1');
}

// ── Levenshtein Distance ────────────────────────────────────────────────────
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

// ── Score a single spoken token against a target keyword ────────────────────
function wordSimilarity(rawSpoken: string, rawTarget: string): number {
  const spoken = collapseElongatedChars(rawSpoken);
  const target = collapseElongatedChars(rawTarget);
  if (!spoken || !target) return 0;
  if (spoken === target) return 1.0;

  // Guard very short tokens (e.g., "gd", "ai", "cv") against fuzzy false matches
  if (spoken.length < 3 || target.length < 3) {
    return 0;
  }

  // Exact phonetic key match (handles Indian-English variants: korses/courses, mishun/mission, dajbord/dashboard)
  const pSpoken = phoneticKey(rawSpoken);
  const pTarget = phoneticKey(rawTarget);
  if (pSpoken.length >= 3 && pSpoken === pTarget) return 0.93;

  // Near-phonetic match for longer words (e.g., intervyu/interview, notifikesan/notification)
  if (pSpoken.length >= 4 && pTarget.length >= 4 && levenshtein(pSpoken, pTarget) <= 1) {
    return 0.88;
  }

  // Prefix truncation match
  if (target.startsWith(spoken) && spoken.length >= 4) return 0.86;
  if (spoken.startsWith(target) && target.length >= 4) return 0.85;

  // Edit distance on collapsed strings (handles quessst->quest, mishon->mission, profayl->profile)
  const maxLen = Math.max(spoken.length, target.length);
  const dist = levenshtein(spoken, target);
  const tolerance = maxLen <= 4 ? 1 : maxLen <= 7 ? 2 : 3;
  if (dist <= tolerance) {
    return Math.max(0.55, 1.0 - (dist / maxLen) * 0.45);
  }

  return 0;
}

// ── Multi-word order-agnostic phrase similarity ─────────────────────────────
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

// ── Navigation Match Result ─────────────────────────────────────────────────
export interface NavMatchResult {
  matched: boolean;
  path: string;
  displayName: string;
  confidence: number;
  candidates: Array<{ path: string; displayName: string; confidence: number }>;
}

const WAKE_AND_MENTOR_REGEX =
  /\b(?:hey|hwy|hay|hi|hello|ok|okay|yo|please|pls|plz|ms|mr|priya|preya|pria|freeya|freya|riya|anish|aneesh|akash|aakash|kashyap|karthic|karthik|maya|divya|aisha|vikram|rohan|shalini|pinit|mentor)\b/gi;

function stripWakeAndNavVerbs(text: string): string {
  let cleaned = text.replace(WAKE_AND_MENTOR_REGEX, ' ').replace(/\s+/g, ' ').trim();

  const sorted = [...NAV_INTENT_PHRASES].sort((a, b) => b.length - a.length);
  for (const phrase of sorted) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match anywhere in sentence so both SVO ("go to quest") and SOV ("quest tab open") work
    const re = new RegExp(`(?:^|\\s)${escaped}(?=\\s|$)`, 'gi');
    cleaned = cleaned.replace(re, ' ');
  }

  return cleaned.replace(/\s+/g, ' ').trim();
}

function hasNavIntent(text: string): boolean {
  const lower = text.toLowerCase();
  if (EXPLICIT_NAV_VERB_REGEX.test(lower)) return true;
  // Also tolerate broken SOV/short commands: "quest open", "mission go", "i want quest"
  if (/\b(?:open|go|goto|navigate|switch|shift|show|visit|enter|launch)\b/i.test(lower)) return true;
  if (/\b(?:i\s+want|want\s+to)\b/i.test(lower) && !/\b(?:want\s+to\s+(?:know|ask|do|chat|chart|speak|talk|learn\s+about))\b/i.test(lower)) {
    return true;
  }
  return false;
}

function hasRouteIndicator(text: string): boolean {
  return /\b(?:tab|tabs|page|section|screen|hub|studio|menu|option)\b/i.test(text);
}

function hasMentorAddress(text: string): boolean {
  return /\b(?:hey|hwy|hay|hi|hello)\s+(?:ms\.?\s+|mr\.?\s+)?(?:priya|preya|pria|anish|aneesh)\b|\b(?:priya|preya|pria|anish|aneesh)\b/i.test(text);
}

const FILLER_WORDS = new Set([
  'the', 'a', 'an', 'my', 'me', 'to', 'for', 'of', 'in', 'on', 'at', 'up', 'into',
  'please', 'pls', 'plz', 'can', 'could', 'you', 'u', 'i', 'we', 'want', 'wanna',
  'need', 'let', 'see', 'hey', 'hwy', 'hay', 'hi', 'hello', 'now', 'karo', 'kardo',
  'ms', 'mr', 'priya', 'preya', 'pria', 'freeya', 'freya', 'riya', 'anish', 'aneesh',
  'akash', 'aakash', 'tab', 'tabs', 'page', 'section', 'screen', 'menu', 'option',
  'please', 'bro', 'yaar',
]);

// ── Main Matching Function ──────────────────────────────────────────────────
export function matchNavigationIntent(
  rawTranscript: string,
  options: NavMatchOptions = {}
): NavMatchResult {
  const empty: NavMatchResult = {
    matched: false, path: '', displayName: '', confidence: 0, candidates: [],
  };

  if (!rawTranscript || rawTranscript.trim().length < 2) return empty;

  const text = rawTranscript.toLowerCase().replace(/[.,!?;:'"()]/g, ' ').replace(/\s+/g, ' ').trim();
  const strippedOfWake = text.replace(WAKE_AND_MENTOR_REGEX, ' ').replace(/\s+/g, ' ').trim();

  // Guard: Standalone mentor greeting / wake word (e.g. "hey priya") must NEVER trigger navigation
  if (!strippedOfWake) {
    return empty;
  }

  // Exclude genuine informational questions unless an explicit nav verb is present
  const hasExplicitNav = EXPLICIT_NAV_VERB_REGEX.test(text);
  if (QUESTION_EXCLUSION_REGEX.test(strippedOfWake) && !hasExplicitNav) {
    return empty;
  }

  const isNavCommand = hasNavIntent(text);
  const isIndicator = hasRouteIndicator(text);
  const addressedMentor = Boolean(options.addressedMentor) || hasMentorAddress(text);

  // Extract clean target phrase regardless of word order (never fall back to raw wake-word text)
  const targetPhrase = stripWakeAndNavVerbs(text);
  if (!targetPhrase) return empty;

  const spokenWords = targetPhrase.split(/\s+/).filter(Boolean);
  const meaningfulWords = spokenWords.filter((w) => !FILLER_WORDS.has(w));
  if (meaningfulWords.length === 0) return empty;
  const wordsToScore = meaningfulWords;

  // Strict intent gate:
  // Allow if (explicit nav verb) OR (tab/page indicator) OR (addressed mentor with concise 1-3 word route target)
  const isConciseAddressedRoute = addressedMentor && wordsToScore.length >= 1 && wordsToScore.length <= 3;
  if (!isNavCommand && !isIndicator && !isConciseAddressedRoute) {
    return empty;
  }

  if (wordsToScore.length === 0) return empty;

  const collapsedTargetPhrase = wordsToScore.map(collapseElongatedChars).join(' ');

  const scored: Array<{ entry: RouteEntry; score: number }> = [];

  for (const entry of LEFT_SIDEBAR_ROUTES) {
    let bestScore = 0;

    for (const synonym of entry.synonyms) {
      const synWords = synonym.split(/\s+/);
      const collapsedSyn = synWords.map(collapseElongatedChars).join(' ');

      // 1. Multi-word order-agnostic phonetic/fuzzy similarity
      const phraseScore = phraseSimilarity(wordsToScore, synWords);

      // 2. Direct containment on elongation-collapsed target phrase
      let containScore = 0;
      if (collapsedTargetPhrase.length >= 3 && collapsedTargetPhrase === collapsedSyn) {
        containScore = 1.0;
      } else if (collapsedTargetPhrase.length >= 4 && collapsedTargetPhrase.includes(collapsedSyn) && collapsedSyn.length >= 4) {
        containScore = 0.94;
      }

      // 3. Single-word best fuzzy/phonetic match (guard ambiguous homophone "guest" behind nav/indicator)
      let exactWordScore = 0;
      if (synWords.length === 1) {
        if (synWords[0] === 'guest' && !isNavCommand && !isIndicator) {
          continue;
        }
        for (const w of wordsToScore) {
          const sim = wordSimilarity(w, synWords[0]);
          if (sim > exactWordScore) exactWordScore = sim;
        }
      }

      const score = Math.max(phraseScore, containScore, exactWordScore);
      if (score > bestScore) bestScore = score;
    }

    if (bestScore >= 0.55) {
      scored.push({ entry, score: bestScore });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  if (scored.length === 0) return empty;

  const top = scored[0];
  const minThreshold = isNavCommand || isIndicator ? 0.58 : 0.78;
  const intentBoost = isNavCommand ? 0.05 : isIndicator ? 0.03 : 0;
  const finalConfidence = Math.min(1.0, top.score + intentBoost);

  if (finalConfidence < minThreshold) return empty;

  const candidates = scored.slice(0, 3).map((s) => ({
    path: s.entry.path,
    displayName: s.entry.displayName,
    confidence: Math.min(1.0, s.score + intentBoost),
  }));

  return {
    matched: true,
    path: top.entry.path,
    displayName: top.entry.displayName,
    confidence: finalConfidence,
    candidates,
  };
}

// ── Score multiple Web Speech API alternatives (picks highest-confidence match) ─
export function matchBestAlternative(
  alternatives: string[],
  options: NavMatchOptions = {}
): NavMatchResult {
  let bestResult: NavMatchResult = {
    matched: false, path: '', displayName: '', confidence: 0, candidates: [],
  };

  for (const alt of alternatives) {
    const result = matchNavigationIntent(alt, options);
    if (result.confidence > bestResult.confidence) {
      bestResult = result;
    }
  }

  return bestResult;
}

// ── Grammar Vocabulary for SpeechRecognition biasing ────────────────────────
export function getGrammarVocabulary(): string[] {
  const vocab = new Set<string>();

  for (const entry of LEFT_SIDEBAR_ROUTES) {
    for (const syn of entry.synonyms) {
      for (const word of syn.split(/\s+/)) {
        if (word.length > 2) vocab.add(word);
      }
    }
  }

  for (const phrase of NAV_INTENT_PHRASES) {
    for (const word of phrase.split(/\s+/)) {
      if (word.length > 2) vocab.add(word);
    }
  }

  const extras = [
    'priya', 'anish', 'hey', 'hello', 'start', 'launch', 'begin', 'priority',
    'priorities', 'mistakes', 'weak', 'strong', 'hyper', 'active', 'chat', 'speak',
  ];
  for (const w of extras) vocab.add(w);

  return Array.from(vocab);
}

// ── Export strictly the canonical 12 Left Sidebar routes ────────────────────
export function getAllRoutes(): RouteEntry[] {
  return [...LEFT_SIDEBAR_ROUTES];
}
