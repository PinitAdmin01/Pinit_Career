import { test, expect } from '@playwright/test';

const MOBILE_VIEWPORTS = [
  { width: 360, height: 740, name: '360px small mobile' },
  { width: 390, height: 844, name: '390px mobile' },
  { width: 768, height: 1024, name: '768px tablet' },
];

const DAYS = [
  { day: 1, keys: ['python:1:0', 'python:1:1', 'python:1:2', 'python:1:3', 'python:1:4', 'python:1:5'] },
  { day: 2, keys: ['python:2:0', 'python:2:1', 'python:2:2', 'python:2:3', 'python:2:4', 'python:2:5'] },
  { day: 3, keys: ['python:3:0', 'python:3:1', 'python:3:2', 'python:3:3', 'python:3:4', 'python:3:5'] },
];

test.describe('Mobile-First Layout & Responsiveness - All 18 Parts (Spec v1.1)', () => {
  for (const vp of MOBILE_VIEWPORTS) {
    for (const d of DAYS) {
      test(`Day ${d.day} all 6 parts: no horizontal scroll & min 80px text at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`/quests/lesson?questId=python-lecture1-day-${d.day}&testMode=true`, { waitUntil: 'load' });

        await page.waitForSelector('.lesson-card', { timeout: 15000 });

        for (const key of d.keys) {
          // Advance strictly via next button
          const nextBtn = page.locator('button[data-testid="btn-next-slide"]');
          await expect(nextBtn, `Next Slide button must be visible to advance to ${key}`).toBeVisible({ timeout: 5000 });
          await nextBtn.click();
          await page.waitForTimeout(300);

          // Assert the expected data-visual-key is on screen before checking
          const visualEl = page.locator(`[data-visual-key="${key}"]`);
          await expect(visualEl, `Expected data-visual-key="${key}" must be on screen`).toBeVisible({ timeout: 5000 });

          // 1. Check for horizontal overflow (no sideways scrolling)
          const overflowCheck = await page.evaluate(() => {
            const doc = document.documentElement;
            const body = document.body;
            return {
              docScrollWidth: doc.scrollWidth,
              docClientWidth: doc.clientWidth,
              bodyScrollWidth: body.scrollWidth,
              bodyClientWidth: body.clientWidth,
              windowWidth: window.innerWidth,
            };
          });

          // Allowed max 1px tolerance for sub-pixel browser layout rounding
          expect(
            overflowCheck.docScrollWidth,
            `Page document has horizontal scroll at ${key} (scrollWidth: ${overflowCheck.docScrollWidth}, window: ${overflowCheck.windowWidth}) at ${vp.name}`
          ).toBeLessThanOrEqual(overflowCheck.windowWidth + 1);

          expect(
            overflowCheck.bodyScrollWidth,
            `Page body has horizontal scroll at ${key} (scrollWidth: ${overflowCheck.bodyScrollWidth}, window: ${overflowCheck.windowWidth}) at ${vp.name}`
          ).toBeLessThanOrEqual(overflowCheck.windowWidth + 1);

          // 2. Check that no text box or cell is narrower than 80px
          const textBoxes = page.locator('.visual-table-cell, .visual-stage-caption, .lesson-nav-btn');
          const boxCount = await textBoxes.count();
          if (boxCount > 0) {
            for (let i = 0; i < boxCount; i++) {
              const el = textBoxes.nth(i);
              if (await el.isVisible()) {
                const b = await el.boundingBox();
                if (b && b.width > 0) {
                  expect(
                    b.width,
                    `Text container #${i} width (${b.width}px) is less than 80px at ${key} (${vp.name})`
                  ).toBeGreaterThanOrEqual(79.5);
                }
              }
            }
          }

          // 3. For table visual under 480px (e.g. python:1:2), tables must become stacked cards
          if (vp.width < 480 && key === 'python:1:2') {
            const tableHeader = page.locator('.visual-table-header');
            if (await tableHeader.count() > 0) {
              await expect(tableHeader).toBeHidden();
            }
            const cellLabels = page.locator('.visual-table-cell-label');
            if (await cellLabels.count() > 0) {
              expect(await cellLabels.first().isVisible()).toBe(true);
            }
          }

          // 4. Verify one-column layout under 1024px
          const isOneColumn = await page.evaluate(() => {
            const container = document.querySelector('.interactive-container');
            if (!container) return false;
            const style = window.getComputedStyle(container);
            return style.display === 'flex' && style.flexDirection === 'column';
          });
          expect(isOneColumn, `interactive-container must be flex-direction: column under 1024px at ${key} (${vp.name})`).toBe(true);
        }
      });
    }
  }
});
