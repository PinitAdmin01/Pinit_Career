import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { width: 390, height: 844, name: '390px mobile' },
  { width: 1280, height: 800, name: '1280px small desktop' },
  { width: 1440, height: 900, name: '1440px desktop' },
  { width: 1920, height: 1080, name: '1920px large desktop' },
];

test.describe('Teacher Avatar Docking & Overlap Prevention (Spec v1.1)', () => {
  for (const vp of VIEWPORTS) {
    test(`avatar does not overlap any button or link at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/quests/lesson?questId=python-lecture1-day-1', { waitUntil: 'load' });

      // Wait for lesson container to load
      await page.waitForSelector('.lesson-card, .lesson-nav-bar', { timeout: 15000 });

      // Check on initial slide and advance one slide to test active teaching slide
      for (const slideStep of [0, 1]) {
        if (slideStep > 0) {
          const nextBtn = page.locator('button[data-testid="btn-next-slide"]');
          if (await nextBtn.isVisible()) {
            await nextBtn.click();
            await page.waitForTimeout(400);
          }
        }

        const avatar = page.locator('[data-testid="teacher-avatar-dock"]');
        await expect(avatar).toBeVisible({ timeout: 5000 });

        const avatarBox = await avatar.boundingBox();
        expect(avatarBox, 'Avatar bounding box must exist').not.toBeNull();
        if (!avatarBox) return;

        expect(avatarBox.width).toBeGreaterThan(0);
        expect(avatarBox.height).toBeGreaterThan(0);

        // Find all buttons and links on the page
        const interactiveElements = page.locator('button:visible, a:visible');
        const count = await interactiveElements.count();

        for (let i = 0; i < count; i++) {
          const el = interactiveElements.nth(i);

          // Skip if the element is part of the avatar itself
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
            `Interactive element "${text.trim()}" overlaps the teacher avatar at viewport ${vp.name} on slide step ${slideStep}`
          ).toBe(false);
        }
      }
    });
  }
});
