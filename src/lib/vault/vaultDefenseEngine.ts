/**
 * PinIT Career OS — Vault Credential & Resume Brutal Defense Engine
 *
 * Workflow:
 * 1. Fast Document Skill Analysis: Extracts claimed skills from uploaded Resumes / Certificates.
 * 2. Cross-Mentor Auditor Selection:
 *    - If student's mentor is Priya / female -> dispatches Mr. Akash (male auditor).
 *    - If student's mentor is Anish / Rohan / Vikram / any male -> dispatches Ms. Priya (female auditor).
 * 3. Brutal Questioning Engine: Generates ruthless, zero-fluff interrogation questions targeting claimed skills.
 * 4. Strict Pass/Fail Evaluation:
 *    - Pass (score >= 65): +5 Trust Score, Vault Proof Verified, ALL claimed skills added to Student Portfolio.
 *    - Fail (score < 65): -5 Trust Score (fake/unverified claim), Document marked Rejected, skills withheld.
 */

export interface VaultAuditorProfile {
  id: 'akash' | 'priya';
  name: string;
  title: string;
  gender: 'male' | 'female';
  emoji: string;
}

export interface VaultDefenseProject {
  name: string;
  techStack: string[];
  claim: string;
}

export interface VaultDefenseChallenge {
  docId: string;
  userId?: string;
  title: string;
  itemType: string;
  organizationName?: string;
  claimedSkills: string[];
  projects?: VaultDefenseProject[];
  certifications?: string[];
  summary?: string;
  rawTextExcerpt?: string;
  defenseQuestions?: string[];
  analysisSource?: string;
  auditor: VaultAuditorProfile;
  createdAt: string;
}

export interface VaultDefenseCodingResult {
  required: boolean;
  language: 'python' | 'javascript' | 'java' | 'cpp' | 'sql';
  problemTitle: string;
  passedTests: number;
  totalTests: number;
  passed: boolean;
  skipped: boolean;
  codeSnippet?: string;
}

export interface VaultDefenseResult {
  passed: boolean;
  score: number;
  verdict: 'Verified Authentic' | 'Rejected — Unsubstantiated Claims';
  trustDelta: 5 | -5;
  verifiedSkillsAdded: string[];
  /** Individual skills accurately proven during the defense even if the broader document failed overall */
  provenSkills?: string[];
  codingResult?: VaultDefenseCodingResult;
  critique: string;
}

const MALE_MENTOR_IDS = new Set([
  'anish', 'rohan', 'vikram', 'akash', 'kashyap', 'aditya', 'rajesh', 'abhijit', 'karthic',
]);

/**
 * Resolves the opposing-gender brutal auditor for Proof Vault defense.
 * Never lets the student's own cozy mentor pass them easily.
 */
export function resolveVaultAuditorMentor(selectedMentorId?: string | null): VaultAuditorProfile {
  const normalized = String(selectedMentorId || 'priya').toLowerCase().trim();
  const isUserMentorMale = MALE_MENTOR_IDS.has(normalized);

  if (isUserMentorMale) {
    return {
      id: 'priya',
      name: 'Ms. Priya',
      title: 'Lead Credential & Skill Integrity Auditor',
      gender: 'female',
      emoji: '👩‍💼',
    };
  }

  return {
    id: 'akash',
    name: 'Mr. Akash',
    title: 'Lead Adversarial Credential & Resume Auditor',
    gender: 'male',
    emoji: '🕵️‍♂️',
  };
}

export function getActiveUserMentorId(user?: any): string {
  const direct =
    user?.guidanceMentorId ||
    user?.guidance_mentor_id ||
    user?.selectedTeacherId ||
    user?.selected_teacher_id ||
    user?.onboardingAnswers?.selectedMentor ||
    user?.onboardingAnswers?.selectedTeacherId;

  if (typeof direct === 'string' && direct.trim()) {
    return direct.trim().toLowerCase();
  }

  if (typeof window !== 'undefined') {
    try {
      const local =
        localStorage.getItem('pinit_selected_mentor_id') ||
        localStorage.getItem('pinit_selected_teacher_id');
      if (local && local.trim()) return local.trim().toLowerCase();
    } catch {}
  }

  return 'priya';
}

