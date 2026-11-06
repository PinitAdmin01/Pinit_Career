const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3000/login');
  const uid = 'usr_demo_student_01';
  const demoProfile = { id: uid, uid: uid, email: 'student@pinit.in', role: 'student', displayName: 'Aditya' };
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
  }, { uid, demoProfile });
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(2000);

  const scrollInfo = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const scrollables = all
      .filter(el => el.scrollHeight > el.clientHeight && el.clientHeight > 200)
      .map(el => ({ tag: el.tagName, className: String(el.className), id: el.id, scrollH: el.scrollHeight, clientH: el.clientHeight }));
    return {
      url: window.location.href,
      windowH: window.innerHeight,
      docH: document.documentElement.scrollHeight,
      bodyH: document.body.scrollHeight,
      scrollables
    };
  });
  console.log('Scroll Info on Dashboard:', JSON.stringify(scrollInfo, null, 2));
  await browser.close();
})();
