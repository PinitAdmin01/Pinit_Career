const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

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

    const onboarding = {
      role: 'Full Stack Engineer',
      hasCompleted: true,
      targetRole: 'Full Stack Engineer',
      yearOfStudy: '3rd Year'
    };
    localStorage.setItem(`pinit_${uid}_onboarding_answers`, JSON.stringify(onboarding));
    localStorage.setItem(`pinit_${uid}_onboarding_step`, '4');
    localStorage.setItem(`pinit_${uid}_xp`, '450');
    localStorage.setItem(`pinit_${uid}_pins`, '120');
    localStorage.setItem(`pinit_${uid}_streak`, '3');
  }, { uid, demoProfile });

  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Take top view
  await page.screenshot({ path: 'demo_screenshots/dash_top.png' });

  // Scroll main.page-content by 800px
  await page.evaluate(() => {
    const main = document.querySelector('main.page-content');
    if (main) main.scrollTop = 700;
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'demo_screenshots/dash_middle.png' });

  // Scroll main.page-content by 1500px
  await page.evaluate(() => {
    const main = document.querySelector('main.page-content');
    if (main) main.scrollTop = 1500;
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'demo_screenshots/dash_bottom.png' });

  console.log('Screenshots saved properly!');
  await browser.close();
})();
