import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { validateVmCodeSecurity } from '../src/lib/server/codeWarsSandbox';
import { compileTs } from '../src/lib/code/ts/compileTs';
import { executePythonSuite } from '../src/lib/code/runners/pythonRunner';
import { JAVA_BASICS_LONG_LESSONS } from '../src/lib/data/javaBasicsLongLessons';
import { LessonContentRenderer } from '../src/app/quests/lesson/components/LessonContentRenderer';
import { getAuthoritativeQuest } from '../src/lib/quests/questRegistry';
import { NODE_WEB_30_DAYS_QUESTS } from '../src/lib/data/nodeWeb30DayData';
import { executeTypeScriptTask } from '../src/lib/code/runners/webTaskRunner';
import { GET as getPinBalanceRoute } from '../src/app/api/pins/balance/route';
import { POST as postQuestsVerifyRoute } from '../src/app/api/quests/verify/route';
import { verifyQuestSubmissionServerSide } from '../src/lib/server/questServerVerifier';
import { setSupabaseAdminForTests } from '../src/lib/server/supabaseAdmin';
import { generateRapidFireBattle } from '../src/lib/puzzles/lessonPuzzleEngine';
import { getVisual, loadDayFile } from '../src/lib/visuals/loadVisuals';
import { refillVisualFromTrace } from '../src/app/quests/lesson/hooks/useLessonEngine';
import type { LessonVisual } from '../src/lib/types/lessonVisual';
import { COURSES_CATALOG, COURSE_FIRST_QUEST_ID } from '../src/lib/data/coursesCatalog';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';
import { parseQuestId } from '../src/lib/data/curriculumEnricher';
import { recommendCareerTrajectory } from '../src/lib/data/careerTrajectories';
import { COURSE_TO_ROLE } from '../src/app/quests/components/useQuestProgression';

test('codeWarsSandbox allows blocked identifiers in comments/strings while blocking template ${...} & bracket escapes', () => {
  const safeCode = [
    '// Do not use process, global, fs, child_process, or require in solutions',
    '/* import os; Deno.exit(); eval("nope"); */',
    'function solve(x) {',
    '  const label = "process global fs import require constructor";',
    '  return label + ":" + x;',
    '}',
  ].join('\n');

  const safeResult = validateVmCodeSecurity(safeCode);
  assert.equal(safeResult.safe, true, `Expected safe code to pass, got reason=${safeResult.reason}`);

  const tplEscape = 'function solve(x) { const s = `ok ${process.exit()}`; return s + x; }';
  const tplResult = validateVmCodeSecurity(tplEscape);
  assert.equal(tplResult.safe, false, 'Template literal interpolation referencing process must be blocked');

  const bracketEscape = "function solve(x) { return x['constructor']('return 1')(); }";
  const bracketResult = validateVmCodeSecurity(bracketEscape);
  assert.equal(bracketResult.safe, false, 'Computed bracket constructor access must be blocked');
});

test('java-basics TS-annotated snippets compile cleanly via compileTs despite Solution.java UI label', async () => {
  const d1 = JAVA_BASICS_LONG_LESSONS[1];
  assert.ok(d1, 'Expected JAVA_BASICS_LONG_LESSONS[1] to exist');
  const tsParts = d1.parts.filter((p) => !/\bpublic\s+class\b/.test(p.code));
  assert.ok(tsParts.length >= 1, 'Expected TS simulator snippet in Day 1');

  for (const part of tsParts) {
    const compiled = await compileTs(part.code);
    assert.equal(compiled.ok, true, `Expected compileTs to succeed for "${part.title}": ${compiled.ok ? '' : compiled.message}`);
  }
});

