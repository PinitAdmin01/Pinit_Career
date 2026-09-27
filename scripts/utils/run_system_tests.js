// scripts/run_system_tests.js
// PinIT Career OS - Master End-to-End System Test Runner
// Executes all 10 specialized unit suites + 4 comprehensive cross-module integration pipelines

const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const { execSync } = require('child_process');

function transpileAndRequire(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const compiled = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  const moduleObj = { exports: {} };
  const customRequire = (importPath) => {
    if (importPath.startsWith('.')) {
      const resolved = path.resolve(path.dirname(filePath), importPath);
      const possibleExtensions = ['.ts', '.js', '/index.ts', '/index.js'];
      for (const ext of possibleExtensions) {
        if (fs.existsSync(resolved + ext)) {
          return transpileAndRequire(resolved + ext);
        }
      }
      if (fs.existsSync(resolved)) {
        return transpileAndRequire(resolved);
      }
    }
    return require(importPath);
  };
  const runner = new Function('module', 'exports', 'require', compiled.outputText);
  runner(moduleObj, moduleObj.exports, customRequire);
  return moduleObj.exports;
}

let totalTests = 0;
let totalPassed = 0;
let totalFailed = 0;

function logHeader(title) {
  console.log(`\n================================================================`);
  console.log(`  ${title}`);
  console.log(`================================================================\n`);
}

function recordAssert(suiteName, testName, condition, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] [${suiteName}] ${testName}`);
    totalPassed++;
  } else {
    console.error(`  ❌ [FAIL] [${suiteName}] ${testName}`);
    if (details) console.error(`     Details:`, details);
    totalFailed++;
  }
}

logHeader('PHASE 1: EXECUTING ALL 10 MODULE UNIT TEST SUITES');

const suites = [
  'scripts/test_sanitizer.js',
  'scripts/test_sanitizer_adversarial.js',
  'scripts/test_interview_scoring.js',
  'scripts/test_ats_screener.js',
  'scripts/test_code_runner.js',
  'scripts/test_streaming_tts.js',
  'scripts/test_github_ingestion.js',
  'scripts/test_job_deduplicator.js',
  'scripts/test_mobile_stt.js',
  'scripts/test_practice_telemetry.js',
  'scripts/test_audio_feedback_isolation.js'
];

for (const suite of suites) {
  const suitePath = path.join(__dirname, '..', suite);
  try {
    const output = execSync(`node "${suitePath}"`, { encoding: 'utf8', stdio: 'pipe' });
    const passMatches = (output.match(/\[PASS\]/g) || []).length;
    const failMatches = (output.match(/\[FAIL\]/g) || []).length;
    console.log(`📦 Executed ${suite}: ${passMatches} Passed, ${failMatches} Failed`);
    totalTests += (passMatches + failMatches);
    totalPassed += passMatches;
    totalFailed += failMatches;
  } catch (err) {
    console.error(`❌ Execution failed on ${suite}:`, err.message);
    totalFailed++;
  }
}

logHeader('PHASE 2: CROSS-MODULE END-TO-END INTEGRATION PIPELINES');

// Import All Core Modules
const { sanitizeLLMOutput, sanitizeForSpeech } = transpileAndRequire(path.join(__dirname, '../src/lib/sanitizeLLM.ts'));
const { splitIntoSentences } = transpileAndRequire(path.join(__dirname, '../src/lib/audio/streamingAudioQueue.ts'));
const { calculateRoleWeightedScore, generatePersonaCoaching } = transpileAndRequire(path.join(__dirname, '../src/lib/interview/scoringMatrix.ts'));
const { auditResumeATS } = transpileAndRequire(path.join(__dirname, '../src/lib/ats/atsScreener.ts'));
const { deduplicateJobListings } = transpileAndRequire(path.join(__dirname, '../src/lib/opportunities/jobDeduplicator.ts'));
const { analyzeGithubRepository } = transpileAndRequire(path.join(__dirname, '../src/lib/github/githubIngestion.ts'));
const { executeJavaScriptCode } = transpileAndRequire(path.join(__dirname, '../src/lib/code/runners/jsRunner.ts'));
const { synthesizePracticeTelemetryReport } = transpileAndRequire(path.join(__dirname, '../src/lib/telemetry/practiceTelemetry.ts'));

// -------------------------------------------------------------
// Scenario A: AI Interview Cross-Module Lifecycle
// -------------------------------------------------------------
console.log(`\n🚀 [Integration A] AI Interview Full Lifecycle (LLM Sanitizer -> TTS Chunker -> Scoring Matrix -> Telemetry Diagnostics)`);

const rawLLMInterviewTurn = `<think>
Evaluating candidate answer on distributed consensus. They mentioned Paxos and Raft.
</think>
Great explanation of the Raft consensus algorithm! Can you describe how leader election operates under network partitions?`;

// 1. Sanitize LLM reply
const sanitizedTurn = sanitizeLLMOutput(rawLLMInterviewTurn);
recordAssert('E2E AI Interview', 'A1. Strips hidden <think> tags from avatar reply', !sanitizedTurn.includes('<think>') && sanitizedTurn.includes('Great explanation'));

// 2. Sentence chunking for Kokoro streaming TTS
const speechChunks = splitIntoSentences(sanitizeForSpeech(sanitizedTurn));
recordAssert('E2E AI Interview', 'A2. Splits speech into streaming sentence chunks for Web Audio queue', speechChunks.length === 2 && speechChunks[0].includes('Raft consensus'));

// 3. Score candidate response with SDE role rubric + Pattern Hunter archetype coaching
const candidateEvaluation = calculateRoleWeightedScore(
  {
    logic: 85,
    systems: 90,
    comms: 75,
    solving: 85,
    star: 80
  },
  'sde'
);
const archetypeCoaching = generatePersonaCoaching('Pattern Hunter', candidateEvaluation.sanitizedDimensions, 'sde');

recordAssert('E2E AI Interview', 'A3. Computes role-weighted numerical score (85)', candidateEvaluation.overallScore >= 80 && candidateEvaluation.verdict === 'Hire');
recordAssert('E2E AI Interview', 'A4. Generates archetype-tailored Pattern Hunter coaching advice', archetypeCoaching.personaSummary.includes('Pattern Hunter') && typeof archetypeCoaching.growthArea === 'string');

// 4. Attach non-penalizing client-side telemetry
const candidateTelemetry = synthesizePracticeTelemetryReport(
  { faceDetected: true, yaw: 3, pitch: -2, lightingQuality: 'Good', frameDeltaMovement: 0.22 },
  { wordCount: 140, durationSeconds: 60, micActive: true }
);
recordAssert('E2E AI Interview', 'A5. Generates client-side practice delivery report (140 WPM, 90%+ Alignment)', candidateTelemetry.metrics.speakingPaceWPM === 140 && candidateTelemetry.metrics.cameraAlignmentStabilityPercent >= 90);

// -------------------------------------------------------------
// Scenario B: ATS Screener & Opportunity Radar Deduplication
// -------------------------------------------------------------
console.log(`\n🚀 [Integration B] Career Opportunities Pipeline (Resume ATS Audit -> Quick Wins -> Job Deduplication)`);

const candidateResumeText = `
John Doe
john.doe@example.com | (555) 234-5678 | San Francisco, CA
github.com/johndoe | linkedin.com/in/johndoe

