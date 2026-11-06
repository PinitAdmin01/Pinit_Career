import sys

test_code = """
test('Soft Skills Day 21: Resolution & Structural Invariants for ⭐ MILESTONE 3: Complete Google X-Y-Z Resume, STAR Method & Failure Engine', () => {
  const ssD21 = getLongLesson('soft-skills', 21);
  assert.ok(ssD21, 'soft-skills Day 21 long lesson must resolve');
  assert.equal(ssD21.day, 21);
  assert.equal(ssD21.parts.length, 5, 'soft-skills Day 21 must contain exactly 5 parts');
  assert.ok(ssD21.summary.length >= 4, 'soft-skills Day 21 must contain comprehensive summary');
  assert.ok(ssD21.projectStep, 'soft-skills Day 21 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD21);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD21.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 21: Domain-Specific Content Assertions & Milestone 3 Certification', () => {
  const ssD21 = getLongLesson('soft-skills', 21);
  assert.ok(ssD21);

  // Part 1 – Milestone 3 Competency Architecture
  assert.ok(ssD21.parts[0].title.includes('Milestone 3') || ssD21.parts[0].title.includes('Competency'));
  assert.ok(ssD21.parts[0].output.includes('MILESTONE 3 CAPSTONE: COMPETENCY MATRIX AUDIT'));

  // Part 2 – Inbound / Outbound Lead Gateway
  assert.ok(ssD21.parts[1].title.includes('Inbound') || ssD21.parts[1].title.includes('Lead Generation'));
  assert.ok(ssD21.parts[1].output.includes('INBOUND / OUTBOUND TECH TALENT FUNNEL AUDIT'));

  // Part 3 – STAR & Technical Depth Simulation
  assert.ok(ssD21.parts[2].title.includes('STAR') || ssD21.parts[2].title.includes('Pacing'));
  assert.ok(ssD21.parts[2].output.includes('BEHAVIORAL STAR PACING & DEPTH AUDIT'));

  // Part 4 – Pitch & Postmortem
  assert.ok(ssD21.parts[3].title.includes('Elevator Pitch') || ssD21.parts[3].title.includes('Postmortem'));
  assert.ok(ssD21.parts[3].output.includes('PITCH & POSTMORTEM CALIBRATION AUDIT'));

  // Part 5 – Sovereign Tech Career Engine
  assert.ok(ssD21.parts[4].title.includes('Sovereign') || ssD21.parts[4].title.includes('Certification'));
  assert.ok(ssD21.parts[4].output.includes('MASTER TECH CAREER CAPSTONE CERTIFICATION'));
});

test('Soft Skills Day 22: Resolution & Structural Invariants for High-Signal Reverse Interviewing', () => {
  const ssD22 = getLongLesson('soft-skills', 22);
  assert.ok(ssD22, 'soft-skills Day 22 long lesson must resolve');
  assert.equal(ssD22.day, 22);
  assert.equal(ssD22.parts.length, 5, 'soft-skills Day 22 must contain exactly 5 parts');
  assert.ok(ssD22.summary.length >= 4, 'soft-skills Day 22 must contain comprehensive summary');
  assert.ok(ssD22.projectStep, 'soft-skills Day 22 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD22);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD22.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 22: Domain-Specific Content Assertions', () => {
  const ssD22 = getLongLesson('soft-skills', 22);
  assert.ok(ssD22);

  // Part 1 – Reverse Question Signal Classifier
  assert.ok(ssD22.parts[0].title.includes('Reverse Interview Paradox') || ssD22.parts[0].title.includes('Audition'));
  assert.ok(ssD22.parts[0].output.includes('REVERSE INTERVIEW QUESTION SIGNAL AUDIT'));

  // Part 2 – 4 Pillars of High-Signal Inquiry
  assert.ok(ssD22.parts[1].title.includes('4 Pillars') || ssD22.parts[1].title.includes('Pillars'));
  assert.ok(ssD22.parts[1].output.includes('4-PILLARS REVERSE INQUIRY AUDIT'));

  // Part 3 – Diagnosing Culture Red Flags
  assert.ok(ssD22.parts[2].title.includes('Red Flags') || ssD22.parts[2].title.includes('Burnout'));
  assert.ok(ssD22.parts[2].output.includes('ENGINEERING CULTURE RED FLAG AUDIT'));

  // Part 4 – Role-Tailored Inquiries
  assert.ok(ssD22.parts[3].title.includes('Role-Tailored') || ssD22.parts[3].title.includes('Recruiter vs'));
  assert.ok(ssD22.parts[3].output.includes('INTERVIEWER PERSONA QUESTION TARGETING AUDIT'));

  // Part 5 – Master Reverse Interviewing Simulator
  assert.ok(ssD22.parts[4].title.includes('Master Reverse Interviewing') || ssD22.parts[4].title.includes('Simulator'));
  assert.ok(ssD22.parts[4].output.includes('MASTER REVERSE INTERVIEWING EVALUATION'));
});

test('Soft Skills Day 23: Resolution & Structural Invariants for Live Coding Communication & Think-Aloud Protocols', () => {
  const ssD23 = getLongLesson('soft-skills', 23);
  assert.ok(ssD23, 'soft-skills Day 23 long lesson must resolve');
  assert.equal(ssD23.day, 23);
  assert.equal(ssD23.parts.length, 5, 'soft-skills Day 23 must contain exactly 5 parts');
  assert.ok(ssD23.summary.length >= 4, 'soft-skills Day 23 must contain comprehensive summary');
  assert.ok(ssD23.projectStep, 'soft-skills Day 23 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD23);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD23.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 23: Domain-Specific Content Assertions', () => {
  const ssD23 = getLongLesson('soft-skills', 23);
  assert.ok(ssD23);

  // Part 1 – Think-Aloud Signpost Auditor
  assert.ok(ssD23.parts[0].title.includes('Psychology') || ssD23.parts[0].title.includes('Thought Process'));
  assert.ok(ssD23.parts[0].output.includes('THINK-ALOUD SIGNPOST AUDIT'));

  // Part 2 – 5-Step Clarification Protocol
  assert.ok(ssD23.parts[1].title.includes('5-Step') || ssD23.parts[1].title.includes('Clarification'));
  assert.ok(ssD23.parts[1].output.includes('5-STEP REQUIREMENT CLARIFICATION AUDIT'));

  // Part 3 – Cognitive Signposting Engine
  assert.ok(ssD23.parts[2].title.includes('Cognitive Signposting') || ssD23.parts[2].title.includes('Implementation'));
  assert.ok(ssD23.parts[2].output.includes('LIVE CODING COGNITIVE SIGNPOSTING AUDIT'));

  // Part 4 – Receptive Hint Handling
  assert.ok(ssD23.parts[3].title.includes('Hint Handling') || ssD23.parts[3].title.includes('Coachability'));
  assert.ok(ssD23.parts[3].output.includes('INTERVIEWER HINT RECEPTION AUDIT'));

  // Part 5 – Master Live Coding Communication Simulator
  assert.ok(ssD23.parts[4].title.includes('Master Live Coding') || ssD23.parts[4].title.includes('Simulator'));
  assert.ok(ssD23.parts[4].output.includes('MASTER LIVE CODING SCREEN EVALUATION'));
});

test('Soft Skills Day 24: Resolution & Structural Invariants for System Design Interview Communication & RADIO Framework', () => {
  const ssD24 = getLongLesson('soft-skills', 24);
  assert.ok(ssD24, 'soft-skills Day 24 long lesson must resolve');
  assert.equal(ssD24.day, 24);
  assert.equal(ssD24.parts.length, 5, 'soft-skills Day 24 must contain exactly 5 parts');
  assert.ok(ssD24.summary.length >= 4, 'soft-skills Day 24 must contain comprehensive summary');
  assert.ok(ssD24.projectStep, 'soft-skills Day 24 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD24);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD24.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 24: Domain-Specific Content Assertions', () => {
  const ssD24 = getLongLesson('soft-skills', 24);
  assert.ok(ssD24);

  // Part 1 – Anatomy of System Design Communication
  assert.ok(ssD24.parts[0].title.includes('Anatomy') || ssD24.parts[0].title.includes('Structured Dialogue'));
  assert.ok(ssD24.parts[0].output.includes('SYSTEM DESIGN COMMUNICATION AUDIT'));

  // Part 2 – RADIO Pillar R & A
  assert.ok(ssD24.parts[1].title.includes('RADIO Pillar R & A') || ssD24.parts[1].title.includes('Requirements'));
  assert.ok(ssD24.parts[1].output.includes('RADIO PILLAR R & A: REQUIREMENTS & HIGH-LEVEL ARCHITECTURE'));

  // Part 3 – RADIO Pillar D & I
  assert.ok(ssD24.parts[2].title.includes('RADIO Pillar D & I') || ssD24.parts[2].title.includes('Data Model'));
  assert.ok(ssD24.parts[2].output.includes('RADIO PILLAR D & I: DATA MODEL & API CONTRACTS'));

  // Part 4 – RADIO Pillar O
  assert.ok(ssD24.parts[3].title.includes('RADIO Pillar O') || ssD24.parts[3].title.includes('Optimization'));
  assert.ok(ssD24.parts[3].output.includes('RADIO PILLAR O: OPTIMIZATIONS & DEEP-DIVE RESILIENCE'));

  // Part 5 – Master RADIO System Design Suite
  assert.ok(ssD24.parts[4].title.includes('Master RADIO') || ssD24.parts[4].title.includes('Simulator'));
  assert.ok(ssD24.parts[4].output.includes('MASTER RADIO SYSTEM DESIGN EVALUATION'));
});

test('Soft Skills Day 25: Resolution & Structural Invariants for Salary Negotiation & Total Compensation Mechanics', () => {
  const ssD25 = getLongLesson('soft-skills', 25);
  assert.ok(ssD25, 'soft-skills Day 25 long lesson must resolve');
  assert.equal(ssD25.day, 25);
  assert.equal(ssD25.parts.length, 5, 'soft-skills Day 25 must contain exactly 5 parts');
  assert.ok(ssD25.summary.length >= 4, 'soft-skills Day 25 must contain comprehensive summary');
  assert.ok(ssD25.projectStep, 'soft-skills Day 25 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD25);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD25.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 25: Domain-Specific Content Assertions', () => {
  const ssD25 = getLongLesson('soft-skills', 25);
  assert.ok(ssD25);

  // Part 1 – Total Compensation Model
  assert.ok(ssD25.parts[0].title.includes('Total Compensation') || ssD25.parts[0].title.includes('TC'));
  assert.ok(ssD25.parts[0].output.includes('TOTAL COMPENSATION (TC) ANALYSIS'));

  // Part 2 – Equity Mechanics Demystified
  assert.ok(ssD25.parts[1].title.includes('Equity Mechanics') || ssD25.parts[1].title.includes('RSUs'));
  assert.ok(ssD25.parts[1].output.includes('EQUITY MECHANICS & VESTING SIMULATION'));

  // Part 3 – Salary Anchor Deflection
  assert.ok(ssD25.parts[2].title.includes('Information Asymmetry') || ssD25.parts[2].title.includes('Deflection'));
  assert.ok(ssD25.parts[2].output.includes('SALARY ANCHOR DEFLECTION AUDIT'));

  // Part 4 – Counter-Offer Protocol
  assert.ok(ssD25.parts[3].title.includes('Counter-Offer') || ssD25.parts[3].title.includes('Protocol'));
  assert.ok(ssD25.parts[3].output.includes('COUNTER-OFFER PROTOCOL & SCRIPT AUDIT'));

  // Part 5 – Master Compensation Negotiation Suite
  assert.ok(ssD25.parts[4].title.includes('Master Compensation') || ssD25.parts[4].title.includes('Optimization'));
  assert.ok(ssD25.parts[4].output.includes('MASTER COMPENSATION NEGOTIATION EVALUATION'));
});
"""

target_file = 'tests/java_softskills_long_lessons.test.ts'
with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 21 is already in test file
if 'Soft Skills Day 21:' in content:
    idx = content.find("test('Soft Skills Day 21:")
    content = content[:idx].rstrip() + "\n"

content += test_code

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully appended Days 21-25 tests to " + target_file)
