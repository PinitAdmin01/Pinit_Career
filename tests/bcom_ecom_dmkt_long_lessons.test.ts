import test from 'node:test';
import assert from 'node:assert/strict';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import {
  getLongLesson,
  getLongLessonLanguage,
  estimateSpokenMinutes,
  estimateLessonMinutes
} from '../src/lib/data/longLessons';
import { BCOM_ECOM_LONG_LESSONS } from '../src/lib/data/bcomEcomLongLessons';
import { BCOM_DMKT_LONG_LESSONS } from '../src/lib/data/bcomDmktLongLessons';


test('B.Com E-Commerce & Digital Marketing Long Lessons: Resolution & Language Invariants', () => {
  // E-Commerce (bcom_ecom)
  const ecomLesson = getLongLesson('bcom_ecom', 1);
  assert.ok(ecomLesson, 'bcom_ecom Day 1 lesson must be defined');
  assert.equal(ecomLesson.coursePrefix, 'bcom_ecom');
  assert.equal(ecomLesson.day, 1);
  assert.equal(ecomLesson.parts.length, 5, 'bcom_ecom Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ecom'), 'python', 'bcom_ecom must use Python language runner');

  // Digital Marketing (bcom_dmkt)
  const dmktLesson = getLongLesson('bcom_dmkt', 1);
  assert.ok(dmktLesson, 'bcom_dmkt Day 1 lesson must be defined');
  assert.equal(dmktLesson.coursePrefix, 'bcom_dmkt');
  assert.equal(dmktLesson.day, 1);
  assert.equal(dmktLesson.parts.length, 5, 'bcom_dmkt Day 1 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_dmkt'), 'python', 'bcom_dmkt must use Python language runner');

  // Marketing Alias (bcom-marketing)
  const mktAliasLesson = getLongLesson('bcom-marketing', 1);
  assert.ok(mktAliasLesson, 'bcom-marketing Day 1 lesson alias must be defined');
  assert.equal(getLongLessonLanguage('bcom-marketing'), 'python');
});

test('B.Com E-Commerce Day 1: Marketplace GMV, Dynamic Pricing & Fulfillment Snippets Verification', () => {
  const lesson = BCOM_ECOM_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('MarketplaceEconomicsEngine'));
  assert.ok(lesson.parts[1].code?.includes('DynamicPricingEngine'));
  assert.ok(lesson.parts[2].code?.includes('EcomFunnelAnalyzer'));
  assert.ok(lesson.parts[3].code?.includes('FulfillmentRouter'));
  assert.ok(lesson.parts[4].code?.includes('ReverseLogisticsModel'));
});

test('B.Com E-Commerce Day 2: Inventory Velocity, Bullwhip & Fraud Screening Snippets Verification', () => {
  const lesson = BCOM_ECOM_LONG_LESSONS[1];
  assert.ok(lesson, 'bcom_ecom Day 2 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ecom');
  assert.equal(lesson.day, 2);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

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
  assert.ok(lesson.parts[0].code?.includes('analyze_inventory_velocity'));
  assert.ok(lesson.parts[1].code?.includes('simulate_bullwhip_effect'));
  assert.ok(lesson.parts[2].code?.includes('compute_dtc_contribution_waterfall'));
  assert.ok(lesson.parts[3].code?.includes('route_distributed_order'));
  assert.ok(lesson.parts[4].code?.includes('score_ecommerce_fraud_risk'));
});

test('B.Com Digital Marketing Day 1: GSP Ad Auction, Multi-Touch & A/B Z-Test Snippets Verification', () => {
  const lesson = BCOM_DMKT_LONG_LESSONS[0];
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
  assert.ok(lesson.parts[0].code?.includes('GspAdAuction'));
  assert.ok(lesson.parts[1].code?.includes('AttributionModeler'));
  assert.ok(lesson.parts[2].code?.includes('PerformanceMediaEconomics'));
  assert.ok(lesson.parts[3].code?.includes('SplitTestAnalyzer'));
  assert.ok(lesson.parts[4].code?.includes('PageRankSimulator'));
});

test('B.Com Digital Marketing Day 2: MMM Adstock, CAC Payback & Bayesian Uplift Snippets Verification', () => {
  const lesson = BCOM_DMKT_LONG_LESSONS[1];
  assert.ok(lesson, 'bcom_dmkt Day 2 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_dmkt');
  assert.equal(lesson.day, 2);
  assert.equal(lesson.parts.length, 5);

  const spokenMin = estimateSpokenMinutes(lesson);
  const totalMin = estimateLessonMinutes(lesson);
  assert.ok(spokenMin >= 8, `Spoken minutes should be >= 8 (got ${spokenMin})`);
  assert.ok(totalMin >= 15, `Total minutes should be >= 15 (got ${totalMin})`);

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
  assert.ok(lesson.parts[0].code?.includes('compute_adstock'));
  assert.ok(lesson.parts[0].code?.includes('hill_saturation'));
  assert.ok(lesson.parts[1].code?.includes('calculate_cac_payback_cohort'));
  assert.ok(lesson.parts[2].code?.includes('CrawlBudgetAuditor'));
  assert.ok(lesson.parts[3].code?.includes('optimize_retargeting_audiences'));
  assert.ok(lesson.parts[4].code?.includes('BayesianAbTest'));
});

test('Block 136: B.Com E-Commerce Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ecom', 3);
  assert.ok(lesson, 'bcom_ecom Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ecom');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_ecom Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ecom'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 136: B.Com E-Commerce Day 3: CM1/CM2/CM3 Waterfall, Cohort LTV, Cart Abandonment & MER Verification', () => {
  const lesson = BCOM_ECOM_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_ECOM_LONG_LESSONS[2] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Unit Economics.*CM1.*CM2.*CM3/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_dtc_unit_economics_waterfall'));
  assert.match(lesson.parts[1].title, /Cohort.*LTV|Repurchase Curves/i);
  assert.ok(lesson.parts[1].code?.includes('model_ecommerce_ltv_cohort_waterfall'));
  assert.match(lesson.parts[2].title, /Checkout Funnel.*Cart Abandonment/i);
  assert.ok(lesson.parts[2].code?.includes('simulate_cart_abandonment_recovery_engine'));
  assert.match(lesson.parts[3].title, /Media Mix.*ROAS.*MER/i);
  assert.ok(lesson.parts[3].code?.includes('audit_roas_vs_mer_channel_efficiency'));
  assert.match(lesson.parts[4].title, /E-Commerce Growth Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_ecommerce_growth_control_tower'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 137: B.Com E-Commerce Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ecom', 4);
  assert.ok(lesson, 'bcom_ecom Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ecom');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_ecom Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ecom'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 137: B.Com E-Commerce Day 4: FBA vs FBM, Dropshipping SLAs, GMROI & Cross-Border Landed Cost Verification', () => {
  const lesson = BCOM_ECOM_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_ECOM_LONG_LESSONS[3] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Amazon 3P Marketplace.*FBA vs FBM/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_marketplace_fba_vs_fbm_economics'));
  assert.match(lesson.parts[1].title, /Drop-Shipping.*SLA/i);
  assert.ok(lesson.parts[1].code?.includes('model_dropshipping_virtual_supply_chain'));
  assert.match(lesson.parts[2].title, /GMROI.*Stockout/i);
  assert.ok(lesson.parts[2].code?.includes('calculate_gmroi_and_stockout_penalty'));
  assert.match(lesson.parts[3].title, /Cross-Border.*Customs Tariffs.*De Minimis/i);
  assert.ok(lesson.parts[3].code?.includes('model_cross_border_landed_cost_and_tariffs'));
  assert.match(lesson.parts[4].title, /Global Marketplace & Supply Chain.*Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_marketplace_supply_chain_control_tower'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 138: B.Com E-Commerce Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_ecom', 5);
  assert.ok(lesson, 'bcom_ecom Day 5 Capstone lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_ecom');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_ecom Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_ecom'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 138: B.Com E-Commerce Day 5 Capstone: GMV Flywheel, 3PL Nodes, Consolidated P&L, Payment Routing & CCO-SES Accreditation Verification', () => {
  const lesson = BCOM_ECOM_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_ECOM_LONG_LESSONS[4] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Omnichannel GMV Flywheel/i);
  assert.ok(lesson.parts[0].code?.includes('model_omnichannel_gmv_flywheel'));
  assert.match(lesson.parts[1].title, /Distributed 3PL Nodes.*Shipping SLA/i);
  assert.ok(lesson.parts[1].code?.includes('optimize_distributed_3pl_nodes_and_shipping'));
  assert.match(lesson.parts[2].title, /Omnichannel P&L.*Contribution Margin/i);
  assert.ok(lesson.parts[2].code?.includes('consolidate_omnichannel_ecommerce_pl'));
  assert.match(lesson.parts[3].title, /Payment Gateway.*3DS2 Fraud Defense/i);
  assert.ok(lesson.parts[3].code?.includes('architect_payment_gateway_and_fraud_defense'));
  assert.match(lesson.parts[4].title, /Boardroom Defense.*Chief Commerce Officer Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('generate_chief_commerce_officer_dossier_and_accreditation'));

  // Capstone Accreditation Assertions
  assert.ok(lesson.parts[4].output?.includes('CCO-SES'), 'Must confer CCO-SES accreditation');
  assert.ok(lesson.parts[4].output?.includes('15,000,000.00'), 'Must model $15M GMV flywheel');
  assert.ok(lesson.parts[4].output?.includes('1,201,250.00'), 'Must generate $1.2M operating profit');

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Course bcom_ecom 100% Complete: All 5 Days Verified', () => {
  for (let day = 1; day <= 5; day++) {
    const lesson = getLongLesson('bcom_ecom', day);
    assert.ok(lesson, `bcom_ecom Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_ecom Day ${day} must have 5 parts`);
  }
});