test('LessonContentRenderer normalizes string and partial codeNotes without rendering "Line undefined:"', () => {
  const html = ReactDOMServer.renderToStaticMarkup(
    React.createElement(LessonContentRenderer, {
      userId: 'u1',
      teacherId: 'kashyap',
      teacher: { name: 'Kashyap', avatar: '👨‍🏫', accent: '#10b981' },
      questId: 'python-d1-q1',
      questData: { title: 'Python Day 1', desc: 'Notes test' },
      currentSlide: 1,
      slides: [
        {
          title: 'Memory & Mutability',
          explain: ['Objects live on the heap.'],
          example: 'Rebinding names updates references.',
          codeExample: 'x = [1, 2]\ny = x',
          codeNotes: [
            'Strings should render cleanly without Line undefined.',
            { line: 2, text: 'Fallback text property also renders cleanly.' },
          ] as unknown as Array<{ line: number; note: string }>,
          tryIt: 'Append an item to y.',
          mcq: {
            question: 'What does y = x do?',
            options: ['Binds alias', 'Deep copies'],
            answerIndex: 0,
            explanation: 'Names bind to objects.',
          },
        },
      ],
      slidesLoading: false,
      syllabus: ['Part 1'],
      isPlaying: false,
      setIsPlaying: () => {},
      latestAIResponse: '',
      getSpeakerText: () => '',
      isInteractive: false,
      setIsInteractive: () => {},
      chatMessages: [],
      setChatMessages: () => {},
      chatLoading: false,
      chatInput: '',
      setChatInput: () => {},
      chatBottomRef: { current: null },
      isRecording: false,
      startVoiceInput: () => {},
      sendInteractiveMessage: async () => {},
      understandingConfirmed: {},
      setUnderstandingConfirmed: () => {},
      handleNextSlide: () => {},
      codeRunning: {},
      codeOutputs: {},
      simulateCodeRun: () => {},
      isLastSlide: false,
      examPassed: false,
      examFailed: false,
      setExamFailed: () => {},
      examCorrectCount: 0,
      setExamCorrectCount: () => {},
      setExamAnswers: () => {},
      onReviewLesson: () => {},
      examQuestionIndex: 0,
      setExamQuestionIndex: () => {},
      selectedMcqAnswer: null,
      setSelectedMcqAnswer: () => {},
      mcqChecked: false,
      setMcqChecked: () => {},
      mcqIsCorrect: false,
      setMcqIsCorrect: () => {},
      setExamPassed: () => {},
      playChime: () => {},
      launchConfetti: () => {},
    } as never)
  );

  assert.ok(html.includes('Strings should render cleanly without Line undefined.'));
  assert.ok(html.includes('Fallback text property also renders cleanly.'));
  assert.equal(html.includes('Line undefined:'), false, 'Rendered HTML must never include "Line undefined:"');
});

test('pythonRunner resolves system Python dynamically without hardcoded home paths', async () => {
  const result = await executePythonSuite({
    code: 'def add(a, b):\n    return a + b\n',
    testSuite: 'assert add(2, 3) == 5',
  });
  const combined = `${result.error || ''} ${(result.terminalLogs || []).join(' ')}`;
  assert.equal(combined.includes('vinay'), false, 'Must never reference hardcoded user home Python path');
  if (result.status !== 'RUNTIME_ERROR') {
    assert.equal(result.allPassed, true, `Expected Python suite to pass, got: ${combined}`);
  }
});

test('standalone Java quests in QUESTS_REGISTRY use Java language and valid Test.java harnesses', () => {
  for (const id of ['fizzbuzz', 'reverser', 'arraysum', 'palindrome', 'findmax']) {
    const q = getAuthoritativeQuest(id);
    assert.ok(q, `Expected quest "${id}" to exist`);
    assert.equal(q.language, 'java', `Quest "${id}" must explicitly declare language: "java"`);
    assert.ok(q.testSuite?.includes('public class Test'), `Quest "${id}" testSuite must declare Java public class Test`);
    assert.equal(q.testSuite?.includes('typeof '), false, `Quest "${id}" must not contain JS typeof assertions`);
    assert.equal(q.testSuite?.includes('==='), false, `Quest "${id}" must not contain JS === assertions`);
  }
});

