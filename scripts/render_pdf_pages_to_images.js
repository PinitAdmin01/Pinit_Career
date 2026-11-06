const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
  
  const htmlPath = path.join(__dirname, 'tri_branch_collision_treaty.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  
  const pageElements = await page.$$('.page');
  console.log('Found .page elements:', pageElements.length);
  
  for (let i = 0; i < pageElements.length; i++) {
    const outPng = path.join(__dirname, `treaty_page_${i + 1}.png`);
    await pageElements[i].screenshot({ path: outPng });
    console.log(`Saved page ${i + 1} screenshot to: ${outPng}`);
  }
  
  await browser.close();
})();
