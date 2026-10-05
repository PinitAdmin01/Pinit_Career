import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/c7b35c15-f056-4dc6-888b-f56621a809c1/screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

const TARGETS = [
  { name: 'part_1_3', day: 1, targetSlide: 2, title: 'Day 1 Part 3: line by line' },
  { name: 'part_2_2', day: 2, targetSlide: 1, title: 'Day 2 Part 2: variables and change' },
  { name: 'part_3_2', day: 3, targetSlide: 1, title: 'Day 3 Part 2: character positions' },
  { name: 'part_3_4', day: 3, targetSlide: 3, title: 'Day 3 Part 4: string tools' },
];

const VIEWPORTS = [
  { label: '1440px', width: 1440, height: 900 },
  { label: '390px', width: 390, height: 844 },
];

const THEMES = ['light', 'dark'];

async function capture() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  for (const vp of VIEWPORTS) {
    for (const theme of THEMES) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        colorScheme: theme,
      });

      const page = await context.newPage();
      page.on('console', msg => console.log('PAGE LOG:', msg.text()));
      page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

      for (const target of TARGETS) {
        const questId = `python-lecture1-day-${target.day}`;
        const url = `http://localhost:3000/quests/lesson?questId=${questId}`;
        console.log(`Navigating to ${target.name} [${vp.label}, ${theme}]...`);

        await page.goto(url, { waitUntil: 'load' });

        // Set theme attributes on HTML root
        await page.evaluate((t) => {
          document.documentElement.setAttribute('data-theme', t);
          document.documentElement.className = t;
          localStorage.setItem('pc_theme', t);
        }, theme);

        // Wait for lesson content to load
        try {
          await page.waitForSelector('.lesson-card, .visual-stage-root', { timeout: 10000 });
        } catch (e) {
          console.log('Current URL on timeout:', page.url());
          const bodyText = await page.evaluate(() => document.body.innerText);
          console.log('Body text on timeout:', bodyText);
          await page.screenshot({ path: path.join(OUT_DIR, 'debug_timeout.png') });
          throw e;
        }

        // Navigate to target slide if needed
        for (let s = 0; s < target.targetSlide; s++) {
          await page.evaluate(() => {
            const btn = document.querySelector('button[data-testid="btn-next-slide"]');
            if (btn) btn.click();
          });
          await page.waitForTimeout(500);
        }

        // Wait for visual stage to settle
        await page.waitForTimeout(500);

        const filename = `${target.name}_${vp.label}_${theme}.png`;
        const filepath = path.join(OUT_DIR, filename);

        await page.screenshot({ path: filepath, fullPage: vp.width < 1024 });
        console.log(`Saved screenshot: ${filename}`);
      }

      await context.close();
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