test('node-web Month 2 Days 32, 36, 56, 59 fail on starters & constant return 0 while passing reference hints', async () => {
  const fnByDay: Record<number, string> = {
    32: 'computeKafkaPartition',
    36: 'calculateRedisSlot',
    56: 'calculateKafkaPartition',
    59: 'computeRedisClusterSlot',
  };

  for (const [dayStr, fnName] of Object.entries(fnByDay)) {
    const target = NODE_WEB_30_DAYS_QUESTS.find(
      (q) => q.id === `node-web-exam-day-${dayStr}` && q.testSuite?.includes(fnName)
    );
    assert.ok(target && target.starterCode && target.testSuite && target.hint, `Missing quest/hint for node-web day ${dayStr}`);

    const starterRes = await executeTypeScriptTask(target.starterCode, target.testSuite, 3000, 'typescript');
    assert.equal(starterRes.allPassed, false, `Unmodified starter for node-web day ${dayStr} must fail`);

    const constZeroCode = target.starterCode.replace(/throw new Error\([^)]+\);/, 'return 0;');
    const zeroRes = await executeTypeScriptTask(constZeroCode, target.testSuite, 3000, 'typescript');
    assert.equal(zeroRes.allPassed, false, `Constant "return 0;" for node-web day ${dayStr} must fail`);

    const solCode = target.starterCode.replace(/throw new Error\([^)]+\);/, target.hint);
    const solRes = await executeTypeScriptTask(solCode, target.testSuite, 3000, 'typescript');
    assert.equal(solRes.allPassed, true, `Reference hint for node-web day ${dayStr} failed: ${solRes.error || solRes.terminalLogs.join(' | ')}`);
  }
});

test('GET /api/pins/balance authenticates user and returns aggregated pins + transactions', async () => {
  const unauthRes = await getPinBalanceRoute(new Request('http://localhost/api/pins/balance'));
  assert.equal(unauthRes.status, 401);

  const prevBypass = process.env.ALLOW_DEV_AUTH_BYPASS;
  const prevNodeEnv = process.env.NODE_ENV;
  process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
  (process.env as Record<string, string | undefined>).NODE_ENV = 'test';

  setSupabaseAdminForTests({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: {
              pins: 45,
              bonus_pins: 15,
              pin_history: [{ id: 'tx_1', amount: 15, reason: 'streak' }],
              unlocked_items: ['theme_dark'],
            },
            error: null,
          }),
        }),
      }),
    }),
  });

  try {
    const req = new Request('http://localhost/api/pins/balance', {
      headers: { Authorization: 'Bearer test-token-user123' },
    });
    const res = await getPinBalanceRoute(req);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.equal(body.pins, 60);
    assert.equal(body.dailyPins, 45);
    assert.equal(body.bonusPins, 15);
    assert.equal(body.transactions.length, 1);
  } finally {
    setSupabaseAdminForTests(null);
    process.env.ALLOW_DEV_AUTH_BYPASS = prevBypass;
    (process.env as Record<string, string | undefined>).NODE_ENV = prevNodeEnv;
  }
});

