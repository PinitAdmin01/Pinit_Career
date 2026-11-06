import os

test_code = """
test('Soft Skills Day 26: Resolution & Structural Invariants for Impostor Syndrome, Boundary Setting & Assertiveness', () => {
  const ssD26 = getLongLesson('soft-skills', 26);
  assert.ok(ssD26, 'soft-skills Day 26 long lesson must resolve');
  assert.equal(ssD26.day, 26);
  assert.equal(ssD26.parts.length, 5, 'soft-skills Day 26 must contain exactly 5 parts');
  assert.ok(ssD26.summary.length >= 4, 'soft-skills Day 26 must contain comprehensive summary');
  assert.ok(ssD26.projectStep, 'soft-skills Day 26 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD26);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD26.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 26: Domain-Specific Content Assertions', () => {
  const ssD26 = getLongLesson('soft-skills', 26);
  assert.ok(ssD26);

  // Part 1 – Impostor Syndrome
  assert.ok(ssD26.parts[0].title.includes('Impostor Syndrome') || ssD26.parts[0].title.includes('Psychology'));
  assert.ok(ssD26.parts[0].output.includes('IMPOSTOR SYNDROME DIAGNOSTIC & REFRAMING AUDIT'));

  // Part 2 – Professional No
  assert.ok(ssD26.parts[1].title.includes('Professional') || ssD26.parts[1].title.includes('Boundary'));
  assert.ok(ssD26.parts[1].output.includes('PROFESSIONAL BOUNDARY & THE ART OF "NO" AUDIT'));

  // Part 3 – Managing Up & Realistic Deadlines
  assert.ok(ssD26.parts[2].title.includes('Managing Up') || ssD26.parts[2].title.includes('Deadlines'));
  assert.ok(ssD26.parts[2].output.includes('MANAGING UP & DEADLINE NEGOTIATION AUDIT'));

  // Part 4 – Healthy Assertiveness
  assert.ok(ssD26.parts[3].title.includes('Assertiveness') || ssD26.parts[3].title.includes('Aggression'));
  assert.ok(ssD26.parts[3].output.includes('CODE REVIEW ASSERTIVENESS AUDIT'));

  // Part 5 – Master Boundary & Assertiveness Suite
  assert.ok(ssD26.parts[4].title.includes('Master') || ssD26.parts[4].title.includes('Assertiveness'));
  assert.ok(ssD26.parts[4].output.includes('MASTER SELF-EFFICACY & PROFESSIONAL BOUNDARY EVALUATION'));
});

test('Soft Skills Day 27: Resolution & Structural Invariants for Cross-Cultural Communication & Global Teams', () => {
  const ssD27 = getLongLesson('soft-skills', 27);
  assert.ok(ssD27, 'soft-skills Day 27 long lesson must resolve');
  assert.equal(ssD27.day, 27);
  assert.equal(ssD27.parts.length, 5, 'soft-skills Day 27 must contain exactly 5 parts');
  assert.ok(ssD27.summary.length >= 4, 'soft-skills Day 27 must contain comprehensive summary');
  assert.ok(ssD27.projectStep, 'soft-skills Day 27 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD27);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD27.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 27: Domain-Specific Content Assertions', () => {
  const ssD27 = getLongLesson('soft-skills', 27);
  assert.ok(ssD27);

  // Part 1 – Cultural Map
  assert.ok(ssD27.parts[0].title.includes('Cultural Map') || ssD27.parts[0].title.includes('High-Context'));
  assert.ok(ssD27.parts[0].output.includes('CROSS-CULTURAL ENGINEERING CONTEXT AUDIT'));

  // Part 2 – Async Hygiene
  assert.ok(ssD27.parts[1].title.includes('Asynchronous') || ssD27.parts[1].title.includes('Hygiene'));
  assert.ok(ssD27.parts[1].output.includes('ASYNCHRONOUS ENGINEERING HYGIENE AUDIT'));

  // Part 3 – Time-Zone Sovereignty
  assert.ok(ssD27.parts[2].title.includes('Time-Zone') || ssD27.parts[2].title.includes('Handshake'));
  assert.ok(ssD27.parts[2].output.includes('TIME-ZONE SOVEREIGNTY & GOLDEN HANDSHAKE AUDIT'));

  // Part 4 – International Code Reviews
  assert.ok(ssD27.parts[3].title.includes('Code Review') || ssD27.parts[3].title.includes('Idiom'));
  assert.ok(ssD27.parts[3].output.includes('INTERNATIONAL CODE REVIEW & IDIOM SANITIZER AUDIT'));

  // Part 5 – Master Cross-Cultural Suite
  assert.ok(ssD27.parts[4].title.includes('Master') || ssD27.parts[4].title.includes('Cross-Cultural'));
  assert.ok(ssD27.parts[4].output.includes('MASTER CROSS-CULTURAL DISTRIBUTED TEAM EVALUATION'));
});

test('Soft Skills Day 28: Resolution & Structural Invariants for Influence Without Authority & Driving Change', () => {
  const ssD28 = getLongLesson('soft-skills', 28);
  assert.ok(ssD28, 'soft-skills Day 28 long lesson must resolve');
  assert.equal(ssD28.day, 28);
  assert.equal(ssD28.parts.length, 5, 'soft-skills Day 28 must contain exactly 5 parts');
  assert.ok(ssD28.summary.length >= 4, 'soft-skills Day 28 must contain comprehensive summary');
  assert.ok(ssD28.projectStep, 'soft-skills Day 28 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD28);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD28.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 28: Domain-Specific Content Assertions', () => {
  const ssD28 = getLongLesson('soft-skills', 28);
  assert.ok(ssD28);

  // Part 1 – Influence Dilemma
  assert.ok(ssD28.parts[0].title.includes('Influence') || ssD28.parts[0].title.includes('Dilemma'));
  assert.ok(ssD28.parts[0].output.includes('ENGINEERING INFLUENCE DILEMMA AUDIT'));

  // Part 2 – Stakeholder Power Grid
  assert.ok(ssD28.parts[1].title.includes('Stakeholder') || ssD28.parts[1].title.includes('Power Grid'));
  assert.ok(ssD28.parts[1].output.includes('STAKEHOLDER POWER GRID MAPPING AUDIT'));

  // Part 3 – Nemawashi Pre-Wire
  assert.ok(ssD28.parts[2].title.includes('Nemawashi') || ssD28.parts[2].title.includes('Pre-Wire'));
  assert.ok(ssD28.parts[2].output.includes('NEMAWASHI PRE-WIRE CONSENSUS AUDIT'));

  // Part 4 – Technical to Business Value
  assert.ok(ssD28.parts[3].title.includes('Business Value') || ssD28.parts[3].title.includes('Framing'));
  assert.ok(ssD28.parts[3].output.includes('TECHNICAL TO BUSINESS VALUE TRANSLATION AUDIT'));

  // Part 5 – Master Influence Suite
  assert.ok(ssD28.parts[4].title.includes('Master') || ssD28.parts[4].title.includes('Influence'));
  assert.ok(ssD28.parts[4].output.includes('MASTER INFLUENCE WITHOUT AUTHORITY EVALUATION'));
});

test('Soft Skills Day 29: Resolution & Structural Invariants for Tech Specs, Architecture RFCs & Consensus', () => {
  const ssD29 = getLongLesson('soft-skills', 29);
  assert.ok(ssD29, 'soft-skills Day 29 long lesson must resolve');
  assert.equal(ssD29.day, 29);
  assert.equal(ssD29.parts.length, 5, 'soft-skills Day 29 must contain exactly 5 parts');
  assert.ok(ssD29.summary.length >= 4, 'soft-skills Day 29 must contain comprehensive summary');
  assert.ok(ssD29.projectStep, 'soft-skills Day 29 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD29);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD29.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 29: Domain-Specific Content Assertions', () => {
  const ssD29 = getLongLesson('soft-skills', 29);
  assert.ok(ssD29);

  // Part 1 – Tech Spec Anatomy
  assert.ok(ssD29.parts[0].title.includes('Tech Spec') || ssD29.parts[0].title.includes('Anatomy'));
  assert.ok(ssD29.parts[0].output.includes('TECH SPEC STRUCTURAL COMPLETENESS AUDIT'));

  // Part 2 – Alternatives Considered
  assert.ok(ssD29.parts[1].title.includes('Alternatives Considered') || ssD29.parts[1].title.includes('Trade-Off'));
  assert.ok(ssD29.parts[1].output.includes('ALTERNATIVES CONSIDERED & ARCHITECTURAL RIGOR AUDIT'));

  // Part 3 – RFC Comment Management
  assert.ok(ssD29.parts[2].title.includes('RFC Review') || ssD29.parts[2].title.includes('Bikeshed'));
  assert.ok(ssD29.parts[2].output.includes('RFC COMMENT MANAGEMENT & BIKESHED AUDIT'));

  // Part 4 – Migration Strategy & Safeguards
  assert.ok(ssD29.parts[3].title.includes('Migration') || ssD29.parts[3].title.includes('Rollout'));
  assert.ok(ssD29.parts[3].output.includes('MIGRATION SAFEGUARDS & ZERO-DOWNTIME ROLLOUT AUDIT'));

  // Part 5 – Master RFC Lifecycle Suite
  assert.ok(ssD29.parts[4].title.includes('Master') || ssD29.parts[4].title.includes('RFC'));
  assert.ok(ssD29.parts[4].output.includes('MASTER TECHNICAL RFC LIFECYCLE EVALUATION'));
});

test('Soft Skills Day 30: Resolution & Structural Invariants for Milestone 4 Grand Capstone & Sovereign Leadership', () => {
  const ssD30 = getLongLesson('soft-skills', 30);
  assert.ok(ssD30, 'soft-skills Day 30 long lesson must resolve');
  assert.equal(ssD30.day, 30);
  assert.equal(ssD30.parts.length, 5, 'soft-skills Day 30 must contain exactly 5 parts');
  assert.ok(ssD30.summary.length >= 4, 'soft-skills Day 30 must contain comprehensive summary');
  assert.ok(ssD30.projectStep, 'soft-skills Day 30 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD30);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD30.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 30: Domain-Specific Content Assertions', () => {
  const ssD30 = getLongLesson('soft-skills', 30);
  assert.ok(ssD30);

  // Part 1 – Milestone 4 Competency Matrix
  assert.ok(ssD30.parts[0].title.includes('Competency Matrix') || ssD30.parts[0].title.includes('360-Degree'));
  assert.ok(ssD30.parts[0].output.includes('MILESTONE 4: ADVANCED LEADERSHIP & CAREER CAPSTONE MATRIX'));

  // Part 2 – Executive Interview Loop Simulator
  assert.ok(ssD30.parts[1].title.includes('Executive Interview') || ssD30.parts[1].title.includes('Loop'));
  assert.ok(ssD30.parts[1].output.includes('EXECUTIVE INTERVIEW LOOP EVALUATION'));

  // Part 3 – Cross-Functional Influence & RFC Governance Gateway
  assert.ok(ssD30.parts[2].title.includes('Influence') || ssD30.parts[2].title.includes('Governance'));
  assert.ok(ssD30.parts[2].output.includes('CROSS-FUNCTIONAL INFLUENCE & RFC GOVERNANCE GATEWAY'));

  // Part 4 – Sovereign Offer Gateway
  assert.ok(ssD30.parts[3].title.includes('Offer Optimization') || ssD30.parts[3].title.includes('Total Compensation'));
  assert.ok(ssD30.parts[3].output.includes('OFFER OPTIMIZATION & TOTAL COMPENSATION SOVEREIGN GATEWAY'));

  // Part 5 – Grand Career OS Capstone Certification
  assert.ok(ssD30.parts[4].title.includes('Capstone Certification') || ssD30.parts[4].title.includes('Sovereign Technical Leader'));
  assert.ok(ssD30.parts[4].output.includes('GRAND CAREER OS CAPSTONE CERTIFICATION'));
});
"""

target_file = 'tests/java_softskills_long_lessons.test.ts'
with open(target_file, 'a', encoding='utf-8') as f:
    f.write(test_code)

print(f"Appended Batch 5 tests (Days 26-30) to {target_file}")
