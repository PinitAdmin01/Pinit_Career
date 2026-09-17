// src/lib/ats/documentAuditEngine.ts
/**
 * ============================================================================
 * STAGE 10 & 11: DECOUPLED QT1 CAPABILITY, EVIDENCE TRUST & ATS SCREENER
 * ============================================================================
 * 
 * Purpose:
 * Computes live, unpolluted scores across four completely decoupled pillars:
 * 1. QT1 Capability Score (0-100): Pure capability mastery based on Socratic quests,
 *    demonstrated projects, and code assessments. Resumes grant 0 capability points.
 * 2. QT2 Persona Profile (0-100): Mindset, persistence, problem-solving disposition.
 * 3. Evidence Trust Index (0-100): Authenticity, identity consistency, cross-record checks.
 * 4. ATS Presentation Score (0-100): Recruiter parseability, keyword match, and layout risk.
 */

import { groundAndValidateEvidence, ValidatedCandidateGraph, GroundedProvenanceRecord } from './factCheckValidator';
import { evaluateDocumentContradictions } from './contradictionEngine';
import { auditResumeATS, AtsAuditReport } from './atsScreener';
import { evaluateQT2Model, QT2ModelEvaluation } from './qt2AnalysisEngine';

export type VaultCategory =
  | '10th'
  | '12th_puc'
  | 'sem1'
  | 'sem2'
  | 'sem3'
  | 'sem4'
  | 'sem5'
  | 'sem6'
  | 'sem7'
  | 'sem8'
  | 'resume'
  | 'achievement'
  | 'certification'
  | 'internship'
  | 'other';

export interface VaultDocumentSlot {
  id: string;
  category: VaultCategory;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  storageUrl?: string;
  candidateName?: string;
  rollNo?: string;
  institution?: string;
  scoreOrGpa?: string;
  skills: string[];
  verificationStatus: 'verified' | 'mismatch_warning' | 'provisional';
  verificationLevel?: 'SELF_SUBMITTED' | 'STRUCTURALLY_VALIDATED' | 'CROSS_VALIDATED' | 'THIRD_PARTY_VERIFIED' | 'INSTITUTION_VERIFIED';
  mismatchReason?: string;
  documentHash?: string;
  provenanceRecords?: GroundedProvenanceRecord[];
  atsScore?: number;
  uploadedAt: number;
}

export interface AcademicSemesterData {
  semester: number;
  gpa: number;
  institution?: string;
  verified: boolean;
}

export interface IdentityAuditReport {
  primaryName: string;
  totalDocuments: number;
  verifiedCount: number;
  mismatchCount: number;
  overallStatus: 'SENTINEL_CLEAN' | 'IDENTITY_MISMATCH_FLAGGED' | 'PROVISIONAL_PENDING' | 'REVIEW_REQUIRED' | 'AWAITING_UPLOADS' | 'UNREADABLE_DOCUMENTS_REJECTED';
  trustScore: number; // Evidence Trust Index (0-100)
  conflictingDocuments: {
    slotId: string;
    fileName: string;
    detectedName: string;
    expectedName: string;
    reason: string;
  }[];
  identityConsistencyPercentage: number;
}

export interface LiveQTCalibration {
  qt1Score: number; // Pure Capability Score (0-100)
  qt2Score: number; // Persona Diagnostic Alignment (0-100)
  evidenceTrustScore: number; // Evidence Trust Index (0-100)
  atsPresentationScore: number; // ATS Resume Score (0-100)
  academicTrajectory: AcademicSemesterData[];
  extractedSkills: string[];
  weakAreas: string[];
  integrityLevel: string;
  academicAverageGpa: number;
  growthMomentum: 'Upward Trajectory (+Growth)' | 'High Distinction (Steady)' | 'Baseline Calibration';
  evaluatedDataPoints: number;
  qt2Evaluation?: QT2ModelEvaluation;
  contradictions?: any[];
  authoritativeFacts?: Record<string, any>;
}

/**
 * Classifies document category automatically from file name and optional text snippet.
 */
