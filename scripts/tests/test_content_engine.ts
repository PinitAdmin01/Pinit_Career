// scripts/test_content_engine.ts
// Comprehensive Automated Behavioral Test Suite for PinIT Content Engine Infrastructure

import {
  curriculumRegistry,
  CurriculumValidator,
  CurriculumValidationError,
  contentRegistry,
  ContentValidator,
  ThreeDayPacketMeta,
  Day,
  PacketContentManifest,
  DayContentManifest,
  TheoryBlock,
  ExampleBlock,
  GuidedPracticeBlock,
  KnowledgeCheckBlock,
  GuidedLabBlock,
  IndependentPracticeBlock,
  DebuggingChallengeBlock,
  TransferChallengeBlock,
  MiniProjectBlock,
} from '../src/lib/curriculum/index';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}${detail ? ` - Detail: ${detail}` : ''}`);
    testsFailed++;
  }
}

function assertThrows(fn: () => void, expectedErrorCode: string, testName: string) {
  try {
    fn();
    console.error(`  ❌ [FAIL] ${testName} - Expected error code '${expectedErrorCode}' but no error was thrown.`);
    testsFailed++;
  } catch (err: any) {
    if (err instanceof CurriculumValidationError && err.code === expectedErrorCode) {
      console.log(`  ✅ [PASS] ${testName} (Caught expected code: ${expectedErrorCode})`);
      testsPassed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} - Expected code '${expectedErrorCode}', got '${err?.code || err?.message}'`);
      testsFailed++;
    }
  }
}

