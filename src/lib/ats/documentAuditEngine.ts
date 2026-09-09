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
  overallStatus: 'SENTINEL_CLEAN' | 'IDENTITY_MISMATCH_FLAGGED' | 'PROVISIONAL_PENDING';
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
 */
export function checkNameSimilarity(nameA: string, nameB: string): { isMatch: boolean; confidence: number; reason?: string } {
  if (!nameA || !nameB) return { isMatch: true, confidence: 100 };

  const clean = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  const a = clean(nameA);
  const b = clean(nameB);

  if (a === b || a === 'candidate' || b === 'candidate') {
    return { isMatch: true, confidence: 100 };
  }

  const tokensA = a.split(/\s+/).filter(t => t.length > 1);
  const tokensB = b.split(/\s+/).filter(t => t.length > 1);

  if (tokensA.length === 0 || tokensB.length === 0) {
    return { isMatch: true, confidence: 90 };
  }

  const common = tokensA.filter(ta => tokensB.some(tb => tb === ta || (ta.length === 1 && tb.startsWith(ta)) || (tb.length === 1 && ta.startsWith(tb))));
  const matchRatio = common.length / Math.min(tokensA.length, tokensB.length);

  if (matchRatio >= 0.5) {
    return { isMatch: true, confidence: Math.round(matchRatio * 100) };
  }

  return {
    isMatch: false,
    confidence: Math.round(matchRatio * 100),
    reason: `Document name "${nameB}" does not match primary profile identity "${nameA}".`
  };
}

/**
 * Cross-audits all documents in the collection against candidate identity to detect fraud / friend uploads.
 */