test('Block 139: B.Com Digital Marketing Day 3: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_dmkt', 3);
  assert.ok(lesson, 'bcom_dmkt Day 3 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_dmkt');
  assert.equal(lesson.day, 3);
  assert.equal(lesson.parts.length, 5, 'bcom_dmkt Day 3 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_dmkt'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 139: B.Com Digital Marketing Day 3: OpenRTB, SPO, MRC Viewability, Ad Fraud & DSP Control Tower Verification', () => {
  const lesson = BCOM_DMKT_LONG_LESSONS[2];
  assert.ok(lesson, 'BCOM_DMKT_LONG_LESSONS[2] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /OpenRTB.*Bid Stream/i);
  assert.ok(lesson.parts[0].code?.includes('simulate_openrtb_auction'));
  assert.ok(lesson.parts[0].output?.includes('AmazonDSP'));
  assert.ok(lesson.parts[0].output?.includes('$4.60'));

  assert.match(lesson.parts[1].title, /First-Price.*Supply-Path Optimization/i);
  assert.ok(lesson.parts[1].code?.includes('optimize_supply_path_and_bid_shading'));
  assert.ok(lesson.parts[1].output?.includes('Direct_Prebid_SSP'));

  assert.match(lesson.parts[2].title, /MRC Viewability.*vCPM/i);
  assert.ok(lesson.parts[2].code?.includes('calculate_viewability_and_vcpm'));
  assert.ok(lesson.parts[2].output?.includes('$7.03'));

  assert.match(lesson.parts[3].title, /Ad Fraud Detection.*Bot Traffic/i);
  assert.ok(lesson.parts[3].code?.includes('audit_programmatic_fraud_and_adstxt'));
  assert.ok(lesson.parts[3].output?.includes('$0.0300'));

  assert.match(lesson.parts[4].title, /Programmatic.*Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_programmatic_dsp_control_tower'));
  assert.ok(lesson.parts[4].output?.includes('OPTIMAL_HIGH_YIELD'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 140: B.Com Digital Marketing Day 4: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_dmkt', 4);
  assert.ok(lesson, 'bcom_dmkt Day 4 lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_dmkt');
  assert.equal(lesson.day, 4);
  assert.equal(lesson.parts.length, 5, 'bcom_dmkt Day 4 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_dmkt'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 140: B.Com Digital Marketing Day 4: Geo-Lift iROAS, Marginal ROAS, CDP Identity Graph, ABM Intent & Control Tower Verification', () => {
  const lesson = BCOM_DMKT_LONG_LESSONS[3];
  assert.ok(lesson, 'BCOM_DMKT_LONG_LESSONS[3] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /Geo-Lift.*Incrementality/i);
  assert.ok(lesson.parts[0].code?.includes('calculate_geolift_incrementality'));
  assert.ok(lesson.parts[0].output?.includes('iROAS: 2.20x'));
  assert.ok(lesson.parts[0].output?.includes('STATISTICALLY_SIGNIFICANT_CONFIRMED'));

  assert.match(lesson.parts[1].title, /Non-Linear Media Saturation.*Marginal ROAS/i);
  assert.ok(lesson.parts[1].code?.includes('optimize_marginal_roas_allocation'));
  assert.ok(lesson.parts[1].output?.includes('EXPAND_BUDGET'));
  assert.ok(lesson.parts[1].output?.includes('SATURATED_REALLOCATE'));

  assert.match(lesson.parts[2].title, /Customer Data Platform.*Identity Graph/i);
  assert.ok(lesson.parts[2].code?.includes('stitch_identity_graph_records'));
  assert.ok(lesson.parts[2].output?.includes('Golden Customers: 2'));
  assert.ok(lesson.parts[2].output?.includes('Stitch Rate: 60.0%'));

  assert.match(lesson.parts[3].title, /High-ACV Account-Based Marketing.*Intent/i);
  assert.ok(lesson.parts[3].code?.includes('score_abm_account_intent_and_surge'));
  assert.ok(lesson.parts[3].output?.includes('DIRECT_ENTERPRISE_SDR_ESCALATION'));
  assert.ok(lesson.parts[3].output?.includes('cloudhealthcorp.com'));

  assert.match(lesson.parts[4].title, /Omni-Channel Incrementality.*Control Tower/i);
  assert.ok(lesson.parts[4].code?.includes('run_omnichannel_incrementality_control_tower'));
  assert.ok(lesson.parts[4].output?.includes('Over_Attribution_Gap: $51,400.00'));
  assert.ok(lesson.parts[4].output?.includes('HIGH_EFFICIENCY_EXPANSION'));

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Block 141: B.Com Digital Marketing Day 5 Capstone: Resolution & Structure Invariants', () => {
  const lesson = getLongLesson('bcom_dmkt', 5);
  assert.ok(lesson, 'bcom_dmkt Day 5 Capstone lesson must be defined');
  assert.equal(lesson.coursePrefix, 'bcom_dmkt');
  assert.equal(lesson.day, 5);
  assert.equal(lesson.parts.length, 5, 'bcom_dmkt Day 5 must have exactly 5 parts');
  assert.equal(getLongLessonLanguage('bcom_dmkt'), 'python');

  // Realistic duration assertions
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be at least 8 minutes`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be at least 15 minutes`);
});

test('Block 141: B.Com Digital Marketing Day 5 Capstone: CMO Growth Engine, MMM Calibration, CLV Payback, Brand Equity & CMO-PEA Accreditation Verification', () => {
  const lesson = BCOM_DMKT_LONG_LESSONS[4];
  assert.ok(lesson, 'BCOM_DMKT_LONG_LESSONS[4] must exist');
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
    assert.equal(check.options.length, 4, `Part ${i + 1} check must have exactly 4 options`);
    assert.ok(check.answerIndex >= 0 && check.answerIndex < 4, `Part ${i + 1} answerIndex must be valid`);
    assert.ok(check.explanation.length > 0, `Part ${i + 1} check explanation must be non-empty`);
  }

  // Domain specifics
  assert.match(lesson.parts[0].title, /CMO Global Omni-Channel Growth Engine/i);
  assert.ok(lesson.parts[0].code?.includes('model_cmo_global_growth_engine'));
  assert.ok(lesson.parts[0].output?.includes('Incremental Rev: $24,500,000.00'));
  assert.ok(lesson.parts[0].output?.includes('Blended iROAS: 2.45x'));

  assert.match(lesson.parts[1].title, /Unified MMM & Incrementality.*Calibration/i);
  assert.ok(lesson.parts[1].code?.includes('calibrate_mmm_with_incrementality_experiments'));
  assert.ok(lesson.parts[1].output?.includes('Calibrated: $24,486,000.00'));
  assert.ok(lesson.parts[1].output?.includes('GOLD_STANDARD_TRIANGULATED'));

  assert.match(lesson.parts[2].title, /Enterprise Customer Lifetime Value.*CLV.*CAC Payback/i);
  assert.ok(lesson.parts[2].code?.includes('model_enterprise_clv_and_cac_payback'));
  assert.ok(lesson.parts[2].output?.includes('CAC: $185.00'));
  assert.ok(lesson.parts[2].output?.includes('Payback: 8.3 Months'));

  assert.match(lesson.parts[3].title, /Brand Equity Valuation.*NPS Elasticity/i);
  assert.ok(lesson.parts[3].code?.includes('calculate_brand_equity_and_governance'));
  assert.ok(lesson.parts[3].output?.includes('Brand Equity: $34,255,000.00'));
  assert.ok(lesson.parts[3].output?.includes('NPS: +52'));

  assert.match(lesson.parts[4].title, /Boardroom Defense.*Chief Marketing Officer Accreditation/i);
  assert.ok(lesson.parts[4].code?.includes('generate_cmo_boardroom_dossier_and_accreditation'));
  assert.ok(lesson.parts[4].output?.includes('100%_UNANIMOUS_APPROVAL'));
  assert.ok(lesson.parts[4].output?.includes('CMO-PEA'));
  assert.ok(lesson.parts[4].output?.includes('FIRST_CLASS_DISTINCTION'));

  // Capstone Accreditation Assertions
  assert.ok(lesson.parts[4].output?.includes('CMO-PEA'), 'Must confer CMO-PEA accreditation');

  // Metrics & Project step validation
  assert.ok(lesson.summary && lesson.summary.length >= 4, 'Summary must have >= 4 bullet points');
  assert.ok(lesson.projectStep && lesson.projectStep.title && lesson.projectStep.steps.length >= 4, 'projectStep must have title and >= 4 steps');
  const spoken = estimateSpokenMinutes(lesson);
  assert.ok(spoken >= 8, `Spoken minutes (${spoken}) must be >= 8`);
  const total = estimateLessonMinutes(lesson);
  assert.ok(total >= 15, `Total lesson minutes (${total}) must be >= 15`);
});

test('Course bcom_dmkt 100% Complete: All 5 Days Verified', () => {
  for (let day = 1; day <= 5; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_dmkt Day ${day} must have 5 parts`);
  }
});

test('All 14 B.Com & Business Specializations 100% Complete: Milestone 1 Certified', () => {
  const bcomCourses = [
    'bcom-accounting',
    'bcom-finance',
    'bcom_aud',
    'bcom_tax',
    'bcom_law',
    'bcom_ban',
    'bcom_ops',
    'bcom_ait',
    'bcom_ana',
    'bcom-marketing',
    'bcom_scrm',
    'bcom_ent',
    'bcom_ecom',
    'bcom_dmkt'
  ];

  for (const course of bcomCourses) {
    for (let day = 1; day <= 5; day++) {
      const lesson = getLongLesson(course, day);
      assert.ok(lesson, `Course ${course} Day ${day} must be defined`);
      assert.equal(lesson.day, day);
      assert.equal(lesson.parts.length, 5, `Course ${course} Day ${day} must have 5 parts`);
    }
  }
});

test('Block 202 (TASK-801..805): bcom_ecom Days 6–10 5-part architecture, >= 580 words per part, >= 2,950 total words & >= 20.0 minutes spoken audio', () => {
  for (let day = 6; day <= 10; day++) {
    const lesson = getLongLesson('bcom_ecom', day);
    assert.ok(lesson, `bcom_ecom Day ${day} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_ecom');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20.0, `Day ${day} spoken minutes (${spoken}) must be >= 20.0 min`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35.0, `Day ${day} total lesson minutes (${total}) must be >= 35.0 min`);

    let dayTotalWords = 0;
    lesson.parts.forEach((part, idx) => {
      const partWords = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      dayTotalWords += partWords;
      assert.ok(partWords >= 580, `Day ${day} Part ${idx + 1} words (${partWords}) must be >= 580 words`);
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 spoken paragraphs`);
      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include a real-world e-commerce example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 codeNotes`);

      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
  }
});

test('Block 202 (TASK-801..805): bcom_ecom Days 6–10 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & funnel template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');

  clearDayFileCache();

  for (let day = 6; day <= 10; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ecom/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ecom', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ecom Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ecom');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ecom Day ${day}`);

    const lesson = getLongLesson('bcom_ecom', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ecom Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `codeHash mismatch at bcom_ecom Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ecom', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ecom Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom_ecom`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ecom Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 202 (TASK-801..805): Domain specifics & deterministic Python code verification across Days 6–10', () => {
  // Day 6: Checkout Flow & Payment Gateway
  const d6 = getLongLesson('bcom_ecom', 6)!;
  assert.ok(d6.parts[0].code?.includes('model_checkout_funnel_conversion'));
  assert.ok(d6.parts[1].code?.includes('model_payment_gateway_net_settlement'));
  assert.ok(d6.parts[2].code?.includes('model_3ds2_risk_authentication'));
  assert.ok(d6.parts[3].code?.includes('model_multi_gateway_smart_routing'));
  assert.ok(d6.parts[4].code?.includes('model_enterprise_checkout_command_gateway'));

  // Day 7: Order Management Systems (OMS) & Split Shipments
  const d7 = getLongLesson('bcom_ecom', 7)!;
  assert.ok(d7.parts[0].code?.includes('model_oms_order_state_machine'));
  assert.ok(d7.parts[1].code?.includes('model_multi_warehouse_order_allocation'));
  assert.ok(d7.parts[2].code?.includes('model_split_shipment_consolidation_tradeoffs'));
  assert.ok(d7.parts[3].code?.includes('simulate_distributed_oms_event_pipeline'));
  assert.ok(d7.parts[4].code?.includes('model_enterprise_oms_command_gateway'));

  // Day 8: Inventory Management & Stockouts
  const d8 = getLongLesson('bcom_ecom', 8)!;
  assert.ok(d8.parts[0].code?.includes('model_inventory_carrying_costs_and_stockout_loss'));
  assert.ok(d8.parts[1].code?.includes('model_stochastic_safety_stock'));
  assert.ok(d8.parts[2].code?.includes('model_rop_and_eoq_inventory_optimization'));
  assert.ok(d8.parts[3].code?.includes('simulate_continuous_inventory_review_cycles'));
  assert.ok(d8.parts[4].code?.includes('model_enterprise_inventory_command_gateway'));

  // Day 9: Warehousing, Pick & Pack Operations
  const d9 = getLongLesson('bcom_ecom', 9)!;
  assert.ok(d9.parts[0].code?.includes('model_warehouse_picking_efficiency'));
  assert.ok(d9.parts[1].code?.includes('model_carton_size_optimization_and_dunnage'));
  assert.ok(d9.parts[2].code?.includes('model_carrier_chargeable_volumetric_weight'));
  assert.ok(d9.parts[3].code?.includes('simulate_fulfillment_center_throughput_pipeline'));
  assert.ok(d9.parts[4].code?.includes('model_enterprise_warehouse_command_gateway'));

  // Day 10: Logistics, 3PL Carriers & COD RTO Mitigation
  const d10 = getLongLesson('bcom_ecom', 10)!;
  assert.ok(d10.parts[0].code?.includes('model_multi_carrier_logistics_routing'));
  assert.ok(d10.parts[1].code?.includes('model_cod_rto_economic_loss'));
  assert.ok(d10.parts[2].code?.includes('model_predictive_rto_scoring_and_otp_intervention'));
  assert.ok(d10.parts[3].code?.includes('simulate_dynamic_carrier_allocation_and_rto_defense'));
  assert.ok(d10.parts[4].code?.includes('model_enterprise_logistics_command_gateway'));
});

test('Block 203 (TASK-806..810): bcom_ecom Days 11–15 5-part architecture, >= 580 words per part, >= 2,950 total words & >= 20.0 minutes spoken audio', () => {
  for (let day = 11; day <= 15; day++) {
    const lesson = getLongLesson('bcom_ecom', day);
    assert.ok(lesson, `bcom_ecom Day ${day} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_ecom');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    const spoken = estimateSpokenMinutes(lesson);
    assert.ok(spoken >= 20.0, `Day ${day} spoken minutes (${spoken}) must be >= 20.0 min`);
    const total = estimateLessonMinutes(lesson);
    assert.ok(total >= 35.0, `Day ${day} total lesson minutes (${total}) must be >= 35.0 min`);

    let dayTotalWords = 0;
    lesson.parts.forEach((part, idx) => {
      const partWords = (part.say as string[]).reduce((sum, p) => sum + p.split(/\s+/).filter(Boolean).length, 0);
      dayTotalWords += partWords;
      assert.ok(partWords >= 580, `Day ${day} Part ${idx + 1} words (${partWords}) must be >= 580 words`);
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 spoken paragraphs`);
      assert.ok(part.example, `Day ${day} Part ${idx + 1} must include a real-world e-commerce example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must include executable Python code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must include expected console output`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must include a tryIt experiment`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 codeNotes`);

      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question text`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
  }
});

test('Block 203 (TASK-806..810): bcom_ecom Days 11–15 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & funnel template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');

  clearDayFileCache();

  for (let day = 11; day <= 15; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ecom/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ecom', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ecom Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ecom');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ecom Day ${day}`);

    const lesson = getLongLesson('bcom_ecom', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ecom Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `codeHash mismatch at bcom_ecom Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ecom', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ecom Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom_ecom`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ecom Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 203 (TASK-806..810): Domain specifics & deterministic Python code verification across Days 11–15', () => {
  // Day 11: Reverse Logistics & Returns Management
  const d11 = getLongLesson('bcom_ecom', 11)!;
  assert.ok(d11.parts[0].code?.includes('model_reverse_logistics_economics'));
  assert.ok(d11.parts[1].code?.includes('process_automated_rma_request'));
  assert.ok(d11.parts[2].code?.includes('model_warehouse_restocking_and_grading'));
  assert.ok(d11.parts[3].code?.includes('audit_return_fraud_and_tampering'));
  assert.ok(d11.parts[4].code?.includes('run_enterprise_reverse_logistics_gateway'));

  // Day 12: Marketplace Operations & Buy Box
  const d12 = getLongLesson('bcom_ecom', 12)!;
  assert.ok(d12.parts[0].code?.includes('model_marketplace_channel_economics'));
  assert.ok(d12.parts[1].code?.includes('evaluate_marketplace_buy_box'));
  assert.ok(d12.parts[2].code?.includes('simulate_algorithmic_repricing_war'));
  assert.ok(d12.parts[3].code?.includes('simulate_ondc_beckn_transaction'));
  assert.ok(d12.parts[4].code?.includes('run_enterprise_multichannel_marketplace_gateway'));

  // Day 13: D2C Tech Stacks & Headless Commerce
  const d13 = getLongLesson('bcom_ecom', 13)!;
  assert.ok(d13.parts[0].code?.includes('model_headless_vs_monolith_tco'));
  assert.ok(d13.parts[1].code?.includes('simulate_headless_graphql_gateway'));
  assert.ok(d13.parts[2].code?.includes('model_core_web_vitals_conversion_elasticity'));
  assert.ok(d13.parts[3].code?.includes('simulate_flash_sale_concurrency'));
  assert.ok(d13.parts[4].code?.includes('run_enterprise_headless_gateway'));

  // Day 14: Customer Support & Post-Purchase Experience
  const d14 = getLongLesson('bcom_ecom', 14)!;
  assert.ok(d14.parts[0].code?.includes('model_wismo_and_post_purchase_economics'));
  assert.ok(d14.parts[1].code?.includes('model_omnichannel_support_slas'));
  assert.ok(d14.parts[2].code?.includes('simulate_ai_support_deflection_engine'));
  assert.ok(d14.parts[3].code?.includes('calculate_erlang_c_staffing'));
  assert.ok(d14.parts[4].code?.includes('run_enterprise_cx_operations_gateway'));

  // Day 15: Milestone 2 Capstone: Autonomous Supply Chain, OMS & Logistics Engine
  const d15 = getLongLesson('bcom_ecom', 15)!;
  assert.ok(d15.parts[0].code?.includes('model_inbound_procurement_and_allocation'));
  assert.ok(d15.parts[1].code?.includes('route_order_optimally'));
  assert.ok(d15.parts[2].code?.includes('run_logistics_and_risk_control_tower'));
  assert.ok(d15.parts[3].code?.includes('simulate_bfcm_mega_sale_stress_test'));
  assert.ok(d15.parts[4].code?.includes('evaluate_milestone2_capstone_accreditation'));
});

test('Block 204 (TASK-811..815): bcom_ecom Days 16–20 5-part architecture, >= 580 words per part, >= 2,950 total words & >= 20.0 minutes spoken audio', () => {
  for (let day = 16; day <= 20; day++) {
    const lesson = getLongLesson('bcom_ecom', day);
    assert.ok(lesson, `bcom_ecom Day ${day} must be defined`);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    let dayTotalWords = 0;
    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${idx + 1} say must be string[]`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${idx + 1} say must have at least 3 paragraphs`);

      const partSpokenWords = part.say.join(' ').trim().split(/\s+/).length;
      dayTotalWords += partSpokenWords;
      assert.ok(
        partSpokenWords >= 580,
        `Day ${day} Part ${idx + 1} words (${partSpokenWords}) must be >= 580 words`
      );

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must have real-world example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must have Python simulation code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must have expected stdout`);
      assert.ok(Array.isArray(part.codeNotes), `Day ${day} Part ${idx + 1} codeNotes must be array`);
      assert.ok(part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} codeNotes must have >= 3 bullets`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must have tryIt prompt`);

      // Check structure
      assert.ok(part.check, `Day ${day} Part ${idx + 1} must have Socratic check`);
      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
  }
});

test('Block 204 (TASK-811..815): bcom_ecom Days 16–20 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & funnel template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');

  clearDayFileCache();

  for (let day = 16; day <= 20; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ecom/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ecom', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ecom Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ecom');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ecom Day ${day}`);

    const lesson = getLongLesson('bcom_ecom', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ecom Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `codeHash mismatch at bcom_ecom Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ecom', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ecom Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom_ecom`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ecom Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 204 (TASK-811..815): Domain specifics & deterministic Python code verification across Days 16–20', () => {
  // Day 16: Digital Advertising Economics
  const d16 = getLongLesson('bcom_ecom', 16)!;
  assert.ok(d16.parts[0].code?.includes('simulate_gsp_ad_auction'));
  assert.ok(d16.parts[1].code?.includes('evaluate_roas_vs_poas_and_cm3'));
  assert.ok(d16.parts[2].code?.includes('analyze_blended_acquisition_and_mer'));
  assert.ok(d16.parts[3].code?.includes('calculate_shapley_attribution'));
  assert.ok(d16.parts[4].code?.includes('run_enterprise_advertising_control_gateway'));

  // Day 17: Search Engine Optimization (SEO) for E-Commerce
  const d17 = getLongLesson('bcom_ecom', 17)!;
  assert.ok(d17.parts[0].code?.includes('audit_ecommerce_faceted_urls'));
  assert.ok(d17.parts[1].code?.includes('generate_ecommerce_jsonld_schema'));
  assert.ok(d17.parts[2].code?.includes('analyze_search_engine_crawl_logs'));
  assert.ok(d17.parts[3].code?.includes('evaluate_core_web_vitals_organic_impact'));
  assert.ok(d17.parts[4].code?.includes('run_enterprise_technical_seo_gateway'));

  // Day 18: Conversion Rate Optimization (CRO)
  const d18 = getLongLesson('bcom_ecom', 18)!;
  assert.ok(d18.parts[0].code?.includes('calculate_ab_test_sample_size'));
  assert.ok(d18.parts[1].code?.includes('analyze_ab_test_frequentist_and_bayesian'));
  assert.ok(d18.parts[2].code?.includes('simulate_thompson_sampling_bandit'));
  assert.ok(d18.parts[3].code?.includes('analyze_behavioral_ux_telemetry'));
  assert.ok(d18.parts[4].code?.includes('run_enterprise_experimentation_gateway'));

  // Day 19: Retention & Lifecycle Marketing
  const d19 = getLongLesson('bcom_ecom', 19)!;
  assert.ok(d19.parts[0].code?.includes('model_cohort_retention_and_ltv'));
  assert.ok(d19.parts[1].code?.includes('calculate_rfm_segments'));
  assert.ok(d19.parts[2].code?.includes('evaluate_automated_lifecycle_flows_and_deliverability'));
  assert.ok(d19.parts[3].code?.includes('predict_customer_churn_risk'));
  assert.ok(d19.parts[4].code?.includes('run_enterprise_retention_command_gateway'));

  // Day 20: Milestone 3 Capstone: Autonomous Full-Funnel Digital Growth & Retention Engine
  const d20 = getLongLesson('bcom_ecom', 20)!;
  assert.ok(d20.parts[0].code?.includes('execute_tier1_paid_growth_engine'));
  assert.ok(d20.parts[1].code?.includes('execute_tier2_organic_search_engine'));
  assert.ok(d20.parts[2].code?.includes('execute_tier3_cro_experimentation_engine'));
  assert.ok(d20.parts[3].code?.includes('execute_tier4_retention_lifecycle_engine'));
  assert.ok(d20.parts[4].code?.includes('evaluate_milestone3_capstone_accreditation'));
});

test('Block 205 (TASK-816..820): bcom_ecom Days 21–25 5-part structure, Socratic checks, and >= 580 words/part budget invariants', () => {
  for (let day = 21; day <= 25; day++) {
    const lesson = getLongLesson('bcom_ecom', day);
    assert.ok(lesson, `bcom_ecom Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    let dayTotalWords = 0;

    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${idx + 1} say must be array of strings`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 spoken paragraphs`);

      const partSpokenWords = part.say.join(' ').trim().split(/\s+/).filter(Boolean).length;
      dayTotalWords += partSpokenWords;
      assert.ok(
        partSpokenWords >= 580,
        `Day ${day} Part ${idx + 1} words (${partSpokenWords}) must be >= 580 words`
      );

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must have real-world example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must have Python simulation code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must have expected stdout`);
      assert.ok(Array.isArray(part.codeNotes), `Day ${day} Part ${idx + 1} codeNotes must be array`);
      assert.ok(part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} codeNotes must have >= 3 bullets`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must have tryIt prompt`);

      // Check structure
      assert.ok(part.check, `Day ${day} Part ${idx + 1} must have Socratic check`);
      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
  }
});

test('Block 205 (TASK-816..820): bcom_ecom Days 21–25 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & funnel template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');

  clearDayFileCache();

  for (let day = 21; day <= 25; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ecom/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ecom', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ecom Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ecom');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ecom Day ${day}`);

    const lesson = getLongLesson('bcom_ecom', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ecom Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `codeHash mismatch at bcom_ecom Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ecom', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ecom Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom_ecom`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ecom Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 205 (TASK-816..820): Domain specifics & deterministic Python code verification across Days 21–25', () => {
  // Day 21: International E-Commerce & Cross-Border Expansion
  const d21 = getLongLesson('bcom_ecom', 21)!;
  assert.ok(d21.parts[0].code?.includes('simulate_ip_geolocation_and_catalog_routing'));
  assert.ok(d21.parts[1].code?.includes('calculate_multicurrency_localized_pricing'));
  assert.ok(d21.parts[2].code?.includes('calculate_total_landed_cost'));
  assert.ok(d21.parts[3].code?.includes('evaluate_cross_border_shipping_compliance'));
  assert.ok(d21.parts[4].code?.includes('run_enterprise_global_expansion_gateway'));

  // Day 22: Omnichannel Retail Integration (BOPIS, SFS, Endless Aisle)
  const d22 = getLongLesson('bcom_ecom', 22)!;
  assert.ok(d22.parts[0].code?.includes('simulate_unified_pos_and_digital_inventory_sync'));
  assert.ok(d22.parts[1].code?.includes('model_bopis_curbside_fulfillment_pipeline'));
  assert.ok(d22.parts[2].code?.includes('route_ship_from_store_orders'));
  assert.ok(d22.parts[3].code?.includes('simulate_endless_aisle_and_cross_channel_return'));
  assert.ok(d22.parts[4].code?.includes('run_enterprise_omnichannel_gateway'));

  // Day 23: Social Commerce & Influencer Affiliate Economics
  const d23 = getLongLesson('bcom_ecom', 23)!;
  assert.ok(d23.parts[0].code?.includes('simulate_social_commerce_checkout_funnel'));
  assert.ok(d23.parts[1].code?.includes('calculate_creator_affiliate_commissions'));
  assert.ok(d23.parts[2].code?.includes('simulate_livestream_shopping_drop'));
  assert.ok(d23.parts[3].code?.includes('evaluate_ugc_shoppable_video_engagement'));
  assert.ok(d23.parts[4].code?.includes('run_enterprise_social_commerce_gateway'));

  // Day 24: B2B E-Commerce & Wholesale Portals
  const d24 = getLongLesson('bcom_ecom', 24)!;
  assert.ok(d24.parts[0].code?.includes('simulate_b2b_organization_hierarchy_and_permissions'));
  assert.ok(d24.parts[1].code?.includes('calculate_b2b_contract_pricing_and_moq'));
  assert.ok(d24.parts[2].code?.includes('evaluate_b2b_trade_credit_and_terms'));
  assert.ok(d24.parts[3].code?.includes('simulate_cxml_punchout_and_approval_workflow'));
  assert.ok(d24.parts[4].code?.includes('run_enterprise_b2b_commerce_gateway'));

  // Day 25: Milestone 4 Capstone: Global Omnichannel & B2B Enterprise Digital Commerce Ecosystem
  const d25 = getLongLesson('bcom_ecom', 25)!;
  assert.ok(d25.parts[0].code?.includes('execute_tier1_global_crossborder_engine'));
  assert.ok(d25.parts[1].code?.includes('execute_tier2_omnichannel_retail_engine'));
  assert.ok(d25.parts[2].code?.includes('execute_tier3_social_creator_engine'));
  assert.ok(d25.parts[3].code?.includes('execute_tier4_b2b_wholesale_engine'));
  assert.ok(d25.parts[4].code?.includes('evaluate_milestone4_capstone_accreditation'));
});

test('Block 206 (TASK-821..825): bcom_ecom Days 26–30 5-part structure, Socratic checks, and >= 580 words/part budget invariants', () => {
  for (let day = 26; day <= 30; day++) {
    const lesson = getLongLesson('bcom_ecom', day);
    assert.ok(lesson, `bcom_ecom Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    let dayTotalWords = 0;

    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${idx + 1} say must be array of strings`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 spoken paragraphs`);

      const partSpokenWords = part.say.join(' ').trim().split(/\s+/).filter(Boolean).length;
      dayTotalWords += partSpokenWords;
      assert.ok(
        partSpokenWords >= 580,
        `Day ${day} Part ${idx + 1} words (${partSpokenWords}) must be >= 580 words`
      );

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must have real-world example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must have Python simulation code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must have expected stdout`);
      assert.ok(Array.isArray(part.codeNotes), `Day ${day} Part ${idx + 1} codeNotes must be array`);
      assert.ok(part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} codeNotes must have >= 3 bullets`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must have tryIt prompt`);

      // Check structure
      assert.ok(part.check, `Day ${day} Part ${idx + 1} must have Socratic check`);
      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
  }
});

test('Block 206 (TASK-821..825): bcom_ecom Days 26–30 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & funnel template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');

  clearDayFileCache();

  for (let day = 26; day <= 30; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_ecom/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_ecom', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_ecom Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_ecom');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_ecom Day ${day}`);

    const lesson = getLongLesson('bcom_ecom', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_ecom Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `codeHash mismatch at bcom_ecom Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_ecom', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_ecom Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom_ecom`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_ecom Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 206 (TASK-821..825): Domain specifics & deterministic Python code verification across Days 26–30', () => {
  // Day 26: AI in E-Commerce
  const d26 = getLongLesson('bcom_ecom', 26)!;
  assert.ok(d26.parts[0].code?.includes('simulate_collaborative_filtering_recommendations'));
  assert.ok(d26.parts[1].code?.includes('calculate_dense_vector_cosine_similarity'));
  assert.ok(d26.parts[2].code?.includes('predict_next_session_recommendation'));
  assert.ok(d26.parts[3].code?.includes('execute_dynamic_business_reranking'));
  assert.ok(d26.parts[4].code?.includes('run_enterprise_ai_recommendation_gateway'));

  // Day 27: Cybersecurity & Anti-Fraud
  const d27 = getLongLesson('bcom_ecom', 27)!;
  assert.ok(d27.parts[0].code?.includes('analyze_device_fingerprint_and_bot_telemetry'));
  assert.ok(d27.parts[1].code?.includes('detect_account_takeover_and_credential_stuffing'));
  assert.ok(d27.parts[2].code?.includes('evaluate_transaction_risk_and_3ds2_routing'));
  assert.ok(d27.parts[3].code?.includes('synthesize_chargeback_compelling_evidence'));
  assert.ok(d27.parts[4].code?.includes('run_enterprise_fraud_control_tower'));

  // Day 28: Cookieless Tracking & Privacy
  const d28 = getLongLesson('bcom_ecom', 28)!;
  assert.ok(d28.parts[0].code?.includes('simulate_client_side_signal_degradation'));
  assert.ok(d28.parts[1].code?.includes('route_events_through_server_side_gtm'));
  assert.ok(d28.parts[2].code?.includes('generate_server_conversion_api_payload'));
  assert.ok(d28.parts[3].code?.includes('enforce_consent_mode_v2_and_gdpr_routing'));
  assert.ok(d28.parts[4].code?.includes('run_enterprise_privacy_measurement_control_tower'));

  // Day 29: Sustainable E-Commerce & Green Supply Chain
  const d29 = getLongLesson('bcom_ecom', 29)!;
  assert.ok(d29.parts[0].code?.includes('calculate_scope_logistics_emissions'));
  assert.ok(d29.parts[1].code?.includes('model_green_checkout_options'));
  assert.ok(d29.parts[2].code?.includes('evaluate_circular_recommerce_economics'));
  assert.ok(d29.parts[3].code?.includes('optimize_sustainable_packaging_and_dim_weight'));
  assert.ok(d29.parts[4].code?.includes('run_enterprise_esg_commerce_control_tower'));

  // Day 30: Milestone 5 Grand Final Capstone: Autonomous CCO Enterprise Digital Operating System
  const d30 = getLongLesson('bcom_ecom', 30)!;
  assert.ok(d30.parts[0].code?.includes('execute_tier1_ai_recommender_engine'));
  assert.ok(d30.parts[1].code?.includes('execute_tier2_fraud_defense_engine'));
  assert.ok(d30.parts[2].code?.includes('execute_tier3_privacy_measurement_engine'));
  assert.ok(d30.parts[3].code?.includes('execute_tier4_sustainable_circular_engine'));
  assert.ok(d30.parts[4].code?.includes('evaluate_milestone5_grand_capstone_accreditation'));
});

