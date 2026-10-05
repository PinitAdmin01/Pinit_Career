import { chromium } from '@playwright/test';
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

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';

  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });

      const page = await context.newPage();

      for (const target of TARGETS) {
        const questId = `python-lecture1-day-${target.day}`;
        const url = `${baseURL}/quests/lesson?questId=${questId}`;
        console.log(`Capturing ${target.title} (${target.key}) [${vp.label}, ${theme}]...`);

        await page.goto(url, { waitUntil: 'load' });

        // Set theme attributes on HTML root
        await page.evaluate((t) => {
          document.documentElement.setAttribute('data-theme', t);
          document.documentElement.className = t;
          localStorage.setItem('pc_theme', t);
        }, theme);

        // Wait for lesson content to load
        await page.waitForSelector('.lesson-card, .visual-stage-root', { timeout: 15000 });

        // Advance until the target visual key is visible
        let found = false;
        for (let s = 0; s < 10; s++) {
          const currentKey = await page.evaluate(() => {
            const el = document.querySelector('[data-visual-key]');
            return el ? el.getAttribute('data-visual-key') : null;
          });
          if (currentKey === target.key) {
            found = true;
            break;
          }
          const nextBtn = page.locator('button[data-testid="btn-next-slide"]');
          if (await nextBtn.isVisible()) {
            await nextBtn.click();
            await page.waitForTimeout(400);
          } else {
            break;
          }
        }

        if (!found) {
          throw new Error(`Failed to find target visual key ${target.key} on day ${target.day}`);
        }

        // Wait for visual stage to settle
        await page.waitForTimeout(500);

        const filename = `${target.name}_${vp.label}_${theme}.png`;
        const filepath = path.join(REPO_OUT_DIR, filename);

        await page.screenshot({ path: filepath, fullPage: vp.width < 1024 });
        console.log(`Saved screenshot: ${filepath}`);

        if (fs.existsSync(LOCAL_BRAIN_DIR)) {
          const brainPath = path.join(LOCAL_BRAIN_DIR, filename);
          try {
            fs.copyFileSync(filepath, brainPath);
          } catch {
            // local brain copy optional
          }
        }
      }

      await context.close();
    }
  }

  await browser.close();
  console.log('All 16 screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
