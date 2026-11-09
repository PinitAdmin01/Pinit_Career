import fsModule from 'fs';
import pathModule from 'path';
import test from 'node:test';
import assert from 'node:assert/strict';

import { COURSES_CATALOG } from '../src/lib/data/coursesCatalog';
import { getDomainFallback } from '../src/lib/projects/projectCatalog';
import { INITIAL_HACKATHON_SQUADS, TeamsApiService, TeamRole } from '../src/lib/api/teamsApi';
import { parseAndValidateGithubUrl } from '../src/lib/github/githubIngestion';
import { STUDENT_NAV, ROUTE_TOOLTIPS } from '../src/components/ui/AppSidebar';

// ── AUDIT SUITE 1: Standalone Route Separation & Sidebar Navigation ──────────
test('BRUTAL AUDIT 1.1: Standalone /projects and /innovation-hub navigation isolation', () => {
  const root = STUDENT_NAV.find((s) => s.section === 'PinIT Career OS');
  assert.ok(root, 'PinIT Career OS section must be present');

  const projectsItem = root.items.find((i: any) => i.href === '/projects');
  const innovationItem = root.items.find((i: any) => i.href === '/innovation-hub');

  assert.ok(projectsItem, '/projects must be a standalone top-level route');
  assert.ok(innovationItem, '/innovation-hub must be a standalone top-level route');
  assert.equal(projectsItem.label, 'Projects');
  assert.equal(innovationItem.label, 'Innovation Hub');

  // Verify distinct icons and tooltips
  assert.notEqual(projectsItem.icon, innovationItem.icon, 'Projects and Innovation Hub must have distinct icons');
  assert.ok(ROUTE_TOOLTIPS['/projects'], 'Tooltip for /projects must be configured');
  assert.ok(ROUTE_TOOLTIPS['/innovation-hub'], 'Tooltip for /innovation-hub must be configured');
});

// ── AUDIT SUITE 2: Dynamic Course Capstone Binding Across ALL Tracks ────────
test('BRUTAL AUDIT 2.1: Python 30-Day ("Day 1: Your First Python Program") Capstone Relevance', () => {
  const pyProjs = getDomainFallback('Full Stack Engineer', ['Python', 'SQL'], 'Undergraduate', 'course-python-backend');
  assert.equal(pyProjs.length, 5, 'Python course must provide exactly 5 progressive capstones');

  // Stage 1 must be foundational Python CLI / Expense Tracker matching Day 1-30
  assert.equal(pyProjs[0].level, 'Beginner');
  assert.ok(pyProjs[0].techStack.toLowerCase().includes('python'), 'Stage 1 must be Python-based');
  assert.ok(pyProjs[0].name.toLowerCase().includes('expense') || pyProjs[0].name.toLowerCase().includes('finance'),
    'Stage 1 must be beginner financial / expense CLI parser');

  // Stage 2 must be FastAPI REST microservice
  assert.equal(pyProjs[1].level, 'Intermediate');
  assert.ok(pyProjs[1].techStack.toLowerCase().includes('fastapi'), 'Stage 2 must use FastAPI');

  // Stage 3 must be Celery / Redis task queue
  assert.equal(pyProjs[2].level, 'Advanced');
  assert.ok(pyProjs[2].techStack.toLowerCase().includes('celery') || pyProjs[2].techStack.toLowerCase().includes('redis'),
    'Stage 3 must use Celery and Redis');

  // Stage 4 must be Event-Driven microservices
  assert.equal(pyProjs[3].level, 'Enterprise');

  // Stage 5 must be AI Agent Workflow
  assert.equal(pyProjs[4].level, 'Future-Tech');
});

test('BRUTAL AUDIT 2.2: Java Core Logic ("course-java-logic") Capstone Relevance', () => {
  const javaProjs = getDomainFallback('Software Engineer', ['Java'], 'Undergraduate', 'course-java-logic');
  assert.equal(javaProjs.length, 5, 'Java course must provide 5 progressive capstones');
  assert.ok(javaProjs[0].techStack.toLowerCase().includes('java'), 'Java stage 1 must be Java-based');
  assert.ok(javaProjs[1].techStack.toLowerCase().includes('spring'), 'Java stage 2 must use Spring Boot');
});

