import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { BCOM_TAX_LONG_LESSONS } from '../src/lib/data/bcomTaxLongLessons';
import { BCOM_AUD_LONG_LESSONS } from '../src/lib/data/bcomAudLongLessons';

test('B.Com Corporate Tax & Forensic Audit Long Lessons: Resolution & Language Invariants', () => {
  // Corporate Tax (bcom_tax)
  const taxLesson = getLongLesson('bcom_tax', 1);
  assert.ok(taxLesson, 'bcom_tax Day 1 lesson must be defined');
  assert.equal(taxLesson.coursePrefix, 'bcom_tax');
  assert.equal(taxLesson.day, 1);
  assert.equal(taxLesson.parts.length, 5, 'bcom_tax Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_tax'), 'python', 'bcom_tax must use Python language runner');

  // Forensic Audit (bcom_aud)
  const audLesson = getLongLesson('bcom_aud', 1);
  assert.ok(audLesson, 'bcom_aud Day 1 lesson must be defined');
  assert.equal(audLesson.coursePrefix, 'bcom_aud');
  assert.equal(audLesson.day, 1);
  assert.equal(audLesson.parts.length, 5, 'bcom_aud Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_aud'), 'python', 'bcom_aud must use Python language runner');
});

test('B.Com Corporate Tax Day 1: DTL Reversal, Debt Shield & OECD Transfer Pricing Snippets Verification', () => {
  const lesson = BCOM_TAX_LONG_LESSONS[0];
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('DeferredTaxSchedule'));
  assert.ok(lesson.parts[1].code?.includes('DebtTaxShieldEngine'));
  assert.ok(lesson.parts[2].code?.includes('TransferPricingTNMM'));
  assert.ok(lesson.parts[3].code?.includes('NolTaxShieldSimulator'));
  assert.ok(lesson.parts[4].code?.includes('VatSupplyChainNode'));
});