TECHNICAL SKILLS
Languages: Python, Go, Java, TypeScript, SQL
Cloud & DevOps: Kubernetes, Docker, AWS, CI/CD, Kafka
Databases: PostgreSQL, Redis, MongoDB

WORK EXPERIENCE
Senior Software Engineer | Acme Tech Corp | 2022 - Present
• Engineered real-time payments microservice handling 45,000 requests per second with Go and Redis, reducing P99 latency by 35%.
• Architected automated Kubernetes deployment pipeline on AWS, cutting release deployment cycle by 40%.

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2018 - 2022
`;

// 1. Run local ATS audit
const atsAudit = auditResumeATS(candidateResumeText, { targetRole: 'backend', targetJD: 'Looking for a Senior Backend Engineer experienced in Kubernetes, Go, PostgreSQL, and Kafka.' });
recordAssert('E2E ATS & Jobs', 'B1. Local ATS audit computes high composite score (>= 80)', atsAudit.compositeScore >= 80);
recordAssert('E2E ATS & Jobs', 'B2. Identifies standard sections and candidate contacts', atsAudit.extractedProfile.contacts.email === 'john.doe@example.com' && atsAudit.extractedProfile.sectionsDetected.length >= 3);
recordAssert('E2E ATS & Jobs', 'B3. Provides prioritized quick wins recommendations', atsAudit.quickWins.length >= 1);

// 2. Ingest corporate job feeds and deduplicate
const rawJobFeed = [
  { id: 'job-1', title: 'Senior Backend Engineer', company: 'Amazon Web Services India Pvt. Ltd.', location: 'Bengaluru', externalJobId: 'AWS-9901', source: 'Direct' },
  { id: 'job-2', title: 'Sr. Backend Developer (Go/Kubernetes)', company: 'AWS', location: 'Bengaluru', externalJobId: 'AWS-9901', source: 'LinkedIn' },
  { id: 'job-3', title: 'Senior Backend Engineer', company: 'AWS', location: 'Hyderabad', source: 'Indeed' } // Different location
];

const dedupResult = deduplicateJobListings(rawJobFeed);
recordAssert('E2E ATS & Jobs', 'B4. Deduplicates cross-posted listings via AWS alias & exact externalJobId', dedupResult.uniqueCanonicalJobsCount === 2);
recordAssert('E2E ATS & Jobs', 'B5. Keeps distinct locations (Bengaluru vs Hyderabad) strictly separate', dedupResult.flatDeduplicatedJobs.some(j => j.normalizedLocation.includes('bengaluru')) && dedupResult.flatDeduplicatedJobs.some(j => j.normalizedLocation.includes('hyderabad')));

// -------------------------------------------------------------
// Scenario C: GitHub Evidence & Skill Passport Engine
// -------------------------------------------------------------
console.log(`\n🚀 [Integration C] GitHub Proof-of-Work Pipeline (SSRF Guard -> AST Analysis -> PIN-GH Proof Hash)`);

const { parseAndValidateGithubUrl, analyzeRepositoryEvidence } = transpileAndRequire(path.join(__dirname, '../src/lib/github/githubIngestion.ts'));

const validUrlCheck = parseAndValidateGithubUrl('https://github.com/sample-dev/production-api');
recordAssert('E2E GitHub Ingestion', 'C1. Validates and parses public GitHub repository URL safely', validUrlCheck.valid && validUrlCheck.owner === 'sample-dev' && validUrlCheck.repo === 'production-api');

const mockSampleTree = [
  'README.md', 'LICENSE', 'package.json', 'tsconfig.json', 'next.config.js', 'tailwind.config.js',
  'Dockerfile', 'docker-compose.yml', '.github/workflows/ci.yml', '.github/workflows/deploy.yml',
  'src/components/Header.tsx', 'src/components/Sidebar.tsx', 'src/lib/api.ts', 'src/lib/utils.ts',
  'src/api/routes/user.ts', 'src/models/user.ts', 'tests/unit/api.test.ts', 'tests/unit/utils.test.ts',
  'jest.config.js'
];
const mockMeta = {
  owner: 'sample-dev', repo: 'production-api', fullName: 'sample-dev/production-api',
  stars: 45, forks: 12, openIssues: 2, defaultBranch: 'main', isFork: false, isArchived: false,
  pushedAt: new Date().toISOString()
};

const ghAnalysis = analyzeRepositoryEvidence(mockMeta, { TypeScript: 80, CSS: 20 }, mockSampleTree);
recordAssert('E2E GitHub Ingestion', 'C2. Scores repository evidence across testing, devops, architecture (>= 75)', ghAnalysis.overallEvidenceScore >= 75);
recordAssert('E2E GitHub Ingestion', 'C3. Generates cryptographic PIN-GH-XXXX-YYYY proof record', ghAnalysis.proofRecord.evidenceHash.startsWith('PIN-GH-'));
recordAssert('E2E GitHub Ingestion', 'C4. Extracts detected skill signals (TypeScript)', ghAnalysis.detectedSkills.some(s => s.skill === 'TypeScript'));

// -------------------------------------------------------------
// Scenario D: Code Arena Execution Engine
// -------------------------------------------------------------
console.log(`\n🚀 [Integration D] Code Arena Sandbox (Sandboxed Execution -> Multi-Case Assertions)`);

const { executeJavaScriptSuite } = transpileAndRequire(path.join(__dirname, '../src/lib/code/runners/jsRunner.ts'));

const validJsCode = `
  function solution(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return true;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) return false;
    }
    return true;
  }
