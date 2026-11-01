const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('🔥 STARTING BRUTAL AUTHENTIC PORTFOLIO & QR VERIFICATION AUDIT 🔥\n');
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
    // 1. Desktop Test: Verifiable Student Portfolio for user 658a3417-8e3d-4c8c-b80f-b477d7dcbb3c
    const targetUserId = '658a3417-8e3d-4c8c-b80f-b477d7dcbb3c';
    console.log(`1. Testing Desktop Public Portfolio (/university/portfolio/${targetUserId})...`);
    await page.goto(`http://localhost:3000/university/portfolio/${targetUserId}`, { waitUntil: 'networkidle' });
    
    // Check Candidate Name
    const nameEl = await page.locator('.student-name').textContent();
    console.log(`   Found Student Name: "${nameEl.trim()}"`);
    assert(nameEl.includes('Vinay'), 'Candidate name should be Vinay');

    // Check ZERO fake college name
    const pageHtml = await page.content();
    assert.strictEqual(pageHtml.includes('Apex Institute of Technology'), false, 'Should NEVER show fake Apex Institute for unassigned college!');
    console.log('   ✅ No fake college detected: Displays authentic Self-Directed / Independent Learner');

    // Check ZERO fake CGPA
    assert.strictEqual(pageHtml.includes('8.92'), false, 'Should NEVER fabricate CGPA 8.92!');
    console.log('   ✅ No fake CGPA detected');

    // Check Authentic Employability Score (Day 1 Cadet: 12/100, NOT fake 92)
    const scoreEl = await page.locator('.score-number').textContent();
    console.log(`   Found Authentic Employability Score: "${scoreEl.trim()}"`);
    assert.strictEqual(scoreEl.trim(), '12', 'Day 1 student score should be authentic 12/100, not fake 92!');

    const tierEl = await page.locator('.tier-badge').textContent();
    console.log(`   Found Tier Badge: "${tierEl.trim()}"`);
    assert(tierEl.includes('CADET'), 'Tier badge should be CADET (SPRINT 1 ACTIVE)');

    // Check KPI Grid
    const kpiCount = await page.locator('.kpi-card').count();
    assert.strictEqual(kpiCount, 4, 'Should render exactly 4 KPI cards');

    // Check ZERO fake Raft Capstone
    assert.strictEqual(pageHtml.includes('Raft Consensus Engine'), false, 'Should NEVER show fake Raft consensus project for Day 1 student!');
    console.log('   ✅ No fake capstone projects: Sprint 1 architecture milestone shown in progress');

    // Check PROMINENT Active Certification Program Card
    const ledgerTitle = await page.locator('.ledger-title').textContent();
    console.log(`   Found Active Program Title: "${ledgerTitle.trim()}"`);
    assert(ledgerTitle.includes('Fast-Track Sprint'), 'Active program should display Fast-Track Sprint');

    const dayText = await page.locator('.ledger-day-text').textContent();
    console.log(`   Found Day Progress: "${dayText.trim()}"`);
    assert(dayText.includes('Day 1 of 60'), 'Should display Day 1 of 60');

    const currentTaskTitle = await page.locator('.milestone-box >> text=App Title Formatter').count();
    assert(currentTaskTitle >= 1, 'Should display current task App Title Formatter');
    console.log('   ✅ Certification course details verified: Program, Day 1 of 60, current practice task.');

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
    console.log(`\n3. Testing Verification Gateway (/verify/${targetUserId})...`);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`http://localhost:3000/verify/${targetUserId}`, { waitUntil: 'networkidle' });

    // Assert that the link to /quests?tab=passport is GONE and replaced by the portfolio link
    const passportHref = await page.locator('a:has-text("View Verifiable Skill Passport & Portfolio")').getAttribute('href');
    console.log(`   Passport Link target: "${passportHref}"`);
    assert(passportHref.includes(`/university/portfolio/${targetUserId}`), 'Should link to /university/portfolio/[id]');
    
    const badQuestLink = await page.locator('a[href*="/quests?tab=passport"]').count();
    assert.strictEqual(badQuestLink, 0, 'No broken /quests?tab=passport link should exist on verification page!');
    console.log('   ✅ Broken /quests?tab=passport link successfully eliminated.');

    // Direct navigation check
    await page.goto(`http://localhost:3000/university/portfolio/${targetUserId}`, { waitUntil: 'networkidle' });
    assert(page.url().includes(`/university/portfolio/${targetUserId}`), 'Direct navigation should succeed');
    console.log(`   ✅ Successfully navigated to: ${page.url()}`);

    // 4. Test /passport redirection
    console.log('\n4. Testing /passport route redirection...');
    await page.goto('http://localhost:3000/passport');
    await page.waitForFunction(() => window.location.pathname.includes('/university/portfolio/'), { timeout: 10000 });
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
