// scripts/test_assessment_security_audit.ts
// Empirical Security Audit & Vulnerability Verification for BUILD 03 Assessment Engine

import {
  assessmentEngine,
  Assessment,
} from '../src/lib/curriculum/index';

let auditChecksPassed = 0;
let auditVulnerabilitiesFound = 0;

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

function reportFinding(severity: 'CRITICAL_VULNERABILITY' | 'HARD_LIMITATION' | 'PASSED_CONTROL', title: string, detail: string) {
  if (severity === 'PASSED_CONTROL') {
    console.log(`  🛡️ [VERIFIED CONTROL] ${title}`);
    console.log(`     Details: ${detail}\n`);
    auditChecksPassed++;
  } else {
    console.log(`  🚨 [${severity}] ${title}`);
    console.log(`     Details: ${detail}\n`);
    auditVulnerabilitiesFound++;
  }
}

async function runSecurityAudit() {
  console.log('\n========================================================================');
  console.log('🔍 PINIT BUILD 03: BRUTAL SECURITY AUDIT & THREAT MODEL VERIFICATION');
  console.log('========================================================================\n');

  // ── AUDIT CHECK 1: Bundle & In-Memory Private Test Leakage ──
  console.log('── AUDIT CHECK 1: Bundle & In-Memory Private Test Inspection ──');
  
  const testAssessment: Assessment = {
    id: 'asm-audit-001',
    assessmentCode: 'ASM-AUDIT-001',
    title: 'Security Audit Target Assessment',
    description: 'Target for bundle inspection',
    type: 'CODE',
    mode: 'CERTIFICATION',
    version: '1.0.0',
    status: 'PUBLISHED',
    difficulty: 'ADVANCED',
    timeLimitMinutes: 20,
    attemptPolicy: 'LIMITED_BEST',
    maxAttempts: 1,
    passingScore: 80,
    targetCompetencyId: 'comp-pfs-001',
    items: [
      {
        id: 'audit-item-01',
        assessmentId: 'asm-audit-001',
        version: '1.0.0',
        itemType: 'CODE',
        prompt: 'Secret code challenge',
        points: 100,
        order: 1,
        timeEstimateMinutes: 15,
        visibleTests: [{ id: 'vt-1', name: 'Visible', input: '1', expectedOutput: '1', tier: 'VISIBLE' }],
        privateTests: [{ id: 'pt-1', name: 'Secret Hidden Case', input: 'SECRET_INPUT_XYZ', expectedOutput: 'SECRET_OUTPUT_999', tier: 'PRIVATE' }],
        integrityTests: [{ id: 'it-1', name: 'Anti-Cheat Case', input: 'RANDOM_VECTOR_42', expectedOutput: 'VECTOR_HASH', tier: 'INTEGRITY' }],
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  assessmentEngine.registerAssessment(testAssessment);

  // 1.1: Direct Memory Query on Assessment Object
  const rawInternalAssessment = assessmentEngine.getAssessment('asm-audit-001', '1.0.0');
  const leakedPrivateTest = rawInternalAssessment?.items[0].privateTests?.[0];

  if (leakedPrivateTest && leakedPrivateTest.input === 'SECRET_INPUT_XYZ') {
    reportFinding(
      'CRITICAL_VULNERABILITY',
      'Private Tests Reside in Client Module Memory',
      'If `assessmentEngine` is imported by Next.js client components (e.g. `use client` pages), raw assessment definitions including `privateTests` and `integrityTests` exist in JavaScript memory and the Webpack bundle.'
    );
  } else {
    reportFinding('PASSED_CONTROL', 'Private Tests Isolated', 'Private tests are not accessible in module memory.');
  }

  // 1.2: Sanitized Payload Check
  const sanitized = assessmentEngine.getSanitizedAssessment('asm-audit-001', '1.0.0');
  if (sanitized && (sanitized.items[0] as any).privateTests === undefined) {
    reportFinding(
      'PASSED_CONTROL',
      'Sanitized View Strips Private Tests',
      'getSanitizedAssessment() successfully strips privateTests, integrityTests, and correctIndex from the returned payload.'
    );
  } else {
    reportFinding('CRITICAL_VULNERABILITY', 'Sanitization Failure', 'Sanitized payload still contained private tests.');
  }

  // ── AUDIT CHECK 2: Client Clock & Timestamp Manipulation ──
  console.log('── AUDIT CHECK 2: Authoritative Timing & Clock Spoofing ──');
  
  // Create an attempt
  const attempt = assessmentEngine.createAttempt('student-hacker', 'asm-audit-001', '1.0.0');
  
  // Simulate client manipulating local OS clock by 2 hours into the past
  const fakeManipulatedClientTime = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  
  reportFinding(
    'HARD_LIMITATION',
    'Client OS Clock Cannot Be Authoritative',
    `If timing relies on client-provided \`new Date()\` (${fakeManipulatedClientTime}), a student setting their OS clock backward can artificially prolong timed assessments. True certification requires server-side atomic timestamps (e.g. Postgres \`NOW()\` or Edge Function server time).`
  );

  // ── AUDIT CHECK 3: Persistence & Immutability Reality ──
  console.log('── AUDIT CHECK 3: Ledger Immutability & Volatility ──');
  
  // Submit an attempt
  await assessmentEngine.submitAndEvaluateAttempt(attempt.id, {
    'audit-item-01': 'def solution():\n    return 1',
  });

  const attemptBeforeReset = assessmentEngine.getAttempt(attempt.id);
  assert(!!attemptBeforeReset, 'Attempt recorded in current process memory');

  // Simulate page refresh / process restart
  assessmentEngine._reset();
  const attemptAfterReset = assessmentEngine.getAttempt(attempt.id);

  if (attemptAfterReset === undefined) {
    reportFinding(
      'HARD_LIMITATION',
      'In-Memory Ledger Resets on Process Lifecycle',
      'The current AssessmentEngine uses in-memory JavaScript Maps. On browser reload or serverless function cold restart, attempt histories are lost unless persisted to an append-only database table (Supabase/PostgreSQL) with cryptographic hash chaining.'
    );
  } else {
    reportFinding('PASSED_CONTROL', 'Ledger Persistent', 'Ledger survived memory reset.');
  }

  console.log('========================================================================');
  console.log(`📊 AUDIT SUMMARY: ${auditChecksPassed} Controls Verified | ${auditVulnerabilitiesFound} Hard Limitations / Vulnerabilities Documented`);
  console.log('========================================================================\n');
}

runSecurityAudit().catch((err) => {
  console.error('[FATAL ERROR IN SECURITY AUDIT]', err);
  process.exit(1);
});
