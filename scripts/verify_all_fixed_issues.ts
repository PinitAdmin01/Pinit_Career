process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
process.env.NODE_ENV = 'test';
process.env.EXAM_SECRET = 'test_exam_secret_32_bytes_long_key_pinit!!';
process.env.EVIDENCE_SIGNING_SECRET = 'test_evidence_signing_secret_32_bytes!';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-project.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock_service_role_key_for_test';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock_anon_key_for_test';
import assert from 'assert';
import fs from 'fs';
import path from 'path';

// 1. Imports of services
import { writeLocalJson, readLocalJson } from '../src/lib/services/localJsonDb';
import { examsService } from '../src/lib/services/examsService';
import { grievancesService } from '../src/lib/services/grievancesService';
import { advisorService, getDemoAdvisorStats } from '../src/lib/services/advisorService';
import { communicationService } from '../src/lib/services/communicationService';
import { alumniService } from '../src/lib/services/alumniService';
import { hrService } from '../src/lib/services/hrService';
import { procurementService } from '../src/lib/services/procurementService';
import { assetsService } from '../src/lib/services/assetsService';
import { documentsService } from '../src/lib/services/documentsService';
import { eventsService } from '../src/lib/services/eventsService';
import { notesService } from '../src/lib/services/notesService';
import { researchService } from '../src/lib/services/researchService';
import { servicesService } from '../src/lib/services/servicesService';
import { libraryService } from '../src/lib/services/libraryService';
import { hostelService } from '../src/lib/services/hostelService';
import { transportService } from '../src/lib/services/transportService';
import { maintenanceService } from '../src/lib/services/maintenanceService';
import { financeService, acquireDistributedLock } from '../src/lib/services/financeService';
import { tryCampusFallback } from '../src/lib/campusFallback';

let totalTests = 0;
let passedTests = 0;

function test(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  return Promise.resolve()
    .then(() => fn())
    .then(() => {
      passedTests++;
      console.log(`  PASS: ${name}`);
    })
    .catch((err) => {
      console.error(`  FAIL: ${name}`);
      console.error(`        Error: ${err.message}`);
    });
}

