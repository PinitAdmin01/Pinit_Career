// scripts/test_curriculum_infrastructure.ts
// Comprehensive Automated Behavioral Test Suite for PinIT Curriculum & Competency Infrastructure

import {
  curriculumRegistry,
  CurriculumValidator,
  CurriculumValidationError,
  PYTHON_FULLSTACK_COURSE,
  PYTHON_FULLSTACK_PHASES,
  PYTHON_FULLSTACK_MONTHS,
  Course,
  Phase,
  Month,
  Week,
  ThreeDayPacketMeta,
  Day,
  Competency,
} from '../src/lib/curriculum/index';
import { COURSES_REGISTRY } from '../src/lib/data/coursesData';

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

async function runTestSuite() {
  console.log('\n===============================================================');
  console.log('🏛️ RUNNING PINIT BUILD 01: CURRICULUM INFRASTRUCTURE TEST SUITE');
  console.log('===============================================================\n');

  // ── GROUP 1: Core Course & Phase Spine Integrity ──
  console.log('── GROUP 1: Course & Phase Spine Integrity ──');
  const registeredCourse = curriculumRegistry.getCourse('course-python-fullstack');
  assert(!!registeredCourse, 'Python Full Stack Course is registered in curriculumRegistry');
  assert(registeredCourse?.durationMonths === 24, 'Course duration is strictly 24 months (Dual-Exit: 12M Cert + 24M Advanced)');
  assert(registeredCourse?.title === 'PinIT Python Full-Stack Software Engineering', 'Course title is exact');

  const phases = curriculumRegistry.getPhasesForCourse('course-python-fullstack');
  assert(phases.length === 8, `Phases count is exactly 8 (Found: ${phases.length})`);
  assert(phases[0].phaseNumber === 1 && phases[7].phaseNumber === 8, 'Phases are ordered from 1 to 8');
  assert(phases[0].title === 'Computing & Python Foundations', 'Phase 1 title matches frozen curriculum spine');
  assert(phases[7].title === 'System Design, Applied AI, Specialization & Major Capstone', 'Phase 8 title matches spine');

  // ── GROUP 2: Phase Validation Invariants ──
  console.log('\n── GROUP 2: Phase Validation Invariants ──');
  const dummyCourse: Course = {
    id: 'test-course-01',
    slug: 'test-course',
    title: 'Test Course',
    description: 'Test',
    durationMonths: 12,
    status: 'DRAFT',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const duplicatePhases: Phase[] = [
    { id: 'p1', courseId: 'test-course-01', phaseNumber: 1, title: 'P1', description: 'D1', startMonth: 1, endMonth: 3, order: 1, status: 'DRAFT' },
    { id: 'p2', courseId: 'test-course-01', phaseNumber: 1, title: 'P1-dup', description: 'D2', startMonth: 4, endMonth: 6, order: 2, status: 'DRAFT' },
  ];
  assertThrows(
    () => CurriculumValidator.validatePhases(dummyCourse, duplicatePhases),
    'DUPLICATE_PHASE_NUMBER',
    'Rejects duplicate phaseNumber within the same course'
  );

  const invalidMonthSpanPhases: Phase[] = [
    { id: 'p1', courseId: 'test-course-01', phaseNumber: 1, title: 'P1', description: 'D1', startMonth: 6, endMonth: 3, order: 1, status: 'DRAFT' },
  ];
  assertThrows(
    () => CurriculumValidator.validatePhases(dummyCourse, invalidMonthSpanPhases),
    'INVALID_PHASE_MONTH_SPAN',
    'Rejects startMonth greater than endMonth'
  );

  // ── GROUP 3: Month & Phase Relationship Invariants ──
  console.log('\n── GROUP 3: Month & Phase Relationships ──');
  const months = PYTHON_FULLSTACK_MONTHS;
  assert(months.length === 24, `Month count is exactly 24 (Found: ${months.length})`);
  assert(months[0].monthNumber === 1 && months[23].monthNumber === 24, 'Months are numbered sequentially 1 to 24');

  // Verify Phase 1 contains months 1, 2, 3
  const p1Months = curriculumRegistry.getMonthsForPhase('phase-pfs-01');
  assert(p1Months.length === 3, 'Phase 1 contains exactly 3 months');
  assert(p1Months[0].monthNumber === 1 && p1Months[2].monthNumber === 3, 'Phase 1 contains Month 1, 2, and 3');

  const orphanMonths: Month[] = [
    { id: 'm1', phaseId: 'non-existent-phase', monthNumber: 1, title: 'M1', description: 'D', order: 1, status: 'DRAFT' }
  ];
  assertThrows(
    () => CurriculumValidator.validateMonths(PYTHON_FULLSTACK_PHASES, orphanMonths),
    'ORPHAN_MONTH',
    'Rejects Month that references a non-existent phaseId'
  );

  // ── GROUP 4: Week & ThreeDayPacket Hierarchy ──
  console.log('\n── GROUP 4: Week & ThreeDayPacket Hierarchy ──');
  const sampleWeek: Week = {
    id: 'week-pfs-m1-w1',
    monthId: 'month-pfs-01',
    weekNumber: 1,
    title: 'Program Execution & Developer Environment',
    description: 'First educational week of Python foundations',
    order: 1,
    status: 'PUBLISHED',
  };
  curriculumRegistry.registerWeek(sampleWeek);
  assert(curriculumRegistry.getWeeksForMonth('month-pfs-01').length === 1, 'Registered sample Week 1 under Month 1');

  // ── GROUP 5: Competency Model & Cycle Detection ──
  console.log('\n── GROUP 5: Competency Model & Cycle Detection ──');
  const comp1: Competency = {
    id: 'comp-pfs-001',
    code: 'COMP-P1-001',
    name: 'Program Execution & Environment Setup',
    description: 'Understand how interpreters execute instructions and manage CLI scripts.',
    category: 'foundations',
    levelDefinitions: {
      developingCriteria: 'Can run a python script when guided.',
      demonstratedCriteria: 'Can independently navigate CLI, configure virtualenvs, and execute scripts with arguments.',
      proficientCriteria: 'Can diagnose path resolution, PYTHONPATH conflicts, and OS execution errors.',
      masteredCriteria: 'Can author cross-platform CLI toolchains and environment bootstrap automation.',
    },
    prerequisites: [],
    status: 'PUBLISHED',
    version: '1.0.0',
  };

  const comp2: Competency = {
    id: 'comp-pfs-002',
    code: 'COMP-P1-002',
    name: 'Python Variables & Dynamic Memory Model',
    description: 'Understand variable bindings, references, and primitive data types in Python memory.',
    category: 'programming',
    levelDefinitions: {
      developingCriteria: 'Can declare primitive variables and print values.',
      demonstratedCriteria: 'Can manipulate mutable vs immutable types correctly without accidental aliasing bugs.',
      proficientCriteria: 'Can trace memory addresses with id() and explain shallow vs deep copy mechanics.',
      masteredCriteria: 'Can optimize memory footprint using sys.getsizeof() and __slots__ in performance critical code.',
    },
    prerequisites: ['comp-pfs-001'],
    status: 'PUBLISHED',
    version: '1.0.0',
  };

  curriculumRegistry.registerCompetency(comp1);
  curriculumRegistry.registerCompetency(comp2);
  assert(curriculumRegistry.getAllCompetencies().length === 2, 'Registered 2 valid hierarchical competencies');

  // Test Circular Prerequisite Rejection: A -> B -> C -> A
  const circularA: Competency = {
    id: 'comp-circ-a', code: 'COMP-CIRC-001', name: 'A', description: 'A', category: 'foundations',
    levelDefinitions: { developingCriteria: 'd', demonstratedCriteria: 'd', proficientCriteria: 'p', masteredCriteria: 'm' },
    prerequisites: ['comp-circ-b'], status: 'DRAFT', version: '1.0.0',
  };
  const circularB: Competency = {
    id: 'comp-circ-b', code: 'COMP-CIRC-002', name: 'B', description: 'B', category: 'foundations',
    levelDefinitions: { developingCriteria: 'd', demonstratedCriteria: 'd', proficientCriteria: 'p', masteredCriteria: 'm' },
    prerequisites: ['comp-circ-c'], status: 'DRAFT', version: '1.0.0',
  };
  const circularC: Competency = {
    id: 'comp-circ-c', code: 'COMP-CIRC-003', name: 'C', description: 'C', category: 'foundations',
    levelDefinitions: { developingCriteria: 'd', demonstratedCriteria: 'd', proficientCriteria: 'p', masteredCriteria: 'm' },
    prerequisites: ['comp-circ-a'], status: 'DRAFT', version: '1.0.0',
  };

  assertThrows(
    () => CurriculumValidator.detectCircularCompetencyPrerequisites([circularA, circularB, circularC]),
    'CIRCULAR_COMPETENCY_PREREQUISITE',
    'Detects and rejects circular competency prerequisite dependencies (A -> B -> C -> A)'
  );

  // ── GROUP 6: ThreeDayPacket & Day 1/2/3 Invariants ──
  console.log('\n── GROUP 6: ThreeDayPacket & Day 1/2/3 Invariants ──');
  const validPacket: ThreeDayPacketMeta = {
    id: 'pkt-p1-m1-w1-001',
    weekId: 'week-pfs-m1-w1',
    packetCode: 'P1-M1-W1-PKT001',
    title: 'Program Execution & Developer Environment Setup',
    description: 'First 3-day sprint covering execution mental models, CLI scripts, and debugging.',
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

  const validDays: Day[] = [
    { id: 'day-001-d1', packetId: 'pkt-p1-m1-w1-001', dayNumber: 1, title: 'Understand: How Interpreters Work', objectives: ['Understand bytecode compilation'], status: 'PUBLISHED' },
    { id: 'day-001-d2', packetId: 'pkt-p1-m1-w1-001', dayNumber: 2, title: 'Build: CLI Environment Scripts', objectives: ['Write system_check.py'], status: 'PUBLISHED' },
    { id: 'day-001-d3', packetId: 'pkt-p1-m1-w1-001', dayNumber: 3, title: 'Transfer: Unfamiliar Sensor Log Parser', objectives: ['Parse raw log streams without external libs'], status: 'PUBLISHED' },
  ];

  curriculumRegistry.registerPacket(validPacket, validDays);
  assert(!!curriculumRegistry.getPacketByCode('P1-M1-W1-PKT001'), 'Packet P1-M1-W1-PKT001 registered and queryable by code');
  assert(curriculumRegistry.getDaysForPacket('pkt-p1-m1-w1-001').length === 3, 'Packet contains exactly 3 days');

  // Test Duplicate Packet Code Rejection
  const duplicatePacket: ThreeDayPacketMeta = {
    ...validPacket,
    id: 'pkt-p1-m1-w1-001-dup',
  };
  assertThrows(
    () => curriculumRegistry.registerPacket(duplicatePacket, validDays),
    'DUPLICATE_PACKET_CODE',
    'Rejects registration of duplicate packetCode'
  );

  // Test Day 4 Rejection (Strict 3-Day Packet Rule)
  const invalidFourDays: Day[] = [
    ...validDays,
    { id: 'day-001-d4', packetId: 'pkt-p1-m1-w1-001', dayNumber: 3, title: 'Day 4 Illegal', objectives: ['Illegal'], status: 'DRAFT' },
  ];
  assertThrows(
    () => CurriculumValidator.validateDays(validPacket, invalidFourDays),
    'EXCESS_PACKET_DAYS',
    'Rejects packet containing more than 3 days'
  );

  // ── GROUP 7: Existing Codebase Non-Regression Verification ──
  console.log('\n── GROUP 7: Existing Codebase Non-Regression Verification ──');
  assert(COURSES_REGISTRY.length >= 30, `Existing COURSES_REGISTRY remains intact (${COURSES_REGISTRY.length} courses found)`);
  const javaCourse = COURSES_REGISTRY.find(c => c.id === 'course-java-logic');
  assert(!!javaCourse && javaCourse.quests.length > 0, 'Existing Java course and quests are intact');

  console.log('\n===============================================================');
  console.log(`🏁 TEST SUITE FINISHED: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log('===============================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('[FATAL ERROR IN TEST RUNNER]', err);
  process.exit(1);
});
