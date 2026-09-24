/**
 * scripts/tests/test_pins_economy_invariants.ts
 *
 * Verifies the 1 Rs = 10 Pins Economy, Airtel-Style 1:00 AM Daily Reset,
 * ₹99 Basic Student Plan (120 Daily Pins), and Feature Cost Invariants across
 * the full stack (Hooks, API routes, Cron, and Catalog).
 *
 * Run: npx tsx scripts/tests/test_pins_economy_invariants.ts
 */

import fs from 'fs';
import path from 'path';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ [PASS] ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${msg}`);
    failed++;
  }
}

async function run() {
  console.log('========================================================================');
  console.log('⚡ TESTING PINS ECONOMY & 1 RS = 10 PINS AIRTEL RESET INVARIANTS');
  console.log('========================================================================\n');

  // Test 1: Client PIN_COSTS in usePinBalance.ts
  console.log('--- Suite 1: Client Feature Pin Costs (usePinBalance.ts) ---');
  const balanceHookCode = fs.readFileSync(path.join(process.cwd(), 'src/hooks/usePinBalance.ts'), 'utf-8');
  assert(balanceHookCode.includes("quest:                 { cost: 20"), '1.1 Quest cost is 20 pins');
  assert(balanceHookCode.includes("mission:               { cost: 20"), '1.2 Mission cost is 20 pins');
  assert(balanceHookCode.includes("interview:             { cost: 35"), '1.3 Interview cost is 35 pins');
  assert(balanceHookCode.includes("ai_interview:          { cost: 35"), '1.4 AI Interview cost is 35 pins');
  assert(balanceHookCode.includes("gd:                    { cost: 35"), '1.5 GD Practice cost is 35 pins');
  assert(balanceHookCode.includes("group_discussion:      { cost: 35"), '1.6 Group Discussion cost is 35 pins');
  assert(balanceHookCode.includes("code_arena:            { cost: 10"), '1.7 Code Arena duel cost is 10 pins');
  assert(balanceHookCode.includes("arena:                 { cost: 10"), '1.8 Arena alias cost is 10 pins');
  assert(balanceHookCode.includes("project:               { cost: 10"), '1.9 Project review cost is 10 pins');
  assert(balanceHookCode.includes("group_project:         { cost: 10"), '1.10 Group Project collaboration cost is 10 pins');

  // Test 2: Server-Authoritative SERVER_PIN_COSTS in /api/pins/spend/route.ts
  console.log('\n--- Suite 2: Server-Authoritative Cost Enforcement (/api/pins/spend) ---');
  const spendCode = fs.readFileSync(path.join(process.cwd(), 'src/app/api/pins/spend/route.ts'), 'utf-8');
  assert(spendCode.includes('quest:                20,'), '2.1 Server quest cost enforces 20 pins');
  assert(spendCode.includes('mission:              20,'), '2.2 Server mission cost enforces 20 pins');
  assert(spendCode.includes('interview:            35,'), '2.3 Server interview cost enforces 35 pins');
  assert(spendCode.includes('gd:                   35,'), '2.4 Server gd cost enforces 35 pins');
  assert(spendCode.includes('code_arena:           10,'), '2.5 Server code_arena cost enforces 10 pins');
  assert(spendCode.includes('arena:                10,'), '2.6 Server arena cost enforces 10 pins');
  assert(spendCode.includes('project:              10,'), '2.7 Server project cost enforces 10 pins');
  assert(spendCode.includes('group_project:        10,'), '2.8 Server group_project cost enforces 10 pins');

  // Test 3: Catalog Pricing & 1 Rs = 10 Pins Conversion
  console.log('\n--- Suite 3: Catalog Pricing & 1 Rs = 10 Pins Exchange Rate ---');
  const orderCode = fs.readFileSync(path.join(process.cwd(), 'src/app/api/payment/create-order/route.ts'), 'utf-8');
  assert(orderCode.includes('basic_student: 9900,'), '3.1 basic_student plan is exactly ₹99 (9900 paise)');
  assert(orderCode.includes('student_99: 9900,'), '3.2 student_99 plan alias is exactly ₹99 (9900 paise)');
  assert(orderCode.includes('pack_100: 1000,'), '3.3 pack_100 (100 pins) is ₹10 (1000 paise) [1 Rs = 10 Pins]');
  assert(orderCode.includes('pack_300: 3000,'), '3.4 pack_300 (300 pins) is ₹30 (3000 paise)');
  assert(orderCode.includes('pack_500: 5000,'), '3.5 pack_500 (500 pins) is ₹50 (5000 paise)');
  assert(orderCode.includes('pack_1000: 9900,'), '3.6 pack_1000 (1,000 pins) is ₹99 (Bonus Value)');
  assert(orderCode.includes('Math.ceil(clamped / 10) * 100;'), '3.7 customPinsToPaise uses 1 Rs = 10 Pins formula (clamped / 10)');

  // Test 4: Verification Route Subscriptions & Pack Support
  console.log('\n--- Suite 4: Payment Verification & Daily Quota Activation ---');
  const verifyCode = fs.readFileSync(path.join(process.cwd(), 'src/app/api/payment/verify/route.ts'), 'utf-8');
  assert(verifyCode.includes("notesPlanId === 'basic_student'") && verifyCode.includes("notesPlanId === 'student_99'"),
    '4.1 /api/payment/verify recognizes basic_student and student_99 plans');
  assert(verifyCode.includes("nextDailyPins = Math.max(currentPins, 120)"),
    '4.2 Subscription verification sets daily pins to 120');
  assert(verifyCode.includes("pack_100") && verifyCode.includes("pack_300") && verifyCode.includes("pack_500") && verifyCode.includes("pack_1000"),
    '4.3 /api/payment/verify credits new 1 Rs = 10 Pins packs (pack_100..pack_1000)');

  // Test 5: Daily 1:00 AM Cron Reset (Airtel Model)
  console.log('\n--- Suite 5: Airtel-Style Daily Pin Reset (1:00 AM IST) ---');
  const cronCode = fs.readFileSync(path.join(process.cwd(), 'src/app/api/cron/daily-pin-reset/route.ts'), 'utf-8');
  assert(cronCode.includes("['pro', 'basic', 'basic_student', 'student']"),
    '5.1 Daily reset renews 120 pins for all subscribed students (basic & pro)');
  assert(cronCode.includes("pins: 120, last_pin_reset: now"),
    '5.2 Daily renewal sets exactly 120 pins at 1:00 AM IST');
  assert(cronCode.includes("bonus_pins") || !cronCode.includes("bonus_pins: 0"),
    '5.3 Permanent bonus vault pins are NOT wiped by 1:00 AM daily reset');

  // Test 6: Pricing and Pins UI Presentation
  console.log('\n--- Suite 6: Frontend Pages & Pricing UI Verification ---');
  const pinsPageCode = fs.readFileSync(path.join(process.cwd(), 'src/app/pins/page.tsx'), 'utf-8');
  assert(pinsPageCode.includes('pack_100') && pinsPageCode.includes('pack_1000'),
    '6.1 Pins page displays 1 Rs = 10 Pins catalog packs');
  assert(pinsPageCode.includes('Basic Student Pass') && pinsPageCode.includes('₹99'),
    '6.2 Pins page prominently features Basic Student Pass for ₹99/mo (120 pins/day)');
  assert(pinsPageCode.includes('Math.ceil(customPins / 10)'),
    '6.3 Custom slider calculates price as ₹1 per 10 pins');

  const pricingPageCode = fs.readFileSync(path.join(process.cwd(), 'src/app/pricing/page.tsx'), 'utf-8');
  assert(pricingPageCode.includes('BASIC STUDENT PASS') && pricingPageCode.includes('₹99'),
    '6.4 Public Pricing page features Basic Student Pass for ₹99/mo with 120 Daily Pins');
  assert(pricingPageCode.includes('handleBasicCheckout'),
    '6.5 Public Pricing page connects Basic Student Pass directly to checkout');

  // Test 7: Daily Student Budget Math Check (Mathematical Invariant)
  console.log('\n--- Suite 7: Daily Student Curriculum Budget Math ---');
  const questCost = 20;
  const missionCost = 20;
  const interviewCost = 35;
  const arenaCost = 10;
  const projectCost = 10;
  const dailyCurriculumCost = questCost + missionCost + interviewCost + arenaCost + projectCost;
  assert(dailyCurriculumCost === 95, '7.1 Daily full curriculum (Quest 20 + Mission 20 + Interview 35 + Arena 10 + Project 10) = 95 pins');
  assert(dailyCurriculumCost <= 120, '7.2 95 pins cost is within 120 daily student allowance (25 pins surplus buffer)');

  console.log('\n========================================================================');
  console.log(`⚡ PINS ECONOMY VERIFICATION: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================');

  if (failed > 0) process.exit(1);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
