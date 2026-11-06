import os

test_code = """
test('Soft Skills Day 11: Resolution & Structural Invariants for Executive Presence & SCR Framework', () => {
  const ssD11 = getLongLesson('soft-skills', 11);
  assert.ok(ssD11, 'soft-skills Day 11 long lesson must resolve');
  assert.equal(ssD11.day, 11);
  assert.equal(ssD11.parts.length, 5, 'soft-skills Day 11 must contain exactly 5 parts');
  assert.ok(ssD11.summary.length >= 4, 'soft-skills Day 11 must contain comprehensive summary');
  assert.ok(ssD11.projectStep, 'soft-skills Day 11 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD11);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD11.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 11: Domain-Specific Content Assertions', () => {
  const ssD11 = getLongLesson('soft-skills', 11);
  assert.ok(ssD11);

  // Part 1 – The Psychology of Delivering Bad News
  assert.ok(ssD11.parts[0].title.includes('Delivering Bad News') || ssD11.parts[0].title.includes('Concealment'));
  assert.ok(ssD11.parts[0].output.includes('INCIDENT ESCALATION & CONCEALMENT AUDIT'));

  // Part 2 – The SCR Communication Framework
  assert.ok(ssD11.parts[1].title.includes('SCR') || ssD11.parts[1].title.includes('Situation'));
  assert.ok(ssD11.parts[1].output.includes('SCR EXECUTIVE CRISIS BRIEF AUDIT'));

  // Part 3 – Root Cause Attribution without Blame
  assert.ok(ssD11.parts[2].title.includes('Blame') || ssD11.parts[2].title.includes('Root Cause'));
  assert.ok(ssD11.parts[2].output.includes('BLAMELESS POST-MORTEM & SYSTEMIC AUDIT'));

  // Part 4 – Actionable Remediation Commitments
  assert.ok(ssD11.parts[3].title.includes('Remediation') || ssD11.parts[3].title.includes('SMART-E'));
  assert.ok(ssD11.parts[3].output.includes('REMEDIATION COMMITMENT GOVERNANCE AUDIT'));

  // Part 5 – Master Incident & Crisis Communication Suite
  assert.ok(ssD11.parts[4].title.includes('Master Incident') || ssD11.parts[4].title.includes('Executive Trust'));
  assert.ok(ssD11.parts[4].output.includes('MASTER CRISIS LEADERSHIP & TRUST CERTIFICATION'));
});

test('Soft Skills Day 12: Resolution & Structural Invariants for Negotiation & ZOPA/BATNA', () => {
  const ssD12 = getLongLesson('soft-skills', 12);
  assert.ok(ssD12, 'soft-skills Day 12 long lesson must resolve');
  assert.equal(ssD12.day, 12);
  assert.equal(ssD12.parts.length, 5, 'soft-skills Day 12 must contain exactly 5 parts');
  assert.ok(ssD12.summary.length >= 4, 'soft-skills Day 12 must contain comprehensive summary');
  assert.ok(ssD12.projectStep, 'soft-skills Day 12 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD12);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD12.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 12: Domain-Specific Content Assertions', () => {
  const ssD12 = getLongLesson('soft-skills', 12);
  assert.ok(ssD12);

  // Part 1 – Harvard Principled Negotiation
  assert.ok(ssD12.parts[0].title.includes('Principled Negotiation') || ssD12.parts[0].title.includes('Separating People'));
  assert.ok(ssD12.parts[0].output.includes('HARVARD PRINCIPLED NEGOTIATION AUDIT'));

  // Part 2 – Mathematical Mechanics of ZOPA
  assert.ok(ssD12.parts[1].title.includes('ZOPA'));
  assert.ok(ssD12.parts[1].output.includes('ZOPA TIMELINE OVERLAP EVALUATION'));

  // Part 3 – Engineering BATNA
  assert.ok(ssD12.parts[2].title.includes('BATNA'));
  assert.ok(ssD12.parts[2].output.includes('ENGINEERING BATNA & LEVERAGE AUDIT'));

  // Part 4 – Iron Triangle & Anchoring Bias
  assert.ok(ssD12.parts[3].title.includes('Iron Triangle') || ssD12.parts[3].title.includes('Anchoring'));
  assert.ok(ssD12.parts[3].output.includes('IRON TRIANGLE & ANCHORING BIAS AUDIT'));

  // Part 5 – Master Engineering Persuasion Suite
  assert.ok(ssD12.parts[4].title.includes('Master Engineering Persuasion') || ssD12.parts[4].title.includes('Negotiation Orchestrator'));
  assert.ok(ssD12.parts[4].output.includes('MASTER ENGINEERING PERSUASION ORCHESTRATION'));
});

test('Soft Skills Day 13: Resolution & Structural Invariants for Maker Schedule & Deep Work', () => {
  const ssD13 = getLongLesson('soft-skills', 13);
  assert.ok(ssD13, 'soft-skills Day 13 long lesson must resolve');
  assert.equal(ssD13.day, 13);
  assert.equal(ssD13.parts.length, 5, 'soft-skills Day 13 must contain exactly 5 parts');
  assert.ok(ssD13.summary.length >= 4, 'soft-skills Day 13 must contain comprehensive summary');
  assert.ok(ssD13.projectStep, 'soft-skills Day 13 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD13);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD13.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 13: Domain-Specific Content Assertions', () => {
  const ssD13 = getLongLesson('soft-skills', 13);
  assert.ok(ssD13);

  // Part 1 – Attention Residue & Context Switching
  assert.ok(ssD13.parts[0].title.includes('Attention Residue') || ssD13.parts[0].title.includes('Context Switching'));
  assert.ok(ssD13.parts[0].output.includes('CONTEXT SWITCHING OVERHEAD & ATTENTION RESIDUE AUDIT'));

  // Part 2 – Maker's Schedule vs Manager's Schedule
  assert.ok(ssD13.parts[1].title.includes('Maker') || ssD13.parts[1].title.includes('Manager'));
  assert.ok(ssD13.parts[1].output.includes('MAKER\'S SCHEDULE AUDIT'));

  // Part 3 – The Positive 'No' Framework
  assert.ok(ssD13.parts[2].title.includes('Positive') || ssD13.parts[2].title.includes('No'));
  assert.ok(ssD13.parts[2].output.includes('WILLIAM URY POSITIVE \'NO\' BOUNDARY AUDIT'));

  // Part 4 – Asynchronous Communication Batching
  assert.ok(ssD13.parts[3].title.includes('Asynchronous') || ssD13.parts[3].title.includes('Batching'));
  assert.ok(ssD13.parts[3].output.includes('ASYNCHRONOUS NOTIFICATION BATCHING SIMULATION'));

  // Part 5 – Master Engineering Focus & Schedule Auditor
  assert.ok(ssD13.parts[4].title.includes('Master Engineering Focus') || ssD13.parts[4].title.includes('Deep Work'));
  assert.ok(ssD13.parts[4].output.includes('MASTER ENGINEERING DEEP WORK & COGNITIVE AUDIT'));
});

test('Soft Skills Day 14: Resolution & Structural Invariants for Psychological Safety & Burnout Prevention', () => {
  const ssD14 = getLongLesson('soft-skills', 14);
  assert.ok(ssD14, 'soft-skills Day 14 long lesson must resolve');
  assert.equal(ssD14.day, 14);
  assert.equal(ssD14.parts.length, 5, 'soft-skills Day 14 must contain exactly 5 parts');
  assert.ok(ssD14.summary.length >= 4, 'soft-skills Day 14 must contain comprehensive summary');
  assert.ok(ssD14.projectStep, 'soft-skills Day 14 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD14);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD14.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 14: Domain-Specific Content Assertions', () => {
  const ssD14 = getLongLesson('soft-skills', 14);
  assert.ok(ssD14);

  // Part 1 – Amy Edmondson's 7 Dimensions & Project Aristotle
  assert.ok(ssD14.parts[0].title.includes('Amy Edmondson') || ssD14.parts[0].title.includes('Aristotle'));
  assert.ok(ssD14.parts[0].output.includes('AMY EDMONDSON PSYCHOLOGICAL SAFETY AUDIT'));

  // Part 2 – Deconstructing Imposter Syndrome & Brag Document
  assert.ok(ssD14.parts[1].title.includes('Imposter') || ssD14.parts[1].title.includes('Brag Document'));
  assert.ok(ssD14.parts[1].output.includes('IMPOSTER SYNDROME DECONSTRUCTION AUDIT'));

  // Part 3 – Physiology & Stages of Burnout
  assert.ok(ssD14.parts[2].title.includes('Burnout') || ssD14.parts[2].title.includes('Maslach'));
  assert.ok(ssD14.parts[2].output.includes('MASLACH BURNOUT INVENTORY (MBI) DIAGNOSTIC'));

  // Part 4 – Growth Mindset & Cognitive Reframing
  assert.ok(ssD14.parts[3].title.includes('Growth Mindset') || ssD14.parts[3].title.includes('Cognitive Reframing'));
  assert.ok(ssD14.parts[3].output.includes('COGNITIVE GROWTH MINDSET REFRAMING AUDIT'));

  // Part 5 – Master Engineering Well-Being & Resilience Suite
  assert.ok(ssD14.parts[4].title.includes('Master Engineering Well-Being') || ssD14.parts[4].title.includes('Resilience'));
  assert.ok(ssD14.parts[4].output.includes('MASTER ENGINEERING WELL-BEING & RESILIENCE CERTIFICATION'));
});

test('Soft Skills Day 15: Resolution & Structural Invariants for Milestone 2 Technical Leadership Engine', () => {
  const ssD15 = getLongLesson('soft-skills', 15);
  assert.ok(ssD15, 'soft-skills Day 15 long lesson must resolve');
  assert.equal(ssD15.day, 15);
  assert.equal(ssD15.parts.length, 5, 'soft-skills Day 15 must contain exactly 5 parts');
  assert.ok(ssD15.summary.length >= 4, 'soft-skills Day 15 must contain comprehensive summary');
  assert.ok(ssD15.projectStep, 'soft-skills Day 15 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD15);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD15.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 15: Domain-Specific Content Assertions', () => {
  const ssD15 = getLongLesson('soft-skills', 15);
  assert.ok(ssD15);

  // Part 1 – Integrated Technical Leadership Pipeline
  assert.ok(ssD15.parts[0].title.includes('Leadership Pipeline') || ssD15.parts[0].title.includes('Synthesis'));
  assert.ok(ssD15.parts[0].output.includes('LEADERSHIP COMPETENCY MATRIX AUDIT'));

  // Part 2 – Cross-Functional Business Value Translation & ROI
  assert.ok(ssD15.parts[1].title.includes('Cross-Functional') || ssD15.parts[1].title.includes('ELI5'));
  assert.ok(ssD15.parts[1].output.includes('CROSS-FUNCTIONAL TRANSLATION GATEWAY AUDIT'));

  // Part 3 – High-Trust Feedback & Conflict De-escalation
  assert.ok(ssD15.parts[2].title.includes('SBI') || ssD15.parts[2].title.includes('IBR') || ssD15.parts[2].title.includes('Feedback'));
  assert.ok(ssD15.parts[2].output.includes('SBI & IBR HIGH-TRUST MEDIATION GATEWAY AUDIT'));

  // Part 4 – Executive Crisis Communication & Strategic Storytelling
  assert.ok(ssD15.parts[3].title.includes('SCR') || ssD15.parts[3].title.includes('Crisis') || ssD15.parts[3].title.includes('Storytelling'));
  assert.ok(ssD15.parts[3].output.includes('SCR EXECUTIVE CRISIS COMMUNICATION GATEWAY AUDIT'));

  // Part 5 – Sovereign Technical Leadership Certification Gateway
  assert.ok(ssD15.parts[4].title.includes('Sovereign Technical Leadership') || ssD15.parts[4].title.includes('Certification Gateway'));
  assert.ok(ssD15.parts[4].output.includes('MILESTONE 2: SOVEREIGN TECH LEADERSHIP MASTER GATEWAY'));
});
"""

target_path = 'tests/java_softskills_long_lessons.test.ts'
with open(target_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Check if Day 11 test is already present; if so, remove from Day 11 onwards
pos = content.find("test('Soft Skills Day 11:")
if pos != -1:
    content = content[:pos].rstrip() + "\\n\\n"
else:
    content = content.rstrip() + "\\n\\n"

content += test_code.strip() + "\\n"

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully appended Days 11-15 test blocks to " + target_path)
