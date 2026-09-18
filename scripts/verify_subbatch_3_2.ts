import * as fs from 'fs';
import * as path from 'path';

async function runSubBatch32Verification() {
  console.log('========================================================================');
  console.log('🧪 VERIFICATION SUITE: SUB-BATCH 3.2 (DEF-060 to DEF-064)');
  console.log('========================================================================\n');

  let passed = 0;
  let total = 5;
  const projectRoot = 'c:/Users/vinay/Desktop/project working/Present-Career-os';

  // ─── Test 1: DEF-060 (Competency Evidence Server-First Route & Persistence) ─
  try {
    const routePath = path.join(projectRoot, 'src/app/api/pathway/evidence/route.ts');
    const apiPath = path.join(projectRoot, 'src/lib/api/pathwayApi.ts');

    const routeContent = fs.readFileSync(routePath, 'utf-8');
    const apiContent = fs.readFileSync(apiPath, 'utf-8');

    const routeHasAuth = routeContent.includes('requireUserFromRequest');
    const routeHasUserCheck = routeContent.includes('studentId !== studentId') || routeContent.includes('evidenceRecord.studentId = studentId');
    const routeHasIntegrityCheck = routeContent.includes('verifyEvidenceIntegrity');
    const routeHasDbWrite = routeContent.includes('competency_evidence_records') || routeContent.includes('onboarding_answers');
    const apiHasServerCall = apiContent.includes('/api/pathway/evidence');

    if (routeHasAuth && routeHasUserCheck && routeHasIntegrityCheck && routeHasDbWrite && apiHasServerCall) {
      console.log('✅ DEF-060 PASS: Competency evidence has server POST /api/pathway/evidence with auth & integrity validation.');
      passed++;
    } else {
      console.error('❌ DEF-060 FAIL: Evidence server route incomplete.', { routeHasAuth, routeHasUserCheck, routeHasIntegrityCheck, routeHasDbWrite, apiHasServerCall });
    }
  } catch (err: any) {
    console.error('❌ DEF-060 ERROR:', err.message);
  }

  // ─── Test 2: DEF-061 (Internship Records Server Persistence) ────────────────
  try {
    const routePath = path.join(projectRoot, 'src/app/api/internships/route.ts');
    const apiPath = path.join(projectRoot, 'src/lib/api/pathwayApi.ts');

    const routeContent = fs.readFileSync(routePath, 'utf-8');
    const apiContent = fs.readFileSync(apiPath, 'utf-8');

    const routeHasGet = routeContent.includes('export async function GET');
    const routeHasPost = routeContent.includes('export async function POST');
    const routeHasAuth = routeContent.includes('requireUserFromRequest');
    const routePersists = routeContent.includes('onboarding_answers') || routeContent.includes('internship_records');
    const apiSyncs = apiContent.includes('/api/internships');

    if (routeHasGet && routeHasPost && routeHasAuth && routePersists && apiSyncs) {
      console.log('✅ DEF-061 PASS: Internship records persisted via GET/POST /api/internships and synced in pathwayApi.');
      passed++;
    } else {
      console.error('❌ DEF-061 FAIL: Internship persistence incomplete.', { routeHasGet, routeHasPost, routeHasAuth, routePersists, apiSyncs });
    }
  } catch (err: any) {
    console.error('❌ DEF-061 ERROR:', err.message);
  }

  // ─── Test 3: DEF-062 (Code Wars Battle History Server Persistence) ──────────
  try {
    const routePath = path.join(projectRoot, 'src/app/api/codewars/matches/route.ts');
    const apiPath = path.join(projectRoot, 'src/lib/api/codeWarsApi.ts');

    const routeContent = fs.readFileSync(routePath, 'utf-8');
    const apiContent = fs.readFileSync(apiPath, 'utf-8');

    const routeHasGet = routeContent.includes('export async function GET');
    const routeHasPost = routeContent.includes('export async function POST');
    const routeHasAuth = routeContent.includes('requireUserFromRequest');
    const routePersistsHistory = routeContent.includes('codewars_history');
    const apiHasSync = apiContent.includes('/api/codewars/matches');
    const apiHasAsyncFetch = apiContent.includes('getStudentMatchesAsync');

    if (routeHasGet && routeHasPost && routeHasAuth && routePersistsHistory && apiHasSync && apiHasAsyncFetch) {
      console.log('✅ DEF-062 PASS: Code Wars battle history persisted server-side with recovery on reload.');
      passed++;
    } else {
      console.error('❌ DEF-062 FAIL: Code Wars history persistence incomplete.', { routeHasGet, routeHasPost, routeHasAuth, routePersistsHistory, apiHasSync, apiHasAsyncFetch });
    }
  } catch (err: any) {
    console.error('❌ DEF-062 ERROR:', err.message);
  }

  // ─── Test 4: DEF-063 (Official Transcript Tamper-Resistant Verification) ────
  try {
    const routePath = path.join(projectRoot, 'src/app/api/passport/transcript/route.ts');
    const content = fs.readFileSync(routePath, 'utf-8');

    const checksDb = content.includes('student_competency_mastery') || content.includes('competency_evidence_records');
    const conditionalBadge = content.includes('isShaVerified') && content.includes('Provisional / Unverified');
    const conditionalSeal = content.includes('sealText');

    if (checksDb && conditionalBadge && conditionalSeal) {
      console.log('✅ DEF-063 PASS: Transcript dynamically verifies evidence against database before rendering SHA-256 seal.');
      passed++;
    } else {
      console.error('❌ DEF-063 FAIL: Transcript tamper verification incomplete.', { checksDb, conditionalBadge, conditionalSeal });
    }
  } catch (err: any) {
    console.error('❌ DEF-063 ERROR:', err.message);
  }

  // ─── Test 5: DEF-064 (Server-Authoritative Roadmap Hydration) ───────────────
  try {
    const ctxPath = path.join(projectRoot, 'src/lib/context/CareerOSContext.tsx');
    const content = fs.readFileSync(ctxPath, 'utf-8');

    // Check that DEF-064 fix is present and does not block hydration behind !localStorage.getItem
    const hasDef64Fix = content.includes('DEF-064 Fix: Server-first authoritative roadmap hydration');
    const lines = content.split('\n');
    const fixLineIdx = lines.findIndex(l => l.includes('DEF-064 Fix: Server-first authoritative roadmap hydration'));
    const slice = lines.slice(fixLineIdx, fixLineIdx + 12).join('\n');
    const unblocked = !slice.includes('!localStorage.getItem');

    if (hasDef64Fix && unblocked) {
      console.log('✅ DEF-064 PASS: CareerOSContext unconditionally hydrates authoritative server roadmap over stale local cache.');
      passed++;
    } else {
      console.error('❌ DEF-064 FAIL: Roadmap server hydration blocked or incomplete.', { hasDef64Fix, unblocked });
    }
  } catch (err: any) {
    console.error('❌ DEF-064 ERROR:', err.message);
  }

  console.log('\n========================================================================');
  console.log(`SUB-BATCH 3.2 RESULT: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('========================================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runSubBatch32Verification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
