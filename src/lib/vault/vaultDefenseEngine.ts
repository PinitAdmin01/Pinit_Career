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

export interface VaultDefenseChallenge {
  docId: string;
  userId?: string;
  title: string;
  itemType: string;
  organizationName?: string;
  claimedSkills: string[];
  auditor: VaultAuditorProfile;
  createdAt: string;
}

export interface VaultDefenseResult {
  passed: boolean;
  score: number;
  verdict: 'Verified Authentic' | 'Rejected — Unsubstantiated Claims';
  trustDelta: 5 | -5;
  verifiedSkillsAdded: string[];
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
  if (result.size === 0 && source.trim().length > 0) {
    if (/resume|cv/i.test(source)) {
      result.set('system design', 'System Design');
      result.set('problem solving', 'Problem Solving');
    } else if (/certif/i.test(source)) {
      result.set('applied domain mastery', 'Applied Domain Mastery');
    }
  }
  return Array.from(result.values()).slice(0, 12);
}

/**
 * Generates brutal, confrontational credential defense questions targeting exact claimed skills.
 */
export function generateBrutalDefensePrompt(
  challenge: VaultDefenseChallenge,
  stepIndex: number
): string {
  const skills = challenge.claimedSkills.length > 0
    ? challenge.claimedSkills
    : ['Core Technical Foundations', 'Architecture'];
  const skill1 = skills[0];
  const skill2 = skills[1] || skills[0];
  const skill3 = skills[2] || skills.slice(0, 3).join(', ');
  const docLabel = challenge.itemType === 'certification' ? 'Certificate' : challenge.itemType === 'resume' ? 'Resume' : 'Document';
  const auditor = challenge.auditor.name;

  if (stepIndex === 0) {
    return `${auditor} (Credential Auditor): Hold on — I audited "${challenge.title}" (${docLabel}) where you claim: ${skills.slice(0, 5).join(', ')}. Buzzwords on a ${docLabel.toLowerCase()} mean nothing to me until you survive questioning. Let's test if this document is real or bluff. Question 1 of 3 — Pick up ${skill1}: explain the exact internal mechanics, memory/data flow, and one concrete failure mode you personally solved using ${skill1}. No textbook definitions.`;
  }

  if (stepIndex === 1) {
    return `Too many candidates fake ${skill2} on their ${docLabel.toLowerCase()}. Question 2 of 3: Imagine your ${skill2} system gets hit with 10x malformed concurrent requests or tight latency SLAs right now. What breaks first, what exact trade-offs or complexity bounds apply, and how do you architect the fix?`;
  }

  return `Final Audit Check (Question 3 of 3): Looking at your claimed stack (${skill3}) in "${challenge.title}", walk me through an end-to-end production decision where ${skill1} and ${skill2} had to work together under strict security, edge-case validation, or cost limits. Prove this credential belongs to you.`;
}

/**
 * Evaluates all candidate defense answers strictly (anti-bluff, depth-based scoring).
 * Bar to pass: >= 65/100. Fail -> -5 Trust Score. Pass -> +5 Trust Score + Portfolio Skills Sync.
 */
export function evaluateVaultDefenseResponses(
  claimedSkills: string[],
  userResponses: string[]
): VaultDefenseResult {
  const validAnswers = userResponses.map((a) => String(a || '').trim()).filter(Boolean);
  if (validAnswers.length === 0) {
    return {
      passed: false,
      score: 12,
      verdict: 'Rejected — Unsubstantiated Claims',
      trustDelta: -5,
      verifiedSkillsAdded: [],
      critique: 'Zero substantive answers submitted during skill defense. Credential claims failed verification (-5 Trust Score).',
    };
  }

  const normalizedSkills = claimedSkills.map((s) => s.toLowerCase());
  const technicalMechanismsRe =
    /\b(because|therefore|since|trade-off|tradeoff|complexity|latency|throughput|index|cache|memory|thread|async|await|promise|schema|transaction|acid|state|hook|render|virtual dom|container|cluster|queue|retry|backoff|validation|auth|token|jwt|sql|join|normalization|margin|reconciliation|audit|variance|ratio|o\(|linear|logarithmic|edge case|bottleneck|timeout|deadlock|race condition)\b/gi;
  const bluffOrEvasionRe =
    /^(?:i don'?t know|idk|no idea|not sure|skip|pass|yes|ok|good|fine|maybe|nothing|i used it|just basic|copied|chat ?gpt)\b/i;

  let totalPoints = 0;
  let evasionCount = 0;
  let mechanismHitsTotal = 0;

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
    mechanismHitsTotal += mechMatches.length;
    const mechPts = Math.min(15, new Set(mechMatches.map((m) => m.toLowerCase())).size * 4);
    // Skill relevance bonus
    const skillMatch = normalizedSkills.some((sk) =>
      ans.toLowerCase().includes(sk.split(' ')[0].toLowerCase())
    )
      ? 5
      : 0;

    totalPoints += Math.min(35, depthPts + mechPts + skillMatch);
  }

  // Penalize missing questions out of 3
  const completenessPenalty = validAnswers.length < 3 ? (3 - validAnswers.length) * 18 : 0;
  const evasionPenalty = evasionCount * 15;
  const score = Math.max(5, Math.min(98, Math.round(totalPoints - completenessPenalty - evasionPenalty)));

  const passed = score >= 65 && evasionCount <= 1 && validAnswers.length >= 2 && mechanismHitsTotal >= 2;

  if (passed) {
    return {
      passed: true,
      score,
      verdict: 'Verified Authentic',
      trustDelta: 5,
      verifiedSkillsAdded: claimedSkills,
      critique: `Strong technical defense (${score}/100). Mechanisms and trade-offs verified under questioning (+5 Trust Score, ${claimedSkills.length} skills synced to Portfolio).`,
    };
  }

  return {
    passed: false,
    score,
    verdict: 'Rejected — Unsubstantiated Claims',
    trustDelta: -5,
    verifiedSkillsAdded: [],
    critique: `Failed Brutal Skill Defense (${score}/100). Answers lacked concrete implementation mechanics or evaded technical depth. Flagged as unsubstantiated claim (-5 Trust Score).`,
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
