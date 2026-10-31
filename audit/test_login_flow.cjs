const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  
  await page.fill('input[placeholder*="Email"], input[type="text"]', 'student');
  await page.fill('input[type="password"]', 'demo1234');
  await page.click('button:has-text("Sign In")');
  await page.waitForTimeout(2500);

  console.log('URL AFTER SUBMIT:', page.url());
  const errorAlert = await page.locator('div:has-text("⚠️")').textContent().catch(() => null);
  console.log('ERROR ALERT:', errorAlert);

  await browser.close();
})();