export function classifyDocumentCategory(fileName: string, textSnippet: string = ''): VaultCategory {
  const raw = (fileName + ' ' + textSnippet).toLowerCase();
  const lower = raw.replace(/[-_./\\]+/g, ' ');

  // 1. Resume / CV (Highest precedence for primary candidate profile)
  if (lower.includes('resume') || lower.includes('curriculum vitae') || lower.includes('biodata') || (raw.includes('cv') && !lower.includes('puc') && !lower.includes('icse'))) {
    return 'resume';
  }

  // 2. Achievements & Contests (Hackathons, research papers, awards)
  if (lower.includes('hackathon') || lower.includes('winner') || lower.includes('award') || lower.includes('publication') || lower.includes('olympiad') || lower.includes('contest') || lower.includes('trophy') || lower.includes('achievement')) {
    return 'achievement';
  }

  // 3. Technical & Professional Certifications
  if (lower.includes('aws') || lower.includes('azure') || lower.includes('gcp') || lower.includes('coursera') || lower.includes('nptel') || lower.includes('udemy') || lower.includes('oracle') || lower.includes('cisco') || lower.includes('certified') || lower.includes('certificate of completion')) {
    return 'certification';
  }

  // 4. Internships & Experience Letters
  if (lower.includes('intern') || lower.includes('offer letter') || lower.includes('relieving letter') || lower.includes('lor') || lower.includes('letter of recommendation')) {
    return 'internship';
  }

  // 5. Semesters 1 through 8 (Strict university semester checks)
  for (let s = 1; s <= 8; s++) {
    if (
      lower.includes(`sem ${s}`) ||
      lower.includes(`semester ${s}`) ||
      lower.includes(`${s}th sem`) ||
      lower.includes(`${s}st sem`) ||
      lower.includes(`${s}nd sem`) ||
      lower.includes(`${s}rd sem`) ||
      lower.includes(`${s} sem`) ||
      raw.includes(`sem${s}`) ||
      raw.includes(`semester${s}`) ||
      lower.includes(`sgpa ${s}`) ||
      lower.includes(`term ${s}`)
    ) {
      return `sem${s}` as VaultCategory;
    }
  }

  // 6. 10th / Secondary School
  if (lower.includes('10th') || lower.includes('sslc') || lower.includes('matric') || lower.includes('secondary school') || lower.includes('class 10') || lower.includes('std 10') || lower.includes('tenth') || lower.includes('class x')) {
    return '10th';
  }

  // 7. 12th / 2nd PUC / Polytechnic Diploma
  if (lower.includes('12th') || lower.includes('puc') || lower.includes('2nd puc') || lower.includes('diploma') || lower.includes('higher secondary') || lower.includes('class 12') || lower.includes('std 12') || lower.includes('twelfth') || lower.includes('intermediate') || lower.includes('class xii')) {
    return '12th_puc';
  }

  if (lower.includes('certificate') || lower.includes('cert')) return 'certification';

  return 'other';
}

/**
 * Compares candidate names to check for identity similarity and detect friend/fake uploads.
 * Enforces given name and surname verification to prevent friend/sibling fraudulent bypass.
 */

/**
 * Verifies if a vault document contains genuine extracted text and grounded provenance.
 * Empty or unreadable files return false and are never awarded trust or capability points.
 */
export function isContentBearingDocument(doc: VaultDocumentSlot): boolean {
  if (!doc) return false;
  if (doc.verificationStatus === ('unreadable' as any)) return false;

  const hasProvenance = Array.isArray(doc.provenanceRecords) && doc.provenanceRecords.length > 0;
  const hasSkills = Array.isArray(doc.skills) && doc.skills.length > 0;
  const hasRealName = !!doc.candidateName && doc.candidateName.toLowerCase() !== 'candidate' && doc.candidateName.trim().length > 1;
  const hasValidScore = !!doc.scoreOrGpa &&
    !doc.scoreOrGpa.includes('Credential') &&
    !doc.scoreOrGpa.includes('Marksheet') &&
    !doc.scoreOrGpa.includes('Certificate');

  return hasProvenance || hasSkills || (hasRealName && hasValidScore);
}

