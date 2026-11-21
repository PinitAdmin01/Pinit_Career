import test from 'node:test';
import assert from 'node:assert/strict';
import * as zlib from 'zlib';
import {
  extractTextFromPdfBuffer,
  extractEmbeddedImagesFromPdf,
  isReadableDocumentText,
} from '../src/lib/ats/pdfTextExtractor';
import {
  analyzeDocumentTextWithGroq,
  analyzeVaultFileBufferWithGroq,
  evaluateDefenseWithGroq,
  extractDocumentWithGroqVision,
  extractPdfTextWithPdfJs,
  getGroqApiKeys,
  setGroqAnalyzerFetchForTests,
} from '../src/lib/vault/groqDocumentAnalyzer';
import {
  extractSkillsFast,
  generateBrutalDefensePrompt,
  resolveVaultAuditorMentor,
  type VaultDefenseChallenge,
} from '../src/lib/vault/vaultDefenseEngine';

function buildModernPdfWithObjStmAndKerning(): Buffer {
  // Content stream (obj 3) with TJ negative kerning word spacing & Tm newlines
  const contentStream = [
    'BT',
    '/F1 12 Tf',
    '1 0 0 1 72 720 Tm',
    '[(Vin) -10 (ay) -240 (Kas) -10 (hyap)] TJ',
    '1 0 0 1 72 700 Tm',
    '[(Ski) -10 (lls:) -250 (Flu) -10 (tter,) -220 (Dar) -10 (t,) -220 (Fir) -10 (ebase,) -220 (ESP) -5 (32,) -220 (Fast) -10 (API)] TJ',
    '1 0 0 1 72 680 Tm',
    '(Project: Smart Campus IoT Telemetry & Flutter Mobile App) Tj',
    'ET',
  ].join('\n');
  const compressedContent = zlib.deflateSync(Buffer.from(contentStream, 'utf8'));

  // Compressed /ObjStm (obj 10) holding Page object (obj 2) which references /Contents 3 0 R
  const pageObjBody = '<< /Type /Page /Contents 3 0 R >>';
  const header = '2 0 ';
  const objStmPayload = Buffer.from(header + pageObjBody, 'latin1');
  const compressedObjStm = zlib.deflateSync(objStmPayload);

  const parts: Buffer[] = [
    Buffer.from('%PDF-1.5\n', 'binary'),
    Buffer.from(
      `10 0 obj\n<< /Type /ObjStm /N 1 /First ${header.length} /Filter /FlateDecode /Length ${compressedObjStm.length} >>\nstream\n`,
      'binary'
    ),
    compressedObjStm,
    Buffer.from('\nendstream\nendobj\n', 'binary'),
    Buffer.from(
      `3 0 obj\n<< /Filter /FlateDecode /Length ${compressedContent.length} >>\nstream\n`,
      'binary'
    ),
    compressedContent,
    Buffer.from('\nendstream\nendobj\n%%EOF\n', 'binary'),
  ];

  return Buffer.concat(parts);
}

function buildScannedImageOnlyPdf(): Buffer {
  // Fake JPEG image > 5KB with valid SOI (FF D8 FF) and EOI (FF D9)
  const jpegBody = Buffer.alloc(5200, 0x42);
  const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), jpegBody, Buffer.from([0xff, 0xd9])]);

  return Buffer.concat([
    Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /XObject /Subtype /Image /Filter /DCTDecode >>\nstream\n', 'binary'),
    jpeg,
    Buffer.from('\nendstream\nendobj\n%%EOF\n', 'binary'),
  ]);
}

test('PDF extractor unpacks /ObjStm, honors TJ kerning spaces, and preserves Tm line breaks', () => {
  const pdfBuf = buildModernPdfWithObjStmAndKerning();
  const res = extractTextFromPdfBuffer(pdfBuf);

  assert.equal(res.error, undefined);
  assert.ok(res.extractionConfidence >= 0.9, `Expected high confidence, got ${res.extractionConfidence}`);
  assert.match(res.rawText, /Vinay Kashyap/);
  assert.match(res.rawText, /Flutter/);
  assert.match(res.rawText, /Firebase/);
  assert.match(res.rawText, /ESP32/);
  assert.match(res.rawText, /FastAPI/);
  assert.match(res.rawText, /Smart Campus IoT Telemetry/);
});

