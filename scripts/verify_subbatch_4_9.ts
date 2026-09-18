// scripts/verify_subbatch_4_9.ts
/**
 * Verification Script for Subbatch 4.9 / Issue 32:
 * "Skills are matched as substrings, so ordinary English becomes a skill list"
 * 
 * Verifies:
 * 1. English sentence "Our next goal is to express ideas clearly. Each tree node stores a value. The sales pipeline grew."
 *    does NOT extract Next.js, Node.js, Express, or CI/CD.
 * 2. extractDocumentSkills does NOT match "git" in "digital", "excel" in "excellent", "java" in "javascript", or "sql" in "mysql".
 * 3. extractContacts & factCheckValidator detect Indian phone formats ("98765 43210", "+91 98765 43210", "9876543210").
 * 4. extractContacts does NOT pick email domains ("gmail.com", "yahoo.com") as portfolio links.
 * 5. Legitimate skills ("Next.js", "Node.js", "Express.js", "CI/CD Pipeline") are correctly extracted from technical sections.
 */

import { extractCanonicalSkillsWithPolarity } from '../src/lib/ats/skillOntology';
import { extractDocumentSkills } from '../src/lib/ats/documentAuditEngine';
import { extractContacts, auditResumeATS } from '../src/lib/ats/atsScreener';
import { groundAndValidateEvidence } from '../src/lib/ats/factCheckValidator';

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

console.log('=== VERIFYING SUBBATCH 4.9 (ISSUE 32): WORD-BOUNDARY SKILL MATCHING & CONTACT PARSING ===\n');

// --- PROBE 1: English prose sentence does NOT trigger technical skills ---
const proseProbe = "Our next goal is to express ideas clearly. Each tree node stores a value. The sales pipeline grew.";
const extractedFromProse = extractCanonicalSkillsWithPolarity(proseProbe, 'GENERAL_BODY');
const proseSkillNames = extractedFromProse.map(s => s.canonicalName);

assert(
  !proseSkillNames.includes('Next.js'),
  'Probe sentence: "next" does NOT extract as Next.js',
  `Extracted: [${proseSkillNames.join(', ')}]`
);
assert(
  !proseSkillNames.includes('Node.js'),
  'Probe sentence: "node" does NOT extract as Node.js',
  `Extracted: [${proseSkillNames.join(', ')}]`
);
assert(
  !proseSkillNames.includes('Express'),
  'Probe sentence: "express" does NOT extract as Express',
  `Extracted: [${proseSkillNames.join(', ')}]`
);
assert(
  !proseSkillNames.includes('CI/CD'),
  'Probe sentence: "pipeline" does NOT extract as CI/CD',
  `Extracted: [${proseSkillNames.join(', ')}]`
);
assert(
  extractedFromProse.length === 0,
  'Probe sentence produces exactly 0 false skills',
  `Got ${extractedFromProse.length} skills`
);

// --- PROBE 2: Substring matching trap in extractDocumentSkills ---
const substringProbeText = "digital transformation with excellent javascript and mysql database engineering";
const safeSkills = extractDocumentSkills('resume', 'resume.pdf', substringProbeText);

assert(
  !safeSkills.includes('Git'),
  'Substring trap: "digital" does NOT match Git',
  `Extracted skills: [${safeSkills.join(', ')}]`
);
assert(
  !safeSkills.includes('Excel'),
  'Substring trap: "excellent" does NOT match Excel',
  `Extracted skills: [${safeSkills.join(', ')}]`
);
assert(
  !safeSkills.includes('Java'),
  'Substring trap: "javascript" does NOT match Java',
  `Extracted skills: [${safeSkills.join(', ')}]`
);
assert(
  !safeSkills.includes('SQL'),
  'Substring trap: "mysql" does NOT match bare SQL',
  `Extracted skills: [${safeSkills.join(', ')}]`
);
assert(
  safeSkills.includes('JavaScript'),
  'Legitimate skill: "javascript" extracts JavaScript'
);
assert(
  safeSkills.includes('MySQL'),
  'Legitimate skill: "mysql" extracts MySQL'
);

