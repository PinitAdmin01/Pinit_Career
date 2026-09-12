import * as dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import {
  PRACTICAL_CHALLENGE_REGISTRY,
  getChallengesForSkill,
  evaluateVerificationSubmission,
  stripCodeCommentsAndStrings,
  validateCodeStructure,
} from '../src/lib/ats/practicalVerificationEngine';
import { CodeWarsApiService } from '../src/lib/api/codeWarsApi';
import { POST as githubWebhookPOST } from '../src/app/api/webhooks/github/route';

async function runSubBatch4_3Tests() {
  console.log('========================================================================');
  console.log('📦 VERIFYING SUB-BATCH 4.3: Practical Challenges & Verification (092-096)');
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

  // ── Defect 092: Practical Code Evaluation Keyword Exploitation Defense ──
  console.log('── Defect 092: Practical Code Evaluation Anti-Cheat & Comment Stripping ──');
  const pyChallenge = PRACTICAL_CHALLENGE_REGISTRY['Python'][0]; // generators memory

  // Attack: Submitting keyword soup in comments
  const commentCheatCode = `# generator yield lazy evaluation O(1) memory context manager
# Just writing comments to pass keyword matching without code
`;
  assert(
    stripCodeCommentsAndStrings(commentCheatCode).trim() === '',
    'stripCodeCommentsAndStrings successfully purges all single-line comments'
  );
  assert(
    validateCodeStructure(commentCheatCode).isValid === false,
    'validateCodeStructure rejects comment-only submission'
  );

  const cheatEval = evaluateVerificationSubmission(pyChallenge, {
    challengeId: pyChallenge.id,
    skillName: 'Python',
    candidateCode: commentCheatCode,
    socraticAnswers: [],
  });
  assert(
    cheatEval.score === 0 || cheatEval.conceptBreakdown.every(c => !c.mastered),
    'Keyword dump in comments yields 0 mastered concepts (Exploit defeated)'
  );

  // Legitimate code submission with actual yield & context manager
  const realCode = `
def read_large_file(file_path):
    with open(file_path, 'r') as f:
        for line in f:
            yield line.strip()
`;
  const legitEval = evaluateVerificationSubmission(pyChallenge, {
    challengeId: pyChallenge.id,
    skillName: 'Python',
    candidateCode: realCode,
    socraticAnswers: [
      {
        questionIndex: 0,
        answerText: 'A list comprehension eagerly loads all lines into heap memory causing OOM, whereas a generator expression evaluates lazily on-demand stream because it only yields single lines.',
      },
      {
        questionIndex: 1,
        answerText: 'You should use a with open context manager statement because it guarantees deterministic file descriptor cleanup via __exit__ even if an exception occurs.',
      },
    ],
  });
  assert(legitEval.passed === true, 'Legitimate functional code implementation passes evaluation');
  assert(legitEval.newCapabilityStatus === 'VERIFIED_COMPETENCY', 'Legitimate comprehensive answer earns VERIFIED_COMPETENCY');

  // ── Defect 093: Socratic Acceptance Thresholds ──
  console.log('\n── Defect 093: Socratic Minimum Length & Semantic Reasoning Gate ──');
  // Attack: 26-char low-effort answer with 1 keyword
  const lowEffortAnswer = 'I had a latency error test'; // 26 chars
  const lowEffortEval = evaluateVerificationSubmission(pyChallenge, {
    challengeId: pyChallenge.id,
    skillName: 'Python',
    candidateCode: realCode,
    socraticAnswers: [
      { questionIndex: 0, answerText: lowEffortAnswer },
      { questionIndex: 1, answerText: lowEffortAnswer },
    ],
  });
  assert(lowEffortEval.score < 80, 'Low-effort 26-char answers without reasoning fail Socratic passing threshold');

  // ── Defect 094: Expanded Skill Taxonomy & Unregistered Fallback Guard ──
  console.log('\n── Defect 094: Skill Taxonomy Expansion & Fallback Guard ──');
  const requiredSkills = ['TypeScript', 'React', 'Node.js', 'Docker', 'Kubernetes', 'AWS', 'Go', 'Rust'];
  requiredSkills.forEach(skill => {
    assert(
      Array.isArray(PRACTICAL_CHALLENGE_REGISTRY[skill]) && PRACTICAL_CHALLENGE_REGISTRY[skill].length > 0,
      `PRACTICAL_CHALLENGE_REGISTRY includes official challenge suite for ${skill}`
    );
  });

  // Test unregistered skill fallback behavior
  const unregistered = getChallengesForSkill('Fortran77')[0];
  assert(unregistered.id.startsWith('generic_'), 'Unregistered skill generates dynamic generic challenge');
  
  const unregisteredEval = evaluateVerificationSubmission(unregistered, {
    challengeId: unregistered.id,
    skillName: 'Fortran77',
    candidateCode: 'PROGRAM HELLO\n  PRINT *, "HELLO"\nEND PROGRAM HELLO',
    socraticAnswers: [
      {
        questionIndex: 0,
        answerText: 'We resolved production memory and concurrency bottlenecks because we designed a segmented buffer cache to mitigate high throughput I/O latency.',
      }
    ],
  });
  assert(
    unregisteredEval.newCapabilityStatus !== 'VERIFIED_COMPETENCY',
    'Unregistered skill cannot automatically grant VERIFIED_COMPETENCY (capped at DEMONSTRATED)'
  );

  // ── Defect 095: GitHub Webhook Dynamic Score Calculation ──
  console.log('\n── Defect 095: GitHub Webhook Dynamic Scoring & Docs-Only Rejection ──');
  const testSecret = 'secret_webhook_test_123';
  process.env.GITHUB_WEBHOOK_SECRET = testSecret;

  // Case A: Docs-only commit (e.g. README update)
  const docsPayload = JSON.stringify({
    repository: { html_url: 'https://github.com/student/my-repo', name: 'my-repo' },
    commits: [
      {
        id: 'abcdef1234567890',
        message: 'docs: update README.md typo',
        added: [],
        modified: ['README.md', 'CONTRIBUTING.md'],
      }
    ],
    sender: { login: 'student_tester' }
  });
  const docsHmac = 'sha256=' + crypto.createHmac('sha256', testSecret).update(docsPayload).digest('hex');

  const docsReq = {
    headers: new Headers({
      'x-github-event': 'push',
      'x-hub-signature-256': docsHmac,
    }),
    text: async () => docsPayload,
  } as any;

  const docsRes = await githubWebhookPOST(docsReq);
  const docsData = await docsRes.json();
  assert(docsData.score === 0, 'Documentation-only commit is rejected with score 0 (no fake 92 score awarded)');

  // Case B: Production code with test file
  const codePayload = JSON.stringify({
    repository: { html_url: 'https://github.com/student/my-api', name: 'my-api' },
    commits: [
      {
        id: 'fedcba0987654321',
        message: 'feat: add user authentication and unit tests',
        added: ['src/auth.ts', 'src/auth.test.ts', 'src/middleware.ts'],
        modified: ['src/server.ts'],
      }
    ],
    sender: { login: 'student_tester' }
  });
  const codeHmac = 'sha256=' + crypto.createHmac('sha256', testSecret).update(codePayload).digest('hex');

  const codeReq = {
    headers: new Headers({
      'x-github-event': 'push',
      'x-hub-signature-256': codeHmac,
    }),
    text: async () => codePayload,
  } as any;

  const codeRes = await githubWebhookPOST(codeReq);
  const codeData = await codeRes.json();
  assert(codeData.success === true, 'Functional code push with tests accepted');
  assert(codeData.evidenceRecordId !== undefined, 'Evidence recorded in competency ledger');

  // ── Defect 096: Code Wars Test Cases Hidden From Client ──
  console.log('\n── Defect 096: Code Wars Client-Side Test Case Concealment ──');
  const clientProblems = CodeWarsApiService.getProblems();
  assert(clientProblems.length > 0, 'CodeWarsApiService returns problems list');

  let hasLeakedHiddenTest = false;
  let maxSampleCasesExceeded = false;
  for (const prob of clientProblems) {
    if (prob.testCases.some(tc => tc.isHidden)) {
      hasLeakedHiddenTest = true;
    }
    if (prob.testCases.length > 2) {
      maxSampleCasesExceeded = true;
    }
  }
  assert(hasLeakedHiddenTest === false, 'Zero hidden test cases exposed in CodeWarsApiService.getProblems()');
  assert(maxSampleCasesExceeded === false, 'Client receives at most 2 public sample test cases per problem');

  // Verify authoritative problems still retain complete test suites
  const authProblem = CodeWarsApiService.getAuthoritativeProblem(clientProblems[0].id);
  assert(authProblem !== undefined, 'Authoritative problem exists');
  assert(
    authProblem!.testCases.some(tc => tc.isHidden),
    'Authoritative problem on server still retains full test suite including hidden test cases'
  );

  console.log('\n========================================================================');
  console.log(`🏁 SUB-BATCH 4.3 RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSubBatch4_3Tests().catch(err => {
  console.error('Test execution crashed:', err);
  process.exit(1);
});