export function checkNameSimilarity(nameA: string, nameB: string): { isMatch: boolean; confidence: number; reason?: string } {
  if (!nameA || !nameB) {
    return { isMatch: false, confidence: 0, reason: 'Candidate identity name is missing.' };
  }

  const clean = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const a = clean(nameA);
  const b = clean(nameB);

  // Reject generic placeholder "Candidate"
  if (a === 'candidate' || b === 'candidate' || a.length < 2 || b.length < 2) {
    return {
      isMatch: false,
      confidence: 0,
      reason: 'Identity cannot be verified against generic placeholder "Candidate".'
    };
  }

  if (a === b) {
    return { isMatch: true, confidence: 100 };
  }

  const tokensA = a.split(/\s+/).filter(t => t.length > 0);
  const tokensB = b.split(/\s+/).filter(t => t.length > 0);

  if (tokensA.length === 0 || tokensB.length === 0) {
    return { isMatch: false, confidence: 0, reason: 'Empty name tokens after normalization.' };
  }

  const isInitialMatch = (t1: string, t2: string) =>
    (t1.length === 1 && t2.startsWith(t1)) || (t2.length === 1 && t1.startsWith(t2));

  // Given name (first token) and Surname (last token)
  const givenA = tokensA[0];
  const givenB = tokensB[0];
  const surnameA = tokensA.length > 1 ? tokensA[tokensA.length - 1] : '';
  const surnameB = tokensB.length > 1 ? tokensB[tokensB.length - 1] : '';

  // Critical Anti-Fraud check:
  // If both names have surnames and the surnames match, but the given names are completely different
  // and neither is an initial (e.g. "Rohan Sharma" vs "Priya Sharma"), this is a different individual!
  if (surnameA && surnameB && surnameA === surnameB) {
    const givenMatches = givenA === givenB || isInitialMatch(givenA, givenB);
    if (!givenMatches) {
      return {
        isMatch: false,
        confidence: 50,
        reason: `Document belongs to a different individual with the same surname ("${nameB}" vs "${nameA}") and requires verification review.`
      };
    }
  }

  // Token matching with initial support
  const common = tokensA.filter(ta =>
    tokensB.some(tb => tb === ta || isInitialMatch(ta, tb))
  );
  const matchRatio = common.length / Math.min(tokensA.length, tokensB.length);

  // Ensure given names are compatible
  const givenCompatible =
    givenA === givenB ||
    isInitialMatch(givenA, givenB) ||
    tokensB.includes(givenA) ||
    tokensA.includes(givenB);

  if (matchRatio >= 0.6 && givenCompatible) {
    return { isMatch: true, confidence: Math.round(matchRatio * 100) };
  }

  return {
    isMatch: false,
    confidence: Math.round(matchRatio * 100),
    reason: `Document name "${nameB}" does not match primary profile identity "${nameA}" and requires verification review.`
  };
}

/**
 * Cross-audits all documents in the collection against candidate identity to detect fraud / friend uploads.
 */
