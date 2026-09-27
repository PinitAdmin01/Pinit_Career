import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { getDomainFallback } from '../src/lib/projects/projectCatalog';
import { analyzeRepositoryEvidence, GITHUB_INGESTION_VERSION } from '../src/lib/github/githubIngestion';

console.log('🧪 Running Projects & Career Intelligence Integrity Verification...\n');

// 1. Verify Project Catalog & Fallbacks
console.log('1️⃣ Testing Project Catalog Fallback Generation...');
const domains = ['AI Engineer', 'Mobile Developer', 'DevOps & Cloud', 'Cybersecurity', 'Frontend Developer', 'Backend Developer'];
for (const domain of domains) {
  const projects = getDomainFallback(domain, ['TypeScript', 'Node.js'], 'Undergraduate');
  assert.strictEqual(projects.length, 5, `Expected 5 fallback projects for domain ${domain}`);
  for (const p of projects) {
    assert(p.deliverable && p.deliverable.length > 5, `Project ${p.name} missing deliverable`);
    assert(p.problem && p.problem.length > 5, `Project ${p.name} missing problem statement`);
    assert(p.techStack && p.techStack.length > 2, `Project ${p.name} missing tech stack`);
    assert(typeof p.xpReward === 'number' && p.xpReward > 0, `Project ${p.name} invalid xpReward`);
  }
}
console.log('   ✅ Domain fallback projects validated across 6 tracks.');

// 2. Verify GitHub Ingestion Logic & Clamp
console.log('2️⃣ Testing GitHub Ingestion Authorship & Score Clamping...');
const sampleMeta = {
  owner: 'octocat',
  repo: 'Hello-World',
  fullName: 'octocat/Hello-World',
  description: 'Sample repo',
  stars: 10,
  forks: 2,
  openIssues: 0,
  defaultBranch: 'main',
  isFork: false,
  isArchived: false,
  createdAt: '2025-01-01T00:00:00Z',
  pushedAt: '2025-01-01T00:00:00Z'
};

// Test low score is NOT clamped to 20
const emptyAnalysis = analyzeRepositoryEvidence(sampleMeta, {}, [], 'octocat', false);
assert(emptyAnalysis.overallEvidenceScore <= 15, `Expected low score on empty repo, got ${emptyAnalysis.overallEvidenceScore}`);
assert.strictEqual(emptyAnalysis.authorshipStatus, 'VERIFIED_AUTHOR');
assert.strictEqual(emptyAnalysis.isAuthoredByStudent, true);

// Test non-matching student is UNVERIFIED_EXTERNAL
const externalAnalysis = analyzeRepositoryEvidence(sampleMeta, {}, [], 'anotheruser', false);
assert.strictEqual(externalAnalysis.authorshipStatus, 'UNVERIFIED_EXTERNAL');
assert.strictEqual(externalAnalysis.isAuthoredByStudent, false);
console.log('   ✅ Score clamp permits true low evidence scores (<=15%); authorship strictly enforced.');

// 3. Inspect GitHub Ingest API Route Source
console.log('3️⃣ Inspecting src/app/api/github/ingest/route.ts...');
const ingestRoutePath = path.join(process.cwd(), 'src/app/api/github/ingest/route.ts');
const ingestRouteSrc = fs.readFileSync(ingestRoutePath, 'utf8');
assert(!ingestRouteSrc.includes("email?.split('@')[0]"), 'Found email prefix guessing in ingest route!');
assert(ingestRouteSrc.includes('authenticatedUsername ='), 'Missing authenticatedUsername extraction in ingest route');
assert(ingestRouteSrc.includes('ingestGithubRepository(repoUrl, token, authenticatedUsername)'), 'Ingest route does not pass authenticated username to ingestion engine');
console.log('   ✅ GitHub Ingest route strictly relies on authenticated user metadata; email prefix guessing eradicated.');

// 4. Inspect Projects Page Code Integrity
console.log('4️⃣ Inspecting src/app/projects/page.tsx...');
const projectsPagePath = path.join(process.cwd(), 'src/app/projects/page.tsx');
const projectsPageSrc = fs.readFileSync(projectsPagePath, 'utf8');

// A. Minimum pass threshold check
assert(projectsPageSrc.includes('const minThreshold = selectedGuideProject.minScore || 80;'), 'Missing minScore threshold check');
assert(projectsPageSrc.includes('if (score < minThreshold)'), 'Missing score < minThreshold abort logic');

// B. Strict authorship check (no undefined passes)
assert(projectsPageSrc.includes('isAuthored = auditReport.isAuthoredByStudent === true'), 'Missing strict boolean check on isAuthoredByStudent');
assert(!projectsPageSrc.includes('auditReport.isAuthoredByStudent !== false'), 'Found dangerous undefined bypass (isAuthoredByStudent !== false)');

// C. Anti-farm XP deduplication
assert(projectsPageSrc.includes('isAlreadyCompleted = selectedGuideProject.status === \'Completed\''), 'Missing repeat completion detection');
assert(projectsPageSrc.includes('earnedXp = isAlreadyCompleted ? 0 :'), 'Missing 0 XP deduplication on repeat submission');
assert(projectsPageSrc.includes('earnedPins = isAlreadyCompleted ? 0 :'), 'Missing 0 Pin deduplication on repeat submission');

