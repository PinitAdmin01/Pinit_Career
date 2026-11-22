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
  evaluateVaultDefenseResponses,
  extractSkillsFast,
  generateBrutalDefensePrompt,
  inferPreferredCodingLanguage,
  isCodingResumeChallenge,
  resolveOralDefenseTurnCount,
  resolveVaultAuditorMentor,
  type VaultDefenseChallenge,
} from '../src/lib/vault/vaultDefenseEngine';
import {
  compilePublicPortfolio,
  verifyPortfolioProof,
} from '../src/lib/admin/portfolio';

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

test('Task 1 & 2: Vault file/defense-session/verify-defense routes NEVER query nonexistent proof_url or endorsement_note columns and rescan preserves projects', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const fileRouteSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/api/vault/file/route.ts'),
    'utf8'
  );
  const defenseSessionSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/api/vault/defense-session/route.ts'),
    'utf8'
  );
  const verifyDefenseSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/api/vault/verify-defense/route.ts'),
    'utf8'
  );
  const vaultPageSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/vault/page.tsx'),
    'utf8'
  );

  // Must select '*' so missing proof_url never triggers Postgres 42703 errors breaking preview & rescan
  assert.match(fileRouteSrc, /\.select\('\*'\)/);
  assert.doesNotMatch(fileRouteSrc, /\.select\([^)]*proof_url/);
  assert.match(defenseSessionSrc, /\.select\('\*'\)/);
  assert.doesNotMatch(defenseSessionSrc, /\.select\([^)]*proof_url/);

  // verify-defense must NOT write nonexistent endorsement_note / verified_at columns on vault_items
  assert.doesNotMatch(verifyDefenseSrc, /endorsement_note/);
  assert.doesNotMatch(verifyDefenseSrc, /verified_at/);
  assert.match(verifyDefenseSrc, /provenSkills/);
  assert.match(verifyDefenseSrc, /portfolio_items/);

  // Rescan must never wipe real projects or overwrite rawTextExcerpt with synthetic Document Title / Claimed Skills text
  assert.match(vaultPageSrc, /isSyntheticRaw/);
  assert.match(vaultPageSrc, /prevAi\.projects/);
});

test('Task 3: Granular per-skill proof syncs accurately proven React even when full resume defense fails (-5 Trust)', async () => {
  const claimedSkills = ['Python', 'FastAPI', 'PostgreSQL', 'Next.js', 'Supabase', 'React.js'];
  const questions = [
    'You listed FastAPI alongside PostgreSQL in your resume. What exception hierarchy converts Pydantic failures into 422?',
    'In Next.js App Router using Supabase, how do revalidatePath and session expiration interact?',
    'In React 18, how does useEffect reference equality trigger infinite re-renders on object props and how do you memoize it?',
  ];
  const answers = [
    'i dont know',
    'i can do html, caa, js, react',
    'React 18 checks useEffect dependencies using Object.is (reference equality, not deep comparison). When a parent re-renders and creates a new object literal, JavaScript allocates a new memory reference, making React think the prop changed—so the effect re-runs, updates state, re-renders the parent, and loops infinitely. To prevent this, wrap the object in useMemo in the parent (keyed on its primitive values) so the reference stays identical across renders, or pass only the specific primitive properties into the useEffect dependency array.',
  ];

  // 1. Deterministic evaluator path
  const detRes = evaluateVaultDefenseResponses(claimedSkills, answers);
  assert.equal(detRes.passed, false);
  assert.equal(detRes.trustDelta, -5);
  assert.ok(
    (detRes.provenSkills || []).some((s) => s.toLowerCase().startsWith('react')),
    `Expected React in deterministic provenSkills, got: ${JSON.stringify(detRes.provenSkills)}`
  );
  // Must NOT duplicate React + React.js
  const reactEntries = (detRes.provenSkills || []).filter((s) => s.toLowerCase().startsWith('react'));
  assert.equal(reactEntries.length, 1, `Should not duplicate React/React.js: ${JSON.stringify(reactEntries)}`);
  // Must NOT credit unanswered FastAPI / PostgreSQL / Next.js / Supabase
  for (const unproven of ['fastapi', 'postgresql', 'next.js', 'supabase']) {
    assert.ok(
      !(detRes.provenSkills || []).some((s) => s.toLowerCase() === unproven),
      `Unproven skill ${unproven} must NOT be credited`
    );
  }

  // 2. Groq evaluator path returning explicit provenSkills: ['React'] on failed overall defense
  setGroqAnalyzerFetchForTests(async () =>
    new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                passed: false,
                score: 45,
                provenSkills: ['React'],
                critique:
                  'Failed FastAPI/PostgreSQL and deflected Next.js/Supabase, but gave a technically accurate explanation of React 18 useEffect Object.is reference equality and useMemo.',
              }),
            },
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  );

  try {
    const groqPartial = await evaluateDefenseWithGroq({
      title: 'Vinay N — Full Stack Developer & AI Engineer Resume',
      auditorName: 'Mr. Akash',
      claimedSkills,
      questions,
      answers,
      customGroqKey: 'gsk_test_partial',
    });

    assert.equal(groqPartial.gradingSource, 'groq');
    assert.equal(groqPartial.passed, false);
    assert.equal(groqPartial.score, 45);
    assert.equal(groqPartial.trustDelta, -5);
    assert.deepEqual(groqPartial.provenSkills, ['React']);
    assert.deepEqual(groqPartial.verifiedSkillsAdded, ['React']);
  } finally {
    setGroqAnalyzerFetchForTests(null);
  }
});