test('POST /api/quests/verify and server verifier reject unmodified starter / wrong answers and pass valid code', async () => {
  const wrongOutcome = await verifyQuestSubmissionServerSide(
    {
      id: 'node-web-exam-day-32',
      language: 'typescript',
      starterCode: "function computeKafkaPartition(key: string, n: number) {\n  throw new Error('TODO');\n}",
      testSuite: "if (computeKafkaPartition('a', 4) === computeKafkaPartition('b', 4)) throw new Error('bad');",
    },
    'function computeKafkaPartition(key: string, n: number) { return 0; }'
  );
  assert.equal(wrongOutcome.ok, false, 'Constant wrong TS answer must be rejected server-side');
  assert.equal(wrongOutcome.status, 422);

  const pyWrongOutcome = await verifyQuestSubmissionServerSide(
    {
      id: 'py-test-1',
      language: 'python',
      starterCode: 'def add(a, b):\n    return 0\n',
      testSuite: 'assert add(2, 3) == 5',
    },
    'def add(a, b):\n    return a - b\n'
  );
  if (pyWrongOutcome.verificationMode === 'server-python-sandbox') {
    assert.equal(pyWrongOutcome.ok, false, 'Wrong Python implementation must fail assertion checks');
    assert.equal(pyWrongOutcome.status, 422);
  }

  const prevBypass = process.env.ALLOW_DEV_AUTH_BYPASS;
  const prevNodeEnv = process.env.NODE_ENV;
  process.env.ALLOW_DEV_AUTH_BYPASS = 'true';
  (process.env as Record<string, string | undefined>).NODE_ENV = 'test';

  try {
    const starterQuest = NODE_WEB_30_DAYS_QUESTS.find((q) => q.id === 'node-web-exam-day-32');
    assert.ok(starterQuest && starterQuest.starterCode && starterQuest.hint);

    // 1. Unmodified starter submitted to POST /api/quests/verify must be rejected (400)
    const starterRes = await postQuestsVerifyRoute(
      new Request('http://localhost/api/quests/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token-user123',
        },
        body: JSON.stringify({
          questId: 'node-web-exam-day-32',
          code: starterQuest.starterCode,
        }),
      })
    );
    assert.equal(starterRes.status, 400);
    const starterBody = await starterRes.json();
    assert.equal(starterBody.success, false);
    assert.equal(starterBody.error, 'STARTER_CODE_UNCHANGED');

    // 2. Wrong constant solution submitted to POST /api/quests/verify must be rejected (422)
    const fakeRes = await postQuestsVerifyRoute(
      new Request('http://localhost/api/quests/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token-user123',
        },
        body: JSON.stringify({
          questId: 'node-web-exam-day-32',
          code: 'function computeKafkaPartition(key, numPartitions) { return 0; }',
        }),
      })
    );
    assert.equal(fakeRes.status, 422);
    const fakeBody = await fakeRes.json();
    assert.equal(fakeBody.success, false);

    // 3. Valid solution submitted to POST /api/quests/verify passes real judge (200)
    const validCode = starterQuest.starterCode.replace(/throw new Error\([^)]+\);/, starterQuest.hint);
    const validRes = await postQuestsVerifyRoute(
      new Request('http://localhost/api/quests/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token-user123',
        },
        body: JSON.stringify({
          questId: 'node-web-exam-day-32',
          code: validCode,
        }),
      })
    );
    assert.equal(validRes.status, 200);
    const validBody = await validRes.json();
    assert.equal(validBody.success, true);
    assert.equal(validBody.verificationMode, 'server-typescript-sandbox');
  } finally {
    process.env.ALLOW_DEV_AUTH_BYPASS = prevBypass;
    (process.env as Record<string, string | undefined>).NODE_ENV = prevNodeEnv;
  }
});

test('generateRapidFireBattle shuffles options deterministically so index 0 is not trivially always correct', () => {
  const synthLesson = {
    title: 'FastAPI Pydantic Verification',
    parts: Array.from({ length: 5 }, (_, idx) => ({
      title: `Part ${idx + 1}`,
      check: {
        question: `What enforces constraint ${idx + 1}?`,
        options: [`Correct answer ${idx + 1}`, 'Distractor B', 'Distractor C', 'Distractor D'],
        answer: 0,
        why: 'Explicit schema validation.',
      },
    })),
  };

  const partIndices = new Set<number>();
  for (let d = 1; d <= 10; d++) {
    const spec = generateRapidFireBattle(`python-lecture1-day-${d}`, 'python', d, synthLesson);
    assert.equal(spec.questions.length, 5);
    spec.questions.forEach((q, idx) => {
      partIndices.add(q.correctIndex);
      assert.equal(q.options[q.correctIndex], `Correct answer ${idx + 1}`);
    });
  }
  assert.ok(partIndices.size >= 3, `Expected shuffled part answers across indices, saw only ${[...partIndices].join(',')}`);

  const fallbackIndices = new Set<number>();
  for (let d = 1; d <= 10; d++) {
    const fallbackBattle = generateRapidFireBattle(`bcom_acc-lecture1-day-${d}`, 'bcom_acc', d, { title: 'Ledger', parts: [] });
    assert.equal(fallbackBattle.questions.length, 5);
    for (const q of fallbackBattle.questions) {
      fallbackIndices.add(q.correctIndex);
    }
  }
  assert.ok(fallbackIndices.size >= 3, `Expected shuffled fallback reflex answers, saw only ${[...fallbackIndices].join(',')}`);
});

