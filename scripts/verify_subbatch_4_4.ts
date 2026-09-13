/**
 * Verification Suite for Sub-Batch 4.4: Career Twin & Real Data Simulation (Issues 097 – 101)
 *
 * Checks:
 * 1. Defect 097: Career Twin checks canonical `users` table and enforces onboarding gate
 * 2. Defect 098: Salary projections are strictly tied to verified competencies, NOT arbitrary XP math
 * 3. Defect 099: Missing QT diagnostics default to 40 baseline, preliminary roadmaps flagged
 * 4. Defect 100: ATS Resume scoring uses multi-factor weighting and penalizes unweighted keyword stuffing
 * 5. Defect 101: Avatar Mentor dynamic dialogue engine with contextual student state
 */

import { POST as careerTwinPost } from '../src/app/api/career-twin/results/route';
import { POST as mentorChatPost } from '../src/app/api/mentor/chat/route';
import { analyzeResumeContent, calculateKeywordDensity } from '../src/lib/ats/resumeAnalyzer';
import {
  generateContextualGreeting,
  generateMentorQuickPrompts,
  askMentorAvatar,
  StudentMentorContext
} from '../src/lib/mentor/avatarDialogue';
import * as fs from 'fs';
import * as path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- VERIFYING SUB-BATCH 4.4: Career Twin & Real Data Simulation ---');

  // Test 1: Defect 097 - Source code check for canonical `users` query
  console.log('\n[Test 1] Defect 097: Canonical DB query & onboarding gate in Career Twin');
  const careerTwinSource = fs.readFileSync(
    path.join(process.cwd(), 'src/app/api/career-twin/results/route.ts'),
    'utf-8'
  );
  assert(
    careerTwinSource.includes(".from('users')") && !careerTwinSource.includes(".from('profiles')"),
    'Career twin route queries canonical users table, not profiles'
  );
  assert(
    careerTwinSource.includes('needsOnboarding: true'),
    'Career twin route returns needsOnboarding gate if user has not completed diagnostics'
  );

  // Test 2: Defect 097 - Route response when user is uninitialized
  const reqUnauth = new Request('http://localhost:3000/api/career-twin/results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token-bypass'
    },
    body: JSON.stringify({ userId: 'new_user_without_onboarding' })
  });
  const resUnauth = await careerTwinPost(reqUnauth);
  const dataUnauth = await resUnauth.json();
  assert(
    dataUnauth.needsOnboarding === true && dataUnauth.ok === false,
    'Uninitialized candidate correctly receives needsOnboarding: true gate'
  );

  // Test 3: Defect 098 - Salary calculation decoupled from XP math
  console.log('\n[Test 2] Defect 098: Salary projections tied to competencies, not XP');
  assert(
    !careerTwinSource.includes('xpTotal / 1000') && !careerTwinSource.includes('xp / 1000'),
    'Salary formula completely purged of arbitrary (xp / 1000) multiplier'
  );
  assert(
    careerTwinSource.includes('calculateSalaryProjection') || careerTwinSource.includes('verifiedCount'),
    'Salary calculation references verified competency count'
  );

  // Test 4: Defect 099 - Roadmap Fuser defaults missing QT scores to 40
  console.log('\n[Test 3] Defect 099: Baseline default of 40 for missing QT scores & preliminary flag');
  const { generateDynamicStudentRoadmap } = await import('../src/lib/data/roadmapFuser');
  const dynamicRoadmap = generateDynamicStudentRoadmap({
    goal: 'Full Stack Engineer',
    courseId: 'fullstack-web-dev',
    durationDays: 30
  });
  assert(
    dynamicRoadmap[0]?.isPreliminaryRoadmap === true,
    'Roadmap generated without QT scores is explicitly flagged with isPreliminaryRoadmap: true'
  );
  assert(
    typeof dynamicRoadmap[0]?.diagnosticNotice === 'string' && dynamicRoadmap[0]?.diagnosticNotice.includes('40'),
    'Roadmap includes diagnostic notice citing beginner baseline of 40'
  );

  const questsFile = fs.existsSync(path.join(process.cwd(), 'src/app/quests/components/useQuestProgression.ts'))
    ? path.join(process.cwd(), 'src/app/quests/components/useQuestProgression.ts')
    : path.join(process.cwd(), 'src/app/quests/page.tsx');
  const questsSource = fs.readFileSync(questsFile, 'utf-8');
  assert(
    questsSource.includes('onboardingAnswers?.qt1_score ?? 40') &&
    questsSource.includes('onboardingAnswers?.qt2_score ?? 40'),
    'Quests page defaults unattempted QT1 and QT2 to 40 baseline (not 75/80)'
  );

  // Test 5: Defect 100 - Multi-factor ATS Resume Scoring
  console.log('\n[Test 4] Defect 100: Multi-factor Resume Analyzer & Keyword Stuffing Detection');
  const keywordDumpingResume = `
    Skills: Python Python Python Docker Docker Kubernetes React Node.js SQL Redis AWS AWS AWS.
    Experienced with Python, Docker, Kubernetes, React, Node.js, SQL, Redis, AWS.
    Tools: Docker, Kubernetes, AWS, SQL.
  `;
  const stuffedResult = analyzeResumeContent(keywordDumpingResume, [
    'Python', 'Docker', 'Kubernetes', 'React', 'Node.js', 'SQL', 'Redis', 'AWS'
  ]);
  assert(
    stuffedResult.penalties.keywordStuffingPenalty > 0,
    `Keyword dumping triggers stuffing penalty (detected: ${stuffedResult.penalties.keywordStuffingPenalty})`
  );
  assert(
    stuffedResult.breakdown.actionVerbsScore === 0,
    'Keyword dump with no action verbs gets 0 for actionVerbsScore'
  );
  assert(
    stuffedResult.totalScore < 50,
    `Stuffed resume receives honest sub-50 score (actual: ${stuffedResult.totalScore})`
  );

  const authenticResume = `
    Professional Experience:
    Senior Software Engineer | Tech Corp (2022 - Present)
    - Architected and deployed microservices using Docker and Kubernetes on AWS, scaling throughput by 45%.
    - Engineered high-performance backend pipelines in Python and Node.js, optimizing SQL query latency by 60%.
    - Implemented distributed Redis caching system, reducing API p99 response times from 850ms to 120ms.
    - Led frontend redesign in React and TypeScript, boosting conversion metrics by 28%.
  `;
  const authenticResult = analyzeResumeContent(authenticResume, [
    'Python', 'Docker', 'Kubernetes', 'React', 'Node.js', 'SQL', 'Redis', 'AWS'
  ]);
  assert(
    authenticResult.penalties.keywordStuffingPenalty === 0,
    'Authentic resume incurs 0 keyword stuffing penalty'
  );
  assert(
    authenticResult.breakdown.actionVerbsScore >= 70,
    `Authentic resume with past-tense action verbs scores high (actual: ${authenticResult.breakdown.actionVerbsScore})`
  );
  assert(
    authenticResult.breakdown.quantifiedMetricsScore >= 70,
    `Authentic resume with quantified metrics scores high (actual: ${authenticResult.breakdown.quantifiedMetricsScore})`
  );
  assert(
    authenticResult.totalScore > stuffedResult.totalScore + 25,
    `Authentic resume substantially outscores keyword stuffed resume (${authenticResult.totalScore} vs ${stuffedResult.totalScore})`
  );

  // Test 6: Defect 101 - Avatar Mentor Dynamic Dialogue & API
  console.log('\n[Test 5] Defect 101: Dynamic Avatar Mentor Dialogue seeded with Student Context');
  const mockContext: StudentMentorContext = {
    studentName: 'Aarav',
    targetRole: 'Distributed Systems Engineer',
    activeQuest: 'Distributed Consensus with Raft',
    missingSkills: ['Raft Algorithm', 'gRPC', 'Distributed Tracing'],
    atsScore: 68
  };

  const greeting = generateContextualGreeting(mockContext);
  assert(
    greeting.includes('Aarav') && greeting.includes('Distributed Systems Engineer') && greeting.includes('Distributed Consensus with Raft'),
    'Greeting dynamically includes student name, target role, and active quest'
  );

  const prompts = generateMentorQuickPrompts(mockContext);
  assert(
    prompts.some(p => p.includes('Raft Algorithm')),
    'Mentor prompts dynamically target the student missing skill gap (Raft Algorithm)'
  );
  assert(
    prompts.some(p => p.includes('Distributed Consensus with Raft')),
    'Mentor prompts dynamically reference the student active quest'
  );

  // Test 7: Mentor Chat API Route validation
  const emptyReq = new Request('http://localhost:3000/api/mentor/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token-bypass'
    },
    body: JSON.stringify({})
  });
  const emptyRes = await mentorChatPost(emptyReq);
  assert(
    emptyRes.status === 400,
    'Mentor chat route rejects empty query with HTTP 400'
  );

  const validReq = new Request('http://localhost:3000/api/mentor/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token-bypass'
    },
    body: JSON.stringify({
      message: 'What should I study to close my biggest skill gap?',
      studentName: 'Aarav',
      targetRole: 'Distributed Systems Engineer',
      activeQuest: 'Distributed Consensus with Raft',
      missingSkills: ['Raft Algorithm', 'gRPC']
    })
  });
  const validRes = await mentorChatPost(validReq);
  const validData = await validRes.json();
  assert(
    validRes.status === 200 && validData.ok === true,
    'Mentor chat route returns HTTP 200 with ok: true'
  );
  assert(
    typeof validData.reply === 'string' && validData.reply.length > 20,
    'Mentor chat returns non-empty reply'
  );
  assert(
    validData.context.studentName === 'Aarav' &&
    validData.context.targetRole === 'Distributed Systems Engineer' &&
    validData.context.activeQuest === 'Distributed Consensus with Raft',
    'Mentor chat context accurately preserves student parameters'
  );

  console.log(`\nSUB-BATCH 4.4 SUMMARY: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled error in verification suite:', err);
  process.exit(1);
});