const KNOWN_SKILL_DICTIONARY: Array<{ pattern: RegExp; canonical: string }> = [
  { pattern: /\breact(?:\.js)?\b/i, canonical: 'React' },
  { pattern: /\bnext(?:\.js)?\b/i, canonical: 'Next.js' },
  { pattern: /\btypescript\b|\bts\b/i, canonical: 'TypeScript' },
  { pattern: /\bjavascript\b|\bjs\b|\becmascript\b/i, canonical: 'JavaScript' },
  { pattern: /\bpython\b/i, canonical: 'Python' },
  { pattern: /\bjava\b(?!script)/i, canonical: 'Java' },
  { pattern: /\bc\+\+\b|\bcpp\b/i, canonical: 'C++' },
  { pattern: /\bnode(?:\.js)?\b|\bexpress\b/i, canonical: 'Node.js' },
  { pattern: /\bpostgresql\b|\bpostgres\b/i, canonical: 'PostgreSQL' },
  { pattern: /\bsql\b|\bmysql\b|\bsqlite\b/i, canonical: 'SQL' },
  { pattern: /\bmongodb\b|\bnosql\b/i, canonical: 'MongoDB' },
  { pattern: /\bredis\b/i, canonical: 'Redis' },
  { pattern: /\bdocker\b/i, canonical: 'Docker' },
  { pattern: /\bkubernetes\b|\bk8s\b/i, canonical: 'Kubernetes' },
  { pattern: /\baws\b|\bamazon web services\b/i, canonical: 'AWS' },
  { pattern: /\bsystem design\b|\bmicroservices\b/i, canonical: 'System Design' },
  { pattern: /\bdata structures?\b|\bdsa\b/i, canonical: 'Data Structures & Algorithms' },
  { pattern: /\bmachine learning\b|\bml\b|\bpytorch\b|\btensorflow\b/i, canonical: 'Machine Learning' },
  { pattern: /\btailwind\b|\bcss\b|\bhtml\b/i, canonical: 'HTML & CSS' },
  { pattern: /\bfastapi\b|\bdjango\b|\bflask\b/i, canonical: 'Python Backend' },
  { pattern: /\bgit\b|\bgithub\b|\bci\/cd\b/i, canonical: 'Git & CI/CD' },
  { pattern: /\bfinancial modeling\b|\bvaluation\b|\bebitda\b|\baccounting\b/i, canonical: 'Financial Accounting' },
  { pattern: /\baudit(?:ing)?\b|\bifrs\b|\bgaap\b/i, canonical: 'Audit & Assurance' },
  { pattern: /\bseo\b|\bdigital marketing\b|\banalytics\b/i, canonical: 'Digital Marketing Analytics' },
  { pattern: /\bexcel\b|\bpower bi\b|\btableau\b/i, canonical: 'Data Analytics & BI' },
  { pattern: /\bflutter\b|\bdart\b/i, canonical: 'Flutter & Dart' },
  { pattern: /\breact native\b/i, canonical: 'React Native' },
  { pattern: /\bfirebase\b|\bfirestore\b/i, canonical: 'Firebase' },
  { pattern: /\bsupabase\b/i, canonical: 'Supabase' },
  { pattern: /\bgraphql\b/i, canonical: 'GraphQL' },
  { pattern: /\bfigma\b|\bui\/ux\b/i, canonical: 'UI/UX & Figma' },
  { pattern: /\blangchain\b|\bllm\b|\bgenerative ai\b|\bprompt engineering\b/i, canonical: 'Generative AI & LLMs' },
  { pattern: /\biot\b|\barduino\b|\besp32\b|\braspberry pi\b|\bembedded\b/i, canonical: 'IoT & Embedded Systems' },
  { pattern: /\bangular\b/i, canonical: 'Angular' },
  { pattern: /\bvue(?:\.js)?\b/i, canonical: 'Vue.js' },
  { pattern: /\bspring\s*boot\b/i, canonical: 'Spring Boot' },
  { pattern: /\bphp\b|\blaravel\b/i, canonical: 'PHP & Laravel' },
  { pattern: /\bc#\b|\b\.net\b|\basp\.net\b/i, canonical: 'C# / .NET' },
  { pattern: /\bandroid\b|\bkotlin\b/i, canonical: 'Android & Kotlin' },
  { pattern: /\bswift\b|\bios\b/i, canonical: 'iOS & Swift' },
  { pattern: /\bterraform\b|\bansible\b|\bjenkins\b/i, canonical: 'DevOps & IaC' },
  { pattern: /\bgcp\b|\bgoogle cloud\b|\bazure\b/i, canonical: 'Cloud Infrastructure' },
];

/**
 * Fast client/server extraction helper to guarantee skills are surfaced for resumes/certificates.
 */
export function extractSkillsFast(text: string, existingSkills?: string[]): string[] {
  const result = new Map<string, string>();
  if (Array.isArray(existingSkills)) {
    for (const raw of existingSkills) {
      const clean = String(raw || '').trim();
      if (clean && !['Analytical', 'Problem Solving', 'Certification Evidence', 'Project Evidence'].includes(clean)) {
        result.set(clean.toLowerCase(), clean);
      }
    }
  }
  const source = String(text || '');
  for (const entry of KNOWN_SKILL_DICTIONARY) {
    if (entry.pattern.test(source)) {
      result.set(entry.canonical.toLowerCase(), entry.canonical);
    }
  }
  return Array.from(result.values()).slice(0, 15);
}

const CODING_SIGNAL_RE =
  /\b(python|javascript|typescript|react(?:\.js)?|next\.?js|vue(?:\.js)?|angular|node\.?js|express(?:\.js)?|fastapi|django|flask|java|spring\s*boot|c\+\+|cpp|c#|golang|rust|php|ruby|kotlin|swift|dart|flutter|sql|postgresql|postgres|mysql|mongodb|firebase|supabase|graphql|rest\s*apis?|docker|kubernetes|html5?|css3?|tailwind|full[\s-]*stack|software\s+(?:engineer|developer)|web\s+developer|backend|frontend|ai\s+engineer|machine\s+learning|pytorch|tensorflow|data\s+structures|algorithms|devops|esp32|arduino|embedded\s+c)\b/i;

const NON_CODING_COMMERCE_RE =
  /\b(b\.?\s*com|bcom|commerce|accounting|bookkeeping|tally(?:\s*prime)?|gst\s*filing|ifrs|statutory\s*audit|chartered\s*accountant|taxation|corporate\s*finance|investment\s*banking|financial\s*modeling|brand\s*management|digital\s*marketing|human\s*resources|bba|mba\s+finance)\b/i;

const STRICT_LANGUAGE_RE =
  /\b(python|javascript|typescript|react(?:\.js)?|next\.?js|node\.?js|fastapi|django|flask|java|spring|c\+\+|cpp|c#|golang|rust|php|kotlin|swift|dart|flutter|sql|postgresql|mysql|mongodb)\b/i;

/**
 * Determines whether a Proof Vault resume/document represents a coding/software profile
 * (requiring 1 live coding check) vs a non-coding profile such as B.Com / Commerce / Finance
 * (which skips the coding check automatically).
 */
export function isCodingResumeChallenge(
  challenge: Pick<VaultDefenseChallenge, 'title' | 'itemType' | 'claimedSkills' | 'projects' | 'summary' | 'rawTextExcerpt'>
): boolean {
  const skillText = (challenge.claimedSkills || []).join(' ');
  const projectText = (challenge.projects || [])
    .map((p) => `${p.name} ${(p.techStack || []).join(' ')} ${p.claim || ''}`)
    .join(' ');
  const combined = `${challenge.title || ''} ${skillText} ${projectText} ${challenge.summary || ''} ${(challenge.rawTextExcerpt || '').slice(0, 1800)}`;

  const hasStrictLanguage = STRICT_LANGUAGE_RE.test(skillText) || STRICT_LANGUAGE_RE.test(projectText) || STRICT_LANGUAGE_RE.test(combined);
  if (hasStrictLanguage) return true;

  const hasNonCodingCommerce = NON_CODING_COMMERCE_RE.test(combined);
  if (hasNonCodingCommerce) return false;

  return CODING_SIGNAL_RE.test(combined);
}

/**
 * Picks the candidate's strongest claimed programming language for the live coding check.
 */
export function inferPreferredCodingLanguage(
  challenge: Pick<VaultDefenseChallenge, 'title' | 'claimedSkills' | 'projects' | 'summary' | 'rawTextExcerpt'>
): 'python' | 'javascript' | 'java' | 'cpp' | 'sql' {
  const corpus = [
    ...(challenge.claimedSkills || []),
    ...(challenge.projects || []).flatMap((p) => p.techStack || []),
    challenge.title || '',
    challenge.summary || '',
  ]
    .join(' ')
    .toLowerCase();

  if (/\b(python|fastapi|django|flask|pytorch|tensorflow|scikit|pandas|numpy)\b/.test(corpus)) return 'python';
  if (/\b(javascript|typescript|react|next\.?js|node\.?js|express|vue|angular)\b/.test(corpus)) return 'javascript';
  if (/\b(java|spring)\b/.test(corpus)) return 'java';
  if (/\b(c\+\+|cpp|embedded|esp32|arduino)\b/.test(corpus)) return 'cpp';
  if (/\b(sql|postgresql|postgres|mysql)\b/.test(corpus)) return 'sql';
  return 'python';
}

/**
 * Computes how many resume-grounded oral questions the auditor must ask (5 to 6).
 * Rich resumes with >= 6 skills or >= 2 projects get 6 questions; compact documents get 5.
 */
export function resolveOralDefenseTurnCount(
  challenge: Pick<VaultDefenseChallenge, 'claimedSkills' | 'projects' | 'rawTextExcerpt'>
): number {
  const skillCount = (challenge.claimedSkills || []).length;
  const projectCount = (challenge.projects || []).length;
  const textLen = (challenge.rawTextExcerpt || '').trim().length;
  return skillCount >= 6 || projectCount >= 2 || textLen >= 900 ? 6 : 5;
}

/**
 * Generates brutal, confrontational credential defense questions targeting exact claimed skills.
 */
export function generateBrutalDefensePrompt(
  challenge: VaultDefenseChallenge,
  stepIndex: number,
  totalTurns?: number
): string {
  const auditor = challenge.auditor.name;
  const expectedTotal = totalTurns || resolveOralDefenseTurnCount(challenge);
  const aiQuestion = challenge.defenseQuestions?.[stepIndex]?.trim();
  if (aiQuestion && aiQuestion.length >= 20) {
    if (stepIndex === 0 && !aiQuestion.toLowerCase().includes(auditor.toLowerCase())) {
      const skillsPreview = challenge.claimedSkills.slice(0, 6).join(', ');
      return `${auditor} (Credential Auditor): I just read your "${challenge.title}"${skillsPreview ? ` — you list ${skillsPreview}` : ''}. No generic fluff. ${aiQuestion}`;
    }
    return aiQuestion;
  }

  const skills = challenge.claimedSkills.length > 0
    ? challenge.claimedSkills
    : ['Core Technical Foundations', 'Architecture'];
  const targetSkill = skills[stepIndex % skills.length];
  const secondarySkill = skills[(stepIndex + 1) % skills.length] || targetSkill;
  const project = challenge.projects?.[stepIndex % Math.max(1, challenge.projects.length)];
  const docLabel = challenge.itemType === 'certification' ? 'Certificate' : challenge.itemType === 'resume' ? 'Resume' : 'Document';

  if (stepIndex === 0) {
    return `${auditor} (Credential Auditor): Hold on — I audited "${challenge.title}" (${docLabel}) where you claim: ${skills.slice(0, 6).join(', ')}. Buzzwords on a ${docLabel.toLowerCase()} mean nothing to me until you survive questioning. Let's test if this document is real or bluff. Question 1 of ${expectedTotal} — Pick up ${targetSkill}: explain the exact internal mechanics, memory/data flow, and one concrete failure mode you personally solved using ${targetSkill}. No textbook definitions.`;
  }

  if (stepIndex === 1) {
    return `Too many candidates fake ${targetSkill} on their ${docLabel.toLowerCase()}. Question 2 of ${expectedTotal}: Imagine your ${targetSkill} system gets hit with 10x malformed concurrent requests or tight latency SLAs right now. What breaks first, what exact trade-offs or complexity bounds apply, and how do you architect the fix?`;
  }

  if (stepIndex < expectedTotal - 1) {
    const projRef = project?.name ? ` in "${project.name}"` : '';
    return `Question ${stepIndex + 1} of ${expectedTotal}: You list ${targetSkill}${projRef} on "${challenge.title}". Walk me through one concrete production bug, edge case, or design decision you personally debugged with ${targetSkill} — be specific about inputs, failure symptoms, and your fix.`;
  }

  return `Final Audit Check (Question ${expectedTotal} of ${expectedTotal}): Looking at your claimed stack (${skills.slice(0, 4).join(', ')}) in "${challenge.title}", walk me through an end-to-end production decision where ${targetSkill} and ${secondarySkill} had to work together under strict security, edge-case validation, or cost limits. Prove this credential belongs to you.`;
}

function languageDisplayName(lang: VaultDefenseCodingResult['language']): string {
  if (lang === 'python') return 'Python';
  if (lang === 'javascript') return 'JavaScript';
  if (lang === 'java') return 'Java';
  if (lang === 'cpp') return 'C++';
  return 'SQL';
}

/**
 * Evaluates all candidate defense answers strictly (anti-bluff, depth-based scoring).
 * Supports both 3-turn and 5-6-turn defenses plus optional live coding verification.
 * Bar to pass: >= 65/100. Fail -> -5 Trust Score. Pass -> +5 Trust Score + Portfolio Skills Sync.
 */
export function evaluateVaultDefenseResponses(
  claimedSkills: string[],
  userResponses: string[],
  codingResult?: VaultDefenseCodingResult
): VaultDefenseResult {
  const validAnswers = userResponses.map((a) => String(a || '').trim()).filter(Boolean);
  if (validAnswers.length === 0) {
    return {
      passed: false,
      score: 12,
      verdict: 'Rejected — Unsubstantiated Claims',
      trustDelta: -5,
      verifiedSkillsAdded: [],
      provenSkills: [],
      codingResult,
      critique: 'Zero substantive answers submitted during skill defense. Credential claims failed verification (-5 Trust Score).',
    };
  }

  const normalizedSkills = claimedSkills.map((s) => s.toLowerCase());
  const technicalMechanismsRe =
    /\b(because|therefore|since|trade-off|tradeoff|complexity|latency|throughput|index|cache|memory|thread|async|await|promise|schema|transaction|acid|state|hook|renders?|useeffect|usememo|usecallback|memoiz\w*|reference|equality|dependency|closure|hydration|middleware|endpoint|exception|constraint|virtual dom|container|cluster|queue|retry|backoff|validation|auth|token|jwt|sql|join|normalization|margin|reconciliation|audit|variance|ratio|o\(|linear|logarithmic|edge case|bottleneck|timeout|deadlock|race condition)\b/gi;
  const bluffOrEvasionRe =
    /^(?:i don'?t know|idk|no idea|not sure|skip|pass|yes|ok|good|fine|maybe|nothing|i used it|just basic|copied|chat ?gpt)\b/i;

  let totalPoints = 0;
  let evasionCount = 0;
  let mechanismHitsTotal = 0;
  const provenSkillsMap = new Map<string, string>();
  const canonicalSkillKey = (s: string) => s.trim().toLowerCase().replace(/\.js$/i, '');

  for (const ans of validAnswers) {
    const words = ans.split(/\s+/).filter(Boolean);
    if (words.length < 8 || bluffOrEvasionRe.test(ans.toLowerCase())) {
      evasionCount++;
      totalPoints += 8;
      continue;
    }

    // Word depth (max 15 pts per answer)
    const depthPts = Math.min(15, Math.round(words.length / 2.5));
    // Technical/causal mechanism hits (max 15 pts per answer)
    const mechMatches = ans.match(technicalMechanismsRe) || [];
    const uniqueMechCount = new Set(mechMatches.map((m) => m.toLowerCase())).size;
    mechanismHitsTotal += mechMatches.length;
    const mechPts = Math.min(15, uniqueMechCount * 4);
    // Skill relevance bonus
    const lowerAns = ans.toLowerCase();
    const skillMatch = normalizedSkills.some((sk) =>
      lowerAns.includes(sk.split(' ')[0].toLowerCase())
    )
      ? 5
      : 0;

    // Granular per-skill proof: if this single answer demonstrated strong technical depth,
    // credit ONLY the specific skills proven in this answer (matching claimed skills first, without duplicates)
    if (words.length >= 14 && uniqueMechCount >= 2) {
      let matchedClaimedInAns = false;
      for (const claimed of claimedSkills) {
        const stem = canonicalSkillKey(claimed).split(/\s+/)[0];
        if (stem.length >= 3 && new RegExp(`\\b${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(ans)) {
          const key = canonicalSkillKey(claimed);
          const cleanDisplay = claimed.replace(/\.js$/i, (m) =>
            ['react.js'].includes(claimed.toLowerCase()) ? '' : m
          );
          if (!provenSkillsMap.has(key)) provenSkillsMap.set(key, cleanDisplay);
          matchedClaimedInAns = true;
        }
      }
      if (!matchedClaimedInAns) {
        const detectedInAns = extractSkillsFast(ans);
        for (const sk of detectedInAns) {
          const key = canonicalSkillKey(sk);
          if (!provenSkillsMap.has(key)) provenSkillsMap.set(key, sk);
        }
      }
    }

    totalPoints += Math.min(35, depthPts + mechPts + skillMatch);
  }

  // Normalize across actual turn count (works identically for 3-turn and 5-6-turn defenses)
  const expectedTurns = Math.max(3, validAnswers.length);
  const maxRawPoints = expectedTurns * 35;
  const scaledOralScore = (totalPoints / maxRawPoints) * 100;
  const completenessPenalty = validAnswers.length < 3 ? (3 - validAnswers.length) * 18 : 0;
  const evasionPenalty = Math.round((evasionCount / expectedTurns) * 45);

  let codingAdjustment = 0;
  let codingNote = '';
  if (codingResult?.required) {
    const langName = languageDisplayName(codingResult.language);
    if (codingResult.passed) {
      codingAdjustment = 12;
      const key = canonicalSkillKey(langName);
      if (!provenSkillsMap.has(key)) provenSkillsMap.set(key, langName);
      codingNote = ` Passed live ${langName} coding check (${codingResult.passedTests}/${codingResult.totalTests} tests).`;
    } else if (codingResult.skipped) {
      codingAdjustment = -10;
      codingNote = ` Skipped live ${langName} coding verification.`;
    } else {
      codingAdjustment = codingResult.passedTests > 0 ? 0 : -6;
      codingNote = ` Live ${langName} coding check passed ${codingResult.passedTests}/${codingResult.totalTests} tests.`;
    }
  }

  const score = Math.max(
    5,
    Math.min(98, Math.round(scaledOralScore - completenessPenalty - evasionPenalty + codingAdjustment))
  );

  const maxAllowedEvasions = Math.max(1, Math.floor(expectedTurns / 3));
  const passed =
    score >= 65 &&
    evasionCount <= maxAllowedEvasions &&
    validAnswers.length >= 2 &&
    mechanismHitsTotal >= 2;
  const provenSkills = Array.from(provenSkillsMap.values());

  if (passed) {
    return {
      passed: true,
      score,
      verdict: 'Verified Authentic',
      trustDelta: 5,
      verifiedSkillsAdded: claimedSkills,
      provenSkills: claimedSkills,
      codingResult,
      critique: `Strong technical defense (${score}/100). Mechanisms and trade-offs verified under questioning.${codingNote} (+5 Trust Score, ${claimedSkills.length} skills synced to Portfolio).`,
    };
  }

  return {
    passed: false,
    score,
    verdict: 'Rejected — Unsubstantiated Claims',
    trustDelta: -5,
    verifiedSkillsAdded: provenSkills,
    provenSkills,
    codingResult,
    critique:
      provenSkills.length > 0
        ? `Failed full document defense (${score}/100, -5 Trust Score), but verified real technical command of ${provenSkills.join(', ')} — synced to your Portfolio.${codingNote}`
        : `Failed Brutal Skill Defense (${score}/100). Answers lacked concrete implementation mechanics or evaded technical depth.${codingNote} Flagged as unsubstantiated claim (-5 Trust Score).`,
  };
}

const DEFENSE_CHALLENGE_KEY = 'pinit_pending_vault_defense';

export function savePendingVaultDefense(challenge: VaultDefenseChallenge): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(challenge);
    sessionStorage.setItem(DEFENSE_CHALLENGE_KEY, serialized);
    localStorage.setItem(`${DEFENSE_CHALLENGE_KEY}_${challenge.docId}`, serialized);
  } catch {}
}

export function loadPendingVaultDefense(docId?: string | null): VaultDefenseChallenge | null {
  if (typeof window === 'undefined') return null;
  try {
    if (docId) {
      const byId = localStorage.getItem(`${DEFENSE_CHALLENGE_KEY}_${docId}`);
      if (byId) return JSON.parse(byId);
    }
    const raw = sessionStorage.getItem(DEFENSE_CHALLENGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearPendingVaultDefense(docId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(DEFENSE_CHALLENGE_KEY);
    if (docId) localStorage.removeItem(`${DEFENSE_CHALLENGE_KEY}_${docId}`);
  } catch {}
}