test('refillVisualFromTrace handles mixed static conceptual boxes (D5P1, D10P1) without false fallback while guarding renamed var boxes', () => {
  const d5File = loadDayFile('python', 5);
  const d5Entry = d5File?.entries?.[0];
  const d5Default = getVisual('python', 5, 0) as LessonVisual | null;
  assert.ok(d5Entry && d5Default, 'Expected Python Day 5 Part 1 visual');

  const d5Good = refillVisualFromTrace(d5Entry.spec, d5Default, [[1, 0, { balance: 250 }]], '');
  assert.equal(d5Good.fallbackNote, null, 'Conceptual box "condition" must not trigger false trace fallback');
  assert.equal((d5Good.visual.steps[0] as { values: Record<string, string> }).values.balance, '250');

  const d5Renamed = refillVisualFromTrace(d5Entry.spec, d5Default, [[1, 0, { my_wallet: 250 }]], '');
  assert.ok(d5Renamed.fallbackNote, 'Renaming real variable "balance" must still show fallback note');

  const d10File = loadDayFile('python', 10);
  const d10Entry = d10File?.entries?.[0];
  const d10Default = getVisual('python', 10, 0) as LessonVisual | null;
  assert.ok(d10Entry && d10Default, 'Expected Python Day 10 Part 1 visual');

  const d10Good = refillVisualFromTrace(
    d10Entry.spec,
    d10Default,
    [[1, 0, { expense: { item: 'Tea', amount: 20 } }]],
    ''
  );
  assert.equal(d10Good.fallbackNote, null, 'Dictionary key illustrative boxes in D10P1 must not throw missing-var fallback');
});

// [FIX-STAGE: option-a-live-browser-fixes] Verify Month 2 conceptual boxes preserve filled values on Run + Bento Day 1 links + Python trajectory alignment
test('Month 2 conceptual boxes preserve rich filled values on trace refill & Bento/Trajectory map course-python-backend cleanly', () => {
  const d60File = loadDayFile('python', 60);
  const d60Entry = d60File?.entries?.[0];
  const d60Default = getVisual('python', 60, 0) as LessonVisual | null;
  assert.ok(d60Entry && d60Default, 'Expected Python Day 60 Part 0 visual');

  const d60AfterRun = refillVisualFromTrace(
    d60Entry.spec,
    d60Default,
    [[1, 0, { domains: 8, c: 'loop_val' }]],
    'PlatformCharter OK'
  );
  assert.equal(d60AfterRun.fallbackNote, null, 'Conceptual Day 60 boxes must not emit trace fallback warning');
  const tryItStep = d60AfterRun.visual.steps[3] as { values: Record<string, string> };
  assert.equal(tryItStep.values.d1, '12 Curriculum Stages Mapped');
  assert.equal(tryItStep.values.v, 'status = APPROVED');
  assert.equal(tryItStep.values.c, 'Month 1 + 2 -> ApexPython');

  for (const cat of COURSES_CATALOG) {
    const qid = COURSE_FIRST_QUEST_ID[cat.id];
    assert.ok(qid, `COURSE_FIRST_QUEST_ID missing entry for ${cat.id}`);
    assert.ok(parseQuestId(qid), `COURSE_FIRST_QUEST_ID[${cat.id}]=${qid} must parse cleanly via parseQuestId`);
    const regCourse = COURSES_REGISTRY.find((c) => c.id === cat.id);
    assert.ok(regCourse, `Course ${cat.id} missing from COURSES_REGISTRY`);
    assert.ok(regCourse.quests.some((q) => q.id === qid), `First quest ${qid} not found inside ${cat.id}`);
  }

  const pyRole = COURSE_TO_ROLE['course-python-backend'];
  assert.equal(pyRole, 'Python Software Engineer (Basic to Advance)');
  assert.equal(recommendCareerTrajectory(pyRole).roleId, 'python-basic-to-advance');
});