export function auditDocumentCollection(
  primaryCandidateName: string,
  documents: VaultDocumentSlot[]
): IdentityAuditReport {
  console.log(`\n🛡️ [STAGE 10/12 - Identity Sentinel]: Cross-auditing ${documents?.length || 0} vault documents against primary identity "${primaryCandidateName}"...`);

  if (!documents || documents.length === 0) {
    return {
      primaryName: primaryCandidateName && primaryCandidateName.toLowerCase() !== 'candidate' ? primaryCandidateName : 'Awaiting Profile',
      totalDocuments: 0,
      verifiedCount: 0,
      mismatchCount: 0,
      overallStatus: 'AWAITING_UPLOADS',
      trustScore: 0, // Zero documents = 0 trust. Never 100!
      conflictingDocuments: [],
      identityConsistencyPercentage: 0
    };
  }

  const readableDocs = documents.filter(isContentBearingDocument);

  // If all submitted files are empty or unreadable, refuse to award trust
  if (readableDocs.length === 0) {
    return {
      primaryName: primaryCandidateName && primaryCandidateName.toLowerCase() !== 'candidate' ? primaryCandidateName : 'Unknown',
      totalDocuments: documents.length,
      verifiedCount: 0,
      mismatchCount: 0,
      overallStatus: 'UNREADABLE_DOCUMENTS_REJECTED',
      trustScore: 0, // Unreadable files = 0 trust. Never 84 or 100!
      conflictingDocuments: [],
      identityConsistencyPercentage: 0
    };
  }

  let verifiedCount = 0;
  let mismatchCount = 0;
  const conflictingDocuments: IdentityAuditReport['conflictingDocuments'] = [];

  // Establish authoritative anchor name from readable documents or profile
  const resumeDoc = readableDocs.find(d => d.category === 'resume' && d.candidateName && d.candidateName.toLowerCase() !== 'candidate');
  const anchorName = resumeDoc?.candidateName ||
    (primaryCandidateName && primaryCandidateName.toLowerCase() !== 'candidate'
      ? primaryCandidateName
      : readableDocs.find(d => d.candidateName && d.candidateName.toLowerCase() !== 'candidate')?.candidateName || 'Candidate');

  // Single document baseline:
  if (documents.length === 1) {
    const singleDoc = documents[0];
    const isReadable = isContentBearingDocument(singleDoc);
    const resolvedName = singleDoc.candidateName && singleDoc.candidateName.toLowerCase() !== 'candidate'
      ? singleDoc.candidateName
      : anchorName;
    return {
      primaryName: resolvedName,
      totalDocuments: 1,
      verifiedCount: isReadable ? 1 : 0,
      mismatchCount: 0,
      overallStatus: isReadable ? 'PROVISIONAL_PENDING' : 'UNREADABLE_DOCUMENTS_REJECTED',
      trustScore: isReadable ? 40 : 0, // Single document gets baseline 40, NOT 100!
      conflictingDocuments: [],
      identityConsistencyPercentage: isReadable ? 100 : 0
    };
  }

  // Cross-audit all documents against anchor name
  documents.forEach(doc => {
    if (!isContentBearingDocument(doc)) {
      return; // Unreadable file does not count as verified
    }

    if (doc.candidateName && doc.candidateName.toLowerCase() !== 'candidate') {
      const check = checkNameSimilarity(anchorName, doc.candidateName);
      if (!check.isMatch) {
        mismatchCount++;
        conflictingDocuments.push({
          slotId: doc.id,
          fileName: doc.fileName,
          detectedName: doc.candidateName,
          expectedName: anchorName,
          reason: check.reason || `Identity on document "${doc.fileName}" differs from profile and requires verification review.`
        });
        console.warn(`🚨 [STAGE 10/12 - Identity Mismatch]: Document "${doc.fileName}" has detected name "${doc.candidateName}" which conflicts with "${anchorName}".`);
      } else {
        verifiedCount++;
      }
    } else {
      verifiedCount++;
    }
  });

  const identityConsistencyPercentage = documents.length > 0
    ? Math.round((verifiedCount / documents.length) * 100)
    : 0;

  // Trust score reflects readability and identity consistency
  const readabilityFactor = readableDocs.length / documents.length;
  const consistencyFactor = verifiedCount / Math.max(1, readableDocs.length);
  const baseTrust = Math.round((readabilityFactor * 0.4 + consistencyFactor * 0.6) * 100);
  const trustScore = Math.max(0, Math.min(100, baseTrust - (mismatchCount * 30)));

  let overallStatus: IdentityAuditReport['overallStatus'] = 'SENTINEL_CLEAN';
  if (mismatchCount > 0) {
    overallStatus = 'REVIEW_REQUIRED';
  } else if (readableDocs.length < 2) {
    overallStatus = 'PROVISIONAL_PENDING';
  }

  console.log(`✅ [STAGE 10/12 - Identity Status]: ${overallStatus} (Consistency: ${identityConsistencyPercentage}%, Trust: ${trustScore}/100)`);

  return {
    primaryName: anchorName,
    totalDocuments: documents.length,
    verifiedCount,
    mismatchCount,
    overallStatus,
    trustScore,
    conflictingDocuments,
    identityConsistencyPercentage
  };
}

/**
 * Calculates Decoupled QT1 (Capability), Evidence Trust, and ATS scores.
 * MANDATORY RULE: Document upload provides evidence baseline only; QT1 starts at 0 until practical assessments/tasks are completed!
 */
