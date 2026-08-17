// Test Suite for P2-1: Fuzzy Job Deduplication & Canonical Normalizer Engine
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
  JOB_DEDUPLICATOR_VERSION,
  COMPANY_ALIASES,
  normalizeCompanyName,
  normalizeJobTitle,
  normalizeApplicationUrl,
  computeJaccardSimilarity,
  computeStringSimilarity,
  calculateJobSimilarity,
  deduplicateJobListings
} = transpileAndRequire(path.join(__dirname, '../src/lib/opportunities/jobDeduplicator.ts'));

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

console.log(`🧪 Running PinIT Job Deduplicator & Normalizer Test Suite (P2-1, ${JOB_DEDUPLICATOR_VERSION})...\n`);

// 1. Company Suffix & Alias Normalization
const comp1 = normalizeCompanyName('Amazon Web Services India Pvt. Ltd.');
assert('1. Resolves AWS alias to Amazon', comp1.canonicalCompanyKey === 'amazon');

const comp2 = normalizeCompanyName('Google LLC');
assert('2. Resolves Google LLC to Google', comp2.canonicalCompanyKey === 'google');

const comp3 = normalizeCompanyName('Stripe Inc.');
assert('3. Strips corporate suffix Inc.', comp3.canonicalCompanyKey === 'stripe');

// 2. Job Title & Seniority Normalization
const title1 = normalizeJobTitle('Sr. React & Frontend Developer');
assert('4. Classifies Senior Frontend track', title1.seniority === 'Senior' && title1.careerTrack === 'Frontend Engineer');

const title2 = normalizeJobTitle('Staff Backend Engineer (Golang/Kubernetes)');
assert('5. Classifies Staff Backend track', title2.seniority === 'Staff' && title2.careerTrack === 'Backend Engineer');

const title3 = normalizeJobTitle('AI & Machine Learning Intern');
assert('6. Classifies Intern AI/ML track', title3.seniority === 'Intern' && title3.careerTrack === 'AI / ML Engineer');

// 3. Application URL Sanitization
const url1 = 'https://careers.google.com/jobs/12345?utm_source=linkedin&utm_medium=job_board';
const url2 = 'https://careers.google.com/jobs/12345';
assert('7. Canonical URL strips tracking query parameters', normalizeApplicationUrl(url1) === normalizeApplicationUrl(url2));

// 4. Exact External ID / Exact URL Merging
const rawJobA = {
  id: 'j1',
  title: 'Full Stack Engineer',
  company: 'Stripe',
  externalJobId: 'STRIPE-9988',
  location: 'Remote',
  source: 'LinkedIn'
};
const rawJobB = {
  id: 'j2',
  title: 'Fullstack Developer (Node/React)',
  company: 'Stripe Inc',
  externalJobId: 'STRIPE-9988',
  location: 'Remote',
  source: 'Indeed'
};

const dedupResult1 = deduplicateJobListings([rawJobA, rawJobB]);
assert('8. Exact externalJobId auto-merges cross-posted listings', dedupResult1.uniqueCanonicalJobsCount === 1);
assert('9. Merged cluster combines sources LinkedIn and Indeed', dedupResult1.canonicalClusters[0].duplicateSources.includes('LinkedIn') && dedupResult1.canonicalClusters[0].duplicateSources.includes('Indeed'));

// 5. Geographic Safety Test: Same Company & Role in DIFFERENT Locations Must NOT Auto-Merge!
const jobBangalore = {
  id: 'j3',
  title: 'Software Engineer',
  company: 'Google',
  location: 'Bengaluru, India',
  skills: ['Java', 'Distributed Systems']
};
const jobHyderabad = {
  id: 'j4',
  title: 'Software Engineer',
  company: 'Google',
  location: 'Hyderabad, India',
  skills: ['Java', 'Distributed Systems']
};

const dedupResult2 = deduplicateJobListings([jobBangalore, jobHyderabad]);
assert('10. Different job locations (Bengaluru vs Hyderabad) are kept separate as distinct openings', dedupResult2.uniqueCanonicalJobsCount === 2);

// 6. Seniority Safety Test: Junior vs Staff Must NOT Auto-Merge!
const jobJunior = {
  id: 'j5',
  title: 'Junior Frontend Developer',
  company: 'Meta',
  location: 'Remote'
};
const jobStaff = {
  id: 'j6',
  title: 'Staff Frontend Developer',
  company: 'Meta',
  location: 'Remote'
};

const dedupResult3 = deduplicateJobListings([jobJunior, jobStaff]);
assert('11. Different seniorities (Junior vs Staff) are kept separate', dedupResult3.uniqueCanonicalJobsCount === 2);

// 7. Multi-Factor Similarity and Provenance Audit
const jobDirect = {
  id: 'j7',
  title: 'Senior DevOps Engineer',
  company: 'Netflix',
  location: 'Remote',
  skills: ['AWS', 'Kubernetes', 'Terraform'],
  source: 'Netflix Careers'
};
const jobGlassdoor = {
  id: 'j8',
  title: 'Senior Cloud & DevOps Engineer',
  company: 'Netflix Inc.',
  location: 'Remote',
  skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
  source: 'Glassdoor'
};

const dedupResult4 = deduplicateJobListings([jobDirect, jobGlassdoor]);
assert('12. High similarity cross-posted listings auto-merge into canonical cluster', dedupResult4.uniqueCanonicalJobsCount === 1);
assert('13. Cluster retains non-destructive provenance sourceIds', dedupResult4.canonicalClusters[0].sourceIds.length === 2);
assert('14. Cluster records engine version and merge timestamp', dedupResult4.canonicalClusters[0].deduplicatorVersion === JOB_DEDUPLICATOR_VERSION && typeof dedupResult4.canonicalClusters[0].mergedAt === 'string');

console.log(`\n========================================`);
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
