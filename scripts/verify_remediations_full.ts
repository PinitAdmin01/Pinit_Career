import * as dotenv from 'dotenv';
dotenv.config();

import { DEMO_PASSWORDS, isDemoPassword, DEMO_ROLE_BY_EMAIL } from '../src/lib/demoAuth';
import { financeService } from '../src/lib/services/financeService';
import { examsService } from '../src/lib/services/examsService';
import { CodeWarsApiService } from '../src/lib/api/codeWarsApi';
import { PathwayApiService } from '../src/lib/api/pathwayApi';

async function runVerification() {
  console.log('========================================================================');
  console.log('🧪 VERIFYING REMEDIATIONS & SYSTEM RESILIENCE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. DEMO AUTH VERIFICATION
  console.log('── 1. Demo Auth Dual Password & Account Verification ──');
  assert(DEMO_PASSWORDS.includes('111111') && DEMO_PASSWORDS.includes('password123'), 'Both 111111 and password123 are recognized demo passwords');
  assert(isDemoPassword('111111') === true, 'isDemoPassword("111111") is true');
  assert(isDemoPassword('password123') === true, 'isDemoPassword("password123") is true');
  assert(isDemoPassword('wrongpass') === false, 'isDemoPassword("wrongpass") is false');
  assert(DEMO_ROLE_BY_EMAIL['student@pinit.in'] === 'student', 'student@pinit.in exists with role student');
  assert(DEMO_ROLE_BY_EMAIL['admin@pinit.in'] === 'admin', 'admin@pinit.in exists with role admin');
  assert(DEMO_ROLE_BY_EMAIL['teacher@pinit.in'] === 'teacher', 'teacher@pinit.in exists with role teacher');

  // 2. FINANCE SERVICE IDEMPOTENCY & SCHOLARSHIP ALLOCATION
  console.log('\n── 2. Financial Safety: Idempotency & Scholarship Allocation ──');
  const studentId = 'test-stu-' + Date.now();
  
  // First payment
  const payResult1 = await financeService.payDue(studentId, 'Test Student', 'INST-01', 'student@pinit.in');
  assert(payResult1.ok === true && !!payResult1.receiptId, 'First payment succeeds with receipt: ' + payResult1.receiptId);

  // Replay of same payment (Idempotency test)
  const payResult2 = await financeService.payDue(studentId, 'Test Student', 'INST-01', 'student@pinit.in');
  assert(payResult2.ok === true && (payResult2 as any).alreadyPaid === true, 'Second payment for same installment is intercepted as alreadyPaid (idempotent, no double debit)');

  // Scholarship Allocation test (Sequential allocation without 3x multiplier wipe)
  const duesBefore = await financeService.getStudentDues(studentId);
  const totalBefore = duesBefore.installments.filter(d => d.status !== 'Paid').reduce((s, d) => s + d.amount, 0);
  
  // Apply a 15,000 scholarship
  const scholarshipResult = await financeService.applyScholarship(studentId, 'SCH-MERIT');
  assert(scholarshipResult.ok === true, 'applyScholarship succeeds with waiver: ' + scholarshipResult.waiver);

  const duesAfter = await financeService.getStudentDues(studentId);
  const totalAfter = duesAfter.installments.filter(d => d.status !== 'Paid').reduce((s, d) => s + d.amount, 0);
  assert(totalBefore - totalAfter === 15000, `Tuition reduction strictly equals scholarship amount (Before: ${totalBefore}, After: ${totalAfter}, Diff: ${totalBefore - totalAfter})`);

  // Re-applying same scholarship is prevented
  const repeatScholarship = await financeService.applyScholarship(studentId, 'SCH-MERIT');
  assert(repeatScholarship.ok === false && (repeatScholarship as any).alreadyApplied === true, 'Re-applying same scholarship is blocked (alreadyApplied)');

  // 3. EXAMS SERVICE: ZERO-LENGTH / NAN CRASH PREVENTION & GRADING
  console.log('\n── 3. Academic Exams: Zero-Length NaN Prevention & Evaluation ──');
  const initialSchedule = await examsService.getStudentSchedule();
  assert(Array.isArray(initialSchedule.schedule), 'Exam schedule returns array');

  const marksResult = await examsService.submitMarks(studentId, { 'CS401': 65, 'CS402': 58 });
  assert(marksResult.ok === true && !isNaN(marksResult.gpa), 'Marks submission calculates GPA without NaN: ' + marksResult.gpa);

  // 4. CODEWARS DETERMINISTIC EXECUTION
  console.log('\n── 4. CodeWars: Deterministic Execution Engine ──');
  
  // Valid LCA submission
  const validLcaCode = `
    function lowestCommonAncestor(root: any, p: number, q: number): any {
      let curr = root;
      while (curr) {
        if (p < curr.val && q < curr.val) {
          curr = curr.left;
        } else if (p > curr.val && q > curr.val) {
          curr = curr.right;
        } else {
          return curr.val;
        }
      }
      return null;
    }
  `;
  const match1 = CodeWarsApiService.startMatch(studentId, 'war_tree_lca_01', 'solo_speedrun');
  const lcaResult = await CodeWarsApiService.submitSolution({
    matchId: match1.id,
    studentId,
    code: validLcaCode,
    language: 'typescript',
    timeSpentSeconds: 45
  });
  assert(lcaResult.passed === true && lcaResult.testsPassed === lcaResult.totalTests, 'Valid LCA TypeScript implementation passes all unit tests deterministically');

  // Invalid LCA submission (fake / dummy code)
  const invalidLcaCode = `
    // This is a fake stub that used to pass with length > 30
    function lowestCommonAncestor(root: any, p: any, q: any): any {
      return null;
    }
  `;
  const match2 = CodeWarsApiService.startMatch(studentId, 'war_tree_lca_01', 'solo_speedrun');
  const invalidLcaResult = await CodeWarsApiService.submitSolution({
    matchId: match2.id,
    studentId,
    code: invalidLcaCode,
    language: 'typescript',
    timeSpentSeconds: 15
  });
  assert(invalidLcaResult.passed === false, 'Invalid LCA implementation fails test suite (mock victory eradicated)');

  // 5. DAILY MISSIONS DYNAMIC PATHWAY
  console.log('\n── 5. Missions API & Pathway Dynamic Generation ──');
  const missionsData = await PathwayApiService.getDynamicDailyMissions(studentId);
  assert(Array.isArray(missionsData.coreMissions) && missionsData.coreMissions.length > 0, `Generated ${missionsData.coreMissions.length} dynamic core missions`);
  const firstMission = missionsData.coreMissions[0];
  assert(!!firstMission.id && !!firstMission.title && firstMission.xpReward > 0, `Mission contract valid: [${firstMission.id}] ${firstMission.title} (${firstMission.xpReward} XP)`);

  console.log('\n========================================================================');
  console.log(`🏁 VERIFICATION COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
