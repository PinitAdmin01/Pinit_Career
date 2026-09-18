import assert from 'assert';
import { NextRequest } from 'next/server';

// Configure test environment bypass flags
process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';
process.env.EXAM_SECRET = 'test_exam_secret_32_bytes_long_key_pinit!!';
process.env.EVIDENCE_SIGNING_SECRET = 'test_evidence_signing_secret_32_bytes!';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_service_role_key_for_test';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock_anon_key_for_test';

const defaultFetch = globalThis.fetch;
function setupMockSupabaseFetch() {
  globalThis.fetch = async (input: any, init?: any) => {
    const urlStr = typeof input === 'string' ? input : (input?.url || String(input));
    if (urlStr.includes('54321') || urlStr.includes('supabase.co') || urlStr.includes('mock-project') || urlStr.includes('placeholder-project')) {
      const method = (init?.method || 'GET').toUpperCase();
      if (urlStr.includes('/auth/v1/admin/users')) {
        return new Response(JSON.stringify({ user: { id: 'mock_user_' + Date.now().toString(36), email: 'mock@example.edu' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      if (method === 'GET') {
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return defaultFetch(input, init);
  };
}
setupMockSupabaseFetch();

import crypto from 'crypto';
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
import { GET as verifyRouteGET } from '../src/app/api/verify/[credentialId]/route';
import { GET as transcriptRouteGET } from '../src/app/api/passport/transcript/route';
import { POST as githubWebhookPOST } from '../src/app/api/webhooks/github/route';
import { PathwayApiService } from '../src/lib/api/pathwayApi';

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
      const urlStr = typeof input === 'string' ? input : (input?.url || String(input));
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
      const urlStr = typeof input === 'string' ? input : (input?.url || String(input));
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
      setupMockSupabaseFetch();
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_service_role_key_for_test';
    }
  });

  // --- SYSTEM TEST 11: End-to-End Cryptographic Passport, Server Verification & GitHub Ingest ---
  await systemTest('System Pipeline: GitHub push ingest with HMAC signing, server-side public verification, and authentic passport ledger seal', async () => {
    const secret = 'webhook_test_secret_32_bytes_xyz!';
    process.env.GITHUB_WEBHOOK_SECRET = secret;

    // 1. Ingest push webhook from student octocat
    const payload = {
      repository: {
        name: 'hello-world',
        html_url: 'https://github.com/octocat/hello-world',
      },
      sender: {
        login: 'octocat',
        id: 12345,
      },
      head_commit: {
        id: 'commit_sys_test_11_abcdef1234567890',
        message: 'Implement distributed consensus mechanism and comprehensive automated integration tests',
        author: { email: 'octocat@github.com' },
        added: ['src/consensus/raft.ts', 'tests/consensus.test.ts'],
        modified: ['src/index.ts', 'src/config.ts'],
        removed: [],
      },
      commits: [
        {
          id: 'commit_sys_test_11_abcdef1234567890',
          message: 'Implement distributed consensus mechanism and comprehensive automated integration tests',
          author: { email: 'octocat@github.com' },
          added: ['src/consensus/raft.ts', 'tests/consensus.test.ts'],
          modified: ['src/index.ts', 'src/config.ts'],
          removed: [],
        }
      ]
    };

    const payloadStr = JSON.stringify(payload);
    const sig = 'sha256=' + crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');

    const webhookReq = new NextRequest('http://localhost:3000/api/webhooks/github', {
      method: 'POST',
      headers: {
        'x-hub-signature-256': sig,
        'x-github-event': 'push',
        'content-type': 'application/json',
      },
      body: payloadStr,
    });

    const webhookRes = await githubWebhookPOST(webhookReq);
    assert.strictEqual(webhookRes.status, 200, 'Webhook must accept verified push');
    const webhookData = await webhookRes.json();
    assert.strictEqual(webhookData.success, true);
    assert.ok(webhookData.evidenceRecordId, 'Evidence record ID must be generated');

    const evRecordId = webhookData.evidenceRecordId;

    // 2. Authoritative Server Verification Endpoint validates evidence
    const verifyReq = new NextRequest(`http://localhost:3000/api/verify/${evRecordId}`);
    const verifyRes = await verifyRouteGET(verifyReq, { params: { credentialId: evRecordId } });
    assert.strictEqual(verifyRes.status, 200);
    const verifyData = await verifyRes.json();
    assert.strictEqual(verifyData.valid, true, 'Server verification must report valid');
    assert.strictEqual(verifyData.status, 'VERIFIED');
    assert.strictEqual(verifyData.evidenceRecord.evidenceClass, 'application', 'Evidence class must be application, not production');
    assert.ok(verifyData.evidenceRecord.score <= 75, 'Score must be honest (<= 75)');

    // 3. Tampered evidence verification failure
    const origGet = PathwayApiService.getAllStudentEvidence.bind(PathwayApiService);
    const studentId = 'stu_dev_octocat_01';
    const allEvidence = await PathwayApiService.getAllStudentEvidence(studentId);
    PathwayApiService.getAllStudentEvidence = async (sId: string) => {
      if (sId === studentId) {
        return allEvidence.map(e => {
          if (e.id === evRecordId) {
            return { ...e, score: 100 }; // Tampered score without new signature
          }
          return e;
        });
      }
      return origGet(sId);
    };

    try {
      const tamperedVerifyReq = new NextRequest(`http://localhost:3000/api/verify/${evRecordId}`);
      const tamperedVerifyRes = await verifyRouteGET(tamperedVerifyReq, { params: { credentialId: evRecordId } });
      const tamperedData = await tamperedVerifyRes.json();
      assert.strictEqual(tamperedData.valid, false, 'Tampered evidence must fail verification');
      assert.strictEqual(tamperedData.error, 'INTEGRITY_TAMPERED');
    } finally {
      PathwayApiService.getAllStudentEvidence = origGet;
    }

    // 4. Passport Transcript route computes genuine seal and accurate defense copy
    const transcriptReq = new NextRequest('http://localhost:3000/api/passport/transcript', {
      headers: {
        'authorization': 'Bearer demo-token-bypass',
      },
    });

    const transcriptRes = await transcriptRouteGET(transcriptReq);
    assert.strictEqual(transcriptRes.status, 200);
    const transcriptHtml = await transcriptRes.text();

    assert.ok(!transcriptHtml.includes('✓ SHA-256 Verified'), 'Deceptive unkeyed SHA-256 label removed');
    assert.ok(
      transcriptHtml.includes('✓ HMAC-SHA256 Verified') || transcriptHtml.includes('Provisional / Unverified'),
      'Accurate HMAC verification status displayed'
    );
    assert.ok(!transcriptHtml.includes('Passed rigorous multi-stage architectural defense verifying independent problem solving and code provenance (0/100)'));
  });

  // --- SYSTEM TEST 12: End-to-End Student ↔ Teacher Messaging on Database ---
  await systemTest('System Pipeline: Student ↔ Teacher messaging via database with dual-column sync, teacher inbox, and cross-device sync', async () => {
    const { sendDirectMessage, getTeacherInbox, markMessagesAsRead, getUnreadMessageCount } = await import('../src/lib/services/supabase/socialService');
    const { inboxSyncService } = await import('../src/lib/chat/inboxSyncService');
    const { GET: directGET, POST: directPOST } = await import('../src/app/api/messages/direct/route');
    const { GET: inboxGET, POST: inboxPOST } = await import('../src/app/api/teacher/inbox/route');

    // 1. Student sends message via API route
    const studentReq = new NextRequest('http://localhost:3000/api/messages/direct', {
      method: 'POST',
      body: JSON.stringify({
        senderId: 'std_sys_001',
        senderName: 'Tanvi Agarwal',
        recipientId: 'priya',
        recipientName: 'Ms. Priya',
        content: 'System integration inquiry on PostgreSQL triggers'
      })
    });
    const postRes = await directPOST(studentReq);
    assert.strictEqual(postRes.status, 200);

    // 2. Teacher retrieves inbox from database
    const inbox = await getTeacherInbox('priya');
    assert.ok(Array.isArray(inbox), 'Teacher inbox must be an array');
    const found = inbox.find(m => m.sender_id === 'std_sys_001');
    assert.ok(found, 'Message from student must be present in teacher inbox');
    assert.strictEqual(found.recipient_id, 'priya');
    assert.strictEqual(found.receiver_id, 'priya');
    assert.strictEqual(found.is_read, false);

    // 3. Teacher sends reply via inbox API
    const replyReq = new NextRequest('http://localhost:3000/api/teacher/inbox', {
      method: 'POST',
      body: JSON.stringify({
        studentId: 'std_sys_001',
        replyText: 'Triggers run before or after commit depending on BEFORE/AFTER specification.',
        teacherName: 'Ms. Priya',
        teacherId: 'priya'
      })
    });
    const replyRes = await inboxPOST(replyReq);
    assert.strictEqual(replyRes.status, 200);

    // 4. Verify conversation thread contains both student inquiry and teacher reply
    const getReq = new NextRequest('http://localhost:3000/api/messages/direct?with=priya&userId=std_sys_001');
    const getRes = await directGET(getReq);
    assert.strictEqual(getRes.status, 200);
    const getBody = await getRes.json();
    assert.ok(Array.isArray(getBody.messages));
    assert.ok(getBody.messages.some((m: any) => m.sender_id === 'std_sys_001'), 'Student message must be in conversation');
    assert.ok(getBody.messages.some((m: any) => m.role === 'teacher' || m.sender_id === 'priya'), 'Teacher reply must be in conversation');

    // 5. Cross-device sync service reconstructs threads from database
    const synced = await inboxSyncService.syncFromDatabase('priya');
    assert.ok(Array.isArray(synced));
    const tanviConvo = synced.find(c => c.studentId === 'std_sys_001');
    assert.ok(tanviConvo, 'Cross-device sync must reconstruct Tanvi thread');
    assert.ok(tanviConvo.messages.length >= 2, 'Must contain both student message and teacher reply');
  });

  // --- SYSTEM TEST 13: End-to-End Notifications Lifecycle & Leaderboard ELO Verification ---
  await systemTest('System Pipeline: Notifications creation, dual-column sync, mark read API handlers, and leaderboard ELO rating', async () => {
    const { GET: notifGET, POST: notifPOST } = await import('../src/app/api/notifications/route');
    const { POST: markAllPOST } = await import('../src/app/api/notifications/mark-all-read/route');
    const { PATCH: markOnePATCH } = await import('../src/app/api/notifications/[id]/read/route');
    const { GET: leaderboardGET } = await import('../src/app/api/leaderboard/route');

    // 1. Create notification via API
    const postReq = new NextRequest('http://localhost:3000/api/notifications', {
      method: 'POST',
      headers: { 'authorization': 'Bearer demo-token-bypass', 'content-type': 'application/json' },
      body: JSON.stringify({
        userId: 'test_user_001',
        title: 'Interview Scheduled',
        message: 'Mock technical interview scheduled for tomorrow at 10 AM.',
        type: 'info',
        source: 'interview'
      })
    });
    const postRes = await notifPOST(postReq);
    assert.strictEqual(postRes.status, 200);
    const postJson = await postRes.json();
    assert.ok(postJson.ok);
    const notifId = postJson.notification?.id;
    assert.ok(notifId);

    // 2. Query notifications and verify presence
    const getReq = new NextRequest('http://localhost:3000/api/notifications', {
      headers: { 'authorization': 'Bearer demo-token-bypass' }
    });
    const getRes = await notifGET(getReq);
    assert.strictEqual(getRes.status, 200);
    const getJson = await getRes.json();
    assert.ok(Array.isArray(getJson.notifications));
    const createdItem = getJson.notifications.find((n: any) => n.id === notifId);
    assert.ok(createdItem, 'Created notification must appear in user notification list');
    assert.strictEqual(createdItem.is_read, false);
    assert.strictEqual(createdItem.read, false);

    // 3. Mark specific notification as read
    const patchReq = new NextRequest(`http://localhost:3000/api/notifications/${notifId}/read`, {
      method: 'PATCH',
      headers: { 'authorization': 'Bearer demo-token-bypass' }
    });
    const patchRes = await markOnePATCH(patchReq, { params: { id: notifId } });
    assert.strictEqual(patchRes.status, 200);

    // 4. Mark all as read
    const markAllReq = new NextRequest('http://localhost:3000/api/notifications/mark-all-read', {
      method: 'POST',
      headers: { 'authorization': 'Bearer demo-token-bypass' }
    });
    const markAllRes = await markAllPOST(markAllReq);
    assert.strictEqual(markAllRes.status, 200);

    // 5. Query leaderboard and verify no fake students + valid ELO ratings
    const lbReq = new NextRequest('http://localhost:3000/api/leaderboard?mode=code_wars', {
      headers: { 'authorization': 'Bearer demo-token-bypass' }
    });
    const lbRes = await leaderboardGET(lbReq);
    assert.strictEqual(lbRes.status, 200);
    const lbJson = await lbRes.json();
    assert.ok(lbJson.ok);
    assert.ok(Array.isArray(lbJson.leaderboard) && lbJson.leaderboard.length > 0);
    assert.ok(!lbJson.leaderboard.some((e: any) => e.name?.includes('Sarah Chen')));
    assert.ok(lbJson.leaderboard.every((e: any) => typeof e.eloRating === 'number' && e.eloRating > 0));
  });

  // --- SYSTEM TEST 14: Enterprise Multi-Portal Data Flow & Service Authority ---
  await systemTest('System Pipeline: Multi-portal enterprise workflows (Parent, Recruiter, Consultant, Admin) with role gating, real metrics, and zero fabricated fallbacks', async () => {
    const { GET: parentStudentsGET } = await import('../src/app/api/parent/students/route');
    const { GET: recruiterPipeGET } = await import('../src/app/api/recruiter/pipeline/route');
    const { POST: recruiterShortlistPOST } = await import('../src/app/api/recruiter/shortlist/route');
    const { PATCH: recruiterVisPATCH } = await import('../src/app/api/recruiter/visibility/route');
    const { GET: consultantAnalyticsGET } = await import('../src/app/api/consultant/analytics/route');
    const { POST: consultantAddStudentPOST } = await import('../src/app/api/consultant/student/add/route');
    const { GET: adminDashboardGET } = await import('../src/app/api/admin/dashboard/route');
    const { GET: adminMetricsGET } = await import('../src/app/api/admin/metrics-summary/route');
    const { PATCH: adminRolePATCH } = await import('../src/app/api/admin/users/[id]/role/route');

    // 1. Parent portal: student token rejected (403), parent token accepted (200)
    const pStudentReq = new NextRequest('http://localhost:3000/api/parent/students', {
      headers: { authorization: 'Bearer test-token-student' }
    });
    const pStudentRes = await parentStudentsGET(pStudentReq);
    assert.strictEqual(pStudentRes.status, 403, 'Plain student token must be rejected from parent portal');

    const pParentReq = new NextRequest('http://localhost:3000/api/parent/students', {
      headers: { authorization: 'Bearer test-token-parent' }
    });
    const pParentRes = await parentStudentsGET(pParentReq);
    assert.strictEqual(pParentRes.status, 200);
    const pParentJson = await pParentRes.json();
    assert.ok(pParentJson.ok && Array.isArray(pParentJson.students));

    // 2. Recruiter portal: student token rejected (403), recruiter token accepted (200), real pipeline
    const rStudentReq = new NextRequest('http://localhost:3000/api/recruiter/pipeline', {
      headers: { authorization: 'Bearer test-token-student' }
    });
    const rStudentRes = await recruiterPipeGET(rStudentReq);
    assert.strictEqual(rStudentRes.status, 403);

    const rRecReq = new NextRequest('http://localhost:3000/api/recruiter/pipeline', {
      headers: { authorization: 'Bearer test-token-recruiter' }
    });
    const rRecRes = await recruiterPipeGET(rRecReq);
    assert.strictEqual(rRecRes.status, 200);
    const rRecJson = await rRecRes.json();
    assert.ok(rRecJson.ok && Array.isArray(rRecJson.pipeline));

    // Recruiter actions notify candidate and record interactions
    const rShortlistReq = new NextRequest('http://localhost:3000/api/recruiter/shortlist', {
      method: 'POST',
      headers: { authorization: 'Bearer test-token-recruiter', 'content-type': 'application/json' },
      body: JSON.stringify({ candidateId: 'std_sys_001' })
    });
    const rShortlistRes = await recruiterShortlistPOST(rShortlistReq);
    assert.strictEqual(rShortlistRes.status, 200);

    const rVisReq = new NextRequest('http://localhost:3000/api/recruiter/visibility', {
      method: 'PATCH',
      headers: { authorization: 'Bearer demo-token-bypass', 'content-type': 'application/json' },
      body: JSON.stringify({ visibility: 'public' })
    });
    const rVisRes = await recruiterVisPATCH(rVisReq);
    assert.strictEqual(rVisRes.status, 200);
    const rVisJson = await rVisRes.json();
    assert.strictEqual(rVisJson.recruiter_visibility, 100);

    // 3. Consultant portal: analytics without 80% floor & student provisioning without session wipeout
    const cReq = new NextRequest('http://localhost:3000/api/consultant/analytics', {
      headers: { authorization: 'Bearer test-token-consultant' }
    });
    const cRes = await consultantAnalyticsGET(cReq);
    assert.strictEqual(cRes.status, 200);
    const cJson = await cRes.json();
    assert.ok(cJson.ok && typeof cJson.analytics?.totalStudents === 'number');

    const cAddReq = new NextRequest('http://localhost:3000/api/consultant/student/add', {
      method: 'POST',
      headers: { authorization: 'Bearer test-token-consultant', 'content-type': 'application/json' },
      body: JSON.stringify({
        displayName: 'Aarav Gupta',
        email: 'aarav.studyabroad@example.edu',
        targetCountry: 'Germany',
        programType: 'M.Sc Computer Science'
      })
    });
    const cAddRes = await consultantAddStudentPOST(cAddReq);
    assert.strictEqual(cAddRes.status, 200);
    const cAddJson = await cAddRes.json();
    assert.ok(cAddJson.ok && cAddJson.student?.email === 'aarav.studyabroad@example.edu');

    // 4. Admin portal: dashboard evaluated timestamps, metrics honest 0s, role updates via service role
    const aReq = new NextRequest('http://localhost:3000/api/admin/dashboard', {
      headers: { authorization: 'Bearer test-token-admin' }
    });
    const aRes = await adminDashboardGET(aReq);
    assert.strictEqual(aRes.status, 200);
    const aJson = await aRes.json();
    assert.ok(aJson.ok && typeof aJson.users?.active_today === 'number');
    assert.ok(typeof aJson.users?.new_this_week === 'number');

    const aMetricsReq = new NextRequest('http://localhost:3000/api/admin/metrics-summary', {
      headers: { authorization: 'Bearer test-token-admin' }
    });
    const aMetricsRes = await adminMetricsGET(aMetricsReq);
    assert.strictEqual(aMetricsRes.status, 200);
    const aMetricsJson = await aMetricsRes.json();
    assert.ok(aMetricsJson.ok);
    assert.notStrictEqual(aMetricsJson.summary.totalUsers, 120, 'Metrics must never default to 120 users');

    const aRoleReq = new NextRequest('http://localhost:3000/api/admin/users/test_user_001/role', {
      method: 'PATCH',
      headers: { authorization: 'Bearer test-token-admin', 'content-type': 'application/json' },
      body: JSON.stringify({ role: 'teacher' })
    });
    const aRoleRes = await adminRolePATCH(aRoleReq, { params: { id: 'test_user_001' } });
    assert.strictEqual(aRoleRes.status, 200);
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
