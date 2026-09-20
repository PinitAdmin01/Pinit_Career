/**
 * useVoiceNavigation — Intent-Gated Voice Navigation Engine for PinIT Career OS
 * 
 * Provides route vocabulary mapping, phonetic similarity scoring, and strict
 * intent gating to ensure voice commands navigate accurately without triggering
 * on ordinary conversational dialogue.
 */

// ── Route Vocabulary Map ────────────────────────────────────────────────────
// Each route maps to an array of synonyms (all lowercase).
// The first synonym is the canonical display name shown in TTS confirmations.

export interface RouteEntry {
  path: string;
  displayName: string;
  synonyms: string[];
}

const ROUTE_VOCABULARY: RouteEntry[] = [
  // ── PinIT Career OS (Left Sidebar) ──
  {
    path: '/dashboard',
    displayName: 'Dashboard',
    synonyms: [
      'dashboard', 'home', 'main dashboard', 'home screen', 'dashboard tab',
      'home tab', 'home page', 'main page', 'my dashboard', 'go home'
    ],
  },
  {
    path: '/quests',
    displayName: 'Quests',
    synonyms: [
      'quests', 'quest tab', 'quests tab', 'quest page', 'coding quests',
      'learning quests', 'quest section', 'coding lessons', 'quest module',
      'study quests', 'my quests'
    ],
  },
  {
    path: '/missions',
    displayName: 'Missions',
    synonyms: [
      'missions', 'daily missions', 'daily mission', 'mission tab',
      'missions tab', 'coding missions', 'my missions', 'today missions',
      'mission page', 'daily tasks', 'daily challenges'
    ],
  },
  {
    path: '/arena',
    displayName: 'Challenging Arena',
    synonyms: [
      'arena', 'challenging arena', 'code wars', '1v1 duel', 'battle arena',
      'pvp coding', 'timed duel', 'arena tab', 'code wars arena', 'multiplayer coding',
      'speedrun', 'algorithm battle', 'arena challenges', 'coding challenges'
    ],
  },
  {
    path: '/projects',
    displayName: 'Projects & Squads',
    synonyms: [
      'projects', 'industry projects', 'project tab', 'projects tab',
      'my projects', 'coding projects', 'real projects', 'project page',
      'squads tab', 'team projects', 'hackathon squad'
    ],
  },
  {
    path: '/interview',
    displayName: 'AI Interview',
    synonyms: [
      'interview', 'ai interview', 'mock interview', 'practice interview',
      'interview tab', 'interview practice', 'interview page',
      'technical interview', 'interview simulator', 'ai mock'
    ],
  },
  {
    path: '/group-discussion',
    displayName: 'Group Discussion',
    synonyms: [
      'group discussion', 'gd', 'gd practice', 'boardroom debate',
      'gd tab', 'group debate', 'gd page', 'group discussion tab',
      'socratic debate'
    ],
  },
  {
    path: '/learning',
    displayName: 'Learning & Twin',
    synonyms: [
      'learning', 'learning tab', 'learning roadmap', 'learning page',
      'study roadmap', 'masterclass', 'learning and twin', 'study plan',
      'syllabus tab'
    ],
  },

  // ── Career Intelligence ──
  {
    path: '/career-dna',
    displayName: 'Career DNA',
    synonyms: [
      'career dna', 'career dna tab', 'my dna', 'dna page',
      'career dna page', 'dna score', 'competencies tab', 'my competencies'
    ],
  },
  {
    path: '/career-twin',
    displayName: 'Career Twin',
    synonyms: [
      'career twin', 'career twin tab', 'twin page', 'career twin page',
      'job match tab', 'role match', 'my twin', 'career match'
    ],
  },
  {
    path: '/career-builder',
    displayName: 'Career Builder',
    synonyms: [
      'career builder', 'resume builder', 'build resume', 'career builder tab',
      'resume page', 'cv builder', 'create resume', 'my resume'
    ],
  },
  {
    path: '/career-intelligence',
    displayName: 'Career Intelligence',
    synonyms: [
      'career intelligence', 'market intelligence', 'job market trends',
      'career intelligence tab', 'market trends', 'job trends'
    ],
  },

  // ── Portfolio & Credentials ──
  {
    path: '/portfolio',
    displayName: 'Portfolio',
    synonyms: [
      'portfolio', 'my portfolio', 'portfolio tab', 'portfolio page',
      'professional profile', 'skill portfolio', 'public profile'
    ],
  },
  {
    path: '/quests?tab=passport',
    displayName: 'Skill Passport & Transcript',
    synonyms: [
      'skill passport', 'passport tab', 'verified skills', 'skill credentials',
      'my passport', 'passport page', 'my certificates', 'verifiable transcript',
      'transcript tab', 'certifications tab'
    ],
  },

  // ── Placement & Opportunities ──
  {
    path: '/career-intelligence?tab=tracker',
    displayName: 'Placement Predictor',
    synonyms: [
      'placement', 'placement predictor', 'salary predictor', 'placement tab',
      'placement page', 'predict placement', 'my placement', 'salary prediction'
    ],
  },
  {
    path: '/opportunities',
    displayName: 'Opportunities',
    synonyms: [
      'opportunities', 'job listings', 'opportunities tab', 'job opportunities',
      'career opportunities', 'my opportunities', 'opportunities page'
    ],
  },
  {
    path: '/internships',
    displayName: 'Internship Tracker',
    synonyms: [
      'internships', 'internship tracker', 'internship tab',
      'my internships', 'internship page', 'track internship'
    ],
  },

  // ── Documents & Vault ──
  {
    path: '/vault',
    displayName: 'Document Vault',
    synonyms: [
      'document vault', 'vault tab', 'my documents', 'document page',
      'my vault', 'upload documents', 'file vault', 'vault page'
    ],
  },

  // ── Student Services (Right Sidebar) ──
  {
    path: '/services',
    displayName: 'Student Services',
    synonyms: [
      'student services', 'services tab', 'service page', 'campus services'
    ],
  },
  {
    path: '/library',
    displayName: 'Library Center',
    synonyms: [
      'library', 'library center', 'library books', 'library tab',
      'library page', 'my library', 'book library', 'study library'
    ],
  },
  {
    path: '/hostel',
    displayName: 'Hostel Hub',
    synonyms: [
      'hostel', 'hostel hub', 'accommodation', 'dormitory',
      'hostel tab', 'hostel page', 'my hostel', 'hostel room', 'hostel dorm'
    ],
  },
  {
    path: '/transport',
    displayName: 'Transit Desk',
    synonyms: [
      'transport', 'transit', 'transit desk', 'transport tab',
      'transportation', 'bus schedule', 'shuttle service', 'campus shuttle'
    ],
  },
  {
    path: '/events',
    displayName: 'Campus Events',
    synonyms: [
      'campus events', 'event tab', 'events tab', 'upcoming events',
      'my events', 'campus event', 'event page'
    ],
  },
  {
    path: '/grievances',
    displayName: 'Contact Admin',
    synonyms: [
      'grievances', 'contact admin', 'admin contact', 'file grievance',
      'file complaint', 'grievance tab', 'raise complaint', 'help desk',
      'contact support'
    ],
  },
  {
    path: '/research',
    displayName: 'Research Desk',
    synonyms: [
      'research desk', 'research tab', 'research page', 'research projects',
      'my research', 'academic research'
    ],
  },
  {
    path: '/finance',
    displayName: 'Finance & Fees',
    synonyms: [
      'finance and fees', 'finance tab', 'pay fees', 'finance page',
      'my fees', 'fee payment', 'tuition fees', 'billing tab'
    ],
  },
  {
    path: '/maintenance',
    displayName: 'Infrastructure',
    synonyms: [
      'infrastructure', 'facilities', 'maintenance tab',
      'campus maintenance', 'infrastructure page'
    ],
  },
  {
    path: '/advisor',
    displayName: 'AI Academic Advisor',
    synonyms: [
      'academic advisor', 'ai advisor', 'advisor tab',
      'ai academic advisor', 'academic advice', 'advisor page'
    ],
  },

  // ── Bottom Nav & Misc ──
  {
    path: '/leaderboard',
    displayName: 'Leaderboard & Leagues',
    synonyms: [
      'leaderboard', 'leader board', 'weekly league', 'leaderboard tab',
      'leagues tab', 'student leaderboard'
    ],
  },
  {
    path: '/attention-span',
    displayName: 'Attention Span',
    synonyms: [
      'attention span', 'focus trainer', 'cognitive endurance',
      'attention tab', 'focus tab', 'brain drills'
    ],
  },
  {
    path: '/analytics',
    displayName: 'Analytics',
    synonyms: [
      'analytics', 'analytics tab', 'analytics page', 'my analytics',
      'statistics', 'view analytics', 'performance analytics'
    ],
  },
  {
    path: '/notifications',
    displayName: 'Notifications',
    synonyms: [
      'notifications', 'notification tab', 'my notifications',
      'notification page'
    ],
  },
  {
    path: '/pins',
    displayName: 'Pins & Wallet',
    synonyms: [
      'pins', 'wallet', 'pins and wallet', 'pin wallet', 'pins tab',
      'wallet tab', 'pins page', 'my pins', 'pin balance'
    ],
  },
  {
    path: '/pricing',
    displayName: 'Pricing & Plans',
    synonyms: [
      'pricing', 'pricing plans', 'subscription', 'upgrade plan',
      'plans tab', 'pins and plans'
    ],
  },
  {
    path: '/profile',
    displayName: 'Profile',
    synonyms: [
      'my profile', 'profile tab', 'account settings', 'my account',
      'profile page', 'user settings', 'profile settings'
    ],
  },
  {
    path: '/attendance',
    displayName: 'Attendance',
    synonyms: [
      'attendance', 'my attendance', 'attendance tab', 'attendance page',
      'attendance record', 'check attendance'
    ],
  },
  {
    path: '/applications',
    displayName: 'My Applications',
    synonyms: [
      'my applications', 'job applications', 'application tab',
      'applied jobs', 'application page', 'application tracker'
    ],
  },
];

