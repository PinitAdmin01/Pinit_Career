import { test, expect, type Page } from '@playwright/test';

const MOBILE_VIEWPORTS = [
  { width: 360, height: 740, name: '360px small mobile' },
  { width: 390, height: 844, name: '390px mobile' },
  { width: 768, height: 1024, name: '768px tablet' },
];

async function advanceToVisualKey(page: Page, targetKey: string) {
  const targetCol = page.locator(`[data-visual-key="${targetKey}"]`);
  for (let i = 0; i < 8; i++) {
    if (await targetCol.count() > 0 && await targetCol.first().isVisible()) {
      return;
    }
    const nextBtn = page.locator('button[data-testid="btn-next-slide"]');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(350);
    } else {
      break;
    }
  }
}

test.describe('Mobile-First Layout & Responsiveness (Spec v1.1)', () => {
  for (const vp of MOBILE_VIEWPORTS) {
    test(`no sideways scrolling, text boxes >= 80px, and tables stacked under 480px at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/quests/lesson?questId=python-lecture1-day-1', { waitUntil: 'load' });

      await page.waitForSelector('.lesson-card', { timeout: 15000 });

      // Navigate to Part 1.3 (key python:1:2, table visual)
      await advanceToVisualKey(page, 'python:1:2');

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
        `Page document has horizontal scroll (scrollWidth: ${overflowCheck.docScrollWidth}, window: ${overflowCheck.windowWidth}) at ${vp.name}`
      ).toBeLessThanOrEqual(overflowCheck.windowWidth + 1);

      expect(
        overflowCheck.bodyScrollWidth,
        `Page body has horizontal scroll (scrollWidth: ${overflowCheck.bodyScrollWidth}, window: ${overflowCheck.windowWidth}) at ${vp.name}`
      ).toBeLessThanOrEqual(overflowCheck.windowWidth + 1);

      // 2. Check that no text box or cell is narrower than 80px
      const textBoxes = page.locator('.visual-table-cell, .visual-stage-caption, .lesson-nav-btn');
      const boxCount = await textBoxes.count();
      expect(boxCount).toBeGreaterThan(0);

      for (let i = 0; i < boxCount; i++) {
        const el = textBoxes.nth(i);
        if (await el.isVisible()) {
          const b = await el.boundingBox();
          if (b && b.width > 0) {
            expect(
              b.width,
              `Text container #${i} width (${b.width}px) is less than 80px at ${vp.name}`
            ).toBeGreaterThanOrEqual(79.5);
          }
        }
      }

      // 3. For viewports under 480px (360px and 390px), table must become stacked cards
      if (vp.width < 480) {
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
      expect(isOneColumn, `interactive-container must be flex-direction: column under 1024px at ${vp.name}`).toBe(true);
    });
  }
});
