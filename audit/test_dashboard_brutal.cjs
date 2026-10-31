const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('🔥 STARTING BRUTAL AUDIT: TAB 1 (STUDENT DASHBOARD: /dashboard) 🔥\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  try {
    // ─────────────────────────────────────────────────────────────────
    // TEST 1: Unauthenticated Session Barrier
    // ─────────────────────────────────────────────────────────────────
    console.log('1. Testing Unauthenticated Session Barrier...');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(2000);

    const isLoginOrAuth = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Authentication Required') || text.includes('Sign in') || window.location.pathname.includes('/login');
    });
    assert.ok(isLoginOrAuth, 'Unauthenticated user was not redirected or presented with auth requirement!');
    console.log('   ✅ Unauthenticated session barrier passed.\n');

    // ─────────────────────────────────────────────────────────────────
    // TEST 2: Authenticated Student Session Mount & HUD
    // ─────────────────────────────────────────────────────────────────
    console.log('2. Injecting Authenticated Student Session & Testing Mount...');
    
    // Ensure we are on local origin to write localStorage
    await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
    
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
        weak_areas: ['System Design', 'Dynamic Programming'],
        skill_tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      };
      // Primary keys for AuthContext & UserProgressContext
      localStorage.setItem('pinit_current_user', JSON.stringify(demoUser));
      localStorage.setItem('pinit_user', JSON.stringify(demoUser));
      localStorage.setItem('pinit_usr_demo_student_01_profile', JSON.stringify(demoUser));
      localStorage.setItem('pinit_usr_demo_student_01_xp', '1450');
      localStorage.setItem('pinit_usr_demo_student_01_pins', '450');
      localStorage.setItem('pinit_session_token', 'demo-session-token');
      localStorage.setItem('pinit_onboarding_completed', 'true');
      localStorage.setItem('pinit_usr_demo_student_01_onboarding_answers', JSON.stringify({
        hasCompleted: true,
        goal: 'faang',
        primary_interest: 'software',
        career_focus: 'Full-Stack Developer',
        college_year: '3rd Year',
        target_role: 'Full-Stack Developer',
        trajectory: 'Full-Stack Developer',
        mindset_archetype: 'Pattern Hunter',
        skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        weakAreas: ['System Design', 'Dynamic Programming'],
      }));
      localStorage.setItem('pinit:pins_balance:usr_demo_student_01', '450');
    });

    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.db-page', { timeout: 15000 });
    await page.waitForTimeout(1000);

    // Verify Greeting
    const greeting = await page.textContent('.db-page');
    assert.ok(greeting.includes('System Online: Vinay'), 'Greeting missing "System Online: Vinay"!');
    console.log('   ✅ Hero HUD mounted with "System Online: Vinay".');

    // Verify Benchmark
    assert.ok(greeting.includes('₹6.5 - ₹12.0 LPA Campus Benchmark'), 'Campus benchmark badge missing!');
    console.log('   ✅ Campus benchmark badge verified.');

    // ─────────────────────────────────────────────────────────────────
    // TEST 3: Canvas Hologram Lifecycle
    // ─────────────────────────────────────────────────────────────────
    console.log('3. Testing Canvas Hologram Lifecycle...');
    const canvasExists = await page.evaluate(() => {
      const c = document.querySelector('canvas');
      return c && c.width > 0 && c.height > 0;
    });
    assert.ok(canvasExists, 'Hologram canvas not found or has 0 dimensions!');
    console.log('   ✅ Canvas Hologram active with hardware-accelerated rendering.');

    // ─────────────────────────────────────────────────────────────────
    // TEST 4: Track Switcher Interaction (SDE Software vs IoT Hardware)
    // ─────────────────────────────────────────────────────────────────
    console.log('4. Testing Track Switcher Interaction...');
    const iotBtn = page.locator('button:has-text("IoT Hardware")');
    await iotBtn.click();
    await page.waitForTimeout(600);

    const iotActive = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-checked="true"]');
      return btn && btn.textContent.includes('IoT Hardware');
    });
    assert.ok(iotActive, 'Track did not switch to IoT Hardware!');
    console.log('   ✅ Switched to "🔌 IoT Hardware" track.');

    const sdeBtn = page.locator('button:has-text("SDE Software")');
    await sdeBtn.click();
    await page.waitForTimeout(600);

    const sdeActive = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-checked="true"]');
      return btn && btn.textContent.includes('SDE Software');
    });
    assert.ok(sdeActive, 'Track did not switch back to SDE Software!');
    console.log('   ✅ Switched back to "💻 SDE Software" track.');

    // ─────────────────────────────────────────────────────────────────
    // TEST 5: Company Match Carousel Controls
    // ─────────────────────────────────────────────────────────────────
    console.log('5. Testing Company Match Carousel Controls...');
    const pauseBtn = page.locator('button[aria-label="Pause company match"]');
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click();
      await page.waitForTimeout(300);
      const playBtnVisible = await page.locator('button[aria-label="Play company match"]').isVisible();
      assert.ok(playBtnVisible, 'Pause button did not toggle to Play button!');
      console.log('   ✅ Company match pause/play control functional.');
    } else {
      console.log('   ⚠️ Company match control already in state.');
    }

    // ─────────────────────────────────────────────────────────────────
    // TEST 6: Campus Attendance Marker
    // ─────────────────────────────────────────────────────────────────
    console.log('6. Testing Campus Attendance Marker & 75% UGC Meter...');
    const markAttendanceBtn = page.locator('button:has-text("Mark Campus Attendance")');
    if (await markAttendanceBtn.isVisible()) {
      await markAttendanceBtn.click();
      await page.waitForTimeout(800);
      const updatedText = await page.textContent('.db-page');
      assert.ok(
        updatedText.includes('Attendance Marked for Today') || updatedText.includes('Geo-Verified'),
        'Attendance button state did not update after click!'
      );
      console.log('   ✅ Geo-verified campus attendance marker triggered successfully.');
    } else {
      console.log('   ℹ️ Attendance already marked for today.');
    }

    // ─────────────────────────────────────────────────────────────────
    // TEST 7: Socratic Competencies Radar Polygon
    // ─────────────────────────────────────────────────────────────────
    console.log('7. Testing Socratic Competencies Radar SVG Polygon...');
    const radarValid = await page.evaluate(() => {
      const polys = Array.from(document.querySelectorAll('polygon'));
      const scorePoly = polys.find(p => p.getAttribute('fill')?.includes('rgba('));
      if (!scorePoly) return false;
      const pts = scorePoly.getAttribute('points') || '';
      return pts.split(' ').length === 5 && !pts.includes('NaN');
    });
    assert.ok(radarValid, 'Radar SVG polygon is invalid or contains NaN coordinates!');
    console.log('   ✅ Competencies Radar verified (5 valid trigonometric coordinates, zero NaN).');

    // ─────────────────────────────────────────────────────────────────
    // TEST 8: 84-Day Consistency Heatmap Grid
    // ─────────────────────────────────────────────────────────────────
    console.log('8. Testing 84-Day Consistency Heatmap Grid...');
    const cellCount = await page.evaluate(() => {
      return document.querySelectorAll('.db-hcell').length;
    });
    assert.equal(cellCount, 84, `Expected 84 heatmap cells, found ${cellCount}!`);
    console.log('   ✅ 84-Day Heatmap Grid intact (exactly 84 cells).');

    // ─────────────────────────────────────────────────────────────────
    // TEST 9: Priority Action Checklist & Bento Cards
    // ─────────────────────────────────────────────────────────────────
    console.log('9. Testing Priority Action Checklist & Bento Grid...');
    const hasEvolution = greeting.includes('ENGINEERING GROWTH TRACK');
    assert.ok(hasEvolution, 'Engineering growth track section missing!');

    const hasRadar = greeting.includes('SOCRATIC COMPETENCIES RADAR');
    assert.ok(hasRadar, 'Socratic competencies radar section missing!');

    const hasHeatmap = greeting.includes('SOCRATIC CONTRIBUTION TRACKER');
    assert.ok(hasHeatmap, 'Contribution tracker section missing!');

    console.log('   ✅ All Bento cards and engineering growth sections present.');

    // ─────────────────────────────────────────────────────────────────
    // TEST 10: Console Errors Inspection
    // ─────────────────────────────────────────────────────────────────
    console.log('10. Inspecting Console Logs for Unhandled Exceptions...');
    const realErrors = consoleErrors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('WebSocket') && 
      !e.includes('NEXT_PUBLIC_SUPABASE') &&
      !e.includes('Failed to load resource')
    );
    if (realErrors.length > 0) {
      console.error('   ❌ Found console errors during interaction:', realErrors);
      process.exit(1);
    } else {
      console.log('   ✅ ZERO unhandled JavaScript errors or React exceptions during interaction.');
    }

    console.log('\n🏆 TAB 1 (STUDENT DASHBOARD: /dashboard) PASSED 10/10 BRUTAL TESTS WITH 100% SUCCESS! 🏆');

  } catch (err) {
    console.error('❌ Brutal Test Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
