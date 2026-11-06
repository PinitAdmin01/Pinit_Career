"""
Script to append Block 226 unit tests for Days 26-30 (Final Grand Master Course Capstone)
"""

tests_snippet = """
test('Block 226: B.Com AIT Days 26-30 Structural & Invariant Verification (5 Parts >= 580 words, Total >= 2950 words, Socratic answerIndex: 0)', () => {
  for (let day = 26; day <= 30; day++) {
    const lesson = getLongLesson('bcom_ait', day);
    assert.ok(lesson, `bcom_ait Day ${day} must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_ait Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 4, `bcom_ait Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `bcom_ait Day ${day} must have a project step`);
    const expectedMinutes = day === 30 ? 50 : 40;
    assert.equal(lesson.minutes, expectedMinutes, `Day ${day} minutes must be ${expectedMinutes}`);

    let totalWords = 0;
    for (let pIdx = 0; pIdx < lesson.parts.length; pIdx++) {
      const part = lesson.parts[pIdx];
      assert.ok(part.title.length > 0, `Day ${day} Part ${pIdx + 1} must have title`);
      assert.ok(Array.isArray(part.say) && part.say.length >= 4, `Day ${day} Part ${pIdx + 1} must have >= 4 say paragraphs`);
      
      const partWords = part.say.reduce((sum, p) => sum + p.trim().split(/\\s+/).filter(Boolean).length, 0);
      assert.ok(partWords >= 580, `Day ${day} Part ${pIdx + 1} word count (${partWords}) must be >= 580`);
      totalWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${pIdx + 1} must have example`);
      assert.ok(part.code && part.code.includes('print('), `Day ${day} Part ${pIdx + 1} must have executable Python code`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${pIdx + 1} must have expected terminal output`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${pIdx + 1} must have >= 3 codeNotes`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${pIdx + 1} must have tryIt`);

      // Socratic check invariants
      assert.ok(part.check, `Day ${day} Part ${pIdx + 1} must have Socratic check`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${pIdx + 1} check must have exactly 4 options`);
      assert.equal(part.check.answerIndex, 0, `Day ${day} Part ${pIdx + 1} check must have answerIndex: 0`);
      assert.equal(part.check.answer, 0, `Day ${day} Part ${pIdx + 1} check must have answer: 0`);
      assert.ok(part.check.explanation && part.check.explanation.length > 20, `Day ${day} Part ${pIdx + 1} must have explanation`);
      assert.ok(part.check.why && part.check.why.length > 20, `Day ${day} Part ${pIdx + 1} must have why`);
    }

    assert.ok(totalWords >= 2950, `Day ${day} total words (${totalWords}) must be >= 2950 words`);
  }
});

test('Block 226: B.Com AIT Day 26: The Autonomous Cognitive Enterprise Snippets Verification', () => {
  const d26 = getLongLesson('bcom_ait', 26)!;
  assert.ok(d26);
  assert.ok(d26.parts[0].code?.includes('CognitiveMaturityEngine'));
  assert.ok(d26.parts[1].code?.includes('CoEGovernanceModelRouter'));
  assert.ok(d26.parts[2].code?.includes('TalentTopologyPlanner'));
  assert.ok(d26.parts[3].code?.includes('DecisionVelocityTracker'));
  assert.ok(d26.parts[4].code?.includes('ExecutiveMaturityDashboard'));
});

test('Block 226: B.Com AIT Day 27: Strategic AI Transformation Roadmaps Snippets Verification', () => {
  const d27 = getLongLesson('bcom_ait', 27)!;
  assert.ok(d27);
  assert.ok(d27.parts[0].code?.includes('StrategicMatrixEngine'));
  assert.ok(d27.parts[1].code?.includes('RICEPrioritizationEngine'));
  assert.ok(d27.parts[2].code?.includes('AIEconomicValuationEngine'));
  assert.ok(d27.parts[3].code?.includes('PhasedTransformationRoadmapEngine'));
  assert.ok(d27.parts[4].code?.includes('ChiefTransformationOfficerCockpit'));
});

test('Block 226: B.Com AIT Day 28: Human-AI Collaboration & Workforce Reskilling Snippets Verification', () => {
  const d28 = getLongLesson('bcom_ait', 28)!;
  assert.ok(d28);
  assert.ok(d28.parts[0].code?.includes('HumanMachineInteractionRouter'));
  assert.ok(d28.parts[1].code?.includes('ADKARWorkforceDiagnosticEngine'));
  assert.ok(d28.parts[2].code?.includes('WorkforceReskillingEngine'));
  assert.ok(d28.parts[3].code?.includes('AgentOpsReliabilityMonitor'));
  assert.ok(d28.parts[4].code?.includes('WorkforceTransformationControlTower'));
});

test('Block 226: B.Com AIT Day 29: Boardroom AI Governance & Audit Committees Snippets Verification', () => {
  const d29 = getLongLesson('bcom_ait', 29)!;
  assert.ok(d29);
  assert.ok(d29.parts[0].code?.includes('BoardroomFiduciaryGovernanceEngine'));
  assert.ok(d29.parts[1].code?.includes('AuditCommitteeAssuranceEngine'));
  assert.ok(d29.parts[2].code?.includes('BoardEthicsCharterGovernor'));
  assert.ok(d29.parts[3].code?.includes('BoardroomCircuitBreakerGovernor'));
  assert.ok(d29.parts[4].code?.includes('UnifiedBoardroomGovernanceCockpit'));
});

test('Block 226: B.Com AIT Day 30: 🏆 FINAL GRAND MASTER COURSE CAPSTONE Snippets Verification', () => {
  const d30 = getLongLesson('bcom_ait', 30)!;
  assert.ok(d30);
  assert.ok(d30.parts[0].code?.includes('Pillar1CognitiveSwarmEngine'));
  assert.ok(d30.parts[1].code?.includes('Pillar2DataIntegrityEngine'));
  assert.ok(d30.parts[2].code?.includes('Pillar3SecurityComplianceEngine'));
  assert.ok(d30.parts[3].code?.includes('Pillar4AutonomousSCMEngine'));
  assert.ok(d30.parts[4].code?.includes('AutonomousEnterpriseOperatingSystem'));
});

test('Block 226: B.Com AIT Days 26-30 Gate v2 Tree-Graph Visuals & SHA-256 Bindings Verification', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual } = await import('../src/lib/visuals/loadVisuals');

  for (let day = 26; day <= 30; day++) {
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ait/day-${day}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ait', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ait Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ait');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ait Day ${day}`);

    const lesson = getLongLesson('bcom_ait', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ait Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert.equal(entry.codeHash, expectedHash, `codeHash mismatch at bcom_ait Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ait', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ait Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'tree-graph', `Expected template "tree-graph" for bcom_ait`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ait Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map((s: any) => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});
"""

test_file = "tests/bcom_ops_ait_long_lessons.test.ts"
with open(test_file, "r", encoding="utf-8") as f:
    existing = f.read()

if "Block 226: B.Com AIT Days 26-30" not in existing:
    with open(test_file, "a", encoding="utf-8") as f:
        f.write(tests_snippet)
    print("Block 226 tests appended successfully.")
else:
    print("Block 226 tests already present.")
