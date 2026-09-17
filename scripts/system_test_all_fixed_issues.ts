import assert from 'assert';
import { NextRequest } from 'next/server';

// Configure test environment bypass flags
process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';
process.env.EXAM_SECRET = 'test_exam_secret_32_bytes_long_key_pinit!!';

import { groundAndValidateEvidence } from '../src/lib/ats/factCheckValidator';
import { evaluateDocumentContradictions } from '../src/lib/ats/contradictionEngine';
import { auditDocumentCollection, checkNameSimilarity } from '../src/lib/ats/documentAuditEngine';
import { evaluateQT2Model } from '../src/lib/ats/qt2AnalysisEngine';
import { auditResumeATS } from '../src/lib/ats/atsScreener';
import { evaluateSystemTopology } from '../src/lib/interview/systemDesignEvaluator';
import { POST as vaultDeletePOST } from '../src/app/api/vault/delete/route';
import { POST as gdEvaluatePOST } from '../src/app/api/group-discussion/evaluate/route';
import { POST as verifyExamPOST } from '../src/app/api/portfolio/verify-exam/route';
import { POST as analyzeCertPOST } from '../src/app/api/portfolio/analyze-certificate/route';
import { signExamSessionToken } from '../src/lib/portfolio/examToken';

console.log('========================================================================');
console.log('🏗️  END-TO-END SYSTEM INTEGRATION TEST FOR ALL FIXED ISSUES');
console.log('========================================================================');

