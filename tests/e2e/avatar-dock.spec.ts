import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 390, height: 844, name: '390px mobile' },
  { width: 1280, height: 800, name: '1280px small desktop' },
  { width: 1440, height: 900, name: '1440px desktop' },
  { width: 1920, height: 1080, name: '1920px large desktop' },
];

const DAYS = [
  { day: 1, keys: ['python:1:0', 'python:1:1', 'python:1:2', 'python:1:3', 'python:1:4', 'python:1:5'] },
  { day: 2, keys: ['python:2:0', 'python:2:1', 'python:2:2', 'python:2:3', 'python:2:4', 'python:2:5'] },
  { day: 3, keys: ['python:3:0', 'python:3:1', 'python:3:2', 'python:3:3', 'python:3:4', 'python:3:5'] },
];

test.describe('Teacher Avatar Docking & Overlap Prevention - All 18 Parts (Spec v1.1)', () => {
  for (const vp of VIEWPORTS) {
    for (const d of DAYS) {
      test(`Day ${d.day} all 6 parts: avatar never overlaps buttons at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`/quests/lesson?questId=python-lecture1-day-${d.day}&testMode=true`, { waitUntil: 'load' });

        await page.waitForSelector('.lesson-card, .lesson-nav-bar', { timeout: 15000 });

        for (const key of d.keys) {
          // Advance strictly clicking the next button and verifying its visibility
          const nextBtn = page.locator('button[data-testid="btn-next-slide"]');
          await expect(nextBtn, `Next Slide button must be visible to advance to ${key}`).toBeVisible({ timeout: 5000 });
          await nextBtn.click();
          await page.waitForTimeout(300);

          // Assert the expected data-visual-key is on screen before check
          const visualEl = page.locator(`[data-visual-key="${key}"]`);
          await expect(visualEl, `Expected data-visual-key="${key}" must be on screen`).toBeVisible({ timeout: 5000 });

          // Avatar check
          const avatar = page.locator('[data-testid="teacher-avatar-dock"]');
          await expect(avatar).toBeVisible({ timeout: 5000 });

          const avatarBox = await avatar.boundingBox();
          expect(avatarBox, `Avatar bounding box must exist for ${key}`).not.toBeNull();
          if (!avatarBox) return;

          expect(avatarBox.width).toBeGreaterThan(0);
          expect(avatarBox.height).toBeGreaterThan(0);

          // Find all buttons and links visible on screen
          const interactiveElements = page.locator('button:visible, a:visible');
          const count = await interactiveElements.count();

          for (let i = 0; i < count; i++) {
            const el = interactiveElements.nth(i);

            // Skip if element is inside the avatar frame itself
            const isInsideAvatar = await avatar.evaluate((av, target) => av.contains(target as Node), await el.elementHandle());
            if (isInsideAvatar) continue;

            const box = await el.boundingBox();
            if (!box || box.width === 0 || box.height === 0) continue;

            // Check geometric overlap
            const overlaps = !(
              box.x + box.width <= avatarBox.x ||
              box.x >= avatarBox.x + avatarBox.width ||
              box.y + box.height <= avatarBox.y ||
              box.y >= avatarBox.y + avatarBox.height
            );

            const text = (await el.innerText().catch(() => '')) || (await el.getAttribute('aria-label')) || `Element #${i}`;
            expect(
              overlaps,
              `Interactive element "${text.trim()}" overlaps teacher avatar at ${key} (${vp.name})`
            ).toBe(false);
          }
        }
      });
    }
  }
});
