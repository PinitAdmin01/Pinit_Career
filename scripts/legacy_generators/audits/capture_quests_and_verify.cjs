const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  // 1. Log in
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

  // 2. Open /verify/usr_demo_student_01 and wait for verification response
  console.log('Navigating to /verify/usr_demo_student_01...');
  await page.goto('http://localhost:3000/verify/usr_demo_student_01', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('text=AUTHENTIC VERIFIED CREDENTIAL', { timeout: 15000 });
  await page.screenshot({ path: 'demo_screenshots/verify_student_page_ready.png' });
  console.log('Saved verify_student_page_ready.png');

  // 3. Open /quests and wait for drawer
  console.log('Navigating to /quests...');
  await page.goto('http://localhost:3000/quests', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid="track-selector-drawer"]', { timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'demo_screenshots/quests_view_live.png' });
  console.log('Saved quests_view_live.png');

  // 4. Click Enroll button to open Split Checkout Modal
  const enrollBtn = page.locator('button', { hasText: /Enroll Now|Unlock Accelerated|Get Access|Enroll in/i });
  if (await enrollBtn.count() > 0) {
    await enrollBtn.first().click();
    await page.waitForSelector('[data-testid="crash-checkout-modal"]', { timeout: 5000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'demo_screenshots/checkout_modal_split.png' });
    console.log('Saved checkout_modal_split.png');

    // Close checkout
    const closeBtn = page.locator('[data-testid="btn-close-checkout"]');
    if (await closeBtn.count() > 0) {
      await closeBtn.first().click();
      await page.waitForTimeout(600);
    }
  }

  // 5. Click QR button to open QR Modal
  const qrBtn = page.locator('button', { hasText: /Share & Verify \(QR\)|Share.*QR|Verifiable QR|QR/i });
  if (await qrBtn.count() > 0) {
    await qrBtn.first().click();
    await page.waitForSelector('[data-testid="qr-modal"]', { timeout: 5000 });
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'demo_screenshots/qr_modal_live.png' });
    console.log('Saved qr_modal_live.png');
  }

  console.log('Done capturing all Task 4, 5 & 6 live proofs!');
  await browser.close();
})();
