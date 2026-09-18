// scripts/verify_subbatch_4_8.ts
/**
 * Verification Script for Subbatch 4.8 / Issue 31:
 * "Deterministic fact grounding with location provenance"
 * 
 * Verifies:
 * 1. Marksheet header "VISVESVARAYA TECHNOLOGICAL UNIVERSITY" is never extracted as candidate name.
 * 2. Explicit student name ("Student Name: Rahul Sharma") correctly extracted.
 * 3. Activity lines ("Member of coding club since December 2023", "Bengaluru") are never extracted as degree.
 * 4. Legitimate degrees ("Bachelor of Engineering in Computer Science") are correctly extracted.
 * 5. Skills and projects provenance records have accurate non-zero sourceCharacterRange matching rawText offsets.
 * 6. Confidence scores are dynamically calculated rather than hardcoded static constants.
 * 7. Precedence routing: Marksheet (STRUCTURALLY_VALIDATED) wins over Resume (SELF_SUBMITTED) in contradiction engine.
 * 8. Corroboration: Identical facts across distinct documents elevate to CROSS_VALIDATED.
 */

import { groundAndValidateEvidence } from '../src/lib/ats/factCheckValidator';
import { evaluateDocumentContradictions } from '../src/lib/ats/contradictionEngine';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  }
}

console.log('=== VERIFYING SUBBATCH 4.8 (ISSUE 31): DETERMINISTIC FACT GROUNDING & PROVENANCE ===\n');

// --- TEST 1: University Header is NOT extracted as Candidate Name ---
const vtuMarksheetText = `
VISVESVARAYA TECHNOLOGICAL UNIVERSITY
BELAGAVI, KARNATAKA, INDIA
GRADE CARD / MARKS CARD
B.E. DEGREE EXAMINATIONS

Student Name: Rahul Sharma
USN: 1VT20CS042
Semester: 6th Semester

Sub Code | Subject Name | Credits | Grade | Grade Points
18CS61   | System Software | 4     | A     | 8
18CS62   | Computer Networks | 4   | S     | 9

SGPA: 8.50
CGPA: 8.25
`;

const marksheetGraph = groundAndValidateEvidence(
  vtuMarksheetText,
  'marksheet_sem6.pdf',
  'hash_marksheet_123',
  'NATIVE_PDF',
  0.92,
  'sem6'
);

assert(
  marksheetGraph.candidateName === 'Rahul Sharma',
  'Marksheet with VTU header extracts explicit student name ("Rahul Sharma")',
  `Got "${marksheetGraph.candidateName}"`
);

assert(
  !marksheetGraph.candidateName.toLowerCase().includes('visvesvaraya') &&
  !marksheetGraph.candidateName.toLowerCase().includes('technological') &&
  !marksheetGraph.candidateName.toLowerCase().includes('university'),
  'Marksheet never extracts VTU header as student name'
);

// --- TEST 2: Marksheet with VTU header and NO student name falls back to Candidate, never VTU ---
const vtuAnonymousText = `
VISVESVARAYA TECHNOLOGICAL UNIVERSITY
BELAGAVI, KARNATAKA
PROVISIONAL MARKS CARD
SGPA: 7.80
CGPA: 7.60
`;

const anonymousGraph = groundAndValidateEvidence(
  vtuAnonymousText,
  'marksheet_anonymous.pdf',
  'hash_anon_123',
  'NATIVE_PDF',
  0.90,
  'sem8'
);

assert(
  anonymousGraph.candidateName === 'Candidate',
  'Marksheet with VTU header and no name returns "Candidate"',
  `Got "${anonymousGraph.candidateName}"`
);

// --- TEST 3: Unbounded "be" / "December" / "Bengaluru" is NOT extracted as degree ---
const resumeWithActivityNoise = `
Rohan Mehta
rohan.mehta@example.com
+91 9876543210

Member of coding club since December 2023
Software Developer Intern in Bengaluru, December 2023

EDUCATION
Visvesvaraya Technological University
Bachelor of Engineering in Computer Science and Engineering
CGPA: 8.40
Graduation: MAY 2024

SKILLS
TypeScript, React, Node.js, Python, PostgreSQL

PROJECTS
1. Cloud Sentinel Platform
Built a real-time event streaming pipeline using TypeScript and Node.js
`;

const resumeGraph = groundAndValidateEvidence(
  resumeWithActivityNoise,
  'resume_rohan.pdf',
  'hash_resume_456',
  'NATIVE_PDF',
  0.95,
  'resume'
);

assert(
  resumeGraph.degree !== undefined && !resumeGraph.degree.includes('Member of coding club'),
  'Club membership ("Member of coding club since December 2023") is NOT degree',
  `Got "${resumeGraph.degree}"`
);

assert(
  resumeGraph.degree !== undefined && !resumeGraph.degree.includes('Bengaluru'),
  'City/Job line ("Software Developer Intern in Bengaluru") is NOT degree',
  `Got "${resumeGraph.degree}"`
);

assert(
  resumeGraph.degree !== undefined && resumeGraph.degree.toLowerCase().includes('bachelor of engineering'),
  'Legitimate degree ("Bachelor of Engineering in Computer Science and Engineering") is correctly extracted',
  `Got "${resumeGraph.degree}"`
);

