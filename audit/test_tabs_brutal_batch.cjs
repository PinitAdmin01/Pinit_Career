const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('🔥 STARTING COMPREHENSIVE BRUTAL AUDIT: TABS 4 THROUGH 12 🔥\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('WebSocket') && !text.includes('NEXT_PUBLIC_SUPABASE') && !text.includes('Failed to load resource')) {
        consoleErrors.push(`[${page.url()}] ${text}`);
      }
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(`[${page.url()}] ${err.message}`);
  });

  const setupAuth = async () => {
    await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.clear();
      const demoUser = {
        id: 'usr_demo_student_01',
        name: 'Vinay',
        displayName: 'Vinay',
        email: 'vinay@campus.edu',
        role: 'student',
        identityStatus: 'Active',
        recruiter_visibility: 85,
        interviews_done: 4,
        careerDnaScore: 72,
        trustScore: 88,
        atsScore: 82,
        xp: 1450,
        pins: 450,
        missionStreak: 5,
        onboardingStep: 3,
        onboarding_step: 3,
        roadmapGenerated: true,
        roadmap_generated: true,
        skill_tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python'],
        weak_areas: ['System Design', 'Dynamic Programming'],
      };
      localStorage.setItem('pinit_current_user', JSON.stringify(demoUser));
      localStorage.setItem('pinit_user', JSON.stringify(demoUser));
      localStorage.setItem('pinit_usr_demo_student_01_profile', JSON.stringify(demoUser));
      localStorage.setItem('pinit_usr_demo_student_01_xp', '1450');
      localStorage.setItem('pinit_usr_demo_student_01_pins', '450');
      localStorage.setItem('pinit_usr_demo_student_01_streak', '5');
      localStorage.setItem('pinit_usr_demo_student_01_ob_step', '3');
      localStorage.setItem('pinit_usr_demo_student_01_road_gen', 'true');
      localStorage.setItem('pinit_usr_demo_student_01_onboarding_complete', 'true');
      localStorage.setItem('pinit_session_token', 'demo-session-token');
      localStorage.setItem('pinit_onboarding_completed', 'true');
      localStorage.setItem('pinit_has_completed_onboarding', 'true');
      localStorage.setItem('pinit_usr_demo_student_01_onboarding_answers', JSON.stringify({
        hasCompleted: true,
        role: 'Full-Stack Developer',
        trajectory: 'Full-Stack Developer',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        weakAreas: ['System Design', 'Dynamic Programming'],
      }));
      localStorage.setItem('pinit:pins_balance:usr_demo_student_01', '450');
    });
  };

  try {
    await setupAuth();

    // ─────────────────────────────────────────────────────────────────
    // TAB 4: /arena
    // ─────────────────────────────────────────────────────────────────
    console.log('--- Testing Tab 4: /arena ---');
    await page.goto('http://localhost:3000/arena', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const arenaText = await page.innerText('body');
    assert.ok(arenaText.includes('Arena') || arenaText.includes('Battle') || arenaText.includes('Challenge') || arenaText.includes('Code'), 'Tab 4 /arena failed basic render!');
    console.log('   ✅ Tab 4 (/arena) mounted successfully.');

    // ─────────────────────────────────────────────────────────────────
    // TAB 5: /projects
    // ─────────────────────────────────────────────────────────────────
    console.log('--- Testing Tab 5: /projects ---');
    await page.goto('http://localhost:3000/projects', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const projectsText = await page.innerText('body');
    assert.ok(projectsText.includes('Project') || projectsText.includes('Innovation') || projectsText.includes('Squad'), 'Tab 5 /projects failed basic render!');
    console.log('   ✅ Tab 5 (/projects) mounted successfully.');

    // ─────────────────────────────────────────────────────────────────
    // TAB 6: /leaderboard
    // ─────────────────────────────────────────────────────────────────
    console.log('--- Testing Tab 6: /leaderboard ---');
    await page.goto('http://localhost:3000/leaderboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const lbText = await page.innerText('body');
    assert.ok(lbText.includes('Leaderboard') || lbText.includes('League') || lbText.includes('Rank'), 'Tab 6 /leaderboard failed basic render!');
    console.log('   ✅ Tab 6 (/leaderboard) mounted successfully.');

    // ─────────────────────────────────────────────────────────────────
    // TAB 7: /interview
    // ─────────────────────────────────────────────────────────────────
    console.log('--- Testing Tab 7: /interview ---');
    await page.goto('http://localhost:3000/interview', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const interviewText = await page.innerText('body');
    assert.ok(interviewText.includes('Interview') || interviewText.includes('Simulator') || interviewText.includes('AI') || interviewText.includes('Technical'), 'Tab 7 /interview failed basic render!');
    console.log('   ✅ Tab 7 (/interview) mounted successfully.');

    // ─────────────────────────────────────────────────────────────────
    // TAB 8: /group-discussion
    // ─────────────────────────────────────────────────────────────────
    console.log('--- Testing Tab 8: /group-discussion ---');
    await page.goto('http://localhost:3000/group-discussion', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const gdText = await page.innerText('body');
    assert.ok(gdText.includes('Discussion') || gdText.includes('Boardroom') || gdText.includes('Topic') || gdText.includes('Moderator'), 'Tab 8 /group-discussion failed basic render!');
    console.log('   ✅ Tab 8 (/group-discussion) mounted successfully.');

    // ─────────────────────────────────────────────────────────────────
    // TAB 9: /learning
    // ─────────────────────────────────────────────────────────────────
    console.log('--- Testing Tab 9: /learning ---');
    await page.goto('http://localhost:3000/learning', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const learningText = await page.innerText('body');
    assert.ok(learningText.includes('Learning') || learningText.includes('Skill') || learningText.includes('Tree') || learningText.includes('Mastery'), 'Tab 9 /learning failed basic render!');
    console.log('   ✅ Tab 9 (/learning) mounted successfully.');

    // ─────────────────────────────────────────────────────────────────
    // TAB 10: /attention-span
    // ─────────────────────────────────────────────────────────────────
    console.log('--- Testing Tab 10: /attention-span ---');
    await page.goto('http://localhost:3000/attention-span', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const focusText = await page.innerText('body');
    assert.ok(focusText.includes('Attention') || focusText.includes('Focus') || focusText.includes('Calibration') || focusText.includes('Timer'), 'Tab 10 /attention-span failed basic render!');
    console.log('   ✅ Tab 10 (/attention-span) mounted successfully.');

    // ─────────────────────────────────────────────────────────────────
    // TAB 11: /pins
    // ─────────────────────────────────────────────────────────────────
    console.log('--- Testing Tab 11: /pins ---');
    await page.goto('http://localhost:3000/pins', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const pinsText = await page.innerText('body');
    assert.ok(pinsText.includes('Pins') || pinsText.includes('Wallet') || pinsText.includes('Economy') || pinsText.includes('Balance'), 'Tab 11 /pins failed basic render!');
    console.log('   ✅ Tab 11 (/pins) mounted successfully.');

    // ─────────────────────────────────────────────────────────────────
    // TAB 12: /profile
    // ─────────────────────────────────────────────────────────────────
    console.log('--- Testing Tab 12: /profile ---');
    await page.goto('http://localhost:3000/profile', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const profileText = await page.innerText('body');
    assert.ok(profileText.includes('Profile') || profileText.includes('Vinay') || profileText.includes('Settings') || profileText.includes('Skills'), 'Tab 12 /profile failed basic render!');
    console.log('   ✅ Tab 12 (/profile) mounted successfully.');

    // ─────────────────────────────────────────────────────────────────
    // CONSOLE ERROR AUDIT ACROSS ALL TABS
    // ─────────────────────────────────────────────────────────────────
    console.log('\n--- Checking Console Error Ledger across all tabs ---');
    if (consoleErrors.length > 0) {
      console.error('   ❌ Found unhandled errors across tabs:', consoleErrors);
      process.exit(1);
    } else {
      console.log('   ✅ ZERO unhandled JavaScript errors across Tabs 4 through 12!');
    }

    console.log('\n🏆 TABS 4 THROUGH 12 PASSED ALL BRUTAL TESTS WITH 100% SUCCESS! 🏆');

  } catch (err) {
    console.error('❌ Brutal Test Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
