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
    localStorage.setItem(`pinit_${uid}_pins`, '120');
    localStorage.setItem(`pinit_${uid}_bonus_pins`, '50');
  }, { uid, demoProfile });

  // Navigate to /pins
  await page.goto('http://localhost:3000/pins', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Capture Buy / Chota Recharges tab
  await page.screenshot({ path: 'demo_screenshots/pins_tab1_buy.png' });

  // 2. Click Calculator Tab
  const calcBtn = page.locator('button', { hasText: 'Calculator' });
  if (await calcBtn.count() > 0) {
    await calcBtn.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'demo_screenshots/pins_tab2_calculator.png' });
  }

  // 3. Click Free Daily Path Tab
  const freeBtn = page.locator('button', { hasText: 'Free Daily Path' });
  if (await freeBtn.count() > 0) {
    await freeBtn.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'demo_screenshots/pins_tab3_free_path.png' });
  }

  // 4. Click Wallet Tab
  const walletBtn = page.locator('button', { hasText: 'Wallet' });
  if (await walletBtn.count() > 0) {
    await walletBtn.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'demo_screenshots/pins_tab4_wallet.png' });
  }

  console.log('All Pins screenshots captured successfully!');
  await browser.close();
})();