// --- TEST 4: Real character provenance ranges (not [0,0]) ---
const skillsRecords = resumeGraph.provenanceRecords.filter(r => r.field === 'Skill');
const projectRecords = resumeGraph.provenanceRecords.filter(r => r.field === 'Project');

assert(skillsRecords.length > 0, 'Extracted grounded skills from resume');
const allSkillsHaveValidRange = skillsRecords.every(r => {
  const [start, end] = r.sourceCharacterRange;
  const snippetInText = resumeWithActivityNoise.slice(start, end).toLowerCase();
  return start >= 0 && end > start && snippetInText === r.sourceTextSnippet.toLowerCase();
});
assert(
  allSkillsHaveValidRange,
  'Skills provenance records have accurate non-zero sourceCharacterRange matching rawText offsets'
);

assert(projectRecords.length > 0, 'Extracted grounded projects from resume');
const projectHasValidRange = projectRecords.every(r => {
  const [start, end] = r.sourceCharacterRange;
  return start >= 0 && end > start && resumeWithActivityNoise.slice(start, end).includes('Cloud Sentinel');
});
assert(
  projectHasValidRange,
  'Project provenance records have accurate non-zero sourceCharacterRange matching rawText offsets'
);

// --- TEST 5: Computed confidence values (not hardcoded 0.98 constants) ---
const graphWithLowerExtraction = groundAndValidateEvidence(
  resumeWithActivityNoise,
  'ocr_resume.pdf',
  'hash_ocr_789',
  'OCR_VISION',
  0.70,
  'resume'
);

const nameRecord = graphWithLowerExtraction.provenanceRecords.find(r => r.field === 'CandidateName');
assert(
  nameRecord !== undefined && nameRecord.confidence < 0.80,
  `Confidence is dynamically scaled by extractionConfidence (got ${nameRecord?.confidence}, expected < 0.80)`
);

// --- TEST 6: Category assignment elevates Marksheet to STRUCTURALLY_VALIDATED ---
const gpaMarksheetRecord = marksheetGraph.provenanceRecords.find(r => r.field === 'GPA');
assert(
  gpaMarksheetRecord !== undefined && gpaMarksheetRecord.verificationLevel === 'STRUCTURALLY_VALIDATED',
  'Marksheet GPA is assigned STRUCTURALLY_VALIDATED level'
);

// --- TEST 7: Precedence Hierarchy in Contradiction Engine ---
// Marksheet: CGPA 8.25 (STRUCTURALLY_VALIDATED)
// Resume: GPA 9.50 (SELF_SUBMITTED)
const resumeConflictingGpa = `
Rahul Sharma
rahul.sharma@example.com
EDUCATION
B.E. Computer Science
CGPA: 9.50
`;
const conflictingResumeGraph = groundAndValidateEvidence(
  resumeConflictingGpa,
  'inflated_resume.pdf',
  'hash_conflicting_resume',
  'NATIVE_PDF',
  0.95,
  'resume'
);

const combinedRecords = [
  ...marksheetGraph.provenanceRecords,
  ...conflictingResumeGraph.provenanceRecords
];

const contradictionResult = evaluateDocumentContradictions(combinedRecords);

assert(
  contradictionResult.hasConflicts,
  'Contradiction Engine detects conflicting GPA between Marksheet (8.25) and Resume (9.50)'
);

const authoritativeGpa = contradictionResult.authoritativeFacts.get('GPA');
assert(
  authoritativeGpa === '8.25 GPA',
  'Authoritative precedence selects Marksheet STRUCTURALLY_VALIDATED GPA (8.25) over Resume (9.50)',
  `Got authoritative GPA "${authoritativeGpa}"`
);

const resumeGpaRecord = conflictingResumeGraph.provenanceRecords.find(r => r.field === 'GPA');
assert(
  resumeGpaRecord?.status === 'CONFLICTING_EVIDENCE',
  'Subordinate conflicting GPA record marked as CONFLICTING_EVIDENCE'
);

// --- TEST 8: Corroboration elevates identical facts across distinct documents to CROSS_VALIDATED ---
const docA = `
Rahul Sharma
rahul.sharma@example.com
SKILLS
TypeScript
`;
const docB = `
Rahul Sharma
rahul.sharma@example.com
SKILLS
TypeScript
`;

const graphA = groundAndValidateEvidence(docA, 'doc_a.pdf', 'hash_a', 'NATIVE_PDF', 0.95, 'resume');
const graphB = groundAndValidateEvidence(docB, 'doc_b.pdf', 'hash_b', 'NATIVE_PDF', 0.95, 'portfolio');

const multiDocRecords = [
  ...graphA.provenanceRecords.filter(r => r.field === 'Skill'),
  ...graphB.provenanceRecords.filter(r => r.field === 'Skill')
];

evaluateDocumentContradictions(multiDocRecords);

const tsRecords = multiDocRecords.filter(r => r.value === 'TypeScript');
assert(
  tsRecords.length === 2 && tsRecords.every(r => r.verificationLevel === 'CROSS_VALIDATED'),
  'Identical facts in distinct documents are elevated to CROSS_VALIDATED'
);

console.log(`\nSubbatch 4.8 Verification Summary: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL SUBBATCH 4.8 PROBES & TESTS PASSED SUCCESFULLY!\n');
}
