block3_tests = """

test('Block 131: B.Com Accounting Days 11-15: Resolution & Structure Invariants', () => {
  for (let d = 11; d <= 15; d++) {
    const lesson = getLongLesson('bcom-accounting', d);
    assert.ok(lesson, `bcom-accounting Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-accounting');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `bcom-accounting Day ${d} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom-accounting'), 'python');

    const expectedMin = d === 15 ? 50 : 45;
    assert.equal(lesson.minutes, expectedMin, `Day ${d} minutes must be ${expectedMin}`);

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 8, `Day ${d} spoken minutes (${spoken}) must be at least 8`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 15, `Day ${d} total lesson minutes (${total}) must be at least 15`);

    assert.ok(lesson.summary && lesson.summary.length >= 4, `Day ${d} summary must have >= 4 bullets`);
    assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, `Day ${d} projectStep must have title and >= 4 steps`);

    for (let i = 0; i < lesson.parts.length; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${d} Part ${i + 1} must have a title`);

      const words = part.say.join(' ').split(/\\s+/).length;
      assert.ok(words >= 580, `Day ${d} Part ${i + 1} word count (${words}) must be >= 580`);

      assert.ok(part.example && part.example.length > 0, `Day ${d} Part ${i + 1} must have an example`);
      assert.ok(part.code && part.code.trim().length > 0, `Day ${d} Part ${i + 1} code must not be empty`);
      assert.ok(part.output && part.output.trim().length > 0, `Day ${d} Part ${i + 1} must have expected output`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${d} Part ${i + 1} must have tryIt instructions`);

      // Socratic Check Invariants
      const check = part.check as any;
      assert.ok(check.question.length > 10, `Day ${d} Part ${i + 1} check question must be descriptive`);
      assert.equal(check.options.length, 4, `Day ${d} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(typeof check.answer, 'number', `Day ${d} Part ${i + 1} answer must be number`);
      assert.equal(check.answer, 0, `Day ${d} Part ${i + 1} answer index must be 0`);
      assert.equal(check.answerIndex, 0, `Day ${d} Part ${i + 1} answerIndex must be 0`);
      assert.ok(check.why && check.why.length > 10, `Day ${d} Part ${i + 1} check must have why explanation`);
    }
  }
});

test('Block 131: B.Com Accounting Day 11: Depreciation (SLM vs WDV), Disposal & IAS 12 Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 11);
  assert.equal(lesson.day, 11);

  // Part 1: SLM vs WDV
  assert.match(lesson.parts[0].title, /SLM.*vs.*WDV/i);
  assert.ok(lesson.parts[0].code?.includes('generate_dual_depreciation_schedule'));
  assert.ok(lesson.parts[0].output?.includes('Original Asset Cost'));

  // Part 2: Provision for Depreciation
  assert.match(lesson.parts[1].title, /Provision for Depreciation/i);
  assert.ok(lesson.parts[1].code?.includes('model_provision_for_depreciation_ledger'));
  assert.ok(lesson.parts[1].output?.includes('Historical Asset Cost'));

  // Part 3: Asset Disposal Account
  assert.match(lesson.parts[2].title, /Asset Disposal Account/i);
  assert.ok(lesson.parts[2].code?.includes('process_asset_disposal_transaction'));
  assert.ok(lesson.parts[2].output?.includes('Disposal Case 1'));

  // Part 4: Component Depreciation IAS 16
  assert.match(lesson.parts[3].title, /Component Depreciation/i);
  assert.ok(lesson.parts[3].code?.includes('model_component_depreciation_and_useful_life_revision'));
  assert.ok(lesson.parts[3].output?.includes('Initial Combined Annual Depreciation'));

  // Part 5: Tax vs Book Depreciation IAS 12
  assert.match(lesson.parts[4].title, /Tax Depreciation vs Book Depreciation/i);
  assert.ok(lesson.parts[4].code?.includes('compute_tax_vs_book_depreciation_timing_difference'));
  assert.ok(lesson.parts[4].output?.includes('Deferred Tax'));
});

test('Block 131: B.Com Accounting Day 12: Trading Account & COGS Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 12);
  assert.equal(lesson.day, 12);

  // Part 1: COGS Equation
  assert.match(lesson.parts[0].title, /Trading Account Architecture/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_trading_account_and_gross_profit'));
  assert.ok(lesson.parts[0].output?.includes('Net Sales Turnover'));

  // Part 2: Direct vs Indirect Expenses
  assert.match(lesson.parts[1].title, /Direct Expenses vs Indirect Expenses/i);
  assert.ok(lesson.parts[1].code?.includes('classify_expenditure_direct_vs_indirect'));
  assert.ok(lesson.parts[1].output?.includes('Total Direct Expenses'));

  // Part 3: Inventory Valuation IAS 2
  assert.match(lesson.parts[2].title, /Closing Inventory Valuation/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_inventory_at_cost_or_nrv'));
  assert.ok(lesson.parts[2].output?.includes('Gross Inventory at Historical Cost'));

  // Part 4: Abnormal Casualty Losses
  assert.match(lesson.parts[3].title, /Inventory Shrinkage Dynamics/i);
  assert.ok(lesson.parts[3].code?.includes('account_for_inventory_shrinkage_and_losses'));
  assert.ok(lesson.parts[3].output?.includes('Normal Spoilage Impact'));

  // Part 5: Manufacturing Account
  assert.match(lesson.parts[4].title, /Manufacturing Account/i);
  assert.ok(lesson.parts[4].code?.includes('compile_manufacturing_and_trading_account'));
  assert.ok(lesson.parts[4].output?.includes('Raw Materials Consumed'));
});

test('Block 131: B.Com Accounting Day 13: Profit & Loss Statement Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 13);
  assert.equal(lesson.day, 13);

  // Part 1: Multi-Step P&L
  assert.match(lesson.parts[0].title, /Multi-Step Income Statement Architecture/i);
  assert.ok(lesson.parts[0].code?.includes('generate_multi_step_income_statement'));
  assert.ok(lesson.parts[0].output?.includes('Gross Profit Brought Down'));

  // Part 2: Accrual & Prepayment Adjustments
  assert.match(lesson.parts[1].title, /Period-End Adjustments Architecture/i);
  assert.ok(lesson.parts[1].code?.includes('process_accruals_and_prepayments_adjustments'));
  assert.ok(lesson.parts[1].output?.includes('Adjusted Nominal P&L Expenses'));

  // Part 3: 4-Tier Debtors Provisions
  assert.match(lesson.parts[2].title, /Comprehensive Debtors Provisions/i);
  assert.ok(lesson.parts[2].code?.includes('calculate_comprehensive_debtors_provisions'));
  assert.ok(lesson.parts[2].output?.includes('Gross Debtors per Trial Balance'));

  // Part 4: Operating Ratios
  assert.match(lesson.parts[3].title, /Corporate Operating Ratios/i);
  assert.ok(lesson.parts[3].code?.includes('analyze_operating_ratios_and_margins'));
  assert.ok(lesson.parts[3].output?.includes('Gross Profit Ratio'));

  // Part 5: P&L to Balance Sheet Equity Bridge
  assert.match(lesson.parts[4].title, /Balance Sheet Capital Integration/i);
  assert.ok(lesson.parts[4].code?.includes('execute_pnl_to_balance_sheet_equity_integration'));
  assert.ok(lesson.parts[4].output?.includes('Opening Capital'));
});

test('Block 131: B.Com Accounting Day 14: Balance Sheet Marshalling & Working Capital Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 14);
  assert.equal(lesson.day, 14);

  // Part 1: Permanence vs Liquidity
  assert.match(lesson.parts[0].title, /Balance Sheet Marshalling Architecture/i);
  assert.ok(lesson.parts[0].code?.includes('marshal_balance_sheet'));
  assert.ok(lesson.parts[0].output?.includes('Permanence Order Balance Sheet'));

  // Part 2: Net Working Capital & Liquidity Ratios
  assert.match(lesson.parts[1].title, /Working Capital.*Liquidity Ratios/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_working_capital_and_liquidity_ratios'));
  assert.ok(lesson.parts[1].output?.includes('Current Assets'));

  // Part 3: IAS 1 / Schedule III Classifications
  assert.match(lesson.parts[2].title, /Non-Current vs Current Classification/i);
  assert.ok(lesson.parts[2].code?.includes('categorize_balance_sheet_subsystems'));
  assert.ok(lesson.parts[2].output?.includes('Balance Sheet Anatomy Totals'));

  // Part 4: Capital Structure & Proprietary Ratios
  assert.match(lesson.parts[3].title, /Capital Structure & Long-Term Solvency/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_capital_structure_and_solvency'));
  assert.ok(lesson.parts[3].output?.includes('Debt-to-Equity Ratio'));

  // Part 5: Trial Balance to Balance Sheet Mapping Pipeline
  assert.match(lesson.parts[4].title, /Trial Balance to Balance Sheet Mapping Pipeline/i);
  assert.ok(lesson.parts[4].code?.includes('verify_complete_trial_balance_to_balance_sheet_mapping'));
  assert.ok(lesson.parts[4].output?.includes('Total Adjusted Debits'));
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

print("Appended verified Block 131 tests to", test_file)
