test_code = """
test('Soft Skills Day 51: Resolution & Structural Invariants for Public Speaking & Tech Conferences', () => {
  const ssD51 = getLongLesson('soft-skills', 51);
  assert.ok(ssD51, 'soft-skills Day 51 long lesson must resolve');
  assert.equal(ssD51.day, 51);
  assert.equal(ssD51.parts.length, 5, 'soft-skills Day 51 must contain exactly 5 parts');
  assert.ok(ssD51.summary.length >= 4, 'soft-skills Day 51 must contain comprehensive summary');
  assert.ok(ssD51.projectStep, 'soft-skills Day 51 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD51);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD51.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 51: Domain-Specific Content Assertions', () => {
  const ssD51 = getLongLesson('soft-skills', 51);
  assert.ok(ssD51);

  assert.ok(ssD51.parts[0].output.includes('TECH CONFERENCE CFP EVALUATION'));
  assert.ok(ssD51.parts[1].output.includes('MAGNETIC CFP SUBMISSION BLUEPRINT'));
  assert.ok(ssD51.parts[2].output.includes('CONFERENCE LIVE DEMO RISK AUDIT'));
  assert.ok(ssD51.parts[3].output.includes('LIVE TECHNICAL KEYNOTE INCIDENT LAB'));
  assert.ok(ssD51.parts[4].output.includes('DAY 51 PUBLIC SPEAKING CERTIFICATION'));
  assert.ok(ssD51.parts[4].output.includes('DAY_51_PUBLIC_SPEAKING_100_PCT_VERIFIED'));
});

test('Soft Skills Day 52: Resolution & Structural Invariants for Technical Writing & Hacker News', () => {
  const ssD52 = getLongLesson('soft-skills', 52);
  assert.ok(ssD52, 'soft-skills Day 52 long lesson must resolve');
  assert.equal(ssD52.day, 52);
  assert.equal(ssD52.parts.length, 5, 'soft-skills Day 52 must contain exactly 5 parts');
  assert.ok(ssD52.summary.length >= 4, 'soft-skills Day 52 must contain comprehensive summary');
  assert.ok(ssD52.projectStep, 'soft-skills Day 52 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD52);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD52.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 52: Domain-Specific Content Assertions', () => {
  const ssD52 = getLongLesson('soft-skills', 52);
  assert.ok(ssD52);

  assert.ok(ssD52.parts[0].output.includes('HACKER NEWS TECHNICAL VIRALITY AUDIT'));
  assert.ok(ssD52.parts[1].output.includes('FRONT-PAGE ENGINEERING BLOG BLUEPRINT'));
  assert.ok(ssD52.parts[2].output.includes('TECHNICAL PUBLICATION MARKDOWN ENGINE'));
  assert.ok(ssD52.parts[3].output.includes('HACKER NEWS COMMENT SECTION DEFENSE LAB'));
  assert.ok(ssD52.parts[4].output.includes('DAY 52 TECHNICAL WRITING CERTIFICATION'));
  assert.ok(ssD52.parts[4].output.includes('DAY_52_TECHNICAL_WRITING_100_PCT_VERIFIED'));
});

test('Soft Skills Day 53: Resolution & Structural Invariants for Remote & Distributed Team Communication', () => {
  const ssD53 = getLongLesson('soft-skills', 53);
  assert.ok(ssD53, 'soft-skills Day 53 long lesson must resolve');
  assert.equal(ssD53.day, 53);
  assert.equal(ssD53.parts.length, 5, 'soft-skills Day 53 must contain exactly 5 parts');
  assert.ok(ssD53.summary.length >= 4, 'soft-skills Day 53 must contain comprehensive summary');
  assert.ok(ssD53.projectStep, 'soft-skills Day 53 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD53);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD53.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 53: Domain-Specific Content Assertions', () => {
  const ssD53 = getLongLesson('soft-skills', 53);
  assert.ok(ssD53);

  assert.ok(ssD53.parts[0].output.includes('GITLAB HANDBOOK & ASYNC SOVEREIGNTY AUDIT'));
  assert.ok(ssD53.parts[1].output.includes('120-SECOND ASYNC VIDEO WALKTHROUGH BLUEPRINT'));
  assert.ok(ssD53.parts[2].output.includes('GLOBAL ASYNC COLLABORATION SCHEDULER'));
  assert.ok(ssD53.parts[3].output.includes('GLOBAL TIME ZONE CRISIS RESOLUTION LAB'));
  assert.ok(ssD53.parts[4].output.includes('DAY 53 REMOTE ASYNC SOVEREIGNTY CERTIFICATION'));
  assert.ok(ssD53.parts[4].output.includes('DAY_53_REMOTE_SOVEREIGNTY_100_PCT_VERIFIED'));
});

test('Soft Skills Day 54: Resolution & Structural Invariants for The Complete Staff+ Interview Gauntlet', () => {
  const ssD54 = getLongLesson('soft-skills', 54);
  assert.ok(ssD54, 'soft-skills Day 54 long lesson must resolve');
  assert.equal(ssD54.day, 54);
  assert.equal(ssD54.parts.length, 5, 'soft-skills Day 54 must contain exactly 5 parts');
  assert.ok(ssD54.summary.length >= 4, 'soft-skills Day 54 must contain comprehensive summary');
  assert.ok(ssD54.projectStep, 'soft-skills Day 54 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD54);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD54.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 54: Domain-Specific Content Assertions', () => {
  const ssD54 = getLongLesson('soft-skills', 54);
  assert.ok(ssD54);

  assert.ok(ssD54.parts[0].output.includes('BAYESIAN HIRING COMMITTEE EVALUATION'));
  assert.ok(ssD54.parts[1].output.includes('5-ROUND ONSITE MASTER PREPARATION PLAN'));
  assert.ok(ssD54.parts[2].output.includes('FULL-LOOP ONSITE PERFORMANCE TRACKER'));
  assert.ok(ssD54.parts[3].output.includes('FULL 5-ROUND MOCK ONSITE GAUNTLET LAB'));
  assert.ok(ssD54.parts[4].output.includes('DAY 54 STAFF+ INTERVIEW GAUNTLET CERTIFICATION'));
  assert.ok(ssD54.parts[4].output.includes('DAY_54_STAFF_INTERVIEW_GAUNTLET_100_PCT_VERIFIED'));
});

test('Soft Skills Day 55: Resolution & Structural Invariants for Historic Communication Catastrophes 1', () => {
  const ssD55 = getLongLesson('soft-skills', 55);
  assert.ok(ssD55, 'soft-skills Day 55 long lesson must resolve');
  assert.equal(ssD55.day, 55);
  assert.equal(ssD55.parts.length, 5, 'soft-skills Day 55 must contain exactly 5 parts');
  assert.ok(ssD55.summary.length >= 4, 'soft-skills Day 55 must contain comprehensive summary');
  assert.ok(ssD55.projectStep, 'soft-skills Day 55 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD55);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD55.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 55: Domain-Specific Content Assertions', () => {
  const ssD55 = getLongLesson('soft-skills', 55);
  assert.ok(ssD55);

  assert.ok(ssD55.parts[0].output.includes('EDWARD TUFTE FORENSIC ANALYSIS OF CHALLENGER CHARTS'));
  assert.ok(ssD55.parts[1].output.includes('RECONSTRUCTED DEFINITIVE 1-PAGE TUFTE SCATTERPLOT'));
  assert.ok(ssD55.parts[2].output.includes('CRITICAL THREAT VISUALIZER CLI'));
  assert.ok(ssD55.parts[3].output.includes('HIGH-PRESSURE LAUNCH SAFETY DEFENSE LAB'));
  assert.ok(ssD55.parts[4].output.includes('DAY 55 ETHICAL ENGINEERING & CRISIS COMMUNICATION CERTIFICATION'));
  assert.ok(ssD55.parts[4].output.includes('DAY_55_ETHICAL_ENGINEERING_100_PCT_VERIFIED'));
});
"""

test_file = "tests/java_softskills_long_lessons.test.ts"
with open(test_file, "r", encoding="utf-8") as f:
    content = f.read()

if "Soft Skills Day 51:" not in content:
    with open(test_file, "a", encoding="utf-8") as f:
        f.write("\n" + test_code.strip() + "\n")
    print(f"Appended 10 test blocks for Days 51-55 to {test_file} successfully!")
else:
    print("Days 51-55 tests already present.")