// ── Navigation Intent Verbs ─────────────────────────────────────────────────
// Only verbs/phrases that clearly convey navigation intent are included.
// Common conversational words (e.g., 'i need', 'go', 'view', 'check') are omitted.
const NAV_INTENT_VERBS = [
  'go to', 'goto', 'open up', 'open', 'show me', 'show',
  'switch to', 'navigate to', 'navigate', 'take me to', 'take me',
  'bring up', 'pull up', 'launch', 'visit', 'jump to', 'head to',
  'move to', 'bring me to', 'can you open', 'please open',
  'i want to go to', 'i want to see', 'let me see',
  'can you show', 'get me to', 'redirect to', 'change to', 'swap to',
  'shift to', 'contact', 'file', 'report'
];

// ── Phonetic Simplification (lightweight Soundex-like) ──────────────────────
function phoneticKey(word: string): string {
  return word
    .toLowerCase()
    .replace(/^[^a-z]+|[^a-z]+$/g, '')   // trim non-alpha
    .replace(/ph/g, 'f')
    .replace(/ck/g, 'k')
    .replace(/sh/g, 's')
    .replace(/th/g, 't')
    .replace(/ch/g, 'c')
    .replace(/wh/g, 'w')
    .replace(/kn/g, 'n')
    .replace(/wr/g, 'r')
    .replace(/qu/g, 'kw')
    .replace(/x/g, 'ks')
    .replace(/[aeiou]/g, (m, i) => i === 0 ? m : '') // keep only leading vowel
    .replace(/(.)\1+/g, '$1');            // collapse doubles
}