test('Task 3: Shareable public portfolio compiles verifiedSkills + professionalPitch and preserves SHA-256 proof', async () => {
  const portfolio = compilePublicPortfolio({
    studentId: 'usr_vinay_test_01',
    fullName: 'Vinay N',
    completedQuestsCount: 2,
    verifiedSkills: ['React', 'react', 'TypeScript'],
    professionalPitch: 'Full Stack Developer with live-verified hands-on proficiency in React, TypeScript.',
    capstones: [],
    exams: [],
    employabilityScore: 42,
    tier: 'APPRENTICE_DEVELOPER',
  });

  assert.deepEqual(portfolio.verifiedSkills, ['React', 'TypeScript']);
  assert.match(portfolio.professionalPitch || '', /React/);
  assert.equal(verifyPortfolioProof(portfolio), true, 'SHA-256 cryptographic proof must remain valid');

  const fs = await import('node:fs');
  const path = await import('node:path');
  const roomSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/interview/components/VaultDefenseRoom.tsx'),
    'utf8'
  );
  const portfolioTabSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/profile/tabs/PortfolioTab.tsx'),
    'utf8'
  );
  const publicPageSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/university/portfolio/[studentId]/page.tsx'),
    'utf8'
  );
  const showcaseSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/components/university/StudentPortfolioShowcase.tsx'),
    'utf8'
  );

  assert.match(roomSrc, /provenSkills:\s*skillsToSync/);
  assert.match(roomSrc, /cOS\.addVerifiedSkills\(finalSyncedSkills/);
  assert.match(portfolioTabSrc, /pinit-skills-updated/);
  assert.match(portfolioTabSrc, /effectivePitch/);
  assert.match(portfolioTabSrc, /\/university\/portfolio\//);
  assert.match(publicPageSrc, /\.from\('users'\)\s*\.select\('\*'\)/);
  assert.match(publicPageSrc, /portfolio_items/);
  assert.match(showcaseSrc, /shareable-verified-skills/);
  assert.match(showcaseSrc, /shareable-portfolio-pitch/);
});

test('Task 1 (PDF Preview CSP & New Tab): middleware, next.config, and firebase.json allow blob: + supabase in frame-src & object-src, and vault uses signedUrl for new tab', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const middlewareSrc = fs.readFileSync(path.join(process.cwd(), 'src/middleware.ts'), 'utf8');
  const nextCfgSrc = fs.readFileSync(path.join(process.cwd(), 'next.config.js'), 'utf8');
  const firebaseSrc = fs.readFileSync(path.join(process.cwd(), 'firebase.json'), 'utf8');
  const fileRouteSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/api/vault/file/route.ts'), 'utf8');
  const vaultPageSrc = fs.readFileSync(path.join(process.cwd(), 'src/app/vault/page.tsx'), 'utf8');

  for (const [name, src] of [
    ['src/middleware.ts', middlewareSrc],
    ['next.config.js', nextCfgSrc],
    ['firebase.json', firebaseSrc],
  ]) {
    assert.match(src, /frame-src 'self' blob: https:\/\/\*\.supabase\.co/, `${name} must allow blob: and supabase in frame-src`);
    assert.match(src, /object-src 'self' blob: https:\/\/\*\.supabase\.co/, `${name} must allow blob: and supabase in object-src`);
  }

  assert.match(fileRouteSrc, /'Content-Length':\s*String\(fileBuffer\.byteLength\)/);
  assert.match(fileRouteSrc, /new NextResponse\(new Uint8Array\(fileBuffer\)/);
  assert.match(fileRouteSrc, /no-transform/);
  assert.match(vaultPageSrc, /mode=url/);
  assert.match(vaultPageSrc, /previewDoc\.signedUrl/);
  assert.match(vaultPageSrc, /<PdfCanvasViewer/);
  assert.doesNotMatch(vaultPageSrc, /<iframe[\s\S]*previewDoc\.blobUrl/);
  assert.doesNotMatch(vaultPageSrc, /href=\{previewDoc\.blobUrl\}[^>]*rel="noopener noreferrer"/);

  const pdfViewerSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/vault/PdfCanvasViewer.tsx'), 'utf8');
  assert.match(pdfViewerSrc, /\/pdfjs\/pdfjs\.mjs/);
  assert.match(pdfViewerSrc, /canvasContext/);
  assert.match(middlewareSrc, /\/pdfjs/);
  assert.ok(fs.existsSync(path.join(process.cwd(), 'scripts/utils/copy-pdfjs.cjs')));
});

