import sys

test_code = """
test('Soft Skills Day 16: Resolution & Structural Invariants for Tech Resume Engineering & Google X-Y-Z', () => {
  const ssD16 = getLongLesson('soft-skills', 16);
  assert.ok(ssD16, 'soft-skills Day 16 long lesson must resolve');
  assert.equal(ssD16.day, 16);
  assert.equal(ssD16.parts.length, 5, 'soft-skills Day 16 must contain exactly 5 parts');
  assert.ok(ssD16.summary.length >= 4, 'soft-skills Day 16 must contain comprehensive summary');
  assert.ok(ssD16.projectStep, 'soft-skills Day 16 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD16);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD16.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 16: Domain-Specific Content Assertions', () => {
  const ssD16 = getLongLesson('soft-skills', 16);
  assert.ok(ssD16);

  // Part 1 – ATS Parser & 6-Second Screen
  assert.ok(ssD16.parts[0].title.includes('ATS') || ssD16.parts[0].title.includes('6-Second'));
  assert.ok(ssD16.parts[0].output.includes('ATS PARSER') || ssD16.parts[0].output.includes('6-SECOND'));

  // Part 2 – Google X-Y-Z Formula
  assert.ok(ssD16.parts[1].title.includes('X-Y-Z') || ssD16.parts[1].title.includes('Google'));
  assert.ok(ssD16.parts[1].output.includes('GOOGLE X-Y-Z'));

  // Part 3 – Active Verbs vs Weak Buzzwords
  assert.ok(ssD16.parts[2].title.includes('Action Verbs') || ssD16.parts[2].title.includes('Passive'));
  assert.ok(ssD16.parts[2].output.includes('ACTION VERB'));

  // Part 4 – Engineering Scale Quantification
  assert.ok(ssD16.parts[3].title.includes('Scale') || ssD16.parts[3].title.includes('Metrics'));
  assert.ok(ssD16.parts[3].output.includes('ENGINEERING SCALE'));

  // Part 5 – Master Technical Resume Audit Suite
  assert.ok(ssD16.parts[4].title.includes('Master Technical Resume') || ssD16.parts[4].title.includes('Auditor'));
  assert.ok(ssD16.parts[4].output.includes('MASTER TECHNICAL RESUME'));
});

test('Soft Skills Day 17: Resolution & Structural Invariants for LinkedIn Optimization & Personal Branding', () => {
  const ssD17 = getLongLesson('soft-skills', 17);
  assert.ok(ssD17, 'soft-skills Day 17 long lesson must resolve');
  assert.equal(ssD17.day, 17);
  assert.equal(ssD17.parts.length, 5, 'soft-skills Day 17 must contain exactly 5 parts');
  assert.ok(ssD17.summary.length >= 4, 'soft-skills Day 17 must contain comprehensive summary');
  assert.ok(ssD17.projectStep, 'soft-skills Day 17 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD17);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD17.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 17: Domain-Specific Content Assertions', () => {
  const ssD17 = getLongLesson('soft-skills', 17);
  assert.ok(ssD17);

  // Part 1 – Recruiter Search & Boolean Algorithms
  assert.ok(ssD17.parts[0].title.includes('Recruiter Search') || ssD17.parts[0].title.includes('Boolean'));
  assert.ok(ssD17.parts[0].output.includes('RECRUITER BOOLEAN SEARCH'));

  // Part 2 – 3-Part Technical Headline
  assert.ok(ssD17.parts[1].title.includes('Headline') || ssD17.parts[1].title.includes('Role | Core Stack'));
  assert.ok(ssD17.parts[1].output.includes('LINKEDIN TECHNICAL HEADLINE'));

  // Part 3 – About Section Narrative Arc
  assert.ok(ssD17.parts[2].title.includes('About') || ssD17.parts[2].title.includes('Narrative Arc'));
  assert.ok(ssD17.parts[2].output.includes('LINKEDIN ABOUT SECTION'));

  // Part 4 – Showcasing Proof-of-Work & GitHub
  assert.ok(ssD17.parts[3].title.includes('Proof-of-Work') || ssD17.parts[3].title.includes('GitHub'));
  assert.ok(ssD17.parts[3].output.includes('LINKEDIN FEATURED SECTION'));

  // Part 5 – Master LinkedIn Profile & Personal Brand Suite
  assert.ok(ssD17.parts[4].title.includes('Master LinkedIn Profile') || ssD17.parts[4].title.includes('Magnet'));
  assert.ok(ssD17.parts[4].output.includes('MASTER LINKEDIN PROFILE'));
});

test('Soft Skills Day 18: Resolution & Structural Invariants for Behavioral Interview Framework & STAR Method', () => {
  const ssD18 = getLongLesson('soft-skills', 18);
  assert.ok(ssD18, 'soft-skills Day 18 long lesson must resolve');
  assert.equal(ssD18.day, 18);
  assert.equal(ssD18.parts.length, 5, 'soft-skills Day 18 must contain exactly 5 parts');
  assert.ok(ssD18.summary.length >= 4, 'soft-skills Day 18 must contain comprehensive summary');
  assert.ok(ssD18.projectStep, 'soft-skills Day 18 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD18);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD18.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 18: Domain-Specific Content Assertions', () => {
  const ssD18 = getLongLesson('soft-skills', 18);
  assert.ok(ssD18);

  // Part 1 – Psychology of Tech Behavioral Interviews
  assert.ok(ssD18.parts[0].title.includes('Psychology') || ssD18.parts[0].title.includes('Behavioral'));
  assert.ok(ssD18.parts[0].output.includes('BEHAVIORAL COMPETENCY RUBRIC EVALUATION'));

  // Part 2 – STAR Method Deconstructed
  assert.ok(ssD18.parts[1].title.includes('STAR Method') || ssD18.parts[1].title.includes('Deconstructed'));
  assert.ok(ssD18.parts[1].output.includes('STAR FRAMEWORK STRUCTURAL AUDIT'));

  // Part 3 – 60/40 Pacing Invariant
  assert.ok(ssD18.parts[2].title.includes('Pacing') || ssD18.parts[2].title.includes('Context Trap'));
  assert.ok(ssD18.parts[2].output.includes('STAR PACING & TIME ALLOCATION AUDIT'));

  // Part 4 – First-Person Ownership
  assert.ok(ssD18.parts[3].title.includes('First-Person') || ssD18.parts[3].title.includes('Ownership'));
  assert.ok(ssD18.parts[3].output.includes('FIRST-PERSON OWNERSHIP & AGENCY EVALUATION'));

  // Part 5 – Master STAR Behavioral Interview Suite
  assert.ok(ssD18.parts[4].title.includes('Master STAR') || ssD18.parts[4].title.includes('Scoring Engine'));
  assert.ok(ssD18.parts[4].output.includes('MASTER STAR BEHAVIORAL INTERVIEW SCORECARD'));
});

test('Soft Skills Day 19: Resolution & Structural Invariants for Answering Tell Me About Yourself', () => {
  const ssD19 = getLongLesson('soft-skills', 19);
  assert.ok(ssD19, 'soft-skills Day 19 long lesson must resolve');
  assert.equal(ssD19.day, 19);
  assert.equal(ssD19.parts.length, 5, 'soft-skills Day 19 must contain exactly 5 parts');
  assert.ok(ssD19.summary.length >= 4, 'soft-skills Day 19 must contain comprehensive summary');
  assert.ok(ssD19.projectStep, 'soft-skills Day 19 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD19);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD19.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 19: Domain-Specific Content Assertions', () => {
  const ssD19 = getLongLesson('soft-skills', 19);
  assert.ok(ssD19);

  // Part 1 – Opening Screen Impression
  assert.ok(ssD19.parts[0].title.includes('Opening Screen') || ssD19.parts[0].title.includes('Makes or Breaks'));
  assert.ok(ssD19.parts[0].output.includes('OPENING SCREEN IMPRESSION AUDIT'));

  // Part 2 – 3-Act Narrative Arc
  assert.ok(ssD19.parts[1].title.includes('3-Act') || ssD19.parts[1].title.includes('Present, Past'));
  assert.ok(ssD19.parts[1].output.includes('3-ACT ELEVATOR PITCH NARRATIVE AUDIT'));

  // Part 3 – Crucible Project Teaser
  assert.ok(ssD19.parts[2].title.includes('Crucible') || ssD19.parts[2].title.includes('Technical Depth'));
  assert.ok(ssD19.parts[2].output.includes('CRUCIBLE HOOK & TECHNICAL BAIT AUDIT'));

  // Part 4 – 90-Second Stopwatch & Conversational Pass-Back
  assert.ok(ssD19.parts[3].title.includes('Stopwatch') || ssD19.parts[3].title.includes('Pass-Back'));
  assert.ok(ssD19.parts[3].output.includes('PITCH PACING & CONVERSATIONAL PASS-BACK AUDIT'));

  // Part 5 – Master Elevator Pitch Engine
  assert.ok(ssD19.parts[4].title.includes('Master Elevator Pitch') || ssD19.parts[4].title.includes('Synthesis'));
  assert.ok(ssD19.parts[4].output.includes('MASTER ELEVATOR PITCH EVALUATION SCORECARD'));
});

test('Soft Skills Day 20: Resolution & Structural Invariants for Tackling Failure Questions & Blameless Postmortems', () => {
  const ssD20 = getLongLesson('soft-skills', 20);
  assert.ok(ssD20, 'soft-skills Day 20 long lesson must resolve');
  assert.equal(ssD20.day, 20);
  assert.equal(ssD20.parts.length, 5, 'soft-skills Day 20 must contain exactly 5 parts');
  assert.ok(ssD20.summary.length >= 4, 'soft-skills Day 20 must contain comprehensive summary');
  assert.ok(ssD20.projectStep, 'soft-skills Day 20 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD20);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD20.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 20: Domain-Specific Content Assertions', () => {
  const ssD20 = getLongLesson('soft-skills', 20);
  assert.ok(ssD20);

  // Part 1 – Psychology of the Failure Question
  assert.ok(ssD20.parts[0].title.includes('Psychology') || ssD20.parts[0].title.includes('Failure Question'));
  assert.ok(ssD20.parts[0].output.includes('FAILURE STORY SCREENING & RUBRIC AUDIT'));

  // Part 2 – Blameless Postmortem Mindset
  assert.ok(ssD20.parts[1].title.includes('Blameless Postmortem') || ssD20.parts[1].title.includes('SRE'));
  assert.ok(ssD20.parts[1].output.includes('BLAMELESS POSTMORTEM STRUCTURE AUDIT'));

  // Part 3 – Five Whys Root Cause Chain
  assert.ok(ssD20.parts[2].title.includes('Five Whys') || ssD20.parts[2].title.includes('Root Cause'));
  assert.ok(ssD20.parts[2].output.includes('FIVE WHYS ROOT CAUSE CHAIN AUDIT'));

  // Part 4 – Systemic Prevention Guardrails
  assert.ok(ssD20.parts[3].title.includes('Guardrails') || ssD20.parts[3].title.includes('Prevention'));
  assert.ok(ssD20.parts[3].output.includes('SYSTEMIC PREVENTION GUARDRAILS AUDIT'));

  // Part 5 – Master Blameless Postmortem Storytelling Suite
  assert.ok(ssD20.parts[4].title.includes('Master Blameless Postmortem') || ssD20.parts[4].title.includes('Suite'));
  assert.ok(ssD20.parts[4].output.includes('MASTER BLAMELESS POSTMORTEM EVALUATION'));
});
"""

target_file = 'tests/java_softskills_long_lessons.test.ts'
with open(target_file, 'r', encoding='utf-8') as f:
    existing = f.read()

# Check if Day 16 is already in test file
if "Soft Skills Day 16:" in existing:
    pos = existing.find("test('Soft Skills Day 16:")
    existing = existing[:pos].rstrip() + "\n"

updated = existing.rstrip() + "\n" + test_code.strip() + "\n"

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(updated)

print("Successfully updated Days 16-20 tests in tests/java_softskills_long_lessons.test.ts!")