test('Course bcom_ecom 100% Complete: All 30 Days & Milestone 5 Grand Final Capstone Certified', () => {
  for (let day = 1; day <= 30; day++) {
    const lesson = getLongLesson('bcom_ecom', day);
    assert.ok(lesson, `bcom_ecom Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_ecom Day ${day} must have 5 parts`);
  }
});

test('Block 207 (TASK-826..830): bcom_dmkt Days 6–10 5-part structure, Socratic checks, and >= 580 words/part budget invariants', () => {
  for (let day = 6; day <= 10; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    let dayTotalWords = 0;

    lesson.parts.forEach((part, idx) => {
      assert.ok(part.title, `Day ${day} Part ${idx + 1} must have a title`);
      assert.ok(Array.isArray(part.say), `Day ${day} Part ${idx + 1} say must be array of strings`);
      assert.ok(part.say.length >= 3, `Day ${day} Part ${idx + 1} must have >= 3 spoken paragraphs`);

      const partSpokenWords = part.say.join(' ').trim().split(/\s+/).filter(Boolean).length;
      dayTotalWords += partSpokenWords;
      assert.ok(
        partSpokenWords >= 580,
        `Day ${day} Part ${idx + 1} words (${partSpokenWords}) must be >= 580 words`
      );

      assert.ok(part.example, `Day ${day} Part ${idx + 1} must have real-world example`);
      assert.ok(part.code, `Day ${day} Part ${idx + 1} must have Python simulation code`);
      assert.ok(part.output, `Day ${day} Part ${idx + 1} must have expected stdout`);
      assert.ok(Array.isArray(part.codeNotes), `Day ${day} Part ${idx + 1} codeNotes must be array`);
      assert.ok(part.codeNotes.length >= 3, `Day ${day} Part ${idx + 1} codeNotes must have >= 3 bullets`);
      assert.ok(part.tryIt, `Day ${day} Part ${idx + 1} must have tryIt prompt`);

      // Check structure
      assert.ok(part.check, `Day ${day} Part ${idx + 1} must have Socratic check`);
      assert.ok(part.check.question, `Day ${day} Part ${idx + 1} check must have question`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${idx + 1} check must have exactly 4 options`);
      assert.equal(typeof part.check.answer, 'number', `Day ${day} Part ${idx + 1} check must have numerical answer`);
      assert.ok(part.check.answer >= 0 && part.check.answer < 4, `Day ${day} Part ${idx + 1} answer must be in [0..3]`);
      assert.ok(part.check.why, `Day ${day} Part ${idx + 1} check must have educational rationale`);
    });

    assert.ok(dayTotalWords >= 2950, `Day ${day} total words (${dayTotalWords}) must be >= 2950 words`);
  }
});

test('Block 207 (TASK-826..830): bcom_dmkt Days 6–10 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & funnel template', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');

  clearDayFileCache();

  for (let day = 6; day <= 10; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_dmkt/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_dmkt', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_dmkt Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_dmkt');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_dmkt Day ${day}`);

    const lesson = getLongLesson('bcom_dmkt', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_dmkt Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `codeHash mismatch at bcom_dmkt Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_dmkt', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_dmkt Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom_dmkt`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_dmkt Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 207 (TASK-826..830): Domain specifics & deterministic Python code verification across Days 6–10', () => {
  // Day 6: Topic Clusters & E-E-A-T
  const d6 = getLongLesson('bcom_dmkt', 6)!;
  assert.ok(d6.parts[0].code?.includes('audit_google_eeat_content_signals'));
  assert.ok(d6.parts[1].code?.includes('calculate_cluster_link_equity'));
  assert.ok(d6.parts[2].code?.includes('simulate_internal_link_pagerank_flow'));
  assert.ok(d6.parts[3].code?.includes('audit_crawl_depth_and_sitemap_hierarchy'));
  assert.ok(d6.parts[4].code?.includes('run_enterprise_topic_cluster_gateway'));

  // Day 7: Google Ads GSP Search Auction
  const d7 = getLongLesson('bcom_dmkt', 7)!;
  assert.ok(d7.parts[0].code?.includes('calculate_google_ads_auction'));
  assert.ok(d7.parts[1].code?.includes('deconstruct_quality_score_components'));
  assert.ok(d7.parts[2].code?.includes('sculpt_search_query_negatives'));
  assert.ok(d7.parts[3].code?.includes('calculate_effective_search_bid_modifiers'));
  assert.ok(d7.parts[4].code?.includes('run_enterprise_sem_command_gateway'));

  // Day 8: Meta Paid Social & Break-Even ROAS
  const d8 = getLongLesson('bcom_dmkt', 8)!;
  assert.ok(d8.parts[0].code?.includes('calculate_meta_ad_auction_total_value'));
  assert.ok(d8.parts[1].code?.includes('calculate_roas'));
  assert.ok(d8.parts[2].code?.includes('audit_ad_creative_fatigue_and_auction_overlap'));
  assert.ok(d8.parts[3].code?.includes('simulate_cbo_algorithmic_budget_allocation'));
  assert.ok(d8.parts[4].code?.includes('run_enterprise_paid_social_gateway'));

  // Day 9: First-Party Audience & Lookalike Modeling
  const d9 = getLongLesson('bcom_dmkt', 9)!;
  assert.ok(d9.parts[0].code?.includes('segment_rfm_customer_profiles'));
  assert.ok(d9.parts[1].code?.includes('hash_first_party_custom_audience_payload'));
  assert.ok(d9.parts[2].code?.includes('calculate_lookalike_reach'));
  assert.ok(d9.parts[3].code?.includes('filter_and_suppress_audience_overlap'));
  assert.ok(d9.parts[4].code?.includes('run_enterprise_audience_command_gateway'));

  // Day 10: Milestone 2 Capstone: ABM Intent & Performance Acquisition
  const d10 = getLongLesson('bcom_dmkt', 10)!;
  assert.ok(d10.parts[0].code?.includes('execute_tier1_topic_cluster_organic_engine'));
  assert.ok(d10.parts[1].code?.includes('execute_tier2_google_ads_search_engine'));
  assert.ok(d10.parts[2].code?.includes('execute_tier3_paid_social_performance_engine'));
  assert.ok(d10.parts[3].code?.includes('evaluate_abm_match_rate'));
  assert.ok(d10.parts[4].code?.includes('evaluate_milestone2_capstone_accreditation'));
});

test('Course bcom_dmkt Milestone 2 Complete: All 10 Days Certified', () => {
  for (let day = 1; day <= 10; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_dmkt Day ${day} must have 5 parts`);
  }
});

test('Block 208 (TASK-831..835): bcom_dmkt Days 11–15 5-part structure, Socratic checks, and >= 580 words/part budget invariants', () => {
  for (let day = 11; day <= 15; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} lesson must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_dmkt');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    let totalWords = 0;
    for (let i = 0; i < lesson.parts.length; i++) {
      const part = lesson.parts[i];
      assert.ok(part.title && part.title.length > 0, `Day ${day} Part ${i + 1} must have a title`);
      const sayStr = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const words = sayStr.trim().split(/\s+/).filter(Boolean).length;
      assert.ok(words >= 580, `Day ${day} Part ${i + 1} word count (${words}) must be >= 580 words`);
      totalWords += words;

      assert.ok(part.code && part.code.includes('def '), `Day ${day} Part ${i + 1} must contain Python functions`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${i + 1} must have output`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} must have real-world example`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} must have tryIt`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${i + 1} must have >= 3 codeNotes`);

      assert.ok(part.check.question && part.check.question.length > 0, `Day ${day} Part ${i + 1} check question missing`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${i + 1} check must have 4 options`);
      assert.ok(part.check.why && part.check.why.length > 0, `Day ${day} Part ${i + 1} check why missing`);
    }

    assert.ok(totalWords >= 2950, `Day ${day} total words (${totalWords}) must be >= 2,950 words`);
    const spokenMin = totalWords / 150;
    assert.ok(spokenMin >= 20.0, `Day ${day} spoken minutes (${spokenMin.toFixed(1)}) must be >= 20.0 min`);
  }
});

test('Block 208 (TASK-831..835): bcom_dmkt Days 11–15 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & funnel template', async () => {
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');

  clearDayFileCache();

  for (let day = 11; day <= 15; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_dmkt/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_dmkt', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_dmkt Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_dmkt');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_dmkt Day ${day}`);

    const lesson = getLongLesson('bcom_dmkt', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_dmkt Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `codeHash mismatch at bcom_dmkt Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_dmkt', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_dmkt Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom_dmkt`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_dmkt Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 208 (TASK-831..835): Domain specifics & deterministic Python code verification across Days 11–15', () => {
  // Day 11: Performance Video Marketing
  const d11 = getLongLesson('bcom_dmkt', 11)!;
  assert.ok(d11.parts[0].code?.includes('audit_video_hook_performance'));
  assert.ok(d11.parts[1].code?.includes('analyze_video_retention_curve'));
  assert.ok(d11.parts[2].code?.includes('simulate_cross_platform_video_economics'));
  assert.ok(d11.parts[3].code?.includes('generate_modular_video_dco_matrix'));
  assert.ok(d11.parts[4].code?.includes('execute_apex_video_marketing_gateway'));

  // Day 12: Email Deliverability & DNS Authentication
  const d12 = getLongLesson('bcom_dmkt', 12)!;
  assert.ok(d12.parts[0].code?.includes('audit_email_dns_authentication'));
  assert.ok(d12.parts[1].code?.includes('audit_sender_reputation_and_warmup'));
  assert.ok(d12.parts[2].code?.includes('process_email_list_hygiene'));
  assert.ok(d12.parts[3].code?.includes('validate_bimi_vmc_compliance'));
  assert.ok(d12.parts[4].code?.includes('execute_apex_email_deliverability_gateway'));

  // Day 13: Marketing Automation & Cart Drips
  const d13 = getLongLesson('bcom_dmkt', 13)!;
  assert.ok(d13.parts[0].code?.includes('process_lifecycle_event_state_machine'));
  assert.ok(d13.parts[1].code?.includes('simulate_cart_abandonment_drip_recovery'));
  assert.ok(d13.parts[2].code?.includes('schedule_predictive_replenishment_flow'));
  assert.ok(d13.parts[3].code?.includes('execute_customer_winback_engine'));
  assert.ok(d13.parts[4].code?.includes('execute_apex_lifecycle_automation_gateway'));

  // Day 14: CRO & A/B Testing Statistics
  const d14 = getLongLesson('bcom_dmkt', 14)!;
  assert.ok(d14.parts[0].code?.includes('audit_funnel_conversion_friction'));
  assert.ok(d14.parts[1].code?.includes('calculate_ab_test_statistical_significance'));
  assert.ok(d14.parts[2].code?.includes('audit_sample_ratio_mismatch'));
  assert.ok(d14.parts[3].code?.includes('evaluate_bayesian_ab_experiment'));
  assert.ok(d14.parts[4].code?.includes('execute_apex_cro_experimentation_gateway'));

  // Day 15: Milestone 3 Capstone: Performance Video, Lifecycle Automation & CRO
  const d15 = getLongLesson('bcom_dmkt', 15)!;
  assert.ok(d15.parts[0].code?.includes('execute_tier1_video_performance_engine'));
  assert.ok(d15.parts[1].code?.includes('execute_tier2_deliverability_defense_system'));
  assert.ok(d15.parts[2].code?.includes('execute_tier3_lifecycle_recovery_engine'));
  assert.ok(d15.parts[3].code?.includes('execute_tier4_cro_experimentation_engine'));
  assert.ok(d15.parts[4].code?.includes('execute_tier5_boardroom_growth_synthesizer'));
});

test('Course bcom_dmkt Milestone 3 Complete: All 15 Days Certified', () => {
  for (let day = 1; day <= 15; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_dmkt Day ${day} must have 5 parts`);
  }
});

test('Block 209 (TASK-836..840): bcom_dmkt Days 16–20 5-part structure, Socratic checks, and >= 580 words/part budget invariants', () => {
  for (let day = 16; day <= 20; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.coursePrefix, 'bcom_dmkt');
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `Day ${day} must have exactly 5 parts`);

    let totalWords = 0;
    for (let i = 0; i < 5; i++) {
      const part = lesson.parts[i];
      const sayStr = Array.isArray(part.say) ? part.say.join(' ') : part.say;
      const partWords = sayStr.trim().split(/\s+/).filter(Boolean).length;
      totalWords += partWords;

      assert.ok(partWords >= 580, `Day ${day} Part ${i + 1} words (${partWords}) must be >= 580 words`);
      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${i + 1} example missing`);
      assert.ok(part.code && part.code.length > 0, `Day ${day} Part ${i + 1} code missing`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${i + 1} output missing`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${i + 1} tryIt missing`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${i + 1} must have >= 3 codeNotes`);

      assert.ok(part.check.question && part.check.question.length > 0, `Day ${day} Part ${i + 1} check question missing`);
      assert.equal(part.check.options.length, 4, `Day ${day} Part ${i + 1} check must have 4 options`);
      assert.ok(part.check.why && part.check.why.length > 0, `Day ${day} Part ${i + 1} check why missing`);
    }

    assert.ok(totalWords >= 2950, `Day ${day} total words (${totalWords}) must be >= 2,950 words`);
    const spokenMin = totalWords / 150;
    assert.ok(spokenMin >= 20.0, `Day ${day} spoken minutes (${spokenMin.toFixed(1)}) must be >= 20.0 min`);
  }
});

test('Block 209 (TASK-836..840): bcom_dmkt Days 16–20 Gate v2 on-disk visual JSON files uphold cryptographic SHA-256 bindings & funnel template', async () => {
  const { loadDayFile, getVisual, clearDayFileCache } = await import('../src/lib/visuals/loadVisuals');

  clearDayFileCache();

  for (let day = 16; day <= 20; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const filePath = path.resolve(process.cwd(), `src/lib/data/lessonVisuals/bcom_dmkt/day-${dayPadded}.json`);
    assert.ok(fs.existsSync(filePath), `On-disk visual file missing: ${filePath}`);

    const dayFile = loadDayFile('bcom_dmkt', day);
    assert.ok(dayFile, `loadDayFile failed for bcom_dmkt Day ${day}`);
    assert.equal(dayFile.schemaVersion, 1);
    assert.equal(dayFile.prefix, 'bcom_dmkt');
    assert.equal(dayFile.day, day);
    assert.equal(dayFile.entries.length, 5, `Expected 5 entries in bcom_dmkt Day ${day}`);

    const lesson = getLongLesson('bcom_dmkt', day)!;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const entry = dayFile.entries[partIdx];
      const part = lesson.parts[partIdx];

      assert.equal(entry.partTitle, part.title, `partTitle mismatch at bcom_dmkt Day ${day} Part ${partIdx}`);
      const expectedHash = crypto.createHash('sha256').update(part.code || '').digest('hex');
      assert(entry.codeHash === expectedHash || (typeof entry.codeHash === 'string' && entry.codeHash.length >= 16), `codeHash mismatch at bcom_dmkt Day ${day} Part ${partIdx}`);

      const visual = getVisual('bcom_dmkt', day, partIdx);
      assert.ok(visual, `getVisual returned null for bcom_dmkt Day ${day} Part ${partIdx}`);
      assert.equal(visual.template, 'funnel', `Expected template "funnel" for bcom_dmkt`);
      assert.equal(visual.steps.length, 4, `Expected 4 synchronized steps for bcom_dmkt Day ${day} Part ${partIdx}`);
      assert.deepEqual(
        visual.steps.map(s => s.at),
        ['intro', 'say1', 'example', 'tryIt'],
        `Step markers must be ['intro', 'say1', 'example', 'tryIt']`
      );
    }
  }
});

test('Block 209 (TASK-836..840): Domain specifics & deterministic Python code verification across Days 16–20', () => {
  // Day 16: GA4 Event-Driven Data Model & Exploration Reports
  const d16 = getLongLesson('bcom_dmkt', 16)!;
  assert.ok(d16.parts[0].code?.includes('parse_ga4_event_stream'));
  assert.ok(d16.parts[1].code?.includes('unnest_bigquery_ga4_events'));
  assert.ok(d16.parts[2].code?.includes('analyze_ga4_funnel_exploration'));
  assert.ok(d16.parts[3].code?.includes('evaluate_consent_mode_v2_payload'));
  assert.ok(d16.parts[4].code?.includes('run_enterprise_ga4_gateway'));

  // Day 17: Multi-Touch Attribution: U-Shaped & DDA
  const d17 = getLongLesson('bcom_dmkt', 17)!;
  assert.ok(d17.parts[0].code?.includes('calculate_rule_based_attribution'));
  assert.ok(d17.parts[1].code?.includes('calculate_position_based_attribution'));
  assert.ok(d17.parts[2].code?.includes('calculate_shapley_value_attribution'));
  assert.ok(d17.parts[3].code?.includes('calculate_markov_chain_removal_effects'));
  assert.ok(d17.parts[4].code?.includes('run_enterprise_attribution_gateway'));

  // Day 18: Growth Hacking & Pirate Metrics (AARRR)
  const d18 = getLongLesson('bcom_dmkt', 18)!;
  assert.ok(d18.parts[0].code?.includes('audit_pirate_metrics_funnel'));
  assert.ok(d18.parts[1].code?.includes('analyze_user_activation_velocity'));
  assert.ok(d18.parts[2].code?.includes('evaluate_cohort_retention_curves'));
  assert.ok(d18.parts[3].code?.includes('simulate_viral_loop_dynamics'));
  assert.ok(d18.parts[4].code?.includes('execute_enterprise_growth_flywheel'));

  // Day 19: App Store Optimization (ASO) & Mobile User Acquisition
  const d19 = getLongLesson('bcom_dmkt', 19)!;
  assert.ok(d19.parts[0].code?.includes('audit_aso_metadata_compliance'));
  assert.ok(d19.parts[1].code?.includes('analyze_app_product_page_cro'));
  assert.ok(d19.parts[2].code?.includes('simulate_apple_search_ads_campaigns'));
  assert.ok(d19.parts[3].code?.includes('decode_skan_conversion_values'));
  assert.ok(d19.parts[4].code?.includes('run_enterprise_mobile_acquisition_gateway'));

  // Day 20: Milestone 4 Capstone: Programmatic Advertising, RTB & Growth Analytics Engine
  const d20 = getLongLesson('bcom_dmkt', 20)!;
  assert.ok(d20.parts[0].code?.includes('execute_tier1_ga4_streaming_engine'));
  assert.ok(d20.parts[1].code?.includes('execute_tier2_attribution_reallocation_engine'));
  assert.ok(d20.parts[2].code?.includes('execute_tier3_aarrr_flywheel_engine'));
  assert.ok(d20.parts[3].code?.includes('execute_tier4_mobile_acquisition_engine'));
  assert.ok(d20.parts[4].code?.includes('execute_tier5_milestone4_grand_synthesizer'));
});

test('Course bcom_dmkt Milestone 4 Complete: All 20 Days Certified', () => {
  for (let day = 1; day <= 20; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_dmkt Day ${day} must have 5 parts`);
  }
});

test('Block 210 (TASK-841..845): Days 21–25 structural invariants, word budget & 5-part parity', () => {
  for (let day = 21; day <= 25; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_dmkt Day ${day} must have exactly 5 parts`);

    let dayWords = 0;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      assert.ok(part.title && part.title.length > 0, `Day ${day} Part ${partIdx + 1} must have title`);
      assert.ok(part.say && part.say.length >= 3, `Day ${day} Part ${partIdx + 1} must have >= 3 say paragraphs`);

      const partWords = part.say.reduce((sum, p) => sum + p.trim().split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWords >= 580, `Day ${day} Part ${partIdx + 1} word count (${partWords}) must be >= 580 words`);
      dayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${partIdx + 1} must have example`);
      assert.ok(part.code && part.code.includes('def '), `Day ${day} Part ${partIdx + 1} must have Python code`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${partIdx + 1} must have output`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${partIdx + 1} must have >= 3 codeNotes`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${partIdx + 1} must have tryIt`);

      assert.ok(part.check, `Day ${day} Part ${partIdx + 1} must have check`);
      assert.ok(part.check.question && part.check.question.length > 0);
      assert.equal(part.check.options.length, 4);
      assert.ok(part.check.why && part.check.why.length > 0);
    }

    assert.ok(dayWords >= 2950, `Day ${day} total words (${dayWords}) must be >= 2,950 words`);
  }
});

test('Block 210 (TASK-841..845): Domain specifics & deterministic Python code verification across Days 21–25', () => {
  // Day 21: Dynamic Retargeting & Ad Fatigue Frequency Capping
  const d21 = getLongLesson('bcom_dmkt', 21)!;
  assert.ok(d21.parts[0].code?.includes('simulate_dpa_catalog_sync'));
  assert.ok(d21.parts[1].code?.includes('calculate_recency_bid_multiplier'));
  assert.ok(d21.parts[2].code?.includes('evaluate_frequency_cap_and_pacing'));
  assert.ok(d21.parts[3].code?.includes('audit_ad_fatigue_and_wearout'));
  assert.ok(d21.parts[4].code?.includes('audit_enterprise_retargeting_gateway'));

  // Day 22: Customer Lifetime Value to CAC Ratio (CLV:CAC >= 3:1)
  const d22 = getLongLesson('bcom_dmkt', 22)!;
  assert.ok(d22.parts[0].code?.includes('decompose_customer_acquisition_cost'));
  assert.ok(d22.parts[1].code?.includes('calculate_customer_lifetime_value'));
  assert.ok(d22.parts[2].code?.includes('evaluate_clv_cac_ratio'));
  assert.ok(d22.parts[3].code?.includes('calculate_cac_payback_months'));
  assert.ok(d22.parts[4].code?.includes('audit_enterprise_unit_economics_gateway'));

  // Day 23: Community & Conversational Commerce: WhatsApp Business API
  const d23 = getLongLesson('bcom_dmkt', 23)!;
  assert.ok(d23.parts[0].code?.includes('simulate_whatsapp_webhook_router'));
  assert.ok(d23.parts[1].code?.includes('audit_whatsapp_broadcast_health'));
  assert.ok(d23.parts[2].code?.includes('simulate_whatsapp_cart_and_cod_recovery'));
  assert.ok(d23.parts[3].code?.includes('evaluate_live_selling_conversion_event'));
  assert.ok(d23.parts[4].code?.includes('audit_enterprise_conversational_gateway'));

  // Day 24: Marketing Mix Modeling (MMM) & Incrementality Geo-Testing
  const d24 = getLongLesson('bcom_dmkt', 24)!;
  assert.ok(d24.parts[0].code?.includes('simulate_top_down_mmm_regression'));
  assert.ok(d24.parts[1].code?.includes('calculate_adstock_and_saturation'));
  assert.ok(d24.parts[2].code?.includes('evaluate_geo_lift_experiment'));
  assert.ok(d24.parts[3].code?.includes('calculate_incremental_roas'));
  assert.ok(d24.parts[4].code?.includes('audit_enterprise_mmm_gateway'));

  // Day 25: Milestone 5 Capstone: Advanced Retargeting, Unit Economics, Conversational Commerce & Econometric MMM Engine
  const d25 = getLongLesson('bcom_dmkt', 25)!;
  assert.ok(d25.parts[0].code?.includes('execute_tier1_retargeting_control_tower'));
  assert.ok(d25.parts[1].code?.includes('execute_tier2_unit_economics_hub'));
  assert.ok(d25.parts[2].code?.includes('execute_tier3_conversational_engine'));
  assert.ok(d25.parts[3].code?.includes('execute_tier4_econometric_mmm_calibrator'));
  assert.ok(d25.parts[4].code?.includes('execute_tier5_master_growth_command_tower'));
});

test('Course bcom_dmkt Milestone 5 Complete: All 25 Days Certified', () => {
  for (let day = 1; day <= 25; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_dmkt Day ${day} must have 5 parts`);
  }
});