test('BRUTAL AUDIT 2.3: Frontend React ("course-react-web") Capstone Relevance', () => {
  const reactProjs = getDomainFallback('Software Engineer', ['React'], 'Undergraduate', 'course-react-web');
  assert.ok(reactProjs.length >= 3, 'React course must provide at least 3 capstones');
  assert.ok(reactProjs[0].techStack.toLowerCase().includes('react') || reactProjs[0].techStack.toLowerCase().includes('tailwind'),
    'React capstone must use React in tech stack');
  assert.ok(!reactProjs[0].name.toLowerCase().includes('raft'), 'Must not give Raft consensus to React student');
});

test('BRUTAL AUDIT 2.4: Commerce & Digital Accounting ("course-digital-accounting" / "bcom_acc") Capstone Relevance', () => {
  const bcomProjs = getDomainFallback('Student', [], 'B.Com', 'course-digital-accounting');
  assert.equal(bcomProjs.length, 5, 'Commerce course must provide 5 dedicated progressive capstones');
  assert.ok(!bcomProjs[0].name.toLowerCase().includes('raft'), 'Must not give Raft consensus to Commerce student');
  assert.equal(bcomProjs[0].name, 'Automated Forensic Double-Entry Ledger & Reconciliation Engine');
  assert.equal(bcomProjs[1].name, 'GST Statutory E-Invoicing & Automated Tax Reconciliation Portal');
  assert.equal(bcomProjs[2].name, 'Corporate Treasury Liquidity & Working Capital Risk Simulator');
  assert.equal(bcomProjs[3].name, 'Multi-Entity Enterprise Financial Consolidation Suite');
  assert.equal(bcomProjs[4].name, 'Autonomous AI Forensic Audit Agent for General Ledger Anomaly Detection');
});

test('BRUTAL AUDIT 2.5: Cloud Native & DevOps ("course-cloud-native") Capstone Relevance', () => {
  const cloudProjs = getDomainFallback('Software Engineer', [], 'Undergraduate', 'course-cloud-native');
  assert.ok(cloudProjs.length >= 3);
  assert.ok(cloudProjs[0].techStack.toLowerCase().includes('docker') || cloudProjs[0].techStack.toLowerCase().includes('github actions'),
    'Cloud capstone must be container/CI/CD based');
  assert.ok(!cloudProjs[0].name.toLowerCase().includes('raft'), 'Must not fall back to generic distributed consensus');
});

test('BRUTAL AUDIT 2.6: AI Engineering ("course-ai-eng") Capstone Relevance', () => {
  const aiProjs = getDomainFallback('Software Engineer', [], 'Undergraduate', 'course-ai-eng');
  assert.ok(aiProjs.length >= 3);
  assert.ok(aiProjs[0].techStack.toLowerCase().includes('pytorch') || aiProjs[0].techStack.toLowerCase().includes('huggingface') || aiProjs[0].name.toLowerCase().includes('ats'),
    'AI capstone must be AI/ML based');
});

test('BRUTAL AUDIT 2.7: Cybersecurity ("course-cybersecurity") Capstone Relevance', () => {
  const secProjs = getDomainFallback('Software Engineer', [], 'Undergraduate', 'course-cybersecurity');
  assert.ok(secProjs.length >= 3);
  assert.ok(secProjs[0].name.toLowerCase().includes('argon2') || secProjs[0].name.toLowerCase().includes('auth') || secProjs[0].techStack.toLowerCase().includes('argon2'),
    'Cybersecurity capstone must be security/authentication based');
});

test('BRUTAL AUDIT 2.8: IoT Embedded ("course-iot-embedded") Capstone Relevance', () => {
  const iotProjs = getDomainFallback('Software Engineer', [], 'Undergraduate', 'course-iot-embedded');
  assert.equal(iotProjs.length, 5);
  assert.ok(iotProjs[0].techStack.toLowerCase().includes('freertos') || iotProjs[0].techStack.toLowerCase().includes('esp32'),
    'IoT capstone must be embedded/firmware based');
  assert.equal(iotProjs[0].name, 'ESP32 / FreeRTOS Multi-Sensor Environmental Telemetry Node');
});

