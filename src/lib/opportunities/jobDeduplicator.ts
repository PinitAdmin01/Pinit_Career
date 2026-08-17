// src/lib/opportunities/jobDeduplicator.ts
// PinIT Fuzzy Job Deduplication & Canonical Normalizer Engine
// Architecture:
// 1. Layered Matching: Exact ID/URL -> Exact Identity -> Blocking Index -> Multi-Factor Similarity
// 2. High-Precision Confidence Bands: >= 0.90 Auto-Merge, 0.75-0.89 Review Candidate, < 0.75 Separate
// 3. Non-Destructive Provenance: Preserves original source records while clustering canonical listings
// 4. Company Aliases & Track Normalization (preserves originalTitle & originalCompany)

export const JOB_DEDUPLICATOR_VERSION = 'v1.0';

export interface RawJobRecord {
  id?: string;
  externalJobId?: string;
  title: string;
  company: string;
  location?: string;
  employmentType?: 'full-time' | 'part-time' | 'internship' | 'contract' | string;
  description?: string;
  skills?: string[];
  applicationUrl?: string;
  source?: string;
  postedAt?: string;
  salary?: string;
  [key: string]: any;
}

export type SeniorityLevel = 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff' | 'Principal' | 'Unspecified';

export interface NormalizedJobRecord extends RawJobRecord {
  id: string;
  originalTitle: string;
  originalCompany: string;
  normalizedTitle: string;
  normalizedCompany: string;
  canonicalCompanyKey: string;
  careerTrack: string;
  seniority: SeniorityLevel;
  normalizedLocation: string;
  canonicalUrlKey: string;
}

export interface CanonicalJobCluster {
  canonicalJobId: string;
  masterListing: NormalizedJobRecord;
  duplicateSources: string[];
  sourceIds: string[];
  sourceUrls: string[];
  confidence: number;
  mergeReason: string;
  isAutoMerged: boolean;
  needsReview: boolean;
  mergedAt: string;
  deduplicatorVersion: string;
}

export interface DeduplicationResult {
  engineVersion: string;
  totalInputJobs: number;
  uniqueCanonicalJobsCount: number;
  autoMergedCount: number;
  reviewCandidatesCount: number;
  canonicalClusters: CanonicalJobCluster[];
  flatDeduplicatedJobs: NormalizedJobRecord[];
}

// 1. Company Aliases Dictionary
export const COMPANY_ALIASES: Record<string, string> = {
  'aws': 'amazon',
  'amazon web services': 'amazon',
  'amazon.com': 'amazon',
  'amazon india': 'amazon',
  'google llc': 'google',
  'google india': 'google',
  'alphabet': 'google',
  'meta platforms': 'meta',
  'facebook': 'meta',
  'microsoft corp': 'microsoft',
  'microsoft india': 'microsoft',
  'apple inc': 'apple',
  'netflix inc': 'netflix',
  'stripe inc': 'stripe',
  'uber technologies': 'uber',
  'salesforce inc': 'salesforce',
  'oracle corp': 'oracle',
  'ibm corp': 'ibm',
  'cisco systems': 'cisco',
  'adobe inc': 'adobe',
  'flipkart internet': 'flipkart',
  'swiggy bundl': 'swiggy',
  'zomato ltd': 'zomato'
};

const CORPORATE_SUFFIXES = [
  'pvt ltd', 'private limited', 'pvt. ltd.', 'ltd.', 'ltd', 'inc.', 'inc',
  'llc.', 'llc', 'corp.', 'corp', 'corporation', 'co.', 'co',
  'technologies', 'solutions', 'services', 'systems', 'group', 'holdings'
];

/**
 * Normalizes company names by cleaning corporate suffixes and resolving aliases
 */
