"""
Script to append Block 225 unit tests for Days 21-25
"""

tests_snippet = """
test('Block 225: B.Com AIT Days 21-25 Structural & Invariant Verification (5 Parts >= 580 words, Total >= 2950 words, Socratic answerIndex: 0)', () => {
  for (let day = 21; day <= 25; day++) {
    const lesson = getLongLesson('bcom_ait', day);
    assert.ok(lesson, `bcom_ait Day ${day} must resolve`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_ait Day ${day} must contain exactly 5 parts`);
    assert.ok(lesson.summary.length >= 4, `bcom_ait Day ${day} must contain comprehensive summary`);
    assert.ok(lesson.projectStep, `bcom_ait Day ${day} must have a project step`);
    const expectedMinutes = day === 25 ? 50 : 40;
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

test('Block 225: B.Com AIT Day 21: AI-Powered Demand Forecasting Snippets Verification', () => {
  const d21 = getLongLesson('bcom_ait', 21)!;
  assert.ok(d21);
  assert.ok(d21.parts[0].code?.includes('EnterpriseDemandForecaster'));
  assert.ok(d21.parts[1].code?.includes('EnterpriseProphetDecompositionEngine'));
  assert.ok(d21.parts[2].code?.includes('HierarchicalSupplyChainReconciler'));
  assert.ok(d21.parts[3].code?.includes('SupplyChainBullwhipMitigator'));
  assert.ok(d21.parts[4].code?.includes('AutonomousSOPControlTower'));
});

test('Block 225: B.Com AIT Day 22: Intelligent Inventory Optimization Snippets Verification', () => {
  const d22 = getLongLesson('bcom_ait', 22)!;
  assert.ok(d22);
  assert.ok(d22.parts[0].code?.includes('EnterpriseSafetyStockOptimizer'));
  assert.ok(d22.parts[1].code?.includes('ABCXYZStratificationEngine'));
  assert.ok(d22.parts[2].code?.includes('MultiEchelonRiskPoolingOptimizer'));
  assert.ok(d22.parts[3].code?.includes('ReplenishmentPolicySimulator'));
  assert.ok(d22.parts[4].code?.includes('AutonomousInventoryControlTower'));
});

test('Block 225: B.Com AIT Day 23: Autonomous Logistics & Fleet Dispatch Snippets Verification', () => {
  const d23 = getLongLesson('bcom_ait', 23)!;
  assert.ok(d23);
  assert.ok(d23.parts[0].code?.includes('VRPNetworkEngine'));
  assert.ok(d23.parts[1].code?.includes('ClarkeWright2OptOptimizer'));
  assert.ok(d23.parts[2].code?.includes('DynamicFleetDispatchEngine'));
  assert.ok(d23.parts[3].code?.includes('LastMileEconomicsEngine'));
  assert.ok(d23.parts[4].code?.includes('AutonomousFleetControlTower'));
});

test('Block 225: B.Com AIT Day 24: Cognitive Procurement & Contract Negotiations Snippets Verification', () => {
  const d24 = getLongLesson('bcom_ait', 24)!;
  assert.ok(d24);
  assert.ok(d24.parts[0].code?.includes('CognitiveProcurementRiskEngine'));
  assert.ok(d24.parts[1].code?.includes('ContractRiskAuditor'));
  assert.ok(d24.parts[2].code?.includes('AutonomousBilateralNegotiator'));
  assert.ok(d24.parts[3].code?.includes('ThreeWayReconciliationEngine'));
  assert.ok(d24.parts[4].code?.includes('AutonomousProcurementControlTower'));
});

test('Block 225: B.Com AIT Day 25: 🏆 MILESTONE 4 GRAND CAPSTONE Snippets Verification', () => {
  const d25 = getLongLesson('bcom_ait', 25)!;
  assert.ok(d25);
  assert.ok(d25.parts[0].code?.includes('Pillar1DemandEngine'));
  assert.ok(d25.parts[1].code?.includes('Pillar2InventoryEngine'));
  assert.ok(d25.parts[2].code?.includes('Pillar3LogisticsEngine'));
  assert.ok(d25.parts[3].code?.includes('Pillar4ProcurementEngine'));
  assert.ok(d25.parts[4].code?.includes('MasterSupplyChainControlTower'));
});

test('Block 225: B.Com AIT Days 21-25 Gate v2 Tree-Graph Visuals & SHA-256 Bindings Verification', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual } = await import('../src/lib/visuals/loadVisuals');

  for (let day = 21; day <= 25; day++) {
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
    orig = f.read()

new_content = orig.rstrip() + "\n" + tests_snippet + "\n"

with open(test_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Successfully appended Block 225 unit tests to tests/bcom_ops_ait_long_lessons.test.ts")