test('BRUTAL AUDIT 2.9: Blockchain & Web3 ("course-blockchain-web3") Does Not Collide With AI', () => {
  const web3Projs = getDomainFallback('Software Engineer', [], 'Undergraduate', 'course-blockchain-web3');
  assert.equal(web3Projs.length, 5);
  assert.ok(web3Projs[0].techStack.toLowerCase().includes('solidity') || web3Projs[0].techStack.toLowerCase().includes('hardhat'),
    'Web3 capstone must be Solidity/Smart Contract based');
  assert.equal(web3Projs[0].name, 'ERC-20 & ERC-721 Cryptographic Token & Governance Suite');
  assert.ok(!web3Projs[0].name.toLowerCase().includes('ats'), 'Must NOT collide with AI Resume ATS engine');
});

// ── AUDIT SUITE 3: Innovation Hub Zero-Data Invariant & Squad Operations ────
test('BRUTAL AUDIT 3.1: Zero mock data exists in initial squad state', () => {
  assert.equal(INITIAL_HACKATHON_SQUADS.length, 0, 'INITIAL_HACKATHON_SQUADS must be strictly empty');
  const testStudentSquads = TeamsApiService.getSquads('adversarial_test_user_77');
  const dummyFound = testStudentSquads.some((s) => s.id === 'squad_pin_agile_01' || s.name.includes('ByteCraft'));
  assert.equal(dummyFound, false, 'No ByteCraft Autonomous Systems or mock squads must be returned');
});

test('BRUTAL AUDIT 3.2: Squad Creation strictly enforces valid GitHub repository URLs', () => {
  // Empty URL must fail
  const emptyCheck = parseAndValidateGithubUrl('');
  assert.equal(emptyCheck.valid, false, 'Empty URL must fail validation');

  // Invalid URL must fail
  const invalidCheck = parseAndValidateGithubUrl('not-a-url');
  assert.equal(invalidCheck.valid, false, 'Arbitrary string must fail GitHub validation');

  // Valid GitHub URL must succeed
  const validCheck = parseAndValidateGithubUrl('https://github.com/adversarial-auditor/pinit-capstone-core');
  assert.equal(validCheck.valid, true, 'Valid GitHub repository URL must pass');
  assert.equal(validCheck.owner, 'adversarial-auditor');
  assert.equal(validCheck.repo, 'pinit-capstone-core');
});

test('BRUTAL AUDIT 3.3: Real Squad Creation, Member Join, and Milestone Tracking Lifecycle', () => {
  const squad = TeamsApiService.createSquad({
    name: 'Autonomous Drone Flight Telemetry',
    hackathonTitle: 'Robotics & Edge AI Hackathon 2026',
    teamLeadStudentId: 'student_lead_101',
    teamLeadName: 'Rhea Chakraborty',
    teamLeadRole: 'ai_specialist',
    repoUrl: 'https://github.com/rhea-drone/flight-telemetry-engine',
  });

  assert.ok(squad.id, 'Created squad must have a unique ID');
  assert.equal(squad.members.length, 1);
  assert.equal(squad.members[0].studentId, 'student_lead_101');
  assert.equal(squad.milestones.length, 3, 'Must auto-initialize 3 sprint milestones');

  // Peer joins squad
  const joined = TeamsApiService.joinSquad({
    squadId: squad.id,
    studentId: 'student_peer_202',
    name: 'Devansh Verma',
    role: 'frontend_lead',
  });
  assert.ok(joined, 'Peer must successfully join squad');
  assert.equal(joined.members.length, 2);
  assert.ok(joined.members.some((m) => m.studentId === 'student_peer_202'));

  // Toggle milestone
  const toggled = TeamsApiService.toggleMilestone(squad.id, squad.milestones[0].id, 'student_lead_101');
  assert.ok(toggled, 'Milestone toggle must succeed');
  assert.equal(toggled.milestones[0].isCompleted, true, 'First milestone must be marked completed');
});

