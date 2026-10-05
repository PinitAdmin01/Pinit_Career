import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const THEMES = ['light', 'dark'];

test.describe('Theme Colours & Axe-Core Contrast Verification', () => {
  for (const theme of THEMES) {
    test(`lesson page passes WCAG color contrast in ${theme} mode`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/quests/lesson?questId=python-lecture1-day-1', { waitUntil: 'load' });

      await page.waitForSelector('.lesson-card, .lesson-nav-bar', { timeout: 15000 });

      // Apply theme
      await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        document.documentElement.className = t;
        localStorage.setItem('pc_theme', t);
      }, theme);

      await page.waitForTimeout(500);

      // Analyze color-contrast on the lesson card container
      const results = await new AxeBuilder({ page })
        .include('.lesson-card')
        .withRules(['color-contrast'])
        .analyze();

      const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');
      expect(
        contrastViolations,
        `Found ${contrastViolations.length} color contrast violations in ${theme} mode: ${JSON.stringify(contrastViolations.map(v => v.nodes.map(n => n.target)), null, 2)}`
      ).toEqual([]);
    });
  }
});
