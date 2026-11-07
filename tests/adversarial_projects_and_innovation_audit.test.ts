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
