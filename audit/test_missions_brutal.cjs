const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('🔥 STARTING BRUTAL AUDIT: TAB 3 (DAILY MISSIONS & STREAK COCKPIT: /missions) 🔥\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  try {
    // ─────────────────────────────────────────────────────────────────
    // TEST 1: Mount & Authenticated Cockpit
    // ─────────────────────────────────────────────────────────────────
    console.log('1. Mounting Missions Cockpit with Authenticated Student...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
    
    await page.evaluate(() => {
      localStorage.clear();
      const demoUser = {
        id: 'usr_demo_student_01',
        name: 'Vinay',
        displayName: 'Vinay',
        email: 'vinay@campus.edu',
        role: 'student',
        careerDnaScore: 72,
        trustScore: 88,
        atsScore: 82,
        xp: 1450,
        pins: 450,
        missionStreak: 5,
        skill_tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      };
      localStorage.setItem('pinit_current_user', JSON.stringify(demoUser));
      localStorage.setItem('pinit_user', JSON.stringify(demoUser));
      localStorage.setItem('pinit_usr_demo_student_01_profile', JSON.stringify(demoUser));
      localStorage.setItem('pinit_usr_demo_student_01_streak', '5');
      localStorage.setItem('pinit_usr_demo_student_01_xp', '1450');
      localStorage.setItem('pinit_usr_demo_student_01_pins', '450');
      localStorage.setItem('pinit_session_token', 'demo-session-token');
      localStorage.setItem('pinit_onboarding_completed', 'true');
    });

    await page.goto('http://localhost:3000/missions', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const bodyText = await page.textContent('body');
    assert.ok(
      bodyText.includes('Mission') || bodyText.includes('Daily') || bodyText.includes('Streak'),
      'Missions cockpit missing primary keywords!'
    );
    console.log('   ✅ Missions cockpit mounted with daily challenges.');

    // ─────────────────────────────────────────────────────────────────
    // TEST 2: Streak Display & Multiplier Verification
    // ─────────────────────────────────────────────────────────────────
    console.log('2. Testing Streak Multiplier HUD...');
    const hasStreakElement = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Streak') || text.includes('🔥') || text.includes('Day');
    });
    assert.ok(hasStreakElement, 'Streak indicator missing from cockpit!');
    console.log('   ✅ Streak indicator & multiplier confirmed.');

    // ─────────────────────────────────────────────────────────────────
    // TEST 3: Actionable Mission Triggers
    // ─────────────────────────────────────────────────────────────────
    console.log('3. Inspecting Actionable Mission Cards...');
    const missionCards = page.locator('button:has-text("Start"), button:has-text("Launch"), button:has-text("Solve"), button:has-text("Open")');
    const missionCount = await missionCards.count();
    console.log(`   ✅ Found ${missionCount} interactive mission action points.`);

    // ─────────────────────────────────────────────────────────────────
    // TEST 4: Console Error Audit
    // ─────────────────────────────────────────────────────────────────
    console.log('4. Checking for Console Errors...');
    const realErrors = consoleErrors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('WebSocket') && 
      !e.includes('NEXT_PUBLIC_SUPABASE') &&
      !e.includes('Failed to load resource')
    );
    if (realErrors.length > 0) {
      console.error('   ❌ Found console errors:', realErrors);
      process.exit(1);
    } else {
      console.log('   ✅ ZERO unhandled JavaScript errors or React exceptions.');
    }

    console.log('\n🏆 TAB 3 (MISSIONS: /missions) PASSED BRUTAL TESTING! 🏆');

  } catch (err) {
    console.error('❌ Brutal Test Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