export function normalizeCompanyName(rawName: string): { normalizedCompany: string; canonicalCompanyKey: string } {
  if (!rawName || typeof rawName !== 'string') {
    return { normalizedCompany: 'Unknown Company', canonicalCompanyKey: 'unknown' };
  }

  let cleaned = rawName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Direct Alias Lookup
  if (COMPANY_ALIASES[cleaned]) {
    const alias = COMPANY_ALIASES[cleaned];
    return {
      normalizedCompany: alias.charAt(0).toUpperCase() + alias.slice(1),
      canonicalCompanyKey: alias
    };
  }

  // 2. Check if any known alias is contained as a distinct phrase
  for (const [aliasPattern, canonicalTarget] of Object.entries(COMPANY_ALIASES)) {
    const regex = new RegExp(`\\b${aliasPattern}\\b`, 'i');
    if (regex.test(cleaned)) {
      return {
        normalizedCompany: canonicalTarget.charAt(0).toUpperCase() + canonicalTarget.slice(1),
        canonicalCompanyKey: canonicalTarget
      };
    }
  }

  // 3. Remove corporate suffixes
  CORPORATE_SUFFIXES.forEach(suffix => {
    const regex = new RegExp(`\\b${suffix.replace(/[^a-z0-9]/g, '')}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '').trim();
  });

  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Check alias lookup again after suffix removal
  const aliasKey = COMPANY_ALIASES[cleaned] || cleaned || 'unknown';

  const display = aliasKey
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    normalizedCompany: display,
    canonicalCompanyKey: aliasKey
  };
}

/**
 * Extracts seniority and standardizes career track while preserving original title
 */
export function normalizeJobTitle(rawTitle: string): {
  normalizedTitle: string;
  careerTrack: string;
  seniority: SeniorityLevel;
} {
  if (!rawTitle || typeof rawTitle !== 'string') {
    return { normalizedTitle: 'General Software Engineer', careerTrack: 'General Tech', seniority: 'Unspecified' };
  }

  const lower = rawTitle.toLowerCase();

  // 1. Detect Seniority
  let seniority: SeniorityLevel = 'Unspecified';
  if (lower.includes('intern') || lower.includes('trainee') || lower.includes('graduate')) seniority = 'Intern';
  else if (lower.includes('junior') || lower.includes('associate') || lower.includes('entry level') || lower.includes('l1')) seniority = 'Junior';
  else if (lower.includes('principal') || lower.includes('director') || lower.includes('vp')) seniority = 'Principal';
  else if (lower.includes('staff') || lower.includes('distinguished')) seniority = 'Staff';
  else if (lower.includes('lead') || lower.includes('tech lead') || lower.includes('architect')) seniority = 'Lead';
  else if (lower.includes('senior') || lower.includes('sr.') || lower.includes('sr ') || lower.includes('l3') || lower.includes('l4')) seniority = 'Senior';
  else if (lower.includes('mid') || lower.includes('software engineer 2') || lower.includes('sde 2') || lower.includes('sde ii')) seniority = 'Mid';

  // 2. Classify Career Track
  let careerTrack = 'General Tech';
  if (lower.includes('frontend') || lower.includes('front-end') || lower.includes('react') || lower.includes('ui/ux') || lower.includes('web dev')) {
    careerTrack = 'Frontend Engineer';
  } else if (lower.includes('backend') || lower.includes('back-end') || lower.includes('node') || lower.includes('golang') || lower.includes('java dev') || lower.includes('python dev')) {
    careerTrack = 'Backend Engineer';
  } else if (lower.includes('fullstack') || lower.includes('full stack') || lower.includes('full-stack') || lower.includes('sde') || lower.includes('software engineer')) {
    careerTrack = 'Full Stack Engineer';
  } else if (lower.includes('devops') || lower.includes('cloud') || lower.includes('sre') || lower.includes('infrastructure') || lower.includes('kubernetes')) {
    careerTrack = 'DevOps / Cloud';
  } else if (lower.includes('data analyst') || lower.includes('business analyst') || lower.includes('bi analyst') || lower.includes('analytics')) {
    careerTrack = 'Data Analyst';
  } else if (lower.includes('machine learning') || lower.includes('ai engineer') || lower.includes('data scientist') || lower.includes('deep learning')) {
    careerTrack = 'AI / ML Engineer';
  } else if (lower.includes('product manager') || lower.includes('technical program manager') || lower.includes('tpm') || lower.includes('scrum master')) {
    careerTrack = 'Product Manager';
  } else if (lower.includes('cybersecurity') || lower.includes('security engineer') || lower.includes('infosec')) {
    careerTrack = 'Cybersecurity Engineer';
  }

  const prefix = seniority !== 'Unspecified' ? `${seniority} ` : '';
  const normalizedTitle = `${prefix}${careerTrack}`;

  return {
    normalizedTitle,
    careerTrack,
    seniority
  };
}

/**
 * Normalizes location strings
 */
export function normalizeLocation(rawLoc?: string): string {
  if (!rawLoc) return 'remote';
  const lower = rawLoc.toLowerCase().trim();
  if (lower.includes('remote') || lower.includes('anywhere') || lower.includes('work from home')) return 'remote';
  return lower.replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Normalizes application URLs to canonical root paths
 */
export function normalizeApplicationUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  try {
    const parsed = new URL(rawUrl);
    // Strip tracking queries (utm_*, ref, etc.)
    parsed.search = '';
    return `${parsed.hostname}${parsed.pathname}`.toLowerCase().replace(/\/+$/, '');
  } catch {
    return rawUrl.trim().toLowerCase().replace(/\/+$/, '');
  }
}

/**
 * Computes Jaccard similarity between two sets of strings
 */
export function computeJaccardSimilarity(arrA: string[] = [], arrB: string[] = []): number {
  const setA = new Set(arrA.map(s => s.toLowerCase().trim()).filter(Boolean));
  const setB = new Set(arrB.map(s => s.toLowerCase().trim()).filter(Boolean));
  if (setA.size === 0 && setB.size === 0) return 0.5; // neutral baseline when no skills provided
  if (setA.size === 0 || setB.size === 0) return 0.3;

  let intersection = 0;
  setA.forEach(item => {
    if (setB.has(item)) intersection++;
  });

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 1 : intersection / union;
}

/**
 * Computes Levenshtein edit similarity between two strings (0.0 to 1.0)
 */
export function computeStringSimilarity(strA: string, strB: string): number {
  const s1 = (strA || '').toLowerCase().trim();
  const s2 = (strB || '').toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const len1 = s1.length;
  const len2 = s2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1.0 : Math.max(0, 1 - distance / maxLen);
}

/**
 * Ingests and standardizes raw job listings into NormalizedJobRecords
 */
export function normalizeJobRecord(raw: RawJobRecord, index = 0): NormalizedJobRecord {
  const { normalizedCompany, canonicalCompanyKey } = normalizeCompanyName(raw.company);
  const { normalizedTitle, careerTrack, seniority } = normalizeJobTitle(raw.title);
  const normalizedLocation = normalizeLocation(raw.location);
  const canonicalUrlKey = normalizeApplicationUrl(raw.applicationUrl);

  return {
    ...raw,
    id: raw.id || `job-${index + 1}-${canonicalCompanyKey}-${Date.now().toString(36)}`,
    originalTitle: raw.title,
    originalCompany: raw.company,
    normalizedTitle,
    normalizedCompany,
    canonicalCompanyKey,
    careerTrack,
    seniority,
    normalizedLocation,
    canonicalUrlKey
  };
}

/**
 * Computes layered similarity match between two normalized job records
 */
export function calculateJobSimilarity(jobA: NormalizedJobRecord, jobB: NormalizedJobRecord): {
  similarityScore: number;
  matchType: 'EXACT_URL' | 'EXACT_EXTERNAL_ID' | 'STRONG_IDENTITY' | 'FUZZY_MATCH';
  reason: string;
} {
  // Layer 1: Exact External Job ID
  if (jobA.externalJobId && jobB.externalJobId && jobA.externalJobId === jobB.externalJobId) {
    return { similarityScore: 1.0, matchType: 'EXACT_EXTERNAL_ID', reason: `Exact external job ID match: ${jobA.externalJobId}` };
  }

  // Layer 2: Exact Canonical Application URL
  if (jobA.canonicalUrlKey && jobB.canonicalUrlKey && jobA.canonicalUrlKey === jobB.canonicalUrlKey) {
    return { similarityScore: 0.98, matchType: 'EXACT_URL', reason: `Exact canonical URL match: ${jobA.canonicalUrlKey}` };
  }

  // Layer 3: Strong Identity Match (Same Company Alias + Same Track + Same Seniority + Same Location)
  const isSameCompany = jobA.canonicalCompanyKey === jobB.canonicalCompanyKey;
  const isSameTrack = jobA.careerTrack === jobB.careerTrack;
  const isSameSeniority = jobA.seniority === jobB.seniority;
  const isSameLocation = jobA.normalizedLocation === jobB.normalizedLocation;

  if (isSameCompany && isSameTrack && isSameSeniority && isSameLocation) {
    const titleSim = computeStringSimilarity(jobA.originalTitle, jobB.originalTitle);
    const skillSim = computeJaccardSimilarity(jobA.skills, jobB.skills);
    const score = 0.90 + (titleSim * 0.06) + (skillSim * 0.04);
    return {
      similarityScore: Math.min(0.99, score),
      matchType: 'STRONG_IDENTITY',
      reason: `Same company (${jobA.normalizedCompany}), track (${jobA.careerTrack}), seniority (${jobA.seniority}), and location (${jobA.normalizedLocation})`
    };
  }

  // Layer 4: Multi-Factor Fuzzy Similarity
  // If company or location are entirely distinct, heavily discount to prevent false positive merges across locations
  const companySim = computeStringSimilarity(jobA.canonicalCompanyKey, jobB.canonicalCompanyKey);
  const titleSim = computeStringSimilarity(jobA.originalTitle, jobB.originalTitle);
  const locationSim = isSameLocation ? 1.0 : computeStringSimilarity(jobA.normalizedLocation, jobB.normalizedLocation);
  const senioritySim = isSameSeniority ? 1.0 : 0.4;
  const skillSim = computeJaccardSimilarity(jobA.skills, jobB.skills);

  // Multi-factor formula
  const weightedScore =
    (companySim * 0.30) +
    (titleSim * 0.25) +
    (locationSim * 0.20) +
    (senioritySim * 0.15) +
    (skillSim * 0.10);

  return {
    similarityScore: Number(weightedScore.toFixed(3)),
    matchType: 'FUZZY_MATCH',
    reason: `Multi-factor match: Company ${(companySim * 100).toFixed(0)}%, Title ${(titleSim * 100).toFixed(0)}%, Location ${(locationSim * 100).toFixed(0)}%`
  };
}

/**
 * Deduplicates and clusters job listings with confidence bands and non-destructive provenance
 */
export function deduplicateJobListings(
  rawJobs: RawJobRecord[],
  options?: { autoMergeThreshold?: number; reviewThreshold?: number }
): DeduplicationResult {
  const AUTO_MERGE_THRESHOLD = options?.autoMergeThreshold ?? 0.90;
  const REVIEW_THRESHOLD = options?.reviewThreshold ?? 0.75;

  const normalizedJobs = rawJobs.map((j, idx) => normalizeJobRecord(j, idx));
  const canonicalClusters: CanonicalJobCluster[] = [];
  const assignedClusterIndices = new Map<number, number>(); // jobIdx -> clusterIdx

  // Process listings in order
  for (let i = 0; i < normalizedJobs.length; i++) {
    if (assignedClusterIndices.has(i)) continue;

    const currentJob = normalizedJobs[i];
    const sourceIds = [currentJob.id];
    const sourceUrls = currentJob.applicationUrl ? [currentJob.applicationUrl] : [];
    const duplicateSources = [currentJob.source || 'Direct Portal'];
    let bestConfidence = 1.0;
    let primaryMergeReason = 'Master Listing';
    let isAutoMerged = false;
    let needsReview = false;

    // Compare with subsequent candidates using company/track blocking index
    for (let j = i + 1; j < normalizedJobs.length; j++) {
      if (assignedClusterIndices.has(j)) continue;

      const candidateJob = normalizedJobs[j];

      // Fast Blocking Check: skip if company keys differ completely and URLs are distinct
      if (
        currentJob.canonicalCompanyKey !== candidateJob.canonicalCompanyKey &&
        !currentJob.canonicalUrlKey &&
        !candidateJob.canonicalUrlKey &&
        computeStringSimilarity(currentJob.canonicalCompanyKey, candidateJob.canonicalCompanyKey) < 0.6
      ) {
        continue;
      }

      const match = calculateJobSimilarity(currentJob, candidateJob);

      if (match.similarityScore >= AUTO_MERGE_THRESHOLD) {
        // High confidence Auto-Merge
        assignedClusterIndices.set(j, canonicalClusters.length);
        sourceIds.push(candidateJob.id);
        if (candidateJob.applicationUrl) sourceUrls.push(candidateJob.applicationUrl);
        if (candidateJob.source && !duplicateSources.includes(candidateJob.source)) {
          duplicateSources.push(candidateJob.source);
        }
        bestConfidence = Math.max(bestConfidence, match.similarityScore);
        primaryMergeReason = match.reason;
        isAutoMerged = true;
      } else if (match.similarityScore >= REVIEW_THRESHOLD) {
        // Flag as review candidate but do not silently overwrite
        needsReview = true;
        primaryMergeReason = `${match.reason} (Review Candidate)`;
      }
    }

    assignedClusterIndices.set(i, canonicalClusters.length);

    canonicalClusters.push({
      canonicalJobId: `CANONICAL-${currentJob.id}`,
      masterListing: {
        ...currentJob,
        // Enrich master listing with merged sources if auto-merged
        crossPostedSources: duplicateSources
      } as any,
      duplicateSources,
      sourceIds,
      sourceUrls,
      confidence: Number(bestConfidence.toFixed(2)),
      mergeReason: primaryMergeReason,
      isAutoMerged,
      needsReview,
      mergedAt: new Date().toISOString(),
      deduplicatorVersion: JOB_DEDUPLICATOR_VERSION
    });
  }

  const flatDeduplicatedJobs = canonicalClusters.map(c => c.masterListing);
  const autoMergedCount = canonicalClusters.filter(c => c.isAutoMerged).length;
  const reviewCandidatesCount = canonicalClusters.filter(c => c.needsReview).length;

  return {
    engineVersion: JOB_DEDUPLICATOR_VERSION,
    totalInputJobs: rawJobs.length,
    uniqueCanonicalJobsCount: canonicalClusters.length,
    autoMergedCount,
    reviewCandidatesCount,
    canonicalClusters,
    flatDeduplicatedJobs
  };
}
