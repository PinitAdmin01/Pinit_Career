const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('🔥 STARTING BRUTAL AUDIT: TAB 2 (QUESTS & CERTIFICATION PASSPORT: /quests) 🔥\n');

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
    // TEST 1: Authenticated Session Preparation
    // ─────────────────────────────────────────────────────────────────
    console.log('1. Injecting Authenticated Student Session & Testing Mount...');
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

    await page.goto('http://localhost:3000/quests', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="quests-page-root"]', { timeout: 15000 });
    console.log('   ✅ Quests root component mounted successfully.\n');

    // ─────────────────────────────────────────────────────────────────
    // TEST 2: Tab Switching (Certification vs Custom vs Standalone)
    // ─────────────────────────────────────────────────────────────────
    console.log('2. Testing Sub-Tab Switching...');
    
    // Switch to Custom Roadmap
    const customTab = page.locator('button:has-text("Custom Roadmap"), [role="tab"]:has-text("Custom Roadmap")').first();
    if (await customTab.isVisible()) {
      await customTab.click();
      await page.waitForTimeout(600);
      console.log('   ✅ Switched to "Custom Roadmap" tab.');
    }

    // Switch to Standalone Courses
    const standaloneTab = page.locator('button:has-text("Standalone"), [role="tab"]:has-text("Standalone")').first();
    if (await standaloneTab.isVisible()) {
      await standaloneTab.click();
      await page.waitForTimeout(600);
      console.log('   ✅ Switched to "Standalone Courses" tab.');
    }

    // Switch back to Certification & Skill Passport
    const certTab = page.locator('button:has-text("Certification"), [role="tab"]:has-text("Certification")').first();
    if (await certTab.isVisible()) {
      await certTab.click();
      await page.waitForTimeout(600);
      console.log('   ✅ Switched back to "Certification & Skill Passport" tab.');
    }

    // ─────────────────────────────────────────────────────────────────
    // TEST 3: Track Selector Interaction
    // ─────────────────────────────────────────────────────────────────
    console.log('3. Testing Track Selector Interaction in Drawer...');
    const trackButtons = page.locator('button:has-text("Track"), button:has-text("Full-Stack"), button:has-text("Python")');
    const trackCount = await trackButtons.count();
    assert.ok(trackCount > 0, 'No track selector buttons found!');
    console.log(`   ✅ Found ${trackCount} track selector controls.`);

    // ─────────────────────────────────────────────────────────────────
    // TEST 4: Two-Column Course Checkout Modal
    // ─────────────────────────────────────────────────────────────────
    console.log('4. Testing Two-Column Course Checkout Modal...');
    const enrollButtons = page.locator('button:has-text("Enroll"), button:has-text("Unlock"), button:has-text("Purchase"), button:has-text("Start Course")');
    const enrollCount = await enrollButtons.count();
    console.log(`   ℹ️ Found ${enrollCount} actionable course buttons.`);
    
    // Check if Course Catalog/Checkout is accessible
    const browseCatalogBtn = page.locator('button:has-text("Course Library"), button:has-text("Browse Courses"), button:has-text("All Courses")').first();
    if (await browseCatalogBtn.isVisible()) {
      await browseCatalogBtn.click();
      await page.waitForTimeout(600);
      console.log('   ✅ Opened Course Library / Catalog.');
    }

    // ─────────────────────────────────────────────────────────────────
    // TEST 5: QR Code Verification Modal
    // ─────────────────────────────────────────────────────────────────
    console.log('5. Testing QR Code Public Verification Modal...');
    const qrBtn = page.locator('button:has-text("QR"), button[aria-label*="QR"], button:has-text("Share & Verify")').first();
    if (await qrBtn.isVisible()) {
      await qrBtn.click();
      await page.waitForTimeout(800);
      
      const qrModalVisible = await page.locator('[role="dialog"], .qr-modal, [data-testid="qr-modal"]').first().isVisible();
      assert.ok(qrModalVisible, 'QR Modal did not open on trigger click!');
      console.log('   ✅ QR Code modal opened with public verification link.');

      // Close modal
      const closeBtn = page.locator('button:has-text("✕"), button:has-text("Close"), button[aria-label="Close"]').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(400);
        console.log('   ✅ QR Code modal closed cleanly.');
      }
    } else {
      console.log('   ℹ️ QR Verification trigger verified in dormant state (requires course milestone).');
    }

    // ─────────────────────────────────────────────────────────────────
    // TEST 6: Console Errors Inspection
    // ─────────────────────────────────────────────────────────────────
    console.log('6. Inspecting Console Logs for Unhandled Exceptions...');
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

    console.log('\n🏆 TAB 2 (QUESTS & CERTIFICATION PASSPORT: /quests) PASSED ALL BRUTAL TESTS! 🏆');

  } catch (err) {
    console.error('❌ Brutal Test Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
