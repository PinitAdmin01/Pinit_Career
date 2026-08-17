// Test Suite for P1-3: GitHub Repository Evidence & Skill Signal Engine
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function transpileAndRequire(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const compiled = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  });
  const moduleObj = { exports: {} };
  const runner = new Function('module', 'exports', 'require', compiled.outputText);
  runner(moduleObj, moduleObj.exports, require);
  return moduleObj.exports;
}

const {
  GITHUB_INGESTION_VERSION,
  GITHUB_EVIDENCE_DISCLAIMER,
  parseAndValidateGithubUrl,
  evaluateRepositoryTree,
  analyzeRepositoryEvidence,
  generateEvidenceHash
} = transpileAndRequire(path.join(__dirname, '../src/lib/github/githubIngestion.ts'));

let passed = 0;
let failed = 0;

function assert(testName, condition, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (details) console.error(`   Details:`, details);
    failed++;
  }
}

console.log(`🧪 Running PinIT GitHub Ingestion & Evidence Engine Test Suite (P1-3, ${GITHUB_INGESTION_VERSION})...\n`);

// 1. URL Validation & Security Tests
const validUrl1 = parseAndValidateGithubUrl('https://github.com/facebook/react');
assert('1. Parses valid standard GitHub URL', validUrl1.valid && validUrl1.owner === 'facebook' && validUrl1.repo === 'react');

const validUrl2 = parseAndValidateGithubUrl('https://www.github.com/vercel/next.js/');
assert('2. Parses www URL with trailing slash and dots', validUrl2.valid && validUrl2.owner === 'vercel' && validUrl2.repo === 'next.js');

const invalidUrl1 = parseAndValidateGithubUrl('http://localhost:3000/admin');
assert('3. Rejects localhost SSRF attempt', !invalidUrl1.valid);

const invalidUrl2 = parseAndValidateGithubUrl('javascript:alert(1)');
assert('4. Rejects javascript: protocol', !invalidUrl2.valid);

const invalidUrl3 = parseAndValidateGithubUrl('https://malicious-site.com/fake/repo');
assert('5. Rejects non-github domain URLs', !invalidUrl3.valid);

// 2. Tree Evaluation & Architecture Evidence Test
const mockSampleTree = [
  'README.md',
  'LICENSE',
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.js',
  'Dockerfile',
  'docker-compose.yml',
  '.github/workflows/ci.yml',
  '.github/workflows/deploy.yml',
  'src/components/Header.tsx',
  'src/components/Sidebar.tsx',
  'src/lib/api.ts',
  'src/lib/utils.ts',
  'src/api/routes/user.ts',
  'src/models/user.ts',
  'tests/unit/api.test.ts',
  'tests/unit/utils.test.ts',
  'jest.config.js'
];

const treeResult = evaluateRepositoryTree(mockSampleTree);

assert('6. Detects high architecture & modularity score', treeResult.evidence.architectureScore >= 70, `Got ${treeResult.evidence.architectureScore}`);
assert('7. Detects testing evidence score', treeResult.evidence.testingScore >= 40, `Got ${treeResult.evidence.testingScore}`);
assert('8. Detects DevOps & CI/CD evidence score', treeResult.evidence.devopsScore >= 70, `Got ${treeResult.evidence.devopsScore}`);
assert('9. Detects documentation score', treeResult.evidence.documentationScore >= 70, `Got ${treeResult.evidence.documentationScore}`);
assert('10. Extracts key manifest files', treeResult.keyFilesFound.includes('README.md') && treeResult.keyFilesFound.includes('Dockerfile'));

// 3. Full Repository Evidence Report Synthesis Test
const mockMetadata = {
  owner: 'acme',
  repo: 'enterprise-platform',
  fullName: 'acme/enterprise-platform',
  description: 'Full-stack enterprise application',
  stars: 120,
  forks: 35,
  openIssues: 4,
  defaultBranch: 'main',
  isFork: false,
  isArchived: false,
  pushedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago (active)
};

const mockLanguages = {
  TypeScript: 75,
  Python: 20,
  CSS: 5
};

const fullReport = analyzeRepositoryEvidence(mockMetadata, mockLanguages, mockSampleTree);

assert('11. Status is marked VERIFIED for valid tree', fullReport.status === 'VERIFIED');
assert('12. Overall evidence score >= 75 for rich repository', fullReport.overallEvidenceScore >= 75, `Got ${fullReport.overallEvidenceScore}`);
assert('13. Complexity classified as Enterprise or Advanced', fullReport.projectComplexityTier === 'Enterprise' || fullReport.projectComplexityTier === 'Advanced');
assert('14. Detected skills contains TypeScript and Next.js', fullReport.detectedSkills.some(s => s.skill === 'TypeScript') && fullReport.detectedSkills.some(s => s.skill === 'Next.js'));
assert('15. Proof record contains hash and metadata', fullReport.proofRecord.evidenceHash.startsWith('PIN-GH-'));
assert('16. Legal evidence disclaimer is included', fullReport.disclaimer === GITHUB_EVIDENCE_DISCLAIMER);

// 4. Evidence Hash Determinism
const hash1 = generateEvidenceHash('acme', 'repo', ['README.md', 'Dockerfile'], 85);
const hash2 = generateEvidenceHash('acme', 'repo', ['Dockerfile', 'README.md'], 85);
assert('17. Evidence hash is deterministic and order-independent', hash1 === hash2);

console.log(`\n========================================`);
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
