// Test Suite for P0-3: Vendor-Inspired ATS Screener & 5-Point Quick Wins Engine
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const atsCode = fs.readFileSync(path.join(__dirname, '../src/lib/ats/atsScreener.ts'), 'utf8');
const compiled = ts.transpileModule(atsCode, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
});

const evalModule = { exports: {} };
const runner = new Function('module', 'exports', compiled.outputText);
runner(evalModule, evalModule.exports);

const {
  ATS_ENGINE_VERSION,
  ATS_LEGAL_DISCLAIMER,
  auditResumeATS,
  extractContacts,
  extractSections,
  extractSkills,
  analyzeBullets,
  evaluateLayoutRisk,
  calculateVendorProfiles,
} = evalModule.exports;

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

console.log(`🧪 Running PinIT Vendor-Inspired ATS Screener Test Suite (P0-3, ${ATS_ENGINE_VERSION})...\n`);

// Sample 1: High Quality SDE Resume
const strongResumeText = `
Alex Vance
alex.vance@example.com | (555) 234-5678 | San Francisco, CA
github.com/alexvance | linkedin.com/in/alexvance | alexvance.dev

TECHNICAL SKILLS
Languages: Python, Java, JavaScript, TypeScript, SQL, Go
Frameworks: React, Next.js, Node.js, Express, Spring Boot
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, GitHub Actions
Databases: PostgreSQL, Redis, MongoDB
Practices: System Design, REST APIs, GraphQL, Data Structures, Microservices

WORK EXPERIENCE
Software Engineer | Acme Tech Corp | 06/2023 - Present
• Architected distributed caching layer with Redis and PostgreSQL, reducing p99 API latency by 45% across 2.5M daily requests.
• Engineered automated CI/CD deployment pipeline using Docker and GitHub Actions, cutting release deployment cycle from 40 minutes to 6 minutes.
• Streamlined microservice communication via gRPC and REST APIs, boosting service throughput by 30%.

Full-Stack Developer Intern | Startup Nexus | 01/2022 - 05/2023
• Spearheaded frontend migration to Next.js and Tailwind CSS, improving Core Web Vitals performance score by 35%.
• Implemented OAuth2 authentication with JWT tokens, securing 50k+ active student accounts.

TECHNICAL PROJECTS
Distributed Task Queue Engine (Python, Redis, Docker)
• Built asynchronous task processor handling 10,000 tasks/second with automatic worker retry and zero message loss.

EDUCATION
Bachelor of Science in Computer Science | Stanford University | 2019 - 2023
`;

// 1. Benchmark Audit Test for Strong Resume
const strongAudit = auditResumeATS(strongResumeText, { targetRole: 'sde' });

assert('Strong resume achieves composite score >= 80', strongAudit.compositeScore >= 80, `Score was ${strongAudit.compositeScore}`);
assert('Greenhouse-inspired simulation score >= 80', strongAudit.vendorProfiles.greenhouseInspired >= 80);
assert('Lever-inspired simulation score >= 80', strongAudit.vendorProfiles.leverInspired >= 80);
assert('Workday-inspired simulation score >= 80', strongAudit.vendorProfiles.workdayInspired >= 80);
assert('Taleo-inspired simulation score >= 80', strongAudit.vendorProfiles.taleoInspired >= 80);
assert('iCIMS-inspired simulation score >= 80', strongAudit.vendorProfiles.icimsInspired >= 80);
assert('Ashby-inspired simulation score >= 80', strongAudit.vendorProfiles.ashbyInspired >= 80);
assert('All contacts extracted correctly', strongAudit.extractedProfile.contacts.email === 'alex.vance@example.com' && !!strongAudit.extractedProfile.contacts.github);
assert('All 5 standard sections detected', strongAudit.extractedProfile.sectionsDetected.length >= 4);
assert('Layout risk is Low for clean single-column format', strongAudit.extractedProfile.layoutRisk === 'Low');
assert('Legal disclaimer is included', strongAudit.disclaimer.includes('PinIT educational simulation'));

// 2. Poorly Formatted / Unquantified Resume Test
const weakResumeText = `
John Doe
No links provided

Stuff I Worked On
• Worked on web apps and helped with backend bugs.
• Responsible for frontend buttons and assisted team members.
• Handled database fixes.

Skills: Coding, Computers
`;

const weakAudit = auditResumeATS(weakResumeText, { targetRole: 'sde' });

assert('Weak resume receives composite score <= 60', weakAudit.compositeScore <= 60, `Score was ${weakAudit.compositeScore}`);
assert('Quick wins contains Quantify Achievements item', weakAudit.quickWins.some(w => w.category === 'impact'));
assert('Quick wins contains Missing Skills item', weakAudit.quickWins.some(w => w.category === 'skills'));
assert('Quick wins contains Section Header fix item', weakAudit.quickWins.some(w => w.category === 'structure'));
assert('Quick wins contains Contact Link fix item', weakAudit.quickWins.some(w => w.category === 'contact'));
assert('Quick wins contains Action Verb fix item', weakAudit.quickWins.some(w => w.category === 'formatting'));
assert('Quick wins contains exactly 5 prioritized items', weakAudit.quickWins.length === 5);

// 3. Multi-Column / Tabular Layout Risk Test
const tableHeavyResume = `
| Skills | Experience | Education |
| Python | Worked here | B.Tech |
| Java   | Built apps  | 2022   |
| Docker | Helped team | GPA 3.5|
| React  | Fixed bugs  | HighSchool|
| AWS    | Deployed    | College |
| SQL    | Managed DB  | Stanford|
| Git    | Reviewed    | Degree  |
| Node   | Ran scripts | Year 2020|
| CI/CD  | Configured  | Honors  |
`;

const tableLayoutResult = evaluateLayoutRisk(tableHeavyResume);
assert('High density of table pipe characters triggers layout risk', tableLayoutResult.layoutRisk === 'High' || tableLayoutResult.layoutRisk === 'Medium');

// 4. Job Description Aware Keyword Matching Test
const customJD = `
We are seeking a Backend Engineer with deep experience in Kafka, Kubernetes, Go, PostgreSQL, and Distributed Systems.
`;

const jdSkills = extractSkills(strongResumeText, 'backend', customJD);
assert('JD-aware matching identifies target skills from JD', jdSkills.matchedSkills.length > 0);
assert('JD-aware matching isolates missing JD skills (e.g. Kafka)', jdSkills.missingSkills.includes('Kafka'));

// 5. Safe handling of empty / null / edge case inputs
const emptyAudit = auditResumeATS('', { targetRole: 'sde' });
assert('Empty string input fails safe with valid composite score', typeof emptyAudit.compositeScore === 'number' && !isNaN(emptyAudit.compositeScore));
assert('Empty string quick wins has valid recommendations', emptyAudit.quickWins.length > 0);

console.log(`\n========================================`);
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