async function runContentEngineTestSuite() {
  console.log('\n===============================================================');
  console.log('📦 RUNNING PINIT BUILD 02: CONTENT ENGINE INFRASTRUCTURE TESTS');
  console.log('===============================================================\n');

  const dummyPacket: ThreeDayPacketMeta = {
    id: 'pkt-test-01',
    weekId: 'week-test-01',
    packetCode: 'P1-M1-W1-PKT001',
    title: 'Test Packet',
    description: 'Test',
    primaryCompetencyId: 'comp-pfs-001',
    difficulty: 'beginner',
    prerequisites: [],
    estimatedEffortHours: 6,
    status: 'PUBLISHED',
    order: 1,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // ── GROUP 1: Strict Exact 3-Day Invariants ({1, 2, 3}) ──
  console.log('── GROUP 1: Strict Exact 3-Day Invariants ({1, 2, 3}) ──');
  
  // 1.1: 0 days -> FAIL
  assertThrows(
    () => CurriculumValidator.validateDays(dummyPacket, []),
    'EMPTY_PACKET_DAYS',
    'Rejects packet with 0 days'
  );

  // 1.2: 1 day -> FAIL
  const oneDay: Day[] = [
    { id: 'd1', packetId: 'pkt-test-01', dayNumber: 1, title: 'D1', objectives: ['O1'], status: 'PUBLISHED' }
  ];
  assertThrows(
    () => CurriculumValidator.validateDays(dummyPacket, oneDay),
    'INSUFFICIENT_PACKET_DAYS',
    'Rejects packet with only 1 day'
  );

  // 1.3: 2 days [1, 2] -> FAIL
  const twoDays: Day[] = [
    { id: 'd1', packetId: 'pkt-test-01', dayNumber: 1, title: 'D1', objectives: ['O1'], status: 'PUBLISHED' },
    { id: 'd2', packetId: 'pkt-test-01', dayNumber: 2, title: 'D2', objectives: ['O2'], status: 'PUBLISHED' },
  ];
  assertThrows(
    () => CurriculumValidator.validateDays(dummyPacket, twoDays),
    'INSUFFICIENT_PACKET_DAYS',
    'Rejects packet with only 2 days [1, 2]'
  );

  // 1.4: 2 days [1, 3] -> FAIL
  const missingDay2: Day[] = [
    { id: 'd1', packetId: 'pkt-test-01', dayNumber: 1, title: 'D1', objectives: ['O1'], status: 'PUBLISHED' },
    { id: 'd3', packetId: 'pkt-test-01', dayNumber: 3, title: 'D3', objectives: ['O3'], status: 'PUBLISHED' },
  ];
  assertThrows(
    () => CurriculumValidator.validateDays(dummyPacket, missingDay2),
    'INSUFFICIENT_PACKET_DAYS',
    'Rejects packet missing Day 2 [1, 3]'
  );

  // 1.5: Duplicate Day numbers [1, 1, 2] -> FAIL
  const dupDayNum: Day[] = [
    { id: 'd1a', packetId: 'pkt-test-01', dayNumber: 1, title: 'D1a', objectives: ['O1'], status: 'PUBLISHED' },
    { id: 'd1b', packetId: 'pkt-test-01', dayNumber: 1, title: 'D1b', objectives: ['O1'], status: 'PUBLISHED' },
    { id: 'd2', packetId: 'pkt-test-01', dayNumber: 2, title: 'D2', objectives: ['O2'], status: 'PUBLISHED' },
  ];
  assertThrows(
    () => CurriculumValidator.validateDays(dummyPacket, dupDayNum),
    'DUPLICATE_DAY_NUMBER',
    'Rejects duplicate dayNumber [1, 1, 2]'
  );

  // 1.6: 4 days -> FAIL
  const fourDays: Day[] = [
    { id: 'd1', packetId: 'pkt-test-01', dayNumber: 1, title: 'D1', objectives: ['O1'], status: 'PUBLISHED' },
    { id: 'd2', packetId: 'pkt-test-01', dayNumber: 2, title: 'D2', objectives: ['O2'], status: 'PUBLISHED' },
    { id: 'd3', packetId: 'pkt-test-01', dayNumber: 3, title: 'D3', objectives: ['O3'], status: 'PUBLISHED' },
    { id: 'd4', packetId: 'pkt-test-01', dayNumber: 3, title: 'D4', objectives: ['O4'], status: 'PUBLISHED' },
  ];
  assertThrows(
    () => CurriculumValidator.validateDays(dummyPacket, fourDays),
    'EXCESS_PACKET_DAYS',
    'Rejects packet with 4 days'
  );

  // 1.7: Exactly {1, 2, 3} -> PASS
  const validThreeDays: Day[] = [
    { id: 'd1', packetId: 'pkt-test-01', dayNumber: 1, title: 'D1', objectives: ['O1'], status: 'PUBLISHED' },
    { id: 'd2', packetId: 'pkt-test-01', dayNumber: 2, title: 'D2', objectives: ['O2'], status: 'PUBLISHED' },
    { id: 'd3', packetId: 'pkt-test-01', dayNumber: 3, title: 'D3', objectives: ['O3'], status: 'PUBLISHED' },
  ];
  CurriculumValidator.validateDays(dummyPacket, validThreeDays);
  assert(true, 'Accepts standard packet with exact set {1, 2, 3}');

  // ── GROUP 2: Packet Code Hierarchy Validation ──
  console.log('\n── GROUP 2: Packet Code Hierarchy Validation ──');
  
  // Phase 1, Month 1, Week 1 with matching P1-M1-W1-PKT001 -> PASS
  CurriculumValidator.validatePacket(dummyPacket, { phaseNumber: 1, monthNumber: 1, weekNumber: 1 });
  assert(true, 'Packet code P1-M1-W1-PKT001 matches Phase 1, Month 1, Week 1 hierarchy');

  // Mismatched Phase: P1-M1-W1-PKT001 placed in Phase 2 -> FAIL
  assertThrows(
    () => CurriculumValidator.validatePacket(dummyPacket, { phaseNumber: 2, monthNumber: 1, weekNumber: 1 }),
    'PACKET_HIERARCHY_PHASE_MISMATCH',
    'Rejects P1-M1-W1-PKT001 placed in Phase 2 context'
  );

  // Mismatched Month: P1-M1-W1-PKT001 placed in Month 5 -> FAIL
  assertThrows(
    () => CurriculumValidator.validatePacket(dummyPacket, { phaseNumber: 1, monthNumber: 5, weekNumber: 1 }),
    'PACKET_HIERARCHY_MONTH_MISMATCH',
    'Rejects P1-M1-W1-PKT001 placed in Month 5 context'
  );

  // Mismatched Week: P1-M1-W1-PKT001 placed in Week 4 -> FAIL
  assertThrows(
    () => CurriculumValidator.validatePacket(dummyPacket, { phaseNumber: 1, monthNumber: 1, weekNumber: 4 }),
    'PACKET_HIERARCHY_WEEK_MISMATCH',
    'Rejects P1-M1-W1-PKT001 placed in Week 4 context'
  );

  // ── GROUP 3: Content Block Polymorphism & Validation ──
  console.log('\n── GROUP 3: Content Block Polymorphism & Validation ──');

  // 3.1: Theory Block
  const theoryBlk: TheoryBlock = {
    id: 'blk-01',
    type: 'THEORY',
    order: 1,
    title: 'How Code Executes on Hardware',
    estimatedMinutes: 20,
    status: 'PUBLISHED',
    version: '1.0.0',
    summary: 'Explains CPU fetch-decode-execute cycle and Python virtual machine.',
    whatItIs: 'An execution pipeline converting text to bytecode.',
    whyItExists: 'Hardware only understands binary opcodes.',
    problemSolved: 'Human-readable abstraction over CPU architecture.',
    mentalModel: 'A chef (CPU) reading a recipe book (bytecode).',
    commonMistakes: ['Thinking Python compiles to direct x86 assembly.'],
    commonMisconceptions: ['Python is slow because it is interpreted line-by-line in real time.'],
  };
  ContentValidator.validateBlock(theoryBlk);
  assert(true, 'Validated complete TheoryBlock');

  // Incomplete Theory Block (Missing summary) -> FAIL
  const badTheoryBlk: TheoryBlock = { ...theoryBlk, summary: '' };
  assertThrows(() => ContentValidator.validateBlock(badTheoryBlk), 'INCOMPLETE_THEORY_BLOCK', 'Rejects TheoryBlock without summary');

  // 3.2: Knowledge Check Block (Diagnostic check)
  const kcBlk: KnowledgeCheckBlock = {
    id: 'blk-02',
    type: 'KNOWLEDGE_CHECK',
    order: 2,
    title: 'Diagnostic: Bytecode vs Machine Code',
    estimatedMinutes: 10,
    status: 'PUBLISHED',
    version: '1.0.0',
    diagnosticQuestion: 'What does the CPython compiler produce before execution?',
    options: ['x86 Machine Code', '.pyc Bytecode', 'LLVM IR', 'Direct RAM Voltage'],
    correctIndex: 1,
    explanation: 'CPython compiles source code into .pyc bytecode, which is executed by the PVM.',
    misconceptionIdentified: 'Confusing JIT/AOT machine compilation with bytecode interpretation.',
  };
  ContentValidator.validateBlock(kcBlk);
  assert(true, 'Validated KnowledgeCheckBlock with diagnostic misconception tagging');

  // Knowledge Check with Out of Bounds correctIndex -> FAIL
  const badKcBlk: KnowledgeCheckBlock = { ...kcBlk, correctIndex: 5 };
  assertThrows(() => ContentValidator.validateBlock(badKcBlk), 'INVALID_KNOWLEDGE_CHECK_CORRECT_INDEX', 'Rejects KnowledgeCheckBlock with invalid correctIndex');

  // 3.3: Debugging Challenge Block
  const debugBlk: DebuggingChallengeBlock = {
    id: 'blk-03',
    type: 'DEBUGGING_CHALLENGE',
    order: 3,
    title: 'Debug: Path Separator Escaping Failure',
    estimatedMinutes: 25,
    status: 'PUBLISHED',
    version: '1.0.0',
    problemDescription: 'Script crashes when loading config from Windows subfolder.',
    symptom: 'SyntaxError: (unicode error) unicodeescape codec cant decode bytes.',
    brokenArtifact: 'path = "C:\\test\\new_project\\data.txt"',
    expectedBehavior: 'Path is loaded using raw strings or pathlib.Path without unicode escape crashes.',
    difficulty: 'BEGINNER',
    hints: ['Use raw string r"..." or forward slashes.'],
    targetCompetencyId: 'comp-pfs-001',
    assessmentRef: 'asm-dbg-p1-001',
  };
  ContentValidator.validateBlock(debugBlk);
  assert(true, 'Validated DebuggingChallengeBlock with external assessment reference');

  // 3.4: Transfer Challenge Block
  const transferBlk: TransferChallengeBlock = {
    id: 'blk-04',
    type: 'TRANSFER_CHALLENGE',
    order: 1,
    title: 'Transfer: Industrial Sensor Telemetry Parser',
    estimatedMinutes: 45,
    status: 'PUBLISHED',
    version: '1.0.0',
    unfamiliarDomainContext: 'Subsea oil rig acoustic pressure telemetry logs.',
    task: 'Parse raw text stream and extract high-pressure anomaly rows without third-party libraries.',
    constraints: ['Standard library only', 'Handle truncated trailing lines gracefully'],
    difficulty: 'INTERMEDIATE',
    timeExpectationMinutes: 45,
    targetCompetencyId: 'comp-pfs-001',
    assessmentRef: 'asm-trf-p1-001',
  };
  ContentValidator.validateBlock(transferBlk);
  assert(true, 'Validated TransferChallengeBlock in unfamiliar domain context');

  // ── GROUP 4: Day Content Manifest & Pedagogical Intent ──
  console.log('\n── GROUP 4: Day Content Manifest & Pedagogical Intent ──');

  const validDay1Manifest: DayContentManifest = {
    packetId: 'pkt-test-01',
    dayNumber: 1,
    title: 'Day 1: Understand Program Execution',
    pedagogicalIntent: 'UNDERSTAND',
    blocks: [theoryBlk, kcBlk],
    version: '1.0.0',
    status: 'PUBLISHED',
  };
  ContentValidator.validateDayManifest(validDay1Manifest);
  assert(true, 'Validated Day 1 manifest with UNDERSTAND intent');

  // Day 1 with Wrong Pedagogical Intent (e.g. TRANSFER) -> FAIL
  const badDay1Intent: DayContentManifest = {
    ...validDay1Manifest,
    pedagogicalIntent: 'TRANSFER',
  };
  assertThrows(
    () => ContentValidator.validateDayManifest(badDay1Intent),
    'DAY_INTENT_MISMATCH',
    'Rejects Day 1 with TRANSFER pedagogical intent (must be UNDERSTAND)'
  );

  // Day with Duplicate Block Order -> FAIL
  const badDayBlockOrder: DayContentManifest = {
    ...validDay1Manifest,
    blocks: [
      { ...theoryBlk, id: 'blk-01', order: 1 },
      { ...kcBlk, id: 'blk-02', order: 1 },
    ],
  };
  assertThrows(
    () => ContentValidator.validateDayManifest(badDayBlockOrder),
    'DUPLICATE_BLOCK_ORDER',
    'Rejects Day manifest with duplicate block orders'
  );

  // ── GROUP 5: Packet Content Manifest & Registry Visibility ──
  console.log('\n── GROUP 5: Packet Content Manifest & Registry Visibility ──');

  const validDay2Manifest: DayContentManifest = {
    packetId: 'pkt-test-01',
    dayNumber: 2,
    title: 'Day 2: Build & Debug CLI Tools',
    pedagogicalIntent: 'BUILD',
    blocks: [debugBlk],
    version: '1.0.0',
    status: 'PUBLISHED',
  };

  const validDay3Manifest: DayContentManifest = {
    packetId: 'pkt-test-01',
    dayNumber: 3,
    title: 'Day 3: Transfer & Independent Assessment',
    pedagogicalIntent: 'TRANSFER',
    blocks: [transferBlk],
    version: '1.0.0',
    status: 'PUBLISHED',
  };

  const packetManifest: PacketContentManifest = {
    packetId: 'pkt-test-01',
    packetCode: 'P1-M1-W1-PKT001',
    title: 'Program Execution & Developer Environment Setup',
    difficulty: 'BEGINNER',
    days: [validDay1Manifest, validDay2Manifest, validDay3Manifest],
    version: '1.0.0',
    status: 'PUBLISHED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  contentRegistry.registerPacketContent(packetManifest);
  assert(!!contentRegistry.getPacketContent('pkt-test-01'), 'Registered and retrieved PacketContentManifest');
  assert(contentRegistry.getDayContent('pkt-test-01', 1)?.blocks.length === 2, 'Day 1 returns 2 content blocks');
  assert(contentRegistry.getDayContent('pkt-test-01', 2)?.blocks[0].type === 'DEBUGGING_CHALLENGE', 'Day 2 returns DebuggingChallenge block');
  assert(contentRegistry.getDayContent('pkt-test-01', 3)?.blocks[0].type === 'TRANSFER_CHALLENGE', 'Day 3 returns TransferChallenge block');

  // Draft Visibility Rules Test
  const draftManifest: PacketContentManifest = {
    ...packetManifest,
    packetId: 'pkt-draft-01',
    packetCode: 'P1-M1-W1-PKT002',
    status: 'DRAFT',
    days: [
      { ...validDay1Manifest, packetId: 'pkt-draft-01' },
      { ...validDay2Manifest, packetId: 'pkt-draft-01' },
      { ...validDay3Manifest, packetId: 'pkt-draft-01' },
    ],
  };
  contentRegistry.registerPacketContent(draftManifest);

  // Hidden by default
  assert(contentRegistry.getPacketContent('pkt-draft-01') === undefined, 'DRAFT packet content is hidden by default from learners');
  // Visible when allowDraft: true
  assert(contentRegistry.getPacketContent('pkt-draft-01', { allowDraft: true })?.packetId === 'pkt-draft-01', 'DRAFT packet content is visible with allowDraft option');

  console.log('\n===============================================================');
  console.log(`🏁 TEST SUITE FINISHED: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('===============================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runContentEngineTestSuite().catch((err) => {
  console.error('[FATAL ERROR IN TEST RUNNER]', err);
  process.exit(1);
});