export function calculateLiveQTMetrics(
  documents: VaultDocumentSlot[] = [],
  auditReport: IdentityAuditReport = { primaryName: 'Candidate', totalDocuments: 0, verifiedCount: 0, mismatchCount: 0, overallStatus: 'AWAITING_UPLOADS', trustScore: 0, conflictingDocuments: [], identityConsistencyPercentage: 0 },
  demonstratedCompetencyCount: number = 0,
  demonstratedProjectCount: number = 0,
  assessmentAveragePct: number = 0,
  simulationScores?: Record<string, number>,
  identityScores?: Record<string, number>,
  voiceArchetype?: string | null
): LiveQTCalibration {
  console.log(`\n🎯 [STAGE 11/12 - Career Intelligence Calibration]: Calculating decoupled 4-pillar metrics...`);
  if (!documents || documents.length === 0) {
    const baselineEval = evaluateQT2Model([], auditReport, simulationScores, identityScores, voiceArchetype);
    return {
      qt1Score: 0,
      qt2Score: baselineEval.compositeScore,
      evidenceTrustScore: 0,
      atsPresentationScore: 0,
      academicTrajectory: [],
      extractedSkills: [],
      weakAreas: [],
      integrityLevel: '🛡️ Sentinel Active (Awaiting Uploads)',
      academicAverageGpa: 0,
      growthMomentum: 'Baseline Calibration',
      evaluatedDataPoints: baselineEval.evaluatedDataPoints,
      qt2Evaluation: baselineEval
    };
  }

  const readableDocs = documents.filter(isContentBearingDocument);

  // If all uploaded files are empty or unreadable, award zero trust, zero ATS, and zero QT2
  if (readableDocs.length === 0) {
    const baselineEval = evaluateQT2Model([], auditReport, simulationScores, identityScores, voiceArchetype);
    return {
      qt1Score: 0,
      qt2Score: 0,
      evidenceTrustScore: 0,
      atsPresentationScore: 0,
      academicTrajectory: [],
      extractedSkills: [],
      weakAreas: [],
      integrityLevel: '⚠️ Unreadable Files (No Valid Evidence Grounded)',
      academicAverageGpa: 0,
      growthMomentum: 'Baseline Calibration',
      evaluatedDataPoints: 0,
      qt2Evaluation: baselineEval
    };
  }

  const allSkills = new Set<string>();
  const semesterDataMap = new Map<number, { gpa: number; institution?: string; verified: boolean }>();
  const masterResume: VaultDocumentSlot | undefined = readableDocs.find(d => d.category === 'resume');

  readableDocs.forEach(doc => {
    (doc.skills || []).forEach(s => allSkills.add(s));

    if (doc.category.startsWith('sem')) {
      const semNum = parseInt(doc.category.replace('sem', ''), 10);
      if (semNum >= 1 && semNum <= 8) {
        const match = doc.scoreOrGpa?.match(/(\d+\.\d+)/);
        const gpa = match ? parseFloat(match[1]) : 0;
        if (gpa > 0) {
          semesterDataMap.set(semNum, {
            gpa,
            institution: doc.institution,
            verified: doc.verificationStatus === 'verified'
          });
        }
      }
    }
  });

  // 1. Calculate Academic Trajectory Curve
  const academicTrajectory: AcademicSemesterData[] = [];
  for (let s = 1; s <= 8; s++) {
    if (semesterDataMap.has(s)) {
      const data = semesterDataMap.get(s)!;
      academicTrajectory.push({
        semester: s,
        gpa: data.gpa,
        institution: data.institution,
        verified: data.verified
      });
    }
  }

  let growthMomentum: LiveQTCalibration['growthMomentum'] = 'Baseline Calibration';
  let averageGpa = 0;
  if (academicTrajectory.length >= 1) {
    const sumGpa = academicTrajectory.reduce((acc, curr) => acc + curr.gpa, 0);
    averageGpa = parseFloat((sumGpa / academicTrajectory.length).toFixed(2));
    if (academicTrajectory.length >= 2) {
      const firstGpa = academicTrajectory[0].gpa;
      const lastGpa = academicTrajectory[academicTrajectory.length - 1].gpa;
      if (lastGpa > firstGpa + 0.3) {
        growthMomentum = 'Upward Trajectory (+Growth)';
      } else if (averageGpa >= 8.8) {
        growthMomentum = 'High Distinction (Steady)';
      }
    }
  }

  // 2. Pure QT1 Capability Formulation:
  const competencyPoints = Math.min(55, demonstratedCompetencyCount * 8.0);
  const projectPoints = Math.min(25, demonstratedProjectCount * 12.5);
  const assessmentPoints = Math.min(20, Math.round((assessmentAveragePct / 100) * 20));
  const qt1Score = competencyPoints + projectPoints + assessmentPoints;

  // 3. Evidence Trust Index (0–100)
  // Scored strictly on verified grounded provenance and multi-document consistency
  const totalProvenanceRecords = readableDocs.reduce((acc, d) => acc + (d.provenanceRecords?.length || 0), 0);
  const provenanceComponent = Math.min(30, Math.round(totalProvenanceRecords * 2.5));

  const identityComponent = auditReport.mismatchCount === 0
    ? (readableDocs.length >= 2 ? 25 : 12)
    : Math.max(0, 25 - auditReport.mismatchCount * 12);

  const integrityComponent = readableDocs.length >= 2 && auditReport.mismatchCount === 0 ? 20 : (readableDocs.length === 1 ? 10 : 0);
  const crossRecordComponent = academicTrajectory.length >= 2 ? 15 : (academicTrajectory.length === 1 ? 10 : 0);
  const longitudinalComponent = growthMomentum !== 'Baseline Calibration' ? 10 : 0;

  const evidenceTrustScore = Math.min(100, identityComponent + integrityComponent + provenanceComponent + crossRecordComponent + longitudinalComponent);

  // 3b. Evaluate Cross-Document Contradictions & Apply Authoritative Precedence
  const allProvenanceRecords: GroundedProvenanceRecord[] = [];
  readableDocs.forEach(d => {
    if (Array.isArray(d.provenanceRecords) && d.provenanceRecords.length > 0) {
      allProvenanceRecords.push(...d.provenanceRecords);
    }
  });

  const contradictionResult = evaluateDocumentContradictions(allProvenanceRecords);
  let adjustedTrustScore = evidenceTrustScore;
  if (contradictionResult.hasConflicts) {
    adjustedTrustScore = Math.max(0, adjustedTrustScore - (contradictionResult.contradictions.length * 15));
  }

  // 4. ATS Presentation Score (0-100)
  // Only scored if master resume has actual extracted content / provenance
  const atsPresentationScore = masterResume && (masterResume.provenanceRecords?.length || 0) > 0
    ? (masterResume.atsScore || 70)
    : 0;

  let integrityLevel = '🛡️ Sentinel Clean (100% Consistent)';
  if (auditReport.mismatchCount > 0) {
    integrityLevel = `⚠️ Identity Review Required (${auditReport.mismatchCount} Conflicting Document${auditReport.mismatchCount > 1 ? 's' : ''})`;
  } else if (contradictionResult.hasConflicts) {
    integrityLevel = `⚠️ Fact Contradiction Detected (${contradictionResult.contradictions.length} Conflict${contradictionResult.contradictions.length > 1 ? 's' : ''} Overruled by Verified Proofs)`;
  } else if (readableDocs.length < 2) {
    integrityLevel = '📄 Self-Attested Baseline (Upload Academic Proofs to Elevate Trust)';
  }

  const weakAreas = ['System Architecture', 'Production Deployments', 'Unit Testing Rigor'].filter(
    w => !Array.from(allSkills).some(s => s.toLowerCase().includes(w.toLowerCase().split(' ')[0]))
  );

  // 5. Dynamic QT2 Evaluation
  const qt2Eval = evaluateQT2Model(readableDocs, auditReport, simulationScores, identityScores, voiceArchetype);
  const qt2Score = qt2Eval.compositeScore;
  const evaluatedDataPoints = qt2Eval.evaluatedDataPoints;

  return {
    qt1Score,
    qt2Score,
    evidenceTrustScore: adjustedTrustScore,
    atsPresentationScore,
    academicTrajectory,
    extractedSkills: Array.from(allSkills),
    weakAreas,
    integrityLevel,
    academicAverageGpa: averageGpa,
    growthMomentum,
    evaluatedDataPoints,
    qt2Evaluation: qt2Eval,
    contradictions: contradictionResult.contradictions,
    authoritativeFacts: Object.fromEntries(contradictionResult.authoritativeFacts)
  };
}