test('Blank/empty PDF still triggers honest refusal with zero confidence', () => {
  const emptyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n', 'binary');
  const res = extractTextFromPdfBuffer(emptyPdf);
  assert.equal(res.extractionConfidence, 0);
  assert.equal(res.rawText, '');
  assert.ok(res.error?.includes('UNREADABLE_DOCUMENT'));
});

test('Scanned image-only PDF extracts embedded JPEG and routes through Groq Vision', async () => {
  const scannedPdf = buildScannedImageOnlyPdf();
  const images = extractEmbeddedImagesFromPdf(scannedPdf);
  assert.equal(images.length, 1);
  assert.equal(images[0].mimeType, 'image/jpeg');
  assert.ok(images[0].bytes > 5000);

  let visionCalled = false;
  setGroqAnalyzerFetchForTests(async (_url, init) => {
    const body = JSON.parse(String(init?.body || '{}'));
    const userContent = body?.messages?.[1]?.content;
    if (Array.isArray(userContent) && userContent.some((c: any) => c.type === 'image_url')) {
      visionCalled = true;
    }
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                candidateName: 'Aarav Rao',
                institution: 'RV College of Engineering',
                documentType: 'resume',
                rawText: 'Aarav Rao — Flutter, Dart, Firebase, ESP32 IoT Telemetry Dashboard, MQTT',
                skills: ['Flutter', 'Dart', 'Firebase', 'ESP32', 'MQTT'],
                projects: [
                  {
                    name: 'Smart Solar Telemetry Node',
                    techStack: ['ESP32', 'MQTT', 'Flutter'],
                    claim: 'Streamed 10Hz solar inverter metrics over MQTT to a Flutter dashboard.',
                  },
                ],
                certifications: ['AWS Cloud Practitioner'],
                summary: 'IoT and mobile engineering candidate building ESP32 + Flutter apps.',
                defenseQuestions: [
                  'Question 1 of 3: In your Smart Solar Telemetry Node, how did you handle MQTT reconnects and QoS packet loss on the ESP32?',
                  'Question 2 of 3: In Flutter, how did you prevent high-frequency 10Hz Firebase/MQTT stream updates from causing widget rebuild jank?',
                  'Question 3 of 3: How did you secure device-to-cloud credentials on ESP32 and enforce per-device rules in Firebase?',
                ],
              }),
            },
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });

  try {
    const result = await analyzeVaultFileBufferWithGroq(scannedPdf, 'canva_resume.pdf', 'application/pdf', {
      auditorName: 'Mr. Akash',
      customGroqKey: 'gsk_test_key_123',
    });

    assert.equal(visionCalled, true, 'Scanned PDF must invoke Groq Vision');
    assert.equal(result.groqAnalysis?.source, 'groq-vision');
    assert.deepEqual(result.groqAnalysis?.skills, ['Flutter', 'Dart', 'Firebase', 'ESP32', 'MQTT']);
    assert.equal(result.groqAnalysis?.projects[0]?.name, 'Smart Solar Telemetry Node');
    assert.equal(result.groqAnalysis?.defenseQuestions.length, 3);
    assert.ok(!result.groqAnalysis?.skills.includes('System Design'));
  } finally {
    setGroqAnalyzerFetchForTests(null);
  }
});