`;

const jsTestCases = [
  { input: '[1, 2, 3, 4]', output: 'true', name: 'Sorted Array' },
  { input: '[5, 2, 1]', output: 'false', name: 'Unsorted Array' },
  { input: '[]', output: 'true', name: 'Empty Array' }
];

async function runAsyncD() {
  const jsResult = await executeJavaScriptSuite(validJsCode, 'solution', jsTestCases, 3000);
  recordAssert('E2E Code Sandbox', 'D1. Executes solution algorithm in sandbox and passes all test cases (3/3)', jsResult.allPassed === true && jsResult.passedTests === 3);

  // -------------------------------------------------------------
  // FINAL SYSTEM SCORECARD
  // -------------------------------------------------------------
  logHeader('MASTER SYSTEM TESTING SUMMARY SCORECARD');

  console.log(`  Total Test Cases Executed: ${totalTests}`);
  console.log(`  Total Passed:              ${totalPassed}`);
  console.log(`  Total Failed:              ${totalFailed}`);
  console.log(`  Success Rate:              ${((totalPassed / totalTests) * 100).toFixed(2)}%\n`);

  if (totalFailed > 0) {
    console.error('❌ SYSTEM TESTING DETECTED FAILURES. ABORTING.');
    process.exit(1);
  } else {
    console.log('🌟 ALL 10 MODULE SUITES & 4 CROSS-MODULE INTEGRATION PIPELINES PASSED WITH ZERO ERRORS!');
    process.exit(0);
  }
}

runAsyncD();
