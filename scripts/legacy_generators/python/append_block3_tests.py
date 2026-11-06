import sys

block3_tests = """

test('Block 131: B.Com Accounting Days 11-15: Resolution & Structure Invariants', () => {
  for (let d = 11; d <= 15; d++) {
    const lesson = getLongLesson('bcom-accounting', d);
    assert.ok(lesson, `Lesson for bcom-accounting Day ${d} should resolve`);
    assert.equal(lesson.coursePrefix, 'bcom-accounting');
    assert.equal(lesson.day, d);
    assert.ok(lesson.title && lesson.title.length > 5);
    assert.ok(lesson.goal && lesson.goal.length > 20);
    const expectedMinutes = d === 15 ? 50 : 45;
    assert.equal(lesson.minutes, expectedMinutes, `Day ${d} duration must be ${expectedMinutes} minutes`);
    assert.ok(lesson.recap && lesson.recap.length > 20);
    assert.equal(lesson.parts.length, 5, `Day ${d} must have exactly 5 parts`);
    assert.equal(lesson.summary.length, 5, `Day ${d} must have exactly 5 summary takeaways`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length === 5);

    let totalWords = 0;
    lesson.parts.forEach((part: any, idx: number) => {
      assert.ok(part.title, `Day ${d} Part ${idx + 1} must have a title`);
      const words = countWords(part.say);
      totalWords += words;
      assert.ok(
        words >= 580,
        `Day ${d} Part ${idx + 1} ('${part.title}') has ${words} words, expected >= 580`
      );
      assert.ok(part.code && part.code.trim().length > 0, `Day ${d} Part ${idx + 1} must have code`);
      assert.ok(part.output && part.output.trim().length > 0, `Day ${d} Part ${idx + 1} must have terminal output`);

      // Verify Socratic check format
      assert.ok(part.check, `Day ${d} Part ${idx + 1} must have a check question`);
      assert.ok(part.check.question && part.check.question.length > 10);
      assert.equal(part.check.options.length, 4, `Day ${d} Part ${idx + 1} must have 4 options`);
      const ansIdx = part.check.answerIndex !== undefined ? part.check.answerIndex : part.check.answer;
      assert.equal(ansIdx, 0, `Day ${d} Part ${idx + 1} correct answer index must be 0`);
      const why = part.check.explanation || part.check.why;
      assert.ok(why && why.length > 10, `Day ${d} Part ${idx + 1} check must have an explanation`);
    });

    assert.ok(
      totalWords >= 2950,
      `Day ${d} total words across 5 parts is ${totalWords}, expected >= 2950`
    );
  }
});

test('Block 131: B.Com Accounting Day 11: Depreciation (SLM vs WDV), Disposal & IAS 12 Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 11);
  assert.equal(lesson.day, 11);

  // Part 1: SLM vs WDV
  assert.match(lesson.parts[0].title, /SLM.*vs.*WDV/i);
  assert.ok(lesson.parts[0].code?.includes('class DepreciationEngine'));
  assert.ok(lesson.parts[0].output?.includes('SLM Total Depreciation'));
  assert.ok(lesson.parts[0].output?.includes('WDV Total Depreciation'));

  // Part 2: Provision for Depreciation
  assert.match(lesson.parts[1].title, /Provision for Depreciation/i);
  assert.ok(lesson.parts[1].code?.includes('Provision for Depreciation'));
  assert.ok(lesson.parts[1].output?.includes('Carrying Amount'));

  // Part 3: Asset Disposal Account
  assert.match(lesson.parts[2].title, /Asset Disposal Account/i);
  assert.ok(lesson.parts[2].code?.includes('AssetDisposalAccount'));
  assert.ok(lesson.parts[2].output?.includes('PROFIT ON ASSET DISPOSAL') || lesson.parts[2].output?.includes('LOSS'));

  // Part 4: Component Depreciation IAS 16
  assert.match(lesson.parts[3].title, /Component Depreciation/i);
  assert.ok(lesson.parts[3].code?.includes('AssetComponent'));
  assert.ok(lesson.parts[3].output?.includes('Aircraft'));

  // Part 5: Tax vs Book Depreciation IAS 12
  assert.match(lesson.parts[4].title, /Deferred Tax/i);
  assert.ok(lesson.parts[4].code?.includes('DeferredTaxEngine'));
  assert.ok(lesson.parts[4].output?.includes('Deferred Tax Liability') || lesson.parts[4].output?.includes('DTL'));
});

test('Block 131: B.Com Accounting Day 12: Trading Account & COGS Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 12);
  assert.equal(lesson.day, 12);

  // Part 1: COGS Equation
  assert.match(lesson.parts[0].title, /Cost of Goods Sold/i);
  assert.ok(lesson.parts[0].code?.includes('Opening Stock'));
  assert.ok(lesson.parts[0].output?.includes('GROSS PROFIT'));

  // Part 2: Direct vs Indirect Expenses
  assert.match(lesson.parts[1].title, /Direct vs.*Indirect Expenses/i);
  assert.ok(lesson.parts[1].code?.includes('Freight Inward') || lesson.parts[1].code?.includes('Factory Wages'));
  assert.ok(lesson.parts[1].output?.includes('Direct Manufacturing Cost'));

  // Part 3: Inventory Valuation IAS 2
  assert.match(lesson.parts[2].title, /Closing Stock.*NRV/i);
  assert.ok(lesson.parts[2].code?.includes('InventoryItem'));
  assert.ok(lesson.parts[2].output?.includes('Prudence Inventory Value') || lesson.parts[2].output?.includes('Write-down'));

  // Part 4: Abnormal Casualty Losses
  assert.match(lesson.parts[3].title, /Abnormal.*Losses/i);
  assert.ok(lesson.parts[3].code?.includes('Insurance Claim') || lesson.parts[3].code?.includes('Abnormal'));
  assert.ok(lesson.parts[3].output?.includes('Net Loss to P&L'));

  // Part 5: Manufacturing Account
  assert.match(lesson.parts[4].title, /Manufacturing Account/i);
  assert.ok(lesson.parts[4].code?.includes('ManufacturingAccount'));
  assert.ok(lesson.parts[4].output?.includes('COST OF PRODUCTION'));
});

test('Block 131: B.Com Accounting Day 13: Profit & Loss Statement Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 13);
  assert.equal(lesson.day, 13);

  // Part 1: Multi-Step P&L
  assert.match(lesson.parts[0].title, /Multi-Step P&L/i);
  assert.ok(lesson.parts[0].code?.includes('Gross Profit'));
  assert.ok(lesson.parts[0].output?.includes('NET OPERATING PROFIT'));

  // Part 2: Accrual & Prepayment Adjustments
  assert.match(lesson.parts[1].title, /Accruals.*Prepayments/i);
  assert.ok(lesson.parts[1].code?.includes('Outstanding Salaries') || lesson.parts[1].code?.includes('Prepaid Insurance'));
  assert.ok(lesson.parts[1].output?.includes('Adjusted Salaries Expense'));

  // Part 3: 4-Tier Debtors Provisions
  assert.match(lesson.parts[2].title, /Doubtful Debts/i);
  assert.ok(lesson.parts[2].code?.includes('Provision for Doubtful Debts') || lesson.parts[2].code?.includes('DebtorsProvisionEngine'));
  assert.ok(lesson.parts[2].output?.includes('Net Debtors on Balance Sheet'));

  // Part 4: Operating Ratios
  assert.match(lesson.parts[3].title, /Operating Ratios/i);
  assert.ok(lesson.parts[3].code?.includes('OperatingRatioAnalysis') || lesson.parts[3].code?.includes('operating_ratio'));
  assert.ok(lesson.parts[3].output?.includes('Operating Ratio'));

  // Part 5: P&L to Balance Sheet Equity Bridge
  assert.match(lesson.parts[4].title, /Balance Sheet Capital Integration/i);
  assert.ok(lesson.parts[4].code?.includes('CapitalIntegrationEngine') || lesson.parts[4].code?.includes('Closing Capital'));
  assert.ok(lesson.parts[4].output?.includes('Closing Owner Capital'));
});

test('Block 131: B.Com Accounting Day 14: Balance Sheet Marshalling & Working Capital Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 14);
  assert.equal(lesson.day, 14);

  // Part 1: Permanence vs Liquidity
  assert.match(lesson.parts[0].title, /Permanence.*Liquidity/i);
  assert.ok(lesson.parts[0].code?.includes('MarshallingOrder') || lesson.parts[0].code?.includes('PERMANENCE'));
  assert.ok(lesson.parts[0].output?.includes('Total Assets'));

  // Part 2: Net Working Capital & Liquidity Ratios
  assert.match(lesson.parts[1].title, /Working Capital/i);
  assert.ok(lesson.parts[1].code?.includes('Current Ratio') || lesson.parts[1].code?.includes('Quick Ratio'));
  assert.ok(lesson.parts[1].output?.includes('Net Working Capital'));

  // Part 3: IAS 1 / Schedule III Classifications
  assert.match(lesson.parts[2].title, /Non-Current.*Current/i);
  assert.ok(lesson.parts[2].code?.includes('ClassifiedBalanceSheet'));
  assert.ok(lesson.parts[2].output?.includes('Total Assets'));

  // Part 4: Capital Structure & Proprietary Ratios
  assert.match(lesson.parts[3].title, /Capital Structure/i);
  assert.ok(lesson.parts[3].code?.includes('SolvencyEngine') || lesson.parts[3].code?.includes('Debt-to-Equity'));
  assert.ok(lesson.parts[3].output?.includes('Debt-to-Equity'));

  // Part 5: Trial Balance to Balance Sheet Mapping Pipeline
  assert.match(lesson.parts[4].title, /Trial Balance.*Mapping/i);
  assert.ok(lesson.parts[4].code?.includes('FinancialStatementPipeline'));
  assert.ok(lesson.parts[4].output?.includes('EQUILIBRIUM VERIFIED'));
});

test('Block 131: B.Com Accounting Day 15 Capstone: Year-End Closing Engine & Accreditation Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 15);
  assert.equal(lesson.day, 15);
  assert.equal(lesson.minutes, 50);

  // Part 1: Period-End Adjusting Journal Entries
  assert.match(lesson.parts[0].title, /Adjusting Journal Entries/i);
  assert.ok(lesson.parts[0].code?.includes('AdjustingEntry'));
  assert.ok(lesson.parts[0].output?.includes('Total Adjustment Debits'));

  // Part 2: Integrated Trading and P&L
  assert.match(lesson.parts[1].title, /Integrated Trading and Profit & Loss/i);
  assert.ok(lesson.parts[1].code?.includes('IncomeStatement'));
  assert.ok(lesson.parts[1].output?.includes('GROSS PROFIT CARRIED DOWN'));
  assert.ok(lesson.parts[1].output?.includes('NET PROFIT FOR THE YEAR'));

  // Part 3: Final Marshalled Balance Sheet
  assert.match(lesson.parts[2].title, /Final Marshalled Balance Sheet/i);
  assert.ok(lesson.parts[2].code?.includes('BalanceSheet'));
  assert.ok(lesson.parts[2].output?.includes('EQUATION EQUILIBRIUM VERIFIED : True'));

  // Part 4: Post-Closing Trial Balance
  assert.match(lesson.parts[3].title, /Post-Closing Trial Balance/i);
  assert.ok(lesson.parts[3].code?.includes('POST-CLOSING TRIAL BALANCE'));
  assert.ok(lesson.parts[3].output?.includes('Post-Closing Equilibrium Verified: True'));

  // Part 5: Financial Statement Dashboard & Controller Accreditation
  assert.match(lesson.parts[4].title, /Controller Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('FinancialDashboard'));
  assert.ok(lesson.parts[4].output?.includes('ACCREDITATION STATUS: MILESTONE 3 CAPSTONE COMPLETED SUCCESSFULLY'));
  assert.ok(lesson.parts[4].output?.includes('AUDIT OPINION       : UNQUALIFIED'));
});

test('Block 131: B.Com Accounting Days 11-15 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 11; d <= 15; d++) {
    const pad = String(d).padStart(2, '0');
    const visPath = path.join(__dirname, `../src/lib/data/lessonVisuals/bcom-accounting/day-${pad}.json`);
    assert.ok(fs.existsSync(visPath), `Visual JSON must exist for Day ${d}`);

    const vis = JSON.parse(fs.readFileSync(visPath, 'utf8'));
    assert.equal(vis.prefix, 'bcom-accounting');
    assert.equal(vis.day, d);
    assert.equal(vis.entries.length, 5, `Day ${d} visual must contain exactly 5 entries`);

    const lesson = getLongLesson('bcom-accounting', d);
    for (let i = 0; i < 5; i++) {
      const entry = vis.entries[i];
      const part = lesson.parts[i];

      assert.equal(entry.spec.template, 'ledger-sheet', `Day ${d} Part ${i + 1} must use ledger-sheet template`);
      assert.ok(entry.spec.steps.length >= 3, `Day ${d} Part ${i + 1} visual must have >= 3 steps`);

      // Verify SHA-256 binding between code and visual entry
      const expectedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(entry.codeHash, expectedHash, `Day ${d} Part ${i + 1} visual codeHash must match actual part.code`);
    }
  }
});
"""

test_file = "tests/bcom_finance_accounting_long_lessons.test.ts"
with open(test_file, "a", encoding="utf-8") as f:
    f.write(block3_tests)

print("Appended Block 131 tests to", test_file)
