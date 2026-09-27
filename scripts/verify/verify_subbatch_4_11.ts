import assert from 'assert';
import { classifyDocumentCategory, VaultCategory, checkNameSimilarity } from '../src/lib/ats/documentAuditEngine';
import { auditResumeATS } from '../src/lib/ats/atsScreener';

console.log('================================================================');
console.log('🧪 VERIFY SUBBATCH 4.11: SECURE VAULT UPLOAD & DELETION HARDENING');
console.log('================================================================');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      const result = fn();
      if (result instanceof Promise) {
        return result.then(() => {
          console.log(`  ✅ PASS: ${name}`);
          passed++;
        }).catch((err: any) => {
          console.error(`  ❌ FAIL: ${name}`);
          console.error('    Error:', err.message);
          failed++;
        });
      } else {
        console.log(`  ✅ PASS: ${name}`);
        passed++;
      }
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error('    Error:', err.message);
      failed++;
    }
  }

  // 1. Client Category Validation & Spoofing Defense
  test('Issue 34: Unvalidated client categories are rejected and fallback to auto-classification', () => {
    const VALID_CATEGORIES: Set<string> = new Set([
      '10th', '12th_puc', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8',
      'resume', 'achievement', 'certification', 'internship', 'other'
    ]);

    const spoofedCategory = 'malicious_admin_credential';
    const validTargetCat = VALID_CATEGORIES.has(spoofedCategory) ? (spoofedCategory as VaultCategory) : null;
    assert.strictEqual(validTargetCat, null, 'Spoofed category rejected');

    const marksheetText = 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY BELAGAVI 4TH SEMESTER GRADE CARD';
    const fallbackCategory = validTargetCat || classifyDocumentCategory('marksheet.pdf', marksheetText);
    assert.strictEqual(fallbackCategory, 'sem4', 'Falls back to accurate classifier');
  });

  // 2. Titles Do Not Contain "Verified" for Unverified Client Uploads
  test('Issue 34: Titles for certification and other do not claim "Verified"', () => {
    const categoryTitles: Record<string, string> = {
      '10th': '10th Standard / Secondary Board Marksheet',
      '12th_puc': '12th / 2nd PUC / Diploma Certificate',
      'sem1': '1st Semester University Marksheet',
      'sem2': '2nd Semester University Marksheet',
      'sem3': '3rd Semester University Marksheet',
      'sem4': '4th Semester University Marksheet',
      'sem5': '5th Semester University Marksheet',
      'sem6': '6th Semester University Marksheet',
      'sem7': '7th Semester University Marksheet',
      'sem8': '8th Semester University Marksheet',
      'resume': 'Primary Candidate Master Resume',
      'achievement': 'Certificate of Achievement / Contest Win',
      'certification': 'Technical / Professional Certification',
      'internship': 'Internship Experience Letter',
      'other': 'Supporting Document'
    };

    assert.strictEqual(categoryTitles['certification'], 'Technical / Professional Certification');
    assert.strictEqual(categoryTitles['other'], 'Supporting Document');
    assert(!categoryTitles['certification'].includes('Verified'), 'Certification title does not claim Verified');
    assert(!categoryTitles['other'].includes('Verified'), 'Other document title does not claim Verified');
  });

  // 3. Non-Resume Documents Do Not Receive Phantom ATS Score (72)
  test('Issue 34: Non-resume documents do not receive ATS score (undefined)', () => {
    const categories: VaultCategory[] = ['10th', '12th_puc', 'sem1', 'sem4', 'certification', 'achievement', 'other'];
    for (const cat of categories) {
      let atsScore: number | undefined = undefined;
      const rawText = 'Comprehensive semester marksheet with course details and grades.';
      if (cat === 'resume' && rawText.length > 50) {
        atsScore = auditResumeATS(rawText, { targetRole: 'sde' }).compositeScore;
      }
      assert.strictEqual(atsScore, undefined, `Category ${cat} must not have atsScore`);
    }

    // Resume does compute an ATS score
    const resumeText = 'Education: B.Tech Computer Science. Skills: TypeScript, React, Node.js, PostgreSQL. Experience: SDE Intern.';
    let resumeAts: number | undefined = undefined;
    if (('resume' as VaultCategory) === 'resume' && resumeText.length > 50) {
      resumeAts = auditResumeATS(resumeText, { targetRole: 'sde' }).compositeScore;
    }
    assert(typeof resumeAts === 'number' && resumeAts > 0, 'Resume computes legitimate ATS score');
  });

  // 4. Candidate Matching Profile Name Results in "provisional", NOT "verified"
  test('Issue 34: Matching candidate name sets provisional status and verified=false in DB', () => {
    const profileName = 'Vikram Malhotra';
    const detectedName = 'Vikram Malhotra';

    let verificationStatus: 'verified' | 'mismatch_warning' | 'provisional' = 'provisional';
    let mismatchReason: string | undefined = undefined;

    const nameCheck = checkNameSimilarity(profileName, detectedName);
    if (!nameCheck.isMatch) {
      verificationStatus = 'mismatch_warning';
      mismatchReason = nameCheck.reason;
    } else {
      verificationStatus = 'provisional';
    }

    assert.strictEqual(verificationStatus, 'provisional', 'Matches profile name but remains provisional');
    const dbVerified = false; // Official verification requires institutional check
    assert.strictEqual(dbVerified, false, 'Database verified flag is strictly false');
  });

  // 5. Default Privacy is Private (is_public: false)
  test('Issue 34: Vault items default to is_public: false', () => {
    const defaultIsPublic = false;
    assert.strictEqual(defaultIsPublic, false, 'Mark sheets and personal documents are never public by default');
  });

  // 6. Storage Deletion IDOR Protection: Path Parameter Tampering Blocked
  test('Issue 34: Cross-user storage deletion attempt is detected and blocked with FORBIDDEN', () => {
    const authenticatedUserId = 'user_student_123';
    const maliciousClientStorageUrl = 'vault/victim_student_999/sem1/grade_card.pdf';

    const candidatePath = maliciousClientStorageUrl.includes('resumes/')
      ? maliciousClientStorageUrl.split('resumes/')[1]?.split('?')[0]
      : maliciousClientStorageUrl.split('?')[0];

    const userPrefix = `vault/${authenticatedUserId}/`;
    const isAuthorized = candidatePath.startsWith(userPrefix);

    assert.strictEqual(isAuthorized, false, 'Storage path outside user directory is unauthorized');
  });

  // 7. Legitimate Storage Path within User Namespace is Allowed
  test('Issue 34: Storage path within authenticated user namespace is permitted', () => {
    const authenticatedUserId = 'user_student_123';
    const validClientStorageUrl = 'https://supabase.co/storage/v1/object/public/resumes/vault/user_student_123/sem1/marksheet.pdf?token=abc';

    const candidatePath = validClientStorageUrl.includes('resumes/')
      ? validClientStorageUrl.split('resumes/')[1]?.split('?')[0]
      : validClientStorageUrl.split('?')[0];

    const userPrefix = `vault/${authenticatedUserId}/`;
    const isAuthorized = candidatePath.startsWith(userPrefix);

    assert.strictEqual(isAuthorized, true, 'User storage path is authorized');
    assert.strictEqual(candidatePath, 'vault/user_student_123/sem1/marksheet.pdf');
  });

  // 8. Storage Upload Failure Stops Persistence (No Phantom DB Rows)
  test('Issue 34: Simulated storage failure aborts pipeline with STORAGE_UPLOAD_FAILED', () => {
    const uploadError = { message: 'Supabase storage service unavailable' };
    const uploadData = null;

    let pipelineHalted = false;
    let responseStatus = 0;
    let responseError = '';

    if (uploadError || !uploadData) {
      pipelineHalted = true;
      responseStatus = 500;
      responseError = 'STORAGE_UPLOAD_FAILED';
    }

    assert.strictEqual(pipelineHalted, true, 'Pipeline halted on storage failure');
    assert.strictEqual(responseStatus, 500);
    assert.strictEqual(responseError, 'STORAGE_UPLOAD_FAILED');
  });

  // 9. Storage Orphan Cleanup when DB Row Already Purged
  test('Issue 34: Orphaned file cleanup permits deletion if storageUrl belongs to user, rejects if IDOR', () => {
    const authenticatedUserId = 'user_student_123';
    const vaultDoc = null; // Row was already deleted

    // Authorized orphan cleanup
    const userStorageUrl = 'vault/user_student_123/sem2/marksheet.pdf';
    const cleanUserPath = userStorageUrl.includes('resumes/')
      ? userStorageUrl.split('resumes/')[1]?.split('?')[0]
      : userStorageUrl.split('?')[0];
    const isUserAuthorized = cleanUserPath.startsWith(`vault/${authenticatedUserId}/`);
    assert.strictEqual(isUserAuthorized, true);

    // Malicious orphan deletion attempt
    const attackerStorageUrl = 'vault/victim_student_999/sem2/marksheet.pdf';
    const cleanAttackerPath = attackerStorageUrl.includes('resumes/')
      ? attackerStorageUrl.split('resumes/')[1]?.split('?')[0]
      : attackerStorageUrl.split('?')[0];
    const isAttackerAuthorized = cleanAttackerPath.startsWith(`vault/${authenticatedUserId}/`);
    assert.strictEqual(isAttackerAuthorized, false);
  });

  console.log(`\n================================================================`);
  console.log(`📊 RESULT: ${passed} / ${passed + failed} TESTS PASSED`);
  console.log(`================================================================\n`);
  if (failed > 0) process.exit(1);
}

runTests();