test('Task 2 (5-6 Resume Questions + Tech Coding / B.Com Auto-Skip): classifier, turn count, coding evaluation, and Round2Coding reuse', async () => {
  // Tech resume -> 6 oral questions + coding required (Python)
  const techResume = {
    title: 'Vinay N — Full Stack Developer & AI Engineer Resume',
    itemType: 'resume',
    claimedSkills: ['Python', 'FastAPI', 'React.js', 'Next.js', 'PostgreSQL', 'MongoDB', 'Firebase'],
    projects: [
      { name: 'PinIT Careers', techStack: ['React', 'FastAPI', 'PostgreSQL'], claim: 'Built AI SaaS' },
      { name: 'DSAI Portal', techStack: ['Next.js', 'Firebase'], claim: 'Online exam portal' },
    ],
    summary: 'Full Stack & AI Engineer building SaaS platforms.',
  };
  assert.equal(isCodingResumeChallenge(techResume), true);
  assert.equal(inferPreferredCodingLanguage(techResume), 'python');
  assert.equal(resolveOralDefenseTurnCount(techResume), 6);

  // React/JS-only resume -> JavaScript coding language, 5 oral questions for compact doc
  const jsCompact = {
    title: 'Frontend Developer Certificate',
    itemType: 'certification',
    claimedSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    projects: [],
  };
  assert.equal(isCodingResumeChallenge(jsCompact), true);
  assert.equal(inferPreferredCodingLanguage(jsCompact), 'javascript');
  assert.equal(resolveOralDefenseTurnCount(jsCompact), 5);

  // B.Com / Commerce / Finance resume -> coding automatically SKIPPED!
  const bcomResume = {
    title: 'Kiran Verma — B.Com Accounting & Statutory Audit Resume',
    itemType: 'resume',
    claimedSkills: ['Tally Prime', 'GST Filing', 'IFRS', 'Financial Modeling', 'Statutory Audit', 'Corporate Finance'],
    projects: [
      { name: '3-Statement DCF Valuation Model', techStack: ['Financial Modeling', 'Excel'], claim: 'Built WACC model' },
    ],
    summary: 'B.Com graduate specializing in statutory audit, GST reconciliation, and corporate finance.',
  };
  assert.equal(isCodingResumeChallenge(bcomResume), false, 'B.Com / Commerce resume must skip coding round');
  assert.equal(resolveOralDefenseTurnCount(bcomResume), 6);

  // 6-turn evaluation with passed live coding check credits proven coding language even if oral failed
  const codingPartial = evaluateVaultDefenseResponses(
    techResume.claimedSkills,
    ['i dont know', 'idk', 'not sure', 'i dont know', 'idk', 'not sure'],
    {
      required: true,
      language: 'python',
      problemTitle: 'API Rate Limiter Counter',
      passedTests: 5,
      totalTests: 5,
      passed: true,
      skipped: false,
    }
  );
  assert.equal(codingPartial.passed, false);
  assert.ok(codingPartial.provenSkills?.includes('Python'), 'Passing Python coding test must credit Python');

  // Verify VaultDefenseRoom reuses existing Round2Coding, runTestSuite, and dynamic totalDefenseTurns
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
  assert.match(roomSrc, /import \{ Round2Coding \} from '\.\/Round2Coding'/);
  assert.match(roomSrc, /runTestSuite/);
  assert.match(roomSrc, /\/api\/interview\/generate-problem/);
  assert.match(roomSrc, /totalDefenseTurns:\s*turnsForDoc/);
  assert.match(chatSrc, /totalDefenseTurns/);
  assert.match(chatSrc, /BREADTH REQUIREMENT/);
});

test('Task 3 (/profile React Error #310): PortfolioTab declares all React hooks strictly before early if (loading) return', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const portfolioTabSrc = fs.readFileSync(
    path.join(process.cwd(), 'src/app/profile/tabs/PortfolioTab.tsx'),
    'utf8'
  );
  const loadingIdx = portfolioTabSrc.indexOf('if (loading)');
  assert.ok(loadingIdx > 0, 'PortfolioTab should keep loading guard');
  const afterLoading = portfolioTabSrc.slice(loadingIdx);
  assert.doesNotMatch(
    afterLoading,
    /\b(?:React\.)?(?:useState|useEffect|useMemo|useCallback|useRef)\s*\(/,
    'No React hook may be called after early `if (loading)` return (causes React Error #310)'
  );
});
