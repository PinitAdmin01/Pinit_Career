import sys

test_code = """
test('Soft Skills Day 46: Resolution & Structural Invariants for Tech Offer Evaluation & Equity Anatomy', () => {
  const ssD46 = getLongLesson('soft-skills', 46);
  assert.ok(ssD46, 'soft-skills Day 46 long lesson must resolve');
  assert.equal(ssD46.day, 46);
  assert.equal(ssD46.parts.length, 5, 'soft-skills Day 46 must contain exactly 5 parts');
  assert.ok(ssD46.summary.length >= 4, 'soft-skills Day 46 must contain comprehensive summary');
  assert.ok(ssD46.projectStep, 'soft-skills Day 46 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD46);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD46.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 46: Domain-Specific Content Assertions', () => {
  const ssD46 = getLongLesson('soft-skills', 46);
  assert.ok(ssD46);

  assert.ok(ssD46.parts[0].output.includes('TECH OFFER TOTAL COMPENSATION EVALUATION'));
  assert.ok(ssD46.parts[1].output.includes('4-YEAR TOTAL COMPENSATION LIFECYCLE MODEL'));
  assert.ok(ssD46.parts[2].output.includes('TECH EQUITY DILUTION & LIQUIDATION SIMULATION'));
  assert.ok(ssD46.parts[3].output.includes('COMPLEX OFFER CONTRACT & PREDATORY CLAUSE AUDIT'));
  assert.ok(ssD46.parts[4].output.includes('DAY 46 TECH OFFER EVALUATION CERTIFICATION'));
  assert.ok(ssD46.parts[4].output.includes('DAY_46_TECH_OFFER_EVALUATION_100_PCT_VERIFIED'));
});

test('Soft Skills Day 47: Resolution & Structural Invariants for Compensation Negotiation Playbook', () => {
  const ssD47 = getLongLesson('soft-skills', 47);
  assert.ok(ssD47, 'soft-skills Day 47 long lesson must resolve');
  assert.equal(ssD47.day, 47);
  assert.equal(ssD47.parts.length, 5, 'soft-skills Day 47 must contain exactly 5 parts');
  assert.ok(ssD47.summary.length >= 4, 'soft-skills Day 47 must contain comprehensive summary');
  assert.ok(ssD47.projectStep, 'soft-skills Day 47 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD47);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD47.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 47: Domain-Specific Content Assertions', () => {
  const ssD47 = getLongLesson('soft-skills', 47);
  assert.ok(ssD47);

  assert.ok(ssD47.parts[0].output.includes('COMPENSATION NEGOTIATION PLAYBOOK EVALUATION'));
  assert.ok(ssD47.parts[1].output.includes('3-WAY BIDDING WAR EMAIL SEQUENCE BLUEPRINT'));
  assert.ok(ssD47.parts[2].output.includes('COUNTER-OFFER GENERATOR CLI'));
  assert.ok(ssD47.parts[3].output.includes('LIVE RECRUITER HARDBALL LAB'));
  assert.ok(ssD47.parts[4].output.includes('DAY 47 COMPENSATION NEGOTIATION MASTERY CERTIFICATION'));
  assert.ok(ssD47.parts[4].output.includes('DAY_47_NEGOTIATION_PLAYBOOK_100_PCT_VERIFIED'));
});

test('Soft Skills Day 48: Resolution & Structural Invariants for Difficult Conversations & Performance', () => {
  const ssD48 = getLongLesson('soft-skills', 48);
  assert.ok(ssD48, 'soft-skills Day 48 long lesson must resolve');
  assert.equal(ssD48.day, 48);
  assert.equal(ssD48.parts.length, 5, 'soft-skills Day 48 must contain exactly 5 parts');
  assert.ok(ssD48.summary.length >= 4, 'soft-skills Day 48 must contain comprehensive summary');
  assert.ok(ssD48.projectStep, 'soft-skills Day 48 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD48);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD48.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 48: Domain-Specific Content Assertions', () => {
  const ssD48 = getLongLesson('soft-skills', 48);
  assert.ok(ssD48);

  assert.ok(ssD48.parts[0].output.includes('RADICAL CANDOR MATRIX EVALUATION'));
  assert.ok(ssD48.parts[1].output.includes('OBJECTIVE PERFORMANCE DOCUMENTATION DOSSIER'));
  assert.ok(ssD48.parts[2].output.includes('DIFFICULT CONVERSATION SBI SCRIPTING ENGINE'));
  assert.ok(ssD48.parts[3].output.includes('HIGH-EMOTION PERFORMANCE REVIEW LAB'));
  assert.ok(ssD48.parts[4].output.includes('DAY 48 DIFFICULT CONVERSATIONS CERTIFICATION'));
  assert.ok(ssD48.parts[4].output.includes('DAY_48_DIFFICULT_CONVERSATIONS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 49: Resolution & Structural Invariants for Delivering Bad News to Leadership', () => {
  const ssD49 = getLongLesson('soft-skills', 49);
  assert.ok(ssD49, 'soft-skills Day 49 long lesson must resolve');
  assert.equal(ssD49.day, 49);
  assert.equal(ssD49.parts.length, 5, 'soft-skills Day 49 must contain exactly 5 parts');
  assert.ok(ssD49.summary.length >= 4, 'soft-skills Day 49 must contain comprehensive summary');
  assert.ok(ssD49.projectStep, 'soft-skills Day 49 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD49);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD49.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 49: Domain-Specific Content Assertions', () => {
  const ssD49 = getLongLesson('soft-skills', 49);
  assert.ok(ssD49);

  assert.ok(ssD49.parts[0].output.includes('EPISTEMOLOGY OF BAD NEWS DELIVERY EVALUATION'));
  assert.ok(ssD49.parts[1].output.includes('EXECUTIVE CRISIS ESCALATION MEMO BLUEPRINT'));
  assert.ok(ssD49.parts[2].output.includes('PROJECT HEALTH RISK SENTINEL REPORT'));
  assert.ok(ssD49.parts[3].output.includes('HOSTILE EXECUTIVE BAD NEWS DELIVERY LAB'));
  assert.ok(ssD49.parts[4].output.includes('DAY 49 BAD NEWS DELIVERY CERTIFICATION'));
  assert.ok(ssD49.parts[4].output.includes('DAY_49_BAD_NEWS_DELIVERY_100_PCT_VERIFIED'));
});

test('Soft Skills Day 50: Resolution & Structural Invariants for Milestone 7 ApexNegotiation Suite', () => {
  const ssD50 = getLongLesson('soft-skills', 50);
  assert.ok(ssD50, 'soft-skills Day 50 long lesson must resolve');
  assert.equal(ssD50.day, 50);
  assert.equal(ssD50.parts.length, 5, 'soft-skills Day 50 must contain exactly 5 parts');
  assert.ok(ssD50.summary.length >= 4, 'soft-skills Day 50 must contain comprehensive summary');
  assert.ok(ssD50.projectStep, 'soft-skills Day 50 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD50);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD50.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 50: Domain-Specific Content Assertions', () => {
  const ssD50 = getLongLesson('soft-skills', 50);
  assert.ok(ssD50);

  assert.ok(ssD50.parts[0].output.includes('GAME THEORY IN EXECUTIVE COMPENSATION'));
  assert.ok(ssD50.parts[1].output.includes('APEXNEGOTIATION MASTER DOSSIER'));
  assert.ok(ssD50.parts[2].output.includes('APEXNEGOTIATION AUTOMATED COUNTER-OFFER SIMULATOR'));
  assert.ok(ssD50.parts[3].output.includes('LIVE RECRUITER & EXECUTIVE GAUNTLET LAB'));
  assert.ok(ssD50.parts[4].output.includes('MILESTONE 7 APEXNEGOTIATION CAPSTONE CERTIFICATION'));
  assert.ok(ssD50.parts[4].output.includes('MILESTONE_7_APEXNEGOTIATION_SUITE_100_PCT_VERIFIED'));
});
"""

test_file = "tests/java_softskills_long_lessons.test.ts"
with open(test_file, "r", encoding="utf-8") as f:
    content = f.read()

if "Soft Skills Day 46:" not in content:
    with open(test_file, "a", encoding="utf-8") as f:
        f.write("\n" + test_code.strip() + "\n")
    print(f"Appended 10 test blocks for Days 46-50 to {test_file} successfully!")
else:
    print("Days 46-50 tests already present.")
