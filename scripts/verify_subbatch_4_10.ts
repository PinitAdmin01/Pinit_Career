import assert from 'assert';
import { evaluateQT2Model } from '../src/lib/ats/qt2AnalysisEngine';
import { VaultDocumentSlot, IdentityAuditReport } from '../src/lib/ats/documentAuditEngine';

console.log('================================================================');
console.log('🧪 VERIFY SUBBATCH 4.10: QT2 ENGINE HARDENING & METHODOLOGY AUDIT');
console.log('================================================================');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error('    Error:', err.message);
      failed++;
    }
  }

  const defaultAudit: IdentityAuditReport = {
    primaryName: 'Rohan Sharma',
    totalDocuments: 1,
    verifiedCount: 1,
    mismatchCount: 0,
    overallStatus: 'PROVISIONAL_PENDING',
    trustScore: 40,
    conflictingDocuments: [],
    identityConsistencyPercentage: 100
  };

  // Test 1: File name 'latest_resume.pdf' does NOT match 'test' or Stabilizer
  test('Issue 33: File name "latest_resume.pdf" is ignored; does not award Stabilizer archetype', () => {
    const doc: VaultDocumentSlot = {
      id: 'doc-1',
      fileName: 'latest_resume.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '45 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: [],
      provenanceRecords: [{
        entityType: 'NAME',
        extractedValue: 'Rohan Sharma',
        sourceTextSnippet: 'Rohan Sharma',
        startChar: 0,
        endChar: 12,
        confidence: 0.9,
        section: 'HEADER_CONTACTS'
      }]
    };
    const res = evaluateQT2Model([doc], defaultAudit);
    assert.strictEqual(res.dimensions.stabilizer, 25, 'Stabilizer remains uncalibrated baseline (25%)');
    const focusPillar = res.factors.find(f => f.pillar === 'Demonstrated Execution Focus');
    assert.strictEqual(focusPillar?.score, 0, 'No keyword points awarded from filename');
  });

  // Test 2: 'misleading' does NOT match 'lead' in Social IQ
  test('Issue 33: Substring "misleading" does not match "lead" or award Social IQ', () => {
    const doc: VaultDocumentSlot = {
      id: 'doc-2',
      fileName: 'analysis.pdf',
      title: 'Report',
      category: 'resume',
      fileSize: '45 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: [],
      provenanceRecords: [{
        entityType: 'SKILL',
        extractedValue: 'Auditing',
        sourceTextSnippet: 'Identified misleading marketing claims in ad campaigns',
        startChar: 0,
        endChar: 55,
        confidence: 0.9,
        section: 'EXPERIENCE'
      }]
    };
    const res = evaluateQT2Model([doc], defaultAudit);
    assert.strictEqual(res.dimensions.socialIQ, 25, 'Social IQ remains uncalibrated baseline (25%)');
  });

  // Test 3: Genuine technical words with word boundaries match accurately
  test('Issue 33: Genuine leadership and engineering keywords match with word boundaries', () => {
    const doc: VaultDocumentSlot = {
      id: 'doc-3',
      fileName: 'resume.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '45 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['Python', 'PostgreSQL'],
      provenanceRecords: [{
        entityType: 'PROJECT',
        extractedValue: 'Cloud Orchestrator',
        sourceTextSnippet: 'Spearheaded and led backend engineering team across distributed microservices using Python and PostgreSQL',
        startChar: 0,
        endChar: 106,
        confidence: 0.95,
        section: 'PROJECTS'
      }]
    };
    const res = evaluateQT2Model([doc], defaultAudit);
    assert(res.dimensions.patternHunter > 25, 'Pattern Hunter reflects systems/database signals');
    assert(res.dimensions.socialIQ > 25, 'Social IQ reflects leadership signals');
    const rigorFactor = res.factors.find(f => f.pillar === 'Execution Rigor & Impact');
    assert((rigorFactor?.score || 0) >= 8, 'Rigor score accounts for action verbs and grounded project anchor');
  });

  // Test 4: Two unverified self-submitted documents receive provisional integrity, NOT 25/25
  test('Issue 33: Multiple unverified self-submitted documents receive provisional integrity (<= 14), not flat 25', () => {
    const docA: VaultDocumentSlot = {
      id: 'doc-a',
      fileName: 'res1.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '20 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['Java'],
      provenanceRecords: []
    };
    const docB: VaultDocumentSlot = {
      id: 'doc-b',
      fileName: 'res2.pdf',
      title: 'Resume Draft',
      category: 'resume',
      fileSize: '20 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['Python'],
      provenanceRecords: []
    };
    const res = evaluateQT2Model([docA, docB], { ...defaultAudit, totalDocuments: 2 });
    assert.strictEqual(res.identityIntegrityScore, 14, 'Integrity is provisional baseline 14, not 25');
  });

  // Test 5: Institutional credential unlocks full 25/25 integrity
  test('Issue 33: Institutional credential unlocks full 25/25 integrity score', () => {
    const docA: VaultDocumentSlot = {
      id: 'doc-a',
      fileName: 'resume.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '20 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['Java'],
      provenanceRecords: []
    };
    const docB: VaultDocumentSlot = {
      id: 'doc-b',
      fileName: 'marksheet.pdf',
      title: 'Semester Marksheet',
      category: 'sem1',
      fileSize: '50 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'STRUCTURALLY_VALIDATED',
      candidateName: 'Rohan Sharma',
      scoreOrGpa: '8.50 GPA',
      skills: [],
      provenanceRecords: []
    };
    const res = evaluateQT2Model([docA, docB], { ...defaultAudit, totalDocuments: 2 });
    assert.strictEqual(res.identityIntegrityScore, 25, 'Integrity reaches full 25 with structural validation');
  });

  // Test 6: Longitudinal Growth calculates real GPA delta (declining vs improving)
  test('Issue 33: Declining GPA (9.20 -> 6.10) scores low growth (<= 4), while improving GPA scores high (>= 14)', () => {
    const sem1High: VaultDocumentSlot = {
      id: 's1',
      fileName: 'sem1.pdf',
      title: 'Semester 1',
      category: 'sem1',
      fileSize: '40 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'STRUCTURALLY_VALIDATED',
      candidateName: 'Rohan Sharma',
      scoreOrGpa: '9.20 GPA',
      skills: [],
      provenanceRecords: []
    };
    const sem2Low: VaultDocumentSlot = {
      id: 's2',
      fileName: 'sem2.pdf',
      title: 'Semester 2',
      category: 'sem2',
      fileSize: '40 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'STRUCTURALLY_VALIDATED',
      candidateName: 'Rohan Sharma',
      scoreOrGpa: '6.10 GPA',
      skills: [],
      provenanceRecords: []
    };
    const decliningRes = evaluateQT2Model([sem1High, sem2Low], defaultAudit);
    assert(decliningRes.longitudinalGrowthScore <= 4, `Declining GPA scores low growth (got ${decliningRes.longitudinalGrowthScore}, expected <= 4)`);
    assert(decliningRes.factors.find(f => f.pillar === 'Longitudinal Growth & Trajectory')?.details.includes('decline'));

    const sem1Low: VaultDocumentSlot = { ...sem1High, scoreOrGpa: '7.10 GPA' };
    const sem2High: VaultDocumentSlot = { ...sem2Low, scoreOrGpa: '8.60 GPA' };
    const improvingRes = evaluateQT2Model([sem1Low, sem2High], defaultAudit);
    assert(improvingRes.longitudinalGrowthScore >= 14, `Improving GPA scores high growth (got ${improvingRes.longitudinalGrowthScore}, expected >= 14)`);
    assert(improvingRes.factors.find(f => f.pillar === 'Longitudinal Growth & Trajectory')?.details.includes('Upward'));
  });

  // Test 7: Self-awareness index has NO artificial 50% floor
  test('Issue 33: Self-awareness index drops below 50 when stated preferences diverge completely from simulation actions', () => {
    const doc: VaultDocumentSlot = {
      id: 'd1',
      fileName: 'resume.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '30 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['TypeScript'],
      provenanceRecords: []
    };
    const simScores = { PatternHunter: 5, SocialIQ: 95 }; // 5% action logic
    const identityScores = { logic_vs_empathy: 95 }; // 95% stated logic -> 90 pt divergence
    const res = evaluateQT2Model([doc], defaultAudit, simScores, identityScores);
    assert(res.selfAwarenessIndex < 50, `Self-awareness reflects divergence below 50 (got ${res.selfAwarenessIndex})`);
    assert.strictEqual(res.selfAwarenessLabel, 'Divergence Detected (Aspiration vs Action Divergence)');
  });

  // Test 8: Mindset / Execution Focus has NO artificial 10-point floor
  test('Issue 33: Execution Focus pillar has no artificial 10-point floor for sparse evidence', () => {
    const doc: VaultDocumentSlot = {
      id: 'd1',
      fileName: 'resume.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '30 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['Python'], // exactly 1 signal
      provenanceRecords: []
    };
    const res = evaluateQT2Model([doc], defaultAudit);
    const focusFactor = res.factors.find(f => f.pillar === 'Demonstrated Execution Focus');
    assert((focusFactor?.score || 0) < 10, `Sparse evidence receives proportionate score (got ${focusFactor?.score}, expected < 10)`);
    assert.strictEqual(focusFactor?.score, 2, 'Exactly 1 signal produces 2 points');
  });

  console.log(`\n================================================================`);
  console.log(`📊 RESULT: ${passed} / ${passed + failed} TESTS PASSED`);
  console.log(`================================================================\n`);
  if (failed > 0) process.exit(1);
}

runTests();
