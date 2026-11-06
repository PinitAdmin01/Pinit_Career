with open('tests/java_softskills_long_lessons.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

marker = "test('Soft Skills Day 36:"
idx = text.find(marker)
if idx != -1:
    text = text[:idx]

new_tests = """
test('Soft Skills Day 36: Resolution & Structural Invariants for Live Coding Communication', () => {
  const ssD36 = getLongLesson('soft-skills', 36);
  assert.ok(ssD36, 'soft-skills Day 36 long lesson must resolve');
  assert.equal(ssD36.day, 36);
  assert.equal(ssD36.parts.length, 5, 'soft-skills Day 36 must contain exactly 5 parts');
  assert.ok(ssD36.summary.length >= 4, 'soft-skills Day 36 must contain comprehensive summary');
  assert.ok(ssD36.projectStep, 'soft-skills Day 36 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD36);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD36.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 36: Domain-Specific Content Assertions', () => {
  const ssD36 = getLongLesson('soft-skills', 36);
  assert.ok(ssD36);

  assert.ok(ssD36.parts[0].output.includes('COGNITIVE LOAD DUAL-TASK EXECUTION EVALUATION'));
  assert.ok(ssD36.parts[1].output.includes('BABBLY NOISE FILTER EVALUATION'));
  assert.ok(ssD36.parts[2].output.includes('TEST-DRIVEN VERBALIZATION EVALUATION'));
  assert.ok(ssD36.parts[3].output.includes('HIGH-PRESSURE LIVE CODING VERBALIZATION LAB'));
  assert.ok(ssD36.parts[4].output.includes('DAY 36 LIVE CODING MASTERY CERTIFICATION'));
  assert.ok(ssD36.parts[4].output.includes('DAY_36_LIVE_CODING_COMMUNICATION_100_PCT_VERIFIED'));
});

test('Soft Skills Day 37: Resolution & Structural Invariants for Scientific Debugging Under Pressure', () => {
  const ssD37 = getLongLesson('soft-skills', 37);
  assert.ok(ssD37, 'soft-skills Day 37 long lesson must resolve');
  assert.equal(ssD37.day, 37);
  assert.equal(ssD37.parts.length, 5, 'soft-skills Day 37 must contain exactly 5 parts');
  assert.ok(ssD37.summary.length >= 4, 'soft-skills Day 37 must contain comprehensive summary');
  assert.ok(ssD37.projectStep, 'soft-skills Day 37 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD37);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD37.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 37: Domain-Specific Content Assertions', () => {
  const ssD37 = getLongLesson('soft-skills', 37);
  assert.ok(ssD37);

  assert.ok(ssD37.parts[0].output.includes('SCIENTIFIC METHOD IN SOFTWARE DIAGNOSTICS'));
  assert.ok(ssD37.parts[1].output.includes('DRY-RUN TRACE TABLE MATRIX'));
  assert.ok(ssD37.parts[2].output.includes('DEBUGGING VERBALIZATION EVALUATION'));
  assert.ok(ssD37.parts[3].output.includes('4-MINUTE CLOCK PANIC DEBUGGING LAB'));
  assert.ok(ssD37.parts[4].output.includes('DAY 37 SCIENTIFIC DEBUGGING MASTERY CERTIFICATION'));
  assert.ok(ssD37.parts[4].output.includes('DAY_37_SCIENTIFIC_DEBUGGING_100_PCT_VERIFIED'));
});

test('Soft Skills Day 38: Resolution & Structural Invariants for Staff Engineer Archetypes', () => {
  const ssD38 = getLongLesson('soft-skills', 38);
  assert.ok(ssD38, 'soft-skills Day 38 long lesson must resolve');
  assert.equal(ssD38.day, 38);
  assert.equal(ssD38.parts.length, 5, 'soft-skills Day 38 must contain exactly 5 parts');
  assert.ok(ssD38.summary.length >= 4, 'soft-skills Day 38 must contain comprehensive summary');
  assert.ok(ssD38.projectStep, 'soft-skills Day 38 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD38);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD38.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 38: Domain-Specific Content Assertions', () => {
  const ssD38 = getLongLesson('soft-skills', 38);
  assert.ok(ssD38);

  assert.ok(ssD38.parts[0].output.includes('WILL LARSON STAFF ARCHETYPE TAXONOMY EVALUATION'));
  assert.ok(ssD38.parts[1].output.includes('STAFF ARCHETYPE DIAGNOSTIC MATRIX AUDIT'));
  assert.ok(ssD38.parts[2].output.includes('STAFF OPERATING RHYTHM BLUEPRINT'));
  assert.ok(ssD38.parts[3].output.includes('MULTI-ARCHETYPE EXECUTIVE SIMULATION LAB'));
  assert.ok(ssD38.parts[4].output.includes('DAY 38 STAFF ARCHETYPE MASTERY CERTIFICATION'));
  assert.ok(ssD38.parts[4].output.includes('DAY_38_STAFF_ARCHETYPES_100_PCT_VERIFIED'));
});

test('Soft Skills Day 39: Resolution & Structural Invariants for Grassroots Coalitions & Bottom-Up Adoption', () => {
  const ssD39 = getLongLesson('soft-skills', 39);
  assert.ok(ssD39, 'soft-skills Day 39 long lesson must resolve');
  assert.equal(ssD39.day, 39);
  assert.equal(ssD39.parts.length, 5, 'soft-skills Day 39 must contain exactly 5 parts');
  assert.ok(ssD39.summary.length >= 4, 'soft-skills Day 39 must contain comprehensive summary');
  assert.ok(ssD39.projectStep, 'soft-skills Day 39 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD39);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD39.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 39: Domain-Specific Content Assertions', () => {
  const ssD39 = getLongLesson('soft-skills', 39);
  assert.ok(ssD39);

  assert.ok(ssD39.parts[0].output.includes('ROGERS DIFFUSION OF INNOVATIONS IN SOFTWARE ORGS'));
  assert.ok(ssD39.parts[1].output.includes('THE LIGHTHOUSE TEAM PLAYBOOK (30-60-90 DAYS)'));
  assert.ok(ssD39.parts[2].output.includes('GRASSROOTS ADOPTION TELEMETRY EVALUATION'));
  assert.ok(ssD39.parts[3].output.includes('HOSTILE SKEPTIC SQUAD CONVERSION LAB'));
  assert.ok(ssD39.parts[4].output.includes('DAY 39 GRASSROOTS COALITION MASTERY CERTIFICATION'));
  assert.ok(ssD39.parts[4].output.includes('DAY_39_GRASSROOTS_COALITIONS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 40: Resolution & Structural Invariants for Milestone 5 ApexInfluence Strategy Suite', () => {
  const ssD40 = getLongLesson('soft-skills', 40);
  assert.ok(ssD40, 'soft-skills Day 40 long lesson must resolve');
  assert.equal(ssD40.day, 40);
  assert.equal(ssD40.parts.length, 5, 'soft-skills Day 40 must contain exactly 5 parts');
  assert.ok(ssD40.summary.length >= 4, 'soft-skills Day 40 must contain comprehensive summary');
  assert.ok(ssD40.projectStep, 'soft-skills Day 40 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD40);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD40.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 40: Domain-Specific Content Assertions', () => {
  const ssD40 = getLongLesson('soft-skills', 40);
  assert.ok(ssD40);

  assert.ok(ssD40.parts[0].output.includes('THE POLITICAL ECONOMY OF SOFTWARE ENGINEERING'));
  assert.ok(ssD40.parts[1].output.includes('APEXINFLUENCE MASTER CAMPAIGN BLUEPRINT'));
  assert.ok(ssD40.parts[2].output.includes('APEXINFLUENCE CAMPAIGN HEALTH TELEMETRY'));
  assert.ok(ssD40.parts[3].output.includes('PUBLIC ENGINEERING REVOLT MEDIATION LAB'));
  assert.ok(ssD40.parts[4].output.includes('MILESTONE 5 APEXINFLUENCE CAPSTONE CERTIFICATION'));
  assert.ok(ssD40.parts[4].output.includes('MILESTONE_5_APEXINFLUENCE_SUITE_100_PCT_VERIFIED'));
});
"""

with open('tests/java_softskills_long_lessons.test.ts', 'w', encoding='utf-8') as f:
    f.write(text.rstrip() + "\n" + new_tests)

print("Updated tests/java_softskills_long_lessons.test.ts with Days 36-40 test blocks!")