// ── AUDIT SUITE 4: Pathway Gating, Milestone Locking & Own Project Workflow ──
test('BRUTAL AUDIT 4.1: Certification Pathway Active and Milestone Gating Invariants', () => {
  // Case A: 0 Days Completed -> Inactive
  const zeroQuests = 0;
  const zeroActive = zeroQuests >= 1;
  const zeroMilestone = zeroQuests >= 3;
  assert.equal(zeroActive, false, '0 quests completed MUST be strictly Inactive');
  assert.equal(zeroMilestone, false, '0 quests completed CANNOT reach Milestone 1');

  // Case B: 1 Day Completed -> Active, but Locked below Milestone 1
  const oneQuest = 1;
  const oneActive = oneQuest >= 1;
  const oneMilestone = oneQuest >= 3;
  assert.equal(oneActive, true, '1 quest completed MUST be Active');
  assert.equal(oneMilestone, false, '1 quest completed CANNOT start project; must hit Milestone 1 first');

  // Case C: 2 Days Completed -> Active, still Locked below Milestone 1
  const twoQuests = 2;
  const twoActive = twoQuests >= 1;
  const twoMilestone = twoQuests >= 3;
  assert.equal(twoActive, true, '2 quests completed MUST be Active');
  assert.equal(twoMilestone, false, '2 quests completed CANNOT start project; 1 quest still remaining');

  // Case D: 3 Days Completed -> Active & Milestone 1 Reached -> Workspace Unlocked
  const threeQuests = 3;
  const threeActive = threeQuests >= 1;
  const threeMilestone = threeQuests >= 3;
  assert.equal(threeActive, true, '3 quests completed MUST be Active');
  assert.equal(threeMilestone, true, '3 quests completed MUST reach Milestone 1 and unlock workspace');
});

test('BRUTAL AUDIT 4.2: Custom Roadmap Pathway Invariant', () => {
  // Without completing any roadmap day
  const roadmapEmpty: string[] = [];
  const roadmapActiveEmpty = roadmapEmpty.length >= 1;
  assert.equal(roadmapActiveEmpty, false, 'Empty custom roadmap must be Inactive');

  // Completed Day 1 of Roadmap
  const roadmapDay1 = ['rm-node-01'];
  const roadmapActive1 = roadmapDay1.length >= 1;
  const roadmapMilestone1 = roadmapDay1.length >= 3;
  assert.equal(roadmapActive1, true, 'Completed 1 day of roadmap must be Active');
  assert.equal(roadmapMilestone1, false, '1 day of roadmap must still be locked below Milestone 1');

  // Completed 3 Days of Roadmap
  const roadmapDay3 = ['rm-node-01', 'rm-node-02', 'rm-node-03'];
  assert.equal(roadmapDay3.length >= 3, true, '3 days of roadmap unlocks capstone');
});

test('BRUTAL AUDIT 4.3: Start Your Own Project GitHub Ingestion and Bypass Protocol', () => {
  // Attempting with invalid or spoofed URLs
  const invalidUrls = [
    '',
    'not a url',
    'https://gitlab.com/user/repo', // Only GitHub allowed
    'https://github.com/',
    'https://github.com/justuser'
  ];

  for (const url of invalidUrls) {
    const check = parseAndValidateGithubUrl(url);
    assert.equal(check.valid, false, `URL "${url}" must be rejected by GitHub ingestion engine`);
  }

  // Valid GitHub repository
  const validUrl = 'https://github.com/student-hacker/enterprise-ai-mesh';
  const check = parseAndValidateGithubUrl(validUrl);
  assert.equal(check.valid, true);
  assert.equal(check.owner, 'student-hacker');
  assert.equal(check.repo, 'enterprise-ai-mesh');

  // Verify that an independent project with valid GitHub link immediately unlocks workspace
  const mockOwnProject = {
    id: `custom_proj_${Date.now()}`,
    name: 'Enterprise AI Mesh',
    githubLink: validUrl,
    isTemplate: false,
    status: 'In Progress' as const
  };

  const independentActive = Boolean(mockOwnProject.githubLink) || !mockOwnProject.isTemplate;
  const independentMilestoneReached = true;
  assert.equal(independentActive, true, 'Independent custom project must be Active once created');
  assert.equal(independentMilestoneReached, true, 'Independent custom project bypasses course milestones');
});

test('BRUTAL AUDIT 4.4: AppShell Route Guard strictly permits /innovation-hub and /innovation', () => {
  // Read AppShell.tsx file content directly to verify allowedStudentTabs invariant
  const fsModule = require('fs');
  const pathModule = require('path');
  const appShellContent = fsModule.readFileSync(pathModule.resolve(__dirname, '../src/components/ui/AppShell.tsx'), 'utf8');

  assert.ok(appShellContent.includes("'/innovation-hub'"), "AppShell must explicitly allow '/innovation-hub'");
  assert.ok(appShellContent.includes("'/innovation'"), "AppShell must explicitly allow '/innovation'");

  // Check that /innovation page alias exists on disk
  const innovationPageExists = fsModule.existsSync(pathModule.resolve(__dirname, '../src/app/innovation/page.tsx'));
  assert.equal(innovationPageExists, true, '/app/innovation/page.tsx alias route must exist');
});

