/**
 * PinIT Phase 2: Compete & Collaborative Build Ecosystem Test Suite
 * Validates Code Wars, Team Hackathons, Verified Leaderboards, and Interview Defense Bridge.
 */

import { CodeWarsApiService, CODE_WARS_PROBLEMS_CATALOG } from '../src/lib/api/codeWarsApi';
import { TeamsApiService, INITIAL_HACKATHON_SQUADS } from '../src/lib/api/teamsApi';
import { PathwayApiService } from '../src/lib/api/pathwayApi';
import { verifyEvidenceIntegrity } from '../src/lib/pathway/evidenceEngine';

let passCount = 0;
let failCount = 0;

function assertTest(description: string, condition: boolean, details?: any) {
  if (condition) {
    console.log(`  🛡️ [PASS] ${description}`);
    passCount++;
  } else {
    console.error(`  ❌ [FAIL] ${description}`, details !== undefined ? details : '');
    failCount++;
  }
}

async function runPhase2Tests() {
  console.log('================================================================');
  console.log('  PINIT PHASE 2: COMPETE & COLLABORATIVE BUILD FORENSIC TEST    ');
  console.log('================================================================\n');

  const studentId = `student_phase2_${Date.now()}`;

  // ── Step 0: Foundational L0 Baseline ─────────────────────────────────────────
  await PathwayApiService.recordEvidence({
    id: `ev_l0_${studentId}`,
    competencyId: 'comp_comp_fundamentals_l0',
    competencyVersion: '1.0.0',
    studentId,
    programId: 'prog_swe_accelerated_9m',
    evidenceClass: 'knowledge',
    difficulty: 'basic',
    evidenceFamilyId: 'comp_fundamentals',
    sourceType: 'diagnostic',
    sourceId: 'diag_01',
    attemptId: 'att_01',
    score: 90,
    evaluatorType: 'deterministic',
    evaluatorVersion: 'v1.0',
    rubricVersion: 'v1.0',
    timestamp: Date.now(),
    artifacts: {
      commitSha: 'a1b2c3d4e5f6',
    }
  });

  // ── 1. Code Wars Arena & Algorithmic Problem Battles ─────────────────────────
  console.log('--- 1. Code Wars Problem Registry & Matches ---');
  const problems = CodeWarsApiService.getProblems();
  assertTest('Code Wars problems catalog has at least 3 curated algorithmic challenges', problems.length >= 3);
  assertTest('BST Lowest Common Ancestor targets comp_dsa_linear_trees_l2',
    problems.some(p => p.id === 'war_tree_lca_01' && p.competencyId === 'comp_dsa_linear_trees_l2')
  );
  assertTest('Atomic Resource Allocator targets comp_concurrency_threads_l2',
    problems.some(p => p.id === 'war_concurrency_deadlock_02' && p.competencyId === 'comp_concurrency_threads_l2')
  );

  const match = CodeWarsApiService.startMatch(studentId, 'war_tree_lca_01', '1v1_duel');
  assertTest('Starting match generates active 1v1 duel with bot opponent',
    match.status === 'active' && match.mode === '1v1_duel' && !!match.opponent
  );

  // Submitting failed/incomplete solution (contains unmodified placeholder)
  const failedSubmission = await CodeWarsApiService.submitSolution({
    matchId: match.id,
    studentId,
    code: 'function lowestCommonAncestor() {\n  // Your code here\n  return null;\n}',
    language: 'typescript',
    timeSpentSeconds: 120,
  });
  assertTest('Incomplete code submission fails tests without evidence recording',
    !failedSubmission.passed && !failedSubmission.evidenceRecordId
  );

  // Submitting valid passing solution
  const match2 = CodeWarsApiService.startMatch(studentId, 'war_tree_lca_01', 'solo_speedrun');
  const passedSubmission = await CodeWarsApiService.submitSolution({
    matchId: match2.id,
    studentId,
    code: `function lowestCommonAncestor(root: TreeNode | null, p: number, q: number): number | null {
      while (root) {
        if (p < root.val && q < root.val) root = root.left;
        else if (p > root.val && q > root.val) root = root.right;
        else return root.val;
      }
      return null;
    }`,
    language: 'typescript',
    timeSpentSeconds: 45,
  });

  assertTest('Passing solution marks victory and passes all test assertions',
    passedSubmission.passed && passedSubmission.testsPassed === passedSubmission.totalTests
  );
  assertTest('Victory automatically creates SHA-256 evidence record in competency ledger',
    !!passedSubmission.evidenceRecordId
  );

  // Verify evidence integrity in ledger
  const allEv = await PathwayApiService.getAllStudentEvidence(studentId);
  const battleEvidence = allEv.find(e => e.id === passedSubmission.evidenceRecordId);
  assertTest('Battle evidence is retrievable via PathwayApiService ledger', !!battleEvidence);
  assertTest('Battle evidence passes cryptographic SHA-256 verification',
    battleEvidence ? verifyEvidenceIntegrity(battleEvidence) : false
  );

  // ── 2. Team Projects & Hackathon Squads ───────────────────────────────────────
  console.log('\n--- 2. Team Projects & Collaborative Hackathon Squads ---');
  const initialSquads = TeamsApiService.getSquads();
  assertTest('Initial hackathon squads are pre-populated with active team', initialSquads.length >= 1);

  const createdSquad = TeamsApiService.createSquad({
    name: 'Quantum Nexus Core',
    hackathonTitle: 'Cloud Distributed Systems Hackathon',
    teamLeadStudentId: studentId,
    teamLeadName: 'Test Student Lead',
    teamLeadRole: 'backend_lead',
    repoUrl: 'https://github.com/quantum-nexus/core-service',
  });

  assertTest('Creating squad initializes 3 sprint milestones', createdSquad.milestones.length === 3);
  assertTest('Squad lead is assigned 100% initial contribution share',
    createdSquad.members[0].contributionPct === 100
  );

  // Join squad with peer member
  const peerStudentId = `peer_${Date.now()}`;
  const updatedSquad = TeamsApiService.joinSquad({
    squadId: createdSquad.id,
    studentId: peerStudentId,
    name: 'Peer Cloud Architect',
    role: 'devops_cloud',
  });

  assertTest('Joining squad adds member and rebalances contribution percentages',
    updatedSquad.members.length === 2 && updatedSquad.members[0].contributionPct === 50 && updatedSquad.members[1].contributionPct === 50
  );

  // Complete all milestones and submit
  TeamsApiService.toggleMilestone(createdSquad.id, 'm1');
  TeamsApiService.toggleMilestone(createdSquad.id, 'm2');
  TeamsApiService.toggleMilestone(createdSquad.id, 'm3');

  const submissionResult = await TeamsApiService.submitTeamProject({
    squadId: createdSquad.id,
    liveUrl: 'https://quantum-nexus.pinit.app',
  });

  assertTest('Submitting team project marks status as verified with jury score',
    submissionResult.squad.status === 'verified' && (submissionResult.squad.finalScore || 0) >= 90
  );
  assertTest('Submitting team project generates multi-contributor evidence for both members',
    submissionResult.evidenceCount === 2
  );

  // Check peer evidence record
  const peerEvidence = await PathwayApiService.getAllStudentEvidence(peerStudentId);
  assertTest('Peer member receives verified evidence for devops_cloud role (comp_cicd_cloud_devops_l4)',
    peerEvidence.some(e => e.competencyId === 'comp_cicd_cloud_devops_l4' && e.sourceType === 'project')
  );

  // ── 3. AI Interview & Oral Defense Ledger Bridge ─────────────────────────────
  console.log('\n--- 3. AI Interview & Oral Viva Defense Ledger Bridge ---');
  const interviewDefenseEvidence = await PathwayApiService.recordEvidence({
    id: `ev_interview_test_${Date.now()}`,
    competencyId: 'comp_comm_star_interview_l2',
    competencyVersion: '1.0.0',
    studentId,
    programId: 'prog_swe_accelerated_9m',
    evidenceClass: 'defense',
    difficulty: 'production',
    evidenceFamilyId: 'interview_star_articulation',
    sourceType: 'capstone_defense',
    sourceId: `session_interview_001`,
    attemptId: `att_session_interview_001`,
    score: 88,
    evaluatorType: 'ai',
    evaluatorVersion: 'vroid-ai-interviewer-v2',
    rubricVersion: 'rubric-star-defense-v1',
    timestamp: Date.now(),
    artifacts: {
      executionLogSnippet: 'Verdict: Hire | Summary: Candidate structured answers with crisp quantitative STAR metrics',
    }
  });

  assertTest('AI Oral Viva defense evidence created with valid SHA-256 seal',
    verifyEvidenceIntegrity(interviewDefenseEvidence.evidenceRecord)
  );

  const studentProfile = await PathwayApiService.getStudentSkillProfile(studentId);
  assertTest('Student skill profile includes demonstrated/verified skills from battle and defense',
    studentProfile.demonstrated.length > 0 || studentProfile.verified.length > 0
  );

  // ── Final Summary ────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  if (failCount === 0) {
    console.log(`  🎉 PHASE 2 COMPETE ECOSYSTEM: ALL ${passCount}/${passCount} TESTS PASSED WITH 0 REGRESSIONS!`);
  } else {
    console.error(`  ❌ PHASE 2 COMPETE TEST FAILURES: ${failCount} failed, ${passCount} passed.`);
  }
  console.log('================================================================\n');

  if (failCount > 0) process.exit(1);
}

runPhase2Tests().catch(err => {
  console.error('Phase 2 Test Execution Error:', err);
  process.exit(1);
});
