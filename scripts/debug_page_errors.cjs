const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err.message));

  // Log in
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

  console.log('--- Navigating to /quests ---');
  await page.goto('http://localhost:3000/quests', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  console.log('Quests URL:', page.url());

  console.log('--- Navigating to /verify/usr_demo_student_01 ---');
  await page.goto('http://localhost:3000/verify/usr_demo_student_01', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  console.log('Verify URL:', page.url());
  await page.screenshot({ path: 'demo_screenshots/verify_student_page_ready.png' });

  await browser.close();
})();