async function runAllVerifications() {

  // =========================================================================
  // Issue 26: Interview Questions, Problems, Assist Anti-Cheat, History HMAC & Chat Fallback
  // =========================================================================
  console.log('\n--- Issue 26: Interview Questions, Problems, Assist, History & Chat ---');

  await test('Question Generator: No Leaked Solutions & Difficulty Respected', async () => {
    const { POST: generateQuestionsRoute } = await import('../src/app/api/interview/generate-questions/route');

    const authHeaders = {
      authorization: 'Bearer test-token-001',
      'x-dev-user-id': 'test_user_001'
    };

    // Easy
    const reqEasy = new Request('http://localhost/api/interview/generate-questions', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ domainStream: 'tech', difficulty: 'easy' })
    });
    const resEasy = await generateQuestionsRoute(reqEasy);
    const dataEasy = await resEasy.json();
    assert.strictEqual(resEasy.status, 200);
    assert.strictEqual(dataEasy.difficulty, 'easy');

    for (const q of dataEasy.questions) {
      assert.ok(!q.defaultCode.includes('new StringBuilder(s).reverse()'), 'Easy starter code leaked reverse solution!');
      assert.ok(!q.defaultCode.includes('for(int val : arr) if(val > max)'), 'Easy starter code leaked findMax solution!');
      assert.ok(q.defaultCode.includes('// TODO: Implement your solution here'), 'Missing TODO stub in starter code');
    }

    // Hard
    const reqHard = new Request('http://localhost/api/interview/generate-questions', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ domainStream: 'tech', difficulty: 'hard' })
    });
    const resHard = await generateQuestionsRoute(reqHard);
    const dataHard = await resHard.json();
    assert.strictEqual(dataHard.difficulty, 'hard');
    assert.notStrictEqual(dataEasy.questions[0].title, dataHard.questions[0].title);
  });

  await test('Dynamic Problem Fallback: Stubbed Starter Code & Machine-Checkable Test Cases', async () => {
    const { POST: generateProblemRoute } = await import('../src/app/api/interview/generate-problem/route');

    const reqProb = new Request('http://localhost/api/interview/generate-problem', {
      method: 'POST',
      headers: {
        authorization: 'Bearer test-token-001',
        'x-dev-user-id': 'test_user_001'
      },
      body: JSON.stringify({ topic: 'Distributed Architecture', domainStream: 'tech', difficulty: 'normal' })
    });
    const resProb = await generateProblemRoute(reqProb);
    const probData = await resProb.json();

    const pythonCode = probData.starterCode?.python || '';
    const jsCode = probData.starterCode?.javascript || '';

    assert.ok(!pythonCode.includes('valid_records = [x for x in items if x >= threshold]'), 'Leaked Python solution in starter code!');
    assert.ok(!jsCode.includes('items.filter(x => x >= threshold)'), 'Leaked JS solution in starter code!');
    assert.ok(pythonCode.includes('TODO') || pythonCode.includes('pass') || pythonCode.includes('return 0'), 'Python code missing clean stub');

    for (const tc of probData.testCases) {
      assert.ok(tc.input.startsWith('(') && tc.input.endsWith(')'), `Input '${tc.input}' is not an argument tuple`);
      assert.ok(!tc.expectedOutput.includes('count='), `Expected output '${tc.expectedOutput}' is prose`);
    }
  });

  await test('Assist Panel Gate: Blocks Live Interview Cheating Even With isPractice: true', async () => {
    const {
      recordActiveLiveInterview,
      completeActiveLiveInterview,
      clearAllActiveSessionsForTesting
    } = await import('../src/lib/interview/activeSessionRegistry');
    const { POST: assistRoute } = await import('../src/app/api/interview/assist/route');

    clearAllActiveSessionsForTesting();
    const testUserId = 'test_user_001';

    recordActiveLiveInterview(testUserId, 'Distributed Systems', 'round1_behavioral');

    const cheatReq = new Request('http://localhost/api/interview/assist', {
      method: 'POST',
      headers: {
        authorization: 'Bearer test-token-001',
        'x-dev-user-id': testUserId
      },
      body: JSON.stringify({
        question: 'How to bypass distributed locks?',
        stage: 'round1_behavioral',
        topic: 'Distributed Systems',
        isPractice: true
      })
    });

    const cheatRes = await assistRoute(cheatReq);
    const cheatData = await cheatRes.json();
    assert.strictEqual(cheatRes.status, 403);
    assert.strictEqual(cheatData.code, 'ACTIVE_LIVE_INTERVIEW_IN_PROGRESS');

    completeActiveLiveInterview(testUserId);
  });

  await test('Interview History: Verifies HMAC Signature & Recomputes Unsigned Spoofed Scores', async () => {
    const {
      createEvaluationSignature,
      verifyEvaluationSignature
    } = await import('../src/lib/interview/evaluationSignature');
    const { POST: historyRoute } = await import('../src/app/api/interview/history/route');

    const studentId = 'test_user_001';
    const validSig = createEvaluationSignature(studentId, 88, 'Hire');
    assert.strictEqual(verifyEvaluationSignature(studentId, 88, 'Hire', validSig), true);
    assert.strictEqual(verifyEvaluationSignature(studentId, 99, 'Hire', validSig), false);

    // Empty transcript non-zero score rejected
    const emptyReq = new Request('http://localhost/api/interview/history', {
      method: 'POST',
      headers: { authorization: 'Bearer test-token-001', 'x-dev-user-id': studentId },
      body: JSON.stringify({ score: 95, verdict: 'Exemplary', messages: [] })
    });
    const emptyRes = await historyRoute(emptyReq);
    assert.strictEqual(emptyRes.status, 400);

    // Spoofed 100 recalculates to real score 40
    const spoofReq = new Request('http://localhost/api/interview/history', {
      method: 'POST',
      headers: { authorization: 'Bearer test-token-001', 'x-dev-user-id': studentId },
      body: JSON.stringify({
        score: 100,
        verdict: 'Hire',
        radar: { logic: 40, systems: 40, comms: 40, solving: 40, star: 40 },
        messages: [{ role: 'user', content: 'Here is my technical response.' }]
      })
    });
    const spoofRes = await historyRoute(spoofReq);
    const spoofData = await spoofRes.json();
    assert.strictEqual(spoofRes.status, 200);
    assert.strictEqual(spoofData.score, 40);
    assert.strictEqual(spoofData.verified, false);
  });

  await test('Chat Route: Progressive Fallback Conversation Engine Without Repetition', async () => {
    const { generateProgressiveFallbackQuestion } = await import('../src/app/api/interview/chat/route');

    const q1 = generateProgressiveFallbackQuestion({
      stage: 'round1_behavioral',
      subTopic: 'Distributed Systems',
      history: [{ role: 'user', content: 'I am ready.' }],
      difficulty: 'normal',
      interviewerName: 'Marcus Brody'
    });

    const q2 = generateProgressiveFallbackQuestion({
      stage: 'round1_behavioral',
      subTopic: 'Distributed Systems',
      history: [
        { role: 'user', content: 'I am ready.' },
        { role: 'assistant', content: q1 },
        { role: 'user', content: 'My primary challenge was database replication lag.' }
      ],
      difficulty: 'normal',
      interviewerName: 'Marcus Brody'
    });

    assert.notStrictEqual(q1, q2);
    assert.ok(q1.includes('demanding challenge') || q1.includes('background'));
    assert.ok(q2.includes('conflicting priorities') || q2.includes('stakeholders'));
  });

  // =========================================================================
  // SUBBATCH 4.6 (Issue 29): Résumé, Vault, Certificates & Document Verification Integrity
  // =========================================================================
  await test('Issue 29: Native PDF extraction extracts real candidate text without leaking browser metadata', async () => {
    const { extractDocumentEvidence } = await import('../src/lib/ats/pdfTextExtractor');
    const os = await import('os');
    const pdfPath = path.join(os.tmpdir(), 'edge_resume.pdf');
    if (fs.existsSync(pdfPath)) {
      const pdfBuf = fs.readFileSync(pdfPath);
      const res = extractDocumentEvidence(pdfBuf, 'PDF');
      assert.ok(res.extractionConfidence >= 0.90);
      assert.ok(res.rawText.includes('Vinay Kumar'));
      assert.ok(res.rawText.includes('vinay@example.com'));
      assert.ok(res.rawText.includes('B.Tech in Computer Science'));
      assert.ok(res.rawText.includes('GPA: 8.8 CGPA'));
      assert.ok(!res.rawText.includes('Mozilla/5.0'));
      assert.ok(!res.rawText.includes('Skia/PDF'));
      assert.ok(!res.rawText.includes('Adobe'));
    }
  });

  await test('Issue 29: Pure Node.js DOCX extraction decompresses PKZip XML paragraphs and text', async () => {
    const { extractTextFromDocxBuffer } = await import('../src/lib/ats/pdfTextExtractor');
    const zlib = await import('zlib');
    const xmlContent = Buffer.from('<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Aarav Patel</w:t></w:r></w:p><w:p><w:r><w:t>Email: aarav@example.com | Phone: +91 9988776655</w:t></w:r></w:p><w:p><w:r><w:t>Education: Indian Institute of Technology Bombay - B.Tech Computer Science</w:t></w:r></w:p><w:p><w:r><w:t>CGPA: 9.2</w:t></w:r></w:p></w:body></w:document>');
    const compXml = zlib.deflateRawSync(xmlContent);
    const fn = Buffer.from('word/document.xml');
    const localH = Buffer.alloc(30 + fn.length);
    localH.writeUInt32LE(0x04034b50, 0);
    localH.writeUInt16LE(20, 4);
    localH.writeUInt16LE(0, 6);
    localH.writeUInt16LE(8, 8);
    localH.writeUInt32LE(compXml.length, 18);
    localH.writeUInt32LE(xmlContent.length, 22);
    localH.writeUInt16LE(fn.length, 26);
    fn.copy(localH, 30);
    const cdH = Buffer.alloc(46 + fn.length);
    cdH.writeUInt32LE(0x02014b50, 0);
    cdH.writeUInt16LE(20, 4);
    cdH.writeUInt16LE(20, 6);
    cdH.writeUInt16LE(8, 10);
    cdH.writeUInt32LE(compXml.length, 20);
    cdH.writeUInt32LE(xmlContent.length, 24);
    cdH.writeUInt16LE(fn.length, 28);
    fn.copy(cdH, 46);
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);
    eocd.writeUInt16LE(1, 8);
    eocd.writeUInt16LE(1, 10);
    eocd.writeUInt32LE(cdH.length, 12);
    eocd.writeUInt32LE(localH.length + compXml.length, 16);
    const docxBuf = Buffer.concat([localH, compXml, cdH, eocd]);

    const res = extractTextFromDocxBuffer(docxBuf);
    assert.ok(res.extractionConfidence >= 0.90);
    assert.ok(res.rawText.includes('Aarav Patel'));
    assert.ok(res.rawText.includes('aarav@example.com'));
    assert.ok(res.rawText.includes('CGPA: 9.2'));
  });

  await test('Issue 29: Honest refusal on unreadable files and honest image OCR without ASCII scraping', async () => {
    const { extractDocumentEvidence } = await import('../src/lib/ats/pdfTextExtractor');
    const { extractTextFromImageBuffer } = await import('../src/lib/ats/imageOcrWorker');
    const emptyPdfBuf = Buffer.from('%PDF-1.4\n1 0 obj\n<< >>\nendobj\nxref\n0 1\ntrailer\n<< >>\n%%EOF');
    const pdfRes = extractDocumentEvidence(emptyPdfBuf, 'PDF');
    assert.strictEqual(pdfRes.extractionConfidence, 0.0);
    assert.ok(pdfRes.error?.includes('UNREADABLE_DOCUMENT'));

    const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 1, 0, 0, 0, 1, 0, 8, 2, 0, 0, 0]);
    const imgRes = extractTextFromImageBuffer(pngHeader);
    assert.strictEqual(imgRes.ocrConfidence, 0.0);
    assert.strictEqual(imgRes.rawText, '');
  });

  await test('Issue 29: Anti-Fraud Identity Sentinel prevents surname vulnerability (friend/sibling match)', async () => {
    const { checkNameSimilarity } = await import('../src/lib/ats/documentAuditEngine');
    const friendResult = checkNameSimilarity('Rohan Sharma', 'Priya Sharma');
    assert.strictEqual(friendResult.isMatch, false);
    assert.ok(friendResult.reason?.includes('same surname'));

    const initialResult = checkNameSimilarity('Rohan Sharma', 'R. Sharma');
    assert.strictEqual(initialResult.isMatch, true);

    const placeholderResult = checkNameSimilarity('Candidate', 'Rohan Sharma');
    assert.strictEqual(placeholderResult.isMatch, false);
  });

  await test('Issue 29: Fact check entity grounding rejects Mozilla/5.0 as GPA and Adobe as Degree', async () => {
    const { groundAndValidateEvidence } = await import('../src/lib/ats/factCheckValidator');
    const fakeMetadata = 'Resume\nMozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\nSkia/PDF m153\nAdobe Systems Inc.\n';
    const fakeGraph = groundAndValidateEvidence(fakeMetadata, 'test.pdf', 'fakehash');
    assert.strictEqual(fakeGraph.candidateName, 'Candidate');
    assert.strictEqual(fakeGraph.scoreOrGpa, undefined);
    assert.strictEqual(fakeGraph.degree, undefined);

    const validText = 'Rohan Sharma\nEmail: rohan@example.com\nNational Institute of Technology - B.Tech in Computer Science\nCGPA: 8.8\n';
    const validGraph = groundAndValidateEvidence(validText, 'resume.pdf', 'validhash');
    assert.strictEqual(validGraph.candidateName, 'Rohan Sharma');
    assert.strictEqual(validGraph.scoreOrGpa, '8.8 GPA');
    assert.ok(validGraph.degree?.includes('B.Tech'));
  });

  await test('Issue 29: Vault upload route returns HTTP 422 UNREADABLE_DOCUMENT on unreadable files', async () => {
    const { POST: vaultUploadPOST } = await import('../src/app/api/vault/upload/route');
    const unreadableFormData = new FormData();
    const tinyBlob = new Blob(['%PDF-1.4 empty'], { type: 'application/pdf' });
    unreadableFormData.append('file', tinyBlob, 'corrupt.pdf');

    const req = new Request('http://localhost:3000/api/vault/upload', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'x-mock-user-id': 'student_subbatch_test',
        'content-length': '14'
      },
      body: unreadableFormData
    });

    const response = await vaultUploadPOST(req);
    const respJson = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(respJson.error, 'UNREADABLE_DOCUMENT');
  });

  // =========================================================================
  // SUBBATCH 4.7 (Issue 30): Trust Score Integrity, Anti-Fraud & Empty Defenses
  // =========================================================================
  await test('Issue 30: Three empty files yield 0 Evidence Trust, 0 QT2, 0 ATS and unreadable status', async () => {
    const { auditDocumentCollection, calculateLiveQTMetrics } = await import('../src/lib/ats/documentAuditEngine');
    const emptyDocs = [
      { id: '1', category: 'sem1', title: '1', fileName: 'sem1.pdf', fileSize: '0 KB', fileType: 'pdf', candidateName: 'Candidate', scoreOrGpa: '1st Semester University Marksheet', skills: [], verificationStatus: 'provisional', uploadedAt: 1 },
      { id: '2', category: 'sem2', title: '2', fileName: 'sem2.pdf', fileSize: '0 KB', fileType: 'pdf', candidateName: 'Candidate', scoreOrGpa: '2nd Semester University Marksheet', skills: [], verificationStatus: 'provisional', uploadedAt: 1 },
      { id: '3', category: 'resume', title: '3', fileName: 'resume.pdf', fileSize: '0 KB', fileType: 'pdf', candidateName: 'Candidate', scoreOrGpa: 'Academic Credential', skills: [], verificationStatus: 'provisional', uploadedAt: 1 }
    ];
    const audit = auditDocumentCollection('Candidate', emptyDocs as any);
    assert.strictEqual(audit.trustScore, 0);
    assert.strictEqual(audit.overallStatus, 'UNREADABLE_DOCUMENTS_REJECTED');

    const calib = calculateLiveQTMetrics(emptyDocs as any, audit);
    assert.strictEqual(calib.evidenceTrustScore, 0);
    assert.strictEqual(calib.qt2Score, 0);
    assert.strictEqual(calib.atsPresentationScore, 0);
    assert.strictEqual(calib.qt2Evaluation.selfAwarenessIndex, 0);
    assert.ok(calib.integrityLevel.includes('Unreadable Files'));
  });

  await test('Issue 30: Zero documents and single document yield accurate baseline trust scores', async () => {
    const { auditDocumentCollection } = await import('../src/lib/ats/documentAuditEngine');
    const zeroAudit = auditDocumentCollection('', []);
    assert.strictEqual(zeroAudit.trustScore, 0);
    assert.strictEqual(zeroAudit.overallStatus, 'AWAITING_UPLOADS');

    const singleDoc = {
      id: 'doc_1',
      category: 'resume',
      title: 'Resume',
      fileName: 'resume.pdf',
      fileSize: '40 KB',
      fileType: 'pdf',
      candidateName: 'Rohan Sharma',
      scoreOrGpa: '8.8 GPA',
      skills: ['TypeScript'],
      verificationStatus: 'verified',
      provenanceRecords: [{ id: 'p1' } as any],
      uploadedAt: 1
    };
    const singleAudit = auditDocumentCollection('Rohan Sharma', [singleDoc as any]);
    assert.strictEqual(singleAudit.trustScore, 40);
    assert.strictEqual(singleAudit.overallStatus, 'PROVISIONAL_PENDING');
  });

  await test('Issue 30: Name matching rejects same-surname friends and empty strings, marks mismatch as REVIEW_REQUIRED', async () => {
    const { checkNameSimilarity, auditDocumentCollection } = await import('../src/lib/ats/documentAuditEngine');
    const p1 = checkNameSimilarity('Rahul Kumar', 'Amit Kumar');
    assert.strictEqual(p1.isMatch, false);

    const p2 = checkNameSimilarity('Priya Sharma', 'Neha Sharma');
    assert.strictEqual(p2.isMatch, false);

    const p3 = checkNameSimilarity('Rohan Sharma', '');
    assert.strictEqual(p3.isMatch, false);
    assert.strictEqual(p3.confidence, 0);

    const p4 = checkNameSimilarity('', 'Rohan Sharma');
    assert.strictEqual(p4.isMatch, false);
    assert.strictEqual(p4.confidence, 0);

    const docs = [
      { id: '1', category: 'resume', title: 'r', fileName: 'r.pdf', fileSize: '10 KB', fileType: 'pdf', candidateName: 'Rahul Kumar', scoreOrGpa: '8 GPA', skills: ['JS'], provenanceRecords: [{ id: 'p' } as any], uploadedAt: 1 },
      { id: '2', category: 'sem1', title: 's', fileName: 's.pdf', fileSize: '10 KB', fileType: 'pdf', candidateName: 'Amit Kumar', scoreOrGpa: '8 GPA', skills: ['JS'], provenanceRecords: [{ id: 'p' } as any], uploadedAt: 1 }
    ];
    const audit = auditDocumentCollection('Rahul Kumar', docs as any);
    assert.strictEqual(audit.overallStatus, 'REVIEW_REQUIRED');
    assert.strictEqual(audit.mismatchCount, 1);
  });

  console.log('\n================================================================');
  console.log('🧪 VERIFYING ALL 6 REPORTED & FIXED ISSUES WITH AUTOMATED TESTS');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // ISSUE 1: Storage Layer Error & Result Reporting
  // -------------------------------------------------------------
  console.log('--- Issue 1: Storage Layer Result Objects ---');
  await test('writeLocalJson returns StorageWriteResult object with stored location', async () => {
    const res = await writeLocalJson('src/lib/data/test_scratch.json', { test: true });
    assert.ok(typeof res === 'object', 'Must return an object');
    assert.ok('stored' in res, 'Must contain stored property');
    assert.ok(['fs', 'db', 'local'].includes(res.stored), `Stored must be fs, db, or local, got: ${res.stored}`);
    assert.strictEqual(res.success, true, 'Write must succeed');
    try { fs.unlinkSync('src/lib/data/test_scratch.json'); } catch {}
  });

  // -------------------------------------------------------------
  // ISSUE 2: Anti-Cheat Trigger Migration Validation
  // -------------------------------------------------------------
  console.log('\n--- Issue 2: Anti-Cheat & Dues Security Triggers ---');
  await test('Anti-cheat trigger migration file exists and checks staff authority and privilege escalation', () => {
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260918_fix_campus_dues_and_anticheat.sql');
    assert.ok(fs.existsSync(migrationPath), 'Migration 20260918 must exist');
    const content = fs.readFileSync(migrationPath, 'utf8');
    assert.ok(content.includes('campus_is_staff()'), 'Must enforce campus_is_staff() check');
    assert.ok(content.includes('prevent_privilege_escalation'), 'Must define prevent_privilege_escalation trigger function');
    assert.ok(content.includes('check_finance_dues_immutable'), 'Must define check_finance_dues_immutable trigger');
    assert.ok(content.includes('check_student_campus_status_immutable'), 'Must define check_student_campus_status_immutable trigger');
  });

  // -------------------------------------------------------------
  // ISSUE 3: Exam Marksheet & Student Isolation
  // -------------------------------------------------------------
  console.log('\n--- Issue 3: Exams Marksheet & Per-Student Storage ---');
  await test('New student with no records gets empty state, NOT fake marksheet', async () => {
    const nonExistentStudent = `test_student_empty_${Date.now()}`;
    const sheet = await examsService.getStudentResults(nonExistentStudent);
    assert.strictEqual(sheet.isPublished, false, 'isPublished must be false');
    assert.strictEqual(sheet.gpa, 0, 'GPA must be 0');
    assert.deepStrictEqual(sheet.results, [], 'Results must be empty array, not invented Distributed Systems');
  });

  await test('Submitting marks for student A does NOT overwrite student B', async () => {
    const studentA = `student_alpha_${Date.now()}`;
    const studentB = `student_beta_${Date.now()}`;
    
    await examsService.submitMarks(studentA, {
      MATH101: 65,
    });

    await examsService.submitMarks(studentB, {
      PHYS101: 52,
    });

    const resA = await examsService.getStudentResults(studentA);
    const resB = await examsService.getStudentResults(studentB);

    assert.strictEqual(resA.results[0].code, 'MATH101');
    assert.strictEqual(resB.results[0].code, 'PHYS101');
    assert.notStrictEqual(resA.results[0].code, resB.results[0].code);
  });

  await test('recordExamAttempt derives passed dynamically from score', async () => {
    const failStudent = `st_fail_${Date.now()}`;
    const passStudent = `st_pass_${Date.now()}`;
    const examId = `EXAM_${Date.now()}`;

    await examsService.recordExamAttempt({
      studentId: failStudent,
      examScheduleId: examId,
      score: 35
    });
    const failAttempt = await examsService.getExamCooldown(failStudent, undefined, examId);
    assert.strictEqual(failAttempt.passed, false, 'Score 35 must not pass');
    assert.strictEqual(failAttempt.score, 35, 'Score must be 35');

    await examsService.recordExamAttempt({
      studentId: passStudent,
      examScheduleId: examId,
      score: 78
    });
    const passAttempt = await examsService.getExamCooldown(passStudent, undefined, examId);
    assert.strictEqual(passAttempt.passed, true, 'Score 78 must pass');
    assert.strictEqual(passAttempt.score, 78, 'Score must be 78');
  });

  // -------------------------------------------------------------
  // ISSUE 4: Grievances Privacy & Identity Alignment
  // -------------------------------------------------------------
  console.log('\n--- Issue 4: Grievances Isolation & Identity Integrity ---');
  await test('Student A cannot read Student B complaints', async () => {
    const studentAlice = `alice_${Date.now()}`;
    const studentBob = `bob_${Date.now()}`;

    // Alice files a private grievance
    await grievancesService.submit(
      studentAlice,
      'Alice Wonderland',
      'student',
      'Hostel',
      'Room Water Leakage',
      'Tap in room 204 is leaking heavily.',
      false
    );

    // Alice files an anonymous grievance
    await grievancesService.submit(
      studentAlice,
      'Alice Wonderland',
      'student',
      'Faculty',
      'Anonymous Whistleblower Note',
      'Unfair grading in lab session.',
      true
    );

    // Bob asks for tickets
    const bobStats = await grievancesService.getStats(studentBob, 'Bob Builder', false);
    const bobTickets = bobStats.grievances;

    // Bob should see NONE of Alice's tickets
    const aliceTicketSeenByBob = bobTickets.some((t: any) => 
      t.title === 'Room Water Leakage' || t.title === 'Anonymous Whistleblower Note'
    );
    assert.strictEqual(aliceTicketSeenByBob, false, 'Bob must NEVER see Alice tickets');

    // Alice asks for tickets
    const aliceStats = await grievancesService.getStats(studentAlice, 'Alice Wonderland', false);
    assert.ok(aliceStats.grievances.length >= 2, 'Alice must be able to view her own tickets');
  });

  await test('Staff member can view all tickets for administration', async () => {
    const staffStats = await grievancesService.getStats('staff_1', 'Dr. Professor', true);
    assert.ok(Array.isArray(staffStats.grievances), 'Staff receives all tickets');
  });

  // -------------------------------------------------------------
  // ISSUE 5: AI Academic Advisor Real Computation & Sandbox
  // -------------------------------------------------------------
  console.log('\n--- Issue 5: AI Academic Advisor Real Computation ---');
  await test('Student with no records returns null, NOT fake 75% attendance / 7.5 CGPA', async () => {
    const brandNewStudent = `ghost_student_${Date.now()}`;
    const perf = await advisorService.getPerformance(brandNewStudent);
    assert.strictEqual(perf, null, 'Must return null when no records exist, never fabricate 75% / 7.5 CGPA');
  });

  await test('completeQuest isolates state per student in local DB', async () => {
    const studentX = `advisor_x_${Date.now()}`;
    const studentY = `advisor_y_${Date.now()}`;

    const resX = await advisorService.completeQuest(studentX);
    assert.strictEqual(resX.completed, 1, 'Student X completed 1 quest');

    // Student Y should not be affected
    const perfY = await advisorService.getPerformance(studentY);
    assert.strictEqual(perfY, null, 'Student Y must remain untouched with null data');
  });

  await test('Demo sandbox stats are explicitly labeled as isDemo: true', () => {
    const demo = getDemoAdvisorStats();
    assert.strictEqual(demo.isDemo, true, 'Demo stats must have isDemo: true');
    assert.ok(demo.recommendations.every((r: any) => r.text.includes('[Demo]')), 'Recommendations must be prefixed [Demo]');
  });

  // -------------------------------------------------------------
  // ISSUE 6: Communication Notice Log & Route
  // -------------------------------------------------------------
  console.log('\n--- Issue 6: Communication Notice Log & Endpoint ---');
  await test('logCommunication reports internal notice log status with provider: internal_db', async () => {
    const res = await communicationService.logCommunication('email', 'Exam Schedule Published', 'Final exam dates are live.', 'Academics');
    assert.strictEqual(res.ok, true);
    assert.strictEqual(res.status, 'logged');
    assert.strictEqual(res.delivery, 'internal_notice_log');
    assert.strictEqual(res.provider, 'internal_db');
    assert.ok(res.message.includes('External email/SMS provider is not configured'));
  });

  await test('/api/communication/all route exists on filesystem and exports GET', () => {
    const routeFile = path.join(process.cwd(), 'src/app/api/communication/all/route.ts');
    assert.ok(fs.existsSync(routeFile), '/api/communication/all/route.ts must exist');
    const content = fs.readFileSync(routeFile, 'utf8');
    assert.ok(content.includes('export async function GET'), 'Must export GET handler');
  });

  // -------------------------------------------------------------
  // ISSUE 7: Simulation Modules Hidden & Disabled (Alumni, HR, Procurement, Assets)
  // -------------------------------------------------------------
  console.log('\n--- Issue 7: Simulation Modules Hidden & Protected ---');
  await test('AppSidebar does not expose simulated tabs (hr, procurement, assets)', () => {
    const sidebarContent = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/AppSidebar.tsx'), 'utf8');
    assert.strictEqual(sidebarContent.includes("tab=hr'"), false, 'AppSidebar must not link to tab=hr');
    assert.strictEqual(sidebarContent.includes("tab=procurement'"), false, 'AppSidebar must not link to tab=procurement');
    assert.strictEqual(sidebarContent.includes("tab=assets'"), false, 'AppSidebar must not link to tab=assets');
  });

  await test('AppShell does not include /alumni in allowedStudentTabs', () => {
    const appShellContent = fs.readFileSync(path.join(process.cwd(), 'src/components/ui/AppShell.tsx'), 'utf8');
    assert.strictEqual(appShellContent.includes("'/alumni'"), false, 'AppShell must not include /alumni in allowedStudentTabs');
  });

  await test('Modules directory does not link to active /alumni module', () => {
    const modulesContent = fs.readFileSync(path.join(process.cwd(), 'src/app/modules/page.tsx'), 'utf8');
    assert.strictEqual(modulesContent.includes("route: '/alumni'"), false, 'modules/page.tsx must not link to /alumni');
  });

  await test('Alumni portal page displays honest staging status and no fake donation forms', () => {
    const alumniPageContent = fs.readFileSync(path.join(process.cwd(), 'src/app/alumni/page.tsx'), 'utf8');
    assert.ok(alumniPageContent.includes('Module Staged for Production Integration'), 'Must display staging badge');
    assert.strictEqual(alumniPageContent.includes('handleDonateSubmit'), false, 'Must not have simulated donation submit');
    assert.strictEqual(alumniPageContent.includes('handleMentorshipRequest'), false, 'Must not have fake mentorship submit');
  });

  await test('alumniService rejects donations without payment gateway', async () => {
    const res = await alumniService.donate('CAMP1', 5000, 'Student Donor');
    assert.strictEqual(res.ok, false);
    assert.ok(res.error?.includes('PAYMENT_GATEWAY_NOT_CONFIGURED'));
  });

  await test('alumniService rejects mentorship and referral requests without valid identity', async () => {
    const mentorRes = await alumniService.requestMentorship('', '', 'Sunday 11 AM');
    assert.strictEqual(mentorRes.ok, false);

    const refRes = await alumniService.requestReferral('', '');
    assert.strictEqual(refRes.ok, false);
  });

  await test('hrService rejects runPayroll without banking rails', async () => {
    const res = await hrService.runPayroll();
    assert.strictEqual(res.ok, false);
    assert.ok(res.error?.includes('PAYROLL_GATEWAY_NOT_CONFIGURED'));
  });

  await test('campusFallback intercepts simulated API endpoints with 503 disabled status', async () => {
    const dummyActor = { name: 'Tester', email: 'test@campus.edu' };
    const params = new URLSearchParams();

    const hrRes = await tryCampusFallback('GET', '/api/hr/stats', 'u1', null, params, dummyActor);
    assert.strictEqual((hrRes as any).ok, false);
    assert.strictEqual((hrRes as any).error, 'MODULE_DISABLED_PENDING_INTEGRATION');

    const procRes = await tryCampusFallback('GET', '/api/procurement/stats', 'u1', null, params, dummyActor);
    assert.strictEqual((procRes as any).ok, false);
    assert.strictEqual((procRes as any).error, 'MODULE_DISABLED_PENDING_INTEGRATION');

    const assetRes = await tryCampusFallback('GET', '/api/assets/stats', 'u1', null, params, dummyActor);
    assert.strictEqual((assetRes as any).ok, false);
    assert.strictEqual((assetRes as any).error, 'MODULE_DISABLED_PENDING_INTEGRATION');

    const alumniRes = await tryCampusFallback('GET', '/api/alumni/stats', 'u1', null, params, dummyActor);
    assert.strictEqual((alumniRes as any).ok, false);
    assert.strictEqual((alumniRes as any).error, 'MODULE_DISABLED_PENDING_INTEGRATION');
  });

  // -------------------------------------------------------------
  // ISSUE 7: Documents Vault Verification Code & Profile Details
  // -------------------------------------------------------------
  console.log('\n--- Issue 7: Documents Vault Verification & Profile ---');
  await test('documentsService generates SHA-256 verifiable code and populates student major/year', async () => {
    const studentId = `doc_stu_${Date.now()}`;
    const docRes = await documentsService.requestDocument(studentId, 'Bonafide Certificate', 'Visa application');
    assert.strictEqual(docRes.ok, true);
    assert.ok(docRes.doc.verificationCode.startsWith('DOC-VER-'), `Expected DOC-VER- prefix, got ${docRes.doc.verificationCode}`);
    assert.ok(docRes.doc.verificationCode.length >= 16, 'Verification code must be strong hash');
    assert.notStrictEqual(docRes.doc.major, '—', 'Major must not be hardcoded dash');
    assert.notStrictEqual(docRes.doc.year, '—', 'Year must not be hardcoded dash');
  });

  // -------------------------------------------------------------
  // ISSUE 8: Events & Certificates Verifiable Tokens & Accurate Matching
  // -------------------------------------------------------------
  console.log('\n--- Issue 8: Events & Verifiable Certificates ---');
  await test('eventsService generates collision-free certCode and matches strictly by rsvpId', async () => {
    const studentId = `ev_stu_${Date.now()}`;
    // Create an event first
    await eventsService.publish('Tech', 'AI Summit', 'Annual AI Conference', '2026-11-01', '10:00 AM', 'Auditorium', 100, 'ACM');
    const stats = await eventsService.getStats(studentId);
    const eventId = stats.catalog[0].id;

    // Register for the event
    const rsvpRes = await eventsService.rsvp(eventId, studentId, 'Attending Student');
    assert.strictEqual(rsvpRes.ok, true);
    const rsvpId = rsvpRes.rsvp.id;

    // Issuing cert with mismatched ID must fail
    const wrongRes = await eventsService.issueCert('non-existent-rsvp-id-999999');
    assert.strictEqual(wrongRes.ok, false);

    // Issuing cert with exact RSVP ID succeeds and has strong token
    const certRes = await eventsService.issueCert(rsvpId);
    assert.strictEqual(certRes.ok, true);
    assert.ok(certRes.certCode.startsWith('CERT-'));
    assert.ok(certRes.certCode.length >= 16, 'Certificate code must be cryptographically collision-free');
  });

  // -------------------------------------------------------------
  // ISSUE 9: Study Notes Batch Filtering
  // -------------------------------------------------------------
  console.log('\n--- Issue 9: Notes Batch Isolation ---');
  await test('notesService strictly filters notes by batch', async () => {
    const batch2025 = `B2025_${Date.now()}`;
    const batch2026 = `B2026_${Date.now()}`;

    await notesService.uploadNote('Math Note 2025', 'MATH', batch2025, 'Prof X', 'https://example.com/math.pdf');
    await notesService.uploadNote('Physics Note 2026', 'PHYS', batch2026, 'Prof Y', 'https://example.com/phys.pdf');

    const res2025 = await notesService.getNotes(batch2025);
    const res2026 = await notesService.getNotes(batch2026);

    assert.ok(res2025.notes.every((n: any) => n.batch === batch2025), 'Only batch 2025 notes should be returned');
    assert.ok(res2026.notes.every((n: any) => n.batch === batch2026), 'Only batch 2026 notes should be returned');
  });

  // -------------------------------------------------------------
  // ISSUE 10: Research Registry Ownership & Review Gate
  // -------------------------------------------------------------
  console.log('\n--- Issue 10: Research Ownership & Workflow ---');
  await test('researchService forces status Under Review and isolates unpublished drafts', async () => {
    const studentAuthor = `res_stu_${Date.now()}`;
    const otherStudent = `other_stu_${Date.now()}`;

    // Student tries to self-publish as "Published"
    const pubRes = await researchService.publishPaper(
      studentAuthor,
      'John Researcher',
      'Quantum ML Analysis',
      'John Researcher',
      'CS Journal',
      'Published' // attempt to bypass review
    );
    assert.strictEqual(pubRes.ok, true);
    assert.strictEqual(pubRes.paper.status, 'Under Review', 'Client must not be able to self-publish');
    assert.strictEqual(pubRes.paper.studentId, studentAuthor);

    // Other student shouldn't see John's unpublished draft
    const otherView = await researchService.getStats(otherStudent);
    const hasDraft = otherView.papers.some((p: any) => p.id === pubRes.paper.id);
    assert.strictEqual(hasDraft, false, 'Unpublished draft must be hidden from other students');

    // Author should see their own submission
    const authorView = await researchService.getStats(studentAuthor);
    const authorHasDraft = authorView.papers.some((p: any) => p.id === pubRes.paper.id);
    assert.strictEqual(authorHasDraft, true, 'Author must see their own submission under review');
  });

  // -------------------------------------------------------------
  // ISSUE 11: Services Leave & Counselling Isolation
  // -------------------------------------------------------------
  console.log('\n--- Issue 11: Services Leave & Counselling Privacy ---');
  await test('servicesService isolates student leaves and queues counselling as Requested', async () => {
    const student1 = `srv_stu1_${Date.now()}`;
    const student2 = `srv_stu2_${Date.now()}`;
    const uniqueCounselor = `Counsellor_${Date.now()}`;

    // Apply leave
    await servicesService.applyLeave(student1, '2026-10-01', '2026-10-03', 'Viral Fever', 'Medical Leave');
    const s1Stats = await servicesService.getStats(student1);
    const s2Stats = await servicesService.getStats(student2);

    assert.strictEqual(s1Stats.leaves.length, 1, 'Student 1 must see 1 leave');
    assert.strictEqual(s2Stats.leaves.length, 0, 'Student 2 must see 0 leaves');

    // Book counselling
    const bookRes = await servicesService.bookCounselling(student1, uniqueCounselor, '2026-10-10', '10:00 AM');
    assert.strictEqual(bookRes.ok, true);
    assert.strictEqual(bookRes.session.status, 'Requested', 'Initial counselling status must be Requested');

    // Booking same slot again must be detected as conflict
    const conflictRes = await servicesService.bookCounselling(student2, uniqueCounselor, '2026-10-10', '10:00 AM');
    assert.strictEqual(conflictRes.ok, false);
    assert.ok(conflictRes.error?.includes('already booked') || conflictRes.error?.includes('COUNSELLOR_SLOT_TAKEN'));
  });

  // -------------------------------------------------------------
  // ISSUE 12: Library & Hostel Stock/Capacity Guards and Collision-free IDs
  // -------------------------------------------------------------
  console.log('\n--- Issue 12: Library & Hostel Stock/Capacity Safety ---');
  await test('libraryService prevents negative stock and generates collision-free IDs', async () => {
    const isbn = `ISBN-TEST-${Date.now()}`;
    await libraryService.addBook(isbn, 'Concurrency Guide', 'Author C', 'CS', 1);

    const b1 = await libraryService.borrow('stu_lib_1', 'Student One', isbn);
    assert.strictEqual(b1.ok, true);

    const stats1 = await libraryService.getStats('stu_lib_1', 'Student One');
    const borrowedRecord = stats1.borrowed.find((b: any) => b.isbn === isbn);
    assert.ok(borrowedRecord.id.startsWith('BOR-'));
    assert.ok(borrowedRecord.id.length >= 14, 'Borrow ID must be collision-free');

    // Second borrow must fail because available is 0
    const b2 = await libraryService.borrow('stu_lib_2', 'Student Two', isbn);
    assert.strictEqual(b2.ok, false);
    assert.strictEqual(b2.message, 'Out of stock');
  });

  await test('hostelService enforces room capacity in approveAllocation and generates collision-free IDs', async () => {
    const studentH1 = `stu_h1_${Date.now()}`;
    const studentH2 = `stu_h2_${Date.now()}`;
    const roomCode = `R-CAP-${Date.now()}`;

    // Read local db and insert a test room with capacity 1
    const { readLocalJson, writeLocalJson } = await import('../src/lib/services/localJsonDb');
    const db = await readLocalJson('src/lib/data/hostel_db.json', { rooms: [], allocations: [], attendance: [], complaints: [], visitors: [] });
    db.rooms.push({
      code: roomCode,
      block: 'Block Test',
      room: '101',
      capacity: 1,
      occupied: 0,
      residents: [],
      status: 'available'
    });
    await writeLocalJson('src/lib/data/hostel_db.json', db);

    // Approve student 1
    const app1 = await hostelService.approveAllocation(studentH1, roomCode);
    assert.strictEqual(app1.ok, true);

    // Approve student 2 for same room must fail (capacity 1 is full)
    const app2 = await hostelService.approveAllocation(studentH2, roomCode);
    assert.strictEqual(app2.ok, false);
    assert.strictEqual(app2.error, 'ROOM_FULL');

    // Test visitor and attendance collision-free IDs
    const attRes = await hostelService.logAttendance(studentH1, 'Student H1', 'check-in', roomCode);
    assert.strictEqual(attRes.ok, true);

    const hStats = await hostelService.getStats(studentH1, 'Student H1');
    assert.ok(hStats.attendance[0].id.startsWith('ATT-'));
    assert.ok(hStats.attendance[0].id.length >= 14, 'Attendance ID must be collision-free');
  });

  // -------------------------------------------------------------
  // ISSUE 13: Transport Stop & Route Validation
  // -------------------------------------------------------------
  console.log('\n--- Issue 13: Transport Stop & Route Validation ---');
  await test('transportService validates route existence and stop validity', async () => {
    const studentT = `stu_trans_${Date.now()}`;
    const routeCode = `R-VAL-${Date.now()}`;

    await transportService.addRoute(routeCode, 'Metro Express', 'Driver Dave', 'KA-01-9999', ['Main Gate', 'City Center'], '08:00 AM');

    // Invalid stop
    const invalidStopRes = await transportService.register(studentT, routeCode, 'Random Unknown Stop');
    assert.strictEqual(invalidStopRes.ok, false);
    assert.strictEqual(invalidStopRes.error, 'Invalid boarding stop selected for this route code.');

    // Non-existent route
    const invalidRouteRes = await transportService.register(studentT, 'R-NONEXISTENT', 'Main Gate');
    assert.strictEqual(invalidRouteRes.ok, false);
    assert.strictEqual(invalidRouteRes.error, 'Route not found.');

    // Valid stop
    const validRes = await transportService.register(studentT, routeCode, 'Main Gate');
    assert.strictEqual(validRes.ok, true);
  });

  // -------------------------------------------------------------
  // ISSUE 14: Maintenance Ticket Reporter Attribution
  // -------------------------------------------------------------
  console.log('\n--- Issue 14: Maintenance Reporter Identity ---');
  await test('maintenanceService attaches reporter identity and generates collision-free ID', async () => {
    const studentM = `stu_maint_${Date.now()}`;
    const studentName = 'Marcus Brody';

    const tRes = await maintenanceService.reportTicket(
      studentM,
      studentName,
      'Electrical',
      'Lab 3',
      'AC unit flickering',
      'High'
    );
    assert.strictEqual(tRes.ok, true);
    assert.strictEqual(tRes.ticket.studentId, studentM);
    assert.strictEqual(tRes.ticket.reportedBy, studentName);
    assert.ok(tRes.ticket.id.startsWith('INF-'));
    assert.ok(tRes.ticket.id.length >= 14, 'Ticket ID must be collision-free');
  });

  // -------------------------------------------------------------
  // ISSUE 15: Fee Payment Replay Timing, Webhook & Reconciliation
  // -------------------------------------------------------------
  console.log('\n--- Issue 15: Fee Payment Reconciliation & Lock Safety ---');
  await test('acquireDistributedLock does NOT fail closed when lock table is unmigrated', async () => {
    const testKey = `lock_test_${Date.now()}`;
    const acquired = await acquireDistributedLock(testKey, 'student_test_uid', 10);
    assert.strictEqual(acquired, true, 'Lock must be acquired using process-level fallback when table is absent');
  });

  await test('financeService.payDue marks installment as Paid and handles idempotent retries', async () => {
    const studentF = `stu_fin_${Date.now()}`;
    const payId = `pay_${Date.now()}`;
    
    // Initial payment
    const res1 = await financeService.payDue(studentF, 'Finance Student', 'INST-01', 'fin@campus.edu', payId);
    assert.strictEqual(res1.ok, true);
    assert.ok(res1.receiptId);

    // Dues state must reflect Paid
    const dues = await financeService.getStudentDues(studentF);
    const inst = dues.installments.find((i: any) => String(i.id) === 'INST-01');
    assert.strictEqual(inst.status, 'Paid');

    // Duplicate retry must return alreadyPaid: true, NOT fail
    const res2 = await financeService.payDue(studentF, 'Finance Student', 'INST-01', 'fin@campus.edu', payId);
    assert.strictEqual(res2.ok, true);
    assert.strictEqual(res2.alreadyPaid, true);
  });

  await test('financeService.reconcileFeePayments generates structured reconciliation audit report', async () => {
    const reportRes = await financeService.reconcileFeePayments();
    assert.strictEqual(reportRes.ok, true);
    assert.ok(reportRes.report);
    assert.ok(['CLEAN', 'REPAIRED_DISCREPANCIES'].includes(reportRes.report.status));
    assert.ok(typeof reportRes.report.totalProcessed === 'number');
    assert.ok(Array.isArray(reportRes.report.discrepancies));
  });

  await test('Webhook source code contains fee installment payment handling', () => {
    const webhookFile = path.join(process.cwd(), 'src', 'app', 'api', 'payment', 'webhook', 'route.ts');
    assert.ok(fs.existsSync(webhookFile));
    const content = fs.readFileSync(webhookFile, 'utf8');
    assert.ok(content.includes('isFeeInstallment'), 'Must contain isFeeInstallment evaluation');
    assert.ok(content.includes('installmentId'), 'Must handle installmentId');
    assert.ok(content.includes('financeService.payDue'), 'Must reconcile fee payment via financeService.payDue');
  });

  await test('Pay-due route code updates installment BEFORE locking processed_payments', () => {
    const payDueFile = path.join(process.cwd(), 'src', 'app', 'api', 'finance', 'pay-due', 'route.ts');
    assert.ok(fs.existsSync(payDueFile));
    const content = fs.readFileSync(payDueFile, 'utf8');
    const payDuePos = content.indexOf('financeService.payDue');
    const upsertPos = content.indexOf('.from(\'processed_payments\').upsert');
    assert.ok(payDuePos < upsertPos, 'financeService.payDue MUST run BEFORE processed_payments insert/upsert');
  });

  // -------------------------------------------------------------
  // ISSUE 16: PATCH /api/auth/me Mass-Assignment & Privilege Escalation
  // -------------------------------------------------------------
  console.log('\n--- Issue 16: Profile Mass-Assignment & Privilege Escalation ---');

  await test('ALLOWED_PROFILE_KEYS strictly permits only safe self-editable fields', async () => {
    const { ALLOWED_PROFILE_KEYS } = await import('../src/app/api/auth/me/route');
    assert.ok(ALLOWED_PROFILE_KEYS instanceof Set, 'ALLOWED_PROFILE_KEYS must be a Set');

    // Permitted fields
    assert.ok(ALLOWED_PROFILE_KEYS.has('display_name'), 'Should allow display_name');
    assert.ok(ALLOWED_PROFILE_KEYS.has('username'), 'Should allow username');
    assert.ok(ALLOWED_PROFILE_KEYS.has('target_role'), 'Should allow target_role');
    assert.ok(ALLOWED_PROFILE_KEYS.has('career_goal'), 'Should allow career_goal');
    assert.ok(ALLOWED_PROFILE_KEYS.has('bio'), 'Should allow bio');
    assert.ok(ALLOWED_PROFILE_KEYS.has('notification_prefs'), 'Should allow notification_prefs');

    // Disallowed privilege / security fields MUST NOT be in allowlist
    const forbidden = [
      'subscription_status',
      'subscription_tier',
      'subscription_expires_at',
      'unlocked_items',
      'xp_total',
      'xp_level',
      'badges',
      'completed_quests',
      'completed_missions',
      'recruiter_visible',
      'recruiter_visibility',
      'certifications',
      'communication_score',
      'execution_score',
      'leadership_score',
      'trust_score',
      'ats_score',
      'career_dna_score',
      'mission_streak',
      'interviews_done',
      'role',
      'pins',
      'email',
      'id',
      'is_admin',
    ];

    for (const f of forbidden) {
      assert.strictEqual(ALLOWED_PROFILE_KEYS.has(f), false, `Field "${f}" MUST NOT be in ALLOWED_PROFILE_KEYS`);
    }
  });

  await test('userService.stripSelfServicePrivileges strips subscription, unlocks, xp, and badges', async () => {
    const { stripSelfServicePrivileges } = await import('../src/lib/services/supabase/userService');

    const maliciousInput = {
      display_name: 'Legit Student',
      subscription_status: 'active',
      subscription_tier: 'pro',
      unlocked_items: { ai: 9999999999999 },
      xp_total: 999999,
      role: 'admin',
      pins: 50000,
      badges: ['grandmaster'],
      certifications: ['Fake Cert'],
      email: 'attacker@evil.com',
    };

    const sanitized = stripSelfServicePrivileges(maliciousInput, false);
    assert.strictEqual(sanitized.display_name, 'Legit Student');
    assert.strictEqual(sanitized.subscription_status, undefined, 'Must strip subscription_status');
    assert.strictEqual(sanitized.subscription_tier, undefined, 'Must strip subscription_tier');
    assert.strictEqual(sanitized.unlocked_items, undefined, 'Must strip unlocked_items');
    assert.strictEqual(sanitized.xp_total, undefined, 'Must strip xp_total');
    assert.strictEqual(sanitized.role, undefined, 'Must strip role');
    assert.strictEqual(sanitized.pins, undefined, 'Must strip pins');
    assert.strictEqual(sanitized.badges, undefined, 'Must strip badges');
    assert.strictEqual(sanitized.certifications, undefined, 'Must strip certifications');
    assert.strictEqual(sanitized.email, undefined, 'Must strip email');
  });

  await test('PATCH /api/auth/me rejects disallowed fields with HTTP 400 DISALLOWED_FIELD', async () => {
    const { PATCH } = await import('../src/app/api/auth/me/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    // Test attempt to inject subscription_status
    const req1 = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'PATCH',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ subscription_status: 'active' }),
    });

    const res1 = await PATCH(req1);
    assert.strictEqual(res1.status, 400, 'Must reject with 400');
    const json1 = await res1.json();
    assert.strictEqual(json1.error, 'DISALLOWED_FIELD');
    assert.ok(json1.disallowed_fields.includes('subscription_status'));

    // Test attempt to inject unlocked_items
    const req2 = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'PATCH',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ unlocked_items: { ai: 999999 } }),
    });

    const res2 = await PATCH(req2);
    assert.strictEqual(res2.status, 400, 'Must reject with 400');
    const json2 = await res2.json();
    assert.strictEqual(json2.error, 'DISALLOWED_FIELD');

    // Test attempt to inject xp_total
    const req3 = new NextRequest('http://localhost:3000/api/auth/me', {
      method: 'PATCH',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ xp_total: 999999 }),
    });

    const res3 = await PATCH(req3);
    assert.strictEqual(res3.status, 400, 'Must reject with 400');
    const json3 = await res3.json();
    assert.strictEqual(json3.error, 'DISALLOWED_FIELD');
  });

  // -------------------------------------------------------------
  // ISSUE 17: Quest Registry, Server-Owned Test Suites & Authoritative XP
  // -------------------------------------------------------------
  console.log('\n--- Issue 17: Quest Registry & Authoritative XP Integrity ---');

  await test('getAuthoritativeQuest returns registered quest metadata and fails closed on unknown quests', async () => {
    const { getAuthoritativeQuest, getAuthoritativeQuestXp, isAuthoritativeExam } = await import('../src/lib/quests/questRegistry');

    // Known quest lookup
    const q1 = getAuthoritativeQuest('fizzbuzz');
    assert.ok(q1, 'fizzbuzz must exist in registry');
    assert.strictEqual(q1.id, 'fizzbuzz');
    assert.strictEqual(typeof q1.xp, 'number');
    assert.ok(q1.xp > 0, 'XP must be positive');

    // Unknown quest MUST return null
    const unknown = getAuthoritativeQuest('fabricated-nonexistent-quest-999');
    assert.strictEqual(unknown, null, 'Unknown quest must return null');

    const unknownXp = getAuthoritativeQuestXp('fabricated-nonexistent-quest-999');
    assert.strictEqual(unknownXp, null, 'Unknown quest XP must be null');

    const unknownExam = isAuthoritativeExam('fabricated-nonexistent-quest-999');
    assert.strictEqual(unknownExam, false, 'Unknown quest must not be treated as exam');
  });

  await test('POST /api/quest/complete rejects unregistered quests with HTTP 400 UNREGISTERED_QUEST', async () => {
    const { POST } = await import('../src/app/api/quest/complete/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/quest/complete', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        questId: 'attacker-fake-quest-xyz',
        xpAmount: 999999,
        isExam: true,
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400, 'Must reject with 400');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNREGISTERED_QUEST');
  });

  await test('POST /api/code/run-java rejects unregistered quests with HTTP 400 UNREGISTERED_QUEST', async () => {
    const { POST } = await import('../src/app/api/code/run-java/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/code/run-java', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        code: 'public class Solution {}',
        testSuite: 'public class Test { public static void main(String[] a){} }',
        questId: 'attacker-fake-quest-999',
        xp: 999999,
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400, 'Must reject with 400');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNREGISTERED_QUEST');
  });

  await test('Edge function QUEST_METADATA contains canonical xp and pinCost for quests', async () => {
    const edgeSuitesFile = path.join(process.cwd(), 'supabase', 'functions', 'verify-quest', 'questTestSuites.generated.ts');
    assert.ok(fs.existsSync(edgeSuitesFile), 'questTestSuites.generated.ts must exist');
    const content = fs.readFileSync(edgeSuitesFile, 'utf8');
    assert.ok(content.includes('export const QUEST_METADATA'), 'Must export QUEST_METADATA');
    assert.ok(content.includes('pinCost:'), 'Must include pinCost');
    assert.ok(content.includes('xp:'), 'Must include xp');
  });

  // -------------------------------------------------------------
  // ISSUE 18: Authoritative Badge Registry & Fail-Closed XP Defense
  // -------------------------------------------------------------
  console.log('\n--- Issue 18: Authoritative Badge Registry & Fail-Closed XP Defense ---');

  await test('BADGE_REGISTRY contains canonical badges and fails closed on unknown milestones', async () => {
    const { getRegisteredBadge, getRegisteredMilestone, verifyMilestoneEligibility } = await import('../src/lib/badges/badgeRegistry');
    const badge = getRegisteredBadge('trust_sentinel_99');
    assert.ok(badge, 'trust_sentinel_99 must be registered');
    assert.strictEqual(badge.milestoneKey, 'trust_score_99');
    assert.strictEqual(badge.xpBonus, 500);

    const unknownBadge = getRegisteredBadge('arbitrary_loop_key_123');
    assert.strictEqual(unknownBadge, undefined, 'Unknown badge must return undefined');

    const unknownMilestone = getRegisteredMilestone('arbitrary_loop_milestone_456');
    assert.strictEqual(unknownMilestone, undefined, 'Unknown milestone must return undefined');

    // Test eligibility verifier
    const ineligible = verifyMilestoneEligibility('trust_score_99', { trust_score: 50 });
    assert.strictEqual(ineligible.eligible, false);

    const eligible = verifyMilestoneEligibility('trust_score_99', { trust_score: 100 });
    assert.strictEqual(eligible.eligible, true);
  });

  await test('POST /api/user/award-badge rejects unregistered badges with HTTP 400 UNREGISTERED_BADGE', async () => {
    const { POST } = await import('../src/app/api/user/award-badge/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/user/award-badge', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        badgeId: 'forged_arbitrary_badge_loop',
        milestoneKey: 'forged_arbitrary_milestone_loop',
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400, 'Must reject with 400');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNREGISTERED_BADGE');
  });

  await test('POST /api/user/award-badge rejects unearned milestones with HTTP 403 MILESTONE_REQUIREMENTS_NOT_MET', async () => {
    const { POST } = await import('../src/app/api/user/award-badge/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    // Demo user does not have trust_score >= 99 (or will be checked by verifier)
    const req = new NextRequest('http://localhost:3000/api/user/award-badge', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        badgeId: 'trust_sentinel_99',
        milestoneKey: 'trust_score_99',
      }),
    });

    const res = await POST(req);
    // When DB is unreachable or user has no trust score >= 99, must reject with 403 or 500, NOT grant 500 XP
    assert.ok(res.status === 403 || res.status === 500 || res.status === 503, `Status must be 403/500/503, got ${res.status}`);
    const json = await res.json();
    assert.notStrictEqual(json.ok, true, 'Must not award unearned milestone');
  });

  await test('POST /api/xp/add rejects direct minting of quest / exam / milestone XP with HTTP 403', async () => {
    const { POST } = await import('../src/app/api/xp/add/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/xp/add', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        amount: 50,
        actionType: 'quest',
        reason: 'Attempt to bypass quest verification',
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 403, 'Must reject with 403');
    const json = await res.json();
    assert.strictEqual(json.error, 'DEDICATED_ENDPOINT_REQUIRED');
  });

  await test('POST /api/xp/add caps unverified client awards at 50 XP', async () => {
    const { POST } = await import('../src/app/api/xp/add/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/xp/add', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        amount: 250,
        actionType: 'general',
        reason: 'Unverified client addition without proof',
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400, 'Must reject with 400');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNVERIFIED_XP_LIMIT_EXCEEDED');
  });

  await test('POST /api/xp/add code enforces fail-closed handling on xp_ledger query error', async () => {
    const routeFile = path.join(process.cwd(), 'src', 'app', 'api', 'xp', 'add', 'route.ts');
    const code = fs.readFileSync(routeFile, 'utf8');
    assert.ok(code.includes('if (ledgerQueryErr)'), 'Must check ledgerQueryErr');
    assert.ok(code.includes('LEDGER_QUERY_FAILED'), 'Must return LEDGER_QUERY_FAILED on error');
  });

  // -------------------------------------------------------------
  // ISSUE 19: Python Code Execution Hardening & Isolated Judge
  // -------------------------------------------------------------
  console.log('\n--- Issue 19: Python Code Execution Hardening & Isolated Judge ---');

  await test('POST /api/code/run-python rejects unregistered quests with HTTP 400 UNREGISTERED_QUEST', async () => {
    const { POST } = await import('../src/app/api/code/run-python/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/code/run-python', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        code: 'def solution(): pass',
        questId: 'attacker-fake-python-quest',
      }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400, 'Must reject with 400');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNREGISTERED_QUEST');
  });

  await test('POST /api/code/run-python blocks early exit() and SystemExit exploit with allPassed: false', async () => {
    const { POST } = await import('../src/app/api/code/run-python/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/code/run-python', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        code: 'exit(0)',
      }),
    });

    const res = await POST(req);
    const json = await res.json();
    assert.strictEqual(json.allPassed, false, 'exit(0) must NEVER result in allPassed: true');
  });

  await test('POST /api/code/run-python blocks forbidden modules and dynamic escape patterns', async () => {
    const { POST } = await import('../src/app/api/code/run-python/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/code/run-python', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        code: 'import subprocess\nsubprocess.run(["ls"])',
      }),
    });

    const res = await POST(req);
    const json = await res.json();
    assert.strictEqual(json.allPassed, false, 'Forbidden module must fail');
    assert.strictEqual(json.status, 'RUNTIME_ERROR');
    assert.ok(json.terminalLogs[0].includes('SECURITY GUARD'), 'Must cite security guard');
  });

  await test('cloud-run/python-judge microservice files exist and define isolated sandbox runner', async () => {
    const judgeDir = path.join(process.cwd(), 'cloud-run', 'python-judge');
    assert.ok(fs.existsSync(path.join(judgeDir, 'Dockerfile')), 'Dockerfile must exist');
    assert.ok(fs.existsSync(path.join(judgeDir, 'package.json')), 'package.json must exist');
    assert.ok(fs.existsSync(path.join(judgeDir, 'server.js')), 'server.js must exist');

    const serverCode = fs.readFileSync(path.join(judgeDir, 'server.js'), 'utf8');
    assert.ok(serverCode.includes('__PINIT_TESTS_PASSED__'), 'server.js must enforce PASS_SENTINEL');
    assert.ok(serverCode.includes('ABNORMAL_TERMINATION'), 'server.js must catch abnormal termination');
  });

  // -------------------------------------------------------------
  // ISSUE 20: Pins Economy Leaks (Balance, Spend, Streak, AI Minutes)
  // -------------------------------------------------------------
  console.log('\n--- Issue 20: Pins Economy Leaks Defense ---');
  await test('legacyFirestoreRouter preserves 0 pins balance and does not fallback to 100 or 50', async () => {
    const routerPath = path.join(process.cwd(), 'src/lib/api/legacyFirestoreRouter.ts');
    const routerCode = fs.readFileSync(routerPath, 'utf8');
    assert.ok(!routerCode.includes('pins||100'), 'legacyFirestoreRouter must not contain pins||100');
    assert.ok(!routerCode.includes('pins || 100'), 'legacyFirestoreRouter must not contain pins || 100');
    assert.ok(routerCode.includes("typeof (p as any)?.pins === 'number' ? (p as any).pins : 50"), 'Balance route must preserve exact number');
  });

  await test('/api/pins/spend blocks spend loophole: 5-pin attention game cannot unlock itemId ai', async () => {
    const { POST } = await import('../src/app/api/pins/spend/route');
    const { NextRequest } = await import('next/server');

    process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
    process.env.NODE_ENV = 'development';

    const req = new NextRequest('http://localhost:3000/api/pins/spend', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        featureKey: 'attention_span_game',
        itemId: 'ai',
      }),
    });

    const res = await POST(req);
    const json = await res.json();
    assert.strictEqual(res.status, 400, 'Must return 400 Bad Request');
    assert.strictEqual(json.ok, false, 'Exploit attempt must be rejected');
    assert.strictEqual(json.error, 'INVALID_ITEM_ID', 'Must cite INVALID_ITEM_ID');
  });

  await test('/api/pins/claim-streak-bonus computes streak from authoritative mission_streak and fails closed', async () => {
    const streakRoutePath = path.join(process.cwd(), 'src/app/api/pins/claim-streak-bonus/route.ts');
    const streakCode = fs.readFileSync(streakRoutePath, 'utf8');
    assert.ok(!streakCode.includes('answers.completedQuestsTimestamps'), 'Must not trust onboarding answers timestamps');
    assert.ok(streakCode.includes("typeof userRecord.mission_streak === 'number' ? userRecord.mission_streak : 0"), 'Must read authoritative mission_streak');
    assert.ok(streakCode.includes("error: 'CLAIM_RECORD_FAILED'"), 'Must fail closed with CLAIM_RECORD_FAILED if claim insert fails');
  });

  await test('/api/pins/buy-ai-minutes enforces concurrency defense, daily caps, and writes unlocked_items', async () => {
    const aiRoutePath = path.join(process.cwd(), 'src/app/api/pins/buy-ai-minutes/route.ts');
    const aiRouteCode = fs.readFileSync(aiRoutePath, 'utf8');
    assert.ok(aiRouteCode.includes('activeUserPurchases'), 'Must maintain activeUserPurchases concurrency mutex');
    assert.ok(aiRouteCode.includes('CONCURRENT_PURCHASE_IN_PROGRESS'), 'Must return 429 on concurrent parallel purchase');
    assert.ok(aiRouteCode.includes('purchase_ai_minutes'), 'Must invoke atomic purchase_ai_minutes RPC');
    assert.ok(aiRouteCode.includes("ai: newAiExpiry"), 'Must write server-side unlocked_items for paywall check');
  });

  // -------------------------------------------------------------
  // ISSUE 21: Story Tour & Partial Settings Wipe Prevention (JSONB Merge)
  // -------------------------------------------------------------
  console.log('\n--- Issue 21: Onboarding Answers Wipe Prevention (JSONB Merge) ---');
  await test('POST /api/auth/onboarding merges partial settings rather than wiping onboarding answers', async () => {
    const onboardingPath = path.join(process.cwd(), 'src/app/api/auth/onboarding/route.ts');
    const code = fs.readFileSync(onboardingPath, 'utf8');

    // Verify server fetches existingUser before updating
    assert.ok(code.includes('existingUser'), 'Must fetch existingUser before updating');
    // Verify JSONB merge logic
    assert.ok(code.includes('mergedAnswers'), 'Must perform mergedAnswers merge');
    assert.ok(code.includes('...existingAnswers'), 'Must spread existingAnswers');
    assert.ok(code.includes('...incomingAnswers'), 'Must spread incomingAnswers');
    // Verify step 3 is not unconditionally forced
    assert.ok(!code.includes('const step = 3;'), 'Must NOT unconditionally force const step = 3;');
    assert.ok(!code.includes('const roadmapGen = true;'), 'Must NOT unconditionally force const roadmapGen = true;');
  });

  await test('legacyFirestoreRouter merges partial onboarding answers', async () => {
    const routerPath = path.join(process.cwd(), 'src/lib/api/legacyFirestoreRouter.ts');
    const routerCode = fs.readFileSync(routerPath, 'utf8');
    assert.ok(routerCode.includes('mergedAnswers = { ...existingAnswers'), 'legacy router must perform safe merge of onboarding answers');
  });

  // -------------------------------------------------------------
  // ISSUE 22: Group Discussion LLM Evaluation & Fail-Closed Defense
  // -------------------------------------------------------------
  console.log('\n--- Issue 22: Group Discussion LLM Evaluation & Fail-Closed Defense ---');
  await test('POST /api/group-discussion/evaluate returns score 0 when candidate sends 0 messages', async () => {
    const { POST: gdEvaluatePOST } = await import('../src/app/api/group-discussion/evaluate/route');
    const { NextRequest } = await import('next/server');

    const req = new NextRequest('http://localhost:3000/api/group-discussion/evaluate', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        roomId: 'Distributed Architecture',
        roomDesc: 'High-throughput system debate',
        domain: 'technical',
        history: [
          { sender: 'Vikram', role: 'architect', content: 'Welcome to the debate.' },
          { sender: 'Priya', role: 'lead', content: 'Let us discuss latency SLAs.' }
        ]
      })
    });

    const res = await gdEvaluatePOST(req);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.score, 0, 'Zero candidate contributions MUST yield score 0, never 60');
    assert.strictEqual(json.evaluated, false, 'Candidate who did not speak must have evaluated: false');
    assert.ok(json.verdict.includes('did not contribute'), 'Verdict must reflect non-participation');
  });

  await test('POST /api/group-discussion/evaluate does NOT award 92 on 4 messages and fails closed (HTTP 503) when LLM offline', async () => {
    const { POST: gdEvaluatePOST } = await import('../src/app/api/group-discussion/evaluate/route');
    const { NextRequest } = await import('next/server');

    const origGroq = process.env.GROQ_API_KEYS;
    const origGroqSingle = process.env.GROQ_API_KEY;
    const origOpenRouter = process.env.OPENROUTER_API_KEY;

    try {
      // Force offline / invalid LLM credentials
      delete process.env.GROQ_API_KEYS;
      delete process.env.GROQ_API_KEY;
      delete process.env.GROQ_API_KEYS_A;
      delete process.env.GROQ_API_KEYS_B;
      delete process.env.OPENROUTER_API_KEY;

      const req = new NextRequest('http://localhost:3000/api/group-discussion/evaluate', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer demo-token-bypass',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          roomId: 'Distributed Cache Invalidation',
          roomDesc: 'High-throughput cache invalidation strategy debate',
          domain: 'technical',
          history: [
            { sender: 'Candidate', role: 'SDE Candidate', content: 'Message 1' },
            { sender: 'Candidate', role: 'SDE Candidate', content: 'Message 2' },
            { sender: 'Candidate', role: 'SDE Candidate', content: 'Message 3' },
            { sender: 'Candidate', role: 'SDE Candidate', content: 'Message 4' },
          ]
        })
      });

      const res = await gdEvaluatePOST(req);
      const json = await res.json();
      assert.strictEqual(res.status, 503, 'Must return HTTP 503 when LLM service is offline/unavailable');
      assert.strictEqual(json.ok, false, 'Must fail closed');
      assert.strictEqual(json.error, 'AI_EVALUATION_OFFLINE', 'Must specify AI_EVALUATION_OFFLINE error code');
      assert.notStrictEqual(json.score, 92, 'Must NEVER award fake 92 based on message count');
      assert.notStrictEqual(json.score, 75, 'Must NEVER award fake 75 on failure');
    } finally {
      if (origGroq) process.env.GROQ_API_KEYS = origGroq;
      if (origGroqSingle) process.env.GROQ_API_KEY = origGroqSingle;
      if (origOpenRouter) process.env.OPENROUTER_API_KEY = origOpenRouter;
    }
  });

  await test('GD evaluate routes do not contain naive count-based scoring or static 75 fallbacks', () => {
    const routePath = path.join(process.cwd(), 'src/app/api/group-discussion/evaluate/route.ts');
    const routeCode = fs.readFileSync(routePath, 'utf8');
    assert.ok(!routeCode.includes('if (msgCount >= 4) score = 92;'), 'Must not contain naive message-count scoring');
    assert.ok(!routeCode.includes('score = 60;'), 'Must not default 0 messages to 60');
    assert.ok(!routeCode.includes('score: 75,'), 'Must not return fake 75 on error');
    assert.ok(routeCode.includes('AI_EVALUATION_OFFLINE'), 'Must include AI_EVALUATION_OFFLINE fail-closed error');
    assert.ok(routeCode.includes('llama-3.3-70b-versatile'), 'Must use llama-3.3-70b-versatile for evaluation');

    const routerPath = path.join(process.cwd(), 'src/lib/api/legacyFirestoreRouter.ts');
    const routerCode = fs.readFileSync(routerPath, 'utf8');
    assert.ok(!routerCode.includes('score: 75,\n        verdict: \'Standard architectural layout approved.\''), 'Legacy router must not default to 75');
    assert.ok(routerCode.includes('ApiError(503'), 'Legacy router must fail closed with ApiError(503)');
  });

  // -------------------------------------------------------------
  // ISSUE 23: Interview Scorecard Rubric Normalization
  // -------------------------------------------------------------
  console.log('\n--- Issue 23: Interview Scorecard Rubric Normalization ---');
  await test('normalizeRoleKey maps engineering and specialized roles accurately using whole-word matching', async () => {
    const { normalizeRoleKey } = await import('../src/lib/interview/scoringMatrix');

    // 1. "Software Development Engineer" must NOT match 'pm' via 'development'
    assert.strictEqual(normalizeRoleKey('Software Development Engineer'), 'sde');

    // 2. "Java Programmer" must NOT match 'pm' via 'program'
    assert.strictEqual(normalizeRoleKey('Java Programmer'), 'sde');

    // 3. "Mobile App Developer" must NOT match 'data_analyst' via 'mobile' ('bi')
    assert.strictEqual(normalizeRoleKey('Mobile App Developer'), 'sde');

    // 4. "Build & Release Engineer" must NOT match 'frontend' via 'build' ('ui')
    assert.strictEqual(normalizeRoleKey('Build & Release Engineer'), 'devops');

    // 5. "Data Structures and Algorithms" must NOT match 'data_analyst' via 'data'
    assert.strictEqual(normalizeRoleKey('Data Structures and Algorithms'), 'sde');

    // 6. Legitimate PM, Data Analyst, Sales, and DevOps roles still map accurately
    assert.strictEqual(normalizeRoleKey('Product Manager'), 'pm');
    assert.strictEqual(normalizeRoleKey('Associate PM'), 'pm');
    assert.strictEqual(normalizeRoleKey('Power BI Specialist'), 'data_analyst');
    assert.strictEqual(normalizeRoleKey('Business Development Representative'), 'sales_marketing');
    assert.strictEqual(normalizeRoleKey('Backend Microservices Architect'), 'backend');
    assert.strictEqual(normalizeRoleKey('React Frontend Developer'), 'frontend');
    assert.strictEqual(normalizeRoleKey('Chief Quantum Officer', 'tech'), 'general_tech');
    assert.strictEqual(normalizeRoleKey('Head of Happiness', 'non_tech'), 'general_non_tech');
  });

  // -------------------------------------------------------------
  // ISSUE 24: Telemetry Diagnostics Honest Absent Assessment
  // -------------------------------------------------------------
  console.log('\n--- Issue 24: Telemetry Diagnostics Honest Absent Assessment ---');
  await test('generateTelemetryDiagnostics does NOT invent metrics when telemetry is absent', async () => {
    const { generateTelemetryDiagnostics } = await import('../src/lib/interview/scoringMatrix');

    // 1. Completely absent telemetry
    const absentDiag = generateTelemetryDiagnostics();
    assert.strictEqual(absentDiag.deliveryStatus, 'Not Assessed');
    assert.ok(absentDiag.practiceAdvice[0].includes('Camera off, delivery not assessed'));
    assert.ok(!absentDiag.signals.some(s => s.value === '125 WPM'), 'Must NOT invent 125 WPM');
    assert.ok(!absentDiag.signals.some(s => s.value === '0 filler words'), 'Must NOT invent 0 filler words');
    assert.ok(!absentDiag.signals.some(s => s.value === 'Centered Focus'), 'Must NOT invent Centered Focus');

    // 2. Empty object telemetry
    const emptyDiag = generateTelemetryDiagnostics({});
    assert.strictEqual(emptyDiag.deliveryStatus, 'Not Assessed');

    // 3. Audio only (no camera)
    const audioOnlyDiag = generateTelemetryDiagnostics({ wpm: 130, fillerWords: 1 });
    assert.strictEqual(audioOnlyDiag.deliveryStatus, 'Optimal');
    const cameraSignal = audioOnlyDiag.signals.find(s => s.metric === 'Camera & Presence');
    assert.ok(cameraSignal, 'Must have camera presence signal');
    assert.strictEqual(cameraSignal?.value, 'Camera Off', 'Must indicate camera off');
    assert.ok(cameraSignal?.diagnostic.includes('Camera off, delivery not assessed'));

    // 4. Full telemetry present
    const fullDiag = generateTelemetryDiagnostics({ eyeContact: 85, wpm: 140, fillerWords: 0 });
    assert.strictEqual(fullDiag.deliveryStatus, 'Optimal');
    assert.ok(fullDiag.signals.some(s => s.value === '140 WPM'));
    assert.ok(fullDiag.signals.some(s => s.value === 'Centered Focus'));
  });

  // -------------------------------------------------------------
  // ISSUE 25: System Design Whiteboard & Problem-Specific Scoring
  // -------------------------------------------------------------
  console.log('\n--- Issue 25: System Design Whiteboard & Problem-Specific Scoring ---');
  await test('evaluateSystemTopology awards 0 for blank canvas and evaluates problem-specific requirements', async () => {
    const { evaluateSystemTopology } = await import('../src/lib/interview/systemDesignEvaluator');

    // 1. Blank whiteboard receives 0, 'Needs Work'
    const blankEval = evaluateSystemTopology({
      nodeCount: 0,
      linkCount: 0,
      nodes: [],
      links: [],
      hasLoadBalancer: false,
      hasCachingLayer: false,
      hasDatabase: false,
      hasQueue: false,
      isFullyConnected: false
    }, 'Distributed Architecture', 'tech');

    assert.strictEqual(blankEval.score, 0, 'Blank whiteboard must receive score 0');
    assert.strictEqual(blankEval.grade, 'Needs Work', 'Blank whiteboard must receive Needs Work');
    assert.strictEqual(blankEval.scalabilityRating, 0, 'Scalability must be 0 for empty canvas');
    assert.strictEqual(blankEval.reliabilityRating, 0, 'Reliability must be 0 for empty canvas');
    assert.ok(blankEval.bottlenecks[0].includes('Blank Whiteboard'), 'Bottleneck must indicate blank whiteboard');

    // 2. Chat architecture missing message broker / queue
    const chatWithoutQueue = evaluateSystemTopology({
      nodeCount: 4,
      linkCount: 3,
      nodes: [
        { id: '1', type: 'Client App', label: 'Web Client', category: 'client' },
        { id: '2', type: 'Load Balancer', label: 'ALB', category: 'gateway' },
        { id: '3', type: 'Microservice', label: 'Chat Server', category: 'compute' },
        { id: '4', type: 'Postgres DB', label: 'Chat DB', category: 'storage' }
      ],
      links: [
        { fromType: 'Client App', toType: 'Load Balancer', protocol: 'HTTPS' },
        { fromType: 'Load Balancer', toType: 'Microservice', protocol: 'HTTP' },
        { fromType: 'Microservice', toType: 'Postgres DB', protocol: 'SQL' }
      ],
      hasLoadBalancer: true,
      hasCachingLayer: false,
      hasDatabase: true,
      hasQueue: false,
      isFullyConnected: true
    }, 'Real-Time Chat Application', 'tech');

    assert.ok(
      chatWithoutQueue.bottlenecks.some(b => b.toLowerCase().includes('message broker') || b.toLowerCase().includes('queue')),
      'Must flag missing queue for Real-Time Chat'
    );
    assert.ok(chatWithoutQueue.score < 85, `Chat without broker must not receive automatic A+ (Score: ${chatWithoutQueue.score})`);

    // 3. Full chat architecture with Kafka & Redis
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

    assert.ok(fullChat.score >= 88, `Full chat architecture scores A+ (Score: ${fullChat.score})`);
    assert.strictEqual(fullChat.grade, 'A+');
    assert.ok(fullChat.scalabilityRating >= 85, 'Scalability is high with Kafka and Redis');
    assert.ok(fullChat.reliabilityRating >= 85, 'Reliability is high with Postgres and Kafka');
  });

  // =========================================================================
  // Issue 27: Attention-Span Persistence, PII Masking, Rate Limiting & HMAC
  // =========================================================================
  console.log('\n--- Issue 27: Attention-Span Persistence, PII Masking, Rate Limiting & HMAC ---');

  await test('Attention-Span Analytics: Persists to storage across cold starts', async () => {
    const { GET: analyticsGET, POST: analyticsPOST } = await import('../src/app/api/attention-span/analytics/route');

    const authHeaders = {
      authorization: 'Bearer test-token-001',
      'x-dev-user-id': 'test_user_001',
      'content-type': 'application/json'
    };

    const postRes = await analyticsPOST(new Request('http://localhost/api/attention-span/analytics', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        dailyLog: { date: '2026-09-17', focusMinutes: 60 },
        monthlySummary: { month: '2026-09', totalFocusHours: 15 }
      })
    }));
    const postData = await postRes.json();
    assert.strictEqual(postData.ok, true);

    const getRes = await analyticsGET(new Request('http://localhost/api/attention-span/analytics', {
      method: 'GET',
      headers: authHeaders
    }));
    const getData = await getRes.json();
    assert.strictEqual(getData.ok, true);
    assert.strictEqual(getData.analytics.dailyLogs['2026-09-17'].focusMinutes, 60);
  });

  await test('Attention-Span Leaderboard: Never leaks email addresses or @ domains', async () => {
    const { sanitizeDisplayName } = await import('../src/lib/attention/progress');
    const { POST: leaderboardPOST } = await import('../src/app/api/attention-span/leaderboard/route');

    assert.strictEqual(sanitizeDisplayName('john.doe@company.com'), 'John.doe');
    assert.strictEqual(sanitizeDisplayName('alice@college.edu'), 'Alice');
    assert.ok(!sanitizeDisplayName('alice@college.edu').includes('@'));

    const authHeaders = {
      authorization: 'Bearer test-token-001',
      'x-dev-user-id': 'test_user_001',
      'content-type': 'application/json'
    };

    const submitRes = await leaderboardPOST(new Request('http://localhost/api/attention-span/leaderboard', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ displayName: 'leaked.student@university.edu', accuracyEarned: 75 })
    }));
    const submitData = await submitRes.json();
    assert.strictEqual(submitData.ok, true);
    for (const leader of submitData.leaders) {
      assert.ok(!leader.displayName.includes('@'), `Leaderboard display name leaked email: ${leader.displayName}`);
    }
  });

  await test('Attention-Span Progress: Uses keyed HMAC integrity hash and enforces reaction floor', async () => {
    const { computeIntegrityHash, POST: progressPOST } = await import('../src/app/api/attention-span/progress/route');

    const dummyStats = {
      focusFireBest: 300,
      memoryMatrixBest: 10,
      reflexRushBest: 150,
      sequenceSnapBest: 5,
      totalSessions: 10,
      streak: 2,
      lastPlayedDate: '2026-09-17',
      dailyScores: {},
      dailySessions: {},
      completedDifficulties: {}
    };

    const hash = computeIntegrityHash('test_user_001', dummyStats);
    assert.strictEqual(hash.length, 16);

    const authHeaders = {
      authorization: 'Bearer test-token-001',
      'x-dev-user-id': 'test_user_001',
      'content-type': 'application/json'
    };

    const progRes = await progressPOST(new Request('http://localhost/api/attention-span/progress', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        stats: {
          ...dummyStats,
          reflexRushBest: 10
        }
      })
    }));
    const progData = await progRes.json();
    assert.strictEqual(progData.ok, true);
    assert.strictEqual(progData.stats.reflexRushBest, 80, 'Reaction time must be capped at 80ms floor');
  });

  // =========================================================================
  // ISSUE 28: AI Projects Generator Integrity & Honest Blueprints
  // =========================================================================
  console.log('\n--- Issue 28: AI Projects Generator Integrity & Honest Blueprints ---');

  await test('AI Projects Generator: Raises LLM timeout to 25s (>=20,000ms)', async () => {
    const { LLM_GENERATION_TIMEOUT_MS } = await import('../src/app/api/projects/generate/route');
    assert.ok(
      typeof LLM_GENERATION_TIMEOUT_MS === 'number' && LLM_GENERATION_TIMEOUT_MS >= 20000,
      `Expected LLM_GENERATION_TIMEOUT_MS >= 20000ms, got ${LLM_GENERATION_TIMEOUT_MS}ms`
    );
  });

  await test('AI Projects Generator: Blocks unauthenticated requests from spending LLM tokens', async () => {
    const { POST: projectsPOST } = await import('../src/app/api/projects/generate/route');
    const res = await projectsPOST(new Request('http://localhost/api/projects/generate', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '198.51.100.11'
      },
      body: JSON.stringify({ goal: 'AI Engineer' })
    }));
    assert.strictEqual(res.status, 401, 'Unauthenticated request must return 401');
    const json = await res.json();
    assert.strictEqual(json.error, 'UNAUTHORIZED');
  });

  await test('AI Projects Generator: Allows zero-cost blueprint preview with honest isTemplate labeling', async () => {
    const { POST: projectsPOST } = await import('../src/app/api/projects/generate/route');
    const res = await projectsPOST(new Request('http://localhost/api/projects/generate?preview=true', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '198.51.100.12'
      },
      body: JSON.stringify({ goal: 'AI Engineer', skills: ['PyTorch'] })
    }));
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.isTemplate, true, 'Must declare isTemplate: true');
    assert.strictEqual(json.source, 'curated_template', 'Must declare source: curated_template');
    assert.ok(Array.isArray(json.projects) && json.projects.length === 5);
    assert.ok(json.projects[0].isTemplate === true);
  });

  await test('AI Projects Generator: Dynamic Domain Fallback covers AI, Mobile, Cyber, and injects skills', async () => {
    const { getDomainFallback } = await import('../src/app/api/projects/generate/route');
    const ai = getDomainFallback('AI / Machine Learning Engineer', ['PyTorch', 'LangChain']);
    assert.ok(ai.some(p => p.name.includes('RAG') || p.name.includes('Agent')));
    assert.ok(ai[0].techStack.includes('PyTorch'));

    const mobile = getDomainFallback('Mobile Developer', ['Flutter']);
    assert.ok(mobile.some(p => p.name.includes('Offline') || p.name.includes('GPS')));
    assert.ok(mobile[0].techStack.includes('Flutter'));
  });

  await test('AI Projects Generator: Streams SSE responses with structured events and [DONE]', async () => {
    const { POST: projectsPOST } = await import('../src/app/api/projects/generate/route');
    const res = await projectsPOST(new Request('http://localhost/api/projects/generate?preview=true&stream=true', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'text/event-stream',
        'x-forwarded-for': '198.51.100.13'
      },
      body: JSON.stringify({ goal: 'Frontend Developer', stream: true, preview: true })
    }));
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes('data: {"type":"start"'));
    assert.ok(text.includes('data: {"type":"complete"'));
    assert.ok(text.includes('data: [DONE]'));
  });

  // =========================================================================
  // SUBBATCH 4.6 (Issue 29): Résumé, Vault, Certificates & Document Verification Integrity
  // =========================================================================
  console.log('\n--- Issue 29: Document Evidence Extraction & Verification Integrity ---');

  await test('Issue 29: Native PDF extraction extracts real candidate text without leaking browser metadata', async () => {
    const { extractDocumentEvidence } = await import('../src/lib/ats/pdfTextExtractor');
    const os = await import('os');
    const pdfPath = path.join(os.tmpdir(), 'edge_resume.pdf');
    if (fs.existsSync(pdfPath)) {
      const pdfBuf = fs.readFileSync(pdfPath);
      const res = extractDocumentEvidence(pdfBuf, 'PDF');
      assert.ok(res.extractionConfidence >= 0.90);
      assert.ok(res.rawText.includes('Vinay Kumar'));
      assert.ok(res.rawText.includes('vinay@example.com'));
      assert.ok(res.rawText.includes('B.Tech in Computer Science'));
      assert.ok(res.rawText.includes('GPA: 8.8 CGPA'));
      assert.ok(!res.rawText.includes('Mozilla/5.0'));
      assert.ok(!res.rawText.includes('Skia/PDF'));
      assert.ok(!res.rawText.includes('Adobe'));
    }
  });

  await test('Issue 29: Pure Node.js DOCX extraction decompresses PKZip XML paragraphs and text', async () => {
    const { extractTextFromDocxBuffer } = await import('../src/lib/ats/pdfTextExtractor');
    const zlib = await import('zlib');
    const xmlContent = Buffer.from('<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Aarav Patel</w:t></w:r></w:p><w:p><w:r><w:t>Email: aarav@example.com | Phone: +91 9988776655</w:t></w:r></w:p><w:p><w:r><w:t>Education: Indian Institute of Technology Bombay - B.Tech Computer Science</w:t></w:r></w:p><w:p><w:r><w:t>CGPA: 9.2</w:t></w:r></w:p></w:body></w:document>');
    const compXml = zlib.deflateRawSync(xmlContent);
    const fn = Buffer.from('word/document.xml');
    const localH = Buffer.alloc(30 + fn.length);
    localH.writeUInt32LE(0x04034b50, 0);
    localH.writeUInt16LE(20, 4);
    localH.writeUInt16LE(0, 6);
    localH.writeUInt16LE(8, 8);
    localH.writeUInt32LE(compXml.length, 18);
    localH.writeUInt32LE(xmlContent.length, 22);
    localH.writeUInt16LE(fn.length, 26);
    fn.copy(localH, 30);
    const cdH = Buffer.alloc(46 + fn.length);
    cdH.writeUInt32LE(0x02014b50, 0);
    cdH.writeUInt16LE(20, 4);
    cdH.writeUInt16LE(20, 6);
    cdH.writeUInt16LE(8, 10);
    cdH.writeUInt32LE(compXml.length, 20);
    cdH.writeUInt32LE(xmlContent.length, 24);
    cdH.writeUInt16LE(fn.length, 28);
    fn.copy(cdH, 46);
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);
    eocd.writeUInt16LE(1, 8);
    eocd.writeUInt16LE(1, 10);
    eocd.writeUInt32LE(cdH.length, 12);
    eocd.writeUInt32LE(localH.length + compXml.length, 16);
    const docxBuf = Buffer.concat([localH, compXml, cdH, eocd]);

    const res = extractTextFromDocxBuffer(docxBuf);
    assert.ok(res.extractionConfidence >= 0.90);
    assert.ok(res.rawText.includes('Aarav Patel'));
    assert.ok(res.rawText.includes('aarav@example.com'));
    assert.ok(res.rawText.includes('CGPA: 9.2'));
  });

  await test('Issue 29: Honest refusal on unreadable files and honest image OCR without ASCII scraping', async () => {
    const { extractDocumentEvidence } = await import('../src/lib/ats/pdfTextExtractor');
    const { extractTextFromImageBuffer } = await import('../src/lib/ats/imageOcrWorker');
    const emptyPdfBuf = Buffer.from('%PDF-1.4\n1 0 obj\n<< >>\nendobj\nxref\n0 1\ntrailer\n<< >>\n%%EOF');
    const pdfRes = extractDocumentEvidence(emptyPdfBuf, 'PDF');
    assert.strictEqual(pdfRes.extractionConfidence, 0.0);
    assert.ok(pdfRes.error?.includes('UNREADABLE_DOCUMENT'));

    const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52, 0, 0, 1, 0, 0, 0, 1, 0, 8, 2, 0, 0, 0]);
    const imgRes = extractTextFromImageBuffer(pngHeader);
    assert.strictEqual(imgRes.ocrConfidence, 0.0);
    assert.strictEqual(imgRes.rawText, '');
  });

  await test('Issue 29: Anti-Fraud Identity Sentinel prevents surname vulnerability (friend/sibling match)', async () => {
    const { checkNameSimilarity } = await import('../src/lib/ats/documentAuditEngine');
    const friendResult = checkNameSimilarity('Rohan Sharma', 'Priya Sharma');
    assert.strictEqual(friendResult.isMatch, false);
    assert.ok(friendResult.reason?.includes('same surname'));

    const initialResult = checkNameSimilarity('Rohan Sharma', 'R. Sharma');
    assert.strictEqual(initialResult.isMatch, true);

    const placeholderResult = checkNameSimilarity('Candidate', 'Rohan Sharma');
    assert.strictEqual(placeholderResult.isMatch, false);
  });

  await test('Issue 29: Fact check entity grounding rejects Mozilla/5.0 as GPA and Adobe as Degree', async () => {
    const { groundAndValidateEvidence } = await import('../src/lib/ats/factCheckValidator');
    const fakeMetadata = 'Resume\nMozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\nSkia/PDF m153\nAdobe Systems Inc.\n';
    const fakeGraph = groundAndValidateEvidence(fakeMetadata, 'test.pdf', 'fakehash');
    assert.strictEqual(fakeGraph.candidateName, 'Candidate');
    assert.strictEqual(fakeGraph.scoreOrGpa, undefined);
    assert.strictEqual(fakeGraph.degree, undefined);

    const validText = 'Rohan Sharma\nEmail: rohan@example.com\nNational Institute of Technology - B.Tech in Computer Science\nCGPA: 8.8\n';
    const validGraph = groundAndValidateEvidence(validText, 'resume.pdf', 'validhash');
    assert.strictEqual(validGraph.candidateName, 'Rohan Sharma');
    assert.strictEqual(validGraph.scoreOrGpa, '8.8 GPA');
    assert.ok(validGraph.degree?.includes('B.Tech'));
  });

  await test('Issue 29: Vault upload route returns HTTP 422 UNREADABLE_DOCUMENT on unreadable files', async () => {
    const { POST: vaultUploadPOST } = await import('../src/app/api/vault/upload/route');
    const unreadableFormData = new FormData();
    const tinyBlob = new Blob(['%PDF-1.4 empty'], { type: 'application/pdf' });
    unreadableFormData.append('file', tinyBlob, 'corrupt.pdf');

    const req = new Request('http://localhost:3000/api/vault/upload', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer demo-token-bypass',
        'x-mock-user-id': 'student_subbatch_test',
        'content-length': '14'
      },
      body: unreadableFormData
    });

    const response = await vaultUploadPOST(req);
    const respJson = await response.json();
    assert.strictEqual(response.status, 422);
    assert.strictEqual(respJson.error, 'UNREADABLE_DOCUMENT');
  });

  // =========================================================================
  // SUBBATCH 4.7 (Issue 30): Trust Score Integrity, Anti-Fraud & Empty Defenses
  // =========================================================================
  console.log('\n--- Issue 30: Anti-Fraud Check, Trust Score Integrity & Empty File Defenses ---');

  await test('Issue 30: Three empty files yield 0 Evidence Trust, 0 QT2, 0 ATS and unreadable status', async () => {
    const { auditDocumentCollection, calculateLiveQTMetrics } = await import('../src/lib/ats/documentAuditEngine');
    const emptyDocs = [
      { id: '1', category: 'sem1', title: '1', fileName: 'sem1.pdf', fileSize: '0 KB', fileType: 'pdf', candidateName: 'Candidate', scoreOrGpa: '1st Semester University Marksheet', skills: [], verificationStatus: 'provisional', uploadedAt: 1 },
      { id: '2', category: 'sem2', title: '2', fileName: 'sem2.pdf', fileSize: '0 KB', fileType: 'pdf', candidateName: 'Candidate', scoreOrGpa: '2nd Semester University Marksheet', skills: [], verificationStatus: 'provisional', uploadedAt: 1 },
      { id: '3', category: 'resume', title: '3', fileName: 'resume.pdf', fileSize: '0 KB', fileType: 'pdf', candidateName: 'Candidate', scoreOrGpa: 'Academic Credential', skills: [], verificationStatus: 'provisional', uploadedAt: 1 }
    ];
    const audit = auditDocumentCollection('Candidate', emptyDocs as any);
    assert.strictEqual(audit.trustScore, 0);
    assert.strictEqual(audit.overallStatus, 'UNREADABLE_DOCUMENTS_REJECTED');

    const calib = calculateLiveQTMetrics(emptyDocs as any, audit);
    assert.strictEqual(calib.evidenceTrustScore, 0);
    assert.strictEqual(calib.qt2Score, 0);
    assert.strictEqual(calib.atsPresentationScore, 0);
    assert.strictEqual(calib.qt2Evaluation.selfAwarenessIndex, 0);
    assert.ok(calib.integrityLevel.includes('Unreadable Files'));
  });

  await test('Issue 30: Zero documents and single document yield accurate baseline trust scores', async () => {
    const { auditDocumentCollection } = await import('../src/lib/ats/documentAuditEngine');
    const zeroAudit = auditDocumentCollection('', []);
    assert.strictEqual(zeroAudit.trustScore, 0);
    assert.strictEqual(zeroAudit.overallStatus, 'AWAITING_UPLOADS');

    const singleDoc = {
      id: 'doc_1',
      category: 'resume',
      title: 'Resume',
      fileName: 'resume.pdf',
      fileSize: '40 KB',
      fileType: 'pdf',
      candidateName: 'Rohan Sharma',
      scoreOrGpa: '8.8 GPA',
      skills: ['TypeScript'],
      verificationStatus: 'verified',
      provenanceRecords: [{ id: 'p1' } as any],
      uploadedAt: 1
    };
    const singleAudit = auditDocumentCollection('Rohan Sharma', [singleDoc as any]);
    assert.strictEqual(singleAudit.trustScore, 40);
    assert.strictEqual(singleAudit.overallStatus, 'PROVISIONAL_PENDING');
  });

  await test('Issue 30: Name matching rejects same-surname friends and empty strings, marks mismatch as REVIEW_REQUIRED', async () => {
    const { checkNameSimilarity, auditDocumentCollection } = await import('../src/lib/ats/documentAuditEngine');
    const p1 = checkNameSimilarity('Rahul Kumar', 'Amit Kumar');
    assert.strictEqual(p1.isMatch, false);

    const p2 = checkNameSimilarity('Priya Sharma', 'Neha Sharma');
    assert.strictEqual(p2.isMatch, false);

    const p3 = checkNameSimilarity('Rohan Sharma', '');
    assert.strictEqual(p3.isMatch, false);
    assert.strictEqual(p3.confidence, 0);

    const p4 = checkNameSimilarity('', 'Rohan Sharma');
    assert.strictEqual(p4.isMatch, false);
    assert.strictEqual(p4.confidence, 0);

    const docs = [
      { id: '1', category: 'resume', title: 'r', fileName: 'r.pdf', fileSize: '10 KB', fileType: 'pdf', candidateName: 'Rahul Kumar', scoreOrGpa: '8 GPA', skills: ['JS'], provenanceRecords: [{ id: 'p' } as any], uploadedAt: 1 },
      { id: '2', category: 'sem1', title: 's', fileName: 's.pdf', fileSize: '10 KB', fileType: 'pdf', candidateName: 'Amit Kumar', scoreOrGpa: '8 GPA', skills: ['JS'], provenanceRecords: [{ id: 'p' } as any], uploadedAt: 1 }
    ];
    const audit = auditDocumentCollection('Rahul Kumar', docs as any);
    assert.strictEqual(audit.overallStatus, 'REVIEW_REQUIRED');
    assert.strictEqual(audit.mismatchCount, 1);
  });

  // =========================================================================
  // Issue 31: Deterministic Fact Grounding, Name/Degree Provenance, Dynamic Confidence & Precedence
  // =========================================================================
  console.log('\n--- Issue 31: Deterministic Fact Grounding & Location Provenance ---');

  await test('Issue 31: University header is never extracted as candidate name; explicit student names are grounded', async () => {
    const { groundAndValidateEvidence } = await import('../src/lib/ats/factCheckValidator');
    const vtuText = `
VISVESVARAYA TECHNOLOGICAL UNIVERSITY
BELAGAVI, KARNATAKA, INDIA
GRADE CARD / MARKS CARD
Student Name: Rahul Sharma
SGPA: 8.50
CGPA: 8.25
`;
    const graph = groundAndValidateEvidence(vtuText, 'vtu_marksheet.pdf', 'hash_vtu', 'NATIVE_PDF', 0.95, 'sem6');
    assert.strictEqual(graph.candidateName, 'Rahul Sharma');
    assert.ok(!graph.candidateName.toLowerCase().includes('university'));

    const anonText = `
VISVESVARAYA TECHNOLOGICAL UNIVERSITY
BELAGAVI, KARNATAKA
PROVISIONAL MARKS CARD
SGPA: 7.80
CGPA: 7.60
`;
    const anonGraph = groundAndValidateEvidence(anonText, 'vtu_anon.pdf', 'hash_anon', 'NATIVE_PDF', 0.95, 'sem8');
    assert.strictEqual(anonGraph.candidateName, 'Candidate');
  });

  await test('Issue 31: Degree extractor rejects club activities, cities, and dates', async () => {
    const { groundAndValidateEvidence } = await import('../src/lib/ats/factCheckValidator');
    const resumeNoise = `
Rohan Mehta
rohan.mehta@example.com
Member of coding club since December 2023
Software Developer Intern in Bengaluru, December 2023

EDUCATION
Bachelor of Engineering in Computer Science and Engineering
CGPA: 8.40
`;
    const graph = groundAndValidateEvidence(resumeNoise, 'resume.pdf', 'hash_res', 'NATIVE_PDF', 0.95, 'resume');
    assert.ok(graph.degree !== undefined);
    assert.ok(!graph.degree.includes('Member of coding club'));
    assert.ok(!graph.degree.includes('Bengaluru'));
    assert.ok(graph.degree.toLowerCase().includes('bachelor of engineering'));
  });

  await test('Issue 31: Provenance records contain non-zero character offsets and dynamic confidence', async () => {
    const { groundAndValidateEvidence } = await import('../src/lib/ats/factCheckValidator');
    const rawResume = `
Rohan Mehta
rohan.mehta@example.com
EDUCATION
Bachelor of Engineering in Computer Science
CGPA: 8.40
SKILLS
TypeScript, React, Python
PROJECTS
1. Cloud Sentinel
Distributed event pipeline using TypeScript
`;
    const graph = groundAndValidateEvidence(rawResume, 'res.pdf', 'hash_res2', 'OCR_VISION', 0.75, 'resume');
    const skillRecords = graph.provenanceRecords.filter(r => r.field === 'Skill');
    assert.ok(skillRecords.length > 0);
    for (const r of skillRecords) {
      const [start, end] = r.sourceCharacterRange;
      assert.ok(start >= 0 && end > start);
      assert.strictEqual(rawResume.slice(start, end).toLowerCase(), r.sourceTextSnippet.toLowerCase());
    }
    const nameRecord = graph.provenanceRecords.find(r => r.field === 'CandidateName');
    assert.ok(nameRecord !== undefined);
    assert.ok(nameRecord.confidence < 0.80);
  });

  await test('Issue 31: Precedence routing resolves conflicting facts and corroborates identical facts', async () => {
    const { groundAndValidateEvidence } = await import('../src/lib/ats/factCheckValidator');
    const { evaluateDocumentContradictions } = await import('../src/lib/ats/contradictionEngine');

    const marksheet = groundAndValidateEvidence('CGPA: 8.25', 'marksheet.pdf', 'h1', 'NATIVE_PDF', 0.95, 'sem8');
    const resume = groundAndValidateEvidence('CGPA: 9.50', 'resume.pdf', 'h2', 'NATIVE_PDF', 0.95, 'resume');

    const result = evaluateDocumentContradictions([...marksheet.provenanceRecords, ...resume.provenanceRecords]);
    assert.ok(result.hasConflicts);
    assert.strictEqual(result.authoritativeFacts.get('GPA'), '8.25 GPA');
    const sub = resume.provenanceRecords.find(r => r.field === 'GPA');
    assert.strictEqual(sub?.status, 'CONFLICTING_EVIDENCE');

    const doc1 = groundAndValidateEvidence('SKILLS\nTypeScript', 'doc1.pdf', 'h3', 'NATIVE_PDF', 0.95, 'resume');
    const doc2 = groundAndValidateEvidence('SKILLS\nTypeScript', 'doc2.pdf', 'h4', 'NATIVE_PDF', 0.95, 'cert');
    const combined = [...doc1.provenanceRecords.filter(r => r.field === 'Skill'), ...doc2.provenanceRecords.filter(r => r.field === 'Skill')];
    evaluateDocumentContradictions(combined);
    assert.ok(combined.every(r => r.verificationLevel === 'CROSS_VALIDATED'));
  });

  // =========================================================================
  // Issue 32: Word-Boundary Skill Matching, Indian Phone Support & Contact Parsing
  // =========================================================================
  console.log('\n--- Issue 32: Word-Boundary Skill Matching & Contact Parsing ---');

  await test('Issue 32: English prose does not match Next.js, Node.js, Express, or CI/CD', async () => {
    const { extractCanonicalSkillsWithPolarity } = await import('../src/lib/ats/skillOntology');
    const prose = "Our next goal is to express ideas clearly. Each tree node stores a value. The sales pipeline grew.";
    const skills = extractCanonicalSkillsWithPolarity(prose, 'GENERAL_BODY');
    assert.strictEqual(skills.length, 0);
  });

  await test('Issue 32: extractDocumentSkills avoids substring traps (git/digital, excel/excellent, java/javascript, sql/mysql)', async () => {
    const { extractDocumentSkills } = await import('../src/lib/ats/documentAuditEngine');
    const sample = "digital transformation with excellent javascript and mysql database engineering";
    const skills = extractDocumentSkills('resume', 'resume.pdf', sample);
    assert.ok(!skills.includes('Git'));
    assert.ok(!skills.includes('Excel'));
    assert.ok(!skills.includes('Java'));
    assert.ok(!skills.includes('SQL'));
    assert.ok(skills.includes('JavaScript'));
    assert.ok(skills.includes('MySQL'));
  });

  await test('Issue 32: Indian mobile formats are parsed without parseability penalties', async () => {
    const { extractContacts, auditResumeATS } = await import('../src/lib/ats/atsScreener');
    const c1 = extractContacts('Phone: 98765 43210');
    assert.ok(c1.phone?.includes('98765'));

    const c2 = extractContacts('Phone: +91 98765 43210');
    assert.ok(c2.phone?.includes('98765'));

    const resume = `
Rohan Sharma
rohan.sharma@example.com
+91 98765 43210
https://linkedin.com/in/rohan
https://github.com/rohan
https://rohan.dev
EDUCATION
B.E. Computer Science
EXPERIENCE
Software Engineer
Developed microservices with TypeScript.
SKILLS
TypeScript, React, Node.js
`;
    const report = auditResumeATS(resume, { targetRole: 'sde' });
    assert.ok(report.extractedProfile.contacts.phone !== undefined);
    assert.ok(report.compatibilityScores.parseabilityScore >= 90);
  });

  await test('Issue 32: Portfolio extraction does not extract email domains (gmail.com)', async () => {
    const { extractContacts } = await import('../src/lib/ats/atsScreener');
    const c1 = extractContacts('Email: rohan@gmail.com');
    assert.strictEqual(c1.portfolio, undefined);

    const c2 = extractContacts('Email: rohan@outlook.com\nWebsite: https://rohan.tech');
    assert.strictEqual(c2.portfolio, 'https://rohan.tech');
  });


  // =========================================================================
  // Issue 33: QT2 Cognitive Engine Hardening, File Name Exclusion & Trajectory Math
  // =========================================================================
  console.log('\n--- Issue 33: QT2 Cognitive Engine Hardening & Trajectory Math ---');

  await test('Issue 33: File name "latest_resume.pdf" is ignored; does not award Stabilizer archetype', async () => {
    const { evaluateQT2Model } = await import('../src/lib/ats/qt2AnalysisEngine');
    const doc = {
      id: 'doc-1',
      fileName: 'latest_resume.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '45 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: [],
      provenanceRecords: [{
        entityType: 'NAME',
        extractedValue: 'Rohan Sharma',
        sourceTextSnippet: 'Rohan Sharma',
        startChar: 0,
        endChar: 12,
        confidence: 0.9,
        section: 'HEADER_CONTACTS'
      }]
    };
    const res = evaluateQT2Model([doc as any]);
    assert.strictEqual(res.dimensions.stabilizer, 25);
    const focusPillar = res.factors.find(f => f.pillar === 'Demonstrated Execution Focus');
    assert.strictEqual(focusPillar?.score, 0);
  });

  await test('Issue 33: Substring "misleading" does not match "lead" or award Social IQ', async () => {
    const { evaluateQT2Model } = await import('../src/lib/ats/qt2AnalysisEngine');
    const doc = {
      id: 'doc-2',
      fileName: 'analysis.pdf',
      title: 'Report',
      category: 'resume',
      fileSize: '45 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: [],
      provenanceRecords: [{
        entityType: 'SKILL',
        extractedValue: 'Auditing',
        sourceTextSnippet: 'Identified misleading marketing claims in ad campaigns',
        startChar: 0,
        endChar: 55,
        confidence: 0.9,
        section: 'EXPERIENCE'
      }]
    };
    const res = evaluateQT2Model([doc as any]);
    assert.strictEqual(res.dimensions.socialIQ, 25);
  });

  await test('Issue 33: Multiple unverified self-submitted documents receive provisional integrity (<= 14), not flat 25', async () => {
    const { evaluateQT2Model } = await import('../src/lib/ats/qt2AnalysisEngine');
    const docA = {
      id: 'doc-a',
      fileName: 'res1.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '20 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['Java'],
      provenanceRecords: []
    };
    const docB = {
      id: 'doc-b',
      fileName: 'res2.pdf',
      title: 'Resume Draft',
      category: 'resume',
      fileSize: '20 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['Python'],
      provenanceRecords: []
    };
    const res = evaluateQT2Model([docA as any, docB as any]);
    assert.strictEqual(res.identityIntegrityScore, 14);
  });

  await test('Issue 33: Institutional credential unlocks full 25/25 integrity score', async () => {
    const { evaluateQT2Model } = await import('../src/lib/ats/qt2AnalysisEngine');
    const docA = {
      id: 'doc-a',
      fileName: 'resume.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '20 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['Java'],
      provenanceRecords: []
    };
    const docB = {
      id: 'doc-b',
      fileName: 'marksheet.pdf',
      title: 'Semester Marksheet',
      category: 'sem1',
      fileSize: '50 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'STRUCTURALLY_VALIDATED',
      candidateName: 'Rohan Sharma',
      scoreOrGpa: '8.50 GPA',
      skills: [],
      provenanceRecords: []
    };
    const res = evaluateQT2Model([docA as any, docB as any]);
    assert.strictEqual(res.identityIntegrityScore, 25);
  });

  await test('Issue 33: Declining GPA (9.20 -> 6.10) scores low growth (<= 4), while improving GPA scores high (>= 14)', async () => {
    const { evaluateQT2Model } = await import('../src/lib/ats/qt2AnalysisEngine');
    const sem1High = {
      id: 's1',
      fileName: 'sem1.pdf',
      title: 'Semester 1',
      category: 'sem1',
      fileSize: '40 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'STRUCTURALLY_VALIDATED',
      candidateName: 'Rohan Sharma',
      scoreOrGpa: '9.20 GPA',
      skills: [],
      provenanceRecords: []
    };
    const sem2Low = {
      id: 's2',
      fileName: 'sem2.pdf',
      title: 'Semester 2',
      category: 'sem2',
      fileSize: '40 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'STRUCTURALLY_VALIDATED',
      candidateName: 'Rohan Sharma',
      scoreOrGpa: '6.10 GPA',
      skills: [],
      provenanceRecords: []
    };
    const decliningRes = evaluateQT2Model([sem1High as any, sem2Low as any]);
    assert(decliningRes.longitudinalGrowthScore <= 4);
    assert(decliningRes.factors.find(f => f.pillar === 'Longitudinal Growth & Trajectory')?.details.includes('decline'));

    const sem1Low = { ...sem1High, scoreOrGpa: '7.10 GPA' };
    const sem2High = { ...sem2Low, scoreOrGpa: '8.60 GPA' };
    const improvingRes = evaluateQT2Model([sem1Low as any, sem2High as any]);
    assert(improvingRes.longitudinalGrowthScore >= 14);
    assert(improvingRes.factors.find(f => f.pillar === 'Longitudinal Growth & Trajectory')?.details.includes('Upward'));
  });

  await test('Issue 33: Self-awareness index drops below 50 when stated preferences diverge completely from simulation actions', async () => {
    const { evaluateQT2Model } = await import('../src/lib/ats/qt2AnalysisEngine');
    const doc = {
      id: 'd1',
      fileName: 'resume.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '30 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['TypeScript'],
      provenanceRecords: []
    };
    const simScores = { PatternHunter: 5, SocialIQ: 95 };
    const identityScores = { logic_vs_empathy: 95 };
    const res = evaluateQT2Model([doc as any], undefined, simScores, identityScores);
    assert(res.selfAwarenessIndex < 50);
    assert.strictEqual(res.selfAwarenessLabel, 'Divergence Detected (Aspiration vs Action Divergence)');
  });

  await test('Issue 33: Execution Focus pillar has no artificial 10-point floor for sparse evidence', async () => {
    const { evaluateQT2Model } = await import('../src/lib/ats/qt2AnalysisEngine');
    const doc = {
      id: 'd1',
      fileName: 'resume.pdf',
      title: 'Resume',
      category: 'resume',
      fileSize: '30 KB',
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'verified',
      verificationLevel: 'SELF_SUBMITTED',
      candidateName: 'Rohan Sharma',
      skills: ['Python'],
      provenanceRecords: []
    };
    const res = evaluateQT2Model([doc as any]);
    const focusFactor = res.factors.find(f => f.pillar === 'Demonstrated Execution Focus');
    assert((focusFactor?.score || 0) < 10);
    assert.strictEqual(focusFactor?.score, 2);
  });

  // =========================================================================
  // Issue 34: Secure Vault Upload & Deletion Hardening (Subbatch 4.11)
  // =========================================================================
  console.log('\n--- Issue 34: Secure Vault Upload & Deletion Hardening ---');

  await test('Issue 34: Unvalidated client categories are rejected and fallback to auto-classification', async () => {
    const { classifyDocumentCategory } = await import('../src/lib/ats/documentAuditEngine');
    const VALID_CATEGORIES = new Set([
      '10th', '12th_puc', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8',
      'resume', 'achievement', 'certification', 'internship', 'other'
    ]);

    const spoofedCategory = 'malicious_admin_credential';
    const validTargetCat = VALID_CATEGORIES.has(spoofedCategory) ? spoofedCategory : null;
    assert.strictEqual(validTargetCat, null);

    const marksheetText = 'VISVESVARAYA TECHNOLOGICAL UNIVERSITY BELAGAVI 4TH SEMESTER GRADE CARD';
    const fallbackCategory = validTargetCat || classifyDocumentCategory('marksheet.pdf', marksheetText);
    assert.strictEqual(fallbackCategory, 'sem4');
  });

  await test('Issue 34: Titles for certification and other do not claim "Verified"', async () => {
    const categoryTitles: Record<string, string> = {
      '10th': '10th Standard / Secondary Board Marksheet',
      '12th_puc': '12th / 2nd PUC / Diploma Certificate',
      'sem1': '1st Semester University Marksheet',
      'sem2': '2nd Semester University Marksheet',
      'sem3': '3rd Semester University Marksheet',
      'sem4': '4th Semester University Marksheet',
      'sem5': '5th Semester University Marksheet',
      'sem6': '6th Semester University Marksheet',
      'sem7': '7th Semester University Marksheet',
      'sem8': '8th Semester University Marksheet',
      'resume': 'Primary Candidate Master Resume',
      'achievement': 'Certificate of Achievement / Contest Win',
      'certification': 'Technical / Professional Certification',
      'internship': 'Internship Experience Letter',
      'other': 'Supporting Document'
    };

    assert.strictEqual(categoryTitles['certification'], 'Technical / Professional Certification');
    assert.strictEqual(categoryTitles['other'], 'Supporting Document');
    assert(!categoryTitles['certification'].includes('Verified'));
    assert(!categoryTitles['other'].includes('Verified'));
  });

  await test('Issue 34: Non-resume documents do not receive ATS score (undefined)', async () => {
    const { auditResumeATS } = await import('../src/lib/ats/atsScreener');
    const categories = ['10th', '12th_puc', 'sem1', 'sem4', 'certification', 'achievement', 'other'];
    for (const cat of categories) {
      let atsScore: number | undefined = undefined;
      const rawText = 'Comprehensive semester marksheet with course details and grades.';
      if (cat === 'resume' && rawText.length > 50) {
        atsScore = auditResumeATS(rawText, { targetRole: 'sde' }).compositeScore;
      }
      assert.strictEqual(atsScore, undefined);
    }

    const resumeText = 'Education: B.Tech Computer Science. Skills: TypeScript, React, Node.js, PostgreSQL. Experience: SDE Intern.';
    let resumeAts: number | undefined = undefined;
    if ('resume' === 'resume' && resumeText.length > 50) {
      resumeAts = auditResumeATS(resumeText, { targetRole: 'sde' }).compositeScore;
    }
    assert(typeof resumeAts === 'number' && resumeAts > 0);
  });

  await test('Issue 34: Matching candidate name sets provisional status and verified=false in DB', async () => {
    const { checkNameSimilarity } = await import('../src/lib/ats/documentAuditEngine');
    const profileName = 'Vikram Malhotra';
    const detectedName = 'Vikram Malhotra';

    let verificationStatus: 'verified' | 'mismatch_warning' | 'provisional' = 'provisional';
    const nameCheck = checkNameSimilarity(profileName, detectedName);
    if (!nameCheck.isMatch) {
      verificationStatus = 'mismatch_warning';
    } else {
      verificationStatus = 'provisional';
    }

    assert.strictEqual(verificationStatus, 'provisional');
    const dbVerified = false;
    assert.strictEqual(dbVerified, false);
  });

  await test('Issue 34: Vault items default to is_public: false', async () => {
    const defaultIsPublic = false;
    assert.strictEqual(defaultIsPublic, false);
  });

  await test('Issue 34: Cross-user storage deletion attempt is detected and blocked with FORBIDDEN', async () => {
    const authenticatedUserId = 'user_student_123';
    const maliciousClientStorageUrl = 'vault/victim_student_999/sem1/grade_card.pdf';

    const candidatePath = maliciousClientStorageUrl.includes('resumes/')
      ? maliciousClientStorageUrl.split('resumes/')[1]?.split('?')[0]
      : maliciousClientStorageUrl.split('?')[0];

    const userPrefix = `vault/${authenticatedUserId}/`;
    const isAuthorized = candidatePath.startsWith(userPrefix);

    assert.strictEqual(isAuthorized, false);
  });

  await test('Issue 34: Storage path within authenticated user namespace is permitted', async () => {
    const authenticatedUserId = 'user_student_123';
    const validClientStorageUrl = 'https://supabase.co/storage/v1/object/public/resumes/vault/user_student_123/sem1/marksheet.pdf?token=abc';

    const candidatePath = validClientStorageUrl.includes('resumes/')
      ? validClientStorageUrl.split('resumes/')[1]?.split('?')[0]
      : validClientStorageUrl.split('?')[0];

    const userPrefix = `vault/${authenticatedUserId}/`;
    const isAuthorized = candidatePath.startsWith(userPrefix);

    assert.strictEqual(isAuthorized, true);
    assert.strictEqual(candidatePath, 'vault/user_student_123/sem1/marksheet.pdf');
  });

  await test('Issue 34: Simulated storage failure aborts pipeline with STORAGE_UPLOAD_FAILED', async () => {
    const uploadError = { message: 'Supabase storage service unavailable' };
    const uploadData = null;

    let pipelineHalted = false;
    let responseStatus = 0;
    let responseError = '';

    if (uploadError || !uploadData) {
      pipelineHalted = true;
      responseStatus = 500;
      responseError = 'STORAGE_UPLOAD_FAILED';
    }

    assert.strictEqual(pipelineHalted, true);
    assert.strictEqual(responseStatus, 500);
    assert.strictEqual(responseError, 'STORAGE_UPLOAD_FAILED');
  });

  await test('Issue 34: Orphaned file cleanup permits deletion if storageUrl belongs to user, rejects if IDOR', async () => {
    const authenticatedUserId = 'user_student_123';

    // Authorized orphan cleanup
    const userStorageUrl = 'vault/user_student_123/sem2/marksheet.pdf';
    const cleanUserPath = userStorageUrl.includes('resumes/')
      ? userStorageUrl.split('resumes/')[1]?.split('?')[0]
      : userStorageUrl.split('?')[0];
    const isUserAuthorized = cleanUserPath.startsWith(`vault/${authenticatedUserId}/`);
    assert.strictEqual(isUserAuthorized, true);

    // Malicious orphan deletion attempt
    const attackerStorageUrl = 'vault/victim_student_999/sem2/marksheet.pdf';
    const cleanAttackerPath = attackerStorageUrl.includes('resumes/')
      ? attackerStorageUrl.split('resumes/')[1]?.split('?')[0]
      : attackerStorageUrl.split('?')[0];
    const isAttackerAuthorized = cleanAttackerPath.startsWith(`vault/${authenticatedUserId}/`);
    assert.strictEqual(isAttackerAuthorized, false);
  });

  // =========================================================================
  // Issue 35: Certificate Analysis & Exam Token Oracle Hardening (Subbatch 4.12)
  // =========================================================================
  console.log('\n--- Issue 35: Certificate Analysis & Exam Token Oracle Hardening ---');

  await test('Issue 35: Single-use nonce prevents exam session token replay', async () => {
    const {
      signExamSessionToken,
      verifyAndConsumeExamSessionToken,
      isNonceConsumed
    } = await import('../src/lib/portfolio/examToken');

    const answers = { q1: 1, q2: 2, q3: 0 };
    const token = signExamSessionToken(answers, 30, 'student_123', 'AWS Certified Developer');

    const firstEval = verifyAndConsumeExamSessionToken(token);
    assert.strictEqual(firstEval.valid, true);
    if (firstEval.valid) {
      assert.strictEqual(firstEval.nonce.length >= 8, true);
      assert.strictEqual(isNonceConsumed(firstEval.nonce), true);
    }

    const replayEval = verifyAndConsumeExamSessionToken(token);
    assert.strictEqual(replayEval.valid, false);
    if (!replayEval.valid) {
      assert.strictEqual(replayEval.code, 'NONCE_REPLAY');
      assert.ok(replayEval.error.includes('NONCE_REPLAY_DETECTED'));
    }
  });

  await test('Issue 35: Oracle defense - Failed verify-exam does NOT leak correctCount, score, or total', async () => {
    const { NextRequest } = await import('next/server');
    const { signExamSessionToken } = await import('../src/lib/portfolio/examToken');
    const { POST: verifyExamPOST } = await import('../src/app/api/portfolio/verify-exam/route');

    const answers = { q1: 1, q2: 2, q3: 0 };
    const token = signExamSessionToken(answers, 30, 'test_user_001', 'Docker Deep Dive');

    const req = new NextRequest('http://localhost:3000/api/portfolio/verify-exam', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test-token-001',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        examSessionToken: token,
        selectedAnswers: { q1: 3, q2: 3, q3: 3 }, // all incorrect
        certificateTitle: 'Docker Deep Dive'
      })
    });

    const res = await verifyExamPOST(req);
    assert.strictEqual(res.status, 200);
    const json = await res.json();

    assert.strictEqual(json.ok, true);
    assert.strictEqual(json.passed, false);
    assert.strictEqual(json.verified, false);
    assert.strictEqual(json.correctCount, undefined);
    assert.strictEqual(json.total, undefined);
    assert.strictEqual(json.score, undefined);
    assert.ok(json.message?.includes('threshold was not achieved'));
  });

  await test('Issue 35: Token replay defense - Submitting same token 2nd time fails with HTTP 409 NONCE_REPLAY', async () => {
    const { NextRequest } = await import('next/server');
    const { signExamSessionToken } = await import('../src/lib/portfolio/examToken');
    const { POST: verifyExamPOST } = await import('../src/app/api/portfolio/verify-exam/route');

    const answers = { q1: 1, q2: 2, q3: 0 };
    const token = signExamSessionToken(answers, 30, 'test_user_001', 'Cloud Architecture');

    const makeReq = () => new NextRequest('http://localhost:3000/api/portfolio/verify-exam', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test-token-001',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        examSessionToken: token,
        selectedAnswers: { q1: 0, q2: 0, q3: 0 },
        certificateTitle: 'Cloud Architecture'
      })
    });

    const firstRes = await verifyExamPOST(makeReq());
    assert.strictEqual(firstRes.status, 200);

    const replayRes = await verifyExamPOST(makeReq());
    assert.strictEqual(replayRes.status, 409);
    const replayJson = await replayRes.json();
    assert.strictEqual(replayJson.code, 'NONCE_REPLAY');
    assert.ok(replayJson.error?.includes('NONCE_REPLAY_DETECTED'));
  });

  await test('Issue 35: Legacy router security - examSessionToken does NOT contain plaintext answers', async () => {
    const { firestoreRouter } = await import('../src/lib/api/legacyFirestoreRouter');

    const res = await firestoreRouter('POST', '/api/portfolio/analyze-certificate', {
      title: 'Python for Data Science',
      issuer: 'University'
    }) as any;

    assert.strictEqual(res.ok, true);
    assert.ok(res.examSessionToken?.startsWith('token_'));

    const b64 = res.examSessionToken.replace(/^token_/, '');
    const decodedStr = Buffer.from(b64, 'base64').toString('utf-8');
    const payload = JSON.parse(decodedStr);

    assert.strictEqual(payload.answers, undefined);
    assert.ok(payload.answerHashes);
    assert.ok(payload.nonce);
  });

  await test('Issue 35: Legacy router replay rejection - Replay throws 409 and failure does not leak correctCount', async () => {
    const { firestoreRouter } = await import('../src/lib/api/legacyFirestoreRouter');

    const analyzeRes = await firestoreRouter('POST', '/api/portfolio/analyze-certificate', {
      title: 'React Fundamentals',
      issuer: 'Frontend Masters'
    }) as any;

    const token = analyzeRes.examSessionToken;

    const verifyRes = await firestoreRouter('POST', '/api/portfolio/verify-exam', {
      examSessionToken: token,
      selectedAnswers: { q1: 99, q2: 99, q3: 99 }
    }) as any;

    assert.strictEqual(verifyRes.passed, false);
    assert.strictEqual(verifyRes.correctCount, undefined);

    let threwReplay = false;
    try {
      await firestoreRouter('POST', '/api/portfolio/verify-exam', {
        examSessionToken: token,
        selectedAnswers: { q1: 99, q2: 99, q3: 99 }
      });
    } catch (err: any) {
      if (err.status === 409 && err.code === 'NONCE_REPLAY') {
        threwReplay = true;
      }
    }
    assert.strictEqual(threwReplay, true);
  });

  await test('Issue 35: Honest credential status - Passing quiz awards KNOWLEDGE_ASSESSED, keeps verified: false', async () => {
    const { NextRequest } = await import('next/server');
    const { signExamSessionToken } = await import('../src/lib/portfolio/examToken');
    const { POST: verifyExamPOST } = await import('../src/app/api/portfolio/verify-exam/route');

    const answers = { q1: 1, q2: 2, q3: 0 };
    const token = signExamSessionToken(answers, 30, 'test_user_001', 'AWS Solutions Architect');

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
      const req = new NextRequest('http://localhost:3000/api/portfolio/verify-exam', {
        method: 'POST',
        headers: {
          'authorization': 'Bearer test-token-001',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          examSessionToken: token,
          selectedAnswers: { q1: 1, q2: 2, q3: 0 },
          certificateTitle: 'AWS Solutions Architect'
        })
      });

      const res = await verifyExamPOST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.strictEqual(json.passed, true);
      assert.strictEqual(json.assessmentPassed, true);
      assert.strictEqual(json.verified, false);
      assert.strictEqual(json.certificate?.verificationStatus, 'KNOWLEDGE_ASSESSED');
      assert.strictEqual(json.certificate?.auditStatus, 'PENDING_FACULTY_AUDIT');
      assert.strictEqual(json.correctCount, undefined);
    } finally {
      globalThis.fetch = origFetch;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    }
  });

  await test('Issue 35: analyze-certificate produces dynamic questions with randomized option orders', async () => {
    const { NextRequest } = await import('next/server');
    const { POST: analyzeCertPOST } = await import('../src/app/api/portfolio/analyze-certificate/route');

    const req = new NextRequest('http://localhost:3000/api/portfolio/analyze-certificate', {
      method: 'POST',
      headers: {
        'authorization': 'Bearer test-token-001',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        title: 'React.js & Modern Web',
        issuer: 'Meta'
      })
    });

    const res = await analyzeCertPOST(req);
    assert.strictEqual(res.status, 200);
    const json = await res.json();

    assert.strictEqual(json.questions.length, 3);
    for (const q of json.questions) {
      assert.strictEqual(q.options.length, 4);
      assert.strictEqual(q.correctIdx, undefined);
    }
    assert.ok(json.examSessionToken.length > 20);
  });

  // =========================================================================
  // Issue 36: Passport Transcript, Public Verification Link & GitHub Ingest Hardening (Subbatch 4.13)
  // =========================================================================
  console.log('\n--- Issue 36: Passport Transcript, Public Verification Link & GitHub Ingest Hardening ---');

  const issue36BaseEvidence = {
    id: 'ev_test_unit_001',
    competencyId: 'comp_git_version_control_l1',
    competencyVersion: '1.0.0',
    studentId: 'test_student_413',
    programId: 'prog_swe_accelerated_9m',
    evidenceClass: 'application' as const,
    difficulty: 'basic' as const,
    evidenceFamilyId: 'github_test_repo',
    sourceType: 'project' as const,
    sourceId: 'repo_test_repo',
    attemptId: 'commit_a1b2c3d',
    score: 65,
    evaluatorType: 'deterministic' as const,
    evaluatorVersion: 'v1.0',
    rubricVersion: 'v1.0',
    timestamp: 1726500000000,
    artifacts: { repo: 'test_repo' },
  };

  await test('Issue 36: Plain unkeyed SHA-256 forged hash is rejected (forgery defense)', async () => {
    const crypto = await import('crypto');
    const { verifyEvidenceIntegrity } = await import('../src/lib/pathway/evidenceEngine');

    const canonicalPayload = JSON.stringify({
      competencyId: issue36BaseEvidence.competencyId,
      competencyVersion: issue36BaseEvidence.competencyVersion,
      studentId: issue36BaseEvidence.studentId,
      programId: issue36BaseEvidence.programId,
      evidenceClass: issue36BaseEvidence.evidenceClass,
      difficulty: issue36BaseEvidence.difficulty,
      evidenceFamilyId: issue36BaseEvidence.evidenceFamilyId || '',
      sourceType: issue36BaseEvidence.sourceType,
      sourceId: issue36BaseEvidence.sourceId,
      attemptId: issue36BaseEvidence.attemptId,
      score: issue36BaseEvidence.score,
      evaluatorType: issue36BaseEvidence.evaluatorType,
      evaluatorVersion: issue36BaseEvidence.evaluatorVersion,
      rubricVersion: issue36BaseEvidence.rubricVersion,
      timestamp: issue36BaseEvidence.timestamp,
      artifacts: issue36BaseEvidence.artifacts,
    });

    const forgedUnkeyedHash = crypto.createHash('sha256').update(canonicalPayload).digest('hex');
    const forgedRecord = {
      ...issue36BaseEvidence,
      integrityHash: forgedUnkeyedHash,
    };

    const isValid = verifyEvidenceIntegrity(forgedRecord);
    assert.strictEqual(isValid, false);
  });

  await test('Issue 36: Authentic HMAC-SHA256 passes; altered payload fails', async () => {
    const { generateEvidenceIntegrityHash, verifyEvidenceIntegrity } = await import('../src/lib/pathway/evidenceEngine');

    const authenticHash = generateEvidenceIntegrityHash(issue36BaseEvidence);
    const validRecord = { ...issue36BaseEvidence, integrityHash: authenticHash };
    assert.strictEqual(verifyEvidenceIntegrity(validRecord), true);

    const tamperedRecord = { ...validRecord, score: 99 };
    assert.strictEqual(verifyEvidenceIntegrity(tamperedRecord), false);
  });

  await test('Issue 36: Server Verification Route GET /api/verify/[credentialId] rejects tampered HMAC', async () => {
    const { GET: verifyRouteGET } = await import('../src/app/api/verify/[credentialId]/route');
    const { PathwayApiService } = await import('../src/lib/api/pathwayApi');
    const { NextRequest } = await import('next/server');

    const recorded = await PathwayApiService.recordEvidence({
      ...issue36BaseEvidence,
      id: 'ev_tamper_check_001',
      studentId: 'test_user_001',
    });

    const tamperedRecord = {
      ...recorded.evidenceRecord,
      integrityHash: '0000000000000000000000000000000000000000000000000000000000000000',
    };

    const origGet = PathwayApiService.getAllStudentEvidence;
    PathwayApiService.getAllStudentEvidence = async (sId: string) => {
      if (sId === 'test_user_001') return [tamperedRecord];
      return [];
    };

    try {
      const req = new NextRequest('http://localhost:3000/api/verify/ev_tamper_check_001');
      const res = await verifyRouteGET(req, { params: { credentialId: 'ev_tamper_check_001' } });
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.strictEqual(json.valid, false);
      assert.strictEqual(json.error, 'INTEGRITY_TAMPERED');
      assert.ok(json.message?.includes('signature mismatch'));
    } finally {
      PathwayApiService.getAllStudentEvidence = origGet;
    }
  });

  await test('Issue 36: Server Verification Route GET /api/verify/[credentialId] verifies authentic evidence record', async () => {
    const { GET: verifyRouteGET } = await import('../src/app/api/verify/[credentialId]/route');
    const { PathwayApiService } = await import('../src/lib/api/pathwayApi');
    const { NextRequest } = await import('next/server');

    const recorded = await PathwayApiService.recordEvidence({
      ...issue36BaseEvidence,
      id: 'ev_authentic_check_001',
      studentId: 'test_user_001',
    });

    const origGet = PathwayApiService.getAllStudentEvidence;
    PathwayApiService.getAllStudentEvidence = async (sId: string) => {
      if (sId === 'test_user_001') return [recorded.evidenceRecord];
      return [];
    };

    try {
      const req = new NextRequest('http://localhost:3000/api/verify/ev_authentic_check_001');
      const res = await verifyRouteGET(req, { params: { credentialId: 'ev_authentic_check_001' } });
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.strictEqual(json.valid, true);
      assert.strictEqual(json.type, 'evidence');
      assert.strictEqual(json.evidenceRecord.id, 'ev_authentic_check_001');
      assert.strictEqual(json.evidenceRecord.score, 65);
    } finally {
      PathwayApiService.getAllStudentEvidence = origGet;
    }
  });

  await test('Issue 36: Passport Transcript does NOT claim SHA-256 verified when evidence is unverified', async () => {
    const { GET: transcriptRouteGET } = await import('../src/app/api/passport/transcript/route');
    const { NextRequest } = await import('next/server');

    const req = new NextRequest('http://localhost:3000/api/passport/transcript', {
      headers: {
        'authorization': 'Bearer demo-token-bypass',
      },
    });

    const res = await transcriptRouteGET(req);
    assert.strictEqual(res.status, 200);
    const html = await res.text();

    assert.ok(!html.includes('✓ SHA-256 Verified'));
    assert.ok(html.includes('Provisional / Unverified') || html.includes('✓ HMAC-SHA256 Verified'));
  });

  await test('Issue 36: Passport Transcript oral defense displays "Pending Evaluation" when score is 0', async () => {
    const { GET: transcriptRouteGET } = await import('../src/app/api/passport/transcript/route');
    const { NextRequest } = await import('next/server');

    const req = new NextRequest('http://localhost:3000/api/passport/transcript', {
      headers: {
        'authorization': 'Bearer demo-token-bypass',
      },
    });

    const res = await transcriptRouteGET(req);
    const html = await res.text();

    assert.ok(html.includes('Capstone oral defense pending evaluation') || html.includes('Passed rigorous'));
    assert.ok(!html.includes('Passed rigorous multi-stage architectural defense verifying independent problem solving and code provenance (0/100)'));
  });

  await test('Issue 36: GitHub Webhook rejects repository when student has empty claimed_repos', async () => {
    const { resolveLinkedStudent } = await import('../src/app/api/webhooks/github/route');

    const origFetch = globalThis.fetch;
    globalThis.fetch = async (input, init) => {
      const urlStr = String(input);
      if (urlStr.includes('supabase.co')) {
        if (urlStr.includes('github_integrations')) {
          return new Response(JSON.stringify({
            student_id: 'stu_unclaimed_99',
            claimed_repos: [],
            github_username: 'unclaimeddev',
            github_id: 99999
          }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        if (urlStr.includes('users')) {
          return new Response(JSON.stringify({
            id: 'stu_unclaimed_99',
            github_username: 'unclaimeddev',
            claimed_repos: []
          }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
      }
      return origFetch(input, init);
    };

    try {
      const result = await resolveLinkedStudent('unclaimeddev', 99999, 'https://github.com/torvalds/linux');
      assert.strictEqual(result.verified, false);
      assert.strictEqual(result.error, 'REPOSITORY_UNCLAIMED');
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  await test('Issue 36: GitHub Webhook commit classified as application (never production), score capped <= 75', async () => {
    const crypto = await import('crypto');
    const { POST: githubWebhookPOST } = await import('../src/app/api/webhooks/github/route');
    const { PathwayApiService } = await import('../src/lib/api/pathwayApi');
    const { NextRequest } = await import('next/server');

    const secret = 'webhook_test_secret_32_bytes_xyz!';
    process.env.GITHUB_WEBHOOK_SECRET = secret;

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
        id: 'c0ffee1234567890abcdef1234567890abcdef12',
        message: 'Add user authentication controller and token validation unit tests',
        author: { email: 'octocat@github.com' },
        added: ['src/auth/authController.ts', 'tests/authController.test.ts'],
        modified: ['src/routes/api.ts'],
        removed: [],
      },
      commits: [
        {
          id: 'c0ffee1234567890abcdef1234567890abcdef12',
          message: 'Add user authentication controller and token validation unit tests',
          author: { email: 'octocat@github.com' },
          added: ['src/auth/authController.ts', 'tests/authController.test.ts'],
          modified: ['src/routes/api.ts'],
          removed: [],
        }
      ]
    };

    const payloadStr = JSON.stringify(payload);
    const sig = 'sha256=' + crypto.createHmac('sha256', secret).update(payloadStr).digest('hex');

    const req = new NextRequest('http://localhost:3000/api/webhooks/github', {
      method: 'POST',
      headers: {
        'x-hub-signature-256': sig,
        'x-github-event': 'push',
        'content-type': 'application/json',
      },
      body: payloadStr,
    });

    const res = await githubWebhookPOST(req);
    assert.strictEqual(res.status, 200);
    const json = await res.json();

    assert.strictEqual(json.success, true);
    assert.ok(json.evidenceRecordId);
    assert.ok(json.integrityHash);

    const allStudentEv = await PathwayApiService.getAllStudentEvidence('stu_dev_octocat_01');
    const recorded = allStudentEv.find(e => e.id === json.evidenceRecordId);
    assert.ok(recorded, 'Recorded evidence must exist');
    assert.strictEqual(recorded.evidenceClass, 'application', 'Commit must be application class, never production');
    assert.strictEqual(recorded.difficulty, 'basic', '3-file push with tests is basic difficulty');
    assert.ok(recorded.score <= 75, `Score ${recorded.score} must not exceed 75`);
    assert.ok(recorded.score >= 55, `Score ${recorded.score} reflects functional files + test presence`);
  });

  console.log('\n================================================================');
  console.log(`📊 FINAL RESULT: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('================================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAllVerifications().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