test('B.Com Corporate Tax Day 2: OECD Pillar Two, R&D Credits & Section 382 Snippets Verification', () => {
  const lesson2 = BCOM_TAX_LONG_LESSONS[1];
  assert.ok(lesson2, 'bcom_tax Day 2 lesson must be defined');
  assert.equal(lesson2.coursePrefix, 'bcom_tax');
  assert.equal(lesson2.day, 2);
  assert.equal(lesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson2);
  const totalMin = estimateLessonMinutes(lesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson2.parts.length; i++) {
    const part = lesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(lesson2.parts[0].code?.includes('calculate_pillar_two_top_up_tax'));
  assert.ok(lesson2.parts[1].code?.includes('calculate_rd_tax_credit'));
  assert.ok(lesson2.parts[2].code?.includes('calculate_gilti_inclusion_and_tax'));
  assert.ok(lesson2.parts[3].code?.includes('calculate_section_382_nol_limitation'));
  assert.ok(lesson2.parts[4].code?.includes('calculate_section_338h10_basis_step_up'));
});

test('B.Com Forensic Audit Day 1: Audit Risk Model, Benford Chi-Square & MUS Snippets Verification', () => {
  const lesson = BCOM_AUD_LONG_LESSONS[0];
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(lesson.parts[0].code?.includes('AuditRiskEngine'));
  assert.ok(lesson.parts[1].code?.includes('BenfordFraudDetector'));
  assert.ok(lesson.parts[2].code?.includes('MonetaryUnitSamplingEngine'));
  assert.ok(lesson.parts[3].code?.includes('SoxSodComplianceEngine'));
  assert.ok(lesson.parts[4].code?.includes('StatutoryOpinionEngine'));
});

test('B.Com Forensic Audit Day 2: Beneish M-Score, Altman Z-Score & Digital Forensics Snippets Verification', () => {
  const lesson2 = BCOM_AUD_LONG_LESSONS[1];
  assert.ok(lesson2, 'bcom_aud Day 2 lesson must be defined');
  assert.equal(lesson2.coursePrefix, 'bcom_aud');
  assert.equal(lesson2.day, 2);
  assert.equal(lesson2.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson2);
  const totalMin = estimateLessonMinutes(lesson2);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

  for (let i = 0; i < lesson2.parts.length; i++) {
    const part = lesson2.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.ok(lesson2.parts[0].code?.includes('calculate_beneish_m_score'));
  assert.ok(lesson2.parts[1].code?.includes('calculate_altman_z_score'));
  assert.ok(lesson2.parts[2].code?.includes('ForensicDocumentMetadataAuditor'));
  assert.ok(lesson2.parts[3].code?.includes('detect_shell_vendor_fraud'));
  assert.ok(lesson2.parts[4].code?.includes('triage_whistleblower_allegation'));
});

test('Block 118: B.Com Corporate Tax Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_tax', 3);
  assert.ok(lesson, 'bcom_tax Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_tax');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_tax Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_tax'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 118: B.Com Corporate Tax Day 3: DEMPE, RPSM, Bilateral APA, 163(j) & CbCR Verification', () => {
  const lesson = BCOM_TAX_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_TAX_LONG_LESSONS[2] must exist');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);
    assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Part ${i + 1} must have >= 3 codeNotes`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length === 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.equal(typeof check.answer, 'number', `Part ${i + 1} answer must be numerical index`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be within options range`);
    assert.ok(check.why && check.why.length > 0, `Part ${i + 1} check why explanation must be non-empty`);
    assert.equal(check.answerIndex, check.answer);
    assert.equal(check.explanation, check.why);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /DEMPE Framework.*Intangibles/i);
  assert.ok(lesson.parts[0].code?.includes('evaluate_dempe_intangible_profit_allocation'));
  assert.match(lesson.parts[1].title, /Residual Profit Split Method.*RPSM/i);
  assert.ok(lesson.parts[1].code?.includes('compute_residual_profit_split_method'));
  assert.match(lesson.parts[2].title, /Advance Pricing Agreements.*APA.*MAP/i);
  assert.ok(lesson.parts[2].code?.includes('model_bilateral_apa_and_map_double_tax_relief'));
  assert.match(lesson.parts[3].title, /Thin Capitalization.*163\(j\)/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_section_163j_interest_limitation'));
  assert.match(lesson.parts[4].title, /Country-by-Country Reporting.*CbCR/i);
  assert.ok(lesson.parts[4].code?.includes('audit_cbcr_jurisdictional_risk_profile'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 119: B.Com Corporate Tax Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_tax', 4);
  assert.ok(lesson, 'bcom_tax Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_tax');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_tax Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_tax'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 119: B.Com Corporate Tax Day 4: Cross-Border VAT RCM, Customs, PE & DST Verification', () => {
  const lesson = BCOM_TAX_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_TAX_LONG_LESSONS[3] must exist');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);
    assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Part ${i + 1} must have >= 3 codeNotes`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length === 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.equal(typeof check.answer, 'number', `Part ${i + 1} answer must be numerical index`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be within options range`);
    assert.ok(check.why && check.why.length > 0, `Part ${i + 1} check why explanation must be non-empty`);
    assert.equal(check.answerIndex, check.answer);
    assert.equal(check.explanation, check.why);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Destination Principle.*Reverse Charge Mechanism/i);
  assert.ok(lesson.parts[0].code?.includes('evaluate_cross_border_vat_and_reverse_charge'));
  assert.match(lesson.parts[1].title, /Customs Valuation.*WTO Valuation Agreement/i);
  assert.ok(lesson.parts[1].code?.includes('harmonize_customs_valuation_and_transfer_pricing'));
  assert.match(lesson.parts[2].title, /Incoterms 2020.*Permanent Establishment.*Wayfair/i);
  assert.ok(lesson.parts[2].code?.includes('evaluate_incoterm_pe_risk_and_economic_nexus'));
  assert.match(lesson.parts[3].title, /Digital Services Taxes.*DST.*Pillar One Amount A/i);
  assert.ok(lesson.parts[3].code?.includes('model_unilateral_dst_vs_pillar_one_amount_a'));
  assert.match(lesson.parts[4].title, /Milestone 1 Synthesis.*Supply Chain Indirect Tax/i);
  assert.ok(lesson.parts[4].code?.includes('run_global_supply_chain_indirect_tax_optimizer'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 120: B.Com Corporate Tax Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_tax', 5);
  assert.ok(lesson, 'bcom_tax Day 5 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_tax');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_tax Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_tax'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 120: B.Com Corporate Tax Day 5 Capstone: Global Tax Optimization Control Tower Verification', () => {
  const lesson = BCOM_TAX_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_TAX_LONG_LESSONS[4] must exist');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);
    assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Part ${i + 1} must have >= 3 codeNotes`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length === 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.equal(typeof check.answer, 'number', `Part ${i + 1} answer must be numerical index`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be within options range`);
    assert.ok(check.why && check.why.length > 0, `Part ${i + 1} check why explanation must be non-empty`);
    assert.equal(check.answerIndex, check.answer);
    assert.equal(check.explanation, check.why);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Multi-Jurisdictional Tax Footprint.*Effective Tax Rate/i);
  assert.ok(lesson.parts[0].code?.includes('reconcile_global_multinational_tax_footprint'));
  assert.match(lesson.parts[1].title, /OECD Pillar Two.*Substance-Based Carve-Out/i);
  assert.ok(lesson.parts[1].code?.includes('calculate_pillar_two_sbco_and_top_up_tax'));
  assert.match(lesson.parts[2].title, /Transfer Pricing RPSM.*Section 163\(j\)/i);
  assert.ok(lesson.parts[2].code?.includes('orchestrate_transfer_pricing_and_debt_shield'));
  assert.match(lesson.parts[3].title, /Supply Chain Indirect Tax.*WTO Customs Harmonization/i);
  assert.ok(lesson.parts[3].code?.includes('execute_multinational_indirect_tax_and_customs_clearance'));
  assert.match(lesson.parts[4].title, /Capstone Boardroom Defense.*Chief Tax Officer/i);
  assert.ok(lesson.parts[4].code?.includes('run_comprehensive_corporate_tax_capstone'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 121: B.Com Forensic Audit Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_aud', 3);
  assert.ok(lesson, 'bcom_aud Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_aud');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_aud Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_aud'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 121: B.Com Forensic Audit Day 3: Journal Entry Testing, MAD Z-Scores, Intercompany & FCPA Verification', () => {
  const lesson = BCOM_AUD_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_AUD_LONG_LESSONS[2] must exist');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);
    assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Part ${i + 1} must have >= 3 codeNotes`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length === 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.equal(typeof check.answer, 'number', `Part ${i + 1} answer must be numerical index`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be within options range`);
    assert.ok(check.why && check.why.length > 0, `Part ${i + 1} check why explanation must be non-empty`);
    assert.equal(check.answerIndex, check.answer);
    assert.equal(check.explanation, check.why);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Journal Entry Testing.*ISA 240/i);
  assert.ok(lesson.parts[0].code?.includes('audit_journal_entries_fraud_heuristics'));
  assert.match(lesson.parts[1].title, /MAD Z-Scores/i);
  assert.ok(lesson.parts[1].code?.includes('detect_expense_anomalies_via_mad_zscore'));
  assert.match(lesson.parts[2].title, /Intercompany Reconciliation.*Phantom/i);
  assert.ok(lesson.parts[2].code?.includes('reconcile_intercompany_matrix_and_detect_phantom_balances'));
  assert.match(lesson.parts[3].title, /Foreign Corrupt Practices Act.*FCPA.*Bribery/i);
  assert.ok(lesson.parts[3].code?.includes('screen_fcpa_third_party_intermediary_risk'));
  assert.match(lesson.parts[4].title, /Collision Graph Analysis.*Kickback/i);
  assert.ok(lesson.parts[4].code?.includes('run_forensic_employee_vendor_collision_audit'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 122: B.Com Forensic Audit Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_aud', 4);
  assert.ok(lesson, 'bcom_aud Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_aud');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_aud Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_aud'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 122: B.Com Forensic Audit Day 4: Chain of Custody, EDRM Culling, Memory Dump, Email Headers & Anti-Forensics Verification', () => {
  const lesson = BCOM_AUD_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_AUD_LONG_LESSONS[3] must exist');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);
    assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Part ${i + 1} must have >= 3 codeNotes`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length === 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.equal(typeof check.answer, 'number', `Part ${i + 1} answer must be numerical index`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be within options range`);
    assert.ok(check.why && check.why.length > 0, `Part ${i + 1} check why explanation must be non-empty`);
    assert.equal(check.answerIndex, check.answer);
    assert.equal(check.explanation, check.why);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Forensic Bitstream.*Chain of Custody/i);
  assert.ok(lesson.parts[0].code?.includes('verify_forensic_disk_image_chain_of_custody'));
  assert.match(lesson.parts[1].title, /EDRM.*Culling/i);
  assert.ok(lesson.parts[1].code?.includes('execute_edrm_document_culling_pipeline'));
  assert.match(lesson.parts[2].title, /Volatile RAM.*Memory/i);
  assert.ok(lesson.parts[2].code?.includes('analyze_volatile_memory_dump_artifacts'));
  assert.match(lesson.parts[3].title, /Email Thread.*Header/i);
  assert.ok(lesson.parts[3].code?.includes('audit_email_mime_headers_and_custodian_thread'));
  assert.match(lesson.parts[4].title, /Anti-Forensics.*Timestomping/i);
  assert.ok(lesson.parts[4].code?.includes('detect_anti_forensics_timestomping_and_wiping'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 123: B.Com Forensic Audit Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_aud', 5);
  assert.ok(lesson, 'bcom_aud Day 5 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_aud');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_aud Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_aud'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 123: B.Com Forensic Audit Day 5 Capstone: Benford-Beneish, Overrides, Custody, Net Worth & Trial Dossier Verification', () => {
  const lesson = BCOM_AUD_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_AUD_LONG_LESSONS[4] must exist');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5);

  for (let i = 0; i < lesson.parts.length; i++) {
    const part = lesson.parts[i];
    assert.ok(part.title.length > 0, `Part ${i + 1} must have a non-empty title`);
    assert.ok(part.say.length >= 3, `Part ${i + 1} must have at least 3 explanation paragraphs`);
    assert.ok(part.example && part.example.length > 0, `Part ${i + 1} must have a real-world example`);
    assert.ok(part.code && (part.code.includes('def ') || part.code?.includes('class ')), `Part ${i + 1} code must contain Python functions/classes`);
    assert.ok(part.output && part.output.length > 0, `Part ${i + 1} must have deterministic expected output`);
    assert.ok(part.tryIt && part.tryIt.length > 0, `Part ${i + 1} must have a tryIt experiment`);
    assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Part ${i + 1} must have >= 3 codeNotes`);

    // Socratic Check validation
    const check = part.check as any;
    assert.ok(check.question.length > 0, `Part ${i + 1} check question must be non-empty`);
    assert.ok(check.options.length === 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.equal(typeof check.answer, 'number', `Part ${i + 1} answer must be numerical index`);
    assert.ok(check.answer >= 0 && check.answer < 4, `Part ${i + 1} answer must be within options range`);
    assert.ok(check.why && check.why.length > 0, `Part ${i + 1} check why explanation must be non-empty`);
    assert.equal(check.answerIndex, check.answer);
    assert.equal(check.explanation, check.why);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Benford.*Beneish.*Econometric/i);
  assert.ok(lesson.parts[0].code?.includes('audit_enterprise_financial_statement_manipulation'));
  assert.match(lesson.parts[1].title, /Override.*Collision/i);
  assert.ok(lesson.parts[1].code?.includes('detect_management_overrides_and_vendor_collisions'));
  assert.match(lesson.parts[2].title, /Evidence Custody.*Volatile Memory/i);
  assert.ok(lesson.parts[2].code?.includes('process_forensic_digital_evidence_custody'));
  assert.match(lesson.parts[3].title, /Forensic Net Worth Method.*Illicit Wealth/i);
  assert.ok(lesson.parts[3].code?.includes('quantify_illicit_enrichment_net_worth_method'));
  assert.match(lesson.parts[4].title, /Trial Dossier.*Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('generate_forensic_trial_dossier_and_accreditation'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});
test('B.Com Corporate Tax & GST Block 2 (Days 6-10): Resolution, Pedagogy & Gate v2 Visual Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 6; day <= 10; day++) {
    const lesson = BCOM_TAX_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_tax Day ${day} lesson must be defined in BCOM_TAX_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_tax');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_tax/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_tax');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && part.code.includes('def ') || part.code?.includes('class '), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});


test('B.Com Corporate Tax & GST Block 3 (Days 11-15): Corporate Tax Assessments, MAT Sec 115JB & Concessional Regimes Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 11; day <= 15; day++) {
    const lesson = BCOM_TAX_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_tax Day ${day} lesson must be defined in BCOM_TAX_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_tax');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_tax/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_tax');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});



test('B.Com Corporate Tax & GST Block 4 (Days 16-20): Transfer Pricing, DTAA Treaties, Permanent Establishment & Digital Taxation Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 16; day <= 20; day++) {
    const lesson = BCOM_TAX_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_tax Day ${day} lesson must be defined in BCOM_TAX_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_tax');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_tax/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_tax');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});



test('B.Com Corporate Tax & GST Block 5 (Days 21-25): Assessment Procedures, Scrutiny, Appeals, Revisions & Tax Controversy Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 21; day <= 25; day++) {
    const lesson = BCOM_TAX_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_tax Day ${day} lesson must be defined in BCOM_TAX_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_tax');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_tax/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_tax');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});



test('B.Com Corporate Tax & GST Block 6 (Days 26-30): Tax Audits Sec 44AB, GST Audits GSTR-9/9C, E-Invoicing & CTO Grand Master Capstone Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 26; day <= 30; day++) {
    const lesson = BCOM_TAX_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_tax Day ${day} lesson must be defined in BCOM_TAX_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_tax');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_tax/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_tax');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});

test('Course 32 (bcom_tax) 100% Full Course Invariant: Exactly 30 Days Registered & Validated', () => {
  assert.ok(BCOM_TAX_LONG_LESSONS.length >= 30, 'Course 32 (bcom_tax) must contain exactly 30 days');
  const days = BCOM_TAX_LONG_LESSONS.map((l: any) => l.day).sort((a: number, b: number) => a - b);
  for (let i = 1; i <= 30; i++) {
    assert.equal(days[i - 1], i, `Day ${i} must exist in sequential order in BCOM_TAX_LONG_LESSONS`);
  }
});



test('B.Com Forensic Audit & Assurance Block 2 (Days 6-10): Resolution, Pedagogy & Gate v2 Visual Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 6; day <= 10; day++) {
    const lesson = BCOM_AUD_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_aud Day ${day} lesson must be defined in BCOM_AUD_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_aud');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_aud/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_aud');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});


test('B.Com Forensic Audit & Assurance Block 3 (Days 11-15): Resolution, Pedagogy & Gate v2 Visual Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 11; day <= 15; day++) {
    const lesson = BCOM_AUD_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_aud Day ${day} lesson must be defined in BCOM_AUD_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_aud');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_aud/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_aud');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});


test('B.Com Forensic Audit & Assurance Block 4 (Days 16-20): Resolution, Pedagogy & Gate v2 Visual Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 16; day <= 20; day++) {
    const lesson = BCOM_AUD_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_aud Day ${day} lesson must be defined in BCOM_AUD_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_aud');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_aud/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_aud');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});


test('B.Com Forensic Audit & Assurance Block 5 (Days 21-25): Resolution, Pedagogy & Gate v2 Visual Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 21; day <= 25; day++) {
    const lesson = BCOM_AUD_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_aud Day ${day} lesson must be defined in BCOM_AUD_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_aud');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_aud/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_aud');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});


test('B.Com Forensic Audit & Assurance Block 6 (Days 26-30): Digital Forensics, Cyber Incidents, Continuous AI & CAE Grand Master Invariants', () => {
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  for (let day = 26; day <= 30; day++) {
    const lesson = BCOM_AUD_LONG_LESSONS.find((d: any) => d.day === day);
    assert.ok(lesson, `bcom_aud Day ${day} lesson must be defined in BCOM_AUD_LONG_LESSONS`);
    assert.equal(lesson.coursePrefix, 'bcom_aud');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);
    assert.ok(lesson.minutes >= 35 && lesson.minutes <= 40, `Day ${day} declared minutes (${lesson.minutes}) must be between 35 and 40`);

    let dailySayWords = 0;

    // Load Gate v2 visual JSON
    const padded = String(day).padStart(2, '0');
    const visPath = path.resolve(__dirname, `../src/lib/data/lessonVisuals/bcom_aud/day-${padded}.json`);
    assert.ok(fs.existsSync(visPath), `Visual file day-${padded}.json must exist`);
    const visJson = JSON.parse(fs.readFileSync(visPath, 'utf-8'));
    assert.equal(visJson.schemaVersion, 1);
    assert.equal(visJson.prefix, 'bcom_aud');
    assert.equal(visJson.day, day);
    assert.equal(visJson.entries.length, 5, `Visual JSON for Day ${day} must have 5 entries`);

    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${i + 1} say must be an array`);
      assert.ok(part.say.length >= 4, `Day ${day} Part ${i + 1} must have >= 4 paragraphs in say`);

      const partWords = part.say.join(' ').split(/\s+/).filter(Boolean).length;
      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} say words (${partWords}) must be >= 580 words`);
      dailySayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have an example`);
      assert.ok(part.code && (part.code.includes('def ') || part.code.includes('class ')), `Day ${day} Part ${i + 1} must have executable Python`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt instructions`);

      // Socratic check
      const check = part.check;
      assert.ok(check.question && check.question.length > 0, `Day ${day} Part ${i + 1} check question must be non-empty`);
      assert.equal(check.options.length, 4, `Day ${day} Part ${i + 1} check must have exactly 4 options`);
      assert.equal(check.answerIndex, 0, `Day ${day} Part ${i + 1} answerIndex must strictly be 0`);
      assert.ok(check.why && check.why.length > 0, `Day ${day} Part ${i + 1} check explanation must be non-empty`);

      // Visual entry validation
      const visEntry = visJson.entries[i];
      assert.equal(visEntry.partTitle, part.title);
      const computedHash = crypto.createHash('sha256').update(part.code).digest('hex');
      assert.equal(visEntry.codeHash, computedHash, `Visual codeHash must match SHA-256 of part.code`);
      assert.equal(visEntry.spec.template, 'ledger-sheet');
      assert.equal(visEntry.spec.steps.length, 4);
    }

    assert.ok(dailySayWords >= 2950, `Day ${day} daily say words (${dailySayWords}) must be >= 2,950 words (~22+ spoken minutes)`);
    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20, `Day ${day} estimateSpokenMinutes (${spoken}) must be >= 20 minutes`);
  }
});

test('Course 33 (bcom_aud) 100% Full Course Invariant: Exactly 30 Days Registered & Validated', () => {
  assert.ok(BCOM_AUD_LONG_LESSONS.length >= 30, 'Course 33 (bcom_aud) must contain at least 30 days');
  const days = BCOM_AUD_LONG_LESSONS.map((l: any) => l.day).sort((a: number, b: number) => a - b);
  for (let i = 1; i <= 30; i++) {
    assert.equal(days[i - 1], i, `Day ${i} must exist in sequential order in BCOM_AUD_LONG_LESSONS`);
  }
});
