const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  // Log in as student
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  const uid = 'usr_demo_student_01';
  const demoProfile = {
    id: uid,
    uid: uid,
    email: 'student@pinit.in',
    username: 'student',
    role: 'student',
    displayName: 'Aditya Sharma',
    full_name: 'Aditya Sharma',
    isDevUser: true
  };

  await page.evaluate(({ uid, demoProfile }) => {
    localStorage.setItem('pinit_current_user', JSON.stringify(demoProfile));
    localStorage.setItem(`pinit_${uid}_profile`, JSON.stringify(demoProfile));
    localStorage.setItem('pinit_onboarding_completed', 'true');
    localStorage.setItem(`pinit_${uid}_onboarding_completed`, 'true');

    const onboarding = {
      role: 'Full Stack Engineer',
      hasCompleted: true,
      targetRole: 'Full Stack Engineer',
      yearOfStudy: '3rd Year'
    };
    localStorage.setItem(`pinit_${uid}_onboarding_answers`, JSON.stringify(onboarding));
    localStorage.setItem(`pinit_${uid}_onboarding_step`, '4');
    localStorage.setItem(`pinit_${uid}_pins`, '150');
    localStorage.setItem(`pinit_${uid}_bonus_pins`, '50');
  }, { uid, demoProfile });

  // Navigate to /quests
  await page.goto('http://localhost:3000/quests', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Capture Sub-tab 1 (Certificate track view)
  await page.screenshot({ path: 'demo_screenshots/quests_subtab1_view.png' });

  // 2. Open Enroll / Checkout Modal by clicking an enroll button
  const enrollBtn = page.locator('button', { hasText: /Enroll Now|Unlock Accelerated|Get Access|Enroll in/i });
  if (await enrollBtn.count() > 0) {
    await enrollBtn.first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'demo_screenshots/checkout_modal_split.png' });

    // Close checkout modal
    const closeBtn = page.locator('[data-testid="btn-close-checkout"]');
    if (await closeBtn.count() > 0) {
      await closeBtn.first().click();
      await page.waitForTimeout(600);
    }
  }

  // 3. Open QR Modal
  const qrBtn = page.locator('button', { hasText: /Share & Verify \(QR\)|Share.*QR|Verifiable QR/i });
  if (await qrBtn.count() > 0) {
    await qrBtn.first().click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'demo_screenshots/qr_modal.png' });

    // Close QR modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  // 4. Navigate directly to /verify/usr_demo_student_01 to verify receiver view
  await page.goto('http://localhost:3000/verify/usr_demo_student_01', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo_screenshots/verify_student_page.png' });

  console.log('Course and QR screenshots captured successfully!');
  await browser.close();
})();