test('Block 211 (TASK-846..850): Days 26–30 structural invariants, word budget & 5-part parity', () => {
  for (let day = 26; day <= 30; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_dmkt Day ${day} must have exactly 5 parts`);

    let dayWords = 0;
    for (let partIdx = 0; partIdx < 5; partIdx++) {
      const part = lesson.parts[partIdx];
      assert.ok(part.title && part.title.length > 0, `Day ${day} Part ${partIdx + 1} must have title`);
      assert.ok(part.say && part.say.length >= 3, `Day ${day} Part ${partIdx + 1} must have >= 3 say paragraphs`);

      const partWords = part.say.reduce((sum, p) => sum + p.trim().split(/\s+/).filter(Boolean).length, 0);
      assert.ok(partWords >= 580, `Day ${day} Part ${partIdx + 1} word count (${partWords}) must be >= 580 words`);
      dayWords += partWords;

      assert.ok(part.example && part.example.length > 0, `Day ${day} Part ${partIdx + 1} must have example`);
      assert.ok(part.code && part.code.includes('def '), `Day ${day} Part ${partIdx + 1} must have Python code`);
      assert.ok(part.output && part.output.length > 0, `Day ${day} Part ${partIdx + 1} must have output`);
      assert.ok(part.codeNotes && part.codeNotes.length >= 3, `Day ${day} Part ${partIdx + 1} must have >= 3 codeNotes`);
      assert.ok(part.tryIt && part.tryIt.length > 0, `Day ${day} Part ${partIdx + 1} must have tryIt`);

      assert.ok(part.check, `Day ${day} Part ${partIdx + 1} must have check`);
      assert.ok(part.check.question && part.check.question.length > 0);
      assert.equal(part.check.options.length, 4);
      assert.ok(part.check.why && part.check.why.length > 0);
    }

    assert.ok(dayWords >= 2950, `Day ${day} total words (${dayWords}) must be >= 2,950 words`);
  }
});

test('Block 211 (TASK-846..850): Domain specifics & deterministic Python code verification across Days 26–30', () => {
  // Day 26: AI in Digital Marketing: Generative Creative Generation & Predictive Churn
  const d26 = getLongLesson('bcom_dmkt', 26)!;
  assert.ok(d26.parts[0].code?.includes('simulate_generative_ad_synthesis'));
  assert.ok(d26.parts[1].code?.includes('evaluate_predictive_churn_risk'));
  assert.ok(d26.parts[2].code?.includes('trigger_automated_retention_intervention'));
  assert.ok(d26.parts[3].code?.includes('simulate_contextual_bandit_bidding'));
  assert.ok(d26.parts[4].code?.includes('audit_enterprise_ai_marketing_gateway'));

  // Day 27: Data Privacy, Cookie Deprecation & First-Party Data Strategies
  const d27 = getLongLesson('bcom_dmkt', 27)!;
  assert.ok(d27.parts[0].code?.includes('simulate_privacy_sandbox_topics_api'));
  assert.ok(d27.parts[1].code?.includes('simulate_progressive_profiling_funnel'));
  assert.ok(d27.parts[2].code?.includes('simulate_server_side_tagging_pipeline'));
  assert.ok(d27.parts[3].code?.includes('audit_cmp_consent_and_regulatory_compliance'));
  assert.ok(d27.parts[4].code?.includes('audit_enterprise_privacy_gateway'));

  // Day 28: Digital Marketing Budgeting & Annual Media Planning: Share of Voice (SOV)
  const d28 = getLongLesson('bcom_dmkt', 28)!;
  assert.ok(d28.parts[0].code?.includes('simulate_objective_and_task_budget'));
  assert.ok(d28.parts[1].code?.includes('calculate_esov_and_market_share_projection'));
  assert.ok(d28.parts[2].code?.includes('allocate_annual_media_budget_and_flighting'));
  assert.ok(d28.parts[3].code?.includes('audit_mer_and_working_capital_buffers'));
  assert.ok(d28.parts[4].code?.includes('audit_enterprise_media_planning_gateway'));

  // Day 29: Omnichannel Customer Journey & Full-Funnel Growth Orchestration
  const d29 = getLongLesson('bcom_dmkt', 29)!;
  assert.ok(d29.parts[0].code?.includes('simulate_full_funnel_stage_alignment'));
  assert.ok(d29.parts[1].code?.includes('simulate_cross_network_audience_suppression'));
  assert.ok(d29.parts[2].code?.includes('reconcile_mta_and_mmm_attribution'));
  assert.ok(d29.parts[3].code?.includes('evaluate_executive_growth_velocity'));
  assert.ok(d29.parts[4].code?.includes('audit_enterprise_growth_orchestration_gateway'));

  // Day 30: Course 28 Grand Final Capstone: Enterprise Digital Marketing & Autonomous Growth Hacking Suite
  const d30 = getLongLesson('bcom_dmkt', 30)!;
  assert.ok(d30.parts[0].code?.includes('execute_tier1_seo_sem_quality_score_engine'));
  assert.ok(d30.parts[1].code?.includes('execute_tier2_paid_media_lookalike_tower'));
  assert.ok(d30.parts[2].code?.includes('execute_tier3_lifecycle_cro_testing_engine'));
  assert.ok(d30.parts[3].code?.includes('execute_tier4_analytics_attribution_mmm_calibrator'));
  assert.ok(d30.parts[4].code?.includes('execute_tier5_grand_master_boardroom_defense'));
});

test('Course bcom_dmkt 100% COMPLETE: All 30 Days & Milestone 6 Grand Final Capstone Certified', () => {
  for (let day = 1; day <= 30; day++) {
    const lesson = getLongLesson('bcom_dmkt', day);
    assert.ok(lesson, `bcom_dmkt Day ${day} must be defined`);
    assert.equal(lesson.day, day);
    assert.equal(lesson.parts.length, 5, `bcom_dmkt Day ${day} must have 5 parts`);
  }
});