// ── Levenshtein Distance ────────────────────────────────────────────────────
function levenshtein(a: string, b: string): number {
  const la = a.length, lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;

  if (a === b) return 0;

  const matrix: number[][] = [];
  for (let i = 0; i <= la; i++) {
    matrix[i] = [i];
    for (let j = 1; j <= lb; j++) {
      if (i === 0) {
        matrix[i][j] = j;
      } else {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,       // deletion
          matrix[i][j - 1] + 1,       // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
  }
  return matrix[la][lb];
}

// ── Score a single word against a single synonym word ────────────────────────
function wordSimilarity(spoken: string, target: string): number {
  if (spoken === target) return 1.0;

  if (phoneticKey(spoken) === phoneticKey(target) && spoken.length > 2) return 0.92;

  if (target.startsWith(spoken) && spoken.length >= 3) return 0.88;
  if (spoken.startsWith(target) && target.length >= 3) return 0.85;

  const maxLen = Math.max(spoken.length, target.length);
  if (maxLen === 0) return 0;
  const dist = levenshtein(spoken, target);
  const tolerance = maxLen <= 4 ? 1 : 2;
  if (dist <= tolerance) {
    return 1.0 - (dist / maxLen) * 0.4;
  }

  return 0;
}

// ── Score a full phrase against a synonym (multi-word aware) ─────────────────
function phraseSimilarity(spokenWords: string[], synonymWords: string[]): number {
  if (synonymWords.length === 0) return 0;

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

// ── Strip wake words and navigation intent verbs from transcript ─────────────
function stripNavVerbs(text: string): string {
  let cleaned = text;

  // 1. Strip wake word prefixes
  cleaned = cleaned.replace(/\b(hey|hay|hi|hello)\b/gi, '')
                   .replace(/\b(priya|preya|pria|freeya|freya|riya|kashyap|kash|karthic|karthik|kartik|maya|maia|mya|divya|divia|anish|sentinel|pinit)\b/gi, '')
                   .trim();

  // 2. Sort verbs by length descending so longer phrases match first
  const sorted = [...NAV_INTENT_VERBS].sort((a, b) => b.length - a.length);
  for (const verb of sorted) {
    const re = new RegExp(`^(?:can you |please |i want to |let me |i need to )?${verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i');
    cleaned = cleaned.replace(re, '');
  }

  // Final trim of any leftover wake words after verb removal
  cleaned = cleaned.replace(/\b(priya|kashyap|karthic|maya|divya|anish)\b/gi, '').trim();

  return cleaned.trim();
}

// ── Detect if text contains a navigation intent ─────────────────────────────
function hasNavIntent(text: string): boolean {
  const lower = text.toLowerCase();
  for (const verb of NAV_INTENT_VERBS) {
    const re = new RegExp(`(?:^|\\s)${verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`, 'i');
    if (re.test(lower)) return true;
  }
  return false;
}

// ── Detect if text contains explicit UI route indicators ────────────────────
function hasRouteIndicator(text: string): boolean {
  return /\b(tab|page|section|screen|hub|desk|predictor|builder|center|tracker)\b/i.test(text);
}

// ── Main matching function ──────────────────────────────────────────────────
export function matchNavigationIntent(rawTranscript: string): NavMatchResult {
  const empty: NavMatchResult = {
    matched: false, path: '', displayName: '', confidence: 0, candidates: [],
  };

  if (!rawTranscript || rawTranscript.trim().length < 2) return empty;

  const text = rawTranscript.toLowerCase().replace(/[.,!?;:'"]/g, '').trim();

  // Strict intent gating: must have an explicit navigation verb OR route indicator suffix
  // Ordinary conversational sentences (e.g. "I am in my room reading", "I need support with this data")
  // will not qualify and are immediately bypassed.
  const isNavCommand = hasNavIntent(text);
  const isIndicator = hasRouteIndicator(text);

  if (!isNavCommand && !isIndicator) {
    return empty;
  }

  // Strip navigation verbs & wake words to get the target phrase
  const targetPhrase = stripNavVerbs(text);
  const effectiveText = targetPhrase || text;

  // Tokenize spoken target into words
  const spokenWords = effectiveText.split(/\s+/).filter(w => w.length > 0);
  const fillers = new Set([
    'the', 'a', 'an', 'my', 'me', 'to', 'for', 'of', 'in', 'on', 'at', 'up',
    'please', 'can', 'you', 'i', 'want', 'need', 'let', 'see', 'hey', 'hay', 'hi', 'hello',
    'priya', 'kashyap', 'karthic', 'maya', 'divya', 'anish', 'tab', 'page', 'section'
  ]);
  const meaningfulWords = spokenWords.filter(w => !fillers.has(w));
  const wordsToScore = meaningfulWords.length > 0 ? meaningfulWords : spokenWords;

  // Score every route
  const scored: Array<{ entry: RouteEntry; score: number }> = [];

  for (const entry of ROUTE_VOCABULARY) {
    let bestScore = 0;

    for (const synonym of entry.synonyms) {
      const synWords = synonym.split(/\s+/);

      // Method 1: Full phrase similarity
      const phraseScore = phraseSimilarity(wordsToScore, synWords);

      // Method 2: Direct substring containment
      let containScore = 0;
      if (targetPhrase.length >= 3 && targetPhrase.includes(synonym)) {
        containScore = 0.95;
      } else if (synonym.includes(targetPhrase) && targetPhrase.length >= 4) {
        containScore = 0.85;
      }

      // Method 3: Single-word exact match for single-word synonyms
      let exactWordScore = 0;
      if (synWords.length === 1 && synWords[0].length >= 3) {
        for (const w of wordsToScore) {
          if (w.length >= 3) {
            const sim = wordSimilarity(w, synWords[0]);
            if (sim > exactWordScore) exactWordScore = sim;
          }
        }
      }

      const score = Math.max(phraseScore, containScore, exactWordScore);
      if (score > bestScore) bestScore = score;
    }

    if (bestScore >= 0.5) {
      scored.push({ entry, score: bestScore });
    }
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) return empty;

  const top = scored[0];
  const intentBoost = isNavCommand ? 0.05 : 0;
  const finalConfidence = Math.min(1.0, top.score + intentBoost);

  if (finalConfidence < 0.55) return empty;

  const candidates = scored.slice(0, 3).map(s => ({
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

// ── Score multiple speech recognition alternatives ──────────────────────────
export function matchBestAlternative(alternatives: string[]): NavMatchResult {
  let bestResult: NavMatchResult = {
    matched: false, path: '', displayName: '', confidence: 0, candidates: [],
  };

  for (const alt of alternatives) {
    const result = matchNavigationIntent(alt);
    if (result.confidence > bestResult.confidence) {
      bestResult = result;
    }
  }

  return bestResult;
}

// ── Build expanded grammar vocabulary for SpeechRecognition ─────────────────
export function getGrammarVocabulary(): string[] {
  const vocab = new Set<string>();

  for (const entry of ROUTE_VOCABULARY) {
    for (const syn of entry.synonyms) {
      for (const word of syn.split(/\s+/)) {
        if (word.length > 2) vocab.add(word);
      }
    }
  }

  for (const verb of NAV_INTENT_VERBS) {
    for (const word of verb.split(/\s+/)) {
      if (word.length > 2) vocab.add(word);
    }
  }

  const wakeWords = [
    'priya', 'preya', 'pria', 'freya', 'riya',
    'kashyap', 'kash',
    'karthic', 'karthik', 'kartik',
    'maya', 'maia',
    'divya',
    'anish',
    'sentinel', 'pinit', 'socratic', 'verify', 'exam',
    'hey', 'hello'
  ];
  for (const w of wakeWords) vocab.add(w);

  return Array.from(vocab);
}

// ── Export the complete route list (for external use if needed) ──────────────
export function getAllRoutes(): RouteEntry[] {
  return [...ROUTE_VOCABULARY];
}
