import os

test_code = """
test('Soft Skills Day 41: Resolution & Structural Invariants for Managing Executive Stakeholders & ROI', () => {
  const ssD41 = getLongLesson('soft-skills', 41);
  assert.ok(ssD41, 'soft-skills Day 41 long lesson must resolve');
  assert.equal(ssD41.day, 41);
  assert.equal(ssD41.parts.length, 5, 'soft-skills Day 41 must contain exactly 5 parts');
  assert.ok(ssD41.summary.length >= 4, 'soft-skills Day 41 must contain comprehensive summary');
  assert.ok(ssD41.projectStep, 'soft-skills Day 41 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD41);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD41.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 41: Domain-Specific Content Assertions', () => {
  const ssD41 = getLongLesson('soft-skills', 41);
  assert.ok(ssD41);

  assert.ok(ssD41.parts[0].output.includes('AMAZON 6-PAGE NARRATIVE MEMO EVALUATION'));
  assert.ok(ssD41.parts[0].output.includes('narrative memos persuade through rigorous logic'));
  assert.ok(ssD41.parts[1].output.includes('EXECUTIVE RISK HEAT MAP BLUEPRINT AUDIT'));
  assert.ok(ssD41.parts[1].output.includes('ENGINEERING_TECH_DEBT_TRANSLATED_INTO_BALANCE_SHEET_LIABILITY'));
  assert.ok(ssD41.parts[2].output.includes('EXECUTIVE MEMO MARKDOWN LINTER EVALUATION'));
  assert.ok(ssD41.parts[2].output.includes('CONCISE_ACTIVE_VOICE_DRIVES_EXECUTIVE_ACTION'));
  assert.ok(ssD41.parts[3].output.includes('LIVE 5-MINUTE CEO PITCH SIMULATION LAB EVALUATION'));
  assert.ok(ssD41.parts[3].output.includes('SPEAK_IN_REVENUE_EFFICIENCY_AND_ENTERPRISE_RISK'));
  assert.ok(ssD41.parts[4].output.includes('MASTER C-SUITE BRIEFING & RISK GOVERNANCE EVALUATION'));
  assert.ok(ssD41.parts[4].output.includes('DAY_41_EXECUTIVE_STAKEHOLDERS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 42: Resolution & Structural Invariants for Engineering Strategy Documents & North Star', () => {
  const ssD42 = getLongLesson('soft-skills', 42);
  assert.ok(ssD42, 'soft-skills Day 42 long lesson must resolve');
  assert.equal(ssD42.day, 42);
  assert.equal(ssD42.parts.length, 5, 'soft-skills Day 42 must contain exactly 5 parts');
  assert.ok(ssD42.summary.length >= 4, 'soft-skills Day 42 must contain comprehensive summary');
  assert.ok(ssD42.projectStep, 'soft-skills Day 42 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD42);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD42.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 42: Domain-Specific Content Assertions', () => {
  const ssD42 = getLongLesson('soft-skills', 42);
  assert.ok(ssD42);

  assert.ok(ssD42.parts[0].output.includes('RICHARD RUMELT STRATEGY KERNEL EVALUATION'));
  assert.ok(ssD42.parts[0].output.includes('STRATEGY_IS_ABOUT_FOCUS_AND_DECIDING_WHAT_NOT_TO_DO'));
  assert.ok(ssD42.parts[1].output.includes('THE NORTH STAR EVOLUTIONARY BLUEPRINT AUDIT'));
  assert.ok(ssD42.parts[1].output.includes('A North Star without intermediate milestones is a daydream'));
  assert.ok(ssD42.parts[2].output.includes('TECHNICAL STRATEGY ROADMAP DEPENDENCY GRAPHER'));
  assert.ok(ssD42.parts[2].output.includes('DEPENDENCY_AWARE_ARCHITECTURE_PREVENTS_BLOCKERS'));
  assert.ok(ssD42.parts[3].output.includes('ADVERSARIAL ARCHITECTURE STRATEGY DEFENSE LAB'));
  assert.ok(ssD42.parts[3].output.includes('DEFEND_STRATEGY_WITH_INCREMENTAL_VALUE_NOT_THEORETICAL_PERFECTION'));
  assert.ok(ssD42.parts[4].output.includes('MASTER TECHNICAL STRATEGY & NORTH STAR ALIGNMENT EVALUATION'));
  assert.ok(ssD42.parts[4].output.includes('DAY_42_STRATEGY_DOCUMENTS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 43: Resolution & Structural Invariants for Culture & Technical Mentorship Ladders', () => {
  const ssD43 = getLongLesson('soft-skills', 43);
  assert.ok(ssD43, 'soft-skills Day 43 long lesson must resolve');
  assert.equal(ssD43.day, 43);
  assert.equal(ssD43.parts.length, 5, 'soft-skills Day 43 must contain exactly 5 parts');
  assert.ok(ssD43.summary.length >= 4, 'soft-skills Day 43 must contain comprehensive summary');
  assert.ok(ssD43.projectStep, 'soft-skills Day 43 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD43);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD43.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 43: Domain-Specific Content Assertions', () => {
  const ssD43 = getLongLesson('soft-skills', 43);
  assert.ok(ssD43);

  assert.ok(ssD43.parts[0].output.includes('SOCIOLOGY OF SPONSORSHIP VS MENTORSHIP EVALUATION'));
  assert.ok(ssD43.parts[0].output.includes('MENTORSHIP_GIVES_ADVICE_SPONSORSHIP_GIVES_OPPORTUNITY'));
  assert.ok(ssD43.parts[1].output.includes('ENGINEERING CAREER LADDER BLUEPRINT AUDIT'));
  assert.ok(ssD43.parts[1].output.includes('ELIMINATE_PROMOTION_FAVORITISM_THROUGH_RADICAL_CLARITY'));
  assert.ok(ssD43.parts[2].output.includes('MENTORSHIP & GROWTH MILESTONES TRACKER'));
  assert.ok(ssD43.parts[2].output.includes('STRUCTURED_GOALS_ACCELERATE_ENGINEERING_MATURITY'));
  assert.ok(ssD43.parts[3].output.includes('UNDERPERFORMING SENIOR ENGINEER COACHING LAB'));
  assert.ok(ssD43.parts[3].output.includes('COACH_WITH_EMPATHY_RESTORING_HIGH_AGENCY_BEATS_PUNISHMENT'));
  assert.ok(ssD43.parts[4].output.includes('MASTER CULTURE, SPONSORSHIP & CAREER LADDER EVALUATION'));
  assert.ok(ssD43.parts[4].output.includes('DAY_43_CULTURE_AND_MENTORSHIP_100_PCT_VERIFIED'));
});

test('Soft Skills Day 44: Resolution & Structural Invariants for Reorganizations & Strategy Pivots', () => {
  const ssD44 = getLongLesson('soft-skills', 44);
  assert.ok(ssD44, 'soft-skills Day 44 long lesson must resolve');
  assert.equal(ssD44.day, 44);
  assert.equal(ssD44.parts.length, 5, 'soft-skills Day 44 must contain exactly 5 parts');
  assert.ok(ssD44.summary.length >= 4, 'soft-skills Day 44 must contain comprehensive summary');
  assert.ok(ssD44.projectStep, 'soft-skills Day 44 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD44);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD44.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 44: Domain-Specific Content Assertions', () => {
  const ssD44 = getLongLesson('soft-skills', 44);
  assert.ok(ssD44);

  assert.ok(ssD44.parts[0].output.includes('CHANGE MANAGEMENT & EMOTIONAL CYCLE EVALUATION'));
  assert.ok(ssD44.parts[0].output.includes('ORGANIZATIONAL_SHOCK_ABSORBER_DISCIPLINE_VERIFIED'));
  assert.ok(ssD44.parts[1].output.includes('STRATEGIC REORIENTATION ADDRESS AUDIT'));
  assert.ok(ssD44.parts[1].output.includes('LEADERS_ABSORB_CHAOS_AND_TRANSMIT_CALM_CLARITY'));
  assert.ok(ssD44.parts[2].output.includes('ASSET SALVAGE & TRANSITION AUDIT CLI'));
  assert.ok(ssD44.parts[2].output.includes('CODE_CAN_BE_DEPRECATED_BUT_ENGINEERING_CAPITAL_NEVER_DIES'));
  assert.ok(ssD44.parts[3].output.includes('EMERGENCY TEAM MUTINY DE-ESCALATION LAB'));
  assert.ok(ssD44.parts[3].output.includes('IN_TIMES_OF_CHURN_THE_STAFF_ENGINEER_IS_THE_ANCHOR_OF_THE_TEAM'));
  assert.ok(ssD44.parts[4].output.includes('MASTER ORGANIZATIONAL RESILIENCE & TRANSITION EVALUATION'));
  assert.ok(ssD44.parts[4].output.includes('DAY_44_REORGS_AND_PIVOTS_100_PCT_VERIFIED'));
});

test('Soft Skills Day 45: Resolution & Structural Invariants for Milestone 6 (M2) ApexStrategy Strategy Suite', () => {
  const ssD45 = getLongLesson('soft-skills', 45);
  assert.ok(ssD45, 'soft-skills Day 45 long lesson must resolve');
  assert.equal(ssD45.day, 45);
  assert.equal(ssD45.parts.length, 5, 'soft-skills Day 45 must contain exactly 5 parts');
  assert.ok(ssD45.summary.length >= 4, 'soft-skills Day 45 must contain comprehensive summary');
  assert.ok(ssD45.projectStep, 'soft-skills Day 45 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD45);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD45.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 45: Domain-Specific Content Assertions', () => {
  const ssD45 = getLongLesson('soft-skills', 45);
  assert.ok(ssD45);

  assert.ok(ssD45.parts[0].output.includes('STRATEGIC ENTERPRISE ARCHITECTURE VALUATION'));
  assert.ok(ssD45.parts[0].output.includes('STRATEGIC_ENTERPRISE_ARCHITECTURE_VALUATION_RATIFIED'));
  assert.ok(ssD45.parts[1].output.includes('APEXSTRATEGY 3-YEAR MASTER BLUEPRINT AUDIT'));
  assert.ok(ssD45.parts[1].output.includes('SELF_FUNDING_ARCHITECTURE_WINS_BOARD_OF_DIRECTORS_APPROVAL'));
  assert.ok(ssD45.parts[2].output.includes('APEXSTRATEGY EXECUTIVE DECISION SUPPORT TOOL'));
  assert.ok(ssD45.parts[2].output.includes('QUANTIFIABLE_METRICS_ALIGNED_WITH_MULTI_YEAR_SHAREHOLDER_VALUE'));
  assert.ok(ssD45.parts[3].output.includes('BOARD OF DIRECTORS STRATEGY VIVA VOCE EXAMINATION'));
  assert.ok(ssD45.parts[3].output.includes('APEXSTRATEGY_RATIFIED_WITH_HIGHEST_HONORS'));
  assert.ok(ssD45.parts[4].output.includes('MILESTONE 6 APEXSTRATEGY CAPSTONE CERTIFICATION'));
  assert.ok(ssD45.parts[4].output.includes('MILESTONE_6_APEXSTRATEGY_SUITE_100_PCT_VERIFIED'));
});
"""

test_file = 'tests/java_softskills_long_lessons.test.ts'
with open(test_file, 'r', encoding='utf-8') as f:
    content = f.read()

if 'Soft Skills Day 41: Resolution & Structural Invariants' in content:
    print("Tests already present.")
else:
    with open(test_file, 'a', encoding='utf-8') as f:
        f.write(test_code)
    print("Successfully appended Days 41-45 tests.")