/**
 * Extracts candidate name from file name or raw text.
 */
export function extractCandidateName(fileName: string, rawText: string = '', defaultName: string = 'Candidate'): string {
  if (rawText && rawText.length > 10) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 2 && l.length < 50);
    for (const line of lines.slice(0, 5)) {
      if (!line.toLowerCase().includes('resume') && !line.toLowerCase().includes('curriculum') && !line.includes('@') && !line.includes('http')) {
        const clean = line.replace(/[^a-zA-Z\s]/g, '').trim();
        if (clean.split(/\s+/).length >= 2) {
          return clean;
        }
      }
    }
  }
  const fileClean = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
  if (fileClean.length > 2 && !fileClean.toLowerCase().includes('resume') && !fileClean.toLowerCase().includes('marksheet')) {
    return fileClean;
  }
  return defaultName;
}

/**
 * Extracts institution name from file name or raw text.
 */
export function extractInstitution(fileName: string, rawText: string = ''): string | undefined {
  const combined = (fileName + ' ' + rawText).toLowerCase();
  const institutions = [
    'VTU', 'Visvesvaraya Technological University', 'Anna University', 'Mumbai University',
    'Delhi University', 'IIT', 'NIT', 'BITS Pilani', 'PES University', 'RV College of Engineering',
    'BMS College of Engineering', 'MS Ramaiah Institute of Technology', 'Christ University',
    'Jain University', 'Manipal University', 'SRM University', 'VIT Vellore'
  ];
  for (const inst of institutions) {
    if (combined.includes(inst.toLowerCase())) {
      return inst;
    }
  }
  return undefined;
}