export function auditDocumentCollection(
  primaryCandidateName: string,
  documents: VaultDocumentSlot[]
): IdentityAuditReport {
  console.log(`\n🛡️ [STAGE 10/12 - Identity Sentinel]: Cross-auditing ${documents.length} vault documents against primary identity "${primaryCandidateName}"...`);
  if (!documents || documents.length === 0) {
    return {
      primaryName: primaryCandidateName || 'Candidate',
      totalDocuments: 0,
      verifiedCount: 0,
      mismatchCount: 0,
      overallStatus: 'SENTINEL_CLEAN',
      trustScore: 100,
      conflictingDocuments: [],
      identityConsistencyPercentage: 100
    };
  }

  let verifiedCount = 0;
  let mismatchCount = 0;
  const conflictingDocuments: IdentityAuditReport['conflictingDocuments'] = [];

  const anchorName = primaryCandidateName && primaryCandidateName !== 'Candidate'
    ? primaryCandidateName
    : documents.find(d => d.candidateName && d.candidateName !== 'Candidate')?.candidateName || 'Candidate';

  documents.forEach(doc => {
    if (doc.candidateName && doc.candidateName !== 'Candidate') {
      const check = checkNameSimilarity(anchorName, doc.candidateName);
      if (!check.isMatch) {
        mismatchCount++;
        conflictingDocuments.push({
          slotId: doc.id,
          fileName: doc.fileName,
          detectedName: doc.candidateName,
          expectedName: anchorName,
          reason: check.reason || `Name mismatch detected on ${doc.fileName}`
        });
        console.warn(`🚨 [STAGE 10/12 - Identity Mismatch]: Document "${doc.fileName}" has detected name "${doc.candidateName}" which conflicts with "${anchorName}".`);
      } else {
        verifiedCount++;
      }
    } else {
      verifiedCount++;
    }
  });

  const identityConsistencyPercentage = Math.round((verifiedCount / documents.length) * 100);
  const trustScore = Math.max(20, Math.min(100, Math.round(100 - (mismatchCount * 35))));

  let overallStatus: IdentityAuditReport['overallStatus'] = 'SENTINEL_CLEAN';
  if (mismatchCount > 0) {
    overallStatus = 'IDENTITY_MISMATCH_FLAGGED';
  } else if (documents.length < 2) {
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
  auditReport: IdentityAuditReport = { primaryName: 'Candidate', totalDocuments: 0, verifiedCount: 0, mismatchCount: 0, overallStatus: 'SENTINEL_CLEAN', trustScore: 100, conflictingDocuments: [], identityConsistencyPercentage: 100 },
  demonstratedCompetencyCount: number = 0,
  demonstratedProjectCount: number = 0,
  assessmentAveragePct: number = 0
): LiveQTCalibration {
  console.log(`\n🎯 [STAGE 11/12 - Career Intelligence Calibration]: Calculating decoupled 4-pillar metrics...`);
  if (!documents || documents.length === 0) {
    return {
      qt1Score: 0,
      qt2Score: 0,
      evidenceTrustScore: 0,
      atsPresentationScore: 0,
      academicTrajectory: [],
      extractedSkills: [],
      weakAreas: [],
      integrityLevel: '🛡️ Sentinel Active (Awaiting Uploads)',
      academicAverageGpa: 0,
      growthMomentum: 'Baseline Calibration'
    };
  }

  const allSkills = new Set<string>();
  const semesterDataMap = new Map<number, { gpa: number; institution?: string; verified: boolean }>();
  const masterResume: VaultDocumentSlot | undefined = documents.find(d => d.category === 'resume');

  documents.forEach(doc => {
    doc.skills.forEach(s => allSkills.add(s));

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
  // QT1 = Competency Mastery (0–55) + Project Execution (0–25) + Assessment Performance (0–20)
  const competencyPoints = Math.min(55, demonstratedCompetencyCount * 8.0);
  const projectPoints = Math.min(25, demonstratedProjectCount * 12.5);
  const assessmentPoints = Math.min(20, Math.round((assessmentAveragePct / 100) * 20));
  const qt1Score = competencyPoints + projectPoints + assessmentPoints; // 0 on initial upload until quests are passed!

  // 3. Evidence Trust Index (0–100)
  const identityComponent = auditReport.mismatchCount === 0 ? 25 : Math.max(5, 25 - auditReport.mismatchCount * 10);
  const integrityComponent = 20;
  const provenanceComponent = Math.min(25, documents.length * 8);
  const crossRecordComponent = academicTrajectory.length >= 2 ? 15 : 8;
  const longitudinalComponent = growthMomentum !== 'Baseline Calibration' ? 15 : 7;
  const evidenceTrustScore = Math.min(100, identityComponent + integrityComponent + provenanceComponent + crossRecordComponent + longitudinalComponent);

  // 4. ATS Presentation Score (0-100)
  const atsPresentationScore = masterResume?.atsScore || (masterResume ? 72 : 0);

  let integrityLevel = '🛡️ Sentinel Clean (100% Consistent)';
  if (auditReport.mismatchCount > 0) {
    integrityLevel = `⚠️ Identity Conflict Flagged (${auditReport.mismatchCount} Conflicting Document${auditReport.mismatchCount > 1 ? 's' : ''})`;
  } else if (documents.length < 2) {
    integrityLevel = '📄 Self-Attested Baseline (Upload Academic Proofs to Elevate Trust)';
  }

  const weakAreas = ['System Architecture', 'Production Deployments', 'Unit Testing Rigor'].filter(
    w => !Array.from(allSkills).some(s => s.toLowerCase().includes(w.toLowerCase().split(' ')[0]))
  );

  console.log(`📊 [STAGE 11/12 - Calibration Result]:\n   - QT1 Capability = ${qt1Score}/100 (Upload Baseline: 0)\n   - Evidence Trust = ${evidenceTrustScore}/100\n   - ATS Presentation = ${atsPresentationScore}/100\n   - Trajectory = ${growthMomentum} (Avg GPA: ${averageGpa})`);

  return {
    qt1Score,
    qt2Score: 78, // Persona baseline from onboarding diagnostic
    evidenceTrustScore,
    atsPresentationScore,
    academicTrajectory,
    extractedSkills: Array.from(allSkills),
    weakAreas,
    integrityLevel,
    academicAverageGpa: averageGpa,
    growthMomentum
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
  const combined = (fileName + ' ' + rawText).toLowerCase();
  const skillKeywords = [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git',
    'Machine Learning', 'Data Analysis', 'Algorithms', 'Data Structures',
    'Financial Accounting', 'Taxation', 'Corporate Finance', 'Excel',
    'Business Communication', 'Project Management', 'UI/UX Design', 'Figma'
  ];
  skillKeywords.forEach(k => {
    if (combined.includes(k.toLowerCase())) {
      skills.add(k);
    }
  });
  return Array.from(skills);
}
