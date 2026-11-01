const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('🔥 STARTING BRUTAL PORTFOLIO & QR VERIFICATION AUDIT 🔥\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // 1. Desktop Test: Verifiable Student Portfolio
    console.log('1. Testing Desktop Public Portfolio (/university/portfolio/usr_demo_student_01)...');
    await page.goto('http://localhost:3000/university/portfolio/usr_demo_student_01', { waitUntil: 'networkidle' });
    
    // Check Candidate Details
    const nameEl = await page.locator('.student-name').textContent();
    console.log(`   Found Student Name: "${nameEl}"`);
    assert(nameEl.includes('Vinay'), 'Candidate name should be Vinay');

    const degreeEl = await page.locator('.student-degree').textContent();
    assert(degreeEl.includes('Artificial Intelligence') || degreeEl.includes('Computer Science'), 'Degree title should be present');

    const scoreEl = await page.locator('.score-number').textContent();
    assert.strictEqual(scoreEl.trim(), '92', 'Employability score should be 92');

    const tierEl = await page.locator('.tier-badge').textContent();
    assert(tierEl.includes('TIER 1 PRODUCT'), 'Tier badge should be TIER 1 PRODUCT');

    // Check KPI Grid
    const kpiCount = await page.locator('.kpi-card').count();
    assert.strictEqual(kpiCount, 4, 'Should render exactly 4 KPI cards');

    // Check Capstones & Badges
    const capstonesCount = await page.locator('.capstone-card').count();
    assert(capstonesCount >= 2, 'Should display at least 2 verified capstones');
    console.log(`   ✅ Capstones verified: ${capstonesCount} defended engineering projects`);

    // Check Cryptographic SHA-256 Proof Box
    const shaText = await page.locator('.fingerprint-box code').textContent();
    assert(shaText.length === 64, 'SHA-256 hash should be exactly 64 characters long');
    console.log(`   ✅ SHA-256 Fingerprint valid: ${shaText.slice(0, 16)}...`);

    // Check Copy Hash button
    await page.locator('.copy-hash-btn').click();
    console.log('   ✅ Copy SHA-256 Proof button clicked cleanly.');

    // 2. Mobile Viewport Test (iPhone SE: 375x667)
    console.log('\n2. Testing Mobile Viewport (375x667)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Verify no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    assert.strictEqual(hasHorizontalOverflow, false, 'Mobile portfolio must NOT have horizontal scrollbar!');
    console.log('   ✅ Mobile responsiveness verified: ZERO horizontal overflow on 375px width.');

    // 3. Test Verification Gateway Route & Button Redirection
    console.log('\n3. Testing Verification Gateway (/verify/658a3417-8e3d-4c8c-b80f-b477d7dcbb3c)...');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/verify/658a3417-8e3d-4c8c-b80f-b477d7dcbb3c', { waitUntil: 'networkidle' });

    // Assert that the link to /quests?tab=passport is GONE and replaced by the portfolio link
    const passportHref = await page.locator('a:has-text("View Verifiable Skill Passport & Portfolio")').getAttribute('href');
    console.log(`   Passport Link target: "${passportHref}"`);
    assert(passportHref.includes('/university/portfolio/658a3417-8e3d-4c8c-b80f-b477d7dcbb3c'), 'Should link to /university/portfolio/[id]');
    
    const badQuestLink = await page.locator('a[href*="/quests?tab=passport"]').count();
    assert.strictEqual(badQuestLink, 0, 'No broken /quests?tab=passport link should exist on verification page!');
    console.log('   ✅ Broken /quests?tab=passport link successfully eliminated.');

    // Click through to portfolio from verification page
    await page.locator('a:has-text("View Verifiable Skill Passport & Portfolio")').click();
    await page.waitForURL('**/university/portfolio/**', { timeout: 10000 });
    console.log(`   ✅ Successfully navigated to: ${page.url()}`);

    // 4. Test /passport redirection
    console.log('\n4. Testing /passport route redirection...');
    await page.goto('http://localhost:3000/passport');
    await page.waitForURL('**/university/portfolio/**', { timeout: 10000 });
    console.log(`   ✅ /passport smoothly redirected to: ${page.url()}`);

    // 5. Check Console Errors
    const filteredErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('font'));
    assert.strictEqual(filteredErrors.length, 0, `Found console errors: ${filteredErrors.join(', ')}`);
    console.log('\n✅ ZERO unhandled JavaScript errors across portfolio, verification, and mobile flows!');

    console.log('\n🏆 ALL BRUTAL PORTFOLIO & QR VERIFICATION TESTS PASSED 100%! 🏆');
  } finally {
    await browser.close();
  }
})();