// --- PROBE 3: Indian Phone Numbers in extractContacts & factCheckValidator ---
const phoneSamples = [
  "98765 43210",
  "+91 98765 43210",
  "+91 9876543210",
  "9876543210"
];

for (const p of phoneSamples) {
  const resumeText = `
Rohan Sharma
Email: rohan.sharma@example.com
Phone: ${p}
EDUCATION
B.E. Computer Science
SKILLS
TypeScript, React
`;
  const contacts = extractContacts(resumeText);
  assert(
    contacts.phone !== undefined && contacts.phone.replace(/\s/g, '').includes('98765'),
    `extractContacts detects Indian phone format "${p}"`,
    `Got contacts.phone = "${contacts.phone}"`
  );

  const graph = groundAndValidateEvidence(resumeText, 'resume.pdf', 'hash_phone_1');
  assert(
    graph.phone !== undefined && graph.phone.replace(/\s/g, '').includes('98765'),
    `groundAndValidateEvidence grounds Indian phone format "${p}"`,
    `Got graph.phone = "${graph.phone}"`
  );
}

// Resume with Indian phone should not lose phone points in ATS Screener
const indianResumeText = `
Rohan Sharma
rohan.sharma@example.com
+91 98765 43210
https://linkedin.com/in/rohansharma
https://github.com/rohansharma
https://rohan.dev

EDUCATION
Bachelor of Engineering in Computer Science

EXPERIENCE
Software Engineer at TechCorp
Developed scalable microservices using TypeScript and Node.js.

SKILLS
JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, Docker
`;

const atsReport = auditResumeATS(indianResumeText, { targetRole: 'sde' });
assert(
  atsReport.extractedProfile.contacts.phone !== undefined,
  'ATS Screener extracts Indian phone number (+91 98765 43210)'
);
assert(
  atsReport.compatibilityScores.parseabilityScore >= 90,
  `ATS Screener awards full parseability score for complete Indian profile (score: ${atsReport.compatibilityScores.parseabilityScore})`
);

// --- PROBE 4: Portfolio link does NOT extract email domain ---
const emailOnlyResume = `
Rohan Sharma
Contact: rohan.sharma@gmail.com
Phone: +91 9876543210
`;
const emailOnlyContacts = extractContacts(emailOnlyResume);
assert(
  emailOnlyContacts.portfolio === undefined,
  'Email domain "gmail.com" is NOT extracted as portfolio link',
  `Got portfolio = "${emailOnlyContacts.portfolio}"`
);

const portfolioResume = `
Rohan Sharma
Email: rohan.sharma@outlook.com
Phone: +91 9876543210
Website: https://rohan.tech
`;
const portfolioContacts = extractContacts(portfolioResume);
assert(
  portfolioContacts.portfolio === 'https://rohan.tech',
  'Legitimate portfolio "https://rohan.tech" is correctly extracted alongside outlook.com email',
  `Got portfolio = "${portfolioContacts.portfolio}"`
);

// --- PROBE 5: Legitimate skills extract accurately from technical sections ---
const validSkillsText = `
SKILLS
Next.js, Node.js, Express.js, CI/CD Pipeline, React, PostgreSQL
`;
const validSkills = extractCanonicalSkillsWithPolarity(validSkillsText, 'SKILLS');
const validSkillNames = validSkills.map(s => s.canonicalName);

assert(validSkillNames.includes('Next.js'), 'Technical section extracts "Next.js"');
assert(validSkillNames.includes('Node.js'), 'Technical section extracts "Node.js"');
assert(validSkillNames.includes('Express'), 'Technical section extracts "Express.js" as Express');
assert(validSkillNames.includes('CI/CD'), 'Technical section extracts "CI/CD Pipeline" as CI/CD');

console.log(`\nSubbatch 4.9 Verification Summary: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL SUBBATCH 4.9 PROBES & TESTS PASSED SUCCESFULLY!\n');
}