test('Groq text resume analysis extracts real skills & projects and drives resume-specific defense questions', async () => {
  const modelsTried: string[] = [];

  setGroqAnalyzerFetchForTests(async (_url, init) => {
    const body = JSON.parse(String(init?.body || '{}'));
    modelsTried.push(body.model);
    // Simulate rate limit on first model to prove automatic failover
    if (modelsTried.length === 1) {
      return new Response('rate limited', { status: 429 });
    }
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                candidateName: 'Priya Menon',
                institution: 'BMS College of Engineering',
                documentType: 'resume',
                skills: ['Next.js', 'TypeScript', 'PostgreSQL', 'LangChain', 'Docker', 'Prisma'],
                projects: [
                  {
                    name: 'PinIT Career OS',
                    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'LangChain'],
                    claim: 'Built an AI career assessment engine with RAG over curriculum embeddings.',
                  },
                ],
                certifications: ['Meta Front-End Developer'],
                summary: 'Full-stack AI engineer working with Next.js, TypeScript, PostgreSQL, and LangChain.',
                defenseQuestions: [
                  'Question 1 of 3: In PinIT Career OS, how did you structure your LangChain retrieval pipeline and prevent hallucinated citations?',
                  'Question 2 of 3: Explain how you optimized PostgreSQL queries and Prisma connection pooling under Next.js serverless cold starts.',
                  'Question 3 of 3: Walk through a real Docker multi-stage build or production deployment bug you hit while shipping PinIT Career OS.',
                ],
              }),
            },
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });

  try {
    const analysis = await analyzeDocumentTextWithGroq(
      'Priya Menon | Next.js, TypeScript, PostgreSQL, LangChain, Docker, Prisma | Built PinIT Career OS with RAG',
      {
        title: 'Primary Candidate Master Resume',
        auditorName: 'Mr. Akash',
        customGroqKey: 'gsk_test_key_456',
      }
    );

    assert.ok(analysis);
    assert.equal(modelsTried.length, 2, 'Should fail over to second Groq model after 429');
    assert.equal(analysis.source, 'groq-text');
    assert.ok(analysis.skills.includes('LangChain'));
    assert.ok(analysis.skills.includes('Next.js'));
    assert.ok(!analysis.skills.includes('System Design'), 'Must NOT inject default System Design');

    const challenge: VaultDefenseChallenge = {
      docId: 'doc_1',
      title: 'Primary Candidate Master Resume',
      itemType: 'resume',
      claimedSkills: analysis.skills,
      projects: analysis.projects,
      summary: analysis.summary,
      defenseQuestions: analysis.defenseQuestions,
      analysisSource: analysis.source,
      auditor: resolveVaultAuditorMentor('priya'),
      createdAt: new Date().toISOString(),
    };

    const q1 = generateBrutalDefensePrompt(challenge, 0);
    const q2 = generateBrutalDefensePrompt(challenge, 1);
    const q3 = generateBrutalDefensePrompt(challenge, 2);

    assert.match(q1, /PinIT Career OS/i);
    assert.match(q1, /LangChain/i);
    assert.doesNotMatch(q1, /Pick up System Design/i);
    assert.match(q2, /PostgreSQL/i);
    assert.match(q3, /Docker/i);
  } finally {
    setGroqAnalyzerFetchForTests(null);
  }
});

test('Groq Vision handles direct PNG resume image uploads', async () => {
  setGroqAnalyzerFetchForTests(async () =>
    new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                candidateName: 'Kiran Verma',
                institution: 'Christ University',
                documentType: 'resume',
                rawText: 'Kiran Verma — Tally Prime, GST Filing, IFRS, Excel VBA, Financial Modeling',
                skills: ['Tally Prime', 'GST Filing', 'IFRS', 'Excel VBA', 'Financial Modeling'],
                projects: [
                  {
                    name: '3-Statement DCF Valuation Model',
                    techStack: ['Excel VBA', 'Financial Modeling'],
                    claim: 'Built dynamic WACC sensitivity tables for NSE mid-cap manufacturing firms.',
                  },
                ],
                certifications: ['NISM Series VIII'],
                summary: 'Commerce & Finance candidate specializing in DCF modeling, IFRS, and GST.',
                defenseQuestions: [
                  'Question 1 of 3: In your 3-Statement DCF Valuation Model, how did you link working capital changes from the balance sheet into Free Cash Flow to Firm?',
                  'Question 2 of 3: Explain how you reconcile GSTR-2B input tax credit mismatches inside Tally Prime before filing GSTR-3B.',
                  'Question 3 of 3: Under IFRS 16, how does capitalizing an operating lease affect EBITDA versus net income?',
                ],
              }),
            },
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  );

  try {
    const fakePngBase64 = Buffer.alloc(300, 0xaa).toString('base64');
    const res = await extractDocumentWithGroqVision('image/png', fakePngBase64, {
      fileName: 'kiran_resume.png',
      auditorName: 'Ms. Priya',
      customGroqKey: 'gsk_test_vision',
    });

    assert.ok(res);
    assert.equal(res.source, 'groq-vision');
    assert.ok(res.skills.includes('Tally Prime'));
    assert.ok(res.skills.includes('Financial Modeling'));
    assert.match(res.defenseQuestions[0], /DCF Valuation Model/i);
  } finally {
    setGroqAnalyzerFetchForTests(null);
  }
});

