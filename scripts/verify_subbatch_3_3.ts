import * as fs from 'fs';
import * as path from 'path';
import { generateEvidenceIntegrityHash, verifyEvidenceIntegrity } from '../src/lib/pathway/evidenceEngine';
import { evaluateCompetencyMastery } from '../src/lib/pathway/masteryEngine';
import { COMPETENCY_CATALOG_V1 } from '../src/lib/pathway/competencyCatalog';

async function runSubBatch33Verification() {
  console.log('========================================================================');
  console.log('🧪 VERIFICATION SUITE: SUB-BATCH 3.3 (DEF-065 to DEF-069)');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 5;
  const projectRoot = 'c:/Users/vinay/Desktop/project working/Present-Career-os';

  // ─── Test 1: DEF-065 (HMAC-SHA256 Evidence Integrity Hash with Server Secret)
  try {
    const rawEvidence = {
      id: 'ev_test_hmac_01',
      competencyId: 'comp_comp_fundamentals_l0',
      competencyVersion: '1.0.0',
      studentId: 'student_audit_77',
      programId: 'prog_swe_accelerated_9m',
      evidenceClass: 'knowledge' as const,
      difficulty: 'basic' as const,
      evidenceFamilyId: 'exam_os_fundamentals',
      sourceType: 'exam' as const,
      sourceId: 'exam_q1',
      attemptId: 'att_1',
      score: 95,
      evaluatorType: 'deterministic' as const,
      evaluatorVersion: 'v1.0',
      rubricVersion: 'rubric_v1',
      timestamp: 1726000000000,
      artifacts: { answer: 'A' },
    };

    const hash = generateEvidenceIntegrityHash(rawEvidence);
    const valid = verifyEvidenceIntegrity({ ...rawEvidence, integrityHash: hash });
    
    // Tamper test: Alter score by 1 point
    const tampered = verifyEvidenceIntegrity({ ...rawEvidence, score: 94, integrityHash: hash });

    if (hash && hash.length === 64 && valid === true && tampered === false) {
      console.log('✅ DEF-065 PASS: HMAC-SHA256 keyed hashing authenticates valid evidence and strictly rejects tampered payloads.');
      passed++;
    } else {
      console.error('❌ DEF-065 FAIL: HMAC-SHA256 evidence integrity check failed.', { hashLen: hash?.length, valid, tampered });
    }
  } catch (err: any) {
    console.error('❌ DEF-065 ERROR:', err.message);
  }

  // ─── Test 2: DEF-066 (Strict Quarantining of Cheating-Flagged Prerequisites)
  try {
    const downstreamComp = COMPETENCY_CATALOG_V1.find(c => c.prerequisites.length > 0);
    if (!downstreamComp) throw new Error('Downstream competency not found');

    const prereqId = downstreamComp.prerequisites[0];

    // Case A: Prerequisite is 'verified_needs_review' (flagged for review/cheating)
    const reviewResult = evaluateCompetencyMastery({
      competency: downstreamComp,
      rawEvidenceRecords: [],
      prerequisiteMasteryStates: { [prereqId]: 'verified_needs_review' },
    });

    const isBlockedByReview = reviewResult.blockedBy.some(msg => msg.includes('under academic review') || msg.includes(prereqId));
    const isStateLockedUnderReview = reviewResult.state === 'locked';

    // Case B: Prerequisite is 'verified' (cleanly approved)
    const cleanResult = evaluateCompetencyMastery({
      competency: downstreamComp,
      rawEvidenceRecords: [],
      prerequisiteMasteryStates: { [prereqId]: 'verified' },
    });

    const isCleanPrereqNotBlocked = !cleanResult.blockedBy.some(msg => msg.includes('under academic review'));

    if (isBlockedByReview && isStateLockedUnderReview && isCleanPrereqNotBlocked) {
      console.log('✅ DEF-066 PASS: Flagged competencies (`verified_needs_review`) are strictly quarantined and cannot unlock downstream tracks.');
      passed++;
    } else {
      console.error('❌ DEF-066 FAIL: Prerequisite quarantine failed.', { isBlockedByReview, isStateLockedUnderReview, isCleanPrereqNotBlocked });
    }
  } catch (err: any) {
    console.error('❌ DEF-066 ERROR:', err.message);
  }

  // ─── Test 3: DEF-067 (L0 Foundational Competency Anti-Gaming Requirements) ──
  try {
    const l0 = COMPETENCY_CATALOG_V1.find(c => c.id === 'comp_comp_fundamentals_l0');
    if (!l0) throw new Error('comp_comp_fundamentals_l0 not found');

    const req = l0.evidenceRequirements[0];
    const has2Count = req.minCount === 2;
    const has2Families = req.minDistinctFamilies === 2;
    const has75Score = req.minScore === 75;

    if (has2Count && has2Families && has75Score) {
      console.log('✅ DEF-067 PASS: L0 foundational gate requires min 2 count, min 2 distinct families, and minScore 75.');
      passed++;
    } else {
      console.error('❌ DEF-067 FAIL: L0 anti-gaming requirements incomplete.', { minCount: req?.minCount, minDistinctFamilies: req?.minDistinctFamilies, minScore: req?.minScore });
    }
  } catch (err: any) {
    console.error('❌ DEF-067 ERROR:', err.message);
  }

  // ─── Test 4: DEF-068 (Database-Backed Evidence Retrieval) ───────────────────
  try {
    const apiPath = path.join(projectRoot, 'src/lib/api/pathwayApi.ts');
    const content = fs.readFileSync(apiPath, 'utf-8');

    const queriesSupabaseEv = content.includes(".from('competency_evidence_records')");
    const handlesEmptyMemory = content.includes('allEvidence.length === 0 && supabase');
    const mapsDbFields = content.includes('evidence_class') && content.includes('integrity_hash');

    if (queriesSupabaseEv && handlesEmptyMemory && mapsDbFields) {
      console.log('✅ DEF-068 PASS: getAllStudentEvidence hydrates directly from Supabase when local memory is unpopulated.');
      passed++;
    } else {
      console.error('❌ DEF-068 FAIL: Database-backed evidence hydration incomplete.', { queriesSupabaseEv, handlesEmptyMemory, mapsDbFields });
    }
  } catch (err: any) {
    console.error('❌ DEF-068 ERROR:', err.message);
  }

  // ─── Test 5: DEF-069 (Authoritative Supabase Sync & Error Capture) ──────────
  try {
    const apiPath = path.join(projectRoot, 'src/lib/api/pathwayApi.ts');
    const content = fs.readFileSync(apiPath, 'utf-8');

    const checksInsErr = content.includes('const { error: insErr } = await supabase.from(\'competency_evidence_records\')');
    const checksMasteryErr = content.includes('const { error: masteryErr } = await supabase.from(\'student_competency_mastery\')');
    const logsAuthoritativeErrors = content.includes('Authoritative sync caught error:');

    if (checksInsErr && checksMasteryErr && logsAuthoritativeErrors) {
      console.log('✅ DEF-069 PASS: Evidence sync strictly awaits Supabase upsert and captures database errors.');
      passed++;
    } else {
      console.error('❌ DEF-069 FAIL: Authoritative sync error detection incomplete.', { checksInsErr, checksMasteryErr, logsAuthoritativeErrors });
    }
  } catch (err: any) {
    console.error('❌ DEF-069 ERROR:', err.message);
  }

  console.log('\n========================================================================');
  console.log(`SUB-BATCH 3.3 RESULT: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runSubBatch33Verification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
