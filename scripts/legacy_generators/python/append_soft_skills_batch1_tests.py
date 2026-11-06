import os

test_code = '''
test('Soft Skills Day 31: Resolution & Structural Invariants for Scope Clarification & Capacity Estimation', () => {
  const ssD31 = getLongLesson('soft-skills', 31);
  assert.ok(ssD31, 'soft-skills Day 31 long lesson must resolve');
  assert.equal(ssD31.day, 31);
  assert.equal(ssD31.parts.length, 5, 'soft-skills Day 31 must contain exactly 5 parts');
  assert.ok(ssD31.summary.length >= 4, 'soft-skills Day 31 must contain comprehensive summary');
  assert.ok(ssD31.projectStep, 'soft-skills Day 31 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD31);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD31.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 31: Domain-Specific Content Assertions', () => {
  const ssD31 = getLongLesson('soft-skills', 31);
  assert.ok(ssD31);

  assert.ok(ssD31.parts[0].output.includes('SYSTEM DESIGN OPENING CALCULUS EVALUATION'));
  assert.ok(ssD31.parts[1].output.includes('BACK-OF-THE-ENVELOPE CAPACITY ESTIMATION EVALUATION'));
  assert.ok(ssD31.parts[2].output.includes('SOCRATIC INTERVIEWER CALIBRATION EVALUATION'));
  assert.ok(ssD31.parts[3].output.includes('EXPLICIT ARCHITECTURAL BOUNDARY EVALUATION'));
  assert.ok(ssD31.parts[4].output.includes('MASTER SCOPING PROTOCOL SUITE EVALUATION'));
  assert.ok(ssD31.parts[4].output.includes('STAFF_ARCHITECT_SCOPING_RATIFIED'));
});

test('Soft Skills Day 32: Resolution & Structural Invariants for Driving the Whiteboard & Topological Canvas', () => {
  const ssD32 = getLongLesson('soft-skills', 32);
  assert.ok(ssD32, 'soft-skills Day 32 long lesson must resolve');
  assert.equal(ssD32.day, 32);
  assert.equal(ssD32.parts.length, 5, 'soft-skills Day 32 must contain exactly 5 parts');
  assert.ok(ssD32.summary.length >= 4, 'soft-skills Day 32 must contain comprehensive summary');
  assert.ok(ssD32.projectStep, 'soft-skills Day 32 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD32);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD32.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 32: Domain-Specific Content Assertions', () => {
  const ssD32 = getLongLesson('soft-skills', 32);
  assert.ok(ssD32);

  assert.ok(ssD32.parts[0].output.includes('5-TIER TOPOLOGICAL CANVAS EVALUATION'));
  assert.ok(ssD32.parts[1].output.includes('DECOUPLED DATA FLOW PIPELINE EVALUATION'));
  assert.ok(ssD32.parts[2].output.includes('COMPONENT ISOLATION DEEP-DIVE EVALUATION'));
  assert.ok(ssD32.parts[2].output.includes('UBER_H3_HEXAGONAL_INDEX_LEVEL_8'));
  assert.ok(ssD32.parts[3].output.includes('WHITEBOARD COGNITIVE ERGONOMICS EVALUATION'));
  assert.ok(ssD32.parts[4].output.includes('MASTER TOP-DOWN WHITEBOARD ARCHITECTURE EVALUATION'));
});

test('Soft Skills Day 33: Resolution & Structural Invariants for Communicating Trade-Offs Under Pressure', () => {
  const ssD33 = getLongLesson('soft-skills', 33);
  assert.ok(ssD33, 'soft-skills Day 33 long lesson must resolve');
  assert.equal(ssD33.day, 33);
  assert.equal(ssD33.parts.length, 5, 'soft-skills Day 33 must contain exactly 5 parts');
  assert.ok(ssD33.summary.length >= 4, 'soft-skills Day 33 must contain comprehensive summary');
  assert.ok(ssD33.projectStep, 'soft-skills Day 33 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD33);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD33.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 33: Domain-Specific Content Assertions', () => {
  const ssD33 = getLongLesson('soft-skills', 33);
  assert.ok(ssD33);

  assert.ok(ssD33.parts[0].output.includes('MULTI-DIMENSIONAL TRADE-OFF MATRIX EVALUATION'));
  assert.ok(ssD33.parts[1].output.includes('PACELC THEOREM DRIFT EVALUATION'));
  assert.ok(ssD33.parts[1].output.includes('PACELC_TRADE_OFF_RIGOR_VERIFIED'));
  assert.ok(ssD33.parts[2].output.includes('FINANCIAL UNIT ECONOMICS & CLOUD TAX EVALUATION'));
  assert.ok(ssD33.parts[3].output.includes('COGNITIVE BIAS & SILVER BULLET DISPELLING EVALUATION'));
  assert.ok(ssD33.parts[4].output.includes('MASTER SYSTEM DESIGN TRADE-OFF DEFENSE EVALUATION'));
});

test('Soft Skills Day 34: Resolution & Structural Invariants for Handling Pushback & Curveballs', () => {
  const ssD34 = getLongLesson('soft-skills', 34);
  assert.ok(ssD34, 'soft-skills Day 34 long lesson must resolve');
  assert.equal(ssD34.day, 34);
  assert.equal(ssD34.parts.length, 5, 'soft-skills Day 34 must contain exactly 5 parts');
  assert.ok(ssD34.summary.length >= 4, 'soft-skills Day 34 must contain comprehensive summary');
  assert.ok(ssD34.projectStep, 'soft-skills Day 34 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD34);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD34.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 34: Domain-Specific Content Assertions', () => {
  const ssD34 = getLongLesson('soft-skills', 34);
  assert.ok(ssD34);

  assert.ok(ssD34.parts[0].output.includes('CURVEBALL PSYCHOLOGICAL RECEPTION EVALUATION'));
  assert.ok(ssD34.parts[1].output.includes('GRACEFUL ARCHITECTURAL PIVOT EVALUATION'));
  assert.ok(ssD34.parts[2].output.includes('DISAGREE AND COMMIT SOCRATIC DEFENSE EVALUATION'));
  assert.ok(ssD34.parts[3].output.includes('HIDDEN ASSUMPTION ROOT-CAUSE EXTRACTION EVALUATION'));
  assert.ok(ssD34.parts[4].output.includes('MASTER CURVEBALL RESOLUTION SUITE EVALUATION'));
  assert.ok(ssD34.parts[4].output.includes('CURVEBALL_GENERATOR_SIMULATION_PASSED'));
});

test('Soft Skills Day 35: Resolution & Structural Invariants for Milestone 4 (M2) ApexDesign System Design Suite', () => {
  const ssD35 = getLongLesson('soft-skills', 35);
  assert.ok(ssD35, 'soft-skills Day 35 long lesson must resolve');
  assert.equal(ssD35.day, 35);
  assert.equal(ssD35.parts.length, 5, 'soft-skills Day 35 must contain exactly 5 parts');
  assert.ok(ssD35.summary.length >= 4, 'soft-skills Day 35 must contain comprehensive summary');
  assert.ok(ssD35.projectStep, 'soft-skills Day 35 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD35);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD35.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 35: Domain-Specific Content Assertions', () => {
  const ssD35 = getLongLesson('soft-skills', 35);
  assert.ok(ssD35);

  assert.ok(ssD35.parts[0].output.includes('PLANETARY-SCALE SYSTEM DESIGN RUBRIC EVALUATION'));
  assert.ok(ssD35.parts[1].output.includes('APEXRIDE LIVE WHITEBOARD EVALUATION'));
  assert.ok(ssD35.parts[2].output.includes('APEXPAY ACID FINANCIAL LEDGER EVALUATION'));
  assert.ok(ssD35.parts[3].output.includes('APEXDESIGN BAR RAISER DEFENSE LAB EVALUATION'));
  assert.ok(ssD35.parts[4].output.includes('APEXDESIGN GRAND WHITEBOARD CAPSTONE CERTIFICATION'));
  assert.ok(ssD35.parts[4].output.includes('MILESTONE_4_APEXDESIGN_SUITE_100_PCT_VERIFIED'));
});
'''

test_file = 'tests/java_softskills_long_lessons.test.ts'
with open(test_file, 'r', encoding='utf-8') as f:
    content = f.read()

if 'Soft Skills Day 31: Resolution & Structural Invariants' in content:
    print("Tests already present.")
else:
    with open(test_file, 'a', encoding='utf-8') as f:
        f.write(test_code)
    print("Successfully appended Days 31-35 tests.")
