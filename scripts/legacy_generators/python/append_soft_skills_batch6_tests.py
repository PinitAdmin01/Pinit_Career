test_code = """
test('Soft Skills Day 56: Resolution & Structural Invariants for Three Mile Island & Telemetry Ambiguity', () => {
  const ssD56 = getLongLesson('soft-skills', 56);
  assert.ok(ssD56, 'soft-skills Day 56 long lesson must resolve');
  assert.equal(ssD56.day, 56);
  assert.equal(ssD56.parts.length, 5, 'soft-skills Day 56 must contain exactly 5 parts');
  assert.ok(ssD56.summary.length >= 4, 'soft-skills Day 56 must contain comprehensive summary');
  assert.ok(ssD56.projectStep, 'soft-skills Day 56 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD56);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD56.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 56: Domain-Specific Content Assertions', () => {
  const ssD56 = getLongLesson('soft-skills', 56);
  assert.ok(ssD56);

  assert.ok(ssD56.parts[0].output.includes('THREE MILE ISLAND TELEMETRY FORENSICS'));
  assert.ok(ssD56.parts[0].output.includes('TMI_OBSERVABILITY_FORENSICS_100_PCT_VERIFIED'));
  assert.ok(ssD56.parts[1].output.includes('ENTERPRISE ALERT CATALOG OBSERVABILITY AUDIT'));
  assert.ok(ssD56.parts[1].output.includes('ALERT_AMBIGUITY_ERADICATION_100_PCT_VERIFIED'));
  assert.ok(ssD56.parts[2].output.includes('CLOSED-LOOP SYNTHETIC PROBE ENGINE'));
  assert.ok(ssD56.parts[2].output.includes('DEEP_HEALTH_CHECK_ENGINE_100_PCT_VERIFIED'));
  assert.ok(ssD56.parts[3].output.includes('HIGH-STAKES CONTROL ROOM INCIDENT TRIAGE'));
  assert.ok(ssD56.parts[3].output.includes('CONTROL_ROOM_TRIAGE_LAB_100_PCT_VERIFIED'));
  assert.ok(ssD56.parts[4].output.includes('DAY 56 OBSERVABILITY & HUMAN FACTORS CERTIFICATION'));
  assert.ok(ssD56.parts[4].output.includes('DAY_56_OBSERVABILITY_MASTERY_100_PCT_VERIFIED'));
});

test('Soft Skills Day 57: Resolution & Structural Invariants for Knight Capital $440M Algorithmic Bankruptcy', () => {
  const ssD57 = getLongLesson('soft-skills', 57);
  assert.ok(ssD57, 'soft-skills Day 57 long lesson must resolve');
  assert.equal(ssD57.day, 57);
  assert.equal(ssD57.parts.length, 5, 'soft-skills Day 57 must contain exactly 5 parts');
  assert.ok(ssD57.summary.length >= 4, 'soft-skills Day 57 must contain comprehensive summary');
  assert.ok(ssD57.projectStep, 'soft-skills Day 57 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD57);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD57.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 57: Domain-Specific Content Assertions', () => {
  const ssD57 = getLongLesson('soft-skills', 57);
  assert.ok(ssD57);

  assert.ok(ssD57.parts[0].output.includes('SEC ADMINISTRATIVE SUMMARY: KNIGHT CAPITAL 2012'));
  assert.ok(ssD57.parts[0].output.includes('KNIGHT_CAPITAL_SEC_FORENSICS_100_PCT_VERIFIED'));
  assert.ok(ssD57.parts[1].output.includes('REAL-TIME CAPITAL EXPOSURE CIRCUIT BREAKER'));
  assert.ok(ssD57.parts[1].output.includes('FINANCIAL_CIRCUIT_BREAKER_100_PCT_VERIFIED'));
  assert.ok(ssD57.parts[2].output.includes('FLEET-WIDE DEPLOYMENT HASH VERIFICATION'));
  assert.ok(ssD57.parts[2].output.includes('FLEET_DEPLOYMENT_VERIFIER_100_PCT_VERIFIED'));
  assert.ok(ssD57.parts[3].output.includes('RUNAWAY ALGORITHMIC INCIDENT CHRONOLOGY'));
  assert.ok(ssD57.parts[3].output.includes('ALGORITHMIC_EMERGENCY_LAB_100_PCT_VERIFIED'));
  assert.ok(ssD57.parts[4].output.includes('DAY 57 DEPLOYMENT GOVERNANCE & KILL-SWITCH CERTIFICATION'));
  assert.ok(ssD57.parts[4].output.includes('DAY_57_DEPLOYMENT_GOVERNANCE_100_PCT_VERIFIED'));
});

test('Soft Skills Day 58: Resolution & Structural Invariants for Mars Climate Orbiter Metric/Imperial Crash', () => {
  const ssD58 = getLongLesson('soft-skills', 58);
  assert.ok(ssD58, 'soft-skills Day 58 long lesson must resolve');
  assert.equal(ssD58.day, 58);
  assert.equal(ssD58.parts.length, 5, 'soft-skills Day 58 must contain exactly 5 parts');
  assert.ok(ssD58.summary.length >= 4, 'soft-skills Day 58 must contain comprehensive summary');
  assert.ok(ssD58.projectStep, 'soft-skills Day 58 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD58);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD58.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 58: Domain-Specific Content Assertions', () => {
  const ssD58 = getLongLesson('soft-skills', 58);
  assert.ok(ssD58);

  assert.ok(ssD58.parts[0].output.includes('NASA JPL MISHAP INVESTIGATION: MARS CLIMATE ORBITER'));
  assert.ok(ssD58.parts[0].output.includes('MARS_CLIMATE_ORBITER_FORENSICS_100_PCT_VERIFIED'));
  assert.ok(ssD58.parts[1].output.includes('TYPE-SAFE COMPILE-TIME DIMENSIONAL ANALYSIS'));
  assert.ok(ssD58.parts[1].output.includes('NOMINAL_UNIT_TYPE_SYSTEM_100_PCT_VERIFIED'));
  assert.ok(ssD58.parts[2].output.includes('API INTERFACE SCHEMA DIMENSIONAL LINTER'));
  assert.ok(ssD58.parts[2].output.includes('SCHEMA_UNIT_LINTER_100_PCT_VERIFIED'));
  assert.ok(ssD58.parts[3].output.includes('REAL-TIME TELEMETRY INTERCEPTION LAB'));
  assert.ok(ssD58.parts[3].output.includes('TELEMETRY_ANOMALY_LAB_100_PCT_VERIFIED'));
  assert.ok(ssD58.parts[4].output.includes('DAY 58 DIMENSIONAL TYPE SAFETY CERTIFICATION'));
  assert.ok(ssD58.parts[4].output.includes('DAY_58_DIMENSIONAL_SAFETY_100_PCT_VERIFIED'));
});

test('Soft Skills Day 59: Resolution & Structural Invariants for The Principal Engineer Modernization RFC', () => {
  const ssD59 = getLongLesson('soft-skills', 59);
  assert.ok(ssD59, 'soft-skills Day 59 long lesson must resolve');
  assert.equal(ssD59.day, 59);
  assert.equal(ssD59.parts.length, 5, 'soft-skills Day 59 must contain exactly 5 parts');
  assert.ok(ssD59.summary.length >= 4, 'soft-skills Day 59 must contain comprehensive summary');
  assert.ok(ssD59.projectStep, 'soft-skills Day 59 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD59);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD59.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 59: Domain-Specific Content Assertions', () => {
  const ssD59 = getLongLesson('soft-skills', 59);
  assert.ok(ssD59);

  assert.ok(ssD59.parts[0].output.includes('CONWAYS LAW ORGANIZATIONAL TOPOLOGY AUDIT'));
  assert.ok(ssD59.parts[0].output.includes('CONWAYS_LAW_ENGINE_100_PCT_VERIFIED'));
  assert.ok(ssD59.parts[1].output.includes('$5M PRINCIPAL ENGINEER MODERNIZATION RFC FINANCIAL BLUEPRINT'));
  assert.ok(ssD59.parts[1].output.includes('MODERNIZATION_RFC_FINANCIAL_MODEL_100_PCT_VERIFIED'));
  assert.ok(ssD59.parts[2].output.includes('ENGINEERING COMMUNICATION TELEMETRY SUITE'));
  assert.ok(ssD59.parts[2].output.includes('COMMUNICATION_HEALTH_TELEMETRY_100_PCT_VERIFIED'));
  assert.ok(ssD59.parts[3].output.includes('BOARD OF DIRECTORS MODERNIZATION DEFENSE LAB'));
  assert.ok(ssD59.parts[3].output.includes('BOARD_DEFENSE_LAB_100_PCT_VERIFIED'));
  assert.ok(ssD59.parts[4].output.includes('DAY 59 PRINCIPAL ENGINEER RFC CERTIFICATION'));
  assert.ok(ssD59.parts[4].output.includes('DAY_59_MODERNIZATION_RFC_100_PCT_VERIFIED'));
});

test('Soft Skills Day 60: Resolution & Structural Invariants for ⭐ Grand Master Capstone Viva Gate', () => {
  const ssD60 = getLongLesson('soft-skills', 60);
  assert.ok(ssD60, 'soft-skills Day 60 long lesson must resolve');
  assert.equal(ssD60.day, 60);
  assert.equal(ssD60.parts.length, 5, 'soft-skills Day 60 must contain exactly 5 parts');
  assert.ok(ssD60.summary.length >= 4, 'soft-skills Day 60 must contain comprehensive summary');
  assert.ok(ssD60.projectStep, 'soft-skills Day 60 must have a hands-on project step');

  const spokenMin = estimateSpokenMinutes(ssD60);
  assert.ok(spokenMin >= 20, `Spoken minutes should be >= 20 (got ${spokenMin})`);

  for (const part of ssD60.parts) {
    assert.ok(part.code.includes('console.log('), `Code in '${part.title}' must print results`);
    assert.ok(part.check.options.length === 4, 'MCQ must provide exactly 4 distinct options');
    assert.ok(part.check.answer >= 0 && part.check.answer < 4, 'Answer index must be valid');
    assert.ok(part.check.why.length > 15, 'Explanation must be rigorous');
  }
});

test('Soft Skills Day 60: Domain-Specific Content Assertions & Grand Capstone Ratification', () => {
  const ssD60 = getLongLesson('soft-skills', 60);
  assert.ok(ssD60);

  assert.ok(ssD60.parts[0].output.includes('THE PRINCIPAL ENGINEERING COMMUNICATION INVARIANT'));
  assert.ok(ssD60.parts[0].output.includes('PRINCIPAL_COMMUNICATION_INVARIANT_100_PCT_VERIFIED'));
  assert.ok(ssD60.parts[1].output.includes('APEXEXECUTIVECOMMS MASTER PORTFOLIO DOSSIER'));
  assert.ok(ssD60.parts[1].output.includes('EXECUTIVE_PORTFOLIO_DOSSIER_100_PCT_VERIFIED'));
  assert.ok(ssD60.parts[2].output.includes('APEXEXECUTIVECOMMS LIVE EXAMINATION SIMULATOR'));
  assert.ok(ssD60.parts[2].output.includes('EXAMINATION_SIMULATOR_100_PCT_VERIFIED'));
  assert.ok(ssD60.parts[3].output.includes('GRAND MASTER CAPSTONE VIVA VOCE EXAMINATION'));
  assert.ok(ssD60.parts[3].output.includes('CAPSTONE_VIVA_GATE_100_PCT_VERIFIED'));
  assert.ok(ssD60.parts[4].output.includes('COURSE 22 FULL 60-DAY CURRICULUM GRADUATION CERTIFICATE'));
  assert.ok(ssD60.parts[4].output.includes('COURSE_22_FULL_COMPLETION_100_PCT_VERIFIED'));
});
"""

test_file = "tests/java_softskills_long_lessons.test.ts"
with open(test_file, "r", encoding="utf-8") as f:
    content = f.read()

if "Soft Skills Day 56:" not in content:
    with open(test_file, "a", encoding="utf-8") as f:
        f.write("\n" + test_code.strip() + "\n")
    print(f"Appended 10 test blocks for Days 56-60 to {test_file} successfully!")
else:
    print("Days 56-60 tests already present.")
