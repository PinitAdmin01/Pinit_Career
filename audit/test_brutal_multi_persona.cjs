const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('🛡️ MULTI-PERSONA BRUTAL QUALITY & STRESS AUDIT 🛡️\n');
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'Ultra-Compact Mobile (iPhone SE 1st gen)', width: 320, height: 568 },
    { name: 'Standard Android (Samsung Galaxy A/S series)', width: 360, height: 800 },
    { name: 'Modern iPhone (iPhone 14/15/16)', width: 390, height: 844 },
    { name: 'Full HD Desktop Laptop', width: 1440, height: 900 }
  ];

  try {
    // ══════════════════════════════════════════════════════════════
    // PERSONA 3: SKEPTICAL MOBILE/UX DESIGNER AUDIT
    // ══════════════════════════════════════════════════════════════
    console.log('====================================================');
    console.log('🔍 [PERSONA 3] MOBILE/UX DESIGNER: VIEWPORT OVERFLOW & LAYOUT AUDIT');
    console.log('====================================================');

    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();

      await page.goto('http://localhost:3000/university/portfolio/usr_demo_student_01', { waitUntil: 'networkidle' });

      // Check overflow
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        };
      });

      console.log(`   📱 Testing ${vp.name} (${vp.width}x${vp.height}):`);
      console.log(`      clientWidth: ${overflow.clientWidth}px | scrollWidth: ${overflow.scrollWidth}px`);
      assert.strictEqual(overflow.hasOverflow, false, `Overflow detected on ${vp.name}!`);
      console.log(`      ✅ ZERO horizontal overflow.`);

      // Verify Hero card bounding box
      const heroBox = await page.locator('.hero-card').boundingBox();
      assert(heroBox, 'Hero card must exist and be visible');
      assert(heroBox.width <= vp.width, 'Hero card width must not exceed viewport width');

      // Verify Fingerprint Box bounding box
      const fpBox = await page.locator('.fingerprint-box').boundingBox();
      assert(fpBox, 'Fingerprint box must exist');
      assert(fpBox.width <= vp.width, 'Fingerprint box must fit inside viewport');

      await context.close();
    }
    console.log('✅ [PERSONA 3 PASSED] All viewports render flawlessly with 0 horizontal clipping!\n');

    // ══════════════════════════════════════════════════════════════
    // PERSONA 4: FULL-STACK & SYSTEMS ARCHITECT AUDIT
    // ══════════════════════════════════════════════════════════════
    console.log('====================================================');
    console.log('🔍 [PERSONA 4] SYSTEMS ARCHITECT: UNRESTRICTED PUBLIC ACCESS & HYDRATION');
    console.log('====================================================');

    const incognitoContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const incognitoPage = await incognitoContext.newPage();

    const consoleErrors = [];
    incognitoPage.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // 1. Direct deep link into /university/portfolio with a UUID (Recruiter scanning QR code)
    const testUuid = '658a3417-8e3d-4c8c-b80f-b477d7dcbb3c';
    console.log(`   Testing Unauthenticated Visitor accessing /university/portfolio/${testUuid}...`);
    await incognitoPage.goto(`http://localhost:3000/university/portfolio/${testUuid}`, { waitUntil: 'networkidle' });
    
    // Assert NOT redirected to /login
    const currentUrl = incognitoPage.url();
    assert(currentUrl.includes('/university/portfolio/'), 'Public portfolio must NOT redirect unauthenticated visitor to /login');
    console.log(`   ✅ Correctly retained on public portfolio URL: ${currentUrl}`);

    // Verify Title and Metadata
    const pageTitle = await incognitoPage.title();
    assert(pageTitle.includes('Portfolio') || pageTitle.includes('PinIT'), 'Page title should be branded and verifiable');

    // 2. Direct deep link into /verify/[uuid]
    console.log(`   Testing Unauthenticated Visitor accessing /verify/${testUuid}...`);
    await incognitoPage.goto(`http://localhost:3000/verify/${testUuid}`, { waitUntil: 'networkidle' });
    assert(incognitoPage.url().includes(`/verify/${testUuid}`), 'Verification gateway must remain public');
    
    // Verify Action button points to /university/portfolio/[uuid]
    const buttonHref = await incognitoPage.locator('a:has-text("View Verifiable Skill Passport & Portfolio")').getAttribute('href');
    assert.strictEqual(buttonHref, `/university/portfolio/${testUuid}`, 'Verification button must link to portfolio');
    console.log(`   ✅ Action button strictly links to: ${buttonHref}`);

    // 3. Direct deep link into /passport (Public redirect)
    console.log('   Testing Unauthenticated Visitor accessing /passport...');
    await incognitoPage.goto('http://localhost:3000/passport');
    await incognitoPage.waitForFunction(() => window.location.pathname.includes('/university/portfolio/'), { timeout: 10000 });
    console.log(`   ✅ /passport smoothly routed to: ${incognitoPage.url()}`);

    await incognitoContext.close();
    console.log('✅ [PERSONA 4 PASSED] All public gateway routes are accessible and resilient!\n');

    // ══════════════════════════════════════════════════════════════
    // PERSONA 5: BRUTAL QA & END-TO-END FLOW AUDIT
    // ══════════════════════════════════════════════════════════════
    console.log('====================================================');
    console.log('🔍 [PERSONA 5] BRUTAL QA: STUDENT PORTAL -> QR MODAL -> LIVE PREVIEW FLOW');
    console.log('====================================================');

    const authContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const authPage = await authContext.newPage();

    // 1. One-click demo login
    console.log('   1. Authenticating via One-Click Demo Access...');
    await authPage.goto('http://localhost:3000/login');
    await authPage.locator('button:has-text("Launch Student Demo")').click();
    await authPage.waitForURL('**/dashboard', { timeout: 15000 });
    console.log('   ✅ Successfully logged in as Vinay.');

    // 2. Navigate to /quests
    console.log('   2. Navigating to /quests...');
    await authPage.goto('http://localhost:3000/quests', { waitUntil: 'networkidle' });
    
    // 3. Open QR modal
    console.log('   3. Opening Share & Verify (QR) modal...');
    const shareQrBtn = authPage.locator('button:has-text("Share & Verify (QR)")').first();
    await shareQrBtn.click();
    await authPage.locator('[data-testid="qr-modal"]').waitFor({ state: 'visible', timeout: 5000 });
    console.log('   ✅ QR Modal opened successfully.');

    // Verify QR SVG and Links
    const qrSvg = await authPage.locator('[data-testid="qr-modal"] svg').count();
    assert(qrSvg >= 1, 'QR code SVG must be rendered inside modal');
    
    const previewBtn = authPage.locator('[data-testid="btn-open-public-portfolio"]');
    const previewHref = await previewBtn.getAttribute('href');
    console.log(`   Found "Open Public Skill Passport ↗" button pointing to: ${previewHref}`);
    assert(previewHref.includes('/university/portfolio/'), 'Preview button must point to /university/portfolio/');

    // Click "Copy Verification URL"
    await authPage.locator('[data-testid="btn-copy-verify-url"]').click();
    const copyConfirmText = await authPage.locator('[data-testid="btn-copy-verify-url"]').textContent();
    assert(copyConfirmText.includes('Copied'), 'Copy button must show copied confirmation');
    console.log('   ✅ Copy Verification URL button verified interactive.');

    // Close QR modal
    await authPage.locator('[data-testid="btn-close-qr-modal"]').click();
    await authPage.locator('[data-testid="qr-modal"]').waitFor({ state: 'hidden', timeout: 5000 });
    console.log('   ✅ QR Modal closes smoothly.');

    await authContext.close();
    console.log('✅ [PERSONA 5 PASSED] Full end-to-end QR issuance and preview flow passed 100%!\n');

    console.log('══════════════════════════════════════════════════════════════');
    console.log('🏆 3RD, 4TH, AND 5TH PERSON AUDITS PASSED WITH FLYING COLORS! 🏆');
    console.log('══════════════════════════════════════════════════════════════');
  } finally {
    await browser.close();
  }
})();