async function runSystemTests() {
  let passed = 0;
  let failed = 0;

  async function systemTest(name: string, fn: () => Promise<void> | void) {
    try {
      await fn();
      console.log(`  ✅ [SYSTEM TEST PASS]: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ [SYSTEM TEST FAIL]: ${name}`);
      console.error('     Error Stack:', err.stack || err.message);
      failed++;
    }
  }

  // --- SYSTEM TEST 1: Full Document Ingestion, Fact Grounding & Integrity ---
  await systemTest('System Pipeline: Multi-document ingestion, fact grounding, and provenance extraction', async () => {
    const marksheetText = [
      'VISVESVARAYA TECHNOLOGICAL UNIVERSITY',
      'BELAGAVI, KARNATAKA, INDIA',
      'OFFICIAL GRADE CARD',
      'Student Name: Rahul Sharma',
      'USN: 1VT20CS088',
      'CGPA: 8.45',
      'SGPA: 8.60',
      'Bachelor of Engineering in Computer Science and Engineering'
    ].join('\n');

    const marksheetGraph = groundAndValidateEvidence(
      marksheetText,
      'vtu_marksheet.pdf',
      'hash_marksheet_123',
      'NATIVE_PDF',
      0.95,
      'sem6'
    );

    assert.strictEqual(marksheetGraph.candidateName, 'Rahul Sharma');
    assert.ok(!marksheetGraph.candidateName.toLowerCase().includes('university'));
    assert.strictEqual(marksheetGraph.scoreOrGpa, '8.45 GPA');
    assert.ok(marksheetGraph.degree?.includes('Bachelor of Engineering'));
    assert.ok(marksheetGraph.provenanceRecords.length >= 3);
    for (const r of marksheetGraph.provenanceRecords) {
      assert.ok(
        r.verificationLevel === 'STRUCTURALLY_VALIDATED' || r.verificationLevel === 'INSTITUTION_VERIFIED',
        `Unexpected level: ${r.verificationLevel}`
      );
    }
  });

  // --- SYSTEM TEST 2: Precedence Hierarchy & Cross-Document Contradiction Engine ---
  await systemTest('System Pipeline: Precedence hierarchy overrules inflated resume claim with authoritative marksheet', async () => {
    const marksheetDoc = groundAndValidateEvidence(
      'Candidate Name: Rohan Mehta\nCGPA: 8.20',
      'marksheet.pdf',
      'hash_m',
      'NATIVE_PDF',
      0.95,
      'sem8'
    );
    const resumeDoc = groundAndValidateEvidence(
      'Candidate Name: Rohan Mehta\nCGPA: 9.80\nSKILLS\nTypeScript',
      'resume.pdf',
      'hash_r',
      'NATIVE_PDF',
      0.95,
      'resume'
    );

    const contradictionResult = evaluateDocumentContradictions([
      ...marksheetDoc.provenanceRecords,
      ...resumeDoc.provenanceRecords
    ]);

    assert.strictEqual(contradictionResult.hasConflicts, true);
    assert.strictEqual(contradictionResult.authoritativeFacts.get('GPA'), '8.20 GPA');

    const resumeGpaRecord = resumeDoc.provenanceRecords.find(r => r.field === 'GPA');
    assert.strictEqual(resumeGpaRecord?.status, 'CONFLICTING_EVIDENCE');
  });

  // --- SYSTEM TEST 3: Cross-Document Corroboration Elevation ---
  await systemTest('System Pipeline: Identical skills across independent credentials elevate to CROSS_VALIDATED', async () => {
    const doc1 = groundAndValidateEvidence('SKILLS\nTypeScript\nPython', 'res.pdf', 'h1', 'NATIVE_PDF', 0.95, 'resume');
    const doc2 = groundAndValidateEvidence('SKILLS\nTypeScript\nPostgreSQL', 'cert.pdf', 'h2', 'NATIVE_PDF', 0.95, 'certification');

    const combinedSkills = [
      ...doc1.provenanceRecords.filter(r => r.field === 'Skill' && r.value === 'TypeScript'),
      ...doc2.provenanceRecords.filter(r => r.field === 'Skill' && r.value === 'TypeScript')
    ];

    evaluateDocumentContradictions(combinedSkills);
    for (const r of combinedSkills) {
      assert.strictEqual(r.verificationLevel, 'CROSS_VALIDATED');
    }
  });

  // --- SYSTEM TEST 4: Anti-Fraud Identity Check & Trust Scoring ---
  await systemTest('System Pipeline: Sibling / friend with same surname rejected, honest baselines enforced', async () => {
    const friendCheck = checkNameSimilarity('Rahul Kumar', 'Amit Kumar');
    assert.strictEqual(friendCheck.isMatch, false);
    assert.ok(friendCheck.reason?.includes('differ'));

    const initialCheck = checkNameSimilarity('Rahul Kumar', 'R. Kumar');
    assert.strictEqual(initialCheck.isMatch, true);

    const emptyAudit = auditDocumentCollection('', []);
    assert.strictEqual(emptyAudit.trustScore, 0);
    assert.strictEqual(emptyAudit.overallStatus, 'AWAITING_UPLOADS');
  });

  // --- SYSTEM TEST 5: Word-Boundary Skill Ontology & Contact Extraction ---
  await systemTest('System Pipeline: Skill ontology rejects conversational English prose & handles Indian mobile numbers', async () => {
    const prose = 'Our next goal is to express ideas clearly. Each tree node stores a value. The sales pipeline grew.';
    const fakeSkills = auditResumeATS(prose, { targetRole: 'sde' });
    const detectedInBody = fakeSkills.extractedProfile.skillsDetected;
    assert.ok(!detectedInBody.includes('Next.js'));
    assert.ok(!detectedInBody.includes('Node.js'));
    assert.ok(!detectedInBody.includes('Express'));
    assert.ok(!detectedInBody.includes('CI/CD'));

    const indianResume = [
      'Rohan Sharma',
      'rohan.sharma@outlook.com',
      '+91 98765 43210',
      'Website: https://rohan.dev',
      'EDUCATION',
      'B.E. Computer Science | 2020 - 2024',
      'EXPERIENCE',
      'Software Engineer | Jan 2024 - Present',
      'Developed microservices with TypeScript.',
      'PROJECTS',
      'High Throughput Gateway | Aug 2023 - Dec 2023',
      'SKILLS',
      'TypeScript, React, Node.js'
    ].join('\n');

    const auditReport = auditResumeATS(indianResume, { targetRole: 'sde' });
    assert.ok(auditReport.extractedProfile.contacts.phone?.includes('98765'));
    assert.strictEqual(auditReport.extractedProfile.contacts.portfolio, 'https://rohan.dev');
    assert.ok(auditReport.compatibilityScores.parseabilityScore >= 90);
  });

  // --- SYSTEM TEST 6: QT2 Cognitive Engine & Real Longitudinal Trajectory ---
  await systemTest('System Pipeline: QT2 ignores file names and accurately scores GPA trajectory', async () => {
    const sem1 = {
      id: 's1',
      fileName: 'latest_test_resume.pdf',
      title: 'Sem 1',
      category: 'sem1' as const,
      fileSize: '40 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified' as const,
      verificationLevel: 'STRUCTURALLY_VALIDATED' as const,
      candidateName: 'Rohan Sharma',
      scoreOrGpa: '9.20 GPA',
      skills: [],
      provenanceRecords: []
    };
    const sem2 = {
      id: 's2',
      fileName: 'sem2.pdf',
      title: 'Sem 2',
      category: 'sem2' as const,
      fileSize: '40 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified' as const,
      verificationLevel: 'STRUCTURALLY_VALIDATED' as const,
      candidateName: 'Rohan Sharma',
      scoreOrGpa: '6.20 GPA',
      skills: [],
      provenanceRecords: []
    };

    const decliningRes = evaluateQT2Model([sem1, sem2]);
    assert.strictEqual(decliningRes.dimensions.stabilizer, 25, 'Filename "test" ignored');
    assert.ok(decliningRes.longitudinalGrowthScore <= 4, 'GPA collapse (9.20 -> 6.20) scores <= 4 pts');
  });

  // --- SYSTEM TEST 7: Vault API Deletion & IDOR Defense ---
  await systemTest('System Pipeline: Vault delete endpoint blocks cross-user IDOR attempts with HTTP 403', async () => {
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const urlStr = String(input);
      if (urlStr.includes('supabase.co') || urlStr.includes('vault_items')) {
        return new Response('null', { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return origFetch(input, init);
    };

    try {
      const maliciousReq = new NextRequest('http://localhost:3000/api/vault/delete', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token-001',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          documentId: 'doc_any_123',
          storageUrl: 'vault/victim_user_999/sem1/marksheet.pdf'
        })
      });

      const res = await vaultDeletePOST(maliciousReq);
      assert.strictEqual(res.status, 403, 'Cross-user storage deletion must return HTTP 403');
      const json = await res.json();
      assert.strictEqual(json.error, 'FORBIDDEN');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  // --- SYSTEM TEST 8: AI Group Discussion Fail-Closed Offline Resilience ---
  await systemTest('System Pipeline: Group Discussion evaluation fails closed (HTTP 503) when AI service offline', async () => {
    const origGroq = process.env.GROQ_API_KEYS;
    const origOpenRouter = process.env.OPENROUTER_API_KEY;

    try {
      delete process.env.GROQ_API_KEYS;
      delete process.env.GROQ_API_KEY;
      delete process.env.OPENROUTER_API_KEY;

      const gdReq = new NextRequest('http://localhost:3000/api/group-discussion/evaluate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token-001',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          roomId: 'Architecture Debate',
          roomDesc: 'High-throughput system debate',
          domain: 'technical',
          history: [
            { sender: 'Candidate', role: 'Candidate', content: 'Turn 1' },
            { sender: 'Candidate', role: 'Candidate', content: 'Turn 2' },
            { sender: 'Candidate', role: 'Candidate', content: 'Turn 3' },
            { sender: 'Candidate', role: 'Candidate', content: 'Turn 4' }
          ]
        })
      });

      const res = await gdEvaluatePOST(gdReq);
      assert.strictEqual(res.status, 503);
      const json = await res.json();
      assert.strictEqual(json.error, 'AI_EVALUATION_OFFLINE');
      assert.notStrictEqual(json.score, 92, 'Never award count-based fake score');
    } finally {
      if (origGroq) process.env.GROQ_API_KEYS = origGroq;
      if (origOpenRouter) process.env.OPENROUTER_API_KEY = origOpenRouter;
    }
  });

  // --- SYSTEM TEST 9: System Design Whiteboard Topology Evaluation ---
  await systemTest('System Pipeline: System design evaluator gives 0 for blank canvas, evaluates problem-specific needs', async () => {
    const blank = evaluateSystemTopology({
      nodeCount: 0,
      linkCount: 0,
      nodes: [],
      links: [],
      hasLoadBalancer: false,
      hasCachingLayer: false,
      hasDatabase: false,
      hasQueue: false,
      isFullyConnected: false
    }, 'Distributed Microservices', 'tech');

    assert.strictEqual(blank.score, 0);
    assert.strictEqual(blank.grade, 'Needs Work');

    const fullChat = evaluateSystemTopology({
      nodeCount: 6,
      linkCount: 5,
      nodes: [
        { id: '1', type: 'Client App', label: 'Web Client', category: 'client' },
        { id: '2', type: 'API Gateway', label: 'WebSocket Gateway', category: 'gateway' },
        { id: '3', type: 'Microservice', label: 'Chat Service', category: 'compute' },
        { id: '4', type: 'Kafka / Queue', label: 'Kafka Stream', category: 'queue' },
        { id: '5', type: 'Redis Cache', label: 'Presence Cache', category: 'storage' },
        { id: '6', type: 'Postgres DB', label: 'Archive DB', category: 'storage' }
      ],
      links: [
        { fromType: 'Client App', toType: 'API Gateway', protocol: 'WSS' },
        { fromType: 'API Gateway', toType: 'Microservice', protocol: 'gRPC' },
        { fromType: 'Microservice', toType: 'Kafka / Queue', protocol: 'PubSub' },
        { fromType: 'Microservice', toType: 'Redis Cache', protocol: 'Cache' },
        { fromType: 'Microservice', toType: 'Postgres DB', protocol: 'SQL' }
      ],
      hasLoadBalancer: true,
      hasCachingLayer: true,
      hasDatabase: true,
      hasQueue: true,
      isFullyConnected: true
    }, 'Real-Time Chat Application', 'tech');

    assert.ok(fullChat.score >= 88);
    assert.strictEqual(fullChat.grade, 'A+');
  });

  // --- SYSTEM TEST 10: End-to-End Certificate Assessment, Nonce Enforcement & Oracle Defense ---
  await systemTest('System Pipeline: Certificate assessment generation, oracle defense, replay prevention & honest status', async () => {
    // 1. Ingest certificate title & request assessment
    const analyzeReq = new NextRequest('http://localhost:3000/api/portfolio/analyze-certificate', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test-token-001',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services'
      })
    });

    const analyzeRes = await analyzeCertPOST(analyzeReq);
    assert.strictEqual(analyzeRes.status, 200);
    const analyzeData = await analyzeRes.json();
    assert.strictEqual(analyzeData.questions.length, 3);
    assert.ok(analyzeData.examSessionToken.length > 30);
    for (const q of analyzeData.questions) {
      assert.strictEqual(q.correctIdx, undefined, 'Client question options MUST NOT contain correctIdx');
      assert.strictEqual(q.options.length, 4);
    }

    // 2. Oracle defense verification: Failed exam returns NO correctCount, score, or total
    const failedAnswersToken = signExamSessionToken({ q1: 1, q2: 2, q3: 0 }, 30, 'test_user_001', 'AWS Certified Solutions Architect');
    const wrongSubmitReq = new NextRequest('http://localhost:3000/api/portfolio/verify-exam', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test-token-001',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        examSessionToken: failedAnswersToken,
        selectedAnswers: { q1: 3, q2: 3, q3: 3 }, // deliberate wrong answers
        certificateTitle: 'AWS Certified Solutions Architect'
      })
    });

    const wrongRes = await verifyExamPOST(wrongSubmitReq);
    assert.strictEqual(wrongRes.status, 200);
    const wrongData = await wrongRes.json();
    assert.strictEqual(wrongData.ok, true);
    assert.strictEqual(wrongData.passed, false);
    assert.strictEqual(wrongData.verified, false);
    assert.strictEqual(wrongData.correctCount, undefined, 'Oracle defense: correctCount must NOT be leaked');
    assert.strictEqual(wrongData.total, undefined, 'Oracle defense: total must NOT be leaked');
    assert.strictEqual(wrongData.score, undefined, 'Oracle defense: score must NOT be leaked');

    // 3. Replay prevention verification: Resubmitting consumed token rejected with HTTP 409
    const replayReq = new NextRequest('http://localhost:3000/api/portfolio/verify-exam', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test-token-001',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        examSessionToken: failedAnswersToken,
        selectedAnswers: { q1: 1, q2: 3, q3: 3 }, // attacker testing 1 answer variation
        certificateTitle: 'AWS Certified Solutions Architect'
      })
    });

    const replayRes = await verifyExamPOST(replayReq);
    assert.strictEqual(replayRes.status, 409, 'Replay of consumed session token MUST return HTTP 409');
    const replayData = await replayRes.json();
    assert.strictEqual(replayData.code, 'NONCE_REPLAY');

    // 4. Passing exam verification: Honest status KNOWLEDGE_ASSESSED, verified: false
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (input, init) => {
      const urlStr = String(input);
      if (urlStr.includes('supabase.co') || urlStr.includes('portfolio_items')) {
        const method = init?.method || 'GET';
        if (method === 'GET') {
          return new Response(JSON.stringify({ item_data: { items: [] } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return new Response(JSON.stringify([]), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return origFetch(input, init);
    };

    try {
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_service_key_for_test';
      const passToken = signExamSessionToken({ q1: 1, q2: 2, q3: 0 }, 30, 'test_user_001', 'AWS Certified Solutions Architect');
      const passReq = new NextRequest('http://localhost:3000/api/portfolio/verify-exam', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token-001',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          examSessionToken: passToken,
          selectedAnswers: { q1: 1, q2: 2, q3: 0 },
          certificateTitle: 'AWS Certified Solutions Architect'
        })
      });

      const passRes = await verifyExamPOST(passReq);
      assert.strictEqual(passRes.status, 200);
      const passData = await passRes.json();
      assert.strictEqual(passData.passed, true);
      assert.strictEqual(passData.assessmentPassed, true);
      assert.strictEqual(passData.verified, false, '3-MCQ quiz cannot grant verified: true');
      assert.strictEqual(passData.certificate?.verificationStatus, 'KNOWLEDGE_ASSESSED');
      assert.strictEqual(passData.certificate?.auditStatus, 'PENDING_FACULTY_AUDIT');
      assert.strictEqual(passData.correctCount, undefined, 'correctCount is not returned');
    } finally {
      globalThis.fetch = origFetch;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    }
  });

  console.log('========================================================================');
  console.log(`📊 SYSTEM INTEGRATION RESULT: ${passed} / ${passed + failed} TESTS PASSED`);
  console.log('========================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runSystemTests().catch((err) => {
  console.error('Fatal system test failure:', err);
  process.exit(1);
});