test('Groq defense grading strictly passes real answers (+5) and fails bluff answers (-5)', async () => {
  let callIndex = 0;
  setGroqAnalyzerFetchForTests(async () => {
    callIndex++;
    if (callIndex === 1) {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  passed: true,
                  score: 86,
                  critique: 'Candidate accurately explained MQTT QoS 1 redelivery, Flutter StreamBuilder throttling, and Firebase custom claims.',
                }),
              },
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                passed: false,
                score: 22,
                critique: 'Candidate evaded all 3 questions with "idk" and could not explain a single claimed skill from their resume.',
              }),
            },
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });

  try {
    const passRes = await evaluateDefenseWithGroq({
      title: 'Primary Candidate Master Resume',
      auditorName: 'Mr. Akash',
      claimedSkills: ['Flutter', 'Firebase', 'ESP32', 'MQTT'],
      questions: ['Q1 about ESP32 MQTT', 'Q2 about Flutter rebuilds', 'Q3 about Firebase security'],
      answers: [
        'We used MQTT QoS 1 with exponential backoff and persistent sessions on ESP32 so dropped packets retransmit after WiFi reconnect.',
        'We debounced incoming 10Hz frames into a 250ms ring buffer and scoped ValueListenableBuilder to leaf widgets to stay at 60fps.',
        'Each ESP32 signs a short-lived JWT with a provisioned key, and Firestore rules verify request.auth.token.deviceId matches the path.',
      ],
      customGroqKey: 'gsk_test_grade',
    });

    assert.equal(passRes.gradingSource, 'groq');
    assert.equal(passRes.passed, true);
    assert.equal(passRes.score, 86);
    assert.equal(passRes.trustDelta, 5);
    assert.deepEqual(passRes.verifiedSkillsAdded, ['Flutter', 'Firebase', 'ESP32', 'MQTT']);

    const failRes = await evaluateDefenseWithGroq({
      title: 'Primary Candidate Master Resume',
      auditorName: 'Mr. Akash',
      claimedSkills: ['Flutter', 'Firebase', 'ESP32', 'MQTT'],
      questions: ['Q1 about ESP32 MQTT', 'Q2 about Flutter rebuilds', 'Q3 about Firebase security'],
      answers: ['idk', 'i just copied a youtube tutorial', 'not sure'],
      customGroqKey: 'gsk_test_grade',
    });

    assert.equal(failRes.gradingSource, 'groq');
    assert.equal(failRes.passed, false);
    assert.equal(failRes.score, 22);
    assert.equal(failRes.trustDelta, -5);
    assert.deepEqual(failRes.verifiedSkillsAdded, []);
  } finally {
    setGroqAnalyzerFetchForTests(null);
  }
});