/**
 * Extracts score or GPA from file name or raw text.
 */
export function extractScoreOrGpa(category: VaultCategory, fileName: string, rawText: string = ''): string | undefined {
  const combined = (fileName + ' ' + rawText);
  const gpaMatch = combined.match(/(?:cgpa|gpa|sgpa|score)\s*[:=-]?\s*(\d{1,2}(?:\.\d{1,2})?)(?:\s*\/\s*10)?/i);
  if (gpaMatch) return gpaMatch[1];

  const pctMatch = combined.match(/(\d{2}(?:\.\d{1,2})?)\s*%/);
  if (pctMatch) return `${pctMatch[1]}%`;

  if (category.startsWith('sem')) {
    const numMatch = combined.match(/(\d\.\d{1,2})/);
    if (numMatch) return numMatch[1];
  }
  return undefined;
}

/**
 * Extracts verified technical and analytical skills from document text.
 */
export function extractDocumentSkills(category: VaultCategory, fileName: string, rawText: string = ''): string[] {
  const skills = new Set<string>();
  const combined = `${fileName}\n${rawText}`;
  const skillKeywords = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git',
    'Machine Learning', 'Data Analysis', 'Algorithms', 'Data Structures',
    'Financial Accounting', 'Taxation', 'Corporate Finance', 'Excel',
    'Business Communication', 'Project Management', 'UI/UX Design', 'Figma'
  ];

  for (const k of skillKeywords) {
    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let pattern = `\\b${escaped}\\b`;
    if (k.toLowerCase() === 'java') {
      pattern = `\\bjava\\b(?!script)`;
    } else if (k.toLowerCase() === 'excel') {
      pattern = `\\bexcel\\b(?!lent|lence)`;
    } else if (k.toLowerCase() === 'git') {
      pattern = `\\bgit\\b(?!hub|lab)`;
    } else if (k.toLowerCase() === 'sql') {
      pattern = `(?<!my|postgre|p)\\bsql\\b`;
    }

    const regex = new RegExp(pattern, 'i');
    if (regex.test(combined)) {
      skills.add(k);
    }
  }
  return Array.from(skills);
}