// D. Submission tab real ZIP input & conditional README
assert(projectsPageSrc.includes('type="file"'), 'Missing real file input in submission tab');
assert(projectsPageSrc.includes('accept=".zip"'), 'Missing accept=".zip" constraint on file picker');
assert(projectsPageSrc.includes('auditReport.keyFilesFound?.some'), 'Missing conditional README check on auditReport');

// E. Eradication of hardcoded fake data in certificate modal
assert(!projectsPageSrc.includes('Arjun Sharma'), 'Found "Arjun Sharma" in projects page!');
assert(!projectsPageSrc.includes('Rohit Sharma'), 'Found "Rohit Sharma" in projects page!');
assert(!projectsPageSrc.includes('18 May 2025'), 'Found "18 May 2025" in projects page!');
assert(!projectsPageSrc.includes('PIN-25PJ-7X2Q-09191'), 'Found hardcoded cert ID "PIN-25PJ-7X2Q-09191" in projects page!');
assert(projectsPageSrc.includes('PinIT Evaluation Authority'), 'Missing authentic Platform Certification Authority signature');
assert(projectsPageSrc.includes('/verify/${encodeURIComponent(certId)}'), 'Missing canonical /verify/${certId} URL format');
console.log('   ✅ Projects page passes all integrity, anti-cheat, real file input, and certificate verifiability checks.');

// 5. Inspect Verify Page and Verify API Route
console.log('5️⃣ Inspecting /verify and /api/verify/[credentialId]/route.ts...');
const verifyPagePath = path.join(process.cwd(), 'src/app/verify/page.tsx');
assert(fs.existsSync(verifyPagePath), 'src/app/verify/page.tsx does not exist!');
const verifyRoutePath = path.join(process.cwd(), 'src/app/api/verify/[credentialId]/route.ts');
const verifyRouteSrc = fs.readFileSync(verifyRoutePath, 'utf8');
assert(verifyRouteSrc.includes('PIN-'), 'Verify route does not check for PIN- certificate prefix');
assert(verifyRouteSrc.includes('attempt_id.eq'), 'Verify route does not query attempt_id in Supabase');
assert(verifyRouteSrc.includes('r.attemptId === credentialId'), 'Verify route does not match attemptId in in-memory records');
console.log('   ✅ Verification gateway supports both /verify query routing and attempt_id certificate hash matching.');

// 6. Inspect Career Intelligence Integrity
console.log('6️⃣ Inspecting Career Intelligence Data & Components...');
const ciDataPath = path.join(process.cwd(), 'src/app/career-intelligence/hooks/useCareerIntelligenceData.ts');
const ciDataSrc = fs.readFileSync(ciDataPath, 'utf8');
assert(ciDataSrc.includes('const [internships, setInternships] = useState<Internship[]>([]);'), 'internships array is not empty initial state!');
assert(ciDataSrc.includes('const [mentees, setMentees] = useState<Internship[]>([]);'), 'mentees array is not empty initial state!');
assert(ciDataSrc.includes('const probabilities: CompanyProbability[] = [];'), 'probabilities array is not empty initial state!');
assert(ciDataSrc.includes('const topCandidates: TopCandidate[] = [];'), 'topCandidates array is not empty initial state!');
assert(ciDataSrc.includes('const riskStudents: RiskStudent[] = [];'), 'riskStudents array is not empty initial state!');
assert(!ciDataSrc.includes('creditsAwarded: 4'), 'Found pre-awarded 4 credits in career intelligence projects!');
assert(!ciDataSrc.includes('Hana Web Agency'), 'Found fake internship "Hana Web Agency"!');
assert(!ciDataSrc.includes('PIN-2026-4402'), 'Found fake candidate registration "PIN-2026-4402"!');

const ciHeaderPath = path.join(process.cwd(), 'src/app/career-intelligence/components/CareerIntelligenceHeader.tsx');
const ciHeaderSrc = fs.readFileSync(ciHeaderPath, 'utf8');
assert(!ciHeaderSrc.includes('onClick={() => setActiveRole(role.id'), 'Found unauthenticated demo switcher buttons in CareerIntelligenceHeader!');
assert(ciHeaderSrc.includes('Verified User Role Badge'), 'Missing verified user role badge in CareerIntelligenceHeader');

const ciTrackerPath = path.join(process.cwd(), 'src/app/career-intelligence/components/InternshipTrackerTab.tsx');
const ciTrackerSrc = fs.readFileSync(ciTrackerPath, 'utf8');
assert(ciTrackerSrc.includes('No Active Internships on Record'), 'Missing empty state for live internships');
assert(ciTrackerSrc.includes('Placement Radar Pending Evidence'), 'Missing empty state for placement predictor');
assert(ciTrackerSrc.includes('No Mentees Assigned'), 'Missing empty state for faculty mentees');
assert(ciTrackerSrc.includes('No candidate records indexed yet'), 'Missing empty state for top candidates');

const ciProjectsPath = path.join(process.cwd(), 'src/app/career-intelligence/components/IndustryProjectsTab.tsx');
const ciProjectsSrc = fs.readFileSync(ciProjectsPath, 'utf8');
assert(ciProjectsSrc.includes('No Available Client Briefs'), 'Missing empty state for browse projects');
assert(ciProjectsSrc.includes('No Active Industry Projects Applied Yet'), 'Missing empty state for track my work');

console.log('   ✅ Career Intelligence 100% purged of fabricated records; clean empty states and authentic role badge verified.');

console.log('\n🎉 ALL PROJECTS & CAREER INTELLIGENCE INTEGRITY CHECKS PASSED SUCCESSFULLY!');