test('getGroqApiKeys deduplicates custom key, GROQ_API_KEYS pool, and GROQ_API_KEY', () => {
  const prevPool = process.env.GROQ_API_KEYS;
  const prevSingle = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEYS = 'k1, k2, k1';
  process.env.GROQ_API_KEY = 'k2';
  try {
    const keys = getGroqApiKeys('k0');
    assert.deepEqual(keys.slice(0, 3), ['k0', 'k1', 'k2']);
  } finally {
    if (prevPool === undefined) delete process.env.GROQ_API_KEYS;
    else process.env.GROQ_API_KEYS = prevPool;
    if (prevSingle === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = prevSingle;
  }
});

test('VaultDefenseRoom reuses existing AI Interview studio components and live /api/interview/chat conversational backend', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const roomSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/interview/components/VaultDefenseRoom.tsx'),
    'utf8'
  );
  const chatSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/api/interview/chat/route.ts'),
    'utf8'
  );

  // Must reuse existing AI Interview Studio primitives instead of a separate toy chat box
  assert.match(roomSrc, /InterviewSessionHeader/);
  assert.match(roomSrc, /InterviewVoiceHud/);
  assert.match(roomSrc, /Round1Behavioral/);
  assert.match(roomSrc, /useInterviewVoice/);
  assert.match(roomSrc, /useInterviewGaze/);
  assert.match(roomSrc, /\/api\/interview\/chat/);
  assert.match(roomSrc, /stage:\s*'vault_defense'/);

  // /api/interview/chat must support reactive vault_defense stage grounded in vaultContext
  assert.match(chatSrc, /stage === 'vault_defense'/);
  assert.match(chatSrc, /vaultContext/);
  assert.match(chatSrc, /STRICT AUDIT RULES:/);
  assert.match(chatSrc, /I don't know/);
});

test('isReadableDocumentText rejects garbled CID/font junk and accepts real resumes', () => {
  assert.equal(isReadableDocumentText('$8A) !#9F %^&* ()_+ {}[] :;<> ~` 0024 0038'), false);
  assert.equal(isReadableDocumentText('1 0 obj << /Filter /FlateDecode >> endobj endstream'), false);
  assert.equal(isReadableDocumentText('short text'), false);
  assert.equal(
    isReadableDocumentText(
      'Vinay N Kashyap | Full-Stack Software Engineer | Skills: Next.js, TypeScript, Flutter, PostgreSQL, Docker, ESP32 IoT'
    ),
    true
  );
});

test('extractSkillsFast NEVER fabricates fake System Design / Problem Solving for generic resume titles', () => {
  const fromGeneric = extractSkillsFast('Supporting Document Primary Candidate Master Resume');
  assert.deepEqual(fromGeneric, []);
});

test('unpdf Mozilla PDF.js decodes valid standard PDF documents into clean text', async () => {
  // Build a minimal standards-compliant PDF 1.4 with xref table so Mozilla PDF.js parses it cleanly
  const content = 'BT /F1 12 Tf 72 720 Td (Vinay Kashyap - Resume: Flutter, Firebase, Python, FastAPI, Docker) Tj ET';
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 =
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n';
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  const obj5 = `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`;

  const header = '%PDF-1.4\n';
  const offsets: number[] = [];
  let body = header;
  for (const obj of [obj1, obj2, obj3, obj4, obj5]) {
    offsets.push(body.length);
    body += obj;
  }
  const xrefStart = body.length;
  body += 'xref\n0 6\n0000000000 65535 f \n';
  for (const off of offsets) {
    body += `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  body += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  const res = await extractPdfTextWithPdfJs(Buffer.from(body, 'binary'));
  assert.ok(res, 'unpdf should decode standard PDF');
  assert.match(res.rawText, /Vinay Kashyap/);
  assert.match(res.rawText, /Flutter/);
  assert.match(res.rawText, /FastAPI/);
});

test('Proof Vault exposes secure /api/vault/file viewer endpoint and in-app Preview + Re-scan modal', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const fileRouteSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/api/vault/file/route.ts'),
    'utf8'
  );
  const vaultPageSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/vault/page.tsx'),
    'utf8'
  );

  assert.match(fileRouteSrc, /requireUserFromRequest/);
  assert.match(fileRouteSrc, /storagePath\.startsWith\(`vault\/\$\{userId\}\/`\)/);
  assert.match(fileRouteSrc, /Content-Disposition/);
  assert.match(vaultPageSrc, /\/api\/vault\/file\?docId=/);
  assert.match(vaultPageSrc, /openDocumentViewer/);
  assert.match(vaultPageSrc, /handleRescanDocument/);
  assert.match(vaultPageSrc, /Re-scan with Groq AI/);
});
