block4_tests = """

test('Block 132: B.Com Accounting Days 16-20: Resolution & Structure Invariants', () => {
  for (let d = 16; d <= 20; d++) {
    const lesson = getLongLesson('bcom-accounting', d);
    assert.ok(lesson, `bcom-accounting Day ${d} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom-accounting');
    assert.equal(lesson.day, d);
    assert.equal(lesson.parts.length, 5, `bcom-accounting Day ${d} must have exactly 5 parts`);
    assert.equal(getLongLessonLanguage('bcom-accounting'), 'python');

    const expectedMin = d === 20 ? 50 : 45;
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

test('Block 132: B.Com Accounting Day 16: Tally Prime ERP Masters & Groups Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 16);
  assert.equal(lesson.day, 16);

  // Part 1: Company Master Creation
  assert.match(lesson.parts[0].title, /Company Master Creation/i);
  assert.ok(lesson.parts[0].code?.includes('TallyCompanyMaster'));
  assert.ok(lesson.parts[0].output?.includes('ACTIVE & INITIALIZED'));

  // Part 2: 28 Pre-Defined Groups
  assert.match(lesson.parts[1].title, /28 Pre-Defined Groups/i);
  assert.ok(lesson.parts[1].code?.includes('TallyGroupHierarchy'));
  assert.ok(lesson.parts[1].output?.includes('Total System Groups    : 28'));

  // Part 3: Ledger Master Creation & Group Mapping
  assert.match(lesson.parts[2].title, /Ledger Master Creation/i);
  assert.ok(lesson.parts[2].code?.includes('LedgerRegistry'));
  assert.ok(lesson.parts[2].output?.includes('PERFECTLY BALANCED (₹0.00 Diff)'));

  // Part 4: Cost Center & Cost Category
  assert.match(lesson.parts[3].title, /Cost Center & Cost Category/i);
  assert.ok(lesson.parts[3].code?.includes('CostAllocationEngine'));
  assert.ok(lesson.parts[3].output?.includes('Allocation Audit Status: PASSED'));

  // Part 5: Chart of Accounts Extraction & Audit
  assert.match(lesson.parts[4].title, /Chart of Accounts Extraction/i);
  assert.ok(lesson.parts[4].code?.includes('TallyChartOfAccountsAuditor'));
  assert.ok(lesson.parts[4].output?.includes('CHART OF ACCOUNTS STRUCTURE COMPLIANT'));
});

test('Block 132: B.Com Accounting Day 17: Tally Prime Vouchers & Daybook Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 17);
  assert.equal(lesson.day, 17);

  // Part 1: Voucher Keybindings F4-F9
  assert.match(lesson.parts[0].title, /Accounting Voucher Keybindings/i);
  assert.ok(lesson.parts[0].code?.includes('VoucherProcessingEngine'));
  assert.ok(lesson.parts[0].output?.includes('APPROVED_AND_POSTED'));

  // Part 2: Item Invoice Mode
  assert.match(lesson.parts[1].title, /Voucher Entry Modes/i);
  assert.ok(lesson.parts[1].code?.includes('ItemInvoiceProcessor'));
  assert.ok(lesson.parts[1].output?.includes('INVOICE GRAND TOTAL (INCL. TAXES)'));

  // Part 3: Bill-Wise Details & AR Aging
  assert.match(lesson.parts[2].title, /Bill-Wise Details/i);
  assert.ok(lesson.parts[2].code?.includes('BillWiseManager'));
  assert.ok(lesson.parts[2].output?.includes('TOTAL OUTSTANDING BALANCE'));

  // Part 4: Post-Dated Vouchers
  assert.match(lesson.parts[3].title, /Post-Dated.*Optional/i);
  assert.ok(lesson.parts[3].code?.includes('ProvisionalVoucherManager'));
  assert.ok(lesson.parts[3].output?.includes('Dormant Post-Dated Pipeline'));

  // Part 5: Daybook Extraction
  assert.match(lesson.parts[4].title, /General Ledger Posting.*Daybook/i);
  assert.ok(lesson.parts[4].code?.includes('TallyDaybookEngine'));
  assert.ok(lesson.parts[4].output?.includes('TALLY PRIME DAILY DAYBOOK REPORT'));
});

test('Block 132: B.Com Accounting Day 18: Dual GST Model & Tax Invoices Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 18);
  assert.equal(lesson.day, 18);

  // Part 1: Dual GST Architecture
  assert.match(lesson.parts[0].title, /Constitutional Framework.*Dual GST/i);
  assert.ok(lesson.parts[0].code?.includes('DualGstEngine'));
  assert.ok(lesson.parts[0].output?.includes('INTRA-STATE SUPPLY'));
  assert.ok(lesson.parts[0].output?.includes('INTER-STATE SUPPLY'));

  // Part 2: Place of Supply Rules
  assert.match(lesson.parts[1].title, /Place of Supply/i);
  assert.ok(lesson.parts[1].code?.includes('PlaceOfSupplyResolver'));
  assert.ok(lesson.parts[1].output?.includes('Bill-to Ship-to Computer Equipment'));

  // Part 3: HSN/SAC Classifications
  assert.match(lesson.parts[2].title, /HSN\/SAC Classifications/i);
  assert.ok(lesson.parts[2].code?.includes('GSTTariffEngine'));
  assert.ok(lesson.parts[2].output?.includes('GRAND TAX INVOICE AMOUNT'));

  // Part 4: Rule 46 Tax Invoice & Rule 48(4) e-Invoicing
  assert.match(lesson.parts[3].title, /Statutory Tax Invoice.*e-Invoicing/i);
  assert.ok(lesson.parts[3].code?.includes('StatutoryInvoiceValidator'));
  assert.ok(lesson.parts[3].output?.includes('e-Invoice IRN (SHA256)'));

  // Part 5: General Ledger Tax Accounting
  assert.match(lesson.parts[4].title, /General Ledger Tax Accounting/i);
  assert.ok(lesson.parts[4].code?.includes('GeneralLedgerTaxPipeline'));
  assert.ok(lesson.parts[4].output?.includes('Ledger Equilibrium Verified : True'));
});

test('Block 132: B.Com Accounting Day 19: GST ITC & Cross-Utilization Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 19);
  assert.equal(lesson.day, 19);

  // Part 1: Section 16 Eligibility
  assert.match(lesson.parts[0].title, /Section 16.*Eligibility/i);
  assert.ok(lesson.parts[0].code?.includes('Section16Validator'));
  assert.ok(lesson.parts[0].output?.includes('Status: ELIGIBLE'));
  assert.ok(lesson.parts[0].output?.includes('Status: DISALLOWED'));

  // Part 2: Section 17(5) Blocked Credits
  assert.match(lesson.parts[1].title, /Blocked Credits.*Section 17\(5\)/i);
  assert.ok(lesson.parts[1].code?.includes('BlockedCreditClassifier'));
  assert.ok(lesson.parts[1].output?.includes('Total Blocked ITC'));

  // Part 3: Section 49 Cross-Utilization
  assert.match(lesson.parts[2].title, /Cross-Utilization Set-Off Hierarchy/i);
  assert.ok(lesson.parts[2].code?.includes('GstSetOffOptimizer'));
  assert.ok(lesson.parts[2].output?.includes('STATUTORY GST ITC OPTIMAL SET-OFF SCHEDULE'));

  // Part 4: Rule 43 Capital Goods 60-Month Apportionment
  assert.match(lesson.parts[3].title, /Capital Goods ITC Apportionment.*60-Month/i);
  assert.ok(lesson.parts[3].code?.includes('Rule43CapitalGoodsApportioner'));
  assert.ok(lesson.parts[3].output?.includes('RULE 43 COMMON ITC MONTHLY REVERSAL AUDITED'));

  // Part 5: Electronic Ledger Balancing
  assert.match(lesson.parts[4].title, /Electronic Ledger Balancing/i);
  assert.ok(lesson.parts[4].code?.includes('GstTreasuryClearanceEngine'));
  assert.ok(lesson.parts[4].output?.includes('MONTHLY GST TREASURY CLEARANCE & CHALLAN REPORT'));
});

test('Block 132: B.Com Accounting Day 20 Capstone: GST Returns & Accreditation Snippets Verification', () => {
  const lesson = getLongLesson('bcom-accounting', 20);
  assert.equal(lesson.day, 20);
  assert.equal(lesson.minutes, 50);

  // Part 1: GSTR-1 Outward Return
  assert.match(lesson.parts[0].title, /GSTR-1 Outward Supplies/i);
  assert.ok(lesson.parts[0].code?.includes('Gstr1AggregationEngine'));
  assert.ok(lesson.parts[0].output?.includes('GSTR-1 STATUTORY OUTWARD RETURN SUMMARY'));

  // Part 2: GSTR-2B Static Auto-Drafted Statement
  assert.match(lesson.parts[1].title, /GSTR-2B Auto-Drafted Statement/i);
  assert.ok(lesson.parts[1].code?.includes('Gstr2bProcessingEngine'));
  assert.ok(lesson.parts[1].output?.includes('GSTR-2B STATIC AUTO-DRAFTED ITC STATEMENT'));

  // Part 3: Purchase Register vs GSTR-2B Auto Reconciliation
  assert.match(lesson.parts[2].title, /Purchase Register vs GSTR-2B Automated 3-Way Reconciliation/i);
  assert.ok(lesson.parts[2].code?.includes('Gstr2bReconciler'));
  assert.ok(lesson.parts[2].output?.includes('PURCHASE REGISTER vs GSTR-2B AUTOMATED RECONCILIATION'));

  // Part 4: Form GSTR-3B Monthly Summary & Net Tax Settlement
  assert.match(lesson.parts[3].title, /Form GSTR-3B Monthly Summary/i);
  assert.ok(lesson.parts[3].code?.includes('Gstr3bSettlementEngine'));
  assert.ok(lesson.parts[3].output?.includes('FORM GSTR-3B STATUTORY SETTLEMENT SUMMARY'));

  // Part 5: Controller Accreditation Dashboard
  assert.match(lesson.parts[4].title, /Financial Controller GST Compliance Audit/i);
  assert.ok(lesson.parts[4].code?.includes('GstControllerComplianceDashboard'));
  assert.ok(lesson.parts[4].output?.includes('ACCREDITATION STATUS: MILESTONE 4 CAPSTONE COMPLETED SUCCESSFULLY'));
  assert.ok(lesson.parts[4].output?.includes('STATUTORY VERDICT   : CERTIFIED CORPORATE GST & ERP CONTROLLER'));
});

test('Block 132: B.Com Accounting Days 16-20 Gate v2 Visual JSON Integrity Verification', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let d = 16; d <= 20; d++) {
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
    f.write(block4_tests)

print("Appended verified Block 132 tests to", test_file)