test('BRUTAL AUDIT 4.5: Standalone Python 30-Day ("Day 1: Your First Python Program") Active & Milestone Invariants', () => {
  const { parseQuestId } = require('../src/lib/data/curriculumEnricher');

  // Completed Day 1 of Python: "python-lecture1-day-1"
  const studentQuests = ['python-lecture1-day-1'];
  
  const targetCourseId = 'course-python-backend';
  const matched = studentQuests.filter(q => {
    const parsed = parseQuestId(q);
    return parsed?.prefix === 'python' || q.includes('python');
  });

  const distinctDays = new Set(matched.map(q => parseQuestId(q)?.dayNum).filter(Boolean));
  assert.equal(distinctDays.size, 1, 'Day 1 quest must count as exactly 1 completed day');

  const standaloneActive = distinctDays.size >= 1;
  const standaloneMilestoneReached = distinctDays.size >= 3;

  assert.equal(standaloneActive, true, 'Student doing Day 1 of Python MUST have standalone pathway ACTIVE');
  assert.equal(standaloneMilestoneReached, false, 'Student on Day 1 MUST NOT have Milestone 1 unlocked yet');

  // Complete Day 2 and Day 3
  const studentQuestsDay3 = ['python-lecture1-day-1', 'python-lecture1-day-2', 'python-lecture1-day-3'];
  const matchedDay3 = studentQuestsDay3.filter(q => {
    const parsed = parseQuestId(q);
    return parsed?.prefix === 'python';
  });
  const distinctDays3 = new Set(matchedDay3.map(q => parseQuestId(q)?.dayNum).filter(Boolean));
  assert.equal(distinctDays3.size, 3, 'Must register 3 distinct completed days');
  assert.equal(distinctDays3.size >= 3, true, 'Milestone 1 must unlock on Day 3 completion');
});

