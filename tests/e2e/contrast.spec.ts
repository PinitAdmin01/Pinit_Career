import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const THEMES = ['light', 'dark'];

const DAYS = [
  { day: 1, keys: ['python:1:0', 'python:1:1', 'python:1:2', 'python:1:3', 'python:1:4', 'python:1:5'] },
  { day: 2, keys: ['python:2:0', 'python:2:1', 'python:2:2', 'python:2:3', 'python:2:4', 'python:2:5'] },
  { day: 3, keys: ['python:3:0', 'python:3:1', 'python:3:2', 'python:3:3', 'python:3:4', 'python:3:5'] },
];

test.describe('Theme Colours & Axe-Core Contrast - All 18 Parts (Spec v1.1)', () => {
  for (const theme of THEMES) {
    for (const d of DAYS) {
      test(`Day ${d.day} all 6 parts pass WCAG color contrast in ${theme} mode`, async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto(`/quests/lesson?questId=python-lecture1-day-${d.day}&testMode=true`, { waitUntil: 'load' });

        await page.waitForSelector('.lesson-card, .lesson-nav-bar', { timeout: 15000 });

        // Apply theme
        await page.evaluate((t) => {
          document.documentElement.setAttribute('data-theme', t);
          document.documentElement.className = t;
          localStorage.setItem('pc_theme', t);
        }, theme);

        await page.waitForTimeout(300);

        for (const key of d.keys) {
          // Advance strictly via next button
          const nextBtn = page.locator('button[data-testid="btn-next-slide"]');
          await expect(nextBtn, `Next Slide button must be visible to advance to ${key}`).toBeVisible({ timeout: 5000 });
          await nextBtn.click();
          await page.waitForTimeout(300);

          // Assert the expected data-visual-key is on screen before contrast check
          const visualEl = page.locator(`[data-visual-key="${key}"]`);
          await expect(visualEl, `Expected data-visual-key="${key}" must be on screen`).toBeVisible({ timeout: 5000 });

          // Settle any CSS transitions
          await page.waitForTimeout(200);

          // Analyze color-contrast on the lesson card container
          const results = await new AxeBuilder({ page })
            .include('.lesson-card')
            .withRules(['color-contrast'])
            .analyze();

          const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');
          expect(
            contrastViolations,
            `Found color contrast violations at ${key} in ${theme} mode: ${JSON.stringify(contrastViolations.map(v => v.nodes.map(n => n.target)), null, 2)}`
          ).toEqual([]);
        }
      });
    }
  }
});
