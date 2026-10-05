import { test, expect, type Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const REPO_OUT_DIR = path.resolve('screenshots');
fs.mkdirSync(REPO_OUT_DIR, { recursive: true });

const LOCAL_BRAIN_DIR = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/c7b35c15-f056-4dc6-888b-f56621a809c1/screenshots');
try {
  if (fs.existsSync(path.dirname(LOCAL_BRAIN_DIR))) {
    fs.mkdirSync(LOCAL_BRAIN_DIR, { recursive: true });
  }
} catch {
  // Ignore in environments where brain dir does not exist
}

// Parts keyed strictly by their visual key as required by spec v1.1
const TARGETS = [
  { key: 'python:1:2', name: 'part_1_3', day: 1, title: '1.3 How Python reads your code: line by line' },
  { key: 'python:2:1', name: 'part_2_2', day: 2, title: '2.2 Changing a variable' },
  { key: 'python:3:1', name: 'part_3_2', day: 3, title: '3.2 Length and positions' },
  { key: 'python:3:3', name: 'part_3_4', day: 3, title: '3.4 String tools: upper, lower, strip, replace' },
];

const VIEWPORTS = [
  { label: '1440px', width: 1440, height: 900 },
  { label: '390px', width: 390, height: 844 },
];

const THEMES = ['light', 'dark'];

async function advanceToVisualKey(page: Page, targetKey: string) {
  const targetCol = page.locator(`[data-visual-key="${targetKey}"]`);
  for (let s = 0; s < 10; s++) {
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
  await expect(targetCol.first(), `Visual key ${targetKey} must become visible`).toBeVisible({ timeout: 5000 });
}

test.describe('Lesson Visuals Screenshot Suite (Spec v1.1)', () => {
  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      for (const target of TARGETS) {
        test(`capture ${target.title} (${target.key}) at ${vp.label} in ${theme} mode`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });

          const questId = `python-lecture1-day-${target.day}`;
          await page.goto(`/quests/lesson?questId=${questId}`, { waitUntil: 'load' });

          // Apply theme
          await page.evaluate((t) => {
            document.documentElement.setAttribute('data-theme', t);
            document.documentElement.className = t;
            localStorage.setItem('pc_theme', t);
          }, theme);

          await page.waitForSelector('.lesson-card, .visual-stage-root', { timeout: 15000 });

          // Advance strictly by key, never by slide number
          await advanceToVisualKey(page, target.key);

          // Settle animations
          await page.waitForTimeout(500);

          const filename = `${target.name}_${vp.label}_${theme}.png`;
          const filepath = path.join(REPO_OUT_DIR, filename);

          await page.screenshot({ path: filepath, fullPage: vp.width < 1024 });

          expect(fs.existsSync(filepath), `Screenshot ${filename} must be written`).toBe(true);

          if (fs.existsSync(LOCAL_BRAIN_DIR)) {
            const brainPath = path.join(LOCAL_BRAIN_DIR, filename);
            try {
              fs.copyFileSync(filepath, brainPath);
            } catch {
              // optional local copy
            }
          }
        });
      }
    }
  }
});