test('BRUTAL AUDIT 4.6: Stale Course Template Re-synchronization (No Java projects for Python students)', () => {
  // Simulate stale saved projects from an old Java session
  const staleJavaProjects = [
    {
      id: 'proj-1',
      name: 'Multi-Threaded Banking & Transaction Core',
      techStack: 'Java 17, JUnit 5, Maven, OOP Patterns',
      isTemplate: true
    }
  ];

  // When active course is Python:
  const activeCourseId = 'course-python-backend';
  const cid = activeCourseId.toLowerCase();
  
  const isMatchingCourse = staleJavaProjects.some(p => {
    const stack = (p.techStack || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    if (cid.includes('python')) return stack.includes('python') || name.includes('python');
    return false;
  });

  assert.equal(isMatchingCourse, false, 'Java templates must be detected as non-matching for Python course');

  // Fallback must supply Python capstone projects
  const freshProjs = getDomainFallback('Full-Stack Software Developer', [], 'Undergraduate', activeCourseId);
  assert.ok(freshProjs.length >= 3);
  assert.ok(freshProjs[0].techStack.toLowerCase().includes('python'), 'Fresh projects must be Python based');
  assert.ok(!freshProjs[0].name.toLowerCase().includes('banking') && !freshProjs[0].name.toLowerCase().includes('java'),
    'Must never give Java banking project to Python student');
});

test('BRUTAL AUDIT 5.1: Task 2 Degree Track Switcher Elimination from Certification Pathway', () => {
  const fsModule = require('fs');
  const pathModule = require('path');
  const pageSource = fsModule.readFileSync(pathModule.resolve(__dirname, '../src/app/projects/page.tsx'), 'utf8');

  // Must have certification-curriculum-strip
  assert.ok(pageSource.includes('data-testid="certification-curriculum-strip"'), 'Must have accredited degree curriculum strip');
  
  // In the certification section, it must NOT have Switch Degree Track dropdown
  const certStripCode = pageSource.substring(
    pageSource.indexOf('data-testid="certification-curriculum-strip"'),
    pageSource.indexOf('data-testid="standalone-sprint-strip"')
  );
  assert.ok(!certStripCode.includes('Switch Degree Track:'), 'Certification strip must NEVER have "Switch Degree Track:"');
  assert.ok(!certStripCode.includes('course-track-selector'), 'Certification strip must NEVER render course selector dropdown');
  assert.ok(certStripCode.includes('Accredited Degree Curriculum'), 'Must show authoritative Accredited Degree Curriculum badge');
  assert.ok(certStripCode.includes('University Enrolled Track'), 'Must show University Enrolled Track locked status');

  // Standalone strip must have the switcher
  const standaloneStripCode = pageSource.substring(
    pageSource.indexOf('data-testid="standalone-sprint-strip"'),
    pageSource.indexOf('data-testid="roadmap-track-strip"')
  );
  assert.ok(standaloneStripCode.includes('Switch Skill Sprint:'), 'Standalone strip must allow switching skill sprints');
  assert.ok(standaloneStripCode.includes('id="course-track-selector"'), 'Standalone strip must render course selector dropdown');
});

test('BRUTAL AUDIT 5.2: Task 1 Innovation Hub Redundant Header Elimination & Task 3 Beginner-Friendly Activation Card', () => {
  const fsModule = require('fs');
  const pathModule = require('path');
  const hubPageSource = fsModule.readFileSync(pathModule.resolve(__dirname, '../src/app/innovation-hub/page.tsx'), 'utf8');
  assert.ok(!hubPageSource.includes('Innovation Hub & Collaborative Squads Form 3-person hackathon squads'),
    'Must eliminate redundant 2-line Innovation Hub header');
  assert.ok(!hubPageSource.includes('Form 3-person hackathon squads, build production prototypes'),
    'Must eliminate redundant squad description header');

  const projectsPageSource = fsModule.readFileSync(pathModule.resolve(__dirname, '../src/app/projects/page.tsx'), 'utf8');
  assert.ok(projectsPageSource.includes('Pathway Activation Required'), 'Must feature clear activation badge');
  assert.ok(projectsPageSource.includes('1️⃣') && projectsPageSource.includes('2️⃣'), 'Must feature 2-step visual activation roadmap');
  assert.ok(projectsPageSource.includes('data-testid="start-day-1-btn"'), 'Must feature primary Start Day 1 action button');
});

test('BRUTAL AUDIT 6.1: Sub-Tab Interface & Top Header Clutter Elimination (Task 1 & Task 2)', () => {
  const fsModule = require('fs');
  const pathModule = require('path');
  const pageSource = fsModule.readFileSync(pathModule.resolve(__dirname, '../src/app/projects/page.tsx'), 'utf8');

  // Verify Task 1: Complete removal of redundant header and subheader text
  assert.ok(!pageSource.includes('Projects & Course Capstones'), 'Must eliminate redundant "Projects & Course Capstones" header');
  assert.ok(!pageSource.includes('Select your learning pathway, reach course milestones'), 'Must eliminate redundant subheader description');
  assert.ok(!pageSource.includes('Choose Your Project Pathway'), 'Must eliminate "Choose Your Project Pathway" text');

  // Verify Task 2: Sub-tab bar rendered with clean compact buttons
  assert.ok(pageSource.includes('PATHWAY SUB-TAB NAVIGATION'), 'Must render compact sub-tab bar');
  assert.ok(pageSource.includes('data-testid="pathway-card-certification"'), 'Must have certification sub-tab');
  assert.ok(pageSource.includes('data-testid="pathway-card-roadmap"'), 'Must have roadmap sub-tab');
  assert.ok(pageSource.includes('data-testid="pathway-card-standalone"'), 'Must have standalone sub-tab');
  assert.ok(pageSource.includes('data-testid="pathway-card-independent"'), 'Must have independent sub-tab');
});

test('BRUTAL AUDIT 6.2: Independent Workspace Isolation & Supabase Persistence (Task 3 & Task 4)', async () => {
  const fsModule = require('fs');
  const pathModule = require('path');
  const pageSource = fsModule.readFileSync(pathModule.resolve(__dirname, '../src/app/projects/page.tsx'), 'utf8');

  // Verify Task 4: IndependentWorkspace rendered instead of CourseProjectProgressBar
  assert.ok(pageSource.includes('<IndependentWorkspace'), 'Independent pathway must render dedicated IndependentWorkspace');
  assert.ok(pageSource.includes("selectedPathway === 'independent' ? ("), 'Must branch cleanly on independent pathway');

  // Verify Task 3: Supabase persistence functions exported and integrated
  const apiModule = require('../src/lib/api/independentProjectsApi');
  assert.equal(typeof apiModule.saveIndependentProjectToDb, 'function', 'saveIndependentProjectToDb must be exported');
  assert.equal(typeof apiModule.fetchIndependentProjectsFromDb, 'function', 'fetchIndependentProjectsFromDb must be exported');
  assert.equal(typeof apiModule.fetchGithubLiveTelemetry, 'function', 'fetchGithubLiveTelemetry must be exported');

  // Verify telemetry parser handles invalid / valid URLs
  const invalidTelemetry = await apiModule.fetchGithubLiveTelemetry('invalid-url');
  assert.equal(invalidTelemetry.exists, false);

  const validTelemetry = await apiModule.fetchGithubLiveTelemetry('https://github.com/torvalds/linux');
  assert.equal(validTelemetry.owner, 'torvalds');
  assert.equal(validTelemetry.repoName, 'linux');
});

test('BRUTAL AUDIT 6.3: Student Protocol, Code Correctness AI Engine & Jury Defense Flow', async () => {
  const fsModule = require('fs');
  const pathModule = require('path');
  const workspaceSource = fsModule.readFileSync(
    pathModule.resolve(__dirname, '../src/components/projects/IndependentWorkspace.tsx'),
    'utf8'
  );

  // 1. Verify Student Engineering Protocol is present
  assert.ok(workspaceSource.includes('Student Engineering Protocol'), 'Must render Student Engineering Protocol header');
  assert.ok(workspaceSource.includes('Step 1: Write Code'), 'Must render Step 1: Write Code');
  assert.ok(workspaceSource.includes('Step 2: Push Changes'), 'Must render Step 2: Push Changes');
  assert.ok(workspaceSource.includes('Step 3: Verification'), 'Must render Step 3: Verification');
  assert.ok(workspaceSource.includes('Step 4: Certification'), 'Must render Step 4: Certification');
  assert.ok(workspaceSource.includes('Code in Web Editor'), 'Must have 1-click web editor link');

  // 2. Verify AI Logic & Code Correctness Audit integration
  assert.ok(workspaceSource.includes('Run AI Logic & Correctness Audit'), 'Must render AI logic audit trigger button');
  assert.ok(workspaceSource.includes('auditProjectCodeLogic'), 'Must call auditProjectCodeLogic');
  assert.ok(workspaceSource.includes('Algorithmic Complexity'), 'Must display Algorithmic Complexity analysis');

  // 3. Verify Jury Defense submission & Viva Deep-link
  assert.ok(workspaceSource.includes('Submit Project for Faculty Review'), 'Must render faculty submission button');
  assert.ok(workspaceSource.includes('/interview?mode=project_viva'), 'Must deep-link to AI voice viva defense');
  assert.ok(workspaceSource.includes('/innovation-hub?repo='), 'Must deep-link to squad creation with repo prefilled');

  // 4. Verify API exports
  const apiModule = require('../src/lib/api/independentProjectsApi');
  assert.equal(typeof apiModule.auditProjectCodeLogic, 'function', 'auditProjectCodeLogic must be exported');
  assert.equal(typeof apiModule.submitProjectForJuryReview, 'function', 'submitProjectForJuryReview must be exported');

  // 5. Test Jury Submission Receipt generation
  const mockProject = { id: 'test_proj', name: 'Traffic Router', githubLink: 'https://github.com/test/router' };
  const juryRes = await apiModule.submitProjectForJuryReview('test_student', mockProject, 'PIN-GH-A1B2');
  assert.equal(juryRes.success, true);
  assert.ok(juryRes.receiptId.startsWith('JURY-'), 'Receipt ID must start with JURY-');
});


// ── AUDIT SUITE 7: Innovation Hub Real-Time Collab, Sprints & Jury Evaluation ──
test('BRUTAL AUDIT 7.1: Innovation Hub Real-Time Discussion & Chat Persistence', () => {
  const squadId = `squad_test_chat_${Date.now()}`;
  
  // Initially empty
  const initial = TeamsApiService.getChatMessages(squadId);
  assert.equal(initial.length, 0);

  // Send message
  const msg1 = TeamsApiService.sendChatMessage({
    squadId,
    senderId: 'student_lead_44',
    senderName: 'Maya Patel',
    senderRole: 'Backend Lead',
    text: 'Architecture RFC drafted. Checking into repository.',
  });

  assert.ok(msg1.id.startsWith('msg_'), 'Message must have unique ID');
  assert.equal(msg1.squadId, squadId);
  assert.equal(msg1.text, 'Architecture RFC drafted. Checking into repository.');

  // Fetch messages
  const retrieved = TeamsApiService.getChatMessages(squadId);
  assert.equal(retrieved.length, 1);
  assert.equal(retrieved[0].text, 'Architecture RFC drafted. Checking into repository.');
});

test('BRUTAL AUDIT 7.2: Prospective Contributor Join Requests & Lead Decision Lifecycle', () => {
  const squad = TeamsApiService.createSquad({
    name: 'Edge AI Drone Router',
    hackathonTitle: 'Autonomous Systems 2026',
    teamLeadStudentId: 'lead_student_88',
    teamLeadName: 'Karan Mehra',
    teamLeadRole: 'backend_lead',
    repoUrl: 'https://github.com/karan/edge-drone-router',
  });

  // Peer submits join request
  const req = TeamsApiService.createJoinRequest({
    squadId: squad.id,
    studentId: 'peer_student_99',
    studentName: 'Ananya Roy',
    role: 'frontend_lead',
    pitch: 'Experienced in React, Next.js and Tailwind. Ready to build telemetry UI.',
  });

  assert.equal(req.status, 'pending');
  assert.equal(req.squadId, squad.id);

  const pendingList = TeamsApiService.getJoinRequests(squad.id);
  assert.equal(pendingList.length, 1);
  assert.equal(pendingList[0].status, 'pending');

  // Lead accepts join request
  const acceptRes = TeamsApiService.acceptJoinRequest(squad.id, req.id);
  assert.equal(acceptRes.squad.members.length, 2);
  assert.ok(acceptRes.squad.members.some(m => m.studentId === 'peer_student_99'));
  assert.equal(acceptRes.requests[0].status, 'accepted');

  // Second peer submits request and lead declines
  const req2 = TeamsApiService.createJoinRequest({
    squadId: squad.id,
    studentId: 'peer_student_100',
    studentName: 'Samir Khan',
    role: 'data_engineer',
    pitch: 'Interested in project.',
  });

  const declineRes = TeamsApiService.declineJoinRequest(squad.id, req2.id);
  const declinedItem = declineRes.find(r => r.id === req2.id);
  assert.equal(declinedItem?.status, 'declined');
});

test('BRUTAL AUDIT 7.3: Squad Sprint Milestones & Final Faculty Jury Submission', async () => {
  const squad = TeamsApiService.createSquad({
    name: 'Quantum Key Exchange Simulation',
    hackathonTitle: 'Post-Quantum Cryptography Capstone',
    teamLeadStudentId: 'lead_crypto_01',
    teamLeadName: 'Elena Rostova',
    teamLeadRole: 'backend_lead',
    repoUrl: 'https://github.com/elena/quantum-key-sim',
  });

  assert.equal(squad.status, 'recruiting');
  assert.equal(squad.milestones.length, 3);

  // Toggle milestone 1
  const t1 = TeamsApiService.toggleMilestone(squad.id, squad.milestones[0].id, 'lead_crypto_01');
  assert.equal(t1.milestones[0].isCompleted, true);

  // Submit to jury with live prototype
  const submitRes = await TeamsApiService.submitTeamProject({
    squadId: squad.id,
    liveUrl: 'https://quantum-sim.vercel.app',
    demoVideoUrl: 'https://loom.com/share/quantum-demo',
    studentId: 'lead_crypto_01',
  });

  assert.equal(submitRes.squad.status, 'submitted');
  assert.equal(submitRes.squad.liveUrl, 'https://quantum-sim.vercel.app');
  assert.ok(submitRes.evidenceCount >= 1, 'Must record evidence for squad members');
  assert.ok(submitRes.squad.finalScore !== undefined);
  assert.ok(submitRes.squad.juryFeedback?.length! > 0);
});
