import os
import sys

test_file = "tests/java_softskills_long_lessons.test.ts"

tests_to_append = """
test('Soft Skills Day 6: Resolution & Structural Invariants for Cross-Functional Alignment & ELI5', () => {
  const ssD6 = getLongLesson('soft-skills', 6);
  assert.ok(ssD6, 'soft-skills Day 6 long lesson must resolve');
  assert.equal(ssD6.day, 6);
  assert.equal(ssD6.parts.length, 5, 'soft-skills Day 6 must contain exactly 5 parts');
  assert.ok(ssD6.summary.length >= 4, 'soft-skills Day 6 must contain comprehensive summary');
  assert.ok(ssD6.projectStep, 'soft-skills Day 6 must have a hands-on project step');
  assert.ok(ssD6.minutes >= 15, 'soft-skills Day 6 must be at least 15 minutes');

  const spokenMin = estimateSpokenMinutes(ssD6);
  const totalMin = estimateLessonMinutes(ssD6);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);
  assert.ok(totalMin >= 25, `Total minutes should be >= 25 (got ${totalMin})`);

  for (const part of ssD6.parts) {
    assert.ok(part.code, `Part '${part.title}' must contain executable code`);
    assert.ok(part.output, `Part '${part.title}' must declare expected terminal output`);
    assert.ok(part.say.length >= 3, `Part '${part.title}' must provide deep pedagogical exposition`);
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);

    assert.ok(part.check.question.length > 10, 'MCQ check question must be descriptive');
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 6: Domain-Specific Content Assertions', () => {
  const ssD6 = getLongLesson('soft-skills', 6);
  assert.ok(ssD6);

  // Part 1 – Curse of Knowledge & Jargon Density
  assert.ok(ssD6.parts[0].title.includes('Curse of Knowledge') || ssD6.parts[0].title.includes('Jargon'));
  assert.ok(ssD6.parts[0].output.includes('Readability Assessment: HIGH_COGNITIVE_OVERLOAD') || ssD6.parts[0].output.includes('Jargon Density'));

  // Part 2 – ELI5 Framework & Analogy Pairing
  assert.ok(ssD6.parts[1].title.includes('ELI5') || ssD6.parts[1].title.includes('Analogy'));
  assert.ok(ssD6.parts[1].output.includes('Analogy Pairing Matrix') || ssD6.parts[1].output.includes('ELI5 Principle'));

  // Part 3 – Executive Business Metrics (Revenue, Latency, Churn)
  assert.ok(ssD6.parts[2].title.includes('Executive Business Metrics') || ssD6.parts[2].title.includes('ROI'));
  assert.ok(ssD6.parts[2].output.includes('Annualized Downtime Risk') || ssD6.parts[2].output.includes('Executive ROI Valuation'));

  // Part 4 – Project Management Iron Triangle
  assert.ok(ssD6.parts[3].title.includes('Iron Triangle') || ssD6.parts[3].title.includes('Scope'));
  assert.ok(ssD6.parts[3].output.includes('IRON TRIANGLE BALANCED') || ssD6.parts[3].output.includes('Feasible: true'));

  // Part 5 – Master Cross-Functional Alignment Suite
  assert.ok(ssD6.parts[4].title.includes('Master Alignment Suite') || ssD6.parts[4].title.includes('Cross-Functional'));
  assert.ok(ssD6.parts[4].output.includes('MASTER CROSS-FUNCTIONAL ALIGNMENT DOSSIER') || ssD6.parts[4].output.includes('CERTIFIED_CROSS_FUNCTIONAL_PARTNER'));
});

test('Soft Skills Day 7: Resolution & Structural Invariants for SBI Feedback & Code Reviews', () => {
  const ssD7 = getLongLesson('soft-skills', 7);
  assert.ok(ssD7, 'soft-skills Day 7 long lesson must resolve');
  assert.equal(ssD7.day, 7);
  assert.equal(ssD7.parts.length, 5, 'soft-skills Day 7 must contain exactly 5 parts');
  assert.ok(ssD7.summary.length >= 4, 'soft-skills Day 7 must contain comprehensive summary');
  assert.ok(ssD7.projectStep, 'soft-skills Day 7 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD7);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD7.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 7: Domain-Specific Content Assertions', () => {
  const ssD7 = getLongLesson('soft-skills', 7);
  assert.ok(ssD7);

  // Part 1 – Code Review Psychology & Accusatory Framing
  assert.ok(ssD7.parts[0].title.includes('Psychology of Code Reviews') || ssD7.parts[0].title.includes('Accusatory'));
  assert.ok(ssD7.parts[0].output.includes('CODE REVIEW PSYCHOLOGY AUDIT') || ssD7.parts[0].output.includes('TOXIC_DEFENSIVE'));

  // Part 2 – The SBI Model (Situation, Behavior, Impact)
  assert.ok(ssD7.parts[1].title.includes('SBI') || ssD7.parts[1].title.includes('Situation-Behavior-Impact'));
  assert.ok(ssD7.parts[1].output.includes('SBI FEEDBACK PROTOCOL REPORT') || ssD7.parts[1].output.includes('ACTIONABLE_SYSTEMIC_REMEDY'));

  // Part 3 – Conventional Comments Standardization
  assert.ok(ssD7.parts[2].title.includes('Conventional Comments') || ssD7.parts[2].title.includes('Triage'));
  assert.ok(ssD7.parts[2].output.includes('CONVENTIONAL COMMENTS PARSER') || ssD7.parts[2].output.includes('Non-Blocking Ratio'));

  // Part 4 – 3-Comment Circuit Breaker & Disagree and Commit
  assert.ok(ssD7.parts[3].title.includes('Circuit Breaker') || ssD7.parts[3].title.includes('Disagree and Commit'));
  assert.ok(ssD7.parts[3].output.includes('CIRCUIT BREAKER SIMULATION') || ssD7.parts[3].output.includes('DISAGREE_AND_COMMIT'));

  // Part 5 – Master Feedback Suite & Psychological Safety
  assert.ok(ssD7.parts[4].title.includes('Master Constructive Feedback') || ssD7.parts[4].title.includes('High-Trust'));
  assert.ok(ssD7.parts[4].output.includes('MASTER CODE REVIEW & FEEDBACK DOSSIER') || ssD7.parts[4].output.includes('HIGH_TRUST_COLLABORATIVE_LEADER'));
});

test('Soft Skills Day 8: Resolution & Structural Invariants for Conflict Resolution & The IBR Approach', () => {
  const ssD8 = getLongLesson('soft-skills', 8);
  assert.ok(ssD8, 'soft-skills Day 8 long lesson must resolve');
  assert.equal(ssD8.day, 8);
  assert.equal(ssD8.parts.length, 5, 'soft-skills Day 8 must contain exactly 5 parts');
  assert.ok(ssD8.summary.length >= 4, 'soft-skills Day 8 must contain comprehensive summary');
  assert.ok(ssD8.projectStep, 'soft-skills Day 8 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD8);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD8.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 8: Domain-Specific Content Assertions', () => {
  const ssD8 = getLongLesson('soft-skills', 8);
  assert.ok(ssD8);

  // Part 1 – Conflict Taxonomy (Cognitive vs Affective)
  assert.ok(ssD8.parts[0].title.includes('Cognitive') || ssD8.parts[0].title.includes('Affective'));
  assert.ok(ssD8.parts[0].output.includes('TECHNICAL CONFLICT TAXONOMY AUDIT') || ssD8.parts[0].output.includes('TOXIC_AFFECTIVE'));

  // Part 2 – Interest-Based Relational (IBR) Framework
  assert.ok(ssD8.parts[1].title.includes('Interest-Based Relational') || ssD8.parts[1].title.includes('IBR'));
  assert.ok(ssD8.parts[1].output.includes('IBR CONFLICT DE-ESCALATION PROTOCOL') || ssD8.parts[1].output.includes('SEPARATING PEOPLE FROM THE PROBLEM'));

  // Part 3 – Positions vs Underlying Interests
  assert.ok(ssD8.parts[2].title.includes('Positions vs Interests') || ssD8.parts[2].title.includes('Position'));
  assert.ok(ssD8.parts[2].output.includes('POSITION-TO-INTEREST MAPPING ANALYSIS') || ssD8.parts[2].output.includes('CREATIVE HYBRID SYNTHESIS'));

  // Part 4 – Weighted Pugh Decision Matrix
  assert.ok(ssD8.parts[3].title.includes('Pugh Decision Matrix') || ssD8.parts[3].title.includes('Pugh'));
  assert.ok(ssD8.parts[3].output.includes('WEIGHTED PUGH DECISION MATRIX') || ssD8.parts[3].output.includes('Objective Winner'));

  // Part 5 – Master Conflict Resolution Suite
  assert.ok(ssD8.parts[4].title.includes('Master Conflict Resolution') || ssD8.parts[4].title.includes('Consensus'));
  assert.ok(ssD8.parts[4].output.includes('MASTER TECHNICAL CONSENSUS CERTIFICATION') || ssD8.parts[4].output.includes('CERTIFIED_CONSENSUS_BUILDER'));
});

test('Soft Skills Day 9: Resolution & Structural Invariants for Agile Standups & The 90-Second Update', () => {
  const ssD9 = getLongLesson('soft-skills', 9);
  assert.ok(ssD9, 'soft-skills Day 9 long lesson must resolve');
  assert.equal(ssD9.day, 9);
  assert.equal(ssD9.parts.length, 5, 'soft-skills Day 9 must contain exactly 5 parts');
  assert.ok(ssD9.summary.length >= 4, 'soft-skills Day 9 must contain comprehensive summary');
  assert.ok(ssD9.projectStep, 'soft-skills Day 9 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD9);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD9.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 9: Domain-Specific Content Assertions', () => {
  const ssD9 = getLongLesson('soft-skills', 9);
  assert.ok(ssD9);

  // Part 1 – Attention Economics & Maker's Schedule
  assert.ok(ssD9.parts[0].title.includes('Attention') || ssD9.parts[0].title.includes('Maker'));
  assert.ok(ssD9.parts[0].output.includes('MEETING ATTENTION ECONOMICS REPORT') || ssD9.parts[0].output.includes('Context-Switch Penalty'));

  // Part 2 – The 90-Second Standup Protocol
  assert.ok(ssD9.parts[1].title.includes('90-Second Standup') || ssD9.parts[1].title.includes('90-Second'));
  assert.ok(ssD9.parts[1].output.includes('90-SECOND STANDUP UPDATE AUDIT') || ssD9.parts[1].output.includes('Signal-to-Noise'));

  // Part 3 – The Parking Lot Pattern
  assert.ok(ssD9.parts[2].title.includes('Parking Lot'));
  assert.ok(ssD9.parts[2].output.includes('STANDUP PARKING LOT AUDIT') || ssD9.parts[2].output.includes('SCHEDULE POST-STANDUP BREAKOUT'));

  // Part 4 – Active Facilitation & Right-to-Left Board-Walking
  assert.ok(ssD9.parts[3].title.includes('Active Facilitation') || ssD9.parts[3].title.includes('Board-Walking'));
  assert.ok(ssD9.parts[3].output.includes('AGILE CEREMONY BOARD-WALKING AUDIT') || ssD9.parts[3].output.includes('Right-to-Left Walk'));

  // Part 5 – Master Synchronous Collaboration Suite
  assert.ok(ssD9.parts[4].title.includes('Master Synchronous Collaboration') || ssD9.parts[4].title.includes('Velocity Index'));
  assert.ok(ssD9.parts[4].output.includes('MASTER AGILE CEREMONY VELOCITY CERTIFICATION') || ssD9.parts[4].output.includes('CERTIFIED_AGILE_HIGH_VELOCITY'));
});

test('Soft Skills Day 10: Resolution & Structural Invariants for Technical Presentations & Minto Pyramid', () => {
  const ssD10 = getLongLesson('soft-skills', 10);
  assert.ok(ssD10, 'soft-skills Day 10 long lesson must resolve');
  assert.equal(ssD10.day, 10);
  assert.equal(ssD10.parts.length, 5, 'soft-skills Day 10 must contain exactly 5 parts');
  assert.ok(ssD10.summary.length >= 4, 'soft-skills Day 10 must contain comprehensive summary');
  assert.ok(ssD10.projectStep, 'soft-skills Day 10 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD10);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD10.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 10: Domain-Specific Content Assertions', () => {
  const ssD10 = getLongLesson('soft-skills', 10);
  assert.ok(ssD10);

  // Part 1 – Top-Down vs Bottom-Up Communication
  assert.ok(ssD10.parts[0].title.includes('Top-Down') || ssD10.parts[0].title.includes('Bottom-Up'));
  assert.ok(ssD10.parts[0].output.includes('PRESENTATION FLOW & ATTENTION AUDIT') || ssD10.parts[0].output.includes('Time to Recommendation'));

  // Part 2 – Barbara Minto's Pyramid Principle & MECE
  assert.ok(ssD10.parts[1].title.includes('Minto Pyramid') || ssD10.parts[1].title.includes('MECE'));
  assert.ok(ssD10.parts[1].output.includes('MINTO PYRAMID MECE AUDIT') || ssD10.parts[1].output.includes('MECE Compliant'));

  // Part 3 – The SCQA Narrative Arc
  assert.ok(ssD10.parts[2].title.includes('SCQA') || ssD10.parts[2].title.includes('Narrative'));
  assert.ok(ssD10.parts[2].output.includes('SCQA NARRATIVE PERSUASION AUDIT') || ssD10.parts[2].output.includes('BOARDROOM_READY'));

  // Part 4 – High-Signal Visual Slide Design
  assert.ok(ssD10.parts[3].title.includes('Visual Slide Design') || ssD10.parts[3].title.includes('1-Idea-Per-Slide'));
  assert.ok(ssD10.parts[3].output.includes('SLIDE COGNITIVE LOAD AUDIT') || ssD10.parts[3].output.includes('OPTIMAL_HIGH_SIGNAL'));

  // Part 5 – Master Technical Presentation Suite
  assert.ok(ssD10.parts[4].title.includes('Master Technical Presentation') || ssD10.parts[4].title.includes('Executive Storytelling'));
  assert.ok(ssD10.parts[4].output.includes('MASTER EXECUTIVE STORYTELLING CERTIFICATION') || ssD10.parts[4].output.includes('ACCREDITED_EXECUTIVE_STORYTELLER'));
});
"""

with open(test_file, "r", encoding="utf-8") as f:
    content = f.read()

# Check if Day 6 test already present
if "Soft Skills Day 6: Resolution & Structural Invariants" not in content:
    with open(test_file, "a", encoding="utf-8") as f:
        f.write(tests_to_append)
    print("Successfully appended tests for Soft Skills Days 6-10!")
else:
    print("Tests already present.")
