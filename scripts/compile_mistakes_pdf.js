
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Compiling mistakes_during_urgency.pdf via Playwright...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const htmlPath = path.resolve('mistakes_during_urgency.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  
  const targetPdf = path.resolve('mistakes_during_urgency.pdf');
  await page.pdf({
    path: targetPdf,
    format: 'A4',
    margin: { top: '15mm', right: '14mm', bottom: '15mm', left: '14mm' },
    printBackground: true
  });
  console.log('Successfully created: ' + targetPdf);

  // Also save a copy on Desktop for instant accessibility
  try {
    const desktopPdf = 'C:\\Users\\Admin\\Desktop\\mistakes_during_urgency.pdf';
    await page.pdf({
      path: desktopPdf,
      format: 'A4',
      margin: { top: '15mm', right: '14mm', bottom: '15mm', left: '14mm' },
      printBackground: true
    });
    console.log('Successfully copied to Desktop: ' + desktopPdf);
  } catch (err) {
    console.warn('Could not copy to desktop:', err.message);
  }

  await browser.close();
})();
