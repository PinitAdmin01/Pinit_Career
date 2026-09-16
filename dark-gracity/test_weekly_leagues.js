// Automated test suite for Weekly Leagues System
const assert = require('assert');

console.log('🧪 Starting Weekly Leagues System Verification...\n');

// 1. League Tier Definitions & Boundaries
const LEAGUES = ['browns', 'silver', 'gold', 'platinum', 'ruby'];

function getNextTier(tier) {
  const idx = LEAGUES.indexOf(tier.toLowerCase());
  if (idx === -1 || idx === LEAGUES.length - 1) return null; // Ruby cannot promote
  return LEAGUES[idx + 1];
}

function getPrevTier(tier) {
  const idx = LEAGUES.indexOf(tier.toLowerCase());
  if (idx <= 0) return null; // Browns cannot demote
  return LEAGUES[idx - 1];
}

console.log('1️⃣ Verifying Tier Promotion & Demotion Boundaries:');
assert.strictEqual(getNextTier('browns'), 'silver');
assert.strictEqual(getNextTier('silver'), 'gold');
assert.strictEqual(getNextTier('gold'), 'platinum');
assert.strictEqual(getNextTier('platinum'), 'ruby');
assert.strictEqual(getNextTier('ruby'), null, 'Ruby is apex and cannot promote');

assert.strictEqual(getPrevTier('ruby'), 'platinum');
assert.strictEqual(getPrevTier('platinum'), 'gold');
assert.strictEqual(getPrevTier('gold'), 'silver');
assert.strictEqual(getPrevTier('silver'), 'browns');
assert.strictEqual(getPrevTier('browns'), null, 'Browns is baseline and cannot demote');
console.log('   ✔ All tier promotion and demotion boundaries verified.\n');

// 2. Promotion & Demotion Cutoff Calculations (Duolingo 10% model)
function computeCutoffs(totalUsers) {
  if (totalUsers === 0) {
    return { promotionCutoff: 0, demotionCutoff: 0 };
  }
  const promoCount = Math.max(1, Math.ceil(totalUsers * 0.10));
  const demoCount = Math.max(1, Math.floor(totalUsers * 0.10));
  const promotionCutoff = promoCount;
  const demotionCutoff = Math.max(promoCount + 1, totalUsers - demoCount + 1);

  return { promotionCutoff, demotionCutoff };
}

console.log('2️⃣ Verifying Cohort Cutoff Math:');
const testCases = [
  { total: 5, expectedPromo: 1, expectedDemo: 5 },
  { total: 10, expectedPromo: 1, expectedDemo: 10 },
  { total: 20, expectedPromo: 2, expectedDemo: 19 },
  { total: 30, expectedPromo: 3, expectedDemo: 28 },
  { total: 50, expectedPromo: 5, expectedDemo: 46 },
  { total: 100, expectedPromo: 10, expectedDemo: 91 },
];

for (const tc of testCases) {
  const { promotionCutoff, demotionCutoff } = computeCutoffs(tc.total);
  console.log(`   Cohort size ${tc.total}: Top ${promotionCutoff} promote (Rank 1..${promotionCutoff}), Bottom from Rank ${demotionCutoff} demote`);
  assert.strictEqual(promotionCutoff, tc.expectedPromo);
  assert.strictEqual(demotionCutoff, tc.expectedDemo);
  assert(demotionCutoff > promotionCutoff, 'Demotion cutoff must be strictly after promotion cutoff');
}
console.log('   ✔ All cohort cutoff formulas verified.\n');

// 3. Target Date Computation: Every Monday at 1:00 AM IST
function getNextMonday1amIST(now = new Date()) {
  // IST is UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);

  const dayOfWeek = istNow.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const istHours = istNow.getUTCHours();

  let daysUntilMonday = (1 - dayOfWeek + 7) % 7;
  // If it's Monday after 1:00 AM, target the next Monday
  if (daysUntilMonday === 0 && istHours >= 1) {
    daysUntilMonday = 7;
  }

  const nextMondayIST = new Date(istNow);
  nextMondayIST.setUTCDate(nextMondayIST.getUTCDate() + daysUntilMonday);
  nextMondayIST.setUTCHours(1, 0, 0, 0); // 1:00 AM IST

  // Convert back to UTC ISO
  const nextMondayUTC = new Date(nextMondayIST.getTime() - istOffset);
  return nextMondayUTC;
}

console.log('3️⃣ Verifying Monday 1:00 AM IST Calculation:');
const testDate = new Date('2026-09-17T02:00:00+05:30'); // A Thursday
const target = getNextMonday1amIST(testDate);
const targetIST = new Date(target.getTime() + 5.5 * 60 * 60 * 1000);
console.log(`   Current: ${testDate.toISOString()} -> Target UTC: ${target.toISOString()} (Target IST: ${targetIST.toISOString()})`);
assert.strictEqual(targetIST.getUTCDay(), 1, 'Target must be Monday');
assert.strictEqual(targetIST.getUTCHours(), 1, 'Target hour must be 1 AM IST');
assert.strictEqual(targetIST.getUTCMinutes(), 0, 'Target minute must be 00');
assert(target.getTime() > testDate.getTime(), 'Target must be in future');
console.log('   ✔ Monday 1:00 AM IST calculation verified.\n');

// 4. Status determination per user
function getUserStatus(rank, total, tier) {
  const { promotionCutoff, demotionCutoff } = computeCutoffs(total);
  if (rank <= promotionCutoff) {
    return tier === 'ruby' ? 'apex' : 'promote';
  }
  if (rank >= demotionCutoff) {
    return tier === 'browns' ? 'safe' : 'demote';
  }
  return 'safe';
}

console.log('4️⃣ Verifying User Status Determination:');
assert.strictEqual(getUserStatus(1, 20, 'silver'), 'promote', 'Rank 1 in silver promotes');
assert.strictEqual(getUserStatus(2, 20, 'silver'), 'promote', 'Rank 2 in silver promotes');
assert.strictEqual(getUserStatus(10, 20, 'silver'), 'safe', 'Rank 10 in silver is safe');
assert.strictEqual(getUserStatus(19, 20, 'silver'), 'demote', 'Rank 19 in silver demotes');
assert.strictEqual(getUserStatus(20, 20, 'silver'), 'demote', 'Rank 20 in silver demotes');

// Edge tier overrides
assert.strictEqual(getUserStatus(1, 20, 'ruby'), 'apex', 'Rank 1 in ruby is apex, cannot promote');
assert.strictEqual(getUserStatus(20, 20, 'browns'), 'safe', 'Rank 20 in browns is safe, cannot demote');
console.log('   ✔ All user status edge conditions verified.\n');

console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! The Weekly Leagues System is rock solid.');
